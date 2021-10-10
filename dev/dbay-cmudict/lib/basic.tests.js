(function() {
  'use strict';
  var CND, PATH, SQL, badge, debug, echo, help, info, isa, r, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-CMUDICT/TESTS/BASIC';

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

  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  r = String.raw;

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY-CMUDICT object creation"] = function(T, done) {
    var Cmud, DBay, I, L, V, cmud, db, schema;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    db = new DBay({
      temporary: true
    });
    cmud = new Cmud({
      db,
      create: true,
      max_entry_count: 10000
    });
    debug('^3344^', cmud.cfg);
    ({schema} = cmud.cfg);
    ({I, L, V} = db.sql);
    //.........................................................................................................
    info(db.all_rows(SQL`select * from sqlite_schema;`));
    info(db.all_first_values(SQL`select name from ${I(schema)}.sqlite_schema;`));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY-CMUDICT ipa rewriting"] = function(T, done) {
    var Cmud, DBay, cmud, db, i, len, matcher, probe, probes_and_matchers;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    db = new DBay({
      temporary: true
    });
    cmud = new Cmud({
      db,
      create: false
    });
    //.........................................................................................................
    probes_and_matchers = [['k ɝ0 ɪ1 r', null], ['b ɪ1 r m ʌ0 n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      debug(probe.match(/ɝ0/g)); //   'ə0 r'
      info(cmud.ipa_from_ipa_raw(probe));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      return this["DBAY-CMUDICT ipa rewriting"]();
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map