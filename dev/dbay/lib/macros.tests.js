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
  this.dbay_macros_methods = function(T, done) {
    var DBay, SQL, db, ref, ref1;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of((ref = db.macros) != null ? ref.declare : void 0), 'function');
    }
    if (T != null) {
      T.eq(type_of((ref1 = db.macros) != null ? ref1.resolve : void 0), 'function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_assert_basic_functionality = function(T, done) {
    var DBay, SQL, _test, db;
    /* NOTE this test is a shortened version of the more extensive tests to be found at
     https://github.com/loveencounterflow/hengist/tree/master/dev/dbay-sql-macros/src; it's only here to
     assert that `declare()` and `resolve()` behave in roughly the expted ways. */
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay();
    //.........................................................................................................
    _test = function(probe, matcher) {
      var error, sql, sqlx;
      try {
        sqlx = probe;
        sql = db.macros.resolve(sqlx);
        help(rpr(sqlx));
        info(rpr(sql));
        return T != null ? T.eq(sql, matcher) : void 0;
      } catch (error1) {
        error = error1;
        return T != null ? T.eq("ERROR", `${error.message}\n${rpr(probe)}`) : void 0;
      }
    };
    //.........................................................................................................
    db.macros.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
    (function() {
      var sql, sqlx;
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = SQL`select power( 3, 2 ) / 2;`;
      return _test(sqlx, sql);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_macros_implicit_expansion = function(T, done) {
    var DBay, SQL, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay({
      macros: true
    });
    //.........................................................................................................
    db.macros.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @secret_power( 3, 2 ) as p;`;
      matcher = [
        {
          p: 4.5
        }
      ];
      result = db.all_rows(probe);
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @secret_power( 3, 2 ) as p;`;
      matcher = [4.5];
      result = db.all_first_values(probe);
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (function() {      //.........................................................................................................
      var matcher, probe, result;
      probe = SQL`select @secret_power( 3, 2 ) as p;`;
      matcher = [
        {
          p: 4.5
        }
      ];
      result = db(probe);
      result = [...result];
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @dbay_macros_methods()
      // test @dbay_macros_methods
      // @dbay_macros_implicit_expansion()
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=macros.tests.js.map