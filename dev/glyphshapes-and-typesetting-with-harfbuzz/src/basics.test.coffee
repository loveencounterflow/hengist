

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DATOM/TESTS/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()


#-----------------------------------------------------------------------------------------------------------
@[ "HB.shape_text() fails on nonexisting font file" ] = ( T, done ) ->
  HB = require '../../../apps/glyphshapes-and-typesetting-with-harfbuzz'
  probes_and_matchers = [
    [ { text: 'x', font: { path: 'nosuchfile', }, }, null, "hb-shape: Couldn't read or find nosuchfile, or it was empty.", ]
    ]
  #.........................................................................................................
  debug '^3344^', ( k for k of HB )
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d = HB.shape_text probe
      resolve d
      return null
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "RBW.register_font(), RBW.font_register_is_free()" ] = ( T, done ) ->
  RBW             = require '../../../apps/rustybuzz-wasm/pkg'
  font            = {}
  # font.path       = 'Ubuntu-R.ttf'
  font.path       = 'EBGaramond12-Italic.otf'
  font.path       = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts', font.path
  font.idx        = 12
  #.........................................................................................................
  do register_font = =>
    font_bytes      = FS.readFileSync font.path
    font_bytes_hex  = font_bytes.toString 'hex'
    result          = RBW.register_font font.idx, font_bytes_hex
    matcher         = undefined
    T.eq result, matcher
  #.........................................................................................................
  do check_font_registers = =>
    ### TAINT result will depend on not using font indexes 10 and 13 in this test suite as RBW is stateful ###
    result          = ( ( RBW.font_register_is_free idx ) for idx in [ font.idx - 1 .. font.idx + 1 ] )
    matcher         = [ true, false, true, ]
    debug '^7483^', result
    T.eq result, matcher
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "RBW.shape_text()" ] = ( T, done ) ->
  T.halt_on_error()
  RBW             = require '../../../apps/rustybuzz-wasm/pkg'
  font            = {}
  # font.path       = 'Ubuntu-R.ttf'
  font.path       = 'EBGaramond12-Italic.otf'
  font.path       = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts', font.path
  font.idx        = 12
  text            = "Jack jumped over the lazy fox"
  #.........................................................................................................
  do register_font = =>
    font_bytes      = FS.readFileSync font.path
    font_bytes_hex  = font_bytes.toString 'hex'
    RBW.register_font font.idx, font_bytes_hex
  #.........................................................................................................
  do shape_text_json = =>
    format          = 'json'
    result          = RBW.shape_text { format, text, font_idx: font.idx, }
    debug '^4456^', format, result
    # T.eq result, matcher
  #.........................................................................................................
  done()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "RBW.register_font()" ] = ( T, done ) ->
#   RBW             = require '../../../apps/rustybuzz-wasm/pkg'
#   font            = {}
#   font.path       = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts/Ubuntu-R.ttf'
#   font.idx        = 12
#   font_bytes      = FS.readFileSync font.path
#   font_bytes_hex  = font_bytes.toString 'hex'
#   result          = RBW.register_font font.idx, font_bytes_hex
#   matcher         = undefined
#   T.eq result, matcher
#   done()
#   return null



#-----------------------------------------------------------------------------------------------------------
@[ "RBW use npm package" ] = ( T, done ) ->
  # RBW             = require '/tmp/rustybuzz-npm/node_modules/.pnpm/rustybuzz-wasm@0.1.2/node_modules/rustybuzz-wasm'
  SEMVER = require 'semver'
  #.........................................................................................................
  install_with_cli_and_require = ( package_name ) ->
    CP      = require 'child_process'
    command = "pnpm install #{package_name}"
    CP.execSync command, { stdio: 'inherit', }
    return require package_name
  #.........................................................................................................
  # await install_with_npm 'rustybuzz-wasm'
  RBW = install_with_cli_and_require 'rustybuzz-wasm'
  for k, v of RBW
    continue if k.startsWith '_'
    continue unless isa.function v
    info k
  #.........................................................................................................
  T.ok isa.function RBW.register_font
  T.ok isa.function RBW.font_register_is_free
  T.ok isa.function RBW.shape_text
  T.ok isa.function RBW.glyph_to_svg_pathdata
  T.ok isa.function RBW.wrap_text_with_arbitrary_slabs
  T.ok isa.function RBW.find_line_break_positions
  T.ok SEMVER.satisfies ( require 'rustybuzz-wasm/package.json' ).version, '>=0.1.2'
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "RBW.register_font(), RBW.font_register_is_free()" ]
  # test @[ "RBW.shape_text()" ]
  test @[ "RBW use npm package" ], { timeout: 50e3, }

