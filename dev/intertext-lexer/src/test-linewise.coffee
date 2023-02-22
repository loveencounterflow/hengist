
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
@use_linewise_lexing_with_external_iterator_no_linewise_cfg = ( T, done ) ->
  FS      = require 'node:fs'
  GUY     = require '../../../apps/guy'
  { Interlex, compose: c, } = require '../../../apps/intertext-lexer'
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: "Ångström's", lnr1: 1, x1: 0, lnr2: 1, x2: 10, x: null, source: "Ångström's", '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'éclair', lnr1: 2, x1: 0, lnr2: 2, x2: 6, x: null, source: 'éclair', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: "éclair's", lnr1: 3, x1: 0, lnr2: 3, x2: 8, x: null, source: "éclair's", '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'éclairs', lnr1: 4, x1: 0, lnr2: 4, x2: 7, x: null, source: 'éclairs', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'éclat', lnr1: 5, x1: 0, lnr2: 5, x2: 5, x: null, source: 'éclat', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: "éclat's", lnr1: 6, x1: 0, lnr2: 6, x2: 7, x: null, source: "éclat's", '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'élan', lnr1: 7, x1: 0, lnr2: 7, x2: 4, x: null, source: 'élan', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: "élan's", lnr1: 8, x1: 0, lnr2: 8, x2: 6, x: null, source: "élan's", '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'émigré', lnr1: 9, x1: 0, lnr2: 9, x2: 6, x: null, source: 'émigré', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: "émigré's", lnr1: 10, x1: 0, lnr2: 10, x2: 8, x: null, source: "émigré's", '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 2, x1: 0, lnr2: 2, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '1', lnr1: 1, x1: 0, lnr2: 1, x2: 1, x: null, source: '1', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '2', lnr1: 2, x1: 0, lnr2: 2, x2: 1, x: null, source: '2', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '3', lnr1: 3, x1: 0, lnr2: 3, x2: 1, x: null, source: '3', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '1', lnr1: 1, x1: 0, lnr2: 1, x2: 1, x: null, source: '1', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '2', lnr1: 2, x1: 0, lnr2: 2, x2: 1, x: null, source: '2', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '3', lnr1: 3, x1: 0, lnr2: 3, x2: 1, x: null, source: '3', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'this', lnr1: 1, x1: 0, lnr2: 1, x2: 4, x: null, source: 'this', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'file', lnr1: 2, x1: 0, lnr2: 2, x2: 4, x: null, source: 'file', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'written', lnr1: 3, x1: 0, lnr2: 3, x2: 7, x: null, source: 'written', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'on', lnr1: 4, x1: 0, lnr2: 4, x2: 2, x: null, source: 'on', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'MS', lnr1: 5, x1: 0, lnr2: 5, x2: 2, x: null, source: 'MS Notepad', '$key': '^plain' }, { mode: 'plain', tid: 'ws', mk: 'plain:ws', jump: null, value: ' ', lnr1: 5, x1: 2, lnr2: 5, x2: 3, x: null, source: 'MS Notepad', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'Notepad', lnr1: 5, x1: 3, lnr2: 5, x2: 10, x: null, source: 'MS Notepad', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'all', lnr1: 1, x1: 0, lnr2: 1, x2: 3, x: null, source: 'all', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '𠀀bases', lnr1: 2, x1: 0, lnr2: 2, x2: 7, x: null, source: '𠀀bases', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 3, x1: 0, lnr2: 3, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'are', lnr1: 4, x1: 0, lnr2: 4, x2: 3, x: null, source: 'are belong', '$key': '^plain' }, { mode: 'plain', tid: 'ws', mk: 'plain:ws', jump: null, value: ' ', lnr1: 4, x1: 3, lnr2: 4, x2: 4, x: null, source: 'are belong', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'belong', lnr1: 4, x1: 4, lnr2: 4, x2: 10, x: null, source: 'are belong', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: '𠀀to', lnr1: 5, x1: 0, lnr2: 5, x2: 4, x: null, source: '𠀀to us', '$key': '^plain' }, { mode: 'plain', tid: 'ws', mk: 'plain:ws', jump: null, value: ' ', lnr1: 5, x1: 4, lnr2: 5, x2: 5, x: null, source: '𠀀to us', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'us', lnr1: 5, x1: 5, lnr2: 5, x2: 7, x: null, source: '𠀀to us', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 6, x1: 0, lnr2: 6, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 1, x1: 0, lnr2: 1, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 2, x1: 0, lnr2: 2, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 3, x1: 0, lnr2: 3, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 5, x1: 0, lnr2: 5, x2: 0, x: null, source: '', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 6, x1: 0, lnr2: 6, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, x: null, source: 'line', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, x: null, source: 'with', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, x: null, source: 'trailing', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, x: null, source: 'whitespace', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, x: null, source: 'line', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, x: null, source: 'with', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, x: null, source: 'trailing', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, x: null, source: 'whitespace', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line', lnr1: 1, x1: 0, lnr2: 1, x2: 4, x: null, source: 'line', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'with', lnr1: 2, x1: 0, lnr2: 2, x2: 4, x: null, source: 'with', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'trailing', lnr1: 3, x1: 0, lnr2: 3, x2: 8, x: null, source: 'trailing', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'whitespace', lnr1: 4, x1: 0, lnr2: 4, x2: 10, x: null, source: 'whitespace', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line1', lnr1: 1, x1: 0, lnr2: 1, x2: 5, x: null, source: 'line1', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line2', lnr1: 2, x1: 0, lnr2: 2, x2: 5, x: null, source: 'line2', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line3', lnr1: 3, x1: 0, lnr2: 3, x2: 5, x: null, source: 'line3', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line1', lnr1: 1, x1: 0, lnr2: 1, x2: 5, x: null, source: 'line1', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line2', lnr1: 2, x1: 0, lnr2: 2, x2: 5, x: null, source: 'line2', '$key': '^plain' }, { mode: 'plain', tid: 'word', mk: 'plain:word', jump: null, value: 'line3', lnr1: 3, x1: 0, lnr2: 3, x2: 5, x: null, source: 'line3', '$key': '^plain' }, { mode: 'plain', tid: 'empty', mk: 'plain:empty', jump: null, value: '', lnr1: 4, x1: 0, lnr2: 4, x2: 0, x: null, source: '', '$key': '^plain' } ] ]
    ]
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr1, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, tid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, tid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, tid: 'empty',    pattern: ( /^$/u ), }
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
    # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, tid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, tid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, tid: 'empty',    pattern: ( /^$/u ), }
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
@parse_nested_codespan_across_lines = ( T, done ) ->
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  new_toy_md_lexer = ( mode = 'plain' ) ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    lexer.add_lexeme { mode: 'plain',   tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   tid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   tid: 'backtick',  jump: 'literal',  pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'plain',   tid: 'nl',        jump: null,       pattern:  /$/u,        }
    lexer.add_lexeme { mode: 'plain',   tid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', tid: 'backtick',  jump: '^',        pattern:  /(?<!`)`(?!`)/u,    }
    lexer.add_lexeme { mode: 'literal', tid: 'text',      jump: null,       pattern:  /(?:\\`|[^`])+/u,   }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'abc `print "helo\nworld";` xyz', """[plain:other,(1:0)(1:4),='abc '][plain:codespan,(1:4)(2:8),='print "helo\\nworld";'][plain:other,(2:8)(2:12),=' xyz'][plain:nl,(2:12)(2:12),='']""", null ]
    ]
  #.........................................................................................................
  $parse_md_codespan = ->
    within_codespan = false
    collector       = []
    mode            = 'plain'
    tid             = 'codespan'
    mk              = 'plain:codespan'
    lnr1            = null
    x1              = null
    return ( d, send ) ->
      switch d.mk
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
          send { mode, tid, mk, value, lnr1, x1, lnr2, x2, }
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
      lexer   = new_toy_md_lexer 'md'
      p       = new_parser lexer
      #.....................................................................................................
      p.send probe
      result = []
      for token from p.walk()
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value', 'lnr1', 'x1', 'lnr2', 'x2', '$stamped'
      H.tabulate "#{rpr probe}", result # unless result_rpr is matcher
      resolve ( lexer.rpr_token token for token in result when not token.$stamped ).join ''
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # @use_linewise_lexing_with_external_iterator_no_linewise_cfg()
  # test @use_linewise_lexing_with_external_iterator_no_linewise_cfg
  # test @use_linewise_with_single_text
  test @parse_nested_codespan_across_lines
  # test @throws_error_on_linewise_with_nl_in_source
  # test @