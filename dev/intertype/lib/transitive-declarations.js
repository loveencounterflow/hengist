(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, log, njs_path, praise, rpr, test, urge, warn, whisper,
    indexOf = [].indexOf;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'INTERTYPE/tests/main';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  praise = CND.get_logger('praise', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  //-----------------------------------------------------------------------------------------------------------
  this["transitive declarations 1"] = function(T, done) {
    var INTERTYPE, Intertype, all_keys_of, declare, error, has_only_keys, intertype, isa, sad, sadden, size_of, type_of, types_of, validate;
    //.........................................................................................................
    INTERTYPE = require('../../../apps/intertype');
    ({Intertype} = INTERTYPE);
    intertype = new Intertype();
    ({isa, validate, type_of, types_of, size_of, declare, sad, sadden, all_keys_of} = intertype.export());
    //.........................................................................................................
    has_only_keys = function(x, keys) {
      var k;
      for (k in x) {
        if (indexOf.call(keys, k) >= 0) {
          continue;
        }
        // urge '^227266^', "has key #{rpr k}: #{rpr x}"
        return false;
      }
      return true;
    };
    //---------------------------------------------------------------------------------------------------------
    declare('mixa_flagdefs', {
      tests: {
        "x is an object of mixa_flagdef": function(x) {
          return this.isa_object_of('mixa_flagdef', x);
        }
      }
    });
    //---------------------------------------------------------------------------------------------------------
    declare('mixa_flagdef', {
      tests: {
        "x is an object": function(x) {
          return this.isa.object(x);
        },
        "x.?type is a function": function(x) {
          return this.isa_optional.function(x.type);
        },
        "x.?alias is a text": function(x) {
          return this.isa_optional.text(x.alias);
        },
        "x.?description is a text": function(x) {
          return this.isa_optional.text(x.description);
        },
        "x.?multiple is a _mixa_multiple": function(x) {
          return this.isa_optional._mixa_multiple(x.multiple);
        },
        "x.?fallback is anything": function(x) {
          return true;
        },
        "x has only keys 'type', 'alias', 'description', 'multiple', 'fallback'": function(x) {
          return has_only_keys(x, ['type', 'alias', 'description', 'multiple', 'fallback']);
        }
      }
    });
    try {
      //.........................................................................................................
      debug('^3334^', validate.mixa_flagdefs({
        foo: {
          alias: 'f'
        }
      }));
    } catch (error1) {
      error = error1;
      warn(error.message);
    }
    try {
      debug('^3334^', validate.mixa_flagdefs({
        foo: {
          xxx: 'f'
        }
      }));
    } catch (error1) {
      error = error1;
      warn(error.message);
    }
    try {
      debug('^3334^', validate.mixa_flagdef({
        xxx: 'f'
      }));
    } catch (error1) {
      error = error1;
      warn(error.message);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

  // jsidentifier_pattern = /// ^
//   (?: [ $_ ]                    | \p{ID_Start}    )
//   (?: [ $ _ \u{200c} \u{200d} ] | \p{ID_Continue} )*
//   $ ///u
// debug /\p{Script=Katakana}/u.test 't'
// debug /\p{Script=Han}/u.test '谷'
// debug /\p{ID_Start}/u.test '谷'
// debug /\p{ID_Start}/u.test '5'
// debug jsidentifier_pattern.test 'a'
// debug jsidentifier_pattern.test '谷'
// debug jsidentifier_pattern.test '5'

}).call(this);

//# sourceMappingURL=transitive-declarations.js.map