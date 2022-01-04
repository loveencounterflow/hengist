
###

This code is now in svgttf/src/svgttf-next.coffee

###




'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DEMO-SVG-WITH-PAPER-JS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
PAPER                     = require 'paper-jsdom'
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype()
{ validate
  type_of
  isa                   } = types.export()
SVGO                      = require 'svgo'
svg_pathify               = require 'svg_pathify'

# # stops   = [ ( new PAPER.Color 1, 1, 0, 0 ), 'red', 'black', ]
# radius  = PAPER.view.bounds.width * 0.4
# from_pt = new PAPER.Point PAPER.view.center.x, 300
# to_pt   = from_pt.add radius, 0

# circle = new PAPER.Path.Circle
#   center:       from_pt
#   radius:       radius * 0.7
#   fillColor:    'red'
#   strokeColor:  'black'

# rectangle = new PAPER.Path.Rectangle
#   from:         PAPER.view.bounds.leftCenter
#   to:           PAPER.view.bounds.bottomRight
#   fillColor:    'red',
#   strokeColor:  'black'

# debug ( ( circle.exportSVG    { asString: false, } ) ).getAttribute 'd'
# debug ( ( rectangle.exportSVG { asString: false, } ) ).getAttribute 'd'

# p1_pth    = PAPER.PathItem.create 'M66,300c0,-46.39192 37.60808,-84 84,-84c46.39192,0 84,37.60808 84,84c0,46.39192 -37.60808,84 -84,84c-46.39192,0 -84,-37.60808 -84,-84z'
# rectangle = PAPER.PathItem.create 'M0,600v-300h300v300z'
# p2_pth.rotate(45).scale(0.7)
# console.log(svg)
# fs.writeFileSync( '/tmp/paper1.svg', svg )
# svg = PAPER.project.exportSVG { asString: true, precision: 0, }
# info svg
# FS.writeFileSync '/tmp/paper2.svg', svg

# svg_dom = PAPER.project.exportSVG { asString: false, precision: 0, }
# # debug '^445645^', ( k for k of svg_dom )
# help '^5345348^', ( svg_dom.getElementsByTagName 'path' )[ 0 ].getAttribute 'd'

#-----------------------------------------------------------------------------------------------------------
demo_import_export = ->
  R       = {}
  path    = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg'
  project = new PAPER.Project()
  ### NOTE importing SVG appears to apply / remove transforms so we can deal with path data as-is ###
  svg_txt = FS.readFileSync path, { encoding: 'utf-8', }
  length_before = svg_txt.length
  svg_txt = prepare_svg_txt path, svg_txt
  length_after = svg_txt.length
  debug '^432-1^', { length_before, length_after, }
  project.importSVG svg_txt
  svg_dom = project.exportSVG()
  seen    = new Set()
  for x_dom in svg_dom.querySelectorAll '*'
    debug '^432-2^', get_dom_node_description x_dom
  #.........................................................................................................
  for g_dom in svg_dom.querySelectorAll 'g'
    g_id  = g_dom.getAttribute 'id'
    continue unless g_id?
    continue unless g_id.startsWith 'sym-'
    sym_name      = g_id.replace /^sym-/, ''
    entry         = { sym_name, }
    R[ sym_name ] = entry
    pds           = []
    debug '^432-3^', { g_id, }
    info '^432-4^', "group", rpr g_id
    for path_dom in g_dom.querySelectorAll 'path'
      continue if seen.has path_dom
      seen.add path_dom
      path_id = path_dom.getAttribute 'id'
      debug '^432-5^', { path_id, }
      if path_id.endsWith '-glyfmetric'
        pd          = path_dom.getAttribute 'd'
        bbox        = boundingbox_from_pathdata pd
        entry.shift = { x: bbox.x1, }
      else
        pds.push path_dom.getAttribute 'd'
    urge '^432-7^', pds
    if pds.length is 0
      warn "found no paths for group #{rpr path_id}"
      continue
    entry.pd = unite_path_data pds
    entry.pd = shift_pathdata entry.pd, entry.shift if ( entry.shift?.x ? 0 ) != 0
  #.........................................................................................................
  for path_dom in svg_dom.querySelectorAll 'path'
    continue if seen.has path_dom
    path_id   = path_dom.getAttribute 'id'
    continue unless path_id?
    continue unless path_id.startsWith 'sym-'
    sym_name  = path_id.replace /^sym-/, ''
    pd        = path_dom.getAttribute 'd'
    R.push { sym_name, pd, }
  #.........................................................................................................
  echo()
  echo entry.pd for sym_name, entry of R
  echo()
  for sym_name, { pd, } of R
    echo "<path fill='red' stroke='black' id='#{sym_name}' d='#{pd}'/>"
  echo()
  return null

