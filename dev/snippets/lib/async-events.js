(async function() {
  'use strict';
  var AE, Async_events, Datom, Event, Event_results, GUY, alert, debug, demo_1, demo_2, echo, help, info, inspect, isa, isa_optional, log, plain, praise, ps, resolved_promise, reverse, rpr, s, urge, validate, validate_optional, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('subsidiary'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  // test                      = require 'guy-test'
  //...........................................................................................................
  resolved_promise = Promise.resolve();

  s = function(name) {
    return Symbol.for(name);
  };

  ps = function(name) {
    return Symbol(name);
  };

  //===========================================================================================================
  isa = {
    anything: function(x) {
      return true;
    },
    nothing: function(x) {
      return x == null;
    },
    something: function(x) {
      return x != null;
    },
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
    event_listener: function(x) {
      return (this.function(x)) || (this.asyncfunction(x));
    },
    event_key: function(x) {
      return (this.text(x)) || (this.symbol(x));
    },
    nullary: function(x) {
      return (x != null) && (x.length === 0);
    },
    unary: function(x) {
      return (x != null) && (x.length === 1);
    },
    binary: function(x) {
      return (x != null) && (x.length === 2);
    },
    unary_or_binary: function(x) {
      return (x != null) && ((x.length === 1) || (x.length === 2));
    },
    $freeze: function(x) {
      return isa.boolean(x);
    }
  };

  //===========================================================================================================
  ({isa_optional, validate, validate_optional} = (() => {
    var test, type;
    isa_optional = {};
    validate = {};
    validate_optional = {};
//.........................................................................................................
    for (type in isa) {
      test = isa[type];
      ((type, test) => {
        isa_optional[type] = (x) => {
          if (x != null) {
            return test(x);
          } else {
            return true;
          }
        };
        validate_optional[type] = (x) => {
          if (x != null) {
            return validate[type](x);
          } else {
            return x;
          }
        };
        return validate[type] = (x) => {
          if (test.call(isa, x)) {
            return x;
          }
          /* TAINT `typeof` will give some strange results */
          throw new Error(`expected a ${type}, got a ${typeof x}`);
        };
      })(type, test);
    }
    //.........................................................................................................
    return {isa_optional, validate, validate_optional};
  })());

  //===========================================================================================================
  Datom = class Datom {
    /* all API methods should start with `$` like `$key` and `$value` */
    //---------------------------------------------------------------------------------------------------------
    constructor($key, $value = null) {
      var $freeze, ref, ref1, values;
      if (!isa.unary_or_binary(arguments)) {
        throw new Error(`expected 1 or 2 arguments, got ${arguments.length}`);
      }
      //.......................................................................................................
      if (arguments.length === 1) {
        if (isa.object($key)) {
          $value = $key;
          $key = (ref = $value.$key) != null ? ref : null;
        }
      }
      //.......................................................................................................
      this.$key = $key;
      if (isa.object($value)) {
        values = {...$value};
        delete values.$key/* special case: ensure we don't overwrite 'explicit' `$key` */
        Object.assign(this, values);
      } else {
        if ($value != null) {
          this.$value = $value;
        }
      }
      //.......................................................................................................
      $freeze = (ref1 = validate_optional.$freeze(this.$freeze)) != null ? ref1 : true;
      delete this.$freeze;
      if ($freeze) {
        Object.freeze(this);
      }
      //.......................................................................................................
      validate.event_key(this.$key);
      return void 0;
    }

  };

  //===========================================================================================================
  Event = class Event extends Datom {};

  //===========================================================================================================
  Event_results = class Event_results extends Datom {
    //---------------------------------------------------------------------------------------------------------
    constructor(event, results) {
      if (!isa.binary(arguments)) {
        throw new Error(`expected 2 arguments, got ${arguments.length}`);
      }
      super('event-results', {event, results});
      return void 0;
    }

  };

  //===========================================================================================================
  Async_events = class Async_events {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      this.symbols = {};
      this.listeners = new WeakMap();
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    on(key, receiver) {
      var key_symbol, listener, listener0, listener_name, registry, unsubscribe;
      if (!isa.binary(arguments)) {
        /* TAINT prevent from registering a listener more than once per event key */
        throw new Error(`expected 2 arguments, got ${arguments.length}`);
      }
      validate.event_key(key);
      validate.something(receiver);
      if ((key_symbol = this.symbols[key]) == null) {
        //.......................................................................................................
        /* TAINT is this necessary and does it what it intends to do? */
        /* use Symbol, WeakMap to allow for garbage collection when `Async_events` instance gets out of scope: */
        this.symbols[key] = (key_symbol = Symbol(key));
      }
      if ((registry = this.listeners.get(key_symbol)) == null) {
        this.listeners.set(key_symbol, (registry = []));
      }
      //.......................................................................................................
      /* if receiver is a callable, use it; else, try to retrieve a suitably named method and use that: */
      if (isa.event_listener(receiver)) {
        listener = receiver;
      } else {
        listener_name = `on_${key}`;
        listener0 = validate.event_listener(receiver[listener_name]);
        listener = async function(...P) {
          return (await listener0.call(receiver, ...P));
        };
      }
      //.......................................................................................................
      registry[key_symbol] = listener;
      unsubscribe = function() {};
      return unsubscribe;
    }

    //---------------------------------------------------------------------------------------------------------
    /* TAINT pass arguments to new Datom / new Event */
    async emit(key, data = null) {
      var event, listener, listeners, ref, results;
      if (!isa.unary_or_binary(arguments)) {
        throw new Error(`expected 1 or 2 arguments, got ${arguments.length}`);
      }
      event = new Event(key, data);
      listeners = (ref = AE.listeners.get(AE.symbols[key])) != null ? ref : [];
      for (listener of listeners) {
        help('^992-1^', listener);
      }
      for (listener of listeners) {
        help('^992-2^', (await listener(key, data)));
      }
      await resolved_promise/* as per https://github.com/sindresorhus/emittery/blob/main/index.js#L363 */
      results = (await Promise.all((function() {
        var results1;
        results1 = [];
        for (listener of listeners) {
          results1.push((async function() {
            return (await listener(key, data));
          })());
        }
        return results1;
      })()));
      return new Event_results(event, results);
    }

  };

  // #---------------------------------------------------------------------------------------------------------
  // matches: ( matcher, candidate ) ->

  //===========================================================================================================
  AE = new Async_events();

  //===========================================================================================================
  demo_1 = async function() {
    var e, receiver;
    receiver = {
      on_blah: function(key, data) {
        info('^992-3^', key, data, this);
        return JSON.stringify({key, data});
      },
      on_foo: function(key, data) {
        info('^992-4^', key, data, this);
        return JSON.stringify({key, data});
      },
      on_dig: function(key, data) {
        info('^992-5^', key, data, this);
        return JSON.stringify({key, data});
      }
    };
    AE.on('blah', receiver);
    AE.on('foo', receiver);
    AE.on('dig', receiver.on_dig);
    debug('^992-6^', AE);
    debug('^992-7^', AE.symbols['blah']);
    debug('^992-8^', AE.listeners);
    debug('^992-9^', AE.listeners.get(AE.symbols['blah']));
    debug('^992-10^', (await AE.emit('blah')));
    debug('^992-11^', (await AE.emit('foo')));
    debug('^992-12^', (await AE.emit('dig')));
    try {
      /* TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: */
      debug('^992-13^', (await AE.emit('foo', 3, 4, 5, 6)));
    } catch (error) {
      e = error;
      warn('^992-14^', reverse(e.message));
    }
    try {
      debug('^992-15^', (await AE.emit('foo', 3, [4, 5, 6])));
    } catch (error) {
      e = error;
      warn('^992-16^', reverse(e.message));
    }
    debug('^992-17^', (await AE.emit('foo', [3, 4, 5, 6])));
    return null;
  };

  //===========================================================================================================
  demo_2 = async function() {
    var A, B, e;
    A = class A {};
    B = class B extends Object {};
    urge('^992-18^', A);
    urge('^992-19^', A.freeze);
    urge('^992-20^', new A());
    urge('^992-21^', B);
    urge('^992-22^', new B());
    urge('^992-23^', isa.object(A));
    urge('^992-24^', isa.object(B));
    urge('^992-25^', isa.object(new A()));
    urge('^992-26^', isa.object(new B()));
    try {
      new Datom();
    } catch (error) {
      e = error;
      warn('^992-27^', reverse(e.message));
    }
    try {
      new Datom(5);
    } catch (error) {
      e = error;
      warn('^992-28^', reverse(e.message));
    }
    try {
      new Datom(null);
    } catch (error) {
      e = error;
      warn('^992-29^', reverse(e.message));
    }
    try {
      new Datom({});
    } catch (error) {
      e = error;
      warn('^992-30^', reverse(e.message));
    }
    urge('^992-31^', new Datom('foo'));
    urge('^992-32^', new Datom('foo', null));
    urge('^992-33^', new Datom('foo', void 0));
    urge('^992-34^', new Datom('foo', 56));
    urge('^992-35^', new Datom('foo', {
      bar: 56
    }));
    urge('^992-36^', new Datom('foo', {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-37^', new Datom(s`foo`, {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-38^', new Datom({
      bar: 56,
      $key: 'other'
    }));
    urge('^992-39^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: false
    }));
    urge('^992-40^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: true
    }));
    urge('^992-41^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: null
    }));
    urge('^992-42^', new Datom('something', {
      $freeze: false
    }));
    urge('^992-43^', new Datom('something', {
      $freeze: true
    }));
    urge('^992-44^', new Datom('something', {
      $freeze: null
    }));
    (() => {      //.........................................................................................................
      /* must set `{ $freeze: false, }` explicitly else datom will be (superficially) frozen: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      d.p = 7;
      urge('^992-45^', d);
      return null;
    })();
    (() => {      //.........................................................................................................
      /* passing in an existing datom (or event) `d` into `new Datom d` (or `new Event d`) results in a copy
       of `d`: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      e = new Datom(d);
      urge('^992-46^', d, e, d === e);
      return null;
    })();
    //.........................................................................................................
    /* events are just `Datom`s: */
    urge('^992-47^', new Event(s`foo`, {
      bar: 56
    }));
    await (async() => {      //.........................................................................................................
      /* calls to `emit` are just calls to `new Event()`: */
      AE.on('myevent', function(event) {
        info('^992-48^', event);
        return event.n ** 2;
      });
      help('^992-49^', (await AE.emit('myevent', {
        n: 16
      })));
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      return (await demo_1());
    })();
  }

  // await demo_2()
// await demo_3()
// urge '^992-50^', await Promise.all (
//   # new Promise ( ( resolve, reject ) -> resolve i ) for i in [ 1 .. 10 ]
//   ( ( ( count ) -> await count ) i + 1 ) for i in [ 1 .. 10 ]
//   )

}).call(this);

//# sourceMappingURL=async-events.js.map