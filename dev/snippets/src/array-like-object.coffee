
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'PSEUDO-ARRAY'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
GUY                       = require 'guy'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types
# { Moonriver }             = require '../../../apps/moonriver'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Pseudo_array

  #---------------------------------------------------------------------------------------------------------
  constructor: ( on_change ) ->
    GUY.props.hide @, 'on_change', on_change if on_change?
    @d          = []
    @prv_length = 0
    return undefined

  #---------------------------------------------------------------------------------------------------------
  on_change: ( delta ) -> null

  #---------------------------------------------------------------------------------------------------------
  push:     ( x ) -> R = @d.push x;   @_on_change();  return R
  pop:            -> R = @d.pop();    @_on_change();  return R
  clear:          -> @d.length = 0;   @_on_change();  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo = ->
  d = new Pseudo_array ( delta ) ->
    info '^348^', @length, ( delta ), rpr @
    @prv_length = @length
    return null

  d.push 42
  d.push 43
  # d.splice 1, 0, 'a', 'b', 'c'
  urge '^948^', d
  urge '^948^', d.length
  return null


############################################################################################################
if module is require.main then do =>
  demo()







