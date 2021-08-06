
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
  validate_list_of
  equals }                = types.export()
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse
dba_path                  = '../../../apps/icql-dba'
{ lets
  freeze }                = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
add_sql_functions = ( dba ) ->

  #=========================================================================================================
  R =

    #-------------------------------------------------------------------------------------------------------
    walk_pattern_matches: ( text, pattern ) ->
      regex = new RegExp pattern, 'g'
      while ( match = regex.exec text )?
        yield [ match[ 0 ], match[ 1 ], ]
      return null

    #-------------------------------------------------------------------------------------------------------
    generate_series: ( start, stop, step = null ) ->
      # stop ?= start
      debug '^3334^', @
      step ?= 1
      n     = start
      loop
        break if n > stop
        # if n %% 2 is 0 then yield [ "*#{n}*", ]
        # else                yield [ n, ]
        yield [ n, ]
        n += step
      return null

  #.........................................................................................................
  R[ k ] = v.bind R for k, v of R
  #.........................................................................................................
  dba.create_table_function
    name:         'generate_series'
    columns:      [ 'n', ]
    parameters:   [ 'start', 'stop', 'step', ]
    rows:         R.generate_series
  #.........................................................................................................
  dba.create_table_function
    name:         're_matches'
    columns:      [ 'match', 'capture', ]
    parameters:   [ 'text', 'pattern', ]
    rows:         R.walk_pattern_matches
  #.........................................................................................................
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


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ "tags: tags_from_tagexchain" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '+foo',                             ],  { foo: true,          }, ]
    [ [ '+foo:"abc"',                       ],  { foo: 'abc',         }, ]
    [ [ '+font:"superset"',                 ],  { font: 'superset',   }, ]
    [ [ '+font:"font1"',                    ],  { font: 'font1',      }, ]
    [ [ '+font:"font1"',  '+font:"Arial"',  ],  { font: 'Arial',      }, ]
    [ [ '+rounded', '-rounded',             ],  {},                      ]
    [ [ '+shape/ladder', '+shape/pointy',   ],  { 'shape/ladder': true, 'shape/pointy': true, }, ]
    ]
  { Dtags, }  = require '../../../apps/icql-dba-tags'
  dtags       = new Dtags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = dtags.tags_from_tagexchain { tagexchain: probe, }
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: add_tag with value" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  get_tags = ( dtags ) ->
    R = []
    for row from dtags.dba.query "select * from t_tags;"
      # row.value = jp row.value
      R.push row
    return R
  #.........................................................................................................
  probes_and_matchers = [
    [ { tag: 'foo',                        },  [ { nr: 1, tag: 'foo',          value: 'false',    } ], ]
    [ { tag: 'foo', value: 'abc',          },  [ { nr: 1, tag: 'foo',          value: '"abc"',   } ], ]
    [ { tag: 'font', value: 'font1',       },  [ { nr: 1, tag: 'font',         value: '"font1"', } ], ]
    [ { tag: 'rounded', value: false,      },  [ { nr: 1, tag: 'rounded',      value: 'false',   } ], ]
    [ { tag: 'shape/ladder',               },  [ { nr: 1, tag: 'shape/ladder', value: 'false',    } ], ]
    ]
  { Dtags, }  = require '../../../apps/icql-dba-tags'
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      dtags = new Dtags()
      dtags.add_tag probe
      result  = get_tags dtags
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: parse_tagex" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = [
    [ { tagex: '+foo',                          },  { mode: '+', tag: 'foo', value: true,    }, ]
    [ { tagex: '-foo',                          },  { mode: '-', tag: 'foo', value: false,    }, ]
    [ { tagex: '+shape/excentricity:0.2',       },  { mode: '+', tag: 'shape/excentricity', value: 0.2,    }, ]
    [ { tagex: '+css/font-family:"Helvetica"',  },  { mode: '+', tag: 'css/font-family', value: 'Helvetica',    }, ]
    [ { tagex: '-css/font-family:"Helvetica"',  },  null, "Dtags_subtractive_value", ]
    [ { tagex: '*bar',                          },  null, "Dtags_invalid_tagex", ]
    [ { tagex: '+bar:blah',                     },  null, "Dtags_illegal_tagex_value_literal", ]
    ]
  { Dtags, }  = require '../../../apps/icql-dba-tags'
  dtags       = new Dtags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = dtags.parse_tagex probe
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: fallbacks" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }  = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  add_some_tags_and_ranges = ( dtags ) ->
    dtags.add_tag { tag: 'foo', value: true, }
    dtags.add_tag { tag: 'bar', value: false, }
    dtags.add_tag { tag: 'baz', value: 42, }
    dtags.add_tagged_range { lo: 10, hi: 10, tag: 'foo', }
    dtags.add_tagged_range { lo: 11, hi: 11, mode: '-', tag: 'foo', }
    dtags.add_tagged_range { lo: 12, hi: 12, tag: 'bar', }
    dtags.add_tagged_range { lo: 13, hi: 13, mode: '-', tag: 'bar', }
    dtags.add_tagged_range { lo: 14, hi: 14, tag: 'baz', value: 108, }
    dtags.add_tagged_range { lo: 15, hi: 15, mode: '-', tag: 'baz', }
    return null
  do => #...................................................................................................
    dtags = new Dtags(); add_some_tags_and_ranges dtags
    T.eq dtags.get_fallbacks(), { foo: true, bar: false, baz: 42 }
    T.eq dtags.get_filtered_fallbacks(), {}
    T.eq ( dtags.tags_from_id { id: 10, } ), { foo: true }
    T.eq ( dtags.tags_from_id { id: 11, } ), {}
    T.eq ( dtags.tags_from_id { id: 12, } ), { bar: true }
    T.eq ( dtags.tags_from_id { id: 13, } ), {}
    T.eq ( dtags.tags_from_id { id: 14, } ), { baz: 108 }
    T.eq ( dtags.tags_from_id { id: 15, } ), {}
  do => #...................................................................................................
    dtags = new Dtags { fallbacks: true, }; add_some_tags_and_ranges dtags
    T.eq dtags.get_fallbacks(), { foo: true, bar: false, baz: 42 }
    T.eq dtags.get_filtered_fallbacks(), { foo: true, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 10, } ), { foo: true, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 11, } ), { foo: true, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 12, } ), { foo: true, baz: 42, bar: true }
    T.eq ( dtags.tags_from_id { id: 13, } ), { foo: true, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 14, } ), { foo: true, baz: 108 }
    T.eq ( dtags.tags_from_id { id: 15, } ), { foo: true, baz: 42 }
  do => #...................................................................................................
    dtags = new Dtags { fallbacks: 'all', }; add_some_tags_and_ranges dtags
    T.eq dtags.get_fallbacks(), { foo: true, bar: false, baz: 42 }
    T.eq dtags.get_filtered_fallbacks(), { foo: true, bar: false, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 10, } ), { foo: true, bar: false, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 11, } ), { foo: true, bar: false, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 12, } ), { foo: true, bar: true, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 13, } ), { foo: true, bar: false, baz: 42 }
    T.eq ( dtags.tags_from_id { id: 14, } ), { foo: true, bar: false, baz: 108 }
    T.eq ( dtags.tags_from_id { id: 15, } ), { foo: true, bar: false, baz: 42 }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: add_tagged_range" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Dtags, }  = require '../../../apps/icql-dba-tags'
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
    [ { lo: 1, hi: 11,  mode: '+', tag: 'foo',                        },  [ { nr: 1, lo: 1, hi: 11, mode: '+', tag: 'foo', value: true, } ], ]
    [ { lo: 2, hi: 12,  mode: '+', tag: 'foo', value: 'abc',          },  [ { nr: 1, lo: 2, hi: 12, mode: '+', tag: 'foo', value: 'abc', } ], ]
    [ { lo: 5, hi: 15,  mode: '+', tag: 'font', value: 'font1',       },  [ { nr: 1, lo: 5, hi: 15, mode: '+', tag: 'font', value: 'font1', } ], ]
    [ { lo: 6, hi: 16,  mode: '-', tag: 'rounded',                    },  [ { nr: 1, lo: 6, hi: 16, mode: '-', tag: 'rounded', value: false, } ],                      ]
    [ { lo: 7, hi: 17,  mode: '+', tag: 'shape/ladder',               },  [ { nr: 1, lo: 7, hi: 17, mode: '+', tag: 'shape/ladder', value: true, } ],                      ]
    ]
  dtags       = new Dtags()
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      dtags   = new Dtags { prefix, }
      dtags.add_tag probe
      dtags.add_tagged_range probe
      result  = get_tagged_ranges dtags
      resolve result
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: caching (1)" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Dba }           = require '../../../apps/icql-dba'
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  # E                 = require '../../../apps/icql-dba/lib/errors'
  prefix            = 't_'
  dba               = new Dba()
  dtags             = new Dtags { dba, prefix, }
  #.........................................................................................................
  get_tagged_ranges = -> dba.list dba.query SQL"select * from t_tagged_ranges order by nr;"
  # get_tagchain      = ( id ) -> dba.list dba.query SQL"""
  #   select mode, tag, value from t_tagged_ranges where $id between lo and hi order by nr asc;""", { id, }
  #.........................................................................................................
  do =>
    dtags.add_tag { tag: 'first', }
    dtags.add_tag { tag: 'second', }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 20, tag: 'first',  }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 15, tag: 'second', }
    dtags.add_tagged_range { mode: '-', lo: 12, hi: 12, tag: 'second', }
    T.eq get_tagged_ranges(), [
      { nr: 1, lo: 10, hi: 20, mode: '+', tag: 'first', value: 'true' },
      { nr: 2, lo: 10, hi: 15, mode: '+', tag: 'second', value: 'true' },
      { nr: 3, lo: 12, hi: 12, mode: '-', tag: 'second', value: 'false' } ]
    T.eq ( dtags.tagchain_from_id { id: 10, } ), [
      { nr: 1, mode: '+', tag: 'first', value: true },
      { nr: 2, mode: '+', tag: 'second', value: true }, ]
    T.eq ( dtags.tagchain_from_id { id: 12, } ), [
      { nr: 1, mode: '+', tag: 'first', value: true },
      { nr: 2, mode: '+', tag: 'second', value: true },
      { nr: 3, mode: '-', tag: 'second', value: false } ]
    T.eq ( dtags.tagchain_from_id { id: 16, } ), [
      { nr: 1, mode: '+', tag: 'first', value: true } ]
    T.eq ( dtags.tags_from_id { id: 10, } ), { first: true, second: true }
    T.eq ( dtags.tags_from_id { id: 12, } ), { first: true, }
    T.eq ( dtags.tags_from_id { id: 16, } ), { first: true }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: caching with empty values" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  prefix            = 'theprefix_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  #.........................................................................................................
  get_tagged_ranges = -> dtags.dba.list dtags.dba.query SQL"select * from #{prefix}tagged_ranges order by nr;"
  #.........................................................................................................
  do =>
    dtags.add_tag { tag: 'first', }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 10, tag: 'first',  }
    T.eq get_tagged_ranges(), [
      { nr: 1, lo: 10, hi: 10, mode: '+', tag: 'first', value: 'true' }, ]
    T.eq ( dtags.tagchain_from_id { id: 10, } ), [
      { nr: 1, mode: '+', tag: 'first', value: true }, ]
    T.eq ( dtags.tagchain_from_id { id: 11, } ), []
    T.eq ( dtags.tags_from_id { id: 10, } ), { first: true, }
    T.eq ( dtags.tags_from_id { id: 11, } ), {}
    console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ranges order by lo, hi, nr;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
