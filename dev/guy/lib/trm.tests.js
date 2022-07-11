(function() {
  'use strict';
  var CND, H, alert, badge, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/SRC';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this["GUY.trm.rpr"]);
    })();
  }

  // test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]

}).call(this);

//# sourceMappingURL=trm.tests.js.map