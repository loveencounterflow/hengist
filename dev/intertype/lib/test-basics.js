(async function() {
  'use strict';
  var GUY, TMP_types, alert, debug, demo_1, echo, help, info, inspect, log, plain, praise, reverse, rpr, sample_declarations, test, throws, try_and_show, urge, warn, whisper;

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
        urge('^992-1^', "`throws()` result of call:", (await f()));
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
              warn('^992-2^', reverse(message = `error ${rpr(error.message)} doesn't match ${rpr(matcher)}`));
              if (T != null) {
                T.fail(`^992-3^ ${message}`);
              }
            }
            break;
          default:
            warn(message = `^992-4^ expected a regex or a text, got a ${matcher_type}`);
            if (T != null) {
              T.fail(message);
            }
        }
      }
      // T?.ok error?
      // urge '^424243^', error?.message
      if (error == null) {
        warn('^992-5^', reverse(message = "`throws()`: expected an error but none was thrown"));
        return T != null ? T.fail("^992-6^ `throws()`: expected an error but none was thrown") : void 0;
      }
    })();
    return null;
  };

  //===========================================================================================================
  try_and_show = async function(T, f) {
    var error, message;
    error = null;
    try {
      urge('^992-7^', "`try_and_show():` result of call:", (await f()));
    } catch (error1) {
      error = error1;
      help('^992-8^', reverse(`\`try_and_show()\`: ${rpr(error.message)}`));
    }
    if (error == null) {
      warn('^992-9^', reverse(message = "`try_and_show()`: expected an error but none was thrown"));
      if (T != null) {
        T.fail("^992-10^ `try_and_show()`: expected an error but none was thrown");
      }
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
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.declarations), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.declarations.text), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, types;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype_minimal(sample_declarations);
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
    debug('^4324^', 'null           ', types.declarations.null);
    debug('^4324^', 'function       ', types.declarations.function);
    debug('^4324^', 'boolean        ', types.declarations.boolean);
    debug('^4324^', 'text           ', types.declarations.text);
    debug('^4324^', 'asyncfunction  ', types.declarations.asyncfunction);
    debug('^4324^');
    debug('^4324^', 'null           ', types.isa.null);
    debug('^4324^', 'function       ', types.isa.function);
    debug('^4324^', 'boolean        ', types.isa.boolean);
    debug('^4324^', 'text           ', types.isa.text);
    debug('^4324^', 'asyncfunction  ', types.isa.asyncfunction);
    debug('^4324^');
    debug('^4324^', 'null           ', types.isa.optional.null);
    debug('^4324^', 'function       ', types.isa.optional.function);
    debug('^4324^', 'boolean        ', types.isa.optional.boolean);
    debug('^4324^', 'text           ', types.isa.optional.text);
    debug('^4324^', 'asyncfunction  ', types.isa.optional.asyncfunction);
    debug('^4324^');
    debug('^4324^', 'null           ', types.validate.null);
    debug('^4324^', 'function       ', types.validate.function);
    debug('^4324^', 'boolean        ', types.validate.boolean);
    debug('^4324^', 'text           ', types.validate.text);
    debug('^4324^', 'asyncfunction  ', types.validate.asyncfunction);
    if (T != null) {
      T.eq(types.isa.asyncfunction.name, 'isa.asyncfunction');
    }
    if (T != null) {
      T.eq(types.isa.optional.asyncfunction.name, 'isa.optional.asyncfunction');
    }
    if (T != null) {
      T.eq(types.validate.asyncfunction.name, 'validate.asyncfunction');
    }
    if (T != null) {
      T.eq(types.validate.optional.asyncfunction.name, 'validate.optional.asyncfunction');
    }
    if (T != null) {
      T.eq((ref = types.declarations.null) != null ? ref.type : void 0, 'null');
    }
    if (T != null) {
      T.eq((ref1 = types.declarations.function) != null ? ref1.type : void 0, 'function');
    }
    if (T != null) {
      T.eq((ref2 = types.declarations.boolean) != null ? ref2.type : void 0, 'boolean');
    }
    if (T != null) {
      T.eq((ref3 = types.declarations.text) != null ? ref3.type : void 0, 'text');
    }
    if (T != null) {
      T.eq((ref4 = types.declarations.asyncfunction) != null ? ref4.type : void 0, 'asyncfunction');
    }
    if (T != null) {
      T.eq((ref5 = types.isa.null) != null ? ref5.name : void 0, 'isa.null');
    }
    if (T != null) {
      T.eq((ref6 = types.isa.function) != null ? ref6.name : void 0, 'isa.function');
    }
    if (T != null) {
      T.eq((ref7 = types.isa.boolean) != null ? ref7.name : void 0, 'isa.boolean');
    }
    if (T != null) {
      T.eq((ref8 = types.isa.text) != null ? ref8.name : void 0, 'isa.text');
    }
    if (T != null) {
      T.eq((ref9 = types.isa.asyncfunction) != null ? ref9.name : void 0, 'isa.asyncfunction');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_standalone_methods = function(T, done) {
    var INTERTYPE, isa, type_of, validate;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
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
      T.eq(isa.asyncfunction.name, 'isa.asyncfunction');
    }
    if (T != null) {
      T.eq(isa.optional.asyncfunction.name, 'isa.optional.asyncfunction');
    }
    if (T != null) {
      T.eq(validate.asyncfunction.name, 'validate.asyncfunction');
    }
    if (T != null) {
      T.eq(validate.optional.asyncfunction.name, 'validate.optional.asyncfunction');
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
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
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
    ({isa, validate, type_of} = new INTERTYPE.Intertype());
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
      return new INTERTYPE.Intertype_minimal(declarations);
    });
    throws(T, /not allowed to re-declare base type 'optional'/, function() {
      return new INTERTYPE.Intertype_minimal(declarations);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_wrong_type_of_isa_test_declared = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    debug('^509-1^');
    try_and_show(T, function() {
      return new Intertype({
        foo: (function() {})
      });
    });
    debug('^509-2^');
    try_and_show(T, function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    });
    debug('^509-3^');
    try_and_show(T, function() {
      return new Intertype({
        foo: true
      });
    });
    debug('^509-4^');
    try_and_show(T, function() {
      return new Intertype({
        foo: null
      });
    });
    debug('^509-5^');
    try_and_show(T, function() {
      return new Intertype({
        foo: {}
      });
    });
    debug('^509-6^');
    try_and_show(T, function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    });
    debug('^509-7^');
    try_and_show(T, function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    });
    debug('^509-8^');
    try_and_show(T, function() {
      return new Intertype({
        foo: 'quux'
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
    throws(T, /expected type name, test method, or object, got a boolean/, function() {
      return new Intertype({
        foo: true
      });
    });
    throws(T, /expected type name, test method, or object, got a null/, function() {
      return new Intertype({
        foo: null
      });
    });
    throws(T, /expected a function for `test` entry of type 'foo', got a undefined/, function() {
      return new Intertype({
        foo: {}
      });
    });
    throws(T, /expected a function for `test` entry of type 'foo', got a null/, function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    });
    throws(T, /expected function with 1 parameters, got one with 2/, function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    });
    throws(T, /unknown type 'quux'/, function() {
      return new Intertype({
        foo: 'quux'
      });
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allow_declaration_objects = function(T, done) {
    var Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      types = new Intertype_minimal(declarations);
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
  this.create_entries_must_be_sync_functions = function(T, done) {
    var Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: async function() {
          return (await 0);
        }
      };
      try_and_show(T, function() {
        return new Intertype_minimal(declarations);
      });
      throws(T, /expected a function for `create` entry of type 'integer', got a asyncfunction/, function() {
        return new Intertype_minimal(declarations);
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.template_methods_must_be_nullary = function(T, done) {
    var Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations;
      declarations = {...sample_declarations};
      declarations.foolist = {
        test: function(x) {
          return true;
        },
        template: function(n) {
          return [n];
        }
      };
      try_and_show(T, function() {
        return new Intertype_minimal(declarations);
      });
      throws(T, /template method for type 'foolist' has arity 1 but must be nullary/, function() {
        return new Intertype_minimal(declarations);
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_knows_its_base_types = function(T, done) {
    var isa;
    // T?.halt_on_error()
    ({isa} = require('../../../apps/intertype'));
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.basetype('optional'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('anything'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('nothing'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('something'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('null'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('undefined'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('unknown'), true);
    }
    if (T != null) {
      T.eq(isa.basetype('integer'), false);
    }
    if (T != null) {
      T.eq(isa.basetype('float'), false);
    }
    if (T != null) {
      T.eq(isa.basetype('basetype'), false);
    }
    if (T != null) {
      T.eq(isa.basetype('quux'), false);
    }
    if (T != null) {
      T.eq(isa.basetype(null), false);
    }
    if (T != null) {
      T.eq(isa.basetype(void 0), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allows_licensed_overrides = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var overrides, types;
      types = new Intertype();
      if (T != null) {
        T.eq(types.isa.float(4), true);
      }
      //.......................................................................................................
      overrides = {
        float: {
          test: function(x) {
            return x === 'float';
          }
        }
      };
      try_and_show(T, function() {
        return types.declare(overrides);
      });
      throws(T, /not allowed to re-declare type 'float'/, function() {
        return types.declare(overrides);
      });
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      if (T != null) {
        T.eq(types.isa.float(4), true);
      }
      if (T != null) {
        T.eq(types.isa.float('float'), false);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types;
      types = new Intertype();
      if (T != null) {
        T.eq(types.isa.float(4), true);
      }
      //.......................................................................................................
      overrides = {
        float: {
          override: true,
          test: function(x) {
            return x === 'float';
          }
        }
      };
      throws(T, /not allowed to re-declare type 'float'/, function() {
        return types.declare(overrides);
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types;
      types = new Intertype();
      if (T != null) {
        T.eq(types.isa.float(4), true);
      }
      //.......................................................................................................
      overrides = {
        anything: {
          override: true,
          test: function(x) {
            return true;
          }
        }
      };
      try_and_show(T, function() {
        return types.declare(overrides);
      });
      throws(T, /not allowed to re-declare base type 'anything'/, function() {
        return types.declare(overrides);
      });
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      if (T != null) {
        T.eq(types.isa.anything(4), true);
      }
      if (T != null) {
        T.eq(types.isa.anything('float'), true);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_create_types_with_templates_and_create = function(T, done) {
    var Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
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
      declarations.float = {
        test: function(x) {
          return Number.isFinite(x);
        },
        create: function(p = null) {
          return parseFloat(p != null ? p : this.declarations.float.template);
        },
        template: 0
      };
      declarations.nan = function(x) {
        return Number.isNaN(x);
      };
      //.......................................................................................................
      types = new Intertype_minimal(declarations);
      if (T != null) {
        T.eq(TMP_types.isa.object(types.declarations), true);
      }
      if (T != null) {
        T.eq(TMP_types.isa.object(types.declarations.float), true);
      }
      if (T != null) {
        T.eq(TMP_types.isa.object(types.declarations.text), true);
      }
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
      if (T != null) {
        T.eq(types.create.float(), 0);
      }
      if (T != null) {
        T.eq(types.create.float('123.45'), 123.45);
      }
      try_and_show(T, function() {
        return types.create.float('***');
      });
      throws(T, /expected `create\.float\(\)` to return a float but it returned a nan/, function() {
        return types.create.float('***');
      });
      //.......................................................................................................
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_minimal_has_only_base_types = function(T, done) {
    var Intertype_minimal, types;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    types = new Intertype_minimal();
    if (T != null) {
      T.eq((Object.keys(types.declarations)).sort(), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown']);
    }
    types.declare({
      z: (function(x) {})
    });
    if (T != null) {
      T.eq((Object.keys(types.declarations)).sort(), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_type_name_for_test = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: 'quux', }
      throws(T, /unknown type 'quux'/, function() {
        return types.declare({
          z: 'quux'
        });
      });
      types.declare({
        z: 'float'
      });
      if (T != null) {
        T.eq(types.isa.z(12), true);
      }
      if (T != null) {
        T.eq(types.isa.float.name, 'isa.float');
      }
      if (T != null) {
        T.eq(types.declarations.float.type, 'float');
      }
      if (T != null) {
        T.eq(types.declarations.float.test.name, 'float');
      }
      if (T != null) {
        T.eq(types.isa.z.name, 'isa.z');
      }
      if (T != null) {
        T.eq(types.declarations.z.type, 'z');
      }
      return T != null ? T.eq(types.declarations.z.test.name, 'z') : void 0; // ?
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: { test: 'quux', }, }
      throws(T, /unknown type 'quux'/, function() {
        return types.declare({
          z: {
            test: 'quux'
          }
        });
      });
      types.declare({
        z: {
          test: 'float'
        }
      });
      if (T != null) {
        T.eq(types.isa.z(12), true);
      }
      if (T != null) {
        T.eq(types.isa.float.name, 'isa.float');
      }
      if (T != null) {
        T.eq(types.declarations.float.type, 'float');
      }
      if (T != null) {
        T.eq(types.declarations.float.test.name, 'float');
      }
      if (T != null) {
        T.eq(types.isa.z.name, 'isa.z');
      }
      if (T != null) {
        T.eq(types.declarations.z.type, 'z');
      }
      return T != null ? T.eq(types.declarations.z.test.name, 'z') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_dotted_type = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo'), false);
      }
      types.declare({
        foo: 'object'
      });
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo'), true);
      }
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo.bar'), false);
      }
      types.declare({
        'foo.bar': 'object'
      });
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo.bar'), true);
      }
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo.bar.baz'), false);
      }
      types.declare({
        'foo.bar.baz': 'float'
      });
      if (T != null) {
        T.eq(Reflect.has(types.declarations, 'foo.bar.baz'), true);
      }
      if (T != null) {
        T.eq(types.declarations['foo.bar.baz'].test, types.declarations.float.test);
      }
      // types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
      try_and_show(T, function() {
        return types.declare({
          'foo.bar.baz.quux.dax.dux': 'float'
        });
      });
      debug('^3234^', types.isa.foo);
      debug('^3234^', types.isa['foo.bar']);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dotted_types_are_test_methods = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        quantity: 'object'
      });
      types.declare({
        'quantity.q': 'float'
      });
      types.declare({
        'quantity.u': 'text'
      });
      if (T != null) {
        T.eq(types.isa['quantity.q'], types.declarations['quantity'].sub_tests['q']);
      }
      if (T != null) {
        T.eq(types.isa['quantity.q'], types.isa.quantity.q);
      }
      // debug '^409-1^', types.declarations
      if (T != null) {
        T.eq(types.isa.quantity({}), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: {}
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: 3
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: 3,
          u: 'm'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.q(3), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.q(3.1), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.q('3.1'), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity.u('m'), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.u(null), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity.u(3), false);
      }
      debug('^433-1^', types.declarations['quantity']);
      debug('^433-1^', types.declarations['quantity.q']);
      debug('^433-1^', types.declarations['quantity.u']);
      return null;
    })();
    (() => {      //.........................................................................................................
      var f, k, types;
      types = new Intertype();
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.name': 'text'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      // T?.eq types.isa[ 'quantity.q' ], types.declarations[ 'quantity' ].sub_tests[ 'q' ]
      // T?.eq types.isa[ 'quantity.q' ], types.isa.quantity.q
      if (T != null) {
        T.eq(types.isa.person.address.city.name('P'), true);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city.name(1234), false);
      }
      if (T != null) {
        T.eq(types.isa.person(1234), false);
      }
      if (T != null) {
        T.eq(types.isa.person({
          name: 'Bob'
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.person({
          name: 'Bob',
          address: {}
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.person({
          name: 'Bob',
          address: {
            city: {}
          }
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P'
            }
          }
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P',
              postcode: 'SO36'
            }
          }
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city.name('P'), true);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city.postcode('SO36'), true);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.person.address({
          city: {
            name: 'P',
            postcode: 'SO36'
          }
        }), true);
      }
      help('^322-1^', (function() {
        var ref, results;
        ref = types.declarations['person'].sub_tests;
        results = [];
        for (k in ref) {
          f = ref[k];
          results.push({
            [`${k}`]: f.name
          });
        }
        return results;
      })());
      help('^322-2^', (function() {
        var ref, results;
        ref = types.declarations['person.address'].sub_tests;
        results = [];
        for (k in ref) {
          f = ref[k];
          results.push({
            [`${k}`]: f.name
          });
        }
        return results;
      })());
      help('^322-3^', (function() {
        var ref, results;
        ref = types.declarations['person.address.city'].sub_tests;
        results = [];
        for (k in ref) {
          f = ref[k];
          results.push({
            [`${k}`]: f.name
          });
        }
        return results;
      })());
      if (T != null) {
        T.eq(Object.keys(types.declarations['person'].sub_tests), ['name', 'address']);
      }
      if (T != null) {
        T.eq(Object.keys(types.declarations['person.address'].sub_tests), ['city']);
      }
      if (T != null) {
        T.eq(Object.keys(types.declarations['person.address.city'].sub_tests), ['name', 'postcode']);
      }
      if (T != null) {
        T.eq(types.declarations['person'].sub_tests !== types.declarations['person.address'].sub_tests, true);
      }
      if (T != null) {
        T.eq(types.declarations['person'].sub_tests !== types.declarations['person.address.city'].sub_tests, true);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'foo': 'float'
      });
      types.declare({
        'foo.bar': 'text'
      });
      (() => {
        var d;
        d = 3;
        // d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
        if (T != null) {
          T.eq(types.isa.foo(d), false);
        }
        return null;
      })();
      (() => {
        var d;
        d = new Number(3);
        d.bar = '?';
        if (T != null) {
          T.eq(d.bar, '?');
        }
        // still won't work b/c `float` doesn't accept objects (which is a good thing):
        if (T != null) {
          T.eq(types.isa.foo(d), false);
        }
        return null;
      })();
      return null;
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'foo': 'object'
      });
      types.declare({
        'foo.bind': 'float'
      });
      types.declare({
        'foo.apply': 'float'
      });
      types.declare({
        'foo.call': 'float'
      });
      types.declare({
        'foo.name': 'float'
      });
      types.declare({
        'foo.length': 'float'
      });
      if (T != null) {
        T.eq(types.isa.foo({}), false);
      }
      if (T != null) {
        T.eq(types.isa.foo({
          bind: 1,
          apply: 2,
          call: 3,
          name: 4,
          length: 5
        }), true);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'foo': 'object'
      });
      types.declare({
        'foo.text': (function(x) {
          return x === 1;
        })
      });
      types.declare({
        'foo.float': (function(x) {
          return x === 2;
        })
      });
      if (T != null) {
        T.eq(types.isa.foo({}), false);
      }
      if (T != null) {
        T.eq(types.isa.foo({
          text: 1,
          float: 2
        }), true);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_refs_to_dotted_types = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.name': 'text'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      types.declare({
        'mycity': (function(x) {
          return this.isa.person.address.city(x);
        })
      });
      // debug '^434-1^', types.declarations[ 'person.address.city' ]
      // debug '^434-2^', types.declarations.mycity
      urge('^342-1^', types.declarations.mycity);
      if (T != null) {
        T.eq(types.isa.person.address.city({}), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city(null), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.mycity({}), false);
      }
      if (T != null) {
        T.eq(types.isa.mycity(null), false);
      }
      if (T != null) {
        T.eq(types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.name': 'text'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      types.declare({
        'mycity': 'person.address.city'
      });
      // debug '^434-3^', types.declarations[ 'person.address.city' ]
      // debug '^434-4^', types.declarations.mycity
      urge('^342-2^', types.declarations.mycity);
      if (T != null) {
        T.eq(types.isa.person.address.city({}), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city(null), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.mycity({}), false);
      }
      if (T != null) {
        T.eq(types.isa.mycity(null), false);
      }
      if (T != null) {
        T.eq(types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.name': 'text'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      types.declare({
        'mycity': (function(x) {
          return this.isa.optional.person.address.city(x);
        })
      });
      // debug '^434-5^', types.declarations[ 'person.address.city' ]
      // debug '^434-6^', types.declarations.mycity
      urge('^342-3^', types.declarations.mycity);
      if (T != null) {
        T.eq(types.isa.person.address.city({}), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city(null), false);
      }
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.optional.person.address.city({}), false);
      }
      if (T != null) {
        T.eq(types.isa.optional.person.address.city(null), true);
      }
      if (T != null) {
        T.eq(types.isa.optional.person.address.city({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa.mycity({}), false);
      }
      if (T != null) {
        T.eq(types.isa.mycity(null), true);
      }
      if (T != null) {
        T.eq(types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        }), true);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.internal_type_of_method = function(T, done) {
    var Intertype, declarations;
    // T?.halt_on_error()
    ({Intertype, declarations} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      if (T != null) {
        T.eq(types.__type_of(declarations, null), 'null');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, void 0), 'undefined');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, 4), 'float');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, function() {}), 'function');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, async function() {
          return (await null);
        }), 'asyncfunction');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, {}), 'object');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, []), 'list');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, +2e308), 'infinity');
      }
      if (T != null) {
        T.eq(types.__type_of(declarations, -2e308), 'infinity');
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.validate_dotted_types = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, validate;
      types = new Intertype();
      ({validate} = types);
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.name': 'text'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      //.......................................................................................................
      try_and_show(T, function() {
        return validate.person(null);
      });
      try_and_show(T, function() {
        return validate.person.address(null);
      });
      try_and_show(T, function() {
        return validate.person.address.city(null);
      });
      try_and_show(T, function() {
        return validate.person.address.city.postcode(null);
      });
      //.......................................................................................................
      debug('^334-1^', types.isa.person.address.city.postcode(3));
      if (T != null) {
        T.eq(types.isa.person.address.city.postcode(3), false);
      }
      try_and_show(T, function() {
        return validate.person.address.city.postcode(3);
      });
      throws(T, /expected a person.address.city.postcode/, function() {
        return validate.person.address.city.postcode(3);
      });
      //.......................................................................................................
      debug('^334-2^', types.isa.person.address.city({
        name: 'P'
      }));
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P'
        }), false);
      }
      debug('^334-4^', validate.person.address.city({
        name: 'P'
      }));
      debug('^334-4^', validate.person.address.city({
        name: 'P'
      }));
      debug('^334-4^', validate.person.address.city({
        name: 'P'
      }));
      try_and_show(T, function() {
        return validate.person.address.city({
          name: 'P' // ??????????????????????????????????
        });
      });
      throws(T, /expected a person.address.city/, function() {
        return validate.person.address.city({
          name: 'P'
        });
      });
      //.......................................................................................................
      debug('^334-3^', types.isa.person.address.city({
        name: 'P',
        postcode: '3421'
      }));
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P',
          postcode: '3421'
        }), true);
      }
      if (T != null) {
        T.eq(validate.person.address.city({
          name: 'P',
          postcode: '3421'
        }), {
          name: 'P',
          postcode: '3421'
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_namespaces = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations;
      declarations = {
        'foo.bar': function(x) {
          return x === 'foo.bar';
        },
        'foo.bar.baz': function(x) {
          return x === 'foo.bar.baz';
        }
      };
      try_and_show(T, function() {
        var types;
        return types = new Intertype(declarations);
      });
      throws(T, /unknown partial type 'foo'/, function() {
        var types;
        return types = new Intertype(declarations);
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, types;
      declarations = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text'
      };
      types = new Intertype(declarations);
      if (T != null) {
        T.eq(types.isa.quantity({}), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: 12,
          u: 'kg'
        }), true);
      }
      if (T != null) {
        T.eq(types.isa['quantity.q'](12), true);
      }
      if (T != null) {
        T.eq(types.isa['quantity.u']('kg'), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.q(12), true);
      }
      if (T != null) {
        T.eq(types.isa.quantity.u('kg'), true);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._________________can_use_fields = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype({
        quantity: {
          fields: {
            q: ''
          }
        }
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Intertype_minimal, declarations, types;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    //.........................................................................................................
    declarations = {
      integer: {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: function(p = null) {
          return parseInt(p != null ? p : this.declarations.integer.template, 10);
        },
        template: 0
      },
      text: {
        template: '',
        test: (function(x) {
          return (typeof x) === 'string';
        })
      },
      float: {
        test: function(x) {
          return Number.isFinite(x);
        },
        create: function(p = null) {
          return parseFloat(p != null ? p : this.declarations.float.template);
        },
        template: 0
      }
    };
    //.........................................................................................................
    declarations = {...sample_declarations, ...declarations};
    types = new Intertype_minimal(declarations);
    //.........................................................................................................
    debug('^233-1^', types.create.float('345.678'));
    debug('^233-1^', types.create.integer('345.678'));
    try_and_show(null, function() {
      return types.create.float('***');
    });
    try_and_show(null, function() {
      return types.create.integer('***');
    });
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // @basic_functionality_using_types_object()
      // test @basic_functionality_using_types_object
      // @allow_declaration_objects()
      // demo_1()
      // @can_use_type_name_for_test()
      // test @can_use_type_name_for_test
      // await test @create_entries_must_be_sync_functions
      // await test @template_methods_must_be_nullary
      // @throw_instructive_error_on_missing_type()
      // @allows_licensed_overrides()
      // await test @allows_licensed_overrides
      // @throw_instructive_error_when_wrong_type_of_isa_test_declared()
      // await test @throw_instructive_error_when_wrong_type_of_isa_test_declared
      // @resolve_dotted_type()
      // test @resolve_dotted_type
      // @dotted_types_are_test_methods()
      // test @dotted_types_are_test_methods
      // @can_use_refs_to_dotted_types()
      // test @can_use_refs_to_dotted_types
      // test @can_use_type_name_for_test
      // @internal_type_of_method()
      // test @internal_type_of_method
      // @validate_dotted_types()
      // test @validate_dotted_types
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map