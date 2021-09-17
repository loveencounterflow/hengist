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

  //-----------------------------------------------------------------------------------------------------------
  demo_udf_dbay_sqlt = function() {
    var Dbay, Dbayx, db;
    ({Dbay} = require(H.dbay_path));
    Dbayx = (function() {
      class Dbayx extends Dbay {};

      Dbayx._rnd_int_cfg = true;

      return Dbayx;

    }).call(this);
    db = new Dbayx();
    //.........................................................................................................
    /* Create table on first connection, can insert data on second connconnection: */
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
      /* Sanity check that UDF does work (on the same connconnection): */
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
        info('^309-1^', row);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var ref, row, select;
      /* Run query (on 1st connconnection) that calls UDF running another query (on the 2nd connconnection): */
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
        info('^309-1^', row);
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
      debug('^322-1^');
      xxx_statement = db.sqlt2.prepare(SQL`select n from x;`);
      db.sqlt1.table('std_some_texts', {
        columns: ['n'],
        deterministic: false,
        varargs: false,
        rows: function*() {
          var ref, row;
          debug('^322-2^');
          xxx_statement.run();
          debug('^322-3^');
          ref = xxx_statement.iterate();
          // yield from xxx_statement.iterate()
          for (row of ref) {
            debug('^322-4^', row);
            yield row;
          }
          return null;
        }
      });
      //.......................................................................................................
      /* not possible to attach the same DB more than once: */
      // debug '^078-1^', db.sqlt1.name
      // debug '^078-1^', ( db.sqlt1.prepare SQL"attach ? as s1b;" ).run [ db.sqlt1.name, ]
      //.......................................................................................................
      // select  = db.sqlt1.prepare SQL"select * from std_generate_series();"
      // select2 = db.sqlt1.prepare SQL"select * from std_generate_series();"
      select = db.sqlt1.prepare(SQL`select * from std_some_texts();`);
      select.run();
      ref = select.iterate();
      // for row from select.iterate()
      //   select2.run()
      //   info '^309-1^', row, [ ( select2.iterate() )..., ]
      for (row of ref) {
        info('^309-1^', row);
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
    var Dbay, Worker, create_and_populate_tables, dbnick, isMainThread, show_sqlite_schema, show_table_contents;
    //.........................................................................................................
    create_and_populate_tables = function(db) {
      /* Create table on first connection, can insert data on second connconnection: */
      db.sqlt1.exec(SQL`create table x ( n text );`);
      db.sqlt2.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
      db.sqlt2.exec(SQL`insert into x ( n ) values ( 'good to see' );`);
      db.sqlt2.exec(SQL`insert into x ( n ) values ( 'it does work' );`);
      urge('^332^', "created and populated table `x`");
      return null;
    };
    //.........................................................................................................
    show_sqlite_schema = (db) => {
      var ref, row, select;
      info('^300-1^', "sqlite_schema");
      select = db.sqlt1.prepare(SQL`select * from sqlite_schema;`);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^300-1^', row);
      }
      return null;
    };
    //.........................................................................................................
    show_table_contents = (db) => {
      var ref, row, select;
      select = db.sqlt1.prepare(SQL`select * from x;`);
      select.run();
      ref = select.iterate();
      for (row of ref) {
        info('^309-1^', row);
      }
      return null;
    };
    //.........................................................................................................
    ({Worker, isMainThread} = require('worker_threads'));
    ({Dbay} = require(H.dbay_path));
    dbnick = 'mydb';
    //.........................................................................................................
    if (isMainThread) {
      (async() => {
        var db, worker;
        debug("main thread");
        db = new Dbay({
          dbnick,
          ram: true
        });
        create_and_populate_tables(db);
        show_sqlite_schema(db);
        help("sleeping...");
        await guy.async.sleep(0.1);
        worker = new Worker(__filename);
        debug('^445-1^', db.sqlt1);
        return debug('^445-1^', db.cfg);
      })();
    } else {
      (() => {        //.........................................................................................................
        var db;
        debug("worker thread");
        db = new Dbay({
          dbnick,
          ram: true
        });
        show_sqlite_schema(db);
        debug('^445-2^', db.sqlt1);
        debug('^445-2^', db.cfg);
        return show_table_contents(db);
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