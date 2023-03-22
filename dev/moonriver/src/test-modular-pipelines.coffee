
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/MODULES'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
# H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
# { DATOM }                 = require '../../../apps/datom'
# { new_datom
#   lets
#   stamp     }             = DATOM



#-----------------------------------------------------------------------------------------------------------
get_modular_pipeline_classes = ->
  { Pipeline
    Pipeline_module } = require '../../../apps/moonriver'

  #=========================================================================================================
  class P_1 extends Pipeline_module

    $p_1_1: -> p_1_1 = ( d, send ) -> help '$p_1_1'; d.push '$p_1_1'; send d
    $p_1_2: -> p_1_2 = ( d, send ) -> help '$p_1_2'; d.push '$p_1_2'; send d
    $p_1_3: -> p_1_3 = ( d, send ) -> help '$p_1_3'; d.push '$p_1_3'; send d

  #=========================================================================================================
  class P_2 extends Pipeline_module

    $p_2_1: -> p_2_1 = ( d, send ) -> help '$p_2_1'; d.push '$p_2_1'; send d
    $p_2_2: -> p_2_2 = ( d, send ) -> help '$p_2_2'; d.push '$p_2_2'; send d
    $p_2_3: -> p_2_3 = ( d, send ) -> help '$p_2_3'; d.push '$p_2_3'; send d

  #=========================================================================================================
  class P_12 extends Pipeline_module

    #-------------------------------------------------------------------------------------------------------
    constructor: ->
      super()
      # R = new Pipeline()
      @push new P_1()
      @push new P_2()
      return undefined

  #=========================================================================================================
  p_4 = new Pipeline()
  p_4.push p_4_1 = ( d, send ) -> help 'p_4_1'; d.push 'p_4_1'; send d

  #=========================================================================================================
  class P_12_x extends Pipeline_module

    #-------------------------------------------------------------------------------------------------------
    $: [
      direct_fn     =    ( d, send ) -> help 'direct_fn';     d.push 'direct_fn';     send d
      $indirect_fn  = -> ( d, send ) -> help '$indirect_fn';  d.push '$indirect_fn';  send d
      new P_1()
      P_2
      p_4
      ]

  #=========================================================================================================
  class P_3 extends Pipeline_module
    foo: ( d, send ) -> d.push 'foo'; send d
    bar: ( d, send ) -> d.push 'bar'; send d
    baz: p_4_1

  #=========================================================================================================
  class P_empty extends Pipeline_module

  #=========================================================================================================
  class P_5 extends Pipeline_module
    foo: ( d, send ) -> d.push 'foo'; send d
    bar: ( d, send ) -> d.push 'bar'; send d
    empty: P_empty
    baz: p_4_1

  #=========================================================================================================
  return {
    P_1
    P_2
    P_12
    P_12_x
    P_3
    P_empty
    P_5 }

#-----------------------------------------------------------------------------------------------------------
@pipeline_modules_1 = ( T, done ) ->
  { Pipeline }              = require '../../../apps/moonriver'
  { P_1
    P_2
    P_12
    P_12_x
    P_3
    P_empty
    P_5     } = get_modular_pipeline_classes()
  #.........................................................................................................
  do ->
    p = new P_1()
    p.send []
    T?.eq p.run(), [ [ '$p_1_1', '$p_1_2', '$p_1_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_2()
    p.send []
    T?.eq p.run(), [ [ '$p_2_1', '$p_2_2', '$p_2_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_12()
    p.send []
    T?.eq p.run(), [ [ '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_12_x()
    p.send []
    T?.eq p.run(), [ [ 'direct_fn', '$indirect_fn', '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3', 'p_4_1' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_5()
    p.send []
    T?.eq p.run(), [ [ 'foo', 'bar', 'p_4_1' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_empty()
    p.send 1
    p.send 2
    p.send 3
    T?.eq p.run(), [ 1, 2, 3, ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@pipeline_modules_methods_called_with_current_context = ( T, done ) ->
  { Pipeline
    Pipeline_module } = require '../../../apps/moonriver'
  #.........................................................................................................
  class X extends Pipeline_module
    constructor: ->
      super()
      @foo = 'class X'
      return undefined
    $unbound_method: ->
      return unbound_method = ( d, send ) ->
        debug '^98-1^', @constructor.name
        send d ** 3
  #.........................................................................................................
  class Y extends Pipeline
    constructor: ->
      super()
      @foo = 'class Y'
      @push new X()
      return undefined
  #.........................................................................................................
  y = new Y()
  y.send 12
  y.send 34
  result = y.run_and_stop()
  T?.eq result, [ 1728, 39304 ]
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @pipeline_modules_1()
  # test @pipeline_modules_1
  # @pipeline_modules_methods_called_with_current_context()
  test @pipeline_modules_methods_called_with_current_context
