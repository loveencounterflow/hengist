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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // @[ "send.call_count" ]()

}).call(this);

//# sourceMappingURL=basic.tests.js.map