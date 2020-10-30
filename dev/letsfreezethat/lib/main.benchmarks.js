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

  DATA = require('../../../lib/data-providers');

  test = require('guy-test');

  ({jr} = CND);

  BM = require('../../../lib/benchmarks');

  data_cache = null;

  //-----------------------------------------------------------------------------------------------------------
  this.get_data = function(n) {
    var probes_A, probes_B;
    if (data_cache != null) {
      return data_cache;
    }
    probes_A = DATA.get_random_nested_objects(n, null, true);
    probes_B = DATA.get_random_nested_objects(n, null, true);
    // debug '^3342^', probes_A
    // debug '^3342^', probes_B
    // debug '^3342^', probes_C
    /* NOTE could count number of actual properties in nested objects */
    data_cache = {probes_A, probes_B};
    return (require('../../../apps/letsfreezethat')).freeze(data_cache);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v3_lets = function(n, show, lft_cfg) {
    return new Promise((resolve) => {
      var count, lets, probes_A, probes_B;
      if (lft_cfg.freeze) {
        lets = require('../../../apps/letsfreezethat/freeze');
      } else {
        lets = require('../../../apps/letsfreezethat/nofreeze');
      }
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, probe;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = lets(probe);
            probe = lets(probe, function(probe) {
              var k, ref, v;
              ref = probes_B[idx];
              for (k in ref) {
                v = ref[k];
                probe[k] = v;
              }
              return null;
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
  this.letsfreezethat_v3_f1_lets = function(n, show) {
    return this._letsfreezethat_v3_lets(n, show, {
      freeze: true
    });
  };

  this.letsfreezethat_v3_f0_lets = function(n, show) {
    return this._letsfreezethat_v3_lets(n, show, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v3_freezethaw = function(n, show, lft_cfg) {
    return new Promise((resolve) => {
      var count, freeze, lets, probes_A, probes_B, thaw;
      if (lft_cfg.freeze) {
        lets = require('../../../apps/letsfreezethat/freeze');
      } else {
        lets = require('../../../apps/letsfreezethat/nofreeze');
      }
      ({thaw, freeze} = lets);
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, k, len, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = thaw(probe);
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe[k] = v;
            }
            probe = freeze(probe);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.letsfreezethat_v3_f1_freezethaw = function(n, show) {
    return this._letsfreezethat_v3_freezethaw(n, show, {
      freeze: true
    });
  };

  this.letsfreezethat_v3_f0_freezethaw = function(n, show) {
    return this._letsfreezethat_v3_freezethaw(n, show, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v2_lets = function(n, show, lft_cfg) {
    return new Promise((resolve) => {
      var LFT, count, lets, probes_A, probes_B;
      LFT = require('../letsfreezethat@2.2.5');
      if (lft_cfg.freeze) {
        ({lets} = LFT);
      } else {
        ({lets} = LFT.nofreeze);
      }
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, probe;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = lets(probe);
            probe = lets(probe, function(probe) {
              var k, ref, v;
              ref = probes_B[idx];
              for (k in ref) {
                v = ref[k];
                probe[k] = v;
              }
              return null;
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
  this.letsfreezethat_v2_f1_lets = function(n, show) {
    return this._letsfreezethat_v2_lets(n, show, {
      freeze: true
    });
  };

  this.letsfreezethat_v2_f0_lets = function(n, show) {
    return this._letsfreezethat_v2_lets(n, show, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this._letsfreezethat_v2_freezethaw = function(n, show, lft_cfg) {
    return new Promise((resolve) => {
      /* Bug (or feature?) of LFTv2: in nofreeze mode, `thaw()` does not copy object */
      var LFT, count, freeze, probes_A, probes_B, thaw;
      LFT = require('../letsfreezethat@2.2.5');
      if (lft_cfg.freeze) {
        ({freeze} = LFT);
      } else {
        ({freeze} = LFT.nofreeze);
      }
      ({thaw} = LFT);
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, k, len, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = thaw(probe);
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe[k] = v;
            }
            probe = freeze(probe);
            count++;
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.letsfreezethat_v2_f1_freezethaw = function(n, show) {
    return this._letsfreezethat_v2_freezethaw(n, show, {
      freeze: true
    });
  };

  this.letsfreezethat_v2_f0_freezethaw = function(n, show) {
    return this._letsfreezethat_v2_freezethaw(n, show, {
      freeze: false
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.immutable = function(n, show) {
    return new Promise((resolve) => {
      var Map, count, probes_A, probes_B;
      ({Map} = require('immutable'));
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, k, len, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = Map(probe);
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = probe.set(k, v);
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
  this.hamt = function(n, show) {
    return new Promise((resolve) => {
      var count, hamt, probes_A, probes_B;
      hamt = require('hamt');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, k, len, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = hamt.empty;
/* NOTE must always iterate over facets, no bulk `set()` */
            for (k in probe) {
              v = probe[k];
              probe = probe.set(k, v);
            }
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = probe.set(k, v);
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
  this.mori = function(n, show) {
    return new Promise((resolve) => {
      var M, count, i, k, len, probe, probes_A, probes_A_entries, probes_B, v;
      M = require('mori');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      probes_A_entries = [];
      for (i = 0, len = probes_A.length; i < len; i++) {
        probe = probes_A[i];
        probes_A_entries.push((function() {
          var results;
          results = [];
          for (k in probe) {
            v = probe[k];
            results.push([k, v]);
          }
          return results;
        })());
      }
      resolve(() => {
        return new Promise((resolve) => {
          var idx, j, len1, ref;
          for (idx = j = 0, len1 = probes_A_entries.length; j < len1; idx = ++j) {
            probe = probes_A_entries[idx];
            probe = M.hashMap(...probe);
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = M.assoc(probe, k, v);
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
  this.immer = function(n, show) {
    return new Promise((resolve) => {
      var IMMER, count, probes_A, probes_B, produce;
      IMMER = require('immer');
      ({produce} = IMMER);
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, len, probe;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = produce(probe, function(probe) {
              return probe;
            });
            probe = produce(probe, function(probe) {
              var k, ref, v;
              ref = probes_B[idx];
              for (k in ref) {
                v = ref[k];
                probe[k] = v;
              }
              return probe;
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
  this.plainjs_mutable = function(n, show) {
    return new Promise((resolve) => {
      var count, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, k, len, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            probe = Object.assign({}, probe);
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe[k] = v;
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
  this.demo_immutable = function() {
    
  const { Map } = require('immutable');
  const map1 = Map({ a: 1, b: 2, c: 3 });
  const map2 = map1.set('b', 50);
  ;
    help(map1.get('b') + " vs. " + map2.get('b'));
    whisper(Object.keys(map1));
    whisper([...map1.keys()]);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_hamt = function() {
    
  var hamt = require('hamt');

  // Keys can be any string and the map can store any value.
  var h = hamt.empty
      .set('key', 'value')
      .set('object', { prop: 1 })
      .set('falsy', null);

  h.size === 0
  h.has('key') === true
  h.has('falsy') === true
  h.get('key') === 'value'

  // Iteration
  for (let [key, value] of h)
      console.log(key, value);

  // Array.from(h.values()) === [{ prop: 1 }, 'value'], null];

  // The data structure is fully immutable
  var h2 = h.delete('key');
  h2.get('key') === undefined
  h.get('key') === 'value'
  ;
    urge('^33387^', h);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_mori = function() {
    var M, d, i, k, n;
    M = require('mori');
    debug(((function() {
      var results;
      results = [];
      for (k in M) {
        results.push(k);
      }
      return results;
    })()).sort());
    debug(M.vector('a', 42));
    d = M.hashMap();
// d = M.mutable.thaw d
    for (n = i = 1; i <= 100; n = ++i) {
      d = M.assoc(d, n, n ** 2);
    }
    // d = M.mutable.freeze d
    d = M.assoc(d, 'helo', 'world');
    urge(d);
    help(M.toClj(d));
    urge(M.toJs(d));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_letsfreezethat_new_api = function() {
    var d1, d2, d3, k, lets;
    lets = require('../../../apps/letsfreezethat');
    d1 = lets({
      first: 1
    }, {
      second: 2
    });
    d2 = lets.set(d1, 'foo', 42);
    d3 = lets.assign(d2, {
      foo: 108,
      bar: 'baz'
    }, {
      gnu: 'gnat'
    });
    urge(Object.isFrozen(d1));
    urge(Object.isFrozen(d2));
    urge(Object.isFrozen(d3));
    help(d1);
    help(d2);
    help(d3);
    urge(d1 === d2);
    urge(lets.get(d1, 'foo'));
    urge(lets.get(d2, 'foo'));
    urge(Object.keys(d2));
    urge((function() {
      var results;
      results = [];
      for (k in d2) {
        results.push(k);
      }
      return results;
    })());
    urge(Object.keys(d3));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_benchmarks = async function() {
    var _, bench, i, j, len, n, ref, ref1, repetitions, show, test_name, test_names;
    bench = BM.new_benchmarks();
    // n           = 100000
    n = 100;
    n = 10;
    n = 1000;
    show = false;
    repetitions = 3;
    test_names = ['immer', 'letsfreezethat_v3_f1_lets', 'letsfreezethat_v3_f0_lets', 'letsfreezethat_v2_f1_lets', 'letsfreezethat_v2_f0_lets', 'letsfreezethat_v3_f1_freezethaw', 'letsfreezethat_v3_f0_freezethaw', 'letsfreezethat_v2_f1_freezethaw', 'letsfreezethat_v2_f0_freezethaw', 'immutable', 'hamt', 'mori', 'plainjs_mutable'];
    if (global.gc != null) {
      global.gc();
    }
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      whisper('-'.repeat(108));
      ref1 = CND.shuffle(test_names);
      for (j = 0, len = ref1.length; j < len; j++) {
        test_name = ref1[j];
        data_cache = null;
        if (global.gc != null) {
          global.gc();
        }
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

 * To Do

* ramda (https://www.skypack.dev/search?q=ramda&p=1)
* rambda (Lightweight and faster alternative to Ramda)
* ramdax

 */
/*

00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f0_freezethaw                  116,513 Hz   100.0 % │████████████▌│
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f1_freezethaw                   97,101 Hz    83.3 % │██████████▍  │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f0_lets                         93,101 Hz    79.9 % │██████████   │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f1_lets                         76,045 Hz    65.3 % │████████▏    │
00:11 HENGIST/BENCHMARKS  ▶  plainjs_mutable                                   28,035 Hz    24.1 % │███          │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f0_lets                         22,410 Hz    19.2 % │██▍          │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f0_freezethaw                   16,854 Hz    14.5 % │█▊           │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f1_freezethaw                   16,443 Hz    14.1 % │█▊           │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f1_lets                         13,648 Hz    11.7 % │█▌           │
00:11 HENGIST/BENCHMARKS  ▶  immutable                                          8,359 Hz     7.2 % │▉            │
00:11 HENGIST/BENCHMARKS  ▶  mori                                               7,845 Hz     6.7 % │▉            │
00:11 HENGIST/BENCHMARKS  ▶  hamt                                               7,449 Hz     6.4 % │▊            │
00:11 HENGIST/BENCHMARKS  ▶  immer                                              4,943 Hz     4.2 % │▌            │

*/

}).call(this);

//# sourceMappingURL=main.benchmarks.js.map