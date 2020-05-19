
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
@[ "DRA.new_arange" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ null,   null, "must be a list" ]
    [ 42,     null, "must be a list" ]
    [ [ 42, ], null, "length must be 2" ]
    [ [ 10, 20, ], [ [ 10, 20, ], ], ]
    [ [ 20, 10, ], null, "lo boundary must be less than or equal to hi boundary" ]
    [ [ Infinity, 20, ], null, "lo boundary must be less than or equal to hi boundary" ]
    [ [ -Infinity, 20, ], [ [ -Infinity, 20, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = DRA.new_arange probe
      T.ok Object.isFrozen result
      resolve result
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
      result = DRA.new_segment probe...
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
    [ [ [ 1, 5, ], ], [ 1, 5, ], ]
    [ [ [ 1, NaN, ], ],    null, 'lo boundary must be an infnumber', ]
    [ [ [ 1, ], ],         null, 'length must be 2', ]
    [ [ [ 100, -100, ], ], null, 'lo boundary must be less than or equal to hi boundary', ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      result = DRA.Segment.from probe...
      T.ok Object.isFrozen result
      T.ok result instanceof DRA.Segment
      T.eq result.lo, result[ 0 ]
      T.eq result.hi, result[ 1 ]
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "union" ] = ( T, done ) ->
  DRA = require './discontinuous-range-arithmetics'
  probes_and_matchers = [
    [ [ [ 10, 20, ], [ 1, 1, ], [ 5, 5, ], [ 18, 24, ] ], [ [ 1, 1, ], [ 5, 5, ], [ 10, 24, ], ], ]
    [ [ [ 100, Infinity, ], [ 80, 90, ], ], [ [ 80, 90, ], [ 100, Infinity, ] ] ]
    [ [ [ 100, Infinity, ], [ 80, 100, ], ], [ [ 80, Infinity, ], ] ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ first, segments..., ] = probe
      result = DRA.new_arange first
      T.ok Object.isFrozen result
      # debug '^334^', result
      for segment in segments
        segment = DRA.new_segment segment
        T.eq segment.lo, segment[ 0 ]
        next_result = DRA.union result, segment
        debug '^334^', next_result, next_result.size
        T.ok Object.isFrozen next_result
        T.ok next_result instanceof DRA.Arange
        T.ok not CND.equals result, next_result
        result = next_result
      resolve result
  #.........................................................................................................
  done()
  return null



############################################################################################################
if module is require.main then do => # await do =>
  # debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
  # await @_demo()
  test @
  # test @[ "API" ]
  # test @[ "HTML: parse (1)" ]
  # test @[ "HTML: parse (1a)" ]
  # test @[ "HTML: parse (dubious)" ]
  # test @[ "INDENTATION: parse (1)" ]
  # test @[ "HTML: parse (2)" ]
  # test @[ "HTML.html_from_datoms (singular tags)" ]
  # test @[ "HTML Cupofhtml (1)" ]
  # test @[ "HTML Cupofhtml (2)" ]
  # test @[ "HTML._parse_compact_tagname" ]
