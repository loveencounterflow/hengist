
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
icql_dba_hollerith_path   = '../../../apps/icql-dba-hollerith'
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
  T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  prefix          = 'hlr_'
  dba             = new Dba()
  hlr             = new Hollerith { dba, prefix, }
  fq              = ( P... ) -> dba.first_value dba.query P...
  #.........................................................................................................
  ### NOTE these are just shallow sanity checks; for tests proper see
  https://github.com/loveencounterflow/hengist/blob/master/dev/datom/src/hlr.test.coffee ###
  T?.eq ( hlr.advance      [ 1, 2, 3, ]            ), [ 1, 2, 4 ]
  T?.eq ( hlr.recede       [ 1, 2, 3, ]            ), [ 1, 2, 2 ]
  T?.eq ( hlr.deepen       [ 1, 2, 3, ]            ), [ 1, 2, 3, 0 ]
  T?.eq ( hlr.cmp          [ 1, 2, 3, ], [ 1, 2, ] ), 1
  T?.eq ( hlr.new_vnr      [ 1, 2, 3, ]            ), [ 1, 2, 3 ]
  T?.eq ( hlr.new_vnr      null                    ), [ 0 ]
  T?.eq ( hlr.encode       [ 1, 2, 3, ]            ), Buffer.from '8000000180000002800000038000000080000000', 'hex'
  #.........................................................................................................
  T?.eq ( jp fq SQL"select hlr_advance(     '[ 1, 2, 3 ]' );" ),             [ 1, 2, 4 ]
  T?.eq ( jp fq SQL"select hlr_recede(      '[ 1, 2, 3 ]' );" ),             [ 1, 2, 2 ]
  T?.eq ( jp fq SQL"select hlr_deepen(      '[ 1, 2, 3 ]' );" ),             [ 1, 2, 3, 0 ]
  T?.eq (    fq SQL"select hlr_cmp(         '[ 1, 2, 3 ]', '[ 1, 2 ]' );" ), 1
  T?.eq ( jp fq SQL"select hlr_new_vnr(      '[ 1, 2, 3 ]' );"             ), [ 1, 2, 3 ]
  T?.eq ( jp fq SQL"select hlr_new_vnr(       null         );"             ), [ 0 ]
  T?.eq (    fq SQL"select hlr_encode(      '[ 1, 2, 3 ]' );"             ), Buffer.from '8000000180000002800000038000000080000000', 'hex'
  T?.eq ( hlr.C.u32_nr_min                                        ), -2147483648
  T?.eq ( hlr.C.u32_nr_max                                        ), 2147483647
  T?.eq ( hlr.encode [ hlr.C.u32_nr_min, hlr.C.u32_nr_max, ]  ), Buffer.from '00000000ffffffff800000008000000080000000', 'hex'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "VNR basics (JS)" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  dba             = new Dba()
  hlr             = new Hollerith { dba, }
  #.........................................................................................................
  T?.eq ( d = hlr.new_vnr()                 ), [ 0, ]
  T?.eq ( d = hlr.new_vnr      [ 4, 6, 5, ] ), [ 4, 6, 5, ]
  T?.eq ( d = hlr.deepen       d            ), [ 4, 6, 5, 0, ]
  T?.eq ( d = hlr.deepen       d, 42        ), [ 4, 6, 5, 0, 42, ]
  T?.eq ( d = hlr.advance      d            ), [ 4, 6, 5, 0, 43, ]
  T?.eq ( d = hlr.recede       d            ), [ 4, 6, 5, 0, 42, ]
  T?.ok ( hlr.new_vnr  d ) isnt d
  T?.ok ( hlr.deepen   d ) isnt d
  T?.ok ( hlr.advance  d ) isnt d
  T?.ok ( hlr.recede   d ) isnt d
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "VNR basics (SQL)" ] = ( T, done ) ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  dba             = new Dba()
  hlr             = new Hollerith { dba, }
  fq              = ( P... ) -> dba.first_value dba.query P...
  #.........................................................................................................
  T?.eq ( d = jp fq SQL"select hlr_new_vnr();"                 ), [ 0, ]
  T?.eq ( d = jp fq SQL"select hlr_new_vnr(  '[ 4, 6, 5 ]' );" ), [ 4, 6, 5, ]
  T?.eq ( d = jp fq SQL"select hlr_deepen(   $d            );", { d: ( jr d ), } ), [ 4, 6, 5, 0, ]
  T?.eq ( d = jp fq SQL"select hlr_deepen(   $d, 42        );", { d: ( jr d ), } ), [ 4, 6, 5, 0, 42, ]
  T?.eq ( d = jp fq SQL"select hlr_advance(  $d            );", { d: ( jr d ), } ), [ 4, 6, 5, 0, 43, ]
  T?.eq ( d = jp fq SQL"select hlr_recede(   $d            );", { d: ( jr d ), } ), [ 4, 6, 5, 0, 42, ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "HLR alter_table 1" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  dba             = new Dba()
  hlr             = new Hollerith { dba, }
  tbl             = new Tbl { dba, }
  # debug '^3342^', CATALOGUE.all_keys_of hlr.hollerith
  #.........................................................................................................
  dba.execute SQL"""
    create table myfile ( line text not null );
    """
  #.........................................................................................................
  schema            = 'main'
  table_name        = 'myfile'
  json_column_name  = 'vnr'
  blob_column_name  = null
  hlr.alter_table { schema, table_name, json_column_name, blob_column_name, }
  insert_sql        = SQL"insert into myfile ( line, vnr ) values ( $line, $vnr )"
  dba.run insert_sql, { line: "third", vnr: ( jr [ 3, ] ) }
  dba.run insert_sql, { line: "second", vnr: ( jr [ 2, ] ) }
  dba.run insert_sql, { line: "first", vnr: ( jr [ 1, ] ) }
  #.........................................................................................................
  error = null
  try
    dba.run insert_sql, { line: "fourth", vnr: ( jr [ 3, ] ) }
  catch error
    T?.eq error.code, 'SQLITE_CONSTRAINT_UNIQUE'
    debug error.name
  T?.ok error?
  #.........................................................................................................
  debug tbl.dump_db { order_by: '1', }
  T.eq ( dba.list dba.query SQL"select * from myfile order by vnr_blob;" ), [
    { line: 'first',  vnr: '[1]', vnr_blob: ( Buffer.from '8000000180000000800000008000000080000000', 'hex' ) },
    { line: 'second', vnr: '[2]', vnr_blob: ( Buffer.from '8000000280000000800000008000000080000000', 'hex' ) },
    { line: 'third',  vnr: '[3]', vnr_blob: ( Buffer.from '8000000380000000800000008000000080000000', 'hex' ) } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "HLR alter_table with existing columns 1" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  dba             = new Dba()
  hlr             = new Hollerith { dba, }
  tbl             = new Tbl { dba, }
  # debug '^3342^', CATALOGUE.all_keys_of hlr.hollerith
  #.........................................................................................................
  dba.execute SQL"""
    create table myfile ( line text not null, vnr json not null );
    create unique index hlr_myfile_vnr_idx on myfile ( vnr );
    """
  #.........................................................................................................
  schema            = 'main'
  table_name        = 'myfile'
  json_column_name  = 'vnr'
  blob_column_name  = null
  hlr.alter_table { schema, table_name, json_column_name, blob_column_name, }
  insert_sql        = SQL"insert into myfile ( line, vnr ) values ( $line, $vnr )"
  dba.run insert_sql, { line: "third", vnr: ( jr [ 3, ] ) }
  dba.run insert_sql, { line: "second", vnr: ( jr [ 2, ] ) }
  dba.run insert_sql, { line: "first", vnr: ( jr [ 1, ] ) }
  #.........................................................................................................
  error = null
  try
    dba.run insert_sql, { line: "fourth", vnr: ( jr [ 3, ] ) }
  catch error
    T?.eq error.code, 'SQLITE_CONSTRAINT_UNIQUE'
    debug error.name
  T?.ok error?
  #.........................................................................................................
  debug tbl.dump_db { order_by: '1', }
  T.eq ( dba.list dba.query SQL"select * from myfile order by vnr_blob;" ), [
    { line: 'first',  vnr: '[1]', vnr_blob: ( Buffer.from '8000000180000000800000008000000080000000', 'hex' ) },
    { line: 'second', vnr: '[2]', vnr_blob: ( Buffer.from '8000000280000000800000008000000080000000', 'hex' ) },
    { line: 'third',  vnr: '[3]', vnr_blob: ( Buffer.from '8000000380000000800000008000000080000000', 'hex' ) } ]
  #.........................................................................................................
  done?()

  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> new Promise ( resolve ) ->

#-----------------------------------------------------------------------------------------------------------
@[ "_" ] = ( T, done ) ->
  T?.halt_on_error()
  #.........................................................................................................
  probes_and_matchers = []
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  dba             = new Dba()
  hlr             = new Hollerith { dba, }
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
  test @, { timeout: 10e3, }
  # test @[ "API" ]
  @[ "HLR alter_table with existing columns 1" ]()

