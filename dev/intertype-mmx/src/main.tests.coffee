
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
intertype_path            = './main'

#-----------------------------------------------------------------------------------------------------------
@itproto_sample_test_function = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.eq ( type_of types.registry.integer ), 'function'
  T?.eq types.registry.integer.length, 1
  T?.eq ( types.registry.integer 1 ), true
  T?.eq ( types.registry.integer 1.2345678e26 ), true
  T?.eq ( types.registry.integer 1.2345678 ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
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
  types = new ( require intertype_path ).Intertype()
  T?.eq ( types.isa.even.integer 42   ),  true
  T?.eq ( types.isa.even.integer 42.3 ),  false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa_needs_at_least_one_prop = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.throws /expected at least one property/, -> try types.isa 42  catch error
    warn rvr error.message; throw error
  T?.throws /expected at least one property/, -> try types.isa()   catch error
    warn rvr error.message; throw error
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_can_access_mmx_state = ( T, done ) ->
  TY = require intertype_path
  types = new ( require intertype_path ).Intertype()
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
  types_1 = new ( require intertype_path ).Intertype()
  types_2 = new ( require intertype_path ).Intertype()
  T?.ok types_1.state         isnt types_2.state
  T?.ok types_1.state.hedges  isnt types_2.state.hedges
  T?.ok types_1.state.trace   isnt types_2.state.trace
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_or = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
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
  types = new ( require intertype_path ).Intertype()
  T?.eq ( types.isa.list []                     ), true
  T?.eq ( types.isa.list 'helo'                 ), false
  T?.eq ( types.isa.set  new Set 'helo'         ), true
  T?.eq ( types.isa.set  new Map()              ), false
  #.........................................................................................................
  T?.throws /cannot have two `of` props in succession/, -> try types.isa.list.of.of.text [ 42, ] catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as first prop/,           -> try types.isa.of.integer 42 catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as last prop/,            -> try types.isa.list.of [ 42, ] catch error
    warn rvr error.message; throw error
  #.........................................................................................................
  T?.eq ( types.isa.list.of.integer       [ 4, 5, 6, true, ]                              ), false
  T?.eq ( types.isa.list.of.integer       [ 'helo', ]                                     ), false
  T?.eq ( types.isa.list.of.integer       6                                               ), false
  T?.eq ( types.isa.list.of.text          'helo'                                          ), false
  T?.eq ( types.isa.set.of.text           'helo'                                          ), false
  T?.eq ( types.isa.set.of.list.of.text   'helo'                                          ), false
  T?.eq ( types.isa.list.of.list.of.text          [ [ 'a', 'b', ], [ 'c', ], [ 42, ], ]   ), false
  #.........................................................................................................
  T?.eq ( types.isa.list.of.text          []                                              ), true
  T?.eq ( types.isa.list.of.integer       []                                              ), true
  T?.eq ( types.isa.list.of.text          [ 'helo', ]                                     ), true
  T?.eq ( types.isa.list.of.integer       [ 4, 5, 6, ]                                    ), true
  T?.eq ( types.isa.set.of.text           new Set 'helo'                                  ), true
  T?.eq ( types.isa.list.of.list.of.text          [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ]  ), true
  T?.eq ( types.isa.set.of.list.of.text   new Set [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ]  ), true
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_transitive_of = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  #.........................................................................................................
  T?.eq ( types.isa.list.or.text.or.integer new Set()     ), false
  T?.eq ( types.isa.empty.list.or.set [ 1, 3, 5, ]        ), false
  T?.eq ( types.isa.empty.list.or.empty.set new Set 'abc' ), false
  #.........................................................................................................
  T?.eq ( types.isa.list.or.text.or.integer []            ), true
  T?.eq ( types.isa.list.or.text.or.integer 'txt'         ), true
  T?.eq ( types.isa.list.or.text.or.integer 1234          ), true
  T?.eq ( types.isa.empty.list.or.set []                  ), true
  T?.eq ( types.isa.empty.list.or.set new Set()           ), true
  T?.eq ( types.isa.empty.list.or.set new Set 'abc'       ), true
  T?.eq ( types.isa.empty.list.or.empty.set new Set()     ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_traces_are_being_written = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
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
  whisper '^003-20^', '———————————————————————————————'
  types.isa.set.of.list.of.text   new Set [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ]
  urge '^003-21^', checkpoint for checkpoint in types.state.trace
  result = ( rpr checkpoint for checkpoint in types.state.trace ).join '\n'
  urge '^003-22^', result
  T?.eq result, """
    { ref: '▲i3', level: 0, prop: 'set', x: Set(3) { [ 'a', 'b' ], [ 'c' ], [ 'd' ] }, R: true }
    { ref: '▲i3', level: 1, prop: 'list', x: [ 'a', 'b' ], R: true }
    { ref: '▲i3', level: 2, prop: 'text', x: 'a', R: true }
    { ref: '▲i3', level: 2, prop: 'text', x: 'b', R: true }
    { ref: '▲i3', level: 1, prop: 'list', x: [ 'c' ], R: true }
    { ref: '▲i3', level: 2, prop: 'text', x: 'c', R: true }
    { ref: '▲i3', level: 1, prop: 'list', x: [ 'd' ], R: true }
    { ref: '▲i3', level: 2, prop: 'text', x: 'd', R: true }"""
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @itproto_debugging_is_deactivated = ( T, done ) ->
#   collector       = []
#   stdout          = process.stdout
#   stderr          = process.stderr
#   Object.defineProperty process, 'stdout', value: ( text ) -> collector.push text; stdout.write text
#   Object.defineProperty process, 'stderr', value: ( text ) -> collector.push text; stderr.write text
#   #.........................................................................................................
#   types = new ( require intertype_path ).Intertype()
#   types.isa.integer 42
#   types.isa.text 'helo'
#   types.isa.text null
#   types.isa.integer.or.text 42
#   types.isa.integer.or.text 'helo'
#   types.isa.integer.or.text null
#   #.........................................................................................................
#   T?.eq collector.length, 0
#   warn '^003-23^', rvr collector unless collector.length is 0
#   done?()


#-----------------------------------------------------------------------------------------------------------
@itproto_validate = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  #.........................................................................................................
  T?.throws /cannot have two `of` props in succession/, -> try types.validate.list.of.of.text [ 42, ] catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as first prop/,           -> try types.validate.of.integer 42 catch error
    warn rvr error.message; throw error
  T?.throws /cannot have `of` as last prop/,            -> try types.validate.list.of [ 42, ] catch error
    warn rvr error.message; throw error
  T?.throws /unknown type 'omg'/, -> try types.validate.omg 'helo' catch error
    warn rvr error.message; throw error
  #.........................................................................................................
  T?.throws /not a valid list/, -> try types.validate.list 'helo' catch error
    warn rvr error.message; throw error
  T?.throws /not a valid set/, -> try types.validate.set new Map() catch error
    warn rvr error.message; throw error
  T?.throws /not a valid list\.of\.integer/,        -> try types.validate.list.of.integer       [ 4, 5, 6, true, ]                            catch error
    warn rvr error.message; throw error
  T?.throws /not a valid list\.of\.integer/,        -> try types.validate.list.of.integer       [ 'helo', ]                                   catch error
    warn rvr error.message; throw error
  T?.throws /not a valid list\.of\.integer/,        -> try types.validate.list.of.integer       6                                             catch error
    warn rvr error.message; throw error
  T?.throws /not a valid list\.of\.text/,           -> try types.validate.list.of.text          'helo'                                        catch error
    warn rvr error.message; throw error
  T?.throws /not a valid set\.of\.text/,            -> try types.validate.set.of.text           'helo'                                        catch error
    warn rvr error.message; throw error
  T?.throws /not a valid set\.of\.list\.of\.text/,  -> try types.validate.set.of.list.of.text   'helo'                                        catch error
    warn rvr error.message; throw error
  T?.throws /not a valid list\.of\.list\.of\.text/, -> try types.validate.list.of.list.of.text          [ [ 'a', 'b', ], [ 'c', ], [ 42, ], ] catch error
    warn rvr error.message; throw error
  #.........................................................................................................
  T?.eq ( types.validate.list []                                                              ), []
  T?.eq ( types.validate.set  new Set 'helo'                                                  ), new Set 'helo'
  T?.eq ( types.validate.boolean               true                                           ), true
  T?.eq ( types.validate.boolean               false                                          ), false
  T?.eq ( types.validate.list.of.text          []                                             ), []
  T?.eq ( types.validate.list.of.integer       []                                             ), []
  T?.eq ( types.validate.list.of.text          [ 'helo', ]                                    ), [ 'helo', ]
  T?.eq ( types.validate.list.of.integer       [ 4, 5, 6, ]                                   ), [ 4, 5, 6, ]
  T?.eq ( types.validate.set.of.text           new Set 'helo'                                 ), new Set 'helo'
  T?.eq ( types.validate.list.of.list.of.text          [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ] ),         [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ]
  T?.eq ( types.validate.set.of.list.of.text   new Set [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ] ), new Set [ [ 'a', 'b', ], [ 'c', ], [ 'd', ], ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_declare_with_function = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.eq ( typeof types.registry.TEST_float ), 'undefined'
  T?.throws /expected single property, got 2/, -> try types.declare.even.TEST_float ( x ) -> Number.isFinite x catch error
    warn rvr error.message; throw error
  fn = types.declare.TEST_float ( x ) -> Number.isFinite x
  T?.eq ( typeof types.registry.TEST_float ), 'function'
  T?.ok types.registry.TEST_float is fn
  #.........................................................................................................
  T?.eq ( types.isa.TEST_float 1234.5678    ), true
  T?.eq ( types.isa.TEST_float -1e26        ), true
  T?.eq ( types.isa.TEST_float '1234.5678'  ), false
  T?.eq ( types.isa.TEST_float NaN          ), false
  T?.eq ( types.isa.TEST_float Infinity     ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_declare_with_object = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.eq ( typeof types.registry.TEST_quantity ), 'undefined'
  #.........................................................................................................
  fn = types.declare.TEST_quantity
    isa:      ( x ) -> @isa.object x
    $value:   'float'
    $unit:    'nonempty.text'
    default:
      value:    0
      unit:     null
  #.........................................................................................................
  T?.eq ( typeof types.registry.TEST_quantity ), 'function'
  T?.ok types.registry.TEST_quantity is fn
  #.........................................................................................................
  T?.eq ( types.isa.TEST_quantity { value: 1, unit: 'm', }        ), true
  T?.eq ( types.isa.TEST_quantity 'red'        ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_declare_with_list = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.eq ( typeof types.registry.TEST_color ), 'undefined'
  fn = types.declare.TEST_color [ 'red', 'green', 'blue', ]
  T?.eq ( typeof types.registry.TEST_color ), 'function'
  T?.ok types.registry.TEST_color is fn
  #.........................................................................................................
  debug '^011-1^', types.isa.TEST_color 'red'
  debug '^011-1^', types.isa.TEST_color 'mauve'
  T?.eq ( types.isa.TEST_color 'red'        ), true
  T?.eq ( types.isa.TEST_color 'green'      ), true
  T?.eq ( types.isa.TEST_color 'blue'       ), true
  T?.eq ( types.isa.TEST_color 'mauve'      ), false
  T?.eq ( types.isa.TEST_color [ 'red', ]   ), false
  T?.eq ( types.isa.TEST_color [ 'mauve', ] ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_cannot_redeclare = ( T, done ) ->
  types = new ( require intertype_path ).Intertype()
  T?.eq ( typeof types.registry.TEST_float ), 'undefined'
  types.declare.TEST_color [ 'red', 'green', 'blue', ]
  T?.throws /cannot redeclare type 'TEST_color'/, -> try types.declare.TEST_color -> catch error
    warn rvr error.message; throw error
  done?()



############################################################################################################
if module is require.main then do =>
  # test @itproto_can_access_mmx_state
  # test @itproto_of
  # @itproto_transitive_of()
  # test @itproto_transitive_of
  # @itproto_validate()
  # test @itproto_validate
  # @itproto_declare_with_list()
  # test @itproto_declare_with_list
  test @
