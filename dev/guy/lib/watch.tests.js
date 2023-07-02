(function() {
  'use strict';
  var FS, H, PATH, _GUY, alert, debug, declare, demo_GUY_reporting_watcher, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  _GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = _GUY.trm.get_loggers('GUY/temp/tests'));

  ({rpr, inspect, echo, log} = _GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  FS = require('fs');

  // { freeze }                = require 'letsfreezethat'
  H = require('./helpers');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, declare, type_of, validate, equals} = types);

  //-----------------------------------------------------------------------------------------------------------
  demo_GUY_reporting_watcher = async function(T, done) {
    var GUY, after, defer, f, sleep;
    GUY = require('../../../apps/guy');
    ({after, defer, sleep} = GUY.async);
    //.........................................................................................................
    f = () => {
      return new Promise(async(resolve, reject) => {
        var folder_path, new_path_1, new_path_2, rm, watcher;
        try {
          ({
            rm,
            path: folder_path
          } = GUY.temp.create_directory());
          // GUY.process.on_exit ->
          //   debug "exit handler: removing #{folder_path}"
          //   rm?()
          debug('^345-4^', {rm, folder_path});
          new_path_1 = PATH.join(folder_path, 'new_1.txt');
          new_path_2 = PATH.join(folder_path, 'new_2.txt');
          debug('^888-1^');
          FS.writeFileSync(new_path_1, 'helo');
          debug('^888-2^');
          FS.writeFileSync(new_path_2, 'helo');
          // glob_path = PATH.join folder_path, '**/*'
          // glob_path = PATH.join folder_path, '*.txt'
          debug('^888-3^');
          watcher = new GUY.watch.Reporting_watcher();
          debug('^888-4^');
          watcher.add_path(new_path_2);
          debug('^888-5^');
          watcher.add_path(new_path_1);
          debug('^888-9^');
          await sleep(0.25);
          debug('^888-7^');
          FS.writeFileSync(new_path_1, 'sfhsoifhas');
          debug('^888-8^');
          FS.writeFileSync(new_path_2, 'helo');
          debug('^888-9^');
          await sleep(0.25);
          debug('^888-10^');
          FS.writeFileSync(new_path_2, 'helo');
          after(5, () => {
            return resolve();
          });
        } finally {
          // null
          // return null
          debug(`removing ${folder_path}`);
          if (typeof rm === "function") {
            rm();
          }
        }
        return null;
      });
    };
    //.........................................................................................................
    await f();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_watch_watcher = async function(T, done) {
    var GUY, My_watcher, after, defer, new_folder_path, new_path_1, new_path_2, result, sleep;
    GUY = require('../../../apps/guy');
    ({after, defer, sleep} = GUY.async);
    result = [];
    new_path_1 = null;
    new_path_2 = null;
    new_folder_path = null;
    //.........................................................................................................
    My_watcher = class My_watcher extends GUY.watch.Watcher {
      on_all(key, path) {
        whisper('^888-1^', key, path);
        return result.push([key, path]);
      }

    };
    await (() => {      //.........................................................................................................
      return new Promise(async(resolve, reject) => {
        var folder_path, new_glob, rm, watcher;
        ({
          rm,
          path: folder_path
        } = GUY.temp.create_directory());
        GUY.process.on_exit(function() {
          if (FS.existsSync(folder_path)) {
            debug(`exit handler: removing ${folder_path}`);
            return typeof rm === "function" ? rm() : void 0;
          } else {
            return debug(`exit handler: (OK) already deleted: ${folder_path}`);
          }
        });
        //.......................................................................................................
        new_path_1 = PATH.join(folder_path, 'new_1.txt');
        new_folder_path = PATH.join(folder_path, 'sub');
        new_path_2 = PATH.join(folder_path, 'sub/new_2.txt');
        new_glob = PATH.join(folder_path, '**/*');
        //.......................................................................................................
        watcher = new My_watcher();
        watcher.add_path(new_glob);
        // await sleep 0.25
        FS.writeFileSync(new_path_1, 'helo');
        FS.mkdirSync(new_folder_path);
        FS.writeFileSync(new_path_2, 'helo');
        await sleep(0.25);
        FS.writeFileSync(new_path_1, 'sfhsoifhas');
        FS.writeFileSync(new_path_2, 'helo');
        await sleep(0.25);
        FS.writeFileSync(new_path_2, 'helo');
        FS.rmSync(new_path_2);
        FS.rmdirSync(new_folder_path);
        after(0.25, async() => {
          debug("stopping watcher");
          await watcher._watcher.close();
          debug(`removing ${folder_path}`);
          if (typeof rm === "function") {
            rm();
          }
          return resolve();
        });
        // return null
        return null;
      });
    })();
    //.........................................................................................................
    if (T != null) {
      T.eq(result, [['add', new_path_1], ['add_folder', new_folder_path], ['add', new_path_2], ['change', new_path_1], ['change', new_path_2], ['unlink_folder', new_folder_path], ['unlink', new_path_2]]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await demo_GUY_reporting_watcher()
      await this.GUY_watch_watcher();
      return test(this);
    })();
  }

  // test @
// await @GUY_watch_demo()

}).call(this);

//# sourceMappingURL=watch.tests.js.map