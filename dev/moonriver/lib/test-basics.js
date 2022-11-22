(function() {
  'use strict';
  var CND, H, PATH, SQL, after, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOONRIVER/BASICS';

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

  after = (dts, f) => {
    return new Promise(function(resolve) {
      return setTimeout((function() {
        return resolve(f());
      }), dts * 1000);
    });
  };

  // #.........................................................................................................
  // probes_and_matchers = [
  //   ]
  // #.........................................................................................................
  // for [ probe, matcher, error, ] in probes_and_matchers
  //   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

  //-----------------------------------------------------------------------------------------------------------
  this.simple = function(T, done) {
    var Pipeline;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    (() => {      //.........................................................................................................
      var collector, p;
      collector = [];
      p = new Pipeline();
      p.push([1, 2, 3, 5]);
      p.push([6, 7, 8, 9].values());
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push(function(d, send) {
        return send(d); //; urge d
      });
      p.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      p.run();
      return T != null ? T.eq(collector, [2, 12, 4, 14, 6, 16, 10, 18]) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.simple_with_generatorfunction = function(T, done) {
    var Pipeline;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    (() => {      //.........................................................................................................
      var collector, p;
      collector = [];
      p = new Pipeline();
      p.push(function*(send) {
        var i, len, n, ref, results;
        ref = [1, 2, 3, 5];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          results.push((yield n));
        }
        return results;
      });
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push(function(d, send) {
        return send(d); //; urge d
      });
      p.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      p.run();
      return T != null ? T.eq(collector, [2, 4, 6, 10]) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.simple_with_generator = function(T, done) {
    var Pipeline;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    (() => {      //.........................................................................................................
      var collector, p;
      collector = [];
      p = new Pipeline();
      p.push((function*(send) {
        var i, len, n, ref, results;
        ref = [1, 2, 3, 5];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          results.push((yield n));
        }
        return results;
      })());
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push(function(d, send) {
        return send(d); //; urge d
      });
      p.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      p.run();
      return T != null ? T.eq(collector, [2, 4, 6, 10]) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["can access pipeline from within transform, get user area"] = function(T, done) {
    var Pipeline;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    (() => {      //.........................................................................................................
      var can_access_pipeline_1, can_access_pipeline_2, collector, has_user_area, p, pipeline;
      collector = [];
      pipeline = [
        ['^4564^'],
        function(d) {
          return urge(d);
        },
        //.....................................................................................................
        can_access_pipeline_1 = function(d) {
          if (this === p) {
            if (T != null) {
              T.ok(true);
            }
          } else {
            if (T != null) {
              T.fail("^478-1^ not ok");
            }
          }
          return null;
        },
        //.....................................................................................................
        can_access_pipeline_2 = function(d,
        send) {
          send(d);
          if (this === p) {
            if (T != null) {
              T.ok(true);
            }
          } else {
            if (T != null) {
              T.fail("^478-2^ not ok");
            }
          }
          return null;
        },
        //.....................................................................................................
        has_user_area = function(d,
        send) {
          send(d);
          if (isa.object(this.user)) {
            if (T != null) {
              T.ok(true);
            }
          } else {
            if (T != null) {
              T.fail("^478-3^ not ok");
            }
          }
          return null;
        }
      ];
      //.....................................................................................................
      p = new Pipeline(pipeline);
      debug('^558^', p);
      return p.run();
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_asyncgenerator_as_source = async function(T, done) {
    var Async_pipeline, GUY, async_show, async_square, count, p, result, source, sync_show, sync_square;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline} = require('../../../apps/moonriver'));
    count = 0;
    source = async function*() {
      var d, i, len, ref, results;
      ref = [3, 5, 7, 11];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push((await (yield d)));
      }
      return results;
    };
    //.......................................................................................................
    p = new Async_pipeline();
    p.push(source());
    p.push(sync_square = function(d, send) {
      return send(d * d);
    });
    p.push(sync_show = function(d) {
      return urge('^49-1^', d);
    });
    p.push(async_square = async function(d, send) {
      return (await after(0.05, function() {
        return send(d * d);
      }));
    });
    p.push(async_show = async function(d) {
      return (await after(0.05, function() {
        return urge('^49-1^', d);
      }));
    });
    //.........................................................................................................
    info('^3424^', p);
    result = (await p.run());
    if (T != null) {
      T.eq(result, [81, 625, 2401, 14641]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_asyncgeneratorfunction_as_source = async function(T, done) {
    var Async_pipeline, GUY, count, p, result, show, source, square;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline} = require('../../../apps/moonriver'));
    count = 0;
    source = async function*() {
      var d, i, len, ref, results;
      ref = [3, 5, 7, 11];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        d = ref[i];
        results.push((await (yield d)));
      }
      return results;
    };
    debug('^49-1^', source);
    debug('^49-1^', source());
    debug('^49-1^', source().next);
    //.......................................................................................................
    p = new Async_pipeline();
    p.push(source);
    p.push(square = function(d, send) {
      return send(d * d);
    });
    p.push(show = function(d) {
      return urge('^49-1^', d);
    });
    //.........................................................................................................
    result = (await p.run());
    info('^49-1^', result);
    if (T != null) {
      T.eq(result, [9, 25, 49, 121]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_asyncfunction_as_transform = async function(T, done) {
    var $, Async_pipeline, GUY, count, p, result, show;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline, $} = require('../../../apps/moonriver'));
    count = 0;
    //.......................................................................................................
    p = new Async_pipeline();
    p.push(Array.from('覚える'));
    p.push(async function(d, send) {
      return send((await after(0.1, function() {
        return `(${d})`;
      })));
    });
    p.push(show = function(d) {
      return urge('^49-1^', d);
    });
    //.........................................................................................................
    result = (await p.run());
    info('^49-1^', result);
    if (T != null) {
      T.eq(result, ['(覚)', '(え)', '(る)']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_walk_with_async_pipeline = async function(T, done) {
    var $, Async_pipeline, GUY, count, d, p, ref, result, show;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline, $} = require('../../../apps/moonriver'));
    count = 0;
    //.......................................................................................................
    p = new Async_pipeline();
    p.push(Array.from('覚える'));
    p.push(async function(d, send) {
      return send((await after(0.1, function() {
        return `(${d})`;
      })));
    });
    p.push(show = function(d) {
      return urge('^49-1^', d);
    });
    //.........................................................................................................
    result = [];
    ref = p.walk();
    for await (d of ref) {
      result.push(d);
    }
    info('^49-1^', result);
    if (T != null) {
      T.eq(result, ['(覚)', '(え)', '(る)']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_rundown = function(T, done) {
    var Pipeline, p, producer, sync_observer, sync_transducer;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    p = new Pipeline();
    if (T != null) {
      T.eq(p.types.type_of('abc'), 'text');
    }
    if (T != null) {
      T.eq(p.types.type_of(producer = function() {
        return 'def';
      }), 'producer_fitting');
    }
    if (T != null) {
      T.eq(p.types.type_of([1, 2]), 'list');
    }
    if (T != null) {
      T.eq(p.types.type_of([6, 7].values()), 'arrayiterator');
    }
    if (T != null) {
      T.eq(p.types.type_of({
        x: 42
      }), 'object');
    }
    if (T != null) {
      T.eq(p.types.type_of(new Map([[23, true]])), 'map');
    }
    if (T != null) {
      T.eq(p.types.type_of(new Set('xyz')), 'set');
    }
    if (T != null) {
      T.eq(p.types.type_of(sync_transducer = function(d, send) {
        return send(d);
      }), 'transducer_fitting');
    }
    if (T != null) {
      T.eq(p.types.type_of(sync_observer = function(d) {
        return info('^23-1^', d);
      }), 'observer_fitting');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.everything_sync = function(T, done) {
    var Pipeline, p, producer, result, sync_observer, sync_transducer;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    //.........................................................................................................
    p = new Pipeline();
    p.push('abc');
    p.push(producer = function() {
      return 'def';
    });
    p.push([1, 2]);
    p.push([6, 7].values());
    p.push({
      x: 42
    });
    p.push(new Map([[23, true]]));
    p.push(new Set('xyz'));
    p.push(sync_transducer = function(d, send) {
      return send(d);
    });
    p.push(sync_observer = function(d) {
      return info('^23-1^', d);
    });
    result = p.run();
    help('^23-2^', result);
    if (T != null) {
      T.eq(result, ['a', 'd', 1, 6, ['x', 42], [23, true], 'x', 'b', 'e', 2, 7, 'y', 'c', 'f', 'z']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.everything_async = async function(T, done) {
    var Async_pipeline, async_observer, async_transducer, p, producer, result, sync_observer, sync_transducer;
    // T?.halt_on_error()
    ({Async_pipeline} = require('../../../apps/moonriver'));
    //.........................................................................................................
    p = new Async_pipeline();
    p.push('abc');
    p.push(producer = function() {
      return 'def';
    });
    p.push([1, 2]);
    p.push([6, 7].values());
    p.push({
      x: 42
    });
    p.push(new Map([[23, true]]));
    p.push(new Set('xyz'));
    p.push(sync_transducer = function(d, send) {
      return send(d);
    });
    p.push(sync_observer = function(d) {
      return info('^23-3^', d);
    });
    p.push(async_transducer = async function(d, send) {
      return send((await after(0.01, function() {
        return d;
      })));
    });
    p.push(async_observer = async function(d) {
      return (await after(0.01, function() {
        return urge('^23-4^', d);
      }));
    });
    result = (await p.run());
    help('^23-5^', result);
    if (T != null) {
      T.eq(result, ['a', 'd', 1, 6, ['x', 42], [23, true], 'x', 'b', 'e', 2, 7, 'y', 'c', 'f', 'z']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @can_use_asyncgenerator_as_source()
      // await @can_use_asyncgeneratorfunction_as_source()
      // @simple()
      // @types_rundown()
      // test @types_rundown
      // @everything_sync()
      // @everything_async()
      // test @everything_sync
      // test @everything_async
      // test @can_use_asyncgenerator_as_source
      // test @can_use_asyncgeneratorfunction_as_source
      // @can_use_asyncfunction_as_transform()
      // test @can_use_asyncfunction_as_transform
      // @simple_with_generatorfunction()
      // test @simple_with_generatorfunction
      await this.can_use_walk_with_async_pipeline();
      return (await test(this.can_use_walk_with_async_pipeline));
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-basics.js.map