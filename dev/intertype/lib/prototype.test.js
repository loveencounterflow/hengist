(function() {
  'use strict';
  var GUY, H, S, _types, alert, debug, echo, equals, help, info, inspect, isa, log, njs_path, plain, praise, rpr, rvr, test, to_width, truth, type_of, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/tests'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  truth = GUY.trm.truth.bind(GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  // { intersection_of }       = require '../../../apps/intertype/lib/helpers'
  H = require('../../../lib/helpers');

  equals = require('../../../apps/intertype/deps/jkroso-equals');

  S = function(parts) {
    return new Set(eval(parts.raw[0]));
  };

  ({to_width} = require('to-width'));

  _types = new (require('intertype')).Intertype();

  ({isa, type_of} = _types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_sample_test_function = function(T, done) {
    var TY;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(type_of(TY.registry.integer), 'function');
    }
    if (T != null) {
      T.eq(TY.registry.integer.length, 1);
    }
    if (T != null) {
      T.eq(TY.registry.integer(1), true);
    }
    if (T != null) {
      T.eq(TY.registry.integer(1.2345678e26), true);
    }
    if (T != null) {
      T.eq(TY.registry.integer(1.2345678), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_isa = function(T, done) {
    var TY;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(type_of(TY.handlers.isa), 'function');
    }
    if (T != null) {
      T.eq(TY.handlers.isa.length, 2);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(TY.isa), 'function');
    }
    if (T != null) {
      T.eq(TY.isa.length, 2);
    }
    if (T != null) {
      T.eq(type_of(TY.isa.integer), 'function');
    }
    if (T != null) {
      T.eq(TY.isa.integer.length, 0);
    }
/* function only takes single spread-argument `( P... ) ->` */    if (T != null) {
      T.eq(TY.isa.integer(42), true);
    }
    if (T != null) {
      T.eq(TY.isa.integer(42.3), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_can_chain_props = function(T, done) {
    var TY;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(TY.isa.even.integer(42), true);
    }
    if (T != null) {
      T.eq(TY.isa.even.integer(42.3), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_isa_needs_at_least_one_prop = function(T, done) {
    var TY;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.throws(/expected at least one property/, function() {
        return TY.isa(42);
      });
    }
    if (T != null) {
      T.throws(/expected at least one property/, function() {
        return TY.isa();
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_can_access_mmx_state = function(T, done) {
    var TY, mmx, state;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(typeof TY.Multimix, 'function');
    }
    if (T != null) {
      T.eq(typeof TY.Multimix.symbol, 'symbol');
    }
    if (T != null) {
      T.eq(typeof (mmx = TY.isa[TY.Multimix.symbol]), 'object');
    }
    if (T != null) {
      T.eq(typeof (state = TY.isa[TY.Multimix.symbol].state), 'object');
    }
    if (T != null) {
      T.eq(state, {
        hedges: []
      });
    }
    TY.isa.integer;
    if (T != null) {
      T.eq(state, {
        hedges: ['integer']
      });
    }
    TY.isa.even.integer;
    if (T != null) {
      T.eq(state, {
        hedges: ['even', 'integer']
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_declare_creates_types = function(T, done) {
    var TY, fn;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(typeof TY.registry.TEST_float, 'undefined');
    }
    if (T != null) {
      T.throws(/expected single property, got 2/, function() {
        return TY.declare.even.TEST_float(function(x) {
          return Number.isFinite(x);
        });
      });
    }
    fn = TY.declare.TEST_float(function(x) {
      return Number.isFinite(x);
    });
    if (T != null) {
      T.eq(typeof TY.registry.TEST_float, 'function');
    }
    if (T != null) {
      T.ok(TY.registry.TEST_float === fn);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_or = function(T, done) {
    var TY;
    TY = require('./intertype-prototype');
    if (T != null) {
      T.eq(TY.isa.integer(42), true);
    }
    if (T != null) {
      T.eq(TY.isa.text('helo'), true);
    }
    if (T != null) {
      T.eq(TY.isa.text(null), false);
    }
    if (T != null) {
      T.eq(TY.isa.integer.or.text(42), true);
    }
    if (T != null) {
      T.eq(TY.isa.integer.or.text('helo'), true);
    }
    if (T != null) {
      T.eq(TY.isa.integer.or.text(null), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=prototype.test.js.map