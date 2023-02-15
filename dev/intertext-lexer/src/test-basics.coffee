
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
new_token = ( ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null ) ->
  ### TAINT recreation of `Interlex::new_token()` ###
  jump      = lexeme?.jump ? null
  { start
    stop  } = token
  return new_datom "^#{mode}", { mode, tid, mk: "#{mode}:#{tid}", jump, name, value, start, stop, x, $: ref, }

#-----------------------------------------------------------------------------------------------------------
$parse_md_star = ->
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
      when 'star1'
        send stamp d
        if within.one then  exit.one();         send new_token '^æ1^', d, 'html', 'tag', 'i', '</i>'
        else                enter.one d.start;  send new_token '^æ2^', d, 'html', 'tag', 'i', '<i>'
      #.....................................................................................................
      else send d
    return null

#-----------------------------------------------------------------------------------------------------------
$parse_md_stars = ->
  within =
    one:    false
    two:    false
  start_of =
    one:    null
    two:    null
  #.........................................................................................................
  enter = ( mode, start ) ->
    within[   mode ] = true
    start_of[ mode ] = start
    return null
  enter.one = ( start ) -> enter 'one', start
  enter.two = ( start ) -> enter 'two', start
  #.........................................................................................................
  exit = ( mode ) ->
    within[   mode ] = false
    start_of[ mode ] = null
    return null
  exit.one = -> exit 'one'
  exit.two = -> exit 'two'
  #.........................................................................................................
  return parse_md_stars = ( d, send ) ->
    switch d.tid
      #.....................................................................................................
      when 'star1'
        send stamp d
        if within.one then  exit.one();         send new_token '^æ1^', d, 'html', 'tag', 'i', '</i>'
        else                enter.one d.start;  send new_token '^æ2^', d, 'html', 'tag', 'i', '<i>'
      #.....................................................................................................
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
      #.....................................................................................................
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
      #.....................................................................................................
      else send d
    return null


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@simple = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  T?.eq lexer._metachr, '𝔛'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'xxx',    /123/,          ], /123/,                 ]
    [ [ 'xxx',    /123/ug,        ], /123/ug,               ]
    [ [ 'xxx',    /123/guy,       ], /123/guy,              ]
    [ [ 'xxx',    /(?<a>x.)/gu    ], /(?<xxx𝔛a>x.)/gu,      ]
    [ [ 'escchr', /\\(?<chr>.)/u  ], /\\(?<escchr𝔛chr>.)/u, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      resolve ( lexer._rename_groups probe... ), matcher
  #.........................................................................................................
  # re = /((?<=\\\\)|(?<!\\))\(\?<([^>]+)>/gu
  # debug '^46^', ( rpr /\\(?<x>)/.source ), rpr /\\(?<x>)/.source.replace re, '#'
  # debug '^46^', ( rpr /\(?<x>\)/.source ), rpr /\(?<x>\)/.source.replace re, '#'
  # debug '^46^', ( rpr /(?<x>)/.source   ), rpr /(?<x>)/.source.replace re, '#'
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@using_strings_for_patterns = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  lexer.add_lexeme { mode: 'sql', tid: 'select',  pattern: 'select',    }
  lexer.add_lexeme { mode: 'sql', tid: 'from',    pattern: 'from',      }
  lexer.add_lexeme { mode: 'sql', tid: 'star',    pattern: '*',         }
  lexer.add_lexeme { mode: 'sql', tid: 'ws',      pattern: /\s+/u,      }
  lexer.add_lexeme { mode: 'sql', tid: 'other',   pattern: /\S+/u,      }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'select * from t;', "select:'select'|ws:' '|star:'*'|ws:' '|from:'from'|ws:' '|other:'t;'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # do =>
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      result      = lexer.run probe
      result_rpr  = ( "#{t.tid}:#{rpr t.value}" for t in result ).join '|'
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@using_lexer_without_lexemes = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex }  = require '../../../apps/intertext-lexer'
  probes_and_matchers = [
    [ '', "$eof:''", null ]
    [ 'select * from t;', "$error:''", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # do =>
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new Interlex { end_token: true, }
      result      = lexer.run probe
      result_rpr  = ( "#{t.tid}:#{rpr t.value}" for t in result ).join '|'
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@cannot_return_from_initial_mode = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  get_lexer = ->
    lexer = new Interlex { end_token: true, }
    lexer.add_lexeme { mode: 'base',  tid: 'a',             pattern: 'a', }
    lexer.add_lexeme { mode: 'base',  tid: 'b', jump: 'up', pattern: 'b', }
    lexer.add_lexeme { mode: 'up',    tid: 'c',             pattern: 'c', }
    lexer.add_lexeme { mode: 'up',    tid: 'd', jump: '^',  pattern: 'd', }
    lexer.add_lexeme { mode: 'base',  tid: 'e', jump: '^',  pattern: 'e', }
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'abc', "base:a:'a'|base:b:'b'|up:c:'c'|up:$eof:''", null ]
    [ 'abcde', null, "unable to jump back from initial state" ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # do =>
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      lexer       = get_lexer()
      result      = lexer.run probe
      result_rpr  = ( "#{t.mk}:#{rpr t.value}" for t in result ).join '|'
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@lex_tags = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { end_token: true, }
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
    [ 'helo <bold>`world`</bold>', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 0, stop: 5, x: null, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 5, stop: 6, x: { lslash: null }, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 6, stop: 10, x: null, source: 'helo <bold>`world`</bold>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 10, stop: 11, x: null, source: 'helo <bold>`world`</bold>', '$key': '^tag' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 11, stop: 12, x: null, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 12, stop: 17, x: null, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 17, stop: 18, x: null, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 18, stop: 20, x: { lslash: '/' }, source: 'helo <bold>`world`</bold>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 20, stop: 24, x: null, source: 'helo <bold>`world`</bold>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 24, stop: 25, x: null, source: 'helo <bold>`world`</bold>', '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 25, stop: 25, x: null, source: 'helo <bold>`world`</bold>', '$key': '^plain' } ], null ]
    [ '<x v=\\> z=42>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<x v=\\> z=42>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'x v=', start: 1, stop: 5, x: null, source: '<x v=\\> z=42>', '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 5, stop: 7, x: { chr: '>' }, source: '<x v=\\> z=42>', '$key': '^tag' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: ' z=42', start: 7, stop: 12, x: null, source: '<x v=\\> z=42>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 12, stop: 13, x: null, source: '<x v=\\> z=42>', '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 13, stop: 13, x: null, source: '<x v=\\> z=42>', '$key': '^plain' } ], null ]
    [ '<x v=\\> z=42\\>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<x v=\\> z=42\\>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'x v=', start: 1, stop: 5, x: null, source: '<x v=\\> z=42\\>', '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 5, stop: 7, x: { chr: '>' }, source: '<x v=\\> z=42\\>', '$key': '^tag' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: ' z=42', start: 7, stop: 12, x: null, source: '<x v=\\> z=42\\>', '$key': '^tag' }, { mode: 'tag', tid: 'escchr', mk: 'tag:escchr', jump: null, value: '\\>', start: 12, stop: 14, x: { chr: '>' }, source: '<x v=\\> z=42\\>', '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 14, stop: 14, x: null, source: '<x v=\\> z=42\\>', '$key': '^tag' } ], null ]
    [ 'a <b', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'a ', start: 0, stop: 2, x: null, source: 'a <b', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 2, stop: 3, x: { lslash: null }, source: 'a <b', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 3, stop: 4, x: null, source: 'a <b', '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 4, stop: 4, x: null, source: 'a <b', '$key': '^tag' } ], null ]
    [ 'what? error?', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'what', start: 0, stop: 4, x: null, source: 'what? error?', '$key': '^plain' }, { mode: 'plain', tid: '$error', mk: 'plain:$error', jump: null, value: '', start: 4, stop: 4, x: { code: 'nomatch' }, source: 'what? error?', '$key': '^plain' } ], null ]
    [ 'd <', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'd ', start: 0, stop: 2, x: null, source: 'd <', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 2, stop: 3, x: { lslash: null }, source: 'd <', '$key': '^plain' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 3, stop: 3, x: null, source: 'd <', '$key': '^tag' } ], null ]
    [ '<c', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<c', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'c', start: 1, stop: 2, x: null, source: '<c', '$key': '^tag' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 2, stop: 2, x: null, source: '<c', '$key': '^tag' } ], null ]
    [ '<', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<', '$key': '^plain' }, { mode: 'tag', tid: '$eof', mk: 'tag:$eof', jump: null, value: '', start: 1, stop: 1, x: null, source: '<', '$key': '^tag' } ], null ]
    [ '', [ { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 0, stop: 0, x: null, source: '', '$key': '^plain' } ], null ]
    [ 'helo \\<bold>`world`</bold>', [ { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 0, stop: 5, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'escchr', mk: 'plain:escchr', jump: null, value: '\\<', start: 5, stop: 7, x: { chr: '<' }, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'bold>', start: 7, stop: 12, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 12, stop: 13, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 13, stop: 18, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 18, stop: 19, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 19, stop: 21, x: { lslash: '/' }, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 21, stop: 25, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 25, stop: 26, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 26, stop: 26, x: null, source: 'helo \\<bold>`world`</bold>', '$key': '^plain' } ], null ]
    [ '<b>helo \\<bold>`world`</bold></b>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 1, stop: 2, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 2, stop: 3, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'helo ', start: 3, stop: 8, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'escchr', mk: 'plain:escchr', jump: null, value: '\\<', start: 8, stop: 10, x: { chr: '<' }, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'bold>', start: 10, stop: 15, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 15, stop: 16, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'text', mk: 'plain:text', jump: null, value: 'world', start: 16, stop: 21, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'E_backticks', mk: 'plain:E_backticks', jump: null, value: '`', start: 21, stop: 22, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 22, stop: 24, x: { lslash: '/' }, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'bold', start: 24, stop: 28, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 28, stop: 29, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 29, stop: 31, x: { lslash: '/' }, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 31, stop: 32, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 32, stop: 33, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 33, stop: 33, x: null, source: '<b>helo \\<bold>`world`</bold></b>', '$key': '^plain' } ], null ]
    [ '<i><b></b></i>', [ { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 0, stop: 1, x: { lslash: null }, source: '<i><b></b></i>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'i', start: 1, stop: 2, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 2, stop: 3, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '<', start: 3, stop: 4, x: { lslash: null }, source: '<i><b></b></i>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 4, stop: 5, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 5, stop: 6, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 6, stop: 8, x: { lslash: '/' }, source: '<i><b></b></i>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'b', start: 8, stop: 9, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 9, stop: 10, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'plain', tid: 'tag', mk: 'plain:tag', jump: 'tag', value: '</', start: 10, stop: 12, x: { lslash: '/' }, source: '<i><b></b></i>', '$key': '^plain' }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'i', start: 12, stop: 13, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'tag', tid: 'end', mk: 'tag:end', jump: 'plain', value: '>', start: 13, stop: 14, x: null, source: '<i><b></b></i>', '$key': '^tag' }, { mode: 'plain', tid: '$eof', mk: 'plain:$eof', jump: null, value: '', start: 14, stop: 14, x: null, source: '<i><b></b></i>', '$key': '^plain' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = lexer.run probe
      for token in result
        T?.eq probe[ token.start ... token.stop ], token.value
      H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@lex_tags_with_rpr = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { end_token: true, }
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
    [ 'helo <bold>`world`</bold>', "[plain:text,(0:5),='helo '][plain:tag>tag,(5:6),='<',lslash:null][tag:text,(6:10),='bold'][tag:end>plain,(10:11),='>'][plain:E_backticks,(11:12),='`'][plain:text,(12:17),='world'][plain:E_backticks,(17:18),='`'][plain:tag>tag,(18:20),='</',lslash:'/'][tag:text,(20:24),='bold'][tag:end>plain,(24:25),='>'][plain:$eof,(25:25),='']", null ]
    [ '<x v=\\> z=42>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:5),='x v='][tag:escchr,(5:7),='\\\\>',chr:'>'][tag:text,(7:12),=' z=42'][tag:end>plain,(12:13),='>'][plain:$eof,(13:13),='']", null ]
    [ '<x v=\\> z=42\\>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:5),='x v='][tag:escchr,(5:7),='\\\\>',chr:'>'][tag:text,(7:12),=' z=42'][tag:escchr,(12:14),='\\\\>',chr:'>'][tag:$eof,(14:14),='']", null ]
    [ 'a <b', "[plain:text,(0:2),='a '][plain:tag>tag,(2:3),='<',lslash:null][tag:text,(3:4),='b'][tag:$eof,(4:4),='']", null ]
    [ 'what? error?', "[plain:text,(0:4),='what'][plain:$error,(4:4),='',code:'nomatch']", null ]
    [ 'd <', "[plain:text,(0:2),='d '][plain:tag>tag,(2:3),='<',lslash:null][tag:$eof,(3:3),='']", null ]
    [ '<c', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='c'][tag:$eof,(2:2),='']", null ]
    [ '<', "[plain:tag>tag,(0:1),='<',lslash:null][tag:$eof,(1:1),='']", null ]
    [ '', "[plain:$eof,(0:0),='']", null ]
    [ 'helo \\<bold>`world`</bold>', "[plain:text,(0:5),='helo '][plain:escchr,(5:7),='\\\\<',chr:'<'][plain:text,(7:12),='bold>'][plain:E_backticks,(12:13),='`'][plain:text,(13:18),='world'][plain:E_backticks,(18:19),='`'][plain:tag>tag,(19:21),='</',lslash:'/'][tag:text,(21:25),='bold'][tag:end>plain,(25:26),='>'][plain:$eof,(26:26),='']", null ]
    [ '<b>helo \\<bold>`world`</bold></b>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='b'][tag:end>plain,(2:3),='>'][plain:text,(3:8),='helo '][plain:escchr,(8:10),='\\\\<',chr:'<'][plain:text,(10:15),='bold>'][plain:E_backticks,(15:16),='`'][plain:text,(16:21),='world'][plain:E_backticks,(21:22),='`'][plain:tag>tag,(22:24),='</',lslash:'/'][tag:text,(24:28),='bold'][tag:end>plain,(28:29),='>'][plain:tag>tag,(29:31),='</',lslash:'/'][tag:text,(31:32),='b'][tag:end>plain,(32:33),='>'][plain:$eof,(33:33),='']", null ]
    [ '<i><b></b></i>', "[plain:tag>tag,(0:1),='<',lslash:null][tag:text,(1:2),='i'][tag:end>plain,(2:3),='>'][plain:tag>tag,(3:4),='<',lslash:null][tag:text,(4:5),='b'][tag:end>plain,(5:6),='>'][plain:tag>tag,(6:8),='</',lslash:'/'][tag:text,(8:9),='b'][tag:end>plain,(9:10),='>'][plain:tag>tag,(10:12),='</',lslash:'/'][tag:text,(12:13),='i'][tag:end>plain,(13:14),='>'][plain:$eof,(14:14),='']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve ( lexer.rpr_token token for token from lexer.walk probe ).join ''
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
@parse_line_by_line = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  probe = """
    *the
    first*
    paragraph

    the
    **second** paragraph
    """
  #.........................................................................................................
  new_toy_md_lexer = ( mode = 'plain' ) ->
    lexer   = new Interlex { dotall: false, end_token: false, }
    #.........................................................................................................
    lexer.add_lexeme { mode, tid: 'escchr', pattern: /\\(?<chr>.)/u, }
    lexer.add_lexeme { mode, tid: 'star1',  pattern: /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode, tid: 'star2',  pattern: /(?<!\*)\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, tid: 'star3',  pattern: /(?<!\*)\*\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, tid: 'other',  pattern: /[^*]+/u, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  new_toy_parser = ( lexer ) ->
    p = new Pipeline()
    p.push ( d ) -> urge '^79-1^', rpr d
    p.push ( d, send ) ->
      return send d unless isa.text d
      # send new_token = ref: 'x1', token, mode, tid, name, value, start, stop
      # send new_datom { }
      send e for e from lexer.walk d
    p.push $parse_md_stars()
    return p
  #.........................................................................................................
  md_lexer  = new_toy_md_lexer 'md'
  parser    = new_toy_parser md_lexer
  #.........................................................................................................
  result    = []
  for line from GUY.str.walk_lines probe
    parser.send line
    for d from parser.walk()
      result.push d
      info '^79-10^', rpr d
  #.........................................................................................................
  H.tabulate "parse line by line", result
  # debug '^79-11^', result_rpr = ( md_lexer.rpr_token token for token in result ).join ''
  result_rpr = ( token.value for token in result when not token.$stamped ? false ).join ''
  debug '^79-11^', '\n' + result_rpr
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@parse_nested_codespan = ( T, done ) ->
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
    lexer.add_lexeme { mode: 'plain',   tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   tid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   tid: 'codespan',  jump: 'literal',  pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'plain',   tid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', tid: 'codespan',  jump: '^',        pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'literal', tid: 'text',      jump: null,       pattern:  /(?:\\`|[^`])+/u,   }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ "*abc*", "<i>abc</i>", ]
    [ 'helo `world`!', 'helo <code>world</code>!', null ]
    [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* \\`*bar*\\` baz', '<i>foo</i> \\`<i>bar</i>\\` baz', null ]
    ]
  #.........................................................................................................
  $parse_md_codespan = ->
    return ( d, send ) ->
      if d.mk is 'plain:codespan'
        send stamp d
        return send new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
      if d.mk is 'literal:codespan'
        send stamp d
        return send new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
      send d
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
      p.push $parse_md_star()
      p.push $parse_md_codespan()
      #.....................................................................................................
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
@markup_with_variable_length = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  new_toy_md_lexer = ( mode = 'plain' ) ->
    lexer           = new Interlex { dotall: false, }
    backtick_count  = null
    #.......................................................................................................
    jpcs = ({ token, match, lexer, }) ->
      # debug '^35-1^', match
      backtick_count = token.value.length
      return 'literal'
    #.......................................................................................................
    jlcs = ({ token, match, lexer, }) ->
      # debug '^35-3^', match
      if token.value.length is backtick_count
        backtick_count = null
        return '^'
      ### TAINT setting `token.mk` should not have to be done manually ###
      token = lets token, ( token ) -> token.tid = 'text'; token.mk = "#{token.mode}:text"
      # debug '^345^', token
      return { token, }
    #.......................................................................................................
    lexer.add_lexeme { mode: 'plain',   tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   tid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   tid: 'codespan',  jump: jpcs,       pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'plain',   tid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', tid: 'codespan',  jump: jlcs,       pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'literal', tid: 'text',      jump: null,       pattern:  /(?:\\`|[^`])+/u,   }
    #.......................................................................................................
    return lexer
  #.........................................................................................................
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
  $parse_md_codespan = ->
    return ( d, send ) ->
      switch d.mk
        when  'plain:codespan'
          send stamp d
          send new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
        when 'literal:codespan'
          send stamp d
          send new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
        else
          send d
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
      p.push $parse_md_star()
      p.push $parse_md_codespan()
      #.....................................................................................................
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
@match_with_lookbehind = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { dotall: true, }
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'b_after_a',        pattern: ( /(?<=a)b/u           ), }
    # lexer.add_lexeme { mode, tid: 'other_a',          pattern: ( /a/u                             ), }
    # lexer.add_lexeme { mode, tid: 'other_b',          pattern: ( /b/u                             ), }
    lexer.add_lexeme { mode, tid: 'other',            pattern: ( /((?<!a)b|[^b])+/u   ), }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foobar abracadabra', "[plain:other,(0:8),='foobar a'][plain:b_after_a,(8:9),='b'][plain:other,(9:15),='racada'][plain:b_after_a,(15:16),='b'][plain:other,(16:18),='ra']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result      = lexer.run probe
      result_rpr  = ( lexer.rpr_token token for token in result ).join ''
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@match_start_of_line = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { dotall: true, end_token: true, }
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'b_after_nl',       pattern: ( /(?<=\n)b/u          ), }
    lexer.add_lexeme { mode, tid: 'b_first',          pattern: ( /^b/u                ), }
    lexer.add_lexeme { mode, tid: 'other',            pattern: ( /((?<!\n)b|[^b])+/u  ), }
  #.........................................................................................................
  probes_and_matchers = [
    # [ "helo\nworld", null, ]
    # [ "above\n# headline\n\nbelow", null, ]
    [ 'foobar \nbracad\nbra', "[plain:other,(0:8),='foobar \\n'][plain:b_after_nl,(8:9),='b'][plain:other,(9:15),='racad\\n'][plain:b_after_nl,(15:16),='b'][plain:other,(16:18),='ra'][plain:$eof,(18:18),='']", null ]
    [ 'b', "[plain:b_first,(0:1),='b'][plain:$eof,(1:1),='']", null ]
    [ '\nb', "[plain:other,(0:1),='\\n'][plain:b_after_nl,(1:2),='b'][plain:$eof,(2:2),='']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result      = lexer.run probe
      result_rpr  = ( lexer.rpr_token token for token in result ).join ''
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@match_end_of_line = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, tid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, tid: 'word',     pattern: ( /\S+/u ), }
  #.........................................................................................................
  probe = """
    A line by line
    lexing
    probe\x20\x20\x20
    """
  matcher = [
    "[plain:word,(0:1),='A']"
    "[plain:ws,(1:2),=' ']"
    "[plain:word,(2:6),='line']"
    "[plain:ws,(6:7),=' ']"
    "[plain:word,(7:9),='by']"
    "[plain:ws,(9:10),=' ']"
    "[plain:word,(10:14),='line']"
    "[plain:eol,(14:14),='']"
    "[plain:word,(0:6),='lexing']"
    "[plain:eol,(6:6),='']"
    "[plain:word,(0:5),='probe']"
    "[plain:eol,(5:5),='']" ]
  #.........................................................................................................
  result      = []
  result_rpr  = []
  for line from GUY.str.walk_lines probe
    for token from lexer.walk line
      result.push token
      result_rpr.push lexer.rpr_token token
  #.........................................................................................................
  T?.eq result_rpr, matcher
  H.tabulate ( rpr probe ), result
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  test @
  # @using_strings_for_patterns()
  # test @using_strings_for_patterns
  # @cannot_return_from_initial_mode()
  # test @cannot_return_from_initial_mode
  # test @using_lexer_without_lexemes
  # test @lex_tags
  # test @lex_tags_with_rpr
  # @parse_line_by_line()
  # test @parse_line_by_line
  # @match_end_of_line()
  # test @match_end_of_line
  # test @parse_line_by_line
  # @parse_md_stars_markup()
  # test @parse_md_stars_markup
  # test @parse_nested_codespan
  # @markup_with_variable_length()
  # test @markup_with_variable_length
  # @_demo_markup_with_variable_length()
  # test @match_start_of_line
  # test @match_with_lookbehind
