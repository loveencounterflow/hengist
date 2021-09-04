(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, jp, jr, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/FUNCTIONS';

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  on_process_exit = require('exit-hook');

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: get_foreign_keys_deferred() etc"] = function(T, done) {
    var Dba, dba, error, list_table_a;
    // T?.halt_on_error()
    ({Dba} = require(H.icql_dba_path));
    //.........................................................................................................
    list_table_a = function(dba) {
      var ref, results, row;
      ref = dba.query(SQL`select n from a;`);
      results = [];
      for (row of ref) {
        results.push(row.n);
      }
      return results;
    };
    //.........................................................................................................
    error = null;
    dba = new Dba();
    // dba.open { schema: 'main', }
    dba.execute(SQL`create table a ( n integer not null primary key references b ( n ) );
create table b ( n integer not null primary key references a ( n ) deferrable initially deferred );`);
    try {
      //.........................................................................................................
      dba.with_transaction(function() {
        dba.execute(SQL`insert into b ( n ) values ( 100 );`);
        return dba.execute(SQL`insert into a ( n ) values ( 100 );`);
      });
    } catch (error1) {
      // dba.execute SQL"insert into a ( n ) values ( 101 );"
      error = error1;
      warn(error.message);
    }
    debug('^907^', dba.list(dba.query(SQL`select * from a;`)));
    debug('^907^', dba.list(dba.query(SQL`select * from b;`)));
    debug('^907^', dba.pragma("foreign_key_list( 'a' );"));
    debug('^907^', dba.pragma("foreign_key_list( 'b' );"));
    //.........................................................................................................
    if (T != null) {
      T.eq(dba.get_foreign_keys_state(), true);
    }
    if (T != null) {
      T.eq(dba.get_foreign_keys_deferred(), false);
    }
    if (T != null) {
      T.eq(dba.get_unsafe_mode(), false);
    }
    if (T != null) {
      T.eq(dba.within_transaction(), false);
    }
    if (T != null) {
      T.eq(dba.get_unsafe_mode(), false);
    }
    //.........................................................................................................
    dba.with_transaction(function() {
      return T != null ? T.eq(dba.within_transaction(), true) : void 0;
    });
    if (T != null) {
      T.eq(dba.within_transaction(), false);
    }
    //.........................................................................................................
    dba.with_unsafe_mode(function() {
      return T != null ? T.eq(dba.get_unsafe_mode(), true) : void 0;
    });
    if (T != null) {
      T.eq(dba.get_unsafe_mode(), false);
    }
    //.........................................................................................................
    dba.with_foreign_keys_deferred(function() {
      if (T != null) {
        T.eq(dba.get_foreign_keys_deferred(), true);
      }
      return T != null ? T.eq(dba.within_transaction(), true) : void 0;
    });
    if (T != null) {
      T.eq(dba.get_foreign_keys_deferred(), false);
    }
    if (T != null) {
      T.eq(dba.within_transaction(), false);
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

//# sourceMappingURL=checks.tests.js.map