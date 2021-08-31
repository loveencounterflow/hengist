

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SYNC-OR-ASYNC'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  declare
  first_of
  last_of
  size_of
  type_of }               = types
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
create_sync_or_async_function = ( type ) ->
  switch type
    when 'sync'
      return -> urge "it's sync"; return null
    when 'async'
      # return -> new Promise ( resolve ) => defer -> ( urge "it's sync"; resolve null )
      return -> await guy.async.sleep 0.1; urge "it's async"; return null
  throw new Error "expected 'sync' or 'async', got #{rpr type}"

#-----------------------------------------------------------------------------------------------------------
demo = ->
  debug '^3378^', type_of create_sync_or_async_function
  debug '^3378^',  type_of f = create_sync_or_async_function 'sync'
  f()
  debug '^3378^',  type_of f = create_sync_or_async_function 'async'
  await f()
  return null


############################################################################################################
if module is require.main then do =>
  demo()





