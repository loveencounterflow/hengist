
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

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_with_shadow_file_works_across_device_boundaries = ( T, done ) ->
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
    ### TAINT path only valid on modern Linux distros ###
    prepare()
    GUY.temp.with_file { tmpdir: '/dev/shm', }, ({ path: shm_path }) ->
      GUY.temp.with_shadow_file shm_path, ({ path: tmp_path, }) ->
        FS.writeFileSync tmp_path, "some words"
      result = FS.readFileSync shm_path, { encoding: 'utf-8', }
      T?.eq result, "some words"
      return null
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_with_shadow_file_can_pick_up_extra_files = ( T, done ) ->
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
    ### TAINT path only valid on modern Linux distros ###
    prepare()
    #.......................................................................................................
    GUY.temp.with_directory { tmpdir: '/dev/shm', }, ({ path: shm_dir_path }) ->
      shm_path = PATH.join shm_dir_path, 'main.txt'
      FS.writeFileSync shm_path, "original content"
      #.....................................................................................................
      GUY.temp.with_shadow_file { path: shm_path, all: true, }, ({ path: tmp_path, }) ->
        FS.writeFileSync tmp_path, "some words"
        extra_tmp_path = PATH.join ( PATH.dirname tmp_path ), 'extra.txt'
        FS.writeFileSync extra_tmp_path, "some extra words"
      #.....................................................................................................
      do ->
        result = FS.readFileSync shm_path, { encoding: 'utf-8', }
        T?.eq result, "some words"
      #.....................................................................................................
      do ->
        extra_shm_path = PATH.join ( PATH.dirname shm_path ), 'extra.txt'
        result = FS.readFileSync extra_shm_path, { encoding: 'utf-8', }
        T?.eq result, "some extra words"
      #.....................................................................................................
      return null
    #.......................................................................................................
    return null
  #.........................................................................................................
  return done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_temp_with_shadow_file_can_bring_along_files = ( T, done ) ->
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
    ### TAINT path only valid on modern Linux distros ###
    prepare()
    #.......................................................................................................
    GUY.temp.with_directory { tmpdir: '/dev/shm', }, ({ path: shm_dir_path }) ->
      shm_path = PATH.join shm_dir_path, 'main.txt'
      FS.writeFileSync shm_path, "original content"
      #.....................................................................................................
      GUY.temp.with_shadow_file { path: shm_path, all: true, }, ({ path: tmp_path, }) ->
        FS.writeFileSync tmp_path, "some words"
        extra_tmp_path = PATH.join ( PATH.dirname tmp_path ), 'extra.txt'
        FS.writeFileSync extra_tmp_path, "some extra words"
      #.....................................................................................................
      do ->
        result = FS.readFileSync shm_path, { encoding: 'utf-8', }
        T?.eq result, "some words"
      #.....................................................................................................
      do ->
        extra_shm_path = PATH.join ( PATH.dirname shm_path ), 'extra.txt'
        result = FS.readFileSync extra_shm_path, { encoding: 'utf-8', }
        T?.eq result, "some extra words"
      #.....................................................................................................
      return null
    #.......................................................................................................
    return null
  #.........................................................................................................
  return done?()


############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################
############################################################################################################

