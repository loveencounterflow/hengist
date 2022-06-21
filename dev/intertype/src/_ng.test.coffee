
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'INTERTYPE/tests/basics'
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
# { intersection_of }       = require '../../../apps/intertype/lib/helpers'
H                         = require '../../../lib/helpers'



#-----------------------------------------------------------------------------------------------------------
@[ "isa" ] = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  types.declare 'null',                           test: ( x ) -> x is null
  types.declare 'array',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'array'
  ### @isa 'empty', 'isa_collection', x ###
  # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
  types.declare 'list',                           test: ( x ) -> @isa 'array', x
  types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
  #.........................................................................................................
  T?.eq ( types.isa 'null',                         null          ), true
  T?.eq ( types.isa 'optional', 'null',             null          ), true
  T?.eq ( types.isa 'optional', 'null',             undefined     ), true
  T?.eq ( types.isa 'null',                         undefined     ), false
  T?.eq ( types.isa 'array',                        []            ), true
  T?.eq ( types.isa 'list',                         []            ), true
  T?.eq ( types.isa 'empty', 'array',               []            ), true
  T?.eq ( types.isa 'optional', 'empty', 'array',   []            ), true
  #.........................................................................................................
  T?.throws /'optional' cannot be a hedge in declarations/, => types.declare 'optional', 'integer', test: ->
  # for type, declaration of types._types
  #   debug '^34234^', type, declaration
  H.tabulate 'types._types', ( -> yield type for _, type of types._types )()
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  types.declare 'null',                           test: ( x ) -> x is null
  types.declare 'array',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'array'
  ### @isa 'empty', 'isa_collection', x ###
  # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
  types.declare 'list',                           test: ( x ) -> @isa 'array', x
  types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
  #.........................................................................................................
  info '^509-1', types.isa 'null',                         null
  info '^509-2', types.isa 'optional', 'null',             null
  info '^509-3', types.isa 'optional', 'null',             undefined
  info '^509-4', types.isa 'null',                         undefined
  info '^509-5', types.isa 'array',                        []
  info '^509-6', types.isa 'list',                         []
  info '^509-7', types.isa 'empty', 'array',               []
  info '^509-8', types.isa 'optional', 'empty', 'array',   []
  #.........................................................................................................
  try ( types.declare 'optional', 'integer', test: -> ) catch error
    warn '^509-9^', CND.reverse error.message
  H.tabulate 'types._types', ( -> yield type for _, type of types._types )()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_hedges = ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  type          = 'integer'
  type_cfg      = new Type_cfg { isa_numeric: true, }
  debug '^234^', type_cfg
  for hedgepath from types._XXX_walk_permutations type_cfg
    debug '^2434^', hedgepath # + ' ' + 'text'
  return null







############################################################################################################
unless module.parent?
  demo()
  demo_hedges()
  # test @








