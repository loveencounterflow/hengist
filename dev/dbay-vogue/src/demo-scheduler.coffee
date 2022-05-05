
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-VOGUE/DEMO-SCHEDULER'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
types                     = new ( require 'intertype' ).Intertype()
GUY                       = require '../../../apps/guy'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_scheduler = ->
  { AUDIOPLAYER   } = require '../../snippets/lib/demo-node-beep'
  { Vogue 
    Vogue_db 
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue       = new Vogue()
  paths       =
    a: '/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg'
    b: '/usr/share/mint-artwork/sounds/notification.oga'
    c: '/usr/share/mint-artwork/sounds/logout.ogg'
  get_metronome_callee  = -> ( path ) => process.stdout.write '.'
  get_callee  = ( sigil, path ) =>
    return callee  = ->
      process.stdout.write sigil
      AUDIOPLAYER.play path
      await vogue.scheduler.sleep 0.2
  vogue.scheduler.add_interval { task: get_metronome_callee(), repeat: "0.1 seconds", }
  vogue.scheduler.add_interval { task: ( get_callee '+', paths.a ), repeat: "1.2 seconds", jitter: "11%" }
  vogue.scheduler.add_interval { task: ( get_callee 'X', paths.b ), repeat: "1.5 seconds", jitter: "12%" }
  vogue.scheduler.add_interval { task: ( get_callee '@', paths.c ), repeat: "2.1 seconds", jitter: "13%" }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_scheduler_with_timeout = ->
  { AUDIOPLAYER   } = require '../../snippets/lib/demo-node-beep'
  { Vogue
    Vogue_db
    Vogue_scraper_ABC } = require '../../../apps/dbay-vogue'
  vogue       = new Vogue()
  paths       =
    a: '/usr/share/sounds/LinuxMint/stereo/button-pressed.ogg'
    b: '/usr/share/mint-artwork/sounds/notification.oga'
    c: '/usr/share/mint-artwork/sounds/logout.ogg'
  get_metronome_callee  = -> ( path ) => process.stdout.write '.'
  callee = ( sigil, path ) ->
    process.stdout.write sigil
    AUDIOPLAYER.play path
    # await vogue.scheduler.sleep 1
    vogue.scheduler.after 0.2, => callee sigil, path
    return null
  promise_a = callee '+', paths.b
  attender  = => new Promise ( resolve, reject ) =>
    vogue.scheduler.after 1, => resolve "timeout!"
  debug '^6785-1^', vogue.types.type_of attender
  debug '^6785-1^', vogue.types.type_of attender()
  debug '^6785-2^', promise_a
  debug '^6785-2^', vogue.types.type_of promise_a
  urge '^6785-3^', "racing..."
  ( Promise.race [ promise_a, attender(), ] ).then ( x ) ->
    help '^6785-4^', rpr x
    urge '^6785-5^', "finished"
  # vogue.scheduler.add_interval { callee: get_metronome_callee(), repeat: "0.1 seconds", }
  # vogue.scheduler.add_interval { callee: ( get_callee '+', paths.a ), repeat: "1.2 seconds", }
  # vogue.scheduler.add_interval { callee: ( get_callee 'X', paths.b ), repeat: "1.5 seconds", }
  # vogue.scheduler.add_interval { callee: ( get_callee '@', paths.c ), repeat: "2.1 seconds", }
  return null

#-----------------------------------------------------------------------------------------------------------
create_querable_promise = ( promise ) ->
    ### thx to https://ourcodeworld.com/articles/read/317/how-to-check-if-a-javascript-promise-has-been-fulfilled-rejected-or-resolved,
    https://stackoverflow.com/a/21489870/7568091 ###
    ```
    // Don't modify any promise that has been already modified.
    if (promise.fulfilled) return promise;

    // Set initial state
    var pending = true;
    var rejected = false;
    var fulfilled = false;

    // Observe the promise, saving the fulfillment in a closure scope.
    var result = promise.then(
        function(v) {
            fulfilled = true;
            pending = false;
            return v;
        },
        function(e) {
            rejected = true;
            pending = false;
            throw e;
        }
    );

    ```
    GUY.props.hide result, 'fulfilled', => fulfilled
    GUY.props.hide result, 'pending',   => pending
    GUY.props.hide result, 'rejected',  => rejected
    GUY.props.hide result, 'cancel',    ( P... ) => promise.reject P...
    return result

#-----------------------------------------------------------------------------------------------------------
demo_scheduler_with_timeout_2 = -> # new Promise( resolve, reject ) =>
  { Vogue_scheduler } = require '../../../apps/dbay-vogue'
  { after
    every
    sleep } = Vogue_scheduler
  #.........................................................................................................
  runner = ->
    process.stdout.write '.'
    return setTimeout runner, 100
  #.........................................................................................................
  promise1 = create_querable_promise new Promise ( resolve, reject ) =>
    after 0.2, =>
      debug '^7787-1^', promise1
      resolve 'one'
    return null
  #.........................................................................................................
  promise2 = create_querable_promise new Promise ( resolve, reject ) =>
    after 0.1, =>
      resolve 'two'
    return null
  #.........................................................................................................
  result = await ( Promise.race [promise1, promise2] ).then ( value ) =>
    debug '^7787-2^', rpr promise1
    debug '^7787-3^', promise1.fulfilled(), promise1.pending(), promise1.rejected()
    debug '^7787-4^', rpr promise2
    debug '^7787-5^', promise2.fulfilled(), promise2.pending(), promise2.rejected()
    # after 0.1, => debug '^7787-6^', promise1.fulfilled, promise1.pending, promise1.rejected
    console.log(value);
    await promise1.reject "timeout" unless promise1.fulfilled
    debug '^7787-7^', rpr promise1
    debug '^7787-8^', promise1.fulfilled(), promise1.pending(), promise1.rejected()
    # resolve( 42 );
    # Both resolve, but promise2 is faster
    return value
  urge '^7787-9^', rpr result
  debug '^7787-10^', rpr promise1
  debug '^7787-11^', promise1.fulfilled(), promise1.pending(), promise1.rejected()

############################################################################################################
if module is require.main then do =>
  await demo_scheduler()
  # await demo_scheduler_with_timeout()
  # await demo_scheduler_with_timeout_2()

