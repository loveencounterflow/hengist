

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
walk_statements = ( sql_path ) ->
  ### Given a path, iterate over SQL statements which are signalled by semicolons (`;`) that appear outside
  of literals and comments (and the end of input). ###
  ### thx to https://stackabuse.com/reading-a-file-line-by-line-in-node-js/ ###
  ### thx to https://github.com/nacholibre/node-readlines ###
  readlines       = new ( require 'n-readlines' ) sql_path
  #.........................................................................................................
  cfg           =
    regExp: ( require 'mysql-tokenizer/lib/regexp-sql92' )
  tokenize      = ( require 'mysql-tokenizer' ) cfg
  collector     = null
  stream        = FS.createReadStream sql_path
  #.........................................................................................................
  flush = ->
    R         = collector.join ''
    collector = null
    return R
  #.........................................................................................................
  while ( line = readlines.next() ) isnt false
    for token, cur_idx in tokenize line + '\n'
      if token is ';'
        ( collector ?= [] ).push token
        yield flush()
        continue
      # if token.startsWith '--'
      #   continue
      ( collector ?= [] ).push token
  yield flush() if collector?
  return null

#-----------------------------------------------------------------------------------------------------------
walk_lines = ( sql_path ) ->
  ### This method iterates over lines instead of tokenizing and re-collecting them into statement-sized
  chunks; it exists so we can compare its performance with that of `walk_statements()` to get an idea how
  much the SQL tokenizer is contributing. ###
  readlines       = new ( require 'n-readlines' ) sql_path
  #.........................................................................................................
  while ( line = readlines.next() ) isnt false
    yield line
  return null

#-----------------------------------------------------------------------------------------------------------
walk_batches = ( iterator, batch_size = 1 ) ->
  ### Given an iterator and a batch size, iterate over lists of values yielded by the iterator. ###
  batch = null
  for d from iterator
    ( batch ?= [] ).push d
    if batch.length >= batch_size
      yield batch
      batch = null
  yield batch if batch?
  return null

#-----------------------------------------------------------------------------------------------------------
@_parse_sql_stream_msqlt = ( cfg, sql_key ) => new Promise ( resolve ) =>
  sql_path      = cfg.readsql[ sql_key ]
  batch_size    = 100
  count         = 0
  Db            = require 'better-sqlite3'
  db_cfg        = null
  db            = new Db ':memory:', db_cfg
  return resolve parse_sql = => new Promise ( resolve ) =>
    for statements from walk_batches ( walk_statements sql_path ), batch_size
      compound_statement  = statements.join ''
      count              += compound_statement.length
      db.exec compound_statement
    resolve count

#-----------------------------------------------------------------------------------------------------------
@_parse_sql_stream_msqlt_nodb = ( cfg, sql_key ) => new Promise ( resolve ) =>
  sql_path      = cfg.readsql[ sql_key ]
  batch_size    = 100
  count         = 0
  return resolve parse_sql = => new Promise ( resolve ) =>
    for statements from walk_batches ( walk_statements sql_path ), batch_size
      compound_statement  = statements.join ''
      count              += compound_statement.length
      # info '^4844^', '\n' + statements.join ''
    resolve count

#-----------------------------------------------------------------------------------------------------------
@_read_lines_nodb = ( cfg, sql_key ) => new Promise ( resolve ) =>
  sql_path      = cfg.readsql[ sql_key ]
  batch_size    = 3
  count         = 0
  return resolve parse_sql = => new Promise ( resolve ) =>
    for chunks from walk_batches ( walk_lines sql_path ), batch_size
      compound_chunk      = chunks.join ''
      count              += compound_chunk.length
      # info '^4844^', '\n' + statements.join ''
    resolve count

#-----------------------------------------------------------------------------------------------------------
@readsql_clipipe_small          = ( cfg ) => @_readsql_clipipe        cfg, 'small'
@readsql_clipipe_big            = ( cfg ) => @_readsql_clipipe        cfg, 'big'
@readsql_bsqlt3_small_promise   = ( cfg ) => @_readsql_bsqlt3         cfg, 'small',  'promise'
@readsql_bsqlt3_big_promise     = ( cfg ) => @_readsql_bsqlt3         cfg, 'big',    'promise'
@readsql_bsqlt3_small_sync      = ( cfg ) => @_readsql_bsqlt3         cfg, 'small',  'sync'
@readsql_bsqlt3_big_sync        = ( cfg ) => @_readsql_bsqlt3         cfg, 'big',    'sync'
@readsql_bsqlt3_small_callback  = ( cfg ) => @_readsql_bsqlt3         cfg, 'small',  'callback'
@readsql_bsqlt3_big_callback    = ( cfg ) => @_readsql_bsqlt3         cfg, 'big',    'callback'
#...........................................................................................................
@writesql_clipipe_small         = ( cfg ) => @_writesql_clipipe       cfg, 'small'
@writesql_clipipe_big           = ( cfg ) => @_writesql_clipipe       cfg, 'big'
#...........................................................................................................
@parse_sql_mysqlt_tiny          = ( cfg ) => @_parse_sql_stream_msqlt       cfg, 'tiny'
@parse_sql_mysqlt_small         = ( cfg ) => @_parse_sql_stream_msqlt       cfg, 'small'
@parse_sql_mysqlt_big           = ( cfg ) => @_parse_sql_stream_msqlt       cfg, 'big'
@parse_sql_mysqlt_nodb_tiny     = ( cfg ) => @_parse_sql_stream_msqlt_nodb  cfg, 'tiny'
@parse_sql_mysqlt_nodb_small    = ( cfg ) => @_parse_sql_stream_msqlt_nodb  cfg, 'small'
@parse_sql_mysqlt_nodb_big      = ( cfg ) => @_parse_sql_stream_msqlt_nodb  cfg, 'big'
@read_lines_nodb_tiny           = ( cfg ) => @_read_lines_nodb              cfg, 'tiny'
@read_lines_nodb_small          = ( cfg ) => @_read_lines_nodb              cfg, 'small'
@read_lines_nodb_big            = ( cfg ) => @_read_lines_nodb              cfg, 'big'

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
      tiny:   resolve_path 'assets/icql/tiny-datamill.sql'
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
    'readsql_bsqlt3_big_sync'
    # 'readsql_bsqlt3_big_promise'
    # 'readsql_bsqlt3_big_callback'
    # 'readsql_bsqlt3_small_promise'
    # 'readsql_bsqlt3_small_sync'
    # 'readsql_bsqlt3_small_callback'
    ]
  await run_phase test_names
  # #.........................................................................................................
  # test_names    = [
  #   'writesql_clipipe_small'
  #   'writesql_clipipe_big'
  #   ]
  # await run_phase test_names
  #.........................................................................................................
  test_names    = [
    # 'parse_sql_mysqlt_tiny'
    # 'parse_sql_mysqlt_small'
    'parse_sql_mysqlt_big'
    # 'parse_sql_mysqlt_nodb_tiny'
    # 'parse_sql_mysqlt_nodb_small'
    'parse_sql_mysqlt_nodb_big'
    # 'read_lines_nodb_tiny'
    # 'read_lines_nodb_small'
    'read_lines_nodb_big'
    ]
  await run_phase test_names
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


