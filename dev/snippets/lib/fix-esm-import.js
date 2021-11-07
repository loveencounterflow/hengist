(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, path_as_url, require_import, require_import_default, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'FIX-ESM-IMPORT';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  // transliterate             = ( ( require 'fix-esm' ).require '@sindresorhus/transliterate' ).default
  info('^3783-1');

  require_import = function(name) {
    return (require('fix-esm')).require(name);
  };

  require_import_default = function(name) {
    return ((require('fix-esm')).require(name)).default;
  };

  info('^3783-2');

  // transliterate             = require_import_default '@sindresorhus/transliterate'
  // info '^3783-3'
  path_as_url = require_import_default('file-url');

  info('^3783-4');

  // debug '^33443^', transliterate

  // help '^4907^', transliterate 'Fußgängerübergänge'
  // # => 'Fussgaengeruebergaenge'

  // help '^4907^', transliterate 'Я люблю единорогов'
  // # => 'Ya lyublyu edinorogov'

  // help '^4907^', transliterate 'こちらはうずくしいところですね。'

  // help '^4907^', transliterate 'أنا أحب حيدات'
  // # => 'ana ahb hydat'

  // help '^4907^', transliterate 'tôi yêu những chú kỳ lân'
  // # => 'toi yeu nhung chu ky lan'
  urge('^4907^', path_as_url('./foo/bar'));

}).call(this);

//# sourceMappingURL=fix-esm-import.js.map