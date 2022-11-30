
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
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/TESTS/STREAMS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@can_use_readstream_as_source = ( T, done ) ->
  # T?.halt_on_error()
  PATH                  = require 'path'
  FS                    = require 'fs'
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
    help '^34-3^', p
    return await p.run()
  #.........................................................................................................
  T?.eq result, matcher
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@can_use_writestream_as_target_1 = ( T, done ) ->
  # T?.halt_on_error()
  FS                    = require 'node:fs'
  GUY                   = require '../../../apps/guy'
  { Async_pipeline
    $               }   = require '../../../apps/moonriver'
  last                  = Symbol 'last'
  source                = "ファイルに書きたいテキストです。"
  p                     = new Async_pipeline()
  #.........................................................................................................
  await GUY.temp.with_file { keep: false, }, ( temp ) ->
    output = FS.createWriteStream temp.path, { encoding: 'utf-8', }
    debug temp.path
    #.......................................................................................................
    p.push source
    #.......................................................................................................
    p.push ( d ) ->
      await new Promise ( resolve ) ->
        output.write d, ->
          # info '^342^', output.bytesWritten
          resolve()
    #.......................................................................................................
    p.push $ { last }, ( d ) ->
      return null unless d is last
      await output.end()
      await output.close()
      return null
    p.push ( d ) -> help '^45-2^', rpr d
    # p.push output
    #.......................................................................................................
    result        = await p.run()
    result        = result.join ''
    written_text  = FS.readFileSync temp.path, { encoding: 'utf-8', }
    T?.eq result,       source
    T?.eq written_text, source
    info '^45-2^', result
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_writestream_as_target_3 = ( T, done ) ->
  # T?.halt_on_error()
  FS                    = require 'node:fs'
  GUY                   = require '../../../apps/guy'
  { Async_pipeline    } = require '../../../apps/moonriver'
  source                = "ファイルに書きたいテキストです。"
  p                     = new Async_pipeline()
  #.........................................................................................................
  await GUY.temp.with_file { keep: false, }, ( temp ) ->
    output = FS.createWriteStream temp.path, { encoding: 'utf-8', }
    debug temp.path
    #.......................................................................................................
    p.push source
    p.push ( d ) -> help '^45-2^', rpr d
    p.push output
    #.......................................................................................................
    result        = await p.run()
    result        = result.join ''
    written_text  = FS.readFileSync temp.path, { encoding: 'utf-8', }
    T?.eq result,       source
    T?.eq written_text, source
    info '^45-2^', result
  done?()

#-----------------------------------------------------------------------------------------------------------
@writestream_accepts_buffers = ( T, done ) ->
  # T?.halt_on_error()
  FS                    = require 'node:fs'
  GUY                   = require '../../../apps/guy'
  { Async_pipeline    } = require '../../../apps/moonriver'
  source                = [ 0 .. 9 ]
  p                     = new Async_pipeline()
  #.........................................................................................................
  await GUY.temp.with_file { keep: false, }, ( temp ) ->
    output = FS.createWriteStream temp.path, { encoding: 'utf-8', }
    debug temp.path
    #.......................................................................................................
    p.push source
    p.push ( d ) -> help '^47-1^', rpr d
    p.push ( d, send ) -> send Buffer.from rpr d
    p.push ( d ) -> urge '^47-2^', rpr d
    p.push output
    #.......................................................................................................
    matcher       = ( rpr d for d in source ).join ''
    result        = await p.run()
    result        = result.join ''
    written_text  = FS.readFileSync temp.path, { encoding: 'utf-8', }
    T?.eq result,       matcher
    T?.eq written_text, matcher
    info '^47-3^', rpr matcher
    info '^47-4^', rpr result
    info '^47-5^', rpr written_text
  done?()


############################################################################################################
if require.main is module then do =>
  # @window_transform()
  # await @can_use_readstream_as_source()
  # test @can_use_readstream_as_source
  # await @can_use_writestream_as_target_2()
  # @can_use_writestream_as_target_3()
  await @writestream_accepts_buffers()
  await test @writestream_accepts_buffers
  # test @

