(function() {
  'use strict';
  var CND, PATH, badge, debug, echo, freeze, help, info, lets, rpr, test, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/STATE-ENGINE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  this["STATEMACHINE xxxxx"] = async function(T, done) {
    var error, i, len, matcher, probe, probes_and_matchers;
    // MIXA = require '../../../apps/mixa'
    //.........................................................................................................
    probes_and_matchers = [];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(MIXA.types.isa(type, value));
        });
      });
    }
    done();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo_generator());
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map