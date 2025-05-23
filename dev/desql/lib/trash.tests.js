(function() {
  'use strict';
  var CND, FS, H, MMX, PATH, X, badge, debug, echo, equals, guy, help, info, isa, rpr, tabulate, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  FS = require('fs');

  H = require('../../dbay/lib/helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  MMX = require('../../../apps/multimix/lib/cataloguing');

  X = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  tabulate = function(db, query) {
    return X.tabulate(query, db(query));
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY _trash_with_fs_open_do"] = function(T, done) {
    var DBay, Random, SQL, db, path;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    ({Random} = require(PATH.join(H.dbay_path, 'lib/random')));
    path = PATH.join(DBay.C.autolocation, (new Random()).get_random_filename('txt'));
    db = new DBay();
    (() => {      //.........................................................................................................
      var error, overwrite, result;
      overwrite = false;
      result = db._trash_with_fs_open_do(path, 'txt', overwrite, function({
          path: inner_path,
          fd
        }) {
        if (T != null) {
          T.eq(path, inner_path);
        }
        if (T != null) {
          T.ok(isa.cardinal(fd));
        }
        debug('^324-1^', {fd, path});
        FS.writeSync(fd, "a line of text\n");
        return {fd, path};
      });
      error = null;
      if (T != null) {
        T.ok(isa.object(result));
      }
      try {
        FS.writeSync(result.fd, 'something\n');
      } catch (error1) {
        error = error1;
        warn(error.code);
        warn(error.message);
        if (T != null) {
          T.eq(error.code, 'EBADF');
        }
      }
      if (error == null) {
        return T != null ? T.fail("^324-2^ expected error, got none") : void 0;
      }
    })();
    (() => {      //.........................................................................................................
      var error, overwrite;
      overwrite = false;
      error = null;
      try {
        db._trash_with_fs_open_do(path, 'txt', overwrite, function() {});
      } catch (error1) {
        error = error1;
        warn(error.code);
        warn(error.message);
        if (T != null) {
          T.eq(error.code, 'EEXIST');
        }
      }
      if (error == null) {
        return T != null ? T.fail("^324-3^ expected error, got none") : void 0;
      }
    })();
    (() => {      //.........................................................................................................
      var error, overwrite, result;
      overwrite = true;
      result = db._trash_with_fs_open_do(path, 'txt', overwrite, function({
          path: inner_path,
          fd
        }) {
        if (T != null) {
          T.eq(path, inner_path);
        }
        if (T != null) {
          T.ok(isa.cardinal(fd));
        }
        debug('^324-4^', {fd, path});
        FS.writeSync(fd, "a line of text\n");
        return {fd, path};
      });
      error = null;
      if (T != null) {
        T.ok(isa.object(result));
      }
      try {
        FS.writeSync(result.fd, 'something\n');
      } catch (error1) {
        error = error1;
        warn(error.code);
        warn(error.message);
        if (T != null) {
          T.eq(error.code, 'EBADF');
        }
      }
      if (error == null) {
        return T != null ? T.fail("^324-5^ expected error, got none") : void 0;
      }
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash basic functionality with create_trashlib()"] = function(T, done) {
    var DBay, SQL, db, result, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    db.create_trashlib();
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
  this["DBAY trash relations"] = function(T, done) {
    var DBay, SQL, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    db.create_trashlib();
    tabulate(db, SQL`select name, type from sqlite_schema order by name;`);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash basic functionality with public API"] = function(T, done) {
    var DBay, SQL, db, result1, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    result1 = db.trash_to_sql({
      walk: true
    });
    result1 = ((function() {
      var results;
      results = [];
      for (row of result1) {
        if (!row.txt.startsWith('--')) {
          results.push(row.txt);
        }
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(result1, db.trash_to_sql().replace(/--.*\n/g, ''));
    }
    if (T != null) {
      T.eq(result1, `.bail on
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
  this["DBAY trash works with empty DB"] = function(T, done) {
    var DBay, SQL, db, result1, row;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    result1 = db.trash_to_sql({
      walk: true
    });
    result1 = ((function() {
      var results;
      results = [];
      for (row of result1) {
        if (!row.txt.startsWith('--')) {
          results.push(row.txt);
        }
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(result1, db.trash_to_sql().replace(/--.*\n/g, ''));
    }
    if (T != null) {
      T.eq(result1, '');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash works with implicit foreign keys"] = function(T, done) {
    var DBay, Desql, SQL, db, desql, result;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    ({Desql} = require('../../../apps/desql'));
    db = new DBay();
    desql = new Desql();
    desql.db = db/* TAINT should be possible to just pass in DB */
    desql.create_trashlib();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( a integer not null, b text not null, foreign key ( a, b ) references first );`);
    result = desql.trash_to_sql().replace(/--.*\n/g, '');
    debug('^4233^', result);
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
    "a" integer not null,
    "b" text not null,
  foreign key ( "a", "b" ) references "first" ( "a", "b" )
 );
commit;`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DBAY walk over trash statements" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   { DBay }            = require H.dbay_path
  //   { SQL  }            = DBay
  //   db                  = new DBay()
  //   db SQL"""
  //     create table first ( a integer not null primary key, b text unique not null );
  //     create table second ( x integer references first ( a ), y text references first ( b ) );
  //     """
  //   iterator = db.trash_to_sql { walk: true, }
  //   echo rpr row for row from iterator
  //   urge '----------'
  //   echo rpr row for row from db SQL"select * from dbay_XXX_statements;"
  //   return done?()

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
    path = PATH.join(DBay.C.autolocation, (new Random()).get_random_filename('sql'));
    help(`^534535^ writing db.trash() output to ${path}`);
    result = db.trash_to_sql({path});
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
    path = db.trash_to_sql({
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

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY trash to sqlite"] = function(T, done) {
    var DBay, Desql, Random, SQL, db, desql, path, result, row, sql, sqlt, statement;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Random} = require(PATH.join(H.dbay_path, 'lib/random')));
    ({SQL} = DBay);
    db = new DBay();
    db(SQL`create table first ( a integer not null primary key, b text unique not null );
create table second ( x integer references first ( a ), y text references first ( b ) );`);
    ({Desql} = require('../../../apps/desql'));
    desql = new Desql();
    desql.create_trashlib();
    result = desql.trash_to_sqlite({
      path: false
    });
    if (T != null) {
      T.eq(type_of(result), 'buffer');
    }
    path = desql.trash_to_sqlite({
      path: true
    });
    help(`^534535^ desql.trash_to_sqlite() output written to ${path}`);
    if (T != null) {
      T.eq(type_of(path), 'text');
    }
    sqlt = DBay.new_bsqlt3_connection(FS.readFileSync(path));
    statement = sqlt.prepare(SQL`select * from sqlite_schema order by name;`);
    sql = ((function() {
      var ref, results;
      ref = statement.iterate();
      results = [];
      for (row of ref) {
        results.push(row.sql);
      }
      return results;
    })()).join('\n');
    if (T != null) {
      T.eq(sql, `CREATE TABLE "first" (
    "a" integer not null,
    "b" text not null unique,
  primary key ( "a" )
 )
CREATE TABLE "second" (
    "x" integer,
    "y" text,
  foreign key ( "x" ) references "first" ( "a" ),
  foreign key ( "y" ) references "first" ( "b" )
 )\n`);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "DBAY trash relations" ]()
      // @[ "DBAY trash basic functionality with create_trashlib()" ]()
      // test @[ "DBAY trash basic functionality with public API" ]
      // @[ "DBAY trash basic functionality with private API" ]()
      // @[ "DBAY trash basic functionality with public API" ]()
      // @[ "DBAY trash to file (1)" ]()
      // @[ "DBAY trash to file (2)" ]()
      // @[ "DBAY trash to sqlite" ]()
      // test @[ "DBAY trash to sqlite" ]
      // @[ "DBAY _trash_with_fs_open_do" ]()
      // @[ "DBAY walk over trash statements" ]()
      // test @[ "DBAY _trash_with_fs_open_do" ]
      this["DBAY trash works with implicit foreign keys"]();
      return test(this["DBAY trash works with implicit foreign keys"]);
    })();
  }

}).call(this);

//# sourceMappingURL=trash.tests.js.map