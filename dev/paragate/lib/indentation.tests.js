(function() {
  'use strict';
  var CND, H, INTERTEXT, alert, badge, debug, echo, help, info, isa, jr, lets, log, rpr, test, type_of, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/INDENTATION-TESTS';

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

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  ({isa, type_of} = INTERTEXT.types);

  ({lets} = (require('datom')).export());

  H = require('./test-helpers');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["INDENTATION: parse (1)"] = async function(T, done) {
    var INDENTATION, error, i, len, matcher, probe, probes_and_matchers;
    INDENTATION = require('../../../apps/paragate/lib/regex-whitespace.grammar');
    probes_and_matchers = [
      [
        'if 42:\n    43\nelse:\n  44',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 24,
            source: 'if 42:\n    43\nelse:\n  44',
            '$vnr': [-2e308]
          },
          {
            '$key': '^block',
            start: 0,
            stop: 7,
            text: 'if 42:\n',
            level: 0,
            linecount: 1,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^block',
            start: 7,
            stop: 14,
            text: '43\n',
            level: 4,
            linecount: 1,
            '$vnr': [2,
          1]
          },
          {
            '$key': '^block',
            start: 14,
            stop: 20,
            text: 'else:\n',
            level: 0,
            linecount: 1,
            '$vnr': [3,
          1]
          },
          {
            '$key': '^block',
            start: 20,
            stop: 24,
            text: '44',
            level: 2,
            linecount: 1,
            '$vnr': [4,
          1]
          },
          {
            '$key': '>document',
            start: 24,
            stop: 24,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '   x = 42',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 9,
            source: '   x = 42',
            '$vnr': [-2e308]
          },
          {
            '$key': '^block',
            start: 0,
            stop: 9,
            text: 'x = 42',
            level: 3,
            linecount: 1,
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 9,
            stop: 9,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '   <!-- xx -->',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 14,
            source: '   <!-- xx -->',
            '$vnr': [-2e308]
          },
          {
            '$key': '^block',
            start: 0,
            stop: 14,
            text: '<!-- xx -->',
            level: 3,
            linecount: 1,
            '$vnr': [1,
          1]
          },
          {
            '$key': '>document',
            start: 14,
            stop: 14,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        'L0\n  L1\n    L2\n      L3',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 23,
            source: 'L0\n  L1\n    L2\n      L3',
            '$vnr': [-2e308]
          },
          {
            '$key': '^block',
            start: 0,
            stop: 3,
            text: 'L0\n',
            level: 0,
            linecount: 1,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^block',
            start: 3,
            stop: 8,
            text: 'L1\n',
            level: 2,
            linecount: 1,
            '$vnr': [2,
          1]
          },
          {
            '$key': '^block',
            start: 8,
            stop: 15,
            text: 'L2\n',
            level: 4,
            linecount: 1,
            '$vnr': [3,
          1]
          },
          {
            '$key': '^block',
            start: 15,
            stop: 23,
            text: 'L3',
            level: 6,
            linecount: 1,
            '$vnr': [4,
          1]
          },
          {
            '$key': '>document',
            start: 23,
            stop: 23,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        'L0\n  L1\n    L2\n  L1',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 19,
            source: 'L0\n  L1\n    L2\n  L1',
            '$vnr': [-2e308]
          },
          {
            '$key': '^block',
            start: 0,
            stop: 3,
            text: 'L0\n',
            level: 0,
            linecount: 1,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^block',
            start: 3,
            stop: 8,
            text: 'L1\n',
            level: 2,
            linecount: 1,
            '$vnr': [2,
          1]
          },
          {
            '$key': '^block',
            start: 8,
            stop: 15,
            text: 'L2\n',
            level: 4,
            linecount: 1,
            '$vnr': [3,
          1]
          },
          {
            '$key': '^block',
            start: 15,
            stop: 19,
            text: 'L1',
            level: 2,
            linecount: 1,
            '$vnr': [4,
          1]
          },
          {
            '$key': '>document',
            start: 19,
            stop: 19,
            '$vnr': [2e308]
          }
        ],
        null
      ],
      [
        '\n  \n\nL0\n  L1\n\n    \nOK\n',
        [
          {
            '$key': '<document',
            start: 0,
            stop: 22,
            source: '\n  \n\nL0\n  L1\n\n    \nOK\n',
            '$vnr': [-2e308]
          },
          {
            '$key': '^blank',
            start: 0,
            stop: 5,
            text: '\n  \n\n',
            level: 0,
            linecount: 3,
            '$vnr': [1,
          1]
          },
          {
            '$key': '^block',
            start: 5,
            stop: 8,
            text: 'L0\n',
            level: 0,
            linecount: 1,
            '$vnr': [4,
          1]
          },
          {
            '$key': '^block',
            start: 8,
            stop: 13,
            text: 'L1\n',
            level: 2,
            linecount: 1,
            '$vnr': [5,
          1]
          },
          {
            '$key': '^blank',
            start: 13,
            stop: 19,
            text: '\n    \n',
            level: 0,
            linecount: 2,
            '$vnr': [6,
          1]
          },
          {
            '$key': '^block',
            start: 19,
            stop: 22,
            text: 'OK\n',
            level: 0,
            linecount: 1,
            '$vnr': [8,
          1]
          },
          {
            '$key': '^blank',
            start: 22,
            stop: 22,
            text: '',
            level: 0,
            linecount: 1,
            '$vnr': [9,
          1]
          },
          {
            '$key': '>document',
            start: 22,
            stop: 22,
            '$vnr': [2e308]
          }
        ],
        null
      ]
    ];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          // info d for d in INDENTATION.grammar.parse probe
          // urge d for d in H.delete_refs INDENTATION.grammar.parse probe
          return resolve(H.delete_refs(INDENTATION.grammar.parse(probe)));
        });
      });
    }
    // resolve null
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

  // test @[ "INDENTATION: parse (1)" ]

}).call(this);

//# sourceMappingURL=indentation.tests.js.map