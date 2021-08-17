(function() {
  /*

  See
    * [*A future for SQL on the web*](https://lobste.rs/s/1ylnel/future_for_sql_on_web)
    * [*A future for SQL on the web* by James Long (August 12, 2021)](https://jlongster.com/future-sql-web)

  > The biggest problem is when sqlite does a read or write, the API is totally synchronous because it’s based
  > on the C API. Accessing IndexedDB is always async, so how do we get around that?
  >
  > We spawn a worker process and give it a SharedArrayBuffer and then use the
  > [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) API
  > to communicate via the buffer. For example, our backend writes a read request into the shared buffer, and
  > the worker reads it, performs the read async, and then writes the result back.
  >
  > I wrote a small [channel
  > abstraction](https://github.com/jlongster/absurd-sql/blob/master/src/indexeddb/shared-channel.js) to send
  > different types of data across a SharedArrayBuffer.
  >
  > The real magic is the
  > [`Atomics.wait`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait)
  > API. It’s a beautiful thing. When you call it, it completely blocks JS until the condition is met. You use
  > it to wait on some data in the SharedArrayBuffer, and this is what enables us to turn the async read/write
  > into a sync one. The backend calls it to wait on the result from the worker and blocks until it’s
  > done.—[*A future for SQL on the web* by James Long (August 12,
  > 2021)](https://jlongster.com/future-sql-web)

   */
  'use strict';
  var CND, Worker, after, badge, debug, defer, demo_A, demo_B, echo, help, info, isMainThread, rpr, urge, warn, whisper, workerData;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DPAN/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  defer = setImmediate;

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  ({isMainThread, Worker, workerData} = require('worker_threads'));

  demo_A = function() {
    var lock, release;
    release = function(typed_array, index, value) {
      return (require('fs')).readFile(__filename, function(error, data) {
        if (error != null) {
          throw error;
        }
        urge('^898^', `read ${data.length} bytes`);
        urge('^565-1^', typed_array[index]);
        debug('^477-1^', Atomics.store(typed_array, index, value + 1));
        return debug('^477-2^', Atomics.notify(typed_array, index, 2e308));
      });
    };
    lock = function() {
      var index, sab, timeout, typed_array, value;
      index = 0;
      value = 0;
      timeout = 1000;
      sab = new SharedArrayBuffer(1024);
      typed_array = new Int32Array(sab);
      typed_array[index] = value; // + 1
      urge('^565-2^', typed_array[index]);
      release(typed_array, index, value);
      debug('^477-3^', Atomics.wait(typed_array, index, value)); //, timeout
      return urge('^565-3^', typed_array[index]);
    };
    return lock();
  };

  // await lock()
  demo_B = function() {
    var _, i, j, k, l, ref, shared_data, shared_ram, worker, worker_count, workers;
    debug('^447-1^', 'isMainThread', isMainThread);
    worker_count = 3;
    if (isMainThread) {
      // main thread, create shared memory to share between threads
      debug('^447^', 'isMainThread');
      shared_ram = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
      process.on('exit', () => {
        var result;
        // print final counter
        result = new Int32Array(shared_ram);
        urge('^778^', result);
        urge('^778^', result[0]);
        return null;
      });
      workers = [];
      for (_ = j = 1, ref = worker_count; (1 <= ref ? j <= ref : j >= ref); _ = 1 <= ref ? ++j : --j) {
        worker = new Worker(__filename, {
          workerData: shared_ram
        });
        debug((function() {
          var results;
          results = [];
          for (k in worker) {
            results.push(k);
          }
          return results;
        })());
      }
    } else {
      shared_data = new Int32Array(workerData);
      for (i = l = 0; l < 3; i = ++l) {
        // debug '^445^', shared_data
        debug('^445^', shared_data[0]++);
      }
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_A();
    })();
  }

  // await demo_B()

}).call(this);

//# sourceMappingURL=async-to-sync-with-atomics-wait.js.map