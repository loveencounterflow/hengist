

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'LFTNG'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
Multimix                  = require 'multimix'
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
frozen                    = Object.isFrozen
assign                    = Object.assign
shallow_freeze            = Object.freeze
shallow_copy              = ( x ) -> assign ( if Array.isArray x then [] else {} ), x
{ klona: deep_copy, }     = require 'klona/json'


#===========================================================================================================
types.declare 'mutable', ( x ) -> ( @isa.object x ) or ( @isa.list x )

#-----------------------------------------------------------------------------------------------------------
types.declare 'lft_cfg', tests:
  "x is an object":                       ( x ) -> @isa.object x
  "x.freeze is a boolean":                ( x ) -> @isa.boolean x.freeze
  ### NOTE the following restriction is only there to help API transition and will be omitted in the realease version ###
  "x.copy must not be used":              ( x ) -> not x.copy?

#-----------------------------------------------------------------------------------------------------------
defaults =
  cfg:
    freeze: true

#===========================================================================================================
deep_freeze = ( d ) ->
  ### immediately return for zero, empty string, null, undefined, NaN, false, true: ###
  return d if ( not d ) or d is true
  ### thx to https://github.com/lukeed/klona/blob/master/src/json.js ###
  switch ( Object::toString.call d )
    when '[object Array]'
      k = d.length
      while ( k-- )
        continue unless ( v = d[ k ] )? and ( ( typeof v ) is 'object' )
        d[ k ] = deep_freeze v
      return shallow_freeze d
    when '[object Object]'
      for k, v of d
        continue unless v? and ( ( typeof v ) is 'object' )
        d[ k ] = deep_freeze v
      return shallow_freeze d
  return d


#===========================================================================================================
copy_y_freeze_y$set = ( me, k, v ) ->
  R       = shallow_copy me
  R[ k ]  = v
  return shallow_freeze R

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$set = ( me, k, v ) ->
  R       = shallow_copy me
  R[ k ]  = v
  return R

# #-----------------------------------------------------------------------------------------------------------
# copy_n_freeze_n$set = ( me, k, v ) ->
#   me[ k ] = v
#   return me

#===========================================================================================================
# copy_y_freeze_y$new_object  = ( P...     ) -> deep_freeze deep_copy assign {}, P...
# copy_y_freeze_n$new_object  = ( P...     ) ->             deep_copy assign {}, P...
# copy_n_freeze_n$new_object  = ( P...     ) ->                       assign {}, P...

#===========================================================================================================
copy_y_freeze_y$assign      = ( me, P... ) -> deep_freeze deep_copy assign {}, me, P...
copy_y_freeze_n$assign      = ( me, P... ) ->             deep_copy assign {}, me, P...
# copy_n_freeze_n$assign      = ( me, P... ) ->                       assign     me, P...

#===========================================================================================================
copy_y_freeze_y$lets = ( original, modifier ) ->
  draft = @thaw original
  modifier draft if modifier?
  return deep_freeze draft

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$lets = ( original, modifier ) ->
  draft = @thaw original
  modifier draft if modifier?
  return deep_copy draft

# #-----------------------------------------------------------------------------------------------------------
# copy_n_freeze_n$lets = ( original, modifier ) ->
#   draft = @thaw original
#   modifier draft if modifier?
#   return draft


#===========================================================================================================
copy_y_freeze_y$freeze  = ( me ) -> deep_freeze me
copy_y_freeze_n$freeze  = ( me ) -> me
# copy_n_freeze_n$freeze  = ( me ) -> me

#===========================================================================================================
copy_y_freeze_y$thaw    = ( me ) -> deep_copy me
copy_y_freeze_n$thaw    = ( me ) -> deep_copy me
### NOTE with `{ copy: false, }` the `thaw()` method will still make a copy if value is frozen ###
### TAINT may fail if some properties are frozen, not object itself ###
# copy_n_freeze_n$thaw    = ( me ) -> if ( frozen me ) then deep_copy me else me


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Lft extends Multimix

  #---------------------------------------------------------------------------------------------------------
  @types: types

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super()
    types.validate.lft_cfg @cfg = shallow_freeze { defaults.cfg..., cfg..., }
    # if @cfg.copy
    if @cfg.freeze
      # @new_object = copy_y_freeze_y$new_object
      @set        = copy_y_freeze_y$set
      @assign     = copy_y_freeze_y$assign
      @lets       = copy_y_freeze_y$lets
      @freeze     = copy_y_freeze_y$freeze
      @thaw       = copy_y_freeze_y$thaw
    else
      # @new_object = copy_y_freeze_n$new_object
      @set        = copy_y_freeze_n$set
      @assign     = copy_y_freeze_n$assign
      @lets       = copy_y_freeze_n$lets
      @freeze     = copy_y_freeze_n$freeze
      @thaw       = copy_y_freeze_n$thaw
    # else
    #   if @cfg.freeze
    #     ### TAINT move to `types.validate.lft_settings cfg` ###
    #     throw new Error "^3446^ cannot use { copy: false, } with { freeze: true, }"
    #   else
    #     # # @new_object = copy_n_freeze_n$new_object
    #     # @set        = copy_n_freeze_n$set
    #     # @assign     = copy_n_freeze_n$assign
    #     # @lets       = copy_n_freeze_n$lets
    #     # @freeze     = copy_n_freeze_n$freeze
    #     # @thaw       = copy_n_freeze_n$thaw
    return @

  #---------------------------------------------------------------------------------------------------------
  get: ( me, k ) -> me[ k ]



############################################################################################################
module.exports = LFT = new Lft()
assign LFT, { Lft, }



