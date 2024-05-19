

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
test_mode                 = 'throw_failures'
test_mode                 = 'throw_errors'
test_mode                 = 'failsafe'

#===========================================================================================================
# IMPLEMENT SET EQUALITY
#-----------------------------------------------------------------------------------------------------------
_set_contains = ( set, value ) ->
  for element from set
    return true if equals element, value
  return false

#-----------------------------------------------------------------------------------------------------------
equals = ( a, b ) ->
  switch true
    when TMP_types.isa.set a
      return false unless TMP_types.isa.set b
      return false unless a.size is b.size
      for element from a
        return false unless _set_contains b, element
      return true
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

#-----------------------------------------------------------------------------------------------------------
_match_error = ( error, matcher ) ->
  switch matcher_type = TMP_types.type_of matcher
    when 'text'
      return error.message is matcher
    when 'regex'
      matcher.lastIndex = 0
      return matcher.test error.message
  return matcher_type

#-----------------------------------------------------------------------------------------------------------
throws2 = ( T, f, matcher ) ->
  throw new Error "^992-1^ test method should be named, got #{rpr f}" if ( ref = f.name ) is ''
  error = null
  #.........................................................................................................
  try ( urge "^#{ref}^ `throws()` result of call:", f() ) catch error
    unless matcher?
      help "^#{ref} ◀ throw2@1^ error        ", reverse error.message
      T?.ok true
      return null
    #.......................................................................................................
    switch matcher_type = _match_error error, matcher
      when true
        help "^#{ref} ◀ throw2@2^ OK           ", reverse error.message
        T?.ok true
      when false
        urge "^#{ref} ◀ throw2@3^ error        ", reverse error.message
        warn "^#{ref} ◀ throw2@4^ doesn't match", reverse rpr matcher
        T?.fail "^#{ref} ◀ throw2@5^ error #{rpr error.message} doesn't match #{rpr matcher}"
      else
        message = "expected a regex or a text, got a #{matcher_type}"
        warn "^#{ref} ◀ throw2@6^", reverse message
        T?.fail "^#{ref} ◀ throw2@7^ #{message}"
  #.........................................................................................................
  unless error?
    message = "`throws()`: expected an error but none was thrown"
    warn "^#{ref} ◀ throw2@8^", reverse message
    T?.fail "^#{ref} ◀ throw2@9^ #{message}"
  #.........................................................................................................
  return null


#===========================================================================================================
eq = ( ref, T, result, matcher ) ->
  ref = ref.padEnd 15
  if equals result, matcher
    help ref, "EQ OK"
    T?.ok true
  else
    warn ref, ( reverse ' neq ' ), "result:     ", ( reverse ' ' + ( rpr result   ) + ' ' )
    warn ref, ( reverse ' neq ' ), "matcher:    ", ( reverse ' ' + ( rpr matcher  ) + ' ' )
    T?.ok false
  return null

