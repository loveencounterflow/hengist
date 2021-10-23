
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/FS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() iterates once per default" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  matcher = [
    "Ångström's"
    "éclair"
    "éclair's"
    "éclairs"
    "éclat"
    "éclat's"
    "élan"
    "élan's"
    "émigré"
    "émigré's" ]
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path
    result.push line
    debug '^4433^', line
  #.........................................................................................................
  T?.eq result, matcher
  done?()


############################################################################################################
if require.main is module then do =>
  test @, { timeout: 5000, }
  # test @[ "guy.props.def(), .hide()" ]
  # test @[ "guy.obj.pick_with_fallback()" ]
  # test @[ "guy.obj.pluck_with_fallback()" ]
  # test @[ "guy.obj.nullify_undefined()" ]
  # test @[ "guy.obj.omit_nullish()" ]
  # @[ "configurator" ]()
  # test @[ "await with async steampipes" ]
  # test @[ "nowait with async steampipes" ]
  # test @[ "use-call" ]
  # @[ "await with async steampipes" ]()
  # @[ "demo" ]()
  # @[ "nowait" ]()



