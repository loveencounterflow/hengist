
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HDML/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'


#===========================================================================================================
class Hdml # extends String

  # #---------------------------------------------------------------------------------------------------------
  # constructor: ( tag, atrs ) ->
  #   super()
  #   @tag    = tag
  #   @atrs   = atrs
  #   return undefined

  # #---------------------------------------------------------------------------------------------------------
  # toString: ->
  #   return 'xxx'
  constructor: (__value__) ->
    # super()
    @__value__ = __value__
    # @length = (@__value__ = __value__ or "").length
  [Symbol.toPrimitive]: -> @__value__
  # [Symbol.toStringTag]: -> @__value__
  # toString: -> @__value__
  # valueOf: -> @__value__

#-----------------------------------------------------------------------------------------------------------
demo_stringlike_class = ->
  d = new Hdml 'hallöle'
  help '^64545-1^', d
  help '^64545-1^', rpr d
  echo '^64545-1^', d
  echo '^64545-1^', rpr d
  help '^64545-1^', String d
  help '^64545-2^', d.length
  help '^64545-3^', rpr d + d
  # help '^64545-4^', type_of d
  # help '^64545-5^', type_of d + d
  help '^64545-5^', [ d, d, ]
  help '^64545-5^', [ d, d, ].join '#'
  return null




############################################################################################################
if require.main is module then do =>
  demo_stringlike_class()


