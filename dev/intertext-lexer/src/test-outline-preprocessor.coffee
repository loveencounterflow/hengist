
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/OUTLINE-PREPROC'
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
@outline_preprocessor_instantiation = ( T, done ) ->
  { Interlex
    compose
    tools   } = require '../../../apps/intertext-lexer'
  #.........................................................................................................
  probes_and_matchers = [
    [ null, { blank_line_count: 2, indent_module: 2, }, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      parser  = new tools.outline._Preparser probe
      resolve parser.cfg
  #.........................................................................................................
  # lexer = new Interlex()
  # debug '^23423^', lexer.types.create.ilx_walk_source_or_cfg null
  done?()
  return null


#-----------------------------------------------------------------------------------------------------------
@outline_preprocessor_basic = ( T, done ) ->
  { Interlex
    compose
    tools       } = require '../../../apps/intertext-lexer'
  { Transformer } = require '../../../apps/moonriver'
  #.........................................................................................................
  probes_and_matchers = [
    [ '', "N", null ]
    [ 'helo', "0'helo'", null ]
    [ 'abc\ndef', "0'abc',0'def'", null ]
    [ 'abc\ndef\n\n', "0'abc',0'def',N,N", null ]
    [ 'abc\ndef\n\n\nxyz', "0'abc',0'def',N,N,0'xyz'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      # echo '^97-1^', '————————————————————————————'
      result      = []
      tokens      = []
      parser      = tools.outliner.$010_lexing.as_pipeline()
      parser.send probe
      for d from parser.walk probe
        tokens.push d
        switch d.tid
          when 'blank'
            result.push 'N'
          when 'material'
            result.push "#{d.data.level}#{rpr d.value}"
      result = result.join ','
      # debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
      # H.tabulate "#{rpr probe}", tokens
      # echo [ probe, result, error, ]
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@outline_blank_line_consolidation = ( T, done ) ->
  { Interlex
    compose
    tools       } = require '../../../apps/intertext-lexer'
  { Transformer } = require '../../../apps/moonriver'
  #.........................................................................................................
  probes_and_matchers = [
    [ '', "N", null ]
    [ 'helo', "0'helo'", null ]
    [ 'abc\ndef', "0'abc',0'def'", null ]
    [ 'abc\ndef\n\n', "0'abc',0'def',N,N", null ]
    [ 'abc\ndef\n\n\nxyz', "0'abc',0'def',N,N,0'xyz'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      # echo '^97-1^', '————————————————————————————'
      result      = []
      tokens      = []
      parser      = tools.outliner.$020_consolidate.as_pipeline()
      parser.send probe
      for d from parser.walk probe
        tokens.push d
        switch d.tid
          when 'blank'
            result.push 'N'
          when 'material'
            result.push "#{d.data.level}#{rpr d.value}"
      result = result.join ','
      # debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
      H.tabulate "#{rpr probe}", tokens
      # echo [ probe, result, error, ]
      resolve result
  #.........................................................................................................
  done?()
  return null


############################################################################################################
if require.main is module then do =>
  # @outline_preprocessor_instantiation()
  # @outline_preprocessor_basic()
  # test @outline_preprocessor_basic
  test @outline_blank_line_consolidation
  # test @
