
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/NEW-SQLITE-FEATURES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
@[ "SQLite 202201112328 date and time functions" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }        = require H.dbay_path
  db              = new DBay()
  db.create_function
    name: 'xxx_timestamp_s'
    call: -> Date.now() / 1000
  #.........................................................................................................
  ### Mysteriously, delta t varies between 0 and 0.9 in observed cases. It shouldnt, but it does. ###
  T?.ok ( db.single_value SQL"select abs( unixepoch() - xxx_timestamp_s() );" ) < 2
  #.........................................................................................................
  ### These should (https://www.sqlite.org/draft/lang_datefunc.html#uepch) accept timestamps but they
  don't? But the methods are there. ###
  debug '^323^', db.first_row SQL"""
    with v1 as ( select unixepoch() as ue )
    select
        ue                                    as d0,
        datetime()                            as d1,
        strftime( '%Y-%m-%d %H:%M:%S' )       as d2
      from v1;"""
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "SQLite 202201112328 JSON operators" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }        = require H.dbay_path
  db              = new DBay()
  #.........................................................................................................
  T?.eq ( db.single_value SQL"""select '{"a":2,"c":[4,5,{"f":7}]}' -> '$' as d;""" ), '{"a":2,"c":[4,5,{"f":7}]}'
  T?.eq ( db.single_value SQL"""select '[11,22,33,41]' -> 3               as d;""" ), '41'
  T?.eq ( db.single_value SQL"""select '[11,22,33,41]' ->> 3              as d;""" ), 41
  T?.eq ( db.single_value SQL"""select json_insert('{"a":2,"c":4}', '$.a', 99)             as d;""" ), '{"a":2,"c":4}'
  T?.eq ( db.single_value SQL"""select json_insert('{"a":2,"c":4}', '$.e', 99)             as d;""" ), '{"a":2,"c":4,"e":99}'
  T?.eq ( db.single_value SQL"""select json_replace('{"a":2,"c":4}', '$.a', 99)            as d;""" ), '{"a":99,"c":4}'
  T?.eq ( db.single_value SQL"""select json_replace('{"a":2,"c":4}', '$.e', 99)            as d;""" ), '{"a":2,"c":4}'
  T?.eq ( db.single_value SQL"""select json_set('{"a":2,"c":4}', '$.a', 99)                as d;""" ), '{"a":99,"c":4}'
  T?.eq ( db.single_value SQL"""select json_set('{"a":2,"c":4}', '$.e', 99)                as d;""" ), '{"a":2,"c":4,"e":99}'
  T?.eq ( db.single_value SQL"""select json_set('{"a":2,"c":4}', '$.c', '[97,96]')         as d;""" ), '{"a":2,"c":"[97,96]"}'
  T?.eq ( db.single_value SQL"""select json_set('{"a":2,"c":4}', '$.c', json('[97,96]'))   as d;""" ), '{"a":2,"c":[97,96]}'
  T?.eq ( db.single_value SQL"""select json_set('{"a":2,"c":4}', '$.c', json_array(97,96)) as d;""" ), '{"a":2,"c":[97,96]}'
  #.........................................................................................................
  done?()





############################################################################################################
if require.main is module then do =>
  test @
