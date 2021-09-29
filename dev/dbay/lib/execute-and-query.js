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

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=execute-and-query.js.map