
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOONRIVER/TESTS/REPEATABLE'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@can_use_function_without_arguments_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline
    signals     } = require '../../../apps/moonriver'
  #.........................................................................................................
  p = new Pipeline()
  p.push -> 'abcdef'
  p.push extra    = ( d, send ) -> send "*#{d}*"
  p.push show     = ( d ) -> whisper '^98-1^', d
  #.........................................................................................................
  urge '^98-2^', result_1 = p.run()
  urge '^98-3^', result_2 = p.run()
  T?.eq result_1, result_2
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@run_and_walk_are_repeatable = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline
    $
    signals     } = require '../../../apps/moonriver'
  # first           = Symbol 'first'
  # last            = Symbol 'last'
  #.........................................................................................................
  p               = new Pipeline()
  source          = -> yield n for n from [ 1 .. 5 ]
  # source          = ( -> yield n for n from [ 1 .. 5 ] )()
  # p.push source
  p.push -> source
  # p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
  p.push extra    = ( d, send ) -> send "*#{d}*"
  p.push show     = ( d ) -> whisper '^54-1^', d
  #.........................................................................................................
  T?.eq ( type_of signals       ), 'undefined'
  T?.eq ( type_of p.reset       ), 'undefined'
  #.........................................................................................................
  do ->
    result_1 = p.run()
    result_2 = p.run()
    info '^54-2^', result_1
    info '^54-3^', result_2
    T?.eq result_1, result_2
    return null
  #.........................................................................................................
  do ->
    result_1 = [ p.walk()..., ]
    result_2 = [ p.walk()..., ]
    info '^54-4^', result_1
    info '^54-5^', result_2
    T?.eq result_1, result_2
    return null
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  @can_use_function_without_arguments_as_source()
  test @can_use_function_without_arguments_as_source
  # @run_and_walk_are_repeatable()
  # test @run_and_walk_are_repeatable
  # test @

