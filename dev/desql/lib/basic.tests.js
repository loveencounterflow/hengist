(function() {
  'use strict';
  var CND, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DESQL/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  ({SQL} = DBay);

  //-----------------------------------------------------------------------------------------------------------
  this["XXXXXX"] = function(T, done) {
    var DBay, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    db = new DBay();
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (modules === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map