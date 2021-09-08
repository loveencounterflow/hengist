(function() {
  'use strict';
  var CND, Dba, H, PATH, SQL, badge, create_db_structure, create_sql_functions, debug, demo_1, echo, function_flags, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  function_flags = {
    is_deterministic: 0x000000800, // SQLITE_DETERMINISTIC
    is_directonly: 0x000080000, // SQLITE_DIRECTONLY
    is_subtype: 0x000100000, // SQLITE_SUBTYPE
    is_innocuous: 0x000200000 // SQLITE_INNOCUOUS
  };

  
  //-----------------------------------------------------------------------------------------------------------
  create_sql_functions = function(dba, prefix = 'xxx_') {
    var bit_pattern, property;
    //.........................................................................................................
    dba.create_function({
      name: prefix + 'fun_flags_as_text',
      deterministic: true,
      varargs: false,
      call: function(flags_int) {
        var R, k, v;
        R = [];
        for (k in function_flags) {
          v = function_flags[k];
          if ((flags_int & v) !== 0) {
            R.push(`+${k}`);
          }
        }
        // R.push '+usaf' unless '+inoc' in R
        return R.join('');
      }
    });
//.........................................................................................................
    for (property in function_flags) {
      bit_pattern = function_flags[property];
      ((property, bit_pattern) => {
        return dba.create_function({
          name: prefix + 'fun_' + property,
          deterministic: true,
          varargs: false,
          call: function(flags_int) {
            if ((flags_int & bit_pattern) !== 0) {
              return 1;
            } else {
              return 0;
            }
          }
        });
      })(property, bit_pattern);
    }
    //.........................................................................................................
    dba.create_aggregate_function({
      name: 'fun_zzz_donotuse_aggregate_function',
      start: function() {
        return null;
      },
      step: function(total, element) {
        debug('^4476^', {total, element});
        return (total != null ? total : 1) * element;
      }
    });
    dba.create_window_function({
      name: 'fun_zzz_donotuse_array_agg',
      varargs: false,
      deterministic: true,
      start: function() { // must be new object for each partition, therefore use function, not constant
        return [];
      },
      step: function(total, element) {
        total.push(element);
        return total;
      },
      inverse: function(total, dropped) {
        total.pop();
        return total;
      },
      result: function(total) {
        return jr(total);
      }
    });
    dba.create_table_function({
      name: 'fun_zzz_donotuse_re_matches',
      columns: ['match', 'capture'],
      parameters: ['text', 'pattern'],
      rows: function*(text, pattern) {
        return (yield 42);
      }
    });
    dba.create_virtual_table({
      name: 'fun_zzz_donotuse_file_contents',
      create: function(filename, ...P) {
        var R;
        urge('^46456^', {filename, P});
        R = {
          columns: ['path', 'lnr', 'line'],
          rows: function*() {
            var i, len, line, line_idx, lines, path;
            path = PATH.resolve(PATH.join(__dirname, '../../../assets/icql', filename));
            lines = (FS.readFileSync(path, {
              encoding: 'utf-8'
            })).split('\n');
            for (line_idx = i = 0, len = lines.length; i < len; line_idx = ++i) {
              line = lines[line_idx];
              yield ({
                path,
                lnr: line_idx + 1,
                line
              });
            }
            return null;
          }
        };
        return R;
      }
    });
    //.........................................................................................................
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
create unique index main.${prefix}b_n_idx on ${prefix}b ( n );
`);
    dba.open({
      schema: 'foo',
      ram: true
    });
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = async function() {
    var Dcat, Hollerith, Tbl, dba, dbatbl, dcat, entry, fun_name, hlr, ref, schema, template_path, work_path;
    ({Hollerith} = require('../../../apps/icql-dba-hollerith'));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    ({Dcat} = require('../../../apps/icql-dba-catalog'));
    dba = new Dba();
    debug('^335-1^', Object.isFrozen(dba));
    schema = 'main';
    ({template_path, work_path} = (await H.procure_db({
      size: 'nnt',
      ref: 'fn'
    })));
    debug('^335-2^', dba._state);
    debug('^335-3^', Object.isFrozen(dba._state));
    dba.open({
      path: work_path,
      schema
    });
    debug('^335-4^', dba._state);
    debug('^335-5^', Object.isFrozen(dba._state));
    hlr = new Hollerith({dba});
    debug('^335-6^', Object.isFrozen(dba._state));
    dcat = new Dcat({dba});
    debug('^335-7^', Object.isFrozen(dba._state));
    dbatbl = new Tbl({dba});
    debug('^335-8^', Object.isFrozen(dba._state));
    create_sql_functions(dba);
    create_db_structure(dba);
    debug({template_path, work_path});
    // echo dbatbl._tabulate dba.catalog()
    echo(dbatbl._tabulate(dba.query(SQL`select * from sqlite_schema order by type desc, name;`)));
    help("pragmas");
    echo(dbatbl._tabulate(dba.query(SQL`select * from pragma_pragma_list()      order by std_str_reverse( name );`)));
    // help "modules";      echo dbatbl._tabulate dba.query SQL"select * from pragma_module_list()      order by name;"
    // help "databases";    echo dbatbl._tabulate dba.query SQL"select * from pragma_database_list()    order by name;"
    // help "collations";   echo dbatbl._tabulate dba.query SQL"select * from pragma_collation_list()   order by name;"
    help("functions");
    echo(dbatbl._tabulate(dba.query(SQL`select * from pragma_function_list()    order by name;`)));
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
    std_str_join( '.', 'main', m.name, ii.name ) as 'indexed-columns',
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
    help("functions");
    echo(dbatbl._tabulate(dba.query(SQL`select
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
  order by name;`)));
    ref = dba._catalog;
    for (fun_name in ref) {
      entry = ref[fun_name];
      info(fun_name, entry);
    }
    // for n in [ 0 .. 100 ]
    //   debug '^980^', n, dba.first_row dba.query SQL"select sqlite_compileoption_get( $n ) as option;", { n }
    help("compile_time_options");
    echo(dbatbl._tabulate(dba.query(SQL`select * from dcat_compile_time_options;`)));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_1();
    })();
  }

}).call(this);

//# sourceMappingURL=catalog.demos.js.map