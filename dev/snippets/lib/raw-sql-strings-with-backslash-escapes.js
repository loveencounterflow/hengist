(function() {
  'use strict';
  var CND, DBay, SQL, badge, debug, echo, help, info, rpr, urge, warn, whisper;

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

  ({DBay} = require('../../../apps/dbay'));

  ({SQL} = DBay);

  //-----------------------------------------------------------------------------------------------------------
  this.demo_sql_strings = function() {
    var db, ref, ref1, ref2, ref3, ref4, ref5, row;
    // SQL = ( parts, expressions... ) ->
    //   R = parts[ 0 ]
    //   for expression, idx in expressions
    //     R += expression.toString() + parts[ idx + 1 ]
    //   return R
    //.........................................................................................................
    urge(rpr(`foo\nbar\u4e11 \${1+2} ${3 + 4}`));
    urge(rpr(SQL`foo\nbar\u4e11 \${1+2} ${3 + 4}`));
    urge(rpr(String.raw`foo\nbar\u4e11 \${1+2} ${3 + 4}`));
    //.........................................................................................................
    db = new DBay();
    ref = db(`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref) {
      info(row);
    }
    ref1 = db(SQL`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref1) {
      info(row);
    }
    ref2 = db(String.raw`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref2) {
      info(row);
    }
    ref3 = db(`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref3) {
      //.........................................................................................................
      urge(row.text);
    }
    ref4 = db(SQL`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref4) {
      urge(row.text);
    }
    ref5 = db(String.raw`select 'a\x08b foo\nbar\u4e11 \${1+2} ${3 + 4}' as text;`);
    for (row of ref5) {
      urge(row.text);
    }
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_sql_strings();
    })();
  }

}).call(this);

//# sourceMappingURL=raw-sql-strings-with-backslash-escapes.js.map