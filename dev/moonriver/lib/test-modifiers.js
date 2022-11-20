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

  //-----------------------------------------------------------------------------------------------------------
  this.modifiers_first_and_last = function(T, done) {
    var $, $add_parentheses, $collect, $with_stars, Pipeline, first, last, p, result, show, transforms;
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
    //.........................................................................................................
    $collect = function() {
      return $({last}, (function() {
        var collect, collector;
        collector = [];
        return collect = function(d, send) {
          debug('^234^', d);
          if (d === last) {
            return send(collector);
          }
          collector.push(d);
          return null;
        };
      })());
    };
    //.........................................................................................................
    p.push(Array.from('氣場全開'));
    p.push($with_stars());
    p.push($add_parentheses());
    // p.push $collect()
    p.push(show = function(d) {
      return whisper(rpr(d));
    });
    result = p.run();
    urge('^735^', result);
    if (T != null) {
      T.eq(result, ['(', '*氣*', '*場*', '*全*', '*開*', ')']);
    }
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
      var $, collector, p, protocol;
      collector = [];
      protocol = [];
      p = new Pipeline({protocol});
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
      return T != null ? T.eq(collector, [first, last]) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._appending_data_before_closing = function(T, done) {
    var $, Pipeline, at_last, collect, collector, last, p, show;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    last = Symbol('last');
    collector = [];
    p = new Pipeline();
    //.......................................................................................................
    p.push([-1]);
    p.push(show = function(d) {
      return urge('^4948-1^', d);
    });
    p.push($({last}, at_last = function(d, send) {
      var e, i, len, ref, results;
      if (d !== last) {
        return send(d);
      }
      ref = ['a', 'b', 'c'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        e = ref[i];
        results.push(send(e));
      }
      return results;
    }));
    p.push(show = function(d) {
      return urge('^4948-2^', d);
    });
    p.push(collect = function(d) {
      return collector.push(d);
    });
    p.run();
    if (T != null) {
      T.eq(collector, [-1, 'a', 'b', 'c']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._modifier_last_does_not_leak_into_pipeline_when_used_with_observer = function(T, done) {
    var $, Pipeline, collector, last1, last2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    last1 = Symbol('last1');
    last2 = Symbol('last2');
    collector = [];
    (() => {      //.......................................................................................................
      var p;
      p = new Pipeline();
      p.push(Array.from('abc'));
      p.push($({
        last: last1
      }, function(d) {
        return debug('^765-1^', rpr(d));
      }));
      p.push($({
        last: last2
      }, function(d, send) {
        debug('^765-2^', rpr(d));
        if (d !== last2) {
          return send(d);
        }
      }));
      p.push(function(d) {
        return collector.push(d);
      });
      //.....................................................................................................
      p.run();
      urge('^859^', collector);
      return T != null ? T.eq(collector, Array.from('abc')) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._modifier_last = function(T, done) {
    var $, Pipeline, collect, collector, finalize, first, last, p, ref, s1;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    collector = [];
    p = new Pipeline();
    //.......................................................................................................
    p.push(['first', 'second', 'third']);
    s1 = p.push($({last}, finalize = function(d, send) {
      debug('^347^', rpr(d));
      if (d === last) {
        collector.push(collector.length);
        return send('fourth');
      }
      send(d);
      return null;
    }));
    p.push(collect = function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(s1.modifiers.last, true);
    }
    if (T != null) {
      T.eq((ref = s1.modifiers.values) != null ? ref.last : void 0, last);
    }
    //.........................................................................................................
    p.run();
    debug('^343^', collector);
    if (T != null) {
      T.eq(collector, ['first', 'second', 'third', 3, 'fourth']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._modifier_once_after_last = function(T, done) {
    var $, Pipeline, collector, finalize, p, s1;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    p = new Pipeline();
    //.......................................................................................................
    p.push(['first', 'second', 'third']);
    s1 = p.push($({
      once_after_last: true
    }, finalize = function(d) {
      collector.push(collector.length);
      return null;
    }));
    p.push(function(d) {
      return collector.push(d);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(s1.is_sender, true);
    }
    if (T != null) {
      T.eq(s1.modifiers.once_after_last, true);
    }
    //.........................................................................................................
    p.run();
    if (T != null) {
      T.eq(collector, ['first', 'second', 'third', 3]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._exit_symbol = function(T, done) {
    var $, Pipeline, collect, collector, d, i, len, look_for_third, p, protocol;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    protocol = [];
    p = new Pipeline({protocol});
    //.......................................................................................................
    p.push(['first', 'second', 'third', 'fourth', 'fifth']);
    p.push(look_for_third = function(d, send) {
      return send(d === 'third' ? Symbol.for('exit') : d);
    });
    p.push(collect = function(d, send) {
      return collector.push(d);
    });
    p.run();
    for (i = 0, len = collector.length; i < len; i++) {
      d = collector[i];
      echo(rpr(d));
    }
    if (T != null) {
      T.eq(collector, ['first', 'second']);
    }
    H.tabulate('protocol', protocol);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._once_before_first_and_once_after_last_called_even_when_pipeline_empty = function(T, done) {
    var $, Pipeline, collect, collector, counts, on_once_after, on_once_before, once_after_last, once_before_first, p, show_1, show_2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    once_before_first = true;
    once_after_last = true;
    counts = {
      once_before_first: 0,
      once_after_last: 0
    };
    p = new Pipeline();
    //.......................................................................................................
    p.push([]);
    p.push($({once_before_first}, on_once_before = function(d) {
      return counts.once_before_first++;
    }));
    p.push(show_1 = function(d) {
      return urge('^498-1^', rpr(d));
    });
    p.push($({once_after_last}, on_once_after = function(d) {
      return counts.once_after_last++;
    }));
    p.push(collect = function(d) {
      return collector.push(d);
    });
    p.push(show_2 = function(d) {
      return urge('^498-2^', rpr(d));
    });
    p.run();
    if (T != null) {
      T.eq(counts, {
        once_before_first: 1,
        once_after_last: 1
      });
    }
    if (T != null) {
      T.eq(collector, []);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._modifier_first_does_not_leak_into_pipeline_when_used_with_observer = function(T, done) {
    var $, Pipeline, collector, first1, first2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first1 = Symbol('first1');
    first2 = Symbol('first2');
    collector = [];
    (() => {      //.......................................................................................................
      var p;
      p = new Pipeline();
      p.push(Array.from('abc'));
      p.push($({
        first: first1
      }, function(d) {
        return debug('^765-1^', rpr(d));
      }));
      p.push($({
        first: first2
      }, function(d, send) {
        debug('^765-2^', rpr(d));
        if (d !== first2) {
          return send(d);
        }
      }));
      p.push(function(d) {
        return collector.push(d);
      });
      //.....................................................................................................
      p.run();
      urge('^859^', collector);
      return T != null ? T.eq(collector, Array.from('abc')) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @modifiers_first_and_last()
      // test @modifiers_first_and_last
      this.modifiers_with_empty_pipeline();
      return test(this.modifiers_with_empty_pipeline);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-modifiers.js.map