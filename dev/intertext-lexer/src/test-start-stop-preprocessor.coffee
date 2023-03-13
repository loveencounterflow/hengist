
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/START-STOP-PREPROC'
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



#===========================================================================================================
# START AND STOP TOKENS
#-----------------------------------------------------------------------------------------------------------
@start_stop_preprocessor_instantiation = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  probes_and_matchers = [
    [ null, { active: true, joiner: null, eraser: ' ' }, ]
    [ {}, { active: true, joiner: null, eraser: ' ' }, ]
    [ { active: false, }, { active: false, joiner: null, eraser: ' ' }, ]
    [ { active: true, }, { active: true, joiner: null, eraser: ' ' }, ]
    [ { active: true, joiner: '', }, { active: true, joiner: '', eraser: null, }, ]
    [ { active: true, joiner: 'x', }, { active: true, joiner: 'x', eraser: null, }, ]
    [ { active: true, joiner: 'x', eraser: '', }, null, /cannot set both `joiner` and `eraser`/ ]
    [ { active: true, eraser: '\x00', }, { active: true, joiner: null, eraser: '\x00' }, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      parser  = new tools.Start_stop_preprocessor probe
      result  = GUY.props.pick_with_fallback parser.cfg, null, 'active', 'joiner', 'eraser'
      # debug '^24243^', probe, result
      resolve result
  #.........................................................................................................
  # lexer = new Interlex()
  # debug '^23423^', lexer.types.create.ilx_walk_source_or_cfg null
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@start_stop_preprocessor_basic = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'helo', { active: false, }, ], [ [ 'helo\n', false ] ], null ]
    [ [ 'helo', { active: true, }, ], [ [ 'helo\n', true ] ], null ]
    [ [ 'helo <?start?>world<?stop?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop_all?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop-all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop-all?>!\n', false ] ], null ]
    [ [ 'helo <?start?>world<?stop-all\\?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world<?stop-all\\?>!\n', true ] ], null ]
    [ [ 'helo <?start?>world\n<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world\n', true ], [ '<?stop_all?>!\n', false ] ], null ]
    [ [ 'abc\ndef<?stop?>comments\ngo\nhere\n', { active: true } ], [ [ 'abc\n', true ], [ 'def', true ], [ '<?stop?>comments\n', false ], [ 'go\n', false ], [ 'here\n', false ] ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
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
      # echo [ probe, result, error, ]
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@positioning_api = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'number',   pattern: /[0-9]+/u,       reserved: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ], }
      lexer.add_lexeme { mode, tid: 'ws',       pattern: /\s+/u,          reserved: ' ', }
      lexer.add_lexeme { mode, tid: 'nl',       pattern: /$/u, value: '\n', }
      lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'helo', { lnr: 3, x: 10, } ], "text'helo'3,10,3,14|nl'\\n'3,14,3,14", null ]
    [ [ 'helo', { lnr: 3, x: -10, } ], null, /not a valid ilx_set_offset_cfg/, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      [ source
        offset  ] = probe
      result      = []
      tokens      = []
      lexer       = new_lexer()
      lexer.set_offset offset
      for d from lexer.walk source
        urge '^33-2^', rpr d.value
        tokens.push d
        result.push "#{d.tid}#{rpr d.value}#{d.lnr1},#{d.x1},#{d.lnr2},#{d.x2}"
      # debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
      H.tabulate "#{rpr probe}", tokens
      result = result.join '|'
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@start_stop_preprocessor_positioning = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  new_lexer = ( cfg ) ->
    lexer   = new Interlex { split: 'lines', cfg..., }
    #.........................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode, tid: 'any',    pattern: /.+/u, }
      # lexer.add_lexeme { mode, tid: 'escchr',   pattern: /\\(?<chr>.)/u,  reserved: '\\', }
      # lexer.add_lexeme { mode, tid: 'number',   pattern: /[0-9]+/u,       reserved: [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ], }
      # lexer.add_lexeme { mode, tid: 'ws',       pattern: /\s+/u,          reserved: ' ', }
      lexer.add_lexeme { mode, tid: 'nl',     pattern: /$/u, value: '\n', }
      # lexer.add_catchall_lexeme { mode, tid: 'text', concat: true, }
    #.........................................................................................................
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    # [ [ 'helo', { active: false, }, ], [ [ 'helo\n', false ] ], null ]
    # [ [ 'helo <?start?>world<?stop?>!', { active: false, }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
    [ [ 'abc<?start?>def\nghi<?start?>uvw\nxyz', { active: false, joiner: '%', }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
    [ [ 'abc<?stop?>def\nghi\n<?start?>uvw\nxyz', { active: true, joiner: '%', }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
    [ [ 'abc<?stop?>whatever<?start?>xyz', { active: true, joiner: '%', }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
    [ [ '<?stop?>whatever<?start?>xyz', { active: true, joiner: '%', }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
       # abc                         xyz⏎
    # [ [ 'helo <?start?>\nworld<?stop?>\n<?start?>!!', { active: false, }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]
    # [ [ 'helo <?stop?>comments\ngo\nhere\n', { active: true } ], [ [ 'helo ', true ], [ '<?stop?>comments\n', false ], [ 'go\n', false ], [ 'here\n', false ], [ '\n', false ] ], null ]
    # [ [ 'abc<?stop?><?start?>xyz', { active: true, }, ], "any'world'1,14,1,19|nl'\\n'1,19,1,19", null ]

    # [ [ 'helo <?start?>world<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop_all?>!\n', false ] ], null ]
    # [ [ 'helo <?start?>world<?stop-all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world', true ], [ '<?stop-all?>!\n', false ] ], null ]
    # [ [ 'helo <?start?>world<?stop-all\\?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world<?stop-all\\?>!\n', true ] ], null ]
    # [ [ 'helo <?start?>world\n<?stop_all?>!', { active: false, }, ], [ [ 'helo <?start?>', false ], [ 'world\n', true ], [ '<?stop_all?>!\n', false ] ], null ]
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
    lexer       = new_lexer()
    for d from parser.walk source
      help '^33-1^', ( rpr d.value ), GUY.trm.truth d.data.active
      tokens.push stamp d
      if d.data.active
        lexer.XXX_set_position d # { lnr1, }
        for token from lexer.walk d.value
          tokens.push token
          result.push "#{token.tid}#{rpr token.value}#{token.lnr1},#{token.x1},#{token.lnr2},#{token.x2}"
    # debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
    result_rpr = ( t.value for t in tokens when not t.$stamped ).join '|'
    # H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
    H.tabulate "#{rpr probe} -> #{rpr result_rpr}", ( t for t in tokens when     t.$stamped )
    H.tabulate "#{rpr probe} -> #{rpr result_rpr}", ( t for t in tokens when not t.$stamped )
    result = result.join '|'
    echo [ probe, result, error, ]
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # @positioning_api()
  # test @positioning_api
  # test @start_stop_preprocessor_basic
  # @start_stop_preprocessor_instantiation()
  test @start_stop_preprocessor_instantiation
  # @start_stop_preprocessor_positioning()
  # test @start_stop_preprocessor_positioning
