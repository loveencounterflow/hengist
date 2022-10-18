(function() {
  'use strict';
  var DBay_sqlx, E, GUY, H, PATH, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, isa, log, new_xregex, plain, praise, r, rpr, sql_lexer, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
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

  equals = (require('util')).isDeepStrictEqual;

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  // { SQL  }          = DBay_sqlx
  sql_lexer = require('../../../../dbay-sql-lexer');

  //===========================================================================================================
  E.DBay_sqlx_error = class DBay_sqlx_error extends E.DBay_error {
    constructor(ref, message) {
      super(ref, message);
    }

  };

  //===========================================================================================================
  DBay_sqlx = class DBay_sqlx { // extends ( require H.dbay_path ).DBay
    
      //---------------------------------------------------------------------------------------------------------
    constructor(...P) {
      // super P...
      GUY.props.hide(this, '_sqlx_declarations', {});
      GUY.props.hide(this, '_sqlx_cmd_re', null);
      GUY.props.hide(this, 'types', types);
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    declare(sqlx) {
      var arity, body, current_idx, match, name, name_re, parameters, parameters_re, ref1;
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
        if (equals(parameters, [''])) {
          parameters = [];
        }
      } else {
        /* extension for declaration, call w/out parentheses left for later */
        // throw new E.DBay_sqlx_error '^dbay/sqlx@3^', "syntax error: parentheses are obligatory but missing in #{rpr sqlx}"
        parameters = [];
      }
      //.......................................................................................................
      current_idx = (ref1 = parameters_re != null ? parameters_re.lastIndex : void 0) != null ? ref1 : name_re.lastIndex;
      body = sqlx.slice(current_idx).replace(/\s*;\s*$/, '');
      arity = parameters.length;
      this._sqlx_declare({name, parameters, arity, body});
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
      return this._sqlx_cmd_re = RegExp(`(?<=\\W|^)(?<name>${names})(?=\\W|$)(?<tail>.*)$`, "g");
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
      var count, sql_after, sql_before;
      this.types.validate.nonempty_text(sqlx);
      sql_before = sqlx;
      count = 0;
      while (true) {
        if (count++ > 10_000/* NOTE to avoid deadlock, just in case */) {
          //.......................................................................................................
          break;
        }
        sql_after = sql_before.replace(this._sqlx_get_cmd_re(), (..._matches) => {
          var R, _sqlx, call_arity, center, declaration, groups, i, idx, left, len, matches, name, parameter, ref1, ref2, right, tail, value, values;
          ref1 = _matches, [..._matches] = ref1, [idx, _sqlx, groups] = splice.call(_matches, -3);
          // debug '^546^', rpr sqlx[ idx ... idx + groups.name.length ]
          ({name, tail} = groups);
          //...................................................................................................
          if ((declaration = this._sqlx_declarations[name]) == null) {
            /* NOTE should never happen as we always re-compile pattern from declaration keys */
            throw new E.DBay_sqlx_error('^dbay/sqlx@4^', `unknown name ${rpr(name)}`);
          }
          //...................................................................................................
          if (tail.startsWith('(')) {
            matches = new_xregex.matchRecursive(tail, '\\(', '\\)', '', {
              escapeChar: '\\',
              unbalanced: 'skip-lazy',
              valueNames: ['ignore', 'left', 'center', 'right']
            });
            [left, center, right] = matches;
            tail = tail.slice(right.end);
            values = this._find_arguments(center.value);
            call_arity = values.length;
          } else {
            call_arity = 0;
          }
          //...................................................................................................
          if (call_arity !== declaration.arity) {
            throw new E.DBay_sqlx_error('^dbay/sqlx@5^', `expected ${declaration.arity} argument(s), got ${call_arity}`);
          }
          //...................................................................................................
          R = declaration.body;
          ref2 = declaration.parameters;
          for (idx = i = 0, len = ref2.length; i < len; idx = ++i) {
            parameter = ref2[idx];
            value = values[idx];
            R = R.replace(RegExp(`${parameter}`, "g"), value);
          }
          return R + tail;
        });
        if (sql_after === sql_before) {
          break;
        }
        sql_before = sql_after;
      }
      //.......................................................................................................
      return sql_after;
    }

    //---------------------------------------------------------------------------------------------------------
    _find_arguments(sqlx) {
      var R, _tokens, comma_idxs, i, idx, j, l, len, len1, level, lnr, offset, ref1, start, stop, text, token, tokens, type;
      sqlx = sqlx.trim();
      tokens = [];
      R = [];
      //.......................................................................................................
      _tokens = sql_lexer.tokenize(sqlx);
      for (i = 0, len = _tokens.length; i < len; i++) {
        [type, text, lnr, offset] = _tokens[i];
        tokens.push({type, text, lnr, offset});
      }
      //.......................................................................................................
      level = 0;
      comma_idxs = [
        {
          start: null,
          stop: 0
        }
      ];
      for (j = 0, len1 = tokens.length; j < len1; j++) {
        token = tokens[j];
        switch (token.type) {
          case 'LEFT_PAREN':
            level++;
            break;
          case 'RIGHT_PAREN':
            level--;
            break;
          case 'COMMA':
            if (level === 0) {
              comma_idxs.push({
                start: token.offset,
                stop: token.offset + token.text.length
              });
            }
            break;
          default:
            null;
        }
      }
      comma_idxs.push({
        start: sqlx.length,
        stop: null
      });
//.......................................................................................................
      for (idx = l = 1, ref1 = comma_idxs.length; (1 <= ref1 ? l < ref1 : l > ref1); idx = 1 <= ref1 ? ++l : --l) {
        start = comma_idxs[idx - 1].stop;
        stop = comma_idxs[idx].start;
        R.push(sqlx.slice(start, stop).trim());
      }
      if (equals(R, [''])) {
        //.......................................................................................................
        R = [];
      }
      return R;
    }

  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_function = function(T, done) {
    var DBay, SQL, _test, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay_sqlx();
    //.........................................................................................................
    _test = function(probe, matcher) {
      var error, sql, sqlx;
      try {
        sqlx = probe;
        sql = db.resolve(sqlx);
        help(rpr(sqlx));
        info(rpr(sql));
        return T != null ? T.eq(sql, matcher) : void 0;
      } catch (error1) {
        error = error1;
        return T != null ? T.eq("ERROR", `${error.message}\n${rpr(probe)}`) : void 0;
      }
    };
    //.........................................................................................................
    db.declare(SQL`@secret_power( @a, @b ) = power( @a, @b ) / @b;`);
    db.declare(SQL`@max( @a, @b ) = case when @a > @b then @a else @b end;`);
    db.declare(SQL`@concat( @first, @second ) = @first || @second;`);
    db.declare(SQL`@intnn() = integer not null;`);
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @secret_power( 3, 2 );`;
      sql = SQL`select power( 3, 2 ) / 2;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @max( 3, 2 ) as the_bigger_the_better;`;
      sql = SQL`select case when 3 > 2 then 3 else 2 end as the_bigger_the_better;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'here', '\\)' );`;
      sql = SQL`select 'here' || '\\)';`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`create table numbers (
  n @intnn() primary key );`;
      sql = SQL`create table numbers (
  n integer not null primary key );`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`create table numbers (
  n @intnn primary key );`;
      sql = SQL`create table numbers (
  n integer not null primary key );`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', 'b' ) as c1, @concat( 'c', 'd' ) as c2;`;
      sql = SQL`select 'a' || 'b' as c1, 'c' || 'd' as c2;`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( 'a', @concat( 'c', 'd' ) );`;
      sql = SQL`select 'a' || 'c' || 'd';`;
      return _test(sqlx, sql);
    })();
    (function() {      //.........................................................................................................
      var sql, sqlx;
      sqlx = SQL`select @concat( ',', @concat( ',', ',' ) );`;
      sql = SQL`select ',' || ',' || ',';`;
      return _test(sqlx, sql);
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sqlx_find_arguments = function(T, done) {
    var DBay, SQL, _test, db;
    // T?.halt_on_error()
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    db = new DBay_sqlx();
    _test = function(probe, matcher) {
      var result;
      result = db._find_arguments(probe);
      help('^43-1^', probe);
      urge('^43-1^', result);
      return T != null ? T.eq(result, matcher) : void 0;
    };
    _test(SQL` 3, 2 `, ['3', '2']);
    _test(SQL` 3, f( 2, 4 ) `, ['3', 'f( 2, 4 )']);
    _test(SQL` 3, f( 2, @g( 4, 5, 6 ) ) `, ['3', 'f( 2, @g( 4, 5, 6 ) )']);
    _test(SQL` 3, 2, "strange,name" `, ['3', '2', '"strange,name"']);
    _test(SQL`           `, []);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.dbay_sql_lexer = async function(T, done) {
    var DBay, SQL, error, i, j, k, len, len1, lexer, matcher, probe, probes_and_matchers, ref1, show;
    ({DBay} = require(H.dbay_path));
    ({SQL} = DBay);
    lexer = require('../../../../dbay-sql-lexer');
    ref1 = (GUY.props.keys(lexer)).sort();
    for (i = 0, len = ref1.length; i < len; i++) {
      k = ref1[i];
      info(k);
    }
    //.........................................................................................................
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
    //.........................................................................................................
    probes_and_matchers = [[SQL`select * from my_table`, [['SELECT', 'select', 1, 0], ['STAR', '*', 1, 7], ['FROM', 'from', 1, 9], ['LITERAL', 'my_table', 1, 14], ['EOF', '', 1, 22]]], [SQL`42`, [['NUMBER', '42', 1, 0], ['EOF', '', 1, 2]]], [SQL`( 'text', 'another''text', 42 )`, [['LEFT_PAREN', '(', 1, 0], ['STRING', 'text', 1, 2], ['COMMA', ',', 1, 8], ['STRING', "another'text", 1, 10], ['COMMA', ',', 1, 25], ['NUMBER', '42', 1, 27], ['RIGHT_PAREN', ')', 1, 30], ['EOF', '', 1, 31]]], [SQL`( 'text', @f( 1, 2, 3 ), 42 )`, [['LEFT_PAREN', '(', 1, 0], ['STRING', 'text', 1, 2], ['COMMA', ',', 1, 8], ['UNKNOWN', '@', 1, 10], ['LITERAL', 'f', 1, 11], ['LEFT_PAREN', '(', 1, 12], ['NUMBER', '1', 1, 14], ['COMMA', ',', 1, 15], ['NUMBER', '2', 1, 17], ['COMMA', ',', 1, 18], ['NUMBER', '3', 1, 20], ['RIGHT_PAREN', ')', 1, 22], ['COMMA', ',', 1, 23], ['NUMBER', '42', 1, 25], ['RIGHT_PAREN', ')', 1, 28], ['EOF', '', 1, 29]]], [SQL`SELECT 42 as c;`, [['SELECT', 'SELECT', 1, 0], ['NUMBER', '42', 1, 7], ['AS', 'as', 1, 10], ['LITERAL', 'c', 1, 13], ['SEMICOLON', ';', 1, 14], ['EOF', '', 1, 15]]], [SQL`select 'helo', 'world''';`, [['SELECT', 'select', 1, 0], ['STRING', 'helo', 1, 7], ['COMMA', ',', 1, 13], ['STRING', "world'", 1, 15], ['SEMICOLON', ';', 1, 24], ['EOF', '', 1, 25]]], [SQL`select 'helo', 'world'''`, [['SELECT', 'select', 1, 0], ['STRING', 'helo', 1, 7], ['COMMA', ',', 1, 13], ['STRING', "world'", 1, 15], ['EOF', '', 1, 24]]], ["this is any text $%§'§", [['LITERAL', 'this', 1, 0], ['OPERATOR', 'is', 1, 5], ['SUB_SELECT_OP', 'any', 1, 8], ['LITERAL', 'text', 1, 12], ['UNKNOWN', '$', 1, 17], ['UNKNOWN', '%', 1, 18], ['UNKNOWN', '§', 1, 19], ['UNKNOWN', "'", 1, 20], ['UNKNOWN', '§', 1, 21], ['EOF', '', 1, 22]], null]];
//.........................................................................................................
    for (j = 0, len1 = probes_and_matchers.length; j < len1; j++) {
      [probe, matcher, error] = probes_and_matchers[j];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          result = lexer.tokenize(probe);
          show(probe);
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // @dbay_sql_lexer()
// @dbay_sqlx_find_arguments()
// test @dbay_sqlx_find_arguments
// @dbay_sqlx_function()
// test @dbay_sqlx_function

}).call(this);

//# sourceMappingURL=sqlx.tests.js.map