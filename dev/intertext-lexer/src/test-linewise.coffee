
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
    [ [ '../../../assets/a-few-words.txt', null ],                                  "1Ångström's,2éclair,3éclair's,4éclairs,5éclat,6éclat's,7élan,8élan's,9émigré,10émigré's" ]
    [ [ '../../../assets/datamill/empty-file.txt', null ],                          '1' ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ],                 '1,2' ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ],          '11,22,33' ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ],        '11,22,33,4' ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ],                        '1this,2file,3written,4on,5MS,5 ,5Notepad' ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ],                         '1all,2𠀀bases,3,4are,4 ,4belong,5𠀀to,5 ,5us,6' ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ],                     '1,2,3,4,5,6' ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ],            '1line,2with,3trailing,4whitespace' ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ],  '1line,2with,3trailing,4whitespace' ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], '1line,1   ,2with,2   ,3trailing,3\t\t,4whitespace,4　 ' ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ],                       '1line1,2line2,3line3,4' ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ],                     '1line1,2line2,3line3,4' ]
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
        result.push "#{token.lnr}#{token.value}"
    #.........................................................................................................
    result = result.join ','
    debug '^23-5^', rpr result
    T?.eq result, matcher
    # H.tabulate ( rpr probe ), tokens
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  test @
