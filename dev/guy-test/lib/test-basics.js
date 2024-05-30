(async function() {
  //===========================================================================================================
  'use strict';
  var GTNG, GUY, TT, Test, _TMP_test, after, alert, async_eq, async_test, async_throws, debug, demo_async, echo, eq, equals, fail, help, info, inspect, isa, log, pass, plain, praise, reverse, rpr, test, throws, type_of, types, urge, validate, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype/test-basics'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  ({after} = GUY.async);

  //-----------------------------------------------------------------------------------------------------------
  GTNG = require('../../../apps/guy-test-NG');

  ({_TMP_test, Test, equals, pass, fail, test, eq, throws, async_test, async_eq, async_throws} = GTNG);

  //-----------------------------------------------------------------------------------------------------------
  types = require('../../../apps/intertype');

  ({isa, type_of, validate} = types);

  //===========================================================================================================
  TT = {
    //---------------------------------------------------------------------------------------------------------
    set_equality_by_value: function() {
      var t2, Ωgtt___1;
      t2 = new Test({
        show_report: false,
        prefix: "TEST RESULT"
      });
      this.eq((Ωgtt___1 = function() {
        return t2.stats;
      }), {
        '*': {
          passes: 0,
          fails: 0
        }
      });
      (() => {        //.........................................................................................................
        var sebv_2;
        t2.eq((sebv_2 = function() {
          return 'abc';
        }), 'abc');
        return null;
      })();
      (() => {        //.........................................................................................................
        var matcher1, matcher2, result, sebv_3, sebv_4, Ωgtt___2;
        result = [1, [2]];
        matcher1 = [1, [2]];
        matcher2 = [1, [3]];
        t2.eq((sebv_3 = function() {
          return equals(result, matcher1);
        }), true);
        t2.eq((sebv_4 = function() {
          return equals(result, matcher2);
        }), false);
        this.eq((Ωgtt___2 = function() {
          return t2.stats;
        }), {
          '*': {
            passes: 3,
            fails: 0
          },
          'null.*': {
            passes: 3,
            fails: 0
          },
          'null.sebv_2.Ωgt___3': {
            passes: 1,
            fails: 0
          },
          'null.sebv_3.Ωgt___4': {
            passes: 1,
            fails: 0
          },
          'null.sebv_4.Ωgt___5': {
            passes: 1,
            fails: 0
          }
        });
        return null;
      })();
      (() => {        //.........................................................................................................
        var matcher1, matcher2, result, sebv_6, sebv_7, sebv_8, Ωgtt___6;
        result = new Set([1, 2]);
        matcher1 = new Set([1, 2]);
        matcher2 = new Set([1, 3]);
        t2.eq((sebv_6 = function() {
          return equals(result, matcher1);
        }), true);
        t2.eq((sebv_7 = function() {
          return equals(result, matcher2);
        }), false);
        t2.eq((sebv_8 = function() {
          return equals(result, matcher2);
        }), true);
        this./* is `false` */eq((Ωgtt___6 = function() {
          return t2.stats;
        }), {
          '*': {
            passes: 5,
            fails: 1
          },
          'null.*': {
            passes: 5,
            fails: 1
          },
          'null.sebv_2.Ωgt___7': {
            passes: 1,
            fails: 0
          },
          'null.sebv_3.Ωgt___8': {
            passes: 1,
            fails: 0
          },
          'null.sebv_4.Ωgt___9': {
            passes: 1,
            fails: 0
          },
          'null.sebv_6.Ωgt__10': {
            passes: 1,
            fails: 0
          },
          'null.sebv_7.Ωgt__11': {
            passes: 1,
            fails: 0
          },
          'null.sebv_8.Ωgt__12': {
            passes: 0,
            fails: 1
          }
        });
        return null;
      })();
      (() => {        //.........................................................................................................
        var matcher1, matcher2, result, sebv10, sebv11, sebv12, sebv13, sebv14, Ωgtt__13;
        result = new Set([1, [2]]);
        matcher1 = new Set([1, [2]]);
        matcher2 = new Set([1, [3]]);
        t2.eq((sebv10 = function() {
          return equals(result, matcher1);
        }), true);
        t2.eq((sebv11 = function() {
          return equals(result, matcher2);
        }), false);
        t2.eq((sebv12 = function() {
          return equals(result, matcher2);
        }), true);
        /* is `false` */        t2.eq((sebv13 = function() {
          return equals(result, matcher2);
        }), true);
        /* is `false` */        t2.eq((sebv14 = function() {
          return equals(result, matcher2);
        }), true);
        this./* is `false` */eq((Ωgtt__13 = function() {
          return t2.stats;
        }), {
          '*': {
            passes: 7,
            fails: 4
          },
          'null.*': {
            passes: 7,
            fails: 4
          },
          'null.sebv_2.Ωgt__14': {
            passes: 1,
            fails: 0
          },
          'null.sebv_3.Ωgt__15': {
            passes: 1,
            fails: 0
          },
          'null.sebv_4.Ωgt__16': {
            passes: 1,
            fails: 0
          },
          'null.sebv_6.Ωgt__17': {
            passes: 1,
            fails: 0
          },
          'null.sebv_7.Ωgt__18': {
            passes: 1,
            fails: 0
          },
          'null.sebv_8.Ωgt__19': {
            passes: 0,
            fails: 1
          },
          'null.sebv10.Ωgt__20': {
            passes: 1,
            fails: 0
          },
          'null.sebv11.Ωgt__21': {
            passes: 1,
            fails: 0
          },
          'null.sebv12.Ωgt__22': {
            passes: 0,
            fails: 1
          },
          'null.sebv13.Ωgt__23': {
            passes: 0,
            fails: 1
          },
          'null.sebv14.Ωgt__24': {
            passes: 0,
            fails: 1
          }
        });
        return null;
      })();
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    pass_and_fail: function() {
      var t2, Ωgtt__25, Ωgtt__26, Ωgtt__27, Ωgtt__28, Ωgtt__29, Ωgtt__30, Ωgtt__31, Ωgtt__32, Ωgtt__33, Ωgtt__34, Ωgtt__35, Ωgtt__36;
      t2 = new Test();
      //.........................................................................................................
      this.eq((Ωgtt__25 = function() {
        return type_of(t2.pass);
      }), 'function');
      this.eq((Ωgtt__26 = function() {
        return type_of(t2.fail);
      }), 'function');
      t2.test({
        paf_a: function() {
          t2.pass('paf_1', "this is good");
          t2.fail('paf_2', "this is bad");
          t2.pass('paf_3');
          return t2.fail('paf_4');
        }
      });
      t2.report({
        prefix: "TEST RESULT"
      });
      this.eq((Ωgtt__27 = function() {
        return t2.stats['*'].passes;
      }), 2);
      this.eq((Ωgtt__28 = function() {
        return t2.stats['paf_a.paf_1'].passes;
      }), 1);
      this.eq((Ωgtt__29 = function() {
        return t2.stats['paf_a.paf_2'].passes;
      }), 0);
      this.eq((Ωgtt__30 = function() {
        return t2.stats['paf_a.paf_3'].passes;
      }), 1);
      this.eq((Ωgtt__31 = function() {
        return t2.stats['paf_a.paf_4'].passes;
      }), 0);
      this.eq((Ωgtt__32 = function() {
        return t2.stats['*'].fails;
      }), 2);
      this.eq((Ωgtt__33 = function() {
        return t2.stats['paf_a.paf_1'].fails;
      }), 0);
      this.eq((Ωgtt__34 = function() {
        return t2.stats['paf_a.paf_2'].fails;
      }), 1);
      this.eq((Ωgtt__35 = function() {
        return t2.stats['paf_a.paf_3'].fails;
      }), 0);
      this.eq((Ωgtt__36 = function() {
        return t2.stats['paf_a.paf_4'].fails;
      }), 1);
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_throws: async function() {
      var FS, fetch_filesize, t2, Ωgtt__40, Ωgtt__41, Ωgtt__42;
      FS = require('node:fs/promises');
      t2 = new Test();
      //.........................................................................................................
      fetch_filesize = async function(path) {
        return ((await FS.stat(path))).size;
      };
      //.........................................................................................................
      // await async_throws  T, ( Ωgtt__37 = -> await fetch_filesize __filename   )
      // await async_throws  T, ( Ωgtt__38 = -> await fetch_filesize __filename   ), "foobar"
      // await async_throws  T, ( Ωgtt__39 = -> await fetch_filesize __filename   ), /no such file/
      //.........................................................................................................
      await t2.async_throws((Ωgtt__40 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), "foobar");
      await t2.async_throws((Ωgtt__41 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      await t2.async_throws((Ωgtt__42 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }));
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_errors: async function() {
      var FS, fetch_filesize, produce_filesize, Ωgtt__51;
      FS = require('node:fs/promises');
      //.........................................................................................................
      fetch_filesize = async function(path) {
        return ((await FS.stat(path))).size;
      };
      //.........................................................................................................
      produce_filesize = async(path) => {
        var error, filesize;
        try {
          filesize = (await fetch_filesize(path));
          urge("Ωgtt__47", {filesize});
        } catch (error1) {
          error = error1;
          warn("Ωgtt__48", error);
        }
        return null;
      };
      //.........................................................................................................
      echo('-------------------');
      // try await produce_filesize 'nosuchpath' catch error then warn 'Ωgtt__49', error.message
      await produce_filesize('nosuchpath');
      echo('-------------------');
      await produce_filesize(__filename);
      echo('-------------------');
      // await async_throws ( Ωgtt__50 = -> await fetch_filesize __filename ), '???'
      await async_throws((Ωgtt__51 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      echo('-------------------');
      return typeof done === "function" ? done() : void 0;
    },
    //---------------------------------------------------------------------------------------------------------
    test_cfg: function() {
      (() => {        //.........................................................................................................
        var t2, Ωgtt__52, Ωgtt__53, Ωgtt__54, Ωgtt__55, Ωgtt__56, Ωgtt__57, Ωgtt__58, Ωgtt__59, Ωgtt__60;
        t2 = new Test();
        this.eq((Ωgtt__52 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ωgtt__53 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ωgtt__54 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ωgtt__55 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ωgtt__56 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ωgtt__57 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ωgtt__58 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((Ωgtt__59 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((Ωgtt__60 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, Ωgtt__61, Ωgtt__62, Ωgtt__63, Ωgtt__64, Ωgtt__65, Ωgtt__66, Ωgtt__67, Ωgtt__68, Ωgtt__69;
        t2 = new Test({});
        this.eq((Ωgtt__61 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ωgtt__62 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ωgtt__63 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ωgtt__64 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ωgtt__65 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ωgtt__66 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ωgtt__67 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((Ωgtt__68 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((Ωgtt__69 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, Ωgtt__70, Ωgtt__71, Ωgtt__72, Ωgtt__73, Ωgtt__74, Ωgtt__75, Ωgtt__76, Ωgtt__77, Ωgtt__78;
        t2 = new Test({
          message_width: 30,
          throw_on_error: true
        });
        this.eq((Ωgtt__70 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ωgtt__71 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ωgtt__72 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ωgtt__73 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ωgtt__74 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ωgtt__75 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ωgtt__76 = function() {
          return t2.cfg.throw_on_error;
        }), true);
        this.eq((Ωgtt__77 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        return this.eq((Ωgtt__78 = function() {
          return t2.cfg.message_width;
        }), 30);
      })();
      //.........................................................................................................
      return null;
    },
    //---------------------------------------------------------------------------------------------------------
    can_throw_on_fail: function() {
      (() => {        //.........................................................................................................
        /* ensure that `Test` instance complains when no error is thrown inside a `throws()` check: */
        var ctof_3, ctof_4, t2;
        t2 = new Test({
          throw_on_error: false,
          show_report: false,
          prefix: '**T2_1**'
        });
        t2.test({
          ctof_1: function() {
            var ctof_2;
            return t2.throws((ctof_2 = function() {
              return 32;
            }), /expected an error/);
          }
        });
        this.eq((ctof_3 = function() {
          return t2.stats;
        }), {
          '*': {
            passes: 0,
            fails: 1
          },
          'ctof_1.*': {
            passes: 0,
            fails: 1
          },
          'ctof_1.ctof_2.Ωgt__80': {
            passes: 0,
            fails: 1
          }
        });
        this.eq((ctof_4 = function() {
          return t2.warnings;
        }), {
          'ctof_1.ctof_2.Ωgt__23': ['(noerr) expected an error but none was thrown']
        });
        return null;
      })();
      (() => {        //.........................................................................................................
        var ctof_5, t2;
        t2 = new Test({
          throw_on_error: false,
          throw_on_fail: true,
          show_report: false,
          prefix: '**T2_2**'
        });
        this.throws((ctof_5 = function() {
          var ctof_6;
          return t2.eq((ctof_6 = function() {
            return 14;
          }), 15);
        }), /neq:/);
        // @throws ( Ωgtt__84 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
        return null;
      })();
      //.........................................................................................................
      return null;
    }
  };

  //===========================================================================================================
  demo_async = function() {
    var _, count, create_task, i, ref;
    count = 0;
    ref = null;
    create_task = function() {
      return new Promise(function(resolve) {
        var dt;
        count++;
        dt = Math.round(Math.random() * 1000);
        ref = `task_${count}`;
        (function(count, dt) {
          help('Ωgt__10', `(${count} ${rpr(dt)} ${ref}`);
          return after(dt / 1000, function() {
            warn('Ωgt__10', `${count}) ${ref}`);
            ref = null;
            return resolve();
          });
        })(count, dt);
        return null;
      });
    };
    for (_ = i = 1; i <= 3; _ = ++i) {
      create_task();
    }
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // await async_test TT.asynchronous_throws
      // test TT.pass_and_fail
      // await async_test TT.pass_and_fail
      // test TT.test_cfg
      // ( new Test() ).test TT.can_throw_on_fail
      // ( new Test        { throw_on_error: true, } ).test        TT.can_throw_on_fail
      // await ( new Test  { throw_on_error: true, } ).async_test  TT.can_throw_on_fail
      return (await demo_async());
    })();
  }

  // ( new Test() ).test TT
// ( new Test()        ).test        TT.set_equality_by_value
// await ( new Test()  ).async_test  TT.set_equality_by_value
// await ( new Test() ).async_test TT

}).call(this);

//# sourceMappingURL=test-basics.js.map