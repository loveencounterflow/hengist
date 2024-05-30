

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
    @eq ( ΩTT___1 = -> t2.stats ), { '*': { passes: 0, fails: 0 } }
    #.........................................................................................................
    do =>
      t2.eq ( sebv_2 = -> 'abc'                    ), 'abc'
      return null
    #.........................................................................................................
    do =>
      result    = [ 1, [ 2 ], ]
      matcher1  = [ 1, [ 2 ], ]
      matcher2  = [ 1, [ 3 ], ]
      t2.eq ( sebv_3 = -> equals result, matcher1 ), true
      t2.eq ( sebv_4 = -> equals result, matcher2 ), false
      @eq ( ΩTT___2 = -> t2.stats ), { '*': { passes: 3, fails: 0 }, 'null.*': { passes: 3, fails: 0 }, 'null.sebv_2.Ωgt___3': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___4': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___5': { passes: 1, fails: 0 } }
      return null
    #.........................................................................................................
    do =>
      result    = new Set [ 1, 2, ]
      matcher1  = new Set [ 1, 2, ]
      matcher2  = new Set [ 1, 3, ]
      t2.eq ( sebv_6 = -> equals result, matcher1 ), true
      t2.eq ( sebv_7 = -> equals result, matcher2 ), false
      t2.eq ( sebv_8 = -> equals result, matcher2 ), true ### is `false` ###
      @eq ( ΩTT___6 = -> t2.stats ), { '*': { passes: 5, fails: 1 }, 'null.*': { passes: 5, fails: 1 }, 'null.sebv_2.Ωgt___7': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___8': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___9': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__10': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__11': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__12': { passes: 0, fails: 1 } }
      return null
    #.........................................................................................................
    do =>
      result    = new Set [ 1, [ 2 ], ]
      matcher1  = new Set [ 1, [ 2 ], ]
      matcher2  = new Set [ 1, [ 3 ], ]
      t2.eq ( sebv10 = -> equals result, matcher1 ), true
      t2.eq ( sebv11 = -> equals result, matcher2 ), false
      t2.eq ( sebv12 = -> equals result, matcher2 ), true ### is `false` ###
      t2.eq ( sebv13 = -> equals result, matcher2 ), true ### is `false` ###
      t2.eq ( sebv14 = -> equals result, matcher2 ), true ### is `false` ###
      @eq ( ΩTT__13 = -> t2.stats ), { '*': { passes: 7, fails: 4 }, 'null.*': { passes: 7, fails: 4 }, 'null.sebv_2.Ωgt__14': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt__15': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt__16': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__17': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__18': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__19': { passes: 0, fails: 1 }, 'null.sebv10.Ωgt__20': { passes: 1, fails: 0 }, 'null.sebv11.Ωgt__21': { passes: 1, fails: 0 }, 'null.sebv12.Ωgt__22': { passes: 0, fails: 1 }, 'null.sebv13.Ωgt__23': { passes: 0, fails: 1 }, 'null.sebv14.Ωgt__24': { passes: 0, fails: 1 } }
      return null
    #.........................................................................................................
    # t2.report()
    done?()

  #-----------------------------------------------------------------------------------------------------------
  pass_and_fail: ->
    t2 = new Test()
    #.........................................................................................................
    @eq ( ΩTT__25 = -> type_of t2.pass ), 'function'
    @eq ( ΩTT__26 = -> type_of t2.fail ), 'function'
    t2.test paf_a: ->
      t2.pass 'paf_1', "this is good"
      t2.fail 'paf_2', "this is bad"
      t2.pass 'paf_3'
      t2.fail 'paf_4'
    t2.report { prefix: "TEST RESULT", }
    @eq ( ΩTT__27 = -> t2.stats[ '*'           ].passes  ), 2
    @eq ( ΩTT__28 = -> t2.stats[ 'paf_a.paf_1' ].passes  ), 1
    @eq ( ΩTT__29 = -> t2.stats[ 'paf_a.paf_2' ].passes  ), 0
    @eq ( ΩTT__30 = -> t2.stats[ 'paf_a.paf_3' ].passes  ), 1
    @eq ( ΩTT__31 = -> t2.stats[ 'paf_a.paf_4' ].passes  ), 0
    @eq ( ΩTT__32 = -> t2.stats[ '*'           ].fails   ), 2
    @eq ( ΩTT__33 = -> t2.stats[ 'paf_a.paf_1' ].fails   ), 0
    @eq ( ΩTT__34 = -> t2.stats[ 'paf_a.paf_2' ].fails   ), 1
    @eq ( ΩTT__35 = -> t2.stats[ 'paf_a.paf_3' ].fails   ), 0
    @eq ( ΩTT__36 = -> t2.stats[ 'paf_a.paf_4' ].fails   ), 1
    #.........................................................................................................
    done?()

  #-----------------------------------------------------------------------------------------------------------
  asynchronous_throws: ->
    FS = require 'node:fs/promises'
    t2 = new Test()
    #.........................................................................................................
    fetch_filesize = ( path ) -> ( await FS.stat path ).size
    #.........................................................................................................
    # await async_throws  T, ( ΩTT__37 = -> await fetch_filesize __filename   )
    # await async_throws  T, ( ΩTT__38 = -> await fetch_filesize __filename   ), "foobar"
    # await async_throws  T, ( ΩTT__39 = -> await fetch_filesize __filename   ), /no such file/
    #.........................................................................................................
    await t2.async_throws ( ΩTT__40 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    await t2.async_throws ( ΩTT__41 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    await t2.async_throws ( ΩTT__42 = -> await fetch_filesize 'nosuchpath' )
    # await do =>
    #   await async_throws ( ΩTT__43 = ->
    #     await t2.async_throws ( ΩTT__44 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    #     ), /no such file .* doesn't match 'foobar'/
    #.........................................................................................................
    # await async_throws  T, ( ΩTT__45 = -> await fetch_filesize 'nosuchpath' )
    # await async_throws  T, ( ΩTT__46 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    #.........................................................................................................
    done?()

  #-----------------------------------------------------------------------------------------------------------
  asynchronous_errors: ->
    FS = require 'node:fs/promises'
    #.........................................................................................................
    fetch_filesize = ( path ) -> ( await FS.stat path ).size
    #.........................................................................................................
    produce_filesize = ( path ) =>
      try
        filesize  = await fetch_filesize path
        urge "ΩTT__47", { filesize, }
      catch error
        warn "ΩTT__48", error
      return null
    #.........................................................................................................
    echo '-------------------'
    # try await produce_filesize 'nosuchpath' catch error then warn 'ΩTT__49', error.message
    await produce_filesize 'nosuchpath'
    echo '-------------------'
    await produce_filesize __filename
    echo '-------------------'
    # await async_throws ( ΩTT__50 = -> await fetch_filesize __filename ), '???'
    await async_throws ( ΩTT__51 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    echo '-------------------'
    #.........................................................................................................
    done?()

  #---------------------------------------------------------------------------------------------------------
  test_cfg: ->
    #.........................................................................................................
    do =>
      t2 = new Test()
      @eq ( ΩTT__52 = -> Object.isFrozen t2.cfg  ), true
      @eq ( ΩTT__53 = -> t2.cfg.auto_reset       ), false
      @eq ( ΩTT__54 = -> t2.cfg.show_report      ), true
      @eq ( ΩTT__55 = -> t2.cfg.show_results     ), true
      @eq ( ΩTT__56 = -> t2.cfg.show_fails       ), true
      @eq ( ΩTT__57 = -> t2.cfg.show_passes      ), true
      @eq ( ΩTT__58 = -> t2.cfg.throw_on_error   ), false
      @eq ( ΩTT__59 = -> t2.cfg.throw_on_fail    ), false
      @eq ( ΩTT__60 = -> t2.cfg.message_width    ), 50
      return null
    #.........................................................................................................
    do =>
      t2 = new Test {}
      @eq ( ΩTT__61 = -> Object.isFrozen t2.cfg  ), true
      @eq ( ΩTT__62 = -> t2.cfg.auto_reset       ), false
      @eq ( ΩTT__63 = -> t2.cfg.show_report      ), true
      @eq ( ΩTT__64 = -> t2.cfg.show_results     ), true
      @eq ( ΩTT__65 = -> t2.cfg.show_fails       ), true
      @eq ( ΩTT__66 = -> t2.cfg.show_passes      ), true
      @eq ( ΩTT__67 = -> t2.cfg.throw_on_error   ), false
      @eq ( ΩTT__68 = -> t2.cfg.throw_on_fail    ), false
      @eq ( ΩTT__69 = -> t2.cfg.message_width    ), 50
      return null
    #.........................................................................................................
    do =>
      t2 = new Test { message_width: 30, throw_on_error: true, }
      @eq ( ΩTT__70 = -> Object.isFrozen t2.cfg  ), true
      @eq ( ΩTT__71 = -> t2.cfg.auto_reset       ), false
      @eq ( ΩTT__72 = -> t2.cfg.show_report      ), true
      @eq ( ΩTT__73 = -> t2.cfg.show_results     ), true
      @eq ( ΩTT__74 = -> t2.cfg.show_fails       ), true
      @eq ( ΩTT__75 = -> t2.cfg.show_passes      ), true
      @eq ( ΩTT__76 = -> t2.cfg.throw_on_error   ), true
      @eq ( ΩTT__77 = -> t2.cfg.throw_on_fail    ), false
      @eq ( ΩTT__78 = -> t2.cfg.message_width    ), 30
    #.........................................................................................................
    return null

  #---------------------------------------------------------------------------------------------------------
  can_throw_on_fail: ->
    #.........................................................................................................
    do =>
      ### ensure that `Test` instance complains when no error is thrown inside a `throws()` check: ###
      t2 = new Test { throw_on_error: false, show_report: false, prefix: '**T2_1**', }
      t2.test ctof_1: ->
        t2.throws ( ctof_2 = -> 32 ), /expected an error/
      @eq ( ctof_3 = -> t2.stats    ), { '*': { passes: 0, fails: 1 }, 'ctof_1.*': { passes: 0, fails: 1 }, 'ctof_1.ctof_2.Ωgt__79': { passes: 0, fails: 1 } }
      @eq ( ctof_4 = -> t2.warnings ), { 'ctof_1.ctof_2.Ωgt__80': [ '(noerr) expected an error but none was thrown' ] }
      return null
    #.........................................................................................................
    do =>
      t2 = new Test { throw_on_error: false, throw_on_fail: true, show_report: false, prefix: '**T2_2**', }
      @throws ( ctof_5 = -> t2.eq ( ctof_6 = -> 14 ), 15 ), /neq:/
      # @throws ( ΩTT__81 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
      return null
    #.........................................................................................................
    return null

TT2 = { test_cfg: TT.test_cfg, }

TT3 =
  demo_assumptions: ( ctx ) ->
    line = '-'.repeat 108
    #.........................................................................................................
    echo line
    @eq ( ΩTT__82 = -> @_upref ), 'TT3.demo_assumptions'
    echo line
    @eq ( ΩTT__83 = -> throw new Error "fine" )
    echo line
    @eq ( ΩTT__84 = -> 32 ), 32
    echo line
    @eq ( ΩTT__85 = -> 32 ), 33
    echo line
    @pass 'ΩTT__86', 'test', "all fine"
    echo line
    @pass 'ΩTT__87', 'test'
    echo line
    echo line
    @fail 'ΩTT__88', 'test', "all fine"
    echo line
    @fail 'ΩTT__89', 'test'
    echo line
    @throws ( ΩTT__90 = -> throw new Error "this is actually fine" ), /fine/
    #.........................................................................................................
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
  do =>
    # ( new Test() ).test TT3.demo_assumptions
    # ( new Test() ).test TT3
    # ( new Test( throw_on_error: true ) ).test { TT3, }
    ( new Test() ).test { TT3, }
  #.........................................................................................................
  # ( new Test()        ).test        TT.set_equality_by_value
  # await ( new Test()  ).async_test  TT.set_equality_by_value
  # await ( new Test() ).async_test TT


