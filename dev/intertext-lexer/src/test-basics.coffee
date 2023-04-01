
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
H2                        = require './helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM




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
  lexer.add_lexeme { mode: 'sql', lxid: 'select',  pattern: 'select',    }
  lexer.add_lexeme { mode: 'sql', lxid: 'from',    pattern: 'from',      }
  lexer.add_lexeme { mode: 'sql', lxid: 'star',    pattern: '*',         }
  lexer.add_lexeme { mode: 'sql', lxid: 'ws',      pattern: /\s+/u,      }
  lexer.add_lexeme { mode: 'sql', lxid: 'other',   pattern: /\S+/u,      }
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
      result_rpr  = ( "#{lexer.get_token_lxid t}:#{rpr t.value}" for t in result ).join '|'
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
      result_rpr  = ( "#{lexer.get_token_lxid t}:#{rpr t.value}" for t in result ).join '|'
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
    lexer.add_lexeme { mode: 'base',  lxid: 'a',             pattern: 'a', }
    lexer.add_lexeme { mode: 'base',  lxid: 'b', jump: 'up[', pattern: 'b', }
    lexer.add_lexeme { mode: 'up',    lxid: 'c',             pattern: 'c', }
    lexer.add_lexeme { mode: 'up',    lxid: 'd', jump: '.]',  pattern: 'd', }
    lexer.add_lexeme { mode: 'base',  lxid: 'e', jump: '.]',  pattern: 'e', }
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
      result_rpr  = ( "#{t.$key}:#{rpr t.value}" for t in result ).join '|'
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@lex_tags = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer = new Interlex { split: false, end_token: true, }
    do =>
      ### NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens ###
      mode    = 'plain'
      lexer.add_lexeme { mode, lxid: 'escchr',           pattern: ( /\\(?<chr>.)/u                             ), }
      lexer.add_lexeme { mode, lxid: 'text',             pattern: ( c.suffix '+', c.charSet.complement /[<`\\?]/u  ), }
      lexer.add_lexeme { mode, lxid: 'tag', jump: 'tag[', pattern: ( /<(?<lslash>\/?)/u                         ), }
      lexer.add_lexeme { mode, lxid: 'E_backticks',      pattern: ( /`+/                                       ), }
      # lexer.add_lexeme mode, 'other',        /./u
    #.........................................................................................................
    do =>
      mode    = 'tag'
      lexer.add_lexeme { mode, lxid: 'escchr',         pattern: ( /\\(?<chr>.)/u                           ), }
      lexer.add_lexeme { mode, lxid: 'end', jump: '.]', pattern: ( />/u                                     ), }
      lexer.add_lexeme { mode, lxid: 'text',           pattern: ( c.suffix '+', c.charSet.complement /[>\\]/u  ), }
      lexer.add_lexeme { mode, lxid: 'other',          pattern: ( /./u                                     ), }
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo <bold>`world`</bold>', [ { '$key': 'plain:text', jump: null, value: 'helo ', lnr1: 0, x1: 0, lnr2: 0, x2: 5, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 5, lnr2: 0, x2: 6, data: { lslash: null }, source: 'helo <bold>`world`</bold>' }, { '$key': 'tag:text', jump: null, value: 'bold', lnr1: 0, x1: 6, lnr2: 0, x2: 10, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 10, lnr2: 0, x2: 11, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 11, lnr2: 0, x2: 12, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:text', jump: null, value: 'world', lnr1: 0, x1: 12, lnr2: 0, x2: 17, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 17, lnr2: 0, x2: 18, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 18, lnr2: 0, x2: 20, data: { lslash: '/' }, source: 'helo <bold>`world`</bold>' }, { '$key': 'tag:text', jump: null, value: 'bold', lnr1: 0, x1: 20, lnr2: 0, x2: 24, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 24, lnr2: 0, x2: 25, data: null, source: 'helo <bold>`world`</bold>' }, { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 25, lnr2: 0, x2: 25, data: null, source: 'helo <bold>`world`</bold>' } ], null ]
    [ '<x v=\\> z=42>', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<x v=\\> z=42>' }, { '$key': 'tag:text', jump: null, value: 'x v=', lnr1: 0, x1: 1, lnr2: 0, x2: 5, data: null, source: '<x v=\\> z=42>' }, { '$key': 'tag:escchr', jump: null, value: '\\>', lnr1: 0, x1: 5, lnr2: 0, x2: 7, data: { chr: '>' }, source: '<x v=\\> z=42>' }, { '$key': 'tag:text', jump: null, value: ' z=42', lnr1: 0, x1: 7, lnr2: 0, x2: 12, data: null, source: '<x v=\\> z=42>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 12, lnr2: 0, x2: 13, data: null, source: '<x v=\\> z=42>' }, { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 13, lnr2: 0, x2: 13, data: null, source: '<x v=\\> z=42>' } ], null ]
    [ '<x v=\\> z=42\\>', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<x v=\\> z=42\\>' }, { '$key': 'tag:text', jump: null, value: 'x v=', lnr1: 0, x1: 1, lnr2: 0, x2: 5, data: null, source: '<x v=\\> z=42\\>' }, { '$key': 'tag:escchr', jump: null, value: '\\>', lnr1: 0, x1: 5, lnr2: 0, x2: 7, data: { chr: '>' }, source: '<x v=\\> z=42\\>' }, { '$key': 'tag:text', jump: null, value: ' z=42', lnr1: 0, x1: 7, lnr2: 0, x2: 12, data: null, source: '<x v=\\> z=42\\>' }, { '$key': 'tag:escchr', jump: null, value: '\\>', lnr1: 0, x1: 12, lnr2: 0, x2: 14, data: { chr: '>' }, source: '<x v=\\> z=42\\>' }, { '$key': 'tag:$eof', jump: null, value: '', lnr1: 0, x1: 14, lnr2: 0, x2: 14, data: null, source: '<x v=\\> z=42\\>' } ], null ]
    [ 'a <b', [ { '$key': 'plain:text', jump: null, value: 'a ', lnr1: 0, x1: 0, lnr2: 0, x2: 2, data: null, source: 'a <b' }, { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 2, lnr2: 0, x2: 3, data: { lslash: null }, source: 'a <b' }, { '$key': 'tag:text', jump: null, value: 'b', lnr1: 0, x1: 3, lnr2: 0, x2: 4, data: null, source: 'a <b' }, { '$key': 'tag:$eof', jump: null, value: '', lnr1: 0, x1: 4, lnr2: 0, x2: 4, data: null, source: 'a <b' } ], null ]
    [ 'what? error?', [ { '$key': 'plain:text', jump: null, value: 'what', lnr1: 0, x1: 0, lnr2: 0, x2: 4, data: null, source: 'what? error?' }, { '$key': 'plain:$error', jump: null, value: '', lnr1: 0, x1: 4, lnr2: 0, x2: 4, data: { code: 'nomatch' }, source: 'what? error?' } ], null ]
    [ 'd <', [ { '$key': 'plain:text', jump: null, value: 'd ', lnr1: 0, x1: 0, lnr2: 0, x2: 2, data: null, source: 'd <' }, { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 2, lnr2: 0, x2: 3, data: { lslash: null }, source: 'd <' }, { '$key': 'tag:$eof', jump: null, value: '', lnr1: 0, x1: 3, lnr2: 0, x2: 3, data: null, source: 'd <' } ], null ]
    [ '<c', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<c' }, { '$key': 'tag:text', jump: null, value: 'c', lnr1: 0, x1: 1, lnr2: 0, x2: 2, data: null, source: '<c' }, { '$key': 'tag:$eof', jump: null, value: '', lnr1: 0, x1: 2, lnr2: 0, x2: 2, data: null, source: '<c' } ], null ]
    [ '<', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<' }, { '$key': 'tag:$eof', jump: null, value: '', lnr1: 0, x1: 1, lnr2: 0, x2: 1, data: null, source: '<' } ], null ]
    [ '', [ { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 0, lnr2: 0, x2: 0, data: null, source: '' } ], null ]
    [ 'helo \\<bold>`world`</bold>', [ { '$key': 'plain:text', jump: null, value: 'helo ', lnr1: 0, x1: 0, lnr2: 0, x2: 5, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:escchr', jump: null, value: '\\<', lnr1: 0, x1: 5, lnr2: 0, x2: 7, data: { chr: '<' }, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:text', jump: null, value: 'bold>', lnr1: 0, x1: 7, lnr2: 0, x2: 12, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 12, lnr2: 0, x2: 13, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:text', jump: null, value: 'world', lnr1: 0, x1: 13, lnr2: 0, x2: 18, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 18, lnr2: 0, x2: 19, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 19, lnr2: 0, x2: 21, data: { lslash: '/' }, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'tag:text', jump: null, value: 'bold', lnr1: 0, x1: 21, lnr2: 0, x2: 25, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 25, lnr2: 0, x2: 26, data: null, source: 'helo \\<bold>`world`</bold>' }, { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 26, lnr2: 0, x2: 26, data: null, source: 'helo \\<bold>`world`</bold>' } ], null ]
    [ '<b>helo \\<bold>`world`</bold></b>', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:text', jump: null, value: 'b', lnr1: 0, x1: 1, lnr2: 0, x2: 2, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 2, lnr2: 0, x2: 3, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:text', jump: null, value: 'helo ', lnr1: 0, x1: 3, lnr2: 0, x2: 8, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:escchr', jump: null, value: '\\<', lnr1: 0, x1: 8, lnr2: 0, x2: 10, data: { chr: '<' }, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:text', jump: null, value: 'bold>', lnr1: 0, x1: 10, lnr2: 0, x2: 15, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 15, lnr2: 0, x2: 16, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:text', jump: null, value: 'world', lnr1: 0, x1: 16, lnr2: 0, x2: 21, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:E_backticks', jump: null, value: '`', lnr1: 0, x1: 21, lnr2: 0, x2: 22, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 22, lnr2: 0, x2: 24, data: { lslash: '/' }, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:text', jump: null, value: 'bold', lnr1: 0, x1: 24, lnr2: 0, x2: 28, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 28, lnr2: 0, x2: 29, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 29, lnr2: 0, x2: 31, data: { lslash: '/' }, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:text', jump: null, value: 'b', lnr1: 0, x1: 31, lnr2: 0, x2: 32, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 32, lnr2: 0, x2: 33, data: null, source: '<b>helo \\<bold>`world`</bold></b>' }, { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 33, lnr2: 0, x2: 33, data: null, source: '<b>helo \\<bold>`world`</bold></b>' } ], null ]
    [ '<i><b></b></i>', [ { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 0, lnr2: 0, x2: 1, data: { lslash: null }, source: '<i><b></b></i>' }, { '$key': 'tag:text', jump: null, value: 'i', lnr1: 0, x1: 1, lnr2: 0, x2: 2, data: null, source: '<i><b></b></i>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 2, lnr2: 0, x2: 3, data: null, source: '<i><b></b></i>' }, { '$key': 'plain:tag', jump: 'tag', value: '<', lnr1: 0, x1: 3, lnr2: 0, x2: 4, data: { lslash: null }, source: '<i><b></b></i>' }, { '$key': 'tag:text', jump: null, value: 'b', lnr1: 0, x1: 4, lnr2: 0, x2: 5, data: null, source: '<i><b></b></i>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 5, lnr2: 0, x2: 6, data: null, source: '<i><b></b></i>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 6, lnr2: 0, x2: 8, data: { lslash: '/' }, source: '<i><b></b></i>' }, { '$key': 'tag:text', jump: null, value: 'b', lnr1: 0, x1: 8, lnr2: 0, x2: 9, data: null, source: '<i><b></b></i>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 9, lnr2: 0, x2: 10, data: null, source: '<i><b></b></i>' }, { '$key': 'plain:tag', jump: 'tag', value: '</', lnr1: 0, x1: 10, lnr2: 0, x2: 12, data: { lslash: '/' }, source: '<i><b></b></i>' }, { '$key': 'tag:text', jump: null, value: 'i', lnr1: 0, x1: 12, lnr2: 0, x2: 13, data: null, source: '<i><b></b></i>' }, { '$key': 'tag:end', jump: 'plain', value: '>', lnr1: 0, x1: 13, lnr2: 0, x2: 14, data: null, source: '<i><b></b></i>' }, { '$key': 'plain:$eof', jump: null, value: '', lnr1: 0, x1: 14, lnr2: 0, x2: 14, data: null, source: '<i><b></b></i>' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_lexer()
      result  = lexer.run probe
      for token in result
        T?.eq probe[ token.x1 ... token.x2 ], token.value
      # H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@lex_tags_with_rpr = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  new_lexer = ->
    lexer = new Interlex { split: false, end_token: true, }
    #.........................................................................................................
    do =>
      ### NOTE arbitrarily forbidding question marks and not using fallback token to test for error tokens ###
      mode    = 'plain'
      lexer.add_lexeme { mode, lxid: 'escchr',           pattern: ( /\\(?<chr>.)/u                             ), }
      lexer.add_lexeme { mode, lxid: 'text',             pattern: ( c.suffix '+', c.charSet.complement /[<`\\?]/u  ), }
      lexer.add_lexeme { mode, lxid: 'tag', jump: 'tag[', pattern: ( /<(?<lslash>\/?)/u                         ), }
      lexer.add_lexeme { mode, lxid: 'E_backticks',      pattern: ( /`+/                                       ), }
      # lexer.add_lexeme mode, 'other',        /./u
    #.........................................................................................................
    do =>
      mode    = 'tag'
      lexer.add_lexeme { mode, lxid: 'escchr',         pattern: ( /\\(?<chr>.)/u                           ), }
      lexer.add_lexeme { mode, lxid: 'end', jump: '.]', pattern: ( />/u                                     ), }
      lexer.add_lexeme { mode, lxid: 'text',           pattern: ( c.suffix '+', c.charSet.complement /[>\\]/u  ), }
      lexer.add_lexeme { mode, lxid: 'other',          pattern: ( /./u                                     ), }
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo <bold>`world`</bold>', "[plain:text,(0:0)(0:5),='helo '][plain:tag<tag[>,(0:5)(0:6),='<',lslash:null][tag:text,(0:6)(0:10),='bold'][tag:end<.]>,(0:10)(0:11),='>'][plain:E_backticks,(0:11)(0:12),='`'][plain:text,(0:12)(0:17),='world'][plain:E_backticks,(0:17)(0:18),='`'][plain:tag<tag[>,(0:18)(0:20),='</',lslash:'/'][tag:text,(0:20)(0:24),='bold'][tag:end<.]>,(0:24)(0:25),='>'][plain:$eof,(0:25)(0:25),='']", null ]
    [ '<x v=\\> z=42>', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:5),='x v='][tag:escchr,(0:5)(0:7),='\\\\>',chr:'>'][tag:text,(0:7)(0:12),=' z=42'][tag:end<.]>,(0:12)(0:13),='>'][plain:$eof,(0:13)(0:13),='']", null ]
    [ '<x v=\\> z=42\\>', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:5),='x v='][tag:escchr,(0:5)(0:7),='\\\\>',chr:'>'][tag:text,(0:7)(0:12),=' z=42'][tag:escchr,(0:12)(0:14),='\\\\>',chr:'>'][tag:$eof,(0:14)(0:14),='']", null ]
    [ 'a <b', "[plain:text,(0:0)(0:2),='a '][plain:tag<tag[>,(0:2)(0:3),='<',lslash:null][tag:text,(0:3)(0:4),='b'][tag:$eof,(0:4)(0:4),='']", null ]
    [ 'what? error?', "[plain:text,(0:0)(0:4),='what'][plain:$error,(0:4)(0:4),='',code:'nomatch']", null ]
    [ 'd <', "[plain:text,(0:0)(0:2),='d '][plain:tag<tag[>,(0:2)(0:3),='<',lslash:null][tag:$eof,(0:3)(0:3),='']", null ]
    [ '<c', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='c'][tag:$eof,(0:2)(0:2),='']", null ]
    [ '<', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:$eof,(0:1)(0:1),='']", null ]
    [ '', "[plain:$eof,(0:0)(0:0),='']", null ]
    [ 'helo \\<bold>`world`</bold>', "[plain:text,(0:0)(0:5),='helo '][plain:escchr,(0:5)(0:7),='\\\\<',chr:'<'][plain:text,(0:7)(0:12),='bold>'][plain:E_backticks,(0:12)(0:13),='`'][plain:text,(0:13)(0:18),='world'][plain:E_backticks,(0:18)(0:19),='`'][plain:tag<tag[>,(0:19)(0:21),='</',lslash:'/'][tag:text,(0:21)(0:25),='bold'][tag:end<.]>,(0:25)(0:26),='>'][plain:$eof,(0:26)(0:26),='']", null ]
    [ '<b>helo \\<bold>`world`</bold></b>', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='b'][tag:end<.]>,(0:2)(0:3),='>'][plain:text,(0:3)(0:8),='helo '][plain:escchr,(0:8)(0:10),='\\\\<',chr:'<'][plain:text,(0:10)(0:15),='bold>'][plain:E_backticks,(0:15)(0:16),='`'][plain:text,(0:16)(0:21),='world'][plain:E_backticks,(0:21)(0:22),='`'][plain:tag<tag[>,(0:22)(0:24),='</',lslash:'/'][tag:text,(0:24)(0:28),='bold'][tag:end<.]>,(0:28)(0:29),='>'][plain:tag<tag[>,(0:29)(0:31),='</',lslash:'/'][tag:text,(0:31)(0:32),='b'][tag:end<.]>,(0:32)(0:33),='>'][plain:$eof,(0:33)(0:33),='']", null ]
    [ '<i><b></b></i>', "[plain:tag<tag[>,(0:0)(0:1),='<',lslash:null][tag:text,(0:1)(0:2),='i'][tag:end<.]>,(0:2)(0:3),='>'][plain:tag<tag[>,(0:3)(0:4),='<',lslash:null][tag:text,(0:4)(0:5),='b'][tag:end<.]>,(0:5)(0:6),='>'][plain:tag<tag[>,(0:6)(0:8),='</',lslash:'/'][tag:text,(0:8)(0:9),='b'][tag:end<.]>,(0:9)(0:10),='>'][plain:tag<tag[>,(0:10)(0:12),='</',lslash:'/'][tag:text,(0:12)(0:13),='i'][tag:end<.]>,(0:13)(0:14),='>'][plain:$eof,(0:14)(0:14),='']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_lexer()
      result  = []
      for token from lexer.walk probe
        result.push token
      # H.tabulate ( rpr probe ), result
      resolve ( lexer.rpr_token token for token in result ).join ''
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
  new_toy_md_lexer = ->
    lexer   = new Interlex { dotall: false, }
    mode    = 'plain'
    #.........................................................................................................
    lexer.add_lexeme { mode, lxid: 'escchr', pattern: /\\(?<chr>.)/u, }
    lexer.add_lexeme { mode, lxid: 'star1',  pattern: /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'star2',  pattern: /(?<!\*)\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'star3',  pattern: /(?<!\*)\*\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'other',  pattern: /[^*]+/u, }
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
  md_lexer  = new_toy_md_lexer()
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      p = new Pipeline()
      p.push ( source, send ) ->
        send e for e from md_lexer.walk source
      p.push H2.$parse_md_stars()
      #.....................................................................................................
      p.send probe
      result      = p.run_and_stop()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      # H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@parse_string_literals = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: 'dq1[',          pattern: /(?<!")"(?!")/u, }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, }
      lexer.add_lexeme { mode, lxid: 'other',  jump: null,           pattern: /[^"]+/u, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, }
      lexer.add_lexeme { mode, lxid: 'text',   jump: null,           pattern: /[^"]+/u, }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '.]',            pattern: /"/u, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:other', value: 'helo' }, { $key: 'plain:nl', value: '' } ], null ]
    [ 'helo "world"', [ { $key: 'plain:other', value: 'helo ' }, { $key: 'plain:dq1', value: '"' }, { $key: 'dq1:text', value: 'world' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:nl', value: '' } ], null ]
    [ 'helo "everyone\nout there"!', [ { $key: 'plain:other', value: 'helo ' }, { $key: 'plain:dq1', value: '"' }, { $key: 'dq1:text', value: 'everyone' }, { $key: 'dq1:nl', value: '' }, { $key: 'dq1:text', value: 'out there' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:other', value: '!' }, { $key: 'plain:nl', value: '' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      result      = []
      for token from lexer.walk probe
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result
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
    lexer.add_lexeme { mode, lxid: 'escchr', pattern: /\\(?<chr>.)/u, }
    lexer.add_lexeme { mode, lxid: 'star1',  pattern: /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'star2',  pattern: /(?<!\*)\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'star3',  pattern: /(?<!\*)\*\*\*(?!\*)/u, }
    lexer.add_lexeme { mode, lxid: 'other',  pattern: /[^*]+/u, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  new_toy_parser = ( lexer ) ->
    p = new Pipeline()
    p.push ( d ) -> urge '^79-1^', rpr d
    p.push ( d, send ) ->
      return send d unless isa.text d
      # send H2.new_token = ref: 'x1', token, mode, lxid, name, value, x1, x2
      # send new_datom { }
      send e for e from lexer.walk d
    p.push H2.$parse_md_stars()
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
  new_toy_md_lexer = ->
    lexer   = new Interlex { dotall: false, }
    mode    = 'plain'
    #.........................................................................................................
    lexer.add_lexeme { mode: 'plain',   lxid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   lxid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   lxid: 'codespan',  jump: 'literal[',  pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'plain',   lxid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', lxid: 'codespan',  jump: '.]',        pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'literal', lxid: 'text',      jump: null,       pattern:  /(?:\\`|[^`])+/u,   }
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
      if d.$key is 'plain:codespan'
        send stamp d
        return send H2.new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
      if d.$key is 'literal:codespan'
        send stamp d
        return send H2.new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
      send d
      return null
  #.........................................................................................................
  md_lexer  = new_toy_md_lexer()
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      p = new Pipeline()
      p.push ( source, send ) ->
        send e for e from md_lexer.walk source
      p.push H2.$parse_md_star()
      p.push $parse_md_codespan()
      #.....................................................................................................
      p.send probe
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
  lexer = new Interlex { split: false, dotall: true, }
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, lxid: 'b_after_a',        pattern: ( /(?<=a)b/u           ), }
    # lexer.add_lexeme { mode, lxid: 'other_a',          pattern: ( /a/u                             ), }
    # lexer.add_lexeme { mode, lxid: 'other_b',          pattern: ( /b/u                             ), }
    lexer.add_lexeme { mode, lxid: 'other',            pattern: ( /((?<!a)b|[^b])+/u   ), }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foobar abracadabra', "[plain:other,(0:0)(0:8),='foobar a'][plain:b_after_a,(0:8)(0:9),='b'][plain:other,(0:9)(0:15),='racada'][plain:b_after_a,(0:15)(0:16),='b'][plain:other,(0:16)(0:18),='ra']", null ]
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
  lexer = new Interlex { split: false, dotall: true, end_token: true, }
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, lxid: 'b_after_nl',       pattern: ( /(?<=\n)b/u          ), }
    lexer.add_lexeme { mode, lxid: 'b_first',          pattern: ( /^b/u                ), }
    lexer.add_lexeme { mode, lxid: 'other',            pattern: ( /((?<!\n)b|[^b])+/u  ), }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foobar \nbracad\nbra', "[plain:other,(0:0)(0:8),='foobar \\n'][plain:b_after_nl,(0:8)(0:9),='b'][plain:other,(0:9)(0:15),='racad\\n'][plain:b_after_nl,(0:15)(0:16),='b'][plain:other,(0:16)(0:18),='ra'][plain:$eof,(0:18)(0:18),='']", null ]
    [ 'b', "[plain:b_first,(0:0)(0:1),='b'][plain:$eof,(0:1)(0:1),='']", null ]
    [ '\nb', "[plain:other,(0:0)(0:1),='\\n'][plain:b_after_nl,(0:1)(0:2),='b'][plain:$eof,(0:2)(0:2),='']", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result      = lexer.run probe
      result_rpr  = ( lexer.rpr_token token for token in result ).join ''
      # H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@match_end_of_line = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { split: false, }
  #.........................................................................................................
  do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, lxid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, lxid: 'word',     pattern: ( /\S+/u ), }
  #.........................................................................................................
  probe = """
    A line by line
    lexing
    probe\x20\x20\x20
    """
  matcher = [
    "[plain:word,(0:0)(0:1),='A']",
    "[plain:ws,(0:1)(0:2),=' ']",
    "[plain:word,(0:2)(0:6),='line']",
    "[plain:ws,(0:6)(0:7),=' ']",
    "[plain:word,(0:7)(0:9),='by']",
    "[plain:ws,(0:9)(0:10),=' ']",
    "[plain:word,(0:10)(0:14),='line']",
    "[plain:eol,(0:14)(0:14),='']",
    "[plain:word,(0:0)(0:6),='lexing']",
    "[plain:eol,(0:6)(0:6),='']",
    "[plain:word,(0:0)(0:5),='probe']",
    "[plain:eol,(0:5)(0:5),='']" ]
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

#-----------------------------------------------------------------------------------------------------------
@cannot_redeclare_lexeme = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  lexer = new Interlex()
  T?.throws /lexeme plain:eol already exists/, =>
  # do =>
    mode    = 'plain'
    lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@allow_value_and_empty_value = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  mode = 'plain'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { mode, lxid: 'eol',             empty_value: '\n',  pattern: /$/u, }, '', ], [ { $key: 'plain:eol', value: '\n' } ], null, ]
    [ [ { mode, lxid: 'eol',                                 pattern: /$/u, }, '', ], [ { $key: 'plain:eol', value: '' } ], null, ]
    [ [ { mode, lxid: 'eol', value: '\n',                    pattern: /$/u, }, '', ], [ { $key: 'plain:eol', value: '\n' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u',                     pattern: 'x', }, 'x', ], [ { $key: 'plain:x',   value: 'u' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u',                     pattern: /x/u, }, 'x', ], [ { $key: 'plain:x',   value: 'u' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u', empty_value: '!!!', pattern: /x|/u, }, '', ], [ { $key: 'plain:x',   value: '!!!' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u', empty_value: '!!!', pattern: /x/u, }, 'x', ], [ { $key: 'plain:x',   value: 'u' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u',                     pattern: /x|/u, }, 'x', ], [ { $key: 'plain:x',   value: 'u' }, { $key: 'plain:x',   value: 'u' } ], null, ]
    [ [ { mode, lxid: 'x',   value: 'u', empty_value: '!!!', pattern: /x|/u, }, 'x', ], [ { $key: 'plain:x',   value: 'u' }, { $key: 'plain:x',   value: '!!!' } ], null, ]
    [ [ { mode, lxid: 'x',   value: ( -> 'u' ), empty_value: ( -> '!!!' ), pattern: /x|/u, }, 'x', ], [ { $key: 'plain:x',   value: 'u' }, { $key: 'plain:x',   value: '!!!' } ], null, ]
    ]
  #.........................................................................................................
  new_lexer = ->
    lexer = new Interlex()
    mode    = 'plain'
    return lexer
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ lexeme
        source  ] = probe
      lexer       = new_lexer()
      lexer.add_lexeme lexeme
      result      = lexer.run source
      # H.tabulate ( rpr probe ), result
      result      = ( ( GUY.props.pick_with_fallback token, null, '$key', 'value' ) for token in result )
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@value_2 = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: 'dq1[',         pattern: /(?<!")"(?!")/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '.]',            pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'plain:dq1', value: '"' }, { $key: 'dq1:text', value: 'world' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'plain:dq1', value: '"' }, { $key: 'dq1:text', value: 'everyone' }, { $key: 'dq1:nl', value: '\n' }, { $key: 'dq1:text', value: 'out there' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:text', value: '!' }, { $key: 'plain:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      for token from lexer.walk probe
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null


#-----------------------------------------------------------------------------------------------------------
@use_create_for_custom_behavior = ( T, done ) ->
  { Interlex } = require '../../../apps/intertext-lexer'
  create_call_count = 0
  #.........................................................................................................
  new_lexer = ->
    lexer = new Interlex { split: 'lines', }
    #.......................................................................................................
    new_escchr_descriptor = ( mode ) ->
      create = ( token ) ->
        create_call_count++
        token.data = { chr: '\n', } unless ( token.data?.chr )?
        return token
      return { mode, lxid: 'escchr', pattern: /\\(?<chr>.|$)/u, reserved: '\\', create, }
    #.......................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme new_escchr_descriptor mode
      lexer.add_lexeme { mode,  lxid: 'nl',        jump: null,       pattern: ( /$/u ), }
      lexer.add_lexeme { mode,  lxid: 'ws',        jump: null,       pattern: ( /\s+/u ), }
      lexer.add_lexeme { mode,  lxid: 'word',      jump: null,       pattern: ( /\S+/u ), }
      lexer.add_catchall_lexeme { mode, lxid: 'other',     concat: true, }
      lexer.add_reserved_lexeme { mode, lxid: 'forbidden', concat: true, }
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo <!-- comment --> bar', [ { $key: 'plain:word', value: 'foo' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '<!--' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: 'comment' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '-->' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: 'bar' }, { $key: 'plain:nl', value: '' } ], null ]
    [ 'foo <!-- \\comment \n --> bar', [ { $key: 'plain:word', value: 'foo' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '<!--' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:escchr', value: '\\c', data: { chr: 'c' } }, { $key: 'plain:word', value: 'omment' }, { $key: 'plain:nl', value: '' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '-->' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: 'bar' }, { $key: 'plain:nl', value: '' } ], null ]
    [ 'foo <!-- comment \\\n --> bar', [ { $key: 'plain:word', value: 'foo' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '<!--' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: 'comment' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:escchr', value: '\\', data: { chr: '\n' } }, { $key: 'plain:nl', value: '' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: '-->' }, { $key: 'plain:ws', value: ' ' }, { $key: 'plain:word', value: 'bar' }, { $key: 'plain:nl', value: '' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_lexer()
      T?.eq ( type_of lexer.registry.plain.lexemes.escchr.create ), 'function'
      result  = []
      for token from lexer.walk probe
        d = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, '$key', 'value', 'data'
        # debug '^432^', d if d.$key.endsWith ':escchr'
        result.push d
      # H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  T?.eq create_call_count, 2
  done?()


############################################################################################################
if require.main is module then do =>
  # test @lex_tags
  test @
  # test @lex_tags_with_rpr
  # test @parse_md_stars_markup
