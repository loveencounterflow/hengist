(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY _get-autolocation"] = function(T, done) {
    var DBay, DH, ref;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    if (T != null) {
      T.eq(DH.is_directory('/tmp'), true);
    }
    if (T != null) {
      T.eq(DH.is_directory('/nonexistant-path-395827345826345762347856374562'), false);
    }
    if (T != null) {
      T.eq(DH.is_directory(__filename), false);
    }
    if (T != null) {
      T.eq(DH.is_directory(__dirname), true);
    }
    if (T != null) {
      T.ok((ref = DH.autolocation) === '/dev/shm' || ref === (require('os')).tmpdir());
    }
    if (T != null) {
      T.eq(DBay.C.autolocation, DH.autolocation);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY constructor arguments 1"] = async function(T, done) {
    var DBay, DBay2, error, i, len, matcher, probe, probes_and_matchers, resolved_path, x;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    resolved_path = PATH.resolve(process.cwd(), 'mypath');
    DBay2 = (function() {
      class DBay2 extends DBay {};

      DBay2._skip_sqlt = true;

      DBay2._rnd_int_cfg = true;

      return DBay2;

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
          path: null,
          temporary: true
        },
        {
          path: '/dev/shm/dbay-6200294332.sqlite',
          temporary: true
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
          temporary: false
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
            var db, k, result;
            db = new DBay2(probe);
            result = {...db.cfg};
            for (k in result) {
              if (k !== 'path' && k !== 'tempory') {
                delete result[k];
              }
            }
            //...................................................................................................
            // debug '^341^', db
            // debug '^341^', db._dbs
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
    var DBay, Sqlt, bsqlite_class, db;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    bsqlite_class = Sqlt().constructor;
    db = new DBay();
    // debug '^332^', db
    // debug '^332^', db.cfg
    //.........................................................................................................
    info('^908-1^', equals(db.sqlt1.name, db.sqlt2.name));
    info('^908-2^', db.sqlt1.constructor === bsqlite_class);
    info('^908-3^', db.sqlt2.constructor === bsqlite_class);
    info('^908-4^', db.sqlt2.constructor === db.sqlt1.constructor);
    info('^908-5^', db.sqlt2 !== db.sqlt1);
    //.........................................................................................................
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
    var DBay, Sqlt, db;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    db = new DBay();
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
      return test(this);
    })();
  }

  // test @[ "DBAY _get-autolocation" ]
// test @[ "DBAY constructor arguments 1" ]
// test @[ "DBAY instance has two connections" ]
// test @[ "DBAY instance non-enumerable properties" ]

}).call(this);

//# sourceMappingURL=construction.tests.js.map