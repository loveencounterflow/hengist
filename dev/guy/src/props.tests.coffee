
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/PROPS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
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
  try urge x.bar catch error then warn CND.reverse error.message
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
  try x.no_such_prop catch error then warn CND.reverse error.message
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
  try urge x.bar catch error then warn CND.reverse error.message
  T?.throws /Strict_owner instance does not have property 'bar'/, => x.bar
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
  GUY.props.hide d, 'hidden', 'hidden'
  n = Object.create null
  e = new SyntaxError null
  #.........................................................................................................
  T?.eq ( Object.keys d    ), [ 'in_constructor' ]
  T?.eq ( ( k for k of d ) ), [ 'in_constructor', 'is_d', 'in_declaration', 'is_c', 'is_b', 'is_a' ]
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
  done?()







############################################################################################################
if require.main is module then do =>
  # test @
  demo_keys()
  @[ "GUY.props.keys()" ]()
  test @[ "GUY.props.keys()" ]
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


