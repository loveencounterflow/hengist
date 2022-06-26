
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
GUY                       = require 'guy'


#-----------------------------------------------------------------------------------------------------------
@[ "isa" ] = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  types.declare 'null',                             test: ( x ) -> x is null
  types.declare 'array',    isa_collection: true,   test: ( x ) -> Array.isArray x
  types.declare 'list',     isa_collection: true,   test: ( x ) -> @isa 'array', x
  types.declare 'integer',  isa_numeric: true,      test: ( x ) -> Number.isInteger x
  types.declare 'text',     isa_collection: true,   test: ( x ) -> ( jto x ) is 'string'
  #.........................................................................................................
  T?.eq ( types.isa 'null',                         null          ), true
  T?.eq ( types.isa 'optional', 'null',             null          ), true
  T?.eq ( types.isa 'optional', 'null',             undefined     ), true
  T?.eq ( types.isa 'null',                         undefined     ), false
  T?.eq ( types.isa 'array',                        []            ), true
  T?.eq ( types.isa 'list',                         []            ), true
  T?.eq ( types.isa 'empty', 'array',               []            ), true
  T?.eq ( types.isa 'optional', 'empty', 'array',   []            ), true
  T?.eq ( types.isa 'optional', 'empty', 'array',   null          ), true
  T?.eq ( types.isa 'optional', 'empty', 'array',   42            ), false
  T?.eq ( types.isa 'optional', 'empty', 'array',   [ 42, ]       ), false
  #.........................................................................................................
  T?.throws /'optional' cannot be a hedge in declarations/, => types.declare 'optional', 'integer', test: ->
  # for type, declaration of types._types
  #   debug '^34234^', type, declaration
  # H.tabulate 'types._types', ( -> yield type for _, type of types._types )()
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  # types.declare 'null',                           test: ( x ) -> x is null
  # types.declare 'list',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'list'
  # ### @isa 'empty', 'isa_collection', x ###
  # # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
  # types.declare 'list',                           test: ( x ) -> @isa 'array', x
  # types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
  debug '^5345-1^', k for k of types.isa
  debug '^5345-2^', types.isa
  debug '^5345-3^', types.isa.empty
  debug '^5345-4^', types.isa.empty.text ''
  debug '^5345-5^', types.isa.empty.text 'x'
  debug '^5345-6^', types.isa.nonempty.text ''
  debug '^5345-7^', types.isa.nonempty.text 'x'
  debug '^5345-8^', types.isa.empty.text 42
  debug '^5345-9^', types.isa.list_of.text 42
  debug '^5345-10^', types.isa.empty.list_of.text 42
  debug '^5345-11^', types.isa.empty.list_of.text []
  debug '^5345-12^', types.isa.optional.empty.text 42
  debug '^5345-13^', types.isa.optional.empty.text null
  # debug '^5345^', types.isa.optional
  # debug '^5345^', types.isa.optional.empty
  # debug '^5345^', types.isa.optional.empty.list_of
  # debug '^5345^', types.isa.optional.empty.list_of.text
  process.exit 111
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
demo_test_with_protocol = ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare 'integer', isa_numeric: true, test: ( x ) -> urge '^342-1^', rpr x; Number.isInteger x
  info '^342-2^', types.isa.integer                     42
  info '^342-2^', types.isa.optional.integer            42
  info '^342-2^', types.isa.optional.positive0.integer  42
  info '^342-2^', types.isa.integer                     42.1
  info '^342-2^', types.isa.optional.integer            42.1
  info '^342-2^', types.isa.optional.positive0.integer  42.1
  info '^342-2^', types.isa.integer                     null
  info '^342-2^', types.isa.optional.integer            null
  info '^342-2^', types.isa.optional.positive0.integer  null
  info '^342-2^', types.isa.list_of.integer             null
  info '^342-2^', types.isa.list_of.integer             []
  info '^342-2^', types.isa.list_of.integer             [ 1, 2, 3, ]
  info '^342-2^', types.isa.list_of.integer             [ 1, 2, 3.5, ]
  info '^342-2^', types.isa.list_of.optional.integer    [ 1, 2, null, ]
  info '^342-2^', types.isa.list_of.optional.integer    [ 1, 2, 3.5, ]
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_hedges = ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  do =>
    count         = 0
    type          = 'integer'
    type_cfg      = new Type_cfg { isa_numeric: true, }
    urge '^234^', type, type_cfg
    for hedgepath from types._walk_hedgepaths type_cfg
      count++
      info '^2434^', count, ( hedgepath.join ' ' ) + ' ' + type
  do =>
    count         = 0
    type          = 'text'
    type_cfg      = new Type_cfg { isa_collection: true, }
    urge '^234^', type, type_cfg
    for hedgepath from types._walk_hedgepaths type_cfg
      count++
      info '^2434^', count, ( hedgepath.join ' ' ) + ' ' + type
  return null

