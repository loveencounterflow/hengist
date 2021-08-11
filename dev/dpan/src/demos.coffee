
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DPAN/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
SQL                       = String.raw
{ lets
  freeze }                = require 'letsfreezethat'
{ Dba, }                  = require 'icql-dba'
def                       = Object.defineProperty
glob                      = require 'glob'
PATH                      = require 'path'
FS                        = require 'fs'
got                       = require 'got'
semver_satisfies          = require 'semver/functions/satisfies'
semver_cmp                = require 'semver/functions/cmp'
{ Dpan, }                 = require '../../../apps/dpan'


#-----------------------------------------------------------------------------------------------------------
class Dpan_next extends Dpan

  # #---------------------------------------------------------------------------------------------------------
  # _db_add_pkg_name: ( pkg_name ) ->
  #   @dba.run SQL"""insert into #{prefix}pkg_names ( pkg_name )
  #     values ( $pkg_name )
  #     on conflict do nothing;""", { pkg_name, }
  #   return null

  # #---------------------------------------------------------------------------------------------------------
  # _db_add_pkg_version: ( pkg_version ) ->
  #   @dba.run SQL"""insert into #{prefix}pkg_versions ( pkg_version )
  #     values ( $pkg_version )
  #     on conflict do nothing;""", { pkg_version, }
  #   return null

  # #---------------------------------------------------------------------------------------------------------
  # _db_add_pkg_svrange: ( pkg_svrange ) ->
  #   @dba.run SQL"""insert into #{prefix}pkg_svranges ( pkg_svrange )
  #     values ( $pkg_svrange )
  #     on conflict do nothing;""", { pkg_svrange, }
  #   return null

  #---------------------------------------------------------------------------------------------------------
  db_add_pkg_info: ( cfg ) ->
    ### TAINT validate ###
    { pkg_info, } = cfg
    @dba.run @sql.add_pkg_name,     pkg_info
    @dba.run @sql.add_pkg_version,  pkg_info
    @dba.run @sql.add_pkg,          pkg_info
    # @_db_add_pkg_name    pkg_info.pkg_name
    # @_db_add_pkg_version pkg_info.pkg_version
    # @dba.run SQL"""insert into #{prefix}pkgs ( pkg_name, pkg_version )
    #   values ( $pkg_name, $pkg_version )
    #   on conflict do nothing;""", pkg_info
    #.......................................................................................................
    for dep_name, dep_svrange of pkg_info.pkg_deps
      @dba.run @sql.add_pkg_name,     { pkg_name: dep_name, }
      @dba.run @sql.add_pkg_svrange,  { pkg_svrange: dep_svrange, }
      @dba.run @sql.add_pkg_dep,      { pkg_info..., dep_name, dep_svrange, }
    #.......................................................................................................
    return null


#-----------------------------------------------------------------------------------------------------------
demo_db_add_pkg_info = ->
  dpan                = new Dpan_next()
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  pkg_name            = PATH.basename pkg_fspath ### TAINT not strictly true ###
  pkg_info            = await dpan.fs_fetch_pkg_info { pkg_fspath, }
  debug '^476^', ( k for k of pkg_info )
  dpan.db_add_pkg_info { pkg_info, }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_fs_walk_dep_infos = ->
  dpan                = new Dpan()
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  pkg_name            = PATH.basename pkg_fspath ### TAINT not strictly true ###
  fallback            = null
  count               = 0
  count_max           = 20
  for await dep from dpan.fs_walk_dep_infos { pkg_fspath, }
    count++
    break if count > count_max
    # whisper '^850^', dep
    info '^850^', dep.pkg_name, dep.pkg_version, "(#{dep.dep_svrange})", ( CND.yellow dep.pkg_keywords.join ' ' )
    urge '^850^', dep.pkg_deps
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_fs_walk_dep_infos()
  # await demo_db_add_package()
  await demo_db_add_pkg_info()


