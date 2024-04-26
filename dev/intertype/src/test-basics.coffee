

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
  whisper }               = GUY.trm.get_loggers 'intertype/test-basics'
{ rpr
  inspect
  echo
  reverse
  log     }               = GUY.trm
test                      = require '../../../apps/guy-test'
TMP_types                 = new ( require 'intertype' ).Intertype()
#-----------------------------------------------------------------------------------------------------------
# s                         = ( name ) -> Symbol.for  name
# ps                        = ( name ) -> Symbol      name

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
# #===========================================================================================================
# isa_object = ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
# as_object = ( x ) ->
#   return x unless isa_object x
#   R       = {}
#   R[ k ]  = as_object v for k, v of x
#   return R

#===========================================================================================================
sample_declarations =
  boolean:                ( x ) -> ( x is true ) or ( x is false )
  function:               ( x ) -> ( Object::toString.call x ) is '[object Function]'
  asyncfunction:          ( x ) -> ( Object::toString.call x ) is '[object AsyncFunction]'
  symbol:                 ( x ) -> ( typeof x ) is 'symbol'
  object:                 ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
  float:                  ( x ) -> Number.isFinite x
  text:                   ( x ) -> ( typeof x ) is 'string'
  nullary:                ( x ) -> x? and ( ( x.length is 0 ) or ( x.size is 0 ) )
  unary:                  ( x ) -> x? and ( ( x.length is 1 ) or ( x.size is 1 ) )
  binary:                 ( x ) -> x? and ( ( x.length is 2 ) or ( x.size is 2 ) )
  trinary:                ( x ) -> x? and ( ( x.length is 3 ) or ( x.size is 3 ) )


#===========================================================================================================
throws = ( T, matcher, f ) ->
  await do =>
    error = null
    try await f() catch error
      switch matcher_type = TMP_types.type_of matcher
        when 'text'
          T?.eq error.message, matcher
        when 'regex'
          matcher.lastIndex = 0
          if matcher.test error.message
            null
          else
            warn '^992-4^', reverse message = "error #{rpr error.message} doesn't match #{rpr matcher}"
            T.fail "^992-4^ #{message}"
        else
          warn message = "^992-1^ expected a regex or a text, got a #{matcher_type}"
          T.fail message
    T?.ok error?
  return null

#===========================================================================================================
try_and_show = ( T, f ) ->
  e = null
  try ( urge '^992-2^', f() ) catch e then help '^992-3^', reverse "try_and_show: #{rpr e.message}"
  unless e?
    warn '^992-4^', reverse message = "try_and_show: expected an error but none was thrown"
    T?.fail "^992-5^ try_and_show: expected an error but none was thrown"
  return null




