(function() {
  'use strict';
  var CND, PATH, SQL, badge, debug, demo_1, demo_count_transcriptions, echo, equals, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-CMUDICT/DEMOS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({equals, isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Cmud, DBay, cmud, db;
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    db = new DBay();
    cmud = new Cmud({
      db,
      create: true
    });
    info(cmud);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_count_transcriptions = function() {
    var Cmud, DBay, Tbl, cmud, db, dtab;
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    db = new DBay();
    db.create_stdlib();
    cmud = new Cmud({db});
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: db
    });
    // echo dtab._tabulate db SQL"select 42;"
    db(function() {
      echo(dtab._tabulate(db(SQL`select
    word as word,
    abs1 as abs1
  from entries
  where word glob 'n*'
  order by word
  limit 100;`)));
      return null;
    });
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // await demo_f()
      // demo_1()
      return demo_count_transcriptions();
    })();
  }

}).call(this);

//# sourceMappingURL=demos.js.map