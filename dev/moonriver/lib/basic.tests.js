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
  this.can_use_function_without_arguments_as_source = function(T, done) {
    var GUY, Pipeline, extra, p, result_1, result_2, show, signals;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, signals} = require('../../../apps/moonriver'));
    //.........................................................................................................
    p = new Pipeline();
    p.push(function() {
      return 'abcdef';
    });
    // p.push insert   = ( d, send ) -> send d; send d.toUpperCase() if isa.text d
    p.push(extra = function(d, send) {
      return send(`*${d}*`);
    });
    p.push(show = function(d) {
      return whisper('^45-1^', d);
    });
    //.........................................................................................................
    result_1 = p.run();
    result_2 = p.run();
    return null;
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
      // await @can_use_asyncgenerator_as_source()
      // await @can_use_asyncgeneratorfunction_as_source()
      // test @can_use_asyncgenerator_as_source
      // test @can_use_asyncgeneratorfunction_as_source
      // @can_use_asyncfunction_as_transform()
      // test @can_use_asyncfunction_as_transform
      // @window_transform()
      // @run_and_walk_are_repeatable()
      // test @run_and_walk_are_repeatable
      this.can_use_function_without_arguments_as_source();
      return test(this.can_use_function_without_arguments_as_source);
    })();
  }

  // @repeatable_and_nonrepeatable_sources()
// test @repeatable_and_nonrepeatable_sources
// @run_and_walk_throw_error_on_repeating_nonrepeatable()
// test @run_and_walk_throw_error_on_repeating_nonrepeatable
// test @
// @[ "called even when pipeline empty: once_before_first, once_after_last" ](); test @[ "called even when pipeline empty: once_before_first, once_after_last" ]
// @[ "appending data before closing" ](); test @[ "appending data before closing" ]
// @[ "once_before_first, once_after_last transformers transparent to data" ](); test @[ "once_before_first, once_after_last transformers transparent to data" ]

}).call(this);

//# sourceMappingURL=basic.tests.js.map