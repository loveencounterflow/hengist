
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
  constructor: ( f ) ->
    super()
    f = f.bind @
    manager = ( P... ) =>
      @enter P...
      try R = f P... finally @exit P...
      return R
    @id = 4567
    return manager

  #---------------------------------------------------------------------------------------------------------
  frobulate: ( n ) -> n ** 2

  #---------------------------------------------------------------------------------------------------------
  enter: ( P... ) ->
    debug '^701^', "enter()", P
    return 1

  #---------------------------------------------------------------------------------------------------------
  exit: ( P... ) ->
    debug '^701^', "exit()", P
    return 1

#===========================================================================================================
# DEMOS
#-----------------------------------------------------------------------------------------------------------
demo_1 = ->
  do =>
    cm_2 = new Context_manager ( P... ) ->
      info '^4554^', 'kernel', P
      whisper '^4554^', @id
      whisper '^4554^', ( k for k of @ )
      whisper '^4554^', @frobulate
      whisper '^4554^', @frobulate 42
      return ( rpr p for p in P ).join '|'
    urge cm_2 'a', 'b', 'c'
    # whisper '------------------'
    # urge cm_2.f?()
    # urge cm_2.frobulate? 3


############################################################################################################
if require.main is module then do =>
  demo_1()
