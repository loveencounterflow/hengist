
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'
RBW                       = require 'rustybuzz-wasm'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Xxx

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    # @state =
    # shy:          '\xad'
    @_prv_fontidx   = -1
    @_last_fontidx  = 15
    @fonts =
      garamond_italic:  { path: 'EBGaramond08-Italic.otf', }
      amiri:            { path: 'arabic/Amiri-0.113/Amiri-Bold.ttf', }
      tibetan:          { path: '/usr/share/fonts/truetype/tibetan-machine/TibetanMachineUni.ttf', }
      notoserif:        { path: 'NotoSerifJP/NotoSerifJP-Medium.otf', }
    ### TAINT disregarding font, size for the moment ###
    # @slab_widths = {}
    #.........................................................................................................
    for fontname, entry of @fonts
      @fonts[ fontname ].font_idx  = null
      @fonts[ fontname ].path      = @_resolve_font_path entry.path
    #.........................................................................................................
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _resolve_font_path: ( font_path ) ->
    return font_path if font_path.startsWith '/'
    jzrfonts_path = '../../../assets/jizura-fonts'
    return PATH.resolve PATH.join __dirname, jzrfonts_path, font_path

  #---------------------------------------------------------------------------------------------------------
  _get_font_bytes: ( font_path ) -> ( FS.readFileSync font_path ).toString 'hex'

  #---------------------------------------------------------------------------------------------------------
  register_font: ( fontnick ) ->
    #.........................................................................................................
    unless ( font_entry = @fonts[ fontnick ] )?
      throw new Error "^1w37^ unknown fontnick #{rpr fontnick}"
    #.........................................................................................................
    unless @_prv_fontidx < @_last_fontidx
      throw new Error "^1w37^ capacity of #{@_last_fontidx + 1} fonts exceeded"
    #.........................................................................................................
    return R if ( R = font_entry.font_idx )?
    #.........................................................................................................
    R           = @_prv_fontidx += 1
    whisper "^register_font@1^ reading font #{fontnick}..."
    font_bytes  = @_get_font_bytes font_entry.path
    whisper "^register_font@2^ ...done"
    whisper "^register_font@3^ sending font #{fontnick} to registry..."
    RBW.register_font R, font_bytes
    whisper "^register_font@4^ ...done"
    font_entry.font_idx = R
    return R


#-----------------------------------------------------------------------------------------------------------
@demo_load_font_outlines = ->
  xxx = new Xxx()
  debug '^290^', xxx
  debug '^290^', font_idx = xxx.register_font 'garamond_italic'
  gid = 74
  urge '^290^', outline = JSON.parse RBW.glyph_to_svg_pathdata font_idx, gid

  return null


############################################################################################################
if require.main is module then do =>
  await @demo_load_font_outlines()

