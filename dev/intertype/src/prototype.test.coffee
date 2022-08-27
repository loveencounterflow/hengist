
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
  TY = require './intertype-prototype'
  T?.eq ( type_of TY.registry.integer ), 'function'
  T?.eq TY.registry.integer.length, 1
  T?.eq ( TY.registry.integer 1 ), true
  T?.eq ( TY.registry.integer 1.2345678e26 ), true
  T?.eq ( TY.registry.integer 1.2345678 ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa = ( T, done ) ->
  TY = require './intertype-prototype'
  T?.eq ( type_of TY.handlers.isa ), 'function'
  T?.eq TY.handlers.isa.length, 2
  #.........................................................................................................
  T?.eq ( type_of TY.isa ), 'function'
  T?.eq TY.isa.length, 2
  T?.eq ( type_of TY.isa.integer ), 'function'
  T?.eq TY.isa.integer.length, 0 ### function only takes single spread-argument `( P... ) ->` ###
  T?.eq ( TY.isa.integer 42   ),  true
  T?.eq ( TY.isa.integer 42.3 ),  false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_can_chain_props = ( T, done ) ->
  TY = require './intertype-prototype'
  T?.eq ( TY.isa.even.integer 42   ),  true
  T?.eq ( TY.isa.even.integer 42.3 ),  false
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_isa_needs_at_least_one_prop = ( T, done ) ->
  TY = require './intertype-prototype'
  T?.throws /expected at least one property/, -> TY.isa 42
  T?.throws /expected at least one property/, -> TY.isa()
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_can_access_mmx_state = ( T, done ) ->
  TY = require './intertype-prototype'
  T?.eq ( typeof TY.Multimix ), 'function'
  T?.eq ( typeof TY.Multimix.symbol ), 'symbol'
  T?.eq ( typeof mmx    = TY.isa[TY.Multimix.symbol]        ), 'object'
  T?.eq ( typeof state  = TY.isa[TY.Multimix.symbol].state  ), 'object'
  T?.eq state, { hedges: [], }
  TY.isa.integer;        T?.eq state, { hedges: [ 'integer' ], }
  TY.isa.even.integer;   T?.eq state, { hedges: [ 'even', 'integer', ], }
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_declare_creates_types = ( T, done ) ->
  TY = require './intertype-prototype'
  T?.eq ( typeof TY.registry.TEST_float ), 'undefined'
  T?.throws /expected single property, got 2/, -> TY.declare.even.TEST_float ( x ) -> Number.isFinite x
  fn = TY.declare.TEST_float ( x ) -> Number.isFinite x
  T?.eq ( typeof TY.registry.TEST_float ), 'function'
  T?.ok TY.registry.TEST_float is fn
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_or = ( T, done ) ->
  TY = require './intertype-prototype'
  # T?.ok TY.isa.integer 42
  # T?.ok TY.isa.text 'helo'
  # T?.eq ( TY.isa.integer.or.text 42         ), true
  # T?.eq ( TY.isa.integer.or.text 'helo'     ), true
  T?.eq ( TY.isa.integer.or.text null       ), false
  done?()


############################################################################################################
if module is require.main then do =>
  test @
