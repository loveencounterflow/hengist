
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/TESTS/CONSTRUCTION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
# PATH                      = require 'path'
# FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "exported names" ] = ( T, done ) ->
  VOGUE = require '../../../apps/dbay-vogue'
  T?.eq ( type_of VOGUE.Vogue_db          ), 'class'
  T?.eq ( type_of VOGUE.Vogue_scraper_ABC ), 'class'
  T?.eq ( type_of VOGUE.Vogue_server      ), 'class'
  T?.eq ( type_of VOGUE.Vogue             ), 'class'
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "construction 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { Vogue
    Vogue_db
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue = new Vogue()
  T?.eq ( type_of vogue.vdb ), 'vogue_db'
  T?.ok vogue.vdb.hub is vogue
  T?.throws /unable to set hub on a vogue/, -> vogue._set_hub {}
  debug '^35453^', vogue
  debug '^35453^', vogue.vdb
  debug '^35453^', vogue.vdb.hub
  debug '^35453^', vogue.scrapers
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "property `hub` only settable where licensed" ] = ( T, done ) ->
  { Vogue
    Vogue_db
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  return done?()
