(function() {
  'use strict';
  var CND, DBay, FS, GUY, H, PATH, SQL, Sql, badge, debug, echo, equals, freeze, help, info, isa, lets, rpr, show_overview, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/DEMO/TRASH';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('../../../apps/guy');

  // { HDML }                  = require '../../../apps/hdml'
  H = require('./helpers');

  ({lets, freeze} = GUY.lft);

  ({to_width} = require('to-width'));

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  ({Sql} = require('../../../apps/dbay/lib/sql'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_overview = function(db) {
    var X;
    X = require('../../../lib/helpers');
    info('#############################################################################');
    X.tabulate("dbay_tables", db(SQL`select * from dbay_tables`));
    X.tabulate("dbay_unique_fields", db(SQL`select * from dbay_unique_fields`));
    // X.tabulate "dbay_fields_1",                 db SQL"select * from dbay_fields_1"
    X.tabulate("dbay_fields", db(SQL`select * from dbay_fields`));
    X.tabulate("dbay_foreign_key_clauses_1", db(SQL`select * from dbay_foreign_key_clauses_1`));
    X.tabulate("dbay_foreign_key_clauses_2", db(SQL`select * from dbay_foreign_key_clauses_2`));
    // X.tabulate "dbay_foreign_key_clauses_3",    db SQL"select * from dbay_foreign_key_clauses_3"
    X.tabulate("dbay_foreign_key_clauses", db(SQL`select * from dbay_foreign_key_clauses`));
    // X.tabulate "dbay_primary_key_clauses_1",    db SQL"select * from dbay_primary_key_clauses_1"
    X.tabulate("dbay_primary_key_clauses", db(SQL`select * from dbay_primary_key_clauses`));
    // X.tabulate "dbay_field_clauses_1",          db SQL"select * from dbay_field_clauses_1"
    X.tabulate("dbay_field_clauses", db(SQL`select * from dbay_field_clauses`));
    X.tabulate("dbay_create_table_clauses", db(SQL`select * from dbay_create_table_clauses`));
    // X.tabulate "dbay_create_table_statements_1", db SQL"select * from dbay_create_table_statements_1"
    // X.tabulate "dbay_create_table_statements_2", db SQL"select * from dbay_create_table_statements_2"
    // X.tabulate "dbay_create_table_statements_3", db SQL"select * from dbay_create_table_statements_3"
    // X.tabulate "dbay_create_table_statements_4", db SQL"select * from dbay_create_table_statements_4"
    X.tabulate("dbay_create_table_statements", db(SQL`select * from dbay_create_table_statements`));
    // X.tabulate "dbay_create_table_statements",  db SQL"""
    //   select
    //       lnr,
    //       tail,
    //       substring( txt, 1, 100 ) as txt
    //     from dbay_create_table_statements;"""
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_trash_empty_db = function(cfg) {
    ({DBay} = require('../../../apps/dbay'));
    (() => {
      var db;
      db = new DBay();
      db.create_trashlib();
      return show_overview(db);
    })();
    (() => {
      var db;
      return db = new DBay();
    })();
    // db.
    // urge '^2334^', db.trash_to_sql()
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_trash = function(cfg) {
    var Mrg, db, from_path, mrg, path;
    ({DBay} = require('../../../apps/dbay'));
    ({Mrg} = require('../../../apps/dbay-mirage'));
    from_path = PATH.resolve(__dirname, '../../../assets/dbay/demo-html-parsing.sqlite');
    path = PATH.resolve(__dirname, '../../../data/dbay/demo-html-parsing.sqlite');
    H.copy_over(from_path, path);
    help(`^43587^ using DB at ${path}`);
    db = new DBay({path});
    mrg = new Mrg({db});
    (() => {
      db.create_trashlib();
      return show_overview(db);
    })();
    (() => {})();
    // urge '^2334^', db.trash_to_sql()
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_two_kinds_of_foreign_keys()
      // @demo_trash_empty_db()
      return this.demo_trash();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-trash.js.map