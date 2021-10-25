
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/CODEPOINTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'


#-----------------------------------------------------------------------------------------------------------
@[ "DRB get_unicode_codepoints()" ] = ( T, done ) ->
  # ### explicit path, explicitly temporary ###
  # T?.halt_on_error()
  # { DBay }            = require H.dbay_path
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  # path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
  # DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  #.........................................................................................................
  do =>
    db          = new DBay()
    drb         = new Drb { db, temporary: true, }
    result      = drb.get_unicode_codepoints()
    ### as of NodeJS v16.9.1 with  Unicode 13 (?) ###
    T?.ok result.length >= 143_439
    return null
  #.........................................................................................................
  return done?()


############################################################################################################
if require.main is module then do =>
  test @



