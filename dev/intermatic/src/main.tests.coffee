
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERMATIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
log                       = urge
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  declare
  equals
  type_of }               = types.export()
{ freeze
  lets }                  = require 'letsfreezethat'


#-----------------------------------------------------------------------------------------------------------
# declare

#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
new_register = ->
  result      = []
  register    = ( P... ) ->
    x = if P.length is 1 then P[ 0 ] else P
    whisper '^2321^', P...
    result.push x
  show_result = ->
    R = [
      '  T.eq result, [ '
      ( ( '    ' + rpr d ) for d in result )...
      ]
    echo ( R.join '\n' ) + ' ]'
    return null
  return { result, register, show_result, }

#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "___ Intermatic attribute freezing" ] = ( T, done ) ->
  d = Object.freeze { foo: 42, }
  e = {}
  for pname, propd of Object.getOwnPropertyDescriptors d
    Object.defineProperty e, pname, propd
  e.foo = d.foo
  #d.foo++
  e.foo++
  debug d
  debug e
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic empty FSM" ] = ( T, done ) ->
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic {}
  T.eq fsm.moves,   {}
  T.eq fsm.start,   undefined
  T.eq fsm.lstate,  'void'
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic fairly minimal FSM without moves" ] = ( T, done ) ->

  { Intermatic, } = require '../../../apps/intermatic'
  fsmd =
    name:     'toolbox'
    cascades: [ 'start', ]
    moves:
      start:    'active'
    before:
      start: -> log '^IMATC@13344^', "IMATC.toolbox_fsm.before.start", @cstate
  fsm             = new Intermatic fsmd
  # debug '^3334^', fsm.moves
  T.eq fsm.moves,   { start: { void: 'active' } }
  T.eq fsm.lstate,  'void'
  #.........................................................................................................
  try validate.function fsm.start catch error
    T.fail error.message
  T.ok error is undefined
  #.........................................................................................................
  fsm.start()
  T.eq fsm.lstate,  'active'
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic before.start(), after.start()" ] = ( T, done ) ->
  { result
    show_result
    register }    = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    moves:
      start: 'void'
    before:
      start: -> register "before start", @move
    after:
      start: -> register "after start", @move
  #---------------------------------------------------------------------------------------------------------
  fsm = new Intermatic fsmd
  T.eq fsm.start(), null
  T.eq fsm.lstate,  'void'
  show_result()
  T.eq result, [
    [ 'before start', { stage: 'before', verb: 'start', dpar: 'void', dest: 'void', lstate: 'void' } ]
    [ 'after start', { stage: 'after', verb: 'start', dpar: 'void', dest: 'void', lstate: 'void' } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic basics" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    moves:
      start:  [ 'void', 'lit',  ]
      reset:  [ 'any',  'void', ]
      toggle: [ 'lit',  'dark', 'lit', ]
    after:
      change:     -> register "after change", @cstate
    entering:
      dark:       -> register "entering dark", @cstate
    leaving:
      lit:        -> register "leaving lit", @cstate
    fail:         -> register "failed", @cstate
  #---------------------------------------------------------------------------------------------------------
  { result
    show_result
    register }    = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  # info '^44455^', JSON.stringify fsm.moves, null, 2
  T.eq fsm.moves, { start: { void: 'lit' }, reset: { any: 'void' }, toggle: { lit: 'dark', dark: 'lit' } }
  fsm.start()
  fsm.toggle()
  fsm.reset()
  fsm.toggle()
  show_result()
  T.eq result, [
    [ 'after change', { stage: 'after', verb: 'start', dpar: 'void', dest: 'lit', changed: true, path: 'meta_lamp', lstate: 'lit' } ]
    [ 'leaving lit', { stage: 'leaving', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true, path: 'meta_lamp', lstate: 'lit' } ]
    [ 'entering dark', { stage: 'entering', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true, path: 'meta_lamp', lstate: 'dark' } ]
    [ 'after change', { stage: 'after', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true, path: 'meta_lamp', lstate: 'dark' } ]
    [ 'after change', { stage: 'after', verb: 'reset', dpar: 'dark', dest: 'void', changed: true, path: 'meta_lamp', lstate: 'void' } ]
    [ 'failed', { verb: 'toggle', dpar: 'void', failed: true, path: 'meta_lamp', lstate: 'void' } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic history" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    moves:
      start:  'lit'
      reset:  [ 'any', 'void',     ]
      flash:  [ 'any', 'flashing', ]
      toggle: [
        [ 'lit',      'dark',     'lit',  ]
        [ 'flashing', 'dark',             ]
        ]
    after:
      change:     ( P... ) -> register @history
  #---------------------------------------------------------------------------------------------------------
  { result
    register }        = new_register()
  { Intermatic, }     = require '../../../apps/intermatic'
  fsm                 = new Intermatic fsmd
  fsm.history_length  = 3
  fsm.start()
  fsm.toggle()
  fsm.toggle()
  fsm.flash()
  fsm.toggle()
  T.eq result, [
    [ { verb: 'start', dpar: 'void', dest: 'lit' } ],
    [ { verb: 'start', dpar: 'void', dest: 'lit' }, { verb: 'toggle', dpar: 'lit', dest: 'dark' } ],
    [ { verb: 'start', dpar: 'void', dest: 'lit' }, { verb: 'toggle', dpar: 'lit', dest: 'dark' }, { verb: 'toggle', dpar: 'dark', dest: 'lit' } ],
    [ { verb: 'toggle', dpar: 'lit', dest: 'dark' }, { verb: 'toggle', dpar: 'dark', dest: 'lit' }, { verb: 'flash', dpar: 'lit', dest: 'flashing' } ],
    [ { verb: 'toggle', dpar: 'dark', dest: 'lit' }, { verb: 'flash', dpar: 'lit', dest: 'flashing' }, { verb: 'toggle', dpar: 'flashing', dest: 'dark' } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "__ Intermatic cancel moves" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'boiler'
    # cascades:
    #   # start: 'any' ### TAINT all FSMs in tree? all sibling FSMs? parent FSMs? ###
    #   start: [ 'heater', ]
    moves:
      start:  'operating'
    before:
      start:  ( P... ) -> @register 'boiler.before.start', @move; @heater.start P...
    after:
      change: ( P... ) -> @register 'boiler.after.change', @move
    heater:
      data: { enabled: true, temparature: 20, }
      moves:
        start:      [ 'void',     'idle',     ]
        switch_off: [ 'heating',  'idle',     ]
        switch_on:  [ 'idle',     'heating',  ]
      # before:
      #   any:      -> @register 'heater.before.any', @move, @data
      entering:
        heating:  ->
          if not @data.enabled
            warn '^3334^', "heater not enabled; cancelling"
            @cancel()
          debug '^445554^', @lstate
          debug '^445554^', @move
          @up.register 'heater.entering.heating', @lstate, @move, @data
  #---------------------------------------------------------------------------------------------------------
  Intermatic          = require '../../../apps/intermatic'
  do =>
    { result
      show_result
      register }        = new_register()
    boiler = new Intermatic fsmd
    boiler.register = register
    boiler.heater.data.enabled = true
    boiler.start()
    boiler.heater.switch_on()
    show_result()
  do =>
    { result
      show_result
      register }        = new_register()
    boiler = new Intermatic fsmd
    boiler.register = register
    boiler.heater.data.enabled = false
    boiler.start()
    boiler.heater.switch_on()
    show_result()
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic goto 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    moves:
      start: 'lit'
      reset:  [ 'any',  'void',         ]
      toggle: [ 'lit',  'dark', 'lit',  ]
    before:
      any:        ( P... ) -> register 'before.any',  @cstate, P
    # after:
    #   change:     ( P... ) -> register 'after.change',  @cstate
    # entering:
    #   dark:       ( P... ) -> register 'entering.dark',    @cstate
    #   lit:        ( P... ) -> register 'entering.lit',     @cstate
    goto:         'any'
    fail:         ( P... ) -> register 'failed',        @cstate, P
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  # T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'moves', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'entering', 'keeping', 'leaving', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
  fsm.start         'M1'
  fsm.toggle        'M2'
  fsm.goto 'lit',   'M3'
  fsm.goto.lit      'M4'
  fsm.goto 'dark',  'M5'
  fsm.toggle        'M6'
  fsm.toggle        'M7'
  fsm.toggle        'M8'
  show_result()
  T.eq result, [
    [ 'before.any', { stage: 'before', verb: 'start', dpar: 'void', dest: 'lit', changed: true, lstate: 'void', path: 'meta_lamp' }, [ 'M1' ] ]
    [ 'before.any', { stage: 'before', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true, lstate: 'lit', path: 'meta_lamp' }, [ 'M2' ] ]
    [ 'before.any', { stage: 'before', verb: 'goto', dpar: 'dark', dest: 'lit', changed: true, lstate: 'dark', path: 'meta_lamp' }, [ 'M3' ] ]
    [ 'before.any', { stage: 'before', verb: 'goto', dpar: 'lit', dest: 'lit', lstate: 'lit', path: 'meta_lamp' }, [ 'M4' ] ]
    [ 'before.any', { stage: 'before', verb: 'goto', dpar: 'lit', dest: 'dark', changed: true, lstate: 'lit', path: 'meta_lamp' }, [ 'M5' ] ]
    [ 'before.any', { stage: 'before', verb: 'toggle', dpar: 'dark', dest: 'lit', changed: true, lstate: 'dark', path: 'meta_lamp' }, [ 'M6' ] ]
    [ 'before.any', { stage: 'before', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true, lstate: 'lit', path: 'meta_lamp' }, [ 'M7' ] ]
    [ 'before.any', { stage: 'before', verb: 'toggle', dpar: 'dark', dest: 'lit', changed: true, lstate: 'dark', path: 'meta_lamp' }, [ 'M8' ] ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic data attribute 1" ] = ( T, done ) ->
  mydata          = { counter: 42, }
  Object.defineProperties mydata,
    computed:
      enumerable: true
      get: -> 'helo'
  debug '^55567^', mydata
  debug '^55567^', mydata.computed
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'simple'
    data: mydata
    moves:
      start:  'first'
      step:   [ 'first', 'second', 'first', ]
    before:
      start: ( P... ) -> @sub.start()
    entering:
      first: ( P... ) ->
        T.ok @data.counter?
        @data.counter++
        info @data.counter
        register @cstate
      second: ( P... ) ->
        @sub.toggle()
        register @cstate
    sub:
      data:
        frobs: 0
      moves:
        start:  'dub'
        toggle: [ 'dub', 'frob', 'dub', ]
      leaving:
        frob: ( P... ) ->
          @data.frobs++
          help @data.frobs
  { result
    show_result
    register }    = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq fsm.data, { counter: 42, computed: 'helo', }
  fsm.start();  urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  # fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  # fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  show_result()
  T.eq result, [
    { stage: 'entering', verb: 'start', dpar: 'void', dest: 'first', changed: true, lstate: 'first', path: 'simple', data: { counter: 43, computed: 'helo' }, sub: { lstate: 'dub', path: 'simple/sub', data: { frobs: 0 } } }
    { stage: 'entering', verb: 'step', dpar: 'first', dest: 'second', changed: true, lstate: 'second', path: 'simple', data: { counter: 43, computed: 'helo' }, sub: { lstate: 'frob', path: 'simple/sub', data: { frobs: 0 } } }
    { stage: 'entering', verb: 'step', dpar: 'second', dest: 'first', changed: true, lstate: 'first', path: 'simple', data: { counter: 44, computed: 'helo' }, sub: { lstate: 'frob', path: 'simple/sub', data: { frobs: 0 } } }
    { stage: 'entering', verb: 'step', dpar: 'first', dest: 'second', changed: true, lstate: 'second', path: 'simple', data: { counter: 44, computed: 'helo' }, sub: { lstate: 'dub', path: 'simple/sub', data: { frobs: 1 } } } ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic catchalls 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'knob'
    moves:
      start:  'bar'
      step:   [ 'bar', 'baz', 'gnu', 'doe', 'bar', ]
    goto: 'any'
    before:
      any:         ( ref ) -> register 'before.any',    @move, ref
      change:      ( ref ) -> register 'before.change', @move, ref
    entering:
      any:         ( ref ) -> register 'entering.any',  @move, ref
    keeping:
      any:         ( ref ) -> register 'keeping.any',   @move, ref
    leaving:
      any:         ( ref ) -> register 'leaving.any',   @move, ref
    after:
      any:         ( ref ) -> register 'after.any',     @move, ref
      change:      ( ref ) -> register 'after.change',  @move, ref
    fail:          ( ref ) -> register 'fail',          @move, ref
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  info "fsm.start()     ———";           fsm.start             'A1'
  info "fsm.step()      ———";           fsm.step              'A2'
  info "fsm.goto.#{fsm.lstate}()  ———"; fsm.goto fsm.lstate,  'A3'
  show_result()
  T.eq result, [
    [ 'before.any',    { stage: 'before',   verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'void' }, 'A1' ]
    [ 'before.change', { stage: 'before',   verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'void' }, 'A1' ]
    [ 'leaving.any',   { stage: 'leaving',  verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'void' }, 'A1' ]
    [ 'entering.any',  { stage: 'entering', verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'bar'  }, 'A1' ]
    [ 'after.any',     { stage: 'after',    verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'bar'  }, 'A1' ]
    [ 'after.change',  { stage: 'after',    verb: 'start', dpar: 'void', dest: 'bar', changed: true,  lstate: 'bar'  }, 'A1' ]
    [ 'before.any',    { stage: 'before',   verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'bar'  }, 'A2' ]
    [ 'before.change', { stage: 'before',   verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'bar'  }, 'A2' ]
    [ 'leaving.any',   { stage: 'leaving',  verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'bar'  }, 'A2' ]
    [ 'entering.any',  { stage: 'entering', verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'baz'  }, 'A2' ]
    [ 'after.any',     { stage: 'after',    verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'baz'  }, 'A2' ]
    [ 'after.change',  { stage: 'after',    verb: 'step',  dpar: 'bar',  dest: 'baz', changed: true,  lstate: 'baz'  }, 'A2' ]
    [ 'before.any',    { stage: 'before',   verb: 'goto',  dpar: 'baz',  dest: 'baz', lstate: 'baz'  }, 'A3' ]
    [ 'keeping.any',   { stage: 'keeping',  verb: 'goto',  dpar: 'baz',  dest: 'baz', lstate: 'baz'  }, 'A3' ]
    [ 'after.any',     { stage: 'after',    verb: 'goto',  dpar: 'baz',  dest: 'baz', lstate: 'baz'  }, 'A3' ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic observables during moves 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'knob'
    moves:
      start:  'bar'
      step:   [ 'bar', 'baz', 'gnu', 'doe', 'bar', ]
    goto: 'any'
    before: any: ( P... ) -> register 'before any',  fsm.move
    fail:        ( P... ) -> register 'fail',        fsm.move
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  #.........................................................................................................
  register 'first', fsm.move
  info "fsm.start()"
  fsm.start()
  #.........................................................................................................
  register 'mid1', fsm.move
  info "fsm.step()"
  fsm.step()
  #.........................................................................................................
  register 'mid2', fsm.move
  fsm.goto fsm.lstate
  #.........................................................................................................
  register 'last', fsm.move
  #.........................................................................................................
  show_result()
  T.eq result, [
    [ 'first', { lstate: 'void' } ]
    [ 'before any', { stage: 'before', verb: 'start', dpar: 'void', dest: 'bar', changed: true, lstate: 'void' } ]
    [ 'mid1', { lstate: 'bar' } ]
    [ 'before any', { stage: 'before', verb: 'step', dpar: 'bar', dest: 'baz', changed: true, lstate: 'bar' } ]
    [ 'mid2', { lstate: 'baz' } ]
    [ 'before any', { stage: 'before', verb: 'goto', dpar: 'baz', dest: 'baz', lstate: 'baz' } ]
    [ 'last', { lstate: 'baz' } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic can 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'oneway_switch'
    moves:
      start:  'off'
      toggle: [ 'off', 'on', ]
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq true,  fsm.can.start()
  T.eq true,  fsm.can 'start'
  fsm.start()
  T.eq false, fsm.can.start()
  T.eq false, fsm.can 'start'
  T.eq true,  fsm.can 'toggle'
  T.eq true,  fsm.can.toggle()
  fsm.toggle()
  T.eq false, fsm.can   'toggle'
  T.eq false, fsm.can.toggle()
  T.throws /unknown verb "nonexisting_trigger"/, -> fsm.can 'nonexisting_trigger'
  T.throws /unknown verb "nonexisting_trigger"/, -> fsm.can.nonexisting_trigger()
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic tryto 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'oneway_switch'
    moves:
      start:  'off'
      toggle: [ 'off', 'on', ]
    goto: 'any'
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq true,  fsm.tryto.start()
  fsm.goto 'void'
  T.eq true,  fsm.tryto 'start'
  T.eq true,  fsm.tryto 'toggle'
  fsm.goto 'off'
  T.eq true,  fsm.tryto.toggle()
  T.eq false, fsm.tryto 'toggle'
  T.eq false, fsm.tryto.toggle()
  T.throws /unknown verb "nonexisting_trigger"/, -> fsm.tryto 'nonexisting_trigger'
  T.throws /unknown verb "nonexisting_trigger"/, -> fsm.can.nonexisting_trigger()
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    #.......................................................................................................
    moves:
      start:    'released'
      reset:    [ 'any',       'void',       ]
      press:    [ 'released',  'pressed',    ]
      release:  [ 'pressed',   'released',   ]
    entering:
      pressed:  ( P... ) -> @lamp.goto 'lit';   register "button: entering pressed",  @lstate
      released: ( P... ) -> @lamp.goto 'dark';  register "button: entering released", @lstate
    keeping:
      pressed:  ( P... ) -> register "button: keeping pressed",  @lstate
      released: ( P... ) -> register "button: keeping released", @lstate
    after:
      start: ( P... ) -> @lamp.start()
    before:
      trigger: ( P... ) -> register "button: before *", @lstate
    goto: 'any'
    #.......................................................................................................
    lamp:
      moves:
        start:    'lit'
        toggle:   [ 'lit', 'dark', 'lit', ]
      after:
        change:     ( P... ) -> register "lamp: after change", @lstate
      entering:
        dark:       ( P... ) -> @up.goto 'released';  register "lamp: entering dark", @lstate
        lit:        ( P... ) -> @up.goto 'pressed';   register "lamp: entering lit", @lstate
      keeping:
        dark:       ( P... ) -> register "lamp: keeping dark", @lstate
        lit:        ( P... ) -> register "lamp: keeping lit", @lstate
      before:
        trigger: ( P... ) -> register "lamp: before *", @lstate
      goto: 'any'
      bar:  108
    #.......................................................................................................
    after:
      change: ( P... ) -> register "root_fsm.change", @lstate
    foo: 42
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  button          = new Intermatic fsmd
  T.eq button.foo,         42
  T.eq button.lamp.bar, 108
  info button.moves
  info { button: { $value: button.lstate, lamp: button.lamp.lstate, }, }
  urge { button: button.lstate, 'button/lamp': button.lamp.lstate, }
  urge { button: button.lstate, button_lamp: button.lamp.lstate, }
  urge { root: button.lstate, lamp: button.lamp.lstate, }
  help [ "°button:^#{button.lstate}", "°button/lamp:^#{button.lamp.lstate}", ]
  button.start()
  info { button: { $value: button.lstate, lamp: button.lamp.lstate, }, }
  urge { button: button.lstate, 'button/lamp': button.lamp.lstate, }
  urge { button: button.lstate, button_lamp: button.lamp.lstate, }
  urge { root: button.lstate, lamp: button.lamp.lstate, }
  help [ "°button:^#{button.lstate}", "°button/lamp:^#{button.lamp.lstate}", ]
  button.press()
  info { button: { $value: button.lstate, lamp: button.lamp.lstate, }, }
  urge { button: button.lstate, 'button/lamp': button.lamp.lstate, }
  urge { button: button.lstate, button_lamp: button.lamp.lstate, }
  urge { root: button.lstate, lamp: button.lamp.lstate, }
  help [ "°button:^#{button.lstate}", "°button/lamp:^#{button.lamp.lstate}", ]
  show_result()
  T.eq result, [
    [ 'button: keeping released', 'released' ]
    [ 'lamp: entering dark', 'dark' ]
    [ 'lamp: after change', 'dark' ]
    [ 'button: entering released', 'released' ]
    [ 'root_fsm.change', 'released' ]
    [ 'button: keeping pressed', 'pressed' ]
    [ 'lamp: entering lit', 'lit' ]
    [ 'lamp: after change', 'lit' ]
    [ 'button: entering pressed', 'pressed' ]
    [ 'root_fsm.change', 'pressed' ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm 2" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades: [ 'start', ]
    name:     'cfsm2'
    moves:
      start:  'active'
    #.....................................................................................................
    alpha_btn:
      cascades: [ 'start', ]
      moves:
        start:    'released'
        reset:    [ 'any',       'void',       ]
        press:    [ 'released',  'pressed',    ]
        release:  [ 'pressed',   'released',   ]
      #.....................................................................................................
      color:
        moves:
          start:  'red'
          toggle: [ 'red', 'green', 'red', ]
      #.....................................................................................................
      lamp:
        moves:
          start:    'lit'
          toggle:   [ 'lit', 'dark', 'lit', ]
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  register fsm.cstate
  fsm.start()
  register fsm.cstate
  show_result()
  T.eq result, [
    { lstate: 'void', path: 'cfsm2', alpha_btn: { lstate: 'void', path: 'cfsm2/alpha_btn', color: { lstate: 'void', path: 'cfsm2/alpha_btn/color' }, lamp: { lstate: 'void', path: 'cfsm2/alpha_btn/lamp' } } }
    { lstate: 'active', path: 'cfsm2', alpha_btn: { lstate: 'released', path: 'cfsm2/alpha_btn', color: { lstate: 'red', path: 'cfsm2/alpha_btn/color' }, lamp: { lstate: 'lit', path: 'cfsm2/alpha_btn/lamp' } } } ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm event bubbling" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades: [ 'start', ]
    name:     'cfsm2'
    moves:
      start:  'active'
    #.....................................................................................................
    get_states: -> { btn: @alpha_btn.lstate, color: @alpha_btn.color.lstate, lamp: @alpha_btn.lamp.lstate, }
    #.....................................................................................................
    after:
      any:            -> register 'after.any',     @get_states()
      # change:         -> register 'after.change',  @get_states()
      EXP_any_change: ( changed_fsm ) -> register "EXP_any_change #{changed_fsm.name}: #{changed_fsm.lstate}",
    #.....................................................................................................
    alpha_btn:
      cascades: [ 'start', ]
      moves:
        start:    'released'
        reset:    [ 'any',       'void',       ]
        press:    [ 'released',  'pressed',    ]
        release:  [ 'pressed',   'released',   ]
      #.....................................................................................................
      entering:
        pressed:  -> @lamp.tryto.on();  @color.step()
        released: -> @lamp.tryto.off()
      #.....................................................................................................
      color:
        moves:
          start:  'red'
          step:   [ 'red', 'amber', 'green', 'red', ]
      #.....................................................................................................
      lamp:
        moves:
          start:    'dark'
          toggle:   [ 'lit', 'dark', 'lit', ]
          on:       [ 'dark', 'lit',  ]
          off:      [ 'lit',  'dark', ]
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  info 'fsm.start()';               fsm.start()
  urge fsm.get_states()
  info 'fsm.alpha_btn.press()';     fsm.alpha_btn.press()
  urge fsm.get_states()
  info 'fsm.alpha_btn.release()';   fsm.alpha_btn.release()
  urge fsm.get_states()
  info 'fsm.alpha_btn.press()';     fsm.alpha_btn.press()
  urge fsm.get_states()
  show_result()
  T.eq result, [
    'EXP_any_change color: red'
    'EXP_any_change lamp: dark'
    'EXP_any_change alpha_btn: released'
    [ 'after.any', { btn: 'released', color: 'red', lamp: 'dark' } ]
    'EXP_any_change lamp: lit'
    'EXP_any_change color: amber'
    'EXP_any_change alpha_btn: pressed'
    'EXP_any_change lamp: dark'
    'EXP_any_change alpha_btn: released'
    'EXP_any_change lamp: lit'
    'EXP_any_change color: green'
    'EXP_any_change alpha_btn: pressed' ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm root_fsm" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades: [ 'start', ]
    name:     'cfsm2'
    moves:
      start:  'active'
    #.....................................................................................................
    alpha_btn:
      cascades: [ 'start', ]
      moves:
        start:    'released'
      #.....................................................................................................
      color:
        moves:
          start:  'red'
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq fsm.root_fsm,                  null
  T.eq fsm.alpha_btn.root_fsm,        fsm
  T.eq fsm.alpha_btn.color.root_fsm,  fsm
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic custom paths 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades:         [ 'start', ]
    moves:
      start:  'active'
    #.....................................................................................................
    switch:
      cascades: [ 'start', ]
      moves:
        start:    'released'
      #.....................................................................................................
      lamp:
        cascades: [ 'start', ]
        moves:
          start:    'dark'
          toggle:   [ 'lit', 'dark', 'lit', ]
          on:       [ 'dark', 'lit',  ]
          off:      [ 'lit',  'dark', ]
        #...................................................................................................
        color:
          moves:
            start:  'red'
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  # urge fsm.omit_root_name,              false
  # urge fsm.switch.omit_root_name,       false
  # urge fsm.switch.lamp.omit_root_name,  false
  # urge fsm.path_separator,              '/'
  # urge fsm.switch.path_separator,       '/'
  # urge fsm.switch.lamp.path_separator,  '/'
  # urge fsm.breadcrumbs,                 [ 'FSM', ]
  # urge fsm.switch.breadcrumbs,          [ 'FSM',  'switch', ]
  # urge fsm.switch.lamp.breadcrumbs,     [ 'FSM',  'switch', 'lamp', ]
  # urge fsm.path,                        'FSM'
  # urge fsm.switch.path,                 'FSM/switch'
  # urge fsm.switch.lamp.path,            'FSM/switch/lamp'
  T.eq fsm.omit_root_name,              false
  T.eq fsm.switch.omit_root_name,       false
  T.eq fsm.switch.lamp.omit_root_name,  false
  T.eq fsm.path_separator,              '/'
  T.eq fsm.switch.path_separator,       '/'
  T.eq fsm.switch.lamp.path_separator,  '/'
  T.eq fsm.breadcrumbs,                 [ 'FSM', ]
  T.eq fsm.switch.breadcrumbs,          [ 'FSM',  'switch', ]
  T.eq fsm.switch.lamp.breadcrumbs,     [ 'FSM',  'switch', 'lamp', ]
  T.eq fsm.path,                        'FSM'
  T.eq fsm.switch.path,                 'FSM/switch'
  T.eq fsm.switch.lamp.path,            'FSM/switch/lamp'
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic custom paths 2" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades:         [ 'start', ]
    name:             'cfsm2'
    omit_root_name:   true
    path_separator:   '#'
    moves:
      start:  'active'
    #.....................................................................................................
    switch:
      cascades: [ 'start', ]
      moves:
        start:    'released'
      #.....................................................................................................
      lamp:
        cascades: [ 'start', ]
        moves:
          start:    'dark'
          toggle:   [ 'lit', 'dark', 'lit', ]
          on:       [ 'dark', 'lit',  ]
          off:      [ 'lit',  'dark', ]
        #...................................................................................................
        color:
          moves:
            start:  'red'
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  # urge fsm.omit_root_name,              true
  # urge fsm.switch.omit_root_name,       true
  # urge fsm.switch.lamp.omit_root_name,  true
  # urge fsm.path_separator,              '#'
  # urge fsm.switch.path_separator,       '#'
  # urge fsm.switch.lamp.path_separator,  '#'
  # urge fsm.breadcrumbs,                 []
  # urge fsm.switch.breadcrumbs,          [ 'switch', ]
  # urge fsm.switch.lamp.breadcrumbs,     [ 'switch', 'lamp', ]
  # urge fsm.path,                        'cfsm2'
  # urge fsm.switch.path,                 'switch'
  # urge fsm.switch.lamp.path,            'switch#lamp'
  T.eq fsm.omit_root_name,              true
  T.eq fsm.switch.omit_root_name,       true
  T.eq fsm.switch.lamp.omit_root_name,  true
  T.eq fsm.path_separator,              '#'
  T.eq fsm.switch.path_separator,       '#'
  T.eq fsm.switch.lamp.path_separator,  '#'
  T.eq fsm.breadcrumbs,                 []
  T.eq fsm.switch.breadcrumbs,          [ 'switch', ]
  T.eq fsm.switch.lamp.breadcrumbs,     [ 'switch', 'lamp', ]
  T.eq fsm.path,                        'cfsm2'
  T.eq fsm.switch.path,                 'switch'
  T.eq fsm.switch.lamp.path,            'switch#lamp'
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "____ Intermatic custom paths 2" ] = ( T, done ) ->
  ### TAINT overwriting inheritables is under consideration; might re-write implementation to simplify code ###
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades:         [ 'start', ]
    name:             'cfsm2'
    omit_root_name: true
    moves:
      start:  'active'
    #.....................................................................................................
    switch:
      cascades: [ 'start', ]
      path_separator:   '='
      moves:
        start:    'released'
      #.....................................................................................................
      lamp:
        cascades: [ 'start', ]
        moves:
          start:    'dark'
          toggle:   [ 'lit', 'dark', 'lit', ]
          on:       [ 'dark', 'lit',  ]
          off:      [ 'lit',  'dark', ]
        #...................................................................................................
        color:
          moves:
            start:  'red'
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq fsm.omit_root_name,              true
  T.eq fsm.switch.omit_root_name,       true
  T.eq fsm.switch.lamp.omit_root_name,  true
  T.eq fsm.path_separator,                '#'
  T.eq fsm.switch.path_separator,         '#'
  T.eq fsm.switch.lamp.path_separator,    '#'
  T.eq fsm.path,                          'cfsm2'
  T.eq fsm.switch.path,                   'cfsm2#switch'
  T.eq fsm.switch.lamp.path,              'cfsm2#switch#lamp'
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic reserved keys" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    cascades: [ 'start', ]
    name:     'cfsm2'
    moves:
      start:  'active'
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  urge '^788345^', fsm._reserved_keys
  # '_cancelled'
  # '_lstate'
  # '_nxt_dest'
  # '_nxt_dpar'
  # '_nxt_verb'
  # '_path'
  # '_prv_lstates'
  # '_prv_verbs'
  # '_reserved_keys'
  # '_stage'
  # '_state_stages'
  # '_tmp'
  # '_trigger_stages'
  T.ok fsm._reserved_keys.has 'after'
  T.ok fsm._reserved_keys.has 'before'
  T.ok fsm._reserved_keys.has 'cascades'
  T.ok fsm._reserved_keys.has 'cstate'
  T.ok fsm._reserved_keys.has 'data'
  T.ok fsm._reserved_keys.has 'entering'
  T.ok fsm._reserved_keys.has 'EXP_dstate'
  T.ok fsm._reserved_keys.has 'fsm_names'
  T.ok fsm._reserved_keys.has 'has_subfsms'
  T.ok fsm._reserved_keys.has 'history_length'
  T.ok fsm._reserved_keys.has 'keeping'
  T.ok fsm._reserved_keys.has 'leaving'
  T.ok fsm._reserved_keys.has 'lstate'
  T.ok fsm._reserved_keys.has 'lstates'
  T.ok fsm._reserved_keys.has 'moves'
  T.ok fsm._reserved_keys.has 'up'
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic AAL style FSMDs 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'φ'
    moves:
      start:    'a'
      step:     [ 'a', 'b', 'c', 'c', ]
      stop:     [ 'c', 'void', ]
    before:
      any:      before_any    = -> register "before.any",     @move
      change:   before_change = -> register "before.change",  @move
      start: [
              ( before_start_1 = -> debug '^7776^', "before.start 1", @move )
              ( before_start_2 = -> debug '^7776^', "before.start 2", @move )
              ( before_start_3 = -> register "before.start",          @move ) ]
      step:     before_step = -> register "before.step", @move
      stop:     before_stop = -> register "before.stop", @move
    after:
      any:      -> register "after.any",          @move
      change:   -> register "after.change",       @move
      start:    -> register "after.start",        @move
      step:     -> register "after.step",         @move
      stop:     -> register "after.stop",         @move
    entering:
      any:      -> register "entering.any",       @move
      void:     -> register "entering.void",      @move
      a:        -> register "entering.a",         @move
      b:        -> register "entering.b",         @move
      c:        -> register "entering.c",         @move
    leaving:
      any:      -> register "leaving.any",        @move
      void:     -> register "leaving.void",       @move
      a:        -> register "leaving.a",          @move
      b:        -> register "leaving.b",          @move
      c:        -> register "leaving.c",          @move
    keeping:
      any:      -> register "keeping.any",        @move
      c:        -> register "keeping.c",          @move
    fail:       -> register "fail",               @move
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  echo '^4455^', CND.inspect fsm
  urge '^4455^', fsmd.moves
  help '^4455^', fsm.moves
  fsm.start()
  fsm.step()
  fsm.step()
  fsm.step()
  fsm.stop()
  fsm.step()
  show_result()
  T.eq result, [
    [ 'before.any', { stage: 'before', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'void' } ]
    [ 'before.change', { stage: 'before', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'void' } ]
    [ 'before.start', { stage: 'before', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'void' } ]
    [ 'leaving.any', { stage: 'leaving', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'void' } ]
    [ 'leaving.void', { stage: 'leaving', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'void' } ]
    [ 'entering.any', { stage: 'entering', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'a' } ]
    [ 'entering.a', { stage: 'entering', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'a' } ]
    [ 'after.any', { stage: 'after', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'a' } ]
    [ 'after.change', { stage: 'after', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'a' } ]
    [ 'after.start', { stage: 'after', verb: 'start', dpar: 'void', dest: 'a', changed: true, lstate: 'a' } ]
    [ 'before.any', { stage: 'before', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'a' } ]
    [ 'before.change', { stage: 'before', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'a' } ]
    [ 'before.step', { stage: 'before', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'a' } ]
    [ 'leaving.any', { stage: 'leaving', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'a' } ]
    [ 'leaving.a', { stage: 'leaving', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'a' } ]
    [ 'entering.any', { stage: 'entering', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'b' } ]
    [ 'entering.b', { stage: 'entering', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'b' } ]
    [ 'after.any', { stage: 'after', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'b' } ]
    [ 'after.change', { stage: 'after', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'b' } ]
    [ 'after.step', { stage: 'after', verb: 'step', dpar: 'a', dest: 'b', changed: true, lstate: 'b' } ]
    [ 'before.any', { stage: 'before', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'b' } ]
    [ 'before.change', { stage: 'before', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'b' } ]
    [ 'before.step', { stage: 'before', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'b' } ]
    [ 'leaving.any', { stage: 'leaving', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'b' } ]
    [ 'leaving.b', { stage: 'leaving', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'b' } ]
    [ 'entering.any', { stage: 'entering', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'c' } ]
    [ 'entering.c', { stage: 'entering', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'c' } ]
    [ 'after.any', { stage: 'after', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'c' } ]
    [ 'after.change', { stage: 'after', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'c' } ]
    [ 'after.step', { stage: 'after', verb: 'step', dpar: 'b', dest: 'c', changed: true, lstate: 'c' } ]
    [ 'before.any', { stage: 'before', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'before.step', { stage: 'before', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'keeping.any', { stage: 'keeping', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'keeping.c', { stage: 'keeping', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'after.any', { stage: 'after', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'after.step', { stage: 'after', verb: 'step', dpar: 'c', dest: 'c', lstate: 'c' } ]
    [ 'before.any', { stage: 'before', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'c' } ]
    [ 'before.change', { stage: 'before', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'c' } ]
    [ 'before.stop', { stage: 'before', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'c' } ]
    [ 'leaving.any', { stage: 'leaving', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'c' } ]
    [ 'leaving.c', { stage: 'leaving', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'c' } ]
    [ 'entering.any', { stage: 'entering', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'void' } ]
    [ 'entering.void', { stage: 'entering', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'void' } ]
    [ 'after.any', { stage: 'after', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'void' } ]
    [ 'after.change', { stage: 'after', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'void' } ]
    [ 'after.stop', { stage: 'after', verb: 'stop', dpar: 'c', dest: 'void', changed: true, lstate: 'void' } ]
    [ 'fail', { verb: 'step', dpar: 'void', lstate: 'void', failed: true } ] ]
  #---------------------------------------------------------------------------------------------------------
  done() if done?


############################################################################################################
if module is require.main then do =>
  # @demo_2()
  # @toolbox_demo()
  test @
  # test @[ "Intermatic custom paths 1" ]
  # test @[ "Intermatic custom paths 2" ]
  # @[ "Intermatic custom paths 1" ]()
  # test @[ "Intermatic cFsm root_fsm" ]
  # @[ "Intermatic cFsm root_fsm" ]()
  # test @[ "Intermatic cFsm event bubbling" ]
  # test @[ "Intermatic reserved keys" ]
  # test @[ "___ Intermatic attribute freezing"        ]
  # test @[ "Intermatic empty FSM"                     ]
  # test @[ "Intermatic fairly minimal FSM without moves" ]
  # test @[ "Intermatic before.start(), after.start()" ]
  # test @[ "Intermatic basics" ]
  # test @[ "Intermatic history" ]
  # @[ "Intermatic cancel moves" ]()
  # test @[ "Intermatic cancel moves" ]
  # test @[ "Intermatic goto 1" ]
  # test @[ "Intermatic data attribute 1" ]
  # test @[ "Intermatic catchalls 1" ]
  # test @[ "Intermatic observables during moves 1" ]
  # test @[ "Intermatic can 1" ]
  # test @[ "Intermatic tryto 1" ]
  # test @[ "Intermatic cFsm 1" ]
  # test @[ "Intermatic cFsm 2" ]
  # test @[ "Intermatic AAL style FSMDs 1" ]








