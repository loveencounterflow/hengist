(function() {
  'use strict';
  var CND, CP, PATH, badge, debug, echo, help, info, pkg_fspath, rpr, to_width, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GIT-ANNOTATE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  PATH = require('path');

  // dpan                      = require '../../dpan'
  pkg_fspath = PATH.resolve(PATH.join(__dirname, '..'));

  CP = require('child_process');

  ({to_width} = require('to-width'));

  (async() => {
    var PKGDIR, i, len, name, staged_modules, staged_path, staged_paths;
    PKGDIR = (await import('pkg-dir'));
    staged_paths = CP.execSync('git diff --cached --name-only', {
      encoding: 'utf-8'
    });
    staged_paths = staged_paths.split(/\n/);
    staged_paths = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = staged_paths.length; i < len; i++) {
        staged_path = staged_paths[i];
        results.push(staged_path.trim());
      }
      return results;
    })();
    staged_modules = new Set();
    for (i = 0, len = staged_paths.length; i < len; i++) {
      staged_path = staged_paths[i];
      staged_modules.add(PATH.basename(PKGDIR.packageDirectorySync(staged_path)));
    }
    staged_modules = ((function() {
      var results;
      results = [];
      for (name of staged_modules) {
        results.push(name);
      }
      return results;
    })()).join(' ');
    staged_modules = (to_width(staged_modules, 50)).trim();
    return echo(`[${staged_modules}]`);
  })();

}).call(this);

//# sourceMappingURL=git-hook-prepare-commit-msg.js.map