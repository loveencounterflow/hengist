

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAYRB/BENCHMARKS'
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
ZLIB                      = require 'zlib'
SVGO                      = require 'svgo'


#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  # DATOM = require '../../../apps/datom'
  #.........................................................................................................
  svg_paths   = DATA.get_svg_pathdata cfg.path_count
  #.........................................................................................................
  deflate_dict  = Buffer.from "M 727 -397 Q 748 -397 794 -370 Q 840 -342 840 -322 Q 840 -315 832 -310 Q 824 -305 817 -305 L 784 -309 Q 697 -320 630 -320 Q 494 -320 285 -291 Q 282 -29M 811 -601 Q 811 -588 784 -588 Q 782 -588 757 -589 Q 731 -590 691 -591 Q 651 -593 613 -593 Q 549 -593 502 -588 L 461 -582"
  data_cache    = { svg_paths, deflate_dict, }
  data_cache    = freeze data_cache
  whisper "...done"
  return data_cache

#-----------------------------------------------------------------------------------------------------------
despace_svg_pathdata = ( svg_pathda ) ->
  R = svg_pathda
  R = R.replace /([0-9])\x20([^0-9])/g, '$1$2'
  R = R.replace /([^0-9])\x20([0-9])/g, '$1$2'
  return R

# #-----------------------------------------------------------------------------------------------------------
# despace_svg_pathdata_2 = ( svg_pathda ) ->
#   return svg_pathda.replace /([0-9])\x20([^0-9])|([^0-9])\x20([0-9])/g, '$1$2$3$4'

#-----------------------------------------------------------------------------------------------------------
@svgo = ( cfg ) -> new Promise ( resolve ) =>
  { svg_paths       } = @get_data cfg
  original_size       = 0
  compressed_size     = 0
  count               = 0
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    for svg_path in svg_paths
      svg                       = """<svg><path d='#{svg_path}'/></svg>"""
      { data: svg_optimized, }  = SVGO.optimize svg
      compressed_svg_path       = svg_optimized.replace /^.*d="([^"]+)".*$/, '$1'
      original_size            += svg_path.length
      compressed_size          += compressed_svg_path.length
      count++
      if cfg.show
        debug '^3343^', svg_path
        debug '^3343^', compressed_svg_path
    original_size_txt   = CND.format_number original_size
    compressed_size_txt = CND.format_number compressed_size
    ratio               = compressed_size / original_size
    ratio_txt           = ratio.toFixed 3
    debug '^23^', "original_size: #{original_size_txt}, compressed_size: #{compressed_size_txt}, ratio: #{ratio_txt}"
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_despace = ( cfg ) -> new Promise ( resolve ) =>
  { svg_paths       } = @get_data cfg
  original_size       = 0
  compressed_size     = 0
  count               = 0
  despace             = switch cfg.method
    when 1  then  despace = despace_svg_pathdata
    when 2  then  despace = despace_svg_pathdata_2
    else throw new Error "^7409^ unknown method #{rpr cfg.method}"
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    for svg_path in svg_paths
      original_size            += svg_path.length
      compressed_svg_path       = despace svg_path
      compressed_size          += compressed_svg_path.length
      count++
      if cfg.show
        debug '^3343^', svg_path
        debug '^3343^', compressed_svg_path
    original_size_txt   = CND.format_number original_size
    compressed_size_txt = CND.format_number compressed_size
    ratio               = compressed_size / original_size
    ratio_txt           = ratio.toFixed 3
    debug '^23^', "original_size: #{original_size_txt}, compressed_size: #{compressed_size_txt}, ratio: #{ratio_txt}"
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@despace_1 = ( cfg ) => @_despace { cfg..., method: 1, }
# @despace_2 = ( cfg ) => @_despace { cfg..., method: 2, }

