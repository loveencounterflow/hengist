(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, ITXT, PATH, RBW, SQL, XXX_show_clusters, _append_fontmetrics, _escape_for_html_comment, _escape_for_html_text, _escape_syms, _prepare_text, append_content, append_outlines, append_remarks, append_to, badge, cm_grid_path, debug, echo, equals, guy, help, info, isa, rpr, target_path, template_path, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

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

  cm_grid_path = PATH.resolve(PATH.join(__dirname, '../../../assets/dbay-rustybuzz/demo-typeset-sample-cmgrid.svg'));

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
    var drb, fm, fontnick, missing_chrs, page;
    ({drb, page, missing_chrs, fontnick} = cfg);
    fm = drb.get_fontmetrics({fontnick});
    page = append_to(page, 'remarks', `<div>fm: ${rpr(fm)}</div>`);
    // missing_txt     = ( rpr ad.chrs for ad in missing_chrs ).join ', '
    // page            = append_to page, 'remarks', "<div>missing_chrs: #{missing_txt}</div>"
    return page;
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
    var bottom, chrs_txt, drb, fm, fontnick, left, missing, missing_pd, missing_sid, mm_p_u, od, owdth, page, ref, right, size_mm, swdth, top;
    ({drb, page, fontnick, size_mm, mm_p_u, missing, missing_sid} = cfg);
    fm = drb.get_fontmetrics({fontnick});
    swdth = 0.5; // stroke width in mm
    swdth *= 1000 * size_mm * mm_p_u;
    owdth = 3 * swdth;
    top = fm.ascender - owdth;
    bottom = fm.descender + owdth;
    left = Math.round(owdth * 0.5);
    right = Math.round(1000 - owdth * 0.5);
    // debug '^432433^', 2
    missing_pd = `M${left} ${bottom} L${left} ${top} L${right} ${top} L${right} ${bottom}`;
    page = append_to(page, 'outlines', `<!--NULL--><path id='${missing_sid}' class='missing' d='${missing_pd}' transform='skewX(${fm.angle})'/>`);
    page = append_to(page, 'outlines', `<!--SHY--><line id='oshy-${fontnick}' class='fontmetric shy' stroke-width='${swdth}' x1='0' y1='${bottom}' x2='0' y2='${top}' transform='skewX(${fm.angle})'/>`);
    page = append_to(page, 'outlines', `<!--WBR--><line id='owbr-${fontnick}' class='fontmetric wbr' stroke-width='${swdth}' x1='0' y1='${bottom}' x2='0' y2='${top}' transform='skewX(${fm.angle})'/>`);
    ref = drb.db(SQL`select * from outlines;`);
    for (od of ref) {
      // continue if od.gid is missing.gid
      /* TAINT use standard method */
      chrs_txt = _escape_for_html_comment(od.chrs);
      page = append_to(page, 'outlines', `<!--${chrs_txt}--><path class='shady' id='${od.sid}' d='${od.pd}'/>`);
    }
    return page;
  };

  //-----------------------------------------------------------------------------------------------------------
  _append_fontmetrics = function(cfg) {
    var drb, fm, fontnick, mm_p_u, page, size_mm, swdth;
    ({drb, page, fontnick, size_mm, mm_p_u} = cfg);
    fm = drb.get_fontmetrics({fontnick});
    swdth = 0.25; // stroke width in mm
    swdth *= 1000 * size_mm * mm_p_u;
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.ascender}' x2='10000' y2='${fm.ascender}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.descender}' x2='10000' y2='${fm.descender}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='0' x2='10000' y2='0'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.x_height}' x2='10000' y2='${fm.x_height}'/>`);
    page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.capital_height}' x2='10000' y2='${fm.capital_height}'/>`);
    return page;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // _append_breakpoint = ( cfg ) ->
  //   { page, x0, y0, size_mm, mm_p_u, mm_p_u_txt, fm, text, ads, missing, missing_sid, } = cfg
  //   page    = append_to page, 'content', "<line class='fontmetric' stroke-width='#{swdth}' x1='0' y1='#{fm.ascender}' x2='10000' y2='#{fm.ascender}'/>"
  //   return page

  //-----------------------------------------------------------------------------------------------------------
  append_content = function(cfg) {
    /* TAINT use standard method */
    /* TAINT add to cfg type */
    /* TAINT use API */
    /* TAINT use field `rnr` to determine where to stop */
    var ad, chrs_ctxt, chrs_htxt, doc, drb, element, fm, fontnick, i, line_text, line_y, line_y0, line_y_delta, lnr, lnr_1, lnr_2, missing, missing_sid, mm_p_u, mm_p_u_txt, page, par, ref, ref1, ref2, ref3, relwdth, size_mm, text, width_mm, x0, y0;
    ({drb, page, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing, missing_sid} = cfg);
    fm = drb.get_fontmetrics({fontnick});
    if (cfg.skip_shy_etc == null) {
      cfg.skip_shy_etc = false;
    }
    if (cfg.skip_ws == null) {
      cfg.skip_ws = false;
    }
    page = append_to(page, 'textcontainer', `<div style='left:${x0}mm;top:${y0 - size_mm}mm;'>${text}</div>`);
    // for ad in ads
    //   urge '^3980^', ad
    line_y0 = 20;
    line_y_delta = 10;
    line_y = line_y0 - line_y_delta;
    doc = 1;
    par = 1;
    //.........................................................................................................
    lnr_1 = 1;
    lnr_2 = drb.db.single_value(SQL`select
    max( lnr ) as lnr_2
  from ${drb.cfg.schema}.lines
  where true
    and ( doc = $doc )
    and ( par = $par );`, {doc, par});
    for (lnr = i = ref = lnr_1, ref1 = lnr_2; (ref <= ref1 ? i <= ref1 : i >= ref1); lnr = ref <= ref1 ? ++i : --i) {
      page = append_to(page, 'content', `<g transform='translate(${x0} ${line_y}) scale(${mm_p_u_txt})'>`);
      line_text = '';
      line_y = line_y0 + (line_y_delta * (lnr - 1));
      ref2 = drb.db(SQL`select
    a.sid     as sid,
    a.chrs    as chrs,
    a.dx      as dx,
    a.dy      as dy,
    l.x       as x,
    l.y       as y,
    l.lnr     as lnr,
    l.ads_id  as ads_id
  from ${drb.cfg.schema}.line_ads as l
  left join ${drb.cfg.schema}.ads as a on ( l.ads_id = a.id )
  where true
    and ( l.doc = $doc )
    and ( l.par = $par )
    and ( l.lnr = $lnr )
  order by l.ads_id;`, {doc, par, lnr});
      for (ad of ref2) {
        // debug '^6684048^', ad
        line_text += (ref3 = ad.chrs) != null ? ref3 : '';
        chrs_ctxt = _escape_for_html_comment(ad.chrs);
        if (ad.gid === missing.gid) {
          chrs_htxt = _escape_for_html_text(ad.chrs);
          relwdth = ad.dx / 1000/* relative width of missing outline rectangle */
          element = `<!--${chrs_ctxt}--><use href='#${missing_sid}' class='missing' transform='translate(${ad.x} ${ad.y}) scale(${relwdth} 1)'/><text class='missing-chrs' style='font-size:1000px;transform:skew(${fm.angle}deg)' x='${ad.x}' y='${ad.y}'>${chrs_htxt}</text>`;
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
      info('^43487^', {doc, par, lnr}, rpr(line_text));
    }
    return page;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // append_used_outlines_overview = ( page ) ->
  //   x0      = 0
  //   y0      = 70
  //   swdth   = 0.25 # stroke width in mm
  //   swdth  *= 1000 * size_mm * mm_p_u
  //   page    = append_to page, 'content', "<g transform='translate(#{x0} #{y0}) scale(#{mm_p_u_txt})'>"
  //   dx      = 1000 * 100 * mm_p_u
  //   x       = -dx
  //   for od from db SQL"select * from drb.outlines where fontnick = $fontnick order by sid;", { fontnick, }
  //     x    += dx
  //     page  = append_to page, 'content', "<!--#{od.chrs}--><use href='##{od.sid}' x='#{x}'/>"
  //   page = append_to page, 'content', "</g>"
  //   return page

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typeset_sample_page = function(cfg) {
    var I, L, Tbl, V, cgid_map, chrs, db, defaults, doc, drb, dtab, fontnick, fspath, known_ods, missing, missing_sid, mm_p_u, mm_p_u_txt, page, par, set_id, size_mm, text, width_mm, x0, y0;
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
    doc = 1;
    par = 1;
    page = FS.readFileSync(template_path, {
      encoding: 'utf-8'
    });
    page = append_to(page, 'grid', FS.readFileSync(cm_grid_path, {
      encoding: 'utf-8'
    }));
    ({I, L, V} = db.sql);
    //.........................................................................................................
    ({text, chrs, cgid_map, fontnick, fspath} = H.settings_from_set_id(set_id));
    //---------------------------------------------------------------------------------------------------------
    text = drb.prepare_text({
      text,
      entities: true,
      ncrs: true,
      hyphenate: true,
      newlines: true,
      uax14: true,
      trim: true,
      chomp: true
    });
    //---------------------------------------------------------------------------------------------------------
    width_mm = 100;
    size_mm = 10;
    mm_p_u = size_mm / 1000; // mm per unit as valid inside scaled `<g>` line element
    mm_p_u_txt = mm_p_u.toFixed(4);
    ({missing} = Drb.C);
    missing_sid = `o0${fontnick}`;
    known_ods = {
      [missing_sid]: {
        gid: missing.gid,
        sid: missing_sid,
        fontnick
      }
    };
    if (fspath != null) {
      //.........................................................................................................
      /* Register, load and prepopulate font: */
      drb.register_fontnick({fontnick, fspath});
    }
    drb.prepare_font({fontnick});
    drb.arrange({fontnick, text, doc, par});
    drb.distribute({mm_p_u, width_mm, size_mm});
    drb.compose({fontnick, text, doc, par});
    //.........................................................................................................
    x0 = 0;
    y0 = 50;
    page = append_remarks({drb, page, fontnick});
    page = append_outlines({drb, page, fontnick, size_mm, mm_p_u, missing, missing_sid, known_ods});
    page = append_content({drb, page, fontnick, x0, y0, width_mm, size_mm, mm_p_u, mm_p_u_txt, text, missing, missing_sid});
    //.........................................................................................................
    FS.writeFileSync(target_path, page);
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_glyfgrid = function(cfg) {
    var I, L, V, bbox, db, defaults, drb, fontnick, fspath, gid, gid_1, gid_2, i, mm_p_u, mm_p_u_txt, page, pd, px/* TAINT code duplication */, py, ref, ref1, sid, size_mm, tx, ty, width_mm, x, x1, y, y1;
    defaults = {
      fontnick: 'b42',
      fspath: null,
      gid_1: 1,
      gid_2: 100
    };
    cfg = {...defaults, ...cfg};
    ({fontnick, fspath, gid_1, gid_2} = cfg);
    width_mm = 100;
    size_mm = 10;
    mm_p_u = size_mm / 1000; // mm per unit as valid inside scaled `<g>` line element
    mm_p_u_txt = mm_p_u.toFixed(4);
    /* NOTE: for testing we want to use the most recent `rustybuzz-wasm`: */
    // { Tbl, }        = require '../../../apps/icql-dba-tabulate'
    db = new DBay({
      path: '/dev/shm/typesetting-1.sqlite'
    });
    drb = new Drb({
      db,
      rebuild: true,
      RBW,
      path: '/dev/shm/typesetting-2.sqlite'
    });
    // dtab            = new Tbl { db, }
    page = FS.readFileSync(template_path, {
      encoding: 'utf-8'
    });
    page = append_to(page, 'grid', FS.readFileSync(cm_grid_path, {
      encoding: 'utf-8'
    }));
    ({I, L, V} = db.sql);
    if (fspath != null) {
      //.........................................................................................................
      drb.register_fontnick({fontnick, fspath});
    }
    drb.prepare_font({fontnick});
    //.........................................................................................................
    page = append_to(page, 'content', `<g transform='translate(${0} ${10}) scale(${mm_p_u_txt})'>`);
//.........................................................................................................
    for (gid = i = ref = gid_1, ref1 = gid_2; (ref <= ref1 ? i <= ref1 : i >= ref1); gid = ref <= ref1 ? ++i : --i) {
      ({bbox, pd} = drb.get_single_outline({gid, fontnick}));
      ({x, y, x1, y1} = bbox);
      sid = `o${gid}${fontnick}`;
      px = (modulo(gid, 10)) / mm_p_u * size_mm;
      py = (Math.floor(gid / 10)) / mm_p_u * size_mm;
      tx = px + ((0.5 * size_mm) / mm_p_u);
      ty = py - ((0.7 * size_mm) / mm_p_u);
      page = append_to(page, 'outlines', `<path id='${sid}' d='${pd}'/>`);
      page = append_to(page, 'content', `<use href='#${sid}' x='${px}' y='${py}'/>`);
      page = append_to(page, 'content', `<text class='glyfgridgid' x='${tx}' y='${ty}'>${gid}</text>`);
    }
    //.........................................................................................................
    page = append_to(page, 'content', "</g>");
    FS.writeFileSync(target_path, page);
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (async() => {
      // await @demo_store_outlines()
      // await @demo_store_outlines { set_id: 'all', }
      // await @demo_typeset_sample_page { set_id: 'small-eg8i', }
      // await @demo_typeset_sample_page { set_id: 'small-eg12i', }
      // await @demo_typeset_sample_page { set_id: 'gaga-b42', }
      return (await this.demo_typeset_sample_page({
        set_id: 'small-b42'
      }));
    })();
  }

  // await @demo_typeset_sample_page { set_id: 'apollo-b42', }
// await @demo_typeset_sample_page { set_id: 'typo-b42', }
// await @demo_typeset_sample_page { set_id: 'typo-b36', }
// await @demo_glyfgrid { fontnick: 'b42', gid_1: 0, gid_2: 599, }
// await @demo_typeset_sample_page { set_id: 'medium-eg8i', }
// await @demo_typeset_sample_page { set_id: 'longwords-eg12i', }
// await @demo_typeset_sample_page { set_id: 'short-eg12i', }
// await @demo_typeset_sample_page { set_id: 'medium-eg12i', }
// await @demo_typeset_sample_page { set_id: 'uppercasehyphen-eg12i', }
// await @demo_typeset_sample_page { set_id: 'egypt-eg12i', }
// await @demo_typeset_sample_page { set_id: 'small-aleo', }
// await @demo_typeset_sample_page { set_id: 'widechrs', }
// await @demo_typeset_sample_page { set_id: 'tibetan', }
// await @demo_typeset_sample_page { set_id: 'arabic', }
// await @demo_typeset_sample_page { set_id: 'urdu', }
// await @demo_typeset_sample_page { set_id: 'small-djvsi', }
// await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demo-typeset-sample-page.js.map