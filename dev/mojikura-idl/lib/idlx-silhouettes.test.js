(function() {
  'use strict';
  var CND, IDL, IDLX, alert, badge, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOJIKURA-IDL/TESTS/SILHOUETTES';

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

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) silhouettes"] = function(T, done) {
    var i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [["⿱⿰⿵𠘨䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "bbb..b..bb..b.."], ["⿱⿰⿵&#123;䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "bbb..b..bb..b.."], ["⿱⿰⿵&#x123;䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "bbb..b..bb..b.."], ["⿱⿰⿵&jzr#123;䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "bbb..b..bb..b.."], ["⿱⿰⿵&jzr#x123;䖝⿵𠘨䖝⿰⿵𠘨䖝⿵𠘨䖝", "bbb..b..bb..b.."], ["(⿰金(⿱亠口子)夊)", "(b.(b...).)"], ["⿰(⿱亠口子)夊", "b(b...)."], ["(⿱⿰冫士寸)", "(bb....)"], ["⿶≈凵王", "bu.."], ["⿶≈凵⿱爫臼", "bu.b.."], ["⿶?凵⿱爫臼", "bu.b.."], ["⿱卄⿻≈巾⿰糹虫", "b.bu.b.."], ["↻凹", "u."], ["∅", "s"], ["●", "s"], ["▽", "s"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = IDLX.silhouette_from_formula(probe);
      debug(JSON.stringify([probe, result]));
      if (result === matcher) {
        T.ok(true);
      } else {
        T.fail(`${rpr(probe)}: expected ${rpr(matcher)}, got ${rpr(result)}`);
      }
    }
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=idlx-silhouettes.test.js.map