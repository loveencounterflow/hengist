

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


############################################################################################################
#
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


############################################################################################################
#
#===========================================================================================================
demo_1 = ->
  { Intertalk } = require '../../../apps/intertalk'
  itk           = new Intertalk()
  #.........................................................................................................
  receiver =
    on_square:      ( note ) -> info '^992-23^', note; note.$value ** 2
    on_cube:        ( note ) -> info '^992-24^', note; note.$value ** 3
    on_double:      ( note ) -> info '^992-25^', note; note.$value *  2
    on_any:         ( note ) -> info '^992-26^', note
    on_cube_symbol: ( note ) -> info '^992-27^', note; note.$value ** 3
  itk.on 'square',   receiver
  itk.on 'double',   receiver
  itk.on 'cube',     receiver.on_cube
  itk.on s'cube',    receiver.on_cube
  itk.on '*',        receiver.on_any
  # urge '^992-28^', itk
  # urge '^992-29^', itk.key_symbols[ 'square' ]
  # urge '^992-30^', itk.listeners
  # urge '^992-31^', itk.listeners.get itk.key_symbols[ 'square' ]
  urge '^992-32^', await itk.emit            'square', 11
  urge '^992-33^', await itk.emit            'double', 12
  urge '^992-34^', await itk.emit            'cube',   13
  urge '^992-35^', await itk.emit new Note  'cube',   14
  urge '^992-36^', await itk.emit new Note  s'cube',  14
  ### TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: ###
  try ( urge '^992-37^', await itk.emit 'double', 3, 4, 5, 6      ) catch e then warn '^992-38^', reverse e.message
  try ( urge '^992-39^', await itk.emit 'foo', 3, [ 4, 5, 6, ] ) catch e then warn '^992-40^', reverse e.message
  urge '^992-41^', await itk.emit 'foo', [ 3, 4, 5, 6, ]
  return null

#===========================================================================================================
demo_2 = ->
  { Intertalk } = require '../../../apps/intertalk'
  itk           = new Intertalk()
  #.........................................................................................................
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
    itk.on 'myevent', ( note ) -> info '^992-72^', note; note.n ** 2
    help '^992-73^', await itk.emit 'myevent', { n: 16, }
    return null
  #.........................................................................................................
  return null

#===========================================================================================================
demo_3 = ->
  { Intertalk } = require '../../../apps/intertalk'
  itk           = new Intertalk()
  #.........................................................................................................
  itk.on 'abc', {}
  #.........................................................................................................
  return null


############################################################################################################
#
#===========================================================================================================
@interface = ( T, done ) ->
  INTERTALK     = require '../../../apps/intertalk'
  { Intertalk } = INTERTALK
  itk           = new Intertalk()
  #.........................................................................................................
  T?.eq ( INTERTALK._extras.isa.function      itk.on       ), true
  T?.eq ( INTERTALK._extras.isa.function      itk.on_any   ), true
  T?.eq ( INTERTALK._extras.isa.asyncfunction itk.emit     ), true
  T?.eq ( itk.emit 'what' )?.constructor?.name, 'Promise'
  T?.ok ( await itk.emit 'what' ) instanceof INTERTALK.Results
  T?.eq ( INTERTALK._extras.isa.null itk.on 'foo', ( ( note ) -> )      ), true
  T?.eq ( INTERTALK._extras.isa.text INTERTALK.version     ), true
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
      { Intertalk } = require '../../../apps/intertalk'
      itk           = new Intertalk()
      debug '^423-4^', itk.listeners
      T?.ok itk.listeners instanceof Map
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
  { Intertalk } = require '../../../apps/intertalk'
  itk           = new Intertalk()
  #.........................................................................................................
  itk.on 'sum', on_sum = ( e ) -> new Promise ( resolve ) -> setTimeout ( -> resolve e.a + e.b ), 100
  itk.on 'mul', on_mul = ( e ) -> new Promise ( resolve ) -> setTimeout ( -> resolve e.a * e.b ), 100
  #.........................................................................................................
  ### NOTE call to `as_object()` not strictly necessary as the underlying `equals()` method does work with
  the custom types we're using (`Results` and `Note`), but that's a flaw in the algorithm so
  let's try to write it the correct way: ###
  T?.eq ( as_object await itk.emit 'sum', { a: 100, b: 200, } ), { '$key': '$results', note: { '$key': 'sum', a: 100, b: 200 }, results: [ 300 ] }
  T?.eq ( as_object await itk.emit 'mul', { a: 100, b: 200, } ), { '$key': '$results', note: { '$key': 'mul', a: 100, b: 200 }, results: [ 20000 ] }
  #.........................................................................................................
  done?()

