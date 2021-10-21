
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
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  path                = PATH.resolve DBay.C.autolocation, 'drb.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay()
  drb                 = new Drb { path, db, temporary: true, }
  dtab                = new Tbl { db, }
  schema              = drb.cfg.schema
  #.........................................................................................................
  db =>
    echo dtab._tabulate db SQL"select type, name from #{schema}.sqlite_schema;"
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'outlines' );"
  #.........................................................................................................
  #.........................................................................................................
  db =>
    echo dtab._tabulate db SQL"select * from #{schema}.pragma_table_info( 'fontnicks' );"
    echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
    echo dtab._tabulate db SQL"select * from #{schema}.fontnicks order by fontnick;"
  #.........................................................................................................
  return done?()





############################################################################################################
if require.main is module then do =>
  # test @
  @[ "DRB foobar" ]()



