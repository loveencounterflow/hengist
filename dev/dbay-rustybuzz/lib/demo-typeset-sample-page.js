(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, RBW, SQL, XXX_show_clusters, badge, debug, echo, equals, guy, help, info, isa, rpr, target_path, tpl, tpl_path, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({DBay} = require(H.dbay_path));

  ({Drb} = require(H.drb_path));

  tpl_path = PATH.resolve(PATH.join(__dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-page.template.html'));

  tpl = FS.readFileSync(tpl_path, {
    encoding: 'utf-8'
  });

  target_path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/demo-typeset-sample-page.output.html'));

  //-----------------------------------------------------------------------------------------------------------
  XXX_show_clusters = function(text, arrangement) {
    var cur_bidx, cur_text, d, d_idx, i, len, nxt_bidx, ref, ref1;
/* This is probably based on a misunderstanding of what `rustybuzz` means by 'cluster';
 see https://docs.rs/rustybuzz/0.4.0/rustybuzz/struct.GlyphInfo.html */
    for (d_idx = i = 0, len = arrangement.length; i < len; d_idx = ++i) {
      d = arrangement[d_idx];
      cur_bidx = d.bidx;
      nxt_bidx = (ref = (ref1 = arrangement[d_idx + 1]) != null ? ref1.bidx : void 0) != null ? ref : arrangement.length;
      cur_text = text.slice(cur_bidx, nxt_bidx);
      info('^4448^', rpr(cur_text));
    }
    help('^4448^', rpr(text));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typeset_sample_page = function(cfg) {
    var arrangement, chrs, content, d, db, defaults, drb, fontnick, fspath, fudge, gid, gids, i, j, k, len, len1, len2, outline, page, scale, scale_txt, scaled_outlines, schema, set_id, size_mm, soid, text, unscaled_outlines, uoid, x, x0, xxx, y, y0;
    defaults = {
      set_id: 'smalli'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    RBW = require('../../../assets/dbay-rustybuzz/pkg');
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    schema = 'drb';
    drb = new Drb({
      db,
      RBW,
      create: true,
      schema,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    //.........................................................................................................
    ({text, fontnick, fspath} = H.settings_from_set_id(set_id));
    size_mm = 20;
    chrs = [...(new Set(Array.from(text)))];
    //.........................................................................................................
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    drb.insert_outlines({fontnick, chrs});
    // drb.shape_text        { fontnick, text, size_mm, }
    arrangement = drb.shape_text({
      fontnick,
      text,
      size_mm: 10
    });
    debug('^4455^', {
      fontnick,
      text,
      size_mm: 10
    });
    debug('^4455^', arrangement);
    page = tpl;
    gids = [
      ...(new Set((function() {
        var i,
      len,
      results;
        results = [];
        for (i = 0, len = arrangement.length; i < len; i++) {
          d = arrangement[i];
          results.push(d.gid);
        }
        return results;
      })()))
    ];
    //.........................................................................................................
    /* Part I: insert unscaled outlines */
    unscaled_outlines = [];
    for (i = 0, len = gids.length; i < len; i++) {
      gid = gids[i];
      outline = drb.get_single_outline({fontnick, gid});
      uoid = `o${gid}${fontnick}`;
      unscaled_outlines.push(`<path id='${uoid}' d='${outline.pd}'/>`);
    }
    unscaled_outlines = unscaled_outlines.join('\n');
    page = page.replace('<?unscaled_outlines?>', unscaled_outlines);
    //.........................................................................................................
    /* Part II: insert scaled outline defs */
    scaled_outlines = [];
    scale_txt = (size_mm / 1_000).toFixed(4);
    for (j = 0, len1 = gids.length; j < len1; j++) {
      gid = gids[j];
      uoid = `o${gid}${fontnick}`;
      soid = `s${gid}${fontnick}-${size_mm}`;
      scaled_outlines.push(`<use href='#${uoid}' id='${soid}' transform='scale(${scale_txt})'/>`);
    }
    scaled_outlines = scaled_outlines.join('\n');
    page = page.replace('<?scaled_outlines?>', scaled_outlines);
    //.........................................................................................................
    /* Part III: insert outline refs (the typesetting proper so to speak) */
    content = [];
    x0 = 0;
    y0 = 50;
    scale = size_mm / 1000;
    //  5mm -> 1 / 4
    //  6mm -> 1 / 3.3333
    // 10mm -> 1 / 2
    // 20mm -> 1 / 1
    // 40mm -> 2 / 1
    fudge = 1 / 2;
    for (k = 0, len2 = arrangement.length; k < len2; k++) {
      xxx = arrangement[k];
      gid = xxx.gid;
      soid = `s${gid}${fontnick}-${size_mm}`;
      x = x0 + (xxx.x * scale * fudge);
      y = y0 + (xxx.y * scale * fudge);
      content.push(`<use href='#${soid}' x='${x}' y='${y}'/>`);
      info('^3344^', `<use href='#${soid}' x='${x}' y='${y}'/>`);
    }
    content = content.join('\n');
    page = page.replace('<?content?>', content);
    //.........................................................................................................
    FS.writeFileSync(target_path, page);
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @demo_store_outlines()
      // await @demo_store_outlines { set_id: 'all', }
      return (await this.demo_typeset_sample_page());
    })();
  }

  // await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demo-typeset-sample-page.js.map