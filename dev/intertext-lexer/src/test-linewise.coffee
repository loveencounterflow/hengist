
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
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#-----------------------------------------------------------------------------------------------------------
@GUY_str_walk_lines_with_positions_1 = ( T, done ) ->
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
  new_lexer = ->
    lexer   = new Interlex { linewise: true, }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, tid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, tid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, tid: 'empty',    pattern: ( /^$/u ), }
    return lexer
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    lexer       = new_lexer()
    result      = []
    tokens      = []
    [ path
      cfg ]     = probe
    path        = PATH.resolve PATH.join __dirname, path
    text        = ( line for line from GUY.fs.walk_lines path, cfg ).join ''
    # debug '^23-4^', rpr text
    for { lnr, line, eol, } from GUY.fs.walk_lines_with_positions path, cfg
      for token from lexer.walk line
        tokens.push token
        chunk = text[ token.start ... token.stop ]
        T?.eq token.value, chunk
        result.push "#{token.lnr}:#{rpr token.value}"
    #.........................................................................................................
    result = result.join ','
    debug '^23-5^', rpr result
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_str_walk_lines_with_positions_2 = ( T, done ) ->
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
  new_lexer = ->
    lexer   = new Interlex { linewise: true, }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr, 0
    mode    = 'plain'
    # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    lexer.add_lexeme { mode, tid: 'ws',       pattern: ( /\s+/u ), }
    lexer.add_lexeme { mode, tid: 'word',     pattern: ( /\S+/u ), }
    lexer.add_lexeme { mode, tid: 'empty',    pattern: ( /^$/u ), }
    return lexer
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    lexer       = new_lexer()
    result      = []
    tokens      = []
    [ path
      cfg ]     = probe
    path        = PATH.resolve PATH.join __dirname, path
    text        = ( line for line from GUY.fs.walk_lines path, cfg ).join ''
    for token from lexer.walk { path, cfg..., }
      # debug '^23-4^', token
      tokens.push token
      chunk = text[ token.start ... token.stop ]
      T?.eq token.value, chunk
      result.push "#{token.lnr}:#{rpr token.value}"
    #.........................................................................................................
    result = result.join ','
    debug '^23-4^', rpr result
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_str_walk_lines_with_positions_3 = ( T, done ) ->
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
    lexer   = new Interlex { linewise: true, cfg..., }
    # T?.eq lexer.cfg.linewise, true
    # T?.eq lexer.state.lnr, 0
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
    trimmed_source  = ( line + eol for { line, eol, } from GUY.fs.walk_lines_with_positions path, cfg ).join ''
    for token from lexer.walk { source, }
      # info '^23-4^', lexer.state
      info '^23-4^', token
      tokens.push token
      chunk = trimmed_source[ token.start ... token.stop ]
      T?.eq token.value, chunk
      result.push "#{token.lnr}:#{rpr token.value}"
    #.........................................................................................................
    result = result.join ','
    debug '^23-4^', rpr result
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  # test @GUY_str_walk_lines_with_positions_2
  test @GUY_str_walk_lines_with_positions_3
  # test @
