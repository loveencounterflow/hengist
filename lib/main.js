(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, help, info, isa, rpr, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST';

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

  //...........................................................................................................
  this.types = require('./types');

  ({isa, validate, type_of} = this.types);

  //-----------------------------------------------------------------------------------------------------------
  this.resolve_project_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '..', path));
  };

}).call(this);

//# sourceMappingURL=main.js.map