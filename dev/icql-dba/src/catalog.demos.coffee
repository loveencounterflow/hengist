
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

function_flags =
  is_deterministic:   0x000000800 # SQLITE_DETERMINISTIC
  is_directonly:      0x000080000 # SQLITE_DIRECTONLY
  is_subtype:         0x000100000 # SQLITE_SUBTYPE
  is_innocuous:       0x000200000 # SQLITE_INNOCUOUS

#===========================================================================================================
class Dbax extends Dba

  #---------------------------------------------------------------------------------------------------------
  catalog: ->
    @query "select * from sqlite_schema order by type desc, name;"

  #---------------------------------------------------------------------------------------------------------
  # _pragma_index_xinfo: ( schema, idx_name ) -> @pragma SQL"#{@sql.I schema}.index_xinfo( #{@sql.L idx_name} );"
  # _pragma_table_xinfo: ( schema, tbl_name ) -> @pragma SQL"#{@sql.I schema}.table_xinfo( #{@sql.L tbl_name} );"

#-----------------------------------------------------------------------------------------------------------
create_sql_functions = ( dba, prefix = 'xxx_' ) ->
  #.........................................................................................................
  dba.create_function
    name:           prefix + 'str_reverse'
    deterministic:  true
    varargs:        false
    call:           ( s ) -> ( Array.from s ).reverse().join ''
  #.........................................................................................................
  dba.create_function
    name:           prefix + 'str_join'
    deterministic:  true
    varargs:        true
    call:           ( joiner, P... ) -> P.join joiner
  #.........................................................................................................
  dba.create_function
    name:           prefix + 'fun_flags_as_text'
    deterministic:  true
    varargs:        false
    call:           ( flags_int ) ->
      R = []
      for k, v of function_flags
        R.push "+#{k}" if ( flags_int & v ) != 0
      # R.push '+usaf' unless '+inoc' in R
      return R.join ''
  #.........................................................................................................
  for property, bit_pattern of function_flags then do ( property, bit_pattern ) =>
    dba.create_function
      name:           prefix + 'fun_' + property
      deterministic:  true
      varargs:        false
      call:           ( flags_int ) -> if ( flags_int & bit_pattern ) != 0 then 1 else 0
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
    create unique index main.#{prefix}b_n_idx on #{prefix}b ( n );

    """
  dba.open { schema: 'foo', ram: true, }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  { Hollerith }     = require '../../../apps/icql-dba-hollerith'
  { Tbl, }          = require '../../../apps/icql-dba-tabulate'
  dba               = new Dbax()
  schema            = 'main'
  { template_path
    work_path }     = await H.procure_db { size: 'nnt', ref: 'fn', }
  dba.open { path: work_path, schema, }
  hlr               = new Hollerith { dba, }
  dbatbl            = new Tbl { dba, }
  create_sql_functions dba
  create_db_structure dba
  debug { template_path, work_path, }
  # echo dbatbl._tabulate dba.catalog()
  echo dbatbl._tabulate dba.query SQL"select * from sqlite_schema order by type desc, name;"
  help "pragmas";      echo dbatbl._tabulate dba.query SQL"select * from pragma_pragma_list()      order by xxx_str_reverse( name );"
  # help "modules";      echo dbatbl._tabulate dba.query SQL"select * from pragma_module_list()      order by name;"
  # help "databases";    echo dbatbl._tabulate dba.query SQL"select * from pragma_database_list()    order by name;"
  # help "collations";   echo dbatbl._tabulate dba.query SQL"select * from pragma_collation_list()   order by name;"
  help "functions";    echo dbatbl._tabulate dba.query SQL"select * from pragma_function_list()    order by name;"
  help "table_info";   echo dbatbl._tabulate dba.query SQL"select * from main.pragma_table_info( 'xxx_a' )       order by name;"
  help "indexes";      echo dbatbl._tabulate dba.query SQL"select * from main.pragma_index_list( 'xxx_a' )       order by name;"
  help "foreign_keys"; echo dbatbl._tabulate dba.query SQL"select * from main.pragma_foreign_key_list( 'xxx_a' ) order by 1;"
  help "indexed columns"; echo dbatbl._tabulate dba.query SQL"""
    -- thx to https://www.sqlite.org/pragma.html#pragfunc
    select
         -- distinct
        xxx_str_join( '.', 'main', m.name, ii.name ) as 'indexed-columns',
        *
    from sqlite_schema as m,
      pragma_index_list(  m.name  ) as il,
      pragma_index_info(  il.name ) as ii
    where m.type = 'table'
    order by 1;"""
  help "all columns"; echo dbatbl._tabulate dba.query SQL"""
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
      sqlite_master as m
    join
      pragma_table_info(m.name) as p
    order by
      m.name,
      p.cid;"""
  # help "index_xinfo"; echo dbatbl._tabulate dba._pragma_index_xinfo 'main', 'sqlite_autoindex_xxx_a_1'
  # help "table_xinfo"; echo dbatbl._tabulate dba._pragma_table_xinfo 'main', 'xxx_a'
  help "functions"; echo dbatbl._tabulate dba.query SQL"""
    select
        f.name                                as fun_name,
        f.builtin                             as is_builtin,
        f.type                                as type,
        -- f.enc                                 as enc,
        f.narg                                as narg,
        f.flags                               as flags,
        -- xxx_fun_flags_as_text( f.flags )      as tags,
        xxx_fun_is_deterministic( f.flags )   as is_deterministic,
        xxx_fun_is_innocuous( f.flags )       as is_innocuous,
        xxx_fun_is_directonly( f.flags )      as is_directonly
      from pragma_function_list as f
      order by name;"""
  for fun_name, entry of dba._catalog
    info fun_name, entry
  return null


############################################################################################################
if module is require.main then do =>
  demo_1()

