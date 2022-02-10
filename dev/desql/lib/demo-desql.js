(function() {
  'use strict';
  var CND, Desql, GUY, SQL, X, badge, debug, echo, equals, help, info, isa, queries, rpr, show_overview, show_series, tabulate, type_of, types, urge, validate, validate_list_of, warn, whisper, xrpr;

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
  // { to_width }              = require 'to-width'
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
    SQL`select t1.a as alias, t2.b from s as t1 join t as t2 using ( c );`,
    SQL`create view v as select a, b, c, f( d ) as k from t where e > 2;`,
    SQL`create view v as select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;`,
    SQL`select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;`,
    SQL`select
42 as d;
select 'helo world' as greetings;`,
    SQL`select f(xxxxx) /* comment */ from t as t1 where "x" = $x order by k;`
  ];

  //-----------------------------------------------------------------------------------------------------------
  this.demo_short_query = function() {
    var desql, i, len, query, ref;
    ref = [queries[queries.length - 1]];
    // CATALOG = require '../../../jzr-old/multimix/lib/cataloguing'
    // q = antlr.parse "SELECT * FROM abc join users as u;", parser_cfg
    // for query in [ SQL"""select d as "d1" from a as a1;""", ]
    // for query in [ SQL"""select d + e + f( x ) as "d1" from a as a1;""", ]
    // for query in [ SQL"""select * from a left join b where k > 1 order by m limit 1;""", ]
    // for query in [ SQL"select '𠀀' as a;", ]
    // for query in [ queries[ 1 ], ]
    for (i = 0, len = ref.length; i < len; i++) {
      query = ref[i];
      desql = new Desql();
      // echo query
      desql.parse(query);
      tabulate(desql.db, SQL`select * from queries;`);
      tabulate(desql.db, SQL`select * from raw_nodes order by id, xtra;`);
      // tabulate desql.db, SQL"""
      //   select * from raw_nodes as r1 where not exists ( select 1 from raw_nodes as r2 where r2.upid = r1.id )
      //   """
      tabulate(desql.db, SQL`select * from coverage;`);
      tabulate(desql.db, SQL`select * from _coverage_holes_1;`);
      tabulate(desql.db, SQL`select * from _coverage_holes;`);
    }
    // tabulate desql.db, SQL"select * from _first_coverage_hole;"
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_series = function(query, series) {
    var i, len, node, ref, ref1, ref2, ref3, ref4, ref5, s;
    s = [];
    for (i = 0, len = series.length; i < len; i++) {
      node = series[i];
      s.push({
        id: node.id,
        xtra: 0,
        upid: node.upid,
        type: node.type,
        idx1: (ref = node.idx1) != null ? ref : null,
        idx2: (ref1 = node.idx2) != null ? ref1 : null,
        lnr1: (ref2 = node.lnr1) != null ? ref2 : null,
        col1: (ref3 = node.col1) != null ? ref3 : null,
        lnr2: (ref4 = node.lnr2) != null ? ref4 : null,
        col2: (ref5 = node.col2) != null ? ref5 : null,
        node_count: node.node_count,
        text: node.text
      });
    }
    X.tabulate(query, s);
    s = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = s.length; j < len1; j++) {
        node = s[j];
        if ((node.type !== 'terminal') && (node.node_count === 0)) {
          results.push(node);
        }
      }
      return results;
    })();
    X.tabulate(query, s);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_short_query();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-desql.js.map