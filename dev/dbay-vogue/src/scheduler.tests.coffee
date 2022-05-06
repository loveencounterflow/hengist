
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/TESTS/CONSTRUCTION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "scheduler: duration pattern" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Vogue_scheduler   } = require '../../../apps/dbay-vogue'
  abs_duration_pattern  = Vogue_scheduler.C.abs_duration_pattern
  T?.eq ( type_of abs_duration_pattern ), 'regex'
  T?.eq ( "23 minutes".match abs_duration_pattern     )?.groups.amount, '23'
  T?.eq ( "23e2 weeks".match abs_duration_pattern     )?.groups.amount, '23e2'
  T?.eq ( "23.5e22 weeks".match abs_duration_pattern  )?.groups.amount, '23.5e22'
  T?.eq ( "23 minutes".match abs_duration_pattern     )?.groups.unit,   'minutes'
  T?.eq ( "23e2 weeks".match abs_duration_pattern     )?.groups.unit,   'weeks'
  T?.eq ( "23.5e22 weeks".match abs_duration_pattern  )?.groups.unit,   'weeks'
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "scheduler: add_interval_cfg" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Vogue_scheduler } = require '../../../apps/dbay-vogue'
  voge_scheduler      = new Vogue_scheduler()
  { types }           = voge_scheduler
  T?.eq ( type_of types.isa.vogue_scheduler_add_interval_cfg ), 'function'
  # types.validate.vogue_scheduler_add_interval_cfg { repeat: '1.5 hours', task: ( -> ), }
  types.validate.vogue_scheduler_add_interval_cfg { repeat: '1.5 hours', jitter: '10%', pause: '10 minutes', task: ( -> ), }
  T?.ok types.isa.vogue_scheduler_add_interval_cfg { repeat: '1.5 hours', jitter: '10%', pause: '10 minutes', task: ( -> ), }
  return done?()



############################################################################################################
if module is require.main then do =>
  # test @[ "scheduler: duration pattern" ]
  test @[ "scheduler: add_interval_cfg" ]