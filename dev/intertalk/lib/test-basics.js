(async function() {
  'use strict';
  var GUY, alert, as_object, debug, demo_1, demo_2, demo_3, echo, help, info, inspect, isa_object, log, plain, praise, ps, reverse, rpr, s, test, throws, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('subsidiary'));

  ({rpr, inspect, echo, reverse, log} = GUY.trm);

  test = require('guy-test');

  //-----------------------------------------------------------------------------------------------------------
  s = function(name) {
    return Symbol.for(name);
  };

  ps = function(name) {
    return Symbol(name);
  };

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

  //===========================================================================================================
  isa_object = function(x) {
    return (x != null) && (typeof x === 'object') && ((Object.prototype.toString.call(x)) === '[object Object]');
  };

  as_object = function(x) {
    var R, k, v;
    if (!isa_object(x)) {
      return x;
    }
    R = {};
    for (k in x) {
      v = x[k];
      R[k] = as_object(v);
    }
    return R;
  };

  //===========================================================================================================
  throws = async function(T, matcher, f) {
    await (async() => {
      var error;
      error = null;
      try {
        await f();
      } catch (error1) {
        error = error1;
        warn('^992-15^', reverse(error.message));
        if (T != null) {
          T.eq(error.message, matcher);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    return null;
  };

  //===========================================================================================================
  this.interface = async function(T, done) {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, isa, isa_optional, ref, ref1, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.function(AE.on), true);
    }
    if (T != null) {
      T.eq(isa.function(AE.on_any), false);
    }
    if (T != null) {
      T.eq(isa.asyncfunction(AE.emit), true);
    }
    if (T != null) {
      T.eq((ref = AE.emit('what')) != null ? (ref1 = ref.constructor) != null ? ref1.name : void 0 : void 0, 'Promise');
    }
    if (T != null) {
      T.ok(((await AE.emit('what'))) instanceof AE_Event_results);
    }
    if (T != null) {
      T.eq(isa.function(AE.on('foo', (function(event) {}))), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.event_emitting_1 = async function(T, done) {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, isa, isa_optional, on_mul, on_sum, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    AE.on('sum', on_sum = function(e) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(e.a + e.b);
        }), 100);
      });
    });
    AE.on('mul', on_mul = function(e) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(e.a * e.b);
        }), 100);
      });
    });
    //.........................................................................................................
    /* NOTE call to `as_object()` not strictly necessary as the underlying `equals()` method does work with
     the custom types we're using (`AE_Event_results` and `AE_Event`), but that's a flaw in the algorithm so
     let's try to write it the correct way: */
    if (T != null) {
      T.eq(as_object((await AE.emit('sum', {
        a: 100,
        b: 200
      }))), {
        '$key': 'event-results',
        event: {
          '$key': 'sum',
          a: 100,
          b: 200
        },
        results: [300]
      });
    }
    if (T != null) {
      T.eq(as_object((await AE.emit('mul', {
        a: 100,
        b: 200
      }))), {
        '$key': 'event-results',
        event: {
          '$key': 'mul',
          a: 100,
          b: 200
        },
        results: [20000]
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.type_validation = async function(T, done) {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, isa, isa_optional, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    await throws(T, 'expected 1 or 2 arguments, got 5', (async function() {
      return (await AE.emit('double', 3, 4, 5, 6));
    }));
    await throws(T, 'expected 1 or 2 arguments, got 3', (async function() {
      return (await AE.emit('foo', 3, [4, 5, 6]));
    }));
    await throws(T, 'expected 2 arguments, got 0', (function() {
      return AE.on();
    }));
    await throws(T, 'expected 2 arguments, got 1', (function() {
      return AE.on(4);
    }));
    await throws(T, 'expected a event_key, got a number', (function() {
      return AE.on(4, 5);
    }));
    await throws(T, 'expected a event_key, got a number', (function() {
      return AE.on(4, function() {});
    }));
    await throws(T, 'expected 2 arguments, got 1', (function() {
      return AE.on(s`abc`);
    }));
    await throws(T, 'expected 2 arguments, got 3', (function() {
      return AE.on(s`abc`, (function() {}), 9);
    }));
    await throws(T, 'expected 2 arguments, got 3', (function() {
      return AE.on('abc', {}, 9);
    }));
    await throws(T, 'expected event_listener for object property \'on_abc\', got a undefined', (function() {
      return AE.on('abc', {});
    }));
    await throws(T, 'expected event_listener for object property \'on_abc\', got a undefined', (function() {
      return AE.on(s`abc`, {});
    }));
    await throws(T, 'expected 1 or 2 arguments, got 0', (function() {
      return new Datom();
    }));
    await throws(T, 'expected a event_key, got a number', (function() {
      return new Datom(42);
    }));
    await throws(T, 'expected a event_key, got a object', (function() {
      return new Datom(null);
    }));
    await throws(T, 'expected a event_key, got a undefined', (function() {
      return new Datom(void 0);
    }));
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.event_emitting_3 = function(T, done) {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, f, isa, isa_optional, receiver, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    receiver = {
      on_square: function(event) {
        info('^992-4^', event);
        return event.$value ** 2;
      },
      on_cube: function(event) {
        info('^992-6^', event);
        return event.$value ** 3;
      },
      on_double: function(event) {
        info('^992-5^', event);
        return event.$value * 2;
      },
      on_any: function(event) {
        return info('^992-5^', event);
      },
      on_cube_symbol: function(event) {
        info('^992-6^', event);
        return event.$value ** 3;
      }
    };
    //.........................................................................................................
    AE.on('square', receiver);
    AE.on('double', receiver);
    AE.on('cube', receiver.on_cube);
    AE.on(s`cube`, receiver.on_cube);
    // AE.on_any,        receiver.on_any
    //.........................................................................................................
    // urge '^992-7^', AE
    // urge '^992-8^', AE.key_symbols[ 'square' ]
    // urge '^992-9^', AE.listeners
    // urge '^992-10^', AE.listeners.get AE.key_symbols[ 'square' ]
    f = async function() {
      var e;
      urge('^992-11^', (await AE.emit('square', 11)));
      urge('^992-12^', (await AE.emit('double', 12)));
      urge('^992-13^', (await AE.emit('cube', 13)));
      urge('^992-13^', (await AE.emit(new AE_Event('cube', 14))));
      urge('^992-13^', (await AE.emit(new AE_Event(s`cube`, 14))));
      try {
        /* TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: */
        urge('^992-14^', (await AE.emit('double', 3, 4, 5, 6)));
      } catch (error1) {
        e = error1;
        warn('^992-15^', reverse(e.message));
      }
      try {
        urge('^992-16^', (await AE.emit('foo', 3, [4, 5, 6])));
      } catch (error1) {
        e = error1;
        warn('^992-17^', reverse(e.message));
      }
      return urge('^992-18^', (await AE.emit('foo', [3, 4, 5, 6])));
    };
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  demo_1 = async function() {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, e, isa, isa_optional, receiver, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    receiver = {
      on_square: function(event) {
        info('^992-4^', event);
        return event.$value ** 2;
      },
      on_cube: function(event) {
        info('^992-6^', event);
        return event.$value ** 3;
      },
      on_double: function(event) {
        info('^992-5^', event);
        return event.$value * 2;
      },
      on_any: function(event) {
        return info('^992-5^', event);
      },
      on_cube_symbol: function(event) {
        info('^992-6^', event);
        return event.$value ** 3;
      }
    };
    AE.on('square', receiver);
    AE.on('double', receiver);
    AE.on('cube', receiver.on_cube);
    AE.on(s`cube`, receiver.on_cube);
    AE.on('*', receiver.on_any);
    // urge '^992-7^', AE
    // urge '^992-8^', AE.key_symbols[ 'square' ]
    // urge '^992-9^', AE.listeners
    // urge '^992-10^', AE.listeners.get AE.key_symbols[ 'square' ]
    urge('^992-11^', (await AE.emit('square', 11)));
    urge('^992-12^', (await AE.emit('double', 12)));
    urge('^992-13^', (await AE.emit('cube', 13)));
    urge('^992-13^', (await AE.emit(new AE_Event('cube', 14))));
    urge('^992-13^', (await AE.emit(new AE_Event(s`cube`, 14))));
    try {
      /* TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: */
      urge('^992-14^', (await AE.emit('double', 3, 4, 5, 6)));
    } catch (error1) {
      e = error1;
      warn('^992-15^', reverse(e.message));
    }
    try {
      urge('^992-16^', (await AE.emit('foo', 3, [4, 5, 6])));
    } catch (error1) {
      e = error1;
      warn('^992-17^', reverse(e.message));
    }
    urge('^992-18^', (await AE.emit('foo', [3, 4, 5, 6])));
    return null;
  };

  //===========================================================================================================
  demo_2 = async function() {
    var A, AE, AE_Event, AE_Event_results, Async_events, B, Datom, INTERTALK, e, isa, isa_optional, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    //.........................................................................................................
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    A = class A {};
    B = class B extends Object {};
    urge('^992-19^', A);
    urge('^992-20^', A.freeze);
    urge('^992-21^', new A());
    urge('^992-22^', B);
    urge('^992-23^', new B());
    urge('^992-24^', isa.object(A));
    urge('^992-25^', isa.object(B));
    urge('^992-26^', isa.object(new A()));
    urge('^992-27^', isa.object(new B()));
    try {
      new Datom();
    } catch (error1) {
      e = error1;
      warn('^992-28^', reverse(e.message));
    }
    try {
      new Datom(5);
    } catch (error1) {
      e = error1;
      warn('^992-29^', reverse(e.message));
    }
    try {
      new Datom(null);
    } catch (error1) {
      e = error1;
      warn('^992-30^', reverse(e.message));
    }
    try {
      new Datom({});
    } catch (error1) {
      e = error1;
      warn('^992-31^', reverse(e.message));
    }
    urge('^992-32^', new Datom('foo'));
    urge('^992-33^', new Datom('foo', null));
    urge('^992-34^', new Datom('foo', void 0));
    urge('^992-35^', new Datom('foo', 56));
    urge('^992-36^', new Datom('foo', {
      bar: 56
    }));
    urge('^992-37^', new Datom('foo', {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-38^', new Datom(s`foo`, {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-39^', new Datom({
      bar: 56,
      $key: 'other'
    }));
    urge('^992-40^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: false
    }));
    urge('^992-41^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: true
    }));
    urge('^992-42^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: null
    }));
    urge('^992-43^', new Datom('something', {
      $freeze: false
    }));
    urge('^992-44^', new Datom('something', {
      $freeze: true
    }));
    urge('^992-45^', new Datom('something', {
      $freeze: null
    }));
    (() => {      //.........................................................................................................
      /* must set `{ $freeze: false, }` explicitly else datom will be (superficially) frozen: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      d.p = 7;
      urge('^992-46^', d);
      return null;
    })();
    (() => {      //.........................................................................................................
      /* passing in an existing datom (or event) `d` into `new Datom d` (or `new AE_Event d`) results in a copy
       of `d`: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      e = new Datom(d);
      urge('^992-47^', d, e, d === e);
      return null;
    })();
    //.........................................................................................................
    /* events are just `Datom`s: */
    urge('^992-48^', new AE_Event(s`foo`, {
      bar: 56
    }));
    await (async() => {      //.........................................................................................................
      /* calls to `emit` are just calls to `new AE_Event()`: */
      AE.on('myevent', function(event) {
        info('^992-49^', event);
        return event.n ** 2;
      });
      help('^992-50^', (await AE.emit('myevent', {
        n: 16
      })));
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  demo_3 = function() {
    var AE, AE_Event, AE_Event_results, Async_events, Datom, INTERTALK, isa, isa_optional, validate, validate_optional;
    INTERTALK = require('../../../apps/intertalk');
    ({AE, Async_events, AE_Event, AE_Event_results, Datom, isa, validate, isa_optional, validate_optional} = INTERTALK);
    //.........................................................................................................
    AE.on('abc', {});
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // await demo_1()
      // await demo_2()
      // await demo_3()
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map