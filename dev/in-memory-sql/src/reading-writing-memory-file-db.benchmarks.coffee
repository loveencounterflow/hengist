

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
@_cli_pipe = ( cfg, sql_key ) -> new Promise ( resolve ) =>
  ### TAINT should escape command line strings ###
  CP            = require 'child_process'
  sql_path      = cfg.sql[ sql_key ]
  db_path       = cfg.db.path
  file_length   = ( FS.statSync sql_path ).size
  count         = 0
  pragmas       = 'PRAGMA journal_mode = OFF; PRAGMA synchronous = OFF;'
  resolve cli_pipe_fn = => new Promise ( resolve ) =>
    FS.unlinkSync db_path
    CP.execSync "( echo '#{pragmas}' ; cat #{sql_path} ) | sqlite3 #{db_path}"
    count = file_length
    resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@cli_pipe_small   = ( cfg ) => @_cli_pipe cfg, 'small'
@cli_pipe_big     = ( cfg ) => @_cli_pipe cfg, 'big'
# @cli_pipe_bignp   = ( cfg ) => @_cli_pipe cfg, 'bignp'

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
      path:   resolve_path 'data/icql/reading-writing-memory-file-db.db'
    sql:
      small:  resolve_path 'assets/icql/small-datamill.sql'
      big:    resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.sql'
      bignp:  resolve_path 'assets/icql/Chinook_Sqlite_AutoIncrementPKs.no-pragmas.sql'
    # use: 'small'
    # use: [ 'big', 'small', ]
    # use: 'bignp'
  repetitions   = 3
  test_names    = [
    'cli_pipe_small'
    'cli_pipe_big'
    # 'cli_pipe_bignp'
    # '_bettersqlite3'
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
