
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/LINEWISE'
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

#-----------------------------------------------------------------------------------------------------------
tabulate_lexer = ( lexer ) ->
  lexemes = []
  for mode, entry of lexer.registry
    lexemes.push lexeme for _, lexeme of entry.lexemes
  H.tabulate "lexer", lexemes
  return null

#-----------------------------------------------------------------------------------------------------------
@use_linewise_lexing_with_external_iterator_no_linewise_cfg = ( T, done ) ->
  FS      = require 'node:fs'
  GUY     = require '../../../apps/guy'
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ { $key: 'plain:word', jump: null, value: "Ångström's", lnr1: 1, x1: 0, lnr2: 1, x2: 10, data: null, source: "Ångström's", }, { $key: 'plain:word', jump: null, value: 'éclair', lnr1: 2, x1: 0, lnr2: 2, x2: 6, data: null, source: 'éclair', }, { $key: 'plain:word', jump: null, value: "éclair's", lnr1: 3, x1: 0, lnr2: 3, x2: 8, data: null, source: "éclair's", }, { $key: 'plain:word', jump: null, value: 'éclairs', lnr1: 4, x1: 0, lnr2: 4, x2: 7, data: null, source: 'éclairs', }, { $key: 'plain:word', jump: null, value: 'éclat', lnr1: 5, x1: 0, lnr2: 5, x2: 5, data: null, source: 'éclat', }, { $key: 'plain:word', jump: null, value: "éclat's", lnr1: 6, x1: 0, lnr2: 6, x2: 7, data: null, source: "éclat's", }, { $key: 'plain:word', jump: null, value: 'élan', lnr1: 7, x1: 0, lnr2: 7, x2: 4, data: null, source: 'élan', }, { $key: 'plain:word', jump: null, value: "élan's", lnr1: 8, x1: 0, lnr2: 8, x2: 6, data: null, source: "élan's", }, { $key: 'plain:word', jump: null, value: 'émigré', lnr1: 9, x1: 0, lnr2: 9, x2: 6, data: null, source: 'émigré', }, { $key: 'plain:word', jump: null, value: "émigré's", lnr1: 10, x1: 0, lnr2: 10, x2: 8, data: null, source: "émigré's", } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { $key: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { $key: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 2, x1: 0, lnr2: 2, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { $key: 'plain:word', jump: null, value: '1', lnr1: 1, x1: 0, lnr2: 1, x2: 1, data: null, source: '1', }, { $key: 'plain:word', jump: null, value: '2', lnr1: 2, x1: 0, lnr2: 2, x2: 1, data: null, source: '2', }, { $key: 'plain:word', jump: null, value: '3', lnr1: 3, x1: 0, lnr2: 3, x2: 1, data: null, source: '3', } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { $key: 'plain:word', jump: null, value: '1', lnr1: 1, x1: 0, lnr2: 1, x2: 1, data: null, source: '1', }, { $key: 'plain:word', jump: null, value: '2', lnr1: 2, x1: 0, lnr2: 2, x2: 1, data: null, source: '2', }, { $key: 'plain:word', jump: null, value: '3', lnr1: 3, x1: 0, lnr2: 3, x2: 1, data: null, source: '3', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { $key: 'plain:word', jump: null, value: 'this', lnr1: 1, x1: 0, lnr2: 1, x2: 4, data: null, source: 'this', }, { $key: 'plain:word', jump: null, value: 'file', lnr1: 2, x1: 0, lnr2: 2, x2: 4, data: null, source: 'file', }, { $key: 'plain:word', jump: null, value: 'written', lnr1: 3, x1: 0, lnr2: 3, x2: 7, data: null, source: 'written', }, { $key: 'plain:word', jump: null, value: 'on', lnr1: 4, x1: 0, lnr2: 4, x2: 2, data: null, source: 'on', }, { $key: 'plain:word', jump: null, value: 'MS', lnr1: 5, x1: 0, lnr2: 5, x2: 2, data: null, source: 'MS Notepad', }, { $key: 'plain:ws', jump: null, value: ' ', lnr1: 5, x1: 2, lnr2: 5, x2: 3, data: null, source: 'MS Notepad', }, { $key: 'plain:word', jump: null, value: 'Notepad', lnr1: 5, x1: 3, lnr2: 5, x2: 10, data: null, source: 'MS Notepad', } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { $key: 'plain:word', jump: null, value: 'all', lnr1: 1, x1: 0, lnr2: 1, x2: 3, data: null, source: 'all', }, { $key: 'plain:word', jump: null, value: '𠀀bases', lnr1: 2, x1: 0, lnr2: 2, x2: 7, data: null, source: '𠀀bases', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 3, x1: 0, lnr2: 3, x2: 0, data: null, source: '', }, { $key: 'plain:word', jump: null, value: 'are', lnr1: 4, x1: 0, lnr2: 4, x2: 3, data: null, source: 'are belong', }, { $key: 'plain:ws', jump: null, value: ' ', lnr1: 4, x1: 3, lnr2: 4, x2: 4, data: null, source: 'are belong', }, { $key: 'plain:word', jump: null, value: 'belong', lnr1: 4, x1: 4, lnr2: 4, x2: 10, data: null, source: 'are belong', }, { $key: 'plain:word', jump: null, value: '𠀀to', lnr1: 5, x1: 0, lnr2: 5, x2: 4, data: null, source: '𠀀to us', }, { $key: 'plain:ws', jump: null, value: ' ', lnr1: 5, x1: 4, lnr2: 5, x2: 5, data: null, source: '𠀀to us', }, { $key: 'plain:word', jump: null, value: 'us', lnr1: 5, x1: 5, lnr2: 5, x2: 7, data: null, source: '𠀀to us', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 6, x1: 0, lnr2: 6, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { $key: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 2, x1: 0, lnr2: 2, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 3, x1: 0, lnr2: 3, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 5, x1: 0, lnr2: 5, x2: 0, data: null, source: '', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 6, x1: 0, lnr2: 6, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { $key: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, data: null, source: 'line', }, { $key: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, data: null, source: 'with', }, { $key: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, data: null, source: 'trailing', }, { $key: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, data: null, source: 'whitespace', } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { $key: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, data: null, source: 'line', }, { $key: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, data: null, source: 'with', }, { $key: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, data: null, source: 'trailing', }, { $key: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, data: null, source: 'whitespace', } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { $key: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, data: null, source: 'line', }, { $key: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, data: null, source: 'with', }, { $key: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, data: null, source: 'trailing', }, { $key: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, data: null, source: 'whitespace', } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { $key: 'plain:word', jump: null, value: 'line1', lnr1: 1, x1: 0, lnr2: 1, x2: 5, data: null, source: 'line1', }, { $key: 'plain:word', jump: null, value: 'line2', lnr1: 2, x1: 0, lnr2: 2, x2: 5, data: null, source: 'line2', }, { $key: 'plain:word', jump: null, value: 'line3', lnr1: 3, x1: 0, lnr2: 3, x2: 5, data: null, source: 'line3', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, data: null, source: '', } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { $key: 'plain:word', jump: null, value: 'line1', lnr1: 1, x1: 0, lnr2: 1, x2: 5, data: null, source: 'line1', }, { $key: 'plain:word', jump: null, value: 'line2', lnr1: 2, x1: 0, lnr2: 2, x2: 5, data: null, source: 'line2', }, { $key: 'plain:word', jump: null, value: 'line3', lnr1: 3, x1: 0, lnr2: 3, x2: 5, data: null, source: 'line3', }, { $key: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, data: null, source: '', } ] ]
    ]
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr1, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, lxid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, lxid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, lxid: 'empty',    pattern: ( /^$/u ), }
    return lexer
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    lexer           = new_lexer()
    result          = []
    tokens          = []
    [ path
      cfg ]         = probe
    path            = PATH.resolve PATH.join __dirname, path
    # trimmed_source  = ( line + eol for { line, eol, } from GUY.fs.walk_lines_with_positions path, cfg ).join ''
    # debug '^23-4^', rpr trimmed_source
    for { lnr1, line, eol, } from GUY.fs.walk_lines_with_positions path, cfg
      for token from lexer.walk line
        tokens.push token
        result.push token
        T?.eq token.value, token.source[ token.x1 ... token.x2 ]
    #.........................................................................................................
    # result = result.join ','
    # debug '^23-5^', rpr result
    # echo [ probe, result, ]
    T?.eq result, matcher
    H.tabulate ( rpr path ), tokens
  #.........................................................................................................
  done?()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @use_linewise_lexing_with_peacemeal_feed = ( T, done ) ->
#   FS                        = require 'node:fs'
#   GUY                       = require '../../../apps/guy'
#   { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
#   start_of_line             = Symbol 'start_of_line'
#   end_of_line               = Symbol 'end_of_line'
#   first                     = Symbol 'first'
#   last                      = Symbol 'last'
#   #.........................................................................................................
#   new_lexer = ->
#     lexer   = new Interlex { split: false, first, last, start_of_line, end_of_line, }
#     mode    = 'A'
#     lexer.add_lexeme { mode, lxid: 'w', pattern: ( /\s+/u ), }
#     lexer.add_lexeme { mode, lxid: 'm', pattern: ( /\S+/u ), }
#     lexer.add_lexeme { mode, lxid: 'e', pattern: ( /^$/u ), }
#     return lexer
#   #.........................................................................................................
#   lexer = new_lexer()
#   sources = [ "helo world what", "'s going on?\nyo", ]
#   for source in sources
#     for d from lexer.walk { source, }
#       if lexer.types.isa.symbol d
#         info 'Ω___1', d
#       else
#         help 'Ω___2', "#{d.$key}:#{rpr d.value}"
#   # T?.eq result, matcher
#   # H.tabulate ( rpr path ), tokens
#   #.........................................................................................................
#   done?()
#   return null

#-----------------------------------------------------------------------------------------------------------
@use_linewise_with_single_text = ( T, done ) ->
  FS      = require 'node:fs'
  GUY     = require '../../../apps/guy'
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ],                                  """1:"Ångström's",2:'éclair',3:"éclair's",4:'éclairs',5:'éclat',6:"éclat's",7:'élan',8:"élan's",9:'émigré',10:"émigré's\"""" ]
    [ [ '../../../assets/datamill/empty-file.txt', null ],                          "1:''" ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ],                 "1:'',2:''" ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ],          "1:'1',2:'2',3:'3'" ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ],        "1:'1',2:'2',3:'3',4:''" ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ],                        "1:'this',2:'file',3:'written',4:'on',5:'MS',5:' ',5:'Notepad'" ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ],                         "1:'all',2:'𠀀bases',3:'',4:'are',4:' ',4:'belong',5:'𠀀to',5:' ',5:'us',6:''" ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ],                     "1:'',2:'',3:'',4:'',5:'',6:''" ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ],            "1:'line',2:'with',3:'trailing',4:'whitespace'" ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ],  "1:'line',2:'with',3:'trailing',4:'whitespace'" ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], "1:'line',1:'   ',2:'with',2:'   ',3:'trailing',3:'\\t\\t',4:'whitespace',4:'　 '" ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ],                       "1:'line1',2:'line2',3:'line3',4:''" ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ],                     "1:'line1',2:'line2',3:'line3',4:''" ]
    ]
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr1, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, lxid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, lxid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, lxid: 'empty',    pattern: ( /^$/u ), }
    return lexer
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result          = []
    tokens          = []
    [ path
      cfg ]         = probe
    lexer           = new_lexer cfg
    path            = PATH.resolve PATH.join __dirname, path
    source          = FS.readFileSync path, { encoding: 'utf-8', }
    for token from lexer.walk { source, }
      # info '^23-4^', lexer.state
      info '^23-4^', token
      tokens.push token
      result.push "#{token.lnr1}:#{rpr token.value}"
    #.........................................................................................................
    result = result.join ','
    debug '^23-4^', rpr result
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@use_linewise_with_prepend_and_append = ( T, done ) ->
  FS      = require 'node:fs'
  GUY     = require '../../../apps/guy'
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', '>', '\n' ], """1:">Ångström's\\n",2:'>éclair\\n',3:">éclair's\\n",4:'>éclairs\\n',5:'>éclat\\n',6:">éclat's\\n",7:'>élan\\n',8:">élan's\\n",9:'>émigré\\n',10:">émigré's\\n\"""" ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', '(', ')' ], "1:'(line)',2:'(with)',3:'(trailing)',4:'(whitespace)'" ]
    ]
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr1, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, lxid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, lxid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, lxid: 'word',     pattern: ( /\S+\n?/u ), }
    lexer.add_lexeme { mode, lxid: 'nl',       pattern: ( /\n/u ), }
    return lexer
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result          = []
    tokens          = []
    [ path
      prepend
      append  ]     = probe
    lexer           = new_lexer { prepend, append, }
    path            = PATH.resolve PATH.join __dirname, path
    source          = FS.readFileSync path, { encoding: 'utf-8', }
    for token from lexer.walk { source, }
      # info '^23-4^', lexer.state
      tokens.push token
      result.push "#{token.lnr1}:#{rpr token.value}"
    #.........................................................................................................
    result = result.join ','
    echo rpr [ probe, result, ]
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null


#-----------------------------------------------------------------------------------------------------------
@parse_nested_codespan_across_lines = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex cfg
    #.........................................................................................................
    do ->
      mode = 'plain'
      lexer.add_lexeme { mode,  lxid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
      lexer.add_lexeme { mode,  lxid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
      lexer.add_lexeme { mode,  lxid: 'backtick',  jump: 'literal[',  pattern:  /(?<!`)`(?!`)/u,    }
      lexer.add_lexeme { mode,  lxid: 'nl',        jump: null,       pattern:  /\n|$/u,        }
      lexer.add_lexeme { mode,  lxid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    do ->
      mode = 'literal'
      lexer.add_lexeme { mode,  lxid: 'backtick',  jump: '.]',        pattern:  /(?<!`)`(?!`)/u,    }
      lexer.add_lexeme { mode,  lxid: 'text',      jump: null,       pattern:  /(?:\\`|[^`])+/u,   }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'abc `print "helo\nworld";` xyz', { split: 'lines', state: 'keep', }, ], """[plain:other,(1:0)(1:4),='abc '][plain:codespan,(1:4)(2:8),='print "helo\\nworld";'][plain:other,(2:8)(2:12),=' xyz'][plain:nl,(2:12)(2:12),='']""", null ]
    [ [ 'abc `print "helo\nworld";` xyz', { split: 'lines', state: 'reset' } ], """[plain:other,(1:0)(1:4),='abc '][plain:other,(2:0)(2:7),='world";']""", null ]
    [ [ 'abc `print "helo\nworld";` xyz', { split: false, state: 'keep' } ], """[plain:other,(0:0)(0:4),='abc '][plain:codespan,(0:4)(0:25),='print "helo\\nworld";'][plain:other,(0:25)(0:29),=' xyz'][plain:nl,(0:29)(0:29),='']""", null ]
    [ [ 'abc `print "helo\nworld";` xyz', { split: false, state: 'reset' } ], """[plain:other,(0:0)(0:4),='abc '][plain:codespan,(0:4)(0:25),='print "helo\\nworld";'][plain:other,(0:25)(0:29),=' xyz'][plain:nl,(0:29)(0:29),='']""", null ]
    ]
  #.........................................................................................................
  $parse_md_codespan = ->
    within_codespan = false
    collector       = []
    mode            = 'plain'
    lxid             = 'codespan'
    $key              = 'plain:codespan'
    lnr1            = null
    x1              = null
    return ( d, send ) ->
      switch d.$key
        when 'plain:backtick'
          send stamp d
          within_codespan = true
          { lnr1, x1, } = d
        when 'literal:text'
          return send d unless within_codespan
          send stamp d
          collector.push d
        when 'literal:backtick'
          return send d unless within_codespan
          send stamp d
          within_codespan = false
          value           = ( e.value for e in collector ).join '\n'
          { lnr2, x2, }   = d
          send { mode, lxid, $key, value, lnr1, x1, lnr2, x2, }
        else
          send d
      return null
  #.........................................................................................................
  new_parser = ( lexer ) ->
    p = new Pipeline()
    p.push ( d, send ) ->
      validate.text d
      send e for e from lexer.walk d
    p.push H2.$parse_md_star()
    p.push $parse_md_codespan()
    return p
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      [ source
        cfg ] = probe
      lexer   = new_lexer cfg
      p       = new_parser lexer
      #.....................................................................................................
      p.send source
      result = []
      for token from p.walk()
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value', 'lnr1', 'x1', 'lnr2', 'x2', '$stamped'
      H.tabulate "#{rpr probe}", result # unless result_rpr is matcher
      resolve ( lexer.rpr_token token for token in result when not token.$stamped ).join ''
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@read_csv = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex cfg
    #.........................................................................................................
    do ->
      mode = 'plain'
      lexer.add_lexeme { mode,  lxid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode,  lxid: 'nl',        jump: null,       pattern:  /\n|$/u,        reserved: '\n', }
      lexer.add_lexeme { mode,  lxid: 'sep',       jump: null,       pattern:  /,/u,           reserved: ',',  }
      lexer.add_lexeme { mode,  lxid: 'dq',        jump: 'dq[',       pattern:  /"/u,           reserved: '"',  }
      lexer.add_catchall_lexeme { mode, lxid: 'value', concat: true, }
    do ->
      mode = 'dq'
      lexer.add_lexeme { mode,  lxid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode,  lxid: 'nl',        jump: null,       pattern:  /\n|$/u,        reserved: '\n', }
      lexer.add_lexeme { mode,  lxid: 'dq',        jump: '.]',        pattern:  /"/u,           reserved: '"',  }
      lexer.add_catchall_lexeme { mode, lxid: 'string', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '42,"helo"\n43,world', { split: 'lines', state: 'keep' } ], """plain:value:'42',plain:sep:',',plain:dq:'"',dq:string:'helo',dq:dq:'"',plain:nl:'',plain:value:'43',plain:sep:',',plain:value:'world',plain:nl:''""", null ]
    [ [ '42,"helo\n43,world', { split: 'lines', state: 'keep' } ], """plain:value:'42',plain:sep:',',plain:dq:'"',dq:string:'helo',dq:nl:'',dq:string:'43,world',dq:nl:''""", null ]
    [ [ '42,"helo"\n43,world', { split: 'lines', state: 'reset' } ], """plain:value:'42',plain:sep:',',plain:dq:'"',dq:string:'helo',dq:dq:'"',plain:nl:'',plain:value:'43',plain:sep:',',plain:value:'world',plain:nl:''""", null ]
    [ [ '42,"helo\n43,world', { split: 'lines', state: 'reset' } ], """plain:value:'42',plain:sep:',',plain:dq:'"',dq:string:'helo',dq:nl:'',plain:value:'43',plain:sep:',',plain:value:'world',plain:nl:''""", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      [ source
        cfg ] = probe
      lexer   = new_lexer cfg
      #.....................................................................................................
      result = []
      for token from lexer.walk source
        result.push token # GUY.props.pick_with_fallback token, null, '$key', 'value', 'lnr1', 'x1', 'lnr2', 'x2', '$stamped'
      # H.tabulate "#{rpr probe}", result # unless result_rpr is matcher
      result  = ( "#{t.$key}:#{rpr t.value}" for t in result when not token.$stamped ).join ','
      resolve result
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # @use_linewise_lexing_with_external_iterator_no_linewise_cfg()
  # test @use_linewise_lexing_with_external_iterator_no_linewise_cfg
  # test @use_linewise_with_single_text
  # test @parse_nested_codespan_across_lines
  # @read_csv()
  # test @use_linewise_with_prepend_and_append
  # test @read_csv
  # test @throws_error_on_linewise_with_nl_in_source
  # @use_linewise_lexing_with_peacemeal_feed()
  # test @use_linewise_lexing_with_peacemeal_feed
  test @