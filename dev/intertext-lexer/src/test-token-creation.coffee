
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
H2                        = require './helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM




#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@__token_creation_with_dataclass = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  #.........................................................................................................
  do ->
    T?.ok 'Token' in Object.keys lexer.types.registry
    try lexer.types.create.Token() catch error then warn '^93-1^', GUY.trm.reverse error.message
    T?.throws /not a valid/, -> lexer.types.create.Token()
    return null
  #.........................................................................................................
  do ->
    debug '^93-1^', lexer.types.create.Token { $key: 'foo:bar', }
    d = lexer.types.create.Token { $key: 'plain:p:start', lnr1: 123, }
    e = d.set_mode 'tag'
    debug '^93-1^', d
    debug '^93-1^', e
    return null
  #.........................................................................................................
  done?()
  return null

############################################################################################################
if require.main is module then do =>
  # test @lex_tags
  test @
  # @token_creation_with_dataclass()
  # test @lex_tags_with_rpr
  # test @parse_md_stars_markup


