
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DESQL/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'
{ SQL  }                  = DBay


#-----------------------------------------------------------------------------------------------------------
@[ "XXXXXX" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  #.........................................................................................................
  done()

############################################################################################################
if modules is require.main then do =>
  test @






