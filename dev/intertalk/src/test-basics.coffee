

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
  whisper }               = GUY.trm.get_loggers 'subsidiary'
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
demo_1 = ->
  INTERTALK = require '../../../apps/intertalk'
  { AE, Async_events, AE_Event, Event_results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK
  receiver =
    on_square:      ( event ) -> info '^992-4^', event; event.$value ** 2
    on_cube:        ( event ) -> info '^992-6^', event; event.$value ** 3
    on_double:      ( event ) -> info '^992-5^', event; event.$value *  2
    on_any:         ( event ) -> info '^992-5^', event
    on_cube_symbol: ( event ) -> info '^992-6^', event; event.$value ** 3
  AE.on 'square',   receiver
  AE.on 'double',   receiver
  AE.on 'cube',     receiver.on_cube
  AE.on s'cube',    receiver.on_cube
  AE.on '*',        receiver.on_any
  # urge '^992-7^', AE
  # urge '^992-8^', AE.key_symbols[ 'square' ]
  # urge '^992-9^', AE.listeners
  # urge '^992-10^', AE.listeners.get AE.key_symbols[ 'square' ]
  urge '^992-11^', await AE.emit            'square', 11
  urge '^992-12^', await AE.emit            'double', 12
  urge '^992-13^', await AE.emit            'cube',   13
  urge '^992-13^', await AE.emit new AE_Event  'cube',   14
  urge '^992-13^', await AE.emit new AE_Event  s'cube',  14
  ### TAINT should not be accepted, emit 1 object or 1 key plus 0-1 data: ###
  try ( urge '^992-14^', await AE.emit 'double', 3, 4, 5, 6      ) catch e then warn '^992-15^', reverse e.message
  try ( urge '^992-16^', await AE.emit 'foo', 3, [ 4, 5, 6, ] ) catch e then warn '^992-17^', reverse e.message
  urge '^992-18^', await AE.emit 'foo', [ 3, 4, 5, 6, ]
  return null

#===========================================================================================================
demo_2 = ->
  INTERTALK = require '../../../apps/intertalk'
  { AE, Async_events, AE_Event, Event_results, Datom, isa, validate, isa_optional, validate_optional } = INTERTALK
  class A
  class B extends Object
  urge '^992-19^', A
  urge '^992-20^', A.freeze
  urge '^992-21^', new A()
  urge '^992-22^', B
  urge '^992-23^', new B()
  urge '^992-24^', isa.object A
  urge '^992-25^', isa.object B
  urge '^992-26^', isa.object new A()
  urge '^992-27^', isa.object new B()
  try new Datom()     catch e then warn '^992-28^', reverse e.message
  try new Datom 5     catch e then warn '^992-29^', reverse e.message
  try new Datom null  catch e then warn '^992-30^', reverse e.message
  try new Datom {}    catch e then warn '^992-31^', reverse e.message
  urge '^992-32^', new Datom 'foo'
  urge '^992-33^', new Datom 'foo', null
  urge '^992-34^', new Datom 'foo', undefined
  urge '^992-35^', new Datom 'foo', 56
  urge '^992-36^', new Datom 'foo', { bar: 56, }
  urge '^992-37^', new Datom 'foo', { bar: 56, $key: 'other', }
  urge '^992-38^', new Datom s'foo', { bar: 56, $key: 'other', }
  urge '^992-39^', new Datom { bar: 56, $key: 'other', }
  urge '^992-40^', new Datom { bar: 56, $key: 'other', $freeze: false, }
  urge '^992-41^', new Datom { bar: 56, $key: 'other', $freeze: true, }
  urge '^992-42^', new Datom { bar: 56, $key: 'other', $freeze: null, }
  urge '^992-43^', new Datom 'something', { $freeze: false, }
  urge '^992-44^', new Datom 'something', { $freeze: true,  }
  urge '^992-45^', new Datom 'something', { $freeze: null,  }
  #.........................................................................................................
  ### must set `{ $freeze: false, }` explicitly else datom will be (superficially) frozen: ###
  do =>
    d = new Datom 'o', { $freeze: false, }
    d.p = 7
    urge '^992-46^', d
    return null
  #.........................................................................................................
  ### passing in an existing datom (or event) `d` into `new Datom d` (or `new AE_Event d`) results in a copy
  of `d`: ###
  do =>
    d = new Datom 'o', { $freeze: false, }
    e = new Datom d
    urge '^992-47^', d, e, d is e
    return null
  #.........................................................................................................
  ### events are just `Datom`s: ###
  urge '^992-48^', new AE_Event s'foo', { bar: 56, }
  #.........................................................................................................
  ### calls to `emit` are just calls to `new AE_Event()`: ###
  await do =>
    AE.on 'myevent', ( event ) -> info '^992-49^', event; event.n ** 2
    help '^992-50^', await AE.emit 'myevent', { n: 16, }
    return null
  #.........................................................................................................
  return null


#===========================================================================================================
if module is require.main then await do =>
  await demo_1()
  await demo_2()
  # await demo_3()
  # urge '^992-51^', await Promise.all (
  #   # new Promise ( ( resolve, reject ) -> resolve i ) for i in [ 1 .. 10 ]
  #   ( ( ( count ) -> await count ) i + 1 ) for i in [ 1 .. 10 ]
  #   )