#-----------------------------------------------------------------------------------------------------------
demo_multipart_hedges = ->
  hedge =
    terms:
      optional_prefixes:  [ 'empty', 'nonempty', ]
      mandatory_kernels:  [ 'list_of', 'set_of', ]
      optional_suffixes:  [ 'optional', ]
    match: { all: true, }
  #.........................................................................................................
  chains = []
  for prefix_idx in [ -1 ... hedge.terms.optional_prefixes.length ]
    if ( prefix = hedge.terms.optional_prefixes[ prefix_idx ] ? null )?
      chain = [ prefix ]
    else
      chain = []
    for kernel in hedge.terms.mandatory_kernels
      chains.push [ chain..., kernel, ]
  for suffix_idx in [ -1 ... hedge.terms.mandatory_kernels.length ]
    if ( suffix_idx = hedge.terms.optional_suffixes[ suffix_idx ] )?
      chains.push
  #.........................................................................................................
  debug '^509^', chain for chain in chains
  return null

#-----------------------------------------------------------------------------------------------------------
demo_combinate = ->
  combinate = ( require "combinate" ).default
  values =
    optional:     [ null, 'optional', ]
    collections:
      prefix:     [ null, 'empty', 'nonempty', ]
      kernel:     [ 'list_of', 'set_of', ]
      suffix:     [ null, 'optional', ]
    empty: [ null, 'empty', 'nonempty', ]
  # combine = ( terms ) => ( ( v for _, v of x when v? ) for x in combinate terms )
  combine = ( terms ) => ( ( v for _, v of x         ) for x in combinate terms )
    # combinations[ idx ] = ( e for e in x when e? ) for x, idx in combinations
  compile_hedges = ( hedges ) ->
    R = { hedges..., }
    for k, v of R
      continue if Array.isArray v
      R[ k ] = combine v
    return R
  get_hedgepaths = ( compiled_hedges ) ->
    R = ( x.flat() for x in combine compiled_hedges )
    return ( ( v for v in x when v? ) for x in R )
  compiled_hedges = compile_hedges values
  combinations    = get_hedgepaths compiled_hedges
  combinations.unshift [ null, null, null, null, null ]
  # combinations.sort()
  H.tabulate 'combinate', combinations
  return null

#-----------------------------------------------------------------------------------------------------------
demo_combinate_2 = ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  combinate     = ( require "combinate" ).default
  #.........................................................................................................
  hedges = GUY.lft.freeze [
    { terms: [ null, 'optional', ],                                         match: { all: true, }, }
    { terms: [
      null,
      [ [ null, 'empty', 'nonempty', ]
        [ 'list_of', 'set_of', ]
        [ null, 'optional', ]
        ], ],                                                               match: { all: true, }, }
    { terms: [ null, 'empty', 'nonempty', ],                                match: { isa_collection: true, }, }
    { terms: [ null, 'positive0', 'positive1', 'negative0', 'negative1', ], match: { isa_numeric: true, }, }
    ]
  #.........................................................................................................
  combine = ( terms ) => ( ( v for _, v of x ) for x in combinate terms )
  types._compile_hedges = ( hedges, type_cfg ) ->
    R = []
    for hedge in hedges
      continue unless @_match_hedge_and_type_cfg hedge, type_cfg
      # termses = [ hedge.terms..., ]
      target = []
      R.push target
      for termgroup in hedge.terms
        if Array.isArray termgroup
          target.splice target.length - 1, 0, ( @get_hedgepaths termgroup )...
        else
          target.push termgroup
    return R
  types.get_hedgepaths = ( compiled_hedges ) ->
    R = ( x.flat() for x in combine compiled_hedges )
    return R
  types._reduce_hedgepaths = ( combinations ) -> ( ( e for e in hp when e? ) for hp in combinations )
  #.........................................................................................................
  combinations    = types.get_hedgepaths hedges[ 1 ].terms[ 1 ]
  # combinations    = types.get_hedgepaths types._compile_hedges hedges, {}
  # combinations    = types.get_hedgepaths types._compile_hedges hedges, { isa_collection: true, }
  combinations    = types.get_hedgepaths types._compile_hedges hedges, { isa_numeric: true, }
  info '^540^', combinations
  combinations.sort()
  combinations    = types._reduce_hedgepaths combinations
  combinations.unshift [ null, null, null, null, null, null, null ]
  H.tabulate 'combinate', combinations
  return null


#-----------------------------------------------------------------------------------------------------------
demo_intertype_hedge_combinator = ->
#-----------------------------------------------------------------------------------------------------------
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  # debug '^33545^', types._hedges.groupnames
  hedges = types._hedges.constructor.hedges
  for groupname from types._hedges._get_groupnames()
    compiled_hedges = types._hedges._compile_hedges groupname, hedges
    hedgepaths      = types._hedges.get_hedgepaths compiled_hedges
    # info '^540^', hedgepaths
    hedgepaths.sort()
    hedgepaths      = types._hedges._reduce_hedgepaths hedgepaths
    hedgepaths.unshift [ null, null, null, null, null, null, null ]
    H.tabulate "hedgepaths for group #{rpr groupname}", hedgepaths







############################################################################################################
unless module.parent?
  # demo()
  # demo_hedges()
  # demo_test_with_protocol()
  # demo_multipart_hedges()
  # demo_combinate_2()
  demo_intertype_hedge_combinator()
  # test @








