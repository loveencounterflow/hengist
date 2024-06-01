

#===========================================================================================================
'use strict'

GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'intertype/test-basics'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
{ after }                 = GUY.async
#-----------------------------------------------------------------------------------------------------------
GTNG                      = require '../../../apps/guy-test-NG'
{ _TMP_test
  Test
  equals
  pass
  fail
  test
  eq
  throws
  async_test
  async_eq
  async_throws          } = GTNG
#-----------------------------------------------------------------------------------------------------------
types                     = require '../../../apps/intertype'
{ isa
  type_of
  validate              } = types


#===========================================================================================================
TT =

  #---------------------------------------------------------------------------------------------------------
  set_equality_by_value: ->
    t2 = new Test { show_report: false, prefix: "TEST RESULT", }
    @eq ( Ω___1 = -> t2.stats ), { '*': { passes: 0, fails: 0 } }
    #.......................................................................................................
    do =>
      t2.eq ( sebv_2 = -> 'abc'                    ), 'abc'
      return null
    #.......................................................................................................
    do =>
      result    = [ 1, [ 2 ], ]
      matcher1  = [ 1, [ 2 ], ]
      matcher2  = [ 1, [ 3 ], ]
      t2.eq ( sebv_3 = -> equals result, matcher1 ), true
      t2.eq ( sebv_4 = -> equals result, matcher2 ), false
      @eq ( Ω___2 = -> t2.stats ), { '*': { passes: 3, fails: 0 }, 'null.*': { passes: 3, fails: 0 }, 'null.sebv_2.Ωgt___3': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___4': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___5': { passes: 1, fails: 0 } }
      return null
    #.......................................................................................................
    do =>
      result    = new Set [ 1, 2, ]
      matcher1  = new Set [ 1, 2, ]
      matcher2  = new Set [ 1, 3, ]
      t2.eq ( sebv_6 = -> equals result, matcher1 ), true
      t2.eq ( sebv_7 = -> equals result, matcher2 ), false
      t2.eq ( sebv_8 = -> equals result, matcher2 ), true ### is `false` ###
      @eq ( Ω___6 = -> t2.stats ), { '*': { passes: 5, fails: 1 }, 'null.*': { passes: 5, fails: 1 }, 'null.sebv_2.Ωgt___7': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___8': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___9': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__10': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__11': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__12': { passes: 0, fails: 1 } }
      return null
    #.......................................................................................................
    do =>
      result    = new Set [ 1, [ 2 ], ]
      matcher1  = new Set [ 1, [ 2 ], ]
      matcher2  = new Set [ 1, [ 3 ], ]
      t2.eq ( sebv10 = -> equals result, matcher1 ), true
      t2.eq ( sebv11 = -> equals result, matcher2 ), false
      t2.eq ( sebv12 = -> equals result, matcher2 ), true ### is `false` ###
      t2.eq ( sebv13 = -> equals result, matcher2 ), true ### is `false` ###
      t2.eq ( sebv14 = -> equals result, matcher2 ), true ### is `false` ###
      @eq ( Ω__13 = -> t2.stats ), { '*': { passes: 7, fails: 4 }, 'null.*': { passes: 7, fails: 4 }, 'null.sebv_2.Ωgt__14': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt__15': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt__16': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__17': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__18': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__19': { passes: 0, fails: 1 }, 'null.sebv10.Ωgt__20': { passes: 1, fails: 0 }, 'null.sebv11.Ωgt__21': { passes: 1, fails: 0 }, 'null.sebv12.Ωgt__22': { passes: 0, fails: 1 }, 'null.sebv13.Ωgt__23': { passes: 0, fails: 1 }, 'null.sebv14.Ωgt__24': { passes: 0, fails: 1 } }
      return null
    #.......................................................................................................
    # t2.report()
    done?()

  #-----------------------------------------------------------------------------------------------------------
  pass_and_fail: ->
    t2 = new Test()
    #.......................................................................................................
    @eq ( Ω__25 = -> type_of t2.pass ), 'function'
    @eq ( Ω__26 = -> type_of t2.fail ), 'function'
    t2.test paf_a: ->
      t2.pass 'paf_1', "this is good"
      t2.fail 'paf_2', "this is bad"
      t2.pass 'paf_3'
      t2.fail 'paf_4'
    t2.report { prefix: "TEST RESULT", }
    @eq ( Ω__27 = -> t2.stats[ '*'           ].passes  ), 2
    @eq ( Ω__28 = -> t2.stats[ 'paf_a.paf_1' ].passes  ), 1
    @eq ( Ω__29 = -> t2.stats[ 'paf_a.paf_2' ].passes  ), 0
    @eq ( Ω__30 = -> t2.stats[ 'paf_a.paf_3' ].passes  ), 1
    @eq ( Ω__31 = -> t2.stats[ 'paf_a.paf_4' ].passes  ), 0
    @eq ( Ω__32 = -> t2.stats[ '*'           ].fails   ), 2
    @eq ( Ω__33 = -> t2.stats[ 'paf_a.paf_1' ].fails   ), 0
    @eq ( Ω__34 = -> t2.stats[ 'paf_a.paf_2' ].fails   ), 1
    @eq ( Ω__35 = -> t2.stats[ 'paf_a.paf_3' ].fails   ), 0
    @eq ( Ω__36 = -> t2.stats[ 'paf_a.paf_4' ].fails   ), 1
    #.......................................................................................................
    done?()

  #-----------------------------------------------------------------------------------------------------------
  asynchronous_throws: ->
    FS = require 'node:fs/promises'
    t2 = new Test()
    #.......................................................................................................
    fetch_filesize = ( path ) -> ( await FS.stat path ).size
    #.......................................................................................................
    # await async_throws  T, ( Ω__37 = -> await fetch_filesize __filename   )
    # await async_throws  T, ( Ω__38 = -> await fetch_filesize __filename   ), "foobar"
    # await async_throws  T, ( Ω__39 = -> await fetch_filesize __filename   ), /no such file/
    #.......................................................................................................
    await t2.async_throws ( Ω__40 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    await t2.async_throws ( Ω__41 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    await t2.async_throws ( Ω__42 = -> await fetch_filesize 'nosuchpath' )
    # await do =>
    #   await async_throws ( Ω__43 = ->
    #     await t2.async_throws ( Ω__44 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    #     ), /no such file .* doesn't match 'foobar'/
    #.......................................................................................................
    # await async_throws  T, ( Ω__45 = -> await fetch_filesize 'nosuchpath' )
    # await async_throws  T, ( Ω__46 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    #.......................................................................................................
    done?()

  #-----------------------------------------------------------------------------------------------------------
  asynchronous_errors: ->
    FS = require 'node:fs/promises'
    #.......................................................................................................
    fetch_filesize = ( path ) -> ( await FS.stat path ).size
    #.......................................................................................................
    produce_filesize = ( path ) =>
      try
        filesize  = await fetch_filesize path
        urge "Ω__47", { filesize, }
      catch error
        warn "Ω__48", error
      return null
    #.......................................................................................................
    echo '-------------------'
    # try await produce_filesize 'nosuchpath' catch error then warn 'Ω__49', error.message
    await produce_filesize 'nosuchpath'
    echo '-------------------'
    await produce_filesize __filename
    echo '-------------------'
    # await async_throws ( Ω__50 = -> await fetch_filesize __filename ), '???'
    await async_throws ( Ω__51 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    echo '-------------------'
    #.......................................................................................................
    done?()

  #---------------------------------------------------------------------------------------------------------
  test_cfg: ->
    #.......................................................................................................
    do =>
      t2 = new Test()
      @eq ( Ω__52 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ω__53 = -> t2.cfg.auto_reset       ), false
      @eq ( Ω__54 = -> t2.cfg.show_report      ), true
      @eq ( Ω__55 = -> t2.cfg.show_results     ), true
      @eq ( Ω__56 = -> t2.cfg.show_fails       ), true
      @eq ( Ω__57 = -> t2.cfg.show_passes      ), true
      @eq ( Ω__58 = -> t2.cfg.throw_on_error   ), false
      @eq ( Ω__59 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ω__60 = -> t2.cfg.message_width    ), 50
      return null
    #.......................................................................................................
    do =>
      t2 = new Test {}
      @eq ( Ω__61 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ω__62 = -> t2.cfg.auto_reset       ), false
      @eq ( Ω__63 = -> t2.cfg.show_report      ), true
      @eq ( Ω__64 = -> t2.cfg.show_results     ), true
      @eq ( Ω__65 = -> t2.cfg.show_fails       ), true
      @eq ( Ω__66 = -> t2.cfg.show_passes      ), true
      @eq ( Ω__67 = -> t2.cfg.throw_on_error   ), false
      @eq ( Ω__68 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ω__69 = -> t2.cfg.message_width    ), 50
      return null
    #.......................................................................................................
    do =>
      t2 = new Test { message_width: 30, throw_on_error: true, }
      @eq ( Ω__70 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ω__71 = -> t2.cfg.auto_reset       ), false
      @eq ( Ω__72 = -> t2.cfg.show_report      ), true
      @eq ( Ω__73 = -> t2.cfg.show_results     ), true
      @eq ( Ω__74 = -> t2.cfg.show_fails       ), true
      @eq ( Ω__75 = -> t2.cfg.show_passes      ), true
      @eq ( Ω__76 = -> t2.cfg.throw_on_error   ), true
      @eq ( Ω__77 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ω__78 = -> t2.cfg.message_width    ), 30
    #.......................................................................................................
    return null

  #---------------------------------------------------------------------------------------------------------
  can_throw_on_fail: ->
    #.......................................................................................................
    do =>
      ### ensure that `Test` instance complains when no error is thrown inside a `throws()` check: ###
      t2 = new Test { throw_on_error: false, show_report: false, prefix: '**T2_1**', }
      t2.test ctof_1: ->
        t2.throws ( ctof_2 = -> 32 ), /expected an error/
      @eq ( ctof_3 = -> t2.stats    ), { '*': { passes: 0, fails: 1 }, 'ctof_1.*': { passes: 0, fails: 1 }, 'ctof_1.ctof_2.Ωgt__79': { passes: 0, fails: 1 } }
      @eq ( ctof_4 = -> t2.warnings ), { 'ctof_1.ctof_2.Ωgt__80': [ '(noerr) expected an error but none was thrown' ] }
      return null
    #.......................................................................................................
    do =>
      t2 = new Test { throw_on_error: false, throw_on_fail: true, show_report: false, prefix: '**T2_2**', }
      @throws ( ctof_5 = -> t2.eq ( ctof_6 = -> 14 ), 15 ), /neq:/
      # @throws ( Ω__81 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
      return null
    #.......................................................................................................
    return null

TT2 = { test_cfg: TT.test_cfg, }

#-----------------------------------------------------------------------------------------------------------
TT3 =
  demo_assumptions: ( ctx ) ->
    t2 = new Test { show_report: false, }
    #.......................................................................................................
    await t2.async_test demo_assumptions_task: ->
      line = '-'.repeat 108
      echo line; @eq ( dat_1 = -> 32 ), 32
      echo line; @eq ( dat_2 = -> 32 ), 33
      echo line; @eq ( dat_3 = -> throw new Error "fine" )
      echo line; @pass 'dat_4', 'test', "all fine"
      echo line; @pass 'dat_5', 'test'
      echo line; @fail 'dat_6', 'test', "all fine"
      echo line; @fail 'dat_7', 'test'
      echo line; @throws ( dat_8 = -> 'oops' ), /fine/
      echo line; @throws ( dat_9 = -> throw new Error "this is actually fine 1" ), /fine/
      echo line; @throws ( dat_10 = -> throw new Error "this is actually fine 2" ), /what/
      echo line; @throws ( dat_11 = -> throw new Error "this is actually fine 3" ), "not this"
      echo line; await @async_throws ( dat_12 = -> throw new Error "this is actually fine 4" )
      echo line; await @async_throws ( dat_13 = -> throw new Error "this is actually fine 5" ), /fine/
      echo line; await @async_throws ( dat_14 = -> throw new Error "this is actually fine 6" ), /not this/
      echo line; await @async_throws ( dat_15 = -> after 0.1, => await throw new Error "this is actually fine 7" ), /fine/
      echo line; await @async_throws ( dat_16 = -> after 0.1, => await throw new Error "this is actually fine 9" ), /what/
      echo line; await @async_throws ( dat_17 = -> after 0.1, => await throw new Error "this is actually fine 10" ), "not this"
      # t2.report()
    #.......................................................................................................
    @eq ( Ω__82 = -> t2.stats[ '*'                            ] ), { passes: 7, fails: 10 }
    @eq ( Ω__83 = -> t2.stats[ 'demo_assumptions_task.dat_1'  ] ), { passes: 1, fails: 0 }
    @eq ( Ω__84 = -> t2.stats[ 'demo_assumptions_task.dat_2'  ] ), { passes: 0, fails: 1 }
    @eq ( Ω__85 = -> t2.stats[ 'demo_assumptions_task.dat_3'  ] ), { passes: 0, fails: 1 }
    @eq ( Ω__86 = -> t2.stats[ 'demo_assumptions_task.dat_4'  ] ), { passes: 1, fails: 0 }
    @eq ( Ω__87 = -> t2.stats[ 'demo_assumptions_task.dat_5'  ] ), { passes: 1, fails: 0 }
    @eq ( Ω__88 = -> t2.stats[ 'demo_assumptions_task.dat_6'  ] ), { passes: 0, fails: 1 }
    @eq ( Ω__89 = -> t2.stats[ 'demo_assumptions_task.dat_7'  ] ), { passes: 0, fails: 1 }
    @eq ( Ω__90 = -> t2.stats[ 'demo_assumptions_task.dat_8'  ] ), { passes: 0, fails: 1 }
    @eq ( Ω__91 = -> t2.stats[ 'demo_assumptions_task.dat_9'  ] ), { passes: 1, fails: 0 }
    @eq ( Ω__92 = -> t2.stats[ 'demo_assumptions_task.dat_10' ] ), { passes: 0, fails: 1 }
    @eq ( Ω__93 = -> t2.stats[ 'demo_assumptions_task.dat_11' ] ), { passes: 0, fails: 1 }
    @eq ( Ω__94 = -> t2.stats[ 'demo_assumptions_task.dat_12' ] ), { passes: 1, fails: 0 }
    @eq ( Ω__95 = -> t2.stats[ 'demo_assumptions_task.dat_13' ] ), { passes: 1, fails: 0 }
    @eq ( Ω__96 = -> t2.stats[ 'demo_assumptions_task.dat_14' ] ), { passes: 0, fails: 1 }
    @eq ( Ω__97 = -> t2.stats[ 'demo_assumptions_task.dat_15' ] ), { passes: 1, fails: 0 }
    @eq ( Ω__98 = -> t2.stats[ 'demo_assumptions_task.dat_16' ] ), { passes: 0, fails: 1 }
    @eq ( Ω__99 = -> t2.stats[ 'demo_assumptions_task.dat_17' ] ), { passes: 0, fails: 1 }

    # { 'demo_assumptions_task.dat_2': [ 'neq' ],
    #   'demo_assumptions_task.dat_3': [ "(error) expected a result but got an an error: 'fine'" ],
    #   'demo_assumptions_task.dat_6': [ '(test) all fine' ],
    #   'demo_assumptions_task.dat_7': [ 'test' ],
    #   'demo_assumptions_task.dat_8': [ '(noerr) expected an error but none was thrown' ],
    #   'demo_assumptions_task.dat_10': [ "(neq) error 'this is actually fine 2' doesn't match /what/" ],
    #   'demo_assumptions_task.dat_11': [ "(neq) error 'this is actually fine 3' doesn't match 'not this'" ] }

    #.......................................................................................................
    return null


#===========================================================================================================
if module is require.main then await do =>
  # await async_test TT.asynchronous_throws
  # test TT.pass_and_fail
  # await async_test TT.pass_and_fail
  # test TT.test_cfg
  # ( new Test() ).test TT.can_throw_on_fail
  # ( new Test        { throw_on_error: true, } ).test        TT.can_throw_on_fail
  # await ( new Test  { throw_on_error: true, } ).async_test  TT.can_throw_on_fail
  # ( new Test() ).test TT
  # ( new Test() ).test { TT, }
  #.........................................................................................................
  # do =>
  #   ( new Test() ).test TT2.test_cfg
  #   ( new Test() ).test TT2
  #   ( new Test() ).test { TT2, }
  #.........................................................................................................
  await do =>
    # ( new Test() ).test TT3.demo_assumptions
    # ( new Test() ).test TT3
    # ( new Test( throw_on_error: true ) ).test { TT3, }
    # ( new Test() ).test { TT3, }
    await ( new Test() ).async_test { TT3, }
    # await TT3.demo_assumptions()
  #.........................................................................................................
  # ( new Test()        ).test        TT.set_equality_by_value
  # await ( new Test()  ).async_test  TT.set_equality_by_value
  # await ( new Test() ).async_test TT

# af1 = ->       after 0.1, ->       throw new Error 'oops' ### not OK ###
# af2 = -> await after 0.1, ->       throw new Error 'oops' ### not OK ###
# af3 = ->       after 0.1, -> await throw new Error 'oops' ### OK ###
# af4 = -> await after 0.1, -> await throw new Error 'oops' ### OK ###
# # debug 'Ω_100', validate.asyncfunction af
# f1 = ->
#   try
#     result = await af2()
#   catch error
#     warn error.message
#   help result
# await f1()

