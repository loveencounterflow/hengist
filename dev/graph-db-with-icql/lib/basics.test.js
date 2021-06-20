(function() {
  'use strict';
  var CND, I, L, PATH, SQL, X, badge, debug, echo, help, info, insert_arithmetic_edges, isa, jr, reinitialize_db, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  // on_process_exit           = require 'exit-hook'
  // sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  ({SQL, I, L, X} = new (require('../../../apps/icql-dba/lib/sql')).Sql());

  jr = JSON.stringify;

  PATH = require('path');

  //-----------------------------------------------------------------------------------------------------------
  insert_arithmetic_edges = function(gdb, nr_max) {
    var i, id_1, id_2, j, k, nr, nr_1, nr_2, ref, ref1, ref2, value;
    for (nr = i = 1, ref = nr_max; (1 <= ref ? i <= ref : i >= ref); nr = 1 <= ref ? ++i : --i) {
      gdb.insert_node({
        id: `node${nr}`,
        nr,
        text: `<${nr}>`
      });
    }
    for (nr_1 = j = 1, ref1 = nr_max; (1 <= ref1 ? j <= ref1 : j >= ref1); nr_1 = 1 <= ref1 ? ++j : --j) {
      for (nr_2 = k = 1, ref2 = nr_max; (1 <= ref2 ? k <= ref2 : k >= ref2); nr_2 = 1 <= ref2 ? ++k : --k) {
        id_1 = `node${nr_1}`;
        id_2 = `node${nr_2}`;
        if ((nr_1 !== 1) && (nr_1 !== nr_2) && ((value = nr_2 / nr_1) === (Math.floor(nr_2 / nr_1)))) {
          gdb.insert_edge(id_1, id_2, {
            type: 'is_divider_of',
            a: nr_1,
            b: nr_2,
            value
          });
          // if ( nr_2 isnt 1 ) and ( nr_1 isnt nr_2 ) and ( ( value = nr_1 / nr_2 ) is ( nr_1 // nr_2 ) )
          gdb.insert_edge(id_2, id_1, {
            type: 'is_divided_by',
            a: nr_2,
            b: nr_1,
            value
          });
        }
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  reinitialize_db = function(gdb) {
    /* TAINT implement `clear-schema()` */
    gdb.dba.pragma(SQL`foreign_keys = off;`);
    gdb.dba.execute(SQL`drop index if exists id_idx`);
    gdb.dba.execute(SQL`drop index if exists source_idx`);
    // gdb.dba.execute SQL"drop index if exists sqlite_autoindex_nodes_1"
    gdb.dba.execute(SQL`drop index if exists target_idx`);
    gdb.dba.execute(SQL`drop table if exists edges`);
    gdb.dba.execute(SQL`drop table if exists nodes`);
    gdb.dba.execute(SQL`drop table if exists edges_g;`);
    gdb.dba.pragma(SQL`foreign_keys = on;`);
    gdb.init_db();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Graphdb: create"] = function(T, done) {
    var Graphdb, d, gdb, path, schema;
    T.halt_on_error();
    ({Graphdb} = require('./graph-db'));
    path = '/tmp/icql-graph.db';
    schema = 'main';
    gdb = new Graphdb({
      ram: true,
      schema
    });
    //.........................................................................................................
    T.eq(((function() {
      var ref, results;
      ref = gdb.dba.walk_objects({schema});
      results = [];
      for (d of ref) {
        results.push(d.name);
      }
      return results;
    })()).sort(), ['edges', 'id_idx', 'nodes', 'source_idx', 'sqlite_autoindex_nodes_1', 'target_idx']);
    //.........................................................................................................
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Graphdb: insert_node()"] = function(T, done) {
    var Graphdb, d, gdb, i, nr, path, result, schema;
    // T.halt_on_error()
    ({Graphdb} = require('./graph-db'));
    path = '/tmp/icql-graph.db';
    schema = 'main';
    gdb = new Graphdb({
      ram: true,
      schema
    });
//.........................................................................................................
// gdb.dba.run SQL"insert into nodes ( body ) values ( ? )", [ ( jr { id: '123', } ), ]
    for (nr = i = 1; i <= 10; nr = ++i) {
      gdb.insert_node({
        id: `node${nr}`,
        nr,
        text: `<${nr}>`
      });
    }
    result = gdb.dba.list(gdb.dba.query(SQL`select * from ${I(schema)}.nodes order by id;`));
    result = (function() {
      var results;
      results = [];
      for (d of result) {
        results.push([d.id, (JSON.parse(d.body)).text]);
      }
      return results;
    })();
    urge(result);
    T.eq(result, [['node1', '<1>'], ['node10', '<10>'], ['node2', '<2>'], ['node3', '<3>'], ['node4', '<4>'], ['node5', '<5>'], ['node6', '<6>'], ['node7', '<7>'], ['node8', '<8>'], ['node9', '<9>']]);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Graphdb: insert_edge()"] = function(T, done) {
    var Graphdb, d, edge, edge_count, gdb, node, nr_max, ref, ref1, schema;
    // T.halt_on_error()
    ({Graphdb} = require('./graph-db'));
    // path        = '/tmp/icql-graph.db'
    schema = 'main';
    gdb = new Graphdb({
      schema,
      ram: true
    });
    nr_max = 20;
    //.........................................................................................................
    // gdb.dba.run SQL"insert into nodes ( body ) values ( ? )", [ ( jr { id: '123', } ), ]
    insert_arithmetic_edges(gdb, nr_max);
    ref = gdb.dba.query(SQL`select * from nodes order by id;`);
    for (node of ref) {
      urge('^3343^', node);
    }
    edge_count = 0;
    ref1 = gdb.dba.query(SQL`select * from edges order by source, target;`);
    for (edge of ref1) {
      edge_count++;
      d = JSON.parse(edge.properties);
      urge('^3343^', d.a, d.type, d.b);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Graphdb: bfsvtab"] = function(T, done) {
    var Graphdb, edge, edges, gdb, i, nr_max, path, ref, ref1, row, schema, source, sql, target;
    /* https://github.com/abetlen/sqlite3-bfsvtab-ext */
    // T.halt_on_error()
    ({Graphdb} = require('./graph-db'));
    path = '/tmp/icql-graph.db';
    schema = 'main';
    gdb = new Graphdb({path, schema});
    nr_max = 20;
    //.........................................................................................................
    reinitialize_db(gdb);
    //.........................................................................................................
    gdb.dba.load_extension(PATH.resolve(PATH.join(__dirname, '../bfsvtab.so')));
    insert_arithmetic_edges(gdb, nr_max);
    gdb.dba.execute(SQL`create table edges_g ( source integer, target integer );`);
    edges = [...(gdb.dba.query(SQL`select * from edges;`))];
    for (edge of edges) {
      debug('^197^', edge);
      source = parseInt(edge.source.replace('node', ''), 10);
      target = parseInt(edge.target.replace('node', ''), 10);
      gdb.dba.run(SQL`insert into edges_g ( source, target ) values ( ?, ? );`, [source, target]);
    }
    ref = gdb.dba.query(SQL`select * from edges_g order by source, target;`);
    for (edge of ref) {
      debug('^509^', edge);
    }
    //.........................................................................................................
    sql = SQL`select
    b.root            as source,
    b.id              as target,
    b.distance        as distance,
    b.shortest_path   as shortest_path,
    b.parent          as parent,
    n.body            as target_node
  from bfsvtab as b
  left join nodes as n on ( n.id = 'node' || b.id )
  where true
    and tablename  = 'edges_g'
    and fromcolumn = 'source'
    and tocolumn   = 'target'
    and root       = ?
    -- and id         = 4;
  order by distance`;
    for (source = i = 1; i <= 20; source = ++i) {
      whisper('^665^', '-'.repeat(108));
      ref1 = gdb.dba.query(sql, [source]);
      for (row of ref1) {
        info('^665^', row);
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // test @[ "Graphdb: insert_node()" ]
      // test @[ "Graphdb: insert_edge()" ]
      // @[ "Graphdb: insert_node()" ]()
      return test(this["Graphdb: bfsvtab"]);
    })();
  }

}).call(this);

//# sourceMappingURL=basics.test.js.map