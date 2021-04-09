

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
FS                        = require 'fs'
PATH                      = require 'path'
glob                      = require 'glob'
#-----------------------------------------------------------------------------------------------------------
time_now = ->
  t = process.hrtime()
  return "#{t[ 0 ]}" + "#{t[ 1 ]}".padStart 9, '0'

#-----------------------------------------------------------------------------------------------------------
demo_iohook = -> new Promise ( resolve ) =>
  iohook = require 'iohook'
  iohook.on 'keydown', ( d ) -> info d
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_tempy_directory()
  await demo_iohook()

