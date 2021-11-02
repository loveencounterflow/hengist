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
    var DBay, Drb, chrs, matcher;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    // path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    chrs = "affirm無字";
    matcher = new Map([['a', 66], ['ffi', 1536], ['r', 83], ['m', 78]]);
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
        return drb.get_cgid_map({
          fontnick,
          cids: [42]
        });
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB insert_outlines()"] = function(T, done) {
    var DBay, Drb, Tbl, chrs, matcher;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    // path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    chrs = "'ab-c'.";
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
      drb.insert_outlines({fontnick, chrs});
      result = db.all_rows(SQL`select * from drb.outlines order by chrs;`);
      for (i = 0, len = result.length; i < len; i++) {
        row = result[i];
        ({pd_blob} = guy.obj.pluck_with_fallback(row, null, 'pd_blob'));
        if (T != null) {
          T.eq(type_of(pd_blob), 'buffer');
        }
        if (row.text === '.') {
          if (T != null) {
            T.eq(row, {
              fontnick: 'gi',
              gid: 15,
              sid: 'o15gi',
              chrs: '.',
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
    sid,
    chrs,
    x,
    y,
    x1,
    y1,
    substr( pd, 0, 10 ) as "(pd)"
  from drb.outlines
  order by chrs;`)));
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW shape_text() returns coordinates acc to font upem"] = function(T, done) {
    var DBay, Drb, RBW, db, drb, i, len, ref, result, set_id, use_linked_RBW;
    // T?.halt_on_error()
    use_linked_RBW = true;
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
    //.........................................................................................................
    result = {};
    ref = ['3a', '3b'];
    for (i = 0, len = ref.length; i < len; i++) {
      set_id = ref[i];
      (() => {
        var cgid_map, chrs, cids, fontnick, fspath, text;
        ({chrs, cids, cgid_map, text, fontnick, fspath} = H.settings_from_set_id(set_id));
        //.....................................................................................................
        drb.register_fontnick({fontnick, fspath});
        drb.prepare_font({fontnick});
        drb.insert_outlines({fontnick, cgid_map, cids, chrs});
        return result[fontnick] = (drb.shape_text({fontnick, text}))[0];
      })();
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result, {
        djvsi: {
          gid: 68,
          b: 0,
          x: 0,
          y: 0,
          dx: 596.2,
          dy: 0,
          chrs: 'a',
          sid: 'o68djvsi'
        },
        eg8i: {
          gid: 66,
          b: 0,
          x: 0,
          y: 0,
          dx: 492,
          dy: 0,
          chrs: 'a',
          sid: 'o66eg8i'
        }
      });
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
      return test(this["DRB RBW shape_text() returns coordinates acc to font upem"]);
    })();
  }

  // test @[ "DRB insert_outlines()" ]

}).call(this);

//# sourceMappingURL=outlines.tests.js.map