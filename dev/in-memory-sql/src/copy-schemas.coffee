

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'IN-MEMORY-SQL'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
FSP                       = require 'fs/promises'
DATA                      = require '../../../lib/data-providers-nocache'
test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null
types                     = new ( require 'intertype' ).Intertype
{ isa
  validate }              = types.export()
#-----------------------------------------------------------------------------------------------------------
gcfg                      = { verbose: false, echo: false, }
LFT                       = require 'letsfreezethat'

#-----------------------------------------------------------------------------------------------------------
pragmas =
  #.........................................................................................................
  ### thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 ###
  fle: [
    'page_size = 4096'
    'cache_size = 16384'
    'temp_store = MEMORY'
    'journal_mode = WAL'
    'locking_mode = EXCLUSIVE'
    'synchronous = OFF' ]
  #.........................................................................................................
  mem: []
  bare: []

#-----------------------------------------------------------------------------------------------------------
resolve_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../../', path

#-----------------------------------------------------------------------------------------------------------
try_to_remove_file = ( path ) ->
  try FS.unlinkSync path catch error
    return if error.code is 'ENOENT'
    throw error
  return null

#-----------------------------------------------------------------------------------------------------------
@is_new = ( x ) ->
  R = not @is_new.cache.has x
  @is_new.cache.set x, true
  return R
@is_new.cache = new Map()

#-----------------------------------------------------------------------------------------------------------
show_result = ( name, result ) ->
  info '-----------------------------------------------'
  urge name
  whisper result
  info '-----------------------------------------------'
  return null

#-----------------------------------------------------------------------------------------------------------
@get_data = ( cfg ) ->
  return data_cache if data_cache?
  whisper "retrieving test data..."
  DATOM = require '../../../apps/datom'
  #.........................................................................................................
  texts       = DATA.get_words cfg.word_count
  #.........................................................................................................
  data_cache  = { texts, }
  data_cache  = DATOM.freeze data_cache
  whisper "...done"
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@_btsql3 = ( cfg ) -> new Promise ( resolve ) =>
  # data          = @get_data cfg
  _icql             = ( LFT._deep_copy require '../../../apps/icql' )._local_methods
  Db                = require 'better-sqlite3'
  defaults          = { pragmas: [], size: 'small', save: null, }
  cfg               = { defaults..., cfg..., }
  db_work_path      = cfg.db.work[ cfg.mode ].replaceAll '${0}', cfg.ref
  validate.nonempty_text cfg.ref
  db_template_path  = cfg.db.templates[ cfg.size ].replaceAll '${0}', cfg.ref
  db_target_path    = cfg.db.target[    cfg.size ].replaceAll '${0}', cfg.ref
  db_temp_path      = cfg.db.temp[      cfg.size ].replaceAll '${0}', cfg.ref
  validate.nonempty_text db_template_path
  validate.nonempty_text db_target_path
  validate.nonempty_text db_temp_path
  db_cfg            = null
  # db_size           = ( FS.statSync db_template_path ).size
  count             = 0
  data              = @get_data cfg
  if gcfg.verbose
    help "^44433^ template  DB:", db_template_path
    help "^44433^ work      DB:", db_work_path
    help "^44433^ target    DB:", db_target_path
    help "^44433^ temp      DB:", db_temp_path
  try_to_remove_file db_target_path
  try_to_remove_file db_temp_path
  try_to_remove_file db_work_path unless db_work_path is ':memory:'
  await FSP.copyFile db_template_path, db_target_path
  #.........................................................................................................
  resolve => new Promise ( resolve ) => # ^777854^
    #=======================================================================================================
    db              = new Db db_target_path, db_cfg
    _icql.settings  = { echo: gcfg.echo ? false, verbose: gcfg.verbose ? false, }
    _icql.db        = db
    _icql.pragma pragma for pragma in cfg.pragmas
    fle_schema      = 'main'
    work_schema     = 'x'
    work_schema_x   = _icql.as_identifier 'x'
    _icql.attach db_work_path, work_schema
    _icql.copy_schema fle_schema, work_schema
    #-------------------------------------------------------------------------------------------------------
    db.exec """drop table if exists #{work_schema_x}.test;"""
    db.exec """
      create table #{work_schema_x}.test(
        id    integer primary key,
        nr    integer not null,
        text  text );"""
    insert  = db.prepare """insert into #{work_schema_x}.test ( nr, text ) values ( ?, ? );"""
    nr      = 0
    for text in data.texts
      nr++
      insert.run [ nr, text, ]
    retrieve  = db.prepare """select * from #{work_schema_x}.test order by text;"""
    result    = retrieve.all()
    count     = result.length
    #-------------------------------------------------------------------------------------------------------
    if cfg.mode is 'mem'
      ### TAINT must unlink original DB file, replace withtemp file ###
      switch cfg.save
        when 'copy'
          temp_schema = 't'
          # temp_schema_x   = _icql.as_identifier 'x'
          _icql.attach db_temp_path, temp_schema
          _icql.copy_schema fle_schema, temp_schema
        when 'backup'
          await _icql.backup db_temp_path
        else throw new Error "^44747^ unknown value for `cfg.save`: #{rpr cfg.save}"
    #-------------------------------------------------------------------------------------------------------
    _icql.close()
    return resolve count
    # resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@btsql3_mem_small_backup   = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'mem', size: 'small', pragmas: pragmas.mem, save: 'backup', }
@btsql3_mem_big_backup     = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'mem', size: 'big',   pragmas: pragmas.mem, save: 'backup', }
@btsql3_mem_small_copy     = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'mem', size: 'small', pragmas: pragmas.mem, save: 'copy', }
@btsql3_mem_big_copy       = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'mem', size: 'big',   pragmas: pragmas.mem, save: 'copy', }
@btsql3_fle_small          = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'fle', size: 'small', pragmas: pragmas.fle, }
@btsql3_fle_big            = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'fle', size: 'big',   pragmas: pragmas.fle, }
@btsql3_fle_small_bare     = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'fle', size: 'small', pragmas: pragmas.bare, }
@btsql3_fle_big_bare       = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'fle', size: 'big',   pragmas: pragmas.bare, }
# @btsql3_mem_thrds    = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'threads = 4;', ] }

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  gcfg.echo     = true
  gcfg.echo     = false
  bench         = BM.new_benchmarks()
  cfg           =
    word_count: 1000
    db:
      templates:
        small:  resolve_path 'assets/icql/small-datamill.db'
        big:    resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.db'
      target:
        small:  resolve_path 'data/icql/copy-schemas-benchmarks-${0}.db'
        big:    resolve_path 'data/icql/copy-schemas-benchmarks-${0}.db'
      work:
        mem:    ':memory:'
        fle:    'data/icql/copy-schemas-work-${0}.db'
      temp:
        small:  resolve_path 'data/icql/copy-schemas-benchmarks-temp-${0}.db'
        big:    resolve_path 'data/icql/copy-schemas-benchmarks-temp-${0}.db'
  repetitions   = 3
  test_names    = [
    'btsql3_fle_small'
    'btsql3_mem_small_backup'
    'btsql3_mem_big_backup'
    'btsql3_mem_small_copy'
    'btsql3_mem_big_copy'
    'btsql3_fle_big'
    'btsql3_fle_small_bare'
    'btsql3_fle_big_bare'
    ]
  global.gc() if global.gc?
  data_cache = null
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      global.gc() if global.gc?
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()
