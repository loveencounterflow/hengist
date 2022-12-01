
'use strict'


############################################################################################################
_GUY                      = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = _GUY.trm.get_loggers 'GUY/temp/tests'
{ rpr
  inspect
  echo
  log     }               = _GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
FS                        = require 'fs'
# { freeze }                = require 'letsfreezethat'
H                         = require './helpers'
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  declare
  type_of
  validate
  equals }                = types

#===========================================================================================================
declare.fs_file
  isa: ( x ) ->
    return false unless @isa.nonempty.text x
    try
      stat = FS.statSync x
    catch error
      return false if error.code is 'ENOENT'
      throw error
    return stat.isFile()

#-----------------------------------------------------------------------------------------------------------
declare.fs_directory
  isa: ( x ) ->
    return false unless @isa.nonempty.text x
    try
      stat = FS.statSync x
    catch error
      return false if error.code is 'ENOENT'
      throw error
    return stat.isDirectory()

#-----------------------------------------------------------------------------------------------------------
declare.fs_exists
  isa: ( x ) ->
    return false unless @isa.nonempty.text x
    try
      stat = FS.statSync x
    catch error
      return false if error.code is 'ENOENT'
      throw error
    return true

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_context_handler_file = ( T, done ) ->
  GUY = require '../../../apps/guy'
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_file ({ path: mypath, fd, }) ->
      path = mypath
      T?.ok isa.fs_file mypath
    T?.eq info, null
    T?.ok not isa.fs_file path
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_file { keep: true, }, ({ path: mypath, fd, }) ->
      path = mypath
      T?.ok isa.fs_file mypath
    T?.eq info, null
    T?.ok isa.fs_file path
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_context_handler_directory = ( T, done ) ->
  GUY = require '../../../apps/guy'
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_directory ({ path: mypath, }) ->
      path = mypath
      debug '^345-1^', { path, }
      T?.ok isa.fs_directory mypath
    debug '^345-2^', info
    T?.eq info, null
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_directory { prefix: 'zzwhatever-', }, ({ path: mypath, }) ->
      path = mypath
      debug '^345-3^', { path, }
      T?.ok ( PATH.basename mypath ).startsWith 'zzwhatever-'
      T?.ok isa.fs_directory mypath
    debug '^345-4^', info
    T?.eq info, null
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  do =>
    path = null
    info = GUY.temp.with_directory { keep: true, prefix: 'zzwhatever-', }, ({ path: mypath, }) ->
      path = mypath
      debug '^345-5^', { path, }
      T?.ok ( PATH.basename mypath ).startsWith 'zzwhatever-'
      T?.ok isa.fs_directory mypath
    debug '^345-6^', info
    T?.eq info, null
    T?.ok isa.fs_directory path
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_tempfolder_removed_with_contents = ( T, done ) ->
  GUY = require '../../../apps/guy'
  #.........................................................................................................
  do =>
    path  = null
    fpath = null
    info  = GUY.temp.with_directory { prefix: 'zzwhatever-', }, ({ path: mypath, }) ->
      path = mypath
      debug '^345-3^', { path, }
      fpath = PATH.join path, 'myfile.txt'
      FS.writeFileSync fpath, "helo"
      isa.fs_file fpath
    debug '^345-4^', info
    T?.eq info, null
    T?.ok not isa.fs_file fpath
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_works_with_async_functions = ( T, done ) ->
  GUY       = require '../../../apps/guy'
  collector = []
  #.........................................................................................................
  async_fn  = ( x ) -> new Promise ( done ) ->
    debug '^43-1^', rpr x
    collector.push x
    await GUY.async.after 0.01, done
    return null
  #.........................................................................................................
  await async_fn '^43-2^'
  await do =>
    path = null
    info = await GUY.temp.with_file { prefix: 'yyy-', }, ({ path: mypath, fd, }) ->
      path = mypath
      await async_fn '^43-3^'
      T?.ok isa.fs_file mypath
    T?.eq info, null
    T?.ok not isa.fs_file path
  #.........................................................................................................
  await async_fn '^43-4^'
  await do =>
    path = null
    info = await GUY.temp.with_directory { prefix: 'yyy-', }, ({ path: mypath, }) ->
      path = mypath
      await async_fn '^43-5^'
      T?.ok isa.fs_directory mypath
    T?.eq info, null
    T?.ok not isa.fs_directory path
  #.........................................................................................................
  await async_fn '^43-6^'
  T?.eq collector, [ '^43-2^', '^43-3^', '^43-4^', '^43-5^', '^43-6^' ]
  debug '^43-7^', collector
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_with_shadow_file = ( T, done ) ->
  GUY         = require '../../../apps/guy'
  base_path   = PATH.resolve PATH.join __dirname, '../../../'
  data_path   = PATH.resolve PATH.join base_path, 'data/guy/temp'
  assets_path = PATH.resolve PATH.join base_path, 'assets/guy/temp'
  #.........................................................................................................
  prepare     = ->
    FS.rmSync data_path,              { recursive: true, force: true, }
    FS.cpSync assets_path, data_path, { recursive: true, force: false, verbatimSymlinks: true, }
  #.........................................................................................................
  do ->
    ### errors with non-existant path ###
    prepare()
    file_path   = PATH.resolve PATH.join data_path, 'XXXXXXXXX'
    T?.throws /no such file/, ->
      GUY.temp.with_shadow_file file_path, ({ path: temp_file_path, }) ->
        debug '^35-1^', temp_file_path
  #.........................................................................................................
  do ->
    ### can read from temp, writing to it updates original ###
    prepare()
    file_path   = PATH.resolve PATH.join data_path, 'helo-world.txt'
    GUY.temp.with_shadow_file file_path, ({ path: temp_file_path, }) ->
      text = FS.readFileSync temp_file_path, { encoding: 'utf-8', }
      T?.eq text, "helo world"
      FS.writeFileSync temp_file_path, "#{text}!!!"
      return null
    text = FS.readFileSync file_path, { encoding: 'utf-8', }
    T?.eq text, "helo world!!!"
  #.........................................................................................................
  do ->
    ### links are transparent ###
    prepare()
    file_path = PATH.resolve PATH.join data_path, 'helo-world.txt.symlink.symlink'
    GUY.temp.with_shadow_file file_path, ({ path: temp_file_path, }) ->
      text = FS.readFileSync temp_file_path, { encoding: 'utf-8', }
      T?.eq text, "helo world"
      FS.writeFileSync temp_file_path, "#{text}!!!"
      return null
    text = FS.readFileSync file_path, { encoding: 'utf-8', }
    T?.eq text, "helo world!!!"
    do ->
      stats           = FS.lstatSync file_path
      result          = {}
      result.symlink  = stats.isSymbolicLink()
      result.file     = stats.isFile()
      result.folder   = stats.isDirectory()
      T?.eq result, { symlink: true, file: false, folder: false, }
    do ->
      stats           = FS.statSync file_path
      result          = {}
      result.symlink  = stats.isSymbolicLink()
      result.file     = stats.isFile()
      result.folder   = stats.isDirectory()
      T?.eq result, { symlink: false, file: true, folder: false, }
  #.........................................................................................................
  do ->
    ### folders are rejected ###
    prepare()
    file_path = PATH.resolve PATH.join data_path, 'helo-world.folder'
    T?.throws /illegal operation on a directory/, ->
      GUY.temp.with_shadow_file file_path, ({ path: temp_file_path, }) ->
  #.........................................................................................................
  do ->
    ### links to folders are rejected ###
    prepare()
    file_path = PATH.resolve PATH.join data_path, 'helo-world.folder.symlink'
    T?.throws /illegal operation on a directory/, ->
      GUY.temp.with_shadow_file file_path, ({ path: temp_file_path, }) ->
  #.........................................................................................................
  return done?()



############################################################################################################
if require.main is module then do =>
  # @GUY_temp_with_shadow_file()
  test @GUY_temp_with_shadow_file
  # test @
  # test @GUY_temp_context_handler_file
  # @GUY_temp_context_handler_file()
  # @GUY_temp_works_with_async_functions()
  # test @GUY_temp_works_with_async_functions



