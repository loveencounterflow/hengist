
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'NODEXH/DEMO'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
FS                        = require 'fs'
PATH                      = require 'path'
SMR                       = require 'source-map-resolve'
SMC                       = require 'source-map'
StackTracey               = require 'stacktracey'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate }              = types

#-----------------------------------------------------------------------------------------------------------
read_file_sync = ( path ) -> FS.readFileSync path, { encoding: 'utf-8', }

#-----------------------------------------------------------------------------------------------------------
demo = ->
  error = new Error "^hengist/nodexh@4458^ simulated error"
  path  = __filename
  code  = read_file_sync path
  ref   = PATH.dirname path
  debug { path, ref, }
  try
    d = SMR.resolveSync code, path, read_file_sync
  catch error
    # if error.code is 'ENOENT'
    #   warn "^4487^ file not found: #{rpr }"
    warn error.code, error.name
    throw error
  info '^330^', 'd.sourcesResolved:',   d.sourcesResolved
  info '^330^', 'd.sourcesContent:',    d.sourcesContent
  info '^330^', 'd.map:',               ( k for k of d.map )
  info '^330^', 'd.map:',               d.map
  info '^330^', 'd.url:',               d.url
  info '^330^', 'd.sourcesRelativeTo:', d.sourcesRelativeTo
  info '^330^', 'd.sourceMappingURL:',  d.sourceMappingURL
  debug ( k for k of SMC )
  # d.map.sourcesContent = d.sourcesContent
  map = new SMC.SourceMapConsumer d.map
  # map = await new SMC.SourceMapConsumer d.map
  map.computeColumnSpans()
  # debug '^2772^', map
  for line in [ 1 .. 120 ]
    column  = 3
    bias1   = SMC.SourceMapConsumerLEAST_UPPER_BOUND
    bias2   = SMC.SourceMapConsumerGREATEST_LOWER_BOUND
    # urge '^7764^', { line, }, ( map.originalPositionFor { line, column: 3, bias: bias1, } ), ( map.originalPositionFor { line, column: 3, bias: bias2, } )
    location  =  map.originalPositionFor { line, column, bias: bias1, }
    # locations = map.originalPositionFor  { line, bias: bias1, }
    continue unless location.line?
    # generated_positions = map.allGeneratedPositionsFor { line: location.line, source: location.source, }
    # locations = map.allGeneratedPositionsFor location
    urge '^7764^', { line, }, location
    for c in [ column .. column + 10 ]
      location  =  map.originalPositionFor { line, column: c, bias: bias1, }
      whisper location
    # for gp in generated_positions
    #   help '^7764^', ' ', gp
    #   # help '^7764^', ' ', map.originalPositionFor { line: gp.line, column: gp.column, }
    #   # urge '^7764^', ' ', map.originalPositionFor { line: gp.line, column: gp.lastColumn + 1, }
  return null

#-----------------------------------------------------------------------------------------------------------
_demo_async = ->
  h = ( x ) -> new Promise ( resolve, reject ) ->
    s = ->
      if x is 1 then throw new Error "^227-1^ x cannot be 1"; unreachable = yes
      if x is 16 then return reject new Error "^227-2^ x cannot be 16"
      resolve x ** 2
    setTimeout s, 250
  g = ( x ) -> new Promise ( resolve ) -> setTimeout ( -> resolve h x ** 2 ), 250
  f = ( x ) -> new Promise ( resolve ) -> setTimeout ( -> resolve g x ** 2 ), 250
  # --enable-source-maps --stack-trace-limit=100
  urge await f 3
  urge await f 2
  # urge await f 1

#-----------------------------------------------------------------------------------------------------------
demo_async = ->
  { findSourceMap, SourceMap } = require 'module'
  validate.function findSourceMap
  try
    await _demo_async()
  catch error
    warn error
  if error?
    demo_stacktracey error
    frame = ( new StackTracey error )[ 0 ] #.reverse()
    # { callee, calleeShort, file, fileRelative, fileShort, fileName, line, column, } = frame
    path = frame.file
    # debug frames[ 0 ]
    # [ path, line, column, ] = frames[ 0 ]
    debug '^334^', findSourceMap #(path[, error])
    debug '^334^', SourceMap #(path[, error])
    debug '^334^', sourcemap = findSourceMap path, error
    debug '^334^', ( k for k of sourcemap )
    urge '^3736^', sourcemap.payload.file
    # urge '^3736^', sourcemap.payload.version
    urge '^3736^', sourcemap.payload.sources
    # urge '^3736^', sourcemap.payload.sourcesContent
    urge '^3736^', sourcemap.payload.names
    # urge '^3736^', sourcemap.payload.mappings
    # urge '^3736^', sourcemap.payload.sourceRoot
    # for line in [ 1 .. 50 ]
    #   column = 0
    info '^767^', "frame:", frame
    { line, column, } = frame
    zbline            = line    - 1
    zbcolumn          = column  - 1
    p1 = sourcemap.findEntry zbline, zbcolumn
    info '^767^', { line, column, zbline, zbcolumn, }
    info '^767^', p1
    info '^767^', { generated: { line: p1.generatedLine + 1, column: p1.generatedColumn + 1 }, original: { line: p1.originalLine + 1, column: p1.originalColumn + 1 }}
    zbl = zbline
    zbc = zbcolumn
    loop
      zbc++
      break if zbc - zbcolumn > 6
      p2 = sourcemap.findEntry zbl, zbc
      urge '^930^', { line, column: zbc, }, p2
    return
      # continue if ( p1.originalLine is p2.originalLine ) and ( p1.originalColumn is p2.originalColumn )
      # break
    warn error.message
    # throw error
  return null

#-----------------------------------------------------------------------------------------------------------
demo_stacktracey = ( error, handler ) ->
  frames = ( new StackTracey error ) #.reverse()
  for frame in frames
    { callee, calleeShort, file, fileRelative, fileShort, fileName, line, column, } = frame
    file    = null if file    in [ '', undefined, ]
    callee  = null if callee  in [ '', undefined, ]
    if file?
      info 'stacktracey', [ file, line, column, callee, ]
    else
      info 'stacktracey', '——————————————————'
  # resolve_locations frames, handler
  return null

#-----------------------------------------------------------------------------------------------------------
demo_async_handler = ->
  exit_handler = ( error ) ->
    setImmediate ->
      setTimeout ( -> urge 'later' ), 500
      debug '^33443^', error
    return null
  process.on 'uncaughtExceptionMonitor',  exit_handler
  process.on 'unhandledRejection', exit_handler
  throw new Error "^4476^ an error"

#-----------------------------------------------------------------------------------------------------------
demo_synchronous_await = ->
  f = -> new Promise ( resolve, reject ) -> await g()
  g = -> new Promise ( resolve, reject ) -> await h()
  h = -> new Promise ( resolve, reject ) -> reject new Error "foobar"
  await f()




############################################################################################################
if module is require.main then do =>
  # await demo()
  await demo_async()
  # await demo_synchronous_await()


