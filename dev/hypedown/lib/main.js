(function() {
  'use strict';
  var GUY, H, PATH, alert, debug, demo, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  // SQL                       = String.raw
  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, d, error, i, len, matcher, p, probe, probes_and_matchers, result, result_rpr;
    ({XXX_new_token, Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null], ['*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // H.show_lexer_as_table "Hypedown lexer", lexer = new Hypedown_lexer()
      // debug '^23-1^', t for t from lexer.walk probe
      p = new Hypedown_parser();
      // H.show_lexer_as_table "Hypedown_parser lexer", p.lexer
      p.send(XXX_new_token('^æ19^', {
        start: 0,
        stop: probe.length
      }, 'plain', 'p', null, probe));
      result = p.run();
      result_rpr = ((function() {
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
      // urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate(`${probe} -> ${result_rpr} (${matcher})`, result); // unless result_rpr is matcher
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map