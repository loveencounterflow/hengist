(function() {
  'use strict';
  var CND, H, MMX, PATH, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/TRASH';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  MMX = require('../../../apps/multimix/lib/cataloguing');

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash basic functionality with private API"] = function(T, done) {
    var DBay, SQL, db, result, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    db._implement_trash();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    result = db.all_rows(SQL`select * from dbay_create_table_statements;`);
    result = ((function() {
      var results;
      results = [];
      for (row of result) {
        if (!row.txt.startsWith('--')) {
          results.push(row.txt);
        }
      }
      return results;
    })()).join('\n');
    debug(result);
    if (T != null) {
      T.eq(result, `.bail on
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
commit;`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash basic functionality with public API"] = function(T, done) {
    var DBay, SQL, db, result, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    result = db.trash();
    result = ((function() {
      var results;
      results = [];
      for (row of result) {
        if (!row.txt.startsWith('--')) {
          results.push(row.txt);
        }
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(result, `.bail on
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
commit;`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash to file (1)"] = function(T, done) {
    var DBay, Random, SQL, db, line, path, result;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Random} = require(PATH.join(H.dbay_path, 'lib/random')));
    ({SQL} = DBay);
    db = new DBay();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    path = PATH.join(DBay.C.autolocation, (new Random()).get_random_filename());
    help(`^534535^ writing db.trash() output to ${path}`);
    result = db.trash({
      format: 'sql',
      path
    });
    if (T != null) {
      T.eq(result, path);
    }
    result = ((function() {
      var ref, results;
      ref = guy.fs.walk_lines(path);
      results = [];
      for (line of ref) {
        if (!line.startsWith('--')) {
          results.push(line);
        }
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(result, `.bail on
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
commit;`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash to file (2)"] = function(T, done) {
    var DBay, Random, SQL, db, line, path, result;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Random} = require(PATH.join(H.dbay_path, 'lib/random')));
    ({SQL} = DBay);
    db = new DBay();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    path = db.trash({
      format: 'sql',
      path: true
    });
    help(`^534535^ db.trash() output written to ${path}`);
    result = ((function() {
      var ref, results;
      ref = guy.fs.walk_lines(path);
      results = [];
      for (line of ref) {
        if (!line.startsWith('--')) {
          results.push(line);
        }
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(result, `.bail on
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
commit;`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "DBAY trash basic functionality with public API" ]
// @[ "DBAY trash basic functionality with private API" ]()
// @[ "DBAY trash basic functionality with public API" ]()
// @[ "DBAY trash to file (1)" ]()
// @[ "DBAY trash to file (2)" ]()

}).call(this);

//# sourceMappingURL=trash.tests.js.map