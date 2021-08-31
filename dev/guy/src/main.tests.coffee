
############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
H                         = require './helpers'


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "demo" ] = ( T, done ) ->
  { createRequire, }  = require 'module'
  guy_realpath        = require.resolve H.guy_path
  guy_realpath        = PATH.join guy_realpath, 'whatever' ### H.guy_path points to pkg folder, must be one element deeper ###
  debug '^7665^', { guy_realpath, }
  rq                  = createRequire guy_realpath
  guy                 = require H.guy_path
  urge '^83443^', H.guy_path
  help '^83443^', rq.resolve 'cnd'
  help '^83443^', rq.resolve 'intertype'
  help '^83443^', rq.resolve 'deasync'
  # help '^83443^', rq.resolve 'frob'
  # help '^83443^', rq.resolve 'steampipes'
  debug '340^', guy
  debug '340^', guy.nowait
  debug '340^', guy
  debug '340^', guy.nowait
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "nowait" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy = require H.guy_path
  result = []
  result.push 'nw1'
  #.........................................................................................................
  frob_async = ( P... ) -> new Promise ( resolve ) =>
    T?.eq P, [ 1, 2, 3, ]
    result.push 'fa1'
    guy.async.after 0.25, -> warn '^455-1^', "frob_async done"; result.push 'fa2'; resolve 'fa3'
  #.........................................................................................................
  frob_sync = guy.nowait.for_awaitable frob_async
  # frob_sync = frob_async
  result.push frob_sync 1, 2, 3
  result.push 'nw2'
  info '^455-3^', "call to frob_sync done"
  debug '^455-x^', result
  T?.eq result, [ 'nw1', 'fa1', 'fa2', 'fa3', 'nw2' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "await with async steampipes" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy         = require H.guy_path
  SP          = require 'steampipes'
  { $
    $async
    $show
    $drain }  = SP.export()
  trace       = []
  trace.push 'm1'
  #.........................................................................................................
  f_async = => new Promise ( resolve ) =>
    source    = [ 1 .. 3 ]
    pipeline  = []
    pipeline.push source
    pipeline.push $async ( d, send, done ) =>
      trace.push 'fa1'
      guy.async.after 0.25, =>
        trace.push 'fa2'
        send d ** 2
        done()
    pipeline.push $show()
    pipeline.push $drain ( collector ) ->
      debug '^4576^', collector
      resolve collector
    SP.pull pipeline...
  #.........................................................................................................
  trace.push 'm2'
  result = await f_async()
  trace.push 'm3'
  info '^8876^', trace
  T?.eq result, [ 1, 4, 9 ]
  T?.eq trace, [ 'm1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3' ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "nowait with async steampipes" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy         = require H.guy_path
  SP          = require 'steampipes'
  { $
    $async
    $show
    $drain }  = SP.export()
  trace       = []
  trace.push 'm1'
  #.........................................................................................................
  f_async = => new Promise ( resolve ) =>
    source    = [ 1 .. 3 ]
    pipeline  = []
    pipeline.push source
    pipeline.push $async ( d, send, done ) =>
      trace.push 'fa1'
      guy.async.after 0.25, =>
        trace.push 'fa2'
        send d ** 2
        done()
    pipeline.push $show()
    pipeline.push $drain ( collector ) ->
      debug '^4576^', collector
      resolve collector
    SP.pull pipeline...
  #.........................................................................................................
  trace.push 'm2'
  result = ( guy.nowait.for_awaitable f_async )()
  trace.push 'm3'
  info '^8876^', trace
  T?.eq result, [ 1, 4, 9 ]
  T?.eq trace, [ 'm1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3' ]
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @[ "use-call" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   # guy         = require H.guy_path
#   # #.........................................................................................................
#   # class Gx extends guy.constructor
#   #   new_use_call: ( cfg ) ->
#   #     { target
#   #       enter } = cfg
#   #     handler = ( cfg, call ) -> enter cfg, call
#   #     return if target? then handler.bind target else handler
#   # #.........................................................................................................
#   # gx      = new Gx()
#   # target  = { target: true, }
#   # enter   = ( cfg, call ) ->
#   #   debug '^443^', cfg
#   #   R = call 'arguments provided by `enter()`', cfg
#   #   debug '^897^', "ok"
#   #   return R
#   # use     = gx.new_use_call { target, enter, }
#   # help '^33^', use { foo: 'bar', }, ( P... ) ->
#   #   debug '^787^', P
#   #   return 42
#   # #.........................................................................................................
#   defaults =
#     dba_use_cfg:
#       unsafe: false
#   class Gx2 extends guy.constructor
#     use: ( cfg ) ->
#       cfg   = defaults.dba_use_cfg
#       prve  = {}
#       if cfg.unsafe
#         prv.unsafe = @sqlt.unsafe()
#         @sqlt.unsafeMode true
#       try return cfg.call() finally
#         @sqlt.unsafeMode prv.unsafe if prv.unsafe?
#   guy = new Gx2()
#   #.........................................................................................................
#   done?()


############################################################################################################
if require.main is module then do =>
  # test @, { timeout: 5000, }
  # test @[ "await with async steampipes" ]
  # test @[ "nowait with async steampipes" ]
  test @[ "use-call" ]
  # @[ "await with async steampipes" ]()
  # @[ "demo" ]()
  # @[ "nowait" ]()



