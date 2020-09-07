(function() {
  'use strict';
  var CND, badge, debug, echo, freeze, help, info, lets, rpr, test, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERTEXT-SPLITLINES/TESTS';

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

  //-----------------------------------------------------------------------------------------------------------
  // resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

  //-----------------------------------------------------------------------------------------------------------
  this["SPLITLINES basic"] = async function(T, done) {
    var SL, error, i, input, len, matcher, probes_and_matchers;
    // SL = require '../../../apps/mixa'
    SL = require('./main');
    //.........................................................................................................
    probes_and_matchers = [['a short text', ['a short text'], null], ["some\nlines\nof text", ['some', 'lines', 'of text'], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [input, matcher, error] = probes_and_matchers[i];
      await T.perform(input, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var ctx, probe, result;
          probe = Buffer.from(input);
          ctx = SL.new_context();
          result = SL.send(ctx, probe);
          result = result.concat(SL.end(ctx));
          return resolve(result);
        });
      });
    }
    done();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=main.tests.js.map