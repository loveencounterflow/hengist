
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERPLOT/HYPHENATION-OVER-RPC'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types.export()
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
serve = ->
  Rpc                       = require '../../../apps/intershop-rpc'
  # DB                        = require '../../../apps/intershop/intershop_modules/db'
  # DATOM                     = require '../../../apps/datom'
  IX                        = require '../../../apps/intertext'
  after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
  #.........................................................................................................
  rpc = await Rpc.create { show_counts: true, count_interval: 1, }
  #.........................................................................................................
  rpc.contract '^hyphenate',        ( d ) -> hyphenate d.$value
  rpc.contract '^slabs_from_text',  ( d ) -> slabs_from_text d.$value
  rpc.contract '^shyphenate',       ( d ) -> slabs_from_text hyphenate d.$value
    # debug '^447^', rpr text
  #.........................................................................................................
  hyphenate = ( text ) ->
    validate.text text
    return IX.HYPH.hyphenate text
  #.........................................................................................................
  slabs_from_text = ( text ) ->
    validate.text text
    return IX.SLABS.slabs_from_text text

#-----------------------------------------------------------------------------------------------------------
psql_run_file = ( cwd, path ) -> new Promise ( resolve, reject ) =>
  CP                        = require 'child_process'
  ### TAINT must properly escape path literal ###
  command   = "psql -U interplot -d interplot -f \"#{path}\""
  whisper '^psql_run_file@3366^', path
  settings  =
    cwd:    cwd
    shell:  true
    stdio:  [ 'inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn command, null, settings
  cp.on 'close', ( code   ) ->
    return resolve 0 if code is 0
    reject new Error "^psql_run_file@34478^ processs exited with code #{code}"
  cp.on 'error', ( error  ) -> reject error
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERSHOP-RPC basics" ] = ( T, done ) ->
  Rpc                       = require '../../../apps/intershop-rpc'
  DB                        = require '../../../apps/intershop/intershop_modules/db'
  DATOM                     = require '../../../apps/datom'
  #.........................................................................................................
  create_server_two_steps = ->
    rpc = new Rpc()
    await rpc.start()
    return rpc
  #.........................................................................................................
  create_server_one_step = -> await Rpc.create()
  #.........................................................................................................
  # rpc = await create_server_two_steps()
  rpc = await create_server_one_step()
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
  T.eq ( await DB.query         [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), [ { send: '' } ] ### TAINT should be `null` ###
  T.eq ( await DB.query         [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), [ { rpc: 1042 } ]
  T.eq ( await DB.query_single  [ "select IPC.server_is_online()"                       ] ), true
  T.eq ( await DB.query_single  [ "select IPC.send( $1, $2 );", '^add-42', '{"x":1000}' ] ), '' ### TAINT should be `null` ###
  T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
  info rpc.counts
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "INTERPLOT hyphenation" ] = ( T, done ) ->
  await serve()
  await psql_run_file '/home/flow/jzr/interplot', 'db/080-intertext.sql'
  await psql_run_file '/home/flow/jzr/interplot', 'db/100-harfbuzz.sql'
  # cp.stdout.on 'data', ( data ) ->
  #   data = data.toString 'utf-8'
  #   help rpr data
  # cp.stdout.on 'error', ( error ) -> warn "stdout.on 'error'  ", rpr error
  # cp.stderr.on 'data',  ( data )  -> warn "stderr.on 'data'   ", rpr data.toString 'utf-8'
  # cp.stderr.on 'error', ( error ) -> warn "stderr.on 'error'  ", rpr error
  done()


############################################################################################################
if module is require.main then do =>
  # test @
  serve()
  # test @[ "INTERPLOT hyphenation" ], { timeout: 5000, }

