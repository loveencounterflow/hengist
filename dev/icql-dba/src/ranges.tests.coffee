
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
dba_path                  = '../../../apps/icql-dba'
{ lets
  freeze }                = require 'letsfreezethat'


#===========================================================================================================
types.declare 'tags_constructor_cfg', tests:
  '@isa.object x':        ( x ) -> @isa.object x
  'x.prefix is a prefix': ( x ) ->
    return false unless @isa.text x.prefix
    return true if x.prefix is ''
    return ( /^[_a-z][_a-z0-9]*$/ ).test x.prefix

#-----------------------------------------------------------------------------------------------------------
types.defaults =
  tags_constructor_cfg:
    dba:        null
    prefix:     't_'


#===========================================================================================================
class Dbatags
  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    validate.tags_constructor_cfg @cfg = { types.defaults.tags_constructor_cfg..., cfg..., }
    if @cfg.dba?
      @dba  = @cfg.dba
      delete @cfg.dba
    else
      @dba  = new ( require dba_path ).Dba()
    @cfg = freeze @cfg
    @_create_db_structure()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _create_db_structure: ->
    x = @cfg.prefix
    @dba.execute SQL"""
      create table if not exists #{x}tags ( tag text unique not null primary key );
      create table if not exists #{x}tagged_cid_ranges (
          nr      integer not null primary key,
          cid_lo  integer not null,
          cid_hi  integer not null,
          -- chr_lo  text generated always as ( chr_from_cid( cid_lo ) ) virtual not null,
          -- chr_hi  text generated always as ( chr_from_cid( cid_hi ) ) virtual not null,
          tag     text    not null references #{x}tags ( tag ) );
      create index if not exists #{x}cidlohi_idx on #{x}tagged_cid_ranges ( cid_lo, cid_hi );
      create index if not exists #{x}cidhi_idx on   #{x}tagged_cid_ranges ( cid_hi );
      create table if not exists #{x}tagged_cids (
          cid     integer not null,
          -- chr     text    not null,
          tag     text    not null,
          value   json    not null,
        primary key ( cid, tag ) );
      """
    return null

  #---------------------------------------------------------------------------------------------------------
  tag_pattern: ///
    ^
    (?<mode>  [ - + ] )
    (?<key>   [ a-z A-Z _ \/ \$ ] [ - a-z A-Z 0-9 _ \/ \$ ]* )
    ( : (?<value> [^ - + ]+ | ' .* ' | " .* " ) )?
    $
    ///

  #---------------------------------------------------------------------------------------------------------
  tags_from_tagchain: ( tagchain ) ->
    validate_list_of.text tagchain
    R = {}
    return R if tagchain.length is 0
    for tag_expression in tagchain
      unless ( match = tag_expression.match @tag_pattern )?
        throw new Error "^tags_from_tagchain@448^ tag expression not recognized: #{rpr tag_expression}"
      # debug '^9458^', match
      { mode, key, value, }   = match.groups
      switch mode
        when '+'
          unless value?                       then value = true
          else if value[ 0 ] in [ '"', "'", ] then value = value[ 1 ... value.length - 1 ]
          R[ key ] = value
        when '-'
          delete R[ key ]
    return R


#===========================================================================================================
class Ncr
  # constructor: ->
  #---------------------------------------------------------------------------------------------------------
  parse_multirange_declaration: ( range_declaration ) ->
    validate.text range_declaration
    R = []
    return R if range_declaration is ''
    for part in range_declaration.split /,\s+/
      if ( match = part.match /^(?<lo>.+)\.\.(?<hi>.+)/ )?
        lo  = match.groups.lo.codePointAt 0
        hi  = match.groups.hi.codePointAt 0
      else
        validate.chr part
        lo = hi = part.codePointAt 0
      R.push { lo, hi, }
    return R
NCR = new Ncr()


