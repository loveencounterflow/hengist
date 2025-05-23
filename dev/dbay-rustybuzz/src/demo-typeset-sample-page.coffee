
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY-RUSTYBUZZ/DEMOS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
# H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
# MMX                       = require '../../../apps/multimix/lib/cataloguing'
RBW                       = require 'rustybuzz-wasm'
H                         = require './helpers'
{ DBay }                  = require H.dbay_path
{ Drb }                   = require H.drb_path
template_path             = PATH.resolve PATH.join __dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-page.template.html'
cm_grid_path              = PATH.resolve PATH.join __dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-cmgrid.svg'
target_path               = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/demo-typeset-sample-page.output.html'
ui_font_path              = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/iosevka-medium.woff2.data-uri'
mudom_path                = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/mudom.js.data-uri'
favicon_path              = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/mingkwai-icon.128.png.data-uri'
{ to_width }              = require 'to-width'
ITXT                      = require 'intertext'


#-----------------------------------------------------------------------------------------------------------
XXX_show_clusters = ( text, ads ) ->
  ### This is probably based on a misunderstanding of what `rustybuzz` means by 'cluster';
  see https://docs.rs/rustybuzz/0.4.0/rustybuzz/struct.GlyphInfo.html ###
  for d, d_idx in ads
    cur_bidx  = d.bidx
    nxt_bidx  = ads[ d_idx + 1 ]?.bidx ? ads.length
    cur_text  = text[ cur_bidx ... nxt_bidx ]
    info '^4448^', rpr cur_text
  help '^4448^', rpr text
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_glyfgrid = ( cfg ) ->
  defaults        = { fontnick: 'b42', fspath: null, gid_1: 1, gid_2: 100, }
  cfg             = { defaults..., cfg..., }
  { fontnick
    fspath
    gid_1
    gid_2    }    = cfg
  width_mm        = 100
  size_mm         = 10
  mm_p_u          = size_mm / 1000 # mm per unit as valid inside scaled `<g>` line element
  mm_p_u_txt      = mm_p_u.toFixed 4
  ### NOTE: for testing we want to use the most recent `rustybuzz-wasm`: ###
  # { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  db              = new DBay { path: ( PATH.join __dirname, '../../../dev-shm/typesetting-1.sqlite' ), }
  drb             = new Drb { db, rebuild: true, RBW, path: ( PATH.join __dirname, '../../../dev-shm/typesetting-2.sqlite' ), }
  # dtab            = new Tbl { db, }
  page            = FS.readFileSync template_path, { encoding: 'utf-8', }
  append_grid     { drb, dsk, }
  { I, L, V }     = db.sql
  #.........................................................................................................
  drb.register_fontnick { fontnick, fspath, } if fspath?
  drb.prepare_font      { fontnick, }
  #.........................................................................................................
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-17^ --><g transform='translate(#{0} #{10}) scale(#{mm_p_u_txt})'>", }
  #.........................................................................................................
  for gid in [ gid_1 .. gid_2 ]
    { bbox
      gd    }   = drb.get_single_outline { gid, fontnick, }
    { x,  y,
      x1, y1, } = bbox
    sid         = drb._get_sid { fontnick, gid, }
    px          = ( gid %% 10 ) / mm_p_u * size_mm
    py          = ( gid // 10 ) / mm_p_u * size_mm
    tx          = px + ( ( 0.5 * size_mm ) / mm_p_u )
    ty          = py - ( ( 0.7 * size_mm ) / mm_p_u )
    drb.mrg.append_to_loc { dsk, locid: 'outlines', text: "<!-- ^42-18^ --><path id='#{sid}' d='#{gd}'/>",                                }
    drb.mrg.append_to_loc { dsk, locid: 'content',  text: "<!-- ^42-19^ --><use href='##{sid}' x='#{px}' y='#{py}'/>",                    }
    drb.mrg.append_to_loc { dsk, locid: 'content',  text: "<!-- ^42-20^ --><text class='glyfgridgid' x='#{tx}' y='#{ty}'>#{gid}</text>",  }
  #.........................................................................................................
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-21^ --></g>", }
  FS.writeFileSync target_path, page
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
append_remarks = ( cfg ) ->
  { drb, dsk, fontnick, } = cfg
  fm              = drb.get_fontmetrics { fontnick, }
  drb.mrg.append_to_loc { dsk, locid: 'remarks', text: "<!-- ^42-1^ --><div>fm: #{rpr fm}</div>", }
  # missing_txt     = ( rpr ad.chrs for ad in missing_chrs ).join ', '
  # 'remarks', "<div>missing_chrs: #{missing_txt}</div>"
  return null

#-----------------------------------------------------------------------------------------------------------
append_grid = ( cfg ) ->
  { drb
    dsk   } = cfg
  grid_txt  = FS.readFileSync cm_grid_path, { encoding: 'utf-8', }
  drb.mrg.append_to_loc { dsk, locid: 'grid', text: '<!-- ^42-2^ -->' + grid_txt, }
  return null

#-----------------------------------------------------------------------------------------------------------
append_title = ( cfg ) ->
  { drb
    dsk
    title } = cfg
  drb.mrg.append_to_loc { dsk, locid: 'title_page',     text: title, nl: false, }
  drb.mrg.append_to_loc { dsk, locid: 'title_heading',  text: title, nl: false, }
  return null

#-----------------------------------------------------------------------------------------------------------
_escape_syms = ( text ) ->
  R = text
  R = R.replace /\xad/g,   '&shy;'
  R = R.replace /\u200b/g, '&wbr;'
  return R
#-----------------------------------------------------------------------------------------------------------
_escape_for_html_text = ( text ) -> ( ( text ? '' ).replace /&/g, '&amp;' ).replace /</g, '&lt;'

#-----------------------------------------------------------------------------------------------------------
_escape_for_html_comment = ( text ) ->
  R = text ? ''
  R = R.replace /-/g,  '&hhy;'
  R = R.replace /\n/g, '\\n'
  R = R.replace /\r/g, '\\r'
  # R = R.replace /\b/g, '\\b'
  R = R.replace /\t/g, '\\t'
  R = R.replace /\v/g, '\\v'
  R = R.replace /\f/g, '\\f'
  R = R.replace /\x20/g, '&spc;'
  R = R.replace /\p{C}|\p{Z}/ug, ( $0 ) -> "&#x#{( $0.codePointAt 0 ).toString 16 };"
  return R

#-----------------------------------------------------------------------------------------------------------
append_outlines = ( cfg ) ->
  { drb, dsk, fontnick, size_mm, mm_p_u, missing_sid, } = cfg
  fm          = drb.get_fontmetrics { fontnick, }
  swdth       = 0.5 # stroke width in mm
  swdth      *= 1000 * size_mm * mm_p_u
  owdth       = 3 * swdth
  top         = fm.ascender  - owdth
  bottom      = fm.descender + owdth
  left        = Math.round owdth * 0.5
  right       = Math.round 1000 - owdth * 0.5
  # debug '^432433^', 2
  for od from drb.db SQL"select * from outlines;"
    # continue if od.gid is missing.gid
    ### TAINT use standard method ###
    chrs_txt  = _escape_for_html_comment od.chrs
    drb.mrg.append_to_loc { dsk, locid: 'outlines', text: "<!-- ^42-3^ #{chrs_txt}-->#{od.gd}", }
  return null

#-----------------------------------------------------------------------------------------------------------
_append_fontmetric_hgrid = ( cfg ) ->
  { drb, dsk, fontnick, size_mm, mm_p_u, } = cfg
  fm      = drb.get_fontmetrics { fontnick, }
  swdth   = 0.25 # stroke width in mm
  swdth  *= 1000 * size_mm * mm_p_u
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-4^ --><line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>",              }
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-5^ --><line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.descender}' x2='10000' y2='#{fm.descender}'/>",            }
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-6^ --><line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='0' x2='10000' y2='0'/>",                                        }
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-7^ --><line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.x_height}' x2='10000' y2='#{fm.x_height}'/>",              }
  drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-8^ --><line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.capital_height}' x2='10000' y2='#{fm.capital_height}'/>",  }
  return null

