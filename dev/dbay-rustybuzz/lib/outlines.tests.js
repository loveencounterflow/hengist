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
    var DBay, Drb, Tbl, db, drb, dtab, matcher, path, schema, text;
    // ### explicit path, explicitly temporary ###
    // T?.halt_on_error()
    // { DBay }            = require H.dbay_path
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    path = PATH.resolve(DBay.C.autolocation, 'drb-23842847.sqlite');
    // DH                  = require PATH.join H.dbay_path, 'lib/helpers'
    db = new DBay();
    drb = new Drb({
      path,
      db,
      temporary: true
    });
    dtab = new Tbl({db});
    schema = drb.cfg.schema;
    text = "there's the rub";
    matcher = [[116, 85], [104, 73], [101, 70], [114, 83], [39, 8], [115, 84], [32, 1], [117, 86], [98, 67]];
    (() => {      //.........................................................................................................
      var chr, cids, fontnick, result;
      fontnick = 'gi';
      drb.prepare_font({fontnick});
      cids = (function() {
        var i, len, ref, results;
        ref = Array.from(text);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          chr = ref[i];
          results.push(chr.codePointAt(0));
        }
        return results;
      })();
      debug('^33234^', result = drb.get_cgid_map({fontnick, cids}));
      if (T != null) {
        T.eq(type_of(result), 'map');
      }
      debug(result, new Map(matcher));
      debug(equals(result, new Map(matcher)));
      return T != null ? T.eq([...result], matcher) : void 0;
    })();
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
      return test(this["DRB get_cgid_map()"]);
    })();
  }

}).call(this);

//# sourceMappingURL=outlines.tests.js.map