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
    var types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(type_of(types.registry.integer), 'function');
    }
    if (T != null) {
      T.eq(types.registry.integer.length, 1);
    }
    if (T != null) {
      T.eq(types.registry.integer(1), true);
    }
    if (T != null) {
      T.eq(types.registry.integer(1.2345678e26), true);
    }
    if (T != null) {
      T.eq(types.registry.integer(1.2345678), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_isa = function(T, done) {
    var handlers, types;
    types = new (require('./intertype-prototype')).Intertype();
    handlers = types.constructor._get_handlers(types);
    if (T != null) {
      T.eq(type_of(handlers.isa), 'function');
    }
    if (T != null) {
      T.eq(handlers.isa.length, 2);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(types.isa), 'function');
    }
    if (T != null) {
      T.eq(types.isa.length, 0);
    }
    if (T != null) {
      T.eq(type_of(types.isa.integer), 'function');
    }
    if (T != null) {
      T.eq(types.isa.integer.length, 0);
    }
/* function only takes single spread-argument `( P... ) ->` */    if (T != null) {
      T.eq(types.isa.integer(42), true);
    }
    if (T != null) {
      T.eq(types.isa.integer(42.3), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_can_chain_props = function(T, done) {
    var types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(types.isa.even.integer(42), true);
    }
    if (T != null) {
      T.eq(types.isa.even.integer(42.3), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_isa_needs_at_least_one_prop = function(T, done) {
    var types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.throws(/expected at least one property/, function() {
        var error;
        try {
          return types.isa(42);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.throws(/expected at least one property/, function() {
        var error;
        try {
          return types.isa();
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_can_access_mmx_state = function(T, done) {
    var TY, mmx, state, types;
    TY = require('./intertype-prototype');
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(typeof TY.Multimix, 'function');
    }
    if (T != null) {
      T.eq(typeof TY.Multimix.symbol, 'symbol');
    }
    if (T != null) {
      T.eq(typeof (mmx = types.isa[TY.Multimix.symbol]), 'object');
    }
    if (T != null) {
      T.eq(typeof (state = types.isa[TY.Multimix.symbol].state), 'object');
    }
    if (T != null) {
      T.eq(state.hedges, []);
    }
    if (T != null) {
      T.ok(types.state === state);
    }
    if (T != null) {
      T.ok(types.mmx === mmx);
    }
    types.isa.integer;
    if (T != null) {
      T.eq(state.hedges, ['integer']);
    }
    types.isa.even.integer;
    if (T != null) {
      T.eq(state.hedges, ['even', 'integer']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_state_and_trace_not_shared = function(T, done) {
    var types_1, types_2;
    types_1 = new (require('./intertype-prototype')).Intertype();
    types_2 = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.ok(types_1.state !== types_2.state);
    }
    if (T != null) {
      T.ok(types_1.state.hedges !== types_2.state.hedges);
    }
    if (T != null) {
      T.ok(types_1.state.trace !== types_2.state.trace);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_declare_creates_types = function(T, done) {
    var fn, types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(typeof types.registry.TEST_float, 'undefined');
    }
    if (T != null) {
      T.throws(/expected single property, got 2/, function() {
        var error;
        try {
          return types.declare.even.TEST_float(function(x) {
            return Number.isFinite(x);
          });
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    fn = types.declare.TEST_float(function(x) {
      return Number.isFinite(x);
    });
    if (T != null) {
      T.eq(typeof types.registry.TEST_float, 'function');
    }
    if (T != null) {
      T.ok(types.registry.TEST_float === fn);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_or = function(T, done) {
    var types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(types.isa.integer(42), true);
    }
    if (T != null) {
      T.eq(types.isa.text('helo'), true);
    }
    if (T != null) {
      T.eq(types.isa.text(null), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.throws(/cannot have two `or` props in succession/, function() {
        var error;
        try {
          return types.isa.even.integer.or.or.text(42);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.throws(/cannot have `or` as first prop/, function() {
        var error;
        try {
          return types.isa.or.integer(42);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.throws(/cannot have `or` as last prop/, function() {
        var error;
        try {
          return types.isa.even.integer.or(42);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.integer.or.text(42), true);
    }
    if (T != null) {
      T.eq(types.isa.integer.or.text('helo'), true);
    }
    if (T != null) {
      T.eq(types.isa.integer.or.text(null), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_of = function(T, done) {
    var types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(types.isa.list([]), true);
    }
    if (T != null) {
      T.eq(types.isa.list('helo'), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.throws(/cannot have two `of` props in succession/, function() {
        var error;
        try {
          return types.isa.list.of.of.text([42]);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.throws(/cannot have `of` as first prop/, function() {
        var error;
        try {
          return types.isa.of.integer(42);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.throws(/cannot have `of` as last prop/, function() {
        var error;
        try {
          return types.isa.list.of([42]);
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.list.of.integer([4, 5, 6, true]), false);
    }
    if (T != null) {
      T.eq(types.isa.list.of.integer(['helo']), false);
    }
    if (T != null) {
      T.eq(types.isa.list.of.integer(6), false);
    }
    if (T != null) {
      T.eq(types.isa.list.of.text('helo'), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.list.of.text([]), true);
    }
    if (T != null) {
      T.eq(types.isa.list.of.integer([]), true);
    }
    if (T != null) {
      T.eq(types.isa.list.of.text(['helo']), true);
    }
    if (T != null) {
      T.eq(types.isa.list.of.integer([4, 5, 6]), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_traces_are_being_written = function(T, done) {
    var checkpoint, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, ref, ref1, ref2, ref3, ref4, ref5, types;
    types = new (require('./intertype-prototype')).Intertype();
    if (T != null) {
      T.eq(types.state.trace, []);
    }
    help('^003-1^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, []);
    }
    whisper('^003-2^', '———————————————————————————————');
    types.isa.integer(42);
    ref = types.state.trace;
    for (i = 0, len = ref.length; i < len; i++) {
      checkpoint = ref[i];
      urge('^003-3^', checkpoint);
    }
    help('^003-4^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'integer',
          x: 42,
          R: true
        }
      ]);
    }
    whisper('^003-5^', '———————————————————————————————');
    types.isa.text('helo');
    ref1 = types.state.trace;
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      checkpoint = ref1[j];
      urge('^003-6^', checkpoint);
    }
    help('^003-7^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'text',
          x: 'helo',
          R: true
        }
      ]);
    }
    whisper('^003-8^', '———————————————————————————————');
    types.isa.text(null);
    ref2 = types.state.trace;
    for (k = 0, len2 = ref2.length; k < len2; k++) {
      checkpoint = ref2[k];
      urge('^003-9^', checkpoint);
    }
    help('^003-10^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'text',
          x: null,
          R: false
        }
      ]);
    }
    whisper('^003-11^', '———————————————————————————————');
    types.isa.integer.or.text(42);
    ref3 = types.state.trace;
    for (l = 0, len3 = ref3.length; l < len3; l++) {
      checkpoint = ref3[l];
      urge('^003-12^', checkpoint);
    }
    help('^003-13^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'integer',
          x: 42,
          R: true
        },
        {
          ref: '▲i2',
          level: 0,
          prop: 'or',
          x: 42,
          R: true
        }
      ]);
    }
    whisper('^003-14^', '———————————————————————————————');
    types.isa.integer.or.text('helo');
    ref4 = types.state.trace;
    for (m = 0, len4 = ref4.length; m < len4; m++) {
      checkpoint = ref4[m];
      urge('^003-15^', checkpoint);
    }
    help('^003-16^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'integer',
          x: 'helo',
          R: false
        },
        {
          ref: '▲i1',
          level: 0,
          prop: 'or',
          x: 'helo',
          R: false
        },
        {
          ref: '▲i3',
          level: 0,
          prop: 'text',
          x: 'helo',
          R: true
        }
      ]);
    }
    whisper('^003-17^', '———————————————————————————————');
    types.isa.integer.or.text(null);
    ref5 = types.state.trace;
    for (n = 0, len5 = ref5.length; n < len5; n++) {
      checkpoint = ref5[n];
      urge('^003-18^', checkpoint);
    }
    help('^003-19^', types.state.trace);
    if (T != null) {
      T.eq(types.state.trace, [
        {
          ref: '▲i3',
          level: 0,
          prop: 'integer',
          x: null,
          R: false
        },
        {
          ref: '▲i1',
          level: 0,
          prop: 'or',
          x: null,
          R: false
        },
        {
          ref: '▲i3',
          level: 0,
          prop: 'text',
          x: null,
          R: false
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @itproto_debugging_is_deactivated = ( T, done ) ->
  //   collector       = []
  //   stdout          = process.stdout
  //   stderr          = process.stderr
  //   Object.defineProperty process, 'stdout', value: ( text ) -> collector.push text; stdout.write text
  //   Object.defineProperty process, 'stderr', value: ( text ) -> collector.push text; stderr.write text
  //   #.........................................................................................................
  //   types = new ( require './intertype-prototype' ).Intertype()
  //   types.isa.integer 42
  //   types.isa.text 'helo'
  //   types.isa.text null
  //   types.isa.integer.or.text 42
  //   types.isa.integer.or.text 'helo'
  //   types.isa.integer.or.text null
  //   #.........................................................................................................
  //   T?.eq collector.length, 0
  //   warn '^003-20^', rvr collector unless collector.length is 0
  //   done?()

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @itproto_can_access_mmx_state
      // test @itproto_of
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=prototype.test.js.map