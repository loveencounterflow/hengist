
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
@[ "___________ DBAY open() 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay()
  schema              = 'aux'
  debug '^300-1^', db.open { schema, }
  debug '^300-1^', db._dbs
  db ->
    db SQL"create table aux.squares ( n int not null primary key, square int not null );"
  return done?()





############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "DBAY _get-autolocation" ]
  # test @[ "DBAY constructor arguments 1" ]
  # test @[ "DBAY instance has two connections" ]
  # test @[ "DBAY instance non-enumerable properties" ]