#-----------------------------------------------------------------------------------------------------------
prepare_svg_txt = ( path, svg_txt ) ->
  cfg =
    path:       path
    pretty:     true
    multipass:  true
    plugins: [
      # 'preset-default'
      'cleanupAttrs'                    # cleanup attributes from newlines, trailing, and repeating spaces  enabled
      'mergeStyles'                     # merge multiple style elements into one  enabled
      'inlineStyles'                    # move and merge styles from <style> elements to element style attributes enabled
      'removeDoctype'                   # remove doctype declaration  enabled
      'removeXMLProcInst'               # remove XML processing instructions  enabled
      'removeComments'                  # remove comments enabled
      'removeMetadata'                  # remove <metadata> enabled
      'removeTitle'                     # remove <title>  enabled
      'removeDesc'                      # remove <desc> enabled
      'removeUselessDefs'               # remove elements of <defs> without id  enabled
      # 'removeXMLNS'                     # removes the xmlns attribute (for inline SVG)  disabled
      'removeEditorsNSData'             # remove editors namespaces, elements, and attributes enabled
      'removeEmptyAttrs'                # remove empty attributes enabled
      'removeHiddenElems'               # remove hidden elements  enabled
      'removeEmptyText'                 # remove empty Text elements  enabled
      'removeEmptyContainers'           # remove empty Container elements enabled
      'removeViewBox'                   # remove viewBox attribute when possible  enabled
      'cleanupEnableBackground'         # remove or cleanup enable-background attribute when possible enabled
      'minifyStyles'                    # minify <style> elements content with CSSO enabled
      # 'convertStyleToAttrs'             # convert styles into attributes  disabled
      'convertColors'                   # convert colors (from rgb() to #rrggbb, from #rrggbb to #rgb)  enabled
      'convertPathData'                 # convert Path data to relative or absolute (whichever is shorter), convert one segment to another, trim useless delimiters, smart rounding, and much more  enabled
      'convertTransform'                # collapse multiple transforms into one, convert matrices to the short aliases, and much more enabled
      'removeUnknownsAndDefaults'       # remove unknown elements content and attributes, remove attributes with default values enabled
      'removeNonInheritableGroupAttrs'  # remove non-inheritable group's "presentation" attributes  enabled
      'removeUselessStrokeAndFill'      # remove useless stroke and fill attributes enabled
      'removeUnusedNS'                  # remove unused namespaces declaration  enabled
      # 'prefixIds'                       # prefix IDs and classes with the SVG filename or an arbitrary string disabled
      # 'cleanupIDs'                      # remove unused and minify used IDs enabled
      'cleanupNumericValues'            # round numeric values to the fixed precision, remove default px units  enabled
      # 'cleanupListOfValues'             # round numeric values in attributes that take a list of numbers (like viewBox or enable-background)  disabled
      'moveElemsAttrsToGroup'           # move elements' attributes to their enclosing group  enabled
      'moveGroupAttrsToElems'           # move some group attributes to the contained elements  enabled
      'collapseGroups'                  # collapse useless groups enabled
      # 'removeRasterImages'              # remove raster images  disabled
      'mergePaths'                      # merge multiple Paths into one enabled
      'convertShapeToPath'              # convert some basic shapes to <path> enabled
      'convertEllipseToCircle'          # convert non-eccentric <ellipse> to <circle> enabled
      # 'sortAttrs'                       # sort element attributes for epic readability  disabled
      'sortDefsChildren'                # sort children of <defs> in order to improve compression enabled
      # 'removeDimensions'                # remove width/height and add viewBox if it's missing (opposite to removeViewBox, disable it first) disabled
      # 'removeAttrs'                     # remove attributes by pattern  disabled
      # 'removeAttributesBySelector'      # removes attributes of elements that match a CSS selector  disabled
      # 'removeElementsByAttr'            # remove arbitrary elements by ID or className  disabled
      # 'addClassesToSVGElement'          # add classnames to an outer <svg> element  disabled
      # 'addAttributesToSVGElement'       # adds attributes to an outer <svg> element disabled
      # 'removeOffCanvasPaths'            # removes elements that are drawn outside of the viewbox  disabled
      # 'removeStyleElement'              # remove <style> elements disabled
      # 'removeScriptElement'             # remove <script> elements  disabled
      # 'reusePaths'                      # Find duplicated elements and replace them with links disabled
    ]
  return svg_pathify ( SVGO.optimize svg_txt, cfg ).data

