(function() {
  'use strict';
  var GUY, H, S, _types, alert, debug, echo, equals, help, info, inspect, intertype_path, isa, log, njs_path, plain, praise, rpr, rvr, test, to_width, truth, type_of, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/type-factory.tests'));

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

  intertype_path = './main';

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_tf_import = function(T, done) {
    var Type_factory;
    ({Type_factory} = require(intertype_path));
    debug('^3442^', Type_factory);
    if (T != null) {
      T.ok(Type_factory != null);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_tf_new = function(T, done) {
    var Type_factory;
    ({Type_factory} = require(intertype_path));
    if (T != null) {
      T.throws(/not a valid object/, function() {
        var error;
        try {
          return new Type_factory();
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.ok((new Type_factory({})) != null);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_tf_present_on_types = function(T, done) {
    var Intertype, Type_factory, types;
    ({Intertype, Type_factory} = require(intertype_path));
    types = new Intertype();
    if (T != null) {
      T.ok(types.type_factory instanceof Type_factory);
    }
    debug('^410-1^', types);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_declare_with_function = function(T, done) {
    var fn, types;
    types = new (require(intertype_path)).Intertype();
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
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.TEST_float(1234.5678), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_float(-1e26), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_float('1234.5678'), false);
    }
    if (T != null) {
      T.eq(types.isa.TEST_float(0/0), false);
    }
    if (T != null) {
      T.eq(types.isa.TEST_float(2e308), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_declare_with_object = function(T, done) {
    var fn, types;
    types = new (require(intertype_path)).Intertype();
    if (T != null) {
      T.eq(typeof types.registry.TEST_quantity, 'undefined');
    }
    //.........................................................................................................
    fn = types.declare.TEST_quantity({
      isa: function(x) {
        return this.isa.object(x);
      },
      $value: 'float',
      $unit: 'nonempty.text',
      default: {
        value: 0,
        unit: null
      }
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(typeof types.registry.TEST_quantity, 'function');
    }
    if (T != null) {
      T.ok(types.registry.TEST_quantity === fn);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.TEST_quantity({
        value: 1,
        unit: 'm'
      }), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_quantity('red'), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_declare_with_list = function(T, done) {
    var fn, types;
    types = new (require(intertype_path)).Intertype();
    if (T != null) {
      T.eq(typeof types.registry.TEST_color, 'undefined');
    }
    fn = types.declare.TEST_color(['red', 'green', 'blue']);
    if (T != null) {
      T.eq(typeof types.registry.TEST_color, 'function');
    }
    if (T != null) {
      T.ok(types.registry.TEST_color === fn);
    }
    //.........................................................................................................
    debug('^011-1^', types.isa.TEST_color('red'));
    debug('^011-1^', types.isa.TEST_color('mauve'));
    if (T != null) {
      T.eq(types.isa.TEST_color('red'), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_color('green'), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_color('blue'), true);
    }
    if (T != null) {
      T.eq(types.isa.TEST_color('mauve'), false);
    }
    if (T != null) {
      T.eq(types.isa.TEST_color(['red']), false);
    }
    if (T != null) {
      T.eq(types.isa.TEST_color(['mauve']), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.itproto_cannot_redeclare = function(T, done) {
    var types;
    types = new (require(intertype_path)).Intertype();
    if (T != null) {
      T.eq(typeof types.registry.TEST_float, 'undefined');
    }
    types.declare.TEST_color(['red', 'green', 'blue']);
    if (T != null) {
      T.throws(/cannot redeclare type 'TEST_color'/, function() {
        var error;
        try {
          return types.declare.TEST_color(function() {});
        } catch (error1) {
          error = error1;
          warn(rvr(error.message));
          throw error;
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      this.itproto_declare_with_function({
        eq: (function() {}),
        ok: (function() {}),
        throws: (function() {})
      }, function() {});
      return test(this.itproto_declare_with_function);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=type-factory.tests.js.map