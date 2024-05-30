(async function() {
  //===========================================================================================================
  'use strict';
  var GTNG, GUY, TT, TT2, TT3, Test, _TMP_test, after, alert, async_eq, async_test, async_throws, debug, echo, eq, equals, fail, help, info, inspect, isa, log, pass, plain, praise, reverse, rpr, test, throws, type_of, types, urge, validate, warn, whisper;

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
      var t2, ΩTT___1;
      t2 = new Test({
        show_report: false,
        prefix: "TEST RESULT"
      });
      this.eq((ΩTT___1 = function() {
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
        var matcher1, matcher2, result, sebv_3, sebv_4, ΩTT___2;
        result = [1, [2]];
        matcher1 = [1, [2]];
        matcher2 = [1, [3]];
        t2.eq((sebv_3 = function() {
          return equals(result, matcher1);
        }), true);
        t2.eq((sebv_4 = function() {
          return equals(result, matcher2);
        }), false);
        this.eq((ΩTT___2 = function() {
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
        var matcher1, matcher2, result, sebv_6, sebv_7, sebv_8, ΩTT___6;
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
        this./* is `false` */eq((ΩTT___6 = function() {
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
        var matcher1, matcher2, result, sebv10, sebv11, sebv12, sebv13, sebv14, ΩTT__13;
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
        this./* is `false` */eq((ΩTT__13 = function() {
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
      var t2, ΩTT__25, ΩTT__26, ΩTT__27, ΩTT__28, ΩTT__29, ΩTT__30, ΩTT__31, ΩTT__32, ΩTT__33, ΩTT__34, ΩTT__35, ΩTT__36;
      t2 = new Test();
      //.........................................................................................................
      this.eq((ΩTT__25 = function() {
        return type_of(t2.pass);
      }), 'function');
      this.eq((ΩTT__26 = function() {
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
      this.eq((ΩTT__27 = function() {
        return t2.stats['*'].passes;
      }), 2);
      this.eq((ΩTT__28 = function() {
        return t2.stats['paf_a.paf_1'].passes;
      }), 1);
      this.eq((ΩTT__29 = function() {
        return t2.stats['paf_a.paf_2'].passes;
      }), 0);
      this.eq((ΩTT__30 = function() {
        return t2.stats['paf_a.paf_3'].passes;
      }), 1);
      this.eq((ΩTT__31 = function() {
        return t2.stats['paf_a.paf_4'].passes;
      }), 0);
      this.eq((ΩTT__32 = function() {
        return t2.stats['*'].fails;
      }), 2);
      this.eq((ΩTT__33 = function() {
        return t2.stats['paf_a.paf_1'].fails;
      }), 0);
      this.eq((ΩTT__34 = function() {
        return t2.stats['paf_a.paf_2'].fails;
      }), 1);
      this.eq((ΩTT__35 = function() {
        return t2.stats['paf_a.paf_3'].fails;
      }), 0);
      this.eq((ΩTT__36 = function() {
        return t2.stats['paf_a.paf_4'].fails;
      }), 1);
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_throws: async function() {
      var FS, fetch_filesize, t2, ΩTT__40, ΩTT__41, ΩTT__42;
      FS = require('node:fs/promises');
      t2 = new Test();
      //.........................................................................................................
      fetch_filesize = async function(path) {
        return ((await FS.stat(path))).size;
      };
      //.........................................................................................................
      // await async_throws  T, ( ΩTT__37 = -> await fetch_filesize __filename   )
      // await async_throws  T, ( ΩTT__38 = -> await fetch_filesize __filename   ), "foobar"
      // await async_throws  T, ( ΩTT__39 = -> await fetch_filesize __filename   ), /no such file/
      //.........................................................................................................
      await t2.async_throws((ΩTT__40 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), "foobar");
      await t2.async_throws((ΩTT__41 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      await t2.async_throws((ΩTT__42 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }));
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_errors: async function() {
      var FS, fetch_filesize, produce_filesize, ΩTT__51;
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
          urge("ΩTT__47", {filesize});
        } catch (error1) {
          error = error1;
          warn("ΩTT__48", error);
        }
        return null;
      };
      //.........................................................................................................
      echo('-------------------');
      // try await produce_filesize 'nosuchpath' catch error then warn 'ΩTT__49', error.message
      await produce_filesize('nosuchpath');
      echo('-------------------');
      await produce_filesize(__filename);
      echo('-------------------');
      // await async_throws ( ΩTT__50 = -> await fetch_filesize __filename ), '???'
      await async_throws((ΩTT__51 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      echo('-------------------');
      return typeof done === "function" ? done() : void 0;
    },
    //---------------------------------------------------------------------------------------------------------
    test_cfg: function() {
      (() => {        //.........................................................................................................
        var t2, ΩTT__52, ΩTT__53, ΩTT__54, ΩTT__55, ΩTT__56, ΩTT__57, ΩTT__58, ΩTT__59, ΩTT__60;
        t2 = new Test();
        this.eq((ΩTT__52 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((ΩTT__53 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((ΩTT__54 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((ΩTT__55 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((ΩTT__56 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((ΩTT__57 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((ΩTT__58 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((ΩTT__59 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((ΩTT__60 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, ΩTT__61, ΩTT__62, ΩTT__63, ΩTT__64, ΩTT__65, ΩTT__66, ΩTT__67, ΩTT__68, ΩTT__69;
        t2 = new Test({});
        this.eq((ΩTT__61 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((ΩTT__62 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((ΩTT__63 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((ΩTT__64 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((ΩTT__65 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((ΩTT__66 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((ΩTT__67 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((ΩTT__68 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((ΩTT__69 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, ΩTT__70, ΩTT__71, ΩTT__72, ΩTT__73, ΩTT__74, ΩTT__75, ΩTT__76, ΩTT__77, ΩTT__78;
        t2 = new Test({
          message_width: 30,
          throw_on_error: true
        });
        this.eq((ΩTT__70 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((ΩTT__71 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((ΩTT__72 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((ΩTT__73 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((ΩTT__74 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((ΩTT__75 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((ΩTT__76 = function() {
          return t2.cfg.throw_on_error;
        }), true);
        this.eq((ΩTT__77 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        return this.eq((ΩTT__78 = function() {
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
          'ctof_1.ctof_2.Ωgt__79': {
            passes: 0,
            fails: 1
          }
        });
        this.eq((ctof_4 = function() {
          return t2.warnings;
        }), {
          'ctof_1.ctof_2.Ωgt__80': ['(noerr) expected an error but none was thrown']
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
        // @throws ( ΩTT__81 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
        return null;
      })();
      //.........................................................................................................
      return null;
    }
  };

  TT2 = {
    test_cfg: TT.test_cfg
  };

  TT3 = {
    demo_assumptions: function(ctx) {
      var line, ΩTT__82, ΩTT__83, ΩTT__84, ΩTT__85, ΩTT__90;
      line = '-'.repeat(108);
      //.........................................................................................................
      echo(line);
      this.eq((ΩTT__82 = function() {
        return this._upref;
      }), 'TT3.demo_assumptions');
      echo(line);
      this.eq((ΩTT__83 = function() {
        throw new Error("fine");
      }));
      echo(line);
      this.eq((ΩTT__84 = function() {
        return 32;
      }), 32);
      echo(line);
      this.eq((ΩTT__85 = function() {
        return 32;
      }), 33);
      echo(line);
      this.pass('ΩTT__86', 'test', "all fine");
      echo(line);
      this.pass('ΩTT__87', 'test');
      echo(line);
      echo(line);
      this.fail('ΩTT__88', 'test', "all fine");
      echo(line);
      this.fail('ΩTT__89', 'test');
      echo(line);
      this.throws((ΩTT__90 = function() {
        throw new Error("this is actually fine");
      }), /fine/);
      //.........................................................................................................
      return null;
    }
  };

  //===========================================================================================================
  if (module === require.main) {
    await (() => {
      return (() => {        // await async_test TT.asynchronous_throws
        // test TT.pass_and_fail
        // await async_test TT.pass_and_fail
        // test TT.test_cfg
        // ( new Test() ).test TT.can_throw_on_fail
        // ( new Test        { throw_on_error: true, } ).test        TT.can_throw_on_fail
        // await ( new Test  { throw_on_error: true, } ).async_test  TT.can_throw_on_fail
        // ( new Test() ).test TT
        // ( new Test() ).test { TT, }
        //.........................................................................................................
        // do =>
        //   ( new Test() ).test TT2.test_cfg
        //   ( new Test() ).test TT2
        //   ( new Test() ).test { TT2, }
        //.........................................................................................................
        // ( new Test() ).test TT3.demo_assumptions
        // ( new Test() ).test TT3
        // ( new Test( throw_on_error: true ) ).test { TT3, }
        return (new Test()).test({TT3});
      })();
    })();
  }

  //.........................................................................................................
// ( new Test()        ).test        TT.set_equality_by_value
// await ( new Test()  ).async_test  TT.set_equality_by_value
// await ( new Test() ).async_test TT

}).call(this);

//# sourceMappingURL=test-basics.js.map