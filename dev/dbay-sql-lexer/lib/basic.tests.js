(function() {
  'use strict';
  var DBay, GUY, PATH, SQL, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, plain, praise, r, rpr, show, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY-SQL-LEXER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  // X                         = require '../../../lib/helpers'
  r = String.raw;

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  //-----------------------------------------------------------------------------------------------------------
  show = function(sql, tokens) {
    info(rpr(sql));
    echo(dtab._tabulate(tokens));
    return tokens;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sql_lexer = function(T, done) {
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // is identifier: '"foo"" bar"'
// syntax error: 'select +1 as "foo\" bar";'

}).call(this);

//# sourceMappingURL=basic.tests.js.map