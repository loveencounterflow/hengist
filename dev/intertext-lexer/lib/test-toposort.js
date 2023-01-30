(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, show, stamp, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/TOPOSORT'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  H = require('../../../lib/helpers');

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show = function(topograph) {
    var LTSORT, dependencies, error, name, ordering, precedents, ref, table, x, y;
    LTSORT = require('../../../apps/ltsort');
    try {
      dependencies = LTSORT.group(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn(GUY.trm.reverse(error.message));
      warn('^08-1^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    info('^08-2^', dependencies);
    try {
      ordering = LTSORT.linearize(topograph);
    } catch (error1) {
      error = error1;
      if ((error.message.match(/detected cycle involving node/)) == null) {
        throw error;
      }
      warn('^08-3^', GUY.trm.reverse(error.message));
    }
    // throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
    table = [];
    ref = topograph.precedents.entries();
    for (y of ref) {
      [name, precedents] = y;
      precedents = precedents.join(', ');
      table.push({name, precedents});
    }
    H.tabulate("topograph", table);
    info('^08-4^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = ordering.length; i < len; i++) {
        x = ordering[i];
        results.push(GUY.trm.yellow(x));
      }
      return results;
    })()).join(GUY.trm.grey(' => ')));
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.parse_stars_using_toposort = async function(T, done) {
    var $, Interlex, Pipeline, compose, error, first, i, last, len, matcher, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      //.........................................................................................................
      lexer.add_lexeme({
        mode,
        tid: 'star1',
        pattern: /\*{1}/u,
        needs: 'star2'
      });
      lexer.add_lexeme({
        mode,
        tid: 'star2',
        pattern: /\*{2}/u,
        precedes: 'star1',
        needs: 'star3'
      });
      lexer.add_lexeme({
        mode,
        tid: 'star3',
        pattern: /\*{3}/u,
        precedes: '*'
      });
      lexer.add_lexeme({
        mode,
        tid: 'escchr',
        pattern: /\\(?<chr>.)/u,
        precedes: '*'
      });
      lexer.add_lexeme({
        mode,
        tid: 'other',
        pattern: /[^*\\]+/u,
        needs: '*'
      });
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [["*abc*", "[md:star1,(0:1),='*'][md:other,(1:4),='abc'][md:star1,(4:5),='*'][md:$eof,(5:5),='']"], ['*abc\\*', "[md:star1,(0:1),='*'][md:other,(1:4),='abc'][md:escchr,(4:6),='\\\\*',chr:'*'][md:$eof,(6:6),='']", null], ['**abc**', "[md:star2,(0:2),='**'][md:other,(2:5),='abc'][md:star2,(5:7),='**'][md:$eof,(7:7),='']", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, result, result_rpr, t, tid;
          lexer = new_toy_md_lexer('md');
          if (T != null) {
            T.eq((function() {
              var results;
              results = [];
              for (tid in lexer.registry.md.lexemes) {
                results.push(tid);
              }
              return results;
            })(), ['star1', 'star2', 'star3', 'escchr', 'other']);
          }
          result = lexer.run(probe);
          if (T != null) {
            T.eq((function() {
              var results;
              results = [];
              for (tid in lexer.registry.md.lexemes) {
                results.push(tid);
              }
              return results;
            })(), ['escchr', 'star3', 'star2', 'star1', 'other']);
          }
          result_rpr = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              results.push(lexer.rpr_token(t));
            }
            return results;
          })()).join('');
          //.....................................................................................................
          return resolve(result_rpr);
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
      return test(this.parse_stars_using_toposort);
    })();
  }

  // @toposort()
// test @

}).call(this);

//# sourceMappingURL=test-toposort.js.map