(function() {
  'use strict';
  var GUY, alert, debug, echo, equals, get_modular_pipeline_classes, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/MODULES'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  // H                         = require './helpers'
  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  // { DATOM }                 = require '../../../apps/datom'
  // { new_datom
  //   lets
  //   stamp     }             = DATOM

  //-----------------------------------------------------------------------------------------------------------
  get_modular_pipeline_classes = function() {
    var P_1, P_12, P_12_x, P_2, P_3, P_5, P_6, P_empty, Pipeline, Pipeline_module, p_4, p_4_1;
    ({Pipeline, Pipeline_module} = require('../../../apps/moonriver'));
    //=========================================================================================================
    P_1 = class P_1 extends Pipeline_module {
      $p_1_1() {
        var p_1_1;
        return p_1_1 = function(d, send) {
          help('$p_1_1');
          d.push('$p_1_1');
          return send(d);
        };
      }

      $p_1_2() {
        var p_1_2;
        return p_1_2 = function(d, send) {
          help('$p_1_2');
          d.push('$p_1_2');
          return send(d);
        };
      }

      $p_1_3() {
        var p_1_3;
        return p_1_3 = function(d, send) {
          help('$p_1_3');
          d.push('$p_1_3');
          return send(d);
        };
      }

    };
    //=========================================================================================================
    P_2 = class P_2 extends Pipeline_module {
      $p_2_1() {
        var p_2_1;
        return p_2_1 = function(d, send) {
          help('$p_2_1');
          d.push('$p_2_1');
          return send(d);
        };
      }

      $p_2_2() {
        var p_2_2;
        return p_2_2 = function(d, send) {
          help('$p_2_2');
          d.push('$p_2_2');
          return send(d);
        };
      }

      $p_2_3() {
        var p_2_3;
        return p_2_3 = function(d, send) {
          help('$p_2_3');
          d.push('$p_2_3');
          return send(d);
        };
      }

    };
    P_12 = (function() {
      //=========================================================================================================
      class P_12 extends Pipeline_module {};

      P_12.prototype.p_1 = new P_1();

      P_12.prototype.p_2 = new P_2();

      return P_12;

    }).call(this);
    //=========================================================================================================
    p_4 = new Pipeline();
    p_4.push(p_4_1 = function(d, send) {
      help('p_4_1');
      d.push('p_4_1');
      return send(d);
    });
    P_12_x = (function() {
      var $indirect_fn, direct_fn;

      //=========================================================================================================
      class P_12_x extends Pipeline_module {};

      //-------------------------------------------------------------------------------------------------------
      P_12_x.prototype.$ = [
        direct_fn = function(d,
        send) {
          help('direct_fn');
          d.push('direct_fn');
          return send(d);
        },
        $indirect_fn = function() {
          return function(d,
        send) {
            help('$indirect_fn');
            d.push('$indirect_fn');
            return send(d);
          };
        },
        new P_1(),
        P_2,
        p_4
      ];

      return P_12_x;

    }).call(this);
    P_3 = (function() {
      //=========================================================================================================
      class P_3 extends Pipeline_module {
        foo(d, send) {
          d.push('foo');
          return send(d);
        }

        bar(d, send) {
          d.push('bar');
          return send(d);
        }

      };

      P_3.prototype.baz = p_4_1;

      return P_3;

    }).call(this);
    //=========================================================================================================
    P_empty = class P_empty extends Pipeline_module {};
    P_5 = (function() {
      //=========================================================================================================
      class P_5 extends Pipeline_module {
        foo(d, send) {
          d.push('foo');
          return send(d);
        }

        bar(d, send) {
          d.push('bar');
          return send(d);
        }

      };

      P_5.prototype.empty = P_empty;

      P_5.prototype.baz = p_4_1;

      return P_5;

    }).call(this);
    //=========================================================================================================
    P_6 = class P_6 extends P_5 {
      last(d) {}

    };
    //=========================================================================================================
    return {P_1, P_2, P_12, P_12_x, P_3, P_empty, P_5, P_6};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_iterate_over_transforms = function(T, done) {
    var P_1, P_12, P_12_x, P_2, P_3, P_5, P_6, P_empty, Pipeline, Pipeline_module;
    ({Pipeline, Pipeline_module} = require('../../../apps/moonriver'));
    ({P_1, P_2, P_12, P_12_x, P_3, P_empty, P_5, P_6} = get_modular_pipeline_classes());
    (function() {      //.........................................................................................................
      var p, t;
      whisper('^46-1^', '————————————————————————————————————————');
      p = new P_empty();
      info('^46-1^', p);
      if (T != null) {
        T.ok(p instanceof Pipeline_module);
      }
      if (T != null) {
        T.eq(p._transforms, []);
      }
      if (T != null) {
        T.eq(p.length, 0);
      }
      if (T != null) {
        T.eq((function() {
          var ref, ref1, ref2, results;
          results = [];
          for (t of p) {
            results.push((ref = (ref1 = t.name) != null ? ref1 : (ref2 = t.constructor) != null ? ref2.name : void 0) != null ? ref : '???');
          }
          return results;
        })(), []);
      }
      p.length = 0;
      if (T != null) {
        T.eq(p.length, 0);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p, t;
      whisper('^46-1^', '————————————————————————————————————————');
      p = new P_1();
      info('^46-1^', p);
      if (T != null) {
        T.ok(p instanceof Pipeline_module);
      }
      if (T != null) {
        T.eq(p.length, 3);
      }
      if (T != null) {
        T.eq((function() {
          var ref, ref1, ref2, results;
          results = [];
          for (t of p) {
            results.push((ref = (ref1 = t.name) != null ? ref1 : (ref2 = t.constructor) != null ? ref2.name : void 0) != null ? ref : '???');
          }
          return results;
        })(), ['p_1_1', 'p_1_2', 'p_1_3']);
      }
      p.length = 0;
      if (T != null) {
        T.eq(p.length, 0);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p, t;
      whisper('^46-1^', '————————————————————————————————————————');
      p = new P_12_x();
      info('^46-1^', p);
      info('^46-1^', p._transforms);
      if (T != null) {
        T.ok(p instanceof Pipeline_module);
      }
      if (T != null) {
        T.eq(p.length, 5);
      }
      if (T != null) {
        T.eq((function() {
          var ref, ref1, ref2, results;
          results = [];
          for (t of p) {
            results.push((ref = (ref1 = t.name) != null ? ref1 : (ref2 = t.constructor) != null ? ref2.name : void 0) != null ? ref : '???');
          }
          return results;
        })(), ['direct_fn', '', 'P_1', 'P_2', 'Pipeline']);
      }
      p.length = 0;
      if (T != null) {
        T.eq(p.length, 0);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p, t;
      whisper('^46-1^', '————————————————————————————————————————');
      p = new P_5();
      info('^46-1^', p);
      info('^46-1^', p._transforms);
      if (T != null) {
        T.ok(p instanceof Pipeline_module);
      }
      if (T != null) {
        T.eq(p.length, 4);
      }
      if (T != null) {
        T.eq((function() {
          var ref, ref1, ref2, results;
          results = [];
          for (t of p) {
            results.push((ref = (ref1 = t.name) != null ? ref1 : (ref2 = t.constructor) != null ? ref2.name : void 0) != null ? ref : '???');
          }
          return results;
        })(), ['foo', 'bar', 'P_empty', 'p_4_1']);
      }
      p.length = 0;
      if (T != null) {
        T.eq(p.length, 0);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p, t;
      whisper('^46-1^', '————————————————————————————————————————');
      p = new P_6();
      info('^46-1^', p);
      info('^46-1^', p._transforms);
      if (T != null) {
        T.ok(p instanceof Pipeline_module);
      }
      if (T != null) {
        T.eq(p.length, 5);
      }
      if (T != null) {
        T.eq((function() {
          var ref, ref1, ref2, results;
          results = [];
          for (t of p) {
            results.push((ref = (ref1 = t.name) != null ? ref1 : (ref2 = t.constructor) != null ? ref2.name : void 0) != null ? ref : '???');
          }
          return results;
        })(), ['foo', 'bar', 'P_empty', 'p_4_1', 'last']);
      }
      p.length = 0;
      if (T != null) {
        T.eq(p.length, 0);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pipeline_modules_1 = function(T, done) {
    var P_1, P_12, P_12_x, P_2, P_3, P_5, P_empty, Pipeline;
    ({Pipeline} = require('../../../apps/moonriver'));
    ({P_1, P_2, P_12, P_12_x, P_3, P_empty, P_5} = get_modular_pipeline_classes());
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_1);
      p.send([]);
      urge('^234^', p);
      // urge '^234^', p.run()
      if (T != null) {
        T.eq(p.run(), [['$p_1_1', '$p_1_2', '$p_1_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_2);
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['$p_2_1', '$p_2_2', '$p_2_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_12);
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_12_x);
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['direct_fn', '$indirect_fn', '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3', 'p_4_1']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_5);
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['foo', 'bar', 'p_4_1']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new Pipeline();
      p.push(P_empty);
      p.send(1);
      p.send(2);
      p.send(3);
      if (T != null) {
        T.eq(p.run(), [1, 2, 3]);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pipeline_modules_methods_called_with_current_context = function(T, done) {
    var Pipeline, Pipeline_module, X, Y, result, y;
    ({Pipeline, Pipeline_module} = require('../../../apps/moonriver'));
    //.........................................................................................................
    X = class X extends Pipeline_module {
      constructor() {
        super();
        this.foo = 'class X';
        return void 0;
      }

      $unbound_method() {
        var unbound_method;
        return unbound_method = function(d, send) {
          // debug '^98-1^', @constructor.name
          return send(d ** 3);
        };
      }

    };
    //.........................................................................................................
    Y = class Y extends Pipeline {
      constructor() {
        super();
        this.foo = 'class Y';
        this.push(new X());
        return void 0;
      }

    };
    //.........................................................................................................
    y = new Y();
    y.send(12);
    y.send(34);
    result = y.run_and_stop();
    if (T != null) {
      T.eq(result, [1728, 39304]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @pipeline_modules_1()
      // @pipeline_modules_1()
      // test @pipeline_modules_1
      // @pipeline_modules_methods_called_with_current_context()
      // @can_iterate_over_transforms()
      return test(this);
    })();
  }

  // test @can_iterate_over_transforms
// test @pipeline_modules_methods_called_with_current_context

}).call(this);

//# sourceMappingURL=test-modular-pipelines.js.map