(function() {
  'use strict';
  var CND, FS, H, PATH, RBW, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/DEMOS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'
  RBW = require('rustybuzz-wasm');

  H = require('./helpers');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_load_font_outlines = function() {
    var DBay, Drb, db, drb, font_idx, gid, outline;
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    // { Tbl, }            = require '../../../apps/icql-dba-tabulate'
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true
    });
    debug('^290^', drb);
    debug('^290^', drb.sql.upsert_fontnick);
    debug('^290^', font_idx = drb.register_font('garamond_italic'));
    gid = 74;
    urge('^290^', outline = JSON.parse(RBW.glyph_to_svg_pathdata(font_idx, gid)));
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @demo_text_shaping = ->
  //   me                  = @new_demo()
  //   fontnick            = 'garamond_italic'
  //   font_idx            = @register_font me, fontnick
  //   size                = 5
  //   # format              = 'short'
  //   format              = 'json'
  //   # format              = 'rusty'
  //   text                = "a certain minimum"
  //   text                = text.replace /#/g, me.shy
  //   cfg                 = { format, text, }
  //   arrangement         = JSON.parse RBW.shape_text cfg
  //   debug '^4455^', arrangement
  //   debug '^4455^', RBW.shape_text { format: 'rusty', text, }
  //   #.........................................................................................................
  //   urge "glyf IDs and positions of font #{rpr fontnick} for text #{rpr text}:"
  //   for d in arrangement
  //     goid   = @_get_glyf_outline_id       fontnick, d.gid
  //     sgoid  = @_get_sized_glyf_outline_id fontnick, d.gid, size
  //     info '^223^', goid, sgoid
  //   #.........................................................................................................
  //   urge "unique glyf IDs in this text:"
  //   gids                = new Set ( d.gid for d in arrangement )
  //   debug '^3344^', gids
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @demo_svg_typesetting = ->
  //   me        = @new_demo()
  //   format    = 'json' # 'short', 'rusty'
  //   #.........................................................................................................
  //   fontnick  = 'tibetan';          text =  "ཨོཾ་མ་ཎི་པདྨེ་ཧཱུྃ"
  //   fontnick  = 'amiri';            text = ( [ "الخط الأمیری"... ].reverse() ).join ''
  //   fontnick  = 'garamond_italic';  text = "a certain minimum"
  //   fontnick  = 'garamond_italic';  text = "af#fix"
  //   #.........................................................................................................
  //   font_idx  = @register_font me, fontnick
  //   text      = text.replace /#/g, me.shy
  //   #.........................................................................................................
  //   echo """<?xml version='1.0' encoding='UTF-8'?>
  //     <svg xmlns='http://www.w3.org/2000/svg' width='6000' height='3000' viewBox='-100 -1500 10500 1500' version='2'>"""
  //   cfg         = { format, text, }
  //   arrangement = JSON.parse RBW.shape_text cfg
  //   gids        = new Set ( d.gid for d in arrangement )
  //   debug '^3344^', gids
  //   #.........................................................................................................
  //   echo """<style>
  //     path {
  //       stroke:                 transparent;
  //       stroke-width:           0mm;
  //       fill:                   black;; }
  //     rect {
  //       stroke:                 transparent;
  //       stroke-width:           0;
  //       fill:                   transparent; }
  //       </style>"""
  //   # echo """<style>
  //   #   path {
  //   #     stroke:                 black;
  //   #     stroke-width:           8px;
  //   #     fill:                   #880000bd;; }
  //   #   rect {
  //   #     stroke:                 black;
  //   #     stroke-width:           3px;
  //   #     fill:                   #ffeb3b42; }
  //   #     </style>"""
  //   #.........................................................................................................
  //   echo "<defs>"
  //   for gid from gids.values()
  //     outline = JSON.parse RBW.glyph_to_svg_pathdata font_idx, gid
  //     debug '^3344^', gid, outline.pd[ .. 100 ]
  //     # continue if outline.pd is ''
  //     echo "<symbol overflow='visible' id='b#{gid}'>#{outline.br}</symbol>"
  //     echo "<symbol overflow='visible' id='g#{gid}'><path d='#{outline.pd}'/></symbol>"
  //   echo "</defs>"
  //   #.........................................................................................................
  //   for d in arrangement
  //     echo "<use href='#g#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
  //     echo "<use href='#b#{d.gid}' x='#{d.x}' y='#{d.y}'/>"
  //     # echo "<g x='#{d.x}' y='#{d.y + 1000}'>"
  //     # echo "#{outline.br}"
  //     # echo "</g>"
  //   #.........................................................................................................
  //   echo "</svg>"
  //   return null

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await this.demo_load_font_outlines());
    })();
  }

}).call(this);

//# sourceMappingURL=demos.js.map