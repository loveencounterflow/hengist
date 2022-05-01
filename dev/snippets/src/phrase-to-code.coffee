

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DB'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
H                         = require '../../../apps/dbay-vogue/lib/helpers'


#-----------------------------------------------------------------------------------------------------------
phrase_to_code = ( phrase ) ->
  # group letter + up to four letters of word 1 but no trailing vowel + initials of words 2 and on
  code  = phrase.toLowerCase()
  head  = code.replace /^(\S{1,3}[^aeiou\s]?).*$/, '$1'
  tail  = code.replace /^\S+\s*/, ''
  tail  = tail.replace /(?:^|\s+)(.)\S*/g, '$1'
  code  = head + tail

#-----------------------------------------------------------------------------------------------------------
demo_phrase_to_code = ->
  results = []
  phrases = [
    "hello world"
    "phrase"
    "for all I know"
    "a new programming language"
    "fortuicious"
    "clae"
    "clap"
    "clxp"
    ]
  for phrase in phrases
    code = phrase_to_code phrase
    results.push { phrase, code, }
  H.tabulate "phrases and codes", results
  return null


############################################################################################################
if module is require.main then do =>
  demo_phrase_to_code()


