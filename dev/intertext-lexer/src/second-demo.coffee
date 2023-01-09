
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
{ Interlex }              = require '../../../apps/intertext-lexer'


#-----------------------------------------------------------------------------------------------------------
unicode = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { unicode: true, } else flags.add 'u', x
sticky  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { sticky: true,  } else flags.add 'y', x
dotall  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { dotAll: true,  } else flags.add 's', x
dotAll  = dotall

#-----------------------------------------------------------------------------------------------------------
demo_htmlish = ->
  n       = namedCapture
  modes   = {}
  lexer   = new Interlex()
  #.........................................................................................................
  do =>
    ### NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens ###
    mode    = 'plain'
    lexer.add_lexeme mode, 'escchr',       /\\(?<chr>.)/u
    lexer.add_lexeme mode, 'text',         suffix '+', charSet.complement /[<`\\?]/u
    lexer.add_lexeme mode, 'start_tag',    /<(?<lslash>\/?)/u
    lexer.add_lexeme mode, 'E_backticks',  /`+/
    # lexer.add_lexeme mode, 'other',        /./u
  #.........................................................................................................
  do =>
    mode    = 'tag'
    lexer.add_lexeme mode, 'escchr',       /\\(?<chr>.)/u
    lexer.add_lexeme mode, 'stop_tag',     />/u
    # lexer.add_lexeme mode, 'stop_tag',     either ( sequence ( notBehind '\\' ), />/u ), ( /^>/u )
    lexer.add_lexeme mode, 'text',         suffix '+', charSet.complement /[>\\]/u
    lexer.add_lexeme mode, 'other',        /./u
  #.........................................................................................................
  lexer.finalize()
  #.........................................................................................................
  probes        = [
    # "helo <bold>`world`</bold>"
    # "<x v=\\> z=42>"
    "<x v=\\> z=42\\>"
    "a <b"
    "what? error?"
    "d <"
    "<c"
    "<"
    ""
    # "helo \\<bold>`world`</bold>"
    ]
  #.......................................................................................................
  for probe in probes
    whisper '^31-1^', '————————————————————————————————————————————————————————————————————————'
    lexer.reset()
    pattern   = lexer.registry[ lexer.state.mode ].pattern
    tokens    = []
    max_index = probe.length - 1
    #.......................................................................................................
    loop
      if lexer.state.prv_last_idx > max_index
        ### reached end ###
        tokens.push { mode: lexer.state.mode, key: '$eof', mk: "#{lexer.state.mode}:$eof", \
          value: '', start: max_index + 1, stop: max_index + 1, x: null, }
        break
      match = probe.match pattern
      unless match?
        ### TAINT complain if not at end or issue error token ###
        warn '^31-6^', GUY.trm.reverse "no match"
        tokens.push { mode: lexer.state.mode, key: '$error', mk: "#{lexer.state.mode}:$error", \
          value: '', start: lexer.state.prv_last_idx, stop: lexer.state.prv_last_idx, x: { code: 'nomatch', }, }
        break
      if pattern.lastIndex is lexer.state.prv_last_idx
        if match?
          warn '^31-7^', { match.groups..., }
          warn '^31-8^', token  = lexer._token_from_match lexer.state.prv_last_idx, match, lexer.state.mode
          ### TAINT uses code units, should use codepoints ###
          center = token.stop
          left   = Math.max 0, center - 11
          right  = Math.min probe.length, center + 11
          before = probe[ left ... center ]
          after  = probe[ center + 1 .. right ]
          mid    = probe[ center ]
          warn '^31-9^', { before, mid, after, }
          warn '^31-10^', GUY.trm.reverse "pattern #{rpr token.key} matched empty string; stopping"
        else
          warn '^31-11^', GUY.trm.reverse "nothing matched; detected loop, stopping"
        break
      token = lexer._token_from_match lexer.state.prv_last_idx, match, lexer.state.mode
      tokens.push token
      # info '^31-12^', pattern.lastIndex, token
      #.....................................................................................................
      if token.key.startsWith 'start_'
        lexer.state.stack.push lexer.state.mode
        lexer.state.mode              = token.key.replace 'start_', ''
        old_last_idx      = pattern.lastIndex
        pattern           = lexer.registry[ lexer.state.mode ].pattern
        pattern.lastIndex = old_last_idx
      #.....................................................................................................
      else if token.key.startsWith 'stop_'
        # error if lexer.state.stack.length < 1
        lexer.state.mode              = lexer.state.stack.pop()
        old_last_idx      = pattern.lastIndex
        pattern           = lexer.registry[ lexer.state.mode ].pattern
        pattern.lastIndex = old_last_idx
      #.....................................................................................................
      echo() if token.key is 'nl'
      lexer.state.prv_last_idx = pattern.lastIndex
    debug '^31-13^', lexer.state
    H.tabulate "tokens of #{rpr probe}", tokens
  #.......................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  # demo_1()
  # demo_flags()
  demo_htmlish()


