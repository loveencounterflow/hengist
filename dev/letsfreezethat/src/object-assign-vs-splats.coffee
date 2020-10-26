

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
LFT                       = require '../../../apps/letsfreezethat'
IMMER                     = require 'immer'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( n ) ->
  return data_cache if data_cache?
  probes_A    = DATA.get_random_words n, null, true
  probes_B    = DATA.get_random_words n, null, true
  probes_A.push 'XXX' while probes_A.length < probes_B.length
  probes_B.push 'XXX' while probes_B.length < probes_A.length
  data_cache  = { probes_A, probes_B, }
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@using_object_assign_single = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  probe         = {}
  resolve => new Promise ( resolve ) =>
    for word_A, idx in probes_A
      probe     = Object.assign {}, probe, { [word_A]: probes_B[ idx ], }
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@using_splats_single = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  probe         = null
  resolve => new Promise ( resolve ) =>
    for word_A, idx in probes_A
      probe     = { probe..., { [word_A]: probes_B[ idx ], }..., }
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@using_object_assign_single_let = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  `let probe = {};`
  resolve => new Promise ( resolve ) =>
    for word_A, idx in probes_A
      `probe = Object.assign( {}, probe, { [word_A]: probes_B[ idx ], } );`
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@using_splats_single_let = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  `let probe = null;`
  resolve => new Promise ( resolve ) =>
    for word_A, idx in probes_A
      `probe = { ...probe, ...{ [word_A]: probes_B[ idx ], }, };`
      count++
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@using_object_assign_bulk = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  probe         = {}
  data          = {}
  data[ w ]     = probes_B[ idx ] for w, idx in probes_A
  resolve => new Promise ( resolve ) =>
    probe   = Object.assign {}, probe, data
    count  += probes_A.length
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@using_splats_bulk = ( n, show ) -> new Promise ( resolve ) =>
  count         = 0
  { probes_A
    probes_B }  = @get_data n
  probe         = {}
  data          = {}
  data[ w ]     = probes_B[ idx ] for w, idx in probes_A
  resolve => new Promise ( resolve ) =>
    probe   = { probe..., data..., }
    count  += probes_A.length
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench       = BM.new_benchmarks()
  n           = 1000
  # n           = 10
  show        = false
  repetitions = 3
  test_names  = [
    'using_splats_bulk'
    'using_object_assign_bulk'
    'using_splats_single'
    'using_object_assign_single'
    'using_splats_single_let'
    'using_object_assign_single_let'
    ]
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      await BM.benchmark bench, n, show, @, test_name
  BM.show_totals bench



############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()

###

# Verdict

* Using splats (as in `d = { d..., e..., }`) is sometimes up to 10% faster, sometimes up to 10% slower than
  doing the same using `Object.assign {}, d, e`, so we can always use either and discard the other, except
  that `Object.assign()` has the added functionality of mutating an object value which splats syntax can't
  do.

* Using a loop to assign new properties one by one is 500 to 3000 times slower than doing the same in one
  fell swoop, so it would seem advisable to always update as many properties in a single go as feasible.

* V8 does not appear to be able to leverage functional considerations and behaves as if side effects could
  always appear when doing object attribute assignments, even though the values used in tests are never used
  again except for in a small loop. In other words, although the workings and the value changes within the
  loops as well as the upated bindings are not observable (without a debugger) at all, V8 still performs all
  the chores. A sufficiently smart functional language could conceivably just set `count = probes_A.length`
  and be done in both the bulk assignment and single assignment setups.

* Since we're doing these benchmarks to optimize for immutable value handling we cannot use `const` (except
  when opting for using new names on each assignment as in `const d1 = 42; const d2 = d1 + 1` which would be
  horribly tedious). Using `let` declarations over the `var` declarations used by CoffeeScript does seem to
  afford a teeeny improvement in throughput which is hardly worth the effort of putting JS syntax islands
  into one's code (ie. other considerations might favor `let` usage, but performance is not one of them).

###
