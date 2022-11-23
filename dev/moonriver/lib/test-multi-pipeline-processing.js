(function() {
  'use strict';
  var GUY, H, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/MULTI-PIPELINE-PROCESSING'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.walk_named_pipelines = function(T, done) {
    var $, Pipeline, first, get_pipelines, last;
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    get_pipelines = function() {
      var p_1, p_2, show;
      p_1 = new Pipeline();
      p_2 = new Pipeline();
      p_1.push([0, 1, 2, 3, 4, 5]);
      p_1.push($({first, last}, function(d, send) {
        return send(d);
      }));
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      p_1.push((function() {
        var count;
        count = 0;
        return function(d, send) {
          count++;
          if (modulo(count, 2) === 0) {
            return p_2.send(d);
          }
          return send(d);
        };
      })());
      p_1.push(show = function(d) {
        return urge('p_1', d);
      });
      p_2.push(show = function(d) {
        return warn('p_2', d);
      });
      return {p_1, p_2};
    };
    (function() {      //.........................................................................................................
      var d, p_1, p_2, ref, result;
      ({p_1, p_2} = get_pipelines());
      result = {
        even: [],
        odd: []
      };
      ref = Pipeline.walk_named_pipelines({
        odd: p_1,
        even: p_2
      });
      for (d of ref) {
        info(d);
        result[d.name].push(d.data);
      }
      if (T != null) {
        T.eq(result, {
          even: [0, 2, 4, last],
          odd: [first, 1, 3, 5]
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.async_walk_named_pipelines = async function(T, done) {
    var $, Async_pipeline, defer, first, get_pipelines, last;
    ({Async_pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    ({defer} = GUY.async);
    //.........................................................................................................
    get_pipelines = function() {
      var p_1, p_2, show;
      p_1 = new Async_pipeline();
      p_2 = new Async_pipeline();
      p_1.push([0, 1, 2, 3, 4, 5]);
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      p_1.push($({first, last}, async function(d, send) {
        return (await defer(function() {
          return send(d);
        }));
      }));
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      p_1.push((function() {
        var count;
        count = 0;
        return async function(d, send) {
          return (await defer(function() {
            count++;
            if (modulo(count, 2) === 0) {
              return p_2.send(d);
            }
            return send(d);
          }));
        };
      })());
      p_1.push(show = function(d) {
        return urge('p_1', d);
      });
      p_2.push(show = function(d) {
        return warn('p_2', d);
      });
      return {p_1, p_2};
    };
    await (async function() {      //.........................................................................................................
      var d, p_1, p_2, ref, result;
      ({p_1, p_2} = get_pipelines());
      result = {
        even: [],
        odd: []
      };
      ref = Async_pipeline.walk_named_pipelines({
        odd: p_1,
        even: p_2
      });
      for await (d of ref) {
        info(d);
        result[d.name].push(d.data);
      }
      if (T != null) {
        T.eq(result, {
          even: [0, 2, 4, last],
          odd: [first, 1, 3, 5]
        });
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // @walk_named_pipelines_1()
      // await @async_walk_named_pipelines()
      // test @walk_named_pipelines
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-multi-pipeline-processing.js.map