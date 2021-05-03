
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
# test                      = require 'guy-test'
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
@get_fsmd = ->
  fsmd =
    # eq:           ( a, b ) -> ...
    # freeze:       ( x ) -> ...
    name:         'grabmode'
    moves:
      start:          [ 'void',         'markscroll', ]
      reset:          [ 'any',          'void',       ]
      toggle:         [ 'panzoom',      'markscroll', ]
      toggle:         [ 'markscroll',   'panzoom',    ]
      setPanzoom:     [ 'markscroll',   'panzoom',    ]
      setPanzoom:     [ 'panzoom',      'panzoom',    ]
      setMarkscroll:  [ 'markscroll',   'markscroll', ]
      setMarkscroll:  [ 'panzoom',      'markscroll', ]
    before:
      trigger:    ( s ) -> info "before trigger     ",  s
      change:     ( s ) -> info "before change      ",  s
      state:      ( s ) -> info "before state       ",  s
      start:      ( s ) -> info "before start       ",  s
      stop:       ( s ) -> info "before stop        ",  s
      toggle:     ( s ) -> info "before toggle      ",  s
      setPanzoom: ( s ) -> info "before setPanzoom  ",  s
    enter:
      void:       ( s ) -> info "enter void         ",  s
      panzoom:    ( s ) -> info "enter panzoom      ",  s
      markscroll: ( s ) -> info "enter markscroll   ",  s
    stay:
      void:       ( s ) -> info "stay void          ",  s
      panzoom:    ( s ) -> info "stay panzoom       ",  s
      markscroll: ( s ) -> info "stay markscroll    ",  s
    leave:
      void:       ( s ) -> info "leave void         ",  s
      panzoom:    ( s ) -> info "leave panzoom      ",  s
      markscroll: ( s ) -> info "leave markscroll   ",  s
    after:
      trigger:    ( s ) -> info "after trigger      ",  s
      change:     ( s ) -> info "after change       ",  s
      state:      ( s ) -> info "after state        ",  s
      start:      ( s ) -> info "after start        ",  s
      stop:       ( s ) -> info "after stop         ",  s
      toggle:     ( s ) -> info "after toggle       ",  s
      setPanzoom: ( s ) -> info "after setPanzoom   ",  s
    fail:       ( s ) -> warn "fail               ",  s
  #---------------------------------------------------------------------------------------------------------
  return fsmd

#-----------------------------------------------------------------------------------------------------------
@demo_2 = ->
  #.........................................................................................................
  globalThis.debug    = debug
  globalThis.warn     = warn
  globalThis.info     = info
  globalThis.urge     = urge
  globalThis.help     = help
  globalThis.whisper  = whisper
  globalThis.echo     = echo
  globalThis.log      = log
  globalThis.rpr      = rpr
  { Intermatic, }     = require '../../../apps/intermatic'
  fsm                 = new Intermatic @get_fsmd()
  # debug '^34766^', rpr @get_fsmd()
  debug '^34766^', "moves:", rpr fsm.moves
  urge '^347-1^', 'start --------------------------------------'
  urge '^347-2^', fsm.start()
  urge '^347-3^', 'toggle --------------------------------------'
  urge '^347-4^', fsm.toggle()
  urge '^347-5^', 'setMarkscroll --------------------------------------'
  urge '^347-6^', fsm.setMarkscroll()
  urge '^347-7^', 'setMarkscroll --------------------------------------'
  urge '^347-8^', fsm.setMarkscroll()
  urge '^347-9^', 'reset --------------------------------------'
  urge '^347-10^', fsm.reset()
  urge '^347-11^', 'reset --------------------------------------'
  urge '^347-12^', fsm.reset()
  urge '^347-13^', 'toggle --------------------------------------'
  urge '^347-14^', fsm.toggle()
  urge '^347-13^', 'start --------------------------------------'
  urge '^347-14^', fsm.start()
  return null

#-----------------------------------------------------------------------------------------------------------
@toolbox_demo = ->
  ###
  toolbox_html   =
    grabmode_btn:
      markscroll:   'mark<br>scroll'
      panzoom:      'pan<br>zoom'
    scrldir_btn:
      vert:         'vert<br>scroll'
      horz:         'horz<br>scroll'
    shift_btn:
      released:     'shift'
      pressed:      'shift'
    capslock_btn:
      released:     'caps<br>lock'
      pressed:      'caps<br>lock'
    alt_btn:
      released:     'alt'
      pressed:      'alt'
    altgraph_btn:
      released:     'altgr'
      pressed:      'altgr'
    control_btn:
      released:     'ctrl'
      pressed:      'ctrl'
    meta_btn:
      released:     'meta'
      pressed:      'meta'
    # Compose
    # ContextMenu
  _XXX_TMP_toolbox_colors =
    altgraph_btn:   'turquoise'
  ###
  #---------------------------------------------------------------------------------------------------------
  fsmds =

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
      moves:
        start:  [ 'void',   'lit',   ]
        reset:  [ 'any',    'void',  ]
        toggle: [ 'lit',    'dark', 'lit', ]
      after:
        trigger:    ( s ) -> whisper s
        change:     ( s ) -> info "after change: #{rpr s}"
      fail:         ( s ) -> whisper s
      goto:         'any'
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsmd            = { fsmds.meta_lamp..., }
  ### TAINT should not be necessary ###
  fsmd.name       = 'meta_lamp'
  metalamp_fsm    = new Intermatic fsmd
  urge '^445-1^', "start";        metalamp_fsm.start()
  urge '^445-1^', "toggle";       metalamp_fsm.toggle()
  urge '^445-1^', "reset";        metalamp_fsm.reset()
  urge '^445-1^', "toggle";       metalamp_fsm.toggle()
  urge '^445-1^', "goto 'lit'";   metalamp_fsm.goto 'lit'
  urge '^445-1^', "goto 'lit'";   metalamp_fsm.goto 'lit'
  urge '^445-1^', "goto 'dark'";  metalamp_fsm.goto 'dark'
  urge '^445-1^', "goto 'void'";  metalamp_fsm.goto 'void'
  urge '^445-1^', "start";        metalamp_fsm.start()
  return null

