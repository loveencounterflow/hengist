


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
  # Choice
  # Comment
  # ComplexDiagram
  # Diagram
  # NonTerminal
  # OneOrMore
  # Optional
  # Sequence
  # Skip
  # Terminal
  # ZeroOrMore

  # RR    = require 'tetsudou'
  RR    = require '../../../apps/tetsudou'
  # debug '^948^', RR.Options
  # RR.Options.VS = 20
  # RR.Options.AR = 8
  #.........................................................................................................
  d     = RR.ComplexDiagram 'foo',
    ( RR.Sequence ( RR.Terminal 'a node' ), ( RR.Terminal 'other' ) ),
    ( RR.Choice 0, 'bar', 'baz' ),
    ( RR.NonTerminal 'nonterminal' ),
    ( RR.Stack ( RR.ZeroOrMore ( RR.Terminal 'A' ), ( RR.Comment 'whatever' ), 'skip' ),
      RR.Optional('+', 'skip'),
      RR.Choice(0,
        RR.NonTerminal('name-start char'),
        RR.NonTerminal('escape')),
      RR.ZeroOrMore(
        RR.Choice(0,
          RR.NonTerminal('name char'),
          RR.NonTerminal('escape'))))
  #.........................................................................................................
  # d.format 10, 10, 10, 10
  # d.walk ( P... ) ->
  #   debug '^587^', P
  #   return null
  #.........................................................................................................
  path  = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/railroading-output.html'
  html  = FS.readFileSync path, { encoding: 'utf-8', }
  pos1  = html.indexOf '<svg class="railroad-diagram" '
  pos2  = ( html.indexOf '</svg>' ) + 6
  throw new Error "unable to find target" unless pos1 >= 0 and pos2 >= 0
  html  = html[ ... pos1 ] + d.toString() + html[ pos2 ... ]
  FS.writeFileSync path, html
  help "output written to #{PATH.relative process.cwd(), path}"
  # # debug await import( '/Users/benutzer/3rdparty/tetsudou/railroad.mjs' )
  return null

#-----------------------------------------------------------------------------------------------------------
@require_esm = ( path ) ->
  require_esm = ( require 'esm' ) module
  return ( require_esm path ).default


############################################################################################################
if module is require.main then do =>
  @demo_railroad_diagrams()
  # debug require '../../../apps/tetsudou/loader.js'
  # debug require '../../../apps/tetsudou'
  # debug @require_esm

  
