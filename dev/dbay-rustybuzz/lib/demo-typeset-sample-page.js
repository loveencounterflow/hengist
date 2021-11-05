(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, ITXT, PATH, RBW, SQL, XXX_show_clusters, _escape_for_html_comment, _escape_for_html_text, _escape_syms, _prepare_text, append_content, append_content_fontmetrics, append_outlines, append_remarks, append_to, badge, debug, echo, equals, guy, help, info, isa, rpr, target_path, template_path, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  template_path = PATH.resolve(PATH.join(__dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-page.template.html'));

  target_path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/demo-typeset-sample-page.output.html'));

  ({to_width} = require('to-width'));

  ITXT = require('intertext');

  //-----------------------------------------------------------------------------------------------------------
  XXX_show_clusters = function(text, ads) {
    var cur_bidx, cur_text, d, d_idx, i, len, nxt_bidx, ref, ref1;
/* This is probably based on a misunderstanding of what `rustybuzz` means by 'cluster';
 see https://docs.rs/rustybuzz/0.4.0/rustybuzz/struct.GlyphInfo.html */
    for (d_idx = i = 0, len = ads.length; i < len; d_idx = ++i) {
      d = ads[d_idx];
      cur_bidx = d.bidx;
      nxt_bidx = (ref = (ref1 = ads[d_idx + 1]) != null ? ref1.bidx : void 0) != null ? ref : ads.length;
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
    return page.replace(marker, '\n' + text.toString() + marker);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  append_remarks = function(cfg) {
    var ad, fm, missing_chrs, missing_txt, page;
    ({page, fm, missing_chrs} = cfg);
    page = append_to(page, 'remarks', `<div>fm: ${rpr(fm)}</div>`);
    missing_txt = ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = missing_chrs.length; i < len; i++) {
        ad = missing_chrs[i];
        results.push(rpr(ad.chrs));
      }
      return results;
    })()).join(', ');
    return page = append_to(page, 'remarks', `<div>missing_chrs: ${missing_txt}</div>`);
  };

  //-----------------------------------------------------------------------------------------------------------
  /* TAINT use standard methods */
  _prepare_text = function(text) {
    var R;
    R = text;
    R = R.replace(/\n/g, ' ');
    R = R.replace(/\x20{2,}/g, ' ');
    R = ITXT.HYPH.hyphenate(R);
    R = R.replace(/&shy;/g, '\xad');
    R = R.replace(/&wbr;/g, '\u200b');
    // debug '^9865^', ITXT.HYPH.reveal_hyphens R, '|'; process.exit 1
    return R;
  };

  _escape_syms = function(text) {
    var R;
    R = text;
    R = R.replace(/\xad/g, '&shy;');
    R = R.replace(/\u200b/g, '&wbr;');
    return R;
  };

  _escape_for_html_comment = function(text) {
    return (_escape_syms(text != null ? text : '')).replace(/--/g, '- -');
  };

  _escape_for_html_text = function(text) {
    return ((text != null ? text : '').replace(/&/g, '&amp;')).replace(/</g, '&lt;');
  };

  //-----------------------------------------------------------------------------------------------------------
  append_outlines = function(cfg) {
    /* TAINT use standard method */
    var chrs_txt, known_ods, missing, missing_pd, missing_sid, od, page, sid;
    ({page, missing, missing_sid, missing_pd, known_ods} = cfg);
    page = append_to(page, 'outlines', `<!--NULL--><path id='${missing_sid}' class='missing' d='${missing_pd}'/>`);
    for (sid in known_ods) {
      od = known_ods[sid];
      if (od.gid === missing.gid) {
        continue;
      }
      chrs_txt = _escape_for_html_comment(od.chrs);
      page = append_to(page, 'outlines', `<!--${chrs_txt}--><path id='${sid}' d='${od.pd}'/>`);
    }
    return page;
  };

  //-----------------------------------------------------------------------------------------------------------
  append_content_fontmetrics = function(cfg) {
    var fm, page, scale, size_mm, swdth, x0, y0;
    ({page, x0, y0, size_mm, scale, fm} = cfg);
    swdth = 0.25; // stroke width in mm
    swdth *= 1000 * size_mm * scale;
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.ascender}' x2='10000' y2='${fm.ascender}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.descender}' x2='10000' y2='${fm.descender}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.x_height}' x2='10000' y2='${fm.x_height}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.capital_height}' x2='10000' y2='${fm.capital_height}'/>`);
    return page;
  };

  //-----------------------------------------------------------------------------------------------------------
  append_content = function(cfg) {
    /* TAINT use standard method */
    /* TAINT use standard method */
    /* TAINT must escape `d.chrs` */
    var ad, ads, chrs_ctxt, chrs_htxt, element, fm, i, len, missing, missing_sid, page, relwdth, scale, scale_txt, size_mm, text, x0, y0;
    ({page, x0, y0, size_mm, scale, scale_txt, fm, text, ads, missing, missing_sid} = cfg);
    page = append_to(page, 'textcontainer', `<div style='left:${x0}mm;top:${y0 - size_mm}mm;'>${text}</div>`);
    page = append_to(page, 'content', `<g transform='translate(${x0} ${y0}) scale(${scale_txt})'>`);
    page = append_content_fontmetrics({page, x0, y0, size_mm, scale, fm});
    for (i = 0, len = ads.length; i < len; i++) {
      ad = ads[i];
      chrs_ctxt = _escape_for_html_comment(ad.chrs);
      if (ad.gid === missing.gid) {
        chrs_htxt = _escape_for_html_text(ad.chrs);
        relwdth = ad.dx / 1000/* relative width of missing outline rectangle */
        element = `<!--${chrs_ctxt}--><use href='#${missing_sid}' class='missing' transform='translate(${ad.x} ${ad.y}) scale(${relwdth} 1)'/><text class='missing-chrs' style='font-size:1000px;' x='${ad.x}' y='${ad.y}'>${chrs_htxt}</text>`;
      } else {
        if (ad.y === 0) {
          element = `<!--${chrs_ctxt}--><use href='#${ad.sid}' x='${ad.x}'/>`;
        } else {
          element = `<!--${chrs_ctxt}--><use href='#${ad.sid}' x='${ad.x}' y='${ad.y}'/>`;
        }
      }
      page = append_to(page, 'content', element);
    }
    page = append_to(page, 'content', "</g>");
    return page;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // append_used_outlines_overview = ( page ) ->
  //   x0      = 0
  //   y0      = 70
  //   swdth   = 0.25 # stroke width in mm
  //   swdth  *= 1000 * size_mm * scale
  //   page    = append_to page, 'content', "<g transform='translate(#{x0} #{y0}) scale(#{scale_txt})'>"
  //   dx      = 1000 * 100 * scale
  //   x       = -dx
  //   for od from db SQL"select * from drb.outlines where fontnick = $fontnick order by sid;", { fontnick, }
  //     x    += dx
  //     page  = append_to page, 'content', "<!--#{od.chrs}--><use href='##{od.sid}' x='#{x}'/>"
  //   page = append_to page, 'content', "</g>"
  //   return page

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typeset_sample_page = function(cfg) {
    var I, L, Tbl, V, ads, cgid_map, chrs, collector, db, defaults, drb, dtab, fm, fontnick, fspath, i, joint, known_ods, len, missing, missing_chrs, missing_pd, missing_sid, new_ods, page, scale, scale_txt, segment, segments, set_id, shy, size_mm, slab, text, wbr, width_mm, x0, y0;
    defaults = {
      set_id: 'medium-eg8i'
    };
    cfg = {...defaults, ...cfg};
    ({set_id} = cfg);
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    ({Tbl} = require('../../../apps/icql-dba-tabulate'));
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      rebuild: true,
      RBW,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    dtab = new Tbl({db});
    page = FS.readFileSync(template_path, {
      encoding: 'utf-8'
    });
    ({I, L, V} = db.sql);
    //.........................................................................................................
    ({text, chrs, cgid_map, fontnick, fspath} = H.settings_from_set_id(set_id));
    text = _prepare_text(text);
    debug('^50598^', ({segments} = ITXT.SLABS.slabjoints_from_text(text)));
    collector = [];
    shy = '\xad';
    wbr = '\u200b';
    for (i = 0, len = segments.length; i < len; i++) {
      segment = segments[i];
      [slab, joint] = ITXT.SLABS.text_and_joint_from_segment(segment);
      collector.push((function() {
        switch (joint) {
          case '#':
            return slab + wbr;
          case '=':
            return slab.replace(/-$/, shy);
          case '°':
            return slab + ' ';
          default:
            throw new Error(`^8064563^ unknown joint ${rpr(joint)}`);
        }
      })());
    }
    text = collector.join('');
    text = text.replace(/\u200b{2,}/g, wbr);
    text = text.replace(/\u200b$/, '');
    text = text.replace(/^\u200b/, '');
    width_mm = 100;
    size_mm = 10;
    scale = size_mm / 1000;
    scale_txt = scale.toFixed(4);
    ({missing} = Drb.C);
    missing_sid = `o0${fontnick}`;
    missing_pd = 'M0 200 L0-800 L900-800 L900 200';
    known_ods = {
      [missing_sid]: {
        gid: missing.gid,
        sid: missing_sid,
        fontnick
      }
    };
    //.........................................................................................................
    /* Register, load and prepopulate font: */
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    ({known_ods, new_ods, missing_chrs, ads, fm} = drb.compose({fontnick, text, known_ods}));
    //.........................................................................................................
    x0 = 0;
    y0 = 50;
    page = append_remarks({page, fm, missing_chrs});
    page = append_outlines({page, missing, missing_sid, missing_pd, known_ods});
    page = append_content({page, x0, y0, size_mm, scale, scale_txt, fm, text, ads, missing, missing_sid});
    // page  = append_used_outlines_overview page
    //.........................................................................................................
    FS.writeFileSync(target_path, page);
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @demo_store_outlines()
      // await @demo_store_outlines { set_id: 'all', }
      // await @demo_typeset_sample_page { set_id: 'small-eg8i', }
      return (await this.demo_typeset_sample_page({
        set_id: 'medium-eg8i'
      }));
    })();
  }

  // await @demo_typeset_sample_page { set_id: 'small-aleo', }
// await @demo_typeset_sample_page { set_id: 'widechrs', }
// await @demo_typeset_sample_page { set_id: 'tibetan', }
// await @demo_typeset_sample_page { set_id: 'arabic', }
// await @demo_typeset_sample_page { set_id: 'urdu', }
// await @demo_typeset_sample_page { set_id: 'small-djvsi', }
// await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demo-typeset-sample-page.js.map