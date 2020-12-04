(function() {
  // { inspect: rpr, }         = require 'loupe'
  var foo, log, name, rpr, validate;

  ({
    inspect: rpr
  } = require('/home/flow/temp/svelte-and-sapper-for-print/app2-fresh/static/loupe.js'));

  ({
    inspect: foo
  } = require('../node-and-browser-module.js'));

  validate = require('validate-npm-package-name');

  log = console.log;

  log(rpr);

  name = 'abc';

  log(rpr(name), rpr(validate(name)));

  name = 'ABC';

  log(rpr(name), rpr(validate(name)));

  name = 'µ';

  log(rpr(name), rpr(validate(name)));

  name = 'micro';

  log(rpr(name), rpr(validate(name)));

  name = '偉大';

  log(rpr(name), rpr(validate(name)));

  log(foo([true, null, void 0, {}, ['a'], new Set(), Buffer.from('abc')]));

}).call(this);

//# sourceMappingURL=main.js.map