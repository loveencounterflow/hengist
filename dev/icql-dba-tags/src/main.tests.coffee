
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
  get_cache         = -> dba.list dba.query SQL"select * from t_tagged_ids_cache order by id;"
  # get_tagchain      = ( id ) -> dba.list dba.query SQL"""
  #   select mode, tag, value from t_tagged_ranges where $id between lo and hi order by nr asc;""", { id, }
  #.........................................................................................................
  do =>
    dtags.add_tag { tag: 'first', }
    dtags.add_tag { tag: 'second', }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 20, tag: 'first',  }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 15, tag: 'second', }
    dtags.add_tagged_range { mode: '-', lo: 12, hi: 12, tag: 'second', }
    T.eq get_cache(), []
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
    T.eq get_cache(), []
    T.eq ( dtags.tags_from_id { id: 10, } ), { first: true, second: true }
    T.eq ( dtags.tags_from_id { id: 12, } ), { first: true, }
    T.eq ( dtags.tags_from_id { id: 16, } ), { first: true }
    T.eq get_cache(), [
      { id: 10, tags: '{"first":true,"second":true}' },
      { id: 12, tags: '{"first":true}' },
      { id: 16, tags: '{"first":true}' } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "tags: caching with empty values" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Dtags, }        = require '../../../apps/icql-dba-tags'
  prefix            = 't_'
  dtags             = new Dtags { prefix, fallbacks: true, }
  #.........................................................................................................
  get_tagged_ranges = -> dtags.dba.list dtags.dba.query SQL"select * from t_tagged_ranges order by nr;"
  get_cache         = -> dtags.dba.list dtags.dba.query SQL"select * from t_tagged_ids_cache order by id;"
  # get_tagchain      = ( id ) -> dba.list dba.query SQL"""
  #   select mode, tag, value from t_tagged_ranges where $id between lo and hi order by nr asc;""", { id, }
  #.........................................................................................................
  do =>
    dtags.add_tag { tag: 'first', }
    dtags.add_tagged_range { mode: '+', lo: 10, hi: 10, tag: 'first',  }
    T.eq get_cache(), []
    T.eq get_tagged_ranges(), [
      { nr: 1, lo: 10, hi: 10, mode: '+', tag: 'first', value: 'true' }, ]
    T.eq ( dtags.tagchain_from_id { id: 10, } ), [
      { nr: 1, mode: '+', tag: 'first', value: true }, ]
    T.eq ( dtags.tagchain_from_id { id: 11, } ), []
    T.eq get_cache(), []
    T.eq ( dtags.tags_from_id { id: 10, } ), { first: true, }
    T.eq ( dtags.tags_from_id { id: 11, } ), {}
    T.eq get_cache(), [
      { id: 10, tags: '{"first":true}' },
      { id: 11, tags: '{}' }, ]
    console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ids_cache order by id;"""
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
    console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ids_cache order by id;"""
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
  first_cid         = cid_from_chr 'A'
  last_cid          = cid_from_chr 'Z'
  #.........................................................................................................
  _add_tagged_ranges dtags
  dtags.add_tagged_range { lo: dtags.cfg.first_id, hi: dtags.cfg.last_id, tag: 'font', value: 'font1', }
  #.........................................................................................................
  console.table dba.list dba.query SQL"select * from #{prefix}_potential_inflection_points order by id;"
  dtags.create_minimal_contiguous_ranges()
  console.table dba.list dba.query SQL"select * from #{prefix}contiguous_ranges order by lo;"
  done?(); return null
  #.........................................................................................................
  ### Demo for a regex that partitons a text into chunks of characters that all have the same tags. ###
  debug 'abcdefgh'.match /(?<vowels>[aeiou])/g
  d = 'arbitrary text'
  re = ///
    (?<g1> [ a - d ]+ \s* ) |
    (?<g2> [ e - h ]+ \s* ) |
    (?<g3> [ i - n ]+ \s* ) |
    (?<g4> [ o - t ]+ \s* ) |
    (?<g5> [ u - z ]+ \s* ) |
    (?<g0> \s+ )
    ///g
  R = []
  for match in [ ( d.matchAll re )..., ]
    { groups, } = match
    for group, part of match.groups
      continue unless part?
      R.push { group, part, }
      break
  for group, part of R
    info group, rpr part
  #.........................................................................................................
  ### Computing contiguous ranges for all distinct sets of tags. For each ID, this table contains exactly
  one matching row between lo and hi, and the lo of each row (except for the first) is the hi of the
  preceding row plus one. The data in this table replaces `t_tagged_ids_cache` which in a typical
  application can be expected to be much larger; further, the range data can be used to build a regex
  as shown above to split a given text into chunks of characters that all have the same tags. ###
  # f = add_sql_functions dtags.dba
  # console.table dtags.dba.list dtags.dba.query SQL"select * from t_tagged_ranges order by lo, hi;"
  tags_cache_1 = {}
  build_cache_1 = ( cfg ) ->
    { lo, hi, } = cfg
    lo         ?= first_cid
    hi         ?= last_cid
    dtags.tags_from_id { id, } for id in [ lo .. hi ]
    cur_id        = first_cid
    cur_tags      = null
    prv_id        = null
    prv_tags      = null
    for row from dtags.dba.query SQL"select * from t_tagged_ids_cache order by id;"
      { id: cur_id, tags: cur_tags, } = row
      if cur_tags isnt prv_tags
        if prv_tags?
          ( tags_cache_1[ prv_tags ] ?= [] ).push [ ( prv_id ? first_cid ), ( cur_id - 1 ), ]
        prv_id    = cur_id
        prv_tags  = cur_tags
    info '^3487^', { prv_id, prv_tags, cur_id, cur_tags, }
    ( tags_cache_1[ cur_tags ] ?= [] ).push [ ( prv_id ? first_cid ), cur_id, ]
    return null
  build_cache_1 { lo: 0, hi: 99, }
  for tags, id_pairs of tags_cache_1
    for id_pair, idx in id_pairs
      if idx is 0
        debug id_pair, tags
      else
        debug id_pair
  #.........................................................................................................
  ### Computing contiguous ranges for all distinct sets of tags using inflection points. ###
  tags_cache_2 = {}
  build_cache_2 = ( cfg ) ->
    { lo, hi, }   = cfg
    lo           ?= first_cid
    hi           ?= last_cid
    cur_id        = first_cid
    cur_tags      = null
    prv_id        = null
    prv_tags      = null
    dtags.dba.do_unsafe =>
      for row from dtags.dba.query SQL"select * from #{prefix}_potential_inflection_points order by id;"
        { id, tags, } = row
        debug '^477^', id, dtags.tags_from_id { id, }
  build_cache_2 { lo: 65, hi: 99, }
  for tags, id_pairs of tags_cache_2
    for id_pair, idx in id_pairs
      if idx is 0
        debug id_pair, tags
      else
        debug id_pair
  #.........................................................................................................
  ### Iterate over all potential Unicode code points ###
  ### TAINT use proper benchmarking ###
  first_cid = 0x000000
  last_cid  = 0x10ffff
  n         = last_cid - first_cid + 1
  t0        = Date.now()
  #.........................................................................................................
  do ->
    for id in [ first_cid .. last_cid ]
      # tagchain  = dtags.tagchain_from_id { id, }
      # tags      = dtags.tags_from_id { id, }
      # urge '^337^', dtags.tagchain_from_id { id, }
      continue
  #.........................................................................................................
  t1        = Date.now()
  dts       = ( t1 - t0 ) / 1000
  row_count = dtags.dba.first_value dtags.dba.query SQL"select count(*) from #{prefix}tagged_ids_cache;"
  # console.table dtags.dba.list dtags.dba.query SQL"""select * from #{prefix}tagged_ids_cache order by id desc limit 100;"""
  debug '^3376^', { n, dts, row_count, }
  #.........................................................................................................
  done?() #.................................................................................................

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


############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBA: ranges (1)" ]
  # test @[ "DBA: contiguous ranges" ]
  @[ "DBA: contiguous ranges" ]()
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




