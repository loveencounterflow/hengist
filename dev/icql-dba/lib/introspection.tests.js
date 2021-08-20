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

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: fields_of()"] = async function(T, done) {
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
      T.eq(dba.fields_of({
        schema,
        name: 'sources'
      }), {
        id: {
          idx: 0,
          type: 'integer',
          optional: false,
          default: null,
          is_pk: true
        },
        path: {
          idx: 1,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        }
      });
    }
    if (T != null) {
      T.eq(dba.fields_of({
        schema,
        name: 'dest_changes_backward'
      }), {
        nxt_dest: {
          idx: 0,
          type: null,
          optional: true,
          default: null,
          is_pk: false
        },
        vnr: {
          idx: 1,
          type: 'json',
          optional: true,
          default: null,
          is_pk: false
        },
        stamped: {
          idx: 2,
          type: 'boolean',
          optional: true,
          default: null,
          is_pk: false
        },
        dest: {
          idx: 3,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        },
        sid: {
          idx: 4,
          type: 'integer',
          optional: true,
          default: null,
          is_pk: false
        },
        realm: {
          idx: 5,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        },
        ref: {
          idx: 6,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        },
        key: {
          idx: 7,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        },
        text: {
          idx: 8,
          type: 'text',
          optional: true,
          default: null,
          is_pk: false
        },
        p: {
          idx: 9,
          type: 'json',
          optional: true,
          default: null,
          is_pk: false
        },
        vnr_blob: {
          idx: 10,
          type: 'blob',
          optional: true,
          default: null,
          is_pk: false
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DBA: field_names_of()"] = async function(T, done) {
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
      T.eq(dba.field_names_of({
        schema,
        name: 'sources'
      }), ['id', 'path']);
    }
    if (T != null) {
      T.eq(dba.field_names_of({
        schema,
        name: 'dest_changes_backward'
      }), ['nxt_dest', 'vnr', 'stamped', 'dest', 'sid', 'realm', 'ref', 'key', 'text', 'p', 'vnr_blob']);
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