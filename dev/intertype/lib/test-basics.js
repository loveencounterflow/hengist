(async function() {
  'use strict';
  var GUY, TMP_types, alert, debug, echo, help, info, inspect, log, plain, praise, reverse, rpr, sample_declarations, test, throws, try_and_show, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertype'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  test = require('../../../apps/guy-test');

  TMP_types = new (require('intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  // s                         = ( name ) -> Symbol.for  name
  // ps                        = ( name ) -> Symbol      name

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  //###########################################################################################################

  // #===========================================================================================================
  // isa_object = ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
  // as_object = ( x ) ->
  //   return x unless isa_object x
  //   R       = {}
  //   R[ k ]  = as_object v for k, v of x
  //   return R

  //===========================================================================================================
  sample_declarations = {
    boolean: function(x) {
      return (x === true) || (x === false);
    },
    function: function(x) {
      return (Object.prototype.toString.call(x)) === '[object Function]';
    },
    asyncfunction: function(x) {
      return (Object.prototype.toString.call(x)) === '[object AsyncFunction]';
    },
    symbol: function(x) {
      return (typeof x) === 'symbol';
    },
    object: function(x) {
      return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
    },
    text: function(x) {
      return (typeof x) === 'string';
    },
    nullary: function(x) {
      return (x != null) && ((x.length === 0) || (x.size === 0));
    },
    unary: function(x) {
      return (x != null) && ((x.length === 1) || (x.size === 1));
    },
    binary: function(x) {
      return (x != null) && ((x.length === 2) || (x.size === 2));
    },
    trinary: function(x) {
      return (x != null) && ((x.length === 3) || (x.size === 3));
    }
  };

  //===========================================================================================================
  throws = async function(T, matcher, f) {
    await (async() => {
      var error, matcher_type, message;
      error = null;
      debug('^992-56^', matcher, TMP_types.type_of(matcher));
      try {
        await f();
      } catch (error1) {
        error = error1;
        switch (matcher_type = TMP_types.type_of(matcher)) {
          case 'text':
            if (T != null) {
              T.eq(error.message, matcher);
            }
            break;
          case 'regex':
            matcher.lastIndex = 0;
            if (matcher.test(error.message)) {
              null;
            } else {
              warn('^992-4^', reverse(message = `error ${rpr(error.message)} doesn't match ${rpr(matcher)}`));
              T.fail(`^992-4^ ${message}`);
            }
            break;
          default:
            warn(message = `^992-1^ expected a regex or a text, got a ${matcher_type}`);
            T.fail(message);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    return null;
  };

  //===========================================================================================================
  try_and_show = function(T, f) {
    var e, message;
    e = null;
    try {
      urge('^992-2^', f());
    } catch (error1) {
      e = error1;
      help('^992-3^', reverse(`try_and_show: ${rpr(e.message)}`));
    }
    if (e == null) {
      warn('^992-4^', reverse(message = "expected an error but none was thrown"));
      T.fail("^992-5^ expected an error but none was thrown");
    }
    return null;
  };

  //###########################################################################################################

  //===========================================================================================================
  this.interface = function(T, done) {
    var INTERTYPE;
    INTERTYPE = require('../../../apps/intertype');
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_isa), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_isa_optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_validate), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.get_validate_optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.isa), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.isa.optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.validate), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.object(INTERTYPE.types.validate.optional), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.isa.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.isa.optional.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.validate.boolean), true);
    }
    if (T != null) {
      T.eq(TMP_types.isa.function(INTERTYPE.types.validate.optional.boolean), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.basic_functionality = function(T, done) {
    var INTERTYPE, types;
    // T?.halt_on_error()
    INTERTYPE = require('../../../apps/intertype');
    types = new INTERTYPE.Intertype(sample_declarations);
    if (T != null) {
      T.eq(types.isa.boolean(false), true);
    }
    if (T != null) {
      T.eq(types.isa.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.isa.boolean(null), false);
    }
    if (T != null) {
      T.eq(types.isa.boolean(1), false);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(false), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(null), true);
    }
    if (T != null) {
      T.eq(types.isa.optional.boolean(1), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.validate.boolean(false), false);
    }
    if (T != null) {
      T.eq(types.validate.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(true), true);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(false), false);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(void 0), void 0);
    }
    if (T != null) {
      T.eq(types.validate.optional.boolean(null), null);
    }
    try_and_show(T, function() {
      return types.validate.boolean(1);
    });
    try_and_show(T, function() {
      return types.validate.optional.boolean(1);
    });
    throws(T, /expected a boolean/, function() {
      return types.validate.boolean(1);
    });
    throws(T, /expected an optional boolean/, function() {
      return types.validate.optional.boolean(1);
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of(null), 'null');
    }
    if (T != null) {
      T.eq(types.type_of(void 0), 'undefined');
    }
    if (T != null) {
      T.eq(types.type_of(false), 'boolean');
    }
    if (T != null) {
      T.eq(types.type_of(Symbol('p')), 'symbol');
    }
    if (T != null) {
      T.eq(types.type_of({}), 'object');
    }
    if (T != null) {
      T.eq(types.type_of(0/0), 'unknown');
    }
    if (T != null) {
      T.eq(types.type_of(+2e308), 'unknown');
    }
    if (T != null) {
      T.eq(types.type_of(-2e308), 'unknown');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      this.basic_functionality();
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map