(function() {
  'use strict';
  var FS, GUY, L, PATH, alert, debug, echo, help, info, inspect, log, my_filename, plain, praise, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype'));

  ({rpr, inspect, echo, log} = GUY.trm);

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