(function() {
  'use strict';
  var FS, H, PATH, _GUY, alert, debug, declare, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  //===========================================================================================================
  declare.fs_file({
    isa: function(x) {
      var error, stat;
      if (!this.isa.nonempty.text(x)) {
        return false;
      }
      try {
        stat = FS.statSync(x);
      } catch (error1) {
        error = error1;
        if (error.code === 'ENOENT') {
          return false;
        }
        throw error;
      }
      return stat.isFile();
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  declare.fs_directory({
    isa: function(x) {
      var error, stat;
      if (!this.isa.nonempty.text(x)) {
        return false;
      }
      try {
        stat = FS.statSync(x);
      } catch (error1) {
        error = error1;
        if (error.code === 'ENOENT') {
          return false;
        }
        throw error;
      }
      return stat.isDirectory();
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  declare.fs_exists({
    isa: function(x) {
      var error, stat;
      if (!this.isa.nonempty.text(x)) {
        return false;
      }
      try {
        stat = FS.statSync(x);
      } catch (error1) {
        error = error1;
        if (error.code === 'ENOENT') {
          return false;
        }
        throw error;
      }
      return true;
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_temp_context_handler_file = function(T, done) {
    var GUY;
    GUY = require('../../../apps/guy');
    (() => {      //.........................................................................................................
      var path;
      path = null;
      info = GUY.temp.with_file(function({
          path: mypath,
          fd
        }) {
        path = mypath;
        return T != null ? T.ok(isa.fs_file(mypath)) : void 0;
      });
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(!isa.fs_file(path)) : void 0;
    })();
    (() => {      //.........................................................................................................
      var path;
      path = null;
      info = GUY.temp.with_file({
        keep: true
      }, function({
          path: mypath,
          fd
        }) {
        path = mypath;
        return T != null ? T.ok(isa.fs_file(mypath)) : void 0;
      });
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(isa.fs_file(path)) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_temp_context_handler_directory = function(T, done) {
    var GUY;
    GUY = require('../../../apps/guy');
    (() => {      //.........................................................................................................
      var path;
      path = null;
      info = GUY.temp.with_directory(function({
          path: mypath
        }) {
        path = mypath;
        debug('^345-1^', {path});
        return T != null ? T.ok(isa.fs_directory(mypath)) : void 0;
      });
      debug('^345-2^', info);
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(!isa.fs_directory(path)) : void 0;
    })();
    (() => {      //.........................................................................................................
      var path;
      path = null;
      info = GUY.temp.with_directory({
        prefix: 'zzwhatever-'
      }, function({
          path: mypath
        }) {
        path = mypath;
        debug('^345-3^', {path});
        if (T != null) {
          T.ok((PATH.basename(mypath)).startsWith('zzwhatever-'));
        }
        return T != null ? T.ok(isa.fs_directory(mypath)) : void 0;
      });
      debug('^345-4^', info);
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(!isa.fs_directory(path)) : void 0;
    })();
    (() => {      //.........................................................................................................
      var path;
      path = null;
      info = GUY.temp.with_directory({
        keep: true,
        prefix: 'zzwhatever-'
      }, function({
          path: mypath
        }) {
        path = mypath;
        debug('^345-5^', {path});
        if (T != null) {
          T.ok((PATH.basename(mypath)).startsWith('zzwhatever-'));
        }
        return T != null ? T.ok(isa.fs_directory(mypath)) : void 0;
      });
      debug('^345-6^', info);
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(isa.fs_directory(path)) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_temp_tempfolder_removed_with_contents = function(T, done) {
    var GUY;
    GUY = require('../../../apps/guy');
    (() => {      //.........................................................................................................
      var fpath, path;
      path = null;
      fpath = null;
      info = GUY.temp.with_directory({
        prefix: 'zzwhatever-'
      }, function({
          path: mypath
        }) {
        path = mypath;
        debug('^345-3^', {path});
        fpath = PATH.join(path, 'myfile.txt');
        FS.writeFileSync(fpath, "helo");
        return isa.fs_file(fpath);
      });
      debug('^345-4^', info);
      if (T != null) {
        T.eq(info, null);
      }
      if (T != null) {
        T.ok(!isa.fs_file(fpath));
      }
      return T != null ? T.ok(!isa.fs_directory(path)) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_temp_works_with_async_functions = async function(T, done) {
    var GUY, async_fn, collector;
    GUY = require('../../../apps/guy');
    collector = [];
    //.........................................................................................................
    async_fn = function(x) {
      return new Promise(async function(done) {
        debug('^43-1^', rpr(x));
        collector.push(x);
        await GUY.async.after(0.01, done);
        return null;
      });
    };
    //.........................................................................................................
    await async_fn('^43-2^');
    await (async() => {
      var path;
      path = null;
      info = (await GUY.temp.with_file({
        prefix: 'yyy-'
      }, async function({
          path: mypath,
          fd
        }) {
        path = mypath;
        await async_fn('^43-3^');
        return T != null ? T.ok(isa.fs_file(mypath)) : void 0;
      }));
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(!isa.fs_file(path)) : void 0;
    })();
    //.........................................................................................................
    await async_fn('^43-4^');
    await (async() => {
      var path;
      path = null;
      info = (await GUY.temp.with_directory({
        prefix: 'yyy-'
      }, async function({
          path: mypath
        }) {
        path = mypath;
        await async_fn('^43-5^');
        return T != null ? T.ok(isa.fs_directory(mypath)) : void 0;
      }));
      if (T != null) {
        T.eq(info, null);
      }
      return T != null ? T.ok(!isa.fs_directory(path)) : void 0;
    })();
    //.........................................................................................................
    await async_fn('^43-6^');
    if (T != null) {
      T.eq(collector, ['^43-2^', '^43-3^', '^43-4^', '^43-5^', '^43-6^']);
    }
    debug('^43-7^', collector);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @GUY_temp_context_handler_file
// @GUY_temp_context_handler_file()
// @GUY_temp_works_with_async_functions()
// test @GUY_temp_works_with_async_functions

}).call(this);

//# sourceMappingURL=temp.tests.js.map