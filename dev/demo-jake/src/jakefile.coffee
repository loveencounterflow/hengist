

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
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
_sh                       = ( require 'exec-sh' ).promise

#-----------------------------------------------------------------------------------------------------------
sh = ( P... ) ->
  try ( R = await _sh P... ) catch error
    warn '^334^', error.message
    return null
  return R

#-----------------------------------------------------------------------------------------------------------
invoke  = ( name, P... ) -> await ( JAKE.Task[ name ] ).invoke  P...
execute = ( name, P... ) -> await ( JAKE.Task[ name ] ).execute P...

#-----------------------------------------------------------------------------------------------------------
task = ( name, P... ) ->
  JAKE.desc name
  JAKE.task name, P...

#-----------------------------------------------------------------------------------------------------------
task 'A', { async: true, }, -> new Promise ( resolve ) ->
  help '(A'
  await after 0.5, -> warn 'A)'; resolve()

#-----------------------------------------------------------------------------------------------------------
task 'B', -> new Promise ( resolve ) ->
  help '(B'
  await after 0.5, -> warn 'B)'; resolve()

#-----------------------------------------------------------------------------------------------------------
task 'C', { async: true, }, ->
  help '(C'
  await after 0.5, -> warn 'C)'

#-----------------------------------------------------------------------------------------------------------
task 'G', -> new Promise ( resolve ) ->
  help '(G'
  await execute 'A'
  await execute 'B'
  await execute 'A'
  await execute 'B'
  await after 0.5, -> warn 'G)'; resolve()

# task 'K', -> new Promise ( resolve ) ->
#   help '(K'
#   debug rpr ( k for k of JAKE.Task[ 'A' ]); process.exit 1
#   await call 'A'
#   await call 'B'
#   await call 'A'
#   await call 'B'
#   await after 0.5, -> warn 'K)'; resolve()

#-----------------------------------------------------------------------------------------------------------
task 'H', [ 'A', 'B', ], -> new Promise ( resolve ) ->
  help '(H'
  await after 0.5, -> warn 'H)'; resolve()

#-----------------------------------------------------------------------------------------------------------
task 'git-updates', [
  'git-update-lib'
  # 'git-update-readmes'
  'git-update-dependencies'
  'git-status' ],
  -> new Promise ( resolve ) -> resolve()

#-----------------------------------------------------------------------------------------------------------
task 'git-update-lib', -> new Promise ( resolve ) ->
  await sh """git add --update lib dev/**/lib && git commit -m'update'"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
task 'git-update-readmes', -> new Promise ( resolve ) ->
  await sh """doctoc README* dev/**/README* && git add --update README* dev/**/README* && git commit -m'update docs'"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
task 'git-update-dependencies', -> new Promise ( resolve ) ->
  await sh """git add package* && git commit -m'update dependencies'"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
task 'git-status', -> new Promise ( resolve ) ->
  await sh """git status"""
  resolve()

###
doctoc README* && git add README* && git commit -m'update docs' && git push
###

#-----------------------------------------------------------------------------------------------------------
task 'intershop_npm_install', -> new Promise ( resolve ) =>
  await sh """( cd intershop && npm install && npm audit )"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
task 'gitcollector-show-commits', -> new Promise ( resolve ) =>
  await sh """nodexh dev/gitcollector/lib/main.js | less -SR#5"""
  resolve()

#-----------------------------------------------------------------------------------------------------------
task 'benchmark', ( P... ) -> new Promise ( resolve ) =>
  debug '^43^', P
  # await sh """nodexh dev/gitcollector/lib/main.js | less -SR#5"""
  resolve()



############################################################################################################
if module is require.main then do =>
  # await @benchmark()
  return null


