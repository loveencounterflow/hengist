(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/BLOB-WITH-TEXT.DEMO';

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

  // types                     = new ( require 'intertype' ).Intertype
  // { isa
  //   type_of
  //   validate
  //   validate_list_of }      = types.export()
  SQL = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function(cfg) {
    var DBay, Tbl, create_sql, db, dtab, insert, ref, row;
    ({DBay} = require(H.dbay_path));
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    db = new DBay();
    dtab = new Tbl({db});
    create_sql = SQL`create table bob ( data ${cfg.data_type} );`;
    urge(rpr(create_sql));
    db(create_sql);
    insert = db.prepare_insert({
      into: 'bob'
    });
    insert.run({
      data: 42
    });
    insert.run({
      data: "äöü"
    });
    insert.run({
      data: "helo world"
    });
    insert.run({
      data: Buffer.from("äöü")
    });
    ref = db(SQL`select * from bob;`);
    for (row of ref) {
      //.........................................................................................................
      info(row);
    }
    echo(dtab._tabulate(db(SQL`select * from bob;`)));
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      this.demo({
        data_type: 'text'
      });
      return this.demo({
        data_type: 'blob'
      });
    })();
  }

}).call(this);

//# sourceMappingURL=blob-with-text.demo.js.map