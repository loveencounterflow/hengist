
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
symbols_path              = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_read_svg_symbols = ->
  HTML      = require '../../../apps/paragate/lib/htmlish.grammar'
  info HTML.grammar.parse FS.readFileSync symbols_path, { encoding: 'utf-8', }
  return null


############################################################################################################
if require.main is module then do =>
  @demo_read_svg_symbols()