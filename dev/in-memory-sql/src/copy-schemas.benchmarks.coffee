

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
# test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null
types                     = new ( require 'intertype' ).Intertype
{ isa
  validate
  validate_list_of }      = types.export()
#-----------------------------------------------------------------------------------------------------------
gcfg                      = { verbose: false, echo: false, }
LFT                       = require 'letsfreezethat'
mkdirp                    = require 'mkdirp'


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
  #.........................................................................................................
  ### TAINT use proper string interpolation ###
  validate.nonempty_text cfg.ref
  db_work_path      = cfg.db.work[      cfg.mode ].replaceAll '{ref}',  cfg.ref
  db_template_path  = cfg.db.templates[ cfg.size ].replaceAll '{ref}',  cfg.ref
  db_target_path    = cfg.db.target[    cfg.size ].replaceAll '{ref}',  cfg.ref
  db_temp_path      = cfg.db.temp[      cfg.size ].replaceAll '{ref}',  cfg.ref
  #.........................................................................................................
  validate.nonempty_text db_template_path
  validate.nonempty_text db_target_path
  validate.nonempty_text db_temp_path
  #.........................................................................................................
  pragmas           = cfg.pragma_sets[ cfg.pragmas ]
  validate_list_of.nonempty_text pragmas
  #.........................................................................................................
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
    switch cfg.mode
      when 'mem', 'tmp'
        work_schema     = 'x'
        _icql.attach db_work_path, work_schema
        _icql.copy_schema fle_schema, work_schema
      when 'fle', 'ram'
        work_schema     = 'main'
      else throw new Error "^44788^ unknown value for `cfg.mode`: #{rpr cfg.mode}"
    #-------------------------------------------------------------------------------------------------------
    work_schema_x = _icql.as_identifier work_schema
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
      ### TAINT must unlink original DB file, replace with temp file ###
      switch cfg.save
        when 'copy'
          temp_schema = 't'
          # temp_schema_x   = _icql.as_identifier 'x'
          _icql.attach db_temp_path, temp_schema
          _icql.copy_schema fle_schema, temp_schema
        when 'backup'
          ### TAINT use `{ attached: schema, }` (see https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md#backupdestination-options---promise) ###
          # progress = ( d ) -> info '^557744^', "backup progress:", d; return 1000
          progress = null
          await _icql.backup db_temp_path, { attached: work_schema, progress, }
        when 'vacuum'
          _icql.execute "vacuum #{work_schema_x} into #{_icql.as_sql db_temp_path};"
        else throw new Error "^44747^ unknown value for `cfg.save`: #{rpr cfg.save}"
    #-------------------------------------------------------------------------------------------------------
    _icql.close()
    return resolve count
    # resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@btsql3_tmp_small_backup   = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_small_backup', mode: 'tmp', size: 'small', pragmas: 'tmp', save: 'backup', }
@btsql3_tmp_big_backup     = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_big_backup',   mode: 'tmp', size: 'big',   pragmas: 'tmp', save: 'backup', }
@btsql3_tmp_small_vacuum   = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_small_vacuum', mode: 'tmp', size: 'small', pragmas: 'tmp', save: 'vacuum', }
@btsql3_tmp_big_vacuum     = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_big_vacuum',   mode: 'tmp', size: 'big',   pragmas: 'tmp', save: 'vacuum', }
@btsql3_tmp_small_copy     = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_small_copy',   mode: 'tmp', size: 'small', pragmas: 'tmp', save: 'copy', }
@btsql3_tmp_big_copy       = ( cfg ) => @_btsql3 { cfg..., ref: 'tmp_big_copy',     mode: 'tmp', size: 'big',   pragmas: 'tmp', save: 'copy', }
@btsql3_mem_small_backup   = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_small_backup', mode: 'mem', size: 'small', pragmas: 'mem', save: 'backup', }
@btsql3_mem_big_backup     = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_big_backup',   mode: 'mem', size: 'big',   pragmas: 'mem', save: 'backup', }
@btsql3_mem_small_vacuum   = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_small_vacuum', mode: 'mem', size: 'small', pragmas: 'mem', save: 'vacuum', }
@btsql3_mem_big_vacuum     = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_big_vacuum',   mode: 'mem', size: 'big',   pragmas: 'mem', save: 'vacuum', }
@btsql3_mem_small_copy     = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_small_copy',   mode: 'mem', size: 'small', pragmas: 'mem', save: 'copy', }
@btsql3_mem_big_copy       = ( cfg ) => @_btsql3 { cfg..., ref: 'mem_big_copy',     mode: 'mem', size: 'big',   pragmas: 'mem', save: 'copy', }
@btsql3_fle_small          = ( cfg ) => @_btsql3 { cfg..., ref: 'fle_small',        mode: 'fle', size: 'small', pragmas: 'fle', }
@btsql3_fle_big            = ( cfg ) => @_btsql3 { cfg..., ref: 'fle_big',          mode: 'fle', size: 'big',   pragmas: 'fle', }
@btsql3_fle_small_bare     = ( cfg ) => @_btsql3 { cfg..., ref: 'fle_small_bare',   mode: 'fle', size: 'small', pragmas: 'bare', }
@btsql3_fle_big_bare       = ( cfg ) => @_btsql3 { cfg..., ref: 'fle_big_bare',     mode: 'fle', size: 'big',   pragmas: 'bare', }
# @btsql3_ram_small_backup   = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_small_backup', mode: 'ram', size: 'small', pragmas: 'ram', save: 'backup', }
# @btsql3_ram_big_backup     = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_big_backup',   mode: 'ram', size: 'big',   pragmas: 'ram', save: 'backup', }
@btsql3_ram_small_vacuum   = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_small_vacuum', mode: 'ram', size: 'small', pragmas: 'ram', save: 'vacuum', }
@btsql3_ram_big_vacuum     = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_big_vacuum',   mode: 'ram', size: 'big',   pragmas: 'ram', save: 'vacuum', }
# @btsql3_ram_small_copy     = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_small_copy',   mode: 'ram', size: 'small', pragmas: 'ram', save: 'copy', }
# @btsql3_ram_big_copy       = ( cfg ) => @_btsql3 { cfg..., ref: 'ram_big_copy',     mode: 'ram', size: 'big',   pragmas: 'ram', save: 'copy', }

