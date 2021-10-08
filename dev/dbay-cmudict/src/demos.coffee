
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-CMUDICT/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
types                     = new ( require 'intertype' ).Intertype
{ equals
  isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { DBay }          = require '../../../apps/dbay'
  { Cmud }          = require '../../../apps/dbay-cmudict'
  db                = new DBay()
  cmud              = new Cmud { db, create: true, }
  info cmud
  return null

#-----------------------------------------------------------------------------------------------------------
demo_count_transcriptions = ->
  { DBay }          = require '../../../apps/dbay'
  { Cmud }          = require '../../../apps/dbay-cmudict'
  db                = new DBay()
  db.create_stdlib()
  cmud              = new Cmud { db, create: true, }
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dtab            = new Tbl       { dba: db, }
  #-------------------------------------------------------------------------------------------------------
  db ->
    # echo dtab._tabulate db SQL"""select * from abs1_phones where word glob 'n*' limit 1000;"""
    # echo dtab._tabulate db SQL"""select * from abs1_phones where rnr = 1 order by abs1_phone limit 100;"""
    # echo dtab._tabulate db SQL"""select cmud_ipa_from_abs1( 'ax1' ) as ipa;"""
    # echo dtab._tabulate db SQL"""
    #   select distinct
    #       abs1_phone                                as abs1_phone,
    #       cmud_ipa_from_abs1( abs1_phone )           as ipa,
    #       count(*) over ( partition by abs1_phone ) as count
    #     from abs1_phones
    #     -- where rnr = 1
    #     order by count
    #     -- limit 100
    #     ;
    #     """
    # echo dtab._tabulate db SQL"""
    #   select
    #       word    as word,
    #       r2.part as abs1_phone
    #     from
    #       entries                           as r1,
    #       std_str_split_re( r1.abs1, '\s' ) as r2
    #     where word glob 'n*'
    #     order by word
    #     limit 100;"""
    return null
  return null



############################################################################################################
if require.main is module then do =>
  # await demo_f()
  demo_1()
  # demo_count_transcriptions()
