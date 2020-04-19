
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTEXT/GRAMMARS/BENCHMARKS'
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
BM                        = require '../../lib/benchmarks'
# DATA                      = require '../data-providers'
#...........................................................................................................
timeout                   = 3 * 1000
limit_reached             = ( t0 ) -> Date.now() - t0 > timeout



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@foobar = ( n, show ) -> new Promise ( resolve ) =>
  probes = -> yield i for i in [ 1 .. n ]; yield return
  #.........................................................................................................
  resolve => new Promise foobar = ( resolve ) =>
    R     = ( n ** 2 for probe from probes() )
    count = n
    resolve count
    return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@blah = ( n, show ) -> new Promise ( resolve ) =>
  #.........................................................................................................
  resolve => new Promise blah = ( resolve ) =>
    R     = ''
    count = 0
    for idx in [ 0 .. n ]
      count++
      R += "#{n}"
    resolve count
    return null
  #.........................................................................................................
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@benchmark = ->
  # always_use_fresh_words    = false
  bench       = BM.new_benchmarks()
  n           = 1e6
  # n           = 10
  timeout     = n / 50e3 * 1000 + ( 2 * 1000 )
  show        = false
  show        = n < 21
  repetitions = 1
  # await BM.benchmark n, show, @
  test_names = [
    'foobar'
    'blah'
    ]
  for _ in [ 1 .. repetitions ]
    # CND.shuffle test_names
    for test_name in test_names
      await BM.benchmark bench, n, show, @, test_name
    echo()
  BM.show_totals bench
  return null

# commander                          heap-benchmark fontmirror interplot svgttf mingkwai-typesetter
############################################################################################################
if module is require.main then do =>
  await @benchmark()
  return null

