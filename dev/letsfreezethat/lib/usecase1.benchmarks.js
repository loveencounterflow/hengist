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
    var _, i, idx, j, k, key, key_idx, keys, l, len, len1, len2, lists_of_facet_keys, lists_of_facet_values, lists_of_key_value_pairs, lists_of_keys, lists_of_values, ref, set_idx, values;
    if (data_cache != null) {
      return data_cache;
    }
    // @types.validate.hengist_dataprv_cfg cfg
    //.........................................................................................................
    lists_of_values = [];
    for (_ = i = 1, ref = cfg.set_count; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      lists_of_values.push(DATA.get_values(cfg.datom_length));
    }
    //.........................................................................................................
    lists_of_keys = (function() {
      var j, ref1, results;
      results = [];
      for (idx = j = 1, ref1 = cfg.set_count; (1 <= ref1 ? j <= ref1 : j >= ref1); idx = 1 <= ref1 ? ++j : --j) {
        results.push(DATA.get_words(cfg.datom_length));
      }
      return results;
    })();
    //.........................................................................................................
    lists_of_key_value_pairs = [];
    for (set_idx = j = 0, len = lists_of_keys.length; j < len; set_idx = ++j) {
      keys = lists_of_keys[set_idx];
      values = lists_of_values[set_idx];
      lists_of_key_value_pairs.push((function() {
        var k, len1, results;
        results = [];
        for (key_idx = k = 0, len1 = keys.length; k < len1; key_idx = ++k) {
          key = keys[key_idx];
          results.push([key, values[key_idx]]);
        }
        return results;
      })());
    }
    //.........................................................................................................
    lists_of_facet_keys = [];
    for (k = 0, len1 = lists_of_keys.length; k < len1; k++) {
      keys = lists_of_keys[k];
      lists_of_facet_keys.push((function() {
        var l, len2, ref1, results;
        ref1 = DATA.get_integers(cfg.change_facet_count, 0, cfg.datom_length - 1);
        results = [];
        for (l = 0, len2 = ref1.length; l < len2; l++) {
          idx = ref1[l];
          results.push(keys[idx]);
        }
        return results;
      })());
    }
    //.........................................................................................................
    lists_of_facet_values = [];
    for (l = 0, len2 = lists_of_keys.length; l < len2; l++) {
      keys = lists_of_keys[l];
      lists_of_facet_values.push(DATA.get_values(cfg.change_facet_count));
    }
    // #.........................................................................................................
    // debug '^337^', v for v in lists_of_values
    // urge '^776^', k for k in lists_of_keys
    // help '^776^', k, lists_of_keys[ idx ] for k, idx in lists_of_facet_keys
    // info '^776^', v for v in lists_of_facet_values
    //.........................................................................................................
    data_cache = {lists_of_keys, lists_of_values, lists_of_facet_keys, lists_of_facet_values, lists_of_key_value_pairs};
    data_cache = (require('../../../apps/letsfreezethat')).freeze(data_cache);
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.letsfreezethat_v2 = function(cfg, sublibrary) {
    return new Promise((resolve) => {
      var LFT, count, data, lets;
      LFT = require('../letsfreezethat@2.2.5');
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
  this.letsfreezethat_v2_standard = function(cfg) {
    return this.letsfreezethat_v2(cfg, 'standard');
  };

  this.letsfreezethat_v2_nofreeze = function(cfg) {
    return this.letsfreezethat_v2(cfg, 'nofreeze');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.immutable = function(cfg) {
    return new Promise((resolve) => {
      var Map, count, data;
      ({Map} = require('immutable'));
      count = 0;
      data = this.get_data(cfg);
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, key, key_idx, key_value_pairs, len, len1, probe, ref;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = Map(Object.fromEntries(key_value_pairs));
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe = probe.set(key, facet_values[key_idx]);
            }
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.hamt = function(cfg) {
    return new Promise((resolve) => {
      var HAMT, count, data;
      HAMT = require('hamt');
      count = 0;
      data = this.get_data(cfg);
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, k, key, key_idx, key_value_pairs, len, len1, len2, probe, ref, value;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = HAMT.empty;
            for (j = 0, len1 = key_value_pairs.length; j < len1; j++) {
              [key, value] = key_value_pairs[j];
              probe = probe.set(key, value);
            }
            for (key_idx = k = 0, len2 = facet_keys.length; k < len2; key_idx = ++k) {
              key = facet_keys[key_idx];
              probe = probe.set(key, facet_values[key_idx]);
            }
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mori = function(cfg) {
    return new Promise((resolve) => {
      var M, count, d, data, key_value_pairs;
      M = require('mori');
      count = 0;
      data = this.get_data(cfg);
      key_value_pairs = (function() {
        var i, len, ref, results;
        ref = data.lists_of_key_value_pairs;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(d.flat());
        }
        return results;
      })();
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, key, key_idx, kvps, len, len1, probe;
          for (datom_idx = i = 0, len = key_value_pairs.length; i < len; datom_idx = ++i) {
            kvps = key_value_pairs[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = M.hashMap(...kvps);
// debug '3338^', M.intoArray( M.keys probe ), M.intoArray( M.vals probe )
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe = M.assoc(probe, key, facet_values[key_idx]);
            }
            // debug '3338^', M.intoArray( M.keys probe ), M.intoArray( M.vals probe )
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.immer = function(cfg) {
    return new Promise((resolve) => {
      var IMMER, count, data, produce;
      IMMER = require('immer');
      ({produce} = IMMER);
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
            probe = produce(Object.fromEntries(key_value_pairs), function(probe) {
              return probe;
            });
            // whisper '^331^', probe
            probe = produce(probe, function(probe) {
              var j, key, key_idx, len1;
              for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
                key = facet_keys[key_idx];
                probe[key] = facet_values[key_idx];
              }
              return void 0;
            });
            // whisper '^331^', probe
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.plainjs_immutable = function(cfg) {
    return new Promise((resolve) => {
      var count, data;
      // @types.validate.hengist_dataprv_cfg cfg
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, key, key_idx, key_value_pairs, len, len1, probe, ref;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = Object.freeze(Object.fromEntries(key_value_pairs));
            probe = {...probe};
// whisper '^331^', probe
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe[key] = facet_values[key_idx];
            }
            // whisper '^331^', probe
            Object.freeze(probe);
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.plainjs_mutable = function(cfg) {
    return new Promise((resolve) => {
      var count, data;
      // @types.validate.hengist_dataprv_cfg cfg
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, key, key_idx, key_value_pairs, len, len1, probe, ref;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = Object.fromEntries(key_value_pairs);
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe[key] = facet_values[key_idx];
            }
            // whisper '^331^', probe
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v3_lets = function(cfg, lft_cfg) {
    return new Promise((resolve) => {
      var LFT, count, data;
      if (lft_cfg.freeze) {
        LFT = require('../../../apps/letsfreezethat/freeze');
      } else {
        LFT = require('../../../apps/letsfreezethat/nofreeze');
      }
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
            probe = LFT.assign(Object.fromEntries(key_value_pairs));
            // whisper '^331^', probe
            probe = LFT.lets(probe, function(probe) {
              var j, key, key_idx, len1;
              for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
                key = facet_keys[key_idx];
                probe[key] = facet_values[key_idx];
              }
              return null;
            });
            // whisper '^331^', probe
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.letsfreezethat_v3_lets_f1 = function(cfg) {
    return this._letsfreezethat_v3_lets(cfg, {
      freeze: true
    });
  };

  this.letsfreezethat_v3_lets_f0 = function(cfg) {
    return this._letsfreezethat_v3_lets(cfg, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v3_thaw_freeze = function(cfg, lft_cfg) {
    return new Promise((resolve) => {
      var LFT, count, data;
      if (lft_cfg.freeze) {
        LFT = require('../../../apps/letsfreezethat/freeze');
      } else {
        LFT = require('../../../apps/letsfreezethat/nofreeze');
      }
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var datom_idx, facet_keys, facet_values, i, j, key, key_idx, key_value_pairs, len, len1, probe, ref;
          ref = data.lists_of_key_value_pairs;
          for (datom_idx = i = 0, len = ref.length; i < len; datom_idx = ++i) {
            key_value_pairs = ref[datom_idx];
            facet_keys = data.lists_of_facet_keys[datom_idx];
            facet_values = data.lists_of_facet_values[datom_idx];
            probe = LFT.assign(Object.fromEntries(key_value_pairs));
            // whisper '^331^', probe
            probe = LFT.thaw(probe);
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe[key] = facet_values[key_idx];
            }
            probe = LFT.freeze(probe);
            count++;
          }
/* NOTE counting datoms, not facets */          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.letsfreezethat_v3_thaw_freeze_f1 = function(cfg) {
    return this._letsfreezethat_v3_thaw_freeze(cfg, {
      freeze: true
    });
  };

  this.letsfreezethat_v3_thaw_freeze_f0 = function(cfg) {
    return this._letsfreezethat_v3_thaw_freeze(cfg, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    cfg = {
      set_count: 100,
      datom_length: 5,
      change_facet_count: 3
    };
    // cfg         = { set_count: 3, datom_length: 2, change_facet_count: 1, }
    repetitions = 3;
    test_names = ['immer', 'letsfreezethat_v2_standard', 'letsfreezethat_v2_nofreeze', 'letsfreezethat_v3_lets_f1', 'letsfreezethat_v3_lets_f0', 'letsfreezethat_v3_thaw_freeze_f1', 'letsfreezethat_v3_thaw_freeze_f0', 'immutable', 'hamt', 'mori', 'plainjs_mutable', 'plainjs_immutable'];
    if (global.gc != null) {
      global.gc();
    }
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      data_cache = null;
      if (global.gc != null) {
        global.gc();
      }
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
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

  /*

00:07 HENGIST/BENCHMARKS  ▶  plainjs_mutable                                    8,268 Hz   100.0 % │████████████▌│
00:07 HENGIST/BENCHMARKS  ▶  plainjs_immutable                                  4,933 Hz    59.7 % │███████▌     │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_thaw_freeze_f0                   4,682 Hz    56.6 % │███████▏     │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_standard                         4,464 Hz    54.0 % │██████▊      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_lets_f0                          4,444 Hz    53.8 % │██████▊      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_lets_f1                          4,213 Hz    51.0 % │██████▍      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_thaw_freeze_f1                   4,034 Hz    48.8 % │██████▏      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_nofreeze                         2,143 Hz    25.9 % │███▎         │
00:07 HENGIST/BENCHMARKS  ▶  immutable                                          1,852 Hz    22.4 % │██▊          │
00:07 HENGIST/BENCHMARKS  ▶  mori                                               1,779 Hz    21.5 % │██▊          │
00:07 HENGIST/BENCHMARKS  ▶  hamt                                               1,752 Hz    21.2 % │██▋          │
00:07 HENGIST/BENCHMARKS  ▶  immer                                              1,352 Hz    16.3 % │██           │

*/

}).call(this);

//# sourceMappingURL=usecase1.benchmarks.js.map