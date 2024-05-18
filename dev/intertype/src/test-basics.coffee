

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
_equals                   = require '../../../apps/guy-test/node_modules/intertype/deps/jkroso-equals'
# equals                    = require '/home/flow/jzr/intertype-legacy/deps/jkroso-equals.js'
# equals                    = require '/home/flow/jzr/hengist/dev/intertype-2024-04-15/src/basics.test.coffee'
# equals                    = require ( require 'util' ).isDeepStrictEqual

#===========================================================================================================
# IMPLEMENT SET EQUALITY
#-----------------------------------------------------------------------------------------------------------
_set_contains = ( set, value ) ->
  for element from set
    return true if equals element, value
  return false

#-----------------------------------------------------------------------------------------------------------
equals = ( a, b ) ->
  if TMP_types.isa.set a
    return false unless TMP_types.isa.set b
    return false unless a.size is b.size
    for element from a
      return false unless _set_contains b, element
    return true
  else
    return _equals a, b

#-----------------------------------------------------------------------------------------------------------
test_set_equality_by_value = ->
  echo()
  result    = [ 1, [ 2 ], ]
  matcher1  = [ 1, [ 2 ], ]
  matcher2  = [ 1, [ 3 ], ]
  debug '^810-1^', equals result, matcher1
  debug '^810-2^', equals result, matcher2
  echo()
  result    = new Set [ 1, 2, ]
  matcher1  = new Set [ 1, 2, ]
  matcher2  = new Set [ 1, 3, ]
  debug '^810-3^', equals result, matcher1
  debug '^810-4^', equals result, matcher2
  echo()
  result    = new Set [ 1, [ 2 ], ]
  matcher1  = new Set [ 1, [ 2 ], ]
  matcher2  = new Set [ 1, [ 3 ], ]
  debug '^810-5^', equals result, matcher1
  debug '^810-6^', equals result, matcher2



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
###

Method to replace `T.throws()` and `try_and_show()`; takes 2, 3, or 4 arguments; with 4 arguments, second
argument should be error class

###
throws = ( T, matcher, f ) ->
  switch arity = arguments.length
    when 2 then [ T, matcher, f, ] = [ T, null, matcher, ]
    when 3 then null
    else throw new Error "`throws()` needs 2 or 3 arguments, got #{arity}"
  #.........................................................................................................
  error       = null
  is_matching = null
  #.........................................................................................................
  try ( urge '^992-1^', "`throws()` result of call:", f() ) catch error
    #.......................................................................................................
    if matcher?
      is_matching = false
      switch matcher_type = TMP_types.type_of matcher
        when 'text'
          is_matching = error.message is matcher
        when 'regex'
          matcher.lastIndex = 0
          is_matching = matcher.test error.message
        else
          throw new Error "^992-2^ expected a regex or a text, got a #{matcher_type}"
      if is_matching
        help '^992-3^', "OK           ", reverse error.message
      else
        urge '^992-4^', "error        ", reverse error.message
        warn '^992-5^', "doesn't match", reverse rpr matcher
        T?.fail "^992-6^ error #{rpr error.message} doesn't match #{rpr matcher}"
    #.......................................................................................................
    else
      help '^992-7^', "error        ", reverse error.message
  #.........................................................................................................
  unless error?
    warn '^992-8^', reverse message = "`throws()`: expected an error but none was thrown"
    T?.fail "^992-9^ `throws()`: expected an error but none was thrown"
  #.........................................................................................................
  return null

#===========================================================================================================
eq = ( ref, T, result, matcher ) ->
  ref = ref.padEnd 15
  if equals result, matcher
    help ref, "EQ OK"
    T?.ok true
  else
    warn ref, "not equal: "
    warn ref, "result:    ", rpr result
    warn ref, "matcher:   ", rpr matcher
    T?.ok false
  return null

#===========================================================================================================
try_and_show = ( T, f ) ->
  error = null
  try ( urge '^992-10^', "`try_and_show():` result of call:", f() ) catch error
    help '^992-11^', reverse "`try_and_show()`: #{rpr error.message}"
  unless error?
    warn '^992-12^', reverse message = "`try_and_show()`: expected an error but none was thrown"
    T?.fail "^992-13^ `try_and_show()`: expected an error but none was thrown"
  return null

#===========================================================================================================
safeguard = ( T, f ) ->
  error = null
  try f() catch error
    # throw error unless T?
    warn '^992-14^', reverse message = "`safeguard()`: #{rpr error.message}"
    T?.fail message
  return null




