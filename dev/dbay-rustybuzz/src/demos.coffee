
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


# #-----------------------------------------------------------------------------------------------------------
# @demo_text_shaping = ->
#   me                  = @new_demo()
#   fontnick            = 'garamond_italic'
#   font_idx            = @register_font me, fontnick
#   size                = 5
#   # format              = 'short'
#   format              = 'json'
#   # format              = 'rusty'
#   text                = "a certain minimum"
#   text                = text.replace /#/g, me.shy
#   cfg                 = { format, text, }
#   arrangement         = JSON.parse RBW.shape_text cfg
#   debug '^4455^', arrangement
#   debug '^4455^', RBW.shape_text { format: 'rusty', text, }
#   #.........................................................................................................
#   urge "glyf IDs and positions of font #{rpr fontnick} for text #{rpr text}:"
#   for d in arrangement
#     goid   = @_get_glyf_outline_id       fontnick, d.gid
#     sgoid  = @_get_sized_glyf_outline_id fontnick, d.gid, size
#     info '^223^', goid, sgoid
#   #.........................................................................................................
#   urge "unique glyf IDs in this text:"
#   gids                = new Set ( d.gid for d in arrangement )
#   debug '^3344^', gids
#   return null

# #-----------------------------------------------------------------------------------------------------------
# @demo_svg_typesetting = ->
#   me        = @new_demo()
#   format    = 'json' # 'short', 'rusty'
#   #.........................................................................................................
#   fontnick  = 'tibetan';          text =  "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ"
#   fontnick  = 'amiri';            text = ( [ "الخط الأمیری"... ].reverse() ).join ''
#   fontnick  = 'garamond_italic';  text = "a certain minimum"
#   fontnick  = 'garamond_italic';  text = "af#fix"
#   #.........................................................................................................
#   font_idx  = @register_font me, fontnick
#   text      = text.replace /#/g, me.shy
#   #.........................................................................................................
#   echo """<?xml version='1.0' encoding='UTF-8'?>
#     <svg xmlns='http://www.w3.org/2000/svg' width='6000' height='3000' viewBox='-100 -1500 10500 1500' version='2'>"""
#   cfg         = { format, text, }
#   arrangement = JSON.parse RBW.shape_text cfg
#   gids        = new Set ( d.gid for d in arrangement )
#   debug '^3344^', gids
#   #.........................................................................................................
#   echo """<style>
#     path {
#       stroke:                 transparent;
#       stroke-width:           0mm;
#       fill:                   black;; }
#     rect {
#       stroke:                 transparent;
#       stroke-width:           0;
#       fill:                   transparent; }
#       </style>"""
#   # echo """<style>
#   #   path {
#   #     stroke:                 black;
#   #     stroke-width:           8px;
#   #     fill:                   #880000bd;; }
#   #   rect {
#   #     stroke:                 black;
#   #     stroke-width:           3px;
#   #     fill:                   #ffeb3b42; }
#   #     </style>"""
#   #.........................................................................................................
#   echo "<defs>"
#   for gid from gids.values()
#     outline = JSON.parse RBW.glyph_to_svg_pathdata font_idx, gid
#     debug '^3344^', gid, outline.pd[ .. 100 ]
#     # continue if outline.pd is ''
#     echo "<symbol overflow='visible' id='b#{gid}'>#{outline.br}</symbol>"
#     echo "<symbol overflow='visible' id='g#{gid}'><path d='#{outline.pd}'/></symbol>"
#   echo "</defs>"
#   #.........................................................................................................
#   for d in arrangement
#     echo "<use href='#g#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
#     echo "<use href='#b#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
#     # echo "<g x='#{d.x}' y='#{d.y + 1000}'>"
#     # echo "#{outline.br}"
#     # echo "</g>"
#   #.........................................................................................................
#   echo "</svg>"
#   return null


############################################################################################################
if require.main is module then do =>
  await @demo_load_font_outlines()

