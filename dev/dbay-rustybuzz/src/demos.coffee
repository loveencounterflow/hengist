
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
cids_from_text            = ( text ) -> ( ( chr.codePointAt 0 ) for chr in Array.from text )
ZLIB                      = require 'zlib'




#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_store_outlines = ->
  { DBay }            = require H.dbay_path
  { Drb }             = require H.drb_path
  { Tbl, }            = require '../../../apps/icql-dba-tabulate'
  path                = '/tmp/dbay-rustybuzz.sqlite'
  db                  = new DBay { path, }
  schema              = 'drb'
  drb_cfg             =
    db:             db
    path:           '/dev/shm/rustybuzz.sqlite'
    create:         true
    schema:         schema
  drb                 = new Drb drb_cfg
  dtab                = new Tbl { db, }
  # fontnick = 'jzr';   fspath = PATH.resolve PATH.join __dirname, '../../../', 'assets/jizura-fonts/jizura3b.ttf'
  fontnick = 'djvs';  fspath = PATH.resolve PATH.join __dirname, '../../../', 'assets/jizura-fonts/DejaVuSerif.ttf'
  # fontnick = 'qkai';  fspath = PATH.resolve PATH.join __dirname, '../../../', 'assets/jizura-fonts/cwTeXQKai-Medium.ttf'
  drb.register_fontnick { fontnick, fspath, }
  echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
  echo dtab._tabulate db SQL"select * from #{schema}.fontnicks order by fontnick;"
  whisper '^3334^', "loading font #{rpr fontnick}..."
  drb.prepare_font { fontnick, }
  whisper '^3334^', "... done"
  #.........................................................................................................
  # gid                 = drb.cgid_map_from_cids { cids: ( cids_from_text 'O' ), fontnick, }
  gid                 = 74
  font_idx            = 0
  # urge '^290^', outline = JSON.parse drb.RBW.glyph_to_svg_pathdata font_idx, gid
  urge '^290^', { bbox, pd, } = drb.get_single_outline { fontnick, gid, }
  #.........................................................................................................
  ### TAINT obtain list of all valid Unicode codepoints (again) ###
  cids                = cids_from_text "sampletext算"
  # cids                = [ 0x0021 .. 0xd000 ]
  # cids                = [ 0x4e00 .. 0x9fff ]
  # cids                = [ 0x4e00 .. 0x4e02 ]
  t0                  = Date.now()
  cgid_map            = drb.get_cgid_map { cids, fontnick, }
  t1                  = Date.now()
  ### TAINT might want to turn this into a benchmark (or improve reporting) ###
  debug '^324^', cids.length      + ' cids'
  debug '^324^', cgid_map.size + ' gids'
  debug '^324^', ( dt = ( t1 - t0 ) / 1000 ) + 's'
  help '^290^',  ( rpr cgid_map )[ ... 200 ] + '...'
  #.........................................................................................................
  t0                  = Date.now()
  drb.insert_outlines { fontnick, cgid_map, }
  t1                  = Date.now()
  debug '^324^', ( dt = ( t1 - t0 ) / 1000 ) + 's'
  #.........................................................................................................
  echo dtab._tabulate db SQL"""
    select
        fontnick,
        gid,
        cid,
        glyph,
        uoid,
        x,
        y,
        x1,
        y1,
        substring( pd, 0, 25 ) || '...' as "(pd)"
        -- substring( pd_blob, 0, 25 ) || '...' as "(pd_blob)"
      from #{schema}.outlines
      order by fontnick, gid
      limit 100;"""
  echo dtab._tabulate db SQL"""
    with v1 as ( select count(*) as outline_count from #{schema}.outlines )
    select
      v1.outline_count / ? as "outlines per second"
    from v1;""", [ dt, ]
  return null


