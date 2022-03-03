
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
class Pseudo_array extends Array

  #---------------------------------------------------------------------------------------------------------
  constructor: ( on_change ) ->
    super()
    GUY.props.hide @, 'on_change', on_change if on_change?
    # GUY.props.hide @, 'prv_length', 0
    @prv_length = 0
    return undefined

  #---------------------------------------------------------------------------------------------------------
  on_change: -> null

  #---------------------------------------------------------------------------------------------------------
  push:     ( P... ) -> R = super P...; @on_change(); return R
  pop:      ( P... ) -> R = super P...; @on_change(); return R
  unshift:  ( P... ) -> R = super P...; @on_change(); return R
  shift:    ( P... ) -> R = super P...; @on_change(); return R
  splice:   ( P... ) -> R = super P...; @on_change(); return R
  reduce:   ( P... ) -> R = super P...; @on_change(); return R
  map:      ( P... ) -> R = super P...; @on_change(); return R
  filter:   ( P... ) -> R = super P...; @on_change(); return R
  slice:    ( P... ) -> R = super P...; @on_change(); return R
  splice:   ( P... ) -> R = super P...; @on_change(); return R
  reverse:  ( P... ) -> R = super P...; @on_change(); return R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo = ->
  d = new Pseudo_array ->
    info '^348^', @length, ( @length - @prv_length ), rpr @
    @prv_length = @length
    return null

  d.push 42
  d.push 43
  d.splice 1, 0, 'a', 'b', 'c'
  urge '^948^', d
  urge '^948^', d.length
  return null


############################################################################################################
if module is require.main then do =>
  demo()







