



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
      throw new Error "^387^ expected 2 arguments, got #{arity}"
    help '^450-5^', { hedges, x, }
    return true

  #---------------------------------------------------------------------------------------------------------
  info '^450-6^', isa = new Hedge { target: _isa, }
  #.........................................................................................................
  info '^450-12^', try isa 1        catch error then warn rvr error.message
  info '^450-12^', try isa 1, 2, 3  catch error then warn rvr error.message
  #.........................................................................................................
  info '^450-12^', isa [ 'one', ], 1
  info '^450-12^', isa.one 1
  info '^450-13^', isa.one.two 2
  info '^450-14^', isa.one.two.three 3
  info '^450-15^', isa.one.two.three.four 4
  info '^450-16^', isa [ 'one', 'two', 'three', 'four', 'five', ], 5
  info '^450-16^', isa.one.two.three.four.five 5

  #---------------------------------------------------------------------------------------------------------
  return null
