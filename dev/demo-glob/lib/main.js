(function() {
  'use strict';
  var CND, PATH, alert, assign, badge, debug, echo, glob, help, info, jr, log, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'BLOB';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ({assign, jr} = CND);

  // { lets
  //   freeze }                = DATOM.export()
  // types                     = require './types'
  // { isa
  //   validate
  //   type_of }               = types
  // Multimix                  = require 'multimix'
  // MAIN                      = @
  glob = require('glob');

  PATH = require('path');

  //-----------------------------------------------------------------------------------------------------------
  this.glob = function(pattern) {
    return glob.sync(pattern);
  };

  // validate.nonempty_text pattern

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var i, len, path, pattern, ref, results;
      ref = process.argv.slice(2);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        pattern = ref[i];
        info(pattern);
        results.push((function() {
          var j, len1, ref1, results1;
          ref1 = this.glob(pattern);
          results1 = [];
          for (j = 0, len1 = ref1.length; j < len1; j++) {
            path = ref1[j];
            results1.push(urge(path));
          }
          return results1;
        }).call(this));
      }
      return results;
    })();
  }

}).call(this);
