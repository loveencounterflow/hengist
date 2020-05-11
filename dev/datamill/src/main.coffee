

'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'DATAMILL-DEMO'
rpr                       = CND.rpr
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
defer                     = setImmediate
async                     = {}
sync                      = { concurrency: 1, }
# async                     = { async: true, }
#...........................................................................................................
types                     = require './types'
{ isa
  validate
  cast
  type_of }               = types
INTERTEXT                 = require 'intertext'
{ HTML
  RXWS }                  = require '../../../apps/paragate'
SP                        = require 'steampipes'
{ $
  $async
  $drain
  $show
  $watch }                = SP.export()
DATOM                     = require '../../../apps/datom'
{ select
  stamp
  new_datom
  fresh_datom }           = DATOM.export()
# DB                        = require '../intershop/intershop_modules/db'
INTERSHOP                 = require '../intershop'
PGP                       = ( require 'pg-promise' ) { capSQL: false, }


#-----------------------------------------------------------------------------------------------------------
@$headings = ( me ) ->
  ### Recognize heading as any line that starts with a `#` (hash). Current behavior is to
  check whether both prv and nxt lines are blank and if not so issue a warning; this detail may change
  in the future. ###
  pattern = /// ^ (?<hashes> \#+ ) (?<text> [\s\S]* ) $ ///
  #.........................................................................................................
  # H.register_key S, '<h', { is_block: true, }
  # H.register_key S, '>h', { is_block: true, }
  #.........................................................................................................
  return $ ( d, send ) =>
    return send d unless d.$key   is '^block'
    return send d unless d.level  is 0
    return send d unless ( match = d.text.match pattern )?
    urge '^334^', CND.reverse d
    send stamp d
    level = match.groups.hashes.length
    text  = match.groups.text.replace /^\s*(.*?)\s*$/g, '$1' ### TAINT use trim method ###
    dest  = '???' # d.dest
    send fresh_datom '<h',    { level, $vnr: [ d.$vnr..., 1, ] , dest, ref: 'blk/hd1', }
    send fresh_datom '^line', { text,  $vnr: [ d.$vnr..., 2, ] , dest, ref: 'blk/hd2', }
    send fresh_datom '>h',    { level, $vnr: [ d.$vnr..., 3, ] , dest, ref: 'blk/hd3', }
    return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@$transform = ( me ) ->
  last      = Symbol 'last'
  pipeline  = []
  pipeline.push @$headings    me
  pipeline.push $ { last, }, $ ( d, send ) ->
    if d is last
      send { $key: '^foo', $vnr: [ 10, -1, ], }
      send { $key: '^foo', $vnr: [ 10, ], }
      send { $key: '^foo', $vnr: [ 10, 0, ], }
      send { $key: '^foo', $vnr: [ 10, 1, ], }
      return null
    send d
  return SP.pull pipeline...


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@$async_tee_write_to_db_2 = ( me ) ->
  DEMO_datoms_table   = new PGP.helpers.TableName { schema: 'demo', table: 'datoms', }
  DEMO_datoms_fields  = new PGP.helpers.ColumnSet [ 'vnr', 'key', 'atr', 'stamped', ] #, table
  last                = Symbol 'last'
  buffer              = []
  buffer_size         = 15
  pipeline            = []
  #.........................................................................................................
  flush = ->
    values        = field_values_from_datoms buffer
    buffer.length = 0
    sql           = PGP.helpers.insert values, DEMO_datoms_fields, DEMO_datoms_table
    await me.db.none sql
    whisper '^443^', CND.plum CND.reverse "written #{values.length} values"
    return null
  #.........................................................................................................
  pipeline.push $guard = $ { last, }, ( d, send ) => send d
  #.........................................................................................................
  pipeline.push $buffer = $async ( d, send, done ) =>
    if d is last
      await flush() if ( buffer.length > 0 )
    else
      buffer.push d
      await flush() if ( buffer.length >= buffer_size )
      send d
    done()
    return null
  #.........................................................................................................
  return SP.pull pipeline...


#-----------------------------------------------------------------------------------------------------------
@$tee_write_to_db_1 = ( me ) ->
  first     = Symbol 'first'
  last      = Symbol 'last'
  sql       = "insert into DEMO.datoms ( vnr, key, atr, stamped ) values ( $1, $2, $3, $4 );"
  pipeline  = []
  #.........................................................................................................
  pipeline.push $guard = $ { first, last, }, ( d, send ) =>
    if d is first
      help '^807^', "first"
      return null
    if d is last
      help '^807^', "last"
      return null
    send d
  #.........................................................................................................
  pipeline.push $write = $async ( d, send, done ) =>
    #.......................................................................................................
    await DB.query [ sql, ( field_values_from_datoms d )..., ]
    #.......................................................................................................
    send d
    done()
    return null
  #.........................................................................................................
  return SP.pull pipeline...

#-----------------------------------------------------------------------------------------------------------
field_values_from_datoms = ( ds ) -> ( ( field_values_from_datom d ) for d in ds )

