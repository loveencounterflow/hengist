

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
provide_LFT_candidate = ->
  @copy_1 = ( d ) ->
    switch ( Object::toString.call d )
      when '[object Array]'
        return ( @copy_1 v for v in d )
      when '[object Object]'
        R = {}
        R[ k ] = @copy_1 v for k, v of d
        return R
    return d
  @copy_2 = ( d ) ->
    ### immediately return for zero, empty string, null, undefined, NaN, false, true: ###
    return d if ( not d ) or d is true
    ### thx to https://github.com/lukeed/klona/blob/master/src/json.js ###
    switch ( Object::toString.call d )
      when '[object Array]'
        R = Array ( k = d.length )
        while ( k-- )
          R[ k ] = if ( v = d[ k ] )? and ( ( typeof v ) is 'object' ) then ( @copy_2 v ) else v
        return R
      when '[object Object]'
        R = {}
        for k of d
          if k == '__proto__'
            ### TAINT do we ever need this? ###
            Object.defineProperty R, k, {
              value:        @copy_2 d[ k ]
              configurable: true
              enumerable:   true
              writable:     true }
          else
            R[ k ] = if ( v = d[ k ] )? and ( ( typeof v ) is 'object' ) then ( @copy_2 v ) else v
        return R
    return d
  @copy_3 = ( d ) ->
    ### immediately return for zero, empty string, null, undefined, NaN, false, true: ###
    return d if ( not d ) or d is true
    ### thx to https://github.com/lukeed/klona/blob/master/src/json.js ###
    if Array.isArray d
      R = Array ( k = d.length | 0 )
      while ( k-- ) | 0
        R[ k ] = if ( v = d[ k ] )? and ( ( typeof v ) is 'object' ) then ( @copy_2 v ) else v
      return R
    return d unless typeof d is 'object'
    R = {}
    for k of d
      R[ k ] = if ( v = d[ k ] )? and ( ( typeof v ) is 'object' ) then ( @copy_2 v ) else v
    return R

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
@freeze___letsfreezethat = ( cfg ) -> new Promise ( resolve ) =>
  LFT           = require '../../../apps/letsfreezethat'
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
@thaw_____letsfreezethat = ( cfg ) -> new Promise ( resolve ) =>
  LFT           = require '../../../apps/letsfreezethat'
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

#-----------------------------------------------------------------------------------------------------------
@copy_____lft_xxx_1 = ( cfg ) -> new Promise ( resolve ) =>
  provide_LFT_candidate.apply LFT = {}
  copy          = LFT.copy_1.bind LFT
  data          = @get_data cfg
  { freeze }    = require 'letsfreezethat'
  data.datoms   = ( ( freeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = copy d
      throw new Error '^445-7^ identical' if e is d
      throw new Error '^445-8^ not thawed' if Object.isFrozen e
      throw new Error '^445-9^ not thawed' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@copy_____lft_xxx_2 = ( cfg ) -> new Promise ( resolve ) =>
  provide_LFT_candidate.apply LFT = {}
  copy          = LFT.copy_2.bind LFT
  data          = @get_data cfg
  { freeze }    = require 'letsfreezethat'
  data.datoms   = ( ( freeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = copy d
      throw new Error '^445-7^ identical' if e is d
      throw new Error '^445-8^ not thawed' if Object.isFrozen e
      throw new Error '^445-9^ not thawed' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@copy_____lft_xxx_3 = ( cfg ) -> new Promise ( resolve ) =>
  provide_LFT_candidate.apply LFT = {}
  copy          = LFT.copy_3.bind LFT
  data          = @get_data cfg
  { freeze }    = require 'letsfreezethat'
  data.datoms   = ( ( freeze d ) for d in data.datoms )
  count         = 0
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = copy d
      throw new Error '^445-7^ identical' if e is d
      throw new Error '^445-8^ not thawed' if Object.isFrozen e
      throw new Error '^445-9^ not thawed' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


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
      throw new Error '^445-10^ not identical' unless e is d
      throw new Error '^445-11^ not frozen' unless Object.isFrozen e
      throw new Error '^445-12^ not frozen' unless Object.isFrozen e.$vnr
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
      throw new Error '^445-13^ not identical' unless e is d
      throw new Error '^445-14^ not frozen' unless Object.isFrozen e
      throw new Error '^445-15^ not frozen' unless Object.isFrozen e.$vnr
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
      throw new Error '^445-16^ identical' if e is d
      throw new Error '^445-17^ frozen' if Object.isFrozen e
      throw new Error '^445-18^ frozen' if Object.isFrozen e.$vnr
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
      throw new Error '^445-19^ not identical' unless e is d
      throw new Error '^445-20^ not frozen' unless Object.isFrozen e
      throw new Error '^445-21^ is frozen' if Object.isFrozen e.$vnr
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
      throw new Error '^445-22^ identical' if e is d
      throw new Error '^445-23^ frozen' if Object.isFrozen e
      throw new Error '^445-24^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@copy_____shallow_native = @thaw_____shallow_native


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@copy_____fast_copy = ( cfg ) -> new Promise ( resolve ) =>
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
      throw new Error '^445-25^ identical' if e is d
      throw new Error '^445-26^ frozen' if Object.isFrozen e
      throw new Error '^445-27^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@copy_____fast_copy_strict = ( cfg ) -> new Promise ( resolve ) =>
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
      throw new Error '^445-28^ identical' if e is d
      throw new Error '^445-29^ frozen' if Object.isFrozen e
      throw new Error '^445-30^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@copy_____klona = ( cfg ) -> new Promise ( resolve ) =>
  { klona }     = require 'klona/json'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = klona d
      throw new Error '^445-31^ identical' if e is d
      throw new Error '^445-32^ frozen' if Object.isFrozen e
      throw new Error '^445-33^ is frozen' if Object.isFrozen e.$vnr
      count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@copy_____deepcopy = ( cfg ) -> new Promise ( resolve ) =>
  deepcopy      = require 'deepcopy'
  data          = @get_data cfg
  count         = 0
  data.datoms   = ( ( Object.freeze d ) for d in data.datoms )
  global.gc() if global.gc? ### TAINT consider to do this in BM moduke ###
  resolve => new Promise ( resolve ) =>
    for d in data.datoms
      e = deepcopy d
      throw new Error '^445-34^ identical' if e is d
      throw new Error '^445-35^ frozen' if Object.isFrozen e
      throw new Error '^445-36^ is frozen' if Object.isFrozen e.$vnr
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
  cfg         = { repetitions: 3, set_count: 1000, }
  cfg         = { repetitions: 3, set_count: 1, }
  cfg         = { repetitions: 3, set_count: 10, }
  cfg         = { repetitions: 3, set_count: 10000, }
  test_names  = [
    'thaw_____letsfreezethat'
    'copy_____klona'
    'copy_____lft_xxx_1'
    'copy_____lft_xxx_2'
    'copy_____lft_xxx_3'
    'copy_____fast_copy'

    # 'copy_____shallow_native'
    # 'freeze___letsfreezethat'
    # 'freeze___deepfreeze'
    # 'freeze___deepfreezer'
    # 'thaw_____deepfreezer'
    # 'freeze___shallow_native'
    # 'thaw_____shallow_native'
    # 'copy_____fast_copy_strict'
    # 'copy_____deepcopy'
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



