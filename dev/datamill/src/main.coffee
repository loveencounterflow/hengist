

'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'DATAMILL-DEMO'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
defer                     = setImmediate
async                     = {}
sync                      = { concurrency: 1, }
# async                     = { async: true, }
#...........................................................................................................
DATAMILL 									= require '../../../apps/datamill'
{ isa
  validate
  cast
  type_of }               = DATAMILL.types
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()


#-----------------------------------------------------------------------------------------------------------
@demo = ->
	debug '^4554^', rpr ( k for k of DATAMILL )



############################################################################################################
if module is require.main then do =>
  await @demo()
  return null







