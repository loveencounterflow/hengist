(function() {
  'use strict';
  var CND, alert, badge, debug, demo_1, demo_equality_between_custom_and_basic_values, demo_merge_ranges, demo_subtract_ranges_DRange, echo, equals, freeze, help, id_of, info, isa, jr, log, rpr, test, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'InterLap/tests';

  rpr = CND.rpr;

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('intertype')).Intertype();

  ({equals, isa, type_of} = types.export());

  ({freeze} = require('letsfreezethat'));

  //===========================================================================================================
  // VALUE IDs
  //-----------------------------------------------------------------------------------------------------------
  id_of = (() => {
    /* TAINT ideally, should use WeakMap, but won't work with primitive values */
    /* NOTE could use sha1sum for strings, value itself for other primitives? use string rather than number? */
    var _last_id, ids;
    ids = new Map();
    _last_id = 0;
    return function(x) {
      var R;
      if ((R = ids.get(x))) {
        return R;
      }
      _last_id++;
      ids.set(x, _last_id);
      return _last_id;
    };
  })();

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["new LAP.Interlap"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [
      [null,
      null,
      "unable to instantiate from a null"],
      [42,
      null,
      "unable to instantiate from a float"],
      [[42],
      null,
      "must be a list"],
      [[[42]],
      null,
      "length must be 2"],
      [[[20,
      10]],
      null,
      "lo boundary must be less than or equal to hi boundary"],
      [[[2e308,
      20]],
      null,
      "lo boundary must be less than or equal to hi boundary"],
      [
        (function*() {
          var j,
        len,
        ref,
        results,
        x;
          ref = [[5, 6], [7, 8]];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            x = ref[j];
            results.push((yield x));
          }
          return results;
        })(),
        null,
        "unable to instantiate from a generator"
      ],
      [[[-2e308,
      20]],
      [[-2e308,
      20]]],
      [[],
      []],
      [[[10,
      20]],
      [[10,
      20]]]
    ];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = new LAP.Interlap(probe);
          T.ok(Object.isFrozen(result));
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["new LAP.Interlap 2"] = function(T, done) {
    var Interlap, L, LAP, Segment;
    LAP = require('../../../apps/interlap');
    L = LAP.export().as_list;
    ({Segment, Interlap} = LAP.export());
    (() => {
      var result;
      result = new Interlap();
      T.ok(Object.isFrozen(result));
      return T.eq(L(result), []);
    })();
    (() => {
      var result;
      result = new Interlap(new Segment([13, 13]));
      T.ok(Object.isFrozen(result));
      return T.eq(L(result), [[13, 13]]);
    })();
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.interlap_from_segments"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [
      [null,
      null,
      "must be a list"],
      [42,
      null,
      "must be a list"],
      [[42],
      null,
      "length must be 2"],
      [[10,
      20],
      [[10,
      20]]],
      [[20,
      10],
      null,
      "lo boundary must be less than or equal to hi boundary"],
      [[2e308,
      20],
      null,
      "lo boundary must be less than or equal to hi boundary"],
      [[-2e308,
      20],
      [[-2e308,
      20]]],
      [
        (function*() {
          var j,
        len,
        ref,
        results,
        x;
          ref = [[5, 6], [7, 8]];
          results = [];
          for (j = 0, len = ref.length; j < len; j++) {
            x = ref[j];
            results.push((yield x));
          }
          return results;
        })(),
        [[5,
        8]]
      ]
    ];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = LAP.interlap_from_segments(probe);
          T.ok(Object.isFrozen(result));
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.Interlap properties"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [
      [
        [[10,
        20],
        [8,
        12],
        [25,
        30]],
        [
          [[8,
          20],
          [25,
          30]],
          {
            first: [8,
          20],
            last: [25,
          30],
            size: 19,
            lo: 8,
            hi: 30
          }
        ],
        null
      ],
      [
        [[-2e308,
        20]],
        [
          [[-2e308,
          20]],
          {
            first: [-2e308,
          20],
            last: [-2e308,
          20],
            size: 2e308,
            lo: -2e308,
            hi: 20
          }
        ],
        null
      ]
    ];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, hi, last, lo, range, size;
          range = LAP.interlap_from_segments(...probe);
          ({first, last, size, lo, hi} = range);
          T.ok(Object.isFrozen(range));
          T.ok(Object.isFrozen(range.first));
          T.ok(Object.isFrozen(range.last));
          // range.push "won't work"
          return resolve([range, {first, last, size, lo, hi}]);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.new_segment"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[[[1, 5]], [1, 5]]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = new LAP.Segment(...probe);
          T.ok(Object.isFrozen(result));
          T.ok(result instanceof LAP.Segment);
          T.eq(result.lo, result[0]);
          T.eq(result.hi, result[1]);
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.Segment.from"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[null, null, "not implemented"]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = LAP.Segment.from(probe);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.segment_from_lohi"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[[1, 5], [1, 5]], [[1, 0/0], null, 'hi boundary must be an infnumber'], [[1], null, 'length must be 2'], [[100, -100], null, 'lo boundary must be less than or equal to hi boundary']];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = LAP.segment_from_lohi(...probe);
          T.ok(Object.isFrozen(result));
          T.ok(result instanceof LAP.Segment);
          T.eq(result.lo, result[0]);
          T.eq(result.hi, result[1]);
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["LAP.Interlap.from"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[null, null, "not implemented"]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = LAP.Interlap.from(probe);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["union with single segment"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[[[10, 20], [1, 1]], [[1, 1], [10, 20]]], [[[10, 20], [1, 1], [5, 5], [18, 24]], [[1, 1], [5, 5], [10, 24]]], [[[100, 2e308], [80, 90]], [[80, 90], [100, 2e308]]], [[[100, 2e308], [80, 100]], [[80, 2e308]]]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, hi, l, len1, lo, next_result, result, segment, segments;
          [first, ...segments] = probe;
          result = LAP.interlap_from_segments(first);
          T.ok(Object.isFrozen(result));
          for (l = 0, len1 = segments.length; l < len1; l++) {
            segment = segments[l];
            [lo, hi] = segment;
            segment = LAP.segment_from_lohi(lo, hi);
            T.eq(segment.lo, segment[0]);
            next_result = LAP.union(result, segment);
            T.ok(Object.isFrozen(next_result));
            T.ok(next_result instanceof LAP.Interlap);
            T.ok(!equals(result, next_result));
            result = next_result;
          }
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["union with multiple segments"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[[[], [[1, 1], [-3, -1]]], [[-3, -1], [1, 1]]], [[[], [[1, 1], [-3, 3]]], [[-3, 3]]]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, result, segments;
          [first, segments] = probe;
          result = new LAP.Interlap(first);
          result = LAP.union(result, ...segments);
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["union with Interlap"] = async function(T, done) {
    var LAP, error, j, len, matcher, probe, probes_and_matchers;
    LAP = require('../../../apps/interlap');
    probes_and_matchers = [[[[], [[1, 1], [-3, -1]]], [[-3, -1], [1, 1]]], [[[], [[1, 1], [-3, 3]]], [[-3, 3]]]];
    for (j = 0, len = probes_and_matchers.length; j < len; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, range, ranges, result;
          [first, ranges] = probe;
          result = new LAP.Interlap(first);
          ranges = (function() {
            var l, len1, results;
            results = [];
            for (l = 0, len1 = ranges.length; l < len1; l++) {
              range = ranges[l];
              results.push(new LAP.Interlap([range]));
            }
            return results;
          })();
          result = LAP.union(result, ...ranges);
          return resolve(LAP.as_list(result));
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Interlap differences"] = function(T, done) {
    var Interlap, L, LAP, d1, d2, d3, id_of_d1, id_of_d2, id_of_d3, p1, p2, p3, test_invariance;
    LAP = require('../../../apps/interlap');
    ({Interlap} = LAP);
    L = LAP.export().as_list;
    //.........................................................................................................
    p1 = freeze([[10, 100]]);
    p2 = freeze([[20, 50]]);
    p3 = freeze([[80, 120]]);
    d1 = new Interlap(p1);
    d2 = new Interlap(p2);
    d3 = new Interlap(p3);
    id_of_d1 = id_of(d1);
    id_of_d2 = id_of(d2);
    id_of_d3 = id_of(d3);
    //.........................................................................................................
    test_invariance = function() {
      T.eq(id_of(d1), id_of_d1);
      T.eq(id_of(d2), id_of_d2);
      T.eq(id_of(d3), id_of_d3);
      T.eq(L(d1), p1);
      T.eq(L(d2), p2);
      return T.eq(L(d3), p3);
    };
    //.........................................................................................................
    info(`${L(d1)} without ${L(d2)}`, L(LAP.difference(d1, d2)));
    test_invariance();
    info(`${L(d2)} without ${L(d1)}`, L(LAP.difference(d2, d1)));
    test_invariance();
    info(`${L(d1)} without ${L(d3)}`, L(LAP.difference(d1, d3)));
    test_invariance();
    info(`${L(d3)} without ${L(d1)}`, L(LAP.difference(d3, d1)));
    test_invariance();
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["InterLap: DRange example converted"] = function(T, done) {
    /* const DRange = require('drange');
         let allNums = new DRange(1, 100);                       // [ 1-100 ]
         let badNums = DRange(13).add(8).add(60,80);             // [8, 13, 60-80]
         let goodNums = allNums.clone().subtract(badNums);
         console.log(goodNums.toString());                       // [ 1-7, 9-12, 14-59, 81-100 ]
         let randomGoodNum = goodNums.index(Math.floor(Math.random() * goodNums.length)); */
    var Interlap, L, LAP, Segment, allNums, allNums_id, allNums_list, badNums, badNums_id, badNums_list, difference, error, goodNums, goodNums_list, union;
    LAP = require('../../../apps/interlap');
    L = LAP.export().as_list;
    ({Interlap, Segment, union, difference} = LAP.export());
    allNums = new Interlap([[1, 100]]);
    allNums_id = id_of(allNums);
    badNums = new Interlap([[13, 13]]);
    badNums_id = id_of(badNums);
    badNums = new Interlap(new Segment([13, 13]));
    T.ok(!equals(id_of(badNums), badNums_id));
    badNums = union(badNums, new Segment([8, 8]));
    badNums = union(badNums, new Segment([60, 80]));
    goodNums = difference(allNums, badNums);
    T.eq(id_of(allNums), allNums_id);
    T.eq(L(allNums), [[1, 100]]);
    T.eq(L(goodNums), [[1, 7], [9, 12], [14, 59], [81, 100]]);
    info(L(allNums));
    urge((allNums_list = LAP.as_numbers(allNums)));
    info(L(badNums));
    urge((badNums_list = LAP.as_numbers(badNums)));
    info(L(goodNums));
    urge((goodNums_list = LAP.as_numbers(goodNums)));
    T.eq(allNums_list, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
    T.eq(badNums_list, [8, 13, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80]);
    T.eq(goodNums_list, [1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]);
    info(LAP.includes(goodNums, 3));
    try {
      info(LAP.includes(goodNums, [1, 7]));
    } catch (error1) {
      error = error1;
      T.ok(/got a list/.test(error.message));
    }
    T.ok(error != null);
    /* ensure error was thrown */    T.ok(LAP.includes(goodNums, new Segment([1, 7])));
    T.ok(LAP.includes(goodNums, new Segment([1, 3])));
    T.ok(LAP.includes(goodNums, new Segment([11, 12])));
    T.ok(!LAP.includes(goodNums, new Segment([11, 13])));
    T.ok(LAP.includes(goodNums, goodNums_list[CND.random_integer(0, goodNums_list.length - 1)]));
    T.ok(LAP.includes(goodNums, goodNums_list[CND.random_integer(0, goodNums_list.length - 1)]));
    T.ok(LAP.includes(goodNums, goodNums_list[CND.random_integer(0, goodNums_list.length - 1)]));
    if (done != null) {
      // info LAP.
      // d1      = new LAP.Interlap d0
      // info LAP.types.cast 'interlap', 'list', d1
      // info LAP.types.cast 'list', 'interlap', d1
      // info LAP.as_list d1
      // info new LAP.Interlap [ [ 4, 6 ], [ 7, 7, ], [ 11, 19, ], ]
      return done();
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this["InterLap: cast to list"] = function(T, done) {
    var LAP, d0, d1;
    LAP = require('../../../apps/interlap');
    d0 = [[110, 115], [112, 120], [300, 310]];
    d1 = new LAP.Interlap(d0);
    info(LAP.types.cast('interlap', 'list', d1));
    info(LAP.types.cast('list', 'interlap', d1));
    info(LAP.as_list(d1));
    info(new LAP.Interlap([[4, 6], [7, 7], [11, 19]]));
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_equality_between_custom_and_basic_values = function() {
    var LAP, d, d0, d1, d1_list;
    LAP = require('../../../apps/interlap');
    d0 = [[110, 115], [112, 120], [300, 310]];
    d1 = new LAP.Interlap(d0);
    d1_list = [[110, 120], [300, 310]];
    info(d0);
    info(d1_list);
    info(d0 === d1);
    info(equals(d0, d1));
    info(equals(d1, d1_list));
    info(d1);
    info([...d1]);
    info((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = d1.length; j < len; j++) {
        d = d1[j];
        results.push([...d]);
      }
      return results;
    })());
    info(equals((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = d1.length; j < len; j++) {
        d = d1[j];
        results.push([...d]);
      }
      return results;
    })(), d1_list));
    info(type_of(d0));
    info(type_of(d1));
    info(type_of(d1_list));
    info(equals(LAP.as_list(d1), d1_list));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var LAP, d0, d1, d2;
    LAP = require('../../../apps/interlap');
    d0 = [[1, 3], [5, 7]];
    info(d1 = new LAP.Interlap(d0));
    info(d2 = LAP.interlap_from_segments(...d0));
    info(equals(d1, d2));
    info(type_of(d1));
    info(equals(d1, d0));
    info(equals(d1.size, d0.size));
    info(d0.size);
    info(d1.size);
    // class Xxxx
    // xxxx = new Xxxx()
    // info CND.type_of           xxxx
    // info types.type_of         xxxx
    // info typeof                xxxx
    // info Object::toString.call xxxx
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_merge_ranges = function() {
    var a, b, merge_ranges, ranges;
    merge_ranges = require('merge-ranges');
    ranges = [[10, 20], [15, 30], [30, 32], [42, 42], [88, 99]];
    a = merge_ranges(ranges);
    b = this.ranges_from_urange(new Urange(...ranges));
    info('merging:', a);
    info('merging:', b);
    return validate.true(CND.equals(a, b));
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_subtract_ranges_DRange = function() {
    var blue_rng, numbers_from_drange, ranges_from_drange, red_rng, super_rng;
    ranges_from_drange = function(drange) {
      var j, len, r, ref, results;
      ref = drange.ranges;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push([r.low, r.high]);
      }
      return results;
    };
    numbers_from_drange = function(drange) {
      var i, j, ref, results;
      results = [];
      for (i = j = 0, ref = drange.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
        results.push(drange.index(i));
      }
      return results;
    };
    super_rng = new DRange(1, 100);
    blue_rng = new DRange(13);
    blue_rng = blue_rng.add(8);
    blue_rng = blue_rng.add(60, 80); // [8, 13, 60-80]
    blue_rng = blue_rng.add(81);
    blue_rng = blue_rng.add(new DRange(27, 55));
    help('^3332^', ranges_from_drange(blue_rng));
    red_rng = super_rng.clone().subtract(blue_rng);
    help('^556^', ranges_from_drange(red_rng));
    help('^556^', red_rng.length);
    return info('^334^', numbers_from_drange(red_rng));
  };

  //-----------------------------------------------------------------------------------------------------------
  this["InterLap: Object methods"] = function(T, done) {
    var CAT, Interlap, L, LAP, Segment, d0, d1, difference, k, union;
    LAP = require('../../../apps/interlap');
    L = LAP.export().as_list;
    ({Interlap, Segment, union, difference} = LAP.export());
    //.........................................................................................................
    d0 = new Segment([1, 100]);
    d1 = new Interlap([d0, [120, 125]]);
    CAT = require('../../../apps/multimix/lib/cataloguing');
    debug((function() {
      var results;
      results = [];
      for (k in d0) {
        results.push(k);
      }
      return results;
    })());
    debug(CAT.all_keys_of(d0));
    debug(d1.join('*'));
    // debug Array::map.call d1, ( s ) -> "{#{s.lo}|#{s.hi}}"
    // debug d1.filter ( s ) -> false # s.lo < 100
    // debug Array::filter.call d1, ( s ) -> s.lo < 100
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_1()
      // demo_equality_between_custom_and_basic_values()
      return test(this);
    })();
  }

  // test @[ "InterLap: Object methods" ]
// @[ "InterLap: Object methods" ]()
// test @[ "InterLap: DRange example converted" ]
// @[ "InterLap: DRange example converted" ]()
// test @[ "Interlap differences" ]
// test @[ "InterLap: cast to list" ]
// test @[ "LAP.interlap_from_segments" ]
// test @[ "LAP.Interlap properties" ]
// test @[ "LAP.new_segment" ]
// test @[ "LAP.Segment.from" ]
// test @[ "LAP.Interlap.from" ]
// test @[ "LAP.segment_from_lohi" ]
// test @[ "union with single segment" ]
// test @[ "new LAP.Interlap" ]
// test @[ "union with multiple segments" ]
// test @[ "union with Interlap" ]

}).call(this);
