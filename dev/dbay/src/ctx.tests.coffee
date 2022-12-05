
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/CTX'
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
# types                     = new ( require 'intertype' ).Intertype
# { isa
#   type_of
#   validate
#   validate_list_of }      = types.export()
SQL                       = String.raw

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/CTX with_transaction() 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  do =>
    db = new DBay()
    T?.throws /expected between 1 and 2 arguments, got 0/, -> db.with_transaction()
  #.........................................................................................................
  do =>
    db   = new DBay()
    # db.open { schema: 'main', }
    create_table = ( cfg ) ->
      debug '^435^', { cfg, }
      db.with_transaction ->
        help '^70^', "creating a table with", cfg
        db.execute SQL"create table foo ( bar integer );"
        throw new Error "oops" if cfg.throw_error
    #.......................................................................................................
    error = null
    try create_table { throw_error: true, } catch error
      T?.ok error.message is "oops"
      T?.eq ( db.all_rows "select * from sqlite_schema;" ), []
    T.fail "expected error but none was thrown" unless error?
    #.......................................................................................................
    create_table { throw_error: false, }
    T?.eq ( db.all_first_values "select name from sqlite_schema;" ), [ 'foo', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/CTX with_transaction() 2" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  do =>
    db = new DBay()
    T?.throws /expected between 1 and 2 arguments, got 0/, -> db.with_transaction()
  #.........................................................................................................
  do =>
    error = null
    db   = new DBay()
    try
      db.with_transaction ->
        help '^70^', "creating a table"
        db.execute SQL"create table foo ( bar integer );"
        throw new Error "oops"
    catch error
      warn error.message
      T?.ok error.message is "oops"
    T.fail "expected error but none was thrown" unless error?
    T?.eq ( db.all_rows "select * from sqlite_schema;" ), []
    #.......................................................................................................
    db.with_transaction ->
      help '^70^', "creating a table"
      db.execute SQL"create table foo ( bar integer );"
    #.......................................................................................................
    T?.eq ( db.all_first_values SQL"select name from sqlite_schema;" ), [ 'foo', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/CTX with_unsafe_mode()" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  do =>
    db = new DBay()
    T?.throws /not a valid function/, -> db.with_unsafe_mode()
  #.........................................................................................................
  do =>
    error = null
    db   = new DBay()
    # db.open { schema: 'main', }
    db.execute SQL"create table foo ( n integer, is_new boolean default false );"
    for n in [ 10 .. 19 ]
      db SQL"insert into foo ( n ) values ( $n );", { n, }
    db.with_unsafe_mode ->
      for row from db.query SQL"select * from foo where not is_new;"
        db SQL"insert into foo ( n, is_new ) values ( $n, $is_new );", { n: row.n * 3, is_new: 1, }
      db.execute SQL"update foo set is_new = false where is_new;"
    #.......................................................................................................
    console.table rows = db.all_rows SQL"select * from foo order by n;"
    result = ( d.n for d in rows )
    T?.eq result, [ 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57 ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/CTX with_foreign_keys_deferred(), preliminaries" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  list_table_a      = ( db ) -> ( row.n for row from db.query SQL"select n from a;" )
  list_table_b      = ( db ) -> ( row.n for row from db.query SQL"select n from b;" )
  #---------------------------------------------------------------------------------------------------------
  do =>
    urge '^50-1^', "begin transaction, then defer fks"
    db                = new DBay()
    { sqlt1, }        = db
    db.execute SQL"""
      create table a ( n integer not null primary key references b ( n ) );
      create table b ( n integer not null primary key references a ( n ) );
      """
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-2^', sqlt1.inTransaction;                     T?.eq sqlt1.inTransaction, false
    info '^50-3^', db.get_foreign_keys_state();             T?.eq db.get_foreign_keys_state(), true
    info '^50-4^', sqlt1.pragma SQL"defer_foreign_keys;";   T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
    #.......................................................................................................
    ### begin transaction, then  start deferred fks ###
    debug '^50-5^'; db.execute SQL"begin transaction;"
    debug '^50-6^'; sqlt1.pragma SQL"defer_foreign_keys=1;"
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-7^', sqlt1.inTransaction;                     T?.eq sqlt1.inTransaction, true
    info '^50-8^', db.get_foreign_keys_state();             T?.eq db.get_foreign_keys_state(), true
    info '^50-9^', sqlt1.pragma SQL"defer_foreign_keys;";   T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 1 } ]
    #.......................................................................................................
    ### insert partly bogus values, check ###
    debug '^50-10^'; db.execute SQL"insert into a ( n ) values ( 1 );"
    debug '^50-11^'; db.execute SQL"insert into b ( n ) values ( 1 );"
    debug '^50-12^'; db.execute SQL"insert into a ( n ) values ( 2 );"
    # debug '^50-13^'; db.execute SQL"insert into b ( n ) values ( 2 );"
    error = null
    debug '^50-14^', list_table_a db; T?.eq ( list_table_a db ), [ 1, 2, ]
    debug '^50-15^', list_table_b db; T?.eq ( list_table_b db ), [ 1, ]
    #.......................................................................................................
    ### try to commit, rollback on error ###
    try
      debug '^50-16^'; db.execute SQL"commit;"
    catch error
      debug '^50-17^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, true
      warn error.message
      T?.eq error.message, "FOREIGN KEY constraint failed"
      debug '^50-18^'; db.execute SQL"rollback;"
      debug '^50-19^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, false
    finally
      debug '^50-20^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, false
    #.......................................................................................................
    ### Ensure error happened, tables empty as before ###
    T.fail '^50-21^', "expected error, got none" unless error?
    debug '^50-22^', list_table_a db; T?.eq ( list_table_a db ), []
    debug '^50-23^', list_table_b db; T?.eq ( list_table_b db ), []
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-24^', sqlt1.inTransaction;                    T?.eq sqlt1.inTransaction, false
    info '^50-25^', db.get_foreign_keys_state();            T?.eq db.get_foreign_keys_state(), true
    info '^50-26^', sqlt1.pragma SQL"defer_foreign_keys;";  T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
  #---------------------------------------------------------------------------------------------------------
  do =>
    urge '^50-27^', "defer fks, then begin transaction"
    db                = new DBay()
    { sqlt1, }         = db
    db.execute SQL"""
      create table a ( n integer not null primary key references b ( n ) );
      create table b ( n integer not null primary key references a ( n ) );
      """
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-28^', sqlt1.inTransaction;                    T?.eq sqlt1.inTransaction, false
    info '^50-29^', db.get_foreign_keys_state();            T?.eq db.get_foreign_keys_state(), true
    info '^50-30^', sqlt1.pragma SQL"defer_foreign_keys;";  T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
    #.......................................................................................................
    ### begin transaction, then  start deferred fks ###
    debug '^50-31^'; sqlt1.pragma SQL"defer_foreign_keys=1;"
    debug '^50-32^'; db.execute SQL"begin transaction;"
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-33^', sqlt1.inTransaction;                    T?.eq sqlt1.inTransaction, true
    info '^50-34^', db.get_foreign_keys_state();            T?.eq db.get_foreign_keys_state(), true
    info '^50-35^', sqlt1.pragma SQL"defer_foreign_keys;";  T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 1 } ]
    #.......................................................................................................
    ### insert partly bogus values, check ###
    debug '^50-36^'; db.execute SQL"insert into a ( n ) values ( 1 );"
    debug '^50-37^'; db.execute SQL"insert into b ( n ) values ( 1 );"
    debug '^50-38^'; db.execute SQL"insert into a ( n ) values ( 2 );"
    # debug '^50-39^'; db.execute SQL"insert into b ( n ) values ( 2 );"
    error = null
    debug '^50-40^', list_table_a db; T?.eq ( list_table_a db ), [ 1, 2, ]
    debug '^50-41^', list_table_b db; T?.eq ( list_table_b db ), [ 1, ]
    #.......................................................................................................
    ### try to commit, rollback on error ###
    try
      debug '^50-42^'; db.execute SQL"commit;"
    catch error
      debug '^50-43^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, true
      warn error.message
      T?.eq error.message, "FOREIGN KEY constraint failed"
      debug '^50-44^'; db.execute SQL"rollback;"
      debug '^50-45^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, false
      # throw error ### in production, re-throw error after rollback ###
    finally
      debug '^50-46^', sqlt1.inTransaction; T?.eq sqlt1.inTransaction, false
    #.......................................................................................................
    ### Ensure error happened, tables empty as before ###
    T.fail '^50-47^', "expected error, got none" unless error?
    debug '^50-48^', list_table_a db; T?.eq ( list_table_a db ), []
    debug '^50-49^', list_table_b db; T?.eq ( list_table_b db ), []
    #.......................................................................................................
    ### ensure DB transaction, fk state ###
    info '^50-50^', sqlt1.inTransaction;                    T?.eq sqlt1.inTransaction, false
    info '^50-51^', db.get_foreign_keys_state();            T?.eq db.get_foreign_keys_state(), true
    info '^50-52^', sqlt1.pragma SQL"defer_foreign_keys;";  T?.eq ( sqlt1.pragma SQL"defer_foreign_keys;" ), [ { defer_foreign_keys: 0 } ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY/CTX with_foreign_keys_deferred(), ensure checks" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  list_table_a      = ( db ) -> ( row.n for row from db.query SQL"select n from a;" )
  #.........................................................................................................
  error             = null
  db                = new DBay()
  # db.open { schema: 'main', }
  db.execute SQL"""
    create table a ( n integer not null primary key references b ( n ) );
    create table b ( n integer not null primary key references a ( n ) );
    """
  #.........................................................................................................
  T?.eq db.within_transaction(), false
  T?.eq db.get_foreign_keys_state(), true
  db.with_foreign_keys_deferred ->
    T?.eq db.within_transaction(), true
    T?.eq db.get_foreign_keys_state(), true
    db.execute SQL"insert into a ( n ) values ( 1 );"
    db.execute SQL"insert into a ( n ) values ( 2 );"
    db.execute SQL"insert into a ( n ) values ( 3 );"
    db.execute SQL"insert into b ( n ) values ( 1 );"
    db.execute SQL"insert into b ( n ) values ( 2 );"
    db.execute SQL"insert into b ( n ) values ( 3 );"
    # db.execute SQL"insert into a ( n ) values ( 4 );"
    console.table db.all_rows SQL"select * from a;"
    console.table db.all_rows SQL"select * from b;"
  T?.eq db.within_transaction(), false
  #.........................................................................................................
  T?.eq db.get_foreign_keys_state(), true
  T?.eq ( db.pragma SQL"foreign_key_check;" ), []
  T?.eq ( db.pragma SQL"integrity_check;"   ), [ { integrity_check: 'ok' } ]
  #.........................................................................................................
  debug '^778-1^', ( prv_values = list_table_a db )
  T?.eq ( nxt_values = list_table_a db ), prv_values; prv_values = nxt_values
  debug '^778-2^'
  T?.eq db.within_transaction(), false
  try
    db.with_foreign_keys_deferred ->
      T?.eq db.within_transaction(), true
      db.execute SQL"insert into a ( n ) values ( 101 );"
  catch error
    warn error.message
    T?.eq error.message, "FOREIGN KEY constraint failed"
  T?.eq db.within_transaction(), false
  debug '^778-4^', list_table_a db
  T?.eq ( nxt_values = list_table_a db ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  debug '^778-5^'
  try
    db.with_transaction ->
      db.with_foreign_keys_deferred ->
        db.execute SQL"insert into a ( n ) values ( 102 );"
  catch error
    warn error.message
    T?.eq error.message, '^dbay/ctx@6^ (DBay_no_deferred_fks_in_tx) cannot defer foreign keys inside a transaction'
  debug '^778-6^', list_table_a db
  T?.eq ( nxt_values = list_table_a db ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  debug '^778-7^'
  try
    db.with_foreign_keys_deferred ->
      db.with_transaction ->
        db.execute SQL"insert into a ( n ) values ( 103 );"
  catch error
    warn error.message
    T?.eq error.message, '^dbay/ctx@5^ (DBay_no_nested_transactions) cannot start a transaction within a transaction'
  debug '^778-8^', list_table_a db
  T?.eq ( nxt_values = list_table_a db ), prv_values; prv_values = nxt_values
  #.........................................................................................................
  T?.eq ( db.pragma SQL"foreign_key_check;" ), []
  T?.eq ( db.pragma SQL"integrity_check;"   ), [ { integrity_check: 'ok' } ]
  #.........................................................................................................
  console.table rows = db.all_rows SQL"""
    select
        a.n as a_n,
        b.n as b_n
      from a
      left join b using ( n )
      order by n;"""
  debug '^400^', rows
  result = ( [ d.a_n, d.b_n ] for d in rows )
  T?.eq result, [ [ 1, 1 ], [ 2, 2 ], [ 3, 3 ] ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@dbay_ctx_journal_mode = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  do ->
    journal_mode  = 'delete'
    db            = new DBay()
    db.set_journal_mode journal_mode
    T?.eq db.get_journal_mode(), journal_mode
  #.........................................................................................................
  do ->
    journal_mode  = 'wal'
    db            = new DBay()
    db.set_journal_mode journal_mode
    T?.eq db.get_journal_mode(), journal_mode
  #.........................................................................................................
  do ->
    journal_mode  = null
    db            = new DBay { journal_mode, }
    T?.eq db.get_journal_mode(), 'wal'
  #.........................................................................................................
  do ->
    journal_mode  = 'wal'
    db            = new DBay { journal_mode, }
    T?.eq db.get_journal_mode(), journal_mode
  #.........................................................................................................
  do ->
    journal_mode  = null
    db            = new DBay { journal_mode, }
    T?.eq db.get_journal_mode(), 'wal'
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  # test @, { timeout: 10e3, }
  # test @[ "DBAY/CTX with_transaction() 1" ]
  # test @[ "DBAY/CTX with_transaction() 2" ]
  # test @[ "DBAY/CTX with_unsafe_mode()" ]
  # test @[ "DBAY/CTX with_foreign_keys_deferred(), preliminaries" ]
  # test @[ "DBAY/CTX with_foreign_keys_deferred(), ensure checks" ]
  # @[ "DBAY/CTX with_foreign_keys_deferred(), ensure checks" ]()
  @dbay_ctx_journal_mode()
  test @dbay_ctx_journal_mode