# #-----------------------------------------------------------------------------------------------------------
# @demo_text_shaping = ->
#   me                  = @new_demo()
#   fontnick            = 'garamond_italic'
#   font_idx            = @register_font me, fontnick
#   size                = 5
#   # format              = 'short'
#   format              = 'json'
#   # format              = 'rusty'
#   text                = "a certain minimum"
#   text                = text.replace /#/g, me.shy
#   cfg                 = { format, text, }
#   arrangement         = JSON.parse RBW.shape_text cfg
#   debug '^4455^', arrangement
#   debug '^4455^', RBW.shape_text { format: 'rusty', text, }
#   #.........................................................................................................
#   urge "glyf IDs and positions of font #{rpr fontnick} for text #{rpr text}:"
#   for d in arrangement
#     goid   = @_get_glyf_outline_id       fontnick, d.gid
#     sgoid  = @_get_sized_glyf_outline_id fontnick, d.gid, size
#     info '^223^', goid, sgoid
#   #.........................................................................................................
#   urge "unique glyf IDs in this text:"
#   gids                = new Set ( d.gid for d in arrangement )
#   debug '^3344^', gids
#   return null

# #-----------------------------------------------------------------------------------------------------------
# @demo_svg_typesetting = ->
#   me        = @new_demo()
#   format    = 'json' # 'short', 'rusty'
#   #.........................................................................................................
#   fontnick  = 'tibetan';          text =  "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ"
#   fontnick  = 'amiri';            text = ( [ "الخط الأمیری"... ].reverse() ).join ''
#   fontnick  = 'garamond_italic';  text = "a certain minimum"
#   fontnick  = 'garamond_italic';  text = "af#fix"
#   #.........................................................................................................
#   font_idx  = @register_font me, fontnick
#   text      = text.replace /#/g, me.shy
#   #.........................................................................................................
#   echo """<?xml version='1.0' encoding='UTF-8'?>
#     <svg xmlns='http://www.w3.org/2000/svg' width='6000' height='3000' viewBox='-100 -1500 10500 1500' version='2'>"""
#   cfg         = { format, text, }
#   arrangement = JSON.parse RBW.shape_text cfg
#   gids        = new Set ( d.gid for d in arrangement )
#   debug '^3344^', gids
#   #.........................................................................................................
#   echo """<style>
#     path {
#       stroke:                 transparent;
#       stroke-width:           0mm;
#       fill:                   black;; }
#     rect {
#       stroke:                 transparent;
#       stroke-width:           0;
#       fill:                   transparent; }
#       </style>"""
#   # echo """<style>
#   #   path {
#   #     stroke:                 black;
#   #     stroke-width:           8px;
#   #     fill:                   #880000bd;; }
#   #   rect {
#   #     stroke:                 black;
#   #     stroke-width:           3px;
#   #     fill:                   #ffeb3b42; }
#   #     </style>"""
#   #.........................................................................................................
#   echo "<defs>"
#   for gid from gids.values()
#     outline = JSON.parse RBW.glyph_to_svg_pathdata font_idx, gid
#     debug '^3344^', gid, outline.pd[ .. 100 ]
#     # continue if outline.pd is ''
#     echo "<symbol overflow='visible' id='b#{gid}'>#{outline.br}</symbol>"
#     echo "<symbol overflow='visible' id='g#{gid}'><path d='#{outline.pd}'/></symbol>"
#   echo "</defs>"
#   #.........................................................................................................
#   for d in arrangement
#     echo "<use href='#g#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
#     echo "<use href='#b#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
#     # echo "<g x='#{d.x}' y='#{d.y + 1000}'>"
#     # echo "#{outline.br}"
#     # echo "</g>"
#   #.........................................................................................................
#   echo "</svg>"
#   return null

#-----------------------------------------------------------------------------------------------------------
@demo_use_linked_rustybuzz_wasm = ->
  RBW = require '../../../apps/rustybuzz-wasm/pkg'
  debug '^455^', RBW
  fontnick    = 'djvs';  fspath = PATH.resolve PATH.join __dirname, '../../../', 'assets/jizura-fonts/DejaVuSerif.ttf'
  font_idx    = 0
  font_bytes  = ( FS.readFileSync fspath ).toString 'hex'
  RBW.register_font font_idx, font_bytes
  return null


############################################################################################################
if require.main is module then do =>
  await @demo_store_outlines()
  # await @demo_use_linked_rustybuzz_wasm()

