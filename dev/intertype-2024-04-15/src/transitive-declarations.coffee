
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'INTERTYPE/tests/main'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
praise                    = CND.get_logger 'praise',    badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'

#-----------------------------------------------------------------------------------------------------------
@[ "transitive declarations 1" ] = ( T, done ) ->
  #.........................................................................................................
  INTERTYPE                 = require '../../../apps/intertype'
  { Intertype, }            = INTERTYPE
  intertype = new Intertype()
  { isa
    validate
    type_of
    types_of
    size_of
    declare
    sad
    sadden
    all_keys_of } = intertype.export()
  #.........................................................................................................
  has_only_keys = ( x, keys ) ->
    for k of x
      continue if k in keys
      # urge '^227266^', "has key #{rpr k}: #{rpr x}"
      return false
    return true
  #---------------------------------------------------------------------------------------------------------
  declare 'mixa_flagdefs', tests:
    "x is an object of mixa_flagdef":         ( x ) -> @isa_object_of 'mixa_flagdef', x
  #---------------------------------------------------------------------------------------------------------
  declare 'mixa_flagdef', tests:
    "x is an object":                         ( x ) -> @isa.object x
    "x.?type is a function":                  ( x ) -> @isa_optional.function       x.type
    "x.?alias is a text":                     ( x ) -> @isa_optional.text           x.alias
    "x.?description is a text":               ( x ) -> @isa_optional.text           x.description
    "x.?multiple is a _mixa_multiple":        ( x ) -> @isa_optional._mixa_multiple x.multiple
    "x.?fallback is anything":                ( x ) -> true
    "x has only keys 'type', 'alias', 'description', 'multiple', 'fallback'":     \
      ( x ) -> has_only_keys x, [ 'type', 'alias', 'description', 'multiple', 'fallback', ]
  #.........................................................................................................
  try ( debug '^3334^', validate.mixa_flagdefs { foo: { alias: 'f', }, }  ) catch error then warn error.message
  try ( debug '^3334^', validate.mixa_flagdefs { foo: { xxx:   'f', }, }  ) catch error then warn error.message
  try ( debug '^3334^', validate.mixa_flagdef  { xxx:   'f', }            ) catch error then warn error.message
  #.........................................................................................................
  done()
  return null

############################################################################################################
if require.main is module then do =>
  test @

  # jsidentifier_pattern = /// ^
  #   (?: [ $_ ]                    | \p{ID_Start}    )
  #   (?: [ $ _ \u{200c} \u{200d} ] | \p{ID_Continue} )*
  #   $ ///u
  # debug /\p{Script=Katakana}/u.test 't'
  # debug /\p{Script=Han}/u.test '谷'
  # debug /\p{ID_Start}/u.test '谷'
  # debug /\p{ID_Start}/u.test '5'
  # debug jsidentifier_pattern.test 'a'
  # debug jsidentifier_pattern.test '谷'
  # debug jsidentifier_pattern.test '5'



