

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
@$headings = ( S ) ->
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
@$transform = ( S ) ->
  pipeline = []
  pipeline.push @$headings    S
  return SP.pull pipeline...


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@$async_tee_write_to_db_2 = ->
  buffer              = []
  stream_has_ended    = false
  db_has_ended        = false
  stop_waiting        = null
  DEMO_datoms_table   = new PGP.helpers.TableName { schema: 'demo', table: 'datoms', }
  DEMO_datoms_fields  = new PGP.helpers.ColumnSet [ 'vnr', 'key', 'atr', 'stamped', ] #, table
  pipeline            = []
  first               = Symbol 'first'
  last                = Symbol 'last'
  buffer_size         = 1
  #.........................................................................................................
  flush = ->
    values        = field_values_from_datoms buffer
    buffer.length = 0
    sql           = PGP.helpers.insert values, DEMO_datoms_fields, DEMO_datoms_table
    debug '^443^', sql
    await db.none sql
    if stream_has_ended
      db_has_ended = true
      stop_waiting() if stop_waiting?
    return null
  #.........................................................................................................
  pipeline.push $buffer = $ { first, last, }, ( d, send ) =>
    if d is first
      null # init DB
      return null
    if d is last
      stream_has_ended = true
      flush() if buffer.length > 0
      return null
    buffer.push d
    flush() if buffer.length >= buffer_size
    send d
  #.........................................................................................................
  pipeline.push $wait = $async ( d, send, done ) =>
    send d
    if stream_has_ended and not db_has_ended
      stop_waiting = done
      return null
    return done()
  #.........................................................................................................
  return SP.pull pipeline...


#-----------------------------------------------------------------------------------------------------------
@$tee_write_to_db_1 = ( S ) ->
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
$display = ( S ) =>
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
@_clear = ( S ) ->
  debug '^443^', "truncating table DEMO.datoms"
  await S.db.none "truncate DEMO.datoms cascade;"
  debug '^443^', "ok"

#-----------------------------------------------------------------------------------------------------------
@demo = -> new Promise ( resolve ) =>
  # debug '^4554^', rpr ( k for k of DATAMILL )
  DISPLAY = require '../../paragate/lib/display'
  source  = """
    <title>A Proposal</title>
    <h1>Motivation</h1>
    <p>It has been suggested to further the cause.</p>
    <p>This is <i>very</i> desirable indeed.</p>

    # First Things First

    A paragraph on the lowest level
    (this, hopefully, does not apply to the paragraph's content
    but only to its position in the manuscript).

      An indented paragraph
      which may be understood
      as a blockquote or somesuch.

    ```
    some

    code
    ```

    """
  S         = { db: @connect(), }
  pipeline  = []
  tokens    = RXWS.grammar.parse source
  await @_clear S
  pipeline.push tokens
  pipeline.push @$transform S
  pipeline.push $display S
  pipeline.push await @$async_tee_write_to_db_2 S
  pipeline.push $drain ->
    db.$pool.end() # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
    resolve()
  SP.pull pipeline...
  # # tokens  = HTML.parse source
  # info rpr token for token in tokens
  # await DISPLAY.show_tokens_as_table tokens
  # for d in tokens
  #   echo CND.rainbow d
  #   switch d.$key
  #     when '<document' then null
  #     when '>document' then null
  #     when '^blank' then null
  #     when '^block'
  #       { text, } = d
  #       echo text
  #     else throw new Error "^3376^ unknown $key #{rpr d.$key}"
    # finally
  # await DB._pool.end() # unless pool.ended
    #   # PGP.end() # alternative, see https://github.com/vitaly-t/pg-promise#library-de-initialization
    #   stream_has_ended = true
  return null



############################################################################################################
if module is require.main then do =>
  await @demo()
  # await @demo_inserts()
  return null







