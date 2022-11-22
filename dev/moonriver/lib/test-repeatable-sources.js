(function() {
  'use strict';
  var GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/REPEATABLE-SOURCES'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_function_without_arguments_as_source = function(T, done) {
    var Pipeline, extra, p, result_1, result_2, show, signals;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, signals} = require('../../../apps/moonriver'));
    //.........................................................................................................
    p = new Pipeline();
    p.push(function() {
      return 'abcdef';
    });
    p.push(extra = function(d, send) {
      return send(`*${d}*`);
    });
    p.push(show = function(d) {
      return whisper('^98-1^', d);
    });
    //.........................................................................................................
    urge('^98-2^', result_1 = p.run());
    urge('^98-3^', result_2 = p.run());
    if (T != null) {
      T.eq(result_1, result_2);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_and_walk_are_repeatable = function(T, done) {
    var $, Pipeline, extra, p, show, signals, source;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, $, signals} = require('../../../apps/moonriver'));
    // first           = Symbol 'first'
    // last            = Symbol 'last'
    //.........................................................................................................
    p = new Pipeline();
    source = function*() {
      var n, ref, results;
      ref = [1, 2, 3, 4, 5];
      results = [];
      for (n of ref) {
        results.push((yield n));
      }
      return results;
    };
    // source          = ( -> yield n for n from [ 1 .. 5 ] )()
    // p.push source
    p.push(function() {
      return source;
    });
    // p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
    p.push(extra = function(d, send) {
      return send(`*${d}*`);
    });
    p.push(show = function(d) {
      return whisper('^54-1^', d);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(signals), 'undefined');
    }
    if (T != null) {
      T.eq(type_of(p.reset), 'undefined');
    }
    (function() {      //.........................................................................................................
      var result_1, result_2;
      result_1 = p.run();
      result_2 = p.run();
      info('^54-2^', result_1);
      info('^54-3^', result_2);
      if (T != null) {
        T.eq(result_1, result_2);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var result_1, result_2;
      result_1 = [...p.walk()];
      result_2 = [...p.walk()];
      info('^54-4^', result_1);
      info('^54-5^', result_2);
      if (T != null) {
        T.eq(result_1, result_2);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      this.can_use_function_without_arguments_as_source();
      return test(this.can_use_function_without_arguments_as_source);
    })();
  }

  // @run_and_walk_are_repeatable()
// test @run_and_walk_are_repeatable
// test @

}).call(this);

//# sourceMappingURL=test-repeatable-sources.js.map