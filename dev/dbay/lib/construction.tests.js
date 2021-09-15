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
    var Dbay, Dbay2, error, i, len, matcher, probe, probes_and_matchers, x;
    ({Dbay} = require(H.dbay_path));
    Dbay2 = (function() {
      class Dbay2 extends Dbay {};

      Dbay2._rnd_int_cfg = true;

      return Dbay2;

    }).call(this);
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
          path: 'db/path',
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: 'db/path',
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
          path: 'db/path',
          dbnick: null
        },
        {
          ram: false,
          path: 'db/path'
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: 'db/path',
          dbnick: null
        },
        {
          ram: false,
          path: 'db/path'
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
          path: 'db/path',
          dbnick: null
        },
        {
          ram: true,
          path: 'db/path',
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: 'db/path',
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
          path: 'db/path',
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: 'db/path',
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
          path: 'db/path',
          dbnick: void 0
        },
        {
          ram: false,
          path: 'db/path'
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: 'db/path',
          dbnick: void 0
        },
        {
          ram: false,
          path: 'db/path'
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
          path: 'db/path',
          dbnick: void 0
        },
        {
          ram: true,
          path: 'db/path',
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: 'db/path',
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
      path: 'db/path',
          dbnick: 'dbnick'
        },
        null,
        "only RAM DB can have both `path` and `dbnick`"
      ],
      [
        {
          /* 4  */
      ram: false,
          path: 'db/path',
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
      path: 'db/path'
        },
        {
          ram: false,
          path: 'db/path'
        },
        null
      ],
      [
        {
          /* 3  */
      ram: false,
          path: 'db/path'
        },
        {
          ram: false,
          path: 'db/path'
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
          path: 'db/path'
        },
        {
          ram: true,
          path: 'db/path',
          dbnick: '_6200294332',
          url: 'file:_6200294332?mode=memory&cache=shared'
        },
        null
      ],
      [
        {
          /* 11 */
      ram: true,
          path: 'db/path',
          dbnick: 'dbnick'
        },
        {
          ram: true,
          path: 'db/path',
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
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY instance has two connections"] = function(T, done) {
    var Dbay, Sqlt, bsqlite_class, dbay;
    ({Dbay} = require(H.dbay_path));
    Sqlt = require(PATH.join(H.dbay_path, 'node_modules/better-sqlite3'));
    bsqlite_class = Sqlt().constructor;
    dbay = new Dbay();
    if (T != null) {
      T.ok(dbay.sqlt1.constructor === bsqlite_class);
    }
    if (T != null) {
      T.ok(dbay.sqlt2.constructor === bsqlite_class);
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DBAY attach memory connections" ] = ( T, done ) ->
  //   ### thx to https://github.com/JoshuaWise/better-sqlite3/issues/102#issuecomment-445606946 ###
  //   # bsqlite_path    = PATH.resolve PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  //   bsqlite_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3'
  //   wrapper_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/lib/methods/wrappers.js'
  //   bindings_path   = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/bindings'
  //   node_path_1     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
  //   node_path_2     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/obj.target/better_sqlite3.node'
  //   # bsqlite_path    = require.resolve 'better-sqlite3'
  //   debug '^2233^', "path to better-sqlite3:", bsqlite_path
  //   Sqlt            = require bsqlite_path
  //   sqlt            = Sqlt ':memory:'
  //   # wrapper         = require wrapper_path
  //   debug '^290-1^', ( k for k of sqlt._wrappers )
  //   # debug '^290-2^', sqlt._wrappers.getters.open
  //   # debug '^290-3^', sqlt._wrappers.unsafeMode()
  //   # debug '^290-3^', sqlt._wrappers.exec()
  //   debug '^290-3^', sqlt._wrappers.get_cppdb()
  //   # { Database: CPPDatabase, setErrorConstructor, }
  //   debug '^490^', bindings = require bindings_path
  //   debug '^490^', node_path_1
  //   debug '^490^', node_path_2
  //   debug '^490^', { Database: Db1, } = require node_path_1
  //   debug '^490^', { Database: Db2, } = require node_path_2
  //   # new CPPDatabase(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null)
  //   debug '^490^', db1 = new Db1 ':memory:', ':memory:', true, false, false, 5000, null, null
  //   debug '^490^', db1a = new Db1 'file:your_db_name_here?mode=memory&cache=shared', 'file:your_db_name_here?mode=memory&cache=shared', true, false, false, 5000, null, null
  //   debug '^490^', db1b = new Db1 'file:your_db_name_here?mode=memory&cache=shared', 'file:your_db_name_here?mode=memory&cache=shared', true, false, false, 5000, null, null
  //   db1a.exec SQL"create table x ( n text );"
  //   db1b.exec SQL"insert into x ( n ) values ( 'helo world' );"
  //   select = db1b.prepare SQL"select * from x;", {}, false
  //   debug '^340^', select.run()
  //   for row from select.iterate()
  //     info row
  //   # debug '^490^', bindings node_path_1
  //   # debug '^490^', bindings node_path_2
  //   #---------------------------------------------------------------------------------------------------------
  //   return done?()
  //   # debug db = Sqlt ':memory:'
  //   { template_path
  //     work_path }     = await H.procure_db { size: 'small', ref: 'F-open', reuse: true, }
  //   name_as_url = ( name ) ->
  //     # This function is defined here: https://www.sqlite.org/uri.html#the_uri_path
  //     name_u = name
  //     name_u = name_u.replace /#/g, '%23'
  //     name_u = name_u.replace /\?/g, '%3f'
  //     name_u = name_u.replace /\/\/+/g, '/'
  //     return "file:#{name_u}?mode=memory&cache=shared';"
  //   foo_path  = work_path
  //   db_foo    = Sqlt foo_path
  //   debug '^554^', db_foo
  //   debug '^554^', foo_path
  //   db_bar    = Sqlt ':memory:' # , { memory: true }
  //   url       = name_as_url 'bar'
  //   debug '^3344^', { url, }
  //   attach    = db_foo.prepare SQL"attach database $url as bar"
  //   attach.run { url, }
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY attach memory connections"] = function(T, done) {
    var Db1, new_connection, node_path_1, ref, row, select, sqlt1, sqlt2;
    /* TAINT consider to use `bindings` module to automate finding the `better-sqlite3.node` file */
    // bsqlite_path    = PATH.resolve PATH.join H.dbay_path, 'node_modules/better-sqlite3'
    // bsqlite_path    = require.resolve 'better-sqlite3'
    // bsqlite_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3'
    // debug '^2233^', "path to better-sqlite3:", bsqlite_path
    /* NOTE files at node_path_1, node_path_2 identical (?) */
    node_path_1 = PATH.resolve(PATH.join(__dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/better_sqlite3.node'));
    // node_path_2     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/obj.target/better_sqlite3.node'
    debug('^490^', ({
      Database: Db1
    } = require(node_path_1)));
    // debug '^490^', bindings node_path_1
    // new CPPDatabase(
    //---------------------------------------------------------------------------------------------------------
    new_connection = function(path_or_url) {
      var cfg;
      cfg = {
        filename: path_or_url,
        filenameGiven: path_or_url,
        anonymous: true/* ??? */,
        readonly: false,
        fileMustExist: false,
        timeout: 5000,
        verbose: null,
        buffer: null
      };
      return new Db1(cfg.filename, cfg.filenameGiven, cfg.anonymous, cfg.readonly, cfg.fileMustExist, cfg.timeout, cfg.verbose, cfg.buffer);
    };
    //---------------------------------------------------------------------------------------------------------
    debug('^490^', sqlt1 = new_connection('file:your_db_name_here?mode=memory&cache=shared'));
    debug('^490^', sqlt2 = new_connection('file:your_db_name_here?mode=memory&cache=shared'));
    sqlt1.exec(SQL`create table x ( n text );`);
    sqlt2.exec(SQL`insert into x ( n ) values ( 'helo world' );`);
    select = sqlt2.prepare(SQL`select * from x;`, {}, false);
    debug('^340^', select.run());
    ref = select.iterate();
    for (row of ref) {
      info(row);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "DBAY attach memory connections" ]
      return this["DBAY attach memory connections"]();
    })();
  }

  // test @[ "DBAY constructor arguments 1" ]
// test @[ "DBAY: _get_connection_url()" ]
// test @[ "DBAY instance has two connections" ]

}).call(this);

//# sourceMappingURL=construction.tests.js.map