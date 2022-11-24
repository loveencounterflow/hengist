
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/MULTI-PIPELINE-PROCESSING'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate              } = types
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@walk_named_pipelines = ( T, done ) ->
  { Pipeline, \
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
  do ->
    { p_1, p_2, } = get_pipelines()
    result        = { even: [], odd: [], }
    for d from Pipeline.walk_named_pipelines { odd: p_1, even: p_2, }
      info d
      result[ d.name ].push d.data
    T?.eq result, { even: [ 0, 2, 4, last ], odd: [ first, 1, 3, 5 ] }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@async_walk_named_pipelines = ( T, done ) ->
  { Async_pipeline, \
    $,              } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  { defer }           = GUY.async
  #.........................................................................................................
  get_pipelines = ->
    p_1                 = new Async_pipeline()
    p_2                 = new Async_pipeline()
    p_1.push [ 0 .. 5 ]
    p_1.push show = ( d ) -> whisper 'input', d
    p_1.push $ { first, last, }, ( d, send ) -> await defer -> send d
    p_1.push show = ( d ) -> whisper 'input', d
    p_1.push do ->
      count = 0
      return ( d, send ) ->
        await defer ->
          count++
          if count %% 2 is 0 then return p_2.send d
          send d
    p_1.push show = ( d ) -> urge 'p_1', d
    p_2.push show = ( d ) -> warn 'p_2', d
    return { p_1, p_2, }
  #.........................................................................................................
  await do ->
    { p_1, p_2, } = get_pipelines()
    result        = { even: [], odd: [], }
    for await d from Async_pipeline.walk_named_pipelines { odd: p_1, even: p_2, }
      info d
      result[ d.name ].push d.data
    T?.eq result, { even: [ 0, 2, 4, last ], odd: [ first, 1, 3, 5 ] }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@diverted_pipelines = ( T, done ) ->
  { Pipeline, \
    $,              } = require '../../../apps/moonriver'
  first               = Symbol 'first'
  last                = Symbol 'last'
  #.........................................................................................................
  get_pipelines = ->
    p_1                 = new Pipeline()
    p_2                 = new Pipeline()
    p_1.push [ 0 .. 5 ]
    p_1.push $ { first, last, }, firstlast = ( d, send ) -> send d
    p_1.push diverter = ( d, send ) -> p_2.send d
    p_1.push receiver = ( d, send ) -> send d
    p_1.push show     = ( d ) -> whisper 'input', d
    p_2.push square   = ( d, send ) -> send if isa.symbol d then d else d ** 2
    p_2.push diverter = ( d, send ) -> p_1.segments[ 3 ].send d
    return { p_1, p_2, }
  #.........................................................................................................
  do ->
    { p_1, p_2, } = get_pipelines()
    result        = { p_1: [], p_2: [], }
    info '^77-1^', p_1
    info '^77-1^', p_2
    for d from Pipeline.walk_named_pipelines { p_1, p_2, }
      info d
      result[ d.name ].push d.data
    T?.eq result, { p_1: [ first, 0, 1, 4, 9, 16, 25, last ], p_2: [] }
    return null
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # @walk_named_pipelines_1()
  # await @async_walk_named_pipelines()
  # test @walk_named_pipelines
  @diverted_pipelines()
  test @diverted_pipelines
  # await test @
