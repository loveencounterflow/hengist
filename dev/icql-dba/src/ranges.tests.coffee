
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse


#-----------------------------------------------------------------------------------------------------------
@[ "DBA: ranges (1)" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  E                 = require '../../../apps/icql-dba/lib/errors'
  dba               = new Dba()
  cid_from_chr      = ( chr ) -> chr.codePointAt 0
  chr_from_cid      = ( cid ) -> String.fromCodePoint cid
  dba.create_function name: 'chr_from_cid', call: chr_from_cid
  first_cid         = cid_from_chr 'A'
  last_cid          = cid_from_chr 'Z'
  #.........................................................................................................
  dba.create_table_function
    name:         'generate_series'
    columns:      [ 'n', ]
    parameters:   [ 'start', 'stop', 'step', ]
    rows: ( start, stop, step = null ) ->
      step ?= 1
      n     = start
      loop
        break if n > stop
        yield [ n, ]
        n += step
      return null
  #.........................................................................................................
  dba.execute SQL"""
    create table settings ( setting text unique not null primary key );
    create table css_ranges (
        nr      integer not null primary key,
        cid_lo  integer not null,
        cid_hi  integer not null,
        chr_lo  text generated always as ( chr_from_cid( cid_lo ) ) virtual not null,
        chr_hi  text generated always as ( chr_from_cid( cid_hi ) ) virtual not null,
        setting text    not null references settings ( setting ) );
    create index cidlohi_idx on css_ranges ( cid_lo, cid_hi );
    create index cidhi_idx on   css_ranges ( cid_hi );
    """
  #.........................................................................................................
  dba.execute SQL"""
    create view settings_by_id as
      with
      v1 as ( select min( cid_lo ) as first_cid from css_ranges ),
      v2 as ( select max( cid_hi ) as last_cid  from css_ranges )
      select
        r1.n                      as cid,
        chr_from_cid( r1.n )      as chr,
        r2.nr                     as nr,
        r2.cid_lo                 as cid_lo,
        r2.cid_hi                 as cid_hi,
        r2.chr_lo                 as chr_lo,
        r2.chr_hi                 as chr_hi,
        r2.setting                as setting
      from
        v1,
        v2,
        generate_series( v1.first_cid, v2.last_cid ) as r1
        left join css_ranges as r2 on ( r1.n between r2.cid_lo and r2.cid_hi )
      order by r1.n, r2.nr
      ;
    """
  #.........................................................................................................
  settings_from_cid = ( cid ) ->
    R   = []
    sql = SQL"""
      select
          setting
        from css_ranges
        where $cid between cid_lo and cid_hi
        order by nr desc;"""
    R.push row.setting for row from dba.query sql, { cid, }
    return R
  dba.create_function name: 'settings_from_cid', call: settings_from_cid
  #.........................................................................................................
  setting_from_cid = ( cid ) ->
    sql = SQL"""
      select
          setting
        from css_ranges
        where $cid between cid_lo and cid_hi
        order by nr desc
        limit 1;"""
    return dba.first_value dba.query sql, { cid, }
  dba.create_function name: 'setting_from_cid', call: setting_from_cid
  #.........................................................................................................
  insert_setting = SQL"""
    insert into settings ( setting )
      values ( $setting )
      on conflict ( setting ) do nothing;"""
  insert_range = SQL"""
    insert into css_ranges ( nr, cid_lo, cid_hi, setting )
      values ( $nr, $cid_lo, $cid_hi, $setting )"""
  rules = [
    [ '=font:superset', 'A..Z',               ]
    [ '=font:font1',    'B..H, J, L, N..X',   ]
    [ '=font:font2',    'B..D',               ]
    [ '=font:font3',    'G..I',               ]
    [ '=font:font4',    'M..Q',               ]
    [ '=font:font5',    'M, O..T',            ]
    [ '=font:font6',    'M, U, X..Y',         ]
    [ '+shape:pointy',  'A, V',               ]
    [ '+shape:crossed', 'X',                  ]
    [ '+shape:laddar',  'A, H',               ]
    ]
  nr = 0
  for [ setting, ranges, ] in rules
    dba.run insert_setting, { setting, }
    for [ chr_lo, chr_hi, ] in ranges
      chr_hi ?= chr_lo
      cid_lo  = cid_from_chr chr_lo
      cid_hi  = cid_from_chr chr_hi
      nr++
      dba.run insert_range, { nr, setting, cid_lo, cid_hi, }
  #.........................................................................................................
  console.table dba.list dba.query SQL"""
    select
        nr                      as nr,
        setting                 as setting,
        chr_lo                  as chr_lo,
        chr_hi                  as chr_hi
      from css_ranges
      order by nr;"""
  console.table dba.list dba.query SQL"""select * from settings order by setting;"""
  console.table dba.list dba.query SQL"""select * from settings_by_id;"""
  #.........................................................................................................
  for cid in [ first_cid .. last_cid ]
    chr       = String.fromCodePoint cid
    settings  = settings_from_cid cid
    setting   = setting_from_cid cid
    info ( CND.gold chr ), ( CND.lime setting ), ( CND.blue settings )
  done?() #..................................................................................................
  #   sql     = SQL"select $:col_a, $:col_b where $:col_b in $V:choices"
  #   d       = { col_a: 'foo', col_b: 'bar', choices: [ 1, 2, 3, ], }
  #   result  = dba.sql.interpolate sql, d
  #   info '^23867^', result
  #   T.eq result, """select "foo", "bar" where "bar" in ( 1, 2, 3 )"""
  # do => #...................................................................................................
  #   sql     = SQL"select ?:, ?: where ?: in ?V:"
  #   d       = [ 'foo', 'bar', 'bar', [ 1, 2, 3, ], ]
  #   result  = dba.sql.interpolate sql, d
  #   info '^23867^', result
  #   T.eq result, """select "foo", "bar" where "bar" in ( 1, 2, 3 )"""
  # T.throws /unknown interpolation format 'X'/, => #.........................................................
  #   sql     = SQL"select ?:, ?X: where ?: in ?V:"
  #   d       = [ 'foo', 'bar', 'bar', [ 1, 2, 3, ], ]
  #   result  = dba.sql.interpolate sql, d



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: ranges (1)" ]
  @[ "DBA: ranges (1)" ]()




###
# from https://github.com/loveencounterflow/hengist/tree/master/dev/kitty-font-config-writer-kfcw

superset          ABCDEFGHIJKLMNOPQRSTUVWXYZ  │ CSS-like Configuration with Overlapping Ranges
————————————————— ——————————————————————————  ——————————————————————————————————————————————————————————————
font1             BCDEFGH J L NOPQRSTUVWX    │ [B-H] [J] [L] [N-X]                      ◮ least precedence
font2             BCD                        │ [B-D]                                    │
font3                  GHI                   │ [G-I]                                    │
font4                        MNOPQ           │ [M-Q]                                    │
font5                        M OPQRST        │ [M] [O-T]                                │
font6                        M       U  XY   │ [M] [U] [X-Y]                            │ most precedence
###




