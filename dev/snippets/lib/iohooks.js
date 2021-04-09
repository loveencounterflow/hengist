(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, demo_iohook, echo, glob, help, info, rpr, time_now, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEMPFILES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  FS = require('fs');

  PATH = require('path');

  glob = require('glob');

  //-----------------------------------------------------------------------------------------------------------
  time_now = function() {
    var t;
    t = process.hrtime();
    return `${t[0]}` + `${t[1]}`.padStart(9, '0');
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_iohook = function() {
    return new Promise((resolve) => {
      var iohook;
      iohook = require('iohook');
      iohook.on('keydown', function(d) {
        return info(d);
      });
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_tempy_directory()
      return (await demo_iohook());
    })();
  }

}).call(this);

//# sourceMappingURL=iohooks.js.map