# #-----------------------------------------------------------------------------------------------------------
# @GUY_temp_with_shadow_files = ( T, done ) ->
#   GUY         = require '../../../apps/guy'
#   base_path   = PATH.resolve PATH.join __dirname, '../../../'
#   data_path   = PATH.resolve PATH.join base_path, 'data/guy/temp'
#   assets_path = PATH.resolve PATH.join base_path, 'assets/guy/temp'
#   #.........................................................................................................
#   prepare     = ->
#     FS.rmSync data_path,              { recursive: true, force: true, }
#     FS.cpSync assets_path, data_path, { recursive: true, force: false, verbatimSymlinks: true, }
#   #.........................................................................................................
#   do ->
#     ### errors with non-existant path ###
#     prepare()
#     file_path   = PATH.resolve PATH.join data_path, 'XXXXXXXXX'
#     T?.throws /no such file/, ->
#       GUY.temp.with_shadow_files file_path, ({ paths: temp_file_paths, }) ->
#         debug '^35-1^', temp_file_paths
#   #.........................................................................................................
#   do ->
#     ### can read from temp, writing to it updates original ###
#     prepare()
#     file_path   = PATH.resolve PATH.join data_path, 'helo-world.txt'
#     GUY.temp.with_shadow_files file_path, ({ paths: temp_file_paths, }) ->
#       temp_file_path  = temp_file_paths[ 0 ]
#       text            = FS.readFileSync temp_file_path, { encoding: 'utf-8', }
#       T?.eq text, "helo world"
#       FS.writeFileSync temp_file_path, "#{text}!!!"
#       return null
#     text = FS.readFileSync file_path, { encoding: 'utf-8', }
#     T?.eq text, "helo world!!!"
#   #.........................................................................................................
#   do ->
#     ### links are transparent ###
#     prepare()
#     file_path = PATH.resolve PATH.join data_path, 'helo-world.txt.symlink.symlink'
#     GUY.temp.with_shadow_files file_path, ({ paths: temp_file_paths, }) ->
#       temp_file_path  = temp_file_paths[ 0 ]
#       text            = FS.readFileSync temp_file_path, { encoding: 'utf-8', }
#       T?.eq text, "helo world"
#       FS.writeFileSync temp_file_path, "#{text}!!!"
#       return null
#     text = FS.readFileSync file_path, { encoding: 'utf-8', }
#     T?.eq text, "helo world!!!"
#     do ->
#       stats           = FS.lstatSync file_path
#       result          = {}
#       result.symlink  = stats.isSymbolicLink()
#       result.file     = stats.isFile()
#       result.folder   = stats.isDirectory()
#       T?.eq result, { symlink: true, file: false, folder: false, }
#     do ->
#       stats           = FS.statSync file_path
#       result          = {}
#       result.symlink  = stats.isSymbolicLink()
#       result.file     = stats.isFile()
#       result.folder   = stats.isDirectory()
#       T?.eq result, { symlink: false, file: true, folder: false, }
#   #.........................................................................................................
#   do ->
#     ### folders are rejected ###
#     prepare()
#     file_path = PATH.resolve PATH.join data_path, 'helo-world.folder'
#     T?.throws /illegal operation on a directory/, ->
#       GUY.temp.with_shadow_files file_path, ({ path: temp_file_path, }) ->
#   #.........................................................................................................
#   do ->
#     ### links to folders are rejected ###
#     prepare()
#     file_path = PATH.resolve PATH.join data_path, 'helo-world.folder.symlink'
#     T?.throws /illegal operation on a directory/, ->
#       GUY.temp.with_shadow_files file_path, ({ path: temp_file_path, }) ->
#   #.........................................................................................................
#   return done?()

# #-----------------------------------------------------------------------------------------------------------
# @GUY_temp_with_shadow_files_works_across_device_boundaries = ( T, done ) ->
#   GUY         = require '../../../apps/guy'
#   base_path   = PATH.resolve PATH.join __dirname, '../../../'
#   data_path   = PATH.resolve PATH.join base_path, 'data/guy/temp'
#   assets_path = PATH.resolve PATH.join base_path, 'assets/guy/temp'
#   #.........................................................................................................
#   prepare     = ->
#     FS.rmSync data_path,              { recursive: true, force: true, }
#     FS.cpSync assets_path, data_path, { recursive: true, force: false, verbatimSymlinks: true, }
#   #.........................................................................................................
#   do ->
#     ### TAINT path only valid on modern Linux distros ###
#     prepare()
#     GUY.temp.with_file { tmpdir: '/dev/shm', }, ({ path: shm_path }) ->
#       GUY.temp.with_shadow_files shm_path, ({ paths: tmp_paths, }) ->
#         tmp_path = tmp_paths[ 0 ]
#         FS.writeFileSync tmp_path, "some words"
#       result = FS.readFileSync shm_path, { encoding: 'utf-8', }
#       T?.eq result, "some words"
#       return null
#     return null
#   #.........................................................................................................
#   return done?()

