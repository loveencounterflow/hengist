

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
DATA                      = require '../../../lib/data-providers-nocache'
test                      = require 'guy-test'
{ jr }                    = CND
BM                        = require '../../../lib/benchmarks'
data_cache                = null
gcfg                      = { verbose: false, }
{ freeze }                = require 'letsfreezethat'
SQL                       = String.raw

#-----------------------------------------------------------------------------------------------------------
paths =
  fle:          '/tmp/hengist-in-memory-sql.benchmarks.db',
  fle_jmdel:    '/tmp/hengist-in-memory-sql.jmdel.benchmarks.db'
  fle_jmtrunc:  '/tmp/hengist-in-memory-sql.jmtrunc.benchmarks.db'
  fle_jmpers:   '/tmp/hengist-in-memory-sql.jmpers.benchmarks.db'
  fle_jmmem:    '/tmp/hengist-in-memory-sql.jmmem.benchmarks.db'
  fle_jmwal:    '/tmp/hengist-in-memory-sql.jmwal.benchmarks.db'
  fle_jmoff:    '/tmp/hengist-in-memory-sql.jmoff.benchmarks.db'
  fle_mmap:     '/tmp/hengist-in-memory-sql.mmap.benchmarks.db'
  fle_tmpm:     '/tmp/hengist-in-memory-sql.tmpm.benchmarks.db'
  fle_pgsze:    '/tmp/hengist-in-memory-sql.tmpm.benchmarks.db'
  fle_thrds:    '/tmp/hengist-in-memory-sql.thrds.benchmarks.db'
  fle_qtforum1: '/tmp/hengist-in-memory-sql.qtforum1.benchmarks.db'
  fle_qtforum2: '/tmp/hengist-in-memory-sql.qtforum2.benchmarks.db'

#-----------------------------------------------------------------------------------------------------------
pragmas =
  #.........................................................................................................
  ### thx to https://forum.qt.io/topic/8879/solved-saving-and-restoring-an-in-memory-sqlite-database/2 ###
  qtforum1: [
    'page_size = 4096'
    'cache_size = 16384'
    'temp_store = MEMORY'
    'journal_mode = OFF'
    'locking_mode = EXCLUSIVE'
    'synchronous = OFF' ]
  qtforum2: [
    'page_size = 4096'
    'cache_size = 16384'
    'temp_store = MEMORY'
    'journal_mode = WAL'
    'locking_mode = EXCLUSIVE'
    'synchronous = OFF' ]
  #.........................................................................................................

#-----------------------------------------------------------------------------------------------------------
try_to_remove_file = ( path ) ->
  try FS.unlinkSync path catch error
    return if error.code is 'ENOENT'
    throw error
  return null

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
  # DATOM = require '../../../apps/datom'
  #.........................................................................................................
  texts       = DATA.get_words cfg.word_count
  #.........................................................................................................
  data_cache  = { texts, }
  data_cache  = freeze data_cache
  whisper "...done"
  return data_cache

#-----------------------------------------------------------------------------------------------------------
@pgmem = ( cfg ) -> new Promise ( resolve ) =>
  db            = ( require 'pg-mem' ).newDb()
  PGM           = require 'pg-mem'
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  ### PGM data types:
  array, bigint, bool, box, bytea, circlecitext, date, decimal, float, inet, integer, interval, json,
  jsonb, line, lseg, null, path, point, polygon, record, regclass, regtype, text, time, timestamp,
  timestampz, uuid ###
  # generate_series = ( first_n, last_n ) => 42
  # generate_series_des = {
  #   name:             'generate_series',
  #   args:             [ PGM.DataType.integer, PGM.DataType.integer, ],
  #   returns:          PGM.DataType.integer,
  #   implementation:   generate_series, }
  # db.public.registerFunction generate_series
  # debug db.public.many """select * from generate_series( 1, 10 ) as n;"""
  #.........................................................................................................
  db.public.none """
    create table test(
      id    integer generated by default as identity primary key,
      nr    integer not null,
      text  text );"""
  table = db.public.getTable 'test'
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    db.public.none "begin;" if cfg.use_transaction
    nr      = 0
    for text in data.texts
      nr++
      table.insert { nr, text, }
    db.public.none "commit;" if cfg.use_transaction
    result  = db.public.many """select * from test order by text;"""
    count  += result.length
    show_result 'pgmem', result if gcfg.verbose
    # db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@pgmem_tx = ( cfg ) => @pgmem { cfg..., use_transaction: true, }

