(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, jr, log, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERTEXT/TESTS/HTML';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  //...........................................................................................................
  test = require('guy-test');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["HTML parse compact tagname"] = async function(T, done) {
    var HTMLISH, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({HTMLISH} = require('../../../apps/intertext'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        'mrg:loc.delete#title',
        {
          prefix: 'mrg',
          name: 'loc',
          class: ['delete'],
          id: 'title'
        }
      ],
      [
        'mrg:loc#title.delete',
        {
          prefix: 'mrg',
          name: 'loc',
          class: ['delete'],
          id: 'title'
        }
      ],
      [
        'mrg:loc.foo#title.bar.baz',
        {
          prefix: 'mrg',
          name: 'loc',
          class: ['foo',
        'bar',
        'baz'],
          id: 'title'
        },
        null
      ],
      [
        'mrg:loc.foo#title.bar.baz',
        {
          prefix: 'mrg',
          name: 'loc',
          class: ['foo',
        'bar',
        'baz'],
          id: 'title'
        },
        null
      ],
      ['mrg:loc.foo#title#bar#baz',
      null,
      /found duplicate values for 'id': 'title', 'bar'/]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = HTMLISH.parse_compact_tagname(probe);
          resolve(result);
          return null;
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => { // await do =>
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=htmlish.test.js.map