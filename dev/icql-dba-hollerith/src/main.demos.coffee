
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
@demo_simple_table = ->
  # T?.halt_on_error()
  #.........................................................................................................
  { Hollerith, }  = require icql_dba_hollerith_path
  { Dba, }        = require dba_path
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  dba             = new Dba()
  dhlr            = new Hollerith { dba, }
  # debug '^6w3^', dhlr
  debug '^6w3^', dhlr.cfg
  debug '^6w3^', dhlr.cfg.vnr_width
  tbl             = new Tbl { dba, }
  # fq          = ( P... ) -> dba.first_value dba.query P...
  #.........................................................................................................
  dba.execute SQL"""
    create table myfiles ( "text" text not null );
    """
  #.........................................................................................................
  schema            = 'main'
  table_name        = 'myfiles'
  json_column_name  = 'vnr'
  blob_column_name  = null
  dhlr.alter_table { schema, table_name, json_column_name, blob_column_name, }
  #.........................................................................................................
  insert_sql        = SQL"""insert into myfiles ( "text", vnr ) values ( $text, $vnr )"""
  dba.run insert_sql, { vnr: ( jr [ 1,    ] ), text: 'helo world', }
  dba.run insert_sql, { vnr: ( jr [ 1, 1, ] ), text: 'helo', }
  dba.run insert_sql, { vnr: ( jr [ 1, 2, ] ), text: 'world', }
  dba.run insert_sql, { vnr: ( jr [ 2,    ] ), text: 'fancy stuff here', }
  dba.run insert_sql, { vnr: ( jr [ 2, 1, ] ), text: 'fancy', }
  dba.run insert_sql, { vnr: ( jr [ 2, 2, ] ), text: 'stuff', }
  dba.run insert_sql, { vnr: ( jr [ 2, 3, ] ), text: 'here', }
  dba.run insert_sql, { vnr: ( jr [ 3,    ] ), text: 'that\'s all', }
  dba.run insert_sql, { vnr: ( jr [ 3, 1, ] ), text: 'that\'s', }
  dba.run insert_sql, { vnr: ( jr [ 3, 2, ] ), text: 'all', }
  #.........................................................................................................
  # debug tbl.dump_db { order_by: '1', }
  for line from tbl._walk_relation_lines { name: 'myfiles', order_by: 'vnr_blob', limit: null, }
    echo line
  #.........................................................................................................
  return null



############################################################################################################
if module is require.main then do =>
  @demo_simple_table()



