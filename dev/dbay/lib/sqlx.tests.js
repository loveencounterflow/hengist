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
    db.declare = function(sqlx) {
      var body, current_idx, match, name, name_re, parameters, parameters_re, ref1;
      this.types.validate.nonempty_text(sqlx);
      parameters_re = null;
      //.......................................................................................................
      name_re = /^(?<name>@[^\s^(]+)/y;
      if ((match = sqlx.match(name_re)) == null) {
        throw new E.DBay_sqlx_error('^dbay/sqlx@1^', `syntax error in ${rpr(sqlx)}`);
      }
      ({name} = match.groups);
      //.......................................................................................................
      if (sqlx[name_re.lastIndex] === '(') {
        parameters_re = /\(\s*(?<parameters>[^)]*?)\s*\)\s*=\s*/y;
        parameters_re.lastIndex = name_re.lastIndex;
        if ((match = sqlx.match(parameters_re)) == null) {
          throw new E.DBay_sqlx_error('^dbay/sqlx@2^', `syntax error in ${rpr(sqlx)}`);
        }
        ({parameters} = match.groups);
        parameters = parameters.split(/\s*,\s*/);
      } else {
        /* extension for declaration, call w/out parentheses left for later */
        throw new E.DBay_sqlx_error('^dbay/sqlx@3^', `syntax error: parentheses are obligatory but missing in ${rpr(sqlx)}`);
      }
      // parameters              = []
      current_idx = (ref1 = parameters_re != null ? parameters_re.lastIndex : void 0) != null ? ref1 : name_re.lastIndex;
      body = sqlx.slice(current_idx).replace(/\s*;\s*$/, '');
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
        ({name, values} = groups);
        values = values.split(/\s*,\s*/);
        if ((definition = this.definitions[name]) == null) {
          throw new E.DBay_sqlx_error('^dbay/sqlx@4^', `unknown name ${rpr(name)}`);
        }
        if ((call_arity = values.length) !== (definition_arity = definition.parameters.length)) {
          throw new E.DBay_sqlx_error('^dbay/sqlx@5^', `expected ${definition_arity} arguments, got ${call_arity}`);
        }
        //.....................................................................................................
        R = definition.body;
        ref2 = definition.parameters;
        for (idx = i = 0, len = ref2.length; i < len; idx = ++i) {
          parameter = ref2[idx];
          value = values[idx];
          R = R.replace(RegExp(`${parameter}`, "g"), value);
        }
        return R;
      });
    };
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return echo(dtab._tabulate(db(db.resolve(sql))));
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@max( @a, @b ) = case when @a > @b then @a else @b end;`);
      sqlx = SQL`select @max( 3, 2 ) as the_bigger_the_better;`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return echo(dtab._tabulate(db(db.resolve(sql))));
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@intnn() = integer not null;`);
      sqlx = SQL`create table numbers (
  n @intnn() primary key );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      return info(rpr(sql));
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