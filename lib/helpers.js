(function() {
  'use strict';
  var CND, PATH, assign, badge, debug, echo, help, info, jr, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'BENCHMARKS/HELPERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  ({jr, assign} = CND);

  //...........................................................................................................
  PATH = require('path');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.cwd_abspath = CND.cwd_abspath;

  this.cwd_relpath = CND.cwd_relpath;

  this.here_abspath = CND.here_abspath;

  this._drop_extension = (path) => {
    return path.slice(0, path.length - (PATH.extname(path)).length);
  };

  this.project_abspath = (...P) => {
    return CND.here_abspath(__dirname, '..', ...P);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.badge_from_filename = function(filename) {
    var basename;
    basename = PATH.basename(filename);
    return 'BENCHMARKS/' + (basename.replace(/^(.*?)\.[^.]+$/, '$1')).toUpperCase();
  };

}).call(this);
