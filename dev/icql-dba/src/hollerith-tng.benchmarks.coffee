

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
HOLLERITH_CODEC           = require '../../../apps/hollerith-codec'
HOLLERITH_CODEC_TNG       = require '../../../apps/hollerith-codec/lib/tng'



#===========================================================================================================
# IMPLEMENTATIONS (TO BE MOVED TO HOLLERITH-CODEC)
#-----------------------------------------------------------------------------------------------------------
class Hollerith

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    @sign_delta  = 0x80000000  ### used to lift negative numbers to non-negative ###
    @u32_width   = 4           ### bytes per element ###
    @vnr_width   = 5           ### maximum elements in VNR vector ###
    @nr_min      = -0x80000000 ### smallest possible VNR element ###
    @nr_max      = +0x7fffffff ### largest possible VNR element ###
    return undefined

  #---------------------------------------------------------------------------------------------------------
  encode_tng: ( vnr ) ->
    unless 0 < vnr.length <= @vnr_width
      throw new Error "^44798^ expected VNR to be between 1 and #{@vnr_width} elements long, got length #{vnr.length}"
    R           = Buffer.alloc @vnr_width * @u32_width, 0x00 ### TAINT pre-compute constant ###
    offset      = -@u32_width
    for idx in [ 0 ... @vnr_width ]
      R.writeUInt32BE ( vnr[ idx ] ? 0 ) + @sign_delta, ( offset += @u32_width )
    return R

  #---------------------------------------------------------------------------------------------------------
  encode_bcd: ( vnr ) ->
    vnr_width   = 5           ### maximum elements in VNR vector ###
    dpe         = 4           ### digits per element ###
    base        = 36
    plus        = '+'
    minus       = '!'
    padder      = '.'
    R           = []
    for idx in [ 0 ... vnr_width ]
      nr    = vnr[ idx ] ? 0
      sign  = if nr >= 0 then plus else minus
      R.push sign + ( ( Math.abs nr ).toString base ).padStart dpe, padder
    R           = R.join ','
    return R

#===========================================================================================================
HOLLERITH = new Hollerith()

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  DATOM = require '../../../apps/datom'
  integer_lists = []
  list_lengths  = DATA.get_integers cfg.list_count, cfg.list_length_min, cfg.list_length_max
  #.........................................................................................................
  for list_length in list_lengths
    # integer_lists.push DATA.get_integers list_length, HOLLERITH.nr_min, HOLLERITH.nr_max
    integer_lists.push DATA.get_integers list_length, -100, +100
  #.........................................................................................................
  data_cache  = { integer_lists, }
  data_cache  = DATOM.freeze data_cache
  whisper "...done"
  return data_cache


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@hollerith_classic = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = HOLLERITH_CODEC.encode integer_list
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@hollerith_tng = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = HOLLERITH.encode_tng integer_list
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@hollerith_bcd = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = HOLLERITH.encode_bcd [ integer_list, ]
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  cfg           = { list_count: 3e5, list_length_min: 1, list_length_max: HOLLERITH.vnr_width, }
  repetitions   = 5
  test_names    = [
    'hollerith_classic'
    'hollerith_tng'
    'hollerith_bcd'
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
