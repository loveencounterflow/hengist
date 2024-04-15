(function() {
  'use strict';
  var CND, INTERTYPE, Intertype, alert, badge, debug, echo, help, info, intersection_of, later, log, njs_path, praise, rpr, test, urge, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; },
    indexOf = [].indexOf;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'INTERTYPE/tests/basics';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  praise = CND.get_logger('praise', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  INTERTYPE = require('../../../apps/intertype');

  ({Intertype} = INTERTYPE);

  ({intersection_of} = require('../../../apps/intertype/lib/helpers'));

  //-----------------------------------------------------------------------------------------------------------
  this["_prototype keys"] = function(T) {
    var isa, x, y;
    isa = this;
    x = {
      foo: 42,
      bar: 108
    };
    y = Object.create(x);
    y.bar = 'something';
    y.baz = 'other thing';
    
  const person = {
    isHuman: false,
    printIntroduction: function () {
      console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
    }
  };

  const me = Object.create(person);
  me.name = "Matthew"; // "name" is a property set on "me", but not on "person"
  me.isHuman = true; // inherited properties can be overwritten

  me.printIntroduction();

  ;
    // urge me.prototype?
    // urge me.__proto__?
    info('µ1', rpr(isa.generator_function(isa.all_own_keys_of)));
    info('µ2', rpr(isa.values_of(isa.all_own_keys_of('abc'))));
    info('µ3', rpr(isa.values_of(isa.all_keys_of('abc'))));
    info('µ4', rpr(isa.values_of(isa.all_keys_of(x))));
    info('µ5', rpr(isa.values_of(isa.all_keys_of(y))));
    info('µ5', rpr(isa.values_of(isa.all_keys_of(y, true))));
    info('µ6', rpr(isa.values_of(isa.all_keys_of(me))));
    info('µ7', rpr(isa.values_of(isa.all_keys_of({}))));
    info('µ8', rpr(isa.values_of(isa.all_keys_of(Object.create(null)))));
    info('µ9', isa.keys_of(me));
    return info('µ9', rpr(isa.values_of(isa.keys_of(me))));
  };

  // info 'µ10', rpr ( k for k of me )
  // info 'µ11', rpr Object.keys me
  // info 'µ12', isa.values_of isa.all_own_keys_of true
  // info 'µ13', isa.values_of isa.all_own_keys_of undefined
  // info 'µ14', isa.values_of isa.all_own_keys_of null

  // debug '' + rpr Object.create null
  // debug isa.values_of isa.all_keys_of Object::

  //-----------------------------------------------------------------------------------------------------------
  this["isa"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [["isa( 'callable', 'xxx'                                  )", false, null], ["isa( 'callable', function () {}                         )", true, null], ["isa( 'callable', async function () { await 42 }         )", true, null], ["isa( 'callable', function* () { yield 42 }              )", true, null], ["isa( 'callable', ( function* () { yield 42 } )()        )", false, null], ["isa( 'date',          new Date()                        )", true, null], ["isa( 'date',          true                              )", false, null], ["isa( 'date',          'helo'                            )", false, null], ["isa( 'date',          2                                 )", false, null], ["isa( 'date',          Date.now()                        )", false, null], ["isa( 'finite',        123                               )", true, null], ["isa( 'global',        global                            )", true, null], ["isa( 'integer',       123                               )", true, null], ["isa( 'integer',       42                                )", true, null], ["isa( 'float',        123                               )", true, null], ["isa( 'float',        42                                )", true, null], ["isa( 'float',         123                               )", true, null], ["isa( 'float',         42                                )", true, null], ["isa( 'float',        NaN                               )", false, null], ["isa( 'float',         NaN                               )", false, null], ["isa( 'safeinteger',   123                               )", true, null], ["isa( 'text',          'x'                               )", true, null], ["isa( 'text',          NaN                               )", false, null], ["isa.even(             42                                )", true, null], ["isa.finite(           123                               )", true, null], ["isa.integer(          123                               )", true, null], ["isa.integer(          42                                )", true, null], ["isa.weakmap(           new WeakMap()                    )", true, null], ["isa.map(               new Map()                        )", true, null], ["isa.set(               new Set()                        )", true, null], ["isa.date(              new Date()                       )", true, null], ["isa.error(             new Error()                      )", true, null], ["isa.list(              []                               )", true, null], ["isa.boolean(           true                             )", true, null], ["isa.boolean(           false                            )", true, null], ["isa.function(          ( () => {} )                     )", true, null], ["isa.asyncfunction(     ( async () => { await f() } )    )", true, null], ["isa.null(              null                             )", true, null], ["isa.text(              'helo'                           )", true, null], ["isa.chr(               ' '                              )", true, null], ["isa.chr(               'x'                              )", true, null], ["isa.chr(               ''                               )", false, null], ["isa.chr(               'ab'                             )", false, null], ["isa.chr(               '𪜀'                             )", true, null], ["isa.undefined(         undefined                        )", true, null], ["isa.global(            global                           )", true, null], ["isa.regex(             /^xxx$/g                         )", true, null], ["isa.object(            {}                               )", true, null], ["isa.nan(               NaN                              )", true, null], ["isa.infinity(          1 / 0                            )", true, null], ["isa.infinity(          -1 / 0                           )", true, null], ["isa.float(            12345                            )", true, null], ["isa.buffer(            new Buffer( 'xyz' )              )", true, null], ["isa.uint8array(        new Buffer( 'xyz' )              )", true, null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = eval(probe);
          // log rpr [ probe, result, ]
          // resolve result
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["type_of"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [["type_of( new WeakMap()                                  )", 'weakmap', null], ["type_of( new Map()                                      )", 'map', null], ["type_of( new Set()                                      )", 'set', null], ["type_of( new Date()                                     )", 'date', null], ["type_of( new Error()                                    )", 'error', null], ["type_of( []                                             )", 'list', null], ["type_of( true                                           )", 'boolean', null], ["type_of( false                                          )", 'boolean', null], ["type_of( ( () => {} )                                   )", 'function', null], ["type_of( ( async () => { await f() } )                  )", 'asyncfunction', null], ["type_of( null                                           )", 'null', null], ["type_of( 'helo'                                         )", 'text', null], ["type_of( undefined                                      )", 'undefined', null], ["type_of( global                                         )", 'global', null], ["type_of( /^xxx$/g                                       )", 'regex', null], ["type_of( {}                                             )", 'object', null], ["type_of( NaN                                            )", 'nan', null], ["type_of( 1 / 0                                          )", 'infinity', null], ["type_of( -1 / 0                                         )", 'infinity', null], ["type_of( 12345                                          )", 'float', null], ["type_of( 'xxx'                                          )", 'text', null], ["type_of( function () {}                                 )", 'function', null], ["type_of( async function () { await 42 }                 )", 'asyncfunction', null], ["type_of( function* () { yield 42 }                      )", 'generatorfunction', null], ["type_of( ( function* () { yield 42 } )()                )", 'generator', null], ["type_of( 123                                            )", 'float', null], ["type_of( 42                                             )", 'float', null], ["type_of( []                                             )", 'list', null], ["type_of( global                                         )", 'global', null], ["type_of( new Date()                                     )", 'date', null], ["type_of( {}                                             )", 'object', null], ["type_of( new Buffer(            'helo'  )               )", 'buffer', null], ["type_of( new ArrayBuffer(       42      )               )", 'arraybuffer', null], ["type_of( new Int8Array(         5       )               )", 'int8array', null], ["type_of( new Uint8Array(        5       )               )", 'uint8array', null], ["type_of( new Uint8ClampedArray( 5       )               )", 'uint8clampedarray', null], ["type_of( new Int16Array(        5       )               )", 'int16array', null], ["type_of( new Uint16Array(       5       )               )", 'uint16array', null], ["type_of( new Int32Array(        5       )               )", 'int32array', null], ["type_of( new Uint32Array(       5       )               )", 'uint32array', null], ["type_of( new Float32Array(      5       )               )", 'float32array', null], ["type_of( new Float64Array(      5       )               )", 'float64array', null], ["type_of( new Promise( ( rslv, rjct ) => {} )            )", 'promise', null], ["type_of( async function* () { await f(); yield 42; }       )", 'asyncgeneratorfunction', null], ["type_of( ( async function* () { await f(); yield 42; } )() )", 'asyncgenerator', null], ["type_of( new Number(  42   )                            )", "wrapper"], ["type_of( new String(  '42' )                            )", "wrapper"], ["type_of( new Boolean( true )                            )", "wrapper"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = eval(probe);
          // log rpr [ probe, result, ]
          // resolve result
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["validate"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [["validate( 'callable', 'xxx'                                      )", false, 'not a valid callable'], ["validate( 'callable', ( function* () { yield 42 } )()            )", false, 'not a valid callable'], ["validate( 'date',          true                                  )", false, 'not a valid date'], ["validate( 'date',          'helo'                                )", false, 'not a valid date'], ["validate( 'date',          2                                     )", false, 'not a valid date'], ["validate( 'date',          Date.now()                            )", false, 'not a valid date'], ["validate( 'float',        NaN                                   )", false, 'not a valid float'], ["validate( 'float',        NaN                                   )", false, 'not a valid float'], ["validate( 'text',          NaN                                   )", false, 'not a valid text'], ["validate( 'callable', function () {}                             )", true, null], ["validate( 'callable', async function () { await 42 }             )", true, null], ["validate( 'callable', function* () { yield 42 }                  )", true, null], ["validate( 'date',          new Date()                            )", true, null], ["validate( 'finite',        123                                   )", true, null], ["validate( 'global',        global                                )", true, null], ["validate( 'integer',       123                                   )", true, null], ["validate( 'integer',       42                                    )", true, null], ["validate( 'float',        123                                   )", true, null], ["validate( 'float',        42                                    )", true, null], ["validate( 'safeinteger',   123                                   )", true, null], ["validate( 'text',          'x'                                   )", true, null], ["validate.even(             42                                    )", true, null], ["validate.finite(           123                                   )", true, null], ["validate.integer(          123                                   )", true, null], ["validate.integer(          42                                    )", true, null], ["validate.float(           123                                   )", true, null], ["validate.safeinteger(      123                                   )", true, null], ["validate.weakmap(           new WeakMap()                        )", true, null], ["validate.map(               new Map()                            )", true, null], ["validate.set(               new Set()                            )", true, null], ["validate.date(              new Date()                           )", true, null], ["validate.error(             new Error()                          )", true, null], ["validate.list(              []                                   )", true, null], ["validate.boolean(           true                                 )", true, null], ["validate.boolean(           false                                )", true, null], ["validate.function(          ( () => {} )                         )", true, null], ["validate.asyncfunction(     ( async () => { await f() } )        )", true, null], ["validate.null(              null                                 )", true, null], ["validate.text(              'helo'                               )", true, null], ["validate.undefined(         undefined                            )", true, null], ["validate.global(            global                               )", true, null], ["validate.regex(             /^xxx$/g                             )", true, null], ["validate.object(            {}                                   )", true, null], ["validate.nan(               NaN                                  )", true, null], ["validate.infinity(          1 / 0                                )", true, null], ["validate.infinity(          -1 / 0                               )", true, null], ["validate.float(            12345                                )", true, null], ["validate.buffer(            new Buffer( 'xyz' )                  )", true, null], ["validate.uint8array(        new Buffer( 'xyz' )                  )", true, null], ["validate.promise(           new Promise( ( rslv, rjct ) => {} )  )", true, null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = eval(probe);
          // log rpr [ probe, result, ]
          // resolve result
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["types_of"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, prms, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    prms = new Promise((rslv, rjct) => {});
    probes_and_matchers = [[123, ["cardinal", "finite", "frozen", "integer", "nonnegative", "notunset", "float", "float", "numeric", "odd", "positive", "safeinteger", "sealed", "truthy"], null], [124, ["cardinal", "even", "finite", "frozen", "integer", "nonnegative", "notunset", "float", "float", "numeric", "positive", "safeinteger", "sealed", "truthy"], null], [0, ["cardinal", "even", "falsy", "finite", "frozen", "integer", "nonnegative", "nonpositive", "notunset", "float", "float", "numeric", "safeinteger", "sealed", "zero"], null], [true, ["boolean", "frozen", "notunset", "sealed", "truthy"], null], [null, ["falsy", "frozen", "null", "sealed", "unset"], null], [void 0, ["falsy", "frozen", "sealed", "undefined", "unset"], null], [{}, ["empty", "extensible", "notunset", "object", "truthy"], null], [[], ["empty", "extensible", "list", "notunset", "truthy"], null], [prms, ["nativepromise", "promise", "thenable"], null]];
//.........................................................................................................
// debug intersection_of [ 1, 2, 3, ], [ 'a', 3, 1, ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      matcher = matcher.sort();
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = types_of(probe);
          result = intersection_of(matcher, result);
          // help '^334^', matcher.sort()
          // urge '^334^', intersection_of matcher, result
          // urge '^334^', result
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["size_of"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    // debug ( new Buffer '𣁬', ), ( '𣁬'.codePointAt 0 ).toString 16
    // debug ( new Buffer '𡉜', ), ( '𡉜'.codePointAt 0 ).toString 16
    // debug ( new Buffer '𠑹', ), ( '𠑹'.codePointAt 0 ).toString 16
    // debug ( new Buffer '𠅁', ), ( '𠅁'.codePointAt 0 ).toString 16
    /* TAINT re-implement types object, pod */
    // T.eq ( isa.size_of { '~isa': 'XYZ/yadda', 'foo': 42, 'bar': 108, 'baz': 3, }      ), 4
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [[[1,
      2,
      3,
      4]],
      4,
      null],
      [[new Buffer([1,
      2,
      3,
      4])],
      4,
      null],
      [['𣁬𡉜𠑹𠅁'],
      2 * (Array.from('𣁬𡉜𠑹𠅁')).length,
      null],
      [['𣁬𡉜𠑹𠅁',
      'codepoints'],
      (Array.from('𣁬𡉜𠑹𠅁')).length,
      null],
      [['𣁬𡉜𠑹𠅁',
      'codeunits'],
      2 * (Array.from('𣁬𡉜𠑹𠅁')).length,
      null],
      [['𣁬𡉜𠑹𠅁',
      'bytes'],
      (new Buffer('𣁬𡉜𠑹𠅁',
      'utf-8')).length,
      null],
      [['abcdefghijklmnopqrstuvwxyz'],
      26,
      null],
      [['abcdefghijklmnopqrstuvwxyz',
      'codepoints'],
      26,
      null],
      [['abcdefghijklmnopqrstuvwxyz',
      'codeunits'],
      26,
      null],
      [['abcdefghijklmnopqrstuvwxyz',
      'bytes'],
      26,
      null],
      [['ä'],
      1,
      null],
      [['ä',
      'codepoints'],
      1,
      null],
      [['ä',
      'codeunits'],
      1,
      null],
      [['ä',
      'bytes'],
      2,
      null],
      [[new Map([['foo',
      42],
      ['bar',
      108]])],
      2,
      null],
      [[new Set(['foo',
      42,
      'bar',
      108])],
      4,
      null],
      [
        [
          {
            'foo': 42,
            'bar': 108,
            'baz': 3
          }
        ],
        3,
        null
      ],
      [
        [
          {
            'foo': null,
            'bar': 108,
            'baz': 3
          }
        ],
        3,
        null
      ],
      [
        [
          {
            'foo': void 0,
            'bar': 108,
            'baz': 3
          }
        ],
        3,
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // debug 'µ22900', probe
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = size_of(...probe);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["export to target"] = function(T, done) {
    var intertype, return_value, target;
    //.........................................................................................................
    target = {};
    intertype = new Intertype();
    return_value = intertype.export(target);
    T.ok(return_value === target);
    target.declare('sometype', function(x) {
      return (this.isa.text(x)) && (x.startsWith(':'));
    });
    // debug 'µ44333', target
    // debug 'µ44333', target.isa.sometype 'sometext'
    // debug 'µ44333', target.isa.sometype ':sometext'
    done();
    return null;
  };

  later = function() {};

  /*
  info 'µ01-47', xrpr all_keys_of          [ null, ]
  X                 = {}
  X.x               = true
  X.spec            = {}
  X.spec.spec_of_X  = true
  Y                 = Object.create X
  Y.y               = true
  Y.spec            = Object.create X.spec
  Y.spec.spec_of_Y  = true
  debug X,        rpr ( k for k of X )
  debug X.spec,   rpr ( k for k of X.spec )
  debug Y,        rpr ( k for k of Y )
  debug Y.spec,   rpr ( k for k of Y.spec )
  Y.spec.spec_of_X  = false
  info X.spec.spec_of_X
  info X.spec.spec_of_Y
  info Y.spec.spec_of_X
  info Y.spec.spec_of_Y
  */
  //-----------------------------------------------------------------------------------------------------------
  this["cast"] = async function(T, done) {
    var all_keys_of, cast, declare, error, i, intertype, isa, j, len, len1, matcher, probe, probes_and_matchers, size_of, type_of, types_of, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, cast, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [[['float', 'float', 123], 123], [['float', 'integer', 123], 123], [['float', 'integer', 23.9], 24], [['boolean', 'float', true], 1], [['boolean', 'float', false], 0], [['float', 'boolean', 0], false], [['float', 'boolean', 1], true], [['float', 'boolean', -154.7], true], [['float', 'text', 123], '123'], [['boolean', 'text', true], 'true'], [['null', 'text', null], 'null'], [['int10text', 'text', '1245'], '1245'], [['int16text', 'text', '1245'], '1245'], [['int10text', 'float', '1245'], 1245], [['int16text', 'float', '1245'], 4677], [['int16text', 'int2text', '7'], '111'], [['float', 'null', 0], null, 'unable to cast a float as null'], [['float', 'null', 1], null, 'unable to cast a float as null']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      //.........................................................................................................
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type_a, type_b, x;
          [type_a, type_b, x] = probe;
          result = cast(type_a, type_b, x);
          resolve(result);
          return null;
        });
      });
    }
//.........................................................................................................
    for (j = 0, len1 = probes_and_matchers.length; j < len1; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type_a, type_b, x;
          [type_a, type_b, x] = probe;
          result = cast[type_a](type_b, x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["isa_optional"] = function(T, done) {
    var error, intertype, isa_optional, validate_optional;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa_optional, validate_optional} = intertype.export());
    //.........................................................................................................
    T.eq(isa_optional.integer(null), true);
    T.eq(isa_optional.integer(1234), true);
    T.eq(isa_optional.integer('1234'), false);
    T.eq(isa_optional.integer(true), false);
    T.eq(isa_optional.integer(false), false);
    T.eq(isa_optional.integer(void 0), true);
    T.eq(isa_optional.integer(new Date()), false);
    T.eq(isa_optional.integer([]), false);
    try {
      //.........................................................................................................
      validate_optional.nonempty_text(null);
      T.ok(true);
    } catch (error1) {
      error = error1;
      T.fail('testcase-434653746');
    }
    try {
      //.........................................................................................................
      validate_optional.nonempty_text('yes');
      T.ok(true);
    } catch (error1) {
      error = error1;
      T.fail('testcase-434653747');
    }
    try {
      //.........................................................................................................
      validate_optional.nonempty_text(12.4);
      T.fail('testcase-434653748');
    } catch (error1) {
      error = error1;
      T.ok(true);
    }
    try {
      //.........................................................................................................
      validate_optional.nonempty_text(false);
      T.fail('testcase-434653749');
    } catch (error1) {
      error = error1;
      T.ok(true);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["isa.list_of A"] = async function(T, done) {
    var error, i, intertype, isa, len, matcher, probe, probes_and_matchers, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [[['float', [123]], true], [['integer', [123]], true], [['integer', [1, 2, 3, 123.5]], false]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = isa.list_of(type, x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["isa.list_of B"] = async function(T, done) {
    var error, i, intertype, isa, isa_list_of, len, matcher, probe, probes_and_matchers, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, isa_list_of, validate} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [[['float', [123]], true], [['integer', [123]], true], [['integer', [1, 2, 3, 123.5]], false]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = isa_list_of[type](x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["isa_object_of B"] = async function(T, done) {
    var error, i, intertype, isa, isa_object_of, len, matcher, probe, probes_and_matchers, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, isa_object_of, validate} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'float',
          {
            x: 123
          }
        ],
        true
      ],
      [
        [
          'integer',
          {
            x: 123
          }
        ],
        true
      ],
      [
        [
          'integer',
          {
            x: 1,
            y: 2,
            a: 3,
            c: 123.5
          }
        ],
        false
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = isa_object_of[type](x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["validate.list_of A"] = async function(T, done) {
    var error, i, intertype, isa, len, matcher, probe, probes_and_matchers, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [[['float', [123]], true], [['integer', [123]], true], [['integer', [1, 2, 3, 123.5]], null, "not a valid list_of"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = validate.list_of(type, x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["validate.list_of B"] = async function(T, done) {
    var error, i, intertype, isa, isa_list_of, len, matcher, probe, probes_and_matchers, validate, validate_list_of;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, isa_list_of, validate_list_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [[['float', [123]], true], [['integer', [123]], true], [['integer', [1, 2, 3, 123.5]], null, "not a valid list_of"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = validate_list_of(type, x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["validate.object_of B"] = async function(T, done) {
    var error, i, intertype, isa, isa_object_of, len, matcher, probe, probes_and_matchers, validate, validate_object_of;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, isa_object_of, validate_object_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'float',
          {
            x: 123
          }
        ],
        true
      ],
      [
        [
          'integer',
          {
            x: 123
          }
        ],
        true
      ],
      [
        [
          'integer',
          {
            x: 1,
            y: 2,
            a: 3,
            c: 123.5
          }
        ],
        null,
        "not a valid object_of"
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result, type, x;
          [type, x] = probe;
          result = validate_object_of(type, x);
          resolve(result);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["vnr, int32"] = function(T, done) {
    var declare, intertype, isa, isa_list_of, validate, validate_list_of;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, declare, validate, isa_list_of, validate_list_of} = intertype.export());
    //.........................................................................................................
    T.ok(isa.int32(1234));
    T.ok(isa.int32(-1234));
    T.ok(!isa.int32(1.3));
    T.ok(isa.vnr([-1234]));
    T.ok(isa_list_of.int32([-1234]));
    T.ok(isa_list_of.int32([]));
    T.ok(isa.vnr([-1234, 7e20]));
    T.ok(isa.vnr([-2e308]));
    T.ok(isa.vnr([+2e308]));
    T.ok(isa.vnr([+2e308, 1]));
    T.ok(isa.infloat(+1234567.665553));
    T.ok(isa.infloat(-1234567.665553));
    T.ok(isa.infloat(+2e308));
    T.ok(isa.infloat(-2e308));
    T.ok(!isa.vnr(Int32Array.from([-1234])));
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["check(): validation with intermediate results (experiment)"] = function(T, done) {
    var FS, PATH, R, check, check_fso_exists, check_integer, check_is_file, check_is_json_file, declare, error, i, intertype, is_happy, is_sad, isa, isa_integer, len, path, paths, sad, sadden, validate, validate_integer;
    //.........................................................................................................
    PATH = require('path');
    FS = require('fs');
    intertype = new Intertype();
    ({isa, validate, declare} = intertype.export());
    sad = Symbol('sad'); // will be made attribute of `intertype`
    //.........................................................................................................
    is_sad = function(x) {
      return (x === sad) || (x instanceof Error) || ((isa.object(x)) && (x[sad] === true));
    };
    is_happy = function(x) {
      return !is_sad(x);
    };
    sadden = function(x) {
      return {
        [sad]: true,
        _: x
      };
    };
    //.........................................................................................................
    check = new Proxy({}, {
      get: function(t, k) {
        return function(...P) {
          var error, fn;
          if (!isa.callable(fn = t[k])) {
            return fn;
          }
          try {
            return fn(...P);
          } catch (error1) {
            error = error1;
            return error;
          }
        };
      },
      set: function(t, k, v) {
        return t[k] = v;
      },
      delete: function(t, k, v) {
        return delete t[k];
      }
    });
    check.foo = 42;
    check.foo;
    check.integer = function(x) {
      return validate.integer(x);
    };
    debug('^336552^', check.integer(42));
    debug('^336552^', check.integer(42.5));
    //.........................................................................................................
    check_fso_exists = function(path, stats = null) {
      var error;
      try {
        return stats != null ? stats : FS.statSync(path);
      } catch (error1) {
        error = error1;
        return error;
      }
    };
    //.........................................................................................................
    check_is_file = function(path, stats = null) {
      var bad;
      if (is_sad((bad = stats = check_fso_exists(path, stats)))) {
        /* Checks if `path` exists, points to a file, is readable, and parses as a JSON file

        Malfunction Risks:
        * see `check_fso_exists()` &c.
        * FS-related race conditions, including
        * longish timeouts for paths pointing to non-local or otherwise misbehaving FS resources.
         */
        //.......................................................................................................
        /* in this case, `stats` is `sad` when `check_fso_exists()` fails; in the general case, it could be any
           manner of object whose computation required effort, so we want to keep it; we document that fact by
           aliasing it as `bad`: */
        return bad;
      }
      if (stats.isFile()) {
        return stats;
      }
      return sadden(`not a file: ${path}`);
    };
    //.........................................................................................................
    check_is_json_file = function(path) {
      var error;
      try {
        /* Checks if `path` exists, points to a file, is readable, and is parsable as a JSON file; as a
        side-effect, returns the result of parsing when successful.

        Malfunction Risks:
        * see `check_is_file()` &c.
        * file will be read and parsed synchronously; as such, an arbitrary amount of time and space could be
          required in case `path` points to a large file and/or is slow to parse
         */
        // return bad if is_sad ( bad = stats = check_is_file path, stats )
        return JSON.parse(FS.readFileSync(path));
      } catch (error1) {
        error = error1;
        return error;
      }
    };
    //.........................................................................................................
    debug('^377332-1^', is_sad(sad));
    debug('^377332-6^', is_sad({
      [sad]: true
    }));
    debug('^377332-7^', is_sad(new Error("wat")));
    debug('^377332-2^', is_sad(42));
    debug('^377332-3^', is_sad(false));
    debug('^377332-4^', is_sad(null));
    debug('^377332-5^', is_sad({
      [sad]: false
    }));
    paths = [PATH.resolve(PATH.join(__dirname, '../../package.json')), PATH.resolve(PATH.join(__dirname, '../../XXXXX'))];
    for (i = 0, len = paths.length; i < len; i++) {
      path = paths[i];
      R = null;
      while (true) {
        if (is_sad((R = check_is_json_file(path, R)))) {
          // break if ( R = check_fso_exists    path, R ) is sad
          // break if ( R = check_is_file       path, R ) is sad
          break;
        }
        break;
      }
      if (is_sad(R)) {
        warn("fails with", (rpr(R)).slice(0, 80));
      } else {
        help("is JSON file; contents:", (rpr(R)).slice(0, 100));
      }
    }
    warn('^99282^', (error = check_fso_exists('XXXXX')).code, CND.grey(error.message));
    warn('^99282^', (error = check_is_file('XXXXX')).code, CND.grey(error.message));
    warn('^99282^', (error = check_is_json_file('XXXXX')).code, CND.grey(error.message));
    //.........................................................................................................
    /* Turning a type declaration into a check */
    check_integer = function(x) {
      try {
        if (validate.integer(x)) {
          return x;
        }
      } catch (error1) {
        error = error1;
        return error;
      }
    };
    isa_integer = function(x) {
      return is_happy(check_integer(x));
    };
    validate_integer = function(x) {
      if (is_happy((R = check_integer(x)))) {
        return R;
      } else {
        throw R;
      }
    };
    //.........................................................................................................
    debug('^333442^', check_integer(42));
    debug('^333442^', (rpr(check_integer(42.5))).slice(0, 81));
    debug('^333442^', isa_integer(42));
    debug('^333442^', isa_integer(42.5));
    // debug stats
    // [ type, x, ] = probe
    // result = validate_list_of type, x
    // T.eq result, matcher
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["check(): validation with intermediate results (for reals)"] = function(T, done) {
    var FS, PATH, check, declare, declare_check, happy_fso_exists, happy_is_file, happy_is_json_file, happy_path, intertype, is_happy, is_sad, isa, sad, sad_fso_exists, sad_is_file, sad_is_json_file, sad_path, sadden, type_of, types_of, validate;
    //.........................................................................................................
    PATH = require('path');
    FS = require('fs');
    intertype = new Intertype();
    ({isa, validate, check, sad, is_sad, is_happy, sadden, type_of, types_of, declare, declare_check} = intertype.export());
    //.........................................................................................................
    declare_check('dvsbl_2_3', function(x) {
      validate.even(x);
      return modulo(x, 3) === 0;
    });
    //.........................................................................................................
    T.eq(is_happy(check('integer', 42)), true);
    T.eq(is_happy(check('dvsbl_2_3', 42)), true);
    T.eq(is_happy(check('dvsbl_2_3', 2 * 3)), true);
    T.eq(is_happy(check.integer(42)), true);
    T.eq(is_happy(check.dvsbl_2_3(42)), true);
    T.eq(is_happy(check.dvsbl_2_3(2 * 3)), true);
    //.........................................................................................................
    T.eq(check('dvsbl_2_3', 42), true);
    T.eq(check('dvsbl_2_3', 2 * 3), true);
    //.........................................................................................................
    T.eq(check('integer', 42), true);
    T.eq(check.integer(42), true);
    //.........................................................................................................
    T.eq(check.dvsbl_2_3(42), true);
    T.eq(check.dvsbl_2_3(2 * 3), true);
    //.........................................................................................................
    T.eq(is_happy(check('integer', 42.5)), false);
    T.eq(is_happy(check.integer(42.5)), false);
    T.eq(is_happy(check('dvsbl_2_3', 43)), false);
    T.eq(is_happy(check.dvsbl_2_3(43)), false);
    //.........................................................................................................
    T.eq(check('integer', 42.5), sad);
    T.eq(check.integer(42.5), sad);
    //.........................................................................................................
    T.ok(isa.error(check('dvsbl_2_3', 43)));
    T.ok(isa.error(check.dvsbl_2_3(43)));
    // #.........................................................................................................
    // declare 'fs_stats', tests:
    //   'x is an object':         ( x ) -> @isa.object  x
    //   'x.size is a cardinal':      ( x ) -> @isa.cardinal   x.size
    //   'x.atimeMs is a float':  ( x ) -> @isa.float  x.atimeMs
    //   'x.atime is a date':      ( x ) -> @isa.date    x.atime
    // #.........................................................................................................
    // ### NOTE: will throw error unless path exists, error is implicitly caught, represents sad path ###
    // declare_check 'fso_exists', ( path, stats = null ) -> FS.statSync path
    //   # try ( stats ? FS.statSync path ) catch error then error
    // #.........................................................................................................
    // declare_check 'is_file', ( path, stats = null ) ->
    //   return bad    if is_sad ( bad = stats = @check.fso_exists path, stats )
    //   return stats  if stats.isFile()
    //   return sadden "not a file: #{path}"
    // #.........................................................................................................
    // declare_check 'is_json_file', ( path ) ->
    //   return try ( JSON.parse FS.readFileSync path ) catch error then error
    //.........................................................................................................
    /* overloading 'path' here, obviously */
    happy_path = PATH.resolve(PATH.join(__dirname, '../../../package.json'));
    sad_path = 'xxxxx';
    happy_fso_exists = check.fso_exists(happy_path);
    happy_is_file = check.is_file(happy_path);
    happy_is_json_file = check.is_json_file(happy_path);
    sad_fso_exists = check.fso_exists(sad_path);
    sad_is_file = check.is_file(sad_path);
    sad_is_json_file = check.is_json_file(sad_path);
    T.ok(is_happy(happy_fso_exists));
    T.ok(is_happy(happy_is_file));
    T.ok(is_happy(happy_is_json_file));
    T.ok(is_sad(sad_fso_exists));
    T.ok(is_sad(sad_is_file));
    T.ok(is_sad(sad_is_json_file));
    T.ok(isa.fs_stats(happy_fso_exists));
    T.ok(isa.fs_stats(happy_is_file));
    T.ok(isa.object(happy_is_json_file));
    T.ok(isa.error(sad_fso_exists));
    T.ok(isa.error(sad_is_file));
    T.ok(isa.error(sad_is_json_file));
    T.eq(sad_fso_exists.code, 'ENOENT');
    T.eq(sad_is_file.code, 'ENOENT');
    T.eq(sad_is_json_file.code, 'ENOENT');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["check(): complain on name collision"] = function(T, done) {
    var FS, PATH, check, declare, declare_check, intertype, is_happy, is_sad, isa, sad, sadden, type_of, types_of, validate;
    //.........................................................................................................
    PATH = require('path');
    FS = require('fs');
    intertype = new Intertype();
    ({isa, validate, check, sad, is_sad, is_happy, sadden, type_of, types_of, declare, declare_check} = intertype.export());
    //.........................................................................................................
    declare_check('dvsbl_2_3', function(x) {
      validate.even(x);
      return modulo(x, 3) === 0;
    });
    //.........................................................................................................
    T.throws(/check 'dvsbl_2_3' already declared/, function() {
      return declare_check('dvsbl_2_3', function(x) {
        validate.even(x);
        return modulo(x, 3) === 0;
      });
    });
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["types_of() includes happy, sad"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, sad, sadden, size_of, type_of, types_of, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, sad, sadden, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [123,
      ['happy',
      'float'],
      null],
      [124,
      ['happy',
      'float'],
      null],
      [0,
      ['happy',
      'float'],
      null],
      [true,
      ['boolean',
      'happy'],
      null],
      [null,
      ['happy',
      'null'],
      null],
      [void 0,
      ['happy',
      'undefined'],
      null],
      [{},
      ['happy',
      'object'],
      null],
      [[],
      ['happy',
      'list'],
      null],
      [sad,
      ['sad',
      'symbol'],
      null],
      [new Error(),
      ['error',
      'sad'],
      null],
      [
        {
          [sad]: true,
          _: null
        },
        ['object',
        'sad',
        'saddened'],
        null
      ],
      [sadden(null),
      ['object',
      'sad',
      'saddened'],
      null]
    ];
//.........................................................................................................
// debug intersection_of [ 1, 2, 3, ], [ 'a', 3, 1, ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      matcher.sort();
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = intersection_of(matcher, types_of(probe));
          // log rpr [ probe, result, ]
          // resolve result
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["unsadden"] = async function(T, done) {
    var all_keys_of, declare, error, i, intertype, isa, len, matcher, probe, probes_and_matchers, sad, sadden, size_of, type_of, types_of, unsadden, validate;
    //.........................................................................................................
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, sad, sadden, unsadden, all_keys_of} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          [sad]: true,
          _: null
        },
        null,
        null
      ],
      [sadden(129282),
      129282,
      null],
      [333,
      333,
      null],
      [sad,
      null,
      "not a valid saddened"],
      [new Error(),
      null,
      "not a valid saddened"]
    ];
//.........................................................................................................
// debug intersection_of [ 1, 2, 3, ], [ 'a', 3, 1, ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          resolve(unsadden(probe));
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["isa.immediate, nowait"] = function(T, done) {
    var error, intertype, isa, nowait, r, type_of, types_of, validate;
    intertype = new Intertype();
    ({isa, types_of, type_of, validate, nowait} = intertype.export());
    try {
      //.........................................................................................................
      T.ok(indexOf.call(types_of(new Promise(function() {})), 'immediate') < 0);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171615');
    }
    try {
      T.ok(indexOf.call(types_of({
        then: function() {}
      }), 'immediate') < 0);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171616');
    }
    try {
      T.ok(indexOf.call(types_of(42), 'immediate') >= 0);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171617');
    }
    try {
      //.........................................................................................................
      T.eq(isa.immediate(null), true);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171618');
    }
    try {
      T.eq(isa.immediate(12.34), true);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171619');
    }
    try {
      T.eq(isa.immediate(void 0), true);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171620');
    }
    try {
      T.eq(isa.immediate(new Promise(function() {})), false);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171621');
    }
    try {
      //.........................................................................................................
      validate.immediate(42);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171622');
    }
    try {
      validate.immediate(void 0);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171623');
    }
    try {
      validate.immediate(null);
    } catch (error1) {
      error = error1;
      T.fail('testcase-171624');
    }
    try {
      validate.immediate(1 * '#');
    } catch (error1) {
      error = error1;
      T.fail('testcase-171625');
    }
    //.........................................................................................................
    T.throws(/not a valid immediate/, function() {
      var x;
      return validate.immediate(x = new Promise(function() {}));
    });
    try {
      // validate.immediate x = ( new Promise -> )
      (r = nowait((function(x) {
        return x ** 2;
      })(5)));
    } catch (error1) {
      error = error1;
      T.fail('testcase-171626');
    }
    T.eq(r, 25);
    T.throws(/not a valid immediate/, function() {
      return r = nowait((function() {
        return new Promise(function() {});
      })());
    });
    return done();
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "equality checks" ] = ( T, done ) ->
  //   ### TAINT bug: when this test runs as only one, no problem; when run after some of the above,
  //     `equals` check throws error `Error: ENOENT: no such file or directory, open 'equals'` (!!!) ###
  //   intertype = new Intertype()
  //   { isa
  //     check } = intertype.export()
  //   urge '^8873^', rpr ( k for k of intertype.export() )
  //   debug '^22231^', check.equals 3, 3
  //   debug '^22231^', check.equals 3, 4
  //   done() if done?

  //-----------------------------------------------------------------------------------------------------------
  this["equals"] = function(T, done) {
    /* TAINT copy more extensive tests from CND, `js_eq`? */
    var check, equals, error, intertype, isa, re;
    intertype = new Intertype();
    ({isa, check, equals} = intertype.export());
    re = /expected at least 2 arguments/;
    try {
      equals(3);
    } catch (error1) {
      error = error1;
      warn(error.message);
      if (re.test(error.message)) {
        T.ok(true);
      } else {
        T.fail(`expected error ${rpr(re)}, got ${rpr(error.message)}`);
      }
    }
    if (error == null) {
      T.fail("expected error, got none");
    }
    T.eq(equals(3, 3), true);
    T.eq(equals(3, 4), false);
    T.eq(equals(new Map([[1, 2]]), new Map([[1, 2]])), true);
    T.eq(equals(new Set([[1, 2]]), new Set([[1, 2]])), true);
    T.eq(equals(new Map([[1, 2]]), new Map([[1, 3]])), false);
    T.eq(equals(new Set([[1, 2]]), new Set([[1, 3]])), false);
    if (done != null) {
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["numerical types"] = async function(T, done) {
    var check, equals, error, i, intertype, isa, j, len, len1, matcher, pairs, probe, probes_and_matchers, type, type_of, value;
    intertype = new Intertype();
    ({isa, type_of, check, equals} = intertype.export());
    //.........................................................................................................
    probes_and_matchers = [['nan', [23, false]], ['finite', [23, true]], ['integer', [23, true]], ['safeinteger', [23, true]], ['numeric', [23, true]], ['even', [23, false]], ['odd', [23, true]], ['cardinal', [23, true]], ['nonnegative', [23, true]], ['positive', [23, true]], ['positive_integer', [23, true]], ['negative_integer', [23, false]], ['zero', [23, false]], ['infinity', [23, false]], ['infloat', [23, true]], ['nonpositive', [23, false]], ['negative', [23, false]], ['positive_float', [23, true]], ['negative_float', [23, false]]];
    //.........................................................................................................
    error = null;
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [type, ...pairs] = probes_and_matchers[i];
      for (j = 0, len1 = pairs.length; j < len1; j++) {
        [value, matcher] = pairs[j];
        probe = [type, value];
        await T.perform(probe, matcher, error, function() {
          return new Promise(function(resolve, reject) {
            resolve(isa[type](value));
            return null;
          });
        });
      }
    }
    if (done != null) {
      //.........................................................................................................
      return done();
    }
  };

  // type_of 1e32            ), 'float'
  // [ 'float',           [ 23, false ], ]

  //-----------------------------------------------------------------------------------------------------------
  this["real-life example 1"] = function(T, done) {
    var _defaults, check, equals, isa, type_of, types, types_of, validate;
    types = new Intertype();
    ({isa, type_of, types_of, validate, check, equals} = types.export());
    //.........................................................................................................
    types.declare('intershop_rpc_settings', {
      tests: {
        "x is a object": function(x) {
          return this.isa.object(x);
        },
        "x.host is a nonempty_text": function(x) {
          return this.isa.nonempty_text(x.host);
        },
        "x.port is a cardinal": function(x) {
          return this.isa.cardinal(x.port);
        },
        "x.show_counts is a boolean": function(x) {
          return this.isa.boolean(x.show_counts);
        },
        "x.count_interval is a positive_integer": function(x) {
          return this.isa.positive_integer(x.count_interval);
        },
        "x.socket_log_all is a boolean": function(x) {
          return this.isa.boolean(x.socket_log_all);
        },
        "x.socketserver_log_all is a boolean": function(x) {
          return this.isa.boolean(x.socketserver_log_all);
        },
        "x.logging is a boolean or a function": function(x) {
          return (this.isa.boolean(x.logging)) || (this.isa.function(x.logging));
        }
      }
    });
    //.........................................................................................................
    _defaults = Object.freeze({
      host: 'localhost',
      port: 23001,
      show_counts: true,
      count_interval: 1000,
      socket_log_all: false,
      socketserver_log_all: false,
      logging: true
    });
    //.........................................................................................................
    debug(types_of(_defaults.count_interval));
    T.ok(isa.intershop_rpc_settings(_defaults));
    return done();
  };

  // [ 'float',           [ 23, false ], ]

  //-----------------------------------------------------------------------------------------------------------
  this["real-life example 2"] = function(T, done) {
    var check, declare, equals, error, isa, type_of, types, types_of, validate;
    types = new Intertype();
    ({isa, declare, type_of, types_of, validate, check, equals} = types.export());
    //.........................................................................................................
    declare('intershop_cli_psql_run_selector', {
      tests: {
        "x is a nonempty_text": function(x) {
          return this.isa.nonempty_text(x);
        },
        "x must be '-c' or '-f'": function(x) {
          return x === '-c' || x === '-f';
        }
      }
    });
    //.........................................................................................................
    // debug types_of '-c'
    // debug types_of '-x'
    T.eq(isa.intershop_cli_psql_run_selector('-f'), true);
    T.eq(isa.intershop_cli_psql_run_selector('-c'), true);
    T.eq(isa.intershop_cli_psql_run_selector('xxx'), false);
    T.eq(isa.intershop_cli_psql_run_selector(''), false);
    try {
      validate.intershop_cli_psql_run_selector('-f');
      T.ok(true);
    } catch (error1) {
      error = error1;
      T.fail(error.message);
    }
    try {
      validate.some_unknown_type('-f');
      T.fail("expected an error, but statement passed");
    } catch (error1) {
      error = error1;
      T.ok(/violates.*is a known type/.test(error.message));
    }
    return done();
  };

  //###########################################################################################################
  if (module.parent == null) {
    test(this);
  }

  // test @[ "check(): complain on name collision" ]
// @[ "check(): complain on name collision" ]()
// test @[ "size_of" ]
// test @[ "numerical types" ]
// test @[ "real-life example 2" ]
// test @[ "equals" ]
// @[ "equality checks" ]()
// test @[ "isa.immediate, nowait" ]
// test @[ "types_of() includes happy, sad" ]
// @[ "types_of() includes happy, sad" ]()
// test @[ "check(): validation with intermediate results (experiment)" ]
// test @[ "check(): validation with intermediate results (for reals)" ]
// test @[ "types_of" ]
// test @[ "vnr, int32" ]
// test @[ "cast" ]
// test @[ "isa.list_of A" ]
// test @[ "isa.list_of B" ]
// test @[ "isa_object_of B" ]
// test @[ "validate.object_of B" ]
// test @[ "validate.list_of A" ]
// test @[ "validate.list_of B" ]

}).call(this);

//# sourceMappingURL=basics.test.js.map