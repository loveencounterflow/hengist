
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  type_of }               = types
#...........................................................................................................
DATA                      = require '../../../lib/data-providers-nocache'
BM                        = require '../../../lib/benchmarks'
data_cache                = null



#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  #.........................................................................................................
  integers = DATA.get_integers cfg.item_count, -1e6, +1e6
  #.........................................................................................................
  data_cache  = {
    integers }
  data_cache  = GUY.lft.freeze data_cache
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@compute = ( a, b ) -> ( a + b ) * b / a

#-----------------------------------------------------------------------------------------------------------
@plain_sync = ( cfg ) -> new Promise ( resolve ) =>
  { integers }  = @get_data cfg
  get_value     = ( P... ) => @compute P...
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    sum   = 0
    for integer in integers
      c     = get_value 12345, integer
      sum  += c
      count++
    info '^543^', { sum, } if cfg.show
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@plain_await = ( cfg ) -> new Promise ( resolve ) =>
  { integers }  = @get_data cfg
  get_value     = ( P... ) => await @compute P...
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 0
    sum   = 0
    for integer in integers
      c     = get_value 12345, integer
      sum  += c
      count++
    info '^543^', { sum, } if cfg.show
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench         = BM.new_benchmarks()
  cfg           =
    item_count:     1e1
  cfg.show      = cfg.item_count < 100
  repetitions   = 5
  test_names    = [
    'plain_sync'
    'plain_await'
    ]
  data_cache = null
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in ( require 'cnd' ).shuffle test_names
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()
