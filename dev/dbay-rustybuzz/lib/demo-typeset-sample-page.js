(function() {
  'use strict';
  var CND, DBay, Drb, FS, H, PATH, RBW, SQL, XXX_show_clusters, append_to, badge, debug, echo, equals, guy, help, info, isa, rpr, target_path, template_path, to_width, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  this.demo_typeset_sample_page = function(cfg) {
    var I, L, Tbl, V, ads, append_content, append_outlines, append_overview, cgid_map, chrs, db, defaults, drb, dtab, fm, fontnick, fspath, known_ods, missing, missing_chrs, missing_pd, missing_sid, new_ods, page, scale, scale_txt, set_id, size_mm, text;
    defaults = {
      set_id: 'small-eg8i'
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
    size_mm = 10;
    scale = size_mm / 1000;
    scale_txt = scale.toFixed(4);
    ({missing} = Drb.C);
    missing_sid = `o0${fontnick}`;
    missing_pd = 'M0 200 L0-800 L1000-800 L1000 200';
    known_ods = {missing_sid};
    //.........................................................................................................
    /* Register, load and prepopulate font: */
    drb.register_fontnick({fontnick, fspath});
    drb.prepare_font({fontnick});
    ({known_ods, new_ods, missing_chrs, ads, fm} = drb.typeset({fontnick, text, known_ods}));
    page = append_to(page, 'remarks', `<div>fm: ${rpr(fm)}</div>`);
    page = append_to(page, 'remarks', `<div>missing_chrs: ${rpr(missing_chrs)}</div>`);
    //.........................................................................................................
    /* `append_outlines()`: */
    append_outlines = function(page) {
      var od, sid;
      page = append_to(page, 'outlines', `<!--NULL--><path id='${missing_sid}' class='missing' d='${missing_pd}'/>`);
      for (sid in known_ods) {
        od = known_ods[sid];
        page = append_to(page, 'outlines', `<!--${od.chrs}--><path id='${sid}' d='${od.pd}'/>`);
      }
      return page;
    };
    //.........................................................................................................
    append_content = function(page) {
      var ad, element, i, len, swdth, x0, y0;
      x0 = 0;
      y0 = 50;
      swdth = 0.25; // stroke width in mm
      swdth *= 1000 * size_mm * scale;
      page = append_to(page, 'content', `<g transform='translate(${x0} ${y0}) scale(${scale_txt})'>`);
      // page        = append_to page, 'content', "<rect class='typeframe' x='0' y='-800' width='10000' height='1000'/>"
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.ascender}' x2='10000' y2='${fm.ascender}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.descender}' x2='10000' y2='${fm.descender}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.x_height}' x2='10000' y2='${fm.x_height}'/>`);
      page = append_to(page, 'content', `<line class='fontmetric' stroke-width='${swdth}' x1='0' y1='${fm.capital_height}' x2='10000' y2='${fm.capital_height}'/>`);
      for (i = 0, len = ads.length; i < len; i++) {
        ad = ads[i];
        if (ad.gid === missing.gid) {
          element = `<!--${ad.chrs}--><use href='#${missing_sid}' transform='translate(${ad.x} ${ad.y}) scale(${ad.dx / 1000} 1)'/>
<text class='missing-chrs' style='font-size:1000px;' x='${ad.x}' y='${ad.y}'>${ad.chrs}</text>`;
        } else {
          if (ad.y === 0) {
            element = `<!--${ad.chrs}--><use href='#${ad.sid}' x='${ad.x}'/>`;
          } else {
            element = `<!--${ad.chrs}--><use href='#${ad.sid}' x='${ad.x}' y='${ad.y}'/>`;
          }
        }
        page = append_to(page, 'content', element);
      }
      page = append_to(page, 'content', "</g>");
      return page;
    };
    //.........................................................................................................
    append_overview = function(page) {
      var dx, od, ref, swdth, x, x0, y0;
      x0 = 0;
      y0 = 70;
      swdth = 0.25; // stroke width in mm
      swdth *= 1000 * size_mm * scale;
      page = append_to(page, 'content', `<g transform='translate(${x0} ${y0}) scale(${scale_txt})'>`);
      dx = 1000 * 100 * scale;
      x = -dx;
      ref = db(SQL`select * from drb.outlines where fontnick = $fontnick order by sid;`, {fontnick});
      for (od of ref) {
        x += dx;
        page = append_to(page, 'content', `<!--${od.chrs}--><use href='#${od.sid}' x='${x}'/>`);
      }
      page = append_to(page, 'content', "</g>");
      return page;
    };
    //.........................................................................................................
    page = append_outlines(page);
    page = append_content(page);
    page = append_overview(page);
    //.........................................................................................................
    FS.writeFileSync(target_path, page);
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
// await @demo_typeset_sample_page { set_id: 'tibetan', }
// await @demo_typeset_sample_page { set_id: 'arabic', }
// await @demo_typeset_sample_page { set_id: 'urdu', }
// await @demo_typeset_sample_page { set_id: 'small-djvsi', }
// await @demo_use_linked_rustybuzz_wasm()

}).call(this);

//# sourceMappingURL=demo-typeset-sample-page.js.map