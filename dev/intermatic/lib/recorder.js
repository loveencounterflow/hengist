(function() {
  'use strict';
  var CND, PATH, Recorder, badge, debug, declare, echo, freeze, help, info, isa, lets, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERMATIC/RECORDER';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  log = urge;

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // declare

    //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  Recorder = class Recorder {
    //---------------------------------------------------------------------------------------------------------
    constructor(fsm) {
      var tnames;
      // validate.fsm fsm
      this.fsm = fsm;
      debug('^3334^', this.fsm.triggers);
      tnames = Object.keys(this.fsm.triggers);
      debug('^3334^', tnames);
      debug('^3334^', this.fsm.lstates);
      debug('^3334^', this.fsm.fsm_names);
      this._compile_handlers();
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_handlers() {
      // @_compile_trigger_handlers()
      this._compile_state_handlers();
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_state_handlers() {
      var entry_point, handler, i, len, lstate, original_handler, ref, target, xxx_show;
      entry_point = 'enter';
      target = this.fsm[entry_point];
      xxx_show = function(s, ...P) {
        return debug('^27776^', s);
      };
      /* TAINT where/when to call so we get a line to represent state at recorder initialization? */
      xxx_show({
        $key: '???',
        to: this.fsm.lstate
      });
      ref = this.fsm.lstates;
      for (i = 0, len = ref.length; i < len; i++) {
        lstate = ref[i];
        if ((original_handler = target[lstate]) != null) {
          handler = function(s, ...P) {
            original_handler(s, ...P);
            return xxx_show(s, ...P);
          };
        } else {
          handler = function(s, ...P) {
            return xxx_show(s, ...P);
          };
        }
        target[lstate] = handler.bind(this.fsm);
      }
      return null;
    }

  };

  //###########################################################################################################
  module.exports = Recorder;

  //###########################################################################################################
  if (module === require.main) {
    (() => {})();
  }

}).call(this);

//# sourceMappingURL=recorder.js.map