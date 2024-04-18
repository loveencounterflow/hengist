(async function() {
  'use strict';
  var GUY, TMP_types, alert, debug, echo, help, info, inspect, log, plain, praise, reverse, rpr, sample_declarations, test, throws, try_and_show, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype/test-basics'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  test = require('../../../apps/guy-test');

  TMP_types = new (require('intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  // s                         = ( name ) -> Symbol.for  name
  // ps                        = ( name ) -> Symbol      name

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  //###########################################################################################################

  // #===========================================================================================================
  // isa_object = ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
  // as_object = ( x ) ->
  //   return x unless isa_object x
  //   R       = {}
  //   R[ k ]  = as_object v for k, v of x
  //   return R

  //===========================================================================================================
  sample_declarations = {
    boolean: function(x) {
      return (x === true) || (x === false);
    },
    function: function(x) {
      return (Object.prototype.toString.call(x)) === '[object Function]';
    },
    asyncfunction: function(x) {
      return (Object.prototype.toString.call(x)) === '[object AsyncFunction]';
    },
    symbol: function(x) {
      return (typeof x) === 'symbol';
    },
    object: function(x) {
      return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
    },
    float: function(x) {
      return Number.isFinite(x);
    },
    text: function(x) {
      return (typeof x) === 'string';
    },
    nullary: function(x) {
      return (x != null) && ((x.length === 0) || (x.size === 0));
    },
    unary: function(x) {
      return (x != null) && ((x.length === 1) || (x.size === 1));
    },
    binary: function(x) {
      return (x != null) && ((x.length === 2) || (x.size === 2));
    },
    trinary: function(x) {
      return (x != null) && ((x.length === 3) || (x.size === 3));
    }
  };

  //===========================================================================================================
  throws = async function(T, matcher, f) {
    await (async() => {
      var error, matcher_type, message;
      error = null;
      try {
        await f();
      } catch (error1) {
        error = error1;
        switch (matcher_type = TMP_types.type_of(matcher)) {
          case 'text':
            if (T != null) {
              T.eq(error.message, matcher);
            }
            break;
          case 'regex':
            matcher.lastIndex = 0;
            if (matcher.test(error.message)) {
              null;
            } else {
              warn('^992-4^', reverse(message = `error ${rpr(error.message)} doesn't match ${rpr(matcher)}`));
              T.fail(`^992-4^ ${message}`);
            }
            break;
          default:
            warn(message = `^992-1^ expected a regex or a text, got a ${matcher_type}`);
            T.fail(message);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    return null;
  };

  //===========================================================================================================
  try_and_show = function(T, f) {
    var e, message;
    e = null;
    try {
      urge('^992-2^', f());
    } catch (error1) {
      e = error1;
      help('^992-3^', reverse(`try_and_show: ${rpr(e.message)}`));
    }
    if (e == null) {
      warn('^992-4^', reverse(message = "expected an error but none was thrown"));
      T.fail("^992-5^ expected an error but none was thrown");
    }
    return null;
  };

  //###########################################################################################################

  //===========================================================================================================
  this.interface = function(T, done) {
    var INTERTYPE;
    INTERTYPE = require('../../../apps/intertype');
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_isa), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_isa_optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_validate), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_validate_optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.isa), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.isa.optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.validate), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.validate.optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.isa.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.validate.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.create), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.isa.text), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.create.text), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, types;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype(sample_declarations);
    if (T != null) {
      T.eq(types.isa.boolean(false), true);
    }
    if (T != null) {
      T.eq(types.isa.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.isa.boolean(null), false);
    }
    if (T != null) {
      T.eq(types.isa.boolean(1), false);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(false), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(null), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(1), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.validate.boolean(false), false);
    }
    if (T != null) {
      T.eq(types.validate.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(false), false);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(void 0), void 0);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(null), null);
    }
    try_and_show(T, function() {
      return types.validate.boolean(1);
    });
    try_and_show(T, function() {
      return types.validate.optional.boolean(1);
    });
    throws(T, /expected a boolean/, function() {
      return types.validate.boolean(1);
    });
    throws(T, /expected an optional boolean/, function() {
      return types.validate.optional.boolean(1);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of(null), 'null');
    }
    if (T != null) {
      T.eq(types.type_of(void 0), 'undefined');
    }
    if (T != null) {
      T.eq(types.type_of(false), 'boolean');
    }
    if (T != null) {
      T.eq(types.type_of(Symbol('p')), 'symbol');
    }
    if (T != null) {
      T.eq(types.type_of({}), 'object');
    }
    if (T != null) {
      T.eq(types.type_of(0/0), 'unknown');
    }
    if (T != null) {
      T.eq(types.type_of(+2e308), 'unknown');
    }
    if (T != null) {
      T.eq(types.type_of(-2e308), 'unknown');
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.asyncfunction.name, 'isa_asyncfunction');
    }
    if (T != null) {
      T.eq(types.isa.optional.asyncfunction.name, 'isa_optional_asyncfunction');
    }
    if (T != null) {
      T.eq(types.validate.asyncfunction.name, 'validate_asyncfunction');
    }
    if (T != null) {
      T.eq(types.validate.optional.asyncfunction.name, 'validate_optional_asyncfunction');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_standalone_methods = function(T, done) {
    var INTERTYPE, isa, type_of, validate;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype(sample_declarations));
    if (T != null) {
      T.eq(isa.boolean(false), true);
    }
    if (T != null) {
      T.eq(isa.boolean(true), true);
    }
    if (T != null) {
      T.eq(isa.boolean(null), false);
    }
    if (T != null) {
      T.eq(isa.boolean(1), false);
    }
    if (T != null) {
      T.eq(isa.unknown(1), false);
    }
    if (T != null) {
      T.eq(isa.unknown(2e308), true);
    }
    if (T != null) {
      T.eq(isa.optional.boolean(false), true);
    }
    if (T != null) {
      T.eq(isa.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(isa.optional.boolean(null), true);
    }
    if (T != null) {
      T.eq(isa.optional.boolean(1), false);
    }
    if (T != null) {
      T.eq(isa.optional.unknown(1), false);
    }
    if (T != null) {
      T.eq(isa.optional.unknown(2e308), true);
    }
    if (T != null) {
      T.eq(isa.optional.unknown(void 0), true);
    }
    if (T != null) {
      T.eq(isa.optional.unknown(void 0), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(validate.boolean(false), false);
    }
    if (T != null) {
      T.eq(validate.boolean(true), true);
    }
    if (T != null) {
      T.eq(validate.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(validate.optional.boolean(false), false);
    }
    if (T != null) {
      T.eq(validate.optional.boolean(void 0), void 0);
    }
    if (T != null) {
      T.eq(validate.optional.boolean(null), null);
    }
    try_and_show(T, function() {
      return validate.boolean(1);
    });
    try_and_show(T, function() {
      return validate.optional.boolean(1);
    });
    throws(T, /expected a boolean/, function() {
      return validate.boolean(1);
    });
    throws(T, /expected an optional boolean/, function() {
      return validate.optional.boolean(1);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(null), 'null');
    }
    if (T != null) {
      T.eq(type_of(void 0), 'undefined');
    }
    if (T != null) {
      T.eq(type_of(false), 'boolean');
    }
    if (T != null) {
      T.eq(type_of(Symbol('p')), 'symbol');
    }
    if (T != null) {
      T.eq(type_of({}), 'object');
    }
    if (T != null) {
      T.eq(type_of(0/0), 'unknown');
    }
    if (T != null) {
      T.eq(type_of(+2e308), 'unknown');
    }
    if (T != null) {
      T.eq(type_of(-2e308), 'unknown');
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.asyncfunction.name, 'isa_asyncfunction');
    }
    if (T != null) {
      T.eq(isa.optional.asyncfunction.name, 'isa_optional_asyncfunction');
    }
    if (T != null) {
      T.eq(validate.asyncfunction.name, 'validate_asyncfunction');
    }
    if (T != null) {
      T.eq(validate.optional.asyncfunction.name, 'validate_optional_asyncfunction');
    }
    //.........................................................................................................
    throws(T, /expected 1 arguments, got 2/, function() {
      return isa.float(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return isa.float();
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.methods_check_arity = function(T, done) {
    var INTERTYPE, isa, type_of, validate;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype(sample_declarations));
    //.........................................................................................................
    throws(T, /expected 1 arguments, got 2/, function() {
      return isa.float(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return isa.float();
    });
    throws(T, /expected 1 arguments, got 2/, function() {
      return isa.optional.float(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return isa.optional.float();
    });
    throws(T, /expected 1 arguments, got 2/, function() {
      return validate.float(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return validate.float();
    });
    throws(T, /expected 1 arguments, got 2/, function() {
      return validate.optional.float(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return validate.optional.float();
    });
    throws(T, /expected 1 arguments, got 2/, function() {
      return type_of(3, 4);
    });
    throws(T, /expected 1 arguments, got 0/, function() {
      return type_of();
    });
    try_and_show(T, function() {
      return isa.float(3, 4);
    });
    try_and_show(T, function() {
      return isa.float();
    });
    try_and_show(T, function() {
      return isa.optional.float(3, 4);
    });
    try_and_show(T, function() {
      return isa.optional.float();
    });
    try_and_show(T, function() {
      return validate.float(3, 4);
    });
    try_and_show(T, function() {
      return validate.float();
    });
    try_and_show(T, function() {
      return validate.optional.float(3, 4);
    });
    try_and_show(T, function() {
      return validate.optional.float();
    });
    try_and_show(T, function() {
      return type_of(3, 4);
    });
    try_and_show(T, function() {
      return type_of();
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_on_missing_type = function(T, done) {
    var INTERTYPE, isa, type_of, validate;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype(sample_declarations));
    //.........................................................................................................
    try_and_show(T, function() {
      return isa.quux;
    });
    try_and_show(T, function() {
      return isa.quux();
    });
    try_and_show(T, function() {
      return isa.quux(3);
    });
    try_and_show(T, function() {
      return isa.quux(3, 4);
    });
    try_and_show(T, function() {
      return isa.optional.quux;
    });
    try_and_show(T, function() {
      return isa.optional.quux();
    });
    try_and_show(T, function() {
      return isa.optional.quux(3);
    });
    try_and_show(T, function() {
      return isa.optional.quux(3, 4);
    });
    try_and_show(T, function() {
      return validate.quux;
    });
    try_and_show(T, function() {
      return validate.quux();
    });
    try_and_show(T, function() {
      return validate.quux(3);
    });
    try_and_show(T, function() {
      return validate.quux(3, 4);
    });
    try_and_show(T, function() {
      return validate.optional.quux;
    });
    try_and_show(T, function() {
      return validate.optional.quux();
    });
    try_and_show(T, function() {
      return validate.optional.quux(3);
    });
    try_and_show(T, function() {
      return validate.optional.quux(3, 4);
    });
    //.........................................................................................................
    throws(T, /unknown type 'quux'/, function() {
      return isa.quux;
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.quux();
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.quux(3);
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.quux(3, 4);
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.optional.quux;
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.optional.quux();
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.optional.quux(3);
    });
    throws(T, /unknown type 'quux'/, function() {
      return isa.optional.quux(3, 4);
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.quux;
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.quux();
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.quux(3);
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.quux(3, 4);
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.optional.quux;
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.optional.quux();
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.optional.quux(3);
    });
    throws(T, /unknown type 'quux'/, function() {
      return validate.optional.quux(3, 4);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_optional_is_declared = function(T, done) {
    var INTERTYPE, declarations;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    declarations = {...sample_declarations};
    declarations.optional = function(x) {
      return true;
    };
    //.........................................................................................................
    try_and_show(T, function() {
      return new INTERTYPE.Intertype(declarations);
    });
    throws(T, /unable to re-declare type 'optional'/, function() {
      return new INTERTYPE.Intertype(declarations);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_wrong_type_of_isa_test_declared = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    try_and_show(T, function() {
      return new Intertype({
        foo: (function() {})
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: true
      });
    });
    throws(T, /expected function with 1 parameters, got one with 0/, function() {
      return new Intertype({
        foo: (function() {})
      });
    });
    throws(T, /expected function with 1 parameters, got one with 2/, function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    });
    throws(T, /expected function or object, got a boolean/, function() {
      return new Intertype({
        foo: true
      });
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allow_declaration_objects = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      types = new Intertype(declarations);
      if (T != null) {
        T.eq(TMP_types.isa.function(types.isa.integer), true);
      }
      if (T != null) {
        T.eq(types.isa.integer.length, 1);
      }
      if (T != null) {
        T.eq(types.isa.integer(123), true);
      }
      if (T != null) {
        T.eq(types.isa.integer(123.456), false);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_create_types_with_templates = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      declarations.text = {
        template: '',
        test: (function(x) {
          return (typeof x) === 'string';
        })
      };
      types = new Intertype(declarations);
      //.......................................................................................................
      try_and_show(T, function() {
        return types.create.boolean();
      });
      throws(T, /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/, function() {
        return types.create.boolean();
      });
      try_and_show(T, function() {
        return types.create.text('foo');
      });
      throws(T, /expected 0 arguments, got 1/, function() {
        return types.create.text('foo');
      });
      //.......................................................................................................
      if (T != null) {
        T.eq(types.create.text(), '');
      }
      if (T != null) {
        T.eq(types.create.integer(), 0);
      }
      //.......................................................................................................
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // @basic_functionality_using_types_object()
      this.allow_declaration_objects();
      return (await test(this));
    })();
  }

  // do =>
//   INTERTYPE     = require '../../../apps/intertype'
//   types         = new INTERTYPE.Intertype sample_declarations
//   debug '^345^', types.type_of 1
//   debug '^345^', types.type_of Infinity
//   debug '^345^', types.isa.unknown 1
//   debug '^345^', types.isa.unknown Infinity

}).call(this);

//# sourceMappingURL=test-basics.js.map