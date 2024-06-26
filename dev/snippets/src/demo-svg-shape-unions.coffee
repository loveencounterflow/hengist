


### Note

this code now in hengist/dev/snippets/src/demo-svg-with-paper-js.coffee

###



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/TESTS/BASIC'
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
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'
SVGO                      = require 'svgo'


#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  fspath  = '/home/flow/temp/svg-path-optimization/unoptimized-two-shapes.svg'
  fspath  = '/home/flow/temp/svg-path-optimization/unoptimized-two-paths.svg'
  svg     = FS.readFileSync fspath, { encoding: 'utf-8', }
  cfg     =
    path:       fspath
    pretty:     true
    multipass:  true
  result  = SVGO.optimize svg, cfg
  urge '^778^', '\n' + result.data
  info '^778^', result.info
  #.........................................................................................................
  return null


############################################################################################################
if require.main is module then do =>
  demo_1()