
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
@props_walk_depth_first_property_descriptors = ( T, done ) ->
  WGUY      = require '../../../apps/webguy'
  { props } = WGUY
  #.........................................................................................................
  a1  = ->
  a2  = ->
  a3  = ->
  b_1 = ->
  b_2 = ->
  b_3 = ->
  #.........................................................................................................
  class A
    a1: a1
    a2: a2
    a3: a3
    c:  'declared in A'
  class B extends A
    b_1: b_1
    b_2: b_2
    b_3: b_3
    c:  'declared in B'
  a = new A()
  b = new B()
  #.........................................................................................................
  # urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B        )..., ]
  # urge '^3223^', x for x in [ ( props.walk_depth_first_property_descriptors B::  )..., ]
  T?.eq ( [ d.key, d.descriptor, ] for d from props.walk_depth_first_property_descriptors B:: ), [
    [ 'a1', { value: a1, writable: true, enumerable: true, configurable: true } ]
    [ 'a2', { value: a2, writable: true, enumerable: true, configurable: true } ]
    [ 'a3', { value: a3, writable: true, enumerable: true, configurable: true } ]
    [ 'c', { value: 'declared in A', writable: true, enumerable: true, configurable: true } ]
    [ 'b_1', { value: b_1, writable: true, enumerable: true, configurable: true } ]
    [ 'b_2', { value: b_2, writable: true, enumerable: true, configurable: true } ]
    [ 'b_3', { value: b_3, writable: true, enumerable: true, configurable: true } ]
    [ 'c', { value: 'declared in B', writable: true, enumerable: true, configurable: true } ]
    ]
  T?.eq ( [ d.key, d.descriptor, ] for d from props.walk_depth_first_property_descriptors new B() ), [
    [ 'a1', { value: a1, writable: true, enumerable: true, configurable: true } ]
    [ 'a2', { value: a2, writable: true, enumerable: true, configurable: true } ]
    [ 'a3', { value: a3, writable: true, enumerable: true, configurable: true } ]
    [ 'c', { value: 'declared in A', writable: true, enumerable: true, configurable: true } ]
    [ 'b_1', { value: b_1, writable: true, enumerable: true, configurable: true } ]
    [ 'b_2', { value: b_2, writable: true, enumerable: true, configurable: true } ]
    [ 'b_3', { value: b_3, writable: true, enumerable: true, configurable: true } ]
    [ 'c', { value: 'declared in B', writable: true, enumerable: true, configurable: true } ]
    ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_acquire_depth_first = ( T, done ) ->
  WGUY      = require '../../../apps/webguy'
  { props } = WGUY
  #.........................................................................................................
  a1  = ->
  a2  = ->
  a3  = ->
  b_1 = ->
  b_2 = ->
  b_3 = ->
  #.........................................................................................................
  class A
    a1: a1
    a2: a2
    a3: a3
    c:  'declared in A'
  class B extends A
    b_1: b_1
    b_2: b_2
    b_3: b_3
    c:  'declared in B'
  a = new A()
  b = new B()
  #.........................................................................................................
  do =>
    result = ( props.acquire_depth_first ( B:: ), { descriptor: { enumerable: true, }, overwrite: true, } )
    T?.eq ( k for k of result ), [ 'a1', 'a2', 'a3', 'c', 'b_1', 'b_2', 'b_3' ]
    T?.eq result, { a1, a2, a3, c: 'declared in B', b_1, b_2, b_3, }
    T?.ok result.a1 is a1
    return null
  #.........................................................................................................
  do =>
    T?.throws /duplicate key 'c'/, ->
      ( props.acquire_depth_first ( B:: ), { descriptor: { enumerable: true, }, overwrite: false, } )
    return null
  #.........................................................................................................
  do =>
    result = ( props.acquire_depth_first ( B:: ), { descriptor: { enumerable: false, }, overwrite: true, } )
    T?.eq ( k for k of result ), []
    T?.eq result, {}
    T?.ok result.a1 is a1
    return null
  #.........................................................................................................
  do =>
    result = ( props.acquire_depth_first ( B:: ), { descriptor: { enumerable: true, }, overwrite: 'ignore', } )
    T?.eq ( k for k of result ), [ 'a1', 'a2', 'a3', 'c', 'b_1', 'b_2', 'b_3' ]
    T?.eq result, { a1, a2, a3, c: 'declared in A', b_1, b_2, b_3, }
    T?.ok result.a1 is a1
    return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@props_acquire_depth_first_with_generated_properties = ( T, done ) ->
  WGUY      = require '../../../apps/webguy'
  { props } = WGUY
  #.........................................................................................................
  add_1 = ( a, b = 1 ) -> a + b
  mul_1 = ( a, b = 1 ) -> a * b
  #.........................................................................................................
  class A
    add_1:  add_1
    mul_1:  mul_1
  #.........................................................................................................
  do =>
    generate = ({ target, owner, key, descriptor, }) ->
      T?.ok target is mytarget
      method = descriptor.value = props.nameit key, descriptor.value.bind target
      yield { key, descriptor, }
      return null unless key.endsWith '_1'
      #.....................................................................................................
      for n in [ 2, 3, ]
        subkey  = key[ ... key.length - 1 ] + "#{n}"
        value   = do ( n ) =>
          f = ( a, b = n ) -> method a, b
          return props.nameit subkey, f.bind target
        #...................................................................................................
        yield { key: subkey, descriptor: { descriptor..., value, }, }
      return null
    #.......................................................................................................
    mytarget  = {}
    cfg       =
      target:       mytarget
      descriptor:   { enumerable: true, }
      generate:     generate
    result    = props.acquire_depth_first ( A:: ), cfg
    #.......................................................................................................
    T?.ok ( Object.getOwnPropertyDescriptor A::,    'add_1' ).enumerable, false
    T?.ok ( Object.getOwnPropertyDescriptor result, 'add_1' ).enumerable, true
    T?.ok ( Object.getOwnPropertyDescriptor result, 'add_2' ).enumerable, true
    T?.ok ( Object.getOwnPropertyDescriptor result, 'add_3' ).enumerable, true
    T?.ok result is mytarget
    T?.ok isa.function result.add_1
    T?.ok isa.function result.add_2
    T?.ok isa.function result.add_3
    T?.ok isa.function result.mul_1
    T?.ok isa.function result.mul_2
    T?.ok isa.function result.mul_3
    T?.eq ( result.add_1 7 ), 8
    T?.eq ( result.add_2 7 ), 9
    T?.eq ( result.add_3 7 ), 10
    T?.eq ( result.mul_1 7 ), 7
    T?.eq ( result.mul_2 7 ), 14
    T?.eq ( result.mul_3 7 ), 21
    T?.eq ( result.add_1.name ), 'add_1'
    T?.eq ( result.add_2.name ), 'add_2'
    T?.eq ( result.add_3.name ), 'add_3'
    T?.eq ( result.mul_1.name ), 'mul_1'
    T?.eq ( result.mul_2.name ), 'mul_2'
    T?.eq ( result.mul_3.name ), 'mul_3'
    # T?.eq ( k for k of result ), [ 'a1', 'a2', 'a3', 'c', 'b_1', 'b_2', 'b_3' ]
    # T?.eq result, { a1, a2, a3, c: 'declared in A', b_1, b_2, b_3, }
    # T?.ok result.a1 is a1
    return null
  #.........................................................................................................
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
  test @props_acquire_depth_first_with_generated_properties
  # test @props_get_prototype_chain
  # test @props_walk_depth_first_property_descriptors
  # test @props_acquire_depth_first
