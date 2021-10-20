
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/TESTS/BASIC'
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
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "DRB foobar" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  # path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  # db                  = new DBay { path, temporary: true, }
  # try
  #   debug '^447^', MMX.all_keys_of db
  #   T?.ok DH.is_file db._dbs.main.path
  #   db.execute SQL"create table texts ( nr integer not null primary key, text text );"
  #   db.destroy()
  #   T?.ok not DH.is_file db._dbs.main.path
  # finally
  #   DH.unlink_file db._dbs.main.path
  return done?()





############################################################################################################
if require.main is module then do =>
  test @
