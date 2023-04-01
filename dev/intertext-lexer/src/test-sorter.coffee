
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/SORTER'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
H2                        = require './helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM




#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@token_ordering = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose
    sorter   }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  new_lexer = ( mode = 'plain' ) ->
    lexer   = new Interlex { split: 'lines', }
    #.......................................................................................................
    lexer.add_lexeme { mode, lxid: 'star',   pattern: /[*]/u, }
    lexer.add_lexeme { mode, lxid: 'nl',     pattern: /$/u, }
    lexer.add_lexeme { mode, lxid: 'letter', pattern: /[^*]/u, }
    #.......................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ '*abc*', '*,a,b,c,*,', null ]
    [ '*abc*\ndef', '*,a,b,c,*,,d,e,f,', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      result      = []
      result_rpr  = []
      for token from lexer.walk probe
        result.push token
        result_rpr.push token.value
      result_sorted = sorter.sort result
      T?.eq result, result_sorted
      T?.eq ( sorter.ordering_is  ( result.at  0 ), ( result.at -1 ) ), true
      T?.eq ( sorter.ordering_is  ( result.at -1 ), ( result.at  0 ) ), false
      T?.eq ( sorter.cmp          ( result.at  0 ), ( result.at -1 ) ), -1
      T?.eq ( sorter.cmp          ( result.at -1 ), ( result.at  0 ) ), +1
      T?.eq ( sorter.cmp          ( result.at -1 ), ( result.at -1 ) ),  0
      T?.eq ( sorter.cmp          ( result.at  0 ), ( result.at  0 ) ),  0
      # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result_sorted
      # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
      resolve result_rpr.join ','
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  test @


