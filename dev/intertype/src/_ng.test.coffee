
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
rvr                       = GUY.trm.reverse
truth                     = GUY.trm.truth.bind GUY.trm
#...........................................................................................................
test                      = require 'guy-test'
# { intersection_of }       = require '../../../apps/intertype/lib/helpers'
H                         = require '../../../lib/helpers'
equals                    = GUY.samesame.equals
S                         = ( parts ) -> new Set eval parts.raw[ 0 ]
{ to_width }              = require 'to-width'
_types                    = new ( require 'intertype' ).Intertype()


#-----------------------------------------------------------------------------------------------------------
@[ "isa" ] = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  # jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  types.declare 'array', collection: true, isa: ( x ) -> @isa.list x
  #.........................................................................................................
  T?.eq ( types._isa 'null',                         null          ), true
  T?.eq ( types._isa 'optional', 'null',             null          ), true
  T?.eq ( types._isa 'optional', 'null',             undefined     ), true
  T?.eq ( types._isa 'null',                         undefined     ), false
  T?.eq ( types._isa 'array',                        []            ), true
  T?.eq ( types._isa 'list',                         []            ), true
  T?.eq ( types._isa 'object',                       {}            ), true
  T?.eq ( types._isa 'object',                       []            ), false
  T?.eq ( types._isa 'empty', 'array',               []            ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   []            ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   null          ), true
  T?.eq ( types._isa 'optional', 'empty', 'array',   42            ), false
  T?.eq ( types._isa 'optional', 'empty', 'array',   [ 42, ]       ), false
  #.........................................................................................................
  # T?.throws /'optional' cannot be a hedge in declarations/, => types.declare 'optional', 'integer', isa: ->
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
  types.declare 'weirdo', isa: ( x ) -> x is weirdo
  # types.declare 'weirdo', isa: ( x ) -> x is weirdo
  T?.eq ( GUY.props.has types.isa, 'weirdo' ), true
  debug '^353^', GUY.props.has types.isa, 'weirdo'
  T?.throws /unable to re-declare 'weirdo'/, => types.declare 'weirdo', isa: ( x ) -> x is weirdo
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
demo = ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
  debug '^5345-1^', types
  debug '^5345-2^', types.isa
  debug '^5345-3^', types.isa.collection
  debug '^5345-4^', types.type_of 'x'
  debug '^5345-5^', types.isa.collection 'x'
  debug '^5345-6^', ( k for k of types.isa )
  # types.declare 'list',       isa_collection: true,  isa: ( x ) -> ( jto x ) is 'list'
  # ### @isa 'empty', 'isa_collection', x ###
  # # types.declare 'empty_array',                  isa: ( x ) -> ( @isa 'array', x ) and x.length is 0
  # types.declare 'list',                           isa: ( x ) -> @isa 'array', x
  # types.declare 'integer',      isa_numeric: true,    isa: ( x ) -> @isa 'array', x
  debug '^5345-7^', k for k of types.isa
  # debug '^5345-8^', types._isa 'empty'
  debug '^5345-9^', types._isa
  debug '^5345-10^', types._isa 'text', ''
  debug '^5345-11^', types._isa 'text', 'xxx'
  debug '^5345-12^', types._isa 'empty', 'text', ''
  debug '^5345-13^', types.isa.text 'x'
  debug '^5345-14^', types.isa.nonempty.text 'x'
  debug '^5345-15^', types._isa 'nonempty', 'text', 'x'
  debug '^5345-16^', types._isa 'empty', 'set', 'of', 'text', new Set()
  debug '^5345-17^', types.isa.empty.set.of.text new Set()
  debug '^5345-18^', types.isa.list.of.text []
  debug '^5345-19^', types.isa.list.of.text [ 'x', '', ]
  debug '^5345-20^', types.isa.list.of.nonempty.text [ 'x', ]
  debug '^5345-21^', types.isa.list.of.empty.text [ '', ]
  debug '^5345-22^', types.isa.optional.text ''
  debug '^5345-23^', types.isa.optional.text null
  debug '^5345-24^', types.isa.optional.list.of.text null
  debug '^5345-25^', types.isa.optional.list.of.optional.text null
  debug '^5345-26^', types.isa.optional.list.of.optional.nonempty.text null
  debug '^5345-27^', types.isa.optional.nonempty.list.of.optional.nonempty.text null
  info CND.reverse '        '
  debug '^5345-28^', types._isa 'nonempty', 'text', ''
  debug '^5345-29^', types._isa 'text', 42
  debug '^5345-30^', types._isa 'empty', 'text', 'xxx'
  debug '^5345-31^', types._isa 'empty', 'text', 42
  debug '^5345-32^', types.isa.empty.text 'x'
  debug '^5345-33^', types.isa.nonempty.text ''
  debug '^5345-34^', types.isa.empty.text 42
  debug '^5345-35^', types.isa.list.of.text 'x'
  debug '^5345-36^', types.isa.list.of.text [ 'x', 42, ]
  debug '^5345-37^', types.isa.list.of.nonempty.text [ '', 'x' ]
  debug '^5345-38^', types.isa.list.of.empty.text [ 'x', '', ]
  # debug '^5345-39^', types.isa.list.of.text 42
  # debug '^5345-40^', types.isa.list.of.text []
  # debug '^5345-41^', types.isa.list.of.text [ 'a', 'b', ]
  # debug '^5345-42^', types.isa.nonempty.list.of.text [ 'a', 'b', ]
  # debug '^5345-43^', types.isa.nonempty.list.of.nonempty.text [ 'a', 'b', ]
  # debug '^5345-44^', types.isa.empty.list.of.text 42
  # debug '^5345-45^', types.isa.empty.list.of.text []
  # debug '^5345-46^', types.isa.optional.empty.text 42
  # debug '^5345-47^', types.isa.optional.empty.text null
  # debug '^5345-48^', types.isa.optional
  # debug '^5345-49^', types.isa.optional.empty
  # debug '^5345-50^', types.isa.optional.empty.list.of
  # debug '^5345-51^', types.isa.optional.empty.list.of.text
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
  try ( types.declare 'optional', 'integer', isa: -> ) catch error
    warn '^509-9^', CND.reverse error.message
  H.tabulate 'types._types', ( -> yield type for _, type of types._types )()
  #.........................................................................................................
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "intertype hedgepaths" ] = ( T, done ) ->
#   { Intertype
#     Type_cfg }  = require '../../../apps/intertype'
#   #.........................................................................................................
#   do =>
#     types       = new Intertype()
#     hedgepaths  = types._hedges.hedgepaths
#     groupname   = 'other'
#     H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths[ groupname ]..., ]
#     T?.eq hedgepaths[ groupname ], [ [], [ 'list', 'of' ], [ 'list', 'of', 'optional' ], [ 'set', 'of' ], [ 'set', 'of', 'optional' ], [ 'empty', 'list', 'of' ], [ 'empty', 'list', 'of', 'optional' ], [ 'empty', 'set', 'of' ], [ 'empty', 'set', 'of', 'optional' ], [ 'nonempty', 'list', 'of' ], [ 'nonempty', 'list', 'of', 'optional' ], [ 'nonempty', 'set', 'of' ], [ 'nonempty', 'set', 'of', 'optional' ], [ 'optional' ], [ 'optional', 'list', 'of' ], [ 'optional', 'list', 'of', 'optional' ], [ 'optional', 'set', 'of' ], [ 'optional', 'set', 'of', 'optional' ], [ 'optional', 'empty', 'list', 'of' ], [ 'optional', 'empty', 'list', 'of', 'optional' ], [ 'optional', 'empty', 'set', 'of' ], [ 'optional', 'empty', 'set', 'of', 'optional' ], [ 'optional', 'nonempty', 'list', 'of' ], [ 'optional', 'nonempty', 'list', 'of', 'optional' ], [ 'optional', 'nonempty', 'set', 'of' ], [ 'optional', 'nonempty', 'set', 'of', 'optional' ] ]
#     #.......................................................................................................
#     typenames =
#       other:        'boolean'
#       collections:  'set'
#       numbers:      'integer'
#     for groupname, hedgepaths of types._hedges.hedgepaths
#       info groupname
#       typename = typenames[ groupname ]
#       for hedgepath in hedgepaths
#         urge [ hedgepath..., typename ].join '.'
#   done?()
#   return null

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
@intertype_all_hedgepaths = ( T, done ) ->
  # T?.halt_on_error true
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa       } = types
  #.........................................................................................................
  probes_and_matchers = [
    ### other ###
    [ 'isa.boolean',                                   (   true                                             ), true, ]
    [ 'isa.list.of.boolean',                           (   [ true, ]                                        ), true, ]
    [ 'isa.list.of.boolean',                           (   []                                               ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( []                                                 ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( [ null, ]                                          ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( [ null, true, ]                                    ), true, ]
    [ 'isa.set.of.boolean',                            ( S"[]"                                              ), true, ]
    [ 'isa.set.of.boolean',                            ( S"[ false, ]"                                      ), true, ]
    [ 'isa.set.of.optional.boolean',                   ( S"[]"                                              ), true, ]
    [ 'isa.set.of.optional.boolean',                   ( S"[ null, ]"                                       ), true, ]
    [ 'isa.set.of.optional.boolean',                   ( S"[ null, false, ]"                                ), true, ]
    [ 'isa.empty.list.of.boolean',                     ( []                                                 ), true, ]
    [ 'isa.empty.list.of.optional.boolean',            ( []                                                 ), true, ]
    [ 'isa.empty.set.of.boolean',                      ( S""                                                ), true, ]
    [ 'isa.empty.set.of.optional.boolean',             ( S""                                                ), true, ]
    [ 'isa.nonempty.list.of.boolean',                  ( [ true, ]                                          ), true, ]
    [ 'isa.nonempty.list.of.optional.boolean',         ( [ true, null, ]                                    ), true, ]
    [ 'isa.nonempty.set.of.boolean',                   ( S"[ true, false, ]"                                ), true, ]
    [ 'isa.nonempty.set.of.optional.boolean',          ( S"[ null, null, ]"                                 ), true, ]
    [ 'isa.optional.boolean',                          ( true                                               ), true, ]
    [ 'isa.optional.boolean',                          ( false                                              ), true, ]
    [ 'isa.optional.boolean',                          ( null                                               ), true, ]
    [ 'isa.optional.list.of.boolean',                  ( null                                               ), true, ]
    [ 'isa.optional.list.of.boolean',                  ( []                                                 ), true, ]
    [ 'isa.optional.list.of.boolean',                  ( [ true, ]                                          ), true, ]
    [ 'isa.optional.list.of.optional.boolean',         ( null                                               ), true, ]
    [ 'isa.optional.list.of.optional.boolean',         ( []                                                 ), true, ]
    [ 'isa.optional.list.of.optional.boolean',         ( [ true, ]                                          ), true, ]
    [ 'isa.optional.list.of.optional.boolean',         ( [ true, null, ]                                    ), true, ]
    [ 'isa.optional.set.of.boolean',                   ( null                                               ), true, ]
    [ 'isa.optional.set.of.boolean',                   ( S""                                                ), true, ]
    [ 'isa.optional.set.of.boolean',                   ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.set.of.optional.boolean',          ( null                                               ), true, ]
    [ 'isa.optional.set.of.optional.boolean',          ( S""                                                ), true, ]
    [ 'isa.optional.set.of.optional.boolean',          ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.set.of.optional.boolean',          ( S"[ null, ]"                                       ), true, ]
    [ 'isa.optional.empty.list.of.boolean',            ( null                                               ), true, ]
    [ 'isa.optional.empty.list.of.boolean',            ( []                                                 ), true, ]
    [ 'isa.optional.empty.list.of.optional.boolean',   ( null                                               ), true, ]
    [ 'isa.optional.empty.list.of.optional.boolean',   ( []                                                 ), true, ]
    [ 'isa.optional.empty.set.of.boolean',             ( null                                               ), true, ]
    [ 'isa.optional.empty.set.of.boolean',             ( S""                                                ), true, ]
    [ 'isa.optional.empty.set.of.optional.boolean',    ( null                                               ), true, ]
    [ 'isa.optional.empty.set.of.optional.boolean',    ( S""                                                ), true, ]
    [ 'isa.optional.nonempty.list.of.boolean',         ( null                                               ), true, ]
    [ 'isa.optional.nonempty.list.of.boolean',         ( [ true, ]                                          ), true, ]
    [ 'isa.optional.nonempty.list.of.boolean',         ( [ false, ]                                         ), true, ]
    [ 'isa.optional.nonempty.list.of.optional.boolean',( null                                               ), true, ]
    [ 'isa.optional.nonempty.list.of.optional.boolean',( [ true, ]                                          ), true, ]
    [ 'isa.optional.nonempty.list.of.optional.boolean',( [ null, null, ]                                    ), true, ]
    [ 'isa.optional.nonempty.set.of.boolean',          ( null                                               ), true, ]
    [ 'isa.optional.nonempty.set.of.boolean',          ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.nonempty.set.of.optional.boolean', ( null                                               ), true, ]
    [ 'isa.optional.nonempty.set.of.optional.boolean', ( S"[ true, ]"                                       ), true, ]
    [ 'isa.optional.nonempty.set.of.optional.boolean', ( S"[ false, null, ]"                                ), true, ]
  #.........................................................................................................
  ### collections ###
    [ 'isa.set',                                              ( S""                                         ), true, ]
    [ 'isa.empty.set',                                        ( S""                                         ), true, ]
    [ 'isa.list.of.set',                                      ( []                                          ), true, ]
    [ 'isa.list.of.set',                                      ( [ S"", ]                                    ), true, ]
    [ 'isa.list.of.empty.set',                                ( [ S"", ]                                    ), true, ]
    [ 'isa.list.of.nonempty.set',                             ( [ S"[42]", S"'x'", ]                        ), true, ]
    [ 'isa.list.of.optional.set',                             ( []                                          ), true, ]
    [ 'isa.list.of.optional.set',                             ( [ S"" ]                                     ), true, ]
    [ 'isa.list.of.optional.empty.set',                       ( []                                          ), true, ]
    [ 'isa.list.of.optional.nonempty.set',                    ( []                                          ), true, ]
    [ 'isa.list.of.optional.nonempty.set',                    ( [ null, S"'x'", ]                           ), true, ]
    [ 'isa.list.of.optional.nonempty.set',                    ( [ S"'x'", S"'abc𪜁'", ]                      ), true, ]
    [ 'isa.nonempty.set',                                     ( S"'abc𪜁'"                                   ), true, ]
    [ 'isa.set.of.set',                                       ( S"[new Set()]"                              ), true, ]
    [ 'isa.set.of.empty.set',                                 ( S"[]"                                       ), true, ]
    [ 'isa.set.of.empty.set',                                 ( S"[new Set()]"                              ), true, ]
    [ 'isa.set.of.nonempty.set',                              ( S"[]"                                       ), true, ]
    [ 'isa.set.of.nonempty.set',                              ( S"[new Set('a')]"                           ), true, ]
    [ 'isa.set.of.optional.set',                              ( S""                                         ), true, ]
    [ 'isa.set.of.optional.set',                              ( S"null"                                     ), true, ]
    [ 'isa.set.of.optional.set',                              ( S"[null,new Set()]"                         ), true, ]
    [ 'isa.set.of.optional.empty.set',                        ( S""                                         ), true, ]
    [ 'isa.set.of.optional.empty.set',                        ( S"null"                                     ), true, ]
    [ 'isa.set.of.optional.empty.set',                        ( S"[new Set()]"                              ), true, ]
    [ 'isa.set.of.optional.nonempty.set',                     ( S""                                         ), true, ]
    [ 'isa.set.of.optional.nonempty.set',                     ( S"null"                                     ), true, ]
    [ 'isa.set.of.optional.nonempty.set',                     ( S"[new Set('a')]"                           ), true, ]
    [ 'isa.empty.list.of.set',                                ( []                                          ), true, ]
    [ 'isa.empty.list.of.empty.set',                          ( []                                          ), true, ]
    [ 'isa.empty.list.of.nonempty.set',                       ( []                                          ), true, ]
    [ 'isa.empty.list.of.optional.set',                       ( []                                          ), true, ]
    [ 'isa.empty.list.of.optional.empty.set',                 ( []                                          ), true, ]
    [ 'isa.empty.list.of.optional.nonempty.set',              ( []                                          ), true, ]
    [ 'isa.empty.set.of.set',                                 ( S""                                         ), true, ]
    [ 'isa.empty.set.of.empty.set',                           ( S""                                         ), true, ]
    [ 'isa.empty.set.of.nonempty.set',                        ( S""                                         ), true, ]
    [ 'isa.empty.set.of.optional.set',                        ( S""                                         ), true, ]
    [ 'isa.empty.set.of.optional.empty.set',                  ( S""                                         ), true, ]
    [ 'isa.empty.set.of.optional.nonempty.set',               ( S""                                         ), true, ]
    [ 'isa.nonempty.list.of.set',                             ( [ S"", ]                                    ), true, ]
    [ 'isa.nonempty.list.of.set',                             ( [ S"'x'", ]                                 ), true, ]
    [ 'isa.nonempty.list.of.empty.set',                       ( [ S"", S"", ]                               ), true, ]
    [ 'isa.nonempty.list.of.nonempty.set',                    ( [ S"[1]", S"[2]", ]                         ), true, ]
    [ 'isa.nonempty.list.of.optional.set',                    ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list.of.optional.set',                    ( [ null, S"'abc'", ]                         ), true, ]
    [ 'isa.nonempty.list.of.optional.empty.set',              ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list.of.optional.empty.set',              ( [ null, S"", ]                              ), true, ]
    [ 'isa.nonempty.list.of.optional.nonempty.set',           ( [ null, ]                                   ), true, ]
    [ 'isa.nonempty.list.of.optional.nonempty.set',           ( [ null, S"'abc'" ]                          ), true, ]
    [ 'isa.nonempty.set.of.set',                              ( S"[new Set()]"                              ), true, ]
    [ 'isa.nonempty.set.of.empty.set',                        ( S"[new Set()]"                              ), true, ]
    [ 'isa.nonempty.set.of.nonempty.set',                     ( S"[new Set('abc')]"                         ), true, ]
    [ 'isa.nonempty.set.of.optional.set',                     ( S"[null]"                                   ), true, ]
    [ 'isa.nonempty.set.of.optional.set',                     ( S"[null, new Set('a')]"                     ), true, ]
    [ 'isa.nonempty.set.of.optional.empty.set',               ( S"[new Set(), null,]"                       ), true, ]
    [ 'isa.nonempty.set.of.optional.nonempty.set',            ( S"[null,new Set('abc')]"                    ), true, ]
    [ 'isa.optional.set',                                     ( null                                      ), true, ]
    [ 'isa.optional.set',                                     ( S""                                      ), true, ]
    [ 'isa.optional.empty.set',                               ( null                                      ), true, ]
    [ 'isa.optional.empty.set',                               ( S""                                      ), true, ]
    [ 'isa.optional.list.of.set',                             ( null                                      ), true, ]
    [ 'isa.optional.list.of.set',                             ( []                                      ), true, ]
    [ 'isa.optional.list.of.set',                             ( [ S"", ]                                      ), true, ]
    [ 'isa.optional.list.of.empty.set',                       ( null                                      ), true, ]
    [ 'isa.optional.list.of.empty.set',                       ( []                                      ), true, ]
    [ 'isa.optional.list.of.empty.set',                       ( [ S"", ]                                      ), true, ]
    [ 'isa.optional.list.of.nonempty.set',                    ( null                                      ), true, ]
    [ 'isa.optional.list.of.nonempty.set',                    ( [ S"'xxx'", ]                                      ), true, ]
    [ 'isa.optional.list.of.optional.set',                    ( null                                      ), true, ]
    [ 'isa.optional.list.of.optional.set',                    ( []                                      ), true, ]
    [ 'isa.optional.list.of.optional.set',                    ( [ null, ]                                      ), true, ]
    [ 'isa.optional.list.of.optional.set',                    ( [ null, S"", ]                                      ), true, ]
    [ 'isa.optional.list.of.optional.empty.set',              ( null                                      ), true, ]
    [ 'isa.optional.list.of.optional.empty.set',              ( []                                      ), true, ]
    [ 'isa.optional.list.of.optional.empty.set',              ( [ null, ]                                      ), true, ]
    [ 'isa.optional.list.of.optional.empty.set',              ( [ null, S"", ]                                      ), true, ]
    [ 'isa.optional.list.of.optional.nonempty.set',           ( null                                      ), true, ]
    [ 'isa.optional.list.of.optional.nonempty.set',           ( []                                      ), true, ]
    [ 'isa.optional.list.of.optional.nonempty.set',           ( [ null, S"'abc'", ]                                      ), true, ]
    [ 'isa.optional.nonempty.set',                            ( null                                      ), true, ]
    [ 'isa.optional.nonempty.set',                            ( S"'abc'"                                      ), true, ]
    [ 'isa.optional.set.of.set',                              ( null                                      ), true, ]
    [ 'isa.optional.set.of.set',                              ( S""                                      ), true, ]
    [ 'isa.optional.set.of.set',                              ( S"[new Set()]"                                      ), true, ]
    [ 'isa.optional.set.of.set',                              ( S"[new Set('abc')]"                                      ), true, ]
    [ 'isa.optional.set.of.empty.set',                        ( null                                      ), true, ]
    [ 'isa.optional.set.of.empty.set',                        ( S""                                      ), true, ]
    [ 'isa.optional.set.of.empty.set',                        ( S"[new Set()]"                                      ), true, ]
    [ 'isa.optional.set.of.nonempty.set',                     ( null                                      ), true, ]
    [ 'isa.optional.set.of.nonempty.set',                     ( S"[new Set('abc')]"                                      ), true, ]
    [ 'isa.optional.set.of.optional.set',                     ( null                                      ), true, ]
    [ 'isa.optional.set.of.optional.set',                     ( S""                                      ), true, ]
    [ 'isa.optional.set.of.optional.set',                     ( S"[null, new Set(),]"                                      ), true, ]
    [ 'isa.optional.set.of.optional.empty.set',               ( null                                      ), true, ]
    [ 'isa.optional.set.of.optional.empty.set',               ( S""                                      ), true, ]
    [ 'isa.optional.set.of.optional.empty.set',               ( S"[null, new Set()]"                                      ), true, ]
    [ 'isa.optional.set.of.optional.nonempty.set',            ( null                                      ), true, ]
    [ 'isa.optional.set.of.optional.nonempty.set',            ( S""                                      ), true, ]
    [ 'isa.optional.set.of.optional.nonempty.set',            ( S"[null, new Set('abc')]"                                      ), true, ]
    # [ 'isa.optional.empty.list.of.set',                       ( null                                      ), true, ]
    # [ 'isa.optional.empty.list.of.empty.set',                 ( null                                      ), true, ]
    # [ 'isa.optional.empty.list.of.nonempty.set',              ( null                                      ), true, ]
    # [ 'isa.optional.empty.list.of.optional.set',              ( null                                      ), true, ]
    # [ 'isa.optional.empty.list.of.optional.empty.set',        ( null                                      ), true, ]
    # [ 'isa.optional.empty.list.of.optional.nonempty.set',     ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.set',                        ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.empty.set',                  ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.nonempty.set',               ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.optional.set',               ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.optional.empty.set',         ( null                                      ), true, ]
    # [ 'isa.optional.empty.set.of.optional.nonempty.set',      ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.set',                    ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.empty.set',              ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.nonempty.set',           ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.optional.set',           ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.optional.empty.set',     ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.list.of.optional.nonempty.set',  ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.set',                     ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.empty.set',               ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.nonempty.set',            ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.optional.set',            ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.optional.empty.set',      ( null                                      ), true, ]
    # [ 'isa.optional.nonempty.set.of.optional.nonempty.set',   ( null                                      ), true, ]
    ]
  # #.........................................................................................................
  # ### numbers ###
  # for [ v, matcher, ] in [ [ 42, true, ], [ 42.1, false, ], ]
  #   T?.eq ( isa.integer                                               v ), matcher
  #   T?.eq ( isa.list.of.integer                                       v ), matcher
  #   T?.eq ( isa.list.of.negative0.integer                             v ), matcher
  #   T?.eq ( isa.list.of.negative1.integer                             v ), matcher
  #   T?.eq ( isa.list.of.positive0.integer                             v ), matcher
  #   T?.eq ( isa.list.of.positive1.integer                             v ), matcher
  #   T?.eq ( isa.list.of.optional.integer                              v ), matcher
  #   T?.eq ( isa.list.of.optional.negative0.integer                    v ), matcher
  #   T?.eq ( isa.list.of.optional.negative1.integer                    v ), matcher
  #   T?.eq ( isa.list.of.optional.positive0.integer                    v ), matcher
  #   T?.eq ( isa.list.of.optional.positive1.integer                    v ), matcher
  #   T?.eq ( isa.negative0.integer                                     v ), matcher
  #   T?.eq ( isa.negative1.integer                                     v ), matcher
  #   T?.eq ( isa.positive0.integer                                     v ), matcher
  #   T?.eq ( isa.positive1.integer                                     v ), matcher
  #   T?.eq ( isa.set.of.integer                                        v ), matcher
  #   T?.eq ( isa.set.of.negative0.integer                              v ), matcher
  #   T?.eq ( isa.set.of.negative1.integer                              v ), matcher
  #   T?.eq ( isa.set.of.positive0.integer                              v ), matcher
  #   T?.eq ( isa.set.of.positive1.integer                              v ), matcher
  #   T?.eq ( isa.set.of.optional.integer                               v ), matcher
  #   T?.eq ( isa.set.of.optional.negative0.integer                     v ), matcher
  #   T?.eq ( isa.set.of.optional.negative1.integer                     v ), matcher
  #   T?.eq ( isa.set.of.optional.positive0.integer                     v ), matcher
  #   T?.eq ( isa.set.of.optional.positive1.integer                     v ), matcher
  #   T?.eq ( isa.empty.list.of.integer                                 v ), matcher
  #   T?.eq ( isa.empty.list.of.negative0.integer                       v ), matcher
  #   T?.eq ( isa.empty.list.of.negative1.integer                       v ), matcher
  #   T?.eq ( isa.empty.list.of.positive0.integer                       v ), matcher
  #   T?.eq ( isa.empty.list.of.positive1.integer                       v ), matcher
  #   T?.eq ( isa.empty.list.of.optional.integer                        v ), matcher
  #   T?.eq ( isa.empty.list.of.optional.negative0.integer              v ), matcher
  #   T?.eq ( isa.empty.list.of.optional.negative1.integer              v ), matcher
  #   T?.eq ( isa.empty.list.of.optional.positive0.integer              v ), matcher
  #   T?.eq ( isa.empty.list.of.optional.positive1.integer              v ), matcher
  #   T?.eq ( isa.empty.set.of.integer                                  v ), matcher
  #   T?.eq ( isa.empty.set.of.negative0.integer                        v ), matcher
  #   T?.eq ( isa.empty.set.of.negative1.integer                        v ), matcher
  #   T?.eq ( isa.empty.set.of.positive0.integer                        v ), matcher
  #   T?.eq ( isa.empty.set.of.positive1.integer                        v ), matcher
  #   T?.eq ( isa.empty.set.of.optional.integer                         v ), matcher
  #   T?.eq ( isa.empty.set.of.optional.negative0.integer               v ), matcher
  #   T?.eq ( isa.empty.set.of.optional.negative1.integer               v ), matcher
  #   T?.eq ( isa.empty.set.of.optional.positive0.integer               v ), matcher
  #   T?.eq ( isa.empty.set.of.optional.positive1.integer               v ), matcher
  #   T?.eq ( isa.nonempty.list.of.integer                              v ), matcher
  #   T?.eq ( isa.nonempty.list.of.negative0.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list.of.negative1.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list.of.positive0.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list.of.positive1.integer                    v ), matcher
  #   T?.eq ( isa.nonempty.list.of.optional.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.list.of.optional.negative0.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list.of.optional.negative1.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list.of.optional.positive0.integer           v ), matcher
  #   T?.eq ( isa.nonempty.list.of.optional.positive1.integer           v ), matcher
  #   T?.eq ( isa.nonempty.set.of.integer                               v ), matcher
  #   T?.eq ( isa.nonempty.set.of.negative0.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set.of.negative1.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set.of.positive0.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set.of.positive1.integer                     v ), matcher
  #   T?.eq ( isa.nonempty.set.of.optional.integer                      v ), matcher
  #   T?.eq ( isa.nonempty.set.of.optional.negative0.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set.of.optional.negative1.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set.of.optional.positive0.integer            v ), matcher
  #   T?.eq ( isa.nonempty.set.of.optional.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.integer                                      v ), matcher
  #   T?.eq ( isa.optional.list.of.integer                              v ), matcher
  #   T?.eq ( isa.optional.list.of.negative0.integer                    v ), matcher
  #   T?.eq ( isa.optional.list.of.negative1.integer                    v ), matcher
  #   T?.eq ( isa.optional.list.of.positive0.integer                    v ), matcher
  #   T?.eq ( isa.optional.list.of.positive1.integer                    v ), matcher
  #   T?.eq ( isa.optional.list.of.optional.integer                     v ), matcher
  #   T?.eq ( isa.optional.list.of.optional.negative0.integer           v ), matcher
  #   T?.eq ( isa.optional.list.of.optional.negative1.integer           v ), matcher
  #   T?.eq ( isa.optional.list.of.optional.positive0.integer           v ), matcher
  #   T?.eq ( isa.optional.list.of.optional.positive1.integer           v ), matcher
  #   T?.eq ( isa.optional.negative0.integer                            v ), matcher
  #   T?.eq ( isa.optional.negative1.integer                            v ), matcher
  #   T?.eq ( isa.optional.positive0.integer                            v ), matcher
  #   T?.eq ( isa.optional.positive1.integer                            v ), matcher
  #   T?.eq ( isa.optional.set.of.integer                               v ), matcher
  #   T?.eq ( isa.optional.set.of.negative0.integer                     v ), matcher
  #   T?.eq ( isa.optional.set.of.negative1.integer                     v ), matcher
  #   T?.eq ( isa.optional.set.of.positive0.integer                     v ), matcher
  #   T?.eq ( isa.optional.set.of.positive1.integer                     v ), matcher
  #   T?.eq ( isa.optional.set.of.optional.integer                      v ), matcher
  #   T?.eq ( isa.optional.set.of.optional.negative0.integer            v ), matcher
  #   T?.eq ( isa.optional.set.of.optional.negative1.integer            v ), matcher
  #   T?.eq ( isa.optional.set.of.optional.positive0.integer            v ), matcher
  #   T?.eq ( isa.optional.set.of.optional.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.integer                        v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.negative0.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.negative1.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.positive0.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.positive1.integer              v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.optional.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.optional.negative0.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.optional.negative1.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.optional.positive0.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.list.of.optional.positive1.integer     v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.integer                         v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.negative0.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.negative1.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.positive0.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.positive1.integer               v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.optional.integer                v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.optional.negative0.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.optional.negative1.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.optional.positive0.integer      v ), matcher
  #   T?.eq ( isa.optional.empty.set.of.optional.positive1.integer      v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.integer                     v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.negative0.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.negative1.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.positive0.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.positive1.integer           v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.optional.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.optional.negative0.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.optional.negative1.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.optional.positive0.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.list.of.optional.positive1.integer  v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.integer                      v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.negative0.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.negative1.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.positive0.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.positive1.integer            v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.optional.integer             v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.optional.negative0.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.optional.negative1.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.optional.positive0.integer   v ), matcher
  #   T?.eq ( isa.optional.nonempty.set.of.optional.positive1.integer   v ), matcher
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
@_demo_hedgepath_resolution = ->
  # T?.halt_on_error true
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa       } = types
  #.........................................................................................................
  probes_and_matchers = [
    ### other ###
    [ 'isa.boolean',                                   (   true                                             ), true, ]
    [ 'isa.list.of.boolean',                           (   [ true, ]                                        ), true, ]
    [ 'isa.list.of.boolean',                           (   []                                               ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( []                                                 ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( [ null, ]                                          ), true, ]
    [ 'isa.list.of.optional.boolean',                  ( [ null, true, ]                                    ), true, ]
    [ 'isa.set.of.boolean',                            ( S"[]"                                              ), true, ]
    [ 'isa.set.of.boolean',                            ( S"[ false, ]"                                      ), true, ]
    ]
  #.........................................................................................................
  for [ probe, value, matcher, error, ] in probes_and_matchers
    [ _, hedges..., ] = probe.split '.'
    callable          = isa
    callable          = do =>
      for term in hedges
        callable = callable[ term ]
      return callable
    result = callable value
    urge { probe, value, result, }
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_test_with_protocol = ->
  { Intertype
    Type_cfg }  = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  info '^342-2^', types.isa.integer                     42
  info '^342-2^', types.isa.optional.integer            42
  info '^342-2^', types.isa.optional.positive0.integer  42
  info '^342-2^', types.isa.integer                     42.1
  info '^342-2^', types.isa.optional.integer            42.1
  info '^342-2^', types.isa.optional.positive0.integer  42.1
  info '^342-2^', types.isa.integer                     null
  info '^342-2^', types.isa.optional.integer            null
  info '^342-2^', types.isa.optional.positive0.integer  null
  info '^342-2^', types.isa.list.of.integer             null
  info '^342-2^', types.isa.list.of.integer             []
  info '^342-2^', types.isa.list.of.integer             [ 1, 2, 3, ]
  info '^342-2^', types.isa.list.of.integer             [ 1, 2, 3.5, ]
  info '^342-2^', types.isa.list.of.optional.integer    [ 1, 2, null, ]
  info '^342-2^', types.isa.list.of.optional.integer    [ 1, 2, 3.5, ]
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
      mandatory_kernels:  [ 'list', 'of', 'set', 'of', ]
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
      kernel:     [ 'list', 'of', 'set', 'of', ]
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
        [ 'list', 'of', 'set', 'of', ]
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
        info CND.truth equals hedgepaths, [ [], [ 'list', 'of' ], [ 'list', 'of', 'optional' ], [ 'set', 'of' ], [ 'set', 'of', 'optional' ], [ 'empty', 'list', 'of' ], [ 'empty', 'list', 'of', 'optional' ], [ 'empty', 'set', 'of' ], [ 'empty', 'set', 'of', 'optional' ], [ 'nonempty', 'list', 'of' ], [ 'nonempty', 'list', 'of', 'optional' ], [ 'nonempty', 'set', 'of' ], [ 'nonempty', 'set', 'of', 'optional' ], [ 'optional' ], [ 'optional', 'list', 'of' ], [ 'optional', 'list', 'of', 'optional' ], [ 'optional', 'set', 'of' ], [ 'optional', 'set', 'of', 'optional' ], [ 'optional', 'empty', 'list', 'of' ], [ 'optional', 'empty', 'list', 'of', 'optional' ], [ 'optional', 'empty', 'set', 'of' ], [ 'optional', 'empty', 'set', 'of', 'optional' ], [ 'optional', 'nonempty', 'list', 'of' ], [ 'optional', 'nonempty', 'list', 'of', 'optional' ], [ 'optional', 'nonempty', 'set', 'of' ], [ 'optional', 'nonempty', 'set', 'of', 'optional' ] ]
  #.........................................................................................................
  do =>
    types       = new Intertype()
    hedgepaths  = types._hedges.hedgepaths
    debug '^453^', hedgepaths
    groupname   = 'other'
    H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths[ groupname ]..., ]
    info CND.truth equals hedgepaths[ groupname ], [ [], [ 'list', 'of' ], [ 'list', 'of', 'optional' ], [ 'set', 'of' ], [ 'set', 'of', 'optional' ], [ 'empty', 'list', 'of' ], [ 'empty', 'list', 'of', 'optional' ], [ 'empty', 'set', 'of' ], [ 'empty', 'set', 'of', 'optional' ], [ 'nonempty', 'list', 'of' ], [ 'nonempty', 'list', 'of', 'optional' ], [ 'nonempty', 'set', 'of' ], [ 'nonempty', 'set', 'of', 'optional' ], [ 'optional' ], [ 'optional', 'list', 'of' ], [ 'optional', 'list', 'of', 'optional' ], [ 'optional', 'set', 'of' ], [ 'optional', 'set', 'of', 'optional' ], [ 'optional', 'empty', 'list', 'of' ], [ 'optional', 'empty', 'list', 'of', 'optional' ], [ 'optional', 'empty', 'set', 'of' ], [ 'optional', 'empty', 'set', 'of', 'optional' ], [ 'optional', 'nonempty', 'list', 'of' ], [ 'optional', 'nonempty', 'list', 'of', 'optional' ], [ 'optional', 'nonempty', 'set', 'of' ], [ 'optional', 'nonempty', 'set', 'of', 'optional' ] ]
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
    'list.of.integer'
    'optional.integer'
    'optional.list.of.integer'
    'optional.list.of.optional.integer'
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
demo_intertype_autovivify_hedgepaths = ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { isa
    validate
    declare   } = types
  info '^879-4^', isa.integer 42                        ; praise '^879-5^',  ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-8^', isa.optional 42                       ; praise '^879-9^',  ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-10^', isa.optional.integer                 ; praise '^879-11^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-12^', isa.optional.integer 42              ; praise '^879-13^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-14^', isa.optional.integer 42              ; praise '^879-15^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-16^', isa.optional.integer null            ; praise '^879-17^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-18^', isa.optional.optional.integer null   ; praise '^879-19^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-20^', isa.empty.integer null               ; praise '^879-21^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-22^', isa.empty.integer 42                 ; praise '^879-23^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-24^', isa.empty.integer 0                  ; praise '^879-25^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-26^', isa.negative0.integer 0              ; praise '^879-27^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-28^', isa.positive0.integer 0              ; praise '^879-29^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-30^', isa.negative1.integer 0              ; praise '^879-31^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-32^', isa.positive1.integer 0              ; praise '^879-33^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-34^', isa.negative0.list 0                 ; praise '^879-35^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  info '^879-36^', isa.negative0.list []                ; praise '^879-37^', ( GUY.trm.reverse types.state.method ), types.state.hedges.join '.'
  # info '^879-38^', isa.x
  # info '^879-39^', isa.optional.empty.list.of.integer null
  # info '^879-40^', isa.optional.empty.list.of.integer []
  # info '^879-41^', isa.optional.empty.list.of.integer [ 42, ]
  # info '^879-42^', isa.optional.empty.list.of.integer [ 42, 3.1, ]
  # info '^879-43^', isa.empty.integer     5 ### TAINT returns `false` ###
  # info '^879-44^', isa.nonempty.integer  5 ### TAINT returns `true` ###
  # console.log ( require 'util' ).inspect isa, { colors: true, depth: Infinity, }
  # info '^879-45^', isa.optional.empty.list.of.list.of.integer [ 42, ]
  # info '^879-46^', isa.optional.empty.list.of.list.of.integer [ [ 42,] ]
  # praise '^353-2^', path for path from GUY.props.walk_tree isa, { sep: '.', }
  # # info '^879-47^', isa.x.y.z
  # # info '^879-48^', isa.x.y.z 42
  # # # info '^879-49^', isa.x.y.z.u.v.w.a.b.c.d
  # # info '^879-50^', isa.x.y.z.u.v.w.a.b.c.d 42
  return null

#-----------------------------------------------------------------------------------------------------------
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
@validate_1 = ( T, done ) ->
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  T?.eq ( validate.list [] ), []
  T?.eq ( validate.optional.list [] ), []
  T?.eq ( validate.optional.list null ), null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@validate_returns_value = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare.quantity
    isa:      ( x ) -> @isa.object x
    $value:   'float'
    $unit:    'nonempty.text'
    default:
      value:    0
      unit:     null
  types.declare.fortytwo ( x ) -> x is 42
  d = { value: 4, unit: 'kB', }
  types.validate.fortytwo 42
  try types.validate.fortytwo           123 catch error then warn rvr error.message
  try types.validate.positive1.fortytwo 123 catch error then warn rvr error.message
  # #.........................................................................................................
  # info '^321-1^', ( types.validate.float 12.3     );  echo types.get_state_report { format: 'failing', }
  # info '^321-1^', ( types.validate.fortytwo 12.3  );  echo types.get_state_report { format: 'failing', }
  # info '^321-1^', ( types.validate.fortytwo 42    );  echo types.get_state_report { format: 'failing', }
  # info '^321-2^', ( types.isa.object d            );  echo types.get_state_report { format: 'failing', }
  # info '^321-3^', ( types.isa.quantity d          );  echo types.get_state_report { format: 'failing', }
  # # info '^321-3^', ( types.isa.quantity null       );  echo types.get_state_report { format: 'failing', }
  # info '^321-4^', ( types.validate.quantity d     );  echo types.get_state_report { format: 'failing', }
  # T?.eq ( types.validate.float 12.3 ), 12.3
  # T?.eq ( types.validate.quantity d ), d
  # T?.ok ( types.validate.quantity d ) is d
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@create_returns_deep_copy_of_default = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare.frob
    $list:  'list'
    $blah:  'nonempty.text'
    default:
      list:     []
      blah:     null
  #.........................................................................................................
  mylist  = [ 1, 2, 3, ]
  d       = { list: mylist, blah: 'blub', }
  T?.eq ( types.validate.frob d ), d
  T?.ok ( types.validate.frob d ) is d
  e       = types.create.frob d
  debug '^45345^', d
  debug '^45345^', e
  T?.ok equals e, d
  T?.ok e isnt d
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@create_with_seal_freeze_extra = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  # #.........................................................................................................
  # types.declare.sealed_frob
  #   isa: [
  #     ( x ) -> @isa.object        x
  #     ( x ) -> @isa.list          x.list
  #     ( x ) -> @isa.nonempty.text x.blah
  #     ]
  #   seal:     'deep'
  #   default:
  #     list:     []
  #     blah:     null
  #.........................................................................................................
  types.declare.frozen_frob
    $list:  'list'
    $blah:  'nonempty.text'
    freeze:   'deep'
    default:
      list:     []
      blah:     null
  #.........................................................................................................
  types.declare.noextra_frob
    $list:  'list'
    $blah:  'nonempty.text'
    extras:   false
    default:
      list:     []
      blah:     null
  #.........................................................................................................
  do =>
    # debug types.registry.frozen_frob
    # debug ( k for k of GUY.lft )
    mylist        = [ 1, 2, 3, ]
    d             = { list: mylist, blah: 'blub', }
    d_copy        = GUY.lft._deep_copy d
    d_frozen_copy = GUY.lft.freeze d_copy
    urge '^549-1^', "d                                    ", d
    urge '^549-2^', "d_copy                               ", d_copy
    urge '^549-2^', "d_frozen_copy                        ", d_frozen_copy
    info '^549-3^', "d.list is mylist                     ", GUY.trm.truth d.list is mylist
    info '^549-4^', "d_copy.list is mylist                ", GUY.trm.truth d_copy.list is mylist
    info '^549-4^', "d_frozen_copy.list is mylist         ", GUY.trm.truth d_frozen_copy.list is mylist
    info '^549-4^', "d_frozen_copy.list is d_copy.list    ", GUY.trm.truth d_frozen_copy.list is d_copy.list
    info '^549-5^', "Object.isFrozen mylist               ", GUY.trm.truth Object.isFrozen mylist
    info '^549-6^', "Object.isFrozen d                    ", GUY.trm.truth Object.isFrozen d
    info '^549-5^', "Object.isFrozen d.list               ", GUY.trm.truth Object.isFrozen d.list
    info '^549-6^', "Object.isFrozen d_copy               ", GUY.trm.truth Object.isFrozen d_copy
    info '^549-5^', "Object.isFrozen d_copy.list          ", GUY.trm.truth Object.isFrozen d_copy.list
    info '^549-6^', "Object.isFrozen d_frozen_copy        ", GUY.trm.truth Object.isFrozen d_frozen_copy
    info '^549-5^', "Object.isFrozen d_frozen_copy.list   ", GUY.trm.truth Object.isFrozen d_frozen_copy.list
  #.........................................................................................................
  do =>
    mylist        = [ 1, 2, 3, ]
    cfg           = { list: mylist, blah: 'blub', }
    frozen_frob   = types.create.frozen_frob cfg
    info '^879-1^', "cfg.list is mylist                 ", GUY.trm.truth cfg.list is mylist
    info '^879-2^', "frozen_frob.list isnt mylist       ", GUY.trm.truth frozen_frob.list isnt mylist
    info '^879-3^', "not Object.isFrozen mylist         ", GUY.trm.truth not Object.isFrozen mylist
    info '^879-4^', "not Object.isFrozen cfg            ", GUY.trm.truth not Object.isFrozen cfg
    info '^879-5^', "Object.isFrozen frozen_frob        ", GUY.trm.truth Object.isFrozen frozen_frob
    info '^879-6^', "Object.isFrozen frozen_frob.list   ", GUY.trm.truth Object.isFrozen frozen_frob.list
    T?.ok cfg.list is mylist
    T?.ok frozen_frob.list isnt mylist
    T?.ok not Object.isFrozen mylist
    T?.ok not Object.isFrozen cfg
    T?.ok Object.isFrozen frozen_frob
    T?.ok Object.isFrozen frozen_frob.list
  #.........................................................................................................
  do =>
    mylist        = [ 1, 2, 3, ]
    cfg           = { list: mylist, blah: 'blub', }
    noextra_frob  = types.create.noextra_frob cfg
    debug '^4535-1^', types.registry.noextra_frob
    debug '^4535-3^', noextra_frob
    T?.ok types.registry.noextra_frob.extras is false
    T?.ok types.isa.noextra_frob noextra_frob
    noextra_frob.extra_prop = true
    debug '^4535-4^', noextra_frob
    T?.ok not types.isa.noextra_frob noextra_frob
    # types.validate.noextra_frob noextra_frob
    T?.throws /not a valid noextra_frob/, -> types.validate.noextra_frob noextra_frob
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@declare_NG_defaults = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  #.........................................................................................................
  types.declare.quantity
    $value:   'float'
    $unit:    'nonempty.text'
    default:
      value:    0
      unit:     null
  #.........................................................................................................
  types.declare.point2d
    $x: 'float'
    $y: 'float'
    default:
      x:    0
      y:    0
    create: ( cfg ) -> { { x: 1, y: 1, }..., cfg..., }
  #.........................................................................................................
  info '^868-1^', types
  T?.eq ( _types.type_of types.declare          ), 'function'
  T?.eq ( _types.type_of types.registry         ), 'object'
  T?.eq ( _types.type_of types.registry.text    ), 'function'
  # info '^868-2^', types.registry
  info '^868-3^', types.registry.integer
  info '^868-4^', types.registry.null
  info '^868-5^', types.registry.text
  info '^868-6^', types.registry.quantity
  # info '^868-7^', types.registry.quantity.test
  # info '^868-8^',  T?.eq ( types.registry.quantity.test  42                           ), false
  # info '^868-9^',  T?.eq ( types.registry.quantity.test  { value: 1.23, unit: '', }   ), false
  # info '^868-10^', T?.eq ( types.registry.quantity.test  { value: 1.23, unit: 'm', }  ), true
  info '^868-11^', T?.eq ( types.isa.quantity            42                           ), false
  info '^868-12^', T?.eq ( types.isa.quantity            { value: 1.23, unit: '', }   ), false
  info '^868-13^', T?.eq ( types.isa.quantity            { value: 1.23, unit: 'm', }  ), true
  info '^868-14^', T?.eq ( types.validate.quantity { types.registry.quantity.default..., { value: 44, unit: 'g', }..., } ), { value: 44, unit: 'g', }
  info '^868-15^', T?.throws /not a valid text/, -> types.validate.text 42
  # praise '^521-1^', types.isa.text ''
  # praise '^521-2^', types.validate.text ''
  # praise '^521-3^', types.isa.optional.text null
  # praise '^521-4^', types.isa.optional.text ''
  # praise '^521-5^', types.isa.optional.text 42
  # praise '^521-6^', types.validate.optional.text null
  # praise '^521-7^', types.validate.empty.text null
  # praise '^521-8^', types.validate.empty.text 42
  info '^868-16^', T?.throws /not a valid empty\.text/, -> types.validate.empty.text 42
  info '^868-17^', T?.throws /not a valid quantity/, -> types.validate.quantity { types.registry.quantity.default..., { value: null, }..., }
  info '^868-18^', T?.eq ( types.isa.empty.text '' ), true
  info '^868-19^', T?.eq ( types.validate.empty.text '' ), ''
  info '^868-20^', T?.eq ( types.validate.nonempty.text 'x' ), 'x'
  info '^868-21^', T?.eq ( types.validate.optional.nonempty.text null ), null
  info '^868-22^', T?.eq ( types.validate.optional.nonempty.text 'x' ), 'x'
  praise '^868-24^', rpr types.create.text()
  praise '^868-25^', rpr types.create.integer()
  info '^868-22^', T?.eq ( types.create.null()       ), null
  info '^868-22^', T?.eq ( types.create.undefined()  ), undefined
  info '^868-22^', T?.eq ( types.create.boolean()    ), false
  info '^868-22^', T?.eq ( types.create.list()       ), []
  info '^868-22^', T?.eq ( types.create.object()     ), {}
  info '^868-22^', T?.eq ( types.create.text()       ), ''
  info '^868-22^', T?.eq ( types.create.integer()    ), 0
  info '^868-22^', T?.eq ( types.create.quantity {            unit: 'km', } ), { value:  0, unit: 'km', }
  info '^868-22^', T?.eq ( types.create.quantity { value: 32, unit: 'km', } ), { value: 32, unit: 'km', }
  info '^868-22^', T?.eq ( types.create.float()      ), 0
  info '^868-22^', T?.eq ( types.create.point2d()    ), { x: 1, y: 1, }
  #.........................................................................................................
  # info '^868-23^', T?.eq ( types.create.text() ), ''
  # info '^868-22^', T?.eq ( types.create.integer 42   ), 42
  # info '^868-22^', T?.throws /not a valid integer/, -> types.create.integer 4.2
  # praise hedgepath for hedgepath from GUY.props.walk_tree types.isa,      { sep: '.', }
  # info   hedgepath for hedgepath from GUY.props.walk_tree types.validate, { sep: '.', }
  done?()

#-----------------------------------------------------------------------------------------------------------
@isa_x_or_y = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  try isa.integer.foobar 24 catch error then warn GUY.trm.reverse error.message
  T?.throws /unknown hedge or type 'foobar'/, -> isa.integer.foobar
  T?.throws /unknown hedge or type 'foobar'/, -> isa.integer.foobar 24
  T?.throws /unknown hedge or type 'list_of'/, -> isa.list_of
  T?.throws /unknown hedge or type 'list_of'/, -> isa.list_of.integer
  T?.throws /unknown hedge or type 'list_of'/, -> isa.list_of.integer 24
  # praise '^868-25^', GUY.trm.truth      isa.integer 24
  # praise '^868-25^', GUY.trm.truth      isa.optional.integer 24
  # praise '^868-25^', GUY.trm.truth      isa.collection 24
  # praise '^868-25^', GUY.trm.truth      isa.collection [ 24, ]
  # praise '^868-25^', GUY.trm.truth      isa.text.or.integer 24
  # praise '^868-25^', GUY.trm.truth      isa.integer.or.text 24
  # praise '^868-25^', GUY.trm.truth      isa.integer.or.text
  # praise '^868-25^', GUY.trm.truth      isa.optional.nonempty.text
  # praise '^868-25^', path for path from GUY.props.walk_tree isa
  # praise '^868-25^', GUY.trm.truth      isa.integer.or.text 'x'
  # praise '^868-25^', GUY.trm.truth not  isa.integer.or.text false
  # praise '^868-25^', GUY.trm.truth not  isa.integer.or.text {}

  # praise '^341-1^', isa.text.or.integer 42
  # praise '^341-2^', isa.text.or.integer ''
  # praise '^341-1^', isa.optional.text.or.integer null
  # praise '^341-1^', isa.optional.text.or.integer ''
  # praise '^341-1^', isa.optional.text.or.integer 42
  # praise '^341-1^', isa.optional.text.or.integer false
  # #.........................................................................................................
  info '^871-1^',   try T?.eq ( isa.integer 42                                ), true   catch e then warn '^871-2^', rvr e.message; T?.ok false
  info '^871-3^',   try T?.eq ( isa.text ''                                   ), true   catch e then warn '^871-4^', rvr e.message; T?.ok false
  info '^871-5^',   try T?.eq ( isa.integer ''                                ), false  catch e then warn '^871-6^', rvr e.message; T?.ok false
  info '^871-7^',   try T?.eq ( isa.text 42                                   ), false  catch e then warn '^871-8^', rvr e.message; T?.ok false
  info '^871-9^',   try T?.eq ( isa.text.or.integer 42                        ), true   catch e then warn '^871-10^', rvr e.message; T?.ok false
  info '^871-11^',  try T?.eq ( isa.text.or.integer ''                        ), true   catch e then warn '^871-12^', rvr e.message; T?.ok false
  info '^871-13^',  try T?.eq ( isa.integer.or.text 42                        ), true   catch e then warn '^871-14^', rvr e.message; T?.ok false
  info '^871-15^',  try T?.eq ( isa.integer.or.text ''                        ), true   catch e then warn '^871-16^', rvr e.message; T?.ok false
  info '^871-17^',  try T?.eq ( isa.text.or.integer false                     ), false  catch e then warn '^871-18^', rvr e.message; T?.ok false
  info '^871-19^',  try T?.eq ( isa.integer.or.text false                     ), false  catch e then warn '^871-20^', rvr e.message; T?.ok false
  info '^871-21^',  try T?.eq ( isa.text.or.integer null                      ), false  catch e then warn '^871-22^', rvr e.message; T?.ok false
  info '^871-23^',  try T?.eq ( isa.integer.or.text null                      ), false  catch e then warn '^871-24^', rvr e.message; T?.ok false
  info '^871-25^',  try T?.eq ( isa.optional.text.or.integer null             ), true   catch e then warn '^871-26^', rvr e.message; T?.ok false
  info '^871-27^',  try T?.eq ( isa.optional.integer.or.text null             ), true   catch e then warn '^871-28^', rvr e.message; T?.ok false
  info '^871-29^',  try T?.eq ( isa.optional.integer.or.text.or.boolean null  ), true   catch e then warn '^871-30^', rvr e.message; T?.ok false
  info '^871-31^',  try T?.eq ( isa.optional.integer.or.text.or.boolean false ), true   catch e then warn '^871-32^', rvr e.message; T?.ok false
  info '^871-33^',  try T?.eq ( isa.optional.integer.or.text.or.boolean 42    ), true   catch e then warn '^871-34^', rvr e.message; T?.ok false
  info '^871-35^',  try T?.eq ( isa.optional.integer.or.text.or.boolean 'x'   ), true   catch e then warn '^871-36^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.optional.integer.or.text.or.boolean {}    ), false  catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer 0                       ), true   catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer 1                       ), true   catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer Infinity                ), false  catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer 123456                  ), true   catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer -1                      ), false  catch e then warn '^871-38^', rvr e.message; T?.ok false
  info '^871-37^',  try T?.eq ( isa.positive0.integer true                    ), false  catch e then warn '^871-38^', rvr e.message; T?.ok false
  #.........................................................................................................
  # T?.throws /unknown type 'foobar'/, -> isa.integer.foobar 24
  # praise ( to_width k, 20 ), entry for k, entry of types.registry
  # help types.registry.text
  # help types.registry.integer
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_collection_of_t = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  praise '^222-1^', isa.list.of.integer             []
  praise '^222-1^', isa.list.of.integer             [ 1, ]
  praise '^222-1^', isa.list.of.integer             [ 1, 'x', ]
  praise '^222-1^', isa.nonempty.list.of.integer    [ 1, ]
  praise '^222-1^', isa.nonempty.set.of.integer     [ 1, ]
  praise '^222-1^', isa.nonempty.set.of.integer     new Set [ 1, ]
  praise '^222-1^', isa.nonempty.set.of.integer     new Set()
  praise '^222-1^', isa.set.of.codepoint            new Set "helo world\u{20000}"
  praise '^222-1^', isa.list.of.text                42
  praise '^222-1^', isa.list.of.integer             42
  try praise '^222-1^', isa.integer.of.text             '???' catch error then warn rvr error.message
  try praise '^222-1^', isa.integer.of.text             42    catch error then warn rvr error.message
  #.........................................................................................................
  info '^854-1^',   T?.eq ( isa.list.of.integer                   []                              ), true
  info '^854-2^',   T?.eq ( isa.list.of.integer                   [ 1, ]                          ), true
  info '^854-3^',   T?.eq ( isa.list.of.integer                   [ 1, 'x', ]                     ), false
  info '^854-4^',   T?.eq ( isa.nonempty.list.of.integer          [ 1, ]                          ), true
  info '^854-5^',   T?.eq ( isa.nonempty.set.of.integer           [ 1, ]                          ), false
  info '^854-6^',   T?.eq ( isa.nonempty.set.of.integer           new Set [ 1, ]                  ), true
  info '^854-7^',   T?.eq ( isa.nonempty.set.of.integer           new Set()                       ), false
  info '^854-8^',   T?.eq ( isa.set.of.codepoint                  new Set "helo world\u{20000}"   ), true
  info '^854-9^',  T?.eq ( isa.list.of.text                      42                              ), false
  info '^854-10^',  T?.eq ( isa.list.of.integer                   42                              ), false
  info '^854-11^',  T?.eq ( isa.list.of.integer.or.text           [ 'abc', 42, ]                  ), true
  info '^854-12^',  T?.eq ( isa.list.of.optional.integer.or.text  [ 'abc', 42, ]                  ), true
  info '^854-13^',  T?.eq ( isa.list.of.optional.integer.or.text  [ 'abc', 42, null, ]            ), true
  info '^854-14^',  T?.eq ( isa.list.of.optional.integer.or.text  [ 'abc', 42, null, true, ]      ), false
  info '^854-15^',  T?.throws /hedgerow cannot start with `or`/, -> isa.or.text ### throws at declaration time ###
  info '^854-16^',  T?.throws /hedgerow cannot start with `of`/, -> isa.of.text ### throws at declaration time ###
  info '^854-17^',  T?.throws /expected type before `of` to be a collection/, -> isa.integer.of.text ### throws at declaration time ###
  info '^854-18^',  T?.throws /expected type before `of` to be a collection/, -> isa.integer.of.text 42
  info '^854-19^',  T?.throws /expected type before `of` to be a collection/, -> isa.integer.of.text '???'
  info '^854-20^',  T?.throws /hedgerow cannot begin or end with `of` or `or`/, -> isa.list.of.list.of 42
  #.........................................................................................................
  info '^854-21^',  T?.eq ( isa.list.of.list.of.integer []                                    ), true
  info '^854-22^',  T?.eq ( isa.list.of.list.of.integer [ [], ]                               ), true
  info '^854-23^',  T?.eq ( isa.list.of.optional.list.of.integer [ null, ]                    ), true
  info '^854-24^',  T?.eq ( isa.list.of.optional.list.of.integer [ [], ]                      ), true
  info '^854-25^',  T?.eq ( isa.list.of.list.of.integer [ [ 1, ], ]                           ), true
  info '^854-26^',  T?.eq ( isa.list.of.list.of.integer [ [ 1, ], [ 2, 3, ], [ 4, 5, 6, ], ]  ), true
  #.........................................................................................................
  info '^854-27^',  T?.eq ( isa.list.of.list.of.integer [ null, ]                             ), false
  info '^854-28^',  T?.eq ( isa.list.of.optional.list.of.integer [ [ null, ], ]               ), false
  info '^854-29^',  T?.eq ( isa.list.of.list.of.optional.integer [ null, ]                    ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_even_odd_for_bigints = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  info '^430-1^', isa.even.numeric 1
  info '^430-2^', isa.even.numeric 2
  info '^430-3^', T?.eq ( isa.even.numeric 1                     ), false
  info '^430-4^', T?.eq ( isa.even.numeric 2                     ), true
  info '^430-5^', isa.even.numeric 1n
  info '^430-6^', isa.even.numeric 2n
  info '^430-7^', T?.eq ( isa.even.numeric 1n                    ), false
  info '^430-8^', T?.eq ( isa.even.numeric 2n                    ), true
  # debug isa.even.integer 1n
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_existential_types = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  info '^430-1^', isa.anything    1
  info '^430-1^', isa.something   1
  info '^430-2^', isa.nothing     1
  info '^430-3^', T?.eq ( isa.anything  1         ), true
  info '^430-3^', T?.eq ( isa.something 1         ), true
  info '^430-3^', T?.eq ( isa.nothing   1         ), false
  info '^430-3^', T?.eq ( isa.anything  false     ), true
  info '^430-3^', T?.eq ( isa.something false     ), true
  info '^430-3^', T?.eq ( isa.nothing   false     ), false
  info '^430-3^', T?.eq ( isa.anything  null      ), true
  info '^430-3^', T?.eq ( isa.something null      ), false
  info '^430-3^', T?.eq ( isa.nothing   null      ), true
  info '^430-3^', T?.eq ( isa.anything  undefined ), true
  info '^430-3^', T?.eq ( isa.something undefined ), false
  info '^430-3^', T?.eq ( isa.nothing   undefined ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_empty_and_nonempty = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  types         = new Intertype()
  { declare
    isa
    validate  } = types
  #.........................................................................................................
  info '^931-1^',   T?.eq ( types.isa.empty     42.5    ), false
  info '^931-2^',   T?.eq ( types.isa.empty     ''      ), true
  info '^931-3^',   T?.eq ( types.isa.empty     'x'     ), false
  info '^931-4^',   T?.eq ( types.isa.empty     []      ), true
  info '^931-5^',   T?.eq ( types.isa.empty     [ 1, ]  ), false
  info '^931-6^',   T?.eq ( types.isa.nonempty  42.5    ), false
  info '^931-7^',   T?.eq ( types.isa.nonempty  ''      ), false
  info '^931-8^',   T?.eq ( types.isa.nonempty  'x'     ), true
  info '^931-9^',   T?.eq ( types.isa.nonempty  [ 1, ]  ), true
  #.........................................................................................................
  info '^931-10^',  T?.eq ( types.isa.empty.list     42.5    ), false
  info '^931-11^',  T?.eq ( types.isa.empty.text     ''      ), true
  info '^931-12^',  T?.eq ( types.isa.empty.text     'x'     ), false
  info '^931-13^',  T?.eq ( types.isa.empty.list     []      ), true
  info '^931-14^',  T?.eq ( types.isa.empty.list     [ 1, ]  ), false
  info '^931-15^',  T?.eq ( types.isa.nonempty.list  42.5    ), false
  info '^931-16^',  T?.eq ( types.isa.nonempty.text  ''      ), false
  info '^931-17^',  T?.eq ( types.isa.nonempty.text  'x'     ), true
  info '^931-18^',  T?.eq ( types.isa.nonempty.list  [ 1, ]  ), true
  #.........................................................................................................
  info '^931-19^',  T?.eq ( types.isa.list.empty     42.5    ), false
  info '^931-20^',  T?.eq ( types.isa.text.empty     ''      ), true
  info '^931-21^',  T?.eq ( types.isa.text.empty     'x'     ), false
  info '^931-22^',  T?.eq ( types.isa.list.empty     []      ), true
  info '^931-23^',  T?.eq ( types.isa.list.empty     [ 1, ]  ), false
  info '^931-24^',  T?.eq ( types.isa.list.nonempty  42.5    ), false
  info '^931-25^',  T?.eq ( types.isa.text.nonempty  ''      ), false
  info '^931-26^',  T?.eq ( types.isa.text.nonempty  'x'     ), true
  info '^931-27^',  T?.eq ( types.isa.list.nonempty  [ 1, ]  ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_declaration_with_per_key_clauses = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>
    types         = new Intertype()
    { declare
      create
      validate
      isa       } = types
    info '^443322^', k, v for k, v of types.registry
    whisper '^46464^', '————————————————————————————————————————————————————————'
    #.......................................................................................................
    types.declare.quantity
      $value:   'float'
      $unit:    'nonempty.text'
    help '^960-1^', isa.quantity null
    help '^960-2^', isa.quantity {}
    help '^960-3^', isa.quantity { value: 1024, unit: 'kB', }
  #.........................................................................................................
  do =>
    types         = new Intertype()
    { declare
      create
      validate
      isa       } = types
    whisper '^46464^', '————————————————————————————————————————————————————————'
    declare.quantity
      $value: 'float'
      $unit:  'nonempty.text'
      default:
        value:    0
        unit:     null
    #.........................................................................................................
    # d = { value: 4, unit: 'kB', }
    # T?.eq ( validate.quantity d ), d
    # T?.ok ( validate.quantity d ) is d
    # # info '^3453^', create.quantity { unit: 'kB', }
    # info '^3453^', types.registry.quantity.test.toString()
    # # try validate.quantity {}                           catch error then warn GUY.trm.reverse error.message
    # # try validate.quantity { unit: '', }                catch error then warn GUY.trm.reverse error.message
    # # try validate.quantity { unit: 'kB', }              catch error then warn GUY.trm.reverse error.message
    help '^960-4^', isa.quantity null
    help '^960-5^', isa.quantity {}
    help '^960-6^', isa.quantity { value: 1024, unit: 'kB', }
    # try validate.quantity { value: 1024, unit: 'kB', } catch error then warn GUY.trm.reverse error.message
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_demo_type_cfgs_as_functions_1 = ->
  whisper '#############################################'
  class F extends Function
    constructor: ( ...P ) ->
      super '...P', 'return this._me.do(...P)'
      @_me      = @bind @
      @_me.hub  = @
      return @_me
    do: ( x ) -> x ** 2
  info '^981-1^', f = new F()
  info '^981-1^', f._me
  info '^981-1^', f.hub
  info '^981-1^', f instanceof F
  info '^981-1^', f()
  info '^981-1^', f 42
  return null

#-----------------------------------------------------------------------------------------------------------
@_demo_type_cfgs_as_functions_2 = ->
  whisper '#############################################'
  class Intertype
    create_type_cfg: ( cfg ) ->
      defaults  = { extras: true, collection: false, type: null, }
      cfg       = { defaults..., cfg..., }
      name      = cfg.type
      R         = ( ( x ) -> x ** 2 ).bind @
      GUY.props.hide R, k, v for k, v of cfg
      GUY.props.hide R, 'name', name
      R         = new GUY.props.Strict_owner { target: R, freeze: true, }
      return R
  types = new Intertype()
  f     = types.create_type_cfg { type: 'foobar', }
  urge '^982-1^', ( require 'util' ).inspect f  # [Function: foobar]
  urge '^982-2^', rpr f                         # [Function: foobar]
  urge '^982-3^', f                             # [Function: foobar]
  urge '^982-4^', f.toString()                  # function () { [native code] }
  urge '^982-5^', typeof f                      # function
  urge '^982-6^', { f, }                        # { f: [Function: foobar] }
  urge '^982-7^', Object.isFrozen f             # true
  urge '^982-8^', Object.isSealed f             # true
  # Object is frozen, sealed, and has a strict `get()`ter:
  try f.collection = true catch error then warn rvr error.message
  try f.xxx               catch error then warn rvr error.message
  try f.xxx = 111         catch error then warn rvr error.message
  info '^982-9^', f.name
  info '^982-10^', f 42
  return null

#-----------------------------------------------------------------------------------------------------------
@intertype_exception_guarding = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype
    Intertype_user_error } = require '../../../apps/intertype'
  #.........................................................................................................
  do =>                                                                                                      # 1  Branden
    types = new Intertype { errors: false, }                                                                 # 2  Thomasine
    T?.eq types.cfg.errors, false                                                                            # 3  Kellee
    T?.eq types.state.error, null                                                                            # 4  Latosha
    types.declare.oops          ( x ) -> throw new Error 'oops'                                              # 5  Marline
    types.declare.oops_anyway   ( x ) -> throw new Intertype_user_error 'oops'                               # 6  Hana
    types.declare.nevah         ( x ) -> false                                                               # 7  Inger
    types.isa.oops 42
    #....................................................................................................... # 8  Ebony
    T?.eq ( types.isa.oops 42 ), false;                                                                      # 9  Tanesha
    T?.ok types.state.error instanceof Error                                                                 # 10 Jayna
    T?.eq types.state.error.message, 'oops'                                                                  # 11 Tobias
    #....................................................................................................... # 12 Leisha
    T?.eq ( types.isa.optional.list.of.oops 42 ), false                                                      # 13 Raina
    T?.eq types.state.error, null                                                                            # 14 Hermila
    T?.eq ( types.isa.optional.list.of.oops [] ), true                                                       # 15 Kevin
    T?.eq types.state.error, null                                                                            # 16 Erick
    T?.eq ( types.isa.optional.list.of.oops null ), true                                                     # 17 Jody
    T?.eq types.state.error, null                                                                            # 18 Alex
    T?.eq ( types.isa.optional.list.of.oops [ 42, ] ), false                                                 # 15 Kevin
    T?.ok types.state.error instanceof Error                                                                 # 10 Jayna
    T?.eq types.state.error.message, 'oops'                                                                  # 11 Tobias
    #....................................................................................................... # 19 Morgan
    T?.throws /oops/, => types.isa.oops_anyway 42                                                            # 20 Britta
    T?.eq types.state.error, null                                                                            # 18 Alex
    #....................................................................................................... # 23 Gillian
    T?.eq ( types.isa.nevah 42 ), false                                                                      # 24 Collin
    T?.eq types.state.error, null                                                                            # 25 Tijuana
    return null                                                                                              # 26 Fannie
  #......................................................................................................... # 27 Carl
  do =>                                                                                                      # 28 Alia
    types = new Intertype()                                                                                  # 29 Nella
    T?.eq types.cfg.errors, true                                                                             # 30 Mauricio
    T?.eq types.state.error, null                                                                            # 31 Fe
    types.declare.oops          ( x ) -> throw new Error 'oops'                                              # 32 Edra
    types.declare.oops_anyway   ( x ) -> throw new Intertype_user_error 'oops'                               # 33 Corazon
    types.declare.nevah         ( x ) -> false                                                               # 34 Nola
    #....................................................................................................... # 35 Laine
    T?.throws /oops/, => types.isa.oops 42                                                                   # 36 Joanna
    T?.eq types.state.error, null                                                                            # 37 Vito
    T?.eq ( types.isa.nevah 42 ), false                                                                      # 38 Talisha
    T?.eq types.state.error, null                                                                            # 39 Alex
    #....................................................................................................... # 40 Latina
    T?.throws /oops/, => types.isa.oops_anyway 42                                                            # 41 Francisca
    T?.eq types.state.error, null                                                                            # 25 Tijuana
    return null                                                                                              # 44 Zenaida
  #.........................................................................................................
  do =>
    T?.throws /not a valid Intertype_constructor_cfg/, => types = new Intertype { errors: 42, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_check_complex_recursive_types = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  types             = new Intertype()
  { declare
    isa
    validate
    create        } = types
  #.........................................................................................................
  declare.quantity
    $value:         'float'
    $unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
  #.........................................................................................................
  declare.rectangle
    $width:         'quantity'
    $height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
  #.........................................................................................................
  debug '^342-1^', T?.eq ( isa.quantity           { value: 0, unit: 'mm', }                                                                                                                                 \
                                                                                                    ), true
  debug '^342-1^', T?.eq ( isa.rectangle          { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }                                                                                  \
                                                                                                    ), true
  debug '^342-2^', T?.eq ( isa.list.of.quantity   [ { value: 0, unit: 'mm', }, { value: 0, unit: 'mm', }, ]                                                                                                 \
                                                                                                    ), true
  debug '^342-2^', T?.eq ( isa.list.of.rectangle  [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]   \
                                                                                                    ), true
  debug '^342-3^', T?.eq ( isa.rectangle          []                                                                                                                                                        \
                                                                                                    ), false
  debug '^342-4^', T?.eq ( isa.rectangle          { value: 0, unit: null, }                                                                                                                                 \
                                                                                                    ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_intertype_isa_arity_check = ( T, done ) ->
  T?.halt_on_error()
  { Intertype } = require '../../../apps/intertype'
  #.........................................................................................................
  types = new Intertype()
  debug '^3454^', try types.isa.integer 42                          catch e then warn rvr e.message
  debug '^3454^', try types.isa.integer 42, 43                      catch e then warn rvr e.message
  debug '^3454^', try types.isa.optional.integer null               catch e then warn rvr e.message
  debug '^3454^', try types.isa.optional.integer null, null         catch e then warn rvr e.message
  debug '^3454^', try types.isa.optional.integer 42, null           catch e then warn rvr e.message
  debug '^3454^', try types.isa.optional.list.of.integer 42, null   catch e then warn rvr e.message
  debug '^3454^', try types.isa.optional.list.of.integer [], null   catch e then warn rvr e.message
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_normalize_type_cfg = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype
    Type_factory  } = require '../../../apps/intertype'
  types = new Intertype()
  TF    = new Type_factory types
  #.........................................................................................................
  prep = ( d ) ->
    R = {}
    for k in ( Object.keys d ).sort()
      v       = d[ k ]
      R[ k ]  = if _types.isa.function v then "f(#{v.name})" else v
    if d.fields?
      for k, v of d.fields
        d.fields[ k ] = "f(#{v.name})"
    return R
  # debug prep TF._normalize_type_cfg 't', 'list.of.integer'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 't'                                                                     ], null, /not a valid Type_factory_type_dsc/,                ]
    [ [ { name: 't', collection: false, }                                       ], null, /not a valid Type_factory_type_dsc/,                ]
    [ ['t', ( ( x ) -> @isa.object x ), { x: 'float', y: 'float', }             ], null, /expected a function or a nonempty text for `isa`/, ]
    [ [ 't', 'list.of.integer'                                                  ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:list.of.integer)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ { name: 't', collection: false, isa: 'positive0.integer', }             ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:positive0.integer)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ 't', { collection: false, }, 'list.of.integer'                          ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:list.of.integer)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ 't', { collection: false, }, ( x ) -> @isa.positive0.integer x          ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:#0)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ 't', ( x ) -> @isa.positive0.integer x                                  ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:#0)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ 't', { collection: false, isa: ( ( x ) -> @isa.positive0.integer x ), } ], { collection: false, create: null, extras: true, fields: null, freeze: false, isa: 'f(t:#0)', name: 't', typename: 't', override: false, replace: false, }, ]
    [ [ 'quantity', { $value: 'float', $unit: 'nonempty.text', }                ], { collection: false, create: null, extras: true, fields: { value: 'f(quantity.value:float)', unit: 'f(quantity.unit:nonempty.text)' }, freeze: false, isa: 'f(quantity:object)', name: 'quantity', typename: 'quantity', override: false, replace: false, }, ]
    [ [ 'foobar', { $foo: 'text', $bar: 'text', create: ( -> ), default: {}, extras: false, freeze: true, seal: true, collection: true, }, ( ( x ) -> x instanceof Foobar )                ], \
      { collection: true, create: 'f(create)', default: {}, extras: false, fields: { foo: 'f(foobar.foo:text)', bar: 'f(foobar.bar:text)' }, freeze: true, isa: 'f(foobar:#0)', name: 'foobar', seal: true, typename: 'foobar', override: false, replace: false, }, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # debug '^23-1^', { probe, matcher, error, }
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve prep TF._normalize_type_cfg probe...
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_tracing = ( T, done ) ->
  T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  noresult          = Symbol 'noresult'
  { declare
    isa
    validate
    create        } = types
  declare.quantity
    $value:         'float'
    $unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
  declare.rectangle
    $width:         'quantity'
    $height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
  declare.oops      ( x ) -> throw new Error 'oops'
  probes_and_matchers = [
    [ [ 'quantity',                                           [ { value: null, unit: 'foo', }, ],                                                                                                                         ], ]
    [ [ 'quantity',                                           { value: null, unit: 'foo', },                                                                                                                              ], ]
    [ [ 'quantity',                                           { value: 432, unit: 'foo', },                                                                                                                               ], ]
    [ [ 'rectangle',                                          [ 1, ],                                                                                                                                                         ], ]
    [ [ 'rectangle',                                          { value: 0, unit: 'mm', },                                                                                                                                  ], ]
    [ [ 'rectangle',                                          { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, },                                                                                   ], ]
    [ [ 'list.of.rectangle',                                  [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ],    ], ]
    [ [ 'list.of.rectangle',                                  [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: null, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ], ], ]
    [ [ 'integer.or.boolean',                                 42,                                                                                                                                                         ], ]
    [ [ 'integer.or.boolean',                                 true,                                                                                                                                                       ], ]
    [ [ 'integer.or.boolean',                                 'wat',                                                                                                                                                      ], ]
    [ [ 'integer.or.boolean.or.text',                         'wat',                                                                                                                                                      ], ]
    [ [ 'integer.or.boolean.or.text',                         'wat',                                                                                                                                                      ], ]
    [ [ 'integer.or.boolean.or.text.or.list.of.integer',      [ 2, ],                                                                                                                                                         ], ]
    [ [ 'integer.or.text.or.bigint.or.oops',                  [ 3, ],                                                                                                                                                         ], ]
    [ [ 'object',                                             [ 4, ],                                                                                                                                                         ], ]
    [ [ 'oops',                                               [ 5, ],                                                                                                                                                         ], ]
    [ [ 'optional.list.of.quantity',                          [ { value: null, unit: 'foo', }, ],                                                                                                                         ], ]
    [ [ 'optional.list.of.optional.integer.or.nonempty.text', [ 'foo', ],                                                                                                                                                 ], ]
    [ [ 'optional.list.of.optional.integer.or.nonempty.text', [ 'foo', 'bar', 'baz', 1234, ],                                                                                                                             ], ]
    [ [ 'optional.list.of.optional.integer.or.nonempty.text', [ 'foo', 'bar', 'baz', 3.5, ],                                                                                                                              ], ]
    [ [ 'optional.list.of.optional.integer.or.nonempty.text', false,                                                                                                                                                      ], ]
    # [ [ 'optional.list.of.optional.integer.or.nonempty.text', null, ], ] ### TAINT doesn't work??? ###
    [ [ 'integer.or.boolean.or.text.or.list.of.integer',      [ 'x', ],                                                                                                                                                   ], ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ hedgerow, value, ] = probe
      echo()
      echo()
      echo GUY.trm.grey '—————————————————————————————————————————————————————————————————'
      echo { hedgerow, value, }
      echo()
      error   = null
      result  = false
      hedges  = hedgerow.split '.'
      for verb in [ 'isa', ]
      # for verb in [ 'isa', 'validate', ]
        result = ( GUY.props.resolve_property_chain types[ verb ], hedges ) value
        echo types.get_state_report { format: 'all', }
        echo types.get_state_report { format: 'all', refs: true, }
        echo types.get_state_report { format: 'failing', }
        echo types.get_state_report { format: 'all', colors: false, }
      resolve undefined
  # debug '^15345^', isa.optional.object 42
  # debug '^15345^', isa.optional.object {}
  # debug '^15345^', ( isa.object 42 ), types.state
  # debug '^15345^', ( isa.object {} ), types.state
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_intertype_tracing_2 = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  noresult          = Symbol 'noresult'
  { declare
    isa
    validate
    create        } = types
  declare.quantity
    $value:         'float'
    $unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
  declare.rectangle
    $width:         'quantity'
    $height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
  declare.oops      ( x ) -> throw new Error 'oops'
  #.........................................................................................................
  cleanup = ( text ) ->
    R = text
    R = R.replace /\n/g, '⏎'
    R = R.replace /\s+/g, ' '
    return R
  #.........................................................................................................
  do =>
    isa.list.of.rectangle [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]
    echo types.get_state_report { format: 'all', }
    result = cleanup types.get_state_report { width: 191, format: 'all', colors: false, }
    urge rpr result
    T?.eq result, " T isa list [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎ T isa of [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎ T isa object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle:object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.width:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.height:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle:object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.width:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.height:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa list.of.rectangle [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎"
  do =>
    isa.list.of.rectangle [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: null, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]
    echo types.get_state_report { format: 'all', }
    echo types.get_state_report { format: 'failing', }
    result = cleanup types.get_state_report { width: 191, format: 'failing', colors: false, }
    urge rpr result
    T?.eq result, " F isa float null ⏎ F isa quantity.value:float { value: null, unit: 'mm' } ⏎ F isa rectangle.width:quantity { width: { value: null, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ F isa list.of.rectangle [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: null, unit: 'mm' }, height:…⏎"
  do =>
    isa.list.of.rectangle [ { width: { value: 0, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, { width: { value: null, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]
    echo types.get_state_report { format: 'failing', }
    echo types.get_state_report { format: 'short', }
    echo types.get_state_report { format: 'short', colors: false, }
    result = cleanup types.get_state_report { width: 191, format: 'short', colors: false, }
    urge rpr result
    T?.eq result, "F isa float null ◀ F isa quantity.value:float { value: null, unit: 'mm' } ◀ F isa rectangle.width:quantity { width: { value: null, unit: 'mm' }, height: { v…"
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_improved_validation_errors = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  noresult          = Symbol 'noresult'
  { declare
    isa
    validate
    create        } = types
  declare.quantity
    $value:         'float'
    $unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
  declare.rectangle
    $width:         'quantity'
    $height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
  declare.oops      ( x ) -> throw new Error 'oops'
  #.........................................................................................................
  cleanup = ( text ) ->
    R = text
    R = R.replace /\n/g, '⏎'
    R = R.replace /\s+/g, ' '
    return R
  #.........................................................................................................
  good_probe = [
    { width: { value: 0,    unit: 'mm', }, height: { value: 0, unit: 'mm', }, },
    { width: { value: 1234, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]
  #.........................................................................................................
  bad_probe = [
    { width: { value: 0,    unit: 'mm', }, height: { value: 0, unit: 'mm', }, },
    { width: { value: null, unit: 'mm', }, height: { value: 0, unit: 'mm', }, }, ]
  #.........................................................................................................
  do =>
    result = validate.optional.list.of.rectangle null
    T?.ok result is null
  #.........................................................................................................
  do =>
    result = validate.optional.list.of.rectangle good_probe
    T?.ok result is good_probe
  #.........................................................................................................
  do =>
    # debug '^4234^', validate.optional.list.of.rectangle null
    try
      validate.optional.list.of.rectangle 123
    catch error
      warn '^443-1^', error.message
  #.........................................................................................................
  do =>
    try
      validate.list.of.rectangle bad_probe
    catch error
      warn '^443-2^', rvr error.message
      result = error.message
      T?.ok ( result.match \
        /\(Intertype_validation_error\) not a valid list\.of\.rectangle; failing tests: F validate float null ◀ F validate quantity.value:float \{/ \
          ) isnt null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_intertype_demo_improved_validation_errors = ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  try
    types.validate.text 42
  catch error
    warn error.message
  types.validate.text 42
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@_demo_postconditions = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types = new Intertype()
  { declare
    isa
    validate
    create        } = types
  #.........................................................................................................
  plus_1 = ( a, b ) ->
    R = a + b
    return try validate.float.or.bigint R catch error
      0
  #.........................................................................................................
  plus_2 = ( a, b ) ->
    R = a + b
    return try validate.float.or.bigint R catch error
      throw new Error "these values can not be added: a: #{rpr a}, b: #{rpr b}"
  #.........................................................................................................
  debug '^210-1^',  try rpr plus_1 4, 6           catch error then warn rvr error.message; './.'
  debug '^210-2^',  try rpr plus_1 4n, 6n         catch error then warn rvr error.message; './.'
  debug '^210-2^',  try rpr plus_2 4n, 6n         catch error then warn rvr error.message; './.'
  debug '^210-3^',  try rpr plus_1 '4', '6'       catch error then warn rvr error.message; './.'
  debug '^210-4^',  try rpr plus_1 '4', 6         catch error then warn rvr error.message; './.'
  debug '^210-5^',  try rpr plus_1 4, '6'         catch error then warn rvr error.message; './.'
  debug '^210-6^',  try rpr plus_1 4, true        catch error then warn rvr error.message; './.'
  debug '^210-7^',  try rpr plus_1 4, false       catch error then warn rvr error.message; './.'
  debug '^210-8^',  try rpr plus_1 4, null        catch error then warn rvr error.message; './.'
  debug '^210-9^',  try rpr plus_1 4, undefined   catch error then warn rvr error.message; './.'
  debug '^210-10^', try rpr plus_2 4, undefined   catch error then warn rvr error.message; './.'
  debug '^210-11^', try rpr plus_2 4, {}          catch error then warn rvr error.message; './.'
  debug '^210-3^',  try rpr plus_2 '4', '6'       catch error then warn rvr error.message; './.'
  # T?.eq ( )
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@_intermezzo_private_class_features_in_coffeescript = ->
  ### thx to https://crimefighter.svbtle.com/using-private-methods-in-coffeescript ###
  class SomeClass
    # this line is identical to `publicMethod: ->`
    this::publicMethod = -> '*' + privateMethod() + '*'
    privateProperty = 'foo'
    privateMethod = -> privateProperty
  #.........................................................................................................
  x = new SomeClass()
  for key from GUY.props.walk_keys x, { hidden: true, symbols: true, builtins: true, }
    debug '^342-1^', key
  info '^343-2^', x.publicMethod()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@intertype_equals_distinguishes_positive_from_negative_zero = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  debug '^34-1^', types.equals -0, +0
  debug '^34-2^', types.equals +0, +0
  debug '^34-3^', types.equals -0, -0
  T?.eq ( types.equals        -0, +0    ), false
  T?.eq ( GUY.samesame.equals -0, +0    ), false
  T?.eq ( types.equals        NaN, NaN  ), true
  T?.eq ( GUY.samesame.equals NaN, NaN  ), true
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_can_use_detached_type_of_method = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  { type_of }     = types
  T?.eq ( type_of 55          ), 'float'
  T?.eq ( type_of {}          ), 'object'
  T?.eq ( type_of ->          ), 'function'
  T?.eq ( type_of -> await x  ), 'asyncfunction'
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_type_regex = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  #.........................................................................................................
  show_error = ( error ) -> warn rvr ( error.message.split /\n/ )[ 0 ]
  #.........................................................................................................
  do ->
    types           = new Intertype()
    debug '^77-1^',     types.type_of /x/
    debug '^77-2^',     types.isa.regex /x/
    debug '^77-3^', not types.isa.regex 'x'
    debug '^77-4^', not types.isa.regex 42
    T?.eq ( types.type_of /x/ ), 'regex'
    T?.ok     types.isa.regex /x/
    T?.ok not types.isa.regex 'x'
    T?.ok not types.isa.regex 42
  #.........................................................................................................
  do ->
    types           = new Intertype()
    types.declare.foo
      fields:
        bar:    'text'
      default:
        bar:    'baz'
    debug '^77-5^', try types.create.foo()                  catch e then show_error e
    debug '^77-6^', try types.create.foo {}                 catch e then show_error e
    debug '^77-7^', try types.create.foo { bar: 'helo', }   catch e then show_error e
    # debug '^77-8^', try types.create.foo { bar: /world/y, } catch e then show_error e
  #.........................................................................................................
  do ->
    types           = new Intertype()
    types.declare.foo
      fields:
        bar:    'regex'
      default:
        bar:    /baz/
    debug '^77-9^', try types.create.foo()                  catch e then show_error e
    debug '^77-10^', try types.create.foo {}                 catch e then show_error e
    # debug '^77-11^', try types.create.foo { bar: 'helo', }   catch e then show_error e
    debug '^77-12^', try types.create.foo { bar: /world/y, } catch e then show_error e
  #.........................................................................................................
  do ->
    types           = new Intertype()
    types.declare.foo
      fields:
        bar:    'text.or.regex'
      default:
        bar:    /baz/
    debug '^77-13^', try types.create.foo()                  catch e then show_error e
    debug '^77-14^', try types.create.foo {}                 catch e then show_error e
    debug '^77-15^', try types.create.foo { bar: 'helo', }   catch e then show_error e
    debug '^77-16^', try types.create.foo { bar: /world/y, } catch e then show_error e
    T?.eq ( types.create.foo()                  ), { bar: /baz/, }
    T?.eq ( types.create.foo {}                 ), { bar: /baz/, }
    T?.eq ( types.create.foo { bar: 'helo', }   ), { bar: 'helo', }
    T?.eq ( types.create.foo { bar: /world/y, } ), { bar: /world/y, }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_has_type_for_negative_zero = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  #.........................................................................................................
  T?.eq ( types.isa.positive0 +0 ), true
  T?.eq ( types.isa.negative0 -0 ), true
  T?.eq ( types.isa.positive  +0 ), true
  T?.eq ( types.isa.negative  -0 ), true
  #.........................................................................................................
  T?.eq ( types.isa.negative  +0 ), false
  T?.eq ( types.isa.negative0 +0 ), false
  T?.eq ( types.isa.positive0 -0 ), false
  T?.eq ( types.isa.positive  -0 ), false
  T?.eq ( types.isa.positive1 -0 ), false
  T?.eq ( types.isa.positive1 +0 ), false
  T?.eq ( types.isa.negative1 -0 ), false
  T?.eq ( types.isa.negative1 +0 ), false
  #.........................................................................................................
  T?.eq ( types.isa.zero          -0 ), true
  T?.eq ( types.isa.zero          +0 ), true
  T?.eq ( types.isa.negative.zero -0 ), true
  T?.eq ( types.isa.positive.zero +0 ), true
  T?.eq ( types.isa.positive.zero -0 ), false
  T?.eq ( types.isa.negative.zero +0 ), false
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_has_data_property = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  #.........................................................................................................
  T?.ok types.isa.object types.data
  types.declare 'foobar', ( x ) -> ( @data.foobar ?= [] ).push x; return true
  types.isa.foobar 42
  types.isa.foobar "yes"
  types.validate.foobar false
  T?.eq types.data, { foobar: [ 42, "yes", false, ] }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_ordering_of_field_and_isa_tests = ( T, done ) ->
  { Intertype }   = require '../../../apps/intertype'
  types           = new Intertype()
  #.........................................................................................................
  collector       = []
  types.declare 'foobar',
    $myfield: 'cardinal'
    isa: ( x ) -> collector.push x; return true
  types.validate.foobar { myfield: 42, }
  try types.validate.foobar { myfield: 1.2, } catch e then warn rvr e.message
  ### NOTE because `isa()` is now called after fields are validated, it will never be called if any field
  is nonconformant, so only the tracing of the first probe is present in the collector: ###
  T?.eq collector, [ { myfield: 42 } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_can_use_subobject_fields = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  noresult          = Symbol 'noresult'
  { declare
    isa
    validate
    create        } = types
  declare.quantity
    fields:
      value:         'float'
      unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
  declare.rectangle
    fields:
      width:         'quantity'
      height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
  #.........................................................................................................
  T?.throws /not a valid quantity/, -> validate.quantity null
  T?.throws /not a valid quantity/, -> validate.quantity { unit: 'kg', }
  T?.eq ( validate.quantity { value: 0, unit: 'kg', } ), { value: 0, unit: 'kg', }
  T?.eq ( create.quantity { unit: 'kg', } ), { value: 0, unit: 'kg', }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_cast = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  collector         = []
  { declare
    isa
    type_of
    validate
    create
    cast          } = types
  declare.quantity
    fields:
      value:         'float'
      unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
    cast: ( x ) ->
      T?.ok @ instanceof Intertype
      T?.ok @ is types
      return x unless @isa.nonempty.text x
      return x unless ( match = x.match /^(?<value>.*?)(?<unit>\D*)$/ )?
      { value
        unit  } = match.groups
      value     = parseFloat value
      return x unless isa.float value
      return x unless isa.nonempty.text unit
      return { value, unit, }
  declare.rectangle
    fields:
      width:         'quantity'
      height:        'quantity'
    extras:         false
    default:
      width:        { value: 0, unit: 'mm', }
      height:       { value: 0, unit: 'mm', }
    cast: ( width, height ) ->
      T?.ok @ instanceof Intertype
      T?.ok @ is types
      return
        width:  { value: width,   unit: 'mm', }
        height: { value: height,  unit: 'mm', }
  #.........................................................................................................
  # T?.eq ( type_of types.registry.quantity.cast ), 'function'
  T?.ok isa.quantity { value: 102, unit: 'kg', }
  show = ( x ) -> info '^show@454^', rpr x; x
  debug '^4456-1^', isa.quantity '2kg'
  debug '^4456-2^', cast.quantity '102kg'
  try cast.quantity '2e3' catch e then warn rvr e.message
  T?.throws /not a valid/, -> try cast.quantity '2e3' catch e then warn rvr e.message; throw e
  T?.throws /not a valid/, -> try cast.quantity 'kg'  catch e then warn rvr e.message; throw e
  T?.eq ( show create.quantity show { value: 102, unit: 'kg', }              ), { value: 102, unit: 'kg', }
  # T?.eq ( show create.quantity show cast.quantity '102kg'  ), { value: 102, unit: 'kg', }
  # x = show cast.quantity '123kg'
  # T?.eq ( show create.quantity show x  ), { value: 123, unit: 'kg', }
  T?.eq ( x = cast.rectangle 3, 4 ), { width: { value: 3, unit: 'mm' }, height: { value: 4, unit: 'mm' } }
  validate.rectangle x
  T?.eq ( create.rectangle x ), { width: { value: 3, unit: 'mm' }, height: { value: 4, unit: 'mm' } }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_create_has_correct_binding = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  collector         = []
  { declare
    isa
    type_of
    validate
    create
    cast          } = types
  declare.quantity
    fields:
      value:         'float'
      unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
    create: ( x ) ->
      debug '^3434^', @
      T?.ok @ instanceof Intertype
      T?.ok @ is types
      return x
  #.........................................................................................................
  # T?.eq ( type_of types.registry.quantity.cast ), 'function'
  T?.ok isa.quantity { value: 102, unit: 'kg', }
  T?.eq ( create.quantity { value: 3, unit: 'mm' } ), { value: 3, unit: 'mm' }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_create_may_return_frozen_sealed_value = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  collector         = []
  { declare
    isa
    type_of
    validate
    create
    cast          } = types
  declare.quantity
    fields:
      value:         'float'
      unit:          'nonempty.text'
    extras:         false
    default:
      value:    0
      unit:     null
    create: ( x ) ->
      return Object.freeze Object.seal x
  #.........................................................................................................
  # T?.eq ( type_of types.registry.quantity.cast ), 'function'
  T?.ok isa.quantity { value: 102, unit: 'kg', }
  T?.eq ( create.quantity { value: 3, unit: 'mm' } ), { value: 3, unit: 'mm' }
  T?.ok Object.isFrozen create.quantity { value: 3, unit: 'mm' }
  T?.ok Object.isSealed create.quantity { value: 3, unit: 'mm' }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_equals_available_as_module_static_method = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  { equals        } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  #.........................................................................................................
  T?.eq ( _types.type_of        equals ), 'function'
  T?.eq ( _types.type_of  types.equals ), 'function'
  T?.ok equals is types.equals
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@intertype_asyncfunction_isnt_a_function = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  #.........................................................................................................
  T?.eq ( types.type_of           ( -> 42       ) ), 'function'
  T?.eq ( types.isa.function      ( -> 42       ) ), true
  T?.eq ( types.isa.function      ( -> await 42 ) ), false
  #.........................................................................................................
  T?.eq ( types.type_of           ( -> await 42 ) ), 'asyncfunction'
  T?.eq ( types.isa.asyncfunction ( -> await 42 ) ), true
  T?.eq ( types.isa.asyncfunction ( -> 42       ) ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@override_types_are_honored = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype { errors: false, }
  { declare }       = types
  #.........................................................................................................
  declare.function0
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 0 )
    default:    ->
    override:   true
  #.........................................................................................................
  declare.function1
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 1 )
    default:    ( x ) ->
    override:   true
  #.........................................................................................................
  declare.function2
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 2 )
    default:    ( x, y ) ->
    override:   true
  #.........................................................................................................
  declare.function3
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 3 )
    default:    ( x, y, z ) ->
    override:   true
  #.........................................................................................................
  T?.eq ( types.type_of ->                  ), 'function0'
  T?.eq ( types.type_of ( x ) ->            ), 'function1'
  T?.eq ( types.type_of ( x, y ) ->         ), 'function2'
  T?.eq ( types.type_of ( x, y, z ) ->      ), 'function3'
  T?.eq ( types.type_of ( x, y, z, a ) ->   ), 'function'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_clone_instance = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types_1           = new Intertype()
  #.........................................................................................................
  types_1.declare.function0
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 0 )
    default:    ->
    override:   true
  #.........................................................................................................
  types_1.declare.function1
    isa:        ( x ) -> ( @isa.function x ) and ( x.length is 1 )
    default:    ( x ) ->
    override:   true
  #.........................................................................................................
  types_2 = new Intertype types_1
  #.........................................................................................................
  # debug '^45-1^', types_1 is types_2
  # debug '^45-2^', types_1.registry.function0
  # debug '^45-2^', ( GUY.props.keys types_1.registry.function0, { hidden: true, } )
  # debug '^45-3^', types_2.registry.function0
  # debug '^45-4^', types_1.type_of ->
  # debug '^45-5^', types_1.isa.function0 ->
  # debug '^45-6^', types_2.type_of ->
  # debug '^45-7^', types_2.isa.function0 ->
  # debug '^45-8^', types_2.registry.function0
  # debug '^45-9^', types_2.registry.function1
  #.........................................................................................................
  T?.ok types_1 isnt types_2
  T?.eq ( types_2.isa.function0 ->        ),  true
  T?.eq ( types_2.isa.function1 ->        ),  false
  T?.eq ( types_2.isa.function0 ( x ) ->  ),  false
  T?.eq ( types_2.isa.function1 ( x ) ->  ),  true
  T?.eq types_1.registry.function0.override,  true
  T?.eq types_2.registry.function0.override,  true
  T?.eq types_1.overrides.length,             2
  T?.eq types_2.overrides.length,             2
  #.........................................................................................................
  T?.eq ( types_1.type_of ->                  ), 'function0'
  T?.eq ( types_1.type_of ( x ) ->            ), 'function1'
  T?.eq ( types_1.type_of ( x, y ) ->         ), 'function'
  #.........................................................................................................
  T?.eq ( types_2.type_of ->                  ), 'function0'
  T?.eq ( types_2.type_of ( x ) ->            ), 'function1'
  T?.eq ( types_2.type_of ( x, y ) ->         ), 'function'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_replace_declarations = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype()
  { declare
    type_of
    isa           } = types
  #.........................................................................................................
  declare.explanation_for_everything
    isa:        ( x ) -> x is null
    default:    null
    override:   true
  #.........................................................................................................
  declare.other_type
    isa:        ( x ) -> false
    override:   true
  #.........................................................................................................
  T?.eq ( isa.explanation_for_everything null                 ), true
  T?.eq ( type_of null                                        ), 'explanation_for_everything'
  T?.eq ( types.registry.explanation_for_everything.override  ), true
  T?.eq ( types.overrides.length                              ), 2
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'other_type'
  T?.eq ( types.overrides[ 1 ][ 0 ]                           ), 'explanation_for_everything'
  #.........................................................................................................
  declare.explanation_for_everything
    replace:    true
    isa:        ( x ) -> x is 42
    default:    42
    override:   true
  #.........................................................................................................
  T?.eq ( isa.explanation_for_everything null                 ), false
  T?.eq ( type_of null                                        ), 'null'
  T?.eq ( type_of 42                                          ), 'explanation_for_everything'
  T?.eq ( types.registry.explanation_for_everything.override  ), true
  T?.eq ( types.overrides.length                              ), 2
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'other_type'
  T?.eq ( types.overrides[ 1 ][ 0 ]                           ), 'explanation_for_everything'
  #.........................................................................................................
  declare.explanation_for_everything
    replace:    true
    isa:        ( x ) -> x is 42
    default:    42
    override:   false
  #.........................................................................................................
  T?.eq ( isa.explanation_for_everything 42                   ), true
  T?.eq ( type_of 42                                          ), 'float'
  T?.eq ( types.registry.explanation_for_everything.override  ), false
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'other_type'
  T?.eq ( types.overrides.length                              ), 1
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@can_delete_and_redeclare_types = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype()
  { declare
    type_of
    isa
    remove        } = types
  #.........................................................................................................
  declare.explanation_for_everything
    isa:        ( x ) -> x is null
    default:    null
    override:   true
  #.........................................................................................................
  declare.other_type
    isa:        ( x ) -> false
    override:   true
  #.........................................................................................................
  T?.eq ( isa.explanation_for_everything null                 ), true
  T?.eq ( type_of null                                        ), 'explanation_for_everything'
  T?.eq ( types.registry.explanation_for_everything.override  ), true
  T?.eq ( types.overrides.length                              ), 2
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'other_type'
  T?.eq ( types.overrides[ 1 ][ 0 ]                           ), 'explanation_for_everything'
  #.........................................................................................................
  remove.explanation_for_everything()
  #.........................................................................................................
  T?.eq ( GUY.props.get types.registry, 'explanation_for_everything', null  ), null
  T?.eq ( type_of null                                        ), 'null'
  T?.eq ( types.overrides.length                              ), 1
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'other_type'
  #.........................................................................................................
  declare.explanation_for_everything
    isa:        ( x ) -> x is null
    default:    null
    override:   true
  #.........................................................................................................
  T?.eq ( type_of null                                        ), 'explanation_for_everything'
  T?.eq ( types.overrides.length                              ), 2
  T?.eq ( types.overrides[ 0 ][ 0 ]                           ), 'explanation_for_everything'
  T?.eq ( types.overrides[ 1 ][ 0 ]                           ), 'other_type'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@detect_circular_declarations = ( T, done ) ->
  # T?.halt_on_error()
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype()
  { declare
    type_of
    isa
    remove        } = types
  #.........................................................................................................
  declare.type_a override: true, isa: ( x ) -> @isa.type_b x
  declare.type_b override: true, isa: ( x ) -> @isa.type_c x
  declare.type_c override: true, isa: ( x ) -> @isa.type_d x
  declare.type_d override: true, isa: ( x ) -> @isa.type_a x
  #.........................................................................................................
  debug '^87-1^', type_of null
  debug '^87-2^', type_of 42
  debug '^87-3^', type_of 'helo'
  debug '^87-4^', isa.type_a null
  debug '^87-5^', isa.type_a 42
  debug '^87-6^', isa.type_a 'helo'
  debug '^87-7^', isa.type_b null
  debug '^87-8^', isa.type_b 42
  debug '^87-9^', isa.type_b 'helo'
  debug '^87-9^', isa.text 'helo'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@strange_naming_bug = ( T, done ) ->
  # T?.halt_on_error()
  misfit            = Symbol 'misfit'
  { Intertype     } = require '../../../apps/intertype'
  types             = new Intertype()
  { declare       } = types
  #.........................................................................................................
  declare.modifiers
    fields:
      first:      'anything'
      last:       'anything'
    default:
      first:      misfit
      last:       misfit
    create: ( x ) ->
      return { first: misfit, last: misfit, } unless x?
      return x unless @isa.object x
      return { first: ( GUY.props.get x, 'first', misfit ), last: ( GUY.props.get x, 'last',  misfit ), }
  #.........................................................................................................
  done?()


############################################################################################################
unless module.parent?
  # demo()
  # @_demo_hedgepath_resolution()
  # @validate_1()
  # @isa_x_or_y()
  # test @isa_x_or_y
  # @create_with_seal_freeze_extra()
  # test @create_with_seal_freeze_extra
  # test @intertype_existential_types
  # @intertype_collection_of_t()
  # test @intertype_collection_of_t
  # @intertype_even_odd_for_bigints()
  # test @intertype_even_odd_for_bigints
  # @intertype_declaration_with_per_key_clauses()
  # test @intertype_declaration_with_per_key_clauses
  # @_demo_type_cfgs_as_functions_1()
  # @_demo_type_cfgs_as_functions_2()
  # @_demo_nameit()
  # test @[ "forbidden to overwrite declarations" ]
  # @intertype_normalize_type_cfg()
  # test @intertype_normalize_type_cfg
  # @_intermezzo_private_class_features_in_coffeescript()
  # test @intertype_empty_and_nonempty
  # @_intertype_isa_arity_check()
  # test @intertype_exception_guarding
  # @intertype_declaration_with_per_key_clauses()
  # test @intertype_isa_arity_check
  # test @intertype_check_complex_recursive_types
  # @_demo_postconditions()
  # @validate_1()
  # test @validate_1
  # @_intertype_demo_improved_validation_errors()
  # test @intertype_cast
  # test @intertype_can_use_subobject_fields
  # test @intertype_create_has_correct_binding
  # @intertype_type_regex()
  # test @intertype_type_regex
  # @override_types_are_honored()
  # @can_clone_instance()
  # test @can_clone_instance
  # @can_replace_declarations()
  # test @can_replace_declarations
  # @can_delete_and_redeclare_types()
  # test @can_delete_and_redeclare_types
  # test @detect_circular_declarations
  # @strange_naming_bug()
  # test @strange_naming_bug
  test @
  # test @intertype_ordering_of_field_and_isa_tests
  # test @intertype_tracing
  # test @_intertype_tracing_2
  # test @intertype_improved_validation_errors
  # @validate_returns_value()
  # test @validate_returns_value


