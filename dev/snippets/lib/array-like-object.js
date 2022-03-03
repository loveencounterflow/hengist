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
  Pseudo_array = class Pseudo_array extends Array {
    //---------------------------------------------------------------------------------------------------------
    constructor(on_change) {
      super();
      if (on_change != null) {
        GUY.props.hide(this, 'on_change', on_change);
      }
      // GUY.props.hide @, 'prv_length', 0
      this.prv_length = 0;
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    on_change() {
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    push(...P) {
      var R;
      R = super.push(...P);
      this.on_change();
      return R;
    }

    pop(...P) {
      var R;
      R = super.pop(...P);
      this.on_change();
      return R;
    }

    unshift(...P) {
      var R;
      R = super.unshift(...P);
      this.on_change();
      return R;
    }

    shift(...P) {
      var R;
      R = super.shift(...P);
      this.on_change();
      return R;
    }

    splice(...P) {
      var R;
      R = super.splice(...P);
      this.on_change();
      return R;
    }

    reduce(...P) {
      var R;
      R = super.reduce(...P);
      this.on_change();
      return R;
    }

    map(...P) {
      var R;
      R = super.map(...P);
      this.on_change();
      return R;
    }

    filter(...P) {
      var R;
      R = super.filter(...P);
      this.on_change();
      return R;
    }

    slice(...P) {
      var R;
      R = super.slice(...P);
      this.on_change();
      return R;
    }

    splice(...P) {
      var R;
      R = super.splice(...P);
      this.on_change();
      return R;
    }

    reverse(...P) {
      var R;
      R = super.reverse(...P);
      this.on_change();
      return R;
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var d;
    d = new Pseudo_array(function() {
      info('^348^', this.length, this.length - this.prv_length, rpr(this));
      this.prv_length = this.length;
      return null;
    });
    d.push(42);
    d.push(43);
    d.splice(1, 0, 'a', 'b', 'c');
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