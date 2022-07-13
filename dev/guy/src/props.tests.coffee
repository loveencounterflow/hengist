
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
    T?.eq ( Object.getOwnPropertyDescriptor x, 'foo' ), { value: 42, writable: false, enumerable: false, configurable: false }
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
@[ "GUY.props.get()" ] = ( T, done ) ->
  GUY       = require H.guy_path
  fallback  = Symbol 'fallback'
  value     = Symbol 'value'
  T?.eq ( GUY.props.get undefined, 'xy',  fallback  ), fallback
  T?.eq ( GUY.props.get null, 'xy',       fallback  ), fallback
  T?.eq ( GUY.props.get 42, 'xy',         fallback  ), fallback
  T?.eq ( GUY.props.get {}, 'xy',         fallback  ), fallback
  T?.eq ( GUY.props.get { xy: value, }, 'xy'        ), value
  T?.throws /no such property/, -> GUY.props.get undefined, 'xy'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_owner 1" ] = ( T, done ) ->
  GUY     = require H.guy_path
  CAT     = require '../../../apps/multimix/lib/cataloguing'
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
  debug x = new GUY.props.Strict_owner { reset: false, }
  x.foo   = 42
  T?.throws /Strict_owner instance already has property 'foo'/, => x.foo = 42
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
  T?.throws /called on non-object/, -> GUY.props.keys null
  T?.throws /called on non-object/, -> GUY.props.keys 42
  T?.eq ( GUY.props.keys 42,         { allow_any: true, } ), []
  T?.eq ( GUY.props.keys null,       { allow_any: true, } ), []
  T?.eq ( GUY.props.keys undefined,  { allow_any: true, } ), []
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
demo_tree = ->
  GUY       = require '../../../apps/guy'
  #.........................................................................................................
  d = { a: [ 0, 1, 2, ], e: { g: { some: 'thing', }, h: 42, h: null, }, empty: {}, }
  debug d
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    whisper cfg = {}
    for path in GUY.props.tree d, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  do =>
    whisper '————————————————————————————————————————————————————————————'
    evaluate = ({ owner, key, value, }) ->
      return 'take' unless isa.object value
      return 'take' unless GUY.props.has_keys value
      return 'descend'
    whisper cfg = { evaluate, }
    for path in GUY.props.tree d, cfg
      praise '^453^', rpr path
    return null
  #.........................................................................................................
  return null






############################################################################################################
if require.main is module then do =>
  # test @
  demo_tree()
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
  # @[ "GUY.props.get()" ]()
  # test @[ "GUY.props.get()" ]
  # @[ "GUY.props.Strict_owner 2" ]()
  # test @[ "GUY.props.Strict_owner 2" ]
  # test @[ "GUY.props.Strict_owner can use explicit target" ]
  # @[ "GUY.props.Strict_owner can use Reflect.has" ]()
  # test @[ "GUY.props.Strict_owner can use Reflect.has" ]
  # test @[ "GUY.props.Strict_owner can disallow redefining keys" ]


