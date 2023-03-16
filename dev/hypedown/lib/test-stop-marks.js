(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/STOP-MARKERS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.parse_stop_marks = async function(T, done) {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    ({XXX_new_token} = require('../../../apps/hypedown/lib/helpers'));
    probes_and_matchers = [['*abc*', '<p><i>abc</i>\n', null], ['*abc*<?stop?>*xyz*', '<p><i>abc</i>\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_html, t;
          p = new Hypedown_parser();
          p.send(probe);
          result = p.run();
          result_html = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, result);
          console.table(result);
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          //.....................................................................................................
          return resolve(result_html);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-stop-marks.js.map