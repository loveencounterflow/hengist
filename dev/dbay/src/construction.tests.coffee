
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/TESTS/CONSTRUCTION'
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
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
@[ "DBA constructor arguments 1" ] = ( T, done ) ->
  { Dba }           = require H.icql_dba_path
  #.........................................................................................................
  probes_and_matchers = [
    [ { ram: false,  path: null,      dbnick: null,     }, null, "missing argument `path`",              ] ### 5  ###
    [ { ram: false,  path: null,      dbnick: 'dbnick', }, null, "missing argument `path`",              ] ### 6  ###
    [ { ram: null,   path: 'db/path', dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 4  ###
    [ { ram: false,  path: 'db/path', dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 8  ###
    #.......................................................................................................
    [ { ram: null,   path: null,      dbnick: null,     }, { ram: true,  path: null,      dbnick: '_icql_6200294332', url: 'file:_icql_6200294332?mode=memory&cache=shared', }, null, ] ### 1  ###
    [ { ram: null,   path: null,      dbnick: 'dbnick', }, { ram: true,  path: null,      dbnick: 'dbnick',           url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 2  ###
    [ { ram: null,   path: 'db/path', dbnick: null      }, { ram: false, path: 'db/path', dbnick: null,               url: null, }, null, ] ### 3  ###
    [ { ram: false,  path: 'db/path', dbnick: null,     }, { ram: false, path: 'db/path', dbnick: null,               url: null, }, null, ] ### 7  ###
    [ { ram: true,   path: null,      dbnick: null,     }, { ram: true,  path: null,      dbnick: '_icql_4260041910', url: 'file:_icql_4260041910?mode=memory&cache=shared', }, null, ] ### 9  ###
    [ { ram: true,   path: null,      dbnick: 'dbnick', }, { ram: true,  path: null,      dbnick: 'dbnick',           url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 10 ###
    [ { ram: true,   path: 'db/path', dbnick: null,     }, { ram: true,  path: 'db/path', dbnick: '_icql_9982321802', url: 'file:_icql_9982321802?mode=memory&cache=shared', }, null, ] ### 11 ###
    [ { ram: true,   path: 'db/path', dbnick: 'dbnick', }, { ram: true,  path: 'db/path', dbnick: 'dbnick',           url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 12 ###
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      do =>
        result = { ( new Dbax probe ).cfg..., }
        for k of result
          delete result[ k ] unless k in [ 'ram', 'path', 'dbnick', 'url', ]
        # resolve result
        resolve result
      return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: _get_connection_url()" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dba }               = require H.icql_dba_path
  #.........................................................................................................
  class Dbax extends Dba
    @_rnd_int_cfg: true
  #.........................................................................................................
  dba = new Dbax()
  T?.eq dba._get_connection_url(), { url: 'file:_icql_6200294332?mode=memory&cache=shared', dbnick: '_icql_6200294332' }
  T?.eq dba._get_connection_url(), { url: 'file:_icql_4260041910?mode=memory&cache=shared', dbnick: '_icql_4260041910' }
  T?.eq dba._get_connection_url(), { url: 'file:_icql_9982321802?mode=memory&cache=shared', dbnick: '_icql_9982321802' }
  T?.eq dba._get_connection_url(), { url: 'file:_icql_2420402559?mode=memory&cache=shared', dbnick: '_icql_2420402559' }
  T?.eq dba._get_connection_url(), { url: 'file:_icql_1965667491?mode=memory&cache=shared', dbnick: '_icql_1965667491' }
  T?.eq ( dba._get_connection_url 'yournamehere' ), { url: 'file:yournamehere?mode=memory&cache=shared', dbnick: 'yournamehere' }
  #.........................................................................................................
  info dba._get_connection_url()
  info dba._get_connection_url 'yournamehere'
  done?()



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "DBA: _get_connection_url()" ]
