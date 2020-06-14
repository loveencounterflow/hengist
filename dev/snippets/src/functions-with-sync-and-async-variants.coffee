



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'CUPOFJOE'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
#...........................................................................................................
@types                    = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = @types.export()
defer                     = setImmediate
after                     = ( dts, f ) -> setTimeout f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done


###

* You have a function `f()` that may work snychronously or asynchronously, depending on runtime
  factors.
* As such, making it the consumer's responsibility to choose bewteen `f_sync ...` or `await f_async ...` is
  not the problem;
* but the implementations for `f_sync()` and `f_async()` would be almost identical save for one or a few
  conditional branches

###

#===========================================================================================================
class Exp1

  #---------------------------------------------------------------------------------------------------------
  expand_sync: ( list ) ->
    for element, idx in list
      debug 'expand_sync', { idx, element, }
      switch type = type_of element
        when 'function'       then list[ idx ] = element()
        when 'asyncfunction'  then throw new Error "unable to resolve asny function snychronously"
    return list

  #---------------------------------------------------------------------------------------------------------
  expand_async: ( list ) ->
    for element, idx in list
      debug 'expand_async', { idx, element, }
      switch type = type_of element
        when 'function'       then list[ idx ] = value =        element()
        when 'asyncfunction'  then list[ idx ] = value = await  element()
      # if type_of value is 'promise' then list[ idx ] = await value
      if isa.thenable value then list[ idx ] = await value
    return list

  #---------------------------------------------------------------------------------------------------------
  demo: ->
    info @expand_sync [ 4, ( -> 42 ), 8, ]
    f = -> new Promise ( done ) ->
      await sleep 0
      done 'async!'
    debug f()
    debug await f()
    info await @expand_async [ ( -> 'sync' ), f, 8, ]
    return null


############################################################################################################
if module is require.main then do =>
  exp1 = new Exp1()
  await exp1.demo()



