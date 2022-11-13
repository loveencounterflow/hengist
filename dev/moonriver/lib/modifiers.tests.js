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
  this.modifiers = function(T, done) {
    var $, Pipeline, first, last, once_after_last, once_before_first;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    once_before_first = true;
    once_after_last = true;
    (() => {      //.........................................................................................................
      var collector, mr, protocol;
      collector = [];
      protocol = [];
      mr = new Pipeline({protocol});
      mr.push([1, 2, 3, 5]);
      mr.push(function(d, send) {
        return send(d * 2);
      });
      mr.push($({first}, function(d, send) {
        return send(d);
      }));
      mr.push($({last}, function(d, send) {
        return send(d);
      }));
      mr.push(function(d) {
        return urge('^309^', d);
      });
      mr.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      mr.run();
      if (T != null) {
        T.eq(collector, [first, 2, 4, 6, 10, last]);
      }
      // debug '^453^', d for d in protocol
      // console.table protocol
      return H.tabulate('protocol', protocol);
    })();
    (() => {      //.........................................................................................................
      var collector, mr, protocol;
      collector = [];
      protocol = [];
      mr = new Pipeline({protocol});
      mr.push([1, 2, 3, 5]);
      mr.push(function(d, send) {
        return send(d * 2);
      });
      mr.push($({first}, function(d, send) {
        return send(d);
      }));
      // mr.push $ { once_after_last,    },  ( d       ) -> debug '^987^', 'once_after_last'
      mr.push($({last}, function(d, send) {
        return send(d);
      }));
      mr.push($({once_before_first}, function(d) {
        debug('^276^ once_before_first');
        return collector.push('once_before_first');
      }));
      mr.push($({once_after_last}, function(d) {
        debug('^276^ once_after_last');
        return collector.push('once_after_last');
      }));
      mr.push(function(d) {
        return urge('^309^', d);
      });
      mr.push(function(d, send) {
        return collector.push(d); //; help collector
      });
      if (T != null) {
        T.eq(mr.on_once_before_first.length, 1);
      }
      if (T != null) {
        T.eq(mr.on_once_after_last.length, 1);
      }
      mr.run();
      if (T != null) {
        T.eq(collector, ['once_before_first', first, 2, 4, 6, 10, last, 'once_after_last']);
      }
      debug('^453^', collector);
      // console.table protocol
      return H.tabulate('protocol', protocol);
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.resettable_state_shared_across_transforms = function(T, done) {
    var $, Pipeline, source;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    //.........................................................................................................
    source = ['<h1>', 'The Opening', '</h1>', '<p>', 'Twas brillig, and the slithy toves Did gyre and gimble in the', '<em>', 'wabe', '</p>', '</body>', '</html>'];
    (() => {      //.........................................................................................................
      var cleanup, collect, collector, counts, d, first, i, initialize_stack, last, len, mr, on_first, once_after_last, once_before_first, pop_closing_from_stack, pop_remaining_from_stack, push_opening_to_stack;
      first = Symbol('first');
      last = Symbol('last');
      once_before_first = true;
      once_after_last = true;
      collector = [];
      counts = {
        once_before_first: 0,
        first: 0,
        last: 0,
        once_after_last: 0
      };
      mr = new Pipeline();
      //.......................................................................................................
      mr.push(source);
      //.......................................................................................................
      mr.push($({once_before_first}, on_first = function(d) {
        var k;
        debug('^373^', 'once_before_first');
        debug('^336^', this);
        debug('^336^', type_of(this));
        debug('^336^', (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
        return counts.once_before_first++;
      }));
      //.......................................................................................................
      mr.push($({first}, initialize_stack = function(d) {
        debug('^487^', d);
        counts.first++;
        if (d === first) {
          mr.user.stack = [];
          urge('^3487^', 'initialize_stack()', this.user);
        }
        return null;
      }));
      //.......................................................................................................
      mr.push(push_opening_to_stack = function(d, send) {
        var left_d;
        if (!isa.text(d)) {
          return send(d);
        }
        if (!d.startsWith('<')) {
          return send(d);
        }
        if (d.startsWith('</')) {
          return send(d);
        }
        left_d = d.replace(/^<([^\s>]+).*$/, '$1');
        // debug '^039850^', { left_d, }
        mr.user.stack.push(left_d);
        return send(d);
      });
      //.......................................................................................................
      mr.push(pop_closing_from_stack = function(d, send) {
        var left_d, right_d;
        if (!isa.text(d)) {
          return send(d);
        }
        if (!d.startsWith('</')) {
          return send(d);
        }
        // debug '^4564^', 'pop_closing_from_stack', mr.user.stack, d
        if (mr.user.stack.length < 1) {
          send(`error: extraneous closing tag ${rpr(d)}`);
          return send(d);
        }
        left_d = mr.user.stack.pop();
        right_d = d.replace(/^<\/([^\s>]+).*$/, '$1');
        // debug '^039850^', { left_d, right_d, }
        if (left_d !== right_d) {
          send(`error: expected closing tag for <${rpr(left_d)}>, got ${rpr(d)}`);
          return send(d);
        }
        return send(d);
      });
      //.......................................................................................................
      mr.push($({once_after_last}, pop_remaining_from_stack = function(d) {
        return debug('^309-1^', d);
      }));
      // counts.last++
      // send d
      //.......................................................................................................
      mr.push(collect = function(d) {
        debug('^309-1^', d);
        return collector.push(d);
      });
      //.......................................................................................................
      mr.push($({once_after_last}, cleanup = function(d) {
        debug('^309-2^', d);
        return counts.once_after_last++;
      }));
      //.......................................................................................................
      mr.push($({last}, cleanup = function(d) {
        debug('^309-2^', d);
        return counts.last++;
      }));
      //.......................................................................................................
      mr.run();
      debug('^558^', mr.user);
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        echo(rpr(d));
      }
      if (T != null) {
        T.eq(collector, ['<h1>', 'The Opening', '</h1>', '<p>', 'Twas brillig, and the slithy toves Did gyre and gimble in the', '<em>', 'wabe', "error: expected closing tag for <'em'>, got '</p>'", '</p>', "error: expected closing tag for <'p'>, got '</body>'", '</body>', "error: extraneous closing tag '</html>'", '</html>']);
      }
      return T != null ? T.eq(counts, {
        once_before_first: 1,
        first: source.length + 1,
        last: source.length + 3 + 1,
        once_after_last: 1
      }) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["once_before_first, once_after_last transformers transparent to data"] = function(T, done) {
    var $, Pipeline, collect2, collect4, collectors, mr, once_after_last, once_before_first;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collectors = {
      c1: [],
      c2: [],
      c3: [],
      c4: []
    };
    mr = new Pipeline();
    //.......................................................................................................
    mr.push(Array.from('bcd'));
    mr.push($({
      once_before_first: true
    }, once_before_first = function(send) {
      send('A');
      return T != null ? T.eq([...arguments].length, 1) : void 0;
    }));
    mr.push($({
      once_before_first: true
    }, once_before_first = function() {
      collectors.c1.push('E');
      return T != null ? T.eq([...arguments].length, 0) : void 0;
    }));
    mr.push(collect2 = function(d) {
      debug('^453-2^', d);
      collectors.c2.push(d);
      return T != null ? T.eq([...arguments].length, 1) : void 0;
    });
    mr.push($({
      once_after_last: true
    }, once_after_last = function(send) {
      send('Z');
      return T != null ? T.eq([...arguments].length, 1) : void 0;
    }));
    mr.push($({
      once_after_last: true
    }, once_after_last = function() {
      collectors.c3.push('F');
      return T != null ? T.eq([...arguments].length, 0) : void 0;
    }));
    mr.push(collect4 = function(d) {
      debug('^453-4^', d);
      collectors.c4.push(d);
      return T != null ? T.eq([...arguments].length, 1) : void 0;
    });
    mr.run();
    help('^894^', collectors.c1);
    help('^894^', collectors.c2);
    help('^894^', collectors.c3);
    help('^894^', collectors.c4);
    if (T != null) {
      T.eq(collectors.c1, ['E']);
    }
    if (T != null) {
      T.eq(collectors.c2, ['A', 'b', 'c', 'd']);
    }
    if (T != null) {
      T.eq(collectors.c3, ['F']);
    }
    if (T != null) {
      T.eq(collectors.c4, ['A', 'b', 'c', 'd', 'Z']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["appending data before closing"] = function(T, done) {
    var $, Pipeline, at_last, collect, collector, last, mr, show;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    last = Symbol('last');
    collector = [];
    mr = new Pipeline();
    //.......................................................................................................
    mr.push([-1]);
    mr.push(show = function(d) {
      return urge('^4948-1^', d);
    });
    mr.push($({last}, at_last = function(d, send) {
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
    mr.push(show = function(d) {
      return urge('^4948-2^', d);
    });
    mr.push(collect = function(d) {
      return collector.push(d);
    });
    mr.run();
    if (T != null) {
      T.eq(collector, [-1, 'a', 'b', 'c']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier last does not leak into pipeline when used with observer"] = function(T, done) {
    var $, Pipeline, collector, last1, last2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    last1 = Symbol('last1');
    last2 = Symbol('last2');
    collector = [];
    (() => {      //.......................................................................................................
      var mr;
      mr = new Pipeline();
      mr.push(Array.from('abc'));
      mr.push($({
        last: last1
      }, function(d) {
        return debug('^765-1^', rpr(d));
      }));
      mr.push($({
        last: last2
      }, function(d, send) {
        debug('^765-2^', rpr(d));
        if (d !== last2) {
          return send(d);
        }
      }));
      mr.push(function(d) {
        return collector.push(d);
      });
      //.....................................................................................................
      mr.run();
      urge('^859^', collector);
      return T != null ? T.eq(collector, Array.from('abc')) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier last"] = function(T, done) {
    var $, Pipeline, collect, collector, finalize, first, last, mr, ref, s1;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first = Symbol('first');
    last = Symbol('last');
    collector = [];
    mr = new Pipeline();
    //.......................................................................................................
    mr.push(['first', 'second', 'third']);
    s1 = mr.push($({last}, finalize = function(d, send) {
      debug('^347^', rpr(d));
      if (d === last) {
        collector.push(collector.length);
        return send('fourth');
      }
      send(d);
      return null;
    }));
    mr.push(collect = function(d) {
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
    mr.run();
    debug('^343^', collector);
    if (T != null) {
      T.eq(collector, ['first', 'second', 'third', 3, 'fourth']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier once_after_last"] = function(T, done) {
    var $, Pipeline, collector, finalize, mr, s1;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    mr = new Pipeline();
    //.......................................................................................................
    mr.push(['first', 'second', 'third']);
    s1 = mr.push($({
      once_after_last: true
    }, finalize = function(d) {
      collector.push(collector.length);
      return null;
    }));
    mr.push(function(d) {
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
    mr.run();
    if (T != null) {
      T.eq(collector, ['first', 'second', 'third', 3]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["exit symbol"] = function(T, done) {
    var $, Pipeline, collect, collector, d, i, len, look_for_third, mr, protocol;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    protocol = [];
    mr = new Pipeline({protocol});
    //.......................................................................................................
    mr.push(['first', 'second', 'third', 'fourth', 'fifth']);
    mr.push(look_for_third = function(d, send) {
      return send(d === 'third' ? Symbol.for('exit') : d);
    });
    mr.push(collect = function(d, send) {
      return collector.push(d);
    });
    mr.run();
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
  this["called even when pipeline empty: once_before_first, once_after_last"] = function(T, done) {
    var $, Pipeline, collect, collector, counts, mr, on_once_after, on_once_before, once_after_last, once_before_first, show_1, show_2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    collector = [];
    once_before_first = true;
    once_after_last = true;
    counts = {
      once_before_first: 0,
      once_after_last: 0
    };
    mr = new Pipeline();
    //.......................................................................................................
    mr.push([]);
    mr.push($({once_before_first}, on_once_before = function(d) {
      return counts.once_before_first++;
    }));
    mr.push(show_1 = function(d) {
      return urge('^498-1^', rpr(d));
    });
    mr.push($({once_after_last}, on_once_after = function(d) {
      return counts.once_after_last++;
    }));
    mr.push(collect = function(d) {
      return collector.push(d);
    });
    mr.push(show_2 = function(d) {
      return urge('^498-2^', rpr(d));
    });
    mr.run();
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
  this["transforms with once_after_last can (not yet) be senders"] = function(T, done) {
    var $, Pipeline, collector, error, mr, on_once_after, once_after_last;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    once_after_last = true;
    collector = [];
    mr = new Pipeline();
    //.......................................................................................................
    // mr.push [ 1, 2, 3, ]
    error = null;
    try {
      mr.push($({once_after_last}, on_once_after = function(d, send) {
        return send('last');
      }));
    } catch (error1) {
      error = error1;
      if ((error.message.match(/transform with arity 2 not implemented for modifiers once_before_first, once_after_last/)) != null) {
        if (T != null) {
          T.ok(true);
        }
      } else {
        throw error;
      }
    }
    if (T != null) {
      T.ok(error != null);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier first does not leak into pipeline when used with observer"] = function(T, done) {
    var $, Pipeline, collector, first1, first2;
    // T?.halt_on_error()
    ({Pipeline, $} = require('../../../apps/moonriver'));
    first1 = Symbol('first1');
    first2 = Symbol('first2');
    collector = [];
    (() => {      //.......................................................................................................
      var mr;
      mr = new Pipeline();
      mr.push(Array.from('abc'));
      mr.push($({
        first: first1
      }, function(d) {
        return debug('^765-1^', rpr(d));
      }));
      mr.push($({
        first: first2
      }, function(d, send) {
        debug('^765-2^', rpr(d));
        if (d !== first2) {
          return send(d);
        }
      }));
      mr.push(function(d) {
        return collector.push(d);
      });
      //.....................................................................................................
      mr.run();
      urge('^859^', collector);
      return T != null ? T.eq(collector, Array.from('abc')) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=modifiers.tests.js.map