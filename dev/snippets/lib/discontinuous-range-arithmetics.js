(function() {
  'use strict';
  var CND, DRange, PATH, Urange, alert, badge, debug, declare, echo, help, hex, info, isa, log, merge_ranges, rpr, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'DISCONTINUOUS-RANGE-ARITHMETICS';

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

  //...........................................................................................................
  PATH = require('path');

  hex = function(n) {
    return (n.toString(16)).toUpperCase().padStart(4, '0');
  };

  DRange = require('drange');

  merge_ranges = require('merge-ranges');

  types = require('./types');

  ({isa, validate, declare} = types);

  //-----------------------------------------------------------------------------------------------------------
  declare('orange_instance', function(x) {
    return x instanceof Urange;
  });

  //-----------------------------------------------------------------------------------------------------------
  declare('orange_birange', function(x) {
    return (this.isa.list(x)) && (x.length === 2) && (isa.number(x[0])) && (isa.number(x[1]));
  });

  //-----------------------------------------------------------------------------------------------------------
  Urange = class Urange {
    /* TAINT add type checking to avoid silent failure of e.g. `new DRange [ 1, 3, ]` */
    //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      var j, len, p;
      this.d = new DRange();
// @d = ( require 'letsfreezethat' ).freeze new DRange()
      for (j = 0, len = P.length; j < len; j++) {
        p = P[j];
        if (isa.orange_instance(p)) {
          this.d.add(p.d);
        } else {
          validate.orange_birange(p);
          this.d.add(...p);
        }
      }
      Object.defineProperty(this, 'length', {
        get: function() {
          return this.d.length;
        }
      });
      return this;
    }

    //---------------------------------------------------------------------------------------------------------
    union(other) {
      if (!isa.orange_instance(other)) {
        other = new Urange(other);
      }
      this.d.add(other.d);
      return this;
    }

    //---------------------------------------------------------------------------------------------------------
    difference(other) {
      if (!isa.orange_instance(other)) {
        other = new Urange(other);
      }
      this.d.subtract(other.d);
      return this;
    }

    //---------------------------------------------------------------------------------------------------------
    as_lists() {
      var j, len, r, ref, results;
      ref = this.d.ranges;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push([r.low, r.high]);
      }
      return results;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.ranges_from_drange = function(drange) {
    var j, len, r, ref, results;
    ref = drange.ranges;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      r = ref[j];
      results.push([r.low, r.high]);
    }
    return results;
  };

  this.ranges_from_orange = function(urange) {
    validate.orange_instance(urange);
    return this.ranges_from_drange(urange.d);
  };

  this.numbers_from_drange = function(drange) {
    var i, j, ref, results;
    results = [];
    for (i = j = 0, ref = drange.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      results.push(drange.index(i));
    }
    return results;
  };

  this.numbers_from_orange = function(urange) {
    validate.orange_instance(urange);
    return this.numbers_from_drange(urange.d);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_subtract_ranges_DRange = function() {
    var blue_rng, red_rng, super_rng;
    super_rng = new DRange(1, 100);
    blue_rng = new DRange(13);
    blue_rng = blue_rng.add(8);
    blue_rng = blue_rng.add(60, 80); // [8, 13, 60-80]
    blue_rng = blue_rng.add(81);
    blue_rng = blue_rng.add(new DRange(27, 55));
    help('^3332^', this.ranges_from_drange(blue_rng));
    red_rng = super_rng.clone().subtract(blue_rng);
    help('^556^', this.ranges_from_drange(red_rng));
    help('^556^', red_rng.length);
    return info('^334^', this.numbers_from_drange(red_rng));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_subtract_ranges_Orange = function() {
    var blue_rng, red_rng, super_rng;
    super_rng = new Urange([1, 100]);
    blue_rng = new Urange([13, 13], [8, 8], new Urange([60, 80]));
    info(CND.truth(super_rng instanceof Urange), super_rng);
    info(CND.truth(blue_rng instanceof Urange), blue_rng);
    blue_rng = blue_rng.union(new Urange([81, 81]));
    blue_rng = blue_rng.union(new Urange([27, 55]));
    blue_rng = blue_rng.union([27, 55]);
    help('^3332^', this.ranges_from_orange(blue_rng));
    red_rng = new Urange(super_rng);
    red_rng = red_rng.difference(blue_rng);
    help('^556^', this.ranges_from_orange(red_rng));
    help('^556^', red_rng.length);
    return info('^334^', this.numbers_from_orange(red_rng));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_merge_ranges = function() {
    var a, b, ranges;
    ranges = [[10, 20], [15, 30], [30, 32], [42, 42], [88, 99]];
    a = merge_ranges(ranges);
    b = this.ranges_from_orange(new Urange(...ranges));
    info('merging:', a);
    info('merging:', b);
    return validate.true(CND.equals(a, b));
  };

  //-----------------------------------------------------------------------------------------------------------
  module.exports = {Urange};

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var u;
      await this.demo_subtract_ranges_DRange();
      await this.demo_subtract_ranges_Orange();
      await this.demo_merge_ranges();
      // debug new DRange()
      u = new Urange();
      debug('^334^', Urange.xxx);
      return debug('^334^', u.xxx);
    })();
  }

}).call(this);
