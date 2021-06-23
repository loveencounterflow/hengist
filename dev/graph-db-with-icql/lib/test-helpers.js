(function() {
  'use strict';
  var CND, I, L, PATH, SQL, X, badge, debug, echo, help, info, isa, jr, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
  // test                      = require '../../../apps/guy-test'
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  // on_process_exit           = require 'exit-hook'
  // sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  ({SQL, I, L, X} = new (require('../../../apps/icql-dba/lib/sql')).Sql());

  jr = JSON.stringify;

  PATH = require('path');

  //-----------------------------------------------------------------------------------------------------------
  this.insert_arithmetic_edges = function(gdb, nr_max) {
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
  this.insert_kanji_edges = function(gdb) {
    gdb.insert_node({
      id: '或'
    });
    gdb.insert_node({
      id: '國'
    });
    gdb.insert_node({
      id: '口'
    });
    gdb.insert_node({
      id: '域'
    });
    gdb.insert_edge('口', '或', 'is_part_of');
    gdb.insert_edge('或', '口', 'contains');
    gdb.insert_edge('或', '域', 'is_part_of');
    gdb.insert_edge('或', '國', 'is_part_of');
    gdb.insert_edge('國', '或', 'contains');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.show_graph = function(gdb) {
    var edge, edge_count, node, ref, ref1;
    whisper('-'.repeat(108));
    ref = gdb.dba.query(SQL`select * from nodes order by id;`);
    for (node of ref) {
      urge('^3343^', node);
    }
    edge_count = 0;
    ref1 = gdb.dba.query(SQL`select * from edges order by source, target;`);
    for (edge of ref1) {
      edge_count++;
      urge('^3343^', edge);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_node_ids = function(gdb) {
    var d, ref, results;
    ref = gdb.dba.query(SQL`select id from nodes order by id;`);
    results = [];
    for (d of ref) {
      results.push(d.id);
    }
    return results;
  };

  this.get_edge_ids = function(gdb) {
    var d, ref, results;
    ref = gdb.dba.list(gdb.dba.query(SQL`select source, target from edges order by source, target;`));
    results = [];
    for (d of ref) {
      results.push([d.source, d.target]);
    }
    return results;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.reinitialize_db = function(gdb) {
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

}).call(this);

//# sourceMappingURL=test-helpers.js.map