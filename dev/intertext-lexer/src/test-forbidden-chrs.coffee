
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/BASICS'
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
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@add_forbidden_chrs = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'star1',            pattern: ( /(?<!\*)\*(?!\*)/u ), forbidden: '*' }
    # lexer.new_pattern_
    exclude = c.charSet.complement.bind c.charSet
    # debug pattern = c.charSet.union ( exclude '*' ), ( exclude 'x' )
    forbidden = /[*x#]/
    catchall = c.suffix '*', exclude forbidden
    debug { forbidden, catchall, }
    for probe in [ 'helo', 'helo*x', '*x', ]
      debug GUY.trm.reverse GUY.trm.steel probe
      help probe.match catchall
      warn probe.match forbidden
  #.........................................................................................................

  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  @add_forbidden_chrs()
  # test @
