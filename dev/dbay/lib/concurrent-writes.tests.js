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
      var d, ref, results;
      ref = db(select_numbers);
      results = [];
      for (d of ref) {
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
    var DBay, SQL, d, dbr, dbw, insert_number, ref;
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
    ref = dbr(SQL`select * from numbers order by n;`);
    //.........................................................................................................
    // dbr.with_transaction ->
    for (d of ref) {
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
    var DBay, SQL, d, db, insert_number, ref;
    ({DBay} = require('../../../apps/dbay'));
    ({SQL} = DBay);
    db = new DBay();
    if (T != null) {
      T.eq(db.get_journal_mode(), 'wal');
    }
    if (T != null) {
      T.eq(db.get_journal_mode(), 'wal');
    }
    //.........................................................................................................
    db(SQL`create table numbers (
n   integer not null primary key,
sqr integer );`);
    insert_number = db.prepare_insert({
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
    ref = db(SQL`select * from numbers order by n;`);
    //.........................................................................................................
    // db.with_transaction ->
    for (d of ref) {
      d.sqr = d.n ** 2;
      db(insert_number, d);
      d.n = d.n + 100;
      d.sqr = d.n ** 2;
      db(insert_number, d);
    }
    (function() {      //.........................................................................................................
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
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @dbay_virtual_concurrent_writes()
      // @dbay_concurrency_with_explicitly_two_connections()
      // test @dbay_concurrency_with_explicitly_two_connections
      return test(this.dbay_concurrency_with_implicitly_two_connections);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=concurrent-writes.tests.js.map