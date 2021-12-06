(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, reveal, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-RUSTYBUZZ/TESTS/BASIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  reveal = function(text) {
    return text.replace(/[^\x20-\x7f]/ug, function($0) {
      return `&#x${($0.codePointAt(0)).toString(16)};`;
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW prepare_text()"] = async function(T, done) {
    var DBay, Drb, db, drb, error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[[null, true, 'extraordinary'], 'ex&#xad;tra&#xad;or&#xad;di&#xad;nary'], [[null, true, 'extra-ordinary'], 'ex&#xad;tra-&#x200b;or&#xad;di&#xad;nary'], [[null, true, 'extra&shy;ordinary'], 'ex&#xad;tra&#xad;or&#xad;di&#xad;nary'], [[null, true, 'extra\n\nordinary'], 'ex&#xad;tra or&#xad;di&#xad;nary'], [[null, true, '  xxx  '], 'xxx'], [[null, true, '&nbsp;xxx  '], '&#xa0;xxx'], [[null, true, '&nbsp;xxx\n\n\n'], '&#xa0;xxx'], [[null, true, 'xxx&br;'], 'xxx&xa;']];
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true
    });
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var cfg, do_reveal, result, text;
          // [ cfg, do_reveal, text, ]  = probe
          cfg = probe[0];
          do_reveal = probe[1];
          text = probe[2];
          result = drb.prepare_text({...cfg, text});
          if (do_reveal) {
            result = H.reveal(result);
          }
          // T?.eq result, matcher
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW decode_ncrs()"] = async function(T, done) {
    var DBay, Drb, db, drb, error, i, len, matcher, probe, probes_and_matchers;
    probes_and_matchers = [[[false, '&#x5443;&#x4e00;'], '呃一'], [[true, '&wbr;'], '&#x200b;'], [[true, '&shy;'], '&#xad;'], [[true, '&br;'], '&#xa;']];
    //.........................................................................................................
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true
    });
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve) {
          var do_reveal, result, text;
          // [ do_reveal, text, ]  = probe
          do_reveal = probe[0];
          text = probe[1];
          result = drb._decode_entities(text);
          if (do_reveal) {
            result = reveal(result);
          }
          // T?.eq result, matcher
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["DRB RBW finds UAX#14 breakpoints"] = function(T, done) {
    /* TAINT make this a DRB method */
    var DBay, Drb, RBW, _escape_syms, _prepare_text, bri, bris, db, drb, i, idx, len, matcher, new_text, nxt_bri, part, parts, text, text_bfr;
    // T?.halt_on_error()
    /* TAINT make this a DRB method */
    _prepare_text = function(text) {
      var ITXT, R;
      ITXT = require('intertext');
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
    reveal = function(text) {
      return text.replace(/[^\x20-\x7f]/ug, function($0) {
        return `&#x${($0.codePointAt(0)).toString(16)};`;
      });
    };
    matcher = 'con&#xad;fir&#xad;ma&#xad;tion/&#x200b;bias pro&#xad;duc&#xad;tion a&#x200b;b this&#x200b;&#x2014;&#x200b;or that';
    ({DBay} = require(H.dbay_path));
    ({Drb} = require(H.drb_path));
    db = new DBay();
    drb = new Drb({
      db,
      temporary: true
    });
    //.........................................................................................................
    text = 'confirmation/bias production a&wbr;&wbr;b this—or that';
    text = _prepare_text(text);
    text_bfr = Buffer.from(text);
    bris = JSON.parse(drb.RBW.find_line_break_positions(text));
    for (idx = i = 0, len = bris.length; i < len; idx = ++i) {
      bri = bris[idx];
      if ((nxt_bri = bris[idx + 1]) == null) {
        break;
      }
      part = text_bfr.slice(bri, nxt_bri).toString('utf-8');
      part = _escape_syms(part);
      urge('^3409^', {bri, nxt_bri}, rpr(part));
    }
    parts = (function() {
      var j, len1, ref, results;
      results = [];
      for (idx = j = 0, len1 = bris.length; j < len1; idx = ++j) {
        bri = bris[idx];
        results.push(text_bfr.slice(bri, (ref = bris[idx + 1]) != null ? ref : 2e308).toString('utf-8'));
      }
      return results;
    })();
    echo(rpr(new_text = parts.join(drb.constructor.C.special_chrs.wbr)));
    new_text = new_text.replace(/\xad\u200b/g, drb.constructor.C.special_chrs.shy);
    new_text = new_text.replace(/\x20\u200b/g, '\x20');
    new_text = new_text.replace(/\u200b{2,}/g, drb.constructor.C.special_chrs.wbr);
    new_text = new_text.replace(/\u200b$/g, '');
    echo(rpr(reveal(new_text)));
    if (T != null) {
      T.eq(matcher, reveal(new_text));
    }
    //.........................................................................................................
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    debug('^7098^', rpr(RBW.decode_ncrs('&#x5443;&#x4e00;')));
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this["DRB RBW prepare_text()"]);
    })();
  }

  // test @[ "DRB RBW decode_ncrs()" ]
// test @[ "DRB RBW finds UAX#14 breakpoints" ]

}).call(this);

//# sourceMappingURL=sundry.tests.js.map