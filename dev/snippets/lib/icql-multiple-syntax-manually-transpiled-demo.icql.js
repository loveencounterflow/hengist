(function() {
  'use strict';
  var Dba, _icql_row, _icql_rows, dba, log, schema;

  ({Dba} = require('../../../apps/icql-dba'));

  dba = new Dba();

  schema = 'v';

  dba._attach({
    schema,
    ram: true
  });

  // which syntax is this?

  // %%%.sql
  _icql_rows = dba.query(`select 'helo from sql' as greeting;`);

  for (_icql_row of _icql_rows) {
    console.log(_icql_row);
  }

  // %%%.coffee
  log = console.log;

  log('^1333^', "helo from coffeescript");

  
log( `helo from JS` );

// %%%.js
;

  // %%%.coffee

}).call(this);

//# sourceMappingURL=icql-multiple-syntax-manually-transpiled-demo.icql.js.map