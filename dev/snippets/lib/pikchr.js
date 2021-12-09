(function() {
  'use strict';
  var CND, PIKCHR, alert, badge, cfg, d, debug, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'PIKCHR';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  PIKCHR = require('pikchr');

  help(PIKCHR.pikchr(`line ; box "Hello," "World!"; arrow`));

  cfg = {};

  d = PIKCHR.pikchrex(`line ; box "Hello," "World!"; arrow`, cfg);

  info(Object.keys(d));

  urge(d.output);

}).call(this);

//# sourceMappingURL=pikchr.js.map