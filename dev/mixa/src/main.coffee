
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/CL-PARSER'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = require './types'
{ isa
  validate
  cast
  type_of }               = types.export()
# CP                        = require 'child_process'
# defer                     = setImmediate
parse_argv                = require 'command-line-args'
misfit                    = Symbol 'misfit'
PATH                      = require 'path'
relpath                   = PATH.relative process.cwd(), __filename
{ freeze
  lets }                  = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
pluck = ( d, name, fallback = misfit ) ->
  R = d[ name ]
  delete d[ name ]
  unless R?
    return fallback unless fallback is misfit
    throw new Error "^cli@5477^ no such attribute: #{rpr name}"
  return R

