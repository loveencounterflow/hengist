
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
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY _get-autolocation" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }            = require H.dbay_path
  DH                  = require PATH.join H.dbay_path, 'lib/helpers'
  T?.eq ( DH.is_directory '/tmp'                                              ), true
  T?.eq ( DH.is_directory '/nonexistant-path-395827345826345762347856374562'  ), false
  T?.eq ( DH.is_directory __filename                                          ), false
  T?.eq ( DH.is_directory __dirname                                           ), true
  T?.ok DH.autolocation in [ '/dev/shm', ( require 'os' ).tmpdir(), ]
  T?.eq DBay.C.autolocation, DH.autolocation
  return done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY constructor arguments 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay }            = require H.dbay_path
  resolved_path       = PATH.resolve process.cwd(), 'mypath'
  autolocation        = ( require '../../../apps/dbay/lib/helpers' ).autolocation
  join                = ( P... ) -> PATH.resolve PATH.join P...
  class DBay2 extends DBay
    @_skip_sqlt:    true
  #.........................................................................................................
  # { work_path: db_path, } = await H.procure_db { size: 'small', ref: 'ctor-1', }
  # info '^3443^', { db_path, }
  #.........................................................................................................
  relpath = 'mypath/myname'
  abspath = PATH.resolve process.cwd(), PATH.join relpath
  probes_and_matchers = [
    #-------------------------------------------------------------------------------------------------------
    null
    [ { random_seed: 1, random_delta: 1,  temporary: null   }, { path: ( join autolocation, 'dbay-7388632709.sqlite' ),   temporary: true  }, null ]
    [ { random_seed: 1, random_delta: 1,  temporary: false  }, { path: ( join autolocation, 'dbay-7388632709.sqlite' ),   temporary: false }, null ]
    [ { random_seed: 1, random_delta: 1,  temporary: true   }, { path: ( join autolocation, 'dbay-7388632709.sqlite' ),   temporary: true  }, null ]
    [ { path: relpath,                    temporary: null,  }, { path: abspath,                             temporary: false }, null ]
    [ { path: relpath,                    temporary: false, }, { path: abspath,                             temporary: false }, null ]
    [ { path: relpath,                    temporary: true,  }, { path: abspath,                             temporary: true  }, null ]
    ]
  #.........................................................................................................
  for x in probes_and_matchers
    if x is null
      whisper '-'.repeat 108
      continue
    [ probe, matcher, error, ] = x
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      db      = new DBay2 probe
      result  = { db.cfg..., }
      for k of result
        delete result[ k ] unless k in [ 'path', 'temporary', ]
      # debug '^657561^', result, matcher, equals result, matcher
      #...................................................................................................
      # debug '^341^', db
      # debug '^341^', db._dbs
      resolve result
  # for _ in [ 1 .. 3 ]
  #   do =>
  #     db = new DBay()
  #     whisper '---------------------'
  #     info '^345657^', db.rnd.get_random_filename()
  #     info '^345657^', db.rnd.get_random_filename()
  #     info '^345657^', db.rnd.get_random_filename()
  #     info '^345657^', db.rnd.get_random_filename()
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance has two connections" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  bsqlite_class   = Sqlt().constructor
  db              = new DBay()
  # debug '^332^', db
  # debug '^332^', db.cfg
  #.........................................................................................................
  info '^908-1^', equals db.sqlt1.name, db.sqlt2.name
  info '^908-2^', db.sqlt1.constructor is bsqlite_class
  info '^908-3^', db.sqlt2.constructor is bsqlite_class
  info '^908-4^', db.sqlt2.constructor is db.sqlt1.constructor
  info '^908-5^', db.sqlt2 isnt db.sqlt1
  #.........................................................................................................
  T?.eq db.sqlt1.name, db.sqlt2.name
  T?.ok db.sqlt1.constructor is bsqlite_class
  T?.ok db.sqlt2.constructor is bsqlite_class
  T?.ok db.sqlt2.constructor is db.sqlt1.constructor
  T?.ok db.sqlt2 isnt db.sqlt1
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance has property `alt` (alternative connection)" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  bsqlite_class   = Sqlt().constructor
  db              = new DBay()
  #.........................................................................................................
  # db.open { schema: 'main', }
  db.execute SQL"""
    create table foo ( n integer );
    create table bar ( n integer );"""
  for n in [ 10 .. 12 ]
    db SQL"insert into foo ( n ) values ( $n );", { n, }
  #.........................................................................................................
  do =>
    help '^806-1^ ------------------------'
    error = null
    try
      db.with_transaction =>
        for row from db SQL"select * from foo order by n;"
          info '^806-2^', row
          db SQL"insert into bar values ( $n );", { n: n ** 2, }
        return null
    catch error
      warn error.name, error.message
    T?.fail "^806-3^ expected error, got none" unless error?
  #.........................................................................................................
  ### Whether statements are prepared in- or outside of the transaction doesn't matter: ###
  do =>
    help '^806-4^ ------------------------'
    insert_into_bar = db.prepare SQL"insert into bar values ( $n ) returning *;"
    db.with_transaction =>
      for { n, } from ( db.sqlt2.prepare SQL"select * from foo order by n;" ).iterate()
        info '^806-5^', { n, }
        urge '^806-6^', insert_into_bar.get { n: n ** 2, }
      return null
  #.........................................................................................................
  do =>
    help '^806-7^ ------------------------'
    db.with_transaction =>
      for { n, } from ( db.sqlt2.prepare SQL"select * from foo order by n;" ).iterate()
        info '^806-8^', { n, }
        urge '^806-9^', db.first_row SQL"insert into bar values ( $n ) returning *;", { n: n ** 2, }
      return null
  #.........................................................................................................
  do =>
    help '^806-10^ ------------------------'
    insert_into_bar = db.prepare SQL"insert into bar values ( $n ) returning *;"
    db.with_transaction =>
      for { n, } from db.alt SQL"select * from foo order by n;"
        #             ^^^^^^
        info '^806-12^', { n, }
        urge '^806-13^', db.first_row SQL"insert into bar values ( $n ) returning *;", { n: n ** 2, }
      return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance non-enumerable properties" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  db              = new DBay()
  debug '^332^', db
  T?.eq ( Object.getOwnPropertyDescriptor db, 'sqlt1'     ).enumerable, false
  T?.eq ( Object.getOwnPropertyDescriptor db, 'sqlt2'     ).enumerable, false
  T?.eq ( Object.getOwnPropertyDescriptor db, 'rnd'       ).enumerable, false
  # debug '^332^', db.cfg
  done?()





############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DBAY _get-autolocation" ]
  # test @[ "DBAY constructor arguments 1" ]
  @[ "DBAY instance has property `alt` (alternative connection)" ]()
  # test @[ "DBAY URL/path conversion" ]
  # test @[ "xxx" ]
  # test @[ "DBAY instance has two connections" ]
  # test @[ "DBAY instance non-enumerable properties" ]
