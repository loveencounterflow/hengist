
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  type_of }               = types


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  echo '—————————————————————————————————————————————'
  { Pipeline } = require '../../../apps/moonriver'
  on_before_process = -> help '^97-1^', @
  on_after_process  = -> warn '^97-2^', @
  on_before_step    =  ( sidx ) -> urge '^97-3^', sidx, @
  on_after_step     =  ( sidx ) -> urge '^97-4^', sidx, @
  on_before_step    = null
  # on_after_step     = null
  on_after_process  = null
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  p.push times_2 = ( d, send ) ->
    if types.isa.float d
      # send '('
      send d * 2
      # send ')'
    else
      send d
  p.push plus_2  = ( d, send ) ->
    if types.isa.float d
      # send '['
      send d + 2
      # send ']'
    else
      send d
  p.push times_3 = ( d, send ) ->
    if types.isa.float d
      # send '{'
      send d * 3
      # send '}'
    else
      send d
  p.send 1
  p.send 2
  p.send 3
  # urge '^97-4^', d for d from p.walk()
  info '^97-4^', p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  echo '—————————————————————————————————————————————'
  { Pipeline } = require '../../../apps/moonriver'
  on_before_process = null
  on_before_step    = null
  on_after_step     = null
  on_after_process  = null
  # on_before_process = -> help '^98-1^', @
  # on_after_process  = -> warn '^98-2^', @
  # on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
  # on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
  p = new Pipeline { on_before_process, on_before_step, on_after_step, on_after_process, }
  # p = new Pipeline()
  # p.push 'AB'
  # p.push 'CD'
  # p.push [ 1, 2, 3, ]
  # p.push [ 4, 5, 6, ]
  p.push { one: 'cat', two: 'dog', three: 'pony', }
  p.push new Set '+-*'
  p.push new Map [ [ 11, 12, ], [ 13, 14, ], ]
  p.push 'ABC'
  # p.push 'DEF'
  # p.push 'GHIJ'
  # # p.push show_1 = ( d, send ) -> whisper rpr d; send d
  p.push show_2 = ( d       ) -> whisper rpr d
  p.send 0
  p.send 1
  p.send 2
  info '^98-5^', p
  info '^98-6^', p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_3a = ->
  echo '—————————————————————————————————————————————'
  { Pipeline
    Async_pipeline }  = require '../../../apps/moonriver'
  p = new Async_pipeline()
  p.push [ 1, 2, 3, ]
  p.push show_2 = ( d ) -> whisper 'Ⅱ', rpr d
  p.push mul_3b = ( d, send ) -> send new Promise ( resolve ) -> GUY.async.after 0.1, -> resolve d * 3
  p.push show_2 = ( d ) -> whisper 'Ⅲ', rpr d
  info '^23-1^', p
  info '^23-4^', await p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_3b = ->
  echo '—————————————————————————————————————————————'
  { Pipeline
    Async_pipeline
    Segment
    Async_segment } = require '../../../apps/moonriver'
  after  = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  p = new Async_pipeline()
  p.push [ 1, 2, 3, ]
  p.push show_2 = ( d ) -> whisper 'Ⅱ', rpr d
  p.push mul_3b = ( d, send ) -> send await after 0.1, -> d * 3
  p.push show_2 = ( d ) -> whisper 'Ⅲ', rpr d
  info '^24-7^', p
  info '^24-8^', await p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_4 = ->
  echo '—————————————————————————————————————————————'
  { Pipeline } = require '../../../apps/moonriver'
  p = new Pipeline()
  p.push GUY.fs.walk_lines __filename
  p.push show_2 = ( d ) -> whisper 'Ⅱ', rpr d
  # p.push show_2 = ( d ) -> whisper 'Ⅲ', rpr d
  info '^24-7^', p
  p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_5 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Async_pipeline, \
    transforms: T,  } = require '../../../apps/moonriver'
  p = new Async_pipeline()
  p.push FS.createReadStream __filename, { highWaterMark: 50, }
  p.push T.$split_lines()
  p.push T.$limit 5
  p.push show_2 = ( d ) -> whisper 'Ⅱ', rpr d
  info '^24-7^', p
  await p.run()
  return null



############################################################################################################
if module is require.main then do =>
  demo_1()
  demo_2()
  await demo_3a()
  await demo_3b()
  demo_4()
  demo_5()


