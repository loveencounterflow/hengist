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
    source = ['<h1>', 'The Opening', '</h1>', '<p>', 'Twas brillig, and the slithy toves Did gyre and gimble in the', '<em>', 'wabe', '</p>'];
    (() => {      //.........................................................................................................
      var collector, first, initialize_stack, mr, pipeline, pop_closing_from_stack, push_opening_to_stack;
      first = Symbol('first');
      collector = [];
      pipeline = [
        //.....................................................................................................
        source,
        //.....................................................................................................
        $({first},
        initialize_stack = function(d) {
          if (d === first) {
            this.user.stack = [];
          }
          return urge('^3487^',
        'initialize_stack()',
        this.user);
        }),
        //.....................................................................................................
        push_opening_to_stack = function(d,
        send) {
          if (!isa.text(d)) {
            return send(d);
          }
          if (d.startsWith('</')) {
            return send(d);
          }
          this.user.stack.push(d.slice(1, d.length - 1));
          return send(d);
        },
        //.....................................................................................................
        pop_closing_from_stack = function(d,
        send) {
          if (!isa.text(d)) {
            return send(d);
          }
          if (!d.startsWith('</')) {
            return send(d);
          }
          if (this.user.stack.length < 1) {
            return send(`error: extraneous closing tag ${rpr(d)}`);
          }
          // matching_tag
          return send(d);
        },
        //.....................................................................................................
        function(d,
        send) {
          return collector.push(d); //; help collector
        }
      ];
      //.....................................................................................................
      mr = new Moonriver(pipeline);
      debug('^558^', mr.user);
      return mr.drive();
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "send.call_count" ]()
      return this["resettable state shared across transforms"]();
    })();
  }

  // @[ "can access pipeline from within transform, get user area" ]()
// test @[ "can access pipeline from within transform, get user area" ]

}).call(this);

//# sourceMappingURL=basic.tests.js.map