(function() {
  'use strict';
  var DATOM, GUY, H, H2, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/SORTER'));

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

  H2 = require('./helpers');

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
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this.token_ordering = async function(T, done) {
    var $, Interlex, Pipeline, compose, error, first, i, last, len, matcher, new_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        linewise: true
      });
      //.......................................................................................................
      lexer.add_lexeme({
        mode,
        tid: 'star',
        pattern: /[*]/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'nl',
        pattern: /$/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'letter',
        pattern: /[^*]/u
      });
      //.......................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [['*abc*', '*,a,b,c,*,', null], ['*abc*\ndef', '*,a,b,c,*,,d,e,f,', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, ref, result, result_rpr, result_sorted, token;
          lexer = new_lexer();
          result = [];
          result_rpr = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            result.push(token);
            result_rpr.push(token.value);
          }
          result_sorted = lexer.sorter.sort(result);
          if (T != null) {
            T.eq(result, result_sorted);
          }
          if (T != null) {
            T.eq(lexer.sorter.ordering_is(result.at(0), result.at(-1)), true);
          }
          if (T != null) {
            T.eq(lexer.sorter.ordering_is(result.at(-1), result.at(0)), false);
          }
          if (T != null) {
            T.eq(lexer.sorter.cmp(result.at(0), result.at(-1)), -1);
          }
          if (T != null) {
            T.eq(lexer.sorter.cmp(result.at(-1), result.at(0)), +1);
          }
          if (T != null) {
            T.eq(lexer.sorter.cmp(result.at(-1), result.at(-1)), 0);
          }
          if (T != null) {
            T.eq(lexer.sorter.cmp(result.at(0), result.at(0)), 0);
          }
          // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result_sorted
          // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
          return resolve(result_rpr.join(','));
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

//# sourceMappingURL=test-sorter.js.map