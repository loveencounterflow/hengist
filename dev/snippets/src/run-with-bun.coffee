

'use strict'

############################################################################################################
_inspect                  = ( require 'util' ).inspect
isa_text                  = ( x ) -> ( typeof x ) is 'string'

#-----------------------------------------------------------------------------------------------------------
rpr_settings =
  depth:            Infinity
  maxArrayLength:   Infinity
  breakLength:      Infinity
  compact:          true
  colors:           false
@rpr = rpr = ( P... ) -> ( ( _inspect x, rpr_settings ) for x in P ).join ' '

#-----------------------------------------------------------------------------------------------------------
inspect_settings =
  depth:            Infinity
  maxArrayLength:   Infinity
  breakLength:      Infinity
  compact:          false
  colors:           true
@inspect = ( P... ) -> ( ( _inspect x, inspect_settings ) for x in P ).join ' '

#-----------------------------------------------------------------------------------------------------------
@get_output_method = ( target, options ) ->
  return ( P... ) => target.write @pen P...

#-----------------------------------------------------------------------------------------------------------
@pen = ( P... ) ->
  ### Given any number of arguments, return a text representing the arguments as seen fit for output
  commands like `log`, `echo`, and the colors. ###
  return ( @_pen P... ).concat '\n'

#-----------------------------------------------------------------------------------------------------------
@_pen = ( P... ) ->
  ### ... ###
  R = ( ( if isa_text p then p else @rpr p ) for p in P )
  return R.join @separator

#-----------------------------------------------------------------------------------------------------------
@log                      = @get_output_method process.stderr
@echo                     = @get_output_method process.stdout


console.log process
console.log ( k for k of process )
console.log process.stdout
console.log process.stderr
@log 'helo'
@echo 'helo'





