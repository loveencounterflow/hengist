
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
  { page, fm, missing_chrs, } = cfg
  page            = append_to page, 'remarks', "<div>fm: #{rpr fm}</div>"
  missing_txt     = ( rpr ad.chrs for ad in missing_chrs ).join ', '
  page            = append_to page, 'remarks', "<div>missing_chrs: #{missing_txt}</div>"

#-----------------------------------------------------------------------------------------------------------
### TAINT use standard methods ###
_prepare_text = ( text ) ->
  R = text
  R = R.replace /\n/g, ' '
  R = R.replace /\x20{2,}/g, ' '
  R = ITXT.HYPH.hyphenate R
  R = R.replace /&shy;/g, '\xad'
  R = R.replace /&wbr;/g, '\u200b'
  # debug '^9865^', ITXT.HYPH.reveal_hyphens R, '|'; process.exit 1
  return R

_escape_syms              = ( text ) ->
  R = text
  R = R.replace /\xad/g,   '&shy;'
  R = R.replace /\u200b/g, '&wbr;'
  return R
_escape_for_html_comment  = ( text ) ->   ( _escape_syms text ? '' ).replace /--/g, '- -'
_escape_for_html_text     = ( text ) -> ( ( text ? '' ).replace /&/g, '&amp;' ).replace /</g, '&lt;'

#-----------------------------------------------------------------------------------------------------------
append_outlines = ( cfg ) ->
  { page, fontnick, size_mm, mm_p_u, fm, missing, missing_sid, known_ods, } = cfg
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
  for sid, od of known_ods
    continue if od.gid is missing.gid
    ### TAINT use standard method ###
    chrs_txt  = _escape_for_html_comment od.chrs
    page      = append_to page, 'outlines', "<!--#{chrs_txt}--><path id='#{sid}' d='#{od.pd}'/>"
  return page

#-----------------------------------------------------------------------------------------------------------
_append_fontmetrics = ( cfg ) ->
  { page, size_mm, mm_p_u, fm, } = cfg
  swdth   = 0.25 # stroke width in mm
  swdth  *= 1000 * size_mm * mm_p_u
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.descender}' x2='10000' y2='#{fm.descender}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='0' x2='10000' y2='0'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.x_height}' x2='10000' y2='#{fm.x_height}'/>"
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.capital_height}' x2='10000' y2='#{fm.capital_height}'/>"
  return page

#-----------------------------------------------------------------------------------------------------------
_append_breakpoint = ( cfg ) ->
  { page, x0, y0, size_mm, mm_p_u, mm_p_u_txt, fm, text, ads, missing, missing_sid, } = cfg
  page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>"
  return page

