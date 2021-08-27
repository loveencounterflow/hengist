(function() {
  'use strict';
  var CND, Dba, FS, H, PATH, SQL, badge, debug, def, demo_db_add_pkg_info, demo_db_add_pkg_infos, demo_fs_walk_dep_infos, demo_git_fetch_pkg_status, demo_git_get_dirty_counts, demo_variables, echo, freeze, glob, got, help, info, isa, lets, rpr, semver_cmp, semver_satisfies, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DPAN/DEMOS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  ({to_width} = require('to-width'));

  SQL = String.raw;

  ({lets, freeze} = require('letsfreezethat'));

  ({Dba} = require('icql-dba'));

  def = Object.defineProperty;

  glob = require('glob');

  PATH = require('path');

  FS = require('fs');

  got = require('got');

  semver_satisfies = require('semver/functions/satisfies');

  semver_cmp = require('semver/functions/cmp');

  H = require('./helpers');

  // #-----------------------------------------------------------------------------------------------------------
  // class Dpan_next extends Dpan

  //-----------------------------------------------------------------------------------------------------------
  demo_db_add_pkg_info = async function() {
    var Dpan, dpan, pkg_fspath, pkg_info/* TAINT not strictly true */, pkg_name;
    ({Dpan} = require(H.dpan_path));
    // dpan                = new Dpan_next()
    dpan = new Dpan();
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    pkg_name = PATH.basename(pkg_fspath);
    pkg_info = (await dpan.fs_fetch_pkg_info({pkg_fspath}));
    dpan.db_add_pkg_info(pkg_info);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_db_add_pkg_infos = async function() {
    var Dpan, Tbl, db_path, dba, dbatbl, dpan, entry, error, home_path, i, j, len, len1, pkg_fspath, pkg_info, project_path, project_path_pattern, ref, skipped;
    ({Dpan} = require(H.dpan_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    ({Dba} = require(H.dba_path));
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    dba = new Dba();
    dba.open({
      path: db_path
    });
    dba.pragma(SQL`journal_mode=memory`);
    dpan = new Dpan({
      dba,
      recreate: true
    });
    // dpan                  = new Dpan_next { recreate: true, }
    skipped = [];
    // home_path             = PATH.resolve PATH.join __dirname, '../../../../'
    // project_path_pattern  = PATH.join home_path, '*/package.json'
    // home_path             = PATH.resolve PATH.join __dirname, '../../../../dpan'
    home_path = PATH.resolve(PATH.join(__dirname, '../../../apps/dpan'));
    project_path_pattern = PATH.join(home_path, './package.json');
    debug('^488^', project_path_pattern);
    ref = glob.sync(project_path_pattern);
    for (i = 0, len = ref.length; i < len; i++) {
      project_path = ref[i];
      pkg_fspath = PATH.dirname(project_path);
      try {
        pkg_info = (await dpan.fs_fetch_pkg_info({pkg_fspath}));
        // debug '^336^', pkg_info
        dpan.db_add_pkg_info(pkg_info);
      } catch (error1) {
        error = error1;
        warn(`error occurred when trying to add ${pkg_fspath}: ${error.message}; skipping`);
        skipped.push(pkg_fspath);
        continue;
      }
      // whisper '^564^', pkg_info
      info('^564^', pkg_info.pkg_name, pkg_info.pkg_version);
    }
    //.........................................................................................................
    if (skipped.length > 0) {
      warn("some paths looked like projects but caused errors (see above):");
      for (j = 0, len1 = skipped.length; j < len1; j++) {
        entry = skipped[j];
        warn('  ' + entry);
      }
    }
    //.........................................................................................................
    dbatbl = new Tbl({dba});
    dbatbl.dump_db();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_git_get_dirty_counts = function() {
    var Dpan, Tbl, db_path, dba, dcs, dpan, home_path, i, k, len, pkg_fspath, pkg_rel_fspath, project_path, project_path_pattern, ref, ref_path, sum, v;
    ({Dpan} = require(H.dpan_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    ({Dba} = require(H.dba_path));
    ref_path = process.cwd();
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    dba = new Dba();
    // dba.open { path: db_path, }
    // dba.pragma SQL"journal_mode=memory"
    dpan = new Dpan({
      dba,
      recreate: true
    });
    home_path = PATH.resolve(PATH.join(__dirname, '../../../../'));
    project_path_pattern = PATH.join(home_path, '*/package.json');
    // home_path             = PATH.resolve PATH.join __dirname, '../../../../dpan'
    // home_path             = PATH.resolve PATH.join __dirname, '../../../apps/dpan'
    // project_path_pattern  = PATH.join home_path, './package.json'
    debug('^488^', project_path_pattern);
    ref = glob.sync(project_path_pattern);
    for (i = 0, len = ref.length; i < len; i++) {
      project_path = ref[i];
      pkg_fspath = PATH.dirname(project_path);
      pkg_rel_fspath = PATH.relative(ref_path, pkg_fspath);
      if ((dcs = dpan.git_get_dirty_counts({
        pkg_fspath,
        fallback: null
      })) == null) {
        warn(`not a git repo: ${pkg_fspath}`);
        continue;
      }
      sum = dcs.sum;
      delete dcs.sum;
      if (sum === 0) {
        whisper('^334-1^', pkg_fspath);
      } else {
        for (k in dcs) {
          v = dcs[k];
          if (v === 0) {
            delete dcs[k];
          }
        }
        help('^334-2^', to_width(pkg_rel_fspath, 50), CND.yellow(CND.reverse(` ${sum} `)), CND.grey(dcs));
      }
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_fs_walk_dep_infos = async function() {
    var Dpan, count, count_max, dep, dpan, fallback/* TAINT not strictly true */, pkg_fspath, pkg_name, ref;
    ({Dpan} = require(H.dpan_path));
    dpan = new Dpan();
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    pkg_name = PATH.basename(pkg_fspath);
    fallback = null;
    count = 0;
    count_max = 20;
    ref = dpan.fs_walk_dep_infos({pkg_fspath});
    for await (dep of ref) {
      count++;
      if (count > count_max) {
        break;
      }
      // whisper '^850^', dep
      info('^850^', dep.pkg_name, dep.pkg_version, `(${dep.dep_svrange})`, CND.yellow(dep.pkg_keywords.join(' ')));
      urge('^850^', dep.pkg_deps);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_git_fetch_pkg_status = function() {
    var Dpan, db_path, dba, dpan, pkg_fspath;
    ({Dpan} = require(H.dpan_path));
    ({Dba} = require(H.dba_path));
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    dba = new Dba();
    dba.open({
      path: db_path
    });
    dba.pragma(SQL`journal_mode=memory`);
    dpan = new Dpan({
      dba,
      recreate: true
    });
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    dpan.git_fetch_pkg_status({pkg_fspath});
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_variables = function() {
    var Dpan, dba, dpan;
    ({Dba} = require(H.dba_path));
    ({Dpan} = require(H.dpan_path));
    dba = new Dba();
    dpan = new Dpan({dba});
    debug('^4443^', dpan.vars.set('myvariable', "some value"));
    debug('^4443^', dpan.vars.set('ditance', 12));
    debug('^4443^', dpan.vars.get('myvariable'));
    debug('^4443^', dpan.vars.get('ditance'));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_fs_walk_dep_infos()
      // await demo_db_add_package()
      // await demo_db_add_pkg_info()
      // await demo_db_add_pkg_infos()
      // await demo_git_fetch_pkg_status()
      return (await demo_git_get_dirty_counts());
    })();
  }

  // await demo_variables()

}).call(this);

//# sourceMappingURL=demos.js.map