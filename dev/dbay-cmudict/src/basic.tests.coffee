
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-CMUDICT/TESTS/BASIC'
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
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
r                         = String.raw

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY-CMUDICT object creation" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require '../../../apps/dbay'
  { Cmud }          = require '../../../apps/dbay-cmudict'
  db                = new DBay { temporary: true, }
  cmud              = new Cmud { db, create: true, max_entry_count: 10000, }
  debug '^3344^', cmud.cfg
  { schema,   } = cmud.cfg
  { I, L, V,  } = db.sql
  #.........................................................................................................
  info db.all_rows SQL"""select * from sqlite_schema;"""
  info db.all_first_values SQL"""select name from #{I schema}.sqlite_schema;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY-CMUDICT ipa rewriting" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require '../../../apps/dbay'
  { Cmud }          = require '../../../apps/dbay-cmudict'
  db                = new DBay { temporary: true, }
  cmud              = new Cmud { db, create: false, }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'k ɝ0 ɪ1 r',          null, ]
    [ 'b ɪ1 r m ʌ0 n',      null, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    debug probe.match /ɝ0/g #   'ə0 r'
    info cmud.ipa_from_ipa_raw probe
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  @[ "DBAY-CMUDICT ipa rewriting" ]()







