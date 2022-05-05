
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/DEMOS/CONCURRENT-WRITES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
H                         = require '../../../lib/helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require '../../../apps/guy'
X                         = require '../../../lib/helpers'
{ every
  after
  sleep
  defer
  cease }                 = GUY.async

#-----------------------------------------------------------------------------------------------------------
demo_concurrent_writes_block_and_error_out = ->
  # T?.halt_on_error()
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  path                = ( PATH.resolve PATH.join __dirname, '../../../dev-shm/concurrent-writes.sqlite' )
  count               = 0
  insert_numbers      = null
  #.........................................................................................................
  do =>
    db                  = new DBay { path, }
    db =>
      db SQL"""
        drop table if exists c;
        create table c (
            count integer not null,
            src   text    not null,
            n     integer not null,
            s     integer not null,
          primary key ( src, n ) );
        """
    insert_numbers = db.create_insert { into: 'c', returning: '*', }
  #.........................................................................................................
  show_table = =>
    db                  = new DBay { path, }
    H.tabulate "two c", db SQL"select * from c order by src, n;"
  #.........................................................................................................
  insert_one = =>
    db                  = new DBay { path, }
    db.begin_transaction()
    urge '^603-1^', "start one"
    await sleep 0.1
    src = 'one'
    for n in [ 1 .. 10 ]
      count++
      s   = n ** 2
      row = { count, src, n, s, }
      # show_table()
      try
        row = db.single_row insert_numbers, row
      catch error
        warn '^603-1^', error.message, row
      help '^603-one^', db.single_value SQL"select count(*) from c;"
      await sleep 0.1
      db.commit_transaction()
    # loop
    #   error = null
    #   try db.commit_transaction() catch error
    #     warn '^603-1^', error.message
    #   break unless error?
    return null
  #.........................................................................................................
  insert_two = =>
    db                  = new DBay { path, }
    db.begin_transaction()
    urge '^603-1^', "start two"
    await sleep 0.1
    src = 'two'
    for n in [ 1 .. 10 ]
      count++
      s   = n ** 2
      row = { count, src, n, s, }
      # show_table()
      try
        row = db.single_row insert_numbers, row
      catch error
        warn '^603-2^', error.message, row
      help '^603-two^', db.single_value SQL"select count(*) from c;"
      await sleep 0.1
    db.commit_transaction()
    return null
  #.........................................................................................................
  p1 = => new Promise ( resolve ) =>
    after 0.5, =>
      await insert_one()
      resolve()
  #.........................................................................................................
  p2 = => new Promise ( resolve ) =>
    after 0.5, =>
      await insert_two()
      resolve()
  #.........................................................................................................
  await do => new Promise ( resolve ) => ( Promise.all [ p1(), p2(), ] ).then =>
    db                  = new DBay { path, }
    H.tabulate "c", db SQL"select * from c order by src, n;"
    resolve()
  #.........................................................................................................
  return null


############################################################################################################
if require.main is module then do =>
  await demo_concurrent_writes_block_and_error_out()
