
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/TOPOSORT'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
H                         = require '../../../lib/helpers'
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show = ( topograph ) ->
  LTSORT                    = require '../../../apps/ltsort'
  try dependencies = LTSORT.group topograph catch error
    throw error unless ( error.message.match /detected cycle involving node/ )?
    warn GUY.trm.reverse error.message
    warn '^08-1^', GUY.trm.reverse error.message
    # throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
  info '^08-2^', dependencies
  try ordering = LTSORT.linearize topograph catch error
    throw error unless ( error.message.match /detected cycle involving node/ )?
    warn '^08-3^', GUY.trm.reverse error.message
    # throw new DBay_sqlm_circular_references_error '^dbay/dbm@4^', name, ref_name
  table = []
  for [ name, precedents, ] from topograph.precedents.entries()
    precedents = precedents.join ', '
    table.push { name, precedents, }
  H.tabulate "topograph", table
  info '^08-4^', ( GUY.trm.yellow x for x in ordering ).join GUY.trm.grey ' => '
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@parse_stars_using_toposort = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  new_toy_md_lexer = ( mode = 'plain' ) ->
    lexer   = new Interlex { split: false, dotall: false, end_token: true, }
    #.........................................................................................................
    lexer.add_lexeme { mode, tid: 'star1',  pattern: /\*{1}/u, needs: 'star2', }
    lexer.add_lexeme { mode, tid: 'star2',  pattern: /\*{2}/u, precedes: 'star1', needs: 'star3', }
    lexer.add_lexeme { mode, tid: 'star3',  pattern: /\*{3}/u, precedes: '*', }
    lexer.add_lexeme { mode, tid: 'escchr', pattern: /\\(?<chr>.)/u, precedes: '*', }
    lexer.add_lexeme { mode, tid: 'other',  pattern: /[^*\\]+/u, needs: '*', }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ '*abc*', "[md:star1,(0:0)(0:1),='*'][md:other,(0:1)(0:4),='abc'][md:star1,(0:4)(0:5),='*'][md:$eof,(0:5)(0:5),='']", null ]
    [ '*abc\\*', "[md:star1,(0:0)(0:1),='*'][md:other,(0:1)(0:4),='abc'][md:escchr,(0:4)(0:6),='\\\\*',chr:'*'][md:$eof,(0:6)(0:6),='']", null ]
    [ '**abc**', "[md:star2,(0:0)(0:2),='**'][md:other,(0:2)(0:5),='abc'][md:star2,(0:5)(0:7),='**'][md:$eof,(0:7)(0:7),='']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_toy_md_lexer 'md'
      T?.eq ( tid for tid of lexer.registry.md.lexemes ), [ 'star1', 'star2', 'star3', 'escchr', 'other', ]
      result      = lexer.run probe
      T?.eq ( tid for tid of lexer.registry.md.lexemes ), [ 'escchr', 'star3', 'star2', 'star1', 'other' ]
      result_rpr  = ( lexer.rpr_token t for t in result ).join ''
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  test @parse_stars_using_toposort
  # @toposort()
  # test @
