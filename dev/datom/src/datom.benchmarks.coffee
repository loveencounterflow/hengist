

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
  # @types.validate.hengist_dataprv_cfg cfg
  #.........................................................................................................
  lists_of_values = []
  for _ in [ 1 .. cfg.set_count ]
    lists_of_values.push DATA.get_values cfg.datom_length
  #.........................................................................................................
  lists_of_keys = ( ( DATA.get_words cfg.datom_length ) for idx in [ 1 .. cfg.set_count ] )
  #.........................................................................................................
  lists_of_key_value_pairs = []
  for keys, set_idx in lists_of_keys
    values = lists_of_values[ set_idx ]
    lists_of_key_value_pairs.push ( [ key, values[ key_idx ] ] for key, key_idx in keys )
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
    lists_of_key_value_pairs }
  data_cache  = ( require '../../../apps/letsfreezethat' ).freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_lets = ( cfg, datom_cfg ) -> new Promise ( resolve ) =>
  if datom_cfg.freeze then  DATOM = ( require '../datom@7.0.3' ).new datom_cfg
  else                      DATOM = ( require '../datom@7.0.3' ).new datom_cfg
  { new_datom
    lets
    thaw
    freeze }    = DATOM.export()
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for key_value_pairs, datom_idx in data.lists_of_key_value_pairs
      facet_keys    = data.lists_of_facet_keys[   datom_idx ]
      facet_values  = data.lists_of_facet_values[ datom_idx ]
      probe         = new_datom '^' + key_value_pairs[ 0 ][ 0 ], Object.fromEntries key_value_pairs
      probe         = lets probe, ( probe ) ->
        for key, key_idx in facet_keys
          probe[ key ]  = facet_values[ key_idx ]
        return null
      # whisper '^331^', probe
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@datom_v7_lets_f1 = ( cfg ) -> @_letsfreezethat_v3_lets cfg, { freeze: true,  }
@datom_v7_lets_f0 = ( cfg ) -> @_letsfreezethat_v3_lets cfg, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_thaw_freeze = ( cfg, datom_cfg ) -> new Promise ( resolve ) =>
  if datom_cfg.freeze then  LFT = require '../../../apps/letsfreezethat/freeze'
  else                      LFT = require '../../../apps/letsfreezethat/nofreeze'
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for key_value_pairs, datom_idx in data.lists_of_key_value_pairs
      facet_keys    = data.lists_of_facet_keys[   datom_idx ]
      facet_values  = data.lists_of_facet_values[ datom_idx ]
      probe         = LFT.assign Object.fromEntries key_value_pairs
      # whisper '^331^', probe
      probe         = LFT.thaw probe
      for key, key_idx in facet_keys
        probe[ key ]  = facet_values[ key_idx ]
      probe         = LFT.freeze probe
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v3_thaw_freeze_f1 = ( cfg ) -> @_letsfreezethat_v3_thaw_freeze cfg, { freeze: true,  }
@letsfreezethat_v3_thaw_freeze_f0 = ( cfg ) -> @_letsfreezethat_v3_thaw_freeze cfg, { freeze: false, }


#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  # cfg         = { set_count: 100, datom_length: 5, change_facet_count: 3, }
  cfg         = { set_count: 20, datom_length: 5, change_facet_count: 3, }
  repetitions = 3
  test_names  = [
    'datom_v7_lets_f1'
    'datom_v7_lets_f0'
    # 'letsfreezethat_v3_thaw_freeze_f1'
    # 'letsfreezethat_v3_thaw_freeze_f0'
    ]
  global.gc() if global.gc?
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      data_cache = null
      global.gc() if global.gc?
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()
  # await @_letsfreezethat_v3_lets()
