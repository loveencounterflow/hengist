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
    var P_1, P_12, P_12_x, P_2, P_3, Pipeline, Pipeline_module;
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
    //=========================================================================================================
    P_12 = class P_12 extends Pipeline_module {
      //-------------------------------------------------------------------------------------------------------
      constructor() {
        super();
        // R = new Pipeline()
        this.push(new P_1());
        this.push(new P_2());
        return void 0;
      }

    };
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
        P_2
      ];

      return P_12_x;

    }).call(this);
    //=========================================================================================================
    P_3 = class P_3 extends Pipeline_module {
      foo(d, send) {
        d.push('foo');
        return send(d);
      }

      bar(d, send) {
        d.push('bar');
        return send(d);
      }

    };
    //=========================================================================================================
    return {P_1, P_2, P_12, P_12_x, P_3};
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pipeline_modules_1 = function(T, done) {
    var P_1, P_12, P_12_x, P_2, P_3, Pipeline;
    ({Pipeline} = require('../../../apps/moonriver'));
    ({P_1, P_2, P_12, P_12_x, P_3} = get_modular_pipeline_classes());
    (function() {      //.........................................................................................................
      var p;
      p = new P_1();
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['$p_1_1', '$p_1_2', '$p_1_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new P_2();
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['$p_2_1', '$p_2_2', '$p_2_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new P_12();
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new P_12_x();
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['direct_fn', '$indirect_fn', '$p_1_1', '$p_1_2', '$p_1_3', '$p_2_1', '$p_2_2', '$p_2_3']]);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p;
      p = new P_3();
      p.send([]);
      if (T != null) {
        T.eq(p.run(), [['foo', 'bar']]);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @pipeline_modules_1()
      return test(this.pipeline_modules_1);
    })();
  }

}).call(this);

//# sourceMappingURL=test-modular-pipelines.js.map