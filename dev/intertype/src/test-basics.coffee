

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
  whisper }               = GUY.trm.get_loggers 'intertype'
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
  text:                   ( x ) -> ( typeof x ) is 'string'
  nullary:                ( x ) -> x? and ( ( x.length is 0 ) or ( x.size is 0 ) )
  unary:                  ( x ) -> x? and ( ( x.length is 1 ) or ( x.size is 1 ) )
  binary:                 ( x ) -> x? and ( ( x.length is 2 ) or ( x.size is 2 ) )
  trinary:                ( x ) -> x? and ( ( x.length is 3 ) or ( x.size is 3 ) )


#===========================================================================================================
throws = ( T, matcher, f ) ->
  await do =>
    error = null
    debug '^992-56^', matcher, TMP_types.type_of matcher
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
    warn '^992-4^', reverse message = "expected an error but none was thrown"
    T.fail "^992-5^ expected an error but none was thrown"
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
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@basic_functionality = ( T, done ) ->
  # T?.halt_on_error()
  INTERTYPE     = require '../../../apps/intertype'
  types         = new INTERTYPE.Intertype sample_declarations
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
  done?()



#===========================================================================================================
if module is require.main then await do =>
  @basic_functionality()
  await test @


