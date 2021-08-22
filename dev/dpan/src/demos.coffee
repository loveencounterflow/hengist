
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
H                         = require './helpers'


# #-----------------------------------------------------------------------------------------------------------
# class Dpan_next extends Dpan



#-----------------------------------------------------------------------------------------------------------
demo_db_add_pkg_info = ->
  { Dpan }            = require H.dpan_path
  # dpan                = new Dpan_next()
  dpan                = new Dpan()
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  pkg_name            = PATH.basename pkg_fspath ### TAINT not strictly true ###
  pkg_info            = await dpan.fs_fetch_pkg_info { pkg_fspath, }
  dpan.db_add_pkg_info pkg_info
  return null

#-----------------------------------------------------------------------------------------------------------
demo_db_add_pkg_infos = ->
  { Dpan, }             = require H.dpan_path
  { Tbl, }              = require '../../../apps/icql-dba-tabulate'
  { Dba, }              = require H.dba_path
  db_path               = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                   = new Dba()
  dba.open { path: db_path, }
  dba.pragma SQL"journal_mode=memory"
  dpan                  = new Dpan { dba, recreate: true, }
  # dpan                  = new Dpan_next { recreate: true, }
  skipped               = []
  # home_path             = PATH.resolve PATH.join __dirname, '../../../../'
  # project_path_pattern  = PATH.join home_path, '*/package.json'
  # home_path             = PATH.resolve PATH.join __dirname, '../../../../dpan'
  home_path             = PATH.resolve PATH.join __dirname, '../../../apps/dpan'
  project_path_pattern  = PATH.join home_path, './package.json'
  debug '^488^', project_path_pattern
  for project_path in glob.sync project_path_pattern
    pkg_fspath  = PATH.dirname project_path
    try
      pkg_info = await dpan.fs_fetch_pkg_info { pkg_fspath, }
      # debug '^336^', pkg_info
      dpan.db_add_pkg_info pkg_info
    catch error
      warn "error occurred when trying to add #{pkg_fspath}: #{error.message}; skipping"
      skipped.push pkg_fspath
      continue
    # whisper '^564^', pkg_info
    info '^564^', pkg_info.pkg_name, pkg_info.pkg_version
  #.........................................................................................................
  if skipped.length > 0
    warn "some paths looked like projects but caused errors (see above):"
    warn '  ' + entry for entry in skipped
  #.........................................................................................................
  dbatbl      = new Tbl { dba, }
  dbatbl.dump_db()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_fs_walk_dep_infos = ->
  { Dpan }            = require H.dpan_path
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

#-----------------------------------------------------------------------------------------------------------
demo_variables = ->
  { Dba }             = require H.dba_path
  { Dpan }            = require H.dpan_path
  dba                 = new Dba()
  dpan                = new Dpan { dba, }
  debug '^4443^', dpan.vars.set 'myvariable', "some value"
  debug '^4443^', dpan.vars.set 'ditance', 12
  debug '^4443^', dpan.vars.get 'myvariable'
  debug '^4443^', dpan.vars.get 'ditance'
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_fs_walk_dep_infos()
  # await demo_db_add_package()
  # await demo_db_add_pkg_info()
  await demo_db_add_pkg_infos()
  # await demo_variables()


