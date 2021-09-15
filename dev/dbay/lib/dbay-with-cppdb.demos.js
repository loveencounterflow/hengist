(function() {
  'use strict';
  var CND, Dbay2, H, PATH, SQL, badge, debug, demo_attach_memory_connections_1, demo_udf_1, demo_udf_2, demo_udf_dbay_sqlt, echo, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  Dbay2 = (function() {
    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Dbay2 {
      //---------------------------------------------------------------------------------------------------------
      _cast_booleans_as_numbers(d) {
        var k, v;
        for (k in d) {
          v = d[k];
          if (v === true) {
            d[k] = 1;
          } else if (v === false) {
            d[k] = 0;
          }
        }
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      create_sqlt_connection(path_or_url) {
        /* TAINT use `cfg`, validate */
        var Database, cfg;
        ({Database} = require(this.constructor.C.sqlt_node_path));
        cfg = {
          filename: path_or_url,
          filenameGiven: path_or_url,
          anonymous: true/* ??? */,
          readonly: false,
          fileMustExist: false,
          timeout: 5000,
          verbose: null,
          buffer: null
        };
        return new Database(cfg.filename, cfg.filenameGiven, cfg.anonymous, cfg.readonly, cfg.fileMustExist, cfg.timeout, cfg.verbose, cfg.buffer);
      }

      //---------------------------------------------------------------------------------------------------------
      create_function(sqlt, name, cfg, fn) {
        var arity;
        cfg = {...this.constructor.C.defaults.dbay_create_function_cfg, ...cfg};
        // @_cast_booleans_as_numbers cfg
        debug('^334^', cfg);
        arity = cfg.varargs ? -1 : fn.length;
        // if (arity > 100) throw new RangeError('User-defined functions cannot have more than 100 arguments');
        sqlt.function(fn, name, arity, cfg.safeIntegers, cfg.deterministic, cfg.directOnly);
        return null;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Dbay2.C = guy.lft.freeze({
      /* TAINT consider to use package `bindings` */
      sqlt_node_path: PATH.resolve(PATH.join(__dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/better_sqlite3.node')),
      defaults: {
        dbay_create_function_cfg: {
          safeIntegers: 2,
          deterministic: true,
          directOnly: false,
          varargs: false
        }
      }
    });

    return Dbay2;

  }).call(this);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_attach_memory_connections_1 = function() {
    var db, ref, row, select, sqlt1, sqlt2;
    db = new Dbay2();
    sqlt1 = db.create_sqlt_connection('file:your_db_name_here?mode=memory&cache=shared');
    sqlt2 = db.create_sqlt_connection('file:your_db_name_here?mode=memory&cache=shared');
    //.........................................................................................................
    sqlt1.exec(SQL`create table x ( n text );`);
    sqlt2.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
    select = sqlt2.prepare(SQL`select * from x;`, {}, false);
    debug('^340^', select.run());
    ref = select.iterate();
    //.........................................................................................................
    for (row of ref) {
      info(row);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_udf_1 = function() {
    var bsqlt1, bsqlt2, db, new_bsqlt;
    db = new Dbay2();
    new_bsqlt = require('../../../apps/icql-dba/node_modules/better-sqlite3');
    // new_bsqlt = require '/tmp/icql-dba-interim/node_modules/better-sqlite3' ### test with cloned, fresh `npm install` ###
    bsqlt1 = new_bsqlt('file:your_db_name_here?mode=memory&cache=shared');
    bsqlt2 = new_bsqlt('file:your_db_name_here?mode=memory&cache=shared');
    //.........................................................................................................
    /* Create table on first connection, can insert data on second connconnection: */
    bsqlt1.exec(SQL`create table x ( n text );`);
    bsqlt2.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
    bsqlt2.exec(SQL`insert into x ( n ) values ( 'good to see' );`);
    bsqlt2.exec(SQL`insert into x ( n ) values ( 'it does work' );`);
    (() => {      //.........................................................................................................
      /* Sanity check that data was persisted: */
      var ref, results, row, select;
      select = bsqlt2.prepare(SQL`select * from x;`, {}, false);
      select.run();
      ref = select.iterate();
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    (() => {      //.........................................................................................................
      var ref, results, row, select;
      /* Sanity check that UDF does work (on the same connconnection): */
      bsqlt1.function('std_square', {
        varargs: false
      }, function(n) {
        return n ** 2;
      });
      // select  = bsqlt1.prepare SQL"select sqrt( 42 ) as n;"
      select = bsqlt1.prepare(SQL`select std_square( 42 ) as n;`);
      select.run();
      ref = select.iterate();
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    (() => {      //.........................................................................................................
      var ref, results, row, select;
      /* Run query (on 1st connconnection) that calls UDF running another query (on the 2nd connconnection): */
      bsqlt1.function('std_row_count', {
        varargs: false,
        deterministic: false
      }, function() {
        var ref, ref1, rows, statement;
        statement = bsqlt2.prepare(SQL`select count(*) as count from x;`, {}, false);
        statement.run();
        rows = [...statement.iterate()];
        return (ref = (ref1 = rows[0]) != null ? ref1.count : void 0) != null ? ref : null;
      });
      select = bsqlt1.prepare(SQL`select std_row_count() as n;`);
      select.run();
      ref = select.iterate();
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_udf_2 = function() {
    var ref, row, sqlt1, sqlt2;
    // db = new Dbay2()
    sqlt1 = db.create_sqlt_connection('file:your_db_name_here?mode=memory&cache=shared');
    sqlt2 = db.create_sqlt_connection('file:your_db_name_here?mode=memory&cache=shared');
    db.create_function(sqlt1, 'std_square', null, function(n) {
      return n ** 2;
    });
    // db.create_function sqlt1, 'std_row_count', null, ( n ) ->
    //   statement = sqlt1.prepare SQL"select count(*) as count from x;", {}, false
    //   statement.run()
    //   rows      = [ statement.iterate()..., ]
    //   return rows[ 0 ]?.count ? null
    // select  = sqlt1.prepare SQL"select 42 as n, std_square( n ) as p;", sqlt1, false
    // select  = sqlt1.prepare SQL"select 42 as n;", db, false
    // select  = sqlt1.prepare SQL"select sqrt( 42 ) as n;", db, false
    // select  = sqlt1.prepare SQL"select foo( 42 ) as n;", db, false
    select.run();
    ref = select.iterate();
    for (row of ref) {
      info('^309^', row);
    }
    return null;
  };

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
      var ref, results, row, select;
      select = db.sqlt2.prepare(SQL`select * from x;`, {}, false);
      select.run();
      ref = select.iterate();
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    (() => {      //.........................................................................................................
      var ref, results, row, select;
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
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    (() => {      //.........................................................................................................
      var ref, results, row, select;
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
      results = [];
      for (row of ref) {
        results.push(info('^309-1^', row));
      }
      return results;
    })();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // demo_attach_memory_connections_1()
      // demo_udf_1()
      return demo_udf_dbay_sqlt();
    })();
  }

}).call(this);

//# sourceMappingURL=dbay-with-cppdb.demos.js.map