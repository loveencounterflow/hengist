

'use strict'

GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'intertalk'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
test                      = require 'guy-test'
#-----------------------------------------------------------------------------------------------------------
s                         = ( name ) -> Symbol.for  name
ps                        = ( name ) -> Symbol      name


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

#===========================================================================================================
isa_object = ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
as_object = ( x ) ->
  return x unless isa_object x
  R       = {}
  R[ k ]  = as_object v for k, v of x
  return R

#===========================================================================================================
throws = ( T, matcher, f ) ->
  await do =>
    error = null
    try await f() catch error
      warn '^992-1^', reverse error.message
      T?.eq error.message, matcher
    T?.ok error?
  return null

#===========================================================================================================
try_and_show = ( T, f ) ->
  e = null
  try ( urge '^992-2^', f() ) catch e then help '^992-3^', reverse "try_and_show: #{rpr e.message}"
  unless e?
    warn '^992-3^', reverse "expected an error but none was thrown"
    T.fail "^992-3^ expected an error but none was thrown"
  return null

#===========================================================================================================
@interface = ( T, done ) ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  T?.eq ( isa.function      IT.on       ), true
  T?.eq ( isa.function      IT.on_any   ), false
  T?.eq ( isa.asyncfunction IT.emit     ), true
  T?.eq ( IT.emit 'what' )?.constructor?.name, 'Promise'
  T?.ok ( await IT.emit 'what' ) instanceof Results
  T?.eq ( isa.function      IT.on 'foo', ( ( note ) -> )      ), true
  #.........................................................................................................
  done?()

