(function() {
  'use strict';
  var CND, H, PATH, X, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    splice = [].splice;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY/TESTS/CONSTRUCTION';

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

  guy = require('../../../apps/guy');

  X = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_function = function(T, done) {
    var DBay, E, SQL, Tbl, db, dtab;
    // T?.halt_on_error()
    E = require('../../../apps/dbay/lib/errors');
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    ({DBay} = require(H.dbay_path));
    db = new DBay();
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: db
    });
    //.........................................................................................................
    E.DBay_sqlx_error = class DBay_sqlx_error extends E.DBay_error {
      constructor(ref, message) {
        super(ref, message);
      }

    };
    //.........................................................................................................
    db.definitions = {};
    db.define = function(sqlx) {
      var body, match, name, name_re, parameters, parameters_re;
      this.types.validate.nonempty_text(sqlx);
      //.......................................................................................................
      name_re = /^(?<name>@[^\s^(]+)/y;
      if ((match = sqlx.match(name_re)) == null) {
        throw new E.DBay_sqlx_error('^dbay/sqlx@1^', `syntax error in ${rpr(sqlx)}`);
      }
      ({name} = match.groups);
      //.......................................................................................................
      parameters_re = /\(\s*(?<parameters>[^)]*?)\s*\)\s*=\s*/y;
      parameters_re.lastIndex = name_re.lastIndex;
      if ((match = sqlx.match(parameters_re)) == null) {
        throw new E.DBay_sqlx_error('^dbay/sqlx@2^', `syntax error in ${rpr(sqlx)}`);
      }
      ({parameters} = match.groups);
      parameters = parameters.split(/\s*,\s*/);
      body = sqlx.slice(parameters_re.lastIndex).replace(/\s*;\s*$/, '');
      this.definitions[name] = {name, parameters, body};
      //.......................................................................................................
      return null;
    };
    //.........................................................................................................
    db.resolve = function(sqlx) {
      this.types.validate.nonempty_text(sqlx);
      return sqlx.replace(/(?<name>@[^\s^(]+)\(\s*(?<values>[^)]*?)\s*\)/g, (...P) => {
        var R, call_arity, definition, definition_arity, groups, i, idx, len, name, parameter, ref1, ref2, value, values;
        ref1 = P, [...P] = ref1, [groups] = splice.call(P, -1);
        debug('^3534^', P);
        debug('^3534^', groups);
        ({name, values} = groups);
        values = values.split(/\s*,\s*/);
        if ((definition = this.definitions[name]) == null) {
          throw new E.DBay_sqlx_error('^dbay/sqlx@3^', `unknown name ${rpr(name)}`);
        }
        debug({name, values, definition});
        if ((call_arity = values.length) !== (definition_arity = definition.parameters.length)) {
          throw new E.DBay_sqlx_error('^dbay/sqlx@4^', `expected ${definition_arity} arguments, got ${call_arity}`);
        }
        //.....................................................................................................
        R = definition.body;
        ref2 = definition.parameters;
        for (idx = i = 0, len = ref2.length; i < len; idx = ++i) {
          parameter = ref2[idx];
          value = values[idx];
          R = R.replace(RegExp(`${parameter}`, "g"), value);
          debug(rpr(R));
        }
        return R;
      });
    };
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.define(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return echo(dtab._tabulate(db(db.resolve(sql))));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return this.dbay_sqlx_function();
    })();
  }

  // test @dbay_sqlx_function

}).call(this);

//# sourceMappingURL=sqlx.tests.js.map