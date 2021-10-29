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
    var Cmud, DBay, I, L, V, cmud, db, path, schema;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    path = PATH.resolve(PATH.join(__dirname, '../../../data/dbay-cmudict.sqlite'));
    db = new DBay({
      temporary: true
    });
    cmud = new Cmud({
      db,
      path,
      rebuild: true,
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

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "DBAY-CMUDICT ipa rewriting" ] = ( T, done ) ->
  //   # T?.halt_on_error()
  //   path              = PATH.resolve PATH.join __dirname, '../../../data/dbay-cmudict.sqlite'
  //   { DBay }          = require '../../../apps/dbay'
  //   { Cmud }          = require '../../../apps/dbay-cmudict'
  //   db                = new DBay { temporary: true, }
  //   cmud              = new Cmud { db, path, rebuild: false, }
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [ 'k ɝ0 ɪ1 r',          null, ]
  //     [ 'b ɪ1 r m ʌ0 n',      null, ]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, ] in probes_and_matchers
  //     debug probe.match /ɝ0/g #   'ə0 r'
  //     info cmud.ipa_from_ipa_raw probe
  //   #.........................................................................................................
  //   done?()

  //-----------------------------------------------------------------------------------------------------------
  this["DBAY-CMUDICT _rewrite_beep_word"] = function(T, done) {
    var Cmud, DBay, cmud, db, i, len, matcher, path, probe, probes_and_matchers, result;
    // T?.halt_on_error()
    ({DBay} = require('../../../apps/dbay'));
    ({Cmud} = require('../../../apps/dbay-cmudict'));
    path = PATH.resolve(PATH.join(__dirname, '../../../data/dbay-cmudict.sqlite'));
    db = new DBay({
      temporary: true
    });
    cmud = new Cmud({
      db,
      path,
      rebuild: false
    });
    //.........................................................................................................
    probes_and_matchers = [['b\\^ete', "bête"], ["caf\\'e", "café"], ["brassi\\`ere", "brassière"], ["ch\\^ateau", "château"], ["\\'ep\\'ees", "épées"], ["table_d'h\\^ote", "table d'hôte"], ["t\\^ete-\\`a-t\\^ete", "tête-à-tête"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = cmud._rewrite_beep_word(probe);
      info(result);
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @, { timeout: 10e3, }
      // @[ "DBAY-CMUDICT ipa rewriting" ]()
      return test(this["DBAY-CMUDICT _rewrite_beep_word"]);
    })();
  }

}).call(this);

//# sourceMappingURL=basic.tests.js.map