#-----------------------------------------------------------------------------------------------------------
append_content = ( cfg ) ->
  { drb, dsk, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing_sid, } = cfg
  { specials  } = drb.constructor.C
  { missing   } = specials
  ### TAINT add to cfg type ###
  fm            = drb.get_fontmetrics { fontnick, }
  cfg.skip_shy_etc  ?= false
  cfg.skip_ws       ?= false
  drb.mrg.append_to_loc { dsk, locid: 'textcontainer', text: "<!-- ^42-9^ --><div style='left:#{x0}mm;top:#{y0 - size_mm}mm;'>#{text}</div>", }
  # for ad in ads
  #   urge '^3980^', ad
  line_y0       = 20
  line_y_delta  = 10
  line_y        = line_y0 - line_y_delta
  doc           = 1
  par           = 1
  #.........................................................................................................
  lnr_1         = 1
  ### TAINT use API ###
  ### TAINT use field `rnr` to determine where to stop ###
  lnr_2         = drb.db.single_value SQL"""
    select
        max( lnr ) as lnr_2
      from #{drb.cfg.schema}.lines
      where true
        and ( doc = $doc )
        and ( par = $par );""", { doc, par, }
  for lnr in [ lnr_1 .. lnr_2 ]
    drb.mrg.append_to_loc {
      dsk,
      locid: 'content',
      text:  "<!-- ^42-10^ --><g transform='translate(#{x0} #{line_y}) scale(#{mm_p_u_txt})'>", }
    line_text = ''
    line_y    = line_y0 + ( line_y_delta * ( lnr - 1 ) )
    for ad from drb.db SQL"""
      select
          a.fontnick  as fontnick,
          a.gid       as gid,
          a.sid       as sid,
          a.chrs      as chrs,
          a.dx        as dx,
          a.dy        as dy,
          l.x         as x,
          l.y         as y,
          l.lnr       as lnr,
          l.ads_id    as ads_id
        from #{drb.cfg.schema}.line_ads as l
        left join #{drb.cfg.schema}.ads as a on ( l.ads_id = a.id )
        where true
          and ( l.doc = $doc )
          and ( l.par = $par )
          and ( l.lnr = $lnr )
        order by a.b1;""", { doc, par, lnr, }
      # debug '^6684048^', ad
      line_text  += ad.chrs ? ''
      chrs_ctxt   = _escape_for_html_comment ad.chrs
      if ad.gid is missing.gid
        ### TAINT use standard method ###
        chrs_htxt = _escape_for_html_text ad.chrs
        relwdth   = ad.dx / 1000 ### relative width of missing outline rectangle ###
        element   = """<!-- ^42-11^ #{chrs_ctxt}--><use href='##{missing_sid}' class='missing' transform='translate(#{ad.x} #{ad.y}) scale(#{relwdth} 1)'/>\
          <text class='missing-chrs' style='font-size:1000px;transform:skew(#{fm.angle}deg)' x='#{ad.x}' y='#{ad.y}'>#{chrs_htxt}</text>"""
      else
        clasz = ( specials[ ad.gid ] ? null )?.name ? null
        if ad.y is 0
          if clasz?
            element = "<!-- ^42-12^ #{chrs_ctxt}--><use class='fontmetrics #{clasz}' href='##{ad.sid}' x='#{ad.x}'/>"
          else
            element = "<!-- ^42-13^ #{chrs_ctxt}--><use href='##{ad.sid}' x='#{ad.x}'/>"
        else
          if clasz?
            element = "<!-- ^42-14^ #{chrs_ctxt}--><use class='fontmetrics #{clasz}' href='##{ad.sid}' x='#{ad.x}' y='#{ad.y}'/>"
          else
            element = "<!-- ^42-15^ #{chrs_ctxt}--><use href='##{ad.sid}' x='#{ad.x}' y='#{ad.y}'/>"
      drb.mrg.append_to_loc { dsk, locid: 'content', text: element, }
      # drb.mrg.append_to_loc { dsk, locid: 'p1c1b1', text: element, }
    drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!-- ^42-16^ --></g>", }
    info '^43487^', { doc, par, lnr, }, rpr line_text
  return null

