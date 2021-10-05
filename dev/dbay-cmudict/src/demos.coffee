
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-CMUDICT/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
types                     = new ( require 'intertype' ).Intertype
{ equals
  isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { DBay }          = require '../../../apps/dbay'
  { Cmud }          = require '../../../apps/dbay-cmudict'
  db                = new DBay()
  cmud              = new Cmud { db, create: true, }
  info cmud
  return null



############################################################################################################
if require.main is module then do =>
  # await demo_f()
  demo_1()

