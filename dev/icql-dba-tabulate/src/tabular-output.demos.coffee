
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/DEMOS/TABULATE'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
# on_process_exit           = require 'exit-hook'
# sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
{ width_of }              = require 'to-width'
H =
  icql_dba_path: '../../../apps/icql-dba'




#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_intertext_tabulate_4 = -> new Promise ( resolve, reject ) =>
  { Tbl, }    = require '../../../apps/icql-dba-tabulate'
  { Dba, }    = require H.icql_dba_path
  db_paths    = [
    # PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
    # PATH.resolve PATH.join __dirname, '../../../assets/icql/Chinook_Sqlite_AutoIncrementPKs.db'
    # PATH.resolve PATH.join __dirname, '../../../data/icql/icql-type-of-small.db'
    '/tmp/mygithub/github.sqlite'
    ]
  for db_path in db_paths
    # urge "^487^ using DB at #{db_path}"
    dba         = new Dba()
    schema      = 'main'
    schema_i    = dba.sql.I schema
    dba.open { path: db_path, schema, }
    dbatbl      = new Tbl { dba, }
    dbatbl.dump_db()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_intertext_tabulate_3 = -> new Promise ( resolve, reject ) =>
  { Tbl, }    = require '../../../apps/icql-dba-tabulate'
  { Dba, }    = require H.icql_dba_path
  db_path     = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  urge "^487^ using DB at #{db_path}"
  dba         = new Dba()
  dba.open { path: db_path, }
  dbatbl      = new Tbl { dba, }
  for line from dbatbl.walk_relation_lines { name: 'dpan_tags', }
    echo CND.lime line
  return null

#-----------------------------------------------------------------------------------------------------------
demo_intertext_tabulate_2 = -> new Promise ( resolve, reject ) =>
  { Tbl, }    = require '../../../apps/icql-dba-tabulate'
  { Dba, }    = require H.icql_dba_path
  db_path     = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  urge "^487^ using DB at #{db_path}"
  dba         = new Dba()
  dba.open { path: db_path, }
  dbatbl      = new Tbl { dba, }
  query       = dba.query SQL"select * from dpan_tags limit 500;"
  urge '^337^', dbatbl._tabulate query
  return null



############################################################################################################
if module is require.main then do =>
  # await demo_intertext_tabulate_1()
  # demo_intertext_tabulate_2()
  # demo_intertext_tabulate_3()
  demo_intertext_tabulate_4()
  # for code in [ 0 .. 255 ]
  #   echo code + 'helo world ' + "\x1b[#{code}m" + "helo world" + CND.red ''





