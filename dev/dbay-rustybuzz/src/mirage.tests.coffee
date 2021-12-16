
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-MIRAGE'
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
@[ "location marker matching" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Mrg } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  #.........................................................................................................
  probes_and_matchers = [
    [ '<mrg:loc#first/>',         [ { id: 'first' } ], null ]
    [ '<mrg:loc#foo-bar-123/>',   [ { id: 'foo-bar-123' } ], null ]
    [ '<mrg:loc# foo-bar-123/>',  [], null ]
    [ '<MRG:loc#foo-bar-123/>',   [], null ]
    [ '<mrg:loc#first />',        [], null ]
    [ '<mrg:loc id="first"/>',    [], null ]
    [ '<mrg:loc#first>',          [], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_pattern )
      resolve result
      return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "mrg.refresh_datasource" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
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
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "loc markers 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  mrg.register_dsk { dsk, path, }
  info '^33298-1^', mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  console.table db.all_rows SQL"select * from mrg_locs   order by dsk, locid;"
  T?.eq ( db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;" ), [
    { dsk: 'twcm', lnr: 1, lnpart: 1, isloc: 0, line: '<title>' },
    { dsk: 'twcm', lnr: 1, lnpart: 2, isloc: 1, line: '<mrg:loc#title/>' },
    { dsk: 'twcm', lnr: 1, lnpart: 3, isloc: 0, line: '</title>' },
    { dsk: 'twcm', lnr: 2, lnpart: 1, isloc: 0, line: '<article>' },
    { dsk: 'twcm', lnr: 3, lnpart: 1, isloc: 0, line: '  <p>Here comes some ' },
    { dsk: 'twcm', lnr: 3, lnpart: 2, isloc: 1, line: '<mrg:loc#content/>' },
    { dsk: 'twcm', lnr: 3, lnpart: 3, isloc: 0, line: '.</p>' },
    { dsk: 'twcm', lnr: 4, lnpart: 1, isloc: 0, line: '  </article>' },
    { dsk: 'twcm', lnr: 5, lnpart: 1, isloc: 0, line: '' } ]
  T?.eq ( db.all_rows SQL"select * from mrg_locs   order by dsk, locid;" ), [
    { dsk: 'twcm', locid: 'content', lnr: 3, lnpart: 2 },
    { dsk: 'twcm', locid: 'title', lnr: 1, lnpart: 2 } ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "loc markers 2" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  mrg.register_dsk { dsk, path, }
  info '^33298-2^', mrg.refresh_datasource { dsk, }
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  info '^33298-3^', mrg.append_to_loc { dsk, locid: 'title', text: "A Grand Union" }
  # info '^33298-4^', mrg.prepend_to_loc { dsk, locid: 'content', text: "content goes here" }
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  #.........................................................................................................
  for row from mrg.walk_line_rows { dsk, }
    urge '^587^', row
  console.table [ ( mrg.walk_line_rows { dsk, } )..., ]
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "mrg.refresh_datasource" ]
  # test @[ "loc markers 1" ]
  @[ "loc markers 2" ]()

