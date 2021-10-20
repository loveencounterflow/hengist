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

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      return (await this.demo_load_font_outlines());
    })();
  }

}).call(this);

//# sourceMappingURL=demos.js.map