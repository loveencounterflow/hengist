
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

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@patterns = [
    [ 'method', /^\s+(?<atsign>@?)(?<name>\w+):(?<tail>.*)$/, ]
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
        groups = @_groups_from_match match
        info '^342^', { lnr, tag, groups, }
  #.........................................................................................................
  urge '^3344^', row for row from dba.query "select * from scda.paths order by path;"
  help '^3344^', row for row from dba.query """
    select * from scda.lines
    where true
      and ( lnr between 111 and 123 )
      -- and ( line != '' )
    order by short_path, lnr;"""
  #.........................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  await @demo()



