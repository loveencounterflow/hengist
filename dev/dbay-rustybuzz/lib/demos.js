(function() {
  'use strict';
  var CND, FS, PATH, RBW, SQL, Xxx, badge, debug, echo, equals, guy, help, info, isa, rpr, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  Xxx = class Xxx {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      var entry, fontname, ref;
      // @state =
      // shy:          '\xad'
      this._prv_fontidx = -1;
      this._last_fontidx = 15;
      this.fonts = {
        garamond_italic: {
          path: 'EBGaramond08-Italic.otf'
        },
        amiri: {
          path: 'arabic/Amiri-0.113/Amiri-Bold.ttf'
        },
        tibetan: {
          path: '/usr/share/fonts/truetype/tibetan-machine/TibetanMachineUni.ttf'
        },
        notoserif: {
          path: 'NotoSerifJP/NotoSerifJP-Medium.otf'
        }
      };
      ref = this.fonts;
      /* TAINT disregarding font, size for the moment */
      // @slab_widths = {}
      //.........................................................................................................
      for (fontname in ref) {
        entry = ref[fontname];
        this.fonts[fontname].font_idx = null;
        this.fonts[fontname].path = this._resolve_font_path(entry.path);
      }
      //.........................................................................................................
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _resolve_font_path(font_path) {
      var jzrfonts_path;
      if (font_path.startsWith('/')) {
        return font_path;
      }
      jzrfonts_path = '../../../assets/jizura-fonts';
      return PATH.resolve(PATH.join(__dirname, jzrfonts_path, font_path));
    }

    //---------------------------------------------------------------------------------------------------------
    _get_font_bytes(font_path) {
      return (FS.readFileSync(font_path)).toString('hex');
    }

    //---------------------------------------------------------------------------------------------------------
    register_font(fontnick) {
      var R, font_bytes, font_entry;
      //.........................................................................................................
      if ((font_entry = this.fonts[fontnick]) == null) {
        throw new Error(`^1w37^ unknown fontnick ${rpr(fontnick)}`);
      }
      //.........................................................................................................
      if (!(this._prv_fontidx < this._last_fontidx)) {
        throw new Error(`^1w37^ capacity of ${this._last_fontidx + 1} fonts exceeded`);
      }
      if ((R = font_entry.font_idx) != null) {
        //.........................................................................................................
        return R;
      }
      //.........................................................................................................
      R = this._prv_fontidx += 1;
      whisper(`^register_font@1^ reading font ${fontnick}...`);
      font_bytes = this._get_font_bytes(font_entry.path);
      whisper("^register_font@2^ ...done");
      whisper(`^register_font@3^ sending font ${fontnick} to registry...`);
      RBW.register_font(R, font_bytes);
      whisper("^register_font@4^ ...done");
      font_entry.font_idx = R;
      return R;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_load_font_outlines = function() {
    var font_idx, gid, outline, xxx;
    xxx = new Xxx();
    debug('^290^', xxx);
    debug('^290^', font_idx = xxx.register_font('garamond_italic'));
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