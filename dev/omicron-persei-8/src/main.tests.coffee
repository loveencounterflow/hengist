
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'OMICRON-PERSEI-8/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types
defer                     = setImmediate


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "OMICRON-PERSEI-8 API 1" ] = ( T, done ) ->
  LRRR        = require '../../../apps/omicron-persei-8'
  CAT         = require 'multimix/lib/cataloguing'
  names       = [ '$', 'remit', 'types', 'export', ]
  LRRR_export = LRRR.export()
  #.........................................................................................................
  for name in names
    T.ok ( LRRR[ name         ] )?
    T.ok ( LRRR_export[ name  ] )?
  # urge CAT.all_keys_of LRRR
  # urge ( k for k of LRRR )
  # urge ( k for k of LRRR.export() )
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "OMICRON-PERSEI-8 API 2" ] = ( T, done ) ->
  LRRR = require '../../../apps/omicron-persei-8'
  probes_and_matchers = [
    [ [ 'function', 'remit',  ], true, ]
    [ [ 'function', '$',      ], true, ]
    [ [ 'object',   'types',  ], true, ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ type, name, ] = probe
      resolve isa[ type ] LRRR[ name ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "OMICRON-PERSEI-8.remit 1" ] = ( T, done ) ->
  # debug '^776^', ( k for k of require 'readable-stream' ); return done()
  { $, }        = require '../../../apps/omicron-persei-8'
  CAT           = require 'multimix/lib/cataloguing'
  FS            = require 'fs'
  { Readable
    Transform
    Writable }  = require 'readable-stream'
  #.........................................................................................................
  read = ( size ) ->
    urge '^read@1^' # , CAT.all_keys_of @
    for d in [ 1 .. 3 ]
      @push d
    @push null
    @destroy()
    # @emit 'end'
    # @emit 'close'
    # debug ( k for k of @ )
  #.........................................................................................................
  transform = ( d, _, done ) ->
    urge '^transform@1^', rpr d
    @push d.toString()
    done()
  #.........................................................................................................
  $remitter = => $ ( d, send ) =>
    urge '^remit@1^', ( rpr d )[ .. 50 ] + '...'
    send d #.toString 'utf-8' ### TAINT not safe as could be chunked ###
  #.........................................................................................................
  write = ( d, _, done ) ->
    urge '^write@1^', ( rpr d )[ .. 50 ] + '...'
    done()
  #.........................................................................................................
  # source  = FS.createReadStream __filename
  source  = new Readable { read, objectMode: true, }
  stream  = source
  # # stream  = stream.pipe new Transform { transform, }
  stream  = stream.pipe $remitter()
  stream  = stream.pipe new Writable { write, objectMode: true, }
  #.........................................................................................................
  source.on 'end',    -> info '^source:end^'
  source.on 'close',  -> info '^source:close^'; defer -> done()
  stream.on 'end',    -> info '^stream:end^'
  stream.on 'close',  -> info '^stream:close^'
  # defer -> done()
  return null


############################################################################################################
if module is require.main then do => # await do =>
  test @





