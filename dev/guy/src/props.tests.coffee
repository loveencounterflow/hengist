
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
types                     = new ( require '../../../apps/intertype' ).Intertype
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
@[ "GUY.props.Strict_proprietor 1" ] = ( T, done ) ->
  GUY     = require H.guy_path
  CAT     = require '../../../apps/multimix/lib/cataloguing'
  #.........................................................................................................
  class X extends GUY.props.Strict_proprietor
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
  #.........................................................................................................
  T?.eq ( x.has.prop_on_instance_1      ), true
  T?.eq ( x.has.prop_on_instance_2      ), true
  T?.eq ( x.has.prop_on_instance_3      ), true
  T?.eq ( x.has.foobar                  ), false
  T?.eq ( x.has[ Symbol.toStringTag ]   ), true
  #.........................................................................................................
  T?.eq ( x.has 'prop_on_instance_1'    ), true
  T?.eq ( x.has 'prop_on_instance_2'    ), true
  T?.eq ( x.has 'prop_on_instance_3'    ), true
  T?.eq ( x.has 'foobar'                ), false
  T?.eq ( x.has Symbol.toStringTag      ), true
  #.........................................................................................................
  T?.eq ( type_of x.has ), 'object'
  T?.eq ( type_of x.get ), 'function'
  urge '^067-1^', x
  urge '^067-2^', ( CAT.all_keys_of x ).sort().join '\n'
  urge '^067-3^', x.has
  urge '^067-4^', x.has 'foo'
  urge '^067-5^', x.has 'prop_on_instance_1'
  urge '^067-6^', x.has.foo
  urge '^067-7^', x.get
  try urge x.bar catch error then warn CND.reverse error.message
  T?.throws /X instance does not have property 'bar'/, => x.bar
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "GUY.props.Strict_proprietor 2" ] = ( T, done ) ->
  GUY     = require H.guy_path
  CAT     = require '../../../apps/multimix/lib/cataloguing'
  #.........................................................................................................
  class X extends GUY.props.Strict_proprietor
    prop_on_instance_1: 'prop_on_instance_1'
    get: 42
    has: 108
  #.........................................................................................................
  x = new X()
  T?.eq x.get, 42
  T?.eq x.has, 108
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # @[ "GUY.props.Strict_proprietor 1" ]()
  # test @[ "GUY.props.Strict_proprietor 1" ]
  @[ "GUY.props.Strict_proprietor 2" ]()
  test @[ "GUY.props.Strict_proprietor 2" ]


