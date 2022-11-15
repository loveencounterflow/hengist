
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MOONRIVER/BASICS'
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


  # #.........................................................................................................
  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->


#-----------------------------------------------------------------------------------------------------------
@simple = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    mr        = new Pipeline()
    mr.push [ 1, 2, 3, 5, ]
    mr.push ( d, send ) -> send d * 2
    mr.push ( d, send ) -> send d #; urge d
    mr.push ( d, send ) -> collector.push d #; help collector
    mr.run()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@simple_with_generatorfunction = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    mr        = new Pipeline()
    mr.push ( send ) -> yield n for n in [ 1, 2, 3, 5, ]
    mr.push ( d, send ) -> send d * 2
    mr.push ( d, send ) -> send d #; urge d
    mr.push ( d, send ) -> collector.push d #; help collector
    mr.run()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@simple_with_generator = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    mr        = new Pipeline()
    mr.push ( ( send ) -> yield n for n in [ 1, 2, 3, 5, ] )()
    mr.push ( d, send ) -> send d * 2
    mr.push ( d, send ) -> send d #; urge d
    mr.push ( d, send ) -> collector.push d #; help collector
    mr.run()
    T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "can access pipeline from within transform, get user area" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Pipeline } = require '../../../apps/moonriver'
  #.........................................................................................................
  do =>
    collector = []
    pipeline  = [
      [ '^4564^', ]
      ( d ) -> urge d
      #.....................................................................................................
      can_access_pipeline_1 = ( d ) ->
        if @ is mr then T?.ok true
        else            T?.fail "^478-1^ not ok"
        return null
      #.....................................................................................................
      can_access_pipeline_2 = ( d, send ) ->
        send d
        if @ is mr then T?.ok true
        else            T?.fail "^478-2^ not ok"
        return null
      #.....................................................................................................
      has_user_area = ( d, send ) ->
        send d
        if isa.object @user then  T?.ok true
        else                      T?.fail "^478-3^ not ok"
        return null
      #.....................................................................................................
      ]
    mr = new Pipeline pipeline
    debug '^558^', mr
    mr.run()
    # T?.eq collector, [ 2, 4, 6, 10, ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncgenerator_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Async_pipeline }  = require '../../../apps/moonriver'
  count               = 0
  source              = -> await yield d for d in [ 3, 5, 7, 11, ]
  debug '^49-1^', source
  debug '^49-1^', source()
  debug '^49-1^', source().next
  #.......................................................................................................
  p = new Async_pipeline()
  p.push source()
  p.push square = ( d, send ) -> send d * d
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = await p.run()
  info '^49-1^', result
  T?.eq result, [ 9, 25, 49, 121, ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncgeneratorfunction_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY                 = require '../../../apps/guy'
  { Async_pipeline }  = require '../../../apps/moonriver'
  count               = 0
  source              = -> await yield d for d in [ 3, 5, 7, 11, ]
  debug '^49-1^', source
  debug '^49-1^', source()
  debug '^49-1^', source().next
  #.......................................................................................................
  p = new Async_pipeline()
  p.push source
  p.push square = ( d, send ) -> send d * d
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = await p.run()
  info '^49-1^', result
  T?.eq result, [ 9, 25, 49, 121, ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_asyncfunction_as_transform = ( T, done ) ->
  # T?.halt_on_error()
  GUY               = require '../../../apps/guy'
  { Async_pipeline
    $           }   = require '../../../apps/moonriver'
  after             = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  count             = 0
  #.......................................................................................................
  p = new Async_pipeline()
  p.push Array.from '覚える'
  p.push ( d, send ) -> send await after 0.1, -> "(#{d})"
  p.push show = ( d ) -> urge '^49-1^', d
  #.........................................................................................................
  result = await p.run()
  info '^49-1^', result
  T?.eq result, [ '(覚)', '(え)', '(る)' ]
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_nodejs_readable_stream_as_source = ( T, done ) ->
  # T?.halt_on_error()
  GUY                   = require '../../../apps/guy'
  { Pipeline,           \
    Async_pipeline,     \
    transforms: TF }    = require '../../../apps/moonriver'
  FS                    = require 'node:fs'
  path                  = PATH.join __dirname, '../../../assets/short-proposal.mkts.md'
  get_source            = -> FS.createReadStream path #, { encoding: 'utf-8', }
  #.......................................................................................................
  matcher = do =>
    count   = 0
    matcher = []
    for line from GUY.fs.walk_lines path
      count++
      continue if count > 5
      info count, rpr line
      matcher.push line
    return matcher
  #.......................................................................................................
  result = await do =>
    p = new Async_pipeline()
    debug '^34-2^', p
    p.push get_source()
    # p.push 'rtethg'
    p.push TF.$split_lines()
    p.push TF.$limit 5
    p.push show = ( d ) -> urge '^34-3^', rpr d
    return await p.run()
  #.........................................................................................................
  T?.eq result, matcher
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # await @can_use_asyncgenerator_as_source()
  # await @can_use_asyncgeneratorfunction_as_source()
  # test @can_use_asyncgenerator_as_source
  # test @can_use_asyncgeneratorfunction_as_source
  # @can_use_asyncfunction_as_transform()
  # test @can_use_asyncfunction_as_transform
  test @

