


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
  limit     = null
  limit     = 10
  limit_sql = if limit? then sqlPart"LIMIT #{limit}" else emptySQLPart
  query     = SQL"""SELECT id FROM users WHERE name=#{'toto'} #{limit_sql}"""
  query2    = SQL"""SELECT id FROM #{escapeSQLIdentifier('table')}"""
  query3    = SQL"""SELECT id FROM users WHERE id IN #{joinSQLValues([1, 2])}"""
  mergedQuery = SQL"""
  #{query}
  UNION
  #{query2}
  UNION
  #{query3}
  """
  { text, values, } = query;        info '^337^', { text, values, }
  { text, values, } = query2;       info '^337^', { text, values, }
  { text, values, } = query3;       info '^337^', { text, values, }
  { text, values, } = mergedQuery;  info '^337^', { text, values, }

#-----------------------------------------------------------------------------------------------------------
@demo_sql_template = ->
  SQL = require 'sql-template'
  show = ( fragment ) -> help ( rpr fragment.text ), ( CND.gold rpr fragment.values )
  show SQL"select * from foo"
  show SQL"select * from foo where age > #{22}"
  conditions = { name:'John Doe', }
  show SQL"select * from foo $where#{conditions}"
  conditions = { id: [ 1, 2, 3, ], type:'snow', }
  show SQL"select * from foo $where#{conditions}"
  show SQL"update foo $set#{ {joe: 22, bar: 'ok'} }"
  show SQL"insert into foo $keys#{["joe", "bar"]} values (#{22}, #{'ok'})}"
  show SQL"insert into foo ( joe, bar ) $values#{ {joe: 22, bar: 'ok'} }"
  obj = { first: 'John', last: 'Doe', }
  show SQL"insert into foo $keys#{Object.keys(obj)} $values#{obj}"
  show SQL"select * from $id#{'foo'}"
  show SQL"select * from $id#{'foo'} where id $in#{[1,2,3]}"
  return null


#=========================================================================================================
class Sql

  #-------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    # super()
    @types  = new ( require 'intertype' ).Intertype()
    @cfg    = cfg ### TAINT freeze ###
    return undefined

  #-------------------------------------------------------------------------------------------------------
  SQL: String.raw
  # SQL: ( parts, values... ) =>
  #   debug '^557^', [ parts, values, @cfg, ]
  #   return "your SQL string: #{rpr parts}, values: #{rpr values}"

  #-------------------------------------------------------------------------------------------------------
  I: ( name ) => '"' + ( name.replace /"/g, '""' ) + '"'

  #-------------------------------------------------------------------------------------------------------
  L: ( x ) =>
    return 'null' unless x?
    switch type = @types.type_of x
      when 'text'       then return  "'" + ( x.replace /'/g, "''" ) + "'"
      # when 'list'       then return "'#{@list_as_json x}'"
      when 'float'      then return x.toString()
      when 'boolean'    then return ( if x then '1' else '0' )
      when 'list'
        throw new Error "^dba@23^ use `X()` for lists"
    throw new Error '^dba@323^', type, x
    # throw new E.Dba_sql_value_error '^dba@323^', type, x

  #-------------------------------------------------------------------------------------------------------
  X: ( x ) =>
    throw new Error "^dba@132^ expected a list, got a #{type}" unless ( type = @types.type_of x ) is 'list'
    return '( ' + ( ( @L e for e in x ).join ', ' ) + ' )'

#-----------------------------------------------------------------------------------------------------------
@demo_Xxx = ->
  sql       = new Sql { this_setting: true, that_setting: 123, }
  { SQL
    I
    L
    X }     = sql
  table     = 'that other "table"'
  a_max     = 123
  limit     = 10
  truth     = true
  strange   = "strange 'value'%"
  selection = [ 'the', 'one', 'or', 'other', ]
  info '^3344^\n', SQL"""
    select
        a, b, c
      from #{I table}
      where #{truth}
        and ( a > #{L a_max} )
        and ( b like #{L strange} )
        and ( c in #{X selection} )
      limit #{L limit};
    """
  return null


############################################################################################################
if module is require.main then do =>
  # @demo_sql_tokenizer()
  # @demo_sql_templating_pgsqwell()
  # @demo_sql_template()
  @demo_Xxx()

  
