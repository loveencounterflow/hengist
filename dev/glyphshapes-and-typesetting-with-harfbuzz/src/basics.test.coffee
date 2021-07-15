

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DATOM/TESTS/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
#...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types


#-----------------------------------------------------------------------------------------------------------
@[ "HB.shape_text() fails on nonexisting font file" ] = ( T, done ) ->
  HB = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz'
  probes_and_matchers = [
    [ { text: 'x', font: { path: 'nosuchfile', }, }, null, "hb-shape: Couldn't read or find nosuchfile, or it was empty.", ]
    ]
  #.........................................................................................................
  debug '^3344^', ( k for k of HB )
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d = HB.shape_text probe
      resolve d
      return null
  done()
  return null





############################################################################################################
if require.main is module then do =>
  test @

