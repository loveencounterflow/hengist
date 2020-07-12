
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTEXT/TESTS/HYPHENATION'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
{ new_datom
  lets
  select }                = DATOM.export()
#...........................................................................................................
test                      = require 'guy-test'


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.HYPH.hyphenate" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    ["","",]
    ["lexicographer","lex|i|cog|ra|pher",]
    ["astronomer","as|tronomer",]
    ["dweeb","dweeb",]
    ["Tylenol","Tylenol",]
    ["diagonally","di|ag|o|nally",]
    ["demeaned","de|meaned",]
    ["Pasternak","Paster|nak",]
    ["proofreader","proof|reader",]
    ["monochrome","mono|chrome",]
    ["diving","div|ing",]
    ["Bimini","Bi|mini",]
    ["hedonist","he|do|nist",]
    ["distinctiveness","dis|tinc|tive|ness",]
    ["repugnance","re|pug|nance",]
    ["haste","haste",]
    ["mistimes","mist|imes",]
    ["bested","bested",]
    ["sundered","sun|dered",]
    ["articulation","ar|tic|u|la|tion",]
    ["LEXICOGRAPHER","LEX|I|COG|RA|PHER",]
    ["ASTRONOMER","AS|TRONOMER",]
    ["DWEEB","DWEEB",]
    ["TYLENOL","TYLENOL",]
    ["DIAGONALLY","DI|AG|O|NALLY",]
    ["DEMEANED","DE|MEANED",]
    ["PASTERNAK","PASTER|NAK",]
    ["PROOFREADER","PROOF|READER",]
    ["MONOCHROME","MONO|CHROME",]
    ["DIVING","DIV|ING",]
    ["BIMINI","BI|MINI",]
    ["HEDONIST","HE|DO|NIST",]
    ["DISTINCTIVENESS","DIS|TINC|TIVE|NESS",]
    ["REPUGNANCE","RE|PUG|NANCE",]
    ["HASTE","HASTE",]
    ["MISTIMES","MIST|IMES",]
    ["BESTED","BESTED",]
    ["SUNDERED","SUN|DERED",]
    ["ARTICULATION","AR|TIC|U|LA|TION",]
    ["over-guesstimate","over-guessti|mate"]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # debug '^44453^', INTERTEXT.HYPH.new_hyphenator()
      # debug '^44453^', INTERTEXT.HYPH.reveal_hyphens INTERTEXT.HYPH.new_hyphenator() 'fantastic'
      # debug '^777801^', INTERTEXT.HYPH.hyphenate probe
      resolve ( INTERTEXT.HYPH.hyphenate probe ).replace /\xad/g, '|'
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.HYPH.soft_hyphen_chr" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  T.eq INTERTEXT.HYPH.soft_hyphen_chr, '\u00ad'
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.HYPH.count_soft_hyphens" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    [ "",           0, ]
    ["lex­i­cog­ra­pher",4,]
    ["as­tronomer",1,]
    ["di­ag­o­nally",3,]
    ["de­meaned",1,]
    ["Paster­nak",1,]
    ["proof­reader",1,]
    ["mono­chrome",1,]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve INTERTEXT.HYPH.count_soft_hyphens probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.HYPH.reveal_hyphens" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    [ "fan\xadtas\xadtic",           "fan-tas-tic", ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve INTERTEXT.HYPH.reveal_hyphens probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  INTERTEXT = require '../../../apps/intertext'
  text = """Some people prefer to have the right edge of their text look ‘solid’, by setting periods,
    commas, and other punctuation marks (including inserted hyphens) in the right-hand margin. For example,
    this practice is occasionally used in contemporary advertising. It is easy to get inserted hyphens into
    the margin: We simply let the width of the corresponding penalty item be zero. And it is almost as easy
    to do the same for periods and other symbols, by putting every such character in a box of width zero and
    adding the actual symbol width to the glue that follows. If no break occurs at this glue, the
    accumulated width is the same as before; and if a break does occur, the line will be justified as if the
    period or other symbol were not present. By varying the line width for a paragraph it is possible to
    flow the text around illustrations, asides, quotes and such. The example below leaves a gap for an
    illustration by setting the line widths temporarily shorter and then reverting. You can also see that
    the algorithm chose to hyphenate certain words to achieve acceptable line breaking. The following
    example is set ragged right. Ragged right is not simply justified text with fixed width inter-word
    spacing. Instead the algorithm tries to minimize the amount of white space at the end of each sentence
    over the whole paragraph. It also attempts to reduce the number of words that are "sticking out" of the
    margin."""
  hytext = INTERTEXT.HYPH.hyphenate text
  echo INTERTEXT.HYPH.reveal_hyphens hytext, '&shy;'
  return null


############################################################################################################
if module is require.main then do => # await do =>
  # await @_demo()
  # test @
  # help 'ok'
  await demo()
  # test @[ "demo" ]
  # test @[ "hyphenate" ]

  # test @[ "must quote attribute value" ]
  # test @[ "DATOM.HTML._as_attribute_literal" ]
  # test @[ "isa.intertext_html_tagname" ]
  # test @[ "HTML.datom_as_html (singular tags)" ]
  # test @[ "HTML.datom_as_html (closing tags)" ]
  # test @[ "HTML.datom_as_html (opening tags)" ]
  # test @[ "HTML.datom_as_html (texts)" ]
  # test @[ "HTML.datom_as_html (opening tags w/ $value)" ]
  # test @[ "HTML.datom_as_html (system tags)" ]
  # test @[ "HTML.datom_as_html (raw pseudo-tag)" ]
  # test @[ "HTML.datom_as_html (doctype)" ]
  # test @[ "HTML.html_as_datoms (1)" ]
  # test @[ "HTML.html_as_datoms (dubious 2)" ]
  # test @[ "HTML.html_as_datoms (dubious w/ pre-processor)" ]



