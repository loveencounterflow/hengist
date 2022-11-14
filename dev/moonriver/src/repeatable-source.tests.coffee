
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
  on_before_process = null
  on_before_step    = null
  on_after_step     = null
  on_after_process  = null
  # on_before_process = -> help '^98-1^', @
  # on_after_process  = -> warn '^98-2^', @
  # on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
  # on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  #.........................................................................................................
  p.push -> return 'abcdef'
  # p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
  p.push extra    = ( d, send ) -> send "*#{d}*"
  p.push show     = ( d ) -> whisper '^98-5^', d
  #.........................................................................................................
  result_1 = p.run()
  urge '^98-1^', result_1
  result_2 = p.run()
  urge '^98-1^', result_2
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
  source          = 'abcdef'
  # source          = Array.from 'abcdef'
  p.push source
  # p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
  p.push extra    = ( d, send ) -> send "*#{d}*"
  p.push show     = ( d ) -> whisper '^45-1^', d
  #.........................................................................................................
  debug '^54-1^', p
  debug '^54-2^', p.segments[ 0 ]
  T?.eq ( type_of signals       ), 'object'
  T?.eq ( type_of signals.reset ), 'symbol'
  T?.eq ( type_of signals.ok    ), 'symbol'
  T?.eq ( type_of p.reset       ), 'function'
  debug '^54-3^', p.reset()
  T?.eq p.reset(), null
  #.........................................................................................................
  do ->
    result_1 = p.run()
    result_2 = p.run()
    info '^54-4^', result_1
    info '^54-5^', result_2
    T?.eq result_1, result_2
    return null
  #.........................................................................................................
  do ->
    result_1 = [ p.walk()..., ]
    result_2 = [ p.walk()..., ]
    info '^54-6^', result_1
    info '^54-7^', result_2
    T?.eq result_1, result_2
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@run_and_walk_throw_error_on_repeating_nonrepeatable = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline
    $
    signals     } = require '../../../apps/moonriver'
  # first           = Symbol 'first'
  # last            = Symbol 'last'
  #.........................................................................................................
  get_pipeline = ->
    p               = new Pipeline()
    p.push ( -> yield chr for chr in 'abcdef' )()
    # p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
    p.push extra    = ( d, send ) -> send "*#{d}*"
    p.push show     = ( d ) -> whisper '^45-1^', d
    return p
  #.........................................................................................................
  do ->
    p = get_pipeline()
    result_1 = p.run()
    T?.throws /source.*not repeatable/, -> result_2 = p.run()
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@repeatable_and_nonrepeatable_sources = ( T, done ) ->
  # T?.halt_on_error()
  GUY             = require '../../../apps/guy'
  { Pipeline    } = require '../../../apps/moonriver'
  #.........................................................................................................
  get_pipeline = ( source ) ->
    p               = new Pipeline()
    p.push source
    p.push show     = ( d ) -> whisper '^47-1^', d
    return p
  #.........................................................................................................
  do ->
    p = get_pipeline 'abcdef'
    result_1 = p.run()
    result_2 = p.run()
    T?.eq result_1, result_2
    return null
  #.........................................................................................................
  do ->
    p = get_pipeline -> yield chr for chr from Array.from 'abcdef'
    result_1 = p.run()
    result_2 = p.run()
    T?.eq result_1, result_2
    return null
  # #.........................................................................................................
  # do ->
  #   p = get_pipeline Array.from 'abcdef'
  #   result_1 = p.run()
  #   result_2 = p.run()
  #   T?.eq result_1, result_2
  #   return null
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # @can_use_function_without_arguments_as_source()
  test @can_use_function_without_arguments_as_source
  # test @

