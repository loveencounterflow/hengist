
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
Intermatic                = require '../../../apps/intermatic'
Recorder                  = require './recorder'


#===========================================================================================================
# TYPES
#-----------------------------------------------------------------------------------------------------------
declare 'toolbox_button_cfg', tests:
  "x is an object": ( x ) -> @isa.object x


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

#-----------------------------------------------------------------------------------------------------------
pluck = ( d, name ) -> R = d[ name ]; delete d[ name ]; return R


#===========================================================================================================
# FACTORIES
#-----------------------------------------------------------------------------------------------------------
new_button_fsmd = ( cfg ) ->
  # validate.toolbox_button_cfg cfg
  #.........................................................................................................
  cfg      ?= {}
  defaults  =
    triggers: [
      [ 'void',     'start',    'released',   ]
      [ '*',        'stop',     'void',       ]
      [ 'released', 'press',    'pressed',    ]
      [ 'pressed',  'release',  'released',   ] ]
    cyclers:
      toggle: [ 'released', 'pressed', ]
  #.........................................................................................................
  R = { defaults..., cfg..., }
  R.triggers = [ cfg.triggers..., R.triggers..., ] if cfg.triggers?
  return R

#-----------------------------------------------------------------------------------------------------------
new_color_fsmd = ( cfg ) ->
  # validate.toolbox_button_cfg cfg
  #.........................................................................................................
  cfg      ?= {}
  defaults  =
    triggers: [
      [ 'void',   'start',    null,   ]
      [ '*',      'stop',     'void', ] ]
  #.........................................................................................................
  R                           = { defaults..., cfg..., }
  colors                      = pluck R, 'colors'
  R.triggers[ 0 ][ 2 ]        = colors[ 0 ]
  ( R.cyclers ?= {} ).toggle  = colors
  R.triggers                  = [ cfg.triggers..., R.triggers..., ] if cfg.triggers?
  return R

#-----------------------------------------------------------------------------------------------------------
new_text_fsmd = ( cfg ) ->
  # validate.toolbox_button_cfg cfg
  #.........................................................................................................
  cfg      ?= {}
  defaults  =
    triggers: [
      [ 'void',   'start',    null,   ]
      [ '*',      'stop',     'void', ] ]
  #.........................................................................................................
  R                           = { defaults..., cfg..., }
  texts                       = pluck R, 'texts'
  R.triggers[ 0 ][ 2 ]        = texts[ 0 ]
  ( R.cyclers ?= {} ).toggle  = texts
  R.triggers                  = [ cfg.triggers..., R.triggers..., ] if cfg.triggers?
  return R

#-----------------------------------------------------------------------------------------------------------
new_lamp_fsmd = ( cfg ) ->
  # validate.toolbox_button_cfg cfg
  #.........................................................................................................
  cfg      ?= {}
  defaults  =
    triggers: [
      [ 'void', 'start',    'dark', ]
      [ '*',    'stop',     'void', ]
      [ 'dark', 'turn_on',  'lit',  ]
      [ 'lit',  'turn_off', 'dark', ]
      ]
    cyclers:
      toggle: [ 'dark', 'lit', ]
  R           = { defaults..., cfg..., }
  R.triggers  = [ cfg.triggers..., R.triggers..., ] if cfg.triggers?
  return R

