(function() {
  'use strict';
  var CND, H, MMX, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  MMX = require('../../../apps/multimix/lib/cataloguing');

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 1"] = function(T, done) {
    var DH, Dbay, db, path;
    /* explicit path, explicitly temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({
      path,
      temporary: true
    });
    try {
      debug('^447^', MMX.all_keys_of(db));
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(!DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 2"] = function(T, done) {
    var DH, Dbay, db, path;
    /* explicit path, explicitly not temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({
      path,
      temporary: false
    });
    try {
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 3"] = function(T, done) {
    var DH, Dbay, db, path;
    /* explicit path, implicitly not temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({path});
    try {
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 4"] = function(T, done) {
    var DH, Dbay, db, path;
    /* implicit path, implicitly temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay();
    path = null;
    try {
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(!DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 5"] = function(T, done) {
    var DH, Dbay, db, path;
    /* implicit path, explicitly temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({
      temporary: true
    });
    path = null;
    try {
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(!DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, table 6"] = function(T, done) {
    var DH, Dbay, db, path;
    /* implicit path, explicitly not temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({
      temporary: false
    });
    path = null;
    try {
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.destroy();
      if (T != null) {
        T.ok(DH.is_file(db._dbs.main.path));
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY create DB, insert, query values 1"] = function(T, done) {
    var DH, Dbay, db, path, rows;
    /* implicit path, explicitly not temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-create-and-query-a-table.sqlite');
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    db = new Dbay({
      temporary: false
    });
    try {
      db.execute(SQL`drop table if exists texts;`);
      db.execute(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.execute(SQL`insert into texts values ( 3, 'third' );`);
      if (T != null) {
        T.throws(/argument extra not allowed/, () => {
          return db.execute(SQL`insert into texts values ( ?, ? );`, [4, 'fourth']);
        });
      }
      db.query(SQL`insert into texts values ( 1, 'first' );`);
      db.query(SQL`insert into texts values ( ?, ? );`, [2, 'second']);
      rows = db.query(SQL`select * from texts order by nr;`);
      if (T != null) {
        T.eq(type_of(rows), 'statementiterator');
      }
      if (T != null) {
        T.eq([...rows], [
          {
            nr: 1,
            text: 'first'
          },
          {
            nr: 2,
            text: 'second'
          },
          {
            nr: 3,
            text: 'third'
          }
        ]);
      }
    } finally {
      null;
      DH.unlink_file(db._dbs.main.path);
    }
    if (T != null) {
      T.ok(!DH.is_file(db._dbs.main.path));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY do 1"] = function(T, done) {
    var DH, Dbay, db, path, rows;
    /* implicit path, explicitly not temporary */
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-do.sqlite');
    db = new Dbay({
      temporary: false
    });
    try {
      db.do(SQL`drop table if exists texts;`);
      db.do(SQL`create table texts ( nr integer not null primary key, text text );`);
      db.do(SQL`insert into texts values ( 3, 'third' );`);
      // T?.throws /argument extra not allowed/, =>
      //   db.do  SQL"insert into texts values ( 4,. ? );", [ 4, 'fourth', ]
      db.do(SQL`insert into texts values ( 1, 'first' );`);
      db.do(SQL`insert into texts values ( ?, ? );`, [2, 'second']);
      rows = db.do(SQL`select * from texts order by nr;`);
      if (T != null) {
        T.eq(type_of(rows), 'statementiterator');
      }
      if (T != null) {
        T.eq([...rows], [
          {
            nr: 1,
            text: 'first'
          },
          {
            nr: 2,
            text: 'second'
          },
          {
            nr: 3,
            text: 'third'
          }
        ]);
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY db as callable"] = function(T, done) {
    var DH, Dbay, db, path, rows;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    DH = require(PATH.join(H.dbay_path, 'lib/helpers'));
    path = PATH.resolve(Dbay.C.autolocation, 'dbay-do.sqlite');
    db = new Dbay({
      temporary: false
    });
    try {
      db(SQL`drop table if exists texts;`);
      db(SQL`create table texts ( nr integer not null primary key, text text );`);
      db(SQL`insert into texts values ( 3, 'third' );`);
      // T?.throws /argument extra not allowed/, =>
      //   db  SQL"insert into texts values ( 4,. ? );", [ 4, 'fourth', ]
      db(SQL`insert into texts values ( 1, 'first' );`);
      db(SQL`insert into texts values ( ?, ? );`, [2, 'second']);
      rows = db(SQL`select * from texts order by nr;`);
      if (T != null) {
        T.eq(type_of(rows), 'statementiterator');
      }
      rows = [...rows];
      if (T != null) {
        T.eq(rows, [
          {
            nr: 1,
            text: 'first'
          },
          {
            nr: 2,
            text: 'second'
          },
          {
            nr: 3,
            text: 'third'
          }
        ]);
      }
    } finally {
      DH.unlink_file(db._dbs.main.path);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY db callable checks types of arguments"] = function(T, done) {
    var Dbay, db;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    if (T != null) {
      T.throws(/expected .*, got a float/, function() {
        return db(42);
      });
    }
    if (T != null) {
      T.throws(/expected .*, got a undefined/, function() {
        return db();
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY db callable accepts function, begins, commits transaction"] = function(T, done) {
    var Dbay, db, rows;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    //.........................................................................................................
    db(function() {
      db(SQL`drop table if exists texts;`);
      db(SQL`create table texts ( nr integer not null primary key, text text );`);
      db(SQL`insert into texts values ( 3, 'third' );`);
      db(SQL`insert into texts values ( 1, 'first' );`);
      db(SQL`insert into texts values ( ?, ? );`, [2, 'second']);
      //.......................................................................................................
      return T != null ? T.throws(/cannot start a transaction within a transaction/, function() {
        return db(function() {});
      }) : void 0;
    });
    //.........................................................................................................
    if (T != null) {
      T.throws(/UNIQUE constraint failed: texts\.nr/, function() {
        return db(function() {
          return db(SQL`insert into texts values ( 3, 'third' );`);
        });
      });
    }
    //.........................................................................................................
    rows = db(SQL`select * from texts order by nr;`);
    rows = [...rows];
    if (T != null) {
      T.eq(rows, [
        {
          nr: 1,
          text: 'first'
        },
        {
          nr: 2,
          text: 'second'
        },
        {
          nr: 3,
          text: 'third'
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY implicit tx can be configured"] = function(T, done) {
    var Dbay, db, rows;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    //.........................................................................................................
    db(function() {
      db(SQL`drop table if exists texts;`);
      return db(SQL`create table texts ( nr integer not null primary key, text text );`);
    });
    db({
      mode: 'deferred'
    }, function() {
      return db(SQL`insert into texts values ( 3, 'third' );`);
    });
    db({
      mode: 'immediate'
    }, function() {
      return db(SQL`insert into texts values ( 1, 'first' );`);
    });
    db({
      mode: 'exclusive'
    }, function() {
      return db(SQL`insert into texts values ( ?, ? );`, [2, 'second']);
    });
    //.........................................................................................................
    rows = db(SQL`select * from texts order by nr;`);
    rows = [...rows];
    if (T != null) {
      T.eq(rows, [
        {
          nr: 1,
          text: 'first'
        },
        {
          nr: 2,
          text: 'second'
        },
        {
          nr: 3,
          text: 'third'
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY can do explicit rollback in tx context handler"] = function(T, done) {
    var Dbay, db;
    // T?.halt_on_error()
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    db(SQL`create table squares ( n int not null primary key, square int not null );`);
    db(function() {
      var i, n;
      for (n = i = 10; i <= 12; n = ++i) {
        db(SQL`insert into squares ( n, square ) values ( ?, ? );`, [n, n ** 2]);
      }
      return db(SQL`rollback;`);
    });
    if (T != null) {
      T.eq(db.all_rows(SQL`select * from squares order by n;`), []);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY tx rollback also reverts create table"] = function(T, done) {
    var Dbay, db, error;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    db.open({
      schema: 'aux'
    });
    try {
      //.........................................................................................................
      db(function() {
        db(SQL`create table squares ( n int not null primary key, square int not null );`);
        db(SQL`create table aux.squares ( n int not null primary key, square int not null );`);
        throw new Error('xxx');
      });
    } catch (error1) {
      error = error1;
      if (error.message !== 'xxx') {
        throw error;
      }
    }
    if (T != null) {
      T.eq((db.all_rows(SQL`select * from main.sqlite_schema;`)).length, 0);
    }
    if (T != null) {
      T.eq((db.all_rows(SQL`select * from aux.sqlite_schema;`)).length, 0);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY db.first_row returns `null` for empty result set"] = function(T, done) {
    var Dbay, db;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    db.open({
      schema: 'aux'
    });
    db(SQL`create table squares ( n int not null primary key, square int not null );`);
    //.........................................................................................................
    db(function() {
      var i, n, results;
      results = [];
      for (n = i = 10; i <= 12; n = ++i) {
        results.push(db(SQL`insert into squares ( n, square ) values ( ?, ? );`, [n, n ** 2]));
      }
      return results;
    });
    if (T != null) {
      T.eq((db.all_rows(SQL`select * from squares order by n;`)).length, 3);
    }
    if (T != null) {
      T.eq(db.first_row(SQL`select * from squares order by n;`), {
        n: 10,
        square: 100
      });
    }
    if (T != null) {
      T.eq(db.first_row(SQL`select * from squares where n > 100;`), null);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY db.single_row returns throws error on empty result set"] = function(T, done) {
    var Dbay, db;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dbay} = require(H.dbay_path));
    db = new Dbay();
    db.open({
      schema: 'aux'
    });
    db(SQL`create table squares ( n int not null primary key, square int not null );`);
    //.........................................................................................................
    db(function() {
      var i, n, results;
      results = [];
      for (n = i = 10; i <= 12; n = ++i) {
        results.push(db(SQL`insert into squares ( n, square ) values ( ?, ? );`, [n, n ** 2]));
      }
      return results;
    });
    if (T != null) {
      T.eq((db.all_rows(SQL`select * from squares order by n;`)).length, 3);
    }
    if (T != null) {
      T.eq(db.single_row(SQL`select * from squares order by n limit 1;`), {
        n: 10,
        square: 100
      });
    }
    if (T != null) {
      T.throws(/expected 1 row, got 0/, function() {
        return db.single_row(SQL`select * from squares where n > 100;`);
      });
    }
    if (T != null) {
      T.throws(/expected 1 row, got 3/, function() {
        return db.single_row(SQL`select * from squares;`);
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DBAY db.first_row() exhausts iterator" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   { Dbay }            = require H.dbay_path
  //   db                  = new Dbay()
  //   db SQL"create table squares ( n int not null primary key, square int not null );"
  //   db ->
  //     for n in [ 10 .. 12 ]
  //       db SQL"insert into squares ( n, square ) values ( ?, ? );", [ n, n ** 2, ]
  //   sql = SQL"select * from squares order by n;"
  //   T?.eq ( db.first_row sql ), { n: 10, square: 100 }
  //   # T?.eq db._statements[ sql ].all(), []
  //   urge [ ( db.query SQL"select * from squares;" )..., ]
  //   info db.sqlt1
  //   info [ db._statements[ sql ].iterate()..., ]
  //   info [ db._statements[ sql ].iterate()..., ]
  //   info [ db._statements[ sql ].iterate()..., ]
  //   return done?()

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // test @[ "DBAY create DB, insert, query values 1" ]
// test @[ "DBAY db as callable" ]
// @[ "DBAY create DB, table 2" ]()
// test @[ "DBAY db callable checks types of arguments" ]
// test @[ "DBAY tx rollback also reverts create table" ]
// test @[ "DBAY db.first_row() exhausts iterator" ]
// @[ "DBAY can do explicit rollback in tx context handler" ]()
// test @[ "DBAY implicit tx can be configured" ]
// test @[ "DBAY db.first_row returns `null` for empty result set" ]

}).call(this);

//# sourceMappingURL=query.tests.js.map