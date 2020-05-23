(function() {
  'use strict';
  var CND, alert, badge, debug, demo_1, echo, help, info, jr, log, rpr, test, types, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DISCONTINUOUS-RANGES/TESTS';

  rpr = CND.rpr;

  // types                     = new ( require 'intertype' ).Intertype()
  // console.log rpr types.all_keys_of CND
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

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["new DRA.Interlap"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [
      [null,
      null,
      "unable to instantiate from a null"],
      [42,
      null,
      "unable to instantiate from a number"],
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
          var i,
        len,
        ref,
        results,
        x;
          ref = [[5, 6], [7, 8]];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
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
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = new DRA.Interlap(probe);
          T.ok(Object.isFrozen(result));
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRA.interlap_from_segments"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
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
          var i,
        len,
        ref,
        results,
        x;
          ref = [[5, 6], [7, 8]];
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            x = ref[i];
            results.push((yield x));
          }
          return results;
        })(),
        [[5,
        8]]
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.interlap_from_segments(probe);
          T.ok(Object.isFrozen(result));
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRA.Interlap properties"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
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
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, hi, last, lo, range, size;
          range = DRA.interlap_from_segments(...probe);
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
  this["DRA.new_segment"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[1, 5]], [1, 5]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = new DRA.Segment(...probe);
          T.ok(Object.isFrozen(result));
          T.ok(result instanceof DRA.Segment);
          T.eq(result.lo, result[0]);
          T.eq(result.hi, result[1]);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRA.Segment.from"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[null, null, "not implemented"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.Segment.from(probe);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRA.segment_from_lohi"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[1, 5], [1, 5]], [[1, 0/0], null, 'hi boundary must be an infnumber'], [[1], null, 'length must be 2'], [[100, -100], null, 'lo boundary must be less than or equal to hi boundary']];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.segment_from_lohi(...probe);
          T.ok(Object.isFrozen(result));
          T.ok(result instanceof DRA.Segment);
          T.eq(result.lo, result[0]);
          T.eq(result.hi, result[1]);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRA.Interlap.from"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[null, null, "not implemented"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.Interlap.from(probe);
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
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[10, 20], [1, 1]], [[1, 1], [10, 20]]], [[[10, 20], [1, 1], [5, 5], [18, 24]], [[1, 1], [5, 5], [10, 24]]], [[[100, 2e308], [80, 90]], [[80, 90], [100, 2e308]]], [[[100, 2e308], [80, 100]], [[80, 2e308]]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, hi, j, len1, lo, next_result, result, segment, segments;
          [first, ...segments] = probe;
          result = DRA.interlap_from_segments(first);
          T.ok(Object.isFrozen(result));
          for (j = 0, len1 = segments.length; j < len1; j++) {
            segment = segments[j];
            [lo, hi] = segment;
            segment = DRA.segment_from_lohi(lo, hi);
            T.eq(segment.lo, segment[0]);
            next_result = DRA.union(result, segment);
            T.ok(Object.isFrozen(next_result));
            T.ok(next_result instanceof DRA.Interlap);
            T.ok(!CND.equals(result, next_result));
            result = next_result;
          }
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["union with multiple segments"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[], [[1, 1], [-3, -1]]], [[-3, -1], [1, 1]]], [[[], [[1, 1], [-3, 3]]], [[-3, 3]]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, result, segments;
          [first, segments] = probe;
          result = new DRA.Interlap(first);
          result = DRA.union(result, ...segments);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["union with Interlap"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[], [[1, 1], [-3, -1]]], [[-3, -1], [1, 1]]], [[[], [[1, 1], [-3, 3]]], [[-3, 3]]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, range, ranges, result;
          [first, ranges] = probe;
          result = new DRA.Interlap(first);
          ranges = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = ranges.length; j < len1; j++) {
              range = ranges[j];
              results.push(new DRA.Interlap([range]));
            }
            return results;
          })();
          result = DRA.union(result, ...ranges);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var DRA, d0, d1, d2;
    DRA = require('./discontinuous-range-arithmetics');
    d0 = [[1, 3], [5, 7]];
    info(d1 = new DRA.Interlap(d0));
    info(d2 = DRA.interlap_from_segments(...d0));
    info(CND.equals(d1, d2));
    info(CND.type_of(d1));
    info(types.type_of(d1));
    info(typeof d1);
    info(Object.prototype.toString.call(d1));
    info(CND.equals(d1, d0));
    info(CND.equals(d1.size, d0.size));
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

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_1();
    })();
  }

  // test @
// test @[ "DRA.interlap_from_segments" ]
// test @[ "DRA.Interlap properties" ]
// test @[ "DRA.new_segment" ]
// test @[ "DRA.Segment.from" ]
// test @[ "DRA.Interlap.from" ]
// test @[ "DRA.segment_from_lohi" ]
// test @[ "union with single segment" ]
// test @[ "new DRA.Interlap" ]
// test @[ "union with multiple segments" ]
// test @[ "union with Interlap" ]

}).call(this);