# #-----------------------------------------------------------------------------------------------------------
# append_used_outlines_overview = ( page ) ->
#   x0      = 0
#   y0      = 70
#   swdth   = 0.25 # stroke width in mm
#   swdth  *= 1000 * size_mm * mm_p_u
#   page    = drb.mrg.append_to_loc { dsk, locid: 'content', text: "<g transform='translate(#{x0} #{y0}) scale(#{mm_p_u_txt})'>", }
#   dx      = 1000 * 100 * mm_p_u
#   x       = -dx
#   for od from db SQL"select * from drb.outlines where fontnick = $fontnick order by sid;", { fontnick, }
#     x    += dx
#     page  = drb.mrg.append_to_loc { dsk, locid: 'content', text: "<!--#{od.chrs}--><use href='##{od.sid}' x='#{x}'/>", }
#   page = drb.mrg.append_to_loc { dsk, locid: 'content', text: "</g>", }
#   return page

#-----------------------------------------------------------------------------------------------------------
TMP_add_baselines_to_db = ( cfg ) ->
  { drb
    dsk
    doc }         = cfg
  clm             = 1
  x1              = 10 ### TAINT make coordinates relative to column ###
  y0              = 20
  dy              = 10
  length          = 10000 ### TAINT derive line length from column width ###
  angle           = -8
  insert_baseline = drb.db.prepare drb.sql.insert_baseline
  drb.db =>
    for bln in [ 1 .. 5 ]
      y1 = y0 + ( bln - 1 ) * dy
      insert_baseline.run { doc, clm, bln, x1, y1, length, angle, }
    return null
  return null