# @btsql3_mem_thrds    = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'threads = 4;', ] }

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  # gcfg.verbose  = true
  gcfg.verbose  = false
  gcfg.echo     = true
  gcfg.echo     = false
  bench         = BM.new_benchmarks()
  ### TAINT user ID might be different ###
  mkdirp.sync '/run/user/1000/hengist-icql-benchmarks'
  #.........................................................................................................
  cfg           =
    # word_count: 100_000
    word_count: 10_000
    # word_count: 1_000
    # word_count: 10
    db:
      templates:
        small:  resolve_path 'assets/icql/small-datamill.db'
        big:    resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.db'
      target:
        small:  resolve_path 'data/icql/copy-schemas-benchmarks-{ref}.db'
        big:    resolve_path 'data/icql/copy-schemas-benchmarks-{ref}.db'
      work:
        tmp:    ''
        mem:    ':memory:'
        fle:    'data/icql/copy-schemas-work-{ref}.db'
        ram:    '/run/user/1000/hengist-icql-benchmarks/copy-schemas-work-{ref}.db'
      temp:
        small:  resolve_path 'data/icql/copy-schemas-benchmarks-temp-{ref}.db'
        big:    resolve_path 'data/icql/copy-schemas-benchmarks-temp-{ref}.db'
    pragma_sets:
      #.....................................................................................................
      ### thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 ###
      fle: [
        'page_size = 4096'
        'cache_size = 16384'
        'temp_store = MEMORY'
        'journal_mode = WAL'
        'locking_mode = EXCLUSIVE'
        'synchronous = OFF' ]
      #.....................................................................................................
      tmp:  [ 'temp_store = file;', ]
      mem:  []
      bare: []
      ram:  [
        'page_size = 4096'
        'cache_size = 16384'
        'temp_store = MEMORY'
        'journal_mode = WAL'
        'locking_mode = EXCLUSIVE'
        'synchronous = OFF' ]
  #.........................................................................................................
  repetitions   = 3
  # test_names    = [
  #   'btsql3_mem_big_vacuum'
  #   # 'btsql3_ram_big_vacuum'
  #   'btsql3_ram_small_vacuum'
  #   ]
  test_names    = [
    'btsql3_mem_big_backup'
    'btsql3_mem_big_vacuum'
    'btsql3_mem_small_backup'
    'btsql3_mem_small_vacuum'
    'btsql3_tmp_big_backup'
    'btsql3_tmp_big_vacuum'
    'btsql3_tmp_small_backup'
    'btsql3_tmp_small_vacuum'
    # 'btsql3_ram_small_backup'
    # 'btsql3_ram_big_backup'
    # 'btsql3_ram_small_vacuum'
    # 'btsql3_ram_big_vacuum'
    # 'btsql3_ram_small_copy'
    # 'btsql3_ram_big_copy'

    # 'btsql3_fle_small'
    # 'btsql3_fle_big'
    # 'btsql3_fle_small_bare'
    # 'btsql3_fle_big_bare'
    # # 'btsql3_tmp_small_copy'
    # # 'btsql3_tmp_big_copy'
    # # 'btsql3_mem_small_copy'
    # # 'btsql3_mem_big_copy'
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
  warn "^3442342^ add benchmarks to test clearing and copying back of data?"

###

 ~/jzr/hengist  master !3  nodexh ~/jzr/hengist/dev/in-memory-sql/lib/copy-schemas.js                                                            ✔
00:00 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
00:01 IN-MEMORY-SQL  ▶  retrieving test data...
00:01 IN-MEMORY-SQL  ▶  ...done
btsql3_fle_big                             0.640 s          10,000 items          15,622⏶Hz          64,012⏷nspc
btsql3_fle_small                           0.643 s          10,000 items          15,551⏶Hz          64,303⏷nspc
btsql3_mem_small_backup                    0.386 s          10,000 items          25,934⏶Hz          38,560⏷nspc
btsql3_mem_big_backup                      0.420 s          10,000 items          23,796⏶Hz          42,024⏷nspc
00:03 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
btsql3_fle_small                           0.649 s          10,000 items          15,417⏶Hz          64,865⏷nspc
btsql3_mem_big_backup                      0.422 s          10,000 items          23,672⏶Hz          42,245⏷nspc
btsql3_fle_big                             0.630 s          10,000 items          15,884⏶Hz          62,955⏷nspc
btsql3_mem_small_backup                    0.364 s          10,000 items          27,478⏶Hz          36,393⏷nspc
00:05 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
btsql3_mem_big_backup                      0.425 s          10,000 items          23,509⏶Hz          42,536⏷nspc
btsql3_fle_big                             0.630 s          10,000 items          15,870⏶Hz          63,012⏷nspc
btsql3_mem_small_backup                    0.371 s          10,000 items          26,937⏶Hz          37,124⏷nspc
btsql3_fle_small                           0.635 s          10,000 items          15,742⏶Hz          63,525⏷nspc
00:07 HENGIST/BENCHMARKS  ▶  btsql3_mem_small_backup                           26,783 Hz ≙ 1 ÷ 1.0       100.0 % │████████████▌│
00:07 HENGIST/BENCHMARKS  ▶  btsql3_mem_big_backup                             23,659 Hz ≙ 1 ÷ 1.1        88.3 % │███████████  │
00:07 HENGIST/BENCHMARKS  ▶  btsql3_fle_big                                    15,792 Hz ≙ 1 ÷ 1.7        59.0 % │███████▍     │
00:07 HENGIST/BENCHMARKS  ▶  btsql3_fle_small                                  15,570 Hz ≙ 1 ÷ 1.7        58.1 % │███████▎     │

 ~/jzr/hengist  master !3  nodexh ~/jzr/hengist/dev/in-memory-sql/lib/copy-schemas.js                                                       ✔  8s
00:00 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
00:01 IN-MEMORY-SQL  ▶  retrieving test data...
00:01 IN-MEMORY-SQL  ▶  ...done
btsql3_mem_big_backup                      3.453 s         100,000 items          28,961⏶Hz          34,529⏷nspc
btsql3_fle_big                             5.991 s         100,000 items          16,692⏶Hz          59,909⏷nspc
btsql3_mem_small_backup                    3.410 s         100,000 items          29,328⏶Hz          34,097⏷nspc
btsql3_fle_small                           5.904 s         100,000 items          16,937⏶Hz          59,043⏷nspc
00:20 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
btsql3_fle_big                             5.914 s         100,000 items          16,908⏶Hz          59,142⏷nspc
btsql3_fle_small                           5.927 s         100,000 items          16,872⏶Hz          59,271⏷nspc
btsql3_mem_big_backup                      3.495 s         100,000 items          28,611⏶Hz          34,952⏷nspc
btsql3_mem_small_backup                    3.406 s         100,000 items          29,363⏶Hz          34,056⏷nspc
00:39 IN-MEMORY-SQL  ▶  ------------------------------------------------------------------------------------------------------------
btsql3_mem_big_backup                      3.482 s         100,000 items          28,717⏶Hz          34,823⏷nspc
btsql3_fle_big                             5.905 s         100,000 items          16,935⏶Hz          59,050⏷nspc
btsql3_mem_small_backup                    3.421 s         100,000 items          29,234⏶Hz          34,207⏷nspc
btsql3_fle_small                           5.921 s         100,000 items          16,889⏶Hz          59,211⏷nspc
00:58 HENGIST/BENCHMARKS  ▶  btsql3_mem_small_backup                           29,309 Hz ≙ 1 ÷ 1.0       100.0 % │████████████▌│
00:58 HENGIST/BENCHMARKS  ▶  btsql3_mem_big_backup                             28,763 Hz ≙ 1 ÷ 1.0        98.1 % │████████████▎│
00:58 HENGIST/BENCHMARKS  ▶  btsql3_fle_small                                  16,899 Hz ≙ 1 ÷ 1.7        57.7 % │███████▎     │
00:58 HENGIST/BENCHMARKS  ▶  btsql3_fle_big                                    16,845 Hz ≙ 1 ÷ 1.7        57.5 % │███████▏     │

###