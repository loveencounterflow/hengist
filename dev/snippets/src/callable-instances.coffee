
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CALLABLE-INSTANCES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types.export()
MMX                       = require '../../../apps/multimix/lib/cataloguing'
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  class Fn extends Function
    constructor: ->
      super()
      fn = ( x ) =>
        debug '^2-1^', ( k for k of @ )
        debug '^2-2^', @
        debug '^2-3^', MMX.all_keys_of @
        debug '^2-4^', @other_method
        debug '^2-5^', @other_method()
        return x ** x
      Object.setPrototypeOf fn, @
      return fn
    other_method: -> urge '^2-6^', @
  debug '^2-7^', fn = new Fn
  debug '^2-7^', fn 42
  debug '^2-8^', fn.other_method
  debug '^2-8^', fn.other_method 42


#===========================================================================================================
### thx to https://stackoverflow.com/a/40878674/256361 ###
class Fn extends Function

  #---------------------------------------------------------------------------------------------------------
  @class_method: ( self ) ->
    self.prop_10 = 'prop_10'
    return null

  #---------------------------------------------------------------------------------------------------------
  @other_class_method: ( dis ) ->
    dis._self.prop_11 = 'prop_11'
    return null

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super '...P', 'return this._self._call(...P)'
    guy.props.def @,      'prop_1', enumerable: true, value: 'prop_1'
    @prop_2 =                                                'prop_2'
    self = @bind @
    guy.props.def @,      'prop_3', enumerable: true, value: 'prop_3'
    guy.props.def self,   'prop_4', enumerable: true, value: 'prop_4'
    @_self = self
    @prop_5 =                                                'prop_5'
    guy.props.def @_self, 'prop_6', enumerable: true, value: 'prop_6'
    @_self.prop_7 =                                          'prop_7'
    self.prop_8 =                                            'prop_8'
    @constructor.class_method self
    @constructor.other_class_method @
    return self

  #---------------------------------------------------------------------------------------------------------
  _call: ( a = 0, b = 0, c = 0 ) ->
    debug '^4-1^', @
    help '^5-1^', @prop_1
    help '^5-2^', @prop_2
    help '^5-3^', @prop_3
    help '^5-4^', @prop_4
    help '^5-5^', @prop_5
    help '^5-6^', @prop_6
    help '^5-7^', @prop_7
    help '^5-8^', @prop_8
    help '^5-10^', @prop_10
    help '^5-11^', @prop_11
    return a + b + c

  #---------------------------------------------------------------------------------------------------------
  other_method: ->
    urge '^4-2^', @
    urge '^3-1^', @prop_1
    urge '^3-2^', @prop_2
    urge '^3-3^', @prop_3
    urge '^3-4^', @prop_4
    urge '^3-5^', @prop_5
    urge '^3-6^', @prop_6
    urge '^3-7^', @prop_7
    urge '^3-8^', @prop_8
    urge '^3-10^', @prop_10
    urge '^3-11^', @prop_11

#-----------------------------------------------------------------------------------------------------------
test = ->
  fn = new Fn()
  info '^3-1^', fn
  info '^3-1^', fn.prop_1
  info '^3-2^', fn.prop_2
  info '^3-3^', fn.prop_3
  info '^3-4^', fn.prop_4
  info '^3-5^', fn.prop_5
  info '^3-6^', fn.prop_6
  info '^3-7^', fn.prop_7
  info '^3-8^', fn.prop_8
  info '^3-10^', fn.prop_10
  info '^3-11^', fn.prop_11
  info '^4-4^', fn 3, 4, 5
  fn.other_method()
  return null


############################################################################################################
if module is require.main then do =>
  test()


