

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
test                      = require '../../../../apps/guy-test'
jr                        = JSON.stringify
{ inspect, }              = require 'util'
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'
chance                    = new ( require 'chance' )()
types                     = new ( require 'intertype' ).Intertype
{ isa
  validate
  validate_list_of }      = types.export()

#-----------------------------------------------------------------------------------------------------------
is_new = ( x ) ->
  R = not is_new.cache.has x
  is_new.cache.set x, true
  return R
is_new.cache = new Map()


#-----------------------------------------------------------------------------------------------------------
@[ "reuse memory DB" ] = ( T, done ) ->
  ICQL              = require '../../../../apps/icql'
  settings          = H.get_icql_settings true
  settings.echo     = true
  db = null
  doit = ->
    db                = ICQL.bind settings
    schema            = 'd2'
    schema_x          = db.$.as_identifier schema
    db.$.attach ':memory:', schema
    db.$.execute "create table #{schema_x}.x ( id integer primary key );"
    db.$.execute "insert into #{schema_x}.x values ( 123 );"
    # db.$.close()
  #.........................................................................................................
  doit()
  doit()
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "mirror DB to memory" ] = ( T, done ) ->
  T.halt_on_error()
  ICQL              = require '../../../../apps/icql'
  settings          = H.get_icql_settings true
  debug '^78445^', settings
  # H.try_to_remove_file settings.db_path
  # return done()
  settings.echo     = true
  db                = ICQL.bind settings
  from_schema       = 'main'
  to_schema         = 'd2'
  pool              = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[] äöü壽'
  length            = 10
  get_name          = -> chance.string { pool, length, }
  names             = ( [ get_name(), get_name(), ] for _ in [ 1 .. 10 ] )
  #.........................................................................................................
  db.create_tables_with_foreign_key()
  db.populate_tables_with_foreign_key()
  db.$.execute "create view main.x as select * from t2 order by key desc;"
  ### NOTE following line tests whether inline comments are filtered out ###
  db.$.execute "create /* foo */ table main.[K1] ( id integer primary key, fk_k2 integer references [k2] ( id ) );"
  db.$.execute "create table main.[k2] ( id integer primary key, fk_k1 integer references [K1] ( id ) );"
  db.$.pragma "foreign_keys = off;"
  for id in [ 1 .. 9 ]
    db.$.execute "insert into main.[K1] values ( #{id}, #{id} );"
    db.$.execute "insert into main.[k2] values ( #{id}, #{id} );"
  db.$.pragma "foreign_keys = on;"
  #.........................................................................................................
  for [ table_name, field_name, ] in names
    table_name_x = db.$.as_identifier table_name
    field_name_x = db.$.as_identifier field_name
    db.$.execute "create table #{table_name_x} ( #{field_name_x} text );"
    for n in [ 1 .. 3 ]
      db.$.execute "insert into #{table_name_x} values ( ? );", get_name()
  #.........................................................................................................
  db.$.attach ':memory:', to_schema
  db.$.copy_schema from_schema, to_schema
  #.........................................................................................................
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
  # db.$.query "xxx"
  # throw new Error '^intentional-error@348374^'
  done() if done?



############################################################################################################
unless module.parent?
  test @
  # test @[ "reuse memory DB" ]
  # test @[ "mirror DB to memory" ]
  # @[ "mirror DB to memory" ]()

