
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
# FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY trash basic functionality with private API" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db._implement_trash()
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
@[ "DBAY trash basic functionality with public API" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  { SQL  }            = DBay
  db                  = new DBay()
  db SQL"""
    create table first ( a integer not null primary key, b text unique not null );
    create table second ( x integer references first ( a ), y text references first ( b ) );
    """
  result  = db.trash()
  result  = ( row.txt for row from result when not row.txt.startsWith '--' ).join '\n'
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
  path    = PATH.join DBay.C.autolocation, ( new Random() ).get_random_filename()
  help "^534535^ writing db.trash() output to #{path}"
  result  = db.trash { format: 'sql', path, }
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
  path    = db.trash { format: 'sql', path: true, }
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


############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "DBAY trash basic functionality with public API" ]
  # @[ "DBAY trash basic functionality with private API" ]()
  # @[ "DBAY trash basic functionality with public API" ]()
  # @[ "DBAY trash to file (1)" ]()
  # @[ "DBAY trash to file (2)" ]()


