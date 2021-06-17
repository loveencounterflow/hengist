(function() {
  'use strict';
  var CND, Sql, badge, debug, echo, help, info, rpr, urge, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'SQL-TEMPLATING';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_tokenizer = function() {
    var cfg, color_count, colors, idx, sql, token, tokenize, tokens;
    cfg = {
      regExp: require('mysql-tokenizer/lib/regexp-sql92')
    };
    tokenize = (require('mysql-tokenizer'))(cfg);
    sql = `select *, 'helo world' as "text" from blah order by 1; insert sfksi 1286982342 &/$/&;`;
    tokens = tokenize(sql + '\n');
    colors = [
      (function(...P) {
        return CND.reverse(CND.blue(...P));
      }),
      (function(...P) {
        return CND.reverse(CND.yellow(...P));
      })
    ];
    color_count = colors.length;
    tokens = (function() {
      var i, len, results;
      results = [];
      for (idx = i = 0, len = tokens.length; i < len; idx = ++i) {
        token = tokens[idx];
        results.push(colors[modulo(idx, color_count)](token));
      }
      return results;
    })();
    return info(tokens.join(''));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_templating_pgsqwell = function() {
    var SQL, emptySQLPart, escapeSQLIdentifier, joinSQLValues, limit, limit_sql, mergedQuery, query, query2, query3, sqlPart, text, values;
    SQL = require('pgsqwell');
    ({escapeSQLIdentifier, sqlPart, emptySQLPart, joinSQLValues} = SQL);
    SQL = SQL.default;
    //.........................................................................................................
    limit = null;
    limit = 10;
    limit_sql = limit != null ? sqlPart`LIMIT ${limit}` : emptySQLPart;
    query = SQL`SELECT id FROM users WHERE name=${'toto'} ${limit_sql}`;
    query2 = SQL`SELECT id FROM ${escapeSQLIdentifier('table')}`;
    query3 = SQL`SELECT id FROM users WHERE id IN ${joinSQLValues([1, 2])}`;
    mergedQuery = SQL`${query}
UNION
${query2}
UNION
${query3}`;
    ({text, values} = query);
    info('^337^', {text, values});
    ({text, values} = query2);
    info('^337^', {text, values});
    ({text, values} = query3);
    info('^337^', {text, values});
    ({text, values} = mergedQuery);
    return info('^337^', {text, values});
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_template = function() {
    var SQL, conditions, obj, show;
    SQL = require('sql-template');
    show = function(fragment) {
      return help(rpr(fragment.text), CND.gold(rpr(fragment.values)));
    };
    show(SQL`select * from foo`);
    show(SQL`select * from foo where age > ${22}`);
    conditions = {
      name: 'John Doe'
    };
    show(SQL`select * from foo $where${conditions}`);
    conditions = {
      id: [1, 2, 3],
      type: 'snow'
    };
    show(SQL`select * from foo $where${conditions}`);
    show(SQL`update foo $set${{
      joe: 22,
      bar: 'ok'
    }}`);
    show(SQL`insert into foo $keys${["joe", "bar"]} values (${22}, ${'ok'})}`);
    show(SQL`insert into foo ( joe, bar ) $values${{
      joe: 22,
      bar: 'ok'
    }}`);
    obj = {
      first: 'John',
      last: 'Doe'
    };
    show(SQL`insert into foo $keys${Object.keys(obj)} $values${obj}`);
    show(SQL`select * from $id${'foo'}`);
    show(SQL`select * from $id${'foo'} where id $in${[1, 2, 3]}`);
    return null;
  };

  Sql = (function() {
    //===========================================================================================================
    class Sql {
      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        // SQL: ( parts, values... ) =>
        //   debug '^557^', [ parts, values, @cfg, ]
        //   return "your SQL string: #{rpr parts}, values: #{rpr values}"

        //---------------------------------------------------------------------------------------------------------
        this.I = this.I.bind(this);
        //---------------------------------------------------------------------------------------------------------
        this.L = this.L.bind(this);
        // throw new E.Dba_sql_value_error '^dba@323^', type, x

        //---------------------------------------------------------------------------------------------------------
        this.X = this.X.bind(this);
        // super()
        this.types = new (require('intertype')).Intertype();
        this.cfg = cfg/* TAINT freeze */
        return void 0;
      }

      I(name) {
        return '"' + (name.replace(/"/g, '""')) + '"';
      }

      L(x) {
        var type;
        if (x == null) {
          return 'null';
        }
        switch (type = this.types.type_of(x)) {
          case 'text':
            return "'" + (x.replace(/'/g, "''")) + "'";
          // when 'list'       then return "'#{@list_as_json x}'"
          case 'float':
            return x.toString();
          case 'boolean':
            return (x ? '1' : '0');
          case 'list':
            throw new Error("^dba@23^ use `X()` for lists");
        }
        throw new Error('^dba@323^', type, x);
      }

      X(x) {
        var e, type;
        if ((type = this.types.type_of(x)) !== 'list') {
          throw new Error(`^dba@132^ expected a list, got a ${type}`);
        }
        return '( ' + (((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = x.length; i < len; i++) {
            e = x[i];
            results.push(this.L(e));
          }
          return results;
        }).call(this)).join(', ')) + ' )';
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Sql.prototype.SQL = String.raw;

    return Sql;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  this.demo_Xxx = function() {
    var I, L, SQL, X, a_max, limit, selection, sql, strange, table, truth;
    sql = new Sql({
      this_setting: true,
      that_setting: 123
    });
    ({SQL, I, L, X} = sql);
    table = 'that other "table"';
    a_max = 123;
    limit = 10;
    truth = true;
    strange = "strange 'value'%";
    selection = ['the', 'one', 'or', 'other'];
    info('^3344^\n', SQL`select
    a, b, c
  from ${I(table)}
  where ${truth}
    and ( a > ${L(a_max)} )
    and ( b like ${L(strange)} )
    and ( c in ${X(selection)} )
  limit ${L(limit)};`);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_sql_tokenizer()
      // @demo_sql_templating_pgsqwell()
      // @demo_sql_template()
      return this.demo_Xxx();
    })();
  }

}).call(this);

//# sourceMappingURL=sql-templating.js.map