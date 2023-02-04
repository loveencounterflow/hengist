(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.add_forbidden_chrs = function(T, done) {
    var Interlex, c, lexer;
    ({
      // T?.halt_on_error()
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    (() => {      //.........................................................................................................
      var catchall, exclude, forbidden, i, len, mode, probe, ref, results;
      mode = 'plain';
      lexer.add_lexeme({
        mode,
        tid: 'star1',
        pattern: /(?<!\*)\*(?!\*)/u,
        forbidden: '*'
      });
      // lexer.new_pattern_
      exclude = c.charSet.complement.bind(c.charSet);
      // debug pattern = c.charSet.union ( exclude '*' ), ( exclude 'x' )
      forbidden = /[*x#]/;
      catchall = c.suffix('*', exclude(forbidden));
      debug({forbidden, catchall});
      ref = ['helo', 'helo*x', '*x'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        probe = ref[i];
        debug(GUY.trm.reverse(GUY.trm.steel(probe)));
        help(probe.match(catchall));
        results.push(warn(probe.match(forbidden)));
      }
      return results;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.add_forbidden_chrs();
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-forbidden-chrs.js.map