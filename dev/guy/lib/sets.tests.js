(function() {
  'use strict';
  var CND, H, alert, badge, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/SETS';

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
  this.guy_sets_basics = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        {
          method: 'unite',
          sets: ['',
        '',
        '']
        },
        ''
      ],
      [
        {
          method: 'unite',
          sets: ['a',
        'b',
        'a']
        },
        'ab'
      ],
      [
        {
          method: 'unite',
          sets: ['ab',
        'cb',
        'a']
        },
        'abc'
      ],
      [
        {
          method: '_intersect',
          sets: ['',
        '']
        },
        ''
      ],
      [
        {
          method: '_intersect',
          sets: ['a',
        'b']
        },
        ''
      ],
      [
        {
          method: '_intersect',
          sets: ['ab',
        'cb']
        },
        'b'
      ],
      [
        {
          method: 'intersect',
          sets: ['',
        '']
        },
        ''
      ],
      [
        {
          method: 'intersect',
          sets: ['a',
        'b']
        },
        ''
      ],
      [
        {
          method: 'intersect',
          sets: ['ab',
        'cb']
        },
        'b'
      ],
      [
        {
          method: 'intersect',
          sets: ['a',
        'b',
        'c']
        },
        ''
      ],
      [
        {
          method: 'intersect',
          sets: ['ab',
        'cb']
        },
        'b'
      ],
      [
        {
          method: 'intersect',
          sets: ['abcdefghijklmnopqrstuvwxyz',
        'das da']
        },
        'ads'
      ],
      [
        {
          method: 'subtract',
          sets: ['abcdefghijklmnopqrstuvwxyz',
        'das da']
        },
        'bcefghijklmnopqrtuvwxyz'
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var method, result, s, sets;
          ({method, sets} = probe);
          sets = (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = sets.length; j < len1; j++) {
              s = sets[j];
              results.push(new Set(s));
            }
            return results;
          })();
          result = GUY.sets[method](...sets);
          if (T != null) {
            T.ok(isa.set(result));
          }
          result = [...result].join('');
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this.guy_sets_basics);
    })();
  }

}).call(this);

//# sourceMappingURL=sets.tests.js.map