#===========================================================================================================
@type_validation = ( T, done ) ->
  INTERTALK     = require '../../../apps/intertalk'
  { Intertalk } = INTERTALK
  itk           = new Intertalk()
  #.........................................................................................................
  await throws T, 'expected 1 or 2 arguments, got 5',           ( -> await itk.emit 'double', 3, 4, 5, 6   )
  await throws T, 'expected 1 or 2 arguments, got 3',           ( -> await itk.emit 'foo', 3, [ 4, 5, 6, ] )
  await throws T, 'expected 2 arguments, got 0',                ( -> itk.on() )
  await throws T, 'expected 2 arguments, got 1',                ( -> itk.on 4 )
  await throws T, 'expected a IT_note_$key, got a number',      ( -> itk.on 4, 5 )
  await throws T, 'expected a IT_note_$key, got a number',      ( -> itk.on 4, -> )
  await throws T, 'expected 2 arguments, got 1',                ( -> itk.on s'abc' )
  await throws T, 'expected 2 arguments, got 3',                ( -> itk.on s'abc', ( -> ), 9 )
  await throws T, 'expected 2 arguments, got 3',                ( -> itk.on 'abc', {}, 9 )
  await throws T, 'expected a IT_listener, got a object',       ( -> itk.on 'abc', {} )
  await throws T, 'expected a IT_listener, got a object',       ( -> itk.on s'abc', {} )
  await throws T, 'expected 1 or 2 arguments, got 0',           ( -> new INTERTALK._extras.Datom() )
  await throws T, 'expected a IT_note_$key, got a number',      ( -> new INTERTALK._extras.Datom 42 )
  await throws T, 'expected a IT_note_$key, got a object',      ( -> new INTERTALK._extras.Datom null )
  await throws T, 'expected a IT_note_$key, got a undefined',   ( -> new INTERTALK._extras.Datom undefined )
  #.........................................................................................................
  done?()

