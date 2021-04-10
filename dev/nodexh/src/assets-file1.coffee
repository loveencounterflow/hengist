
### This file is needed for testing; when modified, tests must be modified, too ###

types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types
log                       = console.log

@other_function = ( x ) ->
  validate.float x
  x++
  return x

@my_function = ( x ) ->
  unless ( type = type_of x ) is 'float'
    throw new Error "^79283^ expected a float, got a #{type}"
  log '^334^', x
  return x ** 2

if module is require.main then do =>
  log '^783^', @my_function 42



