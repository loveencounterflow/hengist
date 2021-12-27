
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



# #-----------------------------------------------------------------------------------------------------------
# @[ "location marker matching" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   { Mrg } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [ '<mrg:loc#first/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
#     [ '<mrg:loc#foo-bar-123/>',   [ [ '', '<mrg:loc#foo-bar-123/>', '' ], { locid: 'foo-bar-123'  }, ], ]
#     [ '<mrg:loc# foo-bar-123/>',  [ [ '<mrg:loc# foo-bar-123/>'        ], { locid: ' foo-bar-123' }, ], ]
#     [ '<MRG:loc#foo-bar-123/>',   [ [ '<MRG:loc#foo-bar-123/>'         ], { locid: 'foo-bar-123'  }, ], ]
#     [ '<mrg:loc#first />',        [ [ '<mrg:loc#first />'              ], { locid: 'first '       }, ], ]
#     [ '<mrg:loc id="first"/>',    [ [ '<mrg:loc id="first"/>'          ], null                     , ], ]
#     [ '<mrg:loc#first>',          [ [ '<mrg:loc#first>'                ], { locid: 'first>'       }, ], ]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       # result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_splitter )
#       result = [
#         ( probe.split Mrg.C.defaults.constructor_cfg.loc_splitter ),
#         ( ( probe.match Mrg.C.defaults.constructor_cfg.locid_re )?.groups ? null ) ]
#       resolve result
#       return null
#   #.........................................................................................................
#   done()
#   return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "___ extended location marker matching" ] = ( T, done ) ->
#   # T?.halt_on_error()
#   { Mrg } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
#   #.........................................................................................................
#   probes_and_matchers = [
#     [ '<mrg:loc.delete#title/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
#     [ '<mrg:loc#title.delete/>',         [ [ '', '<mrg:loc#first/>', ''       ], { locid: 'first'        }, ], ]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       # result = ( { d.groups..., } for d from probe.matchAll Mrg.C.defaults.constructor_cfg.loc_splitter )
#       result = [
#         ( probe.split Mrg.C.defaults.constructor_cfg.loc_splitter ),
#         ( ( probe.match Mrg.C.defaults.constructor_cfg.locid_re )?.groups ? null ) ]
#       naked_probe = probe[ 1 ... probe.length - 2 ]
#       debug '^545575^', INTERTEXT.HTML.parse_compact_tagname naked_probe
#       resolve result
#       return null
#   #.........................................................................................................
#   done()
#   return null

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
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "altering mirrored source lines causes error" ] = ( T, done ) ->
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
    { dsk: 'twcm', lnr: 1, lnpart: 0, xtra: 0, locid: null, line: '<title>' },
    { dsk: 'twcm', lnr: 1, lnpart: 1, xtra: 0, locid: 'title', line: '<mrg:loc.delete-marker#title/>' },
    { dsk: 'twcm', lnr: 1, lnpart: 2, xtra: 0, locid: null, line: '</title>' },
    { dsk: 'twcm', lnr: 2, lnpart: 0, xtra: 0, locid: null, line: '<article>' },
    { dsk: 'twcm', lnr: 3, lnpart: 0, xtra: 0, locid: null, line: '  <p>Here comes some ' },
    { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 0, locid: 'content', line: '<mrg:loc#content/>' },
    { dsk: 'twcm', lnr: 3, lnpart: 2, xtra: 0, locid: null, line: '.</p>' },
    { dsk: 'twcm', lnr: 4, lnpart: 0, xtra: 0, locid: null, line: '  </article>' },
    { dsk: 'twcm', lnr: 5, lnpart: 0, xtra: 0, locid: null, line: '' } ]
  T?.eq ( db.all_rows SQL"select * from mrg_locs order by dsk, locid;" ), [
    { dsk: 'twcm', locid: 'content', lnr: 3, lnpart: 1, props: null, del: 0, },
    { dsk: 'twcm', locid: 'title', lnr: 1, lnpart: 1, props: '["delete-marker"]', del: 1, } ]
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
  #.........................................................................................................
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  rows = db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  T?.eq rows[ 0 ], { dsk: 'twcm', lnr: 1, lnpart: 0, xtra: 0, locid: null, line: '<title>'               }
  T?.eq rows[ 1 ], { dsk: 'twcm', lnr: 1, lnpart: 1, xtra: 0, locid: 'title', line: '<mrg:loc.delete-marker#title/>'      }
  T?.eq rows[ 2 ], { dsk: 'twcm', lnr: 1, lnpart: 2, xtra: 0, locid: null, line: '</title>'              }
  T?.eq rows[ 3 ], { dsk: 'twcm', lnr: 2, lnpart: 0, xtra: 0, locid: null, line: '<article>'             }
  T?.eq rows[ 4 ], { dsk: 'twcm', lnr: 3, lnpart: 0, xtra: 0, locid: null, line: '  <p>Here comes some ' }
  T?.eq rows[ 5 ], { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 0, locid: 'content', line: '<mrg:loc#content/>'    }
  T?.eq rows[ 6 ], { dsk: 'twcm', lnr: 3, lnpart: 2, xtra: 0, locid: null, line: '.</p>'                 }
  T?.eq rows[ 7 ], { dsk: 'twcm', lnr: 4, lnpart: 0, xtra: 0, locid: null, line: '  </article>'          }
  T?.eq rows[ 8 ], { dsk: 'twcm', lnr: 5, lnpart: 0, xtra: 0, locid: null, line: ''                      }
  T?.eq ( mrg.append_to_loc { dsk, locid: 'title',  text: "A Grand Union" } ), { dsk: 'twcm', lnr: 1, lnpart: 1, xtra: 1, locid: null, line: 'A Grand Union' }
  T?.eq ( mrg.append_to_loc { dsk, locid: 'content', text: "more "        } ), { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 1, locid: null, line: 'more ' }
  T?.eq ( mrg.append_to_loc { dsk, locid: 'content', text: "content"      } ), { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 2, locid: null, line: 'content' }
  # info '^33298-4^', mrg.prepend_to_loc { dsk, locid: 'content', text: "content goes here" }
  console.table db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  rows = db.all_rows SQL"select * from mrg_mirror order by dsk, lnr, lnpart;"
  T?.eq rows[ 0  ], { dsk: 'twcm', lnr: 1, lnpart: 0, xtra: 0, locid: null, line: '<title>'               }
  T?.eq rows[ 1  ], { dsk: 'twcm', lnr: 1, lnpart: 1, xtra: 0, locid: 'title', line: '<mrg:loc.delete-marker#title/>'      }
  T?.eq rows[ 2  ], { dsk: 'twcm', lnr: 1, lnpart: 1, xtra: 1, locid: null, line: 'A Grand Union'         }
  T?.eq rows[ 3  ], { dsk: 'twcm', lnr: 1, lnpart: 2, xtra: 0, locid: null, line: '</title>'              }
  T?.eq rows[ 4  ], { dsk: 'twcm', lnr: 2, lnpart: 0, xtra: 0, locid: null, line: '<article>'             }
  T?.eq rows[ 5  ], { dsk: 'twcm', lnr: 3, lnpart: 0, xtra: 0, locid: null, line: '  <p>Here comes some ' }
  T?.eq rows[ 6  ], { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 0, locid: 'content', line: '<mrg:loc#content/>'    }
  T?.eq rows[ 7  ], { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 1, locid: null, line: 'more '                 }
  T?.eq rows[ 8  ], { dsk: 'twcm', lnr: 3, lnpart: 1, xtra: 2, locid: null, line: 'content'               }
  T?.eq rows[ 9  ], { dsk: 'twcm', lnr: 3, lnpart: 2, xtra: 0, locid: null, line: '.</p>'                 }
  T?.eq rows[ 10 ], { dsk: 'twcm', lnr: 4, lnpart: 0, xtra: 0, locid: null, line: '  </article>'          }
  T?.eq rows[ 11 ], { dsk: 'twcm', lnr: 5, lnpart: 0, xtra: 0, locid: null, line: ''                      }
  #.........................................................................................................
  for { line, } from mrg.walk_line_rows { dsk, }
    urge '^587^', rpr line
  T?.eq ( mrg.get_line_rows { dsk, } ), [
    { dsk: 'twcm', lnr: 1, line: '<title><mrg:loc.delete-marker#title/>A Grand Union</title>'             },
    { dsk: 'twcm', lnr: 2, line: '<article>'                                                },
    { dsk: 'twcm', lnr: 3, line: '  <p>Here comes some <mrg:loc#content/>more content.</p>' },
    { dsk: 'twcm', lnr: 4, line: '  </article>'                                             },
    { dsk: 'twcm', lnr: 5, line: ''                                                         } ]
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "loc markers 3" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  mrg.append_to_loc { dsk, locid: 'title',   text: "A Grand Union", nl: false,  }
  mrg.append_to_loc { dsk, locid: 'content', text: "more ",         nl: false,  }
  mrg.append_to_loc { dsk, locid: 'content', text: "content",       nl: false,  }
  T?.eq ( mrg.get_text { dsk, keep_locs: null,  } ), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#content/>more content.</p>\n  </article>\n'
  T?.eq ( mrg.get_text { dsk, keep_locs: true,  } ), '<title><mrg:loc.delete-marker#title/>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#content/>more content.</p>\n  </article>\n'
  T?.eq ( mrg.get_text { dsk, keep_locs: false, } ), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some more content.</p>\n  </article>\n'
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "multiple loc markers in one line" ] = ( T, done ) ->
  # T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm2'
  path      = 'dbay-rustybuzz/template-with-content-markers-2.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  mrg.append_to_loc { dsk, locid: 'title',  text: "A Grand Union" }
  mrg.append_to_loc { dsk, locid: 'some-content', text: "some content"      }
  mrg.append_to_loc { dsk, locid: 'more-content', text: "and more content"  }
  debug '^45346^', mrg.get_text { dsk, keep_locs: null,  }
  T?.eq ( mrg.get_text { dsk, keep_locs: null,  } ), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#some-content/>some content and some more <mrg:loc#more-content/>and more content.</p>\n  </article>\n'
  T?.eq ( mrg.get_text { dsk, keep_locs: true,  } ), '<title><mrg:loc.delete-marker#title/>A Grand Union</title>\n<article>\n  <p>Here comes some <mrg:loc#some-content/>some content and some more <mrg:loc#more-content/>and more content.</p>\n  </article>\n'
  T?.eq ( mrg.get_text { dsk, keep_locs: false, } ), '<title>A Grand Union</title>\n<article>\n  <p>Here comes some some content and some more and more content.</p>\n  </article>\n'
  #.........................................................................................................
  done?()
  return null



