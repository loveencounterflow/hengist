
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/CONSTRUCTION'
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
MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 1" ] = ( T, done ) ->
  ### explicit path, explicitly temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { path, temporary: true, }
  try
    debug '^447^', MMX.all_keys_of db
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok not DH.is_file db._dbs.main.path
  finally

    DH.unlink_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 2" ] = ( T, done ) ->
  ### explicit path, explicitly not temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { path, temporary: false, }
  try
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok DH.is_file db._dbs.main.path
  finally
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 3" ] = ( T, done ) ->
  ### explicit path, implicitly not temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { path, }
  try
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok DH.is_file db._dbs.main.path
  finally
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 4" ] = ( T, done ) ->
  ### implicit path, implicitly temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay()
  path                = null
  try
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok not DH.is_file db._dbs.main.path
  finally
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 5" ] = ( T, done ) ->
  ### implicit path, explicitly temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { temporary: true, }
  path                = null
  try
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok not DH.is_file db._dbs.main.path
  finally
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 6" ] = ( T, done ) ->
  ### implicit path, explicitly not temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { temporary: false, }
  path                = null
  try
    T?.ok DH.is_file db._dbs.main.path
    db.execute SQL"create table texts ( nr integer not null primary key, text text );"
    db.destroy()
    T?.ok DH.is_file db._dbs.main.path
  finally
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, insert, query values 1" ] = ( T, done ) ->
  ### implicit path, explicitly not temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-and-query-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { temporary: false, }
  try
    db.execute  SQL"drop table if exists texts;"
    db.execute  SQL"create table texts ( nr integer not null primary key, text text );"
    db.execute  SQL"insert into texts values ( 3, 'third' );"
    T?.throws /argument extra not allowed/, =>
      db.execute  SQL"insert into texts values ( ?, ? );", [ 4, 'fourth', ]
    db.query    SQL"insert into texts values ( 1, 'first' );"
    db.query    SQL"insert into texts values ( ?, ? );", [ 2, 'second', ]
    rows = db.query SQL"select * from texts order by nr;"
    T?.eq ( type_of rows ), 'statementiterator'
    T?.eq [ rows..., ], [ { nr: 1, text: 'first' }, { nr: 2, text: 'second' }, { nr: 3, text: 'third' } ]
  finally
    null
    DH.unlink_file db._dbs.main.path
  T?.ok not DH.is_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY do 1" ] = ( T, done ) ->
  ### implicit path, explicitly not temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-do.sqlite'
  db                  = new Dbay { temporary: false, }
  try
    db.do  SQL"drop table if exists texts;"
    db.do  SQL"create table texts ( nr integer not null primary key, text text );"
    db.do  SQL"insert into texts values ( 3, 'third' );"
    # T?.throws /argument extra not allowed/, =>
    #   db.do  SQL"insert into texts values ( 4,. ? );", [ 4, 'fourth', ]
    db.do    SQL"insert into texts values ( 1, 'first' );"
    db.do    SQL"insert into texts values ( ?, ? );", [ 2, 'second', ]
    rows = db.do SQL"select * from texts order by nr;"
    T?.eq ( type_of rows ), 'statementiterator'
    T?.eq [ rows..., ], [ { nr: 1, text: 'first' }, { nr: 2, text: 'second' }, { nr: 3, text: 'third' } ]
  finally
    DH.unlink_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db as callable" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-do.sqlite'
  db                  = new Dbay { temporary: false, }
  try
    db SQL"drop table if exists texts;"
    db SQL"create table texts ( nr integer not null primary key, text text );"
    db SQL"insert into texts values ( 3, 'third' );"
    # T?.throws /argument extra not allowed/, =>
    #   db  SQL"insert into texts values ( 4,. ? );", [ 4, 'fourth', ]
    db SQL"insert into texts values ( 1, 'first' );"
    db SQL"insert into texts values ( ?, ? );", [ 2, 'second', ]
    rows = db SQL"select * from texts order by nr;"
    T?.eq ( type_of rows ), 'statementiterator'
    rows = [ rows..., ]
    T?.eq rows, [ { nr: 1, text: 'first' }, { nr: 2, text: 'second' }, { nr: 3, text: 'third' } ]
  finally
    DH.unlink_file db._dbs.main.path
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db callable checks types of arguments" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  db                  = new Dbay()
  T?.throws /expected a text or a function, got a float/, -> db 42
  T?.throws /expected a text or a function, got a undefined/, -> db()
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db callable accepts function, begins, commits transaction" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-do.sqlite'
  db                  = new Dbay()
  #.........................................................................................................
  db ->
    db SQL"drop table if exists texts;"
    db SQL"create table texts ( nr integer not null primary key, text text );"
    db SQL"insert into texts values ( 3, 'third' );"
    db SQL"insert into texts values ( 1, 'first' );"
    db SQL"insert into texts values ( ?, ? );", [ 2, 'second', ]
    #.......................................................................................................
    T?.throws /cannot start a transaction within a transaction/, ->
      db ->
  #.........................................................................................................
  T?.throws /UNIQUE constraint failed: texts\.nr/, ->
    db ->
      db SQL"insert into texts values ( 3, 'third' );"
  #.........................................................................................................
  rows = db SQL"select * from texts order by nr;"
  rows = [ rows..., ]
  T?.eq rows, [ { nr: 1, text: 'first' }, { nr: 2, text: 'second' }, { nr: 3, text: 'third' } ]
  #.........................................................................................................
  return done?()



############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DBAY create DB, insert, query values 1" ]
  # test @[ "DBAY db as callable" ]
  # @[ "DBAY create DB, table 2" ]()
  # test @[ "DBAY db callable checks types of arguments" ]
  test @[ "DBAY db callable accepts function, begins, commits transaction" ]

