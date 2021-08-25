

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CLASS-WITH-BOUND-METHODS'
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
  declare
  validate }              = types


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class A

  constructor: ->
    # super()
    @property_for_bound = 'bound_method_on_a'
    @property_for_free  = 'free_method_on_a'
    return undefined

  bound_method_on_a:  => @property_for_bound
  free_method_on_a:   -> @property_for_free

A = Object.freeze A

#-----------------------------------------------------------------------------------------------------------
class B extends A

  constructor: ->
    super()
    @property_for_bound = 'bound_method_on_b'
    @property_for_free  = 'free_method_on_b'
    return undefined

#-----------------------------------------------------------------------------------------------------------
show = ( x ) ->
  whisper '----------------------------------------------'
  debug x
  debug type_of x
  # urge type_of x.bound_method_on_a
  # urge type_of x.free_method_on_a
  info x.bound_method_on_a()
  info x.free_method_on_a()
  { bound_method_on_a
    free_method_on_a } = x
  help bound_method_on_a()
  try help free_method_on_a() catch error then warn CND.reverse error.message


############################################################################################################
if module is require.main then do =>
  show new A()
  show new B()
  A.x = 42







