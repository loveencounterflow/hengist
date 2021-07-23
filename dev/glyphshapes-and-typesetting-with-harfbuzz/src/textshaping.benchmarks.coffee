

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
gcfg                      = { verbose: false, }

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
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@harfbuzz_shaping = ( cfg ) -> new Promise ( resolve ) =>
  HB            = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz'
  # HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
  data          = @get_data cfg
  count         = 0
  { texts
    font }      = data
  resolve => new Promise ( resolve ) =>
    for text in texts
      result  = await HB.shape_text { text, font, }
      show_result 'harfbuzz_shaping', result if gcfg.verbose
      count  += text.length ### NOTE counting approximate number of glyphs ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@harfbuzzjs_shaping = ( cfg ) -> new Promise ( resolve ) =>
  HB            = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-harfbuzzjs'
  # HB.ensure_harfbuzz_version() ### NOTE: optional diagnostic ###
  data          = @get_data cfg
  count         = 0
  { texts
    font }      = data
  fs            = HB.new_fontshaper font.path, font.features_obj
  resolve => new Promise ( resolve ) =>
    for text in texts
      result  = await HB.shape_text fs, text
      show_result 'harfbuzzjs_shaping', result if gcfg.verbose
      count  += text.length ### NOTE counting approximate number of glyphs ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@opentypejs_shaping = ( cfg ) -> new Promise ( resolve ) =>
  OT            = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-opentypejs'
  data          = @get_data cfg
  count         = 0
  { texts
    font }      = data
  otfont        = await OT.otfont_from_path font.path #, font.features_obj
  resolve => new Promise ( resolve ) =>
    for text in texts
      result  = OT.shape_text otfont, text
      show_result 'opentypejs_shaping', result if gcfg.verbose
      count  += text.length ### NOTE counting approximate number of glyphs ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@fontkit_shaping = ( cfg ) -> new Promise ( resolve ) =>
  FK            = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz/lib/demo-fontkit'
  data          = @get_data cfg
  count         = 0
  { texts
    font }      = data
  fkfont        = await FK.fkfont_from_path font.path #, font.features_obj
  resolve => new Promise ( resolve ) =>
    for text in texts
      result  = FK.shape_text fkfont, text
      show_result 'fontkit_shaping', result if gcfg.verbose
      count  += text.length ### NOTE counting approximate number of glyphs ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_rustybuzz_wasm_shaping = ( cfg, format ) -> new Promise ( resolve ) =>
  RBW             = require '../../../apps/rustybuzz-wasm/pkg'
  data            = @get_data cfg
  font_idx        = 15 ### 0 <= font_idx:cardinal <= 15 ###
  count           = 0
  { texts
    font }        = data
  #.........................................................................................................
  if RBW.font_register_is_free font_idx
    whisper "^44766^ sending #{font.path} to rustybuzz-wasm..."
    font_bytes      = FS.readFileSync font.path
    font_bytes_hex  = font_bytes.toString 'hex'
    RBW.register_font font_idx, font_bytes_hex
    whisper "^44766^ done"
  # format          = 'json'
  # format          = 'short'
  # format          = 'rusty'
  resolve => new Promise ( resolve ) =>
    for text in texts
      result  = RBW.shape_text { format, text, font_idx, }
      show_result 'rustybuzz_wasm_shaping', result if gcfg.verbose
      count  += text.length ### NOTE counting approximate number of glyphs ###
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@rustybuzz_wasm_json_shaping  = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'json'
@rustybuzz_wasm_short_shaping = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'short'
@rustybuzz_wasm_rusty_shaping = ( cfg ) -> @_rustybuzz_wasm_shaping cfg, 'rusty'

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  # gcfg.verbose  = true
  bench         = BM.new_benchmarks()
  n             = 100
  gcfg.verbose  = ( n is 1 )
  cfg           = { line_count: n, word_count: n, }
  repetitions   = 3
  test_names    = [
    'harfbuzz_shaping'
    # # 'harfbuzzjs_shaping'
    'opentypejs_shaping'
    'fontkit_shaping'
    'rustybuzz_wasm_json_shaping'
    'rustybuzz_wasm_short_shaping'
    'rustybuzz_wasm_rusty_shaping'
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



