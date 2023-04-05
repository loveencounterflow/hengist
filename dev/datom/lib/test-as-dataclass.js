(function() {
  'use strict';
  var GUY, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, types, urge, validate, warn, whisper,
    indexOf = [].indexOf;

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

  //-----------------------------------------------------------------------------------------------------------
  this.datom_as_dataclass = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var d, error;
      d = new Dataclass();
      info('^12-7^', Object.isFrozen(d));
      if (T != null) {
        T.eq(Object.isFrozen(d), true); // used to be false
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
        class Quantity extends Dataclass {
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
        T.eq(Object.isFrozen(q), true); // used to be false
      }
      try {
        q.foo = 42;
      } catch (error1) {
        error = error1;
        warn('^Dataclass@1^', GUY.trm.reverse(error.message));
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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_automatic_validation = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var Quantity, q;
      Quantity = (function() {
        //.......................................................................................................
        class Quantity extends Dataclass {};

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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_deep_freezing = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var Something, s;
      Something = (function() {
        class Something extends Dataclass {};

        Something.declaration = {
          // freeze:   'deep' ### the default ###
          fields: {
            values: 'list.of.integer'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
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
      var Something, error, s;
      Something = (function() {
        class Something extends Dataclass {};

        Something.declaration = {
          // freeze:   'deep' ### the default ###
          fields: {
            values: 'list.of.integer'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
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
      debug('^23-2^', s);
      debug('^23-3^', Object.isFrozen(s));
      debug('^23-4^', Object.isFrozen(s.values));
      try {
        s.values.push(7);
      } catch (error1) {
        error = error1;
        warn('^Dataclass@2^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/object is not extensible/, function() {
          return s.values.push(7);
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var Something, s;
      Something = (function() {
        class Something extends Dataclass {};

        Something.declaration = {
          freeze: false/* no freezing, fully mutable */,
          fields: {
            values: 'list.of.integer'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something({
        values: [3, 5]
      });
      debug('^23-5^', s);
      if (T != null) {
        T.eq(Object.isFrozen(s), false);
      }
      if (T != null) {
        T.eq(Object.isFrozen(s.values), false);
      }
      debug('^23-6^', s);
      debug('^23-7^', Object.isFrozen(s));
      debug('^23-8^', Object.isFrozen(s.values));
      s.values.push(7);
      s.extra = 42;
      if (T != null) {
        T.eq(s, {
          values: [3, 5, 7],
          extra: 42
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var Something, error, s;
      Something = (function() {
        class Something extends Dataclass {};

        Something.declaration = {
          freeze: true/* freeze instance but not its properties */,
          fields: {
            values: 'list.of.integer'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something({
        values: [3, 5]
      });
      // s.values # access property to trigger freezing
      if (T != null) {
        T.eq(Object.isFrozen(s), true);
      }
      if (T != null) {
        T.eq(Object.isFrozen(s.values), false);
      }
      debug('^23-9^', s);
      debug('^23-10^', Object.isFrozen(s));
      debug('^23-11^', Object.isFrozen(s.values));
      debug('^23-11^', rpr(s.extra));
      s.values.push(7);
      try {
        s.extra = 42;
      } catch (error1) {
        error = error1;
        warn('^Dataclass@3^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/Cannot assign to read only property/, function() {
          return s.extra = 42;
        });
      }
      if (T != null) {
        T.eq(s, {
          values: [3, 5, 7]
        });
      }
      return null;
    })();
    (function() {      //.........................................................................................................
      var Something, error, s;
      Something = (function() {
        class Something extends Dataclass {};

        Something.declaration = {
          freeze: 'shallow'/* freeze instance but not its properties */,
          fields: {
            values: 'list.of.integer'
          },
          template: {
            values: []
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something({
        values: [3, 5]
      });
      // s.values # access property to trigger freezing
      if (T != null) {
        T.eq(Object.isFrozen(s), true);
      }
      if (T != null) {
        T.eq(Object.isFrozen(s.values), false);
      }
      debug('^23-9^', s);
      debug('^23-10^', Object.isFrozen(s));
      debug('^23-11^', Object.isFrozen(s.values));
      debug('^23-11^', rpr(s.extra));
      s.values.push(7);
      try {
        s.extra = 42;
      } catch (error1) {
        error = error1;
        warn('^Dataclass@3^', GUY.trm.reverse(error.message));
      }
      if (T != null) {
        T.throws(/Cannot assign to read only property/, function() {
          return s.extra = 42;
        });
      }
      if (T != null) {
        T.eq(s, {
          values: [3, 5, 7]
        });
      }
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_custom_types_instance = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var Something, my_types, s;
      my_types = new (require('../../../apps/intertype')).Intertype();
      my_types.declare.awesome_list({
        isa: 'list.of.integer'
      });
      Something = (function() {
        //.......................................................................................................
        class Something extends Dataclass {};

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
        class Something extends Dataclass {};

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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_computed_properties = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var Something, s;
      Something = (function() {
        //.......................................................................................................
        class Something extends Dataclass {
          // create: ( x ) ->
          //   return x unless @isa.object x
          //   R = { x..., }
          //   GUY.props.def R, 'id', get: -> "#{@mode}:#{@name}"
          constructor(...P) {
            super(...P);
            GUY.props.def(this, 'id', {
              enumerable: true,
              get: () => {
                return `${this.mode}:${this.name}`;
              },
              set: (value) => {
                var parts;
                this.__types.validate.nonempty.text(value);
                parts = value.split(':');
                this.mode = parts[0];
                this.name = parts.slice(1).join(':');
                return null;
              }
            });
            return void 0;
          }

        };

        //-----------------------------------------------------------------------------------------------------
        Something.declaration = {
          freeze: false,
          fields: {
            mode: 'nonempty.text',
            name: 'nonempty.text'
          },
          template: {
            mode: null,
            name: null
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something({
        mode: 'mymode',
        name: 'p'
      });
      debug('^464561^', s);
      if (T != null) {
        T.eq(s, {
          mode: 'mymode',
          name: 'p',
          id: 'mymode:p'
        });
      }
      debug('^464561^', s.id);
      s.id = 'foo:bar';
      if (T != null) {
        T.eq(s, {
          mode: 'foo',
          name: 'bar',
          id: 'foo:bar'
        });
      }
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_method_to_trigger_declaration = function(T, done) {
    var Dataclass;
    ({Dataclass} = require('../../../apps/datom'));
    (function() {      //.........................................................................................................
      var Something, my_types, s;
      my_types = new (require('../../../apps/intertype')).Intertype();
      Something = (function() {
        //.......................................................................................................
        class Something extends Dataclass {};

        //-----------------------------------------------------------------------------------------------------
        Something.types = my_types;

        Something.declaration = {
          fields: {
            mode: 'nonempty.text',
            name: 'nonempty.text',
            id: 'nonempty.text'
          },
          template: {
            mode: null,
            name: null,
            id: null
          },
          create: function(x) {
            var R;
            if (!this.isa.object(x)) {
              return x;
            }
            R = {
              ...x,
              id: `${x.mode}:${x.name}`
            };
            return R;
          }
        };

        return Something;

      }).call(this);
      //.......................................................................................................
      s = new Something({
        mode: 'mymode',
        name: 'p'
      });
      if (T != null) {
        T.eq(s, {
          mode: 'mymode',
          name: 'p',
          id: 'mymode:p'
        });
      }
      if (T != null) {
        T.eq((indexOf.call(Object.keys(my_types.registry), 'Something') >= 0), true);
      }
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.datom_dataclass_with_instance_methods = function(T, done) {
    var Dataclass, Token, base_types;
    ({Dataclass} = require('../../../apps/datom'));
    //.........................................................................................................
    base_types = new (require('../../../apps/intertype')).Intertype();
    base_types.declare.ilx_codeunit_idx('positive0.integer');
    base_types.declare.ilx_line_number('positive1.integer');
    base_types.declare.ilx_token_value('text');
    base_types.declare.ilx_token_key(function(x) {
      if (!this.isa.text(x)) {
        return false;
      }
      return (x.indexOf(':')) !== -1;
    });
    Token = (function() {
      var clasz;

      //.......................................................................................................
      class Token extends Dataclass {
        set_mode(mode) {
          return this.__types.create[this.constructor.name]({
            ...this,
            $key: `${mode}:${this.lxid}`
          });
        }

      };

      clasz = Token;

      Token.types = base_types;

      Token.declaration = {
        fields: {
          $key: 'ilx_token_key',
          lnr1: 'ilx_line_number',
          x1: 'ilx_codeunit_idx',
          lnr2: 'ilx_line_number',
          x2: 'ilx_codeunit_idx',
          value: 'ilx_token_value'
        },
        template: {
          $key: null,
          lnr1: 1,
          x1: 0,
          lnr2: null,
          x2: null,
          value: ''
        },
        create: function(x) {
          var R, g/* NOTE safeguard against `$key` missing/wrong in user-supplied value */;
          if ((x != null) && !this.isa.object(x)) {
            // debug '^create@108-5^', clasz
            return x;
          }
          R = {...this.registry.Token.template, ...x};
          if (R.lnr2 == null) {
            R.lnr2 = R.lnr1;
          }
          if (R.x2 == null) {
            R.x2 = R.x1;
          }
          if (this.isa.text(R.$key)) {
            g = (R.$key.match(/^(?<mode>[^:]+):(?<lxid>.+)$/)).groups;
            R.mode = g.mode;
            R.lxid = g.lxid;
          }
          return R;
        }
      };

      return Token;

    }).call(this);
    // base_types.declare Token
    new Token({
      $key: 'foo:bar'
    });
    info('^93-1^', {...base_types.registry.integer});
    info('^93-2^', {...base_types.registry.Token});
    (function() {      //.........................................................................................................
      var d;
      d = new Token({
        $key: 'plain:p:start',
        lnr1: 123
      });
      debug('^93-3^', d);
      info('^93-4^', GUY.trm.truth(d.set_mode != null));
      // e = d.set_mode 'tag'
      // debug '^93-5^', e
      return null;
    })();
    (function() {      //.........................................................................................................
      var d;
      d = base_types.create.Token({
        $key: 'plain:p:start',
        lnr1: 123
      });
      debug('^93-6^', d);
      info('^93-7^', GUY.trm.truth(d.set_mode != null));
      // e = d.set_mode 'tag'
      // debug '^93-8^', e
      return null;
    })();
    (function() {      //.........................................................................................................
      var d, e;
      d = base_types.create.Token({
        $key: 'plain:p:start',
        lnr1: 123
      });
      debug('^93-6^', d);
      info('^93-7^', GUY.trm.truth(d.set_mode != null));
      e = new Token(d);
      info('^93-7^', GUY.trm.truth(e.set_mode != null));
      // e = d.set_mode 'tag'
      // debug '^93-8^', e
      return null;
    })();
    (function() {      //.........................................................................................................
      var d;
      d = base_types._create_no_validation({
        ...Token.declaration,
        cfg: {
          $key: 'plain:p:start',
          lnr1: 123
        }
      });
      debug('^93-6^', d);
      // info '^93-7^', GUY.trm.truth d.set_mode?
      // e = new Token d
      // info '^93-7^', GUY.trm.truth e.set_mode?
      // e = d.set_mode 'tag'
      // debug '^93-8^', e
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
      // test @
      // test @datom_dataclass_method_to_trigger_declaration
      return this.datom_dataclass_with_instance_methods();
    })();
  }

  // test @datom_dataclass_with_instance_methods
// test @datom_as_dataclass
// test @datom_dataclass_automatic_validation
// @datom_dataclass_deep_freezing()
// test @datom_dataclass_deep_freezing
// test @datom_dataclass_computed_properties

}).call(this);

//# sourceMappingURL=test-as-dataclass.js.map