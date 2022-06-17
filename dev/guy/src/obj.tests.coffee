
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/OBJ'
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
PATH                      = require 'path'
FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ freeze }                = require 'letsfreezethat'
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.obj.Strict_proprietor" ] = ( T, done ) ->
  GUY     = require H.guy_path
  class X extends GUY.obj.Strict_proprietor
  x = new X()
  urge x.foo = 42
  urge x.foo
  urge x.has
  urge x.has.foo
  urge x.has.bar
  try urge x.bar catch error then warn CND.reverse error.message
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  test @
