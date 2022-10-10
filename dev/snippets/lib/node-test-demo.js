(function() {
  'use strict';
  var GUY, _emitWarning, debug, echo, help, info, k, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({debug, info, whisper, warn, urge, help} = GUY.trm.get_loggers('METTEUR'));

  ({rpr, echo} = GUY.trm);

  //...........................................................................................................
  /* thx to https://github.com/nodejs/node/issues/30810#issuecomment-1107861393 */
  _emitWarning = process.emitWarning.bind(process);

  process.emitWarning = function(message, type) {
    if (type === 'ExperimentalWarning') {
      return whisper(message);
    }
    return _emitWarning(message, type);
  };

  //...........................................................................................................
  test = require('node:test');

  debug('^3453^', test);

  debug('^3453^', (function() {
    var results;
    results = [];
    for (k in test) {
      results.push(k);
    }
    return results;
  })());

  // test "^tc-1^ 42 > 1", ( t ) -> throw new Error "foo" unless 42 > 1
  // test "^tc-2^ 42 < 0", ( t ) -> throw new Error "foo" unless 42 < 0
  // test "^tc-3^ 42 < 0", ( t, done ) -> done()
  // test "^tc-4^ 42 < 0", ( t, done ) -> done false
  // test "^tc-5^ 42 < 0", ( t, done ) -> done true
  // test "^tc-5^ 42 < 0", ( t, done ) -> throw new Error "foobar"
  test("^tc-6^ 42 < 0", function(t) {
    var i, n;
    for (n = i = 1; i <= 3; n = ++i) {
      t.test(`subtest ${n}`, function() {
        return true;
      });
    }
    return null;
  });

}).call(this);

//# sourceMappingURL=node-test-demo.js.map