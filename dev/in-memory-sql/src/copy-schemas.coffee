

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

#-----------------------------------------------------------------------------------------------------------
@_btsql3 = ( cfg ) -> new Promise ( resolve ) =>
  # data          = @get_data cfg
  count             = 0
  Db                = require 'better-sqlite3'
  defaults          = { pragmas: [], size: 'small', }
  cfg               = { defaults..., cfg..., }
  db_work_path      = cfg.db.work[ cfg.mode ].replaceAll '${0}', cfg.ref
  validate.nonempty_text cfg.ref
  db_template_path  = cfg.db.templates[ cfg.size ].replaceAll '${0}', cfg.ref
  db_target_path    = cfg.db.target[      cfg.size ].replaceAll '${0}', cfg.ref
  validate.nonempty_text db_template_path
  validate.nonempty_text db_target_path
  db_cfg            = null
  if gcfg.verbose
    help "^44433^ template  DB:", db_template_path
    help "^44433^ work      DB:", db_work_path
    help "^44433^ target    DB:", db_target_path
  try_to_remove_file db_target_path
  await FSP.copyFile db_template_path, db_target_path
  #.........................................................................................................
  resolve => new Promise ( resolve ) => # ^777854^
    _icql             = { ( require '../../../apps/icql' )._local_methods..., }
    #=======================================================================================================
    db              = new Db db_target_path, db_cfg
    _icql.settings  = { echo: gcfg.echo ? false, verbose: gcfg.verbose ? false, }
    _icql.db        = db
    fle_schema      = 'main'
    work_schema     = 'x'
    _icql.attach db_work_path, work_schema
    try
      _icql.copy_schema fle_schema, work_schema
    catch error
      throw error unless error.code is 'SQLITE_ERROR'
      warn '^68683^', CND.reverse error.message
    info '^338373^', { size: cfg.size, db_template_path, db_target_path, }
    _icql.close()
    return resolve 1
    # resolve count
  return null

#-----------------------------------------------------------------------------------------------------------
@btsql3_mem_small          = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'mem', size: 'small', }
@btsql3_mem_big            = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'mem', size: 'big',   }
@btsql3_fle_small          = ( cfg ) => @_btsql3 { cfg..., ref: 'small', mode: 'fle', size: 'small', }
@btsql3_fle_big            = ( cfg ) => @_btsql3 { cfg..., ref: 'big',   mode: 'fle', size: 'big',   }
# @btsql3_mem_thrds    = ( cfg ) => @_btsql3 { cfg..., db_path: ':memory:', pragmas: [ 'threads = 4;', ] }

#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  gcfg.verbose  = true
  gcfg.verbose  = false
  bench         = BM.new_benchmarks()
  cfg           =
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
  repetitions   = 1
  test_names    = [
    'btsql3_mem_big'
    'btsql3_mem_small'
    'btsql3_fle_big'
    'btsql3_fle_small'
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
