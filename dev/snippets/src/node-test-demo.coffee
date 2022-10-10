

'use strict'


############################################################################################################
GUY                       = require 'guy'
{ debug
  info
  whisper
  warn
  urge
  help }                  = GUY.trm.get_loggers 'METTEUR'
{ rpr
  echo }                  = GUY.trm
#...........................................................................................................
### thx to https://github.com/nodejs/node/issues/30810#issuecomment-1107861393 ###
_emitWarning = process.emitWarning.bind process
process.emitWarning = ( message, type ) ->
  return whisper message if type is 'ExperimentalWarning'
  return _emitWarning message, type
#...........................................................................................................
test                      = require 'node:test'

debug '^3453^', test
debug '^3453^', ( k for k of test )

# test "^tc-1^ 42 > 1", ( t ) -> throw new Error "foo" unless 42 > 1
# test "^tc-2^ 42 < 0", ( t ) -> throw new Error "foo" unless 42 < 0
# test "^tc-3^ 42 < 0", ( t, done ) -> done()
# test "^tc-4^ 42 < 0", ( t, done ) -> done false
# test "^tc-5^ 42 < 0", ( t, done ) -> done true
# test "^tc-5^ 42 < 0", ( t, done ) -> throw new Error "foobar"
test "^tc-6^ 42 < 0", ( t ) ->
  for n in [ 1 .. 3 ]
    t.test "subtest #{n}", -> true
  return null


