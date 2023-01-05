
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
  whisper }               = GUY.trm.get_loggers 'DEMO-COMPOSE-REGEXP'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
truth                     = GUY.trm.truth.bind GUY.trm
#...........................................................................................................
{ equals
  copy_regex }            = GUY.samesame


############################################################################################################
if module is require.main then do =>
  debug await import( 'compose-regexp' )
  { atomic
    bound
    capture
    charSet
    either
    flags
    lookAhead
    lookBehind
    maybe
    namedCapture
    noBound
    notAhead
    notBehind
    ref
    sequence
    suffix        } = await import( 'compose-regexp' )

  ###
  charSet: {
    difference: [Function: csDiff],
    intersection: [Function: csInter],
    complement: [Function: csComplement],
    union: [Function: either] },
  flags: { add: [Function: add] },
  ###

  info '^30-1^', either 'this', 'that'
  info '^30-2^', ( either 'this', 'that' ), ( maybe 'abc' )
  info '^30-3^', charSet.union ( either 'this', 'that' ), ( maybe 'abc' )
  info '^30-4^', charSet.intersection ( either 'this', 'that' ), ( maybe 'abc' )
  info '^30-5^', charSet.complement ( either 'this', 'that' ), ( maybe 'abc' )
  info '^30-6^', charSet.difference ( either 'this', 'that' ), ( maybe 'abc' )
  urge '^30-7^', re = charSet.intersection /\p{Lowercase}/u, /\p{Script=Greek}/u
  urge '^30-8^', truth re.test 'a'
  urge '^30-9^', truth re.test 'A'
  urge '^30-10^', truth re.test 'Δ'
  urge '^30-11^', truth re.test 'δ'
  urge '^30-12^', truth re.test 'δε'
  urge '^30-13^', truth re.test 'xxxδεxxx'
  urge '^30-14^', truth re.test 'xxxxxx'
  urge '^30-15^', b = bound /\p{Script=Greek}/u
  urge '^30-16^', truth b.test 'xxxδεxxx'
  urge '^30-17^', truth b.test 'xxxxxx'
  urge '^30-18^', b = bound /a/u
  urge '^30-19^', truth b.test 'xxxδεxxx'
  urge '^30-20^', truth b.test 'xxxxxx'
  urge '^30-21^', truth b.test 'xxxaxxx'
  urge '^30-22^', truth b.test 'a'
  info '^30-23^', suffix '+', 'a'
  info '^30-24^', suffix '*', 'a', 'b', 'c'
  info '^30-25^', suffix '*', charSet.union /\p{Lowercase}/u, 'a', /\d/
  lexemes = []
  n       = namedCapture
  info '^30-26^', lexemes.push n 'backtick',      notBehind '\\', '`'
  info '^30-26^', lexemes.push n 'digits',        notBehind '\\', /\d+/
  info '^30-27^', lexemes.push n 'tag',           notBehind '\\', /<[^>]+>/
  info '^30-27^', lexemes.push n 'ws',            notBehind '\\', /\p{White_Space}+/u
  info '^30-28^', lexemes.push n 'letters',       notBehind '\\', /\p{L}+/u
  info '^30-28^', lexemes.push n 'anything',      notBehind '\\', /./u
  info '^30-26^', lexemes.push n 'other_digits',  notBehind '\\', /[0-9]+/
  info '^30-29^', sticky        = flags.add 'y'
  info '^30-30^', unicode       = flags.add 'u'
  info '^30-31^', lexer         = sticky unicode either lexemes...
  info '^30-32^', rpr source    = 'foo `bar` <i>1234</i>\n'
  prv_last_idx = 0
  info '^30-33^', 0
  while ( match = source.match lexer )?
    for name, group of match.groups
      continue unless group or group is ''
      info '^30-33^', lexer.lastIndex, name, rpr group
      if lexer.lastIndex is prv_last_idx
        warn '^30-33^', GUY.trm.reverse "detected loop, stopping"
        match = null
        break
      prv_last_idx = lexer.lastIndex
    break unless match?
  return null





