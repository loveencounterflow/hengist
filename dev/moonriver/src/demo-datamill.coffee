
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
demo_configurable_concurrent_writes = ->
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
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
  write_concurrently = ( db, mode ) ->
    FS = require 'node:fs'
    debug '^34-1^', FS.readdirSync '/tmp/dbay-concurrent'
    prepare db
    show db
    reader          = db.prepare SQL"select * from numbers order by n;"
    insert_numbers  = null
    debug '^34-1^', db.cfg.path
    #.......................................................................................................
    writer = ( db, d ) ->
      debug '^34-2^', db.cfg.path
      insert_numbers ?= db.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
      d.sqr = d.n ** 2
      db insert_numbers, d
      return null
    db = db.with_concurrent { mode, reader, writer, }
    show db
    return db
  #.........................................................................................................
  # write_concurrently ( new DBay() ), 'reader'
  # write_concurrently ( new DBay { journal_mode: 'delete', } ), 'shadow'
  # write_concurrently ( new DBay { journal_mode: 'delete', path: '/tmp/dbay-concurrent/mydb.sqlite', } ), 'shadow'
  write_concurrently ( new DBay { journal_mode: 'wal', path: '/tmp/dbay-concurrent/mydb.sqlite', } ), 'shadow'
  #.........................................................................................................
  return null


############################################################################################################
if module is require.main then do =>
  demo_configurable_concurrent_writes()


