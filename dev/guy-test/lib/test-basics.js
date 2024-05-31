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
      var t2, Ω___1;
      t2 = new Test({
        show_report: false,
        prefix: "TEST RESULT"
      });
      this.eq((Ω___1 = function() {
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
        var matcher1, matcher2, result, sebv_3, sebv_4, Ω___2;
        result = [1, [2]];
        matcher1 = [1, [2]];
        matcher2 = [1, [3]];
        t2.eq((sebv_3 = function() {
          return equals(result, matcher1);
        }), true);
        t2.eq((sebv_4 = function() {
          return equals(result, matcher2);
        }), false);
        this.eq((Ω___2 = function() {
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
        var matcher1, matcher2, result, sebv_6, sebv_7, sebv_8, Ω___6;
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
        this./* is `false` */eq((Ω___6 = function() {
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
        var matcher1, matcher2, result, sebv10, sebv11, sebv12, sebv13, sebv14, Ω__13;
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
        this./* is `false` */eq((Ω__13 = function() {
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
      var t2, Ω__25, Ω__26, Ω__27, Ω__28, Ω__29, Ω__30, Ω__31, Ω__32, Ω__33, Ω__34, Ω__35, Ω__36;
      t2 = new Test();
      //.........................................................................................................
      this.eq((Ω__25 = function() {
        return type_of(t2.pass);
      }), 'function');
      this.eq((Ω__26 = function() {
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
      this.eq((Ω__27 = function() {
        return t2.stats['*'].passes;
      }), 2);
      this.eq((Ω__28 = function() {
        return t2.stats['paf_a.paf_1'].passes;
      }), 1);
      this.eq((Ω__29 = function() {
        return t2.stats['paf_a.paf_2'].passes;
      }), 0);
      this.eq((Ω__30 = function() {
        return t2.stats['paf_a.paf_3'].passes;
      }), 1);
      this.eq((Ω__31 = function() {
        return t2.stats['paf_a.paf_4'].passes;
      }), 0);
      this.eq((Ω__32 = function() {
        return t2.stats['*'].fails;
      }), 2);
      this.eq((Ω__33 = function() {
        return t2.stats['paf_a.paf_1'].fails;
      }), 0);
      this.eq((Ω__34 = function() {
        return t2.stats['paf_a.paf_2'].fails;
      }), 1);
      this.eq((Ω__35 = function() {
        return t2.stats['paf_a.paf_3'].fails;
      }), 0);
      this.eq((Ω__36 = function() {
        return t2.stats['paf_a.paf_4'].fails;
      }), 1);
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_throws: async function() {
      var FS, fetch_filesize, t2, Ω__40, Ω__41, Ω__42;
      FS = require('node:fs/promises');
      t2 = new Test();
      //.........................................................................................................
      fetch_filesize = async function(path) {
        return ((await FS.stat(path))).size;
      };
      //.........................................................................................................
      // await async_throws  T, ( Ω__37 = -> await fetch_filesize __filename   )
      // await async_throws  T, ( Ω__38 = -> await fetch_filesize __filename   ), "foobar"
      // await async_throws  T, ( Ω__39 = -> await fetch_filesize __filename   ), /no such file/
      //.........................................................................................................
      await t2.async_throws((Ω__40 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), "foobar");
      await t2.async_throws((Ω__41 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      await t2.async_throws((Ω__42 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }));
      return typeof done === "function" ? done() : void 0;
    },
    //-----------------------------------------------------------------------------------------------------------
    asynchronous_errors: async function() {
      var FS, fetch_filesize, produce_filesize, Ω__51;
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
          urge("Ω__47", {filesize});
        } catch (error1) {
          error = error1;
          warn("Ω__48", error);
        }
        return null;
      };
      //.........................................................................................................
      echo('-------------------');
      // try await produce_filesize 'nosuchpath' catch error then warn 'Ω__49', error.message
      await produce_filesize('nosuchpath');
      echo('-------------------');
      await produce_filesize(__filename);
      echo('-------------------');
      // await async_throws ( Ω__50 = -> await fetch_filesize __filename ), '???'
      await async_throws((Ω__51 = async function() {
        return (await fetch_filesize('nosuchpath'));
      }), /no such file/);
      echo('-------------------');
      return typeof done === "function" ? done() : void 0;
    },
    //---------------------------------------------------------------------------------------------------------
    test_cfg: function() {
      (() => {        //.........................................................................................................
        var t2, Ω__52, Ω__53, Ω__54, Ω__55, Ω__56, Ω__57, Ω__58, Ω__59, Ω__60;
        t2 = new Test();
        this.eq((Ω__52 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ω__53 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ω__54 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ω__55 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ω__56 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ω__57 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ω__58 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((Ω__59 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((Ω__60 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, Ω__61, Ω__62, Ω__63, Ω__64, Ω__65, Ω__66, Ω__67, Ω__68, Ω__69;
        t2 = new Test({});
        this.eq((Ω__61 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ω__62 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ω__63 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ω__64 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ω__65 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ω__66 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ω__67 = function() {
          return t2.cfg.throw_on_error;
        }), false);
        this.eq((Ω__68 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        this.eq((Ω__69 = function() {
          return t2.cfg.message_width;
        }), 50);
        return null;
      })();
      (() => {        //.........................................................................................................
        var t2, Ω__70, Ω__71, Ω__72, Ω__73, Ω__74, Ω__75, Ω__76, Ω__77, Ω__78;
        t2 = new Test({
          message_width: 30,
          throw_on_error: true
        });
        this.eq((Ω__70 = function() {
          return Object.isFrozen(t2.cfg);
        }), true);
        this.eq((Ω__71 = function() {
          return t2.cfg.auto_reset;
        }), false);
        this.eq((Ω__72 = function() {
          return t2.cfg.show_report;
        }), true);
        this.eq((Ω__73 = function() {
          return t2.cfg.show_results;
        }), true);
        this.eq((Ω__74 = function() {
          return t2.cfg.show_fails;
        }), true);
        this.eq((Ω__75 = function() {
          return t2.cfg.show_passes;
        }), true);
        this.eq((Ω__76 = function() {
          return t2.cfg.throw_on_error;
        }), true);
        this.eq((Ω__77 = function() {
          return t2.cfg.throw_on_fail;
        }), false);
        return this.eq((Ω__78 = function() {
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
        // @throws ( Ω__81 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
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
    demo_assumptions: async function(ctx) {
      var line, Ω__90, Ω__91, Ω__92, Ω__93, Ω__94, Ω__95, Ω__98;
      line = '-'.repeat(108);
      //.........................................................................................................
      // echo line; @eq ( Ω__82 = -> 32 ), 32
      // echo line; @eq ( Ω__83 = -> 32 ), 33
      // echo line; @eq ( Ω__84 = -> throw new Error "fine" )
      // echo line; @pass 'Ω__85', 'test', "all fine"
      // echo line; @pass 'Ω__86', 'test'
      // echo line; @fail 'Ω__87', 'test', "all fine"
      // echo line; @fail 'Ω__88', 'test'
      // echo line; @throws ( Ω__89 = -> 'oops' ), /fine/
      echo(line);
      this.throws((Ω__90 = function() {
        throw new Error("this is actually fine 1");
      }), /fine/);
      echo(line);
      this.throws((Ω__91 = function() {
        throw new Error("this is actually fine 2");
      }), /what/);
      echo(line);
      this.throws((Ω__92 = function() {
        throw new Error("this is actually fine 3");
      }), "not this");
      echo(line);
      await this.async_throws((Ω__93 = function() {
        throw new Error("this is actually fine 4");
      }));
      echo(line);
      await this.async_throws((Ω__94 = function() {
        throw new Error("this is actually fine 5");
      }), /fine/);
      echo(line);
      await this.async_throws((Ω__95 = function() {
        throw new Error("this is actually fine 6");
      }), /not this/);
      // echo line; await @async_throws ( Ω__96 = -> new Promise ( rslv ) -> after 0.1, -> rslv 'oops' )
      // echo line; await @async_throws ( Ω__97 = -> new Promise ( rslv, rjct ) => after 0.1, => rjct "this is actually fine 8" ), /fine/
      echo(line);
      await this.async_throws((Ω__98 = function() {
        return after(0.1, async() => {
          return (await (function() {
            throw new Error("this is actually fine 7");
          })());
        });
      }), /fine/);
      // echo line; await @async_throws ( Ω__99 = -> after 0.1, => await throw new Error "this is actually fine 9" ), /what/
      // echo line; await @async_throws ( Ω_100 = -> after 0.1, => await throw new Error "this is actually fine 10" ), "not this"
      //.........................................................................................................
      return null;
    }
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await (async() => {        // await async_test TT.asynchronous_throws
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
        // ( new Test() ).test { TT3, }
        return (await (new Test()).async_test({TT3}));
      })());
    })();
  }

  //.........................................................................................................
// ( new Test()        ).test        TT.set_equality_by_value
// await ( new Test()  ).async_test  TT.set_equality_by_value
// await ( new Test() ).async_test TT

  // af1 = ->       after 0.1, ->       throw new Error 'oops' ### not OK ###
// af2 = -> await after 0.1, ->       throw new Error 'oops' ### not OK ###
// af3 = ->       after 0.1, -> await throw new Error 'oops' ### OK ###
// af4 = -> await after 0.1, -> await throw new Error 'oops' ### OK ###
// # debug 'Ω_101', validate.asyncfunction af
// f1 = ->
//   try
//     result = await af2()
//   catch error
//     warn error.message
//   help result
// await f1()

}).call(this);

//# sourceMappingURL=test-basics.js.map