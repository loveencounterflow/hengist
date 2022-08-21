



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
    R       = @_get_top_proxy @cfg
    return R

  #---------------------------------------------------------------------------------------------------------
  _get_top_proxy: ( cfg ) ->
    dsc =
      get: ( target, key ) =>
        @state.hedges = [ key, ]
        return R if ( R = target[ key ] ) isnt undefined
        hedges        = [ @state.hedges..., ]
        sub_target    = ( P... ) => @cfg.target hedges, P...
        return target[ key ] ?= @_get_sub_proxy { target: sub_target, }
    R = new Proxy cfg.target, dsc

  #---------------------------------------------------------------------------------------------------------
  _get_sub_proxy: ( cfg ) ->
    dsc =
      get: ( target, key ) =>
        @state.hedges.push key
        return R if ( R = target[ key ] ) isnt undefined
        hedges        = [ @state.hedges..., ]
        sub_target    = ( P... ) => @cfg.target hedges, P...
        return target[ key ] ?= @_get_sub_proxy { target: sub_target, }
    R = new Proxy cfg.target, dsc




############################################################################################################
if module is require.main then do =>

  #---------------------------------------------------------------------------------------------------------
  isa  = ( hedges, x ) ->
    unless ( arity = arguments.length ) is 2
      throw new Error "^387^ expected 2 arguments, got #{arity}"
    help '^450-5^', { hedges, x, }
    return true

  #---------------------------------------------------------------------------------------------------------
  info '^450-6^', h = new Hedge { target: isa, }
  #.........................................................................................................
  info '^450-12^', try h 1        catch error then warn rvr error.message
  info '^450-12^', try h 1, 2, 3  catch error then warn rvr error.message
  #.........................................................................................................
  info '^450-12^', h [ 'one', ], 1
  info '^450-12^', h.one 1
  info '^450-13^', h.one.two 2
  info '^450-14^', h.one.two.three 3
  info '^450-14^', h.one.two.three 3
  info '^450-15^', h.one.two.three.four 4
  info '^450-16^', h [ 'one', 'two', 'three', 'four', 'five', ], 5
  info '^450-16^', h.one.two.three.four.five 5

  #---------------------------------------------------------------------------------------------------------
  return null
