
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SCDA'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
{ Dba }                   = require '../../../apps/icql-dba'
Readlines                 = require 'n-readlines'
glob                      = require 'glob'
{ freeze
  lets }                  = require 'letsfreezethat'
types                     = require './types'
{ isa
  type_of
  validate }              = types.export()
{ Tokenwalker }           = require './tokenwalker'

#===========================================================================================================
class Scdadba extends Dba

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    super()
    ### TAINT add validation, defaults ###
    { schema
      prefix }  = cfg
    schema_i    = @as_identifier schema
    prefix     += '/' unless prefix.endsWith '/'
    @cfg        = freeze { @cfg..., schema, schema_i, prefix, }
    #.......................................................................................................
    @open { schema, ram: true, }
    ### TAINT short_path might not be unique ###
    ### TAINT use mirage schema with VNRs, refs ###
    @execute """
      -- ---------------------------------------------------------------------------------------------------
      create table #{schema_i}.paths (
          short_path  text unique not null,
          path        text primary key );
      -- ---------------------------------------------------------------------------------------------------
      create table #{schema_i}.lines (
          short_path  text    not null,
          lnr         integer not null,
          line        text    not null,
        primary key ( short_path, lnr ) );
      -- ---------------------------------------------------------------------------------------------------
      create table #{schema_i}.defs (
          short_path  text    not null,
          lnr         integer not null,
          tag         text not null,
          atsign      text,
          name        text not null,
          tail        text,
        primary key ( short_path, lnr ) );
      """
    #.......................................................................................................
    return undefined

  #---------------------------------------------------------------------------------------------------------
  $add_path: ( cfg ) ->
    { path, }   = cfg
    short_path  = path[ @cfg.prefix.length... ] if path.startsWith @cfg.prefix
    @run """
      insert into #{@cfg.schema_i}.paths ( short_path, path ) values ( $short_path, $path );""", \
      { short_path, path, }
    return short_path

  #---------------------------------------------------------------------------------------------------------
  $add_line: ( cfg ) ->
    ### TAINT short_path might not be unique ###
    { short_path
      lnr
      line } = cfg
    @run """
      insert into #{@cfg.schema_i}.lines ( short_path, lnr, line )
        values ( $short_path, $lnr, $line );""", \
      { short_path, lnr, line, }
    return null

  #---------------------------------------------------------------------------------------------------------
  $add_def: ( cfg ) ->
    ### TAINT short_path might not be unique ###
    { short_path
      lnr
      tag
      atsign
      name
      tail } = cfg
    @run """
      insert into #{@cfg.schema_i}.defs ( short_path, lnr, tag, atsign, name, tail )
        values ( $short_path, $lnr, $tag, $atsign, $name, $tail );""", \
      { short_path, lnr, tag, atsign, name, tail, }
    return null

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@patterns = [
    [ 'method',   /^\s*(?<atsign>@?)(?<name>[\w$]+):(?<tail>.*(?:->|=>).*)$/, ]
    # [ 'method',   /^\s*(?<atsign>@?)(?<name>[\w\$]+):(?<tail>.*)$/, ]
    [ 'function', /^\s*(?<atsign>@?)(?<name>[\w\$]+)\s*=\s*(?<tail>.*(?:->|=>).*)$/, ]
    ]

#-----------------------------------------------------------------------------------------------------------
@_groups_from_match = ( match ) ->
  R = {}
  for k, v of match.groups
    continue if ( v is '' ) or ( not v? )
    R[ k ] = v
  return R

#-----------------------------------------------------------------------------------------------------------
@demo = ->
  schema        = 'scda'
  prefix        = PATH.resolve PATH.join __dirname, '../../../../icql-dba/src'
  # prefix        = PATH.resolve PATH.join __dirname, '../src'
  source_glob   = PATH.join prefix, '*.coffee'
  source_paths  = glob.sync source_glob
  dba           = new Scdadba { schema, prefix, }
  #.........................................................................................................
  for path in source_paths
    short_path  = dba.$add_path { path, }
    continue unless /import/.test path
    debug '^4445^', path
    readlines   = new Readlines path
    lnr         = 0
    #.......................................................................................................
    while ( line = readlines.next() ) isnt false
      lnr++
      line = line.toString 'utf-8'
      #.....................................................................................................
      continue if /^\s*$/.test line # exclude blank lines
      continue if /^\s*#/.test line # exclude some comments
      dba.$add_line { short_path, lnr, line, }
      #.....................................................................................................
      for [ tag, pattern, ] in @patterns
        continue unless ( match = line.match pattern )?
        debug '^4336^', tag, line
        { atsign
          name
          tail } = @_groups_from_match match
        # info '^342^', { lnr, tag, groups, }
        dba.$add_def { short_path, lnr, tag, atsign, name, tail, }
        break
  #.........................................................................................................
  urge '^3344^', row for row from dba.query "select * from scda.paths order by path;"
  # help '^3344^', row for row from dba.query """
  #   select * from scda.lines
  #   where true
  #     -- and ( lnr between 111 and 123 )
  #     -- and ( line != '' )
  #   order by short_path, lnr;"""
  # console.table [ ( dba.query "select short_path, lnr, name from scda.defs order by name;" )..., ]
  console.table [ ( dba.query "select short_path, lnr, tag, name, tail from scda.defs order by name;" )..., ]
  #.........................................................................................................
  return null


