
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
  dpan              = new Dpan()
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
      if has_fallback
        pkg_json_info = await dpan.fs_fetch_pkg_info { pkg_fspath, fallback, }
      else
        pkg_json_info = await dpan.fs_fetch_pkg_info { pkg_fspath, }
    catch error
      T?.eq ( type_of error ), 'dba_fs_pkg_json_not_found'
      throw error unless ( type_of error ) is 'dba_fs_pkg_json_not_found'
      break
      # unless error.
    unless error?
      if pkg_json_info is fallback
        T.ok true
      else
        pkg_name      = pkg_json_info?.pkg_json?.name
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
@[ "dpan.fs_resolve_dep_fspath 1" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dpan }          = require H.dpan_path
  dpan              = new Dpan()
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
  T?.halt_on_error()
  debug '^5543^', { dpan_path: H.dpan_path, }
  { Dpan }          = require H.dpan_path
  { Dba }           = require '../../../apps/icql-dba'
  # db_path           = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dba               = new Dba()
  dba.open { ram: true, }
  dpan              = new Dpan { dba, }
  debug '^4474^', dpan.dba is dba
  # funny             = Math.floor Math.random() * 1e6
  # T.eq ( dpan.v.set 'myvariable', "some value"  ), "some value"
  # T.eq ( dpan.v.set 'distance', funny           ), funny
  # T.eq ( dpan.v.get 'myvariable'                ), "some value"
  # T.eq ( dpan.v.get 'distance'                  ), funny
  # T.eq ( dba.list dba.query SQL"select * from dpan_variables" ), []
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "dpan variables 2" ] = ( T, done ) ->
  T?.halt_on_error()
  debug '^5543^', { dpan_path: H.dpan_path, }
  { Dpan }          = require H.dpan_path
  db_path           = PATH.resolve PATH.join __dirname, '../../../data/dpan.sqlite'
  dpan              = new Dpan { db_path, recreate: true, }
  { dba }           = dpan
  funny             = Math.floor Math.random() * 1e6
  T.eq ( dpan.v.set 'myvariable', "some value"  ), "some value"
  T.eq ( dpan.v.set 'distance', funny           ), funny
  T.eq ( dpan.v.get 'myvariable'                ), "some value"
  T.eq ( dpan.v.get 'distance'                  ), funny
  T.eq ( dba.list dba.query SQL"select * from dpan_variables" ), []
  done?()


############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "dpan variables 1" ]
  @[ "dpan variables 1" ]()
  # test @[ "dpan variables 2" ]







