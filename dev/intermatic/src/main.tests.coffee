
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
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic {}
  T.eq fsm.triggers, { start: { void: 'void' } }
  T.eq fsm.start(), null
  T.eq fsm.lstate,   'void'
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic before.start(), after.start()" ] = ( T, done ) ->
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    before:
      start: -> register "before start"
    after:
      start: -> register "after start"
  #---------------------------------------------------------------------------------------------------------
  Intermatic._tid = 0
  fsm = new Intermatic fsmd
  T.eq fsm.start(), null
  T.eq fsm.lstate,  'void'
  T.eq result,      [ 'before start', 'after start' ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic basics" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    triggers: [
      [ 'void',   'start',  'lit',  ]
      [ '*',      'reset',  'void', ]
      [ 'lit',    'toggle', 'dark', ]
      [ 'dark',   'toggle', 'lit',  ]
      # [ 'void',   'toggle', 'lit',  ]
      ]
    after:
      change:     -> register "after change", @cstate
    enter:
      dark:       -> register "enter dark", @cstate
    leave:
      lit:        -> register "leave lit", @cstate
    fail:         -> register "failed", @cstate
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  info '^44455^', JSON.stringify fsm.triggers, null, 2
  T.eq fsm.triggers,
    "start":
      "void": "lit"
    "toggle":
      "lit": "dark",
      "dark": "lit"
    "reset":
      "void": "void",
      "lit": "void",
      "dark": "void"
  fsm.start()
  fsm.toggle()
  fsm.reset()
  fsm.toggle()
  # fsm.goto 'lit'
  # fsm.goto 'lit'
  # fsm.goto 'dark'
  echo result
  T.eq result, [
    [ 'after change', { lstate: 'lit', path: 'meta_lamp', verb: 'start', dpar: 'void', dest: 'lit', changed: true } ],
    [ 'leave lit', { lstate: 'lit', path: 'meta_lamp', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true } ],
    [ 'enter dark', { lstate: 'dark', path: 'meta_lamp', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true } ],
    [ 'after change', { lstate: 'dark', path: 'meta_lamp', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true } ],
    [ 'after change', { lstate: 'void', path: 'meta_lamp', verb: 'reset', dpar: 'dark', dest: 'void', changed: true } ],
    [ 'failed', { lstate: 'void', path: 'meta_lamp', verb: 'toggle', dpar: 'void', failed: true, } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic history" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    triggers: [
      [ 'void',     'start',  'lit',  ]
      [ '*',        'reset',  'void', ]
      [ '*',        'flash',  'flashing', ]
      [ 'flashing', 'toggle', 'dark', ]
      [ 'lit',      'toggle', 'dark', ]
      [ 'dark',     'toggle', 'lit',  ]
      ]
    after:
      change:     ( P... ) -> register @history
  #---------------------------------------------------------------------------------------------------------
  { result
    register }        = new_register()
  Intermatic          = require '../../../apps/intermatic'
  Intermatic._tid     = 0
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
@[ "Intermatic cancel moves" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'boiler'
    # cascades:
    #   # start: '*' ### TAINT all FSMs in tree? all sibling FSMs? parent FSMs? ###
    #   start: [ 'heater', ]
    before:
      start: ( P... ) -> @heater.start P...
    after:
      change:     ( P... ) -> register @cstate
    fsms:
      heater:
        data: { temparature: 20, }
        triggers: [
          [ 'void',     'start',      'idle',     ]
          [ 'heating',  'switch_off', 'idle',     ]
          [ 'idle',     'switch_on',  'heating',  ] ]
        # after:
        #   change: ( P... ) -> @up.
  #---------------------------------------------------------------------------------------------------------
  { result
    register }        = new_register()
  Intermatic          = require '../../../apps/intermatic'
  Intermatic._tid     = 0
  boiler                 = new Intermatic fsmd
  boiler.start()
  boiler.heater.switch_on()
  # boiler.thermo.
  # T.eq result,
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic goto 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    triggers: [
      [ 'void',   'start', 'lit',   ]
      [ '*',      'reset', 'void',  ]
      [ 'lit',    'toggle', 'dark', ]
      [ 'dark',   'toggle', 'lit',  ]
      # [ 'void',   'toggle', 'lit',  ]
      ]
    before:
      any:        ( P... ) -> register 'before.any',  @cstate, P
    # after:
    #   change:     ( P... ) -> register 'after.change',  @cstate
    # enter:
    #   dark:       ( P... ) -> register 'enter.dark',    @cstate
    #   lit:        ( P... ) -> register 'enter.lit',     @cstate
    goto:         '*'
    fail:         ( P... ) -> register 'failed',        @cstate, P
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  # T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'triggers', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'enter', 'stay', 'leave', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
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
    [ 'before.any', { path: 'meta_lamp', lstate: 'void', verb: 'start', dpar: 'void', dest: 'lit', changed: true }, [ 'M1' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'lit', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true }, [ 'M2' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'dark', verb: 'goto', dpar: 'dark', dest: 'lit', changed: true }, [ 'M3' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'lit', verb: 'goto', dpar: 'lit', dest: 'lit' }, [ 'M4' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'lit', verb: 'goto', dpar: 'lit', dest: 'dark', changed: true }, [ 'M5' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'dark', verb: 'toggle', dpar: 'dark', dest: 'lit', changed: true }, [ 'M6' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'lit', verb: 'toggle', dpar: 'lit', dest: 'dark', changed: true }, [ 'M7' ] ]
    [ 'before.any', { path: 'meta_lamp', lstate: 'dark', verb: 'toggle', dpar: 'dark', dest: 'lit', changed: true }, [ 'M8' ] ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cyclers 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'switch'
    triggers: [
      [ 'void', 'start', 'off', ]
      ]
    cyclers:
      toggle: [ 'on', 'off', ]
      step:   [ 'bar', 'baz', 'gnu', 'doe', ]
    goto: '*'
    after:
      change:     ( ref ) -> register @cstate, ref
    fail:         ( ref ) -> register @cstate, ref
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  fsm.start       'X1'
  fsm.toggle      'X2'
  fsm.toggle      'X3'
  fsm.step        'X4'
  fsm.goto 'doe', 'X5'
  fsm.step        'X6'
  fsm.step        'X7'
  fsm.step        'X8'
  fsm.step        'X9'
  fsm.step        'X10'
  show_result()
  T.eq result, [
    [ { path: 'switch', lstate: 'off', verb: 'start', dpar: 'void', dest: 'off', changed: true }, 'X1' ]
    [ { path: 'switch', lstate: 'on', verb: 'toggle', dpar: 'off', dest: 'on', changed: true }, 'X2' ]
    [ { path: 'switch', lstate: 'off', verb: 'toggle', dpar: 'on', dest: 'off', changed: true }, 'X3' ]
    [ { path: 'switch', lstate: 'off', verb: 'step', dpar: 'off', failed: true }, 'X4' ]
    [ { path: 'switch', lstate: 'doe', verb: 'goto', dpar: 'off', dest: 'doe', changed: true }, 'X5' ]
    [ { path: 'switch', lstate: 'bar', verb: 'step', dpar: 'doe', dest: 'bar', changed: true }, 'X6' ]
    [ { path: 'switch', lstate: 'baz', verb: 'step', dpar: 'bar', dest: 'baz', changed: true }, 'X7' ]
    [ { path: 'switch', lstate: 'gnu', verb: 'step', dpar: 'baz', dest: 'gnu', changed: true }, 'X8' ]
    [ { path: 'switch', lstate: 'doe', verb: 'step', dpar: 'gnu', dest: 'doe', changed: true }, 'X9' ]
    [ { path: 'switch', lstate: 'bar', verb: 'step', dpar: 'doe', dest: 'bar', changed: true }, 'X10' ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic data attribute 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'simple'
    data:
      counter: 42
    triggers: [
      [ 'void', 'start', 'first' ] ]
    cyclers:
      step: [ 'first', 'second', ]
    before:
      start: ( P... ) -> @sub.start()
    enter:
      first: ( P... ) ->
        T.ok @data.counter?
        @data.counter++
        info @data.counter
        register @cstate
      second: ( P... ) ->
        @sub.toggle()
        register @cstate
    fsms:
      sub:
        data:
          frobs: 0
        triggers: [
          [ 'void', 'start', 'dub' ] ]
        cyclers:
          toggle: [ 'dub', 'frob' ]
        leave:
          frob: ( P... ) ->
            @data.frobs++
            help @data.frobs
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  T.eq fsm.data, { counter: 42, }
  fsm.start();  urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  # fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  # fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
  info d for d in result
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic catchalls 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'knob'
    triggers: [
      [ 'void', 'start', 'bar', ]
      ]
    cyclers:
      step:   [ 'bar', 'baz', 'gnu', 'doe', ]
    goto: '*'
    before: any: ( ref ) -> register 'before any',  @lstate, @verb, ref
    enter:  any: ( ref ) -> register 'enter any',   @lstate, @verb, ref
    stay:   any: ( ref ) -> register 'stay any',    @lstate, @verb, ref
    leave:  any: ( ref ) -> register 'leave any',   @lstate, @verb, ref
    after:  any: ( ref ) -> register 'after any',   @lstate, @verb, ref
    fail:        ( ref ) -> register 'fail',        @lstate, @verb, ref
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  info "fsm.start()     ———";           fsm.start             'A1'
  info "fsm.step()      ———";           fsm.step              'A2'
  info "fsm.goto.#{fsm.lstate}()  ———"; fsm.goto fsm.lstate,  'A3'
  show_result()
  T.eq result, [
    [ 'before any', 'void', 'start', 'A1' ]
    [ 'leave any', 'void', 'start', 'A1' ]
    [ 'enter any', 'bar', 'start', 'A1' ]
    [ 'after any', 'bar', 'start', 'A1' ]
    [ 'before any', 'bar', 'step', 'A2' ]
    [ 'leave any', 'bar', 'step', 'A2' ]
    [ 'enter any', 'baz', 'step', 'A2' ]
    [ 'after any', 'baz', 'step', 'A2' ]
    [ 'before any', 'baz', 'goto', 'A3' ]
    [ 'stay any', 'baz', 'goto', 'A3' ]
    [ 'after any', 'baz', 'goto', 'A3' ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic observables during moves 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'knob'
    triggers: [
      [ 'void', 'start', 'bar', ]
      ]
    cyclers:
      step:   [ 'bar', 'baz', 'gnu', 'doe', ]
    goto: '*'
    before: any: ( P... ) -> register 'before any',  fsm.cstate
    # enter:  any: ( P... ) -> register 'enter any',   fsm.cstate
    # stay:   any: ( P... ) -> register 'stay any',    fsm.cstate
    # leave:  any: ( P... ) -> register 'leave any',   fsm.cstate
    # after:  any: ( P... ) -> register 'after any',   fsm.cstate
    fail:        ( P... ) -> register 'fail',        fsm.cstate
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  register 'first', fsm.cstate
  info "fsm.start()     ———"; fsm.start()
  register 'mid1', fsm.cstate
  info "fsm.step()      ———"; fsm.step()
  info "fsm.goto.#{fsm.lstate}()  ———"; fsm.goto fsm.lstate
  register 'last', fsm.cstate
  show_result()
  T.eq result, [
    [ 'first', { path: 'knob', lstate: 'void' } ]
    [ 'before any', { path: 'knob', lstate: 'void', verb: 'start', dpar: 'void', dest: 'bar', changed: true } ]
    [ 'mid1', { path: 'knob', lstate: 'bar' } ]
    [ 'before any', { path: 'knob', lstate: 'bar', verb: 'step', dpar: 'bar', dest: 'baz', changed: true } ]
    [ 'before any', { path: 'knob', lstate: 'baz', verb: 'goto', dpar: 'baz', dest: 'baz' } ]
    [ 'last', { path: 'knob', lstate: 'baz' } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic tryto 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'oneway_switch'
    triggers: [
      [ 'void', 'start',  'off', ]
      [ 'off',  'toggle', 'on', ]
      ]
    after:
      change:     ( P... ) -> register "success: #{@dpar}>-#{@verb}->#{@dest}"
    fail:         ( P... ) -> register "failure: #{@dpar}>-#{@verb}->?"
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  fsm.start()
  T.eq true,  fsm.can.toggle()
  T.eq true,  fsm.tryto.toggle()
  T.eq false, fsm.can   'toggle'
  T.eq false, fsm.tryto 'toggle'
  T.throws /unknown trigger "nonexisting_trigger"/, -> fsm.can 'nonexisting_trigger'
  show_result()
  T.eq result, [ 'success: void>-start->off', 'success: off>-toggle->on' ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic tryto 2" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'oneway_switch'
    triggers: [
      [ 'void', 'start',  'one', ]
      ]
    cyclers:
      step: [ 'one', 'two', 'three', ]
    after:
      change:     ( P... ) -> register @cstate
      # step:       ( P... ) -> @step()
    fail:         ( P... ) -> register @cstate
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  eq = ( ref, test, outcome ) ->
    if isa.function test
      ref  += ' ' + test.toString().replace /\n/g, ' '
      test  = test()
    if equals test, outcome then T.ok true
    else                T.fail "test #{rpr ref} failed"
  debug ( k for k of CND ).sort()
  eq '^tt2@1',  ( -> fsm.lstate           ), 'void'
  eq '^tt2@2',  ( -> fsm.triggers.start   ), { void: 'one', }
  eq '^tt2@3',  ( -> fsm.can.start()      ), true
  eq '^tt2@4',  ( -> fsm.can 'start'      ), true
  eq '^tt2@5',  ( -> fsm.start()          ), null               # one
  eq '^tt2@6',  ( -> fsm.lstate           ), 'one'
  eq '^tt2@7',  ( -> fsm.can.start()      ), false
  eq '^tt2@8',  ( -> fsm.can 'start'      ), false
  eq '^tt2@9',  ( -> fsm.step()           ), null               # two
  eq '^tt2@10', ( -> fsm.tryto.step()     ), true               # three
  eq '^tt2@11', ( -> fsm.step()           ), null               # one
  eq '^tt2@12', ( -> fsm.tryto.step()     ), true               # two
  eq '^tt2@13', ( -> fsm.tryto.start()    ), false
  show_result()
  T.eq result, [
    { path: 'oneway_switch', lstate: 'one', verb: 'start', dpar: 'void', dest: 'one', changed: true }
    { path: 'oneway_switch', lstate: 'two', verb: 'step', dpar: 'one', dest: 'two', changed: true }
    { path: 'oneway_switch', lstate: 'three', verb: 'step', dpar: 'two', dest: 'three', changed: true }
    { path: 'oneway_switch', lstate: 'one', verb: 'step', dpar: 'three', dest: 'one', changed: true }
    { path: 'oneway_switch', lstate: 'two', verb: 'step', dpar: 'one', dest: 'two', changed: true } ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm 1" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    #.......................................................................................................
    triggers: [
      [ 'void',     'start',    'released',   ]
      [ '*',        'reset',    'void',       ]
      [ 'released', 'press',    'pressed',    ]
      [ 'pressed',  'release',  'released',   ] ]
    enter:
      pressed:  ( P... ) -> @lamp.goto 'lit';   register "button: enter pressed", @lstate
      released: ( P... ) -> @lamp.goto 'dark';  register "button: enter released", @lstate
    stay:
      pressed:  ( P... ) -> register "button: stay pressed", @lstate
      released: ( P... ) -> register "button: stay released", @lstate
    after:
      start: ( P... ) -> @lamp.start()
    before:
      trigger: ( P... ) -> register "button: before *", @lstate
    goto: '*'
    #.......................................................................................................
    fsms:
      #.....................................................................................................
      lamp:
        triggers: [
          [ 'void',   'start',  'lit',  ]
          [ 'lit',    'toggle', 'dark', ]
          [ 'dark',   'toggle', 'lit',  ] ]
        after:
          change:     ( P... ) -> register "lamp: after change", @lstate
        enter:
          dark:       ( P... ) -> @up.goto 'released';  register "lamp: enter dark", @lstate
          lit:        ( P... ) -> @up.goto 'pressed';   register "lamp: enter lit", @lstate
        stay:
          dark:       ( P... ) -> register "lamp: stay dark", @lstate
          lit:        ( P... ) -> register "lamp: stay lit", @lstate
        before:
          trigger: ( P... ) -> register "lamp: before *", @lstate
        goto: '*'
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
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  button          = new Intermatic fsmd
  T.eq button.foo,         42
  T.eq button.lamp.bar, 108
  info button.triggers
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
    [ 'button: stay released', 'released' ]
    [ 'lamp: enter dark', 'dark' ]
    [ 'lamp: after change', 'dark' ]
    [ 'button: enter released', 'released' ]
    [ 'root_fsm.change', 'released' ]
    [ 'button: stay pressed', 'pressed' ]
    [ 'lamp: enter lit', 'lit' ]
    [ 'lamp: after change', 'lit' ]
    [ 'button: enter pressed', 'pressed' ]
    [ 'root_fsm.change', 'pressed' ] ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm 2" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'cfsm2'
    fsms:
      alpha_btn:
        #.......................................................................................................
        triggers: [
          [ 'void',     'start',    'released',   ]
          [ '*',        'reset',    'void',       ]
          [ 'released', 'press',    'pressed',    ]
          [ 'pressed',  'release',  'released',   ] ]
        # enter:
        #   pressed:  ( P... ) ->
        #   released: ( P... ) ->
        before:
          start:    ( P... ) -> @lamp.start()
        after:
          change:   ( P... ) ->
            @lamp.toggle()
            register "alpha_btn.after.change", @EXP_cstate
        #.......................................................................................................
        fsms:
          #.....................................................................................................
          color:
            triggers: [
              [ 'red', 'toggle', 'green', ]
              [ 'green', 'toggle', 'red', ] ]
            after:
              change:   ( P... ) -> register "color.after.change", @EXP_cstate
          #.....................................................................................................
          lamp:
            triggers: [
              [ 'void',   'start',  'lit',  ]
              [ 'lit',    'toggle', 'dark', ]
              [ 'dark',   'toggle', 'lit',  ] ]
            before:
              start:    ( P... ) -> @up.color.start()
            enter:
              dark:     ( P... ) -> @up.color.toggle()
            after:
              change:   ( P... ) -> register "lamp.after.change", @EXP_cstate
  #---------------------------------------------------------------------------------------------------------
  { result
    register
    show_result } = new_register()
  #---------------------------------------------------------------------------------------------------------
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  # debug '^898922^', fsm
  # debug '^898922^', ( k for k of fsm )
  whisper '-----------'
  whisper 'start'
  fsm.alpha_btn.start()
  whisper '-----------'
  whisper 'press'
  fsm.alpha_btn.press()
  whisper '-----------'
  whisper 'release'
  fsm.alpha_btn.release()
  whisper '-----------'
  whisper 'press'
  fsm.alpha_btn.press()
  whisper '-----------'
  whisper 'release'
  fsm.alpha_btn.release()
  whisper '-----------'
  show_result()
  T.eq result, [
    [ 'color.after.change', { lstate: 'green' } ]
    [ 'lamp.after.change', { lstate: 'lit' } ]
    [ 'color.after.change', { lstate: 'red' } ]
    [ 'lamp.after.change', { lstate: 'dark' } ]
    [ 'alpha_btn.after.change', { lstate: 'released', color: { lstate: 'red' }, lamp: { lstate: 'dark' } } ]
    [ 'lamp.after.change', { lstate: 'lit' } ]
    [ 'alpha_btn.after.change', { lstate: 'pressed', color: { lstate: 'red' }, lamp: { lstate: 'lit' } } ]
    [ 'color.after.change', { lstate: 'green' } ]
    [ 'lamp.after.change', { lstate: 'dark' } ]
    [ 'alpha_btn.after.change', { lstate: 'released', color: { lstate: 'green' }, lamp: { lstate: 'dark' } } ]
    [ 'lamp.after.change', { lstate: 'lit' } ]
    [ 'alpha_btn.after.change', { lstate: 'pressed', color: { lstate: 'green' }, lamp: { lstate: 'lit' } } ]
    [ 'color.after.change', { lstate: 'red' } ]
    [ 'lamp.after.change', { lstate: 'dark' } ]
    [ 'alpha_btn.after.change', { lstate: 'released', color: { lstate: 'red' }, lamp: { lstate: 'dark' } } ] ]
  #---------------------------------------------------------------------------------------------------------
  done()


############################################################################################################
if module is require.main then do =>
  # @demo_2()
  # @toolbox_demo()
  # test @
  # test @[ "Intermatic observables during moves 1" ]
  # test @[ "Intermatic catchalls 1" ]
  # test @[ "Intermatic cyclers 1" ]
  # test @[ "Intermatic goto 1" ]
  # test @[ "Intermatic cancel moves" ]
  # test @[ "Intermatic history" ]
  # test @[ "Intermatic data attribute 1" ]
  # @[ "Intermatic data attribute 1" ]()
  # test @[ "Intermatic attribute freezing" ]
  # test @[ "Intermatic toolbox" ]
  # test @[ "Intermatic tryto 1" ]
  # test @[ "Intermatic tryto 2" ]
  # test @[ "Intermatic cFsm 1" ]
  test @[ "Intermatic cFsm 2" ]
  # test @[ "Intermatic cFsm" ]
  # test @[ "Intermatic empty FSM" ]
  # test @[ "Intermatic before.start(), after.start()" ]
  # @[ "Intermatic empty FSM" ]()



