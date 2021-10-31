
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
tpl_path                  = PATH.resolve PATH.join __dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-page.template.html'
tpl                       = FS.readFileSync tpl_path, { encoding: 'utf-8', }
target_path               = PATH.resolve PATH.join __dirname, '../../../apps-typesetting/html+svg-demos/demo-typeset-sample-page.output.html'
{ to_width }              = require 'to-width'


#-----------------------------------------------------------------------------------------------------------
XXX_show_clusters = ( text, arrangement ) ->
  ### This is probably based on a misunderstanding of what `rustybuzz` means by 'cluster';
  see https://docs.rs/rustybuzz/0.4.0/rustybuzz/struct.GlyphInfo.html ###
  for d, d_idx in arrangement
    cur_bidx  = d.bidx
    nxt_bidx  = arrangement[ d_idx + 1 ]?.bidx ? arrangement.length
    cur_text  = text[ cur_bidx ... nxt_bidx ]
    info '^4448^', rpr cur_text
  help '^4448^', rpr text
  return null


#-----------------------------------------------------------------------------------------------------------
append_to = ( page, name, text ) ->
  text = rpr text unless isa.text text
  echo ( CND.reverse CND.grey to_width name, 15 ) + ( CND.reverse CND.gold ' ' + to_width text, 108 )
  marker = "<!--?#{name}-end?-->"
  return page.replace marker, text.toString() + marker + '\n'

#-----------------------------------------------------------------------------------------------------------
@demo_typeset_sample_page = ( cfg ) ->
  defaults            = { set_id: 'small-eg8i', }
  cfg                 = { defaults..., cfg..., }
  { set_id }          = cfg
  RBW                 = require '../../../apps/rustybuzz-wasm/pkg'
  db                  = new DBay { path: '/dev/shm/typesetting-1.sqlite', }
  drb                 = new Drb { db, create: true, RBW, path: '/dev/shm/typesetting-2.sqlite', }
  #.........................................................................................................
  { text
    fontnick
    fspath          } = H.settings_from_set_id set_id
  size_mm             = 10
  scale               = size_mm / 1000
  scale_txt           = scale.toFixed 4
  chrs                = [ ( new Set Array.from text )..., ]
  #.........................................................................................................
  drb.register_fontnick { fontnick, fspath, }
  drb.prepare_font      { fontnick, }
  drb.insert_outlines   { fontnick, chrs, }
  # drb.shape_text        { fontnick, text, size_mm, }
  arrangement = drb.shape_text { fontnick, text, size_mm, }
  page        = tpl
  gids        = [ ( new Set ( d.gid for d in arrangement ) )..., ]
  #.........................................................................................................
  fm          = drb.get_font_metrics { fontnick, }
  page        = append_to page, 'remarks', rpr fm
  #.........................................................................................................
  ### Part I: insert unscaled outlines ###
  insert_outlines = ( page ) ->
    unscaled_outlines = []
    for gid in gids
      outline = drb.get_single_outline { fontnick, gid, }
      uoid    = "o#{gid}#{fontnick}"
      page    = append_to page, 'unscaled-outlines', "<path id='#{uoid}' d='#{outline.pd}'/>"
    return page
  #.........................................................................................................
  insert_content = ( page ) ->
    # page = page.replace '<?scaled_outlines?>', ''
    #.........................................................................................................
    ### Part III: insert outline refs (the typesetting proper so to speak) ###
    content = []
    x0      = 0
    y0      = 50
    page    = append_to page, 'content', "<g transform='translate(#{x0} #{y0}) scale(#{scale_txt})'>"
    page    = append_to page, 'content', "<rect class='typeframe' x='0' y='-800' width='10000' height='1000'/>"
    for xxx in arrangement
      gid     = xxx.gid
      uoid    = "o#{gid}#{fontnick}"
      x       = Math.round xxx.x
      y       = Math.round xxx.y
      if y != 0 then  element = "<use href='##{uoid}' x='#{x}' y='#{y}'/>"
      else            element = "<use href='##{uoid}' x='#{x}'/>"
      page    = append_to page, 'content', element
    page    = append_to page, 'content', "</g>"
    return page
  #.........................................................................................................
  page = insert_outlines  page
  page = insert_content   page
  FS.writeFileSync target_path, page
  #.........................................................................................................
  return null



############################################################################################################
if require.main is module then do =>
  # await @demo_store_outlines()
  # await @demo_store_outlines { set_id: 'all', }
  await @demo_typeset_sample_page { set_id: 'small-eg8i', }
  # await @demo_typeset_sample_page { set_id: 'small-djvsi', }
  # await @demo_use_linked_rustybuzz_wasm()


