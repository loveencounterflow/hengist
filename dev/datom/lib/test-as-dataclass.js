(function() {
  'use strict';
  var Datom, GUY, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DATOM/TESTS/AS-DATACLASS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, validate} = types);

  Datom = (function() {
    //===========================================================================================================
    class Datom {
      //---------------------------------------------------------------------------------------------------------
      static new_datom(x) {
        return new Proxy(x, {
          //.......................................................................................................
          get: function(target, key, receiver) {
            if (!Object.isFrozen(target)) {
              Object.freeze(target);
            }
            return Reflect.get(target, key, receiver);
          },
          //.......................................................................................................
          set: function(target, key, value, receiver) {
            if (!Object.isFrozen(target)) {
              Object.freeze(target);
            }
            throw new TypeError(`Cannot assign to read only property ${rpr(key)} of object ${rpr(target)}`);
          }
        });
      }

      //---------------------------------------------------------------------------------------------------------
      constructor(cfg) {
        var k, ref, ref1, ref2, ref3, ref4, v;
        /* TAINT naive implementation, check for validity */
        // debug '^12-1^', [ @constructor.declaration.template, cfg, ]
        // debug '^12-2^', [ @, ]
        // debug '^12-3^', [ @constructor, ]
        // debug '^12-4^', [ new.target, ]
        // debug '^12-5^', [ new.target.constructor, ]
        // debug '^12-6^', [ new.target?.constructor?.declaration?.template, ]
        debug('^12-6^', [(ref = this.constructor) != null ? (ref1 = ref.declaration) != null ? ref1.template : void 0 : void 0]);
        ref4 = {...((ref2 = (ref3 = this.constructor.declaration) != null ? ref3.template : void 0) != null ? ref2 : null), ...cfg};
        for (k in ref4) {
          v = ref4[k];
          this[k] = v;
        }
        return this.constructor.new_datom(this);
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Datom.declaration = {
      template: null
    };

    return Datom;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  this.datom_as_dataclass = function(T, done) {
    (function() {      // DATOM = new ( require '../../../apps/datom' ).Datom { freeze: false, }
      // probes_and_matchers = [
      //   [ [ '^foo' ], { '$fresh': true, '$key': '^foo' }, null ]
      //   [ [ '^foo', { foo: 'bar' } ], { foo: 'bar', '$fresh': true, '$key': '^foo' }, null ]
      //   [ [ '^foo', { value: 42 } ], { value: 42, '$fresh': true, '$key': '^foo' }, null ]
      //   [ [ '^foo', { value: 42 }, { '$fresh': false } ], { value: 42, '$fresh': true, '$key': '^foo' }, null ]
      //   ]
      // #.........................................................................................................
      // for [ probe, matcher, error, ] in probes_and_matchers
      //   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      //     d = DATOM.new_fresh_datom probe...
      //     T.ok not Object.isFrozen d
      //     resolve d
      //     return null
      //.........................................................................................................
      var d, error;
      d = new Datom();
      info('^12-7^', Object.isFrozen(d));
      if (T != null) {
        T.eq(Object.isFrozen(d), false);
      }
      try {
        d.foo = 42;
      } catch (error1) {
        error = error1;
        warn(GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.eq(Object.isFrozen(d), true);
      }
      if (T != null) {
        T.throws(/.*/, function() {
          return d.foo = 42;
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var E, e, error;
      E = (function() {
        class E extends Datom {
          //-----------------------------------------------------------------------------------------------------
          constructor(cfg) {
            // super { template..., cfg..., }
            super(cfg);
            return void 0;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        E.declaration = {
          template: {
            foo: 41,
            bar: 42,
            baz: 43
          }
        };

        return E;

      }).call(this);
      e = new E();
      if (T != null) {
        T.eq(Object.isFrozen(e), false);
      }
      try {
        e.foo = 42;
      } catch (error1) {
        error = error1;
        warn('^Datom@1^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/.*/, function() {
          return e.foo = 42;
        });
      }
      if (T != null) {
        T.eq(Object.isFrozen(e), true);
      }
      /* TAINT should use method independent of `inspect` (which could be user-configured?) */
      if (T != null) {
        T.eq((require('util')).inspect(e), 'E { foo: 41, bar: 42, baz: 43 }');
      }
      if (T != null) {
        T.eq(e.foo, 41);
      }
      if (T != null) {
        T.eq(e.bar, 42);
      }
      if (T != null) {
        T.eq(e.baz, 43);
      }
      if (T != null) {
        T.eq(e, {
          foo: 41,
          bar: 42,
          baz: 43
        });
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @fresh_datom_with_freeze
      return test(this.datom_as_dataclass);
    })();
  }

}).call(this);

//# sourceMappingURL=test-as-dataclass.js.map