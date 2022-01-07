(function() {
  'use strict';
  var CND, PATH, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HDML/TESTS/BASIC';

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

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["basics"] = async function(T, done) {
    var HDML, Hdml, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({HDML, Hdml} = require('../../../apps/hdml'));
    //.........................................................................................................
    probes_and_matchers = [
      [['<',
      'foo'],
      '<foo>',
      null],
      [['<',
      'foo',
      null],
      '<foo>',
      null],
      [['<',
      'foo',
      {}],
      '<foo>',
      null],
      [
        [
          '<',
          'foo',
          {
            a: 42,
            b: "'",
            c: '"'
          }
        ],
        `<foo a='42' b='&#39;' c='"'>`,
        null
      ],
      [
        [
          '^',
          'foo',
          {
            a: 42,
            b: "'",
            c: '"'
          }
        ],
        `<foo a='42' b='&#39;' c='"'/>`,
        null
      ],
      [
        [
          '^',
          'prfx:foo',
          {
            a: 42,
            b: "'",
            c: '"'
          }
        ],
        `<prfx:foo a='42' b='&#39;' c='"'/>`,
        null
      ],
      [['^',
      'mrg:loc#baselines'],
      '<mrg:loc#baselines/>',
      null],
      [['>',
      'foo'],
      '</foo>',
      null]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = HDML.create_tag(...probe);
          resolve(result);
          return null;
        });
      });
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this["basics"]);
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map