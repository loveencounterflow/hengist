(function() {
  'use strict';
  var CND, INTERTYPE, Intertype, alert, badge, debug, echo, help, info, intersection_of, log, njs_path, praise, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'INTERTYPE/tests/main';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  praise = CND.get_logger('praise', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  INTERTYPE = require('../../../apps/intertype');

  ({Intertype} = INTERTYPE);

  ({intersection_of} = require('../../../apps/intertype/lib/helpers'));

  //-----------------------------------------------------------------------------------------------------------
  this["INTERTYPE loupe rpr bug"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [(function() {}),
      true,
      null],
      [void 0,
      null,
      "not a valid function: undefined"],
      [null,
      null,
      "not a valid function: null"],
      [{},
      null,
      "not a valid function: {}"],
      [1n,
      null,
      "not a valid function: 1"],
      [
        {
          /* TAINT should really use `1n` for value representation */
      type: 'through'
        },
        null,
        "not a valid function: { type: 'through' }"
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      //.........................................................................................................
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = validate.function(probe);
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "INTERTYPE loupe rpr bug" ]

}).call(this);

//# sourceMappingURL=loupe-rpr-bug.test.js.map