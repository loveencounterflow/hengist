(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, log, njs_path, praise, rpr, test, urge, warn, whisper,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'MULTIMIX/TESTS/BASICS';

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

  // #===========================================================================================================
  // # OBJECT PROPERTY CATALOGUING
  // #-----------------------------------------------------------------------------------------------------------
  // provide_cataloguing = ->
  //   @keys_of              = ( P... ) -> @values_of @walk_keys_of      P...
  //   @all_keys_of          = ( P... ) -> @values_of @walk_all_keys_of  P...
  //   @all_own_keys_of      = ( x    ) -> if x? then Object.getOwnPropertyNames x else []
  //   @walk_all_own_keys_of = ( x    ) -> yield k for k in @all_own_keys_of x

  //   #-----------------------------------------------------------------------------------------------------------
  //   @walk_keys_of = ( x, settings ) ->
  //     defaults = { skip_undefined: true, }
  //     settings = if settings? then ( assign {}, settings, defaults ) else defaults
  //     for k of x
  //       ### TAINT should use property descriptors to avoid possible side effects ###
  //       continue if ( x[ k ] is undefined ) and settings.skip_undefined
  //       yield k

  //   #-----------------------------------------------------------------------------------------------------------
  //   @walk_all_keys_of = ( x, settings ) ->
  //     defaults = { skip_object: true, skip_undefined: true, }
  //     settings = { defaults..., settings..., }
  //     return @_walk_all_keys_of x, new Set(), settings

  //   #-----------------------------------------------------------------------------------------------------------
  //   @_walk_all_keys_of = ( x, seen, settings ) ->
  //     if ( not settings.skip_object ) and x is Object::
  //       yield return
  //     #.........................................................................................................
  //     for k from @walk_all_own_keys_of x
  //       continue if seen.has k
  //       seen.add k
  //       ### TAINT should use property descriptors to avoid possible side effects ###
  //       ### TAINT trying to access `arguments` causes error ###
  //       try value = x[ k ] catch error then continue
  //       continue if ( value is undefined ) and settings.skip_undefined
  //       if settings.symbol?
  //         continue unless value?
  //         continue unless value[ settings.symbol ]
  //       yield [ x, k, ]
  //     #.........................................................................................................
  //     if ( proto = Object.getPrototypeOf x )?
  //       yield from @_walk_all_keys_of proto, seen, settings
  // provide_cataloguing.apply C = {}

  //-----------------------------------------------------------------------------------------------------------
  this["classes with MultiMix"] = function(T, done) {
    var A, B, Multimix, a, b;
    Multimix = require('../../../../apps/multimix');
    //.........................................................................................................
    A = class A {
      method1(x) {
        return x + 2;
      }

      method2(x) {
        return (this.method1(x)) * 2;
      }

    };
    a = new A();
    T.eq(a.method1(100), 102);
    T.eq(a.method2(100), 204);
    //.........................................................................................................
    B = class B extends Multimix {
      method1(x) {
        return x + 2;
      }

      method2(x) {
        return (this.method1(x)) * 2;
      }

    };
    b = new B();
    T.eq(b.method1(100), 102);
    T.eq(b.method2(100), 204);
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["multimix.export()"] = function(T, done) {
    var A, B, Multimix, a, b, identify_1, identify_2;
    Multimix = require('../../../../apps/multimix');
    //.........................................................................................................
    A = class A extends Multimix {
      constructor() {
        super();
        this.name = 'class A';
      }

      identify_1() {
        return this.name;
      }

    };
    //.........................................................................................................
    B = class B extends A {
      constructor() {
        super();
        this.name = 'class B';
      }

      identify_2() {
        return this.name;
      }

    };
    //.........................................................................................................
    a = new A();
    b = new B();
    //.........................................................................................................
    ({identify_1, identify_2} = a.export());
    T.eq(identify_1(), 'class A');
    T.eq(identify_2, void 0);
    //.........................................................................................................
    ({identify_1, identify_2} = b.export());
    T.eq(identify_1(), 'class B');
    T.eq(identify_2(), 'class B');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["multimix.new()"] = function(T, done) {
    var A, Multimix, a, b;
    Multimix = require('../../../../apps/multimix');
    A = (function() {
      //.........................................................................................................
      class A extends Multimix {
        constructor(settings) {
          super();
          this.settings = {...this.defaults, ...settings};
          return this;
        }

      };

      A.prototype.defaults = {
        drab: 'anything'
      };

      A.prototype.foobar = 42;

      return A;

    }).call(this);
    //.........................................................................................................
    a = new A({
      drab: 'something'
    });
    T.eq(a.foobar, 42);
    T.eq(a.settings.drab, 'something');
    //.........................................................................................................
    b = a.new({
      drab: 'nothing'
    });
    T.eq(b.foobar, 42);
    T.eq(b.settings.drab, 'nothing');
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["bound methods"] = function(T, done) {
    var A, B, C, D, Multimix, a, b, c, d, error, fatarrow, frob, k, slimarrow;
    Multimix = require('../../../../apps/multimix');
    A = (function() {
      //.........................................................................................................
      class A extends Multimix {
        constructor(settings) {
          var k;
          super();
          debug('^3344^', 'A', (function() {
            var results;
            results = [];
            for (k in this) {
              results.push(k);
            }
            return results;
          }).call(this));
        }

        frob() {
          return echo(`frob: @myprop: ${this.myprop}`);
        }

      };

      A.prototype.myprop = "a property";

      return A;

    }).call(this);
    B = (function() {
      //.........................................................................................................
      class B extends A {
        constructor(settings) {
          var k;
          super();
          this.settings = {...this.defaults, ...settings};
          debug('^3344^', 'B', (function() {
            var results;
            results = [];
            for (k in this) {
              results.push(k);
            }
            return results;
          }).call(this));
          debug('^3344^', 'B', (function() {
            var results;
            results = [];
            for (k in this.prototype) {
              results.push(k);
            }
            return results;
          }).call(this));
          this.export(this);
/* <-- should we always bind all methods? */          return this;
        }

      };

      B.prototype.defaults = {
        drab: 'anything'
      };

      B.prototype.foobar = 42;

      return B;

    }).call(this);
    C = (function() {
      //.........................................................................................................
      class C extends Multimix {
        constructor() {
          super(...arguments);
          this.fatarrow = this.fatarrow.bind(this);
        }

        fatarrow() {
          boundMethodCheck(this, C);
          return echo(`@myproperty: ${this.myproperty}`);
        }

        slimarrow() {
          return echo(`@myproperty: ${this.myproperty}`);
        }

      };

      C.prototype.myproperty = "-=(#)=-";

      return C;

    }).call(this);
    D = class D extends C {};
    //.........................................................................................................
    a = new A();
    b = new B();
    urge('^458^', (function() {
      var results;
      results = [];
      for (k in b) {
        results.push(k);
      }
      return results;
    })());
    b.frob();
    ({frob} = b);
    frob();
    c = new C();
    ({fatarrow, slimarrow} = c);
    fatarrow();
    try {
      slimarrow();
    } catch (error1) {
      error = error1;
      warn(error.message);
    }
    d = new D();
    urge('^3536^', c.fatarrow === d.fatarrow);
    urge('^3536^', c.slimarrow === d.slimarrow);
    //.........................................................................................................
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "multimix.new()" ]
// test @[ "bound methods" ]

}).call(this);

//# sourceMappingURL=basics.test.js.map