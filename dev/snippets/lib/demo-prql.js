(function() {
  'use strict';
  var CND, FS, PATH, alert, badge, debug, demo, echo, help, info, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SNIPPETS/PRQL';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    debug(require('prql-js'));
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-prql.js.map