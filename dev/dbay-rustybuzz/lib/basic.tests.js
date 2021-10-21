(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/TESTS/BASIC';

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

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["DRB foobar"] = function(T, done) {
    var DBay, Drb, Tbl, db, drb, dtab, path, schema;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    path = PATH.resolve(DBay.C.autolocation, 'drb.sqlite');
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    db = new DBay();
    drb = new Drb({
      path,
      db,
      temporary: true
    });
    dtab = new Tbl({db});
    schema = drb.cfg.schema;
    //.........................................................................................................
    db(() => {
      echo(dtab._tabulate(db(SQL`select type, name from ${schema}.sqlite_schema;`)));
      return echo(dtab._tabulate(db(SQL`select * from ${schema}.pragma_table_info( 'outlines' );`)));
    });
    //.........................................................................................................
    //.........................................................................................................
    db(() => {
      echo(dtab._tabulate(db(SQL`select * from ${schema}.pragma_table_info( 'fontnicks' );`)));
      echo(dtab._tabulate(db(SQL`select * from ${schema}.outlines order by fontnick, gid;`)));
      return echo(dtab._tabulate(db(SQL`select * from ${schema}.fontnicks order by fontnick;`)));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB no shared state in WASM module"] = function(T, done) {
    var DBay, Drb, font_idx, fontnick, gid;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    fontnick = 'gi';
    gid = 74;
    font_idx = 0;
    (() => {      //.........................................................................................................
      /* Establish that trying to retrieve an outline with an unused `font_idx` throws an error: */
      var db, drb, error, message, name, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      try {
        urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
      } catch (error1) {
        error = error1;
        ({name, message} = error);
        warn({name, message});
      }
      if (error == null) {
        return T != null ? T.fail("^5568347-1^ failed to throw an error") : void 0;
      }
    })();
    (() => {      //.........................................................................................................
      /* Establish that after associating `font_idx` with a loaded font, outline retrieval does work: */
      var db, drb, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      drb.load_font({fontnick});
      return urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
    })();
    (() => {      //.........................................................................................................
      var db, drb, error, message, name, outline;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      try {
        /* we do not call `drb.load_font { fontnick, }` */
        urge('^290^', outline = JSON.parse(drb.RBW.glyph_to_svg_pathdata(font_idx, gid)));
      } catch (error1) {
        error = error1;
        ({name, message} = error);
        warn({name, message});
      }
      if (error == null) {
        return T != null ? T.fail("^5568347-2^ failed to throw an error") : void 0;
      }
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "DRB foobar" ]()
      return test(this["DRB no shared state in WASM module"]);
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map