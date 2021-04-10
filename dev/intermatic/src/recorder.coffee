
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERMATIC/RECORDER'
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
# ITX                       = require '../../../apps/intertext'
{ to_width
  width_of }              = require 'to-width'


#-----------------------------------------------------------------------------------------------------------
# declare

#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
class Recorder

  #---------------------------------------------------------------------------------------------------------
  constructor: ( fsm ) ->
    # validate.fsm fsm
    @fsm    = fsm
    @_compile_state_handlers @fsm
    return null

  #---------------------------------------------------------------------------------------------------------
  _compile_state_handlers: ( fsm ) ->
    @_compile_state_handler fsm
    @_compile_state_handlers sub_fsm for sub_fsm in fsm.fsms
    return null

  #---------------------------------------------------------------------------------------------------------
  _compile_state_handler: ( fsm ) ->
    # is_first    = true
    self = @
    if ( original_handler = fsm.enter.any )?
      handler = ( P... ) ->
        original_handler P...
        self.render_state @path, P...
    else
      handler = ( P... ) ->
        self.render_state @path, P...
    fsm.enter.any   = handler.bind fsm
    fsm.stay.any    = handler.bind fsm
    fsm.before.any  = -> info '^recorder@3337^', fsm.move
    return null

  #---------------------------------------------------------------------------------------------------------
  render_state: ( path, P... ) ->
    urge '^recorder/render_state@3337^', @fsm.EXP_dstate
    return null


############################################################################################################
module.exports = Recorder



############################################################################################################
if module is require.main then do =>





