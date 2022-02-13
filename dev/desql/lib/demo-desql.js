(function() {
  'use strict';
  var CND, Desql, GUY, SQL, X, badge, debug, echo, equals, help, highlight_parsing_result, info, isa, pathsep_lit, queries, rpr, show_missing, show_overview, tabulate, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, xrpr;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DESQL';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  // PATH                      = require 'path'
  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('guy');

  // { HDML }                  = require '../../../apps/hdml'
  X = require('../../../lib/helpers');

  // { lets
  //   freeze }                = GUY.lft
  ({to_width} = require('to-width'));

  // { DBay }                  = require '../../../apps/dbay'
  SQL = String.raw;

  // { SQL }                   = DBay
  // { Sql }                   = require '../../../apps/dbay/lib/sql'
  xrpr = function(x) {
    return (require('util')).inspect(x, {
      colors: true,
      depth: 2e308,
      maxArrayLength: null,
      breakLength: 2e308
    });
  };

  ({Desql} = require('../../../apps/desql'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_overview = function(db) {
    info('#############################################################################');
    X.tabulate("dbay_tables", db(SQL`select * from dbay_tables`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  tabulate = function(db, query) {
    return X.tabulate(query, db(query));
  };

  //-----------------------------------------------------------------------------------------------------------
  pathsep_lit = "'-'";

  queries = [
    SQL`drop view if exists dbay_foreign_key_clauses_2;`,
    SQL`create view dbay_foreign_key_clauses_2 as select distinct
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
  order by from_table_name, fk_id, fk_idx;`,
    SQL`create table d ( x integer ) strict;`,
    SQL`create table d ( x "any" );`,
    SQL`insert into products ( nr, name ) values ( 1234, 'frob' );`,
    SQL`select a, b from s join t using ( c );`,
    SQL`create view v as select a, b, c, f( d ) as k from t where e > 2;`,
    SQL`select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;`,
    SQL`select a as a1, b from t as t1 where "x" = y order by k;`,
    SQL`   select f(xxxxx) /* comment */ from t as t1 where "x" = $x order by k;`,
    // SQL"""order by k;"""
    SQL`select
42 as d;
select 'helo world' as greetings;`,
    SQL`create view v as select a, b, [c], f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k, l, m;`,
    SQL`select t1.a as alias, t2.b from s as t1 join t as t2 using ( cy, doe, eps );`,
    SQL`create view _coverage_holes as select
    c.qid                                                           as qid,
    c.id                                                            as id,
    2                                                               as xtra,
    c.prv_upid                                                      as upid,
    r.type                                                          as type,
    c.prv_path || ${pathsep_lit} || r.type                          as path,
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
    from _coverage_holes_2 ) as r using ( qid, id );`,
    SQL`select 42 as d;`,
    SQL`select a b c from t;`,
    SQL`select a, b, c, from t;`,
    SQL`select a, b, c,, from t;`,
    SQL`select a.b from t;`,
    SQL`select a.b.c from p.q.r.s.t;`,
    SQL`select t1.a as alias, t2.b from s as t1 join t as t2 on ( cy = doe );`,
    SQL`create view v as select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k, l, m;`,
    SQL`create table v as select a, b as b2, c.x as c2, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k, l, m;`
  ];

  //-----------------------------------------------------------------------------------------------------------
  this.demo_short_query = function() {
    var desql, i, len, n, query, ref;
    // CATALOG = require '../../../jzr-old/multimix/lib/cataloguing'
    // q = antlr.parse "SELECT * FROM abc join users as u;", parser_cfg
    // for query in [ SQL"""select d as "d1" from a as a1;""", ]
    // for query in [ SQL"""select d + e + f( x ) as "d1" from a as a1;""", ]
    // for query in [ SQL"""select * from a left join b where k > 1 order by m limit 1;""", ]
    // for query in [ SQL"select '𠀀' as a;", ]
    // for query in [ queries[ 1 ], ]
    n = queries.length;
    ref = queries.slice(n - 2);
    for (i = 0, len = ref.length; i < len; i++) {
      query = ref[i];
      // for query in queries
      desql = new Desql();
      // echo query
      desql.parse(query);
      // tabulate desql.db, SQL"select * from queries;"
      // tabulate desql.db, SQL"select * from raw_nodes order by id, xtra;"
      tabulate(desql.db, SQL`select * from nodes where ( type != 'spc' ) order by id, xtra;`);
      // tabulate desql.db, SQL"""
      //   select * from raw_nodes as r1 where not exists ( select 1 from raw_nodes as r2 where r2.upid = r1.id )
      //   """
      // tabulate desql.db, SQL"select * from _coverage_1;"
      // tabulate desql.db, SQL"select * from _coverage_holes_1;"
      // tabulate desql.db, SQL"select * from _coverage_holes_2;"
      // # tabulate desql.db, SQL"select * from _coverage_2;"
      // tabulate desql.db, SQL"select * from nodes;"
      // tabulate desql.db, SQL"""
      //   select * from nodes
      //   where true
      //     and ( type != 'spc' )
      //     and ( txt is not null )
      //     and ( path glob '* i ui t' or path glob '* i qi t' )
      //     ;"""
      // tabulate desql.db, SQL"select distinct type from nodes order by type;"
      // tabulate desql.db, SQL"select * from _coverage_holes where type = 'miss';"
      highlight_parsing_result(query, desql);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_missing = function(query, desql) {
    var ref, row, rows;
    rows = [];
    ref = desql.db(SQL`select * from _coverage_holes;`);
    for (row of ref) {
      row.txt = rpr(row.txt);
      rows.push(row);
    }
    X.tabulate("parts missing from AST", rows);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  highlight_parsing_result = function(query, desql) {
    var db, parts, path, ref, rvs, txt, y;
    ({db} = desql);
    rvs = function(...P) {
      return CND.bold(CND.reverse(...P));
    };
    parts = [];
    ref = db(SQL`select * from nodes where txt is not null;`);
    //.........................................................................................................
    for (y of ref) {
      ({path, txt} = y);
      if (!/-spc$/.test(path)) {
        info(to_width(rpr(txt), 20), rvs(path));
      }
      //.......................................................................................................
      txt = /-miss$/.test(path) ? rvs(CND.red(txt)) : /-fc-fn-qn-i-[uq]i-t$/.test(path) ? rvs(CND.blue(txt)) : /-cv-mi-eci-i-[uq]i-t$/.test(path) ? rvs(CND.olive(txt)) : /-dref-cref-i-[uq]i-t$/.test(path) ? rvs(CND.steel(txt)) : /-dref-i-[uq]i-t$/.test(path) ? rvs(CND.cyan(txt)) : /-dref-i-[uq]i-ansinr-t$/.test(path) ? rvs(CND.cyan(txt)) : /-select-nes-ne-e-pd-ve-cref-i-[uq]i-t$/.test(path) ? rvs(CND.gold(txt)) : /-ctable-ctableh-mi-eci-i-[uq]i-t$/.test(path) ? rvs(CND.tan(txt)) : /-cview-mi-eci-i-[uq]i-t$/.test(path) ? rvs(CND.tan(txt)) : /-tn-.*-i-[uq]i-t$/.test(path) ? rvs(CND.green(txt)) : /-tn-ta-[uq]i-t$/.test(path) ? rvs(CND.lime(txt)) : /-nes-ne-eci-i-[uq]i-t$/.test(path) ? rvs(CND.yellow(txt)) : /-nes-ne-eci-i-[uq]i-ansinr-t$/.test(path) ? rvs(CND.yellow(txt)) : /-qo-si-e-pd-ve-cref-i-[uq]i-t$/.test(path) ? rvs(CND.pink(txt)) : /-jc[ou]-.*-i-[uq]i-t$/.test(path) ? rvs(CND.indigo(txt)) : /-[uq]i-t$/.test(path) ? rvs(CND.plum(txt)) : /-c-.*-t$/.test(path) ? rvs(CND.orange(txt)) : txt; // function name // view name // table name in fqn (`t.col`) // col name in fqn (`t.col`) // col name in fqn (`t.col`) (also SQL kw) // col name in select // create table name // create view name // table name // table alias // col alias // col alias (also SQL kw) // col in order by // id in join criteria // fallback identifier // literal
      parts.push(txt);
    }
    //.........................................................................................................
    X.banner(query);
    echo();
    echo(parts.join(''));
    echo();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_short_query();
    })();
  }

  // do =>
//   chalk = require 'chalk'
//   cx    = require 'cohex'
//   info chalk.inverse.hex('#550440').italic.bgCyanBright.bold.underline('Hello, world!')
//   info chalk.inverse.hex( cx.seagreen ).italic.bgCyanBright.bold.underline('Hello, world!')
//   info chalk.inverse.hex( cx.darkseagreen ).italic.bgBlack.bold.underline('Hello, world!')
//   info chalk.inverse.hex( cx.aqua ).italic.bgBlack.bold.underline('Hello, world!')

}).call(this);

//# sourceMappingURL=demo-desql.js.map