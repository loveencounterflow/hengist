
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
@[ "INTERTYPE loupe rpr bug" ] = ( T, done ) ->
  intertype = new Intertype()
  { isa
    validate
    type_of
    types_of
    size_of
    declare
    all_keys_of } = intertype.export()
  #.........................................................................................................
  probes_and_matchers = [
    [ ( -> ),                 true, null, ]
    [ undefined,              null, "not a valid function: undefined", ]
    [ null,                   null, "not a valid function: null", ]
    [ {},                     null, "not a valid function: {}", ]
    [ 1n,                     null, "not a valid function: 1", ] ### TAINT should really use `1n` for value representation ###
    [ { type: 'through', },   null, "not a valid function: { type: 'through' }", ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
  #.........................................................................................................
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = validate.function probe
      resolve result
      return null
  #.........................................................................................................
  done()
  return null


############################################################################################################
unless module.parent?
  test @
  # test @[ "INTERTYPE loupe rpr bug" ]
