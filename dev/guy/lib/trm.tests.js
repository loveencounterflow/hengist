(function() {
  'use strict';
  var H, _GUY, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  _GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = _GUY.trm.get_loggers('GUY/trm/tests'));

  ({rpr, inspect, echo, log} = _GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // { freeze }                = require 'letsfreezethat'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this["GUY.trm.rpr"] = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers, trm, with_capture;
    GUY = require('../../../apps/guy');
    trm = GUY.trm.get_loggers('GUY');
    //.........................................................................................................
    with_capture = (f) => {
      var _stderr_write, _stdout_write, err, error, out;
      _stdout_write = process.stdout.write;
      _stderr_write = process.stderr.write;
      out = [];
      err = [];
      process.stdout.write = function(data) {
        out.push(data);
        return _stdout_write.call(process.stdout, data);
      };
      process.stderr.write = function(data) {
        err.push(data);
        return _stderr_write.call(process.stderr, data);
      };
      try {
        f();
      } catch (error1) {
        error = error1;
        throw error;
      } finally {
        process.stdout.write = _stdout_write;
        process.stderr.write = _stderr_write;
      }
      return {out, err};
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'alert',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[5m\x1B[38;05;124m ⚠ \x1B[0m\x1B[25m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;124mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'debug',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ⚙ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;199mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'help',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;214m ☛ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;118mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'info',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;33mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'plain',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m XXXXXXX\n']
          }
        ],
        null
      ],
      [
        'praise',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;64m ✔ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;64mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'urge',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[1m\x1B[38;05;124m ? \x1B[0m\x1B[22m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;208mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'warn',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[1m\x1B[38;05;124m ! \x1B[0m\x1B[22m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;124mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ],
      [
        'whisper',
        [
          null,
          {
            out: [],
            err: ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;240mXXXXXXX\x1B[0m\n']
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var r, s;
          r = trm[probe]('XXXXXXX');
          s = with_capture(function() {
            return trm[probe]('XXXXXXX');
          });
          return resolve([r, s]);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_trm_strip_ansi = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require('../../../apps/guy');
    // debug '^33321^', GUY.trm._ansi_pattern
    //.........................................................................................................
    probes_and_matchers = [[GUY.trm.red("helo"), "helo"], [GUY.trm.blink(GUY.trm.reverse(GUY.trm.red("helo"))), "helo"], ['\x1B[38;05;240m00:00\x1B[0m\x1B[5m\x1B[38;05;124m ⚠ \x1B[0m\x1B[25m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;124mXXXXXXX\x1B[0m\n', '00:00 ⚠  GUY XXXXXXX\n', null], ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ⚙ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;199mXXXXXXX\x1B[0m\n', '00:00 ⚙  GUY XXXXXXX\n', null], ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;214m ☛ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;118mXXXXXXX\x1B[0m\n', '00:00 ☛  GUY XXXXXXX\n', null], ['\x1B[38;05;240m00:00\x1B[0m\x1B[38;05;240m ▶ \x1B[0m \x1B[38;05;240mGUY\x1B[0m \x1B[38;05;33mXXXXXXX\x1B[0m\n', '00:00 ▶  GUY XXXXXXX\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = GUY.trm.strip_ansi(probe);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "GUY.trm.rpr" ]
      // test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]
      return test(this.GUY_trm_strip_ansi);
    })();
  }

}).call(this);

//# sourceMappingURL=trm.tests.js.map