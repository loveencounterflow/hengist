

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
HOLLERITH_CODEC_TNG       = ( require '../../../apps/hollerith-codec/lib/tng' ).HOLLERITH_CODEC
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  defaults
  validate }              = types.export()
CHARWISE                  = require 'charwise' ### https://github.com/dominictarr/charwise ###
BYTEWISE                  = require 'bytewise' ### https://github.com/deanlandolt/bytewise ###



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
      x = HOLLERITH_CODEC_TNG.encode integer_list
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
      x = HOLLERITH_CODEC_TNG._encode_bcd [ integer_list, ]
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@bytewise = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = BYTEWISE.encode [ integer_list, ]
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@charwise = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = CHARWISE.encode [ integer_list, ]
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
  cfg           = { list_count: 3e5, list_length_min: 1, list_length_max: HOLLERITH_CODEC_TNG.vnr_width, }
  repetitions   = 5
  test_names    = [
    'hollerith_classic'
    'hollerith_tng'
    'hollerith_bcd'
    'bytewise'
    'charwise'
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
  # debug '^787^', type_of CHARWISE.encode 'helo world'
  # debug '^787^', type_of CHARWISE.encode [ 4, 5, 6, ]
  # debug '^787^', rpr CHARWISE.buffer
  # debug '^787^', type_of BYTEWISE.encode 'helo world'
  # debug '^787^', type_of BYTEWISE.encode [ 4, 5, 6, ]



