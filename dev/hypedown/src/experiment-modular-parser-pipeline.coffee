
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

###


#===========================================================================================================
class Pipeline_module

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    GUY.props.hide @, 'types', types
    R = new Pipeline()
    for k in GUY.props.keys @, { hidden: true, }
      continue unless /^\$/.test k
      value = @[ k ]
      if @types.isa.function value
        R.push value.call @
      # else if value instanceof @constructor
      else if @types.isa.list value
        R.push x for x in value
      else
        throw new Error "^Pipeline_module@1^ unable to ingest #{rpr value}"
    return R


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
    new P_1()
    new P_2()
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

