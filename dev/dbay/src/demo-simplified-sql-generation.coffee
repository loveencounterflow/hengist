
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/DEMO'
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
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ DBay }                  = require '../../../apps/dbay'
{ SQL }                   = DBay
{ Sql }                   = require '../../../apps/dbay/lib/sql'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_overview = ( db ) ->
  info '#############################################################################'
  H.tabulate "dbay_tables",                   db SQL"select * from dbay_tables"
  H.tabulate "dbay_unique_fields",            db SQL"select * from dbay_unique_fields"
  # H.tabulate "dbay_fields_1",                 db SQL"select * from dbay_fields_1"
  H.tabulate "dbay_fields",                   db SQL"select * from dbay_fields"
  # H.tabulate "dbay_foreign_key_clauses_1",    db SQL"select * from dbay_foreign_key_clauses_1"
  # H.tabulate "dbay_foreign_key_clauses_2",    db SQL"select * from dbay_foreign_key_clauses_2"
  # H.tabulate "dbay_foreign_key_clauses_3",    db SQL"select * from dbay_foreign_key_clauses_3"
  H.tabulate "dbay_foreign_key_clauses",      db SQL"select * from dbay_foreign_key_clauses"
  # H.tabulate "dbay_primary_key_clauses_1",    db SQL"select * from dbay_primary_key_clauses_1"
  H.tabulate "dbay_primary_key_clauses",      db SQL"select * from dbay_primary_key_clauses"
  # H.tabulate "dbay_field_clauses_1",          db SQL"select * from dbay_field_clauses_1"
  H.tabulate "dbay_field_clauses",            db SQL"select * from dbay_field_clauses"
  H.tabulate "dbay_create_table_clauses",     db SQL"select * from dbay_create_table_clauses"
  # H.tabulate "dbay_create_table_statements_1", db SQL"select * from dbay_create_table_statements_1"
  # H.tabulate "dbay_create_table_statements_2", db SQL"select * from dbay_create_table_statements_2"
  # H.tabulate "dbay_create_table_statements_3", db SQL"select * from dbay_create_table_statements_3"
  # H.tabulate "dbay_create_table_statements_4", db SQL"select * from dbay_create_table_statements_4"
  H.tabulate "dbay_create_table_statements",  db SQL"select * from dbay_create_table_statements"
  # H.tabulate "dbay_create_table_statements",  db SQL"""
  #   select
  #       lnr,
  #       tail,
  #       substring( txt, 1, 100 ) as txt
  #     from dbay_create_table_statements;"""
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_two_kinds_of_foreign_keys = ( cfg ) ->
  trycatch = ( ref, db, sql ) => try db sql catch error then warn ref, ( sql ), CND.reverse error.message
  do =>
    urge '################################'
    db              = new DBay { path: '/tmp/fk-demo-1.sqlite', }
    db._implement_trash()
    db SQL"""
      pragma foreign_keys = false;
      drop table if exists a;
      drop table if exists b;
      pragma foreign_keys = true;
      create table a (
          xnr   integer  not null unique,
          name  text     not null unique,
        primary key ( xnr, name ) );
      create table b (
          xnr    integer  not null,
          name  text     not null,
        foreign key ( xnr, name ) references a ( xnr, name ) );
      """
    trycatch '^578-1^', db, SQL"insert into a ( xnr, name ) values ( 1, 'one' );"
    trycatch '^578-2^', db, SQL"insert into a ( xnr, name ) values ( 2, 'two' );"
    trycatch '^578-3^', db, SQL"insert into b ( xnr, name ) values ( 1, 'one' );"
    trycatch '^578-4^', db, SQL"insert into b ( xnr, name ) values ( 2, 'two' );"
    trycatch '^578-5^', db, SQL"insert into b ( xnr, name ) values ( 1, 'two' );"
    H.tabulate "select * from a;", db SQL"select * from a;"
    H.tabulate "select * from b;", db SQL"select * from b;"
    # H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
    H.tabulate "dbay_fields", db SQL"select * from dbay_fields;"
    # H.tabulate "dbay_foreign_key_clauses_1", db SQL"select * from dbay_foreign_key_clauses_1;"
    # H.tabulate "dbay_foreign_key_clauses_2", db SQL"select * from dbay_foreign_key_clauses_2;"
    H.tabulate "dbay_primary_key_clauses", db SQL"select * from dbay_primary_key_clauses;"
    # H.tabulate "dbay_field_clauses_1", db SQL"select * from dbay_field_clauses_1;"
    H.tabulate "dbay_unique_fields", db SQL"select * from dbay_unique_fields;"
    H.tabulate "dbay_field_clauses", db SQL"select * from dbay_field_clauses;"
  do =>
    urge '################################'
    db              = new DBay { path: '/tmp/fk-demo-2.sqlite', }
    db._implement_trash()
    db SQL"""
      pragma foreign_keys = false;
      drop table if exists a;
      drop table if exists b;
      drop view  if exists c;
      pragma foreign_keys = true;
      create table a (
          xnr   integer  not null unique,
          name  text     not null unique,
        primary key ( xnr, name ) );
      create table b (
          xnr   integer  not null,
          name  text     not null,
        foreign key ( xnr    ) references a ( xnr   ),
        foreign key ( name  ) references a ( name ) );
      create view c as select
          xnr,
          name
        from b
        where xnr > 1
        order by xnr;
      """
    # db "pragma foreign_keys = false;"
    # H.tabulate "select * from pragma_foreign_key_check();", db SQL"select * from pragma_foreign_key_check();"
    trycatch '^578-7^', db, SQL"insert into a ( xnr, name ) values ( 1, 'one' );"
    trycatch '^578-8^', db, SQL"insert into a ( xnr, name ) values ( 2, 'two' );"
    trycatch '^578-9^', db, SQL"insert into b ( xnr, name ) values ( 1, 'one' );"
    trycatch '^578-10^', db, SQL"insert into b ( xnr, name ) values ( 2, 'two' );"
    trycatch '^578-11^', db, SQL"insert into b ( xnr, name ) values ( 1, 'two' );"
    H.tabulate "select * from a;", db SQL"select * from a;"
    H.tabulate "select * from b;", db SQL"select * from b;"
    # H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
    H.tabulate "dbay_fields", db SQL"select * from dbay_fields;"
    # H.tabulate "dbay_foreign_key_clauses_1", db SQL"select * from dbay_foreign_key_clauses_1;"
    # H.tabulate "dbay_foreign_key_clauses_2", db SQL"select * from dbay_foreign_key_clauses_2;"
    # H.tabulate "dbay_foreign_key_clauses_OLD", db SQL"select * from dbay_foreign_key_clauses_OLD;"
    H.tabulate "dbay_primary_key_clauses", db SQL"select * from dbay_primary_key_clauses;"
    # H.tabulate "dbay_field_clauses_1", db SQL"select * from dbay_field_clauses_1;"
    H.tabulate "dbay_unique_fields", db SQL"select * from dbay_unique_fields;"
    H.tabulate "dbay_field_clauses", db SQL"select * from dbay_field_clauses;"
    show_overview db
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_simplified_sql_generation = ( cfg ) ->
  { Mrg }         = require '../../../apps/dbay-mirage'
  db              = new DBay { path: '/tmp/foobar.sqlite', }
  db._implement_trash()
  # mrg             = new Mrg { db, }
  urge '################################'
  #.........................................................................................................
  db SQL"""
    pragma foreign_keys = false;
    drop table if exists a;
    drop table if exists b;
    drop table if exists c;
    drop table if exists b2;
    drop table if exists only_fk;
    drop view if exists ab;
    pragma foreign_keys = true;
    create table a (
        xnr integer,
        foo float,
        bar float default 42,
        baz float unique,
        this,
        that any,
        stealth integer hidden,
        x421 integer generated always as ( 42 ) virtual,
        x422 integer generated always as ( 42 ) stored,
        x423 integer generated always as ( 42 ) stored,
      primary key ( xnr ) );
    create unique index athisthat on a ( this, that );
    create table b (
        idx integer not null,
        name text unique,
      primary key ( idx, name ),
      -- foreign key ( idx ) references a ( xnr ),
      foreign key ( idx, name ) references a ( xnr, baz ) );
    create table b2 (
        idx integer not null,
        name text unique,
      primary key ( idx, name ),
      foreign key ( idx ) references a ( xnr ),
      foreign key ( name ) references a ( baz ) );
    create table c (
        x integer primary key references a ( xnr ),
        y text default 'whatever' references b ( name ),
        z float references a ( baz ) );
    create table only_fk (
        x integer,
        y text,
      foreign key ( x ) references a ( xnr ),
      foreign key ( y ) references b ( name ) );
    create view ab as select
        3 * 4 as twelve,
        x421,
        xnr
      from a
      order by x421;
    """
  #.........................................................................................................
  H.tabulate "select * from dbay_tables;", db SQL"select * from dbay_tables;"
  H.tabulate "dbay_field_clauses", db SQL"select * from dbay_field_clauses;"
  H.tabulate "dbay_primary_key_clauses", db SQL"select * from dbay_primary_key_clauses;"
  H.tabulate "dbay_create_table_clauses", db SQL"select * from dbay_create_table_clauses;"
  show_overview db
  txt = ( row.txt for row from db SQL"select * from dbay_create_table_statements" ).join '\n'
  FS.writeFileSync '/tmp/dbay-sample-dump.sql', txt
  return null



############################################################################################################
if module is require.main then do =>
  # @demo_two_kinds_of_foreign_keys()
  @demo_simplified_sql_generation()





