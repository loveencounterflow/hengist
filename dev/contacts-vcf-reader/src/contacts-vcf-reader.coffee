
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'CONTACTS-VCF-READER'
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
types                     = ( require 'intertext' ).types
{ isa
  validate
  cast
  last_of
  type_of }               = types
SP                        = require 'steampipes'
{ $
  $async
  $watch
  $show
  $drain }                = SP.export()
{ jr, }                   = CND
DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
{ new_datom
  wrap_datom
  lets
  freeze
  select }                = DATOM.export()
FS                        = require 'fs'



#-----------------------------------------------------------------------------------------------------------
### TAINT should implement in SteamPipes ###
@$read_from_file = -> $ ( path, send ) => send FS.readFileSync path

#-----------------------------------------------------------------------------------------------------------
@$clean = -> $ ( line, send ) => line = line.trim(); send line unless line is ''

#-----------------------------------------------------------------------------------------------------------
@$fields = -> $ ( line, send ) =>
  unless ( match = line.match /^(?<name>[^:]+):(?<$value>.*)$/ )?
    warn "not a valid VCF line: #{jr line}"
    return
  { name, $value, } = match.groups
  name              = name.toLowerCase()
  #.........................................................................................................
  if ( name.indexOf 'encoding=quoted-printable' ) > -1
    $value = ( ( require 'libqp' ).decode $value ).toString 'utf-8'
  #.........................................................................................................
  name              = name.replace /;internet;pref$/,                           ''
  name              = name.replace /;charset=utf-8;encoding=quoted-printable$/, ''
  return send new_datom '<vcard' if ( name is 'begin' ) and ( $value is 'VCARD' )
  return send new_datom '>vcard' if ( name is 'end'   ) and ( $value is 'VCARD' )
  send new_datom "^#{name}", $value

#-----------------------------------------------------------------------------------------------------------
@$filter = -> SP.$filter ( d ) =>
  return false if select d, '^n'
  return false if select d, '^version'
  return false if ( d.$value is '' )
  return true

#-----------------------------------------------------------------------------------------------------------
@$resolve_name = -> $ ( d, send ) =>
  return        if      select d, '^n'
  return send d unless  select d, '^fn'
  send new_datom "^name", d.$value

#-----------------------------------------------------------------------------------------------------------
@$resolve_number = -> $ ( d, send ) =>
  return send d unless  select d, '^tel;cell;pref'
  send new_datom "^fon", d.$value

#-----------------------------------------------------------------------------------------------------------
@$prefix_number = -> $ ( d, send ) =>
  return send d unless  select d, '^fon'
  if d.$value.startsWith '0'
    d = lets d, ( d ) -> d.$value = '+49' + d.$value[ 1 .. ]
  send new_datom "^fon", d.$value

#-----------------------------------------------------------------------------------------------------------
@$consolidate = ->
  within_vcard  = false
  buffer        = {}
  return $ ( d, send ) =>
    if select d, '<vcard'
      within_vcard  = true
      buffer        = {}
      return null
    if select d, '>vcard'
      send new_datom '^vcard', buffer
      within_vcard  = false
      buffer        = null
      return null
    name = d.$key[ 1 .. ]
    return send d unless within_vcard
    if buffer[ name ]? and not isa.list buffer[ name ]
      buffer[ name ] = [ buffer[ name ], ]
    if isa.list buffer[ name ]  then  buffer[ name ].push d.$value
    else                              buffer[ name ] =    d.$value
    return null

#-----------------------------------------------------------------------------------------------------------
@$add_sortkey = ( key, sortkey ) -> $ ( d, send ) =>
  return send d unless d[ key ]?
  d = lets d, ( d ) -> d[ sortkey ] = d[ key ].toLowerCase()
  send d
  return null

#-----------------------------------------------------------------------------------------------------------
@$dedup = -> SP.window { width: 2, }, $ ( ds, send ) =>
  [ d1, d, ] = ds
  return unless d1 and d?
  return if ( d1.sortkey is d.sortkey ) and ( d1.fon is d.fon )
  send d
  return null

#-----------------------------------------------------------------------------------------------------------
@read_vcards = ( paths... ) -> new Promise ( resolve ) =>
  R         = []
  paths     = paths.flat Infinity
  pipeline  = []
  pipeline.push paths
  pipeline.push @$read_from_file()
  pipeline.push SP.$split()
  pipeline.push @$clean()
  pipeline.push @$fields()
  pipeline.push @$filter()
  pipeline.push @$resolve_name()
  pipeline.push @$resolve_number()
  pipeline.push @$prefix_number()
  pipeline.push @$consolidate()
  pipeline.push @$add_sortkey 'name', 'sortkey'
  pipeline.push SP.$sort { key: 'fon',      strict: false, }
  pipeline.push SP.$sort { key: 'sortkey',  strict: false, }
  pipeline.push @$dedup()
  # pipeline.push @$delete_key 'sortkey'
  # pipeline.push $show()
  pipeline.push $drain ( collector ) => resolve collector
  return SP.pull pipeline...


############################################################################################################
if module is require.main then do =>
  vcards = await @read_vcards [
    '../../../../../../contacts/**/*.vcf'
    ]
  # console.table vcards
  echo jr vcard for vcard in vcards




