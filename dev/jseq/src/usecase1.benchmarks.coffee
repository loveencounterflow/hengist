

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'JSEQ'
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
_IMPLEMENTATIONS          = require '../../../apps/jseq/lib/implementations'
IMPLEMENTATIONS           = {}

do =>
  for key, value of _IMPLEMENTATIONS
    unless ( match = key.match /^(?<nick>[^:]+)/ )?
      throw new Error "^bm/jseq@245 unexpected key #{rpr key}"
    { nick, }               = match.groups
    IMPLEMENTATIONS[ nick ] = value
  return null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  { _deep_copy: copy, } = require '../../../apps/letsfreezethat'
  return data_cache if data_cache?
  datoms      = DATA.get_random_datoms cfg.set_count * 2
  datom_pairs = []
  #.........................................................................................................
  for idx in [ 0 ... datoms.length ] by +2
    d = datoms[ idx     ]
    e = datoms[ idx + 1 ]
    if Math.random() > 0.5
      datom_pairs.push [ d, e, ]
      datom_pairs.push [ d, ( copy d ), ]
  #.........................................................................................................
  data_cache  = {
    datom_pairs }
  data_cache  = ( require '../../../apps/letsfreezethat' ).freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_benchmark_by_name = ( cfg, nick ) -> new Promise ( resolve ) =>
  sublibrary = IMPLEMENTATIONS[ nick ]
  unless sublibrary?
    throw new Error "^bm/jseq@223 unknown sublibrary #{rpr sublibrary}"
  { eq, ne, } = sublibrary
  # @types.validate.hengist_dataprv_cfg cfg
  { datom_pairs, } = @get_data cfg
  resolve => new Promise ( resolve ) =>
    count = 0
    for [ d, e, ] in datom_pairs
      is_equal = eq d, e
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@FDQ = ( cfg ) -> @_benchmark_by_name cfg, 'FDQ'
@JKR = ( cfg ) -> @_benchmark_by_name cfg, 'JKR'



#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  cfg         = { set_count: 5, }
  cfg         = { set_count: 1e4, }
  cfg         = { set_count: 1e5, }
  repetitions = 3
  test_names  = [
    'FDQ'
    'JKR'
    ]
  global.gc() if global.gc?
  for _ in [ 1 .. repetitions ]
    data_cache = null
    global.gc() if global.gc?
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()

###

00:07 HENGIST/BENCHMARKS  ▶  plainjs_mutable                                    8,268 Hz   100.0 % │████████████▌│
00:07 HENGIST/BENCHMARKS  ▶  plainjs_immutable                                  4,933 Hz    59.7 % │███████▌     │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_thaw_freeze_f0                   4,682 Hz    56.6 % │███████▏     │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_standard                         4,464 Hz    54.0 % │██████▊      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_lets_f0                          4,444 Hz    53.8 % │██████▊      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_lets_f1                          4,213 Hz    51.0 % │██████▍      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_thaw_freeze_f1                   4,034 Hz    48.8 % │██████▏      │
00:07 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_nofreeze                         2,143 Hz    25.9 % │███▎         │
00:07 HENGIST/BENCHMARKS  ▶  immutable                                          1,852 Hz    22.4 % │██▊          │
00:07 HENGIST/BENCHMARKS  ▶  mori                                               1,779 Hz    21.5 % │██▊          │
00:07 HENGIST/BENCHMARKS  ▶  hamt                                               1,752 Hz    21.2 % │██▋          │
00:07 HENGIST/BENCHMARKS  ▶  immer                                              1,352 Hz    16.3 % │██           │

###