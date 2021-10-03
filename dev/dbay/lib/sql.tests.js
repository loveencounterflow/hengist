(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY advanced interpolation"] = function(T, done) {
    var Dbay, E, db;
    ({Dbay} = require(H.dbay_path));
    E = require(H.dbay_path + '/lib/errors');
    db = new Dbay();
    (() => { //...................................................................................................
      var d, result, sql;
      sql = SQL`select $:col_a, $:col_b where $:col_b in $V:choices`;
      d = {
        col_a: 'foo',
        col_b: 'bar',
        choices: [1, 2, 3]
      };
      result = db.sql.interpolate(sql, d);
      info('^23867^', result);
      return T.eq(result, SQL`select "foo", "bar" where "bar" in ( 1, 2, 3 )`);
    })();
    (() => { //...................................................................................................
      var d, result, sql;
      sql = SQL`select ?:, ?: where ?: in ?V:`;
      d = ['foo', 'bar', 'bar', [1, 2, 3]];
      result = db.sql.interpolate(sql, d);
      info('^23867^', result);
      return T.eq(result, SQL`select "foo", "bar" where "bar" in ( 1, 2, 3 )`);
    })();
    T.throws(/unknown interpolation format 'X'/, () => { //.........................................................
      var d, result, sql;
      sql = SQL`select ?:, ?X: where ?: in ?V:`;
      d = ['foo', 'bar', 'bar', [1, 2, 3]];
      return result = db.sql.interpolate(sql, d);
    });
    return done(); //..................................................................................................
  };

  
  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=sql.tests.js.map