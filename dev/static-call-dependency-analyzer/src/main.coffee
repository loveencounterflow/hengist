
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




############################################################################################################
if module is require.main then do =>
  # await @demo()
  # @demo_lexer()
  # @demo_tokenwalker()



