(function() {
  'use strict';
  var FS, GUY, H, PATH, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('KASEKI/TESTS/BASIC'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('../../../lib/helpers');

  FS = require('node:fs');

  //-----------------------------------------------------------------------------------------------------------
  this.kaseki_git_status_sb = function(T, done) {
    var Git;
    ({Git} = require('../../../apps/kaseki'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: remote_path
      }) {
      var remote;
      remote = new Git({
        work_path: remote_path,
        repo_path: remote_path
      });
      remote.ic.spawn('git', 'init', '--bare');
      // remote.ic.spawn 'git', 'branch', '-m', 'master', 'main'
      // remote.ic.spawn 'git', 'checkout', '-b', 'main'
      // remote.ic.spawn 'git', 'symbolic-ref', 'HEAD', 'refs/heads/main'
      urge('^76-1^', FS.readdirSync(remote_path));
      if (T != null) {
        T.eq(FS.readdirSync(remote_path), ['HEAD', 'branches', 'config', 'description', 'hooks', 'info', 'objects', 'refs']);
      }
      // echo '---'; echo remote.ic.spawn 'git', 'branch', '-m', 'master', 'main'
      echo('---');
      echo(remote.ic.spawn('git', 'branch'));
      //.......................................................................................................
      return GUY.temp.with_directory(function({
          path: work_path
        }) {
        var error, local, repo_path;
        repo_path = PATH.join(work_path, '.git');
        debug('^76-2^', {work_path, repo_path});
        local = new Git({work_path, repo_path});
        try {
          local._git_status_sb();
        } catch (error1) {
          error = error1;
          warn(GUY.trm.reverse(error.message));
        }
        local._git_init();
        FS.writeFileSync(PATH.join(work_path, 'foo.txt'), "helo world");
        //.....................................................................................................
        info('^76-3^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'master',
            remote_branch: null,
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 1
          });
        }
        local._add_and_commit_all("first!");
        local.ic.spawn('git', 'branch', '-m', 'master', 'main');
        info('^76-4^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'main',
            remote_branch: null,
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 0
          });
        }
        //.....................................................................................................
        local.ic.spawn('git', 'remote', 'add', 'hoopla', remote_path);
        // local.ic.spawn 'git', 'branch', '--set-upstream-to', 'main', 'hoopla/main'
        info('^76-5^', local.status());
        local.ic.spawn('git', 'push', '-u', 'hoopla', 'main');
        //.....................................................................................................
        info('^76-6^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'main',
            remote_branch: 'hoopla/main',
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 0
          });
        }
        //.....................................................................................................
        FS.appendFileSync(PATH.join(work_path, 'foo.txt'), "helo world");
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'main',
            remote_branch: 'hoopla/main',
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 1
          });
        }
        local._add_and_commit_all("second!");
        info('^76-7^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'main',
            remote_branch: 'hoopla/main',
            ahead_count: 1,
            behind_count: 0,
            dirty_count: 0
          });
        }
        urge('^76-8^', local.ic.spawn('git', 'log', "--pretty=format:'%h%x09%cI%x09%s'", '--since="12 months ago"'));
        return urge('^76-9^', local.log({
          since: '12 months ago'
        }));
      });
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      this.kaseki_git_status_sb();
      test(this.kaseki_git_status_sb);
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=test-kaseki-git.js.map