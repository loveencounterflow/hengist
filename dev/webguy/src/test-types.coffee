
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
  T?.eq ( WG.types.isa.numeric        ( 4                     ) ), true
  T?.eq ( WG.types.isa.numeric        ( 4n                    ) ), true
  T?.eq ( WG.types.isa.float          ( 4                     ) ), true
  T?.eq ( WG.types.isa.float          ( 4.5                   ) ), true
  T?.eq ( WG.types.isa.bigint         ( 5n                    ) ), true
  T?.eq ( WG.types.isa.bigint         ( BigInt '123'          ) ), true
  T?.eq ( WG.types.isa.integer        ( 123456789             ) ), true
  T?.eq ( WG.types.isa.cardinal       ( 123456789             ) ), true
  T?.eq ( WG.types.isa.zero           ( 0                     ) ), true
  T?.eq ( WG.types.isa.nan            ( 0 / 0                 ) ), true
  T?.eq ( WG.types.isa.even           ( 4                     ) ), true
  T?.eq ( WG.types.isa.odd            ( 5                     ) ), true
  T?.eq ( WG.types.isa.boolean        ( true                  ) ), true
  T?.eq ( WG.types.isa.boolean        ( false                 ) ), true
  T?.eq ( WG.types.isa.object         ( {}                    ) ), true
  T?.eq ( WG.types.isa.function       ( ->                    ) ), true
  T?.eq ( WG.types.isa.asyncfunction  ( -> await 4            ) ), true
  T?.eq ( WG.types.isa.symbol         ( Symbol 'x'            ) ), true
  T?.eq ( WG.types.isa.symbol         ( Symbol.for 'x'        ) ), true
  T?.eq ( WG.types.isa.class          ( Promise               ) ), true
  T?.eq ( WG.types.isa.class          ( class C               ) ), true
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_4 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  types = new WG.types.Intertype()
  #.........................................................................................................
  # debug '^types_isa_4@1^', ( types.isa.codepoint      ( 0x20000                   ) )
  # debug '^types_isa_4@1^', ( types.isa.codepointid    ( 0x20000                   ) )
  # debug '^types_isa_4@1^', ( types.isa.codepointid    ( -67                       ) )
  # debug '^types_isa_4@1^', ( types.isa.codepointid    ( 67.89                     ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.codepointid    ( 67.89                     ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.regex          ( '/123/y'                  ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.buffer         ( '987'                     ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.jsidentifier   ( ''                        ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.list           ( '123'                     ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.set            ( '123'                     ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.class          ( Buffer                    ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.class          ( null                      ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.class          ( new Promise ( a, b ) ->   ) )
  # debug '^types_isa_4@1^', ( WG.types.isa.class          ( new ( class C )()         ) )
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
  T?.eq ( WG.types.isa.numeric        ( '4'                       ) ), false
  T?.eq ( WG.types.isa.numeric        ( true                      ) ), false
  T?.eq ( WG.types.isa.float          ( '4.5'                     ) ), false
  T?.eq ( WG.types.isa.bigint         ( '4'                       ) ), false
  T?.eq ( WG.types.isa.integer        ( '4'                       ) ), false
  T?.eq ( WG.types.isa.cardinal       ( '4'                       ) ), false
  T?.eq ( WG.types.isa.zero           ( '0'                       ) ), false
  T?.eq ( WG.types.isa.nan            ( 1 / 0                     ) ), false
  T?.eq ( WG.types.isa.even           ( '4'                       ) ), false
  T?.eq ( WG.types.isa.odd            ( '5'                       ) ), false
  T?.eq ( WG.types.isa.zero           ( 0n                        ) ), false
  T?.eq ( WG.types.isa.even           ( 4n                        ) ), false
  T?.eq ( WG.types.isa.odd            ( 5n                        ) ), false
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
  T?.eq ( WG.types.isa.optional_zero           ( 0n                 ) ), false
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
  T?.eq ( WG.types.isa.optional_even           ( 4n                 ) ), false
  T?.eq ( WG.types.isa.optional_even           ( 4.5                ) ), false
  T?.eq ( WG.types.isa.optional_even           ( 5                  ) ), false
  T?.eq ( WG.types.isa.optional_even           ( 5n                 ) ), false
  #.........................................................................................................
  T?.eq ( WG.types.isa.optional_odd            ( null               ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( undefined          ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( 5                  ) ), true
  T?.eq ( WG.types.isa.optional_odd            ( 5n                 ) ), false
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
  #.........................................................................................................
  T?.eq ( WG.types.get_miller_device_name undefined                     ), 'Undefined'
  T?.eq ( WG.types.get_miller_device_name null                          ), 'Null'
  T?.eq ( WG.types.get_miller_device_name 4                             ), 'Number'
  T?.eq ( WG.types.get_miller_device_name NaN                           ), 'Number'
  T?.eq ( WG.types.get_miller_device_name Promise                       ), 'Function'
  T?.eq ( WG.types.get_miller_device_name ( class C )                   ), 'Function'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_get_carter_device_name = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.get_carter_device_name undefined                     ), 'other'
  T?.eq ( WG.types.get_carter_device_name null                          ), 'other'
  T?.eq ( WG.types.get_carter_device_name 4                             ), 'other'
  T?.eq ( WG.types.get_carter_device_name NaN                           ), 'other'
  T?.eq ( WG.types.get_carter_device_name Promise                       ), 'class'
  T?.eq ( WG.types.get_carter_device_name Buffer                        ), 'fn' # surprise!
  T?.eq ( WG.types.get_carter_device_name ( class C )                   ), 'class'
  T?.eq ( WG.types.get_carter_device_name ( class C extends Object )    ), 'class'
  T?.eq ( WG.types.get_carter_device_name ( -> )                        ), 'fn'
  T?.eq ( WG.types.get_carter_device_name ( -> ), '[object Function]'   ), 'fn'
  T?.eq ( WG.types.get_carter_device_name ( -> ), 'Function'            ), 'fn'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_get_type_signature = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  T?.eq ( WG.types.get_type_signature undefined                     ), 'undefined/Undefined/0/other/0'
  T?.eq ( WG.types.get_type_signature null                          ), 'object/Null/0/other/0'
  T?.eq ( WG.types.get_type_signature 4                             ), 'number/Number/Number/other/0'
  T?.eq ( WG.types.get_type_signature NaN                           ), 'number/Number/Number/other/N'
  T?.eq ( WG.types.get_type_signature Promise                       ), 'function/Function/Function/class/0'
  T?.eq ( WG.types.get_type_signature Buffer                        ), 'function/Function/Function/fn/0'
  T?.eq ( WG.types.get_type_signature ( class C )                   ), 'function/Function/Function/class/0'
  T?.eq ( WG.types.get_type_signature ( class C extends Object )    ), 'function/Function/Function/class/0'
  T?.eq ( WG.types.get_type_signature ( -> )                        ), 'function/Function/Function/fn/0'
  T?.eq ( WG.types.get_type_signature ( -> ), '[object Function]'   ), 'function/Function/Function/fn/0'
  T?.eq ( WG.types.get_type_signature ( -> ), 'Function'            ), 'function/Function/Function/fn/0'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_type_of = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  # help '^types_type_of@1  ', ( WG.types.type_of undefined                     ), 'undefined'
  # help '^types_type_of@2  ', ( WG.types.type_of null                          ), 'null'
  # help '^types_type_of@3  ', ( WG.types.type_of 4                             ), 'float'
  # help '^types_type_of@4  ', ( WG.types.type_of 4.5                           ), 'float'
  # help '^types_type_of@5  ', ( WG.types.type_of NaN                           ), 'nan'
  # help '^types_type_of@6  ', ( WG.types.type_of Promise                       ), 'class'
  # help '^types_type_of@7  ', ( WG.types.type_of Buffer                        ), 'buffer'
  # help '^types_type_of@8  ', ( WG.types.type_of ( class C )                   ), 'class'
  # help '^types_type_of@9  ', ( WG.types.type_of ( class C extends Object )    ), 'class'
  # help '^types_type_of@10 ', ( WG.types.type_of ( -> )                        ), 'function'
  # help '^types_type_of@10 ', ( WG.types.type_of new ArrayBuffer()             ), 'ArrayBuffer'
  #.........................................................................................................
  T?.eq ( WG.types.type_of undefined                      ), 'undefined'
  T?.eq ( WG.types.type_of null                           ), 'null'
  T?.eq ( WG.types.type_of 4                              ), 'float'
  T?.eq ( WG.types.type_of 4.5                            ), 'float'
  T?.eq ( WG.types.type_of Infinity                       ), 'infinity'
  T?.eq ( WG.types.type_of NaN                            ), 'nan'
  T?.eq ( WG.types.type_of Promise                        ), 'class'
  T?.eq ( WG.types.type_of Buffer                         ), 'function'
  T?.eq ( WG.types.type_of Buffer.from 'x'                ), 'buffer'
  T?.eq ( WG.types.type_of ( class C )                    ), 'class'
  T?.eq ( WG.types.type_of ( class C extends Object )     ), 'class'
  T?.eq ( WG.types.type_of ( -> )                         ), 'function'
  T?.eq ( WG.types.type_of new ArrayBuffer()              ), 'arraybuffer'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_demo_method_object_construction = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  class Isa
    text: ( x ) -> ( typeof x ) is 'string'
    id:   ( x ) ->
      # debug '^id@1^', @constructor.name
      # debug '^id@2^', @isa.constructor.name
      ( @isa.text x ) and ( x.length > 0 )
  #.........................................................................................................
  proto =
    iam: 'proto'
  #.........................................................................................................
  class Intertype
    constructor: ->
      @isa = Object.create proto
      for type in WG.props.public_keys Isa::
        isa_method    = Isa::[ type ]
        proto[ type ] = isa_method.bind @
      return undefined
  #.........................................................................................................
  types = new Intertype()
  # info '^demo@1^', types.constructor.name
  # info '^demo@2^', types.isa.constructor.name
  #.........................................................................................................
  T?.eq ( proto is Object.getPrototypeOf types.isa  ), true
  T?.eq ( types.isa.iam                             ), 'proto'
  T?.eq ( types.isa.text '4'                        ), true
  T?.eq ( types.isa.text 4                          ), false
  T?.eq ( types.isa.id ''                           ), false
  T?.eq ( types.isa.id '4'                          ), true
  T?.eq ( types.isa.id 4                            ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
show_error_message_and_test = ( T, matcher, fn ) ->
  try fn() catch e then warn GUY.trm.reverse e.message
  T?.throws matcher, fn
  return null

#-----------------------------------------------------------------------------------------------------------
@types_validate_1 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  types           = new WG.types.Intertype()
  #.........................................................................................................
  T?.eq ( types.validate.integer 1234 ), 1234
  T?.eq ( types.validate.jsidentifier 'xxx' ), 'xxx'
  show_error_message_and_test T, /expected a jsidentifier, got a null/, -> types.validate.jsidentifier null
  show_error_message_and_test T, /expected a jsidentifier, got a float/, -> types.validate.jsidentifier 4
  T?.eq ( types.validate.optional_integer 1234 ), 1234
  T?.eq ( types.validate.optional_integer null ), null
  T?.eq ( types.validate.nothing null ), null
  T?.eq ( types.validate.nothing undefined ), undefined
  show_error_message_and_test T, /expected a nothing, got a text/, -> types.validate.nothing 'yay!'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_declare_with_class = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  _               = WG.types
  { Intertype, Isa, } = WG.types
  #.........................................................................................................
  do =>
    class declarations extends Isa
      nonzero_integer: ( x ) ->
        # help '^nonzero_integer@1^', @, x
        # help '^nonzero_integer@1^', @isa
        # help '^nonzero_integer@1^', ( @isa.nonzero x ), ( @isa.integer x )
        ( @isa.nonzero x ) and ( @isa.integer x )
    #.......................................................................................................
    types = new Intertype { declarations, }
    T?.eq ( _.isa.function types.isa.nonzero              ), true
    T?.eq ( _.isa.function types.isa.integer              ), true
    T?.eq ( _.isa.function types.isa.nonzero_integer      ), true
    # types.declare.integer ( x ) -> 'whatever' ### must throw because known type ###
    T?.eq ( types.isa.nonzero_integer           4         ), true
    T?.eq ( types.isa.nonzero_integer           4n        ), false
    T?.eq ( types.isa.optional_nonzero_integer  null      ), true
    T?.eq ( types.isa.optional_nonzero_integer  4         ), true
    T?.eq ( types.isa.optional_nonzero_integer  4n        ), false
    T?.eq ( types.isa.nonzero_integer           0         ), false
    T?.eq ( types.isa.nonzero_integer           null      ), false
    T?.eq ( types.isa.optional_nonzero_integer  0         ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_check_method_names_1 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  _               = WG.types
  { Intertype, Isa, } = WG.types
  #.........................................................................................................
  class declarations extends Isa
    nonzero_integer:  ( x ) -> ( @isa.nonzero x ) and ( @isa.integer x )
    nonzero_cardinal: ( x ) -> ( @isa.nonzero x ) and ( @isa.cardinal x )
  #.........................................................................................................
  { isa, validate, } = new Intertype { declarations, }
  T?.eq ( isa.integer                         ).name,                           'isa_integer'
  T?.eq ( isa.optional_integer                ).name,                  'isa_optional_integer'
  T?.eq ( validate.integer                    ).name,                      'validate_integer'
  T?.eq ( validate.optional_integer           ).name,             'validate_optional_integer'
  T?.eq ( isa.nonzero_integer                 ).name,                   'isa_nonzero_integer'
  T?.eq ( isa.optional_nonzero_integer        ).name,          'isa_optional_nonzero_integer'
  T?.eq ( validate.nonzero_integer            ).name,              'validate_nonzero_integer'
  T?.eq ( validate.optional_nonzero_integer   ).name,     'validate_optional_nonzero_integer'
  T?.eq ( isa.nonzero_cardinal                ).name,                  'isa_nonzero_cardinal'
  T?.eq ( isa.optional_nonzero_cardinal       ).name,         'isa_optional_nonzero_cardinal'
  T?.eq ( validate.nonzero_cardinal           ).name,             'validate_nonzero_cardinal'
  T?.eq ( validate.optional_nonzero_cardinal  ).name,    'validate_optional_nonzero_cardinal'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_check_method_names_2 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  { isa, validate, } = WG.types
  T?.eq ( isa.integer                         ).name,                           'isa_integer'
  T?.eq ( isa.optional_integer                ).name,                  'isa_optional_integer'
  T?.eq ( validate.integer                    ).name,                      'validate_integer'
  T?.eq ( validate.optional_integer           ).name,             'validate_optional_integer'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_declaration_1 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  class declarations extends WG.types.Isa
    foo: ( x ) -> ( @isa.text x ) and ( /oo$/.test x )
  #.........................................................................................................
  types               = new WG.types.Intertype { declarations, }
  { isa, validate, }  = types
  T?.eq ( isa.codepointid 123   ), true
  T?.eq ( isa.codepointid -123  ), false
  T?.eq ( isa.foo -123          ), false
  T?.eq ( isa.foo 'fo'          ), false
  show_error_message_and_test T, /expected a foo, got a text/, -> validate.foo 'fo'
  T?.eq ( isa.foo 'foo'             ), true
  T?.eq ( validate.codepointid 123  ), 123
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then await do =>
  # await test @
  @types_declaration_1()
  test @types_declaration_1
  # @types_check_method_names_2()
  # test @types_check_method_names_2
  # await test @types_validate_1
  # @types_type_of()
  # @types_declare_with_class()
  # await test @types_declare_with_class
  # await test @types_isa_2
  # @types_demo_method_object_construction()
  # test @types_demo_method_object_construction
  # test @types_get_miller_device_name
  # test @types_get_carter_device_name
  # @types_isa_4()
  # test @types_isa_4
