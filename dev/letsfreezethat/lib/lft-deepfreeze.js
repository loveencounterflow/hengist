(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

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

  DATA = require('../../../lib/data-providers-nocache');

  test = require('guy-test');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg) {
    if (data_cache != null) {
      return data_cache;
    }
    debug('^2233^');
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_letsfreezethat = function(cfg, sublibrary) {
    return new Promise((resolve) => {
      var LFT, count, data, lets;
      LFT = require('../../../apps/letsfreezethat');
      switch (sublibrary) {
        case 'standard':
          ({lets} = LFT);
          break;
        case 'nofreeze':
          ({lets} = LFT.nofreeze);
          break;
        default:
          throw new Error(`^bm/lft@223 unknown sublibrary ${rpr(sublibrary)}`);
      }
      // @types.validate.hengist_dataprv_cfg cfg
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, key_value_pairs, len, probe, ref;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = LFT.lets(Object.fromEntries(key_value_pairs));
            probe = LFT.lets(probe, function(probe) {
              var j, key, key_idx, len1, results;
              results = [];
              for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
                key = facet_keys[key_idx];
                results.push(probe[key] = facet_values[key_idx]);
              }
              return results;
            });
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    // n           = 100000
    cfg = {
      set_count: 100,
      datom_length: 5,
      change_facet_count: 3
    };
    // cfg         = { set_count: 3, datom_length: 2, change_facet_count: 1, }
    repetitions = 3;
    test_names = [];
    // for _ in [ 1 .. repetitions ]
    //   whisper '-'.repeat 108
    //   data_cache = null
    //   for test_name in CND.shuffle test_names
    //     await BM.benchmark bench, cfg, false, @, test_name
    data_cache = null;
    ref = CND.shuffle(test_names);
    for (i = 0, len = ref.length; i < len; i++) {
      test_name = ref[i];
      whisper('-'.repeat(108));
      for (_ = j = 1, ref1 = repetitions; (1 <= ref1 ? j <= ref1 : j >= ref1); _ = 1 <= ref1 ? ++j : --j) {
        await BM.benchmark(bench, cfg, false, this, test_name);
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

  // await @demo_letsfreezethat_new_api()
// await @demo_immutable()
// await @demo_hamt()
// await @demo_mori()
// require 'hamt'
/*

cfg: { set_count: 100, datom_length: 5, change_facet_count: 3, }
00:09 HENGIST/BENCHMARKS  ▶  using_plainjs_mutable                             31,481 Hz   100.0 % │████████████▌│
00:09 HENGIST/BENCHMARKS  ▶  using_ltfng_thaw_freeze_cnfn                      26,939 Hz    85.6 % │██████████▊  │
00:09 HENGIST/BENCHMARKS  ▶  using_ltfng_thaw_freeze_cyfn                      22,900 Hz    72.7 % │█████████▏   │
00:09 HENGIST/BENCHMARKS  ▶  using_plainjs_immutable                           20,245 Hz    64.3 % │████████     │
00:09 HENGIST/BENCHMARKS  ▶  using_ltfng_thaw_freeze_cyfy                      14,796 Hz    47.0 % │█████▉       │
00:09 HENGIST/BENCHMARKS  ▶  using_ltfng_assign_lets                           12,472 Hz    39.6 % │█████        │
00:09 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_nofreeze                      9,634 Hz    30.6 % │███▉         │
00:09 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_standard                      7,971 Hz    25.3 % │███▏         │
00:09 HENGIST/BENCHMARKS  ▶  using_immutable                                    5,045 Hz    16.0 % │██           │
00:09 HENGIST/BENCHMARKS  ▶  using_mori                                         4,939 Hz    15.7 % │██           │
00:09 HENGIST/BENCHMARKS  ▶  using_hamt                                         3,395 Hz    10.8 % │█▍           │

*/

}).call(this);

//# sourceMappingURL=lft-deepfreeze.js.map