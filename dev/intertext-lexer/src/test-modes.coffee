
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: 'dq1[',         pattern: /(?<!")"(?!")/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
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
  # for [ probe, matcher, error, ] in probes_and_matchers
  #     lexer       = new_lexer()
  #     # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
  #     result      = []
  #     for token from lexer.walk probe
  #       result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
  #     result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
  #     H.tabulate "#{rpr probe} -> #{rpr result_rpr}", result # unless result_rpr is matcher
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
@new_syntax_for_in_and_exclusive_jumps_2 = ( T, done ) ->
  { Interlex
    compose  }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ->
    lexer   = new Interlex { split: 'lines', }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '[dq1',         pattern: /"/u,            reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '].',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'world' }, { $key: 'plain:dq1', value: '"' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'everyone' }, { $key: 'dq1:nl', value: '\n' }, { $key: 'dq1:text', value: 'out there' }, { $key: 'plain:dq1', value: '"' }, { $key: 'plain:text', value: '!' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ '"one""two"', [ { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'one' }, { $key: 'plain:dq1', value: '"' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'two' }, { $key: 'plain:dq1', value: '"' }, { $key: 'plain:nl', value: '\n' } ], null ]
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
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '[dq1',         pattern: /"/u,            reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "world"', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'world' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ 'helo "everyone\nout there"!', [ { $key: 'plain:text', value: 'helo ' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'everyone' }, { $key: 'dq1:nl', value: '\n' }, { $key: 'dq1:text', value: 'out there' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:text', value: '!' }, { $key: 'plain:nl', value: '\n' } ], null ]
    [ '"one""two"', [ { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'one' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'dq1:text', value: 'two' }, { $key: 'dq1:dq1', value: '"' }, { $key: 'plain:nl', value: '\n' } ], null ]
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
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value'
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,       pattern: /\\(?<chr>.)/u,    reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq2',    jump: '[dqstr]',  pattern: /(?<!")""(?!")/u,  reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '[dqstr',   pattern: /(?<!")"(?!")/u,   reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,       pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dqstr'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'dq1',    jump: '.]',           pattern: /"/u, reserved: '"', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo', data: null }, { $key: 'plain:nl', value: '\n', data: null } ], null ]
    [ 'helo "world"', [ { $key: 'plain:text', value: 'helo ', data: null }, { $key: 'dqstr:$border', value: '', data: { prv: 'plain', nxt: 'dqstr' } }, { $key: 'dqstr:dq1', value: '"', data: null }, { $key: 'dqstr:text', value: 'world', data: null }, { $key: 'dqstr:dq1', value: '"', data: null }, { $key: 'plain:$border', value: '', data: { prv: 'dqstr', nxt: 'plain' } }, { $key: 'plain:nl', value: '\n', data: null } ], null ]
    [ 'abc "" xyz', [ { $key: 'plain:text', value: 'abc ', data: null }, { $key: 'plain:$border', value: '', data: { prv: 'plain', nxt: 'dqstr' } }, { $key: 'dqstr:dq2', value: '""', data: null }, { $key: 'plain:$border', value: '', data: { prv: 'dqstr', nxt: 'plain' } }, { $key: 'plain:text', value: ' xyz', data: null }, { $key: 'plain:nl', value: '\n', data: null } ], null ]
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
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value', 'data'
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,       pattern: /\\(?<chr>.)/u,    reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'c_lsr',  jump: '[tag]',    pattern: '</>',             reserved: '<', }
      lexer.add_lexeme { mode, lxid: 'lpb',    jump: '[tag',     pattern: '<',               reserved: '<', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
      lexer.add_reserved_lexeme { mode, lxid: '$forbidden', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'lbp',    jump: null,           pattern: '<',            reserved: '<', }
      lexer.add_lexeme { mode, lxid: 'rbp',    jump: null,           pattern: '>',            reserved: '>', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
      lexer.add_reserved_lexeme { mode, lxid: '$forbidden', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo', data: null } ], null ]
    [ 'abc</>def<what>', [ { $key: 'plain:text', value: 'abc', data: null }, { $key: 'plain:$border', value: '', data: { prv: 'plain', nxt: 'tag' } }, { $key: 'tag:c_lsr', value: '</>', data: null }, { $key: 'plain:$border', value: '', data: { prv: 'tag', nxt: 'plain' } }, { $key: 'plain:text', value: 'def', data: null }, { $key: 'tag:$border', value: '', data: { prv: 'plain', nxt: 'tag' } }, { $key: 'tag:lpb', value: '<', data: null }, { $key: 'tag:text', value: 'what', data: null }, { $key: 'tag:rbp', value: '>', data: null } ], null ]
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
        result.push GUY.props.pick_with_fallback token, null, '$key', 'value', 'data'
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'lpb',    jump: '[tag',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'dq1'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'rpb',    jump: '.]',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'lpb',    jump: '[tag',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'rpb',    jump: '.]',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:nl', value: '\n', x1: 4, x2: 4 } ], null ]
    [ 'helo<t1>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'tag:$border', value: '|', x1: 4, x2: 4 }, { $key: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:$border', value: '|', x1: 8, x2: 8 }, { $key: 'plain:nl', value: '\n', x1: 8, x2: 8 } ], null ]
    [ 'helo<t1><t2>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'tag:$border', value: '|', x1: 4, x2: 4 }, { $key: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:$border', value: '|', x1: 8, x2: 8 }, { $key: 'tag:$border', value: '|', x1: 8, x2: 8 }, { $key: 'tag:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'tag:rpb', value: '>', x1: 11, x2: 12 }, { $key: 'plain:$border', value: '|', x1: 12, x2: 12 }, { $key: 'plain:nl', value: '\n', x1: 12, x2: 12 } ], null ]
    [ 'helo<t1><t2', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'tag:$border', value: '|', x1: 4, x2: 4 }, { $key: 'tag:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'tag:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:$border', value: '|', x1: 8, x2: 8 }, { $key: 'tag:$border', value: '|', x1: 8, x2: 8 }, { $key: 'tag:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'tag:nl', value: '\n', x1: 11, x2: 11 } ], null ]
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
      result.push GUY.props.pick_with_fallback token, null, '$key', 'value', 'x1', 'x2'
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
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'lpb',    jump: 'tag[',         pattern: /</u,            reserved: '<', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode, lxid: 'escchr', jump: null,           pattern: /\\(?<chr>.)/u, reserved: '\\', }
      lexer.add_lexeme { mode, lxid: 'rpb',    jump: '].',           pattern: />/u, reserved: '>', }
      lexer.add_lexeme { mode, lxid: 'nl',     jump: null,           pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, lxid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'helo', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:nl', value: '\n', x1: 4, x2: 4 } ], null ]
    # [ 'helo<t1>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:nl', value: '\n', x1: 8, x2: 8 } ], null ]
    # [ 'helo<t1><t2>', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:$border', value: '|', x1: 9, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'plain:$border', value: '|', x1: 11, x2: 11 }, { $key: 'plain:rpb', value: '>', x1: 11, x2: 12 }, { $key: 'plain:nl', value: '\n', x1: 12, x2: 12 } ], null ]
    # [ 'helo<t1><t2', [ { $key: 'plain:text', value: 'helo', x1: 0, x2: 4 }, { $key: 'plain:lpb', value: '<', x1: 4, x2: 5 }, { $key: 'tag:$border', value: '|', x1: 5, x2: 5 }, { $key: 'tag:text', value: 't1', x1: 5, x2: 7 }, { $key: 'plain:$border', value: '|', x1: 7, x2: 7 }, { $key: 'plain:rpb', value: '>', x1: 7, x2: 8 }, { $key: 'plain:lpb', value: '<', x1: 8, x2: 9 }, { $key: 'tag:$border', value: '|', x1: 9, x2: 9 }, { $key: 'tag:text', value: 't2', x1: 9, x2: 11 }, { $key: 'tag:nl', value: '\n', x1: 11, x2: 11 } ], null ]
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
      result.push GUY.props.pick_with_fallback token, null, '$key', 'value', 'x1', 'x2'
    result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
    echo [ probe, result, error, ]
    H.norm_tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
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
  { DATOM }           = require '../../../apps/datom'
  { new_datom }       = DATOM
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
      token = lets token, ( token ) -> token.$key = "#{token.mode}:text"
      return { token, }
    #.......................................................................................................
    lexer.add_lexeme { mode: 'plain',   lxid: 'escchr',    jump: null,           pattern:  /\\(?<chr>.)/u,     }
    lexer.add_lexeme { mode: 'plain',   lxid: 'star1',     jump: null,           pattern:  /(?<!\*)\*(?!\*)/u, }
    lexer.add_lexeme { mode: 'plain',   lxid: 'codespan',  jump: enter_codespan, pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'plain',   lxid: 'other',     jump: null,           pattern:  /[^*`\\]+/u,        }
    lexer.add_lexeme { mode: 'literal', lxid: 'codespan',  jump: exit_codespan,  pattern:  /(?<!`)`+(?!`)/u,   }
    lexer.add_lexeme { mode: 'literal', lxid: 'text',      jump: null,           pattern:  /(?:\\`|[^`])+/u,   }
    #.......................................................................................................
    return lexer
  #.........................................................................................................
  $parse_md_codespan = ->
    return ( d, send ) ->
      switch d.$key
        when  'plain:codespan'
          send stamp d
          send new_datom 'html:tag', { value: '<code>', }
        when 'literal:codespan'
          send stamp d
          send new_datom 'html:tag', { value: '</code>', }
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
      p.push ( source, send ) -> send e for e from md_lexer.walk source
      p.push H.$parse_md_star()
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


