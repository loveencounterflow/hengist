(function() {
  'use strict';
  var CND, Exp1, after, alert, badge, debug, defer, help, info, isa, log, rpr, sleep, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'CUPOFJOE';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  //...........................................................................................................
  this.types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = this.types.export());

  defer = setImmediate;

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  sleep = function(dts) {
    return new Promise(function(done) {
      return after(dts, done);
    });
  };

  /*

  * You have a function `f()` that may work snychronously or asynchronously, depending on runtime
    factors.
  * As such, making it the consumer's responsibility to choose bewteen `f_sync ...` or `await f_async ...` is
    not the problem;
  * but the implementations for `f_sync()` and `f_async()` would be almost identical save for one or a few
    conditional branches

   */
  //===========================================================================================================
  Exp1 = class Exp1 {
    //---------------------------------------------------------------------------------------------------------
    expand_sync(list) {
      var element, i, idx, len, type;
      for (idx = i = 0, len = list.length; i < len; idx = ++i) {
        element = list[idx];
        debug('expand_sync', {idx, element});
        switch (type = type_of(element)) {
          case 'function':
            list[idx] = element();
            break;
          case 'asyncfunction':
            throw new Error("unable to resolve asny function snychronously");
        }
      }
      return list;
    }

    //---------------------------------------------------------------------------------------------------------
    async expand_async(list) {
      var element, i, idx, len, type, value;
      for (idx = i = 0, len = list.length; i < len; idx = ++i) {
        element = list[idx];
        debug('expand_async', {idx, element});
        switch (type = type_of(element)) {
          case 'function':
            list[idx] = value = element();
            break;
          case 'asyncfunction':
            list[idx] = value = (await element());
        }
        // if type_of value is 'promise' then list[ idx ] = await value
        if (isa.thenable(value)) {
          list[idx] = (await value);
        }
      }
      return list;
    }

    //---------------------------------------------------------------------------------------------------------
    async demo() {
      var f;
      info(this.expand_sync([
        4,
        (function() {
          return 42;
        }),
        8
      ]));
      f = function() {
        return new Promise(async function(done) {
          await sleep(0);
          return done('async!');
        });
      };
      debug(f());
      debug((await f()));
      info((await this.expand_async([
        (function() {
          return 'sync';
        }),
        f,
        8
      ])));
      return null;
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var exp1;
      exp1 = new Exp1();
      return (await exp1.demo());
    })();
  }

}).call(this);

//# sourceMappingURL=functions-with-sync-and-async-variants.js.map