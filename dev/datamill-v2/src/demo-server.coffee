
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DATAMILL/DEMO/SERVER'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
{ lets
  freeze  }               = require '../../../apps/letsfreezethat'
types                     = new ( require '../../../apps/intertype' ).Intertype()
{ isa
  type_of }               = types
{ DBay }                  = require '../../../apps/dbay'
{ SQL }                   = DBay
H                         = require '../../../lib/helpers'
br                        = -> echo '—————————————————————————————————————————————'





#===========================================================================================================
class Demo

  #---------------------------------------------------------------------------------------------------------
  datamill_server: ->
    { Datamill_server } = require '../../../apps/datamill-v2/lib/server'
    # { db }              = @_get_db()
    { db }              = @create_datamill_pipeline()
    server              = new Datamill_server { db, }
    await server.start()
    return null

  # #---------------------------------------------------------------------------------------------------------
  # _get_db: ->
  #   db      = new DBay()
  #   db SQL"""create table documents (
  #     n1_lnr      integer not null,
  #     n2_version  integer not null,
  #     n3_part     integer not null,
  #     line  text    not null,
  #     primary key ( n1_lnr, n2_version, n3_part ) );"""
  #   #.......................................................................................................
  #   write_data  = db.prepare_insert { into: 'documents', on_conflict: { update: true, }, }
  #   read_data   = db.prepare SQL"""select * from documents order by n1_lnr, n3_part;"""
  #   db write_data, { n1_lnr: 1, n3_part: 1, n2_version: 1, line: "helo world", }
  #   return { db, read_data, write_data, }

  #---------------------------------------------------------------------------------------------------------
  create_datamill_pipeline: ->
    { DBay }                  = require '../../../apps/dbay'
    { SQL  }                  = DBay
    { Pipeline }              = require '../../../apps/moonriver'
    { HDML }                  = require '../../../apps/hdml'
    #.......................................................................................................
    show = ( db ) -> H.tabulate "texts", db SQL"""select * from texts order by n1_lnr, n3_part;"""
    #.......................................................................................................
    prepare = ( db ) ->
      db = new DBay()
      # if ( db.all_rows SQL"select name from sqlite_schema where name = 'texts';" ).length is 0
      db SQL"""create table texts (
        n1_lnr      integer not null,
        n2_version  integer not null,
        n3_part     integer not null,
        line  text    not null,
        primary key ( n1_lnr, n2_version, n3_part ) );"""
      #.....................................................................................................
      write_data  = db.prepare_insert { into: 'texts', on_conflict: { update: true, }, }
      read_data   = db.prepare SQL"""select * from texts order by n1_lnr, n3_part;"""
      db write_data, { n1_lnr: 1, n3_part: 1, n2_version: 1, line: "helo world", }
      return { db, read_data, write_data, }
    #.......................................................................................................
    $initialize = ->
      p               = new Pipeline()
      p.push _show    = ( d ) -> whisper '^34-1^', d
      p.push _freeze  = ( d ) -> freeze d
      return p
    #.......................................................................................................
    $process = ->
      p               = new Pipeline()
      p.push foobar   = ( d, send ) -> send lets d, ( d ) -> d.line = "*#{d.line}*"
      p.push foobar   = ( d, send ) -> send lets d, ( d ) ->
        d.line = HDML.pair 'div.foo', HDML.text d.line
        d.n2_version++
      p.push _show    = ( d ) -> urge '^34-2^', d
      return p
    #.......................................................................................................
    $my_datamill = ( db, read_data, write_data ) ->
      p = new Pipeline()
      p.push source = -> yield from db read_data
      p.push $initialize()
      p.push $process()
      p.push sink = ( d ) -> db write_data, d
      return p
    #.......................................................................................................
    { db
      read_data
      write_data }  = prepare()
    show db
    p = $my_datamill db, read_data, write_data
    info '^34-3^', p
    p.run()
    #.......................................................................................................
    show db
    return { db, }


#===========================================================================================================
DEMO = new Demo()


############################################################################################################
if module is require.main then do =>
  await DEMO.datamill_server()
  # DEMO.create_datamill_pipeline()




