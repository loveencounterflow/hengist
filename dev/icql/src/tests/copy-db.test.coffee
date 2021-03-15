

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL/TESTS/MAIN'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
{ inspect, }              = require 'util'
xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'


#-----------------------------------------------------------------------------------------------------------
@[ "_mirror DB to memory" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  settings          = H.get_icql_settings true
  settings.echo     = true
  db                = ICQL.bind settings
  from_schema       = 'main'
  to_schema         = 'd2'
  db.create_tables_with_foreign_key()
  db.populate_tables_with_foreign_key()
  db.$.attach ':memory:', to_schema
  db.$.copy_schema from_schema, to_schema
  df1 = db.$.all_rows db.$.query "select * from #{db.$.as_identifier from_schema}.t1 order by key;"
  df2 = db.$.all_rows db.$.query "select * from #{db.$.as_identifier from_schema}.t2 order by id;"
  dt1 = db.$.all_rows db.$.query "select * from #{db.$.as_identifier to_schema}.t1 order by key;"
  dt2 = db.$.all_rows db.$.query "select * from #{db.$.as_identifier to_schema}.t2 order by id;"
  T.eq df1, dt1
  T.eq df2, dt2
  # rows              = db.$.all_rows db.select_from_tables_with_foreign_key()
  # debug '^3485^', rows
  # T.eq db.$.get_toposort(), []
  # db.$.clear()
  # T.eq db.$.get_toposort(), []
  # db.drop_tables_with_foreign_key()
  done() if done?



############################################################################################################
unless module.parent?
  # test @
  test @[ "_mirror DB to memory" ]
  # @[ "_mirror DB to memory" ]()


