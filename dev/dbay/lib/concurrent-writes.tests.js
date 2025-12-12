(function() {
  'use strict';
  var E, GUY, H, PATH, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, new_xregex, plain, praise, r, rpr, sql_lexer, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY/sqlx'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  // X                         = require '../../../lib/helpers'
  r = String.raw;

  new_xregex = require('xregexp');

  E = require('../../../apps/dbay/lib/errors');

  equals = (require('util')).isDeepStrictEqual;

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  sql_lexer = require('../../../apps/dbay-sql-lexer');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_virtual_concurrent_writes = function(T, done) {
    var DBay, SQL, db, insert_number, my_path, result, select_numbers;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    //.........................................................................................................
    my_path = '/tmp/helo.db';
    db = new DBay({
      path: my_path
    });
    debug('^23-1^');
    db(function() {
      var i, insert_number, n, results;
      if ((db.all_rows(SQL`select name from sqlite_schema where name = 'numbers';`)).length === 0) {
        db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
      }
      //.......................................................................................................
      insert_number = db.prepare_insert({
        into: 'numbers',
        on_conflict: {
          update: true
        }
      });
      results = [];
      for (n = i = 0; i <= 10; n = ++i) {
        results.push(db(insert_number, {
          n,
          sqr: null
        }));
      }
      return results;
    });
    //.........................................................................................................
    select_numbers = db.prepare(SQL`select * from numbers order by n;`);
    insert_number = db.prepare_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      }
    });
    if (T != null) {
      T.eq(db.all_rows(select_numbers), [
        {
          n: 0,
          sqr: null
        },
        {
          n: 1,
          sqr: null
        },
        {
          n: 2,
          sqr: null
        },
        {
          n: 3,
          sqr: null
        },
        {
          n: 4,
          sqr: null
        },
        {
          n: 5,
          sqr: null
        },
        {
          n: 6,
          sqr: null
        },
        {
          n: 7,
          sqr: null
        },
        {
          n: 8,
          sqr: null
        },
        {
          n: 9,
          sqr: null
        },
        {
          n: 10,
          sqr: null
        }
      ]);
    }
    //.........................................................................................................
    db.with_deferred_write(function(write) {
      var d, results;
      results = [];
      for (d of db(select_numbers)) {
        results.push(write(insert_number, {
          n: d.n,
          sqr: d.n ** 2
        }));
      }
      return results;
    });
    //.........................................................................................................
    result = db.all_rows(select_numbers);
    if (T != null) {
      T.eq(result, [
        {
          n: 0,
          sqr: 0
        },
        {
          n: 1,
          sqr: 1
        },
        {
          n: 2,
          sqr: 4
        },
        {
          n: 3,
          sqr: 9
        },
        {
          n: 4,
          sqr: 16
        },
        {
          n: 5,
          sqr: 25
        },
        {
          n: 6,
          sqr: 36
        },
        {
          n: 7,
          sqr: 49
        },
        {
          n: 8,
          sqr: 64
        },
        {
          n: 9,
          sqr: 81
        },
        {
          n: 10,
          sqr: 100
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_concurrency_with_explicitly_two_connections = function(T, done) {
    var DBay, SQL, d, dbr, dbw, insert_number;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    dbr = new DBay();
    dbw = new DBay({
      path: dbr.cfg.path
    });
    if (T != null) {
      T.eq(dbr.get_journal_mode(), 'wal');
    }
    if (T != null) {
      T.eq(dbw.get_journal_mode(), 'wal');
    }
    //.........................................................................................................
    dbr(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
    insert_number = dbw.prepare_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      }
    });
    //.........................................................................................................
    dbr(function() {
      var i, n, results;
      results = [];
      for (n = i = 0; i <= 4; n = ++i) {
        results.push(dbr(insert_number, {
          n,
          sqr: null
        }));
      }
      return results;
    });
    (function() {      //.........................................................................................................
      var result;
      result = dbr.all_rows(SQL`select * from numbers order by n;`);
      return T != null ? T.eq(result, [
        {
          n: 0,
          sqr: null
        },
        {
          n: 1,
          sqr: null
        },
        {
          n: 2,
          sqr: null
        },
        {
          n: 3,
          sqr: null
        },
        {
          n: 4,
          sqr: null
        }
      ]) : void 0;
    })();
//.........................................................................................................
// dbr.with_transaction ->
    for (d of dbr(SQL`select * from numbers order by n;`)) {
      d.sqr = d.n ** 2;
      dbw(insert_number, d);
      d.n = d.n + 100;
      d.sqr = d.n ** 2;
      dbw(insert_number, d);
    }
    (function() {      //.........................................................................................................
      var result;
      result = dbr.all_rows(SQL`select * from numbers order by n;`);
      return T != null ? T.eq(result, [
        {
          n: 0,
          sqr: 0
        },
        {
          n: 1,
          sqr: 1
        },
        {
          n: 2,
          sqr: 4
        },
        {
          n: 3,
          sqr: 9
        },
        {
          n: 4,
          sqr: 16
        },
        {
          n: 100,
          sqr: 10000
        },
        {
          n: 101,
          sqr: 10201
        },
        {
          n: 102,
          sqr: 10404
        },
        {
          n: 103,
          sqr: 10609
        },
        {
          n: 104,
          sqr: 10816
        }
      ]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_concurrency_with_implicitly_two_connections = function(T, done) {
    (() => {
      var DBay, SQL, d, db, insert_number;
      ({DBay} = require('../../../apps/dbay'));
      ({SQL} = DBay);
      db = new DBay();
      if (T != null) {
        T.eq(db.get_journal_mode(), 'wal');
      }
      //.........................................................................................................
      db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
      insert_number = db.alt.prepare_insert({
        into: 'numbers',
        on_conflict: {
          update: true
        }
      });
      //.........................................................................................................
      db(function() {
        var i, n, results;
        results = [];
        for (n = i = 0; i <= 4; n = ++i) {
          results.push(db(insert_number, {
            n,
            sqr: null
          }));
        }
        return results;
      });
      (function() {        //.........................................................................................................
        var result;
        result = db.all_rows(SQL`select * from numbers order by n;`);
        return T != null ? T.eq(result, [
          {
            n: 0,
            sqr: null
          },
          {
            n: 1,
            sqr: null
          },
          {
            n: 2,
            sqr: null
          },
          {
            n: 3,
            sqr: null
          },
          {
            n: 4,
            sqr: null
          }
        ]) : void 0;
      })();
//.........................................................................................................
// db.with_transaction ->
      for (d of db(SQL`select * from numbers order by n;`)) {
        d.sqr = d.n ** 2;
        debug('Ω___1', insert_number.database.inTransaction);
        db(insert_number, d);
        d.n = d.n + 100;
        d.sqr = d.n ** 2;
        db(insert_number, d);
      }
      return (function() {        //.........................................................................................................
        var result;
        result = db.all_rows(SQL`select * from numbers order by n;`);
        return T != null ? T.eq(result, [
          {
            n: 0,
            sqr: 0
          },
          {
            n: 1,
            sqr: 1
          },
          {
            n: 2,
            sqr: 4
          },
          {
            n: 3,
            sqr: 9
          },
          {
            n: 4,
            sqr: 16
          },
          {
            n: 100,
            sqr: 10000
          },
          {
            n: 101,
            sqr: 10201
          },
          {
            n: 102,
            sqr: 10404
          },
          {
            n: 103,
            sqr: 10609
          },
          {
            n: 104,
            sqr: 10816
          }
        ]) : void 0;
      })();
    })();
    (() => {      //.........................................................................................................
      var DBay, SQL, db, insert_number;
      ({DBay} = require('../../../apps/dbay'));
      ({SQL} = DBay);
      db = new DBay();
      if (T != null) {
        T.eq(db.get_journal_mode(), 'wal');
      }
      //.........................................................................................................
      db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
      insert_number = db.alt.prepare_insert({
        into: 'numbers',
        on_conflict: {
          update: true
        }
      });
      //.........................................................................................................
      db(function() {
        var i, n, results;
        results = [];
        for (n = i = 0; i <= 4; n = ++i) {
          results.push(db(insert_number, {
            n,
            sqr: null
          }));
        }
        return results;
      });
      (function() {        //.........................................................................................................
        var result;
        result = db.all_rows(SQL`select * from numbers order by n;`);
        return T != null ? T.eq(result, [
          {
            n: 0,
            sqr: null
          },
          {
            n: 1,
            sqr: null
          },
          {
            n: 2,
            sqr: null
          },
          {
            n: 3,
            sqr: null
          },
          {
            n: 4,
            sqr: null
          }
        ]) : void 0;
      })();
      //.........................................................................................................
      db.with_transaction(() => {
        var d, results;
        results = [];
        for (d of db(SQL`select * from numbers order by n;`)) {
          d.sqr = d.n ** 2;
          db(insert_number, d);
          d.n = d.n + 100;
          d.sqr = d.n ** 2;
          results.push(db(insert_number, d));
        }
        return results;
      });
      return (function() {        //.........................................................................................................
        var result;
        result = db.all_rows(SQL`select * from numbers order by n;`);
        return T != null ? T.eq(result, [
          {
            n: 0,
            sqr: 0
          },
          {
            n: 1,
            sqr: 1
          },
          {
            n: 2,
            sqr: 4
          },
          {
            n: 3,
            sqr: 9
          },
          {
            n: 4,
            sqr: 16
          },
          {
            n: 100,
            sqr: 10000
          },
          {
            n: 101,
            sqr: 10201
          },
          {
            n: 102,
            sqr: 10404
          },
          {
            n: 103,
            sqr: 10609
          },
          {
            n: 104,
            sqr: 10816
          }
        ]) : void 0;
      })();
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_concurrency_with_single_connection = function(T, done) {
    var DBay, SQL, db, i, insert_number, n, upsert_number;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    if (T != null) {
      T.eq(db.get_journal_mode(), 'wal');
    }
    //.........................................................................................................
    db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
    // debug '^Ω___2', db.create_insert { into: 'numbers', }
    insert_number = SQL`insert into numbers ( n, sqr ) values ( $n, $sqr );`;
    // upsert_number = SQL"""
    //   insert into numbers ( n, sqr ) values ( $n, $sqr )
    //     on conflict ( n ) do update set sqr = $sqr;
    //   """
    upsert_number = db.create_insert({
      into: 'numbers',
      on_conflict: {
        update: true
      },
      returning: '*'
    });
    // debug 'Ω___3', db.create_insert { into: 'numbers', on_conflict: { update: true, }, }
    // debug 'Ω___4', rpr upsert_number.replace /\n\s*/g, ' '
    /* NOTE concurrency problem is caused—surprisingly!—by the `returning: '*'` clause */
    // debug 'Ω___5', rpr upsert_number_2 = db.create_insert { into: 'numbers', on_conflict: '( n ) do update set sqr = $sqr', }
    // debug 'Ω___6', rpr upsert_number_2 = db.create_insert { into: 'numbers', on_conflict: { update: true, }, }
    // debug 'Ω___7', rpr upsert_number_2 = db.create_insert { into: 'numbers', on_conflict: '( n ) do update set sqr = $sqr', returning: '*', }
    //.........................................................................................................
    db(SQL`begin;`);
    for (n = i = 0; i <= 4; n = ++i) {
      db(insert_number, {
        n,
        sqr: null
      });
    }
    db(SQL`commit;`);
    (function() {      //.........................................................................................................
      var result;
      result = db.all_rows(SQL`select * from numbers order by n;`);
      return T != null ? T.eq(result, [
        {
          n: 0,
          sqr: null
        },
        {
          n: 1,
          sqr: null
        },
        {
          n: 2,
          sqr: null
        },
        {
          n: 3,
          sqr: null
        },
        {
          n: 4,
          sqr: null
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var results, row;
      results = [];
      for (row of db(SQL`select * from numbers order by n;`)) {
        results.push(help('Ω___8', row));
      }
      return results;
    })();
    //.........................................................................................................
    // db SQL"""begin;"""
    info('Ω___9', "statement used for concurrent writes:");
    info('Ω__10', GUY.trm.white(GUY.trm.reverse(GUY.trm.bold(` ${upsert_number} `))));
    // db.with_transaction { mode: 'immediate', }, -> ### NOTE: 'immediate' and 'exclusive' will cause locking error ###
    db.with_transaction({
      mode: 'deferred'
    }, function()/* NOTE: 'deferred' is default */ {
      var d, results;
// db SQL"""begin immediate;"""
      results = [];
      for (d of db(SQL`select * from numbers order by n;`)) {
        d.sqr = d.n ** 2;
        debug('Ω__11', db.alt.first_row(upsert_number, d));
        d.n = d.n + 100;
        d.sqr = d.n ** 2;
        results.push(debug('Ω__12', db.alt.first_row(upsert_number, d)));
      }
      return results;
    });
    (function() {      // db SQL"""commit;"""
      //.........................................................................................................
      var result;
      result = db.all_rows(SQL`select * from numbers order by n;`);
      return T != null ? T.eq(result, [
        {
          n: 0,
          sqr: 0
        },
        {
          n: 1,
          sqr: 1
        },
        {
          n: 2,
          sqr: 4
        },
        {
          n: 3,
          sqr: 9
        },
        {
          n: 4,
          sqr: 16
        },
        {
          n: 100,
          sqr: 10000
        },
        {
          n: 101,
          sqr: 10201
        },
        {
          n: 102,
          sqr: 10404
        },
        {
          n: 103,
          sqr: 10609
        },
        {
          n: 104,
          sqr: 10816
        }
      ]) : void 0;
    })();
    (function() {      //.........................................................................................................
      var results, row;
      results = [];
      for (row of db(SQL`select * from numbers order by n;`)) {
        results.push(urge('Ω__13', row));
      }
      return results;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_concurrency_with_table_function = async function(T, done) {
    var DBay, SQL, db, numbers, schema, template_path, work_path;
    // T.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fn'
    })));
    debug({template_path, work_path});
    db = new DBay({
      path: work_path,
      schema
    });
    numbers = db.all_first_values(SQL`select n from nnt order by n;`);
    console.table(db.all_rows(SQL`select * from nnt order by n;`));
    //.........................................................................................................
    db.create_table_function({
      name: 're_matches',
      columns: ['match', 'capture'],
      parameters: ['text', 'pattern'],
      rows: function*(text, pattern) {
        var match, regex;
        regex = new RegExp(pattern, 'g');
        while ((match = regex.exec(text)) != null) {
          yield [match[0], match[1]];
        }
        return null;
      }
    });
    (() => {      //.........................................................................................................
      var d, insert_number, select_numbers, select_rows;
      insert_number = db.alt.prepare_insert({
        into: 'nnt'
      });
      select_numbers = SQL`select n from nnt order by n;`;
      select_rows = SQL`select
    *
  from
    nnt,
    re_matches( t, '^.*(point).*$' ) as rx
  order by rx.match;`;
      //.......................................................................................................
      console.table(db.all_rows(select_rows));
      if (T != null) {
        T.eq(db.all_first_values(select_numbers), [0, 1, 1.5, 2, 2.3, 3, 3.1, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      }
//.......................................................................................................
      for (d of db(select_rows)) {
        db(insert_number, {
          ...d,
          n: d.n + 100
        });
      }
      //.......................................................................................................
      console.table(db.all_rows(select_rows));
      if (T != null) {
        T.eq(db.all_first_values(select_numbers), [0, 1, 1.5, 2, 2.3, 3, 3.1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 101.5, 102.3, 103.1]);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @dbay_virtual_concurrent_writes()
      // @dbay_concurrency_with_explicitly_two_connections()
      // test @dbay_concurrency_with_explicitly_two_connections
      // test @dbay_concurrency_with_implicitly_two_connections
      // @dbay_concurrency_with_table_function()
      // test @dbay_concurrency_with_table_function
      // @dbay_concurrency_with_implicitly_two_connections()
      // test @dbay_concurrency_with_implicitly_two_connections
      return test(this);
    })();
  }

  // @dbay_concurrency_with_single_connection()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbmN1cnJlbnQtd3JpdGVzLnRlc3RzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLENBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxVQUFBLEVBQUEsS0FBQSxFQUFBLE1BQUEsRUFBQSxDQUFBLEVBQUEsR0FBQSxFQUFBLFNBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsUUFBQSxFQUFBLElBQUEsRUFBQSxPQUFBOzs7RUFJQSxHQUFBLEdBQTRCLE9BQUEsQ0FBUSxLQUFSOztFQUM1QixDQUFBLENBQUUsS0FBRixFQUNFLEtBREYsRUFFRSxJQUZGLEVBR0UsSUFIRixFQUlFLEtBSkYsRUFLRSxNQUxGLEVBTUUsSUFORixFQU9FLElBUEYsRUFRRSxPQVJGLENBQUEsR0FRNEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFSLENBQW9CLFdBQXBCLENBUjVCOztFQVNBLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLElBRkYsRUFHRSxHQUhGLENBQUEsR0FHNEIsR0FBRyxDQUFDLEdBSGhDLEVBZEE7OztFQW1CQSxJQUFBLEdBQTRCLE9BQUEsQ0FBUSx3QkFBUjs7RUFDNUIsSUFBQSxHQUE0QixPQUFBLENBQVEsTUFBUixFQXBCNUI7OztFQXNCQSxDQUFBLEdBQTRCLE9BQUEsQ0FBUSxXQUFSOztFQUM1QixLQUFBLEdBQTRCLElBQUksQ0FBRSxPQUFBLENBQVEsV0FBUixDQUFGLENBQXVCLENBQUMsU0FBNUIsQ0FBQTs7RUFDNUIsQ0FBQSxDQUFFLEdBQUYsRUFDRSxNQURGLEVBRUUsT0FG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bUQsRUFBbkQsRUFBdUQsRUFBdkQsRUFBMkQsS0FBM0QsRUFBa0UsS0FBbEUsRUFBeUUsS0FBekUsQ0FBOUM7O0FBQ0EsYUFBTztJQW5CTixDQUFBO3dDQXFCSDtFQTNDc0MsRUE1T3hDOzs7RUEyUkEsSUFBRyxPQUFPLENBQUMsSUFBUixLQUFnQixNQUFuQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBLEVBQUE7Ozs7Ozs7OzthQVNoQyxJQUFBLENBQUssSUFBTDtJQVRnQyxDQUFBLElBQWxDOzs7RUEzUkE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ0RCQVkvc3FseCdcbnsgcnByXG4gIGluc3BlY3RcbiAgZWNob1xuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcbiMgRlMgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2ZzJ1xuSCAgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4vaGVscGVycydcbnR5cGVzICAgICAgICAgICAgICAgICAgICAgPSBuZXcgKCByZXF1aXJlICdpbnRlcnR5cGUnICkuSW50ZXJ0eXBlXG57IGlzYVxuICBlcXVhbHNcbiAgdHlwZV9vZlxuICB2YWxpZGF0ZSB9ICAgICAgICAgICAgICA9IHR5cGVzXG4jIFggICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9saWIvaGVscGVycydcbnIgICAgICAgICAgICAgICAgICAgICAgICAgPSBTdHJpbmcucmF3XG5uZXdfeHJlZ2V4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSAneHJlZ2V4cCdcbkUgICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXkvbGliL2Vycm9ycydcbmVxdWFscyAgICAgICAgICAgICAgICAgICAgPSAoIHJlcXVpcmUgJ3V0aWwnICkuaXNEZWVwU3RyaWN0RXF1YWxcbnsgVGJsLCB9ICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2ljcWwtZGJhLXRhYnVsYXRlJ1xuZHRhYiAgICAgICAgICAgICAgICAgICAgICA9IG5ldyBUYmwgeyBkYmE6IG51bGwsIH1cbnNxbF9sZXhlciAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXktc3FsLWxleGVyJ1xuXG5cbiM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuI1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AZGJheV92aXJ0dWFsX2NvbmN1cnJlbnRfd3JpdGVzID0gKCBULCBkb25lICkgLT5cbiAgeyBEQmF5IH0gICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgeyBTUUwgIH0gICAgICAgICAgICA9IERCYXlcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBteV9wYXRoID0gJy90bXAvaGVsby5kYidcbiAgZGIgICAgICA9IG5ldyBEQmF5IHsgcGF0aDogbXlfcGF0aCwgfVxuICBkZWJ1ZyAnXjIzLTFeJ1xuICBkYiAtPlxuICAgIGlmICggZGIuYWxsX3Jvd3MgU1FMXCJzZWxlY3QgbmFtZSBmcm9tIHNxbGl0ZV9zY2hlbWEgd2hlcmUgbmFtZSA9ICdudW1iZXJzJztcIiApLmxlbmd0aCBpcyAwXG4gICAgICBkYiBTUUxcIlwiXCJjcmVhdGUgdGFibGUgbnVtYmVycyAoXG4gICAgICAgIG4gICBpbnRlZ2VyIG5vdCBudWxsIHByaW1hcnkga2V5LFxuICAgICAgICBzcXIgaW50ZWdlciApO1wiXCJcIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgaW5zZXJ0X251bWJlciA9IGRiLnByZXBhcmVfaW5zZXJ0IHsgaW50bzogJ251bWJlcnMnLCBvbl9jb25mbGljdDogeyB1cGRhdGU6IHRydWUsIH0sIH1cbiAgICBkYiBpbnNlcnRfbnVtYmVyLCB7IG4sIHNxcjogbnVsbCwgfSBmb3IgbiBpbiBbIDAgLi4gMTAgXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHNlbGVjdF9udW1iZXJzICA9IGRiLnByZXBhcmUgU1FMXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlxuICBpbnNlcnRfbnVtYmVyICAgPSBkYi5wcmVwYXJlX2luc2VydCB7IGludG86ICdudW1iZXJzJywgb25fY29uZmxpY3Q6IHsgdXBkYXRlOiB0cnVlLCB9LCB9XG4gIFQ/LmVxICggZGIuYWxsX3Jvd3Mgc2VsZWN0X251bWJlcnMgKSwgWyB7IG46IDAsIHNxcjogbnVsbCB9LCB7IG46IDEsIHNxcjogbnVsbCB9LCB7IG46IDIsIHNxcjogbnVsbCB9LCB7IG46IDMsIHNxcjogbnVsbCB9LCB7IG46IDQsIHNxcjogbnVsbCB9LCB7IG46IDUsIHNxcjogbnVsbCB9LCB7IG46IDYsIHNxcjogbnVsbCB9LCB7IG46IDcsIHNxcjogbnVsbCB9LCB7IG46IDgsIHNxcjogbnVsbCB9LCB7IG46IDksIHNxcjogbnVsbCB9LCB7IG46IDEwLCBzcXI6IG51bGwgfSBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZGIud2l0aF9kZWZlcnJlZF93cml0ZSAoIHdyaXRlICkgLT5cbiAgICBmb3IgZCBmcm9tIGRiIHNlbGVjdF9udW1iZXJzXG4gICAgICB3cml0ZSBpbnNlcnRfbnVtYmVyLCB7IG46IGQubiwgc3FyOiBkLm4gKiogMiwgfVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJlc3VsdCA9IGRiLmFsbF9yb3dzIHNlbGVjdF9udW1iZXJzXG4gIFQ/LmVxIHJlc3VsdCwgWyB7IG46IDAsIHNxcjogMCB9LCB7IG46IDEsIHNxcjogMSB9LCB7IG46IDIsIHNxcjogNCB9LCB7IG46IDMsIHNxcjogOSB9LCB7IG46IDQsIHNxcjogMTYgfSwgeyBuOiA1LCBzcXI6IDI1IH0sIHsgbjogNiwgc3FyOiAzNiB9LCB7IG46IDcsIHNxcjogNDkgfSwgeyBuOiA4LCBzcXI6IDY0IH0sIHsgbjogOSwgc3FyOiA4MSB9LCB7IG46IDEwLCBzcXI6IDEwMCB9IF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lPygpXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGRiYXlfY29uY3VycmVuY3lfd2l0aF9leHBsaWNpdGx5X3R3b19jb25uZWN0aW9ucyA9ICggVCwgZG9uZSApIC0+XG4gIHsgREJheSB9ICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gIHsgU1FMICB9ICAgICAgICAgICAgPSBEQmF5XG4gIGRiciAgICAgICAgICAgICAgICAgPSBuZXcgREJheSgpXG4gIGRidyAgICAgICAgICAgICAgICAgPSBuZXcgREJheSB7IHBhdGg6IGRici5jZmcucGF0aCwgfVxuICBUPy5lcSBkYnIuZ2V0X2pvdXJuYWxfbW9kZSgpLCAnd2FsJ1xuICBUPy5lcSBkYncuZ2V0X2pvdXJuYWxfbW9kZSgpLCAnd2FsJ1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRiciBTUUxcIlwiXCJjcmVhdGUgdGFibGUgbnVtYmVycyAoXG4gICAgbiAgIGludGVnZXIgbm90IG51bGwgcHJpbWFyeSBrZXksXG4gICAgc3FyIGludGVnZXIgKTtcIlwiXCJcbiAgaW5zZXJ0X251bWJlciA9IGRidy5wcmVwYXJlX2luc2VydCB7IGludG86ICdudW1iZXJzJywgb25fY29uZmxpY3Q6IHsgdXBkYXRlOiB0cnVlLCB9LCB9XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZGJyIC0+XG4gICAgZm9yIG4gaW4gWyAwIC4uIDQgXVxuICAgICAgZGJyIGluc2VydF9udW1iZXIsIHsgbiwgc3FyOiBudWxsLCB9XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG8gLT5cbiAgICByZXN1bHQgPSBkYnIuYWxsX3Jvd3MgU1FMXCJcIlwic2VsZWN0ICogZnJvbSBudW1iZXJzIG9yZGVyIGJ5IG47XCJcIlwiXG4gICAgVD8uZXEgcmVzdWx0LCBbIHsgbjogMCwgc3FyOiBudWxsIH0sIHsgbjogMSwgc3FyOiBudWxsIH0sIHsgbjogMiwgc3FyOiBudWxsIH0sIHsgbjogMywgc3FyOiBudWxsIH0sIHsgbjogNCwgc3FyOiBudWxsIH0gXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgZGJyLndpdGhfdHJhbnNhY3Rpb24gLT5cbiAgZm9yIGQgZnJvbSBkYnIgU1FMXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlxuICAgIGQuc3FyID0gZC5uICoqIDJcbiAgICBkYncgaW5zZXJ0X251bWJlciwgZFxuICAgIGQubiA9IGQubiArIDEwMFxuICAgIGQuc3FyID0gZC5uICoqIDJcbiAgICBkYncgaW5zZXJ0X251bWJlciwgZFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvIC0+XG4gICAgcmVzdWx0ID0gZGJyLmFsbF9yb3dzIFNRTFwiXCJcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXCJcIlxuICAgIFQ/LmVxIHJlc3VsdCwgWyB7IG46IDAsIHNxcjogMCB9LCB7IG46IDEsIHNxcjogMSB9LCB7IG46IDIsIHNxcjogNCB9LCB7IG46IDMsIHNxcjogOSB9LCB7IG46IDQsIHNxcjogMTYgfSwgeyBuOiAxMDAsIHNxcjogMTAwMDAgfSwgeyBuOiAxMDEsIHNxcjogMTAyMDEgfSwgeyBuOiAxMDIsIHNxcjogMTA0MDQgfSwgeyBuOiAxMDMsIHNxcjogMTA2MDkgfSwgeyBuOiAxMDQsIHNxcjogMTA4MTYgfSBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBkYmF5X2NvbmN1cnJlbmN5X3dpdGhfaW1wbGljaXRseV90d29fY29ubmVjdGlvbnMgPSAoIFQsIGRvbmUgKSAtPlxuICBkbyA9PlxuICAgIHsgREJheSB9ICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gICAgeyBTUUwgIH0gICAgICAgICAgICA9IERCYXlcbiAgICBkYiAgICAgICAgICAgICAgICAgID0gbmV3IERCYXkoKVxuICAgIFQ/LmVxIGRiLmdldF9qb3VybmFsX21vZGUoKSwgJ3dhbCdcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZGIgU1FMXCJcIlwiY3JlYXRlIHRhYmxlIG51bWJlcnMgKFxuICAgICAgbiAgIGludGVnZXIgbm90IG51bGwgcHJpbWFyeSBrZXksXG4gICAgICBzcXIgaW50ZWdlciApO1wiXCJcIlxuICAgIGluc2VydF9udW1iZXIgPSBkYi5hbHQucHJlcGFyZV9pbnNlcnQgeyBpbnRvOiAnbnVtYmVycycsIG9uX2NvbmZsaWN0OiB7IHVwZGF0ZTogdHJ1ZSwgfSwgfVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkYiAtPlxuICAgICAgZm9yIG4gaW4gWyAwIC4uIDQgXVxuICAgICAgICBkYiBpbnNlcnRfbnVtYmVyLCB7IG4sIHNxcjogbnVsbCwgfVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkbyAtPlxuICAgICAgcmVzdWx0ID0gZGIuYWxsX3Jvd3MgU1FMXCJcIlwic2VsZWN0ICogZnJvbSBudW1iZXJzIG9yZGVyIGJ5IG47XCJcIlwiXG4gICAgICBUPy5lcSByZXN1bHQsIFsgeyBuOiAwLCBzcXI6IG51bGwgfSwgeyBuOiAxLCBzcXI6IG51bGwgfSwgeyBuOiAyLCBzcXI6IG51bGwgfSwgeyBuOiAzLCBzcXI6IG51bGwgfSwgeyBuOiA0LCBzcXI6IG51bGwgfSBdXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICMgZGIud2l0aF90cmFuc2FjdGlvbiAtPlxuICAgIGZvciBkIGZyb20gZGIgU1FMXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlxuICAgICAgZC5zcXIgPSBkLm4gKiogMlxuICAgICAgZGVidWcgJ86pX19fMScsIGluc2VydF9udW1iZXIuZGF0YWJhc2UuaW5UcmFuc2FjdGlvblxuICAgICAgZGIgaW5zZXJ0X251bWJlciwgZFxuICAgICAgZC5uID0gZC5uICsgMTAwXG4gICAgICBkLnNxciA9IGQubiAqKiAyXG4gICAgICBkYiBpbnNlcnRfbnVtYmVyLCBkXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRvIC0+XG4gICAgICByZXN1bHQgPSBkYi5hbGxfcm93cyBTUUxcIlwiXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlwiXCJcbiAgICAgIFQ/LmVxIHJlc3VsdCwgWyB7IG46IDAsIHNxcjogMCB9LCB7IG46IDEsIHNxcjogMSB9LCB7IG46IDIsIHNxcjogNCB9LCB7IG46IDMsIHNxcjogOSB9LCB7IG46IDQsIHNxcjogMTYgfSwgeyBuOiAxMDAsIHNxcjogMTAwMDAgfSwgeyBuOiAxMDEsIHNxcjogMTAyMDEgfSwgeyBuOiAxMDIsIHNxcjogMTA0MDQgfSwgeyBuOiAxMDMsIHNxcjogMTA2MDkgfSwgeyBuOiAxMDQsIHNxcjogMTA4MTYgfSBdXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG8gPT5cbiAgICB7IERCYXkgfSAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5J1xuICAgIHsgU1FMICB9ICAgICAgICAgICAgPSBEQmF5XG4gICAgZGIgICAgICAgICAgICAgICAgICA9IG5ldyBEQmF5KClcbiAgICBUPy5lcSBkYi5nZXRfam91cm5hbF9tb2RlKCksICd3YWwnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGRiIFNRTFwiXCJcImNyZWF0ZSB0YWJsZSBudW1iZXJzIChcbiAgICAgIG4gICBpbnRlZ2VyIG5vdCBudWxsIHByaW1hcnkga2V5LFxuICAgICAgc3FyIGludGVnZXIgKTtcIlwiXCJcbiAgICBpbnNlcnRfbnVtYmVyID0gZGIuYWx0LnByZXBhcmVfaW5zZXJ0IHsgaW50bzogJ251bWJlcnMnLCBvbl9jb25mbGljdDogeyB1cGRhdGU6IHRydWUsIH0sIH1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZGIgLT5cbiAgICAgIGZvciBuIGluIFsgMCAuLiA0IF1cbiAgICAgICAgZGIgaW5zZXJ0X251bWJlciwgeyBuLCBzcXI6IG51bGwsIH1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZG8gLT5cbiAgICAgIHJlc3VsdCA9IGRiLmFsbF9yb3dzIFNRTFwiXCJcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXCJcIlxuICAgICAgVD8uZXEgcmVzdWx0LCBbIHsgbjogMCwgc3FyOiBudWxsIH0sIHsgbjogMSwgc3FyOiBudWxsIH0sIHsgbjogMiwgc3FyOiBudWxsIH0sIHsgbjogMywgc3FyOiBudWxsIH0sIHsgbjogNCwgc3FyOiBudWxsIH0gXVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBkYi53aXRoX3RyYW5zYWN0aW9uID0+XG4gICAgICBmb3IgZCBmcm9tIGRiIFNRTFwic2VsZWN0ICogZnJvbSBudW1iZXJzIG9yZGVyIGJ5IG47XCJcbiAgICAgICAgZC5zcXIgPSBkLm4gKiogMlxuICAgICAgICBkYiBpbnNlcnRfbnVtYmVyLCBkXG4gICAgICAgIGQubiA9IGQubiArIDEwMFxuICAgICAgICBkLnNxciA9IGQubiAqKiAyXG4gICAgICAgIGRiIGluc2VydF9udW1iZXIsIGRcbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZG8gLT5cbiAgICAgIHJlc3VsdCA9IGRiLmFsbF9yb3dzIFNRTFwiXCJcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXCJcIlxuICAgICAgVD8uZXEgcmVzdWx0LCBbIHsgbjogMCwgc3FyOiAwIH0sIHsgbjogMSwgc3FyOiAxIH0sIHsgbjogMiwgc3FyOiA0IH0sIHsgbjogMywgc3FyOiA5IH0sIHsgbjogNCwgc3FyOiAxNiB9LCB7IG46IDEwMCwgc3FyOiAxMDAwMCB9LCB7IG46IDEwMSwgc3FyOiAxMDIwMSB9LCB7IG46IDEwMiwgc3FyOiAxMDQwNCB9LCB7IG46IDEwMywgc3FyOiAxMDYwOSB9LCB7IG46IDEwNCwgc3FyOiAxMDgxNiB9IF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lPygpXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGRiYXlfY29uY3VycmVuY3lfd2l0aF9zaW5nbGVfY29ubmVjdGlvbiA9ICggVCwgZG9uZSApIC0+XG4gIHsgREJheSB9ICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2RiYXknXG4gIHsgU1FMICB9ICAgICAgICAgICAgPSBEQmF5XG4gIGRiICAgICAgICAgICAgICAgICAgPSBuZXcgREJheSgpXG4gIFQ/LmVxIGRiLmdldF9qb3VybmFsX21vZGUoKSwgJ3dhbCdcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkYiBTUUxcIlwiXCJjcmVhdGUgdGFibGUgbnVtYmVycyAoXG4gICAgbiAgIGludGVnZXIgbm90IG51bGwgcHJpbWFyeSBrZXksXG4gICAgc3FyIGludGVnZXIgKTtcIlwiXCJcbiAgIyBkZWJ1ZyAnXs6pX19fMicsIGRiLmNyZWF0ZV9pbnNlcnQgeyBpbnRvOiAnbnVtYmVycycsIH1cbiAgaW5zZXJ0X251bWJlciA9IFNRTFwiXCJcImluc2VydCBpbnRvIG51bWJlcnMgKCBuLCBzcXIgKSB2YWx1ZXMgKCAkbiwgJHNxciApO1wiXCJcIlxuICAjIHVwc2VydF9udW1iZXIgPSBTUUxcIlwiXCJcbiAgIyAgIGluc2VydCBpbnRvIG51bWJlcnMgKCBuLCBzcXIgKSB2YWx1ZXMgKCAkbiwgJHNxciApXG4gICMgICAgIG9uIGNvbmZsaWN0ICggbiApIGRvIHVwZGF0ZSBzZXQgc3FyID0gJHNxcjtcbiAgIyAgIFwiXCJcIlxuICB1cHNlcnRfbnVtYmVyID0gZGIuY3JlYXRlX2luc2VydCB7IGludG86ICdudW1iZXJzJywgb25fY29uZmxpY3Q6IHsgdXBkYXRlOiB0cnVlLCB9LCByZXR1cm5pbmc6ICcqJywgfVxuICAjIGRlYnVnICfOqV9fXzMnLCBkYi5jcmVhdGVfaW5zZXJ0IHsgaW50bzogJ251bWJlcnMnLCBvbl9jb25mbGljdDogeyB1cGRhdGU6IHRydWUsIH0sIH1cbiAgIyBkZWJ1ZyAnzqlfX180JywgcnByIHVwc2VydF9udW1iZXIucmVwbGFjZSAvXFxuXFxzKi9nLCAnICdcbiAgIyMjIE5PVEUgY29uY3VycmVuY3kgcHJvYmxlbSBpcyBjYXVzZWTigJRzdXJwcmlzaW5nbHkh4oCUYnkgdGhlIGByZXR1cm5pbmc6ICcqJ2AgY2xhdXNlICMjI1xuICAjIGRlYnVnICfOqV9fXzUnLCBycHIgdXBzZXJ0X251bWJlcl8yID0gZGIuY3JlYXRlX2luc2VydCB7IGludG86ICdudW1iZXJzJywgb25fY29uZmxpY3Q6ICcoIG4gKSBkbyB1cGRhdGUgc2V0IHNxciA9ICRzcXInLCB9XG4gICMgZGVidWcgJ86pX19fNicsIHJwciB1cHNlcnRfbnVtYmVyXzIgPSBkYi5jcmVhdGVfaW5zZXJ0IHsgaW50bzogJ251bWJlcnMnLCBvbl9jb25mbGljdDogeyB1cGRhdGU6IHRydWUsIH0sIH1cbiAgIyBkZWJ1ZyAnzqlfX183JywgcnByIHVwc2VydF9udW1iZXJfMiA9IGRiLmNyZWF0ZV9pbnNlcnQgeyBpbnRvOiAnbnVtYmVycycsIG9uX2NvbmZsaWN0OiAnKCBuICkgZG8gdXBkYXRlIHNldCBzcXIgPSAkc3FyJywgcmV0dXJuaW5nOiAnKicsIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkYiBTUUxcIlwiXCJiZWdpbjtcIlwiXCJcbiAgZm9yIG4gaW4gWyAwIC4uIDQgXVxuICAgIGRiIGluc2VydF9udW1iZXIsIHsgbiwgc3FyOiBudWxsLCB9XG4gIGRiIFNRTFwiXCJcImNvbW1pdDtcIlwiXCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyAtPlxuICAgIHJlc3VsdCA9IGRiLmFsbF9yb3dzIFNRTFwiXCJcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXCJcIlxuICAgIFQ/LmVxIHJlc3VsdCwgWyB7IG46IDAsIHNxcjogbnVsbCB9LCB7IG46IDEsIHNxcjogbnVsbCB9LCB7IG46IDIsIHNxcjogbnVsbCB9LCB7IG46IDMsIHNxcjogbnVsbCB9LCB7IG46IDQsIHNxcjogbnVsbCB9IF1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkbyAtPlxuICAgIGZvciByb3cgZnJvbSBkYiBTUUxcIlwiXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlwiXCJcbiAgICAgIGhlbHAgJ86pX19fOCcsIHJvd1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICMgZGIgU1FMXCJcIlwiYmVnaW47XCJcIlwiXG4gIGluZm8gJ86pX19fOScsIFwic3RhdGVtZW50IHVzZWQgZm9yIGNvbmN1cnJlbnQgd3JpdGVzOlwiXG4gIGluZm8gJ86pX18xMCcsIEdVWS50cm0ud2hpdGUgR1VZLnRybS5yZXZlcnNlIEdVWS50cm0uYm9sZCBcIiAje3Vwc2VydF9udW1iZXJ9IFwiXG4gICMgZGIud2l0aF90cmFuc2FjdGlvbiB7IG1vZGU6ICdpbW1lZGlhdGUnLCB9LCAtPiAjIyMgTk9URTogJ2ltbWVkaWF0ZScgYW5kICdleGNsdXNpdmUnIHdpbGwgY2F1c2UgbG9ja2luZyBlcnJvciAjIyNcbiAgZGIud2l0aF90cmFuc2FjdGlvbiB7IG1vZGU6ICdkZWZlcnJlZCcsIH0sIC0+ICMjIyBOT1RFOiAnZGVmZXJyZWQnIGlzIGRlZmF1bHQgIyMjXG4gICAgIyBkYiBTUUxcIlwiXCJiZWdpbiBpbW1lZGlhdGU7XCJcIlwiXG4gICAgZm9yIGQgZnJvbSBkYiBTUUxcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXG4gICAgICBkLnNxciA9IGQubiAqKiAyXG4gICAgICBkZWJ1ZyAnzqlfXzExJywgZGIuYWx0LmZpcnN0X3JvdyB1cHNlcnRfbnVtYmVyLCBkXG4gICAgICBkLm4gPSBkLm4gKyAxMDBcbiAgICAgIGQuc3FyID0gZC5uICoqIDJcbiAgICAgIGRlYnVnICfOqV9fMTInLCBkYi5hbHQuZmlyc3Rfcm93IHVwc2VydF9udW1iZXIsIGRcbiAgIyBkYiBTUUxcIlwiXCJjb21taXQ7XCJcIlwiXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG8gLT5cbiAgICByZXN1bHQgPSBkYi5hbGxfcm93cyBTUUxcIlwiXCJzZWxlY3QgKiBmcm9tIG51bWJlcnMgb3JkZXIgYnkgbjtcIlwiXCJcbiAgICBUPy5lcSByZXN1bHQsIFsgeyBuOiAwLCBzcXI6IDAgfSwgeyBuOiAxLCBzcXI6IDEgfSwgeyBuOiAyLCBzcXI6IDQgfSwgeyBuOiAzLCBzcXI6IDkgfSwgeyBuOiA0LCBzcXI6IDE2IH0sIHsgbjogMTAwLCBzcXI6IDEwMDAwIH0sIHsgbjogMTAxLCBzcXI6IDEwMjAxIH0sIHsgbjogMTAyLCBzcXI6IDEwNDA0IH0sIHsgbjogMTAzLCBzcXI6IDEwNjA5IH0sIHsgbjogMTA0LCBzcXI6IDEwODE2IH0gXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvIC0+XG4gICAgZm9yIHJvdyBmcm9tIGRiIFNRTFwiXCJcInNlbGVjdCAqIGZyb20gbnVtYmVycyBvcmRlciBieSBuO1wiXCJcIlxuICAgICAgdXJnZSAnzqlfXzEzJywgcm93XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGRiYXlfY29uY3VycmVuY3lfd2l0aF90YWJsZV9mdW5jdGlvbiA9ICggVCwgZG9uZSApIC0+XG4gICMgVC5oYWx0X29uX2Vycm9yKClcbiAgeyBEQmF5IH0gICAgICAgICAgPSByZXF1aXJlIEguZGJheV9wYXRoXG4gIHsgU1FMIH0gICAgICAgICAgID0gREJheVxuICBzY2hlbWEgICAgICAgICAgICA9ICdtYWluJ1xuICB7IHRlbXBsYXRlX3BhdGhcbiAgICB3b3JrX3BhdGggfSAgICAgPSBhd2FpdCBILnByb2N1cmVfZGIgeyBzaXplOiAnbm50JywgcmVmOiAnZm4nLCB9XG4gIGRlYnVnIHsgdGVtcGxhdGVfcGF0aCwgd29ya19wYXRoLCB9XG4gIGRiICAgICAgICAgICAgICAgID0gbmV3IERCYXkgeyBwYXRoOiB3b3JrX3BhdGgsIHNjaGVtYSwgfVxuICBudW1iZXJzICAgICAgICAgICA9IGRiLmFsbF9maXJzdF92YWx1ZXMgU1FMXCJzZWxlY3QgbiBmcm9tIG5udCBvcmRlciBieSBuO1wiXG4gIGNvbnNvbGUudGFibGUgZGIuYWxsX3Jvd3MgU1FMXCJzZWxlY3QgKiBmcm9tIG5udCBvcmRlciBieSBuO1wiXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZGIuY3JlYXRlX3RhYmxlX2Z1bmN0aW9uXG4gICAgbmFtZTogICAgICAgICAncmVfbWF0Y2hlcydcbiAgICBjb2x1bW5zOiAgICAgIFsgJ21hdGNoJywgJ2NhcHR1cmUnLCBdXG4gICAgcGFyYW1ldGVyczogICBbICd0ZXh0JywgJ3BhdHRlcm4nLCBdXG4gICAgcm93czogKCB0ZXh0LCBwYXR0ZXJuICkgLT5cbiAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCBwYXR0ZXJuLCAnZydcbiAgICAgIHdoaWxlICggbWF0Y2ggPSByZWdleC5leGVjIHRleHQgKT9cbiAgICAgICAgeWllbGQgWyBtYXRjaFsgMCBdLCBtYXRjaFsgMSBdLCBdXG4gICAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvID0+XG4gICAgaW5zZXJ0X251bWJlciAgID0gZGIuYWx0LnByZXBhcmVfaW5zZXJ0IHsgaW50bzogJ25udCcsIH1cbiAgICBzZWxlY3RfbnVtYmVycyAgPSBTUUxcIlwiXCJzZWxlY3QgbiBmcm9tIG5udCBvcmRlciBieSBuO1wiXCJcIlxuICAgIHNlbGVjdF9yb3dzICAgICA9IFNRTFwiXCJcIlxuICAgICAgc2VsZWN0XG4gICAgICAgICAgKlxuICAgICAgICBmcm9tXG4gICAgICAgICAgbm50LFxuICAgICAgICAgIHJlX21hdGNoZXMoIHQsICdeLioocG9pbnQpLiokJyApIGFzIHJ4XG4gICAgICAgIG9yZGVyIGJ5IHJ4Lm1hdGNoO1wiXCJcIlxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgY29uc29sZS50YWJsZSBkYi5hbGxfcm93cyBzZWxlY3Rfcm93c1xuICAgIFQ/LmVxICggZGIuYWxsX2ZpcnN0X3ZhbHVlcyBzZWxlY3RfbnVtYmVycyApLCBbIDAsIDEsIDEuNSwgMiwgMi4zLCAzLCAzLjEsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIgXVxuICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgZm9yIGQgZnJvbSBkYiBzZWxlY3Rfcm93c1xuICAgICAgZGIgaW5zZXJ0X251bWJlciwgeyBkLi4uLCBuOiBkLm4gKyAxMDAsIH1cbiAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgIGNvbnNvbGUudGFibGUgZGIuYWxsX3Jvd3Mgc2VsZWN0X3Jvd3NcbiAgICBUPy5lcSAoIGRiLmFsbF9maXJzdF92YWx1ZXMgc2VsZWN0X251bWJlcnMgKSwgWyAwLCAxLCAxLjUsIDIsIDIuMywgMywgMy4xLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyLCAxMDEuNSwgMTAyLjMsIDEwMy4xIF1cbiAgICByZXR1cm4gbnVsbFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvbmU/KClcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIHJlcXVpcmUubWFpbiBpcyBtb2R1bGUgdGhlbiBkbyA9PlxuICAjIEBkYmF5X3ZpcnR1YWxfY29uY3VycmVudF93cml0ZXMoKVxuICAjIEBkYmF5X2NvbmN1cnJlbmN5X3dpdGhfZXhwbGljaXRseV90d29fY29ubmVjdGlvbnMoKVxuICAjIHRlc3QgQGRiYXlfY29uY3VycmVuY3lfd2l0aF9leHBsaWNpdGx5X3R3b19jb25uZWN0aW9uc1xuICAjIHRlc3QgQGRiYXlfY29uY3VycmVuY3lfd2l0aF9pbXBsaWNpdGx5X3R3b19jb25uZWN0aW9uc1xuICAjIEBkYmF5X2NvbmN1cnJlbmN5X3dpdGhfdGFibGVfZnVuY3Rpb24oKVxuICAjIHRlc3QgQGRiYXlfY29uY3VycmVuY3lfd2l0aF90YWJsZV9mdW5jdGlvblxuICAjIEBkYmF5X2NvbmN1cnJlbmN5X3dpdGhfaW1wbGljaXRseV90d29fY29ubmVjdGlvbnMoKVxuICAjIHRlc3QgQGRiYXlfY29uY3VycmVuY3lfd2l0aF9pbXBsaWNpdGx5X3R3b19jb25uZWN0aW9uc1xuICB0ZXN0IEBcbiAgIyBAZGJheV9jb25jdXJyZW5jeV93aXRoX3NpbmdsZV9jb25uZWN0aW9uKClcblxuXG4iXX0=
