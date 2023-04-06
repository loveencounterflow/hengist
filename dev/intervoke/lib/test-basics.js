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
    } catch (error) {
      e = error;
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

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      // @ivk_isa()
      return test(this.ivk_isa);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map