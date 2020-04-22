(function() {
  'use strict';
  var CND, INTERTEXT, JAKE, after, alert, assign, badge, debug, defer, desc, echo, help, info, invoke, jr, rpr, sh, task, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'JAKE-DEMO';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  defer = setImmediate;

  //...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   cast
  //   type_of }               = types
  JAKE = require('jake');

  ({desc, task} = JAKE);

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  sh = require('exec-sh');

  //-----------------------------------------------------------------------------------------------------------
  invoke = function(name, ...P) {
    return JAKE.Task[name].invoke();
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  desc("whatever");

  task('default', function(...P) {
    return new Promise((resolve) => {
      var i, k, len, ref;
      info('^787^', rpr(P));
      ref = ((function() {
        var results;
        results = [];
        for (k in JAKE.Task) {
          results.push(k);
        }
        return results;
      })()).sort();
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        urge('^787^', k);
      }
      return resolve(42);
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("demo async");

  task('demo_async', ['default'], function() {
    return new Promise((resolve) => {
      info("demo_async");
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("demo sync");

  task('demo_sync', function() {
    info("demo_sync");
    return null;
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("install all npm dependencies");

  task('intershop_npm_install', function() {
    return new Promise((resolve) => {
      // sh 'ls -AlF'
      sh(`( cd intershop && npm install && npm audit )`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("devcycle");

  task('devcycle', [], function() {
    return new Promise((resolve) => {
      // sh 'ls -AlF'
      sh(`( cd ~/jzr/intershop && coffee --map -o intershop_modules -c intershop_modules )`);
      sh(`peru sync`);
      sh(`intershop refresh-mirage-datasources`);
      sh(`intershop psql -c "select * from MIRAGE.mirror order by dsk, dsnr, linenr;`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("demo command");

  task('f', [], function() {
    return new Promise((resolve) => {
      debug('^33365^', process.argv);
      invoke('default', 42);
      // process.argv.pop()
      // debug '^33365^', process.argv
      return resolve();
    });
  });

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await @benchmark()
      return null;
    })();
  }

}).call(this);
