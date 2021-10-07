

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'IN-MEMORY-SQL'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
DATA                      = require '../../../lib/data-providers-nocache'
test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null
gcfg                      = { verbose: false, }
{ freeze }                = require 'letsfreezethat'


#-----------------------------------------------------------------------------------------------------------
@intertext_splitlines = ( cfg ) -> new Promise ( resolve ) =>
  SL = require 'intertext-splitlines'
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    ctx   = SL.new_context
      splitter:         '\n'
      decode:           true
      skip_empty_last:  true
      keep_newlines:    true
    path        = cfg.paths[ cfg.size ]
    fd          = FS.openSync path
    loop
      buffer     = Buffer.alloc cfg.chunk_size
      bytes_read = FS.readSync fd, buffer
      break if bytes_read is 0
      buffer = buffer.slice 0, bytes_read if bytes_read < cfg.chunk_size
      for line from SL.walk_lines ctx, buffer
        count++
        debug '^888-1^', { count, line, } if cfg.show
    for line from SL.flush ctx
      count++
      debug '^888-2^', { count, line, } if cfg.show
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_n_readlines = ( cfg ) -> new Promise ( resolve ) =>
  if cfg.use_patched then Readlines = require '../../../apps/guy/dependencies/n-readlines-patched'
  else                    Readlines = require 'n-readlines'
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count         = 0
    path          = cfg.paths[ cfg.size ]
    readlines_cfg =
      readChunk:          cfg.chunk_size
      newLineCharacter:   '\n'      # nl
    readlines = new Readlines path, readlines_cfg
    while ( line = readlines.next() ) isnt false
      count++
      line = line.toString 'utf-8'
      debug '^888-1^', { count, line, } if cfg.show
    resolve count
  return null

@n_readlines          = ( cfg ) -> @_n_readlines { cfg..., use_patched: false, }
@n_readlines_patched  = ( cfg ) -> @_n_readlines { cfg..., use_patched: true, }

#-----------------------------------------------------------------------------------------------------------
@guy_fs_walk_lines = ( cfg ) -> new Promise ( resolve ) =>
  { walk_lines } = ( require '../../../apps/guy' ).fs
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count         = 0
    path          = cfg.paths[ cfg.size ]
    for line from walk_lines path
      count++
      debug '^888-1^', { count, line, } if cfg.show
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  cfg           =
    # size:         'small'
    size:         'big1'
    # chunk_size:   100
    # chunk_size:   1 * 1024
    chunk_size:   4 * 1024 ### optimum ###
    # chunk_size:   8 * 1024
    # chunk_size:   16 * 1024
    # chunk_size:   64 * 1024
    paths:
      small:  PATH.resolve PATH.join __dirname, '../../../assets/a-few-words.txt'
      big1:   '/usr/share/dict/american-english'
  cfg.show      = cfg.size is 'small'
  repetitions   = 5
  test_names    = [
    'n_readlines'
    'n_readlines_patched'
    'intertext_splitlines'
    'guy_fs_walk_lines'
    ]
  global.gc() if global.gc?
  data_cache = null
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      global.gc() if global.gc?
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()
