


'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'JSID'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
jr                        = JSON.stringify
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types.export()
#...........................................................................................................
CRYPTO                    = require 'crypto'
#...........................................................................................................
@registry     = new WeakMap()
@object_count = 0
@salt         = 'arbitrary'


#-----------------------------------------------------------------------------------------------------------
@id_of = ( x ) ->
  return 'null:0'         if x is null
  return 'undefined:0'    if x is undefined
  return 'boolean:f'      if x is false
  return 'boolean:t'      if x is true
  return 'infinity:p'     if x is +Infinity
  return 'infinity:n'     if x is -Infinity
  return 'nan:0'          if Number.isNaN x
  return R if ( R = @registry.get x )?
  @object_count++
  R = "object:#{@object_count}"
  try
    @registry.set x, R
    return R
  catch error
    throw error unless error.name is 'TypeError'
  @object_count--
  switch type = type_of x
    when 'text' then v = ( ( CRYPTO.createHash 'sha1' ).update x ).digest 'hex'
    else v = rpr x
  return "#{type}:#{v}"

#-----------------------------------------------------------------------------------------------------------
@demo = ( x ) ->
  help ( CND.yellow rpr x ), ( CND.blue rpr @id_of x )

############################################################################################################
if module is require.main then do =>
  @demo 'helo'
  @demo '42'
  @demo 42
  @demo Infinity
  @demo -Infinity
  @demo new Date()
  @demo undefined
  d = { x: 42, }
  @demo d
  @demo { x: 42, }
  @demo Object.freeze d
  @demo true
  @demo false
  @demo NaN
  @demo NaN
  @demo new Boolean true
  @demo new Boolean true
  @demo new Boolean false




