(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/CONSTRUCTION';

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

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY _get-autolocation"] = function(T, done) {
    var Dbay, ref;
    ({Dbay} = require(H.dbay_path));
    H = require(PATH.join(H.dbay_path, 'lib/helpers'));
    if (T != null) {
      T.eq(H.is_directory('/tmp'), true);
    }
    if (T != null) {
      T.eq(H.is_directory('/nonexistant-path-395827345826345762347856374562'), false);
    }
    if (T != null) {
      T.eq(H.is_directory(__filename), false);
    }
    if (T != null) {
      T.eq(H.is_directory(__dirname), true);
    }
    if (T != null) {
      T.ok((ref = H.autolocation) === '/dev/shm' || ref === (require('os')).tmpdir());
    }
    if (T != null) {
      T.eq(Dbay.C.autolocation, H.autolocation);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY constructor arguments 1"] = async function(T, done) {
    var Dbay, Dbay2, error, i, len, matcher, probe, probes_and_matchers, resolved_path, x;
    ({Dbay} = require(H.dbay_path));
    resolved_path = PATH.resolve(process.cwd(), 'mypath');
    Dbay2 = (function() {
      class Dbay2 extends Dbay {};

      Dbay2._skip_sqlt = true;

      Dbay2._rnd_int_cfg = true;

      return Dbay2;

    }).call(this);
    //.........................................................................................................
    // { work_path: db_path, } = await H.procure_db { size: 'small', ref: 'ctor-1', }
    // info '^3443^', { db_path, }
    //.........................................................................................................
    probes_and_matchers = [
      //-------------------------------------------------------------------------------------------------------
      null,
      [
        {
          // [ { location: null, path: null, name: null, }, null, null,              ]
          // [ { location: 'mylocation', path: null, name: 'myname', temporary: false, }, null, null,              ]
          // [ { location: 'mylocation', path: null, name: 'myname', temporary: true, }, null, "cannot have `temporary: true` together with `path` or `name`",              ]
          // [ { location: null, path: null, name: 'myname', temporary: true, }, null, "cannot have `temporary: true` together with `path` or `name`",              ]
          path: null,
          temporary: null
        },
        {
          path: '/dev/shm/dbay-6200294332.sqlite',
          temporary: true
        },
        null
      ],
      [
        {
          path: null,
          temporary: false
        },
        {
          path: '/dev/shm/dbay-6200294332.sqlite',
          temporary: false
        },
        null
      ],
      [
        {
          path: 'mypath/myname',
          temporary: null
        },
        {
          path: '/home/flow/jzr/dbay/mypath/myname',
          temporary: false
        },
        null
      ],
      [
        {
          path: 'mypath/myname',
          temporary: true
        },
        {
          path: '/home/flow/jzr/dbay/mypath/myname',
          temporary: true
        },
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      x = probes_and_matchers[i];
      if (x === null) {
        whisper('-'.repeat(108));
        continue;
      }
      [probe, matcher, error] = x;
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          (() => {
            var k, result;
            result = {...(new Dbay2(probe)).cfg};
            for (k in result) {
              if (k !== 'path' && k !== 'tempory') {
                delete result[k];
              }
            }
            //...................................................................................................
            return resolve(matcher);
          })();
          return null;
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY instance has two connections"] = function(T, done) {
    var Dbay, Sqlt, bsqlite_class, db;
    ({Dbay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    bsqlite_class = Sqlt().constructor;
    db = new Dbay();
    // debug '^332^', db
    // debug '^332^', db.cfg
    if (T != null) {
      T.eq(db.sqlt1.name, db.sqlt2.name);
    }
    if (T != null) {
      T.ok(db.sqlt1.constructor === bsqlite_class);
    }
    if (T != null) {
      T.ok(db.sqlt2.constructor === bsqlite_class);
    }
    if (T != null) {
      T.ok(db.sqlt2.constructor === db.sqlt1.constructor);
    }
    if (T != null) {
      T.ok(db.sqlt2 !== db.sqlt1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY instance non-enumerable properties"] = function(T, done) {
    var Dbay, Sqlt, db;
    ({Dbay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    db = new Dbay();
    debug('^332^', db);
    if (T != null) {
      T.eq((Object.getOwnPropertyDescriptor(db, 'sqlt1')).enumerable, false);
    }
    if (T != null) {
      T.eq((Object.getOwnPropertyDescriptor(db, 'sqlt2')).enumerable, false);
    }
    if (T != null) {
      T.eq((Object.getOwnPropertyDescriptor(db, '_rnd_int')).enumerable, false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "DBAY attach memory connections" ]
      // @[ "DBAY attach memory connections" ]()
      return test(this["DBAY constructor arguments 1"]);
    })();
  }

  // test @[ "DBAY _get-autolocation" ]
// test @[ "DBAY instance non-enumerable properties" ]
// test @[ "DBAY: _get_connection_url()" ]
// test @[ "DBAY instance has two connections" ]

}).call(this);

//# sourceMappingURL=construction.tests.js.map