(function() {
  'use strict';
  var BM, CND, DATA, FS, PATH, alert, badge, debug, echo, help, info, jr, log, provide_LFT_candidate, rpr, test, urge, warn, whisper;

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
  provide_LFT_candidate = function() {
    this.copy_1 = function(d) {
      var R, k, v;
      switch (Object.prototype.toString.call(d)) {
        case '[object Array]':
          return (function() {
            var i, len, results;
            results = [];
            for (i = 0, len = d.length; i < len; i++) {
              v = d[i];
              results.push(this.copy_1(v));
            }
            return results;
          }).call(this);
        case '[object Object]':
          R = {};
          for (k in d) {
            v = d[k];
            R[k] = this.copy_1(v);
          }
          return R;
      }
      return d;
    };
    this.copy_2 = function(d) {
      var R, k, v;
      if ((!d) || d === true) {
        /* immediately return for zero, empty string, null, undefined, NaN, false, true: */
        return d;
      }
      /* thx to https://github.com/lukeed/klona/blob/master/src/json.js */
      switch (Object.prototype.toString.call(d)) {
        case '[object Array]':
          R = Array((k = d.length));
          while (k--) {
            R[k] = ((v = d[k]) != null) && ((typeof v) === 'object') ? this.copy_2(v) : v;
          }
          return R;
        case '[object Object]':
          R = {};
          for (k in d) {
            if (k === '__proto__') {
              /* TAINT do we ever need this? */
              Object.defineProperty(R, k, {
                value: this.copy_2(d[k]),
                configurable: true,
                enumerable: true,
                writable: true
              });
            } else {
              R[k] = ((v = d[k]) != null) && ((typeof v) === 'object') ? this.copy_2(v) : v;
            }
          }
          return R;
      }
      return d;
    };
    return this.copy_3 = function(d) {
      var R, k, v;
      if ((!d) || d === true) {
        /* immediately return for zero, empty string, null, undefined, NaN, false, true: */
        return d;
      }
      /* thx to https://github.com/lukeed/klona/blob/master/src/json.js */
      if (Array.isArray(d)) {
        R = Array((k = d.length | 0));
        while ((k--) | 0) {
          R[k] = ((v = d[k]) != null) && ((typeof v) === 'object') ? this.copy_2(v) : v;
        }
        return R;
      }
      if (typeof d !== 'object') {
        return d;
      }
      R = {};
      for (k in d) {
        R[k] = ((v = d[k]) != null) && ((typeof v) === 'object') ? this.copy_2(v) : v;
      }
      return R;
    };
  };

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
  this.freeze___letsfreezethat = function(cfg) {
    return new Promise((resolve) => {
      var LFT, count, data, freeze, lets, thaw;
      LFT = require('../../../apps/letsfreezethat');
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
  this.thaw_____letsfreezethat = function(cfg) {
    return new Promise((resolve) => {
      var LFT, count, d, data, freeze, lets, thaw;
      LFT = require('../../../apps/letsfreezethat');
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

  //-----------------------------------------------------------------------------------------------------------
  this.copy_____lft_xxx_1 = function(cfg) {
    return new Promise((resolve) => {
      var LFT, copy, count, d, data, freeze;
      provide_LFT_candidate.apply(LFT = {});
      copy = LFT.copy_1.bind(LFT);
      data = this.get_data(cfg);
      ({freeze} = require('letsfreezethat'));
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
            e = copy(d);
            if (e === d) {
              throw new Error('^445-7^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-8^ not thawed');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-9^ not thawed');
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
  this.copy_____lft_xxx_2 = function(cfg) {
    return new Promise((resolve) => {
      var LFT, copy, count, d, data, freeze;
      provide_LFT_candidate.apply(LFT = {});
      copy = LFT.copy_2.bind(LFT);
      data = this.get_data(cfg);
      ({freeze} = require('letsfreezethat'));
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
            e = copy(d);
            if (e === d) {
              throw new Error('^445-7^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-8^ not thawed');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-9^ not thawed');
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
  this.copy_____lft_xxx_3 = function(cfg) {
    return new Promise((resolve) => {
      var LFT, copy, count, d, data, freeze;
      provide_LFT_candidate.apply(LFT = {});
      copy = LFT.copy_3.bind(LFT);
      data = this.get_data(cfg);
      ({freeze} = require('letsfreezethat'));
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
            e = copy(d);
            if (e === d) {
              throw new Error('^445-7^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-8^ not thawed');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-9^ not thawed');
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
              throw new /* freezes in-place */Error('^445-10^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-11^ not frozen');
            }
            if (!Object.isFrozen(e.$vnr)) {
              throw new Error('^445-12^ not frozen');
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
              throw new /* NOTE use `true` to avoid copying */Error('^445-13^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-14^ not frozen');
            }
            if (!Object.isFrozen(e.$vnr)) {
              throw new Error('^445-15^ not frozen');
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
              throw new /* NOTE use `true` to avoid copying */Error('^445-16^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-17^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-18^ frozen');
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
              throw new /* NOTE use `true` to avoid copying */Error('^445-19^ not identical');
            }
            if (!Object.isFrozen(e)) {
              throw new Error('^445-20^ not frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-21^ is frozen');
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
              throw new Error('^445-22^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-23^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-24^ is frozen');
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
  this.copy_____shallow_native = this.thaw_____shallow_native;

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.copy_____fast_copy = function(cfg) {
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
              throw new Error('^445-25^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-26^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-27^ is frozen');
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
  this.copy_____fast_copy_strict = function(cfg) {
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
              throw new Error('^445-28^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-29^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-30^ is frozen');
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
  this.copy_____klona = function(cfg) {
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
              throw new Error('^445-31^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-32^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-33^ is frozen');
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
  this.copy_____deepcopy = function(cfg) {
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
              throw new Error('^445-34^ identical');
            }
            if (Object.isFrozen(e)) {
              throw new Error('^445-35^ frozen');
            }
            if (Object.isFrozen(e.$vnr)) {
              throw new Error('^445-36^ is frozen');
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
      set_count: 1000
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
      set_count: 10000
    };
    test_names = ['thaw_____letsfreezethat', 'copy_____klona', 'copy_____lft_xxx_1', 'copy_____lft_xxx_2', 'copy_____lft_xxx_3', 'copy_____fast_copy'];
    if (global.gc != null) {
      // await BM.benchmark bench, cfg, false, @, '_prewarm'
      // 'copy_____shallow_native'
      // 'freeze___letsfreezethat'
      // 'freeze___deepfreeze'
      // 'freeze___deepfreezer'
      // 'thaw_____deepfreezer'
      // 'freeze___shallow_native'
      // 'thaw_____shallow_native'
      // 'copy_____fast_copy_strict'
      // 'copy_____deepcopy'
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

}).call(this);

//# sourceMappingURL=lft-deepfreeze.benchmarks.js.map