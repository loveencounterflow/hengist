
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DATAMILL/TESTS/DOCUMENT'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate              } = types
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
PATH                      = require 'node:path'
FS                        = require 'node:fs'

#-----------------------------------------------------------------------------------------------------------
@doc_object_creation = ( T, done ) ->
  { DBay }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  T?.eq ( type_of Document ), 'class'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    db  = new DBay()
    doc = new Document { db, home, }
    T?.ok doc.db is db
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc = new Document { home, }
    T?.eq ( type_of doc.db ), 'dbay'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_document_creation = ( T, done ) ->
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc = new Document { home, }
    T?.eq doc.get_doc_src_ids(), [ 'layout', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_src_path_resolution = ( T, done ) ->
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home  = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc   = new Document { home, }
    # debug '^34-5^', { doc, }
    # debug '^34-5^', doc.cfg.home is home
    T?.eq ( doc.get_doc_src_abspath '.'                ), "#{home_parent}/dmd"
    T?.eq ( doc.get_doc_src_abspath 'foo.md'           ), "#{home_parent}/dmd/foo.md"
    T?.eq ( doc.get_doc_src_abspath '/path/to/foo.md'  ), "/path/to/foo.md"
    T?.eq ( doc.get_doc_src_abspath './path/to/foo.md' ), "#{home_parent}/dmd/path/to/foo.md"
    T?.eq ( doc.get_doc_src_abspath 'path/to/foo.md'   ), "#{home_parent}/dmd/path/to/foo.md"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_add_and_read_source = ( T, done ) ->
  { SQL }       = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    sources   = [
      { doc_src_id: 'ef', doc_src_path: 'datamill/empty-file.txt',                   }
      { doc_src_id: '3n', doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt',   }
      { doc_src_id: '3w', doc_src_path: 'datamill/file-with-3-lines-with-eofnl.txt', }
      { doc_src_id: '1n', doc_src_path: 'datamill/file-with-single-nl.txt',          } ]
    for { doc_src_id, doc_src_path, } in sources
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_src_path
      target_path   = PATH.resolve home, doc_src_path
      FS.cpSync source_path, target_path
      source        = doc.add_source { doc_src_id, doc_src_path, }
      result.push source
    H.tabulate "sources", result
    H.tabulate "lines", doc.db SQL"select * from doc_raw_lines;"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_paragraphs = ( T, done ) ->
  { SQL  }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    sources = [
      { doc_src_id: 'sp', doc_src_path: 'short-proposal.mkts.md',                   }
      { doc_src_id: '3p', doc_src_path: 'datamill/three-paragraphs.txt',            }
      { doc_src_id: '3n', doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt',  }
      { doc_src_id: '1n', doc_src_path: 'datamill/file-with-single-nl.txt',         } ]
    for { doc_src_id, doc_src_path, } in sources
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_src_path
      doc_src_path  = PATH.basename doc_src_path
      target_path   = PATH.resolve home, doc_src_path
      FS.cpSync source_path, target_path
      source        = doc.add_source { doc_src_id, doc_src_path, }
      result.push source
    H.tabulate "sources", result
    H.tabulate "lines", doc.db SQL"select * from doc_raw_lines;"
    #.......................................................................................................
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_walk_concatenated_lines_of_files = ( T, done ) ->
  { SQL  }      = require '../../../apps/dbay'
  { Document }  = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home_parent, }) ->
    home    = PATH.resolve home_parent, 'dmd'
    FS.mkdirSync home
    doc     = new Document { home, }
    result  = []
    # debug '^34-5^', { doc, }
    sources   = [
      { doc_src_id: '3p', doc_src_path: 'datamill/three-paragraphs.txt',            }
      { doc_src_id: '3n', doc_src_path: 'datamill/file-with-3-lines-no-eofnl.txt',  }
      { doc_src_id: '1n', doc_src_path: 'datamill/file-with-single-nl.txt',         } ]
    for { doc_src_id, doc_src_path, } in sources
      source_path   = PATH.resolve __dirname, '../../../assets/', doc_src_path
      doc_src_path  = PATH.basename doc_src_path
      target_path   = PATH.resolve home, doc_src_path
      FS.cpSync source_path, target_path
      source        = doc.add_source { doc_src_id, doc_src_path, }
      result.push source
    do ->
      T?.eq [ ( doc.walk_region_lines [] )..., ], []
    do ->
      matcher = doc.db.all_rows SQL"""
        select 1 as doc_region_nr, * from doc_raw_lines where doc_src_id = '1n'
        union all
        select 2 as doc_region_nr, * from doc_raw_lines where doc_src_id = '3n'
        union all
        select 3 as doc_region_nr, * from doc_raw_lines where doc_src_id = '3p'
        order by doc_region_nr, doc_line_nr;"""
      # urge '^9856^', matcher
      # H.tabulate "matcher", matcher
      # H.tabulate "select * from doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
      H.tabulate "doc.walk_region_lines '1n', '3n', '3p'", doc.walk_region_lines '1n', '3n', '3p'
      T?.eq [ ( doc.walk_region_lines '1n', '3n', '3p' )..., ], matcher
    #.......................................................................................................
    # H.tabulate "view doc_raw_lines", doc.db SQL"select * from doc_raw_lines;"
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_loc_matcher = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { get_document_types }  = require '../../../apps/datamill-v2/lib/types'
  types                   = get_document_types()
  pattern                 = types.registry.doc_document_cfg.default._loc_marker_re
  #.........................................................................................................
  probes_and_matchers = [
    [   "<dm:loc#prologue>", [ { left_slash: '',  doc_loc_id: 'prologue', right_slash: ''  }, ], ]
    [  "<dm:loc#prologue/>", [ { left_slash: '',  doc_loc_id: 'prologue', right_slash: '/' }, ], ]
    [  "</dm:loc#prologue>", [ { left_slash: '/', doc_loc_id: 'prologue', right_slash: ''  }, ], ]
    [ "</dm:loc#prologue/>", [ { left_slash: '/', doc_loc_id: 'prologue', right_slash: '/' }, ], ]
    [ "<dm:loc#L1/>xxx<dm:loc#L2/>", [ { left_slash: '', doc_loc_id: 'L1', right_slash: '/' }, { left_slash: '', doc_loc_id: 'L2', right_slash: '/' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result  = [ ( probe.matchAll pattern )..., ]
      result  = ( { m.groups..., } for m in result )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_walk_locs = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { Document }            = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  matcher = [
    { doc_src_id: 'lt', doc_line_nr: 1, doc_loc_id: '*', doc_loc_kind: 'start', doc_loc_start: 0, doc_loc_stop: 0, doc_loc_mark: 0 },
    { doc_src_id: 'lt', doc_line_nr: 18, doc_loc_id: '*', doc_loc_kind: 'stop', doc_loc_start: 0, doc_loc_stop: 0, doc_loc_mark: 0 },
    { doc_src_id: 'lt', doc_line_nr: 2, doc_loc_id: 'prologue', doc_loc_kind: 'start', doc_loc_start: 0, doc_loc_stop: 16, doc_loc_mark: 16 },
    { doc_src_id: 'lt', doc_line_nr: 10, doc_loc_id: 'prologue', doc_loc_kind: 'stop', doc_loc_start: 0, doc_loc_stop: 17, doc_loc_mark: 0 },
    { doc_src_id: 'lt', doc_line_nr: 12, doc_loc_id: 'epilogue', doc_loc_kind: 'start', doc_loc_start: 0, doc_loc_stop: 16, doc_loc_mark: 16 },
    { doc_src_id: 'lt', doc_line_nr: 12, doc_loc_id: 'epilogue', doc_loc_kind: 'stop', doc_loc_start: 56, doc_loc_stop: 73, doc_loc_mark: 56 },
    { doc_src_id: 'lt', doc_line_nr: 14, doc_loc_id: 'empty', doc_loc_kind: 'start', doc_loc_start: 8, doc_loc_stop: 21, doc_loc_mark: 21 },
    { doc_src_id: 'lt', doc_line_nr: 14, doc_loc_id: 'empty', doc_loc_kind: 'stop', doc_loc_start: 22, doc_loc_stop: 36, doc_loc_mark: 22 },
    { doc_src_id: 'lt', doc_line_nr: 15, doc_loc_id: 'single', doc_loc_kind: 'start', doc_loc_start: 8, doc_loc_stop: 23, doc_loc_mark: 23 },
    { doc_src_id: 'lt', doc_line_nr: 15, doc_loc_id: 'single', doc_loc_kind: 'stop', doc_loc_start: 8, doc_loc_stop: 23, doc_loc_mark: 23 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'one', doc_loc_kind: 'start', doc_loc_start: 3, doc_loc_stop: 14, doc_loc_mark: 14 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'one', doc_loc_kind: 'stop', doc_loc_start: 18, doc_loc_stop: 30, doc_loc_mark: 18 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'two', doc_loc_kind: 'start', doc_loc_start: 34, doc_loc_stop: 45, doc_loc_mark: 45 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'two', doc_loc_kind: 'stop', doc_loc_start: 49, doc_loc_stop: 61, doc_loc_mark: 49 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'three', doc_loc_kind: 'start', doc_loc_start: 65, doc_loc_stop: 78, doc_loc_mark: 78 },
    { doc_src_id: 'lt', doc_line_nr: 17, doc_loc_id: 'three', doc_loc_kind: 'stop', doc_loc_start: 84, doc_loc_stop: 98, doc_loc_mark: 84 }
    ]
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc     = new Document { home, }
    sources   = [
      { doc_src_id: 'lt', doc_src_path: 'datamill/layout.dm.html', } ]
    for { doc_src_id, doc_src_path, } in sources
      doc_src_path = PATH.resolve __dirname, '../../../assets/', doc_src_path
      source       = doc.add_source { doc_src_id, doc_src_path, }
    do ->
      result = [ ( doc._walk_locs_of_source source )..., ]
      H.tabulate "locations in `layout.dm.html`", result
      H.tabulate "matcher", matcher
      T?.eq result, matcher
      return null
    do ->
      matcher.sort ( a, b ) ->
        return +1 if a.doc_line_nr   > b.doc_line_nr
        return -1 if a.doc_line_nr   < b.doc_line_nr
        return +1 if a.doc_loc_start > b.doc_loc_start
        return -1 if a.doc_loc_start < b.doc_loc_start
        return 0
      result  = [ ( doc.db.all_rows SQL"""
        select
            *
          from doc_locs
          where doc_src_id = 'lt'
          order by doc_line_nr, doc_loc_start;""" )..., ]
      H.tabulate "locations in `layout`", result
      T?.eq result, matcher
      return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_loc_markers_as_html_comments = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { Document }            = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc     = new Document { home, }
    sources   = [
      { doc_src_id: 'lt', doc_src_path: 'datamill/layout.dm.html', } ]
    for { doc_src_id, doc_src_path, } in sources
      doc_src_path = PATH.resolve __dirname, '../../../assets/', doc_src_path
      source       = doc.add_source { doc_src_id, doc_src_path, }
    #.......................................................................................................
    do ->
      result = []
      for { doc_src_id, doc_line_txt, } from doc.walk_region_lines 'lt'
        result.push doc._loc_markers_as_html_comments doc_src_id, doc_line_txt
        # debug rpr result.at -1
      T?.eq result, [
        ''
        "<!--(loc 'prologue'-->"
        "<script src='/public/browserified/mudom.js'></script>"
        "<script src='/public/socket.io.js'></script>"
        "<script src='/public/ops1.js'></script>"
        "<script src='/public/d3@7.js'></script>"
        "<script src='/public/plot@0.4.js'></script>"
        "<link rel='icon' type='image/x-icon' href='/public/favicon.ico'>"
        "<link rel=stylesheet href='/public/vogue.css'></script>"
        "<!--loc 'prologue')-->"
        ''
        "<!--(loc 'epilogue'--><script src='/public/ops2.js'></script><!--loc 'epilogue')-->"
        ''
        "<!-- abc<!--(loc 'empty'--><!--loc 'empty')-->def -->"
        "<!-- ghi<!--(loc 'single')-->jkl -->"
        ''
        "abc<!--(loc 'one'-->ONE<!--loc 'one')-->def<!--(loc 'two'-->TWO<!--loc 'two')-->ghi<!--(loc 'three'-->THREE<!--loc 'three')-->xyz"
        ''
        ]
      return null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_walk_lines_of_regions = ( T, done ) ->
  { SQL  }                = require '../../../apps/dbay'
  { Document }            = require '../../../apps/datamill-v2/lib/document'
  #.........................................................................................................
  GUY.temp.with_directory ({ path: home, }) ->
    doc     = new Document { home, }
    sources   = [
      { doc_src_id: 'lt', doc_src_path: 'datamill/layout.dm.html', } ]
    for { doc_src_id, doc_src_path, } in sources
      doc_src_path = PATH.resolve __dirname, '../../../assets/', doc_src_path
      source       = doc.add_source { doc_src_id, doc_src_path, }
    #.......................................................................................................
    do ->
      H.tabulate "locs", doc.db SQL"select * from doc_locs where doc_src_id = 'lt' order by doc_line_nr, doc_loc_start;"
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#prologue' )..., ]
      H.tabulate "lt#prologue", result
      # whisper '^45-1^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 2, doc_par_nr: 1, doc_line_txt: "<!--(loc 'prologue'-->" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 3, doc_par_nr: 1, doc_line_txt: "<script src='/public/browserified/mudom.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 4, doc_par_nr: 1, doc_line_txt: "<script src='/public/socket.io.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 5, doc_par_nr: 1, doc_line_txt: "<script src='/public/ops1.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 6, doc_par_nr: 1, doc_line_txt: "<script src='/public/d3@7.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 7, doc_par_nr: 1, doc_line_txt: "<script src='/public/plot@0.4.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 8, doc_par_nr: 1, doc_line_txt: "<link rel='icon' type='image/x-icon' href='/public/favicon.ico'>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 9, doc_par_nr: 1, doc_line_txt: "<link rel=stylesheet href='/public/vogue.css'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 10, doc_par_nr: 1, doc_line_txt: "<!--loc 'prologue')-->" }
        ]
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#epilogue' )..., ]
      H.tabulate "lt#epilogue", result
      # whisper '^45-2^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 12, doc_par_nr: 2, doc_line_txt: "<!--(loc 'epilogue'--><script src='/public/ops2.js'></script><!--loc 'epilogue')-->" }
        ]
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#two' )..., ]
      H.tabulate "lt#two", result
      # whisper '^45-3^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 17, doc_par_nr: 4, doc_line_txt: "<!--(loc 'two'-->TWO<!--loc 'two')-->" }
        ]
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#empty' )..., ]
      H.tabulate "lt#empty", result
      # whisper '^45-4^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 14, doc_par_nr: 3, doc_line_txt: "<!--(loc 'empty'--><!--loc 'empty')-->" }
        ]
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#single' )..., ]
      H.tabulate "lt#single", result
      # whisper '^45-5^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 15, doc_par_nr: 3, doc_line_txt: "<!--(loc 'single')-->" }
        ]
      return null
    #.......................................................................................................
    do ->
      result = [ ( doc.walk_region_lines 'lt#prologue', 'lt#epilogue', 'lt#two', 'lt#empty', 'lt#single', )..., ]
      H.tabulate "lt#single", result
      # whisper '^45-6^', '---------------------------------------'
      # echo line for line in result
      T?.eq result, [
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 2, doc_par_nr: 1, doc_line_txt: "<!--(loc 'prologue'-->" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 3, doc_par_nr: 1, doc_line_txt: "<script src='/public/browserified/mudom.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 4, doc_par_nr: 1, doc_line_txt: "<script src='/public/socket.io.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 5, doc_par_nr: 1, doc_line_txt: "<script src='/public/ops1.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 6, doc_par_nr: 1, doc_line_txt: "<script src='/public/d3@7.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 7, doc_par_nr: 1, doc_line_txt: "<script src='/public/plot@0.4.js'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 8, doc_par_nr: 1, doc_line_txt: "<link rel='icon' type='image/x-icon' href='/public/favicon.ico'>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 9, doc_par_nr: 1, doc_line_txt: "<link rel=stylesheet href='/public/vogue.css'></script>" }
        { doc_region_nr: 1, doc_src_id: 'lt', doc_line_nr: 10, doc_par_nr: 1, doc_line_txt: "<!--loc 'prologue')-->" }
        { doc_region_nr: 2, doc_src_id: 'lt', doc_line_nr: 12, doc_par_nr: 2, doc_line_txt: "<!--(loc 'epilogue'--><script src='/public/ops2.js'></script><!--loc 'epilogue')-->" }
        { doc_region_nr: 3, doc_src_id: 'lt', doc_line_nr: 17, doc_par_nr: 4, doc_line_txt: "<!--(loc 'two'-->TWO<!--loc 'two')-->" }
        { doc_region_nr: 4, doc_src_id: 'lt', doc_line_nr: 14, doc_par_nr: 3, doc_line_txt: "<!--(loc 'empty'--><!--loc 'empty')-->" }
        { doc_region_nr: 5, doc_src_id: 'lt', doc_line_nr: 15, doc_par_nr: 3, doc_line_txt: "<!--(loc 'single')-->" }
        ]
      return null
    return null
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@doc_parse_htmlish = ( T, done ) ->
  # { SQL  }                = require '../../../apps/dbay'
  { Document }            = require '../../../apps/datamill-v2/lib/document'
  { HTMLISH }             = require '../../../apps/datamill-v2/lib/htmlish-parser'
  #.........................................................................................................
  await GUY.temp.with_directory ({ path: home, }) ->
    doc     = new Document { home, }
    sources   = [
      { doc_src_id: 'lt', doc_src_path: 'datamill/layout.dm.html', } ]
    for { doc_src_id, doc_src_path, } in sources
      doc_src_path = PATH.resolve __dirname, '../../../assets/', doc_src_path
      source       = doc.add_source { doc_src_id, doc_src_path, }
    #.......................................................................................................
    probes_and_matchers = [
      [ "<insert href='./foo.dm.md'>", [ { '$key': '<tag', name: 'insert', type: 'otag', text: "<insert href='./foo.dm.md'>", start: 0, stop: 27, atrs: { href: './foo.dm.md' }, '$vnr': [ 1, 1 ], '$': '^Ω13^', delta_lnr: 0, col: 1 } ], null ]
      [ "<insert href='./foo.dm.md'/>", [ { '$key': '^tag', name: 'insert', type: 'stag', text: "<insert href='./foo.dm.md'/>", start: 0, stop: 28, atrs: { href: './foo.dm.md' }, '$vnr': [ 1, 1 ], '$': '^Ω13^', delta_lnr: 0, col: 1 } ], null ]
      [ '<i>something</i>', [
        { '$key': '<tag', name: 'i', type: 'otag', text: '<i>', start: 0, stop: 3, '$vnr': [ 1, 1 ], '$': '^Ω14^', delta_lnr: 0, col: 1 },
        { '$key': '^text', start: 3, stop: 12, text: 'something', '$vnr': [ 1, 4 ], '$': '^Ω2^', delta_lnr: 0, col: 4 },
        { '$key': '>tag', name: 'i', type: 'ctag', text: '</i>', start: 12, stop: 16, '$vnr': [ 1, 13 ], '$': '^Ω15^', delta_lnr: 0, col: 13 } ] ]
      [ '<em>&foo;</em>', [
        { '$key': '<tag', name: 'em', type: 'otag', text: '<em>', start: 0, stop: 4, '$vnr': [ 1, 1 ], '$': '^Ω14^', delta_lnr: 0, col: 1 },
        { '$key': '^entity', start: 0, stop: 5, text: '&foo;', '$vnr': [ 1, 5 ], '$': '^Ω2^', delta_lnr: 0, col: 5, type: 'named', name: 'foo' },
        { '$key': '>tag', name: 'em', type: 'ctag', text: '</em>', start: 9, stop: 14, '$vnr': [ 1, 10 ], '$': '^Ω15^', delta_lnr: 0, col: 10 } ], null ]
      [ '<em#c123>', [ { '$key': '<tag', name: 'em', type: 'otag', text: '<em>', start: 0, stop: 9, '$vnr': [ 1, 1 ], '$': '^Ω14^', id: 'c123', delta_lnr: 0, col: 1 } ]]
      # [ '<em#c123>&foo;</em>', [
        # { '$key': '<tag', name: 'em', type: 'otag', text: '<em>', start: 0, stop: 9, '$vnr': [ 1, 1 ], '$': '^Ω14^', id: 'c123', delta_lnr: 0, col: 1 },
      #   { '$key': '^entity', start: 9, stop: 14, text: '&foo;', '$vnr': [ 1, 5 ], '$': '^Ω2^', delta_lnr: 0, col: 10, type: 'named', name: 'foo' },
      #   { '$key': '>tag', name: 'em', type: 'ctag', text: '</em>', start: 14, stop: 19, '$vnr': [ 1, 10 ], '$': '^Ω15^', delta_lnr: 0, col: 15 } ], null ]
      ]
    for [ probe, matcher, error, ] in probes_and_matchers
      await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
        resolve HTMLISH.parse probe
        debug '^34534857^', result
    return null
  done?()


############################################################################################################
if require.main is module then do =>
  # @doc_object_creation()
  # test @doc_object_creation
  # test @doc_document_creation
  # @doc_src_path_resolution()
  # test @doc_src_path_resolution
  # @doc_add_and_read_file()
  # test @doc_add_and_read_file
  # @doc_paragraphs()
  # test @doc_paragraphs
  # @doc_walk_locs()
  # test @doc_walk_locs
  # @doc_loc_matcher()
  # test @doc_loc_matcher
  # @doc_walk_concatenated_lines_of_files()
  # test @doc_walk_concatenated_lines_of_files
  # @doc_alternative_formulation()
  # @doc_walk_lines_of_regions()
  # test @doc_walk_lines_of_regions
  # @doc_loc_markers_as_html_comments()
  # test @doc_loc_markers_as_html_comments
  test @doc_parse_htmlish
  # test @
