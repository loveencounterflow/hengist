
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
  info '^08-4^', ordering
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@toposort = ( T, done ) ->
  # T?.halt_on_error()
  LTSORT                    = require '../../../apps/ltsort'
  topograph                 = LTSORT.new_graph { loners: true, }
  lexemes                   = []
  ### TAINT simplify to single set? ###
  anyother                  =
    before: new Set()
    after:  new Set()
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
          anyother.after.add name
          continue
        LTSORT.add topograph, d, name
      for d in before
        if d is '*'
          anyother.before.add name
          continue
        LTSORT.add topograph, name, d
    return null
  #.........................................................................................................
  finalize = ->
    names = [ topograph.precedents.keys()..., ]
    for name from names
      for x from anyother.before.keys()
        debug '^08-5^', { name, x, }
        LTSORT.add topograph, x, name
      for x from anyother.after.keys()
        debug '^08-5^', { name, x, }
        LTSORT.add topograph, name, x
    return null
  #.........................................................................................................
  add_lexeme { name: 'shop',    before: '*', }
  add_lexeme { name: 'cook',    before: 'eat', }
  add_lexeme { name: 'dishes',  after: '*', }
  add_lexeme { name: 'eat',     after: 'cook', }
  #.........................................................................................................
  debug '^08-6^', anyother
  finalize()
  show topograph
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  @toposort()
  # test @
