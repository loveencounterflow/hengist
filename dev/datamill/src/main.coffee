

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
  $watch  }               = SP.export()
DATOM                     = require '../../../apps/datom'
{ select
  stamp
  freeze
  lets
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
@demo_stream = -> new Promise ( resolve, reject ) =>
  DB          = require '../intershop/intershop_modules/db'
  await @_demo_stream()
  await DB._pool.end()
  urge '^445-1^', "pool ended"
  resolve()

#-----------------------------------------------------------------------------------------------------------
$parse = ( grammar ) -> $ ( source, send ) ->
  send token for token in grammar.parse source

#-----------------------------------------------------------------------------------------------------------
$mark_doc_boundaries = ->
  return SP.window { width: 2, fallback: null, }, $ ( cd, send ) ->
    [ c, d, ] = cd
    return null unless ( c? and d? )
    if ( d.$key is '<document' )
      if ( c.$key is '>document' )
        send freeze { $key: '^boundary', }
    else unless ( d.$key is '>document' )
      send d
    return null


escape_text = ( text ) ->
  R = text
  R = R.replace /\n/g, '⏎'
  R = R.replace /[\x00-\x1a\x1c-\x1f]/g, ( $0 ) -> String.fromCodePoint ( $0.codePointAt 0 ) + 0x2400
  R = R.replace /\x1b(?!\[)/g, '␛'
  return R

INTERTEXT_show_text_ruler = ( text ) ->
  echo ( ( "#{idx * 10}".padEnd 10, ' ' ) for idx in [ 0 .. 19 ] ).join ''
  # piece = '├┬┬┬┬┼┬┬┬┐'.replace /./g, ( $0, idx ) ->
  #   return if idx %% 2 is 0 then ( CND.reverse $0 ) else $0
  colors = [
    CND.yellow
    CND.cyan
    CND.pink
    ]
  piece = ( ( CND.reverse CND.yellow ' ' ) + '░' ).repeat 10
  piece = '█ ░ ░ ░ ░ '
  echo piece.repeat 20
  chrs  = [ ( escape_text text )..., ]
  ruler = ''
  for block_idx in [ 0 ... chrs.length ] by +10
    color = colors[ block_idx %% colors.length ]
    for chr, chr_idx in chrs
      ruler += if ( chr_idx %% 2 ) is 0 then ( CND.reverse chr ) else chr
  echo ruler
  return null

#-----------------------------------------------------------------------------------------------------------
@_demo_stream = -> new Promise ( resolve, reject ) =>
  DB                  = require '../intershop/intershop_modules/db'
  sql                 = "select * from MIRAGE.mirror where dsk = 'proposal' order by linenr;"
  #.........................................................................................................
  $extract_line       = -> $ ( d, send ) -> send d.line
  $concatenate_chunks = ->
    start   = 0
    linenr  = 1
    return $ ( chunk, send ) ->
      line_count    = chunk.length
      text          = chunk.join '\n'
      chr_count     = [ text..., ].length
      send freeze { $key: '^chunk', text, linenr, start, line_count, chr_count, }
      linenr += line_count
      start  += chr_count
  chunkify_filter     = ( d     ) -> /^\s*$/.test d
  #.........................................................................................................
  source              = await DB.new_query_source sql
  pipeline            = []
  pipeline.push source
  pipeline.push $extract_line()
  pipeline.push SP.$chunkify_keep chunkify_filter
  pipeline.push $concatenate_chunks()
  # pipeline.push $watch ( text ) -> urge rpr text
  pipeline.push $watch ( d ) -> INTERTEXT_show_text_ruler d.text
  # pipeline.push $parse RXWS.grammar
  # pipeline.push $mark_doc_boundaries()
  pipeline.push SP.$show()
  pipeline.push $drain -> do => ### NOTE must be function, not asyncfunction ###
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
  await @demo_stream()
  # await @demo_inserts()
  help 'ok'
  return null







