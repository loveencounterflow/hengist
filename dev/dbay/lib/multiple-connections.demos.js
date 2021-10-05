(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, demo_udf_dbay_sqlt, demo_worker_threads, echo, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/CONSTRUCTION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  throw new Error(`this approcach has been abandoned partly because all communication between threads will always be
inherently async, and async iterators are not allowed in table UDFs.`);

  //-----------------------------------------------------------------------------------------------------------
  demo_udf_dbay_sqlt = function() {
    var DBay, DBayx, db;
    ({DBay} = require(H.dbay_path));
    DBayx = (function() {
      class DBayx extends DBay {};

      DBayx._rnd_int_cfg = true;

      return DBayx;

    }).call(this);
    db = new DBayx();
    //.........................................................................................................
    /* Create table on first connection, can insert data on second connection: */
    db.sqlt1.exec(SQL`create table x ( n text );`);
    db.sqlt2.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
    db.sqlt2.exec(SQL`insert into x ( n ) values ( 'good to see' );`);
    db.sqlt2.exec(SQL`insert into x ( n ) values ( 'it does work' );`);
    (() => {      //.........................................................................................................
      /* Sanity check that data was persisted: */
      var ref, row, select;
      select = db.sqlt2.prepare(SQL`select * from x;`, {}, false);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^309-1^', row);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var ref, row, select;
      /* Sanity check that UDF does work (on the same connection): */
      db.sqlt1.function('std_square', {
        varargs: false
      }, function(n) {
        return n ** 2;
      });
      // select  = db.sqlt1.prepare SQL"select sqrt( 42 ) as n;"
      select = db.sqlt1.prepare(SQL`select std_square( 42 ) as n;`);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^309-2^', row);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var ref, row, select;
      /* Run query (on 1st connection) that calls UDF running another query (on the 2nd connection): */
      db.sqlt1.function('std_row_count', {
        varargs: false,
        deterministic: false
      }, function() {
        var ref, ref1, rows, statement;
        statement = db.sqlt2.prepare(SQL`select count(*) as count from x;`, {}, false);
        statement.run();
        rows = [...statement.iterate()];
        return (ref = (ref1 = rows[0]) != null ? ref1.count : void 0) != null ? ref : null;
      });
      select = db.sqlt1.prepare(SQL`select std_row_count() as n;`);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^309-3^', row);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var ref, row, select, xxx_statement;
      db.sqlt1.unsafeMode(true);
      db.sqlt2.unsafeMode(true);
      db.sqlt1.exec(SQL`begin deferred transaction;`);
      db.sqlt2.exec(SQL`begin deferred transaction;`);
      db.sqlt1.exec(SQL`pragma main.journal_mode=WAL;`);
      db.sqlt2.exec(SQL`pragma main.journal_mode=WAL;`);
      //.......................................................................................................
      db.sqlt1.table('std_generate_series', {
        columns: ['n'],
        deterministic: false,
        varargs: false,
        rows: function*() {
          var i, n;
          for (n = i = 1; i <= 3; n = ++i) {
            yield ({n});
          }
          return null;
        }
      });
      //.......................................................................................................
      debug('^309-4^');
      xxx_statement = db.sqlt2.prepare(SQL`select n from x;`);
      db.sqlt1.table('std_some_texts', {
        columns: ['n'],
        deterministic: false,
        varargs: false,
        rows: function*() {
          var ref, row;
          debug('^309-5^');
          xxx_statement.run();
          debug('^309-6^');
          ref = xxx_statement.iterate();
          // yield from xxx_statement.iterate()
          for (row of ref) {
            debug('^309-7^', row);
            yield row;
          }
          return null;
        }
      });
      //.......................................................................................................
      /* not possible to attach the same DB more than once: */
      // debug '^309-8^', db.sqlt1.name
      // debug '^309-9^', ( db.sqlt1.prepare SQL"attach ? as s1b;" ).run [ db.sqlt1.name, ]
      //.......................................................................................................
      // select  = db.sqlt1.prepare SQL"select * from std_generate_series();"
      // select2 = db.sqlt1.prepare SQL"select * from std_generate_series();"
      select = db.sqlt1.prepare(SQL`select * from std_some_texts();`);
      select.run();
      ref = select.iterate();
      // for row from select.iterate()
      //   select2.run()
      //   info '^309-10^', row, [ ( select2.iterate() )..., ]
      for (row of ref) {
        info('^309-11^', row);
      }
      db.sqlt1.unsafeMode(false);
      db.sqlt2.unsafeMode(false);
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_worker_threads = function() {
    var DBay, Worker, add_table_function, create_and_populate_tables, dbnick, isMainThread, parentPort, show_sqlite_schema, show_table_contents;
    //.........................................................................................................
    create_and_populate_tables = function(db) {
      var sqlt_a, sqlt_b;
      /* Create table on first connection, can insert data on second connection unless when within
         transaction: */
      debug('^339^', db.sqlt1);
      debug('^339^', db.sqlt2);
      sqlt_a = db.sqlt1;
      sqlt_b = sqlt_a.inTransaction ? sqlt_a : db.sqlt2;
      sqlt_a.exec(SQL`create table x ( n text );`);
      sqlt_b.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
      sqlt_b.exec(SQL`insert into x ( n ) values ( 'good to see' );`);
      sqlt_b.exec(SQL`insert into x ( n ) values ( 'it does work' );`);
      urge('^309-12^', "created and populated table `x`");
      return null;
    };
    //.........................................................................................................
    add_table_function = function(db) {
      return db.sqlt1.table('my_table_udf', {
        deterministic: false,
        varargs: false,
        columns: ['n'],
        rows: async function*() {
          var i, len, n, ref;
          ref = [1, 2, 3];
          // statement = db.sqlt2.prepare SQL"select * from x;"
          // yield from statement.iterate()
          for (i = 0, len = ref.length; i < len; i++) {
            n = ref[i];
            await sleep(0.25);
            yield ({n});
          }
          return null;
        }
      });
    };
    //.........................................................................................................
    show_sqlite_schema = (db) => {
      var ref, row, select;
      info('^309-13^', "sqlite_schema");
      select = db.sqlt1.prepare(SQL`select * from sqlite_schema;`);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^309-14^', row);
      }
      return null;
    };
    //.........................................................................................................
    show_table_contents = (title, db) => {
      var error, ref, row, select;
      try {
        select = db.sqlt1.prepare(SQL`select * from x;`);
        select.run();
        urge('^309-15^', title);
        ref = select.iterate();
        for (row of ref) {
          info('^309-16^', row);
        }
      } catch (error1) {
        error = error1;
        warn(CND.reverse(error.message));
      }
      return null;
    };
    //.........................................................................................................
    ({Worker, parentPort, isMainThread} = require('worker_threads'));
    ({DBay} = require(H.dbay_path));
    dbnick = 'mydb';
    //.........................................................................................................
    if (isMainThread) {
      (async() => {
        var db, worker;
        debug("main thread");
        db = new DBay({
          dbnick,
          ram: true
        });
        db.sqlt1.exec(SQL`begin transaction;`);
        create_and_populate_tables(db);
        db.sqlt1.exec(SQL`commit;`);
        show_sqlite_schema(db);
        worker = new Worker(__filename);
        // worker.postMessage 'ready'
        worker.on('message', function(...P) {
          return info('^309-1^', "Main thread received message:", P);
        });
        debug('^309-17^', db.sqlt1);
        debug('^309-18^', db.cfg);
        show_table_contents("main thread", db);
        // for n in [ 0 .. 1e8 ]
        //   null
        help("sleeping...");
        await guy.async.sleep(10);
        help('^309-1^', "exiting");
        return null;
      })();
    } else {
      (() => {        //.........................................................................................................
        var db, ref, row, statement;
        urge(CND.reverse("█ █ █ █ █ █ worker thread █ █ █ █ █ █ "));
        // parentPort.on 'message', ( P... ) -> info '^309-1^', P
        db = new DBay({
          dbnick,
          ram: true
        });
        add_table_function(db);
        show_sqlite_schema(db);
        debug('^309-19^', db.sqlt1);
        debug('^309-20^', db.cfg);
        // # show_table_contents "worker thread", db
        statement = db.sqlt1.prepare(SQL`select * from my_table_udf();`);
        ref = statement.iterate();
        for (row of ref) {
          info('^309-1^', row);
        }
        parentPort.postMessage('done');
        // help "sleeping..."; await guy.async.sleep 1
        // show_table_contents "worker thread", db
        return null;
      })();
    }
    // help "sleeping..."; await guy.async.sleep 0.1
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // demo_attach_memory_connections_1()
      // demo_udf_1()
      // demo_udf_dbay_sqlt()
      return (await demo_worker_threads());
    })();
  }

}).call(this);

//# sourceMappingURL=multiple-connections.demos.js.map