#===========================================================================================================
@on_any = ( T, done ) ->
  { Intertalk } = require '../../../apps/intertalk'
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    counter = 0
    itk.on_any ( note ) -> counter++
    await itk.emit 'foo'
    await itk.emit 'bar'
    await itk.emit 'baz'
    T?.eq counter, 3
    return null
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'any', 1 ], [ 'any', 2 ], [ 'any', 3 ] ]
    results = []
    itk.on_any ( note ) -> 'any'
    itk.on 'd1', ( note ) -> 1
    itk.on 'd2', ( note ) -> 2
    itk.on 'd3', ( note ) -> 3
    results.push ( await itk.emit 'd1' ).results
    results.push ( await itk.emit 'd2' ).results
    results.push ( await itk.emit 'd3' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'any', 1 ], [ 'any', 2 ], [ 'any', 3 ] ]
    results = []
    itk.on 'd1', ( note ) -> 1
    itk.on 'd2', ( note ) -> 2
    itk.on 'd3', ( note ) -> 3
    itk.on_any ( note ) -> 'any'
    results.push ( await itk.emit 'd1' ).results
    results.push ( await itk.emit 'd2' ).results
    results.push ( await itk.emit 'd3' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'any1', 'any2', 'any3', 1 ], [ 'any1', 'any2', 'any3', 2 ], [ 'any1', 'any2', 'any3', 3 ] ]
    results = []
    itk.on 'd1', ( note ) -> 1
    itk.on 'd2', ( note ) -> 2
    itk.on 'd3', ( note ) -> 3
    itk.on_any ( note ) -> 'any1'
    itk.on_any ( note ) -> 'any2'
    itk.on_any ( note ) -> 'any3'
    results.push ( await itk.emit 'd1' ).results
    results.push ( await itk.emit 'd2' ).results
    results.push ( await itk.emit 'd3' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  done?()

#===========================================================================================================
@on_unhandled = ( T, done ) ->
  { Intertalk } = require '../../../apps/intertalk'
  { after }     = GUY.async
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'u1', ], [ 'u1', ], [ 'u1', ] ]
    results = []
    itk.on_unhandled u1 = ( note ) -> 'u1'
    results.push ( await itk.emit 'foo' ).results
    results.push ( await itk.emit 'bar' ).results
    results.push ( await itk.emit 'baz' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'one:k1' ], [ 'two:u1', 'two:u2' ], [ 'three:u1', 'three:u2' ] ]
    results = []
    itk.on 'one',     k1 = ( note ) -> after 0.05, -> help "#{note.$key}:k1"; "#{note.$key}:k1"
    itk.on_unhandled  u1 = ( note ) -> after 0.05, -> help "#{note.$key}:u1"; "#{note.$key}:u1"
    itk.on_unhandled  u2 = ( note ) -> after 0.05, -> help "#{note.$key}:u2"; "#{note.$key}:u2"
    results.push ( await itk.emit 'one' ).results
    results.push ( await itk.emit 'two' ).results
    results.push ( await itk.emit 'three' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  await do ->
    itk     = new Intertalk()
    matcher = [ [ 'one:a2', 'one:k1' ], [ 'two:a2', 'two:u1', 'two:u2' ], [ 'three:a2', 'three:u1', 'three:u2' ] ]
    results = []
    itk.on 'one',     k1 = ( note ) -> after 0.05, -> help "#{note.$key}:k1"; "#{note.$key}:k1"
    itk.on_unhandled  u1 = ( note ) -> after 0.05, -> help "#{note.$key}:u1"; "#{note.$key}:u1"
    itk.on_unhandled  u2 = ( note ) -> after 0.05, -> help "#{note.$key}:u2"; "#{note.$key}:u2"
    itk.on_any        a2 = ( note ) -> after 0.05, -> help "#{note.$key}:a2"; "#{note.$key}:a2"
    results.push ( await itk.emit 'one'   ).results
    results.push ( await itk.emit 'two'   ).results
    results.push ( await itk.emit 'three' ).results
    T?.eq results, matcher
    return null
  #.........................................................................................................
  done?()

# #===========================================================================================================
# @result_ordering = ( T, done ) ->
#   { Intertalk } = require '../../../apps/intertalk'
#   # { after }     = GUY.async
#   { nameit }    = ( require '../../../apps/webguy' ).props
#   #.........................................................................................................
#   await do ->
#     itk       = new Intertalk()
#     matcher   = [ [ 'one:k1' ], [ 'two:u1', 'two:u2' ], [ 'three:u1', 'three:u2' ] ]
#     results   = []
#     #.......................................................................................................
#     get_listener = ( idx ) ->
#       dt      = parseInt Math.random() * 1000
#       message = "dt:#{dt},k#{idx}"
#       R       = ( note ) -> new Promise ( resolve ) ->
#         setTimeout ( -> help message; resolve message ), dt
#       nameit message, R
#       return R
#     #.......................................................................................................
#     itk.on 'whatever', get_listener idx for idx in [ 1 .. 9 ]
#     results.push await itk.emit 'whatever'
#     help '^243-1^', results
#     #.......................................................................................................
#     T?.eq results, matcher
#     return null
#   #.........................................................................................................
#   done?()

#===========================================================================================================
@unsubscribing = ( T, done ) ->
  { Intertalk } = require '../../../apps/intertalk'
  { after }     = GUY.async
  #.........................................................................................................
  itk = new Intertalk()
  itk.on_any        a1 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "a1:#{note.$key}"; resolve "a1:#{note.$key}"
  itk.on_unhandled  f1 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "f1:#{note.$key}"; resolve "f1:#{note.$key}"
  itk.on 'n1',      n1 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "n1:#{note.$key}"; resolve "n1:#{note.$key}"
  itk.on 'n2',      n2 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "n2:#{note.$key}"; resolve "n2:#{note.$key}"
  itk.on 'n3',      n3 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "n3:#{note.$key}"; resolve "n3:#{note.$key}"
  itk.on 'n3',      m3 = ( note ) -> new Promise ( resolve ) -> after 0.02, -> help "m3:#{note.$key}"; resolve "m3:#{note.$key}"
  itk.on 'n1',      m3
  itk.on 'n2',      m3
  #.........................................................................................................
  await do =>
    results = []
    results.push ( await itk.emit 'n1' ).results
    results.push ( await itk.emit 'n2' ).results
    results.push ( await itk.emit 'n3' ).results
    T?.eq results, [ [ 'a1:n1', 'n1:n1', 'm3:n1' ], [ 'a1:n2', 'n2:n2', 'm3:n2' ], [ 'a1:n3', 'n3:n3', 'm3:n3' ] ]
  #.........................................................................................................
  T?.eq ( itk.unsubscribe n2 ), 1
  T?.eq ( itk.unsubscribe n2 ), 0
  #.........................................................................................................
  await do =>
    results = []
    results.push ( await itk.emit 'n1' ).results
    results.push ( await itk.emit 'n2' ).results
    results.push ( await itk.emit 'n3' ).results
    T?.eq results, [ [ 'a1:n1', 'n1:n1', 'm3:n1' ], [ 'a1:n2', 'm3:n2' ], [ 'a1:n3', 'n3:n3', 'm3:n3' ] ]
  #.........................................................................................................
  T?.eq ( itk.unsubscribe a1 ), 1
  T?.eq ( itk.unsubscribe a1 ), 0
  #.........................................................................................................
  await do =>
    results = []
    results.push ( await itk.emit 'n1' ).results
    results.push ( await itk.emit 'n2' ).results
    results.push ( await itk.emit 'n3' ).results
    T?.eq results, [ [ 'n1:n1', 'm3:n1' ], [ 'm3:n2' ], [ 'n3:n3', 'm3:n3' ] ]
  #.........................................................................................................
  T?.eq ( itk.unsubscribe 'n1', m3 ), 1
  T?.eq ( itk.unsubscribe 'n1', m3 ), 0
  T?.eq ( itk.unsubscribe 'n2', m3 ), 1
  T?.eq ( itk.unsubscribe 'n2', m3 ), 0
  #.........................................................................................................
  await do =>
    results = []
    results.push ( await itk.emit 'n1' ).results
    results.push ( await itk.emit 'n2' ).results
    results.push ( await itk.emit 'n3' ).results
    T?.eq results, [ [ 'n1:n1', ], [ 'f1:n2', ], [ 'n3:n3', 'm3:n3', ] ]
  #.........................................................................................................
  done?()

#===========================================================================================================
@control_object = ( T, done ) ->
  { Intertalk } = require '../../../apps/intertalk'
  { after }     = GUY.async
  #.........................................................................................................
  itk   = new Intertalk()
  count = 0
  #.........................................................................................................
  itk.on 'one', k1 = ( note, ctl ) ->
    T?.eq arguments.length, 2
    #.......................................................................................................
    return new Promise ( resolve ) ->
      message = "#{note.$key}:k1"
      after 0.05, ->
        if note.$key is 'one'
          ctl.unsubscribe_this()
        else
          count++
          ctl.unsubscribe_all() if count > 1
        help    message
        resolve message
      return null
  #.........................................................................................................
  itk.on 'two', k1
  itk.on_any a1 = ( note ) -> "#{note.$key}:a1"
  #.........................................................................................................
  results = []
  results.push ( await itk.emit 'one'   ).results
  results.push ( await itk.emit 'two'   ).results
  results.push ( await itk.emit 'three' ).results
  results.push ( await itk.emit 'one'   ).results
  results.push ( await itk.emit 'two'   ).results
  results.push ( await itk.emit 'three' ).results
  results.push ( await itk.emit 'one'   ).results
  results.push ( await itk.emit 'two'   ).results
  results.push ( await itk.emit 'three' ).results
  T?.eq results, [
    [ 'one:a1', 'one:k1' ],
    [ 'two:a1', 'two:k1' ],
    [ 'three:a1' ],
    [ 'one:a1', ],
    [ 'two:a1', 'two:k1' ],
    [ 'three:a1' ],
    [ 'one:a1', ],
    [ 'two:a1', ],
    [ 'three:a1' ] ]
  #.........................................................................................................
  done?()


#===========================================================================================================
if module is require.main then await do =>
  # await demo_1()
  # await demo_2()
  # await demo_3()
  # await test @WeakMap_replacement
  # await test @unsubscribing
  # await test @on_unhandled
  await test @control_object
  # await test @


