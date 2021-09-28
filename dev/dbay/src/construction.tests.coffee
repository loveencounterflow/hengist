
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
@[ "DBAY _get-autolocation" ] = ( T, done ) ->
  { Dbay }            = require H.dbay_path
  H                   = require PATH.join H.dbay_path, 'lib/helpers'
  T?.eq ( H.is_directory '/tmp'                                              ), true
  T?.eq ( H.is_directory '/nonexistant-path-395827345826345762347856374562'  ), false
  T?.eq ( H.is_directory __filename                                          ), false
  T?.eq ( H.is_directory __dirname                                           ), true
  T?.ok H.autolocation in [ '/dev/shm', ( require 'os' ).tmpdir(), ]
  T?.eq Dbay.C.autolocation, H.autolocation
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY constructor arguments 1" ] = ( T, done ) ->
  { Dbay }           = require H.dbay_path
  resolved_path      = PATH.resolve process.cwd(), 'mypath'
  class Dbay2 extends Dbay
    @_skip_sqlt:    true
    @_rnd_int_cfg:  true
  #.........................................................................................................
  # { work_path: db_path, } = await H.procure_db { size: 'small', ref: 'ctor-1', }
  # info '^3443^', { db_path, }
  #.........................................................................................................
  probes_and_matchers = [
    #-------------------------------------------------------------------------------------------------------
    null
    # [ { location: null, path: null, name: null, }, null, null,              ]
    # [ { location: 'mylocation', path: null, name: 'myname', temporary: false, }, null, null,              ]
    # [ { location: 'mylocation', path: null, name: 'myname', temporary: true, }, null, "cannot have `temporary: true` together with `path` or `name`",              ]
    # [ { location: null, path: null, name: 'myname', temporary: true, }, null, "cannot have `temporary: true` together with `path` or `name`",              ]
    [ { path: null,            temporary: null, }, { path: '/dev/shm/dbay-6200294332.sqlite', temporary: true }, null,              ]
    [ { path: null,            temporary: false, }, { path: '/dev/shm/dbay-6200294332.sqlite', temporary: false }, null,              ]
    [ { path: 'mypath/myname', temporary: null, }, { path: '/home/flow/jzr/dbay/mypath/myname', temporary: false }, null,              ]
    [ { path: 'mypath/myname', temporary: true, }, { path: '/home/flow/jzr/dbay/mypath/myname', temporary: true }, null,              ]
    ]
  #.........................................................................................................
  for x in probes_and_matchers
    if x is null
      whisper '-'.repeat 108
      continue
    [ probe, matcher, error, ] = x
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      do =>
        result  = { ( new Dbay2 probe ).cfg..., }
        for k of result
          delete result[ k ] unless k in [ 'path', 'tempory', ]
        #...................................................................................................
        resolve matcher
      return null
  #.........................................................................................................
  done?()


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance has two connections" ] = ( T, done ) ->
  { Dbay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  bsqlite_class   = Sqlt().constructor
  db              = new Dbay()
  # debug '^332^', db
  # debug '^332^', db.cfg
  T?.eq db.sqlt1.name, db.sqlt2.name
  T?.ok db.sqlt1.constructor is bsqlite_class
  T?.ok db.sqlt2.constructor is bsqlite_class
  T?.ok db.sqlt2.constructor is db.sqlt1.constructor
  T?.ok db.sqlt2 isnt db.sqlt1
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance non-enumerable properties" ] = ( T, done ) ->
  { Dbay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  db              = new Dbay()
  debug '^332^', db
  T?.eq ( Object.getOwnPropertyDescriptor db, 'sqlt1'     ).enumerable, false
  T?.eq ( Object.getOwnPropertyDescriptor db, 'sqlt2'     ).enumerable, false
  T?.eq ( Object.getOwnPropertyDescriptor db, '_rnd_int'  ).enumerable, false
  # debug '^332^', db.cfg
  done?()





############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DBAY attach memory connections" ]
  # @[ "DBAY attach memory connections" ]()
  test @[ "DBAY constructor arguments 1" ]
  # test @[ "DBAY _get-autolocation" ]
  # test @[ "DBAY instance non-enumerable properties" ]
  # test @[ "DBAY: _get_connection_url()" ]
  # test @[ "DBAY instance has two connections" ]

