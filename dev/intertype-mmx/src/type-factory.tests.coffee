
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
  whisper }               = GUY.trm.get_loggers 'INTERTYPE/type-factory.tests'
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
@itproto_tf_import = ( T, done ) ->
  { Type_factory } = require intertype_path
  debug '^3442^', Type_factory
  T?.ok Type_factory?
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_tf_new = ( T, done ) ->
  { Type_factory } = require intertype_path
  T?.throws /not a valid object/, -> try new Type_factory() catch error
    warn rvr error.message; throw error
  T?.ok ( new Type_factory {} )?
  done?()

#-----------------------------------------------------------------------------------------------------------
@itproto_tf_present_on_types = ( T, done ) ->
  { Intertype
    Type_factory  } = require intertype_path
  types             = new Intertype()
  T?.ok types.type_factory instanceof Type_factory
  debug '^410-1^', types
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
  @itproto_declare_with_function { eq: ( -> ), ok: ( -> ), throws: ( -> ), }, ->
  test @itproto_declare_with_function
  # test @