#-----------------------------------------------------------------------------------------------------------
@compound_fsm_demo = ->
  result    = []
  register  = ( x ) ->
    whisper '^2321^', rpr x
    result.push x
  #---------------------------------------------------------------------------------------------------------
  cfsmd =
    #.......................................................................................................
    meta_btn:
      moves:
        start:                [ 'void',     'released',     ]
        reset:                [ 'any',      'void',         ]
        press:                [ 'released', 'pressed',      ]
        release:              [ 'pressed',  'released',     ]
        _report_broken_lamp:  [ 'any',      'lamp_broken',  ]
        break_lamp:           [ 'any',      'lamp_broken',  ]
      enter:
        'pressed':      ( s ) -> register "enter pressed: #{rpr s}";      @my.lamp.light()
        'released':     ( s ) -> register "enter released: #{rpr s}";     @my.lamp.goto 'dark'
      after:
        '_report_broken_lamp':  ( s ) -> register "after _report_broken_lamp: #{rpr s}"
        'break_lamp':           ( s ) -> register "after break_lamp: #{rpr s}"; @my.lamp.break()
      goto:         'any'
      #.....................................................................................................
      my:
        lamp:
          moves:
            start:  [ 'void',   'lit',    ]
            toggle: [ 'lit',    'dark',   ]
            toggle: [ 'dark',   'lit',    ]
            break:  [ 'any',    'broken', ]
          after:
            change:     ( s ) -> register "after change:  #{rpr s}"
          enter:
            dark:       ( s ) -> register "enter dark:    #{rpr s}"
            lit:        ( s ) -> register "enter lit:     #{rpr s}"
            broken:     ( s ) ->
              register "lamp broken, switching off"
              @we._report_broken_lamp()
          goto:         'any'
    #.......................................................................................................
    after:
      change: ( s ) -> register "ima.change"
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  fsm             = new Intermatic cfsmd
  # debug '^33478^', fsm
  # debug '^33478^', ( k for k of fsm )
  # T.eq ( Object.keys fsm ),
  # fsm.start()
  #---------------------------------------------------------------------------------------------------------
  # done()

#-----------------------------------------------------------------------------------------------------------
@basics_demo = ->
  #---------------------------------------------------------------------------------------------------------
  cstate_ansi = ->
    parts = []
    parts.push @stage
    parts.push @verb
    parts.push if ( @dpar is @lstate ) then ( CND.reverse @dpar ) else @dpar
    parts.push '▶'
    parts.push if ( @dest is @lstate ) then ( CND.reverse @dest ) else @dest
    parts.push ( CND.reverse "failed A" ) if @failed
    parts.push ( CND.reverse "failed B" ) if ( @dest is null )
    parts.push "(unchanged)" unless @changed
    return parts.join ' '
  #---------------------------------------------------------------------------------------------------------
  fsmd =
    name: 'meta_lamp'
    moves:
      start:    [ 'void', 'lit',  ]
      reset:    [ 'any',  'void', ]
      toggle:   [ 'lit',  'dark', 'lit', ]
      brighten: [ 'lit', 'lit', ]
      # noop:   'any'
    before:
      any:        ( d ) -> info "##{d.count}", @cstate_ansi()
      change:     ( d ) -> info "##{d.count}", @cstate_ansi()
    after:
      any:        ( d ) -> help "##{d.count}", @cstate_ansi()
      change:     ( d ) -> help "##{d.count}", @cstate_ansi()
    entering:
      dark:       ( d ) -> urge "##{d.count}", @cstate_ansi()
    leaving:
      lit:        ( d ) -> urge "##{d.count}", @cstate_ansi()
    fail:         ( d ) -> warn "##{d.count}", @cstate_ansi()
  #---------------------------------------------------------------------------------------------------------
  { Intermatic, } = require '../../../apps/intermatic'
  count           = 0
  fsm             = new Intermatic fsmd
  fsm.cstate_ansi = cstate_ansi
  info '^44455^', fsm.moves
  fsm.start     { count: ++count, }
  fsm.brighten  { count: ++count, }
  fsm.toggle    { count: ++count, }
  # fsm.noop      { count: ++count, }
  fsm.brighten  { count: ++count, }
  fsm.reset     { count: ++count, }
  fsm.toggle    { count: ++count, }
  # fsm.goto 'lit'
  # fsm.goto 'lit'
  # fsm.goto 'dark'
  #---------------------------------------------------------------------------------------------------------
  return null


############################################################################################################
if module is require.main then do =>
  # await @demo_2()
  # await @toolbox_demo()
  # await @compound_fsm_demo()
  await @basics_demo()
