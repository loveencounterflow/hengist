
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
    self._me.prop_11 = 'prop_11'
    return null

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    ### Call the `Function` prototype ###
    super '...P', 'return this._me.do(...P)'
    ### Define `@_me` as the bound version of `this`: ###
    @_me = @bind @
    ### Confusingly, instance attributes like `@_me.prop_7` must be tacked onto `@_me` *here*, but the
    `this` value within methods is `@_me`, so they refer to the *same* attribute as `@_me.prop_7`: ###
    guy.props.def @_me, 'prop_6', enumerable: true, value: 'prop_6'
    @_me.prop_7 =                                          'prop_7'
    @constructor.class_method @
    return @_me

  #---------------------------------------------------------------------------------------------------------
  do: ( a = 0, b = 0, c = 0 ) ->
    debug '^8-1^', @
    help '^8-2^', @prop_6
    help '^8-3^', @prop_7
    help '^8-4^', @prop_11
    # help '^8-4^', @_me ### undefined ###
    return a + b + c

  #---------------------------------------------------------------------------------------------------------
  other_method: ->
    urge '^8-5^', @
    urge '^8-6^', @prop_6
    urge '^8-7^', @prop_7
    urge '^8-8^', @prop_11
    # help '^8-4^', @_me ### undefined ###
    return null

#-----------------------------------------------------------------------------------------------------------
test = ->
  fn = new Fn()
  # { other_method, } = fn
  info '^8-9^', fn
  info '^8-10^', fn.prop_6
  info '^8-11^', fn.prop_7
  info '^8-12^', fn.prop_11
  info '^8-13^', fn 3, 4, 5
  info '^8-14^', fn.do 3, 4, 5
  info '^8-15^', fn.other_method()
  info '^8-16^', other_method = fn.other_method.bind fn
  info '^8-16^', other_method()
  # info '^8-15^', fn._me ### undefined ###
  return null


############################################################################################################
if module is require.main then do =>
  test()


