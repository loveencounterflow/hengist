
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
{ to_width }              = require 'to-width'
#...........................................................................................................
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
  suffix                } = require 'compose-regexp-commonjs'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
unicode = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { unicode: true, } else flags.add 'u', x
sticky  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { sticky: true,  } else flags.add 'y', x
dotall  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { dotAll: true,  } else flags.add 's', x
dotAll  = dotall


#===========================================================================================================
class Lexer

  #---------------------------------------------------------------------------------------------------------
  _token_from_match: ( prv_last_idx, match, mode = null ) ->
    x = null
    R = { mode, }
    for key, value of match.groups
      continue unless value?
      if key.startsWith '$'
        R.key     = key[ 1 .. ]
        R.mk      = if mode? then "#{mode}:#{R.key}" else R.key
        R.value   = value
      else
        ( x ?= {} )[ key ]  = if value is '' then null else value
    R.start = prv_last_idx
    R.stop  = prv_last_idx + match[ 0 ].length
    R.x     = x
    return R

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  lexemes = []
  n       = namedCapture
  #.........................................................................................................
  lexemes.push n '$escchr',       /\\(?<chr>.)/u
  lexemes.push n '$backslash',    '\\'
  lexemes.push n '$backtick1',    ( notBehind '`' ), '`',   ( notAhead '`' )
  lexemes.push n '$backtick3',    ( notBehind '`' ), '```', ( notAhead '`' )
  lexemes.push n '$E_backticks',  /`+/
  lexemes.push n '$digits',       /\d+/
  lexemes.push n '$tag',          /<[^>]+>/
  lexemes.push n '$nl',           /\n/u
  #.........................................................................................................
  lexemes.push n '$ws',           /// [ \u{000b}-\u{000d}
                                        \u{2000}-\u{200a}
                                        \u{0009}\u{0020}\u{0085}\u{00a0}\u{2028}\u{2029}\u{202f}\u{205f}
                                        \u{3000} ]+ ///u
  lexemes.push n '$letters',      /\p{L}+/u
  lexemes.push n '$other',        /./u
  lexemes.push n '$other_digits', /[0-9]+/
  #.........................................................................................................
  pattern       = sticky unicode dotall either lexemes...
  source        = """
    foo `bar` <i>1234\\</i>\n\\
    foo ``bar``
    foo ```bar```
    \\`\x20\x20
    \\"""
  lexer = new Lexer()
  prv_last_idx = 0
  info '^30-33^', 0
  while ( match = source.match pattern )?
    if pattern.lastIndex is prv_last_idx
      warn '^30-33^', GUY.trm.reverse "detected loop, stopping"
      break
    token = lexer._token_from_match prv_last_idx, match
    info '^30-33^', pattern.lastIndex, token
    echo() if token.key is 'nl'
    prv_last_idx = pattern.lastIndex
  return null

#-----------------------------------------------------------------------------------------------------------
demo_flags = ->
  info '^19-1^', unicode dotall /a/
  info '^19-2^', dotall unicode /a/
  info '^19-3^', flags.add 'u', /a/
  try info '^19-4^', flags.add 'u', /./ catch error then warn GUY.trm.reverse error.message
  try info '^19-5^', ( unicode /./ ) catch error then warn GUY.trm.reverse error.message
  info '^19-6^', copy_regex /./, { unicode: true, }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_htmlish = ->
  n       = namedCapture
  modes   = {}
  #.........................................................................................................
  add_lexeme = ( lexemes, mode, name, pattern ) ->
    help '^31-1^', ( to_width "#{mode}:#{name}", 20 ), GUY.trm.white pattern
    lexemes.push n "$#{name}", pattern
    return null
  #.........................................................................................................
  do =>
    lexemes = []
    mode    = 'plain'
    add_lexeme lexemes, mode, 'escchr',       /\\(?<chr>.)/u
    add_lexeme lexemes, mode, 'plain',        suffix '+', charSet.complement /[<`\\]/u
    add_lexeme lexemes, mode, 'start_tag',    /<(?<lslash>\/?)/u
    add_lexeme lexemes, mode, 'E_backticks',  /`+/
    add_lexeme lexemes, mode, 'other',        /./u
    modes[ mode ] = sticky unicode dotall either lexemes...
  #.........................................................................................................
  do =>
    lexemes = []
    mode    = 'tag'
    add_lexeme lexemes, mode, 'escchr',       /\\(?<chr>.)/u
    add_lexeme lexemes, mode, 'stop_tag',     sequence ( notBehind '\\' ), />/u
    add_lexeme lexemes, mode, 'plain',        suffix '+', charSet.complement /[\\]/u
    add_lexeme lexemes, mode, 'other',        /./u
    modes[ mode ] = sticky unicode dotall either lexemes...
  #.........................................................................................................
  probes        = [
    "helo <bold>`world`</bold>"
    "<x v=\\> z=42>"
    "<x v=\\> z=42\\>"
    "a <b"
    "<c"
    "helo \\<bold>`world`</bold>"
    ]
  #.......................................................................................................
  for probe in probes
    lexer   = new Lexer()
    prv_last_idx = 0
    mode    = 'plain' # 'tag'
    stack   = []
    pattern = modes[ mode ]
    tokens  = []
    #.......................................................................................................
    loop
      match = probe.match pattern
      unless match?
        ### TAINT complain if not at end or issue error token ###
        break
      if pattern.lastIndex is prv_last_idx
        if match?
          warn '^31-2^', { match.groups..., }
          warn '^31-3^', token  = lexer._token_from_match prv_last_idx, match, mode
          ### TAINT uses code units, should use codepoints ###
          center = token.stop
          left   = Math.max 0, center - 11
          right  = Math.min probe.length, center + 11
          before = probe[ left ... center ]
          after  = probe[ center + 1 .. right ]
          mid    = probe[ center ]
          warn '^31-7^', { before, mid, after, }
          warn '^31-9^', GUY.trm.reverse "pattern #{rpr token.key} matched empty string; stopping"
        else
          warn '^31-10^', GUY.trm.reverse "nothing matched; detected loop, stopping"
        break
      token = lexer._token_from_match prv_last_idx, match, mode
      tokens.push token
      # info '^31-11^', pattern.lastIndex, token
      #.....................................................................................................
      if token.key.startsWith 'start_'
        stack.push mode
        mode              = token.key.replace 'start_', ''
        old_last_idx      = pattern.lastIndex
        pattern           = modes[ mode ]
        pattern.lastIndex = old_last_idx
      #.....................................................................................................
      else if token.key.startsWith 'stop_'
        # error if stack.length < 1
        mode              = stack.pop()
        old_last_idx      = pattern.lastIndex
        pattern           = modes[ mode ]
        pattern.lastIndex = old_last_idx
      #.....................................................................................................
      echo() if token.key is 'nl'
      prv_last_idx = pattern.lastIndex
    H.tabulate "tokens of #{rpr probe}", tokens
    debug '^31-1^', { stack, mode, prv_last_idx, }
  #.......................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  # demo_1()
  # demo_flags()
  demo_htmlish()


