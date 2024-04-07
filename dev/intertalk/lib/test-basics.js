(async function() {
  'use strict';
  var GUY, alert, as_object, debug, demo_1, demo_2, demo_3, echo, help, info, inspect, isa_object, log, plain, praise, ps, reverse, rpr, s, test, throws, try_and_show, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertalk'));

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
        warn('^992-1^', reverse(error.message));
        if (T != null) {
          T.eq(error.message, matcher);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    return null;
  };

  //===========================================================================================================
  try_and_show = function(T, f) {
    var e;
    e = null;
    try {
      urge('^992-2^', f());
    } catch (error1) {
      e = error1;
      help('^992-3^', reverse(`try_and_show: ${rpr(e.message)}`));
    }
    if (e == null) {
      warn('^992-3^', reverse("expected an error but none was thrown"));
      T.fail("^992-3^ expected an error but none was thrown");
    }
    return null;
  };

  //===========================================================================================================
  this.interface = async function(T, done) {
    var INTERTALK, Intertalk, itk, ref, ref1;
    INTERTALK = require('../../../apps/intertalk');
    ({Intertalk} = INTERTALK);
    itk = new Intertalk();
    //.........................................................................................................
    if (T != null) {
      T.eq(INTERTALK._extras.isa.function(itk.on), true);
    }
    if (T != null) {
      T.eq(INTERTALK._extras.isa.function(itk.on_any), true);
    }
    if (T != null) {
      T.eq(INTERTALK._extras.isa.asyncfunction(itk.emit), true);
    }
    if (T != null) {
      T.eq((ref = itk.emit('what')) != null ? (ref1 = ref.constructor) != null ? ref1.name : void 0 : void 0, 'Promise');
    }
    if (T != null) {
      T.ok(((await itk.emit('what'))) instanceof INTERTALK.Results);
    }
    if (T != null) {
      T.eq(INTERTALK._extras.isa.null(itk.on('foo', (function(note) {}))), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.WeakMap_replacement = function(T, done) {
    var WeakMapShim, error, original_WeakMap, purge_require_cache_entry_for_intertalk;
    WeakMapShim = require('weak-map');
    // urge '^343^', ( k for k in Object.keys require.cache when /intertalk/.test k ) #[ 'intertalk' ]
    purge_require_cache_entry_for_intertalk = function() {
      var i, k, len, ref;
      ref = Object.keys(require.cache);
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        if (/\/intertalk\/lib\/main.js/.test(k)) {
          delete require.cache[k];
        }
      }
      return null;
    };
    try {
      //.........................................................................................................
      original_WeakMap = globalThis.WeakMap;
      warn('^423-1^', '(OK)', reverse("temporarily removing WeakMap"));
      delete globalThis.WeakMap;
      try {
        WeakMap;
      } catch (error1) {
        error = error1;
        help('^423-2^', '(OK)', reverse(error.message));
      }
      (() => {        //.......................................................................................................
        var key, wm;
        /* make sure our WeakMap shim works as expected */
        debug('^423-3^', wm = new WeakMapShim());
        key = s`key`;
        try_and_show(T, function() {
          return wm.set('abc', 'data-abc');
        });
        try_and_show(T, function() {
          return wm.set(key, 'data-abc');
        });
        if (T != null) {
          T.throws('Invalid value used as weak map key', function() {
            return wm.set('abc', 'data-abc');
          });
        }
        if (T != null) {
          T.throws('Invalid value used as weak map key', function() {
            return wm.set(key, 'data-abc');
          });
        }
        return null;
      })();
      (() => {        //.......................................................................................................
        var Intertalk, itk;
        /* make sure INTERTALK_LIB works in absence of WeakMap */
        purge_require_cache_entry_for_intertalk();
        ({Intertalk} = require('../../../apps/intertalk'));
        itk = new Intertalk();
        debug('^423-4^', itk.listeners);
        if (T != null) {
          T.ok(itk.listeners instanceof Map);
        }
        return null;
      })();
    } finally {
      /* ensure reset works so other tests will not be affected */
      //.......................................................................................................
      help('^423-5^', '(OK)', reverse("resetting WeakMap"));
      globalThis.WeakMap = original_WeakMap;
      help('^423-6^', '(OK)', reverse(WeakMap));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.event_emitting_1 = async function(T, done) {
    var Intertalk, itk, on_mul, on_sum;
    ({Intertalk} = require('../../../apps/intertalk'));
    itk = new Intertalk();
    //.........................................................................................................
    itk.on('sum', on_sum = function(e) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(e.a + e.b);
        }), 100);
      });
    });
    itk.on('mul', on_mul = function(e) {
      return new Promise(function(resolve) {
        return setTimeout((function() {
          return resolve(e.a * e.b);
        }), 100);
      });
    });
    //.........................................................................................................
    /* NOTE call to `as_object()` not strictly necessary as the underlying `equals()` method does work with
     the custom types we're using (`Results` and `Note`), but that's a flaw in the algorithm so
     let's try to write it the correct way: */
    if (T != null) {
      T.eq(as_object((await itk.emit('sum', {
        a: 100,
        b: 200
      }))), {
        '$key': '$results',
        note: {
          '$key': 'sum',
          a: 100,
          b: 200
        },
        results: [300]
      });
    }
    if (T != null) {
      T.eq(as_object((await itk.emit('mul', {
        a: 100,
        b: 200
      }))), {
        '$key': '$results',
        note: {
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
    var INTERTALK, Intertalk, itk;
    INTERTALK = require('../../../apps/intertalk');
    ({Intertalk} = INTERTALK);
    itk = new Intertalk();
    //.........................................................................................................
    await throws(T, 'expected 1 or 2 arguments, got 5', (async function() {
      return (await itk.emit('double', 3, 4, 5, 6));
    }));
    await throws(T, 'expected 1 or 2 arguments, got 3', (async function() {
      return (await itk.emit('foo', 3, [4, 5, 6]));
    }));
    await throws(T, 'expected 2 arguments, got 0', (function() {
      return itk.on();
    }));
    await throws(T, 'expected 2 arguments, got 1', (function() {
      return itk.on(4);
    }));
    await throws(T, 'expected a IT_note_$key, got a number', (function() {
      return itk.on(4, 5);
    }));
    await throws(T, 'expected a IT_note_$key, got a number', (function() {
      return itk.on(4, function() {});
    }));
    await throws(T, 'expected 2 arguments, got 1', (function() {
      return itk.on(s`abc`);
    }));
    await throws(T, 'expected 2 arguments, got 3', (function() {
      return itk.on(s`abc`, (function() {}), 9);
    }));
    await throws(T, 'expected 2 arguments, got 3', (function() {
      return itk.on('abc', {}, 9);
    }));
    await throws(T, 'expected a IT_listener, got a object', (function() {
      return itk.on('abc', {});
    }));
    await throws(T, 'expected a IT_listener, got a object', (function() {
      return itk.on(s`abc`, {});
    }));
    await throws(T, 'expected 1 or 2 arguments, got 0', (function() {
      return new INTERTALK._extras.Datom();
    }));
    await throws(T, 'expected a IT_note_$key, got a number', (function() {
      return new INTERTALK._extras.Datom(42);
    }));
    await throws(T, 'expected a IT_note_$key, got a object', (function() {
      return new INTERTALK._extras.Datom(null);
    }));
    await throws(T, 'expected a IT_note_$key, got a undefined', (function() {
      return new INTERTALK._extras.Datom(void 0);
    }));
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.on_any = async function(T, done) {
    var Intertalk;
    ({Intertalk} = require('../../../apps/intertalk'));
    await (async function() {      //.........................................................................................................
      var counter, itk;
      itk = new Intertalk();
      counter = 0;
      itk.on_any(function(note) {
        return counter++;
      });
      await itk.emit('foo');
      await itk.emit('bar');
      await itk.emit('baz');
      if (T != null) {
        T.eq(counter, 3);
      }
      return null;
    })();
    await (async function() {      //.........................................................................................................
      var itk, matcher, results;
      itk = new Intertalk();
      matcher = [['any', 1], ['any', 2], ['any', 3]];
      results = [];
      itk.on_any(function(note) {
        return 'any';
      });
      itk.on('d1', function(note) {
        return 1;
      });
      itk.on('d2', function(note) {
        return 2;
      });
      itk.on('d3', function(note) {
        return 3;
      });
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      if (T != null) {
        T.eq(results, matcher);
      }
      return null;
    })();
    await (async function() {      //.........................................................................................................
      var itk, matcher, results;
      itk = new Intertalk();
      matcher = [['any', 1], ['any', 2], ['any', 3]];
      results = [];
      itk.on('d1', function(note) {
        return 1;
      });
      itk.on('d2', function(note) {
        return 2;
      });
      itk.on('d3', function(note) {
        return 3;
      });
      itk.on_any(function(note) {
        return 'any';
      });
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      if (T != null) {
        T.eq(results, matcher);
      }
      return null;
    })();
    await (async function() {      //.........................................................................................................
      var itk, matcher, results;
      itk = new Intertalk();
      matcher = [['any1', 'any2', 'any3', 1], ['any1', 'any2', 'any3', 2], ['any1', 'any2', 'any3', 3]];
      results = [];
      itk.on('d1', function(note) {
        return 1;
      });
      itk.on('d2', function(note) {
        return 2;
      });
      itk.on('d3', function(note) {
        return 3;
      });
      itk.on_any(function(note) {
        return 'any1';
      });
      itk.on_any(function(note) {
        return 'any2';
      });
      itk.on_any(function(note) {
        return 'any3';
      });
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      if (T != null) {
        T.eq(results, matcher);
      }
      return null;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  this.unsubscribing = async function(T, done) {
    var Intertalk, a1, d1, d2, d3, itk;
    ({Intertalk} = require('../../../apps/intertalk'));
    //.........................................................................................................
    itk = new Intertalk();
    itk.on_any(a1 = function(note) {
      return 'any';
    });
    itk.on('d1', d1 = function(note) {
      return 1;
    });
    itk.on('d2', d2 = function(note) {
      return 2;
    });
    itk.on('d3', d3 = function(note) {
      return 3;
    });
    await (async() => {      //.........................................................................................................
      var results;
      results = [];
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      return T != null ? T.eq(results, [['any', 1], ['any', 2], ['any', 3]]) : void 0;
    })();
    //.........................................................................................................
    if (T != null) {
      T.eq(itk.off(d2), 1);
    }
    if (T != null) {
      T.eq(itk.off(d2), 0);
    }
    await (async() => {      //.........................................................................................................
      var results;
      results = [];
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      return T != null ? T.eq(results, [['any', 1], ['any'], ['any', 3]]) : void 0;
    })();
    //.........................................................................................................
    if (T != null) {
      T.eq(itk.off(a1), 1);
    }
    if (T != null) {
      T.eq(itk.off(a1), 0);
    }
    await (async() => {      //.........................................................................................................
      var results;
      results = [];
      results.push(((await itk.emit('d1'))).results);
      results.push(((await itk.emit('d2'))).results);
      results.push(((await itk.emit('d3'))).results);
      return T != null ? T.eq(results, [[1], [], [3]]) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================
  demo_1 = async function() {
    var Intertalk, e, itk, receiver;
    ({Intertalk} = require('../../../apps/intertalk'));
    itk = new Intertalk();
    //.........................................................................................................
    receiver = {
      on_square: function(note) {
        info('^992-23^', note);
        return note.$value ** 2;
      },
      on_cube: function(note) {
        info('^992-24^', note);
        return note.$value ** 3;
      },
      on_double: function(note) {
        info('^992-25^', note);
        return note.$value * 2;
      },
      on_any: function(note) {
        return info('^992-26^', note);
      },
      on_cube_symbol: function(note) {
        info('^992-27^', note);
        return note.$value ** 3;
      }
    };
    itk.on('square', receiver);
    itk.on('double', receiver);
    itk.on('cube', receiver.on_cube);
    itk.on(s`cube`, receiver.on_cube);
    itk.on('*', receiver.on_any);
    // urge '^992-28^', itk
    // urge '^992-29^', itk.key_symbols[ 'square' ]
    // urge '^992-30^', itk.listeners
    // urge '^992-31^', itk.listeners.get itk.key_symbols[ 'square' ]
    urge('^992-32^', (await itk.emit('square', 11)));
    urge('^992-33^', (await itk.emit('double', 12)));
    urge('^992-34^', (await itk.emit('cube', 13)));
    urge('^992-35^', (await itk.emit(new Note('cube', 14))));
    urge('^992-36^', (await itk.emit(new Note(s`cube`, 14))));
    try {
      /* TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: */
      urge('^992-37^', (await itk.emit('double', 3, 4, 5, 6)));
    } catch (error1) {
      e = error1;
      warn('^992-38^', reverse(e.message));
    }
    try {
      urge('^992-39^', (await itk.emit('foo', 3, [4, 5, 6])));
    } catch (error1) {
      e = error1;
      warn('^992-40^', reverse(e.message));
    }
    urge('^992-41^', (await itk.emit('foo', [3, 4, 5, 6])));
    return null;
  };

  //===========================================================================================================
  demo_2 = async function() {
    var A, B, Intertalk, e, itk;
    ({Intertalk} = require('../../../apps/intertalk'));
    itk = new Intertalk();
    //.........................................................................................................
    A = class A {};
    B = class B extends Object {};
    urge('^992-42^', A);
    urge('^992-43^', A.freeze);
    urge('^992-44^', new A());
    urge('^992-45^', B);
    urge('^992-46^', new B());
    urge('^992-47^', isa.object(A));
    urge('^992-48^', isa.object(B));
    urge('^992-49^', isa.object(new A()));
    urge('^992-50^', isa.object(new B()));
    try {
      new Datom();
    } catch (error1) {
      e = error1;
      warn('^992-51^', reverse(e.message));
    }
    try {
      new Datom(5);
    } catch (error1) {
      e = error1;
      warn('^992-52^', reverse(e.message));
    }
    try {
      new Datom(null);
    } catch (error1) {
      e = error1;
      warn('^992-53^', reverse(e.message));
    }
    try {
      new Datom({});
    } catch (error1) {
      e = error1;
      warn('^992-54^', reverse(e.message));
    }
    urge('^992-55^', new Datom('foo'));
    urge('^992-56^', new Datom('foo', null));
    urge('^992-57^', new Datom('foo', void 0));
    urge('^992-58^', new Datom('foo', 56));
    urge('^992-59^', new Datom('foo', {
      bar: 56
    }));
    urge('^992-60^', new Datom('foo', {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-61^', new Datom(s`foo`, {
      bar: 56,
      $key: 'other'
    }));
    urge('^992-62^', new Datom({
      bar: 56,
      $key: 'other'
    }));
    urge('^992-63^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: false
    }));
    urge('^992-64^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: true
    }));
    urge('^992-65^', new Datom({
      bar: 56,
      $key: 'other',
      $freeze: null
    }));
    urge('^992-66^', new Datom('something', {
      $freeze: false
    }));
    urge('^992-67^', new Datom('something', {
      $freeze: true
    }));
    urge('^992-68^', new Datom('something', {
      $freeze: null
    }));
    (() => {      //.........................................................................................................
      /* must set `{ $freeze: false, }` explicitly else datom will be (superficially) frozen: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      d.p = 7;
      urge('^992-69^', d);
      return null;
    })();
    (() => {      //.........................................................................................................
      /* passing in an existing datom (or note) `d` into `new Datom d` (or `new Note d`) results in a copy
       of `d`: */
      var d;
      d = new Datom('o', {
        $freeze: false
      });
      e = new Datom(d);
      urge('^992-70^', d, e, d === e);
      return null;
    })();
    //.........................................................................................................
    /* events are just `Datom`s: */
    urge('^992-71^', new Note(s`foo`, {
      bar: 56
    }));
    await (async() => {      //.........................................................................................................
      /* calls to `emit` are just calls to `new Note()`: */
      itk.on('myevent', function(note) {
        info('^992-72^', note);
        return note.n ** 2;
      });
      help('^992-73^', (await itk.emit('myevent', {
        n: 16
      })));
      return null;
    })();
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  demo_3 = function() {
    var Intertalk, itk;
    ({Intertalk} = require('../../../apps/intertalk'));
    itk = new Intertalk();
    //.........................................................................................................
    itk.on('abc', {});
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      // await demo_1()
      // await demo_2()
      // await demo_3()
      // await test @WeakMap_replacement
      // await test @unsubscribing
      return (await test(this));
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map