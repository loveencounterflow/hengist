
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/DEMO'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ DBay }                  = require '../../../apps/dbay'
{ SQL }                   = DBay
{ Sql }                   = require '../../../apps/dbay/lib/sql'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_overview = ( db ) ->
  info '#############################################################################'
  H.tabulate "dbay_tables",                   db SQL"select * from dbay_tables"
  H.tabulate "dbay_unique_fields",            db SQL"select * from dbay_unique_fields"
  # H.tabulate "dbay_fields_1",                 db SQL"select * from dbay_fields_1"
  H.tabulate "dbay_fields",                   db SQL"select * from dbay_fields"
  # H.tabulate "dbay_foreign_key_clauses_1",    db SQL"select * from dbay_foreign_key_clauses_1"
  # H.tabulate "dbay_foreign_key_clauses_2",    db SQL"select * from dbay_foreign_key_clauses_2"
  # H.tabulate "dbay_foreign_key_clauses_3",    db SQL"select * from dbay_foreign_key_clauses_3"
  H.tabulate "dbay_foreign_key_clauses",      db SQL"select * from dbay_foreign_key_clauses"
  # H.tabulate "dbay_primary_key_clauses_1",    db SQL"select * from dbay_primary_key_clauses_1"
  H.tabulate "dbay_primary_key_clauses",      db SQL"select * from dbay_primary_key_clauses"
  # H.tabulate "dbay_field_clauses_1",          db SQL"select * from dbay_field_clauses_1"
  H.tabulate "dbay_field_clauses",            db SQL"select * from dbay_field_clauses"
  H.tabulate "dbay_create_table_clauses",     db SQL"select * from dbay_create_table_clauses"
  # H.tabulate "dbay_create_table_statements_1", db SQL"select * from dbay_create_table_statements_1"
  # H.tabulate "dbay_create_table_statements_2", db SQL"select * from dbay_create_table_statements_2"
  # H.tabulate "dbay_create_table_statements_3", db SQL"select * from dbay_create_table_statements_3"
  # H.tabulate "dbay_create_table_statements_4", db SQL"select * from dbay_create_table_statements_4"
  H.tabulate "dbay_create_table_statements",  db SQL"select * from dbay_create_table_statements"
  # H.tabulate "dbay_create_table_statements",  db SQL"""
  #   select
  #       lnr,
  #       tail,
  #       substring( txt, 1, 100 ) as txt
  #     from dbay_create_table_statements;"""
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_trash = ( cfg ) ->
  path            = PATH.resolve __dirname, '../../assets/dbay/demo-html-parsing.sqlite'
  { Mrg }         = require '../../../apps/dbay-mirage'
  db              = new DBay { path, }
  return null



############################################################################################################
if module is require.main then do =>
  # @demo_two_kinds_of_foreign_keys()
  @demo_trash()




