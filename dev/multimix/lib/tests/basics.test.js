(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, nameit, plain, praise, rpr, rvr, test, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MULTIMIX/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  nameit = function(name, f) {
    return Object.defineProperty(f, 'name', {
      value: name
    });
  };

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('../../../../apps/intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_instance_methods = function(T, done) {
    var Foobar, Multimix, d, other;
    ({Multimix} = require('../../../../apps/multimix'));
    //=========================================================================================================
    Foobar = class Foobar {
      //-------------------------------------------------------------------------------------------------------
      constructor() {
        var get_handler;
        this.collector = [];
        get_handler = (name) => {
          return (props, ...P) => {
            help('^434-1^', {name, props, P});
            this.collector.push({name, props, P});
            return null;
          };
        };
        this.blah = new Multimix({
          hub: this,
          handler: get_handler('blah')
        });
        this.blurb = new Multimix({
          hub: this,
          handler: get_handler('blurb')
        });
        this.state = this.blah[Multimix.symbol].state;
        debug('^434-2^', this.state);
        return void 0;
      }

    };
    //=========================================================================================================
    debug('^434-3^', d = new Foobar());
    debug('^434-4^', d.blah.something);
    //.........................................................................................................
    debug('^434-5^', d.blah.something(42));
    debug('^434-8^', d.state);
    if (T != null) {
      T.eq(d.collector, [
        {
          name: 'blah',
          props: ['something'],
          P: [42]
        }
      ]);
    }
    //.........................................................................................................
    debug('^434-5^', d.blah.something.one.two.three(42));
    debug('^434-8^', d.state);
    if (T != null) {
      T.eq(d.collector, [
        {
          name: 'blah',
          props: ['something'],
          P: [42]
        },
        {
          name: 'blah',
          props: ['something',
        'one',
        'two',
        'three'],
          P: [42]
        }
      ]);
    }
    //.........................................................................................................
    debug('^434-6^', d.blurb.otherthing(42));
    debug('^434-7^', d.blah[Multimix.symbol].state === d.blurb[Multimix.symbol].state);
    debug('^434-8^', d.state);
    if (T != null) {
      T.eq(d.collector, [
        {
          name: 'blah',
          props: ['something'],
          P: [42]
        },
        {
          name: 'blah',
          props: ['something',
        'one',
        'two',
        'three'],
          P: [42]
        },
        {
          name: 'blurb',
          props: ['otherthing'],
          P: [42]
        }
      ]);
    }
    other = new Multimix({
      handler: function() {}
    });
    if (T != null) {
      T.eq(types.type_of(d.state), 'object');
    }
    if (T != null) {
      T.eq(types.type_of(d.state.hedges), 'list');
    }
    if (T != null) {
      T.eq(types.type_of(d.blah[Multimix.symbol].state), 'object');
    }
    if (T != null) {
      T.eq(types.type_of(d.blah[Multimix.symbol].state.hedges), 'list');
    }
    if (T != null) {
      T.ok(d.blah[Multimix.symbol].state === d.blurb[Multimix.symbol].state);
    }
    if (T != null) {
      T.ok(d.blah[Multimix.symbol].state !== other[Multimix.symbol].state);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_can_inhibit_prop_creation = function(T, done) {
    var Multimix, collectors, d, handler, hub;
    ({Multimix} = require('../../../../apps/multimix'));
    hub = {};
    collectors = {
      handler: [],
      foo: []
    };
    handler = function(hedges, x) {
      collectors.handler.push({hedges, x});
      urge('^334^', {hedges, x});
      return null;
    };
    if (T != null) {
      T.throws(/expected boolean or function/, function() {
        var d;
        return d = new Multimix({
          hub,
          handler,
          create: 123
        });
      });
    }
    //.........................................................................................................
    d = new Multimix({
      hub,
      handler,
      create: false
    });
    d.foo = function(hedges, x) {
      collectors.foo.push({hedges, x});
      return null;
    };
    //.........................................................................................................
    d.foo(42);
    if (T != null) {
      T.eq(d.bar, void 0);
    }
    if (T != null) {
      T.throws(/not a function/, function() {
        return d.bar(42);
      });
    }
    if (T != null) {
      T.eq(collectors, {
        handler: [],
        foo: [
          {
            hedges: 42,
            x: void 0
          }
        ]
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_can_use_function_for_create = function(T, done) {
    var Multimix, branch, collector, create, d, handler, hub, i, len, mmx, ref;
    ({Multimix} = require('../../../../apps/multimix'));
    hub = {};
    collector = [];
    handler = function(hedges, x) {
      debug('^403-1^', {hedges, x});
      collector.push({hedges, x});
      return x * 2;
    };
    create = function(key, target) {
      // debug '^403-1^', { key, }
      collector.push(key);
      target[key] = new Multimix({hub, create, handler});
      return null;
    };
    //.........................................................................................................
    d = new Multimix({
      hub,
      handler,
      create: true
    });
    mmx = d[Multimix.symbol];
    //.........................................................................................................
    urge('^002-1^', rpr(d.foo));
    urge('^002-2^', rpr(d.bar));
    urge('^002-3^', rpr(d.foo.bar));
    urge('^002-4^', rpr(d.foo.bar.baz));
    ref = GUY.props.tree(d);
    for (i = 0, len = ref.length; i < len; i++) {
      branch = ref[i];
      help('^002-4^', branch);
    }
    if (T != null) {
      T.eq(rpr(d.foo), '[Function: foo]');
    }
    if (T != null) {
      T.eq(rpr(d.bar), '[Function: bar]');
    }
    if (T != null) {
      T.eq(rpr(d.foo.bar), '[Function: bar]');
    }
    if (T != null) {
      T.eq(rpr(d.foo.bar.baz), '[Function: baz]');
    }
    if (T != null) {
      T.ok(d.uno.duo.tres === d.uno.duo.tres);
    }
    if (T != null) {
      T.ok(d.uno.duo.tres !== d.uno.duo.quatro);
    }
    urge('^002-5^', "d             1          ", rvr(d(1)), mmx.state);
    urge('^002-6^', "d.foo.bar.baz 2          ", rvr(d.foo.bar.baz(2)), mmx.state);
    urge('^002-7^', "d             3          ", rvr(d(3)), mmx.state);
    urge('^002-8^', "d.foo.bar.baz 4          ", rvr(d.foo.bar.baz(4)), mmx.state);
    urge('^002-9^', "d.foo.bar.baz d.one.two 3", rvr(d.foo.bar.baz(d.one.two(3))), mmx.state);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_props_are_hidden_by_default = function(T, done) {
    var Multimix, d, handler, i, len, nope, props, ref;
    ({Multimix} = require('../../../../apps/multimix'));
    nope = Symbol('nope');
    handler = function() {};
    d = new Multimix({handler});
    //.........................................................................................................
    urge('^002-1^', rpr(d.foo));
    urge('^002-2^', rpr(d.bar));
    urge('^002-3^', rpr(d.foo.bar));
    urge('^002-4^', rpr(d.foo.bar.baz));
    if (T != null) {
      T.ok((GUY.props.get(d, 'xxx', nope)) === nope);
    }
    if (T != null) {
      T.ok((GUY.props.get(d, 'foo', nope)) !== nope);
    }
    if (T != null) {
      T.ok((GUY.props.get(d, 'duo', nope)) === nope);
    }
    if (T != null) {
      T.eq((Object.getOwnPropertyDescriptor(d, 'foo')).enumerable, false);
    }
    ref = GUY.props.tree(d);
    for (i = 0, len = ref.length; i < len; i++) {
      props = ref[i];
      help('^002-1^', props.join('.'));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_no_assignment_with_create_function = function(T, done) {
    var Multimix, collector, create, d, handler;
    ({Multimix} = require('../../../../apps/multimix'));
    collector = [];
    handler = function(props, ...P) {
      return debug('^888-1^', {props, P});
    };
    create = function(key, target) {
      debug('^888-2^', key);
      collector.push(key);
      return {
        /* return value to be silently discarded */
        key: 'value'
      };
    };
    //.........................................................................................................
    d = new Multimix({handler, create});
    //.........................................................................................................
    if (T != null) {
      T.eq(d.foo, void 0);
    }
    if (T != null) {
      T.throws(/undefined/, function() {
        var error;
        try {
          return d.foo.bar;
        } catch (error1) {
          error = error1;
          warn('^888-3^', rvr(error.message));
          throw error;
        }
      });
    }
    if (T != null) {
      T.eq(collector, ['foo', 'foo']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_cfg_strict = function(T, done) {
    var Multimix, handler, hub;
    ({Multimix} = require('../../../../apps/multimix'));
    hub = {};
    handler = function() {};
    handler.bar = 123;
    (() => {      //.........................................................................................................
      var d, mmx;
      d = new Multimix({
        hub,
        handler,
        strict: true
      });
      mmx = d[Multimix.symbol];
      debug('^080^', mmx);
      debug('^080^', GUY.props.get(handler, 'bar', Symbol('nope')));
      debug('^080^', GUY.props.has(handler, 'bar'));
      debug('^080^', GUY.props.get(d, 'bar', Symbol('nope')));
      debug('^080^', GUY.props.has(d, 'bar'));
      if (T != null) {
        T.eq(d.bar, 123);
      }
      if (T != null) {
        T.eq(mmx.strict, true);
      }
      if (T != null) {
        T.eq(mmx.create, false);
      }
      return T != null ? T.throws(/no such property/, function() {
        var error;
        try {
          return d.anything;
        } catch (error1) {
          error = error1;
          warn('^454-1^', rvr(error.message));
          throw error;
        }
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.throws(/cannot set both `create` and `strict`/, function() {
          var d, error;
          try {
            return d = new Multimix({
              hub,
              handler,
              create: true,
              strict: true
            });
          } catch (error1) {
            error = error1;
            warn('^454-2^', rvr(error.message));
            throw error;
          }
        });
      }
      return T != null ? T.throws(/cannot set both `create` and `strict`/, function() {
        var d, error;
        try {
          return d = new Multimix({
            hub,
            handler,
            create: (function() {}),
            strict: true
          });
        } catch (error1) {
          error = error1;
          warn('^454-3^', rvr(error.message));
          throw error;
        }
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var d, mmx;
      d = new Multimix({hub, handler});
      mmx = d[Multimix.symbol];
      debug('^080^', mmx);
      if (T != null) {
        T.eq(mmx.strict, false);
      }
      return T != null ? T.eq(mmx.create, true) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_cfg_oneshot = function(T, done) {
    var Multimix, handler, hub;
    ({Multimix} = require('../../../../apps/multimix'));
    hub = {};
    handler = function(props, x) {};
    (() => {      //.........................................................................................................
      var d, isa, mmx;
      isa = function(hedges, x) {
        var hedge, i, len;
        if (hedges.length === 0) {
          throw new Error("no types given");
        }
        if (hedges.length === 1) {
          return (typeof x) === hedges[0];
        }
        for (i = 0, len = hedges.length; i < len; i++) {
          hedge = hedges[i];
          if (!isa([hedge], x)) {
            return false;
          }
        }
        return true;
      };
      d = new Multimix({
        hub,
        handler: isa,
        strict: false,
        oneshot: true
      });
      mmx = d[Multimix.symbol];
      debug('^080-1^', mmx);
      if (T != null) {
        T.ok(types.isa.function(d.bar));
      }
      if (T != null) {
        T.eq(mmx.strict, false);
      }
      if (T != null) {
        T.eq(mmx.create, true);
      }
      if (T != null) {
        T.eq(mmx.oneshot, true);
      }
      if (T != null) {
        T.eq(mmx.deletion, true);
      }
      if (T != null) {
        T.eq(types.type_of(d.function), 'function');
      }
      if (T != null) {
        T.eq(d.function(function() {}), true);
      }
      if (T != null) {
        T.eq(d.function(null), false);
      }
      if (T != null) {
        T.throws(/oneshot object does not allow re-assignment to property 'function'/, function() {
          var error;
          try {
            return d.function = 9;
          } catch (error1) {
            error = error1;
            warn('^080-1^', rvr(error.message));
            throw error;
          }
        });
      }
      delete d.function;
      return T != null ? T.eq(types.type_of(d.function), 'function') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_cfg_deletion = function(T, done) {
    var Multimix, handler, hub;
    ({Multimix} = require('../../../../apps/multimix'));
    hub = {};
    handler = function(props, x) {};
    (() => {      //.........................................................................................................
      var d, isa, mmx;
      isa = function(hedges, x) {
        var hedge, i, len;
        if (hedges.length === 0) {
          throw new Error("no types given");
        }
        if (hedges.length === 1) {
          return (typeof x) === hedges[0];
        }
        for (i = 0, len = hedges.length; i < len; i++) {
          hedge = hedges[i];
          if (!isa([hedge], x)) {
            return false;
          }
        }
        return true;
      };
      d = new Multimix({
        hub,
        handler: isa,
        deletion: false
      });
      mmx = d[Multimix.symbol];
      debug('^081-1^', mmx);
      if (T != null) {
        T.ok(types.isa.function(d.bar));
      }
      if (T != null) {
        T.eq(mmx.strict, false);
      }
      if (T != null) {
        T.eq(mmx.create, true);
      }
      if (T != null) {
        T.eq(mmx.oneshot, false);
      }
      if (T != null) {
        T.eq(mmx.deletion, false);
      }
      if (T != null) {
        T.eq(types.type_of(d.function), 'function');
      }
      return T != null ? T.throws(/object does not allow deletion of property 'function'/, function() {
        var error;
        try {
          return delete d.function;
        } catch (error1) {
          error = error1;
          warn('^082-1^', rvr(error.message));
          throw error;
        }
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mmx_state_shared_or_not = function(T, done) {
    var Multimix, hub, mmx_1a, mmx_1b, mmx_2a, mmx_2b, mmx_3a, mmx_3b, mmxs;
    ({Multimix} = require('../../../../apps/multimix'));
    mmxs = Multimix.symbol;
    hub = {};
    mmx_1a = (new Multimix({
      hub: {},
      handler: (function() {})
    }))[mmxs];
    mmx_1b = (new Multimix({
      hub: {},
      handler: (function() {})
    }))[mmxs];
    mmx_2a = (new Multimix({
      handler: (function() {})
    }))[mmxs];
    mmx_2b = (new Multimix({
      handler: (function() {})
    }))[mmxs];
    mmx_3a = (new Multimix({
      hub,
      handler: (function() {})
    }))[mmxs];
    mmx_3b = (new Multimix({
      hub,
      handler: (function() {})
    }))[mmxs];
    //.........................................................................................................
    if (T != null) {
      T.ok(mmx_1a.hub !== mmx_1b.hub);
    }
    if (T != null) {
      T.ok(mmx_1a.state !== mmx_1b.state);
    }
    if (T != null) {
      T.ok(mmx_1a.state.hedges !== mmx_1b.state.hedges);
    }
    if (T != null) {
      T.ok(mmx_2a.hub !== mmx_2b.hub);
    }
    if (T != null) {
      T.ok(mmx_2a.state !== mmx_2b.state);
    }
    if (T != null) {
      T.ok(mmx_2a.state.hedges !== mmx_2b.state.hedges);
    }
    if (T != null) {
      T.ok(mmx_3a.hub === mmx_3b.hub);
    }
    if (T != null) {
      T.ok(mmx_3a.state === mmx_3b.state);
    }
    if (T != null) {
      T.ok(mmx_3a.state.hedges === mmx_3b.state.hedges);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @_demo_intertype_with_multimix()
      // test @mmx_instance_methods
      // @mmx_can_inhibit_prop_creation()
      // test @mmx_can_inhibit_prop_creation
      // @mmx_cfg_strict()
      // test @mmx_cfg_strict
      // test @mmx_can_use_function_for_create
      // test @mmx_no_assignment_with_create_function
      // test @mmx_props_are_hidden_by_default
      // @mmx_state_shared_or_not()
      // test @mmx_state_shared_or_not
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=basics.test.js.map