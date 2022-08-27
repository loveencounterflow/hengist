
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
  integer:  ( x ) -> ( Number.isFinite x ) and ( x is Math.floor x )
  text:     ( x ) -> ( typeof x ) is 'string'
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
    unless ( arity = props.length ) > 0
      throw new Error "expected at least one property, got #{arity}: #{rpr props}"
    whisper '^321-1^', '---------------------------------------'
    debug '^445-1^', { props, x, }
    advance     = false
    last_idx    = props.length - 1
    R = true
    #.......................................................................................................
    for prop, idx in props
      debug '^445-2^', { idx, prop, R, advance, }
      return R if idx > last_idx
      #.....................................................................................................
      if advance
        debug '^445-3^'
        if prop is 'or'
          return true if R
          advance = false
        continue
      #.....................................................................................................
      if prop is 'or'
        return true if R
        debug '^445-4^'
        advance = true
        continue
      #.....................................................................................................
      unless ( fn = hub.registry[ prop ] )?
        throw new Error "unknown type #{rpr prop}"
      #.....................................................................................................
      unless ( R = fn.call hub, x ) is true or R is false
        ### TAINT use this library to determine type: ###
        throw new Error "expected test result to be boolean, go a #{typeof R}: #{rpr R}"
      debug '^445-5^', GUY.trm.reverse { idx, prop, R, advance, }
      advance = not R
    #.......................................................................................................
    return R

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


