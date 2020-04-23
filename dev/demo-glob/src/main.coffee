
'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'BLOB'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
{ assign
  jr }                    = CND
# { lets
#   freeze }                = DATOM.export()
# types                     = require './types'
# { isa
#   validate
#   type_of }               = types
# Multimix                  = require 'multimix'
# MAIN                      = @
glob                      = require 'glob'
PATH                      = require 'path'

#-----------------------------------------------------------------------------------------------------------
@glob = ( pattern ) -> glob.sync pattern
  # validate.nonempty_text pattern


############################################################################################################
if module is require.main then do =>
  for pattern in process.argv[ 2 .. ]
    info pattern
    for path in @glob pattern
      urge path





