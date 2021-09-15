
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
  { work_path: db_path, } = await H.procure_db { size: 'small', ref: 'ctor-1', }
  info '^3443^', { db_path, }
  #.........................................................................................................
  probes_and_matchers = [
    #-------------------------------------------------------------------------------------------------------
    [ { ram: false,  path: null,      dbnick: null,     }, null, "missing argument `path`",              ] ### 5  ###
    [ { ram: false,  path: null,      dbnick: 'dbnick', }, null, "missing argument `path`",              ] ### 6  ###
    [ { ram: null,   path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 4  ###
    [ { ram: false,  path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 8  ###
    #.......................................................................................................
    [ { ram: null,   path: null,      dbnick: null,     }, { ram: true,                   dbnick: '_6200294332',  url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 1  ###
    [ { ram: null,   path: null,      dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',       url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 2  ###
    [ { ram: null,   path: db_path,   dbnick: null      }, { ram: false, path: db_path,                                          }, null, ] ### 3  ###
    [ { ram: false,  path: db_path,   dbnick: null,     }, { ram: false, path: db_path,                                          }, null, ] ### 7  ###
    [ { ram: true,   path: null,      dbnick: null,     }, { ram: true,                   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 9  ###
    [ { ram: true,   path: null,      dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 10 ###
    [ { ram: true,   path: db_path,   dbnick: null,     }, { ram: true,  path: db_path,   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 11 ###
    [ { ram: true,   path: db_path,   dbnick: 'dbnick', }, { ram: true,  path: db_path,   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 12 ###
    #-------------------------------------------------------------------------------------------------------
    null
    [ { ram: false,     path: undefined, dbnick: undefined,}, null, "missing argument `path`",              ] ### 5  ###
    [ { ram: false,     path: undefined, dbnick: 'dbnick', }, null, "missing argument `path`",              ] ### 6  ###
    [ { ram: undefined, path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 4  ###
    [ { ram: false,     path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 8  ###
    #.......................................................................................................
    [ { ram: undefined, path: undefined, dbnick: undefined,}, { ram: true,                   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 1  ###
    [ { ram: undefined, path: undefined, dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 2  ###
    [ { ram: undefined, path: db_path,   dbnick: undefined }, { ram: false, path: db_path,                                          }, null, ] ### 3  ###
    [ { ram: false,     path: db_path,   dbnick: undefined,}, { ram: false, path: db_path,                                          }, null, ] ### 7  ###
    [ { ram: true,      path: undefined, dbnick: undefined,}, { ram: true,                   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 9  ###
    [ { ram: true,      path: undefined, dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 10 ###
    [ { ram: true,      path: db_path,   dbnick: undefined,}, { ram: true,  path: db_path,   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 11 ###
    [ { ram: true,      path: db_path,   dbnick: 'dbnick', }, { ram: true,  path: db_path,   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 12 ###
    #-------------------------------------------------------------------------------------------------------
    null
    [ { ram: false,                                        }, null, "missing argument `path`",              ] ### 5  ###
    [ { ram: false,                      dbnick: 'dbnick', }, null, "missing argument `path`",              ] ### 6  ###
    [ {                 path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 4  ###
    [ { ram: false,     path: db_path,   dbnick: 'dbnick', }, null, "only RAM DB can have both `path` and `dbnick`", ] ### 8  ###
    #.......................................................................................................
    [ null,                                                   { ram: true,                   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 1  ###
    [ {                                  dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 2  ###
    [ {                 path: db_path,                     }, { ram: false, path: db_path,                                          }, null, ] ### 3  ###
    [ { ram: false,     path: db_path,                     }, { ram: false, path: db_path,                                          }, null, ] ### 7  ###
    [ { ram: true,                                         }, { ram: true,                   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 9  ###
    [ { ram: true,                       dbnick: 'dbnick', }, { ram: true,                   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 10 ###
    [ { ram: true,      path: db_path,                     }, { ram: true,  path: db_path,   dbnick: '_6200294332', url: 'file:_6200294332?mode=memory&cache=shared', }, null, ] ### 11 ###
    [ { ram: true,      path: db_path,   dbnick: 'dbnick', }, { ram: true,  path: db_path,   dbnick: 'dbnick',      url: 'file:dbnick?mode=memory&cache=shared', }, null, ] ### 12 ###
    ]
  #.........................................................................................................
  for x in probes_and_matchers
    if x is null
      whisper '-'.repeat 108
      continue
    [ probe, matcher, error, ] = x
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
  # T?.eq db._get_connection_url(), { url: 'file:_6200294332?mode=memory&cache=shared', dbnick: '_6200294332' }
  # T?.eq db._get_connection_url(), { url: 'file:_4260041910?mode=memory&cache=shared', dbnick: '_4260041910' }
  # T?.eq db._get_connection_url(), { url: 'file:_9982321802?mode=memory&cache=shared', dbnick: '_9982321802' }
  # T?.eq db._get_connection_url(), { url: 'file:_2420402559?mode=memory&cache=shared', dbnick: '_2420402559' }
  # T?.eq db._get_connection_url(), { url: 'file:_1965667491?mode=memory&cache=shared', dbnick: '_1965667491' }
  # T?.eq ( db._get_connection_url 'yournamehere' ), { url: 'file:yournamehere?mode=memory&cache=shared', dbnick: 'yournamehere' }
  # #.........................................................................................................
  # info db._get_connection_url()
  # info db._get_connection_url 'yournamehere'
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "DBAY instance has two connections" ] = ( T, done ) ->
  { Dbay }        = require H.dbay_path
  Sqlt            = require PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  bsqlite_class   = Sqlt().constructor
  dbay = new Dbay()
  T?.ok dbay.sqlt1.constructor is bsqlite_class
  T?.ok dbay.sqlt2.constructor is bsqlite_class
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @[ "DBAY attach memory connections" ] = ( T, done ) ->
#   ### thx to https://github.com/JoshuaWise/better-sqlite3/issues/102#issuecomment-445606946 ###
#   # bsqlite_path    = PATH.resolve PATH.join H.dbay_path, 'node_modules/better-sqlite3'
#   bsqlite_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3'
#   wrapper_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/lib/methods/wrappers.js'
#   bindings_path   = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/bindings'
#   node_path_1     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
#   node_path_2     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/obj.target/better_sqlite3.node'
#   # bsqlite_path    = require.resolve 'better-sqlite3'
#   debug '^2233^', "path to better-sqlite3:", bsqlite_path
#   Sqlt            = require bsqlite_path
#   sqlt            = Sqlt ':memory:'
#   # wrapper         = require wrapper_path
#   debug '^290-1^', ( k for k of sqlt._wrappers )
#   # debug '^290-2^', sqlt._wrappers.getters.open
#   # debug '^290-3^', sqlt._wrappers.unsafeMode()
#   # debug '^290-3^', sqlt._wrappers.exec()
#   debug '^290-3^', sqlt._wrappers.get_cppdb()
#   # { Database: CPPDatabase, setErrorConstructor, }
#   debug '^490^', bindings = require bindings_path
#   debug '^490^', node_path_1
#   debug '^490^', node_path_2
#   debug '^490^', { Database: Db1, } = require node_path_1
#   debug '^490^', { Database: Db2, } = require node_path_2
#   # new CPPDatabase(filename, filenameGiven, anonymous, readonly, fileMustExist, timeout, verbose || null, buffer || null)
#   debug '^490^', db1 = new Db1 ':memory:', ':memory:', true, false, false, 5000, null, null
#   debug '^490^', db1a = new Db1 'file:your_db_name_here?mode=memory&cache=shared', 'file:your_db_name_here?mode=memory&cache=shared', true, false, false, 5000, null, null
#   debug '^490^', db1b = new Db1 'file:your_db_name_here?mode=memory&cache=shared', 'file:your_db_name_here?mode=memory&cache=shared', true, false, false, 5000, null, null
#   db1a.exec SQL"create table x ( n text );"
#   db1b.exec SQL"insert into x ( n ) values ( 'helo world' );"
#   select = db1b.prepare SQL"select * from x;", {}, false
#   debug '^340^', select.run()
#   for row from select.iterate()
#     info row
#   # debug '^490^', bindings node_path_1
#   # debug '^490^', bindings node_path_2
#   #---------------------------------------------------------------------------------------------------------
#   return done?()
#   # debug db = Sqlt ':memory:'
#   { template_path
#     work_path }     = await H.procure_db { size: 'small', ref: 'F-open', reuse: true, }
#   name_as_url = ( name ) ->
#     # This function is defined here: https://www.sqlite.org/uri.html#the_uri_path
#     name_u = name
#     name_u = name_u.replace /#/g, '%23'
#     name_u = name_u.replace /\?/g, '%3f'
#     name_u = name_u.replace /\/\/+/g, '/'
#     return "file:#{name_u}?mode=memory&cache=shared';"
#   foo_path  = work_path
#   db_foo    = Sqlt foo_path
#   debug '^554^', db_foo
#   debug '^554^', foo_path
#   db_bar    = Sqlt ':memory:' # , { memory: true }
#   url       = name_as_url 'bar'
#   debug '^3344^', { url, }
#   attach    = db_foo.prepare SQL"attach database $url as bar"
#   attach.run { url, }
#   done?()


#-----------------------------------------------------------------------------------------------------------
@[ "DBAY attach memory connections" ] = ( T, done ) ->
  ### TAINT consider to use `bindings` module to automate finding the `better-sqlite3.node` file ###
  # bsqlite_path    = PATH.resolve PATH.join H.dbay_path, 'node_modules/better-sqlite3'
  # bsqlite_path    = require.resolve 'better-sqlite3'
  # bsqlite_path    = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3'
  # debug '^2233^', "path to better-sqlite3:", bsqlite_path
  ### NOTE files at node_path_1, node_path_2 identical (?) ###
  node_path_1     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/better_sqlite3.node'
  # node_path_2     = PATH.resolve PATH.join __dirname, '../../../apps/icql-dba/node_modules/better-sqlite3/build/Release/obj.target/better_sqlite3.node'
  debug '^490^', { Database: Db1, } = require node_path_1
  # debug '^490^', bindings node_path_1
  # new CPPDatabase(
  #---------------------------------------------------------------------------------------------------------
  new_connection = ( path_or_url ) ->
    cfg =
      filename:       path_or_url
      filenameGiven:  path_or_url
      anonymous:      true        ### ??? ###
      readonly:       false
      fileMustExist:  false
      timeout:        5000
      verbose:        null
      buffer:         null
    return new Db1 cfg.filename, cfg.filenameGiven, cfg.anonymous, cfg.readonly, \
      cfg.fileMustExist, cfg.timeout, cfg.verbose, cfg.buffer
  #---------------------------------------------------------------------------------------------------------
  debug '^490^', sqlt1 = new_connection 'file:your_db_name_here?mode=memory&cache=shared'
  debug '^490^', sqlt2 = new_connection 'file:your_db_name_here?mode=memory&cache=shared'
  sqlt1.exec SQL"create table x ( n text );"
  sqlt2.exec SQL"insert into x ( n ) values ( 'helo world' );"
  select = sqlt2.prepare SQL"select * from x;", {}, false
  debug '^340^', select.run()
  for row from select.iterate()
    info row
  #---------------------------------------------------------------------------------------------------------
  return done?()



############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "DBAY attach memory connections" ]
  @[ "DBAY attach memory connections" ]()
  # test @[ "DBAY constructor arguments 1" ]
  # test @[ "DBAY: _get_connection_url()" ]
  # test @[ "DBAY instance has two connections" ]


