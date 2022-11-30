(function() {
  'use strict';
  var GUY, alert, debug, demo_1, demo_2, demo_3a, demo_3b, demo_4, demo_5, demo_6, demo_7, demo_pulling_data_from_pipelines_with_mpp, demo_tee, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Pipeline, p, plus_2, times_2, times_3;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    p = new Pipeline();
    p.push(times_2 = function(d, send) {
      if (types.isa.float(d)) {
        // send '('
        return send(d * 2);
      } else {
        // send ')'
        return send(d);
      }
    });
    p.push(plus_2 = function(d, send) {
      if (types.isa.float(d)) {
        // send '['
        return send(d + 2);
      } else {
        // send ']'
        return send(d);
      }
    });
    p.push(times_3 = function(d, send) {
      if (types.isa.float(d)) {
        // send '{'
        return send(d * 3);
      } else {
        // send '}'
        return send(d);
      }
    });
    p.send(1);
    p.send(2);
    p.send(3);
    // urge '^97-4^', d for d from p.walk()
    info('^97-4^', p.run());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var Pipeline, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    p = new Pipeline();
    // p.push 'AB'
    // p.push 'CD'
    // p.push [ 1, 2, 3, ]
    // p.push [ 4, 5, 6, ]
    p.push({
      one: 'cat',
      two: 'dog',
      three: 'pony'
    });
    p.push(new Set('+-*'));
    p.push(new Map([[11, 12], [13, 14]]));
    p.push('ABC');
    // p.push 'DEF'
    // p.push 'GHIJ'
    // # p.push show_1 = ( d, send ) -> whisper rpr d; send d
    p.push(show_2 = function(d) {
      return whisper(rpr(d));
    });
    p.send(0);
    p.send(1);
    p.send(2);
    info('^98-5^', p);
    info('^98-6^', p.run());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3a = async function() {
    var Async_pipeline, Pipeline, mul_3b, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline, Async_pipeline} = require('../../../apps/moonriver'));
    p = new Async_pipeline();
    p.push([1, 2, 3]);
    p.push(show_2 = function(d) {
      return whisper('Ⅱ', rpr(d));
    });
    p.push(mul_3b = function(d, send) {
      return send(new Promise(function(resolve) {
        return GUY.async.after(0.1, function() {
          return resolve(d * 3);
        });
      }));
    });
    p.push(show_2 = function(d) {
      return whisper('Ⅲ', rpr(d));
    });
    info('^23-1^', p);
    info('^23-4^', (await p.run()));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3b = async function() {
    var Async_pipeline, Async_segment, Pipeline, Segment, after, mul_3b, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline, Async_pipeline, Segment, Async_segment} = require('../../../apps/moonriver'));
    after = (dts, f) => {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(f());
        }), dts * 1000);
      });
    };
    p = new Async_pipeline();
    p.push([1, 2, 3]);
    p.push(show_2 = function(d) {
      return whisper('Ⅱ', rpr(d));
    });
    p.push(mul_3b = async function(d, send) {
      return send((await after(0.1, function() {
        return d * 3;
      })));
    });
    p.push(show_2 = function(d) {
      return whisper('Ⅲ', rpr(d));
    });
    info('^24-7^', p);
    info('^24-8^', (await p.run()));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_4 = function() {
    var Pipeline, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    p = new Pipeline();
    p.push(GUY.fs.walk_lines(__filename));
    p.push(show_2 = function(d) {
      return whisper('Ⅱ', rpr(d));
    });
    // p.push show_2 = ( d ) -> whisper 'Ⅲ', rpr d
    info('^24-7^', p);
    p.run();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_5 = async function() {
    var Async_pipeline, FS, PATH, T, get_source, p, path, show;
    echo('—————————————————————————————————————————————');
    FS = require('node:fs');
    PATH = require('node:path');
    ({
      Async_pipeline,
      transforms: T
    } = require('../../../apps/moonriver'));
    path = PATH.join(__dirname, '../../../assets/short-proposal.mkts.md');
    get_source = function() {
      return FS.createReadStream(path); //, { encoding: 'utf-8', }
    };
    p = new Async_pipeline();
    p.push(get_source());
    p.push(T.$split_lines());
    p.push(T.$limit(5));
    p.push(show = function(d) {
      return whisper('Ⅱ', rpr(d));
    });
    info('^24-7^', p);
    await p.run();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_6 = function() {
    var $, $collect, $with_stars, FS, Pipeline, T, collect, last, p, show;
    echo('—————————————————————————————————————————————');
    FS = require('node:fs');
    ({
      Pipeline,
      transforms: T
    } = require('../../../apps/moonriver'));
    p = new Pipeline();
    ({$} = p);
    last = Symbol('last');
    //.........................................................................................................
    $with_stars = function() {
      var with_stars;
      return with_stars = function(d, send) {
        debug('^4456546^', send);
        return send(`*${d}*`);
      };
    };
    //.........................................................................................................
    $collect = $({last}, collect = function() {
      var collector;
      collector = [];
      return function(d, send) {
        if (d === last) {
          return send(collector);
        }
        collector.push(d);
        return null;
      };
    });
    //.........................................................................................................
    info('^40-1^', $with_stars);
    info('^40-2^', $collect);
    //.........................................................................................................
    p.push(Array.from('氣場全開'));
    p.push($with_stars); // ()
    p.push(show = function(d) {
      return whisper(rpr(d));
    });
    p.run();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_7 = function() {
    var $, FS, Pipeline, T, last, p, show;
    echo('—————————————————————————————————————————————');
    FS = require('node:fs');
    ({
      Pipeline,
      transforms: T
    } = require('../../../apps/moonriver'));
    p = new Pipeline();
    ({$} = p);
    last = Symbol('last');
    //.........................................................................................................
    p.push([1]);
    p.push(function(d, send) {
      return send(d * 2);
    });
    p.push(show = function(d) {
      return info(d);
    });
    p.push(function(d) {
      if (d < 1e6) {
        return p.send(d);
      }
    });
    urge(p.run());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tee = function() {
    var $, FS, Pipeline, T, get_pipelines;
    echo('—————————————————————————————————————————————');
    FS = require('node:fs');
    ({
      Pipeline,
      transforms: T,
      $
    } = require('../../../apps/moonriver'));
    //.........................................................................................................
    get_pipelines = function() {
      var p, p_d3, p_nd3;
      p = new Pipeline();
      p_d3 = new Pipeline();
      p_nd3 = new Pipeline();
      p.push([...'abc', ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ...'def', ...[10, 11, 12, 13, 14, 15, 16, 17, 18, 19]]);
      // p.push show = ( d ) -> info 'input', d
      p.push(function(d, send) {
        var r;
        if (isa.nan((r = modulo(d, 3)))) {
          return send(d);
        }
        if (r === 0) {
          return p_d3.send(d);
        }
        return p_nd3.send(d);
      });
      // p.push      show = ( d ) -> whisper 'others', d
      // p_d3.push   show = ( d ) -> whisper 'd3', d
      // p_nd3.push  show = ( d ) -> whisper 'nd3', d
      return {p, p_d3, p_nd3};
    };
    (function() {      //.........................................................................................................
      var d3s, nd3s, others, p, p_d3, p_nd3;
      whisper('—————————————————————————————————————————————');
      ({p, p_d3, p_nd3} = get_pipelines());
      urge('others  ', others = p.run());
      urge('d3s     ', d3s = p_d3.run());
      urge('nd3s    ', nd3s = p_nd3.run());
      return null;
    })();
    (function() {      //.........................................................................................................
      var d, d3, nd3, p, p_d3, p_nd3, ref, ref1, ref2;
      whisper('—————————————————————————————————————————————');
      ({p, p_d3, p_nd3} = get_pipelines());
      ref = p.walk();
      for (d of ref) {
        info('p', d);
        ref1 = p_nd3.walk();
        for (nd3 of ref1) {
          help('nd3', nd3);
        }
        ref2 = p_d3.walk();
        for (d3 of ref2) {
          urge('d3', d3);
        }
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var d, pipelines, ref;
      whisper('—————————————————————————————————————————————');
      pipelines = get_pipelines();
      ref = Pipeline.walk_named_pipelines(pipelines);
      for (d of ref) {
        info(d);
      }
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_pulling_data_from_pipelines_with_mpp = function() {
    var $, FS, Pipeline, T, get_pipelines;
    echo('—————————————————————————————————————————————');
    FS = require('node:fs');
    ({
      Pipeline,
      transforms: T,
      $
    } = require('../../../apps/moonriver'));
    //.........................................................................................................
    get_pipelines = function() {
      var p_1, p_2, p_3;
      p_1 = new Pipeline();
      p_2 = new Pipeline();
      p_3 = new Pipeline();
      p_1.push('abcdef');
      p_2.push([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      // p_1.push ( d ) -> p_3.send d
      // p_2.push ( d ) -> p_3.send d
      p_3.push(function*() {
        var data, name, ref, results, x;
        ref = Pipeline.walk_named_pipelines({p_1, p_2});
        results = [];
        for (x of ref) {
          ({name, data} = x);
          results.push((yield data));
        }
        return results;
      });
      return {p_1, p_2, p_3};
    };
    (function() {      //.........................................................................................................
      var d, p_3, pipelines, ref;
      whisper('—————————————————————————————————————————————');
      pipelines = get_pipelines();
      ({p_3} = pipelines);
      ref = p_3.walk();
      for (d of ref) {
        info(d);
      }
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_1()
      // demo_2()
      // await demo_3a()
      // await demo_3b()
      // demo_4()
      // demo_5()
      // demo_6()
      // demo_7()
      // demo_tee()
      return demo_pulling_data_from_pipelines_with_mpp();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-ng.js.map