#===========================================================================================================
# JUMP FUNCTIONS
#-----------------------------------------------------------------------------------------------------------
@jump_function_return_values = ( T, done ) ->
  { Interlex }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( enter_marks ) ->
    lexer   = new Interlex { dotall: false, }
    do =>
      mode = 'p'
      lexer.add_lexeme { mode, lxid: 'L', jump: enter_marks,  pattern:  /\[/u,                }
      lexer.add_lexeme { mode, lxid: 'P', jump: null,         pattern:  /[^\[\\]+/u,          }
    #.........................................................................................................
    do =>
      mode = 'm'
      lexer.add_lexeme { mode, lxid: 'R', jump: '.]',         pattern:  /\]/u, reserved: ']', }
      lexer.add_lexeme { mode, lxid: 'G', jump: null,         pattern:  /[U01234]/u,          }
      lexer.add_reserved_lexeme { mode, lxid: 'forbidden', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  lex = ( lexer, probe ) ->
    R = []
    for token from lexer.walk probe
      R.push "#{token.$key}#{rpr token.value}"
    return R.join '|'
  #.........................................................................................................
  T?.eq ( lex ( new_lexer     '[m'  ), "[32] what?" ), "m:L'['|m:G'3'|m:G'2'|m:R']'|p:P' what?'"
  T?.eq ( lex ( new_lexer     '[m]' ), "[32] what?" ), "m:L'['|p:P'32] what?'"
  T?.eq ( lex ( new_lexer     null  ), "[32] what?" ), "p:L'['|p:P'32] what?'"
  T?.eq ( lex ( new_lexer ->  '[m'  ), "[32] what?" ), "m:L'['|m:G'3'|m:G'2'|m:R']'|p:P' what?'"
  T?.eq ( lex ( new_lexer ->  '[m]' ), "[32] what?" ), "m:L'['|p:P'32] what?'"
  T?.eq ( lex ( new_lexer ->  null  ), "[32] what?" ), "p:L'['|p:P'32] what?'"
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@jump_property_value = ( T, done ) ->
  { Interlex }        = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( enter_marks ) ->
    lexer   = new Interlex { dotall: false, }
    do =>
      mode = 'p'
      lexer.add_lexeme { mode, lxid: 'L', jump: enter_marks,  pattern:  /\[/u,                }
      lexer.add_lexeme { mode, lxid: 'P', jump: null,         pattern:  /[^\[\\]+/u,          }
    #.........................................................................................................
    do =>
      mode = 'm'
      lexer.add_lexeme { mode, lxid: 'R', jump: '.]',         pattern:  /\]/u, reserved: ']', }
      lexer.add_lexeme { mode, lxid: 'G', jump: null,         pattern:  /[U01234]/u,          }
      lexer.add_reserved_lexeme { mode, lxid: 'forbidden', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  lex = ( lexer, probe ) ->
    R = []
    for token from lexer.walk probe
      jump = if token.jump? then ( rpr token.jump ) else '-'
      R.push "#{token.$key}#{jump}"
    return R.join '|'
  #.........................................................................................................
  help 'Ω___1', rpr ( lex ( new_lexer     '[m'  ), "[32] what?" )
  help 'Ω___2', rpr ( lex ( new_lexer     '[m]' ), "[32] what?" )
  help 'Ω___3', rpr ( lex ( new_lexer     null  ), "[32] what?" )
  help 'Ω___4', rpr ( lex ( new_lexer ->  '[m'  ), "[32] what?" )
  help 'Ω___5', rpr ( lex ( new_lexer ->  '[m]' ), "[32] what?" )
  help 'Ω___6', rpr ( lex ( new_lexer ->  null  ), "[32] what?" )
  #.........................................................................................................
  T?.eq ( lex ( new_lexer     '[m'  ), "[32] what?" ), "m:L'm'|m:G-|m:G-|m:R'p'|p:P-"
  T?.eq ( lex ( new_lexer     '[m]' ), "[32] what?" ), "m:L'p'|p:P-"
  T?.eq ( lex ( new_lexer     null  ), "[32] what?" ), "p:L-|p:P-"
  T?.eq ( lex ( new_lexer ->  '[m'  ), "[32] what?" ), "m:L'm'|m:G-|m:G-|m:R'p'|p:P-"
  T?.eq ( lex ( new_lexer ->  '[m]' ), "[32] what?" ), "m:L'p'|p:P-"
  T?.eq ( lex ( new_lexer ->  null  ), "[32] what?" ), "p:L-|p:P-"
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # @jump_function_return_values()
  # test @jump_function_return_values
  @jump_property_value()
  test @jump_property_value
  # test @markup_with_variable_length
  # test @auto_inserted_border_posts_exclusive
  # @singular_jumps()
  # test @singular_jumps
  # test @new_syntax_for_in_and_exclusive_jumps_1
  # @new_syntax_for_in_and_exclusive_jumps_2()
  # test @new_syntax_for_in_and_exclusive_jumps_2



