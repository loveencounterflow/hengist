
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
  ### Create table on first connection, can insert data on second connconnection: ###
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
    ### Sanity check that UDF does work (on the same connconnection): ###
    db.sqlt1.function 'std_square', { varargs: false, }, ( n ) -> n ** 2
    # select  = db.sqlt1.prepare SQL"select sqrt( 42 ) as n;"
    select  = db.sqlt1.prepare SQL"select std_square( 42 ) as n;"
    select.run()
    info '^309-1^', row for row from select.iterate()
    return null
  #.........................................................................................................
  do =>
    ### Run query (on 1st connconnection) that calls UDF running another query (on the 2nd connconnection): ###
    db.sqlt1.function 'std_row_count', { varargs: false, deterministic: false, }, ->
      statement = db.sqlt2.prepare SQL"select count(*) as count from x;", {}, false
      statement.run()
      rows      = [ statement.iterate()..., ]
      return rows[ 0 ]?.count ? null
    select  = db.sqlt1.prepare SQL"select std_row_count() as n;"
    select.run()
    info '^309-1^', row for row from select.iterate()
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
    debug '^322-1^'
    xxx_statement = db.sqlt2.prepare SQL"select n from x;"
    db.sqlt1.table 'std_some_texts',
      columns:        [ 'n', ]
      deterministic:  false
      varargs:        false
      rows: ->
        debug '^322-2^'
        xxx_statement.run()
        debug '^322-3^'
        # yield from xxx_statement.iterate()
        for row from xxx_statement.iterate()
          debug '^322-4^', row
          yield row
        return null
    #.......................................................................................................
    ### not possible to attach the same DB more than once: ###
    # debug '^078-1^', db.sqlt1.name
    # debug '^078-1^', ( db.sqlt1.prepare SQL"attach ? as s1b;" ).run [ db.sqlt1.name, ]
    #.......................................................................................................
    # select  = db.sqlt1.prepare SQL"select * from std_generate_series();"
    # select2 = db.sqlt1.prepare SQL"select * from std_generate_series();"
    select  = db.sqlt1.prepare SQL"select * from std_some_texts();"
    select.run()
    # for row from select.iterate()
    #   select2.run()
    #   info '^309-1^', row, [ ( select2.iterate() )..., ]
    for row from select.iterate()
      info '^309-1^', row
    db.sqlt1.unsafeMode false
    db.sqlt2.unsafeMode false
    return null
  #.........................................................................................................
  return null

############################################################################################################
if require.main is module then do =>
  # demo_attach_memory_connections_1()
  # demo_udf_1()
  demo_udf_dbay_sqlt()
