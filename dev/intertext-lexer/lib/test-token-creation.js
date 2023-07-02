(function() {
  'use strict';
  var DATOM, GUY, H, H2, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/BASICS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  H2 = require('./helpers');

  after = (dts, f) => {
    return new Promise(function(resolve) {
      return setTimeout((function() {
        return resolve(f());
      }), dts * 1000);
    });
  };

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this.__token_creation_with_dataclass = function(T, done) {
    var Interlex, lexer;
    // T?.halt_on_error()
    ({Interlex} = require('../../../apps/intertext-lexer'));
    lexer = new Interlex();
    (function() {      //.........................................................................................................
      var error;
      if (T != null) {
        T.ok(indexOf.call(Object.keys(lexer.types.registry), 'Token') >= 0);
      }
      try {
        lexer.types.create.Token();
      } catch (error1) {
        error = error1;
        warn('^93-1^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/not a valid/, function() {
          return lexer.types.create.Token();
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var d, e;
      debug('^93-1^', lexer.types.create.Token({
        $key: 'foo:bar'
      }));
      d = lexer.types.create.Token({
        $key: 'plain:p:start',
        lnr1: 123
      });
      e = d.set_mode('tag');
      debug('^93-1^', d);
      debug('^93-1^', e);
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @lex_tags
      return test(this);
    })();
  }

  // @token_creation_with_dataclass()
// test @lex_tags_with_rpr
// test @parse_md_stars_markup

}).call(this);

//# sourceMappingURL=test-token-creation.js.map