(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, help, info, isa, jp, jr, on_process_exit, rpr, sleep, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL-DBA/TESTS/FUTURE';

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

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  // { to_width }              = require 'to-width'
  on_process_exit = require('exit-hook');

  sleep = function(dts) {
    return new Promise((done) => {
      return setTimeout(done, dts * 1000);
    });
  };

  SQL = String.raw;

  jr = JSON.stringify;

  jp = JSON.parse;

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: type_of()"] = async function(T, done) {
    var Dba, dba, schema, template_path, work_path;
    if (T != null) {
      T.halt_on_error();
    }
    ({Dba} = require(H.icql_dba_path));
    ({template_path, work_path} = (await H.procure_db({
      size: 'small',
      ref: 'type-of'
    })));
    schema = 'main';
    //.........................................................................................................
    urge('^344-3^', {template_path, work_path, schema});
    // dba     = new Dba()
    dba = new Dba();
    dba.open({
      path: work_path
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'sources'
      }), 'table');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'dest_changes_backward'
      }), 'view');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'keys'
      }), 'table');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'sqlite_autoindex_keys_1'
      }), 'index');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'sqlite_autoindex_realms_1'
      }), 'index');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'realms'
      }), 'table');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'dest_changes_forward'
      }), 'view');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'main'
      }), 'table');
    }
    if (T != null) {
      T.eq(dba.type_of({
        schema,
        name: 'sqlite_autoindex_sources_1'
      }), 'index');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this, {
        timeout: 10e3
      });
    })();
  }

}).call(this);

//# sourceMappingURL=introspection.tests.js.map