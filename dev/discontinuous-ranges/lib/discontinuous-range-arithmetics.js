(function() {
  'use strict';
  var Arange, CND, DRange, LFT, PATH, Segment, Urange, alert, badge, cast, debug, declare, echo, freeze, help, hex, info, isa, log, merge_ranges, rpr, type_of, urge, validate, warn, whisper;

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

  //...........................................................................................................
  this.types = new (require('intertype')).Intertype();

  ({isa, validate, declare, cast, type_of} = this.types.export());

  LFT = require('letsfreezethat');

  // { lets
  //   freeze }                = LFT
  freeze = Object.freeze;

  //===========================================================================================================
  // TYPES
  //-----------------------------------------------------------------------------------------------------------
  declare('urange_instance', function(x) {
    return x instanceof Urange;
  });

  declare('arange_instance', function(x) {
    return x instanceof Arange;
  });

  //-----------------------------------------------------------------------------------------------------------
  declare('urange_segment', {
    tests: {
      "must be a list": function(x) {
        return this.isa.list(x);
      },
      "length must be 2": function(x) {
        return x.length === 2;
      },
      "lo boundary must be an infnumber": function(x) {
        return isa.infnumber(x[0]);
      },
      "lo boundary must be an infnumber": function(x) {
        return isa.infnumber(x[1]);
      },
      "lo boundary must be less than or equal to hi boundary": function(x) {
        return x[0] <= x[1];
      }
    }
  });

  //===========================================================================================================
  // OOP
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
        if (isa.urange_instance(p)) {
          this.d.add(p.d);
        } else {
          validate.urange_segment(p);
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
      if (!isa.urange_instance(other)) {
        other = new Urange(other);
      }
      this.d.add(other.d);
      return this;
    }

    //---------------------------------------------------------------------------------------------------------
    difference(other) {
      if (!isa.urange_instance(other)) {
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

  this.Urange = Urange;

  //===========================================================================================================
  // FUN
  //-----------------------------------------------------------------------------------------------------------
  Segment = class Segment extends Array {
    //---------------------------------------------------------------------------------------------------------
    constructor(lohi) {
      if (lohi) {
        validate.urange_segment(lohi);
      }
      super(lohi[0], lohi[1]);
      Object.defineProperty(this, 'size', {
        get: this._size_of
      });
      Object.defineProperty(this, 'lo', {
        get: function() {
          return this[0];
        }
      });
      Object.defineProperty(this, 'hi', {
        get: function() {
          return this[1];
        }
      });
      return freeze(this);
    }

    //---------------------------------------------------------------------------------------------------------
    _size_of() {
      return this[1] - this[0] + 1;
    }

    static from(...P) {
      return new Segment(...P);
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  Arange = class Arange extends Array {
    //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      super(...P);
      Object.defineProperty(this, 'size', {
        get: this._size_of
      });
      Object.defineProperty(this, 'lo', {
        get: function() {
          var ref, ref1;
          return (ref = (ref1 = this.first) != null ? ref1[0] : void 0) != null ? ref : null;
        }
      });
      Object.defineProperty(this, 'hi', {
        get: function() {
          var ref, ref1;
          return (ref = (ref1 = this.last) != null ? ref1[1] : void 0) != null ? ref : null;
        }
      });
      Object.defineProperty(this, 'first', {
        get: function() {
          var ref;
          return (ref = this[0]) != null ? ref : null;
        }
      });
      Object.defineProperty(this, 'last', {
        get: function() {
          var ref;
          return (ref = this[this.length - 1]) != null ? ref : null;
        }
      });
      // return freeze @
      return this;
    }

    //---------------------------------------------------------------------------------------------------------
    _size_of() {
      return this.reduce((function(sum, segment) {
        return sum + segment.size;
      }), 0);
    }

  };

  // @from:    ( P...  ) -> new Arange P...

  // npm install @scotttrinh/number-ranges
  // drange-immutable

  //-----------------------------------------------------------------------------------------------------------
  this.Arange = Arange;

  this.Segment = Segment;

  //-----------------------------------------------------------------------------------------------------------
  this.new_segment = function(lo, hi) {
    return new Segment(lo, hi);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.new_arange = function(...P) {
    var R, j, len, p;
    R = new DRange();
    if (P.length === 1 && isa.generator(P[0])) {
      // R = ( require 'letsfreezethat' ).freeze new DRange()
      P = [...P[0]];
    }
// debug '^675^', P
    for (j = 0, len = P.length; j < len; j++) {
      p = P[j];
      if (!(p instanceof Segment)) {
        validate.urange_segment(p);
      }
      R.add(...p);
    }
    return this._drange_as_arange(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.union = function(me, other) {
    var R, j, len, segment;
    if (!(me instanceof Arange)) {
      me = Arange.from(me);
    }
    if (!(other instanceof Arange)) {
      validate.urange_segment(other);
    }
    R = new DRange();
    for (j = 0, len = me.length; j < len; j++) {
      segment = me[j];
      R = R.add(...segment);
    }
    R = R.add(...other);
    return this._drange_as_arange(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._drange_as_arange = function(drange) {
    var r;
    return freeze(this._sort(Arange.from((function() {
      var j, len, ref, results;
      ref = drange.ranges;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        r = ref[j];
        results.push(new Segment([r.low, r.high]));
      }
      return results;
    })())));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._sort = function(arange) {
    return arange.sort(function(a, b) {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return +1;
      }
      if (a[1] < b[1]) {
        return -1;
      }
      if (a[1] > b[1]) {
        return +1;
      }
      return 0;
    });
  };

  //===========================================================================================================
  // OTHER
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

  this.ranges_from_urange = function(urange) {
    validate.urange_instance(urange);
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

  this.numbers_from_urange = function(urange) {
    validate.urange_instance(urange);
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
  this.demo_subtract_ranges_Urange = function() {
    var blue_rng, red_rng, super_rng;
    super_rng = new Urange([1, 100]);
    blue_rng = new Urange([13, 13], [8, 8], new Urange([60, 80]));
    info(CND.truth(super_rng instanceof Urange), super_rng);
    info(CND.truth(blue_rng instanceof Urange), blue_rng);
    blue_rng = blue_rng.union(new Urange([81, 81]));
    blue_rng = blue_rng.union(new Urange([27, 55]));
    blue_rng = blue_rng.union([27, 55]);
    help('^3332^', this.ranges_from_urange(blue_rng));
    red_rng = new Urange(super_rng);
    red_rng = red_rng.difference(blue_rng);
    help('^556^', this.ranges_from_urange(red_rng));
    help('^556^', red_rng.length);
    return info('^334^', this.numbers_from_urange(red_rng));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_merge_ranges = function() {
    var a, b, ranges;
    ranges = [[10, 20], [15, 30], [30, 32], [42, 42], [88, 99]];
    a = merge_ranges(ranges);
    b = this.ranges_from_urange(new Urange(...ranges));
    info('merging:', a);
    info('merging:', b);
    return validate.true(CND.equals(a, b));
  };

  // #-----------------------------------------------------------------------------------------------------------
  // module.exports = { Urange, }

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      await this.demo_subtract_ranges_DRange();
      await this.demo_subtract_ranges_Urange();
      return (await this.demo_merge_ranges());
    })();
  }

}).call(this);