############################################################################################################
#
#===========================================================================================================
@interface = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  eq '^intertype-t1^', T, ( TMP_types.isa.object    INTERTYPE.types                               ), true
  eq '^intertype-t2^', T, ( TMP_types.isa.undefined INTERTYPE.types.get_isa                       ), true
  eq '^intertype-t3^', T, ( TMP_types.isa.undefined INTERTYPE.types.get_isa_optional              ), true
  eq '^intertype-t4^', T, ( TMP_types.isa.undefined INTERTYPE.types.get_validate                  ), true
  eq '^intertype-t5^', T, ( TMP_types.isa.undefined INTERTYPE.types.get_validate_optional         ), true
  eq '^intertype-t6^', T, ( TMP_types.isa.function  INTERTYPE.types._get_isa                      ), true
  eq '^intertype-t7^', T, ( TMP_types.isa.function  INTERTYPE.types._get_isa_optional             ), true
  eq '^intertype-t8^', T, ( TMP_types.isa.function  INTERTYPE.types._get_validate                 ), true
  eq '^intertype-t9^', T, ( TMP_types.isa.function  INTERTYPE.types._get_validate_optional        ), true
  eq '^intertype-t10^', T, ( TMP_types.isa.object    INTERTYPE.types                               ), true
  eq '^intertype-t11^', T, ( TMP_types.isa.object    INTERTYPE.types.isa                           ), true
  # eq '^intertype-t12^', T, ( TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
  eq '^intertype-t13^', T, ( TMP_types.isa.object    INTERTYPE.types.validate                      ), true
  # eq '^intertype-t14^', T, ( TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
  eq '^intertype-t15^', T, ( TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
  eq '^intertype-t16^', T, ( TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
  eq '^intertype-t17^', T, ( TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
  eq '^intertype-t18^', T, ( TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
  eq '^intertype-t19^', T, ( TMP_types.isa.object    INTERTYPE.types.create                        ), true
  eq '^intertype-t20^', T, ( TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
  eq '^intertype-t21^', T, ( TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
  eq '^intertype-t22^', T, ( TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
  eq '^intertype-t23^', T, ( TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
  #.........................................................................................................
  # eq '^intertype-t24^', T, ( INTERTYPE.types.isa.name           ), 'isa'
  # eq '^intertype-t24^', T, ( INTERTYPE.types.evaluate.name      ), 'evaluate'
  # eq '^intertype-t24^', T, ( INTERTYPE.types.validate.name      ), 'validate'
  # eq '^intertype-t24^', T, ( INTERTYPE.types.create.name        ), 'create'
  eq '^intertype-t24^', T, ( INTERTYPE.types.declare.name       ), 'declare'
  eq '^intertype-t25^', T, ( INTERTYPE.types.type_of.name       ), 'type_of'
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
  debug '^4324^', 'null           ', types.declarations.null
  debug '^4324^', 'function       ', types.declarations.function
  debug '^4324^', 'boolean        ', types.declarations.boolean
  debug '^4324^', 'text           ', types.declarations.text
  debug '^4324^', 'asyncfunction  ', types.declarations.asyncfunction
  debug '^4324^'
  debug '^4324^', 'null           ', types.isa.null
  debug '^4324^', 'function       ', types.isa.function
  debug '^4324^', 'boolean        ', types.isa.boolean
  debug '^4324^', 'text           ', types.isa.text
  debug '^4324^', 'asyncfunction  ', types.isa.asyncfunction
  debug '^4324^'
  debug '^4324^', 'null           ', types.isa.optional.null
  debug '^4324^', 'function       ', types.isa.optional.function
  debug '^4324^', 'boolean        ', types.isa.optional.boolean
  debug '^4324^', 'text           ', types.isa.optional.text
  debug '^4324^', 'asyncfunction  ', types.isa.optional.asyncfunction
  debug '^4324^'
  debug '^4324^', 'null           ', types.validate.null
  debug '^4324^', 'function       ', types.validate.function
  debug '^4324^', 'boolean        ', types.validate.boolean
  debug '^4324^', 'text           ', types.validate.text
  debug '^4324^', 'asyncfunction  ', types.validate.asyncfunction
  T?.eq ( types.isa.asyncfunction.name               ), 'isa.asyncfunction'
  T?.eq ( types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  T?.eq ( types.validate.asyncfunction.name          ), 'validate.asyncfunction'
  T?.eq ( types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  T?.eq types.declarations.null?.type,          'null'
  T?.eq types.declarations.function?.type,      'function'
  T?.eq types.declarations.boolean?.type,       'boolean'
  T?.eq types.declarations.text?.type,          'text'
  T?.eq types.declarations.asyncfunction?.type, 'asyncfunction'
  T?.eq types.isa.null?.name,                   'isa.null'
  T?.eq types.isa.function?.name,               'isa.function'
  T?.eq types.isa.boolean?.name,                'isa.boolean'
  T?.eq types.isa.text?.name,                   'isa.text'
  T?.eq types.isa.asyncfunction?.name,          'isa.asyncfunction'
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
  throws T, /method 'isa.float' expects 1 arguments, got 2/, -> isa.float 3, 4
  throws T, /method 'isa.float' expects 1 arguments, got 0/, -> isa.float()
  done?()

#-----------------------------------------------------------------------------------------------------------
@methods_check_arity = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  #.........................................................................................................
  throws T, /method 'isa.float' expects 1 arguments, got 2/, -> isa.float 3, 4
  throws T, /method 'isa.float' expects 1 arguments, got 0/, -> isa.float()
  throws T, /method 'isa.optional.float' expects 1 arguments, got 2/, -> isa.optional.float 3, 4
  throws T, /method 'isa.optional.float' expects 1 arguments, got 0/, -> isa.optional.float()
  throws T, /method 'validate.float' expects 1 arguments, got 2/, -> validate.float 3, 4
  throws T, /method 'validate.float' expects 1 arguments, got 0/, -> validate.float()
  throws T, /method 'validate.optional.float' expects 1 arguments, got 2/, -> validate.optional.float 3, 4
  throws T, /method 'validate.optional.float' expects 1 arguments, got 0/, -> validate.optional.float()
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
@same_basic_types = ( T, done ) ->
  # T?.halt_on_error()
  { isa
    validate
    type_of   } = require '../../../apps/intertype'
  #.........................................................................................................
  boolean                 = false
  $function               = ->
  asyncfunction           = -> await null
  generatorfunction       = ( -> yield null )
  generator               = ( -> yield null )()
  asyncgeneratorfunction  = ( -> yield await null )
  asyncgenerator          = ( -> yield await null )()
  symbol                  = Symbol 'what'
  #.........................................................................................................
  eq '^intertype-t26^', T, ( isa.boolean                     boolean                 ), true
  eq '^intertype-t27^', T, ( isa.function                    $function               ), true
  eq '^intertype-t28^', T, ( isa.asyncfunction               asyncfunction           ), true
  eq '^intertype-t29^', T, ( isa.generatorfunction           generatorfunction       ), true
  eq '^intertype-t30^', T, ( isa.asyncgeneratorfunction      asyncgeneratorfunction  ), true
  eq '^intertype-t31^', T, ( isa.asyncgenerator              asyncgenerator          ), true
  eq '^intertype-t32^', T, ( isa.generator                   generator               ), true
  eq '^intertype-t33^', T, ( isa.symbol                      symbol                  ), true
  #.........................................................................................................
  eq '^intertype-t34^', T, ( validate.boolean                boolean                 ), boolean
  eq '^intertype-t35^', T, ( validate.function               $function               ), $function
  eq '^intertype-t36^', T, ( validate.asyncfunction          asyncfunction           ), asyncfunction
  eq '^intertype-t37^', T, ( validate.generatorfunction      generatorfunction       ), generatorfunction
  eq '^intertype-t38^', T, ( validate.asyncgeneratorfunction asyncgeneratorfunction  ), asyncgeneratorfunction
  eq '^intertype-t39^', T, ( validate.asyncgenerator         asyncgenerator          ), asyncgenerator
  eq '^intertype-t40^', T, ( validate.generator              generator               ), generator
  eq '^intertype-t41^', T, ( validate.symbol                 symbol                  ), symbol
  #.........................................................................................................
  eq '^intertype-t42^', T, ( type_of boolean                                         ), 'boolean'
  eq '^intertype-t43^', T, ( type_of $function                                       ), 'function'
  eq '^intertype-t44^', T, ( type_of asyncfunction                                   ), 'asyncfunction'
  eq '^intertype-t45^', T, ( type_of generatorfunction                               ), 'generatorfunction'
  eq '^intertype-t46^', T, ( type_of asyncgeneratorfunction                          ), 'asyncgeneratorfunction'
  eq '^intertype-t47^', T, ( type_of asyncgenerator                                  ), 'asyncgenerator'
  eq '^intertype-t48^', T, ( type_of generator                                       ), 'generator'
  eq '^intertype-t49^', T, ( type_of symbol                                          ), 'symbol'
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
  throws T, /not allowed to re-declare type 'optional'/, -> new INTERTYPE.Intertype_minimal \
    { optional: ( ( x ) -> true ), }
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
  try_and_show T, -> new Intertype { foo: undefined, }
  try_and_show T, -> new Intertype { foo: null, }
  try_and_show T, -> new Intertype { foo: {}, }
  try_and_show T, -> new Intertype { foo: { test: null, }, }
  try_and_show T, -> new Intertype { foo: { test: false, }, }
  try_and_show T, -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }
  try_and_show T, -> new Intertype { foo: 'quux', }
  throws T, /expected function with 1 parameters, got one with 0/, -> new Intertype { foo: ( -> ), }
  throws T, /expected function with 1 parameters, got one with 2/, -> new Intertype { foo: ( ( a, b ) -> ), }
  throws T, /expected type name, method, or object to indicate test method, got a boolean/,    -> new Intertype { foo: true, }
  throws T, /expected type name, method, or object to indicate test method, got a undefined/,  -> new Intertype { foo: undefined, }
  throws T, /expected type name, method, or object to indicate test method, got a null/,       -> new Intertype { foo: null, }
  throws T, /expected type name, method, or object to indicate test method, got a undefined/,  -> new Intertype { foo: {}, }
  throws T, /expected type name, method, or object to indicate test method, got a null/,       -> new Intertype { foo: { test: null, }, }
  throws T, /expected type name, method, or object to indicate test method, got a boolean/,    -> new Intertype { foo: { test: false, }, }
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
  T?.eq ( isa.basetype 'optional'   ), false
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
  T?.eq ( isa.basetype 'toString'   ), false
  T?.eq ( isa.basetype null         ), false
  T?.eq ( isa.basetype undefined    ), false
  T?.eq ( isa.basetype 4            ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_licensed_overrides = ( T, done ) ->
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
    throws T, /not allowed to re-declare type 'float'/, -> ( types.declare overrides )
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
    throws T, /not allowed to re-declare type 'float'/, -> ( types.declare overrides )
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
    throws T, /not allowed to re-declare basetype 'anything'/, -> ( types.declare overrides )
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
  { Intertype
    Intertype_minimal } = require '../../../apps/intertype'
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
    eq '^intertype-t50^', T, ( TMP_types.isa.object types.declarations       ), true
    eq '^intertype-t51^', T, ( TMP_types.isa.object types.declarations.float ), true
    eq '^intertype-t52^', T, ( TMP_types.isa.object types.declarations.text  ), true
    #.......................................................................................................
    try_and_show T, -> types.create.boolean()
    throws T, /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/, \
      -> types.create.boolean()
    try_and_show T, -> types.create.text 'foo'
    throws T, /expected 0 arguments, got 1/, -> types.create.text 'foo'
    #.......................................................................................................
    eq '^intertype-t53^', T, types.create.text(), ''
    eq '^intertype-t54^', T, types.create.integer(), 0
    eq '^intertype-t55^', T, types.create.float(), 0
    eq '^intertype-t56^', T, ( types.create.float '123.45' ), 123.45
    try_and_show T, -> types.create.float '***'
    throws T, /expected `create\.float\(\)` to return a float but it returned a nan/, -> types.create.float '***'
    #.......................................................................................................
    return null
  #.........................................................................................................
  do =>
    declarations =
      quantity:
        test:       'object'
        template:
          q:        0
          u:        'u'
      'quantity.q': 'float'
      'quantity.u': 'text'
    { isa
      validate
      create    } = new Intertype declarations
    eq '^intertype-t57^', T, ( create.quantity()    ), { q: 0, u: 'u', }
    return null
  #.........................................................................................................
  do =>
    declarations =
      quantity:
        test:       'object'
        template:
          q:        0
          u:        'u'
        fields:
          q:        'float'
          u:        'text'
    { isa
      validate
      create    } = new Intertype declarations
    eq '^intertype-t58^', T, ( create.quantity()                         ), { q: 0, u: 'u', }
    eq '^intertype-t59^', T, ( create.quantity { q: 123, }               ), { q: 123, u: 'u', }
    eq '^intertype-t60^', T, ( create.quantity { u: 'kg', }              ), { q: 0, u: 'kg', }
    eq '^intertype-t61^', T, ( create.quantity { u: 'kg', foo: 'bar', }  ), { q: 0, u: 'kg', foo: 'bar', }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@builtin_types_support_create = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types       = new Intertype()
    { create
      type_of } = types
    eq '^intertype-t62^', T, ( create.float()         ), 0
    eq '^intertype-t63^', T, ( create.boolean()       ), false
    eq '^intertype-t64^', T, ( create.object()        ), {}
    eq '^intertype-t65^', T, ( create.float()         ), 0
    eq '^intertype-t66^', T, ( create.infinity()      ), Infinity
    eq '^intertype-t67^', T, ( create.text()          ), ''
    eq '^intertype-t68^', T, ( create.list()          ), []
    eq '^intertype-t69^', T, ( create.regex()         ), new RegExp()
    eq '^intertype-t70^', T, ( type_of create.function()      ), 'function'
    eq '^intertype-t71^', T, ( type_of create.asyncfunction() ), 'asyncfunction'
    eq '^intertype-t72^', T, ( type_of create.symbol()        ), 'symbol'
    throws T, /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/, -> ( create.basetype()      )
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@template_functions_are_called_in_template_fields = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types       = new Intertype()
    { declare
      create
      isa
      type_of
      declarations  } = types
    declare quantity:
      test:     'object'
      fields:
        q:      'float'
        u:      'text'
      template:
        q:      -> @create.float()
        u:      -> 'u'
    debug '^3234^', create.quantity()
    debug '^3234^', declarations.quantity
    eq '^intertype-t73^', T, ( create.quantity()                          ), { q: 0, u: 'u', }
    eq '^intertype-t74^', T, ( isa.quantity { q: 9, }                     ), false
    eq '^intertype-t75^', T, ( type_of declarations.quantity.sub_tests.q  ), 'function'
    eq '^intertype-t76^', T, ( type_of declarations.quantity.sub_tests.u  ), 'function'
    return null
  #.........................................................................................................
  do =>
    types       = new Intertype()
    { declare
      create
      type_of } = types
    declare foo:
      test:     'object'
      fields:
        foo:
          test:   'object'
          fields:
            bar:
              test:     'float'
      template:
        foo:
          bar: 123
    debug '^3234^', create.foo()
    eq '^intertype-t77^', T, ( create.foo() ), { foo: { bar: 123, } }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@type_object_assumed_if_fields_present = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types       = new Intertype()
    { declare
      declarations
      create
      type_of
      isa     } = types
    declare quantity:
      # test: 'object'
      fields:
        q:      'float'
        u:      'text'
    eq '^intertype-t78^', T, ( type_of declarations.quantity.test ), 'function'
    debug '^342342^', declarations.quantity
    eq '^intertype-t79^', T, ( type_of declarations.quantity.sub_tests.q ), 'function'
    eq '^intertype-t80^', T, ( type_of declarations.quantity.sub_tests.u ), 'function'
    eq '^intertype-t81^', T, ( isa.quantity { q: 987, u: 's', } ), true
    eq '^intertype-t82^', T, ( isa.quantity { q: 987, } ), false
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
    # try_and_show T, -> types.declare { z: 'quux', }
    throws T, /unknown type 'quux'/, -> types.declare { z: 'quux', }
    types.declare { z: 'float', }
    T?.eq ( types.isa.z 12 ), true
    T?.eq types.isa.float.name, 'isa.float'
    T?.eq types.declarations.float.type, 'float'
    T?.eq types.declarations.float.test.name, 'float'
    T?.eq types.isa.z.name, 'isa.z'
    T?.eq types.declarations.z.type, 'z'
    T?.eq types.declarations.z.test.name, 'z' # ?
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: { test: 'quux', }, }
    throws T, /unknown type 'quux'/, -> types.declare { z: { test: 'quux', }, }
    types.declare { z: { test: 'float', }, }
    T?.eq ( types.isa.z 12 ), true
    T?.eq types.isa.float.name, 'isa.float'
    T?.eq types.declarations.float.type, 'float'
    T?.eq types.declarations.float.test.name, 'float'
    T?.eq types.isa.z.name, 'isa.z'
    T?.eq types.declarations.z.type, 'z'
    T?.eq types.declarations.z.test.name, 'z'
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
    T?.eq ( types.isa.foo.bar.baz null ), false
    T?.eq ( types.isa.foo.bar.baz 4 ), true
    T?.eq ( types.isa.foo.bar.baz +Infinity ), false
    # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
    # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    return null
  # #.........................................................................................................
  # do =>
  #   types = new Intertype()
  #   T?.eq ( Reflect.has types.declarations, 'foo'         ), false
  #   types.declare { foo: 'object', }
  #   T?.eq ( Reflect.has types.declarations, 'foo'         ), true
  #   T?.eq ( Reflect.has types.declarations, 'foo.bar'     ), false
  #   types.declare { 'foo.bar': 'object', }
  #   T?.eq ( Reflect.has types.declarations, 'foo.bar'     ), true
  #   T?.eq ( Reflect.has types.declarations, 'foo.bar.baz' ), false
  #   types.declare { 'foo.bar.baz': 'optional.float', }
  #   T?.eq ( Reflect.has types.declarations, 'foo.bar.baz' ), true
  #   T?.eq ( types.isa.foo.bar.baz null ), true
  #   T?.eq ( types.isa.foo.bar.baz 4 ), true
  #   T?.eq ( types.isa.foo.bar.baz +Infinity ), false
  #   # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
  #   # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
  #   try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
  #   return null
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
  do =>
    types = new Intertype()
    types.declare { 'foo':      'float', }
    types.declare { 'foo.bar':  'text',   }
    do =>
      d = 3
      # d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
      T?.eq ( types.isa.foo d ), false
      return null
    do =>
      d = new Number 3
      d.bar = '?'
      T?.eq ( d.bar ), '?'
      # still won't work b/c `float` doesn't accept objects (which is a good thing):
      T?.eq ( types.isa.foo d ), false
      return null
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':        'object', }
    types.declare { 'foo.bind':   'float',   }
    types.declare { 'foo.apply':  'float',   }
    types.declare { 'foo.call':   'float',   }
    types.declare { 'foo.name':   'float',   }
    types.declare { 'foo.length': 'float',   }
    T?.eq ( types.isa.foo {} ), false
    T?.eq ( types.isa.foo { bind: 1, apply: 2, call: 3, name: 4, length: 5, } ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':        'object',           }
    types.declare { 'foo.text':   ( ( x ) -> x is 1 ) }
    types.declare { 'foo.float':  ( ( x ) -> x is 2 ) }
    T?.eq ( types.isa.foo {} ), false
    T?.eq ( types.isa.foo { text: 1, float: 2, } ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_refs_to_dotted_types = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'person':                       'object', }
    types.declare { 'person.name':                  'text',   }
    types.declare { 'person.address':               'object', }
    types.declare { 'person.address.city':          'object', }
    types.declare { 'person.address.city.name':     'text',   }
    types.declare { 'person.address.city.postcode': 'text',   }
    types.declare { 'mycity':                       ( ( x ) -> @isa.person.address.city x ), }
    # debug '^434-1^', types.declarations[ 'person.address.city' ]
    # debug '^434-2^', types.declarations.mycity
    urge '^342-1^', ( types.declarations.mycity )
    T?.eq ( types.isa.person.address.city {} ), false
    T?.eq ( types.isa.person.address.city null ), false
    T?.eq ( types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    T?.eq ( types.isa.mycity {} ), false
    T?.eq ( types.isa.mycity null ), false
    T?.eq ( types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    types.declare { 'mycity':                       'person.address.city', }
    # debug '^434-3^', types.declarations[ 'person.address.city' ]
    # debug '^434-4^', types.declarations.mycity
    urge '^342-2^', ( types.declarations.mycity )
    T?.eq ( types.isa.person.address.city {} ), false
    T?.eq ( types.isa.person.address.city null ), false
    T?.eq ( types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    T?.eq ( types.isa.mycity {} ), false
    T?.eq ( types.isa.mycity null ), false
    T?.eq ( types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    types.declare { 'mycity':                       ( ( x ) -> @isa.optional.person.address.city x ), }
    # debug '^434-5^', types.declarations[ 'person.address.city' ]
    # debug '^434-6^', types.declarations.mycity
    urge '^342-3^', ( types.declarations.mycity )
    T?.eq ( types.isa.person.address.city {} ), false
    T?.eq ( types.isa.person.address.city null ), false
    T?.eq ( types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    T?.eq ( types.isa.optional.person.address.city {} ), false
    T?.eq ( types.isa.optional.person.address.city null ), true
    T?.eq ( types.isa.optional.person.address.city { name: 'P', postcode: 'SO36', } ), true
    T?.eq ( types.isa.mycity {} ), false
    T?.eq ( types.isa.mycity null ), true
    T?.eq ( types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
    return null
  #.........................................................................................................
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @can_use_optional_refs_to_dotted_types = ( T, done ) ->
#   { Intertype } = require '../../../apps/intertype'
#   #.........................................................................................................
#   safeguard T, => do =>
#     types   = new Intertype()
#     { declare
#       isa } = types
#     declare { maybefloat1: 'optional.float', }
#     #.......................................................................................................
#     T?.eq ( isa.float       null  ), false
#     T?.eq ( isa.float       true  ), false
#     T?.eq ( isa.float       0     ), true
#     T?.eq ( isa.maybefloat1 null  ), true
#     T?.eq ( isa.maybefloat1 true  ), false
#     T?.eq ( isa.maybefloat1 0     ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   safeguard T, => do =>
#     types   = new Intertype()
#     { declare
#       isa } = types
#     declare { 'q':              'object', }
#     declare { 'q.maybefloat2':  'optional.float', }
#     #.......................................................................................................
#     T?.eq ( isa.q             null                    ), false
#     T?.eq ( isa.q             {}                      ), true
#     T?.eq ( isa.q             { maybefloat2: null }   ), true
#     T?.eq ( isa.q             { maybefloat2: false }  ), false
#     T?.eq ( isa.q             { maybefloat2: 3 }      ), true
#     T?.eq ( isa.q.maybefloat2  null                   ), true
#     T?.eq ( isa.q.maybefloat2  true                   ), false
#     T?.eq ( isa.q.maybefloat2  0                      ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   safeguard T, => do =>
#     types   = new Intertype()
#     { declare
#       isa } = types
#     declare { 'q':              'optional.object', }
#     declare { 'q.maybefloat3':  'optional.float', }
#     # isa.q null
#     #.......................................................................................................
#     safeguard T, => T?.eq ( isa.q             null                    ), true
#     safeguard T, => T?.eq ( isa.q             {}                      ), true
#     safeguard T, => T?.eq ( isa.q             { maybefloat3: null }   ), true
#     safeguard T, => T?.eq ( isa.q             { maybefloat3: false }  ), false
#     safeguard T, => T?.eq ( isa.q             { maybefloat3: 3 }      ), true
#     safeguard T, => T?.eq ( isa.q.maybefloat3  null                   ), true
#     safeguard T, => T?.eq ( isa.q.maybefloat3  true                   ), false
#     safeguard T, => T?.eq ( isa.q.maybefloat3  0                      ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   safeguard T, => do =>
#     types   = new Intertype()
#     { declare
#       validate
#       isa } = types
#     declare { 'person':                       'object', }
#     declare { 'person.name':                  'text',   }
#     declare { 'person.address':               'object', }
#     declare { 'person.address.city':          'object', }
#     declare { 'person.address.city.name':     'text',   }
#     declare { 'person.address.city.postcode': 'text',   }
#     declare { 'maybesomeone':                 'optional.person', }
#     declare { 'mycity':                       'optional.person.address.city', }
#     #.......................................................................................................
#     T?.eq ( isa.person        null                                                            ), false
#     T?.eq ( isa.person        {}                                                              ), false
#     T?.eq ( isa.person        { name: 'Fred',                                               } ), false
#     T?.eq ( isa.person        { name: 'Fred', address: {},                                  } ), false
#     T?.eq ( isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
#     T?.eq ( isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
#     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
#     T?.eq ( isa.maybesomeone  null                                                            ), true
#     # T?.eq ( isa.maybesomeone  {}                                                              ), false
#     # T?.eq ( isa.maybesomeone  { name: 'Fred',                                               } ), false
#     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
#     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
#     # T?.eq ( isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   done?()

#-----------------------------------------------------------------------------------------------------------
@forbidden_to_define_fields_on_basetypes = ( T, done ) ->
  T?.halt_on_error()
  { Intertype
    declarations  } = require '../../../apps/intertype'
  #.........................................................................................................
  await do =>
    types         = new Intertype()
    { declare
      validate
      isa } = types
    try_and_show T, -> types.declare { 'optional.d':    ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'anything.d':    ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'nothing.d':     ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'something.d':   ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'null.d':        ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'undefined.d':   ( ( x ) -> ), }
    try_and_show T, -> types.declare { 'unknown.d':     ( ( x ) -> ), }
    throws T, /illegal use of 'optional' in declaration of type 'optional.d'/,             -> types.declare { 'optional.d':    ( ( x ) -> ), }
    throws T, /illegal use of basetype 'anything' in declaration of type 'anything.d'/,   -> types.declare { 'anything.d':    ( ( x ) -> ), }
    throws T, /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/,     -> types.declare { 'nothing.d':     ( ( x ) -> ), }
    throws T, /illegal use of basetype 'something' in declaration of type 'something.d'/, -> types.declare { 'something.d':   ( ( x ) -> ), }
    throws T, /illegal use of basetype 'null' in declaration of type 'null.d'/,           -> types.declare { 'null.d':        ( ( x ) -> ), }
    throws T, /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/, -> types.declare { 'undefined.d':   ( ( x ) -> ), }
    throws T, /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/,     -> types.declare { 'unknown.d':     ( ( x ) -> ), }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@internal_type_of_method = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype
    declarations
    __type_of     } = require '../../../apps/intertype'
  #.........................................................................................................
  _isa = Object.fromEntries ( [ type, declaration.test, ] for type, declaration of declarations )
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq '^intertype-t83^', T, ( __type_of _isa, null          ), 'null'
    eq '^intertype-t84^', T, ( __type_of _isa, undefined     ), 'undefined'
    eq '^intertype-t85^', T, ( __type_of _isa, 4             ), 'float'
    eq '^intertype-t86^', T, ( __type_of _isa, ->            ), 'function'
    eq '^intertype-t87^', T, ( __type_of _isa, -> await null ), 'asyncfunction'
    eq '^intertype-t88^', T, ( __type_of _isa, {}            ), 'object'
    eq '^intertype-t89^', T, ( __type_of _isa, []            ), 'list'
    eq '^intertype-t90^', T, ( __type_of _isa, +Infinity     ), 'infinity'
    eq '^intertype-t91^', T, ( __type_of _isa, -Infinity     ), 'infinity'
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@deepmerge = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype
    declarations
    deepmerge   } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    sub = { foo: 3, }
    probe =
      bar:
        baz:
          sub: sub
      gnu: 4
    result = deepmerge probe
    eq '^intertype-t92^', T, result, probe
    eq '^intertype-t93^', T, ( result.bar         is probe.bar          ), false
    eq '^intertype-t94^', T, ( result.bar.baz     is probe.bar.baz      ), false
    eq '^intertype-t95^', T, ( result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq '^intertype-t96^', T, ( result.bar.baz.sub is sub                ), false
    eq '^intertype-t97^', T, ( probe.bar.baz.sub  is sub                ), true
    return null
  #.........................................................................................................
  do =>
    sub = { foo: 3, }
    probe =
      bar:
        baz:
          sub: sub
      gnu: 4
    types = new Intertype { q: { test: 'object', template: probe, }, }
    result = types.create.q()
    eq '^intertype-t98^', T, result, probe
    eq '^intertype-t99^', T, ( result.bar         is probe.bar          ), false
    eq '^intertype-t100^', T, ( result.bar.baz     is probe.bar.baz      ), false
    eq '^intertype-t101^', T, ( result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq '^intertype-t102^', T, ( result.bar.baz.sub is sub                ), false
    eq '^intertype-t103^', T, ( probe.bar.baz.sub  is sub                ), true
    return null
  #.........................................................................................................
  do =>
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@validate_dotted_types = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    { validate }  = types
    types.declare { 'person':                       'object', }
    types.declare { 'person.name':                  'text',   }
    types.declare { 'person.address':               'object', }
    types.declare { 'person.address.city':          'object', }
    types.declare { 'person.address.city.name':     'text',   }
    types.declare { 'person.address.city.postcode': 'text',   }
    #.......................................................................................................
    throws T, -> validate.person null
    throws T, -> validate.person.address null
    throws T, -> validate.person.address.city null
    throws T, -> validate.person.address.city.postcode null
    #.......................................................................................................
    T?.eq ( types.isa.person.address.city.postcode 3 ), false
    throws T, /expected a person.address.city.postcode/, -> validate.person.address.city.postcode 3
    #.......................................................................................................
    T?.eq ( types.isa.person.address.city { name: 'P', } ), false
    throws T, /expected a person.address.city/, -> validate.person.address.city { name: 'P', }
    # #.......................................................................................................
    T?.eq ( types.isa.person.address.city { postcode: '3421', } ), false
    throws T, /method 'validate.person.address.city' expects 1 arguments, got 0/, -> validate.person.address.city()
    throws T, /expected a person.address.city/, -> validate.person.address.city null
    throws T, /expected a person.address.city/, -> validate.person.address.city '3421'
    throws T, /expected a person.address.city/, -> validate.person.address.city { postcode: '3421', }
    #.......................................................................................................
    T?.eq ( types.isa.person.address.city { name: 'P', postcode: '3421', } ), true
    T?.eq ( validate.person.address.city { name: 'P', postcode: '3421', } ), { name: 'P', postcode: '3421', }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_evaluate = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    { validate
      isa
      evaluate }  = types
    types.declare { 'person':                       'object', }
    types.declare { 'person.name':                  'text',   }
    types.declare { 'person.address':               'object', }
    types.declare { 'person.address.city':          'object', }
    types.declare { 'person.address.city.name':     'text',   }
    types.declare { 'person.address.city.postcode': 'text',   }
    #.......................................................................................................
    throws T, /`optional` is not a legal type for `evaluate` methods/, -> evaluate.optional 1
    throws T, /`optional` is not a legal type for `evaluate` methods/, -> evaluate.optional.person 1
    #.......................................................................................................
    eq '^intertype-t104^', T, ( isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq '^intertype-t105^', T, ( evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq '^intertype-t106^', T, ( isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq '^intertype-t107^', T, ( evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': true, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq '^intertype-t108^', T, ( isa.person       {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq '^intertype-t109^', T, ( evaluate.person  {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq '^intertype-t110^', T, ( isa.person       {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq '^intertype-t111^', T, ( evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq '^intertype-t112^', T, ( isa.person       null  ), false
    eq '^intertype-t113^', T, ( evaluate.person  null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq '^intertype-t114^', T, ( isa.person       {}    ), false
    eq '^intertype-t115^', T, ( evaluate.person  {}    ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    { validate
      isa
      evaluate }  = types
    types.declare { 'person':                       'object', }
    types.declare { 'person.address':               'object', }
    types.declare { 'person.address.city':          'object', }
    types.declare { 'person.address.city.postcode': 'text',   }
    types.declare { 'person.address.city.name':     'text',   }
    types.declare { 'person.name':                  'text',   }
    #.......................................................................................................
    eq '^intertype-t116^', T, ( isa.person                   { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq '^intertype-t117^', T, ( evaluate.person              { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq '^intertype-t118^', T, ( Object.keys evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq '^intertype-t119^', T, ( isa.person                   {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq '^intertype-t120^', T, ( evaluate.person              {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq '^intertype-t121^', T, ( Object.keys evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq '^intertype-t122^', T, ( isa.person                   null  ), false
    eq '^intertype-t123^', T, ( evaluate.person              null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq '^intertype-t124^', T, ( Object.keys evaluate.person  null  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq '^intertype-t125^', T, ( isa.person                   {}  ), false
    eq '^intertype-t126^', T, ( evaluate.person              {}  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq '^intertype-t127^', T, ( Object.keys evaluate.person  {}  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq '^intertype-t128^', T, ( isa.person.address                   { city: { name: 'Atown', postcode: 'VA1234' } } ), true
    eq '^intertype-t129^', T, ( evaluate.person.address              { city: { name: 'Atown', postcode: 'VA1234' } } ), { 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq '^intertype-t130^', T, ( Object.keys evaluate.person.address  { city: { name: 'Atown', postcode: 'VA1234' } } ), [ 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name' ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@walk_prefixes = ( T, done ) ->
  # T?.halt_on_error()
  { walk_prefixes
    isa
    type_of                     } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    eq '^intertype-t131^', T, ( isa.generatorfunction walk_prefixes ), true
    eq '^intertype-t132^', T, [ ( walk_prefixes 'one'                )..., ], []
    eq '^intertype-t133^', T, [ ( walk_prefixes 'one.two'            )..., ], [ 'one' ]
    eq '^intertype-t134^', T, [ ( walk_prefixes 'one.two.three'      )..., ], [ 'one', 'one.two', ]
    eq '^intertype-t135^', T, [ ( walk_prefixes 'one.two.three.four' )..., ], [ 'one', 'one.two', 'one.two.three', ]
    ### TAINT should not allow empty namers: ###
    eq '^intertype-t136^', T, [ ( walk_prefixes '.one.two.three'     )..., ], [ '', '.one', '.one.two', ]
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
@can_use_qualifiers = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations =
      'empty':            { test: 'object', role: 'qualifier', }
      'nonempty':         { test: 'object', role: 'qualifier', }
      'empty.list':       ( x ) -> ( @isa.list  x ) and ( x.length  is  0 )
      'empty.text':       ( x ) -> ( @isa.text  x ) and ( x.length  is  0 )
      'empty.set':        ( x ) -> ( @isa.set   x ) and ( x.size    is  0 )
      'nonempty.list':    ( x ) -> ( @isa.list  x ) and ( x.length  >   0 )
      'nonempty.text':    ( x ) -> ( @isa.text  x ) and ( x.length  >   0 )
      'nonempty.set':     ( x ) -> ( @isa.set   x ) and ( x.size    >   0 )
    types   = new Intertype declarations
    { isa } = types
    eq '^intertype-t137^', T, ( isa.empty.list    []          ), true
    eq '^intertype-t138^', T, ( isa.empty.list    [ 'A', ]    ), false
    eq '^intertype-t139^', T, ( isa.empty.list    4           ), false
    eq '^intertype-t140^', T, ( isa.nonempty.list []          ), false
    eq '^intertype-t141^', T, ( isa.nonempty.list [ 'A', ]    ), true
    eq '^intertype-t142^', T, ( isa.nonempty.list 4           ), false
    eq '^intertype-t143^', T, ( isa.empty.text    ''          ), true
    eq '^intertype-t144^', T, ( isa.empty.text    'A'         ), false
    eq '^intertype-t145^', T, ( isa.empty.text    4           ), false
    eq '^intertype-t146^', T, ( isa.nonempty.text ''          ), false
    eq '^intertype-t147^', T, ( isa.nonempty.text 'A'         ), true
    eq '^intertype-t148^', T, ( isa.nonempty.text 4           ), false
    ### this doesn't make a terrible lot of sense: ###
    eq '^intertype-t149^', T, ( isa.empty { list: [], text: '', set: new Set() } ), false
    return null
  #.........................................................................................................
  do =>
    declarations =
      'empty':            { role: 'qualifier', }
      'nonempty':         { role: 'qualifier', }
      'empty.list':       ( x ) -> ( @isa.list  x ) and ( x.length  is  0 )
      'empty.text':       ( x ) -> ( @isa.text  x ) and ( x.length  is  0 )
      'empty.set':        ( x ) -> ( @isa.set   x ) and ( x.size    is  0 )
      'nonempty.list':    ( x ) -> ( @isa.list  x ) and ( x.length  >   0 )
      'nonempty.text':    ( x ) -> ( @isa.text  x ) and ( x.length  >   0 )
      'nonempty.set':     ( x ) -> ( @isa.set   x ) and ( x.size    >   0 )
    types         = new Intertype declarations
    { isa
      validate  } = types
    eq '^intertype-t150^', T, ( isa.empty.list    []          ), true
    eq '^intertype-t151^', T, ( isa.empty.list    [ 'A', ]    ), false
    eq '^intertype-t152^', T, ( isa.empty.list    4           ), false
    eq '^intertype-t153^', T, ( isa.nonempty.list []          ), false
    eq '^intertype-t154^', T, ( isa.nonempty.list [ 'A', ]    ), true
    eq '^intertype-t155^', T, ( isa.nonempty.list 4           ), false
    eq '^intertype-t156^', T, ( isa.empty.text    ''          ), true
    eq '^intertype-t157^', T, ( isa.empty.text    'A'         ), false
    eq '^intertype-t158^', T, ( isa.empty.text    4           ), false
    eq '^intertype-t159^', T, ( isa.nonempty.text ''          ), false
    eq '^intertype-t160^', T, ( isa.nonempty.text 'A'         ), true
    eq '^intertype-t161^', T, ( isa.nonempty.text 4           ), false
    #.......................................................................................................
    eq '^intertype-t162^', T, ( isa.empty []                  ), true
    eq '^intertype-t163^', T, ( isa.empty ''                  ), true
    eq '^intertype-t164^', T, ( isa.empty new Set()           ), true
    eq '^intertype-t165^', T, ( isa.empty [ 1, ]              ), false
    eq '^intertype-t166^', T, ( isa.empty 'A'                 ), false
    eq '^intertype-t167^', T, ( isa.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq '^intertype-t162^', T, ( validate.empty []                  ), []
    eq '^intertype-t163^', T, ( validate.empty ''                  ), ''
    eq '^intertype-t164^', T, ( validate.empty new Set()           ), new Set()
    throws T, /expected a empty, got a list/, -> ( validate.empty [ 1, ]              )
    throws T, /expected a empty, got a text/, -> ( validate.empty 'A'                 )
    throws T, /expected a empty, got a set/,  -> ( validate.empty new Set 'abc'       )
    return null
    #.......................................................................................................
    eq '^intertype-t162^', T, ( isa.opttional.empty []                  ), true
    eq '^intertype-t163^', T, ( isa.opttional.empty ''                  ), true
    eq '^intertype-t164^', T, ( isa.opttional.empty new Set()           ), true
    eq '^intertype-t165^', T, ( isa.opttional.empty [ 1, ]              ), false
    eq '^intertype-t166^', T, ( isa.opttional.empty 'A'                 ), false
    eq '^intertype-t167^', T, ( isa.opttional.empty new Set 'abc'       ), false
  #.........................................................................................................
  done?()






#-----------------------------------------------------------------------------------------------------------
@disallow_rhs_optional = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    ### TAINT observe the out-comment messages would perhaps make more sense as they are more specific ###
    T?.eq ( ( new Intertype() ).declare { foo: 'float', } ), null
    T?.eq ( ( new Intertype() ).declare { foo: 'text',  } ), null
    # ( new Intertype() ).declare { foo: 'optional', }
    throws T, /illegal use of 'optional' in declaration of type 'foo'/, -> ( new Intertype() ).declare { foo: 'optional', }
    throws T, /unknown type 'qqq'/,             -> ( new Intertype() ).declare { foo: 'qqq', }
    throws T, /illegal use of 'optional' in declaration of type 'foo'/, -> ( new Intertype() ).declare { foo: 'optional.float', }
    throws T, /illegal use of basetype 'anything' in declaration of type 'foo'/, -> ( new Intertype() ).declare { foo: 'anything.float', }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parallel_behavior_of_isa_validate_mandatory_and_optional = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { isa
      validate  } = new Intertype
        normalfloat: ( ( x ) -> ( @isa.float x ) and ( 0 <= x <= 1 ) )
    eq '^intertype-t168^', T, ( isa.normalfloat                     0     ), true
    eq '^intertype-t169^', T, ( isa.normalfloat                     null  ), false
    eq '^intertype-t170^', T, ( isa.normalfloat                     -1    ), false
    eq '^intertype-t171^', T, ( isa.normalfloat                     '?'   ), false
    eq '^intertype-t172^', T, ( isa.optional.normalfloat            0     ), true
    eq '^intertype-t173^', T, ( isa.optional.normalfloat            null  ), true
    eq '^intertype-t174^', T, ( isa.optional.normalfloat            -1    ), false
    eq '^intertype-t175^', T, ( isa.optional.normalfloat            '?'   ), false
    eq '^intertype-t176^', T, ( validate.normalfloat                0     ), 0
    eq '^intertype-t177^', T, ( validate.optional.normalfloat       0     ), 0
    eq '^intertype-t178^', T, ( validate.optional.normalfloat       null  ), null
    throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
    throws T, /expected a normalfloat, got a float/,            -> validate.normalfloat           -1
    throws T, /expected a normalfloat, got a text/,             -> validate.normalfloat           '?'
    throws T, /expected an optional normalfloat, got a float/,  -> validate.optional.normalfloat  -1
    throws T, /expected an optional normalfloat, got a text/,   -> validate.optional.normalfloat  '?'
    return null
  #.........................................................................................................
  do =>
    my_types =
      'quantity':     'object'
      'quantity.q':   'float'
      'quantity.u':   'text'
      'foo':          'object'
      'foo.bar':      'object'
      'foo.bar.baz':  'float'
    { isa
      validate  } = types = new Intertype my_types
    eq '^intertype-t179^', T, ( isa.quantity            { q: 1, u: 'm', }   ), true
    eq '^intertype-t180^', T, ( isa.quantity            null                ), false
    eq '^intertype-t181^', T, ( isa.optional.quantity   { q: 2, u: 'm', }   ), true
    eq '^intertype-t182^', T, ( isa.optional.quantity   null                ), true
    eq '^intertype-t183^', T, ( validate.quantity               { q: 3, u: 'm', } ), { q: 3, u: 'm', }
    eq '^intertype-t184^', T, ( validate.optional.quantity      { q: 4, u: 'm', } ), { q: 4, u: 'm', }
    eq '^intertype-t185^', T, ( validate.optional.quantity.q    null  ), null
    eq '^intertype-t186^', T, ( validate.optional.quantity.q    111   ), 111
    throws T, -> validate.quantity  { q: 5, }
    eq '^intertype-t187^', T, ( isa.quantity                     null               ), false
    eq '^intertype-t188^', T, ( isa.quantity                     -1                 ), false
    eq '^intertype-t189^', T, ( isa.quantity                     '?'                ), false
    eq '^intertype-t190^', T, ( isa.quantity.q                   '?'                ), false
    eq '^intertype-t191^', T, ( isa.quantity.q                   3                  ), true
    eq '^intertype-t192^', T, ( isa.optional.quantity            { q: 1, u: 'm', }  ), true
    eq '^intertype-t193^', T, ( isa.optional.quantity            null               ), true
    eq '^intertype-t194^', T, ( isa.optional.quantity            -1                 ), false
    eq '^intertype-t195^', T, ( isa.optional.quantity            '?'                ), false
    eq '^intertype-t196^', T, ( isa.optional.quantity.q          '?'                ), false
    eq '^intertype-t197^', T, ( isa.optional.quantity.q          3                  ), true
    eq '^intertype-t198^', T, ( validate.quantity                { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq '^intertype-t199^', T, ( validate.optional.quantity       { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq '^intertype-t200^', T, ( validate.optional.quantity       null               ), null
    throws T, /expected a quantity, got a null/,                -> validate.quantity            null
    throws T, /expected a quantity, got a float/,               -> validate.quantity            -1
    throws T, /expected a quantity, got a text/,                -> validate.quantity            '?'
    throws T, /expected a quantity, got a object/,              -> validate.quantity            { q: 1, } ### TAINT message should be more specific ###
    throws T, /expected an optional quantity, got a float/,     -> validate.optional.quantity   -1
    throws T, /expected an optional quantity, got a object/,    -> validate.optional.quantity   { q: 1, } ### TAINT message should be more specific ###
    throws T, /expected an optional quantity.q, got a object/,  -> validate.optional.quantity.q { q: 1, }
    throws T, /method 'validate.optional.quantity.q' expects 1 arguments, got 3/,  -> validate.optional.quantity.q 3, 4, 5
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@declaration_role_field = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { declarations  } = new Intertype()
    eq '^intertype-t201^', T, ( declarations.float.role     ), 'usertype'
    eq '^intertype-t202^', T, ( declarations.null.role      ), 'basetype'
    eq '^intertype-t203^', T, ( declarations.anything.role  ), 'basetype'
    eq '^intertype-t204^', T, ( declarations.unknown.role   ), 'basetype'
    eq '^intertype-t205^', T, ( declarations.optional.role  ), 'optional'
    # throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
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
@minimal_type_of_results = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype_minimal } = require '../../../apps/intertype'
  { isa
    validate
    create
    declare
    type_of           } = new Intertype_minimal()
  #.........................................................................................................
  do =>
    T?.eq ( type_of null              ), 'null'
    T?.eq ( type_of undefined         ), 'undefined'
    T?.eq ( type_of +Infinity         ), 'unknown'
    T?.eq ( type_of 4                 ), 'unknown'
    return null
  #.........................................................................................................
  do =>
    T?.eq ( isa.anything   1          ), true
    T?.eq ( isa.nothing    1          ), false
    T?.eq ( isa.something  1          ), true
    T?.eq ( isa.unknown    1          ), true
    return null
  #.........................................................................................................
  do =>
    T?.eq ( isa.anything   null       ), true
    T?.eq ( isa.nothing    null       ), true
    T?.eq ( isa.something  null       ), false
    T?.eq ( isa.unknown    null       ), false
    return null
  #.........................................................................................................
  do =>
    T?.eq ( isa.anything   undefined  ), true
    T?.eq ( isa.nothing    undefined  ), true
    T?.eq ( isa.something  undefined  ), false
    T?.eq ( isa.unknown    undefined  ), false
    return null
  #.........................................................................................................
  do =>
    throws T, /`optional` is not a legal type for `isa` methods/,       -> isa.optional 1
    throws T, /`optional` is not a legal type for `validate` methods/,  -> validate.optional 1
    throws T, /`optional` is not a legal type for `create` methods/,    -> create.optional 1
    return null
  #.........................................................................................................
  do =>
    try_and_show T?, -> declare 'anything',   ( x ) ->
    try_and_show T?, -> declare 'nothing',    ( x ) ->
    try_and_show T?, -> declare 'something',  ( x ) ->
    try_and_show T?, -> declare 'null',       ( x ) ->
    try_and_show T?, -> declare 'undefined',  ( x ) ->
    try_and_show T?, -> declare 'unknown',    ( x ) ->
    try_and_show T?, -> declare 'optional',   ( x ) ->
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
  # test @basic_functionality_using_types_object
  # @allow_declaration_objects()
  # demo_1()
  # @can_use_type_name_for_test()
  # test @can_use_type_name_for_test
  # await test @create_entries_must_be_sync_functions
  # await test @template_methods_must_be_nullary
  # @throw_instructive_error_on_missing_type()
  # @disallow_licensed_overrides()
  # await test @disallow_licensed_overrides
  # @throw_instructive_error_when_wrong_type_of_isa_test_declared()
  # await test @throw_instructive_error_when_wrong_type_of_isa_test_declared
  # @resolve_dotted_type()
  # test @resolve_dotted_type
  # @dotted_types_are_test_methods()
  # test @dotted_types_are_test_methods
  # @can_use_refs_to_dotted_types()
  # test @can_use_refs_to_dotted_types
  # test @can_use_type_name_for_test
  # @internal_type_of_method()
  # test @internal_type_of_method
  # @validate_dotted_types()
  # test @validate_dotted_types
  # @forbidden_to_define_fields_on_basetypes()
  # test @forbidden_to_define_fields_on_basetypes
  # @can_use_optional_refs_to_dotted_types()
  # test @can_use_optional_refs_to_dotted_types
  # @minimal_type_of_results()
  # test @minimal_type_of_results
  # @disallow_rhs_optional()
  # test @disallow_rhs_optional
  # @parallel_behavior_of_isa_validate_mandatory_and_optional()
  # test @parallel_behavior_of_isa_validate_mandatory_and_optional
  # @can_create_types_with_templates_and_create()
  # test @can_create_types_with_templates_and_create
  # @type_object_assumed_if_fields_present()
  # test @type_object_assumed_if_fields_present
  # @use_evaluate()
  # test @use_evaluate
  # @same_basic_types()
  # test @same_basic_types
  # @walk_prefixes()
  # test @walk_prefixes
  # @declaration_role_field()
  # test @declaration_role_field
  # @interface()
  # test @interface
  # @can_use_qualifiers()
  # test @can_use_qualifiers
  await test @


