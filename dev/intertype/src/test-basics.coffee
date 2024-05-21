

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
  eq2 T, ( Ω_intertype_0001 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_0002 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa                       ), true
  eq2 T, ( Ω_intertype_0003 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa_optional              ), true
  eq2 T, ( Ω_intertype_0004 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate                  ), true
  eq2 T, ( Ω_intertype_0005 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate_optional         ), true
  eq2 T, ( Ω_intertype_0006 = -> TMP_types.isa.function  INTERTYPE.types._get_isa                      ), true
  eq2 T, ( Ω_intertype_0007 = -> TMP_types.isa.function  INTERTYPE.types._get_isa_optional             ), true
  eq2 T, ( Ω_intertype_0008 = -> TMP_types.isa.function  INTERTYPE.types._get_validate                 ), true
  eq2 T, ( Ω_intertype_0009 = -> TMP_types.isa.function  INTERTYPE.types._get_validate_optional        ), true
  eq2 T, ( Ω_intertype_0010 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
  eq2 T, ( Ω_intertype_0011 = -> TMP_types.isa.object    INTERTYPE.types.isa                           ), true
  # eq2 T, ( Ω_intertype_0012 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
  eq2 T, ( Ω_intertype_0013 = -> TMP_types.isa.object    INTERTYPE.types.validate                      ), true
  # eq2 T, ( Ω_intertype_0014 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
  eq2 T, ( Ω_intertype_0015 = -> TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
  eq2 T, ( Ω_intertype_0016 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
  eq2 T, ( Ω_intertype_0017 = -> TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
  eq2 T, ( Ω_intertype_0018 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
  eq2 T, ( Ω_intertype_0019 = -> TMP_types.isa.object    INTERTYPE.types.create                        ), true
  eq2 T, ( Ω_intertype_0020 = -> TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
  eq2 T, ( Ω_intertype_0021 = -> TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
  eq2 T, ( Ω_intertype_0022 = -> TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
  eq2 T, ( Ω_intertype_0023 = -> TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
  #.........................................................................................................
  # eq2 T, ( Ω_intertype_0024 = -> INTERTYPE.types.isa.name           ), 'isa'
  # eq2 T, ( Ω_intertype_0025 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
  # eq2 T, ( Ω_intertype_0026 = -> INTERTYPE.types.validate.name      ), 'validate'
  # eq2 T, ( Ω_intertype_0027 = -> INTERTYPE.types.create.name        ), 'create'
  eq2 T, ( Ω_intertype_0028 = -> INTERTYPE.types.declare.name       ), 'declare'
  eq2 T, ( Ω_intertype_0029 = -> INTERTYPE.types.type_of.name       ), 'type_of'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_types_object = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  types         = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_0030 = -> types.isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_0031 = -> types.isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_0032 = -> types.isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_0033 = -> types.isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_0034 = -> types.isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_0035 = -> types.isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_0036 = -> types.isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_0037 = -> types.isa.optional.boolean  1                   ), false
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0038 = -> types.validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_0039 = -> types.validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_0040 = -> types.validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_0041 = -> types.validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_0042 = -> types.validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_0043 = -> types.validate.optional.boolean      null       ), null
  try_and_show T,                           -> types.validate.boolean           1
  try_and_show T,                           -> types.validate.optional.boolean  1
  throws2 T, ( Ω_intertype_0044 = -> types.validate.boolean           1 ), /expected a boolean/
  throws2 T, ( Ω_intertype_0045 = -> types.validate.optional.boolean  1 ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0046 = -> types.type_of null            ), 'null'
  eq2 T, ( Ω_intertype_0047 = -> types.type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_0048 = -> types.type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_0049 = -> types.type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_0050 = -> types.type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_0051 = -> types.type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_0052 = -> types.type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_0053 = -> types.type_of -Infinity       ), 'unknown'
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
  eq2 T, ( Ω_intertype_0054 = -> types.isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_0055 = -> types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_0056 = -> types.validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_0057 = -> types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  eq2 T, ( Ω_intertype_0058 = -> types.declarations.null?.type              ), 'null'
  eq2 T, ( Ω_intertype_0059 = -> types.declarations.function?.type          ), 'function'
  eq2 T, ( Ω_intertype_0060 = -> types.declarations.boolean?.type           ), 'boolean'
  eq2 T, ( Ω_intertype_0061 = -> types.declarations.text?.type              ), 'text'
  eq2 T, ( Ω_intertype_0062 = -> types.declarations.asyncfunction?.type     ), 'asyncfunction'
  eq2 T, ( Ω_intertype_0063 = -> types.isa.null?.name                       ), 'isa.null'
  eq2 T, ( Ω_intertype_0064 = -> types.isa.function?.name                   ), 'isa.function'
  eq2 T, ( Ω_intertype_0065 = -> types.isa.boolean?.name                    ), 'isa.boolean'
  eq2 T, ( Ω_intertype_0066 = -> types.isa.text?.name                       ), 'isa.text'
  eq2 T, ( Ω_intertype_0067 = -> types.isa.asyncfunction?.name              ), 'isa.asyncfunction'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality_using_standalone_methods = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  eq2 T, ( Ω_intertype_0068 = -> isa.boolean           false               ), true
  eq2 T, ( Ω_intertype_0069 = -> isa.boolean           true                ), true
  eq2 T, ( Ω_intertype_0070 = -> isa.boolean           null                ), false
  eq2 T, ( Ω_intertype_0071 = -> isa.boolean           1                   ), false
  eq2 T, ( Ω_intertype_0072 = -> isa.unknown           1                   ), false
  eq2 T, ( Ω_intertype_0073 = -> isa.unknown           Infinity            ), true
  eq2 T, ( Ω_intertype_0074 = -> isa.optional.boolean  false               ), true
  eq2 T, ( Ω_intertype_0075 = -> isa.optional.boolean  true                ), true
  eq2 T, ( Ω_intertype_0076 = -> isa.optional.boolean  null                ), true
  eq2 T, ( Ω_intertype_0077 = -> isa.optional.boolean  1                   ), false
  eq2 T, ( Ω_intertype_0078 = -> isa.optional.unknown  1                   ), false
  eq2 T, ( Ω_intertype_0079 = -> isa.optional.unknown  Infinity            ), true
  eq2 T, ( Ω_intertype_0080 = -> isa.optional.unknown  undefined           ), true
  eq2 T, ( Ω_intertype_0081 = -> isa.optional.unknown  undefined           ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0082 = -> validate.boolean               false      ), false
  eq2 T, ( Ω_intertype_0083 = -> validate.boolean               true       ), true
  eq2 T, ( Ω_intertype_0084 = -> validate.optional.boolean      true       ), true
  eq2 T, ( Ω_intertype_0085 = -> validate.optional.boolean      false      ), false
  eq2 T, ( Ω_intertype_0086 = -> validate.optional.boolean      undefined  ), undefined
  eq2 T, ( Ω_intertype_0087 = -> validate.optional.boolean      null       ), null
  try_and_show T,                           -> validate.boolean           1
  try_and_show T,                           -> validate.optional.boolean  1
  throws2 T, ( Ω_intertype_0088 = -> validate.boolean           1  ), /expected a boolean/
  throws2 T, ( Ω_intertype_0089 = -> validate.optional.boolean  1  ), /expected an optional boolean/
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0090 = -> type_of null            ), 'null'
  eq2 T, ( Ω_intertype_0091 = -> type_of undefined       ), 'undefined'
  eq2 T, ( Ω_intertype_0092 = -> type_of false           ), 'boolean'
  eq2 T, ( Ω_intertype_0093 = -> type_of Symbol 'p'      ), 'symbol'
  eq2 T, ( Ω_intertype_0094 = -> type_of {}              ), 'object'
  eq2 T, ( Ω_intertype_0095 = -> type_of NaN             ), 'unknown'
  eq2 T, ( Ω_intertype_0096 = -> type_of +Infinity       ), 'unknown'
  eq2 T, ( Ω_intertype_0097 = -> type_of -Infinity       ), 'unknown'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0098 = -> isa.asyncfunction.name               ), 'isa.asyncfunction'
  eq2 T, ( Ω_intertype_0099 = -> isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
  eq2 T, ( Ω_intertype_0100 = -> validate.asyncfunction.name          ), 'validate.asyncfunction'
  eq2 T, ( Ω_intertype_0101 = -> validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_0102 = -> isa.float 3, 4 ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0103 = -> isa.float()    ), /method 'isa.float' expects 1 arguments, got 0/
  done?()

#-----------------------------------------------------------------------------------------------------------
@methods_check_arity = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  { isa
    validate
    type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
  #.........................................................................................................
  throws2 T, ( Ω_intertype_0104 = -> isa.float 3, 4               ), /method 'isa.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0105 = -> isa.float()                  ), /method 'isa.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_0106 = -> isa.optional.float 3, 4      ), /method 'isa.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0107 = -> isa.optional.float()         ), /method 'isa.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_0108 = -> validate.float 3, 4          ), /method 'validate.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0109 = -> validate.float()             ), /method 'validate.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_0110 = -> validate.optional.float 3, 4 ), /method 'validate.optional.float' expects 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0111 = -> validate.optional.float()    ), /method 'validate.optional.float' expects 1 arguments, got 0/
  throws2 T, ( Ω_intertype_0112 = -> type_of 3, 4                 ), /expected 1 arguments, got 2/
  throws2 T, ( Ω_intertype_0113 = -> type_of()                    ), /expected 1 arguments, got 0/
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
  eq2 T, ( Ω_intertype_0114 = -> isa.boolean                     boolean                 ), true
  eq2 T, ( Ω_intertype_0115 = -> isa.function                    $function               ), true
  eq2 T, ( Ω_intertype_0116 = -> isa.asyncfunction               asyncfunction           ), true
  eq2 T, ( Ω_intertype_0117 = -> isa.generatorfunction           generatorfunction       ), true
  eq2 T, ( Ω_intertype_0118 = -> isa.asyncgeneratorfunction      asyncgeneratorfunction  ), true
  eq2 T, ( Ω_intertype_0119 = -> isa.asyncgenerator              asyncgenerator          ), true
  eq2 T, ( Ω_intertype_0120 = -> isa.generator                   generator               ), true
  eq2 T, ( Ω_intertype_0121 = -> isa.symbol                      symbol                  ), true
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0122 = -> validate.boolean                boolean                 ), boolean
  eq2 T, ( Ω_intertype_0123 = -> validate.function               $function               ), $function
  eq2 T, ( Ω_intertype_0124 = -> validate.asyncfunction          asyncfunction           ), asyncfunction
  eq2 T, ( Ω_intertype_0125 = -> validate.generatorfunction      generatorfunction       ), generatorfunction
  eq2 T, ( Ω_intertype_0126 = -> validate.asyncgeneratorfunction asyncgeneratorfunction  ), asyncgeneratorfunction
  eq2 T, ( Ω_intertype_0127 = -> validate.asyncgenerator         asyncgenerator          ), asyncgenerator
  eq2 T, ( Ω_intertype_0128 = -> validate.generator              generator               ), generator
  eq2 T, ( Ω_intertype_0129 = -> validate.symbol                 symbol                  ), symbol
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0130 = -> type_of boolean                                         ), 'boolean'
  eq2 T, ( Ω_intertype_0131 = -> type_of $function                                       ), 'function'
  eq2 T, ( Ω_intertype_0132 = -> type_of asyncfunction                                   ), 'asyncfunction'
  eq2 T, ( Ω_intertype_0133 = -> type_of generatorfunction                               ), 'generatorfunction'
  eq2 T, ( Ω_intertype_0134 = -> type_of asyncgeneratorfunction                          ), 'asyncgeneratorfunction'
  eq2 T, ( Ω_intertype_0135 = -> type_of asyncgenerator                                  ), 'asyncgenerator'
  eq2 T, ( Ω_intertype_0136 = -> type_of generator                                       ), 'generator'
  eq2 T, ( Ω_intertype_0137 = -> type_of symbol                                          ), 'symbol'
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
  throws2 T, ( Ω_intertype_0138 = -> isa.quux                    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0139 = -> isa.quux()                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0140 = -> isa.quux 3                  ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0141 = -> isa.quux 3, 4               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0142 = -> isa.optional.quux           ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0143 = -> isa.optional.quux()         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0144 = -> isa.optional.quux 3         ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0145 = -> isa.optional.quux 3, 4      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0146 = -> validate.quux               ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0147 = -> validate.quux()             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0148 = -> validate.quux 3             ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0149 = -> validate.quux 3, 4          ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0150 = -> validate.optional.quux      ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0151 = -> validate.optional.quux()    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0152 = -> validate.optional.quux 3    ), /unknown type 'quux'/
  throws2 T, ( Ω_intertype_0153 = -> validate.optional.quux 3, 4 ), /unknown type 'quux'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_optional_is_declared = ( T, done ) ->
  INTERTYPE     = require '../../../apps/intertype'
  throws2 T, ( Ω_intertype_0154 = -> new INTERTYPE.Intertype_minimal { optional: ( ( x ) -> true ), } ), /not allowed to re-declare type 'optional'/
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@throw_instructive_error_when_wrong_type_of_isa_test_declared = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  throws2 T, ( Ω_intertype_0155 = -> new Intertype { foo: ( -> ), }                      ), /expected function with 1 parameters, got one with 0/
  throws2 T, ( Ω_intertype_0156 = -> new Intertype { foo: ( ( a, b ) -> ), }             ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_0157 = -> new Intertype { foo: true, }                        ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_0158 = -> new Intertype { foo: undefined, }                   ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_0159 = -> new Intertype { foo: null, }                        ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_0160 = -> new Intertype { foo: {}, }                          ), /expected type name, method, or object to indicate test method, got a undefined/
  throws2 T, ( Ω_intertype_0161 = -> new Intertype { foo: { test: null, }, }             ), /expected type name, method, or object to indicate test method, got a null/
  throws2 T, ( Ω_intertype_0162 = -> new Intertype { foo: { test: false, }, }            ), /expected type name, method, or object to indicate test method, got a boolean/
  throws2 T, ( Ω_intertype_0163 = -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }  ), /expected function with 1 parameters, got one with 2/
  throws2 T, ( Ω_intertype_0164 = -> new Intertype { foo: 'quux', }                      ), /unknown type 'quux'/
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
    eq2 T, ( Ω_intertype_0165 = -> TMP_types.isa.function types.isa.integer  ), true
    eq2 T, ( Ω_intertype_0166 = -> types.isa.integer.length                  ), 1
    eq2 T, ( Ω_intertype_0167 = -> types.isa.integer 123                     ), true
    eq2 T, ( Ω_intertype_0168 = -> types.isa.integer 123.456                 ), false
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
    throws2 T, ( Ω_intertype_0169 = -> new Intertype_minimal declarations ), /expected a function for `create` entry of type 'integer', got a asyncfunction/
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
    throws2 T, ( Ω_intertype_0170 = -> new Intertype_minimal declarations ), /template method for type 'foolist' has arity 1 but must be nullary/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_knows_its_base_types = ( T, done ) ->
  { isa } = require '../../../apps/intertype'
  #.........................................................................................................
  eq2 T, ( Ω_intertype_0171 = -> isa.basetype 'optional'   ), false
  eq2 T, ( Ω_intertype_0172 = -> isa.basetype 'anything'   ), true
  eq2 T, ( Ω_intertype_0173 = -> isa.basetype 'nothing'    ), true
  eq2 T, ( Ω_intertype_0174 = -> isa.basetype 'something'  ), true
  eq2 T, ( Ω_intertype_0175 = -> isa.basetype 'null'       ), true
  eq2 T, ( Ω_intertype_0176 = -> isa.basetype 'undefined'  ), true
  eq2 T, ( Ω_intertype_0177 = -> isa.basetype 'unknown'    ), true
  eq2 T, ( Ω_intertype_0178 = -> isa.basetype 'integer'    ), false
  eq2 T, ( Ω_intertype_0179 = -> isa.basetype 'float'      ), false
  eq2 T, ( Ω_intertype_0180 = -> isa.basetype 'basetype'   ), false
  eq2 T, ( Ω_intertype_0181 = -> isa.basetype 'quux'       ), false
  eq2 T, ( Ω_intertype_0182 = -> isa.basetype 'toString'   ), false
  eq2 T, ( Ω_intertype_0183 = -> isa.basetype null         ), false
  eq2 T, ( Ω_intertype_0184 = -> isa.basetype undefined    ), false
  eq2 T, ( Ω_intertype_0185 = -> isa.basetype 4            ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_licensed_overrides = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_0186 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        test:       ( x ) -> x is 'float'
    try_and_show T, -> ( types.declare overrides )
    throws2 T, ( Ω_intertype_0187 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_0188 = -> types.isa.float 4       ), true
    eq2 T, ( Ω_intertype_0189 = -> types.isa.float 'float' ), false
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_0190 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      float:
        override:   true
        test:       ( x ) -> x is 'float'
    throws2 T, ( Ω_intertype_0191 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
    return null
  #.........................................................................................................
  do =>
    types         = new Intertype()
    eq2 T, ( Ω_intertype_0192 = -> types.isa.float 4 ), true
    #.......................................................................................................
    overrides     =
      anything:
        override:   true
        test:       ( x ) -> true
    throws2 T, ( Ω_intertype_0193 = -> types.declare overrides ), /not allowed to re-declare basetype 'anything'/
    #.......................................................................................................
    ### pre-existing declaration remains valid: ###
    eq2 T, ( Ω_intertype_0194 = -> types.isa.anything 4       ), true
    eq2 T, ( Ω_intertype_0195 = -> types.isa.anything 'float' ), true
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
    eq2 T, ( Ω_intertype_0196 = -> TMP_types.isa.object types.declarations       ), true
    eq2 T, ( Ω_intertype_0197 = -> TMP_types.isa.object types.declarations.float ), true
    eq2 T, ( Ω_intertype_0198 = -> TMP_types.isa.object types.declarations.text  ), true
    #.......................................................................................................
    throws2 T, ( Ω_intertype_0199 = -> types.create.boolean() ), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/
    throws2 T, ( Ω_intertype_0200 = -> types.create.text 'foo' ), /expected 0 arguments, got 1/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0201 = -> types.create.text()         ), ''
    eq2 T, ( Ω_intertype_0202 = -> types.create.integer()      ), 0
    eq2 T, ( Ω_intertype_0203 = -> types.create.float()        ), 0
    eq2 T, ( Ω_intertype_0204 = -> types.create.float '123.45' ), 123.45
    throws2 T, ( Ω_intertype_0205 = -> types.create.float '***' ), /expected `create\.float\(\)` to return a float but it returned a nan/
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
    eq2 T, ( Ω_intertype_0206 = -> create.quantity()    ), { q: 0, u: 'u', }
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
    eq2 T, ( Ω_intertype_0207 = -> create.quantity()                         ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_0208 = -> create.quantity { q: 123, }               ), { q: 123, u: 'u', }
    eq2 T, ( Ω_intertype_0209 = -> create.quantity { u: 'kg', }              ), { q: 0, u: 'kg', }
    eq2 T, ( Ω_intertype_0210 = -> create.quantity { u: 'kg', foo: 'bar', }  ), { q: 0, u: 'kg', foo: 'bar', }
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
    eq2 T, ( Ω_intertype_0211 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_0212 = -> create.boolean()       ), false
    eq2 T, ( Ω_intertype_0213 = -> create.object()        ), {}
    eq2 T, ( Ω_intertype_0214 = -> create.float()         ), 0
    eq2 T, ( Ω_intertype_0215 = -> create.infinity()      ), Infinity
    eq2 T, ( Ω_intertype_0216 = -> create.text()          ), ''
    eq2 T, ( Ω_intertype_0217 = -> create.list()          ), []
    eq2 T, ( Ω_intertype_0218 = -> create.regex()         ), new RegExp()
    eq2 T, ( Ω_intertype_0219 = -> type_of create.function()      ), 'function'
    eq2 T, ( Ω_intertype_0220 = -> type_of create.asyncfunction() ), 'asyncfunction'
    eq2 T, ( Ω_intertype_0221 = -> type_of create.symbol()        ), 'symbol'
    throws2 T, ( Ω_intertype_0222 = -> create.basetype() ), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/
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
    eq2 T, ( Ω_intertype_0223 = -> create.quantity()                          ), { q: 0, u: 'u', }
    eq2 T, ( Ω_intertype_0224 = -> isa.quantity { q: 9, }                     ), false
    eq2 T, ( Ω_intertype_0225 = -> type_of declarations.quantity.sub_tests.q  ), 'function'
    eq2 T, ( Ω_intertype_0226 = -> type_of declarations.quantity.sub_tests.u  ), 'function'
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
    eq2 T, ( Ω_intertype_0227 = -> create.foo() ), { foo: { bar: 123, } }
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
    eq2 T, ( Ω_intertype_0228 = -> type_of declarations.quantity.test ), 'function'
    debug '^342342^', declarations.quantity
    eq2 T, ( Ω_intertype_0229 = -> type_of declarations.quantity.sub_tests.q ), 'function'
    eq2 T, ( Ω_intertype_0230 = -> type_of declarations.quantity.sub_tests.u ), 'function'
    eq2 T, ( Ω_intertype_0231 = -> isa.quantity { q: 987, u: 's', } ), true
    eq2 T, ( Ω_intertype_0232 = -> isa.quantity { q: 987, } ), false
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_minimal_has_only_base_types = ( T, done ) ->
  { Intertype_minimal } = require '../../../apps/intertype'
  types = new Intertype_minimal()
  eq2 T, ( Ω_intertype_0233 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown' ]
  types.declare { z: ( ( x ) -> ), }
  eq2 T, ( Ω_intertype_0234 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z' ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_use_type_name_for_test = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: 'quux', }
    throws2 T, ( Ω_intertype_0235 = -> types.declare { z: 'quux', } ), /unknown type 'quux'/
    types.declare { z: 'float', }
    eq2 T, ( Ω_intertype_0236 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_0237 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_0238 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_0239 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_0240 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_0241 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_0242 = -> types.declarations.z.test.name      ), 'z' # ?
  #.........................................................................................................
  do =>
    types = new Intertype()
    # try_and_show T, -> types.declare { z: { test: 'quux', }, }
    throws2 T, ( Ω_intertype_0243 = -> types.declare { z: { test: 'quux', }, } ), /unknown type 'quux'/
    types.declare { z: { test: 'float', }, }
    eq2 T, ( Ω_intertype_0244 = -> types.isa.z 12 ), true
    eq2 T, ( Ω_intertype_0245 = -> types.isa.float.name                ), 'isa.float'
    eq2 T, ( Ω_intertype_0246 = -> types.declarations.float.type       ), 'float'
    eq2 T, ( Ω_intertype_0247 = -> types.declarations.float.test.name  ), 'float'
    eq2 T, ( Ω_intertype_0248 = -> types.isa.z.name                    ), 'isa.z'
    eq2 T, ( Ω_intertype_0249 = -> types.declarations.z.type           ), 'z'
    eq2 T, ( Ω_intertype_0250 = -> types.declarations.z.test.name      ), 'z'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@resolve_dotted_type = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types = new Intertype()
    eq2 T, ( Ω_intertype_0251 = -> Reflect.has types.declarations, 'foo'           ), false
    types.declare { foo: 'object', }
    eq2 T, ( Ω_intertype_0252 = -> Reflect.has types.declarations, 'foo'           ), true
    eq2 T, ( Ω_intertype_0253 = -> Reflect.has types.declarations, 'foo.bar'       ), false
    types.declare { 'foo.bar': 'object', }
    eq2 T, ( Ω_intertype_0254 = -> Reflect.has types.declarations, 'foo.bar'       ), true
    eq2 T, ( Ω_intertype_0255 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), false
    types.declare { 'foo.bar.baz': 'float', }
    eq2 T, ( Ω_intertype_0256 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), true
    eq2 T, ( Ω_intertype_0257 = -> types.isa.foo.bar.baz null                      ), false
    eq2 T, ( Ω_intertype_0258 = -> types.isa.foo.bar.baz 4                         ), true
    eq2 T, ( Ω_intertype_0259 = -> types.isa.foo.bar.baz +Infinity                 ), false
    # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
    # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    try_and_show T, -> types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
    return null
  # #.........................................................................................................
  # do =>
  #   types = new Intertype()
  #   eq2 T, ( Ω_intertype_0260 = -> Reflect.has types.declarations, 'foo'         ), false
  #   types.declare { foo: 'object', }
  #   eq2 T, ( Ω_intertype_0261 = -> Reflect.has types.declarations, 'foo'         ), true
  #   eq2 T, ( Ω_intertype_0262 = -> Reflect.has types.declarations, 'foo.bar'     ), false
  #   types.declare { 'foo.bar': 'object', }
  #   eq2 T, ( Ω_intertype_0263 = -> Reflect.has types.declarations, 'foo.bar'     ), true
  #   eq2 T, ( Ω_intertype_0264 = -> Reflect.has types.declarations, 'foo.bar.baz' ), false
  #   types.declare { 'foo.bar.baz': 'optional.float', }
  #   eq2 T, ( Ω_intertype_0265 = -> Reflect.has types.declarations, 'foo.bar.baz' ), true
  #   eq2 T, ( Ω_intertype_0266 = -> types.isa.foo.bar.baz null ), true
  #   eq2 T, ( Ω_intertype_0267 = -> types.isa.foo.bar.baz 4 ), true
  #   eq2 T, ( Ω_intertype_0268 = -> types.isa.foo.bar.baz +Infinity ), false
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
    eq2 T, ( Ω_intertype_0269 = -> types.isa[ 'quantity.q' ] ), types.declarations[ 'quantity' ].sub_tests[ 'q' ]
    eq2 T, ( Ω_intertype_0270 = -> types.isa[ 'quantity.q' ] ), types.isa.quantity.q
    # debug '^409-1^', types.declarations
    eq2 T, ( Ω_intertype_0271 = -> types.isa.quantity {}                 ), false
    eq2 T, ( Ω_intertype_0272 = -> types.isa.quantity { q: {}, }         ), false
    eq2 T, ( Ω_intertype_0273 = -> types.isa.quantity { q: 3, }          ), false
    eq2 T, ( Ω_intertype_0274 = -> types.isa.quantity { q: 3, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_0275 = -> types.isa.quantity.q 3                ), true
    eq2 T, ( Ω_intertype_0276 = -> types.isa.quantity.q 3.1              ), true
    eq2 T, ( Ω_intertype_0277 = -> types.isa.quantity.q '3.1'            ), false
    eq2 T, ( Ω_intertype_0278 = -> types.isa.quantity.u 'm'              ), true
    eq2 T, ( Ω_intertype_0279 = -> types.isa.quantity.u null             ), false
    eq2 T, ( Ω_intertype_0280 = -> types.isa.quantity.u 3                ), false
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
    eq2 T, ( Ω_intertype_0281 = -> types.isa.person.address.city.name 'P'  ), true
    eq2 T, ( Ω_intertype_0282 = -> types.isa.person.address.city.name 1234 ), false
    eq2 T, ( Ω_intertype_0283 = -> types.isa.person 1234 ), false
    eq2 T, ( Ω_intertype_0284 = -> types.isa.person { name: 'Bob', } ), false
    eq2 T, ( Ω_intertype_0285 = -> types.isa.person { name: 'Bob', address: {}, } ), false
    eq2 T, ( Ω_intertype_0286 = -> types.isa.person { name: 'Bob', address: { city: {}, }, } ), false
    eq2 T, ( Ω_intertype_0287 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', }, }, } ), false
    eq2 T, ( Ω_intertype_0288 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', postcode: 'SO36', }, }, } ), true
    eq2 T, ( Ω_intertype_0289 = -> types.isa.person.address.city.name     'P'                                ), true
    eq2 T, ( Ω_intertype_0290 = -> types.isa.person.address.city.postcode 'SO36'                             ), true
    eq2 T, ( Ω_intertype_0291 = -> types.isa.person.address.city {         name: 'P', postcode: 'SO36', }    ), true
    eq2 T, ( Ω_intertype_0292 = -> types.isa.person.address      { city: { name: 'P', postcode: 'SO36', }, } ), true
    help '^322-1^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person'               ].sub_tests )
    help '^322-2^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address'       ].sub_tests )
    help '^322-3^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address.city'  ].sub_tests )
    eq2 T, ( Ω_intertype_0293 = -> Object.keys types.declarations[ 'person'               ].sub_tests ), [ 'name', 'address', ]
    eq2 T, ( Ω_intertype_0294 = -> Object.keys types.declarations[ 'person.address'       ].sub_tests ), [ 'city', ]
    eq2 T, ( Ω_intertype_0295 = -> Object.keys types.declarations[ 'person.address.city'  ].sub_tests ), [ 'name', 'postcode', ]
    eq2 T, ( Ω_intertype_0296 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address'      ].sub_tests ), true
    eq2 T, ( Ω_intertype_0297 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address.city' ].sub_tests ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':      'float', }
    types.declare { 'foo.bar':  'text',   }
    do =>
      d = 3
      # d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
      eq2 T, ( Ω_intertype_0298 = -> types.isa.foo d ), false
      return null
    do =>
      d = new Number 3
      d.bar = '?'
      eq2 T, ( Ω_intertype_0299 = -> d.bar ), '?'
      # still won't work b/c `float` doesn't accept objects (which is a good thing):
      eq2 T, ( Ω_intertype_0300 = -> types.isa.foo d ), false
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
    eq2 T, ( Ω_intertype_0301 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_0302 = -> types.isa.foo { bind: 1, apply: 2, call: 3, name: 4, length: 5, } ), true
    return null
  #.........................................................................................................
  do =>
    types = new Intertype()
    types.declare { 'foo':        'object',           }
    types.declare { 'foo.text':   ( ( x ) -> x is 1 ) }
    types.declare { 'foo.float':  ( ( x ) -> x is 2 ) }
    eq2 T, ( Ω_intertype_0303 = -> types.isa.foo {} ), false
    eq2 T, ( Ω_intertype_0304 = -> types.isa.foo { text: 1, float: 2, } ), true
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
    eq2 T, ( Ω_intertype_0305 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_0306 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_0307 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_0308 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_0309 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_0310 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_0311 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_0312 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_0313 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_0314 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_0315 = -> types.isa.mycity null ), false
    eq2 T, ( Ω_intertype_0316 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
    eq2 T, ( Ω_intertype_0317 = -> types.isa.person.address.city {} ), false
    eq2 T, ( Ω_intertype_0318 = -> types.isa.person.address.city null ), false
    eq2 T, ( Ω_intertype_0319 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_0320 = -> types.isa.optional.person.address.city {} ), false
    eq2 T, ( Ω_intertype_0321 = -> types.isa.optional.person.address.city null ), true
    eq2 T, ( Ω_intertype_0322 = -> types.isa.optional.person.address.city { name: 'P', postcode: 'SO36', } ), true
    eq2 T, ( Ω_intertype_0323 = -> types.isa.mycity {} ), false
    eq2 T, ( Ω_intertype_0324 = -> types.isa.mycity null ), true
    eq2 T, ( Ω_intertype_0325 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
#     eq2 T, ( Ω_intertype_0326 = -> isa.float       null  ), false
#     eq2 T, ( Ω_intertype_0327 = -> isa.float       true  ), false
#     eq2 T, ( Ω_intertype_0328 = -> isa.float       0     ), true
#     eq2 T, ( Ω_intertype_0329 = -> isa.maybefloat1 null  ), true
#     eq2 T, ( Ω_intertype_0330 = -> isa.maybefloat1 true  ), false
#     eq2 T, ( Ω_intertype_0331 = -> isa.maybefloat1 0     ), true
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
#     eq2 T, ( Ω_intertype_0332 = -> isa.q             null                    ), false
#     eq2 T, ( Ω_intertype_0333 = -> isa.q             {}                      ), true
#     eq2 T, ( Ω_intertype_0334 = -> isa.q             { maybefloat2: null }   ), true
#     eq2 T, ( Ω_intertype_0335 = -> isa.q             { maybefloat2: false }  ), false
#     eq2 T, ( Ω_intertype_0336 = -> isa.q             { maybefloat2: 3 }      ), true
#     eq2 T, ( Ω_intertype_0337 = -> isa.q.maybefloat2  null                   ), true
#     eq2 T, ( Ω_intertype_0338 = -> isa.q.maybefloat2  true                   ), false
#     eq2 T, ( Ω_intertype_0339 = -> isa.q.maybefloat2  0                      ), true
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
#     safeguard T, => eq2 T, ( Ω_intertype_0340 = -> isa.q             null                    ), true
#     safeguard T, => eq2 T, ( Ω_intertype_0341 = -> isa.q             {}                      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_0342 = -> isa.q             { maybefloat3: null }   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_0343 = -> isa.q             { maybefloat3: false }  ), false
#     safeguard T, => eq2 T, ( Ω_intertype_0344 = -> isa.q             { maybefloat3: 3 }      ), true
#     safeguard T, => eq2 T, ( Ω_intertype_0345 = -> isa.q.maybefloat3  null                   ), true
#     safeguard T, => eq2 T, ( Ω_intertype_0346 = -> isa.q.maybefloat3  true                   ), false
#     safeguard T, => eq2 T, ( Ω_intertype_0347 = -> isa.q.maybefloat3  0                      ), true
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
#     eq2 T, ( Ω_intertype_0348 = -> isa.person        null                                                            ), false
#     eq2 T, ( Ω_intertype_0349 = -> isa.person        {}                                                              ), false
#     eq2 T, ( Ω_intertype_0350 = -> isa.person        { name: 'Fred',                                               } ), false
#     eq2 T, ( Ω_intertype_0351 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
#     eq2 T, ( Ω_intertype_0352 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
#     eq2 T, ( Ω_intertype_0353 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
#     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
#     eq2 T, ( Ω_intertype_0354 = -> isa.maybesomeone  null                                                            ), true
#     # eq2 T, ( Ω_intertype_0355 = -> isa.maybesomeone  {}                                                              ), false
#     # eq2 T, ( Ω_intertype_0356 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
#     # eq2 T, ( Ω_intertype_0357 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
#     # eq2 T, ( Ω_intertype_0358 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
#     # eq2 T, ( Ω_intertype_0359 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
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
    throws2 T, ( Ω_intertype_0360 = -> types.declare { 'optional.d':    ( ( x ) -> ), } ), /illegal use of 'optional' in declaration of type 'optional.d'/
    throws2 T, ( Ω_intertype_0361 = -> types.declare { 'anything.d':    ( ( x ) -> ), } ), /illegal use of basetype 'anything' in declaration of type 'anything.d'/
    throws2 T, ( Ω_intertype_0362 = -> types.declare { 'nothing.d':     ( ( x ) -> ), } ), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/
    throws2 T, ( Ω_intertype_0363 = -> types.declare { 'something.d':   ( ( x ) -> ), } ), /illegal use of basetype 'something' in declaration of type 'something.d'/
    throws2 T, ( Ω_intertype_0364 = -> types.declare { 'null.d':        ( ( x ) -> ), } ), /illegal use of basetype 'null' in declaration of type 'null.d'/
    throws2 T, ( Ω_intertype_0365 = -> types.declare { 'undefined.d':   ( ( x ) -> ), } ), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/
    throws2 T, ( Ω_intertype_0366 = -> types.declare { 'unknown.d':     ( ( x ) -> ), } ), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/
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
    eq2 T, ( Ω_intertype_0367 = -> __type_of _isa, null          ), 'null'
    eq2 T, ( Ω_intertype_0368 = -> __type_of _isa, undefined     ), 'undefined'
    eq2 T, ( Ω_intertype_0369 = -> __type_of _isa, 4             ), 'float'
    eq2 T, ( Ω_intertype_0370 = -> __type_of _isa, ->            ), 'function'
    eq2 T, ( Ω_intertype_0371 = -> __type_of _isa, -> await null ), 'asyncfunction'
    eq2 T, ( Ω_intertype_0372 = -> __type_of _isa, {}            ), 'object'
    eq2 T, ( Ω_intertype_0373 = -> __type_of _isa, []            ), 'list'
    eq2 T, ( Ω_intertype_0374 = -> __type_of _isa, +Infinity     ), 'infinity'
    eq2 T, ( Ω_intertype_0375 = -> __type_of _isa, -Infinity     ), 'infinity'
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
    eq2 T, ( Ω_intertype_0376 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_0377 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_0378 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_0379 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_0380 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_0381 = -> probe.bar.baz.sub  is sub                ), true
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
    eq2 T, ( Ω_intertype_0382 = -> result                                   ), probe
    eq2 T, ( Ω_intertype_0383 = -> result.bar         is probe.bar          ), false
    eq2 T, ( Ω_intertype_0384 = -> result.bar.baz     is probe.bar.baz      ), false
    eq2 T, ( Ω_intertype_0385 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
    eq2 T, ( Ω_intertype_0386 = -> result.bar.baz.sub is sub                ), false
    eq2 T, ( Ω_intertype_0387 = -> probe.bar.baz.sub  is sub                ), true
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
    throws2 T, ( Ω_intertype_0388 = -> validate.person null                        ), /expected a person, got a null/
    throws2 T, ( Ω_intertype_0389 = -> validate.person.address null                ), /expected a person.address, got a null/
    throws2 T, ( Ω_intertype_0390 = -> validate.person.address.city null           ), /expected a person.address.city, got a null/
    throws2 T, ( Ω_intertype_0391 = -> validate.person.address.city.postcode null  ), /expected a person.address.city.postcode, got a null/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0392 = -> types.isa.person.address.city.postcode 3 ), false
    throws2 T, ( Ω_intertype_0393 = -> validate.person.address.city.postcode 3             ), /expected a person.address.city.postcode/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0394 = -> types.isa.person.address.city { name: 'P', } ), false
    throws2 T, ( Ω_intertype_0395 = -> validate.person.address.city { name: 'P', }         ), /expected a person.address.city/
    # #.......................................................................................................
    eq2 T, ( Ω_intertype_0396 = -> types.isa.person.address.city { postcode: '3421', } ), false
    throws2 T, ( Ω_intertype_0397 = -> validate.person.address.city()                      ), /method 'validate.person.address.city' expects 1 arguments, got 0/
    throws2 T, ( Ω_intertype_0398 = -> validate.person.address.city null                   ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_0399 = -> validate.person.address.city '3421'                 ), /expected a person.address.city/
    throws2 T, ( Ω_intertype_0400 = -> validate.person.address.city { postcode: '3421', }  ), /expected a person.address.city/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0401 = -> types.isa.person.address.city { name: 'P', postcode: '3421', } ), true
    eq2 T, ( Ω_intertype_0402 = -> validate.person.address.city { name: 'P', postcode: '3421', } ), { name: 'P', postcode: '3421', }
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
    throws2 T, ( Ω_intertype_0403 = -> evaluate.optional 1         ), /`optional` is not a legal type for `evaluate` methods/
    throws2 T, ( Ω_intertype_0404 = -> evaluate.optional.person 1  ), /`optional` is not a legal type for `evaluate` methods/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0405 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_0406 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0407 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_0408 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': true, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0409 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
    eq2 T, ( Ω_intertype_0410 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0411 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_0412 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0413 = -> isa.person       null  ), false
    eq2 T, ( Ω_intertype_0414 = -> evaluate.person  null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0415 = -> isa.person       {}    ), false
    eq2 T, ( Ω_intertype_0416 = -> evaluate.person  {}    ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
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
    eq2 T, ( Ω_intertype_0417 = -> isa.person                   { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
    eq2 T, ( Ω_intertype_0418 = -> evaluate.person              { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_0419 = -> Object.keys evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0420 = -> isa.person                   {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
    eq2 T, ( Ω_intertype_0421 = -> evaluate.person              {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_0422 = -> Object.keys evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0423 = -> isa.person                   null  ), false
    eq2 T, ( Ω_intertype_0424 = -> evaluate.person              null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_0425 = -> Object.keys evaluate.person  null  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0426 = -> isa.person                   {}  ), false
    eq2 T, ( Ω_intertype_0427 = -> evaluate.person              {}  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
    eq2 T, ( Ω_intertype_0428 = -> Object.keys evaluate.person  {}  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0429 = -> isa.person.address                   { city: { name: 'Atown', postcode: 'VA1234' } } ), true
    eq2 T, ( Ω_intertype_0430 = -> evaluate.person.address              { city: { name: 'Atown', postcode: 'VA1234' } } ), { 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
    eq2 T, ( Ω_intertype_0431 = -> Object.keys evaluate.person.address  { city: { name: 'Atown', postcode: 'VA1234' } } ), [ 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name' ]
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
    eq2 T, ( Ω_intertype_0432 = -> isa.generatorfunction walk_prefixes             ), true
    eq2 T, ( Ω_intertype_0433 = -> [ ( walk_prefixes 'one'                )..., ]  ), []
    eq2 T, ( Ω_intertype_0434 = -> [ ( walk_prefixes 'one.two'            )..., ]  ), [ 'one' ]
    eq2 T, ( Ω_intertype_0435 = -> [ ( walk_prefixes 'one.two.three'      )..., ]  ), [ 'one', 'one.two', ]
    eq2 T, ( Ω_intertype_0436 = -> [ ( walk_prefixes 'one.two.three.four' )..., ]  ), [ 'one', 'one.two', 'one.two.three', ]
    ### TAINT should not allow empty namers: ###
    eq2 T, ( Ω_intertype_0437 = -> [ ( walk_prefixes '.one.two.three'     )..., ]  ), [ '', '.one', '.one.two', ]
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
    throws2 T, ( Ω_intertype_0438 = -> types = new Intertype declarations ), /unknown partial type 'foo'/
    return null
  #.........................................................................................................
  do =>
    declarations =
      'quantity':         'object'
      'quantity.q':       'float'
      'quantity.u':       'text'
    types = new Intertype declarations
    eq2 T, ( Ω_intertype_0439 = -> types.isa.quantity {}                   ), false
    eq2 T, ( Ω_intertype_0440 = -> types.isa.quantity { q: 12, u: 'kg', }  ), true
    eq2 T, ( Ω_intertype_0441 = -> types.isa[ 'quantity.q' ] 12            ), true
    eq2 T, ( Ω_intertype_0442 = -> types.isa[ 'quantity.u' ] 'kg'          ), true
    eq2 T, ( Ω_intertype_0443 = -> types.isa.quantity.q 12                 ), true
    eq2 T, ( Ω_intertype_0444 = -> types.isa.quantity.u 'kg'               ), true
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
    eq2 T, ( Ω_intertype_0445 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_0446 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_0447 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_0448 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_0449 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_0450 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_0451 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_0452 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_0453 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_0454 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_0455 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_0456 = -> isa.nonempty.text 4           ), false
    ### this doesn't make a terrible lot of sense: ###
    eq2 T, ( Ω_intertype_0457 = -> isa.empty { list: [], text: '', set: new Set() } ), false
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
    eq2 T, ( Ω_intertype_0458 = -> isa.empty.list    []          ), true
    eq2 T, ( Ω_intertype_0459 = -> isa.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_0460 = -> isa.empty.list    4           ), false
    eq2 T, ( Ω_intertype_0461 = -> isa.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_0462 = -> isa.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_0463 = -> isa.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_0464 = -> isa.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_0465 = -> isa.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_0466 = -> isa.empty.text    4           ), false
    eq2 T, ( Ω_intertype_0467 = -> isa.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_0468 = -> isa.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_0469 = -> isa.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0470 = -> isa.empty []                  ), true
    eq2 T, ( Ω_intertype_0471 = -> isa.empty ''                  ), true
    eq2 T, ( Ω_intertype_0472 = -> isa.empty new Set()           ), true
    eq2 T, ( Ω_intertype_0473 = -> isa.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_0474 = -> isa.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_0475 = -> isa.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0476 = -> validate.empty []                  ), []
    eq2 T, ( Ω_intertype_0477 = -> validate.empty ''                  ), ''
    eq2 T, ( Ω_intertype_0478 = -> validate.empty new Set()           ), new Set()
    throws2 T, ( Ω_intertype_0479 = -> validate.empty [ 1, ]              ), /expected a empty, got a list/
    throws2 T, ( Ω_intertype_0480 = -> validate.empty 'A'                 ), /expected a empty, got a text/
    throws2 T, ( Ω_intertype_0481 = -> validate.empty new Set 'abc'       ), /expected a empty, got a set/
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
    eq2 T, ( Ω_intertype_0482 = -> isa.optional.empty.list    []          ), true
    eq2 T, ( Ω_intertype_0483 = -> isa.optional.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_0484 = -> isa.optional.empty.list    4           ), false
    eq2 T, ( Ω_intertype_0485 = -> isa.optional.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_0486 = -> isa.optional.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_0487 = -> isa.optional.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_0488 = -> isa.optional.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_0489 = -> isa.optional.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_0490 = -> isa.optional.empty.text    4           ), false
    eq2 T, ( Ω_intertype_0491 = -> isa.optional.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_0492 = -> isa.optional.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_0493 = -> isa.optional.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0494 = -> isa.optional.empty []                  ), true
    eq2 T, ( Ω_intertype_0495 = -> isa.optional.empty ''                  ), true
    eq2 T, ( Ω_intertype_0496 = -> isa.optional.empty new Set()           ), true
    eq2 T, ( Ω_intertype_0497 = -> isa.optional.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_0498 = -> isa.optional.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_0499 = -> isa.optional.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0500 = -> validate.optional.empty []                   ), []
    eq2 T, ( Ω_intertype_0501 = -> validate.optional.empty ''                   ), ''
    eq2 T, ( Ω_intertype_0502 = -> validate.optional.empty new Set()            ), new Set()
    eq2 T, ( Ω_intertype_0503 = -> validate.optional.empty.list  []             ), []
    eq2 T, ( Ω_intertype_0504 = -> validate.optional.empty.text  ''             ), ''
    eq2 T, ( Ω_intertype_0505 = -> validate.optional.empty.set   new Set()      ), new Set()
    throws2 T, ( Ω_intertype_0506 = -> validate.optional.empty [ 1, ]           ), /expected an optional empty, got a list/
    throws2 T, ( Ω_intertype_0507 = -> validate.optional.empty 'A'              ), /expected an optional empty, got a text/
    throws2 T, ( Ω_intertype_0508 = -> validate.optional.empty new Set 'abc'    ), /expected an optional empty, got a set/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0509 = -> isa.optional.empty []                        ), true
    eq2 T, ( Ω_intertype_0510 = -> isa.optional.empty ''                        ), true
    eq2 T, ( Ω_intertype_0511 = -> isa.optional.empty new Set()                 ), true
    eq2 T, ( Ω_intertype_0512 = -> isa.optional.empty [ 1, ]                    ), false
    eq2 T, ( Ω_intertype_0513 = -> isa.optional.empty 'A'                       ), false
    eq2 T, ( Ω_intertype_0514 = -> isa.optional.empty new Set 'abc'             ), false
    eq2 T, ( Ω_intertype_0515 = -> validate.optional.empty       null           ), null
    eq2 T, ( Ω_intertype_0516 = -> validate.optional.empty.list  null           ), null
    eq2 T, ( Ω_intertype_0517 = -> validate.optional.empty.text  null           ), null
    eq2 T, ( Ω_intertype_0518 = -> validate.optional.empty.set   null           ), null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@use_fields_to_declare_qualifiers = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    declarations =
      empty:
        role:     'qualifier'
        fields:
          list:     ( x ) -> ( @isa.list  x ) and ( x.length  is  0 )
          text:     ( x ) -> ( @isa.text  x ) and ( x.length  is  0 )
          set:      ( x ) -> ( @isa.set   x ) and ( x.size    is  0 )
      nonempty:
        role:     'qualifier'
        fields:
          list:     ( x ) -> ( @isa.list  x ) and ( x.length  >   0 )
          text:     ( x ) -> ( @isa.text  x ) and ( x.length  >   0 )
          set:      ( x ) -> ( @isa.set   x ) and ( x.size    >   0 )
    types         = new Intertype declarations
    { isa
      validate  } = types
    eq2 T, ( Ω_intertype_0519 = -> isa.optional.empty.list    []          ), true
    eq2 T, ( Ω_intertype_0520 = -> isa.optional.empty.list    [ 'A', ]    ), false
    eq2 T, ( Ω_intertype_0521 = -> isa.optional.empty.list    4           ), false
    eq2 T, ( Ω_intertype_0522 = -> isa.optional.nonempty.list []          ), false
    eq2 T, ( Ω_intertype_0523 = -> isa.optional.nonempty.list [ 'A', ]    ), true
    eq2 T, ( Ω_intertype_0524 = -> isa.optional.nonempty.list 4           ), false
    eq2 T, ( Ω_intertype_0525 = -> isa.optional.empty.text    ''          ), true
    eq2 T, ( Ω_intertype_0526 = -> isa.optional.empty.text    'A'         ), false
    eq2 T, ( Ω_intertype_0527 = -> isa.optional.empty.text    4           ), false
    eq2 T, ( Ω_intertype_0528 = -> isa.optional.nonempty.text ''          ), false
    eq2 T, ( Ω_intertype_0529 = -> isa.optional.nonempty.text 'A'         ), true
    eq2 T, ( Ω_intertype_0530 = -> isa.optional.nonempty.text 4           ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0531 = -> isa.optional.empty []                  ), true
    eq2 T, ( Ω_intertype_0532 = -> isa.optional.empty ''                  ), true
    eq2 T, ( Ω_intertype_0533 = -> isa.optional.empty new Set()           ), true
    eq2 T, ( Ω_intertype_0534 = -> isa.optional.empty [ 1, ]              ), false
    eq2 T, ( Ω_intertype_0535 = -> isa.optional.empty 'A'                 ), false
    eq2 T, ( Ω_intertype_0536 = -> isa.optional.empty new Set 'abc'       ), false
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0537 = -> validate.optional.empty []                   ), []
    eq2 T, ( Ω_intertype_0538 = -> validate.optional.empty ''                   ), ''
    eq2 T, ( Ω_intertype_0539 = -> validate.optional.empty new Set()            ), new Set()
    eq2 T, ( Ω_intertype_0540 = -> validate.optional.empty.list  []             ), []
    eq2 T, ( Ω_intertype_0541 = -> validate.optional.empty.text  ''             ), ''
    eq2 T, ( Ω_intertype_0542 = -> validate.optional.empty.set   new Set()      ), new Set()
    throws2 T, ( Ω_intertype_0543 = -> validate.optional.empty [ 1, ]           ), /expected an optional empty, got a list/
    throws2 T, ( Ω_intertype_0544 = -> validate.optional.empty 'A'              ), /expected an optional empty, got a text/
    throws2 T, ( Ω_intertype_0545 = -> validate.optional.empty new Set 'abc'    ), /expected an optional empty, got a set/
    #.......................................................................................................
    eq2 T, ( Ω_intertype_0546 = -> isa.optional.empty []                        ), true
    eq2 T, ( Ω_intertype_0547 = -> isa.optional.empty ''                        ), true
    eq2 T, ( Ω_intertype_0548 = -> isa.optional.empty new Set()                 ), true
    eq2 T, ( Ω_intertype_0549 = -> isa.optional.empty [ 1, ]                    ), false
    eq2 T, ( Ω_intertype_0550 = -> isa.optional.empty 'A'                       ), false
    eq2 T, ( Ω_intertype_0551 = -> isa.optional.empty new Set 'abc'             ), false
    eq2 T, ( Ω_intertype_0552 = -> validate.optional.empty       null           ), null
    eq2 T, ( Ω_intertype_0553 = -> validate.optional.empty.list  null           ), null
    eq2 T, ( Ω_intertype_0554 = -> validate.optional.empty.text  null           ), null
    eq2 T, ( Ω_intertype_0555 = -> validate.optional.empty.set   null           ), null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@disallow_rhs_optional = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    ### TAINT observe the out-comment messages would perhaps make more sense as they are more specific ###
    eq2 T, ( Ω_intertype_0556 = -> ( new Intertype() ).declare { foo: 'float', } ), null
    eq2 T, ( Ω_intertype_0557 = -> ( new Intertype() ).declare { foo: 'text',  } ), null
    # ( new Intertype() ).declare { foo: 'optional', }
    throws2 T, ( Ω_intertype_0558 = -> ( new Intertype() ).declare { foo: 'optional', }        ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_0559 = -> ( new Intertype() ).declare { foo: 'qqq', }             ), /unknown type 'qqq'/
    throws2 T, ( Ω_intertype_0560 = -> ( new Intertype() ).declare { foo: 'optional.float', }  ), /illegal use of 'optional' in declaration of type 'foo'/
    throws2 T, ( Ω_intertype_0561 = -> ( new Intertype() ).declare { foo: 'anything.float', }  ), /illegal use of basetype 'anything' in declaration of type 'foo'/
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
    eq2 T, ( Ω_intertype_0562 = -> isa.normalfloat                     0     ), true
    eq2 T, ( Ω_intertype_0563 = -> isa.normalfloat                     null  ), false
    eq2 T, ( Ω_intertype_0564 = -> isa.normalfloat                     -1    ), false
    eq2 T, ( Ω_intertype_0565 = -> isa.normalfloat                     '?'   ), false
    eq2 T, ( Ω_intertype_0566 = -> isa.optional.normalfloat            0     ), true
    eq2 T, ( Ω_intertype_0567 = -> isa.optional.normalfloat            null  ), true
    eq2 T, ( Ω_intertype_0568 = -> isa.optional.normalfloat            -1    ), false
    eq2 T, ( Ω_intertype_0569 = -> isa.optional.normalfloat            '?'   ), false
    eq2 T, ( Ω_intertype_0570 = -> validate.normalfloat                0     ), 0
    eq2 T, ( Ω_intertype_0571 = -> validate.optional.normalfloat       0     ), 0
    eq2 T, ( Ω_intertype_0572 = -> validate.optional.normalfloat       null  ), null
    throws2 T, ( Ω_intertype_0573 = -> validate.normalfloat           null ), /expected a normalfloat, got a null/
    throws2 T, ( Ω_intertype_0574 = -> validate.normalfloat           -1   ), /expected a normalfloat, got a float/
    throws2 T, ( Ω_intertype_0575 = -> validate.normalfloat           '?'  ), /expected a normalfloat, got a text/
    throws2 T, ( Ω_intertype_0576 = -> validate.optional.normalfloat  -1   ), /expected an optional normalfloat, got a float/
    throws2 T, ( Ω_intertype_0577 = -> validate.optional.normalfloat  '?'  ), /expected an optional normalfloat, got a text/
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
    eq2 T, ( Ω_intertype_0578 = -> isa.quantity            { q: 1, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_0579 = -> isa.quantity            null                ), false
    eq2 T, ( Ω_intertype_0580 = -> isa.optional.quantity   { q: 2, u: 'm', }   ), true
    eq2 T, ( Ω_intertype_0581 = -> isa.optional.quantity   null                ), true
    eq2 T, ( Ω_intertype_0582 = -> validate.quantity               { q: 3, u: 'm', } ), { q: 3, u: 'm', }
    eq2 T, ( Ω_intertype_0583 = -> validate.optional.quantity      { q: 4, u: 'm', } ), { q: 4, u: 'm', }
    eq2 T, ( Ω_intertype_0584 = -> validate.optional.quantity.q    null  ), null
    eq2 T, ( Ω_intertype_0585 = -> validate.optional.quantity.q    111   ), 111
    eq2 T, ( Ω_intertype_0586 = -> isa.quantity                     null               ), false
    eq2 T, ( Ω_intertype_0587 = -> isa.quantity                     -1                 ), false
    eq2 T, ( Ω_intertype_0588 = -> isa.quantity                     '?'                ), false
    eq2 T, ( Ω_intertype_0589 = -> isa.quantity.q                   '?'                ), false
    eq2 T, ( Ω_intertype_0590 = -> isa.quantity.q                   3                  ), true
    eq2 T, ( Ω_intertype_0591 = -> isa.optional.quantity            { q: 1, u: 'm', }  ), true
    eq2 T, ( Ω_intertype_0592 = -> isa.optional.quantity            null               ), true
    eq2 T, ( Ω_intertype_0593 = -> isa.optional.quantity            -1                 ), false
    eq2 T, ( Ω_intertype_0594 = -> isa.optional.quantity            '?'                ), false
    eq2 T, ( Ω_intertype_0595 = -> isa.optional.quantity.q          '?'                ), false
    eq2 T, ( Ω_intertype_0596 = -> isa.optional.quantity.q          3                  ), true
    eq2 T, ( Ω_intertype_0597 = -> validate.quantity                { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_0598 = -> validate.optional.quantity       { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
    eq2 T, ( Ω_intertype_0599 = -> validate.optional.quantity       null               ), null
    throws2 T, ( Ω_intertype_0600 = -> validate.quantity           { q: 5, }  ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_0601 = -> validate.quantity            null      ), /expected a quantity, got a null/
    throws2 T, ( Ω_intertype_0602 = -> validate.quantity            -1        ), /expected a quantity, got a float/
    throws2 T, ( Ω_intertype_0603 = -> validate.quantity            '?'       ), /expected a quantity, got a text/
    throws2 T, ( Ω_intertype_0604 = -> validate.quantity            { q: 1, } ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_0605 = -> validate.optional.quantity   -1        ), /expected an optional quantity, got a float/
    throws2 T, ( Ω_intertype_0606 = -> validate.optional.quantity   { q: 1, } ), /expected an optional quantity, got a object/ ### TAINT message should be more specific ###
    throws2 T, ( Ω_intertype_0607 = -> validate.optional.quantity.q { q: 1, } ), /expected an optional quantity.q, got a object/
    throws2 T, ( Ω_intertype_0608 = -> validate.optional.quantity.q 3, 4, 5   ), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@declaration_role_field = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    { declarations  } = new Intertype()
    eq2 T, ( Ω_intertype_0609 = -> declarations.float.role     ), 'usertype'
    eq2 T, ( Ω_intertype_0610 = -> declarations.null.role      ), 'basetype'
    eq2 T, ( Ω_intertype_0611 = -> declarations.anything.role  ), 'basetype'
    eq2 T, ( Ω_intertype_0612 = -> declarations.unknown.role   ), 'basetype'
    eq2 T, ( Ω_intertype_0613 = -> declarations.optional.role  ), 'optional'
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
    eq2 T, ( Ω_intertype_0614 = -> type_of null              ), 'null'
    eq2 T, ( Ω_intertype_0615 = -> type_of undefined         ), 'undefined'
    eq2 T, ( Ω_intertype_0616 = -> type_of +Infinity         ), 'unknown'
    eq2 T, ( Ω_intertype_0617 = -> type_of 4                 ), 'unknown'
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_0618 = -> isa.anything   1          ), true
    eq2 T, ( Ω_intertype_0619 = -> isa.nothing    1          ), false
    eq2 T, ( Ω_intertype_0620 = -> isa.something  1          ), true
    eq2 T, ( Ω_intertype_0621 = -> isa.unknown    1          ), true
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_0622 = -> isa.anything   null       ), true
    eq2 T, ( Ω_intertype_0623 = -> isa.nothing    null       ), true
    eq2 T, ( Ω_intertype_0624 = -> isa.something  null       ), false
    eq2 T, ( Ω_intertype_0625 = -> isa.unknown    null       ), false
    return null
  #.........................................................................................................
  do =>
    eq2 T, ( Ω_intertype_0626 = -> isa.anything   undefined  ), true
    eq2 T, ( Ω_intertype_0627 = -> isa.nothing    undefined  ), true
    eq2 T, ( Ω_intertype_0628 = -> isa.something  undefined  ), false
    eq2 T, ( Ω_intertype_0629 = -> isa.unknown    undefined  ), false
    return null
  #.........................................................................................................
  do =>
    throws2 T, ( Ω_intertype_0630 = -> isa.optional 1      ), /`optional` is not a legal type for `isa` methods/
    throws2 T, ( Ω_intertype_0631 = -> validate.optional 1 ), /`optional` is not a legal type for `validate` methods/
    throws2 T, ( Ω_intertype_0632 = -> create.optional 1   ), /`optional` is not a legal type for `create` methods/
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


