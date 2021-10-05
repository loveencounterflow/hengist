
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/STDLIB'
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
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY stdlib functions" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }          = require H.dbay_path
  #.........................................................................................................
  db = new DBay()
  db.create_stdlib()
  #.........................................................................................................
  test_and_show = ( probe, matcher ) =>
    urge '^341-1', probe
    info '^341-2', result = db.all_rows probe
    T?.eq result, matcher
    return null
  #.........................................................................................................
  test_and_show ( SQL"select std_str_reverse( 'abc一無所有𫠣' ) as x;" ), [ { x: '𫠣有所無一cba' } ]
  test_and_show ( SQL"select std_str_join( '-', '1', '1', '1', '1', '1', '1'  ) as x;" ), [ { "x": '1-1-1-1-1-1' } ]
  test_and_show ( SQL"select * from std_str_split_first( 'foo/bar/baz', '/' ) as x;" ), [ { prefix: 'foo', suffix: 'bar/baz' } ]
  test_and_show ( SQL"select * from std_generate_series( 1, 3, 1 ) as x;" ), [ { value: 1 }, { value: 2 }, { value: 3 } ]
  test_and_show ( SQL"select * from std_re_matches( 'abcdefghijklmnopqrstuvqxyz', '[aeiou](..)' ) as x;" ), [ { match: 'abc', capture: 'bc' }, { match: 'efg', capture: 'fg' }, { match: 'ijk', capture: 'jk' }, { match: 'opq', capture: 'pq' }, { match: 'uvq', capture: 'vq' } ]
  #.........................................................................................................
  done?()






############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }
  # @[ "DBAY stdlib functions" ]()