#-----------------------------------------------------------------------------------------------------------
@_zlib = ( cfg ) -> new Promise ( resolve ) =>
  compress      = switch cfg.method
    when 'deflate'        then ZLIB.deflateSync
    when 'deflateraw'     then ZLIB.deflateRawSync
    when 'deflaterawdict' then ZLIB.deflateRawSync
    when 'gzip'           then ZLIB.gzipSync
    when 'brotli'         then ZLIB.brotliCompressSync
    else throw new Error "^445488^ unknown method #{rpr cfg.method}"
  decompress    = switch cfg.method
    when 'deflate'        then ZLIB.inflateSync
    when 'deflateraw'     then ZLIB.inflateRawSync
    when 'deflaterawdict' then ZLIB.inflateRawSync
    when 'gzip'           then ZLIB.gunzipSync
    when 'brotli'         then ZLIB.brotliDecompressSync
    else throw new Error "^445488^ unknown method #{rpr cfg.method}"
  #.........................................................................................................
  { svg_paths
    deflate_dict  }   = @get_data cfg
  count               = 0
  decompression_count = 0
  zlib_cfg            = {}
  zlib_cfg.dictionary = deflate_dict if cfg.method is 'deflaterawdict'
  zlib_cfg.level      = cfg.level ? -1
  zlib_cfg.strategy   = cfg.strategy ? ZLIB.constants.Z_DEFAULT_STRATEGY
  original_size       = 0
  compressed_size     = 0
  if cfg.despace  then  despace = despace_svg_pathdata
  else                  despace = ( x ) -> x
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    for svg_path in svg_paths
      original_size      += ( Buffer.from svg_path ).length
      svg_path            = despace svg_path
      original_buffer     = Buffer.from svg_path
      compressed_buffer   = compress original_buffer, zlib_cfg
      compressed_size    += compressed_buffer.length
      if Math.random() < cfg.outline_usage_rate
        decompression_count++
        decompressed_buffer = decompress compressed_buffer
        decompressed_size   = decompressed_buffer.length
        warn "^3445^", { decompressed_size, original_size: original_buffer.length, }, cfg if original_buffer.length isnt decompressed_size
      if cfg.show
        debug '^4354^', original_buffer.toString()[ .. 50 ]
        debug '^4354^', original_buffer.length, compressed_buffer.length
      count++
    original_size_txt   = CND.format_number original_size
    compressed_size_txt = CND.format_number compressed_size
    ratio               = compressed_size / original_size
    ratio_txt           = ratio.toFixed 3
    debug '^23^', "original_size: #{original_size_txt}, compressed_size: #{compressed_size_txt}, ratio: #{ratio_txt}; decompression_count: #{decompression_count}"
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@zlib_deflateraw_1            = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 1, strategy: ZLIB.constants.Z_DEFAULT_STRATEGY, }
@zlib_deflateraw_1_hfm        = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 1, strategy: ZLIB.constants.Z_HUFFMAN_ONLY, despace: false, }
@zlib_deflateraw_1_hfm_optim  = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 1, strategy: ZLIB.constants.Z_HUFFMAN_ONLY, despace: true, }
@zlib_deflateraw_1_rle        = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 1, strategy: ZLIB.constants.Z_RLE, }
@zlib_deflateraw_1_fixed      = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 1, strategy: ZLIB.constants.Z_FIXED, }
@zlib_gzip_1                  = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 1, strategy: ZLIB.constants.Z_DEFAULT_STRATEGY, }
@zlib_gzip_1_hfm              = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 1, strategy: ZLIB.constants.Z_HUFFMAN_ONLY, }
@zlib_gzip_1_rle              = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 1, strategy: ZLIB.constants.Z_RLE, }
@zlib_gzip_1_fixed            = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 1, strategy: ZLIB.constants.Z_FIXED, }

@zlib_deflate                 = ( cfg ) => @_zlib { cfg..., method: 'deflate',                    }
@zlib_deflate_1               = ( cfg ) => @_zlib { cfg..., method: 'deflate',        'level': 1, }
@zlib_deflate_5               = ( cfg ) => @_zlib { cfg..., method: 'deflate',        'level': 5, }
@zlib_deflate_9               = ( cfg ) => @_zlib { cfg..., method: 'deflate',        'level': 9, }
@zlib_deflateraw              = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',                 }
@zlib_deflateraw_5            = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 5, }
@zlib_deflateraw_9            = ( cfg ) => @_zlib { cfg..., method: 'deflateraw',     'level': 9, }
@zlib_deflaterawdict          = ( cfg ) => @_zlib { cfg..., method: 'deflaterawdict',             }
@zlib_gzip                    = ( cfg ) => @_zlib { cfg..., method: 'gzip',                       }
@zlib_gzip_5                  = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 5, }
@zlib_gzip_9                  = ( cfg ) => @_zlib { cfg..., method: 'gzip',           'level': 9, }
# @zlib_brotli          = ( cfg ) => @_zlib { cfg..., method: 'brotli',         }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  # cfg           = { path_count: 1_000, }
  cfg           = { path_count: 10_000, }
  # cfg           = { path_count: 3, }
  #.........................................................................................................
  ### outline_usage_rate controls how many of the compressed outlines will get decompressed, thereby
  reflecting the fact that as more and more (hundreds of thousand) outlines are stored, fewer and fewer will
  ever be used for typesetting. It is therefore a measure of how much more we value compression speed over
  decompression speed. ###
  if          0 < cfg.path_count < 1_000  then  cfg.outline_usage_rate = 1.00
  else if 1_000 < cfg.path_count < 5_000  then  cfg.outline_usage_rate = 0.50
  else if 5_000 < cfg.path_count < 10_000 then  cfg.outline_usage_rate = 0.25
  else                                          cfg.outline_usage_rate = 0.10
  #.........................................................................................................
  cfg.show      = cfg.path_count < 10
  repetitions   = 5
  test_names    = [

    'zlib_deflateraw_1_hfm'
    'zlib_gzip_1_hfm'
    'zlib_deflateraw_1_rle'
    'zlib_gzip_1_rle'

    # 'zlib_deflateraw_1_hfm_optim'
    # # 'despace_1'
    # # # 'despace_2' ### not equivalent to despace_1 as it misses some spaces ###

    # 'zlib_deflateraw_1_fixed'
    # 'zlib_deflateraw_1'
    # 'zlib_gzip_1_fixed'
    # 'zlib_gzip_1'

    # # 'svgo'
    # 'zlib_deflate_1'
    # 'zlib_deflate'
    # 'zlib_deflate_5'
    # 'zlib_deflate_9'
    # 'zlib_deflateraw'
    # 'zlib_deflateraw_5'
    # 'zlib_deflateraw_9'
    # # 'zlib_deflaterawdict'
    # 'zlib_gzip'
    # 'zlib_gzip_5'
    # 'zlib_gzip_9'
    # # 'zlib_brotli'
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
  # debug '^233^', "Z_NO_COMPRESSION:       ", ZLIB.constants.Z_NO_COMPRESSION
  # debug '^233^', "Z_BEST_SPEED:           ", ZLIB.constants.Z_BEST_SPEED
  # debug '^233^', "Z_BEST_COMPRESSION:     ", ZLIB.constants.Z_BEST_COMPRESSION
  # debug '^233^', "Z_DEFAULT_COMPRESSION:  ", ZLIB.constants.Z_DEFAULT_COMPRESSION
  # debug '^233^', "Z_FILTERED:             ", ZLIB.constants.Z_FILTERED
  # debug '^233^', "Z_HUFFMAN_ONLY:         ", ZLIB.constants.Z_HUFFMAN_ONLY
  # debug '^233^', "Z_RLE:                  ", ZLIB.constants.Z_RLE
  # debug '^233^', "Z_FIXED:                ", ZLIB.constants.Z_FIXED
  # debug '^233^', "Z_DEFAULT_STRATEGY:     ", ZLIB.constants.Z_DEFAULT_STRATEGY
  # pd                        = 'M839-18C839-31 832-31 812-31C754-31 754-39 754-48C754-48 754-56 758-71L893-612C901-644 909-652 972-652C993-652 1002-652 1002-670C1002-683 994-683 977-683L849-683C827-683 824-683 813-665L473-100L417-661C415-683 413-683 389-683L256-683C240-683 229-683 229-664C229-652 237-652 256-652C287-652 314-652 314-635C314-632 314-630 310-616L182-101C168-45 130-33 85-31C77-31 66-30 66-12C66-3 72 0 79 0C109 0 143-3 174-3C206-3 241 0 272 0C278 0 290 0 290-18C290-30 283-31 271-31C214-33 212-59 212-74C212-77 212-83 216-99L349-630L350-630L411-24C413-7 413 0 428 0C441 0 446-7 452-18L825-639L826-639L685-73C677-39 671-31 603-31C587-31 576-31 576-12C576 0 587 0 590 0C627 0 666-3 704-3C742-3 783 0 820 0C827 0 839 0 839-18Z'
  # svg                       = """<svg><path d='#{pd}'/></svg>"""
  # { data: svg_optimized, }  = SVGO.optimize svg
  # pd_optimized              = svg_optimized.replace /^.*d="([^"]+)".*$/, '$1'
  # debug '^746^', pd
  # debug '^746^', pd_optimized
  # debug '^746^', svg.length, svg_optimized.length, svg_optimized.length / svg.length