############################################################################################################
#
#===========================================================================================================
@interface = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  T?.eq ( TMP_types.isa.object    INTERTYPE.types                               ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.get_isa                       ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.get_isa_optional              ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.get_validate                  ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.get_validate_optional         ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types                               ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.isa                           ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.isa.optional                  ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.validate                      ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.validate.optional             ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.create                        ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
  T?.eq ( TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
  T?.eq ( TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_types_object = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  types         = new INTERTYPE.Intertype_minimal sample_declarations
  T?.eq ( types.isa.boolean           false               ), true
  T?.eq ( types.isa.boolean           true                ), true
  T?.eq ( types.isa.boolean           null                ), false
  T?.eq ( types.isa.boolean           1                   ), false
  T?.eq ( types.isa.optional.boolean  false               ), true
  T?.eq ( types.isa.optional.boolean  true                ), true
  T?.eq ( types.isa.optional.boolean  null                ), true
  T?.eq ( types.isa.optional.boolean  1                   ), false
  #.........................................................................................................
  T?.eq ( types.validate.boolean               false      ), false
  T?.eq ( types.validate.boolean               true       ), true
  T?.eq ( types.validate.optional.boolean      true       ), true
  T?.eq ( types.validate.optional.boolean      false      ), false
  T?.eq ( types.validate.optional.boolean      undefined  ), undefined
  T?.eq ( types.validate.optional.boolean      null       ), null
  try_and_show T,                           -> types.validate.boolean           1
  try_and_show T,                           -> types.validate.optional.boolean  1
  throws T, /expected a boolean/,           -> types.validate.boolean           1
  throws T, /expected an optional boolean/, -> types.validate.optional.boolean  1
  #.........................................................................................................
  T?.eq ( types.type_of null            ), 'null'
  T?.eq ( types.type_of undefined       ), 'undefined'
  T?.eq ( types.type_of false           ), 'boolean'
  T?.eq ( types.type_of Symbol 'p'      ), 'symbol'
  T?.eq ( types.type_of {}              ), 'object'
  T?.eq ( types.type_of NaN             ), 'unknown'
  T?.eq ( types.type_of +Infinity       ), 'unknown'
  T?.eq ( types.type_of -Infinity       ), 'unknown'
  #.........................................................................................................
  T?.eq ( types.isa.asyncfunction.name               ), 'isa.asyncfunction'
  T?.eq ( types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  T?.eq ( types.validate.asyncfunction.name          ), 'validate.asyncfunction'
  T?.eq ( types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_standalone_methods = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  T?.eq ( isa.boolean           false               ), true
  T?.eq ( isa.boolean           true                ), true
  T?.eq ( isa.boolean           null                ), false
  T?.eq ( isa.boolean           1                   ), false
  T?.eq ( isa.unknown           1                   ), false
  T?.eq ( isa.unknown           Infinity            ), true
  T?.eq ( isa.optional.boolean  false               ), true
  T?.eq ( isa.optional.boolean  true                ), true
  T?.eq ( isa.optional.boolean  null                ), true
  T?.eq ( isa.optional.boolean  1                   ), false
  T?.eq ( isa.optional.unknown  1                   ), false
  T?.eq ( isa.optional.unknown  Infinity            ), true
  T?.eq ( isa.optional.unknown  undefined           ), true
  T?.eq ( isa.optional.unknown  undefined           ), true
  #.........................................................................................................
  T?.eq ( validate.boolean               false      ), false
  T?.eq ( validate.boolean               true       ), true
  T?.eq ( validate.optional.boolean      true       ), true
  T?.eq ( validate.optional.boolean      false      ), false
  T?.eq ( validate.optional.boolean      undefined  ), undefined
  T?.eq ( validate.optional.boolean      null       ), null
  try_and_show T,                           -> validate.boolean           1
  try_and_show T,                           -> validate.optional.boolean  1
  throws T, /expected a boolean/,           -> validate.boolean           1
  throws T, /expected an optional boolean/, -> validate.optional.boolean  1
  #.........................................................................................................
  T?.eq ( type_of null            ), 'null'
  T?.eq ( type_of undefined       ), 'undefined'
  T?.eq ( type_of false           ), 'boolean'
  T?.eq ( type_of Symbol 'p'      ), 'symbol'
  T?.eq ( type_of {}              ), 'object'
  T?.eq ( type_of NaN             ), 'unknown'
  T?.eq ( type_of +Infinity       ), 'unknown'
  T?.eq ( type_of -Infinity       ), 'unknown'
  #.........................................................................................................
  T?.eq ( isa.asyncfunction.name               ), 'isa.asyncfunction'
  T?.eq ( isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  T?.eq ( validate.asyncfunction.name          ), 'validate.asyncfunction'
  T?.eq ( validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  #.........................................................................................................
  throws T, /expected 1 arguments, got 2/, -> isa.float 3, 4
  throws T, /expected 1 arguments, got 0/, -> isa.float()
  done?()

#-----------------------------------------------------------------------------------------------------------
@methods_check_arity = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  #.........................................................................................................
  throws T, /expected 1 arguments, got 2/, -> isa.float 3, 4
  throws T, /expected 1 arguments, got 0/, -> isa.float()
  throws T, /expected 1 arguments, got 2/, -> isa.optional.float 3, 4
  throws T, /expected 1 arguments, got 0/, -> isa.optional.float()
  throws T, /expected 1 arguments, got 2/, -> validate.float 3, 4
  throws T, /expected 1 arguments, got 0/, -> validate.float()
  throws T, /expected 1 arguments, got 2/, -> validate.optional.float 3, 4
  throws T, /expected 1 arguments, got 0/, -> validate.optional.float()
  throws T, /expected 1 arguments, got 2/, -> type_of 3, 4
  throws T, /expected 1 arguments, got 0/, -> type_of()
  try_and_show T, -> isa.float 3, 4
  try_and_show T, -> isa.float()
  try_and_show T, -> isa.optional.float 3, 4
  try_and_show T, -> isa.optional.float()
  try_and_show T, -> validate.float 3, 4
  try_and_show T, -> validate.float()
  try_and_show T, -> validate.optional.float 3, 4
  try_and_show T, -> validate.optional.float()
  try_and_show T, -> type_of 3, 4
  try_and_show T, -> type_of()
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_on_missing_type = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype()
  #.........................................................................................................
  try_and_show T, -> isa.quux
  try_and_show T, -> isa.quux()
  try_and_show T, -> isa.quux 3
  try_and_show T, -> isa.quux 3, 4
  try_and_show T, -> isa.optional.quux
  try_and_show T, -> isa.optional.quux()
  try_and_show T, -> isa.optional.quux 3
  try_and_show T, -> isa.optional.quux 3, 4
  try_and_show T, -> validate.quux
  try_and_show T, -> validate.quux()
  try_and_show T, -> validate.quux 3
  try_and_show T, -> validate.quux 3, 4
  try_and_show T, -> validate.optional.quux
  try_and_show T, -> validate.optional.quux()
  try_and_show T, -> validate.optional.quux 3
  try_and_show T, -> validate.optional.quux 3, 4
  #.........................................................................................................
  throws T, /unknown type 'quux'/, -> isa.quux
  throws T, /unknown type 'quux'/, -> isa.quux()
  throws T, /unknown type 'quux'/, -> isa.quux 3
  throws T, /unknown type 'quux'/, -> isa.quux 3, 4
  throws T, /unknown type 'quux'/, -> isa.optional.quux
  throws T, /unknown type 'quux'/, -> isa.optional.quux()
  throws T, /unknown type 'quux'/, -> isa.optional.quux 3
  throws T, /unknown type 'quux'/, -> isa.optional.quux 3, 4
  throws T, /unknown type 'quux'/, -> validate.quux
  throws T, /unknown type 'quux'/, -> validate.quux()
  throws T, /unknown type 'quux'/, -> validate.quux 3
  throws T, /unknown type 'quux'/, -> validate.quux 3, 4
  throws T, /unknown type 'quux'/, -> validate.optional.quux
  throws T, /unknown type 'quux'/, -> validate.optional.quux()
  throws T, /unknown type 'quux'/, -> validate.optional.quux 3
  throws T, /unknown type 'quux'/, -> validate.optional.quux 3, 4
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_optional_is_declared = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  declarations  = { sample_declarations..., }
  declarations.optional = ( x ) -> true
  #.........................................................................................................
  try_and_show T, -> new INTERTYPE.Intertype_minimal declarations
  throws T, /'optional' is a built-in base type and may not be overridden/, -> new INTERTYPE.Intertype_minimal declarations
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_wrong_type_of_isa_test_declared = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  try_and_show T, -> new Intertype { foo: ( -> ), }
  try_and_show T, -> new Intertype { foo: ( ( a, b ) -> ), }
  try_and_show T, -> new Intertype { foo: true, }
  try_and_show T, -> new Intertype { foo: null, }
  try_and_show T, -> new Intertype { foo: {}, }
  try_and_show T, -> new Intertype { foo: { test: null, }, }
  try_and_show T, -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }
  try_and_show T, -> new Intertype { foo: 'quux', }
  throws T, /expected function with 1 parameters, got one with 0/, -> new Intertype { foo: ( -> ), }
  throws T, /expected function with 1 parameters, got one with 2/, -> new Intertype { foo: ( ( a, b ) -> ), }
  throws T, /expected type name, function or object, got a boolean/, -> new Intertype { foo: true, }
  throws T, /expected type name, function or object, got a null/, -> new Intertype { foo: null, }
  throws T, /expected a function for `test` entry of type 'function', got a object/, -> new Intertype { foo: {}, }
  throws T, /expected a function for `test` entry of type 'function', got a object/, -> new Intertype { foo: { test: null, }, }
  throws T, /expected function with 1 parameters, got one with 2/, -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }
  throws T, /unknown type 'quux'/, -> new Intertype { foo: 'quux', }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@allow_declaration_objects = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.integer =
      test:     ( x ) -> Number.isInteger x
      template: 0
    types = new Intertype_minimal declarations
    T?.eq ( TMP_types.isa.function types.isa.integer  ), true
    T?.eq ( types.isa.integer.length                  ), 1
    T?.eq ( types.isa.integer 123                     ), true
    T?.eq ( types.isa.integer 123.456                 ), false
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@create_entries_must_be_sync_functions = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.integer =
      test:     ( x ) -> Number.isInteger x
      create:   -> await 0
    try_and_show T, -> new Intertype_minimal declarations
    throws T, /expected a function for `create` entry of type 'integer', got a asyncfunction/, -> new Intertype_minimal declarations
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@template_methods_must_be_nullary = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.foolist =
      test:     ( x ) -> true
      template: ( n ) -> [ n, ]
    try_and_show T, -> new Intertype_minimal declarations
    throws T, /template method for type 'foolist' has arity 1 but must be nullary/, -> new Intertype_minimal declarations
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_knows_its_base_types = ( T, done ) ->
  # T?.halt_on_error()
  { isa } = require '../../../apps/intertype'
  #.........................................................................................................
  T?.eq ( isa.basetype 'optional'   ), true
  T?.eq ( isa.basetype 'anything'   ), true
  T?.eq ( isa.basetype 'nothing'    ), true
  T?.eq ( isa.basetype 'something'  ), true
  T?.eq ( isa.basetype 'null'       ), true
  T?.eq ( isa.basetype 'undefined'  ), true
  T?.eq ( isa.basetype 'unknown'    ), true
  T?.eq ( isa.basetype 'integer'    ), false
  T?.eq ( isa.basetype 'float'      ), false
  T?.eq ( isa.basetype 'basetype'   ), false
  T?.eq ( isa.basetype 'quux'       ), false
  T?.eq ( isa.basetype null         ), false
  T?.eq ( isa.basetype undefined    ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@allows_licensed_overrides = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    T?.eq ( types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        test:       ( x ) -> x is 'float'
    try_and_show T, -> ( types.declare overrides )
    throws T, /type 'float' has already been declared/, -> ( types.declare overrides )
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    T?.eq ( types.isa.float 4       ), true
    T?.eq ( types.isa.float 'float' ), false
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    T?.eq ( types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        override:   true
        test:       ( x ) -> x is 'float'
    T?.eq ( types.declare overrides ), null
    #.......................................................................................................
    T?.eq ( types.isa.float 4       ), false
    T?.eq ( types.isa.float 'float' ), true
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    T?.eq ( types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      anything:
        override:   true
        test:       ( x ) -> true
    try_and_show T, -> ( types.declare overrides )
    throws T, /'anything' is a built-in base type and may not be overridden/, -> ( types.declare overrides )
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    T?.eq ( types.isa.anything 4       ), true
    T?.eq ( types.isa.anything 'float' ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_create_types_with_templates_and_create = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.integer =
      test:     ( x ) -> Number.isInteger x
      template: 0
    declarations.text = { template: '', test: ( ( x ) -> ( typeof x ) is 'string' ), }
    declarations.float =
      test:     ( x ) -> Number.isFinite x
      create:   ( p = null ) -> parseFloat p ? @declarations.float.template
      template: 0
    declarations.nan = ( x ) -> Number.isNaN x
    #.......................................................................................................
    types = new Intertype_minimal declarations
    T?.eq ( TMP_types.isa.object types.declarations       ), true
    T?.eq ( TMP_types.isa.object types.declarations.float ), true
    T?.eq ( TMP_types.isa.object types.declarations.text  ), true
    #.......................................................................................................
    try_and_show T, -> types.create.boolean()
    throws T, /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/, \
      -> types.create.boolean()
    try_and_show T, -> types.create.text 'foo'
    throws T, /expected 0 arguments, got 1/, -> types.create.text 'foo'
    #.......................................................................................................
    T?.eq types.create.text(), ''
    T?.eq types.create.integer(), 0
    T?.eq types.create.float(), 0
    T?.eq ( types.create.float '123.45' ), 123.45
    try_and_show T, -> types.create.float '***'
    throws T, /expected `create\.float\(\)` to return a float but it returned a nan/, -> types.create.float '***'
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_minimal_has_only_base_types = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  types = new Intertype_minimal()
  T?.eq ( Object.keys types.declarations ).sort(), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown' ]
  types.declare { z: ( ( x ) -> ), }
  T?.eq ( Object.keys types.declarations ).sort(), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_type_name_for_test = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    try_and_show T, -> types.declare { z: 'quux', }
    throws T, /unknown type 'quux'/, -> types.declare { z: 'quux', }
    types.declare { z: 'float', }
    T?.eq ( types.isa.z 12 ), true
    T?.eq types.isa.float.name, 'isa.float'
    T?.eq types.declarations.float.type, 'float'
    T?.eq types.declarations.float.test.name, 'float'
    T?.eq types.isa.z.name, 'isa.z'
    T?.eq types.declarations.z.type, 'z'
    T?.eq types.declarations.z.test.name, 'float'
  #.........................................................................................................
  do =>
    types = new Intertype()
    try_and_show T, -> types.declare { z: { test: 'quux', }, }
    throws T, /unknown type 'quux'/, -> types.declare { z: { test: 'quux', }, }
    types.declare { z: { test: 'float', }, }
    T?.eq ( types.isa.z 12 ), true
    T?.eq types.isa.float.name, 'isa.float'
    T?.eq types.declarations.float.type, 'float'
    T?.eq types.declarations.float.test.name, 'float'
    T?.eq types.isa.z.name, 'isa.z'
    T?.eq types.declarations.z.type, 'z'
    T?.eq types.declarations.z.test.name, 'float'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@resolve_dotted_type = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    T?.eq ( Reflect.has types.declarations, 'foo'         ), false
    types.declare { foo: 'object', }
    T?.eq ( Reflect.has types.declarations, 'foo'         ), true
    T?.eq ( Reflect.has types.declarations, 'foo.bar'     ), false
    types.declare { 'foo.bar': 'object', }
    T?.eq ( Reflect.has types.declarations, 'foo.bar'     ), true
    T?.eq ( Reflect.has types.declarations, 'foo.bar.baz' ), false
    types.declare { 'foo.bar.baz': 'float', }
    T?.eq ( Reflect.has types.declarations, 'foo.bar.baz' ), true
    T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
    # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    debug '^3234^', types.isa.foo
    debug '^3234^', types.isa[ 'foo.bar' ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dotted_types_are_test_methods = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { quantity: 'object', }
    types.declare { 'quantity.q': 'float', }
    types.declare { 'quantity.u': 'text', }
    T?.eq types.isa[ 'quantity.q' ], types.declarations[ 'quantity' ].sub_tests[ 'q' ]
    T?.eq types.isa[ 'quantity.q' ], types.isa.quantity.q
    # debug '^409-1^', types.declarations
    T?.eq ( types.isa.quantity {}                 ), false
    T?.eq ( types.isa.quantity { q: {}, }         ), false
    T?.eq ( types.isa.quantity { q: 3, }          ), false
    T?.eq ( types.isa.quantity { q: 3, u: 'm', }  ), true
    T?.eq ( types.isa.quantity.q 3                ), true
    T?.eq ( types.isa.quantity.q 3.1              ), true
    T?.eq ( types.isa.quantity.q '3.1'            ), false
    T?.eq ( types.isa.quantity.u 'm'              ), true
    T?.eq ( types.isa.quantity.u null             ), false
    T?.eq ( types.isa.quantity.u 3                ), false
    debug '^433-1^', types.declarations[ 'quantity' ]
    debug '^433-1^', types.declarations[ 'quantity.q' ]
    debug '^433-1^', types.declarations[ 'quantity.u' ]
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'person':                       'object', }
    types.declare { 'person.name':                  'text',   }
    types.declare { 'person.address':               'object', }
    types.declare { 'person.address.city':          'object', }
    types.declare { 'person.address.city.name':     'text',   }
    types.declare { 'person.address.city.postcode': 'text',   }
    # T?.eq types.isa[ 'quantity.q' ], types.declarations[ 'quantity' ].sub_tests[ 'q' ]
    # T?.eq types.isa[ 'quantity.q' ], types.isa.quantity.q
    T?.eq ( types.isa.person.address.city.name 'P'  ), true
    T?.eq ( types.isa.person.address.city.name 1234 ), false
    T?.eq ( types.isa.person 1234 ), false
    T?.eq ( types.isa.person { name: 'Bob', } ), false
    T?.eq ( types.isa.person { name: 'Bob', address: {}, } ), false
    T?.eq ( types.isa.person { name: 'Bob', address: { city: {}, }, } ), false
    T?.eq ( types.isa.person { name: 'Bob', address: { city: { name: 'P', }, }, } ), false
    T?.eq ( types.isa.person { name: 'Bob', address: { city: { name: 'P', postcode: 'SO36', }, }, } ), true
    T?.eq ( types.isa.person.address.city.name     'P'                                ), true
    T?.eq ( types.isa.person.address.city.postcode 'SO36'                             ), true
    T?.eq ( types.isa.person.address.city {         name: 'P', postcode: 'SO36', }    ), true
    T?.eq ( types.isa.person.address      { city: { name: 'P', postcode: 'SO36', }, } ), true
    help '^322-1^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person'               ].sub_tests )
    help '^322-2^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address'       ].sub_tests )
    help '^322-3^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address.city'  ].sub_tests )
    T?.eq ( Object.keys types.declarations[ 'person'               ].sub_tests ), [ 'name', 'address', ]
    T?.eq ( Object.keys types.declarations[ 'person.address'       ].sub_tests ), [ 'city', ]
    T?.eq ( Object.keys types.declarations[ 'person.address.city'  ].sub_tests ), [ 'name', 'postcode', ]
    T?.eq ( types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address'      ].sub_tests ), true
    T?.eq ( types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address.city' ].sub_tests ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_namespaces = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations =
      'foo.bar':      ( x ) -> x is 'foo.bar'
      'foo.bar.baz':  ( x ) -> x is 'foo.bar.baz'
    try_and_show T, -> types = new Intertype declarations
    throws T, /unknown partial type 'foo'/, -> types = new Intertype declarations
    return null
  #.........................................................................................................
  do =>
    declarations =
      'quantity':         'object'
      'quantity.q':       'float'
      'quantity.u':       'text'
    types = new Intertype declarations
    T?.eq ( types.isa.quantity {}                   ), false
    T?.eq ( types.isa.quantity { q: 12, u: 'kg', }  ), true
    T?.eq ( types.isa[ 'quantity.q' ] 12            ), true
    T?.eq ( types.isa[ 'quantity.u' ] 'kg'          ), true
    T?.eq ( types.isa.quantity.q 12                 ), true
    T?.eq ( types.isa.quantity.u 'kg'               ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_________________can_use_fields = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype
      quantity:
        fields:
          q:    ''
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  # T?.halt_on_error()
  { Intertype_minimal, } = require '../../../apps/intertype'
  #.........................................................................................................
  declarations  =
    integer:
      test:     ( x ) -> Number.isInteger x
      create:   ( p = null ) -> parseInt ( p ? @declarations.integer.template ), 10
      template: 0
    text:
      template: ''
      test:     ( ( x ) -> ( typeof x ) is 'string' )
    float:
      test:     ( x ) -> Number.isFinite x
      create:   ( p = null ) -> parseFloat p ? @declarations.float.template
      template: 0
  #.........................................................................................................
  declarations = { sample_declarations..., declarations..., }
  types = new Intertype_minimal declarations
  #.........................................................................................................
  debug '^233-1^', types.create.float '345.678'
  debug '^233-1^', types.create.integer '345.678'
  try_and_show null, -> types.create.float '***'
  try_and_show null, -> types.create.integer '***'
  #.........................................................................................................
  return null


#===========================================================================================================
if module is require.main then await do =>
  # @basic_functionality_using_types_object()
  # @allow_declaration_objects()
  # demo_1()
  # @can_use_type_name_for_test()
  # test @can_use_type_name_for_test
  # await test @create_entries_must_be_sync_functions
  # await test @template_methods_must_be_nullary
  # @throw_instructive_error_on_missing_type()
  # @allows_licensed_overrides()
  # await test @allows_licensed_overrides
  # await test @throw_instructive_error_when_wrong_type_of_isa_test_declared
  # @resolve_dotted_type()
  # test @resolve_dotted_type
  # @dotted_types_are_test_methods()
  # test @dotted_types_are_test_methods
  await test @


