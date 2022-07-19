
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
GUY                       = require '../../../apps/guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'INTERTYPE/tests'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
# { intersection_of }       = require '../../../apps/intertype/lib/helpers'
H                         = require '../../../lib/helpers'
equals                    = require '../../../apps/intertype/deps/jkroso-equals'
S                         = ( parts ) -> new Set eval parts.raw[ 0 ]
{ to_width }              = require 'to-width'
_types                    = new ( require 'intertype' ).Intertype()


#-----------------------------------------------------------------------------------------------------------
@[ "isa" ] = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  # jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  types.declare 'null',                             test: ( x ) -> x is null
  types.declare 'array',    isa_collection: true,   test: ( x ) -> Array.isArray x
  types.declare 'list',     isa_collection: true,   test: ( x ) -> @_isa 'array', x
  types.declare 'integer',  isa_numeric: true,      test: ( x ) -> Number.isInteger x
  # types.declare 'text',     isa_collection: true,   test: ( x ) -> ( jto x ) is 'string'
  #.........................................................................................................
  T?.eq ( types._isa 'null',                         null          ), true
  T?.eq ( types._isa 'optional', 'null',             null          ), true
  T?.eq ( types._isa 'optional', 'null',             undefined     ), true
  T?.eq ( types._isa 'null',                         undefined     ), false
  T?.eq ( types._isa 'array',                        []            ), true
  T?.eq ( types._isa 'list',                         []            ), true
  T?.eq ( types._isa 'empty', 'array',               []            ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   []            ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   null          ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   42            ), false
  T?.eq ( types._isa 'optional', 'empty', 'array',   [ 42, ]       ), false
  #.........................................................................................................
  # T?.throws /'optional' cannot be a hedge in declarations/, => types.declare 'optional', 'integer', test: ->
  # for type, declaration of types._types
  #   debug '^34234^', type, declaration
  # H.tabulate 'types._types', ( -> yield type for _, type of types._types )()
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "forbidden to overwrite declarations" ] = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  T?.eq ( GUY.props.has types.isa, 'weirdo' ), false
  types.declare 'weirdo', test: ( x ) -> x is weirdo
  T?.eq ( GUY.props.has types.isa, 'weirdo' ), true
  debug '^353^', GUY.props.has types.isa, 'weirdo'
  T?.throws /Strict_owner instance already has property 'weirdo'/, => types.declare 'weirdo', test: ( x ) -> x is weirdo
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  # types.declare 'null',               groups: 'other',            test: ( x ) -> x is null
  types.declare 'text',               groups: 'collection',            test: ( x ) -> typeof x is 'string'
  debug '^5345-1^', types
  debug '^5345-2^', types.isa
  debug '^5345-3^', types.isa.collection
  debug '^5345-4^', types.type_of 'x'
  debug '^5345-5^', types.isa.collection 'x'
  debug '^5345-6^', ( k for k of types.isa )
  # types.declare 'list',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'list'
  # ### @isa 'empty', 'isa_collection', x ###
  # # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
  # types.declare 'list',                           test: ( x ) -> @isa 'array', x
  # types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
  debug '^5345-7^', k for k of types.isa
  # debug '^5345-8^', types._isa 'empty'
  debug '^5345-9^', types._isa
  debug '^5345-10^', types._isa 'text', ''
  debug '^5345-11^', types._isa 'text', 'xxx'
  debug '^5345-12^', types._isa 'empty', 'text', ''
  debug '^5345-13^', types.isa.text 'x'
  debug '^5345-14^', types.isa.nonempty.text 'x'
  debug '^5345-15^', types._isa 'nonempty', 'text', 'x'
  debug '^5345-16^', types._isa 'empty', 'set_of', 'text', new Set()
  debug '^5345-17^', types.isa.empty.set_of.text new Set()
  debug '^5345-18^', types.isa.list_of.text []
  debug '^5345-19^', types.isa.list_of.text [ 'x', '', ]
  debug '^5345-20^', types.isa.list_of.nonempty.text [ 'x', ]
  debug '^5345-21^', types.isa.list_of.empty.text [ '', ]
  debug '^5345-22^', types.isa.optional.text ''
  debug '^5345-23^', types.isa.optional.text null
  debug '^5345-24^', types.isa.optional.list_of.text null
  debug '^5345-25^', types.isa.optional.list_of.optional.text null
  debug '^5345-26^', types.isa.optional.list_of.optional.nonempty.text null
  debug '^5345-27^', types.isa.optional.nonempty.list_of.optional.nonempty.text null
  info CND.reverse '        '
  debug '^5345-28^', types._isa 'nonempty', 'text', ''
  debug '^5345-29^', types._isa 'text', 42
  debug '^5345-30^', types._isa 'empty', 'text', 'xxx'
  debug '^5345-31^', types._isa 'empty', 'text', 42
  debug '^5345-32^', types.isa.empty.text 'x'
  debug '^5345-33^', types.isa.nonempty.text ''
  debug '^5345-34^', types.isa.empty.text 42
  debug '^5345-35^', types.isa.list_of.text 'x'
  debug '^5345-36^', types.isa.list_of.text [ 'x', 42, ]
  debug '^5345-37^', types.isa.list_of.nonempty.text [ '', 'x' ]
  debug '^5345-38^', types.isa.list_of.empty.text [ 'x', '', ]
  # debug '^5345-39^', types.isa.list_of.text 42
  # debug '^5345-40^', types.isa.list_of.text []
  # debug '^5345-41^', types.isa.list_of.text [ 'a', 'b', ]
  # debug '^5345-42^', types.isa.nonempty.list_of.text [ 'a', 'b', ]
  # debug '^5345-43^', types.isa.nonempty.list_of.nonempty.text [ 'a', 'b', ]
  # debug '^5345-44^', types.isa.empty.list_of.text 42
  # debug '^5345-45^', types.isa.empty.list_of.text []
  # debug '^5345-46^', types.isa.optional.empty.text 42
  # debug '^5345-47^', types.isa.optional.empty.text null
  # debug '^5345-48^', types.isa.optional
  # debug '^5345-49^', types.isa.optional.empty
  # debug '^5345-50^', types.isa.optional.empty.list_of
  # debug '^5345-51^', types.isa.optional.empty.list_of.text
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
@[ "intertype hedgepaths" ] = ( T, done ) ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types       = new Intertype()
    hedgepaths  = types._hedges.hedgepaths
    groupname   = 'other'
    H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths[ groupname ]..., ]
    T?.eq hedgepaths[ groupname ], [ [], [ 'list_of' ], [ 'list_of', 'optional' ], [ 'set_of' ], [ 'set_of', 'optional' ], [ 'empty', 'list_of' ], [ 'empty', 'list_of', 'optional' ], [ 'empty', 'set_of' ], [ 'empty', 'set_of', 'optional' ], [ 'nonempty', 'list_of' ], [ 'nonempty', 'list_of', 'optional' ], [ 'nonempty', 'set_of' ], [ 'nonempty', 'set_of', 'optional' ], [ 'optional' ], [ 'optional', 'list_of' ], [ 'optional', 'list_of', 'optional' ], [ 'optional', 'set_of' ], [ 'optional', 'set_of', 'optional' ], [ 'optional', 'empty', 'list_of' ], [ 'optional', 'empty', 'list_of', 'optional' ], [ 'optional', 'empty', 'set_of' ], [ 'optional', 'empty', 'set_of', 'optional' ], [ 'optional', 'nonempty', 'list_of' ], [ 'optional', 'nonempty', 'list_of', 'optional' ], [ 'optional', 'nonempty', 'set_of' ], [ 'optional', 'nonempty', 'set_of', 'optional' ] ]
    #.......................................................................................................
    typenames =
      other:        'boolean'
      collections:  'set'
      numbers:      'integer'
    for groupname, hedgepaths of types._hedges.hedgepaths
      info groupname
      typename = typenames[ groupname ]
      for hedgepath in hedgepaths
        urge [ hedgepath..., typename ].join '.'
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "intertype size_of" ] = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  probes_and_matchers = [
    [ [ [],           ], 0, ]
    [ [ [ 1, 2, 3, ], ], 3, ]
    [ [ null,         ], null, 'expected an object with `x.length` or `x.size`, got a null' ]
    [ [ 42,           ], null, 'expected an object with `x.length` or `x.size`, got a float' ]
    [ [ 42, null,     ], null, ]
    [ [ 42, 0,        ], 0, ]
    [ [ S"",          ], 0, ]
    [ [ S"'abc𪜁'",    ], 4, ]
    [ [ '',           ], 0, ]
    [ [ '', null,     ], 0, ]
    [ [ 'helo',       ], 4, ]
    [ [ 'helo', null, ], 4, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve result = types.size_of probe...
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "intertype quantified types" ] = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  types.declare 'anything',  test: ( x ) -> true
  types.declare 'something', test: ( x ) -> x?
  types.declare 'nothing',   test: ( x ) -> not x?
  probes_and_matchers = [
    [ [ 'isa',  'anything',   null, ], true,  ]
    [ [ 'isa',  'nothing',    null, ], true,  ]
    [ [ 'isnt', 'something',  null, ], true,  ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ mode, type, value, ] = probe
      switch mode
        when 'isa'  then result =     types.isa[ type ] value
        when 'isnt' then result = not types.isa[ type ] value
        else throw new Error "unknown mode #{rpr mode}"
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "intertype all hedgepaths" ] = ( T, done ) ->
  # T?.halt_on_error true
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa       } = types
  declare 'boolean',  groups: 'other',        test: ( x ) ->  ( x is true ) or ( x is false )
  declare 'integer',  groups: 'number',       test: ( x ) -> Number.isInteger x
  declare 'set',      groups: 'collection',   test: ( x ) -> x instanceof Set
  #.........................................................................................................
  probes_and_matchers = [
    ### other ###
    [ 'isa.boolean',                                   (   true                                             ), true, ]
    [ 'isa.list_of.boolean',                           (   [ true, ]                                        ), true, ]
    [ 'isa.list_of.boolean',                           (   []                                               ), true, ]
    [ 'isa.list_of.optional.boolean',                  ( []                                                 ), true, ]
    [ 'isa.list_of.optional.boolean',                  ( [ null, ]                                          ), true, ]
    [ 'isa.list_of.optional.boolean',                  ( [ null, true, ]                                    ), true, ]
    [ 'isa.set_of.boolean',                            ( S"[]"                                              ), true, ]
    [ 'isa.set_of.boolean',                            ( S"[ false, ]"                                      ), true, ]
    [ 'isa.set_of.optional.boolean',                   ( S"[]"                                              ), true, ]
    [ 'isa.set_of.optional.boolean',                   ( S"[ null, ]"                                       ), true, ]
    [ 'isa.set_of.optional.boolean',                   ( S"[ null, false, ]"                                ), true, ]
    [ 'isa.empty.list_of.boolean',                     ( []                                                 ), true, ]
    [ 'isa.empty.list_of.optional.boolean',            ( []                                                 ), true, ]
    [ 'isa.empty.set_of.boolean',                      ( S""                                                ), true, ]
    [ 'isa.empty.set_of.optional.boolean',             ( S""                                                ), true, ]
    [ 'isa.nonempty.list_of.boolean',                  ( [ true, ]                                          ), true, ]
    [ 'isa.nonempty.list_of.optional.boolean',         ( [ true, null, ]                                    ), true, ]
    [ 'isa.nonempty.set_of.boolean',                   ( S"[ true, false, ]"                                ), true, ]
    [ 'isa.nonempty.set_of.optional.boolean',          ( S"[ null, null, ]"                                 ), true, ]
    [ 'isa.optional.boolean',                          ( true                                               ), true, ]
    [ 'isa.optional.boolean',                          ( false                                              ), true, ]
    [ 'isa.optional.boolean',                          ( null                                               ), true, ]
    [ 'isa.optional.list_of.boolean',                  ( null                                               ), true, ]
    [ 'isa.optional.list_of.boolean',                  ( []                                                 ), true, ]
    [ 'isa.optional.list_of.boolean',                  ( [ true, ]                                          ), true, ]
    [ 'isa.optional.list_of.optional.boolean',         ( null                                               ), true, ]
    [ 'isa.optional.list_of.optional.boolean',         ( []                                                 ), true, ]
    [ 'isa.optional.list_of.optional.boolean',         ( [ true, ]                                          ), true, ]
    [ 'isa.optional.list_of.optional.boolean',         ( [ true, null, ]                                    ), true, ]
    [ 'isa.optional.set_of.boolean',                   ( null                                               ), true, ]
    [ 'isa.optional.set_of.boolean',                   ( S""                                                ), true, ]
    [ 'isa.optional.set_of.boolean',                   ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.set_of.optional.boolean',          ( null                                               ), true, ]
    [ 'isa.optional.set_of.optional.boolean',          ( S""                                                ), true, ]
    [ 'isa.optional.set_of.optional.boolean',          ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.set_of.optional.boolean',          ( S"[ null, ]"                                       ), true, ]
    [ 'isa.optional.empty.list_of.boolean',            ( null                                               ), true, ]
    [ 'isa.optional.empty.list_of.boolean',            ( []                                                 ), true, ]
    [ 'isa.optional.empty.list_of.optional.boolean',   ( null                                               ), true, ]
    [ 'isa.optional.empty.list_of.optional.boolean',   ( []                                                 ), true, ]
    [ 'isa.optional.empty.set_of.boolean',             ( null                                               ), true, ]
    [ 'isa.optional.empty.set_of.boolean',             ( S""                                                ), true, ]
    [ 'isa.optional.empty.set_of.optional.boolean',    ( null                                               ), true, ]
    [ 'isa.optional.empty.set_of.optional.boolean',    ( S""                                                ), true, ]
    [ 'isa.optional.nonempty.list_of.boolean',         ( null                                               ), true, ]
    [ 'isa.optional.nonempty.list_of.boolean',         ( [ true, ]                                          ), true, ]
    [ 'isa.optional.nonempty.list_of.boolean',         ( [ false, ]                                         ), true, ]
    [ 'isa.optional.nonempty.list_of.optional.boolean',( null                                               ), true, ]
    [ 'isa.optional.nonempty.list_of.optional.boolean',( [ true, ]                                          ), true, ]
    [ 'isa.optional.nonempty.list_of.optional.boolean',( [ null, null, ]                                    ), true, ]
    [ 'isa.optional.nonempty.set_of.boolean',          ( null                                               ), true, ]
    [ 'isa.optional.nonempty.set_of.boolean',          ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.nonempty.set_of.optional.boolean', ( null                                               ), true, ]
    [ 'isa.optional.nonempty.set_of.optional.boolean', ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.nonempty.set_of.optional.boolean', ( S"[ false, null, ]"                                ), true, ]
  #.........................................................................................................
  ### collections ###
    [ 'isa.set',                                              ( S""                                         ), true, ]
    [ 'isa.empty.set',                                        ( S""                                         ), true, ]
    [ 'isa.list_of.set',                                      ( []                                          ), true, ]
    [ 'isa.list_of.set',                                      ( [ S"", ]                                    ), true, ]
    [ 'isa.list_of.empty.set',                                ( [ S"", ]                                    ), true, ]
    [ 'isa.list_of.nonempty.set',                             ( [ S"[42]", S"'x'", ]                        ), true, ]
    [ 'isa.list_of.optional.set',                             ( []                                          ), true, ]
    [ 'isa.list_of.optional.set',                             ( [ S"" ]                                     ), true, ]
    [ 'isa.list_of.optional.empty.set',                       ( []                                          ), true, ]
    [ 'isa.list_of.optional.nonempty.set',                    ( []                                          ), true, ]
    [ 'isa.list_of.optional.nonempty.set',                    ( [ null, S"'x'", ]                           ), true, ]
    [ 'isa.list_of.optional.nonempty.set',                    ( [ S"'x'", S"'abc𪜁'", ]                      ), true, ]
    [ 'isa.nonempty.set',                                     ( S"'abc𪜁'"                                   ), true, ]
    [ 'isa.set_of.set',                                       ( S"[new Set()]"                              ), true, ]
    [ 'isa.set_of.empty.set',                                 ( S"[]"                                       ), true, ]
    [ 'isa.set_of.empty.set',                                 ( S"[new Set()]"                              ), true, ]
    [ 'isa.set_of.nonempty.set',                              ( S"[]"                                       ), true, ]
    [ 'isa.set_of.nonempty.set',                              ( S"[new Set('a')]"                           ), true, ]
    [ 'isa.set_of.optional.set',                              ( S""                                         ), true, ]
    [ 'isa.set_of.optional.set',                              ( S"null"                                     ), true, ]
    [ 'isa.set_of.optional.set',                              ( S"[null,new Set()]"                         ), true, ]
    [ 'isa.set_of.optional.empty.set',                        ( S""                                         ), true, ]
    [ 'isa.set_of.optional.empty.set',                        ( S"null"                                     ), true, ]
    [ 'isa.set_of.optional.empty.set',                        ( S"[new Set()]"                              ), true, ]
    [ 'isa.set_of.optional.nonempty.set',                     ( S""                                         ), true, ]
    [ 'isa.set_of.optional.nonempty.set',                     ( S"null"                                     ), true, ]
    [ 'isa.set_of.optional.nonempty.set',                     ( S"[new Set('a')]"                           ), true, ]
    [ 'isa.empty.list_of.set',                                ( []                                          ), true, ]
    [ 'isa.empty.list_of.empty.set',                          ( []                                          ), true, ]
    [ 'isa.empty.list_of.nonempty.set',                       ( []                                          ), true, ]
    [ 'isa.empty.list_of.optional.set',                       ( []                                          ), true, ]
    [ 'isa.empty.list_of.optional.empty.set',                 ( []                                          ), true, ]
    [ 'isa.empty.list_of.optional.nonempty.set',              ( []                                          ), true, ]
    [ 'isa.empty.set_of.set',                                 ( S""                                         ), true, ]
    [ 'isa.empty.set_of.empty.set',                           ( S""                                         ), true, ]
    [ 'isa.empty.set_of.nonempty.set',                        ( S""                                         ), true, ]
    [ 'isa.empty.set_of.optional.set',                        ( S""                                         ), true, ]
    [ 'isa.empty.set_of.optional.empty.set',                  ( S""                                         ), true, ]
    [ 'isa.empty.set_of.optional.nonempty.set',               ( S""                                         ), true, ]
    [ 'isa.nonempty.list_of.set',                             ( [ S"", ]                                    ), true, ]
    [ 'isa.nonempty.list_of.set',                             ( [ S"'x'", ]                                 ), true, ]
    [ 'isa.nonempty.list_of.empty.set',                       ( [ S"", S"", ]                               ), true, ]
    [ 'isa.nonempty.list_of.nonempty.set',                    ( [ S"[1]", S"[2]", ]                         ), true, ]
    [ 'isa.nonempty.list_of.optional.set',                    ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list_of.optional.set',                    ( [ null, S"'abc'", ]                         ), true, ]
    [ 'isa.nonempty.list_of.optional.empty.set',              ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list_of.optional.empty.set',              ( [ null, S"", ]                              ), true, ]
    [ 'isa.nonempty.list_of.optional.nonempty.set',           ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list_of.optional.nonempty.set',           ( [ null, S"'abc'" ]                          ), true, ]
    [ 'isa.nonempty.set_of.set',                              ( S"[new Set()]"                              ), true, ]
    [ 'isa.nonempty.set_of.empty.set',                        ( S"[new Set()]"                              ), true, ]
    [ 'isa.nonempty.set_of.nonempty.set',                     ( S"[new Set('abc')]"                         ), true, ]
    [ 'isa.nonempty.set_of.optional.set',                     ( S"[null]"                                   ), true, ]
    [ 'isa.nonempty.set_of.optional.set',                     ( S"[null, new Set('a')]"                     ), true, ]
    [ 'isa.nonempty.set_of.optional.empty.set',               ( S"[new Set(), null,]"                       ), true, ]
    [ 'isa.nonempty.set_of.optional.nonempty.set',            ( S"[null,new Set('abc')]"                    ), true, ]
    [ 'isa.optional.set',                                     ( null                                      ), true, ]
    [ 'isa.optional.set',                                     ( S""                                      ), true, ]
    [ 'isa.optional.empty.set',                               ( null                                      ), true, ]
    [ 'isa.optional.empty.set',                               ( S""                                      ), true, ]
    [ 'isa.optional.list_of.set',                             ( null                                      ), true, ]
    [ 'isa.optional.list_of.set',                             ( []                                      ), true, ]
    [ 'isa.optional.list_of.set',                             ( [ S"", ]                                      ), true, ]
    [ 'isa.optional.list_of.empty.set',                       ( null                                      ), true, ]
    [ 'isa.optional.list_of.empty.set',                       ( []                                      ), true, ]
    [ 'isa.optional.list_of.empty.set',                       ( [ S"", ]                                      ), true, ]
    [ 'isa.optional.list_of.nonempty.set',                    ( null                                      ), true, ]
    [ 'isa.optional.list_of.nonempty.set',                    ( [ S"'xxx'", ]                                      ), true, ]
    [ 'isa.optional.list_of.optional.set',                    ( null                                      ), true, ]
    [ 'isa.optional.list_of.optional.set',                    ( []                                      ), true, ]
    [ 'isa.optional.list_of.optional.set',                    ( [ null, ]                                      ), true, ]
    [ 'isa.optional.list_of.optional.set',                    ( [ null, S"", ]                                      ), true, ]
    [ 'isa.optional.list_of.optional.empty.set',              ( null                                      ), true, ]
    [ 'isa.optional.list_of.optional.empty.set',              ( []                                      ), true, ]
    [ 'isa.optional.list_of.optional.empty.set',              ( [ null, ]                                      ), true, ]
    [ 'isa.optional.list_of.optional.empty.set',              ( [ null, S"", ]                                      ), true, ]
    [ 'isa.optional.list_of.optional.nonempty.set',           ( null                                      ), true, ]
    [ 'isa.optional.list_of.optional.nonempty.set',           ( []                                      ), true, ]
    [ 'isa.optional.list_of.optional.nonempty.set',           ( [ null, S"'abc'", ]                                      ), true, ]
    [ 'isa.optional.nonempty.set',                            ( null                                      ), true, ]
    [ 'isa.optional.nonempty.set',                            ( S"'abc'"                                      ), true, ]
    [ 'isa.optional.set_of.set',                              ( null                                      ), true, ]
    [ 'isa.optional.set_of.set',                              ( S""                                      ), true, ]
    [ 'isa.optional.set_of.set',                              ( S"[new Set()]"                                      ), true, ]
    [ 'isa.optional.set_of.set',                              ( S"[new Set('abc')]"                                      ), true, ]
    [ 'isa.optional.set_of.empty.set',                        ( null                                      ), true, ]
    [ 'isa.optional.set_of.empty.set',                        ( S""                                      ), true, ]
    [ 'isa.optional.set_of.empty.set',                        ( S"[new Set()]"                                      ), true, ]
    [ 'isa.optional.set_of.nonempty.set',                     ( null                                      ), true, ]
    [ 'isa.optional.set_of.nonempty.set',                     ( S"[new Set('abc')]"                                      ), true, ]
    [ 'isa.optional.set_of.optional.set',                     ( null                                      ), true, ]
    [ 'isa.optional.set_of.optional.set',                     ( S""                                      ), true, ]
    [ 'isa.optional.set_of.optional.set',                     ( S"[null, new Set(),]"                                      ), true, ]
    [ 'isa.optional.set_of.optional.empty.set',               ( null                                      ), true, ]
    [ 'isa.optional.set_of.optional.empty.set',               ( S""                                      ), true, ]
    [ 'isa.optional.set_of.optional.empty.set',               ( S"[null, new Set()]"                                      ), true, ]
    [ 'isa.optional.set_of.optional.nonempty.set',            ( null                                      ), true, ]
    [ 'isa.optional.set_of.optional.nonempty.set',            ( S""                                      ), true, ]
    [ 'isa.optional.set_of.optional.nonempty.set',            ( S"[null, new Set('abc')]"                                      ), true, ]
    # [ 'isa.optional.empty.list_of.set',                       ( null                                      ), true, ]
    # [ 'isa.optional.empty.list_of.empty.set',                 ( null                                      ), true, ]
    # [ 'isa.optional.empty.list_of.nonempty.set',              ( null                                      ), true, ]
    # [ 'isa.optional.empty.list_of.optional.set',              ( null                                      ), true, ]
    # [ 'isa.optional.empty.list_of.optional.empty.set',        ( null                                      ), true, ]
    # [ 'isa.optional.empty.list_of.optional.nonempty.set',     ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.set',                        ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.empty.set',                  ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.nonempty.set',               ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.optional.set',               ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.optional.empty.set',         ( null                                      ), true, ]
    # [ 'isa.optional.empty.set_of.optional.nonempty.set',      ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.set',                    ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.empty.set',              ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.nonempty.set',           ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.optional.set',           ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.optional.empty.set',     ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list_of.optional.nonempty.set',  ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.set',                     ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.empty.set',               ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.nonempty.set',            ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.optional.set',            ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.optional.empty.set',      ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set_of.optional.nonempty.set',   ( null                                      ), true, ]
    ]
  # #.........................................................................................................
  # ### numbers ###
  # for [ v, matcher, ] in [ [ 42, true, ], [ 42.1, false, ], ]
  #   T?.eq ( isa.integer                                               v ), matcher
  #   T?.eq ( isa.list_of.integer                                       v ), matcher
  #   T?.eq ( isa.list_of.negative0.integer                             v ), matcher
  #   T?.eq ( isa.list_of.negative1.integer                             v ), matcher
  #   T?.eq ( isa.list_of.positive0.integer                             v ), matcher
  #   T?.eq ( isa.list_of.positive1.integer                             v ), matcher
  #   T?.eq ( isa.list_of.optional.integer                              v ), matcher
  #   T?.eq ( isa.list_of.optional.negative0.integer                    v ), matcher
  #   T?.eq ( isa.list_of.optional.negative1.integer                    v ), matcher
  #   T?.eq ( isa.list_of.optional.positive0.integer                    v ), matcher
  #   T?.eq ( isa.list_of.optional.positive1.integer                    v ), matcher
  #   T?.eq ( isa.negative0.integer                                     v ), matcher
  #   T?.eq ( isa.negative1.integer                                     v ), matcher
  #   T?.eq ( isa.positive0.integer                                     v ), matcher
  #   T?.eq ( isa.positive1.integer                                     v ), matcher
  #   T?.eq ( isa.set_of.integer                                        v ), matcher
  #   T?.eq ( isa.set_of.negative0.integer                              v ), matcher
  #   T?.eq ( isa.set_of.negative1.integer                              v ), matcher
  #   T?.eq ( isa.set_of.positive0.integer                              v ), matcher
  #   T?.eq ( isa.set_of.positive1.integer                              v ), matcher
  #   T?.eq ( isa.set_of.optional.integer                               v ), matcher
  #   T?.eq ( isa.set_of.optional.negative0.integer                     v ), matcher
  #   T?.eq ( isa.set_of.optional.negative1.integer                     v ), matcher
  #   T?.eq ( isa.set_of.optional.positive0.integer                     v ), matcher
  #   T?.eq ( isa.set_of.optional.positive1.integer                     v ), matcher
  #   T?.eq ( isa.empty.list_of.integer                                 v ), matcher
  #   T?.eq ( isa.empty.list_of.negative0.integer                       v ), matcher
  #   T?.eq ( isa.empty.list_of.negative1.integer                       v ), matcher
  #   T?.eq ( isa.empty.list_of.positive0.integer                       v ), matcher
  #   T?.eq ( isa.empty.list_of.positive1.integer                       v ), matcher
  #   T?.eq ( isa.empty.list_of.optional.integer                        v ), matcher
  #   T?.eq ( isa.empty.list_of.optional.negative0.integer              v ), matcher
  #   T?.eq ( isa.empty.list_of.optional.negative1.integer              v ), matcher
  #   T?.eq ( isa.empty.list_of.optional.positive0.integer              v ), matcher
  #   T?.eq ( isa.empty.list_of.optional.positive1.integer              v ), matcher
  #   T?.eq ( isa.empty.set_of.integer                                  v ), matcher
  #   T?.eq ( isa.empty.set_of.negative0.integer                        v ), matcher
  #   T?.eq ( isa.empty.set_of.negative1.integer                        v ), matcher
  #   T?.eq ( isa.empty.set_of.positive0.integer                        v ), matcher
  #   T?.eq ( isa.empty.set_of.positive1.integer                        v ), matcher
  #   T?.eq ( isa.empty.set_of.optional.integer                         v ), matcher
  #   T?.eq ( isa.empty.set_of.optional.negative0.integer               v ), matcher
  #   T?.eq ( isa.empty.set_of.optional.negative1.integer               v ), matcher
  #   T?.eq ( isa.empty.set_of.optional.positive0.integer               v ), matcher
  #   T?.eq ( isa.empty.set_of.optional.positive1.integer               v ), matcher
  #   T?.eq ( isa.nonempty.list_of.integer                              v ), matcher
  #   T?.eq ( isa.nonempty.list_of.negative0.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list_of.negative1.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list_of.positive0.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list_of.positive1.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list_of.optional.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.list_of.optional.negative0.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list_of.optional.negative1.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list_of.optional.positive0.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list_of.optional.positive1.integer           v ), matcher
  #   T?.eq ( isa.nonempty.set_of.integer                               v ), matcher
  #   T?.eq ( isa.nonempty.set_of.negative0.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set_of.negative1.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set_of.positive0.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set_of.positive1.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set_of.optional.integer                      v ), matcher
  #   T?.eq ( isa.nonempty.set_of.optional.negative0.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set_of.optional.negative1.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set_of.optional.positive0.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set_of.optional.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.integer                                      v ), matcher
  #   T?.eq ( isa.optional.list_of.integer                              v ), matcher
  #   T?.eq ( isa.optional.list_of.negative0.integer                    v ), matcher
  #   T?.eq ( isa.optional.list_of.negative1.integer                    v ), matcher
  #   T?.eq ( isa.optional.list_of.positive0.integer                    v ), matcher
  #   T?.eq ( isa.optional.list_of.positive1.integer                    v ), matcher
  #   T?.eq ( isa.optional.list_of.optional.integer                     v ), matcher
  #   T?.eq ( isa.optional.list_of.optional.negative0.integer           v ), matcher
  #   T?.eq ( isa.optional.list_of.optional.negative1.integer           v ), matcher
  #   T?.eq ( isa.optional.list_of.optional.positive0.integer           v ), matcher
  #   T?.eq ( isa.optional.list_of.optional.positive1.integer           v ), matcher
  #   T?.eq ( isa.optional.negative0.integer                            v ), matcher
  #   T?.eq ( isa.optional.negative1.integer                            v ), matcher
  #   T?.eq ( isa.optional.positive0.integer                            v ), matcher
  #   T?.eq ( isa.optional.positive1.integer                            v ), matcher
  #   T?.eq ( isa.optional.set_of.integer                               v ), matcher
  #   T?.eq ( isa.optional.set_of.negative0.integer                     v ), matcher
  #   T?.eq ( isa.optional.set_of.negative1.integer                     v ), matcher
  #   T?.eq ( isa.optional.set_of.positive0.integer                     v ), matcher
  #   T?.eq ( isa.optional.set_of.positive1.integer                     v ), matcher
  #   T?.eq ( isa.optional.set_of.optional.integer                      v ), matcher
  #   T?.eq ( isa.optional.set_of.optional.negative0.integer            v ), matcher
  #   T?.eq ( isa.optional.set_of.optional.negative1.integer            v ), matcher
  #   T?.eq ( isa.optional.set_of.optional.positive0.integer            v ), matcher
  #   T?.eq ( isa.optional.set_of.optional.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.integer                        v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.negative0.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.negative1.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.positive0.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.positive1.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.optional.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.optional.negative0.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.optional.negative1.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.optional.positive0.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list_of.optional.positive1.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.integer                         v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.negative0.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.negative1.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.positive0.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.positive1.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.optional.integer                v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.optional.negative0.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.optional.negative1.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.optional.positive0.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set_of.optional.positive1.integer      v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.integer                     v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.negative0.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.negative1.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.positive0.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.positive1.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.optional.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.optional.negative0.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.optional.negative1.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.optional.positive0.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list_of.optional.positive1.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.integer                      v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.negative0.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.negative1.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.positive0.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.optional.integer             v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.optional.negative0.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.optional.negative1.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.optional.positive0.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set_of.optional.positive1.integer   v ), matcher
  #.........................................................................................................
  for [ probe, value, matcher, error, ] in probes_and_matchers
    await T.perform [ probe, value, ], matcher, error, -> return new Promise ( resolve, reject ) ->
      [ _, hedges..., ] = probe.split '.'
      callable          = isa
      callable          = do =>
        for term in hedges
          callable = callable[ term ]
        return callable
      result = callable value
      # log rpr [ probe, result, ]
      # resolve result
      resolve result
      return null
  #.........................................................................................................
  done?()

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
  #.........................................................................................................
  do =>
    types   = new Intertype()
    hedges  = types._hedges.constructor.hedges
    for groupname in [ 'collections', 'numbers', 'other', ]
      compiled_hedges = types._hedges._compile_hedges groupname, hedges
      hedgepaths      = types._hedges.get_hedgepaths compiled_hedges
      hedgepaths.sort()
      hedgepaths      = types._hedges._reduce_hedgepaths hedgepaths
      H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths..., ]
      info '^540^', hedgepaths
      if groupname is 'other'
        info CND.truth equals hedgepaths, [ [], [ 'list_of' ], [ 'list_of', 'optional' ], [ 'set_of' ], [ 'set_of', 'optional' ], [ 'empty', 'list_of' ], [ 'empty', 'list_of', 'optional' ], [ 'empty', 'set_of' ], [ 'empty', 'set_of', 'optional' ], [ 'nonempty', 'list_of' ], [ 'nonempty', 'list_of', 'optional' ], [ 'nonempty', 'set_of' ], [ 'nonempty', 'set_of', 'optional' ], [ 'optional' ], [ 'optional', 'list_of' ], [ 'optional', 'list_of', 'optional' ], [ 'optional', 'set_of' ], [ 'optional', 'set_of', 'optional' ], [ 'optional', 'empty', 'list_of' ], [ 'optional', 'empty', 'list_of', 'optional' ], [ 'optional', 'empty', 'set_of' ], [ 'optional', 'empty', 'set_of', 'optional' ], [ 'optional', 'nonempty', 'list_of' ], [ 'optional', 'nonempty', 'list_of', 'optional' ], [ 'optional', 'nonempty', 'set_of' ], [ 'optional', 'nonempty', 'set_of', 'optional' ] ]
  #.........................................................................................................
  do =>
    types       = new Intertype()
    hedgepaths  = types._hedges.hedgepaths
    debug '^453^', hedgepaths
    groupname   = 'other'
    H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths[ groupname ]..., ]
    info CND.truth equals hedgepaths[ groupname ], [ [], [ 'list_of' ], [ 'list_of', 'optional' ], [ 'set_of' ], [ 'set_of', 'optional' ], [ 'empty', 'list_of' ], [ 'empty', 'list_of', 'optional' ], [ 'empty', 'set_of' ], [ 'empty', 'set_of', 'optional' ], [ 'nonempty', 'list_of' ], [ 'nonempty', 'list_of', 'optional' ], [ 'nonempty', 'set_of' ], [ 'nonempty', 'set_of', 'optional' ], [ 'optional' ], [ 'optional', 'list_of' ], [ 'optional', 'list_of', 'optional' ], [ 'optional', 'set_of' ], [ 'optional', 'set_of', 'optional' ], [ 'optional', 'empty', 'list_of' ], [ 'optional', 'empty', 'list_of', 'optional' ], [ 'optional', 'empty', 'set_of' ], [ 'optional', 'empty', 'set_of', 'optional' ], [ 'optional', 'nonempty', 'list_of' ], [ 'optional', 'nonempty', 'list_of', 'optional' ], [ 'optional', 'nonempty', 'set_of' ], [ 'optional', 'nonempty', 'set_of', 'optional' ] ]
  return null


#-----------------------------------------------------------------------------------------------------------
list_all_builtin_type_testers = ->
  CAT                       = require 'multimix/lib/cataloguing'
  pattern                   = /^is/
  excludes                  = new Set [ 'isPrototypeOf', ]
  for top_level_name in CAT.all_keys_of global
    info top_level_name if ( top_level_name.match pattern )? and not excludes.has top_level_name
    # whisper '^3424^', top_level_name
    for second_level_name in CAT.all_keys_of global[ top_level_name ]
      info "#{top_level_name}.#{second_level_name}" if ( second_level_name.match pattern )? and not excludes.has second_level_name
  return null

#-----------------------------------------------------------------------------------------------------------
demo_picomatch_for_hedgepaths = ->
  pmatch = require 'picomatch'
  hedgepaths = [
    'integer'
    'list_of.integer'
    'optional.integer'
    'optional.list_of.integer'
    'optional.list_of.optional.integer'
    ]
  globpatterns = [
    '*'
    'optional.*'
    '!(*optional*)'
    '*.optional.*'
    '!(*.optional.*)'
    '*.!(optional).*'
    '!(optional)?(.*)'
    ]
  for globpattern in globpatterns
    echo GUY.trm.yellow GUY.trm.reverse " #{globpattern} "
    for hedgepath in hedgepaths
      v = pmatch.isMatch hedgepath, globpattern
      echo ( to_width ( GUY.trm.truth v ), 10 ), hedgepath
  return null

#-----------------------------------------------------------------------------------------------------------
demo_enumerate_hedgepaths = ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  # types.declare 'list', groups: 'collection', test: ( x ) -> Array.isArray x
  # types.declare 'integer', groups: 'number', test: ( x ) -> Number.isInteger x
  evaluate = ({ owner, key, value, }) ->
    # debug '^324^', key, ( types.type_of value )
    return 'take' if ( types.type_of value ) is 'function'
    return 'take' unless GUY.props.has_any_keys value
    return 'descend'
  for path in GUY.props.tree types.isa, { evaluate, sep: '.', }
    praise path
  # for k, v of Object.own types.isa
  #   debug '^4432^', k
  return null

#-----------------------------------------------------------------------------------------------------------
demo_autovivify_hedgepaths = ->
  # { Intertype } = require '../../../apps/intertype'
  # types         = new Intertype { hedgematch: null, }
  # # types         = new Intertype { hedgematch: '*', }
  # types.declare 'list', groups: 'collection', test: ( x ) -> Array.isArray x
  # types.declare 'integer', groups: 'number', test: ( x ) -> Number.isInteger x
  # debug '^353-1^', [ types._walk_hedgepaths()..., ].length
  # debug '^353-2^', [ types._walk_hedgepaths()..., ]
  # debug '^353-3^', types.isa
  # debug '^353-4^', types.isa.list
  # # debug '^353-5^', types.isa.empty.list
  # debug '^353-5^', types.isa.list     [], { optional: true, empty: true, }
  # debug '^353-5^', types.isa.integer  123, { optional: true, empty: true, }
  base_proxy_cfg =
    get: ( target, key ) =>
      return undefined if key is Symbol.toStringTag
      debug '^878-1^', target, rpr key
      _isa.collector.length = 0
      _isa.collector.push key
      return R if ( R = target[ key ] ) ### TAINT use `get()` ###
      f = { "#{key}": ( ( x ) -> praise '^878-1^', rpr x; 'something' ), }[ key ]
      return target[ key ] = new Proxy f, proxy_cfg
  proxy_cfg =
    get: ( target, key ) =>
      return undefined if key is Symbol.toStringTag
      debug '^878-1^', target, rpr key
      _isa.collector.push key
      return R if ( R = target[ key ] ) ### TAINT use `get()` ###
      f =  ( x ) ->
        praise '^878-1^', _isa.collector
        praise '^878-1^', rpr x
        return 'something'
      f = { "#{key}": f, }[ key ]
      return target[ key ] = new Proxy f, proxy_cfg
  _isa            = ( x ) -> 'base'
  _isa.collector  = []
  isa             = new Proxy _isa, base_proxy_cfg
  info '^878-3^', isa
  urge '^878-3^', _isa.collector
  info '^878-3^', isa 42
  urge '^878-3^', _isa.collector
  info '^878-4^', isa.x
  urge '^878-3^', _isa.collector
  info '^878-6^', isa.x.y.z
  urge '^878-3^', _isa.collector
  info '^878-6^', isa.x.y.z 42
  urge '^878-3^', _isa.collector
  # info '^878-6^', isa.x.y.z.u.v.w.a.b.c.d
  # info '^878-7^', isa.x.y.z.u.v.w.a.b.c.d 42
  return null
demo_size_of = ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  info '^905-1^', types.size_of [ 1, 2, 3, ]
  info '^905-2^', types.size_of new Set [ 1, 2, 3, ]
  info '^905-3^', GUY.props.get ( new Set "abc" ), 'length', null
  info '^905-4^', GUY.props.get ( new Set "abc" ), 'size', null
  info '^905-5^', GUY.props.get ( "abc" ), 'length', null
  info '^905-6^', GUY.props.get ( "abc" ), 'size', null
  info '^905-7^', types.size_of "abc"
  info '^905-8^', types.size_of "abc𪜁"
  return null

#-----------------------------------------------------------------------------------------------------------
@declare_NG = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  types.declare.list
    groups:   'collection'
    test:     ( x ) -> Array.isArray x
  types.declare.integer
    groups:   'number'
    test:     ( x ) -> Number.isInteger x
  types.declare.null
    test: ( x ) -> x is null
  info '^323423^', types
  info '^323423^', types.declare
  T?.eq ( types.isa.list    []    ), true
  T?.eq ( types.isa.list    42    ), false
  T?.eq ( types.isa.list    null  ), false
  T?.eq ( types.isa.integer []    ), false
  T?.eq ( types.isa.integer 42    ), true
  T?.eq ( types.isa.integer null  ), false
  T?.eq ( types.isa.null    []    ), false
  T?.eq ( types.isa.null    42    ), false
  T?.eq ( types.isa.null    null  ), true
  done?()

#-----------------------------------------------------------------------------------------------------------
@types_isa_empty_nonempty_text = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare.text
    groups:   'collection'
    test:     ( x ) -> ( typeof x ) is 'string'
  #.........................................................................................................
  T?.eq ( _types.type_of types.registry.text    ), 'type_cfg'
  # T?.eq ( types.isa.text          'helo'        ), true
  # T?.eq ( types.isa.nonempty.text 'helo'        ), true
  T?.eq ( types.isa.empty.text    'helo'        ), false
  whisper '-------------------------------------------------------------'
  # T?.eq ( types.isa.text          42            ), false
  # T?.eq ( types.isa.optional.text 42            ), false
  # T?.eq ( types.isa.optional.text null          ), true
  # T?.eq ( types.isa.optional.text ''            ), true
  # T?.eq ( types.isa.optional.text 'helo'        ), true
  T?.eq ( types.isa.empty.text    ''            ), true
  # T?.eq ( types.isa.nonempty.text ''            ), false
  done?()

#-----------------------------------------------------------------------------------------------------------
@declare_NG_defaults = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare.list
    groups:   'collection'
    test:     ( x ) -> Array.isArray x
  #.........................................................................................................
  types.declare.object
    test:     ( x ) -> _types.isa.object x
  #.........................................................................................................
  types.declare.text
    groups:   'collection'
    test:     ( x ) -> ( typeof x ) is 'string'
  #.........................................................................................................
  types.declare.integer
    groups:   'number'
    test:     ( x ) -> Number.isInteger x
  #.........................................................................................................
  types.declare.float
    groups:   'number'
    test:     ( x ) -> Number.isFinite x
  #.........................................................................................................
  types.declare.null
    test: ( x ) -> x is null
  #.........................................................................................................
  types.declare.quantity
    test: [
      ( x ) -> @isa.object        x
      ( x ) -> @isa.float         x.value
      ( x ) -> @isa.nonempty.text x.unit
      ]
  #.........................................................................................................
  info '^868-1^', types
  T?.eq ( _types.type_of types.declare          ), 'function'
  T?.eq ( _types.type_of types.registry         ), 'strict_owner'
  T?.eq ( _types.type_of types.registry.text    ), 'type_cfg'
  # info '^868-2^', types.registry
  info '^868-3^', types.registry.integer
  info '^868-4^', types.registry.null
  info '^868-5^', types.registry.text
  info '^868-6^', types.registry.quantity
  info '^868-7^', types.registry.quantity.test
  info '^868-8^', types.registry.quantity.test 42
  info '^868-9^', types.registry.quantity.test { value: 1.23, unit: '', }
  info '^868-10^', types.registry.quantity.test { value: 1.23, unit: 'm', }
  done?()



############################################################################################################
unless module.parent?
  # demo()
  # list_all_builtin_type_testers()
  # demo_hedges()
  # demo_test_with_protocol()
  # demo_multipart_hedges()
  # demo_combinate_2()
  # demo_intertype_hedge_combinator()
  # @[ "intertype hedgepaths" ]()
  # @[ "intertype all hedgepaths" ]()
  # test @[ "intertype all hedgepaths" ]
  # demo_size_of()
  # test @[ "intertype size_of" ]
  # urge GUY.src.get_first_return_clause_text
  # urge GUY.src.slug_from_simple_function function: ( x ) -> @isa.optional.integer x
  # demo_picomatch_for_hedgepaths()
  # @[ "forbidden to overwrite declarations" ]()
  # test @[ "forbidden to overwrite declarations" ]
  # test @[ "intertype quantified types" ]
  # demo_enumerate_hedgepaths()
  # test @declare_NG
  # test @types_isa_empty_nonempty_text
  # test @declare_NG_defaults
  test @


