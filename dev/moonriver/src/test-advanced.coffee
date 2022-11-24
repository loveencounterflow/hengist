
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
  { Pipeline    } = require '../../../apps/moonriver'
  { $window     } = require '../../../apps/moonriver/lib/transforms'
  collector       = []
  p               = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 9 ]
  p.push $window { min: -2, max: +2, empty: 0, }
  p.push show    = ( d        ) -> urge '^45-1^', d
  # p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
  p.push add_up  = ( d, send  ) -> send ( d[ -2 ] + d[ -1 ] ) + d[ 0 ] + ( d[ +1 ] + d[ +2 ] )
  p.push show    = ( d        ) -> help '^45-2^', d
  result = p.run()
  info '^45-2^', result
  T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @window_list_transform = ( T, done ) ->
#   # T?.halt_on_error()
#   { Pipeline
#     transforms  } = require '../../../apps/moonriver'
#   collector       = []
#   p               = new Pipeline()
#   #.........................................................................................................
#   p.push [ 1 .. 9 ]
#   p.push transforms.$window_list -2, +2, 0
#   p.push show    = ( d        ) -> urge '^45-1^', d
#   # p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
#   p.push add_up  = ( d, send  ) -> send ( d[ -2 ] + d[ -1 ] ) + d[ 0 ] + ( d[ +1 ] + d[ +2 ] )
#   p.push show    = ( d        ) -> help '^45-2^', d
#   result = p.run()
#   info '^45-2^', result
#   T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
#   done?()

#-----------------------------------------------------------------------------------------------------------
@named_window_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Pipeline,         \
    transforms: TF  } = require '../../../apps/moonriver'
  { $window         } = require '../../../apps/moonriver/lib/transforms'
  collector           = []
  p                   = new Pipeline()
  #.........................................................................................................
  p.push [ 1 .. 5 ]
  p.push $window { names: [ 'before', 'here', 'after', ], empty: null, }
  p.push show    = ( d        ) -> urge '^45-1^', d
  result = p.run()
  info '^45-2^', result
  T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_sync_pipeline_as_segment = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline    }       = require '../../../apps/moonriver'
  count                 = 0
  #.........................................................................................................
  byline                = new Pipeline()
  byline.push show      = ( d ) -> urge '^29-1^', d
  byline.push add       = ( d, send ) -> send d + 3
  byline.push mul       = ( d, send ) -> send d * 3
  byline.push enumerate = ( d, send ) -> count++; send count; send d * 3
  #.........................................................................................................
  trunk_1               = new Pipeline()
  trunk_1.push [ 1 .. 5 ]
  trunk_1.push show     = ( d ) -> help '^29-2^', d
  trunk_1.push byline
  trunk_1.push show     = ( d ) -> help '^29-3^', d
  #.........................................................................................................
  trunk_2               = new Pipeline()
  trunk_2.push [ 1 .. 5 ]
  trunk_2.push show     = ( d ) -> help '^29-4^', d
  trunk_2.push byline
  trunk_2.push show     = ( d ) -> help '^29-5^', d
  #.........................................................................................................
  result_1              = trunk_1.run()
  result_2              = trunk_2.run()
  urge '^29-6^', trunk_1
  info '^29-7^', result_1
  urge '^29-8^', trunk_2
  info '^29-9^', result_2
  T?.eq result_1, [ 1, 36, 2, 45, 3, 54, 4, 63, 5, 72 ]
  T?.eq result_2, [ 6, 36, 7, 45, 8, 54, 9, 63, 10, 72 ]
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




############################################################################################################
if require.main is module then do =>
  # @window_transform()
  # @use_pipeline_as_segment_preview()
  @named_window_transform()
  test @named_window_transform
  # @transform_window_cfg_type()
  # test @transform_window_cfg_type
  # @use_async_pipeline_as_segment()
  # test @use_async_pipeline_as_segment
  # test @