#-----------------------------------------------------------------------------------------------------------
field_values_from_datom = ( d ) ->
  stamped = d.stamped ? false
  vnr     = ( ( if x is Infinity then 999 else if x is -Infinity then -999 else x ) for x in d.$vnr )
  return { vnr, key: d.$key, atr: null, stamped, }

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
$display = ( me ) =>
  return $watch ( d ) =>
    xxx = ( d ) -> R = {}; R[ k ] = d[ k ] for k in ( Object.keys d ).sort(); return R
    ### TAINT use datamill display ###
    switch d.$key
      when '<document', '>document' then echo CND.grey xxx d
      when '^blank',    '>document' then echo CND.grey CND.reverse xxx d
      else
        switch d.$key[ 0 ]
          when '<'  then echo CND.lime              xxx d
          when '>'  then echo CND.red               xxx d
          when '^'  then echo CND.yellow            xxx d
          else           echo CND.reverse CND.green xxx d
    return null

#-----------------------------------------------------------------------------------------------------------
@connect = ->
  O                         = INTERSHOP.settings
  db_user                   = O[ 'intershop/db/user' ].value
  db_name                   = O[ 'intershop/db/name' ].value
  connection_string         = "postgres://#{db_user}@localhost/#{db_name}"
  return PGP connection_string

#-----------------------------------------------------------------------------------------------------------
@_clear = ( me ) ->
  debug '^443^', "truncating table DEMO.datoms"
  await me.db.none "truncate DEMO.datoms cascade;"
  debug '^443^', "ok"

#-----------------------------------------------------------------------------------------------------------
@_list = -> # new Promise ( resolve ) =>
  me        = { db: @connect(), }
  rows      = await me.db.any "select * from DEMO.datoms order by vnr using <;"
  for row from rows
    help '^332^', row
  me.db.$pool.end()  # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_stream_using_intershop = -> new Promise ( resolve, reject ) =>
  DB          = require '../intershop/intershop_modules/db'
  # sql       = "select * from MIRAGE.mirror where dsk = 'proposal' order by linenr;"
  sql         = "select n from generate_series( 42, 51 ) as x ( n );"
  source      = await DB.new_query_source sql
  pipeline    = []
  pipeline.push source
  pipeline.push SP.$show()
  pipeline.push $drain -> do =>
    help '^445-7^', "stream ended"
    await DB._pool.end()
    resolve()
  SP.pull pipeline...
  # source.end()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_stream = -> new Promise ( resolve, reject ) =>
  DB          = require '../intershop/intershop_modules/db'
  await @_demo_stream()
  await DB._pool.end()
  urge '^445-1^', "pool ended"
  resolve()

#-----------------------------------------------------------------------------------------------------------
@_demo_stream = -> new Promise ( resolve, reject ) =>
  urge '^445-2^', "starting"
  DB          = require '../intershop/intershop_modules/db'
  Cursor      = require 'pg-cursor'
  # sql         = "select * from MIRAGE.mirror where dsk = 'proposal' order by linenr;"
  sql         = "select n from generate_series( 42, 51 ) as x ( n );"
  settings    = null
  client      = await DB._pool.connect()
  cursor      = new Cursor sql
  cursor      = await client.query cursor
  source      = SP.new_push_source()
  # source      = await DB.new_query_source sql #, settings...
  urge '^445-3^', "starting"
  limit       = 3
  #.........................................................................................................
  # close = -> new Promise ( resolve, reject ) =>
  #   cursor.close ( error ) => if error? then reject error else resolve()
  read  = -> new Promise ( resolve, reject ) =>
    cursor.read limit, ( error, rows ) => if error? then reject error else resolve rows
  #.........................................................................................................
  source.start = -> do => ### Note: must be function, not asyncfunction ###
    urge '^445-4^', "source started"
    loop
      urge '^445-5^', "read from cursor"
      rows = await read()
      break if rows.length is 0
      urge '^445-6^', "read #{rows.length} rows"
      source.send row for row in rows
      urge '^445-6^', "pushed #{rows.length} rows"
    # await cursor.close()
    # urge '^445-8^', "cursor closed"
    client.release()
    urge '^445-8^', "client released"
    source.end()
    urge '^445-8^', "source ended"
    return null
  #.........................................................................................................
  pipeline      = []
  pipeline.push source
  pipeline.push SP.$show()
  pipeline.push $drain ->
    help '^445-7^', "stream ended"
    resolve()
  SP.pull pipeline...
  # source.end()
  return null

#-----------------------------------------------------------------------------------------------------------
@demo = -> new Promise ( resolve ) =>
  # debug '^4554^', rpr ( k for k of DATAMILL )
  DISPLAY = require '../../paragate/lib/display'
  me        = { db: @connect(), }
  pipeline  = []
  tokens    = RXWS.grammar.parse source
  await @_clear me
  pipeline.push tokens
  pipeline.push @$transform                     me
  pipeline.push $display                        me
  pipeline.push await @$async_tee_write_to_db_2 me
  pipeline.push $drain =>
    # await DB._pool.end() # unless pool.ended
    # PGP.end()       # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
    me.db.$pool.end()  # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
    resolve()
  SP.pull pipeline...
  return null


############################################################################################################
if module is require.main then do =>
  # await @demo()
  # await @_list()
  # await @demo_stream()
  await @demo_stream_using_intershop()
  # await @demo_inserts()
  help 'ok'
  return null







