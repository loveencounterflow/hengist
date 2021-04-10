(function() {
  //!node
  var CND, Intertype, alert, badge, debug, echo, help, info, isa, log, stderr, stdin, stdout, test, to_width, type_of, types, urge, validate, warn, whisper, width_of;

  CND = require('cnd');

  badge = 'DIFF';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({stdin, stdout, stderr} = process);

  ({Intertype} = require('intertype'));

  types = new Intertype();

  ({isa, validate, type_of} = types.export());

  ({to_width, width_of} = require('to-width'));

  // CAT                       = require 'multimix/lib/cataloguing'
  //...........................................................................................................
  test = require('guy-test');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["DIFF rawdiff"] = async function(T, done) {
    var INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    //.........................................................................................................
    probes_and_matchers = [[['helo world', 'Hello World!'], [[-1, 'he'], [1, 'Hel'], [0, 'lo '], [-1, 'w'], [1, 'W'], [0, 'orld'], [1, '!']], null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var new_text, old_text, result;
          [old_text, new_text] = probe;
          result = INTERTEXT.DIFF.rawdiff(old_text, new_text);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DIFF colordiff"] = async function(T, done) {
    /* TAINT should discard / replace color codes to make test less brittle */
    var DIFF, INTERTEXT, error, i, len, matcher, probe, probes_and_matchers;
    INTERTEXT = require('../../../apps/intertext');
    DIFF = INTERTEXT.DIFF.new({
      tty_columns: 50
    });
    //.........................................................................................................
    probes_and_matchers = [[['helo world', 'Hello World!'], '\x1B[7m\x1B[38;05;208mhe\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118mHel\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255mlo \x1B[0m\x1B[27m\x1B[7m\x1B[38;05;208mw\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118mW\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255morld\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;118m!\x1B[0m\x1B[27m\x1B[7m\x1B[38;05;255m                                   \n', null]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var new_text, old_text, result;
          [old_text, new_text] = probe;
          result = DIFF.colordiff(old_text, new_text);
          process.stdout.write(result);
          return resolve(result);
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=diff.test.js.map