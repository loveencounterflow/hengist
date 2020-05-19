
'use strict'
# coffeelint: disable=max_line_length

############################################################################################################
CND                       = require 'cnd'
badge                     = 'SONIFICATION'
rpr                       = CND.rpr
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND

#-----------------------------------------------------------------------------------------------------------
@demo_notify = ( me ) ->
  playAlert = require('alert-sound-notify')
  playAlert() # Plays default alert "bottle"
  playAlert('purr')
  playAlert.volume(1.5)


