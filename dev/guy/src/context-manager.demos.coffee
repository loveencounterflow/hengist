
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
class Context_manager_1 extends Function

  #---------------------------------------------------------------------------------------------------------
  constructor: ->
    super()
    Object.setPrototypeOf @mymethod, Context_manager_1.prototype
    # Object.setPrototypeOf @mymethod, @constructor.prototype
    @id = 1234
    return @mymethod

  #---------------------------------------------------------------------------------------------------------
  mymethod: ( P... ) =>
    # debug '^4554^', type_of @
    debug '^4554^', ( k for k of @ )
    debug '^4554^', @id
    debug '^4554^', @frobulate

  frobulate: ( n ) -> n ** 2

#-----------------------------------------------------------------------------------------------------------
class Context_manager_2 extends Function

  #---------------------------------------------------------------------------------------------------------
  constructor: ( f ) ->
    super()
    @f = f.bind @
    # Object.setPrototypeOf f, Context_manager_2.prototype
    # Object.setPrototypeOf @f, @constructor.prototype
    @id = 4567
    # f.__call__ = @f
    # return @f
    return undefined

  frobulate: ( n ) -> n ** 2


#===========================================================================================================
# DEMOS
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  do =>
    cm_1 = new Context_manager_1()
    cm_1()
    whisper '------------------'
    cm_1.mymethod()
  whisper '================='
  do =>
    cm_2 = new Context_manager_2 ->
      info '^4554^', @id
      info '^4554^', ( k for k of @ )
      info '^4554^', @frobulate
      return 'othermethod'
    cm_2()
    whisper '------------------'
    urge cm_2.f?()
    # urge cm_2.__call__?()
    urge cm_2.frobulate? 3
    # urge cm_2.frobulate? 3


############################################################################################################
if require.main is module then do =>
  demo_1()
