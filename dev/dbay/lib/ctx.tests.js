(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/CTX';

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

  H = require('./helpers');

  // types                     = new ( require 'intertype' ).Intertype
  // { isa
  //   type_of
  //   validate
  //   validate_list_of }      = types.export()
  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: with_transaction() 1"] = function(T, done) {
    var Dbay;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    (() => {      //.........................................................................................................
      var db;
      db = new Dbay();
      return T != null ? T.throws(/expected between 1 and 2 arguments, got 0/, function() {
        return db.with_transaction();
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var create_table, db, error;
      db = new Dbay();
      // db.open { schema: 'main', }
      create_table = function(cfg) {
        debug('^435^', {cfg});
        return db.with_transaction(function() {
          help('^70^', "creating a table with", cfg);
          db.execute(SQL`create table foo ( bar integer );`);
          if (cfg.throw_error) {
            throw new Error("oops");
          }
        });
      };
      //.......................................................................................................
      error = null;
      try {
        create_table({
          throw_error: true
        });
      } catch (error1) {
        error = error1;
        if (T != null) {
          T.ok(error.message === "oops");
        }
        if (T != null) {
          T.eq(db.all_rows("select * from sqlite_schema;"), []);
        }
      }
      if (error == null) {
        T.fail("expected error but none was thrown");
      }
      //.......................................................................................................
      create_table({
        throw_error: false
      });
      return T != null ? T.eq(db.all_first_values("select name from sqlite_schema;"), ['foo']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: with_transaction() 2"] = function(T, done) {
    var Dbay;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    (() => {      //.........................................................................................................
      var db;
      db = new Dbay();
      return T != null ? T.throws(/expected between 1 and 2 arguments, got 0/, function() {
        return db.with_transaction();
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var db, error;
      error = null;
      db = new Dbay();
      try {
        db.with_transaction(function() {
          help('^70^', "creating a table");
          db.execute(SQL`create table foo ( bar integer );`);
          throw new Error("oops");
        });
      } catch (error1) {
        error = error1;
        warn(error.message);
        if (T != null) {
          T.ok(error.message === "oops");
        }
      }
      if (error == null) {
        T.fail("expected error but none was thrown");
      }
      if (T != null) {
        T.eq(db.all_rows("select * from sqlite_schema;"), []);
      }
      //.......................................................................................................
      db.with_transaction(function() {
        help('^70^', "creating a table");
        return db.execute(SQL`create table foo ( bar integer );`);
      });
      //.......................................................................................................
      return T != null ? T.eq(db.all_first_values(SQL`select name from sqlite_schema;`), ['foo']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: with_unsafe_mode()"] = function(T, done) {
    var Dbay;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    (() => {      //.........................................................................................................
      var db;
      db = new Dbay();
      return T != null ? T.throws(/not a valid function/, function() {
        return db.with_unsafe_mode();
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var d, db, error, i, n, result, rows;
      error = null;
      db = new Dbay();
      // db.open { schema: 'main', }
      db.execute(SQL`create table foo ( n integer, is_new boolean default false );`);
      for (n = i = 10; i <= 19; n = ++i) {
        db.run(SQL`insert into foo ( n ) values ( $n );`, {n});
      }
      db.with_unsafe_mode(function() {
        var ref, row;
        ref = db.query(SQL`select * from foo where not is_new;`);
        for (row of ref) {
          db.run(SQL`insert into foo ( n, is_new ) values ( $n, $is_new );`, {
            n: row.n * 3,
            is_new: 1
          });
        }
        return db.execute(SQL`update foo set is_new = false where is_new;`);
      });
      //.......................................................................................................
      console.table(rows = db.all_rows(SQL`select * from foo order by n;`));
      result = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = rows.length; j < len; j++) {
          d = rows[j];
          results.push(d.n);
        }
        return results;
      })();
      return T != null ? T.eq(result, [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: with_foreign_keys_deferred(), preliminaries"] = function(T, done) {
    var Dbay, list_table_a, list_table_b;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    list_table_a = function(db) {
      var ref, results, row;
      ref = db.query(SQL`select n from a;`);
      results = [];
      for (row of ref) {
        results.push(row.n);
      }
      return results;
    };
    list_table_b = function(db) {
      var ref, results, row;
      ref = db.query(SQL`select n from b;`);
      results = [];
      for (row of ref) {
        results.push(row.n);
      }
      return results;
    };
    (() => {      //---------------------------------------------------------------------------------------------------------
      var db, error, sqlt;
      urge('^50-1^', "begin transaction, then defer fks");
      db = new Dbay();
      ({sqlt} = db);
      db.execute(SQL`create table a ( n integer not null primary key references b ( n ) );
create table b ( n integer not null primary key references a ( n ) );`);
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-2^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, false);
      }
      info('^50-3^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-4^', sqlt.pragma(SQL`defer_foreign_keys;`));
      if (T != null) {
        T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
          {
            defer_foreign_keys: 0
          }
        ]);
      }
      //.......................................................................................................
      /* begin transaction, then  start deferred fks */
      debug('^50-5^');
      db.execute(SQL`begin transaction;`);
      debug('^50-6^');
      sqlt.pragma(SQL`defer_foreign_keys=1;`);
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-7^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, true);
      }
      info('^50-8^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-9^', sqlt.pragma(SQL`defer_foreign_keys;`));
      if (T != null) {
        T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
          {
            defer_foreign_keys: 1
          }
        ]);
      }
      //.......................................................................................................
      /* insert partly bogus values, check */
      debug('^50-10^');
      db.execute(SQL`insert into a ( n ) values ( 1 );`);
      debug('^50-11^');
      db.execute(SQL`insert into b ( n ) values ( 1 );`);
      debug('^50-12^');
      db.execute(SQL`insert into a ( n ) values ( 2 );`);
      // debug '^50-13^'; db.execute SQL"insert into b ( n ) values ( 2 );"
      error = null;
      debug('^50-14^', list_table_a(db));
      if (T != null) {
        T.eq(list_table_a(db), [1, 2]);
      }
      debug('^50-15^', list_table_b(db));
      if (T != null) {
        T.eq(list_table_b(db), [1]);
      }
      try {
        //.......................................................................................................
        /* try to commit, rollback on error */
        debug('^50-16^');
        db.execute(SQL`commit;`);
      } catch (error1) {
        error = error1;
        debug('^50-17^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, true);
        }
        warn(error.message);
        if (T != null) {
          T.eq(error.message, "FOREIGN KEY constraint failed");
        }
        debug('^50-18^');
        db.execute(SQL`rollback;`);
        debug('^50-19^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, false);
        }
      } finally {
        debug('^50-20^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, false);
        }
      }
      if (error == null) {
        //.......................................................................................................
        /* Ensure error happened, tables empty as before */
        T.fail('^50-21^', "expected error, got none");
      }
      debug('^50-22^', list_table_a(db));
      if (T != null) {
        T.eq(list_table_a(db), []);
      }
      debug('^50-23^', list_table_b(db));
      if (T != null) {
        T.eq(list_table_b(db), []);
      }
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-24^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, false);
      }
      info('^50-25^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-26^', sqlt.pragma(SQL`defer_foreign_keys;`));
      return T != null ? T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
        {
          defer_foreign_keys: 0
        }
      ]) : void 0;
    })();
    (() => {      //---------------------------------------------------------------------------------------------------------
      var db, error, sqlt;
      urge('^50-27^', "defer fks, then begin transaction");
      db = new Dbay();
      ({sqlt} = db);
      db.execute(SQL`create table a ( n integer not null primary key references b ( n ) );
create table b ( n integer not null primary key references a ( n ) );`);
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-28^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, false);
      }
      info('^50-29^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-30^', sqlt.pragma(SQL`defer_foreign_keys;`));
      if (T != null) {
        T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
          {
            defer_foreign_keys: 0
          }
        ]);
      }
      //.......................................................................................................
      /* begin transaction, then  start deferred fks */
      debug('^50-31^');
      sqlt.pragma(SQL`defer_foreign_keys=1;`);
      debug('^50-32^');
      db.execute(SQL`begin transaction;`);
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-33^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, true);
      }
      info('^50-34^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-35^', sqlt.pragma(SQL`defer_foreign_keys;`));
      if (T != null) {
        T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
          {
            defer_foreign_keys: 1
          }
        ]);
      }
      //.......................................................................................................
      /* insert partly bogus values, check */
      debug('^50-36^');
      db.execute(SQL`insert into a ( n ) values ( 1 );`);
      debug('^50-37^');
      db.execute(SQL`insert into b ( n ) values ( 1 );`);
      debug('^50-38^');
      db.execute(SQL`insert into a ( n ) values ( 2 );`);
      // debug '^50-39^'; db.execute SQL"insert into b ( n ) values ( 2 );"
      error = null;
      debug('^50-40^', list_table_a(db));
      if (T != null) {
        T.eq(list_table_a(db), [1, 2]);
      }
      debug('^50-41^', list_table_b(db));
      if (T != null) {
        T.eq(list_table_b(db), [1]);
      }
      try {
        //.......................................................................................................
        /* try to commit, rollback on error */
        debug('^50-42^');
        db.execute(SQL`commit;`);
      } catch (error1) {
        error = error1;
        debug('^50-43^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, true);
        }
        warn(error.message);
        if (T != null) {
          T.eq(error.message, "FOREIGN KEY constraint failed");
        }
        debug('^50-44^');
        db.execute(SQL`rollback;`);
        debug('^50-45^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, false);
        }
      } finally {
        // throw error ### in production, re-throw error after rollback ###
        debug('^50-46^', sqlt.inTransaction);
        if (T != null) {
          T.eq(sqlt.inTransaction, false);
        }
      }
      if (error == null) {
        //.......................................................................................................
        /* Ensure error happened, tables empty as before */
        T.fail('^50-47^', "expected error, got none");
      }
      debug('^50-48^', list_table_a(db));
      if (T != null) {
        T.eq(list_table_a(db), []);
      }
      debug('^50-49^', list_table_b(db));
      if (T != null) {
        T.eq(list_table_b(db), []);
      }
      //.......................................................................................................
      /* ensure DB transaction, fk state */
      info('^50-50^', sqlt.inTransaction);
      if (T != null) {
        T.eq(sqlt.inTransaction, false);
      }
      info('^50-51^', db.get_foreign_keys_state());
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      info('^50-52^', sqlt.pragma(SQL`defer_foreign_keys;`));
      return T != null ? T.eq(sqlt.pragma(SQL`defer_foreign_keys;`), [
        {
          defer_foreign_keys: 0
        }
      ]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: with_foreign_keys_deferred(), ensure checks"] = function(T, done) {
    var Dbay, d, db, error, list_table_a, nxt_values, prv_values, result, rows;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    //.........................................................................................................
    list_table_a = function(db) {
      var ref, results, row;
      ref = db.query(SQL`select n from a;`);
      results = [];
      for (row of ref) {
        results.push(row.n);
      }
      return results;
    };
    //.........................................................................................................
    error = null;
    db = new Dbay();
    // db.open { schema: 'main', }
    db.execute(SQL`create table a ( n integer not null primary key references b ( n ) );
create table b ( n integer not null primary key references a ( n ) );`);
    //.........................................................................................................
    if (T != null) {
      T.eq(CND.truth(db.sqlt.inTransaction, false));
    }
    if (T != null) {
      T.eq(db.get_foreign_keys_state(), true);
    }
    db.with_foreign_keys_deferred(function() {
      if (T != null) {
        T.eq(CND.truth(db.sqlt.inTransaction, true));
      }
      if (T != null) {
        T.eq(db.get_foreign_keys_state(), true);
      }
      db.execute(SQL`insert into a ( n ) values ( 1 );`);
      db.execute(SQL`insert into a ( n ) values ( 2 );`);
      db.execute(SQL`insert into a ( n ) values ( 3 );`);
      db.execute(SQL`insert into b ( n ) values ( 1 );`);
      db.execute(SQL`insert into b ( n ) values ( 2 );`);
      db.execute(SQL`insert into b ( n ) values ( 3 );`);
      // db.execute SQL"insert into a ( n ) values ( 4 );"
      console.table(db.all_rows(SQL`select * from a;`));
      return console.table(db.all_rows(SQL`select * from b;`));
    });
    if (T != null) {
      T.eq(CND.truth(db.sqlt.inTransaction, false));
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(db.get_foreign_keys_state(), true);
    }
    if (T != null) {
      T.eq(db.pragma(SQL`foreign_key_check;`), []);
    }
    if (T != null) {
      T.eq(db.pragma(SQL`integrity_check;`), [
        {
          integrity_check: 'ok'
        }
      ]);
    }
    //.........................................................................................................
    debug('^778-1^', (prv_values = list_table_a(db)));
    if (T != null) {
      T.eq((nxt_values = list_table_a(db)), prv_values);
    }
    prv_values = nxt_values;
    debug('^778-2^');
    if (T != null) {
      T.eq(db.sqlt.inTransaction, false);
    }
    try {
      db.with_foreign_keys_deferred(function() {
        if (T != null) {
          T.eq(db.sqlt.inTransaction, true);
        }
        return db.execute(SQL`insert into a ( n ) values ( 101 );`);
      });
    } catch (error1) {
      error = error1;
      warn(error.message);
      if (T != null) {
        T.eq(error.message, "FOREIGN KEY constraint failed");
      }
    }
    if (T != null) {
      T.eq(db.sqlt.inTransaction, false);
    }
    debug('^778-4^', list_table_a(db));
    if (T != null) {
      T.eq((nxt_values = list_table_a(db)), prv_values);
    }
    prv_values = nxt_values;
    //.........................................................................................................
    debug('^778-5^');
    try {
      db.with_transaction(function() {
        return db.with_foreign_keys_deferred(function() {
          return db.execute(SQL`insert into a ( n ) values ( 102 );`);
        });
      });
    } catch (error1) {
      error = error1;
      warn(error.message);
      if (T != null) {
        T.eq(error.message, "^db-functions@901^ (Dba_no_deferred_fks_in_tx) cannot defer foreign keys inside a transaction");
      }
    }
    debug('^778-6^', list_table_a(db));
    if (T != null) {
      T.eq((nxt_values = list_table_a(db)), prv_values);
    }
    prv_values = nxt_values;
    //.........................................................................................................
    debug('^778-7^');
    try {
      db.with_foreign_keys_deferred(function() {
        return db.with_transaction(function() {
          return db.execute(SQL`insert into a ( n ) values ( 103 );`);
        });
      });
    } catch (error1) {
      error = error1;
      warn(error.message);
      if (T != null) {
        T.eq(error.message, "^db-functions@901^ (Dba_no_nested_transactions) cannot start a transaction within a transaction");
      }
    }
    debug('^778-8^', list_table_a(db));
    if (T != null) {
      T.eq((nxt_values = list_table_a(db)), prv_values);
    }
    prv_values = nxt_values;
    //.........................................................................................................
    if (T != null) {
      T.eq(db.pragma(SQL`foreign_key_check;`), []);
    }
    if (T != null) {
      T.eq(db.pragma(SQL`integrity_check;`), [
        {
          integrity_check: 'ok'
        }
      ]);
    }
    //.........................................................................................................
    console.table(rows = db.all_rows(SQL`select
    a.n as a_n,
    b.n as b_n
  from a
  left join b using ( n )
  order by n;`));
    debug('^400^', rows);
    result = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = rows.length; i < len; i++) {
        d = rows[i];
        results.push([d.a_n, d.b_n]);
      }
      return results;
    })();
    if (T != null) {
      T.eq(result, [[1, 1], [2, 2], [3, 3]]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

}).call(this);

//# sourceMappingURL=ctx.tests.js.map