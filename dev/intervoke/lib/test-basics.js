(function() {
  'use strict';
  var GUY, alert, debug, echo, get_isa_class, help, info, inspect, log, plain, praise, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERVOKE/TESTS/BASIC'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // probes_and_matchers = [
  //   ]
  // #.........................................................................................................
  // for [ probe, matcher, error, ] in probes_and_matchers
  //   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

  //===========================================================================================================
  get_isa_class = function() {
    var IVK, Isa;
    IVK = require('../../../apps/intervoke');
    Isa = (function() {
      //===========================================================================================================
      class Isa extends IVK.Analyzing_attributor {
        //---------------------------------------------------------------------------------------------------------
        __create_handler(phrase) {
          return function(details) {
            return 'Yo';
          };
        }

      };

      //---------------------------------------------------------------------------------------------------------
      Isa.__cache = new Map(Object.entries({
        null: function(x) {
          return x === null;
        },
        undefined: function(x) {
          return x === void 0;
        },
        boolean: function(x) {
          return (x === true) || (x === false);
        },
        float: function(x) {
          return Number.isFinite(x);
        },
        symbol: function(x) {
          return (typeof x) === 'symbol';
        }
      }));

      return Isa;

    }).call(this);
    //===========================================================================================================
    return Isa;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.ivk_isa = function(T, done) {
    var IVK, Isa, e, isa;
    IVK = require('../../../apps/intervoke');
    Isa = get_isa_class();
    //.........................................................................................................
    isa = new Isa();
    try {
      // debug '^98-2^', isa.__cache
      debug('^98-3^', (new IVK.Attributor()).__do());
    } catch (error1) {
      e = error1;
      warn(GUY.trm.reverse(e.message));
    }
    if (T != null) {
      T.throws(/not allowed to call method '__do' of abstract base class/, function() {
        return (new IVK.Attributor()).__do();
      });
    }
    if (T != null) {
      T.eq(isa('float', 42), true);
    }
    if (T != null) {
      T.eq(isa.float(42), true);
    }
    if (T != null) {
      T.eq(isa.float(0/0), false);
    }
    if (T != null) {
      T.eq(isa.float('22'), false);
    }
    // info '^98-9^', [ isa.__cache.keys()..., ]
    if (T != null) {
      T.eq([...isa.__cache.keys()], ['null', 'undefined', 'boolean', 'float', 'symbol']);
    }
    isa.float___or_text(42);
    if (T != null) {
      T.eq([...isa.__cache.keys()], ['null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text']);
    }
    isa.float_or_text(42);
    if (T != null) {
      T.eq([...isa.__cache.keys()], ['null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text']);
    }
    isa('float   or text', 42);
    if (T != null) {
      T.eq([...isa.__cache.keys()], ['null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text', 'float   or text']);
    }
    // debug '^98-16^', isa.__cache.get 'float_or_text'
    // debug '^98-17^', isa.float_or_text
    if (T != null) {
      T.eq((isa.__cache.get('float___or_text')) === (isa.__cache.get('float_or_text')), true);
    }
    if (T != null) {
      T.eq((isa.__cache.get('float___or_text')) === (isa.__cache.get('float   or text')), true);
    }
    if (T != null) {
      T.eq((isa.__cache.get('float_or_text')).name === 'float_or_text', true);
    }
    if (T != null) {
      T.eq((isa.__cache.get('float_or_text')) === isa.float_or_text, false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_longest_first_matching = function(T, done) {
    var analyze_ncc, error, i, len, matcher, probe, probes_and_matchers, re_from_vocabulary, result, sort_vocabulary, vocabulary, vocabulary_re;
    vocabulary = ['of', 'or', 'empty', 'nonempty', 'list', 'empty list', 'empty list of', 'integer', 'list of', 'of integer'];
    //-----------------------------------------------------------------------------------------------------------
    sort_vocabulary = function(vocabulary) {
      return [...vocabulary].sort(function(a, b) {
        if (a.length < b.length) {
          /* TAINT in edge cases, sorting can be off when code units != code points */
          return +1;
        }
        if (a.length > b.length) {
          return -1;
        }
        return 0;
      });
    };
    //-----------------------------------------------------------------------------------------------------------
    re_from_vocabulary = function(vocabulary) {
      var term, words_pattern;
      vocabulary = sort_vocabulary(vocabulary);
      words_pattern = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = vocabulary.length; i < len; i++) {
          term = vocabulary[i];
          results.push(`(?:${GUY.str.escape_for_regex(term)})`);
        }
        return results;
      })()).join('|');
      return new RegExp(`(?<=^|\\s+)${words_pattern}(?=$|\\s+)`, 'ug');
    };
    //-----------------------------------------------------------------------------------------------------------
    analyze_ncc = function(vocabulary_re, ncc) {
      var d, ref, results, y;
      ref = probe.matchAll(vocabulary_re);
      results = [];
      for (y of ref) {
        [d] = y;
        results.push(d);
      }
      return results;
    };
    // info '^95-1^', vocabulary
    probes_and_matchers = [['list of integer', ['list of', 'integer']], ['empty list of integer', ['empty list of', 'integer']], ['nonempty integer list', ['nonempty', 'integer', 'list']], ['empty list of integer or list of text', ['empty list of', 'integer', 'or', 'list of']], ['nonempty list of integer or list of text', ['nonempty', 'list of', 'integer', 'or', 'list of']], ['integer', ['integer']]];
    vocabulary_re = re_from_vocabulary(vocabulary);
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      result = analyze_ncc(vocabulary_re, probe);
      info('^23423^', [probe, result]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      // @ivk_isa()
      // test @ivk_isa
      return this.demo_longest_first_matching();
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map