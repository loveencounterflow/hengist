
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


#-----------------------------------------------------------------------------------------------------------
append_to = ( page, name, text ) ->
  text = rpr text unless isa.text text
  echo ( CND.reverse CND.grey to_width name, 15 ) + ( CND.reverse CND.gold ' ' + to_width text, 108 )
  marker = "<!--?#{name}-end?-->"
  return page.replace marker, '\n' + text.toString() + marker


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
append_remarks = ( cfg ) ->
  { drb, page, missing_chrs, fontnick, } = cfg
  fm              = drb.get_fontmetrics { fontnick, }
  page            = append_to page, 'remarks', "<div>fm: #{rpr fm}</div>"
  # missing_txt     = ( rpr ad.chrs for ad in missing_chrs ).join ', '
  # page            = append_to page, 'remarks', "<div>missing_chrs: #{missing_txt}</div>"
  return page

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
  { drb, page, fontnick, size_mm, mm_p_u, missing, missing_sid, } = cfg
  fm          = drb.get_fontmetrics { fontnick, }
  swdth       = 0.5 # stroke width in mm
  swdth      *= 1000 * size_mm * mm_p_u
  owdth       = 3 * swdth
  top         = fm.ascender  - owdth
  bottom      = fm.descender + owdth
  left        = Math.round owdth * 0.5
  right       = Math.round 1000 - owdth * 0.5
  # debug '^432433^', 2
  missing_pd  = "M#{left} #{bottom} L#{left} #{top} L#{right} #{top} L#{right} #{bottom}"
  page = append_to page, 'outlines', "<!--NULL--><path id='#{missing_sid}' class='missing' d='#{missing_pd}' transform='skewX(#{fm.angle})'/>"
  page = append_to page, 'outlines', "<!--SHY--><line id='oshy-#{fontnick}' class='fontmetric shy' stroke-width='#{swdth}' x1='0' y1='#{bottom}' x2='0' y2='#{top}' transform='skewX(#{fm.angle})'/>"
  page = append_to page, 'outlines', "<!--WBR--><line id='owbr-#{fontnick}' class='fontmetric wbr' stroke-width='#{swdth}' x1='0' y1='#{bottom}' x2='0' y2='#{top}' transform='skewX(#{fm.angle})'/>"
  for od from drb.db SQL"select * from outlines;"
    # continue if od.gid is missing.gid
    ### TAINT use standard method ###
    chrs_txt  = _escape_for_html_comment od.chrs
    page      = append_to page, 'outlines', "<!--#{chrs_txt}--><path class='shady' id='#{od.sid}' d='#{od.pd}'/>"
  return page

#-----------------------------------------------------------------------------------------------------------
_append_fontmetrics = ( cfg ) ->
  { drb, page, fontnick, size_mm, mm_p_u, } = cfg
  fm      = drb.get_fontmetrics { fontnick, }
  swdth   = 0.25 # stroke width in mm
  swdth  *= 1000 * size_mm * mm_p_u
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.descender}' x2='10000' y2='#{fm.descender}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='0' x2='10000' y2='0'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.x_height}' x2='10000' y2='#{fm.x_height}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.capital_height}' x2='10000' y2='#{fm.capital_height}'/>"
  return page

# #-----------------------------------------------------------------------------------------------------------
# _append_breakpoint = ( cfg ) ->
#   { page, x0, y0, size_mm, mm_p_u, mm_p_u_txt, fm, text, ads, missing, missing_sid, } = cfg
#   page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>"
#   return page

#-----------------------------------------------------------------------------------------------------------
append_content = ( cfg ) ->
  { drb, page, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing, missing_sid, } = cfg
  ### TAINT add to cfg type ###
  fm            = drb.get_fontmetrics { fontnick, }
  cfg.skip_shy_etc  ?= false
  cfg.skip_ws       ?= false
  page = append_to page, 'textcontainer', "<div style='left:#{x0}mm;top:#{y0 - size_mm}mm;'>#{text}</div>"
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
    page      = append_to page, 'content', "<g transform='translate(#{x0} #{line_y}) scale(#{mm_p_u_txt})'>"
    line_text = ''
    line_y    = line_y0 + ( line_y_delta * ( lnr - 1 ) )
    for ad from drb.db SQL"""
      select
          a.sid     as sid,
          a.chrs    as chrs,
          a.dx      as dx,
          a.dy      as dy,
          l.x       as x,
          l.y       as y,
          l.lnr     as lnr,
          l.ads_id  as ads_id
        from #{drb.cfg.schema}.line_ads as l
        left join #{drb.cfg.schema}.ads as a on ( l.ads_id = a.id )
        where true
          and ( l.doc = $doc )
          and ( l.par = $par )
          and ( l.lnr = $lnr )
        order by l.ads_id;""", { doc, par, lnr, }
      # debug '^6684048^', ad
      line_text  += ad.chrs ? ''
      chrs_ctxt   = _escape_for_html_comment ad.chrs
      if ad.gid is missing.gid
        ### TAINT use standard method ###
        chrs_htxt = _escape_for_html_text ad.chrs
        relwdth   = ad.dx / 1000 ### relative width of missing outline rectangle ###
        element   = """<!--#{chrs_ctxt}--><use href='##{missing_sid}' class='missing' transform='translate(#{ad.x} #{ad.y}) scale(#{relwdth} 1)'/>\
          <text class='missing-chrs' style='font-size:1000px;transform:skew(#{fm.angle}deg)' x='#{ad.x}' y='#{ad.y}'>#{chrs_htxt}</text>"""
      else
        if ad.y is 0 then element = "<!--#{chrs_ctxt}--><use href='##{ad.sid}' x='#{ad.x}'/>"
        else              element = "<!--#{chrs_ctxt}--><use href='##{ad.sid}' x='#{ad.x}' y='#{ad.y}'/>"
      page  = append_to page, 'content', element
    page = append_to page, 'content', "</g>"
    info '^43487^', { doc, par, lnr, }, rpr line_text
  return page

