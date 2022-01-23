(function() {
  'use strict';
  var CKD, CND, PATH, alert, badge, debug, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'XOSFILEWATCHER';

  rpr = CND.rpr;

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  alert = CND.get_logger('alert', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  CKD = require('chokidar');

  (() => {
    var cfg, glob, watcher;
    cfg = {
      persistent: true
    };
    // ignored:                  '*.txt'
    // ignoreInitial:            false
    // followSymlinks:           true
    // cwd:                      '.'
    // # disableGlobbing:          false
    // usePolling:               false
    // # interval:                 100
    // # binaryInterval:           300
    // alwaysStat:               false
    // depth:                    99
    // awaitWriteFinish:
    //   stabilityThreshold:       2000
    //   pollInterval:             100
    // ignorePermissionErrors:   false
    // atomic:                   true # or a custom 'atomicity delay', in milliseconds (default 100)
    glob = PATH.resolve(PATH.join(__dirname, '../src/*.coffee'));
    debug('^345345^', watcher = CKD.watch(glob, cfg));
    watcher.on('add', (path) => {
      return help('^3453345^', 'add', path);
    });
    return watcher.on('change', (path) => {
      return urge('^3453345^', 'change', path);
    });
  })();

}).call(this);

//# sourceMappingURL=xosfilewatcher.js.map