############################################################################################################
@[ "tags: tags_from_tagchain" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '+foo',                             ],  { foo: true,          }, ]
    [ [ '+foo:abc',                         ],  { foo: 'abc',         }, ]
    [ [ '+font:superset',                   ],  { font: 'superset',   }, ]
    [ [ '+font:font1',                      ],  { font: 'font1',      }, ]
    [ [ '+font:"font1"',                    ],  { font: 'font1',      }, ]
    [ [ "+font:'font1'",                    ],  { font: 'font1',      }, ]
    [ [ '+font:font1',  '+font:Arial'       ],  { font: 'Arial',      }, ]
    [ [ '+rounded', '-rounded',             ],  {},                      ]
    [ [ '+shape/ladder', '+shape/pointy',   ],  { 'shape/ladder': true, 'shape/pointy': true, },                      ]
    ]
  dbatags = new Dbatags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = dbatags.tags_from_tagchain probe
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: ranges (1)" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  E                 = require '../../../apps/icql-dba/lib/errors'
  prefix            = 't_'
  dba               = new Dba()
  dbatags           = new Dbatags { dba, prefix, }
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
  # #.........................................................................................................
  # dba.execute SQL"""
  #   create view tags_by_id as
  #     with
  #     v1 as ( select min( cid_lo ) as first_cid from tagged_cid_ranges ),
  #     v2 as ( select max( cid_hi ) as last_cid  from tagged_cid_ranges )
  #     select
  #       r1.n                      as cid,
  #       chr_from_cid( r1.n )      as chr,
  #       r2.nr                     as nr,
  #       r2.cid_lo                 as cid_lo,
  #       r2.cid_hi                 as cid_hi,
  #       -- r2.chr_lo                 as chr_lo,
  #       -- r2.chr_hi                 as chr_hi,
  #       r2.tag                    as tag
  #     from
  #       v1,
  #       v2,
  #       generate_series( v1.first_cid, v2.last_cid ) as r1
  #       left join tagged_cid_ranges as r2 on ( r1.n between r2.cid_lo and r2.cid_hi )
  #     order by r1.n, r2.nr
  #     ;
  #   """
  #.........................................................................................................
  tags_from_cid = ( cid ) ->
    R   = []
    sql = SQL"""
      select
          tag
        from #{prefix}tagged_cid_ranges
        where $cid between cid_lo and cid_hi
        order by nr asc;"""
    R.push row.tag for row from dba.query sql, { cid, }
    return R
  dba.create_function name: "#{prefix}tags_from_cid", call: tags_from_cid
  #.........................................................................................................
  insert_tag = SQL"""
    insert into #{prefix}tags ( tag )
      values ( $tag )
      on conflict ( tag ) do nothing;"""
  insert_range = SQL"""
    insert into #{prefix}tagged_cid_ranges ( nr, cid_lo, cid_hi, tag )
      values ( $nr, $cid_lo, $cid_hi, $tag )"""
  rules = [
    # [ '+superset',      'A..Z',               ]
    [ '+font:fallback', 'A..Z',               ]
    # [ '+script:latin',  'A..Z',               ]
    [ '+font:font1',    'B..H, J, L, N..X',   ]
    [ '+font:font2',    'B..D',               ]
    [ '+font:font3',    'G..I',               ]
    [ '+font:font4',    'M..Q',               ]
    [ '+font:font5',    'M, O..T',            ]
    [ '+font:font6',    'M, U, X..Y',         ]
    [ '+vowel',         'A, E, I, O, U',      ]
    [ '+shape/pointy',  'A, V',               ]
    [ '+shape/crossed', 'X',                  ]
    [ '+shape/ladder',  'A, H',               ]
    ]
  nr = 0
  for [ tag, ranges, ] in rules
    dba.run insert_tag, { tag, }
    for { lo: cid_lo, hi: cid_hi, } in NCR.parse_multirange_declaration ranges
      nr++
      dba.run insert_range, { nr, tag, cid_lo, cid_hi, }
  #.........................................................................................................
  console.table dba.list dba.query SQL"""
    select
        nr                      as nr,
        tag                     as tag,
        chr_from_cid( cid_lo )  as chr_lo,
        chr_from_cid( cid_hi )  as chr_hi
      from #{prefix}tagged_cid_ranges
      order by nr;"""
  console.table dba.list dba.query SQL"""select * from #{prefix}tags order by tag;"""
  # console.table dba.list dba.query SQL"""select * from #{prefix}tags_by_id order by tag, cid, nr;"""
  #.........................................................................................................
  for cid in [ first_cid .. last_cid ]
    chr       = String.fromCodePoint cid
    tags      = dbatags.tags_from_tagchain tags_from_cid cid
    info ( CND.gold chr ), ( CND.blue tags )
    for tag, value of tags
      value = JSON.stringify value
      dba.run SQL"""
        insert into #{prefix}tagged_cids ( cid, tag, value )
          values ( $cid, $tag, $value );""", { cid, tag, value, }
  console.table dba.list dba.query SQL"""select * from #{prefix}tagged_cids order by cid, tag;"""
  done?() #..................................................................................................



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: ranges (1)" ]
  # test @[ "tags: tags_from_tagchain" ]
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