# #-----------------------------------------------------------------------------------------------------------
# @GUY_temp_with_shadow_files_files_may_or_may_not_exist = ( T, done ) ->
#   GUY         = require '../../../apps/guy'
#   base_path   = PATH.resolve PATH.join __dirname, '../../../'
#   data_path   = PATH.resolve PATH.join base_path, 'data/guy/temp'
#   assets_path = PATH.resolve PATH.join base_path, 'assets/guy/temp'
#   #.........................................................................................................
#   prepare     = ->
#     FS.rmSync data_path,              { recursive: true, force: true, }
#     FS.cpSync assets_path, data_path, { recursive: true, force: false, verbatimSymlinks: true, }
#   #.........................................................................................................
#   do ->
#     ### TAINT path only valid on modern Linux distros ###
#     prepare()
#     #.......................................................................................................
#     GUY.temp.with_directory { tmpdir: '/dev/shm', }, ({ path: shm_dir_path }) ->
#       main_shm_path   = PATH.join shm_dir_path, 'main.txt'
#       extra_shm_path  = PATH.join shm_dir_path, 'extra.txt'
#       other_shm_path  = PATH.join shm_dir_path, 'other.txt'
#       shm_paths       = [ main_shm_path, extra_shm_path, other_shm_path, ]
#       FS.writeFileSync main_shm_path,   "main content"
#       FS.writeFileSync extra_shm_path,  "extra content"
#       T?.eq ( FS.existsSync other_shm_path ), false
#       #.....................................................................................................
#       GUY.temp.with_shadow_files shm_paths..., ({ paths: tmp_paths, }) ->
#         [ main_tmp_path
#           extra_tmp_path
#           other_tmp_path ]  = tmp_paths
#         FS.appendFileSync main_tmp_path, " and some words"
#         FS.unlinkSync     extra_shm_path
#         FS.writeFileSync  other_tmp_path, "other content"
#       #.....................................................................................................
#       do ->
#         result = FS.readFileSync main_shm_path, { encoding: 'utf-8', }
#         T?.eq result, "main content and some words"
#       #.....................................................................................................
#       do ->
#         T?.eq ( FS.existsSync extra_shm_path ), false
#       #.....................................................................................................
#       do ->
#         result = FS.readFileSync other_shm_path, { encoding: 'utf-8', }
#         T?.eq result, "other content"
#       #.....................................................................................................
#       return null
#     #.......................................................................................................
#     return null
#   #.........................................................................................................
#   return done?()

# #-----------------------------------------------------------------------------------------------------------
# @GUY_temp_with_shadow_files_can_bring_along_files = ( T, done ) ->
#   GUY         = require '../../../apps/guy'
#   base_path   = PATH.resolve PATH.join __dirname, '../../../'
#   data_path   = PATH.resolve PATH.join base_path, 'data/guy/temp'
#   assets_path = PATH.resolve PATH.join base_path, 'assets/guy/temp'
#   #.........................................................................................................
#   prepare     = ->
#     FS.rmSync data_path,              { recursive: true, force: true, }
#     FS.cpSync assets_path, data_path, { recursive: true, force: false, verbatimSymlinks: true, }
#   #.........................................................................................................
#   do ->
#     ### TAINT path only valid on modern Linux distros ###
#     prepare()
#     #.......................................................................................................
#     GUY.temp.with_directory { tmpdir: '/dev/shm', }, ({ path: shm_dir_path }) ->
#       shm_path = PATH.join shm_dir_path, 'main.txt'
#       FS.writeFileSync shm_path, "original content"
#       #.....................................................................................................
#       GUY.temp.with_shadow_files { path: shm_path, all: true, }, ({ path: tmp_path, }) ->
#         FS.writeFileSync tmp_path, "some words"
#         extra_tmp_path = PATH.join ( PATH.dirname tmp_path ), 'extra.txt'
#         FS.writeFileSync extra_tmp_path, "some extra words"
#       #.....................................................................................................
#       do ->
#         result = FS.readFileSync shm_path, { encoding: 'utf-8', }
#         T?.eq result, "some words"
#       #.....................................................................................................
#       do ->
#         extra_shm_path = PATH.join ( PATH.dirname shm_path ), 'extra.txt'
#         result = FS.readFileSync extra_shm_path, { encoding: 'utf-8', }
#         T?.eq result, "some extra words"
#       #.....................................................................................................
#       return null
#     #.......................................................................................................
#     return null
#   #.........................................................................................................
#   return done?()



############################################################################################################
if require.main is module then do =>
  # @GUY_temp_with_shadow_files()
  # test @GUY_temp_with_shadow_files
  # @GUY_temp_with_shadow_files_works_across_device_boundaries()
  # test @GUY_temp_with_shadow_files_works_across_device_boundaries
  # @GUY_temp_with_shadow_files_files_may_or_may_not_exist()
  # test @GUY_temp_with_shadow_files_files_may_or_may_not_exist
  # test @GUY_temp_context_handler_file
  # @GUY_temp_context_handler_file()
  # @GUY_temp_works_with_async_functions()
  # test @GUY_temp_works_with_async_functions
  # test @GUY_temp_with_shadow_file_works_across_device_boundaries
  # @GUY_temp_with_shadow_file_can_pick_up_extra_files()
  # test @GUY_temp_with_shadow_file_can_pick_up_extra_files
  # @GUY_temp_with_shadow_file_can_bring_along_files()
  # test @GUY_temp_with_shadow_file_can_bring_along_files
  test @


