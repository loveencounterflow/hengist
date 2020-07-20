(function() {
  'use strict';
  var BM, CND, FSP, PATH, after, alert, assets, assign, badge, cast, debug, defer, echo, help, info, isa, jr, limit_reached, rpr, timeout, type_of, urge, validate, warn, whisper;

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

  // #-----------------------------------------------------------------------------------------------------------
// prepare = ( n ) -> new Promise ( resolve ) ->
//   rnd               = CND.random_integer.bind CND
//   probe_length_min  = 1
//   probe_length_max  = 100
//   first_cid         = 0x0000
//   last_cid          = 0x00ff
//   Δ_min             = 0x00
//   Δ_max             = 0x10
//   return resolve() if assets.ok
//   for probe_nr in [ 1 .. n ]
//     segments = []
//     for segment_nr in [ 1 .. ( rnd probe_length_min, probe_length_max ) ]
//       lo          = rnd first_cid, last_cid
//       hi          = lo + rnd Δ_min, Δ_max
//       [ lo, hi, ] = [ hi, lo, ] if lo > hi
//       segments.push [ lo, hi, ]
//       assets.segment_count++
//     assets.probes.push segments
//   assets.ok = true
//   resolve()
//   return null

  // #===========================================================================================================
// #
// #-----------------------------------------------------------------------------------------------------------
// @merge_dra_oop = ( n, show, name ) -> new Promise ( resolve ) =>
//   DRA = require './discontinuous-range-arithmetics'
//   await prepare n
//   #.........................................................................................................
//   resolve => new Promise merge = ( resolve ) =>
//     for segments in assets.probes
//       urange = new DRA.Urange()
//       for segment in segments
//         urange = urange.union segment
//       result = urange.as_lists()
//       info ( CND.grey segments )
//       info ( CND.yellow result )
//     resolve assets.segment_count
//     return null
//   #.........................................................................................................
//   return null

  // #-----------------------------------------------------------------------------------------------------------
// @merge_dra_fun = ( n, show, name ) -> new Promise ( resolve ) =>
//   DRA = require './discontinuous-range-arithmetics'
//   await prepare n
//   #.........................................................................................................
//   resolve => new Promise merge = ( resolve ) =>
//     for segments in assets.probes
//       urange = DRA.new_range()
//       for segment in segments
//         urange = DRA.union urange, segment
//       info ( CND.grey segments )
//       info ( CND.yellow urange )
//     resolve assets.segment_count
//     return null
//   #.........................................................................................................
//   return null

  // #===========================================================================================================
// #
// #-----------------------------------------------------------------------------------------------------------
// @benchmark = ->
//   # always_use_fresh_words    = false
//   bench       = BM.new_benchmarks()
//   # n           = 1e6
//   n           = 10
//   timeout     = n / 50e3 * 1000 + ( 2 * 1000 )
//   show        = false
//   show        = n < 21
//   repetitions = 1
//   # await BM.benchmark n, show, @
//   test_names = [
//     'merge_dra_oop'
//     'merge_dra_fun'
//     ]
//   for _ in [ 1 .. repetitions ]
//     CND.shuffle test_names
//     for test_name in test_names
//       await BM.benchmark bench, n, show, @, test_name
//     echo()
//   BM.show_totals bench
//   return null

  // # commander                          heap-benchmark fontmirror interplot svgttf mingkwai-typesetter
// ############################################################################################################
// if module is require.main then do =>
//   # demo_parse()
//   await @benchmark()
//   return null

}).call(this);

//# sourceMappingURL=main.benchmarks.js.map