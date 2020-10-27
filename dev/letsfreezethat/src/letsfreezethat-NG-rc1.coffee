

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


#===========================================================================================================
types.declare 'mutable', ( x ) -> ( @isa.object x ) or ( @isa.list x )

#-----------------------------------------------------------------------------------------------------------
types.declare 'lft_cfg', tests:
  "x is an object":                       ( x ) -> @isa.object x
  "x.copy is a boolean":                  ( x ) -> @isa.boolean x.copy
  "x.freeze is a boolean":                ( x ) -> @isa.boolean x.freeze
  "x.copy: false implies x.freeze false": ( x ) -> if not x.copy then not x.freeze else true

#-----------------------------------------------------------------------------------------------------------
defaults =
  cfg:
    copy:   true
    freeze: true

#===========================================================================================================
copy_y_freeze_y$set = ( me, k, v ) ->
  R       = assign {}, me
  R[ k ]  = v
  return Object.freeze R

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$set = ( me, k, v ) ->
  R       = assign {}, me
  R[ k ]  = v
  return R

#-----------------------------------------------------------------------------------------------------------
copy_n_freeze_n$set = ( me, k, v ) ->
  me[ k ] = v
  return me

#===========================================================================================================
copy_y_freeze_y$new_object  = ( P... ) -> Object.freeze assign {}, P...
copy_y_freeze_n$new_object  = ( P... ) ->               assign {}, P...
copy_n_freeze_n$new_object  = copy_y_freeze_n$new_object

#===========================================================================================================
copy_y_freeze_y$assign      = ( me, P... ) -> Object.freeze assign {}, me, P...
copy_y_freeze_n$assign      = ( me, P... ) ->               assign {}, me, P...
copy_n_freeze_n$assign      = ( me, P... ) ->               assign     me, P...

#===========================================================================================================
copy_y_freeze_y$lets = ( original, modifier ) ->
  draft = @thaw original
  modifier draft if modifier?
  return Object.freeze draft

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$lets = ( original, modifier ) ->
  draft = if ( frozen original ) then ( @thaw original ) else original
  modifier draft if modifier?
  return assign {}, draft

#-----------------------------------------------------------------------------------------------------------
copy_n_freeze_n$lets = ( original, modifier ) ->
  draft = if ( frozen original ) then ( @thaw original ) else original
  modifier draft if modifier?
  return draft


#===========================================================================================================
copy_y_freeze_y$freeze = ( me ) -> Object.freeze me

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$freeze = ( me ) -> me
copy_n_freeze_n$freeze = ( me ) -> me

#===========================================================================================================
### NOTE with `{ copy: false, }` the `thaw()` method will still make a copy as there is no `Object.thaw()` ###
copy_y_freeze_y$thaw = ( me ) -> assign {}, me

#-----------------------------------------------------------------------------------------------------------
copy_y_freeze_n$thaw  = ( me ) -> assign {}, me
copy_n_freeze_n$thaw  = ( me ) -> me


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
class Lft extends Multimix

  #---------------------------------------------------------------------------------------------------------
  @types: types

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super()
    types.validate.lft_cfg @cfg = Object.freeze { defaults.cfg..., cfg..., }
    if @cfg.copy
      if @cfg.freeze
        @new_object = copy_y_freeze_y$new_object
        @set        = copy_y_freeze_y$set
        @assign     = copy_y_freeze_y$assign
        @lets       = copy_y_freeze_y$lets
        @freeze     = copy_y_freeze_y$freeze
        @thaw       = copy_y_freeze_y$thaw
      else
        @new_object = copy_y_freeze_n$new_object
        @set        = copy_y_freeze_n$set
        @assign     = copy_y_freeze_n$assign
        @lets       = copy_y_freeze_n$lets
        @freeze     = copy_y_freeze_n$freeze
        @thaw       = copy_y_freeze_n$thaw
    else
      if @cfg.freeze
        ### TAINT move to `types.validate.lft_settings cfg` ###
        throw new Error "^3446^ cannot use { copy: false, } with { freeze: true, }"
      else
        @new_object = copy_n_freeze_n$new_object
        @set        = copy_n_freeze_n$set
        @assign     = copy_n_freeze_n$assign
        @lets       = copy_n_freeze_n$lets
        @freeze     = copy_n_freeze_n$freeze
        @thaw       = copy_n_freeze_n$thaw
    return @

  #---------------------------------------------------------------------------------------------------------
  get: ( me, k ) -> me[ k ]



############################################################################################################
module.exports = LFT = new Lft()
assign LFT, { Lft, }



