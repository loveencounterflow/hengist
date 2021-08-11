
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
demo_fs_walk_dep_infos = ->
  RPKGUP  = await import( 'read-pkg-up' )
  dpan        = new Dpan()
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
    continue
    ###
    dep_fspath        = dpan.fs_resolve_dep_fspath { pkg_fspath, dep_name, }
    dep_json_info     = await dpan.fs_fetch_pkg_json_info { pkg_fspath: dep_fspath, fallback, }
    unless dep_json_info?
      warn "unable to fetch package.json for #{dep_fspath}"
      continue
    debug '^33344^', ( k for k of dep_json_info )
    dep_json          = dep_json_info.pkg_json
    dep_version       = dep_json.version
    dep_description   = dep_json.description
    dep_keywords      = dep_json.keywords ? []
    dep_json_fspath   = dep_json_info.path
    info()
    info ( CND.yellow dep_name )
    info ( CND.blue dep_fspath )
    info ( CND.gold dep_keywords )
    # info ( CND.lime dep_pkgj_fspath )
    info dep_version
    info dep_description
    # info ( CND.lime FS.realpathSync dep_fspath )
    ###
  return null


############################################################################################################
if module is require.main then do =>
  # await demo()
  await demo_fs_walk_dep_infos()
  # CP = require 'child_process'
  # debug '^33442^', CP.execSync "npm view icql-dba@^6 dependencies", { encoding: 'utf-8', }
  # debug '^33442^', CP.execSync "npm view icql-dba dependencies", { encoding: 'utf-8', }
