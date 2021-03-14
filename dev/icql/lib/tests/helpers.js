(function() {
  'use strict';
  var CND, PATH, badge, debug, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL/TESTS/HELPERS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  // #...........................................................................................................
  // test                      = require 'guy-test'
  // jr                        = JSON.stringify
  // { inspect, }              = require 'util'
  // xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
  // xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
  //...........................................................................................................
  PATH = require('path');

  //-----------------------------------------------------------------------------------------------------------
  this.get_icql_settings = function(remove_db = false) {
    var R, error;
    R = {};
    R.connector = require('better-sqlite3');
    R.db_path = '/tmp/icql.db';
    R.icql_path = PATH.resolve(PATH.join(__dirname, '../../../../assets/icql/test.icql'));
    if (remove_db) {
      try {
        (require('fs')).unlinkSync(R.db_path);
      } catch (error1) {
        error = error1;
        if (!(error.code === 'ENOENT')) {
          throw error;
        }
      }
    }
    return R;
  };

}).call(this);

//# sourceMappingURL=helpers.js.map