
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
  type_of }               = types.export()
{ freeze
  lets }                  = require 'letsfreezethat'


#-----------------------------------------------------------------------------------------------------------
# declare

#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
new_register = ->
  result    = []
  register  = ( P... ) ->
    x = if P.length is 1 then P[ 0 ] else P
    whisper '^2321^', rpr x
    result.push x
  return { result, register, }

#===========================================================================================================
# TESTS
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
      start: ( s ) -> register "before start"
    after:
      start: ( s ) -> register "after start"
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
      change:     ( s ) -> register "after change:  #{rpr s}"
    enter:
      dark:       ( s ) -> register "enter dark:    #{rpr s}"
    leave:
      lit:        ( s ) -> register "leave lit      #{rpr s}"
    fail:         ( s ) -> register "failed: #{rpr s}"
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
    "after change:  { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'lit', changed: true }",
    "leave lit      { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }",
    "enter dark:    { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }",
    "after change:  { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true }",
    "after change:  { '$key': '^trigger', id: 't3', from: 'dark', via: 'reset', to: 'void', changed: true }",
    "failed: { '$key': '^trigger', id: 't4', failed: true, from: 'void', via: 'toggle' }" ]
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
    after:
      change:     ( s ) -> register 'after change',  s
    enter:
      dark:       ( s ) -> register 'enter dark',    s
    leave:
      lit:        ( s ) -> register 'leave lit',     s
    goto:         '*'
    fail:         ( s ) -> register 'failed',        s
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  # T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'triggers', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'enter', 'stay', 'leave', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
  fsm.start()
  fsm.toggle()
  fsm.reset()
  fsm.toggle()
  fsm.goto 'lit'
  fsm.goto.lit()
  fsm.goto 'dark'
  echo result
  T.eq result, [
    [ 'after change', { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'lit', changed: true } ],
    [ 'leave lit', { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true } ],
    [ 'enter dark', { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true } ],
    [ 'after change', { '$key': '^trigger', id: 't2', from: 'lit', via: 'toggle', to: 'dark', changed: true } ],
    [ 'after change', { '$key': '^trigger', id: 't3', from: 'dark', via: 'reset', to: 'void', changed: true } ],
    [ 'failed', { '$key': '^trigger', id: 't4', failed: true, from: 'void', via: 'toggle' } ],
    [ 'after change', { '$key': '^trigger', id: 't5', from: 'void', via: 'goto', to: 'lit', changed: true } ],
    [ 'leave lit', { '$key': '^trigger', id: 't6', from: 'lit', via: 'goto', to: 'dark', changed: true } ],
    [ 'enter dark', { '$key': '^trigger', id: 't6', from: 'lit', via: 'goto', to: 'dark', changed: true } ],
    [ 'after change', { '$key': '^trigger', id: 't6', from: 'lit', via: 'goto', to: 'dark', changed: true } ] ]
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
      change:     ( s ) -> register s
    fail:         ( s ) -> register s
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  fsm.start()
  fsm.toggle()
  fsm.toggle()
  fsm.step()
  fsm.goto 'doe'
  fsm.step()
  fsm.step()
  fsm.step()
  fsm.step()
  fsm.step()
  echo result
  T.eq result, [
    { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'off', changed: true },
    { '$key': '^trigger', id: 't2', from: 'off', via: 'toggle', to: 'on', changed: true },
    { '$key': '^trigger', id: 't3', from: 'on', via: 'toggle', to: 'off', changed: true },
    { '$key': '^trigger', id: 't4', failed: true, from: 'off', via: 'step' },
    { '$key': '^trigger', id: 't5', from: 'off', via: 'goto', to: 'doe', changed: true },
    { '$key': '^trigger', id: 't6', from: 'doe', via: 'step', to: 'bar', changed: true },
    { '$key': '^trigger', id: 't7', from: 'bar', via: 'step', to: 'baz', changed: true },
    { '$key': '^trigger', id: 't8', from: 'baz', via: 'step', to: 'gnu', changed: true },
    { '$key': '^trigger', id: 't9', from: 'gnu', via: 'step', to: 'doe', changed: true },
    { '$key': '^trigger', id: 't10', from: 'doe', via: 'step', to: 'bar', changed: true } ]
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
    before: any: ( s ) -> register 'before any',  fsm.lstate, s
    enter:  any: ( s ) -> register 'enter any',   fsm.lstate, s
    stay:   any: ( s ) -> register 'stay any',    fsm.lstate, s
    leave:  any: ( s ) -> register 'leave any',   fsm.lstate, s
    after:  any: ( s ) -> register 'after any',   fsm.lstate, s
    fail:        ( s ) -> register 'fail',        fsm.lstate, s
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  info "fsm.start()     ———"; fsm.start()
  info "fsm.step()      ———"; fsm.step()
  info "fsm.goto.#{fsm.lstate}()  ———"; fsm.goto fsm.lstate
  echo result
  T.eq result, [
    [ 'before any', 'void', { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'bar', changed: true } ],
    [ 'leave any', 'void', { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'bar', changed: true } ],
    [ 'enter any', 'bar', { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'bar', changed: true } ],
    [ 'after any', 'bar', { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'bar', changed: true } ],
    [ 'before any', 'bar', { '$key': '^trigger', id: 't2', from: 'bar', via: 'step', to: 'baz', changed: true } ],
    [ 'leave any', 'bar', { '$key': '^trigger', id: 't2', from: 'bar', via: 'step', to: 'baz', changed: true } ],
    [ 'enter any', 'baz', { '$key': '^trigger', id: 't2', from: 'bar', via: 'step', to: 'baz', changed: true } ],
    [ 'after any', 'baz', { '$key': '^trigger', id: 't2', from: 'bar', via: 'step', to: 'baz', changed: true } ],
    [ 'before any', 'baz', { '$key': '^trigger', id: 't3', from: 'baz', via: 'goto', to: 'baz', changed: false } ],
    [ 'stay any', 'baz', { '$key': '^trigger', id: 't3', from: 'baz', via: 'goto', to: 'baz', changed: false } ],
    [ 'after any', 'baz', { '$key': '^trigger', id: 't3', from: 'baz', via: 'goto', to: 'baz', changed: false } ] ]
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
      change:     ( s ) -> register s
    fail:         ( s ) -> register s
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  fsm.start()
  T.eq true,  fsm.can.toggle()
  T.eq true,  fsm.tryto.toggle()
  T.eq false, fsm.can   'toggle'
  T.eq false, fsm.tryto 'toggle'
  T.throws /unknown trigger "nonexisting_trigger"/, -> fsm.can 'nonexisting_trigger'
  echo result
  T.eq result, [
    { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'off', changed: true },
    { '$key': '^trigger', id: 't2', from: 'off', via: 'toggle', to: 'on', changed: true } ]
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
      change:     ( s ) -> register s
      # step:       ( s ) -> @step()
    fail:         ( s ) -> register s
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  Intermatic._tid = 0
  fsm             = new Intermatic fsmd
  info 'fsm.start()       ------------'; info CND.truth fsm.start()
  info 'fsm.step()        ------------'; info CND.truth fsm.step()
  info 'fsm.tryto.step()  ------------'; info CND.truth fsm.tryto.step()
  info 'fsm.step()        ------------'; info CND.truth fsm.step()
  info 'fsm.tryto.step()  ------------'; info CND.truth fsm.tryto.step()
  info 'fsm.tryto.start() ------------'; info CND.truth fsm.tryto.start()
  echo result
  T.eq result, [
    { '$key': '^trigger', id: 't1', from: 'void', via: 'start', to: 'one', changed: true },
    { '$key': '^trigger', id: 't2', from: 'one', via: 'step', to: 'two', changed: true },
    { '$key': '^trigger', id: 't3', from: 'two', via: 'step', to: 'three', changed: true },
    { '$key': '^trigger', id: 't4', from: 'three', via: 'step', to: 'one', changed: true },
    { '$key': '^trigger', id: 't5', from: 'one', via: 'step', to: 'two', changed: true },
    { '$key': '^trigger', id: 't6', from: 'two', via: 'step', to: 'three', changed: true } ]
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
      pressed:  ( s ) -> @lamp.goto 'lit';   register "button: enter pressed: #{srpr s}"
      released: ( s ) -> @lamp.goto 'dark';  register "button: enter released: #{srpr s}"
    stay:
      pressed:  ( s ) -> register "button: stay pressed: #{srpr s}"
      released: ( s ) -> register "button: stay released: #{srpr s}"
    after:
      start: ( s ) -> @lamp.start()
    before:
      trigger: ( s ) -> register "button: before *: #{srpr s}"
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
          change:     ( s ) -> register "lamp: after change:  #{srpr s}"
        enter:
          dark:       ( s ) -> @up.goto 'released';  register "lamp: enter dark: #{srpr s}"
          lit:        ( s ) -> @up.goto 'pressed';   register "lamp: enter lit: #{srpr s}"
        stay:
          dark:       ( s ) -> register "lamp: stay dark: #{srpr s}"
          lit:        ( s ) -> register "lamp: stay lit: #{srpr s}"
        before:
          trigger: ( s ) -> register "lamp: before *: #{srpr s}"
        goto: '*'
        bar:  108
    #.......................................................................................................
    after:
      change: ( s ) -> register "root_fsm.change"
    foo: 42
  #---------------------------------------------------------------------------------------------------------
  srpr            = ( s ) -> "#{s.from}--#{s.via}->#{s.to}"
  { result
    register }    = new_register()
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
  T.eq result, [
    'button: stay released: released--goto->released',
    'lamp: enter dark: void--goto->dark',
    'lamp: after change:  void--goto->dark',
    'button: enter released: void--start->released',
    'root_fsm.change',
    'button: stay pressed: pressed--goto->pressed',
    'lamp: enter lit: dark--goto->lit',
    'lamp: after change:  dark--goto->lit',
    'button: enter pressed: released--press->pressed',
    'root_fsm.change' ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic cFsm 2" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    fsms:
      alpha_btn:
        #.......................................................................................................
        triggers: [
          [ 'void',     'start',    'released',   ]
          [ '*',        'reset',    'void',       ]
          [ 'released', 'press',    'pressed',    ]
          [ 'pressed',  'release',  'released',   ] ]
        # enter:
        #   pressed:  ( s ) ->
        #   released: ( s ) ->
        before:
          start:    ( s ) -> @lamp.start()
        after:
          change:   ( s ) ->
            @lamp.toggle()
            register { from: s.from, via: s.via, alpha_btn: @lstate, lamp: @lamp.lstate, color: @color.lstate, }
        #.......................................................................................................
        fsms:
          #.....................................................................................................
          color:
            triggers: [
              [ 'red', 'toggle', 'green', ]
              [ 'green', 'toggle', 'red', ] ]
            after:
              change:   ( s ) -> register { from: s.from, via: s.via, alpha_btn_color: @lstate, }
          #.....................................................................................................
          lamp:
            triggers: [
              [ 'void',   'start',  'lit',  ]
              [ 'lit',    'toggle', 'dark', ]
              [ 'dark',   'toggle', 'lit',  ] ]
            before:
              start:    ( s ) -> @up.color.start()
            enter:
              dark:     ( s ) -> @up.color.toggle()
            after:
              change:   ( s ) -> register { from: s.from, via: s.via, alpha_btn_lamp: @lstate, }
  #---------------------------------------------------------------------------------------------------------
  srpr            = ( s ) -> "#{s.from}--#{s.via}->#{s.to}"
  { result
    register }    = new_register()
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
  # debug result
  T.eq result, [
    { from: 'void', via: 'start', alpha_btn_color: 'green' }
    { from: 'void', via: 'start', alpha_btn_lamp: 'lit' }
    { from: 'green', via: 'toggle', alpha_btn_color: 'red' }
    { from: 'lit', via: 'toggle', alpha_btn_lamp: 'dark' }
    { from: 'void', via: 'start', alpha_btn: 'released', lamp: 'dark', color: 'red' }
    { from: 'dark', via: 'toggle', alpha_btn_lamp: 'lit' }
    { from: 'released', via: 'press', alpha_btn: 'pressed', lamp: 'lit', color: 'red' }
    { from: 'red', via: 'toggle', alpha_btn_color: 'green' }
    { from: 'lit', via: 'toggle', alpha_btn_lamp: 'dark' }
    { from: 'pressed', via: 'release', alpha_btn: 'released', lamp: 'dark', color: 'green' }
    { from: 'dark', via: 'toggle', alpha_btn_lamp: 'lit' }
    { from: 'released', via: 'press', alpha_btn: 'pressed', lamp: 'lit', color: 'green' }
    { from: 'green', via: 'toggle', alpha_btn_color: 'red' }
    { from: 'lit', via: 'toggle', alpha_btn_lamp: 'dark' }
    { from: 'pressed', via: 'release', alpha_btn: 'released', lamp: 'dark', color: 'red' } ]
  #---------------------------------------------------------------------------------------------------------
  done()


############################################################################################################
if module is require.main then do =>
  # @demo_2()
  # @toolbox_demo()
  test @
  # test @[ "Intermatic catchalls 1" ]
  # test @[ "Intermatic toolbox" ]
  # test @[ "Intermatic tryto 1" ]
  # test @[ "Intermatic tryto 2" ]
  # test @[ "Intermatic cyclers 1" ]
  # test @[ "Intermatic cFsm 1" ]
  # test @[ "Intermatic cFsm" ]
  # test @[ "Intermatic empty FSM" ]
  # test @[ "Intermatic before.start(), after.start()" ]
  # @[ "Intermatic empty FSM" ]()



