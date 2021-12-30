

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

# dom = PAPER.project.exportSVG { asString: false, precision: 0, }
# # debug '^445645^', ( k for k of dom )
# help '^5345348^', ( dom.getElementsByTagName 'path' )[ 0 ].getAttribute 'd'

#-----------------------------------------------------------------------------------------------------------
demo_import_export = ->
  path    = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg'
  project = new PAPER.Project()
  project.importSVG FS.readFileSync path, { encoding: 'utf-8', }
  dom     = project.exportSVG()
  seen    = new Set()
  #.........................................................................................................
  for g_dom in dom.querySelectorAll 'g'
    id    = g_dom.getAttribute 'id'
    continue unless id? and id.startsWith 'sym-'
    name  = g_dom.tagName
    info '^432^', "group", rpr id
    pds   = []
    for path_dom in g_dom.querySelectorAll 'path'
      continue if seen.has path_dom
      seen.add path_dom
      pds.push path_dom.getAttribute 'd'
    urge '^432^', pds
    urge '^432^', unite_path_data pds
  #.........................................................................................................
  for path_dom in dom.querySelectorAll 'path'
    continue if seen.has path_dom
    id    = path_dom.getAttribute 'id'
    continue unless id? and id.startsWith 'sym-'
    name  = path_dom.tagName
    info '^432^', "single path", rpr id
    urge '^432^', pd = path_dom.getAttribute 'd'
  #.........................................................................................................
  return null

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

