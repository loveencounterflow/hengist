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
    },
    object: function(x) {
      return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
    },
    set: function(x) {
      return x instanceof Set;
    },
    list: function(x) {
      return Array.isArray(x);
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
    var INTERTYPE, Ω_intertype_0001, Ω_intertype_0002, Ω_intertype_0003, Ω_intertype_0004, Ω_intertype_0005, Ω_intertype_0006, Ω_intertype_0007, Ω_intertype_0008, Ω_intertype_0009, Ω_intertype_0010, Ω_intertype_0011, Ω_intertype_0013, Ω_intertype_0015, Ω_intertype_0016, Ω_intertype_0017, Ω_intertype_0018, Ω_intertype_0019, Ω_intertype_0020, Ω_intertype_0021, Ω_intertype_0022, Ω_intertype_0023, Ω_intertype_0028, Ω_intertype_0029;
    INTERTYPE = require('../../../apps/intertype');
    eq2(T, (Ω_intertype_0001 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_0002 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa);
    }), true);
    eq2(T, (Ω_intertype_0003 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_0004 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate);
    }), true);
    eq2(T, (Ω_intertype_0005 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_0006 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa);
    }), true);
    eq2(T, (Ω_intertype_0007 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_0008 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate);
    }), true);
    eq2(T, (Ω_intertype_0009 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_0010 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_0011 = function() {
      return TMP_types.isa.object(INTERTYPE.types.isa);
    }), true);
    // eq2 T, ( Ω_intertype_0012 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
    eq2(T, (Ω_intertype_0013 = function() {
      return TMP_types.isa.object(INTERTYPE.types.validate);
    }), true);
    // eq2 T, ( Ω_intertype_0014 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
    eq2(T, (Ω_intertype_0015 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.boolean);
    }), true);
    eq2(T, (Ω_intertype_0016 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_0017 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.boolean);
    }), true);
    eq2(T, (Ω_intertype_0018 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_0019 = function() {
      return TMP_types.isa.object(INTERTYPE.types.create);
    }), true);
    eq2(T, (Ω_intertype_0020 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.text);
    }), true);
    eq2(T, (Ω_intertype_0021 = function() {
      return TMP_types.isa.function(INTERTYPE.types.create.text);
    }), true);
    eq2(T, (Ω_intertype_0022 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations);
    }), true);
    eq2(T, (Ω_intertype_0023 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations.text);
    }), true);
    //.........................................................................................................
    // eq2 T, ( Ω_intertype_0024 = -> INTERTYPE.types.isa.name           ), 'isa'
    // eq2 T, ( Ω_intertype_0025 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
    // eq2 T, ( Ω_intertype_0026 = -> INTERTYPE.types.validate.name      ), 'validate'
    // eq2 T, ( Ω_intertype_0027 = -> INTERTYPE.types.create.name        ), 'create'
    eq2(T, (Ω_intertype_0028 = function() {
      return INTERTYPE.types.declare.name;
    }), 'declare');
    eq2(T, (Ω_intertype_0029 = function() {
      return INTERTYPE.types.type_of.name;
    }), 'type_of');
    (() => {      //.........................................................................................................
      var results, type, Ω_intertype_0030;
      results = [];
      for (type in INTERTYPE.testing._isa) {
        if (Reflect.has(INTERTYPE.declarations, type)) {
          continue;
        }
        results.push(eq2(T, (Ω_intertype_0030 = function() {
          return false;
        }), `type missing from default_declarations: ${rpr(type)}`));
      }
      return results;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, types, Ω_intertype_0031, Ω_intertype_0032, Ω_intertype_0033, Ω_intertype_0034, Ω_intertype_0035, Ω_intertype_0036, Ω_intertype_0037, Ω_intertype_0038, Ω_intertype_0039, Ω_intertype_0040, Ω_intertype_0041, Ω_intertype_0042, Ω_intertype_0043, Ω_intertype_0044, Ω_intertype_0045, Ω_intertype_0046, Ω_intertype_0047, Ω_intertype_0048, Ω_intertype_0049, Ω_intertype_0050, Ω_intertype_0051, Ω_intertype_0052, Ω_intertype_0053, Ω_intertype_0054, Ω_intertype_0055, Ω_intertype_0056, Ω_intertype_0057, Ω_intertype_0058, Ω_intertype_0059, Ω_intertype_0060, Ω_intertype_0061, Ω_intertype_0062, Ω_intertype_0063, Ω_intertype_0064, Ω_intertype_0065, Ω_intertype_0066, Ω_intertype_0067, Ω_intertype_0068;
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype_minimal(sample_declarations);
    eq2(T, (Ω_intertype_0031 = function() {
      return types.isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_0032 = function() {
      return types.isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0033 = function() {
      return types.isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_0034 = function() {
      return types.isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_0035 = function() {
      return types.isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_0036 = function() {
      return types.isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0037 = function() {
      return types.isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_0038 = function() {
      return types.isa.optional.boolean(1);
    }), false);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0039 = function() {
      return types.validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_0040 = function() {
      return types.validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0041 = function() {
      return types.validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0042 = function() {
      return types.validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_0043 = function() {
      return types.validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_0044 = function() {
      return types.validate.optional.boolean(null);
    }), null);
    try_and_show(T, function() {
      return types.validate.boolean(1);
    });
    try_and_show(T, function() {
      return types.validate.optional.boolean(1);
    });
    throws2(T, (Ω_intertype_0045 = function() {
      return types.validate.boolean(1);
    }), /expected a boolean/);
    throws2(T, (Ω_intertype_0046 = function() {
      return types.validate.optional.boolean(1);
    }), /expected an optional boolean/);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0047 = function() {
      return types.type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_0048 = function() {
      return types.type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_0049 = function() {
      return types.type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_0050 = function() {
      return types.type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_0051 = function() {
      return types.type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_0052 = function() {
      return types.type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_0053 = function() {
      return types.type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_0054 = function() {
      return types.type_of(-2e308);
    }), 'unknown');
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
    eq2(T, (Ω_intertype_0055 = function() {
      return types.isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_0056 = function() {
      return types.isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_0057 = function() {
      return types.validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_0058 = function() {
      return types.validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
    eq2(T, (Ω_intertype_0059 = function() {
      var ref1;
      return (ref1 = types.declarations.null) != null ? ref1.type : void 0;
    }), 'null');
    eq2(T, (Ω_intertype_0060 = function() {
      var ref1;
      return (ref1 = types.declarations.function) != null ? ref1.type : void 0;
    }), 'function');
    eq2(T, (Ω_intertype_0061 = function() {
      var ref1;
      return (ref1 = types.declarations.boolean) != null ? ref1.type : void 0;
    }), 'boolean');
    eq2(T, (Ω_intertype_0062 = function() {
      var ref1;
      return (ref1 = types.declarations.text) != null ? ref1.type : void 0;
    }), 'text');
    eq2(T, (Ω_intertype_0063 = function() {
      var ref1;
      return (ref1 = types.declarations.asyncfunction) != null ? ref1.type : void 0;
    }), 'asyncfunction');
    eq2(T, (Ω_intertype_0064 = function() {
      var ref1;
      return (ref1 = types.isa.null) != null ? ref1.name : void 0;
    }), 'isa.null');
    eq2(T, (Ω_intertype_0065 = function() {
      var ref1;
      return (ref1 = types.isa.function) != null ? ref1.name : void 0;
    }), 'isa.function');
    eq2(T, (Ω_intertype_0066 = function() {
      var ref1;
      return (ref1 = types.isa.boolean) != null ? ref1.name : void 0;
    }), 'isa.boolean');
    eq2(T, (Ω_intertype_0067 = function() {
      var ref1;
      return (ref1 = types.isa.text) != null ? ref1.name : void 0;
    }), 'isa.text');
    eq2(T, (Ω_intertype_0068 = function() {
      var ref1;
      return (ref1 = types.isa.asyncfunction) != null ? ref1.name : void 0;
    }), 'isa.asyncfunction');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_standalone_methods = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_0069, Ω_intertype_0070, Ω_intertype_0071, Ω_intertype_0072, Ω_intertype_0073, Ω_intertype_0074, Ω_intertype_0075, Ω_intertype_0076, Ω_intertype_0077, Ω_intertype_0078, Ω_intertype_0079, Ω_intertype_0080, Ω_intertype_0081, Ω_intertype_0082, Ω_intertype_0083, Ω_intertype_0084, Ω_intertype_0085, Ω_intertype_0086, Ω_intertype_0087, Ω_intertype_0088, Ω_intertype_0089, Ω_intertype_0090, Ω_intertype_0091, Ω_intertype_0092, Ω_intertype_0093, Ω_intertype_0094, Ω_intertype_0095, Ω_intertype_0096, Ω_intertype_0097, Ω_intertype_0098, Ω_intertype_0099, Ω_intertype_0100, Ω_intertype_0101, Ω_intertype_0102, Ω_intertype_0103, Ω_intertype_0104;
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    eq2(T, (Ω_intertype_0069 = function() {
      return isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_0070 = function() {
      return isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0071 = function() {
      return isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_0072 = function() {
      return isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_0073 = function() {
      return isa.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_0074 = function() {
      return isa.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_0075 = function() {
      return isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_0076 = function() {
      return isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0077 = function() {
      return isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_0078 = function() {
      return isa.optional.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_0079 = function() {
      return isa.optional.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_0080 = function() {
      return isa.optional.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_0081 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    eq2(T, (Ω_intertype_0082 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0083 = function() {
      return validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_0084 = function() {
      return validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0085 = function() {
      return validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_0086 = function() {
      return validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_0087 = function() {
      return validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_0088 = function() {
      return validate.optional.boolean(null);
    }), null);
    try_and_show(T, function() {
      return validate.boolean(1);
    });
    try_and_show(T, function() {
      return validate.optional.boolean(1);
    });
    throws2(T, (Ω_intertype_0089 = function() {
      return validate.boolean(1);
    }), /expected a boolean/);
    throws2(T, (Ω_intertype_0090 = function() {
      return validate.optional.boolean(1);
    }), /expected an optional boolean/);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0091 = function() {
      return type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_0092 = function() {
      return type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_0093 = function() {
      return type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_0094 = function() {
      return type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_0095 = function() {
      return type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_0096 = function() {
      return type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_0097 = function() {
      return type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_0098 = function() {
      return type_of(-2e308);
    }), 'unknown');
    //.........................................................................................................
    eq2(T, (Ω_intertype_0099 = function() {
      return isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_0100 = function() {
      return isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_0101 = function() {
      return validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_0102 = function() {
      return validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
    //.........................................................................................................
    throws2(T, (Ω_intertype_0103 = function() {
      return isa.float(3, 4);
    }), /method 'isa.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0104 = function() {
      return isa.float();
    }), /method 'isa.float' expects 1 arguments, got 0/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.methods_check_arity = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_0105, Ω_intertype_0106, Ω_intertype_0107, Ω_intertype_0108, Ω_intertype_0109, Ω_intertype_0110, Ω_intertype_0111, Ω_intertype_0112, Ω_intertype_0113, Ω_intertype_0114;
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    //.........................................................................................................
    throws2(T, (Ω_intertype_0105 = function() {
      return isa.float(3, 4);
    }), /method 'isa.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0106 = function() {
      return isa.float();
    }), /method 'isa.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_0107 = function() {
      return isa.optional.float(3, 4);
    }), /method 'isa.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0108 = function() {
      return isa.optional.float();
    }), /method 'isa.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_0109 = function() {
      return validate.float(3, 4);
    }), /method 'validate.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0110 = function() {
      return validate.float();
    }), /method 'validate.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_0111 = function() {
      return validate.optional.float(3, 4);
    }), /method 'validate.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0112 = function() {
      return validate.optional.float();
    }), /method 'validate.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_0113 = function() {
      return type_of(3, 4);
    }), /expected 1 arguments, got 2/);
    throws2(T, (Ω_intertype_0114 = function() {
      return type_of();
    }), /expected 1 arguments, got 0/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.same_basic_types = function(T, done) {
    var $function, asyncfunction, asyncgenerator, asyncgeneratorfunction, boolean, generator, generatorfunction, isa, symbol, type_of, validate, Ω_intertype_0115, Ω_intertype_0116, Ω_intertype_0117, Ω_intertype_0118, Ω_intertype_0119, Ω_intertype_0120, Ω_intertype_0121, Ω_intertype_0122, Ω_intertype_0123, Ω_intertype_0124, Ω_intertype_0125, Ω_intertype_0126, Ω_intertype_0127, Ω_intertype_0128, Ω_intertype_0129, Ω_intertype_0130, Ω_intertype_0131, Ω_intertype_0132, Ω_intertype_0133, Ω_intertype_0134, Ω_intertype_0135, Ω_intertype_0136, Ω_intertype_0137, Ω_intertype_0138;
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
    eq2(T, (Ω_intertype_0115 = function() {
      return isa.boolean(boolean);
    }), true);
    eq2(T, (Ω_intertype_0116 = function() {
      return isa.function($function);
    }), true);
    eq2(T, (Ω_intertype_0117 = function() {
      return isa.asyncfunction(asyncfunction);
    }), true);
    eq2(T, (Ω_intertype_0118 = function() {
      return isa.generatorfunction(generatorfunction);
    }), true);
    eq2(T, (Ω_intertype_0119 = function() {
      return isa.asyncgeneratorfunction(asyncgeneratorfunction);
    }), true);
    eq2(T, (Ω_intertype_0120 = function() {
      return isa.asyncgenerator(asyncgenerator);
    }), true);
    eq2(T, (Ω_intertype_0121 = function() {
      return isa.generator(generator);
    }), true);
    eq2(T, (Ω_intertype_0122 = function() {
      return isa.symbol(symbol);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0123 = function() {
      return validate.boolean(boolean);
    }), boolean);
    eq2(T, (Ω_intertype_0124 = function() {
      return validate.function($function);
    }), $function);
    eq2(T, (Ω_intertype_0125 = function() {
      return validate.asyncfunction(asyncfunction);
    }), asyncfunction);
    eq2(T, (Ω_intertype_0126 = function() {
      return validate.generatorfunction(generatorfunction);
    }), generatorfunction);
    eq2(T, (Ω_intertype_0127 = function() {
      return validate.asyncgeneratorfunction(asyncgeneratorfunction);
    }), asyncgeneratorfunction);
    eq2(T, (Ω_intertype_0128 = function() {
      return validate.asyncgenerator(asyncgenerator);
    }), asyncgenerator);
    eq2(T, (Ω_intertype_0129 = function() {
      return validate.generator(generator);
    }), generator);
    eq2(T, (Ω_intertype_0130 = function() {
      return validate.symbol(symbol);
    }), symbol);
    //.........................................................................................................
    eq2(T, (Ω_intertype_0131 = function() {
      return type_of(boolean);
    }), 'boolean');
    eq2(T, (Ω_intertype_0132 = function() {
      return type_of($function);
    }), 'function');
    eq2(T, (Ω_intertype_0133 = function() {
      return type_of(asyncfunction);
    }), 'asyncfunction');
    eq2(T, (Ω_intertype_0134 = function() {
      return type_of(generatorfunction);
    }), 'generatorfunction');
    eq2(T, (Ω_intertype_0135 = function() {
      return type_of(asyncgeneratorfunction);
    }), 'asyncgeneratorfunction');
    eq2(T, (Ω_intertype_0136 = function() {
      return type_of(asyncgenerator);
    }), 'asyncgenerator');
    eq2(T, (Ω_intertype_0137 = function() {
      return type_of(generator);
    }), 'generator');
    eq2(T, (Ω_intertype_0138 = function() {
      return type_of(symbol);
    }), 'symbol');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_on_missing_type = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_0139, Ω_intertype_0140, Ω_intertype_0141, Ω_intertype_0142, Ω_intertype_0143, Ω_intertype_0144, Ω_intertype_0145, Ω_intertype_0146, Ω_intertype_0147, Ω_intertype_0148, Ω_intertype_0149, Ω_intertype_0150, Ω_intertype_0151, Ω_intertype_0152, Ω_intertype_0153, Ω_intertype_0154;
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype());
    //.........................................................................................................
    // try_and_show T, -> isa.quux
    // try_and_show T, -> isa.quux()
    // try_and_show T, -> isa.quux 3
    // try_and_show T, -> isa.quux 3, 4
    // try_and_show T, -> isa.optional.quux
    // try_and_show T, -> isa.optional.quux()
    // try_and_show T, -> isa.optional.quux 3
    // try_and_show T, -> isa.optional.quux 3, 4
    // try_and_show T, -> validate.quux
    // try_and_show T, -> validate.quux()
    // try_and_show T, -> validate.quux 3
    // try_and_show T, -> validate.quux 3, 4
    // try_and_show T, -> validate.optional.quux
    // try_and_show T, -> validate.optional.quux()
    // try_and_show T, -> validate.optional.quux 3
    // try_and_show T, -> validate.optional.quux 3, 4
    //.........................................................................................................
    throws2(T, (Ω_intertype_0139 = function() {
      return isa.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0140 = function() {
      return isa.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0141 = function() {
      return isa.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0142 = function() {
      return isa.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0143 = function() {
      return isa.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0144 = function() {
      return isa.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0145 = function() {
      return isa.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0146 = function() {
      return isa.optional.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0147 = function() {
      return validate.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0148 = function() {
      return validate.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0149 = function() {
      return validate.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0150 = function() {
      return validate.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0151 = function() {
      return validate.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0152 = function() {
      return validate.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0153 = function() {
      return validate.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_0154 = function() {
      return validate.optional.quux(3, 4);
    }), /unknown type 'quux'/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_optional_is_declared = function(T, done) {
    var INTERTYPE, Ω_intertype_0155;
    INTERTYPE = require('../../../apps/intertype');
    throws2(T, (Ω_intertype_0155 = function() {
      return new INTERTYPE.Intertype_minimal({
        optional: (function(x) {
          return true;
        })
      });
    }), /not allowed to re-declare type 'optional'/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_wrong_type_of_isa_test_declared = function(T, done) {
    var Intertype, Ω_intertype_0156, Ω_intertype_0157, Ω_intertype_0158, Ω_intertype_0159, Ω_intertype_0160, Ω_intertype_0161, Ω_intertype_0162, Ω_intertype_0163, Ω_intertype_0164, Ω_intertype_0165;
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    throws2(T, (Ω_intertype_0156 = function() {
      return new Intertype({
        foo: (function() {})
      });
    }), /expected function with 1 parameters, got one with 0/);
    throws2(T, (Ω_intertype_0157 = function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_0158 = function() {
      return new Intertype({
        foo: true
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_0159 = function() {
      return new Intertype({
        foo: void 0
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_0160 = function() {
      return new Intertype({
        foo: null
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_0161 = function() {
      return new Intertype({
        foo: {}
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_0162 = function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_0163 = function() {
      return new Intertype({
        foo: {
          test: false
        }
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_0164 = function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_0165 = function() {
      return new Intertype({
        foo: 'quux'
      });
    }), /unknown type 'quux'/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allow_declaration_objects = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_0166, Ω_intertype_0167, Ω_intertype_0168, Ω_intertype_0169;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      types = new Intertype_minimal(declarations);
      eq2(T, (Ω_intertype_0166 = function() {
        return TMP_types.isa.function(types.isa.integer);
      }), true);
      eq2(T, (Ω_intertype_0167 = function() {
        return types.isa.integer.length;
      }), 1);
      eq2(T, (Ω_intertype_0168 = function() {
        return types.isa.integer(123);
      }), true);
      eq2(T, (Ω_intertype_0169 = function() {
        return types.isa.integer(123.456);
      }), false);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.create_entries_must_be_sync_functions = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, Ω_intertype_0170;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: async function() {
          return (await 0);
        }
      };
      throws2(T, (Ω_intertype_0170 = function() {
        return new Intertype_minimal(declarations);
      }), /expected a function for `create` entry of type 'integer', got a asyncfunction/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.template_methods_must_be_nullary = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, Ω_intertype_0171;
      declarations = {...sample_declarations};
      declarations.foolist = {
        test: function(x) {
          return true;
        },
        template: function(n) {
          return [n];
        }
      };
      throws2(T, (Ω_intertype_0171 = function() {
        return new Intertype_minimal(declarations);
      }), /template method for type 'foolist' has arity 1 but must be nullary/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_knows_its_base_types = function(T, done) {
    var isa, Ω_intertype_0172, Ω_intertype_0173, Ω_intertype_0174, Ω_intertype_0175, Ω_intertype_0176, Ω_intertype_0177, Ω_intertype_0178, Ω_intertype_0179, Ω_intertype_0180, Ω_intertype_0181, Ω_intertype_0182, Ω_intertype_0183, Ω_intertype_0184, Ω_intertype_0185, Ω_intertype_0186;
    ({isa} = require('../../../apps/intertype'));
    //.........................................................................................................
    eq2(T, (Ω_intertype_0172 = function() {
      return isa.basetype('optional');
    }), false);
    eq2(T, (Ω_intertype_0173 = function() {
      return isa.basetype('anything');
    }), true);
    eq2(T, (Ω_intertype_0174 = function() {
      return isa.basetype('nothing');
    }), true);
    eq2(T, (Ω_intertype_0175 = function() {
      return isa.basetype('something');
    }), true);
    eq2(T, (Ω_intertype_0176 = function() {
      return isa.basetype('null');
    }), true);
    eq2(T, (Ω_intertype_0177 = function() {
      return isa.basetype('undefined');
    }), true);
    eq2(T, (Ω_intertype_0178 = function() {
      return isa.basetype('unknown');
    }), true);
    eq2(T, (Ω_intertype_0179 = function() {
      return isa.basetype('integer');
    }), false);
    eq2(T, (Ω_intertype_0180 = function() {
      return isa.basetype('float');
    }), false);
    eq2(T, (Ω_intertype_0181 = function() {
      return isa.basetype('basetype');
    }), false);
    eq2(T, (Ω_intertype_0182 = function() {
      return isa.basetype('quux');
    }), false);
    eq2(T, (Ω_intertype_0183 = function() {
      return isa.basetype('toString');
    }), false);
    eq2(T, (Ω_intertype_0184 = function() {
      return isa.basetype(null);
    }), false);
    eq2(T, (Ω_intertype_0185 = function() {
      return isa.basetype(void 0);
    }), false);
    eq2(T, (Ω_intertype_0186 = function() {
      return isa.basetype(4);
    }), false);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_licensed_overrides = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_0187, Ω_intertype_0188, Ω_intertype_0189, Ω_intertype_0190;
      types = new Intertype();
      eq2(T, (Ω_intertype_0187 = function() {
        return types.isa.float(4);
      }), true);
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
      throws2(T, (Ω_intertype_0188 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_0189 = function() {
        return types.isa.float(4);
      }), true);
      eq2(T, (Ω_intertype_0190 = function() {
        return types.isa.float('float');
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_0191, Ω_intertype_0192;
      types = new Intertype();
      eq2(T, (Ω_intertype_0191 = function() {
        return types.isa.float(4);
      }), true);
      //.......................................................................................................
      overrides = {
        float: {
          override: true,
          test: function(x) {
            return x === 'float';
          }
        }
      };
      throws2(T, (Ω_intertype_0192 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_0193, Ω_intertype_0194, Ω_intertype_0195, Ω_intertype_0196;
      types = new Intertype();
      eq2(T, (Ω_intertype_0193 = function() {
        return types.isa.float(4);
      }), true);
      //.......................................................................................................
      overrides = {
        anything: {
          override: true,
          test: function(x) {
            return true;
          }
        }
      };
      throws2(T, (Ω_intertype_0194 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare basetype 'anything'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_0195 = function() {
        return types.isa.anything(4);
      }), true);
      eq2(T, (Ω_intertype_0196 = function() {
        return types.isa.anything('float');
      }), true);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_create_types_with_templates_and_create = function(T, done) {
    var Intertype, Intertype_minimal;
    ({Intertype, Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_0197, Ω_intertype_0198, Ω_intertype_0199, Ω_intertype_0200, Ω_intertype_0201, Ω_intertype_0202, Ω_intertype_0203, Ω_intertype_0204, Ω_intertype_0205, Ω_intertype_0206;
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
      eq2(T, (Ω_intertype_0197 = function() {
        return TMP_types.isa.object(types.declarations);
      }), true);
      eq2(T, (Ω_intertype_0198 = function() {
        return TMP_types.isa.object(types.declarations.float);
      }), true);
      eq2(T, (Ω_intertype_0199 = function() {
        return TMP_types.isa.object(types.declarations.text);
      }), true);
      //.......................................................................................................
      throws2(T, (Ω_intertype_0200 = function() {
        return types.create.boolean();
      }), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/);
      throws2(T, (Ω_intertype_0201 = function() {
        return types.create.text('foo');
      }), /expected 0 arguments, got 1/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0202 = function() {
        return types.create.text();
      }), '');
      eq2(T, (Ω_intertype_0203 = function() {
        return types.create.integer();
      }), 0);
      eq2(T, (Ω_intertype_0204 = function() {
        return types.create.float();
      }), 0);
      eq2(T, (Ω_intertype_0205 = function() {
        return types.create.float('123.45');
      }), 123.45);
      throws2(T, (Ω_intertype_0206 = function() {
        return types.create.float('***');
      }), /expected `create\.float\(\)` to return a float but it returned a nan/);
      //.......................................................................................................
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_0207;
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
      eq2(T, (Ω_intertype_0207 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_0208, Ω_intertype_0209, Ω_intertype_0210, Ω_intertype_0211;
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
      eq2(T, (Ω_intertype_0208 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_0209 = function() {
        return create.quantity({
          q: 123
        });
      }), {
        q: 123,
        u: 'u'
      });
      eq2(T, (Ω_intertype_0210 = function() {
        return create.quantity({
          u: 'kg'
        });
      }), {
        q: 0,
        u: 'kg'
      });
      eq2(T, (Ω_intertype_0211 = function() {
        return create.quantity({
          u: 'kg',
          foo: 'bar'
        });
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
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, type_of, types, Ω_intertype_0212, Ω_intertype_0213, Ω_intertype_0214, Ω_intertype_0215, Ω_intertype_0216, Ω_intertype_0217, Ω_intertype_0218, Ω_intertype_0219, Ω_intertype_0220, Ω_intertype_0221, Ω_intertype_0222, Ω_intertype_0223;
      types = new Intertype();
      ({create, type_of} = types);
      eq2(T, (Ω_intertype_0212 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_0213 = function() {
        return create.boolean();
      }), false);
      eq2(T, (Ω_intertype_0214 = function() {
        return create.object();
      }), {});
      eq2(T, (Ω_intertype_0215 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_0216 = function() {
        return create.infinity();
      }), 2e308);
      eq2(T, (Ω_intertype_0217 = function() {
        return create.text();
      }), '');
      eq2(T, (Ω_intertype_0218 = function() {
        return create.list();
      }), []);
      eq2(T, (Ω_intertype_0219 = function() {
        return create.regex();
      }), new RegExp());
      eq2(T, (Ω_intertype_0220 = function() {
        return type_of(create.function());
      }), 'function');
      eq2(T, (Ω_intertype_0221 = function() {
        return type_of(create.asyncfunction());
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_0222 = function() {
        return type_of(create.symbol());
      }), 'symbol');
      throws2(T, (Ω_intertype_0223 = function() {
        return create.basetype();
      }), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.template_functions_are_called_in_template_fields = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declarations, declare, isa, type_of, types, Ω_intertype_0224, Ω_intertype_0225, Ω_intertype_0226, Ω_intertype_0227;
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
      eq2(T, (Ω_intertype_0224 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_0225 = function() {
        return isa.quantity({
          q: 9
        });
      }), false);
      eq2(T, (Ω_intertype_0226 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_0227 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declare, type_of, types, Ω_intertype_0228;
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
      eq2(T, (Ω_intertype_0228 = function() {
        return create.foo();
      }), {
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
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declarations, declare, isa, type_of, types, Ω_intertype_0229, Ω_intertype_0230, Ω_intertype_0231, Ω_intertype_0232, Ω_intertype_0233;
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
      eq2(T, (Ω_intertype_0229 = function() {
        return type_of(declarations.quantity.test);
      }), 'function');
      debug('^342342^', declarations.quantity);
      eq2(T, (Ω_intertype_0230 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_0231 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      eq2(T, (Ω_intertype_0232 = function() {
        return isa.quantity({
          q: 987,
          u: 's'
        });
      }), true);
      eq2(T, (Ω_intertype_0233 = function() {
        return isa.quantity({
          q: 987
        });
      }), false);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_minimal_has_only_base_types = function(T, done) {
    var Intertype_minimal, types, Ω_intertype_0234, Ω_intertype_0235;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    types = new Intertype_minimal();
    eq2(T, (Ω_intertype_0234 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown']);
    types.declare({
      z: (function(x) {})
    });
    eq2(T, (Ω_intertype_0235 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z']);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_type_name_for_test = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0236, Ω_intertype_0237, Ω_intertype_0238, Ω_intertype_0239, Ω_intertype_0240, Ω_intertype_0241, Ω_intertype_0242, Ω_intertype_0243;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: 'quux', }
      throws2(T, (Ω_intertype_0236 = function() {
        return types.declare({
          z: 'quux'
        });
      }), /unknown type 'quux'/);
      types.declare({
        z: 'float'
      });
      eq2(T, (Ω_intertype_0237 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_0238 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_0239 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_0240 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_0241 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_0242 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_0243 = function() {
        return types.declarations.z.test.name;
      }), 'z'); // ?
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0244, Ω_intertype_0245, Ω_intertype_0246, Ω_intertype_0247, Ω_intertype_0248, Ω_intertype_0249, Ω_intertype_0250, Ω_intertype_0251;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: { test: 'quux', }, }
      throws2(T, (Ω_intertype_0244 = function() {
        return types.declare({
          z: {
            test: 'quux'
          }
        });
      }), /unknown type 'quux'/);
      types.declare({
        z: {
          test: 'float'
        }
      });
      eq2(T, (Ω_intertype_0245 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_0246 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_0247 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_0248 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_0249 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_0250 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_0251 = function() {
        return types.declarations.z.test.name;
      }), 'z');
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_dotted_type = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0252, Ω_intertype_0253, Ω_intertype_0254, Ω_intertype_0255, Ω_intertype_0256, Ω_intertype_0257, Ω_intertype_0258, Ω_intertype_0259, Ω_intertype_0260;
      types = new Intertype();
      eq2(T, (Ω_intertype_0252 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), false);
      types.declare({
        foo: 'object'
      });
      eq2(T, (Ω_intertype_0253 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), true);
      eq2(T, (Ω_intertype_0254 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), false);
      types.declare({
        'foo.bar': 'object'
      });
      eq2(T, (Ω_intertype_0255 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), true);
      eq2(T, (Ω_intertype_0256 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), false);
      types.declare({
        'foo.bar.baz': 'float'
      });
      eq2(T, (Ω_intertype_0257 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), true);
      eq2(T, (Ω_intertype_0258 = function() {
        return types.isa.foo.bar.baz(null);
      }), false);
      eq2(T, (Ω_intertype_0259 = function() {
        return types.isa.foo.bar.baz(4);
      }), true);
      eq2(T, (Ω_intertype_0260 = function() {
        return types.isa.foo.bar.baz(+2e308);
      }), false);
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
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0270, Ω_intertype_0271, Ω_intertype_0272, Ω_intertype_0273, Ω_intertype_0274, Ω_intertype_0275, Ω_intertype_0276, Ω_intertype_0277, Ω_intertype_0278, Ω_intertype_0279, Ω_intertype_0280, Ω_intertype_0281;
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
      eq2(T, (Ω_intertype_0270 = function() {
        return types.isa['quantity.q'];
      }), types.declarations['quantity'].sub_tests['q']);
      eq2(T, (Ω_intertype_0271 = function() {
        return types.isa['quantity.q'];
      }), types.isa.quantity.q);
      // debug '^409-1^', types.declarations
      eq2(T, (Ω_intertype_0272 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_0273 = function() {
        return types.isa.quantity({
          q: {}
        });
      }), false);
      eq2(T, (Ω_intertype_0274 = function() {
        return types.isa.quantity({
          q: 3
        });
      }), false);
      eq2(T, (Ω_intertype_0275 = function() {
        return types.isa.quantity({
          q: 3,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_0276 = function() {
        return types.isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_0277 = function() {
        return types.isa.quantity.q(3.1);
      }), true);
      eq2(T, (Ω_intertype_0278 = function() {
        return types.isa.quantity.q('3.1');
      }), false);
      eq2(T, (Ω_intertype_0279 = function() {
        return types.isa.quantity.u('m');
      }), true);
      eq2(T, (Ω_intertype_0280 = function() {
        return types.isa.quantity.u(null);
      }), false);
      eq2(T, (Ω_intertype_0281 = function() {
        return types.isa.quantity.u(3);
      }), false);
      debug('^433-1^', types.declarations['quantity']);
      debug('^433-1^', types.declarations['quantity.q']);
      debug('^433-1^', types.declarations['quantity.u']);
      return null;
    })();
    (() => {      //.........................................................................................................
      var f, k, types, Ω_intertype_0282, Ω_intertype_0283, Ω_intertype_0284, Ω_intertype_0285, Ω_intertype_0286, Ω_intertype_0287, Ω_intertype_0288, Ω_intertype_0289, Ω_intertype_0290, Ω_intertype_0291, Ω_intertype_0292, Ω_intertype_0293, Ω_intertype_0294, Ω_intertype_0295, Ω_intertype_0296, Ω_intertype_0297, Ω_intertype_0298;
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
      eq2(T, (Ω_intertype_0282 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_0283 = function() {
        return types.isa.person.address.city.name(1234);
      }), false);
      eq2(T, (Ω_intertype_0284 = function() {
        return types.isa.person(1234);
      }), false);
      eq2(T, (Ω_intertype_0285 = function() {
        return types.isa.person({
          name: 'Bob'
        });
      }), false);
      eq2(T, (Ω_intertype_0286 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {}
        });
      }), false);
      eq2(T, (Ω_intertype_0287 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {}
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0288 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0289 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P',
              postcode: 'SO36'
            }
          }
        });
      }), true);
      eq2(T, (Ω_intertype_0290 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_0291 = function() {
        return types.isa.person.address.city.postcode('SO36');
      }), true);
      eq2(T, (Ω_intertype_0292 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_0293 = function() {
        return types.isa.person.address({
          city: {
            name: 'P',
            postcode: 'SO36'
          }
        });
      }), true);
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
      eq2(T, (Ω_intertype_0294 = function() {
        return Object.keys(types.declarations['person'].sub_tests);
      }), ['name', 'address']);
      eq2(T, (Ω_intertype_0295 = function() {
        return Object.keys(types.declarations['person.address'].sub_tests);
      }), ['city']);
      eq2(T, (Ω_intertype_0296 = function() {
        return Object.keys(types.declarations['person.address.city'].sub_tests);
      }), ['name', 'postcode']);
      eq2(T, (Ω_intertype_0297 = function() {
        return types.declarations['person'].sub_tests !== types.declarations['person.address'].sub_tests;
      }), true);
      eq2(T, (Ω_intertype_0298 = function() {
        return types.declarations['person'].sub_tests !== types.declarations['person.address.city'].sub_tests;
      }), true);
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
        var d, Ω_intertype_0299;
        d = 3;
        // d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
        eq2(T, (Ω_intertype_0299 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      (() => {
        var d, Ω_intertype_0300, Ω_intertype_0301;
        d = new Number(3);
        d.bar = '?';
        eq2(T, (Ω_intertype_0300 = function() {
          return d.bar;
        }), '?');
        // still won't work b/c `float` doesn't accept objects (which is a good thing):
        eq2(T, (Ω_intertype_0301 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0302, Ω_intertype_0303;
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
      eq2(T, (Ω_intertype_0302 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_0303 = function() {
        return types.isa.foo({
          bind: 1,
          apply: 2,
          call: 3,
          name: 4,
          length: 5
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0304, Ω_intertype_0305;
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
      eq2(T, (Ω_intertype_0304 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_0305 = function() {
        return types.isa.foo({
          text: 1,
          float: 2
        });
      }), true);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_refs_to_dotted_types = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0306, Ω_intertype_0307, Ω_intertype_0308, Ω_intertype_0309, Ω_intertype_0310, Ω_intertype_0311;
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
      eq2(T, (Ω_intertype_0306 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_0307 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_0308 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_0309 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_0310 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_0311 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0312, Ω_intertype_0313, Ω_intertype_0314, Ω_intertype_0315, Ω_intertype_0316, Ω_intertype_0317;
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
      eq2(T, (Ω_intertype_0312 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_0313 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_0314 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_0315 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_0316 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_0317 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_0318, Ω_intertype_0319, Ω_intertype_0320, Ω_intertype_0321, Ω_intertype_0322, Ω_intertype_0323, Ω_intertype_0324, Ω_intertype_0325, Ω_intertype_0326;
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
      eq2(T, (Ω_intertype_0318 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_0319 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_0320 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_0321 = function() {
        return types.isa.optional.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_0322 = function() {
        return types.isa.optional.person.address.city(null);
      }), true);
      eq2(T, (Ω_intertype_0323 = function() {
        return types.isa.optional.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_0324 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_0325 = function() {
        return types.isa.mycity(null);
      }), true);
      eq2(T, (Ω_intertype_0326 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
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
  //     eq2 T, ( Ω_intertype_0327 = -> isa.float       null  ), false
  //     eq2 T, ( Ω_intertype_0328 = -> isa.float       true  ), false
  //     eq2 T, ( Ω_intertype_0329 = -> isa.float       0     ), true
  //     eq2 T, ( Ω_intertype_0330 = -> isa.maybefloat1 null  ), true
  //     eq2 T, ( Ω_intertype_0331 = -> isa.maybefloat1 true  ), false
  //     eq2 T, ( Ω_intertype_0332 = -> isa.maybefloat1 0     ), true
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
  //     eq2 T, ( Ω_intertype_0333 = -> isa.q             null                    ), false
  //     eq2 T, ( Ω_intertype_0334 = -> isa.q             {}                      ), true
  //     eq2 T, ( Ω_intertype_0335 = -> isa.q             { maybefloat2: null }   ), true
  //     eq2 T, ( Ω_intertype_0336 = -> isa.q             { maybefloat2: false }  ), false
  //     eq2 T, ( Ω_intertype_0337 = -> isa.q             { maybefloat2: 3 }      ), true
  //     eq2 T, ( Ω_intertype_0338 = -> isa.q.maybefloat2  null                   ), true
  //     eq2 T, ( Ω_intertype_0339 = -> isa.q.maybefloat2  true                   ), false
  //     eq2 T, ( Ω_intertype_0340 = -> isa.q.maybefloat2  0                      ), true
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
  //     safeguard T, => eq2 T, ( Ω_intertype_0341 = -> isa.q             null                    ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_0342 = -> isa.q             {}                      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_0343 = -> isa.q             { maybefloat3: null }   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_0344 = -> isa.q             { maybefloat3: false }  ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_0345 = -> isa.q             { maybefloat3: 3 }      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_0346 = -> isa.q.maybefloat3  null                   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_0347 = -> isa.q.maybefloat3  true                   ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_0348 = -> isa.q.maybefloat3  0                      ), true
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
  //     eq2 T, ( Ω_intertype_0349 = -> isa.person        null                                                            ), false
  //     eq2 T, ( Ω_intertype_0350 = -> isa.person        {}                                                              ), false
  //     eq2 T, ( Ω_intertype_0351 = -> isa.person        { name: 'Fred',                                               } ), false
  //     eq2 T, ( Ω_intertype_0352 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
  //     eq2 T, ( Ω_intertype_0353 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     eq2 T, ( Ω_intertype_0354 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
  //     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
  //     eq2 T, ( Ω_intertype_0355 = -> isa.maybesomeone  null                                                            ), true
  //     # eq2 T, ( Ω_intertype_0356 = -> isa.maybesomeone  {}                                                              ), false
  //     # eq2 T, ( Ω_intertype_0357 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
  //     # eq2 T, ( Ω_intertype_0358 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
  //     # eq2 T, ( Ω_intertype_0359 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     # eq2 T, ( Ω_intertype_0360 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this.forbidden_to_define_fields_on_basetypes = async function(T, done) {
    var Intertype, declarations;
    ({Intertype, declarations} = require('../../../apps/intertype'));
    await (() => {      //.........................................................................................................
      var declare, isa, types, validate, Ω_intertype_0361, Ω_intertype_0362, Ω_intertype_0363, Ω_intertype_0364, Ω_intertype_0365, Ω_intertype_0366, Ω_intertype_0367;
      types = new Intertype();
      ({declare, validate, isa} = types);
      throws2(T, (Ω_intertype_0361 = function() {
        return types.declare({
          'optional.d': (function(x) {})
        });
      }), /illegal use of 'optional' in declaration of type 'optional.d'/);
      throws2(T, (Ω_intertype_0362 = function() {
        return types.declare({
          'anything.d': (function(x) {})
        });
      }), /illegal use of basetype 'anything' in declaration of type 'anything.d'/);
      throws2(T, (Ω_intertype_0363 = function() {
        return types.declare({
          'nothing.d': (function(x) {})
        });
      }), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/);
      throws2(T, (Ω_intertype_0364 = function() {
        return types.declare({
          'something.d': (function(x) {})
        });
      }), /illegal use of basetype 'something' in declaration of type 'something.d'/);
      throws2(T, (Ω_intertype_0365 = function() {
        return types.declare({
          'null.d': (function(x) {})
        });
      }), /illegal use of basetype 'null' in declaration of type 'null.d'/);
      throws2(T, (Ω_intertype_0366 = function() {
        return types.declare({
          'undefined.d': (function(x) {})
        });
      }), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/);
      throws2(T, (Ω_intertype_0367 = function() {
        return types.declare({
          'unknown.d': (function(x) {})
        });
      }), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.internal_type_of_method = function(T, done) {
    var Intertype, __type_of, _isa, declaration, declarations, type;
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
      var types, Ω_intertype_0368, Ω_intertype_0369, Ω_intertype_0370, Ω_intertype_0371, Ω_intertype_0372, Ω_intertype_0373, Ω_intertype_0374, Ω_intertype_0375, Ω_intertype_0376;
      types = new Intertype();
      eq2(T, (Ω_intertype_0368 = function() {
        return __type_of(_isa, null);
      }), 'null');
      eq2(T, (Ω_intertype_0369 = function() {
        return __type_of(_isa, void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_0370 = function() {
        return __type_of(_isa, 4);
      }), 'float');
      eq2(T, (Ω_intertype_0371 = function() {
        return __type_of(_isa, function() {});
      }), 'function');
      eq2(T, (Ω_intertype_0372 = function() {
        return __type_of(_isa, async function() {
          return (await null);
        });
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_0373 = function() {
        return __type_of(_isa, {});
      }), 'object');
      eq2(T, (Ω_intertype_0374 = function() {
        return __type_of(_isa, []);
      }), 'list');
      eq2(T, (Ω_intertype_0375 = function() {
        return __type_of(_isa, +2e308);
      }), 'infinity');
      eq2(T, (Ω_intertype_0376 = function() {
        return __type_of(_isa, -2e308);
      }), 'infinity');
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.deepmerge = function(T, done) {
    var Intertype, declarations, deepmerge;
    ({Intertype, declarations, deepmerge} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var probe, result, sub, Ω_intertype_0377, Ω_intertype_0378, Ω_intertype_0379, Ω_intertype_0380, Ω_intertype_0381, Ω_intertype_0382;
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
      eq2(T, (Ω_intertype_0377 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_0378 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_0379 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_0380 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_0381 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_0382 = function() {
        return probe.bar.baz.sub === sub;
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var probe, result, sub, types, Ω_intertype_0383, Ω_intertype_0384, Ω_intertype_0385, Ω_intertype_0386, Ω_intertype_0387, Ω_intertype_0388;
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
      eq2(T, (Ω_intertype_0383 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_0384 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_0385 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_0386 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_0387 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_0388 = function() {
        return probe.bar.baz.sub === sub;
      }), true);
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
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, validate, Ω_intertype_0389, Ω_intertype_0390, Ω_intertype_0391, Ω_intertype_0392, Ω_intertype_0393, Ω_intertype_0394, Ω_intertype_0395, Ω_intertype_0396, Ω_intertype_0397, Ω_intertype_0398, Ω_intertype_0399, Ω_intertype_0400, Ω_intertype_0401, Ω_intertype_0402, Ω_intertype_0403;
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
      throws2(T, (Ω_intertype_0389 = function() {
        return validate.person(null);
      }), /expected a person, got a null/);
      throws2(T, (Ω_intertype_0390 = function() {
        return validate.person.address(null);
      }), /expected a person.address, got a null/);
      throws2(T, (Ω_intertype_0391 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city, got a null/);
      throws2(T, (Ω_intertype_0392 = function() {
        return validate.person.address.city.postcode(null);
      }), /expected a person.address.city.postcode, got a null/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0393 = function() {
        return types.isa.person.address.city.postcode(3);
      }), false);
      throws2(T, (Ω_intertype_0394 = function() {
        return validate.person.address.city.postcode(3);
      }), /expected a person.address.city.postcode/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0395 = function() {
        return types.isa.person.address.city({
          name: 'P'
        });
      }), false);
      throws2(T, (Ω_intertype_0396 = function() {
        return validate.person.address.city({
          name: 'P'
        });
      }), /expected a person.address.city/);
      // #.......................................................................................................
      eq2(T, (Ω_intertype_0397 = function() {
        return types.isa.person.address.city({
          postcode: '3421'
        });
      }), false);
      throws2(T, (Ω_intertype_0398 = function() {
        return validate.person.address.city();
      }), /method 'validate.person.address.city' expects 1 arguments, got 0/);
      throws2(T, (Ω_intertype_0399 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_0400 = function() {
        return validate.person.address.city('3421');
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_0401 = function() {
        return validate.person.address.city({
          postcode: '3421'
        });
      }), /expected a person.address.city/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0402 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: '3421'
        });
      }), true);
      eq2(T, (Ω_intertype_0403 = function() {
        return validate.person.address.city({
          name: 'P',
          postcode: '3421'
        });
      }), {
        name: 'P',
        postcode: '3421'
      });
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_evaluate = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var evaluate, isa, types, validate, Ω_intertype_0404, Ω_intertype_0405, Ω_intertype_0406, Ω_intertype_0407, Ω_intertype_0408, Ω_intertype_0409, Ω_intertype_0410, Ω_intertype_0411, Ω_intertype_0412, Ω_intertype_0413, Ω_intertype_0414, Ω_intertype_0415, Ω_intertype_0416, Ω_intertype_0417;
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
      throws2(T, (Ω_intertype_0404 = function() {
        return evaluate.optional(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      throws2(T, (Ω_intertype_0405 = function() {
        return evaluate.optional.person(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0406 = function() {
        return isa.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), true);
      eq2(T, (Ω_intertype_0407 = function() {
        return evaluate.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), {
        person: true,
        'person.name': true,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      //.......................................................................................................
      eq2(T, (Ω_intertype_0408 = function() {
        return isa.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0409 = function() {
        return evaluate.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), {
        person: false,
        'person.name': true,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': true,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq2(T, (Ω_intertype_0410 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0411 = function() {
        return evaluate.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': true,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq2(T, (Ω_intertype_0412 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0413 = function() {
        return evaluate.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), {
        person: false,
        'person.name': false,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      //.......................................................................................................
      eq2(T, (Ω_intertype_0414 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_0415 = function() {
        return evaluate.person(null);
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      //.......................................................................................................
      eq2(T, (Ω_intertype_0416 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_0417 = function() {
        return evaluate.person({});
      }), {
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
      var evaluate, isa, types, validate, Ω_intertype_0418, Ω_intertype_0419, Ω_intertype_0420, Ω_intertype_0421, Ω_intertype_0422, Ω_intertype_0423, Ω_intertype_0424, Ω_intertype_0425, Ω_intertype_0426, Ω_intertype_0427, Ω_intertype_0428, Ω_intertype_0429, Ω_intertype_0430, Ω_intertype_0431, Ω_intertype_0432;
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
      eq2(T, (Ω_intertype_0418 = function() {
        return isa.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), true);
      eq2(T, (Ω_intertype_0419 = function() {
        return evaluate.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), {
        person: true,
        'person.name': true,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq2(T, (Ω_intertype_0420 = function() {
        return Object.keys(evaluate.person({
          name: 'Alice',
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        }));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0421 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_0422 = function() {
        return evaluate.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), {
        person: false,
        'person.name': false,
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq2(T, (Ω_intertype_0423 = function() {
        return Object.keys(evaluate.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        }));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0424 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_0425 = function() {
        return evaluate.person(null);
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_0426 = function() {
        return Object.keys(evaluate.person(null));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0427 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_0428 = function() {
        return evaluate.person({});
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_0429 = function() {
        return Object.keys(evaluate.person({}));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0430 = function() {
        return isa.person.address({
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        });
      }), true);
      eq2(T, (Ω_intertype_0431 = function() {
        return evaluate.person.address({
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        });
      }), {
        'person.address': true,
        'person.address.city': true,
        'person.address.city.name': true,
        'person.address.city.postcode': true
      });
      eq2(T, (Ω_intertype_0432 = function() {
        return Object.keys(evaluate.person.address({
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        }));
      }), ['person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name']);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.walk_prefixes = function(T, done) {
    var isa, type_of, walk_prefixes;
    ({walk_prefixes, isa, type_of} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var Ω_intertype_0433, Ω_intertype_0434, Ω_intertype_0435, Ω_intertype_0436, Ω_intertype_0437, Ω_intertype_0438;
      eq2(T, (Ω_intertype_0433 = function() {
        return isa.generatorfunction(walk_prefixes);
      }), true);
      eq2(T, (Ω_intertype_0434 = function() {
        return [...(walk_prefixes('one'))];
      }), []);
      eq2(T, (Ω_intertype_0435 = function() {
        return [...(walk_prefixes('one.two'))];
      }), ['one']);
      eq2(T, (Ω_intertype_0436 = function() {
        return [...(walk_prefixes('one.two.three'))];
      }), ['one', 'one.two']);
      eq2(T, (Ω_intertype_0437 = function() {
        return [...(walk_prefixes('one.two.three.four'))];
      }), ['one', 'one.two', 'one.two.three']);
      /* TAINT should not allow empty namers: */
      eq2(T, (Ω_intertype_0438 = function() {
        return [...(walk_prefixes('.one.two.three'))];
      }), ['', '.one', '.one.two']);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_namespaces = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, Ω_intertype_0439;
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
      throws2(T, (Ω_intertype_0439 = function() {
        var types;
        return types = new Intertype(declarations);
      }), /unknown partial type 'foo'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_0440, Ω_intertype_0441, Ω_intertype_0442, Ω_intertype_0443, Ω_intertype_0444, Ω_intertype_0445;
      declarations = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text'
      };
      types = new Intertype(declarations);
      eq2(T, (Ω_intertype_0440 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_0441 = function() {
        return types.isa.quantity({
          q: 12,
          u: 'kg'
        });
      }), true);
      eq2(T, (Ω_intertype_0442 = function() {
        return types.isa['quantity.q'](12);
      }), true);
      eq2(T, (Ω_intertype_0443 = function() {
        return types.isa['quantity.u']('kg');
      }), true);
      eq2(T, (Ω_intertype_0444 = function() {
        return types.isa.quantity.q(12);
      }), true);
      eq2(T, (Ω_intertype_0445 = function() {
        return types.isa.quantity.u('kg');
      }), true);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_qualifiers = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, Ω_intertype_0446, Ω_intertype_0447, Ω_intertype_0448, Ω_intertype_0449, Ω_intertype_0450, Ω_intertype_0451, Ω_intertype_0452, Ω_intertype_0453, Ω_intertype_0454, Ω_intertype_0455, Ω_intertype_0456, Ω_intertype_0457, Ω_intertype_0458;
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
      types = new Intertype_minimal(sample_declarations, declarations);
      ({isa} = types);
      eq2(T, (Ω_intertype_0446 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0447 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0448 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0449 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0450 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0451 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0452 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0453 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0454 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0455 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0456 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0457 = function() {
        return isa.nonempty.text(4);
      }), false);
      /* this doesn't make a terrible lot of sense: */
      eq2(T, (Ω_intertype_0458 = function() {
        return isa.empty({
          list: [],
          text: '',
          set: new Set()
        });
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_0459, Ω_intertype_0460, Ω_intertype_0461, Ω_intertype_0462, Ω_intertype_0463, Ω_intertype_0464, Ω_intertype_0465, Ω_intertype_0466, Ω_intertype_0467, Ω_intertype_0468, Ω_intertype_0469, Ω_intertype_0470, Ω_intertype_0471, Ω_intertype_0472, Ω_intertype_0473, Ω_intertype_0474, Ω_intertype_0475, Ω_intertype_0476, Ω_intertype_0477, Ω_intertype_0478, Ω_intertype_0479, Ω_intertype_0480, Ω_intertype_0481, Ω_intertype_0482;
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
      types = new Intertype_minimal(sample_declarations, declarations);
      ({isa, validate} = types);
      eq2(T, (Ω_intertype_0459 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0460 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0461 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0462 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0463 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0464 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0465 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0466 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0467 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0468 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0469 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0470 = function() {
        return isa.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0471 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0472 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_0473 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0474 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0475 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0476 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0477 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_0478 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_0479 = function() {
        return validate.empty(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_0480 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_0481 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_0482 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_optional_with_qualifiers = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_0483, Ω_intertype_0484, Ω_intertype_0485, Ω_intertype_0486, Ω_intertype_0487, Ω_intertype_0488, Ω_intertype_0489, Ω_intertype_0490, Ω_intertype_0491, Ω_intertype_0492, Ω_intertype_0493, Ω_intertype_0494, Ω_intertype_0495, Ω_intertype_0496, Ω_intertype_0497, Ω_intertype_0498, Ω_intertype_0499, Ω_intertype_0500, Ω_intertype_0501, Ω_intertype_0502, Ω_intertype_0503, Ω_intertype_0504, Ω_intertype_0505, Ω_intertype_0506, Ω_intertype_0507, Ω_intertype_0508, Ω_intertype_0509, Ω_intertype_0510, Ω_intertype_0511, Ω_intertype_0512, Ω_intertype_0513, Ω_intertype_0514, Ω_intertype_0515, Ω_intertype_0516, Ω_intertype_0517, Ω_intertype_0518, Ω_intertype_0519;
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
      types = new Intertype_minimal(sample_declarations, declarations);
      ({isa, validate} = types);
      eq2(T, (Ω_intertype_0483 = function() {
        return isa.optional.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0484 = function() {
        return isa.optional.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0485 = function() {
        return isa.optional.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0486 = function() {
        return isa.optional.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0487 = function() {
        return isa.optional.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0488 = function() {
        return isa.optional.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0489 = function() {
        return isa.optional.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0490 = function() {
        return isa.optional.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0491 = function() {
        return isa.optional.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0492 = function() {
        return isa.optional.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0493 = function() {
        return isa.optional.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0494 = function() {
        return isa.optional.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0495 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0496 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_0497 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0498 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0499 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0500 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0501 = function() {
        return validate.optional.empty([]);
      }), []);
      eq2(T, (Ω_intertype_0502 = function() {
        return validate.optional.empty('');
      }), '');
      eq2(T, (Ω_intertype_0503 = function() {
        return validate.optional.empty(new Set());
      }), new Set());
      eq2(T, (Ω_intertype_0504 = function() {
        return validate.optional.empty.list([]);
      }), []);
      eq2(T, (Ω_intertype_0505 = function() {
        return validate.optional.empty.text('');
      }), '');
      eq2(T, (Ω_intertype_0506 = function() {
        return validate.optional.empty.set(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_0507 = function() {
        return validate.optional.empty([1]);
      }), /expected an optional empty, got a list/);
      throws2(T, (Ω_intertype_0508 = function() {
        return validate.optional.empty('A');
      }), /expected an optional empty, got a text/);
      throws2(T, (Ω_intertype_0509 = function() {
        return validate.optional.empty(new Set('abc'));
      }), /expected an optional empty, got a set/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0510 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0511 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_0512 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0513 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0514 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0515 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      eq2(T, (Ω_intertype_0516 = function() {
        return validate.optional.empty(null);
      }), null);
      eq2(T, (Ω_intertype_0517 = function() {
        return validate.optional.empty.list(null);
      }), null);
      eq2(T, (Ω_intertype_0518 = function() {
        return validate.optional.empty.text(null);
      }), null);
      eq2(T, (Ω_intertype_0519 = function() {
        return validate.optional.empty.set(null);
      }), null);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_fields_to_declare_qualifiers = function(T, done) {
    var Intertype_minimal;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_0520, Ω_intertype_0521, Ω_intertype_0522, Ω_intertype_0523, Ω_intertype_0524, Ω_intertype_0525, Ω_intertype_0526, Ω_intertype_0527, Ω_intertype_0528, Ω_intertype_0529, Ω_intertype_0530, Ω_intertype_0531, Ω_intertype_0532, Ω_intertype_0533, Ω_intertype_0534, Ω_intertype_0535, Ω_intertype_0536, Ω_intertype_0537, Ω_intertype_0538, Ω_intertype_0539, Ω_intertype_0540, Ω_intertype_0541, Ω_intertype_0542, Ω_intertype_0543, Ω_intertype_0544, Ω_intertype_0545, Ω_intertype_0546, Ω_intertype_0547, Ω_intertype_0548, Ω_intertype_0549, Ω_intertype_0550, Ω_intertype_0551, Ω_intertype_0552, Ω_intertype_0553, Ω_intertype_0554, Ω_intertype_0555, Ω_intertype_0556, Ω_intertype_0557, Ω_intertype_0558, Ω_intertype_0559, Ω_intertype_0560, Ω_intertype_0561, Ω_intertype_0562, Ω_intertype_0563, Ω_intertype_0564, Ω_intertype_0565, Ω_intertype_0566, Ω_intertype_0567, Ω_intertype_0568, Ω_intertype_0569, Ω_intertype_0570, Ω_intertype_0571, Ω_intertype_0572, Ω_intertype_0573, Ω_intertype_0574, Ω_intertype_0575, Ω_intertype_0576, Ω_intertype_0577, Ω_intertype_0578, Ω_intertype_0579, Ω_intertype_0580, Ω_intertype_0581, Ω_intertype_0582, Ω_intertype_0583, Ω_intertype_0584, Ω_intertype_0585, Ω_intertype_0586, Ω_intertype_0587, Ω_intertype_0588, Ω_intertype_0589, Ω_intertype_0590, Ω_intertype_0591, Ω_intertype_0592, Ω_intertype_0593;
      declarations = {
        empty: {
          role: 'qualifier',
          fields: {
            list: function(x) {
              return (this.isa.list(x)) && (x.length === 0);
            },
            text: function(x) {
              return (this.isa.text(x)) && (x.length === 0);
            },
            set: function(x) {
              return (this.isa.set(x)) && (x.size === 0);
            }
          }
        },
        nonempty: {
          role: 'qualifier',
          fields: {
            list: function(x) {
              return (this.isa.list(x)) && (x.length > 0);
            },
            text: function(x) {
              return (this.isa.text(x)) && (x.length > 0);
            },
            set: function(x) {
              return (this.isa.set(x)) && (x.size > 0);
            }
          }
        }
      };
      //.......................................................................................................
      types = new Intertype_minimal(sample_declarations, declarations);
      ({isa, validate} = types);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0520 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0521 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0522 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0523 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0524 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0525 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0526 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0527 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0528 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0529 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0530 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0531 = function() {
        return isa.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0532 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0533 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_0534 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0535 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0536 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0537 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0538 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_0539 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_0540 = function() {
        return validate.empty(new Set());
      }), new Set());
      eq2(T, (Ω_intertype_0541 = function() {
        return validate.empty.list([]);
      }), []);
      eq2(T, (Ω_intertype_0542 = function() {
        return validate.empty.text('');
      }), '');
      eq2(T, (Ω_intertype_0543 = function() {
        return validate.empty.set(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_0544 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_0545 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_0546 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0547 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0548 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_0549 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0550 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0551 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0552 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      throws2(T, (Ω_intertype_0553 = function() {
        return validate.empty(null);
      }), /expected a empty, got a null/);
      throws2(T, (Ω_intertype_0554 = function() {
        return validate.empty.list(null);
      }), /expected a empty.list, got a null/);
      throws2(T, (Ω_intertype_0555 = function() {
        return validate.empty.text(null);
      }), /expected a empty.text, got a null/);
      throws2(T, (Ω_intertype_0556 = function() {
        return validate.empty.set(null);
      }), /expected a empty.set, got a null/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0557 = function() {
        return isa.optional.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0558 = function() {
        return isa.optional.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0559 = function() {
        return isa.optional.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0560 = function() {
        return isa.optional.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0561 = function() {
        return isa.optional.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0562 = function() {
        return isa.optional.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0563 = function() {
        return isa.optional.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0564 = function() {
        return isa.optional.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0565 = function() {
        return isa.optional.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0566 = function() {
        return isa.optional.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0567 = function() {
        return isa.optional.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0568 = function() {
        return isa.optional.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0569 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0570 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_0571 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0572 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0573 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0574 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0575 = function() {
        return validate.optional.empty([]);
      }), []);
      eq2(T, (Ω_intertype_0576 = function() {
        return validate.optional.empty('');
      }), '');
      eq2(T, (Ω_intertype_0577 = function() {
        return validate.optional.empty(new Set());
      }), new Set());
      eq2(T, (Ω_intertype_0578 = function() {
        return validate.optional.empty.list([]);
      }), []);
      eq2(T, (Ω_intertype_0579 = function() {
        return validate.optional.empty.text('');
      }), '');
      eq2(T, (Ω_intertype_0580 = function() {
        return validate.optional.empty.set(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_0581 = function() {
        return validate.optional.empty([1]);
      }), /expected an optional empty, got a list/);
      throws2(T, (Ω_intertype_0582 = function() {
        return validate.optional.empty('A');
      }), /expected an optional empty, got a text/);
      throws2(T, (Ω_intertype_0583 = function() {
        return validate.optional.empty(new Set('abc'));
      }), /expected an optional empty, got a set/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0584 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0585 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_0586 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0587 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0588 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0589 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      eq2(T, (Ω_intertype_0590 = function() {
        return validate.optional.empty(null);
      }), null);
      eq2(T, (Ω_intertype_0591 = function() {
        return validate.optional.empty.list(null);
      }), null);
      eq2(T, (Ω_intertype_0592 = function() {
        return validate.optional.empty.text(null);
      }), null);
      eq2(T, (Ω_intertype_0593 = function() {
        return validate.optional.empty.set(null);
      }), null);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.builtin_qualifiers = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var evaluate, isa, type_of, types, validate, Ω_intertype_0594, Ω_intertype_0595, Ω_intertype_0596, Ω_intertype_0597, Ω_intertype_0598, Ω_intertype_0599, Ω_intertype_0600, Ω_intertype_0601, Ω_intertype_0602, Ω_intertype_0603, Ω_intertype_0604, Ω_intertype_0605, Ω_intertype_0606, Ω_intertype_0607, Ω_intertype_0608, Ω_intertype_0609, Ω_intertype_0610, Ω_intertype_0611, Ω_intertype_0612, Ω_intertype_0613, Ω_intertype_0614, Ω_intertype_0615, Ω_intertype_0616, Ω_intertype_0617, Ω_intertype_0618, Ω_intertype_0619, Ω_intertype_0620, Ω_intertype_0621, Ω_intertype_0622, Ω_intertype_0623, Ω_intertype_0624, Ω_intertype_0625, Ω_intertype_0626, Ω_intertype_0627, Ω_intertype_0628, Ω_intertype_0629, Ω_intertype_0630, Ω_intertype_0631, Ω_intertype_0632, Ω_intertype_0633, Ω_intertype_0634, Ω_intertype_0635, Ω_intertype_0636, Ω_intertype_0637, Ω_intertype_0638, Ω_intertype_0639, Ω_intertype_0640, Ω_intertype_0641, Ω_intertype_0642, Ω_intertype_0643, Ω_intertype_0644, Ω_intertype_0645, Ω_intertype_0646, Ω_intertype_0647, Ω_intertype_0648, Ω_intertype_0649, Ω_intertype_0650, Ω_intertype_0651, Ω_intertype_0652, Ω_intertype_0653, Ω_intertype_0654, Ω_intertype_0655, Ω_intertype_0656, Ω_intertype_0657, Ω_intertype_0658, Ω_intertype_0659, Ω_intertype_0660, Ω_intertype_0661, Ω_intertype_0662, Ω_intertype_0663, Ω_intertype_0664, Ω_intertype_0665, Ω_intertype_0666, Ω_intertype_0667, Ω_intertype_0668, Ω_intertype_0669, Ω_intertype_0670, Ω_intertype_0671, Ω_intertype_0672, Ω_intertype_0673, Ω_intertype_0674, Ω_intertype_0675, Ω_intertype_0676, Ω_intertype_0677, Ω_intertype_0678, Ω_intertype_0679, Ω_intertype_0680, Ω_intertype_0681, Ω_intertype_0682, Ω_intertype_0683, Ω_intertype_0684, Ω_intertype_0685, Ω_intertype_0686, Ω_intertype_0687, Ω_intertype_0688, Ω_intertype_0689, Ω_intertype_0690, Ω_intertype_0691, Ω_intertype_0692, Ω_intertype_0693, Ω_intertype_0694, Ω_intertype_0695, Ω_intertype_0696, Ω_intertype_0697, Ω_intertype_0698, Ω_intertype_0699, Ω_intertype_0700, Ω_intertype_0701, Ω_intertype_0702, Ω_intertype_0703, Ω_intertype_0704, Ω_intertype_0705, Ω_intertype_0706, Ω_intertype_0707, Ω_intertype_0708, Ω_intertype_0709, Ω_intertype_0710, Ω_intertype_0711, Ω_intertype_0712, Ω_intertype_0713, Ω_intertype_0714, Ω_intertype_0715, Ω_intertype_0716, Ω_intertype_0717, Ω_intertype_0718, Ω_intertype_0719, Ω_intertype_0720, Ω_intertype_0721, Ω_intertype_0722, Ω_intertype_0723, Ω_intertype_0724, Ω_intertype_0725, Ω_intertype_0726, Ω_intertype_0727, Ω_intertype_0728, Ω_intertype_0729, Ω_intertype_0730, Ω_intertype_0731, Ω_intertype_0732, Ω_intertype_0733, Ω_intertype_0734, Ω_intertype_0735, Ω_intertype_0736, Ω_intertype_0737, Ω_intertype_0738, Ω_intertype_0739, Ω_intertype_0740;
      types = new Intertype();
      ({isa, validate, evaluate, type_of} = types);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0594 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_0595 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_0596 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0597 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_0598 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_0599 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_0600 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_0601 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_0602 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0603 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_0604 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_0605 = function() {
        return isa.nonempty.text(4);
      }), false);
      eq2(T, (Ω_intertype_0606 = function() {
        return isa.empty({
          list: [],
          text: '',
          set: new Set()
        });
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0607 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_0608 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_0609 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_0610 = function() {
        return isa.empty(/d/);
      }), false);
      eq2(T, (Ω_intertype_0611 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_0612 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_0613 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0614 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_0615 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_0616 = function() {
        return validate.empty(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_0617 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_0618 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_0619 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0620 = function() {
        return type_of([]);
      }), 'list');
      eq2(T, (Ω_intertype_0621 = function() {
        return type_of('');
      }), 'text');
      eq2(T, (Ω_intertype_0622 = function() {
        return type_of(new Set());
      }), 'set');
      eq2(T, (Ω_intertype_0623 = function() {
        return type_of(['a']);
      }), 'list');
      eq2(T, (Ω_intertype_0624 = function() {
        return type_of('a');
      }), 'text');
      eq2(T, (Ω_intertype_0625 = function() {
        return type_of(new Set('a'));
      }), 'set');
      //.......................................................................................................
      eq2(T, (Ω_intertype_0626 = function() {
        return type_of(1234);
      }), 'float');
      eq2(T, (Ω_intertype_0627 = function() {
        return isa.integer(1234);
      }), true);
      eq2(T, (Ω_intertype_0628 = function() {
        return isa.positive.integer(1234);
      }), true);
      eq2(T, (Ω_intertype_0629 = function() {
        return isa.negative.integer(1234);
      }), false);
      eq2(T, (Ω_intertype_0630 = function() {
        return isa.negative.integer(-1234);
      }), true);
      eq2(T, (Ω_intertype_0631 = function() {
        return isa.negative.integer(-2e308);
      }), false);
      eq2(T, (Ω_intertype_0632 = function() {
        return isa.negative.integer(-12.34);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0633 = function() {
        return isa.positive.float(+4);
      }), true);
      eq2(T, (Ω_intertype_0634 = function() {
        return isa.positive.integer(+4);
      }), true);
      eq2(T, (Ω_intertype_0635 = function() {
        return isa.positive.infinity(+4);
      }), false);
      eq2(T, (Ω_intertype_0636 = function() {
        return isa.negative.float(+4);
      }), false);
      eq2(T, (Ω_intertype_0637 = function() {
        return isa.negative.integer(+4);
      }), false);
      eq2(T, (Ω_intertype_0638 = function() {
        return isa.negative.infinity(+4);
      }), false);
      eq2(T, (Ω_intertype_0639 = function() {
        return isa.posnaught.float(+4);
      }), true);
      eq2(T, (Ω_intertype_0640 = function() {
        return isa.posnaught.integer(+4);
      }), true);
      eq2(T, (Ω_intertype_0641 = function() {
        return isa.posnaught.infinity(+4);
      }), false);
      eq2(T, (Ω_intertype_0642 = function() {
        return isa.negnaught.float(+4);
      }), false);
      eq2(T, (Ω_intertype_0643 = function() {
        return isa.negnaught.integer(+4);
      }), false);
      eq2(T, (Ω_intertype_0644 = function() {
        return isa.negnaught.infinity(+4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0645 = function() {
        return isa.positive.float(0);
      }), false);
      eq2(T, (Ω_intertype_0646 = function() {
        return isa.positive.integer(0);
      }), false);
      eq2(T, (Ω_intertype_0647 = function() {
        return isa.positive.infinity(0);
      }), false);
      eq2(T, (Ω_intertype_0648 = function() {
        return isa.negative.float(0);
      }), false);
      eq2(T, (Ω_intertype_0649 = function() {
        return isa.negative.integer(0);
      }), false);
      eq2(T, (Ω_intertype_0650 = function() {
        return isa.negative.infinity(0);
      }), false);
      eq2(T, (Ω_intertype_0651 = function() {
        return isa.posnaught.float(0);
      }), true);
      eq2(T, (Ω_intertype_0652 = function() {
        return isa.posnaught.integer(0);
      }), true);
      eq2(T, (Ω_intertype_0653 = function() {
        return isa.posnaught.infinity(0);
      }), false);
      eq2(T, (Ω_intertype_0654 = function() {
        return isa.negnaught.float(0);
      }), true);
      eq2(T, (Ω_intertype_0655 = function() {
        return isa.negnaught.integer(0);
      }), true);
      eq2(T, (Ω_intertype_0656 = function() {
        return isa.negnaught.infinity(0);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0657 = function() {
        return isa.positive.float(2e308);
      }), false);
      eq2(T, (Ω_intertype_0658 = function() {
        return isa.positive.integer(2e308);
      }), false);
      eq2(T, (Ω_intertype_0659 = function() {
        return isa.positive.infinity(2e308);
      }), true);
      eq2(T, (Ω_intertype_0660 = function() {
        return isa.negative.float(2e308);
      }), false);
      eq2(T, (Ω_intertype_0661 = function() {
        return isa.negative.integer(2e308);
      }), false);
      eq2(T, (Ω_intertype_0662 = function() {
        return isa.negative.infinity(2e308);
      }), false);
      eq2(T, (Ω_intertype_0663 = function() {
        return isa.posnaught.float(2e308);
      }), false);
      eq2(T, (Ω_intertype_0664 = function() {
        return isa.posnaught.integer(2e308);
      }), false);
      eq2(T, (Ω_intertype_0665 = function() {
        return isa.posnaught.infinity(2e308);
      }), true);
      eq2(T, (Ω_intertype_0666 = function() {
        return isa.negnaught.float(2e308);
      }), false);
      eq2(T, (Ω_intertype_0667 = function() {
        return isa.negnaught.integer(2e308);
      }), false);
      eq2(T, (Ω_intertype_0668 = function() {
        return isa.negnaught.infinity(2e308);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0669 = function() {
        return isa.positive.float(+4.3);
      }), true);
      eq2(T, (Ω_intertype_0670 = function() {
        return isa.positive.integer(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0671 = function() {
        return isa.positive.infinity(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0672 = function() {
        return isa.negative.float(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0673 = function() {
        return isa.negative.integer(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0674 = function() {
        return isa.negative.infinity(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0675 = function() {
        return isa.posnaught.float(+4.3);
      }), true);
      eq2(T, (Ω_intertype_0676 = function() {
        return isa.posnaught.integer(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0677 = function() {
        return isa.posnaught.infinity(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0678 = function() {
        return isa.negnaught.float(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0679 = function() {
        return isa.negnaught.integer(+4.3);
      }), false);
      eq2(T, (Ω_intertype_0680 = function() {
        return isa.negnaught.infinity(+4.3);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0681 = function() {
        return isa.positive.float(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0682 = function() {
        return isa.positive.integer(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0683 = function() {
        return isa.positive.infinity(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0684 = function() {
        return isa.negative.float(-4.3);
      }), true);
      eq2(T, (Ω_intertype_0685 = function() {
        return isa.negative.integer(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0686 = function() {
        return isa.negative.infinity(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0687 = function() {
        return isa.posnaught.float(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0688 = function() {
        return isa.posnaught.integer(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0689 = function() {
        return isa.posnaught.infinity(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0690 = function() {
        return isa.negnaught.float(-4.3);
      }), true);
      eq2(T, (Ω_intertype_0691 = function() {
        return isa.negnaught.integer(-4.3);
      }), false);
      eq2(T, (Ω_intertype_0692 = function() {
        return isa.negnaught.infinity(-4.3);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0693 = function() {
        return isa.posnaught(+2e308);
      }), true);
      eq2(T, (Ω_intertype_0694 = function() {
        return isa.negnaught(+2e308);
      }), false);
      eq2(T, (Ω_intertype_0695 = function() {
        return isa.posnaught(-2e308);
      }), false);
      eq2(T, (Ω_intertype_0696 = function() {
        return isa.negnaught(-2e308);
      }), true);
      eq2(T, (Ω_intertype_0697 = function() {
        return isa.posnaught(0);
      }), true);
      eq2(T, (Ω_intertype_0698 = function() {
        return isa.negnaught(0);
      }), true);
      eq2(T, (Ω_intertype_0699 = function() {
        return isa.posnaught(0);
      }), true);
      eq2(T, (Ω_intertype_0700 = function() {
        return isa.negnaught(0);
      }), true);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0701 = function() {
        return isa.frozen(Object.freeze({}));
      }), true);
      eq2(T, (Ω_intertype_0702 = function() {
        return isa.frozen(Object.freeze([]));
      }), true);
      eq2(T, (Ω_intertype_0703 = function() {
        return isa.frozen({});
      }), false);
      eq2(T, (Ω_intertype_0704 = function() {
        return isa.frozen([]);
      }), false);
      eq2(T, (Ω_intertype_0705 = function() {
        return isa.frozen.object(Object.freeze({}));
      }), true);
      eq2(T, (Ω_intertype_0706 = function() {
        return isa.frozen.list(Object.freeze([]));
      }), true);
      eq2(T, (Ω_intertype_0707 = function() {
        return isa.frozen.object({});
      }), false);
      eq2(T, (Ω_intertype_0708 = function() {
        return isa.frozen.list([]);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0709 = function() {
        return isa.odd.integer([]);
      }), false);
      eq2(T, (Ω_intertype_0710 = function() {
        return isa.odd.integer(102.4);
      }), false);
      eq2(T, (Ω_intertype_0711 = function() {
        return isa.odd.integer(9997);
      }), true);
      eq2(T, (Ω_intertype_0712 = function() {
        return isa.odd.integer('1024');
      }), false);
      eq2(T, (Ω_intertype_0713 = function() {
        return isa.odd.integer(0);
      }), false);
      eq2(T, (Ω_intertype_0714 = function() {
        return isa.odd.integer(1024);
      }), false);
      eq2(T, (Ω_intertype_0715 = function() {
        return isa.odd.positive.integer(1024);
      }), false);
      eq2(T, (Ω_intertype_0716 = function() {
        return isa.odd.positive.integer(102.4);
      }), false);
      eq2(T, (Ω_intertype_0717 = function() {
        return isa.odd.positive.integer(1023);
      }), true);
      eq2(T, (Ω_intertype_0718 = function() {
        return isa.odd.positive.integer(-1023);
      }), false);
      eq2(T, (Ω_intertype_0719 = function() {
        return isa.odd.positive.integer(103.4);
      }), false);
      eq2(T, (Ω_intertype_0720 = function() {
        return isa.even.integer([]);
      }), false);
      eq2(T, (Ω_intertype_0721 = function() {
        return isa.even.integer(102.4);
      }), false);
      eq2(T, (Ω_intertype_0722 = function() {
        return isa.even.integer(9997);
      }), false);
      eq2(T, (Ω_intertype_0723 = function() {
        return isa.even.integer('1024');
      }), false);
      eq2(T, (Ω_intertype_0724 = function() {
        return isa.even.integer(0);
      }), true);
      eq2(T, (Ω_intertype_0725 = function() {
        return isa.even.integer(1024);
      }), true);
      eq2(T, (Ω_intertype_0726 = function() {
        return isa.even.positive.integer(1024);
      }), true);
      eq2(T, (Ω_intertype_0727 = function() {
        return isa.even.positive.integer(0);
      }), false);
      eq2(T, (Ω_intertype_0728 = function() {
        return isa.even.posnaught.integer(1024);
      }), true);
      eq2(T, (Ω_intertype_0729 = function() {
        return isa.even.posnaught.integer(0);
      }), true);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0730 = function() {
        return isa.even.posnaught(0);
      }), true);
      eq2(T, (Ω_intertype_0731 = function() {
        return isa.even.posnaught(1);
      }), false);
      eq2(T, (Ω_intertype_0732 = function() {
        return isa.even.posnaught(2);
      }), true);
      //.......................................................................................................
      eq2(T, (Ω_intertype_0733 = function() {
        return isa.cardinal(-1024);
      }), false);
      eq2(T, (Ω_intertype_0734 = function() {
        return isa.cardinal(10);
      }), true);
      eq2(T, (Ω_intertype_0735 = function() {
        return isa.cardinal(123.7);
      }), false);
      eq2(T, (Ω_intertype_0736 = function() {
        return isa.cardinal(0);
      }), true);
      eq2(T, (Ω_intertype_0737 = function() {
        return isa.cardinal(1);
      }), true);
      eq2(T, (Ω_intertype_0738 = function() {
        return isa.cardinal(2e308);
      }), false);
      eq2(T, (Ω_intertype_0739 = function() {
        return evaluate.cardinal(2e308);
      }), {
        cardinal: false
      });
      eq2(T, (Ω_intertype_0740 = function() {
        return evaluate.posnaught.integer(2e308);
      }), {
        'posnaught.integer': false
      });
      //.......................................................................................................
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_rhs_optional = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var Ω_intertype_0741, Ω_intertype_0742, Ω_intertype_0743, Ω_intertype_0744, Ω_intertype_0745, Ω_intertype_0746;
      /* TAINT observe the out-comment messages would perhaps make more sense as they are more specific */
      eq2(T, (Ω_intertype_0741 = function() {
        return (new Intertype()).declare({
          foo: 'float'
        });
      }), null);
      eq2(T, (Ω_intertype_0742 = function() {
        return (new Intertype()).declare({
          foo: 'text'
        });
      }), null);
      // ( new Intertype() ).declare { foo: 'optional', }
      throws2(T, (Ω_intertype_0743 = function() {
        return (new Intertype()).declare({
          foo: 'optional'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_0744 = function() {
        return (new Intertype()).declare({
          foo: 'qqq'
        });
      }), /unknown type 'qqq'/);
      throws2(T, (Ω_intertype_0745 = function() {
        return (new Intertype()).declare({
          foo: 'optional.float'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_0746 = function() {
        return (new Intertype()).declare({
          foo: 'anything.float'
        });
      }), /illegal use of basetype 'anything' in declaration of type 'foo'/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parallel_behavior_of_isa_validate_mandatory_and_optional = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var isa, validate, Ω_intertype_0747, Ω_intertype_0748, Ω_intertype_0749, Ω_intertype_0750, Ω_intertype_0751, Ω_intertype_0752, Ω_intertype_0753, Ω_intertype_0754, Ω_intertype_0755, Ω_intertype_0756, Ω_intertype_0757, Ω_intertype_0758, Ω_intertype_0759, Ω_intertype_0760, Ω_intertype_0761, Ω_intertype_0762;
      ({isa, validate} = new Intertype({
        normalfloat: (function(x) {
          return (this.isa.float(x)) && ((0 <= x && x <= 1));
        })
      }));
      eq2(T, (Ω_intertype_0747 = function() {
        return isa.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_0748 = function() {
        return isa.normalfloat(null);
      }), false);
      eq2(T, (Ω_intertype_0749 = function() {
        return isa.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_0750 = function() {
        return isa.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_0751 = function() {
        return isa.optional.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_0752 = function() {
        return isa.optional.normalfloat(null);
      }), true);
      eq2(T, (Ω_intertype_0753 = function() {
        return isa.optional.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_0754 = function() {
        return isa.optional.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_0755 = function() {
        return validate.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_0756 = function() {
        return validate.optional.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_0757 = function() {
        return validate.optional.normalfloat(null);
      }), null);
      throws2(T, (Ω_intertype_0758 = function() {
        return validate.normalfloat(null);
      }), /expected a normalfloat, got a null/);
      throws2(T, (Ω_intertype_0759 = function() {
        return validate.normalfloat(-1);
      }), /expected a normalfloat, got a float/);
      throws2(T, (Ω_intertype_0760 = function() {
        return validate.normalfloat('?');
      }), /expected a normalfloat, got a text/);
      throws2(T, (Ω_intertype_0761 = function() {
        return validate.optional.normalfloat(-1);
      }), /expected an optional normalfloat, got a float/);
      throws2(T, (Ω_intertype_0762 = function() {
        return validate.optional.normalfloat('?');
      }), /expected an optional normalfloat, got a text/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var isa, my_types, types, validate, Ω_intertype_0763, Ω_intertype_0764, Ω_intertype_0765, Ω_intertype_0766, Ω_intertype_0767, Ω_intertype_0768, Ω_intertype_0769, Ω_intertype_0770, Ω_intertype_0771, Ω_intertype_0772, Ω_intertype_0773, Ω_intertype_0774, Ω_intertype_0775, Ω_intertype_0776, Ω_intertype_0777, Ω_intertype_0778, Ω_intertype_0779, Ω_intertype_0780, Ω_intertype_0781, Ω_intertype_0782, Ω_intertype_0783, Ω_intertype_0784, Ω_intertype_0785, Ω_intertype_0786, Ω_intertype_0787, Ω_intertype_0788, Ω_intertype_0789, Ω_intertype_0790, Ω_intertype_0791, Ω_intertype_0792, Ω_intertype_0793;
      my_types = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text',
        'foo': 'object',
        'foo.bar': 'object',
        'foo.bar.baz': 'float'
      };
      ({isa, validate} = types = new Intertype(my_types));
      eq2(T, (Ω_intertype_0763 = function() {
        return isa.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_0764 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_0765 = function() {
        return isa.optional.quantity({
          q: 2,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_0766 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_0767 = function() {
        return validate.quantity({
          q: 3,
          u: 'm'
        });
      }), {
        q: 3,
        u: 'm'
      });
      eq2(T, (Ω_intertype_0768 = function() {
        return validate.optional.quantity({
          q: 4,
          u: 'm'
        });
      }), {
        q: 4,
        u: 'm'
      });
      eq2(T, (Ω_intertype_0769 = function() {
        return validate.optional.quantity.q(null);
      }), null);
      eq2(T, (Ω_intertype_0770 = function() {
        return validate.optional.quantity.q(111);
      }), 111);
      eq2(T, (Ω_intertype_0771 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_0772 = function() {
        return isa.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_0773 = function() {
        return isa.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_0774 = function() {
        return isa.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_0775 = function() {
        return isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_0776 = function() {
        return isa.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_0777 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_0778 = function() {
        return isa.optional.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_0779 = function() {
        return isa.optional.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_0780 = function() {
        return isa.optional.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_0781 = function() {
        return isa.optional.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_0782 = function() {
        return validate.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_0783 = function() {
        return validate.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_0784 = function() {
        return validate.optional.quantity(null);
      }), null);
      throws2(T, (Ω_intertype_0785 = function() {
        return validate.quantity({
          q: 5
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_0786 = function() {
        return validate.quantity(null);
      }), /expected a quantity, got a null/);
      throws2(T, (Ω_intertype_0787 = function() {
        return validate.quantity(-1);
      }), /expected a quantity, got a float/);
      throws2(T, (Ω_intertype_0788 = function() {
        return validate.quantity('?');
      }), /expected a quantity, got a text/);
      throws2(T, (Ω_intertype_0789 = function() {
        return validate.quantity({
          q: 1
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_0790 = function() {
        return validate.optional.quantity(-1);
      }), /expected an optional quantity, got a float/);
      throws2(T, (Ω_intertype_0791 = function() {
        return validate.optional.quantity({
          q: 1
        });
      }), /expected an optional quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_0792 = function() {
        return validate.optional.quantity.q({
          q: 1
        });
      }), /expected an optional quantity.q, got a object/);
      throws2(T, (Ω_intertype_0793 = function() {
        return validate.optional.quantity.q(3, 4, 5);
      }), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declaration_role_field = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, Ω_intertype_0794, Ω_intertype_0795, Ω_intertype_0796, Ω_intertype_0797, Ω_intertype_0798;
      ({declarations} = new Intertype());
      eq2(T, (Ω_intertype_0794 = function() {
        return declarations.float.role;
      }), 'usertype');
      eq2(T, (Ω_intertype_0795 = function() {
        return declarations.null.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_0796 = function() {
        return declarations.anything.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_0797 = function() {
        return declarations.unknown.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_0798 = function() {
        return declarations.optional.role;
      }), 'optional');
      // throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._________________can_use_fields = function(T, done) {
    var Intertype;
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
    ({Intertype_minimal} = require('../../../apps/intertype'));
    ({isa, validate, create, declare, type_of} = new Intertype_minimal());
    (() => {      //.........................................................................................................
      var Ω_intertype_0799, Ω_intertype_0800, Ω_intertype_0801, Ω_intertype_0802;
      eq2(T, (Ω_intertype_0799 = function() {
        return type_of(null);
      }), 'null');
      eq2(T, (Ω_intertype_0800 = function() {
        return type_of(void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_0801 = function() {
        return type_of(+2e308);
      }), 'unknown');
      eq2(T, (Ω_intertype_0802 = function() {
        return type_of(4);
      }), 'unknown');
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_0803, Ω_intertype_0804, Ω_intertype_0805, Ω_intertype_0806;
      eq2(T, (Ω_intertype_0803 = function() {
        return isa.anything(1);
      }), true);
      eq2(T, (Ω_intertype_0804 = function() {
        return isa.nothing(1);
      }), false);
      eq2(T, (Ω_intertype_0805 = function() {
        return isa.something(1);
      }), true);
      eq2(T, (Ω_intertype_0806 = function() {
        return isa.unknown(1);
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_0807, Ω_intertype_0808, Ω_intertype_0809, Ω_intertype_0810;
      eq2(T, (Ω_intertype_0807 = function() {
        return isa.anything(null);
      }), true);
      eq2(T, (Ω_intertype_0808 = function() {
        return isa.nothing(null);
      }), true);
      eq2(T, (Ω_intertype_0809 = function() {
        return isa.something(null);
      }), false);
      eq2(T, (Ω_intertype_0810 = function() {
        return isa.unknown(null);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_0811, Ω_intertype_0812, Ω_intertype_0813, Ω_intertype_0814;
      eq2(T, (Ω_intertype_0811 = function() {
        return isa.anything(void 0);
      }), true);
      eq2(T, (Ω_intertype_0812 = function() {
        return isa.nothing(void 0);
      }), true);
      eq2(T, (Ω_intertype_0813 = function() {
        return isa.something(void 0);
      }), false);
      eq2(T, (Ω_intertype_0814 = function() {
        return isa.unknown(void 0);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_0815, Ω_intertype_0816, Ω_intertype_0817;
      throws2(T, (Ω_intertype_0815 = function() {
        return isa.optional(1);
      }), /`optional` is not a legal type for `isa` methods/);
      throws2(T, (Ω_intertype_0816 = function() {
        return validate.optional(1);
      }), /`optional` is not a legal type for `validate` methods/);
      throws2(T, (Ω_intertype_0817 = function() {
        return create.optional(1);
      }), /`optional` is not a legal type for `create` methods/);
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
      this.interface();
      test(this.interface);
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map