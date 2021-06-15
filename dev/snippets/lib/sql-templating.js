(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, rpr, urge, warn, whisper,
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
    var SQL, emptySQLPart, escapeSQLIdentifier, joinSQLValues, limit, mergedQuery, query, query2, query3, sqlPart;
    SQL = require('pgsqwell');
    ({escapeSQLIdentifier, sqlPart, emptySQLPart, joinSQLValues} = SQL);
    SQL = SQL.default;
    //.........................................................................................................
    limit = 10;
    query = SQL`SELECT id FROM users WHERE name=${'toto'} ${limit != null ? sqlPart`LIMIT ${limit}` : emptySQLPart}`;
    query2 = SQL`SELECT id FROM ${escapeSQLIdentifier('table')}`;
    query3 = SQL`SELECT id FROM users WHERE id IN ${joinSQLValues([1, 2])}}`;
    mergedQuery = SQL`${query}
UNION
${query2}
UNION
${query3}`;
    info('^337^', query);
    info('^337^', query2);
    info('^337^', query3);
    return info('^337^', mergedQuery);
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_sql_tokenizer()
      return this.demo_sql_templating_pgsqwell();
    })();
  }

}).call(this);

//# sourceMappingURL=sql-templating.js.map