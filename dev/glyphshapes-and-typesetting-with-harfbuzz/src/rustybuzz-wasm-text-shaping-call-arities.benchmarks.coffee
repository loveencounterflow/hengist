

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES'
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
#...........................................................................................................
gcfg                      =
  batchsizes:
    singlebatch:  null
    smallbatch:   null
    mediumbatch:  null
    bigbatch:     null
  verbose:    false

#-----------------------------------------------------------------------------------------------------------
show_result = ( name, result ) ->
  info '-----------------------------------------------'
  urge name
  whisper result
  info '-----------------------------------------------'
  return null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "^3373^ fetching data..."
  DATOM = require '../../../apps/datom'
  #.........................................................................................................
  texts       = DATA.get_text_lines cfg
  font        =
    path:       'EBGaramond12-Italic.otf'
    ### TAINT use single type/format for features ###
    features:   'liga,clig,dlig,hlig'
    features_obj: { liga: true, clig: true, dlig: true, hlig: true, }
  font.path   = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts', font.path
  #.........................................................................................................
  data_cache  = { texts, font, }
  data_cache  = DATOM.freeze data_cache
  whisper "^3373^ ...done"
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_rustybuzz_wasm_shaping = ( cfg, format, batchsize_name ) -> new Promise ( resolve ) =>
  batchsize         = gcfg.batchsizes[ batchsize_name ]
  throw new Error "^34347^ unknown batchsize_name #{rpr batchsize_name}" unless batchsize?
  RBW               = require '../../../apps/rustybuzz-wasm/pkg'
  data              = @get_data cfg
  count             = 0
  { font }          = data
  batches           = []
  words             = ( data.texts.join ' ' ).split /\s+/
  batch             = null
  font_idx          = 3
  globalThis.alert ?= alert
  #.........................................................................................................
  for word in words
    ( batches.push batch = [] ) unless batch?
    batch.push word
    batch = null if batch.length >= batchsize
  batchsizes      = ( batch.length for batch in batches )
  avg_batchsize   = ( batchsizes.reduce ( a, b ) => a + b ) / batchsizes.length
  info "average batchsize is #{avg_batchsize}"
  batches         = ( [ batch.length, batch.join ' ' ] for batch in batches )
  #.........................................................................................................
  # debug '^440020^', ( k for k of RBW )
  if RBW.font_register_is_free font_idx
    whisper "^44766^ sending #{font.path} to rustybuzz-wasm..."
    font_bytes      = FS.readFileSync font.path
    font_bytes_hex  = font_bytes.toString 'hex'
    RBW.register_font font_idx, font_bytes_hex
    whisper "^44766^ done"
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    for [ word_count, text, ] in batches
      result  = RBW.shape_text { format, text, font_idx, }
      show_result 'rustybuzz_wasm_shaping', result if gcfg.verbose
      count += word_count ### NOTE counting texts ("slabs", although they're words in this case) ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@rustybuzz_wasm_json_shaping_bigbatch     = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'json', 'bigbatch'
@rustybuzz_wasm_json_shaping_mediumbatch  = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'json', 'mediumbatch'
@rustybuzz_wasm_json_shaping_smallbatch   = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'json', 'smallbatch'
@rustybuzz_wasm_json_shaping_singlebatch  = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'json', 'singlebatch'

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  # gcfg.verbose  = true
  bench         = BM.new_benchmarks()
  n             = 10
  # n             = 1
  gcfg.verbose  = ( n is 1 )
  gcfg.batchsizes.singlebatch = 1
  gcfg.batchsizes.smallbatch  = Math.floor n / 10
  gcfg.batchsizes.mediumbatch = Math.floor n / 2
  gcfg.batchsizes.bigbatch    = n
  cfg           = { line_count: n, word_count: n, }
  # debug '^889^', gcfg
  repetitions   = 2
  test_names    = [
    'rustybuzz_wasm_json_shaping_bigbatch'
    'rustybuzz_wasm_json_shaping_smallbatch'
    'rustybuzz_wasm_json_shaping_mediumbatch'
    'rustybuzz_wasm_json_shaping_singlebatch'
    # 'rustybuzz_wasm_short_shaping'
    # 'rustybuzz_wasm_rusty_shaping'
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


###

```
 ~/jzr/rustybuzz-wasm  master !5  ~/jzr/nodexh/bin/nodexh ~/jzr/hengist/dev/glyphshapes-and-typesetting-with-harfbuzz/lib/rustybuzz-wasm-text-shaping-call-arities.benchmarks.js
00:00 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ------------------------------------------------------------------------------------------------------------
00:00 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^3373^ fetching data...
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^3373^ ...done
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 10
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^44766^ sending /home/flow/jzr/hengist/assets/jizura-fonts/EBGaramond12-Italic.otf to rustybuzz-wasm...
00:04 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ^44766^ done
rustybuzz_wasm_json_shaping_smallbatch     0.753 s          10,000 items          13,285⏶Hz          75,271⏷nspc
00:05 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 1
rustybuzz_wasm_json_shaping_singlebatch    3.876 s          10,000 items           2,580⏶Hz         387,570⏷nspc
00:09 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 100
rustybuzz_wasm_json_shaping_bigbatch       0.381 s          10,000 items          26,263⏶Hz          38,076⏷nspc
00:09 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 50
rustybuzz_wasm_json_shaping_mediumbatch    0.397 s          10,000 items          25,193⏶Hz          39,693⏷nspc
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  ------------------------------------------------------------------------------------------------------------
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 50
rustybuzz_wasm_json_shaping_mediumbatch    0.398 s          10,000 items          25,103⏶Hz          39,835⏷nspc
00:10 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 10
rustybuzz_wasm_json_shaping_smallbatch     0.704 s          10,000 items          14,199⏶Hz          70,428⏷nspc
00:11 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 1
rustybuzz_wasm_json_shaping_singlebatch    3.774 s          10,000 items           2,650⏶Hz         377,372⏷nspc
00:15 RUSTYBUZZ-WASM-TEXT-SHAPING-CALL-ARITIES  ▶  average batchsize is 100
rustybuzz_wasm_json_shaping_bigbatch       0.378 s          10,000 items          26,441⏶Hz          37,820⏷nspc
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_bigbatch              26,352 Hz   100.0 % │████████████▌│
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_mediumbatch           25,148 Hz    95.4 % │███████████▉ │
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_smallbatch            13,742 Hz    52.1 % │██████▌      │
00:15 HENGIST/BENCHMARKS  ▶  rustybuzz_wasm_json_shaping_singlebatch            2,615 Hz     9.9 % │█▎           │
```

# Verdicts

* text shaping is 10 times as fast when quering hundreds of words at a time as opposed to a single word at a time

###