#-----------------------------------------------------------------------------------------------------------
get_dom_node_description = ( x_dom ) ->
  R         = { $tag: x_dom.tagName, }
  R[ name ] = value for { name, value, } in x_dom.attributes
  return R

#-----------------------------------------------------------------------------------------------------------
boundingbox_from_pathdata = ( pd ) ->
  PAPER.setup new PAPER.Size 1000, 1000
  validate.nonempty_text pd
  path_pth    = PAPER.PathItem.create pd
  { x
    y
    width
    height  } =   path_pth.bounds
  debug '^432-11^', { x, y, width, height, }
  return { x1: x, y1: y, x2: x + width, y2: y + height, width, height, }

#-----------------------------------------------------------------------------------------------------------
shift_pathdata = ( pd, shift ) ->
  PAPER.setup new PAPER.Size 1000, 1000
  validate.nonempty_text pd
  path_pth    = PAPER.PathItem.create pd
  path_pth.translate new PAPER.Point -shift.x, 0
  return ( path_pth.exportSVG { asString: false, precision: 0, } ).getAttribute 'd'

#-----------------------------------------------------------------------------------------------------------
unite_path_data = ( pds ) ->
  PAPER.setup new PAPER.Size 1000, 1000
  validate.list pds
  throw new Error "^45648^ expected path data, got none" if pds.length is 0
  return pds[ 0 ] if pds.length is 1
  p0_pth  = PAPER.PathItem.create pds[ 0 ]
  for idx in [ 1 ... pds.length ]
    p0_pth  = p0_pth.unite PAPER.PathItem.create pds[ idx ]
  return ( p0_pth.exportSVG { asString: false, precision: 0, } ).getAttribute 'd'

#-----------------------------------------------------------------------------------------------------------
demo_union = ->
  PAPER.setup new PAPER.Size 300, 600
  p1_pth  = PAPER.PathItem.create 'M 40.49 201.605 L 60.313 201.605 L 60.313 403.212 L 40.49 403.212 L 40.49 201.605 Z'
  p2_pth  = PAPER.PathItem.create 'M 0 371.912 L 100.803 371.912 L 100.803 403.212 L 0 403.212 L 0 371.912 Z'
  union_pth = p2_pth.unite p1_pth
  p2_pth.remove()
  p1_pth.remove()
  # debug '^35345^', ( k for k of p1_pth )
  debug '^35345^', p1_pth.exportSVG { asString: true, }
  urge '^35345^', ( union_pth.exportSVG { asString: false, precision: 0, } ).getAttribute 'd'
  return null


############################################################################################################
if module is require.main then do =>
  # demo_union()
  demo_import_export()

