
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { path, temporary: true, }
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { path, temporary: false, }
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { path, }
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay()
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { temporary: true, }
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { temporary: false, }
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
  { DBay }            = require H.dbay_path
  path                = PATH.resolve DBay.C.autolocation, 'dbay-create-and-query-a-table.sqlite'
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay { temporary: false, }
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
  { DBay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  path                = PATH.resolve DBay.C.autolocation, 'dbay-do.sqlite'
  db                  = new DBay { temporary: false, }
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
  { DBay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  path                = PATH.resolve DBay.C.autolocation, 'dbay-do.sqlite'
  db                  = new DBay { temporary: false, }
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
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  T?.throws /expected .*, got a float/, -> db 42
  T?.throws /expected .*, got a undefined/, -> db()
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db callable accepts function, begins, commits transaction" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
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

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY implicit tx can be configured" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  #.........................................................................................................
  db ->
    db SQL"drop table if exists texts;"
    db SQL"create table texts ( nr integer not null primary key, text text );"
  db { mode: 'deferred', }, ->
    db SQL"insert into texts values ( 3, 'third' );"
  db { mode: 'immediate', }, ->
    db SQL"insert into texts values ( 1, 'first' );"
  db { mode: 'exclusive', }, ->
    db SQL"insert into texts values ( ?, ? );", [ 2, 'second', ]
  #.........................................................................................................
  rows = db SQL"select * from texts order by nr;"
  rows = [ rows..., ]
  T?.eq rows, [ { nr: 1, text: 'first' }, { nr: 2, text: 'second' }, { nr: 3, text: 'third' } ]
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY can do explicit rollback in tx context handler" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db SQL"create table squares ( n int not null primary key, square int not null );"
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
    db SQL"rollback;"
  T?.eq ( db.all_rows SQL"select * from squares order by n;" ), []
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY tx rollback also reverts create table" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  #.........................................................................................................
  try
    db ->
      db SQL"create table squares ( n int not null primary key, square int not null );"
      db SQL"create table aux.squares ( n int not null primary key, square int not null );"
      throw new Error 'xxx'
  catch error
    throw error unless error.message is 'xxx'
  T?.eq ( db.all_rows SQL"select * from main.sqlite_schema;" ).length, 0
  T?.eq ( db.all_rows SQL"select * from aux.sqlite_schema;"  ).length, 0
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db.first_row returns `null` for empty result set" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  db SQL"create table squares ( n int not null primary key, square int not null );"
  #.........................................................................................................
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  T?.eq ( db.all_rows  SQL"select * from squares order by n;"     ).length, 3
  T?.eq ( db.first_row SQL"select * from squares order by n;"     ), { n: 10, square: 100, }
  T?.eq ( db.first_row SQL"select * from squares where n > 100;"  ), null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db.single_row returns throws error on empty result set" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  db SQL"create table squares ( n int not null primary key, square int not null );"
  #.........................................................................................................
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  T?.eq ( db.all_rows  SQL"select * from squares order by n;"     ).length, 3
  T?.eq ( db.single_row SQL"select * from squares order by n limit 1;"     ), { n: 10, square: 100, }
  T?.throws /expected 1 row, got 0/, -> db.single_row SQL"select * from squares where n > 100;"
  T?.throws /expected 1 row, got 3/, -> db.single_row SQL"select * from squares;"
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db.first_values walks over first value in all rows" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  db SQL"create table squares ( n int not null primary key, square int not null );"
  #.........................................................................................................
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  #.........................................................................................................
  do ->
    result = []
    for value from db.first_values SQL"select * from squares order by n desc;"
      result.push value
    T?.eq result, [ 12, 11, 10, ]
  #.........................................................................................................
  do ->
    result = []
    for value from db.first_values SQL"select square, n from squares order by n desc;"
      result.push value
    T?.eq result, [ 144, 121, 100 ]
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db.all_first_values returns list of first value in all rows" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  db SQL"create table squares ( n int not null primary key, square int not null );"
  #.........................................................................................................
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  #.........................................................................................................
  do ->
    result = db.all_first_values SQL"select * from squares order by n desc;"
    T?.eq result, [ 12, 11, 10, ]
  #.........................................................................................................
  do ->
    result = db.all_first_values SQL"select square, n from squares order by n desc;"
    T?.eq result, [ 144, 121, 100 ]
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY db.single_value returns single value or throws error" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  db                  = new DBay()
  db.open { schema: 'aux', }
  db SQL"create table squares ( n int not null primary key, square int not null );"
  #.........................................................................................................
  db ->
    for n in [ 10 .. 12 ]
      db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  #.........................................................................................................
  do ->
    result = db.single_value SQL"select n from squares order by n desc limit 1;"
    T?.eq result, 12
  #.........................................................................................................
  do ->
    T?.throws /expected 1 row, got 3/, ->
      db.single_value SQL"select square, n from squares order by n desc;"
  #.........................................................................................................
  do ->
    T?.throws /expected row with single field, got fields \[ 'square', 'n' \]/, ->
      db.single_value SQL"select square, n from squares order by n limit 1;"
  #.........................................................................................................
  do ->
    T?.throws /expected 1 row, got 0/, ->
      db.single_value SQL"select square, n from squares where n < 0;"
  #.........................................................................................................
  return done?()

# #-----------------------------------------------------------------------------------------------------------
# @[ "DBAY db.first_row() exhausts iterator" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   { DBay }            = require H.dbay_path
#   db                  = new DBay()
#   db SQL"create table squares ( n int not null primary key, square int not null );"
#   db ->
#     for n in [ 10 .. 12 ]
#       db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
#   sql = SQL"select * from squares order by n;"
#   T?.eq ( db.first_row sql ), { n: 10, square: 100 }
#   # T?.eq db._statements[ sql ].all(), []
#   urge [ ( db.query SQL"select * from squares;" )..., ]
#   info db.sqlt1
#   info [ db._statements[ sql ].iterate()..., ]
#   info [ db._statements[ sql ].iterate()..., ]
#   info [ db._statements[ sql ].iterate()..., ]
#   return done?()



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "DBAY create DB, insert, query values 1" ]
  # test @[ "DBAY db as callable" ]
  # @[ "DBAY create DB, table 2" ]()
  # test @[ "DBAY db callable checks types of arguments" ]
  # test @[ "DBAY tx rollback also reverts create table" ]
  # test @[ "DBAY db.first_row() exhausts iterator" ]
  # @[ "DBAY can do explicit rollback in tx context handler" ]()
  # test @[ "DBAY implicit tx can be configured" ]
  # test @[ "DBAY db.first_row returns `null` for empty result set" ]
  # test @[ "DBAY db.first_values walks over first value in all rows" ]
