
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


#-----------------------------------------------------------------------------------------------------------
# declare

#===========================================================================================================
# HELPERS
#-----------------------------------------------------------------------------------------------------------
class Recorder

  #---------------------------------------------------------------------------------------------------------
  constructor: ( fsm ) ->
    # validate.fsm fsm
    @fsm = fsm
    debug '^3334^', @fsm.triggers
    tnames = Object.keys @fsm.triggers
    debug '^3334^', tnames
    debug '^3334^', @fsm.lstates
    debug '^3334^', @fsm.fsm_names
    @_compile_handlers()
    return null

  #---------------------------------------------------------------------------------------------------------
  _compile_handlers: ->
    # @_compile_trigger_handlers()
    @_compile_state_handlers()
    return null

  #---------------------------------------------------------------------------------------------------------
  _compile_state_handlers: ->
    entry_point = 'enter'
    target      = @fsm[ entry_point ]
    xxx_show    = ( s, P... ) -> debug '^27776^', s
    ### TAINT where/when to call so we get a line to represent state at recorder initialization? ###
    xxx_show { $key: '???', to: @fsm.lstate, }
    for lstate in @fsm.lstates
      if ( original_handler = target[ lstate ] )?
        handler = ( s, P... ) ->
          original_handler s, P...
          xxx_show s, P...
      else
        handler = ( s, P... ) ->
          xxx_show s, P...
      target[ lstate ] = handler.bind @fsm
    return null


############################################################################################################
module.exports = Recorder



############################################################################################################
if module is require.main then do =>





