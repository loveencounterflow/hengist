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
    var INTERTYPE, Ω_intertype_1, Ω_intertype_10, Ω_intertype_11, Ω_intertype_13, Ω_intertype_15, Ω_intertype_16, Ω_intertype_17, Ω_intertype_18, Ω_intertype_19, Ω_intertype_2, Ω_intertype_20, Ω_intertype_21, Ω_intertype_22, Ω_intertype_23, Ω_intertype_28, Ω_intertype_29, Ω_intertype_3, Ω_intertype_4, Ω_intertype_5, Ω_intertype_6, Ω_intertype_7, Ω_intertype_8, Ω_intertype_9;
    INTERTYPE = require('../../../apps/intertype');
    eq2(T, (Ω_intertype_1 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_2 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa);
    }), true);
    eq2(T, (Ω_intertype_3 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_4 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate);
    }), true);
    eq2(T, (Ω_intertype_5 = function() {
      return TMP_types.isa.undefined(INTERTYPE.types.get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_6 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa);
    }), true);
    eq2(T, (Ω_intertype_7 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_isa_optional);
    }), true);
    eq2(T, (Ω_intertype_8 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate);
    }), true);
    eq2(T, (Ω_intertype_9 = function() {
      return TMP_types.isa.function(INTERTYPE.types._get_validate_optional);
    }), true);
    eq2(T, (Ω_intertype_10 = function() {
      return TMP_types.isa.object(INTERTYPE.types);
    }), true);
    eq2(T, (Ω_intertype_11 = function() {
      return TMP_types.isa.object(INTERTYPE.types.isa);
    }), true);
    // eq2 T, ( Ω_intertype_12 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
    eq2(T, (Ω_intertype_13 = function() {
      return TMP_types.isa.object(INTERTYPE.types.validate);
    }), true);
    // eq2 T, ( Ω_intertype_14 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
    eq2(T, (Ω_intertype_15 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.boolean);
    }), true);
    eq2(T, (Ω_intertype_16 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_17 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.boolean);
    }), true);
    eq2(T, (Ω_intertype_18 = function() {
      return TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean);
    }), true);
    eq2(T, (Ω_intertype_19 = function() {
      return TMP_types.isa.object(INTERTYPE.types.create);
    }), true);
    eq2(T, (Ω_intertype_20 = function() {
      return TMP_types.isa.function(INTERTYPE.types.isa.text);
    }), true);
    eq2(T, (Ω_intertype_21 = function() {
      return TMP_types.isa.function(INTERTYPE.types.create.text);
    }), true);
    eq2(T, (Ω_intertype_22 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations);
    }), true);
    eq2(T, (Ω_intertype_23 = function() {
      return TMP_types.isa.object(INTERTYPE.types.declarations.text);
    }), true);
    //.........................................................................................................
    // eq2 T, ( Ω_intertype_24 = -> INTERTYPE.types.isa.name           ), 'isa'
    // eq2 T, ( Ω_intertype_25 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
    // eq2 T, ( Ω_intertype_26 = -> INTERTYPE.types.validate.name      ), 'validate'
    // eq2 T, ( Ω_intertype_27 = -> INTERTYPE.types.create.name        ), 'create'
    eq2(T, (Ω_intertype_28 = function() {
      return INTERTYPE.types.declare.name;
    }), 'declare');
    eq2(T, (Ω_intertype_29 = function() {
      return INTERTYPE.types.type_of.name;
    }), 'type_of');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality_using_types_object = function(T, done) {
    var INTERTYPE, ref1, ref10, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, types, Ω_intertype_27, Ω_intertype_30, Ω_intertype_31, Ω_intertype_32, Ω_intertype_33, Ω_intertype_34, Ω_intertype_35, Ω_intertype_36, Ω_intertype_37, Ω_intertype_38, Ω_intertype_39, Ω_intertype_40, Ω_intertype_41, Ω_intertype_42, Ω_intertype_43, Ω_intertype_44, Ω_intertype_45, Ω_intertype_46, Ω_intertype_47, Ω_intertype_48, Ω_intertype_49, Ω_intertype_50, Ω_intertype_51, Ω_intertype_52, Ω_intertype_53, Ω_intertype_54, Ω_intertype_55;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype_minimal(sample_declarations);
    eq2(T, (Ω_intertype_30 = function() {
      return types.isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_31 = function() {
      return types.isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_32 = function() {
      return types.isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_33 = function() {
      return types.isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_34 = function() {
      return types.isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_35 = function() {
      return types.isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_36 = function() {
      return types.isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_37 = function() {
      return types.isa.optional.boolean(1);
    }), false);
    //.........................................................................................................
    eq2(T, (Ω_intertype_38 = function() {
      return types.validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_39 = function() {
      return types.validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_40 = function() {
      return types.validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_41 = function() {
      return types.validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_42 = function() {
      return types.validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_43 = function() {
      return types.validate.optional.boolean(null);
    }), null);
    try_and_show(T, function() {
      return types.validate.boolean(1);
    });
    try_and_show(T, function() {
      return types.validate.optional.boolean(1);
    });
    throws2(T, (Ω_intertype_27 = function() {
      return types.validate.boolean(1);
    }), /expected a boolean/);
    throws2(T, (Ω_intertype_27 = function() {
      return types.validate.optional.boolean(1);
    }), /expected an optional boolean/);
    //.........................................................................................................
    eq2(T, (Ω_intertype_44 = function() {
      return types.type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_45 = function() {
      return types.type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_46 = function() {
      return types.type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_47 = function() {
      return types.type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_48 = function() {
      return types.type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_49 = function() {
      return types.type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_50 = function() {
      return types.type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_51 = function() {
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
    eq2(T, (Ω_intertype_52 = function() {
      return types.isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_53 = function() {
      return types.isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_54 = function() {
      return types.validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_55 = function() {
      return types.validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
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
    var INTERTYPE, isa, type_of, validate, Ω_intertype_56, Ω_intertype_57, Ω_intertype_58, Ω_intertype_59, Ω_intertype_60, Ω_intertype_61, Ω_intertype_62, Ω_intertype_63, Ω_intertype_64, Ω_intertype_65, Ω_intertype_66, Ω_intertype_67, Ω_intertype_68, Ω_intertype_69, Ω_intertype_70, Ω_intertype_71, Ω_intertype_72, Ω_intertype_73, Ω_intertype_74, Ω_intertype_75, Ω_intertype_76, Ω_intertype_77, Ω_intertype_78, Ω_intertype_79, Ω_intertype_80, Ω_intertype_81, Ω_intertype_82, Ω_intertype_83, Ω_intertype_84, Ω_intertype_85, Ω_intertype_86, Ω_intertype_87;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    eq2(T, (Ω_intertype_56 = function() {
      return isa.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_57 = function() {
      return isa.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_58 = function() {
      return isa.boolean(null);
    }), false);
    eq2(T, (Ω_intertype_59 = function() {
      return isa.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_60 = function() {
      return isa.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_61 = function() {
      return isa.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_62 = function() {
      return isa.optional.boolean(false);
    }), true);
    eq2(T, (Ω_intertype_63 = function() {
      return isa.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_64 = function() {
      return isa.optional.boolean(null);
    }), true);
    eq2(T, (Ω_intertype_65 = function() {
      return isa.optional.boolean(1);
    }), false);
    eq2(T, (Ω_intertype_66 = function() {
      return isa.optional.unknown(1);
    }), false);
    eq2(T, (Ω_intertype_67 = function() {
      return isa.optional.unknown(2e308);
    }), true);
    eq2(T, (Ω_intertype_68 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    eq2(T, (Ω_intertype_69 = function() {
      return isa.optional.unknown(void 0);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_70 = function() {
      return validate.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_71 = function() {
      return validate.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_72 = function() {
      return validate.optional.boolean(true);
    }), true);
    eq2(T, (Ω_intertype_73 = function() {
      return validate.optional.boolean(false);
    }), false);
    eq2(T, (Ω_intertype_74 = function() {
      return validate.optional.boolean(void 0);
    }), void 0);
    eq2(T, (Ω_intertype_75 = function() {
      return validate.optional.boolean(null);
    }), null);
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
    eq2(T, (Ω_intertype_76 = function() {
      return type_of(null);
    }), 'null');
    eq2(T, (Ω_intertype_77 = function() {
      return type_of(void 0);
    }), 'undefined');
    eq2(T, (Ω_intertype_78 = function() {
      return type_of(false);
    }), 'boolean');
    eq2(T, (Ω_intertype_79 = function() {
      return type_of(Symbol('p'));
    }), 'symbol');
    eq2(T, (Ω_intertype_80 = function() {
      return type_of({});
    }), 'object');
    eq2(T, (Ω_intertype_81 = function() {
      return type_of(0/0);
    }), 'unknown');
    eq2(T, (Ω_intertype_82 = function() {
      return type_of(+2e308);
    }), 'unknown');
    eq2(T, (Ω_intertype_83 = function() {
      return type_of(-2e308);
    }), 'unknown');
    //.........................................................................................................
    eq2(T, (Ω_intertype_84 = function() {
      return isa.asyncfunction.name;
    }), 'isa.asyncfunction');
    eq2(T, (Ω_intertype_85 = function() {
      return isa.optional.asyncfunction.name;
    }), 'isa.optional.asyncfunction');
    eq2(T, (Ω_intertype_86 = function() {
      return validate.asyncfunction.name;
    }), 'validate.asyncfunction');
    eq2(T, (Ω_intertype_87 = function() {
      return validate.optional.asyncfunction.name;
    }), 'validate.optional.asyncfunction');
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
    var INTERTYPE, isa, type_of, validate, Ω_intertype_88, Ω_intertype_89, Ω_intertype_90, Ω_intertype_91, Ω_intertype_92, Ω_intertype_93, Ω_intertype_94, Ω_intertype_95, Ω_intertype_96, Ω_intertype_97;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    ({isa, validate, type_of} = new INTERTYPE.Intertype_minimal(sample_declarations));
    //.........................................................................................................
    throws2(T, (Ω_intertype_88 = function() {
      return isa.float(3, 4);
    }), /method 'isa.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_89 = function() {
      return isa.float();
    }), /method 'isa.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_90 = function() {
      return isa.optional.float(3, 4);
    }), /method 'isa.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_91 = function() {
      return isa.optional.float();
    }), /method 'isa.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_92 = function() {
      return validate.float(3, 4);
    }), /method 'validate.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_93 = function() {
      return validate.float();
    }), /method 'validate.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_94 = function() {
      return validate.optional.float(3, 4);
    }), /method 'validate.optional.float' expects 1 arguments, got 2/);
    throws2(T, (Ω_intertype_95 = function() {
      return validate.optional.float();
    }), /method 'validate.optional.float' expects 1 arguments, got 0/);
    throws2(T, (Ω_intertype_96 = function() {
      return type_of(3, 4);
    }), /expected 1 arguments, got 2/);
    throws2(T, (Ω_intertype_97 = function() {
      return type_of();
    }), /expected 1 arguments, got 0/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.same_basic_types = function(T, done) {
    var $function, asyncfunction, asyncgenerator, asyncgeneratorfunction, boolean, generator, generatorfunction, isa, symbol, type_of, validate, Ω_intertype_100, Ω_intertype_101, Ω_intertype_102, Ω_intertype_103, Ω_intertype_104, Ω_intertype_105, Ω_intertype_106, Ω_intertype_107, Ω_intertype_108, Ω_intertype_109, Ω_intertype_110, Ω_intertype_111, Ω_intertype_112, Ω_intertype_113, Ω_intertype_114, Ω_intertype_115, Ω_intertype_116, Ω_intertype_117, Ω_intertype_118, Ω_intertype_119, Ω_intertype_120, Ω_intertype_121, Ω_intertype_98, Ω_intertype_99;
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
    eq2(T, (Ω_intertype_98 = function() {
      return isa.boolean(boolean);
    }), true);
    eq2(T, (Ω_intertype_99 = function() {
      return isa.function($function);
    }), true);
    eq2(T, (Ω_intertype_100 = function() {
      return isa.asyncfunction(asyncfunction);
    }), true);
    eq2(T, (Ω_intertype_101 = function() {
      return isa.generatorfunction(generatorfunction);
    }), true);
    eq2(T, (Ω_intertype_102 = function() {
      return isa.asyncgeneratorfunction(asyncgeneratorfunction);
    }), true);
    eq2(T, (Ω_intertype_103 = function() {
      return isa.asyncgenerator(asyncgenerator);
    }), true);
    eq2(T, (Ω_intertype_104 = function() {
      return isa.generator(generator);
    }), true);
    eq2(T, (Ω_intertype_105 = function() {
      return isa.symbol(symbol);
    }), true);
    //.........................................................................................................
    eq2(T, (Ω_intertype_106 = function() {
      return validate.boolean(boolean);
    }), boolean);
    eq2(T, (Ω_intertype_107 = function() {
      return validate.function($function);
    }), $function);
    eq2(T, (Ω_intertype_108 = function() {
      return validate.asyncfunction(asyncfunction);
    }), asyncfunction);
    eq2(T, (Ω_intertype_109 = function() {
      return validate.generatorfunction(generatorfunction);
    }), generatorfunction);
    eq2(T, (Ω_intertype_110 = function() {
      return validate.asyncgeneratorfunction(asyncgeneratorfunction);
    }), asyncgeneratorfunction);
    eq2(T, (Ω_intertype_111 = function() {
      return validate.asyncgenerator(asyncgenerator);
    }), asyncgenerator);
    eq2(T, (Ω_intertype_112 = function() {
      return validate.generator(generator);
    }), generator);
    eq2(T, (Ω_intertype_113 = function() {
      return validate.symbol(symbol);
    }), symbol);
    //.........................................................................................................
    eq2(T, (Ω_intertype_114 = function() {
      return type_of(boolean);
    }), 'boolean');
    eq2(T, (Ω_intertype_115 = function() {
      return type_of($function);
    }), 'function');
    eq2(T, (Ω_intertype_116 = function() {
      return type_of(asyncfunction);
    }), 'asyncfunction');
    eq2(T, (Ω_intertype_117 = function() {
      return type_of(generatorfunction);
    }), 'generatorfunction');
    eq2(T, (Ω_intertype_118 = function() {
      return type_of(asyncgeneratorfunction);
    }), 'asyncgeneratorfunction');
    eq2(T, (Ω_intertype_119 = function() {
      return type_of(asyncgenerator);
    }), 'asyncgenerator');
    eq2(T, (Ω_intertype_120 = function() {
      return type_of(generator);
    }), 'generator');
    eq2(T, (Ω_intertype_121 = function() {
      return type_of(symbol);
    }), 'symbol');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throw_instructive_error_on_missing_type = function(T, done) {
    var INTERTYPE, isa, type_of, validate, Ω_intertype_122, Ω_intertype_123, Ω_intertype_124, Ω_intertype_125, Ω_intertype_126, Ω_intertype_127, Ω_intertype_128, Ω_intertype_129, Ω_intertype_130, Ω_intertype_131, Ω_intertype_132, Ω_intertype_133, Ω_intertype_134, Ω_intertype_135, Ω_intertype_136, Ω_intertype_137;
    // T?.halt_on_error()
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
    throws2(T, (Ω_intertype_122 = function() {
      return isa.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_123 = function() {
      return isa.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_124 = function() {
      return isa.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_125 = function() {
      return isa.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_126 = function() {
      return isa.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_127 = function() {
      return isa.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_128 = function() {
      return isa.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_129 = function() {
      return isa.optional.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_130 = function() {
      return validate.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_131 = function() {
      return validate.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_132 = function() {
      return validate.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_133 = function() {
      return validate.quux(3, 4);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_134 = function() {
      return validate.optional.quux;
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_135 = function() {
      return validate.optional.quux();
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_136 = function() {
      return validate.optional.quux(3);
    }), /unknown type 'quux'/);
    throws2(T, (Ω_intertype_137 = function() {
      return validate.optional.quux(3, 4);
    }), /unknown type 'quux'/);
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
    var Intertype, Ω_intertype_138, Ω_intertype_139, Ω_intertype_140, Ω_intertype_141, Ω_intertype_142, Ω_intertype_143, Ω_intertype_144, Ω_intertype_145, Ω_intertype_146, Ω_intertype_147;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    throws2(T, (Ω_intertype_138 = function() {
      return new Intertype({
        foo: (function() {})
      });
    }), /expected function with 1 parameters, got one with 0/);
    throws2(T, (Ω_intertype_139 = function() {
      return new Intertype({
        foo: (function(a, b) {})
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_140 = function() {
      return new Intertype({
        foo: true
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_141 = function() {
      return new Intertype({
        foo: void 0
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_142 = function() {
      return new Intertype({
        foo: null
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_143 = function() {
      return new Intertype({
        foo: {}
      });
    }), /expected type name, method, or object to indicate test method, got a undefined/);
    throws2(T, (Ω_intertype_144 = function() {
      return new Intertype({
        foo: {
          test: null
        }
      });
    }), /expected type name, method, or object to indicate test method, got a null/);
    throws2(T, (Ω_intertype_145 = function() {
      return new Intertype({
        foo: {
          test: false
        }
      });
    }), /expected type name, method, or object to indicate test method, got a boolean/);
    throws2(T, (Ω_intertype_146 = function() {
      return new Intertype({
        foo: {
          test: (function(a, b) {})
        }
      });
    }), /expected function with 1 parameters, got one with 2/);
    throws2(T, (Ω_intertype_147 = function() {
      return new Intertype({
        foo: 'quux'
      });
    }), /unknown type 'quux'/);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.allow_declaration_objects = function(T, done) {
    var Intertype_minimal;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_148, Ω_intertype_149, Ω_intertype_150, Ω_intertype_151;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        template: 0
      };
      types = new Intertype_minimal(declarations);
      eq2(T, (Ω_intertype_148 = function() {
        return TMP_types.isa.function(types.isa.integer);
      }), true);
      eq2(T, (Ω_intertype_149 = function() {
        return types.isa.integer.length;
      }), 1);
      eq2(T, (Ω_intertype_150 = function() {
        return types.isa.integer(123);
      }), true);
      eq2(T, (Ω_intertype_151 = function() {
        return types.isa.integer(123.456);
      }), false);
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
      var declarations, Ω_intertype_152;
      declarations = {...sample_declarations};
      declarations.integer = {
        test: function(x) {
          return Number.isInteger(x);
        },
        create: async function() {
          return (await 0);
        }
      };
      throws2(T, (Ω_intertype_152 = function() {
        return new Intertype_minimal(declarations);
      }), /expected a function for `create` entry of type 'integer', got a asyncfunction/);
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
      var declarations, Ω_intertype_153;
      declarations = {...sample_declarations};
      declarations.foolist = {
        test: function(x) {
          return true;
        },
        template: function(n) {
          return [n];
        }
      };
      throws2(T, (Ω_intertype_153 = function() {
        return new Intertype_minimal(declarations);
      }), /template method for type 'foolist' has arity 1 but must be nullary/);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_knows_its_base_types = function(T, done) {
    var isa, Ω_intertype_154, Ω_intertype_155, Ω_intertype_156, Ω_intertype_157, Ω_intertype_158, Ω_intertype_159, Ω_intertype_160, Ω_intertype_161, Ω_intertype_162, Ω_intertype_163, Ω_intertype_164, Ω_intertype_165, Ω_intertype_166, Ω_intertype_167, Ω_intertype_168;
    // T?.halt_on_error()
    ({isa} = require('../../../apps/intertype'));
    //.........................................................................................................
    eq2(T, (Ω_intertype_154 = function() {
      return isa.basetype('optional');
    }), false);
    eq2(T, (Ω_intertype_155 = function() {
      return isa.basetype('anything');
    }), true);
    eq2(T, (Ω_intertype_156 = function() {
      return isa.basetype('nothing');
    }), true);
    eq2(T, (Ω_intertype_157 = function() {
      return isa.basetype('something');
    }), true);
    eq2(T, (Ω_intertype_158 = function() {
      return isa.basetype('null');
    }), true);
    eq2(T, (Ω_intertype_159 = function() {
      return isa.basetype('undefined');
    }), true);
    eq2(T, (Ω_intertype_160 = function() {
      return isa.basetype('unknown');
    }), true);
    eq2(T, (Ω_intertype_161 = function() {
      return isa.basetype('integer');
    }), false);
    eq2(T, (Ω_intertype_162 = function() {
      return isa.basetype('float');
    }), false);
    eq2(T, (Ω_intertype_163 = function() {
      return isa.basetype('basetype');
    }), false);
    eq2(T, (Ω_intertype_164 = function() {
      return isa.basetype('quux');
    }), false);
    eq2(T, (Ω_intertype_165 = function() {
      return isa.basetype('toString');
    }), false);
    eq2(T, (Ω_intertype_166 = function() {
      return isa.basetype(null);
    }), false);
    eq2(T, (Ω_intertype_167 = function() {
      return isa.basetype(void 0);
    }), false);
    eq2(T, (Ω_intertype_168 = function() {
      return isa.basetype(4);
    }), false);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.disallow_licensed_overrides = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_169, Ω_intertype_170, Ω_intertype_171, Ω_intertype_172;
      types = new Intertype();
      eq2(T, (Ω_intertype_169 = function() {
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
      throws2(T, (Ω_intertype_170 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_171 = function() {
        return types.isa.float(4);
      }), true);
      eq2(T, (Ω_intertype_172 = function() {
        return types.isa.float('float');
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_173, Ω_intertype_174;
      types = new Intertype();
      eq2(T, (Ω_intertype_173 = function() {
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
      throws2(T, (Ω_intertype_174 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare type 'float'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var overrides, types, Ω_intertype_175, Ω_intertype_176, Ω_intertype_177, Ω_intertype_178;
      types = new Intertype();
      eq2(T, (Ω_intertype_175 = function() {
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
      throws2(T, (Ω_intertype_176 = function() {
        return types.declare(overrides);
      }), /not allowed to re-declare basetype 'anything'/);
      //.......................................................................................................
      /* pre-existing declaration remains valid: */
      eq2(T, (Ω_intertype_177 = function() {
        return types.isa.anything(4);
      }), true);
      eq2(T, (Ω_intertype_178 = function() {
        return types.isa.anything('float');
      }), true);
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
      var declarations, types, Ω_intertype_179, Ω_intertype_180, Ω_intertype_181, Ω_intertype_182, Ω_intertype_183, Ω_intertype_184, Ω_intertype_185, Ω_intertype_186, Ω_intertype_187, Ω_intertype_188;
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
      eq2(T, (Ω_intertype_179 = function() {
        return TMP_types.isa.object(types.declarations);
      }), true);
      eq2(T, (Ω_intertype_180 = function() {
        return TMP_types.isa.object(types.declarations.float);
      }), true);
      eq2(T, (Ω_intertype_181 = function() {
        return TMP_types.isa.object(types.declarations.text);
      }), true);
      //.......................................................................................................
      throws2(T, (Ω_intertype_182 = function() {
        return types.create.boolean();
      }), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/);
      throws2(T, (Ω_intertype_183 = function() {
        return types.create.text('foo');
      }), /expected 0 arguments, got 1/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_184 = function() {
        return types.create.text();
      }), '');
      eq2(T, (Ω_intertype_185 = function() {
        return types.create.integer();
      }), 0);
      eq2(T, (Ω_intertype_186 = function() {
        return types.create.float();
      }), 0);
      eq2(T, (Ω_intertype_187 = function() {
        return types.create.float('123.45');
      }), 123.45);
      throws2(T, (Ω_intertype_188 = function() {
        return types.create.float('***');
      }), /expected `create\.float\(\)` to return a float but it returned a nan/);
      //.......................................................................................................
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_189;
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
      eq2(T, (Ω_intertype_189 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declarations, isa, validate, Ω_intertype_190, Ω_intertype_191, Ω_intertype_192, Ω_intertype_193;
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
      eq2(T, (Ω_intertype_190 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_191 = function() {
        return create.quantity({
          q: 123
        });
      }), {
        q: 123,
        u: 'u'
      });
      eq2(T, (Ω_intertype_192 = function() {
        return create.quantity({
          u: 'kg'
        });
      }), {
        q: 0,
        u: 'kg'
      });
      eq2(T, (Ω_intertype_193 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, type_of, types, Ω_intertype_194, Ω_intertype_195, Ω_intertype_196, Ω_intertype_197, Ω_intertype_198, Ω_intertype_199, Ω_intertype_200, Ω_intertype_201, Ω_intertype_202, Ω_intertype_203, Ω_intertype_204, Ω_intertype_205;
      types = new Intertype();
      ({create, type_of} = types);
      eq2(T, (Ω_intertype_194 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_195 = function() {
        return create.boolean();
      }), false);
      eq2(T, (Ω_intertype_196 = function() {
        return create.object();
      }), {});
      eq2(T, (Ω_intertype_197 = function() {
        return create.float();
      }), 0);
      eq2(T, (Ω_intertype_198 = function() {
        return create.infinity();
      }), 2e308);
      eq2(T, (Ω_intertype_199 = function() {
        return create.text();
      }), '');
      eq2(T, (Ω_intertype_200 = function() {
        return create.list();
      }), []);
      eq2(T, (Ω_intertype_201 = function() {
        return create.regex();
      }), new RegExp());
      eq2(T, (Ω_intertype_202 = function() {
        return type_of(create.function());
      }), 'function');
      eq2(T, (Ω_intertype_203 = function() {
        return type_of(create.asyncfunction());
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_204 = function() {
        return type_of(create.symbol());
      }), 'symbol');
      throws2(T, (Ω_intertype_205 = function() {
        return create.basetype();
      }), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/);
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
      var create, declarations, declare, isa, type_of, types, Ω_intertype_206, Ω_intertype_207, Ω_intertype_208, Ω_intertype_209;
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
      eq2(T, (Ω_intertype_206 = function() {
        return create.quantity();
      }), {
        q: 0,
        u: 'u'
      });
      eq2(T, (Ω_intertype_207 = function() {
        return isa.quantity({
          q: 9
        });
      }), false);
      eq2(T, (Ω_intertype_208 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_209 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      return null;
    })();
    (() => {      //.........................................................................................................
      var create, declare, type_of, types, Ω_intertype_210;
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
      eq2(T, (Ω_intertype_210 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declarations, declare, isa, type_of, types, Ω_intertype_211, Ω_intertype_212, Ω_intertype_213, Ω_intertype_214, Ω_intertype_215;
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
      eq2(T, (Ω_intertype_211 = function() {
        return type_of(declarations.quantity.test);
      }), 'function');
      debug('^342342^', declarations.quantity);
      eq2(T, (Ω_intertype_212 = function() {
        return type_of(declarations.quantity.sub_tests.q);
      }), 'function');
      eq2(T, (Ω_intertype_213 = function() {
        return type_of(declarations.quantity.sub_tests.u);
      }), 'function');
      eq2(T, (Ω_intertype_214 = function() {
        return isa.quantity({
          q: 987,
          u: 's'
        });
      }), true);
      eq2(T, (Ω_intertype_215 = function() {
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
    var Intertype_minimal, types, Ω_intertype_216, Ω_intertype_217;
    // T?.halt_on_error()
    ({Intertype_minimal} = require('../../../apps/intertype'));
    types = new Intertype_minimal();
    eq2(T, (Ω_intertype_216 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown']);
    types.declare({
      z: (function(x) {})
    });
    eq2(T, (Ω_intertype_217 = function() {
      return (Object.keys(types.declarations)).sort();
    }), ['anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z']);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_type_name_for_test = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_218, Ω_intertype_219, Ω_intertype_220, Ω_intertype_221, Ω_intertype_222, Ω_intertype_223, Ω_intertype_224, Ω_intertype_225;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: 'quux', }
      throws2(T, (Ω_intertype_218 = function() {
        return types.declare({
          z: 'quux'
        });
      }), /unknown type 'quux'/);
      types.declare({
        z: 'float'
      });
      eq2(T, (Ω_intertype_219 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_220 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_221 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_222 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_223 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_224 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_225 = function() {
        return types.declarations.z.test.name;
      }), 'z'); // ?
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_226, Ω_intertype_227, Ω_intertype_228, Ω_intertype_229, Ω_intertype_230, Ω_intertype_231, Ω_intertype_232, Ω_intertype_233;
      types = new Intertype();
      // try_and_show T, -> types.declare { z: { test: 'quux', }, }
      throws2(T, (Ω_intertype_226 = function() {
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
      eq2(T, (Ω_intertype_227 = function() {
        return types.isa.z(12);
      }), true);
      eq2(T, (Ω_intertype_228 = function() {
        return types.isa.float.name;
      }), 'isa.float');
      eq2(T, (Ω_intertype_229 = function() {
        return types.declarations.float.type;
      }), 'float');
      eq2(T, (Ω_intertype_230 = function() {
        return types.declarations.float.test.name;
      }), 'float');
      eq2(T, (Ω_intertype_231 = function() {
        return types.isa.z.name;
      }), 'isa.z');
      eq2(T, (Ω_intertype_232 = function() {
        return types.declarations.z.type;
      }), 'z');
      return eq2(T, (Ω_intertype_233 = function() {
        return types.declarations.z.test.name;
      }), 'z');
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_dotted_type = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_234, Ω_intertype_235, Ω_intertype_236, Ω_intertype_237, Ω_intertype_238, Ω_intertype_239, Ω_intertype_240, Ω_intertype_241, Ω_intertype_242;
      types = new Intertype();
      eq2(T, (Ω_intertype_234 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), false);
      types.declare({
        foo: 'object'
      });
      eq2(T, (Ω_intertype_235 = function() {
        return Reflect.has(types.declarations, 'foo');
      }), true);
      eq2(T, (Ω_intertype_236 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), false);
      types.declare({
        'foo.bar': 'object'
      });
      eq2(T, (Ω_intertype_237 = function() {
        return Reflect.has(types.declarations, 'foo.bar');
      }), true);
      eq2(T, (Ω_intertype_238 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), false);
      types.declare({
        'foo.bar.baz': 'float'
      });
      eq2(T, (Ω_intertype_239 = function() {
        return Reflect.has(types.declarations, 'foo.bar.baz');
      }), true);
      eq2(T, (Ω_intertype_240 = function() {
        return types.isa.foo.bar.baz(null);
      }), false);
      eq2(T, (Ω_intertype_241 = function() {
        return types.isa.foo.bar.baz(4);
      }), true);
      eq2(T, (Ω_intertype_242 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, Ω_intertype_252, Ω_intertype_253, Ω_intertype_254, Ω_intertype_255, Ω_intertype_256, Ω_intertype_257, Ω_intertype_258, Ω_intertype_259, Ω_intertype_260, Ω_intertype_261, Ω_intertype_262, Ω_intertype_263;
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
      eq2(T, (Ω_intertype_252 = function() {
        return types.isa['quantity.q'];
      }), types.declarations['quantity'].sub_tests['q']);
      eq2(T, (Ω_intertype_253 = function() {
        return types.isa['quantity.q'];
      }), types.isa.quantity.q);
      // debug '^409-1^', types.declarations
      eq2(T, (Ω_intertype_254 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_255 = function() {
        return types.isa.quantity({
          q: {}
        });
      }), false);
      eq2(T, (Ω_intertype_256 = function() {
        return types.isa.quantity({
          q: 3
        });
      }), false);
      eq2(T, (Ω_intertype_257 = function() {
        return types.isa.quantity({
          q: 3,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_258 = function() {
        return types.isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_259 = function() {
        return types.isa.quantity.q(3.1);
      }), true);
      eq2(T, (Ω_intertype_260 = function() {
        return types.isa.quantity.q('3.1');
      }), false);
      eq2(T, (Ω_intertype_261 = function() {
        return types.isa.quantity.u('m');
      }), true);
      eq2(T, (Ω_intertype_262 = function() {
        return types.isa.quantity.u(null);
      }), false);
      eq2(T, (Ω_intertype_263 = function() {
        return types.isa.quantity.u(3);
      }), false);
      debug('^433-1^', types.declarations['quantity']);
      debug('^433-1^', types.declarations['quantity.q']);
      debug('^433-1^', types.declarations['quantity.u']);
      return null;
    })();
    (() => {      //.........................................................................................................
      var f, k, types, Ω_intertype_264, Ω_intertype_265, Ω_intertype_266, Ω_intertype_267, Ω_intertype_268, Ω_intertype_269, Ω_intertype_270, Ω_intertype_271, Ω_intertype_272, Ω_intertype_273, Ω_intertype_274, Ω_intertype_275, Ω_intertype_276, Ω_intertype_277, Ω_intertype_278, Ω_intertype_279, Ω_intertype_280;
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
      eq2(T, (Ω_intertype_264 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_265 = function() {
        return types.isa.person.address.city.name(1234);
      }), false);
      eq2(T, (Ω_intertype_266 = function() {
        return types.isa.person(1234);
      }), false);
      eq2(T, (Ω_intertype_267 = function() {
        return types.isa.person({
          name: 'Bob'
        });
      }), false);
      eq2(T, (Ω_intertype_268 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {}
        });
      }), false);
      eq2(T, (Ω_intertype_269 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {}
          }
        });
      }), false);
      eq2(T, (Ω_intertype_270 = function() {
        return types.isa.person({
          name: 'Bob',
          address: {
            city: {
              name: 'P'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_271 = function() {
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
      eq2(T, (Ω_intertype_272 = function() {
        return types.isa.person.address.city.name('P');
      }), true);
      eq2(T, (Ω_intertype_273 = function() {
        return types.isa.person.address.city.postcode('SO36');
      }), true);
      eq2(T, (Ω_intertype_274 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_275 = function() {
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
      eq2(T, (Ω_intertype_276 = function() {
        return Object.keys(types.declarations['person'].sub_tests);
      }), ['name', 'address']);
      eq2(T, (Ω_intertype_277 = function() {
        return Object.keys(types.declarations['person.address'].sub_tests);
      }), ['city']);
      eq2(T, (Ω_intertype_278 = function() {
        return Object.keys(types.declarations['person.address.city'].sub_tests);
      }), ['name', 'postcode']);
      eq2(T, (Ω_intertype_279 = function() {
        return types.declarations['person'].sub_tests !== types.declarations['person.address'].sub_tests;
      }), true);
      eq2(T, (Ω_intertype_280 = function() {
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
        var d, Ω_intertype_281;
        d = 3;
        // d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
        eq2(T, (Ω_intertype_281 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      (() => {
        var d, Ω_intertype_282, Ω_intertype_283;
        d = new Number(3);
        d.bar = '?';
        eq2(T, (Ω_intertype_282 = function() {
          return d.bar;
        }), '?');
        // still won't work b/c `float` doesn't accept objects (which is a good thing):
        eq2(T, (Ω_intertype_283 = function() {
          return types.isa.foo(d);
        }), false);
        return null;
      })();
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_284, Ω_intertype_285;
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
      eq2(T, (Ω_intertype_284 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_285 = function() {
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
      var types, Ω_intertype_286, Ω_intertype_287;
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
      eq2(T, (Ω_intertype_286 = function() {
        return types.isa.foo({});
      }), false);
      eq2(T, (Ω_intertype_287 = function() {
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
      var types, Ω_intertype_288, Ω_intertype_289, Ω_intertype_290, Ω_intertype_291, Ω_intertype_292, Ω_intertype_293;
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
      eq2(T, (Ω_intertype_288 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_289 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_290 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_291 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_292 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_293 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_294, Ω_intertype_295, Ω_intertype_296, Ω_intertype_297, Ω_intertype_298, Ω_intertype_299;
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
      eq2(T, (Ω_intertype_294 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_295 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_296 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_297 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_298 = function() {
        return types.isa.mycity(null);
      }), false);
      eq2(T, (Ω_intertype_299 = function() {
        return types.isa.mycity({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var types, Ω_intertype_300, Ω_intertype_301, Ω_intertype_302, Ω_intertype_303, Ω_intertype_304, Ω_intertype_305, Ω_intertype_306, Ω_intertype_307, Ω_intertype_308;
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
      eq2(T, (Ω_intertype_300 = function() {
        return types.isa.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_301 = function() {
        return types.isa.person.address.city(null);
      }), false);
      eq2(T, (Ω_intertype_302 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_303 = function() {
        return types.isa.optional.person.address.city({});
      }), false);
      eq2(T, (Ω_intertype_304 = function() {
        return types.isa.optional.person.address.city(null);
      }), true);
      eq2(T, (Ω_intertype_305 = function() {
        return types.isa.optional.person.address.city({
          name: 'P',
          postcode: 'SO36'
        });
      }), true);
      eq2(T, (Ω_intertype_306 = function() {
        return types.isa.mycity({});
      }), false);
      eq2(T, (Ω_intertype_307 = function() {
        return types.isa.mycity(null);
      }), true);
      eq2(T, (Ω_intertype_308 = function() {
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
  //     eq2 T, ( Ω_intertype_309 = -> isa.float       null  ), false
  //     eq2 T, ( Ω_intertype_310 = -> isa.float       true  ), false
  //     eq2 T, ( Ω_intertype_311 = -> isa.float       0     ), true
  //     eq2 T, ( Ω_intertype_312 = -> isa.maybefloat1 null  ), true
  //     eq2 T, ( Ω_intertype_313 = -> isa.maybefloat1 true  ), false
  //     eq2 T, ( Ω_intertype_314 = -> isa.maybefloat1 0     ), true
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
  //     eq2 T, ( Ω_intertype_315 = -> isa.q             null                    ), false
  //     eq2 T, ( Ω_intertype_316 = -> isa.q             {}                      ), true
  //     eq2 T, ( Ω_intertype_317 = -> isa.q             { maybefloat2: null }   ), true
  //     eq2 T, ( Ω_intertype_318 = -> isa.q             { maybefloat2: false }  ), false
  //     eq2 T, ( Ω_intertype_319 = -> isa.q             { maybefloat2: 3 }      ), true
  //     eq2 T, ( Ω_intertype_320 = -> isa.q.maybefloat2  null                   ), true
  //     eq2 T, ( Ω_intertype_321 = -> isa.q.maybefloat2  true                   ), false
  //     eq2 T, ( Ω_intertype_322 = -> isa.q.maybefloat2  0                      ), true
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
  //     safeguard T, => eq2 T, ( Ω_intertype_323 = -> isa.q             null                    ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_324 = -> isa.q             {}                      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_325 = -> isa.q             { maybefloat3: null }   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_326 = -> isa.q             { maybefloat3: false }  ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_327 = -> isa.q             { maybefloat3: 3 }      ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_328 = -> isa.q.maybefloat3  null                   ), true
  //     safeguard T, => eq2 T, ( Ω_intertype_329 = -> isa.q.maybefloat3  true                   ), false
  //     safeguard T, => eq2 T, ( Ω_intertype_330 = -> isa.q.maybefloat3  0                      ), true
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
  //     eq2 T, ( Ω_intertype_331 = -> isa.person        null                                                            ), false
  //     eq2 T, ( Ω_intertype_332 = -> isa.person        {}                                                              ), false
  //     eq2 T, ( Ω_intertype_333 = -> isa.person        { name: 'Fred',                                               } ), false
  //     eq2 T, ( Ω_intertype_334 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
  //     eq2 T, ( Ω_intertype_335 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     eq2 T, ( Ω_intertype_336 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
  //     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
  //     eq2 T, ( Ω_intertype_337 = -> isa.maybesomeone  null                                                            ), true
  //     # eq2 T, ( Ω_intertype_338 = -> isa.maybesomeone  {}                                                              ), false
  //     # eq2 T, ( Ω_intertype_339 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
  //     # eq2 T, ( Ω_intertype_340 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
  //     # eq2 T, ( Ω_intertype_341 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
  //     # eq2 T, ( Ω_intertype_342 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
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
      var declare, isa, types, validate, Ω_intertype_343, Ω_intertype_344, Ω_intertype_345, Ω_intertype_346, Ω_intertype_347, Ω_intertype_348, Ω_intertype_349;
      types = new Intertype();
      ({declare, validate, isa} = types);
      throws2(T, (Ω_intertype_343 = function() {
        return types.declare({
          'optional.d': (function(x) {})
        });
      }), /illegal use of 'optional' in declaration of type 'optional.d'/);
      throws2(T, (Ω_intertype_344 = function() {
        return types.declare({
          'anything.d': (function(x) {})
        });
      }), /illegal use of basetype 'anything' in declaration of type 'anything.d'/);
      throws2(T, (Ω_intertype_345 = function() {
        return types.declare({
          'nothing.d': (function(x) {})
        });
      }), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/);
      throws2(T, (Ω_intertype_346 = function() {
        return types.declare({
          'something.d': (function(x) {})
        });
      }), /illegal use of basetype 'something' in declaration of type 'something.d'/);
      throws2(T, (Ω_intertype_347 = function() {
        return types.declare({
          'null.d': (function(x) {})
        });
      }), /illegal use of basetype 'null' in declaration of type 'null.d'/);
      throws2(T, (Ω_intertype_348 = function() {
        return types.declare({
          'undefined.d': (function(x) {})
        });
      }), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/);
      throws2(T, (Ω_intertype_349 = function() {
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
      var types, Ω_intertype_350, Ω_intertype_351, Ω_intertype_352, Ω_intertype_353, Ω_intertype_354, Ω_intertype_355, Ω_intertype_356, Ω_intertype_357, Ω_intertype_358;
      types = new Intertype();
      eq2(T, (Ω_intertype_350 = function() {
        return __type_of(_isa, null);
      }), 'null');
      eq2(T, (Ω_intertype_351 = function() {
        return __type_of(_isa, void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_352 = function() {
        return __type_of(_isa, 4);
      }), 'float');
      eq2(T, (Ω_intertype_353 = function() {
        return __type_of(_isa, function() {});
      }), 'function');
      eq2(T, (Ω_intertype_354 = function() {
        return __type_of(_isa, async function() {
          return (await null);
        });
      }), 'asyncfunction');
      eq2(T, (Ω_intertype_355 = function() {
        return __type_of(_isa, {});
      }), 'object');
      eq2(T, (Ω_intertype_356 = function() {
        return __type_of(_isa, []);
      }), 'list');
      eq2(T, (Ω_intertype_357 = function() {
        return __type_of(_isa, +2e308);
      }), 'infinity');
      eq2(T, (Ω_intertype_358 = function() {
        return __type_of(_isa, -2e308);
      }), 'infinity');
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
      var probe, result, sub, Ω_intertype_359, Ω_intertype_360, Ω_intertype_361, Ω_intertype_362, Ω_intertype_363, Ω_intertype_364;
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
      eq2(T, (Ω_intertype_359 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_360 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_361 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_362 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_363 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_364 = function() {
        return probe.bar.baz.sub === sub;
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var probe, result, sub, types, Ω_intertype_365, Ω_intertype_366, Ω_intertype_367, Ω_intertype_368, Ω_intertype_369, Ω_intertype_370;
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
      eq2(T, (Ω_intertype_365 = function() {
        return result;
      }), probe);
      eq2(T, (Ω_intertype_366 = function() {
        return result.bar === probe.bar;
      }), false);
      eq2(T, (Ω_intertype_367 = function() {
        return result.bar.baz === probe.bar.baz;
      }), false);
      eq2(T, (Ω_intertype_368 = function() {
        return result.bar.baz.sub === probe.bar.baz.sub;
      }), false);
      eq2(T, (Ω_intertype_369 = function() {
        return result.bar.baz.sub === sub;
      }), false);
      eq2(T, (Ω_intertype_370 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var types, validate, Ω_intertype_371, Ω_intertype_372, Ω_intertype_373, Ω_intertype_374, Ω_intertype_375, Ω_intertype_376, Ω_intertype_377, Ω_intertype_378, Ω_intertype_379, Ω_intertype_380, Ω_intertype_381, Ω_intertype_382, Ω_intertype_383, Ω_intertype_384, Ω_intertype_385;
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
      throws2(T, (Ω_intertype_371 = function() {
        return validate.person(null);
      }), /expected a person, got a null/);
      throws2(T, (Ω_intertype_372 = function() {
        return validate.person.address(null);
      }), /expected a person.address, got a null/);
      throws2(T, (Ω_intertype_373 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city, got a null/);
      throws2(T, (Ω_intertype_374 = function() {
        return validate.person.address.city.postcode(null);
      }), /expected a person.address.city.postcode, got a null/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_375 = function() {
        return types.isa.person.address.city.postcode(3);
      }), false);
      throws2(T, (Ω_intertype_376 = function() {
        return validate.person.address.city.postcode(3);
      }), /expected a person.address.city.postcode/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_377 = function() {
        return types.isa.person.address.city({
          name: 'P'
        });
      }), false);
      throws2(T, (Ω_intertype_378 = function() {
        return validate.person.address.city({
          name: 'P'
        });
      }), /expected a person.address.city/);
      // #.......................................................................................................
      eq2(T, (Ω_intertype_379 = function() {
        return types.isa.person.address.city({
          postcode: '3421'
        });
      }), false);
      throws2(T, (Ω_intertype_380 = function() {
        return validate.person.address.city();
      }), /method 'validate.person.address.city' expects 1 arguments, got 0/);
      throws2(T, (Ω_intertype_381 = function() {
        return validate.person.address.city(null);
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_382 = function() {
        return validate.person.address.city('3421');
      }), /expected a person.address.city/);
      throws2(T, (Ω_intertype_383 = function() {
        return validate.person.address.city({
          postcode: '3421'
        });
      }), /expected a person.address.city/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_384 = function() {
        return types.isa.person.address.city({
          name: 'P',
          postcode: '3421'
        });
      }), true);
      eq2(T, (Ω_intertype_385 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var evaluate, isa, types, validate, Ω_intertype_386, Ω_intertype_387, Ω_intertype_388, Ω_intertype_389, Ω_intertype_390, Ω_intertype_391, Ω_intertype_392, Ω_intertype_393, Ω_intertype_394, Ω_intertype_395, Ω_intertype_396, Ω_intertype_397, Ω_intertype_398, Ω_intertype_399;
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
      throws2(T, (Ω_intertype_386 = function() {
        return evaluate.optional(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      throws2(T, (Ω_intertype_387 = function() {
        return evaluate.optional.person(1);
      }), /`optional` is not a legal type for `evaluate` methods/);
      //.......................................................................................................
      eq2(T, (Ω_intertype_388 = function() {
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
      eq2(T, (Ω_intertype_389 = function() {
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
      eq2(T, (Ω_intertype_390 = function() {
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
      eq2(T, (Ω_intertype_391 = function() {
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
      eq2(T, (Ω_intertype_392 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 12345678
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_393 = function() {
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
      eq2(T, (Ω_intertype_394 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_395 = function() {
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
      eq2(T, (Ω_intertype_396 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_397 = function() {
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
      eq2(T, (Ω_intertype_398 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_399 = function() {
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
      var evaluate, isa, types, validate, Ω_intertype_400, Ω_intertype_401, Ω_intertype_402, Ω_intertype_403, Ω_intertype_404, Ω_intertype_405, Ω_intertype_406, Ω_intertype_407, Ω_intertype_408, Ω_intertype_409, Ω_intertype_410, Ω_intertype_411, Ω_intertype_412, Ω_intertype_413, Ω_intertype_414;
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
      eq2(T, (Ω_intertype_400 = function() {
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
      eq2(T, (Ω_intertype_401 = function() {
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
      eq2(T, (Ω_intertype_402 = function() {
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
      eq2(T, (Ω_intertype_403 = function() {
        return isa.person({
          address: {
            city: {
              name: 'Atown',
              postcode: 'VA1234'
            }
          }
        });
      }), false);
      eq2(T, (Ω_intertype_404 = function() {
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
      eq2(T, (Ω_intertype_405 = function() {
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
      eq2(T, (Ω_intertype_406 = function() {
        return isa.person(null);
      }), false);
      eq2(T, (Ω_intertype_407 = function() {
        return evaluate.person(null);
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_408 = function() {
        return Object.keys(evaluate.person(null));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_409 = function() {
        return isa.person({});
      }), false);
      eq2(T, (Ω_intertype_410 = function() {
        return evaluate.person({});
      }), {
        person: false,
        'person.name': false,
        'person.address': false,
        'person.address.city': false,
        'person.address.city.name': false,
        'person.address.city.postcode': false
      });
      eq2(T, (Ω_intertype_411 = function() {
        return Object.keys(evaluate.person({}));
      }), ['person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name']);
      //.......................................................................................................
      eq2(T, (Ω_intertype_412 = function() {
        return isa.person.address({
          city: {
            name: 'Atown',
            postcode: 'VA1234'
          }
        });
      }), true);
      eq2(T, (Ω_intertype_413 = function() {
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
      eq2(T, (Ω_intertype_414 = function() {
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
    // T?.halt_on_error()
    ({walk_prefixes, isa, type_of} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var Ω_intertype_415, Ω_intertype_416, Ω_intertype_417, Ω_intertype_418, Ω_intertype_419, Ω_intertype_420;
      eq2(T, (Ω_intertype_415 = function() {
        return isa.generatorfunction(walk_prefixes);
      }), true);
      eq2(T, (Ω_intertype_416 = function() {
        return [...(walk_prefixes('one'))];
      }), []);
      eq2(T, (Ω_intertype_417 = function() {
        return [...(walk_prefixes('one.two'))];
      }), ['one']);
      eq2(T, (Ω_intertype_418 = function() {
        return [...(walk_prefixes('one.two.three'))];
      }), ['one', 'one.two']);
      eq2(T, (Ω_intertype_419 = function() {
        return [...(walk_prefixes('one.two.three.four'))];
      }), ['one', 'one.two', 'one.two.three']);
      /* TAINT should not allow empty namers: */
      eq2(T, (Ω_intertype_420 = function() {
        return [...(walk_prefixes('.one.two.three'))];
      }), ['', '.one', '.one.two']);
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
      var declarations, Ω_intertype_421;
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
      throws2(T, (Ω_intertype_421 = function() {
        var types;
        return types = new Intertype(declarations);
      }), /unknown partial type 'foo'/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, types, Ω_intertype_422, Ω_intertype_423, Ω_intertype_424, Ω_intertype_425, Ω_intertype_426, Ω_intertype_427;
      declarations = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text'
      };
      types = new Intertype(declarations);
      eq2(T, (Ω_intertype_422 = function() {
        return types.isa.quantity({});
      }), false);
      eq2(T, (Ω_intertype_423 = function() {
        return types.isa.quantity({
          q: 12,
          u: 'kg'
        });
      }), true);
      eq2(T, (Ω_intertype_424 = function() {
        return types.isa['quantity.q'](12);
      }), true);
      eq2(T, (Ω_intertype_425 = function() {
        return types.isa['quantity.u']('kg');
      }), true);
      eq2(T, (Ω_intertype_426 = function() {
        return types.isa.quantity.q(12);
      }), true);
      eq2(T, (Ω_intertype_427 = function() {
        return types.isa.quantity.u('kg');
      }), true);
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
      var declarations, isa, types, Ω_intertype_428, Ω_intertype_429, Ω_intertype_430, Ω_intertype_431, Ω_intertype_432, Ω_intertype_433, Ω_intertype_434, Ω_intertype_435, Ω_intertype_436, Ω_intertype_437, Ω_intertype_438, Ω_intertype_439, Ω_intertype_440;
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
      eq2(T, (Ω_intertype_428 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_429 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_430 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_431 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_432 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_433 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_434 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_435 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_436 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_437 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_438 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_439 = function() {
        return isa.nonempty.text(4);
      }), false);
      /* this doesn't make a terrible lot of sense: */
      eq2(T, (Ω_intertype_440 = function() {
        return isa.empty({
          list: [],
          text: '',
          set: new Set()
        });
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var declarations, isa, types, validate, Ω_intertype_441, Ω_intertype_442, Ω_intertype_443, Ω_intertype_444, Ω_intertype_445, Ω_intertype_446, Ω_intertype_447, Ω_intertype_448, Ω_intertype_449, Ω_intertype_450, Ω_intertype_451, Ω_intertype_452, Ω_intertype_453, Ω_intertype_454, Ω_intertype_455, Ω_intertype_456, Ω_intertype_457, Ω_intertype_458, Ω_intertype_459, Ω_intertype_460, Ω_intertype_461, Ω_intertype_462, Ω_intertype_463, Ω_intertype_464, Ω_intertype_465, Ω_intertype_466, Ω_intertype_467, Ω_intertype_468, Ω_intertype_469, Ω_intertype_470;
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
      eq2(T, (Ω_intertype_441 = function() {
        return isa.empty.list([]);
      }), true);
      eq2(T, (Ω_intertype_442 = function() {
        return isa.empty.list(['A']);
      }), false);
      eq2(T, (Ω_intertype_443 = function() {
        return isa.empty.list(4);
      }), false);
      eq2(T, (Ω_intertype_444 = function() {
        return isa.nonempty.list([]);
      }), false);
      eq2(T, (Ω_intertype_445 = function() {
        return isa.nonempty.list(['A']);
      }), true);
      eq2(T, (Ω_intertype_446 = function() {
        return isa.nonempty.list(4);
      }), false);
      eq2(T, (Ω_intertype_447 = function() {
        return isa.empty.text('');
      }), true);
      eq2(T, (Ω_intertype_448 = function() {
        return isa.empty.text('A');
      }), false);
      eq2(T, (Ω_intertype_449 = function() {
        return isa.empty.text(4);
      }), false);
      eq2(T, (Ω_intertype_450 = function() {
        return isa.nonempty.text('');
      }), false);
      eq2(T, (Ω_intertype_451 = function() {
        return isa.nonempty.text('A');
      }), true);
      eq2(T, (Ω_intertype_452 = function() {
        return isa.nonempty.text(4);
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_453 = function() {
        return isa.empty([]);
      }), true);
      eq2(T, (Ω_intertype_454 = function() {
        return isa.empty('');
      }), true);
      eq2(T, (Ω_intertype_455 = function() {
        return isa.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_456 = function() {
        return isa.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_457 = function() {
        return isa.empty('A');
      }), false);
      eq2(T, (Ω_intertype_458 = function() {
        return isa.empty(new Set('abc'));
      }), false);
      //.......................................................................................................
      eq2(T, (Ω_intertype_459 = function() {
        return validate.empty([]);
      }), []);
      eq2(T, (Ω_intertype_460 = function() {
        return validate.empty('');
      }), '');
      eq2(T, (Ω_intertype_461 = function() {
        return validate.empty(new Set());
      }), new Set());
      throws2(T, (Ω_intertype_462 = function() {
        return validate.empty([1]);
      }), /expected a empty, got a list/);
      throws2(T, (Ω_intertype_463 = function() {
        return validate.empty('A');
      }), /expected a empty, got a text/);
      throws2(T, (Ω_intertype_464 = function() {
        return validate.empty(new Set('abc'));
      }), /expected a empty, got a set/);
      return null;
      //.......................................................................................................
      eq2(T, (Ω_intertype_465 = function() {
        return isa.opttional.empty([]);
      }), true);
      eq2(T, (Ω_intertype_466 = function() {
        return isa.opttional.empty('');
      }), true);
      eq2(T, (Ω_intertype_467 = function() {
        return isa.opttional.empty(new Set());
      }), true);
      eq2(T, (Ω_intertype_468 = function() {
        return isa.opttional.empty([1]);
      }), false);
      eq2(T, (Ω_intertype_469 = function() {
        return isa.opttional.empty('A');
      }), false);
      return eq2(T, (Ω_intertype_470 = function() {
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
      var Ω_intertype_471, Ω_intertype_472, Ω_intertype_473, Ω_intertype_474, Ω_intertype_475, Ω_intertype_476;
      /* TAINT observe the out-comment messages would perhaps make more sense as they are more specific */
      eq2(T, (Ω_intertype_471 = function() {
        return (new Intertype()).declare({
          foo: 'float'
        });
      }), null);
      eq2(T, (Ω_intertype_472 = function() {
        return (new Intertype()).declare({
          foo: 'text'
        });
      }), null);
      // ( new Intertype() ).declare { foo: 'optional', }
      throws2(T, (Ω_intertype_473 = function() {
        return (new Intertype()).declare({
          foo: 'optional'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_474 = function() {
        return (new Intertype()).declare({
          foo: 'qqq'
        });
      }), /unknown type 'qqq'/);
      throws2(T, (Ω_intertype_475 = function() {
        return (new Intertype()).declare({
          foo: 'optional.float'
        });
      }), /illegal use of 'optional' in declaration of type 'foo'/);
      throws2(T, (Ω_intertype_476 = function() {
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
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var isa, validate, Ω_intertype_477, Ω_intertype_478, Ω_intertype_479, Ω_intertype_480, Ω_intertype_481, Ω_intertype_482, Ω_intertype_483, Ω_intertype_484, Ω_intertype_485, Ω_intertype_486, Ω_intertype_487, Ω_intertype_488, Ω_intertype_489, Ω_intertype_490, Ω_intertype_491, Ω_intertype_492;
      ({isa, validate} = new Intertype({
        normalfloat: (function(x) {
          return (this.isa.float(x)) && ((0 <= x && x <= 1));
        })
      }));
      eq2(T, (Ω_intertype_477 = function() {
        return isa.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_478 = function() {
        return isa.normalfloat(null);
      }), false);
      eq2(T, (Ω_intertype_479 = function() {
        return isa.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_480 = function() {
        return isa.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_481 = function() {
        return isa.optional.normalfloat(0);
      }), true);
      eq2(T, (Ω_intertype_482 = function() {
        return isa.optional.normalfloat(null);
      }), true);
      eq2(T, (Ω_intertype_483 = function() {
        return isa.optional.normalfloat(-1);
      }), false);
      eq2(T, (Ω_intertype_484 = function() {
        return isa.optional.normalfloat('?');
      }), false);
      eq2(T, (Ω_intertype_485 = function() {
        return validate.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_486 = function() {
        return validate.optional.normalfloat(0);
      }), 0);
      eq2(T, (Ω_intertype_487 = function() {
        return validate.optional.normalfloat(null);
      }), null);
      throws2(T, (Ω_intertype_488 = function() {
        return validate.normalfloat(null);
      }), /expected a normalfloat, got a null/);
      throws2(T, (Ω_intertype_489 = function() {
        return validate.normalfloat(-1);
      }), /expected a normalfloat, got a float/);
      throws2(T, (Ω_intertype_490 = function() {
        return validate.normalfloat('?');
      }), /expected a normalfloat, got a text/);
      throws2(T, (Ω_intertype_491 = function() {
        return validate.optional.normalfloat(-1);
      }), /expected an optional normalfloat, got a float/);
      throws2(T, (Ω_intertype_492 = function() {
        return validate.optional.normalfloat('?');
      }), /expected an optional normalfloat, got a text/);
      return null;
    })();
    (() => {      //.........................................................................................................
      var isa, my_types, types, validate, Ω_intertype_342, Ω_intertype_493, Ω_intertype_494, Ω_intertype_495, Ω_intertype_496, Ω_intertype_497, Ω_intertype_498, Ω_intertype_499, Ω_intertype_500, Ω_intertype_501, Ω_intertype_502, Ω_intertype_503, Ω_intertype_504, Ω_intertype_505, Ω_intertype_506, Ω_intertype_507, Ω_intertype_508, Ω_intertype_509, Ω_intertype_510, Ω_intertype_511, Ω_intertype_512, Ω_intertype_513, Ω_intertype_514, Ω_intertype_515, Ω_intertype_516, Ω_intertype_517, Ω_intertype_518, Ω_intertype_519, Ω_intertype_520, Ω_intertype_521, Ω_intertype_522;
      my_types = {
        'quantity': 'object',
        'quantity.q': 'float',
        'quantity.u': 'text',
        'foo': 'object',
        'foo.bar': 'object',
        'foo.bar.baz': 'float'
      };
      ({isa, validate} = types = new Intertype(my_types));
      eq2(T, (Ω_intertype_493 = function() {
        return isa.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_494 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_495 = function() {
        return isa.optional.quantity({
          q: 2,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_496 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_497 = function() {
        return validate.quantity({
          q: 3,
          u: 'm'
        });
      }), {
        q: 3,
        u: 'm'
      });
      eq2(T, (Ω_intertype_498 = function() {
        return validate.optional.quantity({
          q: 4,
          u: 'm'
        });
      }), {
        q: 4,
        u: 'm'
      });
      eq2(T, (Ω_intertype_499 = function() {
        return validate.optional.quantity.q(null);
      }), null);
      eq2(T, (Ω_intertype_500 = function() {
        return validate.optional.quantity.q(111);
      }), 111);
      eq2(T, (Ω_intertype_501 = function() {
        return isa.quantity(null);
      }), false);
      eq2(T, (Ω_intertype_502 = function() {
        return isa.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_503 = function() {
        return isa.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_504 = function() {
        return isa.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_505 = function() {
        return isa.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_506 = function() {
        return isa.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), true);
      eq2(T, (Ω_intertype_507 = function() {
        return isa.optional.quantity(null);
      }), true);
      eq2(T, (Ω_intertype_508 = function() {
        return isa.optional.quantity(-1);
      }), false);
      eq2(T, (Ω_intertype_509 = function() {
        return isa.optional.quantity('?');
      }), false);
      eq2(T, (Ω_intertype_510 = function() {
        return isa.optional.quantity.q('?');
      }), false);
      eq2(T, (Ω_intertype_511 = function() {
        return isa.optional.quantity.q(3);
      }), true);
      eq2(T, (Ω_intertype_512 = function() {
        return validate.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_513 = function() {
        return validate.optional.quantity({
          q: 1,
          u: 'm'
        });
      }), {
        q: 1,
        u: 'm'
      });
      eq2(T, (Ω_intertype_514 = function() {
        return validate.optional.quantity(null);
      }), null);
      throws2(T, (Ω_intertype_342 = function() {
        return validate.quantity({
          q: 5
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_515 = function() {
        return validate.quantity(null);
      }), /expected a quantity, got a null/);
      throws2(T, (Ω_intertype_516 = function() {
        return validate.quantity(-1);
      }), /expected a quantity, got a float/);
      throws2(T, (Ω_intertype_517 = function() {
        return validate.quantity('?');
      }), /expected a quantity, got a text/);
      throws2(T, (Ω_intertype_518 = function() {
        return validate.quantity({
          q: 1
        });
      }), /expected a quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_519 = function() {
        return validate.optional.quantity(-1);
      }), /expected an optional quantity, got a float/);
      throws2(T, (Ω_intertype_520 = function() {
        return validate.optional.quantity({
          q: 1
        });
      }), /expected an optional quantity, got a object/);
      /* TAINT message should be more specific */      throws2(T, (Ω_intertype_521 = function() {
        return validate.optional.quantity.q({
          q: 1
        });
      }), /expected an optional quantity.q, got a object/);
      throws2(T, (Ω_intertype_522 = function() {
        return validate.optional.quantity.q(3, 4, 5);
      }), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/);
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
      var declarations, Ω_intertype_523, Ω_intertype_524, Ω_intertype_525, Ω_intertype_526, Ω_intertype_527;
      ({declarations} = new Intertype());
      eq2(T, (Ω_intertype_523 = function() {
        return declarations.float.role;
      }), 'usertype');
      eq2(T, (Ω_intertype_524 = function() {
        return declarations.null.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_525 = function() {
        return declarations.anything.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_526 = function() {
        return declarations.unknown.role;
      }), 'basetype');
      eq2(T, (Ω_intertype_527 = function() {
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
      var Ω_intertype_528, Ω_intertype_529, Ω_intertype_530, Ω_intertype_531;
      eq2(T, (Ω_intertype_528 = function() {
        return type_of(null);
      }), 'null');
      eq2(T, (Ω_intertype_529 = function() {
        return type_of(void 0);
      }), 'undefined');
      eq2(T, (Ω_intertype_530 = function() {
        return type_of(+2e308);
      }), 'unknown');
      eq2(T, (Ω_intertype_531 = function() {
        return type_of(4);
      }), 'unknown');
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_532, Ω_intertype_533, Ω_intertype_534, Ω_intertype_535;
      eq2(T, (Ω_intertype_532 = function() {
        return isa.anything(1);
      }), true);
      eq2(T, (Ω_intertype_533 = function() {
        return isa.nothing(1);
      }), false);
      eq2(T, (Ω_intertype_534 = function() {
        return isa.something(1);
      }), true);
      eq2(T, (Ω_intertype_535 = function() {
        return isa.unknown(1);
      }), true);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_536, Ω_intertype_537, Ω_intertype_538, Ω_intertype_539;
      eq2(T, (Ω_intertype_536 = function() {
        return isa.anything(null);
      }), true);
      eq2(T, (Ω_intertype_537 = function() {
        return isa.nothing(null);
      }), true);
      eq2(T, (Ω_intertype_538 = function() {
        return isa.something(null);
      }), false);
      eq2(T, (Ω_intertype_539 = function() {
        return isa.unknown(null);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_540, Ω_intertype_541, Ω_intertype_542, Ω_intertype_543;
      eq2(T, (Ω_intertype_540 = function() {
        return isa.anything(void 0);
      }), true);
      eq2(T, (Ω_intertype_541 = function() {
        return isa.nothing(void 0);
      }), true);
      eq2(T, (Ω_intertype_542 = function() {
        return isa.something(void 0);
      }), false);
      eq2(T, (Ω_intertype_543 = function() {
        return isa.unknown(void 0);
      }), false);
      return null;
    })();
    (() => {      //.........................................................................................................
      var Ω_intertype_342;
      throws2(T, (Ω_intertype_342 = function() {
        return isa.optional(1);
      }), /`optional` is not a legal type for `isa` methods/);
      throws2(T, (Ω_intertype_342 = function() {
        return validate.optional(1);
      }), /`optional` is not a legal type for `validate` methods/);
      throws2(T, (Ω_intertype_342 = function() {
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
      // @parallel_behavior_of_isa_validate_mandatory_and_optional()
      // test @parallel_behavior_of_isa_validate_mandatory_and_optional
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map