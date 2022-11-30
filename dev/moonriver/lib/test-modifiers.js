(function() {
  'use strict';
  var GUY, H, PATH, SQL, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/MODIFIERS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_first_and_last_1 = function(T, done) {
    var $, $add_parentheses, $with_stars, Pipeline, first, last, p, transforms;
    // T?.halt_on_error()
    ({Pipeline, transforms} = require('../../../apps/moonriver'));
    p = new Pipeline();
    ({$} = p);
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    $with_stars = function() {
      var with_stars;
      return with_stars = function(d, send) {
        return send(`*${d}*`);
      };
    };
    $add_parentheses = function() {
      var add_parentheses;
      return $({first, last}, add_parentheses = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      });
    };
    (function() {      //.........................................................................................................
      var result, show;
      p.push(Array.from('氣場全開'));
      p.push($with_stars());
      p.push($add_parentheses());
      // p.push transforms.$collect()
      p.push(show = function(d) {
        return whisper(rpr(d));
      });
      result = p.run();
      urge('^735^', result);
      return T != null ? T.eq(result, ['(', '*氣*', '*場*', '*全*', '*開*', ')']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_first_and_last_2 = function(T, done) {
    var $, $add_parentheses, $with_stars, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    $with_stars = function() {
      var with_stars;
      return with_stars = function(d, send) {
        return send(`*${d}*`);
      };
    };
    $add_parentheses = function() {
      var add_parentheses;
      return $({first, last}, add_parentheses = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      });
    };
    (function() {      //.........................................................................................................
      var p, result, show;
      p = new Pipeline();
      p.push(Array.from('氣場全開'));
      p.push($with_stars());
      p.push($add_parentheses());
      // p.push transforms.$collect()
      p.push(show = function(d) {
        return whisper(rpr(d));
      });
      result = p.run();
      urge('^735^', result);
      return T != null ? T.eq(result, ['(', '*氣*', '*場*', '*全*', '*開*', ')']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_first_and_last_3 = function(T, done) {
    var $, $add_parentheses, $with_stars, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    $with_stars = function() {
      var with_stars;
      return with_stars = function(d, send) {
        return send(`*${d}*`);
      };
    };
    $add_parentheses = function() {
      var add_parentheses;
      return $({first, last}, add_parentheses = function(d, send) {
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d);
      });
    };
    (function() {      //.........................................................................................................
      var join, p, result, show;
      p = new Pipeline();
      p.push(Array.from('氣場全開'));
      p.push($with_stars());
      // p.push ( d ) -> info '^77-1^', p, p.segments[ 0 ].output
      p.push($add_parentheses());
      // p.push ( d ) -> info '^77-2^', p # .segments[ 1 ].output
      p.push(show = function(d) {
        return help(rpr(d));
      });
      p.push(transforms.$collect());
      p.push(show = function(d) {
        return urge(rpr(d));
      });
      p.push(join = function(d, send) {
        return send(d.join(''));
      });
      result = p.run();
      urge('^77-3^', p);
      urge('^77-4^', result);
      return T != null ? T.eq(result, ['(*氣**場**全**開*)']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_of_observers_do_not_leak = async function(T, done) {
    var $, Async_pipeline, Pipeline, first, last, transforms;
    // T?.halt_on_error()
    ({Pipeline, Async_pipeline, $, transforms} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (function() {      //.........................................................................................................
      var observe, p, result;
      p = new Pipeline({
        protocol: true
      });
      p.push(Array.from('氣場全開'));
      p.push($({first, last}, observe = function(d) {
        return info('^79-1^', rpr(d));
      }));
      result = p.run();
      urge('^79-2^', p);
      urge('^79-3^', result);
      if (T != null) {
        T.eq(result, ['氣', '場', '全', '開']);
      }
      return H.tabulate("modifiers_of_observers_do_not_leak", p.journal);
    })();
    await (async function() {      //.........................................................................................................
      var observe, p, result;
      p = new Async_pipeline({
        protocol: true
      });
      p.push(Array.from('氣場全開'));
      p.push($({first, last}, observe = async function(d) {
        return (await GUY.async.after(0.1, function() {
          return info('^79-4^', rpr(d));
        }));
      }));
      result = (await p.run());
      urge('^79-5^', p);
      urge('^79-6^', result);
      if (T != null) {
        T.eq(result, ['氣', '場', '全', '開']);
      }
      return H.tabulate("modifiers_of_observers_do_not_leak", p.journal);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_with_empty_pipeline = function(T, done) {
    var Pipeline, first, last;
    // T?.halt_on_error()
    ({Pipeline} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (() => {      //.........................................................................................................
      var $, collector, p;
      collector = [];
      p = new Pipeline({
        protocol: true
      });
      ({$} = p);
      p.push([]);
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push($({first}, function(d, send) {
        return send(d);
      }));
      p.push($({last}, function(d, send) {
        return send(d);
      }));
      p.push(function(d) {
        return urge('^309^', d);
      });
      p.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      p.run();
      if (T != null) {
        T.eq(collector, [first, last]);
      }
      return H.tabulate('modifiers_with_empty_pipeline #2', p.journal);
    })();
    (() => {      //.........................................................................................................
      var $, collector, p;
      collector = [];
      p = new Pipeline({
        protocol: true
      });
      ({$} = p);
      p.push([]);
      p.push(function(d, send) {
        return send(d * 2);
      });
      p.push($({first, last}, function(d, send) {
        return send(d);
      }));
      p.push(function(d) {
        return urge('^309^', d);
      });
      p.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      p.run();
      if (T != null) {
        T.eq(collector, [first, last]);
      }
      // debug '^453^', d for d in protocol
      return H.tabulate('modifiers_with_empty_pipeline #2', p.journal);
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_preserved_for_pipeline_segments = function(T, done) {
    var $, Pipeline, TF, first, last;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({
      Pipeline,
      $,
      transforms: TF
    } = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    (function() {      //.........................................................................................................
      var p, result;
      p = new Pipeline();
      p.push('abcd');
      p.push($({first, last}, function(d, send) {
        debug('^53-1^', rpr(d));
        if (d === first) {
          return send('(');
        }
        if (d === last) {
          return send(')');
        }
        return send(d.toUpperCase());
      }));
      p.push(TF.$collect());
      // p.push do ->
      //   collector = []
      //   return $ { last, }, ( d, send ) ->
      //     return send collector if d is last
      //     collector.push d
      p.push(function(d, send) {
        return send(d.join(''));
      });
      result = p.run();
      return T != null ? T.eq(result, ['(ABCD)']) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @modifiers_first_and_last()
      // test @modifiers_first_and_last_1
      // @modifiers_first_and_last_2()
      // @modifiers_first_and_last_3()
      // test @modifiers_first_and_last_2
      // test @modifiers_first_and_last_3
      // @modifiers_with_empty_pipeline()
      // test @modifiers_with_empty_pipeline
      // await @modifiers_of_observers_do_not_leak()
      return test(this.modifiers_of_observers_do_not_leak);
    })();
  }

  // test @modifiers_with_empty_pipeline
// test @

}).call(this);

//# sourceMappingURL=test-modifiers.js.map