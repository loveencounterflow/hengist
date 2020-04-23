

'use strict'


############################################################################################################
CND                       = require 'cnd'
badge                     = 'JAKE-DEMO'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
defer                     = setImmediate
async                     = {}
sync                      = { concurrency: 1, }
# async                     = { async: true, }
#...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   cast
#   type_of }               = types
JAKE                      = require 'jake'
{ desc
  task }                  = JAKE
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
sh                        = ( require 'exec-sh' ).promise

#-----------------------------------------------------------------------------------------------------------
invoke  = ( name, P... ) -> await ( JAKE.Task[ name ] ).invoke  P...
execute = ( name, P... ) -> await ( JAKE.Task[ name ] ).execute P...
call    = ( name, P... ) -> await ( JAKE.Task[ name ] ) P...

desc 'A'
task 'A', { async: true, }, -> new Promise ( resolve ) ->
  help '(A'
  await after 0.5, -> warn 'A)'; resolve()

desc 'B'
task 'B', -> new Promise ( resolve ) ->
  help '(B'
  await after 0.5, -> warn 'B)'; resolve()

desc 'C' ### TAINT jake does not wait for completion, must use Promise ###
task 'C', { async: true, }, ->
  help '(C'
  await after 0.5, -> warn 'C)'

desc 'G'
task 'G', -> new Promise ( resolve ) ->
  help '(G'
  await execute 'A'
  await execute 'B'
  await execute 'A'
  await execute 'B'
  await after 0.5, -> warn 'G)'; resolve()

# desc 'K'
# task 'K', -> new Promise ( resolve ) ->
#   help '(K'
#   debug rpr ( k for k of JAKE.Task[ 'A' ]); process.exit 1
#   await call 'A'
#   await call 'B'
#   await call 'A'
#   await call 'B'
#   await after 0.5, -> warn 'K)'; resolve()

desc 'H'
task 'H', [ 'A', 'B', ], -> new Promise ( resolve ) ->
  help '(H'
  await after 0.5, -> warn 'H)'; resolve()


# #===========================================================================================================
# #
# #-----------------------------------------------------------------------------------------------------------
# desc "whatever"
# task 'default', -> new Promise ( resolve ) =>
#   whisper rpr ( k for k of JAKE.Task ).sort()
#   await after 0.5, -> resolve 42

# #-----------------------------------------------------------------------------------------------------------
# desc "demo async with await"
# task 'demo_async_with_await', sync, ->
#   urge "demo_async_with_await"
#   await after 0.5, -> new Promise ( resolve ) =>
#     info "demo_async_with_await ok"
#     resolve()

# #-----------------------------------------------------------------------------------------------------------
# desc "demo async with promise resolve"
# task 'demo_async_with_promise_resolve', [], sync, -> new Promise ( resolve ) =>
#   urge "demo_async_with_promise_resolve"
#   after 0.5, =>
#     info "demo_async_with_promise_resolve ok"
#     resolve()

# #-----------------------------------------------------------------------------------------------------------
# desc "demo async with promise resolve 2"
# task 'demo_async_with_promise_resolve_2', [], -> new Promise ( resolve ) =>
#   urge "demo_async_with_promise_resolve_2"
#   after 0.5, =>
#     info "demo_async_with_promise_resolve_2 ok"
#     resolve()

# #-----------------------------------------------------------------------------------------------------------
# desc "demo sync with async dependency"
# task 'demo_sync', sync, ->
#   await invoke 'demo_async_with_await'
#   await invoke 'demo_async_with_promise_resolve'
#   await invoke 'demo_async_with_promise_resolve_2'
#   await invoke 'f'
#   info "demo_sync"
#   return null

# #-----------------------------------------------------------------------------------------------------------
# desc "demo sync with async dependency using execute"
# task 'demo_sync_using_execute', sync, ->
#   await execute 'demo_async_with_await'
#   await execute 'demo_async_with_await'
#   await execute 'demo_async_with_promise_resolve'
#   await execute 'demo_async_with_promise_resolve_2'
#   await execute 'f'
#   info "demo_sync"
#   return null

# #-----------------------------------------------------------------------------------------------------------
# desc "failing demo sync with async dependency"
# task 'demo_sync_fails', [ 'demo_async', ], sync, ->
#   info "demo_sync_fails"
#   return null

#-----------------------------------------------------------------------------------------------------------
desc "install all npm dependencies"
task 'intershop_npm_install', -> new Promise ( resolve ) =>
  await sh """( cd intershop && npm install && npm audit )"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
desc "devcycle"
task 'devcycle', [], -> new Promise ( resolve ) =>
  await sh """( cd ~/jzr/intershop && coffee --map -o intershop_modules -c intershop_modules )"""
  await sh """intershop refresh-mirage-datasources"""
  await sh """intershop psql -c "select * from MIRAGE.mirror order by dsk, dsnr, linenr;\""""
  resolve()

#-----------------------------------------------------------------------------------------------------------
desc "demo command"
task 'f', [], -> new Promise ( resolve ) =>
  debug '^33365^', process.argv
  invoke 'default', 42
  # process.argv.pop()
  # debug '^33365^', process.argv
  resolve()



############################################################################################################
if module is require.main then do =>
  # await @benchmark()
  return null


