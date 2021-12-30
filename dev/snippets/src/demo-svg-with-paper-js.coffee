

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
FS                        = require 'fs'

PAPER.setup new PAPER.Size 300, 600

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
p1_pth  = PAPER.PathItem.create 'M 40.49 201.605 L 60.313 201.605 L 60.313 403.212 L 40.49 403.212 L 40.49 201.605 Z'
p2_pth  = PAPER.PathItem.create 'M 0 371.912 L 100.803 371.912 L 100.803 403.212 L 0 403.212 L 0 371.912 Z'
# p2_pth.rotate(45).scale(0.7)
# console.log(svg)
# fs.writeFileSync( '/tmp/paper1.svg', svg )
union_pth = p2_pth.unite p1_pth
p2_pth.remove()
p1_pth.remove()
# debug '^35345^', ( k for k of p1_pth )
debug '^35345^', p1_pth.exportSVG { asString: true, }
urge '^35345^', ( union_pth.exportSVG { asString: false, precision: 0, } ).getAttribute 'd'

# svg = PAPER.project.exportSVG { asString: true, precision: 0, }
# info svg
# FS.writeFileSync '/tmp/paper2.svg', svg

# dom = PAPER.project.exportSVG { asString: false, precision: 0, }
# # debug '^445645^', ( k for k of dom )
# help '^5345348^', ( dom.getElementsByTagName 'path' )[ 0 ].getAttribute 'd'

