
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DESQL'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require 'guy'
# { HDML }                  = require '../../../apps/hdml'
X                         = require '../../../lib/helpers'
# { lets
#   freeze }                = GUY.lft
# { to_width }              = require 'to-width'
# { DBay }                  = require '../../../apps/dbay'
SQL                       = String.raw
# { SQL }                   = DBay
# { Sql }                   = require '../../../apps/dbay/lib/sql'
xrpr                      = ( x ) -> ( require 'util' ).inspect x, {
  colors: true, depth: Infinity, maxArrayLength: null, breakLength: Infinity, }
{ Desql }                 = require '../../../apps/desql'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_overview = ( db ) ->
  info '#############################################################################'
  X.tabulate "dbay_tables",                   db SQL"select * from dbay_tables"
  return null

#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> X.tabulate query, db query

#-----------------------------------------------------------------------------------------------------------
queries = [
  SQL"drop view if exists dbay_foreign_key_clauses_2;",
  SQL"""
    create view dbay_foreign_key_clauses_2 as select distinct
        fk_id                                                                     as fk_id,
        from_table_nr                                                             as from_table_nr,
        from_table_name                                                           as from_table_name,
        group_concat( std_sql_i( from_field_name ), ', ' ) over w                 as from_field_names,
        to_table_name                                                             as to_table_name,
        group_concat( std_sql_i(   to_field_name ), ', ' ) over w                 as to_field_names
      from dbay_foreign_key_clauses_1
      window w as (
        partition by from_table_name, fk_id
        order by fk_idx
        rows between unbounded preceding and unbounded following )
      order by from_table_name, fk_id, fk_idx;"""
  SQL"create table d ( x integer ) strict;"
  SQL"""create table d ( x "any" );"""
  SQL"insert into products ( nr, name ) values ( 1234, 'frob' );"
  SQL"select a, b from s join t using ( c );"
  SQL"select t1.a as alias, t2.b from s as t1 join t as t2 using ( c );"
  SQL"create view v as select a, b, c, f( d ) as k from t where e > 2;"
  SQL"create view v as select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;"
  SQL"select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;"
  SQL"""select
    42 as d;
    select 'helo world' as greetings;"""
  SQL"""select f(xxxxx) /* comment */ from t as t1 where "x" = $x order by k;"""
  ]

#-----------------------------------------------------------------------------------------------------------
@demo_short_query = ->
  # CATALOG = require '../../../jzr-old/multimix/lib/cataloguing'
  # q = antlr.parse "SELECT * FROM abc join users as u;", parser_cfg
  # for query in [ SQL"""select d as "d1" from a as a1;""", ]
  # for query in [ SQL"""select d + e + f( x ) as "d1" from a as a1;""", ]
  # for query in [ SQL"""select * from a left join b where k > 1 order by m limit 1;""", ]
  # for query in [ SQL"select '𠀀' as a;", ]
  # for query in [ queries[ 1 ], ]
  for query in [ queries[ queries.length - 1 ], ]
    desql = new Desql()
    # echo query
    desql.parse query
    tabulate desql.db, SQL"select * from queries;"
    tabulate desql.db, SQL"select * from raw_nodes order by id, xtra;"
    # tabulate desql.db, SQL"""
    #   select * from raw_nodes as r1 where not exists ( select 1 from raw_nodes as r2 where r2.upid = r1.id )
    #   """
    tabulate desql.db, SQL"select * from coverage;"
    tabulate desql.db, SQL"select * from _coverage_holes_1;"
    tabulate desql.db, SQL"select * from _coverage_holes;"
    # tabulate desql.db, SQL"select * from _first_coverage_hole;"
  return null

#-----------------------------------------------------------------------------------------------------------
show_series = ( query, series ) ->
  s = []
  for node in series
    s.push
      id:         node.id
      xtra:       0
      upid:       node.upid
      type:       node.type
      idx1:       node.idx1 ? null
      idx2:       node.idx2 ? null
      lnr1:       node.lnr1 ? null
      col1:       node.col1 ? null
      lnr2:       node.lnr2 ? null
      col2:       node.col2 ? null
      node_count: node.node_count
      text:       node.text
  X.tabulate query, s
  s = ( node for node in s when ( node.type isnt 'terminal' ) and ( node.node_count is 0 ) )
  X.tabulate query, s
  return null


############################################################################################################
if module is require.main then do =>
  @demo_short_query()

