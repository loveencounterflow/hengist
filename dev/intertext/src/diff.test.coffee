#!node

CND                       = require 'cnd'
badge                     = 'DIFF'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ stdin
  stdout
  stderr }                = process
{ Intertype, }            = require 'intertype'
types                     = new Intertype()
{ isa
  validate
  type_of  }              = types.export()
{ to_width, width_of, }   = require 'to-width'
# CAT                       = require 'multimix/lib/cataloguing'
#...........................................................................................................
test                      = require 'guy-test'



#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "DIFF rawdiff" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'helo world', 'Hello World!' ], [ [ -1, 'he' ], [ 1, 'Hel' ], [ 0, 'lo ' ], [ -1, 'w' ], [ 1, 'W' ], [ 0, 'orld' ], [ 1, '!' ] ], null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ old_text
        new_text  ] = probe
      result        = INTERTEXT.DIFF.rawdiff old_text, new_text
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DIFF colordiff" ] = ( T, done ) ->
  ### TAINT should discard / replace color codes to make test less brittle ###
  INTERTEXT                 = require '../../../apps/intertext'
  DIFF                      = INTERTEXT.DIFF.new { tty_columns: 50, }
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'helo world', 'Hello World!' ], '\x1B[7m\x1B[38;05;208mhe\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118mHel\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255mlo \x1B[0m\x1B[27m\x1B[7m\x1B[38;05;208mw\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118mW\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255morld\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118m!\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255m                                   \n', null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ old_text
        new_text  ] = probe
      result        = DIFF.colordiff old_text, new_text
      process.stdout.write result
      resolve result
  #.........................................................................................................
  done()
  return null








############################################################################################################
if module is require.main then do =>
  test @



