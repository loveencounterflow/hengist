(function() {
  'use strict';
  var CND, badge, debug, defaults, echo, equals, help, hollerith_path, info, isa, jr, rpr, test, test_basics, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HOLLERITH/TESTS';

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
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, defaults, validate} = types.export());

  hollerith_path = '../../../apps/hollerith';

  //-----------------------------------------------------------------------------------------------------------
  test_basics = function(T, VNR) {
    var d;
    T.eq((d = VNR.new_vnr()), [0]);
    T.eq((d = VNR.new_vnr([4, 6, 5])), [4, 6, 5]);
    T.eq((d = VNR.deepen(d)), [4, 6, 5, 0]);
    T.eq((d = VNR.deepen(d, 42)), [4, 6, 5, 0, 42]);
    T.eq((d = VNR.advance(d)), [4, 6, 5, 0, 43]);
    T.eq((d = VNR.recede(d)), [4, 6, 5, 0, 42]);
    T.ok((VNR.new_vnr(d)) !== d);
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
  this["HLR encode Infinity"] = function(T, done) {
    var HLR, Hollerith;
    Hollerith = (require(hollerith_path)).Hollerith;
    HLR = (require(hollerith_path)).HOLLERITH;
    debug('^28974^', Hollerith.C.u32_nr_max);
    debug('^28974^', Hollerith.C.u32_nr_min);
    debug('^28974^', HLR.encode([+2e308]));
    debug('^28974^', HLR.encode([-2e308]));
    if (T != null) {
      T.eq(HLR._encode_u32([+2e308]), Buffer.from('ffffffff80000000800000008000000080000000', 'hex'));
    }
    if (T != null) {
      T.eq(HLR._encode_u32([-2e308]), Buffer.from('0000000080000000800000008000000080000000', 'hex'));
    }
    if (T != null) {
      T.eq(HLR._encode_bcd([+2e308]), '+zzzz,+...0,+...0,+...0,+...0');
    }
    if (T != null) {
      T.eq(HLR._encode_bcd([-2e308]), '!zzzz,+...0,+...0,+...0,+...0');
    }
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
      await T.perform(probe, true, null, function() {
        return new Promise(function(resolve, reject) {
          var result;
          // probe   = CND.shuffle probe
          result = HLR.sort(probe);
          T.ok(probe !== matcher);
          T.ok(probe !== result);
          T.eq(result, matcher);
          //.....................................................................................................
          // debug '^31312^', ( HLR._encode_u32 p for p in probe )
          // debug '^31312^', ( HLR._encode_u32 m for m in matcher)
          //.....................................................................................................
          // debug '^334^', rpr result
          return resolve(true);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["HLR sort 3"] = async function(T, done) {
    var BCD, HLR, cmp_bcd, compare, i, len, matcher, probe, probes_and_matchers;
    HLR = (require(hollerith_path)).HOLLERITH;
    BCD = new (require(hollerith_path)).Hollerith({
      format: 'bcd'
    });
    //.........................................................................................................
    cmp_bcd = function(a, b) {
      if (a === b) {
        return 0;
      }
      if (a > b) {
        return +1;
      }
      return -1;
    };
    //.........................................................................................................
    info(CND.grey('cmp        ', "----------------------"));
    info(CND.steel('cmp        ', "[ 1, ],     [ 1, -1, ]", HLR.cmp([1], [1, -1])));
    info(CND.steel('cmp        ', "[ 1, ],     [ 1,  0, ]", HLR.cmp([1], [1, 0])));
    info(CND.steel('cmp        ', "[ 1, ],     [ 1, +1, ]", HLR.cmp([1], [1, +1])));
    info(CND.steel('cmp        ', "----------------------"));
    info(CND.steel('cmp        ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp([1, 0], [1, -1])));
    info(CND.steel('cmp        ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp([1, 0], [1, 0])));
    info(CND.steel('cmp        ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp([1, 0], [1, +1])));
    // #.........................................................................................................
    // info CND.grey   'cmp2       ', "----------------------"
    // info CND.steel  'cmp2       ', "[ 1, ],     [ 1, -1, ]", HLR.cmp2   [ 1, ],     [ 1, -1, ]
    // info CND.steel  'cmp2       ', "[ 1, ],     [ 1,  0, ]", HLR.cmp2   [ 1, ],     [ 1,  0, ]
    // info CND.steel  'cmp2       ', "[ 1, ],     [ 1, +1, ]", HLR.cmp2   [ 1, ],     [ 1, +1, ]
    // info CND.steel  'cmp2       ', "----------------------"
    // info CND.steel  'cmp2       ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp2   [ 1, 0, ],  [ 1, -1, ]
    // info CND.steel  'cmp2       ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp2   [ 1, 0, ],  [ 1,  0, ]
    // info CND.steel  'cmp2       ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp2   [ 1, 0, ],  [ 1, +1, ]
    //.........................................................................................................
    info(CND.grey('cmp_blobs  ', "----------------------"));
    info(CND.steel('cmp_blobs  ', "[ 1, ],     [ 1, -1, ]", HLR.cmp(HLR.encode([1]), HLR.encode([1, -1]))));
    info(CND.steel('cmp_blobs  ', "[ 1, ],     [ 1,  0, ]", HLR.cmp(HLR.encode([1]), HLR.encode([1, 0]))));
    info(CND.steel('cmp_blobs  ', "[ 1, ],     [ 1, +1, ]", HLR.cmp(HLR.encode([1]), HLR.encode([1, +1]))));
    info(CND.steel('cmp_blobs  ', "----------------------"));
    info(CND.steel('cmp_blobs  ', "[ 1, 0, ],  [ 1, -1, ]", HLR.cmp(HLR.encode([1, 0]), HLR.encode([1, -1]))));
    info(CND.steel('cmp_blobs  ', "[ 1, 0, ],  [ 1,  0, ]", HLR.cmp(HLR.encode([1, 0]), HLR.encode([1, 0]))));
    info(CND.steel('cmp_blobs  ', "[ 1, 0, ],  [ 1, +1, ]", HLR.cmp(HLR.encode([1, 0]), HLR.encode([1, +1]))));
    //.........................................................................................................
    info(CND.grey('cmp bcd    ', "----------------------"));
    info(CND.steel('cmp bcd    ', "[ 1, ],     [ 1, -1, ]", cmp_bcd(BCD.encode([1]), BCD.encode([1, -1]))));
    info(CND.steel('cmp bcd    ', "[ 1, ],     [ 1,  0, ]", cmp_bcd(BCD.encode([1]), BCD.encode([1, 0]))));
    info(CND.steel('cmp bcd    ', "[ 1, ],     [ 1, +1, ]", cmp_bcd(BCD.encode([1]), BCD.encode([1, +1]))));
    info(CND.steel('cmp bcd    ', "----------------------"));
    info(CND.steel('cmp bcd    ', "[ 1, 0, ],  [ 1, -1, ]", cmp_bcd(BCD.encode([1, 0]), BCD.encode([1, -1]))));
    info(CND.steel('cmp bcd    ', "[ 1, 0, ],  [ 1,  0, ]", cmp_bcd(BCD.encode([1, 0]), BCD.encode([1, 0]))));
    info(CND.steel('cmp bcd    ', "[ 1, 0, ],  [ 1, +1, ]", cmp_bcd(BCD.encode([1, 0]), BCD.encode([1, +1]))));
    //.........................................................................................................
    probes_and_matchers = [[[[1], [1, -1]], +1], [[[1], [1, 0]], 0], [[[1], [1, +1]], -1], [[[1, 0], [1, -1]], +1], [[[1, 0], [1, 0]], 0], [[[1, 0], [1, +1]], -1]];
    //.........................................................................................................
    compare = function(description, a, b, a_blob, b_blob, r1, r2) {
      if (equals(r1, r2)) {
        return null;
      }
      warn("^34234^ when comparing");
      warn(description);
      warn("using");
      warn(a);
      warn(b);
      warn(a_blob);
      warn(b_blob);
      warn("r1", r1);
      warn("r1", r2);
      warn("didn't test equal");
      return T != null ? T.fail("comparison failed") : void 0;
    };
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      await T.perform(probe, matcher, null, function() {
        return new Promise(function(resolve, reject) {
          var a, a_blob, b, b_blob, result_1, result_1r, result_2, result_2r;
          [a, b] = probe;
          a_blob = HLR.encode(a);
          b_blob = HLR.encode(b);
          result_1 = HLR.cmp(a, b);
          result_1r = HLR.cmp(b, a);
          result_2 = HLR.cmp_blobs(a_blob, b_blob);
          result_2r = HLR.cmp_blobs(b_blob, a_blob);
          compare("result_1,  -result_1r", a, b, a_blob, b_blob, result_1, -result_1r);
          compare("result_2,  -result_2r", a, b, a_blob, b_blob, result_2, -result_2r);
          compare("result_1,   result_2 ", a, b, a_blob, b_blob, result_1, result_2);
          compare("result_1r,  result_2r", a, b, a_blob, b_blob, result_1r, result_2r);
          // T.eq result, matcher
          // debug '^334^', { a, b, result_1, result_1r, result_2, result_2r, }
          return resolve(result_1);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["test for stable sort"] = function(T, done) {
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
  this["HLR class and instance attributes"] = function(T, done) {
    var C, HLR, Hollerith;
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
        u32_sign_delta: 2147483648,
        u32_width: 4,
        u32_nr_min: -2147483648,
        u32_nr_max: 2147483647,
        bcd_dpe: 4,
        bcd_base: 36,
        bcd_plus: '+',
        bcd_minus: '!',
        bcd_padder: '.',
        bcd_nr_max: 1679615,
        bcd_nr_min: -1679615
      });
    }
    if (T != null) {
      T.eq(defaults, {
        hlr_constructor_cfg: {
          vnr_width: 5,
          validate: false,
          format: 'u32'
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

  // test @[ "HLR encode Infinity" ]
// test @[ "HLR class and instance attributes" ]
// test @[ "HLR basics" ]
// test @[ "HLR sort 2" ]
// test @[ "HLR sort 3" ]
// test @[ "test for stable sort 2" ]

}).call(this);

//# sourceMappingURL=main.tests.js.map