(function() {
  'use strict';
  var CND, CP, PATH, badge, cwd, debug, echo, help, info, join, pkg_fspath, rpr, to_width, urge, warn, whisper;

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

  cwd = process.cwd();

  join = function(...P) {
    return PATH.resolve(PATH.join(...P));
  };

  (async() => {
    var PKGDIR, i, idx, j, len, len1, name, staged_modules, staged_path, staged_paths;
    PKGDIR = (await import('pkg-dir'));
    staged_paths = CP.execSync('git diff --cached --name-only', {
      encoding: 'utf-8'
    });
    staged_paths = (function() {
      var i, len, ref, results;
      ref = staged_paths.split(/\n/);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        staged_path = ref[i];
        if (staged_path !== '') {
          results.push(staged_path);
        }
      }
      return results;
    })();
    for (idx = i = 0, len = staged_paths.length; i < len; idx = ++i) {
      staged_path = staged_paths[idx];
      staged_paths[idx] = join(cwd, PATH.dirname(staged_path.trim()));
    }
    staged_modules = new Set();
    for (j = 0, len1 = staged_paths.length; j < len1; j++) {
      staged_path = staged_paths[j];
      staged_modules.add(PATH.basename(PKGDIR.packageDirectorySync({
        cwd: staged_path
      })));
    }
    staged_modules = ((function() {
      var results;
      results = [];
      for (name of staged_modules) {
        results.push(name);
      }
      return results;
    })()).join(' ');
    // staged_modules += ' | ' + staged_paths.join ', '
    return echo(`[${staged_modules}]`);
  })();

}).call(this);

//# sourceMappingURL=git-hook-prepare-commit-msg.js.map