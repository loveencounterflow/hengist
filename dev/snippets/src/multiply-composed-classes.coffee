
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'TEMPFILES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
misfit                    = Symbol 'misfit'

### thx to https://alligator.io/js/class-composition/ ###

#-----------------------------------------------------------------------------------------------------------
class Base
  constructor: ->
    help '^343-1^', known_names = new Set ( k for k of @ )

#-----------------------------------------------------------------------------------------------------------
A_mixin = ( clasz = Object ) => class extends clasz
  constructor: ->
    super()
    # help '^343-1^', known_names = new Set ( k for k of @ )
    @a_mixin  = true
    @name     = 'a_mixin'

  introduce_yourself: -> urge "helo from class #{@name}"

#-----------------------------------------------------------------------------------------------------------
B_mixin = ( clasz = Object ) => class extends clasz
  constructor: ->
    super()
    # help '^343-2^', known_names = new Set ( k for k of @ )
    @b_mixin  = true
    @name     = 'b_mixin'

#-----------------------------------------------------------------------------------------------------------
C_mixin = ( clasz = Object ) => class extends clasz
  constructor: ->
    super()
    # help '^343-3^', known_names = new Set ( k for k of @ )
    @c_mixin  = true
    @name     = 'c_mixin'

#-----------------------------------------------------------------------------------------------------------
D_mixin = ( clasz = Object ) => class extends clasz
  constructor: ->
    super()
    # help '^343-4^', known_names = new Set ( k for k of @ )
    @d_mixin  = true
    @name     = 'd_mixin'


#-----------------------------------------------------------------------------------------------------------
# class Main extends D_mixin C_mixin B_mixin A_mixin Base ### unnecessary class `Base` ###
# class Main extends D_mixin C_mixin B_mixin A_mixin Object ### the default ###
# class Main extends D_mixin C_mixin B_mixin A_mixin null ### doesn't work ###
class Main extends D_mixin C_mixin B_mixin A_mixin()
  constructor: ( x = misfit ) ->
    super()
    @x        = x
    @main     = true
    @name     = 'main'


############################################################################################################
if module is require.main then do =>
  debug d = new Main()
  d.introduce_yourself()


