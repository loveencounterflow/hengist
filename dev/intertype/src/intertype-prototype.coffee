
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'INTERTYPE/prototype'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
{ hide
  tree }                  = GUY.props
rvr                       = GUY.trm.reverse
nameit                    = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype()
hub                       = @
#...........................................................................................................
hide @, 'Multimix', ( require '../../../apps/multimix' ).Multimix
Multimix                  = @Multimix


#-----------------------------------------------------------------------------------------------------------
@registry =
  integer: ( x ) -> ( Number.isFinite x ) and ( x is Math.floor x )
  #.........................................................................................................
  even: ( x ) ->
    if ( Number.isInteger x )     then return ( x % 2  ) is   0
    else if typeof x is 'bigint'  then return ( x % 2n ) is   0n
    return false
  #.........................................................................................................
  odd: ( x ) ->
    if ( Number.isInteger x )     then return ( x % 2  ) isnt 0
    else if typeof x is 'bigint'  then return ( x % 2n ) isnt 0n
    return false

#-----------------------------------------------------------------------------------------------------------
@handlers =

  #---------------------------------------------------------------------------------------------------------
  isa: ( props, x ) ->
    # whisper '^321-1^', '---------------------------------------'
    # debug '^321-1^', { props, x, }
    for prop in props
      # debug '^321-2^', prop
      # debug '^321-3^', hub.registry
      # debug '^321-4^', hub.registry[ prop ]
      unless ( fn = hub.registry[ prop ] )?
        throw new Error "unknown type #{rpr prop}"
      return false unless fn.call hub, x
    return true

  #---------------------------------------------------------------------------------------------------------
  declare: ( props, isa ) ->
    unless ( arity = props.length ) is 1
      throw new Error "expected single property, got #{arity}: #{rpr props}"
    [ name, ]             = props
    hub.registry[ name ]  = R = nameit name, ( props, x ) -> isa x
    return R

#-----------------------------------------------------------------------------------------------------------
@isa      = new Multimix { hub, handler: @handlers.isa,     }
@declare  = new Multimix { hub, handler: @handlers.declare, }


