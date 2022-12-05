
'use strict'


############################################################################################################
GUY                       = require '../../../apps/guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'MOONRIVER/NG'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  type_of }               = types
br                        = -> echo '—————————————————————————————————————————————'
H                         = require '../../../lib/helpers'
{ lets
  freeze  }               = require '../../../apps/letsfreezethat'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_concurrency_with_unsafe_mode = ->
  br()
  { Pipeline, \
    transforms: T,
    $,              } = require '../../../apps/moonriver'
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  db                  = new DBay()
  db.pragma SQL"journal_mode = wal;"
  #.........................................................................................................
  db SQL"""create table numbers (
    n   integer not null primary key,
    sqr integer );"""
  insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  #.........................................................................................................
  db ->
    for n in [ 0 .. 10 ]
      db insert_number, { n, sqr: null, }
  #.........................................................................................................
  p = new Pipeline { protocol: true, }
  p.push ( d ) -> d.sqr = d.n ** 2
  p.push ( d ) -> urge '^35^', d
  iterator = p.walk()
  db.with_unsafe_mode ->
    # mode = 'deferred' # 'deferred', 'immediate', 'exclusive'
    # mode = 'immediate' # 'deferred', 'immediate', 'exclusive'
    # mode = 'exclusive' # 'deferred', 'immediate', 'exclusive'
    # db.with_transaction { mode, }, ->
    db.pragma SQL"journal_mode = wal;"
    db.with_transaction ->
      for d from db SQL"select * from numbers order by n;"
        debug '^35^', d
        p.send d
        { value: e, done, } = iterator.next()
        db insert_number, e
        break if done
  #.........................................................................................................
  H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_concurrent_writes = ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  { Pipeline }        = require '../../../apps/moonriver'
  #.........................................................................................................
  show = ( db ) -> H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  prepare = ( db ) ->
    if ( db.all_rows SQL"select name from sqlite_schema where name = 'numbers';" ).length is 0
      db SQL"""create table numbers (
        n   integer not null primary key,
        sqr integer );"""
    #.......................................................................................................
    insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
    db insert_number, { n, sqr: null, } for n in [ 0 .. 10 ]
    return null
  #.........................................................................................................
  db              = new DBay()
  prepare db
  show    db
  read_numbers    = db.prepare SQL"select * from numbers order by n;"
  insert_numbers  = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  #.........................................................................................................
  $initialize = ->
    p               = new Pipeline()
    p.push _show    = ( d ) -> urge '^22-1^', d
    p.push _freeze  = ( d ) -> freeze d
    return p
  #.........................................................................................................
  $process = ->
    p               = new Pipeline()
    p.push square   = ( d, send ) -> send lets d, ( d ) -> d.sqr = d.n ** 2
    return p
  #.........................................................................................................
  $sink = ( write_data ) -> _sink = ( d ) -> write_data d
  #.........................................................................................................
  $my_datamill = ( read_data, write_data ) ->
    p               = new Pipeline()
    p.push -> yield from db read_data
    p.push $initialize()
    p.push $process()
    p.push $sink write_data
    return p
  #.........................................................................................................
  db.with_deferred_write ( write ) ->
    write_data  = ( d ) -> write insert_numbers, d
    p           = $my_datamill read_numbers, write_data
    p.run()
  #.........................................................................................................
  show db
  return null


############################################################################################################
if module is require.main then do =>
  demo_concurrent_writes()


