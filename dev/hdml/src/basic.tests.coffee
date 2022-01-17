
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HDML/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
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
guy                       = require '../../../apps/guy'

#-----------------------------------------------------------------------------------------------------------
@[ "basics" ] = ( T, done ) ->
  # T?.halt_on_error()
  { HDML
    Hdml } = require '../../../apps/hdml'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '<', 'foo' ], '<foo>', null ]
    [ [ '<', 'foo', null ], '<foo>', null ]
    [ [ '<', 'foo', {} ], '<foo>', null ]
    [ [ '<', 'foo', { a: 42, b: "'", c: '"' } ], """<foo a='42' b='&#39;' c='"'>""", null ]
    [ [ '^', 'foo', { a: 42, b: "'", c: '"' } ], """<foo a='42' b='&#39;' c='"'/>""", null ]
    [ [ '^', 'prfx:foo', { a: 42, b: "'", c: '"' } ], """<prfx:foo a='42' b='&#39;' c='"'/>""", null ]
    [ [ '^', 'mrg:loc#baselines' ], '<mrg:loc#baselines/>', null ]
    # [ [ '^', '$text' ], '<mrg:loc#baselines/>', null ]
    [ [ '>', 'foo' ], '</foo>', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = HDML.create_tag probe...
      resolve result
      return null
  #.........................................................................................................
  done()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "basics" ]