#-----------------------------------------------------------------------------------------------------------
@bsqlt_membacked = ( cfg, use_membacked = true ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  # db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
  #.........................................................................................................
  do populate_file = =>
    db_cfg        = null
    db_path       = "/tmp/hengist-in-memory-sql.benchmarks.membacked.db"
    filedb        = new Db db_path, db_cfg
    data          = @get_data cfg
    count         = 0
    #.........................................................................................................
    # filedb.unsafeMode true
    # filedb.pragma 'cache_size = 32000'
    filedb.pragma 'synchronous = OFF' # makes file-based DBs much faster
    #.........................................................................................................
    filedb.exec """drop table if exists test;"""
    filedb.exec """
      create table test(
        id    integer primary key,
        nr    integer not null,
        text  text );"""
    # debug '^22233^', filedb.exec """insert into test ( nr, text ) values ( 1, '2' );"""
    insert        = filedb.prepare """insert into test ( nr, text ) values ( ?, ? );"""
    retrieve      = filedb.prepare """select * from test order by text;"""
    nr      = 0
    for text in data.texts
      nr++
      insert.run [ nr, text, ]
    filedb.backup ':memory:'
    return null
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    result  = retrieve.all()
    count  += result.length
    show_result 'bettersqlite3', result if gcfg.verbose
    if do_backup
      await db.backup ':memory:'
    db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_btsql3 = ( cfg ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  # db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
  defaults      = { do_backup: false, pragmas: [], }
  cfg           = { defaults..., cfg..., }
  db_cfg        = null
  try_to_remove_file cfg.db_path if cfg.db_path isnt ':memory:'
  db            = new Db cfg.db_path, db_cfg
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  # db.unsafeMode true
  # db.pragma 'cache_size = 32000'
  db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  for pragma in cfg.pragmas
    db.pragma pragma
  #.........................................................................................................
  # db.exec """drop table if exists test;"""
  db.exec """
    create table test(
      id    integer primary key,
      nr    integer not null,
      text  text );"""
  # debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
  insert        = db.prepare """insert into test ( nr, text ) values ( ?, ? );"""
  retrieve      = db.prepare """select * from test order by text;"""
  retrieve.raw true
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    nr      = 0
    db.exec "begin transaction;" if cfg.use_transaction
    for text in data.texts
      nr++
      insert.run [ nr, text, ]
    db.exec "commit;" if cfg.use_transaction
    result  = retrieve.all()
    count  += result.length
    show_result 'bettersqlite3', result if gcfg.verbose
    if cfg.do_backup
      await db.backup "/tmp/hengist-in-memory-sql.benchmarks.backup-#{Date.now()}.db"
    db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@bsqlt_mem                = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', }
@bsqlt_mem_tx             = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', use_transaction: true, }
@bsqlt_mem_tx_jmwal       = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', use_transaction: true, pragmas: [ 'journal_mode = WAL;', ], }
@bsqlt_mem_thrds          = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'threads = 4;', ] }
@bsqlt_mem_jmoff          = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'journal_mode = OFF;', ], }
@bsqlt_mem_jmwal          = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'journal_mode = WAL;', ], }
@bsqlt_mem_backup         = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', do_backup: true, }
#...........................................................................................................
@bsqlt_fle                = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle }
@bsqlt_fle_tx             = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle, use_transaction: true, }
@bsqlt_fle_tx_jmwal       = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle, use_transaction: true, pragmas: [ 'journal_mode = WAL;', ], }
@bsqlt_fle_jmdel          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmdel,       pragmas: [ 'journal_mode = DELETE;', ] }
@bsqlt_fle_jmtrunc        = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmtrunc,     pragmas: [ 'journal_mode = TRUNCATE;', ] }
@bsqlt_fle_jmpers         = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmpers,      pragmas: [ 'journal_mode = PERSIST;', ] }
@bsqlt_fle_jmmem          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmmem,       pragmas: [ 'journal_mode = MEMORY;', ] }
@bsqlt_fle_jmwal          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmwal,       pragmas: [ 'journal_mode = WAL;', ] }
@bsqlt_fle_jmoff          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_jmoff,       pragmas: [ 'journal_mode = OFF;', ] }
@bsqlt_fle_mmap           = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_mmap,        pragmas: [ 'mmap_size = 30000000000;', ] }
@bsqlt_fle_tmpm           = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_tmpm,        pragmas: [ 'temp_store = MEMORY;', ] }
@bsqlt_fle_pgsze          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_pgsze,       pragmas: [ 'page_size = 32768;', ] }
@bsqlt_fle_thrds          = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_thrds,       pragmas: [ 'threads = 4;', ] }
@bsqlt_fle_qtforum1       = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_qtforum1,    pragmas: pragmas.qtforum1 }
@bsqlt_fle_qtforum2       = ( cfg ) => @_btsql3 { cfg..., db_path: paths.fle_qtforum2,    pragmas: pragmas.qtforum2 }
#...........................................................................................................
@bsqlt_tmpfs              = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', }
@bsqlt_tmpfs_qtforum2     = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: pragmas.qtforum2, }
@bsqlt_tmpfs_tx           = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', use_transaction: true, }
@bsqlt_tmpfs_tx_jmwal     = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', use_transaction: true, pragmas: [ 'journal_mode = WAL;', ], }
@bsqlt_tmpfs_jmoff        = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = OFF;', ] }
@bsqlt_tmpfs_jmwal        = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = WAL;', ] }
@bsqlt_tmpfs_jmoff32      = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = OFF;', 'page_size = 32768;', 'cache_size = 32768;', ] }
@bsqlt_tmpfs_jmwal32      = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = WAL;', 'page_size = 32768;', 'cache_size = 32768;', ] }
@bsqlt_tmpfs_jmwal_mm0    = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = WAL;', 'mmap_size = 0;' ], }
@bsqlt_tmpfs_jmwal32_mm0  = ( cfg ) => @_btsql3 { cfg..., db_path: '/dev/shm/ram.db', pragmas: [ 'journal_mode = WAL;', 'page_size = 32768;', 'cache_size = 32768;', 'mmap_size = 0;' ], }


