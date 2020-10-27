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
    return data_cache;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_letsfreezethat = function(n, show, sublibrary) {
    return new Promise((resolve) => {
      var LFT, count, lets, probes_A, probes_B;
      LFT = require('../../../apps/letsfreezethat');
      switch (sublibrary) {
        case 'standard':
          ({lets} = LFT);
          break;
        case 'nofreeze':
          ({lets} = LFT.nofreeze);
          break;
        case 'partial':
          ({lets} = LFT.partial);
          break;
        default:
          throw new Error(`^bm/lft@223 unknown sublibrary ${rpr(sublibrary)}`);
      }
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = lets(probe); //, ( probe ) -> null
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = lets(probe, function(probe) {
                // whisper '^556^', k, jr v
                count++;
                probe[k] = v;
                return null;
              });
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              probe = lets(probe, function(probe) {
                count++;
                probe[k] = 1234;
                return null;
              });
            }
          }
          // help '^331^', jr probe
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_immutable = function(n, show) {
    return new Promise((resolve) => {
      var Map, count, probes_A, probes_B;
      ({Map} = require('immutable'));
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = Map(probe);
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = probe.set(k, v);
              count++;
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              probe = probe.set(k, 1234);
              count++;
            }
          }
          // help '^331^', jr probe
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_hamt = function(n, show) {
    return new Promise((resolve) => {
      var count, hamt, probes_A, probes_B;
      hamt = require('hamt');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = hamt.empty;
            for (k in probe) {
              v = probe[k];
              probe = probe.set(k, v);
            }
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = probe.set(k, v);
              count++;
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              probe = probe.set(k, 1234);
              count++;
            }
          }
          // help '^331^', jr probe
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_mori = function(n, show) {
    return new Promise((resolve) => {
      var M, count, probes_A, probes_B;
      M = require('mori');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = M.hashMap();
            for (k in probe) {
              v = probe[k];
              probe = M.assoc(probe, k, v);
            }
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = M.assoc(probe, k, v);
              count++;
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              probe = M.assoc(probe, k, 1234);
              count++;
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_immer = function(n, show) {
    return new Promise((resolve) => {
      var IMMER, count, probes_A, probes_B, produce;
      IMMER = require('immer');
      ({produce} = IMMER);
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = produce(probe, function(probe) {
              return probe;
            });
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              probe = produce(probe, function(probe) {
                count++;
                probe[k] = v;
                return probe;
              });
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              probe = produce(probe, function(probe) {
                count++;
                probe[k] = 1234;
                return probe;
              });
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_plainjs_mutable = function(n, show) {
    return new Promise((resolve) => {
      var count, probes_A, probes_B;
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, ref1, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = {};
            ref = probes_A[idx];
            for (k in ref) {
              v = ref[k];
              probe[k] = v;
            }
            count += keys.length;
            ref1 = probes_B[idx];
            for (k in ref1) {
              v = ref1[k];
              count++;
              probe[k] = v;
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              count++;
              probe[k] = 1234;
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_letsfreezethat_standard = function(n, show) {
    return this.using_letsfreezethat(n, show, 'standard');
  };

  this.using_letsfreezethat_nofreeze = function(n, show) {
    return this.using_letsfreezethat(n, show, 'nofreeze');
  };

  this.using_letsfreezethat_partial = function(n, show) {
    return this.using_letsfreezethat(n, show, 'partial');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_ltfng_single = function(n, show) {
    return new Promise((resolve) => {
      var LFT, count, probes_A, probes_B;
      LFT = require('./letsfreezethat-NG-rc2');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe, ref, v;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            // whisper '^331^', jr probe
            keys = Object.keys(probe);
            probe = LFT.new_object(probes_A);
            count += keys.length;
            ref = probes_B[idx];
            for (k in ref) {
              v = ref[k];
              count++;
              probe = LFT.set(probe, k, v);
            }
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              count++;
              probe = LFT.set(probe, k, 1234);
            }
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_ltfng_assign_lets = function(n, show) {
    return new Promise((resolve) => {
      var LFT, count, lengths, probe_B, probes_A, probes_B;
      LFT = require('./letsfreezethat-NG-rc2');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      lengths = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = probes_B.length; i < len; i++) {
          probe_B = probes_B[i];
          results.push((Object.keys(probe_B)).length);
        }
        return results;
      })();
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, keys, len, probe;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            keys = Object.keys(probe);
            probe = LFT.new_object(probes_A);
            count += keys.length;
            probe = LFT.assign(probe, probes_B[idx]);
            count += lengths[idx];
            probe = LFT.lets(probe, function(probe) {
              var j, k, len1;
              for (j = 0, len1 = keys.length; j < len1; j++) {
                k = keys[j];
                count++;
                probe[k] = 1234;
              }
              return null;
            });
          }
          return resolve(count);
        });
      });
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.using_ltfng_thaw_freeze = function(n, show) {
    return new Promise((resolve) => {
      var LFT, count, lengths, probe_B, probes_A, probes_B;
      LFT = require('./letsfreezethat-NG-rc2');
      count = 0;
      ({probes_A, probes_B} = this.get_data(n));
      lengths = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = probes_B.length; i < len; i++) {
          probe_B = probes_B[i];
          results.push((Object.keys(probe_B)).length);
        }
        return results;
      })();
      resolve(() => {
        return new Promise((resolve) => {
          var i, idx, j, k, keys, len, len1, probe;
          for (idx = i = 0, len = probes_A.length; i < len; idx = ++i) {
            probe = probes_A[idx];
            keys = Object.keys(probe);
            probe = LFT.new_object(probes_A);
            count += keys.length;
            probe = LFT.thaw(probe);
            Object.assign(probe, probes_B[idx]);
            count += lengths[idx];
            for (j = 0, len1 = keys.length; j < len1; j++) {
              k = keys[j];
              count++;
              probe[k] = 1234;
            }
            probe = LFT.freeze(probe);
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
    var LFT, d1, d2, d3, k;
    LFT = require('./letsfreezethat-NG-rc2');
    d1 = LFT.new_object({
      first: 1
    }, {
      second: 2
    });
    d2 = LFT.set(d1, 'foo', 42);
    d3 = LFT.assign(d2, {
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
    urge(LFT.get(d1, 'foo'));
    urge(LFT.get(d2, 'foo'));
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
    show = false;
    repetitions = 3;
    test_names = [
      'using_immer',
      'using_letsfreezethat_standard',
      'using_letsfreezethat_nofreeze',
      // 'using_letsfreezethat_partial'
      'using_ltfng_single',
      'using_ltfng_assign_lets',
      'using_ltfng_thaw_freeze',
      'using_immutable',
      'using_hamt',
      'using_mori',
      'using_plainjs_mutable'
    ];
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

  // await @demo_letsfreezethat_new_api()
// await @demo_immutable()
// await @demo_hamt()
// await @demo_mori()
// require 'hamt'
/*

 * To Do

* ramda (https://www.skypack.dev/search?q=ramda&p=1)
* rambda (Lightweight and faster alternative to Ramda)
* ramdax

 */
/*

n: 10, count: 143
00:01 HENGIST/BENCHMARKS  ▶  using_plainjs_mutable                            928,465 Hz   100.0 % │████████████▌│
00:01 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_nofreeze                    149,161 Hz    16.1 % │██           │
00:01 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_standard                     36,536 Hz     3.9 % │▌            │
00:01 HENGIST/BENCHMARKS  ▶  using_immutable                                   35,932 Hz     3.9 % │▌            │
00:01 HENGIST/BENCHMARKS  ▶  using_hamt                                        25,408 Hz     2.7 % │▍            │
00:01 HENGIST/BENCHMARKS  ▶  using_mori                                        10,344 Hz     1.1 % │▏            │
00:01 HENGIST/BENCHMARKS  ▶  using_immer                                        9,069 Hz     1.0 % │▏            │
00:01 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_partial                       8,914 Hz     1.0 % │▏            │

n: 100, count: 1313
00:02 HENGIST/BENCHMARKS  ▶  using_plainjs_mutable                          1,623,933 Hz   100.0 % │████████████▌│
00:02 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_nofreeze                    339,169 Hz    20.9 % │██▋          │
00:02 HENGIST/BENCHMARKS  ▶  using_immutable                                  119,138 Hz     7.3 % │▉            │
00:02 HENGIST/BENCHMARKS  ▶  using_hamt                                       111,030 Hz     6.8 % │▉            │
00:02 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_standard                     93,930 Hz     5.8 % │▊            │
00:02 HENGIST/BENCHMARKS  ▶  using_mori                                        29,827 Hz     1.8 % │▎            │
00:02 HENGIST/BENCHMARKS  ▶  using_immer                                       16,342 Hz     1.0 % │▏            │
00:02 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_partial                      15,471 Hz     1.0 % │▏            │

n: 10'000, count: 134'491
00:43 HENGIST/BENCHMARKS  ▶  using_plainjs_mutable                            547,914 Hz   100.0 % │████████████▌│
00:43 HENGIST/BENCHMARKS  ▶  using_immutable                                  328,788 Hz    60.0 % │███████▌     │
00:43 HENGIST/BENCHMARKS  ▶  using_hamt                                       277,877 Hz    50.7 % │██████▍      │
00:43 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_nofreeze                    272,873 Hz    49.8 % │██████▎      │
00:43 HENGIST/BENCHMARKS  ▶  using_mori                                       108,792 Hz    19.9 % │██▌          │
00:43 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_standard                     65,763 Hz    12.0 % │█▌           │
00:43 HENGIST/BENCHMARKS  ▶  using_immer                                       18,940 Hz     3.5 % │▍            │
00:43 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_partial                      14,840 Hz     2.7 % │▍            │

n: 100'000, count: 1'349'766
07:13 HENGIST/BENCHMARKS  ▶  using_plainjs_mutable                            499,935 Hz   100.0 % │████████████▌│
07:13 HENGIST/BENCHMARKS  ▶  using_immutable                                  444,554 Hz    88.9 % │███████████▏ │
07:13 HENGIST/BENCHMARKS  ▶  using_hamt                                       356,847 Hz    71.4 % │████████▉    │
07:13 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_nofreeze                    195,966 Hz    39.2 % │████▉        │
07:13 HENGIST/BENCHMARKS  ▶  using_mori                                       128,844 Hz    25.8 % │███▎         │
07:13 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_standard                     59,905 Hz    12.0 % │█▌           │
07:13 HENGIST/BENCHMARKS  ▶  using_immer                                       18,180 Hz     3.6 % │▌            │
07:13 HENGIST/BENCHMARKS  ▶  using_letsfreezethat_partial                      14,707 Hz     2.9 % │▍            │

*/

}).call(this);

//# sourceMappingURL=main.benchmarks.js.map