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
      var firstlast, p_1, p_2, show;
      p_1 = new Async_pipeline({
        protocol: true
      });
      p_2 = new Async_pipeline({
        protocol: true
      });
      p_1.push([0, 1, 2, 3, 4, 5]);
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      p_1.push($({first, last}, firstlast = async function(d, send) {
        return (await defer(function() {
          return send(d);
        }));
      }));
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      p_1.push((function() {
        var count, divert;
        count = 0;
        return divert = async function(d, send) {
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
      H.tabulate("async_walk_named_pipeline 1", p_1.journal);
      H.tabulate("async_walk_named_pipeline 2", p_2.journal);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.diverted_pipelines = function(T, done) {
    var $, Pipeline, first, get_pipelines, last;
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    get_pipelines = function() {
      var diverter, firstlast, p_1, p_2, receiver, show, square;
      p_1 = new Pipeline({
        protocol: true
      });
      p_2 = new Pipeline({
        protocol: true
      });
      //.......................................................................................................
      p_1.push([0, 1, 2, 3, 4, 5]);
      p_1.push($({first, last}, firstlast = function(d, send) {
        return send(d);
      }));
      p_1.push(diverter = function(d, send) {
        return p_2.send(d);
      });
      p_1.push(receiver = function(d, send) {
        return send(d);
      });
      p_1.push(show = function(d) {
        return whisper('input', d);
      });
      //.......................................................................................................
      p_2.push(square = function(d, send) {
        return send(isa.symbol(d) ? d : d ** 2);
      });
      p_2.push(diverter = function(d, send) {
        return p_1.segments[3].send(d);
      });
      //.......................................................................................................
      return {p_1, p_2};
    };
    (function() {      //.........................................................................................................
      var d, p_1, p_2, ref, result;
      ({p_1, p_2} = get_pipelines());
      result = {
        p_1: [],
        p_2: []
      };
      info('^77-1^', p_1);
      info('^77-1^', p_2);
      ref = Pipeline.walk_named_pipelines({p_1, p_2});
      for (d of ref) {
        info(d);
        result[d.name].push(d.data);
      }
      if (T != null) {
        T.eq(result, {
          p_1: [first, 0, 1, 4, 9, 16, 25, last],
          p_2: []
        });
      }
      H.tabulate("diverted_pipeline 1", p_1.journal);
      H.tabulate("diverted_pipeline 2", p_2.journal);
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @walk_named_pipelines_1()
      // await @async_walk_named_pipelines()
      return test(this.async_walk_named_pipelines);
    })();
  }

  // test @walk_named_pipelines
// @diverted_pipelines()
// test @diverted_pipelines
// await test @

}).call(this);

//# sourceMappingURL=test-multi-pipeline-processing.js.map