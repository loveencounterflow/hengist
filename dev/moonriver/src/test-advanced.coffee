
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
@window_transform = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  { $window         } = require '../../../apps/moonriver/lib/transforms'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push TF.$window { min: -2, max: +2, empty: '_', }
  p.push $as_keysorted_list()
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
@named_window_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push show = ( d ) -> urge '^45-1^', d
  p.push TF.$named_window { names: [ 'a', 'b', 'c', 'd', 'e', ], empty: '_', }
  p.push show = ( d ) -> urge '^45-1^', d
  p.push $as_keysorted_list()
  p.push ( d, send ) -> send ( "#{e}" for e in d ).join ''
  p.push show = ( d ) -> urge '^45-1^', d
  result = p.run()
  info '^45-2^', result
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
@use_sync_pipeline_as_segment = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    transforms: TF    } = require '../../../apps/moonriver'
  count                 = 0
  #.........................................................................................................
  byline                = new Pipeline()
  byline.push show      = ( d ) -> urge '^29-1^', d
  byline.push add       = ( d, send ) -> send d + 3
  byline.push mul       = ( d, send ) -> send d * 3
  byline.push enumerate = ( d, send ) -> count++; send count; send d * 3
  # byline.push TF.$collect()
  #.........................................................................................................
  trunk_1               = new Pipeline()
  trunk_1.push [ 1 .. 5 ]
  trunk_1.push show     = ( d ) -> help '^29-2^', d
  trunk_1.push byline
  trunk_1.push show     = ( d ) -> help '^29-3^', d
  # #.........................................................................................................
  # trunk_2               = new Pipeline()
  # trunk_2.push [ 1 .. 5 ]
  # trunk_2.push show     = ( d ) -> help '^29-4^', d
  # trunk_2.push byline
  # trunk_2.push show     = ( d ) -> help '^29-5^', d
  #.........................................................................................................
  debug '^57-1^'
  result_1              = trunk_1.run()
  # debug '^57-2^'
  # result_2              = trunk_2.run()
  debug '^57-3^'
  urge '^29-6^', trunk_1
  info '^29-7^', result_1
  # urge '^29-8^', trunk_2
  # info '^29-9^', result_2
  T?.eq result_1, [ 1, 36, 2, 45, 3, 54, 4, 63, 5, 72 ]
  T?.eq result_2, [ 6, 36, 7, 45, 8, 54, 9, 63, 10, 72 ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@segment_pipelines_can_be_nested = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  #.........................................................................................................
  do ->
    outer = new Pipeline()
    #.......................................................................................................
    outer.push 'abcde'
    #.......................................................................................................
    outer.push uppercase  = ( d, send ) -> send d.toUpperCase()
    outer.push show       = ( d ) -> whisper '(inner)', d
    outer.push TF.$collect()
    outer.push join       = ( d, send ) -> send d.join ''
    #.......................................................................................................
    outer.push ( d ) -> help 'outer', d
    #.......................................................................................................
    result = outer.run()
    info '^34-1^', rpr result
    T?.eq result, [ 'ABCDE', ]
    return null
  #.........................................................................................................
  do ->
    inner = new Pipeline()
    outer = new Pipeline()
    #.......................................................................................................
    inner.push uppercase  = ( d, send ) -> send d.toUpperCase()
    inner.push TF.$collect()
    inner.push join       = ( d, send ) -> send d.join ''
    inner.push show       = ( d ) -> whisper 'inner', d
    #.......................................................................................................
    outer.push 'abcde'
    outer.push inner
    outer.push finish     = ( d ) -> help 'outer', d
    #.......................................................................................................
    result = outer.run()
    info '^34-2^', rpr result
    T?.eq result, [ 'ABCDE', ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_async_pipeline_as_segment = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Async_pipeline }    = require '../../../apps/moonriver'
  count                 = 0
  #.........................................................................................................
  byline                = new Async_pipeline()
  byline.push show      = ( d ) -> urge '^29-1^', d
  byline.push add       = ( d, send ) -> send d + 3
  byline.push mul       = ( d, send ) -> send d * 3
  byline.push enumerate = ( d, send ) -> GUY.async.after 0.01, -> count++; send count; send d * 3
  #.........................................................................................................
  trunk_1               = new Async_pipeline()
  trunk_1.push [ 1 .. 5 ]
  trunk_1.push show     = ( d ) -> help '^29-2^', d
  trunk_1.push byline
  trunk_1.push show     = ( d ) -> help '^29-3^', d
  #.........................................................................................................
  trunk_2               = new Async_pipeline()
  trunk_2.push [ 1 .. 5 ]
  trunk_2.push show     = ( d ) -> help '^29-4^', d
  trunk_2.push byline
  trunk_2.push show     = ( d ) -> help '^29-5^', d
  #.........................................................................................................
  result_1              = await trunk_1.run()
  result_2              = await trunk_2.run()
  urge '^29-6^', trunk_1
  info '^29-7^', result_1
  urge '^29-8^', trunk_2
  info '^29-9^', result_2
  T?.eq result_1, [ 1, 36, 2, 45, 3, 54, 4, 63, 5, 72 ]
  T?.eq result_2, [ 6, 36, 7, 45, 8, 54, 9, 63, 10, 72 ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@modifiers_preserved_for_pipeline_segments = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    $,                  \
    transforms: TF    } = require '../../../apps/moonriver'
  first                 = Symbol 'first'
  last                  = Symbol 'last'
  #.........................................................................................................
  do ->
    p = new Pipeline()
    p.push 'abcd'
    p.push $ { first, last, }, ( d, send ) ->
      debug '^53-1^', rpr d
      return send '(' if d is first
      return send ')' if d is last
      send d.toUpperCase()
    p.push TF.$collect()
    # p.push do ->
    #   collector = []
    #   return $ { last, }, ( d, send ) ->
    #     return send collector if d is last
    #     collector.push d
    p.push ( d, send ) -> send d.join ''
    result = p.run()
    T?.eq result, [ '(ABCD)', ]
  #.........................................................................................................
  done?()




############################################################################################################
if require.main is module then do =>
  # @window_transform()
  # test @window_transform
  # @use_pipeline_as_segment_preview()
  # @named_window_transform()
  # test @named_window_transform
  # @use_sync_pipeline_as_segment()
  # @transform_window_cfg_type()
  # test @transform_window_cfg_type
  # @use_async_pipeline_as_segment()
  # test @use_async_pipeline_as_segment
  # @segment_pipelines_can_be_nested()
  @modifiers_preserved_for_pipeline_segments()
  test @modifiers_preserved_for_pipeline_segments
  # test @segment_pipelines_can_be_nested
  # test @