#-----------------------------------------------------------------------------------------------------------
TMP_append_baselines_to_svg = ( cfg ) ->
  { drb
    dsk
    doc }         = cfg
  for row from drb.db.all_rows SQL"""select
      *
    from #{drb.cfg.schema}.baselines
    where true
      and ( doc = $doc )
    order by clm, bln;""", { doc, }
    # info '^568678^', row
    { clm
      bln
      x1
      y1
      length
      angle     } = row
    base_id       = "p1c#{clm}b#{bln}"
    baseline_svg  = """
    <g id='#{base_id}-g' transform='translate(#{x1},#{y1}) rotate(#{angle}) scale(0.0100)'>
      <line id='#{base_id}-l' class='baseline' x1='0' y1='0' x2='#{length}' y2='0'/></g>""".trim()
    drb.mrg.append_to_loc { dsk, locid: 'TMP-baselines',  text: baseline_svg, nl: true, }
  return null

#-----------------------------------------------------------------------------------------------------------
write_output = ( cfg ) ->
  { drb
    dsk } = cfg
  FS.writeFileSync target_path, drb.mrg.get_text { dsk, }
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_typeset_sample_page = ( cfg ) ->
  defaults        = { set_id: 'medium-eg8i', }
  cfg             = { defaults..., cfg..., }
  { set_id }      = cfg
  ### NOTE: for testing we want to use the most recent `rustybuzz-wasm`: ###
  RBW             = require '../../../apps/rustybuzz-wasm/pkg'
  { Tbl, }        = require '../../../apps/icql-dba-tabulate'
  db              = new DBay { path: ( PATH.resolve PATH.join __dirname, '../../../dev-shm/typesetting-1.sqlite' ), }
  dtab            = new Tbl { db, }
  drb             = new Drb { db, rebuild: true, RBW, }
  dsk             = 'demo'
  ui_font_data    = ( FS.readFileSync ui_font_path, { encoding: 'utf-8', } ).trim()
  mudom_data      = ( FS.readFileSync mudom_path,   { encoding: 'utf-8', } ).trim()
  favicon_data    = ( FS.readFileSync favicon_path, { encoding: 'utf-8', } ).trim()
  drb.mrg.register_dsk        { dsk, path: template_path, }
  drb.mrg.refresh_datasource  { dsk, }
  drb.mrg.append_to_loc       { dsk, locid: 'ui_font_data',  text: ui_font_data, nl: false, }
  drb.mrg.append_to_loc       { dsk, locid: 'mudom_data',    text: mudom_data,   nl: false, }
  drb.mrg.append_to_loc       { dsk, locid: 'favicon_data',  text: favicon_data, nl: false, }
  doc             = 1
  par             = 1
  #.........................................................................................................
  { I, L, V }     = db.sql
  #.........................................................................................................
  { text
    chrs
    cgid_map
    fontnick
    fspath      } = H.settings_from_set_id set_id
  #---------------------------------------------------------------------------------------------------------
  text            = drb.prepare_text {
    text
    entities:         true
    ncrs:             true
    hyphenate:        true
    newlines:         true
    uax14:            true
    trim:             true
    chomp:            true }
  #---------------------------------------------------------------------------------------------------------
  width_mm        = 100
  size_mm         = 10
  mm_p_u          = size_mm / 1000 # mm per unit as valid inside scaled `<g>` line element
  mm_p_u_txt      = mm_p_u.toFixed 4
  { specials    } = Drb.C
  { missing     } = specials
  missing_sid     = drb._get_sid { fontnick, gid: missing.gid, }
  known_ods       = { [missing_sid]: { gid: missing.gid, sid: missing_sid, fontnick, }, }
  #.........................................................................................................
  ### Register, load and prepopulate font: ###
  drb.register_fontnick { fontnick, fspath, } if fspath?
  drb.prepare_font      { fontnick, }
  drb.arrange           { fontnick, text, doc, par, }
  TMP_add_baselines_to_db     { drb, dsk, doc, }
  TMP_append_baselines_to_svg { drb, dsk, doc, }
  drb.distribute        { doc, par, mm_p_u, width_mm, size_mm, }
  drb.compose           { fontnick, text, doc, par, }
  append_remarks        { drb, dsk, fontnick, }
  append_grid           { drb, dsk, }
  append_title          { drb, dsk, title: "DBay Rustybuzz Typesetting Demo", }
  #.........................................................................................................
  x0    = 0
  y0    = 50
  append_outlines { drb, dsk, fontnick, size_mm, mm_p_u, missing_sid, known_ods, }
  append_content  { drb, dsk, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing_sid, }
  # page  = _append_fontmetric_hgrid { drb, page, fontnick, size_mm, mm_p_u, }
  #.........................................................................................................
  write_output { drb, dsk, }
  console.table db.all_rows SQL"""
    select
        fontnick,
        gid,
        sid,
        chrs,
        x,
        y,
        x1,
        y1,
        olt,
        substring( gd, 1, 12 ) as gd
        -- gd
      from outlines
      order by chrs;"""
  return null



