
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/FUNCTIONS'
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
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse




#-----------------------------------------------------------------------------------------------------------
@[ "DBA: get_foreign_keys_deferred() etc" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  list_table_a      = ( dba ) -> ( row.n for row from dba.query SQL"select n from a;" )
  #.........................................................................................................
  error             = null
  dba               = new Dba()
  # dba.open { schema: 'main', }
  dba.execute SQL"""
    create table a ( n integer not null primary key references b ( n ) );
    create table b ( n integer not null primary key references a ( n ) deferrable initially deferred );
    """
  #.........................................................................................................
  try
    dba.with_transaction ->
      dba.execute SQL"insert into b ( n ) values ( 100 );"
      dba.execute SQL"insert into a ( n ) values ( 100 );"
      # dba.execute SQL"insert into a ( n ) values ( 101 );"
  catch error
    warn error.message
  debug '^907^', dba.list dba.query SQL"select * from a;"
  debug '^907^', dba.list dba.query SQL"select * from b;"
  debug '^907^', dba.pragma "foreign_key_list( 'a' );"
  debug '^907^', dba.pragma "foreign_key_list( 'b' );"
  #.........................................................................................................
  T?.eq dba.get_foreign_keys_state(),    true
  T?.eq dba.get_foreign_keys_deferred(), false
  T?.eq dba.get_unsafe_mode(),           false
  T?.eq dba.within_transaction(),        false
  T?.eq dba.get_unsafe_mode(),           false
  #.........................................................................................................
  dba.with_transaction -> T?.eq dba.within_transaction(), true
  T?.eq dba.within_transaction(),        false
  #.........................................................................................................
  dba.with_unsafe_mode -> T?.eq dba.get_unsafe_mode(), true
  T?.eq dba.get_unsafe_mode(),            false
  #.........................................................................................................
  dba.with_foreign_keys_deferred ->
    T?.eq dba.get_foreign_keys_deferred(),  true
    T?.eq dba.within_transaction(),         true
  T?.eq dba.get_foreign_keys_deferred(), false
  T?.eq dba.within_transaction(),        false
  #.........................................................................................................
  done?()



############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }

