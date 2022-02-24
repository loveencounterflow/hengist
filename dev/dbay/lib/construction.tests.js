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
    var DBay, DBay2, abspath, autolocation, error, i, join, len, matcher, probe, probes_and_matchers, relpath, resolved_path, x;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    resolved_path = PATH.resolve(process.cwd(), 'mypath');
    autolocation = (require('../../../apps/dbay/lib/helpers')).autolocation;
    join = function(...P) {
      return PATH.resolve(PATH.join(...P));
    };
    DBay2 = (function() {
      class DBay2 extends DBay {};

      DBay2._skip_sqlt = true;

      return DBay2;

    }).call(this);
    //.........................................................................................................
    // { work_path: db_path, } = await H.procure_db { size: 'small', ref: 'ctor-1', }
    // info '^3443^', { db_path, }
    //.........................................................................................................
    relpath = 'mypath/myname';
    abspath = PATH.resolve(process.cwd(), PATH.join(relpath));
    probes_and_matchers = [
      //-------------------------------------------------------------------------------------------------------
      null,
      [
        {
          random_seed: 1,
          random_delta: 1,
          temporary: null
        },
        {
          path: join(autolocation,
        'dbay-7388632709.sqlite'),
          temporary: true
        },
        null
      ],
      [
        {
          random_seed: 1,
          random_delta: 1,
          temporary: false
        },
        {
          path: join(autolocation,
        'dbay-7388632709.sqlite'),
          temporary: false
        },
        null
      ],
      [
        {
          random_seed: 1,
          random_delta: 1,
          temporary: true
        },
        {
          path: join(autolocation,
        'dbay-7388632709.sqlite'),
          temporary: true
        },
        null
      ],
      [
        {
          path: relpath,
          temporary: null
        },
        {
          path: abspath,
          temporary: false
        },
        null
      ],
      [
        {
          path: relpath,
          temporary: false
        },
        {
          path: abspath,
          temporary: false
        },
        null
      ],
      [
        {
          path: relpath,
          temporary: true
        },
        {
          path: abspath,
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
          var db, k, result;
          db = new DBay2(probe);
          result = {...db.cfg};
          for (k in result) {
            if (k !== 'path' && k !== 'temporary') {
              delete result[k];
            }
          }
          // debug '^657561^', result, matcher, equals result, matcher
          //...................................................................................................
          // debug '^341^', db
          // debug '^341^', db._dbs
          return resolve(result);
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
    info('^908-2^', db.sqlt1.constructor === bsqlite_class);
    //.........................................................................................................
    if (T != null) {
      T.ok(db.sqlt1.constructor === bsqlite_class);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY instance has property `alt` (alternative connection)"] = function(T, done) {
    var DBay, Sqlt, bsqlite_class, db, i, n;
    if (T != null) {
      T.halt_on_error();
    }
    ({DBay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    bsqlite_class = Sqlt().constructor;
    db = new DBay();
    //.........................................................................................................
    // db.open { schema: 'main', }
    db.execute(SQL`create table foo ( n integer );
create table bar ( n integer );`);
    for (n = i = 10; i <= 12; n = ++i) {
      db(SQL`insert into foo ( n ) values ( $n );`, {n});
    }
    (() => {      //.........................................................................................................
      var error;
      help('^806-1^ ------------------------');
      error = null;
      try {
        db.with_transaction(() => {
          var ref, row;
          ref = db(SQL`select * from foo order by n;`);
          for (row of ref) {
            info('^806-2^', row);
            db(SQL`insert into bar values ( $n );`, {
              n: n ** 2
            });
          }
          return null;
        });
      } catch (error1) {
        error = error1;
        warn(error.name, error.message);
      }
      if (error == null) {
        return T != null ? T.fail("^806-3^ expected error, got none") : void 0;
      }
    })();
    (() => {      // #.........................................................................................................
      // do =>
      //   help '^806-4^ ------------------------'
      //   insert_into_bar = db.prepare SQL"insert into bar values ( $n ) returning *;"
      //   db.with_transaction =>
      //     for { n, } from ( db.sqlt2.prepare SQL"select * from foo order by n;" ).iterate()
      //       info '^806-5^', { n, }
      //       urge '^806-6^', insert_into_bar.get { n: n ** 2, }
      //     return null
      // #.........................................................................................................
      // do =>
      //   help '^806-7^ ------------------------'
      //   db.with_transaction =>
      //     for { n, } from ( db.sqlt2.prepare SQL"select * from foo order by n;" ).iterate()
      //       info '^806-8^', { n, }
      //       urge '^806-9^', db.first_row SQL"insert into bar values ( $n ) returning *;", { n: n ** 2, }
      //     return null
      //.........................................................................................................
      var insert_into_bar;
      help('^806-10^ ------------------------');
      insert_into_bar = db.prepare(SQL`insert into bar values ( $n ) returning *;`);
      return db.with_transaction(() => {
        var ref, y;
        ref = db.alt(SQL`select * from foo order by n;`);
        for (y of ref) {
          ({n} = y);
          //             ^^^^^^
          info('^806-12^', {n});
          urge('^806-13^', db.first_row(SQL`insert into bar values ( $n ) returning *;`, {
            n: n ** 2
          }));
        }
        return null;
      });
    })();
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
      T.eq((Object.getOwnPropertyDescriptor(db, 'rnd')).enumerable, false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "DBAY _get-autolocation" ]
      // test @[ "DBAY constructor arguments 1" ]
      return this["DBAY instance has property `alt` (alternative connection)"]();
    })();
  }

  // test @[ "DBAY URL/path conversion" ]
// test @[ "xxx" ]
// test @[ "DBAY instance has two connections" ]
// test @[ "DBAY instance non-enumerable properties" ]

}).call(this);

//# sourceMappingURL=construction.tests.js.map