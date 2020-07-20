

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/SVGTTF'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
#...........................................................................................................
@types                    = require './types'
{ isa
  validate
  type_of }               = @types
OT                        = require 'opentype.js'

#-----------------------------------------------------------------------------------------------------------
@_transform_fn_as_text = ( transform_fn ) ->
  validate.svgttf_svg_transform_fn transform_fn
  [ name, p..., ] = transform_fn
  if p.length is 1 then p = p[ 0 ]
  return "#{name}(#{p})" if ( isa.text p ) or ( isa.float p )
  return "#{name}(#{p.join ','})" if isa.list p

#-----------------------------------------------------------------------------------------------------------
@_transform_as_text = ( transform ) ->
  return null unless transform?
  validate.list transform
  return null if transform.length is 0
  return "transform='#{(@_transform_fn_as_text tf for tf in transform).join ' '}'"

#-----------------------------------------------------------------------------------------------------------
@pathelement_from_glyphidx = ( me, glyph_idx, size = null, transform ) ->
  pathdata = @pathdata_from_glyphidx me, glyph_idx, size
  return null if ( not pathdata? ) or ( pathdata is '' )
  @_pathelement_from_pathdata me, pathdata, transform

#-----------------------------------------------------------------------------------------------------------
@pathdata_from_glyphidx = ( me, glyph_idx, size = null ) ->
  validate.svgttf_font me
  validate.count glyph_idx
  validate.nonnegative size if size?
  return @_fast_pathdata_from_glyphidx me, glyph_idx, size

#-----------------------------------------------------------------------------------------------------------
@_fast_pathdata_from_glyphidx = ( me, glyph_idx, size = null ) ->
  path_precision  = 0
  x               = 0
  y               = 0
  glyph           = me.otjsfont.glyphs.glyphs[ glyph_idx ]
  size            = me.otjsfont.unitsPerEm
  path            = glyph.getPath x, y, size
  return path.toPathData path_precision

#-----------------------------------------------------------------------------------------------------------
@_pathelement_from_pathdata = ( me, pathdata, transform ) ->
  if ( tf_txt = @_transform_as_text transform )?
    return "<path #{tf_txt} d='#{pathdata}'/>"
  return "<path d='#{pathdata}'/>"

#-----------------------------------------------------------------------------------------------------------
@_get_svg = ( me, x1, y1, x2, y2, content ) ->
  validate.float x1
  validate.float y1
  validate.float x2
  validate.float y2
  R = []
  R.push "<?xml version='1.0' standalone='no'?>"
  R.push "<svg xmlns='http://www.w3.org/2000/svg' viewBox='#{x1} #{y1} #{x2} #{y2}'>"
  switch type = type_of content
    when 'text'   then R.push content
    when 'list'   then R = R.concat content
    else throw new Error "^svgttf/_get_svg_from_glyphidx@3337^ expected a text or a list, got a #{type}"
  R.push "</svg>"
  return R.join ''

#-----------------------------------------------------------------------------------------------------------
@svg_from_glyphidx = ( me, glyph_idx, size ) ->
  pathelement = @pathelement_from_glyphidx me, glyph_idx, size #, transform
  ### TAINT derive coordinates from metrics ###
  return @_get_svg me, 0, -800, 1000, 1000, pathelement

#-----------------------------------------------------------------------------------------------------------
@svg_from_harfbuzz_linotype = ( me, harfbuzz_linotype, size ) ->
  ### TAINT code duplication ###
  validate.svgttf_harfbuzz_linotype harfbuzz_linotype
  x = 0
  y = 0
  R = []
  for sort in harfbuzz_linotype
    transform   = [ [ 'translate', x, y, ], ]
    ### TAINT figure out relationship between size and upem ###
    x          += sort.x_advance * size
    if ( pathelement = @pathelement_from_glyphidx me, sort.gid, size, transform )?
      R.push '\n' + "<!--gid:#{sort.gid}-->" + pathelement
  R.push '\n'
  return @_get_svg me, 0, -800, x, 1000, R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@font_from_path = ( path ) ->
  validate.nonempty_text path
  otjsfont = OT.loadSync path
  return { path, otjsfont, }


############################################################################################################
if require.main is module then do =>
  # test @
  # await @_demo_opentypejs()
  # test @[ "VNR sort 2" ]
  # test @[ "VNR sort 3" ]
  # @[ "VNR sort 3" ]()
  # test @[ "test VNR._first_nonzero_is_negative()" ]




