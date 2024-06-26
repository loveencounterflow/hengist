
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DBAY-SQL-LEXER/TEST-BASICS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types
# X                         = require '../../../lib/helpers'
r                         = String.raw
{ Tbl, }                  = require '../../../apps/icql-dba-tabulate'
dtab                      = new Tbl { dba: null, }
{ DBay }                  = require '../../../apps/dbay'
{ SQL  }                  = DBay
#-----------------------------------------------------------------------------------------------------------
show = ( sql, tokens ) ->
  info rpr sql
  echo dtab._tabulate tokens
  return tokens


#-----------------------------------------------------------------------------------------------------------
@dbay_sql_lexer = ( T, done ) ->
  { rx
    cfg }   = require './demo-sticky-regex-lexer'
  { Lexer } = require '../../../apps/dbay-sql-lexer'
  lexer     = new Lexer cfg
  mr        = lexer._create_pipeline()
  mr.send "select a + b as sum from mytable;"
  for token from mr.walk()
    info '^45-5^', token
  done?()



############################################################################################################
if require.main is module then do =>
  @dbay_sql_lexer()
  # test @


# is identifier: '"foo"" bar"'
# syntax error: 'select +1 as "foo\" bar";'

