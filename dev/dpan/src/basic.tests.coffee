
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DPAN/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw


#-----------------------------------------------------------------------------------------------------------
test_fs_fetch_pkg_info = ( T, fallback ) ->
  { Dpan }          = require H.dpan_path
  { Dba }           = require H.dba_path
  dba               = new Dba()
  dpan              = new Dpan { dba, }
  has_fallback      = fallback isnt undefined
  #.........................................................................................................
  pkg_fspath  = __filename
  depth       = ( __filename.replace /[^\/]/g, '' ).length
  count       = 0
  loop
    count++
    break if count >= depth
    error = null
    debug '^3736^', pkg_fspath, count, depth
    try
      if has_fallback then  pkg_json_info = await dpan.fs_fetch_pkg_info { pkg_fspath, fallback, }
      else                  pkg_json_info = await dpan.fs_fetch_pkg_info { pkg_fspath, }
    catch error
      T?.eq ( type_of error ), 'dba_fs_pkg_json_not_found'
      throw error unless ( type_of error ) is 'dba_fs_pkg_json_not_found'
      break
    unless error?
      # debug '^477^', pkg_json_info
      if pkg_json_info is fallback
        T.ok true
      else
        pkg_name      = pkg_json_info?.pkg_name
        debug '^3736^', CND.blue pkg_name
        T?.eq pkg_name, 'hengist'
        pkg_fspath    = PATH.dirname pkg_fspath
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "dpan.fs_fetch_pkg_info 1" ] = ( T, done ) ->
  T?.halt_on_error()
  await test_fs_fetch_pkg_info T, undefined
  await test_fs_fetch_pkg_info T, null
  done?()

#-----------------------------------------------------------------------------------------------------------
populate_db_with_hengist_deps = ( dpan ) ->
  glob                  = require 'glob'
  skipped               = []
  home_path             = PATH.resolve PATH.join __dirname, '../../../../'
  project_path_pattern  = PATH.join home_path, '*/package.json'
  debug '^488^', project_path_pattern
  for project_path in glob.sync project_path_pattern
    pkg_fspath  = PATH.dirname project_path
    try
      pkg_info = await dpan.fs_fetch_pkg_info { pkg_fspath, }
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
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "dpan.db_add_pkg_info 1" ] = ( T, done ) ->
  { Dpan }              = require H.dpan_path
  # dpan                  = new Dpan_next { recreate: true, }
  { Dba }               = require H.dba_path
  db_path               = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                   = new Dba()
  dba.open { path: db_path, }
  dpan                  = new Dpan { dba, recreate: true, }
  await populate_db_with_hengist_deps dpan
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "dpan.dba.clear 1" ] = ( T, done ) ->
  { Dpan }              = require H.dpan_path
  # dpan                  = new Dpan_next { recreate: true, }
  { Dba }               = require H.dba_path
  db_path               = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba                   = new Dba()
  dba.open { path: db_path, }
  dpan                  = new Dpan { dba, recreate: true, }
  await populate_db_with_hengist_deps dpan
  dba.clear { schema: 'main', }
  T?.eq ( dba.list dba.query SQL"select * from sqlite_schema;" ), []
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "dpan.fs_resolve_dep_fspath 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dpan }          = require H.dpan_path
  { Dba }           = require H.dba_path
  dba               = new Dba()
  dpan              = new Dpan { dba, }
  dep_name          = 'cnd'
  # pkg_fspath        = '../../../lib/main.js'
  pkg_fspath        = '../../..'
  pkg_fspath        = PATH.resolve PATH.join __dirname, pkg_fspath
  debug '^3488^', { pkg_fspath, }
  dep_fspath        = dpan.fs_resolve_dep_fspath { pkg_fspath, dep_name, }
  debug '^3488^', { dep_fspath, }
  T.ok ( require dep_name ) is ( require dep_fspath )
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "dpan variables 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  debug '^5543^', { dpan_path: H.dpan_path, }
  { Dpan }          = require H.dpan_path
  { Dba }           = require H.dba_path
  db_path           = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  urge "^4858^ using DB at #{db_path}"
  dba               = new Dba()
  dba.open { path: db_path, }
  dpan              = new Dpan { dba, recreate: true, }
  T.eq dba, dpan.dba
  T.eq dba, dpan.vars.dba
  funny             = Math.floor Math.random() * 1e6
  T.eq ( dpan.vars.set 'myvariable', "some value"  ), "some value"
  T.eq ( dpan.vars.set 'distance', funny           ), funny
  # console.table dba.list dba.query SQL"select name, type from sqlite_schema where type in ( 'table', 'view' ) order by name;"
  T.eq ( dba.list dba.query SQL"select * from dpan_variables" ), [ { key: 'myvariable', value: '"some value"' }, { key: 'distance', value: funny, } ]
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "dpan tagging 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dpan }          = require H.dpan_path
  { Dba }           = require H.dba_path
  db_path           = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  pkg_fspath        = __filename
  urge "^4858^ using DB at #{db_path}"
  dba               = new Dba()
  dba.open { path: db_path, }
  dpan              = new Dpan { dba, pkg_fspath, recreate: true, }
  # console.table dba.list dba.query SQL"select name, type from sqlite_schema where type in ( 'table', 'view' ) order by name;"
  # debug '^3343^', ( k for k of dpan.tags )
  seen_tags = new Set()
  for await dep from dpan.fs_walk_dep_infos { pkg_fspath, }
    # debug '^3398^', dep.pkg_keywords
    for tag in dep.pkg_keywords
      tag = tag.replace /[-\s]/g, '_'
      tag = tag.replace /['"]/g, ''
      tag = tag.toLowerCase()
      unless seen_tags.has tag
        seen_tags.add tag
        dpan.tags.add_tag { tag, }
  # debug '^445^', dba.list dba.query SQL".tables"
  done?()


############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "dpan.fs_fetch_pkg_info 1" ]
  # @[ "dpan.db_add_pkg_info 1" ]()
  @[ "dpan.dba.clear 1" ]()
  # test @[ "dpan tagging 1" ]







