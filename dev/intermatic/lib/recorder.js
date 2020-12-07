(function() {
  'use strict';
  var CND, PATH, Recorder, badge, debug, declare, echo, freeze, help, info, isa, lets, log, rpr, test, to_width, type_of, types, urge, validate, warn, whisper, width_of;

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

  // ITX                       = require '../../../apps/intertext'
  ({to_width, width_of} = require('to-width'));

  //-----------------------------------------------------------------------------------------------------------
  // declare

    //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  Recorder = class Recorder {
    //---------------------------------------------------------------------------------------------------------
    constructor(fsm) {
      // validate.fsm fsm
      this.fsm = fsm;
      this._compile_state_handlers(this.fsm);
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_state_handlers(fsm) {
      var i, len, ref, sub_fsm;
      this._compile_state_handler(fsm);
      ref = fsm.fsms;
      for (i = 0, len = ref.length; i < len; i++) {
        sub_fsm = ref[i];
        this._compile_state_handlers(sub_fsm);
      }
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _compile_state_handler(fsm) {
      var handler, original_handler, self;
      // is_first    = true
      self = this;
      if ((original_handler = fsm.enter.any) != null) {
        handler = function(...P) {
          original_handler(...P);
          return self.render_state(this.path, ...P);
        };
      } else {
        handler = function(...P) {
          return self.render_state(this.path, ...P);
        };
      }
      fsm.enter.any = handler.bind(fsm);
      fsm.stay.any = handler.bind(fsm);
      fsm.before.any = function() {
        return info('^recorder@3337^', fsm.move);
      };
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    render_state(path, ...P) {
      urge('^recorder/render_state@3337^', this.fsm.EXP_dstate);
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