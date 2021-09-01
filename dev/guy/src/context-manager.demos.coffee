
############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()


#===========================================================================================================
# CLASS DEFINITION
#-----------------------------------------------------------------------------------------------------------
class Context_manager extends Function

  #---------------------------------------------------------------------------------------------------------
  constructor: ( kernel ) ->
    super()
    @kernel     = kernel.bind @
    @ressources = {}
    return @manage

  #---------------------------------------------------------------------------------------------------------
  enter: ( P... ) ->
    R = null
    debug '^701^', "enter()", P
    return R

  #---------------------------------------------------------------------------------------------------------
  manage: ( P..., block ) =>
    validate.function block
    cx_value = @enter P...
    debug '^701^', "manage()", { P, block, cx_value, }
    try R = @kernel cx_value, P... finally @exit cx_value, P...
    return R

  #---------------------------------------------------------------------------------------------------------
  exit: ( P... ) ->
    debug '^701^', "exit()", P
    return null

#===========================================================================================================
# DEMOS
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  do =>
    manage = new Context_manager kernel = ( P... ) ->
      info '^4554^', 'kernel', P
      whisper '^4554^', @id
      whisper '^4554^', ( k for k of @ )
      whisper '^4554^', @enter
      whisper '^4554^', @exit
      return ( rpr p for p in P ).join '|'
    block_result = manage 'a', 'b', 'c', block = -> ( cx_value, context_arguments... ) ->
      info '^4554^', 'block', { cx_value, context_arguments, }
      return 'block_result'
    debug '^3334^', rpr block_result
    return null

#-----------------------------------------------------------------------------------------------------------
demo_dba_foreign_keys_off_cxm = ->
  #=========================================================================================================
  class Foreign_keys_off_cxm extends Context_manager

    #-------------------------------------------------------------------------------------------------------
    enter: ( P... ) ->
      debug '^Foreign_keys_off_cxm.enter^', P

      return null

    #-------------------------------------------------------------------------------------------------------
    exit: ( P... ) ->
      debug '^Foreign_keys_off_cxm.exit^', P
      return null

  #=========================================================================================================
  class Dba_x extends ( require '../../../apps/icql-dba' ).Dba

    #-----------------------------------------------------------------------------------------------------
    create_with_foreign_keys_off: ( cxm_arguments... ) =>
      cxm = new Foreign_keys_off_cxm { dba: @, }
      return cxm

    #-----------------------------------------------------------------------------------------------------
    with_foreign_keys_off: ( cxm_arguments... ) =>
      cxm = @create_with_foreign_keys_off cxm_arguments...
      cxm = new Foreign_keys_off_cxm { dba: @, }
      return cxm

  #=========================================================================================================
  do =>

    #-------------------------------------------------------------------------------------------------------
    dba = new Dba()
    dba.with_foreign_keys_off 'cxm_arguments', block = ( cx_value, extra_arguments... ) ->
      debug '^inside-managed-context'
      return 'block-result'
    return null
  return null


############################################################################################################
if require.main is module then do =>
  demo_1()
  # demo_dba_foreign_keys_off_cxm()