
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
PATH                      = require 'path'
FS                        = require 'fs'
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
{ to_width }              = require 'to-width'
# { DBay }                  = require '../../../apps/dbay'
SQL                       = String.raw
# { SQL }                   = DBay
# { Sql }                   = require '../../../apps/dbay/lib/sql'
xrpr                      = ( x ) -> ( require 'util' ).inspect x, {
  colors: true, depth: Infinity, maxArrayLength: null, breakLength: Infinity, }
{ Desql }                 = require '../../../apps/desql'
hashbow                   = require 'hashbow'
chalk                     = require 'chalk'


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
pathsep_lit = "'-'"
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
  SQL"create view v as select a, b, c, f( d ) as k from t where e > 2;"
  SQL"select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;"
  SQL"""select a as a1, b from t as t1 where "x" = y order by k;"""
  SQL"""   select f(xxxxx) /* comment */ from t as t1 where "x" = $x order by k;"""
  # SQL"""order by k;"""
  SQL"""select
    42 as d;
    select 'helo world' as greetings;"""
  SQL"create view v as select a, b, [c], f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k, l, m;"
  SQL"select t1.a as alias, t2.b from s as t1 join t as t2 using ( cy, doe, eps );"
  SQL"""
      create view _coverage_holes as select
          c.qid                                                           as qid,
          c.id                                                            as id,
          2                                                               as xtra,
          c.prv_upid                                                      as upid,
          r.type                                                          as type,
          c.prv_path || #{pathsep_lit} || r.type                          as path,
          c.pos1                                                          as pos1,
          c.pos2                                                          as pos2,
          c.lnr1                                                          as lnr1,
          c.col1                                                          as col1,
          c.lnr2                                                          as lnr2,
          c.col2                                                          as col2,
          c.txt                                                           as txt
        from _coverage_holes_2  as c
        join ( select
            qid,
            id,
            case when std_str_is_blank( txt ) then 'spc' else 'miss' end as type
          from _coverage_holes_2 ) as r using ( qid, id );"""
  SQL"create table v as select a, b as b2, c.x as c2, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k, l, m;"
  SQL"""
    create table tcats ( -- terminal category codes
        major   text not null,
        minor   text not null,
        full    text not null generated always as ( major || minor ) virtual,
        name    text not null,
      primary key ( major, minor ),
      check ( std_re_is_match( major, '^[A-Z]$'     ) ),
      check ( std_re_is_match( minor, '^[a-z0-9]$'  ) ) );"""
  SQL"""
    create table tcats (
        major   text not null,
        minor   text not null,
        full    text not null generated always as ( major || minor ) virtual,
        name    text not null,
      primary key ( major, minor ),
      check ( std_re_is_match( major, '^[A-Z]$'     ) ),
      check ( std_re_is_match( minor, '^[a-z0-9]$'  ) ) );"""
  SQL"""
    create table tcats (
        major   text not null,
        minor   text not null,
        "full"  text not null,
        name    text not null,
      primary key ( major, minor ),
      check ( std_re_is_match( major, '^[A-Z]$'     ) ),
      check ( std_re_is_match( minor, '^[a-z0-9]$'  ) ) );"""
  SQL"""create table a ( full text );"""
  SQL"""create table a ( "full" text );"""
  SQL"""create table a ( x integer );"""
  SQL"select t1.a as alias, t2.b from s as t1 join t as t2 on ( cy = doe );"
  SQL"select 42 as d;"
  SQL"select a b c from t;"
  SQL"select a, b, c, from t;"
  SQL"select a, b, c,, from t;"
  SQL"select a.b.c from p.q.r.s.t;"
  SQL"select a.b from t;"
  SQL"select fld from tbl;"
  SQL"select tbl.fld from tbl;"
  SQL"select fld as fld1 from tbl;"
  SQL"select tbl.fld as fld1 from tbl as tbl1;"
  SQL"create view vw as select tbl.fld as fld1 from tbl as tbl1;"
  SQL"""select `c` from t;"""
  SQL"""select [c] from t;"""
  SQL"""select "c" from t;"""
  SQL"""select "c" as "c1" from t;"""
  SQL"""select name, type from sqlite_schema;"""
  SQL"""create view v as select a, b, "c", f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k desc, l, m;"""
  SQL"""select "c" as "c1" from "t";"""
  SQL"""
    create view mrg_parmirror as select
        rwnmirror.dsk                                                             as dsk,
        rwnmirror.oln                                                             as oln,
        rwnmirror.trk                                                             as trk,
        rwnmirror.pce                                                             as pce,
        rwnmirror.act                                                             as act,
        raw_mirror.mat                                                            as mat,
        ( select
              parlnrs.par as par
            from mrg_parlnrs as parlnrs
            where rwnmirror.rwn between parlnrs.rwn1 and parlnrs.rwn2 limit 1 )   as par,
        raw_mirror.txt                                                            as txt
      from mrg_rwnmirror  as rwnmirror
      join mrg_raw_mirror as raw_mirror using ( oln, trk, pce )
      order by rwn;"""
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
  n = queries.length
  for query in queries[ n - 3 .. ]
  # for query in queries[ 15 .. 20 ]
  # for query in queries
    desql = new Desql()
    desql.parse query
    # tabulate desql.db, SQL"select * from nodes where ( type != 'spc' ) order by id, xtra;"
    # tabulate desql.db, SQL"""select * from tcat_matches;"""
    X.tabulate query, desql.db SQL"""
      select
          path,
          pos1,
          type,
          substring( txt, 1, 25 ) as txt,
          codes,
          acodes,
          kcodes,
          icodes,
          lcodes,
          scodes,
          xcodes
        from terminals_with_grouped_tags
        where type != 'spc';"""
    highlight_parsing_result query, desql
  # tabulate desql.db, SQL"select * from tcat_rules as r join tcats using ( code ) order by code;"
  # tabulate desql.db, SQL"select * from tcats order by code;"
  # desql.create_trashlib()
  # tabulate desql.db, SQL"select name, type from sqlite_schema;"
  # tabulate desql.db, SQL"select * from dbay_fields;"
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_dbay_vogue = ->
  path  = '../../../assets/desql/dbay-vogue.sql'
  path  = PATH.resolve __dirname, path
  sql   = FS.readFileSync path, { encoding: 'utf-8', }
  # sql   = sql[ 0 .. 1024 ]
  queries = sql.split /;/
  for query in queries
    query = query.trim()
    continue if query is ''
    # query += ';' ### NOTE do not use trailing semicolon ###
    desql = new Desql()
    desql.parse query
    tabulate_query desql, query
    highlight_parsing_result query, desql
  return null

