
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
new_toy_md_lexer = ( mode = 'plain' ) ->
  lexer   = new Interlex { dotall: false, }
  #.........................................................................................................
  lexer.add_lexeme { mode, tid: 'escchr', pattern: /\\(?<chr>.)/u, }
  lexer.add_lexeme { mode, tid: 'star1',  pattern: /(?<!\*)\*(?!\*)/u, }
  lexer.add_lexeme { mode, tid: 'star2',  pattern: /(?<!\*)\*\*(?!\*)/u, }
  lexer.add_lexeme { mode, tid: 'star3',  pattern: /(?<!\*)\*\*\*(?!\*)/u, }
  lexer.add_lexeme { mode, tid: 'other',  pattern: /[^*]+/u, }
  #.........................................................................................................
  return lexer

#-----------------------------------------------------------------------------------------------------------
new_md_paragraph_lexer = ( mode = 'plain' ) ->
  lexer   = new Interlex { dotall: true, }
  #.........................................................................................................
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
  return lexer

#-----------------------------------------------------------------------------------------------------------
demo_paragraphs = ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  probe = """
    first glorious
    paragraph

    \x20\x20
    **second *slightly*** longer
    paragraph
    of text

    foo\\
    bar

    ***a*b**

    **a*b***

    ***ab***

    x\\

    y

    """
  urge '^59-3^', rpr probe
  p_lexer   = new_md_paragraph_lexer  'p'
  md_lexer  = new_toy_md_lexer        'md'
  H.tabulate "paragraphs", p_lexer.run probe
  #.........................................................................................................
  state =
    within_star1:   false
    within_star2:   false
    start_of_star1: null
    start_of_star2: null
  p = new Pipeline()
  p.push [ probe, ]
  p.push ( source, send ) -> send d for d from p_lexer.walk source
  p.push ( d, send ) ->
    return send d unless d.tid is 'p'
    send e for e from md_lexer.walk d.value
  p.push do ->
    return ( d, send ) ->
      return send d unless d.tid is 'star1'
      if state.within_star1
        send { tid: 'html', value: '</i>' } # TAINT not a standard datom ###
        state.within_star1    = false
        state.start_of_star1  = null
      else
        send { tid: 'html', value: '<i>' } # TAINT not a standard datom ###
        state.within_star1    = true
        state.start_of_star1  = d.start
  p.push do ->
    return ( d, send ) ->
      return send d unless d.tid is 'star2'
      if state.within_star2
        send { tid: 'html', value: '</b>' } # TAINT not a standard datom ###
        state.within_star2    = false
        state.start_of_star2  = null
      else
        send { tid: 'html', value: '<b>' } # TAINT not a standard datom ###
        state.within_star2    = true
        state.start_of_star2  = d.start
  p.push do ->
    return ( d, send ) ->
      return send d unless d.tid is 'star3'
      if state.within_star1
        if state.within_star2
          if state.start_of_star1 <= state.start_of_star2
            send { tid: 'html', value: '</b>' } # TAINT not a standard datom ###
            send { tid: 'html', value: '</i>' } # TAINT not a standard datom ###
          else
            send { tid: 'html', value: '</i>' } # TAINT not a standard datom ###
            send { tid: 'html', value: '</b>' } # TAINT not a standard datom ###
          state.within_star1    = false
          state.start_of_star1  = null
          state.within_star2    = false
          state.start_of_star2  = null
      else
        send { tid: 'html', value: '<xxxxxxxxx>' } # TAINT not a standard datom ###
        state.within_star2 = true
  H.tabulate "md", p.run()
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