#-----------------------------------------------------------------------------------------------------------
@bsqlt_mem_noprepare = ( cfg ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  # db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
  db_cfg        = null
  db            = new Db ':memory:', db_cfg
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  # db.unsafeMode true
  # db.pragma 'cache_size = 32000'
  db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  #.........................................................................................................
  db.exec """drop table if exists test;"""
  db.exec """
    create table test(
      id    integer primary key,
      nr    integer not null,
      text  text );"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    nr      = 0
    for text in data.texts
      nr++
      insert = db.prepare """insert into test ( nr, text ) values ( ?, ? );"""
      insert.run [ nr, text, ]
    retrieve  = db.prepare """select * from test order by text;"""
    result    = retrieve.all()
    count    += result.length
    show_result 'bettersqlite3', result if gcfg.verbose
    db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_bsqlt_memory_icql = ( cfg, icql_version ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  icql_path     = PATH.resolve PATH.join __dirname, '../demo-frp.icql'
  ICQL          = require switch icql_version
    when 'icql_latest'  then '../../../apps/icql'
    when 'icql515'      then 'icql515'
    else throw new Error "^45458^ unknown icql_version: #{rpr icql_version}"
  icql_cfg =
    connector:    Db
    db_path:      ':memory:'
    icql_path:    icql_path
  db            = ICQL.bind icql_cfg
  db.create_table_text()
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    linenr = 0
    for line in data.texts
      linenr++
      db.insert_line { linenr, line, }
    result  = db.$.all_rows db.get_all_texts()
    count  += result.length
    show_result 'bsqlt_memory_icql', result if gcfg.verbose
    db.$.db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@bsqlt_mem_icql515     = ( cfg ) -> @_bsqlt_memory_icql cfg, 'icql515'
@bsqlt_mem_icql_latest = ( cfg ) -> @_bsqlt_memory_icql cfg, 'icql_latest'


#-----------------------------------------------------------------------------------------------------------
@sqljs = ( cfg ) -> new Promise ( resolve ) =>
  # initSqlJs            = require 'sql.js/dist/sql-asm-debug.js'
  # initSqlJs            = require 'sql.js/dist/sql-asm-memory-growth.js'
  # initSqlJs            = require 'sql.js/dist/sql-asm.js'
  # initSqlJs            = require 'sql.js/dist/sql-wasm-debug.js'
  initSqlJs   = require 'sql.js/dist/sql-wasm.js' ### NOTE this is the default import ###
  DB          = await initSqlJs()
  # debug ( k for k of require 'sql.js')
  # debug ( k for k of DB)
  # debug DB
  # debug ( k for k of DB.default)
  # debug ( k for k of DB.default.default)
  db            = new DB.Database()
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  db.run """
    create table test(
      id    integer primary key,
      nr    integer not null,
      text  text );"""
  # debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
  insert        = db.prepare """insert into test ( nr, text ) values ( ?, ? );"""
  retrieve      = db.prepare """select * from test order by text;"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    db.run "begin transaction;" if cfg.use_transaction
    nr      = 0
    for text in data.texts
      nr++
      ### TAINT use prepared statement ###
      # db.run """insert into test ( nr, text ) values ( ?, ? );""", [ nr, text, ]
      insert.bind [ nr, text, ]
      insert.get() while insert.step()
    db.run "commit;" if cfg.use_transaction
    # debug (k for k of retrieve)
    # retrieve.bind(); result = []; result.push retrieve.getAsObject()  while retrieve.step()
    result = []; db.each """select * from test order by text;""", [], ( row ) -> result.push row
    # retrieve.bind(); result = []; result.push retrieve.get()          while retrieve.step()
    count  += result.length
    show_result 'sqljs', result if gcfg.verbose
    db.close()
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@sqljs_tx = ( cfg ) -> @sqljs { cfg..., use_transaction: true, }

#-----------------------------------------------------------------------------------------------------------
@porsagerpostgres_tx = ( cfg ) -> new Promise ( resolve ) =>
  postgres      = require 'postgres'
  sql           = postgres 'postgres://interplot@localhost:5432/interplot'
  count         = 0
  data          = @get_data cfg
  #.........................................................................................................
    # await sql"""begin transaction;"""
  await sql"""drop table if exists test cascade;"""
  await sql"""
    create table test(
      id    integer generated by default as identity primary key,
      nr    integer not null,
      text  text );"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    # { rows }     = await sql"select * from MIRAGE.mirror order by dsk, dsnr, linenr limit 10;"
    nr      = 0
    await sql.begin ( sql ) =>
      for text in data.texts
        nr++
        await sql"""insert into test ( nr, text ) values ( #{nr}, #{text} );"""
    result  = await sql"""select * from test order by text;"""
    show_result 'bettersqlite3', result if gcfg.verbose
    count  += result.length
    await sql.end { timeout: 0 }
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@briancpg_tx = ( cfg ) -> new Promise ( resolve ) =>
  db_cfg        = { database: 'interplot', user: 'interplot', port: 5432, }
  pool          = new ( require 'pg' ).Pool db_cfg
  db            = await pool.connect()
  count         = 0
  data          = @get_data cfg
  #.........................................................................................................
    # await sql"""begin transaction;"""
  await db.query """drop table if exists test cascade;"""
  await db.query """
    create table test(
      id    integer generated by default as identity primary key,
      nr    integer not null,
      text  text );"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    await db.query "truncate table test;"
    try
      await db.query 'begin'
      q =
        text:     """insert into test ( nr, text ) values ( $1, $2 );"""
        rowMode:  'array' ### TAINT does not seem to work ###
        values:   [ 0, '', ]
      nr = 0
      for text in data.texts
        nr++
        q.values = [ nr, text, ]
        await db.query q
      result  = await db.query """select * from test order by text;"""
      await db.query 'commit'
      show_result 'briancpg_tx', result.rows if gcfg.verbose
      count  += result.rows.length
      await resolve count
    finally
      db.release()
      pool.end()
    resolve 1
  return null


#-----------------------------------------------------------------------------------------------------------
@_dbay_prep1 = ( cfg ) -> new Promise ( resolve ) =>
  { DBay }      = require '../../../apps/dbay'
  defaults      = {}
  cfg           = { defaults..., cfg..., }
  db_cfg        = { path: cfg.db_path, }
  try_to_remove_file cfg.db_path
  db            = new DBay db_cfg
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  # db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  db.pragma pragma for pragma in cfg.pragmas ? []
  #.........................................................................................................
  # db.exec """drop table if exists test;"""
  db SQL"""
    create table test(
      id    integer primary key,
      nr    integer not null,
      text  text );"""
  # debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
  insert        = db.prepare SQL"""insert into test ( nr, text ) values ( ?, ? );"""
  retrieve      = db.prepare SQL"""select * from test order by text;"""
  retrieve.raw true
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    nr      = 0
    db.execute "begin transaction;" if cfg.use_transaction
    for text in data.texts
      nr++
      insert.run [ nr, text, ]
    db.execute "commit;" if cfg.use_transaction
    result  = retrieve.all()
    count  += result.length
    show_result '_dbay_prep1', result if gcfg.verbose
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@_dbay_naive = ( cfg ) -> new Promise ( resolve ) =>
  { DBay }      = require '../../../apps/dbay'
  defaults      = {}
  cfg           = { defaults..., cfg..., }
  db_cfg        = { path: cfg.db_path, }
  try_to_remove_file cfg.db_path
  db            = new DBay db_cfg
  data          = @get_data cfg
  count         = 0
  #.........................................................................................................
  # db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  db.pragma pragma for pragma in cfg.pragmas ? []
  #.........................................................................................................
  # db.exec """drop table if exists test;"""
  db SQL"""
    create table test(
      id    integer primary key,
      nr    integer not null,
      text  text );"""
  # debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    nr      = 0
    db.execute "begin transaction;" if cfg.use_transaction
    for text in data.texts
      nr++
      db SQL"""insert into test ( nr, text ) values ( ?, ? );""", [ nr, text, ]
    db.execute "commit;" if cfg.use_transaction
    result  = db SQL"""select * from test order by text;"""
    result  = [ result..., ]
    count  += result.length
    show_result '_dbay_naive', result if gcfg.verbose
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@dbay_tmpfs_prep_tx1  = ( cfg ) => @_dbay_prep1 { cfg..., db_path: '/dev/shm/dbay.db', use_transaction: true, }
@dbay_naive_tx1       = ( cfg ) => @_dbay_naive { cfg..., db_path: '/dev/shm/dbay.db', use_transaction: true, }
@dbay_naive_tx0       = ( cfg ) => @_dbay_naive { cfg..., db_path: '/dev/shm/dbay.db', use_transaction: false, }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  cfg           = { word_count: 10000, }
  repetitions   = 5
  test_names    = [
    'bsqlt_mem'
    'bsqlt_mem_tx'
    'bsqlt_mem_tx_jmwal'
    # 'bsqlt_mem_jmoff'
    'bsqlt_mem_jmwal'
    # 'bsqlt_mem_icql_latest'
    # 'bsqlt_mem_icql515'
    # 'bsqlt_mem_backup'
    # 'bsqlt_mem_noprepare'
    'bsqlt_mem_thrds'
    # 'bsqlt_fle'
    # 'bsqlt_fle_mmap'
    # 'bsqlt_fle_tmpm'
    # 'bsqlt_fle_thrds'
    # 'bsqlt_fle_pgsze'
    'bsqlt_fle_jmwal'
    # 'bsqlt_fle_jmdel'
    # 'bsqlt_fle_jmtrunc' ### NOTE does not produce correct DB file ###
    # 'bsqlt_fle_jmpers'  ### NOTE does not produce correct DB file ###
    # 'bsqlt_fle_jmmem'
    # 'bsqlt_fle_jmoff'
    # 'bsqlt_fle_qtforum1'
    'bsqlt_fle_qtforum2'
    'bsqlt_fle_tx'
    'bsqlt_fle_tx_jmwal'
    'bsqlt_tmpfs_tx'
    'bsqlt_tmpfs_tx_jmwal'
    'bsqlt_tmpfs'
    # 'bsqlt_tmpfs_jmoff'
    'bsqlt_tmpfs_jmwal'
    'bsqlt_tmpfs_qtforum2'
    # 'bsqlt_tmpfs_jmoff32'
    # 'bsqlt_tmpfs_jmwal32'
    # 'bsqlt_tmpfs_jmwal_mm0'
    # 'bsqlt_tmpfs_jmwal32_mm0'
    'pgmem'
    'pgmem_tx'
    'sqljs'
    'sqljs_tx'
    'porsagerpostgres_tx'
    'briancpg_tx'
    'dbay_tmpfs_prep_tx1'
    'dbay_naive_tx1'
    'dbay_naive_tx0'
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
