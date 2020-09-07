



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERTEXT-SPLITLINES/TESTS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# _strip_ansi               = require 'strip-ansi'
types                     = new ( require 'intertype' ).Intertype()
{ freeze
  lets }                  = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
# resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
@[ "SPLITLINES basic" ] = ( T, done ) ->
  # SL = require '../../../apps/mixa'
  SL = require './main'
  #.........................................................................................................
  probes_and_matchers = [
    [ 'a short text', [ 'a short text' ], null ]
    [ "some\nlines\nof text", [ 'some', 'lines', 'of text', ], null ]
    ]
  #.........................................................................................................
  for [ input, matcher, error, ] in probes_and_matchers
    await T.perform input, matcher, error, -> return new Promise ( resolve, reject ) ->
      probe   = Buffer.from input
      ctx     = SL.new_context()
      result  = SL.send ctx, probe
      result  = result.concat SL.end ctx
      resolve result
  done()
  return null




############################################################################################################
if module is require.main then do =>
  test @


