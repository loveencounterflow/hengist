(function() {
  'use strict';
  var GUY, H, PATH, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/ADVANCED'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform = function(T, done) {
    var $window, Pipeline, add_up, collector, p, result, show;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline} = require('../../../apps/moonriver'));
    ({$window} = require('../../../apps/moonriver/lib/transforms'));
    collector = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    p.push($window(-2, +2, 0));
    p.push(show = function(d) {
      return urge('^45-1^', d);
    });
    // p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
    p.push(add_up = function(d, send) {
      return send((d[-2] + d[-1]) + d[0] + (d[+1] + d[+2]));
    });
    p.push(show = function(d) {
      return help('^45-2^', d);
    });
    result = p.run();
    info('^45-2^', result);
    if (T != null) {
      T.eq(result, [6, 10, 15, 20, 25, 30, 35, 30, 24]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @window_list_transform = ( T, done ) ->
  //   # T?.halt_on_error()
  //   GUY             = require '../../../apps/guy'
  //   { Pipeline
  //     transforms  } = require '../../../apps/moonriver'
  //   collector       = []
  //   p               = new Pipeline()
  //   #.........................................................................................................
  //   p.push [ 1 .. 9 ]
  //   p.push transforms.$window_list -2, +2, 0
  //   p.push show    = ( d        ) -> urge '^45-1^', d
  //   # p.push show    = ( d        ) -> urge ( d[ idx ] for idx in [ -2 .. +2 ] )
  //   p.push add_up  = ( d, send  ) -> send ( d[ -2 ] + d[ -1 ] ) + d[ 0 ] + ( d[ +1 ] + d[ +2 ] )
  //   p.push show    = ( d        ) -> help '^45-2^', d
  //   result = p.run()
  //   info '^45-2^', result
  //   T?.eq result, [ 6, 10, 15, 20, 25, 30, 35, 30, 24 ]
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this.use_sync_pipeline_as_segment = function(T, done) {
    var Pipeline, add, byline, count, enumerate, mul, result_1, result_2, show, trunk_1, trunk_2;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline} = require('../../../apps/moonriver'));
    count = 0;
    //.........................................................................................................
    byline = new Pipeline();
    byline.push(show = function(d) {
      return urge('^29-1^', d);
    });
    byline.push(add = function(d, send) {
      return send(d + 3);
    });
    byline.push(mul = function(d, send) {
      return send(d * 3);
    });
    byline.push(enumerate = function(d, send) {
      count++;
      send(count);
      return send(d * 3);
    });
    //.........................................................................................................
    trunk_1 = new Pipeline();
    trunk_1.push([1, 2, 3, 4, 5]);
    trunk_1.push(show = function(d) {
      return help('^29-2^', d);
    });
    trunk_1.push(byline);
    trunk_1.push(show = function(d) {
      return help('^29-3^', d);
    });
    //.........................................................................................................
    trunk_2 = new Pipeline();
    trunk_2.push([1, 2, 3, 4, 5]);
    trunk_2.push(show = function(d) {
      return help('^29-4^', d);
    });
    trunk_2.push(byline);
    trunk_2.push(show = function(d) {
      return help('^29-5^', d);
    });
    //.........................................................................................................
    result_1 = trunk_1.run();
    result_2 = trunk_2.run();
    urge('^29-6^', trunk_1);
    info('^29-7^', result_1);
    urge('^29-8^', trunk_2);
    info('^29-9^', result_2);
    if (T != null) {
      T.eq(result_1, [1, 36, 2, 45, 3, 54, 4, 63, 5, 72]);
    }
    if (T != null) {
      T.eq(result_2, [6, 36, 7, 45, 8, 54, 9, 63, 10, 72]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_async_pipeline_as_segment = async function(T, done) {
    var Async_pipeline, add, byline, count, enumerate, mul, result_1, result_2, show, trunk_1, trunk_2;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline} = require('../../../apps/moonriver'));
    count = 0;
    //.........................................................................................................
    byline = new Async_pipeline();
    byline.push(show = function(d) {
      return urge('^29-1^', d);
    });
    byline.push(add = function(d, send) {
      return send(d + 3);
    });
    byline.push(mul = function(d, send) {
      return send(d * 3);
    });
    byline.push(enumerate = function(d, send) {
      return GUY.async.after(0.01, function() {
        count++;
        send(count);
        return send(d * 3);
      });
    });
    //.........................................................................................................
    trunk_1 = new Async_pipeline();
    trunk_1.push([1, 2, 3, 4, 5]);
    trunk_1.push(show = function(d) {
      return help('^29-2^', d);
    });
    trunk_1.push(byline);
    trunk_1.push(show = function(d) {
      return help('^29-3^', d);
    });
    //.........................................................................................................
    trunk_2 = new Async_pipeline();
    trunk_2.push([1, 2, 3, 4, 5]);
    trunk_2.push(show = function(d) {
      return help('^29-4^', d);
    });
    trunk_2.push(byline);
    trunk_2.push(show = function(d) {
      return help('^29-5^', d);
    });
    //.........................................................................................................
    result_1 = (await trunk_1.run());
    result_2 = (await trunk_2.run());
    urge('^29-6^', trunk_1);
    info('^29-7^', result_1);
    urge('^29-8^', trunk_2);
    info('^29-9^', result_2);
    if (T != null) {
      T.eq(result_1, [1, 36, 2, 45, 3, 54, 4, 63, 5, 72]);
    }
    if (T != null) {
      T.eq(result_2, [6, 36, 7, 45, 8, 54, 9, 63, 10, 72]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @window_transform()
      // @use_pipeline_as_segment_preview()
      this.use_async_pipeline_as_segment();
      return test(this.use_async_pipeline_as_segment);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-advanced.js.map