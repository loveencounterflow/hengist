(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/OUTLINES/BASIC';

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
  this["DRB get_cgid_map()"] = function(T, done) {
    var DBay, Drb, chr, chrs, cids, matcher;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    // path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    chrs = "there's the rub";
    cids = (function() {
      var i, len, ref, results;
      ref = Array.from(chrs);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        chr = ref[i];
        results.push(chr.codePointAt(0));
      }
      return results;
    })();
    matcher = new Map([[116, 85], [104, 73], [101, 70], [114, 83], [39, 8], [115, 84], [32, 1], [117, 86], [98, 67]]);
    (() => {      //.........................................................................................................
      var db, drb, fontnick, result;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      debug('^33234^', result = drb.get_cgid_map({fontnick, cids}));
      if (T != null) {
        T.eq(type_of(result), 'map');
      }
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (() => {      //.........................................................................................................
      var db, drb, fontnick, result;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      debug('^33234^', result = drb.get_cgid_map({fontnick, chrs}));
      if (T != null) {
        T.eq(type_of(result), 'map');
      }
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (() => {      //.........................................................................................................
      var db, drb, fontnick;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      return T != null ? T.throws(/not a valid dbr_get_cgid_map_cfg/, () => {
        return drb.get_cgid_map({fontnick, cids, chrs});
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var db, drb, fontnick;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      return T != null ? T.throws(/not a valid dbr_get_cgid_map_cfg/, () => {
        return drb.get_cgid_map({fontnick});
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB insert_outlines()"] = function(T, done) {
    var DBay, Drb, Tbl, chr, chrs, cids, matcher;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    // path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    chrs = "'ab-c'.";
    cids = (function() {
      var i, len, ref, results;
      ref = Array.from(chrs);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        chr = ref[i];
        results.push(chr.codePointAt(0));
      }
      return results;
    })();
    matcher = new Map([[116, 85], [104, 73], [101, 70], [114, 83], [39, 8], [115, 84], [32, 1], [117, 86], [98, 67]]);
    (() => {      //.........................................................................................................
      var db, drb, dtab, fontnick, i, len, pd_blob, result, row;
      db = new DBay();
      dtab = new Tbl({db});
      drb = new Drb({
        db,
        temporary: true
      });
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      drb.insert_outlines({fontnick, cids});
      result = db.all_rows(SQL`select * from drb.outlines order by cid;`);
      for (i = 0, len = result.length; i < len; i++) {
        row = result[i];
        ({pd_blob} = guy.obj.pluck_with_fallback(row, null, 'pd_blob'));
        if (T != null) {
          T.eq(type_of(pd_blob), 'buffer');
        }
        if (row.glyph === '.') {
          if (T != null) {
            T.eq(row, {
              fontnick: 'gi',
              gid: 15,
              cid: 46,
              glyph: '.',
              uoid: 'o15gi',
              x: 25,
              y: -101,
              x1: 135,
              y1: 14,
              pd: 'M90-101C54-101 25-72 25-36C25-10 44 14 70 14C106 14 135-15 135-51C135-77 116-101 90-101Z'
            });
          }
        }
      }
      // T?.eq ( type_of result ), 'map'
      // T?.eq result, matcher
      return echo(dtab._tabulate(db(SQL`select
    fontnick,
    gid,
    cid,
    glyph,
    uoid,
    x,
    y,
    x1,
    y1,
    substr( pd, 0, 10 ) as "(pd)"
  from drb.outlines
  order by cid;`)));
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW shape_text() returns scaled coordinates"] = function(T, done) {
    var DBay, Drb, RBW, cgid_map, chrs, cids, d, db, drb, fontnick, fspath, i, j, len, len1, ref, ref1, set_id, size_mm, text, use_linked_RBW;
    // T?.halt_on_error()
    use_linked_RBW = false;
    globalThis.info = info;
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    if (use_linked_RBW) {
      debug('^4445^', CND.reverse(" using linked RBW "));
      drb = new Drb({
        db,
        temporary: true,
        RBW
      });
      if (T != null) {
        T.ok(drb.RBW === RBW);
      }
    } else {
      drb = new Drb({
        db,
        temporary: true
      });
    }
    set_id = 'small';
    //.........................................................................................................
    ({chrs, cids, cgid_map, text, fontnick, fspath} = H.settings_from_set_id(set_id));
    size_mm = 6;
    info('^33443^', {fontnick, text, size_mm});
    //.........................................................................................................
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    drb.insert_outlines({fontnick, cgid_map, cids, chrs});
    size_mm = 1;
    ref = drb.shape_text({fontnick, text, size_mm});
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      urge('^3343^', {size_mm}, d);
    }
    size_mm = 10;
    ref1 = drb.shape_text({fontnick, text, size_mm});
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      d = ref1[j];
      help('^3343^', {size_mm}, d);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @[ "DRB foobar" ]()
      // test @[ "DRB no shared state in WASM module" ]
      // @[ "DRB path compression" ]()
      // test @[ "DRB can pass in custom RBW" ]
      // test @[ "DRB get_cgid_map()" ]
      // @[ "DRB insert_outlines()" ]()
      return this["DRB RBW shape_text() returns scaled coordinates"]();
    })();
  }

}).call(this);

//# sourceMappingURL=outlines.tests.js.map