
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/TRASH'
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
FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
MMX                       = require '../../../apps/multimix/lib/cataloguing'
X                         = require '../../../lib/helpers'

#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> X.tabulate query, db query

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY _trash_with_fs_open_do" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  { Random }          = require PATH.join H.dbay_path, 'lib/random'
  path                = PATH.join DBay.C.autolocation, ( new Random() ).get_random_filename 'txt'
  db                  = new DBay()
  #.........................................................................................................
  do =>
    overwrite = false
    result    = db._trash_with_fs_open_do path, 'txt', overwrite, ( { path: inner_path, fd, } ) ->
      T?.eq path, inner_path
      T?.ok isa.cardinal fd
      debug '^324-1^', { fd, path, }
      FS.writeSync fd, "a line of text\n"
      return { fd, path, }
    error = null
    T?.ok isa.object result
    try FS.writeSync result.fd, 'something\n' catch error
      warn error.code
      warn error.message
      T?.eq error.code, 'EBADF'
    T?.fail "^324-2^ expected error, got none" unless error?
  #.........................................................................................................
  do =>
    overwrite = false
    error     = null
    try
      db._trash_with_fs_open_do path, 'txt', overwrite, ->
    catch error
      warn error.code
      warn error.message
      T?.eq error.code, 'EEXIST'
    T?.fail "^324-3^ expected error, got none" unless error?
  #.........................................................................................................
  do =>
    overwrite = true
    result    = db._trash_with_fs_open_do path, 'txt', overwrite, ( { path: inner_path, fd, } ) ->
      T?.eq path, inner_path
      T?.ok isa.cardinal fd
      debug '^324-4^', { fd, path, }
      FS.writeSync fd, "a line of text\n"
      return { fd, path, }
    error = null
    T?.ok isa.object result
    try FS.writeSync result.fd, 'something\n' catch error
      warn error.code
      warn error.message
      T?.eq error.code, 'EBADF'
    T?.fail "^324-5^ expected error, got none" unless error?
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash basic functionality with create_trashlib()" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db.create_trashlib()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  result  = db.all_rows SQL"select * from dbay_create_table_statements;"
  result  = ( row.txt for row from result when not row.txt.startsWith '--' ).join '\n'
  debug result
  T?.eq result, """
    .bail on
    pragma foreign_keys = false;
    begin transaction;
    drop table if exists "first";
    drop table if exists "second";
    create table "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     );
    create table "second" (
        "x" integer,
        "y" text,
      foreign key ( "x" ) references "first" ( "a" ),
      foreign key ( "y" ) references "first" ( "b" )
     );
    commit;"""
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash relations" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db.create_trashlib()
  tabulate db, SQL"select name, type from sqlite_schema order by name;"
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash basic functionality with public API" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  result1 = db.trash_to_sql { walk: true, }
  result1 = ( row.txt for row from result1 when not row.txt.startsWith '--' ).join '\n'
  T?.eq result1, db.trash_to_sql().replace /--.*\n/g, ''
  T?.eq result1, """
    .bail on
    pragma foreign_keys = false;
    begin transaction;
    drop table if exists "first";
    drop table if exists "second";
    create table "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     );
    create table "second" (
        "x" integer,
        "y" text,
      foreign key ( "x" ) references "first" ( "a" ),
      foreign key ( "y" ) references "first" ( "b" )
     );
    commit;"""
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash works with empty DB" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  result1 = db.trash_to_sql { walk: true, }
  result1 = ( row.txt for row from result1 when not row.txt.startsWith '--' ).join '\n'
  T?.eq result1, db.trash_to_sql().replace /--.*\n/g, ''
  T?.eq result1, ''
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash works with implicit foreign keys" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( a integer not null, b text not null, foreign key ( a, b ) references first );
    """
  result  = db.trash_to_sql().replace /--.*\n/g, ''
  debug '^4233^', result
  T?.eq result, """
    .bail on
    pragma foreign_keys = false;
    begin transaction;
    drop table if exists "first";
    drop table if exists "second";
    create table "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     );
    create table "second" (
        "a" integer not null,
        "b" text not null,
      foreign key ( "a", "b" ) references "first" ( "a", "b" )
     );
    commit;"""
  return done?()

# #-----------------------------------------------------------------------------------------------------------
# @[ "DBAY walk over trash statements" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   { DBay }            = require H.dbay_path
#   { SQL  }            = DBay
#   db                  = new DBay()
#   db SQL"""
#     create table first ( a integer not null primary key, b text unique not null );
#     create table second ( x integer references first ( a ), y text references first ( b ) );
#     """
#   iterator = db.trash_to_sql { walk: true, }
#   echo rpr row for row from iterator
#   urge '----------'
#   echo rpr row for row from db SQL"select * from dbay_XXX_statements;"
#   return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash to file (1)" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Random }          = require PATH.join H.dbay_path, 'lib/random'
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  path    = PATH.join DBay.C.autolocation, ( new Random() ).get_random_filename 'sql'
  help "^534535^ writing db.trash() output to #{path}"
  result  = db.trash_to_sql { path, }
  T?.eq result, path
  result  = ( line for line from ( guy.fs.walk_lines path ) when not line.startsWith '--' ).join '\n'
  T?.eq result, """
    .bail on
    pragma foreign_keys = false;
    begin transaction;
    drop table if exists "first";
    drop table if exists "second";
    create table "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     );
    create table "second" (
        "x" integer,
        "y" text,
      foreign key ( "x" ) references "first" ( "a" ),
      foreign key ( "y" ) references "first" ( "b" )
     );
    commit;"""
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash to file (2)" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Random }          = require PATH.join H.dbay_path, 'lib/random'
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  path    = db.trash_to_sql { path: true, }
  help "^534535^ db.trash() output written to #{path}"
  result  = ( line for line from ( guy.fs.walk_lines path ) when not line.startsWith '--' ).join '\n'
  T?.eq result, """
    .bail on
    pragma foreign_keys = false;
    begin transaction;
    drop table if exists "first";
    drop table if exists "second";
    create table "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     );
    create table "second" (
        "x" integer,
        "y" text,
      foreign key ( "x" ) references "first" ( "a" ),
      foreign key ( "y" ) references "first" ( "b" )
     );
    commit;"""
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash to sqlite" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { Random }          = require PATH.join H.dbay_path, 'lib/random'
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  result    = db.trash_to_sqlite { path: false, }
  T?.eq ( type_of result ), 'buffer'
  path      = db.trash_to_sqlite { path: true, }
  help "^534535^ db.trash_to_sqlite() output written to #{path}"
  T?.eq ( type_of path ), 'text'
  sqlt      = DBay.new_bsqlt3_connection FS.readFileSync path
  statement = sqlt.prepare SQL"select * from sqlite_schema order by name;"
  sql       = ( row.sql for row from statement.iterate() ).join '\n'
  T?.eq sql, """
    CREATE TABLE "first" (
        "a" integer not null,
        "b" text not null unique,
      primary key ( "a" )
     )
    CREATE TABLE "second" (
        "x" integer,
        "y" text,
      foreign key ( "x" ) references "first" ( "a" ),
      foreign key ( "y" ) references "first" ( "b" )
     )\n
    """
  return done?()


############################################################################################################
if require.main is module then do =>
  test @
  # @[ "DBAY trash relations" ]()
  # @[ "DBAY trash basic functionality with create_trashlib()" ]()
  # test @[ "DBAY trash basic functionality with public API" ]
  # @[ "DBAY trash basic functionality with private API" ]()
  # @[ "DBAY trash basic functionality with public API" ]()
  # @[ "DBAY trash to file (1)" ]()
  # @[ "DBAY trash to file (2)" ]()
  # @[ "DBAY trash to sqlite" ]()
  # @[ "DBAY _trash_with_fs_open_do" ]()
  # @[ "DBAY walk over trash statements" ]()
  # test @[ "DBAY _trash_with_fs_open_do" ]
  # @[ "DBAY trash works with implicit foreign keys" ]()

