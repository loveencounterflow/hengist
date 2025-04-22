

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
lft225                    = require 'letsfreezethat225'
lft310                    = require 'letsfreezethat310'

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
@letsfreezethat_v2 = ( cfg, sublibrary ) -> new Promise ( resolve ) =>
  LFT = require '../letsfreezethat@2.2.5'
  switch sublibrary
    when 'standard' then { lets, } = LFT
    when 'nofreeze' then { lets, } = LFT.nofreeze
    else throw new Error "^bm/lft@223 unknown sublibrary #{rpr sublibrary}"
  # @types.validate.hengist_dataprv_cfg cfg
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for key_value_pairs, datom_idx in data.lists_of_key_value_pairs
      facet_keys    = data.lists_of_facet_keys[   datom_idx ]
      facet_values  = data.lists_of_facet_values[ datom_idx ]
      probe         = LFT.lets Object.fromEntries key_value_pairs
      probe = LFT.lets probe, ( probe ) ->
        for key, key_idx in facet_keys
          probe[ key ]  = facet_values[ key_idx ]
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v2_standard = ( cfg ) -> @letsfreezethat_v2 cfg, 'standard'
@letsfreezethat_v2_nofreeze = ( cfg ) -> @letsfreezethat_v2 cfg, 'nofreeze'


#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_lets = ( cfg, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  LFT = require '../../../apps/letsfreezethat/freeze'
  else                    LFT = require '../../../apps/letsfreezethat/nofreeze'
  data          = @get_data cfg
  count         = 0
  resolve => new Promise ( resolve ) =>
    for key_value_pairs, datom_idx in data.lists_of_key_value_pairs
      facet_keys    = data.lists_of_facet_keys[   datom_idx ]
      facet_values  = data.lists_of_facet_values[ datom_idx ]
      probe         = LFT.assign Object.fromEntries key_value_pairs
      # whisper '^331^', probe
      probe         = LFT.lets probe, ( probe ) ->
        for key, key_idx in facet_keys
          probe[ key ]  = facet_values[ key_idx ]
        return null
      # whisper '^331^', probe
      count++ ### NOTE counting datoms, not facets ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v3_lets_f1 = ( cfg ) -> @_letsfreezethat_v3_lets cfg, { freeze: true,  }
@letsfreezethat_v3_lets_f0 = ( cfg ) -> @_letsfreezethat_v3_lets cfg, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_thaw_freeze = ( cfg, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  LFT = require '../../../apps/letsfreezethat/freeze'
  else                    LFT = require '../../../apps/letsfreezethat/nofreeze'
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
  # debug '^446^', Object.keys ( require '../letsfreezethat@2.2.5' )
  # debug '^446^', Object.keys lft225
  # debug '^446^', Object.keys lft310
  # process.exit 119
  bench       = BM.new_benchmarks()
  cfg         = { set_count: 100, datom_length: 5, change_facet_count: 3, }
  # cfg         = { set_count: 3, datom_length: 2, change_facet_count: 1, }
  repetitions = 3
  test_names  = [
    'letsfreezethat_v2_standard'
    'letsfreezethat_v2_nofreeze'
    'letsfreezethat_v3_lets_f1'
    'letsfreezethat_v3_lets_f0'
    'letsfreezethat_v3_thaw_freeze_f1'
    'letsfreezethat_v3_thaw_freeze_f0'
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

globalThis.structuredClone

