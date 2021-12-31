


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
@[ "xxx" ] = ( T, done ) ->
  { Svgttf2 } = require '../../../apps/svgttf/lib/svgttf-next'
  svgttf2     = new Svgttf2()
  path        = '../../../assets/svgttf/svgttf2-symbol-shapes.svg'
  path        = PATH.resolve PATH.join __dirname, path
  svg         = FS.readFileSync path, { encoding: 'utf-8', }
  result      = svgttf2.glyf_pathdata_from_svg { path, svg, }
  T?.eq result, {
    wbr: { sym_name: 'wbr', shift: { x: 1448.363 }, pd: 'M0,660l-147,166h293z' },
    shy: { sym_name: 'shy', shift: { x: 499.726 }, pd: 'M-204,887h178v-802h50v802h178v70h-406z' } }
  #.........................................................................................................
  done()





############################################################################################################
unless module.parent?
  test @
  # test @[ "datoms are not frozen (nofreeze)" ]
  # test @[ "PD.set() sets properties, returns copy (nofreeze)" ]
  # test @[ "selector keypatterns" ]
  # test @[ "select 2" ]


