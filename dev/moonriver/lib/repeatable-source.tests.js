(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOONRIVER/TESTS/REPEATABLE';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

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
    var GUY, Pipeline, extra, on_after_process, on_after_step, on_before_process, on_before_step, p, result_1, result_2, show, signals;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, signals} = require('../../../apps/moonriver'));
    //.........................................................................................................
    on_before_process = null;
    on_before_step = null;
    on_after_step = null;
    on_after_process = null;
    // on_before_process = -> help '^98-1^', @
    // on_after_process  = -> warn '^98-2^', @
    // on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
    // on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    //.........................................................................................................
    p.push(function() {
      return 'abcdef';
    });
    // p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
    p.push(extra = function(d, send) {
      return send(`*${d}*`);
    });
    p.push(show = function(d) {
      return whisper('^98-5^', d);
    });
    //.........................................................................................................
    result_1 = p.run();
    urge('^98-1^', result_1);
    result_2 = p.run();
    urge('^98-1^', result_2);
    if (T != null) {
      T.eq(result_1, result_2);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_and_walk_are_repeatable = function(T, done) {
    var $, GUY, Pipeline, extra, p, show, signals, source;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, $, signals} = require('../../../apps/moonriver'));
    // first           = Symbol 'first'
    // last            = Symbol 'last'
    //.........................................................................................................
    p = new Pipeline();
    source = 'abcdef';
    // source          = Array.from 'abcdef'
    p.push(source);
    // p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
    p.push(extra = function(d, send) {
      return send(`*${d}*`);
    });
    p.push(show = function(d) {
      return whisper('^45-1^', d);
    });
    //.........................................................................................................
    debug('^54-1^', p);
    debug('^54-2^', p.segments[0]);
    if (T != null) {
      T.eq(type_of(signals), 'object');
    }
    if (T != null) {
      T.eq(type_of(signals.reset), 'symbol');
    }
    if (T != null) {
      T.eq(type_of(signals.ok), 'symbol');
    }
    if (T != null) {
      T.eq(type_of(p.reset), 'function');
    }
    debug('^54-3^', p.reset());
    if (T != null) {
      T.eq(p.reset(), null);
    }
    (function() {      //.........................................................................................................
      var result_1, result_2;
      result_1 = p.run();
      result_2 = p.run();
      info('^54-4^', result_1);
      info('^54-5^', result_2);
      if (T != null) {
        T.eq(result_1, result_2);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var result_1, result_2;
      result_1 = [...p.walk()];
      result_2 = [...p.walk()];
      info('^54-6^', result_1);
      info('^54-7^', result_2);
      if (T != null) {
        T.eq(result_1, result_2);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.run_and_walk_throw_error_on_repeating_nonrepeatable = function(T, done) {
    var $, GUY, Pipeline, get_pipeline, signals;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, $, signals} = require('../../../apps/moonriver'));
    // first           = Symbol 'first'
    // last            = Symbol 'last'
    //.........................................................................................................
    get_pipeline = function() {
      var extra, p, show;
      p = new Pipeline();
      p.push((function*() {
        var chr, i, len, ref, results;
        ref = 'abcdef';
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          chr = ref[i];
          results.push((yield chr));
        }
        return results;
      })());
      // p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
      p.push(extra = function(d, send) {
        return send(`*${d}*`);
      });
      p.push(show = function(d) {
        return whisper('^45-1^', d);
      });
      return p;
    };
    (function() {      //.........................................................................................................
      var p, result_1;
      p = get_pipeline();
      result_1 = p.run();
      if (T != null) {
        T.throws(/source.*not repeatable/, function() {
          var result_2;
          return result_2 = p.run();
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.repeatable_and_nonrepeatable_sources = function(T, done) {
    var GUY, Pipeline, get_pipeline;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline} = require('../../../apps/moonriver'));
    //.........................................................................................................
    get_pipeline = function(source) {
      var p, show;
      p = new Pipeline();
      p.push(source);
      p.push(show = function(d) {
        return whisper('^47-1^', d);
      });
      return p;
    };
    (function() {      //.........................................................................................................
      var p, result_1, result_2;
      p = get_pipeline('abcdef');
      result_1 = p.run();
      result_2 = p.run();
      if (T != null) {
        T.eq(result_1, result_2);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var p, result_1, result_2;
      p = get_pipeline(function*() {
        var chr, ref, results;
        ref = Array.from('abcdef');
        results = [];
        for (chr of ref) {
          results.push((yield chr));
        }
        return results;
      });
      result_1 = p.run();
      result_2 = p.run();
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
      // @can_use_function_without_arguments_as_source()
      return test(this.can_use_function_without_arguments_as_source);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=repeatable-source.tests.js.map