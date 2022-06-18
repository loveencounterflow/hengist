(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  types = new (require('../../../apps/intertype')).Intertype();

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
    //.........................................................................................................
    if (T != null) {
      T.eq(x.has.prop_on_instance_1, true);
    }
    if (T != null) {
      T.eq(x.has.prop_on_instance_2, true);
    }
    if (T != null) {
      T.eq(x.has.prop_on_instance_3, true);
    }
    if (T != null) {
      T.eq(x.has.foobar, false);
    }
    if (T != null) {
      T.eq(x.has[Symbol.toStringTag], true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(x.has('prop_on_instance_1'), true);
    }
    if (T != null) {
      T.eq(x.has('prop_on_instance_2'), true);
    }
    if (T != null) {
      T.eq(x.has('prop_on_instance_3'), true);
    }
    if (T != null) {
      T.eq(x.has('foobar'), false);
    }
    if (T != null) {
      T.eq(x.has(Symbol.toStringTag), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(x.has), 'object');
    }
    if (T != null) {
      T.eq(type_of(x.get), 'function');
    }
    urge('^067-1^', x);
    urge('^067-2^', (CAT.all_keys_of(x)).sort().join('\n'));
    urge('^067-3^', x.has);
    urge('^067-4^', x.has('foo'));
    urge('^067-5^', x.has('prop_on_instance_1'));
    urge('^067-6^', x.has.foo);
    urge('^067-7^', x.get);
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
    var CAT, GUY, X, x;
    GUY = require(H.guy_path);
    CAT = require('../../../apps/multimix/lib/cataloguing');
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "GUY.props.Strict_owner 1" ]()
      // test @[ "GUY.props.Strict_owner 1" ]
      this["GUY.props.Strict_owner 2"]();
      return test(this["GUY.props.Strict_owner 2"]);
    })();
  }

}).call(this);

//# sourceMappingURL=props.tests.js.map