############################################################################################################
if require.main is module then do =>
  # @demo_typeset_sample_page { set_id: 'affirm-b42', }
  # @demo_typeset_sample_page { set_id: 'missing-t-b42', }
  # @demo_typeset_sample_page { set_id: 'medium-eg12i', }
  # @demo_typeset_sample_page { set_id: 'typo-b42', }
  # @demo_typeset_sample_page { set_id: 'gaga-b42', }
  # @demo_typeset_sample_page { set_id: 'medium-n1518', }
  # @demo_typeset_sample_page { set_id: 'shorties-b42', }
  @demo_typeset_sample_page { set_id: 'shorties-eg8i', }
  # @demo_typeset_sample_page { set_id: 'specials-eg8i', }
  # @demo_typeset_sample_page { set_id: 'twolines-eg8i', }
  # @demo_typeset_sample_page { set_id: 'typo-b36', }
  # @demo_typeset_sample_page { set_id: 'typo-gr', }
  # @demo_typeset_sample_page { set_id: 'small-eg8i', }
  # @demo_typeset_sample_page { set_id: 'egypt-eg12i', }
  # @demo_typeset_sample_page { set_id: 'egypt-b42', }
  # @demo_store_outlines()
  # @demo_store_outlines { set_id: 'all', }
  # @demo_typeset_sample_page { set_id: 'small-eg12i', }
  # @demo_typeset_sample_page { set_id: 'small-b42', }
  # @demo_typeset_sample_page { set_id: 'apollo-b42', }
  # @demo_glyfgrid { fontnick: 'b42', gid_1: 0, gid_2: 599, }
  # @demo_typeset_sample_page { set_id: 'medium-eg8i', }
  # @demo_typeset_sample_page { set_id: 'longwords-eg12i', }
  # @demo_typeset_sample_page { set_id: 'short-eg12i', }
  # @demo_typeset_sample_page { set_id: 'medium-b42', }
  # @demo_typeset_sample_page { set_id: 'uppercasehyphen-eg12i', }
  # @demo_typeset_sample_page { set_id: 'memphis-b42', }
  # @demo_typeset_sample_page { set_id: 'small-arya', }
  # @demo_typeset_sample_page { set_id: 'small-aleo', }
  # @demo_typeset_sample_page { set_id: 'widechrs', }
  # @demo_typeset_sample_page { set_id: 'tibetan', }
  # @demo_typeset_sample_page { set_id: 'arabic', }
  # @demo_typeset_sample_page { set_id: 'urdu', }
  # @demo_typeset_sample_page { set_id: 'small-djvsi', }
  # @demo_use_linked_rustybuzz_wasm()


