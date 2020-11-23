
'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'InterLap/tests'
rpr                       = CND.rpr
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ equals
  isa
  type_of }               = types.export()
{ freeze }                = require 'letsfreezethat'


#===========================================================================================================
# VALUE IDs
#-----------------------------------------------------------------------------------------------------------
id_of = do =>
  ### TAINT ideally, should use WeakMap, but won't work with primitive values ###
  ### NOTE could use sha1sum for strings, value itself for other primitives? use string rather than number? ###
  ids           = new Map()
  _last_id      = 0
  return ( x ) ->
    return R if ( R = ids.get x )
    _last_id++
    ids.set x, _last_id
    return _last_id


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "new LAP.Interlap" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ null,                   null, "unable to instantiate from a null" ]
    [ 42,                     null, "unable to instantiate from a float" ]
    [ [ 42, ],                null, "must be a list" ]
    [ [ [ 42, ], ],           null, "length must be 2" ]
    [ [ [ 20, 10, ], ],       null, "lo boundary must be less than or equal to hi boundary" ]
    [ [ [ Infinity, 20, ], ], null, "lo boundary must be less than or equal to hi boundary" ]
    [ ( -> ( yield x ) for x in [ [ 5, 6, ], [ 7, 8, ], ] )(), null, "unable to instantiate from a generator" ]
    [ [ [ -Infinity, 20, ], ], [ [ -Infinity, 20, ], ] ]
    [ [], [], ]
    [ [ [ 10, 20, ], ], [ [ 10, 20, ], ], ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = new LAP.Interlap probe
      T.ok Object.isFrozen result
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "new LAP.Interlap 2" ] = ( T, done ) ->
  LAP           = require '../../../apps/interlap'
  L             = LAP.export().as_list
  { Segment
    Interlap }  = LAP.export()
  do =>
    result = new Interlap()
    T.ok Object.isFrozen result
    T.eq ( L result ), []
  do =>
    result = new Interlap new Segment [ 13, 13, ]
    T.ok Object.isFrozen result
    T.eq ( L result ), [ [ 13, 13, ], ]
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.interlap_from_segments" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ null,   null, "must be a list" ]
    [ 42,     null, "must be a list" ]
    [ [ 42, ], null, "length must be 2" ]
    [ [ 10, 20, ], [ [ 10, 20, ], ], ]
    [ [ 20, 10, ], null, "lo boundary must be less than or equal to hi boundary" ]
    [ [ Infinity, 20, ], null, "lo boundary must be less than or equal to hi boundary" ]
    [ [ -Infinity, 20, ], [ [ -Infinity, 20, ], ] ]
    [ ( -> ( yield x ) for x in [ [ 5, 6, ], [ 7, 8, ], ] )(), [ [ 5, 8, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = LAP.interlap_from_segments probe
      T.ok Object.isFrozen result
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.Interlap properties" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ [ 10, 20, ], [ 8, 12, ], [ 25, 30, ] ], [ [ [ 8, 20, ], [ 25, 30, ] ], { first: [ 8, 20 ], last: [ 25, 30 ], size: 19, lo: 8, hi: 30 }, ], null, ]
    [ [ [ -Infinity, 20 ] ], [ [ [ -Infinity, 20 ] ], { first: [ -Infinity, 20 ], last: [ -Infinity, 20 ], size: Infinity, lo: -Infinity, hi: 20 } ], null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      range                           = LAP.interlap_from_segments probe...
      { first, last, size, lo, hi, }  = range
      T.ok Object.isFrozen range
      T.ok Object.isFrozen range.first
      T.ok Object.isFrozen range.last
      # range.push "won't work"
      resolve [ range, { first, last, size, lo, hi, }, ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.new_segment" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ [ 1, 5, ], ], [ 1, 5, ], ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = new LAP.Segment probe...
      T.ok Object.isFrozen result
      T.ok result instanceof LAP.Segment
      T.eq result.lo, result[ 0 ]
      T.eq result.hi, result[ 1 ]
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.Segment.from" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ null, null, "not implemented" ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = LAP.Segment.from probe
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.segment_from_lohi" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ 1, 5, ],      [ 1, 5, ], ]
    [ [ 1, NaN, ],    null, 'hi boundary must be an infloat', ]
    [ [ 1, ],         null, 'length must be 2', ]
    [ [ 100, -100, ], null, 'lo boundary must be less than or equal to hi boundary', ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = LAP.segment_from_lohi probe...
      T.ok Object.isFrozen result
      T.ok result instanceof LAP.Segment
      T.eq result.lo, result[ 0 ]
      T.eq result.hi, result[ 1 ]
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LAP.Interlap.from" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ null, null, "not implemented" ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = LAP.Interlap.from probe
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with single segment" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ [ 10, 20, ], [ 1, 1, ], ], [ [ 1, 1, ], [ 10, 20, ], ], ]
    [ [ [ 10, 20, ], [ 1, 1, ], [ 5, 5, ], [ 18, 24, ] ], [ [ 1, 1, ], [ 5, 5, ], [ 10, 24, ], ], ]
    [ [ [ 100, Infinity, ], [ 80, 90, ], ], [ [ 80, 90, ], [ 100, Infinity, ] ] ]
    [ [ [ 100, Infinity, ], [ 80, 100, ], ], [ [ 80, Infinity, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, segments..., ] = probe
      result = LAP.interlap_from_segments first
      T.ok Object.isFrozen result
      for segment in segments
        [ lo, hi, ] = segment
        segment = LAP.segment_from_lohi lo, hi
        T.eq segment.lo, segment[ 0 ]
        next_result = LAP.union result, segment
        T.ok Object.isFrozen next_result
        T.ok next_result instanceof LAP.Interlap
        T.ok not equals result, next_result
        result = next_result
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with multiple segments" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ [], [ [ 1, 1, ], [ -3, -1, ], ] ], [ [ -3, -1, ], [ 1, 1, ], ] ]
    [ [ [], [ [ 1, 1, ], [ -3, 3, ], ] ], [ [ -3, 3, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, segments, ] = probe
      result = new LAP.Interlap first
      result = LAP.union result, segments...
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with Interlap" ] = ( T, done ) ->
  LAP = require '../../../apps/interlap'
  probes_and_matchers = [
    [ [ [], [ [ 1, 1, ], [ -3, -1, ], ] ], [ [ -3, -1, ], [ 1, 1, ], ] ]
    [ [ [], [ [ 1, 1, ], [ -3, 3, ], ] ], [ [ -3, 3, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, ranges, ] = probe
      result  = new LAP.Interlap first
      ranges  = ( ( new LAP.Interlap [ range, ] ) for range in ranges )
      result  = LAP.union result, ranges...
      resolve LAP.as_list result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "Interlap differences" ] = ( T, done ) ->
  LAP           = require '../../../apps/interlap'
  { Interlap }  = LAP
  L             = LAP.export().as_list
  #.........................................................................................................
  p1            = freeze [ [ 10, 100, ], ]
  p2            = freeze [ [ 20, 50, ], ]
  p3            = freeze [ [ 80, 120, ], ]
  d1            = new Interlap p1
  d2            = new Interlap p2
  d3            = new Interlap p3
  id_of_d1      = id_of d1
  id_of_d2      = id_of d2
  id_of_d3      = id_of d3
  #.........................................................................................................
  test_invariance = ->
    T.eq ( id_of d1 ), id_of_d1
    T.eq ( id_of d2 ), id_of_d2
    T.eq ( id_of d3 ), id_of_d3
    T.eq ( L d1 ), p1
    T.eq ( L d2 ), p2
    T.eq ( L d3 ), p3
  #.........................................................................................................
  info "#{L d1} without #{L d2}", L LAP.difference d1, d2; test_invariance()
  info "#{L d2} without #{L d1}", L LAP.difference d2, d1; test_invariance()
  info "#{L d1} without #{L d3}", L LAP.difference d1, d3; test_invariance()
  info "#{L d3} without #{L d1}", L LAP.difference d3, d1; test_invariance()
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "InterLap: DRange example converted" ] = ( T, done ) ->
  ### const DRange = require('drange');
      let allNums = new DRange(1, 100);                       // [ 1-100 ]
      let badNums = DRange(13).add(8).add(60,80);             // [8, 13, 60-80]
      let goodNums = allNums.clone().subtract(badNums);
      console.log(goodNums.toString());                       // [ 1-7, 9-12, 14-59, 81-100 ]
      let randomGoodNum = goodNums.index(Math.floor(Math.random() * goodNums.length)); ###
  LAP             = require '../../../apps/interlap'
  L               = LAP.export().as_list
  { Interlap
    Segment
    union
    difference }  = LAP.export()
  allNums         = new Interlap [ [ 1, 100, ], ]
  allNums_id      = id_of allNums
  badNums         = new Interlap [ [ 13, 13, ], ]
  badNums_id      = id_of badNums
  badNums         = new Interlap new Segment [ 13, 13, ]
  T.ok not equals ( id_of badNums ), badNums_id
  badNums         = union badNums, new Segment [ 8, 8, ]
  badNums         = union badNums, new Segment [ 60, 80, ]
  goodNums        = difference allNums, badNums
  T.eq ( id_of allNums ), allNums_id
  T.eq ( L allNums ), [ [ 1, 100, ], ]
  T.eq ( L goodNums ), [ [ 1, 7, ], [ 9, 12, ], [ 14, 59, ], [ 81, 100, ], ]
  info ( L allNums  ); urge ( allNums_list  = LAP.as_numbers allNums   )
  info ( L badNums  ); urge ( badNums_list  = LAP.as_numbers badNums   )
  info ( L goodNums ); urge ( goodNums_list = LAP.as_numbers goodNums  )
  T.eq allNums_list,  [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ]
  T.eq badNums_list,  [ 8, 13, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80 ]
  T.eq goodNums_list, [ 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100 ]
  info LAP.includes goodNums, 3
  try info LAP.includes goodNums, [ 1, 7, ] catch error then T.ok ( /got a list/ ).test error.message
  T.ok error? ### ensure error was thrown ###
  T.ok     LAP.includes goodNums, new Segment [ 1, 7, ]
  T.ok     LAP.includes goodNums, new Segment [ 1, 3, ]
  T.ok     LAP.includes goodNums, new Segment [ 11, 12, ]
  T.ok not LAP.includes goodNums, new Segment [ 11, 13, ]
  T.ok LAP.includes goodNums, ( goodNums_list[ CND.random_integer 0, goodNums_list.length - 1 ] )
  T.ok LAP.includes goodNums, ( goodNums_list[ CND.random_integer 0, goodNums_list.length - 1 ] )
  T.ok LAP.includes goodNums, ( goodNums_list[ CND.random_integer 0, goodNums_list.length - 1 ] )
  # info LAP.
  # d1      = new LAP.Interlap d0
  # info LAP.types.cast 'interlap', 'list', d1
  # info LAP.types.cast 'list', 'interlap', d1
  # info LAP.as_list d1
  # info new LAP.Interlap [ [ 4, 6 ], [ 7, 7, ], [ 11, 19, ], ]
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "InterLap: cast to list" ] = ( T, done ) ->
  LAP           = require '../../../apps/interlap'
  d0      = [ [ 110, 115, ], [ 112, 120, ], [ 300, 310, ], ]
  d1      = new LAP.Interlap d0
  info LAP.types.cast 'interlap', 'list', d1
  info LAP.types.cast 'list', 'interlap', d1
  info LAP.as_list d1
  info new LAP.Interlap [ [ 4, 6 ], [ 7, 7, ], [ 11, 19, ], ]
  done()

#-----------------------------------------------------------------------------------------------------------
demo_equality_between_custom_and_basic_values = ->
  LAP           = require '../../../apps/interlap'
  d0      = [ [ 110, 115, ], [ 112, 120, ], [ 300, 310, ], ]
  d1      = new LAP.Interlap d0
  d1_list = [ [ 110, 120, ], [ 300, 310, ] ]
  info d0
  info d1_list
  info d0 is d1
  info equals d0, d1
  info equals d1, d1_list
  info d1
  info [ d1..., ]
  info ( [ d..., ] for d in d1 )
  info equals ( [ d..., ] for d in d1 ), d1_list
  info type_of d0
  info type_of d1
  info type_of d1_list
  info equals ( LAP.as_list d1 ), d1_list
  return null

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  LAP = require '../../../apps/interlap'
  d0  = [ [ 1, 3, ], [ 5, 7, ] ]
  info d1 = new LAP.Interlap           d0
  info d2 = LAP.interlap_from_segments d0...
  info equals d1, d2
  info type_of               d1
  info equals d1, d0
  info equals d1.size, d0.size
  info d0.size
  info d1.size
  # class Xxxx
  # xxxx = new Xxxx()
  # info CND.type_of           xxxx
  # info types.type_of         xxxx
  # info typeof                xxxx
  # info Object::toString.call xxxx
  return null

#-----------------------------------------------------------------------------------------------------------
demo_merge_ranges = ->
  merge_ranges  = require 'merge-ranges'
  ranges        = [
    [ 10, 20, ]
    [ 15, 30, ]
    [ 30, 32, ]
    [ 42, 42, ]
    [ 88, 99, ]
    ]
  a = merge_ranges ranges
  b = @ranges_from_urange new Urange ranges...
  info 'merging:', a
  info 'merging:', b
  validate.true CND.equals a, b

#-----------------------------------------------------------------------------------------------------------
demo_subtract_ranges_DRange = ->
  ranges_from_drange   = ( drange ) -> ( [ r.low, r.high, ] for r in drange.ranges )
  numbers_from_drange  = ( drange ) -> ( ( drange.index i ) for i in [ 0 ... drange.length ] )
  super_rng   = new DRange 1, 100
  blue_rng    = new DRange 13
  blue_rng    = blue_rng.add 8
  blue_rng    = blue_rng.add 60, 80 # [8, 13, 60-80]
  blue_rng    = blue_rng.add 81
  blue_rng    = blue_rng.add new DRange 27, 55
  help '^3332^', ranges_from_drange blue_rng
  red_rng     = super_rng.clone().subtract blue_rng
  help '^556^', ranges_from_drange red_rng
  help '^556^', red_rng.length
  info '^334^', numbers_from_drange red_rng

#-----------------------------------------------------------------------------------------------------------
@[ "InterLap: Object methods" ] = ( T, done ) ->
  LAP             = require '../../../apps/interlap'
  L               = LAP.export().as_list
  { Interlap
    Segment
    union
    difference }  = LAP.export()
  #.........................................................................................................
  d0    = new Segment [ 1, 100, ]
  d1    = new Interlap [ d0, [ 120, 125, ], ]
  CAT = require '../../../apps/multimix/lib/cataloguing'
  debug ( k for k of d0 )
  debug CAT.all_keys_of d0
  debug d1.join '*'
  # debug Array::map.call d1, ( s ) -> "{#{s.lo}|#{s.hi}}"
  # debug d1.filter ( s ) -> false # s.lo < 100
  # debug Array::filter.call d1, ( s ) -> s.lo < 100
  done()



############################################################################################################
if module is require.main then do =>
  # demo_1()
  # demo_equality_between_custom_and_basic_values()
  test @
  # test @[ "InterLap: Object methods" ]
  # @[ "InterLap: Object methods" ]()
  # test @[ "InterLap: DRange example converted" ]
  # @[ "InterLap: DRange example converted" ]()
  # test @[ "Interlap differences" ]
  # test @[ "InterLap: cast to list" ]
  # test @[ "LAP.interlap_from_segments" ]
  # test @[ "LAP.Interlap properties" ]
  # test @[ "LAP.new_segment" ]
  # test @[ "LAP.Segment.from" ]
  # test @[ "LAP.Interlap.from" ]
  # test @[ "LAP.segment_from_lohi" ]
  # test @[ "union with single segment" ]
  # test @[ "new LAP.Interlap" ]
  # test @[ "union with multiple segments" ]
  # test @[ "union with Interlap" ]


