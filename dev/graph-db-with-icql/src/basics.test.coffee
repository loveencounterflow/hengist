
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
# on_process_exit           = require 'exit-hook'
# sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000



#-----------------------------------------------------------------------------------------------------------
@[ "Graphdb: create" ] = ( T, done ) ->
  T.halt_on_error()
  { Graphdb } = require './graph-db'
  path        = '/tmp/icql-graph.db'
  gdb         = new Graphdb { path, }
  #.........................................................................................................
  debug '^4454^', gdb
  #.........................................................................................................
  done()



############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }
