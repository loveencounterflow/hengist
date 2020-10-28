(function() {
  'use strict';
  var CND, LFT, Lft, Multimix, alert, assign, badge, debug, deep_copy, deep_freeze, defaults, echo, f0_assign, f0_freeze, f0_lets, f0_set, f0_thaw, f1_assign, f1_freeze, f1_lets, f1_set, f1_thaw, frozen, help, info, log, rpr, shallow_copy, shallow_freeze, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'LFTNG';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  Multimix = require('multimix');

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  frozen = Object.isFrozen;

  assign = Object.assign;

  shallow_freeze = Object.freeze;

  shallow_copy = function(x) {
    return assign((Array.isArray(x) ? [] : {}), x);
  };

  ({
    klona: deep_copy
  } = require('klona/json'));

  //===========================================================================================================
  types.declare('mutable', function(x) {
    return (this.isa.object(x)) || (this.isa.list(x));
  });

  //-----------------------------------------------------------------------------------------------------------
  types.declare('lft_cfg', {
    tests: {
      "x is an object": function(x) {
        return this.isa.object(x);
      },
      "x.freeze is a boolean": function(x) {
        return this.isa.boolean(x.freeze);
      },
      /* NOTE the following restriction is only there to help API transition and will be omitted in the realease version */
      "x.copy must not be used": function(x) {
        return x.copy == null;
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    cfg: {
      freeze: true
    }
  };

  //===========================================================================================================
  deep_freeze = function(d) {
    var k, v;
    if ((!d) || d === true) {
      /* immediately return for zero, empty string, null, undefined, NaN, false, true: */
      return d;
    }
    /* thx to https://github.com/lukeed/klona/blob/master/src/json.js */
    switch (Object.prototype.toString.call(d)) {
      case '[object Array]':
        k = d.length;
        while (k--) {
          if (!(((v = d[k]) != null) && ((typeof v) === 'object'))) {
            continue;
          }
          d[k] = deep_freeze(v);
        }
        return shallow_freeze(d);
      case '[object Object]':
        for (k in d) {
          v = d[k];
          if (!((v != null) && ((typeof v) === 'object'))) {
            continue;
          }
          d[k] = deep_freeze(v);
        }
        return shallow_freeze(d);
    }
    return d;
  };

  //===========================================================================================================
  f1_set = function(me, k, v) {
    var R;
    R = shallow_copy(me);
    R[k] = v;
    return shallow_freeze(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  f0_set = function(me, k, v) {
    var R;
    R = shallow_copy(me);
    R[k] = v;
    return R;
  };

  //===========================================================================================================
  f1_assign = function(me, ...P) {
    return deep_freeze(deep_copy(assign({}, me, ...P)));
  };

  f0_assign = function(me, ...P) {
    return deep_copy(assign({}, me, ...P));
  };

  //===========================================================================================================
  f1_lets = function(original, modifier) {
    var draft;
    draft = this.thaw(original);
    if (modifier != null) {
      modifier(draft);
    }
    return deep_freeze(draft);
  };

  //-----------------------------------------------------------------------------------------------------------
  f0_lets = function(original, modifier) {
    var draft;
    draft = this.thaw(original);
    if (modifier != null) {
      modifier(draft);
    }
    /* TAINT do not copy */
    return deep_copy(draft);
  };

  //===========================================================================================================
  f1_freeze = function(me) {
    return deep_freeze(me);
  };

  f0_freeze = function(me) {
    return me;
  };

  //===========================================================================================================
  f1_thaw = function(me) {
    return deep_copy(me);
  };

  f0_thaw = function(me) {
    return deep_copy(me);
  };

  Lft = (function() {
    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Lft extends Multimix {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        super();
        types.validate.lft_cfg(this.cfg = shallow_freeze({...defaults.cfg, ...cfg}));
        if (this.cfg.freeze) {
          this.set = f1_set;
          this.assign = f1_assign;
          this.lets = f1_lets;
          this.freeze = f1_freeze;
          this.thaw = f1_thaw;
        } else {
          this.set = f0_set;
          this.assign = f0_assign;
          this.lets = f0_lets;
          this.freeze = f0_freeze;
          this.thaw = f0_thaw;
        }
        return this;
      }

      //---------------------------------------------------------------------------------------------------------
      get(me, k) {
        return me[k];
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Lft.types = types;

    return Lft;

  }).call(this);

  //###########################################################################################################
  module.exports = LFT = new Lft();

  assign(LFT, {Lft});

}).call(this);

//# sourceMappingURL=letsfreezethat-NG-rc2.js.map