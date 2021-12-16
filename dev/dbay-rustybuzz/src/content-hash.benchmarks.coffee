

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CONTENT-HASH-BENCHMARKS'
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
GUY                       = require 'guy'
XXHADD                    = require 'xxhash-addon'
{ walk_lines }            = ( require '../../../apps/guy' ).fs
CRYPTO                    = require 'crypto'
XXH                       = require 'xxhashjs'
CP                        = require 'child_process'


# #-----------------------------------------------------------------------------------------------------------
# @get_data = ( cfg ) ->
#   return data_cache if data_cache?
#   whisper "retrieving test data..."
#   # DATOM = require '../../../apps/datom'
#   #.........................................................................................................
#   buffer        = Buffer.from DATA.get_svg_pathdata cfg.path_count
#   data_cache    = GUY.lft.freeze { buffer, }
#   whisper "...done"
#   return data_cache

#-----------------------------------------------------------------------------------------------------------
@_crypto = ( cfg ) -> new Promise ( resolve ) =>
  { classname         } = cfg
  # { buffer            } = @get_data cfg
  clasz                 = XXHADD[ classname ]
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count   = 0
    hasher  = CRYPTO.createHash classname
    for line from walk_lines cfg.path, { decode: false, }
      count += line.length
      hasher.update line
    digest = hasher.digest()
    debug '^339^', digest.toString 'hex' if cfg.show
    # hasher.reset();
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_xxhadd = ( cfg ) -> new Promise ( resolve ) =>
  { classname         } = cfg
  # { buffer            } = @get_data cfg
  clasz                 = XXHADD[ classname ]
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count   = 0
    hasher  = new clasz()
    for line from walk_lines cfg.path, { decode: false, }
      count += line.length
      hasher.update line
    digest = hasher.digest()
    debug '^339^', digest.toString 'hex' if cfg.show
    # hasher.reset();
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_xxh = ( cfg ) -> new Promise ( resolve ) =>
  { classname         } = cfg
  # { buffer            } = @get_data cfg
  clasz                 = XXH[ classname ]
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count   = 0
    hasher  = clasz()
    for line from walk_lines cfg.path, { decode: false, }
      count += line.length
      hasher.update line
    digest = hasher.digest()
    debug '^339^', digest.toString 16 if cfg.show
    # hasher.reset();
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_cp = ( cfg ) -> new Promise ( resolve ) =>
  ###
  sha224sum
  sha256sum-mint
  sha512sum
  sha256sum
  sharesec
  sha1sum
  sha384sum
  shasum
  ###
  count = ( FS.statSync cfg.path ).size
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    # options = [ '-b', 'nonexistingfile', ]
    options = [ '-b', cfg.path, ]
    result  = CP.spawnSync cfg.classname, options
    throw ( new Error result.stderr.toString 'utf-8' ) if result.status isnt 0
    digest  = result.stdout.toString 'utf-8'
    if cfg.show
      debug '^339^', digest
      # debug '^339^', 'stdout', rpr result.stdout
      # debug '^339^', 'stderr', rpr result.stderr
      # debug '^339^', 'status', rpr result.status
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@sha1                 = ( cfg ) => @_crypto { cfg..., classname: 'sha1',      }
@sha256               = ( cfg ) => @_crypto { cfg..., classname: 'sha256',    }
@md5                  = ( cfg ) => @_crypto { cfg..., classname: 'md5',       }
@xxhadd_32            = ( cfg ) => @_xxhadd { cfg..., classname: 'XXHash32',  }
@xxhadd_64            = ( cfg ) => @_xxhadd { cfg..., classname: 'XXHash64',  }
@xxhadd_3             = ( cfg ) => @_xxhadd { cfg..., classname: 'XXHash3',   }
@xxhadd_128           = ( cfg ) => @_xxhadd { cfg..., classname: 'XXHash128', }
@xxh32                = ( cfg ) => @_xxh    { cfg..., classname: 'h32',       }
@xxh64                = ( cfg ) => @_xxh    { cfg..., classname: 'h64',       }
@cp_sha1sum           = ( cfg ) => @_cp     { cfg..., classname: 'sha1sum',   }
@cp_sha512sum         = ( cfg ) => @_cp     { cfg..., classname: 'sha512sum', }
@cp_sha256sum         = ( cfg ) => @_cp     { cfg..., classname: 'sha256sum', }
@cp_sha224sum         = ( cfg ) => @_cp     { cfg..., classname: 'sha224sum', }
@cp_md5sum            = ( cfg ) => @_cp     { cfg..., classname: 'md5sum',    }



#-----------------------------------------------------------------------------------------------------------
@guy_fs_walk_lines = ( cfg ) -> new Promise ( resolve ) =>
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count         = 0
    for line from walk_lines cfg.path, { decode: false, }
      count += line.length
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  path          = 'larry-wall-on-regexes.html';   show = false
  path          = 'short-proposal.mkts.md';       show = true
  path          = 'svg-pathdata.txt';             show = false
  path          = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  cfg           = { path, show, }
  repetitions   = 3
  test_names    = [
    'sha1'
    'sha256'
    'md5'
    # 'xxhadd_32'
    # 'xxhadd_64'
    # 'xxhadd_3'
    'xxhadd_128'
    'cp_sha512sum'
    'cp_sha256sum'
    'cp_sha1sum'
    'cp_sha224sum'
    'cp_md5sum'
    'guy_fs_walk_lines'
    # 'xxh32'
    # 'xxh64'
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
