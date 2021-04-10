

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
DATA                      = require '../../../lib/data-providers'
test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( n ) ->
  return data_cache if data_cache?
  probes_A  = DATA.get_random_nested_objects n, null, true
  probes_B  = DATA.get_random_nested_objects n, null, true
  # debug '^3342^', probes_A
  # debug '^3342^', probes_B
  # debug '^3342^', probes_C
  ### NOTE could count number of actual properties in nested objects ###
  data_cache = { probes_A, probes_B, }
  return ( require '../../../apps/letsfreezethat' ).freeze data_cache

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_lets = ( n, show, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  lets = require '../../../apps/letsfreezethat/freeze'
  else                    lets = require '../../../apps/letsfreezethat/nofreeze'
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe = lets probe
      probe = lets probe, ( probe ) ->
        for k, v of probes_B[ idx ]
          probe[ k ] = v
        return null
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v3_f1_lets = ( n, show ) -> @_letsfreezethat_v3_lets n, show, { freeze: true,  }
@letsfreezethat_v3_f0_lets = ( n, show ) -> @_letsfreezethat_v3_lets n, show, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v3_freezethaw = ( n, show, lft_cfg ) -> new Promise ( resolve ) =>
  if lft_cfg.freeze then  lets = require '../../../apps/letsfreezethat/freeze'
  else                    lets = require '../../../apps/letsfreezethat/nofreeze'
  { thaw
    freeze }    = lets
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe = thaw probe
      for k, v of probes_B[ idx ]
        probe[ k ] = v
      probe = freeze probe
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v3_f1_freezethaw = ( n, show ) -> @_letsfreezethat_v3_freezethaw n, show, { freeze: true,  }
@letsfreezethat_v3_f0_freezethaw = ( n, show ) -> @_letsfreezethat_v3_freezethaw n, show, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v2_lets = ( n, show, lft_cfg ) -> new Promise ( resolve ) =>
  LFT = require '../letsfreezethat@2.2.5'
  if lft_cfg.freeze then  { lets } = LFT
  else                    { lets } = LFT.nofreeze
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe = lets probe
      probe = lets probe, ( probe ) ->
        for k, v of probes_B[ idx ]
          probe[ k ] = v
        return null
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v2_f1_lets = ( n, show ) -> @_letsfreezethat_v2_lets n, show, { freeze: true,  }
@letsfreezethat_v2_f0_lets = ( n, show ) -> @_letsfreezethat_v2_lets n, show, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@_letsfreezethat_v2_freezethaw = ( n, show, lft_cfg ) -> new Promise ( resolve ) =>
  LFT = require '../letsfreezethat@2.2.5'
  if lft_cfg.freeze then  { freeze, } = LFT
  else                    { freeze, } = LFT.nofreeze
  ### Bug (or feature?) of LFTv2: in nofreeze mode, `thaw()` does not copy object ###
  { thaw, }     = LFT
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe = thaw probe
      for k, v of probes_B[ idx ]
        probe[ k ] = v
      probe = freeze probe
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@letsfreezethat_v2_f1_freezethaw = ( n, show ) -> @_letsfreezethat_v2_freezethaw n, show, { freeze: true,  }
@letsfreezethat_v2_f0_freezethaw = ( n, show ) -> @_letsfreezethat_v2_freezethaw n, show, { freeze: false, }

#-----------------------------------------------------------------------------------------------------------
@immutable = ( n, show ) -> new Promise ( resolve ) =>
  { Map }       = require 'immutable'
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe   = Map probe
      for k, v of probes_B[ idx ]
        probe = probe.set k, v
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@hamt = ( n, show ) -> new Promise ( resolve ) =>
  hamt          = require 'hamt'
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe   = hamt.empty
      probe   = probe.set k, v for k, v of probe ### NOTE must always iterate over facets, no bulk `set()` ###
      for k, v of probes_B[ idx ]
        probe = probe.set k, v
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@mori = ( n, show ) -> new Promise ( resolve ) =>
  M = require 'mori'
  count             = 0
  { probes_A
    probes_B }      = @get_data n
  probes_A_entries  = []
  for probe in probes_A
    probes_A_entries.push ( [ k, v, ] for k, v of probe )
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A_entries
      probe   = M.hashMap probe...
      for k, v of probes_B[ idx ]
        probe = M.assoc probe, k, v
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@immer = ( n, show ) -> new Promise ( resolve ) =>
  IMMER         = require 'immer'
  { produce, }  = IMMER
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe   = produce probe, ( probe ) -> probe
      probe = produce probe, ( probe ) ->
        for k, v of probes_B[ idx ]
          probe[ k ] = v
        return probe
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@plainjs_mutable = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  resolve => new Promise ( resolve ) =>
    for probe, idx in probes_A
      probe = Object.assign {}, probe
      for k, v of probes_B[ idx ]
        probe[ k ] = v
      count++
    resolve count
  return null



#-----------------------------------------------------------------------------------------------------------
@demo_immutable = ->
  ```
  const { Map } = require('immutable');
  const map1 = Map({ a: 1, b: 2, c: 3 });
  const map2 = map1.set('b', 50);
  ```
  help map1.get('b') + " vs. " + map2.get('b'); # 2 vs. 50
  whisper Object.keys map1
  whisper [ map1.keys()..., ]
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_hamt = ->
  ```
  var hamt = require('hamt');

  // Keys can be any string and the map can store any value.
  var h = hamt.empty
      .set('key', 'value')
      .set('object', { prop: 1 })
      .set('falsy', null);

  h.size === 0
  h.has('key') === true
  h.has('falsy') === true
  h.get('key') === 'value'

  // Iteration
  for (let [key, value] of h)
      console.log(key, value);

  // Array.from(h.values()) === [{ prop: 1 }, 'value'], null];

  // The data structure is fully immutable
  var h2 = h.delete('key');
  h2.get('key') === undefined
  h.get('key') === 'value'
  ```
  urge '^33387^', h
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_mori = ->
  M = require 'mori'
  debug ( k for k of M ).sort()
  debug M.vector 'a', 42
  d = M.hashMap()
  # d = M.mutable.thaw d
  for n in [ 1 .. 100 ]
    d = M.assoc d, n, n ** 2
  # d = M.mutable.freeze d
  d = M.assoc d, 'helo', 'world'
  urge d
  help M.toClj  d
  urge M.toJs   d
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_letsfreezethat_new_api = ->
  lets    = require '../../../apps/letsfreezethat'
  d1      = lets { first: 1, }, { second: 2, }
  d2      = lets.set d1, 'foo', 42
  d3      = lets.assign d2, { foo: 108, bar: 'baz', }, { gnu: 'gnat', }
  urge Object.isFrozen d1
  urge Object.isFrozen d2
  urge Object.isFrozen d3
  help d1
  help d2
  help d3
  urge d1 is d2
  urge lets.get d1, 'foo'
  urge lets.get d2, 'foo'
  urge Object.keys d2
  urge ( k for k of d2 )
  urge Object.keys d3
  return null

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  # n           = 100000
  n           = 100
  n           = 10
  n           = 1000
  show        = false
  repetitions = 3
  test_names  = [
    'immer'
    'letsfreezethat_v3_f1_lets'
    'letsfreezethat_v3_f0_lets'
    'letsfreezethat_v2_f1_lets'
    'letsfreezethat_v2_f0_lets'
    'letsfreezethat_v3_f1_freezethaw'
    'letsfreezethat_v3_f0_freezethaw'
    'letsfreezethat_v2_f1_freezethaw'
    'letsfreezethat_v2_f0_freezethaw'
    'immutable'
    'hamt'
    'mori'
    'plainjs_mutable'
    ]
  global.gc() if global.gc?
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      data_cache = null
      global.gc() if global.gc?
      await BM.benchmark bench, n, show, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()

###

# To Do

* ramda (https://www.skypack.dev/search?q=ramda&p=1)
* rambda (Lightweight and faster alternative to Ramda)
* ramdax


###



###

00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f0_freezethaw                  116,513 Hz   100.0 % │████████████▌│
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f1_freezethaw                   97,101 Hz    83.3 % │██████████▍  │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f0_lets                         93,101 Hz    79.9 % │██████████   │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v3_f1_lets                         76,045 Hz    65.3 % │████████▏    │
00:11 HENGIST/BENCHMARKS  ▶  plainjs_mutable                                   28,035 Hz    24.1 % │███          │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f0_lets                         22,410 Hz    19.2 % │██▍          │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f0_freezethaw                   16,854 Hz    14.5 % │█▊           │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f1_freezethaw                   16,443 Hz    14.1 % │█▊           │
00:11 HENGIST/BENCHMARKS  ▶  letsfreezethat_v2_f1_lets                         13,648 Hz    11.7 % │█▌           │
00:11 HENGIST/BENCHMARKS  ▶  immutable                                          8,359 Hz     7.2 % │▉            │
00:11 HENGIST/BENCHMARKS  ▶  mori                                               7,845 Hz     6.7 % │▉            │
00:11 HENGIST/BENCHMARKS  ▶  hamt                                               7,449 Hz     6.4 % │▊            │
00:11 HENGIST/BENCHMARKS  ▶  immer                                              4,943 Hz     4.2 % │▌            │

###

