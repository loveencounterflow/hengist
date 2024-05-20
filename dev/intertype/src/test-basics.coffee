

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
  eq2 T, ( Ω_intertype_1000 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_1001 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa                       ), true
  eq2 T, ( Ω_intertype_1002 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa_optional              ), true
  eq2 T, ( Ω_intertype_1003 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate                  ), true
  eq2 T, ( Ω_intertype_1004 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate_optional         ), true
  eq2 T, ( Ω_intertype_1005 = -> TMP_types.isa.function  INTERTYPE.types._get_isa                      ), true
  eq2 T, ( Ω_intertype_1006 = -> TMP_types.isa.function  INTERTYPE.types._get_isa_optional             ), true
  eq2 T, ( Ω_intertype_1007 = -> TMP_types.isa.function  INTERTYPE.types._get_validate                 ), true
  eq2 T, ( Ω_intertype_1008 = -> TMP_types.isa.function  INTERTYPE.types._get_validate_optional        ), true
  eq2 T, ( Ω_intertype_1009 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_1010 = -> TMP_types.isa.object    INTERTYPE.types.isa                           ), true
  # eq2 T, ( Ω_intertype_1011 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
  eq2 T, ( Ω_intertype_1012 = -> TMP_types.isa.object    INTERTYPE.types.validate                      ), true
  # eq2 T, ( Ω_intertype_1013 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
  eq2 T, ( Ω_intertype_1014 = -> TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
  eq2 T, ( Ω_intertype_1015 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
  eq2 T, ( Ω_intertype_1016 = -> TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
  eq2 T, ( Ω_intertype_1017 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
  eq2 T, ( Ω_intertype_1018 = -> TMP_types.isa.object    INTERTYPE.types.create                        ), true
  eq2 T, ( Ω_intertype_1019 = -> TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
  eq2 T, ( Ω_intertype_1020 = -> TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
  eq2 T, ( Ω_intertype_1021 = -> TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
  eq2 T, ( Ω_intertype_1022 = -> TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
  #.........................................................................................................
  # eq2 T, ( Ω_intertype_1023 = -> INTERTYPE.types.isa.name           ), 'isa'
  # eq2 T, ( Ω_intertype_1024 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
  # eq2 T, ( Ω_intertype_1025 = -> INTERTYPE.types.validate.name      ), 'validate'
  # eq2 T, ( Ω_intertype_1026 = -> INTERTYPE.types.create.name        ), 'create'
  eq2 T, ( Ω_intertype_1027 = -> INTERTYPE.types.declare.name       ), 'declare'
  eq2 T, ( Ω_intertype_1028 = -> INTERTYPE.types.type_of.name       ), 'type_of'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_types_object = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  types         = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_1029 = -> types.isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_1030 = -> types.isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_1031 = -> types.isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_1032 = -> types.isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_1033 = -> types.isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_1034 = -> types.isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_1035 = -> types.isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_1036 = -> types.isa.optional.boolean  1                   ), false
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1037 = -> types.validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_1038 = -> types.validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_1039 = -> types.validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_1040 = -> types.validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_1041 = -> types.validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_1042 = -> types.validate.optional.boolean      null       ), null
  try_and_show T,                           -> types.validate.boolean           1
  try_and_show T,                           -> types.validate.optional.boolean  1
  throws2 T, ( Ω_intertype_1043 = -> types.validate.boolean           1 ), /expected a boolean/
  throws2 T, ( Ω_intertype_1044 = -> types.validate.optional.boolean  1 ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1045 = -> types.type_of null            ), 'null'
  eq2 T, ( Ω_intertype_1046 = -> types.type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_1047 = -> types.type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_1048 = -> types.type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_1049 = -> types.type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_1050 = -> types.type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_1051 = -> types.type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_1052 = -> types.type_of -Infinity       ), 'unknown'
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
  eq2 T, ( Ω_intertype_1053 = -> types.isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_1054 = -> types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_1055 = -> types.validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_1056 = -> types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  eq2 T, ( Ω_intertype_1057 = -> types.declarations.null?.type              ), 'null'
  eq2 T, ( Ω_intertype_1058 = -> types.declarations.function?.type          ), 'function'
  eq2 T, ( Ω_intertype_1059 = -> types.declarations.boolean?.type           ), 'boolean'
  eq2 T, ( Ω_intertype_1060 = -> types.declarations.text?.type              ), 'text'
  eq2 T, ( Ω_intertype_1061 = -> types.declarations.asyncfunction?.type     ), 'asyncfunction'
  eq2 T, ( Ω_intertype_1062 = -> types.isa.null?.name                       ), 'isa.null'
  eq2 T, ( Ω_intertype_1063 = -> types.isa.function?.name                   ), 'isa.function'
  eq2 T, ( Ω_intertype_1064 = -> types.isa.boolean?.name                    ), 'isa.boolean'
  eq2 T, ( Ω_intertype_1065 = -> types.isa.text?.name                       ), 'isa.text'
  eq2 T, ( Ω_intertype_1066 = -> types.isa.asyncfunction?.name              ), 'isa.asyncfunction'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_standalone_methods = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_1067 = -> isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_1068 = -> isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_1069 = -> isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_1070 = -> isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_1071 = -> isa.unknown           1                   ), false
  eq2 T, ( Ω_intertype_1072 = -> isa.unknown           Infinity            ), true
  eq2 T, ( Ω_intertype_1073 = -> isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_1074 = -> isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_1075 = -> isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_1076 = -> isa.optional.boolean  1                   ), false
  eq2 T, ( Ω_intertype_1077 = -> isa.optional.unknown  1                   ), false
  eq2 T, ( Ω_intertype_1078 = -> isa.optional.unknown  Infinity            ), true
  eq2 T, ( Ω_intertype_1079 = -> isa.optional.unknown  undefined           ), true
  eq2 T, ( Ω_intertype_1080 = -> isa.optional.unknown  undefined           ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1081 = -> validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_1082 = -> validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_1083 = -> validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_1084 = -> validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_1085 = -> validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_1086 = -> validate.optional.boolean      null       ), null
  try_and_show T,                           -> validate.boolean           1
  try_and_show T,                           -> validate.optional.boolean  1
  throws2 T, ( Ω_intertype_1087 = -> validate.boolean           1  ), /expected a boolean/
  throws2 T, ( Ω_intertype_1088 = -> validate.optional.boolean  1  ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1089 = -> type_of null            ), 'null'
  eq2 T, ( Ω_intertype_1090 = -> type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_1091 = -> type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_1092 = -> type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_1093 = -> type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_1094 = -> type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_1095 = -> type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_1096 = -> type_of -Infinity       ), 'unknown'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1097 = -> isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_1098 = -> isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_1099 = -> validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_1100 = -> validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_1101 = -> isa.float 3, 4 ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1102 = -> isa.float()    ), /method 'isa.float' expects 1 arguments, got 0/
  done?()

#-----------------------------------------------------------------------------------------------------------
@methods_check_arity = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  #.........................................................................................................
  throws2 T, ( Ω_intertype_1103 = -> isa.float 3, 4               ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1104 = -> isa.float()                  ), /method 'isa.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_1105 = -> isa.optional.float 3, 4      ), /method 'isa.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1106 = -> isa.optional.float()         ), /method 'isa.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_1107 = -> validate.float 3, 4          ), /method 'validate.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1108 = -> validate.float()             ), /method 'validate.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_1109 = -> validate.optional.float 3, 4 ), /method 'validate.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1110 = -> validate.optional.float()    ), /method 'validate.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_1111 = -> type_of 3, 4                 ), /expected 1 arguments, got 2/
  throws2 T, ( Ω_intertype_1112 = -> type_of()                    ), /expected 1 arguments, got 0/
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
  eq2 T, ( Ω_intertype_1113 = -> isa.boolean                     boolean                 ), true
  eq2 T, ( Ω_intertype_1114 = -> isa.function                    $function               ), true
  eq2 T, ( Ω_intertype_1115 = -> isa.asyncfunction               asyncfunction           ), true
  eq2 T, ( Ω_intertype_1116 = -> isa.generatorfunction           generatorfunction       ), true
  eq2 T, ( Ω_intertype_1117 = -> isa.asyncgeneratorfunction      asyncgeneratorfunction  ), true
  eq2 T, ( Ω_intertype_1118 = -> isa.asyncgenerator              asyncgenerator          ), true
  eq2 T, ( Ω_intertype_1119 = -> isa.generator                   generator               ), true
  eq2 T, ( Ω_intertype_1120 = -> isa.symbol                      symbol                  ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1121 = -> validate.boolean                boolean                 ), boolean
  eq2 T, ( Ω_intertype_1122 = -> validate.function               $function               ), $function
  eq2 T, ( Ω_intertype_1123 = -> validate.asyncfunction          asyncfunction           ), asyncfunction
  eq2 T, ( Ω_intertype_1124 = -> validate.generatorfunction      generatorfunction       ), generatorfunction
  eq2 T, ( Ω_intertype_1125 = -> validate.asyncgeneratorfunction asyncgeneratorfunction  ), asyncgeneratorfunction
  eq2 T, ( Ω_intertype_1126 = -> validate.asyncgenerator         asyncgenerator          ), asyncgenerator
  eq2 T, ( Ω_intertype_1127 = -> validate.generator              generator               ), generator
  eq2 T, ( Ω_intertype_1128 = -> validate.symbol                 symbol                  ), symbol
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1129 = -> type_of boolean                                         ), 'boolean'
  eq2 T, ( Ω_intertype_1130 = -> type_of $function                                       ), 'function'
  eq2 T, ( Ω_intertype_1131 = -> type_of asyncfunction                                   ), 'asyncfunction'
  eq2 T, ( Ω_intertype_1132 = -> type_of generatorfunction                               ), 'generatorfunction'
  eq2 T, ( Ω_intertype_1133 = -> type_of asyncgeneratorfunction                          ), 'asyncgeneratorfunction'
  eq2 T, ( Ω_intertype_1134 = -> type_of asyncgenerator                                  ), 'asyncgenerator'
  eq2 T, ( Ω_intertype_1135 = -> type_of generator                                       ), 'generator'
  eq2 T, ( Ω_intertype_1136 = -> type_of symbol                                          ), 'symbol'
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
  throws2 T, ( Ω_intertype_1137 = -> isa.quux                    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1138 = -> isa.quux()                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1139 = -> isa.quux 3                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1140 = -> isa.quux 3, 4               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1141 = -> isa.optional.quux           ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1142 = -> isa.optional.quux()         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1143 = -> isa.optional.quux 3         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1144 = -> isa.optional.quux 3, 4      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1145 = -> validate.quux               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1146 = -> validate.quux()             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1147 = -> validate.quux 3             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1148 = -> validate.quux 3, 4          ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1149 = -> validate.optional.quux      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1150 = -> validate.optional.quux()    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1151 = -> validate.optional.quux 3    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_1152 = -> validate.optional.quux 3, 4 ), /unknown type 'quux'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_optional_is_declared = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  throws2 T, ( Ω_intertype_1153 = -> new INTERTYPE.Intertype_minimal { optional: ( ( x ) -> true ), } ), /not allowed to re-declare type 'optional'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_wrong_type_of_isa_test_declared = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_1154 = -> new Intertype { foo: ( -> ), }                      ), /expected function with 1 parameters, got one with 0/
  throws2 T, ( Ω_intertype_1155 = -> new Intertype { foo: ( ( a, b ) -> ), }             ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_1156 = -> new Intertype { foo: true, }                        ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_1157 = -> new Intertype { foo: undefined, }                   ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_1158 = -> new Intertype { foo: null, }                        ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_1159 = -> new Intertype { foo: {}, }                          ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_1160 = -> new Intertype { foo: { test: null, }, }             ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_1161 = -> new Intertype { foo: { test: false, }, }            ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_1162 = -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }  ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_1163 = -> new Intertype { foo: 'quux', }                      ), /unknown type 'quux'/
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
    eq2 T, ( Ω_intertype_1164 = -> TMP_types.isa.function types.isa.integer  ), true
    eq2 T, ( Ω_intertype_1165 = -> types.isa.integer.length                  ), 1
    eq2 T, ( Ω_intertype_1166 = -> types.isa.integer 123                     ), true
    eq2 T, ( Ω_intertype_1167 = -> types.isa.integer 123.456                 ), false
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
    throws2 T, ( Ω_intertype_1168 = -> new Intertype_minimal declarations ), /expected a function for `create` entry of type 'integer', got a asyncfunction/
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
    throws2 T, ( Ω_intertype_1169 = -> new Intertype_minimal declarations ), /template method for type 'foolist' has arity 1 but must be nullary/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_knows_its_base_types = ( T, done ) ->
  { isa } = require '../../../apps/intertype'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_1170 = -> isa.basetype 'optional'   ), false
  eq2 T, ( Ω_intertype_1171 = -> isa.basetype 'anything'   ), true
  eq2 T, ( Ω_intertype_1172 = -> isa.basetype 'nothing'    ), true
  eq2 T, ( Ω_intertype_1173 = -> isa.basetype 'something'  ), true
  eq2 T, ( Ω_intertype_1174 = -> isa.basetype 'null'       ), true
  eq2 T, ( Ω_intertype_1175 = -> isa.basetype 'undefined'  ), true
  eq2 T, ( Ω_intertype_1176 = -> isa.basetype 'unknown'    ), true
  eq2 T, ( Ω_intertype_1177 = -> isa.basetype 'integer'    ), false
  eq2 T, ( Ω_intertype_1178 = -> isa.basetype 'float'      ), false
  eq2 T, ( Ω_intertype_1179 = -> isa.basetype 'basetype'   ), false
  eq2 T, ( Ω_intertype_1180 = -> isa.basetype 'quux'       ), false
  eq2 T, ( Ω_intertype_1181 = -> isa.basetype 'toString'   ), false
  eq2 T, ( Ω_intertype_1182 = -> isa.basetype null         ), false
  eq2 T, ( Ω_intertype_1183 = -> isa.basetype undefined    ), false
  eq2 T, ( Ω_intertype_1184 = -> isa.basetype 4            ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_licensed_overrides = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_1185 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        test:       ( x ) -> x is 'float'
    try_and_show T, -> ( types.declare overrides )
    throws2 T, ( Ω_intertype_1186 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_1187 = -> types.isa.float 4       ), true
    eq2 T, ( Ω_intertype_1188 = -> types.isa.float 'float' ), false
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_1189 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        override:   true
        test:       ( x ) -> x is 'float'
    throws2 T, ( Ω_intertype_1190 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_1191 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      anything:
        override:   true
        test:       ( x ) -> true
    throws2 T, ( Ω_intertype_1192 = -> types.declare overrides ), /not allowed to re-declare basetype 'anything'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_1193 = -> types.isa.anything 4       ), true
    eq2 T, ( Ω_intertype_1194 = -> types.isa.anything 'float' ), true
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
    eq2 T, ( Ω_intertype_1195 = -> TMP_types.isa.object types.declarations       ), true
    eq2 T, ( Ω_intertype_1196 = -> TMP_types.isa.object types.declarations.float ), true
    eq2 T, ( Ω_intertype_1197 = -> TMP_types.isa.object types.declarations.text  ), true
    #.......................................................................................................
    throws2 T, ( Ω_intertype_1198 = -> types.create.boolean() ), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/
    throws2 T, ( Ω_intertype_1199 = -> types.create.text 'foo' ), /expected 0 arguments, got 1/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1200 = -> types.create.text()         ), ''
    eq2 T, ( Ω_intertype_1201 = -> types.create.integer()      ), 0
    eq2 T, ( Ω_intertype_1202 = -> types.create.float()        ), 0
    eq2 T, ( Ω_intertype_1203 = -> types.create.float '123.45' ), 123.45
    throws2 T, ( Ω_intertype_1204 = -> types.create.float '***' ), /expected `create\.float\(\)` to return a float but it returned a nan/
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
    eq2 T, ( Ω_intertype_1205 = -> create.quantity()    ), { q: 0, u: 'u', }
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
    eq2 T, ( Ω_intertype_1206 = -> create.quantity()                         ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_1207 = -> create.quantity { q: 123, }               ), { q: 123, u: 'u', }
    eq2 T, ( Ω_intertype_1208 = -> create.quantity { u: 'kg', }              ), { q: 0, u: 'kg', }
    eq2 T, ( Ω_intertype_1209 = -> create.quantity { u: 'kg', foo: 'bar', }  ), { q: 0, u: 'kg', foo: 'bar', }
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
    eq2 T, ( Ω_intertype_1210 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_1211 = -> create.boolean()       ), false
    eq2 T, ( Ω_intertype_1212 = -> create.object()        ), {}
    eq2 T, ( Ω_intertype_1213 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_1214 = -> create.infinity()      ), Infinity
    eq2 T, ( Ω_intertype_1215 = -> create.text()          ), ''
    eq2 T, ( Ω_intertype_1216 = -> create.list()          ), []
    eq2 T, ( Ω_intertype_1217 = -> create.regex()         ), new RegExp()
    eq2 T, ( Ω_intertype_1218 = -> type_of create.function()      ), 'function'
    eq2 T, ( Ω_intertype_1219 = -> type_of create.asyncfunction() ), 'asyncfunction'
    eq2 T, ( Ω_intertype_1220 = -> type_of create.symbol()        ), 'symbol'
    throws2 T, ( Ω_intertype_1221 = -> create.basetype() ), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/
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
    eq2 T, ( Ω_intertype_1222 = -> create.quantity()                          ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_1223 = -> isa.quantity { q: 9, }                     ), false
    eq2 T, ( Ω_intertype_1224 = -> type_of declarations.quantity.sub_tests.q  ), 'function'
    eq2 T, ( Ω_intertype_1225 = -> type_of declarations.quantity.sub_tests.u  ), 'function'
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
    eq2 T, ( Ω_intertype_1226 = -> create.foo() ), { foo: { bar: 123, } }
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
    eq2 T, ( Ω_intertype_1227 = -> type_of declarations.quantity.test ), 'function'
    debug '^342342^', declarations.quantity
    eq2 T, ( Ω_intertype_1228 = -> type_of declarations.quantity.sub_tests.q ), 'function'
    eq2 T, ( Ω_intertype_1229 = -> type_of declarations.quantity.sub_tests.u ), 'function'
    eq2 T, ( Ω_intertype_1230 = -> isa.quantity { q: 987, u: 's', } ), true
    eq2 T, ( Ω_intertype_1231 = -> isa.quantity { q: 987, } ), false
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_minimal_has_only_base_types = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  types = new Intertype_minimal()
  eq2 T, ( Ω_intertype_1232 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown' ]
  types.declare { z: ( ( x ) -> ), }
  eq2 T, ( Ω_intertype_1233 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_type_name_for_test = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: 'quux', }
    throws2 T, ( Ω_intertype_1234 = -> types.declare { z: 'quux', } ), /unknown type 'quux'/
    types.declare { z: 'float', }
    eq2 T, ( Ω_intertype_1235 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_1236 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_1237 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_1238 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_1239 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_1240 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_1241 = -> types.declarations.z.test.name      ), 'z' # ?
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: { test: 'quux', }, }
    throws2 T, ( Ω_intertype_1242 = -> types.declare { z: { test: 'quux', }, } ), /unknown type 'quux'/
    types.declare { z: { test: 'float', }, }
    eq2 T, ( Ω_intertype_1243 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_1244 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_1245 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_1246 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_1247 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_1248 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_1249 = -> types.declarations.z.test.name      ), 'z'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@resolve_dotted_type = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    eq2 T, ( Ω_intertype_1250 = -> Reflect.has types.declarations, 'foo'           ), false
    types.declare { foo: 'object', }
    eq2 T, ( Ω_intertype_1251 = -> Reflect.has types.declarations, 'foo'           ), true
    eq2 T, ( Ω_intertype_1252 = -> Reflect.has types.declarations, 'foo.bar'       ), false
    types.declare { 'foo.bar': 'object', }
    eq2 T, ( Ω_intertype_1253 = -> Reflect.has types.declarations, 'foo.bar'       ), true
    eq2 T, ( Ω_intertype_1254 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), false
    types.declare { 'foo.bar.baz': 'float', }
    eq2 T, ( Ω_intertype_1255 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), true
    eq2 T, ( Ω_intertype_1256 = -> types.isa.foo.bar.baz null                      ), false
    eq2 T, ( Ω_intertype_1257 = -> types.isa.foo.bar.baz 4                         ), true
    eq2 T, ( Ω_intertype_1258 = -> types.isa.foo.bar.baz +Infinity                 ), false
    # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
    # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    return null
  # #.........................................................................................................
  # do =>
  #   types = new Intertype()
  #   eq2 T, ( Ω_intertype_1259 = -> Reflect.has types.declarations, 'foo'         ), false
  #   types.declare { foo: 'object', }
  #   eq2 T, ( Ω_intertype_1260 = -> Reflect.has types.declarations, 'foo'         ), true
  #   eq2 T, ( Ω_intertype_1261 = -> Reflect.has types.declarations, 'foo.bar'     ), false
  #   types.declare { 'foo.bar': 'object', }
  #   eq2 T, ( Ω_intertype_1262 = -> Reflect.has types.declarations, 'foo.bar'     ), true
  #   eq2 T, ( Ω_intertype_1263 = -> Reflect.has types.declarations, 'foo.bar.baz' ), false
  #   types.declare { 'foo.bar.baz': 'optional.float', }
  #   eq2 T, ( Ω_intertype_1264 = -> Reflect.has types.declarations, 'foo.bar.baz' ), true
  #   eq2 T, ( Ω_intertype_1265 = -> types.isa.foo.bar.baz null ), true
  #   eq2 T, ( Ω_intertype_1266 = -> types.isa.foo.bar.baz 4 ), true
  #   eq2 T, ( Ω_intertype_1267 = -> types.isa.foo.bar.baz +Infinity ), false
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
    eq2 T, ( Ω_intertype_1268 = -> types.isa[ 'quantity.q' ] ), types.declarations[ 'quantity' ].sub_tests[ 'q' ]
    eq2 T, ( Ω_intertype_1269 = -> types.isa[ 'quantity.q' ] ), types.isa.quantity.q
    # debug '^409-1^', types.declarations
    eq2 T, ( Ω_intertype_1270 = -> types.isa.quantity {}                 ), false
    eq2 T, ( Ω_intertype_1271 = -> types.isa.quantity { q: {}, }         ), false
    eq2 T, ( Ω_intertype_1272 = -> types.isa.quantity { q: 3, }          ), false
    eq2 T, ( Ω_intertype_1273 = -> types.isa.quantity { q: 3, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_1274 = -> types.isa.quantity.q 3                ), true
    eq2 T, ( Ω_intertype_1275 = -> types.isa.quantity.q 3.1              ), true
    eq2 T, ( Ω_intertype_1276 = -> types.isa.quantity.q '3.1'            ), false
    eq2 T, ( Ω_intertype_1277 = -> types.isa.quantity.u 'm'              ), true
    eq2 T, ( Ω_intertype_1278 = -> types.isa.quantity.u null             ), false
    eq2 T, ( Ω_intertype_1279 = -> types.isa.quantity.u 3                ), false
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
    eq2 T, ( Ω_intertype_1280 = -> types.isa.person.address.city.name 'P'  ), true
    eq2 T, ( Ω_intertype_1281 = -> types.isa.person.address.city.name 1234 ), false
    eq2 T, ( Ω_intertype_1282 = -> types.isa.person 1234 ), false
    eq2 T, ( Ω_intertype_1283 = -> types.isa.person { name: 'Bob', } ), false
    eq2 T, ( Ω_intertype_1284 = -> types.isa.person { name: 'Bob', address: {}, } ), false
    eq2 T, ( Ω_intertype_1285 = -> types.isa.person { name: 'Bob', address: { city: {}, }, } ), false
    eq2 T, ( Ω_intertype_1286 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', }, }, } ), false
    eq2 T, ( Ω_intertype_1287 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', postcode: 'SO36', }, }, } ), true
    eq2 T, ( Ω_intertype_1288 = -> types.isa.person.address.city.name     'P'                                ), true
    eq2 T, ( Ω_intertype_1289 = -> types.isa.person.address.city.postcode 'SO36'                             ), true
    eq2 T, ( Ω_intertype_1290 = -> types.isa.person.address.city {         name: 'P', postcode: 'SO36', }    ), true
    eq2 T, ( Ω_intertype_1291 = -> types.isa.person.address      { city: { name: 'P', postcode: 'SO36', }, } ), true
    help '^322-1^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person'               ].sub_tests )
    help '^322-2^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address'       ].sub_tests )
    help '^322-3^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address.city'  ].sub_tests )
    eq2 T, ( Ω_intertype_1292 = -> Object.keys types.declarations[ 'person'               ].sub_tests ), [ 'name', 'address', ]
    eq2 T, ( Ω_intertype_1293 = -> Object.keys types.declarations[ 'person.address'       ].sub_tests ), [ 'city', ]
    eq2 T, ( Ω_intertype_1294 = -> Object.keys types.declarations[ 'person.address.city'  ].sub_tests ), [ 'name', 'postcode', ]
    eq2 T, ( Ω_intertype_1295 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address'      ].sub_tests ), true
    eq2 T, ( Ω_intertype_1296 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address.city' ].sub_tests ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':      'float', }
    types.declare { 'foo.bar':  'text',   }
    do =>
      d = 3
      # d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
      eq2 T, ( Ω_intertype_1297 = -> types.isa.foo d ), false
      return null
    do =>
      d = new Number 3
      d.bar = '?'
      eq2 T, ( Ω_intertype_1298 = -> d.bar ), '?'
      # still won't work b/c `float` doesn't accept objects (which is a good thing):
      eq2 T, ( Ω_intertype_1299 = -> types.isa.foo d ), false
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
    eq2 T, ( Ω_intertype_1300 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_1301 = -> types.isa.foo { bind: 1, apply: 2, call: 3, name: 4, length: 5, } ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':        'object',           }
    types.declare { 'foo.text':   ( ( x ) -> x is 1 ) }
    types.declare { 'foo.float':  ( ( x ) -> x is 2 ) }
    eq2 T, ( Ω_intertype_1302 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_1303 = -> types.isa.foo { text: 1, float: 2, } ), true
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
    eq2 T, ( Ω_intertype_1304 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_1305 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_1306 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_1307 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_1308 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_1309 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_1310 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_1311 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_1312 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_1313 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_1314 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_1315 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_1316 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_1317 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_1318 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_1319 = -> types.isa.optional.person.address.city {} ), false
    eq2 T, ( Ω_intertype_1320 = -> types.isa.optional.person.address.city null ), true
    eq2 T, ( Ω_intertype_1321 = -> types.isa.optional.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_1322 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_1323 = -> types.isa.mycity null ), true
    eq2 T, ( Ω_intertype_1324 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
#     eq2 T, ( Ω_intertype_1325 = -> isa.float       null  ), false
#     eq2 T, ( Ω_intertype_1326 = -> isa.float       true  ), false
#     eq2 T, ( Ω_intertype_1327 = -> isa.float       0     ), true
#     eq2 T, ( Ω_intertype_1328 = -> isa.maybefloat1 null  ), true
#     eq2 T, ( Ω_intertype_1329 = -> isa.maybefloat1 true  ), false
#     eq2 T, ( Ω_intertype_1330 = -> isa.maybefloat1 0     ), true
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
#     eq2 T, ( Ω_intertype_1331 = -> isa.q             null                    ), false
#     eq2 T, ( Ω_intertype_1332 = -> isa.q             {}                      ), true
#     eq2 T, ( Ω_intertype_1333 = -> isa.q             { maybefloat2: null }   ), true
#     eq2 T, ( Ω_intertype_1334 = -> isa.q             { maybefloat2: false }  ), false
#     eq2 T, ( Ω_intertype_1335 = -> isa.q             { maybefloat2: 3 }      ), true
#     eq2 T, ( Ω_intertype_1336 = -> isa.q.maybefloat2  null                   ), true
#     eq2 T, ( Ω_intertype_1337 = -> isa.q.maybefloat2  true                   ), false
#     eq2 T, ( Ω_intertype_1338 = -> isa.q.maybefloat2  0                      ), true
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
#     safeguard T, => eq2 T, ( Ω_intertype_1339 = -> isa.q             null                    ), true
#     safeguard T, => eq2 T, ( Ω_intertype_1340 = -> isa.q             {}                      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_1341 = -> isa.q             { maybefloat3: null }   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_1342 = -> isa.q             { maybefloat3: false }  ), false
#     safeguard T, => eq2 T, ( Ω_intertype_1343 = -> isa.q             { maybefloat3: 3 }      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_1344 = -> isa.q.maybefloat3  null                   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_1345 = -> isa.q.maybefloat3  true                   ), false
#     safeguard T, => eq2 T, ( Ω_intertype_1346 = -> isa.q.maybefloat3  0                      ), true
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
#     eq2 T, ( Ω_intertype_1347 = -> isa.person        null                                                            ), false
#     eq2 T, ( Ω_intertype_1348 = -> isa.person        {}                                                              ), false
#     eq2 T, ( Ω_intertype_1349 = -> isa.person        { name: 'Fred',                                               } ), false
#     eq2 T, ( Ω_intertype_1350 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
#     eq2 T, ( Ω_intertype_1351 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
#     eq2 T, ( Ω_intertype_1352 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
#     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
#     eq2 T, ( Ω_intertype_1353 = -> isa.maybesomeone  null                                                            ), true
#     # eq2 T, ( Ω_intertype_1354 = -> isa.maybesomeone  {}                                                              ), false
#     # eq2 T, ( Ω_intertype_1355 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
#     # eq2 T, ( Ω_intertype_1356 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
#     # eq2 T, ( Ω_intertype_1357 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
#     # eq2 T, ( Ω_intertype_1358 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
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
    throws2 T, ( Ω_intertype_1359 = -> types.declare { 'optional.d':    ( ( x ) -> ), } ), /illegal use of 'optional' in declaration of type 'optional.d'/
    throws2 T, ( Ω_intertype_1360 = -> types.declare { 'anything.d':    ( ( x ) -> ), } ), /illegal use of basetype 'anything' in declaration of type 'anything.d'/
    throws2 T, ( Ω_intertype_1361 = -> types.declare { 'nothing.d':     ( ( x ) -> ), } ), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/
    throws2 T, ( Ω_intertype_1362 = -> types.declare { 'something.d':   ( ( x ) -> ), } ), /illegal use of basetype 'something' in declaration of type 'something.d'/
    throws2 T, ( Ω_intertype_1363 = -> types.declare { 'null.d':        ( ( x ) -> ), } ), /illegal use of basetype 'null' in declaration of type 'null.d'/
    throws2 T, ( Ω_intertype_1364 = -> types.declare { 'undefined.d':   ( ( x ) -> ), } ), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/
    throws2 T, ( Ω_intertype_1365 = -> types.declare { 'unknown.d':     ( ( x ) -> ), } ), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/
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
    eq2 T, ( Ω_intertype_1366 = -> __type_of _isa, null          ), 'null'
    eq2 T, ( Ω_intertype_1367 = -> __type_of _isa, undefined     ), 'undefined'
    eq2 T, ( Ω_intertype_1368 = -> __type_of _isa, 4             ), 'float'
    eq2 T, ( Ω_intertype_1369 = -> __type_of _isa, ->            ), 'function'
    eq2 T, ( Ω_intertype_1370 = -> __type_of _isa, -> await null ), 'asyncfunction'
    eq2 T, ( Ω_intertype_1371 = -> __type_of _isa, {}            ), 'object'
    eq2 T, ( Ω_intertype_1372 = -> __type_of _isa, []            ), 'list'
    eq2 T, ( Ω_intertype_1373 = -> __type_of _isa, +Infinity     ), 'infinity'
    eq2 T, ( Ω_intertype_1374 = -> __type_of _isa, -Infinity     ), 'infinity'
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
    eq2 T, ( Ω_intertype_1375 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_1376 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_1377 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_1378 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_1379 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_1380 = -> probe.bar.baz.sub  is sub                ), true
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
    eq2 T, ( Ω_intertype_1381 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_1382 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_1383 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_1384 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_1385 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_1386 = -> probe.bar.baz.sub  is sub                ), true
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
    throws2 T, ( Ω_intertype_1387 = -> validate.person null                        ), /expected a person, got a null/
    throws2 T, ( Ω_intertype_1388 = -> validate.person.address null                ), /expected a person.address, got a null/
    throws2 T, ( Ω_intertype_1389 = -> validate.person.address.city null           ), /expected a person.address.city, got a null/
    throws2 T, ( Ω_intertype_1390 = -> validate.person.address.city.postcode null  ), /expected a person.address.city.postcode, got a null/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1391 = -> types.isa.person.address.city.postcode 3 ), false
    throws2 T, ( Ω_intertype_1392 = -> validate.person.address.city.postcode 3             ), /expected a person.address.city.postcode/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1393 = -> types.isa.person.address.city { name: 'P', } ), false
    throws2 T, ( Ω_intertype_1394 = -> validate.person.address.city { name: 'P', }         ), /expected a person.address.city/
    # #.......................................................................................................
    eq2 T, ( Ω_intertype_1395 = -> types.isa.person.address.city { postcode: '3421', } ), false
    throws2 T, ( Ω_intertype_1396 = -> validate.person.address.city()                      ), /method 'validate.person.address.city' expects 1 arguments, got 0/
    throws2 T, ( Ω_intertype_1397 = -> validate.person.address.city null                   ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_1398 = -> validate.person.address.city '3421'                 ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_1399 = -> validate.person.address.city { postcode: '3421', }  ), /expected a person.address.city/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1400 = -> types.isa.person.address.city { name: 'P', postcode: '3421', } ), true
    eq2 T, ( Ω_intertype_1401 = -> validate.person.address.city { name: 'P', postcode: '3421', } ), { name: 'P', postcode: '3421', }
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
    throws2 T, ( Ω_intertype_1402 = -> evaluate.optional 1         ), /`optional` is not a legal type for `evaluate` methods/
    throws2 T, ( Ω_intertype_1403 = -> evaluate.optional.person 1  ), /`optional` is not a legal type for `evaluate` methods/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1404 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_1405 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1406 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_1407 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': true, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1408 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_1409 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1410 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_1411 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1412 = -> isa.person       null  ), false
    eq2 T, ( Ω_intertype_1413 = -> evaluate.person  null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1414 = -> isa.person       {}    ), false
    eq2 T, ( Ω_intertype_1415 = -> evaluate.person  {}    ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
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
    eq2 T, ( Ω_intertype_1416 = -> isa.person                   { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_1417 = -> evaluate.person              { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_1418 = -> Object.keys evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1419 = -> isa.person                   {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_1420 = -> evaluate.person              {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_1421 = -> Object.keys evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1422 = -> isa.person                   null  ), false
    eq2 T, ( Ω_intertype_1423 = -> evaluate.person              null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_1424 = -> Object.keys evaluate.person  null  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1425 = -> isa.person                   {}  ), false
    eq2 T, ( Ω_intertype_1426 = -> evaluate.person              {}  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_1427 = -> Object.keys evaluate.person  {}  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1428 = -> isa.person.address                   { city: { name: 'Atown', postcode: 'VA1234' } } ), true
    eq2 T, ( Ω_intertype_1429 = -> evaluate.person.address              { city: { name: 'Atown', postcode: 'VA1234' } } ), { 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_1430 = -> Object.keys evaluate.person.address  { city: { name: 'Atown', postcode: 'VA1234' } } ), [ 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name' ]
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
    eq2 T, ( Ω_intertype_1431 = -> isa.generatorfunction walk_prefixes             ), true
    eq2 T, ( Ω_intertype_1432 = -> [ ( walk_prefixes 'one'                )..., ]  ), []
    eq2 T, ( Ω_intertype_1433 = -> [ ( walk_prefixes 'one.two'            )..., ]  ), [ 'one' ]
    eq2 T, ( Ω_intertype_1434 = -> [ ( walk_prefixes 'one.two.three'      )..., ]  ), [ 'one', 'one.two', ]
    eq2 T, ( Ω_intertype_1435 = -> [ ( walk_prefixes 'one.two.three.four' )..., ]  ), [ 'one', 'one.two', 'one.two.three', ]
    ### TAINT should not allow empty namers: ###
    eq2 T, ( Ω_intertype_1436 = -> [ ( walk_prefixes '.one.two.three'     )..., ]  ), [ '', '.one', '.one.two', ]
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
    throws2 T, ( Ω_intertype_1437 = -> types = new Intertype declarations ), /unknown partial type 'foo'/
    return null
  #.........................................................................................................
  do =>
    declarations =
      'quantity':         'object'
      'quantity.q':       'float'
      'quantity.u':       'text'
    types = new Intertype declarations
    eq2 T, ( Ω_intertype_1438 = -> types.isa.quantity {}                   ), false
    eq2 T, ( Ω_intertype_1439 = -> types.isa.quantity { q: 12, u: 'kg', }  ), true
    eq2 T, ( Ω_intertype_1440 = -> types.isa[ 'quantity.q' ] 12            ), true
    eq2 T, ( Ω_intertype_1441 = -> types.isa[ 'quantity.u' ] 'kg'          ), true
    eq2 T, ( Ω_intertype_1442 = -> types.isa.quantity.q 12                 ), true
    eq2 T, ( Ω_intertype_1443 = -> types.isa.quantity.u 'kg'               ), true
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
    eq2 T, ( Ω_intertype_1444 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_1445 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_1446 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_1447 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_1448 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_1449 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_1450 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_1451 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_1452 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_1453 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_1454 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_1455 = -> isa.nonempty.text 4           ), false
    ### this doesn't make a terrible lot of sense: ###
    eq2 T, ( Ω_intertype_1456 = -> isa.empty { list: [], text: '', set: new Set() } ), false
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
    eq2 T, ( Ω_intertype_1457 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_1458 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_1459 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_1460 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_1461 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_1462 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_1463 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_1464 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_1465 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_1466 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_1467 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_1468 = -> isa.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1469 = -> isa.empty []                  ), true
    eq2 T, ( Ω_intertype_1470 = -> isa.empty ''                  ), true
    eq2 T, ( Ω_intertype_1471 = -> isa.empty new Set()           ), true
    eq2 T, ( Ω_intertype_1472 = -> isa.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_1473 = -> isa.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_1474 = -> isa.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1475 = -> validate.empty []                  ), []
    eq2 T, ( Ω_intertype_1476 = -> validate.empty ''                  ), ''
    eq2 T, ( Ω_intertype_1477 = -> validate.empty new Set()           ), new Set()
    throws2 T, ( Ω_intertype_1478 = -> validate.empty [ 1, ]              ), /expected a empty, got a list/
    throws2 T, ( Ω_intertype_1479 = -> validate.empty 'A'                 ), /expected a empty, got a text/
    throws2 T, ( Ω_intertype_1480 = -> validate.empty new Set 'abc'       ), /expected a empty, got a set/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_optional_with_qualifiers = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
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
    eq2 T, ( Ω_intertype_1481 = -> isa.optional.empty.list    []          ), true
    eq2 T, ( Ω_intertype_1482 = -> isa.optional.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_1483 = -> isa.optional.empty.list    4           ), false
    eq2 T, ( Ω_intertype_1484 = -> isa.optional.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_1485 = -> isa.optional.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_1486 = -> isa.optional.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_1487 = -> isa.optional.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_1488 = -> isa.optional.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_1489 = -> isa.optional.empty.text    4           ), false
    eq2 T, ( Ω_intertype_1490 = -> isa.optional.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_1491 = -> isa.optional.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_1492 = -> isa.optional.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1493 = -> isa.optional.empty []                  ), true
    eq2 T, ( Ω_intertype_1494 = -> isa.optional.empty ''                  ), true
    eq2 T, ( Ω_intertype_1495 = -> isa.optional.empty new Set()           ), true
    eq2 T, ( Ω_intertype_1496 = -> isa.optional.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_1497 = -> isa.optional.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_1498 = -> isa.optional.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1499 = -> validate.optional.empty []                   ), []
    eq2 T, ( Ω_intertype_1500 = -> validate.optional.empty ''                   ), ''
    eq2 T, ( Ω_intertype_1501 = -> validate.optional.empty new Set()            ), new Set()
    eq2 T, ( Ω_intertype_1502 = -> validate.optional.empty.list  []             ), []
    eq2 T, ( Ω_intertype_1503 = -> validate.optional.empty.text  ''             ), ''
    eq2 T, ( Ω_intertype_1504 = -> validate.optional.empty.set   new Set()      ), new Set()
    throws2 T, ( Ω_intertype_1505 = -> validate.optional.empty [ 1, ]           ), /expected an optional empty, got a list/
    throws2 T, ( Ω_intertype_1506 = -> validate.optional.empty 'A'              ), /expected an optional empty, got a text/
    throws2 T, ( Ω_intertype_1507 = -> validate.optional.empty new Set 'abc'    ), /expected an optional empty, got a set/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_1508 = -> isa.optional.empty []                        ), true
    eq2 T, ( Ω_intertype_1509 = -> isa.optional.empty ''                        ), true
    eq2 T, ( Ω_intertype_1510 = -> isa.optional.empty new Set()                 ), true
    eq2 T, ( Ω_intertype_1511 = -> isa.optional.empty [ 1, ]                    ), false
    eq2 T, ( Ω_intertype_1512 = -> isa.optional.empty 'A'                       ), false
    eq2 T, ( Ω_intertype_1513 = -> isa.optional.empty new Set 'abc'             ), false
    eq2 T, ( Ω_intertype_1514 = -> validate.optional.empty       null           ), null
    eq2 T, ( Ω_intertype_1515 = -> validate.optional.empty.list  null           ), null
    eq2 T, ( Ω_intertype_1516 = -> validate.optional.empty.text  null           ), null
    eq2 T, ( Ω_intertype_1517 = -> validate.optional.empty.set   null           ), null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_rhs_optional = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    ### TAINT observe the out-comment messages would perhaps make more sense as they are more specific ###
    eq2 T, ( Ω_intertype_1518 = -> ( new Intertype() ).declare { foo: 'float', } ), null
    eq2 T, ( Ω_intertype_1519 = -> ( new Intertype() ).declare { foo: 'text',  } ), null
    # ( new Intertype() ).declare { foo: 'optional', }
    throws2 T, ( Ω_intertype_1520 = -> ( new Intertype() ).declare { foo: 'optional', }        ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_1521 = -> ( new Intertype() ).declare { foo: 'qqq', }             ), /unknown type 'qqq'/
    throws2 T, ( Ω_intertype_1522 = -> ( new Intertype() ).declare { foo: 'optional.float', }  ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_1523 = -> ( new Intertype() ).declare { foo: 'anything.float', }  ), /illegal use of basetype 'anything' in declaration of type 'foo'/
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
    eq2 T, ( Ω_intertype_1524 = -> isa.normalfloat                     0     ), true
    eq2 T, ( Ω_intertype_1525 = -> isa.normalfloat                     null  ), false
    eq2 T, ( Ω_intertype_1526 = -> isa.normalfloat                     -1    ), false
    eq2 T, ( Ω_intertype_1527 = -> isa.normalfloat                     '?'   ), false
    eq2 T, ( Ω_intertype_1528 = -> isa.optional.normalfloat            0     ), true
    eq2 T, ( Ω_intertype_1529 = -> isa.optional.normalfloat            null  ), true
    eq2 T, ( Ω_intertype_1530 = -> isa.optional.normalfloat            -1    ), false
    eq2 T, ( Ω_intertype_1531 = -> isa.optional.normalfloat            '?'   ), false
    eq2 T, ( Ω_intertype_1532 = -> validate.normalfloat                0     ), 0
    eq2 T, ( Ω_intertype_1533 = -> validate.optional.normalfloat       0     ), 0
    eq2 T, ( Ω_intertype_1534 = -> validate.optional.normalfloat       null  ), null
    throws2 T, ( Ω_intertype_1535 = -> validate.normalfloat           null ), /expected a normalfloat, got a null/
    throws2 T, ( Ω_intertype_1536 = -> validate.normalfloat           -1   ), /expected a normalfloat, got a float/
    throws2 T, ( Ω_intertype_1537 = -> validate.normalfloat           '?'  ), /expected a normalfloat, got a text/
    throws2 T, ( Ω_intertype_1538 = -> validate.optional.normalfloat  -1   ), /expected an optional normalfloat, got a float/
    throws2 T, ( Ω_intertype_1539 = -> validate.optional.normalfloat  '?'  ), /expected an optional normalfloat, got a text/
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
    eq2 T, ( Ω_intertype_1540 = -> isa.quantity            { q: 1, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_1541 = -> isa.quantity            null                ), false
    eq2 T, ( Ω_intertype_1542 = -> isa.optional.quantity   { q: 2, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_1543 = -> isa.optional.quantity   null                ), true
    eq2 T, ( Ω_intertype_1544 = -> validate.quantity               { q: 3, u: 'm', } ), { q: 3, u: 'm', }
    eq2 T, ( Ω_intertype_1545 = -> validate.optional.quantity      { q: 4, u: 'm', } ), { q: 4, u: 'm', }
    eq2 T, ( Ω_intertype_1546 = -> validate.optional.quantity.q    null  ), null
    eq2 T, ( Ω_intertype_1547 = -> validate.optional.quantity.q    111   ), 111
    eq2 T, ( Ω_intertype_1548 = -> isa.quantity                     null               ), false
    eq2 T, ( Ω_intertype_1549 = -> isa.quantity                     -1                 ), false
    eq2 T, ( Ω_intertype_1550 = -> isa.quantity                     '?'                ), false
    eq2 T, ( Ω_intertype_1551 = -> isa.quantity.q                   '?'                ), false
    eq2 T, ( Ω_intertype_1552 = -> isa.quantity.q                   3                  ), true
    eq2 T, ( Ω_intertype_1553 = -> isa.optional.quantity            { q: 1, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_1554 = -> isa.optional.quantity            null               ), true
    eq2 T, ( Ω_intertype_1555 = -> isa.optional.quantity            -1                 ), false
    eq2 T, ( Ω_intertype_1556 = -> isa.optional.quantity            '?'                ), false
    eq2 T, ( Ω_intertype_1557 = -> isa.optional.quantity.q          '?'                ), false
    eq2 T, ( Ω_intertype_1558 = -> isa.optional.quantity.q          3                  ), true
    eq2 T, ( Ω_intertype_1559 = -> validate.quantity                { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_1560 = -> validate.optional.quantity       { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_1561 = -> validate.optional.quantity       null               ), null
    throws2 T, ( Ω_intertype_1562 = -> validate.quantity           { q: 5, }  ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_1563 = -> validate.quantity            null      ), /expected a quantity, got a null/
    throws2 T, ( Ω_intertype_1564 = -> validate.quantity            -1        ), /expected a quantity, got a float/
    throws2 T, ( Ω_intertype_1565 = -> validate.quantity            '?'       ), /expected a quantity, got a text/
    throws2 T, ( Ω_intertype_1566 = -> validate.quantity            { q: 1, } ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_1567 = -> validate.optional.quantity   -1        ), /expected an optional quantity, got a float/
    throws2 T, ( Ω_intertype_1568 = -> validate.optional.quantity   { q: 1, } ), /expected an optional quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_1569 = -> validate.optional.quantity.q { q: 1, } ), /expected an optional quantity.q, got a object/
    throws2 T, ( Ω_intertype_1570 = -> validate.optional.quantity.q 3, 4, 5   ), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@declaration_role_field = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { declarations  } = new Intertype()
    eq2 T, ( Ω_intertype_1571 = -> declarations.float.role     ), 'usertype'
    eq2 T, ( Ω_intertype_1572 = -> declarations.null.role      ), 'basetype'
    eq2 T, ( Ω_intertype_1573 = -> declarations.anything.role  ), 'basetype'
    eq2 T, ( Ω_intertype_1574 = -> declarations.unknown.role   ), 'basetype'
    eq2 T, ( Ω_intertype_1575 = -> declarations.optional.role  ), 'optional'
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
    eq2 T, ( Ω_intertype_1576 = -> type_of null              ), 'null'
    eq2 T, ( Ω_intertype_1577 = -> type_of undefined         ), 'undefined'
    eq2 T, ( Ω_intertype_1578 = -> type_of +Infinity         ), 'unknown'
    eq2 T, ( Ω_intertype_1579 = -> type_of 4                 ), 'unknown'
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_1580 = -> isa.anything   1          ), true
    eq2 T, ( Ω_intertype_1581 = -> isa.nothing    1          ), false
    eq2 T, ( Ω_intertype_1582 = -> isa.something  1          ), true
    eq2 T, ( Ω_intertype_1583 = -> isa.unknown    1          ), true
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_1584 = -> isa.anything   null       ), true
    eq2 T, ( Ω_intertype_1585 = -> isa.nothing    null       ), true
    eq2 T, ( Ω_intertype_1586 = -> isa.something  null       ), false
    eq2 T, ( Ω_intertype_1587 = -> isa.unknown    null       ), false
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_1588 = -> isa.anything   undefined  ), true
    eq2 T, ( Ω_intertype_1589 = -> isa.nothing    undefined  ), true
    eq2 T, ( Ω_intertype_1590 = -> isa.something  undefined  ), false
    eq2 T, ( Ω_intertype_1591 = -> isa.unknown    undefined  ), false
    return null
  #.........................................................................................................
  do =>
    throws2 T, ( Ω_intertype_1592 = -> isa.optional 1      ), /`optional` is not a legal type for `isa` methods/
    throws2 T, ( Ω_intertype_1593 = -> validate.optional 1 ), /`optional` is not a legal type for `validate` methods/
    throws2 T, ( Ω_intertype_1594 = -> create.optional 1   ), /`optional` is not a legal type for `create` methods/
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
  # @can_use_optional_with_qualifiers()
  # test @can_use_optional_with_qualifiers
  await test @


