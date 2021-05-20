(function() {
  'use strict';
  var CND, X_error, X_snytax_error, badge, debug, demo, echo, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CUSTOM-ERRORS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  X_error = class X_error extends Error {
    constructor(ref, message) {
      // super ( CND.grey ref ) + ' ' + ( CND.red CND.reverse message )
      super();
      this.message = `${ref} (${this.constructor.name}) ${message}`;
      this.ref = ref;
      return void 0/* always return `undefined` from constructor */;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  X_snytax_error = class X_snytax_error extends X_error {};

  // constructor:
  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var clasz, error, i, len, ref1;
    ref1 = [X_error, X_snytax_error];
    for (i = 0, len = ref1.length; i < len; i++) {
      clasz = ref1[i];
      try {
        throw new clasz('^123^', `your message for ${clasz.name} here`);
      } catch (error1) {
        error = error1;
        info();
        info('^1345^', "message:      ", error.message);
        info('^1345^', "type_of:      ", type_of(error));
      }
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=custom-errors.js.map