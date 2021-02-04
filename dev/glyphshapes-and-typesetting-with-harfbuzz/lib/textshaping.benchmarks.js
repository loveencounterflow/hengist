(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, data_cache, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEXTSHAPING';

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
    var DATOM;
    if (data_cache != null) {
      return data_cache;
    }
    DATOM = require('../../../apps/datom');
    //.........................................................................................................
    DATA.get_cjk_chr;
    debug(DATA.get_words(cfg.words_per_line));
    //.........................................................................................................
    data_cache = {};
    data_cache = DATOM.freeze(data_cache);
    return data_cache;
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
    test_names = ['datom_v8_thaw_freeze_f1'];
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
    (() => {
      var cfg;
      // await @run_benchmarks()
      cfg = {
        words_per_line: 3
      };
      return debug(this.get_data(cfg));
    })();
  }

}).call(this);

//# sourceMappingURL=textshaping.benchmarks.js.map