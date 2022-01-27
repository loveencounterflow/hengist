
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
SQL                       = String.raw
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
H                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ DBay }                  = require '../../../apps/dbay'
{ Sql }                   = require '../../../apps/dbay/lib/sql'



#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_two_kinds_of_foreign_keys = ( cfg ) ->
  do =>
    db              = new DBay()
    db SQL"""
      create table a (
          nr    integer  not null primary key,
          name  text     not null unique );
      create table b (
          nr    integer  not null,
          name  text     not null,
        foreign key ( nr, name ) references a ( nr, name ) );
      """
    db SQL"insert into a ( nr, name ) values ( 1, 'one' ), ( 2, 'two' );"
    # SQL"insert into b ( nr, name ) values ( 1, 'one' ), ( 2, 'two' );"
    # H.tabulate "select * from a;", db SQL"select * from a;"
    # H.tabulate "select * from b;", db SQL"select * from b;"
  do =>
    db              = new DBay()
    db SQL"""
      create table a (
          nr    integer  not null primary key,
          name  text     not null unique );
      create table b (
          nr    integer  not null,
          name  text     not null,
        foreign key ( nr    ) references a ( nr   ),
        foreign key ( name  ) references a ( name ) );
      """
    db SQL"insert into a ( nr, name ) values ( 1, 'one' ), ( 2, 'two' );"
    db SQL"insert into b ( nr, name ) values ( 1, 'one' ), ( 2, 'two' );"
    db SQL"insert into b ( nr, name ) values ( 1, 'two' );"
    H.tabulate "select * from a;", db SQL"select * from a;"
    H.tabulate "select * from b;", db SQL"select * from b;"
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_simplified_sql_generation = ( cfg ) ->
  { Mrg }         = require '../../../apps/dbay-mirage'
  db              = new DBay()
  # mrg             = new Mrg { db, }
  #.........................................................................................................
  db SQL"""
    create table a (
        nr integer,
        foo float,
        bar float,
        baz float unique,
        this,
        that any,
        stealth integer hidden,
        x421 integer generated always as ( 42 ) virtual,
        x422 integer generated always as ( 42 ) stored,
        x423 integer generated always as ( 42 ) stored,
      primary key ( nr ) );
    create unique index athisthat on a ( this, that );
    create table b (
        idx integer not null,
        name text unique,
      primary key ( idx, name ),
      -- foreign key ( idx ) references a ( nr ),
      foreign key ( idx, name ) references a ( nr, baz ) );
    create table b2 (
        idx integer not null,
        name text unique,
      primary key ( idx, name ),
      foreign key ( idx ) references a ( nr ),
      foreign key ( name ) references a ( baz ) );
    create table c (
        x integer primary key references a ( nr ),
        y text references b ( name ),
        z float references a ( baz ) );
    """
  #.........................................................................................................
  # H.tabulate 'sqlite_schema', db SQL"select type, name, tbl_name from sqlite_schema;"
  H.tabulate "pragma_table_list()", db SQL"select * from pragma_table_list();"
  H.tabulate "pragma_table_info( 'a' )", db SQL"select * from pragma_table_info( 'a' );"
  H.tabulate "pragma_table_xinfo( 'a' )", db SQL"select * from pragma_table_xinfo( 'a' );"
  H.tabulate "all the columns", db SQL"""
      select
          tl.schema         as schema,
          tl.name           as table_name,
          tl.type           as table_type,
          -- tl.ncol           as tl_ncol,
          -- tl.wr             as tl_wr, -- without rowid
          -- tl.strict         as tl_strict,
          ti.cid            as field_nr,
          ti.name           as field_name,
          case ti.type when '' then 'any' else lower( ti.type ) end         as field_type,
          not ti."notnull"        as nullable,
          ti.dflt_value     as fallback,
          ti.pk             as ti_pk,
          ti.hidden             as hidden
        from pragma_table_list() as tl
        join pragma_table_xinfo( tl.name ) as ti on ( true )
        where true
          and ( tl.name not like 'sqlite_%' );"""
  # H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
  H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
  H.tabulate "pragma_foreign_key_list( 'b2' )", db SQL"select * from pragma_foreign_key_list( 'b2' );"
  H.tabulate "pragma_foreign_key_list( 'c' )", db SQL"select * from pragma_foreign_key_list( 'c' );"
  # # H.tabulate "pragma_table_info( 'b' )", db SQL"select * from pragma_table_info( 'b' );"
  # # H.tabulate "pragma_table_info( 'c' )", db SQL"select * from pragma_table_info( 'c' );"
  # # H.tabulate "pragma_index_list( 'a' )", db SQL"select * from pragma_index_list( 'a' );"
  # # H.tabulate "pragma_index_list( 'c' )", db SQL"select * from pragma_index_list( 'c' );"
  # # H.tabulate "pragma_index_info( 'athisthat' )", db SQL"select * from pragma_index_info( 'athisthat' );"
  return null


############################################################################################################
if module is require.main then do =>
  # @demo_simplified_sql_generation()
  @demo_two_kinds_of_foreign_keys()







