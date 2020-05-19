(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/INTERIM-TESTS';

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

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["DRA.new_arange"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[null, null, "must be a list"], [42, null, "must be a list"], [[42], null, "length must be 2"], [[10, 20], [[10, 20]]], [[20, 10], null, "lo boundary must be less than or equal to hi boundary"], [[2e308, 20], null, "lo boundary must be less than or equal to hi boundary"], [[-2e308, 20], [[-2e308, 20]]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.new_arange(probe);
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
  this["DRA.new_segment"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[1, 5]], [1, 5]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.new_segment(...probe);
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
    probes_and_matchers = [[[[1, 5]], [1, 5]], [[[1, 0/0]], null, 'lo boundary must be an infnumber'], [[[1]], null, 'length must be 2'], [[[100, -100]], null, 'lo boundary must be less than or equal to hi boundary']];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var result;
          result = DRA.Segment.from(...probe);
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
  this["union"] = async function(T, done) {
    var DRA, error, i, len, matcher, probe, probes_and_matchers;
    DRA = require('./discontinuous-range-arithmetics');
    probes_and_matchers = [[[[10, 20], [1, 1], [5, 5], [18, 24]], [[1, 1], [5, 5], [10, 24]]], [[[100, 2e308], [80, 90]], [[80, 90], [100, 2e308]]], [[[100, 2e308], [80, 100]], [[80, 2e308]]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var first, j, len1, next_result, result, segment, segments;
          [first, ...segments] = probe;
          result = DRA.new_arange(first);
          T.ok(Object.isFrozen(result));
// debug '^334^', result
          for (j = 0, len1 = segments.length; j < len1; j++) {
            segment = segments[j];
            segment = DRA.new_segment(segment);
            T.eq(segment.lo, segment[0]);
            next_result = DRA.union(result, segment);
            debug('^334^', next_result, next_result.size);
            T.ok(Object.isFrozen(next_result));
            T.ok(next_result instanceof DRA.Arange);
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

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      // debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
      // await @_demo()
      return test(this);
    })();
  }

  // test @[ "API" ]
// test @[ "HTML: parse (1)" ]
// test @[ "HTML: parse (1a)" ]
// test @[ "HTML: parse (dubious)" ]
// test @[ "INDENTATION: parse (1)" ]
// test @[ "HTML: parse (2)" ]
// test @[ "HTML.html_from_datoms (singular tags)" ]
// test @[ "HTML Cupofhtml (1)" ]
// test @[ "HTML Cupofhtml (2)" ]
// test @[ "HTML._parse_compact_tagname" ]

}).call(this);
