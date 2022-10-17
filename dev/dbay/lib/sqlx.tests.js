(function() {
  'use strict';
  var DBay_sqlx, E, GUY, H, PATH, alert, debug, echo, equals, help, info, inspect, isa, log, new_xregex, plain, praise, r, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    splice = [].splice;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DBAY/sqlx'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  // X                         = require '../../../lib/helpers'
  r = String.raw;

  new_xregex = require('xregexp');

  E = require('../../../apps/dbay/lib/errors');

  //===========================================================================================================
  DBay_sqlx = class DBay_sqlx extends (require(H.dbay_path)).DBay {
    //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      super(...P);
      GUY.props.hide(this, '_sqlx_declarations', {});
      GUY.props.hide(this, '_sqlx_cmd_re', null);
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    declare(sqlx) {
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
        // throw new E.DBay_sqlx_error '^dbay/sqlx@3^', "syntax error: parentheses are obligatory but missing in #{rpr sqlx}"
        parameters = [];
      }
      //.......................................................................................................
      current_idx = (ref1 = parameters_re != null ? parameters_re.lastIndex : void 0) != null ? ref1 : name_re.lastIndex;
      body = sqlx.slice(current_idx).replace(/\s*;\s*$/, '');
      this._sqlx_declare({name, parameters, body});
      //.......................................................................................................
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    _sqlx_get_cmd_re() {
      var R, name, names;
      if ((R = this._sqlx_cmd_re) != null) {
        return R;
      }
      names = (Object.keys(this._sqlx_declarations)).sort(function(a, b) {
        a = (Array.from(a)).length;
        b = (Array.from(b)).length;
        if (a > b) {
          return +1;
        }
        if (a < b) {
          return -1;
        }
        return 0;
      });
      names = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = names.length; i < len; i++) {
          name = names[i];
          results.push(this._escape_literal_for_regex(name));
        }
        return results;
      }).call(this)).join('|');
      return this._sqlx_cmd_re = RegExp(`(?<=\\W|^)(?<name>${names})(?=\\W|$)`, "g");
    }

    //---------------------------------------------------------------------------------------------------------
    /* thx to https://stackoverflow.com/a/6969486/7568091 and
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping */
    _escape_literal_for_regex(literal) {
      return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    //---------------------------------------------------------------------------------------------------------
    _sqlx_declare(cfg) {
      if (this._sqlx_declarations[cfg.name] != null) {
        throw new E.DBay_sqlx_error('^dbay/sqlx@2^', `can not re-declare ${rpr(cfg.name)}`);
      }
      this._sqlx_cmd_re = null;
      this._sqlx_declarations[cfg.name] = cfg;
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    resolve(sqlx) {
      this.types.validate.nonempty_text(sqlx);
      return sqlx.replace(this._sqlx_get_cmd_re(), (..._matches) => {
        var _sqlx, call_arity, definition, groups, i, idx, len, match, matches, name, ref1, tail;
        ref1 = _matches, [..._matches] = ref1, [idx, _sqlx, groups] = splice.call(_matches, -3);
        // debug '^546^', rpr sqlx[ idx ... idx + groups.name.length ]
        ({name} = groups);
        tail = sqlx.slice(idx + name.length);
        //.....................................................................................................
        if ((definition = this._sqlx_declarations[name]) == null) {
          /* NOTE should never happen as we always re-compile pattern from declaration keys */
          throw new E.DBay_sqlx_error('^dbay/sqlx@4^', `unknown name ${rpr(name)}`);
        }
        //.....................................................................................................
        if (tail.startsWith('(')) {
          debug('^87-1^', rpr(tail));
          matches = new_xregex.matchRecursive(tail, '\\(', '\\)', '', {
            escapeChar: '\\',
            unbalanced: 'skip-lazy',
            valueNames: ['outside', 'before', 'between', 'after']
          });
          for (i = 0, len = matches.length; i < len; i++) {
            match = matches[i];
            if (!(match.name === 'between')) {
              continue;
            }
            debug('^87-2^', rpr(match.value));
            break;
          }
        } else {
          call_arity = 0;
        }
        // #.....................................................................................................
        // unless ( call_arity = values.length ) is ( definition_arity = definition.parameters.length )
        //   throw new E.DBay_sqlx_error '^dbay/sqlx@5^', "expected #{definition_arity} arguments, got #{call_arity}"
        // #.....................................................................................................
        // debug '^546^', groups
        return '*';
      });
      return sqlx.replace(/(?<name>@[^\s^(]+)\(\s*(?<values>[^)]*?)\s*\)/g, (...P) => {
        var R, call_arity, definition, definition_arity, groups, i, idx, len, name, parameter, ref1, ref2, value, values;
        ref1 = P, [...P] = ref1, [groups] = splice.call(P, -1);
        ({name, values} = groups);
        values = values.split(/\s*,\s*/);
        if ((definition = this._sqlx_declarations[name]) == null) {
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
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_function = function(T, done) {
    var SQL, Tbl, db, dtab;
    // T?.halt_on_error()
    ({SQL} = DBay_sqlx);
    db = new DBay_sqlx();
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
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      // echo dtab._tabulate db db.resolve sql
      return T != null ? T.eq(sql, SQL`select power( 3, 2 ) / 2;`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@max( @a, @b ) = case when @a > @b then @a else @b end;`);
      sqlx = SQL`select @max( 3, 2 ) as the_bigger_the_better;`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      // echo dtab._tabulate db db.resolve sql
      return T != null ? T.eq(sql, SQL`select case when 3 > 2 then 3 else 2 end as the_bigger_the_better;`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@concat( @first, @second ) = @first || @second;`);
      sqlx = SQL`select @concat( 'here', '\\)' );`;
      // debug '^87-5^', db._sqlx_get_cmd_re()
      // debug '^87-6^', [ ( sqlx.matchAll db._sqlx_get_cmd_re() )..., ]
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      // echo dtab._tabulate db db.resolve sql
      return T != null ? T.eq(sql, SQL`select 'here' || '\\)';`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      db.declare(SQL`@intnn() = integer not null;`);
      sqlx = SQL`create table numbers (
  n @intnn() primary key );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return T != null ? T.eq(sql, SQL`create table numbers (
  n integer not null primary key );`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      // db.declare SQL"""@intnn = integer not null;"""
      sqlx = SQL`create table numbers (
  n @intnn primary key );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return T != null ? T.eq(sql, SQL`create table numbers (
  n integer not null primary key );`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', 'b' ) as c1, @concat( 'c', 'd' ) as c2;`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return T != null ? T.eq(sql, SQL`select 'a' || 'b' as c1, 'c' || 'd' as c2;`) : void 0;
    });
    //.........................................................................................................
    db(function() {
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', @concat( 'c', 'd' ) );`;
      sql = db.resolve(sqlx);
      help(rpr(sqlx));
      info(rpr(sql));
      return T != null ? T.eq(sql, SQL`select 'a' || 'c' || 'd';`) : void 0;
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sql_lexer = function(T, done) {
    var SQL, Tbl, dtab, i, k, len, lexer, ref1, show;
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({
      dba: null
    });
    ({SQL} = DBay_sqlx);
    lexer = require('../../../../dbay-sql-lexer');
    ref1 = (GUY.props.keys(lexer)).sort();
    for (i = 0, len = ref1.length; i < len; i++) {
      k = ref1[i];
      info(k);
    }
    show = function(sql) {
      var _tokens, error, j, len1, start, stop, text, tokens, type;
      info(rpr(sql));
      try {
        _tokens = lexer.tokenize(sql);
      } catch (error1) {
        error = error1;
        warn('^35345^', GUY.trm.reverse(GUY.props.keys(error)));
        warn('^35345^', GUY.trm.reverse(error.message));
        warn('^35345^', GUY.trm.reverse(error.name));
        return null;
      }
      tokens = [];
      for (j = 0, len1 = _tokens.length; j < len1; j++) {
        [type, text, start, stop] = _tokens[j];
        tokens.push({type, text, start, stop});
      }
      // urge type, text, start, stop
      echo(dtab._tabulate(tokens));
      return null;
    };
    show(SQL`select * from my_table`);
    show(SQL`42`);
    show(SQL`( 'text', 'another''text', 42 )`);
    show(SQL`( 'text', @f( 1, 2, 3 ), 42 )`);
    show(SQL`SELECT 42 as c;`);
    show(SQL`select 'helo', 'world''';`);
    show(SQL`select 'helo', 'world'''`);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @dbay_sqlx_lexer()
      return this.dbay_sql_lexer();
    })();
  }

  // @dbay_sqlx_function()
// test @dbay_sqlx_function

}).call(this);

//# sourceMappingURL=sqlx.tests.js.map