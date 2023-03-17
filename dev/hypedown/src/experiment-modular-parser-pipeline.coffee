
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/STOP-MARKERS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
# test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM
{ Pipeline }              = require '../../../apps/moonriver'

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


#===========================================================================================================
class Pipeline_module

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    GUY.props.hide @, 'types', types
    return @_build()

  #---------------------------------------------------------------------------------------------------------
  _build: ( value = null ) ->
    R = new Pipeline()
    for k in GUY.props.keys @, { hidden: true, }
      continue unless /^\$/.test k
      R.push d for d from @_walk_values @[ k ]
    return R

  #---------------------------------------------------------------------------------------------------------
  _walk_values: ( value ) ->
    value = new value() if @types.isa.class value
    #.......................................................................................................
    if @types.isa.function value
      return yield value unless value.name.startsWith '$'
      return yield value.call @
    #.......................................................................................................
    if @types.isa.list value
      for e in value
        yield d for d from @_walk_values e
      return null
    #.......................................................................................................
    if value instanceof Pipeline
      return yield value
    #.......................................................................................................
    throw new Error "^Pipeline_module@1^ unable to ingest #{rpr value}"


#===========================================================================================================
class P_1 extends Pipeline_module

  $p_1_1: -> p_1_1 = ( d ) -> help '$p_1_1'
  $p_1_2: -> p_1_2 = ( d ) -> help '$p_1_2'
  $p_1_3: -> p_1_3 = ( d ) -> help '$p_1_3'

#===========================================================================================================
class P_2 extends Pipeline_module

  $p_2_1: -> p_2_1 = ( d ) -> help '$p_2_1'
  $p_2_2: -> p_2_2 = ( d ) -> help '$p_2_2'
  $p_2_3: -> p_2_3 = ( d ) -> help '$p_2_3'

#===========================================================================================================
class P_12 extends Pipeline_module
  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    # R = new Pipeline()
    @push new P_1()
    @push new P_2()
    return undefined

#===========================================================================================================
class P_12_x extends Pipeline_module

  $: [
    direct_fn     =    ( d ) -> help 'direct_fn'
    $indirect_fn  = -> ( d ) -> help '$indirect_fn'
    new P_1()
    P_2
    ]


#===========================================================================================================
demo_1 = ->
  # whisper '^21^', '——————'
  # p = new Pipeline_module()
  whisper '^21^', '——————'
  p = new P_12()
  debug '^21^', p
  p.send 'x'
  p.run()
  whisper '^21^', '——————'
  p = new P_12_x()
  debug '^21^', p
  p.send 'x'
  p.run()
  return null


############################################################################################################
if require.main is module then do =>
  demo_1()

