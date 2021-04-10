

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
@FDE = ( cfg ) -> @_benchmark_by_name cfg, 'FDE'
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
    'FDE'
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

 ~/jzr/jseq  master !3  ~/jzr/nodexh/bin/nodexh ~/jzr/hengist/dev/jseq/lib/usecase1.benchmarks.js                                                         INT ✘  12s
00:00 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
JKR                                        0.766 s          99,812 items         130,373⏶Hz           7,670⏷nspc
FDQ                                        0.212 s          99,812 items         471,069⏶Hz           2,123⏷nspc
FDE                                        0.208 s          99,812 items         479,546⏶Hz           2,085⏷nspc
00:05 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
FDE                                        0.330 s         100,334 items         304,451⏶Hz           3,285⏷nspc
JKR                                        0.744 s         100,334 items         134,934⏶Hz           7,411⏷nspc
FDQ                                        0.214 s         100,334 items         469,278⏶Hz           2,131⏷nspc
00:10 JSEQ  ▶  ------------------------------------------------------------------------------------------------------------
JKR                                        0.833 s         100,168 items         120,311⏶Hz           8,312⏷nspc
FDQ                                        0.202 s         100,168 items         495,247⏶Hz           2,019⏷nspc
FDE                                        0.200 s         100,168 items         500,233⏶Hz           1,999⏷nspc
00:14 HENGIST/BENCHMARKS  ▶  FDQ                                              478,531 Hz   100.0 % │████████████▌│
00:14 HENGIST/BENCHMARKS  ▶  FDE                                              428,077 Hz    89.5 % │███████████▏ │
00:14 HENGIST/BENCHMARKS  ▶  JKR                                              128,539 Hz    26.9 % │███▍         │


###


