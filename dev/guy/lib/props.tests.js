(function() {
  'use strict';
  var FS, H, PATH, _GUY, alert, debug, demo_keys, demo_seal_freeze, demo_strict_owner_with_proxy, demo_tree, demo_tree_readme, echo, equals, freeze, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  _GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = _GUY.trm.get_loggers('GUY/props/tests'));

  ({rpr, inspect, echo, log} = _GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  H = require('./helpers');

  ({freeze} = require('letsfreezethat'));

  // types                     = new ( require '../../../apps/intertype' ).Intertype
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.pick_with_fallback()"] = async function(T, done) {
    var error, guy, i, len, matcher, probe, probes_and_matchers;
    guy = require(H.guy_path);
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          {
            a: 1,
            b: 2,
            c: 3
          },
          null,
          ['a',
          'c']
        ],
        {
          a: 1,
          c: 3
        }
      ],
      [
        [
          {
            foo: 'bar',
            baz: 'gnu'
          },
          null,
          ['foo',
          'wat']
        ],
        {
          foo: 'bar',
          wat: null
        }
      ],
      [
        [
          {
            foo: 'bar',
            baz: 'gnu'
          },
          42,
          ['foo',
          'wat']
        ],
        {
          foo: 'bar',
          wat: 42
        }
      ],
      [
        [
          {
            foo: null,
            baz: 'gnu'
          },
          42,
          ['foo',
          'wat']
        ],
        {
          foo: null,
          wat: 42
        }
      ],
      [[{},
      void 0,
      void 0],
      {}]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, d_copy, fallback, keys, result;
          [d, fallback, keys] = probe;
          // debug '^443^', { d, fallback, keys, }
          d_copy = {...d};
          if (keys != null) {
            result = guy.props.pick_with_fallback(d, fallback, ...keys);
          } else {
            result = guy.props.pick_with_fallback(d, fallback);
          }
          if (T != null) {
            T.eq(d, d_copy);
          }
          if (T != null) {
            T.ok(d !== result);
          }
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.pluck_with_fallback()"] = async function(T, done) {
    var error, guy, i, len, matcher, probe, probes_and_matchers;
    guy = require(H.guy_path);
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          {
            a: 1,
            b: 2,
            c: 3
          },
          null,
          ['a',
          'c'],
          {
            b: 2
          }
        ],
        {
          a: 1,
          c: 3
        }
      ],
      [
        [
          {
            foo: 'bar',
            baz: 'gnu'
          },
          null,
          ['foo',
          'wat'],
          {
            baz: 'gnu'
          }
        ],
        {
          foo: 'bar',
          wat: null
        }
      ],
      [
        [
          {
            foo: 'bar',
            baz: 'gnu'
          },
          42,
          ['foo',
          'wat'],
          {
            baz: 'gnu'
          }
        ],
        {
          foo: 'bar',
          wat: 42
        }
      ],
      [
        [
          {
            foo: null,
            baz: 'gnu'
          },
          42,
          ['foo',
          'wat'],
          {
            baz: 'gnu'
          }
        ],
        {
          foo: null,
          wat: 42
        }
      ],
      [[{},
      null,
      void 0,
      {}],
      {}]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, d_changed, d_copy, fallback, keys, result;
          [d, fallback, keys, d_changed] = probe;
          d_copy = {...d};
          if (keys != null) {
            result = guy.props.pluck_with_fallback(d, fallback, ...keys);
          } else {
            result = guy.props.pluck_with_fallback(d, fallback);
          }
          if (T != null) {
            T.eq(d, d_changed);
          }
          if (T != null) {
            T.ok(d !== result);
          }
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.nullify_undefined()"] = async function(T, done) {
    var error, guy, i, len, matcher, probe, probes_and_matchers;
    guy = require(H.guy_path);
    //.........................................................................................................
    probes_and_matchers = [
      [{},
      {}],
      [null,
      {}],
      [void 0,
      {}],
      [
        {
          a: 1,
          b: 2,
          c: 3
        },
        {
          a: 1,
          b: 2,
          c: 3
        }
      ],
      [
        {
          a: void 0,
          b: 2,
          c: 3
        },
        {
          a: null,
          b: 2,
          c: 3
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, d_copy, result;
          d = probe;
          d_copy = {...d};
          result = guy.props.nullify_undefined(d);
          if (d != null) {
            if (T != null) {
              T.eq(d, d_copy);
            }
          }
          if (T != null) {
            T.ok(d !== result);
          }
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.crossmerge()"] = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          keys: {},
          values: {}
        },
        {}
      ],
      [
        {
          keys: {
            x: 42
          },
          values: {
            x: 108
          }
        },
        {
          x: 108
        }
      ],
      [
        {
          keys: {
            a: 1,
            b: 2
          },
          values: {
            b: 3,
            c: 4
          },
          fallback: 'oops'
        },
        {
          a: 'oops',
          b: 3
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = GUY.props.crossmerge(probe);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.omit_nullish()"] = async function(T, done) {
    var error, guy, i, len, matcher, probe, probes_and_matchers;
    guy = require(H.guy_path);
    //.........................................................................................................
    probes_and_matchers = [
      [{},
      {}],
      [null,
      {}],
      [void 0,
      {}],
      [
        {
          a: 1,
          b: 2,
          c: 3
        },
        {
          a: 1,
          b: 2,
          c: 3
        }
      ],
      [
        {
          a: void 0,
          b: 2,
          c: 3
        },
        {
          b: 2,
          c: 3
        }
      ],
      [
        {
          a: void 0,
          b: 2,
          c: null
        },
        {
          b: 2
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, d_copy, result;
          d = probe;
          d_copy = {...d};
          result = guy.props.omit_nullish(d);
          if (d != null) {
            if (T != null) {
              T.eq(d, d_copy);
            }
          }
          if (T != null) {
            T.ok(d !== result);
          }
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.props.def(), .hide()"] = function(T, done) {
    var guy;
    guy = require(H.guy_path);
    (() => {      //.........................................................................................................
      var x;
      x = {};
      guy.props.def(x, 'foo', {
        enumerable: false,
        value: 42
      });
      if (T != null) {
        T.eq(rpr(x), '{}');
      }
      return T != null ? T.eq(Object.getOwnPropertyDescriptor(x, 'foo'), {
        value: 42,
        writable: false,
        enumerable: false,
        configurable: false
      }) : void 0;
    })();
    (() => {
      var x;
      x = {};
      guy.props.hide(x, 'foo', 42);
      if (T != null) {
        T.eq(rpr(x), '{}');
      }
      return T != null ? T.eq(Object.getOwnPropertyDescriptor(x, 'foo'), {
        value: 42,
        writable: true,
        enumerable: false,
        configurable: true
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.has()"] = function(T, done) {
    var GUY, X, Y, x, y;
    GUY = require(H.guy_path);
    if (T != null) {
      T.eq(GUY.props.has(null, 'xy'), false);
    }
    if (T != null) {
      T.eq(GUY.props.has(42, 'xy'), false);
    }
    if (T != null) {
      T.eq(GUY.props.has({}, 'xy'), false);
    }
    if (T != null) {
      T.eq(GUY.props.has({
        xy: false
      }, 'xy'), true);
    }
    X = (function() {
      //.........................................................................................................
      class X {
        constructor() {
          this.xy3 = true;
          GUY.props.def(this, 'oops', {
            get: function() {
              throw new Error('Oops');
            }
          });
          return void 0;
        }

      };

      X.prototype.xy1 = 'foo';

      X.prototype.xy2 = void 0;

      return X;

    }).call(this);
    Y = class Y extends X {};
    x = new X();
    y = new Y();
    if (T != null) {
      T.eq(GUY.props.has(x, 'xy1'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'xy2'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'xy3'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(y, 'xy1'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(y, 'xy2'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(y, 'xy3'), true);
    }
    if (T != null) {
      T.throws('Oops', function() {
        return x.oops;
      });
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'oops'), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_get = function(T, done) {
    var GUY, fallback, value;
    GUY = require(H.guy_path);
    fallback = Symbol('fallback');
    value = Symbol('value');
    debug('^334-1^', GUY.props.get({}, 'xy', void 0));
    debug('^334-1^');
    if (T != null) {
      T.eq(GUY.props.get(void 0, 'xy', fallback), fallback);
    }
    debug('^334-2^');
    if (T != null) {
      T.eq(GUY.props.get(null, 'xy', fallback), fallback);
    }
    debug('^334-3^');
    if (T != null) {
      T.eq(GUY.props.get(42, 'xy', fallback), fallback);
    }
    debug('^334-4^');
    if (T != null) {
      T.eq(GUY.props.get({}, 'xy', fallback), fallback);
    }
    debug('^334-4^');
    if (T != null) {
      T.eq(GUY.props.get({}, 'xy', void 0), void 0);
    }
    debug('^334-5^');
    if (T != null) {
      T.eq(GUY.props.get({
        xy: value
      }, 'xy'), value);
    }
    debug('^334-6^');
    if (T != null) {
      T.throws(/no such property/, function() {
        return GUY.props.get(void 0, 'xy');
      });
    }
    debug('^334-6^');
    if (T != null) {
      T.throws(/expected 2 or 3 arguments, got 1/, function() {
        return GUY.props.get(void 0);
      });
    }
    debug('^334-6^');
    if (T != null) {
      T.throws(/no such property/, function() {
        return GUY.props.get({}, 'xy');
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner 1"] = function(T, done) {
    var GUY, X, error, x;
    GUY = require(H.guy_path);
    X = (function() {
      //.........................................................................................................
      class X extends GUY.props.Strict_owner {
        constructor() {
          super();
          this.prop_on_instance_2 = 'prop_on_instance_2';
          return void 0;
        }

      };

      X.prototype.prop_on_instance_1 = 'prop_on_instance_1';

      return X;

    }).call(this);
    //.........................................................................................................
    x = new X();
    x.prop_on_instance_3 = 'prop_on_instance_3';
    if (T != null) {
      T.eq(x.prop_on_instance_1, 'prop_on_instance_1');
    }
    if (T != null) {
      T.eq(x.prop_on_instance_2, 'prop_on_instance_2');
    }
    if (T != null) {
      T.eq(x.prop_on_instance_3, 'prop_on_instance_3');
    }
    // #.........................................................................................................
    // T?.eq ( GUY.props.has.prop_on_instance_1 x      ), true
    // T?.eq ( GUY.props.has.prop_on_instance_2 x      ), true
    // T?.eq ( GUY.props.has.prop_on_instance_3 x      ), true
    // T?.eq ( GUY.props.has.foobar x                  ), false
    // T?.eq ( GUY.props.has[ Symbol.toStringTag ] x   ), true
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.has(x, 'prop_on_instance_1'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'prop_on_instance_2'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'prop_on_instance_3'), true);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'foobar'), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.has(x, 'has'), false);
    }
    if (T != null) {
      T.eq(GUY.props.has(x, 'get'), false);
    }
    try {
      urge(x.bar);
    } catch (error1) {
      error = error1;
      warn(_GUY.trm.reverse(error.message));
    }
    if (T != null) {
      T.throws(/X instance does not have property 'bar'/, () => {
        return x.bar;
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner 2"] = function(T, done) {
    var GUY, X, x;
    GUY = require(H.guy_path);
    X = (function() {
      //.........................................................................................................
      class X extends GUY.props.Strict_owner {};

      X.prototype.prop_on_instance_1 = 'prop_on_instance_1';

      X.prototype.get = 42;

      X.prototype.has = 108;

      return X;

    }).call(this);
    //.........................................................................................................
    x = new X();
    debug('^4458^', type_of(x));
    debug('^4458^', typeof x);
    if (T != null) {
      T.eq(x.get, 42);
    }
    if (T != null) {
      T.eq(x.has, 108);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner can use Reflect.has"] = function(T, done) {
    var GUY, X, error, x;
    GUY = require(H.guy_path);
    X = (function() {
      //.........................................................................................................
      class X extends GUY.props.Strict_owner {
        constructor() {
          super();
          this.prop_in_constructor = 'prop_in_constructor';
        }

      };

      X.prototype.prop_on_instance = 'prop_on_instance_1';

      return X;

    }).call(this);
    //.........................................................................................................
    x = new X();
    debug('^4458^', x.prop_in_constructor);
    debug('^4458^', x.prop_on_instance);
    try {
      x.no_such_prop;
    } catch (error1) {
      error = error1;
      warn(_GUY.trm.reverse(error.message));
    }
    if (T != null) {
      T.throws(/X instance does not have property 'no_such_prop'/, function() {
        return x.no_such_prop;
      });
    }
    if (T != null) {
      T.eq(Reflect.has(x, 'prop_in_constructor'), true);
    }
    if (T != null) {
      T.eq(Reflect.has(x, 'prop_on_instance'), true);
    }
    if (T != null) {
      T.eq(Reflect.has(x, 'no_such_prop'), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner can use explicit target"] = function(T, done) {
    var GUY, error, f, x;
    GUY = require(H.guy_path);
    //.........................................................................................................
    f = function(x) {
      return x * 2;
    };
    debug(x = new GUY.props.Strict_owner({
      target: f
    }));
    debug('^4458^', type_of(x));
    debug('^4458^', typeof x);
    debug(x(42));
    try {
      urge(x.bar);
    } catch (error1) {
      error = error1;
      warn(_GUY.trm.reverse(error.message));
    }
    if (T != null) {
      T.throws(/Strict_owner instance does not have property 'bar'/, () => {
        return x.bar;
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner can disallow redefining keys"] = function(T, done) {
    var GUY, x;
    GUY = require(H.guy_path);
    //.........................................................................................................
    debug(x = new GUY.props.Strict_owner({
      seal: true
    }));
    // x.foo   = 42
    if (T != null) {
      T.throws(/Cannot define property foo, object is not extensible/, () => {
        return x.foo = 42;
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner can disallow reassining keys"] = function(T, done) {
    var GUY, d, x;
    GUY = require(H.guy_path);
    //.........................................................................................................
    d = {
      a: 1,
      b: 2,
      d: 3
    };
    x = new GUY.props.Strict_owner({
      target: d,
      oneshot: true
    });
    if (T != null) {
      T.throws(/Strict_owner instance already has property 'a'/, () => {
        return x.a = 42;
      });
    }
    x.foo = 42;
    if (T != null) {
      T.throws(/Strict_owner instance already has property 'foo'/, () => {
        return x.foo = 42;
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner can allows peeking for `.then`"] = function(T, done) {
    var GUY, d, x;
    GUY = require(H.guy_path);
    //.........................................................................................................
    d = {
      a: 1,
      b: 2,
      d: 3
    };
    x = new GUY.props.Strict_owner({
      target: d,
      oneshot: true
    });
    debug(x.then);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_keys = function() {
    var A, B, C, D, GUY, d, e, k, lst, n;
    GUY = require('../../../apps/guy');
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.is_a = true;

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.is_b = true;

      return B;

    }).call(this);
    C = (function() {
      class C extends B {};

      C.prototype.is_c = true;

      return C;

    }).call(this);
    D = (function() {
      class D extends C {
        constructor() {
          super();
          this.in_constructor = 's';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d = true;

      D.prototype.in_declaration = 42;

      return D;

    }).call(this);
    //.........................................................................................................
    d = new D();
    d[Symbol.for('x')] = 'x';
    GUY.props.hide(d, 'hidden', 'hidden');
    n = Object.create(null);
    e = new SyntaxError(null);
    //.........................................................................................................
    urge('^3453-1^', Object.keys(d)); // 00:00 GUY/TESTS/PROPS  ?  ^3453-1^ [ 'in_constructor' ]
    urge('^3453-2^', (function() {
      var results;
// 00:00 GUY/TESTS/PROPS  ?  ^3453-2^ [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
      results = [];
      for (k in d) {
        results.push(k);
      }
      return results;
    })());
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: null"); // 00:00 GUY/TESTS/PROPS  ▶  depth: null
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: null // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: null,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: null,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: null,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 0"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 0
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 0 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 0,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x) ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 0,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 0,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 1"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 1
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 1 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 1,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 1,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 1,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 2"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 2
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 2 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 2,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 2,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 2,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 3"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 3
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 3 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 3,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 3,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 3,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 4"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 4
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 4 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 4,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 4,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 4,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    //......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
    info();
    info("depth: 5"); // 00:00 GUY/TESTS/PROPS  ▶  depth: 5
    urge('^3453-3^', "standard  ", GUY.props.keys(d, {
      depth: 5 // 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "symbols   ", GUY.props.keys(d, {
      depth: 5,
      symbols: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    urge('^3453-5^', "builtins  ", GUY.props.keys(d, {
      depth: 5,
      builtins: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
    }));
    urge('^3453-5^', "hidden    ", GUY.props.keys(d, {
      depth: 5,
      hidden: true // 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
    }));
    //.........................................................................................................
    lst = ['x'];
    urge('^3453-6^', Object.keys(lst));
    urge('^3453-6^', (function() {
      var results;
      results = [];
      for (k in lst) {
        results.push(k);
      }
      return results;
    })());
    urge('^3453-6^', GUY.props.keys(lst));
    urge('^3453-6^', GUY.props.keys(lst, {
      symbols: true,
      builtins: true
    }));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.keys() works for all JS values, including null and undefined"] = function(T, done) {
    var GUY;
    GUY = require('../../../apps/guy');
    //.........................................................................................................
    if (T != null) {
      T.throws(/called on non-object/, function() {
        return GUY.props.keys(null, {
          allow_any: false
        });
      });
    }
    if (T != null) {
      T.throws(/called on non-object/, function() {
        return GUY.props.keys(42, {
          allow_any: false
        });
      });
    }
    if (T != null) {
      T.eq(GUY.props.keys(42), []);
    }
    if (T != null) {
      T.eq(GUY.props.keys(null), []);
    }
    if (T != null) {
      T.eq(GUY.props.keys(void 0), []);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.keys()"] = function(T, done) {
    var A, B, C, D, GUY, d, e, k, lst, n;
    GUY = require('../../../apps/guy');
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.is_a = true;

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.is_b = true;

      return B;

    }).call(this);
    C = (function() {
      class C extends B {};

      C.prototype.is_c = true;

      return C;

    }).call(this);
    D = (function() {
      class D extends C {
        constructor() {
          super();
          this.in_constructor = 's';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d = true;

      D.prototype.in_declaration = 42;

      return D;

    }).call(this);
    //.........................................................................................................
    d = new D();
    d[Symbol.for('x')] = 'x';
    // y = Symbol 'y'; d[ y ] = y
    GUY.props.hide(d, 'hidden', 'hidden');
    n = Object.create(null);
    e = new SyntaxError(null);
    //.........................................................................................................
    if (T != null) {
      T.eq(Object.keys(d), ['in_constructor']);
    }
    if (T != null) {
      T.eq((function() {
        var results;
        results = [];
        for (k in d) {
          results.push(k);
        }
        return results;
      })(), ['in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null,
        symbols: true,
        builtins: true
      }), ['in_constructor', 'hidden', Symbol.for('x'), 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null,
        symbols: true,
        hidden: true
      }), ['in_constructor', 'hidden', Symbol.for('x'), 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null
      }), ['in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: null,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 0
      }), ['in_constructor']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 0,
        symbols: true
      }), ['in_constructor', Symbol.for('x')]);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 0,
        builtins: true
      }), ['in_constructor', 'hidden']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 0,
        hidden: true
      }), ['in_constructor', 'hidden']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 1
      }), ['in_constructor', 'is_d', 'in_declaration']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 1,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 1,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 1,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 2
      }), ['in_constructor', 'is_d', 'in_declaration', 'is_c']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 2,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration', 'is_c']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 2,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 2,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 3
      }), ['in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 3,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration', 'is_c', 'is_b']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 3,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 3,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 4
      }), ['in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 4,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 4,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 4,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 5
      }), ['in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 5,
        symbols: true
      }), ['in_constructor', Symbol.for('x'), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 5,
        builtins: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        depth: 5,
        hidden: true
      }), ['in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a']);
    }
    //.........................................................................................................
    lst = ['x'];
    if (T != null) {
      T.eq(Object.keys(lst), ['0']);
    }
    if (T != null) {
      T.eq((function() {
        var results;
        results = [];
        for (k in lst) {
          results.push(k);
        }
        return results;
      })(), ['0']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(lst), ['0']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(lst, {
        symbols: true,
        builtins: true
      }), ['0', 'length', 'constructor', 'at', 'concat', 'copyWithin', 'fill', 'find', 'findIndex', 'findLast', 'findLastIndex', 'lastIndexOf', 'pop', 'push', 'reverse', 'shift', 'unshift', 'slice', 'sort', 'splice', 'includes', 'indexOf', 'join', 'keys', 'entries', 'values', 'forEach', 'filter', 'flat', 'flatMap', 'map', 'every', 'some', 'reduce', 'reduceRight', 'toReversed', 'toSorted', 'toSpliced', 'with', 'toLocaleString', 'toString', Symbol.iterator, Symbol.unscopables, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__']);
    }
    // T?.eq ( GUY.props.keys Array, { symbols: true, builtins: true, } ), [ 'length', 'name', 'prototype', 'isArray', 'from', 'of', Symbol.species, 'arguments', 'caller', 'constructor', 'apply', 'bind', 'call', 'toString', Symbol.hasInstance, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString' ]
    if (T != null) {
      T.eq(GUY.props.keys(Array, {
        symbols: true,
        builtins: true
      }), ['length', 'name', 'prototype', 'isArray', 'from', 'fromAsync', 'of', Symbol.species, 'arguments', 'caller', 'constructor', 'apply', 'bind', 'call', 'toString', Symbol.hasInstance, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_keys_depth_first = function(T, done) {
    var A, B, C, D, GUY, cfg, d;
    GUY = require('../../../apps/guy');
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.is_a = true;

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.is_b = true;

      return B;

    }).call(this);
    C = (function() {
      class C extends B {};

      C.prototype.is_c = true;

      return C;

    }).call(this);
    D = (function() {
      class D extends C {
        constructor() {
          super();
          this.in_constructor = 's';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d_1 = true;

      D.prototype.is_d_2 = 42;

      return D;

    }).call(this);
    //.........................................................................................................
    d = new D();
    cfg = {
      depth: null,
      builtins: false,
      hidden: true
    };
    debug('^4243^', GUY.props.keys(d, {
      ...cfg,
      depth_first: false
    }));
    debug('^4243^', GUY.props.keys(d, {
      ...cfg,
      depth_first: true
    }));
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        ...cfg,
        depth_first: false
      }), ['in_constructor', 'constructor', 'instance_method_on_d', 'is_d_1', 'is_d_2', 'is_c', 'is_b', 'is_a']);
    }
    if (T != null) {
      T.eq(GUY.props.keys(d, {
        ...cfg,
        depth_first: true
      }), ['constructor', 'is_a', 'is_b', 'is_c', 'instance_method_on_d', 'is_d_1', 'is_d_2', 'in_constructor']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_get_prototype_chain = function(T, done) {
    var A, B, C, D, GUY;
    GUY = require('../../../apps/guy');
    A = (function() {
      //.........................................................................................................
      class A {};

      A.prototype.is_a = true;

      return A;

    }).call(this);
    B = (function() {
      class B extends A {};

      B.prototype.is_b = true;

      return B;

    }).call(this);
    C = (function() {
      class C extends B {};

      C.prototype.is_c = true;

      return C;

    }).call(this);
    D = (function() {
      class D extends C {
        constructor() {
          super();
          this.in_constructor = 's';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d_1 = true;

      D.prototype.is_d_2 = 42;

      return D;

    }).call(this);
    (() => {      //.........................................................................................................
      var chain, d, i, idx, ref, x;
      d = new D();
      // debug '^32424^', Object.getPrototypeOf null
      chain = GUY.props.get_prototype_chain(d);
      // debug '^4243^', ( rpr x ), ( rpr x.constructor.name ), ( type_of x ) for x in chain
      if (T != null) {
        T.eq((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = chain.length; i < len; i++) {
            x = chain[i];
            results.push(x.constructor.name);
          }
          return results;
        })(), ['D', 'D', 'C', 'B', 'A', 'Object']);
      }
      for (idx = i = 0, ref = chain.length - 1; (0 <= ref ? i < ref : i > ref); idx = 0 <= ref ? ++i : --i) {
        if (T != null) {
          T.eq((Object.getPrototypeOf(chain[idx])) === chain[idx + 1], true);
        }
      }
      return T != null ? T.eq((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = chain.length; j < len; j++) {
          x = chain[j];
          results.push(Object.getOwnPropertyNames(x));
        }
        return results;
      })(), [['in_constructor'], ['constructor', 'instance_method_on_d', 'is_d_1', 'is_d_2'], ['constructor', 'is_c'], ['constructor', 'is_b'], ['constructor', 'is_a'], ['constructor', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString']]) : void 0;
    })();
    (() => {      //.........................................................................................................
      var x;
      if (T != null) {
        T.eq((function() {
          var i, len, ref, ref1, ref2, results;
          ref = GUY.props.get_prototype_chain(null);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push((ref1 = x != null ? (ref2 = x.constructor) != null ? ref2.name : void 0 : void 0) != null ? ref1 : '???');
          }
          return results;
        })(), []);
      }
      if (T != null) {
        T.eq((function() {
          var i, len, ref, ref1, ref2, results;
          ref = GUY.props.get_prototype_chain(void 0);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push((ref1 = x != null ? (ref2 = x.constructor) != null ? ref2.name : void 0 : void 0) != null ? ref1 : '???');
          }
          return results;
        })(), []);
      }
      if (T != null) {
        T.eq((function() {
          var i, len, ref, ref1, ref2, results;
          ref = GUY.props.get_prototype_chain(42);
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push((ref1 = x != null ? (ref2 = x.constructor) != null ? ref2.name : void 0 : void 0) != null ? ref1 : '???');
          }
          return results;
        })(), ['Number', 'Number', 'Object']);
      }
      return T != null ? T.eq((function() {
        var i, len, ref, ref1, ref2, results;
        ref = GUY.props.get_prototype_chain(Object.create(null));
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          x = ref[i];
          results.push((ref1 = x != null ? (ref2 = x.constructor) != null ? ref2.name : void 0 : void 0) != null ? ref1 : '???');
        }
        return results;
      })(), ['???']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_xray = function(T, done) {
    var GUY, Strict_owner, d, hide, hs, keys, soc, xray;
    GUY = require('../../../apps/guy');
    ({Strict_owner, hide, keys, xray} = GUY.props);
    //.........................................................................................................
    hs = Symbol('hidden_symbol');
    soc = Symbol('Strict_owner_cfg');
    d = new Strict_owner({
      oneshot: true
    });
    hide(d, 'a', 1);
    hide(d, 'b', 2);
    hide(d, 'c', 3);
    hide(d, hs, 4);
    (() => {
      var e;
      e = {...d};
      if (T != null) {
        T.eq(rpr({d, e}), '{ d: Strict_owner {}, e: {} }');
      }
      if (T != null) {
        T.eq(d[hs], 4);
      }
      if (T != null) {
        T.eq(e[hs], void 0);
      }
      return null;
    })();
    (() => {
      if (T != null) {
        T.eq(rpr(keys(d, {
          hidden: true,
          symbols: true,
          builtins: false
        })), "[ 'a', 'b', 'c', Symbol(Strict_owner_cfg), Symbol(hidden_symbol), 'constructor' ]");
      }
      if (T != null) {
        T.eq(xray(d), {
          a: 1,
          b: 2,
          c: 3,
          constructor: Strict_owner,
          [hs]: 4
        });
      }
      return null;
    })();
    (() => {
      var e;
      e = [];
      e.a = 1;
      e.b = 2;
      e.c = 3;
      e[hs] = 4;
      e.constructor = Strict_owner;
      debug(e);
      if (T != null) {
        T.eq(xray(d, []), e);
      }
      return null;
    })();
    (() => {
      if (T != null) {
        T.eq(xray([1, 2, 3]), {
          '0': 1,
          '1': 2,
          '2': 3,
          length: 3
        });
      }
      if (T != null) {
        T.eq(xray([1, 2, 3], []), [1, 2, 3]);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_locking = function(T, done) {
    var GUY, Strict_owner, hide, keys, xray;
    GUY = require('../../../apps/guy');
    ({Strict_owner, hide, keys, xray} = GUY.props);
    (() => {      //.........................................................................................................
      var X, x;
      X = class X extends Strict_owner {
        constructor(cfg) {
          super(cfg);
          this.a = 1;
          this.b = 2;
        }

      };
      x = new X();
      if (T != null) {
        T.throws(/X instance does not have property 'c'/, function() {
          return x.c;
        });
      }
      if (T != null) {
        T.throws(/X instance does not have property 'get_locked'/, function() {
          return x.get_locked;
        });
      }
      if (T != null) {
        T.eq(Strict_owner.get_locked(x), true);
      }
      if (T != null) {
        T.eq(Strict_owner.set_locked(x, false), false);
      }
      return T != null ? T.eq(x.c, void 0) : void 0;
    })();
    (() => {      //.........................................................................................................
      var target, x;
      target = [1, 2, 3];
      x = new Strict_owner({target});
      if (T != null) {
        T.eq(x[0], 1);
      }
      if (T != null) {
        T.eq(x[1], 2);
      }
      if (T != null) {
        T.throws(/Strict_owner instance does not have property '3'/, function() {
          return x[3];
        });
      }
      if (T != null) {
        T.throws(/Strict_owner instance does not have property 'get_locked'/, function() {
          return x.get_locked;
        });
      }
      if (T != null) {
        T.eq(Strict_owner.get_locked(x), true);
      }
      if (T != null) {
        T.eq(Strict_owner.set_locked(x, false), false);
      }
      return T != null ? T.eq(x.c, void 0) : void 0;
    })();
    (() => {      //.........................................................................................................
      var X, x;
      X = class X extends Strict_owner {
        constructor(cfg) {
          var seal;
          cfg = {
            freeze: false,
            seal: false,
            ...cfg
          };
          ({freeze, seal} = cfg);
          cfg.freeze = false;
          cfg.seal = false;
          super(cfg);
          this.a = 1;
          this.b = 2;
          if (freeze) {
            Object.freeze(this);
          }
          if (seal) {
            Object.seal(this);
          }
          return void 0;
        }

      };
      x = new X({
        freeze: true
      });
      if (T != null) {
        T.throws(/X instance does not have property 'c'/, function() {
          return x.c;
        });
      }
      if (T != null) {
        T.throws(/X instance does not have property 'get_locked'/, function() {
          return x.get_locked;
        });
      }
      if (T != null) {
        T.eq(Strict_owner.get_locked(x), true);
      }
      if (T != null) {
        T.eq(Strict_owner.set_locked(x, false), false);
      }
      return T != null ? T.eq(x.c, void 0) : void 0;
    })();
    (() => {      //.........................................................................................................
      var target, x;
      target = [1, 2, 3];
      x = new Strict_owner({
        target,
        freeze: true
      });
      if (T != null) {
        T.eq(x[0], 1);
      }
      if (T != null) {
        T.eq(x[1], 2);
      }
      if (T != null) {
        T.throws(/Strict_owner instance does not have property '3'/, function() {
          return x[3];
        });
      }
      if (T != null) {
        T.throws(/Strict_owner instance does not have property 'get_locked'/, function() {
          return x.get_locked;
        });
      }
      if (T != null) {
        T.eq(Strict_owner.get_locked(x), true);
      }
      if (T != null) {
        T.eq(Strict_owner.set_locked(x, false), false);
      }
      return T != null ? T.eq(x.c, void 0) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tree = function() {
    var GUY, d, rcrsv, x;
    GUY = require('../../../apps/guy');
    //.........................................................................................................
    d = {
      a: [0, 1, 2],
      e: {
        g: {
          some: 'thing'
        },
        h: 42,
        h: null
      },
      empty: {}
    };
    x = Object.create(d);
    rcrsv = {
      somekey: {
        subkey: 'somevalue'
      }
    };
    rcrsv.rcrsv = rcrsv;
    (() => {      //.........................................................................................................
      var cfg, i, j, len, len1, o, path, ref, ref1;
      ref = [d, x, rcrsv];
      for (i = 0, len = ref.length; i < len; i++) {
        o = ref[i];
        whisper('————————————————————————————————————————————————————————————');
        whisper(o);
        whisper(cfg = {});
        ref1 = GUY.props.tree(o, cfg);
        for (j = 0, len1 = ref1.length; j < len1; j++) {
          path = ref1[j];
          praise('^453^', rpr(path));
        }
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, evaluate, i, len, path, ref;
      whisper('————————————————————————————————————————————————————————————');
      evaluate = function({owner, key, value}) {
        if (!isa.object(value)) {
          return 'take';
        }
        if (!GUY.props.has_any_keys(value)) {
          return 'take';
        }
        return 'descend';
      };
      whisper(cfg = {evaluate});
      ref = GUY.props.tree(d, cfg);
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        praise('^453^', rpr(path));
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, evaluate, i, len, path, ref;
      whisper('————————————————————————————————————————————————————————————');
      evaluate = function({owner, key, value}) {
        if (!isa.object(value)) {
          return 'take';
        }
        if (!GUY.props.has_any_keys(value)) {
          return 'take';
        }
        return 'descend';
      };
      whisper(cfg = {
        evaluate,
        joiner: '.'
      });
      ref = GUY.props.tree(d, cfg);
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        praise('^453^', rpr(path));
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, i, len, path, ref;
      whisper('————————————————————————————————————————————————————————————');
      whisper(GUY.props.keys(d, {
        depth: 0
      }));
      whisper(GUY.props.keys(x, {
        depth: 0
      }));
      whisper(GUY.props.keys(x, {
        depth: 1
      }));
      whisper(GUY.props.keys(rcrsv, {
        depth: 1
      }));
      whisper(cfg = {
        joiner: '.',
        depth: null
      });
      ref = GUY.props.tree(x, cfg);
      for (i = 0, len = ref.length; i < len; i++) {
        path = ref[i];
        praise('^453^', rpr(path));
      }
      return null;
    })();
    (() => {      //.........................................................................................................
      var cfg, path, ref;
      whisper('————————————————————————————————————————————————————————————');
      whisper(rcrsv);
      whisper(cfg = {
        depth: 0,
        joiner: '.',
        symbols: true,
        hidden: true,
        builtins: true
      });
      ref = GUY.props.tree(rcrsv, cfg);
      for (path of ref) {
        praise('^453^', rpr(path));
      }
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tree_readme = function() {
    var GUY, d, evaluate, i, j, l, len, len1, len2, path, ref, ref1, ref2;
    GUY = require(H.guy_path);
    log = console.log;
    ({inspect} = require('util'));
    d = {
      a: [0, 1, 2],
      e: {
        g: {
          some: 'thing'
        },
        h: 42,
        h: null
      },
      empty: {}
    };
    urge('—————————————————————————————————————————————————————————————');
    ref = GUY.props.tree(d);
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      log(inspect(path));
    }
    urge('—————————————————————————————————————————————————————————————');
    ref1 = GUY.props.tree(d, {
      joiner: '.'
    });
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      path = ref1[j];
      log(inspect(path));
    }
    urge('—————————————————————————————————————————————————————————————');
    evaluate = function({owner, key, value}) {
      if (Array.isArray(value)) {
        return 'take';
      }
      if (!GUY.props.has_any_keys(value)) {
        return 'take';
      }
      return 'descend';
    };
    ref2 = GUY.props.tree(d, {
      evaluate,
      joiner: '.'
    });
    for (l = 0, len2 = ref2.length; l < len2; l++) {
      path = ref2[l];
      log(inspect(path));
    }
    urge('—————————————————————————————————————————————————————————————');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_strict_owner_with_proxy = function() {
    var GUY, X, t;
    GUY = require(H.guy_path);
    X = class X extends GUY.props.Strict_owner {
      constructor() {
        super();
        // return new Proxy @,
        //   get:      ( t, k ) => debug GUY.trm.reverse GUY.trm.steel '^323^', rpr k; t[ k ]
        //   ownKeys:  ( t ) => debug '^323^', 'ownKeys()'; Reflect.ownKeys t
        //   getOwnPropertyDescriptor: ( t, k ) => debug '^323^', 'getOwnPropertyDescriptor()'; { configurable: true, enumerable: true, }
        return void 0;
      }

    };
    t = new X();
    console.log('^323423^', t.toString());
    console.log('^323423^', t);
    console.log('^323423^', rpr(t));
    info((require('util')).inspect(t, {
      depth: 0
    }));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_resolve_property_chain = function(T, done) {
    var GUY, owner, property_chain;
    GUY = require('../../../apps/guy');
    //.........................................................................................................
    owner = {
      first: {
        second: {
          other: {
            last: 42
          }
        }
      }
    };
    property_chain = ['first', 'second', 'other', 'last'];
    if (T != null) {
      T.eq(GUY.props.resolve_property_chain(owner, property_chain), 42);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_props_assign_with_defaults = function(T, done) {
    var GUY;
    GUY = require('../../../apps/guy');
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.nonull_assign({
        dotall: true
      }, {
        dotall: null
      }, {
        dotall: void 0
      }), {
        dotall: true
      });
    }
    if (T != null) {
      T.eq(GUY.props.nonull_assign({
        dotall: true
      }, {
        dotall: null
      }, {
        dotall: false
      }), {
        dotall: false
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_seal_freeze = function() {
    var GUY;
    GUY = require('../../../apps/guy');
    (() => {
      var d, dso, error;
      d = {
        x: 42
      };
      // dso = new GUY.props.Strict_owner { target: d, seal: true, freeze: true, }
      // dso = new GUY.props.Strict_owner { target: d, seal: true, freeze: false, }
      dso = new GUY.props.Strict_owner({
        target: d,
        seal: false,
        freeze: true
      });
      dso.x;
      try {
        dso.y;
      } catch (error1) {
        error = error1;
        warn('^424-1^', GUY.trm.reverse(error.message));
      }
      try {
        dso.x = 48;
      } catch (error1) {
        error = error1;
        warn('^424-2^', GUY.trm.reverse(error.message));
      }
      try {
        return dso.y = 'something';
      } catch (error1) {
        error = error1;
        return warn('^424-3^', GUY.trm.reverse(error.message));
      }
    })();
    (() => {
      var d, dso;
      d = {
        x: 42
      };
      dso = new GUY.props.Strict_owner({
        target: d,
        oneshot: true
      });
      dso.xy = new GUY.props.Strict_owner({
        target: {
          foo: 'bar'
        },
        freeze: true
      });
      // dso.x     = 123     # Strict_owner instance already has property 'x'
      // dso.xy    = {}      # Strict_owner instance already has property 'xy'
      // dso.xy.foo  = 'gnu' # TypeError: Cannot assign to read only property 'foo'
      debug('^35345^', dso); // { x: 42, xy: { foo: 'bar' } }
      debug('^35345^', d); // { x: 42, xy: { foo: 'bar' } }
      d.x = 123;
      debug('^35345^', dso); // { x: 123, xy: { foo: 'bar' } }
      return debug('^35345^', d); // { x: 123, xy: { foo: 'bar' } }
    })();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // demo_tree()
      // demo_tree_readme()
      // @[ "guy.props.crossmerge()" ]()
      // test @[ "guy.props.crossmerge()" ]
      // test @[ "GUY.props.keys() works for all JS values, including null and undefined" ]
      // demo_keys()
      // @[ "GUY.props.keys()" ]()
      // test @[ "GUY.props.keys()" ]
      // test @GUY_props_assign_with_defaults
      // @[ "GUY.props.Strict_owner 1" ]()
      // test @[ "GUY.props.Strict_owner 1" ]
      // @[ "GUY.props.has()" ]()
      // test @[ "GUY.props.has()" ]
      // @GUY_props_get()
      // test @GUY_props_get
      // @GUY_props_xray()
      // test @GUY_props_xray
      // @GUY_props_locking()
      // test @GUY_props_locking
      // @[ "GUY.props.Strict_owner 2" ]()
      // test @[ "GUY.props.Strict_owner 2" ]
      // test @[ "GUY.props.Strict_owner can use explicit target" ]
      // @[ "GUY.props.Strict_owner can use Reflect.has" ]()
      // test @[ "GUY.props.Strict_owner can use Reflect.has" ]
      // test @[ "GUY.props.Strict_owner can disallow redefining keys" ]
      // @[ "GUY.props.Strict_owner can disallow reassining keys" ]()
      // test @[ "GUY.props.Strict_owner can disallow reassining keys" ]
      // demo_strict_owner_with_proxy()
      // demo_seal_freeze()
      // @GUY_props_keys_depth_first()
      // test @GUY_props_keys_depth_first
      // @GUY_props_get_prototype_chain()
      return test(this.GUY_props_get_prototype_chain);
    })();
  }

}).call(this);

//# sourceMappingURL=props.tests.js.map