#-----------------------------------------------------------------------------------------------------------
append_content = ( cfg ) ->
  { drb, page, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, fm, text, ads, missing, missing_sid, } = cfg
  page = append_to page, 'textcontainer', "<div style='left:#{x0}mm;top:#{y0 - size_mm}mm;'>#{text}</div>"
  { lines, } = drb.distribute { ads, mm_p_u, width_mm, size_mm, }
  # for ad in ads
  #   urge '^3980^', ad
  line_y0       = 20
  line_y_delta  = 10
  line_y        = line_y0 - line_y_delta
  for line, line_idx in lines
    # debug '^3337^', line
    # continue if line.length is 0
    adi_1       = line.adi_1
    adi_2       = line.adi_2
    # adi_1        = line.vnr_1[ 0 ]
    # adi_2        = line.vnr_2[ 0 ]
    line_y     += line_y_delta
    ad_br       = ads[ adi_2 ]
    do ->
      lads        = ads[ adi_1 .. adi_2 ]
      line_text   = ( ad.chrs for ad in lads ).join ''
      line_text  += '-' if ad_br.br is 'shy'
      info '^3980^', rpr line_text
    page = append_to page, 'content', "<g transform='translate(#{x0} #{line_y}) scale(#{mm_p_u_txt})'>"
    # page = _append_fontmetrics { page, size_mm, mm_p_u, fm, } # if line_idx is 0
    # debug '^3443^', ads[ adi ] for adi in [ adi_1 .. adi_2 ]
    for adi in [ adi_1 .. adi_2 ]
      ad  = ads[ adi ]
      break if ( ad.br is 'end' )
      # break if ( adi is adi_2 ) and ( ad.br in [ 'shy', 'wbr', ] )
      continue if ( ad.br in [ 'shy', 'wbr', ] )
      continue if ad.chrs is '\x20'
      x   = ad.x - line.dx0
      y   = line_y + ad.y
      ### TAINT use standard method ###
      chrs_ctxt = _escape_for_html_comment ad.chrs
      if ad.gid is missing.gid
        ### TAINT use standard method ###
        chrs_htxt = _escape_for_html_text ad.chrs
        relwdth = ad.dx / 1000 ### relative width of missing outline rectangle ###
        element = """<!--#{chrs_ctxt}--><use href='##{missing_sid}' class='missing' transform='translate(#{x} #{ad.y}) scale(#{relwdth} 1)'/>\
          <text class='missing-chrs' style='font-size:1000px;transform:skew(#{fm.angle}deg)' x='#{x}' y='#{ad.y}'>#{chrs_htxt}</text>"""
      else
        if ad.y is 0 then element = "<!--#{chrs_ctxt}--><use href='##{ad.sid}' x='#{x}'/>"
        else              element = "<!--#{chrs_ctxt}--><use href='##{ad.sid}' x='#{x}' y='#{ad.y}'/>"
      page  = append_to page, 'content', element
    page = append_to page, 'content', "</g>"
    # # page  = append_used_outlines_overview page
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
  page            = FS.readFileSync template_path, { encoding: 'utf-8', }
  page            = append_to page, 'grid', FS.readFileSync cm_grid_path, { encoding: 'utf-8', }
  { I, L, V }     = db.sql
  #.........................................................................................................
  { text
    chrs
    cgid_map
    fontnick
    fspath      } = H.settings_from_set_id set_id
  text            = _prepare_text text
  #---------------------------------------------------------------------------------------------------------
  { segments }    = ITXT.SLABS.slabjoints_from_text text
  ### TAINT make this a method ###
  ### TAINT use constants ###
  collector = []
  shy       = '\xad'
  wbr       = '\u200b'
  for segment in segments
    [ slab, joint, ] = ITXT.SLABS.text_and_joint_from_segment segment
    collector.push switch joint
      when '#' then slab + wbr
      when '=' then slab.replace /-$/, shy
      when '°' then slab + ' '
      else throw new Error "^8064563^ unknown joint #{rpr joint}"
  text = collector.join ''
  text = text.replace /\u200b{2,}/g, wbr
  text = text.replace /\u200b$/, ''
  text = text.replace /^\u200b/, ''
  #---------------------------------------------------------------------------------------------------------
  { segments }    = ITXT.SLABS.slabjoints_from_text text
  width_mm        = 100
  size_mm         = 10
  mm_p_u          = size_mm / 1000 # mm per unit as valid inside scaled `<g>` line element
  mm_p_u_txt      = mm_p_u.toFixed 4
  { missing }     = Drb.C
  missing_sid     = "o0#{fontnick}"
  known_ods       = { [missing_sid]: { gid: missing.gid, sid: missing_sid, fontnick, }, }
  #.........................................................................................................
  ### Register, load and prepopulate font: ###
  drb.register_fontnick { fontnick, fspath, }
  drb.prepare_font      { fontnick, }
  { known_ods
    new_ods
    missing_chrs
    ads
    fm          } = drb.compose { fontnick, text, known_ods, }
  #.........................................................................................................
  x0    = 0
  y0    = 50
  page  = append_remarks  { drb, page, fm, missing_chrs, }
  page  = append_outlines { drb, page, fontnick, size_mm, mm_p_u, fm, missing, missing_sid, known_ods, }
  page  = append_content  { drb, page, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, fm, text, ads, missing, missing_sid, }
  #.........................................................................................................
  FS.writeFileSync target_path, page
  return null


############################################################################################################
if require.main is module then do =>
  # await @demo_store_outlines()
  # await @demo_store_outlines { set_id: 'all', }
  # await @demo_typeset_sample_page { set_id: 'small-eg8i', }
  # await @demo_typeset_sample_page { set_id: 'medium-eg8i', }
  # await @demo_typeset_sample_page { set_id: 'longwords-eg12i', }
  # await @demo_typeset_sample_page { set_id: 'short-eg12i', }
  # await @demo_typeset_sample_page { set_id: 'medium-eg12i', }
  await @demo_typeset_sample_page { set_id: 'uppercasehyphen-eg12i', }
  # await @demo_typeset_sample_page { set_id: 'egypt-eg12i', }
  # await @demo_typeset_sample_page { set_id: 'small-aleo', }
  # await @demo_typeset_sample_page { set_id: 'widechrs', }
  # await @demo_typeset_sample_page { set_id: 'tibetan', }
  # await @demo_typeset_sample_page { set_id: 'arabic', }
  # await @demo_typeset_sample_page { set_id: 'urdu', }
  # await @demo_typeset_sample_page { set_id: 'small-djvsi', }
  # await @demo_use_linked_rustybuzz_wasm()


