

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
data_cache                = null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  DATOM = require '../../../apps/datom'
  # @types.validate.hengist_dataprv_cfg cfg
  #.........................................................................................................
  lists_of_values = []
  for _ in [ 1 .. cfg.set_count ]
    lists_of_values.push DATA.get_values cfg.datom_length
  #.........................................................................................................
  lists_of_keys = ( ( DATA.get_words cfg.datom_length ) for idx in [ 1 .. cfg.set_count ] )
  datom_keys    = ( "^#{word}" for word in DATA.get_words cfg.set_count )
  #.........................................................................................................
  objects = []
  for keys, set_idx in lists_of_keys
    values = lists_of_values[ set_idx ]
    objects.push Object.fromEntries ( [ key, values[ key_idx ] ] for key, key_idx in keys )
  #.........................................................................................................
  datoms = ( DATOM.new_datom key, objects[ idx ] for key, idx in datom_keys )
  #.........................................................................................................
  lists_of_facet_keys = []
  for keys in lists_of_keys
    lists_of_facet_keys.push \
      ( keys[ idx ] for idx in DATA.get_integers cfg.change_facet_count, 0, cfg.datom_length - 1 )
  #.........................................................................................................
  lists_of_facet_values = []
  for keys in lists_of_keys
    lists_of_facet_values.push DATA.get_values cfg.change_facet_count
  # #.........................................................................................................
  # debug '^337^', v for v in lists_of_values
  # urge '^776^', k for k in lists_of_keys
  # help '^776^', k, lists_of_keys[ idx ] for k, idx in lists_of_facet_keys
  # info '^776^', v for v in lists_of_facet_values
  #.........................................................................................................
  data_cache  = {
    lists_of_keys
    lists_of_values
    lists_of_facet_keys
    lists_of_facet_values
    datoms
    datom_keys
    objects }
  data_cache  = DATOM.freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_datom_lets = ( cfg, datom_cfg ) -> new Promise ( resolve ) =>
  switch datom_cfg.version
    when '7' then  DATOM = ( require '../datom@7.0.3' ).new datom_cfg
    when '8' then  DATOM = ( require '../../../apps/datom' ).new datom_cfg
    else throw new Error "^464^ unknown version in datom_cfg: #{rpr datom_cfg}"
  { lets }      = DATOM.export()
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for probe, probe_idx in data.datoms
      facet_keys    = data.lists_of_facet_keys[   probe_idx ]
      facet_values  = data.lists_of_facet_values[ probe_idx ]
      # whisper '^331^', probe
      probe         = lets probe, ( probe ) ->
        for key, key_idx in facet_keys
          probe[ key ]  = facet_values[ key_idx ]
        return null
      # whisper '^331^', probe
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_v7_lets_f1 = ( cfg ) -> @_datom_lets cfg, { version: '7', freeze: true,  }
@datom_v7_lets_f0 = ( cfg ) -> @_datom_lets cfg, { version: '7', freeze: false, }
@datom_v8_lets_f1 = ( cfg ) -> @_datom_lets cfg, { version: '8', freeze: true,  }
@datom_v8_lets_f0 = ( cfg ) -> @_datom_lets cfg, { version: '8', freeze: false, }

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
    'datom_v7_lets_f1'
    'datom_v7_lets_f0'
    'datom_v8_lets_f1'
    'datom_v8_lets_f0'
    'datom_v7_thaw_freeze_f1'
    # 'datom_v7_thaw_freeze_f0' ### broken, doesn't thaw ###
    'datom_v8_thaw_freeze_f0'
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
  await @run_benchmarks()
  # await @_datom_lets()


###

00:10 HENGIST/BENCHMARKS  ▶  datom_v8_thaw_freeze_f0                          144,938 Hz   100.0 % │████████████▌│
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_lets_f0                                 128,930 Hz    89.0 % │███████████▏ │
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_thaw_freeze_f1                          126,920 Hz    87.6 % │███████████  │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_lets_f0                                  92,669 Hz    63.9 % │████████     │
00:10 HENGIST/BENCHMARKS  ▶  datom_v8_lets_f1                                  81,917 Hz    56.5 % │███████▏     │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_lets_f1                                  40,063 Hz    27.6 % │███▌         │
00:10 HENGIST/BENCHMARKS  ▶  datom_v7_thaw_freeze_f1                           39,334 Hz    27.1 % │███▍         │

###
