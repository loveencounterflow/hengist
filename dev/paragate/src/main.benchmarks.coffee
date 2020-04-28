
'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'PARAGATE/BENCHMARKS'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
defer                     = setImmediate
#...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   cast
#   type_of }               = types
#...........................................................................................................
BM                        = require '../../../lib/benchmarks'
# DATA                      = require '../data-providers'
#...........................................................................................................
timeout                   = 3 * 1000
limit_reached             = ( t0 ) -> Date.now() - t0 > timeout
FSP                       = ( require 'fs' ).promises
PATH                      = require 'path'
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
#...........................................................................................................
assets =
  ok:                 false
  probes:             [
    ''
    'x'
    'foo\n  bar'
    '\nxxx'.repeat 20000
    ]
  approx_char_count:  0
  line_count:         0
  paths:              [
    'main.benchmarks.js'
    'interim.tests.js'
    '../src/interim.tests.coffee'
    '../../../README.md'
    '../../../README.md'
    '../../../README.md'
    ]

#-----------------------------------------------------------------------------------------------------------
prepare = -> new Promise ( resolve ) ->
  return resolve() if assets.ok
  for path in assets.paths
    path                        = PATH.resolve PATH.join __dirname, path
    probe                       = await FSP.readFile path, { encoding: 'utf-8', }
    assets.approx_char_count  += probe.length
    assets.line_count         += ( probe.split '\n' ).length
    assets.probes.push probe
  assets.ok = true
  resolve()
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@chvtindent   = ( n, show ) -> await @_parse n, show, 'chvtindent'
@rxws_tokens  = ( n, show ) -> await @_parse n, show, 'rxws_tokens'
@rxws_blocks  = ( n, show ) -> await @_parse n, show, 'rxws_blocks'
@htmlish      = ( n, show ) -> await @_parse n, show, 'htmlish'
@asciisorter  = ( n, show ) -> await @_parse n, show, 'asciisorter'

#-----------------------------------------------------------------------------------------------------------
@_parse = ( n, show, name ) -> new Promise ( resolve ) =>
  switch name
    when 'chvtindent'
      GRAMMAR = require '../paragate/lib/indentation.grammar'
      grammar = GRAMMAR.indentation_grammar
    when 'rxws_blocks'
      GRAMMAR = require './regex-whitespace.grammar'
      grammar = GRAMMAR.rxws_grammar
    when 'rxws_tokens'
      GRAMMAR = require './regex-whitespace.grammar'
      grammar = new GRAMMAR.Rxws_grammar { as_blocks: false, }
    when 'htmlish'
      grammar = require '../paragate/lib/htmlish.grammar'
      # grammar = new GRAMMAR.Rxws_grammar { as_blocks: false, }
    when 'asciisorter'
      GRAMMAR = require '../paragate/lib/asciisorter.grammar'
      grammar = GRAMMAR.asciisorter
    else
      throw new Error "^44498^ unknown grammar #{rpr name}"
  await prepare()
  #.........................................................................................................
  resolve => new Promise rxws_tokens = ( resolve ) =>
    token_count = 0
    for probe, idx in assets.probes
      tokens        = grammar.parse probe
      token_count  += tokens.length
    resolve assets.approx_char_count
    # resolve token_count
    # resolve assets.line_count
    return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_parse = ->
  await prepare()
  GRAMMAR = require './regex-whitespace.grammar'
  # grammar = GRAMMAR.rxws_grammar
  grammar = new GRAMMAR.Rxws_grammar { as_blocks: false, }
  # GRAMMAR = require '../paragate/lib/indentation.grammar'
  # grammar = GRAMMAR.indentation_grammar
  for probe in assets.probes
    urge '^5554^', rpr ( grammar.parse probe ).length
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@benchmark = ->
  # always_use_fresh_words    = false
  bench       = BM.new_benchmarks()
  # n           = 1e6
  n           = 10
  timeout     = n / 50e3 * 1000 + ( 2 * 1000 )
  show        = false
  show        = n < 21
  repetitions = 5
  # await BM.benchmark n, show, @
  test_names = [
    'htmlish'
    'asciisorter'
    'chvtindent'
    'rxws_tokens'
    'rxws_blocks'
    ]
  for _ in [ 1 .. repetitions ]
    CND.shuffle test_names
    for test_name in test_names
      await BM.benchmark bench, n, show, @, test_name
    echo()
  BM.show_totals bench
  return null

# commander                          heap-benchmark fontmirror interplot svgttf mingkwai-typesetter
############################################################################################################
if module is require.main then do =>
  # demo_parse()
  await @benchmark()
  return null

