(function() {
  'use strict';
  var GUY, H, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/BASICS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  after = (dts, f) => {
    return new Promise(function(resolve) {
      return setTimeout((function() {
        return resolve(f());
      }), dts * 1000);
    });
  };

  // #.........................................................................................................
  // probes_and_matchers = [
  //   ]
  // #.........................................................................................................
  // for [ probe, matcher, error, ] in probes_and_matchers
  //   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

  //-----------------------------------------------------------------------------------------------------------
  this.simple = async function(T, done) {
    var Interlex, error, i, len, lexer, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    if (T != null) {
      T.eq(lexer._metachr, '𝔛');
    }
    //.........................................................................................................
    probes_and_matchers = [[['xxx', /123/], /123/], [['xxx', /123/ug], /123/ug], [['xxx', /123/guy], /123/guy], [['xxx', /(?<a>x.)/gu], /(?<xxx𝔛a>x.)/gu], [['escchr', /\\(?<chr>.)/u], /(?<escchr𝔛chr>x.)/u]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          //.....................................................................................................
          return resolve(lexer._rename_groups(...probe), matcher);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map