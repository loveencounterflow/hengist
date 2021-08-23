
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA-VNR/TESTS'
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
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()
SQL                       = String.raw
vnr_path                  = '../../../apps/icql-dba-vnr'
dba_path                  = '../../../apps/icql-dba'
{ lets
  freeze }                = require 'letsfreezethat'
CATALOGUE                 = require 'multimix/lib/cataloguing'
jr                        = JSON.stringify
jp                        = JSON.parse


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@[ "API" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Vnr, }    = require vnr_path
  { Dba, }    = require dba_path
  prefix      = 'vnr_'
  dba         = new Dba()
  vnr         = new Vnr { dba, prefix, }
  T?.eq ( vnr.advance      [ 1, 2, 3, ]            ), [ 1, 2, 4 ]
  T?.eq ( vnr.recede       [ 1, 2, 3, ]            ), [ 1, 2, 2 ]
  T?.eq ( vnr.deepen       [ 1, 2, 3, ]            ), [ 1, 2, 3, 0 ]
  T?.eq ( vnr.cmp_fair     [ 1, 2, 3, ], [ 1, 2, ] ), 1
  T?.eq ( vnr.cmp_partial  [ 1, 2, 3, ], [ 1, 2, ] ), 1
  T?.eq ( vnr.cmp_total    [ 1, 2, 3, ], [ 1, 2, ] ), 1
  T?.eq ( vnr.new_vnr      [ 1, 2, 3, ]            ), [ 1, 2, 3 ]
  T?.eq ( vnr.new_vnr      null                    ), [ 0 ]
  T?.eq ( vnr.encode       [ 1, 2, 3, ]            ), Buffer.from '8000000180000002800000038000000080000000', 'hex'
  #.........................................................................................................
  T?.eq ( jp dba.first_value dba.query SQL"select vnr_advance(     '[ 1, 2, 3 ]' );" ),             [ 1, 2, 4 ]
  T?.eq ( jp dba.first_value dba.query SQL"select vnr_recede(      '[ 1, 2, 3 ]' );" ),             [ 1, 2, 2 ]
  T?.eq ( jp dba.first_value dba.query SQL"select vnr_deepen(      '[ 1, 2, 3 ]' );" ),             [ 1, 2, 3, 0 ]
  T?.eq (    dba.first_value dba.query SQL"select vnr_cmp_fair(    '[ 1, 2, 3 ]', '[ 1, 2 ]' );" ), 1
  T?.eq (    dba.first_value dba.query SQL"select vnr_cmp_partial( '[ 1, 2, 3 ]', '[ 1, 2 ]' );" ), 1
  T?.eq (    dba.first_value dba.query SQL"select vnr_cmp_total(   '[ 1, 2, 3 ]', '[ 1, 2 ]' );" ), 1
  T?.eq ( jp dba.first_value dba.query SQL"select vnr_new_vnr(     '[ 1, 2, 3 ]' );"             ), [ 1, 2, 3 ]
  T?.eq ( jp dba.first_value dba.query SQL"select vnr_new_vnr(      null         );"             ), [ 0 ]
  T?.eq (    dba.first_value dba.query SQL"select vnr_encode(      '[ 1, 2, 3 ]' );"             ), Buffer.from '8000000180000002800000038000000080000000', 'hex'
  T?.eq ( vnr.hollerith.nr_min                                        ), -2147483648
  T?.eq ( vnr.hollerith.nr_max                                        ), 2147483647
  T?.eq ( vnr.encode [ vnr.hollerith.nr_min, vnr.hollerith.nr_max, ]  ), Buffer.from '00000000ffffffff800000008000000080000000', 'hex'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "alter_table" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  { Vnr, }    = require vnr_path
  { Dba, }    = require dba_path
  { Tbl, }    = require '../../../apps/icql-dba-tabulate'
  dba         = new Dba()
  vnr         = new Vnr { dba, }
  tbl         = new Tbl { dba, }
  debug '^3342^', CATALOGUE.all_keys_of vnr.hollerith
  #.........................................................................................................
  dba.execute SQL"""
    create table myfile ( line text not null );
    """
  #.........................................................................................................
  schema            = 'main'
  table_name        = 'myfile'
  json_column_name  = 'vnr'
  blob_column_name  = null
  vnr.alter_table { schema, table_name, json_column_name, blob_column_name, }
  insert_sql        = SQL"insert into myfile ( line, vnr ) values ( $line, $vnr )"
  dba.run insert_sql, { line: "first", vnr: ( jr [ 1, ] ) }
  debug tbl.dump_db()
  # debug '4476^', vnr
  # debug '4476^', JSON.stringify ( CATALOGUE.all_keys_of vnr ).sort(), null, '  '
  # console.table dba.list dba.query SQL"select * from v_variables;"
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  #     [ key, value, ] = probe
  #     vnr.set key, value
  #     result = vnr.get key
  #     resolve result
  # console.table dba.list dba.query SQL"select * from v_variables;"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "_" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = []
  { Vnr, }    = require vnr_path
  { Dba, }    = require dba_path
  dba         = new Dba()
  vnr         = new Vnr { dba, }
  # debug '4476^', vnr
  # debug '4476^', JSON.stringify ( CATALOGUE.all_keys_of vnr ).sort(), null, '  '
  # console.table dba.list dba.query SQL"select * from v_variables;"
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
  #     [ key, value, ] = probe
  #     vnr.set key, value
  #     result = vnr.get key
  #     resolve result
  # console.table dba.list dba.query SQL"select * from v_variables;"
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  @[ "alter_table" ]()

