



############################################################################################################
GUY                       = require '../../../apps/guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'GUY/demo-guy-hedgerows'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
rvr                       = GUY.trm.reverse
truth                     = GUY.trm.truth.bind GUY.trm
{ Intertype }             = require '../../../apps/intertype'
types                     = new Intertype()
{ declare
  create
  isa
  validate  }             = types
node_inspect              = Symbol.for 'nodejs.util.inspect.custom'


#-----------------------------------------------------------------------------------------------------------
declare.hdg_new_hedge_cfg
  $target:      'function'
  default:
    target:     null

#-----------------------------------------------------------------------------------------------------------
declare.hdg_get_proxy_cfg
  $target:      'function'
  default:
    target:     null

#-----------------------------------------------------------------------------------------------------------
class Hedge

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    @cfg    = create.hdg_new_hedge_cfg cfg
    @state  =
      hedges: null
    R       = @_get_hedge_proxy true, cfg.target
    return R

  #---------------------------------------------------------------------------------------------------------
  _get_hedge_proxy: ( is_top, owner ) ->
    dsc =
      #-----------------------------------------------------------------------------------------------------
      get: ( target, key ) =>
        return "#{target.constructor.name}"   if key is Symbol.toStringTag
        return target.constructor             if key is 'constructor'
        return target.toString                if key is 'toString'
        return target.call                    if key is 'call'
        return target.apply                   if key is 'apply'
        return target[ Symbol.iterator  ]     if key is Symbol.iterator
        return target[ node_inspect     ]     if key is node_inspect
        ### NOTE necessitated by behavior of `node:util.inspect()`: ###
        return target[ 0                ]     if key is '0'
        #...................................................................................................
        if is_top then  @state.hedges = [ key, ]
        else            @state.hedges.push key
        #...................................................................................................
        return R if ( R = target[ key ] ) isnt undefined
        hedges        = [ @state.hedges..., ]
        #...................................................................................................
        sub_owner     = ( P... ) => @cfg.target hedges, P...
        return target[ key ] ?= @_get_hedge_proxy false, sub_owner
    #.......................................................................................................
    R = new Proxy owner, dsc


############################################################################################################
if module is require.main then do =>

  #---------------------------------------------------------------------------------------------------------
  _isa  = ( hedges, x ) ->
    unless ( arity = arguments.length ) is 2
      throw new Error "^387^ expected single argument, got #{arity - 1}"
    help '^450-1^', { hedges, x, }
    return true

  #---------------------------------------------------------------------------------------------------------
  _create  = ( hedges, isa ) ->
    # unless ( arity = arguments.length ) is 1
    #   throw new Error "^387^ expected no arguments, got #{arity - 1}"
    ### TAINT also check for hedges being a list ###
    unless ( hedgecount = hedges.length ) is 1
      throw new Error "^387^ expected single hedge, got #{rpr hedges}"
    help '^450-2^', { hedges, isa, }
    return true

  #---------------------------------------------------------------------------------------------------------
  info '^450-3^', isa     = new Hedge { target: _isa, }
  info '^450-4^', create  = new Hedge { target: _create, }
  #.........................................................................................................
  info '^450-5^', try isa 1        catch error then warn rvr error.message
  info '^450-6^', try isa 1, 2, 3  catch error then warn rvr error.message
  #.........................................................................................................
  info '^450-7^', create.one ( x ) -> ( x is 1 ) or ( x is '1' )
  #.........................................................................................................
  info '^450-8^', isa [ 'one', ], 1
  info '^450-9^', isa.one 1
  info '^450-10^', isa.one.two 2
  info '^450-11^', isa.one.two.three 3
  info '^450-12^', isa.one.two.three.four 4
  info '^450-13^', isa [ 'one', 'two', 'three', 'four', 'five', ], 5
  info '^450-14^', isa.one.two.three.four.five 5

  #---------------------------------------------------------------------------------------------------------
  return null
