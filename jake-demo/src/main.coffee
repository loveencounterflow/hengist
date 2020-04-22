
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
invoke = ( name, P... ) ->
  ( JAKE.Task[ name ] ).invoke()

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
desc "whatever"
task 'default', ( P... ) -> new Promise ( resolve ) =>
  info '^787^', rpr P
  for k in ( k for k of JAKE.Task ).sort()
    urge '^787^', k
  resolve 42

#-----------------------------------------------------------------------------------------------------------
desc "demo async"
task 'demo_async', [ 'default', ], -> new Promise ( resolve ) =>
  info "demo_async"
  resolve()

#-----------------------------------------------------------------------------------------------------------
desc "demo sync"
task 'demo_sync', ->
  info "demo_sync"
  return null

#-----------------------------------------------------------------------------------------------------------
desc "install all npm dependencies"
task 'intershop_npm_install', -> new Promise ( resolve ) =>
  await sh """( cd intershop && npm install && npm audit )"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
desc "devcycle"
task 'devcycle', [], -> new Promise ( resolve ) =>
  await sh """( cd ~/jzr/intershop && coffee --map -o intershop_modules -c intershop_modules )"""
  await sh """peru sync"""
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


