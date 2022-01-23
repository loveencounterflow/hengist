(function() {
  'use strict';
  var CND, IDL, IDLX, alert, badge, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOJIKURA-IDL/tests';

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

  ({IDL, IDLX} = require('../../../apps/mojikura-idl'));

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, equals} = types.export());

  //===========================================================================================================
  // TESTS (IDL)
  //-----------------------------------------------------------------------------------------------------------
  this["(IDL) parse simple formulas"] = function(T, done) {
    var i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [["⿲木木木", ["⿲", "木", "木", "木"]], ["⿱刀口", ["⿱", "刀", "口"]], ["⿱癶⿰弓貝", ["⿱", "癶", ["⿰", "弓", "貝"]]], ["⿱⿰亻式貝", ["⿱", ["⿰", "亻", "式"], "貝"]], ["⿱⿰亻式⿱目八", ["⿱", ["⿰", "亻", "式"], ["⿱", "目", "八"]]], ["⿺辶言", ["⿺", "辶", "言"]], ["⿰ab", ["⿰", "a", "b"]], ["⿰⿰abc", ["⿰", ["⿰", "a", "b"], "c"]], ["⿱⿱刀口乙", ["⿱", ["⿱", "刀", "口"], "乙"]], ["⿱⿱刀口乙", ["⿱", ["⿱", "刀", "口"], "乙"]], ["⿱&jzr#xe24a;&jzr#xe11d;", ["⿱", "", ""]], ["⿰𠁣𠃛", ["⿰", "𠁣", "𠃛"]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      // result = resume_next T, -> IDL.parse probe
      result = IDL.parse(probe);
      urge(CND.truth(equals(result, matcher)), JSON.stringify([probe, result]));
      // urge ( rpr probe ), result
      T.ok(equals(result, matcher));
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDL) reject bogus formulas"] = function(T, done) {
    var error, i, len, matcher, message, probe, probes_and_matchers, result;
    probes_and_matchers = [["木", 'Syntax error at index 0 (木)\nUnexpected "木"'], [42, 'expected a text, got a float'], ["", "expected a non-empty text, got an empty text"], ["⿱⿰亻式⿱目八木木木", 'Syntax error at index 7 (⿱⿰亻式⿱目八木木木)\nUnexpected "木"'], ["⿺廴聿123", 'Syntax error at index 3 (⿺廴聿123)\nUnexpected "1".'], ["⿺", "Syntax Error: '⿺'"], ["⿺⿺⿺⿺", "Syntax Error: '⿺⿺⿺⿺'"], ["(⿰亻聿式)", 'Syntax error at index 0 ((⿰亻聿式))\nUnexpected "(".'], ["≈〇", 'Syntax error at index 0 (≈〇)\nUnexpected "≈".'], ["●", 'Syntax error at index 0 (●)\nUnexpected "●".']];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      try {
        result = IDL.parse(probe);
        debug(rpr(probe), rpr(result));
        warn(`expected an exception, got result ${rpr(result)}`);
        T.fail(`expected an exception, got result ${rpr(result)}`);
      } catch (error1) {
        error = error1;
        ({message} = error);
        if (!message.startsWith(matcher)) {
          urge('^334^', "probe:             ", rpr(probe));
          warn('^334^', "expected message:  ", (rpr(matcher)).slice(0, 100));
          help('^334^', "got message:       ", (rpr(message)).slice(0, 100));
          message = (rpr(message)).slice(0, 100);
          T.fail(`message ${rpr(message)} doesn't start with ${rpr(matcher)}`);
        } else {
          T.ok(true);
        }
      }
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

  // test @[ "(IDL) reject bogus formulas" ]

}).call(this);

//# sourceMappingURL=idl.js.map