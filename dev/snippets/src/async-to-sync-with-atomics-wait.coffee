

###

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




###






'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DPAN/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
defer                     = setImmediate
after                     = ( dts, f ) -> setTimeout  f, dts * 1000
{ isMainThread
  Worker
  workerData            } = require 'worker_threads'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()


#-----------------------------------------------------------------------------------------------------------
demo_A = ->
  debug '^3486^', CND.reverse isMainThread, workerData
  shared_data_idx     = 0
  shared_data_value   = 54321
  shared_data_signal  = 123456
  shared_data_proceed = 64
  #.........................................................................................................
  release = ->
    warn '^879-1^', "release"
    shared_data = new Int32Array workerData
    warn '^879-2^', "waiting a bit in worker thread..."
    Atomics.wait shared_data, shared_data_idx, shared_data_value
    after 1, ->
      warn '^879-3^', Atomics.store  shared_data, shared_data_idx, shared_data_signal
      warn '^879-4^', Atomics.notify shared_data, shared_data_idx, 1
    return null
  #.........................................................................................................
  lock = ( shared_ram ) ->
    info '^879-5^', "lock"
    shared_data = new Int32Array shared_ram
    timeout     = 1000
    shared_data[ shared_data_idx ] = shared_data_value
    info '^879-6^', shared_data[ shared_data_idx ]
    whisper '^879-7^', '-------------------------------------------------------'
    #.......................................................................................................
    ( require 'fs' ).readFile __filename, ( error, data ) ->
      info '^879-x^', "read file"
      throw error if error?
      info '^879-x^', "read #{data.length} bytes"
      Atomics.store shared_data, shared_data_idx, shared_data_proceed
    #.......................................................................................................
    info '^879-8^', CND.reverse Atomics.wait shared_data, shared_data_idx, shared_data_value #, timeout
    info '^879-9^', "received shared_data_signal:", shared_data[ shared_data_idx ]
    return null
  #.........................................................................................................
  if isMainThread
    info '^879-10^', "main thread"
    shared_ram  = new SharedArrayBuffer Int32Array.BYTES_PER_ELEMENT
    worker      = new Worker __filename, { workerData: shared_ram }
    lock shared_ram
  else
    warn '^879-11^', "worker thread"
    release()
  return null


#-----------------------------------------------------------------------------------------------------------
demo_B = ->
  ### thx to https://stackoverflow.com/a/53923671/256361 ###
  debug '^447-1^', 'isMainThread', isMainThread
  worker_count = 3
  if isMainThread
    # main thread, create shared memory to share between threads
    debug '^447^', 'isMainThread'
    shared_ram = new SharedArrayBuffer Int32Array.BYTES_PER_ELEMENT
    process.on 'exit', () =>
      # print final counter
      result = new Int32Array shared_ram
      urge '^778^', result
      urge '^778^', result[0] # expected 5 * 500,000 = 2,500,000
      return null
    workers = []
    for _ in [ 1 .. worker_count ]
      worker = new Worker __filename, { workerData: shared_ram }
      debug ( k for k of worker )
  else
    shared_data = new Int32Array workerData
    for i in [ 0 ... 3 ]
      # debug '^445^', shared_data
      debug '^445^', shared_data[ 0 ]++
  return null


#===========================================================================================================
# DEASYNC
#-----------------------------------------------------------------------------------------------------------
demo_deasync_1 = ->
  deasync = require 'deasync'
  cp      = require 'child_process'
  exec    = deasync cp.exec
  # output result of ls -la
  try
      info '^434-1^', exec 'ls -la'
  catch error
      info '^434-2^', error
  # done is printed last, as supposed, with cp.exec wrapped in deasync first without.
  info '^434-3^', 'done'
  return null

#-----------------------------------------------------------------------------------------------------------
demo_deasync_2 = ->
  after                 = ( dts, f ) -> setTimeout  f, dts * 1000
  deasync_callbackable  = require 'deasync'
  #.........................................................................................................
  deasync_awaitable = ( fn_with_promise ) ->
    return deasync_callbackable ( handler ) =>
      result = await fn_with_promise()
      handler null, result
      return null
  #.........................................................................................................
  frob_async = -> new Promise ( resolve ) =>
    after 1, -> warn '^455-1^', "frob_async done"; resolve()
  #.........................................................................................................
  frob_sync = deasync_awaitable frob_async
  frob_sync()
  info '^455-3^', "call to frob_sync done"
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_A()
  # await demo_B()
  # await demo_deasync_1()
  demo_deasync_2()
  urge '^803-1^', "demo_deasync_2 done"


