

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERSHOP/TESTS/070-CATALOG'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
FS                        = require 'fs'
# #...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types

#-----------------------------------------------------------------------------------------------------------
resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
@[ "SVGTTF types" ] = ( T, done ) ->
  # SVGTTF = require resolve_project_path 'apps/svgttf'
  SVGTTF = require '../../../apps/svgttf'
  #.........................................................................................................
  probes_and_matchers = [
    # [ [ 'svgttf_svg_transform_fn', 1, ], "translate(1)", ]
    [ [ 'svgttf_svg_transform_name', 'translate', ], true, ]
    [ [ 'svgttf_svg_transform_name', 'skewX', ], true, ]
    [ [ 'svgttf_svg_transform_name', 'rotate', ], true, ]
    [ [ 'svgttf_svg_transform_name', 'xxxtranslate', ], false, ]
    [ [ 'svgttf_svg_transform_name', 42, ], false, ]
    [ [ 'svgttf_svg_transform_value', 42, ], true, ]
    [ [ 'svgttf_svg_transform_value', [ 42, ], ], true, ]
    [ [ 'svgttf_svg_transform_value', 'something', ], true, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ type, value, ] = probe
      resolve SVGTTF.types.isa type, value
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # await @_demo_opentypejs()
  # test @[ "VNR sort 2" ]
  # test @[ "VNR sort 3" ]
  # @[ "VNR sort 3" ]()
  # test @[ "test VNR._first_nonzero_is_negative()" ]
  # @[ "SVGTTF.svg_from_glyphidx()" ]()
  # @[ "SVGTTF.svg_from_harfbuzz_linotype()" ]()
  # @[ "SVGTTF.svg_from_harfbuzz_linotype() (using CJK font)" ]()



