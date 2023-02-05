
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
@guy_str_SQL_tag_function = ( T, done ) ->
  # T?.halt_on_error()
  GUY     = require H.guy_path
  { SQL } = GUY.str
  T?.eq SQL"x\n\nx", "x\n\nx"
  T?.eq SQL"foo #{1+2+3} bar", "foo 6 bar"
  if T?
    ```
    T.eq( SQL`foo ${1+2+3} bar`, "foo 6 bar" )
    ```
  return done?()

#-----------------------------------------------------------------------------------------------------------
@guy_str_escape_for_regex = ( T, done ) ->
  # T?.halt_on_error()
  GUY     = require H.guy_path
  T?.eq ( GUY.str.escape_for_regex ''                 ), ''
  T?.eq ( GUY.str.escape_for_regex 'xy.*+?^${}()|[]\\'  ), 'xy\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\'
  return done?()

#-----------------------------------------------------------------------------------------------------------
@guy_str_escape_for_regex_class = ( T, done ) ->
  # T?.halt_on_error()
  GUY     = require H.guy_path
  T?.eq ( GUY.str.escape_for_regex_class ''                     ), ''
  T?.eq ( GUY.str.escape_for_regex_class 'xy.*+?^${}()|[]\\/'   ), 'xy.*+?\\^${}()|[\\]\\\\/'
  T?.eq ( GUY.str.escape_for_regex_class '^-[]/'                ), '\\^\\-[\\]\\/'
  return done?()



############################################################################################################
if require.main is module then do =>
  # @guy_str_escape_for_regex()
  test @



