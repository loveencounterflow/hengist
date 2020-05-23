(function() {
  'use strict';
  var BM, CND, FSP, PATH, after, alert, assets, assign, badge, cast, debug, defer, echo, help, info, isa, jr, limit_reached, prepare, rpr, timeout, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DISCONTINUOUS-RANGES/BENCHMARKS';

  rpr = CND.rpr;

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  defer = setImmediate;

  //...........................................................................................................
  this.types = new (require('intertype')).Intertype();

  ({isa, validate, cast, type_of} = this.types.export());

  //...........................................................................................................
  BM = require('../../../lib/benchmarks');

  // DATA                      = require '../data-providers'
  //...........................................................................................................
  timeout = 3 * 1000;

  limit_reached = function(t0) {
    return Date.now() - t0 > timeout;
  };

  FSP = (require('fs')).promises;

  PATH = require('path');

  //...........................................................................................................
  assets = {
    ok: false,
    probes: [],
    segment_count: 0
  };

  //-----------------------------------------------------------------------------------------------------------
  prepare = function(n) {
    return new Promise(function(resolve) {
      var first_cid, hi, i, j, last_cid, lo, probe_length_max, probe_length_min, probe_nr, ref, ref1, rnd, segment_nr, segments, Δ_max, Δ_min;
      rnd = CND.random_integer.bind(CND);
      probe_length_min = 1;
      probe_length_max = 100;
      first_cid = 0x0000;
      last_cid = 0x00ff;
      Δ_min = 0x00;
      Δ_max = 0x10;
      if (assets.ok) {
        return resolve();
      }
      for (probe_nr = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); probe_nr = 1 <= ref ? ++i : --i) {
        segments = [];
        for (segment_nr = j = 1, ref1 = rnd(probe_length_min, probe_length_max); (1 <= ref1 ? j <= ref1 : j >= ref1); segment_nr = 1 <= ref1 ? ++j : --j) {
          lo = rnd(first_cid, last_cid);
          hi = lo + rnd(Δ_min, Δ_max);
          if (lo > hi) {
            [lo, hi] = [hi, lo];
          }
          segments.push([lo, hi]);
          assets.segment_count++;
        }
        assets.probes.push(segments);
      }
      assets.ok = true;
      resolve();
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.merge_dra_oop = function(n, show, name) {
    return new Promise(async(resolve) => {
      var DRA;
      DRA = require('./discontinuous-range-arithmetics');
      await prepare(n);
      //.........................................................................................................
      resolve(() => {
        var merge;
        return new Promise(merge = (resolve) => {
          var i, j, len, len1, ref, result, segment, segments, urange;
          ref = assets.probes;
          for (i = 0, len = ref.length; i < len; i++) {
            segments = ref[i];
            urange = new DRA.Urange();
            for (j = 0, len1 = segments.length; j < len1; j++) {
              segment = segments[j];
              urange = urange.union(segment);
            }
            result = urange.as_lists();
            info(CND.grey(segments));
            info(CND.yellow(result));
          }
          resolve(assets.segment_count);
          return null;
        });
      });
      //.........................................................................................................
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.merge_dra_fun = function(n, show, name) {
    return new Promise(async(resolve) => {
      var DRA;
      DRA = require('./discontinuous-range-arithmetics');
      await prepare(n);
      //.........................................................................................................
      resolve(() => {
        var merge;
        return new Promise(merge = (resolve) => {
          var i, j, len, len1, ref, segment, segments, urange;
          ref = assets.probes;
          for (i = 0, len = ref.length; i < len; i++) {
            segments = ref[i];
            urange = DRA.new_range();
            for (j = 0, len1 = segments.length; j < len1; j++) {
              segment = segments[j];
              urange = DRA.union(urange, segment);
            }
            info(CND.grey(segments));
            info(CND.yellow(urange));
          }
          resolve(assets.segment_count);
          return null;
        });
      });
      //.........................................................................................................
      return null;
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.benchmark = async function() {
    var _, bench, i, j, len, n, ref, repetitions, show, test_name, test_names;
    // always_use_fresh_words    = false
    bench = BM.new_benchmarks();
    // n           = 1e6
    n = 10;
    timeout = n / 50e3 * 1000 + (2 * 1000);
    show = false;
    show = n < 21;
    repetitions = 1;
    // await BM.benchmark n, show, @
    test_names = ['merge_dra_oop', 'merge_dra_fun'];
    for (_ = i = 1, ref = repetitions; (1 <= ref ? i <= ref : i >= ref); _ = 1 <= ref ? ++i : --i) {
      CND.shuffle(test_names);
      for (j = 0, len = test_names.length; j < len; j++) {
        test_name = test_names[j];
        await BM.benchmark(bench, n, show, this, test_name);
      }
      echo();
    }
    BM.show_totals(bench);
    return null;
  };

  // commander                          heap-benchmark fontmirror interplot svgttf mingkwai-typesetter
  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // demo_parse()
      await this.benchmark();
      return null;
    })();
  }

}).call(this);
