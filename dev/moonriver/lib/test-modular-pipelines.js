(function() {
  'use strict';
  var GUY, alert, debug, demo_1, echo, equals, get_modular_pipeline_classes, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/MODULES'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  // test                      = require '../../../apps/guy-test'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  // H                         = require './helpers'
  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  // { DATOM }                 = require '../../../apps/datom'
  // { new_datom
  //   lets
  //   stamp     }             = DATOM
  /*

   * Modular Pipeline

  * derive pipeline module class from class `Pipeline_module`
  * base class looks for methods on instance (prototype) whose names start with a dollar sign `$`
  * each of these will be called, added to pipeline
  * constructor returns new instance of a MoonRiver `Pipeline` containing the results of calling each `$`
    method
  * ordering is preserved
  * modules may in turn be combined
  * can return list with
    * functions that when called return a transform; these transforms must have a name that starts with a
      dollar sign `$`
    * functions (whose name must not start with a dollar sign `$`)
    * instances of `Pipeline`
    * instances of (derivatives of) `Pipeline_module`
    * classes derivatived from `Pipeline_module` (will be instantiated)

   */
  //-----------------------------------------------------------------------------------------------------------
  get_modular_pipeline_classes = function() {
    var P_1, P_12, P_12_x, P_2, Pipeline, Pipeline_module;
    ({Pipeline, Pipeline_module} = require('../../../apps/moonriver'));
    //=========================================================================================================
    P_1 = class P_1 extends Pipeline_module {
      $p_1_1() {
        var p_1_1;
        return p_1_1 = function(d) {
          return help('$p_1_1');
        };
      }

      $p_1_2() {
        var p_1_2;
        return p_1_2 = function(d) {
          return help('$p_1_2');
        };
      }

      $p_1_3() {
        var p_1_3;
        return p_1_3 = function(d) {
          return help('$p_1_3');
        };
      }

    };
    //=========================================================================================================
    P_2 = class P_2 extends Pipeline_module {
      $p_2_1() {
        var p_2_1;
        return p_2_1 = function(d) {
          return help('$p_2_1');
        };
      }

      $p_2_2() {
        var p_2_2;
        return p_2_2 = function(d) {
          return help('$p_2_2');
        };
      }

      $p_2_3() {
        var p_2_3;
        return p_2_3 = function(d) {
          return help('$p_2_3');
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
        direct_fn = function(d) {
          return help('direct_fn');
        },
        $indirect_fn = function() {
          return function(d) {
            return help('$indirect_fn');
          };
        },
        new P_1(),
        P_2
      ];

      return P_12_x;

    }).call(this);
    //=========================================================================================================
    return {P_1, P_2, P_12, P_12_x};
  };

  //===========================================================================================================
  demo_1 = function() {
    var p;
    // whisper '^21^', '——————'
    // p = new Pipeline_module()
    whisper('^21^', '——————');
    p = new P_12();
    debug('^21^', p);
    p.send('x');
    p.run();
    whisper('^21^', '——————');
    p = new P_12_x();
    debug('^21^', p);
    p.send('x');
    p.run();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pipeline_modules_1 = function(T, done) {
    var P_1, P_12, P_12_x, P_2, Pipeline;
    ({Pipeline} = require('../../../apps/moonriver'));
    ({P_1, P_2, P_12, P_12_x} = get_modular_pipeline_classes());
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return pipeline_modules_1();
    })();
  }

}).call(this);

//# sourceMappingURL=test-modular-pipelines.js.map