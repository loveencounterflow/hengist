(function() {
  'use strict';
  var CND, GUY, Pipeline, Pond, Segment, UTIL, add_length_prop, badge, debug, demo, echo, help, info, isa, misfit, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'PSEUDO-ARRAY';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  GUY = require('guy');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types);

  // { Moonriver }             = require '../../../apps/moonriver'
  UTIL = require('util');

  misfit = Symbol('misfit');

  //-----------------------------------------------------------------------------------------------------------
  add_length_prop = function(target, key) {
    return Object.defineProperty(target, 'length', {
      get: function() {
        return this[key].length;
      },
      set: function(x) {
        return this[key].length = x;
      }
    });
  };

  Pond = (function() {
    //===========================================================================================================

    //-----------------------------------------------------------------------------------------------------------
    class Pond {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        this.cfg = GUY.lft.freeze({...this.constructor.C.defaults.constructor, ...cfg});
        if (this.cfg.on_change != null) {
          this.on_change = this.cfg.on_change;
        }
        this.d = [];
        this.delta = 0;
        this.rear = null;
        this.fore = null;
        this.pipeline = null;
        this.consumer = null/* transform to be called when data arrives */
        this.prv_length = 0;
        add_length_prop(this, 'd');
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      _on_change() {
        var ref;
        this.delta = this.length - this.prv_length;
        info('^348^', this.length, this.delta, rpr(this));
        this.prv_length = this.length;
        if ((ref = this.pipeline) != null) {
          ref.on_change(delta);
        }
        if (typeof this.on_change === "function") {
          this.on_change();
        }
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      set_rear(x) {
        // validate.pond x
        this.rear = x;
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      set_fore(x) {
        // validate.pond x
        this.fore = x;
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      push(x) {
        var R;
        if (this.devnull) {
          return null;
        }
        R = this.d.push(x);
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      pop(fallback = misfit) {
        var R;
        if (this.d.length === 0) {
          if (fallback !== misfit) {
            return fallback;
          }
          throw new Error("^XXX@1^ cannot pop() from empty list");
        }
        R = this.d.pop();
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      unshift(x) {
        var R;
        if (this.devnull) {
          return null;
        }
        R = this.d.unshift(x);
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      shift(fallback = misfit) {
        var R;
        if (this.d.length === 0) {
          if (fallback !== misfit) {
            return fallback;
          }
          throw new Error("^XXX@1^ cannot shift() from empty list");
        }
        if (this.devnull) {
          return null;
        }
        R = this.d.shift();
        this._on_change();
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      clear() {
        this.d.length = 0;
        this._on_change();
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      toString() {
        return rpr(this.d);
      }

      [UTIL.inspect.custom]() {
        return this.toString();
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Pond.C = GUY.lft.freeze({
      misfit: misfit,
      defaults: {
        constructor: {
          on_change: null,
          devnull: false
        }
      }
    });

    return Pond;

  }).call(this);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Segment = class Segment {
    //---------------------------------------------------------------------------------------------------------
    constructor(input, output) {
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    toString() {
      return rpr(this);
    }

    [UTIL.inspect.custom]() {
      return this.toString();
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Pipeline = class Pipeline {
    //---------------------------------------------------------------------------------------------------------
    constructor(segments) {
      var i, len, segment;
      this.data_count = 0;
      this.segments = [];
      this.last_segment = null;
      add_length_prop(this, 'segments');
      for (i = 0, len = segments.length; i < len; i++) {
        segment = segments[i];
        this.push(segment);
      }
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    push(segment) {
      this.segments.push(segment);
      this.last_segment = segment;
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    on_change(delta) {
      this.data_count += delta;
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    * [Symbol.iterator]() {
      var i, len, ref, segment;
      ref = this.segments;
      for (i = 0, len = ref.length; i < len; i++) {
        segment = ref[i];
        yield segment;
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    toString() {
      return rpr(this);
    }

    [UTIL.inspect.custom]() {
      return this.toString();
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var d;
    d = new Pond({
      on_change: function(delta) {
        return null;
      }
    });
    d.push(42);
    d.push(43);
    d.push(44);
    d.shift();
    // d.splice 1, 0, 'a', 'b', 'c'
    urge('^948^', d);
    urge('^948^', d.length);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=array-like-object.js.map