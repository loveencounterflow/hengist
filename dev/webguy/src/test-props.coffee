
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
  whisper }               = GUY.trm.get_loggers 'webguy/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
types                     = new ( require 'intertype-newest' ).Intertype()
{ isa }                   = types

# #-----------------------------------------------------------------------------------------------------------
# @[ "_XEMITTER: _" ] = ( T, done ) ->
#   { DATOM }                 = require '../../../apps/datom'
#   { new_datom
#     select }                = DATOM
  # { Djehuti }               = require '../../../apps/intertalk'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ key, value, ] = probe
#       resolve new_datom key, value
#   done()
#   return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_basic = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  a = { number: 12, a_f: null, }
  b = { number: 123, text: 123, b_f: 123, a_f: 123, }
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_constructor = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  a = new A()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_inludes_inherited = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_public_keys_skips_underscores_and_symbols = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    constructor: ->
      @number = 18
      @_do_not_touch_me = false
      return undefined
    a_f: ->
  class B extends A
    constructor: ->
      super()
      @text = 'abcd'
      @[Symbol 'helo'] = 456
      @_do_not_touch_me_either = false
      return undefined
    b_f: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  T?.eq ( WGUY.props.public_keys a), [ 'number', 'a_f' ]
  T?.eq ( WGUY.props.public_keys b), [ 'number', 'text', 'b_f', 'a_f' ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_get_prototype_chain = ( T, done ) ->
  WGUY = require '../../../apps/webguy'
  #.........................................................................................................
  class A
    a1: ->
    a2: ->
    a3: ->
  class B extends A
    b_1: ->
    b_2: ->
    b_3: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  o1  = {}
  o2  = new Object()
  a1  = []
  a1p = Object.getPrototypeOf a1
  b   = new B()
  bp  = Object.getPrototypeOf b
  bp1 = Object.getPrototypeOf bp
  T?.eq ( WGUY.props.get_prototype_chain A                ), [ A, ]
  T?.eq ( WGUY.props.get_prototype_chain B                ), [ B, A, ]
  T?.eq ( WGUY.props.get_prototype_chain ( b )            ), [ b, bp, bp1, ]
  T?.eq ( WGUY.props.get_prototype_chain ( b )::          ), []
  T?.eq ( WGUY.props.get_prototype_chain Object           ), [ Object, ]
  T?.eq ( WGUY.props.get_prototype_chain o1               ), [ o1, ]
  T?.eq ( WGUY.props.get_prototype_chain o2               ), [ o2, ]
  T?.eq ( WGUY.props.get_prototype_chain a1               ), [ a1, a1p, ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_walk_depth_first_properties = ( T, done ) ->
  WGUY      = require '../../../apps/webguy'
  { props } = WGUY
  #.........................................................................................................
  class A
    a1: ->
    a2: ->
    a3: ->
  class B extends A
    b_1: ->
    b_2: ->
    b_3: ->
  a = new A()
  b = new B()
  #.........................................................................................................
  urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B        )..., ]
  urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B::      )..., ]
  urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors new B()  )..., ]
  #.........................................................................................................
  urge '^3223^', ( k for [ k, d ] from props.walk_depth_first_property_descriptors props.acquire_depth_first { source: ( B:: ), } )
  done()
  return null

# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

#   #---------------------------------------------------------------------------------------------------------
#   [Symbol.iterator]: -> yield from @_transforms

#   #---------------------------------------------------------------------------------------------------------
#   _build: ->
#     chain = ( GUY.props.get_prototype_chain @ ).reverse()
#     for object in chain
#       for key from GUY.props.walk_keys object, { hidden: true, builtins: false, depth: 0, }
#         continue if key is 'constructor'
#         continue if key is 'length'
#         continue if key.startsWith '_'
#         @_transforms.push d for d from @_walk_values object[ key ]
#     return null

#   #---------------------------------------------------------------------------------------------------------
#   _walk_values: ( value ) ->
#     return yield new value() if @_types.isa.class value
#     #.......................................................................................................
#     if @_types.isa.function value
#       return yield value unless ( value.name.startsWith '$' ) or ( value.name.startsWith 'bound $' )
#       return yield value.call @
#     #.......................................................................................................
#     if @_types.isa.list value
#       for e in value
#         yield d for d from @_walk_values e
#       return null
#     #.......................................................................................................
#     return yield value


# xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

#===========================================================================================================
if require.main is module then do =>
  # test @
  # test @props_get_prototype_chain
  test @props_walk_depth_first_properties

