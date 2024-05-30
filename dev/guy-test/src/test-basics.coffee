

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
    @eq ( Ωgtt___1 = -> t2.stats ), { '*': { passes: 0, fails: 0 } }
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
      @eq ( Ωgtt___2 = -> t2.stats ), { '*': { passes: 3, fails: 0 }, 'null.*': { passes: 3, fails: 0 }, 'null.sebv_2.Ωgt___3': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___4': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___5': { passes: 1, fails: 0 } }
      return null
    #.........................................................................................................
    do =>
      result    = new Set [ 1, 2, ]
      matcher1  = new Set [ 1, 2, ]
      matcher2  = new Set [ 1, 3, ]
      t2.eq ( sebv_6 = -> equals result, matcher1 ), true
      t2.eq ( sebv_7 = -> equals result, matcher2 ), false
      t2.eq ( sebv_8 = -> equals result, matcher2 ), true ### is `false` ###
      @eq ( Ωgtt___6 = -> t2.stats ), { '*': { passes: 5, fails: 1 }, 'null.*': { passes: 5, fails: 1 }, 'null.sebv_2.Ωgt___7': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt___8': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt___9': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__10': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__11': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__12': { passes: 0, fails: 1 } }
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
      @eq ( Ωgtt__13 = -> t2.stats ), { '*': { passes: 7, fails: 4 }, 'null.*': { passes: 7, fails: 4 }, 'null.sebv_2.Ωgt__14': { passes: 1, fails: 0 }, 'null.sebv_3.Ωgt__15': { passes: 1, fails: 0 }, 'null.sebv_4.Ωgt__16': { passes: 1, fails: 0 }, 'null.sebv_6.Ωgt__17': { passes: 1, fails: 0 }, 'null.sebv_7.Ωgt__18': { passes: 1, fails: 0 }, 'null.sebv_8.Ωgt__19': { passes: 0, fails: 1 }, 'null.sebv10.Ωgt__20': { passes: 1, fails: 0 }, 'null.sebv11.Ωgt__21': { passes: 1, fails: 0 }, 'null.sebv12.Ωgt__22': { passes: 0, fails: 1 }, 'null.sebv13.Ωgt__23': { passes: 0, fails: 1 }, 'null.sebv14.Ωgt__24': { passes: 0, fails: 1 } }
      return null
    #.........................................................................................................
    # t2.report()
    done?()

  #-----------------------------------------------------------------------------------------------------------
  pass_and_fail: ->
    t2 = new Test()
    #.........................................................................................................
    @eq ( Ωgtt__25 = -> type_of t2.pass ), 'function'
    @eq ( Ωgtt__26 = -> type_of t2.fail ), 'function'
    t2.test paf_a: ->
      t2.pass 'paf_1', "this is good"
      t2.fail 'paf_2', "this is bad"
      t2.pass 'paf_3'
      t2.fail 'paf_4'
    t2.report { prefix: "TEST RESULT", }
    @eq ( Ωgtt__27 = -> t2.stats[ '*'           ].passes  ), 2
    @eq ( Ωgtt__28 = -> t2.stats[ 'paf_a.paf_1' ].passes  ), 1
    @eq ( Ωgtt__29 = -> t2.stats[ 'paf_a.paf_2' ].passes  ), 0
    @eq ( Ωgtt__30 = -> t2.stats[ 'paf_a.paf_3' ].passes  ), 1
    @eq ( Ωgtt__31 = -> t2.stats[ 'paf_a.paf_4' ].passes  ), 0
    @eq ( Ωgtt__32 = -> t2.stats[ '*'           ].fails   ), 2
    @eq ( Ωgtt__33 = -> t2.stats[ 'paf_a.paf_1' ].fails   ), 0
    @eq ( Ωgtt__34 = -> t2.stats[ 'paf_a.paf_2' ].fails   ), 1
    @eq ( Ωgtt__35 = -> t2.stats[ 'paf_a.paf_3' ].fails   ), 0
    @eq ( Ωgtt__36 = -> t2.stats[ 'paf_a.paf_4' ].fails   ), 1
    #.........................................................................................................
    done?()

  #-----------------------------------------------------------------------------------------------------------
  asynchronous_throws: ->
    FS = require 'node:fs/promises'
    t2 = new Test()
    #.........................................................................................................
    fetch_filesize = ( path ) -> ( await FS.stat path ).size
    #.........................................................................................................
    # await async_throws  T, ( Ωgtt__37 = -> await fetch_filesize __filename   )
    # await async_throws  T, ( Ωgtt__38 = -> await fetch_filesize __filename   ), "foobar"
    # await async_throws  T, ( Ωgtt__39 = -> await fetch_filesize __filename   ), /no such file/
    #.........................................................................................................
    await t2.async_throws ( Ωgtt__40 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    await t2.async_throws ( Ωgtt__41 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    await t2.async_throws ( Ωgtt__42 = -> await fetch_filesize 'nosuchpath' )
    # await do =>
    #   await async_throws ( Ωgtt__43 = ->
    #     await t2.async_throws ( Ωgtt__44 = -> await fetch_filesize 'nosuchpath' ), "foobar"
    #     ), /no such file .* doesn't match 'foobar'/
    #.........................................................................................................
    # await async_throws  T, ( Ωgtt__45 = -> await fetch_filesize 'nosuchpath' )
    # await async_throws  T, ( Ωgtt__46 = -> await fetch_filesize 'nosuchpath' ), /no such file/
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
        urge "Ωgtt__47", { filesize, }
      catch error
        warn "Ωgtt__48", error
      return null
    #.........................................................................................................
    echo '-------------------'
    # try await produce_filesize 'nosuchpath' catch error then warn 'Ωgtt__49', error.message
    await produce_filesize 'nosuchpath'
    echo '-------------------'
    await produce_filesize __filename
    echo '-------------------'
    # await async_throws ( Ωgtt__50 = -> await fetch_filesize __filename ), '???'
    await async_throws ( Ωgtt__51 = -> await fetch_filesize 'nosuchpath' ), /no such file/
    echo '-------------------'
    #.........................................................................................................
    done?()

  #---------------------------------------------------------------------------------------------------------
  test_cfg: ->
    #.........................................................................................................
    do =>
      t2 = new Test()
      @eq ( Ωgtt__52 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ωgtt__53 = -> t2.cfg.auto_reset       ), false
      @eq ( Ωgtt__54 = -> t2.cfg.show_report      ), true
      @eq ( Ωgtt__55 = -> t2.cfg.show_results     ), true
      @eq ( Ωgtt__56 = -> t2.cfg.show_fails       ), true
      @eq ( Ωgtt__57 = -> t2.cfg.show_passes      ), true
      @eq ( Ωgtt__58 = -> t2.cfg.throw_on_error   ), false
      @eq ( Ωgtt__59 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ωgtt__60 = -> t2.cfg.message_width    ), 50
      return null
    #.........................................................................................................
    do =>
      t2 = new Test {}
      @eq ( Ωgtt__61 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ωgtt__62 = -> t2.cfg.auto_reset       ), false
      @eq ( Ωgtt__63 = -> t2.cfg.show_report      ), true
      @eq ( Ωgtt__64 = -> t2.cfg.show_results     ), true
      @eq ( Ωgtt__65 = -> t2.cfg.show_fails       ), true
      @eq ( Ωgtt__66 = -> t2.cfg.show_passes      ), true
      @eq ( Ωgtt__67 = -> t2.cfg.throw_on_error   ), false
      @eq ( Ωgtt__68 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ωgtt__69 = -> t2.cfg.message_width    ), 50
      return null
    #.........................................................................................................
    do =>
      t2 = new Test { message_width: 30, throw_on_error: true, }
      @eq ( Ωgtt__70 = -> Object.isFrozen t2.cfg  ), true
      @eq ( Ωgtt__71 = -> t2.cfg.auto_reset       ), false
      @eq ( Ωgtt__72 = -> t2.cfg.show_report      ), true
      @eq ( Ωgtt__73 = -> t2.cfg.show_results     ), true
      @eq ( Ωgtt__74 = -> t2.cfg.show_fails       ), true
      @eq ( Ωgtt__75 = -> t2.cfg.show_passes      ), true
      @eq ( Ωgtt__76 = -> t2.cfg.throw_on_error   ), true
      @eq ( Ωgtt__77 = -> t2.cfg.throw_on_fail    ), false
      @eq ( Ωgtt__78 = -> t2.cfg.message_width    ), 30
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
      @eq ( ctof_3 = -> t2.stats    ), { '*': { passes: 0, fails: 1 }, 'ctof_1.*': { passes: 0, fails: 1 }, 'ctof_1.ctof_2.Ωgt__80': { passes: 0, fails: 1 } }
      @eq ( ctof_4 = -> t2.warnings ), { 'ctof_1.ctof_2.Ωgt__23': [ '(noerr) expected an error but none was thrown' ] }
      return null
    #.........................................................................................................
    do =>
      t2 = new Test { throw_on_error: false, throw_on_fail: true, show_report: false, prefix: '**T2_2**', }
      @throws ( ctof_5 = -> t2.eq ( ctof_6 = -> 14 ), 15 ), /neq:/
      # @throws ( Ωgtt__84 = -> t2.eq ( xy1 = -> 14 ), 15 ), /---/
      return null
    #.........................................................................................................
    return null

#===========================================================================================================
demo_async = ->
  count = 0
  ref   = null
  create_task = -> new Promise ( resolve ) ->
    count++
    dt  = Math.round Math.random() * 1000
    ref = "task_#{count}"
    do ( count, dt ) ->
      help 'Ωgt__10', "(#{count} #{rpr dt} #{ref}"
      after dt / 1000, ->
        warn 'Ωgt__10', "#{count}) #{ref}"
        ref = null
        resolve()
    return null
  create_task() for _ in [ 1 .. 3 ]
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
  await demo_async()
  # ( new Test() ).test TT
  # ( new Test()        ).test        TT.set_equality_by_value
  # await ( new Test()  ).async_test  TT.set_equality_by_value
  # await ( new Test() ).async_test TT


