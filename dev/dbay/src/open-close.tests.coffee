
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
@[ "DBAY open() 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  db                  = new DBay()
  schema              = 'aux'
  db.open { schema, }
  T?.eq db._dbs.aux.temporary, true
  T?.eq ( Object.keys db._dbs ).length, 2
  try
    db ->
      db SQL"create table aux.squares ( n int not null primary key, square int not null );"
      throw new Error 'xxx'
  catch error
    throw error unless error.message is 'xxx'
  info db.all_rows SQL"select * from sqlite_schema;"
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "______ DBAY open multiple connections" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Random }          = require PATH.join H.dbay_path, 'lib/random'
  rnd                 = new Random()
  path1               = PATH.join '/dev/shm', rnd.get_random_filename()
  path2               = PATH.join '/dev/shm', rnd.get_random_filename()
  path3               = PATH.join '/dev/shm', rnd.get_random_filename()
  debug '^347654^', path1
  debug '^347654^', path2
  debug '^347654^', path3
  db = do ->
    ### Open all DBs separately, then attach them to a main DB; we can now write schema-less queries
    using the `DBay` instances under `db.schema.${schema}` as well as cross-DB (cross-schema) queries
    using the main `DBay` instance. ###
    one                 = new DBay { path: path1, temporary: true, }
    two                 = new DBay { path: path2, temporary: true, }
    db                  = new DBay { path: path3, temporary: true, }
    db.open { path: path1, schema: 'one', }
    db.open { path: path2, schema: 'two', }
    db.schema           = { one, two, }
    db.create_table_function
      name:       'dbay_schemas'
      parameters: []
      columns:    [ 'schema', ]
      rows:       ( -> yield [ schema, ] for schema of @schema ).bind db
    return db
  db.schema.one SQL"create table t1 ( x text primary key );"
  db.schema.one SQL"insert into t1 values ( 'first1' );"
  db.schema.two SQL"create table t2 ( x text primary key );"
  db.schema.two SQL"insert into t2 values ( 'first2' );"
  db.schema.one =>
    db.schema.one SQL"insert into t1 values ( 'foo' ), ( 'bar' ), ( 'baz' );"
    urge '^347-1^'; console.table db.schema.one.all_rows SQL"select * from t1;"
    urge '^347-2^'; console.table db.all_rows SQL"select * from t1;"
    urge '^347-3^'; console.table db.all_rows SQL"""
      select * from one.t1
      union all
      select * from two.t2;"""
    return null
  db SQL"insert into one.t1 values ( 'other1' );"
  urge '^347-4^'; console.table db.all_rows SQL"select * from one.t1;"
  urge '^347-5^'; console.table db.all_rows SQL"select * from two.t2;"
  urge '^347-5^'; console.table db.all_rows SQL"select * from dbay_schemas();"
  return done?()





############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DBAY open() 1" ]
  @[ "______ DBAY open multiple connections" ]()