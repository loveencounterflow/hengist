

'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'IN-MEMORY-SQL/READING-WRITING-MEMORY-FILE-DB'
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

#-----------------------------------------------------------------------------------------------------------
resolve_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../../', path

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
  DATOM = require '../../../apps/datom'
  #.........................................................................................................
  texts       = DATA.get_words cfg.word_count
  #.........................................................................................................
  data_cache  = { texts, }
  data_cache  = DATOM.freeze data_cache
  whisper "...done"
  return data_cache

# #-----------------------------------------------------------------------------------------------------------
# backup_to_memory = =>
#   ### TAINT should escape command line strings ###
#   CP            = require 'child_process'
#   sql_path      = cfg.readsql[ sql_key ]
#   db_path       = cfg.db[ sql_key ]
#   pragmas       = 'PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;'
#   resolve readsql_clipipe_fn = => new Promise ( resolve ) =>
#     try_to_remove_file db_path
#     CP.execSync "( echo '#{pragmas}' ; cat #{sql_path} ) | sqlite3 #{db_path}"
#     resolve ( FS.statSync sql_path ).size
#   return null

#-----------------------------------------------------------------------------------------------------------
@_readsql_clipipe = ( cfg, sql_key ) -> new Promise ( resolve ) =>
  ### TAINT should escape command line strings ###
  CP            = require 'child_process'
  sql_path      = cfg.readsql[ sql_key ]
  db_path       = cfg.db[ sql_key ]
  pragmas       = 'PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;'
  resolve readsql_clipipe_fn = => new Promise ( resolve ) =>
    try_to_remove_file db_path
    CP.execSync "( echo '#{pragmas}' ; cat #{sql_path} ) | sqlite3 #{db_path}"
    resolve ( FS.statSync sql_path ).size
  return null

#-----------------------------------------------------------------------------------------------------------
@_readsql_bsqlt3 = ( cfg, sql_key, fsmode ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  db_cfg        = null
  db            = new Db ':memory:', db_cfg
  sql_path      = cfg.readsql[ sql_key ]
  FSP           = require 'fs/promises'
  resolve readsql_bsqlt3 = => new Promise ( resolve ) =>
    db.pragma 'journal_mode = OFF;'
    db.pragma 'synchronous = OFF;'
    switch fsmode
      when 'sync'
        sql = FS.readFileSync     sql_path, { encoding: 'utf-8', }
        db.exec sql
        return resolve sql.length
      when 'promise'
        sql = await FSP.readFile  sql_path, { encoding: 'utf-8', }
        db.exec sql
        return resolve sql.length
      when 'callback'
        FS.readFile sql_path, { encoding: 'utf-8', }, ( error, sql ) =>
          throw error if error?
          db.exec sql
          return resolve sql.length
        return
    throw new Error "^_readsql_bsqlt3@5587^ unknown fsmode #{rpr fsmode}"
  return null

#-----------------------------------------------------------------------------------------------------------
@_writesql_clipipe = ( cfg, sql_key ) -> new Promise ( resolve ) =>
  ### TAINT should escape command line strings ###
  CP            = require 'child_process'
  sql_path      = cfg.writesql[ sql_key ]
  db_path       = cfg.db[ sql_key ]
  resolve readsql_clipipe_fn = => new Promise ( resolve ) =>
    CP.execSync "sqlite3 #{db_path} -cmd '.dump' > #{sql_path}"
    resolve ( FS.statSync sql_path ).size
  return null

#-----------------------------------------------------------------------------------------------------------
@readsql_clipipe_small          = ( cfg ) => @_readsql_clipipe   cfg, 'small'
@readsql_clipipe_big            = ( cfg ) => @_readsql_clipipe   cfg, 'big'
@readsql_bsqlt3_small_promise   = ( cfg ) => @_readsql_bsqlt3    cfg, 'small',  'promise'
@readsql_bsqlt3_big_promise     = ( cfg ) => @_readsql_bsqlt3    cfg, 'big',    'promise'
@readsql_bsqlt3_small_sync      = ( cfg ) => @_readsql_bsqlt3    cfg, 'small',  'sync'
@readsql_bsqlt3_big_sync        = ( cfg ) => @_readsql_bsqlt3    cfg, 'big',    'sync'
@readsql_bsqlt3_small_callback  = ( cfg ) => @_readsql_bsqlt3    cfg, 'small',  'callback'
@readsql_bsqlt3_big_callback    = ( cfg ) => @_readsql_bsqlt3    cfg, 'big',    'callback'
@writesql_clipipe_small         = ( cfg ) => @_writesql_clipipe  cfg, 'small'
@writesql_clipipe_big           = ( cfg ) => @_writesql_clipipe  cfg, 'big'

#-----------------------------------------------------------------------------------------------------------
@_bettersqlite3 = ( cfg ) -> new Promise ( resolve ) =>
  Db            = require 'better-sqlite3'
  # db_cfg        = { verbose: ( CND.get_logger 'whisper', '^33365^ SQLite3' ), }
  db_cfg        = null
  db            = new Db ':memory:', db_cfg
  data          = @get_data cfg
  count         = 0
  sql_path      = cfg.sql[ cfg.use ]
  debug '^96833^', { sql_path, }
  #.........................................................................................................
  # db.unsafeMode true
  # db.pragma 'cache_size = 32000'
  db.pragma 'synchronous = OFF' # makes file-based DBs much faster
  #.........................................................................................................
  # db.exec """drop table if exists test;"""
  # db.exec """
  #   create table test(
  #     id    integer primary key,
  #     nr    integer not null,
  #     text  text );"""
  # # debug '^22233^', db.exec """insert into test ( nr, text ) values ( 1, '2' );"""
  # insert        = db.prepare """insert into test ( nr, text ) values ( ?, ? );"""
  # retrieve      = db.prepare """select * from test order by text;"""
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    db.exec ".read #{sql_path}"
    # nr      = 0
    # for text in data.texts
    #   nr++
    #   insert.run [ nr, text, ]
    # result  = retrieve.all()
    # count  += result.length
    # show_result 'bettersqlite3', result if gcfg.verbose
    # if do_backup
    #   await db.backup "/tmp/hengist-in-memory-sql.benchmarks.backup-#{Date.now()}.db"
    # db.close()
    resolve 1 # count
  return null

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  cfg           =
    db:
      small:  resolve_path 'data/icql/small-datamill.db'
      big:    resolve_path 'data/icql/Chinook_Sqlite_AutoIncrementPKs.db'
    readsql:
      small:  resolve_path 'assets/icql/small-datamill.sql'
      big:    resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql'
    writesql:
      small:  resolve_path 'data/icql/small-datamill.sql'
      big:    resolve_path 'data/icql/Chinook_Sqlite_AutoIncrementPKs.sql'
    # use: 'small'
    # use: [ 'big', 'small', ]
    # use: 'bignp'
  repetitions   = 3
  #.........................................................................................................
  run_phase = ( test_names ) =>
    global.gc() if global.gc?
    data_cache = null
    for _ in [ 1 .. repetitions ]
      whisper '-'.repeat 108
      for test_name in CND.shuffle test_names
        global.gc() if global.gc?
        await BM.benchmark bench, cfg, false, @, test_name
    BM.show_totals bench
    return null
  # #.........................................................................................................
  # test_names    = [
  #   'readsql_clipipe_small'
  #   'readsql_clipipe_big'
  #   ]
  # await run_phase test_names
  #.........................................................................................................
  test_names    = [
    'readsql_bsqlt3_small_promise'
    'readsql_bsqlt3_big_promise'
    'readsql_bsqlt3_small_sync'
    'readsql_bsqlt3_big_sync'
    'readsql_bsqlt3_small_callback'
    'readsql_bsqlt3_big_callback'
    ]
  await run_phase test_names
  # #.........................................................................................................
  # test_names    = [
  #   'writesql_clipipe_small'
  #   'writesql_clipipe_big'
  #   ]
  # await run_phase test_names
  #.........................................................................................................
  # await run_phase [ 'readsql_bsqlt3_small_promise', ]
  return null


############################################################################################################
if require.main is module then do =>
  await @run_benchmarks()
  xxx = ->
    Db            = require 'better-sqlite3'
    db_cfg        = null
    db            = new Db '/tmp/foo.db', db_cfg
    db.exec "drop table if exists x;"
    db.exec "create table x ( n integer );"
    for n in [ 1 .. 10 ]
      db.exec "insert into x ( n ) values ( #{n} );"
    # db.exec "vacuum into '/tmp/foo2.db';"
    db.exec "vacuum into ':memory:';"
    for n in [ 11 .. 20 ]
      db.exec "insert into x ( n ) values ( #{n} );"
    debug '^333344^', db.memory = true
    debug '^333344^', db.memory
    return null
  return null


