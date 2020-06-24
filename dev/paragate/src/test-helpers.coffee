
'use strict'
# coffeelint: disable=max_line_length

############################################################################################################
CND                       = require 'cnd'
badge                     = 'PARAGATE/TEST-HELPERS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
INTERTEXT                 = require 'intertext'
{ rpr }                   = INTERTEXT.export()
{ isa
  type_of }               = INTERTEXT.types
{ lets }                  = ( require 'datom' ).export()

#-----------------------------------------------------------------------------------------------------------
@as_text = ( x ) ->
  return rpr x
  switch type_of x
    when 'text'   then return x
    when 'object' then return jr x
    when 'list'   then return jr x
  return x.toString()

#-----------------------------------------------------------------------------------------------------------
@condense_token = ( token ) ->
  keys    = ( Object.keys token ).sort()
  keys    = keys.filter ( x ) -> x not in [ 'message', '$', ]
  values  = ( ( k + '=' + @as_text token[ k ] ) for k in keys )
  return values.join ','
  # return as_text values

#-----------------------------------------------------------------------------------------------------------
@condense_tokens = ( tokens ) ->
  R = []
  for t in tokens
    continue if t.$key in [ '<document', '>document', ]
    R.push @condense_token t
  return R.join '#'

#-----------------------------------------------------------------------------------------------------------
@delete_refs = ( ds ) ->
  R = []
  for d in ds
    R.push lets d, ( d ) -> delete d.$
  return R

# #-----------------------------------------------------------------------------------------------------------
# @show_condensed_tokens = ( tokens ) ->
#   for token in tokens
#     help @condense_token token
#   info @condense_tokens tokens
#   return null
