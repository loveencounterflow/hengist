(function() {
  'use strict';
  var BM, CND, badge, construct_chained_mixins, debug, demo, echo, help, info, misfit, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEMPFILES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  misfit = Symbol('misfit');

  BM = require('../../../lib/benchmarks');

  //===========================================================================================================
  // DEMO
  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var A_mixin, B_mixin, Base, C_mixin, D_mixin, Main, d;
    /* thx to https://alligator.io/js/class-composition/ */
    //-----------------------------------------------------------------------------------------------------------
    Base = class Base {
      constructor() {
        var k, known_names;
        help('^343-1^', known_names = new Set((function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this)));
      }

    };
    //-----------------------------------------------------------------------------------------------------------
    A_mixin = class A_mixin extends Base {
      constructor() {
        super();
        // help '^343-1^', known_names = new Set ( k for k of @ )
        this.a_mixin = true;
        this.name = 'a_mixin';
      }

      introduce_yourself() {
        return urge(`helo from class ${this.name}`);
      }

      violate_stratification() {
        return 1 + this.method_from_downstream();
      }

    };
    //-----------------------------------------------------------------------------------------------------------
    B_mixin = class B_mixin extends A_mixin {
      constructor() {
        super();
        // help '^343-2^', known_names = new Set ( k for k of @ )
        this.b_mixin = true;
        this.name = 'b_mixin';
      }

      method_from_downstream() {
        return 42;
      }

    };
    //-----------------------------------------------------------------------------------------------------------
    C_mixin = class C_mixin extends B_mixin {
      constructor() {
        super();
        // help '^343-3^', known_names = new Set ( k for k of @ )
        this.c_mixin = true;
        this.name = 'c_mixin';
      }

    };
    //-----------------------------------------------------------------------------------------------------------
    D_mixin = class D_mixin extends C_mixin {
      constructor() {
        super();
        // help '^343-4^', known_names = new Set ( k for k of @ )
        this.d_mixin = true;
        this.name = 'd_mixin';
      }

    };
    //-----------------------------------------------------------------------------------------------------------
    // class Main extends D_mixin C_mixin B_mixin A_mixin Base ### unnecessary class `Base` ###
    // class Main extends D_mixin C_mixin B_mixin A_mixin Object ### the default ###
    // class Main extends D_mixin C_mixin B_mixin A_mixin null ### doesn't work ###
    Main = class Main extends D_mixin {
      constructor(x = misfit) {
        super();
        this.x = x;
        this.main = true;
        this.name = 'main';
      }

    };
    debug(d = new Main());
    d.introduce_yourself();
    return info(d.violate_stratification());
  };

  //===========================================================================================================
  // BENCHMARKS
  //-----------------------------------------------------------------------------------------------------------
  construct_chained_mixins = (cfg) => {};

  //-----------------------------------------------------------------------------------------------------------
  this.chained_mixins = function(cfg) {
    return new Promise((resolve) => {
      // { integer_lists, } = @get_data cfg
      //.........................................................................................................
      resolve(() => {
        return new Promise((resolve) => {
          var count;
          count = 1;
          // for integer_list in integer_lists
          //   x = CHARWISE.encode integer_list
          //   urge '^234-6^', x if cfg.show
          //   count++
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, data_cache, i, j, len, mode, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    mode = 'standard';
    mode = 'medium';
    mode = 'functional_test';
    switch (mode) {
      case 'standard':
        cfg = {
          list_count: 3e5,
          list_length_min: 1,
          list_length_max
        };
        repetitions = 5;
        break;
      case 'medium':
        cfg = {
          list_count: 5e4,
          list_length_min: 1,
          list_length_max
        };
        repetitions = 3;
        break;
      case 'functional_test':
        cfg = {
          depth: 3,
          functions_per_class: 3,
          fnr_min: 1,
          fnr_max: 10
        };
        repetitions = 1;
    }
    cfg.show = cfg.list_count < 10;
    test_names = ['chained_mixins'];
    if (global.gc != null) {
      global.gc();
    }
    data_cache = null;
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
        if (global.gc != null) {
          global.gc();
        }
        await BM.benchmark(bench, cfg, false, this, test_name);
      }
    }
    return BM.show_totals(bench);
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo()
      return this.run_benchmarks();
    })();
  }

}).call(this);

//# sourceMappingURL=multiply-composed-classes-with-chained-inheritance.js.map