


'use strict'


#===========================================================================================================
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'subsidiary'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
# test                      = require 'guy-test'
resolved_promise          = Promise.resolve()


#===========================================================================================================
isa =
  anything:               ( x ) -> true
  nothing:                ( x ) -> not x?
  something:              ( x ) -> x?
  function:               ( x ) -> ( Object::toString.call x ) is '[object Function]'
  asyncfunction:          ( x ) -> ( Object::toString.call x ) is '[object AsyncFunction]'
  symbol:                 ( x ) -> ( typeof x ) is 'symbol'
  object:                 ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
  text:                   ( x ) -> ( typeof x ) is 'string'
  event_listener:         ( x ) -> ( @function x ) or ( @asyncfunction x )
  event_key:              ( x ) -> ( @text x ) or ( @symbol x )


#===========================================================================================================
validate = do =>
  R = {}
  for type, test of isa
    R[ type ] = do ( type, test ) => ( x ) =>
      return x if test.call isa, x
      ### TAINT `typeof` will give some strange results ###
      throw new Error "expected a #{type}, got a #{typeof x}"
  return R

#===========================================================================================================
class Async_events

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    @symbols    = {}
    @listeners  = new WeakMap()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  on: ( key, receiver ) ->
    validate.event_key key
    validate.something receiver
    #.......................................................................................................
    @symbols[ key ]           = ( key_symbol  = Symbol key  ) unless ( key_symbol = @symbols[ key ]           )?
    debug '^992-1^', { key_symbol, }
    @listeners.set key_symbol,  ( registry    = new Set()   ) unless ( registry   = @listeners.get key_symbol )?
    #.......................................................................................................
    if isa.event_listener receiver
      listener      = receiver
    else
      listener_name = "on_#{key}"
      listener      = receiver[ listener_name ]
      validate.event_listener listener
      ### TAINT this anonymous function subverts the purpose of using s set ###
      listener = do ( original_listener = listener ) ->
        ( P... ) -> await original_listener.call receiver, P...
    registry.add listener
    #.......................................................................................................
    unsubscribe = ->
    return unsubscribe

  #---------------------------------------------------------------------------------------------------------
  emit: ( key, data... ) ->
    listeners = ( AE.listeners.get AE.symbols[ 'blah' ] ) ? ( new Set() )
    debug '^992-2^', listeners
    await resolved_promise ### as per https://github.com/sindresorhus/emittery/blob/main/index.js#L363 ###
    return await Promise.all ( ( -> await listener key, data... )() for listener from listeners )

  # #---------------------------------------------------------------------------------------------------------
  # matches: ( matcher, candidate ) ->


#===========================================================================================================
AE = new Async_events()

#===========================================================================================================
demo = ->
  receiver =
    on_blah:  ( key, data... ) -> info '^992-3^', key, data; { key, data, }
    on_foo:   ( key, data... ) -> info '^992-4^', key, data; { key, data, }
  AE.on 'blah', receiver
  AE.on 'foo',  receiver
  debug '^992-5^', AE
  debug '^992-6^', AE.symbols[ 'blah' ]
  debug '^992-7^', AE.listeners
  debug '^992-8^', AE.listeners.get AE.symbols[ 'blah' ]
  debug '^992-9^', await AE.emit 'blah'
  debug '^992-9^', await AE.emit 'foo', 3, 4, 5, 6
  return null


#===========================================================================================================
if module is require.main then await do =>
  await demo()
  urge '^992-10^', await Promise.all (
    # new Promise ( ( resolve, reject ) -> resolve i ) for i in [ 1 .. 10 ]
    ( ( ( count ) -> await count ) i + 1 ) for i in [ 1 .. 10 ]
    )