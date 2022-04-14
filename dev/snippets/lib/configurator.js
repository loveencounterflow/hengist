(function() {
  'use strict';
  var CND, FINDUP, FS, H, OSPATH, PATH, TOML, badge, debug, echo, filename, flatten, get_cfg_search_path, help, info, module_name, read_cfg, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CONFIGURATOR';

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

  flatten = require('flat');

  H = require('../../../lib/helpers');

  OSPATH = require('ospath');

  TOML = require('@iarna/toml');

  module_name = 'hengist';

  filename = `.${module_name}.toml`;

  FINDUP = require('find-up');

  // { findUp
  //   pathExists} from 'find-up'

  //-----------------------------------------------------------------------------------------------------------
  get_cfg_search_path = function() {
    var R, path;
    R = [];
    path = FINDUP.sync(filename, {
      cwd: process.cwd()
    });
    if (path != null) {
      R.push(path);
    }
    path = PATH.join(OSPATH.home(), filename);
    if (FINDUP.sync.exists(path)) {
      R.push(path);
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  read_cfg = function() {
    var R, error, i, len, partial_cfg, ref, route, route_idx;
    R = {
      $routes: []
    };
    ref = get_cfg_search_path();
    for (route_idx = i = 0, len = ref.length; i < len; route_idx = ++i) {
      route = ref[route_idx];
      try {
        partial_cfg = TOML.parse(FS.readFileSync(route));
      } catch (error1) {
        error = error1;
        if (error.code !== 'ENOENT') {
          throw error;
        }
        warn(`^cfg@1^ no such file: ${rpr(path)}, skipping`);
        continue;
      }
      R.$routes.push(route);
      partial_cfg = flatten(partial_cfg, {
        delimiter: '.',
        safe: true
      });
      R = {...R, ...partial_cfg};
    }
    return R;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var cfg, key, value;
      cfg = read_cfg();
      cfg = (function() {
        var results;
        results = [];
        for (key in cfg) {
          value = cfg[key];
          results.push({key, value});
        }
        return results;
      })();
      return H.tabulate("cfg", cfg);
    })();
  }

}).call(this);

//# sourceMappingURL=configurator.js.map