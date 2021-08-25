

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
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  defaults
  validate }              = types.export()
{ lets
  freeze }                = require 'letsfreezethat'
#-----------------------------------------------------------------------------------------------------------
HCODECLEGACY              = require '../../../apps/hollerith-codec-legacy'
HCODECLEGACY_TNG          = ( require '../../../apps/hollerith-codec-legacy/lib/tng' ).HOLLERITH_CODEC
CHARWISE                  = require 'charwise' ### https://github.com/dominictarr/charwise ###
BYTEWISE                  = require 'bytewise' ### https://github.com/deanlandolt/bytewise ###
{ HOLLERITH
  Hollerith }             = require '../../../apps/hollerith'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  integer_lists = []
  list_lengths  = DATA.get_integers cfg.list_count, cfg.list_length_min, cfg.list_length_max
  #.........................................................................................................
  for list_length in list_lengths
    # integer_lists.push DATA.get_integers list_length, HOLLERITH.nr_min, HOLLERITH.nr_max
    integer_lists.push DATA.get_integers list_length, -100, +100
  #.........................................................................................................
  data_cache  = { integer_lists, }
  data_cache  = freeze data_cache
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
      x = HCODECLEGACY.encode integer_list
      urge '^234-1^', x if cfg.show
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
      x = HCODECLEGACY_TNG.encode integer_list
      urge '^234-2^', x if cfg.show
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_hollerith2 = ( cfg, hlr ) -> new Promise ( resolve ) =>
  { integer_lists, }  = @get_data cfg
  HLR                 = new Hollerith hlr
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = HLR.encode integer_list
      urge '^234-3^', x if cfg.show
      count++
    resolve count
  return null
@hollerith2_with_validation = ( cfg ) -> @_hollerith2 cfg, { validate: true, }
@hollerith2_no_validation   = ( cfg ) -> @_hollerith2 cfg, { validate: false, }
@hollerith2_nv_bcd          = ( cfg ) -> @_hollerith2 cfg, { validate: false, format: 'bcd', }

#-----------------------------------------------------------------------------------------------------------
@hollerith_bcd = ( cfg ) -> new Promise ( resolve ) =>
  { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    for integer_list in integer_lists
      x = HCODECLEGACY_TNG._encode_bcd integer_list
      urge '^234-4^', x if cfg.show
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
      x = BYTEWISE.encode integer_list
      urge '^234-5^', x if cfg.show
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
      x = CHARWISE.encode integer_list
      urge '^234-6^', x if cfg.show
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose    = true
  gcfg.verbose    = false
  bench           = BM.new_benchmarks()
  mode            = 'standard'
  mode            = 'medium'
  mode            = 'functional_test'
  list_length_max = Hollerith.C.defaults.hlr_constructor_cfg.vnr_width
  switch mode
    when 'standard'
      cfg           = { list_count: 3e5, list_length_min: 1, list_length_max, }
      repetitions   = 5
    when 'medium'
      cfg           = { list_count: 1e4, list_length_min: 1, list_length_max, }
      repetitions   = 1
    when 'functional_test'
      cfg           = { list_count: 3, list_length_min: 1, list_length_max, }
      repetitions   = 1
  cfg.show      = cfg.list_count < 10
  test_names    = [
    'hollerith2_nv_bcd'
    'hollerith_tng'
    'hollerith_bcd'
    'hollerith2_with_validation'
    'hollerith2_no_validation'
    'hollerith_classic'
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



