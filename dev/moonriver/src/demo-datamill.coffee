
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

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
demo_datamill = ->
  br()
  { Pipeline, \
    transforms: T,
    $,              } = require '../../../apps/moonriver'
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  db                  = new DBay()
  #.........................................................................................................
  db SQL"""create table numbers (
    n   integer not null primary key,
    sqr integer );"""
  insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  # db.sqlt1.unsafeMode true
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
demo_shadow_db = ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  #.........................................................................................................
  with_shadow = ( db, handler ) ->
    original_path = db.cfg.path
    GUY.temp.with_shadow_file original_path, ({ path, }) ->
      handler { db: ( new DBay { path, } ), }
      db.destroy()
    return new DBay { path: original_path, }
  #.........................................................................................................
  my_path = '/tmp/helo.db'
  db      = new DBay { path: my_path, }
  db ->
    if ( db.all_rows SQL"select name from sqlite_schema where name = 'numbers';" ).length is 0
      db SQL"""create table numbers (
        n   integer not null primary key,
        sqr integer );"""
    #.......................................................................................................
    insert_number = db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
    db insert_number, { n, sqr: null, } for n in [ 0 .. 10 ]
  #.........................................................................................................
  H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  db = with_shadow read_db = db, ({ db: write_db, }) ->
    insert_number = write_db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
    for d from read_db SQL"select * from numbers order by n;"
      write_db insert_number, { n, sqr: n ** 2, } for n in [ 0 .. 10 ]
    return null
  #.........................................................................................................
  H.tabulate "numbers", db SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  # await demo_datamill()
  demo_shadow_db()


