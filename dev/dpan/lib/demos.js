(function() {
  'use strict';
  var CND, Dba, FS, H, PATH, SQL, _get_pkg_infos, badge, chalk, debug, def, demo_db_add_pkg_info, demo_db_add_pkg_infos, demo_fs_walk_dep_infos, demo_git_fetch_pkg_status, demo_git_get_dirty_counts, demo_show_recent_commits, demo_staged_file_paths, demo_variables, echo, freeze, get_gitlog, get_pkg_infos, glob, got, hashbow, help, info, isa, lets, rpr, semver_cmp, semver_satisfies, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  chalk = require('chalk');

  hashbow = require('hashbow');

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
  get_gitlog = function(pkg_fspath) {
    var R, cfg, commit, commit_count, commits, date, error, file_count, gitlog, i, j, len, len1, name, ref, ref1, short_hash, subject;
    debug('^353455^', pkg_fspath);
    // if pkg_fspath.endsWith '/cxltx'
    //   warn "^439342344^ skipping #{pkg_fspath}"
    //   return []
    gitlog = (require('gitlog')).default;
    cfg = {
      repo: pkg_fspath,
      number: 1e6,
      execOptions: {
        maxBuffer: 40096 * 1024
      },
      fields: ['abbrevHash', 'authorDate', 'files', 'subject']
    };
    try {
      commits = gitlog(cfg);
    } catch (error1) {
      error = error1;
      // throw error
      warn(`^347834^ when trying to get git logs for ${pkg_fspath}, an error occurred:`);
      warn(`${error.code} ${error.message}`);
      return [];
    }
    commit_count = commits.length;
    info("commit_count:", commit_count, pkg_fspath);
    ref = commits.slice(0, 4);
    /* NOTE commits are ordered newest first */
    for (i = 0, len = ref.length; i < len; i++) {
      commit = ref[i];
      file_count = commit.files.length;
      short_hash = commit.abbrevHash;
      date = commit.authorDate;
      subject = to_width(commit.subject, 100);
      subject = subject.trim();
      urge(file_count, short_hash, date, subject);
    }
    //.........................................................................................................
    R = [];
    ref1 = commits.slice(0, 101);
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      commit = ref1[j];
      name = PATH.basename(pkg_fspath);
      date = commit.authorDate.replace(/:[^:]+$/, '');
      subject = commit.subject.trim();
      R.push({name, date, subject});
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  get_pkg_infos = function(dpan) {
    var R, home_path, i, len, project_path_pattern, ref_path, sub_path, sub_paths;
    R = [];
    ref_path = process.cwd();
    home_path = process.env.HOME;
    // 'temp/linuxtimemachine-backups/enceladus/jzr/*/package.json'
    sub_paths = ['jzr/*/package.json'];
// 'io/*/package.json'
// 'io/mingkwai-rack/*/package.json'
    for (i = 0, len = sub_paths.length; i < len; i++) {
      sub_path = sub_paths[i];
      if (sub_path.startsWith('/')) {
        project_path_pattern = sub_path;
      } else {
        project_path_pattern = PATH.join(home_path, sub_path);
      }
      R = [...R, ...(_get_pkg_infos(dpan, ref_path, project_path_pattern))];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  _get_pkg_infos = function(dpan, ref_path, project_path_pattern) {
    var R, dcs, i, len, pkg_fspath, pkg_name, pkg_rel_fspath, project_path, ref;
    R = [];
    ref = glob.sync(project_path_pattern, {
      follow: false,
      realpath: true
    });
    for (i = 0, len = ref.length; i < len; i++) {
      project_path = ref[i];
      pkg_fspath = PATH.dirname(project_path);
      if ((dcs = dpan.git_get_dirty_counts({
        pkg_fspath,
        fallback: null
      })) == null) {
        warn(`not a git repo: ${pkg_fspath}`);
        continue;
      }
      // debug '^656874^', pkg_fspath, dcs
      pkg_rel_fspath = PATH.relative(ref_path, pkg_fspath);
      pkg_name = PATH.basename(pkg_fspath);
      R.push({pkg_fspath, pkg_rel_fspath, pkg_name, dcs});
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_git_get_dirty_counts = function() {
    var DBay, Dpan, Tbl, db_path, dba, dcs, dpan, i, k, len, pkg_fspath, pkg_name, pkg_rel_fspath, pkgs, sum, v;
    ({Dpan} = require(H.dpan_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    ({DBay} = require('../../../apps/dbay'));
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    dba = new DBay({
      path: db_path
    });
    dpan = new Dpan({
      dba,
      recreate: true
    });
    //.........................................................................................................
    pkgs = get_pkg_infos(dpan);
    help('^46456^', `using DB at ${db_path}`);
    whisper("ACC: ahead-commit  count");
    whisper("BCC: behind-commit count");
    whisper("DFC: dirty file    count");
//.........................................................................................................
    for (i = 0, len = pkgs.length; i < len; i++) {
      ({pkg_fspath, pkg_rel_fspath, pkg_name, dcs} = pkgs[i]);
      sum = dcs.sum;
      delete dcs.sum;
      if (sum > 0) {
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
  demo_show_recent_commits = function() {
    var DBay, Dpan, Tbl, commit, db_path, dba, dpan, i, j, l, len, len1, len2, name, pkg_fspath, pkg_name, pkg_rel_fspath, pkgs, recent_commits, ref, subject;
    ({Dpan} = require(H.dpan_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    ({DBay} = require('../../../apps/dbay'));
    db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
    dba = new DBay({
      path: db_path
    });
    dpan = new Dpan({
      dba,
      recreate: true
    });
    recent_commits = [];
    pkgs = get_pkg_infos(dpan);
    help('^46456^', `using DB at ${db_path}`);
//.........................................................................................................
    for (i = 0, len = pkgs.length; i < len; i++) {
      ({pkg_fspath, pkg_rel_fspath, pkg_name} = pkgs[i]);
      ref = get_gitlog(pkg_fspath);
      for (j = 0, len1 = ref.length; j < len1; j++) {
        commit = ref[j];
        recent_commits.push(commit);
      }
    }
    //.........................................................................................................
    recent_commits.sort(function(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return +1;
      }
      return 0;
    });
//.........................................................................................................
    for (l = 0, len2 = recent_commits.length; l < len2; l++) {
      commit = recent_commits[l];
      name = to_width(commit.name, 20);
      subject = to_width(commit.subject, 100);
      echo(CND.white(commit.date), (chalk.inverse.bold.hex(hashbow(name)))(name + ' ' + subject));
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
    debug('^4443^', dpan.vars.set('distance', 12));
    debug('^4443^', dpan.vars.get('myvariable'));
    debug('^4443^', dpan.vars.get('distance'));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_staged_file_paths = function() {
    var Dpan, GU, dba, dpan, pkg_fspath, repo, status;
    ({Dba} = require(H.dba_path));
    ({Dpan} = require(H.dpan_path));
    dba = new Dba();
    dpan = new Dpan({dba});
    GU = require('git-utils');
    pkg_fspath = PATH.resolve(PATH.join(__dirname, '../../../apps/git-expanded-commit-messages'));
    repo = GU.open(pkg_fspath);
    if (repo == null) {
      throw new Error(`^43487^ no repo at ${pkg_fspath}`);
    }
    debug('^3324^', repo.getStatus());
    /* missing untracked files */    debug('^3324^', (function() {
      var ref, results;
      ref = repo.getStatus();
      results = [];
      for (pkg_fspath in ref) {
        status = ref[pkg_fspath];
        if (status === 1) {
          results.push(pkg_fspath);
        }
      }
      return results;
    })());
    /* missing untracked files */    info('^5909^', dpan.git_get_staged_file_paths({pkg_fspath}));
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
      // await demo_show_recent_commits()
      return (await demo_git_get_dirty_counts());
    })();
  }

  // await demo_variables()
// await demo_staged_file_paths()

}).call(this);

//# sourceMappingURL=demos.js.map