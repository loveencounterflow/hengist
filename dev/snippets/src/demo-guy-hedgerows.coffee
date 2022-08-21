



############################################################################################################
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
GUY                       = require '../../../apps/guy'
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
        # debug '^450-1^', @state
        sub_target    = ( P... ) => urge '^450-2^', { hedges, P, }; @cfg.target hedges, P...
        return target[ key ] ?= @_get_sub_proxy { target: sub_target, }
    R = new Proxy cfg.target, dsc

  #---------------------------------------------------------------------------------------------------------
  _get_sub_proxy: ( cfg ) ->
    dsc =
      get: ( target, key ) =>
        @state.hedges.push key
        return R if ( R = target[ key ] ) isnt undefined
        hedges        = [ @state.hedges..., ]
        # debug '^450-3^', @state
        sub_target    = ( P... ) => urge '^450-4^', { hedges, P, }; @cfg.target hedges, P...
        return target[ key ] ?= @_get_sub_proxy { target: sub_target, }
    R = new Proxy cfg.target, dsc




############################################################################################################
if module is require.main then do =>
  target  = ( hedges, P ) -> help '^450-5^', { hedges, P, }
  info '^450-6^', h = new Hedge { target, }
  # info '^450-7^', h.foo.bar
  # info '^450-8^', h.one.two.three.four.five
  # info '^450-9^', h.one.two
  # info '^450-10^', h
  # info '^450-11^', h.foo.bar                 42
  info '^450-12^', h.one 1
  info '^450-13^', h.one.two 2
  info '^450-14^', h.one.two.three 3
  info '^450-14^', h.one.two.three 3
  info '^450-15^', h.one.two.three.four 4
  info '^450-16^', h.one.two.three.four.five 5
  # info '^450-17^', h.one.two                 42
  # info '^450-18^', h                         42

  # test_non_identity = ->
  #   a = create.hdg_get_proxy_cfg()
  #   b = create.hdg_get_proxy_cfg()
  #   debug a
  #   debug b
  #   debug a is b
  #   debug a.target is b.target
