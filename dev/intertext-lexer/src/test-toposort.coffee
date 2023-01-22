
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
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
SQL                       = String.raw
guy                       = require '../../../apps/guy'
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
@toposort = ( T, done ) ->
  # T?.halt_on_error()
  LTSORT                    = require '../../../apps/ltsort'
  topograph                 = LTSORT.new_graph { loners: true, }
  lexemes                   = []
  antecedents               = []
  subsequents               = []
  #.........................................................................................................
  add_lexeme = ( cfg ) ->
    cfg         = { { name, after, before, }..., cfg..., }
    { name
      after
      before  } = cfg
    validate.nonempty.text name
    after      ?= []
    before     ?= []
    after       = [ after,  ] unless isa.list after
    before      = [ before, ] unless isa.list before
    if ( before.length is 0 ) and ( after.length is 0 )
      LTSORT.add topograph, name
    else
      for d in after
        if d is '*'
          subsequents.push name unless name in subsequents
          continue
        LTSORT.add topograph, d, name
      for d in before
        if d is '*'
          antecedents.unshift name unless name in antecedents
          continue
        LTSORT.add topograph, name, d
    return null
  #.........................................................................................................
  finalize = ->
    names = [ topograph.precedents.keys()..., ]
    for antecedent, idx in antecedents
      help '^08-5^', antecedent, antecedents[ ... idx ]
      for name in [ names..., antecedents[ ... idx ]..., subsequents..., ]
        continue if antecedent is name
        LTSORT.add topograph, antecedent, name
    for subsequent, idx in subsequents
      warn '^08-6^', subsequent, subsequents[ ... idx ]
      for name in [ names..., subsequents[ ... idx ]..., antecedents..., ]
        continue if subsequent is name
        LTSORT.add topograph, name, subsequent
    return null
  #.........................................................................................................
  add_lexeme { name: 'getup',       before: '*', }
  add_lexeme { name: 'brushteeth',  before: '*', }
  add_lexeme { name: 'shop',        before: '*', }
  add_lexeme { name: 'cook',        before: 'eat', }
  add_lexeme { name: 'serve', after: 'cook', before: 'eat', }
  add_lexeme { name: 'dishes',      after: '*', }
  add_lexeme { name: 'sleep',       after: '*', }
  add_lexeme { name: 'eat',         after: 'cook', }
  #.........................................................................................................
  debug '^08-1^', { antecedents, subsequents, }
  finalize()
  show topograph
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  @toposort()
  # test @
