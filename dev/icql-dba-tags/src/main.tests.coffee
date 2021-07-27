
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA-TAGS/TESTS'
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


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
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
  { Dbatags, }  = require '../../../apps/icql-dba-tags'
  dbatags       = new Dbatags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = dbatags.tags_from_tagchain probe
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: add_tag with value" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  get_tags = ( dbatags ) ->
    R = []
    for row from dbatags.dba.query "select * from t_tags;"
      # row.value = jp row.value
      R.push row
    return R
  #.........................................................................................................
  probes_and_matchers = [
    [ { tag: 'foo',                        },  [ { tag: 'foo',          value: 'true',    } ], ]
    [ { tag: 'foo', value: 'abc',          },  [ { tag: 'foo',          value: '"abc"',   } ], ]
    [ { tag: 'font', value: 'font1',       },  [ { tag: 'font',         value: '"font1"', } ], ]
    [ { tag: 'rounded', value: false,      },  [ { tag: 'rounded',      value: 'false',   } ], ]
    [ { tag: 'shape/ladder',               },  [ { tag: 'shape/ladder', value: 'true',    } ], ]
    ]
  { Dbatags, }  = require '../../../apps/icql-dba-tags'
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      dbatags = new Dbatags()
      dbatags.add_tag probe
      result  = get_tags dbatags
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: add_tagged_range" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Dbatags, }  = require '../../../apps/icql-dba-tags'
  prefix        = 't_'
  #.........................................................................................................
  get_tagged_ranges = ( dtags ) ->
    R = []
    for row from dtags.dba.query SQL"select * from t_tagged_ranges order by lo, hi, tag;"
      row.value = jp row.value
      R.push row
    return R
  #.........................................................................................................
  probes_and_matchers = [
    [ { lo: 1, hi: 11,  mode: '+', tag: 'foo',                        },  [ { nr: 1, lo: 1, hi: 11, tag: 'foo', value: true, } ], ]
    [ { lo: 2, hi: 12,  mode: '+', tag: 'foo', value: 'abc',          },  [ { nr: 1, lo: 2, hi: 12, tag: 'foo', value: 'abc', } ], ]
    [ { lo: 5, hi: 15,  mode: '+', tag: 'font', value: 'font1',       },  [ { nr: 1, lo: 5, hi: 15, tag: 'font', value: 'font1', } ], ]
    [ { lo: 6, hi: 16,  mode: '-', tag: 'rounded',                    },  [ { nr: 1, lo: 6, hi: 16, tag: 'rounded', value: false, } ],                      ]
    [ { lo: 7, hi: 17,  mode: '+', tag: 'shape/ladder',               },  [ { nr: 1, lo: 7, hi: 17, tag: 'shape/ladder', value: true, } ],                      ]
    ]
  dtags       = new Dbatags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      dtags   = new Dbatags { prefix, }
      dtags.add_tag probe
      dtags.add_tagged_range probe
      result  = get_tagged_ranges dtags
      resolve result
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: caching (1)" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  { Dba }           = require '../../../apps/icql-dba'
  E                 = require '../../../apps/icql-dba/lib/errors'
  prefix            = 't_'
  dba               = new Dba()
  dbatags           = new Dbatags { dba, prefix, }
  #.........................................................................................................
  get_tagged_ranges = -> dba.list dba.query SQL"select * from t_tagged_ranges order by lo, hi, tag;"
  get_cache         = -> dba.list dba.query SQL"select * from t_tagged_cids_cache order by cid, tag;"
  #.........................................................................................................
  do =>
    dbatags.add_tag { tag: 'first', }
    dbatags.add_tagged_range { tag: 'first', lo: 10, hi: 20, }
    debug '^4487^', get_tagged_ranges()
    debug '^4487^', get_cache()
    T.eq get_tagged_ranges(), [ { nr: 1, lo: 10, hi: 20, tag: 'first' } ]
    T.eq get_cache(),         []
    debug '^4487^', get_cache()
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
  for [ tag, ranges, ] in rules
    dbatags.add_tag { tag, }
    for { lo, hi, } in NCR.parse_multirange_declaration ranges
      dbatags.add_tagged_range { tag, lo, hi, }
  #.........................................................................................................
  console.table dba.list dba.query SQL"""
    select
        nr                      as nr,
        tag                     as tag,
        chr_from_cid( lo )      as chr_lo,
        chr_from_cid( hi )      as chr_hi
      from #{prefix}tagged_ranges
      order by nr;"""
  console.table dba.list dba.query SQL"""select * from #{prefix}tags order by tag;"""
  # console.table dba.list dba.query SQL"""select * from #{prefix}tags_by_cid order by tag, cid, nr;"""
  #.........................................................................................................
  for cid in [ first_cid .. last_cid ]
    chr       = String.fromCodePoint cid
    tags      = dbatags.tags_from_tagchain dbatags.tagchain_from_cid { cid, }
    info ( CND.gold chr ), ( CND.blue tags )
    for tag, value of tags
      value = JSON.stringify value
      dba.run SQL"""
        insert into #{prefix}tagged_cids_cache ( cid, tag, value )
          values ( $cid, $tag, $value );""", { cid, tag, value, }
  console.table dba.list dba.query SQL"""select * from #{prefix}tagged_cids_cache order by cid, tag;"""
  # console.table dba.list dba.query SQL"""select #{prefix}tags_from_cid( $cid );""", { cid: 65, }
  done?() #..................................................................................................



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: ranges (1)" ]
  # test @[ "tags: tags_from_tagchain" ]
  # test @[ "tags: add_tagged_range" ]
  test @[ "tags: add_tag with value" ]
  # @[ "DBA: ranges (1)" ]()
  # test @[ "tags: caching (1)" ]




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




