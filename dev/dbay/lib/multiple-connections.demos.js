(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, demo_udf_dbay_sqlt, echo, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

//# sourceMappingURL=multiple-connections.demos.js.map