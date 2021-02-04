

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'TEXTSHAPING'
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

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  DATOM = require '../../../apps/datom'
  #.........................................................................................................
  DATA.get_cjk_chr
  debug DATA.get_words cfg.words_per_line
  #.........................................................................................................
  data_cache  = {}
  data_cache  = DATOM.freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_datom_thaw_freeze = ( cfg, datom_cfg ) -> new Promise ( resolve ) =>
  switch datom_cfg.version
    when '7' then  DATOM = ( require '../datom@7.0.3' ).new datom_cfg
    when '8' then  DATOM = ( require '../../../apps/datom' ).new datom_cfg
    else throw new Error "^464^ unknown version in datom_cfg: #{rpr datom_cfg}"
  { thaw
    freeze }    = DATOM.export()
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for probe, probe_idx in data.datoms
      facet_keys    = data.lists_of_facet_keys[   probe_idx ]
      facet_values  = data.lists_of_facet_values[ probe_idx ]
      probe         = thaw probe
      whisper '^331^', probe, Object.isFrozen probe
      for key, key_idx in facet_keys
        probe[ key ]  = facet_values[ key_idx ]
      probe         = freeze probe
      # whisper '^331^', probe
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_v7_thaw_freeze_f1 = ( cfg ) -> @_datom_thaw_freeze cfg, { version: '7', freeze: true,  }
@datom_v7_thaw_freeze_f0 = ( cfg ) -> @_datom_thaw_freeze cfg, { version: '7', freeze: false, }
@datom_v8_thaw_freeze_f1 = ( cfg ) -> @_datom_thaw_freeze cfg, { version: '8', freeze: true,  }
@datom_v8_thaw_freeze_f0 = ( cfg ) -> @_datom_thaw_freeze cfg, { version: '8', freeze: false, }


#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  # cfg         = { set_count: 100, datom_length: 5, change_facet_count: 3, }
  # cfg         = { set_count: 20, datom_length: 5, change_facet_count: 3, }
  cfg         = { set_count: 3, datom_length: 5, change_facet_count: 3, }
  repetitions = 10
  test_names  = [
    'datom_v8_thaw_freeze_f1'
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
  # await @run_benchmarks()
  cfg         = { words_per_line: 3, }
  debug @get_data cfg



