(function() {
  'use strict';
  var CND, DATA, FS, FSP, H, PATH, badge, debug, echo, equals, help, info, isa, rpr, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/HELPERS';

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

  FSP = require('fs/promises');

  this.types = new (require('intertype')).Intertype();

  ({isa, validate, validate_list_of, equals} = this.types.export());

  DATA = require('../../../lib/data-providers-nocache');

  H = this;

  (() => {    //-----------------------------------------------------------------------------------------------------------
    var message;
    if (indexOf.call(process.argv, '--guy-use-installed') >= 0) {
      H.guy_use_installed = true;
      H.guy_path = 'guy';
      message = "using installed version of guy";
    } else {
      H.guy_use_installed = false;
      H.guy_path = '../../../apps/guy';
      message = "using linked guy";
    }
    debug('^3337^', CND.reverse(message));
    process.on('exit', function() {
      return debug('^3337^', CND.reverse(message));
    });
    return null;
  })();

}).call(this);

//# sourceMappingURL=helpers.js.map