
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOONRIVER/BASICS'
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
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@window_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline    } = require '../../../apps/moonriver'
  { $window     } = require '../../../apps/moonriver/lib/transforms'
  collector       = []
  p               = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push $window -2, +2, 0
  p.push show    = ( d        ) -> urge '^45-1^', d
  # p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
  p.push add_up  = ( d, send  ) -> send ( d[ -2 ] + d[ -1 ] ) + d[ 0 ] + ( d[ +1 ] + d[ +2 ] )
  p.push show    = ( d        ) -> help '^45-2^', d
  result = p.run()
  info '^45-2^', result
  T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @window_list_transform = ( T, done ) ->
#   # T?.halt_on_error()
#   GUY             = require '../../../apps/guy'
#   { Pipeline
#     transforms  } = require '../../../apps/moonriver'
#   collector       = []
#   p               = new Pipeline()
#   #.........................................................................................................
#   p.push [ 1 .. 9 ]
#   p.push transforms.$window_list -2, +2, 0
#   p.push show    = ( d        ) -> urge '^45-1^', d
#   # p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
#   p.push add_up  = ( d, send  ) -> send ( d[ -2 ] + d[ -1 ] ) + d[ 0 ] + ( d[ +1 ] + d[ +2 ] )
#   p.push show    = ( d        ) -> help '^45-2^', d
#   result = p.run()
#   info '^45-2^', result
#   T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
#   done?()




############################################################################################################
if require.main is module then do =>
  # @window_transform()
  test @



