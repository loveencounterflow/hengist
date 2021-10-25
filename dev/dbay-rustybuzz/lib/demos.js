(function() {
  'use strict';
  var CND, FS, H, PATH, RBW, SQL, ZLIB, badge, debug, echo, equals, guy, help, info, isa, rpr, show_db, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ZLIB = require('zlib');

  //-----------------------------------------------------------------------------------------------------------
  show_db = function(db, schema) {
    var Tbl, dtab;
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    dtab = new Tbl({db});
    // echo dtab._tabulate db SQL"select * from #{schema}.outlines order by fontnick, gid;"
    echo(dtab._tabulate(db(SQL`select * from ${schema}.fontnicks order by fontnick;`)));
    echo(dtab._tabulate(db(SQL`select
    fontnick,
    gid,
    cid,
    glyph,
    uoid,
    -- soid,
    x,
    y,
    x1,
    y1,
    -- pd
    substring( pd, 0, 25 ) || '...' as "(pd)"
    -- substring( pd_blob, 0, 25 ) || '...' as "(pd_blob)"
  from ${schema}.outlines
  order by fontnick, gid
  limit 100;`)));
    echo(dtab._tabulate(db(SQL`select distinct
    fontnick,
    count(*) over ( partition by fontnick ) as outlines
  from ${schema}.outlines
  order by fontnick, gid
  limit 100;`)));
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_store_outlines = function(cfg) {
    /* NOTE exactly one of `cids`, `text` must be set */
    var DBay, Drb, bbox, cgid_map, cids, db, defaults, drb, drb_cfg, dt, fontnick, fspath, path, pd, schema, set_id, t0, t1, text;
    defaults = {
      set_id: 'small'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    path = '/tmp/dbay-rustybuzz.sqlite';
    db = new DBay({path});
    schema = 'drb';
    drb_cfg = {
      db: db,
      path: '/dev/shm/rustybuzz.sqlite',
      create: true,
      schema: schema
    };
    drb = new Drb(drb_cfg);
    //.........................................................................................................
    text = null;
    cids = null;
    cgid_map = null;
    //.........................................................................................................
    switch (set_id) {
      case 'small':
        fontnick = 'djvs';
        fspath = 'DejaVuSerif.ttf';
        text = "sampletext算";
        break;
      case 'all':
        fontnick = 'qkai';
        fspath = 'cwTeXQKai-Medium.ttf';
        cids = drb.get_unicode_codepoints();
        break;
      default:
        // fontnick = 'jzr';   fspath = 'jizura3b.ttf'
        /* TAINT obtain list of all valid Unicode codepoints (again) */
        // cids                = [ 0x0021 .. 0xd000 ]
        // cids                = [ 0x4e00 .. 0x9fff ]
        // cids                = [ 0x4e00 .. 0x4e02 ]
        throw new Error(`^345^ unknown set_id ${rpr(set_id)}`);
    }
    //.........................................................................................................
    fspath = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts/', fspath));
    //.........................................................................................................
    drb.register_fontnick({fontnick, fspath});
    whisper('^3334^', `loading font ${rpr(fontnick)}...`);
    drb.prepare_font({fontnick});
    whisper('^3334^', "... done");
    //.........................................................................................................
    urge('^290^', ({bbox, pd} = drb.get_single_outline({
      fontnick,
      gid: 74
    })));
    //.........................................................................................................
    t0 = Date.now();
    cgid_map = drb.get_cgid_map({cids, text, fontnick});
    t1 = Date.now();
    /* TAINT might want to turn this into a benchmark (or improve reporting) */
    debug('^324^', cgid_map.size + ' gids');
    debug('^324^', (dt = (t1 - t0) / 1000) + 's');
    help('^290^', (rpr(cgid_map)).slice(0, 200) + '...');
    //.........................................................................................................
    t0 = Date.now();
    drb.insert_outlines({fontnick, cgid_map});
    t1 = Date.now();
    debug('^324^', (dt = (t1 - t0) / 1000) + 's');
    //.........................................................................................................
    // echo dtab._tabulate db SQL"""
    //   with v1 as ( select count(*) as outline_count from #{schema}.outlines )
    //   select
    //     v1.outline_count / ? as "outlines per second"
    //   from v1;""", [ dt, ]
    //.........................................................................................................
    return show_db(db, schema);
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

  //-----------------------------------------------------------------------------------------------------------
  this.demo_use_linked_rustybuzz_wasm = function() {
    var font_bytes, font_idx, fontnick, fspath;
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    debug('^455^', RBW);
    fontnick = 'djvs';
    fspath = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/jizura-fonts/DejaVuSerif.ttf'));
    font_idx = 0;
    font_bytes = (FS.readFileSync(fspath)).toString('hex');
    RBW.register_font(font_idx, font_bytes);
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      await this.demo_store_outlines();
      return (await this.demo_store_outlines({
        set_id: 'all'
      }));
    })();
  }

  // await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demos.js.map