
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
GUY                       = require '../../../apps/guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'INTERTYPE/tests'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
rvr                       = GUY.trm.reverse
truth                     = GUY.trm.truth.bind GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
# { intersection_of }       = require '../../../apps/intertype/lib/helpers'
H                         = require '../../../lib/helpers'
equals                    = require '../../../apps/intertype/deps/jkroso-equals'
S                         = ( parts ) -> new Set eval parts.raw[ 0 ]
{ to_width }              = require 'to-width'
_types                    = new ( require 'intertype' ).Intertype()
{ isa
  type_of }               = _types.export()


#-----------------------------------------------------------------------------------------------------------
@itproto_sample_test_function = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( type_of types.registry.integer ), 'function'
  T?.eq types.registry.integer.length, 1
  T?.eq ( types.registry.integer 1 ), true
  T?.eq ( types.registry.integer 1.2345678e26 ), true
  T?.eq ( types.registry.integer 1.2345678 ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  handlers  = types.constructor._get_handlers types
  T?.eq ( type_of handlers.isa ), 'function'
  T?.eq handlers.isa.length, 2
  #.........................................................................................................
  T?.eq ( type_of types.isa ), 'function'
  T?.eq types.isa.length, 0
  T?.eq ( type_of types.isa.integer ), 'function'
  T?.eq types.isa.integer.length, 0 ### function only takes single spread-argument `( P... ) ->` ###
  T?.eq ( types.isa.integer 42   ),  true
  T?.eq ( types.isa.integer 42.3 ),  false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_can_chain_props = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( types.isa.even.integer 42   ),  true
  T?.eq ( types.isa.even.integer 42.3 ),  false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa_needs_at_least_one_prop = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.throws /expected at least one property/, -> try types.isa 42  catch error
    warn rvr error.message; throw error
  T?.throws /expected at least one property/, -> try types.isa()   catch error
    warn rvr error.message; throw error
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_can_access_mmx_state = ( T, done ) ->
  TY = require './intertype-prototype'
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( typeof TY.Multimix                                ), 'function'
  T?.eq ( typeof TY.Multimix.symbol                         ), 'symbol'
  T?.eq ( typeof mmx    = types.isa[TY.Multimix.symbol]        ), 'object'
  T?.eq ( typeof state  = types.isa[TY.Multimix.symbol].state  ), 'object'
  T?.eq state.hedges, []
  T?.ok types.state is state
  T?.ok types.mmx is mmx
  types.isa.integer;        T?.eq state.hedges, [ 'integer' ]
  types.isa.even.integer;   T?.eq state.hedges, [ 'even', 'integer', ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_state_and_trace_not_shared = ( T, done ) ->
  types_1 = new ( require './intertype-prototype' ).Intertype()
  types_2 = new ( require './intertype-prototype' ).Intertype()
  T?.ok types_1.state         isnt types_2.state
  T?.ok types_1.state.hedges  isnt types_2.state.hedges
  T?.ok types_1.state.trace   isnt types_2.state.trace
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_declare_creates_types = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( typeof types.registry.TEST_float ), 'undefined'
  T?.throws /expected single property, got 2/, -> try types.declare.even.TEST_float ( x ) -> Number.isFinite x catch error
    warn rvr error.message; throw error
  fn = types.declare.TEST_float ( x ) -> Number.isFinite x
  T?.eq ( typeof types.registry.TEST_float ), 'function'
  T?.ok types.registry.TEST_float is fn
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_or = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( types.isa.integer 42                 ), true
  T?.eq ( types.isa.text 'helo'                ), true
  T?.eq ( types.isa.text null                  ), false
  #.........................................................................................................
  T?.throws /cannot have two `or` props in succession/, -> try types.isa.even.integer.or.or.text 42 catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `or` as first prop/,           -> try types.isa.or.integer 42 catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `or` as last prop/,            -> try types.isa.even.integer.or 42 catch error
    warn rvr error.message; throw error
  #.........................................................................................................
  T?.eq ( types.isa.integer.or.text 42         ), true
  T?.eq ( types.isa.integer.or.text 'helo'     ), true
  T?.eq ( types.isa.integer.or.text null       ), false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_of = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq ( types.isa.list []                     ), true
  T?.eq ( types.isa.list 'helo'                 ), false
  #.........................................................................................................
  T?.throws /cannot have two `of` props in succession/, -> try types.isa.list.of.of.text [ 42, ] catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as first prop/,           -> try types.isa.of.integer 42 catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as last prop/,            -> try types.isa.list.of [ 42, ] catch error
    warn rvr error.message; throw error
  #.........................................................................................................
  T?.eq ( types.isa.list.of.integer   [ 4, 5, 6, true, ]  ), false
  T?.eq ( types.isa.list.of.integer   [ 'helo', ]         ), false
  T?.eq ( types.isa.list.of.integer   6                   ), false
  T?.eq ( types.isa.list.of.text      'helo'              ), false
  #.........................................................................................................
  T?.eq ( types.isa.list.of.text      []                  ), true
  T?.eq ( types.isa.list.of.integer   []                  ), true
  T?.eq ( types.isa.list.of.text      [ 'helo', ]         ), true
  T?.eq ( types.isa.list.of.integer   [ 4, 5, 6, ]        ), true
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_traces_are_being_written = ( T, done ) ->
  types = new ( require './intertype-prototype' ).Intertype()
  T?.eq types.state.trace, []
  help '^003-1^', types.state.trace
  T?.eq types.state.trace, []
  whisper '^003-2^', '———————————————————————————————'
  types.isa.integer 42
  urge '^003-3^', checkpoint for checkpoint in types.state.trace
  help '^003-4^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'integer', x: 42, R: true } ]
  whisper '^003-5^', '———————————————————————————————'
  types.isa.text 'helo'
  urge '^003-6^', checkpoint for checkpoint in types.state.trace
  help '^003-7^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'text', x: 'helo', R: true } ]
  whisper '^003-8^', '———————————————————————————————'
  types.isa.text null
  urge '^003-9^', checkpoint for checkpoint in types.state.trace
  help '^003-10^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'text', x: null, R: false } ]
  whisper '^003-11^', '———————————————————————————————'
  types.isa.integer.or.text 42
  urge '^003-12^', checkpoint for checkpoint in types.state.trace
  help '^003-13^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'integer', x: 42, R: true }, { ref: '▲i2', level: 0, prop: 'or', x: 42, R: true } ]
  whisper '^003-14^', '———————————————————————————————'
  types.isa.integer.or.text 'helo'
  urge '^003-15^', checkpoint for checkpoint in types.state.trace
  help '^003-16^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'integer', x: 'helo', R: false }, { ref: '▲i1', level: 0, prop: 'or', x: 'helo', R: false }, { ref: '▲i3', level: 0, prop: 'text', x: 'helo', R: true } ]
  whisper '^003-17^', '———————————————————————————————'
  types.isa.integer.or.text null
  urge '^003-18^', checkpoint for checkpoint in types.state.trace
  help '^003-19^', types.state.trace
  T?.eq types.state.trace, [ { ref: '▲i3', level: 0, prop: 'integer', x: null, R: false }, { ref: '▲i1', level: 0, prop: 'or', x: null, R: false }, { ref: '▲i3', level: 0, prop: 'text', x: null, R: false } ]
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @itproto_debugging_is_deactivated = ( T, done ) ->
#   collector       = []
#   stdout          = process.stdout
#   stderr          = process.stderr
#   Object.defineProperty process, 'stdout', value: ( text ) -> collector.push text; stdout.write text
#   Object.defineProperty process, 'stderr', value: ( text ) -> collector.push text; stderr.write text
#   #.........................................................................................................
#   types = new ( require './intertype-prototype' ).Intertype()
#   types.isa.integer 42
#   types.isa.text 'helo'
#   types.isa.text null
#   types.isa.integer.or.text 42
#   types.isa.integer.or.text 'helo'
#   types.isa.integer.or.text null
#   #.........................................................................................................
#   T?.eq collector.length, 0
#   warn '^003-20^', rvr collector unless collector.length is 0
#   done?()


############################################################################################################
if module is require.main then do =>
  # test @itproto_can_access_mmx_state
  # test @itproto_of
  test @