#-----------------------------------------------------------------------------------------------------------
eq2 = ( T, f, matcher ) ->
  throw new Error "^992-1^ test method should be named, got #{rpr f}" if ( ref = f.name ) is ''
  try ( result = f() ) catch error
    message = "`eq2()`: ^#{ref}^ expected a result but got an an error: #{error.message}"
    warn '^992-12^', reverse message
    T?.fail "^992-13^ #{message}"
    debug '^25235234^', { test_mode}
    if test_mode is 'throw_errors'
      throw new Error message
  return eq ref, T, result, matcher

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
  eq2 T, ( Ω_intertype_1 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_2 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa                       ), true
  eq2 T, ( Ω_intertype_3 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa_optional              ), true
  eq2 T, ( Ω_intertype_4 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate                  ), true
  eq2 T, ( Ω_intertype_5 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate_optional         ), true
  eq2 T, ( Ω_intertype_6 = -> TMP_types.isa.function  INTERTYPE.types._get_isa                      ), true
  eq2 T, ( Ω_intertype_7 = -> TMP_types.isa.function  INTERTYPE.types._get_isa_optional             ), true
  eq2 T, ( Ω_intertype_8 = -> TMP_types.isa.function  INTERTYPE.types._get_validate                 ), true
  eq2 T, ( Ω_intertype_9 = -> TMP_types.isa.function  INTERTYPE.types._get_validate_optional        ), true
  eq2 T, ( Ω_intertype_10 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_11 = -> TMP_types.isa.object    INTERTYPE.types.isa                           ), true
  # eq2 T, ( Ω_intertype_12 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
  eq2 T, ( Ω_intertype_13 = -> TMP_types.isa.object    INTERTYPE.types.validate                      ), true
  # eq2 T, ( Ω_intertype_14 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
  eq2 T, ( Ω_intertype_15 = -> TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
  eq2 T, ( Ω_intertype_16 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
  eq2 T, ( Ω_intertype_17 = -> TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
  eq2 T, ( Ω_intertype_18 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
  eq2 T, ( Ω_intertype_19 = -> TMP_types.isa.object    INTERTYPE.types.create                        ), true
  eq2 T, ( Ω_intertype_20 = -> TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
  eq2 T, ( Ω_intertype_21 = -> TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
  eq2 T, ( Ω_intertype_22 = -> TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
  eq2 T, ( Ω_intertype_23 = -> TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
  #.........................................................................................................
  # eq2 T, ( Ω_intertype_24 = -> INTERTYPE.types.isa.name           ), 'isa'
  # eq2 T, ( Ω_intertype_25 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
  # eq2 T, ( Ω_intertype_26 = -> INTERTYPE.types.validate.name      ), 'validate'
  # eq2 T, ( Ω_intertype_27 = -> INTERTYPE.types.create.name        ), 'create'
  eq2 T, ( Ω_intertype_28 = -> INTERTYPE.types.declare.name       ), 'declare'
  eq2 T, ( Ω_intertype_29 = -> INTERTYPE.types.type_of.name       ), 'type_of'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_types_object = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  types         = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_30 = -> types.isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_31 = -> types.isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_32 = -> types.isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_33 = -> types.isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_34 = -> types.isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_35 = -> types.isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_36 = -> types.isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_37 = -> types.isa.optional.boolean  1                   ), false
  #.........................................................................................................
  eq2 T, ( Ω_intertype_38 = -> types.validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_39 = -> types.validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_40 = -> types.validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_41 = -> types.validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_42 = -> types.validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_43 = -> types.validate.optional.boolean      null       ), null
  try_and_show T,                           -> types.validate.boolean           1
  try_and_show T,                           -> types.validate.optional.boolean  1
  throws2 T, ( Ω_intertype_27 = -> types.validate.boolean           1 ), /expected a boolean/
  throws2 T, ( Ω_intertype_27 = -> types.validate.optional.boolean  1 ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_44 = -> types.type_of null            ), 'null'
  eq2 T, ( Ω_intertype_45 = -> types.type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_46 = -> types.type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_47 = -> types.type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_48 = -> types.type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_49 = -> types.type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_50 = -> types.type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_51 = -> types.type_of -Infinity       ), 'unknown'
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
  eq2 T, ( Ω_intertype_52 = -> types.isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_53 = -> types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_54 = -> types.validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_55 = -> types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  eq2 T, ( Ω_intertype_27 = -> types.declarations.null?.type              ), 'null'
  eq2 T, ( Ω_intertype_27 = -> types.declarations.function?.type          ), 'function'
  eq2 T, ( Ω_intertype_27 = -> types.declarations.boolean?.type           ), 'boolean'
  eq2 T, ( Ω_intertype_27 = -> types.declarations.text?.type              ), 'text'
  eq2 T, ( Ω_intertype_27 = -> types.declarations.asyncfunction?.type     ), 'asyncfunction'
  eq2 T, ( Ω_intertype_27 = -> types.isa.null?.name                       ), 'isa.null'
  eq2 T, ( Ω_intertype_27 = -> types.isa.function?.name                   ), 'isa.function'
  eq2 T, ( Ω_intertype_27 = -> types.isa.boolean?.name                    ), 'isa.boolean'
  eq2 T, ( Ω_intertype_27 = -> types.isa.text?.name                       ), 'isa.text'
  eq2 T, ( Ω_intertype_27 = -> types.isa.asyncfunction?.name              ), 'isa.asyncfunction'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_standalone_methods = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_56 = -> isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_57 = -> isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_58 = -> isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_59 = -> isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_60 = -> isa.unknown           1                   ), false
  eq2 T, ( Ω_intertype_61 = -> isa.unknown           Infinity            ), true
  eq2 T, ( Ω_intertype_62 = -> isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_63 = -> isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_64 = -> isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_65 = -> isa.optional.boolean  1                   ), false
  eq2 T, ( Ω_intertype_66 = -> isa.optional.unknown  1                   ), false
  eq2 T, ( Ω_intertype_67 = -> isa.optional.unknown  Infinity            ), true
  eq2 T, ( Ω_intertype_68 = -> isa.optional.unknown  undefined           ), true
  eq2 T, ( Ω_intertype_69 = -> isa.optional.unknown  undefined           ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_70 = -> validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_71 = -> validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_72 = -> validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_73 = -> validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_74 = -> validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_75 = -> validate.optional.boolean      null       ), null
  try_and_show T,                           -> validate.boolean           1
  try_and_show T,                           -> validate.optional.boolean  1
  throws2 T, ( Ω_intertype_27 = -> validate.boolean           1  ), /expected a boolean/
  throws2 T, ( Ω_intertype_27 = -> validate.optional.boolean  1  ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_76 = -> type_of null            ), 'null'
  eq2 T, ( Ω_intertype_77 = -> type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_78 = -> type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_79 = -> type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_80 = -> type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_81 = -> type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_82 = -> type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_83 = -> type_of -Infinity       ), 'unknown'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_84 = -> isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_85 = -> isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_86 = -> validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_87 = -> validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_27 = -> isa.float 3, 4 ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_27 = -> isa.float()    ), /method 'isa.float' expects 1 arguments, got 0/
  done?()

#-----------------------------------------------------------------------------------------------------------
@methods_check_arity = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  #.........................................................................................................
  throws2 T, ( Ω_intertype_88 = -> isa.float 3, 4               ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_89 = -> isa.float()                  ), /method 'isa.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_90 = -> isa.optional.float 3, 4      ), /method 'isa.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_91 = -> isa.optional.float()         ), /method 'isa.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_92 = -> validate.float 3, 4          ), /method 'validate.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_93 = -> validate.float()             ), /method 'validate.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_94 = -> validate.optional.float 3, 4 ), /method 'validate.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_95 = -> validate.optional.float()    ), /method 'validate.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_96 = -> type_of 3, 4                 ), /expected 1 arguments, got 2/
  throws2 T, ( Ω_intertype_97 = -> type_of()                    ), /expected 1 arguments, got 0/
  # try_and_show T, -> isa.float 3, 4
  # try_and_show T, -> isa.float()
  # try_and_show T, -> isa.optional.float 3, 4
  # try_and_show T, -> isa.optional.float()
  # try_and_show T, -> validate.float 3, 4
  # try_and_show T, -> validate.float()
  # try_and_show T, -> validate.optional.float 3, 4
  # try_and_show T, -> validate.optional.float()
  # try_and_show T, -> type_of 3, 4
  # try_and_show T, -> type_of()
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@same_basic_types = ( T, done ) ->
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
  eq2 T, ( Ω_intertype_98 = -> isa.boolean                     boolean                 ), true
  eq2 T, ( Ω_intertype_99 = -> isa.function                    $function               ), true
  eq2 T, ( Ω_intertype_100 = -> isa.asyncfunction               asyncfunction           ), true
  eq2 T, ( Ω_intertype_101 = -> isa.generatorfunction           generatorfunction       ), true
  eq2 T, ( Ω_intertype_102 = -> isa.asyncgeneratorfunction      asyncgeneratorfunction  ), true
  eq2 T, ( Ω_intertype_103 = -> isa.asyncgenerator              asyncgenerator          ), true
  eq2 T, ( Ω_intertype_104 = -> isa.generator                   generator               ), true
  eq2 T, ( Ω_intertype_105 = -> isa.symbol                      symbol                  ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_106 = -> validate.boolean                boolean                 ), boolean
  eq2 T, ( Ω_intertype_107 = -> validate.function               $function               ), $function
  eq2 T, ( Ω_intertype_108 = -> validate.asyncfunction          asyncfunction           ), asyncfunction
  eq2 T, ( Ω_intertype_109 = -> validate.generatorfunction      generatorfunction       ), generatorfunction
  eq2 T, ( Ω_intertype_110 = -> validate.asyncgeneratorfunction asyncgeneratorfunction  ), asyncgeneratorfunction
  eq2 T, ( Ω_intertype_111 = -> validate.asyncgenerator         asyncgenerator          ), asyncgenerator
  eq2 T, ( Ω_intertype_112 = -> validate.generator              generator               ), generator
  eq2 T, ( Ω_intertype_113 = -> validate.symbol                 symbol                  ), symbol
  #.........................................................................................................
  eq2 T, ( Ω_intertype_114 = -> type_of boolean                                         ), 'boolean'
  eq2 T, ( Ω_intertype_115 = -> type_of $function                                       ), 'function'
  eq2 T, ( Ω_intertype_116 = -> type_of asyncfunction                                   ), 'asyncfunction'
  eq2 T, ( Ω_intertype_117 = -> type_of generatorfunction                               ), 'generatorfunction'
  eq2 T, ( Ω_intertype_118 = -> type_of asyncgeneratorfunction                          ), 'asyncgeneratorfunction'
  eq2 T, ( Ω_intertype_119 = -> type_of asyncgenerator                                  ), 'asyncgenerator'
  eq2 T, ( Ω_intertype_120 = -> type_of generator                                       ), 'generator'
  eq2 T, ( Ω_intertype_121 = -> type_of symbol                                          ), 'symbol'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_on_missing_type = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype()
  #.........................................................................................................
  # try_and_show T, -> isa.quux
  # try_and_show T, -> isa.quux()
  # try_and_show T, -> isa.quux 3
  # try_and_show T, -> isa.quux 3, 4
  # try_and_show T, -> isa.optional.quux
  # try_and_show T, -> isa.optional.quux()
  # try_and_show T, -> isa.optional.quux 3
  # try_and_show T, -> isa.optional.quux 3, 4
  # try_and_show T, -> validate.quux
  # try_and_show T, -> validate.quux()
  # try_and_show T, -> validate.quux 3
  # try_and_show T, -> validate.quux 3, 4
  # try_and_show T, -> validate.optional.quux
  # try_and_show T, -> validate.optional.quux()
  # try_and_show T, -> validate.optional.quux 3
  # try_and_show T, -> validate.optional.quux 3, 4
  #.........................................................................................................
  throws2 T, ( Ω_intertype_122 = -> isa.quux                    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_123 = -> isa.quux()                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_124 = -> isa.quux 3                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_125 = -> isa.quux 3, 4               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_126 = -> isa.optional.quux           ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_127 = -> isa.optional.quux()         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_128 = -> isa.optional.quux 3         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_129 = -> isa.optional.quux 3, 4      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_130 = -> validate.quux               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_131 = -> validate.quux()             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_132 = -> validate.quux 3             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_133 = -> validate.quux 3, 4          ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_134 = -> validate.optional.quux      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_135 = -> validate.optional.quux()    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_136 = -> validate.optional.quux 3    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_137 = -> validate.optional.quux 3, 4 ), /unknown type 'quux'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_optional_is_declared = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  throws2 T, ( Ω_intertype_27 = -> new INTERTYPE.Intertype_minimal { optional: ( ( x ) -> true ), } ), /not allowed to re-declare type 'optional'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_wrong_type_of_isa_test_declared = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_138 = -> new Intertype { foo: ( -> ), }                      ), /expected function with 1 parameters, got one with 0/
  throws2 T, ( Ω_intertype_139 = -> new Intertype { foo: ( ( a, b ) -> ), }             ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_140 = -> new Intertype { foo: true, }                        ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_141 = -> new Intertype { foo: undefined, }                   ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_142 = -> new Intertype { foo: null, }                        ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_143 = -> new Intertype { foo: {}, }                          ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_144 = -> new Intertype { foo: { test: null, }, }             ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_145 = -> new Intertype { foo: { test: false, }, }            ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_146 = -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }  ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_147 = -> new Intertype { foo: 'quux', }                      ), /unknown type 'quux'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@allow_declaration_objects = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.integer =
      test:     ( x ) -> Number.isInteger x
      template: 0
    types = new Intertype_minimal declarations
    eq2 T, ( Ω_intertype_148 = -> TMP_types.isa.function types.isa.integer  ), true
    eq2 T, ( Ω_intertype_149 = -> types.isa.integer.length                  ), 1
    eq2 T, ( Ω_intertype_150 = -> types.isa.integer 123                     ), true
    eq2 T, ( Ω_intertype_151 = -> types.isa.integer 123.456                 ), false
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@create_entries_must_be_sync_functions = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.integer =
      test:     ( x ) -> Number.isInteger x
      create:   -> await 0
    throws2 T, ( Ω_intertype_152 = -> new Intertype_minimal declarations ), /expected a function for `create` entry of type 'integer', got a asyncfunction/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@template_methods_must_be_nullary = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations  = { sample_declarations..., }
    declarations.foolist =
      test:     ( x ) -> true
      template: ( n ) -> [ n, ]
    throws2 T, ( Ω_intertype_153 = -> new Intertype_minimal declarations ), /template method for type 'foolist' has arity 1 but must be nullary/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_knows_its_base_types = ( T, done ) ->
  { isa } = require '../../../apps/intertype'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_154 = -> isa.basetype 'optional'   ), false
  eq2 T, ( Ω_intertype_155 = -> isa.basetype 'anything'   ), true
  eq2 T, ( Ω_intertype_156 = -> isa.basetype 'nothing'    ), true
  eq2 T, ( Ω_intertype_157 = -> isa.basetype 'something'  ), true
  eq2 T, ( Ω_intertype_158 = -> isa.basetype 'null'       ), true
  eq2 T, ( Ω_intertype_159 = -> isa.basetype 'undefined'  ), true
  eq2 T, ( Ω_intertype_160 = -> isa.basetype 'unknown'    ), true
  eq2 T, ( Ω_intertype_161 = -> isa.basetype 'integer'    ), false
  eq2 T, ( Ω_intertype_162 = -> isa.basetype 'float'      ), false
  eq2 T, ( Ω_intertype_163 = -> isa.basetype 'basetype'   ), false
  eq2 T, ( Ω_intertype_164 = -> isa.basetype 'quux'       ), false
  eq2 T, ( Ω_intertype_165 = -> isa.basetype 'toString'   ), false
  eq2 T, ( Ω_intertype_166 = -> isa.basetype null         ), false
  eq2 T, ( Ω_intertype_167 = -> isa.basetype undefined    ), false
  eq2 T, ( Ω_intertype_168 = -> isa.basetype 4            ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_licensed_overrides = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_169 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        test:       ( x ) -> x is 'float'
    try_and_show T, -> ( types.declare overrides )
    throws2 T, ( Ω_intertype_170 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_171 = -> types.isa.float 4       ), true
    eq2 T, ( Ω_intertype_172 = -> types.isa.float 'float' ), false
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_173 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        override:   true
        test:       ( x ) -> x is 'float'
    throws2 T, ( Ω_intertype_174 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_175 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      anything:
        override:   true
        test:       ( x ) -> true
    throws2 T, ( Ω_intertype_176 = -> types.declare overrides ), /not allowed to re-declare basetype 'anything'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_177 = -> types.isa.anything 4       ), true
    eq2 T, ( Ω_intertype_178 = -> types.isa.anything 'float' ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_create_types_with_templates_and_create = ( T, done ) ->
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
    eq2 T, ( Ω_intertype_179 = -> TMP_types.isa.object types.declarations       ), true
    eq2 T, ( Ω_intertype_180 = -> TMP_types.isa.object types.declarations.float ), true
    eq2 T, ( Ω_intertype_181 = -> TMP_types.isa.object types.declarations.text  ), true
    #.......................................................................................................
    throws2 T, ( Ω_intertype_182 = -> types.create.boolean() ), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/
    throws2 T, ( Ω_intertype_183 = -> types.create.text 'foo' ), /expected 0 arguments, got 1/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_184 = -> types.create.text()         ), ''
    eq2 T, ( Ω_intertype_185 = -> types.create.integer()      ), 0
    eq2 T, ( Ω_intertype_186 = -> types.create.float()        ), 0
    eq2 T, ( Ω_intertype_187 = -> types.create.float '123.45' ), 123.45
    throws2 T, ( Ω_intertype_188 = -> types.create.float '***' ), /expected `create\.float\(\)` to return a float but it returned a nan/
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
    eq2 T, ( Ω_intertype_189 = -> create.quantity()    ), { q: 0, u: 'u', }
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
    eq2 T, ( Ω_intertype_190 = -> create.quantity()                         ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_191 = -> create.quantity { q: 123, }               ), { q: 123, u: 'u', }
    eq2 T, ( Ω_intertype_192 = -> create.quantity { u: 'kg', }              ), { q: 0, u: 'kg', }
    eq2 T, ( Ω_intertype_193 = -> create.quantity { u: 'kg', foo: 'bar', }  ), { q: 0, u: 'kg', foo: 'bar', }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@builtin_types_support_create = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types       = new Intertype()
    { create
      type_of } = types
    eq2 T, ( Ω_intertype_194 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_195 = -> create.boolean()       ), false
    eq2 T, ( Ω_intertype_196 = -> create.object()        ), {}
    eq2 T, ( Ω_intertype_197 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_198 = -> create.infinity()      ), Infinity
    eq2 T, ( Ω_intertype_199 = -> create.text()          ), ''
    eq2 T, ( Ω_intertype_200 = -> create.list()          ), []
    eq2 T, ( Ω_intertype_201 = -> create.regex()         ), new RegExp()
    eq2 T, ( Ω_intertype_202 = -> type_of create.function()      ), 'function'
    eq2 T, ( Ω_intertype_203 = -> type_of create.asyncfunction() ), 'asyncfunction'
    eq2 T, ( Ω_intertype_204 = -> type_of create.symbol()        ), 'symbol'
    throws2 T, ( Ω_intertype_205 = -> create.basetype() ), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@template_functions_are_called_in_template_fields = ( T, done ) ->
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
    eq2 T, ( Ω_intertype_206 = -> create.quantity()                          ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_207 = -> isa.quantity { q: 9, }                     ), false
    eq2 T, ( Ω_intertype_208 = -> type_of declarations.quantity.sub_tests.q  ), 'function'
    eq2 T, ( Ω_intertype_209 = -> type_of declarations.quantity.sub_tests.u  ), 'function'
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
    eq2 T, ( Ω_intertype_210 = -> create.foo() ), { foo: { bar: 123, } }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@type_object_assumed_if_fields_present = ( T, done ) ->
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
    eq2 T, ( Ω_intertype_211 = -> type_of declarations.quantity.test ), 'function'
    debug '^342342^', declarations.quantity
    eq2 T, ( Ω_intertype_212 = -> type_of declarations.quantity.sub_tests.q ), 'function'
    eq2 T, ( Ω_intertype_213 = -> type_of declarations.quantity.sub_tests.u ), 'function'
    eq2 T, ( Ω_intertype_214 = -> isa.quantity { q: 987, u: 's', } ), true
    eq2 T, ( Ω_intertype_215 = -> isa.quantity { q: 987, } ), false
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_minimal_has_only_base_types = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  types = new Intertype_minimal()
  eq2 T, ( Ω_intertype_216 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown' ]
  types.declare { z: ( ( x ) -> ), }
  eq2 T, ( Ω_intertype_217 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_type_name_for_test = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: 'quux', }
    throws2 T, ( Ω_intertype_218 = -> types.declare { z: 'quux', } ), /unknown type 'quux'/
    types.declare { z: 'float', }
    eq2 T, ( Ω_intertype_219 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_220 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_221 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_222 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_223 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_224 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_225 = -> types.declarations.z.test.name      ), 'z' # ?
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: { test: 'quux', }, }
    throws2 T, ( Ω_intertype_226 = -> types.declare { z: { test: 'quux', }, } ), /unknown type 'quux'/
    types.declare { z: { test: 'float', }, }
    eq2 T, ( Ω_intertype_227 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_228 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_229 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_230 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_231 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_232 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_233 = -> types.declarations.z.test.name      ), 'z'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@resolve_dotted_type = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    eq2 T, ( Ω_intertype_234 = -> Reflect.has types.declarations, 'foo'           ), false
    types.declare { foo: 'object', }
    eq2 T, ( Ω_intertype_235 = -> Reflect.has types.declarations, 'foo'           ), true
    eq2 T, ( Ω_intertype_236 = -> Reflect.has types.declarations, 'foo.bar'       ), false
    types.declare { 'foo.bar': 'object', }
    eq2 T, ( Ω_intertype_237 = -> Reflect.has types.declarations, 'foo.bar'       ), true
    eq2 T, ( Ω_intertype_238 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), false
    types.declare { 'foo.bar.baz': 'float', }
    eq2 T, ( Ω_intertype_239 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), true
    eq2 T, ( Ω_intertype_240 = -> types.isa.foo.bar.baz null                      ), false
    eq2 T, ( Ω_intertype_241 = -> types.isa.foo.bar.baz 4                         ), true
    eq2 T, ( Ω_intertype_242 = -> types.isa.foo.bar.baz +Infinity                 ), false
    # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
    # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    return null
  # #.........................................................................................................
  # do =>
  #   types = new Intertype()
  #   eq2 T, ( Ω_intertype_243 = -> Reflect.has types.declarations, 'foo'         ), false
  #   types.declare { foo: 'object', }
  #   eq2 T, ( Ω_intertype_244 = -> Reflect.has types.declarations, 'foo'         ), true
  #   eq2 T, ( Ω_intertype_245 = -> Reflect.has types.declarations, 'foo.bar'     ), false
  #   types.declare { 'foo.bar': 'object', }
  #   eq2 T, ( Ω_intertype_246 = -> Reflect.has types.declarations, 'foo.bar'     ), true
  #   eq2 T, ( Ω_intertype_247 = -> Reflect.has types.declarations, 'foo.bar.baz' ), false
  #   types.declare { 'foo.bar.baz': 'optional.float', }
  #   eq2 T, ( Ω_intertype_248 = -> Reflect.has types.declarations, 'foo.bar.baz' ), true
  #   eq2 T, ( Ω_intertype_249 = -> types.isa.foo.bar.baz null ), true
  #   eq2 T, ( Ω_intertype_250 = -> types.isa.foo.bar.baz 4 ), true
  #   eq2 T, ( Ω_intertype_251 = -> types.isa.foo.bar.baz +Infinity ), false
  #   # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
  #   # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
  #   try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
  #   return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dotted_types_are_test_methods = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { quantity: 'object', }
    types.declare { 'quantity.q': 'float', }
    types.declare { 'quantity.u': 'text', }
    eq2 T, ( Ω_intertype_252 = -> types.isa[ 'quantity.q' ] ), types.declarations[ 'quantity' ].sub_tests[ 'q' ]
    eq2 T, ( Ω_intertype_253 = -> types.isa[ 'quantity.q' ] ), types.isa.quantity.q
    # debug '^409-1^', types.declarations
    eq2 T, ( Ω_intertype_254 = -> types.isa.quantity {}                 ), false
    eq2 T, ( Ω_intertype_255 = -> types.isa.quantity { q: {}, }         ), false
    eq2 T, ( Ω_intertype_256 = -> types.isa.quantity { q: 3, }          ), false
    eq2 T, ( Ω_intertype_257 = -> types.isa.quantity { q: 3, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_258 = -> types.isa.quantity.q 3                ), true
    eq2 T, ( Ω_intertype_259 = -> types.isa.quantity.q 3.1              ), true
    eq2 T, ( Ω_intertype_260 = -> types.isa.quantity.q '3.1'            ), false
    eq2 T, ( Ω_intertype_261 = -> types.isa.quantity.u 'm'              ), true
    eq2 T, ( Ω_intertype_262 = -> types.isa.quantity.u null             ), false
    eq2 T, ( Ω_intertype_263 = -> types.isa.quantity.u 3                ), false
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
    eq2 T, ( Ω_intertype_264 = -> types.isa.person.address.city.name 'P'  ), true
    eq2 T, ( Ω_intertype_265 = -> types.isa.person.address.city.name 1234 ), false
    eq2 T, ( Ω_intertype_266 = -> types.isa.person 1234 ), false
    eq2 T, ( Ω_intertype_267 = -> types.isa.person { name: 'Bob', } ), false
    eq2 T, ( Ω_intertype_268 = -> types.isa.person { name: 'Bob', address: {}, } ), false
    eq2 T, ( Ω_intertype_269 = -> types.isa.person { name: 'Bob', address: { city: {}, }, } ), false
    eq2 T, ( Ω_intertype_270 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', }, }, } ), false
    eq2 T, ( Ω_intertype_271 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', postcode: 'SO36', }, }, } ), true
    eq2 T, ( Ω_intertype_272 = -> types.isa.person.address.city.name     'P'                                ), true
    eq2 T, ( Ω_intertype_273 = -> types.isa.person.address.city.postcode 'SO36'                             ), true
    eq2 T, ( Ω_intertype_274 = -> types.isa.person.address.city {         name: 'P', postcode: 'SO36', }    ), true
    eq2 T, ( Ω_intertype_275 = -> types.isa.person.address      { city: { name: 'P', postcode: 'SO36', }, } ), true
    help '^322-1^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person'               ].sub_tests )
    help '^322-2^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address'       ].sub_tests )
    help '^322-3^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address.city'  ].sub_tests )
    eq2 T, ( Ω_intertype_276 = -> Object.keys types.declarations[ 'person'               ].sub_tests ), [ 'name', 'address', ]
    eq2 T, ( Ω_intertype_277 = -> Object.keys types.declarations[ 'person.address'       ].sub_tests ), [ 'city', ]
    eq2 T, ( Ω_intertype_278 = -> Object.keys types.declarations[ 'person.address.city'  ].sub_tests ), [ 'name', 'postcode', ]
    eq2 T, ( Ω_intertype_279 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address'      ].sub_tests ), true
    eq2 T, ( Ω_intertype_280 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address.city' ].sub_tests ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':      'float', }
    types.declare { 'foo.bar':  'text',   }
    do =>
      d = 3
      # d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
      eq2 T, ( Ω_intertype_281 = -> types.isa.foo d ), false
      return null
    do =>
      d = new Number 3
      d.bar = '?'
      eq2 T, ( Ω_intertype_282 = -> d.bar ), '?'
      # still won't work b/c `float` doesn't accept objects (which is a good thing):
      eq2 T, ( Ω_intertype_283 = -> types.isa.foo d ), false
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
    eq2 T, ( Ω_intertype_284 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_285 = -> types.isa.foo { bind: 1, apply: 2, call: 3, name: 4, length: 5, } ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':        'object',           }
    types.declare { 'foo.text':   ( ( x ) -> x is 1 ) }
    types.declare { 'foo.float':  ( ( x ) -> x is 2 ) }
    eq2 T, ( Ω_intertype_286 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_287 = -> types.isa.foo { text: 1, float: 2, } ), true
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
    eq2 T, ( Ω_intertype_288 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_289 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_290 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_291 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_292 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_293 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_294 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_295 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_296 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_297 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_298 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_299 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_300 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_301 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_302 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_303 = -> types.isa.optional.person.address.city {} ), false
    eq2 T, ( Ω_intertype_304 = -> types.isa.optional.person.address.city null ), true
    eq2 T, ( Ω_intertype_305 = -> types.isa.optional.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_306 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_307 = -> types.isa.mycity null ), true
    eq2 T, ( Ω_intertype_308 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
#     eq2 T, ( Ω_intertype_309 = -> isa.float       null  ), false
#     eq2 T, ( Ω_intertype_310 = -> isa.float       true  ), false
#     eq2 T, ( Ω_intertype_311 = -> isa.float       0     ), true
#     eq2 T, ( Ω_intertype_312 = -> isa.maybefloat1 null  ), true
#     eq2 T, ( Ω_intertype_313 = -> isa.maybefloat1 true  ), false
#     eq2 T, ( Ω_intertype_314 = -> isa.maybefloat1 0     ), true
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
#     eq2 T, ( Ω_intertype_315 = -> isa.q             null                    ), false
#     eq2 T, ( Ω_intertype_316 = -> isa.q             {}                      ), true
#     eq2 T, ( Ω_intertype_317 = -> isa.q             { maybefloat2: null }   ), true
#     eq2 T, ( Ω_intertype_318 = -> isa.q             { maybefloat2: false }  ), false
#     eq2 T, ( Ω_intertype_319 = -> isa.q             { maybefloat2: 3 }      ), true
#     eq2 T, ( Ω_intertype_320 = -> isa.q.maybefloat2  null                   ), true
#     eq2 T, ( Ω_intertype_321 = -> isa.q.maybefloat2  true                   ), false
#     eq2 T, ( Ω_intertype_322 = -> isa.q.maybefloat2  0                      ), true
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
#     safeguard T, => eq2 T, ( Ω_intertype_323 = -> isa.q             null                    ), true
#     safeguard T, => eq2 T, ( Ω_intertype_324 = -> isa.q             {}                      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_325 = -> isa.q             { maybefloat3: null }   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_326 = -> isa.q             { maybefloat3: false }  ), false
#     safeguard T, => eq2 T, ( Ω_intertype_327 = -> isa.q             { maybefloat3: 3 }      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_328 = -> isa.q.maybefloat3  null                   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_329 = -> isa.q.maybefloat3  true                   ), false
#     safeguard T, => eq2 T, ( Ω_intertype_330 = -> isa.q.maybefloat3  0                      ), true
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
#     eq2 T, ( Ω_intertype_331 = -> isa.person        null                                                            ), false
#     eq2 T, ( Ω_intertype_332 = -> isa.person        {}                                                              ), false
#     eq2 T, ( Ω_intertype_333 = -> isa.person        { name: 'Fred',                                               } ), false
#     eq2 T, ( Ω_intertype_334 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
#     eq2 T, ( Ω_intertype_335 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
#     eq2 T, ( Ω_intertype_336 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
#     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
#     eq2 T, ( Ω_intertype_337 = -> isa.maybesomeone  null                                                            ), true
#     # eq2 T, ( Ω_intertype_338 = -> isa.maybesomeone  {}                                                              ), false
#     # eq2 T, ( Ω_intertype_339 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
#     # eq2 T, ( Ω_intertype_340 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
#     # eq2 T, ( Ω_intertype_341 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
#     # eq2 T, ( Ω_intertype_342 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   done?()

#-----------------------------------------------------------------------------------------------------------
@forbidden_to_define_fields_on_basetypes = ( T, done ) ->
  { Intertype
    declarations  } = require '../../../apps/intertype'
  #.........................................................................................................
  await do =>
    types         = new Intertype()
    { declare
      validate
      isa } = types
    throws2 T, ( Ω_intertype_343 = -> types.declare { 'optional.d':    ( ( x ) -> ), } ), /illegal use of 'optional' in declaration of type 'optional.d'/
    throws2 T, ( Ω_intertype_344 = -> types.declare { 'anything.d':    ( ( x ) -> ), } ), /illegal use of basetype 'anything' in declaration of type 'anything.d'/
    throws2 T, ( Ω_intertype_345 = -> types.declare { 'nothing.d':     ( ( x ) -> ), } ), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/
    throws2 T, ( Ω_intertype_346 = -> types.declare { 'something.d':   ( ( x ) -> ), } ), /illegal use of basetype 'something' in declaration of type 'something.d'/
    throws2 T, ( Ω_intertype_347 = -> types.declare { 'null.d':        ( ( x ) -> ), } ), /illegal use of basetype 'null' in declaration of type 'null.d'/
    throws2 T, ( Ω_intertype_348 = -> types.declare { 'undefined.d':   ( ( x ) -> ), } ), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/
    throws2 T, ( Ω_intertype_349 = -> types.declare { 'unknown.d':     ( ( x ) -> ), } ), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@internal_type_of_method = ( T, done ) ->
  { Intertype
    declarations
    __type_of     } = require '../../../apps/intertype'
  #.........................................................................................................
  _isa = Object.fromEntries ( [ type, declaration.test, ] for type, declaration of declarations )
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_350 = -> __type_of _isa, null          ), 'null'
    eq2 T, ( Ω_intertype_351 = -> __type_of _isa, undefined     ), 'undefined'
    eq2 T, ( Ω_intertype_352 = -> __type_of _isa, 4             ), 'float'
    eq2 T, ( Ω_intertype_353 = -> __type_of _isa, ->            ), 'function'
    eq2 T, ( Ω_intertype_354 = -> __type_of _isa, -> await null ), 'asyncfunction'
    eq2 T, ( Ω_intertype_355 = -> __type_of _isa, {}            ), 'object'
    eq2 T, ( Ω_intertype_356 = -> __type_of _isa, []            ), 'list'
    eq2 T, ( Ω_intertype_357 = -> __type_of _isa, +Infinity     ), 'infinity'
    eq2 T, ( Ω_intertype_358 = -> __type_of _isa, -Infinity     ), 'infinity'
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@deepmerge = ( T, done ) ->
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
    eq2 T, ( Ω_intertype_359 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_360 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_361 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_362 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_363 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_364 = -> probe.bar.baz.sub  is sub                ), true
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
    eq2 T, ( Ω_intertype_365 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_366 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_367 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_368 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_369 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_370 = -> probe.bar.baz.sub  is sub                ), true
    return null
  #.........................................................................................................
  do =>
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@validate_dotted_types = ( T, done ) ->
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
    throws2 T, ( Ω_intertype_371 = -> validate.person null                        ), /expected a person, got a null/
    throws2 T, ( Ω_intertype_372 = -> validate.person.address null                ), /expected a person.address, got a null/
    throws2 T, ( Ω_intertype_373 = -> validate.person.address.city null           ), /expected a person.address.city, got a null/
    throws2 T, ( Ω_intertype_374 = -> validate.person.address.city.postcode null  ), /expected a person.address.city.postcode, got a null/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_375 = -> types.isa.person.address.city.postcode 3 ), false
    throws2 T, ( Ω_intertype_376 = -> validate.person.address.city.postcode 3             ), /expected a person.address.city.postcode/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_377 = -> types.isa.person.address.city { name: 'P', } ), false
    throws2 T, ( Ω_intertype_378 = -> validate.person.address.city { name: 'P', }         ), /expected a person.address.city/
    # #.......................................................................................................
    eq2 T, ( Ω_intertype_379 = -> types.isa.person.address.city { postcode: '3421', } ), false
    throws2 T, ( Ω_intertype_380 = -> validate.person.address.city()                      ), /method 'validate.person.address.city' expects 1 arguments, got 0/
    throws2 T, ( Ω_intertype_381 = -> validate.person.address.city null                   ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_382 = -> validate.person.address.city '3421'                 ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_383 = -> validate.person.address.city { postcode: '3421', }  ), /expected a person.address.city/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_384 = -> types.isa.person.address.city { name: 'P', postcode: '3421', } ), true
    eq2 T, ( Ω_intertype_385 = -> validate.person.address.city { name: 'P', postcode: '3421', } ), { name: 'P', postcode: '3421', }
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_evaluate = ( T, done ) ->
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
    throws2 T, ( Ω_intertype_386 = -> evaluate.optional 1         ), /`optional` is not a legal type for `evaluate` methods/
    throws2 T, ( Ω_intertype_387 = -> evaluate.optional.person 1  ), /`optional` is not a legal type for `evaluate` methods/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_388 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_389 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_390 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_391 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': true, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_392 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_393 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_394 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_395 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_396 = -> isa.person       null  ), false
    eq2 T, ( Ω_intertype_397 = -> evaluate.person  null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_398 = -> isa.person       {}    ), false
    eq2 T, ( Ω_intertype_399 = -> evaluate.person  {}    ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
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
    eq2 T, ( Ω_intertype_400 = -> isa.person                   { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_401 = -> evaluate.person              { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_402 = -> Object.keys evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_403 = -> isa.person                   {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_404 = -> evaluate.person              {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_405 = -> Object.keys evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_406 = -> isa.person                   null  ), false
    eq2 T, ( Ω_intertype_407 = -> evaluate.person              null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_408 = -> Object.keys evaluate.person  null  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_409 = -> isa.person                   {}  ), false
    eq2 T, ( Ω_intertype_410 = -> evaluate.person              {}  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_411 = -> Object.keys evaluate.person  {}  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_412 = -> isa.person.address                   { city: { name: 'Atown', postcode: 'VA1234' } } ), true
    eq2 T, ( Ω_intertype_413 = -> evaluate.person.address              { city: { name: 'Atown', postcode: 'VA1234' } } ), { 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_414 = -> Object.keys evaluate.person.address  { city: { name: 'Atown', postcode: 'VA1234' } } ), [ 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name' ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@walk_prefixes = ( T, done ) ->
  { walk_prefixes
    isa
    type_of                     } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_415 = -> isa.generatorfunction walk_prefixes             ), true
    eq2 T, ( Ω_intertype_416 = -> [ ( walk_prefixes 'one'                )..., ]  ), []
    eq2 T, ( Ω_intertype_417 = -> [ ( walk_prefixes 'one.two'            )..., ]  ), [ 'one' ]
    eq2 T, ( Ω_intertype_418 = -> [ ( walk_prefixes 'one.two.three'      )..., ]  ), [ 'one', 'one.two', ]
    eq2 T, ( Ω_intertype_419 = -> [ ( walk_prefixes 'one.two.three.four' )..., ]  ), [ 'one', 'one.two', 'one.two.three', ]
    ### TAINT should not allow empty namers: ###
    eq2 T, ( Ω_intertype_420 = -> [ ( walk_prefixes '.one.two.three'     )..., ]  ), [ '', '.one', '.one.two', ]
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_namespaces = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations =
      'foo.bar':      ( x ) -> x is 'foo.bar'
      'foo.bar.baz':  ( x ) -> x is 'foo.bar.baz'
    try_and_show T, -> types = new Intertype declarations
    throws2 T, ( Ω_intertype_421 = -> types = new Intertype declarations ), /unknown partial type 'foo'/
    return null
  #.........................................................................................................
  do =>
    declarations =
      'quantity':         'object'
      'quantity.q':       'float'
      'quantity.u':       'text'
    types = new Intertype declarations
    eq2 T, ( Ω_intertype_422 = -> types.isa.quantity {}                   ), false
    eq2 T, ( Ω_intertype_423 = -> types.isa.quantity { q: 12, u: 'kg', }  ), true
    eq2 T, ( Ω_intertype_424 = -> types.isa[ 'quantity.q' ] 12            ), true
    eq2 T, ( Ω_intertype_425 = -> types.isa[ 'quantity.u' ] 'kg'          ), true
    eq2 T, ( Ω_intertype_426 = -> types.isa.quantity.q 12                 ), true
    eq2 T, ( Ω_intertype_427 = -> types.isa.quantity.u 'kg'               ), true
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_qualifiers = ( T, done ) ->
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
    eq2 T, ( Ω_intertype_428 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_429 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_430 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_431 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_432 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_433 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_434 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_435 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_436 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_437 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_438 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_439 = -> isa.nonempty.text 4           ), false
    ### this doesn't make a terrible lot of sense: ###
    eq2 T, ( Ω_intertype_440 = -> isa.empty { list: [], text: '', set: new Set() } ), false
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
    eq2 T, ( Ω_intertype_441 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_442 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_443 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_444 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_445 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_446 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_447 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_448 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_449 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_450 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_451 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_452 = -> isa.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_453 = -> isa.empty []                  ), true
    eq2 T, ( Ω_intertype_454 = -> isa.empty ''                  ), true
    eq2 T, ( Ω_intertype_455 = -> isa.empty new Set()           ), true
    eq2 T, ( Ω_intertype_456 = -> isa.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_457 = -> isa.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_458 = -> isa.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_459 = -> validate.empty []                  ), []
    eq2 T, ( Ω_intertype_460 = -> validate.empty ''                  ), ''
    eq2 T, ( Ω_intertype_461 = -> validate.empty new Set()           ), new Set()
    throws2 T, ( Ω_intertype_462 = -> validate.empty [ 1, ]              ), /expected a empty, got a list/
    throws2 T, ( Ω_intertype_463 = -> validate.empty 'A'                 ), /expected a empty, got a text/
    throws2 T, ( Ω_intertype_464 = -> validate.empty new Set 'abc'       ), /expected a empty, got a set/
    return null
    #.......................................................................................................
    eq2 T, ( Ω_intertype_465 = -> isa.opttional.empty []                  ), true
    eq2 T, ( Ω_intertype_466 = -> isa.opttional.empty ''                  ), true
    eq2 T, ( Ω_intertype_467 = -> isa.opttional.empty new Set()           ), true
    eq2 T, ( Ω_intertype_468 = -> isa.opttional.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_469 = -> isa.opttional.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_470 = -> isa.opttional.empty new Set 'abc'       ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_rhs_optional = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    ### TAINT observe the out-comment messages would perhaps make more sense as they are more specific ###
    eq2 T, ( Ω_intertype_471 = -> ( new Intertype() ).declare { foo: 'float', } ), null
    eq2 T, ( Ω_intertype_472 = -> ( new Intertype() ).declare { foo: 'text',  } ), null
    # ( new Intertype() ).declare { foo: 'optional', }
    throws2 T, ( Ω_intertype_473 = -> ( new Intertype() ).declare { foo: 'optional', }        ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_474 = -> ( new Intertype() ).declare { foo: 'qqq', }             ), /unknown type 'qqq'/
    throws2 T, ( Ω_intertype_475 = -> ( new Intertype() ).declare { foo: 'optional.float', }  ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_476 = -> ( new Intertype() ).declare { foo: 'anything.float', }  ), /illegal use of basetype 'anything' in declaration of type 'foo'/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parallel_behavior_of_isa_validate_mandatory_and_optional = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { isa
      validate  } = new Intertype
        normalfloat: ( ( x ) -> ( @isa.float x ) and ( 0 <= x <= 1 ) )
    eq2 T, ( Ω_intertype_477 = -> isa.normalfloat                     0     ), true
    eq2 T, ( Ω_intertype_478 = -> isa.normalfloat                     null  ), false
    eq2 T, ( Ω_intertype_479 = -> isa.normalfloat                     -1    ), false
    eq2 T, ( Ω_intertype_480 = -> isa.normalfloat                     '?'   ), false
    eq2 T, ( Ω_intertype_481 = -> isa.optional.normalfloat            0     ), true
    eq2 T, ( Ω_intertype_482 = -> isa.optional.normalfloat            null  ), true
    eq2 T, ( Ω_intertype_483 = -> isa.optional.normalfloat            -1    ), false
    eq2 T, ( Ω_intertype_484 = -> isa.optional.normalfloat            '?'   ), false
    eq2 T, ( Ω_intertype_485 = -> validate.normalfloat                0     ), 0
    eq2 T, ( Ω_intertype_486 = -> validate.optional.normalfloat       0     ), 0
    eq2 T, ( Ω_intertype_487 = -> validate.optional.normalfloat       null  ), null
    throws2 T, ( Ω_intertype_488 = -> validate.normalfloat           null ), /expected a normalfloat, got a null/
    throws2 T, ( Ω_intertype_489 = -> validate.normalfloat           -1   ), /expected a normalfloat, got a float/
    throws2 T, ( Ω_intertype_490 = -> validate.normalfloat           '?'  ), /expected a normalfloat, got a text/
    throws2 T, ( Ω_intertype_491 = -> validate.optional.normalfloat  -1   ), /expected an optional normalfloat, got a float/
    throws2 T, ( Ω_intertype_492 = -> validate.optional.normalfloat  '?'  ), /expected an optional normalfloat, got a text/
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
    eq2 T, ( Ω_intertype_493 = -> isa.quantity            { q: 1, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_494 = -> isa.quantity            null                ), false
    eq2 T, ( Ω_intertype_495 = -> isa.optional.quantity   { q: 2, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_496 = -> isa.optional.quantity   null                ), true
    eq2 T, ( Ω_intertype_497 = -> validate.quantity               { q: 3, u: 'm', } ), { q: 3, u: 'm', }
    eq2 T, ( Ω_intertype_498 = -> validate.optional.quantity      { q: 4, u: 'm', } ), { q: 4, u: 'm', }
    eq2 T, ( Ω_intertype_499 = -> validate.optional.quantity.q    null  ), null
    eq2 T, ( Ω_intertype_500 = -> validate.optional.quantity.q    111   ), 111
    eq2 T, ( Ω_intertype_501 = -> isa.quantity                     null               ), false
    eq2 T, ( Ω_intertype_502 = -> isa.quantity                     -1                 ), false
    eq2 T, ( Ω_intertype_503 = -> isa.quantity                     '?'                ), false
    eq2 T, ( Ω_intertype_504 = -> isa.quantity.q                   '?'                ), false
    eq2 T, ( Ω_intertype_505 = -> isa.quantity.q                   3                  ), true
    eq2 T, ( Ω_intertype_506 = -> isa.optional.quantity            { q: 1, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_507 = -> isa.optional.quantity            null               ), true
    eq2 T, ( Ω_intertype_508 = -> isa.optional.quantity            -1                 ), false
    eq2 T, ( Ω_intertype_509 = -> isa.optional.quantity            '?'                ), false
    eq2 T, ( Ω_intertype_510 = -> isa.optional.quantity.q          '?'                ), false
    eq2 T, ( Ω_intertype_511 = -> isa.optional.quantity.q          3                  ), true
    eq2 T, ( Ω_intertype_512 = -> validate.quantity                { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_513 = -> validate.optional.quantity       { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_514 = -> validate.optional.quantity       null               ), null
    throws2 T, ( Ω_intertype_342 = -> validate.quantity           { q: 5, }  ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_515 = -> validate.quantity            null      ), /expected a quantity, got a null/
    throws2 T, ( Ω_intertype_516 = -> validate.quantity            -1        ), /expected a quantity, got a float/
    throws2 T, ( Ω_intertype_517 = -> validate.quantity            '?'       ), /expected a quantity, got a text/
    throws2 T, ( Ω_intertype_518 = -> validate.quantity            { q: 1, } ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_519 = -> validate.optional.quantity   -1        ), /expected an optional quantity, got a float/
    throws2 T, ( Ω_intertype_520 = -> validate.optional.quantity   { q: 1, } ), /expected an optional quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_521 = -> validate.optional.quantity.q { q: 1, } ), /expected an optional quantity.q, got a object/
    throws2 T, ( Ω_intertype_522 = -> validate.optional.quantity.q 3, 4, 5   ), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@declaration_role_field = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { declarations  } = new Intertype()
    eq2 T, ( Ω_intertype_523 = -> declarations.float.role     ), 'usertype'
    eq2 T, ( Ω_intertype_524 = -> declarations.null.role      ), 'basetype'
    eq2 T, ( Ω_intertype_525 = -> declarations.anything.role  ), 'basetype'
    eq2 T, ( Ω_intertype_526 = -> declarations.unknown.role   ), 'basetype'
    eq2 T, ( Ω_intertype_527 = -> declarations.optional.role  ), 'optional'
    # throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_________________can_use_fields = ( T, done ) ->
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
  { Intertype_minimal } = require '../../../apps/intertype'
  { isa
    validate
    create
    declare
    type_of           } = new Intertype_minimal()
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_528 = -> type_of null              ), 'null'
    eq2 T, ( Ω_intertype_529 = -> type_of undefined         ), 'undefined'
    eq2 T, ( Ω_intertype_530 = -> type_of +Infinity         ), 'unknown'
    eq2 T, ( Ω_intertype_531 = -> type_of 4                 ), 'unknown'
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_532 = -> isa.anything   1          ), true
    eq2 T, ( Ω_intertype_533 = -> isa.nothing    1          ), false
    eq2 T, ( Ω_intertype_534 = -> isa.something  1          ), true
    eq2 T, ( Ω_intertype_535 = -> isa.unknown    1          ), true
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_536 = -> isa.anything   null       ), true
    eq2 T, ( Ω_intertype_537 = -> isa.nothing    null       ), true
    eq2 T, ( Ω_intertype_538 = -> isa.something  null       ), false
    eq2 T, ( Ω_intertype_539 = -> isa.unknown    null       ), false
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_540 = -> isa.anything   undefined  ), true
    eq2 T, ( Ω_intertype_541 = -> isa.nothing    undefined  ), true
    eq2 T, ( Ω_intertype_542 = -> isa.something  undefined  ), false
    eq2 T, ( Ω_intertype_543 = -> isa.unknown    undefined  ), false
    return null
  #.........................................................................................................
  do =>
    throws2 T, ( Ω_intertype_342 = -> isa.optional 1      ), /`optional` is not a legal type for `isa` methods/
    throws2 T, ( Ω_intertype_342 = -> validate.optional 1 ), /`optional` is not a legal type for `validate` methods/
    throws2 T, ( Ω_intertype_342 = -> create.optional 1   ), /`optional` is not a legal type for `create` methods/
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
  # @parallel_behavior_of_isa_validate_mandatory_and_optional()
  # test @parallel_behavior_of_isa_validate_mandatory_and_optional
  await test @


