(function() {
  'use strict';
  var $, $drain, $one_to_ten, $show, $watch, CND, SP, badge, debug, demo, echo, freeze, help, info, lets, rpr, test, types, urge, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/STEAMGEARS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // _strip_ansi               = require 'strip-ansi'
  types = new (require('intertype')).Intertype();

  ({freeze, lets} = require('letsfreezethat'));

  //...........................................................................................................
  SP = require('../../../apps/steampipes');

  ({$, $show, $watch, $drain} = SP.export());

  //-----------------------------------------------------------------------------------------------------------
  // resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

  //-----------------------------------------------------------------------------------------------------------
  $one_to_ten = function(counters, name, source = null) {
    if (counters[name] == null) {
      counters[name] = 0;
    }
    return $((d, send) => {
      send(d);
      switch (d) {
        case '+':
          counters[name]++;
          break;
        case '-':
          counters[name]--;
          break;
        case '0':
          null;
          break;
        default:
          throw new Error(`^354^ unknown key ${rpr(d)}`);
      }
      if (modulo(counters[name], 10) === 0) {
        counters[name] = 0;
        if (source != null) {
          source.send('+');
        }
      }
      return null;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    return new Promise((resolve, reject) => {
      var counters, i, j, pipeline_1, pipeline_2, pipeline_3, source_1, source_2, source_3;
      counters = {};
      pipeline_1 = [];
      pipeline_2 = [];
      pipeline_3 = [];
      source_1 = SP.new_push_source();
      source_2 = SP.new_push_source();
      source_3 = SP.new_push_source();
      //.........................................................................................................
      pipeline_1.push(source_1);
      pipeline_1.push($(function(d, send) {
        return send('+');
      }));
      pipeline_1.push($one_to_ten(counters, 'd0', source_2));
      pipeline_1.push($watch(function(d) {
        return whisper(counters);
      }));
      pipeline_1.push($drain(function() {
        return resolve();
      }));
      SP.pull(...pipeline_1);
      //.........................................................................................................
      pipeline_2.push(source_2);
      pipeline_2.push($one_to_ten(counters, 'd1', source_3));
      pipeline_2.push($watch(function(d) {
        return urge('d1', d);
      }));
      pipeline_2.push($drain());
      SP.pull(...pipeline_2);
      //.........................................................................................................
      pipeline_3.push(source_3);
      pipeline_3.push($one_to_ten(counters, 'd2', null));
      pipeline_3.push($watch(function(d) {
        return help('d2', d);
      }));
      pipeline_3.push($drain());
      SP.pull(...pipeline_3);
//.........................................................................................................
      for (i = j = 1; j <= 200; i = ++j) {
        source_1.send(null);
      }
      return null;
    });
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=steamgears.js.map