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

      // DATOM = new ( require '../../../apps/datom' ).Datom { freeze: false, }
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
        var __types, clasz, declaration, k, ref, ref1, v;
        clasz = this.constructor;
        __types = (ref = clasz.types) != null ? ref : new (require('../../../apps/intertype')).Intertype();
        GUY.props.hide(this, '__types', __types);
        if ((declaration = clasz.declaration) != null) {
          this.__types.declare[clasz.name](declaration);
          ref1 = this.__types.create[clasz.name](cfg);
          for (k in ref1) {
            v = ref1[k];
            this[k] = v;
          }
        }
        return clasz.new_datom(this);
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Datom.declaration = null;

    return Datom;

  }).call(this);

  //-----------------------------------------------------------------------------------------------------------
  this.datom_as_dataclass = function(T, done) {
    (function() {      //.........................................................................................................
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
      var Quantity, error, q;
      Quantity = (function() {
        class Quantity extends Datom {
          //-----------------------------------------------------------------------------------------------------
          constructor(cfg) {
            // super { template..., cfg..., }
            super(cfg);
            return void 0;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Quantity.declaration = {
          fields: {
            q: 'float',
            u: 'nonempty.text'
          },
          template: {
            q: 0,
            u: 'unit'
          }
        };

        return Quantity;

      }).call(this);
      //.......................................................................................................
      q = new Quantity();
      if (T != null) {
        T.eq(Object.isFrozen(q), false);
      }
      try {
        q.foo = 42;
      } catch (error1) {
        error = error1;
        warn('^Datom@1^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/.*/, function() {
          return q.foo = 42;
        });
      }
      if (T != null) {
        T.eq(Object.isFrozen(q), true);
      }
      /* TAINT should use method independent of `inspect` (which could be user-configured?) */
      if (T != null) {
        T.eq((require('util')).inspect(q), "Quantity { q: 0, u: 'unit' }");
      }
      if (T != null) {
        T.eq(q.q, 0);
      }
      if (T != null) {
        T.eq(q.u, 'unit');
      }
      if (T != null) {
        T.eq(q, {
          q: 0,
          u: 'unit'
        });
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_automatic_validation = function(T, done) {
    (function() {      //.........................................................................................................
      var Quantity, q;
      Quantity = (function() {
        //.......................................................................................................
        class Quantity extends Datom {};

        //-----------------------------------------------------------------------------------------------------
        Quantity.declaration = {
          fields: {
            q: 'float',
            u: 'nonempty.text'
          },
          template: {
            q: 0,
            u: 'unit'
          }
        };

        return Quantity;

      }).call(this);
      // #-----------------------------------------------------------------------------------------------------
      // constructor: ( cfg ) ->
      //   # super { template..., cfg..., }
      //   super cfg
      //   return undefined
      //.......................................................................................................
      if (T != null) {
        T.eq((q = new Quantity()), {
          q: 0,
          u: 'unit'
        });
      }
      if (T != null) {
        T.eq((q = new Quantity({
          q: 0,
          u: 'unit'
        })), {
          q: 0,
          u: 'unit'
        });
      }
      if (T != null) {
        T.eq((q = new Quantity({
          q: 23,
          u: 'm'
        })), {
          q: 23,
          u: 'm'
        });
      }
      if (T != null) {
        T.throws(/not a valid Quantity/, function() {
          return q = new Quantity({
            q: 23,
            u: ''
          });
        });
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_deep_freezing = function(T, done) {
    var Something;
    Something = (function() {
      //.........................................................................................................
      class Something extends Datom {};

      //-------------------------------------------------------------------------------------------------------
      Something.declaration = {
        freeze: 'deep',
        fields: {
          values: 'list.of.integer'
        },
        template: {
          values: []
        }
      };

      return Something;

    }).call(this);
    (function() {      //.........................................................................................................
      var s;
      if (T != null) {
        T.eq((s = new Something()), {
          values: []
        });
      }
      if (T != null) {
        T.eq((s = new Something({
          values: [3, 5]
        })), {
          values: [3, 5]
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var error, s;
      s = new Something({
        values: [3, 5]
      });
      debug('^23-1^', s);
      if (T != null) {
        T.eq(Object.isFrozen(s), true);
      }
      if (T != null) {
        T.eq(Object.isFrozen(s.values), true);
      }
      try {
        s.values.push(7);
      } catch (error1) {
        error = error1;
        warn('^Datom@1^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/object is not extensible/, function() {
          return s.values.push(7);
        });
      }
      return null;
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_custom_types_instance = function(T, done) {
    (function() {      //.........................................................................................................
      var Something, my_types, s;
      my_types = new (require('../../../apps/intertype')).Intertype();
      my_types.declare.awesome_list({
        isa: 'list.of.integer'
      });
      Something = (function() {
        //.......................................................................................................
        class Something extends Datom {};

        //-----------------------------------------------------------------------------------------------------
        Something.types = my_types;

        Something.declaration = {
          freeze: 'deep',
          fields: {
            values: 'awesome_list'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something([4, 5, 6]);
      if (T != null) {
        T.eq(my_types === s.__types, true);
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var Something, my_types;
      my_types = new (require('../../../apps/intertype')).Intertype();
      my_types.declare.awesome_list({
        isa: 'list.of.integer'
      });
      Something = (function() {
        //.......................................................................................................
        class Something extends Datom {};

        //-----------------------------------------------------------------------------------------------------
        Something.types = my_types;

        Something.declaration = {
          freeze: 'deep',
          fields: {
            values: 'awesome_list'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      if (T != null) {
        T.throws(/not a valid Something/, function() {
          return new Something({
            values: ['wronk']
          });
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
      return test(this);
    })();
  }

  // test @datom_as_dataclass
// test @datom_dataclass_automatic_validation

}).call(this);

//# sourceMappingURL=test-as-dataclass.js.map