

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
GTNG                      = require '../../../apps/guy-test-NG'
TMP_types                 = new ( require 'intertype' ).Intertype()
{ Test
  test
  async_test
  eq
  throws }               = GTNG
# test_mode                 = 'throw_failures'
# test_mode                 = 'throw_errors'
# test_mode                 = 'failsafe'




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
#     eq ( Ω_intertype___1 = -> isa.float       null  ), false
#     eq ( Ω_intertype___2 = -> isa.float       true  ), false
#     eq ( Ω_intertype___3 = -> isa.float       0     ), true
#     eq ( Ω_intertype___4 = -> isa.maybefloat1 null  ), true
#     eq ( Ω_intertype___5 = -> isa.maybefloat1 true  ), false
#     eq ( Ω_intertype___6 = -> isa.maybefloat1 0     ), true
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
#     eq ( Ω_intertype___7 = -> isa.q             null                    ), false
#     eq ( Ω_intertype___8 = -> isa.q             {}                      ), true
#     eq ( Ω_intertype___9 = -> isa.q             { maybefloat2: null }   ), true
#     eq ( Ω_intertype__10 = -> isa.q             { maybefloat2: false }  ), false
#     eq ( Ω_intertype__11 = -> isa.q             { maybefloat2: 3 }      ), true
#     eq ( Ω_intertype__12 = -> isa.q.maybefloat2  null                   ), true
#     eq ( Ω_intertype__13 = -> isa.q.maybefloat2  true                   ), false
#     eq ( Ω_intertype__14 = -> isa.q.maybefloat2  0                      ), true
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
#     safeguard T, => eq ( Ω_intertype__15 = -> isa.q             null                    ), true
#     safeguard T, => eq ( Ω_intertype__16 = -> isa.q             {}                      ), true
#     safeguard T, => eq ( Ω_intertype__17 = -> isa.q             { maybefloat3: null }   ), true
#     safeguard T, => eq ( Ω_intertype__18 = -> isa.q             { maybefloat3: false }  ), false
#     safeguard T, => eq ( Ω_intertype__19 = -> isa.q             { maybefloat3: 3 }      ), true
#     safeguard T, => eq ( Ω_intertype__20 = -> isa.q.maybefloat3  null                   ), true
#     safeguard T, => eq ( Ω_intertype__21 = -> isa.q.maybefloat3  true                   ), false
#     safeguard T, => eq ( Ω_intertype__22 = -> isa.q.maybefloat3  0                      ), true
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
#     eq ( Ω_intertype__23 = -> isa.person        null                                                            ), false
#     eq ( Ω_intertype__24 = -> isa.person        {}                                                              ), false
#     eq ( Ω_intertype__25 = -> isa.person        { name: 'Fred',                                               } ), false
#     eq ( Ω_intertype__26 = -> isa.person        { name: 'Fred', address: {},                                  } ), false
#     eq ( Ω_intertype__27 = -> isa.person        { name: 'Fred', address: { city: 'Town', },                   } ), false
#     eq ( Ω_intertype__28 = -> isa.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true # ???????????????????????
#     debug '^12434^', validate.person        { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  }
#     eq ( Ω_intertype__29 = -> isa.maybesomeone  null                                                            ), true
#     # eq ( Ω_intertype__30 = -> isa.maybesomeone  {}                                                              ), false
#     # eq ( Ω_intertype__31 = -> isa.maybesomeone  { name: 'Fred',                                               } ), false
#     # eq ( Ω_intertype__32 = -> isa.maybesomeone  { name: 'Fred', address: {},                                  } ), false
#     # eq ( Ω_intertype__33 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', },                   } ), false
#     # eq ( Ω_intertype__34 = -> isa.maybesomeone  { name: 'Fred', address: { city: 'Town', postcode: 'W23', },  } ), true
#     # #.......................................................................................................
#     return null
#   #.........................................................................................................
#   return null


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
  #.........................................................................................................
  return null


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
  object:                 ( x ) -> x? and ( typeof x is 'object' ) and ( ( Object::toString.call x ) is '[object Object]' )
  set:                    ( x ) -> x instanceof Set
  list:                   ( x ) -> Array.isArray x



