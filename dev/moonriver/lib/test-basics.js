(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
      var collector, mr;
      collector = [];
      mr = new Pipeline();
      mr.push([1, 2, 3, 5]);
      mr.push(function(d, send) {
        return send(d * 2);
      });
      mr.push(function(d, send) {
        return send(d); //; urge d
      });
      mr.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      mr.run();
      return T != null ? T.eq(collector, [2, 4, 6, 10]) : void 0;
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
      var collector, mr;
      collector = [];
      mr = new Pipeline();
      mr.push(function*(send) {
        var i, len, n, ref, results;
        ref = [1, 2, 3, 5];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          results.push((yield n));
        }
        return results;
      });
      mr.push(function(d, send) {
        return send(d * 2);
      });
      mr.push(function(d, send) {
        return send(d); //; urge d
      });
      mr.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      mr.run();
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
      var collector, mr;
      collector = [];
      mr = new Pipeline();
      mr.push((function*(send) {
        var i, len, n, ref, results;
        ref = [1, 2, 3, 5];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          n = ref[i];
          results.push((yield n));
        }
        return results;
      })());
      mr.push(function(d, send) {
        return send(d * 2);
      });
      mr.push(function(d, send) {
        return send(d); //; urge d
      });
      mr.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      mr.run();
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
      var can_access_pipeline_1, can_access_pipeline_2, collector, has_user_area, mr, pipeline;
      collector = [];
      pipeline = [
        ['^4564^'],
        function(d) {
          return urge(d);
        },
        //.....................................................................................................
        can_access_pipeline_1 = function(d) {
          if (this === mr) {
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
          if (this === mr) {
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
      mr = new Pipeline(pipeline);
      debug('^558^', mr);
      return mr.run();
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_asyncgenerator_as_source = async function(T, done) {
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
    p.push(source());
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
    var $, Async_pipeline, GUY, after, count, p, result, show;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Async_pipeline, $} = require('../../../apps/moonriver'));
    after = (dts, f) => {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(f());
        }), dts * 1000);
      });
    };
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
  this.can_use_nodejs_readable_stream_as_source = async function(T, done) {
    var Async_pipeline, FS, GUY, Pipeline, TF, get_source, matcher, path, result;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({
      Pipeline,
      Async_pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    FS = require('node:fs');
    path = PATH.join(__dirname, '../../../assets/short-proposal.mkts.md');
    get_source = function() {
      return FS.createReadStream(path); //, { encoding: 'utf-8', }
    };
    //.......................................................................................................
    matcher = (() => {
      var count, line, ref;
      count = 0;
      matcher = [];
      ref = GUY.fs.walk_lines(path);
      for (line of ref) {
        count++;
        if (count > 5) {
          continue;
        }
        info(count, rpr(line));
        matcher.push(line);
      }
      return matcher;
    })();
    //.......................................................................................................
    result = (await (async() => {
      var p, show;
      p = new Async_pipeline();
      debug('^34-2^', p);
      p.push(get_source());
      // p.push 'rtethg'
      p.push(TF.$split_lines());
      p.push(TF.$limit(5));
      p.push(show = function(d) {
        return urge('^34-3^', rpr(d));
      });
      return (await p.run());
    })());
    //.........................................................................................................
    if (T != null) {
      T.eq(result, matcher);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // await @can_use_asyncgenerator_as_source()
      // await @can_use_asyncgeneratorfunction_as_source()
      // test @can_use_asyncgenerator_as_source
      // test @can_use_asyncgeneratorfunction_as_source
      // @can_use_asyncfunction_as_transform()
      // test @can_use_asyncfunction_as_transform
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map