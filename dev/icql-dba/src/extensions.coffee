

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/BASICS'
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
{ to_width }              = require 'to-width'




#-----------------------------------------------------------------------------------------------------------
@[ "load_extension" ] = ( T, done ) ->
  T.halt_on_error()
  { Dba }           = require '../../../apps/icql-dba'
  #---------------------------------------------------------------------------------------------------------
  do =>
    dba     = new Dba()
    cfg     = H.get_cfg()
    # dba.load_extension PATH.resolve PATH.join '/home/flow/jzr/hengist/dev/in-memory-sql/json1.so'
    # # dba.load_extension PATH.resolve PATH.join '/home/flow/3rd-party-repos/sqlite/ext/fts5/fts5'
    #.......................................................................................................
    info '^334-1^', dba.list dba.query """select json(' { "this" : "is", "a": [ "test" ] } ') as d;"""
    info '^334-1^', dba.list dba.query """select json_array(1,2,'3',4) as d;"""
    return null
  #---------------------------------------------------------------------------------------------------------
  done()
  return null



############################################################################################################
unless module.parent?
  # test @
  test @[ "load_extension" ]

