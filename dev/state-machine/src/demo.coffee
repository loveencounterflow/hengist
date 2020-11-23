
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/STATE-ENGINE'
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

###
Mutimix                   = require 'multimix'

#===========================================================================================================
class Fsm extends Multimix
  constructor: ( fsmd ) ->
    # validate.fsmd fsmd

#===========================================================================================================
class Compound_fsm extends Multimix
  constructor: ( fsmds ) ->
    # validate.fsmds fsmds
###



#-----------------------------------------------------------------------------------------------------------
@demo_1 = ->
  ui_fsm = new Ui_scrollmode()
  info '^445-1^', ui_fsm.get_state()
  info '^445-2^', ui_fsm.mousemode.setPanzoom()
  info '^445-3^', ui_fsm.mousemode.setPanzoom()
  info '^445-4^', ui_fsm.get_state()
  info '^445-5^', ui_fsm.mousemode.toggle()
  info '^445-6^', ui_fsm.get_state()
  info '^445-7^', ui_fsm.mousemode.toggle()
  info '^445-8^', ui_fsm.get_state()
  info '^445-9^', ui_fsm.scrl_dir.setHorz()
  info '^445-11^', ui_fsm.get_state()
  info '^445-12^', ui_fsm.scrl_dir.toggle()
  info '^445-13^', ui_fsm.get_state()
  info '^445-14^', ui_fsm.scrl_dir.toggle()
  info '^445-15^', ui_fsm.get_state()
  info '^445-14^', ui_fsm.scrl_dir.toggle()
  info '^445-15^', ui_fsm.get_state()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
get_fsm_descriptions = ->
  #---------------------------------------------------------------------------------------------------------
  fsm_descriptions =
    #-------------------------------------------------------------------------------------------------------
    grabmode_btn:
      init: 'markscroll',
      transitions: [
        { name: 'toggle',   from: 'panzoom',    to: 'markscroll', },
        { name: 'toggle',   from: 'markscroll', to: 'panzoom', },
        ],
      methods:
        onAfterTransition:  -> log '^334-1^', 'grabmode_btn:', @get_state()
        onEnterPanzoom:     -> log '^334-2^', 'grabmode_btn: onEnterPanzoom';    @scrldir_lamp.goto 'dark'
        onEnterMarkscroll:  -> log '^334-3^', 'grabmode_btn: onEnterMarkscroll'; @scrldir_lamp.goto 'lit'

    #-------------------------------------------------------------------------------------------------------
    scrldir_btn:
      init: 'vert',
      transitions: [
        { name: 'toggle',   from: 'vert',     to: 'horz', },
        { name: 'toggle',   from: 'horz',     to: 'vert', },
        ],
      methods:
        onAfterTransition:  -> log '^334-4^', 'scrldir_btn:', @get_state()
        onEnterVert:        -> log '^334-5^', 'scrldir_btn: onEnterVert'; @grabmode_btn.goto 'markscroll'
        onEnterHorz:        -> log '^334-6^', 'scrldir_btn: onEnterHorz'; @grabmode_btn.goto 'markscroll'

    #-------------------------------------------------------------------------------------------------------
    scrldir_lamp:
      init: 'lit',
      transitions: [
        { name: 'toggle',   from: 'lit',    to: 'dark', },
        { name: 'toggle',   from: 'dark',   to: 'lit',  },
        ],
      methods:
        onAfterTransition:  -> log '^334-7^', 'scrldir_lamp:', @get_state()
        onEnterLit:         -> log '^334-8^', 'scrldir_lamp: onEnterLit'
        onEnterDark:        -> log '^334-9^', 'scrldir_lamp: onEnterDark'
  #---------------------------------------------------------------------------------------------------------
  return fsm_descriptions

#-----------------------------------------------------------------------------------------------------------
@demo_2 = ->
  #.........................................................................................................
  global.StateMachine = require 'javascript-state-machine'
  require '../../../apps/mkts-gui-toolbox-fsm' ### NOTE exports to global namespace FTTB ###
  do =>
    #-------------------------------------------------------------------------------------------------------
    class My_toolbox extends Mkts_toolbox_fsm
      on_after_transition: ( lifecycle ) =>
        delete lifecycle.fsm
        debug '^34476^', lifecycle
    #-------------------------------------------------------------------------------------------------------
    fsm = new My_toolbox get_fsm_descriptions()
    help fsm.get_state()
    show_abilities = ->
      help "fsm.grabmode_btn.can  'init':          ", fsm.grabmode_btn.can  'init'
      help "fsm.scrldir_btn.can   'init':          ", fsm.scrldir_btn.can   'init'
      help "fsm.scrldir_lamp.can  'init':          ", fsm.scrldir_lamp.can  'init'
      help "fsm.grabmode_btn.can  'toggle':        ", fsm.grabmode_btn.can  'toggle'
      help "fsm.grabmode_btn.can  'setPanzoom':    ", fsm.grabmode_btn.can  'setPanzoom'
      help "fsm.grabmode_btn.can  'setMarkscroll': ", fsm.grabmode_btn.can  'setMarkscroll'
    show_abilities()
    info fsm.grabmode_btn.init()
    show_abilities()
    info fsm.scrldir_btn.init()
    show_abilities()
    info fsm.scrldir_lamp.init()
    show_abilities()
    info fsm.grabmode_btn.toggle()
    info fsm.scrldir_lamp.toggle()
  echo '----------------------------------------------------------------------'
  do =>
    fsm = new Mkts_toolbox_fsm get_fsm_descriptions()
    help fsm.get_state()
    info fsm.start()
    help fsm.get_state()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_visualization = ->
  visualize = require '../../../apps/mkts-gui-toolbox-fsm/node_modules/javascript-state-machine/lib/visualize'
  fsm       = new Mkts_toolbox_fsm get_fsm_descriptions()
  for name in fsm._names
    echo visualize fsm[ name ]
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_detect_actual_state_changes = ->
  require '../../../apps/svelte-and-sapper-for-print-app2-fresh/static/equals'
  debug '^4484879^', equals { x: { x: { z: 42, }, }, }, { x: { x: { z: 42, }, }, }
  globalThis.StateMachine = require 'javascript-state-machine'
  require '../../../apps/mkts-gui-toolbox-fsm' ### NOTE exports to global namespace FTTB ###
  #---------------------------------------------------------------------------------------------------------
  fsm_descriptions =
    foo_lamp:
      init: 'lit',
      transitions: [
        { name: 'press',    from: '*',      to: 'lit',  },
        { name: 'release',  from: '*',      to: 'dark', },
        { name: 'toggle',   from: 'lit',    to: 'dark', },
        { name: 'toggle',   from: 'dark',   to: 'lit',  },
        ],
      methods:
        onAfterTransition:  -> log '^334-7^', 'scrldir_lamp:', @get_state()
        onEnterLit:         -> log '^334-8^', 'scrldir_lamp: onEnterLit'
        onEnterDark:        -> log '^334-9^', 'scrldir_lamp: onEnterDark'
  #---------------------------------------------------------------------------------------------------------
  class My_fsm extends Mkts_toolbox_fsm
    on_after_transition: ( lifecycle ) ->
      delete lifecycle.fsm
      debug '^on_after_transition@34476^', lifecycle
  #---------------------------------------------------------------------------------------------------------
  fsm = new My_fsm fsm_descriptions
  fsm.foo_lamp.press()
  fsm.foo_lamp.press()
  fsm.foo_lamp.press()
  return null


############################################################################################################
if module is require.main then do =>
  # @demo_2()
  @demo_detect_actual_state_changes()
  # @demo_visualization()



