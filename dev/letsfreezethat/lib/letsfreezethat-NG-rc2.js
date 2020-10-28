(function() {
  'use strict';
  var CND, LFT, Lft, Multimix, alert, assign, badge, copy_y_freeze_n$assign, copy_y_freeze_n$freeze, copy_y_freeze_n$lets, copy_y_freeze_n$set, copy_y_freeze_n$thaw, copy_y_freeze_y$assign, copy_y_freeze_y$freeze, copy_y_freeze_y$lets, copy_y_freeze_y$set, copy_y_freeze_y$thaw, debug, deep_copy, deep_freeze, defaults, echo, frozen, help, info, log, rpr, shallow_copy, shallow_freeze, types, urge, warn, whisper;

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
  copy_y_freeze_y$set = function(me, k, v) {
    var R;
    R = shallow_copy(me);
    R[k] = v;
    return shallow_freeze(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$set = function(me, k, v) {
    var R;
    R = shallow_copy(me);
    R[k] = v;
    return R;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // copy_n_freeze_n$set = ( me, k, v ) ->
  //   me[ k ] = v
  //   return me

  //===========================================================================================================
  // copy_y_freeze_y$new_object  = ( P...     ) -> deep_freeze deep_copy assign {}, P...
  // copy_y_freeze_n$new_object  = ( P...     ) ->             deep_copy assign {}, P...
  // copy_n_freeze_n$new_object  = ( P...     ) ->                       assign {}, P...

  //===========================================================================================================
  copy_y_freeze_y$assign = function(me, ...P) {
    return deep_freeze(deep_copy(assign({}, me, ...P)));
  };

  copy_y_freeze_n$assign = function(me, ...P) {
    return deep_copy(assign({}, me, ...P));
  };

  // copy_n_freeze_n$assign      = ( me, P... ) ->                       assign     me, P...

  //===========================================================================================================
  copy_y_freeze_y$lets = function(original, modifier) {
    var draft;
    draft = this.thaw(original);
    if (modifier != null) {
      modifier(draft);
    }
    return deep_freeze(draft);
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$lets = function(original, modifier) {
    var draft;
    draft = this.thaw(original);
    if (modifier != null) {
      modifier(draft);
    }
    return deep_copy(draft);
  };

  // #-----------------------------------------------------------------------------------------------------------
  // copy_n_freeze_n$lets = ( original, modifier ) ->
  //   draft = @thaw original
  //   modifier draft if modifier?
  //   return draft

  //===========================================================================================================
  copy_y_freeze_y$freeze = function(me) {
    return deep_freeze(me);
  };

  copy_y_freeze_n$freeze = function(me) {
    return me;
  };

  // copy_n_freeze_n$freeze  = ( me ) -> me

  //===========================================================================================================
  copy_y_freeze_y$thaw = function(me) {
    return deep_copy(me);
  };

  copy_y_freeze_n$thaw = function(me) {
    return deep_copy(me);
  };

  Lft = (function() {
    /* NOTE with `{ copy: false, }` the `thaw()` method will still make a copy if value is frozen */
    /* TAINT may fail if some properties are frozen, not object itself */
    // copy_n_freeze_n$thaw    = ( me ) -> if ( frozen me ) then deep_copy me else me

      //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Lft extends Multimix {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        super();
        types.validate.lft_cfg(this.cfg = shallow_freeze({...defaults.cfg, ...cfg}));
        // if @cfg.copy
        if (this.cfg.freeze) {
          // @new_object = copy_y_freeze_y$new_object
          this.set = copy_y_freeze_y$set;
          this.assign = copy_y_freeze_y$assign;
          this.lets = copy_y_freeze_y$lets;
          this.freeze = copy_y_freeze_y$freeze;
          this.thaw = copy_y_freeze_y$thaw;
        } else {
          // @new_object = copy_y_freeze_n$new_object
          this.set = copy_y_freeze_n$set;
          this.assign = copy_y_freeze_n$assign;
          this.lets = copy_y_freeze_n$lets;
          this.freeze = copy_y_freeze_n$freeze;
          this.thaw = copy_y_freeze_n$thaw;
        }
        // else
        //   if @cfg.freeze
        //     ### TAINT move to `types.validate.lft_settings cfg` ###
        //     throw new Error "^3446^ cannot use { copy: false, } with { freeze: true, }"
        //   else
        //     # # @new_object = copy_n_freeze_n$new_object
        //     # @set        = copy_n_freeze_n$set
        //     # @assign     = copy_n_freeze_n$assign
        //     # @lets       = copy_n_freeze_n$lets
        //     # @freeze     = copy_n_freeze_n$freeze
        //     # @thaw       = copy_n_freeze_n$thaw
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