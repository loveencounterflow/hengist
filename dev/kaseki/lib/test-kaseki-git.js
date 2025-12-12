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
            local_branch: 'main',
            remote_branch: null,
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 1
          });
        }
        local._add_and_commit_all("first!");
        local.ic.spawn('git', 'branch', '-m', 'main', 'renamed');
        info('^76-4^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'renamed',
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
        local.ic.spawn('git', 'push', '-u', 'hoopla', 'renamed');
        //.....................................................................................................
        info('^76-6^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'renamed',
            remote_branch: 'hoopla/renamed',
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 0
          });
        }
        //.....................................................................................................
        FS.appendFileSync(PATH.join(work_path, 'foo.txt'), "helo world");
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'renamed',
            remote_branch: 'hoopla/renamed',
            ahead_count: 0,
            behind_count: 0,
            dirty_count: 1
          });
        }
        local._add_and_commit_all("second!");
        info('^76-7^', local.status());
        if (T != null) {
          T.eq(local.status(), {
            local_branch: 'renamed',
            remote_branch: 'hoopla/renamed',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3Rlc3Qta2FzZWtpLWdpdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUEsRUFBQSxFQUFBLEdBQUEsRUFBQSxDQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLEtBQUEsRUFBQSxNQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsZ0JBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7O0VBSUEsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsQ0FBQSxDQUFFLEtBQUYsRUFDRSxLQURGLEVBRUUsSUFGRixFQUdFLElBSEYsRUFJRSxLQUpGLEVBS0UsTUFMRixFQU1FLElBTkYsRUFPRSxJQVBGLEVBUUUsT0FSRixDQUFBLEdBUTRCLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBUixDQUFvQixvQkFBcEIsQ0FSNUI7O0VBU0EsQ0FBQSxDQUFFLEdBQUYsRUFDRSxPQURGLEVBRUUsSUFGRixFQUdFLEdBSEYsQ0FBQSxHQUc0QixHQUFHLENBQUMsR0FIaEMsRUFkQTs7O0VBbUJBLElBQUEsR0FBNEIsT0FBQSxDQUFRLHdCQUFSOztFQUM1QixJQUFBLEdBQTRCLE9BQUEsQ0FBUSxNQUFSLEVBcEI1Qjs7O0VBc0JBLEtBQUEsR0FBNEIsSUFBSSxDQUFFLE9BQUEsQ0FBUSxXQUFSLENBQUYsQ0FBdUIsQ0FBQyxTQUE1QixDQUFBOztFQUM1QixDQUFBLENBQUUsR0FBRixFQUNFLE1BREYsRUFFRSxPQUZGLEVBR0UsUUFIRixFQUlFLGdCQUpGLENBQUEsR0FJNEIsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUo1Qjs7RUFLQSxDQUFBLEdBQTRCLE9B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QUFoQjtZQUEyQixhQUFBLEVBQWUsZ0JBQTFDO1lBQTRELFdBQUEsRUFBYSxDQUF6RTtZQUE0RSxZQUFBLEVBQWMsQ0FBMUY7WUFBNkYsV0FBQSxFQUFhO1VBQTFHLENBQXRCOztRQUNBLElBQUEsQ0FBSyxRQUFMLEVBQWUsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFULENBQWUsS0FBZixFQUFzQixLQUF0QixFQUE2QixtQ0FBN0IsRUFBa0UseUJBQWxFLENBQWY7ZUFDQSxJQUFBLENBQUssUUFBTCxFQUFlLEtBQUssQ0FBQyxHQUFOLENBQVU7VUFBRSxLQUFBLEVBQU87UUFBVCxDQUFWLENBQWY7TUE3QnNCLENBQXhCO0lBWHNCLENBQXhCO3dDQTBDQTtFQTdDc0IsRUFqQ3hCOzs7RUFtRkEsSUFBRyxNQUFBLEtBQVUsT0FBTyxDQUFDLElBQXJCO0lBQWtDLENBQUEsQ0FBQSxDQUFBLEdBQUE7TUFDaEMsSUFBQyxDQUFBLG9CQUFELENBQUE7TUFDQSxJQUFBLENBQUssSUFBQyxDQUFBLG9CQUFOO0FBQ0EsYUFBTztJQUh5QixDQUFBLElBQWxDOztBQW5GQSIsInNvdXJjZXNDb250ZW50IjpbIlxuJ3VzZSBzdHJpY3QnXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5HVVkgICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5J1xueyBhbGVydFxuICBkZWJ1Z1xuICBoZWxwXG4gIGluZm9cbiAgcGxhaW5cbiAgcHJhaXNlXG4gIHVyZ2VcbiAgd2FyblxuICB3aGlzcGVyIH0gICAgICAgICAgICAgICA9IEdVWS50cm0uZ2V0X2xvZ2dlcnMgJ0tBU0VLSS9URVNUUy9CQVNJQydcbnsgcnByXG4gIGluc3BlY3RcbiAgZWNob1xuICBsb2cgICAgIH0gICAgICAgICAgICAgICA9IEdVWS50cm1cbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG5QQVRIICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcbiMgRlMgICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2ZzJ1xudHlwZXMgICAgICAgICAgICAgICAgICAgICA9IG5ldyAoIHJlcXVpcmUgJ2ludGVydHlwZScgKS5JbnRlcnR5cGVcbnsgaXNhXG4gIGVxdWFsc1xuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIHZhbGlkYXRlX2xpc3Rfb2YgfSAgICAgID0gdHlwZXMuZXhwb3J0KClcbkggICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICcuLi8uLi8uLi9saWIvaGVscGVycydcbkZTICAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdub2RlOmZzJ1xuXG5cbiMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuQGthc2VraV9naXRfc3RhdHVzX3NiID0gKCBULCBkb25lICkgLT5cbiAgeyBHaXQgfSA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMva2FzZWtpJ1xuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIEdVWS50ZW1wLndpdGhfZGlyZWN0b3J5ICh7IHBhdGg6IHJlbW90ZV9wYXRoLCB9KSAtPlxuICAgIHJlbW90ZSA9IG5ldyBHaXQgeyB3b3JrX3BhdGg6IHJlbW90ZV9wYXRoLCByZXBvX3BhdGg6IHJlbW90ZV9wYXRoLCB9XG4gICAgcmVtb3RlLmljLnNwYXduICdnaXQnLCAnaW5pdCcsICctLWJhcmUnXG4gICAgIyByZW1vdGUuaWMuc3Bhd24gJ2dpdCcsICdicmFuY2gnLCAnLW0nLCAnbWFzdGVyJywgJ21haW4nXG4gICAgIyByZW1vdGUuaWMuc3Bhd24gJ2dpdCcsICdjaGVja291dCcsICctYicsICdtYWluJ1xuICAgICMgcmVtb3RlLmljLnNwYXduICdnaXQnLCAnc3ltYm9saWMtcmVmJywgJ0hFQUQnLCAncmVmcy9oZWFkcy9tYWluJ1xuICAgIHVyZ2UgJ143Ni0xXicsIEZTLnJlYWRkaXJTeW5jIHJlbW90ZV9wYXRoXG4gICAgVD8uZXEgKCBGUy5yZWFkZGlyU3luYyByZW1vdGVfcGF0aCApLCBbICdIRUFEJywgJ2JyYW5jaGVzJywgJ2NvbmZpZycsICdkZXNjcmlwdGlvbicsICdob29rcycsICdpbmZvJywgJ29iamVjdHMnLCAncmVmcycgXVxuICAgICMgZWNobyAnLS0tJzsgZWNobyByZW1vdGUuaWMuc3Bhd24gJ2dpdCcsICdicmFuY2gnLCAnLW0nLCAnbWFzdGVyJywgJ21haW4nXG4gICAgZWNobyAnLS0tJzsgZWNobyByZW1vdGUuaWMuc3Bhd24gJ2dpdCcsICdicmFuY2gnXG4gICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICBHVVkudGVtcC53aXRoX2RpcmVjdG9yeSAoeyBwYXRoOiB3b3JrX3BhdGgsIH0pIC0+XG4gICAgICByZXBvX3BhdGggICAgID0gUEFUSC5qb2luIHdvcmtfcGF0aCwgJy5naXQnXG4gICAgICBkZWJ1ZyAnXjc2LTJeJywgeyB3b3JrX3BhdGgsIHJlcG9fcGF0aCwgfVxuICAgICAgbG9jYWwgICAgICAgICA9IG5ldyBHaXQgeyB3b3JrX3BhdGgsIHJlcG9fcGF0aCwgfVxuICAgICAgdHJ5IGxvY2FsLl9naXRfc3RhdHVzX3NiKCkgY2F0Y2ggZXJyb3IgdGhlbiB3YXJuIEdVWS50cm0ucmV2ZXJzZSBlcnJvci5tZXNzYWdlXG4gICAgICBsb2NhbC5fZ2l0X2luaXQoKVxuICAgICAgRlMud3JpdGVGaWxlU3luYyAoIFBBVEguam9pbiB3b3JrX3BhdGgsICdmb28udHh0JywgKSwgXCJoZWxvIHdvcmxkXCJcbiAgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICAgICAgaW5mbyAnXjc2LTNeJywgbG9jYWwuc3RhdHVzKClcbiAgICAgIFQ/LmVxIGxvY2FsLnN0YXR1cygpLCB7IGxvY2FsX2JyYW5jaDogJ21haW4nLCByZW1vdGVfYnJhbmNoOiBudWxsLCBhaGVhZF9jb3VudDogMCwgYmVoaW5kX2NvdW50OiAwLCBkaXJ0eV9jb3VudDogMSB9XG4gICAgICBsb2NhbC5fYWRkX2FuZF9jb21taXRfYWxsIFwiZmlyc3QhXCJcbiAgICAgIGxvY2FsLmljLnNwYXduICdnaXQnLCAnYnJhbmNoJywgJy1tJywgJ21haW4nLCAncmVuYW1lZCdcbiAgICAgIGluZm8gJ143Ni00XicsIGxvY2FsLnN0YXR1cygpXG4gICAgICBUPy5lcSBsb2NhbC5zdGF0dXMoKSwgeyBsb2NhbF9icmFuY2g6ICdyZW5hbWVkJywgcmVtb3RlX2JyYW5jaDogbnVsbCwgYWhlYWRfY291bnQ6IDAsIGJlaGluZF9jb3VudDogMCwgZGlydHlfY291bnQ6IDAgfVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBsb2NhbC5pYy5zcGF3biAnZ2l0JywgJ3JlbW90ZScsICdhZGQnLCAnaG9vcGxhJywgcmVtb3RlX3BhdGhcbiAgICAgICMgbG9jYWwuaWMuc3Bhd24gJ2dpdCcsICdicmFuY2gnLCAnLS1zZXQtdXBzdHJlYW0tdG8nLCAnbWFpbicsICdob29wbGEvbWFpbidcbiAgICAgIGluZm8gJ143Ni01XicsIGxvY2FsLnN0YXR1cygpXG4gICAgICBsb2NhbC5pYy5zcGF3biAnZ2l0JywgJ3B1c2gnLCAnLXUnLCAnaG9vcGxhJywgJ3JlbmFtZWQnXG4gICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgICAgIGluZm8gJ143Ni02XicsIGxvY2FsLnN0YXR1cygpXG4gICAgICBUPy5lcSBsb2NhbC5zdGF0dXMoKSwgeyBsb2NhbF9icmFuY2g6ICdyZW5hbWVkJywgcmVtb3RlX2JyYW5jaDogJ2hvb3BsYS9yZW5hbWVkJywgYWhlYWRfY291bnQ6IDAsIGJlaGluZF9jb3VudDogMCwgZGlydHlfY291bnQ6IDAgfVxuICAgICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gICAgICBGUy5hcHBlbmRGaWxlU3luYyAoIFBBVEguam9pbiB3b3JrX3BhdGgsICdmb28udHh0JywgKSwgXCJoZWxvIHdvcmxkXCJcbiAgICAgIFQ/LmVxIGxvY2FsLnN0YXR1cygpLCB7IGxvY2FsX2JyYW5jaDogJ3JlbmFtZWQnLCByZW1vdGVfYnJhbmNoOiAnaG9vcGxhL3JlbmFtZWQnLCBhaGVhZF9jb3VudDogMCwgYmVoaW5kX2NvdW50OiAwLCBkaXJ0eV9jb3VudDogMSB9XG4gICAgICBsb2NhbC5fYWRkX2FuZF9jb21taXRfYWxsIFwic2Vjb25kIVwiXG4gICAgICBpbmZvICdeNzYtN14nLCBsb2NhbC5zdGF0dXMoKVxuICAgICAgVD8uZXEgbG9jYWwuc3RhdHVzKCksIHsgbG9jYWxfYnJhbmNoOiAncmVuYW1lZCcsIHJlbW90ZV9icmFuY2g6ICdob29wbGEvcmVuYW1lZCcsIGFoZWFkX2NvdW50OiAxLCBiZWhpbmRfY291bnQ6IDAsIGRpcnR5X2NvdW50OiAwIH1cbiAgICAgIHVyZ2UgJ143Ni04XicsIGxvY2FsLmljLnNwYXduICdnaXQnLCAnbG9nJywgXCItLXByZXR0eT1mb3JtYXQ6JyVoJXgwOSVjSSV4MDklcydcIiwgJy0tc2luY2U9XCIxMiBtb250aHMgYWdvXCInXG4gICAgICB1cmdlICdeNzYtOV4nLCBsb2NhbC5sb2cgeyBzaW5jZTogJzEyIG1vbnRocyBhZ28nLCB9XG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZT8oKVxuXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiAgQGthc2VraV9naXRfc3RhdHVzX3NiKClcbiAgdGVzdCBAa2FzZWtpX2dpdF9zdGF0dXNfc2JcbiAgcmV0dXJuIG51bGxcblxuIl19
