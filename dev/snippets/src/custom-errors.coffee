
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CUSTOM-ERRORS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()



#-----------------------------------------------------------------------------------------------------------
class X_error extends Error
  constructor: ( ref, message ) ->
    # super ( CND.grey ref ) + ' ' + ( CND.red CND.reverse message )
    super()
    @message  = "#{ref} (#{@constructor.name}) #{message}"
    @ref      = ref
    return undefined ### always return `undefined` from constructor ###

#-----------------------------------------------------------------------------------------------------------
class X_snytax_error extends X_error
  # constructor:
#-----------------------------------------------------------------------------------------------------------
demo = ->
  for clasz in [ X_error, X_snytax_error, ]
    try
      throw new clasz '^123^', "your message for #{clasz.name} here"
    catch error
      info()
      info '^1345^', "message:      ", error.message
      info '^1345^', "type_of:      ", type_of error
  return null


############################################################################################################
if module is require.main then do =>
  await demo()



