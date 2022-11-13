(function() {
  'use strict';
  var GUY, alert, debug, demo_1, demo_2, demo_3a, demo_3b, demo_4, demo_5, demo_6, echo, help, info, inspect, isa, log, plain, praise, rpr, type_of, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/NG'));

  ({rpr, inspect, echo, log} = GUY.trm);

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, type_of} = types);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Pipeline, on_after_process, on_after_step, on_before_process, on_before_step, p, plus_2, times_2, times_3;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    on_before_process = function() {
      return help('^97-1^', this);
    };
    on_after_process = function() {
      return warn('^97-2^', this);
    };
    on_before_step = function(sidx) {
      return urge('^97-3^', sidx, this);
    };
    on_after_step = function(sidx) {
      return urge('^97-4^', sidx, this);
    };
    on_before_step = null;
    // on_after_step     = null
    on_after_process = null;
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
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
    var Pipeline, on_after_process, on_after_step, on_before_process, on_before_step, p, show_2;
    echo('—————————————————————————————————————————————');
    ({Pipeline} = require('../../../apps/moonriver'));
    on_before_process = null;
    on_before_step = null;
    on_after_step = null;
    on_after_process = null;
    // on_before_process = -> help '^98-1^', @
    // on_after_process  = -> warn '^98-2^', @
    // on_before_step    =  ( sidx ) -> urge '^98-3^', sidx, @
    // on_after_step     =  ( sidx ) -> urge '^98-4^', sidx, @
    p = new Pipeline({on_before_process, on_before_step, on_after_step, on_after_process});
    // p = new Pipeline()
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
    var $, $collect, $with_stars, FS, Pipeline, T, collect, last, p, show, with_stars;
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
    $with_stars = $(with_stars = function(d, send) {
      debug('^4456546^', send);
      return send(`*${d}*`);
    });
    //.........................................................................................................
    $collect = $(collect = {last}, function() {
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

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo_1()
      // demo_2()
      // await demo_3a()
      // await demo_3b()
      // demo_4()
      return demo_5();
    })();
  }

  // demo_6()

}).call(this);

//# sourceMappingURL=demo-ng.js.map