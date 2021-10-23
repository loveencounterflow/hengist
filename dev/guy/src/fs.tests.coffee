
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
{ freeze }                = require 'letsfreezethat'
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()

matchers =
  single: [
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
matchers.triple = [ matchers.single..., matchers.single..., matchers.single..., ]
matchers = freeze matchers

#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() iterates once per default" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path
    result.push line
  #.........................................................................................................
  T?.eq result, matchers.single
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() can iterate given number of loops" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path, { loop_count: 3, }
    result.push line
  #.........................................................................................................
  T?.eq result, matchers.triple
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() can iterate given number of lines 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path, { loop_count: 3, line_count: 12, }
    result.push line
  #.........................................................................................................
  T?.eq result.length, 12
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



