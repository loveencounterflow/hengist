

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/LFTNG-BASICS'
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
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()

#-----------------------------------------------------------------------------------------------------------
resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG API" ] = ( T, done ) ->
  lft_cfg       = { copy: true, freeze: true, }
  LFT           = ( require './letsfreezethat-NG' ).new lft_cfg
  types         =
  #.........................................................................................................
  T.eq 'function', type_of LFT.new_object;  T.eq 0, LFT.new_object.length ### NOTE actually splat argument ###
  T.eq 'function', type_of LFT.assign;      T.eq 1, LFT.assign.length ### NOTE actually splat argument ###
  T.eq 'function', type_of LFT.freeze;      T.eq 1, LFT.freeze.length
  T.eq 'function', type_of LFT.thaw;        T.eq 1, LFT.thaw.length
  T.eq 'function', type_of LFT.lets;        T.eq 2, LFT.lets.length
  T.eq 'function', type_of LFT.get;         T.eq 2, LFT.get.length
  T.eq 'function', type_of LFT.set;         T.eq 3, LFT.set.length
  #.........................................................................................................
  done()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "LFTNG API" ] = ( T, done ) ->
#   lft_cfg       = { copy: true, freeze: true, }
#   LFT           = ( require './letsfreezethat-NG' ).new lft_cfg
#   #.........................................................................................................
#   probes_and_matchers = []
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ type, value, ] = probe
#       resolve LFTNG.types.isa type, value
#   done()
#   return null



############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "test VNR._first_nonzero_is_negative()" ]



