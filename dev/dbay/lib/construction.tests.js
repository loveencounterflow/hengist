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
  this["DBAY constructor arguments 1"] = async function(T, done) {
    var Dbay, Dbay2, db_path, error, i, len, matcher, probe, probes_and_matchers, x;
    ({Dbay} = require(H.dbay_path));
    Dbay2 = (function() {
      class Dbay2 extends Dbay {};

      Dbay2._rnd_int_cfg = true;

      return Dbay2;

    }).call(this);
    ({
      //.........................................................................................................
      work_path: db_path
    } = (await H.procure_db({
      size: 'small',
      ref: 'ctor-1'
    })));
    info('^3443^', {db_path});
    //.........................................................................................................
    probes_and_matchers = [
      [
        {
          //-------------------------------------------------------------------------------------------------------
          ram: false,
          path: null,
          dbnick: null
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 5  */
      ram: false,
          path: null,
          dbnick: 'dbnick'
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 6  */
      ram: null,
          path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 8  */
      //.......................................................................................................
      ram: null,
          path: null,
          dbnick: null
        },
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 1  */
      ram: null,
          path: null,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 2  */
      ram: null,
          path: db_path,
          dbnick: null
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: db_path,
          dbnick: null
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 7  */
      ram: true,
          path: null,
          dbnick: null
        },
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 9  */
      ram: true,
          path: null,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 10 */
      ram: true,
          path: db_path,
          dbnick: null
        },
        {
          ram: true,
          path: db_path,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: db_path,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: db_path,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      /* 12 */
      //-------------------------------------------------------------------------------------------------------
      null,
      [
        {
          ram: false,
          path: void 0,
          dbnick: void 0
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 5  */
      ram: false,
          path: void 0,
          dbnick: 'dbnick'
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 6  */
      ram: void 0,
          path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 8  */
      //.......................................................................................................
      ram: void 0,
          path: void 0,
          dbnick: void 0
        },
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 1  */
      ram: void 0,
          path: void 0,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 2  */
      ram: void 0,
          path: db_path,
          dbnick: void 0
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: db_path,
          dbnick: void 0
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 7  */
      ram: true,
          path: void 0,
          dbnick: void 0
        },
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 9  */
      ram: true,
          path: void 0,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 10 */
      ram: true,
          path: db_path,
          dbnick: void 0
        },
        {
          ram: true,
          path: db_path,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: db_path,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: db_path,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      /* 12 */
      //-------------------------------------------------------------------------------------------------------
      null,
      [
        {
          ram: false
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 5  */
      ram: false,
          dbnick: 'dbnick'
        },
        null,
        "missing argument `path`"
      ],
      [
        {
          /* 6  */
      path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: db_path,
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        /* 8  */
      //.......................................................................................................
      null,
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 1  */
      dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 2  */
      path: db_path
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: db_path
        },
        {
          ram: false,
          path: db_path
        },
        null
      ],
      [
        {
          /* 7  */
      ram: true
        },
        {
          ram: true,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 9  */
      ram: true,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 10 */
      ram: true,
          path: db_path
        },
        {
          ram: true,
          path: db_path,
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: db_path,
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: db_path,
          dbnick: 'dbnick',
          url: 'file:dbnick?mode=memory&cache=shared'
        },
        null
      ]
    ];
//.........................................................................................................
/* 12 */    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
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
              if (k !== 'ram' && k !== 'path' && k !== 'dbnick' && k !== 'url') {
                delete result[k];
              }
            }
            // resolve result
            return resolve(result);
          })();
          return null;
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY: _get_connection_url()"] = function(T, done) {
    var Dbay, Dbay2, db;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    Dbay2 = (function() {
      //.........................................................................................................
      class Dbay2 extends Dbay {};

      Dbay2._rnd_int_cfg = true;

      return Dbay2;

    }).call(this);
    //.........................................................................................................
    db = new Dbay2({
      ram: null
    });
    if (T != null) {
      T.eq(db._get_connection_url(), {
        url: 'file:_4260041910?mode=memory&cache=shared',
        dbnick: '_4260041910'
      });
    }
    if (T != null) {
      T.eq(db._get_connection_url(), {
        url: 'file:_9982321802?mode=memory&cache=shared',
        dbnick: '_9982321802'
      });
    }
    if (T != null) {
      T.eq(db._get_connection_url(), {
        url: 'file:_2420402559?mode=memory&cache=shared',
        dbnick: '_2420402559'
      });
    }
    if (T != null) {
      T.eq(db._get_connection_url(), {
        url: 'file:_1965667491?mode=memory&cache=shared',
        dbnick: '_1965667491'
      });
    }
    if (T != null) {
      T.eq(db._get_connection_url(), {
        url: 'file:_7714686943?mode=memory&cache=shared',
        dbnick: '_7714686943'
      });
    }
    if (T != null) {
      T.eq(db._get_connection_url('yournamehere'), {
        url: 'file:yournamehere?mode=memory&cache=shared',
        dbnick: 'yournamehere'
      });
    }
    //.........................................................................................................
    info(db._get_connection_url());
    info(db._get_connection_url('yournamehere'));
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
      return test(this);
    })();
  }

  // test @[ "DBAY attach memory connections" ]
// @[ "DBAY attach memory connections" ]()
// test @[ "DBAY constructor arguments 1" ]
// test @[ "DBAY instance non-enumerable properties" ]
// test @[ "DBAY: _get_connection_url()" ]
// test @[ "DBAY instance has two connections" ]

}).call(this);

//# sourceMappingURL=construction.tests.js.map