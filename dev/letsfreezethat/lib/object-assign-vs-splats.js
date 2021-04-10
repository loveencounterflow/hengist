(function() {
  'use strict';
  var BM, CND, DATA, FS, IMMER, LFT, PATH, alert, badge, data_cache, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'LFT';

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
  PATH = require('path');

  FS = require('fs');

  DATA = require('../../../lib/data-providers');

  test = require('guy-test');

  LFT = require('../../../apps/letsfreezethat');

  IMMER = require('immer');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(n) {
    var probes_A, probes_B;
    if (data_cache != null) {
      return data_cache;
    }
    probes_A = DATA.get_random_words(n, null, true);
    probes_B = DATA.get_random_words(n, null, true);
    while (probes_A.length < probes_B.length) {
      probes_A.push('XXX');
    }
    while (probes_B.length < probes_A.length) {
      probes_B.push('XXX');
    }
    data_cache = {probes_A, probes_B};
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_object_assign_single = function(n, show) {
    return new Promise((resolve) => {
      var count, probe, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      probe = {};
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, word_A;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            word_A = probes_A[idx];
            probe = Object.assign({}, probe, {
              [word_A]: probes_B[idx]
            });
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_splats_single = function(n, show) {
    return new Promise((resolve) => {
      var count, probe, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      probe = null;
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, word_A;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            word_A = probes_A[idx];
            probe = {...probe, ...{
                [word_A]: probes_B[idx]
              }};
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_object_assign_single_let = function(n, show) {
    return new Promise((resolve) => {
      var count, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      let probe = {};;
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, word_A;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            word_A = probes_A[idx];
            probe = Object.assign( {}, probe, { [word_A]: probes_B[ idx ], } );;
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_splats_single_let = function(n, show) {
    return new Promise((resolve) => {
      var count, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      let probe = null;;
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, word_A;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            word_A = probes_A[idx];
            probe = { ...probe, ...{ [word_A]: probes_B[ idx ], }, };;
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_object_assign_bulk = function(n, show) {
    return new Promise((resolve) => {
      var count, data, i, idx, len, probe, probes_A, probes_B, w;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      probe = {};
      data = {};
      for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
        w = probes_A[idx];
        data[w] = probes_B[idx];
      }
      resolve(() => {
        return new Promise((resolve) => {
          probe = Object.assign({}, probe, data);
          count += probes_A.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_splats_bulk = function(n, show) {
    return new Promise((resolve) => {
      var count, data, i, idx, len, probe, probes_A, probes_B, w;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      probe = {};
      data = {};
      for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
        w = probes_A[idx];
        data[w] = probes_B[idx];
      }
      resolve(() => {
        return new Promise((resolve) => {
          probe = {...probe, ...data};
          count += probes_A.length;
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, i, j, len, n, ref, ref1, repetitions, show, test_name, test_names;
    bench = BM.new_benchmarks();
    n = 1000;
    // n           = 10
    show = false;
    repetitions = 3;
    test_names = ['using_splats_bulk', 'using_object_assign_bulk', 'using_splats_single', 'using_object_assign_single', 'using_splats_single_let', 'using_object_assign_single_let'];
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
        await BM.benchmark(bench, n, show, this, test_name);
      }
    }
    return BM.show_totals(bench);
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await this.run_benchmarks());
    })();
  }

  /*

 * Verdict

* Using splats (as in `d = { d..., e..., }`) is sometimes up to 10% faster, sometimes up to 10% slower than
  doing the same using `Object.assign {}, d, e`, so we can always use either and discard the other, except
  that `Object.assign()` has the added functionality of mutating an object value which splats syntax can't
  do.

* Using a loop to assign new properties one by one is 500 to 3000 times slower than doing the same in one
  fell swoop, so it would seem advisable to always update as many properties in a single go as feasible.

* V8 does not appear to be able to leverage functional considerations and behaves as if side effects could
  always appear when doing object attribute assignments, even though the values used in tests are never used
  again except for in a small loop. In other words, although the workings and the value changes within the
  loops as well as the upated bindings are not observable (without a debugger) at all, V8 still performs all
  the chores. A sufficiently smart functional language could conceivably just set `count = probes_A.length`
  and be done in both the bulk assignment and single assignment setups.

* Since we're doing these benchmarks to optimize for immutable value handling we cannot use `const` (except
  when opting for using new names on each assignment as in `const d1 = 42; const d2 = d1 + 1` which would be
  horribly tedious). Using `let` declarations over the `var` declarations used by CoffeeScript does seem to
  afford a teeeny improvement in throughput which is hardly worth the effort of putting JS syntax islands
  into one's code (ie. other considerations might favor `let` usage, but performance is not one of them).

 */

}).call(this);

//# sourceMappingURL=object-assign-vs-splats.js.map