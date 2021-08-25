(function() {
  'use strict';
  var CND, badge, debug, echo, help, hollerith_path, info, inspect, jr, rpr, test, test_basics, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DATOM/TESTS/VNR';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  // #...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = types
  //...........................................................................................................
  ({inspect} = require('util'));

  rpr = function(...P) {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(inspect(x, {
          depth: 2e308,
          maxArrayLength: 2e308,
          breakLength: 2e308,
          compact: true
        }));
      }
      return results;
    })()).join(' ');
  };

  hollerith_path = '../../../apps/hollerith';

  //-----------------------------------------------------------------------------------------------------------
  test_basics = function(T, VNR) {
    var d;
    T.eq((d = VNR.create()), [0]);
    T.eq((d = VNR.create([4, 6, 5])), [4, 6, 5]);
    T.eq((d = VNR.deepen(d)), [4, 6, 5, 0]);
    T.eq((d = VNR.deepen(d, 42)), [4, 6, 5, 0, 42]);
    T.eq((d = VNR.advance(d)), [4, 6, 5, 0, 43]);
    T.eq((d = VNR.recede(d)), [4, 6, 5, 0, 42]);
    T.ok((VNR.create(d)) !== d);
    T.ok((VNR.deepen(d)) !== d);
    T.ok((VNR.advance(d)) !== d);
    T.ok((VNR.recede(d)) !== d);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR basics"] = function(T, done) {
    var Hollerith;
    ({Hollerith} = require(hollerith_path));
    test_basics(T, new Hollerith({
      validate: true
    }));
    test_basics(T, new Hollerith({
      validate: false
    }));
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR sort 2"] = async function(T, done) {
    var HLR, i, len, matcher, matchers, probe;
    matchers = [[[1, 0, -1], [1], [1, 0], [1, 0, 1], [2, -1], [2], [2, 0], [2, 1]], [[2], [2, 0]], [[2e308, -1], [2e308], [2e308, 1]], [[2e308, -1], [2e308, 0], [2e308, 1]], [[1]], [[1], [2]]];
    HLR = (require(hollerith_path)).HOLLERITH;
    for (i = 0, len = matchers.length; i < len; i++) {
      matcher = matchers[i];
      probe = [...matcher];
      await T.perform(probe, matcher, null, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = HLR.sort(probe);
          T.ok(probe !== matcher);
          T.ok(probe !== result);
          T.eq(result, matcher);
          // debug '^334^', rpr result
          return resolve(result);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR sort 3"] = function(T, done) {
    var HLR;
    HLR = (require(hollerith_path)).HOLLERITH;
    // info CND.blue   'cmp_total    ', "[ 1, ],     [ 1, -1, ]", VNR.cmp_total   [ 1, ],     [ 1, -1, ]
    // info CND.blue   'cmp_total    ', "[ 1, ],     [ 1,  0, ]", VNR.cmp_total   [ 1, ],     [ 1,  0, ]
    // info CND.blue   'cmp_total    ', "[ 1, ],     [ 1, +1, ]", VNR.cmp_total   [ 1, ],     [ 1, +1, ]
    // info CND.blue   'cmp_total    ', "----------------------"
    // info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1, -1, ]", VNR.cmp_total   [ 1, 0, ],  [ 1, -1, ]
    // info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1,  0, ]", VNR.cmp_total   [ 1, 0, ],  [ 1,  0, ]
    // info CND.blue   'cmp_total    ', "[ 1, 0, ],  [ 1, +1, ]", VNR.cmp_total   [ 1, 0, ],  [ 1, +1, ]
    // info()
    // info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1, -1, ]", VNR.cmp_partial [ 1, ],     [ 1, -1, ]
    // info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1,  0, ]", VNR.cmp_partial [ 1, ],     [ 1,  0, ]
    // info CND.lime   'cmp_partial  ', "[ 1, ],     [ 1, +1, ]", VNR.cmp_partial [ 1, ],     [ 1, +1, ]
    // info CND.lime   'cmp_partial  ', "----------------------"
    // info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1, -1, ]", VNR.cmp_partial [ 1, 0, ],  [ 1, -1, ]
    // info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1,  0, ]", VNR.cmp_partial [ 1, 0, ],  [ 1,  0, ]
    // info CND.lime   'cmp_partial  ', "[ 1, 0, ],  [ 1, +1, ]", VNR.cmp_partial [ 1, 0, ],  [ 1, +1, ]
    // info()
    info(CND.steel('cmp_fair     ', "[ 1, ],     [ 1, -1, ]", HLR.cmp([1], [1, -1])));
    info(CND.steel('cmp_fair     ', "[ 1, ],     [ 1,  0, ]", HLR.cmp([1], [1, 0])));
    info(CND.steel('cmp_fair     ', "[ 1, ],     [ 1, +1, ]", HLR.cmp([1], [1, +1])));
    info(CND.steel('cmp_fair     ', "----------------------"));
    info(CND.steel('cmp_fair     ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp([1, 0], [1, -1])));
    info(CND.steel('cmp_fair     ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp([1, 0], [1, 0])));
    info(CND.steel('cmp_fair     ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp([1, 0], [1, +1])));
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["test for stable sort 2"] = function(T, done) {
    var ds, i, is_stable, len, m, n, nr, prv_nr, prv_r, r;
    n = 1e4;
    m = Math.floor(n / 3);
    ds = (function() {
      var i, ref, results;
      results = [];
      for (nr = i = 1, ref = n; (1 <= ref ? i <= ref : i >= ref); nr = 1 <= ref ? ++i : --i) {
        results.push([nr, CND.random_integer(-m, +m)]);
      }
      return results;
    })();
    ds.sort(function(a, b) {
      return a[1] - b[1];
    });
    prv_r = -2e308;
    prv_nr = -2e308;
    is_stable = true;
    for (i = 0, len = ds.length; i < len; i++) {
      [nr, r] = ds[i];
      if (r === prv_r) {
        is_stable = is_stable && nr > prv_nr;
      }
      prv_r = r;
      prv_nr = nr;
    }
    T.ok(is_stable);
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR._first_nonzero_is_negative()"] = async function(T, done) {
    var HLR, error, i, len, matcher, probe, probes_and_matchers;
    HLR = (require(hollerith_path)).HOLLERITH;
    //.........................................................................................................
    probes_and_matchers = [[[[3, 4, 0, 0], 2], false], [[[3, 4, 0, -1], 2], true], [[[3, 4, 0, -1, 0, 0], 2], true], [[[3, 4, 0, 1, -1, 0, 0], 2], false], [[[3, 4, 0, 1, -1, 0, 0], 0], false], [[[3, 4, 0, 0], 3], false], [[[3, 4, 0, 0], 4], false]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var first_idx, list;
          [list, first_idx] = probe;
          return resolve(HLR._first_nonzero_is_negative(list, first_idx));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR class and instance attributes"] = function(T, done) {
    var C, HLR, Hollerith, defaults;
    Hollerith = (require(hollerith_path)).Hollerith;
    HLR = (require(hollerith_path)).HOLLERITH;
    debug(Hollerith.cfg);
    debug(HLR.cfg);
    debug(Hollerith.C);
    C = {...Hollerith.C};
    defaults = Hollerith.C.defaults;
    delete C.defaults;
    if (T != null) {
      T.eq(C, {
        sign_delta: 2147483648,
        u32_width: 4,
        nr_min: -2147483648,
        nr_max: 2147483647
      });
    }
    if (T != null) {
      T.eq(defaults, {
        hlr_constructor_cfg: {
          vnr_width: 5,
          validate: true
        }
      });
    }
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "HLR._first_nonzero_is_negative()" ]
// test @[ "HLR class and instance attributes" ]
// test @[ "HLR basics" ]
// test @[ "HLR sort 2" ]
// test @[ "HLR sort 3" ]
// test @[ "test for stable sort 2" ]

}).call(this);

//# sourceMappingURL=main.tests.js.map