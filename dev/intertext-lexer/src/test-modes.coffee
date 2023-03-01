
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/MODES'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require './helpers'


#-----------------------------------------------------------------------------------------------------------
@new_syntax_for_in_and_exclusive_jumps_1 = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: 'dq1[',         pattern: /(?<!")"(?!")/u, reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'plain:dq1', value: '"' }, { mk: 'dq1:text', value: 'world' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'plain:dq1', value: '"' }, { mk: 'dq1:text', value: 'everyone' }, { mk: 'dq1:nl', value: '\n' }, { mk: 'dq1:text', value: 'out there' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'plain:text', value: '!' }, { mk: 'plain:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #     lexer       = new_lexer()
  #     # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
  #     result      = []
  #     for token from lexer.walk probe
  #       result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
  #     result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
  #     H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      for token from lexer.walk probe
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@new_syntax_for_in_and_exclusive_jumps_2 = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '[dq1',         pattern: /"/u,            reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '].',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'world' }, { mk: 'plain:dq1', value: '"' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'everyone' }, { mk: 'dq1:nl', value: '\n' }, { mk: 'dq1:text', value: 'out there' }, { mk: 'plain:dq1', value: '"' }, { mk: 'plain:text', value: '!' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ '"one""two"', [ { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'one' }, { mk: 'plain:dq1', value: '"' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'two' }, { mk: 'plain:dq1', value: '"' }, { mk: 'plain:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      tokens      = []
      for token from lexer.walk probe
        tokens.push token
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@new_syntax_for_in_and_exclusive_jumps_3 = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '[dq1',         pattern: /"/u,            reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'world' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { mk: 'plain:text', value: 'helo ' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'everyone' }, { mk: 'dq1:nl', value: '\n' }, { mk: 'dq1:text', value: 'out there' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'plain:text', value: '!' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ '"one""two"', [ { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'one' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'dq1:text', value: 'two' }, { mk: 'dq1:dq1', value: '"' }, { mk: 'plain:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer()
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      tokens      = []
      for token from lexer.walk probe
        tokens.push token
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  test @

