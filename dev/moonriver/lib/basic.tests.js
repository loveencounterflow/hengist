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
  this["send.call_count"] = function(T, done) {
    var $once, Moonriver;
    // T?.halt_on_error()
    ({Moonriver, $once} = require('../../../apps/moonriver'));
    (() => {      //.........................................................................................................
      var collector, mr, pipeline;
      collector = [];
      pipeline = [
        [1,
        2,
        3,
        5],
        function(d,
        send) {
          return send(d * 2);
        },
        function(d,
        send) {
          return send(d); //; urge d
        },
        function(d,
        send) {
          return collector.push(d); //; help collector
        }
      ];
      mr = new Moonriver(pipeline);
      mr.drive();
      return T != null ? T.eq(collector, [2, 4, 6, 10]) : void 0;
    })();
    (() => {      //.........................................................................................................
      var collector, mr, pipeline;
      collector = [];
      pipeline = [
        ['a',
        'b'],
        function(d,
        send) {
          urge('^598^',
        d);
          return send(d);
        },
        function(d,
        send) {
          var e,
        ref;
          send(d);
          if (send.call_count === 1) {
            ref = [1, 2, 3, 5].values();
            for (e of ref) {
              send(e);
            }
          }
          return null;
        },
        function(d,
        send) {
          return send(isa.float(d) ? d * 2 : d);
        },
        function(d) {
          return urge(d);
        },
        function(d,
        send) {
          return collector.push(d); //; help collector
        }
      ];
      mr = new Moonriver(pipeline);
      mr.drive();
      return T != null ? T.eq(collector, ['a', 2, 4, 6, 10, 'b']) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["can access pipeline from within transform, get user area"] = function(T, done) {
    var Moonriver;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
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
      mr = new Moonriver(pipeline);
      debug('^558^', mr);
      return mr.drive();
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["resettable state shared across transforms"] = function(T, done) {
    var $, Moonriver, source;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    //.........................................................................................................
    source = ['<h1>', 'The Opening', '</h1>', '<p>', 'Twas brillig, and the slithy toves Did gyre and gimble in the', '<em>', 'wabe', '</p>', '</body>', '</html>'];
    (() => {      //.........................................................................................................
      var cleanup, collect, collector, counts, d, first, i, initialize_stack, last, len, mr, on_first, once_after, once_before, pipeline, pop_closing_from_stack, pop_remaining_from_stack, push_opening_to_stack;
      first = Symbol('first');
      last = Symbol('last');
      once_before = Symbol.for('once_before');
      once_after = Symbol.for('once_after');
      collector = [];
      counts = {
        once_before: 0,
        first: 0,
        last: 0,
        once_after: 0
      };
      //.......................................................................................................
      pipeline = [
        //.....................................................................................................
        source,
        //.....................................................................................................
        $({once_before},
        on_first = function(d) {
          return counts.once_before++;
        }),
        //.....................................................................................................
        $({first},
        initialize_stack = function(d) {
          counts.first++;
          if (d === first) {
            this.user.stack = [];
            urge('^3487^',
        'initialize_stack()',
        this.user);
          }
          return null;
        }),
        //.....................................................................................................
        push_opening_to_stack = function(d,
        send) {
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
          left_d = d.replace(/^<([^\s>]+).*$/,
        '$1');
          // debug '^039850^', { left_d, }
          this.user.stack.push(left_d);
          return send(d);
        },
        //.....................................................................................................
        pop_closing_from_stack = function(d,
        send) {
          var left_d,
        right_d;
          if (!isa.text(d)) {
            return send(d);
          }
          if (!d.startsWith('</')) {
            return send(d);
          }
          // debug '^4564^', 'pop_closing_from_stack', @user.stack, d
          if (this.user.stack.length < 1) {
            send(`error: extraneous closing tag ${rpr(d)}`);
            return send(d);
          }
          left_d = this.user.stack.pop();
          right_d = d.replace(/^<\/([^\s>]+).*$/,
        '$1');
          // debug '^039850^', { left_d, right_d, }
          if (left_d !== right_d) {
            send(`error: expected closing tag for <${rpr(left_d)}>, got ${rpr(d)}`);
            return send(d);
          }
          return send(d);
        },
        //.....................................................................................................
        $({once_after},
        pop_remaining_from_stack = function(d) {
          return debug('^309-1^',
        d);
        }),
        // counts.last++
        // send d
        //.....................................................................................................
        collect = function(d) {
          debug('^309-1^',
        d);
          return collector.push(d);
        },
        //.....................................................................................................
        $({once_after},
        cleanup = function(d) {
          debug('^309-2^',
        d);
          return counts.once_after++;
        }),
        //.....................................................................................................
        $({last},
        cleanup = function(d) {
          debug('^309-2^',
        d);
          return counts.last++;
        })
      ];
      //.....................................................................................................
      mr = new Moonriver(pipeline);
      mr.drive();
      debug('^558^', mr.user);
      for (i = 0, len = collector.length; i < len; i++) {
        d = collector[i];
        echo(rpr(d));
      }
      if (T != null) {
        T.eq(collector, ['<h1>', 'The Opening', '</h1>', '<p>', 'Twas brillig, and the slithy toves Did gyre and gimble in the', '<em>', 'wabe', "error: expected closing tag for <'em'>, got '</p>'", '</p>', "error: expected closing tag for <'p'>, got '</body>'", '</body>', "error: extraneous closing tag '</html>'", '</html>']);
      }
      return T != null ? T.eq(counts, {
        once_before: 1,
        first: source.length + 1,
        last: source.length + 3 + 1,
        once_after: 1
      }) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier last"] = function(T, done) {
    var $, Moonriver, collector, d, error, finalize, first, i, last, len, mr, pipeline, segment;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    first = Symbol('first');
    last = Symbol('last');
    collector = [];
    //.......................................................................................................
    pipeline = [
      ['first',
      'second',
      'third'],
      //.....................................................................................................
      $({last},
      finalize = function(d,
      send) {
        if (d === last) {
          collector.push(collector.length);
          return send('fourth');
        }
        send(d);
        return null;
      }),
      //.....................................................................................................
      function(d) {
        return collector.push(d);
      }
    ];
    //.........................................................................................................
    //.....................................................................................................
    mr = new Moonriver(pipeline);
    segment = mr.pipeline[1];
    if (T != null) {
      T.eq(segment.modifications.do_last, true);
    }
    if (T != null) {
      T.eq(segment.modifications.last, last);
    }
    //.........................................................................................................
    error = null;
    try {
      mr.drive();
    } catch (error1) {
      error = error1;
      if (T != null) {
        T.ok(/cannot send values after pipeline has terminated/.test(error.message));
      }
    }
    if (T != null) {
      T.ok(error != null);
    }
    for (i = 0, len = collector.length; i < len; i++) {
      d = collector[i];
      //.........................................................................................................
      echo(rpr(d));
    }
    if (T != null) {
      T.eq(collector, ['first', 'second', 'third', 3]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["modifier once_after"] = function(T, done) {
    var $, Moonriver, collector, finalize, mr, once_after, pipeline, segment;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    once_after = Symbol('once_after');
    collector = [];
    //.......................................................................................................
    pipeline = [
      ['first',
      'second',
      'third'],
      //.....................................................................................................
      $({once_after},
      finalize = function(d) {
        if (d === once_after) {
          collector.push(collector.length);
        }
        return null;
      }),
      //.....................................................................................................
      function(d) {
        return collector.push(d);
      }
    ];
    //.........................................................................................................
    //.....................................................................................................
    mr = new Moonriver(pipeline);
    segment = mr.pipeline[1];
    if (T != null) {
      T.eq(segment.is_sender, false);
    }
    if (T != null) {
      T.eq(segment.is_listener, false);
    }
    if (T != null) {
      T.eq(segment.modifications.do_once_after, true);
    }
    if (T != null) {
      T.eq(segment.modifications.once_after, once_after);
    }
    //.........................................................................................................
    mr.drive();
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
    var $, Moonriver, collect, collector, d, i, len, look_for_third, mr, pipeline;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    collector = [];
    //.......................................................................................................
    pipeline = [
      ['first',
      'second',
      'third',
      'fourth',
      'fifth'],
      //.....................................................................................................
      look_for_third = function(d,
      send) {
        return send(d === 'third' ? Symbol.for('exit') : d);
      },
      //.....................................................................................................
      collect = function(d,
      send) {
        return collector.push(d);
      }
    ];
    //.....................................................................................................
    mr = new Moonriver(pipeline);
    mr.drive();
    for (i = 0, len = collector.length; i < len; i++) {
      d = collector[i];
      echo(rpr(d));
    }
    if (T != null) {
      T.eq(collector, ['first', 'second']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["called even when pipeline empty: once_before, once_after"] = function(T, done) {
    var $, Moonriver, collect, collector, counts, mr, on_once_after, on_once_before, once_after, once_before, pipeline, show_1, show_2;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    collector = [];
    once_before = Symbol.for('once_before');
    once_after = Symbol.for('once_after');
    counts = {
      once_before: 0,
      once_after: 0
    };
    //.......................................................................................................
    pipeline = [
      [],
      //.....................................................................................................
      $({once_before},
      on_once_before = function(d) {
        return counts.once_before++;
      }),
      //.....................................................................................................
      show_1 = function(d,
      send) {
        urge('^498-1^',
      rpr(d));
        return send(d);
      },
      //.....................................................................................................
      $({once_after},
      on_once_after = function(d) {
        return counts.once_after++;
      }),
      //.....................................................................................................
      collect = function(d,
      send) {
        collector.push(d);
        return send(d);
      },
      //.....................................................................................................
      show_2 = function(d,
      send) {
        urge('^498-2^',
      rpr(d));
        return send(d);
      }
    ];
    //.....................................................................................................
    mr = new Moonriver(pipeline);
    mr.drive();
    if (T != null) {
      T.eq(counts, {
        once_before: 1,
        once_after: 1
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
  this["transforms with once_after must not be senders"] = function(T, done) {
    var $, Moonriver, error, mr, on_once_after, once_after, pipeline;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    once_after = Symbol.for('once_after');
    //.......................................................................................................
    pipeline = [$({once_after}, on_once_after = function(d, send) {})];
    //.........................................................................................................
    error = null;
    try {
      mr = new Moonriver(pipeline);
    } catch (error1) {
      error = error1;
      // throw error
      if (T != null) {
        T.ok(/transforms with modifier once_after cannot be senders/.test(error.message));
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
  this["using send() in a once_before transform"] = function(T, done) {
    var $, Moonriver, collect, collector, mr, on_once_before, once_before, pipeline, show;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    once_before = [42, 43, 44];
    collector = [];
    //.......................................................................................................
    pipeline = [
      $({once_before},
      on_once_before = function(d,
      send) {
        var e,
      i,
      len,
      results;
        debug('^4532^',
      d);
        results = [];
        for (i = 0, len = d.length; i < len; i++) {
          e = d[i];
          results.push(send(e));
        }
        return results;
      }),
      show = function(d) {
        return urge('^4948^',
      d);
      },
      collect = function(d) {
        return collector.push(d);
      }
    ];
    mr = new Moonriver(pipeline);
    mr.drive();
    if (T != null) {
      T.eq(collector, [42, 43, 44]);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["appending data before closing"] = function(T, done) {
    var $, Moonriver, before_last, collect, collector, mr, on_once_before, pipeline, show;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    before_last = Symbol('before_last');
    collector = [];
    //.......................................................................................................
    pipeline = [
      [-1],
      show = function(d) {
        return urge('^4948-1^',
      d);
      },
      $({before_last},
      on_once_before = function(d,
      send) {
        var e,
      i,
      len,
      ref,
      results;
        debug('^4532^',
      d);
        if (d !== before_last) {
          return send(d);
        }
        ref = ['a', 'b', 'c'];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          e = ref[i];
          results.push(send(e));
        }
        return results;
      }),
      show = function(d) {
        return urge('^4948-2^',
      d);
      },
      collect = function(d) {
        return collector.push(d);
      }
    ];
    mr = new Moonriver(pipeline);
    mr.drive();
    help('^894^', collector);
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["once_before, once_after transformers transparent to data"] = function(T, done) {
    var $, Moonriver, collect, collectors, mr, on_once_after, on_once_before, pipeline, show;
    // T?.halt_on_error()
    ({Moonriver} = require('../../../apps/moonriver'));
    ({$} = Moonriver);
    collectors = {
      c1: [],
      c2: [],
      c3: [],
      c4: [],
      c5: []
    };
    //.......................................................................................................
    pipeline = [
      ['a',
      'b',
      'c'],
      collect = function(d) {
        return collectors.c1.push(d);
      },
      $({
        once_before: 'bfr'
      },
      on_once_before = function(d) {
        debug('^453-1^',
      d);
        return collectors.c2.push(d);
      }),
      collect = function(d) {
        return collectors.c3.push(d);
      },
      $({
        once_after: 'aft'
      },
      on_once_after = function(d) {
        debug('^453-2^',
      d);
        return collectors.c4.push(d);
      }),
      collect = function(d) {
        return collectors.c5.push(d);
      },
      show = function(d) {
        return urge('^4948^',
      d);
      }
    ];
    mr = new Moonriver(pipeline);
    mr.drive();
    help('^894^', collectors.c1);
    help('^894^', collectors.c2);
    help('^894^', collectors.c3);
    help('^894^', collectors.c4);
    help('^894^', collectors.c5);
    if (T != null) {
      T.eq(collectors.c1, ['a', 'b', 'c']);
    }
    if (T != null) {
      T.eq(collectors.c2, ['bfr']);
    }
    if (T != null) {
      T.eq(collectors.c3, ['a', 'b', 'c']);
    }
    if (T != null) {
      T.eq(collectors.c4, ['aft']);
    }
    if (T != null) {
      T.eq(collectors.c5, ['a', 'b', 'c']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // @[ "send.call_count" ]()
// @[ "appending data before closing" ]()
// test @[ "appending data before closing" ]
// test @[ "using send() in a once_before transform" ]
// @[ "once_before, once_after transformers transparent to data" ]()
// test @[ "once_before, once_after transformers transparent to data" ]
// @[ "resettable state shared across transforms" ]()
// test @[ "resettable state shared across transforms" ]
// @[ "modifier once_after" ]()
// test @[ "modifier once_after" ]
// @[ "modifier last" ]()
// test @[ "modifier last" ]
// test @[ "modifier last" ]
// @[ "called even when pipeline empty: once_before, once_after" ]()
// test @[ "called even when pipeline empty: once_before, once_after" ]
// test @[ "transforms with once_after must not be senders" ]
// test @[ "exit symbol" ]
// @[ "can access pipeline from within transform, get user area" ]()
// test @[ "can access pipeline from within transform, get user area" ]

}).call(this);

//# sourceMappingURL=basic.tests.js.map