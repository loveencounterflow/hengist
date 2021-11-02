(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, RBW, SQL, XXX_show_clusters, append_to, badge, debug, echo, equals, guy, help, info, isa, rpr, target_path, to_width, tpl, tpl_path, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({to_width} = require('to-width'));

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
  append_to = function(page, name, text) {
    var marker;
    if (!isa.text(text)) {
      text = rpr(text);
    }
    echo((CND.reverse(CND.grey(to_width(name, 15)))) + (CND.reverse(CND.gold(' ' + to_width(text, 108)))));
    marker = `<!--?${name}-end?-->`;
    return page.replace(marker, text.toString() + marker + '\n');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typeset_sample_page = function(cfg) {
    var I, L, V, arrangement, bbox, cgid_map, chrs, cids, d, db, defaults, drb, fm, fontnick, fspath, i, insert_content, insert_outlines, k, known_ods, known_sids, len, page, pd, ref, required_xds, scale, scale_txt, set_id, sid, size_mm, text, v;
    defaults = {
      set_id: 'small-eg8i'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      create: true,
      RBW,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    ({I, L, V} = db.sql);
    //.........................................................................................................
    ({text, chrs, cids, cgid_map, fontnick, fspath} = H.settings_from_set_id(set_id));
    size_mm = 10;
    scale = size_mm / 1000;
    scale_txt = scale.toFixed(4);
    // chrs            = [ ( new Set Array.from text )..., ]
    //.........................................................................................................
    /* Need to find a way to find associations between CIDs and GIDs */
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    drb.insert_outlines({fontnick, chrs, cids, cgid_map});
    arrangement = drb.shape_text({fontnick, text});
    // debug '^33443^', arrangement
    //.........................................................................................................
    page = tpl;
    required_xds = {};
    for (i = 0, len = arrangement.length; i < len; i++) {
      d = arrangement[i];
      required_xds[d.sid] = d;
    }
    known_ods = {};
    debug('^3343^', "required_xds:", (Object.keys(required_xds)).length);
    debug('^3343^', "known_ods:   ", (Object.keys(known_ods)).length);
    (() => {
      var od, ref, required_sids;
      required_sids = Object.keys(required_xds);
      ref = db(SQL`select
    *
  from outlines
  where sid in ${V(required_sids)};`);
      for (od of ref) {
        urge('^33443^', to_width(rpr(od), 100));
        known_ods[od.sid] = od;
        delete required_xds[od.sid];
      }
      return null;
    })();
    debug('^3343^', "required_xds:", (Object.keys(required_xds)).length);
    debug('^3343^', "known_ods:   ", (Object.keys(known_ods)).length);
    for (k in required_xds) {
      v = required_xds[k];
      info(k, to_width(rpr(v), 100));
    }
    for (k in known_ods) {
      v = known_ods[k];
      info(k, to_width(rpr(v), 100));
    }
    //.........................................................................................................
    cgid_map = new Map();
    ref = drb.insert_and_walk_outlines({fontnick, chrs, cids, cgid_map});
    for (d of ref) {
      debug('^3443^', d);
    }
    //.........................................................................................................
    return null;
    // known_ods[ d.]      =
    known_sids = new Set(db.first_values(SQL`select sid from outlines where fontnick = $fontnick;`, {fontnick}));
    // missing_sids    = new Set [ required_sids..., ].filter ( sid ) -> not known_sids.has sid
    debug('^44552^', {required_sids, known_sids, missing_sids});
    //.........................................................................................................
    // fetch_outlines  = SQL"select * from outlines where fontnick = $fontnick and gid in #{V [ missing_sids..., ]};"
    return null;
// outlines        = {}
// bboxes          = {}
    for (sid of missing_sids) {
      ({bbox, pd} = drb.get_single_outline({sid}));
      // debug '^3332^', entry
      continue;
      urge('^3343^', to_width(rpr(d), 108));
      known_sids.add(d.gid);
      page = append_to(page, 'outlines', `<path id='${d.uoid}' d='${d.pd}'/>`);
    }
    // debug '^3332^',
    return null;
    //.........................................................................................................
    fm = drb.get_font_metrics({fontnick});
    page = append_to(page, 'remarks', rpr(fm));
    //.........................................................................................................
    /* Part I: insert unscaled outlines */
    insert_outlines = function(page) {
      var gid, j, len1, outline, unscaled_outlines, uoid;
      unscaled_outlines = [];
      for (j = 0, len1 = gids.length; j < len1; j++) {
        gid = gids[j];
        outline = drb.get_single_outline({fontnick, gid});
        uoid = `o${gid}${fontnick}`;
        page = append_to(page, 'outlines', `<path id='${uoid}' d='${outline.pd}'/>`);
      }
      return page;
    };
    //.........................................................................................................
    /* Part II: insert outline refs (the typesetting proper so to speak) */
    insert_content = function(page) {
      var content, element, gid, j, len1, swdth, uoid, x, x0, xxx, y, y0;
      content = [];
      x0 = 0;
      y0 = 50;
      swdth = 0.25; // stroke width in mm
      swdth *= 1000 * size_mm * scale;
      page = append_to(page, 'content', `<g transform='translate(${x0} ${y0}) scale(${scale_txt})'>`);
      // page    = append_to page, 'content', "<rect class='typeframe' x='0' y='-800' width='10000' height='1000'/>"
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.ascender}' x2='10000' y2='${fm.ascender}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.descender}' x2='10000' y2='${fm.descender}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.x_height}' x2='10000' y2='${fm.x_height}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.capital_height}' x2='10000' y2='${fm.capital_height}'/>`);
      for (j = 0, len1 = arrangement.length; j < len1; j++) {
        xxx = arrangement[j];
        gid = xxx.gid;
        uoid = `o${gid}${fontnick}`;
        x = Math.round(xxx.x);
        y = Math.round(xxx.y);
        if (y !== 0) {
          element = `<use href='#${uoid}' x='${x}' y='${y}'/>`;
        } else {
          element = `<use href='#${uoid}' x='${x}'/>`;
        }
        page = append_to(page, 'content', element);
      }
      page = append_to(page, 'content', "</g>");
      return page;
    };
    //.........................................................................................................
    page = insert_outlines(page);
    page = insert_content(page);
    FS.writeFileSync(target_path, page);
    //.........................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @demo_store_outlines()
      // await @demo_store_outlines { set_id: 'all', }
      return (await this.demo_typeset_sample_page({
        set_id: 'small-eg8i'
      }));
    })();
  }

  // await @demo_typeset_sample_page { set_id: 'small-aleo', }
// await @demo_typeset_sample_page { set_id: 'widechrs', }
// await @demo_typeset_sample_page { set_id: 'small-djvsi', }
// await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demo-typeset-sample-page.js.map