



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
  SL = require '../../../apps/intertext-splitlines'
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
      result  = [ ( SL.walk_lines ctx, probe )..., ]
      result  = [ result..., ( SL.flush ctx )..., ]
      resolve result
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "SPLITLINES assemble longer input" ] = ( T, done ) ->
  inputs = [
    "helo"
    " there!\nHere "
    "come\na few lines\n"
    "of text that are\nquite unevenly "
    "spread over several\n"
    "buffers.\n"
    ]
  inputs = ( Buffer.from d for d in inputs )
  SL      = require '../../../apps/intertext-splitlines'
  #.........................................................................................................
  ctx     = SL.new_context()
  result  = []
  for input in inputs
    result = [ result..., ( SL.walk_lines ctx, input )..., ]
  result = [ result..., ( SL.flush ctx )..., ]
  T.eq result, [ 'helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.' ]
  #.........................................................................................................
  ctx     = SL.new_context { skip_empty_last: false, }
  result  = []
  for input in inputs
    result = [ result..., ( SL.walk_lines ctx, input )..., ]
  result = [ result..., ( SL.flush ctx )..., ]
  T.eq result, [ 'helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.', '' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "SPLITLINES.splitlines" ] = ( T, done ) ->
  inputs = [
    "helo"
    " there!\nHere "
    "come\na few lines\n"
    "of text that are\nquite unevenly "
    "spread over several\n"
    "buffers.\n"
    ]
  matcher = [ 'helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.' ]
  inputs  = ( Buffer.from d for d in inputs )
  SL      = require '../../../apps/intertext-splitlines'
  T.eq ( SL.splitlines inputs ), matcher
  T.eq ( SL.splitlines inputs... ), matcher
  T.eq ( SL.splitlines {}, inputs... ), matcher
  T.eq ( SL.splitlines null, inputs... ), matcher
  T.eq ( SL.splitlines { skip_empty_last: false, }, inputs... ), [ matcher..., '', ]
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "SPLITLINES.splitlines can return buffers" ] = ( T, done ) ->
  inputs = [
    "helo"
    " there!\nHere "
    "come\na few lines\n"
    "of text that are\nquite unevenly "
    "spread over several\n"
    "buffers.\n"
    ]
  inputs  = ( Buffer.from d for d in inputs )
  matcher = [ 'helo there!', 'Here come', 'a few lines', 'of text that are', 'quite unevenly spread over several', 'buffers.' ]
  matcher = ( Buffer.from d for d in matcher )
  SL      = require '../../../apps/intertext-splitlines'
  T.eq ( SL.splitlines { decode: false,                         }, inputs... ), matcher
  T.eq ( SL.splitlines { decode: false, skip_empty_last: false, }, inputs... ), [ matcher..., ( Buffer.from '' ), ]
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "SPLITLINES can keep line endings" ] = ( T, done ) ->
  inputs = [
    "helo"
    " there!\nHere "
    "come\na few lines\n"
    "of text that are\nquite unevenly "
    "spread over several\n"
    "buffers.\n"
    ]
  inputs  = ( Buffer.from d for d in inputs )
  matcher = [ 'helo there!\n', 'Here come\n', 'a few lines\n', 'of text that are\n', 'quite unevenly spread over several\n', 'buffers.\n' ]
  matcher = ( Buffer.from d for d in matcher )
  SL      = require '../../../apps/intertext-splitlines'
  result  = ( SL.splitlines { decode: false, keep_newlines: true, }, inputs... )
  help '^3334^', result
  T.eq result, matcher
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  inputs = [
    "helo"
    " there!\nHere "
    "come\na few lines\n"
    "of text that are\nquite unevenly "
    "spread over several\n"
    "buffers."
    ]
  inputs = ( Buffer.from d for d in inputs )
  SL      = require '../../../apps/intertext-splitlines'
  ctx     = SL.new_context()
  for input in inputs
    for line from SL.walk_lines ctx, input
      info rpr line
  for line from SL.flush ctx
    info rpr line
  return null


############################################################################################################
if module is require.main then do =>
  demo()
  test @
  # test @[ "SPLITLINES basic" ]
  # test @[ "SPLITLINES assemble longer input" ]
