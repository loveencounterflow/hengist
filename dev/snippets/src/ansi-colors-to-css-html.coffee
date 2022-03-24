
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ANSI-COLORS-TO-CSS-HTML'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
GUY                       = require '../../../apps/guy'
AnsiParser                = require 'node-ansiparser'
output                    = []


terminal =
  #---------------------------------------------------------------------------------------------------------
  inst_p: ( text ) ->
    urge '^340-inst_p^', 'print', text
    ### TAINT must escape text ###
    output.push text
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_o: ( s ) ->
    urge '^340-inst_o^', 'osc', s
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_x: ( flag ) ->
    urge '^340-inst_x^', 'execute', flag.charCodeAt(0)
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_c: ( collected, parameters, flag ) ->
    urge '^340-inst_c^', 'csi', collected, parameters, flag
    switch flag
      when 'm' ### SGR: Select Graphic Rendition ###
        if parameters.length is 1
          if parameters[ 0 ] is 0 ### reset ###
            output.push '</span>'
          else
            null
      else
        null
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_e: ( collected, flag ) ->
    urge '^340-inst_e^', 'esc', collected, flag
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_H: ( collected, parameters, flag ) ->
    urge '^340-inst_H^', 'dcs-Hook', collected, parameters, flag
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_P: ( dcs ) ->
    urge '^340-inst_P^', 'dcs-Put', dcs
    return null

  #---------------------------------------------------------------------------------------------------------
  inst_U: (  ) ->
    urge '^340-inst_U^', 'dcs-Unhook'
    return null

############################################################################################################
if module is require.main then do =>
  # parser  = new AnsiParser terminal
  # parser.parse CND.red    'red'
  # parser.parse CND.blue   'blue'
  # parser.parse CND.green  'green'
  # parser.parse CND.steel  'steel'
  # # parser.parse '\x1b[31mHello World!\n'
  # # parser.parse '\x1bP0!u%5\x1b\''
  # info output
  # debug '^598^', k for k in ( k for k of CND ).sort()
  # VT100 = require 'cnd/lib/TRM-VT100-ANALYZER'
  # help VT100.analyze CND.steel 'steel'
  # help VT100.as_html CND.steel 'steel'

  VT100 = require 'cnd/lib/TRM-VT100-ANALYZER'
  echo CND.steel 'steel'
  echo VT100.analyze CND.steel 'steel'
  echo VT100.as_html CND.steel 'steel'
  echo VT100.as_html CND.red    'red'
  echo VT100.as_html CND.blue   'blue'
  echo VT100.as_html CND.green  'green'
  echo VT100.as_html CND.white  'white'





