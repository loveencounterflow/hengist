
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


#===========================================================================================================
class Tags
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
TAGS = new Tags()


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
@[ "TAGS: tags_from_tagchain" ] = ( T, done ) ->
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
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = TAGS.tags_from_tagchain probe
      resolve result
  #.........................................................................................................
  done?()

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
    create table tags ( tag text unique not null primary key );
    create table tagged_cid_ranges (
        nr      integer not null primary key,
        cid_lo  integer not null,
        cid_hi  integer not null,
        chr_lo  text generated always as ( chr_from_cid( cid_lo ) ) virtual not null,
        chr_hi  text generated always as ( chr_from_cid( cid_hi ) ) virtual not null,
        tag     text    not null references tags ( tag ) );
    create index cidlohi_idx on tagged_cid_ranges ( cid_lo, cid_hi );
    create index cidhi_idx on   tagged_cid_ranges ( cid_hi );
    create table tagged_cids (
        cid     integer not null,
        chr     text    not null,
        tag     text    not null,
        value   json    not null,
      primary key ( cid, tag ) );
    """
  #.........................................................................................................
  dba.execute SQL"""
    create view tags_by_id as
      with
      v1 as ( select min( cid_lo ) as first_cid from tagged_cid_ranges ),
      v2 as ( select max( cid_hi ) as last_cid  from tagged_cid_ranges )
      select
        r1.n                      as cid,
        chr_from_cid( r1.n )      as chr,
        r2.nr                     as nr,
        r2.cid_lo                 as cid_lo,
        r2.cid_hi                 as cid_hi,
        r2.chr_lo                 as chr_lo,
        r2.chr_hi                 as chr_hi,
        r2.tag                    as tag
      from
        v1,
        v2,
        generate_series( v1.first_cid, v2.last_cid ) as r1
        left join tagged_cid_ranges as r2 on ( r1.n between r2.cid_lo and r2.cid_hi )
      order by r1.n, r2.nr
      ;
    """
  #.........................................................................................................
  tags_from_cid = ( cid ) ->
    R   = []
    sql = SQL"""
      select
          tag
        from tagged_cid_ranges
        where $cid between cid_lo and cid_hi
        order by nr asc;"""
    R.push row.tag for row from dba.query sql, { cid, }
    return R
  dba.create_function name: 'tags_from_cid', call: tags_from_cid
  #.........................................................................................................
  tag_from_cid = ( cid ) ->
    sql = SQL"""
      select
          tag
        from tagged_cid_ranges
        where $cid between cid_lo and cid_hi
        order by nr desc
        limit 1;"""
    return dba.first_value dba.query sql, { cid, }
  dba.create_function name: 'tag_from_cid', call: tag_from_cid
  #.........................................................................................................
  insert_tag = SQL"""
    insert into tags ( tag )
      values ( $tag )
      on conflict ( tag ) do nothing;"""
  insert_range = SQL"""
    insert into tagged_cid_ranges ( nr, cid_lo, cid_hi, tag )
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
        chr_lo                  as chr_lo,
        chr_hi                  as chr_hi
      from tagged_cid_ranges
      order by nr;"""
  console.table dba.list dba.query SQL"""select * from tags order by tag;"""
  console.table dba.list dba.query SQL"""select * from tags_by_id order by tag, cid, nr;"""
  #.........................................................................................................
  for cid in [ first_cid .. last_cid ]
    chr       = String.fromCodePoint cid
    tags      = TAGS.tags_from_tagchain tags_from_cid cid
    info ( CND.gold chr ), ( CND.blue tags )
    for tag, value of tags
      value = JSON.stringify value
      dba.run SQL"""
        insert into tagged_cids ( cid, chr, tag, value )
          values ( $cid, $chr, $tag, $value );""", { cid, chr, tag, value, }
  console.table dba.list dba.query SQL"""select * from tagged_cids order by cid, tag;"""
  done?() #..................................................................................................



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: ranges (1)" ]
  # test @[ "TAGS: tags_from_tagchain" ]
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




