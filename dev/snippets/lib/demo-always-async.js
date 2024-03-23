(async function() {
  'use strict';
  var GUY, alert, debug, defer, echo, f1, f2, f3, f4, help, info, inspect, log, plain, praise, resolvedPromise, rpr, urge, warn, whisper;

  //===========================================================================================================
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('intertalk'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //-----------------------------------------------------------------------------------------------------------
  /*

  * thx to https://github.com/sindresorhus/emittery/blob/main/index.js#L363 ()
  * see https://stackoverflow.com/questions/45079887/await-equivalent-of-promise-resolve-then

   */
  defer = setImmediate;

  resolvedPromise = Promise.resolve();

  //-----------------------------------------------------------------------------------------------------------
  f1 = async function() {
    help('^321-1^');
    await resolvedPromise;
    help('^321-2^');
    await Promise.all([]);
    help('^321-3^');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  f2 = async function() {
    help('^321-4^');
    // await resolvedPromise
    help('^321-5^');
    await Promise.all([]);
    help('^321-6^');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  f3 = async function() {
    help('^321-7^');
    await resolvedPromise;
    help('^321-8^');
    await Promise.all([
      (async function() {
        return (await defer(function() {
          return info('^321-9');
        }));
      })(),
      (async function() {
        return (await defer(function() {
          return info('^321-10');
        }));
      })(),
      (async function() {
        return (await defer(function() {
          return info('^321-11');
        }));
      })()
    ]);
    help('^321-12^');
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  f4 = async function() {
    help('^321-13^');
    // await resolvedPromise
    help('^321-14^');
    await Promise.all([
      (async function() {
        return (await defer(function() {
          return info('^321-15');
        }));
      })(),
      (async function() {
        return (await defer(function() {
          return info('^321-16');
        }));
      })(),
      (async function() {
        return (await defer(function() {
          return info('^321-17');
        }));
      })()
    ]);
    help('^321-18^');
    return null;
  };

  //===========================================================================================================
  if (module === require.main) {
    await (async() => {
      defer(function() {
        return warn('^321-20^');
      });
      echo('2 -----------------------');
      await f2();
      echo('3 -----------------------');
      await f3();
      echo('2 -----------------------');
      await f2();
      echo();
      defer(function() {
        return warn('^321-19^');
      });
      echo('1 -----------------------');
      await f1();
      echo('3 -----------------------');
      await f3();
      echo('1 -----------------------');
      return (await f1());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-always-async.js.map