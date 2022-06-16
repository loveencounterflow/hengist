
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
_types                    = new ( require '../../../apps/intertype' ).Intertype

_types.defaults = {}
_types.declare 'ityp_constructor_cfg', tests:
  "@isa.object x":    ( x ) -> @isa.object x
# _types.


#===========================================================================================================
### TAINT use proper error classes as in DBay ###
class E_no_such_property extends Error


#===========================================================================================================
class Extensible_proxy

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    ### thx to https://stackoverflow.com/a/40714458/7568091 ###
    self = @
    #.......................................................................................................
    @has = new Proxy {},
      get: ( _, key ) =>
        return self[ key ] isnt undefined
    #.......................................................................................................
    return new Proxy @,
      #.....................................................................................................
      get: ( target, key ) =>
        if ( R = target[ key ] ) is undefined
          throw new E_no_such_property "^ityp@1^ #{@constructor.name} instance does not have property #{rpr key}"
        return R
      # set: ( target, key, value ) =>
      #   target[key] = value
      #   return true


#===========================================================================================================
class Intertype_abc extends Extensible_proxy


#===========================================================================================================
class Defaults extends Intertype_abc

#===========================================================================================================
class Isa extends Intertype_abc

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    return undefined


#===========================================================================================================
class Intertype extends Intertype_abc

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    optional            = {}
    @defaults           = {}
    @isa                = {}
    @isa.list_of        = {}
    @isa.optional       = optional
    @validate           = {}
    @validate.list_of   = {}
    @validate.optional  = optional
    return undefined

  #---------------------------------------------------------------------------------------------------------
  declare: ( cfg ) =>



#===========================================================================================================
x = new Intertype()
urge x.foo = 42
urge x.foo
urge x.has
urge x.has.foo
urge x.has.bar
try urge x.bar catch error then warn CND.reverse error.message






