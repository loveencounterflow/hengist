
'use strict'


############################################################################################################
# njs_util                  = require 'util'
njs_path                  = require 'path'
# njs_fs                    = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'INTERTYPE/demo-ng'
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
GUY                       = require '../../../apps/guy'
_types                    = new ( require '../../../apps/intertype' ).Intertype

_types.defaults = {}
_types.declare 'ityp_constructor_cfg', tests:
  "@isa.object x":    ( x ) -> @isa.object x
# _types.


#===========================================================================================================
class Intertype_abc extends GUY.props.Strict_owner

  # #---------------------------------------------------------------------------------------------------------
  # constructor: ->
  #   super()
  #   return undefined

#===========================================================================================================
class Empty     extends Intertype_abc
class Nonempty  extends Intertype_abc
class List_of   extends Intertype_abc
class Defaults  extends Intertype_abc

#===========================================================================================================
class Isa_list_of extends Intertype_abc

#===========================================================================================================
class Validate_list_of extends Intertype_abc

#===========================================================================================================
class Isa_empty extends Intertype_abc
  list_of:    new Isa_list_of()

#===========================================================================================================
class Validate_empty extends Intertype_abc
  list_of:    new Validate_list_of()

#===========================================================================================================
class Isa_nonempty extends Intertype_abc
  list_of:    new Isa_list_of()

#===========================================================================================================
class Validate_nonempty extends Intertype_abc
  list_of:    new Validate_list_of()

#===========================================================================================================
class Isa_optional extends Intertype_abc
  empty:      new Isa_empty()
  nonempty:   new Isa_nonempty()
  list_of:    new Isa_list_of()

#===========================================================================================================
class Validate_optional extends Intertype_abc
  empty:      new Validate_empty()
  nonempty:   new Validate_nonempty()
  list_of:    new Validate_list_of()


#===========================================================================================================
class Isa extends Intertype_abc
  optional:   new Isa_optional()
  empty:      new Isa_empty()
  nonempty:   new Isa_nonempty()
  list_of:    new Isa_list_of()

#===========================================================================================================
class Validate extends Intertype_abc
  optional:   new Validate_optional()
  empty:      new Validate_empty()
  nonempty:   new Validate_nonempty()
  list_of:    new Validate_list_of()

#===========================================================================================================
class Intertype extends Intertype_abc

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    @defaults           = new Defaults()
    @isa                = new Isa()
    @validate           = new Validate()
    return undefined

  #---------------------------------------------------------------------------------------------------------
  declare: ( name, tests ) =>



#===========================================================================================================
x = new Intertype()
urge x.foo = 42
urge x.foo
urge x.has
urge x.has.foo
urge x.has.bar
try urge x.bar catch error then warn CND.reverse error.message

js_type_of               = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
length_of = ( x ) ->
  throw new Error "^1^" unless x?
  return x.length if Object.hasOwnProperty x, length
  return x.size   if Object.hasOwnProperty x, size
  return ( Object.keys x ).length if ( js_type_of x ) is 'object'
  throw new Error "^2^"
nonempty  = ( x ) -> ( length_of x ) > 0
empty     = ( x ) -> ( length_of x ) == 0
list_of   = ( type, x ) ->
  return false unless ( js_type_of x ) is 'array'
  return true if x.length is 0
  # return x.every ( e ) -> isa type, e
  return x.every ( e ) -> ( js_type_of e ) is type ### TAINT should use `isa` ###

###

types.isa.integer                                           42
types.isa.even.integer                                      -42
types.isa.odd.integer                                       41
types.isa.negative1.integer                                 -42
types.isa.negative0.integer                                 0
types.isa.positive1.integer                                 42
types.isa.positive0.integer                                 0
types.isa.list_of.integer                                   [ 42, ]
types.isa.nonempty.list_of.negative1.integer                [ -42, ]
types.isa.nonempty.list_of.negative0.integer                [ 0, ]
types.isa.nonempty.list_of.positive1.integer                [ 42, ]
types.isa.nonempty.list_of.positive0.integer                [ 0, ]
types.isa.empty.list_of.integer                             []
types.isa.nonempty.list_of.integer                          [ 42, ]
types.isa.optional.integer                                  42
types.isa.optional.list_of.integer                          [ 42, ]
types.isa.optional.empty.list_of.integer                    []
types.isa.optional.nonempty.list_of.integer                 [ 42, ]
types.isa.optional.negative1.integer                        -42
types.isa.optional.negative0.integer                        0
types.isa.optional.positive1.integer                        42
types.isa.optional.positive0.integer                        0
types.isa.optional.nonempty.list_of.negative1.integer       [ -42, ]
types.isa.optional.nonempty.list_of.negative0.integer       [ 0, ]
types.isa.optional.nonempty.list_of.positive1.integer       [ 42, ]
types.isa.optional.nonempty.list_of.positive0.integer       [ 0, ]
types.isa.optional.empty.list_of.negative1.integer          -42
types.isa.optional.empty.list_of.negative0.integer          0
types.isa.optional.empty.list_of.positive1.integer          42
types.isa.optional.empty.list_of.positive0.integer          0

[all]     [all]     [collections]   [collections]   [numerical]   [numerical]   [mandatory]
————————————————————————————————————————————————————————————————————————————————————————————
isa       optional  empty           list_of         even          negative0     <type>
validate            nonempty                        odd           negative1
                                                                  positive0
                                                                  positive1

###



