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
  * can return list with
    * functions that when called return a transform; these transforms must have a name that starts with a
      dollar sign `$`
    * functions (whose name must not start with a dollar sign `$`)
    * instances of `Pipeline`
    * instances of (derivatives of) `Pipeline_module`
    * classes derivatived from `Pipeline_module` (will be instantiated)

   */
  //===========================================================================================================
  Pipeline_module = class Pipeline_module {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      GUY.props.hide(this, 'types', types);
      return this._build();
    }

    //---------------------------------------------------------------------------------------------------------
    _build(value = null) {
      var R, d, i, k, len, ref, ref1;
      R = new Pipeline();
      ref = GUY.props.keys(this, {
        hidden: true
      });
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        if (!/^\$/.test(k)) {
          continue;
        }
        ref1 = this._walk_values(this[k]);
        for (d of ref1) {
          R.push(d);
        }
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    * _walk_values(value) {
      var d, e, i, len, ref;
      if (this.types.isa.class(value)) {
        value = new value();
      }
      //.......................................................................................................
      if (this.types.isa.function(value)) {
        if (!value.name.startsWith('$')) {
          return (yield value);
        }
        return (yield value.call(this));
      }
      //.......................................................................................................
      if (this.types.isa.list(value)) {
        for (i = 0, len = value.length; i < len; i++) {
          e = value[i];
          ref = this._walk_values(e);
          for (d of ref) {
            yield d;
          }
        }
        return null;
      }
      //.......................................................................................................
      if (value instanceof Pipeline) {
        return (yield value);
      }
      //.......................................................................................................
      throw new Error(`^Pipeline_module@1^ unable to ingest ${rpr(value)}`);
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
    var $indirect_fn, direct_fn;

    //===========================================================================================================
    class P_12_x extends Pipeline_module {};

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