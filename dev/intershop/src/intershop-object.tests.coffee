

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERSHOP/TESTS/INTERSHOP-OBJECT'
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
# #...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types
#...........................................................................................................

# #-----------------------------------------------------------------------------------------------------------
# @[ "INTERSHOP object: initializes acc. to project" ] = ( T, done ) ->
#   ### TAINT how to set up mock environment? ###
#   done()

# #-----------------------------------------------------------------------------------------------------------
# @[ "test VNR._first_nonzero_is_negative()" ] = ( T, done ) ->
#   VNR                       = require '../../../apps/datom/lib/vnr'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [[ [3,4,0,0,],        2, ], false, ]
#     [[ [3,4,0,-1,],       2, ], true, ]
#     [[ [3,4,0,-1,0,0,],   2, ], true, ]
#     [[ [3,4,0,1,-1,0,0,], 2, ], false, ]
#     [[ [3,4,0,1,-1,0,0,], 0, ], false, ]
#     [[ [3,4,0,0,],        3, ], false, ]
#     [[ [3,4,0,0,],        4, ], false, ]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ list, first_idx, ] = probe
#       resolve VNR._first_nonzero_is_negative list, first_idx
#   done()
#   return null

############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "VNR sort 2" ]
  # test @[ "VNR sort 3" ]
  # @[ "VNR sort 3" ]()
  # test @[ "test VNR._first_nonzero_is_negative()" ]




