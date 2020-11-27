
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
  register  = ( x ) ->
    whisper '^2321^', rpr x
    result.push x
  return { result, register, }

#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic empty FSM" ] = ( T, done ) ->
  Intermatic      = require '../../../apps/intermatic'
  fsm             = new Intermatic {}
  T.eq fsm.triggers, { start: { void: 'void' } }
  T.eq fsm.start(), null
  T.eq fsm.state,   'void'
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
  fsm = new Intermatic fsmd
  T.eq fsm.start(), null
  T.eq fsm.state,   'void'
  T.eq result,      [ 'before start', 'after start' ]
  #---------------------------------------------------------------------------------------------------------
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "Intermatic basics" ] = ( T, done ) ->
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
  fsm             = new Intermatic fsmd
  fsm.start()
  fsm.toggle()
  fsm.reset()
  fsm.toggle()
  # fsm.goto 'lit'
  # fsm.goto 'lit'
  # fsm.goto 'dark'
  echo result
  T.eq result, [
    "after change:  { '$key': '^trigger', from: 'void', via: 'start', to: 'lit', changed: true }"
    "leave lit      { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "enter dark:    { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "after change:  { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "after change:  { '$key': '^trigger', from: 'dark', via: 'reset', to: 'void', changed: true }"
    "failed: { '$key': '^trigger', failed: true, from: 'void', via: 'toggle' }"
    ]
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
      change:     ( s ) -> register "after change:  #{rpr s}"
    enter:
      dark:       ( s ) -> register "enter dark:    #{rpr s}"
    leave:
      lit:        ( s ) -> register "leave lit      #{rpr s}"
    goto:         '*'
    fail:         ( s ) -> register "failed: #{rpr s}"
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  fsm             = new Intermatic fsmd
  T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'triggers', '_state', 'before', 'enter', 'stay', 'leave',
    'after', 'my', 'our', 'starts_with', 'start', 'toggle', 'reset', 'goto' ]
  fsm.start()
  fsm.toggle()
  fsm.reset()
  fsm.toggle()
  fsm.goto 'lit'
  fsm.goto 'lit'
  fsm.goto 'dark'
  echo result
  T.eq result, [
    "after change:  { '$key': '^trigger', from: 'void', via: 'start', to: 'lit', changed: true }"
    "leave lit      { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "enter dark:    { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "after change:  { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }"
    "after change:  { '$key': '^trigger', from: 'dark', via: 'reset', to: 'void', changed: true }"
    "failed: { '$key': '^trigger', failed: true, from: 'void', via: 'toggle' }"
    "after change:  { '$key': '^trigger', from: 'void', via: 'goto', to: 'lit', changed: true }"
    "leave lit      { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }"
    "enter dark:    { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }"
    "after change:  { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }" ]
  #---------------------------------------------------------------------------------------------------------
  done()


#-----------------------------------------------------------------------------------------------------------
@[ "_________________________ Intermatic cFsm" ] = ( T, done ) ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    #.......................................................................................................
    meta_btn:
      triggers: [
        [ 'void',     'start',    'released',   ]
        [ '*',        'reset',    'void',       ]
        [ 'released', 'press',    'pressed',    ]
        [ 'pressed',  'release',  'released',   ] ]
      enter:
        'pressed':  ( s ) -> @fsms.meta_lamp.light()
        'released': ( s ) -> @fsms.meta_lamp.goto 'dark'
    #.......................................................................................................
    my:
      #.....................................................................................................
      lamp:
        triggers: [
          [ 'void',   'start',  'lit',  ]
          [ 'lit',    'toggle', 'dark', ]
          [ 'dark',   'toggle', 'lit',  ] ]
        after:
          change:     ( s ) -> register "after change:  #{rpr s}"
        enter:
          dark:       ( s ) -> register "enter dark:    #{rpr s}"
          lit:        ( s ) -> register "enter lit:     #{rpr s}"
        goto:         '*'
    #.......................................................................................................
    after:
      change: ( s ) -> register "ima.change"
  #---------------------------------------------------------------------------------------------------------
  { result
    register }    = new_register()
  Intermatic      = require '../../../apps/intermatic'
  button_fsm      = new Intermatic { meta_btn: fsmd.meta_btn, }
  button_fsm.start()
  #---------------------------------------------------------------------------------------------------------
  done()

############################################################################################################
if module is require.main then do =>
  # @demo_2()
  # @toolbox_demo()
  test @
  # test @[ "Intermatic cFsm" ]
  # test @[ "Intermatic empty FSM" ]
  # test @[ "Intermatic before.start(), after.start()" ]
  # @[ "Intermatic empty FSM" ]()



