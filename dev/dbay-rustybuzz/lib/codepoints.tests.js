(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/CODEPOINTS/BASIC';

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
  ({width_of, to_width} = require('to-width'));

  //-----------------------------------------------------------------------------------------------------------
  this["DRB get_assigned_unicode_chrs()"] = function(T, done) {
    var DBay, Drb;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    (() => {      // path                = PATH.resolve DBay.C.autolocation, 'drb-23842847.sqlite'
      // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
      //.........................................................................................................
      var chr, chrs, db, drb, i, len, result, result_txt, width, widths;
      db = new DBay();
      drb = new Drb({
        db,
        temporary: true
      });
      result = drb.get_assigned_unicode_chrs();
      result_txt = result.join('');
      debug('^98402^', to_width(result_txt, 1500));
      widths = {};
      for (i = 0, len = result.length; i < len; i++) {
        chr = result[i];
        width = width_of(chr);
        (widths[width] != null ? widths[width] : widths[width] = []).push(chr);
      }
      for (width in widths) {
        chrs = widths[width];
        chrs = chrs.join('');
        debug('^98402^', width, to_width(chrs, 150));
      }
      /* as of NodeJS v16.9.1 with  Unicode 13 (?) */
      if (T != null) {
        T.ok(result.length >= 143_439);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB arrange() uses correct GIDs for specials"] = function(T, done) {
    var DBay, Drb, db, doc, drb, fontnick, matcher, par, schema, specials, text;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true
    });
    text = "買ne 來ca";
    ({specials} = Drb.C);
    ({schema} = drb.cfg);
    //.........................................................................................................
    fontnick = 'gr';
    text = "abc&wbr;x&shy;y&nl;z u";
    text = drb.prepare_text({text});
    doc = 1;
    par = 1;
    //.....................................................................................................
    matcher = [];
    //.....................................................................................................
    // drb.register_fontnick { fontnick, }
    drb.prepare_font({fontnick});
    drb.arrange({fontnick, text, doc, par});
    //.....................................................................................................
    console.table(db.all_rows(SQL`select * from ${schema}.ads order by trk, b1;`));
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return this["DRB arrange() uses correct GIDs for specials"]();
    })();
  }

}).call(this);

//# sourceMappingURL=codepoints.tests.js.map