(function() {
  //###########################################################################################################
  var CND, FS, L, PATH, alert, badge, debug, echo, help, info, log, my_filename, rpr, test, urge, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERTYPE/TESTS/MAIN';

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
  PATH = require('path');

  FS = require('fs');

  test = require('guy-test');

  my_filename = PATH.basename(__filename);

  //###########################################################################################################
  L = this;

  (function() {
    var filename, i, key, len, module, path, paths, value;
    paths = FS.readdirSync(__dirname);
    for (i = 0, len = paths.length; i < len; i++) {
      path = paths[i];
      filename = PATH.basename(path);
      if (path.endsWith('.js.map')) {
        continue;
      }
      if (filename === my_filename) {
        continue;
      }
      if (!filename.startsWith('test-')) {
        continue;
      }
      path = PATH.join(__dirname, path);
      module = require(path);
      for (key in module) {
        value = module[key];
        if (key.startsWith('_')) {
          continue;
        }
        if (L[key] != null) {
          // debug '39838', path, key
          throw new Error(`duplicate key ${rpr(key)}`);
        }
        L[key] = value.bind(L);
      }
    }
    return test(L, {
      timeout: 5000
    });
  })();

}).call(this);

//# sourceMappingURL=test-all.js.map