(function() {
  'use strict';
  var CND, DBay, FS, GUY, H, PATH, SQL, Sql, X, badge, debug, echo, equals, freeze, help, info, isa, lets, queries, rpr, show_antler_tree, show_overview, tabulate, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, xrpr,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/DEMO/TRASH';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('./helpers');

  X = require('../../../lib/helpers');

  ({lets, freeze} = GUY.lft);

  ({to_width} = require('to-width'));

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  ({Sql} = require('../../../apps/dbay/lib/sql'));

  xrpr = function(x) {
    return (require('util')).inspect(x, {
      colors: true,
      depth: 2e308,
      maxArrayLength: null,
      breakLength: 2e308
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_overview = function(db) {
    info('#############################################################################');
    X.tabulate("dbay_tables", db(SQL`select * from dbay_tables`));
    X.tabulate("dbay_unique_fields", db(SQL`select * from dbay_unique_fields`));
    // X.tabulate "dbay_fields_1",                 db SQL"select * from dbay_fields_1"
    X.tabulate("dbay_fields", db(SQL`select * from dbay_fields`));
    X.tabulate("dbay_foreign_key_clauses_1", db(SQL`select * from dbay_foreign_key_clauses_1`));
    X.tabulate("dbay_foreign_key_clauses_2", db(SQL`select * from dbay_foreign_key_clauses_2`));
    // X.tabulate "dbay_foreign_key_clauses_3",    db SQL"select * from dbay_foreign_key_clauses_3"
    X.tabulate("dbay_foreign_key_clauses", db(SQL`select * from dbay_foreign_key_clauses`));
    X.tabulate("dbay_primary_key_clauses_1", db(SQL`select * from dbay_primary_key_clauses_1`));
    X.tabulate("dbay_primary_key_clauses", db(SQL`select * from dbay_primary_key_clauses`));
    // X.tabulate "dbay_field_clauses_1",          db SQL"select * from dbay_field_clauses_1"
    X.tabulate("dbay_field_clauses", db(SQL`select * from dbay_field_clauses`));
    // X.tabulate "dbay_create_table_clauses",     db SQL"select * from dbay_create_table_clauses"
    // X.tabulate "dbay_create_table_statements_1", db SQL"select * from dbay_create_table_statements_1"
    // X.tabulate "dbay_create_table_statements_2", db SQL"select * from dbay_create_table_statements_2"
    // X.tabulate "dbay_create_table_statements_3", db SQL"select * from dbay_create_table_statements_3"
    // X.tabulate "dbay_create_table_statements_4", db SQL"select * from dbay_create_table_statements_4"
    // X.tabulate "dbay_create_table_statements",  db SQL"select * from dbay_create_table_statements"
    // X.tabulate "dbay_create_table_statements",  db SQL"""
    //   select
    //       lnr,
    //       tail,
    //       substring( txt, 1, 100 ) as txt
    //     from dbay_create_table_statements;"""
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
    SQL`select a from t;`,
    SQL`insert into products ( nr, name ) values ( 1234, 'frob' );`,
    SQL`select a, b from s join t using ( c );`,
    SQL`select t1.a as alias, t2.b from s as t1 join t as t2 using ( c );`,
    SQL`create view v as select a, b, c, f( d ) as k from t where e > 2;`,
    SQL`create view v as select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;`,
    SQL`select a, b, c, f( d ) as k from t join t2 using ( uuu ) where e > 2 order by k;`
  ];

  //-----------------------------------------------------------------------------------------------------------
  this.demo_trash_empty_db = function(cfg) {
    ({DBay} = require('../../../apps/dbay'));
    (() => {
      var db;
      db = new DBay();
      db.create_trashlib();
      return show_overview(db);
    })();
    (() => {
      var db;
      return db = new DBay();
    })();
    // db.
    // urge '^2334^', db.trash_to_sql()
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_trash = function(cfg) {
    var Mrg, db, db_path, from_path, mrg, trash_path;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    from_path = PATH.resolve(__dirname, '../../../assets/dbay/demo-html-parsing.sqlite');
    db_path = PATH.resolve(__dirname, '../../../data/dbay/demo-html-parsing.sqlite');
    trash_path = PATH.resolve(__dirname, '../../../data/dbay/demo-html-parsing.trashed.sqlite');
    H.copy_over(from_path, db_path);
    help(`^43587^ using DB at ${db_path}`);
    db = new DBay({
      path: db_path
    });
    mrg = new Mrg({db});
    db.create_trashlib();
    show_overview(db);
    db.trash_to_sqlite({
      path: trash_path,
      overwrite: true
    });
    help(`^43587^ trashed DB to ${trash_path}`);
    // urge '^2334^', db.trash_to_sql()
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_field_matrix = function(cfg) {
    var Mrg, all_fields, db, db_path, field_count, field_name, foreign_keys, from_field_name, from_key, from_path, from_table_name, i, includes, key, len, mrg, ref, ref1, ref2, ref3, seen_tables, sql, to_field_name, to_key, to_table_name, trash_path, x1, y, y1, z;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    from_path = PATH.resolve(__dirname, '../../../assets/dbay/demo-html-parsing.sqlite');
    db_path = PATH.resolve(__dirname, '../../../data/dbay/demo-html-parsing.sqlite');
    trash_path = PATH.resolve(__dirname, '../../../data/dbay/demo-html-parsing.trashed.sqlite');
    H.copy_over(from_path, db_path);
    help(`^43587^ using DB at ${db_path}`);
    db = new DBay({
      path: db_path
    });
    mrg = new Mrg({db});
    includes = ['mrg_datasources', 'mrg_html_atrids', 'mrg_html_atrs', 'mrg_html_mirror', 'mrg_html_typs', 'mrg_mirror', 'mrg_raw_mirror'];
    db.create_trashlib();
    // show_overview db
    foreign_keys = {};
    field_count = 0;
    all_fields = [];
    seen_tables = new Set();
    ref = db.all_rows(SQL`select * from dbay_foreign_key_clauses_1;`);
    for (y of ref) {
      ({from_table_name, from_field_name, to_table_name, to_field_name} = y);
      from_key = from_table_name + '/' + from_field_name;
      to_key = to_table_name + '/' + to_field_name;
      foreign_keys[from_key] = to_key/* TAINT can have multiple references */
      debug({from_table_name, from_field_name, to_table_name, to_field_name});
      if (!seen_tables.has(from_table_name)) {
        seen_tables.add(from_table_name);
        ref1 = db.all_rows(SQL`select * from dbay_fields where table_name = $from_table_name`, {from_table_name});
        for (z of ref1) {
          ({field_name} = z);
          all_fields.push(from_table_name + '/' + field_name);
        }
      }
      if (!seen_tables.has(to_table_name)) {
        seen_tables.add(to_table_name);
        ref2 = db.all_rows(SQL`select * from dbay_fields where table_name = $to_table_name`, {to_table_name});
        for (x1 of ref2) {
          ({field_name} = x1);
          all_fields.push(to_table_name + '/' + field_name);
        }
      }
    }
    urge(foreign_keys);
    info(all_fields);
    for (i = 0, len = all_fields.length; i < len; i++) {
      key = all_fields[i];
      urge(key);
    }
    ref3 = db(SQL`select * from sqlite_schema;`);
    for (y1 of ref3) {
      ({sql} = y1);
      if (sql == null) {
        continue;
      }
      if (sql === '') {
        continue;
      }
      echo(sql + ';');
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_analyze = function(cfg) {
    var db;
    ({DBay} = require('../../../apps/dbay'));
    db = new DBay();
    db(SQL`drop table if exists a;
drop table if exists b;
drop view  if exists c;
create table a ( d1 integer primary key, d2 text unique, c );
create table b ( d1 integer unique, d2 text unique, foreign key ( d1, d2 ) references a );
-- create view  c as select * from a union all select * from b;
create view c as select a.d1 as d1, b.d2 as d2 from a join b using ( d1, d2 );`);
    db(SQL`insert into a ( d1, d2 ) values ( 1, 'one' );`);
    db(SQL`analyze;`);
    tabulate(db, "select * from sqlite_stat1;");
    tabulate(db, "select * from sqlite_stat4;");
    tabulate(db, "explain query plan select * from a join b using ( d1, d2 );");
    tabulate(db, "explain select * from a join b using ( d1, d2 );");
    tabulate(db, "explain query plan select * from c;");
    tabulate(db, "explain select * from c;");
    tabulate(db, "explain select * from c where d1 > 0;");
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_tokenizer = function() {
    var cfg, color_count, colors, i, idx, len, sql, token, tokenize, tokens;
    cfg = {
      regExp: require('mysql-tokenizer/lib/regexp-sql92')
    };
    tokenize = (require('mysql-tokenizer'))(cfg);
    sql = `select *, 'helo world' as "text" from blah order by 1; insert sfksi 1286982342 &/$/&;`;
    sql = `create view d as select a + b + f( c ) as d from t;`;
    tokens = tokenize(sql + '\n');
    for (i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      debug(token);
    }
    colors = [
      (function(...P) {
        return CND.reverse(CND.lime(...P));
      }),
      (function(...P) {
        return CND.reverse(CND.blue(...P));
      }),
      (function(...P) {
        return CND.reverse(CND.orange(...P));
      })
    ];
    color_count = colors.length;
    tokens = (function() {
      var j, len1, results;
      results = [];
      for (idx = j = 0, len1 = tokens.length; j < len1; idx = ++j) {
        token = tokens[idx];
        results.push(colors[modulo(idx, color_count)](token));
      }
      return results;
    })();
    return info(tokens.join(''));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_highlightjs = function() {
    var i, len, query;
    for (i = 0, len = queries.length; i < len; i++) {
      query = queries[i];
      this.analyze_with_highlightjs(queries[0]);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.analyze_with_highlightjs = function(query) {
    var hl, hljs, i, len, match, part, parts, rows;
    hljs = require('highlight.js/lib/core');
    hljs.registerLanguage('sql', require('highlight.js/lib/languages/sql'));
    hljs.configure({
      classPrefix: ''
    });
    //.........................................................................................................
    hl = hljs.highlightAuto(query);
    parts = hl.value.split('<span class="');
    rows = [];
    for (i = 0, len = parts.length; i < len; i++) {
      part = parts[i];
      if (part === '') {
        continue;
      }
      if ((match = part.match(/^(?<type>[^"]+)">(?<tspan>[^<]*)<\/span>(?<tail>.*)$/s)) == null) {
        warn(`not recognized: ${rpr(part)}`);
        continue;
      }
      rows.push({...match.groups});
    }
    X.tabulate(query, rows);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_pgsql_parser = function() {
    
  const { parse, deparse } = require('pgsql-parser');
  const stmts = parse( sql );
  // stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';
  console.log(deparse(stmts));
  ;
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_pg_query_native = function() {
    var PQN, col, i, j, len, len1, pr, query, ref, t;
    PQN = require('pg-query-native');
    for (i = 0, len = queries.length; i < len; i++) {
      query = queries[i];
      info(query.slice(0, 101));
      pr = PQN.parse(query);
      if (pr.error != null) {
        warn(pr.error.message.replace(/\n.*/s, ''));
        col = pr.cursorPosition;
        warn(query.slice(col - 20, col) + CND.reverse(query.slice(col, col + 20)));
        this.analyze_with_highlightjs(query);
        continue;
      }
      ref = pr.query;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        t = ref[j];
        echo(xrpr(t));
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_highlight = function() {
    var highlight, highlighted, i, len, query;
    ({highlight} = require('sql-highlight'));
    for (i = 0, len = queries.length; i < len; i++) {
      query = queries[i];
      highlighted = highlight(query);
      echo(highlighted);
    }
    echo(highlight(SQL`select x from t;`));
    echo(highlight(SQL`select 'x' from t;`));
    echo(highlight(SQL`select "x" from t;`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_rhombic_antlr = function() {
    var CATALOG, antlr, c, getTable, i, j, len, len1, lineage, lineage_cfg, merged_leaves, node, parser_cfg, q, query, ref, ref1;
    CATALOG = require('multimix/lib/cataloguing');
    ({antlr} = require('rhombic'));
    parser_cfg = {
      doubleQuotedIdentifier: true
    };
    lineage_cfg = {
      positionalRefsEnabled: true
    };
    ref = [queries[queries.length - 1]];
    // q = antlr.parse "SELECT * FROM abc join users as u;", parser_cfg
    for (i = 0, len = ref.length; i < len; i++) {
      query = ref[i];
      X.banner(query);
      q = antlr.parse(query, parser_cfg);
      // debug type_of q
      debug(CATALOG.all_keys_of(q));
      info(q.getUsedTables());
      echo('^4656-1^', xrpr(CATALOG.all_keys_of(q.tree)));
      echo('^4656-2^', xrpr(q.tree.toStringTree()));
      echo('^4656-3^', xrpr(q.tree.text));
      echo('^4656-4^', type_of(q));
      echo('^4656-5^', type_of(q.tree));
      echo('^4656-6^', type_of(q.tree.children));
      echo('^4656-7^', q.tree.childCount);
      echo('^4656-8^', q.tree.query);
      echo('^4656-9^', q.tree.getToken);
      echo('^4656-10^', q.tree.getTokens);
      // echo '^4656-11^', xrpr q
      show_antler_tree(q.tree);
      continue;
      // Whether to use "mergedLeaves" or "tree" lineage type
      merged_leaves = false;
      getTable = function(...P) {
        debug('^443663456^', P);
        return null;
      };
      lineage = q.getLineage(getTable, merged_leaves, lineage_cfg);
      debug('^53453^', xrpr(lineage));
      ref1 = lineage.nodes;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        node = ref1[j];
        delete node.range;
        delete node.data;
        node.columns = (function() {
          var k, len2, ref2, results;
          ref2 = node.columns;
          results = [];
          for (k = 0, len2 = ref2.length; k < len2; k++) {
            c = ref2[k];
            results.push(c.label);
          }
          return results;
        })();
        echo(xrpr(node));
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  show_antler_tree = function(tree, level = 0) {
    var child, dent, i, len, ref, ref1;
    dent = '  '.repeat(level);
    debug('^4656-1^' + dent + rpr(tree.text));
    ref = tree.children;
    for (i = 0, len = ref.length; i < len; i++) {
      child = ref[i];
      info('^4656-1^' + dent + (type_of(child)) + ' ' + (rpr(child.text)));
      if (((ref1 = child.childCount) != null ? ref1 : 0) > 0) {
        show_antler_tree(child, level + 1);
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_rhombic_chevrotain = function() {
    var CATALOG, error, i, len, query, rhombic;
    CATALOG = require('multimix/lib/cataloguing');
    rhombic = (require('rhombic')).default;
    for (i = 0, len = queries.length; i < len; i++) {
      query = queries[i];
      X.banner(query);
      try {
        debug('^345-1', (rpr(rhombic.parse(query))).slice(0, 101));
      } catch (error1) {
        error = error1;
        warn(error.message);
      }
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_trash()
      // @demo_field_matrix()
      // @demo_analyze()
      // @demo_sql_tokenizer()
      // Syntax = require 'syntax'
      // debug s = new Syntax { language: 'sql', }
      // info s.plaintext "select * from t;"
      // help s.html()
      // @demo_highlightjs()
      // @demo_pgsql_parser()
      // @demo_pg_query_native()
      // @demo_sql_highlight()
      return this.demo_rhombic_antlr();
    })();
  }

  // @demo_rhombic_chevrotain()

  //   #---------------------------------------------------------------------------------------------------------
//   _walk_statements_from_path: ( sql_path ) ->
//     ### Given a path, iterate over SQL statements which are signalled by semicolons (`;`) that appear outside
//     of literals and comments (and the end of input). ###
//     ### thx to https://stackabuse.com/reading-a-file-line-by-line-in-node-js/ ###
//     ### thx to https://github.com/nacholibre/node-readlines ###
//     readlines       = new ( require 'n-readlines' ) sql_path
//     #.......................................................................................................
//     cfg           =
//       regExp: ( require 'mysql-tokenizer/lib/regexp-sql92' )
//     tokenize      = ( require 'mysql-tokenizer' ) cfg
//     collector     = null
//     # stream        = FS.createReadStream sql_path
//     #.......................................................................................................
//     flush = ->
//       R         = collector.join ''
//       collector = null
//       return R
//     #.......................................................................................................
//     while ( line = readlines.next() ) isnt false
//       for token, cur_idx in tokenize line + '\n'
//         if token is ';'
//           ( collector ?= [] ).push token
//           yield flush()
//           continue
//         # if token.startsWith '--'
//         #   continue
//         ( collector ?= [] ).push token
//     #.......................................................................................................
//     yield flush() if collector?
//     return null

}).call(this);

//# sourceMappingURL=demo-trash.js.map