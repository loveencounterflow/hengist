
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/CONSTRUCTION'
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
{ Dba }                   = require H.icql_dba_path
E                         = require H.icql_dba_path + '/lib/errors'
class _Xxx_dbax extends Dba
  @_rnd_int_cfg: true
_xxx_dba                  = new _Xxx_dbax()

types.declare 'dba_urlsafe_word', tests:
  "@isa.nonempty_text x":                 ( x ) -> @isa.nonempty_text x
  "/^[a-zA-Z0-9_]+$/.test x":             ( x ) -> /^[a-zA-Z0-9_]+$/.test x
types.declare 'constructor_cfg', tests:
  "@isa.object x":                                        ( x ) -> @isa.object x
  "( not x.ram? ) or @isa.boolean x.ram":                 ( x ) -> ( not x.ram? ) or @isa.boolean x.ram
  "( not x.url? ) or @isa.nonempty_text x.url":           ( x ) -> ( not x.url? ) or @isa.nonempty_text x.url
  "( not x.dbnick? ) or @isa.dba_urlsafe_word x.dbnick":  ( x ) -> ( not x.dbnick? ) or @isa.dba_urlsafe_word x.dbnick

class Dbax # extends Dba

  #---------------------------------------------------------------------------------------------------------
  @C: guy.lft.freeze
    function_flags:
      is_deterministic:   0x000000800 # SQLITE_DETERMINISTIC
      is_directonly:      0x000080000 # SQLITE_DIRECTONLY
      is_subtype:         0x000100000 # SQLITE_SUBTYPE
      is_innocuous:       0x000200000 # SQLITE_INNOCUOUS
    defaults:
      constructor_cfg:
        _temp_prefix: '_dba_temp_'
        readonly:     false
        create:       true
        overwrite:    false
        timeout:      5000
        #...................................................................................................
        ram:        false
        path:       null
        dbnick:     null

  #---------------------------------------------------------------------------------------------------------
  @cast_constructor_cfg: ( self ) ->
    if ( self.cfg.ram is false ) and ( not self.cfg.path? )
      throw new E.Dba_cfg_error '^dba@1^', "missing argument `path`, got #{rpr self.cfg}"
    self.cfg.ram ?= not self.cfg.path?
    if ( not self.cfg.ram ) and self.cfg.path? and self.cfg.dbnick?
      throw new E.Dba_cfg_error '^dba@1^', "only RAM DB can have both `path` and `dbnick`, got #{rpr self.cfg}"
    if self.cfg.ram
      ### TAINT rename `name` to `dbnick` ###
      { name, url, }    = _xxx_dba._get_connection_url self.cfg.dbnick ? null
      self.cfg.dbnick   = name if ( not self.cfg.dbnick? ) and ( not self.cfg.path? )
      self.cfg.url      = url
    self.cfg.url ?= null
    return self.cfg

  #---------------------------------------------------------------------------------------------------------
  @declare_types: ( self ) ->
    # debug '^133^', self.cfg, Object.isFrozen self.cfg
    self.cfg = @cast_constructor_cfg self
    self.types.validate.constructor_cfg self.cfg
    # guy.props.def self, 'dba', { enumerable: false, value: self.cfg.dba, }
    return null

  #---------------------------------------------------------------------------------------------------------
  constructor: ( cfg ) ->
    # super()
    guy.cfg.configure_with_types @, cfg, types
    # @_compile_sql()
    # @_create_sql_functions()
    # @_create_db_structure()
    return undefined


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
    [ { ram: true,   path: 'db/path', dbnick: null,     }, { ram: true,  path: 'db/path', dbnick: '_icql_4260041910', url: 'file:_icql_9982321802?mode=memory&cache=shared', }, null, ] ### 11 ###
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



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "HLR encode Infinity" ]
