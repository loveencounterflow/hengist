

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'LFT'
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




#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg, fresh = true ) ->
  @get_data.cache = null if fresh
  return @get_data.cache if @get_data.cache?
  datoms          = DATA.get_random_datoms cfg.set_count
  @get_data.cache = { datoms, }
  return @get_data.cache
@get_data.cache = null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@freeze___letsfreezethat_v2 = ( cfg ) -> new Promise ( resolve ) =>
  LFT           = require '../letsfreezethat@2.2.5'
  { lets
    freeze
    thaw }      = LFT
  data          = @get_data cfg
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = freeze d
      throw new Error '^445-1^ identical' if e is d
      throw new Error '^445-2^ not frozen' unless Object.isFrozen e
      throw new Error '^445-3^ not frozen' unless Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#-----------------------------------------------------------------------------------------------------------
@thaw_____letsfreezethat_v2 = ( cfg ) -> new Promise ( resolve ) =>
  LFT           = require '../letsfreezethat@2.2.5'
  { lets
    freeze
    thaw }      = LFT
  data          = @get_data cfg
  data.datoms   = ( ( freeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = thaw d
      throw new Error '^445-4^ identical' if e is d
      throw new Error '^445-5^ not thawed' if Object.isFrozen e
      throw new Error '^445-6^ not thawed' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@_freeze___letsfreezethat_v3 = ( cfg, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  LFT = require '../../../apps/letsfreezethat/freeze'
  else                    LFT = require '../../../apps/letsfreezethat/nofreeze'
  { lets
    freeze
    thaw }      = LFT
  data          = @get_data cfg
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = freeze d
      throw new Error '^445-16^ not identical' unless e is d
      if lft_cfg.freeze
        throw new Error '^445-17^ not frozen' unless Object.isFrozen e
        throw new Error '^445-18^ not frozen' unless Object.isFrozen e.$vnr
      else
        throw new Error '^445-19^ frozen' if Object.isFrozen e
        throw new Error '^445-20^ frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_thaw_____letsfreezethat_v3 = ( cfg, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  LFT = require '../../../apps/letsfreezethat/freeze'
  else                    LFT = require '../../../apps/letsfreezethat/nofreeze'
  { lets
    freeze
    thaw }      = LFT
  data          = @get_data cfg
  data.datoms   = ( ( freeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = thaw d
      throw new Error '^445-21^ identical' if e is d
      throw new Error '^445-22^ not thawed' if Object.isFrozen e
      throw new Error '^445-23^ not thawed' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@freeze___letsfreezethat_v3_f1 = ( cfg ) -> @_freeze___letsfreezethat_v3 cfg, { freeze: true,  }
@freeze___letsfreezethat_v3_f0 = ( cfg ) -> @_freeze___letsfreezethat_v3 cfg, { freeze: false, }
@thaw_____letsfreezethat_v3_f1 = ( cfg ) -> @_thaw_____letsfreezethat_v3 cfg, { freeze: true,  }
@thaw_____letsfreezethat_v3_f0 = ( cfg ) -> @_thaw_____letsfreezethat_v3 cfg, { freeze: false, }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@freeze___deepfreeze = ( cfg ) -> new Promise ( resolve ) =>
  freeze        = require 'deepfreeze'
  data          = @get_data cfg
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = freeze d ### freezes in-place ###
      throw new Error '^445-24^ not identical' unless e is d
      throw new Error '^445-25^ not frozen' unless Object.isFrozen e
      throw new Error '^445-26^ not frozen' unless Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@freeze___deepfreezer = ( cfg ) -> new Promise ( resolve ) =>
  { freeze
    deepFreeze
    thaw
    deepThaw }  = require 'deepfreezer'
  data          = @get_data cfg
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = deepFreeze d, true ### NOTE use `true` to avoid copying ###
      throw new Error '^445-27^ not identical' unless e is d
      throw new Error '^445-28^ not frozen' unless Object.isFrozen e
      throw new Error '^445-29^ not frozen' unless Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@thaw_____deepfreezer = ( cfg ) -> new Promise ( resolve ) =>
  { freeze
    deepFreeze
    thaw
    deepThaw }  = require 'deepfreezer'
  data          = @get_data cfg
  data.datoms   = ( ( deepFreeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = deepThaw d, true ### NOTE use `true` to avoid copying ###
      throw new Error '^445-30^ identical' if e is d
      throw new Error '^445-31^ frozen' if Object.isFrozen e
      throw new Error '^445-32^ frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@freeze___shallow_native = ( cfg ) -> new Promise ( resolve ) =>
  { freeze }    = Object
  data          = @get_data cfg
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = freeze d, true ### NOTE use `true` to avoid copying ###
      throw new Error '^445-33^ not identical' unless e is d
      throw new Error '^445-34^ not frozen' unless Object.isFrozen e
      throw new Error '^445-35^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@thaw_____shallow_native = ( cfg ) -> new Promise ( resolve ) =>
  { freeze }    = Object
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = Object.assign {}, d
      throw new Error '^445-36^ identical' if e is d
      throw new Error '^445-37^ frozen' if Object.isFrozen e
      throw new Error '^445-38^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@thaw_____fast_copy = ( cfg ) -> new Promise ( resolve ) =>
  # debug require 'fast-copy'
  # debug ( require 'fast-copy').copy
  # debug ( require 'fast-copy').strict
  copy          = require 'fast-copy'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = copy d
      throw new Error '^445-39^ identical' if e is d
      throw new Error '^445-40^ frozen' if Object.isFrozen e
      throw new Error '^445-41^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@thaw_____fast_copy_strict = ( cfg ) -> new Promise ( resolve ) =>
  # debug require 'fast-copy'
  # debug ( require 'fast-copy').copy
  # debug ( require 'fast-copy').strict
  copy          = require 'fast-copy'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = copy.strict d
      throw new Error '^445-42^ identical' if e is d
      throw new Error '^445-43^ frozen' if Object.isFrozen e
      throw new Error '^445-44^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@thaw_____klona = ( cfg ) -> new Promise ( resolve ) =>
  { klona }     = require 'klona/json'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = klona d
      throw new Error '^445-45^ identical' if e is d
      throw new Error '^445-46^ frozen' if Object.isFrozen e
      throw new Error '^445-47^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@thaw_____deepcopy = ( cfg ) -> new Promise ( resolve ) =>
  deepcopy      = require 'deepcopy'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = deepcopy d
      throw new Error '^445-48^ identical' if e is d
      throw new Error '^445-49^ frozen' if Object.isFrozen e
      throw new Error '^445-50^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@_prewarm = ( cfg ) ->
  ignore = []
  for _ in [ 1 .. cfg.repetitions ]
    ignore.push @get_data cfg.set_count for _ in [ 1 .. 5 ]
  # ignore.length = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  return -> new Promise ( resolve ) -> resolve 1


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  # n           = 100000
  cfg         = { repetitions: 3, set_count: 100, }
  cfg         = { repetitions: 3, set_count: 1, }
  cfg         = { repetitions: 3, set_count: 10, }
  cfg         = { repetitions: 3, set_count: 1000, }
  cfg         = { repetitions: 3, set_count: 10000, }
  test_names  = [
    'thaw_____letsfreezethat_v2'
    'freeze___letsfreezethat_v2'

    'thaw_____klona'
    'thaw_____fast_copy'
    'thaw_____letsfreezethat_v3_f1'
    'thaw_____deepfreezer'
    'thaw_____shallow_native'
    'thaw_____fast_copy_strict'
    'thaw_____deepcopy'
    'thaw_____letsfreezethat_v3_f0'

    'freeze___letsfreezethat_v3_f0'
    'freeze___letsfreezethat_v3_f1'
    'freeze___letsfreezethat_v3_f0'
    'freeze___deepfreeze'
    'freeze___deepfreezer'
    'freeze___shallow_native'
    ]
  # await BM.benchmark bench, cfg, false, @, '_prewarm'
  global.gc() if global.gc?
  for test_name in CND.shuffle test_names
    whisper '-'.repeat 108
    for _ in [ 1 .. cfg.repetitions ]
      await BM.benchmark bench, cfg, false, @, test_name
      global.gc() if global.gc?
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()



###

00:15 HENGIST/BENCHMARKS  ▶  thaw_____shallow_native                          829,171 Hz   100.0 % │████████████▌│
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v3_f0                    745,781 Hz    89.9 % │███████████▎ │
00:15 HENGIST/BENCHMARKS  ▶  freeze___shallow_native                          665,340 Hz    80.2 % │██████████   │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____klona                                   347,483 Hz    41.9 % │█████▎       │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v3_f0                    330,089 Hz    39.8 % │█████        │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v3_f1                    242,111 Hz    29.2 % │███▋         │
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v3_f1                    201,651 Hz    24.3 % │███          │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____fast_copy                               176,418 Hz    21.3 % │██▋          │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____letsfreezethat_v2                        93,441 Hz    11.3 % │█▍           │
00:15 HENGIST/BENCHMARKS  ▶  freeze___letsfreezethat_v2                        70,091 Hz     8.5 % │█            │
00:15 HENGIST/BENCHMARKS  ▶  freeze___deepfreeze                               59,320 Hz     7.2 % │▉            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____deepfreezer                              50,249 Hz     6.1 % │▊            │
00:15 HENGIST/BENCHMARKS  ▶  freeze___deepfreezer                              37,352 Hz     4.5 % │▋            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____deepcopy                                 31,608 Hz     3.8 % │▌            │
00:15 HENGIST/BENCHMARKS  ▶  thaw_____fast_copy_strict                         17,539 Hz     2.1 % │▎            │

###

