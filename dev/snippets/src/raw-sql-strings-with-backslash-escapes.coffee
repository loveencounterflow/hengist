


'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SQL-TEMPLATING'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
{ DBay }                  = require '../../../apps/dbay'
{ SQL  }                  = DBay


#-----------------------------------------------------------------------------------------------------------
@demo_sql_strings = ->
  # SQL = ( parts, expressions... ) ->
  #   R = parts[ 0 ]
  #   for expression, idx in expressions
  #     R += expression.toString() + parts[ idx + 1 ]
  #   return R
  #.........................................................................................................
  urge rpr           "foo\nbar\u4e11 ${1+2} #{3+4}"
  urge rpr        SQL"foo\nbar\u4e11 ${1+2} #{3+4}"
  urge rpr String.raw"foo\nbar\u4e11 ${1+2} #{3+4}"
  #.........................................................................................................
  db = new DBay
  info row      for row from db           "select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  info row      for row from db        SQL"select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  info row      for row from db String.raw"select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  #.........................................................................................................
  urge row.text for row from db           "select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  urge row.text for row from db        SQL"select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  urge row.text for row from db String.raw"select 'a\x08b foo\nbar\u4e11 ${1+2} #{3+4}' as text;"
  #.........................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  @demo_sql_strings()

  
