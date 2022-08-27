
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
  whisper }               = GUY.trm.get_loggers 'MULTIMIX/tests/basics'
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
types                     = new ( require '../../../../apps/intertype' ).Intertype()
{ Multimix }              = require '../../../../apps/multimix'


#===========================================================================================================
paragons =

  #---------------------------------------------------------------------------------------------------------
  isa: ( props, x, P... ) ->
    whisper '^450-1^', rvr 'isa', { props, x, P, }
    unless ( arity = arguments.length ) is 2
      throw new Error "^450-2^ expected single argument, got #{arity - 1}"
    unless props.length > 0
      throw new Error "^450-3^ expected at least one type, got none"
    ### TAINT very much simplified version of `Intertype::_inner_isa()` ###
    return @isa[ props[ 0 ] ] null, x if props.length is 1
    for hedge in props
      R = @isa[ hedge ] x
      whisper '^450-4^', { R, hedge, handler: @isa[ hedge ], x, }
      return false if R is false
      return R unless R is true
    return true

  #---------------------------------------------------------------------------------------------------------
  declare: ( props, isa ) ->
    # if arguments.length < 2
    #   debug '^450-5^', "`declare()` called with no argument; leaving"
    #   return null
    # unless ( arity = arguments.length ) is 1
    #   throw new Error "^387^ expected no arguments, got #{arity - 1}"
    ### TAINT also check for props being a list ###
    unless ( hedgecount = props.length ) is 1
      throw new Error "^450-6^ expected single hedge, got #{rpr props}"
    [ name, ]         = props
    isa = nameit name, isa
    debug '^450-7^', rvr 'declare', { props, isa, }
    @registry[ name ] = isa
    # handler           = ( props, x, P... ) => debug '^450-8^', { props, x, P, }; @isa.call @, props, x
    # hide @isa, name, nameit name, new Multimix { hub: @, handler, }
    return null

  #---------------------------------------------------------------------------------------------------------
  create: ( name, target ) ->
    debug '^450-9^', 'create', { name, target, isa: @registry[ name ], }
    return null


#===========================================================================================================
class Intertype

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    # GUY_props.hide @, 'isa', new Multimix
    proxy_cfg =
      # create:     paragons.create.bind @
      create:     true
      strict:     false
      oneshot:    true
      delete:     false
      hide:       true
    hide @, 'registry', {}
    hide @, 'isa',      nameit 'isa',     new Multimix { proxy_cfg..., hub: @, handler: paragons.isa,     }
    hide @, 'declare',  nameit 'declare', new Multimix { proxy_cfg..., hub: @, handler: paragons.declare, }
    hide @, 'mmx',      @isa[Multimix.symbol]
    return undefined


#-----------------------------------------------------------------------------------------------------------
@test = ( T, done ) ->
  t         = new Intertype()
  { declare
    isa }   = t
  info '^450-10^', declare
  info '^450-11^', declare.one
  info '^450-12^', declare.one ( x ) -> debug '^one^', { x, }; ( x is 1 ) or ( x is '1' )
  info '^450-13^', declare.two ( x ) -> debug '^two^', { x, }; ( x is 2 ) or ( x is '2' )
  info '^450-14^', t.registry
  info '^450-15^', isa.one 42
  info '^450-16^', isa.one 1
  T?.eq ( isa.one 1   ), true
  T?.eq ( isa.one '1' ), true
  T?.eq ( isa.one 2   ), false
  info '^450-17^', isa.one is declare.one
  info '^450-18^', declare.one
  info '^450-19^', t
  info '^450-20^', isa
  info '^450-21^', declare
  #---------------------------------------------------------------------------------------------------------
  done?()


############################################################################################################
if module is require.main then do =>
  @test()
  # test @

