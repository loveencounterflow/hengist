


'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'RAILROADING'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()

#-----------------------------------------------------------------------------------------------------------
@demo_railroad_diagrams = ->
  # Diagram
  # ComplexDiagram
  # Sequence
  # Choice
  # Optional
  # OneOrMore
  # ZeroOrMore
  # Terminal
  # NonTerminal
  # Comment
  # Skip
  # { JSDOM }           = require 'jsdom'
  # dom                 = new JSDOM '', { pretendToBeVisual: true }
  # globalThis.window   = dom.window
  # globalThis.document = dom.document
  # debug '^78643^', ( k for k of document )
  RR    = require 'railroad-diagrams'
  d     = RR.Diagram 'foo', RR.Choice 0, 'bar', 'baz'
  d.format 0, 0, 0, 0
  path  = PATH.resolve PATH.join __dirname, '../../..//Users/benutzer/jzr/hengist/apps-typesetting/html+svg-demos/railroad-output.html'
  debug '^4534^', path
  urge d.toString()
  return null



############################################################################################################
if module is require.main then do =>
  @demo_railroad_diagrams()

  
