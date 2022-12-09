
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
demo_concurrency_with_two_connections = ->
  br()
  { Pipeline, \
    transforms: T,
    $,              } = require '../../../apps/moonriver'
  { DBay }            = require '../../../apps/dbay'
  { SQL  }            = DBay
  dbr                 = new DBay()
  dbw                 = new DBay { path: dbr.cfg.path, }
  # dbr.set_journal_mode 'delete'
  # dbw.set_journal_mode 'delete'
  #.........................................................................................................
  dbr SQL"""create table numbers (
    n   integer not null primary key,
    sqr integer );"""
  insert_number = dbw.prepare_insert { into: 'numbers', on_conflict: { update: true, }, }
  #.........................................................................................................
  dbr ->
    for n in [ 0 .. 10 ]
      dbr insert_number, { n, sqr: null, }
  #.........................................................................................................
  H.tabulate "numbers", dbr SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  # dbr.with_transaction ->
  for d from dbr SQL"select * from numbers order by n;"
    d.sqr = d.n ** 2
    dbw insert_number, d
    d.n = d.n + 100
    d.sqr = d.n ** 2
    dbw insert_number, d
  #.........................................................................................................
  H.tabulate "numbers", dbr SQL"""select * from numbers order by n;"""
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
demo_datamill_pipeline = ->
  { DBay }                  = require '../../../apps/dbay'
  { SQL  }                  = DBay
  { Pipeline }              = require '../../../apps/moonriver'
  { HDML }                  = require '../../../apps/hdml'
  #.........................................................................................................
  show = ( db ) -> H.tabulate "texts", db SQL"""select * from texts order by n1_lnr, n3_part;"""
  #.........................................................................................................
  prepare = ( db ) ->
    db = new DBay()
    # if ( db.all_rows SQL"select name from sqlite_schema where name = 'texts';" ).length is 0
    db SQL"""create table texts (
      n1_lnr      integer not null,
      n2_version  integer not null,
      n3_part     integer not null,
      line  text    not null,
      primary key ( n1_lnr, n2_version, n3_part ) );"""
    #.......................................................................................................
    write_data  = db.prepare_insert { into: 'texts', on_conflict: { update: true, }, }
    read_data   = db.prepare SQL"""select * from texts order by n1_lnr, n3_part;"""
    db write_data, { n1_lnr: 1, n3_part: 1, n2_version: 1, line: "helo world", }
    return { db, read_data, write_data, }
  #.........................................................................................................
  $initialize = ->
    p               = new Pipeline()
    p.push _show    = ( d ) -> whisper '^22-1^', d
    p.push _freeze  = ( d ) -> freeze d
    return p
  #.........................................................................................................
  $process = ->
    p               = new Pipeline()
    p.push foobar   = ( d, send ) -> send lets d, ( d ) -> d.line = "*#{d.line}*"
    p.push foobar   = ( d, send ) -> send lets d, ( d ) ->
      d.line = HDML.pair 'div.foo', HDML.text d.line
      d.n2_version++
    p.push _show    = ( d ) -> urge '^22-1^', d
    return p
  #.........................................................................................................
  $my_datamill = ( db, read_data, write_data ) ->
    p = new Pipeline()
    p.push source = -> yield from db read_data
    p.push $initialize()
    p.push $process()
    p.push sink = ( d ) -> db write_data, d
    return p
  #.........................................................................................................
  { db
    read_data
    write_data }  = prepare()
  show db
  p = $my_datamill db, read_data, write_data
  info '^34-1^', p
  p.run()
  #.........................................................................................................
  show db
  return null


############################################################################################################
if module is require.main then do =>
  demo_datamill_pipeline()
  # demo_concurrency_with_two_connections()

