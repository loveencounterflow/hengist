

'use strict'


###

* MIT 6.006 Introduction to Algorithms, Fall 2011, View the complete course: http://ocw.mit.edu/6-006F11
  Instructor: Erik Demaine; [20. Dynamic Programming II: Text Justification,
  Blackjack](https://youtu.be/ENyox7kNKeY?t=1027)

* [Text Justification Dynamic Programming (Tushar Roy - Coding Made
  Simple)](https://www.youtube.com/watch?v=RORuwHiblPc). Given a sequence of words, and a limit on the
  number of characters that can be put in one line (line width). Put line breaks in the given sequence such
  that the lines are printed neatly. See code at
  https://github.com/mission-peace/interview/blob/master/src/com/interview/dynamic/TextJustification.java

###

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/SNIPPETS/DP-LINE-BREAKING'
debug                     = CND.get_logger 'debug',     badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
help                      = CND.get_logger 'help',      badge
warn                      = CND.get_logger 'warn',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
jr                        = JSON.stringify
# test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types
# SP                        = require '../../../apps/steampipes'
# { $
#   $async
#   $watch
#   $show
#   $drain }                = SP.export()
INTERTEXT                 = require '../../../apps/intertext'



############################################################################################################
if module is require.main then do =>

  text = """Hercules (/ˈhɜːrkjuliːz, -jə-/) is a Roman hero and god. He was the Roman equivalent of the
  Greek divine hero Heracles, who was the son of Zeus (Roman equivalent Jupiter) and the mortal Alcmene. In
  classical mythology, Hercules is famous for his strength and for his numerous far-ranging adventures."""
  text = "very short example"
  text = "Zentral/Dezentral, Innenorientierung/Kundenzentrierung und Fremdsteuerung/Selbstverantwortung"
  text = text.replace /\n/g, ' '
  text = text.replace /\s+/g, ' '
  # await @demo_looping text
  await @demo_piping text











