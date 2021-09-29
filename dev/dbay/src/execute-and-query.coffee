
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


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY create DB, table 1" ] = ( T, done ) ->
  ### explicit path, explicitly temporary ###
  T?.halt_on_error()
  { Dbay }            = require H.dbay_path
  path                = PATH.resolve Dbay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new Dbay { path, temporary: true, }
  try
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



############################################################################################################
if require.main is module then do =>
  test @
