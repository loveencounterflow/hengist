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
    var DATOM, _, datom_keys, datoms, i, idx, j, k, key, key_idx, keys, l, len, len1, len2, lists_of_facet_keys, lists_of_facet_values, lists_of_keys, lists_of_values, objects, ref, set_idx, values, word;
    if (data_cache != null) {
      return data_cache;
    }
    DATOM = require('../../../apps/datom');
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
    datom_keys = (function() {
      var j, len, ref1, results;
      ref1 = DATA.get_words(cfg.set_count);
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        word = ref1[j];
        results.push(`^${word}`);
      }
      return results;
    })();
    //.........................................................................................................
    objects = [];
    for (set_idx = j = 0, len = lists_of_keys.length; j < len; set_idx = ++j) {
      keys = lists_of_keys[set_idx];
      values = lists_of_values[set_idx];
      objects.push(Object.fromEntries((function() {
        var k, len1, results;
        results = [];
        for (key_idx = k = 0, len1 = keys.length; k < len1; key_idx = ++k) {
          key = keys[key_idx];
          results.push([key, values[key_idx]]);
        }
        return results;
      })()));
    }
    //.........................................................................................................
    datoms = (function() {
      var k, len1, results;
      results = [];
      for (idx = k = 0, len1 = datom_keys.length; k < len1; idx = ++k) {
        key = datom_keys[idx];
        results.push(DATOM.new_datom(key, objects[idx]));
      }
      return results;
    })();
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
    data_cache = {lists_of_keys, lists_of_values, lists_of_facet_keys, lists_of_facet_values, datoms, datom_keys, objects};
    data_cache = DATOM.freeze(data_cache);
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._datom_lets = function(cfg, datom_cfg) {
    return new Promise((resolve) => {
      var DATOM, count, data, lets;
      switch (datom_cfg.version) {
        case '7':
          DATOM = (require('../datom@7.0.3')).new(datom_cfg);
          break;
        case '8':
          DATOM = (require('../../../apps/datom')).new(datom_cfg);
          break;
        default:
          throw new Error(`^464^ unknown version in datom_cfg: ${rpr(datom_cfg)}`);
      }
      ({lets} = DATOM.export());
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var facet_keys, facet_values, i, len, probe, probe_idx, ref;
          ref = data.datoms;
          for (probe_idx = i = 0, len = ref.length; i < len; probe_idx = ++i) {
            probe = ref[probe_idx];
            facet_keys = data.lists_of_facet_keys[probe_idx];
            facet_values = data.lists_of_facet_values[probe_idx];
            // whisper '^331^', probe
            probe = lets(probe, function(probe) {
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
  this.datom_v7_lets_f1 = function(cfg) {
    return this._datom_lets(cfg, {
      version: '7',
      freeze: true
    });
  };

  this.datom_v7_lets_f0 = function(cfg) {
    return this._datom_lets(cfg, {
      version: '7',
      freeze: false
    });
  };

  this.datom_v8_lets_f1 = function(cfg) {
    return this._datom_lets(cfg, {
      version: '8',
      freeze: true
    });
  };

  this.datom_v8_lets_f0 = function(cfg) {
    return this._datom_lets(cfg, {
      version: '8',
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._datom_thaw_freeze = function(cfg, datom_cfg) {
    return new Promise((resolve) => {
      var DATOM, count, data, freeze, thaw;
      switch (datom_cfg.version) {
        case '7':
          DATOM = (require('../datom@7.0.3')).new(datom_cfg);
          break;
        case '8':
          DATOM = (require('../../../apps/datom')).new(datom_cfg);
          break;
        default:
          throw new Error(`^464^ unknown version in datom_cfg: ${rpr(datom_cfg)}`);
      }
      ({thaw, freeze} = DATOM.export());
      data = this.get_data(cfg);
      count = 0;
      resolve(() => {
        return new Promise((resolve) => {
          var facet_keys, facet_values, i, j, key, key_idx, len, len1, probe, probe_idx, ref;
          ref = data.datoms;
          for (probe_idx = i = 0, len = ref.length; i < len; probe_idx = ++i) {
            probe = ref[probe_idx];
            facet_keys = data.lists_of_facet_keys[probe_idx];
            facet_values = data.lists_of_facet_values[probe_idx];
            probe = thaw(probe);
            whisper('^331^', probe, Object.isFrozen(probe));
            for (key_idx = j = 0, len1 = facet_keys.length; j < len1; key_idx = ++j) {
              key = facet_keys[key_idx];
              probe[key] = facet_values[key_idx];
            }
            probe = freeze(probe);
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
  this.datom_v7_thaw_freeze_f1 = function(cfg) {
    return this._datom_thaw_freeze(cfg, {
      version: '7',
      freeze: true
    });
  };

  this.datom_v7_thaw_freeze_f0 = function(cfg) {
    return this._datom_thaw_freeze(cfg, {
      version: '7',
      freeze: false
    });
  };

  this.datom_v8_thaw_freeze_f1 = function(cfg) {
    return this._datom_thaw_freeze(cfg, {
      version: '8',
      freeze: true
    });
  };

  this.datom_v8_thaw_freeze_f0 = function(cfg) {
    return this._datom_thaw_freeze(cfg, {
      version: '8',
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, repetitions, test_name, test_names;
    bench = BM.new_benchmarks();
    // cfg         = { set_count: 100, datom_length: 5, change_facet_count: 3, }
    // cfg         = { set_count: 20, datom_length: 5, change_facet_count: 3, }
    cfg = {
      set_count: 3,
      datom_length: 5,
      change_facet_count: 3
    };
    repetitions = 10;
    test_names = [
      'datom_v7_lets_f1',
      'datom_v7_lets_f0',
      'datom_v8_lets_f1',
      'datom_v8_lets_f0',
      'datom_v7_thaw_freeze_f1',
      // 'datom_v7_thaw_freeze_f0' ### broken, doesn't thaw ###
      'datom_v8_thaw_freeze_f0',
      'datom_v8_thaw_freeze_f1'
    ];
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
  if (require.main === module) {
    (async() => {
      return (await this.run_benchmarks());
    })();
  }

  // await @_datom_lets()
/*

00:10 HENGIST/BENCHMARKS  ▶  datom_v8_thaw_freeze_f0                          144,938 Hz   100.0 % │████████████▌│
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_lets_f0                                 128,930 Hz    89.0 % │███████████▏ │
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_thaw_freeze_f1                          126,920 Hz    87.6 % │███████████  │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_lets_f0                                  92,669 Hz    63.9 % │████████     │
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_lets_f1                                  81,917 Hz    56.5 % │███████▏     │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_lets_f1                                  40,063 Hz    27.6 % │███▌         │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_thaw_freeze_f1                           39,334 Hz    27.1 % │███▍         │

*/

}).call(this);

//# sourceMappingURL=datom.benchmarks.js.map