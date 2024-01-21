
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
  T?.eq ( WG.types.isa.chr            undefined ), false
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
  T?.eq ( WG.types.isa.chr            ( 'x'                   ) ), true
  T?.eq ( WG.types.isa.chr            ( '\u{20000}'           ) ), true
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
  # debug '^types_isa_4@1^', ( types.isa.chr            ( 0x20000                   ) )
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
  T?.eq ( WG.types.isa.chr            ( 0x20000                   ) ), false
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
  { isa } = ( require '../../../apps/webguy' ).types
  #.........................................................................................................
  T?.eq ( isa.integer +Infinity ), false
  T?.eq ( isa.integer -Infinity ), false
  T?.eq ( isa.integer 123456n ), false
  T?.eq ( isa.integer 0 / 0 ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_isa_6 = ( T, done ) ->
  { types     } = require '../../../apps/webguy'
  { isa
    optional  } = types
  #.........................................................................................................
  T?.eq ( isa.null          optional ( null               ) ), true
  T?.eq ( isa.null          optional ( undefined          ) ), true
  T?.eq ( isa.null          optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.undefined     optional ( null               ) ), true
  T?.eq ( isa.undefined     optional ( undefined          ) ), true
  T?.eq ( isa.undefined     optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.anything      optional ( null               ) ), true
  T?.eq ( isa.anything      optional ( undefined          ) ), true
  T?.eq ( isa.anything      optional ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( isa.something     optional ( null               ) ), true
  T?.eq ( isa.something     optional ( undefined          ) ), true
  T?.eq ( isa.something     optional ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( isa.nothing       optional ( null               ) ), true
  T?.eq ( isa.nothing       optional ( undefined          ) ), true
  T?.eq ( isa.nothing       optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.text          optional ( null               ) ), true
  T?.eq ( isa.text          optional ( undefined          ) ), true
  T?.eq ( isa.text          optional ( 'x'                ) ), true
  T?.eq ( isa.text          optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.chr           optional ( null               ) ), true
  T?.eq ( isa.chr           optional ( undefined          ) ), true
  T?.eq ( isa.chr           optional ( 'x'                ) ), true
  T?.eq ( isa.chr           optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.codepointid   optional ( null               ) ), true
  T?.eq ( isa.codepointid   optional ( undefined          ) ), true
  T?.eq ( isa.codepointid   optional ( '4'                ) ), false
  T?.eq ( isa.codepointid   optional ( 4                  ) ), true
  #.........................................................................................................
  T?.eq ( isa.regex         optional ( null               ) ), true
  T?.eq ( isa.regex         optional ( undefined          ) ), true
  T?.eq ( isa.regex         optional ( /x/                ) ), true
  T?.eq ( isa.regex         optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.buffer        optional ( null               ) ), true
  T?.eq ( isa.buffer        optional ( undefined          ) ), true
  T?.eq ( isa.buffer        optional ( Buffer.from ''     ) ), true
  T?.eq ( isa.buffer        optional ( 'x'                ) ), false
  #.........................................................................................................
  T?.eq ( isa.jsidentifier  optional ( null               ) ), true
  T?.eq ( isa.jsidentifier  optional ( undefined          ) ), true
  T?.eq ( isa.jsidentifier  optional ( 'xxx'              ) ), true
  T?.eq ( isa.jsidentifier  optional ( ' x '              ) ), false
  T?.eq ( isa.jsidentifier  optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.list          optional ( null               ) ), true
  T?.eq ( isa.list          optional ( undefined          ) ), true
  T?.eq ( isa.list          optional ( []                 ) ), true
  T?.eq ( isa.list          optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.set           optional ( null               ) ), true
  T?.eq ( isa.set           optional ( undefined          ) ), true
  T?.eq ( isa.set           optional ( new Set()          ) ), true
  T?.eq ( isa.set           optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.map           optional ( null               ) ), true
  T?.eq ( isa.map           optional ( undefined          ) ), true
  T?.eq ( isa.map           optional ( new Map()          ) ), true
  T?.eq ( isa.map           optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.numeric       optional ( null               ) ), true
  T?.eq ( isa.numeric       optional ( undefined          ) ), true
  T?.eq ( isa.numeric       optional ( 4                  ) ), true
  T?.eq ( isa.numeric       optional ( 4n                 ) ), true
  T?.eq ( isa.numeric       optional ( {}                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.float         optional ( null               ) ), true
  T?.eq ( isa.float         optional ( undefined          ) ), true
  T?.eq ( isa.float         optional ( 4                  ) ), true
  T?.eq ( isa.float         optional ( 4.5                ) ), true
  T?.eq ( isa.float         optional ( Infinity           ) ), false
  T?.eq ( isa.float         optional ( 4n                 ) ), false
  T?.eq ( isa.float         optional ( true               ) ), false
  #.........................................................................................................
  T?.eq ( isa.bigint        optional ( null               ) ), true
  T?.eq ( isa.bigint        optional ( undefined          ) ), true
  T?.eq ( isa.bigint        optional ( 4n                 ) ), true
  T?.eq ( isa.bigint        optional ( 4                  ) ), false
  T?.eq ( isa.bigint        optional ( Infinity           ) ), false
  #.........................................................................................................
  T?.eq ( isa.integer       optional ( null               ) ), true
  T?.eq ( isa.integer       optional ( undefined          ) ), true
  T?.eq ( isa.integer       optional ( 4                  ) ), true
  T?.eq ( isa.integer       optional ( 4.5                ) ), false
  T?.eq ( isa.integer       optional ( 4n                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.cardinal      optional ( null               ) ), true
  T?.eq ( isa.cardinal      optional ( undefined          ) ), true
  T?.eq ( isa.cardinal      optional ( 0                  ) ), true
  T?.eq ( isa.cardinal      optional ( 1                  ) ), true
  T?.eq ( isa.cardinal      optional ( -1                 ) ), false
  T?.eq ( isa.cardinal      optional ( 1n                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.zero          optional ( null               ) ), true
  T?.eq ( isa.zero          optional ( undefined          ) ), true
  T?.eq ( isa.zero          optional ( 0                  ) ), true
  T?.eq ( isa.zero          optional ( -0                 ) ), true
  T?.eq ( isa.zero          optional ( 0n                 ) ), false
  T?.eq ( isa.zero          optional ( 4                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.nan           optional ( null               ) ), true
  T?.eq ( isa.nan           optional ( undefined          ) ), true
  T?.eq ( isa.nan           optional ( NaN                ) ), true
  T?.eq ( isa.nan           optional ( 0 / 0              ) ), true
  #.........................................................................................................
  T?.eq ( isa.even          optional ( null               ) ), true
  T?.eq ( isa.even          optional ( undefined          ) ), true
  T?.eq ( isa.even          optional ( 4                  ) ), true
  T?.eq ( isa.even          optional ( 4n                 ) ), false
  T?.eq ( isa.even          optional ( 4.5                ) ), false
  T?.eq ( isa.even          optional ( 5                  ) ), false
  T?.eq ( isa.even          optional ( 5n                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.odd           optional ( null               ) ), true
  T?.eq ( isa.odd           optional ( undefined          ) ), true
  T?.eq ( isa.odd           optional ( 5                  ) ), true
  T?.eq ( isa.odd           optional ( 5n                 ) ), false
  T?.eq ( isa.odd           optional ( 5.5                ) ), false
  T?.eq ( isa.odd           optional ( 4                  ) ), false
  T?.eq ( isa.odd           optional ( 4n                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.boolean       optional ( null               ) ), true
  T?.eq ( isa.boolean       optional ( undefined          ) ), true
  T?.eq ( isa.boolean       optional ( true               ) ), true
  T?.eq ( isa.boolean       optional ( false              ) ), true
  T?.eq ( isa.boolean       optional ( 1                  ) ), false
  T?.eq ( isa.boolean       optional ( 0                  ) ), false
  #.........................................................................................................
  T?.eq ( isa.object        optional ( null               ) ), true
  T?.eq ( isa.object        optional ( undefined          ) ), true
  T?.eq ( isa.object        optional ( {}                 ) ), true
  T?.eq ( isa.object        optional ( []                 ) ), false
  #.........................................................................................................
  T?.eq ( isa.function      optional ( null               ) ), true
  T?.eq ( isa.function      optional ( undefined          ) ), true
  T?.eq ( isa.asyncfunction optional ( null               ) ), true
  T?.eq ( isa.asyncfunction optional ( undefined          ) ), true
  T?.eq ( isa.symbol        optional ( null               ) ), true
  T?.eq ( isa.symbol        optional ( undefined          ) ), true
  T?.eq ( isa.class         optional ( null               ) ), true
  T?.eq ( isa.class         optional ( undefined          ) ), true
  T?.eq ( isa.class         optional ( Promise            ) ), true
  T?.eq ( isa.class         optional ( class C            ) ), true
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
  help '^types_type_of@1  ', ( WG.types.type_of undefined                     ), 'undefined'
  help '^types_type_of@2  ', ( WG.types.type_of null                          ), 'null'
  help '^types_type_of@3  ', ( WG.types.type_of 4                             ), 'float'
  help '^types_type_of@4  ', ( WG.types.type_of 4.5                           ), 'float'
  help '^types_type_of@5  ', ( WG.types.type_of NaN                           ), 'nan'
  help '^types_type_of@6  ', ( WG.types.type_of Promise                       ), 'class'
  help '^types_type_of@7  ', ( WG.types.type_of Buffer                        ), 'buffer'
  help '^types_type_of@8  ', ( WG.types.type_of ( class C )                   ), 'class'
  help '^types_type_of@9  ', ( WG.types.type_of ( class C extends Object )    ), 'class'
  help '^types_type_of@10 ', ( WG.types.type_of ( -> )                        ), 'function'
  help '^types_type_of@10 ', ( WG.types.type_of new ArrayBuffer()             ), 'ArrayBuffer'
  help '^types_type_of@10 ', ( WG.types.type_of new Uint8ClampedArray 2       ), 'uint8clampedarray'
  help '^types_type_of@10 ', ( WG.types.type_of new Date                      ), 'date'
  #.........................................................................................................
  T?.eq ( WG.types.type_of undefined                                          ), 'undefined'
  T?.eq ( WG.types.type_of null                                               ), 'null'
  T?.eq ( WG.types.type_of 4                                                  ), 'float'
  T?.eq ( WG.types.type_of 4.5                                                ), 'float'
  T?.eq ( WG.types.type_of Infinity                                           ), 'infinity'
  T?.eq ( WG.types.type_of NaN                                                ), 'nan'
  T?.eq ( WG.types.type_of Promise                                            ), 'class'
  T?.eq ( WG.types.type_of Buffer                                             ), 'function'
  T?.eq ( WG.types.type_of Buffer.from 'x'                                    ), 'buffer'
  T?.eq ( WG.types.type_of ( class C )                                        ), 'class'
  T?.eq ( WG.types.type_of ( class C extends Object )                         ), 'class'
  T?.eq ( WG.types.type_of ( -> )                                             ), 'function'
  T?.eq ( WG.types.type_of new ArrayBuffer()                                  ), 'arraybuffer'
  T?.eq ( WG.types.type_of new Uint8ClampedArray 2                            ), 'uint8clampedarray'
  T?.eq ( WG.types.type_of new Date                                           ), 'date'
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
  { validate
    optional    } = types
  #.........................................................................................................
  T?.eq ( validate.integer 1234 ), 1234
  T?.eq ( validate.jsidentifier 'xxx' ), 'xxx'
  show_error_message_and_test T, /expected a jsidentifier, got a null/, -> validate.jsidentifier null
  show_error_message_and_test T, /expected a jsidentifier, got a float/, -> validate.jsidentifier 4
  T?.eq ( validate.integer optional 1234 ), 1234
  T?.eq ( validate.integer optional null ), null
  T?.eq ( validate.nothing null ), null
  T?.eq ( validate.nothing undefined ), undefined
  show_error_message_and_test T, /expected a nothing, got a text/, -> validate.nothing 'yay!'
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
    types         = new Intertype { declarations, }
    { isa
      optional  } = types
    T?.eq ( _.isa.function types.isa.nonzero              ), true
    T?.eq ( _.isa.function types.isa.integer              ), true
    T?.eq ( _.isa.function types.isa.nonzero_integer      ), true
    # types.declare.integer ( x ) -> 'whatever' ### must throw because known type ###
    T?.eq ( isa.nonzero_integer           4         ), true
    T?.eq ( isa.nonzero_integer           4n        ), false
    T?.eq ( isa.nonzero_integer optional  null      ), true
    T?.eq ( isa.nonzero_integer optional  4         ), true
    T?.eq ( isa.nonzero_integer optional  4n        ), false
    T?.eq ( isa.nonzero_integer           0         ), false
    T?.eq ( isa.nonzero_integer           null      ), false
    T?.eq ( isa.nonzero_integer optional  0         ), false
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
  T?.eq ( validate.integer                    ).name,                      'validate_integer'
  T?.eq ( isa.nonzero_integer                 ).name,                   'isa_nonzero_integer'
  T?.eq ( validate.nonzero_integer            ).name,              'validate_nonzero_integer'
  T?.eq ( isa.nonzero_cardinal                ).name,                  'isa_nonzero_cardinal'
  T?.eq ( validate.nonzero_cardinal           ).name,             'validate_nonzero_cardinal'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_check_method_names_2 = ( T, done ) ->
  WG              = require '../../../apps/webguy'
  #.........................................................................................................
  { isa, validate, } = WG.types
  T?.eq ( isa.integer                         ).name,                           'isa_integer'
  T?.eq ( validate.integer                    ).name,                      'validate_integer'
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

#-----------------------------------------------------------------------------------------------------------
@types_assert_standard_types_exist = ( T, done ) ->
  # pending:
  #   'callable'
    # 'negative'
    # 'negative_float'
    # 'negative_integer'
    # 'nonnegative'
    # 'nonpositive'
    # 'positive'
    # 'positive_float'
    # 'positive_integer'
  intertype_main_types = [
    # 'arguments'
    'arraybuffer'
    'asyncfunction'
    'asyncgenerator'
    'asyncgeneratorfunction'
    'blank_text'
    'boolean'
    'buffer'
    'cardinal'
    'chr'
    'date'
    # 'empty'
    'empty_list'
    'empty_map'
    'empty_object'
    'empty_set'
    'empty_text'
    'error'
    'even'
    'extensible'
    'false'
    'falsy'
    # 'finite'
    'float'
    'safeinteger'
    'float32array'
    'float64array'
    'frozen'
    # 'fs_stats'
    'function'
    'generator'
    'generatorfunction'
    'global'
    # 'happy'
    # 'immediate'
    'infinity'
    'infinitefloat'
    'int10text'
    'int16array'
    'int16text'
    'int2text'
    'int32'
    'int32array'
    'int8array'
    'integer'
    'jsidentifier'
    'list'
    # 'list_of'
    'listiterator'
    'map'
    'mapiterator'
    'nan'
    'nativepromise'
    'nonblank_text'
    # 'nonempty'
    'nonempty_list'
    'nonempty_map'
    'nonempty_object'
    'nonempty_set'
    'nonempty_text'
    'null'
    'float' # 'number'
    'numeric'
    'object'
    # 'object_of'
    'odd'
    # 'plural'
    'promise'
    'proper_fraction'
    'regex'
    # # 'sad'
    # # 'saddened'
    'safeinteger'
    'sealed'
    'set'
    'setiterator'
    # 'singular'
    'symbol'
    'text'
    'textiterator'
    'thenable'
    'true'
    'truthy'
    'uint16array'
    'uint32array'
    'uint8array'
    'uint8clampedarray'
    'undefined'
    # 'unset'
    # 'vnr'
    'weakmap'
    'weakset'
    'zero' ]
  #.........................................................................................................
  for type in intertype_main_types
    unless isa.$known_type_name type
      message = "unknown type #{type}"
      T?.fail message
      warn "^types_assert_standard_types_exist@1^", rpr type
    else
      T?.ok true
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_optional = ( T, done ) ->
  { types         } = require '../../../apps/webguy'
  { isa
    type_of
    validate
    optional
    Optional  } = types
  #.........................................................................................................
  unless T?
    help '^types_optional@1^', ( optional null                    ), 'Optional { value: null, }'
    help '^types_optional@2^', ( optional undefined               ), 'Optional { value: undefined, }'
    help '^types_optional@3^', ( optional 1000                    ), 'Optional { value: 1000, }'
    help '^types_optional@4^', ( isa.integer optional 1000        ), true
    help '^types_optional@5^', ( isa.text    optional 1000        ), false
    help '^types_optional@6^', ( isa.integer optional null        ), true
    help '^types_optional@7^', ( isa.text    optional null        ), true
    help '^types_optional@8^', ( isa.text    optional undefined  ), true
    #.........................................................................................................
    # validate.text null
    try validate.text optional 22 catch e then warn GUY.trm.reverse e.message
    help '^types_optional@9^', ( validate.text optional null ), null
  #.........................................................................................................
  T?.eq ( optional null                   ), { value: null, }
  T?.eq ( optional undefined              ), { value: undefined, }
  T?.eq ( optional 1000                   ), new Optional 1000
  T?.eq ( optional 1000                   ), { value: 1000, }
  T?.eq ( isa.integer optional 1000       ), true
  T?.eq ( isa.text    optional 1000       ), false
  T?.eq ( isa.integer optional null       ), true
  T?.eq ( isa.text    optional null       ), true
  T?.eq ( isa.text    optional undefined  ), true
  #.........................................................................................................
  # validate.text null
  T?.throws /expected a text/, -> validate.text 22
  T?.throws /expected a text/, -> validate.text optional 22
  T?.eq ( validate.text optional null ), null
  T?.eq ( validate.text optional undefined ), undefined
  T?.eq ( validate.text optional 'abc' ), 'abc'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_all_and_any_of = ( T, done ) ->
  { types         } = require '../../../apps/webguy'
  { isa
    type_of
    validate
    all_of
    any_of
    optional
    Iterator      } = types
  #.........................................................................................................
  unless T?
    help '^types_all_and_any_of@1^', ( isa.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), true
    help '^types_all_and_any_of@2^', ( isa.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), false
    help '^types_all_and_any_of@3^', ( isa.integer any_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), true
    help '^types_all_and_any_of@4^', ( isa.integer any_of [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), true
    help '^types_all_and_any_of@5^', ( isa.integer all_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] ), false
    help '^types_all_and_any_of@6^', ( isa.integer any_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] ), false
    #.......................................................................................................
    help '^types_all_and_any_of@7^', ( validate.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ]
    help '^types_all_and_any_of@8^', ( validate.integer any_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ]
    help '^types_all_and_any_of@9^', ( validate.integer any_of [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ]
    #.......................................................................................................
    help '^types_all_and_any_of@10^', ( isa.integer all_of []            ), "`true` (following JS `[].every ( e ) -> ...`)"
    help '^types_all_and_any_of@11^', ( isa.integer any_of []            ), "`false` (following JS `[].some ( e ) -> ...`)"
    help '^types_all_and_any_of@12^', ( isa.integer all_of 12            ), "(N.A., therefore) `true`"
    help '^types_all_and_any_of@13^', ( isa.integer any_of 12            ), "(N.A., therefore) `false`"
    help '^types_all_and_any_of@14^', ( isa.integer all_of optional []   ), "`true` (same as above w/o `optional`)"
    help '^types_all_and_any_of@15^', ( isa.integer any_of optional []   ), "`false` (same as above w/o `optional`)"
    help '^types_all_and_any_of@16^', ( isa.integer all_of optional 12   ), "`true` (same as above w/o `optional`)"
    help '^types_all_and_any_of@17^', ( isa.integer any_of optional 12   ), "`false` (same as above w/o `optional`)"
    help '^types_all_and_any_of@18^', ( isa.integer all_of optional null ), "`true` (all of zero elements `e` do satisfy `isa.integer e`)"
    help '^types_all_and_any_of@19^', ( isa.integer any_of optional null ), "`false` (there's no element, not any, so `false`)"
    help '^types_all_and_any_of@20^', ( isa.integer all_of optional null ), "`true`"
    help '^types_all_and_any_of@21^', ( isa.integer any_of optional null ), "`false`"
    #.......................................................................................................
    try validate.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.3, 1.0, ] catch e then warn '^types_all_and_any_of@22^', ( GUY.trm.reverse e.message ), 'expected a integer, got a float'
    try validate.integer all_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] catch e then warn '^types_all_and_any_of@23^', ( GUY.trm.reverse e.message ), 'expected a integer, got a float'
    try validate.integer any_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] catch e then warn '^types_all_and_any_of@24^', ( GUY.trm.reverse e.message ), 'expected a integer, got a float'
    null
  #.........................................................................................................
  T?.eq ( isa.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), true
  T?.eq ( isa.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), false
  T?.eq ( isa.integer any_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), true
  T?.eq ( isa.integer any_of [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), true
  T?.eq ( isa.integer all_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] ), false
  T?.eq ( isa.integer any_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ] ), false
  #.........................................................................................................
  T?.eq ( validate.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ]
  T?.eq ( validate.integer any_of [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ] ), [ 6.0, 5.0, 4.0, 3.0, 2.0, 1.0, ]
  T?.eq ( validate.integer any_of [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ] ), [ 6.1, 5.0, 4.0, 3.0, 2.3, 1.0, ]
  T?.throws /expected a integer, got a float/, -> validate.integer all_of [ 6.0, 5.0, 4.0, 3.0, 2.3, 1.0, ]
  T?.throws /expected a integer, got a float/, -> validate.integer all_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ]
  T?.throws /expected a integer, got a float/, -> validate.integer any_of [ 6.1, 5.2, 4.3, 3.4, 2.5, 1.6, ]
  #.........................................................................................................
  T?.eq ( isa.integer all_of []            ), true
  T?.eq ( isa.integer any_of []            ), false
  T?.eq ( isa.integer all_of 12            ), true
  T?.eq ( isa.integer any_of 12            ), false
  T?.eq ( isa.integer all_of optional []   ), true
  T?.eq ( isa.integer any_of optional []   ), false
  #.........................................................................................................
  T?.eq ( isa.integer all_of optional 12   ), true
  T?.eq ( isa.integer any_of optional 12   ), false
  T?.eq ( isa.integer all_of optional null ), true
  T?.eq ( isa.integer any_of optional null ), false
  T?.eq ( isa.integer all_of optional null ), true
  T?.eq ( isa.integer any_of optional null ), false
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@types_verify = ( T, done ) ->
  { types         } = require '../../../apps/webguy'
  { isa
    type_of
    validate
    all_of
    any_of
    verify
    Optional
    Failure
    All_of
    Any_of
    optional
    Iterator      } = types
  #.........................................................................................................
  unless T?
    help '^types_verify@1^', ( optional null                                     ), 'Optional { value: null, }'
    help '^types_verify@2^', ( ( optional null ) instanceof Optional             ), true
    help '^types_verify@3^', ( verify.list []                                    ), []
    help '^types_verify@4^', ( verify.list null                                  ), 'Failure { value: null, }'
    help '^types_verify@5^', ( ( verify.list null ) instanceof Failure           ), true
    help '^types_verify@6^', ( verify.list optional null                         ), 'Optional { value: null, }'
    help '^types_verify@7^', ( ( verify.list optional null ) instanceof Optional ), true
    help '^types_verify@8^', ( isa.integer all_of verify.list []                 ), true
    help '^types_verify@9^', ( isa.integer all_of verify.list [ 1, 2, ]          ), true
    help '^types_verify@10^', ( isa.integer all_of verify.list [ 1, 2.4, ]        ), false
    help '^types_verify@11^', ( isa.integer all_of verify.list null               ), false
    help '^types_verify@12^', ( all_of optional null                              ), new All_of new Optional null
    help '^types_verify@13^', ( ( all_of optional null ).value                    ), new Optional null
    help '^types_verify@14^', ( ( all_of optional null ).get()                    ), null
    help '^types_verify@15^', ( isa.integer all_of verify.list optional null      ), true
    help '^types_verify@16^', ( isa.integer all_of 'abc'                          ), false
    help '^types_verify@17^', ( isa.integer any_of 'abc'                          ), false
    help '^types_verify@16^', ( isa.integer all_of 3                              ), true
    help '^types_verify@17^', ( isa.integer any_of 3                              ), false
    help '^types_verify@16^', ( isa.integer all_of null                           ), true
    help '^types_verify@17^', ( isa.integer any_of null                           ), false
    null
  #.........................................................................................................
  T?.eq ( optional null                                     ), new Optional null
  T?.eq ( ( optional null ) instanceof Optional             ), true
  T?.eq ( verify.list []                                    ), []
  T?.eq ( verify.list null                                  ), new Failure null
  T?.eq ( ( verify.list null ) instanceof Failure           ), true
  T?.eq ( verify.list optional null                         ), new Optional null
  T?.eq ( ( verify.list optional null ) instanceof Optional ), true
  T?.eq ( isa.integer all_of verify.list []                 ), true
  T?.eq ( isa.integer all_of verify.list [ 1, 2, ]          ), true
  T?.eq ( isa.integer all_of verify.list [ 1, 2.4, ]        ), false
  T?.eq ( isa.integer all_of verify.list null               ), false
  ##########################################################################################################
  ### Taint move these checks to test for mediaries ###
  T?.ok ( ( all_of optional null ) instanceof All_of )
  T?.eq ( ( all_of optional null ).value                    ), new Optional null
  T?.eq ( ( all_of optional null ).get()                    ), null
  T?.eq ( isa.integer all_of 'abc'                          ), false
  T?.eq ( isa.integer any_of 'abc'                          ), false
  T?.eq ( isa.integer all_of 3                              ), true
  T?.eq ( isa.integer any_of 3                              ), false
  T?.eq ( isa.integer all_of null                           ), true
  T?.eq ( isa.integer any_of null                           ), false
  ##########################################################################################################
  T?.eq ( isa.integer all_of verify.list optional null      ), true
  T?.eq ( isa.integer any_of verify.list optional null      ), false
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then await do =>
  test @
  @types_all_and_any_of()
  test @types_all_and_any_of
  # await GUY.async.after 1, => test @types_optional
  # await GUY.async.after 1, =>
  # await test @

  # f = ->
  #   do ->
  #     debug '^534-1^', Object, new Object()
  #     debug '^534-2^', ({}).constructor, new ({}).constructor()
  #     debug '^534-3^', ( Object::toString.call Object ), ( Object::toString.call new Object() )
  #     debug '^534-4^', ( {} instanceof Object )
  #   do ->
  #     class Object
  #     debug '^534-5^', Object, new Object()
  #     debug '^534-6^', ({}).constructor, new ({}).constructor()
  #     debug '^534-7^', ( Object::toString.call Object ), ( Object::toString.call new Object() )
  #     debug '^534-8^', ( {} instanceof Object )
  #   do ->
  #     debug '^534-6^'
  #     debug '^534-6^', ( {}     ).constructor is Object
  #     debug '^534-6^', ( 3      ).constructor is Number
  #     debug '^534-6^', ( true   ).constructor is Boolean
  #     debug '^534-6^', ( []     ).constructor is Array
  #     debug '^534-6^', ( 3n     ).constructor is BigInt
  # for a in [ 0 .. 12 ]
  #   switch true
  #     when a is 1       then  debug '^989-1^', a, 'single'
  #     when a is 2       then  debug '^989-2^', a, 'double'
  #     when 3 < a < 10   then  debug '^989-3^', a, 'many'
  #     else                    debug '^989-4^', a, 'lots'
  # return null



