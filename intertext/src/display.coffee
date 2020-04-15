
'use strict'

############################################################################################################
CND                       = require 'cnd'
badge                     = 'INTERTEXT/PARSERS/DISPLAY'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
{ assign
  jr }                    = CND
# warn "^3763^ using ../../apps/intertext/types, should use ../types"
# INTERTEXT                 = require '../../apps/intertext'
INTERTEXT                 = require 'intertext'
{ isa
  validate
  type_of }               = INTERTEXT.types
SP                        = require 'steampipes'
{ $
  $watch
  $drain }                = SP.export()
DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
{ new_datom
  # stamp
  # wrap_datom
  is_stamped
  lets
  freeze
  select }                = DATOM.export()
{ rpr }                   = INTERTEXT.export()


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@$tee_show_tokens_as_blocks = ->
  escape_text = ( text ) ->
    R = text
    R = R.replace /\n/g, '⏎'
    R = R.replace /[\x00-\x1a\x1c-\x1f]/g, ( $0 ) -> String.fromCodePoint ( $0.codePointAt 0 ) + 0x2400
    R = R.replace /\x1b(?!\[)/g, '␛'
    return R
  #.........................................................................................................
  colors      = [ CND.MAGENTA, CND.CYAN, CND.GREEN, ]
  color_count = colors.length
  source      = null
  pipeline    = []
  lexemes     = []
  errors      = []
  #.........................................................................................................
  pipeline.push SP.$once_after_last ( send ) ->
    echo ( ( "#{idx * 10}".padEnd 10, ' ' ) for idx in [ 0 .. 19 ] ).join ''
    echo '├┬┬┬┬┼┬┬┬┐'.repeat 20
    echo escape_text source
    echo ( colors[ idx %% color_count ] CND.reverse CND.bold escape_text lexeme for lexeme, idx in lexemes ).join ''
    echo (                                          escape_text lexeme for lexeme, idx in lexemes ).join ''
    for error in errors
      indent  = ' '.repeat error.start
      stretch = CND.red CND.reverse error.text
      message = CND.yellow error.message
      echo "#{indent}#{stretch} #{message}"
    return null
  #.........................................................................................................
  pipeline.push $ ( d, send ) ->
    ### TAINT unify nodes so we don't have to do this ###
    if is_document_A = ( d.$key is '<document' )                      then source = d.source
    if is_document_B = ( d.$key is '<node' and d.name is 'document' ) then source = d.text
    if is_document_A or is_document_B then  return send d
    return send d if ( d.$key is '>document' ) or ( d.$key is '>node' and d.name is 'document' )
    #.......................................................................................................
    if select d, '^error'
      errors.push d
      return send d
    return send d if is_stamped d
    # debug '^080^', jr d
    { text } = d
    return send d unless text?
    lexemes.push text
    return send d
  #.........................................................................................................
  return SP.pull pipeline...

#-----------------------------------------------------------------------------------------------------------
@$tee_show_tokens_as_table = ( settings = null ) ->
  ### TAINT implement `$tee()` in SteamPipes ###
  byline    = []
  # byline.push $show()
  byline.push @$_show_tokens_as_table settings
  byline.push $drain()
  return SP.$tee SP.pull byline...

#-----------------------------------------------------------------------------------------------------------
@$_show_tokens_as_table = ( settings = null ) ->
  # debug '^2224^', TBL       = INTERTEXT.TBL
  # last      = Symbol 'last'
  pipeline  = []
  include   = [
    '$key',
    'pos', 'name', 'text',
    '$vnr', '$',
    # 'type', 'value', 'atrs'
    # 'role',
    # 'txtl', 'tagl', 'tagr', 'atrl'
    # 'errors', 'source',
    ]
  # exclude   = [ 'source', ]
  exclude   = []
  defaults  = { stamped: false, }
  settings  = { defaults..., settings..., }
  #.........................................................................................................
  pipeline.push $filter = $ ( d, send ) => send d if ( settings.stamped ) or ( not d.$stamped )
  pipeline.push SP.$collect()
  pipeline.push $collect_keys = $ ( buffer, send ) =>
    for d in buffer
      include.push k for k of d when not ( ( k in include ) or ( k in exclude ) )
      send d
    return  null
  #.........................................................................................................
  pipeline.push $reorder_keys = $ ( d, send ) =>
    ### TAINT is an option in `$tabulate()` (?) ###
    e = {}
    for k in include
      v       = d[ k ]
      e[ k ]  = if ( v? or v is null ) then v else undefined
    send e
  #.........................................................................................................
  pipeline.push $format = $ ( d, send ) =>
    d.text  = rpr d.text if d.text?
    d.pos   = ''
    d.pos  += ( if d.start? then ( "#{d.start}".padStart 3 ) else '---' ) + ','
    d.pos  += ( if d.stop?  then ( "#{d.stop}".padStart  3 ) else '---' )
    delete d.start
    delete d.stop
    send d
  #.........................................................................................................
  colorize = ( cell_txt, { value, row, is_header, key, idx, } ) =>
    R   = cell_txt
    return CND.white                CND.bold  CND.reverse R   if is_header
    return CND.BASE01 CND.underline CND.bold  CND.reverse R   if ( row.name is 'info' )
    return CND.BLUE   CND.underline CND.bold  CND.reverse R   if ( row.$key is '^raw' )
    return CND.white                CND.bold  CND.reverse R   if ( row.$key is '^text' ) and ( key is 'text' )
    return CND.blue                 CND.bold  CND.reverse R   if value? and ( key is 'text' )
    switch type_of value
      when 'boolean'      then  R = CND.yellow  R
      when 'text'         then  R = CND.blue    R
      when 'number'       then  R = CND.green   R
      when 'undefined'    then  R = CND.grey    R
      when 'null'         then  R = CND.grey    R
      else                      R = CND.white   R
    return R
  #.........................................................................................................
  # pipeline.push $show()
  pipeline.push INTERTEXT.TBL.$tabulate { format: colorize, }
  pipeline.push $watch ( d ) -> echo d.text
  return SP.pull pipeline...

#-----------------------------------------------------------------------------------------------------------
@show_tokens_as_table = ( tokens ) -> new Promise ( resolve ) =>
  validate.list tokens
  pipeline = []
  pipeline.push tokens
  # pipeline.push @$raw_tokens_from_source()
  # pipeline.push @$as_datoms()
  # pipeline.push @$consolidate_errors()
  # pipeline.push @$consolidate_tags()
  # pipeline.push $show { title: '^443-2^', }
  pipeline.push @$tee_show_tokens_as_table { stamped: true, }
  # pipeline.push @$tee_show_tokens_as_table { stamped: false, }
  pipeline.push @$tee_show_tokens_as_blocks()
  # pipeline.push $watch ( d ) -> echo CND.yellow jr d unless d.$key is '^xmlxr:info'
  pipeline.push $drain resolve()
  SP.pull pipeline...
  return null