#-----------------------------------------------------------------------------------------------------------
tabulate_query = ( desql, query ) ->
  X.tabulate query, desql.db SQL"""
    select
        path,
        pos1,
        type,
        substring( txt, 1, 25 ) as txt,
        codes,
        acodes,
        kcodes,
        icodes,
        lcodes,
        scodes,
        xcodes
      from terminals_with_grouped_tags
      where type != 'spc';"""
  return null

#-----------------------------------------------------------------------------------------------------------
show_missing = ( query, desql ) ->
  rows = []
  for row from desql.db SQL"select * from _coverage_holes;"
    row.txt = rpr row.txt
    rows.push row
  X.tabulate "parts missing from AST", rows
  return null

#-----------------------------------------------------------------------------------------------------------
highlight_parsing_result = ( query, desql ) ->
  { db, }   = desql
  rvs       = ( P... ) -> CND.bold CND.reverse P...
  parts     = []
  #.........................................................................................................
  for { type, txt, icodes, } from db SQL"""select * from terminals_with_grouped_tags;"""
    if type is 'miss'
      txt = chalk.underline.red txt
    else if icodes?
      txt = ( chalk.inverse.bold.hex hashbow icodes ) txt
    parts.push txt
  #.........................................................................................................
  # X.banner query
  echo()
  echo parts.join ''
  echo()
  return null


############################################################################################################
if module is require.main then do =>
  # @demo_short_query()
  @demo_dbay_vogue()

  # do =>
  #   hashbow = require 'hashbow'
  #   chalk   = require 'chalk'
  #   cx      = require 'cohex'
  #   # info chalk.inverse.hex('#550440').italic.bgCyanBright.bold.underline('Hello, world!')
  #   # info chalk.inverse.hex( cx.seagreen ).italic.bgCyanBright.bold.underline('Hello, world!')
  #   # info chalk.inverse.hex( cx.darkseagreen ).italic.bgBlack.bold.underline('Hello, world!')
  #   # info chalk.inverse.hex( cx.aqua ).italic.bgBlack.bold.underline('Hello, world!')
  #   info chalk.inverse.hex( hashbow 'a' ).italic.bgBlack.underline('Hello, world!')
  #   info chalk.inverse.hex( hashbow 'b' ).italic.bgBlack.underline('Hello, world!')
  #   info chalk.inverse.hex( hashbow 'c' ).italic.bgBlack.underline('Hello, world!')
  #   info chalk.hex( hashbow 'a' ) 'Hello, world!'
  #   info chalk.bold.hex( hashbow 'a' ) 'Hello, world!'
  #   info chalk.hex( hashbow 'b' ) 'Hello, world!'
  #   info chalk.bold.hex( hashbow 'b' ) 'Hello, world!'
  #   info chalk.hex( hashbow 'c' ) 'Hello, world!'
  #   info chalk.bold.hex( hashbow 'c' ) 'Hello, world!'

