
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
{ to_width }              = require 'to-width'
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
chalk                     = require 'chalk'
hashbow                   = require 'hashbow'


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
get_gitlog = ( dpan, pkg_fspath ) ->
  debug '^353455^', pkg_fspath
  # if pkg_fspath.endsWith '/cxltx'
  #   warn "^439342344^ skipping #{pkg_fspath}"
  #   return []
  commits = dpan.git_get_log { pkg_fspath, }
  # try commits = gitlog cfg catch error
  #   # throw error
  #   warn "^347834^ when trying to get git logs for #{pkg_fspath}, an error occurred:"
  #   warn "#{error.code} #{error.message}"
  #   throw error
  #   return []
  commit_count  = commits.length
  info "commit_count:", commit_count, pkg_fspath
  ### NOTE commits are ordered newest first ###
  for commit in commits[ .. 3 ]
    short_hash  = commit.hash
    date        = commit.date_iso
    subject     = to_width commit.message, 100
    subject     = subject.trim()
    urge short_hash, date, subject
  #.........................................................................................................
  R               = []
  for commit in commits # [ .. 100 ]
    name    = PATH.basename pkg_fspath
    date    = commit.date_iso
    subject = commit.message.trim()
    R.push { name, date, subject, }
  return R

#-----------------------------------------------------------------------------------------------------------
get_pkg_infos = ( dpan ) ->
  R                     = []
  ref_path              = process.cwd()
  home_path             = process.env.HOME
  sub_paths             = [
    # 'temp/linuxtimemachine-backups/enceladus/jzr/*/package.json'
    'jzr/*/package.json'
    # 'io/*/package.json'
    # 'io/mingkwai-rack/*/package.json'
    ]
  for sub_path in sub_paths
    if sub_path.startsWith '/' then project_path_pattern  =                       sub_path
    else                            project_path_pattern  = PATH.join home_path,  sub_path
    R = [ R..., ( _get_pkg_infos dpan, ref_path, project_path_pattern )..., ]
  return R

#-----------------------------------------------------------------------------------------------------------
_get_pkg_infos = ( dpan, ref_path, project_path_pattern ) ->
  R                     = []
  for project_path in glob.sync project_path_pattern, { follow: false, realpath: true, }
    pkg_fspath      = PATH.dirname project_path
    unless ( dcs = dpan.git_get_dirty_counts { pkg_fspath, fallback: null, } )?
      warn "not a git repo: #{pkg_fspath}"
      continue
    # debug '^656874^', pkg_fspath, dcs
    pkg_rel_fspath  = PATH.relative ref_path, pkg_fspath
    pkg_name        = PATH.basename pkg_fspath
    R.push { pkg_fspath, pkg_rel_fspath, pkg_name, dcs, }
  return R

#-----------------------------------------------------------------------------------------------------------
demo_git_get_dirty_counts = ->
  { Dpan, }             = require H.dpan_path
  { Tbl, }              = require '../../../apps/icql-dba-tabulate'
  { DBay, }             = require '../../../apps/dbay'
  db_path               = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                   = new DBay { path: db_path, }
  dpan                  = new Dpan { dba, recreate: true, }
  #.........................................................................................................
  pkgs                  = get_pkg_infos dpan
  help '^46456^', "using DB at #{db_path}"
  whisper "ACC: ahead-commit  count"
  whisper "BCC: behind-commit count"
  whisper "DFC: dirty file    count"
  #.........................................................................................................
  for { pkg_fspath, pkg_rel_fspath, pkg_name, dcs, } in pkgs
    sum = dcs.sum
    delete dcs.sum
    if sum > 0
      delete dcs[ k ] for k, v of dcs when v is 0
      help '^334-2^', ( to_width pkg_rel_fspath, 50 ), ( CND.yellow CND.reverse " #{sum} " ), ( CND.grey dcs )
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_show_recent_commits = ->
  { Dpan, }             = require H.dpan_path
  { Tbl, }              = require '../../../apps/icql-dba-tabulate'
  { DBay, }             = require '../../../apps/dbay'
  db_path               = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                   = new DBay { path: db_path, }
  dpan                  = new Dpan { dba, recreate: true, }
  recent_commits        = []
  pkgs                  = get_pkg_infos dpan
  help '^46456^', "using DB at #{db_path}"
  #.........................................................................................................
  for { pkg_fspath, pkg_rel_fspath, pkg_name, } in pkgs
    for commit in get_gitlog dpan, pkg_fspath
      recent_commits.push commit
  #.........................................................................................................
  ### TAINT the idea was to use the DB for this kind of processing ###
  recent_commits.sort ( a, b ) ->
    return -1 if a.date < b.date
    return +1 if a.date > b.date
    return 0
  #.........................................................................................................
  for commit in recent_commits
    name    = to_width commit.name, 20
    subject = to_width commit.subject, 100
    echo ( CND.white commit.date ), ( chalk.inverse.bold.hex hashbow name ) name + ' ' + subject
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
demo_git_fetch_pkg_status = ->
  { Dpan }            = require H.dpan_path
  { Dba, }            = require H.dba_path
  db_path             = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                 = new Dba()
  dba.open { path: db_path, }
  dba.pragma SQL"journal_mode=memory"
  dpan                = new Dpan { dba, recreate: true, }
  pkg_fspath          = '../../../'
  pkg_fspath          = PATH.resolve PATH.join __dirname, pkg_fspath
  dpan.git_fetch_pkg_status { pkg_fspath, }
  return null

#-----------------------------------------------------------------------------------------------------------
demo_variables = ->
  { Dba }             = require H.dba_path
  { Dpan }            = require H.dpan_path
  dba                 = new Dba()
  dpan                = new Dpan { dba, }
  debug '^4443^', dpan.vars.set 'myvariable', "some value"
  debug '^4443^', dpan.vars.set 'distance', 12
  debug '^4443^', dpan.vars.get 'myvariable'
  debug '^4443^', dpan.vars.get 'distance'
  return null

#-----------------------------------------------------------------------------------------------------------
demo_staged_file_paths = ->
  { Dba }             = require H.dba_path
  { Dpan }            = require H.dpan_path
  dba                 = new Dba()
  dpan                = new Dpan { dba, }
  GU                  = require 'git-utils'
  pkg_fspath          = PATH.resolve PATH.join __dirname, '../../../apps/git-expanded-commit-messages'
  repo                = GU.open pkg_fspath
  unless repo?
    throw new Error "^43487^ no repo at #{pkg_fspath}"
  debug '^3324^', repo.getStatus() ### missing untracked files ###
  debug '^3324^',( pkg_fspath for pkg_fspath, status of repo.getStatus() when status is 1 ) ### missing untracked files ###
  info '^5909^', dpan.git_get_staged_file_paths { pkg_fspath, }
  return null




############################################################################################################
if module is require.main then do =>
  # await demo_fs_walk_dep_infos()
  # await demo_db_add_package()
  # await demo_db_add_pkg_info()
  # await demo_db_add_pkg_infos()
  # await demo_git_fetch_pkg_status()
  await demo_show_recent_commits()
  await demo_git_get_dirty_counts()
  # await demo_variables()
  # await demo_staged_file_paths()