# #-----------------------------------------------------------------------------------------------------------
# @demo_lexer = ->
#   CS = require 'coffeescript'
#   source = """
#     @foo = -> 42
#     @foo = f = -> 42
#     @foo = => 42
#     @foo = () -> 42
#     @foo = () => 42
#     @foo = ( x ) -> x * x
#     @foo = ( x ) => x * x
#     @foo = ( x = 42 ) => x * x
#     @foo = ( x = f 42 ) => x * x
#     @foo = ( x, y ) -> x * y
#     @foo = ( x, f = ( a ) -> a ) -> f x
#     @foo()
#     @foo value
#     @foo value, value, value
#     @foo value, @bar value
#     @foo value, ( @bar value ), value
#     @foo value, ( blah.bar value ), value
#     foo = -> 42
#     foo = f = -> 42
#     foo = => 42
#     foo = () -> 42
#     foo = () => 42
#     foo = ( x ) -> x * x
#     foo = ( x ) => x * x
#     foo = ( x = 42 ) => x * x
#     foo = ( x = f 42 ) => x * x
#     foo = ( x, y ) -> x * y
#     foo = ( x, f = ( a ) -> a ) -> f x
#     foo()
#     foo value
#     foo value, value, value
#     foo value, @bar value
#     foo value, ( @bar value ), value
#     foo value, ( blah.bar value ), value
#     """
#     # @foo = ( x )
#     # @foo 42
#     # @foo g 42
#     # f 3

#   # source = "a = 42"
#   # source = "a = -> 42"
#   # source = "@a 42"
#   #-----------------------------------------------------------------------------------------------------------
#   lines     = source.split /\n/
#   lnr       = null
#   collector = null
#   registry  = []
#   patterns  = [
#     [ 'definition', /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:(?:->|=>)#/,   ]
#     [ 'definition', /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:param_start#/, ]
#     [ 'definition', /#(?<tnr>\d+):identifier#\d+:=#\d+:(?:->|=>)#/,       ]
#     [ 'definition', /#(?<tnr>\d+):identifier#\d+:=#\d+:param_start#/,     ]
#     [ 'call',       /#(?<tnr>\d+):@#\d+:property#\d+:call_start#/,        ]
#     [ 'call',       /#(?<tnr>\d+):identifier#\d+:call_start#/,            ]
#     ]
#   #-----------------------------------------------------------------------------------------------------------
#   match_tokenline = ( tokenline ) ->
#     count = 0
#     for [ tag, pattern, ], pattern_idx in patterns
#       continue unless ( match = tokenline.match pattern )?
#       count++
#       tnr = parseInt match.groups.tnr, 10
#       d0 = registry[ tnr ]
#       d1 = registry[ tnr + 1 ]
#       if d0.text is '@'
#         name = d0.text + d1.text
#       else
#         name = d0.text
#       help pattern_idx, CND.reverse " #{tag} #{name} "
#     warn CND.reverse " no match " if count is 0
#       # break
#   #-----------------------------------------------------------------------------------------------------------
#   register = ( d ) ->
#     registry.push d
#     return registry.length - 1
#   #-----------------------------------------------------------------------------------------------------------
#   push = ( d ) ->
#     tnr       = register d
#     ( collector ?= [] ).push "#{tnr}:#{d.name}"
#     return null
#   #-----------------------------------------------------------------------------------------------------------
#   flush = ->
#     return null unless ( collector?.length ? 0 ) > 0
#     tokenline = '#' + ( collector.join '#' ) + '#'
#     help rpr lines[ lnr - 1 ]
#     urge tokenline
#     match_tokenline tokenline
#     collector = null
#     return null
#   #-----------------------------------------------------------------------------------------------------------
#   for [ name, text, d, ] in CS.tokens source
#     # { range: [ 0, 1 ], first_line: 0, first_column: 0, last_line: 0, last_column: 0, last_line_exclusive: 0, last_column_exclusive: 1 }
#     lnr   = d.first_line    + 1
#     cnr   = d.first_column  + 1
#     name  = name.toLowerCase()
#     switch name
#       when 'indent', 'outdent'
#         null
#       when 'terminator'
#         flush()
#         info()
#       else
#         push { lnr, cnr, name, text, }
#         # info lnr, { name, text, }
#   flush()
#   return null

#-----------------------------------------------------------------------------------------------------------
@demo_tokenwalker = ->
  source = """
    @foo = -> 42
    @foo = f = -> 42
    @foo = => 42
    @foo = () -> 42
    @foo = () => 42
    @foo = ( x ) -> x * x
    @foo = ( x ) => x * x
    @foo = ( x = 42 ) => x * x
    @foo = ( x = f 42 ) => x * x
    @foo = ( x, y ) -> x * y
    @foo = ( x, f = ( a ) -> a ) -> f x
    @foo()
    @foo value
    @foo value, value, value
    @foo value, @bar value
    @foo value, ( @bar value ), value
    @foo value, ( blah.bar value ), value
    foo = -> 42
    foo = f = -> 42
    foo = => 42
    foo = () -> 42
    foo = () => 42
    foo = ( x ) -> x * x
    foo = ( x ) => x * x
    foo = ( x = 42 ) => x * x
    foo = ( x = f 42 ) => x * x
    foo = ( x, y ) -> x * y
    foo = ( x, f = ( a ) -> a ) -> f x
    foo()
    foo value
    foo value, value, value
    foo value, @bar value
    foo value, ( @bar value ), value
    foo value, ( blah.bar value ), value
    @foo = -> 42
    foo value
    foo value, value, value; bar = ->"""
  tokenwalker = new Tokenwalker { lnr: 0, source, }
  # debug '^4433^', tokenwalker
  for d from tokenwalker.walk()
    # whisper '^333443^', tokenwalker
    info    '^333443^', d
  return null


############################################################################################################
if module is require.main then do =>
  # await @demo()
  # @demo_lexer()
  @demo_tokenwalker()