#-----------------------------------------------------------------------------------------------------------
new_toolbox_fsm = ->
  { result
    register }    = new_register()
  #---------------------------------------------------------------------------------------------------------
  main_btn = new_button_fsmd
    enter:
      pressed:  ( s ) ->
        echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '🔒'
        @up.meta_btn.lamp.tryto.turn_on()
      released: ( s ) ->
        echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '🔓💡🔅🔆❌⏻⏼⏽✓✅⤴⤵⏺'
        @up.meta_btn.lamp.tryto.turn_off()
    before:
      change: ( s ) -> register '<fsm.main_btn.before.change', s
    after:
      change: ( s ) -> register '>fsm.main_btn.after.change', s

  #---------------------------------------------------------------------------------------------------------
  meta_btn = new_button_fsmd
    enter:
      pressed: ( s ) ->
        register '<fsm.meta_btn.enter.pressed', s
        debug '^333443^', @color.can.toggle(), @text.can.toggle()
        @color.tryto.toggle()
        @text.tryto.toggle()
    before:
      change: ( s ) ->
        echo "#{@up.name}.#{@name}:#{@lstate}", CND.white CND.reverse "[#{@lstate}]"
        register '<fsm.meta_btn.before.change', s
      start: ( s ) ->
        register '<fsm.meta_btn.before.start', s
        @fsms.forEach ( sub_fsm ) -> sub_fsm.start()
      stop: ( s ) ->
        register '<fsm.meta_btn.before.stop', s
        @fsms.forEach ( sub_fsm ) -> sub_fsm.stop()
    after:
      change: ( s ) -> register '>fsm.meta_btn.after.change', s
      start:  ( s ) -> register '>fsm.meta_btn.after.start', s
      stop:   ( s ) -> register '>fsm.meta_btn.after.stop', s
    click: ->
      @press()
      @release()
    #.......................................................................................................
    fsms:
      #.....................................................................................................
      color: new_color_fsmd
        colors: [ 'red', 'green', ]
        before:
          change: ( s ) ->
            register '<fsm.meta_btn.color.before.change', s
            echo "#{@up.name}.#{@name}:#{@lstate}", ( CND[ @lstate ] ? CND.grey )  '██'
        after:
          change: ( s ) -> register '>fsm.meta_btn.color.after.change', s
        goto: '*'
      #.....................................................................................................
      text: new_text_fsmd
        texts: [ 'wait', 'go', ]
        before:
          change: ( s ) ->
            register '<fsm.meta_btn.text.before.change', s
            echo "#{@up.name}.#{@name}:#{@lstate}", CND.white CND.reverse "[#{@lstate}]"
        after:
          change: ( s ) -> register '>fsm.meta_btn.text.after.change', s
        goto: '*'
      #.....................................................................................................
      lamp: new_lamp_fsmd
        enter:
          lit:    ( s ) -> echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '██'
          dark:   ( s ) -> echo "#{@up.name}.#{@name}:#{@lstate}", CND.grey    '██'
        before:
          change: ( s ) -> register '<fsm.meta_btn.lamp.before.change', s
        after:
          change: ( s ) -> register '>fsm.meta_btn.lamp.after.change', s
        goto: '*'

  #---------------------------------------------------------------------------------------------------------
  fsmd =
    triggers: [
      [ 'void',     'start',  'running', ]
      [ 'running',  'stop',   'stopped', ]
      ]
    before:
      start: ( s ) ->
        register '<fsm.before.start', s
        @fsms.forEach ( sub_fsm ) -> sub_fsm.start()
      stop: ( s ) ->
        register '<fsm.before.stop', s
        @fsms.forEach ( sub_fsm ) -> sub_fsm.stop()
    after:
      start: ( s ) ->
        register '>fsm.after.start', s
      stop: ( s ) ->
        register '>fsm.after.stop', s
    fsms: { meta_btn, main_btn, }

  #---------------------------------------------------------------------------------------------------------
  return new Intermatic fsmd

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo = ->
  fsm       = new_toolbox_fsm()
  recorder  = new Recorder fsm
  # echo '^33376^', ( require 'util' ).inspect fsm
  urge '^3334^', "FSM #{rpr fsm.meta_btn.name} has sub-FSMs #{( rpr n for n in fsm.meta_btn.fsm_names ).join ', '}"
  info 'fsm.start()             ------'; fsm.start()
  # info 'fsm.meta_btn.press()    ------'; fsm.meta_btn.press()
  # info 'fsm.meta_btn.release()  ------'; fsm.meta_btn.release()
  # info 'fsm.meta_btn.click()    ------'; fsm.meta_btn.click()
  # info 'fsm.meta_btn.click()    ------'; fsm.meta_btn.click()
  # # fsm.meta_btn.goto.void()
  # info 'fsm.main_btn.press()    ------'; fsm.main_btn.press()
  # info 'fsm.main_btn.release()  ------'; fsm.main_btn.release()
  # info 'fsm.stop()              ------'; fsm.stop()
  # info '^33378^', fsm.fsm_names
  # info '^33378^', fsm.meta_btn.fsm_names
  # fsm.fsms.forEach ( sub_fsm ) -> debug '^2327^', sub_fsm
  #---------------------------------------------------------------------------------------------------------
  return null


############################################################################################################
if module is require.main then do =>
  await demo()
