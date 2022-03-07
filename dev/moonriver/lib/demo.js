(function() {
  'use strict';
  var $, CND, GUY, Moonriver, badge, debug, demo, demo_2, demo_3, demo_4, echo, help, info, isa, rpr, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MINIMAL';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  GUY = require('guy');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types);

  ({Moonriver} = require('../../../apps/moonriver'));

  ({$} = Moonriver);

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var $add_call_count, $addsome, $embellish, $generator, $show, $source_A, $source_B, drive, pipeline, trace;
    //.........................................................................................................
    $source_A = function(a_list) {
      var source;
      return source = function(d, send) {
        var e, i, len;
        send(d);
        for (i = 0, len = a_list.length; i < len; i++) {
          e = a_list[i];
          if (trace) {
            help('^source A^', e);
          }
          send(e);
        }
        send.over();
        return null;
      };
    };
    //.........................................................................................................
    $source_B = function(a_list) {
      var idx, last_idx, source;
      last_idx = a_list.length - 1;
      idx = -1;
      return source = function(d, send) {
        send(d);
        idx++;
        if (idx > last_idx) {
          idx = -1;
          return send.over();
        }
        if (trace) {
          help('^source B^', a_list[idx]);
        }
        send(a_list[idx]);
        return null;
      };
    };
    //.........................................................................................................
    $addsome = function() {
      var addsome;
      return addsome = function(d, send) {
        if (trace) {
          help('^addsome^', d);
        }
        if (!isa.float(d)) {
          return send((rpr(d)) + ' * 100 + 1');
        }
        send(d * 100 + 1);
        return null;
      };
    };
    //.........................................................................................................
    $embellish = function() {
      var embellish;
      return embellish = function(d, send) {
        if (trace) {
          help('^embellish^', d);
        }
        send(`*${rpr(d)}*`);
        return null;
      };
    };
    //.........................................................................................................
    $show = function() {
      var show;
      return show = function(d, send) {
        if (trace) {
          help('^show^', d);
        }
        info(d);
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    $generator = function() {
      return function*() {
        yield 22;
        yield 33;
        return null;
      };
    };
    //.........................................................................................................
    $add_call_count = function() {
      return function(d, send) {
        urge('^449^', send.call_count, d);
        return send(isa.float ? send.call_count * 10_000 + d : d);
      };
    };
    //.........................................................................................................
    pipeline = [];
    // pipeline.push $source_A [ 1, 2, 3, ]
    // pipeline.push $source_B [ 1, 2, ]
    pipeline.push([1, 2]);
    pipeline.push(['A', 'B']);
    pipeline.push(['C', 'D', 'E'].values());
    pipeline.push((new Map([['a', 42]])).entries());
    pipeline.push($generator());
    pipeline.push($add_call_count());
    pipeline.push($addsome());
    pipeline.push($embellish());
    pipeline.push($show());
    trace = false;
    drive = function(mode) {
      var _, i, len, mr, ref, results;
      mr = new Moonriver(pipeline);
      ref = [1, 2];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        _ = ref[i];
        if (!mr.can_repeat()) {
          warn("not repeatable");
          break;
        }
        whisper('————————————————————————————————————————');
        results.push(mr.drive({mode}));
      }
      return results;
    };
    drive('breadth');
    drive('depth');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var collect, collector, d, mr1, mr2, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    //.........................................................................................................
    mr1.push([1, 5]);
    mr1.push([2, 6]);
    mr1.push([3, 7, 9]);
    mr1.push(function(d, send) {
      send('abcdefghi'[d - 1]);
      return send(d);
    });
    mr1.push([4, 8]);
    // mr1.push ( d ) -> yield e for e in Array.from 'abc'
    // mr1.push show      = ( d ) -> help CND.reverse '^332-1^', d
    mr1.push(show = function(d) {
      return help(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    // mr1.push tee      = ( d, send ) -> mr2.send d; send d
    // mr1.push multiply = ( d, send ) -> send d * 100
    // mr1.push tee      = ( d, send ) -> mr2.send d; send d
    // mr1.push show     = ( d ) -> urge CND.reverse '^332-2^', d
    // #.........................................................................................................
    // mr2.push add      = ( d, send ) -> send d + 300
    // mr2.push show     = ( d ) -> info CND.reverse '^332-3^', d
    // #.........................................................................................................
    // mr1.drive()
    /* can send additional inputs: */
    help('^343-1^', mr1);
    help('^343-2^', mr2);
    //.........................................................................................................
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3 = function() {
    var collect, collector, d, mr1, mr2, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    //.........................................................................................................
    mr1.push([1, 2, 3]);
    mr1.push(function(d, send) {
      // send d
      send(d + 10);
      return send(d + 100);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return whisper(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(function(d, send) {
      send(d);
      return send(d + 20);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return warn(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(function(d, send) {
      send(d);
      return send(d + 30);
    });
    //.........................................................................................................
    mr1.push(show = function(d) {
      return help(CND.reverse(` ${rpr(d)} `));
    });
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_4 = function() {
    var $function_as_source, collect, collector, d, fas_idx, mr1, mr2, oal, show;
    collector = [];
    mr1 = new Moonriver();
    mr2 = new Moonriver();
    fas_idx = 0;
    //.........................................................................................................
    $function_as_source = function() {
      var fas, values;
      values = Array.from('abc');
      return fas = function(d, send) {
        var e;
        // debug '^3439^', fas_idx, d
        send(d);
        if ((e = values[fas_idx]) != null) {
          send(e);
        } else {
          send.over();
        }
        fas_idx++;
        return null;
      };
    };
    //.........................................................................................................
    // mr1.push $ { is_source: true, }, $function_as_source()
    // mr1.push show = ( d ) -> help CND.gold CND.reverse " #{rpr d} "
    mr1.push([1, 4, 7]);
    // # mr1.push show = ( d ) -> help CND.blue CND.reverse " #{rpr d} "
    mr1.push([2, 5, 8]);
    // # mr1.push show = ( d ) -> help CND.lime CND.reverse " #{rpr d} "
    mr1.push($({
      once_after_last: true
    }, oal = function(d, send) {
      debug(CND.reverse('^398^', d));
      send(10);
      send(11);
      return send(12);
    }));
    mr1.push([3, 6, 9]);
    mr1.push(show = function(d) {
      return help(CND.grey(CND.reverse(` ${rpr(d)} `)));
    });
    //.........................................................................................................
    mr1.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    urge('^343-5^', mr1);
    mr1.drive({
      mode: 'depth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    collector.length = 0;
    fas_idx = 0;
    whisper('-----------------------------------');
    mr1.drive({
      mode: 'breadth'
    });
    urge('^343-3^', ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        results.push(d.toString());
      }
      return results;
    })()).join(' '));
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // demo()
      // demo_2()
      // demo_3()
      return demo_4();
    })();
  }

}).call(this);

//# sourceMappingURL=demo.js.map