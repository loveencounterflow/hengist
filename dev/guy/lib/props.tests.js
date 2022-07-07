(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, demo_keys_1, demo_keys_2, echo, equals, freeze, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/PROPS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

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
        writable: false,
        enumerable: false,
        configurable: false
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
  this["GUY.props.get()"] = function(T, done) {
    var GUY, fallback, value;
    GUY = require(H.guy_path);
    fallback = Symbol('fallback');
    value = Symbol('value');
    if (T != null) {
      T.eq(GUY.props.get(void 0, 'xy', fallback), fallback);
    }
    if (T != null) {
      T.eq(GUY.props.get(null, 'xy', fallback), fallback);
    }
    if (T != null) {
      T.eq(GUY.props.get(42, 'xy', fallback), fallback);
    }
    if (T != null) {
      T.eq(GUY.props.get({}, 'xy', fallback), fallback);
    }
    if (T != null) {
      T.eq(GUY.props.get({
        xy: value
      }, 'xy'), value);
    }
    if (T != null) {
      T.throws(/no such property/, function() {
        return GUY.props.get(void 0, 'xy');
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.props.Strict_owner 1"] = function(T, done) {
    var CAT, GUY, X, error, x;
    GUY = require(H.guy_path);
    CAT = require('../../../apps/multimix/lib/cataloguing');
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
      warn(CND.reverse(error.message));
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
      warn(CND.reverse(error.message));
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
      warn(CND.reverse(error.message));
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
  demo_keys_1 = function() {
    var A, B, C, D, GUY, builtins, d, defaults, e, i, k, keyowner, len, n, owner, ref, ref1;
    GUY = require('../../../apps/guy');
    H = require('../../../apps/guy/lib/_helpers');
    builtins = require('../../../apps/guy/lib/_builtins');
    defaults = {
      symbols: true,
      builtins: true
    };
    //-----------------------------------------------------------------------------------------------------------
    this.walk_keys = function(owner, cfg) {
      cfg = {...defaults, ...cfg};
      return this._walk_keys(owner, cfg);
    };
    //-----------------------------------------------------------------------------------------------------------
    this._walk_keys = function*(owner, cfg) {
      var key, ref, seen, z;
      seen = new Set();
      ref = this._walk_keyowners(owner, cfg);
      for (z of ref) {
        ({key} = z);
        if (seen.has(key)) {
          continue;
        }
        seen.add(key);
        yield key;
      }
      return null;
    };
    //-----------------------------------------------------------------------------------------------------------
    this._walk_keyowners = function*(owner, cfg) {
      var i, key, len, proto_owner, ref;
      if ((!cfg.builtins) && builtins.has(owner)) {
        // urge '^3354^', owner
        return null;
      }
      ref = Reflect.ownKeys(owner);
      for (i = 0, len = ref.length; i < len; i++) {
        key = ref[i];
        if (H.types.isa.symbol(key)) {
          if (cfg.symbols) {
            yield ({key, owner});
          }
        } else {
          yield ({key, owner});
        }
      }
      //.........................................................................................................
      if ((proto_owner = Object.getPrototypeOf(owner)) != null) {
        yield* this._walk_keyowners(proto_owner, cfg);
      }
      return null;
    };
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
          this.something = 'something';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d = true;

      return D;

    }).call(this);
    // d = { y: 42, z: { a: 1, b: 2, }, ξ: { [1], [2], [3], }, [Symbol.for 'x'], }
    d = new D();
    d[Symbol.for('x')] = 'x';
    GUY.props.hide(d, 'hidden', 'hidden');
    debug('^333^', Reflect.ownKeys(d));
    n = Object.create(null);
    e = new SyntaxError(null);
    ref = [e, D, d, n];
    for (i = 0, len = ref.length; i < len; i++) {
      owner = ref[i];
      whisper('————————————————————————————————————————————————————————————');
      whisper(owner);
      ref1 = this._walk_keyowners(owner, {
        symbols: true,
        builtins: true
      });
      for (keyowner of ref1) {
        // info '^442^', keyowner, ( Object.getOwnPropertyDescriptor keyowner.owner, keyowner.key ).value
        // info '^442^', keyowner, keyowner.owner is Object
        // info '^442^', keyowner, keyowner.owner is Object::
        // info '^442^', keyowner, keyowner.owner is Function::
        info('^442^', keyowner, builtins.has(keyowner.owner));
      }
    }
    debug('^4453^', Object.keys(d));
    debug('^4453^', (function() {
      var results;
      results = [];
      for (k in d) {
        results.push(k);
      }
      return results;
    })());
    debug('^4453^', (function() {
      var ref2, results;
      ref2 = this.walk_keys(d, {
        builtins: true
      });
      results = [];
      for (k of ref2) {
        results.push(k);
      }
      return results;
    }).call(this));
    debug('^4453^', (function() {
      var ref2, results;
      ref2 = this.walk_keys(d, {
        builtins: false
      });
      results = [];
      for (k of ref2) {
        results.push(k);
      }
      return results;
    }).call(this));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_keys_2 = function() {
    var A, B, C, D, GUY, d, e, i, k, keyowner, len, n, owner, ref, ref1;
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
          this.something = 'something';
          return void 0;
        }

        instance_method_on_d() {}

        static class_method_on_D() {}

      };

      D.prototype.is_d = true;

      return D;

    }).call(this);
    //.........................................................................................................
    // d = { y: 42, z: { a: 1, b: 2, }, ξ: { [1], [2], [3], }, [Symbol.for 'x'], }
    d = new D();
    d[Symbol.for('x')] = 'x';
    GUY.props.hide(d, 'hidden', 'hidden');
    n = Object.create(null);
    e = new SyntaxError(null);
    ref = [e, D, d, n];
    for (i = 0, len = ref.length; i < len; i++) {
      owner = ref[i];
      whisper('————————————————————————————————————————————————————————————');
      whisper(owner);
      ref1 = GUY.props._walk_keyowners(owner, {
        symbols: true,
        builtins: true
      });
      for (keyowner of ref1) {
        info('^442^', keyowner);
      }
    }
    debug('^4453^', Object.keys(d));
    debug('^4453^', (function() {
      var results;
      results = [];
      for (k in d) {
        results.push(k);
      }
      return results;
    })());
    debug('^4453^', (function() {
      var ref2, results;
      ref2 = GUY.props.walk_keys(d, {
        builtins: true
      });
      results = [];
      for (k of ref2) {
        results.push(k);
      }
      return results;
    })());
    debug('^4453^', (function() {
      var ref2, results;
      ref2 = GUY.props.walk_keys(d, {
        builtins: false
      });
      results = [];
      for (k of ref2) {
        results.push(k);
      }
      return results;
    })());
    debug('^4453^', (function() {
      var ref2, results;
      ref2 = GUY.props.walk_keys(d, {
        symbols: false,
        builtins: false
      });
      results = [];
      for (k of ref2) {
        results.push(k);
      }
      return results;
    })());
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return demo_keys_2();
    })();
  }

  // @[ "GUY.props.Strict_owner 1" ]()
// test @[ "GUY.props.Strict_owner 1" ]
// @[ "GUY.props.has()" ]()
// test @[ "GUY.props.has()" ]
// @[ "GUY.props.get()" ]()
// test @[ "GUY.props.get()" ]
// @[ "GUY.props.Strict_owner 2" ]()
// test @[ "GUY.props.Strict_owner 2" ]
// test @[ "GUY.props.Strict_owner can use explicit target" ]
// @[ "GUY.props.Strict_owner can use Reflect.has" ]()
// test @[ "GUY.props.Strict_owner can use Reflect.has" ]

}).call(this);

//# sourceMappingURL=props.tests.js.map