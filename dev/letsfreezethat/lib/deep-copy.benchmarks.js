(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, help, info, jr, lft225, lft310, log, rpr, test, urge, warn, whisper;

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

  lft225 = require('letsfreezethat225');

  lft310 = require('letsfreezethat310');

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
    // debug '^446^', Object.keys ( require '../letsfreezethat@2.2.5' )
    // debug '^446^', Object.keys lft225
    // debug '^446^', Object.keys lft310
    // process.exit 119
    bench = BM.new_benchmarks();
    cfg = {
      set_count: 100,
      datom_length: 5,
      change_facet_count: 3
    };
    // cfg         = { set_count: 3, datom_length: 2, change_facet_count: 1, }
    repetitions = 3;
    test_names = ['letsfreezethat_v2_standard', 'letsfreezethat_v2_nofreeze', 'letsfreezethat_v3_lets_f1', 'letsfreezethat_v3_lets_f0', 'letsfreezethat_v3_thaw_freeze_f1', 'letsfreezethat_v3_thaw_freeze_f0'];
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

  globalThis.structuredClone;

}).call(this);

//# sourceMappingURL=deep-copy.benchmarks.js.map