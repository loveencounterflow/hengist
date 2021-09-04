(function() {
  'use strict';
  var CND, Dba, Dbax, H, PATH, SQL, badge, create_db_structure, create_sql_functions, debug, demo_1, echo, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/DEMO/CATALOG';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  ({Dba} = require(H.icql_dba_path));

  //===========================================================================================================
  Dbax = class Dbax extends Dba {
    //---------------------------------------------------------------------------------------------------------
    catalog() {
      return this.query("select * from sqlite_schema order by type desc, name;");
    }

  };

  //---------------------------------------------------------------------------------------------------------
  // _pragma_index_xinfo: ( schema, idx_name ) -> @pragma SQL"#{@sql.I schema}.index_xinfo( #{@sql.L idx_name} );"
  // _pragma_table_xinfo: ( schema, tbl_name ) -> @pragma SQL"#{@sql.I schema}.table_xinfo( #{@sql.L tbl_name} );"

  //-----------------------------------------------------------------------------------------------------------
  create_sql_functions = function(dba, prefix = 'xxx_') {
    dba.create_function({
      name: prefix + 'str_reverse',
      deterministic: true,
      varargs: false,
      call: function(s) {
        return (Array.from(s)).reverse().join('');
      }
    });
    dba.create_function({
      name: prefix + 'str_join',
      deterministic: true,
      varargs: true,
      call: function(joiner, ...P) {
        return P.join(joiner);
      }
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  create_db_structure = function(dba, prefix = 'xxx_') {
    dba.execute(SQL`create table ${prefix}a (
    n integer not null references b ( n ),
    b text not null,
    c json default '42',
  primary key ( n, b ) );
create table ${prefix}b ( n integer not null primary key references a ( n ) );
create unique index main.${prefix}a_n_idx on ${prefix}a ( n );
create unique index main.${prefix}b_n_idx on ${prefix}b ( n );`);
    dba.open({
      schema: 'foo',
      ram: true
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = async function() {
    var Hollerith, Tbl, dba, dbatbl, hlr, schema, template_path, work_path;
    ({Hollerith} = require('../../../apps/icql-dba-hollerith'));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dba = new Dbax();
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fn'
    })));
    dba.open({
      path: work_path,
      schema
    });
    hlr = new Hollerith({dba});
    dbatbl = new Tbl({dba});
    create_sql_functions(dba);
    create_db_structure(dba);
    debug({template_path, work_path});
    // echo dbatbl._tabulate dba.catalog()
    echo(dbatbl._tabulate(dba.query(SQL`select * from sqlite_schema order by type desc, name;`)));
    help("pragmas");
    echo(dbatbl._tabulate(dba.query(SQL`select * from pragma_pragma_list()      order by xxx_str_reverse( name );`)));
    // help "modules";      echo dbatbl._tabulate dba.query SQL"select * from pragma_module_list()      order by name;"
    // help "databases";    echo dbatbl._tabulate dba.query SQL"select * from pragma_database_list()    order by name;"
    // help "collations";   echo dbatbl._tabulate dba.query SQL"select * from pragma_collation_list()   order by name;"
    // help "functions";    echo dbatbl._tabulate dba.query SQL"select * from pragma_function_list()    order by name;"
    help("table_info");
    echo(dbatbl._tabulate(dba.query(SQL`select * from main.pragma_table_info( 'xxx_a' )       order by name;`)));
    help("indexes");
    echo(dbatbl._tabulate(dba.query(SQL`select * from main.pragma_index_list( 'xxx_a' )       order by name;`)));
    help("foreign_keys");
    echo(dbatbl._tabulate(dba.query(SQL`select * from main.pragma_foreign_key_list( 'xxx_a' ) order by 1;`)));
    help("indexed columns");
    echo(dbatbl._tabulate(dba.query(SQL`-- thx to https://www.sqlite.org/pragma.html#pragfunc
select
     -- distinct
    xxx_str_join( '.', 'main', m.name, ii.name ) as 'indexed-columns',
    *
from sqlite_schema as m,
  pragma_index_list(  m.name  ) as il,
  pragma_index_info(  il.name ) as ii
where m.type = 'table'
order by 1;`)));
    help("all columns");
    echo(dbatbl._tabulate(dba.query(SQL`-- thx to https://stackoverflow.com/a/53160348/256361
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
  p.cid;`)));
    // help "index_xinfo"; echo dbatbl._tabulate dba._pragma_index_xinfo 'main', 'sqlite_autoindex_xxx_a_1'
    // help "table_xinfo"; echo dbatbl._tabulate dba._pragma_table_xinfo 'main', 'xxx_a'
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_1();
    })();
  }

  // class Dbay extends Dbax
// debug dba = new Dba()
// debug dbax = new Dbax()
// debug dbay = new Dbay()
// debug dba instanceof Dba
// debug dbax instanceof Dbax
// debug dbay instanceof Dbay
// urge dbay  instanceof Dba
// urge dbay  instanceof Dbax
// urge dbay  instanceof Dbay
// help dbax  instanceof Dba
// help dbax  instanceof Dbax
// help dbax  instanceof Dbay

}).call(this);

//# sourceMappingURL=catalog.demos.js.map