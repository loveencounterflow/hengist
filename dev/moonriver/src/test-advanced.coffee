
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
@use_sync_pipeline_as_segment = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    transforms: TF    } = require '../../../apps/moonriver'
  count                 = 0
  #.........................................................................................................
  byline                = new Pipeline { protocol: true, }
  byline.push show      = ( d ) -> urge '^29-1^', d
  byline.push add       = ( d, send ) -> send d + 3
  byline.push mul       = ( d, send ) -> send d * 3
  byline.push enumerate = ( d, send ) -> count++; send count; send d * 3
  # byline.push TF.$collect()
  #.........................................................................................................
  trunk_1               = new Pipeline { protocol: true, }
  trunk_1.push [ 1 .. 5 ]
  trunk_1.push show     = ( d ) -> help '^29-2^', d
  trunk_1.push byline
  trunk_1.push show     = ( d ) -> help '^29-3^', d
  #.........................................................................................................
  # trunk_2               = new Pipeline { protocol: true, }
  # trunk_2.push [ 1 .. 5 ]
  # trunk_2.push show     = ( d ) -> help '^29-4^', d
  # trunk_2.push byline
  # trunk_2.push show     = ( d ) -> help '^29-5^', d
  # #.........................................................................................................
  # result_1              = []
  # step_count            = 0
  # for d from trunk_1.walk()
  #   info '^29-1^', d
  #   result_1.push d
  #   step_count++
  #   break if step_count > 3
  result_1 = trunk_1.run()
  H.tabulate "sync_pipeline_as_segment t1", trunk_1.journal
  # debug '^57-2^'
  # result_2              = trunk_2.run()
  urge '^29-6^', trunk_1
  info '^29-7^', result_1
  # urge '^29-8^', trunk_2
  # info '^29-9^', result_2
  T?.eq result_1, [ 1, 36, 2, 45, 3, 54, 4, 63, 5, 72 ]
  # T?.eq result_2, [ 6, 36, 7, 45, 8, 54, 9, 63, 10, 72 ]
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
@protocol_1 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  do ->
    p = new Pipeline { protocol: true, }
    p.push add2   = ( d, send ) -> send d + 2
    p.push mul2   = ( d, send ) -> send d * 2
    p.push $ { first, last, }, fl_ap = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
    p.send n for n in [ 0 .. 3 ]
    debug '^74-2^', p
    debug '^74-2^', result = p.run()
    H.tabulate "protocol_1", p.journal
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@protocol_2 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  do ->
    p = new Pipeline { protocol: true, }
    p.push add2   = ( d, send ) -> send d + 2
    p.push mul2   = ( d, send ) -> send d * 2
    p.push $ { first, last, }, fl_ap = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
    p.push transforms.$collect()
    p.send n for n in [ 0 .. 3 ]
    debug '^75-1^', p
    debug '^75-2^', result = p.run()
    H.tabulate "protocol_2", p.journal
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@protocol_3 = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  do ->
    p = new Pipeline { protocol: true, }
    p.push add2   = ( d, send ) -> send d + 2
    p.push mul2   = ( d, send ) -> send d * 2
    p.push again  = ( d, send ) -> send d; if d is 10 then p.send 100
    p.push $ { first, last, }, fl_ap = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
    p.push transforms.$collect()
    p.send n for n in [ 0 .. 3 ]
    debug '^75-1^', p
    debug '^75-2^', result = p.run()
    H.tabulate "protocol_3", p.journal
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@async_protocol_3 = ( T, done ) ->
  # T?.halt_on_error()
  { Async_pipeline,         \
    $,
    transforms,     } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  await do ->
    p = new Async_pipeline { protocol: true, }
    p.push add2   = ( d, send ) -> send d + 2
    p.push mul2   = ( d, send ) -> send d * 2
    p.push again  = ( d, send ) -> send d; if d is 10 then p.send 100
    p.push $ { first, last, }, fl_ap = ( d, send ) ->
      return send '(' if d is first
      return send ')' if d is last
      send d
    p.push transforms.$collect()
    p.send n for n in [ 0 .. 3 ]
    debug '^76-1^', p
    debug '^76-2^', result = await p.run()
    H.tabulate "async_protocol_3", p.journal
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then await do =>
  test @




