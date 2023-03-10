
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
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM
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

#-----------------------------------------------------------------------------------------------------------
@singular_jumps = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg = null ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,       pattern: /\\(?<chr>.)/u,    reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq2',    jump: '[dqstr]',  pattern: /(?<!")""(?!")/u,  reserved: '"', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '[dqstr',   pattern: /(?<!")"(?!")/u,   reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,       pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dqstr'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo', data: null }, { mk: 'plain:nl', value: '\n', data: null } ], null ]
    [ 'helo "world"', [ { mk: 'plain:text', value: 'helo ', data: null }, { mk: 'dqstr:$border', value: '', data: { prv: 'plain', nxt: 'dqstr' } }, { mk: 'dqstr:dq1', value: '"', data: null }, { mk: 'dqstr:text', value: 'world', data: null }, { mk: 'dqstr:dq1', value: '"', data: null }, { mk: 'plain:$border', value: '', data: { prv: 'dqstr', nxt: 'plain' } }, { mk: 'plain:nl', value: '\n', data: null } ], null ]
    [ 'abc "" xyz', [ { mk: 'plain:text', value: 'abc ', data: null }, { mk: 'plain:$border', value: '', data: { prv: 'plain', nxt: 'dqstr' } }, { mk: 'dqstr:dq2', value: '""', data: null }, { mk: 'plain:$border', value: '', data: { prv: 'dqstr', nxt: 'plain' } }, { mk: 'plain:text', value: ' xyz', data: null }, { mk: 'plain:nl', value: '\n', data: null } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer { border_tokens: true, }
      T?.eq lexer.cfg.border_tokens, true
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      tokens      = []
      for token from lexer.walk probe
        tokens.push token
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value', 'data'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@singular_jumps_move_forward_correctly = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg = null ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,       pattern: /\\(?<chr>.)/u,    reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'c_lsr',  jump: '[tag]',    pattern: '</>',             reserved: '<', }
      lexer.add_lexeme { mode, tid: 'lpb',    jump: '[tag',     pattern: '<',               reserved: '<', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
      lexer.add_reserved_lexeme { mode, tid: '$forbidden', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'lbp',    jump: null,           pattern: '<',            reserved: '<', }
      lexer.add_lexeme { mode, tid: 'rbp',    jump: null,           pattern: '>',            reserved: '>', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
      lexer.add_reserved_lexeme { mode, tid: '$forbidden', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo', data: null } ], null ]
    [ 'abc</>def<what>', [ { mk: 'plain:text', value: 'abc', data: null }, { mk: 'plain:$border', value: '', data: { prv: 'plain', nxt: 'tag' } }, { mk: 'tag:c_lsr', value: '</>', data: null }, { mk: 'plain:$border', value: '', data: { prv: 'tag', nxt: 'plain' } }, { mk: 'plain:text', value: 'def', data: null }, { mk: 'tag:$border', value: '', data: { prv: 'plain', nxt: 'tag' } }, { mk: 'tag:lpb', value: '<', data: null }, { mk: 'tag:text', value: 'what', data: null }, { mk: 'tag:rbp', value: '>', data: null } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new_lexer { border_tokens: true, }
      T?.eq lexer.cfg.border_tokens, true
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      result      = []
      tokens      = []
      for token from lexer.walk probe
        tokens.push token
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value', 'data'
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@cannot_use_undeclared_mode = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'lpb',    jump: '[tag',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'rpb',    jump: '.]',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', null, 'xxxx' ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
    error = null
    lexer       = new_lexer()
    # debug '^w342^', lexer.start()
    T?.throws /no such mode/, -> lexer.start()
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@auto_inserted_border_posts_inclusive = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'lpb',    jump: '[tag',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'rpb',    jump: '.]',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'plain:nl', value: '\n', x1: 4, x2: 4 } ], null ]
    [ 'helo<t1>', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'tag:$border', value: '|', x1: 4, x2: 4 }, { mk: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:$border', value: '|', x1: 8, x2: 8 }, { mk: 'plain:nl', value: '\n', x1: 8, x2: 8 } ], null ]
    [ 'helo<t1><t2>', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'tag:$border', value: '|', x1: 4, x2: 4 }, { mk: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:$border', value: '|', x1: 8, x2: 8 }, { mk: 'tag:$border', value: '|', x1: 8, x2: 8 }, { mk: 'tag:lpb', value: '<', x1: 8, x2: 9 }, { mk: 'tag:text', value: 't2', x1: 9, x2: 11 }, { mk: 'tag:rpb', value: '>', x1: 11, x2: 12 }, { mk: 'plain:$border', value: '|', x1: 12, x2: 12 }, { mk: 'plain:nl', value: '\n', x1: 12, x2: 12 } ], null ]
    [ 'helo<t1><t2', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'tag:$border', value: '|', x1: 4, x2: 4 }, { mk: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:$border', value: '|', x1: 8, x2: 8 }, { mk: 'tag:$border', value: '|', x1: 8, x2: 8 }, { mk: 'tag:lpb', value: '<', x1: 8, x2: 9 }, { mk: 'tag:text', value: 't2', x1: 9, x2: 11 }, { mk: 'tag:nl', value: '\n', x1: 11, x2: 11 } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
    lexer       = new_lexer { border_tokens: true, border_value: '|', }
    T?.eq lexer.cfg.border_tokens, true
    T?.eq lexer.cfg.border_value, '|'
    # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
    result      = []
    tokens      = []
    for token from lexer.walk probe
      tokens.push token
      result.push GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x1', 'x2'
    result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
    echo [ probe, result, error, ]
    # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
    #.....................................................................................................
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@auto_inserted_border_posts_exclusive = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'lpb',    jump: 'tag[',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, tid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, tid: 'rpb',    jump: '].',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, tid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'plain:nl', value: '\n', x1: 4, x2: 4 } ], null ]
    [ 'helo<t1>', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:$border', value: '|', x1: 5, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'plain:$border', value: '|', x1: 7, x2: 7 }, { mk: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:nl', value: '\n', x1: 8, x2: 8 } ], null ]
    [ 'helo<t1><t2>', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:$border', value: '|', x1: 5, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'plain:$border', value: '|', x1: 7, x2: 7 }, { mk: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { mk: 'tag:$border', value: '|', x1: 9, x2: 9 }, { mk: 'tag:text', value: 't2', x1: 9, x2: 11 }, { mk: 'plain:$border', value: '|', x1: 11, x2: 11 }, { mk: 'plain:rpb', value: '>', x1: 11, x2: 12 }, { mk: 'plain:nl', value: '\n', x1: 12, x2: 12 } ], null ]
    [ 'helo<t1><t2', [ { mk: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { mk: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { mk: 'tag:$border', value: '|', x1: 5, x2: 5 }, { mk: 'tag:text', value: 't1', x1: 5, x2: 7 }, { mk: 'plain:$border', value: '|', x1: 7, x2: 7 }, { mk: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { mk: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { mk: 'tag:$border', value: '|', x1: 9, x2: 9 }, { mk: 'tag:text', value: 't2', x1: 9, x2: 11 }, { mk: 'tag:nl', value: '\n', x1: 11, x2: 11 } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
    lexer       = new_lexer { border_tokens: true, border_value: '|', }
    T?.eq lexer.cfg.border_tokens, true
    T?.eq lexer.cfg.border_value, '|'
    # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
    result      = []
    tokens      = []
    for token from lexer.walk probe
      tokens.push token
      result.push GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x1', 'x2'
    result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
    echo [ probe, result, error, ]
    # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
    #.....................................................................................................
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null


#===========================================================================================================
# JUMP FUNCTIONS
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
    enter_codespan = ({ token, match, lexer, }) ->
      # debug '^35-1^', match
      backtick_count = token.value.length
      return { jump: 'literal[', }
    #.......................................................................................................
    exit_codespan = ({ token, match, lexer, }) ->
      # debug '^35-3^', match
      if token.value.length is backtick_count
        backtick_count = null
        return '.]'
      ### TAINT setting `token.mk` should not have to be done manually ###
      token = lets token, ( token ) -> token.tid = 'text'; token.mk = "#{token.mode}:text"
      # debug '^345^', token
      return { token, }
    #.......................................................................................................
    lexer.add_lexeme { mode: 'plain',   tid: 'escchr',    jump: null,           pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   tid: 'star1',     jump: null,           pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   tid: 'codespan',  jump: enter_codespan, pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'plain',   tid: 'other',     jump: null,           pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', tid: 'codespan',  jump: exit_codespan,  pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'literal', tid: 'text',      jump: null,           pattern:  /(?:\\`|[^`])+/u,   }
    #.......................................................................................................
    return lexer
  #.........................................................................................................
  $parse_md_codespan = ->
    return ( d, send ) ->
      switch d.mk
        when  'plain:codespan'
          send stamp d
          send H.new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
        when 'literal:codespan'
          send stamp d
          send H.new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
        else
          send d
      return null
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
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      md_lexer  = new_toy_md_lexer 'md'
      #.....................................................................................................
      p = new Pipeline()
      p.push ( d, send ) ->
        return send d unless d.tid is 'p'
        send e for e from md_lexer.walk d.value
      p.push H.$parse_md_star()
      p.push $parse_md_codespan()
      #.....................................................................................................
      p.send H.new_token '^æ19^', { x1: 0, x2: probe.length, }, 'plain', 'p', null, probe
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()
  return null


#===========================================================================================================
# START AND STOP TOKENS
#-----------------------------------------------------------------------------------------------------------
@meta_lexer_for_start_and_stop_tokens = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'helo', { active: false, }, ], [ [ 'helo\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop_all?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop-all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop-all?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop-all\\?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world<?stop-all\\?>!\n', true ] ], null ]
    [ [ 'helo <?start?>world\n<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world\n', true ], [ '<?stop_all?>!\n', false ] ], null ]
    [ [ 'helo <?stop?>comments\ngo\nhere\n', { active: true } ], [ [ 'helo ', true ], [ '<?stop?>comments\n', false ], [ 'go\n', false ], [ 'here\n', false ], [ '\n', false ] ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
    # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
    [ source
      cfg     ] = probe
    result      = []
    tokens      = []
    parser      = new tools.Start_stop_preprocessor cfg
    for d from parser.walk source
      tokens.push d
      result.push [ d.value, d.data.active, ]
    # debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
    # H.tabulate "#{rpr probe}", tokens
    echo [ probe, result, error, ]
    #.....................................................................................................
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # test @markup_with_variable_length
  # test @cannot_use_undeclared_mode
  # @auto_inserted_border_posts_inclusive()
  # @auto_inserted_border_posts_exclusive()
  # test @auto_inserted_border_posts_inclusive
  # test @auto_inserted_border_posts_exclusive
  # @singular_jumps()
  # test @singular_jumps_move_forward_correctly
  # @meta_lexer_for_start_and_stop_tokens()
  # @meta_lexer_for_start_and_stop_tokens()
  test @meta_lexer_for_start_and_stop_tokens


