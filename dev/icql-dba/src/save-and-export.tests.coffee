

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
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
{ to_width }              = require 'to-width'


#-----------------------------------------------------------------------------------------------------------
@[ "DBA: save()" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  #.........................................................................................................
  cfg               = H.get_cfg()
  cfg.ref           = 'save-export'
  #.........................................................................................................
  cfg.size          = 'small'
  cfg.mode          = 'fle'
  template_path_1   = H.interpolate cfg.db.templates[ cfg.size ], cfg
  work_path_1       = H.interpolate cfg.db.work[      cfg.mode ], cfg
  help "^77-300^ work_path_1:  ", work_path_1
  #.........................................................................................................
  cfg.size          = 'big'
  cfg.mode          = 'fle'
  template_path_2   = H.interpolate cfg.db.templates[ cfg.size ], cfg
  work_path_2       = H.interpolate cfg.db.work[      cfg.mode ], cfg
  help "^77-300^ work_path_2:  ", work_path_2
  #.........................................................................................................
  cfg.size          = 'new'
  cfg.mode          = 'fle'
  work_path_3       = H.interpolate cfg.db.work[      cfg.mode ], cfg
  help "^77-300^ work_path_3:  ", work_path_3
  #.........................................................................................................
  await do =>
    path    = work_path_1
    schema  = 's1'
    await H.copy_over template_path_1, path
    dba     = new Dba()
    dba.open { path, schema, }
    debug '^74487^', { template_path_1, }
    debug '^74487^', { path, }
    debug '^74487^', dba.sqlt

  #   T.eq dba.get_schemas(), { main: '', s1: path, }
  #   T.eq ( dba.is_empty { schema: 'main', } ), true
  #   T.eq ( dba.is_empty { schema: 's1', } ), false
  #   T.eq ( d.name for d from dba.walk_objects { schema, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
  # #.........................................................................................................
  # await do =>
  #   path    = work_path_1
  #   schema  = 'foo'
  #   await H.copy_over template_path_1, path
  #   dba     = new Dba()
  #   dba.open { path, schema, }
  #   help '^298789^', dba.get_schemas()
  #   T.eq dba.get_schemas(), { main: '', [schema]: path, }
  #   T.eq dba.is_empty { schema: 'main', }, true
  #   T.eq dba.is_empty { schema, }, false
  #   T.eq ( d.name for d from dba.walk_objects { schema, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
  # #.........................................................................................................
  # await do =>
  #   schema_1  = 'datamill'
  #   schema_2  = 'chinook'
  #   await H.copy_over template_path_1, work_path_1
  #   await H.copy_over template_path_2, work_path_2
  #   dba       = new Dba { path: work_path_1, schema: schema_1, }
  #   debug '^567^', dba
  #   debug '^567^', ( k for k of dba )
  #   debug '^567^', dba.open { path: work_path_2, schema: schema_2, }
  #   help '^58733^', dba.get_schemas()
  #   # T.eq dba.get_schemas(), { main: '', [schema]: path, }
  #   T.eq dba.is_empty { schema: 'main', }, true
  #   T.eq dba.is_empty { schema: schema_1, }, false
  #   T.eq dba.is_empty { schema: schema_2, }, false
  #   T.eq ( d.name for d from dba.walk_objects { schema: schema_1, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
  # #.........................................................................................................
  # await do =>
  #   ### use `Dba.open()` without arguments, get empty RAM DB in schema `main` ###
  #   schema_1  = 'datamill'
  #   schema_2  = 'chinook'
  #   schema_3  = 'new'
  #   await H.copy_over template_path_1, work_path_1
  #   await H.copy_over template_path_2, work_path_2
  #   await H.try_to_remove_file work_path_3
  #   dba       = new Dba()
  #   dba.open { path: work_path_1, schema: schema_1, }
  #   dba.open { path: work_path_2, schema: schema_2, }
  #   dba.open { path: work_path_3, schema: schema_3, }
  #   help '^58733^', dba.get_schemas()
  #   # T.eq dba.get_schemas(), { main: '', [schema]: path, }
  #   T.eq dba.is_empty { schema: 'main', }, true
  #   T.eq dba.is_empty { schema: schema_1, }, false
  #   T.eq dba.is_empty { schema: schema_2, }, false
  #   T.eq ( d.name for d from dba.walk_objects { schema: schema_1, } ), [ 'sqlite_autoindex_keys_1', 'sqlite_autoindex_realms_1', 'sqlite_autoindex_sources_1', 'keys', 'main', 'realms', 'sources', 'dest_changes_backward', 'dest_changes_forward' ]
  #   dba.execute "create table new.t ( id integer );"
  #   dba.execute "insert into new.t values ( #{n} );" for n in [ 1 .. 9 ]
  #   T.eq ( dba.list dba.first_values dba.query "select * from new.t;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  # #.........................................................................................................
  # await do =>
  #   ### test whether data from previous test was persisted ###
  #   schema_3  = 'new'
  #   dba       = new Dba()
  #   dba.open { path: work_path_3, schema: schema_3, }
  #   T.eq ( dba.list dba.first_values dba.query "select * from new.t;" ), [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  # #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "dba has associated property path" ] = ( T, done ) ->
  T.halt_on_error()
  trash             = require 'trash'
  TMP               = require 'tempy'
  { Dba }           = require '../../../apps/icql-dba'
  #.........................................................................................................
  help "#1"
  await do =>
    try
      path = TMP.file { extension: 'db', }
      help "^4758^ opening DB at #{rpr path}"
      dba   = new Dba { path, }
      debug '^868943^', dba
      T.eq dba._schemas.main.path, path
    finally
      warn "removing #{path}"
      await trash path ### NOTE `trash` command is async, consider to `await` ###
      warn "... done removing #{path}"
    return null
  #.........................................................................................................
  help "#2"
  await do =>
    path  = ''
    dba   = new Dba { path, }
    debug '^868943^', dba
    T.eq dba._schemas.main.path, path
    return null
  #.........................................................................................................
  help "#3"
  await do =>
    cfg               = H.get_cfg()
    cfg.ref           = 'save-export'
    cfg.size          = 'small'
    cfg.mode          = 'fle'
    template_path_1   = H.interpolate cfg.db.templates[ cfg.size ], cfg
    work_path_1       = H.interpolate cfg.db.work[      cfg.mode ], cfg
    await H.copy_over template_path_1, work_path_1
    # debug '^868943^', cfg
    path  = ':memory:'
    dba   = new Dba { path, }
    dba.open { path: work_path_1, schema: 'datamill', }
    debug '^868943^', dba._schemas
    T.eq dba._schemas.main.path, path
    return null
  #.........................................................................................................
  done()


############################################################################################################
unless module.parent?
  # test @
  # test @[ "DBA: save()" ]
  test @[ "dba has associated property path" ]




