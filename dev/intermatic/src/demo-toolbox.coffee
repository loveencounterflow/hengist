
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
{ Intermatic, }           = require '../../../apps/intermatic'
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
    moves:
      start:    'released'
      stop:     [ 'any',      'void',       ]
      press:    [ 'released', 'pressed',    ]
      release:  [ 'pressed',  'released',   ]
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
    moves:
      [ 'void',   'start',    null,   ]
      [ 'any',      'stop',     'void', ] ]
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
    moves:
      [ 'void',   'start',    null,   ]
      [ 'any',      'stop',     'void', ] ]
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
    moves:
      [ 'void', 'start',    'dark', ]
      [ 'any',    'stop',     'void', ]
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
    goto: 'any'
    enter:
      pressed:  ( P... ) ->
        echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '🔒'
        # @up.meta_btn.lamp.tryto.turn_on()
      released: ( P... ) ->
        echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '🔓💡🔅🔆❌⏻⏼⏽✓✅⤴⤵⏺'

  #---------------------------------------------------------------------------------------------------------
  meta_btn = new_button_fsmd
    goto: 'any'
    enter:
      pressed: ( P... ) ->
        register '<fsm.meta_btn.enter.pressed'
        @color.tryto.toggle()
        @text.tryto.toggle()
    click: ->
      @press()
      @release()
    #.......................................................................................................
    fsms:
      #.....................................................................................................
      color: new_color_fsmd
        goto: 'any'
        colors: [ 'red', 'green', ]
      #.....................................................................................................
      text: new_text_fsmd
        goto: 'any'
        texts: [ 'wait', 'go', ]
      #.....................................................................................................
      lamp: new_lamp_fsmd
        goto: 'any'

  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'toolbox'
    moves:
      [ 'void',     'start',  'running', ]
      [ 'running',  'stop',   'stopped', ]
      ]
    before:
      start: ( P... ) ->
        @fsms.forEach ( sub_fsm ) -> sub_fsm.start()
      stop: ( P... ) ->
        @fsms.forEach ( sub_fsm ) -> sub_fsm.stop()
    # after:
    #   start: ( P... ) ->
    #   stop: ( P... ) ->
    fsms: { meta_btn, main_btn, }

  #---------------------------------------------------------------------------------------------------------
  return new Intermatic fsmd

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  fsm       = new_toolbox_fsm()
  recorder  = new Recorder fsm
  # echo '^33376^', ( require 'util' ).inspect fsm
  urge '^3334^', "FSM #{rpr fsm.meta_btn.name} has sub-FSMs #{( rpr n for n in fsm.meta_btn.fsm_names ).join ', '}"
  info 'fsm.start()';                   fsm.start()
  info 'fsm.main_btn.goto.released()';  fsm.main_btn.goto.released()
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

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  fsmd =
    name: 'simple'
    moves:
      [ 'void', 'start', 'first' ] ]
    cyclers:
      step: [ 'first', 'second', 'third', ]
    before:
      any:    ( P... ) -> urge "█ #{@path}:#{@.verb}"
      start:  ( P... ) -> @lamp.start()
    after:
      any: ( P... ) -> whisper @cstate
    enter:
      second: ( P... ) -> @lamp.toggle()
    fsms:
      #.....................................................................................................
      lamp:
        moves:
          [ 'void', 'start', 'on' ] ]
        cyclers:
          toggle: [ 'on', 'off', ]
        enter:
          on:     ( P... ) -> @counter.tick() ### TAINT totally contrived ###
        before:
          start:  ( P... ) -> @counter.start()
          any:    ( P... ) -> urge "#{@path}:#{@verb}"
        #...................................................................................................
        fsms:
          counter:
            data:
              _XXX_count: 0
            moves:
              [ 'void', 'start', 'active' ] ]
            cyclers:
              tick: [ 'active', ]
            stay:
              active: ( P... ) ->
                # debug '^33387^', @
                @data._XXX_count++
  #.........................................................................................................
  fsm       = new Intermatic fsmd
  recorder  = new Recorder fsm
  fsm.start()
  fsm.step()
  fsm.step()
  fsm.step()
  fsm.step()
  fsm.step()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_3 = ->
  #---------------------------------------------------------------------------------------------------------
  fsmd =

    #=======================================================================================================
    # ACTUATABLE BUTTONS
    #-------------------------------------------------------------------------------------------------------
    grabmode_btn:
      init: 'markscroll'
      transitions: [
        { name: 'toggle',   from: 'panzoom',    to: 'markscroll', }
        { name: 'toggle',   from: 'markscroll', to: 'panzoom',    } ]
      methods:
        onEnterMarkscroll:  ->
          mkts._panzoom_instance?.pause?()
          @scrldir_lamp.goto 'lit'
        onEnterPanzoom:     ->
          mkts._panzoom_instance?.resume?()
          @scrldir_lamp.goto 'dark'
    #.......................................................................................................
    grabmode_lamp:
      init: 'lit'

    #-------------------------------------------------------------------------------------------------------
    scrldir_btn:
      init: 'vert'
      transitions: [
        { name: 'toggle',   from: 'vert',     to: 'horz', }
        { name: 'toggle',   from: 'horz',     to: 'vert', } ]
      methods:
        onEnterVert:        -> log '^334-5^', 'scrldir_btn: onEnterVert'; @grabmode_btn.goto 'markscroll'
        onEnterHorz:        -> log '^334-6^', 'scrldir_btn: onEnterHorz'; @grabmode_btn.goto 'markscroll'
    #.......................................................................................................
    scrldir_lamp:
      init: 'lit'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]
      methods:
        onEnterLit:         -> log '^334-8^', 'scrldir_lamp: onEnterLit'
        onEnterDark:        -> log '^334-9^', 'scrldir_lamp: onEnterDark'

    #=======================================================================================================
    # PASSIVE BUTTONS (i.e. lamps only); observe their descriptions could be much simpler
    #-------------------------------------------------------------------------------------------------------
    shift_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @shift_lamp.goto 'dark'
        onEnterPressed:   -> @shift_lamp.goto 'lit'
    #.......................................................................................................
    shift_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]

    #-------------------------------------------------------------------------------------------------------
    capslock_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @capslock_lamp.goto 'dark'
        onEnterPressed:   -> @capslock_lamp.goto 'lit'
    #.......................................................................................................
    capslock_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]

    #-------------------------------------------------------------------------------------------------------
    alt_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @alt_lamp.goto 'dark'
        onEnterPressed:   -> @alt_lamp.goto 'lit'
    #.......................................................................................................
    alt_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]

    #-------------------------------------------------------------------------------------------------------
    altgraph_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @altgraph_lamp.goto 'dark'
        onEnterPressed:   -> _XXX_TMP_toolbox_colors.altgraph_btn = 'red'; @altgraph_lamp.goto 'lit'
                         ### !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ###
    #.......................................................................................................
    altgraph_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]

    #-------------------------------------------------------------------------------------------------------
    control_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @control_lamp.goto 'dark'
        onEnterPressed:   -> @control_lamp.goto 'lit'
    #.......................................................................................................
    control_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]

    #-------------------------------------------------------------------------------------------------------
    meta_btn:
      init: 'released'
      transitions: [
        { name: 'toggle', from: 'released', to: 'pressed',  }
        { name: 'toggle', from: 'pressed',  to: 'released', } ]
      methods:
        onEnterReleased:  -> @meta_lamp.goto 'dark'
        onEnterPressed:   -> @meta_lamp.goto 'lit'
    #.......................................................................................................
    meta_lamp:
      init: 'dark'
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', }
        { name: 'toggle',   from: 'dark',   to: 'lit',  } ]




############################################################################################################
if module is require.main then do =>
  # await demo()
  await demo_2()




