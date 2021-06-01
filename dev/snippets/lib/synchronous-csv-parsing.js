(function() {
  'use strict';
  var CND, E, FS, PATH, badge, debug, echo, help, info, misfit, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SYNCHRONOUS-CSV-PARSING';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  E = require('./errors');

  ({misfit} = require('./common'));

}).call(this);

//# sourceMappingURL=synchronous-csv-parsing.js.map