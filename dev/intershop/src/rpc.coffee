
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERSHOP/RPC'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'

# #-----------------------------------------------------------------------------------------------------------
# @[ "_XEMITTER: _" ] = ( T, done ) ->
#   DATOM                     = require '../../../apps/datom'
#   { new_datom
#     select }                = DATOM.export()
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
@_serve = ->
  Rpc                       = require '../../../apps/intershop-rpc'
  DB                        = require '../../../apps/intershop/intershop_modules/db'
  DATOM                     = require '../../../apps/datom'
  rpc                       = new Rpc 23001
  await rpc.start()

#-----------------------------------------------------------------------------------------------------------
@[ "INTERSHOP-RPC basics" ] = ( T, done ) ->
  Rpc                       = require '../../../apps/intershop-rpc'
  DB                        = require '../../../apps/intershop/intershop_modules/db'
  DATOM                     = require '../../../apps/datom'
  rpc                       = new Rpc 23001
  # debug '^hengist@100^', "rpc:" rpc
  await rpc.start()
  rpc.contract '^add-42', (       d ) -> help '^hengist@101^ contract', d; return ( ( d ? {} ).x ? 0 ) + 42
  rpc.listen_to_all       ( key,  d ) -> urge "^hengist@102^ listen_to_all     ", d
  rpc.listen_to_unheard   ( key,  d ) -> warn "^hengist@103^ listen_to_unheard ", d
  await rpc.emit '^foobar', 108
  help '^hengist@104^', await rpc.delegate '^add-42', { x: 123, }
  # help '^hengist@105^', await rpc.delegate { '^add-42', x: 123, }
  # help '^hengist@106^', await rpc.delegate { '^add-42', $value: { x: 123, }, }
  # debug '^hengist@107^', await rpc.delegate '^add-42', 123
  T.eq ( await rpc.delegate DATOM.new_datom '^add-42', 123          ), 42
  T.eq ( await rpc.delegate DATOM.new_datom '^add-42', { x: 123, }  ), 165
  T.eq ( await DB.query         [ "select IPC.server_is_online()"                       ] ), [ { server_is_online: true } ]
  T.eq ( await DB.query         [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), [ { send: '' } ]
  T.eq ( await DB.query         [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), [ { rpc: 1042 } ]
  T.eq ( await DB.query_single  [ "select IPC.server_is_online()"                       ] ), true
  T.eq ( await DB.query_single  [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), ''
  T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042






  # debug '^hengist@112^', await DB.query [ "select * from IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ]
  # debug '^hengist@113^', await DB.query [ "select * from CATALOG.catalog;", $key, ]
  # for row in await DB.query [ "select * from CATALOG.catalog order by schema, name;", ]
  #   whisper '^hengist@114^', "#{row.schema}/#{row.name}"
  done()
  # await rpc.stop()
  # process.exit 0



############################################################################################################
if module is require.main then do =>
  test @
  # @_serve()