#-----------------------------------------------------------------------------------------------------------
@[ "loc markers 4" ] = ( T, done ) ->
  T?.halt_on_error()
  { DBay  } = require H.dbay_path
  { Mrg   } = require '../../../apps/dbay-rustybuzz/lib/_mirage'
  # { Drb }   = require H.drb_path
  db        = new DBay()
  mrg       = new Mrg { db, }
  dsk       = 'twcm'
  path      = 'dbay-rustybuzz/template-with-content-markers.html'
  path      = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  debug '^68667-1^'
  mrg.register_dsk { dsk, path, }
  mrg.refresh_datasource { dsk, }
  #.........................................................................................................
  debug '^68667-2^'
  db.setv 'dsk',    dsk
  db.setv 'locid',  'title'
  console.table db.all_rows SQL"select * from mrg_location_from_dsk_locid;"
  console.table db.all_rows SQL"select * from mrg_prv_nxt_xtra_from_dsk_locid;"
  #.........................................................................................................
  do =>
    error = null
    db.setv 'dsk',    dsk
    db.setv 'locid',  'nonexistentloc'
    debug '^68667-3^'
    try
      console.table db.all_rows SQL"select * from mrg_location_from_dsk_locid;"
    catch error
      help '^68667-4^', CND.reverse error.message
      T?.ok ( error.message.match /unknown locid/ )?
    debug '^68667-5^'
    T?.ok error?
  #.........................................................................................................
  do =>
    error = null
    db.setv 'dsk',    dsk
    db.setv 'locid',  'nonexistentloc'
    debug '^68667-6^'
    try
      console.table db.all_rows SQL"select * from mrg_prv_nxt_xtra_from_dsk_locid;"
    catch error
      help '^68667-7^', CND.reverse error.message
      T?.ok ( error.message.match /unknown locid/ )?
    debug '^68667-8^'
    T?.ok error?
  #.........................................................................................................
  do =>
    debug '^68667-9^'
    error = null
    try
      mrg.append_to_loc { dsk, locid: 'nonexistentloc',  text: "A Grand Union" }
    catch error
      help '^68667-10^', CND.reverse error.message
      T?.ok ( error.message.match /unknown locid/ )?
    debug '^68667-11^'
    T?.ok error?
  #.........................................................................................................
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "altering mirrored source lines causes error" ]
  # @[ "altering mirrored source lines causes error" ]()
  # test @[ "location marker matching" ]
  # test @[ "mrg.refresh_datasource" ]
  # test @[ "loc markers 1" ]
  # test @[ "loc markers 2" ]
  # test @[ "loc markers 3" ]
  # test @[ "loc markers 4" ]
  # test @[ "extended location marker matching" ]
  test @[ "multiple loc markers in one line" ]

