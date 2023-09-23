
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
@intersock_connect = ( T, done ) -> new Promise ( resolve, reject ) =>
  { WebSocket         } = require '../../../apps/intersock/node_modules/ws'
  { Intersock_server
    Intersock_client  } = require '../../../apps/intersock'
  cfg     = { port: 9876, }
  server  = new Intersock_server cfg
  client  = new Intersock_client cfg
  debug '^34242^', server.cfg
  await client.connect()
  # help '^342-1^',       server.send 'info', "greetings from server"
  info '^342-2^', await client.send 'info', "greetings from client"
  # #.........................................................................................................
  # ws = new WebSocket server.cfg.url
  # ws.on 'error', ( error ) =>
  #   throw error
  # ws.on 'open', =>
  #   help "opened connection"
  #   ws.send JSON.stringify 'something'
  # ws.on 'message', ( data ) =>
  #   info "received", rpr data
  #.........................................................................................................
  done?()




############################################################################################################
if require.main is module then do =>
  # test @
  await @intersock_connect()
  # test @time_exports
  # @time_stamp()
  # @time_monostamp()
  # test @time_datatypes



