
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/HELPERS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
# types                     = new ( require 'intertype' ).Intertype
# { isa
#   equals
#   type_of
#   validate
#   validate_list_of }      = types.export()
H                         = require '../../../lib/helpers'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_lexer_as_table = ( title, lexer ) ->
  lexemes = []
  for mode, entry of lexer.registry
    for tid, lexeme of entry.lexemes
      { mode, tid, pattern, jump, reserved, create, value, empty_value, } = lexeme
      lexemes.push { mode, tid, pattern, jump, reserved, create, value, empty_value, }
  H.tabulate title, lexemes
  return null

#-----------------------------------------------------------------------------------------------------------
excerpt_token = ( token ) -> GUY.props.pick_with_fallback token, null, \
  'mode', 'tid', 'mk', 'jump', 'value', 'data', 'lnr1', 'x1', 'lnr2', 'x2', '$stamped'

#===========================================================================================================
module.exports = { H..., show_lexer_as_table, excerpt_token, }


