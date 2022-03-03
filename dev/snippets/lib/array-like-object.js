(function() {
  'use strict';
  var CND, GUY, Pseudo_array, badge, debug, demo, echo, help, info, isa, rpr, type_of, types, urge, validate, warn, whisper;

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

    //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Pseudo_array = class Pseudo_array {
    //---------------------------------------------------------------------------------------------------------
    constructor(on_change) {
      if (on_change != null) {
        GUY.props.hide(this, 'on_change', on_change);
      }
      this.d = [];
      this.prv_length = 0;
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    on_change(delta) {
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    push(x) {
      var R;
      R = this.d.push(x);
      this._on_change();
      return R;
    }

    pop() {
      var R;
      R = this.d.pop();
      this._on_change();
      return R;
    }

    clear() {
      this.d.length = 0;
      this._on_change();
      return null;
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var d;
    d = new Pseudo_array(function(delta) {
      info('^348^', this.length, delta, rpr(this));
      this.prv_length = this.length;
      return null;
    });
    d.push(42);
    d.push(43);
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