#===========================================================================================================
@WeakMap_replacement = ( T, done ) ->
  WeakMapShim = require 'weak-map'
  # urge '^343^', ( k for k in Object.keys require.cache when /intertalk/.test k ) #[ 'intertalk' ]
  purge_require_cache_entry_for_intertalk = ->
    for k in Object.keys require.cache when /\/intertalk\/lib\/main.js/.test k
      delete require.cache[ k ]
    return null
  #.........................................................................................................
  try
    original_WeakMap = globalThis.WeakMap
    warn '^423-1^', '(OK)', reverse "temporarily removing WeakMap"
    delete globalThis.WeakMap
    try WeakMap catch error then help '^423-2^', '(OK)', reverse error.message
    #.......................................................................................................
    do =>
      ### make sure our WeakMap shim works as expected ###
      debug '^423-3^', wm = new WeakMapShim()
      key = s'key'
      try_and_show T, -> wm.set 'abc', 'data-abc'
      try_and_show T, -> wm.set key, 'data-abc'
      T?.throws 'Invalid value used as weak map key', -> wm.set 'abc', 'data-abc'
      T?.throws 'Invalid value used as weak map key', -> wm.set key, 'data-abc'
      return null
    #.......................................................................................................
    do =>
      ### make sure INTERTALK_LIB works in absence of WeakMap ###
      purge_require_cache_entry_for_intertalk()
      INTERTALK_LIB = require '../../../apps/intertalk'
      { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
      debug '^423-4^', IT.listeners
      T?.ok IT.listeners instanceof Map
      return null
    #.......................................................................................................
  finally
    ### ensure reset works so other tests will not be affected ###
    help '^423-5^', '(OK)', reverse "resetting WeakMap"
    globalThis.WeakMap = original_WeakMap
    help '^423-6^', '(OK)', reverse WeakMap
  #.........................................................................................................
  done?()

#===========================================================================================================
@event_emitting_1 = ( T, done ) ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  IT.on 'sum', on_sum = ( e ) -> new Promise ( resolve ) -> setTimeout ( -> resolve e.a + e.b ), 100
  IT.on 'mul', on_mul = ( e ) -> new Promise ( resolve ) -> setTimeout ( -> resolve e.a * e.b ), 100
  #.........................................................................................................
  ### NOTE call to `as_object()` not strictly necessary as the underlying `equals()` method does work with
  the custom types we're using (`Results` and `Note`), but that's a flaw in the algorithm so
  let's try to write it the correct way: ###
  T?.eq ( as_object await IT.emit 'sum', { a: 100, b: 200, } ), { '$key': '$results', note: { '$key': 'sum', a: 100, b: 200 }, results: [ 300 ] }
  T?.eq ( as_object await IT.emit 'mul', { a: 100, b: 200, } ), { '$key': '$results', note: { '$key': 'mul', a: 100, b: 200 }, results: [ 20000 ] }
  #.........................................................................................................
  done?()

#===========================================================================================================
@type_validation = ( T, done ) ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  await throws T, 'expected 1 or 2 arguments, got 5',           ( -> await IT.emit 'double', 3, 4, 5, 6   )
  await throws T, 'expected 1 or 2 arguments, got 3',           ( -> await IT.emit 'foo', 3, [ 4, 5, 6, ] )
  await throws T, 'expected 2 arguments, got 0',                ( -> IT.on() )
  await throws T, 'expected 2 arguments, got 1',                ( -> IT.on 4 )
  await throws T, 'expected a event_key, got a number',         ( -> IT.on 4, 5 )
  await throws T, 'expected a event_key, got a number',         ( -> IT.on 4, -> )
  await throws T, 'expected 2 arguments, got 1',                ( -> IT.on s'abc' )
  await throws T, 'expected 2 arguments, got 3',                ( -> IT.on s'abc', ( -> ), 9 )
  await throws T, 'expected 2 arguments, got 3',                ( -> IT.on 'abc', {}, 9 )
  await throws T, 'expected event_listener for object property \'on_abc\', got a undefined', ( -> IT.on 'abc', {} )
  await throws T, 'expected event_listener for object property \'on_abc\', got a undefined', ( -> IT.on s'abc', {} )
  await throws T, 'expected 1 or 2 arguments, got 0',           ( -> new Datom() )
  await throws T, 'expected a event_key, got a number',         ( -> new Datom 42 )
  await throws T, 'expected a event_key, got a object',         ( -> new Datom null )
  await throws T, 'expected a event_key, got a undefined',      ( -> new Datom undefined )
  #.........................................................................................................
  done?()

#===========================================================================================================
@event_emitting_3 = ( T, done ) ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  receiver =
    on_square:      ( note ) -> info '^992-4^', note; note.$value ** 2
    on_cube:        ( note ) -> info '^992-5^', note; note.$value ** 3
    on_double:      ( note ) -> info '^992-6^', note; note.$value *  2
    on_any:         ( note ) -> info '^992-7^', note
    on_cube_symbol: ( note ) -> info '^992-8^', note; note.$value ** 3
  #.........................................................................................................
  IT.on 'square',   receiver
  IT.on 'double',   receiver
  IT.on 'cube',     receiver.on_cube
  IT.on s'cube',    receiver.on_cube
  # IT.on_any,        receiver.on_any
  #.........................................................................................................
  # urge '^992-9^', IT
  # urge '^992-10^', IT.key_symbols[ 'square' ]
  # urge '^992-11^', IT.listeners
  # urge '^992-12^', IT.listeners.get IT.key_symbols[ 'square' ]
  f = ->
    urge '^992-13^', await IT.emit            'square', 11
    urge '^992-14^', await IT.emit            'double', 12
    urge '^992-15^', await IT.emit            'cube',   13
    urge '^992-16^', await IT.emit new Note  'cube',   14
    urge '^992-17^', await IT.emit new Note  s'cube',  14
    ### TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: ###
    try ( urge '^992-18^', await IT.emit 'double', 3, 4, 5, 6      ) catch e then warn '^992-19^', reverse e.message
    try ( urge '^992-20^', await IT.emit 'foo', 3, [ 4, 5, 6, ] ) catch e then warn '^992-21^', reverse e.message
    urge '^992-22^', await IT.emit 'foo', [ 3, 4, 5, 6, ]
  #.........................................................................................................
  done?()

#===========================================================================================================
demo_1 = ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  receiver =
    on_square:      ( note ) -> info '^992-23^', note; note.$value ** 2
    on_cube:        ( note ) -> info '^992-24^', note; note.$value ** 3
    on_double:      ( note ) -> info '^992-25^', note; note.$value *  2
    on_any:         ( note ) -> info '^992-26^', note
    on_cube_symbol: ( note ) -> info '^992-27^', note; note.$value ** 3
  IT.on 'square',   receiver
  IT.on 'double',   receiver
  IT.on 'cube',     receiver.on_cube
  IT.on s'cube',    receiver.on_cube
  IT.on '*',        receiver.on_any
  # urge '^992-28^', IT
  # urge '^992-29^', IT.key_symbols[ 'square' ]
  # urge '^992-30^', IT.listeners
  # urge '^992-31^', IT.listeners.get IT.key_symbols[ 'square' ]
  urge '^992-32^', await IT.emit            'square', 11
  urge '^992-33^', await IT.emit            'double', 12
  urge '^992-34^', await IT.emit            'cube',   13
  urge '^992-35^', await IT.emit new Note  'cube',   14
  urge '^992-36^', await IT.emit new Note  s'cube',  14
  ### TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: ###
  try ( urge '^992-37^', await IT.emit 'double', 3, 4, 5, 6      ) catch e then warn '^992-38^', reverse e.message
  try ( urge '^992-39^', await IT.emit 'foo', 3, [ 4, 5, 6, ] ) catch e then warn '^992-40^', reverse e.message
  urge '^992-41^', await IT.emit 'foo', [ 3, 4, 5, 6, ]
  return null

#===========================================================================================================
demo_2 = ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  #.........................................................................................................
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  class A
  class B extends Object
  urge '^992-42^', A
  urge '^992-43^', A.freeze
  urge '^992-44^', new A()
  urge '^992-45^', B
  urge '^992-46^', new B()
  urge '^992-47^', isa.object A
  urge '^992-48^', isa.object B
  urge '^992-49^', isa.object new A()
  urge '^992-50^', isa.object new B()
  try new Datom()     catch e then warn '^992-51^', reverse e.message
  try new Datom 5     catch e then warn '^992-52^', reverse e.message
  try new Datom null  catch e then warn '^992-53^', reverse e.message
  try new Datom {}    catch e then warn '^992-54^', reverse e.message
  urge '^992-55^', new Datom 'foo'
  urge '^992-56^', new Datom 'foo', null
  urge '^992-57^', new Datom 'foo', undefined
  urge '^992-58^', new Datom 'foo', 56
  urge '^992-59^', new Datom 'foo', { bar: 56, }
  urge '^992-60^', new Datom 'foo', { bar: 56, $key: 'other', }
  urge '^992-61^', new Datom s'foo', { bar: 56, $key: 'other', }
  urge '^992-62^', new Datom { bar: 56, $key: 'other', }
  urge '^992-63^', new Datom { bar: 56, $key: 'other', $freeze: false, }
  urge '^992-64^', new Datom { bar: 56, $key: 'other', $freeze: true, }
  urge '^992-65^', new Datom { bar: 56, $key: 'other', $freeze: null, }
  urge '^992-66^', new Datom 'something', { $freeze: false, }
  urge '^992-67^', new Datom 'something', { $freeze: true,  }
  urge '^992-68^', new Datom 'something', { $freeze: null,  }
  #.........................................................................................................
  ### must set `{ $freeze: false, }` explicitly else datom will be (superficially) frozen: ###
  do =>
    d = new Datom 'o', { $freeze: false, }
    d.p = 7
    urge '^992-69^', d
    return null
  #.........................................................................................................
  ### passing in an existing datom (or note) `d` into `new Datom d` (or `new Note d`) results in a copy
  of `d`: ###
  do =>
    d = new Datom 'o', { $freeze: false, }
    e = new Datom d
    urge '^992-70^', d, e, d is e
    return null
  #.........................................................................................................
  ### events are just `Datom`s: ###
  urge '^992-71^', new Note s'foo', { bar: 56, }
  #.........................................................................................................
  ### calls to `emit` are just calls to `new Note()`: ###
  await do =>
    IT.on 'myevent', ( note ) -> info '^992-72^', note; note.n ** 2
    help '^992-73^', await IT.emit 'myevent', { n: 16, }
    return null
  #.........................................................................................................
  return null

#===========================================================================================================
demo_3 = ->
  INTERTALK_LIB = require '../../../apps/intertalk'
  { IT, Intertalk, Note, Results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK_LIB
  #.........................................................................................................
  IT.on 'abc', {}
  #.........................................................................................................
  return null


#===========================================================================================================
if module is require.main then await do =>
  # await demo_1()
  # await demo_2()
  # await demo_3()
  # await test @WeakMap_replacement
  await test @






