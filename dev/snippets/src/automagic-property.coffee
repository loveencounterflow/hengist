

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'TEMPFILES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
def                       = Object.defineProperty
def_oneoff                = ( object, name, method ) ->
  def object, name,
    enumerable:   true
    configurable: true
    get: ->
      R = method()
      def object, name, enumerable: true, configurable: false, value: R
      return R

#-----------------------------------------------------------------------------------------------------------
demo_automagic_property = ->
  class X
    constructor: ->
      def_oneoff @, 'd', -> "difficult to compute"
      return undefined
  #---------------------------------------------------------------------------------------------------------
  x = new X()
  info '^3445^', x
  info '^3445^', Object.getOwnPropertyDescriptor x, 'd'
  info '^3445^', x.d
  info '^3445^', Object.getOwnPropertyDescriptor x, 'd'
  info '^3445^', x
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_tempy_directory()
  await demo_automagic_property()

