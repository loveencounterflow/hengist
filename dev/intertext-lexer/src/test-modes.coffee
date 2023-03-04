
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

############################################################################################################
if require.main is module then do =>
  test @

