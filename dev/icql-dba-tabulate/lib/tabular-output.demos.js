(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, demo_intertext_tabulate_1, demo_intertext_tabulate_2, demo_intertext_tabulate_3, echo, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/DEMOS/TABULATE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  // test                      = require '../../../apps/guy-test'
  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  // on_process_exit           = require 'exit-hook'
  // sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  SQL = String.raw;

  H = {
    icql_dba_path: '../../../apps/icql-dba'
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_intertext_tabulate_3 = function() {
    return new Promise((resolve, reject) => {
      var Dba, Dbatbl, db_path, dba, dbatbl, line, ref;
      ({Dbatbl} = require('../../../apps/icql-dba-tabulate'));
      ({Dba} = require(H.icql_dba_path));
      db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
      urge(`^487^ using DB at ${db_path}`);
      dba = new Dba();
      dba.open({
        path: db_path
      });
      dbatbl = new Dbatbl({dba});
      ref = dbatbl.walk_relation_lines('dpan_tags');
      for (line of ref) {
        echo(CND.lime(line));
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_intertext_tabulate_2 = function() {
    return new Promise((resolve, reject) => {
      var Dba, Dbatbl, db_path, dba, dbatbl, query;
      ({Dbatbl} = require('../../../apps/icql-dba-tabulate'));
      ({Dba} = require(H.icql_dba_path));
      db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
      urge(`^487^ using DB at ${db_path}`);
      dba = new Dba();
      dba.open({
        path: db_path
      });
      dbatbl = new Dbatbl({dba});
      query = dba.query(SQL`select * from dpan_tags limit 500;`);
      urge('^337^', dbatbl.tabulate(query));
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_intertext_tabulate_1 = function() {
    return new Promise((resolve, reject) => {
      var $, $drain, $watch, Dba, db_path, dba, k, pipeline, ref, row, source;
      ({Dba} = require(H.icql_dba_path));
      db_path = PATH.resolve(PATH.join(__dirname, '../../../data/dpan.sqlite'));
      urge(`^487^ using DB at ${db_path}`);
      dba = new Dba();
      dba.open({
        path: db_path
      });
      ({$, $watch, $drain} = SP.export());
      debug('^363^', (function() {
        var results;
        results = [];
        for (k in TXT.TBL) {
          results.push(k);
        }
        return results;
      })());
      debug('^363^', TXT.TBL);
      source = SP.new_push_source();
      pipeline = [];
      pipeline.push(source);
      pipeline.push(TXT.TBL.$tabulate({
        multiline: false
      }));
      // pipeline.push TXT.TBL.$tabulate { multiline: false, width: 30, }
      pipeline.push($(function(d, send) {
        return send(d.text);
      }));
      pipeline.push($watch(function(d) {
        return echo(d);
      }));
      pipeline.push($drain(function(result) {
        return resolve(result);
      }));
      SP.pull(...pipeline);
      ref = dba.query(SQL`select * from dpan_tags limit 500;`);
      for (row of ref) {
        // debug '^448^', row
        source.send(row);
      }
      source.end();
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await demo_intertext_tabulate_1()
      // demo_intertext_tabulate_2()
      return demo_intertext_tabulate_3();
    })();
  }

}).call(this);

//# sourceMappingURL=tabular-output.demos.js.map