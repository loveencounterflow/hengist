
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
      lexemes.push lexeme
  H.tabulate title, lexemes
  return null


#===========================================================================================================
module.exports = { H..., show_lexer_as_table, }


