

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
provide_copy_methods = ->

  #-----------------------------------------------------------------------------------------------------------
  @copy_to_memory = ( me, schema ) ->
    # debug '^3334^', ( k for k of me )
    # debug '^3334^', ( k for k of me.$.db )
    debug '^3334^', ( k for k of me.$ )
    debug '^3334^', me.$.db.attach
    @attach me, ':memory:', schema
    urge '^64656^', me.$.get_toposort()
    # for table in
    me.$.db.exec "create table #{schema}.a ( n integer );"
    urge '^64656^', "get_toposort 'main'", me.$.get_toposort 'main'
    urge '^64656^', "get_toposort schema", me.$.get_toposort schema
    urge '^64656^', me.$.all_rows me.$.catalog()
    help '^64656^', me.$.all_rows me.$.list_objects 'main'
    help '^64656^', me.$.all_rows me.$.list_objects schema
    urge '^64656^', me.$.all_rows me.$.list_schemas()
    info '^67888^', me.$.all_rows me.$.query "select * from #{schema}.a;"
    info '^67888^', me.$.all_rows me.$.query "select * from #{schema}.sqlite_schema;"
    # me.$.db.
    return null

  return null

#-----------------------------------------------------------------------------------------------------------
@[ "_mirror DB to memory" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  settings          = H.get_icql_settings true
  db                = ICQL.bind settings
  #################################
  provide_copy_methods.apply db.$
  db.$.copy_to_memory db, 'd2'
  #################################
  db.create_tables_with_foreign_key()
  db.populate_tables_with_foreign_key()
  rows              = db.$.all_rows db.select_from_tables_with_foreign_key()
  debug '^3485^', rows
  # T.eq db.$.get_toposort(), []
  db.$.clear()
  # T.eq db.$.get_toposort(), []
  # db.drop_tables_with_foreign_key()
  done() if done?



############################################################################################################
unless module.parent?
  # test @
  # test @[ "_mirror DB to memory" ]
  @[ "_mirror DB to memory" ]()


