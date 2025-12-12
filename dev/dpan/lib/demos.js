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

  ({Dba} = require('../../../apps/icql-dba'));

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
  get_gitlog = function(dpan, pkg_fspath) {
    var R, commit, commit_count, commits, date, hash, i, j, len, len1, name, ref, short_hash, subject;
    debug('^353455^', pkg_fspath);
    // if pkg_fspath.endsWith '/cxltx'
    //   warn "^439342344^ skipping #{pkg_fspath}"
    //   return []
    commits = dpan.git_get_log({
      pkg_fspath,
      fallback: null
    });
    if (commits == null) {
      commits = [];
    }
    // try commits = gitlog cfg catch error
    //   # throw error
    //   warn "^347834^ when trying to get git logs for #{pkg_fspath}, an error occurred:"
    //   warn "#{error.code} #{error.message}"
    //   throw error
    //   return []
    commit_count = commits.length;
    info("commit_count:", commit_count, pkg_fspath);
    ref = commits.slice(0, 4);
    /* NOTE commits are ordered newest first */
    for (i = 0, len = ref.length; i < len; i++) {
      commit = ref[i];
      short_hash = commit.hash;
      date = commit.date_iso;
      subject = to_width(commit.message, 100);
      subject = subject.trim();
      urge(short_hash, date, subject);
    }
    //.........................................................................................................
    R = [];
// [ .. 100 ]
    for (j = 0, len1 = commits.length; j < len1; j++) {
      commit = commits[j];
      name = PATH.basename(pkg_fspath);
      date = commit.date_iso;
      hash = commit.hash;
      subject = commit.message.trim();
      R.push({name, date, hash, subject});
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
    // 'jzr/*/package.json'
    sub_paths = ['jzr/*/.git'];
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
      // debug '^3234^', { pkg_fspath, pkg_name, }
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
    var DBay, Dpan, Tbl, commit, db_path, dba, dpan, gitlog, hash, i, j, l, len, len1, len2, name, pkg_fspath, pkg_name, pkg_rel_fspath, pkgs, recent_commits, subject;
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
      gitlog = get_gitlog(dpan, pkg_fspath);
      gitlog = gitlog.slice(0, 500);
// gitlog  = gitlog[ ... 1 ]
      for (j = 0, len1 = gitlog.length; j < len1; j++) {
        commit = gitlog[j];
        recent_commits.push(commit);
      }
    }
    //.........................................................................................................
    /* TAINT the idea was to use the DB for this kind of processing */
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
      hash = to_width(commit.hash, 10);
      echo(CND.white(commit.date), (CND.reverse(CND.yellow(hash))) + (chalk.inverse.bold.hex(hashbow(name)))(' ' + name + ' ' + subject));
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_fs_walk_dep_infos = async function() {
    var Dpan, count, count_max, dep, dpan, fallback/* TAINT not strictly true */, pkg_fspath, pkg_name;
    ({Dpan} = require(H.dpan_path));
    dpan = new Dpan();
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    pkg_name = PATH.basename(pkg_fspath);
    fallback = null;
    count = 0;
    count_max = 20;
    for await (dep of dpan.fs_walk_dep_infos({pkg_fspath})) {
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
    (() => {
      // await demo_fs_walk_dep_infos()
      // await demo_db_add_package()
      // await demo_db_add_pkg_info()
      // await demo_db_add_pkg_infos()
      // await demo_git_fetch_pkg_status()
      demo_show_recent_commits();
      return demo_git_get_dirty_counts();
    })();
  }

  // await demo_variables()
// await demo_staged_file_paths()

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2RlbW9zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEVBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxjQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsR0FBQSxFQUFBLG9CQUFBLEVBQUEscUJBQUEsRUFBQSxzQkFBQSxFQUFBLHlCQUFBLEVBQUEseUJBQUEsRUFBQSx3QkFBQSxFQUFBLHNCQUFBLEVBQUEsY0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsVUFBQSxFQUFBLGFBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLE9BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLFVBQUEsRUFBQSxnQkFBQSxFQUFBLFFBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7O0VBS0EsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsR0FBQSxHQUE0QixHQUFHLENBQUM7O0VBQ2hDLEtBQUEsR0FBNEI7O0VBQzVCLEtBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsT0FBQSxHQUE0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QWI7SUFDdEIsSUFBQSxHQUFzQixFQUFFLENBQUMsSUFBSCxDQUFRLFVBQVI7SUFDdEIsSUFBTyxZQUFQO01BQ0UsTUFBTSxJQUFJLEtBQUosQ0FBVSxDQUFBLG1CQUFBLENBQUEsQ0FBc0IsVUFBdEIsQ0FBQSxDQUFWLEVBRFI7O0lBRUEsS0FBQSxDQUFNLFFBQU4sRUFBZ0IsSUFBSSxDQUFDLFNBQUwsQ0FBQSxDQUFoQjtBQUFpQyxxQ0FDakMsS0FBQSxDQUFNLFFBQU47O0FBQWlCO0FBQUE7TUFBQSxLQUFBLGlCQUFBOztZQUEyRCxNQUFBLEtBQVU7dUJBQXJFOztNQUFBLENBQUE7O1FBQWpCO0FBQTBGLHFDQUMxRixJQUFBLENBQUssUUFBTCxFQUFlLElBQUksQ0FBQyx5QkFBTCxDQUErQixDQUFFLFVBQUYsQ0FBL0IsQ0FBZjtBQUNBLFdBQU87RUFiZ0IsRUExUXpCOzs7RUE2UkEsSUFBRyxNQUFBLEtBQVUsT0FBTyxDQUFDLElBQXJCO0lBQWtDLENBQUEsQ0FBQSxDQUFBLEdBQUEsRUFBQTs7Ozs7O01BTWhDLHdCQUFBLENBQUE7YUFDQSx5QkFBQSxDQUFBO0lBUGdDLENBQUEsSUFBbEM7OztFQTdSQTs7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbkNORCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdjbmQnXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELnJwclxuYmFkZ2UgICAgICAgICAgICAgICAgICAgICA9ICdEUEFOL0RFTU9TJ1xuZGVidWcgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdkZWJ1ZycsICAgICBiYWRnZVxud2FybiAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd3YXJuJywgICAgICBiYWRnZVxuaW5mbyAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdpbmZvJywgICAgICBiYWRnZVxudXJnZSAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd1cmdlJywgICAgICBiYWRnZVxuaGVscCAgICAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICdoZWxwJywgICAgICBiYWRnZVxud2hpc3BlciAgICAgICAgICAgICAgICAgICA9IENORC5nZXRfbG9nZ2VyICd3aGlzcGVyJywgICBiYWRnZVxuZWNobyAgICAgICAgICAgICAgICAgICAgICA9IENORC5lY2hvLmJpbmQgQ05EXG4jLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbnR5cGVzICAgICAgICAgICAgICAgICAgICAgPSBuZXcgKCByZXF1aXJlICdpbnRlcnR5cGUnICkuSW50ZXJ0eXBlXG57IGlzYVxuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIHZhbGlkYXRlX2xpc3Rfb2YgfSAgICAgID0gdHlwZXMuZXhwb3J0KClcbnsgdG9fd2lkdGggfSAgICAgICAgICAgICAgPSByZXF1aXJlICd0by13aWR0aCdcblNRTCAgICAgICAgICAgICAgICAgICAgICAgPSBTdHJpbmcucmF3XG57IGxldHNcbiAgZnJlZXplIH0gICAgICAgICAgICAgICAgPSByZXF1aXJlICdsZXRzZnJlZXpldGhhdCdcbnsgRGJhLCB9ICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9hcHBzL2ljcWwtZGJhJ1xuZGVmICAgICAgICAgICAgICAgICAgICAgICA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuZ2xvYiAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2dsb2InXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdmcydcbmdvdCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdnb3QnXG5zZW12ZXJfc2F0aXNmaWVzICAgICAgICAgID0gcmVxdWlyZSAnc2VtdmVyL2Z1bmN0aW9ucy9zYXRpc2ZpZXMnXG5zZW12ZXJfY21wICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnc2VtdmVyL2Z1bmN0aW9ucy9jbXAnXG5IICAgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnLi9oZWxwZXJzJ1xuY2hhbGsgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2NoYWxrJ1xuaGFzaGJvdyAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2hhc2hib3cnXG5cblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgY2xhc3MgRHBhbl9uZXh0IGV4dGVuZHMgRHBhblxuXG5cblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kZW1vX2RiX2FkZF9wa2dfaW5mbyA9IC0+XG4gIHsgRHBhbiB9ICAgICAgICAgICAgPSByZXF1aXJlIEguZHBhbl9wYXRoXG4gICMgZHBhbiAgICAgICAgICAgICAgICA9IG5ldyBEcGFuX25leHQoKVxuICBkcGFuICAgICAgICAgICAgICAgID0gbmV3IERwYW4oKVxuICBwa2dfZnNwYXRoICAgICAgICAgID0gJy4uLy4uLy4uLydcbiAgcGtnX2ZzcGF0aCAgICAgICAgICA9IFBBVEgucmVzb2x2ZSBQQVRILmpvaW4gX19kaXJuYW1lLCBwa2dfZnNwYXRoXG4gIHBrZ19uYW1lICAgICAgICAgICAgPSBQQVRILmJhc2VuYW1lIHBrZ19mc3BhdGggIyMjIFRBSU5UIG5vdCBzdHJpY3RseSB0cnVlICMjI1xuICBwa2dfaW5mbyAgICAgICAgICAgID0gYXdhaXQgZHBhbi5mc19mZXRjaF9wa2dfaW5mbyB7IHBrZ19mc3BhdGgsIH1cbiAgZHBhbi5kYl9hZGRfcGtnX2luZm8gcGtnX2luZm9cbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kZW1vX2RiX2FkZF9wa2dfaW5mb3MgPSAtPlxuICB7IERwYW4sIH0gICAgICAgICAgICAgPSByZXF1aXJlIEguZHBhbl9wYXRoXG4gIHsgVGJsLCB9ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvaWNxbC1kYmEtdGFidWxhdGUnXG4gIHsgRGJhLCB9ICAgICAgICAgICAgICA9IHJlcXVpcmUgSC5kYmFfcGF0aFxuICBkYl9wYXRoICAgICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2RhdGEvZHBhbi5zcWxpdGUnXG4gIGRiYSAgICAgICAgICAgICAgICAgICA9IG5ldyBEYmEoKVxuICBkYmEub3BlbiB7IHBhdGg6IGRiX3BhdGgsIH1cbiAgZGJhLnByYWdtYSBTUUxcImpvdXJuYWxfbW9kZT1tZW1vcnlcIlxuICBkcGFuICAgICAgICAgICAgICAgICAgPSBuZXcgRHBhbiB7IGRiYSwgcmVjcmVhdGU6IHRydWUsIH1cbiAgIyBkcGFuICAgICAgICAgICAgICAgICAgPSBuZXcgRHBhbl9uZXh0IHsgcmVjcmVhdGU6IHRydWUsIH1cbiAgc2tpcHBlZCAgICAgICAgICAgICAgID0gW11cbiAgIyBob21lX3BhdGggICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uLy4uLydcbiAgIyBwcm9qZWN0X3BhdGhfcGF0dGVybiAgPSBQQVRILmpvaW4gaG9tZV9wYXRoLCAnKi9wYWNrYWdlLmpzb24nXG4gICMgaG9tZV9wYXRoICAgICAgICAgICAgID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBfX2Rpcm5hbWUsICcuLi8uLi8uLi8uLi9kcGFuJ1xuICBob21lX3BhdGggICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2FwcHMvZHBhbidcbiAgcHJvamVjdF9wYXRoX3BhdHRlcm4gID0gUEFUSC5qb2luIGhvbWVfcGF0aCwgJy4vcGFja2FnZS5qc29uJ1xuICBkZWJ1ZyAnXjQ4OF4nLCBwcm9qZWN0X3BhdGhfcGF0dGVyblxuICBmb3IgcHJvamVjdF9wYXRoIGluIGdsb2Iuc3luYyBwcm9qZWN0X3BhdGhfcGF0dGVyblxuICAgIHBrZ19mc3BhdGggID0gUEFUSC5kaXJuYW1lIHByb2plY3RfcGF0aFxuICAgIHRyeVxuICAgICAgcGtnX2luZm8gPSBhd2FpdCBkcGFuLmZzX2ZldGNoX3BrZ19pbmZvIHsgcGtnX2ZzcGF0aCwgfVxuICAgICAgIyBkZWJ1ZyAnXjMzNl4nLCBwa2dfaW5mb1xuICAgICAgZHBhbi5kYl9hZGRfcGtnX2luZm8gcGtnX2luZm9cbiAgICBjYXRjaCBlcnJvclxuICAgICAgd2FybiBcImVycm9yIG9jY3VycmVkIHdoZW4gdHJ5aW5nIHRvIGFkZCAje3BrZ19mc3BhdGh9OiAje2Vycm9yLm1lc3NhZ2V9OyBza2lwcGluZ1wiXG4gICAgICBza2lwcGVkLnB1c2ggcGtnX2ZzcGF0aFxuICAgICAgY29udGludWVcbiAgICAjIHdoaXNwZXIgJ141NjReJywgcGtnX2luZm9cbiAgICBpbmZvICdeNTY0XicsIHBrZ19pbmZvLnBrZ19uYW1lLCBwa2dfaW5mby5wa2dfdmVyc2lvblxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGlmIHNraXBwZWQubGVuZ3RoID4gMFxuICAgIHdhcm4gXCJzb21lIHBhdGhzIGxvb2tlZCBsaWtlIHByb2plY3RzIGJ1dCBjYXVzZWQgZXJyb3JzIChzZWUgYWJvdmUpOlwiXG4gICAgd2FybiAnICAnICsgZW50cnkgZm9yIGVudHJ5IGluIHNraXBwZWRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkYmF0YmwgICAgICA9IG5ldyBUYmwgeyBkYmEsIH1cbiAgZGJhdGJsLmR1bXBfZGIoKVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZ2V0X2dpdGxvZyA9ICggZHBhbiwgcGtnX2ZzcGF0aCApIC0+XG4gIGRlYnVnICdeMzUzNDU1XicsIHBrZ19mc3BhdGhcbiAgIyBpZiBwa2dfZnNwYXRoLmVuZHNXaXRoICcvY3hsdHgnXG4gICMgICB3YXJuIFwiXjQzOTM0MjM0NF4gc2tpcHBpbmcgI3twa2dfZnNwYXRofVwiXG4gICMgICByZXR1cm4gW11cbiAgY29tbWl0cyAgID0gZHBhbi5naXRfZ2V0X2xvZyB7IHBrZ19mc3BhdGgsIGZhbGxiYWNrOiBudWxsLCB9XG4gIGNvbW1pdHMgID89IFtdXG4gICMgdHJ5IGNvbW1pdHMgPSBnaXRsb2cgY2ZnIGNhdGNoIGVycm9yXG4gICMgICAjIHRocm93IGVycm9yXG4gICMgICB3YXJuIFwiXjM0NzgzNF4gd2hlbiB0cnlpbmcgdG8gZ2V0IGdpdCBsb2dzIGZvciAje3BrZ19mc3BhdGh9LCBhbiBlcnJvciBvY2N1cnJlZDpcIlxuICAjICAgd2FybiBcIiN7ZXJyb3IuY29kZX0gI3tlcnJvci5tZXNzYWdlfVwiXG4gICMgICB0aHJvdyBlcnJvclxuICAjICAgcmV0dXJuIFtdXG4gIGNvbW1pdF9jb3VudCAgPSBjb21taXRzLmxlbmd0aFxuICBpbmZvIFwiY29tbWl0X2NvdW50OlwiLCBjb21taXRfY291bnQsIHBrZ19mc3BhdGhcbiAgIyMjIE5PVEUgY29tbWl0cyBhcmUgb3JkZXJlZCBuZXdlc3QgZmlyc3QgIyMjXG4gIGZvciBjb21taXQgaW4gY29tbWl0c1sgLi4gMyBdXG4gICAgc2hvcnRfaGFzaCAgPSBjb21taXQuaGFzaFxuICAgIGRhdGUgICAgICAgID0gY29tbWl0LmRhdGVfaXNvXG4gICAgc3ViamVjdCAgICAgPSB0b193aWR0aCBjb21taXQubWVzc2FnZSwgMTAwXG4gICAgc3ViamVjdCAgICAgPSBzdWJqZWN0LnRyaW0oKVxuICAgIHVyZ2Ugc2hvcnRfaGFzaCwgZGF0ZSwgc3ViamVjdFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIFIgICAgICAgICAgICAgICA9IFtdXG4gIGZvciBjb21taXQgaW4gY29tbWl0cyAjIFsgLi4gMTAwIF1cbiAgICBuYW1lICAgID0gUEFUSC5iYXNlbmFtZSBwa2dfZnNwYXRoXG4gICAgZGF0ZSAgICA9IGNvbW1pdC5kYXRlX2lzb1xuICAgIGhhc2ggICAgPSBjb21taXQuaGFzaFxuICAgIHN1YmplY3QgPSBjb21taXQubWVzc2FnZS50cmltKClcbiAgICBSLnB1c2ggeyBuYW1lLCBkYXRlLCBoYXNoLCBzdWJqZWN0LCB9XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZ2V0X3BrZ19pbmZvcyA9ICggZHBhbiApIC0+XG4gIFIgICAgICAgICAgICAgICAgICAgICA9IFtdXG4gIHJlZl9wYXRoICAgICAgICAgICAgICA9IHByb2Nlc3MuY3dkKClcbiAgaG9tZV9wYXRoICAgICAgICAgICAgID0gcHJvY2Vzcy5lbnYuSE9NRVxuICBzdWJfcGF0aHMgICAgICAgICAgICAgPSBbXG4gICAgIyAndGVtcC9saW51eHRpbWVtYWNoaW5lLWJhY2t1cHMvZW5jZWxhZHVzL2p6ci8qL3BhY2thZ2UuanNvbidcbiAgICAjICdqenIvKi9wYWNrYWdlLmpzb24nXG4gICAgJ2p6ci8qLy5naXQnXG4gICAgIyAnaW8vKi9wYWNrYWdlLmpzb24nXG4gICAgIyAnaW8vbWluZ2t3YWktcmFjay8qL3BhY2thZ2UuanNvbidcbiAgICBdXG4gIGZvciBzdWJfcGF0aCBpbiBzdWJfcGF0aHNcbiAgICBpZiBzdWJfcGF0aC5zdGFydHNXaXRoICcvJyB0aGVuIHByb2plY3RfcGF0aF9wYXR0ZXJuICA9ICAgICAgICAgICAgICAgICAgICAgICBzdWJfcGF0aFxuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdF9wYXRoX3BhdHRlcm4gID0gUEFUSC5qb2luIGhvbWVfcGF0aCwgIHN1Yl9wYXRoXG4gICAgUiA9IFsgUi4uLiwgKCBfZ2V0X3BrZ19pbmZvcyBkcGFuLCByZWZfcGF0aCwgcHJvamVjdF9wYXRoX3BhdHRlcm4gKS4uLiwgXVxuICByZXR1cm4gUlxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbl9nZXRfcGtnX2luZm9zID0gKCBkcGFuLCByZWZfcGF0aCwgcHJvamVjdF9wYXRoX3BhdHRlcm4gKSAtPlxuICBSICAgICAgICAgICAgICAgICAgICAgPSBbXVxuICBmb3IgcHJvamVjdF9wYXRoIGluIGdsb2Iuc3luYyBwcm9qZWN0X3BhdGhfcGF0dGVybiwgeyBmb2xsb3c6IGZhbHNlLCByZWFscGF0aDogdHJ1ZSwgfVxuICAgIHBrZ19mc3BhdGggICAgICA9IFBBVEguZGlybmFtZSBwcm9qZWN0X3BhdGhcbiAgICB1bmxlc3MgKCBkY3MgPSBkcGFuLmdpdF9nZXRfZGlydHlfY291bnRzIHsgcGtnX2ZzcGF0aCwgZmFsbGJhY2s6IG51bGwsIH0gKT9cbiAgICAgIHdhcm4gXCJub3QgYSBnaXQgcmVwbzogI3twa2dfZnNwYXRofVwiXG4gICAgICBjb250aW51ZVxuICAgICMgZGVidWcgJ142NTY4NzReJywgcGtnX2ZzcGF0aCwgZGNzXG4gICAgcGtnX3JlbF9mc3BhdGggID0gUEFUSC5yZWxhdGl2ZSByZWZfcGF0aCwgcGtnX2ZzcGF0aFxuICAgIHBrZ19uYW1lICAgICAgICA9IFBBVEguYmFzZW5hbWUgcGtnX2ZzcGF0aFxuICAgIFIucHVzaCB7IHBrZ19mc3BhdGgsIHBrZ19yZWxfZnNwYXRoLCBwa2dfbmFtZSwgZGNzLCB9XG4gIHJldHVybiBSXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGVtb19naXRfZ2V0X2RpcnR5X2NvdW50cyA9IC0+XG4gIHsgRHBhbiwgfSAgICAgICAgICAgICA9IHJlcXVpcmUgSC5kcGFuX3BhdGhcbiAgeyBUYmwsIH0gICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9pY3FsLWRiYS10YWJ1bGF0ZSdcbiAgeyBEQmF5LCB9ICAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9kYmF5J1xuICBkYl9wYXRoICAgICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2RhdGEvZHBhbi5zcWxpdGUnXG4gIGRiYSAgICAgICAgICAgICAgICAgICA9IG5ldyBEQmF5IHsgcGF0aDogZGJfcGF0aCwgfVxuICBkcGFuICAgICAgICAgICAgICAgICAgPSBuZXcgRHBhbiB7IGRiYSwgcmVjcmVhdGU6IHRydWUsIH1cbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBwa2dzICAgICAgICAgICAgICAgICAgPSBnZXRfcGtnX2luZm9zIGRwYW5cbiAgaGVscCAnXjQ2NDU2XicsIFwidXNpbmcgREIgYXQgI3tkYl9wYXRofVwiXG4gIHdoaXNwZXIgXCJBQ0M6IGFoZWFkLWNvbW1pdCAgY291bnRcIlxuICB3aGlzcGVyIFwiQkNDOiBiZWhpbmQtY29tbWl0IGNvdW50XCJcbiAgd2hpc3BlciBcIkRGQzogZGlydHkgZmlsZSAgICBjb3VudFwiXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZm9yIHsgcGtnX2ZzcGF0aCwgcGtnX3JlbF9mc3BhdGgsIHBrZ19uYW1lLCBkY3MsIH0gaW4gcGtnc1xuICAgICMgZGVidWcgJ14zMjM0XicsIHsgcGtnX2ZzcGF0aCwgcGtnX25hbWUsIH1cbiAgICBzdW0gPSBkY3Muc3VtXG4gICAgZGVsZXRlIGRjcy5zdW1cbiAgICBpZiBzdW0gPiAwXG4gICAgICBkZWxldGUgZGNzWyBrIF0gZm9yIGssIHYgb2YgZGNzIHdoZW4gdiBpcyAwXG4gICAgICBoZWxwICdeMzM0LTJeJywgKCB0b193aWR0aCBwa2dfcmVsX2ZzcGF0aCwgNTAgKSwgKCBDTkQueWVsbG93IENORC5yZXZlcnNlIFwiICN7c3VtfSBcIiApLCAoIENORC5ncmV5IGRjcyApXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kZW1vX3Nob3dfcmVjZW50X2NvbW1pdHMgPSAtPlxuICB7IERwYW4sIH0gICAgICAgICAgICAgPSByZXF1aXJlIEguZHBhbl9wYXRoXG4gIHsgVGJsLCB9ICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvaWNxbC1kYmEtdGFidWxhdGUnXG4gIHsgREJheSwgfSAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZGJheSdcbiAgZGJfcGF0aCAgICAgICAgICAgICAgID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBfX2Rpcm5hbWUsICcuLi8uLi8uLi9kYXRhL2RwYW4uc3FsaXRlJ1xuICBkYmEgICAgICAgICAgICAgICAgICAgPSBuZXcgREJheSB7IHBhdGg6IGRiX3BhdGgsIH1cbiAgZHBhbiAgICAgICAgICAgICAgICAgID0gbmV3IERwYW4geyBkYmEsIHJlY3JlYXRlOiB0cnVlLCB9XG4gIHJlY2VudF9jb21taXRzICAgICAgICA9IFtdXG4gIHBrZ3MgICAgICAgICAgICAgICAgICA9IGdldF9wa2dfaW5mb3MgZHBhblxuICBoZWxwICdeNDY0NTZeJywgXCJ1c2luZyBEQiBhdCAje2RiX3BhdGh9XCJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBmb3IgeyBwa2dfZnNwYXRoLCBwa2dfcmVsX2ZzcGF0aCwgcGtnX25hbWUsIH0gaW4gcGtnc1xuICAgIGdpdGxvZyAgPSBnZXRfZ2l0bG9nIGRwYW4sIHBrZ19mc3BhdGhcbiAgICBnaXRsb2cgID0gZ2l0bG9nWyAuLi4gNTAwIF1cbiAgICAjIGdpdGxvZyAgPSBnaXRsb2dbIC4uLiAxIF1cbiAgICBmb3IgY29tbWl0IGluIGdpdGxvZ1xuICAgICAgcmVjZW50X2NvbW1pdHMucHVzaCBjb21taXRcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAjIyMgVEFJTlQgdGhlIGlkZWEgd2FzIHRvIHVzZSB0aGUgREIgZm9yIHRoaXMga2luZCBvZiBwcm9jZXNzaW5nICMjI1xuICByZWNlbnRfY29tbWl0cy5zb3J0ICggYSwgYiApIC0+XG4gICAgcmV0dXJuIC0xIGlmIGEuZGF0ZSA8IGIuZGF0ZVxuICAgIHJldHVybiArMSBpZiBhLmRhdGUgPiBiLmRhdGVcbiAgICByZXR1cm4gMFxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGZvciBjb21taXQgaW4gcmVjZW50X2NvbW1pdHNcbiAgICBuYW1lICAgID0gdG9fd2lkdGggY29tbWl0Lm5hbWUsICAgICAgMjBcbiAgICBzdWJqZWN0ID0gdG9fd2lkdGggY29tbWl0LnN1YmplY3QsICAxMDBcbiAgICBoYXNoICAgID0gdG9fd2lkdGggY29tbWl0Lmhhc2gsICAgICAgMTBcbiAgICBlY2hvIFxcXG4gICAgICAoIENORC53aGl0ZSAgICAgICAgICAgICAgIGNvbW1pdC5kYXRlICksIFxcXG4gICAgICAoIENORC5yZXZlcnNlIENORC55ZWxsb3cgIGhhc2ggICAgICAgICkgKyBcXFxuICAgICAgKCBjaGFsay5pbnZlcnNlLmJvbGQuaGV4IGhhc2hib3cgbmFtZSApICcgJyArIG5hbWUgKyAnICcgKyBzdWJqZWN0XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kZW1vX2ZzX3dhbGtfZGVwX2luZm9zID0gLT5cbiAgeyBEcGFuIH0gICAgICAgICAgICA9IHJlcXVpcmUgSC5kcGFuX3BhdGhcbiAgZHBhbiAgICAgICAgICAgICAgICA9IG5ldyBEcGFuKClcbiAgcGtnX2ZzcGF0aCAgICAgICAgICA9ICcuLi8uLi8uLi8nXG4gIHBrZ19mc3BhdGggICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgcGtnX2ZzcGF0aFxuICBwa2dfbmFtZSAgICAgICAgICAgID0gUEFUSC5iYXNlbmFtZSBwa2dfZnNwYXRoICMjIyBUQUlOVCBub3Qgc3RyaWN0bHkgdHJ1ZSAjIyNcbiAgZmFsbGJhY2sgICAgICAgICAgICA9IG51bGxcbiAgY291bnQgICAgICAgICAgICAgICA9IDBcbiAgY291bnRfbWF4ICAgICAgICAgICA9IDIwXG4gIGZvciBhd2FpdCBkZXAgZnJvbSBkcGFuLmZzX3dhbGtfZGVwX2luZm9zIHsgcGtnX2ZzcGF0aCwgfVxuICAgIGNvdW50KytcbiAgICBicmVhayBpZiBjb3VudCA+IGNvdW50X21heFxuICAgICMgd2hpc3BlciAnXjg1MF4nLCBkZXBcbiAgICBpbmZvICdeODUwXicsIGRlcC5wa2dfbmFtZSwgZGVwLnBrZ192ZXJzaW9uLCBcIigje2RlcC5kZXBfc3ZyYW5nZX0pXCIsICggQ05ELnllbGxvdyBkZXAucGtnX2tleXdvcmRzLmpvaW4gJyAnIClcbiAgICB1cmdlICdeODUwXicsIGRlcC5wa2dfZGVwc1xuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmRlbW9fZ2l0X2ZldGNoX3BrZ19zdGF0dXMgPSAtPlxuICB7IERwYW4gfSAgICAgICAgICAgID0gcmVxdWlyZSBILmRwYW5fcGF0aFxuICB7IERiYSwgfSAgICAgICAgICAgID0gcmVxdWlyZSBILmRiYV9wYXRoXG4gIGRiX3BhdGggICAgICAgICAgICAgPSBQQVRILnJlc29sdmUgUEFUSC5qb2luIF9fZGlybmFtZSwgJy4uLy4uLy4uL2RhdGEvZHBhbi5zcWxpdGUnXG4gIGRiYSAgICAgICAgICAgICAgICAgPSBuZXcgRGJhKClcbiAgZGJhLm9wZW4geyBwYXRoOiBkYl9wYXRoLCB9XG4gIGRiYS5wcmFnbWEgU1FMXCJqb3VybmFsX21vZGU9bWVtb3J5XCJcbiAgZHBhbiAgICAgICAgICAgICAgICA9IG5ldyBEcGFuIHsgZGJhLCByZWNyZWF0ZTogdHJ1ZSwgfVxuICBwa2dfZnNwYXRoICAgICAgICAgID0gJy4uLy4uLy4uLydcbiAgcGtnX2ZzcGF0aCAgICAgICAgICA9IFBBVEgucmVzb2x2ZSBQQVRILmpvaW4gX19kaXJuYW1lLCBwa2dfZnNwYXRoXG4gIGRwYW4uZ2l0X2ZldGNoX3BrZ19zdGF0dXMgeyBwa2dfZnNwYXRoLCB9XG4gIHJldHVybiBudWxsXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZGVtb192YXJpYWJsZXMgPSAtPlxuICB7IERiYSB9ICAgICAgICAgICAgID0gcmVxdWlyZSBILmRiYV9wYXRoXG4gIHsgRHBhbiB9ICAgICAgICAgICAgPSByZXF1aXJlIEguZHBhbl9wYXRoXG4gIGRiYSAgICAgICAgICAgICAgICAgPSBuZXcgRGJhKClcbiAgZHBhbiAgICAgICAgICAgICAgICA9IG5ldyBEcGFuIHsgZGJhLCB9XG4gIGRlYnVnICdeNDQ0M14nLCBkcGFuLnZhcnMuc2V0ICdteXZhcmlhYmxlJywgXCJzb21lIHZhbHVlXCJcbiAgZGVidWcgJ140NDQzXicsIGRwYW4udmFycy5zZXQgJ2Rpc3RhbmNlJywgMTJcbiAgZGVidWcgJ140NDQzXicsIGRwYW4udmFycy5nZXQgJ215dmFyaWFibGUnXG4gIGRlYnVnICdeNDQ0M14nLCBkcGFuLnZhcnMuZ2V0ICdkaXN0YW5jZSdcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5kZW1vX3N0YWdlZF9maWxlX3BhdGhzID0gLT5cbiAgeyBEYmEgfSAgICAgICAgICAgICA9IHJlcXVpcmUgSC5kYmFfcGF0aFxuICB7IERwYW4gfSAgICAgICAgICAgID0gcmVxdWlyZSBILmRwYW5fcGF0aFxuICBkYmEgICAgICAgICAgICAgICAgID0gbmV3IERiYSgpXG4gIGRwYW4gICAgICAgICAgICAgICAgPSBuZXcgRHBhbiB7IGRiYSwgfVxuICBHVSAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ2l0LXV0aWxzJ1xuICBwa2dfZnNwYXRoICAgICAgICAgID0gUEFUSC5yZXNvbHZlIFBBVEguam9pbiBfX2Rpcm5hbWUsICcuLi8uLi8uLi9hcHBzL2dpdC1leHBhbmRlZC1jb21taXQtbWVzc2FnZXMnXG4gIHJlcG8gICAgICAgICAgICAgICAgPSBHVS5vcGVuIHBrZ19mc3BhdGhcbiAgdW5sZXNzIHJlcG8/XG4gICAgdGhyb3cgbmV3IEVycm9yIFwiXjQzNDg3XiBubyByZXBvIGF0ICN7cGtnX2ZzcGF0aH1cIlxuICBkZWJ1ZyAnXjMzMjReJywgcmVwby5nZXRTdGF0dXMoKSAjIyMgbWlzc2luZyB1bnRyYWNrZWQgZmlsZXMgIyMjXG4gIGRlYnVnICdeMzMyNF4nLCggcGtnX2ZzcGF0aCBmb3IgcGtnX2ZzcGF0aCwgc3RhdHVzIG9mIHJlcG8uZ2V0U3RhdHVzKCkgd2hlbiBzdGF0dXMgaXMgMSApICMjIyBtaXNzaW5nIHVudHJhY2tlZCBmaWxlcyAjIyNcbiAgaW5mbyAnXjU5MDleJywgZHBhbi5naXRfZ2V0X3N0YWdlZF9maWxlX3BhdGhzIHsgcGtnX2ZzcGF0aCwgfVxuICByZXR1cm4gbnVsbFxuXG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICAjIGF3YWl0IGRlbW9fZnNfd2Fsa19kZXBfaW5mb3MoKVxuICAjIGF3YWl0IGRlbW9fZGJfYWRkX3BhY2thZ2UoKVxuICAjIGF3YWl0IGRlbW9fZGJfYWRkX3BrZ19pbmZvKClcbiAgIyBhd2FpdCBkZW1vX2RiX2FkZF9wa2dfaW5mb3MoKVxuICAjIGF3YWl0IGRlbW9fZ2l0X2ZldGNoX3BrZ19zdGF0dXMoKVxuICBkZW1vX3Nob3dfcmVjZW50X2NvbW1pdHMoKVxuICBkZW1vX2dpdF9nZXRfZGlydHlfY291bnRzKClcbiAgIyBhd2FpdCBkZW1vX3ZhcmlhYmxlcygpXG4gICMgYXdhaXQgZGVtb19zdGFnZWRfZmlsZV9wYXRocygpXG5cblxuIl19
