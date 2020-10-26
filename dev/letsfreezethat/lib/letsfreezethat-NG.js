(function() {
  'use strict';
  var CND, LFT, Lft, Multimix, alert, badge, copy_n_freeze_n$assign, copy_n_freeze_n$freeze, copy_n_freeze_n$lets, copy_n_freeze_n$new_object, copy_n_freeze_n$set, copy_n_freeze_n$thaw, copy_y_freeze_n$assign, copy_y_freeze_n$freeze, copy_y_freeze_n$lets, copy_y_freeze_n$new_object, copy_y_freeze_n$set, copy_y_freeze_n$thaw, copy_y_freeze_y$assign, copy_y_freeze_y$freeze, copy_y_freeze_y$lets, copy_y_freeze_y$new_object, copy_y_freeze_y$set, copy_y_freeze_y$thaw, debug, defaults, echo, help, info, log, rpr, types, urge, warn, whisper;

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
      "x.copy is a boolean": function(x) {
        return this.isa.boolean(x.copy);
      },
      "x.freeze is a boolean": function(x) {
        return this.isa.boolean(x.freeze);
      },
      "x.copy: false implies x.freeze false": function(x) {
        if (!x.copy) {
          return !x.freeze;
        } else {
          return true;
        }
      }
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  defaults = {
    cfg: {
      copy: true,
      freeze: true
    }
  };

  //===========================================================================================================
  copy_y_freeze_y$set = function(me, k, v) {
    var R;
    R = Object.assign({}, me);
    R[k] = v;
    /* TAINT must honor deep freezing */
    return Object.freeze(R);
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$set = function(me, k, v) {
    var R;
    R = Object.assign({}, me);
    R[k] = v;
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_n_freeze_n$set = function(me, k, v) {
    me[k] = v;
    return me;
  };

  //===========================================================================================================
  /* TAINT must honor deep freezing */
  copy_y_freeze_y$new_object = function(...P) {
    return Object.freeze(Object.assign({}, ...P));
  };

  copy_y_freeze_n$new_object = function(...P) {
    return Object.assign({}, ...P);
  };

  copy_n_freeze_n$new_object = copy_y_freeze_n$new_object;

  //===========================================================================================================
  /* TAINT must honor deep freezing */
  copy_y_freeze_y$assign = function(me, ...P) {
    return Object.freeze(Object.assign({}, me, ...P));
  };

  copy_y_freeze_n$assign = function(me, ...P) {
    return Object.assign({}, me, ...P);
  };

  copy_n_freeze_n$assign = function(me, ...P) {
    return Object.assign(me, ...P);
  };

  //===========================================================================================================
  copy_y_freeze_y$lets = function(original, modifier) {
    var draft;
    draft = this.thaw(original);
    if (modifier != null) {
      modifier(draft);
    }
    /* TAINT must honor deep freezing */
    return Object.freeze(draft);
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$lets = function(original, modifier) {
    var draft;
    if (Object.isFrozen(original)) {
      draft = this.thaw(original);
    }
    if (modifier != null) {
      modifier(draft);
    }
    return draft;
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_n_freeze_n$lets = copy_y_freeze_n$lets;

  //===========================================================================================================
  copy_y_freeze_y$freeze = function(me) {
    return Object.freeze(Object.assign({}, me));
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$freeze = function(me) {
    return Object.assign({}, me);
  };

  copy_n_freeze_n$freeze = function(me) {
    return me;
  };

  //===========================================================================================================
  /* NOTE with `{ copy: false, }` the `thaw()` method will still make a copy as there is no `Object.thaw()` */
  copy_y_freeze_y$thaw = function(me) {
    return Object.assign({}, me);
  };

  //-----------------------------------------------------------------------------------------------------------
  copy_y_freeze_n$thaw = function(me) {
    return Object.assign({}, me);
  };

  copy_n_freeze_n$thaw = function(me) {
    return me;
  };

  Lft = (function() {
    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Lft extends Multimix {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        super();
        types.validate.lft_cfg(this.cfg = Object.freeze({...defaults.cfg, ...cfg}));
        if (this.cfg.copy) {
          if (this.cfg.freeze) {
            this.new_object = copy_y_freeze_y$new_object;
            this.set = copy_y_freeze_y$set;
            this.assign = copy_y_freeze_y$assign;
            this.lets = copy_y_freeze_y$lets;
            this.freeze = copy_y_freeze_y$freeze;
            this.thaw = copy_y_freeze_y$thaw;
          } else {
            this.new_object = copy_y_freeze_n$new_object;
            this.set = copy_y_freeze_n$set;
            this.assign = copy_y_freeze_n$assign;
            this.lets = copy_y_freeze_n$lets;
            this.freeze = copy_y_freeze_n$freeze;
            this.thaw = copy_y_freeze_n$thaw;
          }
        } else {
          if (this.cfg.freeze) {
            /* TAINT move to `types.validate.lft_settings cfg` */
            throw new Error("^3446^ cannot use { copy: false, } with { freeze: true, }");
          } else {
            this.new_object = copy_n_freeze_n$new_object;
            this.set = copy_n_freeze_n$set;
            this.assign = copy_n_freeze_n$assign;
            this.lets = copy_n_freeze_n$lets;
            this.freeze = copy_n_freeze_n$freeze;
            this.thaw = copy_n_freeze_n$thaw;
          }
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

  Object.assign(LFT, {Lft});

}).call(this);

//# sourceMappingURL=letsfreezethat-NG.js.map