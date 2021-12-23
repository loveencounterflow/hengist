
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTEXT/TESTS/HTML'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
test                      = require 'guy-test'



#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "HTML parse compact tagname" ] = ( T, done ) ->
  # T?.halt_on_error()
  { HTMLISH } = require '../../../apps/intertext'
  #.........................................................................................................
  probes_and_matchers = [
    [ 'mrg:loc.delete#title',         { prefix: 'mrg', name: 'loc', class: [ 'delete' ], id: 'title' }, ]
    [ 'mrg:loc#title.delete',         { prefix: 'mrg', name: 'loc', class: [ 'delete' ], id: 'title' }, ]
    [ 'mrg:loc.foo#title.bar.baz', { prefix: 'mrg', name: 'loc', class: [ 'foo', 'bar', 'baz' ], id: 'title' }, null ]
    [ 'mrg:loc.foo#title.bar.baz', { prefix: 'mrg', name: 'loc', class: [ 'foo', 'bar', 'baz' ], id: 'title' }, null ]
    [ 'mrg:loc.foo#title#bar#baz', null, /found duplicate values for 'id': 'title', 'bar'/ ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = HTMLISH.parse_compact_tagname probe
      resolve result
      return null
  #.........................................................................................................
  done?()




############################################################################################################
if module is require.main then do => # await do =>
  test @