# #-----------------------------------------------------------------------------------------------------------
# append_used_outlines_overview = ( page ) ->
#   x0      = 0
#   y0      = 70
#   swdth   = 0.25 # stroke width in mm
#   swdth  *= 1000 * size_mm * mm_p_u
#   page    = append_to page, 'content', "<g transform='translate(#{x0} #{y0}) scale(#{mm_p_u_txt})'>"
#   dx      = 1000 * 100 * mm_p_u
#   x       = -dx
#   for od from db SQL"select * from drb.outlines where fontnick = $fontnick order by sid;", { fontnick, }
#     x    += dx
#     page  = append_to page, 'content', "<!--#{od.chrs}--><use href='##{od.sid}' x='#{x}'/>"
#   page = append_to page, 'content', "</g>"
#   return page


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
  db              = new DBay { path: '/dev/shm/typesetting-1.sqlite', }
  drb             = new Drb { db, rebuild: true, RBW, path: '/dev/shm/typesetting-2.sqlite', }
  dtab            = new Tbl { db, }
  doc             = 1
  par             = 1
  page            = FS.readFileSync template_path, { encoding: 'utf-8', }
  page            = append_to page, 'grid', FS.readFileSync cm_grid_path, { encoding: 'utf-8', }
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
  { missing }     = Drb.C
  missing_sid     = "o0#{fontnick}"
  known_ods       = { [missing_sid]: { gid: missing.gid, sid: missing_sid, fontnick, }, }
  #.........................................................................................................
  ### Register, load and prepopulate font: ###
  drb.register_fontnick { fontnick, fspath, } if fspath?
  drb.prepare_font      { fontnick, }
  drb.arrange           { fontnick, text, doc, par, }
  drb.distribute        { doc, par, mm_p_u, width_mm, size_mm, }
  drb.compose           { fontnick, text, doc, par, }
  #.........................................................................................................
  x0    = 0
  y0    = 50
  page  = append_remarks  { drb, page, fontnick, }
  page  = append_outlines { drb, page, fontnick, size_mm, mm_p_u, missing, missing_sid, known_ods, }
  page  = append_content  { drb, page, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing, missing_sid, }
  #.........................................................................................................
  FS.writeFileSync target_path, page
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
  db              = new DBay { path: '/dev/shm/typesetting-1.sqlite', }
  drb             = new Drb { db, rebuild: true, RBW, path: '/dev/shm/typesetting-2.sqlite', }
  # dtab            = new Tbl { db, }
  page            = FS.readFileSync template_path, { encoding: 'utf-8', }
  page            = append_to page, 'grid', FS.readFileSync cm_grid_path, { encoding: 'utf-8', }
  { I, L, V }     = db.sql
  #.........................................................................................................
  drb.register_fontnick { fontnick, fspath, } if fspath?
  drb.prepare_font      { fontnick, }
  #.........................................................................................................
  page = append_to page, 'content', "<g transform='translate(#{0} #{10}) scale(#{mm_p_u_txt})'>"
  #.........................................................................................................
  for gid in [ gid_1 .. gid_2 ]
    { bbox
      pd    }   = drb.get_single_outline { gid, fontnick, }
    { x,  y,
      x1, y1, } = bbox
    sid         = "o#{gid}#{fontnick}" ### TAINT code duplication ###
    px          = ( gid %% 10 ) / mm_p_u * size_mm
    py          = ( gid // 10 ) / mm_p_u * size_mm
    tx          = px + ( ( 0.5 * size_mm ) / mm_p_u )
    ty          = py - ( ( 0.7 * size_mm ) / mm_p_u )
    page        = append_to page, 'outlines', "<path id='#{sid}' d='#{pd}'/>"
    page        = append_to page, 'content',  "<use href='##{sid}' x='#{px}' y='#{py}'/>"
    page        = append_to page, 'content',  "<text class='glyfgridgid' x='#{tx}' y='#{ty}'>#{gid}</text>"
  #.........................................................................................................
  page = append_to page, 'content', "</g>"
  FS.writeFileSync target_path, page
  return null


############################################################################################################
if require.main is module then do =>
  # @demo_typeset_sample_page { set_id: 'affirm-b42', }
  # @demo_typeset_sample_page { set_id: 'missing-t-b42', }
  # @demo_typeset_sample_page { set_id: 'medium-eg12i', }
  # @demo_typeset_sample_page { set_id: 'typo-b42', }
  # @demo_typeset_sample_page { set_id: 'gaga-b42', }
  # @demo_typeset_sample_page { set_id: 'medium-n1518', }
  @demo_typeset_sample_page { set_id: 'shorties-b42', }
  # @demo_typeset_sample_page { set_id: 'typo-b36', }
  # @demo_typeset_sample_page { set_id: 'egypt-eg12i', }
  # @demo_typeset_sample_page { set_id: 'egypt-b42', }
  # @demo_store_outlines()
  # @demo_store_outlines { set_id: 'all', }
  # @demo_typeset_sample_page { set_id: 'small-eg8i', }
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


