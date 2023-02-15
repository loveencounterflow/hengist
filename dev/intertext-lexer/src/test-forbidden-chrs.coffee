
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
@add_reserved_chrs = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  add_lexemes   = ( lexer ) ->
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'escchr',           pattern:  /\\(?<chr>.)/u, reserved: '\\', }
    lexer.add_lexeme { mode, tid: 'star2',            pattern: ( /(?<!\*)\*\*(?!\*)/u   ), reserved: '*', }
    lexer.add_lexeme { mode, tid: 'heading',          pattern: ( /^(?<hashes>#+)\s+/u ), reserved: '#', }
    lexer.add_lexeme { mode, tid: 'word',             pattern: ( /\p{Letter}+/u ), }
    lexer.add_lexeme { mode, tid: 'number_symbol',    pattern: ( /#(?=\p{Number})/u ), }
    lexer.add_lexeme { mode, tid: 'number',           pattern: ( /\p{Number}+/u ), }
    lexer.add_lexeme { mode, tid: 'ws',               pattern: ( /\s+/u ), }
    lexer.add_catchall_lexeme { mode, }
    lexer.add_reserved_lexeme { mode, }
    return null
  #.........................................................................................................
  await do =>
    probes_and_matchers = [
      [ 'helo', "word:'helo'", null ]
      [ 'helo*x', "word:'helo'$reserved:'*'word:'x'", null ]
      [ '*x', "$reserved:'*'word:'x'", null ]
      [ '## question #1 and a hash: #', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:':'ws:' '$reserved:'#'", null ]
      [ '## question #1 and a hash: \\#', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:':'ws:' 'escchr:'\\\\#'", null ]
      [ ':.;*#', "$catchall:':'$catchall:'.'$catchall:';'$reserved:'*'$reserved:'#'", null ]
      ]
    for [ probe, matcher, error, ] in probes_and_matchers
      await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
        lexer = new Interlex { catchall_concat: false, reserved_concat: false, }
        add_lexemes lexer
        # H.tabulate "lexer", ( x for _, x of lexer.registry.plain.lexemes )
        result      = lexer.run probe
        # H.tabulate ( rpr probe ), result
        result_rpr  = ( "#{t.tid}:#{rpr t.value}" for t in result ).join ''
        resolve result_rpr
  #.........................................................................................................
  await do =>
    probes_and_matchers = [
      [ 'helo', "word:'helo'", null ]
      [ 'helo*x', "word:'helo'$reserved:'*'word:'x'", null ]
      [ '*x', "$reserved:'*'word:'x'", null ]
      [ '## question #1 and a hash: #', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:': '$reserved:'#'", null ]
      [ '## question #1 and a hash: \\#', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'$catchall:': 'escchr:'\\\\#'", null ]
      [ ':.;*#', "$catchall:':.;'$reserved:'*#'", null ]
      ]
    for [ probe, matcher, error, ] in probes_and_matchers
      await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
        lexer = new Interlex { catchall_concat: true, reserved_concat: true, }
        add_lexemes lexer
        # H.tabulate "lexer", ( x for _, x of lexer.registry.plain.lexemes )
        result      = lexer.run probe
        # H.tabulate ( rpr probe ), result
        result_rpr  = ( "#{t.tid}:#{rpr t.value}" for t in result ).join ''
        resolve result_rpr
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@catchall_and_reserved_with_custom_names = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex, } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  add_lexemes   = ( lexer ) ->
    mode    = 'plain'
    lexer.add_lexeme { mode, tid: 'escchr',           pattern:  /\\(?<chr>.)/u, reserved: '\\', }
    lexer.add_lexeme { mode, tid: 'star2',            pattern: ( /(?<!\*)\*\*(?!\*)/u   ), reserved: '*', }
    lexer.add_lexeme { mode, tid: 'heading',          pattern: ( /^(?<hashes>#+)\s+/u ), reserved: '#', }
    lexer.add_lexeme { mode, tid: 'word',             pattern: ( /\p{Letter}+/u ), }
    lexer.add_lexeme { mode, tid: 'number_symbol',    pattern: ( /#(?=\p{Number})/u ), }
    lexer.add_lexeme { mode, tid: 'number',           pattern: ( /\p{Number}+/u ), }
    lexer.add_lexeme { mode, tid: 'ws',               pattern: ( /\s+/u ), }
    lexer.add_catchall_lexeme { mode, tid: 'other', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
    return null
  #.........................................................................................................
  await do =>
    probes_and_matchers = [
      [ 'helo', "word:'helo'", null ]
      [ 'helo*x', "word:'helo'forbidden:'*'word:'x'", null ]
      [ '*x', "forbidden:'*'word:'x'", null ]
      [ '## question #1 and a hash: #', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'other:': 'forbidden:'#'", null ]
      [ '## question #1 and a hash: \\#', "heading:'## 'word:'question'ws:' 'number_symbol:'#'number:'1'ws:' 'word:'and'ws:' 'word:'a'ws:' 'word:'hash'other:': 'escchr:'\\\\#'", null ]
      [ ':.;*#', "other:':.;'forbidden:'*#'", null ]
      ]
    for [ probe, matcher, error, ] in probes_and_matchers
      await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
        lexer = new Interlex { catchall_concat: true, reserved_concat: true, }
        add_lexemes lexer
        # H.tabulate "lexer", ( x for _, x of lexer.registry.plain.lexemes )
        result      = lexer.run probe
        H.tabulate ( rpr probe ), result
        result_rpr  = ( "#{t.tid}:#{rpr t.value}" for t in result ).join ''
        resolve result_rpr
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  # @add_reserved_chrs()
  # test @add_reserved_chrs
  test @catchall_and_reserved_with_custom_names
  # test @
