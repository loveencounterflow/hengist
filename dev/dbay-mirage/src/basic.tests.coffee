
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE/BASICS'
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
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'



#-----------------------------------------------------------------------------------------------------------
@[ "mrg.refresh_datasource" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'sp'
  path      = 'short-proposal.mkts.md'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  mrg.register_dsk { dsk, path, }
  #.........................................................................................................
  do =>
    result  = mrg.refresh_datasource { dsk, }
    debug '^44498^', result
    T?.eq result, { files: 1, bytes: 384 }
  #.........................................................................................................
  do =>
    result  = mrg.refresh_datasource { dsk, }
    debug '^44498^', result
    T?.eq result, { files: 0, bytes: 0 }
  #.........................................................................................................
  do =>
    mrg._update_digest dsk, null
    result  = mrg.refresh_datasource { dsk, }
    debug '^44498^', result
    T?.eq result, { files: 1, bytes: 384 }
  #.........................................................................................................
  do =>
    result  = mrg.refresh_datasource { dsk, force: true, }
    debug '^44498^', result
    T?.eq result, { files: 1, bytes: 384 }
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "altering mirrored source lines causes error" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage'
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  rows_before = db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  #.........................................................................................................
  do =>
    error = null
    try
      db SQL"""insert into mrg_mirror
        ( dsk, lnr, lnpart, xtra, locid, line )
        values ( $dsk, $lnr, $lnpart, $xtra, $locid, $line )""", {
          dsk:      dsk,
          lnr:      10,
          lnpart:   0,
          xtra:     0,
          locid:    null,
          line:     "some text", }
    catch error
      warn CND.reverse error.message
      T?.ok ( /not allowed to modify table mrg_mirror/ ).test error.message
    T?.ok error?
  #.........................................................................................................
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  rows_after = db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  T?.eq rows_before, rows_after
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "URL/path conversion" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require '../../../apps/dbay'
  { Mrg   } = require '../../../apps/dbay-mirage/lib/main2'
  db        = new DBay()
  mrg       = new Mrg { db, }
  probes_and_matchers = [
    [ '/foo.txt', [ 'file:///foo.txt', '/foo.txt' ], null ]
    [ '/foo.txt', [ 'file:///foo.txt', '/foo.txt' ], null ]
    [ '/some weird path.jpg', [ 'file:///some%20weird%20path.jpg', '/some weird path.jpg' ], null ]
    [ '/some weird path.jpg#oops', [ 'file:///some%20weird%20path.jpg%23oops', '/some weird path.jpg#oops' ], null ]
    [ '/path/with/folders/to/file.txt', [ 'file:///path/with/folders/to/file.txt', '/path/with/folders/to/file.txt' ], null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      url    = mrg._url_from_path probe
      path   = mrg._path_from_url url
      # urge { probe, url, path, }
      resolve [ url, path, ]
  return done?()


############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "altering mirrored source lines causes error" ]
  # @[ "altering mirrored source lines causes error" ]()
  test @[ "URL/path conversion" ]
