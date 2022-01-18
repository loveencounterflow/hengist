
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/BASICS'
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
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'



#-----------------------------------------------------------------------------------------------------------
@[ "Mirage HTML: quotes in attribute values" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  db        = new DBay()
  mrg       = new Mrg { db, }
  probes_and_matchers = []
  dsk       = 'quotedattributes'
  mrg.register_dsk { dsk, url: 'live:', }
  mrg.append_text { dsk, trk: 1, text: """<title id=maintitle x='"quoted"'></title>""", }
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     url    = mrg._url_from_path probe
  #     path   = mrg._path_from_url url
  #     # urge { probe, url, path, }
  #     resolve [ url, path, ]
  return done?()


############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "altering mirrored source lines causes error" ]
  # @[ "altering mirrored source lines causes error" ]()
