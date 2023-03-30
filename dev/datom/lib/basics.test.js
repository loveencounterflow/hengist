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
  this["fresh_datom (freeze)"] = async function(T, done) {
    var DATOM, error, i, len, matcher, probe, probes_and_matchers;
    ({DATOM} = require('../../../apps/datom'));
    probes_and_matchers = [
      [
        ['^foo'],
        {
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        [
          '^foo',
          {
            foo: 'bar'
          }
        ],
        {
          foo: 'bar',
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        ['^foo',
        42],
        {
          '$value': 42,
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        [
          '^foo',
          42,
          {
            '$fresh': false
          }
        ],
        {
          '$value': 42,
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d;
          d = DATOM.new_fresh_datom(...probe);
          T.ok(Object.isFrozen(d));
          resolve(d);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["fresh_datom (nofreeze)"] = async function(T, done) {
    var DATOM, error, i, len, matcher, probe, probes_and_matchers;
    DATOM = new (require('../../../apps/datom')).Datom({
      freeze: false
    });
    probes_and_matchers = [
      [
        ['^foo'],
        {
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        [
          '^foo',
          {
            foo: 'bar'
          }
        ],
        {
          foo: 'bar',
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        ['^foo',
        42],
        {
          '$value': 42,
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ],
      [
        [
          '^foo',
          42,
          {
            '$fresh': false
          }
        ],
        {
          '$value': 42,
          '$fresh': true,
          '$key': '^foo'
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d;
          d = DATOM.new_fresh_datom(...probe);
          T.ok(!Object.isFrozen(d));
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