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
  this.add_reserved_chrs = async function(T, done) {
    var Interlex, add_lexemes;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    add_lexemes = function(lexer) {
      var mode;
      mode = 'plain';
      lexer.add_lexeme({
        mode,
        tid: 'escchr',
        pattern: /\\(?<chr>.)/u,
        reserved: '\\'
      });
      lexer.add_lexeme({
        mode,
        tid: 'star2',
        pattern: /(?<!\*)\*\*(?!\*)/u,
        reserved: '*'
      });
      lexer.add_lexeme({
        mode,
        tid: 'heading',
        pattern: /^(?<hashes>#+)\s+/u,
        reserved: '#'
      });
      lexer.add_lexeme({
        mode,
        tid: 'word',
        pattern: /\p{Letter}+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'number_symbol',
        pattern: /#(?=\p{Number})/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'number',
        pattern: /\p{Number}+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'ws',
        pattern: /\s+/u
      });
      lexer.add_catchall_lexeme({mode});
      lexer.add_reserved_lexeme({mode});
      return null;
    };
    await (async() => {      //.........................................................................................................
      var error, i, len, matcher, probe, probes_and_matchers, results;
      probes_and_matchers = [['helo', "word:'helo'", null], ['helo*x', "word:'helo'$reserved:'*'word:'x'", null], ['*x', "$reserved:'*'word:'x'", null], ['## question #1 and a hash: #', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:':'ws:' '$reserved:'#'", null], ['## question #1 and a hash: \\#', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:':'ws:' 'escchr:'\\\\#'", null], [':.;*#', "$catchall:':'$catchall:'.'$catchall:';'$reserved:'*'$reserved:'#'", null]];
      results = [];
      for (i = 0, len = probes_and_matchers.length; i < len; i++) {
        [probe, matcher, error] = probes_and_matchers[i];
        results.push((await T.perform(probe, matcher, error, function() {
          return new Promise(function(resolve, reject) {
            var lexer, result, result_rpr, t;
            lexer = new Interlex({
              catchall_concat: false,
              reserved_concat: false
            });
            add_lexemes(lexer);
            // H.tabulate "lexer", ( x for _, x of lexer.registry.plain.lexemes )
            result = lexer.run(probe);
            // H.tabulate ( rpr probe ), result
            result_rpr = ((function() {
              var j, len1, results1;
              results1 = [];
              for (j = 0, len1 = result.length; j < len1; j++) {
                t = result[j];
                results1.push(`${t.tid}:${rpr(t.value)}`);
              }
              return results1;
            })()).join('');
            return resolve(result_rpr);
          });
        })));
      }
      return results;
    })();
    await (async() => {      //.........................................................................................................
      var error, i, len, matcher, probe, probes_and_matchers, results;
      probes_and_matchers = [['helo', "word:'helo'", null], ['helo*x', "word:'helo'$reserved:'*'word:'x'", null], ['*x', "$reserved:'*'word:'x'", null], ['## question #1 and a hash: #', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:': '$reserved:'#'", null], ['## question #1 and a hash: \\#', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:': 'escchr:'\\\\#'", null], [':.;*#', "$catchall:':.;'$reserved:'*#'", null]];
      results = [];
      for (i = 0, len = probes_and_matchers.length; i < len; i++) {
        [probe, matcher, error] = probes_and_matchers[i];
        results.push((await T.perform(probe, matcher, error, function() {
          return new Promise(function(resolve, reject) {
            var lexer, result, result_rpr, t;
            lexer = new Interlex({
              catchall_concat: true,
              reserved_concat: true
            });
            add_lexemes(lexer);
            // H.tabulate "lexer", ( x for _, x of lexer.registry.plain.lexemes )
            result = lexer.run(probe);
            // H.tabulate ( rpr probe ), result
            result_rpr = ((function() {
              var j, len1, results1;
              results1 = [];
              for (j = 0, len1 = result.length; j < len1; j++) {
                t = result[j];
                results1.push(`${t.tid}:${rpr(t.value)}`);
              }
              return results1;
            })()).join('');
            return resolve(result_rpr);
          });
        })));
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
      // @add_reserved_chrs()
      return test(this.add_reserved_chrs);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-forbidden-chrs.js.map