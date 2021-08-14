(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, rpr, test, test_fs_fetch_pkg_info, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DPAN/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  test_fs_fetch_pkg_info = async function(T, fallback) {
    var Dba, Dpan, count, dba, depth, dpan, error, has_fallback, pkg_fspath, pkg_json_info, pkg_name;
    ({Dpan} = require(H.dpan_path));
    ({Dba} = require(H.dba_path));
    dba = new Dba();
    dpan = new Dpan({dba});
    has_fallback = fallback !== void 0;
    //.........................................................................................................
    pkg_fspath = __filename;
    depth = (__filename.replace(/[^\/]/g, '')).length;
    count = 0;
    while (true) {
      count++;
      if (count >= depth) {
        break;
      }
      error = null;
      debug('^3736^', pkg_fspath, count, depth);
      try {
        if (has_fallback) {
          pkg_json_info = (await dpan.fs_fetch_pkg_info({pkg_fspath, fallback}));
        } else {
          pkg_json_info = (await dpan.fs_fetch_pkg_info({pkg_fspath}));
        }
      } catch (error1) {
        error = error1;
        if (T != null) {
          T.eq(type_of(error), 'dba_fs_pkg_json_not_found');
        }
        if ((type_of(error)) !== 'dba_fs_pkg_json_not_found') {
          throw error;
        }
        break;
      }
      if (error == null) {
        // debug '^477^', pkg_json_info
        if (pkg_json_info === fallback) {
          T.ok(true);
        } else {
          pkg_name = pkg_json_info != null ? pkg_json_info.pkg_name : void 0;
          debug('^3736^', CND.blue(pkg_name));
          if (T != null) {
            T.eq(pkg_name, 'hengist');
          }
          pkg_fspath = PATH.dirname(pkg_fspath);
        }
      }
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["dpan.fs_fetch_pkg_info 1"] = async function(T, done) {
    if (T != null) {
      T.halt_on_error();
    }
    await test_fs_fetch_pkg_info(T, void 0);
    await test_fs_fetch_pkg_info(T, null);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["dpan.fs_resolve_dep_fspath 1"] = function(T, done) {
    var Dba, Dpan, dba, dep_fspath, dep_name, dpan, pkg_fspath;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dpan} = require(H.dpan_path));
    ({Dba} = require(H.dba_path));
    dba = new Dba();
    dpan = new Dpan({dba});
    dep_name = 'cnd';
    // pkg_fspath        = '../../../lib/main.js'
    pkg_fspath = '../../..';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    debug('^3488^', {pkg_fspath});
    dep_fspath = dpan.fs_resolve_dep_fspath({pkg_fspath, dep_name});
    debug('^3488^', {dep_fspath});
    T.ok((require(dep_name)) === (require(dep_fspath)));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["dpan variables 1"] = function(T, done) {
    var Dba, Dpan, db_path, dba, dpan, funny;
    // T?.halt_on_error()
    debug('^5543^', {
      dpan_path: H.dpan_path
    });
    ({Dpan} = require(H.dpan_path));
    ({Dba} = require(H.dba_path));
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    urge(`using DB at ${db_path}`);
    dba = new Dba();
    dba.open({
      path: db_path
    });
    debug('^557^', dba.list(dba.query(SQL`select name, type from sqlite_schema where type in ( 'table', 'view' ) order by name;`)));
    dpan = new Dpan({
      dba,
      recreate: true
    });
    debug('^557^', dba.list(dba.query(SQL`select name, type from sqlite_schema where type in ( 'table', 'view' ) order by name;`)));
    T.eq(dba, dpan.dba);
    T.eq(dba, dpan.vars.dba);
    funny = Math.floor(Math.random() * 1e6);
    T.eq(dpan.vars.set('myvariable', "some value"), "some value");
    T.eq(dpan.vars.set('distance', funny), funny);
    T.eq(dpan.vars.get('myvariable'), "some value");
    T.eq(dpan.vars.get('distance'), funny);
    console.table(dba.list(dba.query(SQL`select name, type from sqlite_schema where type in ( 'table', 'view' ) order by name;`)));
    T.eq(dba.list(dba.query(SQL`select * from dpan_variables`)), []);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

  // test @[ "dpan variables 1" ]

}).call(this);

//# sourceMappingURL=basic.tests.js.map