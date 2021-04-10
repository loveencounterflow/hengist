(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

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

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(cfg, fresh = true) {
    var datoms;
    if (fresh) {
      this.get_data.cache = null;
    }
    if (this.get_data.cache != null) {
      return this.get_data.cache;
    }
    datoms = DATA.get_random_datoms(cfg.set_count);
    this.get_data.cache = {datoms};
    return this.get_data.cache;
  };

  this.get_data.cache = null;

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.freeze___letsfreezethat_v2 = function(cfg) {
    return new Promise((resolve) => {
      var LFT, count, data, freeze, lets, thaw;
      LFT = require('../letsfreezethat@2.2.5');
      ({lets, freeze, thaw} = LFT);
      data = this.get_data(cfg);
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var d, e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = freeze(d);
            if (e === d) {
              throw new Error('^445-1^ identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-2^ not frozen');
            }
            if (!Object.isFrozen(e.$vnr)) {
              throw new Error('^445-3^ not frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____letsfreezethat_v2 = function(cfg) {
    return new Promise((resolve) => {
      var LFT, count, d, data, freeze, lets, thaw;
      LFT = require('../letsfreezethat@2.2.5');
      ({lets, freeze, thaw} = LFT);
      data = this.get_data(cfg);
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(freeze(d));
        }
        return results;
      })();
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = thaw(d);
            if (e === d) {
              throw new Error('^445-4^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-5^ not thawed');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-6^ not thawed');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this._freeze___letsfreezethat_v3 = function(cfg, lft_cfg) {
    return new Promise((resolve) => {
      var LFT, count, data, freeze, lets, thaw;
      if (lft_cfg.freeze) {
        LFT = require('../../../apps/letsfreezethat/freeze');
      } else {
        LFT = require('../../../apps/letsfreezethat/nofreeze');
      }
      ({lets, freeze, thaw} = LFT);
      data = this.get_data(cfg);
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var d, e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = freeze(d);
            if (e !== d) {
              throw new Error('^445-16^ not identical');
            }
            if (lft_cfg.freeze) {
              if (!Object.isFrozen(e)) {
                throw new Error('^445-17^ not frozen');
              }
              if (!Object.isFrozen(e.$vnr)) {
                throw new Error('^445-18^ not frozen');
              }
            } else {
              if (Object.isFrozen(e)) {
                throw new Error('^445-19^ frozen');
              }
              if (Object.isFrozen(e.$vnr)) {
                throw new Error('^445-20^ frozen');
              }
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._thaw_____letsfreezethat_v3 = function(cfg, lft_cfg) {
    return new Promise((resolve) => {
      var LFT, count, d, data, freeze, lets, thaw;
      if (lft_cfg.freeze) {
        LFT = require('../../../apps/letsfreezethat/freeze');
      } else {
        LFT = require('../../../apps/letsfreezethat/nofreeze');
      }
      ({lets, freeze, thaw} = LFT);
      data = this.get_data(cfg);
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(freeze(d));
        }
        return results;
      })();
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = thaw(d);
            if (e === d) {
              throw new Error('^445-21^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-22^ not thawed');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-23^ not thawed');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.freeze___letsfreezethat_v3_f1 = function(cfg) {
    return this._freeze___letsfreezethat_v3(cfg, {
      freeze: true
    });
  };

  this.freeze___letsfreezethat_v3_f0 = function(cfg) {
    return this._freeze___letsfreezethat_v3(cfg, {
      freeze: false
    });
  };

  this.thaw_____letsfreezethat_v3_f1 = function(cfg) {
    return this._thaw_____letsfreezethat_v3(cfg, {
      freeze: true
    });
  };

  this.thaw_____letsfreezethat_v3_f0 = function(cfg) {
    return this._thaw_____letsfreezethat_v3(cfg, {
      freeze: false
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.freeze___deepfreeze = function(cfg) {
    return new Promise((resolve) => {
      var count, data, freeze;
      freeze = require('deepfreeze');
      data = this.get_data(cfg);
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var d, e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = freeze(d);
            if (e !== d) {
              throw new /* freezes in-place */Error('^445-24^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-25^ not frozen');
            }
            if (!Object.isFrozen(e.$vnr)) {
              throw new Error('^445-26^ not frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.freeze___deepfreezer = function(cfg) {
    return new Promise((resolve) => {
      var count, data, deepFreeze, deepThaw, freeze, thaw;
      ({freeze, deepFreeze, thaw, deepThaw} = require('deepfreezer'));
      data = this.get_data(cfg);
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var d, e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = deepFreeze(d, true);
            if (e !== d) {
              throw new /* NOTE use `true` to avoid copying */Error('^445-27^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-28^ not frozen');
            }
            if (!Object.isFrozen(e.$vnr)) {
              throw new Error('^445-29^ not frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____deepfreezer = function(cfg) {
    return new Promise((resolve) => {
      var count, d, data, deepFreeze, deepThaw, freeze, thaw;
      ({freeze, deepFreeze, thaw, deepThaw} = require('deepfreezer'));
      data = this.get_data(cfg);
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(deepFreeze(d));
        }
        return results;
      })();
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = deepThaw(d, true);
            if (e === d) {
              throw new /* NOTE use `true` to avoid copying */Error('^445-30^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-31^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-32^ frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.freeze___shallow_native = function(cfg) {
    return new Promise((resolve) => {
      var count, data, freeze;
      ({freeze} = Object);
      data = this.get_data(cfg);
      count = 0;
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var d, e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = freeze(d, true);
            if (e !== d) {
              throw new /* NOTE use `true` to avoid copying */Error('^445-33^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-34^ not frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-35^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____shallow_native = function(cfg) {
    return new Promise((resolve) => {
      var count, d, data, freeze;
      ({freeze} = Object);
      data = this.get_data(cfg);
      count = 0;
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(Object.freeze(d));
        }
        return results;
      })();
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = Object.assign({}, d);
            if (e === d) {
              throw new Error('^445-36^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-37^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-38^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____fast_copy = function(cfg) {
    return new Promise((resolve) => {
      var copy, count, d, data;
      // debug require 'fast-copy'
      // debug ( require 'fast-copy').copy
      // debug ( require 'fast-copy').strict
      copy = require('fast-copy');
      data = this.get_data(cfg);
      count = 0;
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(Object.freeze(d));
        }
        return results;
      })();
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = copy(d);
            if (e === d) {
              throw new Error('^445-39^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-40^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-41^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____fast_copy_strict = function(cfg) {
    return new Promise((resolve) => {
      var copy, count, d, data;
      // debug require 'fast-copy'
      // debug ( require 'fast-copy').copy
      // debug ( require 'fast-copy').strict
      copy = require('fast-copy');
      data = this.get_data(cfg);
      count = 0;
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(Object.freeze(d));
        }
        return results;
      })();
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = copy.strict(d);
            if (e === d) {
              throw new Error('^445-42^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-43^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-44^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____klona = function(cfg) {
    return new Promise((resolve) => {
      var count, d, data, klona;
      ({klona} = require('klona/json'));
      data = this.get_data(cfg);
      count = 0;
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(Object.freeze(d));
        }
        return results;
      })();
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = klona(d);
            if (e === d) {
              throw new Error('^445-45^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-46^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-47^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.thaw_____deepcopy = function(cfg) {
    return new Promise((resolve) => {
      var count, d, data, deepcopy;
      deepcopy = require('deepcopy');
      data = this.get_data(cfg);
      count = 0;
      data.datoms = (function() {
        var i, len, ref, results;
        ref = data.datoms;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          d = ref[i];
          results.push(Object.freeze(d));
        }
        return results;
      })();
      if (global.gc != null) {
        global.gc();
      }
      /* TAINT consider to do this in BM moduke */      resolve(() => {
        return new Promise((resolve) => {
          var e, i, len, ref;
          ref = data.datoms;
          for (i = 0, len = ref.length; i < len; i++) {
            d = ref[i];
            e = deepcopy(d);
            if (e === d) {
              throw new Error('^445-48^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-49^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-50^ is frozen');
            }
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this._prewarm = function(cfg) {
    var _, i, ignore, j, ref;
    ignore = [];
    for (_ = i = 1, ref = cfg.repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      for (_ = j = 1; j <= 5; _ = ++j) {
        ignore.push(this.get_data(cfg.set_count));
      }
    }
    if (global.gc != null) {
      // ignore.length = 0
      global.gc();
    }
    return function()/* TAINT consider to do this in BM moduke */ {
      return new Promise(function(resolve) {
        return resolve(1);
      });
    };
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, cfg, i, j, len, ref, ref1, test_name, test_names;
    bench = BM.new_benchmarks();
    // n           = 100000
    cfg = {
      repetitions: 3,
      set_count: 100
    };
    cfg = {
      repetitions: 3,
      set_count: 1
    };
    cfg = {
      repetitions: 3,
      set_count: 10
    };
    cfg = {
      repetitions: 3,
      set_count: 1000
    };
    cfg = {
      repetitions: 3,
      set_count: 10000
    };
    test_names = ['thaw_____letsfreezethat_v2', 'freeze___letsfreezethat_v2', 'thaw_____klona', 'thaw_____fast_copy', 'thaw_____letsfreezethat_v3_f1', 'thaw_____deepfreezer', 'thaw_____shallow_native', 'thaw_____fast_copy_strict', 'thaw_____deepcopy', 'thaw_____letsfreezethat_v3_f0', 'freeze___letsfreezethat_v3_f0', 'freeze___letsfreezethat_v3_f1', 'freeze___letsfreezethat_v3_f0', 'freeze___deepfreeze', 'freeze___deepfreezer', 'freeze___shallow_native'];
    if (global.gc != null) {
      // await BM.benchmark bench, cfg, false, @, '_prewarm'
      global.gc();
    }
    ref = CND.shuffle(test_names);
    for (i = 0, len = ref.length; i < len; i++) {
      test_name = ref[i];
      whisper('-'.repeat(108));
      for (_ = j = 1, ref1 = cfg.repetitions; (1 <= ref1 ? j <= ref1 : j >= ref1); _ = 1 <= ref1 ? ++j : --j) {
        await BM.benchmark(bench, cfg, false, this, test_name);
        if (global.gc != null) {
          global.gc();
        }
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

00:15 HENGIST/BENCHMARKS  ▶  thaw_____shallow_native                          829,171 Hz   100.0 % │████████████▌│
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v3_f0                    745,781 Hz    89.9 % │███████████▎ │
00:15 HENGIST/BENCHMARKS  ▶  freeze___shallow_native                          665,340 Hz    80.2 % │██████████   │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____klona                                   347,483 Hz    41.9 % │█████▎       │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v3_f0                    330,089 Hz    39.8 % │█████        │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v3_f1                    242,111 Hz    29.2 % │███▋         │
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v3_f1                    201,651 Hz    24.3 % │███          │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____fast_copy                               176,418 Hz    21.3 % │██▋          │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v2                        93,441 Hz    11.3 % │█▍           │
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v2                        70,091 Hz     8.5 % │█            │
00:15 HENGIST/BENCHMARKS  ▶  freeze___deepfreeze                               59,320 Hz     7.2 % │▉            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____deepfreezer                              50,249 Hz     6.1 % │▊            │
00:15 HENGIST/BENCHMARKS  ▶  freeze___deepfreezer                              37,352 Hz     4.5 % │▋            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____deepcopy                                 31,608 Hz     3.8 % │▌            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____fast_copy_strict                         17,539 Hz     2.1 % │▎            │

*/

}).call(this);

//# sourceMappingURL=lft-deepfreeze.benchmarks.js.map