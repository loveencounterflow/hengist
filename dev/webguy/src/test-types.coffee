
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'webguy/tests/basics'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
types                     = new ( require 'intertype-newest' ).Intertype()
{ isa }                   = types


#-----------------------------------------------------------------------------------------------------------
@types_isa_1 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.isa.null                           null          ), true
  T?.eq ( WG.types.isa.null                           undefined     ), false
  T?.eq ( WG.types.isa.list                           []            ), true
  T?.eq ( WG.types.isa.object                         {}            ), true
  T?.eq ( WG.types.isa.object                         []            ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_2 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.isa.null           undefined ), false
  T?.eq ( WG.types.isa.undefined      undefined ), true
  T?.eq ( WG.types.isa.anything       undefined ), true
  T?.eq ( WG.types.isa.something      undefined ), false
  T?.eq ( WG.types.isa.nothing        undefined ), true
  T?.eq ( WG.types.isa.text           undefined ), false
  T?.eq ( WG.types.isa.codepoint      undefined ), false
  T?.eq ( WG.types.isa.codepointid    undefined ), false
  T?.eq ( WG.types.isa.regex          undefined ), false
  T?.eq ( WG.types.isa.buffer         undefined ), false
  T?.eq ( WG.types.isa.jsidentifier   undefined ), false
  T?.eq ( WG.types.isa.list           undefined ), false
  T?.eq ( WG.types.isa.set            undefined ), false
  T?.eq ( WG.types.isa.map            undefined ), false
  T?.eq ( WG.types.isa.numeric        undefined ), false
  T?.eq ( WG.types.isa.float          undefined ), false
  T?.eq ( WG.types.isa.bigint         undefined ), false
  T?.eq ( WG.types.isa.integer        undefined ), false
  T?.eq ( WG.types.isa.cardinal       undefined ), false
  T?.eq ( WG.types.isa.zero           undefined ), false
  T?.eq ( WG.types.isa.nan            undefined ), false
  T?.eq ( WG.types.isa.even           undefined ), false
  T?.eq ( WG.types.isa.odd            undefined ), false
  T?.eq ( WG.types.isa.boolean        undefined ), false
  T?.eq ( WG.types.isa.object         undefined ), false
  T?.eq ( WG.types.isa.function       undefined ), false
  T?.eq ( WG.types.isa.asyncfunction  undefined ), false
  T?.eq ( WG.types.isa.symbol         undefined ), false
  T?.eq ( WG.types.isa.class          undefined ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_3 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.isa.null           ( null                  ) ), true
  T?.eq ( WG.types.isa.undefined      ( undefined             ) ), true
  T?.eq ( WG.types.isa.anything       ( null                  ) ), true
  T?.eq ( WG.types.isa.something      ( 1                     ) ), true
  T?.eq ( WG.types.isa.nothing        ( null                  ) ), true
  T?.eq ( WG.types.isa.text           ( ''                    ) ), true
  T?.eq ( WG.types.isa.text           ( 'eiuowe'              ) ), true
  T?.eq ( WG.types.isa.codepoint      ( 'x'                   ) ), true
  T?.eq ( WG.types.isa.codepoint      ( '\u{20000}'           ) ), true
  T?.eq ( WG.types.isa.codepointid    ( 0x1ffff               ) ), true
  T?.eq ( WG.types.isa.codepointid    ( 67                    ) ), true
  T?.eq ( WG.types.isa.regex          ( /123/y                ) ), true
  T?.eq ( WG.types.isa.buffer         ( Buffer.from '987'     ) ), true
  T?.eq ( WG.types.isa.jsidentifier   ( 'null'                ) ), true
  T?.eq ( WG.types.isa.list           ( [ '123', ]            ) ), true
  T?.eq ( WG.types.isa.set            ( new Set '123'         ) ), true
  T?.eq ( WG.types.isa.map            ( new Map()             ) ), true
  T?.eq ( WG.types.isa.numeric        ( 4                ) ), true
  T?.eq ( WG.types.isa.numeric        ( 4n                ) ), true
  T?.eq ( WG.types.isa.float          ( 4                ) ), true
  T?.eq ( WG.types.isa.float          ( 4.5                ) ), true
  T?.eq ( WG.types.isa.bigint         ( 5n                ) ), true
  T?.eq ( WG.types.isa.bigint         ( BigInt '123'                ) ), true
  T?.eq ( WG.types.isa.integer        ( 123456789                ) ), true
  T?.eq ( WG.types.isa.cardinal       ( 123456789             ) ), true
  T?.eq ( WG.types.isa.zero           ( 0                ) ), true
  T?.eq ( WG.types.isa.zero           ( 0n                ) ), true
  # T?.eq ( WG.types.isa.nan            ( null                ) ), true
  # T?.eq ( WG.types.isa.even           ( null                ) ), true
  # T?.eq ( WG.types.isa.odd            ( null                ) ), true
  # T?.eq ( WG.types.isa.boolean        ( null                ) ), true
  # T?.eq ( WG.types.isa.object         ( null                ) ), true
  # T?.eq ( WG.types.isa.function       ( null                ) ), true
  # T?.eq ( WG.types.isa.asyncfunction  ( null                ) ), true
  # T?.eq ( WG.types.isa.symbol         ( null                ) ), true
  T?.eq ( WG.types.isa.class          ( Promise               ) ), true
  T?.eq ( WG.types.isa.class          ( class C               ) ), true
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_4 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.isa.codepoint      ( 0x20000                   ) ), false
  T?.eq ( WG.types.isa.codepointid    ( 0x20000                   ) ), false
  T?.eq ( WG.types.isa.codepointid    ( -67                       ) ), false
  T?.eq ( WG.types.isa.codepointid    ( 67.89                     ) ), false
  T?.eq ( WG.types.isa.regex          ( '/123/y'                  ) ), false
  T?.eq ( WG.types.isa.buffer         ( '987'                     ) ), false
  T?.eq ( WG.types.isa.jsidentifier   ( ''                        ) ), false
  T?.eq ( WG.types.isa.list           ( '123'                     ) ), false
  T?.eq ( WG.types.isa.set            ( '123'                     ) ), false
  T?.eq ( WG.types.isa.class          ( Buffer                    ) ), false # surprise!
  T?.eq ( WG.types.isa.class          ( null                      ) ), false
  T?.eq ( WG.types.isa.class          ( new Promise ( a, b ) ->   ) ), false
  T?.eq ( WG.types.isa.class          ( new ( class C )()         ) ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_5 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_null           ( null               ) ), true
  T?.eq ( WG.types.isa.optional_null           ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_null           ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_undefined      ( null               ) ), true
  T?.eq ( WG.types.isa.optional_undefined      ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_undefined      ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_anything       ( null               ) ), true
  T?.eq ( WG.types.isa.optional_anything       ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_anything       ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_something      ( null               ) ), true
  T?.eq ( WG.types.isa.optional_something      ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_something      ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_nothing        ( null               ) ), true
  T?.eq ( WG.types.isa.optional_nothing        ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_nothing        ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_text           ( null               ) ), true
  T?.eq ( WG.types.isa.optional_text           ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_text           ( 'x'                ) ), true
  T?.eq ( WG.types.isa.optional_text           ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_codepoint      ( null               ) ), true
  T?.eq ( WG.types.isa.optional_codepoint      ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_codepoint      ( 'x'                ) ), true
  T?.eq ( WG.types.isa.optional_codepoint      ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_codepointid    ( null               ) ), true
  T?.eq ( WG.types.isa.optional_codepointid    ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_codepointid    ( '4'                ) ), false
  T?.eq ( WG.types.isa.optional_codepointid    ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_regex          ( null               ) ), true
  T?.eq ( WG.types.isa.optional_regex          ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_regex          ( /x/                ) ), true
  T?.eq ( WG.types.isa.optional_regex          ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_buffer         ( null               ) ), true
  T?.eq ( WG.types.isa.optional_buffer         ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_buffer         ( Buffer.from ''     ) ), true
  T?.eq ( WG.types.isa.optional_buffer         ( 'x'                ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_jsidentifier   ( null               ) ), true
  T?.eq ( WG.types.isa.optional_jsidentifier   ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_jsidentifier   ( 'xxx'              ) ), true
  T?.eq ( WG.types.isa.optional_jsidentifier   ( ' x '              ) ), false
  T?.eq ( WG.types.isa.optional_jsidentifier   ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_list           ( null               ) ), true
  T?.eq ( WG.types.isa.optional_list           ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_list           ( []                 ) ), true
  T?.eq ( WG.types.isa.optional_list           ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_set            ( null               ) ), true
  T?.eq ( WG.types.isa.optional_set            ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_set            ( new Set()          ) ), true
  T?.eq ( WG.types.isa.optional_set            ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_map            ( null               ) ), true
  T?.eq ( WG.types.isa.optional_map            ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_map            ( new Map()          ) ), true
  T?.eq ( WG.types.isa.optional_map            ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_numeric        ( null               ) ), true
  T?.eq ( WG.types.isa.optional_numeric        ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_numeric        ( 4                  ) ), true
  T?.eq ( WG.types.isa.optional_numeric        ( 4n                 ) ), true
  T?.eq ( WG.types.isa.optional_numeric        ( {}                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_float          ( null               ) ), true
  T?.eq ( WG.types.isa.optional_float          ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_float          ( 4                  ) ), true
  T?.eq ( WG.types.isa.optional_float          ( 4.5                ) ), true
  T?.eq ( WG.types.isa.optional_float          ( Infinity           ) ), false
  T?.eq ( WG.types.isa.optional_float          ( 4n                 ) ), false
  T?.eq ( WG.types.isa.optional_float          ( true               ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_bigint         ( null               ) ), true
  T?.eq ( WG.types.isa.optional_bigint         ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_bigint         ( 4n                 ) ), true
  T?.eq ( WG.types.isa.optional_bigint         ( 4                  ) ), false
  T?.eq ( WG.types.isa.optional_bigint         ( Infinity           ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_integer        ( null               ) ), true
  T?.eq ( WG.types.isa.optional_integer        ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_integer        ( 4                  ) ), true
  T?.eq ( WG.types.isa.optional_integer        ( 4.5                ) ), false
  T?.eq ( WG.types.isa.optional_integer        ( 4n                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_cardinal       ( null               ) ), true
  T?.eq ( WG.types.isa.optional_cardinal       ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_cardinal       ( 0                  ) ), true
  T?.eq ( WG.types.isa.optional_cardinal       ( 1                  ) ), true
  T?.eq ( WG.types.isa.optional_cardinal       ( -1                 ) ), false
  T?.eq ( WG.types.isa.optional_cardinal       ( 1n                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_zero           ( null               ) ), true
  T?.eq ( WG.types.isa.optional_zero           ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_zero           ( 0                  ) ), true
  T?.eq ( WG.types.isa.optional_zero           ( -0                 ) ), true
  T?.eq ( WG.types.isa.optional_zero           ( 0n                 ) ), true
  T?.eq ( WG.types.isa.optional_zero           ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_nan            ( null               ) ), true
  T?.eq ( WG.types.isa.optional_nan            ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_nan            ( NaN                ) ), true
  T?.eq ( WG.types.isa.optional_nan            ( 0 / 0              ) ), true
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_even           ( null               ) ), true
  T?.eq ( WG.types.isa.optional_even           ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_even           ( 4                  ) ), true
  T?.eq ( WG.types.isa.optional_even           ( 4n                 ) ), true
  T?.eq ( WG.types.isa.optional_even           ( 4.5                ) ), false
  T?.eq ( WG.types.isa.optional_even           ( 5                  ) ), false
  T?.eq ( WG.types.isa.optional_even           ( 5n                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_odd            ( null               ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( 5                  ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( 5n                 ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( 5.5                ) ), false
  T?.eq ( WG.types.isa.optional_odd            ( 4                  ) ), false
  T?.eq ( WG.types.isa.optional_odd            ( 4n                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_boolean        ( null               ) ), true
  T?.eq ( WG.types.isa.optional_boolean        ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_boolean        ( true               ) ), true
  T?.eq ( WG.types.isa.optional_boolean        ( false              ) ), true
  T?.eq ( WG.types.isa.optional_boolean        ( 1                  ) ), false
  T?.eq ( WG.types.isa.optional_boolean        ( 0                  ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_object         ( null               ) ), true
  T?.eq ( WG.types.isa.optional_object         ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_object         ( {}                 ) ), true
  T?.eq ( WG.types.isa.optional_object         ( []                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_function       ( null               ) ), true
  T?.eq ( WG.types.isa.optional_function       ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_asyncfunction  ( null               ) ), true
  T?.eq ( WG.types.isa.optional_asyncfunction  ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_symbol         ( null               ) ), true
  T?.eq ( WG.types.isa.optional_symbol         ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_class          ( null               ) ), true
  T?.eq ( WG.types.isa.optional_class          ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_class          ( Promise            ) ), true
  T?.eq ( WG.types.isa.optional_class          ( class C            ) ), true
  #.........................................................................................................
  done?()
  return null


#-----------------------------------------------------------------------------------------------------------
@types_maps_and_sets = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  T?.eq ( WG.types.isa.set new Set()       ), true
  T?.eq ( WG.types.isa.set new Map()       ), false
  T?.eq ( WG.types.isa.map new Set()       ), false
  T?.eq ( WG.types.isa.map new Map()       ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_iterables_and_containers = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  # T?.eq ( WG.types.isa.iterable       undefined ), false
  # T?.eq ( WG.types.isa.container      undefined ), false
  # T?.eq ( WG.types.isa.iterable       ( '' ) ), true
  # T?.eq ( WG.types.isa.iterable       ( [] ) ), true
  # T?.eq ( WG.types.isa.iterable       ( {} ) ), false
  # T?.eq ( WG.types.isa.container      ( [] ) ), true
  # T?.eq ( WG.types.isa.container      ( '' ) ), false
  # T?.eq ( WG.types.isa.container      ( {} ) ), false
  # T?.eq ( WG.types.isa.container      ( new Set() ) ), true
  # T?.eq ( WG.types.isa.container      ( new Map() ) ), true
  # T?.eq ( WG.types.isa.optional_iterable       ( null       ) ), true
  # T?.eq ( WG.types.isa.optional_iterable       ( undefined  ) ), true
  # T?.eq ( WG.types.isa.optional_container      ( null       ) ), true
  # T?.eq ( WG.types.isa.optional_container      ( undefined  ) ), true
  # T?.eq ( WG.types.isa.iterable       ( null ) ), false
  # T?.eq ( WG.types.isa.iterable       ( 'abc' ) ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_get_miller_device_name = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  debug '^3435^', WG.types.types
  #.........................................................................................................
  T?.eq ( WG.types.types.get_miller_device_name undefined ), 'Undefined'
  T?.eq ( WG.types.types.get_miller_device_name null ), 'Null'
  T?.eq ( WG.types.types.get_miller_device_name 4 ), 'Number'
  T?.eq ( WG.types.types.get_miller_device_name NaN ), 'Number'
  # T?.eq ( WG.types.isa.container      undefined ), false
  # T?.eq ( WG.types.isa.iterable       ( '' ) ), true
  # T?.eq ( WG.types.isa.iterable       ( [] ) ), true
  # T?.eq ( WG.types.isa.iterable       ( {} ) ), false
  # T?.eq ( WG.types.isa.container      ( [] ) ), true
  # T?.eq ( WG.types.isa.container      ( '' ) ), false
  # T?.eq ( WG.types.isa.container      ( {} ) ), false
  # T?.eq ( WG.types.isa.container      ( new Set() ) ), true
  # T?.eq ( WG.types.isa.container      ( new Map() ) ), true
  # T?.eq ( WG.types.isa.optional_iterable       ( null       ) ), true
  # T?.eq ( WG.types.isa.optional_iterable       ( undefined  ) ), true
  # T?.eq ( WG.types.isa.optional_container      ( null       ) ), true
  # T?.eq ( WG.types.isa.optional_container      ( undefined  ) ), true
  # T?.eq ( WG.types.isa.iterable       ( null ) ), false
  # T?.eq ( WG.types.isa.iterable       ( 'abc' ) ), true
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then await do =>
  # await test @
  test @types_get_miller_device_name
  # test @types_isa_6



