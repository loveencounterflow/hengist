


'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SVGTTF-DEV/SVGPATHS'
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
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate }              = types.export()


  # probes_and_matchers = [
  #   ["M0 0L4000 0L4000 4000L0 4000Z", {"commands":[{"type":"M","x":0,"y":0},{"type":"L","x":4000,"y":0},{"type":"L","x":4000,"y":4000},{"type":"L","x":0,"y":4000},{"type":"Z"}],"fill":"black","stroke":null,"strokeWidth":1},null]
  #   ["M10.82813-25.87500Q11.39063-26.43750 12.16406-26.43750Q12.93750-26.43750 13.50000-25.87500Q14.06250-25.31250 14.06250-24.53906",{"commands":[{"type":"M","x":10.82813,"y":-25.875},{"type":"Q","x1":11.39063,"y1":-26.4375,"x":12.16406,"y":-26.4375},{"type":"Q","x1":12.9375,"y1":-26.4375,"x":13.5,"y":-25.875},{"type":"Q","x1":14.0625,"y1":-25.3125,"x":14.0625,"y":-24.53906}],"fill":"black","stroke":null,"strokeWidth":1},null]
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     result = plainify SVGTTF.otjspath_from_pathdata probe
  #     resolve result

#-----------------------------------------------------------------------------------------------------------
@[ "path union 1" ] = ( T, done ) ->
  { Svgttf2 } = require '../../../apps/svgttf/lib/svgttf-next'
  svgttf2     = new Svgttf2()
  path        = '../../../assets/svgttf/svgttf2-symbol-shapes.svg'
  path        = PATH.resolve PATH.join __dirname, path
  svg         = FS.readFileSync path, { encoding: 'utf-8', }
  result      = svgttf2.glyf_pathdata_from_svg { path, svg, }
  T?.eq result, {
    wbr: { sym_name: 'wbr', shift: { x: 1448.363, y: 916.214 }, pd: 'M0,-256l-147,166h293z' },
    shy: { sym_name: 'shy', shift: { x: 499.726, y: 1002.195 }, pd: 'M-204,-115h178v-802h50v802h178v70h-406z' } }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "path union 2" ] = ( T, done ) ->
  { Svgttf2 } = require '../../../apps/svgttf/lib/svgttf-next'
  svgttf2     = new Svgttf2()
  path        = '../../../assets/svgttf/bar-and-circle.svg'
  path        = PATH.resolve PATH.join __dirname, path
  svg         = FS.readFileSync path, { encoding: 'utf-8', }
  info '^667323^', svg
  result      = svgttf2.glyf_pathdata_from_svg { path, svg, }
  debug '^34234^', result
  T?.eq result, { zzz: { sym_name: 'zzz', \
    pd: 'M0,40l27,0c4,-9 13,-15 23,-15c10,0 19,6 23,15h27v20l-27,0c-4,9 -13,15 -23,15c-10,0 -19,-6 -23,-15h-27z' } }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "intersection between paths" ] = ( T, done ) ->
  { PAPER }     = require '../../../apps/svgttf/lib/svgttf-next'
  out_fspath_1  = '../../../data/svgttf/intersection-between-paths-before.svg'
  out_fspath_1  = PATH.resolve PATH.join __dirname, out_fspath_1
  out_fspath_2  = '../../../data/svgttf/intersection-between-paths-after.svg'
  out_fspath_2  = PATH.resolve PATH.join __dirname, out_fspath_2
  #.........................................................................................................
  project       = new PAPER.Project()
  rectangle     = new PAPER.Path.Rectangle { x: 25, y: 0, width: 50, height: 100, fillColor: '#f00', }
  baseguide     = new PAPER.Path.Line {id: 'p1c1b1', from: [ 0, 50, ], to: [ 100, 50, ], strokeColor: '#00f', strokeWidth: 3, }
  info '^454-1^', "baseguide.length:", baseguide.length
  FS.writeFileSync out_fspath_1, out_1_svg = project.exportSVG { asString: true, precision: 1, }
  intersection  = baseguide.getIntersections rectangle
  baseline      = new PAPER.Path.Line {
    from: intersection[ 0 ].point, to: intersection[ 1 ].point, strokeColor: '#0f0', strokeWidth: 3, }
  FS.writeFileSync out_fspath_2, out_2_svg = project.exportSVG { asString: true, precision: 1, }
  info '^454-7^', "baseline.length:", baseline.length
  info out_1_svg
  urge out_2_svg
  { point: { x: x1, y: y1, } } = intersection[ 0 ]
  { point: { x: x2, y: y2, } } = intersection[ 1 ]
  info '^343^', { x1, y1, x2, y2, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "baselines from intersection of column and baselinegrid" ] = ( T, done ) ->
  { Svgttf2 } = require '../../../apps/svgttf/lib/svgttf-next'
  svgttf2     = new Svgttf2()
  path        = '../../../assets/svgttf/circular-column-and-baselines.svg'
  path        = PATH.resolve PATH.join __dirname, path
  svg         = FS.readFileSync path, { encoding: 'utf-8', }
  out_path    = '../../../data/svgttf/circular-column-and-baselines.svg'
  out_path    = PATH.resolve PATH.join __dirname, out_path
  # info '^667323^', svg
  result      = svgttf2.glyf_pathdata_from_svg { path, svg, }
  debug '^34234^', result
  pd          = result[ 'ooo' ]?.pd
  out_svg     = """<svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
    <path stroke='green' stroke-width='1' d='#{pd}'/>
    </svg>"""
  FS.writeFileSync out_path, out_svg
  # T?.eq result, { zzz: { sym_name: 'zzz', \
  #   pd: 'M0,40l27,0c4,-9 13,-15 23,-15c10,0 19,6 23,15h27v20l-27,0c-4,9 -13,15 -23,15c-10,0 -19,-6 -23,-15h-27z' } }
  #.........................................................................................................
  done?()





############################################################################################################
unless module.parent?
  # test @
  # @[ "path union 2" ]()
  # @[ "baselines from intersection of column and baselinegrid" ]()
  @[ "intersection between paths" ]()
