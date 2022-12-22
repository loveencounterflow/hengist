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
  this.kaseki_zero = function(T, done) {
    var Fossil;
    ({Fossil} = require('../../../apps/kaseki'));
    GUY.temp.with_directory(function({
        path: repo_home
      }) {
      return GUY.temp.with_directory(function({
          path: work_path
        }) {
        var error, k, ksk, readme_path, ref, repo_path, strange_name, v;
        debug('^98-1^', rpr(repo_home));
        debug('^98-2^', rpr(work_path));
        repo_path = PATH.join(repo_home, 'kaseki-demo.fossil');
        ksk = new Fossil({repo_path, work_path});
        info('^98-3^', rpr(ksk.lns_version()));
        // 'This is fossil version 2.21 [3e95d94583] 2022-11-30 11:44:26 UTC'
        if (T != null) {
          T.ok(/^This is fossil version .*UTC$/.test(ksk.lns_version()));
        }
        //.....................................................................................................
        if (T != null) {
          T.eq(ksk.init(), null);
        }
        if (T != null) {
          T.eq(ksk.init(), null);
        }
        try {
          ksk.init({
            if_exists: 'error'
          });
        } catch (error1) {
          error = error1;
          warn(GUY.trm.reverse(error.message));
        }
        if (T != null) {
          T.throws(/when trying to `init` rep.* an error occurred.*file already exists/, function() {
            return ksk.init({
              if_exists: 'error'
            });
          });
        }
        //.....................................................................................................
        urge('^98-26^', FS.readdirSync(repo_home));
        urge('^98-27^', FS.readdirSync(work_path));
        urge('^98-6^', ksk.open());
        urge('^98-7^', ksk.list_file_names());
        urge('^98-8^', ksk.list_file_paths());
        urge('^98-9^', ksk.ls());
        //.....................................................................................................
        readme_path = PATH.join(work_path, 'README.md');
        FS.writeFileSync(readme_path, `# MyProject

A fancy text explaing MyProject.`);
        help('^98-10^', rpr(ksk.ic.spawn('fossil', 'changes')));
        urge('^98-11^', ksk.add(readme_path));
        urge('^98-12^', ksk.commit("add README.md"));
        urge('^98-13^', ksk.list_file_names());
        //.....................................................................................................
        FS.appendFileSync(readme_path, "\n\nhelo");
        strange_name = '  strange.txt';
        FS.appendFileSync(PATH.join(work_path, strange_name), "\n\nhelo");
        help('^98-14^', rpr(ksk.ic.spawn('fossil', 'changes')));
        help('^98-15^', rpr(ksk.ic.spawn('fossil', 'extras')));
        help('^98-16^', rpr(ksk.add(strange_name)));
        urge('^98-17^', ksk.commit("add file with strange name"));
        help('^98-18^', rpr(ksk.lns_changes()));
        //.....................................................................................................
        FS.appendFileSync(PATH.join(work_path, strange_name), "\n\nhelo again");
        help('^98-19^', rpr(ksk.lns_changes()));
        help('^98-19^', rpr(ksk.list_of_changes()));
        help('^98-19^', rpr(ksk.has_changes()));
        help('^98-19^', rpr(ksk.changes_by_file()));
        //.....................................................................................................
        urge('^98-22^', ksk._status());
        help('^98-23^', ksk.status());
        ref = ksk.status();
        for (k in ref) {
          v = ref[k];
          info('^98-24^', k.padEnd(20), v);
        }
        help('^98-25^', ksk.list_file_names());
        urge('^98-26^', FS.readdirSync(repo_home));
        return urge('^98-27^', FS.readdirSync(work_path));
      });
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.kaseki_create_doc_workflow_for_consuming_app = function(T, done) {
    var Fossil;
    /*

    An app (e.g. DataMill, the 'client' app) that uses KaSeki to provide a single-file format that is a
    container of multiple individual files (text souirces, images, stylesheets &c) would have to tell KaSeki

    * the location of the 'repo' (i.e. the single container of any number of versioned document sources);
      let's call it `my-first-doc.datamill`, and

    * the location where to unpack the repo; let's call it the 'working path'.

    There are two interesting ways to organize these two locations: one approach is the one advocated by []()

     */
    /* NOTE fossil apparently passes the 'mirror test' i.e. when the repo is present in the checkout folder
         it will *not* be listed by the `fossil extras` command, although a copy of it will (which seems to
         indicate that fossil tests not against a file not being a fossil repo but specifically the repo that
         is connected to the current project) */
    //.........................................................................................................
    ({Fossil} = require('../../../apps/kaseki'));
    GUY.temp.with_directory(function({
        path: work_path
      }) {
      var ksk, repo_path;
      debug('^99-1^', rpr(work_path));
      repo_path = work_path;
      ksk = new Fossil({work_path, repo_path});
      info('^99-3^', rpr(ksk.lns_version()));
      urge('^99-26^', FS.readdirSync(repo_path));
      return urge('^99-27^', FS.readdirSync(work_path));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.kaseki_as_cli_parameters = function(T, done) {
    var _as_cli_parameters, error;
    //.........................................................................................................
    ({_as_cli_parameters} = require('../../../apps/kaseki'));
    if (T != null) {
      T.eq(type_of(_as_cli_parameters), 'function');
    }
    if (T != null) {
      T.eq(_as_cli_parameters(), []);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({}), []);
    }
    if (T != null) {
      T.eq(_as_cli_parameters('x'), ['x']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters(42), ['42']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters(42, 'x'), ['42', 'x']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters(true), ['true']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters(false), ['false']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({
        x: 42
      }), ['-x', '42']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({
        extra: 42
      }), ['--extra', '42']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({
        foo_bar: 42
      }), ['--foo-bar', '42']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({
        x: null
      }), ['-x']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters({
        x: null
      }, '--', 'foo'), ['-x', '--', 'foo']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters('-x'), ['-x']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters('--x'), ['--x']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters('-xxx'), ['-xxx']);
    }
    if (T != null) {
      T.eq(_as_cli_parameters('--xxx'), ['--xxx']);
    }
    try {
      _as_cli_parameters({
        '': 42
      });
    } catch (error1) {
      error = error1;
      warn(GUY.trm.reverse(error.message));
    }
    if (T != null) {
      T.throws(/detected empty key/, function() {
        return _as_cli_parameters({
          '': 42
        });
      });
    }
    debug('^87-1^', _as_cli_parameters());
    debug('^87-1^', _as_cli_parameters({}));
    debug('^87-1^', _as_cli_parameters({
      x: 42
    }));
    debug('^87-4^', _as_cli_parameters({
      x: null
    }));
    debug('^87-5^', _as_cli_parameters({
      extra: null
    }));
    debug('^87-6^', _as_cli_parameters({
      x: 42,
      y: {
        x: 42
      }
    }));
    debug('^87-6^', _as_cli_parameters({
      x: null
    }, '--', 'foo'));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.kaseki_generated_methods = function(T, done) {
    var Fossil;
    ({Fossil} = require('../../../apps/kaseki'));
    //.........................................................................................................
    GUY.temp.with_directory(function({
        path: work_path
      }) {
      var doc_path, ksk, repo_path;
      repo_path = PATH.join(work_path, 'myname.fossil');
      doc_path = PATH.join(work_path, 'somefile.txt');
      debug('^76-4^', {work_path, repo_path, doc_path});
      ksk = new Fossil({work_path, repo_path});
      // debug '^76-1^', ksk.lns_version()
      // debug '^76-2^', ksk.ic.spawn 'fossil', 'version'
      // debug '^76-3^', ksk.ic._spawn_inner 'fossil', 'version'
      debug('^76-4^', ksk.lns_init({
        project_name: 'myname'
      }, repo_path));
      urge('^76-5^', FS.readdirSync(work_path));
      debug('^76-6^', ksk.raw_version());
      debug('^76-7^', ksk.lns_open('--keep', repo_path));
      FS.writeFileSync(doc_path, "some file contents");
      urge('^76-8^', FS.readdirSync(work_path));
      debug('^76-10^', ksk.lns_status('--extra'));
      debug('^76-11^', ksk.lns_add());
      return debug('^76-10^', ksk.lns_status('--extra'));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      this.kaseki_zero();
      // @kaseki_generated_methods()
      // @kaseki_as_cli_parameters()
      // test @kaseki_as_cli_parameters
      // @kaseki_create_doc_workflow_for_consuming_app()
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map