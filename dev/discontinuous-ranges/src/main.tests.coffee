
'use strict'
# coffeelint: disable=max_line_length

############################################################################################################
CND                       = require 'cnd'
badge                     = 'DISCONTINUOUS-RANGES/TESTS'
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


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "new DRA.Interlap" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ null,                   null, "unable to instantiate from a null" ]
    [ 42,                     null, "unable to instantiate from a number" ]
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
      result = new DRA.Interlap probe
      T.ok Object.isFrozen result
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DRA.interlap_from_segments" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
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
      result = DRA.interlap_from_segments probe
      T.ok Object.isFrozen result
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DRA.Interlap properties" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [ 10, 20, ], [ 8, 12, ], [ 25, 30, ] ], [ [ [ 8, 20, ], [ 25, 30, ] ], { first: [ 8, 20 ], last: [ 25, 30 ], size: 19, lo: 8, hi: 30 }, ], null, ]
    [ [ [ -Infinity, 20 ] ], [ [ [ -Infinity, 20 ] ], { first: [ -Infinity, 20 ], last: [ -Infinity, 20 ], size: Infinity, lo: -Infinity, hi: 20 } ], null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      range                           = DRA.interlap_from_segments probe...
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
@[ "DRA.new_segment" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [ 1, 5, ], ], [ 1, 5, ], ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = new DRA.Segment probe...
      T.ok Object.isFrozen result
      T.ok result instanceof DRA.Segment
      T.eq result.lo, result[ 0 ]
      T.eq result.hi, result[ 1 ]
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DRA.Segment.from" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ null, null, "not implemented" ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = DRA.Segment.from probe
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DRA.segment_from_lohi" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ 1, 5, ],      [ 1, 5, ], ]
    [ [ 1, NaN, ],    null, 'hi boundary must be an infnumber', ]
    [ [ 1, ],         null, 'length must be 2', ]
    [ [ 100, -100, ], null, 'lo boundary must be less than or equal to hi boundary', ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = DRA.segment_from_lohi probe...
      T.ok Object.isFrozen result
      T.ok result instanceof DRA.Segment
      T.eq result.lo, result[ 0 ]
      T.eq result.hi, result[ 1 ]
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DRA.Interlap.from" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ null, null, "not implemented" ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = DRA.Interlap.from probe
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with single segment" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [ 10, 20, ], [ 1, 1, ], ], [ [ 1, 1, ], [ 10, 20, ], ], ]
    [ [ [ 10, 20, ], [ 1, 1, ], [ 5, 5, ], [ 18, 24, ] ], [ [ 1, 1, ], [ 5, 5, ], [ 10, 24, ], ], ]
    [ [ [ 100, Infinity, ], [ 80, 90, ], ], [ [ 80, 90, ], [ 100, Infinity, ] ] ]
    [ [ [ 100, Infinity, ], [ 80, 100, ], ], [ [ 80, Infinity, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, segments..., ] = probe
      result = DRA.interlap_from_segments first
      T.ok Object.isFrozen result
      for segment in segments
        [ lo, hi, ] = segment
        segment = DRA.segment_from_lohi lo, hi
        T.eq segment.lo, segment[ 0 ]
        next_result = DRA.union result, segment
        T.ok Object.isFrozen next_result
        T.ok next_result instanceof DRA.Interlap
        T.ok not CND.equals result, next_result
        result = next_result
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with multiple segments" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [], [ [ 1, 1, ], [ -3, -1, ], ] ], [ [ -3, -1, ], [ 1, 1, ], ] ]
    [ [ [], [ [ 1, 1, ], [ -3, 3, ], ] ], [ [ -3, 3, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, segments, ] = probe
      result = new DRA.Interlap first
      result = DRA.union result, segments...
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union with Interlap" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [], [ [ 1, 1, ], [ -3, -1, ], ] ], [ [ -3, -1, ], [ 1, 1, ], ] ]
    [ [ [], [ [ 1, 1, ], [ -3, 3, ], ] ], [ [ -3, 3, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, ranges, ] = probe
      result  = new DRA.Interlap first
      ranges  = ( ( new DRA.Interlap [ range, ] ) for range in ranges )
      result  = DRA.union result, ranges...
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  DRA = require './discontinuous-range-arithmetics'
  info new DRA.Interlap           [ [ 1, 3, ], [ 5, 7, ] ]
  info DRA.interlap_from_segments   [ 1, 3, ], [ 5, 7, ]


############################################################################################################
if module is require.main then do =>
  # demo_1()
  test @
  # test @[ "DRA.interlap_from_segments" ]
  # test @[ "DRA.Interlap properties" ]
  # test @[ "DRA.new_segment" ]
  # test @[ "DRA.Segment.from" ]
  # test @[ "DRA.Interlap.from" ]
  # test @[ "DRA.segment_from_lohi" ]
  # test @[ "union with single segment" ]
  # test @[ "new DRA.Interlap" ]
  # test @[ "union with multiple segments" ]
  # test @[ "union with Interlap" ]


