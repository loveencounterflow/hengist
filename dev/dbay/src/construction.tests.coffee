
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
@[ "DBAY constructor arguments 1" ] = ( T, done ) ->
  { Dbay }           = require H.dbay_path
  class Dbay2 extends Dbay
    @_rnd_int_cfg: true
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
        result = { ( new Dbay2 probe ).cfg..., }
        for k of result
          delete result[ k ] unless k in [ 'ram', 'path', 'dbnick', 'url', ]
        # resolve result
        resolve result
      return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY: _get_connection_url()" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Dbay }               = require H.dbay_path
  #.........................................................................................................
  class Dbay2 extends Dbay
    @_rnd_int_cfg: true
  #.........................................................................................................
  db = new Dbay2 { ram: null, }
  # T?.eq db._get_connection_url(), { url: 'file:_icql_6200294332?mode=memory&cache=shared', dbnick: '_icql_6200294332' }
  # T?.eq db._get_connection_url(), { url: 'file:_icql_4260041910?mode=memory&cache=shared', dbnick: '_icql_4260041910' }
  # T?.eq db._get_connection_url(), { url: 'file:_icql_9982321802?mode=memory&cache=shared', dbnick: '_icql_9982321802' }
  # T?.eq db._get_connection_url(), { url: 'file:_icql_2420402559?mode=memory&cache=shared', dbnick: '_icql_2420402559' }
  # T?.eq db._get_connection_url(), { url: 'file:_icql_1965667491?mode=memory&cache=shared', dbnick: '_icql_1965667491' }
  # T?.eq ( db._get_connection_url 'yournamehere' ), { url: 'file:yournamehere?mode=memory&cache=shared', dbnick: 'yournamehere' }
  # #.........................................................................................................
  # info db._get_connection_url()
  # info db._get_connection_url 'yournamehere'
  done?()



############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "DBAY constructor arguments 1" ]
  # test @[ "DBAY: _get_connection_url()" ]
