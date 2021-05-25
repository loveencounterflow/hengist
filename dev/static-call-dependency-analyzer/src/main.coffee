
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
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types.export()


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


#-----------------------------------------------------------------------------------------------------------
@demo_lexer = ->
  CS = require 'coffeescript'
  debug ( k for k of require 'coffeescript' )
  lex = ( require 'coffee-lex' ).default
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
    """
    # @foo = ( x )
    # @foo 42
    # @foo g 42
    # f 3

  # source = "a = 42"
  # source = "a = -> 42"
  # source = "@a 42"
  #-----------------------------------------------------------------------------------------------------------
  lines     = source.split /\n/
  lnr       = null
  collector = null
  registry  = []
  patterns  = [
    # [ 'methoddef',  2, /#@#property#=#param_start#param_end#(?:->|=>)#/, ]
    # [ 'methoddef',  3, /#@#property#=#param_start#identifier(?:#|(?:#,#identifier)*)#param_end#(?:->|=>)#/, ]
    # [ 'methoddef',  5, /#@#property#=#param_start#/, ]
    # [ 'methodcall', 1, /#@#property#call_start#call_end#/, ]
    # [ 'methodcall', 2, /#@#property#call_start#identifier#call_end#/, ]
    # [ 'methodcall', 3, /#@#property#call_start#identifier#,#identifier#,#identifier#call_end#/, ]
    [ 'methoddef',  /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:(?:->|=>)#/, ]
    [ 'methoddef',  /#(?<tnr>\d+):@#\d+:property#\d+:=#\d+:param_start#/, ]
    [ 'fndef',      /#(?<tnr>\d+):identifier#\d+:=#\d+:(?:->|=>)#/, ]
    [ 'fndef',      /#(?<tnr>\d+):identifier#\d+:=#\d+:param_start#/, ]
    [ 'methodcall', /#(?<tnr>\d+):@#\d+:property#\d+:call_start#/, ]
    [ 'fncall',     /#(?<tnr>\d+):identifier#\d+:call_start#/, ]
    ]
  #-----------------------------------------------------------------------------------------------------------
  match_tokenline = ( tokenline ) ->
    count = 0
    for [ tag, pattern, ], idx in patterns
      continue unless ( match = tokenline.match pattern )?
      count++
      debug parseInt match.groups.tnr, 10
      help CND.reverse " #{tag} #{idx + 1} "
    warn CND.reverse " no match " if count is 0
      # break
  #-----------------------------------------------------------------------------------------------------------
  register = ( d ) ->
    registry.push d
    return registry.length - 1
  #-----------------------------------------------------------------------------------------------------------
  push = ( d ) ->
    tnr       = register d
    ( collector ?= [] ).push "#{tnr}:#{d.name}"
    return null
  #-----------------------------------------------------------------------------------------------------------
  flush = ->
    return null unless ( collector?.length ? 0 ) > 0
    tokenline = '#' + ( collector.join '#' ) + '#'
    help rpr lines[ lnr - 1 ]
    urge tokenline
    match_tokenline tokenline
    collector = null
    return null
  #-----------------------------------------------------------------------------------------------------------
  for [ name, text, d, ] in CS.tokens source
    # { range: [ 0, 1 ], first_line: 0, first_column: 0, last_line: 0, last_column: 0, last_line_exclusive: 0, last_column_exclusive: 1 }
    lnr   = d.first_line    + 1
    cnr   = d.first_column  + 1
    name  = name.toLowerCase()
    switch name
      when 'indent', 'outdent'
        null
      when 'terminator'
        flush()
        info()
      else
        push { lnr, name, text, }
        # info lnr, { name, text, }
  flush()
  return null


#-----------------------------------------------------------------------------------------------------------
@demo_ast_walker = ->
  CS = require 'coffeescript'
  xrpr = ( x ) -> ( rpr x )[ .. 100 ]
  #-----------------------------------------------------------------------------------------------------------
  walk_ast = ( tree ) ->
    whisper '^38^', '-'.repeat 108
    urge '^38^', tree.children, CND.steel xrpr tree
    switch tree_type = type_of tree
      #.....................................................................................................
      when 'root'
        yield { name: 'root', }
        yield from walk_ast tree.body
      #.....................................................................................................
      when 'block'
        yield { name: 'block', }
        for childname in tree.children
          debug '^39^', childname, xrpr tree[ childname ]
          yield from walk_ast tree[ childname ]
      #.....................................................................................................
      when 'list'
        for element in tree
          yield from walk_ast element
      #.....................................................................................................
      else
        whisper "^54^ unknown tree_type: #{rpr tree_type}"
    #.......................................................................................................
    return null
    # #.......................................................................................................
    # whisper '^35345-1^', 'type:', type_of tree
    # # whisper '^35345-2^', 'type:', type_of tree
    # for childname in tree.children
    #   whisper '^35345-3^', childname
    #   switch childname
    #     when 'variable'
    #       debug '^6456-1^', 'variable:                     ', xrpr tree.variable
    #       debug '^6456-1^', 'variable.children:            ', xrpr tree.variable.children
    #       debug '^6456-1^', 'variable.base:                ', xrpr tree.variable.base
    #       debug '^6456-1^', 'variable.base.children:       ', xrpr tree.variable.base.children
    #       debug '^6456-1^', 'variable.properties:          ', xrpr tree.variable.properties
    #       debug '^6456-1^', 'variable.properties.children: ', xrpr tree.variable.properties.children
    #       null
    #     when 'value'
    #       debug '^6456-1^', 'value:                        ', xrpr tree.value
    #       debug '^6456-1^', 'value.children:               ', xrpr tree.value.children
    #       debug '^6456-1^', 'value.params:                 ', xrpr tree.value.params
    #       debug '^6456-1^', 'value.params.children:        ', xrpr tree.value.params.children
    #       debug '^6456-1^', 'value.body:                   ', xrpr tree.value.body
    #       debug '^6456-1^', 'value.body.children:          ', xrpr tree.value.body.children
    #       null
    #     when 'expressions'
    #       for node in tree.expressions
    #         whisper '^35345-4^', 'type:', type_of node
    #         delete node.locationData
    #         info  '^6456-2^', node.children
    #         # switch node_type = type_of node
    #         #   when 'assign'
    #         #     null
    #         #   when 'variable'
    #         #     null
    #         #   when 'value'
    #         #     null
    #         #   else throw new Error "unknown node type #{node_type}"
    #         walk_ast node
    #     else throw new Error "unknown node type #{rpr childname}"
    # return null
  #.........................................................................................................
  source = """
    @foo = ( x ) -> x * x
    bar = -> 42
    """
  for d from walk_ast CS.nodes source
    info '^54^', d
  #.........................................................................................................
  return null

############################################################################################################
if module is require.main then do =>
  # await @demo()
  # @demo_ast_walker()
  @demo_lexer()
