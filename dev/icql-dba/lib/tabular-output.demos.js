(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, demo_intertext_tabulate, echo, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  // on_process_exit           = require 'exit-hook'
  // sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  demo_intertext_tabulate = function() {
    return new Promise((resolve, reject) => {
      var $, $drain, $watch, Dba, SP, TXT, db_path, dba, k, pipeline, ref, row, source;
      TXT = require('../../../apps/intertext');
      SP = require('../../../apps/steampipes');
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
      ref = dba.query(SQL`select * from dpan_tags limit 5;`);
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
    (async() => {
      return (await demo_intertext_tabulate());
    })();
  }

}).call(this);

//# sourceMappingURL=tabular-output.demos.js.map