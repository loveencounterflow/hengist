(async function() {
  'use strict';
  var AE, Async_events, GUY, alert, debug, demo, echo, help, info, inspect, isa, log, plain, praise, resolved_promise, rpr, urge, validate, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('subsidiary'));

  ({rpr, inspect, echo, log} = GUY.trm);

  // test                      = require 'guy-test'
  resolved_promise = Promise.resolve();

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
    }
  };

  //===========================================================================================================
  validate = (() => {
    var R, test, type;
    R = {};
    for (type in isa) {
      test = isa[type];
      R[type] = ((type, test) => {
        return (x) => {
          if (test.call(isa, x)) {
            return x;
          }
          /* TAINT `typeof` will give some strange results */
          throw new Error(`expected a ${type}, got a ${typeof x}`);
        };
      })(type, test);
    }
    return R;
  })();

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
      /* TAINT this anonymous function subverts the purpose of using s set */
      var key_symbol, listener, listener_name, registry, unsubscribe;
      validate.event_key(key);
      validate.something(receiver);
      if ((key_symbol = this.symbols[key]) == null) {
        //.......................................................................................................
        this.symbols[key] = (key_symbol = Symbol(key));
      }
      debug('^992-1^', {key_symbol});
      if ((registry = this.listeners.get(key_symbol)) == null) {
        this.listeners.set(key_symbol, (registry = new Set()));
      }
      //.......................................................................................................
      if (isa.event_listener(receiver)) {
        listener = receiver;
      } else {
        listener_name = `on_${key}`;
        listener = receiver[listener_name];
        validate.event_listener(listener);
        listener = (function(original_listener) {
          return async function(...P) {
            return (await original_listener.call(receiver, ...P));
          };
        })(listener);
      }
      registry.add(listener);
      //.......................................................................................................
      unsubscribe = function() {};
      return unsubscribe;
    }

    //---------------------------------------------------------------------------------------------------------
    async emit(key, ...data) {
      var listener, listeners, ref;
      listeners = (ref = AE.listeners.get(AE.symbols['blah'])) != null ? ref : new Set();
      debug('^992-2^', listeners);
      await resolved_promise/* as per https://github.com/sindresorhus/emittery/blob/main/index.js#L363 */
      return (await Promise.all((function() {
        var results;
        results = [];
        for (listener of listeners) {
          results.push((async function() {
            return (await listener(key, ...data));
          })());
        }
        return results;
      })()));
    }

  };

  // #---------------------------------------------------------------------------------------------------------
  // matches: ( matcher, candidate ) ->

  //===========================================================================================================
  AE = new Async_events();

  //===========================================================================================================
  demo = async function() {
    var receiver;
    receiver = {
      on_blah: function(key, ...data) {
        info('^992-3^', key, data);
        return {key, data};
      },
      on_foo: function(key, ...data) {
        info('^992-4^', key, data);
        return {key, data};
      }
    };
    AE.on('blah', receiver);
    AE.on('foo', receiver);
    debug('^992-5^', AE);
    debug('^992-6^', AE.symbols['blah']);
    debug('^992-7^', AE.listeners);
    debug('^992-8^', AE.listeners.get(AE.symbols['blah']));
    debug('^992-9^', (await AE.emit('blah')));
    debug('^992-9^', (await AE.emit('foo', 3, 4, 5, 6)));
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      var i;
      await demo();
      return urge('^992-10^', (await Promise.all((function() {
        var j, results;
        results = [];
        for (i = j = 1; j <= 10; i = ++j) {
          // new Promise ( ( resolve, reject ) -> resolve i ) for i in [ 1 .. 10 ]
          results.push((async function(count) {
            return (await count);
          })(i + 1));
        }
        return results;
      })())));
    })();
  }

}).call(this);

//# sourceMappingURL=async-events.js.map