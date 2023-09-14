
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'intersock/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
types                     = new ( require 'intertype-newest' ).Intertype()
{ isa }                   = types

# #-----------------------------------------------------------------------------------------------------------
# @[ "_XEMITTER: _" ] = ( T, done ) ->
#   { DATOM }                 = require '../../../apps/datom'
#   { new_datom
#     select }                = DATOM
  # { Djehuti }               = require '../../../apps/intertalk'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ key, value, ] = probe
#       resolve new_datom key, value
#   done()
#   return null

#-----------------------------------------------------------------------------------------------------------
@intersock_connect = ( T, done ) ->
  { WebSocket } = require '../../../apps/intersock/node_modules/ws'
  #.........................................................................................................
  # const ws = new WebSocket('ws://www.host.com/path');

  # ws.on('error', console.error);

  # ws.on('open', function open() {
  #   ws.send('something');
  # });

  # ws.on('message', function message(data) {
  #   console.log('received: %s', data);
  #.........................................................................................................
  done()




############################################################################################################
if require.main is module then do =>
  test @
  # test @time_exports
  # @time_stamp()
  # @time_monostamp()
  # test @time_datatypes



