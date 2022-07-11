
'use strict'


############################################################################################################
_GUY                      = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = _GUY.trm.get_loggers 'GUY/trm/tests'
{ rpr
  inspect
  echo
  log     }               = _GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# { freeze }                = require 'letsfreezethat'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()


#-----------------------------------------------------------------------------------------------------------
@[ "GUY.trm.rpr" ] = ( T, done ) ->
  GUY = require '../../../apps/guy'
  trm = GUY.trm.get_loggers 'GUY'
  #.........................................................................................................
  with_capture = ( f ) =>
    _stdout_write = process.stdout.write
    _stderr_write = process.stderr.write
    out           = []
    err           = []
    process.stdout.write  = ( data ) -> out.push data; _stdout_write.call process.stdout, data
    process.stderr.write  = ( data ) -> err.push data; _stderr_write.call process.stderr, data
    try
      f()
    catch error
      throw error
    finally
      process.stdout.write = _stdout_write
      process.stderr.write = _stderr_write
    return { out, err, }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'alert', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[5m\x1B[38;05;124m ⚠ \x1B[0m\x1B[25m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;124mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'debug', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ⚙ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;199mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'help', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;214m ☛ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;118mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'info', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;33mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'plain', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m XXXXXXX\n' ] } ], null ]
    [ 'praise', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;64m ✔ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;64mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'urge', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[1m\x1B[38;05;124m ? \x1B[0m\x1B[22m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;208mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'warn', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[1m\x1B[38;05;124m ! \x1B[0m\x1B[22m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;124mXXXXXXX\x1B[0m\n' ] } ], null ]
    [ 'whisper', [ null, { out: [], err: [ '\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;240mXXXXXXX\x1B[0m\n' ] } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      r = trm[ probe ] 'XXXXXXX'
      s = with_capture -> trm[ probe ] 'XXXXXXX'
      resolve [ r, s, ]
  #.........................................................................................................
  return done?()



############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "GUY.trm.rpr" ]
  # test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]


