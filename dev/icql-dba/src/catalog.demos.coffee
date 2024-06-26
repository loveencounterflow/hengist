
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/DEMO/CATALOG'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
{ Dba }                   = require H.icql_dba_path



#-----------------------------------------------------------------------------------------------------------
create_sql_functions = ( dba, prefix = 'xxx_' ) ->
  #.........................................................................................................
  dba.create_aggregate_function
    name:           'fun_zzz_donotuse_aggregate_function'
    start:          -> null
    step:           ( total, element ) -> debug '^4476^', { total, element, }; ( total ? 1 ) * element
  dba.create_window_function
    name:           'fun_zzz_donotuse_array_agg'
    varargs:        false
    deterministic:  true
    start:          -> [] # must be new object for each partition, therefore use function, not constant
    step:           ( total, element ) -> total.push element; total
    inverse:        ( total, dropped ) -> total.pop(); total
    result:         ( total ) -> jr total
  dba.create_table_function
    name:           'fun_zzz_donotuse_re_matches'
    columns:        [ 'match', 'capture', ]
    parameters:     [ 'text', 'pattern', ]
    rows: ( text, pattern ) -> yield 42
  dba.create_virtual_table
    name:   'fun_zzz_donotuse_file_contents'
    create: ( filename, P... ) ->
      urge '^46456^', { filename, P, }
      R =
        columns: [ 'path', 'lnr', 'line', ],
        rows: ->
          path  = PATH.resolve PATH.join __dirname, '../../../assets/icql', filename
          lines = ( FS.readFileSync path, { encoding: 'utf-8', } ).split '\n'
          for line, line_idx in lines
            yield { path, lnr: line_idx + 1, line, }
          return null
      return R
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
create_db_structure = ( dba, prefix = 'xxx_' ) ->
  dba.execute SQL"""
    create table #{prefix}a (
        n integer not null references b ( n ),
        b text not null,
        c json default '42',
      primary key ( n, b ) );
    create table #{prefix}b ( n integer not null primary key references a ( n ) );
    create unique index main.#{prefix}a_n_idx on #{prefix}a ( n );
    create unique index main.#{prefix}b_n_idx on #{prefix}b ( n );"""
  dba.open { schema: 'foo', ram: true, }
  # dba.execute SQL"""
  #   create table foo.blah (
  #       id integer not null,
  #       b text not null,
  #     primary key ( id ) );
  #   create unique index foo.blah_b_idx on blah ( b );
  #   create trigger foo.on_blah_insert before insert on foo.blah for each row begin
  # """
  return null

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { Hollerith }     = require '../../../apps/icql-dba-hollerith'
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  { Dcat, }         = require '../../../apps/icql-dba-catalog'
  dba               = new Dba()
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fn', }
  dba.open { path: work_path, schema, }
  dhlr            = new Hollerith { dba, }
  dcat            = new Dcat      { dba, }
  dtab            = new Tbl       { dba, }
  create_sql_functions dba
  create_db_structure dba
  ###
  # echo dtab._tabulate dba.catalog()
  echo dtab._tabulate dba.query SQL"select * from sqlite_schema order by type desc, name;"
  help "foreign_keys"; echo dtab._tabulate dba.query SQL"select * from main.pragma_foreign_key_list( 'xxx_a' ) order by 1;"
  help "indexed columns"; echo dtab._tabulate dba.query SQL"""
    -- thx to https://www.sqlite.org/pragma.html#pragfunc
    select
         -- distinct
        std_str_join( '.', 'main', m.name, ii.name ) as 'indexed-columns',
        *
    from sqlite_schema as m,
      pragma_index_list(  m.name  ) as il,
      pragma_index_info(  il.name ) as ii
    where m.type = 'table'
    order by 1;"""
  help "all columns"; echo dtab._tabulate dba.query SQL"""
    -- thx to https://stackoverflow.com/a/53160348/256361
    select
      p.cid         as col_id,
      'main'        as scm_name,
      m.name        as tbl_name,
      p.name        as col_name,
      p.type        as col_type,
      p."notnull"   as col_notnull,
      p.dflt_value  as col_default,
      p.pk          as col_pk_idx
      -- m.*
    from
      sqlite_schema as m
    join
      pragma_table_info(m.name) as p
    order by
      m.name,
      p.cid;"""
  # help "modules";     echo dtab._tabulate dba.query SQL"select * from dcat_modules;"
  # help "collations";  echo dtab._tabulate dba.query SQL"select * from dcat_collations;"
  # help "functions";   echo dtab._tabulate dba.query SQL"select * from dcat_functions;"
  # help "pragmas";     echo dtab._tabulate dba.query SQL"select * from dcat_pragmas;"
  # help "table_info";   echo dtab._tabulate dba.query SQL"select * from main.pragma_table_info( 'xxx_a' )       order by name;"
  # help "table_info";   echo dtab._tabulate dba.query SQL"select * from main.pragma_table_info( 'xxx_a' )       order by name;"
  # help "indexes";      echo dtab._tabulate dba.query SQL"select * from main.pragma_index_list( 'xxx_a' )       order by name;"
  ###
  help "databases";   echo dtab._tabulate dba.query SQL"select * from dcat_databases;"
  help "databases";   echo dtab._tabulate dba.query SQL"select * from foo.sqlite_schema;"
  # help "databases";   echo dcat._get_union_of_sqlite_schema_selects()
  # help "databases";   echo dtab._tabulate dba.query dcat._get_union_of_sqlite_schema_selects()
  help "databases";   echo dcat.sql.reltrigs
  help "databases";   echo dtab._tabulate dba.query dcat.sql.reltrigs
  # dba.with_transaction ->
  #   help "databases";   echo dtab._tabulate dba.query SQL"select * from dcat_reltrigs;"
  help "options";     echo dtab._tabulate dba.query SQL"select * from dcat_compile_time_options;"
  return null


############################################################################################################
if module is require.main then do =>
  demo_1()

