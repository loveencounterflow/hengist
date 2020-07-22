

'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'INTERPLOT/TYPESET-SVG-SLUGS-WITH-OPENTYPEJS'
rpr                       = CND.rpr
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
defer                     = setImmediate
async                     = {}
sync                      = { concurrency: 1, }
# async                     = { async: true, }
#...........................................................................................................
HGST                      = require '../../../../hengist'
types                     = require HGST.resolve_project_path 'apps/interplot/lib/types'
{ isa
  validate
  cast
  type_of }               = types
INTERTEXT                 = require HGST.resolve_project_path 'apps/intertext'
# { HTML
#   RXWS }                  = require '../../../apps/paragate'
SP                        = require HGST.resolve_project_path 'apps/steampipes'
{ $
  $async
  $drain
  $show
  $watch  }               = SP.export()
DATOM                     = require HGST.resolve_project_path 'apps/datom'
{ select
  stamp
  freeze
  lets
  new_datom
  fresh_datom }           = DATOM.export()
# # DB                        = require '../intershop/intershop_modules/db'
# INTERSHOP                 = require '../intershop'
# PGP                       = ( require 'pg-promise' ) { capSQL: false, }


#-----------------------------------------------------------------------------------------------------------
@$hyphenate = ( S ) ->
  return $ ( text, send ) =>
    send INTERTEXT.HYPH.hyphenate text

#-----------------------------------------------------------------------------------------------------------
@$slabjoints_from_text = ( S ) ->
  return $ ( text, send ) =>
    send INTERTEXT.SLABS.slabjoints_from_text text

#-----------------------------------------------------------------------------------------------------------
@typeset = -> new Promise ( resolve, reject ) =>
  S         = {} ### NOTE will hold state such as configuration ###
  source    = [ "welcome to InterPlot Typesetting客观事物。文字", ]
  pipeline  = []
  pipeline.push source
  pipeline.push @$hyphenate S
  pipeline.push $watch ( text ) -> urge '^3321^', rpr INTERTEXT.HYPH.reveal_hyphens text, '*'
  pipeline.push @$slabjoints_from_text S
  pipeline.push $show()
  pipeline.push $drain -> resolve()
  SP.pull pipeline...
  return null


############################################################################################################
if module is require.main then do =>
  await @typeset()










