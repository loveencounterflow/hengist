
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'INTERTYPE/tests/main'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
praise                    = CND.get_logger 'praise',    badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
INTERTYPE                 = require '../../../apps/intertype'
{ Intertype, }            = INTERTYPE
{ intersection_of }       = require '../../../apps/intertype/lib/helpers'


#-----------------------------------------------------------------------------------------------------------
@[ "INTERTYPE validation error message" ] = ( T, done ) ->
  intertype = new Intertype()
  { isa
    validate
    type_of
    types_of
    size_of
    declare
    all_keys_of } = intertype.export()
  #.........................................................................................................
  declare 'intershop_addon_location', tests:
    "x must be 'guest' or 'host'": ( x ) -> x in [ 'guest', 'host', ]
  validate.intershop_addon_location 'guest'
  try validate.intershop_addon_location 'guestX' catch error
    echo error.message
    echo rpr error.message
    # echo CND.escape_regex error.message
    T.ok /not a valid intershop_addon_location \(violates.*x must be.*guest.*or.*host.*'guestX'/.test error.message
  #.........................................................................................................
  done()
  return null


############################################################################################################
unless module.parent?
  # test @
  test @[ "INTERTYPE validation error message" ]
