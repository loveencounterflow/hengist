



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/EVENTEMITTER-AS-STREAM-SOURCE'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# test                      = require 'guy-test'
# _strip_ansi               = require 'strip-ansi'
types                     = new ( require 'intertype' ).Intertype()
{ freeze
  lets }                  = require 'letsfreezethat'
#...........................................................................................................
{ spawn }                 = require 'child_process'


#-----------------------------------------------------------------------------------------------------------
# resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path


#-----------------------------------------------------------------------------------------------------------
demo_low_level = -> new Promise ( resolve, reject ) =>
  PATH                      = require 'path'
  FS                        = require 'fs'
  JFEE                      = require '../../../apps/jfee'
  SP                        = require '../../../apps/steampipes'
  { $
    $show
    $watch
    $drain }                = SP.export()
  #.........................................................................................................
  source      = SP.new_push_source()
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$split_channels()
  pipeline.push $show()
  pipeline.push $drain -> urge "demo_low_level finished"; resolve()
  SP.pull pipeline...
  path  = PATH.join __dirname, '../samples'
  cp    = spawn 'ls', [ '-AlF', path, ]
  for await x from JFEE.Receiver.from_child_process cp, { bare: true, }
    whisper '^3387^', x
    source.send x
  source.end()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_high_level = -> new Promise ( resolve, reject ) =>
  PATH                      = require 'path'
  FS                        = require 'fs'
  JFEE                      = require '../../../apps/jfee'
  SP                        = require '../../../apps/steampipes'
  { $
    $show
    $watch
    $drain }                = SP.export()
  #.........................................................................................................
  path        = PATH.join __dirname, '../samples'
  cp          = spawn 'ls', [ '-AlF', path, ]
  source      = SP.source_from_child_process cp, { bare: true, }
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$split_channels()
  pipeline.push $show()
  pipeline.push $drain -> urge "demo_high_level finished"; resolve()
  SP.pull pipeline...
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_high_level_2 = -> new Promise ( resolve, reject ) =>
  throw new Error "^4447462^ currently not implemented; see steampipes/src/sources.coffee"
  PATH                      = require 'path'
  FS                        = require 'fs'
  JFEE                      = require '../../../apps/jfee'
  SP                        = require '../../../apps/steampipes'
  { $
    $show
    $watch
    $drain }                = SP.export()
  #.........................................................................................................
  path        = PATH.join __dirname, '../samples'
  cp          = spawn 'ls', [ '-AlF', path, ]
  source      = SP.source_from_child_process_2 cp, { bare: true, }
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$split_channels()
  pipeline.push $show()
  pipeline.push $drain -> urge "demo_high_level_2 finished"; resolve()
  SP.pull pipeline...
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_readstream = -> new Promise ( resolve, reject ) =>
  PATH                      = require 'path'
  FS                        = require 'fs'
  SP                        = require '../../../apps/steampipes'
  { $
    $show
    $watch
    $drain }                = SP.export()
  #.........................................................................................................
  path        = PATH.join __dirname, '../samples/file1.txt'
  stream      = FS.createReadStream path
  source      = SP.source_from_readstream stream, { bare: true, raw: false, }
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$split_channels()
  pipeline.push $show()
  pipeline.push $drain -> urge "demo_readstream finished"; resolve()
  await SP.pull pipeline...
  #.........................................................................................................
  return null



############################################################################################################
if module is require.main then do =>
  # await demo_low_level()
  await demo_high_level()
  # await demo_high_level_2()
  await demo_readstream()
  await demo_readstream()


