
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
  p = new Pipeline()
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
  p = new Pipeline()
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
  FS                    = require 'node:fs'
  PATH                  = require 'node:path'
  { Async_pipeline, \
    transforms: T,  }   = require '../../../apps/moonriver'
  path                  = PATH.join __dirname, '../../../assets/short-proposal.mkts.md'
  get_source            = -> FS.createReadStream path #, { encoding: 'utf-8', }
  p = new Async_pipeline()
  p.push get_source()
  p.push T.$split_lines()
  p.push T.$limit 5
  p.push show = ( d ) -> whisper 'Ⅱ', rpr d
  info '^24-7^', p
  await p.run()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_6 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Pipeline, \
    transforms: T,  } = require '../../../apps/moonriver'
  p                   = new Pipeline()
  { $ }               = p
  last                = Symbol 'last'
  #.........................................................................................................
  $with_stars         = -> with_stars = ( d, send ) -> debug '^4456546^', send; send "*#{d}*"
  #.........................................................................................................
  $collect            = $ { last, }, collect = ->
    collector = []
    return ( d, send ) ->
      return send collector if d is last
      collector.push d
      return null
  #.........................................................................................................
  info '^40-1^', $with_stars
  info '^40-2^', $collect
  #.........................................................................................................
  p.push Array.from '氣場全開'
  p.push $with_stars # ()
  p.push show = ( d ) -> whisper rpr d
  p.run()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_7 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Pipeline, \
    transforms: T,  } = require '../../../apps/moonriver'
  p                   = new Pipeline()
  { $ }               = p
  last                = Symbol 'last'
  #.........................................................................................................
  p.push [ 1, ]
  p.push ( d, send ) -> send d * 2
  p.push show = ( d ) -> info d
  p.push ( d ) -> p.send d if d < 1e6
  urge p.run()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_tee = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Pipeline, \
    transforms: T,
    $,              } = require '../../../apps/moonriver'
  #.........................................................................................................
  get_pipelines = ->
    p                   = new Pipeline()
    p_d3                = new Pipeline()
    p_nd3               = new Pipeline()
    p.push [ 'abc'..., [ 0 .. 9 ]..., 'def'..., [ 10 .. 19 ]..., ]
    # p.push show = ( d ) -> info 'input', d
    p.push ( d, send ) ->
      return send d if isa.nan ( r = d %% 3 )
      return p_d3.send d if r is 0
      p_nd3.send d
    # p.push      show = ( d ) -> whisper 'others', d
    # p_d3.push   show = ( d ) -> whisper 'd3', d
    # p_nd3.push  show = ( d ) -> whisper 'nd3', d
    return { p, p_d3, p_nd3, }
  #.........................................................................................................
  do ->
    whisper '—————————————————————————————————————————————'
    { p, p_d3, p_nd3, } = get_pipelines()
    urge 'others  ', others = p.run()
    urge 'd3s     ', d3s    = p_d3.run()
    urge 'nd3s    ', nd3s   = p_nd3.run()
    return null
  #.........................................................................................................
  do ->
    whisper '—————————————————————————————————————————————'
    { p, p_d3, p_nd3, } = get_pipelines()
    for d from p.walk()
      info 'p', d
      for nd3 from p_nd3.walk()
        help 'nd3', nd3
      for d3 from p_d3.walk()
        urge 'd3', d3
    return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_async_tee_1 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Async_pipeline, \
    transforms: T,  \
    $,              } = require '../../../apps/moonriver'
  { defer }           = GUY.async
  #.........................................................................................................
  get_pipelines = ->
    p                   = new Async_pipeline()
    p_d3                = new Async_pipeline()
    p_nd3               = new Async_pipeline()
    p.push [ 'abc'..., [ 0 .. 9 ]..., 'def'..., [ 10 .. 19 ]..., ]
    # p.push show = ( d ) -> info 'input', d
    p.push ( d, send ) ->
      return ( await defer -> send      d ) if isa.nan ( r = d %% 3 )
      return ( await defer -> p_d3.send d ) if r is 0
      await defer -> p_nd3.send d
    # p.push      show = ( d ) -> whisper 'others', d
    # p_d3.push   show = ( d ) -> whisper 'd3', d
    # p_nd3.push  show = ( d ) -> whisper 'nd3', d
    return { p, p_d3, p_nd3, }
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p, p_d3, p_nd3, } = get_pipelines()
    urge 'others  ', others = await p.run()
    urge 'nd3s    ', nd3s   = await p_nd3.run()
    urge 'd3s     ', d3s    = await p_d3.run()
    return null
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p, p_d3, p_nd3, } = get_pipelines()
    await Promise.all [
      -> urge 'others  ', others = await p.run()
      -> urge 'nd3s    ', nd3s   = await p_nd3.run()
      -> urge 'd3s     ', d3s    = await p_d3.run()
      ]
    return null
  # #.........................................................................................................
  # do ->
  #   whisper '—————————————————————————————————————————————'
  #   { p, p_d3, p_nd3, } = get_pipelines()
  #   for d from p.walk()
  #     info 'p', d
  #     for nd3 from p_nd3.walk()
  #       help 'nd3', nd3
  #     for d3 from p_d3.walk()
  #       urge 'd3', d3
  #   return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_async_tee_2 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Async_pipeline, \
    transforms: T,  \
    $,              } = require '../../../apps/moonriver'
  { defer }           = GUY.async
  #.........................................................................................................
  get_pipelines = ->
    p_1                 = new Async_pipeline()
    p_2                 = new Async_pipeline()
    p_1.push [ 0 .. 9 ]
    p_1.push show = ( d ) -> whisper 'input', d
    p_1.push do ->
      count = 0
      return ( d, send ) ->
        count++
        if count %% 2 is 0 then return await defer -> p_2.send d
        await defer -> send d
    p_1.push show = ( d ) -> urge 'p_1', d
    p_2.push show = ( d ) -> warn 'p_2', d
    return { p_1, p_2, }
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p_1, p_2, } = get_pipelines()
    pipelines     = [ p_1, p_2, ]
    count         = 0
    loop
      await p_1.process()
      await p_2.process()
      break if pipelines.every ( p ) -> p.has_finished
    debug p_1.output
    debug p_2.output
    return null
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p_1, p_2, } = get_pipelines()
    pipelines     = [ p_1, p_2, ]
    count         = 0
    i_1           = p_1.walk()
    i_2           = p_2.walk()
    result_1      = []
    result_2      = []
    loop
      { value: v_1, done: done_1, } = await i_1.next()
      debug '^', p_2, done_2, p_2.datacount
      { value: v_2, done: done_2, } = await i_2.next()
      debug 'v', p_2, done_2, p_2.datacount
      result_1.push d for d in p_1.output
      result_2.push d for d in p_2.output
      break if [ done_1, done_2, ].every ( d ) -> d
    debug result_1
    debug result_2
    return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_sync_tee_2 = ->
  echo '—————————————————————————————————————————————'
  FS                  = require 'node:fs'
  { Pipeline, \
    transforms: T,  \
    $,              } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  get_pipelines = ->
    p_1                 = new Pipeline()
    p_2                 = new Pipeline()
    p_1.push [ 0 .. 5 ]
    p_1.push $ { first, last, }, ( d, send ) -> send d
    p_1.push show = ( d ) -> whisper 'input', d
    p_1.push do ->
      count = 0
      return ( d, send ) ->
        count++
        if count %% 2 is 0 then return p_2.send d
        send d
    p_1.push show = ( d ) -> urge 'p_1', d
    p_2.push show = ( d ) -> warn 'p_2', d
    return { p_1, p_2, }
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p_1, p_2, } = get_pipelines()
    debug p_1.run()
    debug p_2.run()
    return null
  #.........................................................................................................
  await do ->
    whisper '—————————————————————————————————————————————'
    { p_1, p_2, } = get_pipelines()
    pipelines     = [ p_1, p_2, ]
    count         = 0
    pipeline.before_walk() for pipeline in pipelines
    loop
      whisper "lap #", ++count, '—————————————————'
      p_1.process()
      p_2.process()
      break if pipelines.every ( p ) -> p.has_finished
    pipeline.prepare_after_walk() for pipeline in pipelines
    loop
      whisper "lap #", ++count, '—————————————————'
      p_1.process()
      p_2.process()
      break if pipelines.every ( p ) -> p.has_finished
    debug p_1.output
    debug p_2.output
    return null
  #.........................................................................................................
  await do ->
    #.......................................................................................................
    xxx = ( named_pipelines ) ->
      types.validate.object.or.list named_pipelines
      #.....................................................................................................
      switch type = type_of named_pipelines
        when 'object'
          names     = Object.keys named_pipelines
          pipelines = ( v for k, v of named_pipelines )
        when 'list'
          names     = ( idx for _, idx in named_pipelines )
          pipelines = named_pipelines
      #.....................................................................................................
      process = ->
        loop
          for pipeline, idx in pipelines
            name = names[ idx ]
            pipeline.process()
            yield { name, data, } for data from pipeline.output
            pipeline.output.length = 0
          break if pipelines.every ( pipeline ) -> pipeline.has_finished
        return null
      #.....................................................................................................
      pipeline.before_walk() for pipeline in pipelines
      yield from process()
      pipeline.prepare_after_walk() for pipeline in pipelines
      yield from process()
      return null
    #.......................................................................................................
    whisper '—————————————————————————————————————————————'
    { p_1, p_2, } = get_pipelines()
    for d from xxx { odd: p_1, even: p_2, }
      info d
    return null
  #.........................................................................................................
  return null



############################################################################################################
if module is require.main then do =>
  # demo_1()
  # demo_2()
  # await demo_3a()
  # await demo_3b()
  # demo_4()
  # demo_5()
  # demo_6()
  # demo_7()
  # demo_tee()
  # await demo_async_tee_1()
  # await demo_async_tee_2()
  demo_sync_tee_2()


