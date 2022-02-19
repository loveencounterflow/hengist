(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, demo_gitlog, demo_gitutils, demo_nodegit, echo, glob, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DEMO-NODE-GIT-MODULES';

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

  glob = require('glob');

  PATH = require('path');

  FS = require('fs');

  //-----------------------------------------------------------------------------------------------------------
  demo_nodegit = async function() {
    var NodeGit, d, i, len, pkg_fspath, repo, status;
    NodeGit = require('nodegit');
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    repo = (await NodeGit.Repository.open(pkg_fspath));
    status = (await repo.getStatus());
    for (i = 0, len = status.length; i < len; i++) {
      d = status[i];
      info(d);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_gitutils = function() {
    var GU, abc, acc, bcc, dfc, obj_fspath, pkg_fspath, ref, repo, snr, status_from_snr;
    GU = require('git-utils');
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    help('^353^', {pkg_fspath});
    repo = GU.open(pkg_fspath);
    urge(repo);
    //.........................................................................................................
    status_from_snr = (snr) => {
      var R, count;
      R = {};
      count = 0;
      if (repo.isStatusIgnored(snr)) {
        (R.ignored = true, count++);
      }
      if (repo.isStatusModified(snr)) {
        (R.modified = true, count++);
      }
      if (repo.isStatusNew(snr)) {
        (R.new = true, count++);
      }
      if (repo.isStatusDeleted(snr)) {
        (R.deleted = true, count++);
      }
      if (repo.isStatusStaged(snr)) {
        (R.staged = true, count++);
      }
      if (count === 0) {
        R.unknown = true;
      }
      return R;
    };
    //.........................................................................................................
    // refs = repo.getReferences()
    // for remote in refs.remotes
    //   info remote
    abc = repo.getAheadBehindCount('HEAD');
    acc = abc.ahead/* ACC, ahead-commit  count */
    bcc = abc.behind/* BCC, behind-commit count */
    dfc = 0/* DFC, dirty file    count */
    ref = repo.getStatus();
    for (obj_fspath in ref) {
      snr = ref[obj_fspath];
      dfc++;
      info(snr, obj_fspath, status_from_snr(snr));
    }
    help("dfc:            ", dfc);
    help("acc:            ", acc);
    help("bcc:            ", bcc);
    help("head:           ", repo.getHead());
    urge(repo.getUpstreamBranch());
    // urge repo.getReferenceTarget 'refs/remotes/origin/HEAD'
    // help 'commits:',        repo.getCommitCount()
    repo.release();
    // debug ( k for k of repo ).sort()
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_gitlog = function() {
    var cfg, commit, commit_count, commits, date, file_count, gitlog, i, len, pkg_fspath, ref, short_hash, subject;
    gitlog = (require('gitlog')).default;
    pkg_fspath = '../../../';
    pkg_fspath = PATH.resolve(PATH.join(__dirname, pkg_fspath));
    cfg = {
      repo: pkg_fspath,
      number: 1e6,
      // fields: ["hash", "abbrevHash", "subject", "authorName", "authorDateRel"],
      execOptions: {
        maxBuffer: 1000 * 1024
      }
    };
    commits = gitlog(cfg);
    commit_count = commits.length;
    info("commit_count:", commit_count);
    ref = commits.slice(0, 11);
    for (i = 0, len = ref.length; i < len; i++) {
      commit = ref[i];
      file_count = commit.files.length;
      short_hash = commit.abbrevHash;
      date = commit.authorDate;
      subject = to_width(commit.subject, 100);
      subject = subject.trim();
      urge(file_count, short_hash, date, subject);
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_nodegit()
      await demo_gitutils();
      return (await demo_gitlog());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-node-git-modules.js.map