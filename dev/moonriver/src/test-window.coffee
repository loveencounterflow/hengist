
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/ADVANCED'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
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
GUY                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
$as_keysorted_list = -> ( d, send ) => send as_keysorted_list d
as_keysorted_list = ( d ) ->
  keys = ( Object.keys d ).sort ( a, b ) ->
    a = parseInt a, 10
    b = parseInt b, 10
    return +1 if a > b
    return -1 if a < b
    return  0
  return ( d[ key ] for key in keys )

#-----------------------------------------------------------------------------------------------------------
@transform_window_cfg_type = ( T, done ) ->
  # T?.halt_on_error()
  { get_transform_types
    misfit              } = require '../../../apps/moonriver'
  { isa
    type_of
    create              } = get_transform_types()
  #.........................................................................................................
  T?.eq ([ '^07-1^', isa.transform_window_cfg { min: -1, max: 2, empty: null, } ]), [ '^07-1^', true, ]
  T?.eq ([ '^07-2^', isa.transform_window_cfg { min: +1, max: 2, empty: null, } ]), [ '^07-2^', true, ]
  T?.eq ([ '^07-3^', isa.transform_window_cfg { min: +2, max: 2, empty: null, } ]), [ '^07-3^', false, ]
  #.........................................................................................................
  T?.eq ( create.transform_window_cfg {}            ), { min: -1, max: 1, empty: misfit, }
  T?.eq ( create.transform_window_cfg { min: -3, }  ), { min: -3, max: 1, empty: misfit, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@window_transform_1 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push TF.$window { min: -2, max: +2, empty: '_', }
  # p.push show = ( d ) -> info '^45-1^', d
  # p.push ( d, send ) -> d.join ''
  p.push ( d, send ) -> send ( "#{e}" for e in d ).join ''
  p.push show = ( d ) -> urge '^45-1^', d
  result = p.run()
  T?.eq result, [
    '__123'
    '_1234'
    '12345'
    '23456'
    '34567'
    '45678'
    '56789'
    '6789_'
    '789__'
    ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@window_transform_2 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push TF.$window { min: -2, max: 0, empty: '_', }
  p.push show = ([ ddd, dd, d, ]) -> urge '^45-1^', [ ddd, dd, d, ]
  p.push ( ds, send ) -> send ( "#{d}" for d in ds ).join ''
  result = p.run()
  T?.eq result, [ '__1', '_12', '123', '234', '345', '456', '567', '678', '789' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@window_transform_3 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push TF.$window { min: -3, max: +3, empty: '_', }
  p.push show = ([ d_$3, d_$2, d_$1, d, d_1, d_2, d_3, ]) -> urge '^45-1^', [ d_$3, d_$2, d_$1, d, d_1, d_2, d_3, ]
  p.push ( ds, send ) -> send ( "#{d}" for d in ds ).join ''
  result = p.run()
  T?.eq result, [
    '___1234'
    '__12345'
    '_123456'
    '1234567'
    '2345678'
    '3456789'
    '456789_'
    '56789__'
    '6789___' ]
  done?()




############################################################################################################
if require.main is module then await do =>
  # @window_transform_1()
  # test @window_transform_1
  # test @window_transform_2
  test @window_transform_3
