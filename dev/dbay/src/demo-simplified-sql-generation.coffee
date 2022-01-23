
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

class Sql2 extends Sql

class DBay2 extends DBay

  #---------------------------------------------------------------------------------------------------------
  constructor: ( P... ) ->
    super P...
    @sql = new Sql2  
    return undefined

  #---------------------------------------------------------------------------------------------------------
  get_primary_keys: ( cfg ) ->
    { schema  } = @cfg
    R = @all_rows SQL"""
      select 
          -- pk                          as nr,
          $table                      as "table",
          name                        as field, 
          lower( type )               as type,
          not "notnull"               as nullable
        from #{schema}.pragma_table_info( $table )
        where true 
          and ( pk > 0 )
        order by pk;""", cfg
    row.nullable = not not row.nullable for row in R
    return R

  #---------------------------------------------------------------------------------------------------------
  get_foreign_keys: ( cfg ) ->
    { schema  } = @cfg
    R = @all_rows SQL"""
      select 
          $table                      as from_table,
          "from"                      as from_field,
          "table"                     as to_table,
          coalesce( "to", "from" )    as to_field
        from #{schema}.pragma_foreign_key_list( $table )
        order by seq;""", cfg
    return R

  #---------------------------------------------------------------------------------------------------------
  _get_foreign_key_by_from_fields: ( cfg ) ->
    { schema  } = @cfg
    R = {}
    for row from @query SQL"""
      select 
          "from"                      as from_field,
          "table"                     as to_table,
          coalesce( "to", "from" )    as to_field
        from #{schema}.pragma_foreign_key_list( $table );""", cfg
      R[ row.from_field ] = { table: row.to_table, field: row.to_field, }
    return R

  #---------------------------------------------------------------------------------------------------------
  _get_primary_key_clause: ( cfg ) ->
    { I     } = @sql
    pks       = @get_primary_keys cfg 
    pk_names  = ( I pk.field for pk in pks ).join ', '
    return SQL"primary key ( #{pk_names} )"

  #---------------------------------------------------------------------------------------------------------
  _get_foreign_key_clauses: ( cfg ) ->
    { I     } = @sql
    R         = {}
    for from_field, { table, field, } of @_get_foreign_key_by_from_fields cfg 
      R[ from_field ] = "references #{I table} ( #{I field} )"
    return R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_simplified_sql_generation = ( cfg ) ->
  { Mrg }         = require '../../../apps/dbay-mirage'
  db              = new DBay2()
  mrg             = new Mrg { db, }
  #.........................................................................................................
  db SQL"""
    create table a ( 
        foo float,
        bar float,
        baz float unique,
        nr integer,
      primary key ( nr ) );
    create table b ( 
        idx integer not null, 
        name text unique, 
      primary key ( idx ), 
      foreign key ( idx ) references a ( nr ) );
    create table c (
        x integer primary key references a ( nr ),
        y text references b ( name ), 
        z float references a ( baz ) );
    """
  #.........................................................................................................
  # H.tabulate 'sqlite_schema', db SQL"select * from sqlite_schema;"
  H.tabulate "pragma_table_list()", db SQL"select * from pragma_table_list();"
  H.tabulate "pragma_table_info( 'mrg_mirror' )", db SQL"select * from pragma_table_info( 'mrg_mirror' );"
  H.tabulate "pragma_foreign_key_list( 'mrg_mirror' )", db SQL"select * from pragma_foreign_key_list( 'mrg_mirror' );"
  H.tabulate "pragma_table_info( 'mrg_raw_mirror' )", db SQL"select * from pragma_table_info( 'mrg_raw_mirror' );"
  H.tabulate "pragma_foreign_key_list( 'mrg_raw_mirror' )", db SQL"select * from pragma_foreign_key_list( 'mrg_raw_mirror' );"
  H.tabulate "db.get_primary_keys { table: 'mrg_raw_mirror', }", db.get_primary_keys { table: 'mrg_raw_mirror', }
  H.tabulate "pragma_table_info( 'a' )", db SQL"select * from pragma_table_info( 'a' );"
  H.tabulate "pragma_foreign_key_list( 'a' )", db SQL"select * from pragma_foreign_key_list( 'a' );"
  H.tabulate "pragma_table_info( 'b' )", db SQL"select * from pragma_table_info( 'b' );"
  H.tabulate "pragma_foreign_key_list( 'b' )", db SQL"select * from pragma_foreign_key_list( 'b' );"
  H.tabulate "db.get_primary_keys { table: 'b', }", db.get_primary_keys { table: 'b', }
  H.tabulate "db.get_foreign_keys { table: 'b', }", db.get_foreign_keys { table: 'b', }
  H.tabulate "db.get_foreign_keys { table: 'mrg_raw_mirror', }", db.get_foreign_keys { table: 'mrg_raw_mirror', }
  urge '^546^', db._get_primary_key_clause { table: 'mrg_raw_mirror', }
  urge '^546^', db._get_foreign_key_clauses { table: 'mrg_raw_mirror', }
  urge '^546^', db._get_primary_key_clause { table: 'a', }
  urge '^546^', db._get_primary_key_clause { table: 'b', }
  urge '^546^', db._get_foreign_key_clauses { table: 'b', }
  return null


############################################################################################################
if module is require.main then do =>
  @demo_simplified_sql_generation()








