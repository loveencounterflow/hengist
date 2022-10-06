
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
_GUY                      = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = _GUY.trm.get_loggers 'GUY/props/tests'
{ rpr
  inspect
  echo
  log     }               = _GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
H                         = require './helpers'
{ freeze }                = require 'letsfreezethat'
# types                     = new ( require '../../../apps/intertype' ).Intertype
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.pick_with_fallback()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { a: 1, b: 2, c: 3, },        null, [ 'a', 'c',     ], ], { a: 1, c: 3, } ]
    [ [ { foo: 'bar', baz: 'gnu', },  null, [ 'foo', 'wat', ], ], { foo: 'bar', wat: null } ]
    [ [ { foo: 'bar', baz: 'gnu', },  42,   [ 'foo', 'wat', ], ], { foo: 'bar', wat: 42 } ]
    [ [ { foo: null,  baz: 'gnu', },  42,   [ 'foo', 'wat', ], ], { foo: null, wat: 42 } ]
    [ [ {},  undefined, undefined, ], {} ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ d
        fallback
        keys      ] = probe
      # debug '^443^', { d, fallback, keys, }
      d_copy        = { d..., }
      if keys?
        result        = guy.props.pick_with_fallback d, fallback, keys...
      else
        result        = guy.props.pick_with_fallback d, fallback
      T?.eq d, d_copy
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.pluck_with_fallback()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { a: 1, b: 2, c: 3, },        null,  [ 'a', 'c',     ], { b: 2, },       ], { a: 1, c: 3, },           ]
    [ [ { foo: 'bar', baz: 'gnu', },  null,  [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: 'bar', wat: null }, ]
    [ [ { foo: 'bar', baz: 'gnu', },  42,    [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: 'bar', wat: 42 },   ]
    [ [ { foo: null,  baz: 'gnu', },  42,    [ 'foo', 'wat', ], { baz: 'gnu', }, ], { foo: null, wat: 42 },    ]
    [ [ {},                           null,  undefined,         {},              ], {},                        ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ d
        fallback
        keys
        d_changed ] = probe
      d_copy        = { d..., }
      if keys?
        result        = guy.props.pluck_with_fallback d, fallback, keys...
      else
        result        = guy.props.pluck_with_fallback d, fallback
      T?.eq d, d_changed
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.nullify_undefined()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ {}, {} ]
    [ null, {} ]
    [ undefined, {} ]
    [ { a: 1, b: 2, c: 3, }, { a: 1, b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: 3, }, { a: null, b: 2, c: 3, } ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d             = probe
      d_copy        = { d..., }
      result        = guy.props.nullify_undefined d
      T?.eq d, d_copy if d?
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.crossmerge()" ] = ( T, done ) ->
  GUY = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ { keys: {},               values: {},                                 }, {}                   ]
    [ { keys: { x: 42, },       values: { x: 108, },                        }, { x: 108, }          ]
    [ { keys: { a: 1, b: 2, },  values: { b: 3, c: 4, }, fallback: 'oops',  }, { a: 'oops', b: 3, } ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result        = GUY.props.crossmerge probe
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.omit_nullish()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  probes_and_matchers = [
    [ {}, {} ]
    [ null, {} ]
    [ undefined, {} ]
    [ { a: 1, b: 2, c: 3, }, { a: 1, b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: 3, }, { b: 2, c: 3, } ]
    [ { a: undefined, b: 2, c: null, }, { b: 2, } ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      d             = probe
      d_copy        = { d..., }
      result        = guy.props.omit_nullish d
      T?.eq d, d_copy if d?
      T?.ok ( d isnt result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.props.def(), .hide()" ] = ( T, done ) ->
  guy = require H.guy_path
  #.........................................................................................................
  do =>
    x = {}
    guy.props.def   x, 'foo', { enumerable: false, value: 42, }
    T?.eq ( rpr x ), '{}'
    T?.eq ( Object.getOwnPropertyDescriptor x, 'foo' ), { value: 42, writable: false, enumerable: false, configurable: false }
  do =>
    x = {}
    guy.props.hide  x, 'foo', 42
    T?.eq ( rpr x ), '{}'
    T?.eq ( Object.getOwnPropertyDescriptor x, 'foo' ), { value: 42, writable: true, enumerable: false, configurable: true, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.has()" ] = ( T, done ) ->
  GUY     = require H.guy_path
  T?.eq ( GUY.props.has null, 'xy'            ), false
  T?.eq ( GUY.props.has 42, 'xy'              ), false
  T?.eq ( GUY.props.has {}, 'xy'              ), false
  T?.eq ( GUY.props.has { xy: false, }, 'xy'  ), true
  #.........................................................................................................
  class X
    xy1: 'foo'
    xy2: undefined
    constructor: ->
      @xy3 = true
      GUY.props.def @, 'oops', get: -> throw new Error 'Oops'
      return undefined
  class Y extends X
  x = new X()
  y = new Y()
  T?.eq ( GUY.props.has x, 'xy1' ), true
  T?.eq ( GUY.props.has x, 'xy2' ), true
  T?.eq ( GUY.props.has x, 'xy3' ), true
  T?.eq ( GUY.props.has y, 'xy1' ), true
  T?.eq ( GUY.props.has y, 'xy2' ), true
  T?.eq ( GUY.props.has y, 'xy3' ), true
  T?.throws 'Oops', -> x.oops
  T?.eq ( GUY.props.has x, 'oops' ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_props_get = ( T, done ) ->
  GUY       = require H.guy_path
  fallback  = Symbol 'fallback'
  value     = Symbol 'value'
  debug '^334-1^', GUY.props.get {}, 'xy', undefined
  debug '^334-1^'; T?.eq ( GUY.props.get undefined, 'xy',  fallback  ), fallback
  debug '^334-2^'; T?.eq ( GUY.props.get null, 'xy',       fallback  ), fallback
  debug '^334-3^'; T?.eq ( GUY.props.get 42, 'xy',         fallback  ), fallback
  debug '^334-4^'; T?.eq ( GUY.props.get {}, 'xy',         fallback  ), fallback
  debug '^334-4^'; T?.eq ( GUY.props.get {}, 'xy',         undefined ), undefined
  debug '^334-5^'; T?.eq ( GUY.props.get { xy: value, }, 'xy'        ), value
  debug '^334-6^'; T?.throws /no such property/, -> GUY.props.get undefined, 'xy'
  debug '^334-6^'; T?.throws /expected 2 or 3 arguments, got 1/, -> GUY.props.get undefined
  debug '^334-6^'; T?.throws /no such property/, -> GUY.props.get {}, 'xy'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner 1" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  class X extends GUY.props.Strict_owner
    prop_on_instance_1: 'prop_on_instance_1'
    constructor: ->
      super()
      @prop_on_instance_2 = 'prop_on_instance_2'
      return undefined
  #.........................................................................................................
  x = new X()
  x.prop_on_instance_3 = 'prop_on_instance_3'
  T?.eq x.prop_on_instance_1, 'prop_on_instance_1'
  T?.eq x.prop_on_instance_2, 'prop_on_instance_2'
  T?.eq x.prop_on_instance_3, 'prop_on_instance_3'
  # #.........................................................................................................
  # T?.eq ( GUY.props.has.prop_on_instance_1 x      ), true
  # T?.eq ( GUY.props.has.prop_on_instance_2 x      ), true
  # T?.eq ( GUY.props.has.prop_on_instance_3 x      ), true
  # T?.eq ( GUY.props.has.foobar x                  ), false
  # T?.eq ( GUY.props.has[ Symbol.toStringTag ] x   ), true
  #.........................................................................................................
  T?.eq ( GUY.props.has x, 'prop_on_instance_1'    ), true
  T?.eq ( GUY.props.has x, 'prop_on_instance_2'    ), true
  T?.eq ( GUY.props.has x, 'prop_on_instance_3'    ), true
  T?.eq ( GUY.props.has x, 'foobar'                ), false
  #.........................................................................................................
  T?.eq ( GUY.props.has x, 'has' ), false
  T?.eq ( GUY.props.has x, 'get' ), false
  try urge x.bar catch error then warn _GUY.trm.reverse error.message
  T?.throws /X instance does not have property 'bar'/, => x.bar
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner 2" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  class X extends GUY.props.Strict_owner
    prop_on_instance_1: 'prop_on_instance_1'
    get: 42
    has: 108
  #.........................................................................................................
  x = new X()
  debug '^4458^', type_of x
  debug '^4458^', typeof x
  T?.eq x.get, 42
  T?.eq x.has, 108
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner can use Reflect.has" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  class X extends GUY.props.Strict_owner
    constructor: ->
      super()
      @prop_in_constructor = 'prop_in_constructor'
    prop_on_instance: 'prop_on_instance_1'
  #.........................................................................................................
  x = new X()
  debug '^4458^', x.prop_in_constructor
  debug '^4458^', x.prop_on_instance
  try x.no_such_prop catch error then warn _GUY.trm.reverse error.message
  T?.throws /X instance does not have property 'no_such_prop'/, -> x.no_such_prop
  T?.eq ( Reflect.has x, 'prop_in_constructor'  ), true
  T?.eq ( Reflect.has x, 'prop_on_instance'     ), true
  T?.eq ( Reflect.has x, 'no_such_prop'         ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner can use explicit target" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  f = ( x ) -> x * 2
  debug x = new GUY.props.Strict_owner { target: f, }
  debug '^4458^', type_of x
  debug '^4458^', typeof x
  debug x 42
  try urge x.bar catch error then warn _GUY.trm.reverse error.message
  T?.throws /Strict_owner instance does not have property 'bar'/, => x.bar
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner can disallow redefining keys" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  debug x = new GUY.props.Strict_owner { seal: true, }
  # x.foo   = 42
  T?.throws /Cannot define property foo, object is not extensible/, => x.foo = 42
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner can disallow reassining keys" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  d       = { a: 1, b: 2, d: 3, }
  x       = new GUY.props.Strict_owner { target: d, oneshot: true, }
  T?.throws /Strict_owner instance already has property 'a'/, => x.a = 42
  x.foo   = 42
  T?.throws /Strict_owner instance already has property 'foo'/, => x.foo = 42
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner can allows peeking for `.then`" ] = ( T, done ) ->
  GUY     = require H.guy_path
  #.........................................................................................................
  d       = { a: 1, b: 2, d: 3, }
  x       = new GUY.props.Strict_owner { target: d, oneshot: true, }
  debug x.then
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
demo_keys = ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  class A
    is_a: true
  class B extends A
    is_b: true
  class C extends B
    is_c: true
  class D extends C
    is_d: true
    constructor: ->
      super()
      @in_constructor = 's'
      return undefined
    in_declaration: 42
    instance_method_on_d: ->
    @class_method_on_D: ->
  #.........................................................................................................
  d = new D()
  d[ Symbol.for 'x' ] = 'x'
  GUY.props.hide d, 'hidden', 'hidden'
  n = Object.create null
  e = new SyntaxError null
  #.........................................................................................................
  urge '^3453-1^', ( Object.keys d    )                                                                      # 00:00 GUY/TESTS/PROPS  ?  ^3453-1^ [ 'in_constructor' ]
  urge '^3453-2^', ( ( k for k of d ) )                                                                      # 00:00 GUY/TESTS/PROPS  ?  ^3453-2^ [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: null"                                                                                 # 00:00 GUY/TESTS/PROPS  ▶  depth: null
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: null, } )                                      # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: null, symbols: true, } )                       # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: null, builtins: true, } )                      # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: null, hidden: true, } )                        # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 0"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 0
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 0, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 0, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x) ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 0, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 0, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 1"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 1
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 1, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 1, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 1, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 1, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 2"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 2
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 2, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 2, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 2, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 2, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 3"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 3
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 3, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 3, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 3, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 3, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 4"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 4
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 4, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 4, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 4, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 4, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #......................................................................................................... # 00:00 GUY/TESTS/PROPS  ▶
  info(); info "depth: 5"                                                                                    # 00:00 GUY/TESTS/PROPS  ▶  depth: 5
  urge '^3453-3^', "standard  ", ( GUY.props.keys d, { depth: 5, } )                                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-3^ standard   [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "symbols   ", ( GUY.props.keys d, { depth: 5, symbols: true, } )                          # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ symbols    [ 'in_constructor', Symbol(x), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  urge '^3453-5^', "builtins  ", ( GUY.props.keys d, { depth: 5, builtins: true, } )                         # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ builtins   [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
  urge '^3453-5^', "hidden    ", ( GUY.props.keys d, { depth: 5, hidden: true, } )                           # 00:00 GUY/TESTS/PROPS  ?  ^3453-5^ hidden     [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  lst = [ 'x', ]
  urge '^3453-6^', ( Object.keys lst    )
  urge '^3453-6^', ( ( k for k of lst ) )
  urge '^3453-6^', ( GUY.props.keys lst )
  urge '^3453-6^', ( GUY.props.keys lst, { symbols: true, builtins: true, } )
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.keys() works for all JS values, including null and undefined" ] = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  T?.throws /called on non-object/, -> GUY.props.keys null, { allow_any: false, }
  T?.throws /called on non-object/, -> GUY.props.keys 42,   { allow_any: false, }
  T?.eq ( GUY.props.keys 42         ), []
  T?.eq ( GUY.props.keys null       ), []
  T?.eq ( GUY.props.keys undefined  ), []
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.keys()" ] = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  class A
    is_a: true
  class B extends A
    is_b: true
  class C extends B
    is_c: true
  class D extends C
    is_d: true
    constructor: ->
      super()
      @in_constructor = 's'
      return undefined
    in_declaration: 42
    instance_method_on_d: ->
    @class_method_on_D: ->
  #.........................................................................................................
  d = new D()
  d[ Symbol.for 'x' ] = 'x'
  # y = Symbol 'y'; d[ y ] = y
  GUY.props.hide d, 'hidden', 'hidden'
  n = Object.create null
  e = new SyntaxError null
  #.........................................................................................................
  T?.eq ( Object.keys d    ), [ 'in_constructor' ]
  T?.eq ( ( k for k of d ) ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: null, symbols: true, builtins: true, } ), [ 'in_constructor', 'hidden', ( Symbol.for 'x' ), 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
  T?.eq ( GUY.props.keys d, { depth: null, symbols: true, hidden:   true, } ), [ 'in_constructor', 'hidden', ( Symbol.for 'x' ), 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: null, }                 ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: null, symbols: true, }  ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: null, builtins: true, } ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
  T?.eq ( GUY.props.keys d, { depth: null, hidden: true, }   ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 0, }                    ), [ 'in_constructor' ]
  T?.eq ( GUY.props.keys d, { depth: 0, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ) ]
  T?.eq ( GUY.props.keys d, { depth: 0, builtins: true, }    ), [ 'in_constructor', 'hidden' ]
  T?.eq ( GUY.props.keys d, { depth: 0, hidden: true, }      ), [ 'in_constructor', 'hidden' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 1, }                    ), [ 'in_constructor', 'is_d', 'in_declaration' ]
  T?.eq ( GUY.props.keys d, { depth: 1, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration' ]
  T?.eq ( GUY.props.keys d, { depth: 1, builtins: true, }    ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
  T?.eq ( GUY.props.keys d, { depth: 1, hidden: true, }      ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 2, }                    ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c' ]
  T?.eq ( GUY.props.keys d, { depth: 2, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration', 'is_c' ]
  T?.eq ( GUY.props.keys d, { depth: 2, builtins: true, }    ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
  T?.eq ( GUY.props.keys d, { depth: 2, hidden: true, }      ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 3, }                    ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  T?.eq ( GUY.props.keys d, { depth: 3, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  T?.eq ( GUY.props.keys d, { depth: 3, builtins: true, }    ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  T?.eq ( GUY.props.keys d, { depth: 3, hidden: true, }      ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 4, }                    ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: 4, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: 4, builtins: true, }    ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: 4, hidden: true, }      ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  T?.eq ( GUY.props.keys d, { depth: 5, }                    ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: 5, symbols: true, }     ), [ 'in_constructor', ( Symbol.for 'x' ), 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  T?.eq ( GUY.props.keys d, { depth: 5, builtins: true, }    ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a', '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'toString', 'valueOf', '__proto__', 'toLocaleString' ]
  T?.eq ( GUY.props.keys d, { depth: 5, hidden: true, }      ), [ 'in_constructor', 'hidden', 'constructor', 'instance_method_on_d', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
  #.........................................................................................................
  lst = [ 'x', ]
  T?.eq ( Object.keys lst    ), [ '0', ]
  T?.eq ( ( k for k of lst ) ), [ '0', ]
  T?.eq ( GUY.props.keys lst ), [ '0', ]
  T?.eq ( GUY.props.keys lst, { symbols: true, builtins: true, } ), [ '0', 'length', 'constructor', 'concat', 'copyWithin', 'fill', 'find', 'findIndex', 'lastIndexOf', 'pop', 'push', 'reverse', 'shift', 'unshift', 'slice', 'sort', 'splice', 'includes', 'indexOf', 'join', 'keys', 'entries', 'values', 'forEach', 'filter', 'flat', 'flatMap', 'map', 'every', 'some', 'reduce', 'reduceRight', 'toLocaleString', 'toString', 'at', 'findLast', 'findLastIndex', Symbol.iterator, Symbol.unscopables, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__' ]
  T?.eq ( GUY.props.keys Array, { symbols: true, builtins: true, } ), [ 'length', 'name', 'prototype', 'isArray', 'from', 'of', Symbol.species, 'arguments', 'caller', 'constructor', 'apply', 'bind', 'call', 'toString', Symbol.hasInstance, '__defineGetter__', '__defineSetter__', 'hasOwnProperty', '__lookupGetter__', '__lookupSetter__', 'isPrototypeOf', 'propertyIsEnumerable', 'valueOf', '__proto__', 'toLocaleString' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_props_xray = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  { Strict_owner
    hide
    keys
    xray  } = GUY.props
  #.........................................................................................................
  hs  = Symbol 'hidden_symbol'
  soc = Symbol 'Strict_owner_cfg'
  d   = new Strict_owner { oneshot: true, }
  hide d, 'a', 1
  hide d, 'b', 2
  hide d, 'c', 3
  hide d, hs, 4
  do =>
    e = { d..., }
    T?.eq ( rpr { d, e, } ), '{ d: Strict_owner {}, e: {} }'
    T?.eq d[ hs ], 4
    T?.eq e[ hs ], undefined
    return null
  do =>
    T?.eq ( rpr keys d, { hidden: true, symbols: true, builtins: false, } ), "[ 'a', 'b', 'c', Symbol(Strict_owner_cfg), Symbol(hidden_symbol), 'constructor' ]"
    T?.eq ( xray d ), { a: 1, b: 2, c: 3, constructor: Strict_owner, [hs]: 4, }
    return null
  do =>
    e             = []
    e.a           = 1
    e.b           = 2
    e.c           = 3
    e[ hs ]       = 4
    e.constructor = Strict_owner
    debug e
    T?.eq ( xray d, [] ), e
    return null
  do =>
    T?.eq ( xray [ 1, 2, 3, ] ), { '0': 1, '1': 2, '2': 3, length: 3 }
    T?.eq ( xray [ 1, 2, 3, ], [] ), [ 1, 2, 3, ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_props_locking = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  { Strict_owner
    hide
    keys
    xray  } = GUY.props
  #.........................................................................................................
  do =>
    class X extends Strict_owner
      constructor: ( cfg ) ->
        super cfg
        @a  = 1
        @b  = 2
    x = new X()
    T?.throws /X instance does not have property 'c'/, -> x.c
    T?.throws /X instance does not have property 'get_locked'/, -> x.get_locked
    T?.eq ( Strict_owner.get_locked x ), true
    T?.eq ( Strict_owner.set_locked x, false ), false
    T?.eq x.c, undefined
  #.........................................................................................................
  do =>
    target  = [ 1, 2, 3, ]
    x       = new Strict_owner { target, }
    T?.eq x[ 0 ], 1
    T?.eq x[ 1 ], 2
    T?.throws /Strict_owner instance does not have property '3'/, -> x[ 3 ]
    T?.throws /Strict_owner instance does not have property 'get_locked'/, -> x.get_locked
    T?.eq ( Strict_owner.get_locked x ), true
    T?.eq ( Strict_owner.set_locked x, false ), false
    T?.eq x.c, undefined
  #.........................................................................................................
  do =>
    class X extends Strict_owner
      constructor: ( cfg ) ->
        cfg         = { freeze: false, seal: false, cfg..., }
        { freeze
          seal    } = cfg
        cfg.freeze  = false
        cfg.seal    = false
        super cfg
        @a          = 1
        @b          = 2
        Object.freeze @ if freeze
        Object.seal   @ if seal
        return undefined
    x = new X { freeze: true, }
    T?.throws /X instance does not have property 'c'/, -> x.c
    T?.throws /X instance does not have property 'get_locked'/, -> x.get_locked
    T?.eq ( Strict_owner.get_locked x ), true
    T?.eq ( Strict_owner.set_locked x, false ), false
    T?.eq x.c, undefined
  #.........................................................................................................
  do =>
    target  = [ 1, 2, 3, ]
    x       = new Strict_owner { target, freeze: true, }
    T?.eq x[ 0 ], 1
    T?.eq x[ 1 ], 2
    T?.throws /Strict_owner instance does not have property '3'/, -> x[ 3 ]
    T?.throws /Strict_owner instance does not have property 'get_locked'/, -> x.get_locked
    T?.eq ( Strict_owner.get_locked x ), true
    T?.eq ( Strict_owner.set_locked x, false ), false
    T?.eq x.c, undefined
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
demo_tree = ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  d           = { a: [ 0, 1, 2, ], e: { g: { some: 'thing', }, h: 42, h: null, }, empty: {}, }
  x           = Object.create d
  rcrsv       = { somekey: { subkey: 'somevalue', }, }
  rcrsv.rcrsv = rcrsv
  #.........................................................................................................
  do =>
    for o in [ d, x, rcrsv, ]
      whisper '————————————————————————————————————————————————————————————'
      whisper o
      whisper cfg = {}
      for path in GUY.props.tree o, cfg
        praise '^453^', rpr path
    return null
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    evaluate = ({ owner, key, value, }) ->
      return 'take' unless isa.object value
      return 'take' unless GUY.props.has_any_keys value
      return 'descend'
    whisper cfg = { evaluate, }
    for path in GUY.props.tree d, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    evaluate = ({ owner, key, value, }) ->
      return 'take' unless isa.object value
      return 'take' unless GUY.props.has_any_keys value
      return 'descend'
    whisper cfg = { evaluate, joiner: '.', }
    for path in GUY.props.tree d, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    whisper GUY.props.keys d, { depth: 0, }
    whisper GUY.props.keys x, { depth: 0, }
    whisper GUY.props.keys x, { depth: 1, }
    whisper GUY.props.keys rcrsv, { depth: 1, }
    whisper cfg = { joiner: '.', depth: null, }
    for path in GUY.props.tree x, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    whisper rcrsv
    whisper cfg = { depth: 0, joiner: '.', symbols: true, hidden: true, builtins: true, }
    for path from GUY.props.tree rcrsv, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  return null


#-----------------------------------------------------------------------------------------------------------
demo_tree_readme = ->
  GUY           = require H.guy_path
  log           = console.log
  { inspect, }  = require 'util'
  d = { a: [ 0, 1, 2, ], e: { g: { some: 'thing', }, h: 42, h: null, }, empty: {}, }
  urge '—————————————————————————————————————————————————————————————'
  for path in GUY.props.tree d
    log inspect path
  urge '—————————————————————————————————————————————————————————————'
  for path in GUY.props.tree d, { joiner: '.', }
    log inspect path
  urge '—————————————————————————————————————————————————————————————'
  evaluate = ({ owner, key, value, }) ->
    return 'take' if Array.isArray value
    return 'take' unless GUY.props.has_any_keys value
    return 'descend'
  for path in GUY.props.tree d, { evaluate, joiner: '.', }
    log inspect path
  urge '—————————————————————————————————————————————————————————————'
  return null

#-----------------------------------------------------------------------------------------------------------
demo_strict_owner_with_proxy = ->
  GUY           = require H.guy_path
  class X extends GUY.props.Strict_owner
    constructor: ->
      super()
      # return new Proxy @,
      #   get:      ( t, k ) => debug GUY.trm.reverse GUY.trm.steel '^323^', rpr k; t[ k ]
      #   ownKeys:  ( t ) => debug '^323^', 'ownKeys()'; Reflect.ownKeys t
      #   getOwnPropertyDescriptor: ( t, k ) => debug '^323^', 'getOwnPropertyDescriptor()'; { configurable: true, enumerable: true, }
      return undefined
  t = new X()
  console.log '^323423^', t.toString()
  console.log '^323423^', t
  console.log '^323423^', rpr t
  info ( require 'util' ).inspect t, { depth: 0, }
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_props_resolve_property_chain = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  owner           = { first: { second: { other: { last: 42, }, }, }, }
  property_chain  = [ 'first', 'second', 'other', 'last', ]
  T?.eq ( GUY.props.resolve_property_chain owner, property_chain ), 42
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
demo_seal_freeze = ->
  GUY       = require '../../../apps/guy'
  do =>
    d   = { x: 42, }
    # dso = new GUY.props.Strict_owner { target: d, seal: true, freeze: true, }
    # dso = new GUY.props.Strict_owner { target: d, seal: true, freeze: false, }
    dso = new GUY.props.Strict_owner { target: d, seal: false, freeze: true, }
    dso.x
    try dso.y               catch error then warn '^424-1^', GUY.trm.reverse error.message
    try dso.x = 48          catch error then warn '^424-2^', GUY.trm.reverse error.message
    try dso.y = 'something' catch error then warn '^424-3^', GUY.trm.reverse error.message
  do =>
    d         = { x: 42, }
    dso       = new GUY.props.Strict_owner { target: d, oneshot: true, }
    dso.xy    = new GUY.props.Strict_owner { target: { foo: 'bar', }, freeze: true, }
    # dso.x     = 123     # Strict_owner instance already has property 'x'
    # dso.xy    = {}      # Strict_owner instance already has property 'xy'
    # dso.xy.foo  = 'gnu' # TypeError: Cannot assign to read only property 'foo'
    debug '^35345^', dso  # { x: 42, xy: { foo: 'bar' } }
    debug '^35345^', d    # { x: 42, xy: { foo: 'bar' } }
    d.x = 123
    debug '^35345^', dso  # { x: 123, xy: { foo: 'bar' } }
    debug '^35345^', d    # { x: 123, xy: { foo: 'bar' } }
  return null






############################################################################################################
if require.main is module then do =>
  # test @
  # demo_tree()
  # demo_tree_readme()
  # @[ "guy.props.crossmerge()" ]()
  # test @[ "guy.props.crossmerge()" ]
  # test @[ "GUY.props.keys() works for all JS values, including null and undefined" ]
  # demo_keys()
  # @[ "GUY.props.keys()" ]()
  # test @[ "GUY.props.keys()" ]
  # @[ "GUY.props.Strict_owner 1" ]()
  # test @[ "GUY.props.Strict_owner 1" ]
  # @[ "GUY.props.has()" ]()
  # test @[ "GUY.props.has()" ]
  # @GUY_props_get()
  # test @GUY_props_get
  # @GUY_props_xray()
  # test @GUY_props_xray
  @GUY_props_locking()
  test @GUY_props_locking
  # @[ "GUY.props.Strict_owner 2" ]()
  # test @[ "GUY.props.Strict_owner 2" ]
  # test @[ "GUY.props.Strict_owner can use explicit target" ]
  # @[ "GUY.props.Strict_owner can use Reflect.has" ]()
  # test @[ "GUY.props.Strict_owner can use Reflect.has" ]
  # test @[ "GUY.props.Strict_owner can disallow redefining keys" ]
  # @[ "GUY.props.Strict_owner can disallow reassining keys" ]()
  # test @[ "GUY.props.Strict_owner can disallow reassining keys" ]
  # demo_strict_owner_with_proxy()
  # demo_seal_freeze()
