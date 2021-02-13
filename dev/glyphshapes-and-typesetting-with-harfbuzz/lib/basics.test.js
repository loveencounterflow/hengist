(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, jr, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DATOM/TESTS/BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  //...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = types

  //-----------------------------------------------------------------------------------------------------------
  this["HB.shape_text() fails on nonexisting font file"] = async function(T, done) {
    var HB, error, i, len, matcher, probe, probes_and_matchers;
    HB = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz');
    probes_and_matchers = [
      [
        {
          text: 'x',
          font: {
            path: 'nosuchfile'
          }
        },
        null,
        "hb-view: Couldn't read or find nosuchfile, or it was empty."
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d;
          d = HB.shape_text(probe);
          resolve(d);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=basics.test.js.map