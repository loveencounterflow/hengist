
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
H                         = require '../../../lib/helpers'
{ Interlex
  compose  }              = require '../../../apps/intertext-lexer'
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
  suffix                } = compose


#-----------------------------------------------------------------------------------------------------------
unicode = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { unicode: true, } else flags.add 'u', x
sticky  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { sticky: true,  } else flags.add 'y', x
dotall  = ( x ) -> if ( x instanceof RegExp ) then copy_regex x, { dotAll: true,  } else flags.add 's', x
dotAll  = dotall

#-----------------------------------------------------------------------------------------------------------
demo_htmlish = ->
  lexer   = new Interlex()
  #.........................................................................................................
  do =>
    ### NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens ###
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'escchr',           pattern: ( /\\(?<chr>.)/u                             ), }
    lexer.add_lexeme { mode, tid: 'text',             pattern: ( suffix '+', charSet.complement /[<`\\?]/u  ), }
    lexer.add_lexeme { mode, tid: 'tag', jump: 'tag', pattern: ( /<(?<lslash>\/?)/u                         ), }
    lexer.add_lexeme { mode, tid: 'E_backticks',      pattern: ( /`+/                                       ), }
    # lexer.add_lexeme mode, 'other',        /./u
  #.........................................................................................................
  do =>
    mode    = 'tag'
    lexer.add_lexeme { mode, tid: 'escchr',         pattern: ( /\\(?<chr>.)/u                           ), }
    lexer.add_lexeme { mode, tid: 'end', jump: '^', pattern: ( />/u                                     ), }
    lexer.add_lexeme { mode, tid: 'text',           pattern: ( suffix '+', charSet.complement /[>\\]/u  ), }
    lexer.add_lexeme { mode, tid: 'other',          pattern: ( /./u                                     ), }
  #.........................................................................................................
  probes        = [
    "helo <bold>`world`</bold>"
    "<x v=\\> z=42>"
    "<x v=\\> z=42\\>"
    "a <b"
    "what? error?"
    "d <"
    "<c"
    "<"
    ""
    "helo \\<bold>`world`</bold>"
    "<b>helo \\<bold>`world`</bold></b>"
    "<i><b></b></i>"
    ]
  #.......................................................................................................
  for probe in probes
    whisper '^31-1^', '————————————————————————————————————————————————————————————————————————'
    tokens    = lexer.run probe
    #.......................................................................................................
    for token, idx in tokens
      continue unless token.key is '$error'
      token.key = GUY.trm.red token.key
    H.tabulate "tokens of #{rpr probe}", tokens
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_paragraphs = ->
  lexer   = new Interlex { dotall: true, }
  #.........................................................................................................
  mode        = 'plain'
  lws_pattern = /// [ \u{2000}-\u{200a}
                      \u{0009}
                      \u{000b}-\u{000d}
                      \u{0020}
                      \u{0085}
                      \u{00a0}
                      \u{2028}
                      \u{2029}
                      \u{202f}
                      \u{205f}
                      \u{3000} ] ///u
  lws = lws_pattern.source
  lexer.add_lexeme { mode, tid: 'nleot', pattern: ( /// (?<! \\ )             # not preceded by backslash
                                                        \n $ ///u    ), }     # newline, then EOT
  lexer.add_lexeme { mode, tid: 'escnl', pattern: ( /\\\n/u    ), }           # newline preced by backslash
  lexer.add_lexeme { mode, tid: 'nls',   pattern: ( /// (?:  #{lws}*          # any linear whitespace
                                                             (?<! \\ ) \n     # newline not preceded by backslash
                                                             #{lws}*          # any linear whitespace
                                                        ){2,}                 # two or more
                                                              ///u ), }
  lexer.add_lexeme { mode, tid: 'p',     pattern: /// (?: \\\n | . )+?        # one or more of escaped newline or any, non-greedy
                                                      (?=                     # preceding...
                                                        \n #{lws}* \n |       #   two or more newlines
                                                        \n $          |       #   or newline at EOT
                                                        $               )     #   or EOT
                                                      ///u, }
  #.........................................................................................................
  probe = """
    first glorious
    paragraph

    \x20\x20
    second slightly longer
    paragraph
    of text

    foo\\
    bar

    x\\

    y

    """
  # lexer._finalize()
  # info '^59-1^', lexer.registry.plain.pattern
  # urge '^59-2^', rpr probe.replace ///#{lws}+\n///mgu, '\n'
  # probe = probe.replace ///#{lws}+$///mgu, ''
  urge '^59-3^', rpr probe
  # re = /(?:.|(?:\n(?!\n)))*\n$\n$/muy
  # urge '^59-3^', re.lastIndex, rpr probe.match re
  # urge '^59-3^', re.lastIndex, rpr probe.match re
  # urge '^59-4^', rpr probe.replace ///\s+?$///mgu, '\n'
  H.tabulate "paragraphs", lexer.run probe
  #.........................................................................................................
  return null


#-----------------------------------------------------------------------------------------------------------
demo_htmlish_with_paragraphs = ->


############################################################################################################
if module is require.main then do =>
  # demo_1()
  # demo_flags()
  # demo_htmlish()
  demo_paragraphs()
  # res = [
  #   /a(?<chr>.).*/u
  #   /.*d(?<chr>.)/u
  #   ]
  # # re_2 = /(?<a>a(?<a𝔛b>.)).*(?<d>d(?<d𝔛b>.))/u
  # for re, idx in res
  #   name = "g#{idx + 1}"
  #   source = re.source.replace /(?<!\\)\(\?<([^>]+)>/gu, "(?<#{name}𝔛$1>"
  #   source = "(?<#{name}>#{source})"
  #   res[ idx ] = new RegExp source, re.flags
  # debug '^45-1^', res
  # debug '^45-1^', re = sequence res...
  # urge { ( 'abcdef'.match re )?.groups..., }

