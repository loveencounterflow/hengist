

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
  ICQLDBA           = require '../../../../apps/icql/dba'
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
  ICQLDBA           = require '../../../../apps/icql/dba'
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
  ICQLDBA           = require '../../../../apps/icql/dba'
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
  ICQLDBA           = require '../../../../apps/icql/dba'
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
  ICQLDBA           = require '../../../../apps/icql/dba'
  test_cfg          = H.get_cfg()
  test_cfg.size     = 'small'
  test_cfg.mode     = 'fle'
  test_cfg.ref      = 'dba-open-from-file'
  test_cfg.pragmas  = 'fle'
  db_template_path  = H.interpolate test_cfg.db.templates[  test_cfg.size ], test_cfg
  db_work_path      = H.interpolate test_cfg.db.work[       test_cfg.mode ], test_cfg
  path              = db_work_path
  help "^77-300^ db_template_path:  ", db_template_path
  help "^77-300^ db_work_path:      ", db_work_path
  await H.copy_over db_template_path, db_work_path
  dba               = new ICQLDBA.Dba { path, }
  #.........................................................................................................
  T.eq ( type_of ( s = dba.walk_objects() ) ), 'statementiterator'
  ignore            = [ s..., ]
  debug ignore
  objects           = ( "#{d.type}:#{d.name}" for d from dba.walk_objects { schema: 'main', } )
  T.eq objects, [ 'index:sqlite_autoindex_keys_1', 'index:sqlite_autoindex_realms_1', 'index:sqlite_autoindex_sources_1', 'table:keys', 'table:main', 'table:realms', 'table:sources', 'view:dest_changes_backward', 'view:dest_changes_forward' ]
  #.........................................................................................................
  done()



############################################################################################################
unless module.parent?
  test @
  # test @[ "DBA: as_sql" ]
  # test @[ "DBA: interpolate" ]
  # test @[ "DBA: clear()" ]
  # test @[ "toposort with schema" ]
  # @[ "toposort with schema" ]()


