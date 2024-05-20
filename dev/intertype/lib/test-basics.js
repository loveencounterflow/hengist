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
    var INTERTYPE, Ω_intertype_1000, Ω_intertype_1001, Ω_intertype_1002, Ω_intertype_1003, Ω_intertype_1004, Ω_intertype_1005, Ω_intertype_1006, Ω_intertype_1007, Ω_intertype_1008, Ω_intertype_1009, Ω_intertype_1010, Ω_intertype_1012, Ω_intertype_1014, Ω_intertype_1015, Ω_intertype_1016, Ω_intertype_1017, Ω_intertype_1018, Ω_intertype_1019, Ω_intertype_1020, Ω_intertype_1021, Ω_intertype_1022, Ω_intertype_1027, Ω_intertype_1028;
    INTERTYPE = require('../../../apps/intertype');
    eq2(T, (Ω_intertype_1000 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_1001 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa);
    }), true);
    eq2(T, (Ω_intertype_1002 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_1003 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate);
    }), true);
    eq2(T, (Ω_intertype_1004 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_1005 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa);
    }), true);
    eq2(T, (Ω_intertype_1006 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_1007 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate);
    }), true);
    eq2(T, (Ω_intertype_1008 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_1009 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_1010 = function() {
      return TMP_types.isa.object(INTERTYPE.types.isa);
    }), true);
    // eq2 T, ( Ω_intertype_1011 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
    eq2(T, (Ω_intertype_1012 = function() {
      return TMP_types.isa.object(INTERTYPE.types.validate);
    }), true);
    // eq2 T, ( Ω_intertype_1013 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
    eq2(T, (Ω_intertype_1014 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.boolean);
    }), true);
    eq2(T, (Ω_intertype_1015 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_1016 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.boolean);
    }), true);
    eq2(T, (Ω_intertype_1017 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_1018 = function() {
      return TMP_types.isa.object(INTERTYPE.types.create);
    }), true);
    eq2(T, (Ω_intertype_1019 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.text);
    }), true);
    eq2(T, (Ω_intertype_1020 = function() {
      return TMP_types.isa.function(INTERTYPE.types.create.text);
    }), true);
    eq2(T, (Ω_intertype_1021 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations);
    }), true);
    eq2(T, (Ω_intertype_1022 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations.text);
    }), true);
    //.........................................................................................................
    // eq2 T, ( Ω_intertype_1023 = -> INTERTYPE.types.isa.name           ), 'isa'
    // eq2 T, ( Ω_intertype_1024 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
    // eq2 T, ( Ω_intertype_1025 = -> INTERTYPE.types.validate.name      ), 'validate'
    // eq2 T, ( Ω_intertype_1026 = -> INTERTYPE.types.create.name        ), 'create'
    eq2(T, (Ω_intertype_1027 = function() {
      return INTERTYPE.types.declare.name;
    }), 'declare');
    eq2(T, (Ω_intertype_1028 = function() {
      return INTERTYPE.types.type_of.name;
    }), 'type_of');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, types, Ω_intertype_1029, Ω_intertype_1030, Ω_intertype_1031, Ω_intertype_1032, Ω_intertype_1033, Ω_intertype_1034, Ω_intertype_1035, Ω_intertype_1036, Ω_intertype_1037, Ω_intertype_1038, Ω_intertype_1039, Ω_intertype_1040, Ω_intertype_1041, Ω_intertype_1042, Ω_intertype_1043, Ω_intertype_1044, Ω_intertype_1045, Ω_intertype_1046, Ω_intertype_1047, Ω_intertype_1048, Ω_intertype_1049, Ω_intertype_1050, Ω_intertype_1051, Ω_intertype_1052, Ω_intertype_1053, Ω_intertype_1054, Ω_intertype_1055, Ω_intertype_1056, Ω_intertype_1057, Ω_intertype_1058, Ω_intertype_1059, Ω_intertype_1060, Ω_intertype_1061, Ω_intertype_1062, Ω_intertype_1063, Ω_intertype_1064, Ω_intertype_1065, Ω_intertype_1066;
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype_minimal(sample_declarations);
    eq2(T, (Ω_intertype_1029 = function() {
      return types.isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_1030 = function() {
      return types.isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1031 = function() {
      return types.isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_1032 = function() {
      return types.isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_1033 = function() {
      return types.isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_1034 = function() {
      return types.isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1035 = function() {
      return types.isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_1036 = function() {
      return types.isa.optional.boolean(1);
    }), false);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1037 = function() {
      return types.validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_1038 = function() {
      return types.validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1039 = function() {
      return types.validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1040 = function() {
      return types.validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_1041 = function() {
      return types.validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_1042 = function() {
      return types.validate.optional.boolean(null);
    }), null);
    try_and_show(T, function() {
      return types.validate.boolean(1);
    });
    try_and_show(T, function() {
      return types.validate.optional.boolean(1);
    });
    throws2(T, (Ω_intertype_1043 = function() {
      return types.validate.boolean(1);
    }), /expected a boolean/);
    throws2(T, (Ω_intertype_1044 = function() {
      return types.validate.optional.boolean(1);
    }), /expected an optional boolean/);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1045 = function() {
      return types.type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_1046 = function() {
      return types.type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_1047 = function() {
      return types.type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_1048 = function() {
      return types.type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_1049 = function() {
      return types.type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_1050 = function() {
      return types.type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_1051 = function() {
      return types.type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_1052 = function() {
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
    eq2(T, (Ω_intertype_1053 = function() {
      return types.isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_1054 = function() {
      return types.isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_1055 = function() {
      return types.validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_1056 = function() {
      return types.validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
    eq2(T, (Ω_intertype_1057 = function() {
      var ref1;
      return (ref1 = types.declarations.null) != null ? ref1.type : void 0;
    }), 'null');
    eq2(T, (Ω_intertype_1058 = function() {
      var ref1;
      return (ref1 = types.declarations.function) != null ? ref1.type : void 0;
    }), 'function');
    eq2(T, (Ω_intertype_1059 = function() {
      var ref1;
      return (ref1 = types.declarations.boolean) != null ? ref1.type : void 0;
    }), 'boolean');
    eq2(T, (Ω_intertype_1060 = function() {
      var ref1;
      return (ref1 = types.declarations.text) != null ? ref1.type : void 0;
    }), 'text');
    eq2(T, (Ω_intertype_1061 = function() {
      var ref1;
      return (ref1 = types.declarations.asyncfunction) != null ? ref1.type : void 0;
    }), 'asyncfunction');
    eq2(T, (Ω_intertype_1062 = function() {
      var ref1;
      return (ref1 = types.isa.null) != null ? ref1.name : void 0;
    }), 'isa.null');
    eq2(T, (Ω_intertype_1063 = function() {
      var ref1;
      return (ref1 = types.isa.function) != null ? ref1.name : void 0;
    }), 'isa.function');
    eq2(T, (Ω_intertype_1064 = function() {
      var ref1;
      return (ref1 = types.isa.boolean) != null ? ref1.name : void 0;
    }), 'isa.boolean');
    eq2(T, (Ω_intertype_1065 = function() {
      var ref1;
      return (ref1 = types.isa.text) != null ? ref1.name : void 0;
    }), 'isa.text');
    eq2(T, (Ω_intertype_1066 = function() {
      var ref1;
      return (ref1 = types.isa.asyncfunction) != null ? ref1.name : void 0;
    }), 'isa.asyncfunction');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_standalone_methods = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_1067, Ω_intertype_1068, Ω_intertype_1069, Ω_intertype_1070, Ω_intertype_1071, Ω_intertype_1072, Ω_intertype_1073, Ω_intertype_1074, Ω_intertype_1075, Ω_intertype_1076, Ω_intertype_1077, Ω_intertype_1078, Ω_intertype_1079, Ω_intertype_1080, Ω_intertype_1081, Ω_intertype_1082, Ω_intertype_1083, Ω_intertype_1084, Ω_intertype_1085, Ω_intertype_1086, Ω_intertype_1087, Ω_intertype_1088, Ω_intertype_1089, Ω_intertype_1090, Ω_intertype_1091, Ω_intertype_1092, Ω_intertype_1093, Ω_intertype_1094, Ω_intertype_1095, Ω_intertype_1096, Ω_intertype_1097, Ω_intertype_1098, Ω_intertype_1099, Ω_intertype_1100, Ω_intertype_1101, Ω_intertype_1102;
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    eq2(T, (Ω_intertype_1067 = function() {
      return isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_1068 = function() {
      return isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1069 = function() {
      return isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_1070 = function() {
      return isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_1071 = function() {
      return isa.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_1072 = function() {
      return isa.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_1073 = function() {
      return isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_1074 = function() {
      return isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1075 = function() {
      return isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_1076 = function() {
      return isa.optional.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_1077 = function() {
      return isa.optional.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_1078 = function() {
      return isa.optional.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_1079 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    eq2(T, (Ω_intertype_1080 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1081 = function() {
      return validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_1082 = function() {
      return validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1083 = function() {
      return validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_1084 = function() {
      return validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_1085 = function() {
      return validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_1086 = function() {
      return validate.optional.boolean(null);
    }), null);
    try_and_show(T, function() {
      return validate.boolean(1);
    });
    try_and_show(T, function() {
      return validate.optional.boolean(1);
    });
    throws2(T, (Ω_intertype_1087 = function() {
      return validate.boolean(1);
    }), /expected a boolean/);
    throws2(T, (Ω_intertype_1088 = function() {
      return validate.optional.boolean(1);
    }), /expected an optional boolean/);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1089 = function() {
      return type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_1090 = function() {
      return type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_1091 = function() {
      return type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_1092 = function() {
      return type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_1093 = function() {
      return type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_1094 = function() {
      return type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_1095 = function() {
      return type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_1096 = function() {
      return type_of(-2e308);
    }), 'unknown');
    //.........................................................................................................
    eq2(T, (Ω_intertype_1097 = function() {
      return isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_1098 = function() {
      return isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_1099 = function() {
      return validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_1100 = function() {
      return validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
    //.........................................................................................................
    throws2(T, (Ω_intertype_1101 = function() {
      return isa.float(3, 4);
    }), /method 'isa.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1102 = function() {
      return isa.float();
    }), /method 'isa.float' expects 1 arguments, got 0/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.methods_check_arity = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_1103, Ω_intertype_1104, Ω_intertype_1105, Ω_intertype_1106, Ω_intertype_1107, Ω_intertype_1108, Ω_intertype_1109, Ω_intertype_1110, Ω_intertype_1111, Ω_intertype_1112;
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    //.........................................................................................................
    throws2(T, (Ω_intertype_1103 = function() {
      return isa.float(3, 4);
    }), /method 'isa.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1104 = function() {
      return isa.float();
    }), /method 'isa.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_1105 = function() {
      return isa.optional.float(3, 4);
    }), /method 'isa.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1106 = function() {
      return isa.optional.float();
    }), /method 'isa.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_1107 = function() {
      return validate.float(3, 4);
    }), /method 'validate.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1108 = function() {
      return validate.float();
    }), /method 'validate.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_1109 = function() {
      return validate.optional.float(3, 4);
    }), /method 'validate.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1110 = function() {
      return validate.optional.float();
    }), /method 'validate.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_1111 = function() {
      return type_of(3, 4);
    }), /expected 1 arguments, got 2/);
    throws2(T, (Ω_intertype_1112 = function() {
      return type_of();
    }), /expected 1 arguments, got 0/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.same_basic_types = function(T, done) {
    var $function, asyncfunction, asyncgenerator, asyncgeneratorfunction, boolean, generator, generatorfunction, isa, symbol, type_of, validate, Ω_intertype_1113, Ω_intertype_1114, Ω_intertype_1115, Ω_intertype_1116, Ω_intertype_1117, Ω_intertype_1118, Ω_intertype_1119, Ω_intertype_1120, Ω_intertype_1121, Ω_intertype_1122, Ω_intertype_1123, Ω_intertype_1124, Ω_intertype_1125, Ω_intertype_1126, Ω_intertype_1127, Ω_intertype_1128, Ω_intertype_1129, Ω_intertype_1130, Ω_intertype_1131, Ω_intertype_1132, Ω_intertype_1133, Ω_intertype_1134, Ω_intertype_1135, Ω_intertype_1136;
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
    eq2(T, (Ω_intertype_1113 = function() {
      return isa.boolean(boolean);
    }), true);
    eq2(T, (Ω_intertype_1114 = function() {
      return isa.function($function);
    }), true);
    eq2(T, (Ω_intertype_1115 = function() {
      return isa.asyncfunction(asyncfunction);
    }), true);
    eq2(T, (Ω_intertype_1116 = function() {
      return isa.generatorfunction(generatorfunction);
    }), true);
    eq2(T, (Ω_intertype_1117 = function() {
      return isa.asyncgeneratorfunction(asyncgeneratorfunction);
    }), true);
    eq2(T, (Ω_intertype_1118 = function() {
      return isa.asyncgenerator(asyncgenerator);
    }), true);
    eq2(T, (Ω_intertype_1119 = function() {
      return isa.generator(generator);
    }), true);
    eq2(T, (Ω_intertype_1120 = function() {
      return isa.symbol(symbol);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1121 = function() {
      return validate.boolean(boolean);
    }), boolean);
    eq2(T, (Ω_intertype_1122 = function() {
      return validate.function($function);
    }), $function);
    eq2(T, (Ω_intertype_1123 = function() {
      return validate.asyncfunction(asyncfunction);
    }), asyncfunction);
    eq2(T, (Ω_intertype_1124 = function() {
      return validate.generatorfunction(generatorfunction);
    }), generatorfunction);
    eq2(T, (Ω_intertype_1125 = function() {
      return validate.asyncgeneratorfunction(asyncgeneratorfunction);
    }), asyncgeneratorfunction);
    eq2(T, (Ω_intertype_1126 = function() {
      return validate.asyncgenerator(asyncgenerator);
    }), asyncgenerator);
    eq2(T, (Ω_intertype_1127 = function() {
      return validate.generator(generator);
    }), generator);
    eq2(T, (Ω_intertype_1128 = function() {
      return validate.symbol(symbol);
    }), symbol);
    //.........................................................................................................
    eq2(T, (Ω_intertype_1129 = function() {
      return type_of(boolean);
    }), 'boolean');
    eq2(T, (Ω_intertype_1130 = function() {
      return type_of($function);
    }), 'function');
    eq2(T, (Ω_intertype_1131 = function() {
      return type_of(asyncfunction);
    }), 'asyncfunction');
    eq2(T, (Ω_intertype_1132 = function() {
      return type_of(generatorfunction);
    }), 'generatorfunction');
    eq2(T, (Ω_intertype_1133 = function() {
      return type_of(asyncgeneratorfunction);
    }), 'asyncgeneratorfunction');
    eq2(T, (Ω_intertype_1134 = function() {
      return type_of(asyncgenerator);
    }), 'asyncgenerator');
    eq2(T, (Ω_intertype_1135 = function() {
      return type_of(generator);
    }), 'generator');
    eq2(T, (Ω_intertype_1136 = function() {
      return type_of(symbol);
    }), 'symbol');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_on_missing_type = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_1137, Ω_intertype_1138, Ω_intertype_1139, Ω_intertype_1140, Ω_intertype_1141, Ω_intertype_1142, Ω_intertype_1143, Ω_intertype_1144, Ω_intertype_1145, Ω_intertype_1146, Ω_intertype_1147, Ω_intertype_1148, Ω_intertype_1149, Ω_intertype_1150, Ω_intertype_1151, Ω_intertype_1152;
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
    throws2(T, (Ω_intertype_1137 = function() {
      return isa.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1138 = function() {
      return isa.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1139 = function() {
      return isa.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1140 = function() {
      return isa.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1141 = function() {
      return isa.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1142 = function() {
      return isa.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1143 = function() {
      return isa.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1144 = function() {
      return isa.optional.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1145 = function() {
      return validate.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1146 = function() {
      return validate.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1147 = function() {
      return validate.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1148 = function() {
      return validate.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1149 = function() {
      return validate.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1150 = function() {
      return validate.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1151 = function() {
      return validate.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_1152 = function() {
      return validate.optional.quux(3, 4);
    }), /unknown type 'quux'/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_when_optional_is_declared = function(T, done) {
    var INTERTYPE, Ω_intertype_1153;
    INTERTYPE = require('../../../apps/intertype');
    throws2(T, (Ω_intertype_1153 = function() {
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
    var Intertype, Ω_intertype_1154, Ω_intertype_1155, Ω_intertype_1156, Ω_intertype_1157, Ω_intertype_1158, Ω_intertype_1159, Ω_intertype_1160, Ω_intertype_1161, Ω_intertype_1162, Ω_intertype_1163;
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    throws2(T, (Ω_intertype_1154 = function() {
      return new Intertype({
        foo: (function() {})
      });
    }), /expected function with 1 parameters, got one with 0/);
    throws2(T, (Ω_intertype_1155 = function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_1156 = function() {
      return new Intertype({
        foo: true
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_1157 = function() {
      return new Intertype({
        foo: void 0
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_1158 = function() {
      return new Intertype({
        foo: null
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_1159 = function() {
      return new Intertype({
        foo: {}
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_1160 = function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_1161 = function() {
      return new Intertype({
        foo: {
          test: false
        }
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_1162 = function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_1163 = function() {
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
      var declarations, types, Ω_intertype_1164, Ω_intertype_1165, Ω_intertype_1166, Ω_intertype_1167;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      types = new Intertype_minimal(declarations);
      eq2(T, (Ω_intertype_1164 = function() {
        return TMP_types.isa.function(types.isa.integer);
      }), true);
      eq2(T, (Ω_intertype_1165 = function() {
        return types.isa.integer.length;
      }), 1);
      eq2(T, (Ω_intertype_1166 = function() {
        return types.isa.integer(123);
      }), true);
      eq2(T, (Ω_intertype_1167 = function() {
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
      var declarations, Ω_intertype_1168;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: async function() {
          return (await 0);
        }
      };
      throws2(T, (Ω_intertype_1168 = function() {
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
      var declarations, Ω_intertype_1169;
      declarations = {...sample_declarations};
      declarations.foolist = {
        test: function(x) {
          return true;
        },
        template: function(n) {
          return [n];
        }
      };
      throws2(T, (Ω_intertype_1169 = function() {
        return new Intertype_minimal(declarations);
      }), /template method for type 'foolist' has arity 1 but must be nullary/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_knows_its_base_types = function(T, done) {
    var isa, Ω_intertype_1170, Ω_intertype_1171, Ω_intertype_1172, Ω_intertype_1173, Ω_intertype_1174, Ω_intertype_1175, Ω_intertype_1176, Ω_intertype_1177, Ω_intertype_1178, Ω_intertype_1179, Ω_intertype_1180, Ω_intertype_1181, Ω_intertype_1182, Ω_intertype_1183, Ω_intertype_1184;
    ({isa} = require('../../../apps/intertype'));
    //.........................................................................................................
    eq2(T, (Ω_intertype_1170 = function() {
      return isa.basetype('optional');
    }), false);
    eq2(T, (Ω_intertype_1171 = function() {
      return isa.basetype('anything');
    }), true);
    eq2(T, (Ω_intertype_1172 = function() {
      return isa.basetype('nothing');
    }), true);
    eq2(T, (Ω_intertype_1173 = function() {
      return isa.basetype('something');
    }), true);
    eq2(T, (Ω_intertype_1174 = function() {
      return isa.basetype('null');
    }), true);
    eq2(T, (Ω_intertype_1175 = function() {
      return isa.basetype('undefined');
    }), true);
    eq2(T, (Ω_intertype_1176 = function() {
      return isa.basetype('unknown');
    }), true);
    eq2(T, (Ω_intertype_1177 = function() {
      return isa.basetype('integer');
    }), false);
    eq2(T, (Ω_intertype_1178 = function() {
      return isa.basetype('float');
    }), false);
    eq2(T, (Ω_intertype_1179 = function() {
      return isa.basetype('basetype');
    }), false);
    eq2(T, (Ω_intertype_1180 = function() {
      return isa.basetype('quux');
    }), false);
    eq2(T, (Ω_intertype_1181 = function() {
      return isa.basetype('toString');
    }), false);
    eq2(T, (Ω_intertype_1182 = function() {
      return isa.basetype(null);
    }), false);
    eq2(T, (Ω_intertype_1183 = function() {
      return isa.basetype(void 0);
    }), false);
    eq2(T, (Ω_intertype_1184 = function() {
      return isa.basetype(4);
    }), false);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_licensed_overrides = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_1185, Ω_intertype_1186, Ω_intertype_1187, Ω_intertype_1188;
      types = new Intertype();
      eq2(T, (Ω_intertype_1185 = function() {
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
      throws2(T, (Ω_intertype_1186 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_1187 = function() {
        return types.isa.float(4);
      }), true);
      eq2(T, (Ω_intertype_1188 = function() {
        return types.isa.float('float');
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_1189, Ω_intertype_1190;
      types = new Intertype();
      eq2(T, (Ω_intertype_1189 = function() {
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
      throws2(T, (Ω_intertype_1190 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_1191, Ω_intertype_1192, Ω_intertype_1193, Ω_intertype_1194;
      types = new Intertype();
      eq2(T, (Ω_intertype_1191 = function() {
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
      throws2(T, (Ω_intertype_1192 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare basetype 'anything'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_1193 = function() {
        return types.isa.anything(4);
      }), true);
      eq2(T, (Ω_intertype_1194 = function() {
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
      var declarations, types, Ω_intertype_1195, Ω_intertype_1196, Ω_intertype_1197, Ω_intertype_1198, Ω_intertype_1199, Ω_intertype_1200, Ω_intertype_1201, Ω_intertype_1202, Ω_intertype_1203, Ω_intertype_1204;
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
      eq2(T, (Ω_intertype_1195 = function() {
        return TMP_types.isa.object(types.declarations);
      }), true);
      eq2(T, (Ω_intertype_1196 = function() {
        return TMP_types.isa.object(types.declarations.float);
      }), true);
      eq2(T, (Ω_intertype_1197 = function() {
        return TMP_types.isa.object(types.declarations.text);
      }), true);
      //.......................................................................................................
      throws2(T, (Ω_intertype_1198 = function() {
        return types.create.boolean();
      }), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/);
      throws2(T, (Ω_intertype_1199 = function() {
        return types.create.text('foo');
      }), /expected 0 arguments, got 1/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1200 = function() {
        return types.create.text();
      }), '');
      eq2(T, (Ω_intertype_1201 = function() {
        return types.create.integer();
      }), 0);
      eq2(T, (Ω_intertype_1202 = function() {
        return types.create.float();
      }), 0);
      eq2(T, (Ω_intertype_1203 = function() {
        return types.create.float('123.45');
      }), 123.45);
      throws2(T, (Ω_intertype_1204 = function() {
        return types.create.float('***');
      }), /expected `create\.float\(\)` to return a float but it returned a nan/);
      //.......................................................................................................
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_1205;
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
      eq2(T, (Ω_intertype_1205 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_1206, Ω_intertype_1207, Ω_intertype_1208, Ω_intertype_1209;
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
      eq2(T, (Ω_intertype_1206 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_1207 = function() {
        return create.quantity({
          q: 123
        });
      }), {
        q: 123,
        u: 'u'
      });
      eq2(T, (Ω_intertype_1208 = function() {
        return create.quantity({
          u: 'kg'
        });
      }), {
        q: 0,
        u: 'kg'
      });
      eq2(T, (Ω_intertype_1209 = function() {
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
      var create, type_of, types, Ω_intertype_1210, Ω_intertype_1211, Ω_intertype_1212, Ω_intertype_1213, Ω_intertype_1214, Ω_intertype_1215, Ω_intertype_1216, Ω_intertype_1217, Ω_intertype_1218, Ω_intertype_1219, Ω_intertype_1220, Ω_intertype_1221;
      types = new Intertype();
      ({create, type_of} = types);
      eq2(T, (Ω_intertype_1210 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_1211 = function() {
        return create.boolean();
      }), false);
      eq2(T, (Ω_intertype_1212 = function() {
        return create.object();
      }), {});
      eq2(T, (Ω_intertype_1213 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_1214 = function() {
        return create.infinity();
      }), 2e308);
      eq2(T, (Ω_intertype_1215 = function() {
        return create.text();
      }), '');
      eq2(T, (Ω_intertype_1216 = function() {
        return create.list();
      }), []);
      eq2(T, (Ω_intertype_1217 = function() {
        return create.regex();
      }), new RegExp());
      eq2(T, (Ω_intertype_1218 = function() {
        return type_of(create.function());
      }), 'function');
      eq2(T, (Ω_intertype_1219 = function() {
        return type_of(create.asyncfunction());
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_1220 = function() {
        return type_of(create.symbol());
      }), 'symbol');
      throws2(T, (Ω_intertype_1221 = function() {
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
      var create, declarations, declare, isa, type_of, types, Ω_intertype_1222, Ω_intertype_1223, Ω_intertype_1224, Ω_intertype_1225;
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
      eq2(T, (Ω_intertype_1222 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_1223 = function() {
        return isa.quantity({
          q: 9
        });
      }), false);
      eq2(T, (Ω_intertype_1224 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_1225 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declare, type_of, types, Ω_intertype_1226;
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
      eq2(T, (Ω_intertype_1226 = function() {
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
      var create, declarations, declare, isa, type_of, types, Ω_intertype_1227, Ω_intertype_1228, Ω_intertype_1229, Ω_intertype_1230, Ω_intertype_1231;
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
      eq2(T, (Ω_intertype_1227 = function() {
        return type_of(declarations.quantity.test);
      }), 'function');
      debug('^342342^', declarations.quantity);
      eq2(T, (Ω_intertype_1228 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_1229 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      eq2(T, (Ω_intertype_1230 = function() {
        return isa.quantity({
          q: 987,
          u: 's'
        });
      }), true);
      eq2(T, (Ω_intertype_1231 = function() {
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
    var Intertype_minimal, types, Ω_intertype_1232, Ω_intertype_1233;
    ({Intertype_minimal} = require('../../../apps/intertype'));
    types = new Intertype_minimal();
    eq2(T, (Ω_intertype_1232 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown']);
    types.declare({
      z: (function(x) {})
    });
    eq2(T, (Ω_intertype_1233 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z']);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_type_name_for_test = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_1234, Ω_intertype_1235, Ω_intertype_1236, Ω_intertype_1237, Ω_intertype_1238, Ω_intertype_1239, Ω_intertype_1240, Ω_intertype_1241;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: 'quux', }
      throws2(T, (Ω_intertype_1234 = function() {
        return types.declare({
          z: 'quux'
        });
      }), /unknown type 'quux'/);
      types.declare({
        z: 'float'
      });
      eq2(T, (Ω_intertype_1235 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_1236 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_1237 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_1238 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_1239 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_1240 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_1241 = function() {
        return types.declarations.z.test.name;
      }), 'z'); // ?
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_1242, Ω_intertype_1243, Ω_intertype_1244, Ω_intertype_1245, Ω_intertype_1246, Ω_intertype_1247, Ω_intertype_1248, Ω_intertype_1249;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: { test: 'quux', }, }
      throws2(T, (Ω_intertype_1242 = function() {
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
      eq2(T, (Ω_intertype_1243 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_1244 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_1245 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_1246 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_1247 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_1248 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_1249 = function() {
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
      var types, Ω_intertype_1250, Ω_intertype_1251, Ω_intertype_1252, Ω_intertype_1253, Ω_intertype_1254, Ω_intertype_1255, Ω_intertype_1256, Ω_intertype_1257, Ω_intertype_1258;
      types = new Intertype();
      eq2(T, (Ω_intertype_1250 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), false);
      types.declare({
        foo: 'object'
      });
      eq2(T, (Ω_intertype_1251 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), true);
      eq2(T, (Ω_intertype_1252 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), false);
      types.declare({
        'foo.bar': 'object'
      });
      eq2(T, (Ω_intertype_1253 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), true);
      eq2(T, (Ω_intertype_1254 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), false);
      types.declare({
        'foo.bar.baz': 'float'
      });
      eq2(T, (Ω_intertype_1255 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), true);
      eq2(T, (Ω_intertype_1256 = function() {
        return types.isa.foo.bar.baz(null);
      }), false);
      eq2(T, (Ω_intertype_1257 = function() {
        return types.isa.foo.bar.baz(4);
      }), true);
      eq2(T, (Ω_intertype_1258 = function() {
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
      var types, Ω_intertype_1268, Ω_intertype_1269, Ω_intertype_1270, Ω_intertype_1271, Ω_intertype_1272, Ω_intertype_1273, Ω_intertype_1274, Ω_intertype_1275, Ω_intertype_1276, Ω_intertype_1277, Ω_intertype_1278, Ω_intertype_1279;
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
      eq2(T, (Ω_intertype_1268 = function() {
        return types.isa['quantity.q'];
      }), types.declarations['quantity'].sub_tests['q']);
      eq2(T, (Ω_intertype_1269 = function() {
        return types.isa['quantity.q'];
      }), types.isa.quantity.q);
      // debug '^409-1^', types.declarations
      eq2(T, (Ω_intertype_1270 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_1271 = function() {
        return types.isa.quantity({
          q: {}
        });
      }), false);
      eq2(T, (Ω_intertype_1272 = function() {
        return types.isa.quantity({
          q: 3
        });
      }), false);
      eq2(T, (Ω_intertype_1273 = function() {
        return types.isa.quantity({
          q: 3,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_1274 = function() {
        return types.isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_1275 = function() {
        return types.isa.quantity.q(3.1);
      }), true);
      eq2(T, (Ω_intertype_1276 = function() {
        return types.isa.quantity.q('3.1');
      }), false);
      eq2(T, (Ω_intertype_1277 = function() {
        return types.isa.quantity.u('m');
      }), true);
      eq2(T, (Ω_intertype_1278 = function() {
        return types.isa.quantity.u(null);
      }), false);
      eq2(T, (Ω_intertype_1279 = function() {
        return types.isa.quantity.u(3);
      }), false);
      debug('^433-1^', types.declarations['quantity']);
      debug('^433-1^', types.declarations['quantity.q']);
      debug('^433-1^', types.declarations['quantity.u']);
      return null;
    })();
    (() => {      //.........................................................................................................
      var f, k, types, Ω_intertype_1280, Ω_intertype_1281, Ω_intertype_1282, Ω_intertype_1283, Ω_intertype_1284, Ω_intertype_1285, Ω_intertype_1286, Ω_intertype_1287, Ω_intertype_1288, Ω_intertype_1289, Ω_intertype_1290, Ω_intertype_1291, Ω_intertype_1292, Ω_intertype_1293, Ω_intertype_1294, Ω_intertype_1295, Ω_intertype_1296;
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
      eq2(T, (Ω_intertype_1280 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_1281 = function() {
        return types.isa.person.address.city.name(1234);
      }), false);
      eq2(T, (Ω_intertype_1282 = function() {
        return types.isa.person(1234);
      }), false);
      eq2(T, (Ω_intertype_1283 = function() {
        return types.isa.person({
          name: 'Bob'
        });
      }), false);
      eq2(T, (Ω_intertype_1284 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {}
        });
      }), false);
      eq2(T, (Ω_intertype_1285 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {}
          }
        });
      }), false);
      eq2(T, (Ω_intertype_1286 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_1287 = function() {
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
      eq2(T, (Ω_intertype_1288 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_1289 = function() {
        return types.isa.person.address.city.postcode('SO36');
      }), true);
      eq2(T, (Ω_intertype_1290 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_1291 = function() {
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
      eq2(T, (Ω_intertype_1292 = function() {
        return Object.keys(types.declarations['person'].sub_tests);
      }), ['name', 'address']);
      eq2(T, (Ω_intertype_1293 = function() {
        return Object.keys(types.declarations['person.address'].sub_tests);
      }), ['city']);
      eq2(T, (Ω_intertype_1294 = function() {
        return Object.keys(types.declarations['person.address.city'].sub_tests);
      }), ['name', 'postcode']);
      eq2(T, (Ω_intertype_1295 = function() {
        return types.declarations['person'].sub_tests !== types.declarations['person.address'].sub_tests;
      }), true);
      eq2(T, (Ω_intertype_1296 = function() {
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
        var d, Ω_intertype_1297;
        d = 3;
        // d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
        eq2(T, (Ω_intertype_1297 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      (() => {
        var d, Ω_intertype_1298, Ω_intertype_1299;
        d = new Number(3);
        d.bar = '?';
        eq2(T, (Ω_intertype_1298 = function() {
          return d.bar;
        }), '?');
        // still won't work b/c `float` doesn't accept objects (which is a good thing):
        eq2(T, (Ω_intertype_1299 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_1300, Ω_intertype_1301;
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
      eq2(T, (Ω_intertype_1300 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_1301 = function() {
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
      var types, Ω_intertype_1302, Ω_intertype_1303;
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
      eq2(T, (Ω_intertype_1302 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_1303 = function() {
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
      var types, Ω_intertype_1304, Ω_intertype_1305, Ω_intertype_1306, Ω_intertype_1307, Ω_intertype_1308, Ω_intertype_1309;
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
      eq2(T, (Ω_intertype_1304 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_1305 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_1306 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_1307 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_1308 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_1309 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_1310, Ω_intertype_1311, Ω_intertype_1312, Ω_intertype_1313, Ω_intertype_1314, Ω_intertype_1315;
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
      eq2(T, (Ω_intertype_1310 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_1311 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_1312 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_1313 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_1314 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_1315 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_1316, Ω_intertype_1317, Ω_intertype_1318, Ω_intertype_1319, Ω_intertype_1320, Ω_intertype_1321, Ω_intertype_1322, Ω_intertype_1323, Ω_intertype_1324;
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
      eq2(T, (Ω_intertype_1316 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_1317 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_1318 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_1319 = function() {
        return types.isa.optional.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_1320 = function() {
        return types.isa.optional.person.address.city(null);
      }), true);
      eq2(T, (Ω_intertype_1321 = function() {
        return types.isa.optional.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_1322 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_1323 = function() {
        return types.isa.mycity(null);
      }), true);
      eq2(T, (Ω_intertype_1324 = function() {
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
  //     eq2 T, ( Ω_intertype_1325 = -> isa.float       null  ), false
  //     eq2 T, ( Ω_intertype_1326 = -> isa.float       true  ), false
  //     eq2 T, ( Ω_intertype_1327 = -> isa.float       0     ), true
  //     eq2 T, ( Ω_intertype_1328 = -> isa.maybefloat1 null  ), true
  //     eq2 T, ( Ω_intertype_1329 = -> isa.maybefloat1 true  ), false
  //     eq2 T, ( Ω_intertype_1330 = -> isa.maybefloat1 0     ), true
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
  //     eq2 T, ( Ω_intertype_1331 = -> isa.q             null                    ), false
  //     eq2 T, ( Ω_intertype_1332 = -> isa.q             {}                      ), true
  //     eq2 T, ( Ω_intertype_1333 = -> isa.q             { maybefloat2: null }   ), true
  //     eq2 T, ( Ω_intertype_1334 = -> isa.q             { maybefloat2: false }  ), false
  //     eq2 T, ( Ω_intertype_1335 = -> isa.q             { maybefloat2: 3 }      ), true
  //     eq2 T, ( Ω_intertype_1336 = -> isa.q.maybefloat2  null                   ), true
  //     eq2 T, ( Ω_intertype_1337 = -> isa.q.maybefloat2  true                   ), false
  //     eq2 T, ( Ω_intertype_1338 = -> isa.q.maybefloat2  0                      ), true
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
  //     safeguard T, => eq2 T, ( Ω_intertype_1339 = -> isa.q             null                    ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_1340 = -> isa.q             {}                      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_1341 = -> isa.q             { maybefloat3: null }   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_1342 = -> isa.q             { maybefloat3: false }  ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_1343 = -> isa.q             { maybefloat3: 3 }      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_1344 = -> isa.q.maybefloat3  null                   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_1345 = -> isa.q.maybefloat3  true                   ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_1346 = -> isa.q.maybefloat3  0                      ), true
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
  //     eq2 T, ( Ω_intertype_1347 = -> isa.person        null                                                            ), false
  //     eq2 T, ( Ω_intertype_1348 = -> isa.person        {}                                                              ), false
  //     eq2 T, ( Ω_intertype_1349 = -> isa.person        { name: 'Fred',                                               } ), false
  //     eq2 T, ( Ω_intertype_1350 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
  //     eq2 T, ( Ω_intertype_1351 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     eq2 T, ( Ω_intertype_1352 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
  //     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
  //     eq2 T, ( Ω_intertype_1353 = -> isa.maybesomeone  null                                                            ), true
  //     # eq2 T, ( Ω_intertype_1354 = -> isa.maybesomeone  {}                                                              ), false
  //     # eq2 T, ( Ω_intertype_1355 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
  //     # eq2 T, ( Ω_intertype_1356 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
  //     # eq2 T, ( Ω_intertype_1357 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     # eq2 T, ( Ω_intertype_1358 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
  //     # #.......................................................................................................
  //     return null
  //   #.........................................................................................................
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this.forbidden_to_define_fields_on_basetypes = async function(T, done) {
    var Intertype, declarations;
    ({Intertype, declarations} = require('../../../apps/intertype'));
    await (() => {      //.........................................................................................................
      var declare, isa, types, validate, Ω_intertype_1359, Ω_intertype_1360, Ω_intertype_1361, Ω_intertype_1362, Ω_intertype_1363, Ω_intertype_1364, Ω_intertype_1365;
      types = new Intertype();
      ({declare, validate, isa} = types);
      throws2(T, (Ω_intertype_1359 = function() {
        return types.declare({
          'optional.d': (function(x) {})
        });
      }), /illegal use of 'optional' in declaration of type 'optional.d'/);
      throws2(T, (Ω_intertype_1360 = function() {
        return types.declare({
          'anything.d': (function(x) {})
        });
      }), /illegal use of basetype 'anything' in declaration of type 'anything.d'/);
      throws2(T, (Ω_intertype_1361 = function() {
        return types.declare({
          'nothing.d': (function(x) {})
        });
      }), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/);
      throws2(T, (Ω_intertype_1362 = function() {
        return types.declare({
          'something.d': (function(x) {})
        });
      }), /illegal use of basetype 'something' in declaration of type 'something.d'/);
      throws2(T, (Ω_intertype_1363 = function() {
        return types.declare({
          'null.d': (function(x) {})
        });
      }), /illegal use of basetype 'null' in declaration of type 'null.d'/);
      throws2(T, (Ω_intertype_1364 = function() {
        return types.declare({
          'undefined.d': (function(x) {})
        });
      }), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/);
      throws2(T, (Ω_intertype_1365 = function() {
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
      var types, Ω_intertype_1366, Ω_intertype_1367, Ω_intertype_1368, Ω_intertype_1369, Ω_intertype_1370, Ω_intertype_1371, Ω_intertype_1372, Ω_intertype_1373, Ω_intertype_1374;
      types = new Intertype();
      eq2(T, (Ω_intertype_1366 = function() {
        return __type_of(_isa, null);
      }), 'null');
      eq2(T, (Ω_intertype_1367 = function() {
        return __type_of(_isa, void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_1368 = function() {
        return __type_of(_isa, 4);
      }), 'float');
      eq2(T, (Ω_intertype_1369 = function() {
        return __type_of(_isa, function() {});
      }), 'function');
      eq2(T, (Ω_intertype_1370 = function() {
        return __type_of(_isa, async function() {
          return (await null);
        });
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_1371 = function() {
        return __type_of(_isa, {});
      }), 'object');
      eq2(T, (Ω_intertype_1372 = function() {
        return __type_of(_isa, []);
      }), 'list');
      eq2(T, (Ω_intertype_1373 = function() {
        return __type_of(_isa, +2e308);
      }), 'infinity');
      eq2(T, (Ω_intertype_1374 = function() {
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
      var probe, result, sub, Ω_intertype_1375, Ω_intertype_1376, Ω_intertype_1377, Ω_intertype_1378, Ω_intertype_1379, Ω_intertype_1380;
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
      eq2(T, (Ω_intertype_1375 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_1376 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_1377 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_1378 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_1379 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_1380 = function() {
        return probe.bar.baz.sub === sub;
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var probe, result, sub, types, Ω_intertype_1381, Ω_intertype_1382, Ω_intertype_1383, Ω_intertype_1384, Ω_intertype_1385, Ω_intertype_1386;
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
      eq2(T, (Ω_intertype_1381 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_1382 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_1383 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_1384 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_1385 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_1386 = function() {
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
      var types, validate, Ω_intertype_1387, Ω_intertype_1388, Ω_intertype_1389, Ω_intertype_1390, Ω_intertype_1391, Ω_intertype_1392, Ω_intertype_1393, Ω_intertype_1394, Ω_intertype_1395, Ω_intertype_1396, Ω_intertype_1397, Ω_intertype_1398, Ω_intertype_1399, Ω_intertype_1400, Ω_intertype_1401;
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
      throws2(T, (Ω_intertype_1387 = function() {
        return validate.person(null);
      }), /expected a person, got a null/);
      throws2(T, (Ω_intertype_1388 = function() {
        return validate.person.address(null);
      }), /expected a person.address, got a null/);
      throws2(T, (Ω_intertype_1389 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city, got a null/);
      throws2(T, (Ω_intertype_1390 = function() {
        return validate.person.address.city.postcode(null);
      }), /expected a person.address.city.postcode, got a null/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1391 = function() {
        return types.isa.person.address.city.postcode(3);
      }), false);
      throws2(T, (Ω_intertype_1392 = function() {
        return validate.person.address.city.postcode(3);
      }), /expected a person.address.city.postcode/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1393 = function() {
        return types.isa.person.address.city({
          name: 'P'
        });
      }), false);
      throws2(T, (Ω_intertype_1394 = function() {
        return validate.person.address.city({
          name: 'P'
        });
      }), /expected a person.address.city/);
      // #.......................................................................................................
      eq2(T, (Ω_intertype_1395 = function() {
        return types.isa.person.address.city({
          postcode: '3421'
        });
      }), false);
      throws2(T, (Ω_intertype_1396 = function() {
        return validate.person.address.city();
      }), /method 'validate.person.address.city' expects 1 arguments, got 0/);
      throws2(T, (Ω_intertype_1397 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_1398 = function() {
        return validate.person.address.city('3421');
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_1399 = function() {
        return validate.person.address.city({
          postcode: '3421'
        });
      }), /expected a person.address.city/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1400 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: '3421'
        });
      }), true);
      eq2(T, (Ω_intertype_1401 = function() {
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
      var evaluate, isa, types, validate, Ω_intertype_1402, Ω_intertype_1403, Ω_intertype_1404, Ω_intertype_1405, Ω_intertype_1406, Ω_intertype_1407, Ω_intertype_1408, Ω_intertype_1409, Ω_intertype_1410, Ω_intertype_1411, Ω_intertype_1412, Ω_intertype_1413, Ω_intertype_1414, Ω_intertype_1415;
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
      throws2(T, (Ω_intertype_1402 = function() {
        return evaluate.optional(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      throws2(T, (Ω_intertype_1403 = function() {
        return evaluate.optional.person(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1404 = function() {
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
      eq2(T, (Ω_intertype_1405 = function() {
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
      eq2(T, (Ω_intertype_1406 = function() {
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
      eq2(T, (Ω_intertype_1407 = function() {
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
      eq2(T, (Ω_intertype_1408 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_1409 = function() {
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
      eq2(T, (Ω_intertype_1410 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_1411 = function() {
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
      eq2(T, (Ω_intertype_1412 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_1413 = function() {
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
      eq2(T, (Ω_intertype_1414 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_1415 = function() {
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
      var evaluate, isa, types, validate, Ω_intertype_1416, Ω_intertype_1417, Ω_intertype_1418, Ω_intertype_1419, Ω_intertype_1420, Ω_intertype_1421, Ω_intertype_1422, Ω_intertype_1423, Ω_intertype_1424, Ω_intertype_1425, Ω_intertype_1426, Ω_intertype_1427, Ω_intertype_1428, Ω_intertype_1429, Ω_intertype_1430;
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
      eq2(T, (Ω_intertype_1416 = function() {
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
      eq2(T, (Ω_intertype_1417 = function() {
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
      eq2(T, (Ω_intertype_1418 = function() {
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
      eq2(T, (Ω_intertype_1419 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_1420 = function() {
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
      eq2(T, (Ω_intertype_1421 = function() {
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
      eq2(T, (Ω_intertype_1422 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_1423 = function() {
        return evaluate.person(null);
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_1424 = function() {
        return Object.keys(evaluate.person(null));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1425 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_1426 = function() {
        return evaluate.person({});
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_1427 = function() {
        return Object.keys(evaluate.person({}));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1428 = function() {
        return isa.person.address({
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        });
      }), true);
      eq2(T, (Ω_intertype_1429 = function() {
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
      eq2(T, (Ω_intertype_1430 = function() {
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
      var Ω_intertype_1431, Ω_intertype_1432, Ω_intertype_1433, Ω_intertype_1434, Ω_intertype_1435, Ω_intertype_1436;
      eq2(T, (Ω_intertype_1431 = function() {
        return isa.generatorfunction(walk_prefixes);
      }), true);
      eq2(T, (Ω_intertype_1432 = function() {
        return [...(walk_prefixes('one'))];
      }), []);
      eq2(T, (Ω_intertype_1433 = function() {
        return [...(walk_prefixes('one.two'))];
      }), ['one']);
      eq2(T, (Ω_intertype_1434 = function() {
        return [...(walk_prefixes('one.two.three'))];
      }), ['one', 'one.two']);
      eq2(T, (Ω_intertype_1435 = function() {
        return [...(walk_prefixes('one.two.three.four'))];
      }), ['one', 'one.two', 'one.two.three']);
      /* TAINT should not allow empty namers: */
      eq2(T, (Ω_intertype_1436 = function() {
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
      var declarations, Ω_intertype_1437;
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
      throws2(T, (Ω_intertype_1437 = function() {
        var types;
        return types = new Intertype(declarations);
      }), /unknown partial type 'foo'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_1438, Ω_intertype_1439, Ω_intertype_1440, Ω_intertype_1441, Ω_intertype_1442, Ω_intertype_1443;
      declarations = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text'
      };
      types = new Intertype(declarations);
      eq2(T, (Ω_intertype_1438 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_1439 = function() {
        return types.isa.quantity({
          q: 12,
          u: 'kg'
        });
      }), true);
      eq2(T, (Ω_intertype_1440 = function() {
        return types.isa['quantity.q'](12);
      }), true);
      eq2(T, (Ω_intertype_1441 = function() {
        return types.isa['quantity.u']('kg');
      }), true);
      eq2(T, (Ω_intertype_1442 = function() {
        return types.isa.quantity.q(12);
      }), true);
      eq2(T, (Ω_intertype_1443 = function() {
        return types.isa.quantity.u('kg');
      }), true);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_qualifiers = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, Ω_intertype_1444, Ω_intertype_1445, Ω_intertype_1446, Ω_intertype_1447, Ω_intertype_1448, Ω_intertype_1449, Ω_intertype_1450, Ω_intertype_1451, Ω_intertype_1452, Ω_intertype_1453, Ω_intertype_1454, Ω_intertype_1455, Ω_intertype_1456;
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
      eq2(T, (Ω_intertype_1444 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_1445 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_1446 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1447 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_1448 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_1449 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1450 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_1451 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_1452 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_1453 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_1454 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_1455 = function() {
        return isa.nonempty.text(4);
      }), false);
      /* this doesn't make a terrible lot of sense: */
      eq2(T, (Ω_intertype_1456 = function() {
        return isa.empty({
          list: [],
          text: '',
          set: new Set()
        });
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_1457, Ω_intertype_1458, Ω_intertype_1459, Ω_intertype_1460, Ω_intertype_1461, Ω_intertype_1462, Ω_intertype_1463, Ω_intertype_1464, Ω_intertype_1465, Ω_intertype_1466, Ω_intertype_1467, Ω_intertype_1468, Ω_intertype_1469, Ω_intertype_1470, Ω_intertype_1471, Ω_intertype_1472, Ω_intertype_1473, Ω_intertype_1474, Ω_intertype_1475, Ω_intertype_1476, Ω_intertype_1477, Ω_intertype_1478, Ω_intertype_1479, Ω_intertype_1480;
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
      eq2(T, (Ω_intertype_1457 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_1458 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_1459 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1460 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_1461 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_1462 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1463 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_1464 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_1465 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_1466 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_1467 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_1468 = function() {
        return isa.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1469 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_1470 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_1471 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_1472 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_1473 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_1474 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1475 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_1476 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_1477 = function() {
        return validate.empty(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_1478 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_1479 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_1480 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_optional_with_qualifiers = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_1481, Ω_intertype_1482, Ω_intertype_1483, Ω_intertype_1484, Ω_intertype_1485, Ω_intertype_1486, Ω_intertype_1487, Ω_intertype_1488, Ω_intertype_1489, Ω_intertype_1490, Ω_intertype_1491, Ω_intertype_1492, Ω_intertype_1493, Ω_intertype_1494, Ω_intertype_1495, Ω_intertype_1496, Ω_intertype_1497, Ω_intertype_1498, Ω_intertype_1499, Ω_intertype_1500, Ω_intertype_1501, Ω_intertype_1502, Ω_intertype_1503, Ω_intertype_1504, Ω_intertype_1505, Ω_intertype_1506, Ω_intertype_1507, Ω_intertype_1508, Ω_intertype_1509, Ω_intertype_1510, Ω_intertype_1511, Ω_intertype_1512, Ω_intertype_1513, Ω_intertype_1514, Ω_intertype_1515, Ω_intertype_1516, Ω_intertype_1517;
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
      eq2(T, (Ω_intertype_1481 = function() {
        return isa.optional.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_1482 = function() {
        return isa.optional.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_1483 = function() {
        return isa.optional.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1484 = function() {
        return isa.optional.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_1485 = function() {
        return isa.optional.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_1486 = function() {
        return isa.optional.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_1487 = function() {
        return isa.optional.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_1488 = function() {
        return isa.optional.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_1489 = function() {
        return isa.optional.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_1490 = function() {
        return isa.optional.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_1491 = function() {
        return isa.optional.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_1492 = function() {
        return isa.optional.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1493 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_1494 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_1495 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_1496 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_1497 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_1498 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1499 = function() {
        return validate.optional.empty([]);
      }), []);
      eq2(T, (Ω_intertype_1500 = function() {
        return validate.optional.empty('');
      }), '');
      eq2(T, (Ω_intertype_1501 = function() {
        return validate.optional.empty(new Set());
      }), new Set());
      eq2(T, (Ω_intertype_1502 = function() {
        return validate.optional.empty.list([]);
      }), []);
      eq2(T, (Ω_intertype_1503 = function() {
        return validate.optional.empty.text('');
      }), '');
      eq2(T, (Ω_intertype_1504 = function() {
        return validate.optional.empty.set(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_1505 = function() {
        return validate.optional.empty([1]);
      }), /expected an optional empty, got a list/);
      throws2(T, (Ω_intertype_1506 = function() {
        return validate.optional.empty('A');
      }), /expected an optional empty, got a text/);
      throws2(T, (Ω_intertype_1507 = function() {
        return validate.optional.empty(new Set('abc'));
      }), /expected an optional empty, got a set/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_1508 = function() {
        return isa.optional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_1509 = function() {
        return isa.optional.empty('');
      }), true);
      eq2(T, (Ω_intertype_1510 = function() {
        return isa.optional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_1511 = function() {
        return isa.optional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_1512 = function() {
        return isa.optional.empty('A');
      }), false);
      eq2(T, (Ω_intertype_1513 = function() {
        return isa.optional.empty(new Set('abc'));
      }), false);
      eq2(T, (Ω_intertype_1514 = function() {
        return validate.optional.empty(null);
      }), null);
      eq2(T, (Ω_intertype_1515 = function() {
        return validate.optional.empty.list(null);
      }), null);
      eq2(T, (Ω_intertype_1516 = function() {
        return validate.optional.empty.text(null);
      }), null);
      eq2(T, (Ω_intertype_1517 = function() {
        return validate.optional.empty.set(null);
      }), null);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_rhs_optional = function(T, done) {
    var Intertype;
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var Ω_intertype_1518, Ω_intertype_1519, Ω_intertype_1520, Ω_intertype_1521, Ω_intertype_1522, Ω_intertype_1523;
      /* TAINT observe the out-comment messages would perhaps make more sense as they are more specific */
      eq2(T, (Ω_intertype_1518 = function() {
        return (new Intertype()).declare({
          foo: 'float'
        });
      }), null);
      eq2(T, (Ω_intertype_1519 = function() {
        return (new Intertype()).declare({
          foo: 'text'
        });
      }), null);
      // ( new Intertype() ).declare { foo: 'optional', }
      throws2(T, (Ω_intertype_1520 = function() {
        return (new Intertype()).declare({
          foo: 'optional'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_1521 = function() {
        return (new Intertype()).declare({
          foo: 'qqq'
        });
      }), /unknown type 'qqq'/);
      throws2(T, (Ω_intertype_1522 = function() {
        return (new Intertype()).declare({
          foo: 'optional.float'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_1523 = function() {
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
      var isa, validate, Ω_intertype_1524, Ω_intertype_1525, Ω_intertype_1526, Ω_intertype_1527, Ω_intertype_1528, Ω_intertype_1529, Ω_intertype_1530, Ω_intertype_1531, Ω_intertype_1532, Ω_intertype_1533, Ω_intertype_1534, Ω_intertype_1535, Ω_intertype_1536, Ω_intertype_1537, Ω_intertype_1538, Ω_intertype_1539;
      ({isa, validate} = new Intertype({
        normalfloat: (function(x) {
          return (this.isa.float(x)) && ((0 <= x && x <= 1));
        })
      }));
      eq2(T, (Ω_intertype_1524 = function() {
        return isa.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_1525 = function() {
        return isa.normalfloat(null);
      }), false);
      eq2(T, (Ω_intertype_1526 = function() {
        return isa.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_1527 = function() {
        return isa.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_1528 = function() {
        return isa.optional.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_1529 = function() {
        return isa.optional.normalfloat(null);
      }), true);
      eq2(T, (Ω_intertype_1530 = function() {
        return isa.optional.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_1531 = function() {
        return isa.optional.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_1532 = function() {
        return validate.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_1533 = function() {
        return validate.optional.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_1534 = function() {
        return validate.optional.normalfloat(null);
      }), null);
      throws2(T, (Ω_intertype_1535 = function() {
        return validate.normalfloat(null);
      }), /expected a normalfloat, got a null/);
      throws2(T, (Ω_intertype_1536 = function() {
        return validate.normalfloat(-1);
      }), /expected a normalfloat, got a float/);
      throws2(T, (Ω_intertype_1537 = function() {
        return validate.normalfloat('?');
      }), /expected a normalfloat, got a text/);
      throws2(T, (Ω_intertype_1538 = function() {
        return validate.optional.normalfloat(-1);
      }), /expected an optional normalfloat, got a float/);
      throws2(T, (Ω_intertype_1539 = function() {
        return validate.optional.normalfloat('?');
      }), /expected an optional normalfloat, got a text/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var isa, my_types, types, validate, Ω_intertype_1540, Ω_intertype_1541, Ω_intertype_1542, Ω_intertype_1543, Ω_intertype_1544, Ω_intertype_1545, Ω_intertype_1546, Ω_intertype_1547, Ω_intertype_1548, Ω_intertype_1549, Ω_intertype_1550, Ω_intertype_1551, Ω_intertype_1552, Ω_intertype_1553, Ω_intertype_1554, Ω_intertype_1555, Ω_intertype_1556, Ω_intertype_1557, Ω_intertype_1558, Ω_intertype_1559, Ω_intertype_1560, Ω_intertype_1561, Ω_intertype_1562, Ω_intertype_1563, Ω_intertype_1564, Ω_intertype_1565, Ω_intertype_1566, Ω_intertype_1567, Ω_intertype_1568, Ω_intertype_1569, Ω_intertype_1570;
      my_types = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text',
        'foo': 'object',
        'foo.bar': 'object',
        'foo.bar.baz': 'float'
      };
      ({isa, validate} = types = new Intertype(my_types));
      eq2(T, (Ω_intertype_1540 = function() {
        return isa.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_1541 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_1542 = function() {
        return isa.optional.quantity({
          q: 2,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_1543 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_1544 = function() {
        return validate.quantity({
          q: 3,
          u: 'm'
        });
      }), {
        q: 3,
        u: 'm'
      });
      eq2(T, (Ω_intertype_1545 = function() {
        return validate.optional.quantity({
          q: 4,
          u: 'm'
        });
      }), {
        q: 4,
        u: 'm'
      });
      eq2(T, (Ω_intertype_1546 = function() {
        return validate.optional.quantity.q(null);
      }), null);
      eq2(T, (Ω_intertype_1547 = function() {
        return validate.optional.quantity.q(111);
      }), 111);
      eq2(T, (Ω_intertype_1548 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_1549 = function() {
        return isa.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_1550 = function() {
        return isa.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_1551 = function() {
        return isa.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_1552 = function() {
        return isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_1553 = function() {
        return isa.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_1554 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_1555 = function() {
        return isa.optional.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_1556 = function() {
        return isa.optional.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_1557 = function() {
        return isa.optional.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_1558 = function() {
        return isa.optional.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_1559 = function() {
        return validate.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_1560 = function() {
        return validate.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_1561 = function() {
        return validate.optional.quantity(null);
      }), null);
      throws2(T, (Ω_intertype_1562 = function() {
        return validate.quantity({
          q: 5
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_1563 = function() {
        return validate.quantity(null);
      }), /expected a quantity, got a null/);
      throws2(T, (Ω_intertype_1564 = function() {
        return validate.quantity(-1);
      }), /expected a quantity, got a float/);
      throws2(T, (Ω_intertype_1565 = function() {
        return validate.quantity('?');
      }), /expected a quantity, got a text/);
      throws2(T, (Ω_intertype_1566 = function() {
        return validate.quantity({
          q: 1
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_1567 = function() {
        return validate.optional.quantity(-1);
      }), /expected an optional quantity, got a float/);
      throws2(T, (Ω_intertype_1568 = function() {
        return validate.optional.quantity({
          q: 1
        });
      }), /expected an optional quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_1569 = function() {
        return validate.optional.quantity.q({
          q: 1
        });
      }), /expected an optional quantity.q, got a object/);
      throws2(T, (Ω_intertype_1570 = function() {
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
      var declarations, Ω_intertype_1571, Ω_intertype_1572, Ω_intertype_1573, Ω_intertype_1574, Ω_intertype_1575;
      ({declarations} = new Intertype());
      eq2(T, (Ω_intertype_1571 = function() {
        return declarations.float.role;
      }), 'usertype');
      eq2(T, (Ω_intertype_1572 = function() {
        return declarations.null.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_1573 = function() {
        return declarations.anything.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_1574 = function() {
        return declarations.unknown.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_1575 = function() {
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
      var Ω_intertype_1576, Ω_intertype_1577, Ω_intertype_1578, Ω_intertype_1579;
      eq2(T, (Ω_intertype_1576 = function() {
        return type_of(null);
      }), 'null');
      eq2(T, (Ω_intertype_1577 = function() {
        return type_of(void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_1578 = function() {
        return type_of(+2e308);
      }), 'unknown');
      eq2(T, (Ω_intertype_1579 = function() {
        return type_of(4);
      }), 'unknown');
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_1580, Ω_intertype_1581, Ω_intertype_1582, Ω_intertype_1583;
      eq2(T, (Ω_intertype_1580 = function() {
        return isa.anything(1);
      }), true);
      eq2(T, (Ω_intertype_1581 = function() {
        return isa.nothing(1);
      }), false);
      eq2(T, (Ω_intertype_1582 = function() {
        return isa.something(1);
      }), true);
      eq2(T, (Ω_intertype_1583 = function() {
        return isa.unknown(1);
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_1584, Ω_intertype_1585, Ω_intertype_1586, Ω_intertype_1587;
      eq2(T, (Ω_intertype_1584 = function() {
        return isa.anything(null);
      }), true);
      eq2(T, (Ω_intertype_1585 = function() {
        return isa.nothing(null);
      }), true);
      eq2(T, (Ω_intertype_1586 = function() {
        return isa.something(null);
      }), false);
      eq2(T, (Ω_intertype_1587 = function() {
        return isa.unknown(null);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_1588, Ω_intertype_1589, Ω_intertype_1590, Ω_intertype_1591;
      eq2(T, (Ω_intertype_1588 = function() {
        return isa.anything(void 0);
      }), true);
      eq2(T, (Ω_intertype_1589 = function() {
        return isa.nothing(void 0);
      }), true);
      eq2(T, (Ω_intertype_1590 = function() {
        return isa.something(void 0);
      }), false);
      eq2(T, (Ω_intertype_1591 = function() {
        return isa.unknown(void 0);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_1592, Ω_intertype_1593, Ω_intertype_1594;
      throws2(T, (Ω_intertype_1592 = function() {
        return isa.optional(1);
      }), /`optional` is not a legal type for `isa` methods/);
      throws2(T, (Ω_intertype_1593 = function() {
        return validate.optional(1);
      }), /`optional` is not a legal type for `validate` methods/);
      throws2(T, (Ω_intertype_1594 = function() {
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
      // @can_use_optional_with_qualifiers()
      // test @can_use_optional_with_qualifiers
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map