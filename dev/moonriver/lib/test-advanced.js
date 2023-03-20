(async function() {
  'use strict';
  var $as_keysorted_list, GUY, H, PATH, alert, as_keysorted_list, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  GUY = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  $as_keysorted_list = function() {
    return (d, send) => {
      return send(as_keysorted_list(d));
    };
  };

  as_keysorted_list = function(d) {
    var key, keys;
    keys = (Object.keys(d)).sort(function(a, b) {
      a = parseInt(a, 10);
      b = parseInt(b, 10);
      if (a > b) {
        return +1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(d[key]);
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_sync_pipeline_as_segment = function(T, done) {
    var Pipeline, TF, add, byline, count, enumerate, mul, result_1, show, trunk_1;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    count = 0;
    //.........................................................................................................
    byline = new Pipeline({
      protocol: true
    });
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
    // byline.push TF.$collect()
    //.........................................................................................................
    trunk_1 = new Pipeline({
      protocol: true
    });
    trunk_1.push([1, 2, 3, 4, 5]);
    trunk_1.push(show = function(d) {
      return help('^29-2^', d);
    });
    trunk_1.push(byline);
    trunk_1.push(show = function(d) {
      return help('^29-3^', d);
    });
    //.........................................................................................................
    // trunk_2               = new Pipeline { protocol: true, }
    // trunk_2.push [ 1 .. 5 ]
    // trunk_2.push show     = ( d ) -> help '^29-4^', d
    // trunk_2.push byline
    // trunk_2.push show     = ( d ) -> help '^29-5^', d
    // #.........................................................................................................
    // result_1              = []
    // step_count            = 0
    // for d from trunk_1.walk()
    //   info '^29-1^', d
    //   result_1.push d
    //   step_count++
    //   break if step_count > 3
    result_1 = trunk_1.run();
    H.tabulate("sync_pipeline_as_segment t1", trunk_1.journal);
    // debug '^57-2^'
    // result_2              = trunk_2.run()
    urge('^29-6^', trunk_1);
    info('^29-7^', result_1);
    // urge '^29-8^', trunk_2
    // info '^29-9^', result_2
    if (T != null) {
      T.eq(result_1, [1, 36, 2, 45, 3, 54, 4, 63, 5, 72]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.segment_pipelines_can_be_nested = function(T, done) {
    var Pipeline, TF;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    (function() {      //.........................................................................................................
      var join, outer, result, show, uppercase;
      outer = new Pipeline();
      //.......................................................................................................
      outer.push('abcde');
      //.......................................................................................................
      outer.push(uppercase = function(d, send) {
        return send(d.toUpperCase());
      });
      outer.push(show = function(d) {
        return whisper('(inner)', d);
      });
      outer.push(TF.$collect());
      outer.push(join = function(d, send) {
        return send(d.join(''));
      });
      //.......................................................................................................
      outer.push(function(d) {
        return help('outer', d);
      });
      //.......................................................................................................
      result = outer.run();
      info('^34-1^', rpr(result));
      if (T != null) {
        T.eq(result, ['ABCDE']);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var finish, inner, join, outer, result, show, uppercase;
      inner = new Pipeline();
      outer = new Pipeline();
      //.......................................................................................................
      inner.push(uppercase = function(d, send) {
        return send(d.toUpperCase());
      });
      inner.push(TF.$collect());
      inner.push(join = function(d, send) {
        return send(d.join(''));
      });
      inner.push(show = function(d) {
        return whisper('inner', d);
      });
      //.......................................................................................................
      outer.push('abcde');
      outer.push(inner);
      outer.push(finish = function(d) {
        return help('outer', d);
      });
      //.......................................................................................................
      result = outer.run();
      info('^34-2^', rpr(result));
      if (T != null) {
        T.eq(result, ['ABCDE']);
      }
      return null;
    })();
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

  //-----------------------------------------------------------------------------------------------------------
  this.protocol_1 = function(T, done) {
    var $, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (function() {      //.........................................................................................................
      var add2, fl_ap, i, mul2, n, p, result;
      p = new Pipeline({
        protocol: true
      });
      p.push(add2 = function(d, send) {
        return send(d + 2);
      });
      p.push(mul2 = function(d, send) {
        return send(d * 2);
      });
      p.push($({first, last}, fl_ap = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      }));
      for (n = i = 0; i <= 3; n = ++i) {
        p.send(n);
      }
      debug('^74-2^', p);
      debug('^74-2^', result = p.run());
      return H.tabulate("protocol_1", p.journal);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.protocol_2 = function(T, done) {
    var $, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (function() {      //.........................................................................................................
      var add2, fl_ap, i, mul2, n, p, result;
      p = new Pipeline({
        protocol: true
      });
      p.push(add2 = function(d, send) {
        return send(d + 2);
      });
      p.push(mul2 = function(d, send) {
        return send(d * 2);
      });
      p.push($({first, last}, fl_ap = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      }));
      p.push(transforms.$collect());
      for (n = i = 0; i <= 3; n = ++i) {
        p.send(n);
      }
      debug('^75-1^', p);
      debug('^75-2^', result = p.run());
      return H.tabulate("protocol_2", p.journal);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.protocol_3 = function(T, done) {
    var $, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (function() {      //.........................................................................................................
      var add2, again, fl_ap, i, mul2, n, p, result;
      p = new Pipeline({
        protocol: true
      });
      p.push(add2 = function(d, send) {
        return send(d + 2);
      });
      p.push(mul2 = function(d, send) {
        return send(d * 2);
      });
      p.push(again = function(d, send) {
        send(d);
        if (d === 10) {
          return p.send(100);
        }
      });
      p.push($({first, last}, fl_ap = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      }));
      p.push(transforms.$collect());
      for (n = i = 0; i <= 3; n = ++i) {
        p.send(n);
      }
      debug('^75-1^', p);
      debug('^75-2^', result = p.run());
      return H.tabulate("protocol_3", p.journal);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.async_protocol_3 = async function(T, done) {
    var $, Async_pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Async_pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    await (async function() {      //.........................................................................................................
      var add2, again, fl_ap, i, mul2, n, p, result;
      p = new Async_pipeline({
        protocol: true
      });
      p.push(add2 = function(d, send) {
        return send(d + 2);
      });
      p.push(mul2 = function(d, send) {
        return send(d * 2);
      });
      p.push(again = function(d, send) {
        send(d);
        if (d === 10) {
          return p.send(100);
        }
      });
      p.push($({first, last}, fl_ap = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      }));
      p.push(transforms.$collect());
      for (n = i = 0; i <= 3; n = ++i) {
        p.send(n);
      }
      debug('^76-1^', p);
      debug('^76-2^', result = (await p.run()));
      return H.tabulate("async_protocol_3", p.journal);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    await (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-advanced.js.map