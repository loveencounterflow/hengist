(function() {
  'use strict';
  var H, _GUY, alert, debug, demo_color_memory, demo_replace_line, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  demo_replace_line = function() {
    var clear_line, clear_to_end, clear_to_start, cr_and_up, to_start_0, to_start_1, to_start_2, write;
    //.........................................................................................................
    // Moves cursor to beginning of the line n (default 1) lines up
    to_start_0 = '\x1b[0F';
    to_start_1 = '\x1b[1F';
    to_start_2 = '\x1b[2F';
    //.........................................................................................................
    // clears  part of the line.
    // If n is 0 (or missing), clear from cursor to the end of the line.
    // If n is 1, clear from cursor to beginning of the line.
    // If n is 2, clear entire line.
    // Cursor position does not change.
    clear_to_end = '\x1b[0K';
    clear_to_start = '\x1b[1K';
    clear_line = '\x1b[2K';
    //.........................................................................................................
    write = _GUY.trm.get_writer(process.stdout, '', '');
    cr_and_up = function() {
      return write(to_start_1 + clear_line);
    };
    //.........................................................................................................
    info("1 what dis???");
    info("2 what dis???");
    info("3 what dis???".repeat(50));
    info("4 what dis???".repeat(50));
    cr_and_up();
    info(_GUY.trm.red("helo world"));
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_color_memory = function() {
    var _H, blue, color_codes, color_stack, get_color_method, gold, lime, plum, red, yellow;
    ({
      colors: color_codes
    } = require('guy/lib/_temporary_colors'));
    _H = require('guy/lib/_helpers');
    color_stack = [color_codes.grey];
    //.........................................................................................................
    get_color_method = function(color_name) {
      /* TAINT allow arbitrary ANSI codes? */
      /* TAINT check whether color_name is known */
      var color_code;
      color_code = color_codes[color_name];
      //.......................................................................................................
      /* TAINT give function an informative name */
      return function(...P) {
        /* TAINT partial re-implementation of `pen()` */
        var R, p, parts, prv_color_code;
        prv_color_code = color_stack.at(-1);
        color_stack.push(color_code);
        parts = (function() {
          var i, len, results;
          results = [];
          for (i = 0, len = P.length; i < len; i++) {
            p = P[i];
            results.push(color_code + (_GUY.trm.pen(p)) + prv_color_code);
          }
          return results;
        })();
        R = (parts.join(_H._trm_cfg.separator)) + color_stack.pop();
        return R;
      };
    };
    //.........................................................................................................
    red = get_color_method('red');
    yellow = get_color_method('yellow');
    gold = get_color_method('gold');
    blue = get_color_method('blue');
    lime = get_color_method('lime');
    plum = get_color_method('plum');
    //.........................................................................................................
    info("this", red("is", "---", gold("a nice"), "!!!", lime("example", plum("of"), "nested")), "colors");
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "GUY.trm.rpr" ]
      // test @[ "GUY.src.parse() accepts `fallback` argument, otherwise errors where appropriate" ]
      // test @GUY_trm_strip_ansi
      demo_replace_line();
      return demo_color_memory();
    })();
  }

}).call(this);

//# sourceMappingURL=trm.tests.js.map