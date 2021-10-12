
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/SQL-GENERATION'
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
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
r                         = String.raw


#-----------------------------------------------------------------------------------------------------------
@[ "_DBAY Sqlgen demo" ] = ( T, done ) ->
  # T?.halt_on_error()
  # { DBay }          = require H.dbay_path
  # db                = new DBay()
  Sqlgen            = get_Sqlgen()
  db                = new Sqlgen()
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab              = new Tbl { dba: db, }
  schema            = 'main'
  #.........................................................................................................
  db ->
    db SQL"""
      create table cities (
        id      integer not null primary key,
        name    text    not null,
        country text    not null )
      """
    debug '^334^', db.create_insert { schema, table: 'cities', }
    echo dtab._tabulate db SQL"select type, name from sqlite_schema;"
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( $name );", { name: 'cities', }
    debug '^33443^', db._get_fields { schema, name: 'cities', }
    echo dtab._tabulate ( row for _, row of db._get_fields { schema, name: 'cities', } )
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  @[ "_DBAY Sqlgen demo" ]()







