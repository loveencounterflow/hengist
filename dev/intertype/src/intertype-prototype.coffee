
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
#...........................................................................................................
hide @, 'Multimix', ( require '../../../apps/multimix' ).Multimix
Multimix                  = @Multimix


#===========================================================================================================
class @Intertype

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    hub           = @
    clasz         = @constructor
    handlers      = clasz._get_handlers hub
    @isa          = new Multimix { hub, handler: handlers.isa,     }
    @declare      = new Multimix { hub, handler: handlers.declare, }
    @mmx          = @isa[Multimix.symbol]
    @state        = @mmx.state
    @state.trace  = []
    #---------------------------------------------------------------------------------------------------------
    ### TAINT this part goes into declarations ###
    @registry =
      integer:  ( x ) -> ( Number.isFinite x ) and ( x is Math.floor x )
      text:     ( x ) -> ( typeof x ) is 'string'
      list:     ( x ) -> Array.isArray x
      #.......................................................................................................
      even: ( x ) ->
        if ( Number.isInteger x )     then return ( x % 2  ) is   0
        else if typeof x is 'bigint'  then return ( x % 2n ) is   0n
        return false
      #.......................................................................................................
      odd: ( x ) ->
        if ( Number.isInteger x )     then return ( x % 2  ) isnt 0
        else if typeof x is 'bigint'  then return ( x % 2n ) isnt 0n
        return false
    return undefined

  #---------------------------------------------------------------------------------------------------------
  _trace: ({ref, level, prop, x, R, }) ->
    ### [ ref, level, prop, value, R, ] = checkpoint ###
    # H.types.validate.nonempty_text  ref
    # H.types.validate.cardinal       level
    # H.types.validate.nonempty_text  prop
    # H.types.validate.boolean        R
    @state.trace.push { ref, level, prop, x, R, }
    return R

  #---------------------------------------------------------------------------------------------------------
  _reset_trace: -> @state.trace = []

  #-------------------------------------------------------------------------------------------------------
  _isa: ( props, x, level ) ->
    @_reset_trace() if level is 0
    advance   = false
    last_idx  = props.length - 1
    R         = true
    idx       = -1
    prop      = null
    nxt_prop  = null
    #.....................................................................................................
    loop
      idx++
      return R if idx > last_idx
      [ prop, nxt_prop, ] = [ props[ idx ], props[ idx + 1 ], ]
      #...................................................................................................
      if advance
        if prop is 'or'
          @_trace { ref: '▲i1', level, prop, x, R, }
          return true if R
          advance = false
        continue
      #...................................................................................................
      if prop is 'or'
        throw new Error "cannot have `or` as first prop, got #{rpr props.join '.'}" if idx is 0
        throw new Error "cannot have `or` as last prop, got #{rpr props.join '.'}" if idx is last_idx
        throw new Error "cannot have two `or` props in succession, got #{rpr props.join '.'}" if nxt_prop is 'or'
        @_trace { ref: '▲i2', level, prop, x, R, }
        return true if R
        advance = true
        continue
      #...................................................................................................
      if prop is 'of'
        throw new Error "cannot have `of` as first prop, got #{rpr props.join '.'}" if idx is 0
        throw new Error "cannot have `of` as last prop, got #{rpr props.join '.'}" if idx is last_idx
        throw new Error "cannot have two `of` props in succession, got #{rpr props.join '.'}" if nxt_prop is 'of'
        props_tail = props[ idx + 1 ... ]
        try
          for element from x
            return false unless @_isa props_tail, element, level + 1
        catch error
          throw error unless ( error.name is 'TypeError' ) and ( error.message is 'x is not iterable' )
          throw new E.Intertype_ETEMPTBD '^intertype.isa@7^', \
            "`of` must be preceded by collection name, got #{rpr hedges[ hedge_idx - 1 ]}"
        return true
      #...................................................................................................
      unless ( fn = @registry[ prop ] )?
        throw new Error "unknown type #{rpr prop}"
      #...................................................................................................
      R = R = fn.call @, x
      @_trace { ref: '▲i3', level, prop, x, R, }
      unless R is true or R is false
        ### TAINT use this library to determine type: ###
        throw new Error "expected test result to be boolean, go a #{typeof R}: #{rpr R}"
      advance = not R
    #.....................................................................................................
    return R

#-----------------------------------------------------------------------------------------------------------
@Intertype._get_handlers = ( hub ) ->
  R =
    #-------------------------------------------------------------------------------------------------------
    isa: ( props, x ) ->
      unless ( arity = props.length ) > 0
        throw new Error "expected at least one property, got #{arity}: #{rpr props}"
      return hub._isa props, x, 0

    #-------------------------------------------------------------------------------------------------------
    declare: ( props, isa ) ->
      unless ( arity = props.length ) is 1
        throw new Error "expected single property, got #{arity}: #{rpr props}"
      [ name, ]             = props
      hub.registry[ name ]  = R = nameit name, ( props, x ) -> isa x
      return R

  #---------------------------------------------------------------------------------------------------------
  return R

