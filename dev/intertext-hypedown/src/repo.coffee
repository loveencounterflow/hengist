
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/BASICS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


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

#-----------------------------------------------------------------------------------------------------------
new_token = ( ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null ) ->
  ### TAINT recreation of `Interlex::new_token()` ###
  jump      = lexeme?.jump ? null
  { start
    stop  } = token
  return new_datom "^#{mode}", { mode, tid, mk: "#{mode}:#{tid}", jump, name, value, start, stop, x, $: ref, }

#-----------------------------------------------------------------------------------------------------------
@lex_tags = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  #.........................................................................................................
  do =>
    ### NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens ###
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'escchr',           pattern: ( /\\(?<chr>.)/u                             ), }
    lexer.add_lexeme { mode, tid: 'text',             pattern: ( c.suffix '+', c.charSet.complement /[<`\\?]/u  ), }
    lexer.add_lexeme { mode, tid: 'tag', jump: 'tag', pattern: ( /<(?<lslash>\/?)/u                         ), }
    lexer.add_lexeme { mode, tid: 'E_backticks',      pattern: ( /`+/                                       ), }
    # lexer.add_lexeme mode, 'other',        /./u
  #.........................................................................................................
  do =>
    mode    = 'tag'
    lexer.add_lexeme { mode, tid: 'escchr',         pattern: ( /\\(?<chr>.)/u                           ), }
    lexer.add_lexeme { mode, tid: 'end', jump: '^', pattern: ( />/u                                     ), }
    lexer.add_lexeme { mode, tid: 'text',           pattern: ( c.suffix '+', c.charSet.complement /[>\\]/u  ), }
    lexer.add_lexeme { mode, tid: 'other',          pattern: ( /./u                                     ), }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo <bold>`world`</bold>', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 0, stop: 5, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 5, stop: 6, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 6, stop: 10, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 10, stop: 11, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 11, stop: 12, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 12, stop: 17, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 17, stop: 18, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 18, stop: 20, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 20, stop: 24, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 24, stop: 25, x: null, '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 25, stop: 25, x: null, '$key': '^plain' } ], null ]
    [ '<x v=\\> z=42>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'x v=', start: 1, stop: 5, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 5, stop: 7, x: { chr: '>' }, '$key': '^tag' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: ' z=42', start: 7, stop: 12, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 12, stop: 13, x: null, '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 13, stop: 13, x: null, '$key': '^plain' } ], null ]
    [ '<x v=\\> z=42\\>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'x v=', start: 1, stop: 5, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 5, stop: 7, x: { chr: '>' }, '$key': '^tag' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: ' z=42', start: 7, stop: 12, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 12, stop: 14, x: { chr: '>' }, '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 14, stop: 14, x: null, '$key': '^tag' } ], null ]
    [ 'a <b', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'a ', start: 0, stop: 2, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 2, stop: 3, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 3, stop: 4, x: null, '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 4, stop: 4, x: null, '$key': '^tag' } ], null ]
    [ 'what? error?', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'what', start: 0, stop: 4, x: null, '$key': '^plain' }, { mode: 'plain', tid: '$error', mk: 'plain:$error', jump: null, value: '', start: 4, stop: 4, x: { code: 'nomatch' }, '$key': '^plain' } ], null ]
    [ 'd <', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'd ', start: 0, stop: 2, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 2, stop: 3, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 3, stop: 3, x: null, '$key': '^tag' } ], null ]
    [ '<c', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'c', start: 1, stop: 2, x: null, '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 2, stop: 2, x: null, '$key': '^tag' } ], null ]
    [ '<', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 1, stop: 1, x: null, '$key': '^tag' } ], null ]
    [ '', [ { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 0, stop: 0, x: null, '$key': '^plain' } ], null ]
    [ 'helo \\<bold>`world`</bold>', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 0, stop: 5, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'escchr', mk: 'plain:escchr', jump: null, value: '\\<', start: 5, stop: 7, x: { chr: '<' }, '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'bold>', start: 7, stop: 12, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 12, stop: 13, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 13, stop: 18, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 18, stop: 19, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 19, stop: 21, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 21, stop: 25, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 25, stop: 26, x: null, '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 26, stop: 26, x: null, '$key': '^plain' } ], null ]
    [ '<b>helo \\<bold>`world`</bold></b>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 1, stop: 2, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 2, stop: 3, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 3, stop: 8, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'escchr', mk: 'plain:escchr', jump: null, value: '\\<', start: 8, stop: 10, x: { chr: '<' }, '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'bold>', start: 10, stop: 15, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 15, stop: 16, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 16, stop: 21, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 21, stop: 22, x: null, '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 22, stop: 24, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 24, stop: 28, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 28, stop: 29, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 29, stop: 31, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 31, stop: 32, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 32, stop: 33, x: null, '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 33, stop: 33, x: null, '$key': '^plain' } ], null ]
    [ '<i><b></b></i>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'i', start: 1, stop: 2, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 2, stop: 3, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 3, stop: 4, x: { lslash: null }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 4, stop: 5, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 5, stop: 6, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 6, stop: 8, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 8, stop: 9, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 9, stop: 10, x: null, '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 10, stop: 12, x: { lslash: '/' }, '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'i', start: 12, stop: 13, x: null, '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: '^', value: '>', start: 13, stop: 14, x: null, '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 14, stop: 14, x: null, '$key': '^plain' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = lexer.run probe
      H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@parse_md_stars_markup = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
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
  #.........................................................................................................
  probes_and_matchers = [
    [ "*abc*", "<i>abc</i>", ]
    [ "**def**", "<b>def</b>", ]
    [ "***def***", "<b><i>def</i></b>", ]
    [ "**x*def*x**", "<b>x<i>def</i>x</b>", ]
    [ "*x**def**x*", "<i>x<b>def</b>x</i>", ]
    [ "***abc*def**", "<b><i>abc</i>def</b>", ]
    [ "***abc**def*", "<b><i>abc</i></b><i>def</i>", ]
    [ "*x***def**", "<i>x</i><b>def</b>", ]
    [ "**x***def*", "<b>x</b><i>def</i>", ]
    [ "*", "<i>", ]
    [ "**", "<b>", ]
    [ "***", "<b><i>", ]
    ]
  #.........................................................................................................
  $parse_md_stars = ->
    within =
      one:    false
      two:    false
    start_of =
      one:    null
      two:    null
    #.......................................................................................................
    enter = ( mode, start ) ->
      within[   mode ] = true
      start_of[ mode ] = start
      return null
    enter.one = ( start ) -> enter 'one', start
    enter.two = ( start ) -> enter 'two', start
    #.......................................................................................................
    exit = ( mode ) ->
      within[   mode ] = false
      start_of[ mode ] = null
      return null
    exit.one = -> exit 'one'
    exit.two = -> exit 'two'
    #.......................................................................................................
    return ( d, send ) ->
      switch d.tid
        #...................................................................................................
        when 'star1'
          send stamp d
          if within.one then  exit.one();         send new_token '^æ1^', d, 'html', 'tag', 'i', '</i>'
          else                enter.one d.start;  send new_token '^æ2^', d, 'html', 'tag', 'i', '<i>'
        #...................................................................................................
        when 'star2'
          send stamp d
          if within.two
            if within.one
              if start_of.one > start_of.two
                exit.one();         send new_token '^æ3^', d, 'html', 'tag', 'i', '</i>'
                exit.two();         send new_token '^æ4^', d, 'html', 'tag', 'b', '</b>'
                enter.one d.start;  send new_token '^æ5^', d, 'html', 'tag', 'i', '<i>'
              else
                exit.two();         send new_token '^æ6^', d, 'html', 'tag', 'b', '</b>'
            else
              exit.two();         send new_token '^æ7^', d, 'html', 'tag', 'b', '</b>'
          else
            enter.two d.start;  send new_token '^æ8^', d, 'html', 'tag', 'b', '<b>'
        #...................................................................................................
        when 'star3'
          send stamp d
          if within.one
            if within.two
              if start_of.one > start_of.two
                exit.one();       send new_token '^æ9^', d, 'html', 'tag', 'i', '</i>'
                exit.two();       send new_token '^æ10^', d, 'html', 'tag', 'b', '</b>'
              else
                exit.two();       send new_token '^æ11^', d, 'html', 'tag', 'b', '</b>'
                exit.one();       send new_token '^æ12^', d, 'html', 'tag', 'i', '</i>'
            else
              exit.one();         send new_token '^æ13^', d, 'html', 'tag', 'i', '</i>'
              enter.two d.start;  send new_token '^æ14^', d, 'html', 'tag', 'b', '<b>'
          else
            if within.two
              exit.two();         send new_token '^æ15^', d, 'html', 'tag', 'b', '</b>'
              enter.one d.start;  send new_token '^æ16^', d, 'html', 'tag', 'i', '<i>'
            else
              enter.two d.start;  send new_token '^æ17^', d, 'html', 'tag', 'b', '<b>'
              enter.one d.start + 2;  send new_token '^æ18^', { start: d.start + 2, stop: d.stop, }, 'html', 'tag', 'i', '<i>'
        #...................................................................................................
        else send d
      return null
  #.........................................................................................................
  md_lexer  = new_toy_md_lexer 'md'
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      p = new Pipeline()
      p.push ( d, send ) ->
        return send d unless d.tid is 'p'
        send e for e from md_lexer.walk d.value
      p.push $parse_md_stars()
      #.....................................................................................................
      p.send new_token '^æ19^', { start: 0, stop: probe.length, }, 'plain', 'p', null, probe
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null


#-----------------------------------------------------------------------------------------------------------
@markup_with_variable_length = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #---------------------------------------------------------------------------------------------------------
  add_backslash_escape = ( lexer, base_mode ) ->
    lexer.add_lexeme { mode: base_mode,   tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
    return null
  #---------------------------------------------------------------------------------------------------------
  add_catchall = ( lexer, base_mode ) ->
    lexer.add_lexeme { mode: base_mode,   tid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    return null
  #---------------------------------------------------------------------------------------------------------
  add_variable_codespans = ( lexer, base_mode, own_mode ) ->
    backtick_count  = null
    #.......................................................................................................
    entry_handler = ({ token, match, lexer, }) ->
      backtick_count = token.value.length
      return own_mode
    #.......................................................................................................
    exit_handler = ({ token, match, lexer, }) ->
      if token.value.length is backtick_count
        backtick_count = null
        return '^'
      ### TAINT setting `token.mk` should not have to be done manually ###
      token = lets token, ( token ) -> token.tid = 'text'; token.mk = "#{token.mode}:text"
      return { token, }
    #.......................................................................................................
    lexer.add_lexeme { mode: base_mode, tid: 'codespan',  jump: entry_handler,  pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: own_mode,  tid: 'codespan',  jump: exit_handler,   pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: own_mode,  tid: 'text',      jump: null,           pattern:  /(?:\\`|[^`])+/u,   }
    #.......................................................................................................
    return null
  #---------------------------------------------------------------------------------------------------------
  add_star1 = ( lexer, base_mode ) ->
    lexer.add_lexeme { mode: base_mode, tid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
    return null
  #=========================================================================================================
  new_hypedown_lexer = ( mode = 'plain' ) ->
    lexer = new Interlex { dotall: false, }
    add_backslash_escape    lexer, 'base'
    add_star1               lexer, 'base'
    add_variable_codespans  lexer, 'base', 'codespan'
    add_catchall            lexer, 'base'
    return lexer
  #=========================================================================================================
  $parse_md_codespan = ( outer_mode, enter_tid, inner_mode, exit_tid ) ->
    ### TAINT use CFG pattern ###
    ### TAINT use API for `mode:key` IDs ###
    enter_mk  = "#{outer_mode}:#{enter_tid}"
    exit_mk   = "#{inner_mode}:#{exit_tid}"
    return ( d, send ) ->
      switch d.mk
        when enter_mk
          send stamp d
          send new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
        when exit_mk
          send stamp d
          send new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
        else
          send d
      return null
  #---------------------------------------------------------------------------------------------------------
  $parse_md_star = ( star1_tid ) ->
    #.........................................................................................................
    within =
      one:    false
    start_of =
      one:    null
    #.........................................................................................................
    enter = ( mode, start ) ->
      within[   mode ] = true
      start_of[ mode ] = start
      return null
    enter.one = ( start ) -> enter 'one', start
    #.........................................................................................................
    exit = ( mode ) ->
      within[   mode ] = false
      start_of[ mode ] = null
      return null
    exit.one = -> exit 'one'
    #.........................................................................................................
    return ( d, send ) ->
      switch d.tid
        #.....................................................................................................
        when star1_tid
          send stamp d
          if within.one then  exit.one();         send new_token '^æ1^', d, 'html', 'tag', 'i', '</i>'
          else                enter.one d.start;  send new_token '^æ2^', d, 'html', 'tag', 'i', '<i>'
        #.....................................................................................................
        else send d
      return null
  #=========================================================================================================
  new_hypedown_parser = ->
    lexer = new_hypedown_lexer 'md'
    show_lexer_as_table "toy MD lexer", lexer
    p     = new Pipeline()
    p.push ( d, send ) ->
      return send d unless d.tid is 'p'
      send e for e from lexer.walk d.value
    p.push $parse_md_star 'star1'
    p.push $parse_md_codespan 'base', 'codespan', 'codespan', 'codespan'
    p.lexer = lexer
    return p
  #=========================================================================================================
  probes_and_matchers = [
    [ "*abc*", "<i>abc</i>", ]
    [ 'helo `world`!', 'helo <code>world</code>!', null ]
    [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null ]
    [ '*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p = new_hypedown_parser()
      p.send new_token '^æ19^', { start: 0, stop: probe.length, }, 'plain', 'p', null, probe
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
### TAINT use upcoming implementation in `guy` ###
walk_lines = ( text, cfg ) ->
  validate.text text
  template      = { keep_newlines: true, }
  cfg           = { template..., cfg..., }
  pattern       = /.*?(\n|$)/suy
  last_position = text.length - 1
  loop
    break if pattern.lastIndex > last_position
    break unless ( match = text.match pattern )? ### internal error ###
    Y = match[ 0 ]
    Y = Y[ ... Y.length - 1 ] unless cfg.keep_newlines
    yield Y
  R = walk_lines()
  R.reset = -> pattern.lastIndex = 0
  return R


############################################################################################################
if require.main is module then do =>
  # test @
  test @markup_with_variable_length

