
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

###

# Modular Pipeline

* derive pipeline module class from class `Pipeline_module`
* base class looks for methods on instance (prototype) whose names start with a dollar sign `$`
* each of these will be called, added to pipeline
* constructor returns new instance of a MoonRiver `Pipeline` containing the results of calling each `$`
  method
* ordering is preserved
* modules may in turn be combined
* can return list with
  * functions that when called return a transform; these transforms must have a name that starts with a
    dollar sign `$`
  * functions (whose name must not start with a dollar sign `$`)
  * instances of `Pipeline`
  * instances of (derivatives of) `Pipeline_module`
  * classes derivatived from `Pipeline_module` (will be instantiated)

###


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
  class P_12_x extends Pipeline_module

    #-------------------------------------------------------------------------------------------------------
    $: [
      direct_fn     =    ( d, send ) -> help 'direct_fn';     d.push 'direct_fn';     send d
      $indirect_fn  = -> ( d, send ) -> help '$indirect_fn';  d.push '$indirect_fn';  send d
      new P_1()
      P_2
      ]

  #=========================================================================================================
  class P_3 extends Pipeline_module
    foo: ( d, send ) -> d.push 'foo'; send d
    bar: ( d, send ) -> d.push 'bar'; send d

  #=========================================================================================================
  return {
    P_1
    P_2
    P_12
    P_12_x
    P_3 }

#-----------------------------------------------------------------------------------------------------------
@pipeline_modules_1 = ( T, done ) ->
  { Pipeline }              = require '../../../apps/moonriver'
  { P_1
    P_2
    P_12
    P_12_x
    P_3 } = get_modular_pipeline_classes()
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
    T?.eq p.run(), [ [ 'direct_fn', '$indirect_fn', '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3' ] ]
    return null
  #.........................................................................................................
  do ->
    p = new P_3()
    p.send []
    T?.eq p.run(), [ [ 'foo', 'bar' ] ]
    return null
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @pipeline_modules_1()
  test @pipeline_modules_1

