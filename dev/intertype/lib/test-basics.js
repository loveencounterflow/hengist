(async function() {
  'use strict';
  var GUY, TMP_types, _equals, _match_error, _set_contains, alert, debug, demo_1, echo, eq, eq2, equals, help, info, inspect, log, plain, praise, reverse, rpr, safeguard, sample_declarations, test, test_mode, test_set_equality_by_value, throws, throws2, try_and_show, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype/test-basics'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  test = require('../../../apps/guy-test');

  TMP_types = new (require('intertype')).Intertype();

  _equals = require('../../../apps/guy-test/node_modules/intertype/deps/jkroso-equals');

  // equals                    = require '/home/flow/jzr/intertype-legacy/deps/jkroso-equals.js'
  // equals                    = require '/home/flow/jzr/hengist/dev/intertype-2024-04-15/src/basics.test.coffee'
  // equals                    = require ( require 'util' ).isDeepStrictEqual
  test_mode = 'throw_failures';

  test_mode = 'throw_errors';

  test_mode = 'failsafe';

  //===========================================================================================================
  // IMPLEMENT SET EQUALITY
  //-----------------------------------------------------------------------------------------------------------
  _set_contains = function(set, value) {
    var element;
    for (element of set) {
      if (equals(element, value)) {
        return true;
      }
    }
    return false;
  };

  //-----------------------------------------------------------------------------------------------------------
  equals = function(a, b) {
    var element;
    switch (true) {
      case TMP_types.isa.set(a):
        if (!TMP_types.isa.set(b)) {
          return false;
        }
        if (a.size !== b.size) {
          return false;
        }
        for (element of a) {
          if (!_set_contains(b, element)) {
            return false;
          }
        }
        return true;
    }
    return _equals(a, b);
  };

  //-----------------------------------------------------------------------------------------------------------
  test_set_equality_by_value = function() {
    var matcher1, matcher2, result;
    echo();
    result = [1, [2]];
    matcher1 = [1, [2]];
    matcher2 = [1, [3]];
    debug('^810-1^', equals(result, matcher1));
    debug('^810-2^', equals(result, matcher2));
    echo();
    result = new Set([1, 2]);
    matcher1 = new Set([1, 2]);
    matcher2 = new Set([1, 3]);
    debug('^810-3^', equals(result, matcher1));
    debug('^810-4^', equals(result, matcher2));
    echo();
    result = new Set([1, [2]]);
    matcher1 = new Set([1, [2]]);
    matcher2 = new Set([1, [3]]);
    debug('^810-5^', equals(result, matcher1));
    return debug('^810-6^', equals(result, matcher2));
  };

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
  /*

  Method to replace `T.throws()` and `try_and_show()`; takes 2, 3, or 4 arguments; with 4 arguments, second
  argument should be error class

  */
  throws = function(T, matcher, f) {
    var arity, error, is_matching, matcher_type, message;
    switch (arity = arguments.length) {
      case 2:
        [T, matcher, f] = [T, null, matcher];
        break;
      case 3:
        null;
        break;
      default:
        throw new Error(`\`throws()\` needs 2 or 3 arguments, got ${arity}`);
    }
    //.........................................................................................................
    error = null;
    is_matching = null;
    try {
      //.........................................................................................................
      urge('^992-1^', "`throws()` result of call:", f());
    } catch (error1) {
      error = error1;
      //.......................................................................................................
      if (matcher != null) {
        is_matching = false;
        switch (matcher_type = TMP_types.type_of(matcher)) {
          case 'text':
            is_matching = error.message === matcher;
            break;
          case 'regex':
            matcher.lastIndex = 0;
            is_matching = matcher.test(error.message);
            break;
          default:
            throw new Error(`^992-2^ expected a regex or a text, got a ${matcher_type}`);
        }
        if (is_matching) {
          help('^992-3^', "OK           ", reverse(error.message));
        } else {
          urge('^992-4^', "error        ", reverse(error.message));
          warn('^992-5^', "doesn't match", reverse(rpr(matcher)));
          if (T != null) {
            T.fail(`^992-6^ error ${rpr(error.message)} doesn't match ${rpr(matcher)}`);
          }
        }
      } else {
        //.......................................................................................................
        help('^992-7^', "error        ", reverse(error.message));
      }
    }
    //.........................................................................................................
    if (error == null) {
      warn('^992-8^', reverse(message = "`throws()`: expected an error but none was thrown"));
      if (T != null) {
        T.fail("^992-9^ `throws()`: expected an error but none was thrown");
      }
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  _match_error = function(error, matcher) {
    var matcher_type;
    switch (matcher_type = TMP_types.type_of(matcher)) {
      case 'text':
        return error.message === matcher;
      case 'regex':
        matcher.lastIndex = 0;
        return matcher.test(error.message);
    }
    return matcher_type;
  };

  //-----------------------------------------------------------------------------------------------------------
  throws2 = function(T, f, matcher) {
    var error, matcher_type, message, ref;
    if ((ref = f.name) === '') {
      throw new Error(`^992-1^ test method should be named, got ${rpr(f)}`);
    }
    error = null;
    try {
      //.........................................................................................................
      urge(`^${ref}^ \`throws()\` result of call:`, f());
    } catch (error1) {
      error = error1;
      if (matcher == null) {
        help(`^${ref} ◀ throw2@1^ error        `, reverse(error.message));
        if (T != null) {
          T.ok(true);
        }
        return null;
      }
      //.......................................................................................................
      switch (matcher_type = _match_error(error, matcher)) {
        case true:
          help(`^${ref} ◀ throw2@2^ OK           `, reverse(error.message));
          if (T != null) {
            T.ok(true);
          }
          break;
        case false:
          urge(`^${ref} ◀ throw2@3^ error        `, reverse(error.message));
          warn(`^${ref} ◀ throw2@4^ doesn't match`, reverse(rpr(matcher)));
          if (T != null) {
            T.fail(`^${ref} ◀ throw2@5^ error ${rpr(error.message)} doesn't match ${rpr(matcher)}`);
          }
          break;
        default:
          message = `expected a regex or a text, got a ${matcher_type}`;
          warn(`^${ref} ◀ throw2@6^`, reverse(message));
          if (T != null) {
            T.fail(`^${ref} ◀ throw2@7^ ${message}`);
          }
      }
    }
    //.........................................................................................................
    if (error == null) {
      message = "`throws()`: expected an error but none was thrown";
      warn(`^${ref} ◀ throw2@8^`, reverse(message));
      if (T != null) {
        T.fail(`^${ref} ◀ throw2@9^ ${message}`);
      }
    }
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  eq = function(ref, T, result, matcher) {
    ref = ref.padEnd(15);
    if (equals(result, matcher)) {
      help(ref, "EQ OK");
      if (T != null) {
        T.ok(true);
      }
    } else {
      warn(ref, reverse(' neq '), "result:     ", reverse(' ' + (rpr(result)) + ' '));
      warn(ref, reverse(' neq '), "matcher:    ", reverse(' ' + (rpr(matcher)) + ' '));
      if (T != null) {
        T.ok(false);
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  eq2 = function(T, f, matcher) {
    var error, message, ref, result;
    if ((ref = f.name) === '') {
      throw new Error(`^992-1^ test method should be named, got ${rpr(f)}`);
    }
    try {
      (result = f());
    } catch (error1) {
      error = error1;
      message = `\`eq2()\`: ^${ref}^ expected a result but got an an error: ${error.message}`;
      warn('^992-12^', reverse(message));
      if (T != null) {
        T.fail(`^992-13^ ${message}`);
      }
      debug('^25235234^', {test_mode});
      if (test_mode === 'throw_errors') {
        throw new Error(message);
      }
    }
    return eq(ref, T, result, matcher);
  };

  //===========================================================================================================
  try_and_show = function(T, f) {
    var error, message;
    error = null;
    try {
      urge('^992-10^', "`try_and_show():` result of call:", f());
    } catch (error1) {
      error = error1;
      help('^992-11^', reverse(`\`try_and_show()\`: ${rpr(error.message)}`));
    }
    if (error == null) {
      warn('^992-12^', reverse(message = "`try_and_show()`: expected an error but none was thrown"));
      if (T != null) {
        T.fail("^992-13^ `try_and_show()`: expected an error but none was thrown");
      }
    }
    return null;
  };

  //===========================================================================================================
  safeguard = function(T, f) {
    var error, message;
    error = null;
    try {
      f();
    } catch (error1) {
      error = error1;
      // throw error unless T?
      warn('^992-14^', reverse(message = `\`safeguard()\`: ${rpr(error.message)}`));
      if (T != null) {
        T.fail(message);
      }
    }
    return null;
  };

  //###########################################################################################################

  //===========================================================================================================
  this.interface = function(T, done) {
    var INTERTYPE;
    INTERTYPE = require('../../../apps/intertype');
    eq('^intertype-t1^', T, TMP_types.isa.object(INTERTYPE.types), true);
    eq('^intertype-t2^', T, TMP_types.isa.undefined(INTERTYPE.types.get_isa), true);
    eq('^intertype-t3^', T, TMP_types.isa.undefined(INTERTYPE.types.get_isa_optional), true);
    eq('^intertype-t4^', T, TMP_types.isa.undefined(INTERTYPE.types.get_validate), true);
    eq('^intertype-t5^', T, TMP_types.isa.undefined(INTERTYPE.types.get_validate_optional), true);
    eq('^intertype-t6^', T, TMP_types.isa.function(INTERTYPE.types._get_isa), true);
    eq('^intertype-t7^', T, TMP_types.isa.function(INTERTYPE.types._get_isa_optional), true);
    eq('^intertype-t8^', T, TMP_types.isa.function(INTERTYPE.types._get_validate), true);
    eq('^intertype-t9^', T, TMP_types.isa.function(INTERTYPE.types._get_validate_optional), true);
    eq('^intertype-t10^', T, TMP_types.isa.object(INTERTYPE.types), true);
    eq('^intertype-t11^', T, TMP_types.isa.object(INTERTYPE.types.isa), true);
    // eq '^intertype-t12^', T, ( TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
    eq('^intertype-t13^', T, TMP_types.isa.object(INTERTYPE.types.validate), true);
    // eq '^intertype-t14^', T, ( TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
    eq('^intertype-t15^', T, TMP_types.isa.function(INTERTYPE.types.isa.boolean), true);
    eq('^intertype-t16^', T, TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean), true);
    eq('^intertype-t17^', T, TMP_types.isa.function(INTERTYPE.types.validate.boolean), true);
    eq('^intertype-t18^', T, TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean), true);
    eq('^intertype-t19^', T, TMP_types.isa.object(INTERTYPE.types.create), true);
    eq('^intertype-t20^', T, TMP_types.isa.function(INTERTYPE.types.isa.text), true);
    eq('^intertype-t21^', T, TMP_types.isa.function(INTERTYPE.types.create.text), true);
    eq('^intertype-t22^', T, TMP_types.isa.object(INTERTYPE.types.declarations), true);
    eq('^intertype-t23^', T, TMP_types.isa.object(INTERTYPE.types.declarations.text), true);
    //.........................................................................................................
    // eq '^intertype-t24^', T, ( INTERTYPE.types.isa.name           ), 'isa'
    // eq '^intertype-t24^', T, ( INTERTYPE.types.evaluate.name      ), 'evaluate'
    // eq '^intertype-t24^', T, ( INTERTYPE.types.validate.name      ), 'validate'
    // eq '^intertype-t24^', T, ( INTERTYPE.types.create.name        ), 'create'
    eq('^intertype-t24^', T, INTERTYPE.types.declare.name, 'declare');
    eq('^intertype-t25^', T, INTERTYPE.types.type_of.name, 'type_of');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, types;
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
      T.eq((ref1 = types.declarations.null) != null ? ref1.type : void 0, 'null');
    }
    if (T != null) {
      T.eq((ref2 = types.declarations.function) != null ? ref2.type : void 0, 'function');
    }
    if (T != null) {
      T.eq((ref3 = types.declarations.boolean) != null ? ref3.type : void 0, 'boolean');
    }
    if (T != null) {
      T.eq((ref4 = types.declarations.text) != null ? ref4.type : void 0, 'text');
    }
    if (T != null) {
      T.eq((ref5 = types.declarations.asyncfunction) != null ? ref5.type : void 0, 'asyncfunction');
    }
    if (T != null) {
      T.eq((ref6 = types.isa.null) != null ? ref6.name : void 0, 'isa.null');
    }
    if (T != null) {
      T.eq((ref7 = types.isa.function) != null ? ref7.name : void 0, 'isa.function');
    }
    if (T != null) {
      T.eq((ref8 = types.isa.boolean) != null ? ref8.name : void 0, 'isa.boolean');
    }
    if (T != null) {
      T.eq((ref9 = types.isa.text) != null ? ref9.name : void 0, 'isa.text');
    }
    if (T != null) {
      T.eq((ref10 = types.isa.asyncfunction) != null ? ref10.name : void 0, 'isa.asyncfunction');
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
    throws(T, /method 'isa.float' expects 1 arguments, got 2/, function() {
      return isa.float(3, 4);
    });
    throws(T, /method 'isa.float' expects 1 arguments, got 0/, function() {
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
    throws(T, /method 'isa.float' expects 1 arguments, got 2/, function() {
      return isa.float(3, 4);
    });
    throws(T, /method 'isa.float' expects 1 arguments, got 0/, function() {
      return isa.float();
    });
    throws(T, /method 'isa.optional.float' expects 1 arguments, got 2/, function() {
      return isa.optional.float(3, 4);
    });
    throws(T, /method 'isa.optional.float' expects 1 arguments, got 0/, function() {
      return isa.optional.float();
    });
    throws(T, /method 'validate.float' expects 1 arguments, got 2/, function() {
      return validate.float(3, 4);
    });
    throws(T, /method 'validate.float' expects 1 arguments, got 0/, function() {
      return validate.float();
    });
    throws(T, /method 'validate.optional.float' expects 1 arguments, got 2/, function() {
      return validate.optional.float(3, 4);
    });
    throws(T, /method 'validate.optional.float' expects 1 arguments, got 0/, function() {
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
  this.same_basic_types = function(T, done) {
    var $function, asyncfunction, asyncgenerator, asyncgeneratorfunction, boolean, generator, generatorfunction, isa, symbol, type_of, validate;
    // T?.halt_on_error()
    ({isa, validate, type_of} = require('../../../apps/intertype'));
    //.........................................................................................................
    boolean = false;
    $function = function() {};
    asyncfunction = async function() {
      return (await null);
    };
    generatorfunction = (function*() {
      return (yield null);
    });
    generator = (function*() {
      return (yield null);
    })();
    asyncgeneratorfunction = (async function*() {
      return (yield (await null));
    });
    asyncgenerator = (async function*() {
      return (yield (await null));
    })();
    symbol = Symbol('what');
    //.........................................................................................................
    eq('^intertype-t26^', T, isa.boolean(boolean), true);
    eq('^intertype-t27^', T, isa.function($function), true);
    eq('^intertype-t28^', T, isa.asyncfunction(asyncfunction), true);
    eq('^intertype-t29^', T, isa.generatorfunction(generatorfunction), true);
    eq('^intertype-t30^', T, isa.asyncgeneratorfunction(asyncgeneratorfunction), true);
    eq('^intertype-t31^', T, isa.asyncgenerator(asyncgenerator), true);
    eq('^intertype-t32^', T, isa.generator(generator), true);
    eq('^intertype-t33^', T, isa.symbol(symbol), true);
    //.........................................................................................................
    eq('^intertype-t34^', T, validate.boolean(boolean), boolean);
    eq('^intertype-t35^', T, validate.function($function), $function);
    eq('^intertype-t36^', T, validate.asyncfunction(asyncfunction), asyncfunction);
    eq('^intertype-t37^', T, validate.generatorfunction(generatorfunction), generatorfunction);
    eq('^intertype-t38^', T, validate.asyncgeneratorfunction(asyncgeneratorfunction), asyncgeneratorfunction);
    eq('^intertype-t39^', T, validate.asyncgenerator(asyncgenerator), asyncgenerator);
    eq('^intertype-t40^', T, validate.generator(generator), generator);
    eq('^intertype-t41^', T, validate.symbol(symbol), symbol);
    //.........................................................................................................
    eq('^intertype-t42^', T, type_of(boolean), 'boolean');
    eq('^intertype-t43^', T, type_of($function), 'function');
    eq('^intertype-t44^', T, type_of(asyncfunction), 'asyncfunction');
    eq('^intertype-t45^', T, type_of(generatorfunction), 'generatorfunction');
    eq('^intertype-t46^', T, type_of(asyncgeneratorfunction), 'asyncgeneratorfunction');
    eq('^intertype-t47^', T, type_of(asyncgenerator), 'asyncgenerator');
    eq('^intertype-t48^', T, type_of(generator), 'generator');
    eq('^intertype-t49^', T, type_of(symbol), 'symbol');
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
    var INTERTYPE;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    throws(T, /not allowed to re-declare type 'optional'/, function() {
      return new INTERTYPE.Intertype_minimal({
        optional: (function(x) {
          return true;
        })
      });
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
    try_and_show(T, function() {
      return new Intertype({
        foo: void 0
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: null
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: {}
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: {
          test: false
        }
      });
    });
    try_and_show(T, function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    });
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
    throws(T, /expected type name, method, or object to indicate test method, got a boolean/, function() {
      return new Intertype({
        foo: true
      });
    });
    throws(T, /expected type name, method, or object to indicate test method, got a undefined/, function() {
      return new Intertype({
        foo: void 0
      });
    });
    throws(T, /expected type name, method, or object to indicate test method, got a null/, function() {
      return new Intertype({
        foo: null
      });
    });
    throws(T, /expected type name, method, or object to indicate test method, got a undefined/, function() {
      return new Intertype({
        foo: {}
      });
    });
    throws(T, /expected type name, method, or object to indicate test method, got a null/, function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    });
    throws(T, /expected type name, method, or object to indicate test method, got a boolean/, function() {
      return new Intertype({
        foo: {
          test: false
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
      T.eq(isa.basetype('optional'), false);
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
      T.eq(isa.basetype('toString'), false);
    }
    if (T != null) {
      T.eq(isa.basetype(null), false);
    }
    if (T != null) {
      T.eq(isa.basetype(void 0), false);
    }
    if (T != null) {
      T.eq(isa.basetype(4), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_licensed_overrides = function(T, done) {
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
      throws(T, /not allowed to re-declare basetype 'anything'/, function() {
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
    var Intertype, Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype, Intertype_minimal} = require('../../../apps/intertype'));
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
      eq('^intertype-t50^', T, TMP_types.isa.object(types.declarations), true);
      eq('^intertype-t51^', T, TMP_types.isa.object(types.declarations.float), true);
      eq('^intertype-t52^', T, TMP_types.isa.object(types.declarations.text), true);
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
      eq('^intertype-t53^', T, types.create.text(), '');
      eq('^intertype-t54^', T, types.create.integer(), 0);
      eq('^intertype-t55^', T, types.create.float(), 0);
      eq('^intertype-t56^', T, types.create.float('123.45'), 123.45);
      try_and_show(T, function() {
        return types.create.float('***');
      });
      throws(T, /expected `create\.float\(\)` to return a float but it returned a nan/, function() {
        return types.create.float('***');
      });
      //.......................................................................................................
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate;
      declarations = {
        quantity: {
          test: 'object',
          template: {
            q: 0,
            u: 'u'
          }
        },
        'quantity.q': 'float',
        'quantity.u': 'text'
      };
      ({isa, validate, create} = new Intertype(declarations));
      eq('^intertype-t57^', T, create.quantity(), {
        q: 0,
        u: 'u'
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate;
      declarations = {
        quantity: {
          test: 'object',
          template: {
            q: 0,
            u: 'u'
          },
          fields: {
            q: 'float',
            u: 'text'
          }
        }
      };
      ({isa, validate, create} = new Intertype(declarations));
      eq('^intertype-t58^', T, create.quantity(), {
        q: 0,
        u: 'u'
      });
      eq('^intertype-t59^', T, create.quantity({
        q: 123
      }), {
        q: 123,
        u: 'u'
      });
      eq('^intertype-t60^', T, create.quantity({
        u: 'kg'
      }), {
        q: 0,
        u: 'kg'
      });
      eq('^intertype-t61^', T, create.quantity({
        u: 'kg',
        foo: 'bar'
      }), {
        q: 0,
        u: 'kg',
        foo: 'bar'
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.builtin_types_support_create = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, type_of, types;
      types = new Intertype();
      ({create, type_of} = types);
      eq('^intertype-t62^', T, create.float(), 0);
      eq('^intertype-t63^', T, create.boolean(), false);
      eq('^intertype-t64^', T, create.object(), {});
      eq('^intertype-t65^', T, create.float(), 0);
      eq('^intertype-t66^', T, create.infinity(), 2e308);
      eq('^intertype-t67^', T, create.text(), '');
      eq('^intertype-t68^', T, create.list(), []);
      eq('^intertype-t69^', T, create.regex(), new RegExp());
      eq('^intertype-t70^', T, type_of(create.function()), 'function');
      eq('^intertype-t71^', T, type_of(create.asyncfunction()), 'asyncfunction');
      eq('^intertype-t72^', T, type_of(create.symbol()), 'symbol');
      throws(T, /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/, function() {
        return create.basetype();
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.template_functions_are_called_in_template_fields = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declarations, declare, isa, type_of, types;
      types = new Intertype();
      ({declare, create, isa, type_of, declarations} = types);
      declare({
        quantity: {
          test: 'object',
          fields: {
            q: 'float',
            u: 'text'
          },
          template: {
            q: function() {
              return this.create.float();
            },
            u: function() {
              return 'u';
            }
          }
        }
      });
      debug('^3234^', create.quantity());
      debug('^3234^', declarations.quantity);
      eq('^intertype-t73^', T, create.quantity(), {
        q: 0,
        u: 'u'
      });
      eq('^intertype-t74^', T, isa.quantity({
        q: 9
      }), false);
      eq('^intertype-t75^', T, type_of(declarations.quantity.sub_tests.q), 'function');
      eq('^intertype-t76^', T, type_of(declarations.quantity.sub_tests.u), 'function');
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declare, type_of, types;
      types = new Intertype();
      ({declare, create, type_of} = types);
      declare({
        foo: {
          test: 'object',
          fields: {
            foo: {
              test: 'object',
              fields: {
                bar: {
                  test: 'float'
                }
              }
            }
          },
          template: {
            foo: {
              bar: 123
            }
          }
        }
      });
      debug('^3234^', create.foo());
      eq('^intertype-t77^', T, create.foo(), {
        foo: {
          bar: 123
        }
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.type_object_assumed_if_fields_present = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declarations, declare, isa, type_of, types;
      types = new Intertype();
      ({declare, declarations, create, type_of, isa} = types);
      declare({
        quantity: {
          // test: 'object'
          fields: {
            q: 'float',
            u: 'text'
          }
        }
      });
      eq('^intertype-t78^', T, type_of(declarations.quantity.test), 'function');
      debug('^342342^', declarations.quantity);
      eq('^intertype-t79^', T, type_of(declarations.quantity.sub_tests.q), 'function');
      eq('^intertype-t80^', T, type_of(declarations.quantity.sub_tests.u), 'function');
      eq('^intertype-t81^', T, isa.quantity({
        q: 987,
        u: 's'
      }), true);
      eq('^intertype-t82^', T, isa.quantity({
        q: 987
      }), false);
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
        T.eq(types.isa.foo.bar.baz(null), false);
      }
      if (T != null) {
        T.eq(types.isa.foo.bar.baz(4), true);
      }
      if (T != null) {
        T.eq(types.isa.foo.bar.baz(+2e308), false);
      }
      // T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
      // types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
      try_and_show(T, function() {
        return types.declare({
          'foo.bar.baz.quux.dax.dux': 'float'
        });
      });
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
        var ref1, results;
        ref1 = types.declarations['person'].sub_tests;
        results = [];
        for (k in ref1) {
          f = ref1[k];
          results.push({
            [`${k}`]: f.name
          });
        }
        return results;
      })());
      help('^322-2^', (function() {
        var ref1, results;
        ref1 = types.declarations['person.address'].sub_tests;
        results = [];
        for (k in ref1) {
          f = ref1[k];
          results.push({
            [`${k}`]: f.name
          });
        }
        return results;
      })());
      help('^322-3^', (function() {
        var ref1, results;
        ref1 = types.declarations['person.address.city'].sub_tests;
        results = [];
        for (k in ref1) {
          f = ref1[k];
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

  // #-----------------------------------------------------------------------------------------------------------
  // @can_use_optional_refs_to_dotted_types = ( T, done ) ->
  //   { Intertype } = require '../../../apps/intertype'
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { maybefloat1: 'optional.float', }
  //     #.......................................................................................................
  //     T?.eq ( isa.float       null  ), false
  //     T?.eq ( isa.float       true  ), false
  //     T?.eq ( isa.float       0     ), true
  //     T?.eq ( isa.maybefloat1 null  ), true
  //     T?.eq ( isa.maybefloat1 true  ), false
  //     T?.eq ( isa.maybefloat1 0     ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { 'q':              'object', }
  //     declare { 'q.maybefloat2':  'optional.float', }
  //     #.......................................................................................................
  //     T?.eq ( isa.q             null                    ), false
  //     T?.eq ( isa.q             {}                      ), true
  //     T?.eq ( isa.q             { maybefloat2: null }   ), true
  //     T?.eq ( isa.q             { maybefloat2: false }  ), false
  //     T?.eq ( isa.q             { maybefloat2: 3 }      ), true
  //     T?.eq ( isa.q.maybefloat2  null                   ), true
  //     T?.eq ( isa.q.maybefloat2  true                   ), false
  //     T?.eq ( isa.q.maybefloat2  0                      ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       isa } = types
  //     declare { 'q':              'optional.object', }
  //     declare { 'q.maybefloat3':  'optional.float', }
  //     # isa.q null
  //     #.......................................................................................................
  //     safeguard T, => T?.eq ( isa.q             null                    ), true
  //     safeguard T, => T?.eq ( isa.q             {}                      ), true
  //     safeguard T, => T?.eq ( isa.q             { maybefloat3: null }   ), true
  //     safeguard T, => T?.eq ( isa.q             { maybefloat3: false }  ), false
  //     safeguard T, => T?.eq ( isa.q             { maybefloat3: 3 }      ), true
  //     safeguard T, => T?.eq ( isa.q.maybefloat3  null                   ), true
  //     safeguard T, => T?.eq ( isa.q.maybefloat3  true                   ), false
  //     safeguard T, => T?.eq ( isa.q.maybefloat3  0                      ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   safeguard T, => do =>
  //     types   = new Intertype()
  //     { declare
  //       validate
  //       isa } = types
  //     declare { 'person':                       'object', }
  //     declare { 'person.name':                  'text',   }
  //     declare { 'person.address':               'object', }
  //     declare { 'person.address.city':          'object', }
  //     declare { 'person.address.city.name':     'text',   }
  //     declare { 'person.address.city.postcode': 'text',   }
  //     declare { 'maybesomeone':                 'optional.person', }
  //     declare { 'mycity':                       'optional.person.address.city', }
  //     #.......................................................................................................
  //     T?.eq ( isa.person        null                                                            ), false
  //     T?.eq ( isa.person        {}                                                              ), false
  //     T?.eq ( isa.person        { name: 'Fred',                                               } ), false
  //     T?.eq ( isa.person        { name: 'Fred', address: {},                                  } ), false
  //     T?.eq ( isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     T?.eq ( isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
  //     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
  //     T?.eq ( isa.maybesomeone  null                                                            ), true
  //     # T?.eq ( isa.maybesomeone  {}                                                              ), false
  //     # T?.eq ( isa.maybesomeone  { name: 'Fred',                                               } ), false
  //     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
  //     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this.forbidden_to_define_fields_on_basetypes = async function(T, done) {
    var Intertype, declarations;
    if (T != null) {
      T.halt_on_error();
    }
    ({Intertype, declarations} = require('../../../apps/intertype'));
    await (() => {      //.........................................................................................................
      var declare, isa, types, validate;
      types = new Intertype();
      ({declare, validate, isa} = types);
      try_and_show(T, function() {
        return types.declare({
          'optional.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'anything.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'nothing.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'something.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'null.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'undefined.d': (function(x) {})
        });
      });
      try_and_show(T, function() {
        return types.declare({
          'unknown.d': (function(x) {})
        });
      });
      throws(T, /illegal use of 'optional' in declaration of type 'optional.d'/, function() {
        return types.declare({
          'optional.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'anything' in declaration of type 'anything.d'/, function() {
        return types.declare({
          'anything.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/, function() {
        return types.declare({
          'nothing.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'something' in declaration of type 'something.d'/, function() {
        return types.declare({
          'something.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'null' in declaration of type 'null.d'/, function() {
        return types.declare({
          'null.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/, function() {
        return types.declare({
          'undefined.d': (function(x) {})
        });
      });
      throws(T, /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/, function() {
        return types.declare({
          'unknown.d': (function(x) {})
        });
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.internal_type_of_method = function(T, done) {
    var Intertype, __type_of, _isa, declaration, declarations, type;
    // T?.halt_on_error()
    ({Intertype, declarations, __type_of} = require('../../../apps/intertype'));
    //.........................................................................................................
    _isa = Object.fromEntries((function() {
      var results;
      results = [];
      for (type in declarations) {
        declaration = declarations[type];
        results.push([type, declaration.test]);
      }
      return results;
    })());
    (() => {      //.........................................................................................................
      var types;
      types = new Intertype();
      eq('^intertype-t83^', T, __type_of(_isa, null), 'null');
      eq('^intertype-t84^', T, __type_of(_isa, void 0), 'undefined');
      eq('^intertype-t85^', T, __type_of(_isa, 4), 'float');
      eq('^intertype-t86^', T, __type_of(_isa, function() {}), 'function');
      eq('^intertype-t87^', T, __type_of(_isa, async function() {
        return (await null);
      }), 'asyncfunction');
      eq('^intertype-t88^', T, __type_of(_isa, {}), 'object');
      eq('^intertype-t89^', T, __type_of(_isa, []), 'list');
      eq('^intertype-t90^', T, __type_of(_isa, +2e308), 'infinity');
      eq('^intertype-t91^', T, __type_of(_isa, -2e308), 'infinity');
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.deepmerge = function(T, done) {
    var Intertype, declarations, deepmerge;
    // T?.halt_on_error()
    ({Intertype, declarations, deepmerge} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var probe, result, sub;
      sub = {
        foo: 3
      };
      probe = {
        bar: {
          baz: {
            sub: sub
          }
        },
        gnu: 4
      };
      result = deepmerge(probe);
      eq('^intertype-t92^', T, result, probe);
      eq('^intertype-t93^', T, result.bar === probe.bar, false);
      eq('^intertype-t94^', T, result.bar.baz === probe.bar.baz, false);
      eq('^intertype-t95^', T, result.bar.baz.sub === probe.bar.baz.sub, false);
      eq('^intertype-t96^', T, result.bar.baz.sub === sub, false);
      eq('^intertype-t97^', T, probe.bar.baz.sub === sub, true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var probe, result, sub, types;
      sub = {
        foo: 3
      };
      probe = {
        bar: {
          baz: {
            sub: sub
          }
        },
        gnu: 4
      };
      types = new Intertype({
        q: {
          test: 'object',
          template: probe
        }
      });
      result = types.create.q();
      eq('^intertype-t98^', T, result, probe);
      eq('^intertype-t99^', T, result.bar === probe.bar, false);
      eq('^intertype-t100^', T, result.bar.baz === probe.bar.baz, false);
      eq('^intertype-t101^', T, result.bar.baz.sub === probe.bar.baz.sub, false);
      eq('^intertype-t102^', T, result.bar.baz.sub === sub, false);
      eq('^intertype-t103^', T, probe.bar.baz.sub === sub, true);
      return null;
    })();
    (() => {      //.........................................................................................................
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
      throws(T, function() {
        return validate.person(null);
      });
      throws(T, function() {
        return validate.person.address(null);
      });
      throws(T, function() {
        return validate.person.address.city(null);
      });
      throws(T, function() {
        return validate.person.address.city.postcode(null);
      });
      //.......................................................................................................
      if (T != null) {
        T.eq(types.isa.person.address.city.postcode(3), false);
      }
      throws(T, /expected a person.address.city.postcode/, function() {
        return validate.person.address.city.postcode(3);
      });
      //.......................................................................................................
      if (T != null) {
        T.eq(types.isa.person.address.city({
          name: 'P'
        }), false);
      }
      throws(T, /expected a person.address.city/, function() {
        return validate.person.address.city({
          name: 'P'
        });
      });
      // #.......................................................................................................
      if (T != null) {
        T.eq(types.isa.person.address.city({
          postcode: '3421'
        }), false);
      }
      throws(T, /method 'validate.person.address.city' expects 1 arguments, got 0/, function() {
        return validate.person.address.city();
      });
      throws(T, /expected a person.address.city/, function() {
        return validate.person.address.city(null);
      });
      throws(T, /expected a person.address.city/, function() {
        return validate.person.address.city('3421');
      });
      throws(T, /expected a person.address.city/, function() {
        return validate.person.address.city({
          postcode: '3421'
        });
      });
      //.......................................................................................................
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
  this.use_evaluate = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var evaluate, isa, types, validate;
      types = new Intertype();
      ({validate, isa, evaluate} = types);
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
      throws(T, /`optional` is not a legal type for `evaluate` methods/, function() {
        return evaluate.optional(1);
      });
      throws(T, /`optional` is not a legal type for `evaluate` methods/, function() {
        return evaluate.optional.person(1);
      });
      //.......................................................................................................
      eq('^intertype-t104^', T, isa.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), true);
      eq('^intertype-t105^', T, evaluate.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), {
        person: true,
        'person.name': true,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      //.......................................................................................................
      eq('^intertype-t106^', T, isa.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 12345678
          }
        }
      }), false);
      eq('^intertype-t107^', T, evaluate.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 12345678
          }
        }
      }), {
        person: false,
        'person.name': true,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': true,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq('^intertype-t108^', T, isa.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 12345678
          }
        }
      }), false);
      eq('^intertype-t109^', T, evaluate.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 12345678
          }
        }
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': true,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq('^intertype-t110^', T, isa.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), false);
      eq('^intertype-t111^', T, evaluate.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), {
        person: false,
        'person.name': false,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      //.......................................................................................................
      eq('^intertype-t112^', T, isa.person(null), false);
      eq('^intertype-t113^', T, evaluate.person(null), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq('^intertype-t114^', T, isa.person({}), false);
      eq('^intertype-t115^', T, evaluate.person({}), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var evaluate, isa, types, validate;
      types = new Intertype();
      ({validate, isa, evaluate} = types);
      types.declare({
        'person': 'object'
      });
      types.declare({
        'person.address': 'object'
      });
      types.declare({
        'person.address.city': 'object'
      });
      types.declare({
        'person.address.city.postcode': 'text'
      });
      types.declare({
        'person.address.city.name': 'text'
      });
      types.declare({
        'person.name': 'text'
      });
      //.......................................................................................................
      eq('^intertype-t116^', T, isa.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), true);
      eq('^intertype-t117^', T, evaluate.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), {
        person: true,
        'person.name': true,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq('^intertype-t118^', T, Object.keys(evaluate.person({
        name: 'Alice',
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      })), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq('^intertype-t119^', T, isa.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), false);
      eq('^intertype-t120^', T, evaluate.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      }), {
        person: false,
        'person.name': false,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq('^intertype-t121^', T, Object.keys(evaluate.person({
        address: {
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }
      })), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq('^intertype-t122^', T, isa.person(null), false);
      eq('^intertype-t123^', T, evaluate.person(null), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq('^intertype-t124^', T, Object.keys(evaluate.person(null)), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq('^intertype-t125^', T, isa.person({}), false);
      eq('^intertype-t126^', T, evaluate.person({}), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq('^intertype-t127^', T, Object.keys(evaluate.person({})), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq('^intertype-t128^', T, isa.person.address({
        city: {
          name: 'Atown',
          postcode: 'VA1234'
        }
      }), true);
      eq('^intertype-t129^', T, evaluate.person.address({
        city: {
          name: 'Atown',
          postcode: 'VA1234'
        }
      }), {
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq('^intertype-t130^', T, Object.keys(evaluate.person.address({
        city: {
          name: 'Atown',
          postcode: 'VA1234'
        }
      })), ['person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name']);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_prefixes = function(T, done) {
    var isa, type_of, walk_prefixes;
    // T?.halt_on_error()
    ({walk_prefixes, isa, type_of} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      eq('^intertype-t131^', T, isa.generatorfunction(walk_prefixes), true);
      eq('^intertype-t132^', T, [...(walk_prefixes('one'))], []);
      eq('^intertype-t133^', T, [...(walk_prefixes('one.two'))], ['one']);
      eq('^intertype-t134^', T, [...(walk_prefixes('one.two.three'))], ['one', 'one.two']);
      eq('^intertype-t135^', T, [...(walk_prefixes('one.two.three.four'))], ['one', 'one.two', 'one.two.three']);
      /* TAINT should not allow empty namers: */
      eq('^intertype-t136^', T, [...(walk_prefixes('.one.two.three'))], ['', '.one', '.one.two']);
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
  this.can_use_qualifiers = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, Ω_intertype_1, Ω_intertype_10, Ω_intertype_11, Ω_intertype_12, Ω_intertype_13, Ω_intertype_2, Ω_intertype_3, Ω_intertype_4, Ω_intertype_5, Ω_intertype_6, Ω_intertype_7, Ω_intertype_8, Ω_intertype_9;
      declarations = {
        'empty': {
          test: 'object',
          role: 'qualifier'
        },
        'nonempty': {
          test: 'object',
          role: 'qualifier'
        },
        'empty.list': function(x) {
          return (this.isa.list(x)) && (x.length === 0);
        },
        'empty.text': function(x) {
          return (this.isa.text(x)) && (x.length === 0);
        },
        'empty.set': function(x) {
          return (this.isa.set(x)) && (x.size === 0);
        },
        'nonempty.list': function(x) {
          return (this.isa.list(x)) && (x.length > 0);
        },
        'nonempty.text': function(x) {
          return (this.isa.text(x)) && (x.length > 0);
        },
        'nonempty.set': function(x) {
          return (this.isa.set(x)) && (x.size > 0);
        }
      };
      types = new Intertype(declarations);
      ({isa} = types);
      eq2(T, (Ω_intertype_1 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_2 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_3 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_4 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_5 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_6 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_7 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_8 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_9 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_10 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_11 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_12 = function() {
        return isa.nonempty.text(4);
      }), false);
      /* this doesn't make a terrible lot of sense: */
      eq2(T, (Ω_intertype_13 = function() {
        return isa.empty({
          list: [],
          text: '',
          set: new Set()
        });
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_14, Ω_intertype_15, Ω_intertype_16, Ω_intertype_17, Ω_intertype_18, Ω_intertype_19, Ω_intertype_20, Ω_intertype_21, Ω_intertype_22, Ω_intertype_23, Ω_intertype_24, Ω_intertype_25, Ω_intertype_26, Ω_intertype_27, Ω_intertype_28, Ω_intertype_29, Ω_intertype_30, Ω_intertype_31, Ω_intertype_32, Ω_intertype_33, Ω_intertype_34, Ω_intertype_35, Ω_intertype_36, Ω_intertype_37, Ω_intertype_38, Ω_intertype_39, Ω_intertype_40, Ω_intertype_40Ü, Ω_intertype_41, Ω_intertype_42, Ω_intertype_43, Ω_intertype_44, Ω_intertype_45, Ω_intertype_46;
      declarations = {
        'empty': {
          role: 'qualifier'
        },
        'nonempty': {
          role: 'qualifier'
        },
        'empty.list': function(x) {
          return (this.isa.list(x)) && (x.length === 0);
        },
        'empty.text': function(x) {
          return (this.isa.text(x)) && (x.length === 0);
        },
        'empty.set': function(x) {
          return (this.isa.set(x)) && (x.size === 0);
        },
        'nonempty.list': function(x) {
          return (this.isa.list(x)) && (x.length > 0);
        },
        'nonempty.text': function(x) {
          return (this.isa.text(x)) && (x.length > 0);
        },
        'nonempty.set': function(x) {
          return (this.isa.set(x)) && (x.size > 0);
        }
      };
      types = new Intertype(declarations);
      ({isa, validate} = types);
      eq2(T, (Ω_intertype_14 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_15 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_16 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_17 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_18 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_19 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_20 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_21 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_22 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_23 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_24 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_25 = function() {
        return isa.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_26 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_27 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_28 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_29 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_30 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_31 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_32 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_33 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_34 = function() {
        return validate.empty(new Set());
      }), new Set());
      // throws T, /expected a empty, got a list/, -> ( validate.empty [ 1, ]              )
      // throws T, /expected a empty, got a text/, -> ( validate.empty 'A'                 )
      // throws T, /expected a empty, got a set/,  -> ( validate.empty new Set 'abc'       )
      throws2(T, (Ω_intertype_35 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_36 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_37 = function() {
        return validate.empty(new Set('abc'));
      }), /whatever/);
      throws2(T, (Ω_intertype_40Ü = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      throws2(T, (Ω_intertype_38 = function() {
        return validate.empty(new Set('abc'));
      }), 23453);
      throws2(T, (Ω_intertype_40Ü = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      throws2(T, (Ω_intertype_40Ü = function() {
        return validate.empty(new Set());
      }), /expected a empty, got a set/);
      throws2(T, (Ω_intertype_39 = function() {
        return validate.empty(new Set('abc'));
      }));
      throws2(T, (Ω_intertype_40 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      return null;
      //.......................................................................................................
      eq2(T, (Ω_intertype_41 = function() {
        return isa.opttional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_42 = function() {
        return isa.opttional.empty('');
      }), true);
      eq2(T, (Ω_intertype_43 = function() {
        return isa.opttional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_44 = function() {
        return isa.opttional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_45 = function() {
        return isa.opttional.empty('A');
      }), false);
      return eq2(T, (Ω_intertype_46 = function() {
        return isa.opttional.empty(new Set('abc'));
      }), false);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_rhs_optional = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      /* TAINT observe the out-comment messages would perhaps make more sense as they are more specific */
      if (T != null) {
        T.eq((new Intertype()).declare({
          foo: 'float'
        }), null);
      }
      if (T != null) {
        T.eq((new Intertype()).declare({
          foo: 'text'
        }), null);
      }
      // ( new Intertype() ).declare { foo: 'optional', }
      throws(T, /illegal use of 'optional' in declaration of type 'foo'/, function() {
        return (new Intertype()).declare({
          foo: 'optional'
        });
      });
      throws(T, /unknown type 'qqq'/, function() {
        return (new Intertype()).declare({
          foo: 'qqq'
        });
      });
      throws(T, /illegal use of 'optional' in declaration of type 'foo'/, function() {
        return (new Intertype()).declare({
          foo: 'optional.float'
        });
      });
      throws(T, /illegal use of basetype 'anything' in declaration of type 'foo'/, function() {
        return (new Intertype()).declare({
          foo: 'anything.float'
        });
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parallel_behavior_of_isa_validate_mandatory_and_optional = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var isa, validate;
      ({isa, validate} = new Intertype({
        normalfloat: (function(x) {
          return (this.isa.float(x)) && ((0 <= x && x <= 1));
        })
      }));
      eq('^intertype-t168^', T, isa.normalfloat(0), true);
      eq('^intertype-t169^', T, isa.normalfloat(null), false);
      eq('^intertype-t170^', T, isa.normalfloat(-1), false);
      eq('^intertype-t171^', T, isa.normalfloat('?'), false);
      eq('^intertype-t172^', T, isa.optional.normalfloat(0), true);
      eq('^intertype-t173^', T, isa.optional.normalfloat(null), true);
      eq('^intertype-t174^', T, isa.optional.normalfloat(-1), false);
      eq('^intertype-t175^', T, isa.optional.normalfloat('?'), false);
      eq('^intertype-t176^', T, validate.normalfloat(0), 0);
      eq('^intertype-t177^', T, validate.optional.normalfloat(0), 0);
      eq('^intertype-t178^', T, validate.optional.normalfloat(null), null);
      throws(T, /expected a normalfloat, got a null/, function() {
        return validate.normalfloat(null);
      });
      throws(T, /expected a normalfloat, got a float/, function() {
        return validate.normalfloat(-1);
      });
      throws(T, /expected a normalfloat, got a text/, function() {
        return validate.normalfloat('?');
      });
      throws(T, /expected an optional normalfloat, got a float/, function() {
        return validate.optional.normalfloat(-1);
      });
      throws(T, /expected an optional normalfloat, got a text/, function() {
        return validate.optional.normalfloat('?');
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var isa, my_types, types, validate;
      my_types = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text',
        'foo': 'object',
        'foo.bar': 'object',
        'foo.bar.baz': 'float'
      };
      ({isa, validate} = types = new Intertype(my_types));
      eq('^intertype-t179^', T, isa.quantity({
        q: 1,
        u: 'm'
      }), true);
      eq('^intertype-t180^', T, isa.quantity(null), false);
      eq('^intertype-t181^', T, isa.optional.quantity({
        q: 2,
        u: 'm'
      }), true);
      eq('^intertype-t182^', T, isa.optional.quantity(null), true);
      eq('^intertype-t183^', T, validate.quantity({
        q: 3,
        u: 'm'
      }), {
        q: 3,
        u: 'm'
      });
      eq('^intertype-t184^', T, validate.optional.quantity({
        q: 4,
        u: 'm'
      }), {
        q: 4,
        u: 'm'
      });
      eq('^intertype-t185^', T, validate.optional.quantity.q(null), null);
      eq('^intertype-t186^', T, validate.optional.quantity.q(111), 111);
      throws(T, function() {
        return validate.quantity({
          q: 5
        });
      });
      eq('^intertype-t187^', T, isa.quantity(null), false);
      eq('^intertype-t188^', T, isa.quantity(-1), false);
      eq('^intertype-t189^', T, isa.quantity('?'), false);
      eq('^intertype-t190^', T, isa.quantity.q('?'), false);
      eq('^intertype-t191^', T, isa.quantity.q(3), true);
      eq('^intertype-t192^', T, isa.optional.quantity({
        q: 1,
        u: 'm'
      }), true);
      eq('^intertype-t193^', T, isa.optional.quantity(null), true);
      eq('^intertype-t194^', T, isa.optional.quantity(-1), false);
      eq('^intertype-t195^', T, isa.optional.quantity('?'), false);
      eq('^intertype-t196^', T, isa.optional.quantity.q('?'), false);
      eq('^intertype-t197^', T, isa.optional.quantity.q(3), true);
      eq('^intertype-t198^', T, validate.quantity({
        q: 1,
        u: 'm'
      }), {
        q: 1,
        u: 'm'
      });
      eq('^intertype-t199^', T, validate.optional.quantity({
        q: 1,
        u: 'm'
      }), {
        q: 1,
        u: 'm'
      });
      eq('^intertype-t200^', T, validate.optional.quantity(null), null);
      throws(T, /expected a quantity, got a null/, function() {
        return validate.quantity(null);
      });
      throws(T, /expected a quantity, got a float/, function() {
        return validate.quantity(-1);
      });
      throws(T, /expected a quantity, got a text/, function() {
        return validate.quantity('?');
      });
      throws(T, /expected a quantity, got a object/, function() {
        return validate.quantity({
          q: 1
        });
      });
      /* TAINT message should be more specific */      throws(T, /expected an optional quantity, got a float/, function() {
        return validate.optional.quantity(-1);
      });
      throws(T, /expected an optional quantity, got a object/, function() {
        return validate.optional.quantity({
          q: 1
        });
      });
      /* TAINT message should be more specific */      throws(T, /expected an optional quantity.q, got a object/, function() {
        return validate.optional.quantity.q({
          q: 1
        });
      });
      throws(T, /method 'validate.optional.quantity.q' expects 1 arguments, got 3/, function() {
        return validate.optional.quantity.q(3, 4, 5);
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declaration_role_field = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations;
      ({declarations} = new Intertype());
      eq('^intertype-t201^', T, declarations.float.role, 'usertype');
      eq('^intertype-t202^', T, declarations.null.role, 'basetype');
      eq('^intertype-t203^', T, declarations.anything.role, 'basetype');
      eq('^intertype-t204^', T, declarations.unknown.role, 'basetype');
      eq('^intertype-t205^', T, declarations.optional.role, 'optional');
      // throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
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
  this.minimal_type_of_results = function(T, done) {
    var Intertype_minimal, create, declare, isa, type_of, validate;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    ({isa, validate, create, declare, type_of} = new Intertype_minimal());
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(type_of(null), 'null');
      }
      if (T != null) {
        T.eq(type_of(void 0), 'undefined');
      }
      if (T != null) {
        T.eq(type_of(+2e308), 'unknown');
      }
      if (T != null) {
        T.eq(type_of(4), 'unknown');
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(isa.anything(1), true);
      }
      if (T != null) {
        T.eq(isa.nothing(1), false);
      }
      if (T != null) {
        T.eq(isa.something(1), true);
      }
      if (T != null) {
        T.eq(isa.unknown(1), true);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(isa.anything(null), true);
      }
      if (T != null) {
        T.eq(isa.nothing(null), true);
      }
      if (T != null) {
        T.eq(isa.something(null), false);
      }
      if (T != null) {
        T.eq(isa.unknown(null), false);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(isa.anything(void 0), true);
      }
      if (T != null) {
        T.eq(isa.nothing(void 0), true);
      }
      if (T != null) {
        T.eq(isa.something(void 0), false);
      }
      if (T != null) {
        T.eq(isa.unknown(void 0), false);
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      throws(T, /`optional` is not a legal type for `isa` methods/, function() {
        return isa.optional(1);
      });
      throws(T, /`optional` is not a legal type for `validate` methods/, function() {
        return validate.optional(1);
      });
      throws(T, /`optional` is not a legal type for `create` methods/, function() {
        return create.optional(1);
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      try_and_show(T != null, function() {
        return declare('anything', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('nothing', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('something', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('null', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('undefined', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('unknown', function(x) {});
      });
      try_and_show(T != null, function() {
        return declare('optional', function(x) {});
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
    await (() => {
      // @basic_functionality_using_types_object()
      // test @basic_functionality_using_types_object
      // @allow_declaration_objects()
      // demo_1()
      // @can_use_type_name_for_test()
      // test @can_use_type_name_for_test
      // await test @create_entries_must_be_sync_functions
      // await test @template_methods_must_be_nullary
      // @throw_instructive_error_on_missing_type()
      // @disallow_licensed_overrides()
      // await test @disallow_licensed_overrides
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
      // @forbidden_to_define_fields_on_basetypes()
      // test @forbidden_to_define_fields_on_basetypes
      // @can_use_optional_refs_to_dotted_types()
      // test @can_use_optional_refs_to_dotted_types
      // @minimal_type_of_results()
      // test @minimal_type_of_results
      // @disallow_rhs_optional()
      // test @disallow_rhs_optional
      // @parallel_behavior_of_isa_validate_mandatory_and_optional()
      // test @parallel_behavior_of_isa_validate_mandatory_and_optional
      // @can_create_types_with_templates_and_create()
      // test @can_create_types_with_templates_and_create
      // @type_object_assumed_if_fields_present()
      // test @type_object_assumed_if_fields_present
      // @use_evaluate()
      // test @use_evaluate
      // @same_basic_types()
      // test @same_basic_types
      // @walk_prefixes()
      // test @walk_prefixes
      // @declaration_role_field()
      // test @declaration_role_field
      // @interface()
      // test @interface
      // @can_use_qualifiers()
      return test(this.can_use_qualifiers);
    })();
  }

  // await test @

}).call(this);

//# sourceMappingURL=test-basics.js.map