############################################################################################################
#
#===========================================================================================================
tasks =

  #-----------------------------------------------------------------------------------------------------------
  interface: ->
    INTERTYPE     = require '../../../apps/intertype'
    eq ( Ω_intertype__35 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
    eq ( Ω_intertype__36 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa                       ), true
    eq ( Ω_intertype__37 = -> TMP_types.isa.undefined INTERTYPE.types.get_isa_optional              ), true
    eq ( Ω_intertype__38 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate                  ), true
    eq ( Ω_intertype__39 = -> TMP_types.isa.undefined INTERTYPE.types.get_validate_optional         ), true
    eq ( Ω_intertype__40 = -> TMP_types.isa.function  INTERTYPE.types._get_isa                      ), true
    eq ( Ω_intertype__41 = -> TMP_types.isa.function  INTERTYPE.types._get_isa_optional             ), true
    eq ( Ω_intertype__42 = -> TMP_types.isa.function  INTERTYPE.types._get_validate                 ), true
    eq ( Ω_intertype__43 = -> TMP_types.isa.function  INTERTYPE.types._get_validate_optional        ), true
    eq ( Ω_intertype__44 = -> TMP_types.isa.object    INTERTYPE.types                               ), true
    eq ( Ω_intertype__45 = -> TMP_types.isa.object    INTERTYPE.types.isa                           ), true
    # eq ( Ω_intertype__46 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional                  ), true
    eq ( Ω_intertype__47 = -> TMP_types.isa.object    INTERTYPE.types.validate                      ), true
    # eq ( Ω_intertype__48 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional             ), true
    eq ( Ω_intertype__49 = -> TMP_types.isa.function  INTERTYPE.types.isa.boolean                   ), true
    eq ( Ω_intertype__50 = -> TMP_types.isa.function  INTERTYPE.types.isa.optional.boolean          ), true
    eq ( Ω_intertype__51 = -> TMP_types.isa.function  INTERTYPE.types.validate.boolean              ), true
    eq ( Ω_intertype__52 = -> TMP_types.isa.function  INTERTYPE.types.validate.optional.boolean     ), true
    eq ( Ω_intertype__53 = -> TMP_types.isa.object    INTERTYPE.types.create                        ), true
    eq ( Ω_intertype__54 = -> TMP_types.isa.function  INTERTYPE.types.isa.text                      ), true
    eq ( Ω_intertype__55 = -> TMP_types.isa.function  INTERTYPE.types.create.text                   ), true
    eq ( Ω_intertype__56 = -> TMP_types.isa.object    INTERTYPE.types.declarations                  ), true
    eq ( Ω_intertype__57 = -> TMP_types.isa.object    INTERTYPE.types.declarations.text             ), true
    #.........................................................................................................
    # eq ( Ω_intertype__58 = -> INTERTYPE.types.isa.name           ), 'isa'
    # eq ( Ω_intertype__59 = -> INTERTYPE.types.evaluate.name      ), 'evaluate'
    # eq ( Ω_intertype__60 = -> INTERTYPE.types.validate.name      ), 'validate'
    # eq ( Ω_intertype__61 = -> INTERTYPE.types.create.name        ), 'create'
    eq ( Ω_intertype__62 = -> INTERTYPE.types.declare.name       ), 'declare'
    eq ( Ω_intertype__63 = -> INTERTYPE.types.type_of.name       ), 'type_of'
    #.........................................................................................................
    do =>
      for type of INTERTYPE.testing._isa
        continue if Reflect.has INTERTYPE.declarations, type
        eq ( Ω_intertype__64 = -> false ), "type missing from default_declarations: #{rpr type}"
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  basic_functionality_using_types_object: ->
    INTERTYPE     = require '../../../apps/intertype'
    types         = new INTERTYPE.Intertype_minimal sample_declarations
    eq ( Ω_intertype__65 = -> types.isa.boolean           false               ), true
    eq ( Ω_intertype__66 = -> types.isa.boolean           true                ), true
    eq ( Ω_intertype__67 = -> types.isa.boolean           null                ), false
    eq ( Ω_intertype__68 = -> types.isa.boolean           1                   ), false
    eq ( Ω_intertype__69 = -> types.isa.optional.boolean  false               ), true
    eq ( Ω_intertype__70 = -> types.isa.optional.boolean  true                ), true
    eq ( Ω_intertype__71 = -> types.isa.optional.boolean  null                ), true
    eq ( Ω_intertype__72 = -> types.isa.optional.boolean  1                   ), false
    #.........................................................................................................
    eq ( Ω_intertype__73 = -> types.validate.boolean               false      ), false
    eq ( Ω_intertype__74 = -> types.validate.boolean               true       ), true
    eq ( Ω_intertype__75 = -> types.validate.optional.boolean      true       ), true
    eq ( Ω_intertype__76 = -> types.validate.optional.boolean      false      ), false
    eq ( Ω_intertype__77 = -> types.validate.optional.boolean      undefined  ), undefined
    eq ( Ω_intertype__78 = -> types.validate.optional.boolean      null       ), null
    throws ( Ω_intertype__79 = -> types.validate.boolean           1 ), /expected a boolean/
    throws ( Ω_intertype__80 = -> types.validate.optional.boolean  1 ), /expected an optional boolean/
    #.........................................................................................................
    eq ( Ω_intertype__81 = -> types.type_of null            ), 'null'
    eq ( Ω_intertype__82 = -> types.type_of undefined       ), 'undefined'
    eq ( Ω_intertype__83 = -> types.type_of false           ), 'boolean'
    eq ( Ω_intertype__84 = -> types.type_of Symbol 'p'      ), 'symbol'
    eq ( Ω_intertype__85 = -> types.type_of {}              ), 'object'
    eq ( Ω_intertype__86 = -> types.type_of NaN             ), 'unknown'
    eq ( Ω_intertype__87 = -> types.type_of +Infinity       ), 'unknown'
    eq ( Ω_intertype__88 = -> types.type_of -Infinity       ), 'unknown'
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
    eq ( Ω_intertype__89 = -> types.isa.asyncfunction.name               ), 'isa.asyncfunction'
    eq ( Ω_intertype__90 = -> types.isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
    eq ( Ω_intertype__91 = -> types.validate.asyncfunction.name          ), 'validate.asyncfunction'
    eq ( Ω_intertype__92 = -> types.validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
    eq ( Ω_intertype__93 = -> types.declarations.null?.type              ), 'null'
    eq ( Ω_intertype__94 = -> types.declarations.function?.type          ), 'function'
    eq ( Ω_intertype__95 = -> types.declarations.boolean?.type           ), 'boolean'
    eq ( Ω_intertype__96 = -> types.declarations.text?.type              ), 'text'
    eq ( Ω_intertype__97 = -> types.declarations.asyncfunction?.type     ), 'asyncfunction'
    eq ( Ω_intertype__98 = -> types.isa.null?.name                       ), 'isa.null'
    eq ( Ω_intertype__99 = -> types.isa.function?.name                   ), 'isa.function'
    eq ( Ω_intertype_100 = -> types.isa.boolean?.name                    ), 'isa.boolean'
    eq ( Ω_intertype_101 = -> types.isa.text?.name                       ), 'isa.text'
    eq ( Ω_intertype_102 = -> types.isa.asyncfunction?.name              ), 'isa.asyncfunction'
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  basic_functionality_using_standalone_methods: ->
    INTERTYPE     = require '../../../apps/intertype'
    { isa
      validate
      type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
    eq ( Ω_intertype_103 = -> isa.boolean           false               ), true
    eq ( Ω_intertype_104 = -> isa.boolean           true                ), true
    eq ( Ω_intertype_105 = -> isa.boolean           null                ), false
    eq ( Ω_intertype_106 = -> isa.boolean           1                   ), false
    eq ( Ω_intertype_107 = -> isa.unknown           1                   ), false
    eq ( Ω_intertype_108 = -> isa.unknown           Infinity            ), true
    eq ( Ω_intertype_109 = -> isa.optional.boolean  false               ), true
    eq ( Ω_intertype_110 = -> isa.optional.boolean  true                ), true
    eq ( Ω_intertype_111 = -> isa.optional.boolean  null                ), true
    eq ( Ω_intertype_112 = -> isa.optional.boolean  1                   ), false
    eq ( Ω_intertype_113 = -> isa.optional.unknown  1                   ), false
    eq ( Ω_intertype_114 = -> isa.optional.unknown  Infinity            ), true
    eq ( Ω_intertype_115 = -> isa.optional.unknown  undefined           ), true
    eq ( Ω_intertype_116 = -> isa.optional.unknown  undefined           ), true
    #.........................................................................................................
    eq ( Ω_intertype_117 = -> validate.boolean               false      ), false
    eq ( Ω_intertype_118 = -> validate.boolean               true       ), true
    eq ( Ω_intertype_119 = -> validate.optional.boolean      true       ), true
    eq ( Ω_intertype_120 = -> validate.optional.boolean      false      ), false
    eq ( Ω_intertype_121 = -> validate.optional.boolean      undefined  ), undefined
    eq ( Ω_intertype_122 = -> validate.optional.boolean      null       ), null
    throws ( Ω_intertype_123 = -> validate.boolean           1  ), /expected a boolean/
    throws ( Ω_intertype_124 = -> validate.optional.boolean  1  ), /expected an optional boolean/
    #.........................................................................................................
    eq ( Ω_intertype_125 = -> type_of null            ), 'null'
    eq ( Ω_intertype_126 = -> type_of undefined       ), 'undefined'
    eq ( Ω_intertype_127 = -> type_of false           ), 'boolean'
    eq ( Ω_intertype_128 = -> type_of Symbol 'p'      ), 'symbol'
    eq ( Ω_intertype_129 = -> type_of {}              ), 'object'
    eq ( Ω_intertype_130 = -> type_of NaN             ), 'unknown'
    eq ( Ω_intertype_131 = -> type_of +Infinity       ), 'unknown'
    eq ( Ω_intertype_132 = -> type_of -Infinity       ), 'unknown'
    #.........................................................................................................
    eq ( Ω_intertype_133 = -> isa.asyncfunction.name               ), 'isa.asyncfunction'
    eq ( Ω_intertype_134 = -> isa.optional.asyncfunction.name      ), 'isa.optional.asyncfunction'
    eq ( Ω_intertype_135 = -> validate.asyncfunction.name          ), 'validate.asyncfunction'
    eq ( Ω_intertype_136 = -> validate.optional.asyncfunction.name ), 'validate.optional.asyncfunction'
    #.........................................................................................................
    throws ( Ω_intertype_137 = -> isa.float 3, 4 ), /method 'isa.float' expects 1 arguments, got 2/
    throws ( Ω_intertype_138 = -> isa.float()    ), /method 'isa.float' expects 1 arguments, got 0/
    return null

  #-----------------------------------------------------------------------------------------------------------
  methods_check_arity: ->
    INTERTYPE     = require '../../../apps/intertype'
    { isa
      validate
      type_of   } = new INTERTYPE.Intertype_minimal sample_declarations
    #.........................................................................................................
    throws ( Ω_intertype_139 = -> isa.float 3, 4               ), /method 'isa.float' expects 1 arguments, got 2/
    throws ( Ω_intertype_140 = -> isa.float()                  ), /method 'isa.float' expects 1 arguments, got 0/
    throws ( Ω_intertype_141 = -> isa.optional.float 3, 4      ), /method 'isa.optional.float' expects 1 arguments, got 2/
    throws ( Ω_intertype_142 = -> isa.optional.float()         ), /method 'isa.optional.float' expects 1 arguments, got 0/
    throws ( Ω_intertype_143 = -> validate.float 3, 4          ), /method 'validate.float' expects 1 arguments, got 2/
    throws ( Ω_intertype_144 = -> validate.float()             ), /method 'validate.float' expects 1 arguments, got 0/
    throws ( Ω_intertype_145 = -> validate.optional.float 3, 4 ), /method 'validate.optional.float' expects 1 arguments, got 2/
    throws ( Ω_intertype_146 = -> validate.optional.float()    ), /method 'validate.optional.float' expects 1 arguments, got 0/
    throws ( Ω_intertype_147 = -> type_of 3, 4                 ), /expected 1 arguments, got 2/
    throws ( Ω_intertype_148 = -> type_of()                    ), /expected 1 arguments, got 0/
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  same_basic_types: ->
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
    eq ( Ω_intertype_149 = -> isa.boolean                     boolean                 ), true
    eq ( Ω_intertype_150 = -> isa.function                    $function               ), true
    eq ( Ω_intertype_151 = -> isa.asyncfunction               asyncfunction           ), true
    eq ( Ω_intertype_152 = -> isa.generatorfunction           generatorfunction       ), true
    eq ( Ω_intertype_153 = -> isa.asyncgeneratorfunction      asyncgeneratorfunction  ), true
    eq ( Ω_intertype_154 = -> isa.asyncgenerator              asyncgenerator          ), true
    eq ( Ω_intertype_155 = -> isa.generator                   generator               ), true
    eq ( Ω_intertype_156 = -> isa.symbol                      symbol                  ), true
    #.........................................................................................................
    eq ( Ω_intertype_157 = -> validate.boolean                boolean                 ), boolean
    eq ( Ω_intertype_158 = -> validate.function               $function               ), $function
    eq ( Ω_intertype_159 = -> validate.asyncfunction          asyncfunction           ), asyncfunction
    eq ( Ω_intertype_160 = -> validate.generatorfunction      generatorfunction       ), generatorfunction
    eq ( Ω_intertype_161 = -> validate.asyncgeneratorfunction asyncgeneratorfunction  ), asyncgeneratorfunction
    eq ( Ω_intertype_162 = -> validate.asyncgenerator         asyncgenerator          ), asyncgenerator
    eq ( Ω_intertype_163 = -> validate.generator              generator               ), generator
    eq ( Ω_intertype_164 = -> validate.symbol                 symbol                  ), symbol
    #.........................................................................................................
    eq ( Ω_intertype_165 = -> type_of boolean                                         ), 'boolean'
    eq ( Ω_intertype_166 = -> type_of $function                                       ), 'function'
    eq ( Ω_intertype_167 = -> type_of asyncfunction                                   ), 'asyncfunction'
    eq ( Ω_intertype_168 = -> type_of generatorfunction                               ), 'generatorfunction'
    eq ( Ω_intertype_169 = -> type_of asyncgeneratorfunction                          ), 'asyncgeneratorfunction'
    eq ( Ω_intertype_170 = -> type_of asyncgenerator                                  ), 'asyncgenerator'
    eq ( Ω_intertype_171 = -> type_of generator                                       ), 'generator'
    eq ( Ω_intertype_172 = -> type_of symbol                                          ), 'symbol'
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  throw_instructive_error_on_missing_type: ->
    INTERTYPE     = require '../../../apps/intertype'
    { isa
      validate
      type_of   } = new INTERTYPE.Intertype()
    #.........................................................................................................
    throws ( Ω_intertype_173 = -> isa.quux                    ), /unknown type 'quux'/
    throws ( Ω_intertype_174 = -> isa.quux()                  ), /unknown type 'quux'/
    throws ( Ω_intertype_175 = -> isa.quux 3                  ), /unknown type 'quux'/
    throws ( Ω_intertype_176 = -> isa.quux 3, 4               ), /unknown type 'quux'/
    throws ( Ω_intertype_177 = -> isa.optional.quux           ), /unknown type 'quux'/
    throws ( Ω_intertype_178 = -> isa.optional.quux()         ), /unknown type 'quux'/
    throws ( Ω_intertype_179 = -> isa.optional.quux 3         ), /unknown type 'quux'/
    throws ( Ω_intertype_180 = -> isa.optional.quux 3, 4      ), /unknown type 'quux'/
    throws ( Ω_intertype_181 = -> validate.quux               ), /unknown type 'quux'/
    throws ( Ω_intertype_182 = -> validate.quux()             ), /unknown type 'quux'/
    throws ( Ω_intertype_183 = -> validate.quux 3             ), /unknown type 'quux'/
    throws ( Ω_intertype_184 = -> validate.quux 3, 4          ), /unknown type 'quux'/
    throws ( Ω_intertype_185 = -> validate.optional.quux      ), /unknown type 'quux'/
    throws ( Ω_intertype_186 = -> validate.optional.quux()    ), /unknown type 'quux'/
    throws ( Ω_intertype_187 = -> validate.optional.quux 3    ), /unknown type 'quux'/
    throws ( Ω_intertype_188 = -> validate.optional.quux 3, 4 ), /unknown type 'quux'/
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  throw_instructive_error_when_optional_is_declared: ->
    INTERTYPE     = require '../../../apps/intertype'
    throws ( Ω_intertype_189 = -> new INTERTYPE.Intertype_minimal { optional: ( ( x ) -> true ), } ), /not allowed to re-declare type 'optional'/
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  throw_instructive_error_when_wrong_type_of_isa_test_declared: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    throws ( Ω_intertype_190 = -> new Intertype { foo: ( -> ), }                      ), /expected function with 1 parameters, got one with 0/
    throws ( Ω_intertype_191 = -> new Intertype { foo: ( ( a, b ) -> ), }             ), /expected function with 1 parameters, got one with 2/
    throws ( Ω_intertype_192 = -> new Intertype { foo: true, }                        ), /expected type name, method, or object to indicate test method, got a boolean/
    throws ( Ω_intertype_193 = -> new Intertype { foo: undefined, }                   ), /expected type name, method, or object to indicate test method, got a undefined/
    throws ( Ω_intertype_194 = -> new Intertype { foo: null, }                        ), /expected type name, method, or object to indicate test method, got a null/
    throws ( Ω_intertype_195 = -> new Intertype { foo: {}, }                          ), /expected type name, method, or object to indicate test method, got a undefined/
    throws ( Ω_intertype_196 = -> new Intertype { foo: { test: null, }, }             ), /expected type name, method, or object to indicate test method, got a null/
    throws ( Ω_intertype_197 = -> new Intertype { foo: { test: false, }, }            ), /expected type name, method, or object to indicate test method, got a boolean/
    throws ( Ω_intertype_198 = -> new Intertype { foo: { test: ( ( a, b ) -> ), }, }  ), /expected function with 1 parameters, got one with 2/
    throws ( Ω_intertype_199 = -> new Intertype { foo: 'quux', }                      ), /unknown type 'quux'/
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  allow_declaration_objects: ->
    { Intertype_minimal } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      declarations  = { sample_declarations..., }
      declarations.integer =
        test:     ( x ) -> Number.isInteger x
        template: 0
      types = new Intertype_minimal declarations
      eq ( Ω_intertype_200 = -> TMP_types.isa.function types.isa.integer  ), true
      eq ( Ω_intertype_201 = -> types.isa.integer.length                  ), 1
      eq ( Ω_intertype_202 = -> types.isa.integer 123                     ), true
      eq ( Ω_intertype_203 = -> types.isa.integer 123.456                 ), false
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  create_entries_must_be_sync_functions: ->
    { Intertype_minimal } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      declarations  = { sample_declarations..., }
      declarations.integer =
        test:     ( x ) -> Number.isInteger x
        create:   -> await 0
      throws ( Ω_intertype_204 = -> new Intertype_minimal declarations ), /expected a function for `create` entry of type 'integer', got a asyncfunction/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  template_methods_must_be_nullary: ->
    { Intertype_minimal } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      declarations  = { sample_declarations..., }
      declarations.foolist =
        test:     ( x ) -> true
        template: ( n ) -> [ n, ]
      throws ( Ω_intertype_205 = -> new Intertype_minimal declarations ), /template method for type 'foolist' has arity 1 but must be nullary/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  intertype_knows_its_base_types: ->
    { isa } = require '../../../apps/intertype'
    #.........................................................................................................
    eq ( Ω_intertype_206 = -> isa.basetype 'optional'   ), false
    eq ( Ω_intertype_207 = -> isa.basetype 'anything'   ), true
    eq ( Ω_intertype_208 = -> isa.basetype 'nothing'    ), true
    eq ( Ω_intertype_209 = -> isa.basetype 'something'  ), true
    eq ( Ω_intertype_210 = -> isa.basetype 'null'       ), true
    eq ( Ω_intertype_211 = -> isa.basetype 'undefined'  ), true
    eq ( Ω_intertype_212 = -> isa.basetype 'unknown'    ), true
    eq ( Ω_intertype_213 = -> isa.basetype 'integer'    ), false
    eq ( Ω_intertype_214 = -> isa.basetype 'float'      ), false
    eq ( Ω_intertype_215 = -> isa.basetype 'basetype'   ), false
    eq ( Ω_intertype_216 = -> isa.basetype 'quux'       ), false
    eq ( Ω_intertype_217 = -> isa.basetype 'toString'   ), false
    eq ( Ω_intertype_218 = -> isa.basetype null         ), false
    eq ( Ω_intertype_219 = -> isa.basetype undefined    ), false
    eq ( Ω_intertype_220 = -> isa.basetype 4            ), false
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  disallow_licensed_overrides: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types         = new Intertype()
      eq ( Ω_intertype_221 = -> types.isa.float 4 ), true
      #.......................................................................................................
      overrides     =
        float:
          test:       ( x ) -> x is 'float'
      throws ( Ω_intertype_222 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
      #.......................................................................................................
      ### pre-existing declaration remains valid: ###
      eq ( Ω_intertype_223 = -> types.isa.float 4       ), true
      eq ( Ω_intertype_224 = -> types.isa.float 'float' ), false
      return null
    #.........................................................................................................
    do =>
      types         = new Intertype()
      eq ( Ω_intertype_225 = -> types.isa.float 4 ), true
      #.......................................................................................................
      overrides     =
        float:
          override:   true
          test:       ( x ) -> x is 'float'
      throws ( Ω_intertype_226 = -> types.declare overrides ), /not allowed to re-declare type 'float'/
      return null
    #.........................................................................................................
    do =>
      types         = new Intertype()
      eq ( Ω_intertype_227 = -> types.isa.float 4 ), true
      #.......................................................................................................
      overrides     =
        anything:
          override:   true
          test:       ( x ) -> true
      throws ( Ω_intertype_228 = -> types.declare overrides ), /not allowed to re-declare basetype 'anything'/
      #.......................................................................................................
      ### pre-existing declaration remains valid: ###
      eq ( Ω_intertype_229 = -> types.isa.anything 4       ), true
      eq ( Ω_intertype_230 = -> types.isa.anything 'float' ), true
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_create_types_with_templates_and_create: ->
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
      eq ( Ω_intertype_231 = -> TMP_types.isa.object types.declarations       ), true
      eq ( Ω_intertype_232 = -> TMP_types.isa.object types.declarations.float ), true
      eq ( Ω_intertype_233 = -> TMP_types.isa.object types.declarations.text  ), true
      #.......................................................................................................
      throws ( Ω_intertype_234 = -> types.create.boolean() ), /type declaration of 'boolean' has no `create` and no `template` entries, cannot be created/
      throws ( Ω_intertype_235 = -> types.create.text 'foo' ), /expected 0 arguments, got 1/
      #.......................................................................................................
      eq ( Ω_intertype_236 = -> types.create.text()         ), ''
      eq ( Ω_intertype_237 = -> types.create.integer()      ), 0
      eq ( Ω_intertype_238 = -> types.create.float()        ), 0
      eq ( Ω_intertype_239 = -> types.create.float '123.45' ), 123.45
      throws ( Ω_intertype_240 = -> types.create.float '***' ), /expected `create\.float\(\)` to return a float but it returned a nan/
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
      eq ( Ω_intertype_241 = -> create.quantity()    ), { q: 0, u: 'u', }
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
      eq ( Ω_intertype_242 = -> create.quantity()                         ), { q: 0, u: 'u', }
      eq ( Ω_intertype_243 = -> create.quantity { q: 123, }               ), { q: 123, u: 'u', }
      eq ( Ω_intertype_244 = -> create.quantity { u: 'kg', }              ), { q: 0, u: 'kg', }
      eq ( Ω_intertype_245 = -> create.quantity { u: 'kg', foo: 'bar', }  ), { q: 0, u: 'kg', foo: 'bar', }
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  builtin_types_support_create: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types       = new Intertype()
      { create
        type_of } = types
      eq ( Ω_intertype_246 = -> create.float()         ), 0
      eq ( Ω_intertype_247 = -> create.boolean()       ), false
      eq ( Ω_intertype_248 = -> create.object()        ), {}
      eq ( Ω_intertype_249 = -> create.float()         ), 0
      eq ( Ω_intertype_250 = -> create.infinity()      ), Infinity
      eq ( Ω_intertype_251 = -> create.text()          ), ''
      eq ( Ω_intertype_252 = -> create.list()          ), []
      eq ( Ω_intertype_253 = -> create.regex()         ), new RegExp()
      eq ( Ω_intertype_254 = -> type_of create.function()      ), 'function'
      eq ( Ω_intertype_255 = -> type_of create.asyncfunction() ), 'asyncfunction'
      eq ( Ω_intertype_256 = -> type_of create.symbol()        ), 'symbol'
      throws ( Ω_intertype_257 = -> create.basetype() ), /type declaration of 'basetype' has no `create` and no `template` entries, cannot be created/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  template_functions_are_called_in_template_fields: ->
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
      eq ( Ω_intertype_258 = -> create.quantity()                          ), { q: 0, u: 'u', }
      eq ( Ω_intertype_259 = -> isa.quantity { q: 9, }                     ), false
      eq ( Ω_intertype_260 = -> type_of declarations.quantity.sub_tests.q  ), 'function'
      eq ( Ω_intertype_261 = -> type_of declarations.quantity.sub_tests.u  ), 'function'
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
      eq ( Ω_intertype_262 = -> create.foo() ), { foo: { bar: 123, } }
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  type_object_assumed_if_fields_present: ->
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
      eq ( Ω_intertype_263 = -> type_of declarations.quantity.test ), 'function'
      debug '^342342^', declarations.quantity
      eq ( Ω_intertype_264 = -> type_of declarations.quantity.sub_tests.q ), 'function'
      eq ( Ω_intertype_265 = -> type_of declarations.quantity.sub_tests.u ), 'function'
      eq ( Ω_intertype_266 = -> isa.quantity { q: 987, u: 's', } ), true
      eq ( Ω_intertype_267 = -> isa.quantity { q: 987, } ), false
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  intertype_minimal_has_only_base_types: ->
    { Intertype_minimal } = require '../../../apps/intertype'
    types = new Intertype_minimal()
    eq ( Ω_intertype_268 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown' ]
    types.declare { z: ( ( x ) -> ), }
    eq ( Ω_intertype_269 = -> ( Object.keys types.declarations ).sort() ), [ 'anything', 'nothing', 'null', 'optional', 'something', 'undefined', 'unknown', 'z' ]
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_type_name_for_test: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types = new Intertype()
      throws ( Ω_intertype_270 = -> types.declare { z: 'quux', } ), /unknown type 'quux'/
      types.declare { z: 'float', }
      eq ( Ω_intertype_271 = -> types.isa.z 12 ), true
      eq ( Ω_intertype_272 = -> types.isa.float.name                ), 'isa.float'
      eq ( Ω_intertype_273 = -> types.declarations.float.type       ), 'float'
      eq ( Ω_intertype_274 = -> types.declarations.float.test.name  ), 'float'
      eq ( Ω_intertype_275 = -> types.isa.z.name                    ), 'isa.z'
      eq ( Ω_intertype_276 = -> types.declarations.z.type           ), 'z'
      eq ( Ω_intertype_277 = -> types.declarations.z.test.name      ), 'z' # ?
    #.........................................................................................................
    do =>
      types = new Intertype()
      throws ( Ω_intertype_278 = -> types.declare { z: { test: 'quux', }, } ), /unknown type 'quux'/
      types.declare { z: { test: 'float', }, }
      eq ( Ω_intertype_279 = -> types.isa.z 12 ), true
      eq ( Ω_intertype_280 = -> types.isa.float.name                ), 'isa.float'
      eq ( Ω_intertype_281 = -> types.declarations.float.type       ), 'float'
      eq ( Ω_intertype_282 = -> types.declarations.float.test.name  ), 'float'
      eq ( Ω_intertype_283 = -> types.isa.z.name                    ), 'isa.z'
      eq ( Ω_intertype_284 = -> types.declarations.z.type           ), 'z'
      eq ( Ω_intertype_285 = -> types.declarations.z.test.name      ), 'z'
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  resolve_dotted_type: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types = new Intertype()
      eq ( Ω_intertype_286 = -> Reflect.has types.declarations, 'foo'           ), false
      types.declare { foo: 'object', }
      eq ( Ω_intertype_287 = -> Reflect.has types.declarations, 'foo'           ), true
      eq ( Ω_intertype_288 = -> Reflect.has types.declarations, 'foo.bar'       ), false
      types.declare { 'foo.bar': 'object', }
      eq ( Ω_intertype_289 = -> Reflect.has types.declarations, 'foo.bar'       ), true
      eq ( Ω_intertype_290 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), false
      types.declare { 'foo.bar.baz': 'float', }
      eq ( Ω_intertype_291 = -> Reflect.has types.declarations, 'foo.bar.baz'   ), true
      eq ( Ω_intertype_292 = -> types.isa.foo.bar.baz null                      ), false
      eq ( Ω_intertype_293 = -> types.isa.foo.bar.baz 4                         ), true
      eq ( Ω_intertype_294 = -> types.isa.foo.bar.baz +Infinity                 ), false
      # T?.eq types.declarations[ 'foo.bar.baz' ].test, types.declarations.float.test
      # types.declare { 'foo.bar.baz.quux.dax.dux': 'float', }
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  dotted_types_are_test_methods: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types = new Intertype()
      types.declare { quantity: 'object', }
      types.declare { 'quantity.q': 'float', }
      types.declare { 'quantity.u': 'text', }
      eq ( Ω_intertype_295 = -> types.isa[ 'quantity.q' ] ), types.declarations[ 'quantity' ].sub_tests[ 'q' ]
      eq ( Ω_intertype_296 = -> types.isa[ 'quantity.q' ] ), types.isa.quantity.q
      # debug '^409-1^', types.declarations
      eq ( Ω_intertype_297 = -> types.isa.quantity {}                 ), false
      eq ( Ω_intertype_298 = -> types.isa.quantity { q: {}, }         ), false
      eq ( Ω_intertype_299 = -> types.isa.quantity { q: 3, }          ), false
      eq ( Ω_intertype_300 = -> types.isa.quantity { q: 3, u: 'm', }  ), true
      eq ( Ω_intertype_301 = -> types.isa.quantity.q 3                ), true
      eq ( Ω_intertype_302 = -> types.isa.quantity.q 3.1              ), true
      eq ( Ω_intertype_303 = -> types.isa.quantity.q '3.1'            ), false
      eq ( Ω_intertype_304 = -> types.isa.quantity.u 'm'              ), true
      eq ( Ω_intertype_305 = -> types.isa.quantity.u null             ), false
      eq ( Ω_intertype_306 = -> types.isa.quantity.u 3                ), false
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
      eq ( Ω_intertype_307 = -> types.isa.person.address.city.name 'P'  ), true
      eq ( Ω_intertype_308 = -> types.isa.person.address.city.name 1234 ), false
      eq ( Ω_intertype_309 = -> types.isa.person 1234 ), false
      eq ( Ω_intertype_310 = -> types.isa.person { name: 'Bob', } ), false
      eq ( Ω_intertype_311 = -> types.isa.person { name: 'Bob', address: {}, } ), false
      eq ( Ω_intertype_312 = -> types.isa.person { name: 'Bob', address: { city: {}, }, } ), false
      eq ( Ω_intertype_313 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', }, }, } ), false
      eq ( Ω_intertype_314 = -> types.isa.person { name: 'Bob', address: { city: { name: 'P', postcode: 'SO36', }, }, } ), true
      eq ( Ω_intertype_315 = -> types.isa.person.address.city.name     'P'                                ), true
      eq ( Ω_intertype_316 = -> types.isa.person.address.city.postcode 'SO36'                             ), true
      eq ( Ω_intertype_317 = -> types.isa.person.address.city {         name: 'P', postcode: 'SO36', }    ), true
      eq ( Ω_intertype_318 = -> types.isa.person.address      { city: { name: 'P', postcode: 'SO36', }, } ), true
      help '^322-1^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person'               ].sub_tests )
      help '^322-2^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address'       ].sub_tests )
      help '^322-3^', ( { "#{k}": f.name } for k, f of types.declarations[ 'person.address.city'  ].sub_tests )
      eq ( Ω_intertype_319 = -> Object.keys types.declarations[ 'person'               ].sub_tests ), [ 'name', 'address', ]
      eq ( Ω_intertype_320 = -> Object.keys types.declarations[ 'person.address'       ].sub_tests ), [ 'city', ]
      eq ( Ω_intertype_321 = -> Object.keys types.declarations[ 'person.address.city'  ].sub_tests ), [ 'name', 'postcode', ]
      eq ( Ω_intertype_322 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address'      ].sub_tests ), true
      eq ( Ω_intertype_323 = -> types.declarations[ 'person' ].sub_tests isnt types.declarations[ 'person.address.city' ].sub_tests ), true
      return null
    #.........................................................................................................
    do =>
      types = new Intertype()
      types.declare { 'foo':      'float', }
      types.declare { 'foo.bar':  'text',   }
      do =>
        d = 3
        # d.bar = '?' # Cannot create property in strict mode, so can never satisfy test
        eq ( Ω_intertype_324 = -> types.isa.foo d ), false
        return null
      do =>
        d = new Number 3
        d.bar = '?'
        eq ( Ω_intertype_325 = -> d.bar ), '?'
        # still won't work b/c `float` doesn't accept objects (which is a good thing):
        eq ( Ω_intertype_326 = -> types.isa.foo d ), false
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
      eq ( Ω_intertype_327 = -> types.isa.foo {} ), false
      eq ( Ω_intertype_328 = -> types.isa.foo { bind: 1, apply: 2, call: 3, name: 4, length: 5, } ), true
      return null
    #.........................................................................................................
    do =>
      types = new Intertype()
      types.declare { 'foo':        'object',           }
      types.declare { 'foo.text':   ( ( x ) -> x is 1 ) }
      types.declare { 'foo.float':  ( ( x ) -> x is 2 ) }
      eq ( Ω_intertype_329 = -> types.isa.foo {} ), false
      eq ( Ω_intertype_330 = -> types.isa.foo { text: 1, float: 2, } ), true
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_refs_to_dotted_types: ->
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
      eq ( Ω_intertype_331 = -> types.isa.person.address.city {} ), false
      eq ( Ω_intertype_332 = -> types.isa.person.address.city null ), false
      eq ( Ω_intertype_333 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
      eq ( Ω_intertype_334 = -> types.isa.mycity {} ), false
      eq ( Ω_intertype_335 = -> types.isa.mycity null ), false
      eq ( Ω_intertype_336 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
      eq ( Ω_intertype_337 = -> types.isa.person.address.city {} ), false
      eq ( Ω_intertype_338 = -> types.isa.person.address.city null ), false
      eq ( Ω_intertype_339 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
      eq ( Ω_intertype_340 = -> types.isa.mycity {} ), false
      eq ( Ω_intertype_341 = -> types.isa.mycity null ), false
      eq ( Ω_intertype_342 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
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
      eq ( Ω_intertype_343 = -> types.isa.person.address.city {} ), false
      eq ( Ω_intertype_344 = -> types.isa.person.address.city null ), false
      eq ( Ω_intertype_345 = -> types.isa.person.address.city { name: 'P', postcode: 'SO36', } ), true
      eq ( Ω_intertype_346 = -> types.isa.optional.person.address.city {} ), false
      eq ( Ω_intertype_347 = -> types.isa.optional.person.address.city null ), true
      eq ( Ω_intertype_348 = -> types.isa.optional.person.address.city { name: 'P', postcode: 'SO36', } ), true
      eq ( Ω_intertype_349 = -> types.isa.mycity {} ), false
      eq ( Ω_intertype_350 = -> types.isa.mycity null ), true
      eq ( Ω_intertype_351 = -> types.isa.mycity { name: 'P', postcode: 'SO36', } ), true
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  forbidden_to_define_fields_on_basetypes: ->
    { Intertype
      declarations  } = require '../../../apps/intertype'
    #.........................................................................................................
    await do =>
      types         = new Intertype()
      { declare
        validate
        isa } = types
      throws ( Ω_intertype_352 = -> types.declare { 'optional.d':    ( ( x ) -> ), } ), /illegal use of 'optional' in declaration of type 'optional.d'/
      throws ( Ω_intertype_353 = -> types.declare { 'anything.d':    ( ( x ) -> ), } ), /illegal use of basetype 'anything' in declaration of type 'anything.d'/
      throws ( Ω_intertype_354 = -> types.declare { 'nothing.d':     ( ( x ) -> ), } ), /illegal use of basetype 'nothing' in declaration of type 'nothing.d'/
      throws ( Ω_intertype_355 = -> types.declare { 'something.d':   ( ( x ) -> ), } ), /illegal use of basetype 'something' in declaration of type 'something.d'/
      throws ( Ω_intertype_356 = -> types.declare { 'null.d':        ( ( x ) -> ), } ), /illegal use of basetype 'null' in declaration of type 'null.d'/
      throws ( Ω_intertype_357 = -> types.declare { 'undefined.d':   ( ( x ) -> ), } ), /illegal use of basetype 'undefined' in declaration of type 'undefined.d'/
      throws ( Ω_intertype_358 = -> types.declare { 'unknown.d':     ( ( x ) -> ), } ), /illegal use of basetype 'unknown' in declaration of type 'unknown.d'/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  internal_type_of_method: ->
    { Intertype
      declarations
      __type_of     } = require '../../../apps/intertype'
    #.........................................................................................................
    _isa = Object.fromEntries ( [ type, declaration.test, ] for type, declaration of declarations )
    #.........................................................................................................
    do =>
      types         = new Intertype()
      eq ( Ω_intertype_359 = -> __type_of _isa, null          ), 'null'
      eq ( Ω_intertype_360 = -> __type_of _isa, undefined     ), 'undefined'
      eq ( Ω_intertype_361 = -> __type_of _isa, 4             ), 'float'
      eq ( Ω_intertype_362 = -> __type_of _isa, ->            ), 'function'
      eq ( Ω_intertype_363 = -> __type_of _isa, -> await null ), 'asyncfunction'
      eq ( Ω_intertype_364 = -> __type_of _isa, {}            ), 'object'
      eq ( Ω_intertype_365 = -> __type_of _isa, []            ), 'list'
      eq ( Ω_intertype_366 = -> __type_of _isa, +Infinity     ), 'infinity'
      eq ( Ω_intertype_367 = -> __type_of _isa, -Infinity     ), 'infinity'
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  deepmerge: ->
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
      eq ( Ω_intertype_368 = -> result                                   ), probe
      eq ( Ω_intertype_369 = -> result.bar         is probe.bar          ), false
      eq ( Ω_intertype_370 = -> result.bar.baz     is probe.bar.baz      ), false
      eq ( Ω_intertype_371 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
      eq ( Ω_intertype_372 = -> result.bar.baz.sub is sub                ), false
      eq ( Ω_intertype_373 = -> probe.bar.baz.sub  is sub                ), true
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
      eq ( Ω_intertype_374 = -> result                                   ), probe
      eq ( Ω_intertype_375 = -> result.bar         is probe.bar          ), false
      eq ( Ω_intertype_376 = -> result.bar.baz     is probe.bar.baz      ), false
      eq ( Ω_intertype_377 = -> result.bar.baz.sub is probe.bar.baz.sub  ), false
      eq ( Ω_intertype_378 = -> result.bar.baz.sub is sub                ), false
      eq ( Ω_intertype_379 = -> probe.bar.baz.sub  is sub                ), true
      return null
    #.........................................................................................................
    do =>
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  validate_dotted_types: ->
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
      throws ( Ω_intertype_380 = -> validate.person null                        ), /expected a person, got a null/
      throws ( Ω_intertype_381 = -> validate.person.address null                ), /expected a person.address, got a null/
      throws ( Ω_intertype_382 = -> validate.person.address.city null           ), /expected a person.address.city, got a null/
      throws ( Ω_intertype_383 = -> validate.person.address.city.postcode null  ), /expected a person.address.city.postcode, got a null/
      #.......................................................................................................
      eq ( Ω_intertype_384 = -> types.isa.person.address.city.postcode 3 ), false
      throws ( Ω_intertype_385 = -> validate.person.address.city.postcode 3             ), /expected a person.address.city.postcode/
      #.......................................................................................................
      eq ( Ω_intertype_386 = -> types.isa.person.address.city { name: 'P', } ), false
      throws ( Ω_intertype_387 = -> validate.person.address.city { name: 'P', }         ), /expected a person.address.city/
      # #.......................................................................................................
      eq ( Ω_intertype_388 = -> types.isa.person.address.city { postcode: '3421', } ), false
      throws ( Ω_intertype_389 = -> validate.person.address.city()                      ), /method 'validate.person.address.city' expects 1 arguments, got 0/
      throws ( Ω_intertype_390 = -> validate.person.address.city null                   ), /expected a person.address.city/
      throws ( Ω_intertype_391 = -> validate.person.address.city '3421'                 ), /expected a person.address.city/
      throws ( Ω_intertype_392 = -> validate.person.address.city { postcode: '3421', }  ), /expected a person.address.city/
      #.......................................................................................................
      eq ( Ω_intertype_393 = -> types.isa.person.address.city { name: 'P', postcode: '3421', } ), true
      eq ( Ω_intertype_394 = -> validate.person.address.city { name: 'P', postcode: '3421', } ), { name: 'P', postcode: '3421', }
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  use_evaluate: ->
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
      throws ( Ω_intertype_395 = -> evaluate.optional 1         ), /`optional` is not a legal type for `evaluate` methods/
      throws ( Ω_intertype_396 = -> evaluate.optional.person 1  ), /`optional` is not a legal type for `evaluate` methods/
      #.......................................................................................................
      eq ( Ω_intertype_397 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
      eq ( Ω_intertype_398 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
      #.......................................................................................................
      eq ( Ω_intertype_399 = -> isa.person       { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
      eq ( Ω_intertype_400 = -> evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': true, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
      #.......................................................................................................
      eq ( Ω_intertype_401 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), false
      eq ( Ω_intertype_402 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 12345678 } } } ), { person: false,  'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': true, 'person.address.city.postcode': false, }
      #.......................................................................................................
      eq ( Ω_intertype_403 = -> isa.person       {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
      eq ( Ω_intertype_404 = -> evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
      #.......................................................................................................
      eq ( Ω_intertype_405 = -> isa.person       null  ), false
      eq ( Ω_intertype_406 = -> evaluate.person  null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
      #.......................................................................................................
      eq ( Ω_intertype_407 = -> isa.person       {}    ), false
      eq ( Ω_intertype_408 = -> evaluate.person  {}    ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
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
      eq ( Ω_intertype_409 = -> isa.person                   { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), true
      eq ( Ω_intertype_410 = -> evaluate.person              { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: true,  'person.name': true, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
      eq ( Ω_intertype_411 = -> Object.keys evaluate.person  { name: 'Alice', address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
      #.......................................................................................................
      eq ( Ω_intertype_412 = -> isa.person                   {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), false
      eq ( Ω_intertype_413 = -> evaluate.person              {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), { person: false, 'person.name': false, 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
      eq ( Ω_intertype_414 = -> Object.keys evaluate.person  {                address: { city: { name: 'Atown', postcode: 'VA1234' } } } ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
      #.......................................................................................................
      eq ( Ω_intertype_415 = -> isa.person                   null  ), false
      eq ( Ω_intertype_416 = -> evaluate.person              null  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
      eq ( Ω_intertype_417 = -> Object.keys evaluate.person  null  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
      #.......................................................................................................
      eq ( Ω_intertype_418 = -> isa.person                   {}  ), false
      eq ( Ω_intertype_419 = -> evaluate.person              {}  ), { person: false, 'person.name': false, 'person.address': false, 'person.address.city': false, 'person.address.city.name': false, 'person.address.city.postcode': false, }
      eq ( Ω_intertype_420 = -> Object.keys evaluate.person  {}  ), [ 'person', 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name', 'person.name' ]
      #.......................................................................................................
      eq ( Ω_intertype_421 = -> isa.person.address                   { city: { name: 'Atown', postcode: 'VA1234' } } ), true
      eq ( Ω_intertype_422 = -> evaluate.person.address              { city: { name: 'Atown', postcode: 'VA1234' } } ), { 'person.address': true, 'person.address.city': true, 'person.address.city.name': true, 'person.address.city.postcode': true, }
      eq ( Ω_intertype_423 = -> Object.keys evaluate.person.address  { city: { name: 'Atown', postcode: 'VA1234' } } ), [ 'person.address', 'person.address.city', 'person.address.city.postcode', 'person.address.city.name' ]
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  walk_prefixes: ->
    { walk_prefixes
      isa
      type_of                     } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      eq ( Ω_intertype_424 = -> isa.generatorfunction walk_prefixes             ), true
      eq ( Ω_intertype_425 = -> [ ( walk_prefixes 'one'                )..., ]  ), []
      eq ( Ω_intertype_426 = -> [ ( walk_prefixes 'one.two'            )..., ]  ), [ 'one' ]
      eq ( Ω_intertype_427 = -> [ ( walk_prefixes 'one.two.three'      )..., ]  ), [ 'one', 'one.two', ]
      eq ( Ω_intertype_428 = -> [ ( walk_prefixes 'one.two.three.four' )..., ]  ), [ 'one', 'one.two', 'one.two.three', ]
      ### TAINT should not allow empty namers: ###
      eq ( Ω_intertype_429 = -> [ ( walk_prefixes '.one.two.three'     )..., ]  ), [ '', '.one', '.one.two', ]
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_namespaces: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      declarations =
        'foo.bar':      ( x ) -> x is 'foo.bar'
        'foo.bar.baz':  ( x ) -> x is 'foo.bar.baz'
      throws ( Ω_intertype_430 = -> types = new Intertype declarations ), /unknown partial type 'foo'/
      return null
    #.........................................................................................................
    do =>
      declarations =
        'quantity':         'object'
        'quantity.q':       'float'
        'quantity.u':       'text'
      types = new Intertype declarations
      eq ( Ω_intertype_431 = -> types.isa.quantity {}                   ), false
      eq ( Ω_intertype_432 = -> types.isa.quantity { q: 12, u: 'kg', }  ), true
      eq ( Ω_intertype_433 = -> types.isa[ 'quantity.q' ] 12            ), true
      eq ( Ω_intertype_434 = -> types.isa[ 'quantity.u' ] 'kg'          ), true
      eq ( Ω_intertype_435 = -> types.isa.quantity.q 12                 ), true
      eq ( Ω_intertype_436 = -> types.isa.quantity.u 'kg'               ), true
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_qualifiers: ->
    { Intertype_minimal } = require '../../../apps/intertype'
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
      types   = new Intertype_minimal sample_declarations, declarations
      { isa } = types
      eq ( Ω_intertype_437 = -> isa.empty.list    []          ), true
      eq ( Ω_intertype_438 = -> isa.empty.list    [ 'A', ]    ), false
      eq ( Ω_intertype_439 = -> isa.empty.list    4           ), false
      eq ( Ω_intertype_440 = -> isa.nonempty.list []          ), false
      eq ( Ω_intertype_441 = -> isa.nonempty.list [ 'A', ]    ), true
      eq ( Ω_intertype_442 = -> isa.nonempty.list 4           ), false
      eq ( Ω_intertype_443 = -> isa.empty.text    ''          ), true
      eq ( Ω_intertype_444 = -> isa.empty.text    'A'         ), false
      eq ( Ω_intertype_445 = -> isa.empty.text    4           ), false
      eq ( Ω_intertype_446 = -> isa.nonempty.text ''          ), false
      eq ( Ω_intertype_447 = -> isa.nonempty.text 'A'         ), true
      eq ( Ω_intertype_448 = -> isa.nonempty.text 4           ), false
      ### this doesn't make a terrible lot of sense: ###
      eq ( Ω_intertype_449 = -> isa.empty { list: [], text: '', set: new Set() } ), false
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
      types         = new Intertype_minimal sample_declarations, declarations
      { isa
        validate  } = types
      eq ( Ω_intertype_450 = -> isa.empty.list    []          ), true
      eq ( Ω_intertype_451 = -> isa.empty.list    [ 'A', ]    ), false
      eq ( Ω_intertype_452 = -> isa.empty.list    4           ), false
      eq ( Ω_intertype_453 = -> isa.nonempty.list []          ), false
      eq ( Ω_intertype_454 = -> isa.nonempty.list [ 'A', ]    ), true
      eq ( Ω_intertype_455 = -> isa.nonempty.list 4           ), false
      eq ( Ω_intertype_456 = -> isa.empty.text    ''          ), true
      eq ( Ω_intertype_457 = -> isa.empty.text    'A'         ), false
      eq ( Ω_intertype_458 = -> isa.empty.text    4           ), false
      eq ( Ω_intertype_459 = -> isa.nonempty.text ''          ), false
      eq ( Ω_intertype_460 = -> isa.nonempty.text 'A'         ), true
      eq ( Ω_intertype_461 = -> isa.nonempty.text 4           ), false
      #.......................................................................................................
      eq ( Ω_intertype_462 = -> isa.empty []                  ), true
      eq ( Ω_intertype_463 = -> isa.empty ''                  ), true
      eq ( Ω_intertype_464 = -> isa.empty new Set()           ), true
      eq ( Ω_intertype_465 = -> isa.empty [ 1, ]              ), false
      eq ( Ω_intertype_466 = -> isa.empty 'A'                 ), false
      eq ( Ω_intertype_467 = -> isa.empty new Set 'abc'       ), false
      #.......................................................................................................
      eq ( Ω_intertype_468 = -> validate.empty []                  ), []
      eq ( Ω_intertype_469 = -> validate.empty ''                  ), ''
      eq ( Ω_intertype_470 = -> validate.empty new Set()           ), new Set()
      throws ( Ω_intertype_471 = -> validate.empty [ 1, ]              ), /expected a empty, got a list/
      throws ( Ω_intertype_472 = -> validate.empty 'A'                 ), /expected a empty, got a text/
      throws ( Ω_intertype_473 = -> validate.empty new Set 'abc'       ), /expected a empty, got a set/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_optional_with_qualifiers: ->
    { Intertype_minimal } = require '../../../apps/intertype'
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
      types         = new Intertype_minimal sample_declarations, declarations
      { isa
        validate  } = types
      eq ( Ω_intertype_474 = -> isa.optional.empty.list    []          ), true
      eq ( Ω_intertype_475 = -> isa.optional.empty.list    [ 'A', ]    ), false
      eq ( Ω_intertype_476 = -> isa.optional.empty.list    4           ), false
      eq ( Ω_intertype_477 = -> isa.optional.nonempty.list []          ), false
      eq ( Ω_intertype_478 = -> isa.optional.nonempty.list [ 'A', ]    ), true
      eq ( Ω_intertype_479 = -> isa.optional.nonempty.list 4           ), false
      eq ( Ω_intertype_480 = -> isa.optional.empty.text    ''          ), true
      eq ( Ω_intertype_481 = -> isa.optional.empty.text    'A'         ), false
      eq ( Ω_intertype_482 = -> isa.optional.empty.text    4           ), false
      eq ( Ω_intertype_483 = -> isa.optional.nonempty.text ''          ), false
      eq ( Ω_intertype_484 = -> isa.optional.nonempty.text 'A'         ), true
      eq ( Ω_intertype_485 = -> isa.optional.nonempty.text 4           ), false
      #.......................................................................................................
      eq ( Ω_intertype_486 = -> isa.optional.empty []                  ), true
      eq ( Ω_intertype_487 = -> isa.optional.empty ''                  ), true
      eq ( Ω_intertype_488 = -> isa.optional.empty new Set()           ), true
      eq ( Ω_intertype_489 = -> isa.optional.empty [ 1, ]              ), false
      eq ( Ω_intertype_490 = -> isa.optional.empty 'A'                 ), false
      eq ( Ω_intertype_491 = -> isa.optional.empty new Set 'abc'       ), false
      #.......................................................................................................
      eq ( Ω_intertype_492 = -> validate.optional.empty []                   ), []
      eq ( Ω_intertype_493 = -> validate.optional.empty ''                   ), ''
      eq ( Ω_intertype_494 = -> validate.optional.empty new Set()            ), new Set()
      eq ( Ω_intertype_495 = -> validate.optional.empty.list  []             ), []
      eq ( Ω_intertype_496 = -> validate.optional.empty.text  ''             ), ''
      eq ( Ω_intertype_497 = -> validate.optional.empty.set   new Set()      ), new Set()
      throws ( Ω_intertype_498 = -> validate.optional.empty [ 1, ]           ), /expected an optional empty, got a list/
      throws ( Ω_intertype_499 = -> validate.optional.empty 'A'              ), /expected an optional empty, got a text/
      throws ( Ω_intertype_500 = -> validate.optional.empty new Set 'abc'    ), /expected an optional empty, got a set/
      #.......................................................................................................
      eq ( Ω_intertype_501 = -> isa.optional.empty []                        ), true
      eq ( Ω_intertype_502 = -> isa.optional.empty ''                        ), true
      eq ( Ω_intertype_503 = -> isa.optional.empty new Set()                 ), true
      eq ( Ω_intertype_504 = -> isa.optional.empty [ 1, ]                    ), false
      eq ( Ω_intertype_505 = -> isa.optional.empty 'A'                       ), false
      eq ( Ω_intertype_506 = -> isa.optional.empty new Set 'abc'             ), false
      eq ( Ω_intertype_507 = -> validate.optional.empty       null           ), null
      eq ( Ω_intertype_508 = -> validate.optional.empty.list  null           ), null
      eq ( Ω_intertype_509 = -> validate.optional.empty.text  null           ), null
      eq ( Ω_intertype_510 = -> validate.optional.empty.set   null           ), null
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  use_fields_to_declare_qualifiers: ->
    { Intertype_minimal } = require '../../../apps/intertype'
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
      #.......................................................................................................
      types         = new Intertype_minimal sample_declarations, declarations
      { isa
        validate  } = types
      #.......................................................................................................
      eq ( Ω_intertype_511 = -> isa.empty.list    []          ), true
      eq ( Ω_intertype_512 = -> isa.empty.list    [ 'A', ]    ), false
      eq ( Ω_intertype_513 = -> isa.empty.list    4           ), false
      eq ( Ω_intertype_514 = -> isa.nonempty.list []          ), false
      eq ( Ω_intertype_515 = -> isa.nonempty.list [ 'A', ]    ), true
      eq ( Ω_intertype_516 = -> isa.nonempty.list 4           ), false
      eq ( Ω_intertype_517 = -> isa.empty.text    ''          ), true
      eq ( Ω_intertype_518 = -> isa.empty.text    'A'         ), false
      eq ( Ω_intertype_519 = -> isa.empty.text    4           ), false
      eq ( Ω_intertype_520 = -> isa.nonempty.text ''          ), false
      eq ( Ω_intertype_521 = -> isa.nonempty.text 'A'         ), true
      eq ( Ω_intertype_522 = -> isa.nonempty.text 4           ), false
      #.......................................................................................................
      eq ( Ω_intertype_523 = -> isa.empty []                  ), true
      eq ( Ω_intertype_524 = -> isa.empty ''                  ), true
      eq ( Ω_intertype_525 = -> isa.empty new Set()           ), true
      eq ( Ω_intertype_526 = -> isa.empty [ 1, ]              ), false
      eq ( Ω_intertype_527 = -> isa.empty 'A'                 ), false
      eq ( Ω_intertype_528 = -> isa.empty new Set 'abc'       ), false
      #.......................................................................................................
      eq ( Ω_intertype_529 = -> validate.empty []                   ), []
      eq ( Ω_intertype_530 = -> validate.empty ''                   ), ''
      eq ( Ω_intertype_531 = -> validate.empty new Set()            ), new Set()
      eq ( Ω_intertype_532 = -> validate.empty.list  []             ), []
      eq ( Ω_intertype_533 = -> validate.empty.text  ''             ), ''
      eq ( Ω_intertype_534 = -> validate.empty.set   new Set()      ), new Set()
      throws ( Ω_intertype_535 = -> validate.empty [ 1, ]           ), /expected a empty, got a list/
      throws ( Ω_intertype_536 = -> validate.empty 'A'              ), /expected a empty, got a text/
      throws ( Ω_intertype_537 = -> validate.empty new Set 'abc'    ), /expected a empty, got a set/
      #.......................................................................................................
      eq ( Ω_intertype_538 = -> isa.empty []                        ), true
      eq ( Ω_intertype_539 = -> isa.empty ''                        ), true
      eq ( Ω_intertype_540 = -> isa.empty new Set()                 ), true
      eq ( Ω_intertype_541 = -> isa.empty [ 1, ]                    ), false
      eq ( Ω_intertype_542 = -> isa.empty 'A'                       ), false
      eq ( Ω_intertype_543 = -> isa.empty new Set 'abc'             ), false
      throws ( Ω_intertype_544 = -> validate.empty       null           ), /expected a empty, got a null/
      throws ( Ω_intertype_545 = -> validate.empty.list  null           ), /expected a empty.list, got a null/
      throws ( Ω_intertype_546 = -> validate.empty.text  null           ), /expected a empty.text, got a null/
      throws ( Ω_intertype_547 = -> validate.empty.set   null           ), /expected a empty.set, got a null/
      #.......................................................................................................
      eq ( Ω_intertype_548 = -> isa.optional.empty.list    []          ), true
      eq ( Ω_intertype_549 = -> isa.optional.empty.list    [ 'A', ]    ), false
      eq ( Ω_intertype_550 = -> isa.optional.empty.list    4           ), false
      eq ( Ω_intertype_551 = -> isa.optional.nonempty.list []          ), false
      eq ( Ω_intertype_552 = -> isa.optional.nonempty.list [ 'A', ]    ), true
      eq ( Ω_intertype_553 = -> isa.optional.nonempty.list 4           ), false
      eq ( Ω_intertype_554 = -> isa.optional.empty.text    ''          ), true
      eq ( Ω_intertype_555 = -> isa.optional.empty.text    'A'         ), false
      eq ( Ω_intertype_556 = -> isa.optional.empty.text    4           ), false
      eq ( Ω_intertype_557 = -> isa.optional.nonempty.text ''          ), false
      eq ( Ω_intertype_558 = -> isa.optional.nonempty.text 'A'         ), true
      eq ( Ω_intertype_559 = -> isa.optional.nonempty.text 4           ), false
      #.......................................................................................................
      eq ( Ω_intertype_560 = -> isa.optional.empty []                  ), true
      eq ( Ω_intertype_561 = -> isa.optional.empty ''                  ), true
      eq ( Ω_intertype_562 = -> isa.optional.empty new Set()           ), true
      eq ( Ω_intertype_563 = -> isa.optional.empty [ 1, ]              ), false
      eq ( Ω_intertype_564 = -> isa.optional.empty 'A'                 ), false
      eq ( Ω_intertype_565 = -> isa.optional.empty new Set 'abc'       ), false
      #.......................................................................................................
      eq ( Ω_intertype_566 = -> validate.optional.empty []                   ), []
      eq ( Ω_intertype_567 = -> validate.optional.empty ''                   ), ''
      eq ( Ω_intertype_568 = -> validate.optional.empty new Set()            ), new Set()
      eq ( Ω_intertype_569 = -> validate.optional.empty.list  []             ), []
      eq ( Ω_intertype_570 = -> validate.optional.empty.text  ''             ), ''
      eq ( Ω_intertype_571 = -> validate.optional.empty.set   new Set()      ), new Set()
      throws ( Ω_intertype_572 = -> validate.optional.empty [ 1, ]           ), /expected an optional empty, got a list/
      throws ( Ω_intertype_573 = -> validate.optional.empty 'A'              ), /expected an optional empty, got a text/
      throws ( Ω_intertype_574 = -> validate.optional.empty new Set 'abc'    ), /expected an optional empty, got a set/
      #.......................................................................................................
      eq ( Ω_intertype_575 = -> isa.optional.empty []                        ), true
      eq ( Ω_intertype_576 = -> isa.optional.empty ''                        ), true
      eq ( Ω_intertype_577 = -> isa.optional.empty new Set()                 ), true
      eq ( Ω_intertype_578 = -> isa.optional.empty [ 1, ]                    ), false
      eq ( Ω_intertype_579 = -> isa.optional.empty 'A'                       ), false
      eq ( Ω_intertype_580 = -> isa.optional.empty new Set 'abc'             ), false
      eq ( Ω_intertype_581 = -> validate.optional.empty       null           ), null
      eq ( Ω_intertype_582 = -> validate.optional.empty.list  null           ), null
      eq ( Ω_intertype_583 = -> validate.optional.empty.text  null           ), null
      eq ( Ω_intertype_584 = -> validate.optional.empty.set   null           ), null
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  builtin_qualifiers: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      types   = new Intertype()
      { isa
        validate
        evaluate
        type_of   } = types
      #.......................................................................................................
      eq ( Ω_intertype_585 = -> isa.empty.list    []                             ), true
      eq ( Ω_intertype_586 = -> isa.empty.list    [ 'A', ]                       ), false
      eq ( Ω_intertype_587 = -> isa.empty.list    4                              ), false
      eq ( Ω_intertype_588 = -> isa.nonempty.list []                             ), false
      eq ( Ω_intertype_589 = -> isa.nonempty.list [ 'A', ]                       ), true
      eq ( Ω_intertype_590 = -> isa.nonempty.list 4                              ), false
      eq ( Ω_intertype_591 = -> isa.empty.text    ''                             ), true
      eq ( Ω_intertype_592 = -> isa.empty.text    'A'                            ), false
      eq ( Ω_intertype_593 = -> isa.empty.text    4                              ), false
      eq ( Ω_intertype_594 = -> isa.nonempty.text ''                             ), false
      eq ( Ω_intertype_595 = -> isa.nonempty.text 'A'                            ), true
      eq ( Ω_intertype_596 = -> isa.nonempty.text 4                              ), false
      eq ( Ω_intertype_597 = -> isa.empty { list: [], text: '', set: new Set() } ), false
      #.......................................................................................................
      eq ( Ω_intertype_598 = -> isa.empty []                                     ), true
      eq ( Ω_intertype_599 = -> isa.empty ''                                     ), true
      eq ( Ω_intertype_600 = -> isa.empty new Set()                              ), true
      eq ( Ω_intertype_601 = -> isa.empty /d/                                    ), false
      eq ( Ω_intertype_602 = -> isa.empty [ 1, ]                                 ), false
      eq ( Ω_intertype_603 = -> isa.empty 'A'                                    ), false
      eq ( Ω_intertype_604 = -> isa.empty new Set 'abc'                          ), false
      #.......................................................................................................
      eq ( Ω_intertype_605 = -> validate.empty []                                ), []
      eq ( Ω_intertype_606 = -> validate.empty ''                                ), ''
      eq ( Ω_intertype_607 = -> validate.empty new Set()                         ), new Set()
      throws ( Ω_intertype_608 = -> validate.empty [ 1, ]                        ), /expected a empty, got a list/
      throws ( Ω_intertype_609 = -> validate.empty 'A'                           ), /expected a empty, got a text/
      throws ( Ω_intertype_610 = -> validate.empty new Set 'abc'                 ), /expected a empty, got a set/
      #.......................................................................................................
      eq ( Ω_intertype_611 = -> type_of []                                       ), 'list'
      eq ( Ω_intertype_612 = -> type_of ''                                       ), 'text'
      eq ( Ω_intertype_613 = -> type_of new Set()                                ), 'set'
      eq ( Ω_intertype_614 = -> type_of [ 'a', ]                                 ), 'list'
      eq ( Ω_intertype_615 = -> type_of 'a'                                      ), 'text'
      eq ( Ω_intertype_616 = -> type_of new Set 'a'                              ), 'set'
      #.......................................................................................................
      eq ( Ω_intertype_617 = -> type_of 1234                                     ), 'float'
      eq ( Ω_intertype_618 = -> isa.integer 1234                                 ), true
      eq ( Ω_intertype_619 = -> isa.positive.integer 1234                        ), true
      eq ( Ω_intertype_620 = -> isa.negative.integer 1234                        ), false
      eq ( Ω_intertype_621 = -> isa.negative.integer -1234                       ), true
      eq ( Ω_intertype_622 = -> isa.negative.integer -Infinity                   ), false
      eq ( Ω_intertype_623 = -> isa.negative.integer -12.34                      ), false
      #.......................................................................................................
      eq ( Ω_intertype_624 = -> isa.positive.float     +4                        ), true
      eq ( Ω_intertype_625 = -> isa.positive.integer   +4                        ), true
      eq ( Ω_intertype_626 = -> isa.positive.infinity  +4                        ), false
      eq ( Ω_intertype_627 = -> isa.negative.float     +4                        ), false
      eq ( Ω_intertype_628 = -> isa.negative.integer   +4                        ), false
      eq ( Ω_intertype_629 = -> isa.negative.infinity  +4                        ), false
      eq ( Ω_intertype_630 = -> isa.posnaught.float    +4                        ), true
      eq ( Ω_intertype_631 = -> isa.posnaught.integer  +4                        ), true
      eq ( Ω_intertype_632 = -> isa.posnaught.infinity +4                        ), false
      eq ( Ω_intertype_633 = -> isa.negnaught.float    +4                        ), false
      eq ( Ω_intertype_634 = -> isa.negnaught.integer  +4                        ), false
      eq ( Ω_intertype_635 = -> isa.negnaught.infinity +4                        ), false
      #.......................................................................................................
      eq ( Ω_intertype_636 = -> isa.positive.float      0                        ), false
      eq ( Ω_intertype_637 = -> isa.positive.integer    0                        ), false
      eq ( Ω_intertype_638 = -> isa.positive.infinity   0                        ), false
      eq ( Ω_intertype_639 = -> isa.negative.float      0                        ), false
      eq ( Ω_intertype_640 = -> isa.negative.integer    0                        ), false
      eq ( Ω_intertype_641 = -> isa.negative.infinity   0                        ), false
      eq ( Ω_intertype_642 = -> isa.posnaught.float     0                        ), true
      eq ( Ω_intertype_643 = -> isa.posnaught.integer   0                        ), true
      eq ( Ω_intertype_644 = -> isa.posnaught.infinity  0                        ), false
      eq ( Ω_intertype_645 = -> isa.negnaught.float     0                        ), true
      eq ( Ω_intertype_646 = -> isa.negnaught.integer   0                        ), true
      eq ( Ω_intertype_647 = -> isa.negnaught.infinity  0                        ), false
      #.......................................................................................................
      eq ( Ω_intertype_648 = -> isa.positive.float      Infinity                 ), false
      eq ( Ω_intertype_649 = -> isa.positive.integer    Infinity                 ), false
      eq ( Ω_intertype_650 = -> isa.positive.infinity   Infinity                 ), true
      eq ( Ω_intertype_651 = -> isa.negative.float      Infinity                 ), false
      eq ( Ω_intertype_652 = -> isa.negative.integer    Infinity                 ), false
      eq ( Ω_intertype_653 = -> isa.negative.infinity   Infinity                 ), false
      eq ( Ω_intertype_654 = -> isa.posnaught.float     Infinity                 ), false
      eq ( Ω_intertype_655 = -> isa.posnaught.integer   Infinity                 ), false
      eq ( Ω_intertype_656 = -> isa.posnaught.infinity  Infinity                 ), true
      eq ( Ω_intertype_657 = -> isa.negnaught.float     Infinity                 ), false
      eq ( Ω_intertype_658 = -> isa.negnaught.integer   Infinity                 ), false
      eq ( Ω_intertype_659 = -> isa.negnaught.infinity  Infinity                 ), false
      #.......................................................................................................
      eq ( Ω_intertype_660 = -> isa.positive.float      +4.3                     ), true
      eq ( Ω_intertype_661 = -> isa.positive.integer    +4.3                     ), false
      eq ( Ω_intertype_662 = -> isa.positive.infinity   +4.3                     ), false
      eq ( Ω_intertype_663 = -> isa.negative.float      +4.3                     ), false
      eq ( Ω_intertype_664 = -> isa.negative.integer    +4.3                     ), false
      eq ( Ω_intertype_665 = -> isa.negative.infinity   +4.3                     ), false
      eq ( Ω_intertype_666 = -> isa.posnaught.float     +4.3                     ), true
      eq ( Ω_intertype_667 = -> isa.posnaught.integer   +4.3                     ), false
      eq ( Ω_intertype_668 = -> isa.posnaught.infinity  +4.3                     ), false
      eq ( Ω_intertype_669 = -> isa.negnaught.float     +4.3                     ), false
      eq ( Ω_intertype_670 = -> isa.negnaught.integer   +4.3                     ), false
      eq ( Ω_intertype_671 = -> isa.negnaught.infinity  +4.3                     ), false
      #.......................................................................................................
      eq ( Ω_intertype_672 = -> isa.positive.float      -4.3                     ), false
      eq ( Ω_intertype_673 = -> isa.positive.integer    -4.3                     ), false
      eq ( Ω_intertype_674 = -> isa.positive.infinity   -4.3                     ), false
      eq ( Ω_intertype_675 = -> isa.negative.float      -4.3                     ), true
      eq ( Ω_intertype_676 = -> isa.negative.integer    -4.3                     ), false
      eq ( Ω_intertype_677 = -> isa.negative.infinity   -4.3                     ), false
      eq ( Ω_intertype_678 = -> isa.posnaught.float     -4.3                     ), false
      eq ( Ω_intertype_679 = -> isa.posnaught.integer   -4.3                     ), false
      eq ( Ω_intertype_680 = -> isa.posnaught.infinity  -4.3                     ), false
      eq ( Ω_intertype_681 = -> isa.negnaught.float     -4.3                     ), true
      eq ( Ω_intertype_682 = -> isa.negnaught.integer   -4.3                     ), false
      eq ( Ω_intertype_683 = -> isa.negnaught.infinity  -4.3                     ), false
      #.......................................................................................................
      eq ( Ω_intertype_684 = -> isa.posnaught           +Infinity                ), true
      eq ( Ω_intertype_685 = -> isa.negnaught           +Infinity                ), false
      eq ( Ω_intertype_686 = -> isa.posnaught           -Infinity                ), false
      eq ( Ω_intertype_687 = -> isa.negnaught           -Infinity                ), true
      eq ( Ω_intertype_688 = -> isa.posnaught           0                        ), true
      eq ( Ω_intertype_689 = -> isa.negnaught           0                        ), true
      eq ( Ω_intertype_690 = -> isa.posnaught           0                        ), true
      eq ( Ω_intertype_691 = -> isa.negnaught           0                        ), true
      #.......................................................................................................
      eq ( Ω_intertype_692 = -> isa.frozen         Object.freeze {}              ), true
      eq ( Ω_intertype_693 = -> isa.frozen         Object.freeze []              ), true
      eq ( Ω_intertype_694 = -> isa.frozen                       {}              ), false
      eq ( Ω_intertype_695 = -> isa.frozen                       []              ), false
      eq ( Ω_intertype_696 = -> isa.frozen.object  Object.freeze {}              ), true
      eq ( Ω_intertype_697 = -> isa.frozen.list    Object.freeze []              ), true
      eq ( Ω_intertype_698 = -> isa.frozen.object                {}              ), false
      eq ( Ω_intertype_699 = -> isa.frozen.list                  []              ), false
      #.......................................................................................................
      eq ( Ω_intertype_700 = -> isa.odd.integer                  []              ), false
      eq ( Ω_intertype_701 = -> isa.odd.integer                  102.4           ), false
      eq ( Ω_intertype_702 = -> isa.odd.integer                  9997            ), true
      eq ( Ω_intertype_703 = -> isa.odd.integer                  '1024'          ), false
      eq ( Ω_intertype_704 = -> isa.odd.integer                  0               ), false
      eq ( Ω_intertype_705 = -> isa.odd.integer                  1024            ), false
      eq ( Ω_intertype_706 = -> isa.odd.positive.integer         1024            ), false
      eq ( Ω_intertype_707 = -> isa.odd.positive.integer         102.4           ), false
      eq ( Ω_intertype_708 = -> isa.odd.positive.integer         1023            ), true
      eq ( Ω_intertype_709 = -> isa.odd.positive.integer         -1023           ), false
      eq ( Ω_intertype_710 = -> isa.odd.positive.integer         103.4           ), false
      eq ( Ω_intertype_711 = -> isa.even.integer                 []              ), false
      eq ( Ω_intertype_712 = -> isa.even.integer                 102.4           ), false
      eq ( Ω_intertype_713 = -> isa.even.integer                 9997            ), false
      eq ( Ω_intertype_714 = -> isa.even.integer                 '1024'          ), false
      eq ( Ω_intertype_715 = -> isa.even.integer                 0               ), true
      eq ( Ω_intertype_716 = -> isa.even.integer                 1024            ), true
      eq ( Ω_intertype_717 = -> isa.even.positive.integer        1024            ), true
      eq ( Ω_intertype_718 = -> isa.even.positive.integer        0               ), false
      eq ( Ω_intertype_719 = -> isa.even.posnaught.integer       1024            ), true
      eq ( Ω_intertype_720 = -> isa.even.posnaught.integer       0               ), true
      #.......................................................................................................
      eq ( Ω_intertype_721 = -> isa.even.posnaught               0               ), true
      eq ( Ω_intertype_722 = -> isa.even.posnaught               1               ), false
      eq ( Ω_intertype_723 = -> isa.even.posnaught               2               ), true
      #.......................................................................................................
      eq ( Ω_intertype_724 = -> isa.cardinal                     -1024           ), false
      eq ( Ω_intertype_725 = -> isa.cardinal                     10              ), true
      eq ( Ω_intertype_726 = -> isa.cardinal                     123.7           ), false
      eq ( Ω_intertype_727 = -> isa.cardinal                     0               ), true
      eq ( Ω_intertype_728 = -> isa.cardinal                     1               ), true
      eq ( Ω_intertype_729 = -> isa.cardinal                     Infinity        ), false
      eq ( Ω_intertype_730 = -> evaluate.cardinal                Infinity        ), { cardinal: false }
      eq ( Ω_intertype_731 = -> evaluate.posnaught.integer       Infinity        ), { 'posnaught.integer': false }
      #.......................................................................................................
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  disallow_rhs_optional: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      ### TAINT observe the out-comment messages would perhaps make more sense as they are more specific ###
      eq ( Ω_intertype_732 = -> ( new Intertype() ).declare { foo: 'float', } ), null
      eq ( Ω_intertype_733 = -> ( new Intertype() ).declare { foo: 'text',  } ), null
      # ( new Intertype() ).declare { foo: 'optional', }
      throws ( Ω_intertype_734 = -> ( new Intertype() ).declare { foo: 'optional', }        ), /illegal use of 'optional' in declaration of type 'foo'/
      throws ( Ω_intertype_735 = -> ( new Intertype() ).declare { foo: 'qqq', }             ), /unknown type 'qqq'/
      throws ( Ω_intertype_736 = -> ( new Intertype() ).declare { foo: 'optional.float', }  ), /illegal use of 'optional' in declaration of type 'foo'/
      throws ( Ω_intertype_737 = -> ( new Intertype() ).declare { foo: 'anything.float', }  ), /illegal use of basetype 'anything' in declaration of type 'foo'/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  parallel_behavior_of_isa_validate_mandatory_and_optional: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      { isa
        validate  } = new Intertype
          normalfloat: ( ( x ) -> ( @isa.float x ) and ( 0 <= x <= 1 ) )
      eq ( Ω_intertype_738 = -> isa.normalfloat                     0     ), true
      eq ( Ω_intertype_739 = -> isa.normalfloat                     null  ), false
      eq ( Ω_intertype_740 = -> isa.normalfloat                     -1    ), false
      eq ( Ω_intertype_741 = -> isa.normalfloat                     '?'   ), false
      eq ( Ω_intertype_742 = -> isa.optional.normalfloat            0     ), true
      eq ( Ω_intertype_743 = -> isa.optional.normalfloat            null  ), true
      eq ( Ω_intertype_744 = -> isa.optional.normalfloat            -1    ), false
      eq ( Ω_intertype_745 = -> isa.optional.normalfloat            '?'   ), false
      eq ( Ω_intertype_746 = -> validate.normalfloat                0     ), 0
      eq ( Ω_intertype_747 = -> validate.optional.normalfloat       0     ), 0
      eq ( Ω_intertype_748 = -> validate.optional.normalfloat       null  ), null
      throws ( Ω_intertype_749 = -> validate.normalfloat           null ), /expected a normalfloat, got a null/
      throws ( Ω_intertype_750 = -> validate.normalfloat           -1   ), /expected a normalfloat, got a float/
      throws ( Ω_intertype_751 = -> validate.normalfloat           '?'  ), /expected a normalfloat, got a text/
      throws ( Ω_intertype_752 = -> validate.optional.normalfloat  -1   ), /expected an optional normalfloat, got a float/
      throws ( Ω_intertype_753 = -> validate.optional.normalfloat  '?'  ), /expected an optional normalfloat, got a text/
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
      eq ( Ω_intertype_754 = -> isa.quantity            { q: 1, u: 'm', }   ), true
      eq ( Ω_intertype_755 = -> isa.quantity            null                ), false
      eq ( Ω_intertype_756 = -> isa.optional.quantity   { q: 2, u: 'm', }   ), true
      eq ( Ω_intertype_757 = -> isa.optional.quantity   null                ), true
      eq ( Ω_intertype_758 = -> validate.quantity               { q: 3, u: 'm', } ), { q: 3, u: 'm', }
      eq ( Ω_intertype_759 = -> validate.optional.quantity      { q: 4, u: 'm', } ), { q: 4, u: 'm', }
      eq ( Ω_intertype_760 = -> validate.optional.quantity.q    null  ), null
      eq ( Ω_intertype_761 = -> validate.optional.quantity.q    111   ), 111
      eq ( Ω_intertype_762 = -> isa.quantity                     null               ), false
      eq ( Ω_intertype_763 = -> isa.quantity                     -1                 ), false
      eq ( Ω_intertype_764 = -> isa.quantity                     '?'                ), false
      eq ( Ω_intertype_765 = -> isa.quantity.q                   '?'                ), false
      eq ( Ω_intertype_766 = -> isa.quantity.q                   3                  ), true
      eq ( Ω_intertype_767 = -> isa.optional.quantity            { q: 1, u: 'm', }  ), true
      eq ( Ω_intertype_768 = -> isa.optional.quantity            null               ), true
      eq ( Ω_intertype_769 = -> isa.optional.quantity            -1                 ), false
      eq ( Ω_intertype_770 = -> isa.optional.quantity            '?'                ), false
      eq ( Ω_intertype_771 = -> isa.optional.quantity.q          '?'                ), false
      eq ( Ω_intertype_772 = -> isa.optional.quantity.q          3                  ), true
      eq ( Ω_intertype_773 = -> validate.quantity                { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
      eq ( Ω_intertype_774 = -> validate.optional.quantity       { q: 1, u: 'm', }  ), { q: 1, u: 'm', }
      eq ( Ω_intertype_775 = -> validate.optional.quantity       null               ), null
      throws ( Ω_intertype_776 = -> validate.quantity           { q: 5, }  ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
      throws ( Ω_intertype_777 = -> validate.quantity            null      ), /expected a quantity, got a null/
      throws ( Ω_intertype_778 = -> validate.quantity            -1        ), /expected a quantity, got a float/
      throws ( Ω_intertype_779 = -> validate.quantity            '?'       ), /expected a quantity, got a text/
      throws ( Ω_intertype_780 = -> validate.quantity            { q: 1, } ), /expected a quantity, got a object/ ### TAINT message should be more specific ###
      throws ( Ω_intertype_781 = -> validate.optional.quantity   -1        ), /expected an optional quantity, got a float/
      throws ( Ω_intertype_782 = -> validate.optional.quantity   { q: 1, } ), /expected an optional quantity, got a object/ ### TAINT message should be more specific ###
      throws ( Ω_intertype_783 = -> validate.optional.quantity.q { q: 1, } ), /expected an optional quantity.q, got a object/
      throws ( Ω_intertype_784 = -> validate.optional.quantity.q 3, 4, 5   ), /method 'validate.optional.quantity.q' expects 1 arguments, got 3/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  declaration_role_field: ->
    { Intertype } = require '../../../apps/intertype'
    #.........................................................................................................
    do =>
      { declarations  } = new Intertype()
      eq ( Ω_intertype_785 = -> declarations.float.role     ), 'usertype'
      eq ( Ω_intertype_786 = -> declarations.null.role      ), 'basetype'
      eq ( Ω_intertype_787 = -> declarations.anything.role  ), 'basetype'
      eq ( Ω_intertype_788 = -> declarations.unknown.role   ), 'basetype'
      eq ( Ω_intertype_789 = -> declarations.optional.role  ), 'optional'
      # throws T, /expected a normalfloat, got a null/,             -> validate.normalfloat           null
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  minimal_type_of_results: ->
    { Intertype_minimal } = require '../../../apps/intertype'
    { isa
      validate
      create
      declare
      type_of           } = new Intertype_minimal()
    #.........................................................................................................
    do =>
      eq ( Ω_intertype_790 = -> type_of null              ), 'null'
      eq ( Ω_intertype_791 = -> type_of undefined         ), 'undefined'
      eq ( Ω_intertype_792 = -> type_of +Infinity         ), 'unknown'
      eq ( Ω_intertype_793 = -> type_of 4                 ), 'unknown'
      return null
    #.........................................................................................................
    do =>
      eq ( Ω_intertype_794 = -> isa.anything   1          ), true
      eq ( Ω_intertype_795 = -> isa.nothing    1          ), false
      eq ( Ω_intertype_796 = -> isa.something  1          ), true
      eq ( Ω_intertype_797 = -> isa.unknown    1          ), true
      return null
    #.........................................................................................................
    do =>
      eq ( Ω_intertype_798 = -> isa.anything   null       ), true
      eq ( Ω_intertype_799 = -> isa.nothing    null       ), true
      eq ( Ω_intertype_800 = -> isa.something  null       ), false
      eq ( Ω_intertype_801 = -> isa.unknown    null       ), false
      return null
    #.........................................................................................................
    do =>
      eq ( Ω_intertype_802 = -> isa.anything   undefined  ), true
      eq ( Ω_intertype_803 = -> isa.nothing    undefined  ), true
      eq ( Ω_intertype_804 = -> isa.something  undefined  ), false
      eq ( Ω_intertype_805 = -> isa.unknown    undefined  ), false
      return null
    #.........................................................................................................
    do =>
      throws ( Ω_intertype_806 = -> isa.optional 1      ), /`optional` is not a legal type for `isa` methods/
      throws ( Ω_intertype_807 = -> validate.optional 1 ), /`optional` is not a legal type for `validate` methods/
      throws ( Ω_intertype_808 = -> create.optional 1   ), /`optional` is not a legal type for `create` methods/
      return null
    #.........................................................................................................
    return null

  #-----------------------------------------------------------------------------------------------------------
  can_use_null_and_undefined_in_record_create_methods: ->
    { Intertype, } = require '../../../apps/intertype'
    types = new Intertype()
    types.declare
      foobar:
        fields:
          foo:    'integer'
          bar:    'integer'
        template:
          foo:    4
          bar:    5
    eq ( Ω_intertype_809 = -> types.create.foobar { foo: 8, bar: 9, } ), { foo: 8, bar: 9, }
    eq ( Ω_intertype_810 = -> types.create.foobar { foo: 8,         } ), { foo: 8, bar: 5, }
    eq ( Ω_intertype_811 = -> types.create.foobar { foo: 4, bar: 5, } ), { foo: 4, bar: 5, }
    eq ( Ω_intertype_812 = -> types.create.foobar {                 } ), { foo: 4, bar: 5, }
    eq ( Ω_intertype_813 = -> types.create.foobar undefined           ), { foo: 4, bar: 5, }
    eq ( Ω_intertype_814 = -> types.create.foobar null                ), { foo: 4, bar: 5, }
    return null


#===========================================================================================================
if module is require.main then await do =>
  # @use_fields_to_declare_qualifiers()
  # test @use_fields_to_declare_qualifiers
  await async_test tasks


