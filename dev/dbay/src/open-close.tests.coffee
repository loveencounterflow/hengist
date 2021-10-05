
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/OPEN-CLOSE'
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
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY open() 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay()
  schema              = 'aux'
  db.open { schema, }
  T?.eq db._dbs.aux.temporary, true
  T?.eq ( Object.keys db._dbs ).length, 2
  try
    db ->
      db SQL"create table aux.squares ( n int not null primary key, square int not null );"
      throw new Error 'xxx'
  catch error
    throw error unless error.message is 'xxx'
  info db.all_rows SQL"select * from sqlite_schema;"
  return done?()





############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "DBAY open() 1" ]
