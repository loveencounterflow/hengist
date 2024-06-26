
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/BASIC'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000


  # #.........................................................................................................
  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->


#-----------------------------------------------------------------------------------------------------------
@simple = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    p        = new Pipeline()
    p.push [ 1, 2, 3, 5, ]
    p.push [ 6, 7, 8, 9, ].values()
    p.push ( d, send ) -> send d * 2
    p.push ( d, send ) -> send d #; urge d
    p.push ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ 2, 12, 4, 14, 6, 16, 10, 18 ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@simple_with_generatorfunction = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    p        = new Pipeline()
    p.push ( send ) -> yield n for n in [ 1, 2, 3, 5, ]
    p.push ( d, send ) -> send d * 2
    p.push ( d, send ) -> send d #; urge d
    p.push ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@simple_with_generator = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    p        = new Pipeline()
    p.push ( ( send ) -> yield n for n in [ 1, 2, 3, 5, ] )()
    p.push ( d, send ) -> send d * 2
    p.push ( d, send ) -> send d #; urge d
    p.push ( d, send ) -> collector.push d #; help collector
    p.run()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "can access pipeline from within transform, get user area" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ '^4564^', ]
      ( d ) -> urge d
      #.....................................................................................................
      can_access_pipeline_1 = ( d ) ->
        if @ is p then T?.ok true
        else            T?.fail "^478-1^ not ok"
        return null
      #.....................................................................................................
      can_access_pipeline_2 = ( d, send ) ->
        send d
        if @ is p then T?.ok true
        else            T?.fail "^478-2^ not ok"
        return null
      #.....................................................................................................
      has_user_area = ( d, send ) ->
        send d
        if isa.object @user then  T?.ok true
        else                      T?.fail "^478-3^ not ok"
        return null
      #.....................................................................................................
      ]
    p = new Pipeline pipeline
    debug '^558^', p
    p.run()
    # T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncgenerator_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Async_pipeline }  = require '../../../apps/moonriver'
  count               = 0
  source              = -> await yield d for d in [ 3, 5, 7, 11, ]
  #.......................................................................................................
  p = new Async_pipeline()
  p.push source()
  p.push sync_square  = ( d, send ) ->                      send d * d
  p.push sync_show    = ( d       ) ->                      urge '^49-1^', d
  p.push async_square = ( d, send ) -> await after 0.05, -> send d * d
  p.push async_show   = ( d       ) -> await after 0.05, -> urge '^49-1^', d
  #.........................................................................................................
  info '^3424^', p
  result = await p.run()
  T?.eq result, [ 81, 625, 2401, 14641 ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncgeneratorfunction_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Async_pipeline }  = require '../../../apps/moonriver'
  count               = 0
  source              = -> await yield d for d in [ 3, 5, 7, 11, ]
  debug '^49-1^', source
  debug '^49-1^', source()
  debug '^49-1^', source().next
  #.......................................................................................................
  p = new Async_pipeline()
  p.push source
  p.push square = ( d, send ) -> send d * d
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = await p.run()
  info '^49-1^', result
  T?.eq result, [ 9, 25, 49, 121, ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncfunction_as_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY               = require '../../../apps/guy'
  { Async_pipeline
    $           }   = require '../../../apps/moonriver'
  count             = 0
  #.......................................................................................................
  p = new Async_pipeline()
  p.push Array.from '覚える'
  p.push ( d, send ) -> send await after 0.1, -> "(#{d})"
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = await p.run()
  info '^49-1^', result
  T?.eq result, [ '(覚)', '(え)', '(る)' ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_walk_with_async_pipeline = ( T, done ) ->
  # T?.halt_on_error()
  GUY               = require '../../../apps/guy'
  { Async_pipeline
    $           }   = require '../../../apps/moonriver'
  count             = 0
  #.......................................................................................................
  p = new Async_pipeline()
  p.push Array.from '覚える'
  p.push ( d, send ) -> send await after 0.1, -> "(#{d})"
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = []
  for await d from p.walk()
    result.push d
  info '^49-1^', result
  T?.eq result, [ '(覚)', '(え)', '(る)' ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_rundown = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline }  = require '../../../apps/moonriver'
  p             = new Pipeline()
  T?.eq ( p.types.type_of 'abc'                                               ), 'text'
  T?.eq ( p.types.type_of producer = -> 'def'                                 ), 'producer_fitting'
  T?.eq ( p.types.type_of [ 1, 2, ]                                           ), 'list'
  T?.eq ( p.types.type_of [ 6, 7, ].values()                                  ), 'arrayiterator'
  T?.eq ( p.types.type_of { x: 42, }                                          ), 'object'
  T?.eq ( p.types.type_of new Map [ [ 23, true, ], ]                          ), 'map'
  T?.eq ( p.types.type_of new Set 'xyz'                                       ), 'set'
  T?.eq ( p.types.type_of sync_transducer   = ( d, send ) -> send d           ), 'transducer_fitting'
  T?.eq ( p.types.type_of sync_observer     = ( d       ) -> info '^23-1^', d ), 'observer_fitting'
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@everything_sync = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  p = new Pipeline()
  p.push 'abc'
  p.push producer = -> 'def'
  p.push [ 1, 2, ]
  p.push [ 6, 7, ].values()
  p.push { x: 42, }
  p.push new Map [ [ 23, true, ], ]
  p.push new Set 'xyz'
  p.push sync_transducer   = ( d, send ) -> send d
  p.push sync_observer     = ( d       ) -> info '^23-1^', d
  result = p.run()
  help '^23-2^', result
  T?.eq result, [ 'a', 'd', 1, 6, [ 'x', 42 ], [ 23, true ], 'x', 'b', 'e', 2, 7, 'y', 'c', 'f', 'z' ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@everything_async = ( T, done ) ->
  # T?.halt_on_error()
  { Async_pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  p = new Async_pipeline()
  p.push 'abc'
  p.push producer = -> 'def'
  p.push [ 1, 2, ]
  p.push [ 6, 7, ].values()
  p.push { x: 42, }
  p.push new Map [ [ 23, true, ], ]
  p.push new Set 'xyz'
  p.push sync_transducer   = ( d, send ) -> send d
  p.push sync_observer     = ( d       ) -> info '^23-3^', d
  p.push async_transducer  = ( d, send ) -> send await after 0.01, -> d
  p.push async_observer    = ( d       ) -> await after 0.01, -> urge '^23-4^', d
  result = await p.run()
  help '^23-5^', result
  T?.eq result, [ 'a', 'd', 1, 6, [ 'x', 42 ], [ 23, true ], 'x', 'b', 'e', 2, 7, 'y', 'c', 'f', 'z' ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@empty_pipeline_transports_data = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  p = new Pipeline()
  p.send 1
  p.send 2
  p.send 3
  result = p.run()
  help '^23-2^', result
  T?.eq result, [ 1, 2, 3, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@empty_pipeline_is_noop_in_composition = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push plus_one_1 = ( d, send ) -> d++; send d
    p.push plus_one_2 = ( d, send ) -> d++; send d
    p.send 1
    p.send 2
    p.send 3
    help '^23-1^', p
    result = p.run()
    help '^23-2^', result
    T?.eq result, [ 3, 4, 5, ]
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push plus_one_1 = ( d, send ) -> d++; send d
    p.push new Pipeline()
    p.push plus_one_2 = ( d, send ) -> d++; send d
    p.send 1
    p.send 2
    p.send 3
    help '^23-3^', p
    result = p.run()
    help '^23-4^', result
    T?.eq result, [ 3, 4, 5, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@walk_run_stop_equivalence = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  matcher = [
    '___1234'
    '__12345'
    '_123456'
    '1234567'
    '2345678'
    '3456789'
    '456789_'
    '56789__'
    '6789___' ]
  #.........................................................................................................
  new_pipeline = ->
    p = new Pipeline()
    p.push TF.$window { min: -3, max: +3, empty: '_', }, ( ds, send ) ->
      info '^walk_run_stop_equivalence@1^', ds
      send ( "#{d}" for d in ds ).join ''
    return p
  #.........................................................................................................
  do =>
    result  = []
    p       = new_pipeline()
    for d in [ 1 .. 9 ]
      p.send d
      result.push e for e from p.walk()
    result.push e for e from p.stop_walk()
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    result  = []
    p       = new_pipeline()
    for d in [ 1 .. 9 ]
      p.send d
    result.push e for e from p.walk_and_stop()
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    result  = []
    p       = new_pipeline()
    for d in [ 1 .. 9 ]
      p.send d
      result = [ result..., p.walk()..., ]
    result = [ result..., p.stop_walk()..., ]
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    result  = null
    p       = new_pipeline()
    for d in [ 1 .. 9 ]
      p.send d
    result = p.run_and_stop()
    T?.eq result, matcher
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # await @can_use_asyncgenerator_as_source()
  # await @can_use_asyncgeneratorfunction_as_source()
  # @simple()
  # @types_rundown()
  # test @types_rundown
  # @everything_sync()
  # @everything_async()
  # test @everything_sync
  # test @everything_async
  # test @can_use_asyncgenerator_as_source
  # test @can_use_asyncgeneratorfunction_as_source
  # @can_use_asyncfunction_as_transform()
  # test @can_use_asyncfunction_as_transform
  # @simple_with_generatorfunction()
  # test @simple_with_generatorfunction
  # await @can_use_walk_with_async_pipeline()
  # await test @can_use_walk_with_async_pipeline
  # test @empty_pipeline_transports_data
  # test @empty_pipeline_is_noop_in_composition
  test @walk_run_stop_equivalence
  # test @

