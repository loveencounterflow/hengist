

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL/TESTS/HELPERS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
# #...........................................................................................................
# test                      = require 'guy-test'
# jr                        = JSON.stringify
# { inspect, }              = require 'util'
# xrpr                      = ( x ) -> inspect x, { colors: yes, breakLength: Infinity, maxArrayLength: Infinity, depth: Infinity, }
# xrpr2                     = ( x ) -> inspect x, { colors: yes, breakLength: 20, maxArrayLength: Infinity, depth: Infinity, }
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  validate
  validate_list_of }      = types.export()
DATA                      = require '../../../../lib/data-providers-nocache'
DATOM                     = require 'datom'

#-----------------------------------------------------------------------------------------------------------
types.declare 'interpolatable_value', ( x ) ->
  return true if @isa.text x
  return true if @isa.float x
  return true if @isa.boolean x
  return false

#-----------------------------------------------------------------------------------------------------------
@get_icql_settings = ( remove_db = false ) ->
  R                 = {}
  R.connector       = require 'better-sqlite3'
  R.db_path         = '/tmp/icql.db'
  R.icql_path       = PATH.resolve PATH.join __dirname, '../../../../assets/icql/test.icql'
  if remove_db
    try
      ( require 'fs' ).unlinkSync R.db_path
    catch error
      throw error unless ( error.code is 'ENOENT' )
  return R

#-----------------------------------------------------------------------------------------------------------
@try_to_remove_file = ( path ) ->
  try FS.unlinkSync path catch error
    return if error.code is 'ENOENT'
    throw error
  return null

#-----------------------------------------------------------------------------------------------------------
@resolve_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../../../', path

#-----------------------------------------------------------------------------------------------------------
@interpolate  = ( template, namespace ) ->
  validate.text template
  validate.object namespace
  R = template
  for name, value of namespace
    continue unless ( R.indexOf ( pattern = "{#{name}}" ) ) > -1
    validate.interpolatable_value value
    R = R.replaceAll pattern, value
  if ( match = R.match /(?<!\\)\{/ )
    throw new Error "unresolved curly bracket in template #{rpr template}"
  R = R.replaceAll '\\{', '{'
  R = R.replaceAll '\\}', '}'
  return R

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  #.........................................................................................................
  texts       = DATA.get_words cfg.word_count
  #.........................................................................................................
  data_cache  = { texts, }
  data_cache  = DATOM.freeze data_cache
  whisper "...done"
  return data_cache
