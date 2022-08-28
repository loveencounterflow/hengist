
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
rvr                       = GUY.trm.reverse
nameit                    = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require '../../../../apps/intertype' ).Intertype()

#-----------------------------------------------------------------------------------------------------------
@mmx_instance_methods = ( T, done ) ->
  { Multimix } = require '../../../../apps/multimix'

  #=========================================================================================================
  class Foobar

    #-------------------------------------------------------------------------------------------------------
    constructor: ->
      @collector = []
      get_handler = ( name ) => ( props, P... ) =>
        help '^434-1^', { name, props, P, }
        @collector.push { name, props, P, }
        return null
      @blah   = new Multimix { hub: @, handler: ( get_handler 'blah' ), }
      @blurb  = new Multimix { hub: @, handler: ( get_handler 'blurb' ), }
      @state  = @blah[Multimix.symbol].state
      debug '^434-2^', @state
      return undefined

  #=========================================================================================================
  debug '^434-3^', d = new Foobar()
  debug '^434-4^', d.blah.something
  #.........................................................................................................
  debug '^434-5^', d.blah.something 42
  debug '^434-8^', d.state
  T?.eq d.collector, [ { name: 'blah', props: [ 'something' ], P: [ 42 ] } ]
  #.........................................................................................................
  debug '^434-5^', d.blah.something.one.two.three 42
  debug '^434-8^', d.state
  T?.eq d.collector, [ { name: 'blah', props: [ 'something' ], P: [ 42 ] }, { name: 'blah', props: [ 'something', 'one', 'two', 'three' ], P: [ 42 ] } ]
  #.........................................................................................................
  debug '^434-6^', d.blurb.otherthing 42
  debug '^434-7^', d.blah[Multimix.symbol].state is d.blurb[Multimix.symbol].state
  debug '^434-8^', d.state
  T?.eq d.collector, [ { name: 'blah', props: [ 'something' ], P: [ 42 ] }, { name: 'blah', props: [ 'something', 'one', 'two', 'three' ], P: [ 42 ] }, { name: 'blurb', props: [ 'otherthing' ], P: [ 42 ] } ]
  other = new Multimix { handler: -> }
  T?.eq ( types.type_of d.state                               ), 'object'
  T?.eq ( types.type_of d.state.hedges                        ), 'list'
  T?.eq ( types.type_of d.blah[Multimix.symbol].state         ), 'object'
  T?.eq ( types.type_of d.blah[Multimix.symbol].state.hedges  ), 'list'
  T?.ok d.blah[Multimix.symbol].state is d.blurb[Multimix.symbol].state
  T?.ok d.blah[Multimix.symbol].state isnt other[Multimix.symbol].state
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_can_inhibit_prop_creation = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  hub           = {}
  collectors    = { handler: [], foo: [], }
  handler       = ( hedges, x ) ->
    collectors.handler.push { hedges, x, }
    urge '^334^', { hedges, x, }
    return null
  T?.throws /expected boolean or function/, -> d = new Multimix { hub, handler, create: 123, }
  #.........................................................................................................
  d             = new Multimix { hub, handler, create: false, }
  d.foo         = ( hedges, x ) ->
    collectors.foo.push { hedges, x, }
    return null
  #.........................................................................................................
  d.foo 42
  T?.eq d.bar, undefined
  T?.throws /not a function/, -> d.bar 42
  T?.eq collectors, { handler: [], foo: [ { hedges: 42, x: undefined } ] }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_can_use_function_for_create = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  hub           = {}
  collector     = []
  handler       = ( hedges, x ) -> debug '^403-1^', { hedges, x, }; collector.push { hedges, x, }; return x * 2
  create        = ( key, target ) ->
    # debug '^403-1^', { key, }
    collector.push key
    target[ key ] = new Multimix { hub, create, handler, }
    return null
  #.........................................................................................................
  d             = new Multimix { hub, handler, create: true, }
  mmx           = d[Multimix.symbol]
  #.........................................................................................................
  urge '^002-1^', ( rpr d.foo         )
  urge '^002-2^', ( rpr d.bar         )
  urge '^002-3^', ( rpr d.foo.bar     )
  urge '^002-4^', ( rpr d.foo.bar.baz )
  help '^002-4^', branch for branch in GUY.props.tree d
  T?.eq ( rpr d.foo         ), '[Function: foo]'
  T?.eq ( rpr d.bar         ), '[Function: bar]'
  T?.eq ( rpr d.foo.bar     ), '[Function: bar]'
  T?.eq ( rpr d.foo.bar.baz ), '[Function: baz]'
  T?.ok d.uno.duo.tres is   d.uno.duo.tres
  T?.ok d.uno.duo.tres isnt d.uno.duo.quatro
  urge '^002-5^', "d             1          ", ( rvr d                        1 ), mmx.state
  urge '^002-6^', "d.foo.bar.baz 2          ", ( rvr d.foo.bar.baz            2 ), mmx.state
  urge '^002-7^', "d             3          ", ( rvr d                        3 ), mmx.state
  urge '^002-8^', "d.foo.bar.baz 4          ", ( rvr d.foo.bar.baz            4 ), mmx.state
  urge '^002-9^', "d.foo.bar.baz d.one.two 3", ( rvr d.foo.bar.baz d.one.two  3 ), mmx.state
  # T?.eq collector, [ 'foo', 'bar', 'baz', 'uno', 'duo', 'tres', 'quatro' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_props_are_hidden_by_default = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  nope          = Symbol 'nope'
  handler       = ->
  d             = new Multimix { handler, }
  #.........................................................................................................
  urge '^002-1^', ( rpr d.foo         )
  urge '^002-2^', ( rpr d.bar         )
  urge '^002-3^', ( rpr d.foo.bar     )
  urge '^002-4^', ( rpr d.foo.bar.baz )
  T?.ok ( GUY.props.get d, 'xxx', nope ) is nope
  T?.ok ( GUY.props.get d, 'foo', nope ) isnt nope
  T?.ok ( GUY.props.get d, 'duo', nope ) is nope
  T?.eq ( Object.getOwnPropertyDescriptor d, 'foo' ).enumerable, false
  help '^002-1^', ( props.join '.' ) for props in GUY.props.tree d
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_no_assignment_with_create_function = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  collector     = []
  handler       = ( props, P... ) -> debug '^888-1^', { props, P, }
  create        = ( key, target ) ->
    debug '^888-2^', key
    collector.push key
    ### return value to be silently discarded ###
    return { key: 'value', }
  #.........................................................................................................
  d             = new Multimix { handler, create, }
  #.........................................................................................................
  T?.eq d.foo, undefined
  T?.throws /undefined/, -> try d.foo.bar catch error then warn '^888-3^', rvr error.message; throw error
  T?.eq collector, [ 'foo', 'foo', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_cfg_strict = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  hub           = {}
  handler       = ->
  handler.bar   = 123
  #.........................................................................................................
  do =>
    d             = new Multimix { hub, handler, strict: true, }
    mmx           = d[Multimix.symbol]
    debug '^080^', mmx
    debug '^080^', GUY.props.get handler, 'bar', Symbol 'nope'
    debug '^080^', GUY.props.has handler, 'bar'
    debug '^080^', GUY.props.get d, 'bar', Symbol 'nope'
    debug '^080^', GUY.props.has d, 'bar'
    T?.eq d.bar, 123
    T?.eq mmx.strict, true
    T?.eq mmx.create, false
    T?.throws /no such property/, -> try d.anything catch error then warn '^454-1^', rvr error.message; throw error
  #.........................................................................................................
  do =>
    T?.throws /cannot set both `create` and `strict`/, -> try d = new Multimix { hub, handler, create: true,   strict: true, } catch error then warn '^454-2^', rvr error.message; throw error
    T?.throws /cannot set both `create` and `strict`/, -> try d = new Multimix { hub, handler, create: ( -> ), strict: true, } catch error then warn '^454-3^', rvr error.message; throw error
  #.........................................................................................................
  do =>
    d             = new Multimix { hub, handler, }
    mmx           = d[Multimix.symbol]
    debug '^080^', mmx
    T?.eq mmx.strict, false
    T?.eq mmx.create, true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_cfg_oneshot = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  hub           = {}
  handler       = ( props, x ) ->
  #.........................................................................................................
  do =>
    isa           = ( hedges, x ) ->
      throw new Error "no types given"    if hedges.length is 0
      return ( typeof x ) is hedges[ 0 ]  if hedges.length is 1
      for hedge in hedges
        return false unless isa [ hedge, ], x
      return true
    d             = new Multimix { hub, handler: isa, strict: false, oneshot: true }
    mmx           = d[Multimix.symbol]
    debug '^080-1^', mmx
    T?.ok types.isa.function d.bar
    T?.eq mmx.strict,   false
    T?.eq mmx.create,   true
    T?.eq mmx.oneshot,  true
    T?.eq mmx.deletion, true
    T?.eq ( types.type_of d.function ), 'function'
    T?.eq ( d.function ->   ), true
    T?.eq ( d.function null ), false
    T?.throws /oneshot object does not allow re-assignment to property 'function'/, \
      -> try d.function = 9 catch error then warn '^080-1^', rvr error.message; throw error
    delete d.function
    T?.eq ( types.type_of d.function ), 'function'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_cfg_deletion = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  hub           = {}
  handler       = ( props, x ) ->
  #.........................................................................................................
  do =>
    isa           = ( hedges, x ) ->
      throw new Error "no types given"    if hedges.length is 0
      return ( typeof x ) is hedges[ 0 ]  if hedges.length is 1
      for hedge in hedges
        return false unless isa [ hedge, ], x
      return true
    d             = new Multimix { hub, handler: isa, deletion: false, }
    mmx           = d[Multimix.symbol]
    debug '^081-1^', mmx
    T?.ok types.isa.function d.bar
    T?.eq mmx.strict,   false
    T?.eq mmx.create,   true
    T?.eq mmx.oneshot,  false
    T?.eq mmx.deletion, false
    T?.eq ( types.type_of d.function ), 'function'
    T?.throws /object does not allow deletion of property 'function'/, \
      -> try delete d.function catch error then warn '^082-1^', rvr error.message; throw error
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@mmx_state_shared_or_not = ( T, done ) ->
  { Multimix }  = require '../../../../apps/multimix'
  mmxs    = Multimix.symbol
  hub     = {}
  mmx_1a  = ( new Multimix { hub: {}, handler: ( -> ), } )[mmxs]
  mmx_1b  = ( new Multimix { hub: {}, handler: ( -> ), } )[mmxs]
  mmx_2a  = ( new Multimix {          handler: ( -> ), } )[mmxs]
  mmx_2b  = ( new Multimix {          handler: ( -> ), } )[mmxs]
  mmx_3a  = ( new Multimix { hub,     handler: ( -> ), } )[mmxs]
  mmx_3b  = ( new Multimix { hub,     handler: ( -> ), } )[mmxs]
  #.........................................................................................................
  T?.ok mmx_1a.hub          isnt  mmx_1b.hub
  T?.ok mmx_1a.state        isnt  mmx_1b.state
  T?.ok mmx_1a.state.hedges isnt  mmx_1b.state.hedges
  T?.ok mmx_2a.hub          isnt  mmx_2b.hub
  T?.ok mmx_2a.state        isnt  mmx_2b.state
  T?.ok mmx_2a.state.hedges isnt  mmx_2b.state.hedges
  T?.ok mmx_3a.hub          is    mmx_3b.hub
  T?.ok mmx_3a.state        is    mmx_3b.state
  T?.ok mmx_3a.state.hedges is    mmx_3b.state.hedges
  # urge '^310-1^', mmx_1a.hub, mmx_1b.hub
  # urge '^310-1^', mmx_2a.hub, mmx_2b.hub
  # urge '^310-1^', mmx_3a.hub, mmx_3b.hub
  # hub.x = 1
  # urge '^310-1^', mmx_3a.hub, mmx_3b.hub
  # urge '^310-1^', mmx_3a.hub.x, mmx_3b.hub.x
  # urge '^310-1^', mmx_3a.hub.x(), mmx_3b.hub.x()
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # @_demo_intertype_with_multimix()
  # test @mmx_instance_methods
  # @mmx_can_inhibit_prop_creation()
  # test @mmx_can_inhibit_prop_creation
  # @mmx_cfg_strict()
  # test @mmx_cfg_strict
  # test @mmx_can_use_function_for_create
  # test @mmx_no_assignment_with_create_function
  # test @mmx_props_are_hidden_by_default
  # @mmx_state_shared_or_not()
  # test @mmx_state_shared_or_not
  test @

