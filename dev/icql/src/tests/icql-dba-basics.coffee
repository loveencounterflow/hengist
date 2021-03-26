

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: as_sql" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA           = require '../../../../apps/icql-dba'
  dba               = new ICQLDBA.Dba()
  probes_and_matchers = [
    [true,'1',]
    [false,'0',]
    [42,'42',]
    ['text',"'text'",]
    ["text with 'quotes'","'text with ''quotes'''",]
    [[1,2,3],"'[1,2,3]'",]
    [[],"'[]'",]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve dba.as_sql probe
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: interpolate" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA           = require '../../../../apps/icql-dba'
  dba               = new ICQLDBA.Dba()
  probes_and_matchers = [
    [["foo, $bar, baz",{bar:42,}],"foo, 42, baz"]
    [["select * from t where d = $d;",{bar:42,}],null,"unable to express 'undefined' as SQL literal"]
    [["select * from t where d = $d;",{d:true,}],"select * from t where d = 1;"]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ sql, Q, ] = probe
      resolve dba.interpolate sql, Q
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: toposort is removed" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA           = require '../../../../apps/icql-dba'
  dba               = new ICQLDBA.Dba()
  T.eq dba.get_toposort, undefined
  ### removed b/c stops working when tables refer to each other cyclical fashion:
  dba.execute "create table main.k1 ( id integer primary key, fk_k2 integer references k2 ( id ) );"
  dba.execute "create table main.k2 ( id integer primary key, fk_k1 integer references k1 ( id ) );"
  debug '^568^', dba.get_toposort()
  # => "Error: detected cycle involving node 'K1'"
  ###
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: clear()" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA           = require '../../../../apps/icql-dba'
  dba               = new ICQLDBA.Dba()
  #.........................................................................................................
  # Create tables, indexes:
  dba.execute "create table main.k1 ( id integer primary key, fk_k2 integer unique references k2 ( id ) );"
  dba.execute "create table main.k2 ( id integer primary key, fk_k1 integer unique references k1 ( id ) );"
  #.........................................................................................................
  for d from dba.walk_objects()
    info "^557-300^", { type: d.type, name: d.name, }
  #.........................................................................................................
  # Insert rows:
  T.eq dba.get_foreign_key_state(), true
  dba.set_foreign_key_state off
  T.eq dba.get_foreign_key_state(), false
  for id in [ 1 .. 9 ]
    dba.execute "insert into main.k1 values ( #{id}, #{id} );"
    dba.execute "insert into main.k2 values ( #{id}, #{id} );"
  dba.set_foreign_key_state on
  T.eq dba.get_foreign_key_state(), true
  #.........................................................................................................
  debug '^544734^', ( d.name for d from dba.walk_objects() )
  T.eq ( d.name for d from dba.walk_objects() ), [ 'sqlite_autoindex_k1_1', 'sqlite_autoindex_k2_1', 'k1', 'k2' ]
  T.eq ( dba.list dba.query "select * from k1 join k2 on ( k1.fk_k2 = k2.id );" ), [
    { id: 1, fk_k2: 1, fk_k1: 1 },
    { id: 2, fk_k2: 2, fk_k1: 2 },
    { id: 3, fk_k2: 3, fk_k1: 3 },
    { id: 4, fk_k2: 4, fk_k1: 4 },
    { id: 5, fk_k2: 5, fk_k1: 5 },
    { id: 6, fk_k2: 6, fk_k1: 6 },
    { id: 7, fk_k2: 7, fk_k1: 7 },
    { id: 8, fk_k2: 8, fk_k1: 8 },
    { id: 9, fk_k2: 9, fk_k1: 9 } ]
  #.........................................................................................................
  dba.clear()
  T.eq ( d.name for d from dba.walk_objects() ), []
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: open from DB file" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA               = require '../../../../apps/icql-dba'
  cfg                   = H.get_cfg()
  cfg.size              = 'small'
  cfg.mode              = 'fle'
  cfg.ref               = 'dba-open-from-file'
  cfg.pragmas           = 'fle'
  cfg.db_template_path  = H.interpolate cfg.db.templates[  cfg.size ], cfg
  cfg.db_work_path      = H.interpolate cfg.db.work[       cfg.mode ], cfg
  path                  = cfg.db_work_path
  help "^77-300^ cfg.db_template_path:  ", cfg.db_template_path
  help "^77-300^ cfg.db_work_path:      ", cfg.db_work_path
  await H.copy_over cfg.db_template_path, cfg.db_work_path
  dba                   = new ICQLDBA.Dba { path, }
  #.........................................................................................................
  T.eq ( type_of ( s = dba.walk_objects() ) ), 'statementiterator'
  ignore            = [ s..., ]
  objects           = ( "#{d.type}:#{d.name}" for d from dba.walk_objects { schema: 'main', } )
  T.eq objects, [
    'index:sqlite_autoindex_keys_1',
    'index:sqlite_autoindex_realms_1',
    'index:sqlite_autoindex_sources_1',
    'table:keys',
    'table:main',
    'table:realms',
    'table:sources',
    'view:dest_changes_backward',
    'view:dest_changes_forward' ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "_DBA: copy file DB to memory" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA               = require '../../../../apps/icql-dba'
  cfg                   = H.get_cfg()
  cfg.size              = 'small'
  cfg.mode              = 'fle'
  cfg.ref               = 'dba-open-from-file'
  cfg.pragmas           = 'fle'
  cfg.db_template_path  = H.interpolate cfg.db.templates[  cfg.size ], cfg
  cfg.db_work_path      = H.interpolate cfg.db.work[       cfg.mode ], cfg
  path                  = cfg.db_work_path
  await H.copy_over cfg.db_template_path, cfg.db_work_path
  cfg.mem_schema        = 'x'
  info JSON.stringify cfg, null, '  '
  dba                   = new ICQLDBA.Dba { path, echo: true, debug: true, }
  #.........................................................................................................
  debug '^300^', cfg
  debug '^301^', dba.get_schemas()
  dba.attach { path: ':memory:', schema: cfg.mem_schema, }
  debug '^302^', dba.get_schemas()
  for d from dba.walk_objects()
    debug '^303^', "#{d.type}:#{d.name}"
  dba.copy_schema { to_schema: cfg.mem_schema, }
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
show_schemas_and_objects = ( ref, dba ) ->
  for schema of dba.get_schemas()
    urge "#{ref} schema: #{schema}"
    count = 0
    for d from dba.walk_objects { schema, }
      count++
      info "#{ref}    #{schema}/#{d.type}:#{d.name}"
    if count is 0
      whisper "#{ref}    (empty)"
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: copy file DB to memory" ] = ( T, done ) ->
  T.halt_on_error()
  ICQLDBA               = require '../../../../apps/icql-dba'
  #.........................................................................................................
  cfg                   =
    pragmas: [
      'page_size = 4096'
      'cache_size = 16384'
      'temp_store = MEMORY'
      'journal_mode = WAL'
      'locking_mode = EXCLUSIVE'
      'synchronous = OFF' ]
    template_path:    H.resolve_path 'assets/icql/small-datamill.db'
    work_path:        H.resolve_path 'data/icql/icql-dba-copy-schema.db'
    # mem_schema:       'x'
    # mem_path:         ':memory:'
    # { schema: 'main', path: ( H.resolve_path 'data/icql/icql-dba-copy-schema.db' ), }
    # { schema: 'q',    path: ':memory:', }
    schemas:
      main:   ( H.resolve_path 'data/icql/icql-dba-copy-schema.db' )
      q:      ':memory:'
  #.........................................................................................................
  help '^3387^', "cfg.template_path: ", cfg.template_path
  help '^3387^', "cfg.work_path:     ", cfg.work_path
  await H.copy_over cfg.template_path, cfg.work_path
  #.........................................................................................................
  dba_cfg               = { path: cfg.mem_path, }
  # dba_cfg               = { path: cfg.work_path, echo: true, debug: true, }
  dba                   = new ICQLDBA.Dba dba_cfg
  #.........................................................................................................
  dba.attach { path: cfg.work_path, schema: cfg.mem_schema, }
  show_schemas_and_objects '^754-2^', dba
  dba.copy_schema { from_schema: cfg.mem_schema, to_schema: 'main', }
  show_schemas_and_objects '^754-3^', dba
  #.........................................................................................................
  to_schema_objects     = dba.list dba.walk_objects { schema: cfg.mem_schema, }
  schema_x              = dba.as_identifier cfg.mem_schema
  result                = {}
  for d in to_schema_objects
    obj_name_x            = dba.as_identifier d.name
    switch d.type
      when 'index'
        result[ d.name ] = 'index'
      when 'table', 'view'
        sql                   = "select count(*) from #{schema_x}.#{obj_name_x};"
        count                 = dba.single_value dba.query sql
        debug d.name, count
        result[ d.name ] = "#{d.type}|#{count}"
      else throw new Error "^45687^ unknown DB object type #{rpr d.type}"
  debug '^448978^', result
  T.eq result, {
    sqlite_autoindex_keys_1:    'index'
    sqlite_autoindex_realms_1:  'index'
    sqlite_autoindex_sources_1: 'index'
    keys:                       'table|15'
    main:                       'table|327'
    realms:                     'table|2'
    sources:                    'table|1'
    dest_changes_backward:      'view|320'
    dest_changes_forward:       'view|320' }
  #.........................................................................................................
  done()



############################################################################################################
unless module.parent?
  test @
  # test @[ "DBA: copy file DB to memory" ]
  # test @[ "DBA: as_sql" ]
  # test @[ "DBA: interpolate" ]
  # test @[ "DBA: clear()" ]
  # test @[ "toposort with schema" ]
  # @[ "toposort with schema" ]()