_add_tagged_ranges = ( dtags ) ->
  rules = [
    # [ '+superset',      'A..Z',               ]
    # [ '+font:"fallback"', 'A..Z',               ]
    # [ '+script:"latin"',  'A..Z',               ]
    [ '+font:"font1"',                  'B..H, J, L, N..X',   ]
    [ '+font:"font2"',                  'B..D',               ]
    [ '+font:"font3"',                  'G..I',               ]
    [ '+font:"font4"',                  'M..Q',               ]
    [ '+font:"font5"',                  'M, O..T',            ]
    [ '+font:"font6"',                  'M, U, X..X',         ]
    [ '+vowel',                         'A, E, I, O, U',      ]
    [ '+shape-pointy',                  'A, V',               ]
    [ '+shape-crossed',                 'X',                  ]
    [ '+shape-ladder',                  'A, H',               ]
    [ '+pushraise:{"x":100,"y":200}',   'O',                  ]
    ]
  seen_tags = new Set()
  seen_tags.add 'font';       dtags.add_tag { tag: 'font', value: 'fallback', }
  seen_tags.add 'pushraise';  dtags.add_tag { tag: 'pushraise', value: false, }
  for [ tagex, ranges, ] in rules
    { mode, tag, value, } = dtags.parse_tagex { tagex, }
    unless seen_tags.has tag
      seen_tags.add tag
      dtags.add_tag { tag, value: ( if value is true then false else value ), }
    for { lo, hi, } in NCR.parse_multirange_declaration ranges
      dtags.add_tagged_range { mode, tag, value, lo, hi, }
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: ranges (1)" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  f = ( fallbacks ) ->
    prefix            = 't_'
    dtags             = new Dtags { prefix, fallbacks, }
    cid_from_chr      = ( chr ) -> chr.codePointAt 0
    chr_from_cid      = ( cid ) -> String.fromCodePoint cid
    dtags.dba.create_function name: 'chr_from_cid', call: chr_from_cid
    first_cid         = cid_from_chr 'A'
    last_cid          = cid_from_chr 'Z'
    #.......................................................................................................
    _add_tagged_ranges dtags
    #.......................................................................................................
    console.table dtags.dba.list dtags.dba.query SQL"""
      select
          nr                      as nr,
          chr_from_cid( lo )      as chr_lo,
          chr_from_cid( hi )      as chr_hi,
          mode                    as mode,
          tag                     as tag,
          value                   as value
        from #{prefix}tagged_ranges
        order by nr;"""
    console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tags order by tag;"""
    # console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tags_by_cid order by tag, cid, nr;"""
    #.......................................................................................................
    for cid in [ first_cid .. last_cid ]
      chr       = String.fromCodePoint cid
      tags      = dtags.tags_from_id { id: cid, }
      info ( CND.gold chr ), ( CND.blue tags )
    # console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ids_cache order by id;"""
    # console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ranges order by lo, hi, nr;"""
  #.........................................................................................................
  for fallbacks in [ 'all', true, false, ]
    f fallbacks
  done?() #.................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: contiguous ranges" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  { dba, }          = dtags
  cid_from_chr      = ( chr ) -> chr.codePointAt 0
  chr_from_cid      = ( cid ) -> String.fromCodePoint cid
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  #.........................................................................................................
  console.table dba.list dba.query SQL"select * from #{prefix}_potential_inflection_points order by id;"
  dtags._create_minimal_contiguous_ranges()
  console.table dba.list dba.query SQL"select * from #{prefix}contiguous_ranges order by lo;"
  T?.eq ( dba.first_row dba.query SQL"select * from #{prefix}contiguous_ranges where lo = 0 order by lo;" ), { lo: 0, hi: 64, tags: '{"font":"font1"}' }
  T?.eq ( dba.first_row dba.query SQL"select * from #{prefix}contiguous_ranges where lo = 89 order by lo;" ), { lo: 89, hi: 1114111, tags: '{"font":"font1"}' }
  T?.eq ( dtags.tags_from_id { id: 10, }                   ), { font: 'font1' }
  T?.eq ( dtags.tags_from_id { id: 65, }                   ), { font: 'font1', vowel: true, 'shape-pointy': true, 'shape-ladder': true }
  T?.eq ( dtags.tags_from_id { id: ( cid_from_chr 'X' ), } ), { font: 'font1', 'shape-crossed': true }
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: validate contiguous ranges" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  { dba, }          = dtags
  cid_from_chr      = ( chr ) -> chr.codePointAt 0
  chr_from_cid      = ( cid ) -> String.fromCodePoint cid
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  dtags._create_minimal_contiguous_ranges()
  #.........................................................................................................
  rows = dba.list dba.query SQL"select * from t_contiguous_ranges where lo = ?;", [ dtags.cfg.first_id, ]
  T?.eq rows.length, 1
  #.........................................................................................................
  rows = dba.list dba.query SQL"select * from t_contiguous_ranges where hi = ?;", [ dtags.cfg.last_id, ]
  T?.eq rows.length, 1
  #.........................................................................................................
  prv_hi = null
  for row from dtags.dba.query SQL"select * from t_contiguous_ranges order by lo;"
    info '^4333^', row
    T.ok row.lo <= row.hi
    T.eq row.lo, prv_hi + 1 if prv_hi?
    prv_hi = row.hi
  #.........................................................................................................
  for id in [ 0 .. 100 ]
    rows  = dba.list dba.query SQL"select * from t_contiguous_ranges where ? between lo and hi;", [ id, ]
    T?.eq rows.length, 1
  #.........................................................................................................
  for n in [ 1 .. 10 ]
    id    = ( CND.random_integer dtags.cfg.first_id, dtags.cfg.last_id + 1 )
    rows  = dba.list dba.query SQL"select * from t_contiguous_ranges where ? between lo and hi;", [ id, ]
    T?.eq rows.length, 1
  #.........................................................................................................
  done?() #.................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: split text along ranges (demo)" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  { dba, }          = dtags
  cid_from_chr      = ( chr ) -> chr.codePointAt 0
  chr_from_cid      = ( cid ) -> String.fromCodePoint cid
  to_hex            = ( cid ) -> '0x' + cid.toString 16
  dtags.dba.create_function name: 'to_hex', call: to_hex
  dtags.dba.create_function name: 'chr_from_cid', call: chr_from_cid
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  dtags._create_minimal_contiguous_ranges()
  console.table dba.list dba.query SQL"""select
      to_hex( lo )          as lo,
      to_hex( hi )          as hi,
      chr_from_cid( lo )    as loc,
      chr_from_cid( hi )    as hic,
      tags
    from #{prefix}contiguous_ranges
    order by lo;"""
  #.........................................................................................................
  do ->
    ### Demo for a regex that partitons a text into chunks of characters that all have the same tags. ###
    debug 'abcdefgh'.match /(?<vowels>[aeiou])/g
    text = 'arbitrary text'
    re = ///
      (?<g1> [ a - d ]+ \s* ) |
      (?<g2> [ e - h ]+ \s* ) |
      (?<g3> [ i - n ]+ \s* ) |
      (?<g4> [ o - t ]+ \s* ) |
      (?<g5> [ u - z ]+ \s* ) |
      (?<g0> \s+ )
      ///g
    #.......................................................................................................
    R = []
    for match in [ ( text.matchAll re )..., ]
      { groups, } = match
      for group, part of match.groups
        continue unless part?
        R.push { group, part, }
        break
    for group, part of R
      info group, rpr part
  #.........................................................................................................
  do ->
    ### Build regex to split text from actual table contents ###
    dtags._hex_re_from_contiguous_ranges = ->
      ### TAINT make addition of spaces configurable, e.g. as `all_groups_extra: '\\s'`  ###
      ranges = []
      for row from dtags.dba.query SQL"select * from #{prefix}contiguous_ranges order by lo;"
        lo = "\\u{#{row.lo.toString 16}}"
        if row.lo is row.hi
          ranges.push "(?<g#{row.lo}>[#{lo}]+)"
        else
          hi = "\\u{#{row.hi.toString 16}}"
          ranges.push "(?<g#{row.lo}>[#{lo}-#{hi}]+)"
      ranges  = ranges.join '|'
      return new RegExp "#{ranges}", 'gu'
    #.......................................................................................................
    whisper '-'.repeat 108
    text  = "ARBITRARY TEXT"
    text  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    re    = dtags._hex_re_from_contiguous_ranges()
    debug '^33436^', re
    # re = /(?<g0>[\u{0000}-\u{0040}]+s*)|(?<g65>\u{0041}+s*)|(?<g66>[\u{0042}-\u{0044}]+s*)/gu
    # re = /([\u{0000}-\u{0040}]\s*)/gu
    # re = /(?<g777>[a-z]+)/gu
    debug '^33436^', re
    f = ( re, text ) ->
      R     = []
      idx   = 0
      debug text.length
      for match from text.matchAll re
        for key, value of match.groups
          break if value?
        if match.index > idx
          warn idx, match.index, CND.reverse rpr text[ idx ... match.index ]
          idx = match.index
        idx += value.length
        info match.index, idx, key, rpr value
      return R
    f re, text
  #.........................................................................................................
  done?() #.................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: split text along ranges" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  { dba, }          = dtags
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  tagsets_by_keys = dtags.get_tagsets_by_keys()
  T?.eq tagsets_by_keys, { g1: { font: 'font1', 'shape-crossed': true }, g2: { font: 'font1', 'shape-ladder': true }, g3: { font: 'font1', 'shape-pointy': true }, g4: { font: 'font1', vowel: true, pushraise: { x: 100, y: 200 } }, g5: { font: 'font1', vowel: true, 'shape-pointy': true, 'shape-ladder': true }, g6: { font: 'font1', vowel: true }, g7: { font: 'font1' } }
  dtags._create_minimal_contiguous_ranges()
  console.table dba.list dba.query SQL"""select
      lo                    as lo,
      hi                    as hi,
      to_hex( lo )          as lox,
      to_hex( hi )          as hix,
      chr_from_cid( lo )    as loc,
      chr_from_cid( hi )    as hic,
      tags
    from #{prefix}contiguous_ranges
    order by lo;"""
  console.table dba.list dba.query SQL"select * from #{prefix}tags_and_rangelists;"
  #.........................................................................................................
  do ->
    # text  = "ARBITRARY TEXT"
    text  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for region in regions = dtags.find_tagged_regions text
      debug '^33443^', region
    T?.eq regions, [
      { key: 'g5', start: 0, stop: 1, part: 'A' }
      { key: 'g7', start: 1, stop: 4, part: 'BCD' }
      { key: 'g6', start: 4, stop: 5, part: 'E' }
      { key: 'g7', start: 5, stop: 7, part: 'FG' }
      { key: 'g2', start: 7, stop: 8, part: 'H' }
      { key: 'g6', start: 8, stop: 9, part: 'I' }
      { key: 'g7', start: 9, stop: 14, part: 'JKLMN' }
      { key: 'g4', start: 14, stop: 15, part: 'O' }
      { key: 'g7', start: 15, stop: 20, part: 'PQRST' }
      { key: 'g6', start: 20, stop: 21, part: 'U' }
      { key: 'g3', start: 21, stop: 22, part: 'V' }
      { key: 'g7', start: 22, stop: 23, part: 'W' }
      { key: 'g1', start: 23, stop: 24, part: 'X' }
      { key: 'g7', start: 24, stop: 26, part: 'YZ' }
      ]
    tagsets_by_keys = dtags.get_tagsets_by_keys()
    T?.eq tagsets_by_keys, { g1: { font: 'font1', 'shape-crossed': true }, g2: { font: 'font1', 'shape-ladder': true }, g3: { font: 'font1', 'shape-pointy': true }, g4: { font: 'font1', vowel: true, pushraise: { x: 100, y: 200 } }, g5: { font: 'font1', vowel: true, 'shape-pointy': true, 'shape-ladder': true }, g6: { font: 'font1', vowel: true }, g7: { font: 'font1' } }
  done?() #.................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: markup text" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  #.........................................................................................................
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  { dba, }          = dtags
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  #.........................................................................................................
  do ->
    # text  = "ARBITRARY TEXT"
    # text          = "ABCDEFGHIJKLMNOPQRSTUVWXYZAEIOUX"
    text          = "AAAEBCDE"
    markup        = dtags._markup_text { text, }
    # stack         = []
    fallbacks     = freeze dtags.get_filtered_fallbacks()
    tags_opening  = freeze ( k for k of dtags.get_tags() )
    tags_closing  = freeze [ tags_opening..., ].reverse()
    current_tags  = { fallbacks..., }
    debug '^33342^', current_tags
    debug '^33342^', tags_opening
    debug '^33342^', tags_closing
    # push  = ( tag, value ) ->
    #   # stack.push { tag, value, }
    #   current_tags[ tag ] = value
    #   if value is true
    #     return "<#{tag}>"
    #   else if value is false
    #     return "</#{tag}>"
    #   else
    #     ### TAINT just mockup not for reals ###
    #     value = JSON.stringify value
    #     return "<#{tag} value='#{value}'}>"
    debug '^445^', '--------------------------'
    for d in markup
      tags      = { fallbacks..., d.tags..., }
      { part, } = d.region
      atrs      = []
      for tag in tags_opening
        continue unless ( value = tags[ tag ] )?
        ### TAINT just mockup not for reals ###
        if value is true
          atrs.push "#{tag}"
        else
          value = JSON.stringify value
          atrs.push "#{tag}='#{value}'"
          # info '^347^', "#{tag}: #{rpr value}"
      atrs = atrs.join ' '
      whisper '^4554^', tags, rpr d.region.part
      urge "<span #{atrs}>#{part}</span>"
    # debug stack
  done?() #.................................................................................................

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: tags must be declared" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  first_id          = 'a'.codePointAt 0
  last_id           = 'z'.codePointAt 0
  dtags             = new Dtags { fallbacks: true, first_id, last_id, }
  { dba, }          = dtags
  #.........................................................................................................
  do ->
    ### ensure tags must be explicitly added before being used ###
    error = null
    try
      dtags.add_tagged_range { lo: ( dtags.f.cid_from_chr 'c' ), hi: ( dtags.f.cid_from_chr 'e' ), tag: 'c_e', }
    catch error
      # warn error.message
      # warn type_of error
      T?.eq error.code, 'SQLITE_CONSTRAINT_FOREIGNKEY'
    unless error?
      T?.fail "expected error, got none (ref ^4956649089^)"
  return done?()
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: table getters" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  first_id          = 'a'.codePointAt 0
  last_id           = 'z'.codePointAt 0
  dtags             = new Dtags { fallbacks: true, first_id, last_id, }
  { dba, }          = dtags
  { cid_from_chr
    chr_from_cid }  = dtags.f
  #.........................................................................................................
  do ->
    dtags.add_tag { tag: 'base', }
    dtags.add_tagged_range { lo: ( cid_from_chr 'a' ), hi: ( cid_from_chr 'z' ), tag: 'base', }
    info '^33736^', tags                = dtags.get_tags()
    info '^33736^', tagged_ranges       = dtags.get_tagged_ranges()
    info '^33736^', fallbacks           = dtags.get_fallbacks()
    info '^33736^', filtered_fallbacks  = dtags.get_filtered_fallbacks()
    info '^33736^', tags_of_b           = dtags.tags_from_id { id: ( cid_from_chr 'b' ) }
    info '^33736^', contiguous_ranges   = dtags.get_continuous_ranges()
    info '^33736^', tags_and_rangelists = dtags.get_tags_and_rangelists()
    T?.eq tags,                 { base: { nr: 1, fallback: false } }
    T?.eq tagged_ranges,        [ { nr: 1, lo: 97, hi: 122, mode: '+', tag: 'base', value: true } ]
    T?.eq fallbacks,            { base: false }
    T?.eq filtered_fallbacks,   {}
    T?.eq tags_of_b,            { base: true }
    T?.eq contiguous_ranges,    [ { lo: 97, hi: 122, tags: { base: true } } ]
    T?.eq tags_and_rangelists,  [ { key: 'g1', tags: { base: true }, ranges: [ [ 97, 122 ] ] } ]
    #.......................................................................................................
    whisper '-'.repeat 108
    dtags.add_tagged_range { lo: ( cid_from_chr 'd' ), hi: ( cid_from_chr 'f' ), tag: 'base', }
    info '^33736^', tags                = dtags.get_tags()
    info '^33736^', tagged_ranges       = dtags.get_tagged_ranges()
    info '^33736^', fallbacks           = dtags.get_fallbacks()
    info '^33736^', filtered_fallbacks  = dtags.get_filtered_fallbacks()
    info '^33736^', tags_of_b           = dtags.tags_from_id { id: ( cid_from_chr 'b' ) }
    info '^33736^', contiguous_ranges   = dtags.get_continuous_ranges()
    info '^33736^', tags_and_rangelists = dtags.get_tags_and_rangelists()
    T?.eq tags,                 { base: { nr: 1, fallback: false } }
    T?.eq tagged_ranges,        [ { nr: 1, lo: 97, hi: 122, mode: '+', tag: 'base', value: true }, { nr: 2, lo: 100, hi: 102, mode: '+', tag: 'base', value: true } ]
    T?.eq fallbacks,            { base: false }
    T?.eq filtered_fallbacks,   {}
    T?.eq tags_of_b,            { base: true }
    T?.eq contiguous_ranges,    [ { lo: 97, hi: 122, tags: { base: true } } ]
    T?.eq tags_and_rangelists,  [ { key: 'g1', tags: { base: true }, ranges: [ [ 97, 122 ] ] } ]
    #.......................................................................................................
    whisper '-'.repeat 108
    dtags.add_tag { tag: 'color', value: 'black', }
    dtags.add_tagged_range { lo: ( cid_from_chr 'e' ), hi: ( cid_from_chr 'e' ), tag: 'color', value: 'red', }
    info '^33736^', tags                = dtags.get_tags()
    info '^33736^', tagged_ranges       = dtags.get_tagged_ranges()
    info '^33736^', fallbacks           = dtags.get_fallbacks()
    info '^33736^', filtered_fallbacks  = dtags.get_filtered_fallbacks()
    info '^33736^', tags_of_b           = dtags.tags_from_id { id: ( cid_from_chr 'b' ) }
    info '^33736^', contiguous_ranges   = dtags.get_continuous_ranges()
    info '^33736^', tags_and_rangelists = dtags.get_tags_and_rangelists()
    T?.eq tags,                 { base: { nr: 1, fallback: false }, color: { nr: 2, fallback: 'black' } }
    T?.eq tagged_ranges,        [ { nr: 1, lo: 97, hi: 122, mode: '+', tag: 'base', value: true }, { nr: 2, lo: 100, hi: 102, mode: '+', tag: 'base', value: true }, { nr: 3, lo: 101, hi: 101, mode: '+', tag: 'color', value: 'red' } ]
    T?.eq fallbacks,            { base: false, color: 'black' }
    T?.eq filtered_fallbacks,   { color: 'black' }
    T?.eq tags_of_b,            { color: 'black', base: true }
    T?.eq contiguous_ranges,    [ { lo: 97, hi: 100, tags: { color: 'black', base: true } }, { lo: 101, hi: 101, tags: { color: 'red', base: true } }, { lo: 102, hi: 122, tags: { color: 'black', base: true } } ]
    T?.eq tags_and_rangelists,  [ { key: 'g1', tags: { color: 'black', base: true }, ranges: [ [ 97, 100 ], [ 102, 122 ] ] }, { key: 'g2', tags: { color: 'red', base: true }, ranges: [ [ 101, 101 ] ] } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: tagged text" ] = ( T, done ) ->
  T?.halt_on_error()
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml()
  { tag: _tag
    S
    H   }                   = cupofhtml.export()
  #.........................................................................................................
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  fallbacks         = 'all'
  dtags             = new Dtags { fallbacks, }
  cid_from_chr      = ( chr ) -> chr.codePointAt 0
  chr_from_cid      = ( cid ) -> String.fromCodePoint cid
  # dtags.dba.create_function name: 'chr_from_cid', call: chr_from_cid
  # dtags.dba.create_function name: 'cid_from_chr', call: cid_from_chr
  _add_tagged_ranges dtags
  #.........................................................................................................
  text  = "lore ipsum"
  text  = text.toUpperCase()
  chrs  = Array.from text
  #.........................................................................................................
  is_open = {}
  stack   = []
  #.........................................................................................................
  dtag_as_html_tag = ( tag, value ) ->
    switch ( type = type_of value )
      when 'object'
        urge '^77464^', INTERTEXT.CUPOFHTML._html_from_datom {}, { $key: '<foo', bar: 42, }
        urge '^77464^', INTERTEXT.CUPOFHTML._html_from_datom {}, { $key: '^foo', bar: 42, }
        urge '^77464^', INTERTEXT.CUPOFHTML._html_from_datom {}, { $key: '>foo', bar: 42, }
        urge '^77464^', INTERTEXT.CUPOFHTML._html_from_datom {}, 'foo<bar>'
        _tag 'mytag', value, '\x00'
        R                   = cupofhtml.as_html()
        [ opener, closer, ] = R.split '\x00'
        return opener
      else
        return "<#{tag} class='#{value}'>"
  #.........................................................................................................
  prefill_stack = ->
    for tag, value of dtags.get_fallbacks()
      stack.push { tag, value, }
      yield dtag_as_html_tag tag, value
    return null
  for html_tag from prefill_stack()
    debug '^5576^', html_tag
  whisper '^545^', stack
  # return done?()
  #.........................................................................................................
  for chr in chrs
    id    = cid_from_chr chr
    tags  = dtags.tags_from_id { id, }
    whisper '^777^', chr, tags
    for tag, value of tags
      info '^44476^', { tag, value, }
      continue unless tag in [ 'font', 'vowel', ]
      if ( is_open[ tag ] ?= false )
        do flush = ->
          loop
            top_tag = stack.pop()
            urge '^777^', "</#{top_tag}>"
            is_open[ top_tag ] = false
            break if tag is top_tag
          return null
      debug '^777^', chr
      is_open[ tag ] = true
      info '^777^', "<#{tag} class='#{value}'>"
      stack.push tag
      whisper '^777^', stack
  #.........................................................................................................
  done?() #.................................................................................................


#-----------------------------------------------------------------------------------------------------------
demo_html = ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml()
  { cram
    expand
    tag
    S
    H   }                   = cupofhtml.export()
  { datoms_from_html
    html_from_datoms }      = INTERTEXT.HTML.export()
  #.........................................................................................................
  H.p ->
    S.text  "An interesting "
    tag     'em', "fact"
    S.text  " about CupOfJoe is that you "
    tag     'em', { foo: 'bar', }, -> S.text "can"
    tag     'strong', " nest", " with both sequences", " and function calls."
  #.........................................................................................................
  html   = cupofhtml.as_html()
  info cupofhtml.last_expansion
  urge '\n' + html
  #.........................................................................................................
  H.p "another paragraph"
  debug cupofhtml.as_html()
  #.........................................................................................................
  tag 'p', { guess: 'what', }, ->
    S.text "yet another paragraph"
    tag 'foobar', { atr: 'value with spaces', }, "yay"
  debug cupofhtml.as_html()
  #.........................................................................................................
  return null

regex_demo = ->
  text  = " abcdab cfgbbzäöüabc ÄÖÜ z"
  # re    = dtags._hex_re_from_contiguous_ranges()
  # debug '^33436^', re
  # re = /(?<g0>[\u{0000}-\u{0040}]+s*)|(?<g65>\u{0041}+s*)|(?<g66>[\u{0042}-\u{0044}]+s*)/gu
  # re = /([\u{0000}-\u{0040}]\s*)/gu
  ### Version with trailing spaces becoming part of preceding group; `<g0>` only used for leading space
  and space after unmatched characters (hich should never happen) ###
  re = ///
    (?<g0> [ \s ]+ ) |
    (?<g1> [ \u{61} - \u{65} \s ]+ ) |
    (?<g2> [ \u{66} - \u{7a} \s ]+ )
    ///gu
  ### ... but we prefer to not special-case whitespace to avoid spaces to be treated like a preceding
  special-cased glyf (which might get scaled, translated and so on); `<g3>` is now an ordinary group
  without any overlaps: ###
  re = ///
    (?<g1> [ \u{61} - \u{65} ]+ ) |
    (?<g2> [ \u{66} - \u{7a} ]+ ) |
    (?<g3> [ \s ]+ )
    ///gu
  debug '^33436^', re
  R     = []
  idx   = 0
  debug text.length
  for match from text.matchAll re
    for key, value of match.groups
      break if value?
    if match.index > idx
      warn idx, match.index, CND.reverse rpr text[ idx ... match.index ]
      idx = match.index
    idx += value.length
    info match.index, idx, key, rpr value
  return null


############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: tags must be declared" ]
  # test @[ "DBA: table getters" ]
  test @[ "DBA: markup text" ]
  # test @[ "DBA: ranges (1)" ]
  # test @[ "DBA: contiguous ranges" ]
  # test @[ "DBA: validate contiguous ranges" ]
  # test @[ "DBA: split text along ranges (demo)" ]
  # test @[ "DBA: split text along ranges" ]
  # @[ "DBA: split text along ranges" ]()
  # regex_demo()
  # @[ "DBA: contiguous ranges" ]()
  # test @[ "tags: caching with empty values" ]
  # test @[ "tags: tags_from_tagexchain" ]
  # test @[ "tags: add_tagged_range" ]
  # test @[ "tags: add_tag with value" ]
  # test @[ "tags: parse_tagex" ]
  # @[ "DBA: ranges (1)" ]()
  # test @[ "tags: caching (1)" ]
  # test @[ "tags: fallbacks" ]
  # @[ "tags: fallbacks" ]()
  # @[ "DBA: tagged text" ]()
  # demo_html()




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




