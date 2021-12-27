

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'PREFIXER'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND


#-----------------------------------------------------------------------------------------------------------
prefix = ->
  info '^34534^'
  # debug date = Temporal.Now.plainDateISO()
  # info date.toString()
  { stdin
    stdout
    stderr }  = process
  stdin.setEncoding 'utf-8'
  # stdin.resume()
  stdin.on 'data', ( data ) =>
    now = new Date().toString()
    echo "#{now} #{line}" for line in data.split '\n'
  return null


############################################################################################################
if module is require.main then do =>
  prefix()





