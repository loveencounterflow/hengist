
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/CONSTRUCTION'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
demo_udf_dbay_sqlt = ->
  { Dbay }  = require H.dbay_path
  class Dbayx extends Dbay
    @_rnd_int_cfg: true
  db        = new Dbayx()
  #.........................................................................................................
  ### Create table on first connection, can insert data on second connection: ###
  db.sqlt1.exec SQL"create table x ( n text );"
  db.sqlt2.exec SQL"insert into x ( n ) values ( 'helo world' );"
  db.sqlt2.exec SQL"insert into x ( n ) values ( 'good to see' );"
  db.sqlt2.exec SQL"insert into x ( n ) values ( 'it does work' );"
  #.........................................................................................................
  do =>
    ### Sanity check that data was persisted: ###
    select = db.sqlt2.prepare SQL"select * from x;", {}, false
    select.run()
    info '^309-1^', row for row from select.iterate()
    return null
  #.........................................................................................................
  do =>
    ### Sanity check that UDF does work (on the same connection): ###
    db.sqlt1.function 'std_square', { varargs: false, }, ( n ) -> n ** 2
    # select  = db.sqlt1.prepare SQL"select sqrt( 42 ) as n;"
    select  = db.sqlt1.prepare SQL"select std_square( 42 ) as n;"
    select.run()
    info '^309-2^', row for row from select.iterate()
    return null
  #.........................................................................................................
  do =>
    ### Run query (on 1st connection) that calls UDF running another query (on the 2nd connection): ###
    db.sqlt1.function 'std_row_count', { varargs: false, deterministic: false, }, ->
      statement = db.sqlt2.prepare SQL"select count(*) as count from x;", {}, false
      statement.run()
      rows      = [ statement.iterate()..., ]
      return rows[ 0 ]?.count ? null
    select  = db.sqlt1.prepare SQL"select std_row_count() as n;"
    select.run()
    info '^309-3^', row for row from select.iterate()
    return null
  #.........................................................................................................
  do =>
    db.sqlt1.unsafeMode true
    db.sqlt2.unsafeMode true
    db.sqlt1.exec SQL"begin deferred transaction;"
    db.sqlt2.exec SQL"begin deferred transaction;"
    db.sqlt1.exec SQL"pragma main.journal_mode=WAL;"
    db.sqlt2.exec SQL"pragma main.journal_mode=WAL;"
    #.......................................................................................................
    db.sqlt1.table 'std_generate_series',
      columns:        [ 'n', ]
      deterministic:  false
      varargs:        false
      rows: ->
        yield { n, } for n in [ 1 .. 3 ]
        return null
    #.......................................................................................................
    debug '^309-4^'
    xxx_statement = db.sqlt2.prepare SQL"select n from x;"
    db.sqlt1.table 'std_some_texts',
      columns:        [ 'n', ]
      deterministic:  false
      varargs:        false
      rows: ->
        debug '^309-5^'
        xxx_statement.run()
        debug '^309-6^'
        # yield from xxx_statement.iterate()
        for row from xxx_statement.iterate()
          debug '^309-7^', row
          yield row
        return null
    #.......................................................................................................
    ### not possible to attach the same DB more than once: ###
    # debug '^309-8^', db.sqlt1.name
    # debug '^309-9^', ( db.sqlt1.prepare SQL"attach ? as s1b;" ).run [ db.sqlt1.name, ]
    #.......................................................................................................
    # select  = db.sqlt1.prepare SQL"select * from std_generate_series();"
    # select2 = db.sqlt1.prepare SQL"select * from std_generate_series();"
    select  = db.sqlt1.prepare SQL"select * from std_some_texts();"
    select.run()
    # for row from select.iterate()
    #   select2.run()
    #   info '^309-10^', row, [ ( select2.iterate() )..., ]
    for row from select.iterate()
      info '^309-11^', row
    db.sqlt1.unsafeMode false
    db.sqlt2.unsafeMode false
    return null
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_worker_threads = ->
  #.........................................................................................................
  create_and_populate_tables = ( db ) ->
    ### Create table on first connection, can insert data on second connection unless when within
    transaction: ###
    debug '^339^', db.sqlt1
    debug '^339^', db.sqlt2
    sqlt_a = db.sqlt1
    sqlt_b = if sqlt_a.inTransaction then sqlt_a else db.sqlt2
    sqlt_a.exec SQL"create table x ( n text );"
    sqlt_b.exec SQL"insert into x ( n ) values ( 'helo world' );"
    sqlt_b.exec SQL"insert into x ( n ) values ( 'good to see' );"
    sqlt_b.exec SQL"insert into x ( n ) values ( 'it does work' );"
    urge '^309-12^', "created and populated table `x`"
    return null
  #.........................................................................................................
  add_table_function = ( db ) ->
    db.sqlt1.table 'my_table_udf',
      deterministic:  false
      varargs:        false
      columns:        [ 'n', ]
      rows:           ->
        # statement = db.sqlt2.prepare SQL"select * from x;"
        # yield from statement.iterate()
        for n in [ 1, 2, 3, ]
          await sleep 0.25
          yield { n, }
        return null
  #.........................................................................................................
  show_sqlite_schema = ( db ) =>
    info '^309-13^', "sqlite_schema"
    select  = db.sqlt1.prepare SQL"select * from sqlite_schema;"
    select.run()
    info '^309-14^', row for row from select.iterate()
    return null
  #.........................................................................................................
  show_table_contents = ( title, db ) =>
    try
      select  = db.sqlt1.prepare SQL"select * from x;"
      select.run()
      urge '^309-15^', title
      info '^309-16^', row for row from select.iterate()
    catch error
      warn CND.reverse error.message
    return null
  #.........................................................................................................
  { Worker
    parentPort
    isMainThread  } = require 'worker_threads'
  { Dbay }          = require H.dbay_path
  dbnick            = 'mydb'
  #.........................................................................................................
  if isMainThread
    do =>
      debug "main thread"
      db = new Dbay { dbnick, ram: true, }
      db.sqlt1.exec SQL"begin transaction;"
      create_and_populate_tables db
      db.sqlt1.exec SQL"commit;"
      show_sqlite_schema db
      worker = new Worker __filename
      # worker.postMessage 'ready'
      worker.on 'message', ( P... ) -> info '^309-1^', "Main thread received message:", P
      debug '^309-17^', db.sqlt1
      debug '^309-18^', db.cfg
      show_table_contents "main thread", db
      # for n in [ 0 .. 1e8 ]
      #   null
      help "sleeping..."; await guy.async.sleep 10
      help '^309-1^', "exiting"
      return null
  #.........................................................................................................
  else
    do =>
      urge CND.reverse "█ █ █ █ █ █ worker thread █ █ █ █ █ █ "
      # parentPort.on 'message', ( P... ) -> info '^309-1^', P
      db = new Dbay { dbnick, ram: true, }
      add_table_function db
      show_sqlite_schema db
      debug '^309-19^', db.sqlt1
      debug '^309-20^', db.cfg
      # # show_table_contents "worker thread", db
      statement = db.sqlt1.prepare SQL"select * from my_table_udf();"
      for row from statement.iterate()
        info '^309-1^', row
      parentPort.postMessage 'done'
      # help "sleeping..."; await guy.async.sleep 1
      # show_table_contents "worker thread", db
      return null
      # help "sleeping..."; await guy.async.sleep 0.1
  #.........................................................................................................
  return null


############################################################################################################
if require.main is module then do =>
  # demo_attach_memory_connections_1()
  # demo_udf_1()
  # demo_udf_dbay_sqlt()
  await demo_worker_threads()

