
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
@[ "guy.str.SQL tag function" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  { SQL } = guy.str
  T?.eq SQL"x\n\nx", "x\n\nx"
  T?.eq SQL"foo #{1+2+3} bar", "foo 6 bar"
  if T?
    ```
    T.eq( SQL`foo ${1+2+3} bar`, "foo 6 bar" )
    ```
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "____guy.str.SQL tag function" ] = ( T, done ) ->
  # T?.halt_on_error()
  # guy     = require H.guy_path
  #=========================================================================================================
  class Sql

    #-------------------------------------------------------------------------------------------------------
    constructor: ( q = {} ) ->
      @q = q
      return undefined

    #-------------------------------------------------------------------------------------------------------
    SQL: ( parts, expressions... ) =>
      whisper '^344^', '--------------------------'
      debug '^344^', parts
      debug '^344^', parts.raw
      debug '^344^', expressions
      debug '^344^', @q
      R = parts[ 0 ]
      for expression, idx in expressions
        R += expression.toString() + parts[ idx + 1 ]
      return R
  #.........................................................................................................
  { SQL } = new Sql()
  urge '^344^', rpr SQL"helo"
  urge '^344^', rpr SQL"helo \n#{42}"
  urge '^344^', rpr SQL"helo #x{42}"
  urge '^344^', rpr SQL"helo \i{42}, \L{xy}"
  return done?()



############################################################################################################
if require.main is module then do =>
  test @, { timeout: 5000, }
  # @[ "guy.str.SQL tag function" ]()



