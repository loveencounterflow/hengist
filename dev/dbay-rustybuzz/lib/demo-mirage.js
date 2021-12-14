(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper, width_of;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMO-MIRAGE';

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

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  ({DBay} = require(H.dbay_path));

  ({Drb} = require(H.drb_path));

  // { Mrg }                   = require PATH.join H.drb_path, 'lib/_mirage'
  ({width_of, to_width} = require('to-width'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_mirage = function(cfg) {
    var db, drb, dsk, path;
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      rebuild: false,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    // mrg             = new Mrg { db, }
    dsk = 'tmpl';
    path = 'assets/dbay-rustybuzz/demo-typeset-sample-page.template.html';
    path = PATH.resolve(PATH.join(__dirname, '../../../', path));
    drb.mrg.register_dsk({dsk, path});
    console.table(db.all_rows(SQL`select * from mrg_datasources;`));
    drb.mrg.read_datasource({dsk});
    console.table(db.all_rows(SQL`select * from mrg_mirror where lnr between 153 and 160 order by lnr;`));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_parser = function() {
    var ITXT;
    ITXT = require('../../../apps/intertext');
    return debug('^7564^', ITXT.HTML);
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @demo_mirage()
      return this.demo_parser();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-mirage.js.map