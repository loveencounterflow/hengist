(function() {
  'use strict';
  var DATOM, GUY, H, P_1, P_12, P_12_x, P_2, Pipeline, Pipeline_module, alert, debug, demo_1, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/STOP-MARKERS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  // test                      = require '../../../apps/guy-test'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  ({Pipeline} = require('../../../apps/moonriver'));

  /*

   * Modular Pipeline

  * derive pipeline module class from class `Pipeline_module`
  * base class looks for methods on instance (prototype) whose names start with a dollar sign `$`
  * each of these will be called, added to pipeline
  * constructor returns new instance of a MoonRiver `Pipeline` containing the results of calling each `$`
    method
  * ordering is preserved
  * modules may in turn be combined

   */
  //===========================================================================================================
  Pipeline_module = class Pipeline_module {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      var R, i, j, k, len, len1, ref, value, x;
      GUY.props.hide(this, 'types', types);
      R = new Pipeline();
      ref = GUY.props.keys(this, {
        hidden: true
      });
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        if (!/^\$/.test(k)) {
          continue;
        }
        value = this[k];
        if (this.types.isa.function(value)) {
          R.push(value.call(this));
        // else if value instanceof @constructor
        } else if (this.types.isa.list(value)) {
          for (j = 0, len1 = value.length; j < len1; j++) {
            x = value[j];
            R.push(x);
          }
        } else {
          throw new Error(`^Pipeline_module@1^ unable to ingest ${rpr(value)}`);
        }
      }
      return R;
    }

  };

  //===========================================================================================================
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

  //===========================================================================================================
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

  //===========================================================================================================
  P_12 = class P_12 extends Pipeline_module {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      super();
      // R = new Pipeline()
      this.push(new P_1());
      this.push(new P_2());
      return void 0;
    }

  };

  P_12_x = (function() {
    //===========================================================================================================
    class P_12_x extends Pipeline_module {};

    P_12_x.prototype.$ = [new P_1(), new P_2()];

    return P_12_x;

  }).call(this);

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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo_1();
    })();
  }

}).call(this);

//# sourceMappingURL=experiment-modular-parser-pipeline.js.map