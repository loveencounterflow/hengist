
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
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@_window_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline
    $           } = require '../../../apps/moonriver'
  { $window }     = require '../../../apps/moonriver/lib/transforms'
  collector       = []
  mr              = new Pipeline()
  misfit          = Symbol 'misfit'
  #.........................................................................................................
  mr.push $window -2, +2, null
  mr.push show    = ( d ) -> urge '^45-1^', d
  mr.push collect = ( d ) -> collector.push d
  for nr in [ 1 .. 9 ]
    mr.send nr
  mr.run()
  debug '^45-2^', collector
  done?()




############################################################################################################
if require.main is module then do =>
  test @




