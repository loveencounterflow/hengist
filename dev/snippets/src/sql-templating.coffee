


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

#-----------------------------------------------------------------------------------------------------------
@demo_sql_tokenizer = ->
  cfg           =
    regExp: ( require 'mysql-tokenizer/lib/regexp-sql92' )
  tokenize      = ( require 'mysql-tokenizer' ) cfg
  sql           = """select *, 'helo world' as "text" from blah order by 1; insert sfksi 1286982342 &/$/&;"""
  tokens        = tokenize sql + '\n'
  colors        = [ ( ( P... ) -> CND.reverse CND.blue P... ), ( ( P... ) -> CND.reverse CND.yellow P... ), ]
  color_count   = colors.length
  tokens        = ( colors[ idx %% color_count ] token for token, idx in tokens )
  info tokens.join ''

#-----------------------------------------------------------------------------------------------------------
@demo_sql_templating_pgsqwell = ->
  SQL = require 'pgsqwell'
  { escapeSQLIdentifier
    sqlPart
    emptySQLPart
    joinSQLValues } = SQL
  SQL = SQL.default
  #.........................................................................................................
  limit = 10
  query = SQL"""SELECT id FROM users WHERE name=#{'toto'} #{
    if limit? then sqlPart"LIMIT #{limit}" else emptySQLPart
  }"""
  query2 = SQL"""SELECT id FROM #{escapeSQLIdentifier('table')}"""
  query3 = SQL"""SELECT id FROM users WHERE id IN #{joinSQLValues([1, 2])}}"""
  mergedQuery = SQL"""
  #{query}
  UNION
  #{query2}
  UNION
  #{query3}
  """
  info '^337^', query
  info '^337^', query2
  info '^337^', query3
  info '^337^', mergedQuery



############################################################################################################
if module is require.main then do =>
  # @demo_sql_tokenizer()
  @demo_sql_templating_pgsqwell()

  
