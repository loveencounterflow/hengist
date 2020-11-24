
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERSTATE'
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
@get_fsmd = ->
  fsmd =
    # eq:           ( a, b ) -> ...
    # freeze:       ( x ) -> ...
    name:         'grabmode'
    # triggers: [
    #   'start      -> markscroll'
    #   'foobar     -> stop'
    #   'panzoom    -- toggle         -> markscroll'
    #   'markscroll -- toggle         -> panzoom'
    #   'markscroll -- setPanzoom     -> panzoom'
    #   'panzoom    -- setPanzoom     -> panzoom'
    #   'markscroll -- setMarkscroll  -> markscroll'
    #   'panzoom    -- setMarkscroll  -> markscroll' ],
    triggers: [
      [ 'void',       'start',          'markscroll', ]
      [ '*',          'reset',          'void', ]
      # [ 'foobar',     'stop',           void          ] # ???
      [ 'panzoom',    'toggle',         'markscroll', ]
      [ 'markscroll', 'toggle',         'panzoom',    ]
      [ 'markscroll', 'setPanzoom',     'panzoom',    ]
      [ 'panzoom',    'setPanzoom',     'panzoom',    ]
      [ 'markscroll', 'setMarkscroll',  'markscroll', ]
      [ 'panzoom',    'setMarkscroll',  'markscroll', ], ]
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
  require '../../../apps/mkts-gui-toolbox-fsm/lib/interstate' ### NOTE exports to global namespace FTTB ###
  fsm = new Interstate @get_fsmd()
  # debug '^34766^', JSON.stringify fsm, null, '  '
  debug '^34766^', JSON.stringify fsm.triggers, null, '  '
  debug '^347-1^', 'start --------------------------------------'
  debug '^347-2^', fsm.start()
  debug '^347-3^', 'toggle --------------------------------------'
  debug '^347-4^', fsm.toggle()
  debug '^347-5^', 'setMarkscroll --------------------------------------'
  debug '^347-6^', fsm.setMarkscroll()
  debug '^347-7^', 'setMarkscroll --------------------------------------'
  debug '^347-8^', fsm.setMarkscroll()
  debug '^347-9^', 'reset --------------------------------------'
  debug '^347-10^', fsm.reset()
  debug '^347-11^', 'reset --------------------------------------'
  debug '^347-12^', fsm.reset()
  debug '^347-13^', 'toggle --------------------------------------'
  debug '^347-14^', fsm.toggle()
  return null


############################################################################################################
if module is require.main then do =>
  @demo_2()



