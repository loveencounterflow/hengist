(function() {
  'use strict';
  var CND, FS, LAP, PATH, S, alert, badge, cid_range_pattern, debug, echo, equals, help, hex, info, isa, log, parse_cid_hex_range_txt, rpr, segment_from_cid_hex_range_txt, to_width, type_of, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'kittyfonts';

  rpr = CND.rpr;

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  hex = function(n) {
    return (n.toString(16)).toUpperCase().padStart(4, '0');
  };

  LAP = require('../../../apps/interlap');

  ({type_of, isa, validate, equals} = LAP.types.export());

  //-----------------------------------------------------------------------------------------------------------
  to_width = function(text, width) {
    /* TAINT use `to_width` module */
    validate.text(text);
    validate.positive_integer(width);
    return text.slice(0, +width + 1 || 9e9).padEnd(width, ' ');
  };

  //===========================================================================================================
  // PERTAINING TO SPECIFIC SETTINGS / FONT CHOICES
  //-----------------------------------------------------------------------------------------------------------
  S = {
    // source_path:  '../../../assets/write-font-configuration-for-kitty-terminal.sample-data.json'
    paths: {
      // configured_cid_ranges:  '../../../../ucdb/cfg/styles-codepoints-and-fontnicks.txt'
      configured_cid_ranges: '../../../assets/ucdb/styles-codepoints-and-fontnicks.short.txt',
      cid_ranges_by_rsgs: '../../../../ucdb/cfg/rsgs-and-blocks.txt'
    },
    psname_by_fontnicks: {
      babelstonehan: 'BabelStoneHan',
      cwtexqheibold: 'cwTeXQHei-Bold',
      dejavuserif: 'DejaVuSerif',
      hanaminaotf: 'HanaMinA',
      hanaminbotf: 'HanaMinB',
      ipamp: 'IPAPMincho',
      jizurathreeb: 'jizura3b',
      nanummyeongjo: 'NanumMyeongjo',
      sunexta: 'Sun-ExtA',
      thtshynpone: 'TH-Tshyn-P1',
      thtshynptwo: 'TH-Tshyn-P2',
      thtshynpzero: 'TH-Tshyn-P0',
      umingttcone: 'UMingCN',
      // @default
      // asanamath
      // ebgaramondtwelveregular:    ''
      // hanaminexatwootf:           ''
      lmromantenregular: 'Iosevka-Slab',
      iosevkaslab: 'Iosevka-Slab',
      // sourcehanserifheavytaiwan:  ''
      // unifonttwelve:              ''
      lastresort: 'LastResort'
    },
    illegal_codepoints: null,
    // illegal_codepoints: [ # see https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Special_code_points
    //   [   0x0000,   0x0000, ] # zero
    //   [   0x0001,   0x001f, ] # lower controls
    //   [   0x007f,   0x009f, ] # higher controls
    //   [   0xd800,   0xdfff, ] # surrogates
    //   [   0xfdd0,   0xfdef, ]
    //   [   0xfffe,   0xffff, ]
    //   [  0x1fffe,  0x1ffff, ]
    //   [  0x2fffe,  0x2ffff, ]
    //   [  0x3fffe,  0x3ffff, ]
    //   [  0x4fffe,  0x4ffff, ]
    //   [  0x5fffe,  0x5ffff, ]
    //   [  0x6fffe,  0x6ffff, ]
    //   [  0x7fffe,  0x7ffff, ]
    //   [  0x8fffe,  0x8ffff, ]
    //   [  0x9fffe,  0x9ffff, ]
    //   [  0xafffe,  0xaffff, ]
    //   [  0xbfffe,  0xbffff, ]
    //   [  0xcfffe,  0xcffff, ]
    //   [  0xdfffe,  0xdffff, ]
    //   [  0xefffe,  0xeffff, ]
    //   [  0xffffe,  0xfffff, ]
    //   [ 0x10fffe, 0x10ffff, ] ]
    illegal_codepoint_patterns: [
      /^\p{Cc}$/u, // Control
      /^\p{Cs}$/u // Surrogate
    ]
  };

  //===========================================================================================================
  // GENERIC STUFF
  //-----------------------------------------------------------------------------------------------------------
  // ///^\p{Cn}$///u # Unassigned
  cid_range_pattern = /^0x(?<first_cid_txt>[0-9a-fA-F]+)\.\.0x(?<last_cid_txt>[0-9a-fA-F]+)$/;

  parse_cid_hex_range_txt = function(cid_range_txt) {
    var first_cid, first_cid_txt, last_cid, last_cid_txt, match;
    if ((match = cid_range_txt.match(cid_range_pattern)) == null) {
      throw new Error(`^33736^ illegal line ${rpr(line)} (unable to parse CID range ${rpr(cid_range_txt)})`);
    }
    ({first_cid_txt, last_cid_txt} = match.groups);
    first_cid = parseInt(first_cid_txt, 16);
    last_cid = parseInt(last_cid_txt, 16);
    return [first_cid, last_cid];
  };

  //-----------------------------------------------------------------------------------------------------------
  segment_from_cid_hex_range_txt = function(cid_range_txt) {
    return new LAP.Segment(parse_cid_hex_range_txt(cid_range_txt));
  };

  //-----------------------------------------------------------------------------------------------------------
  this._read_cid_ranges_by_rsgs = function(settings) {
    var R, cid_range_txt, i, icgroup, is_cjk_txt, len, line, lines, range_name, rsg, source_path;
    if ((R = settings.cid_ranges_by_rsgs) != null) {
      return R;
    }
    R = settings.cid_ranges_by_rsgs = {};
    source_path = PATH.resolve(PATH.join(__dirname, settings.paths.cid_ranges_by_rsgs));
    lines = (FS.readFileSync(source_path, {
      encoding: 'utf-8'
    })).split('\n');
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      line = line.replace(/^\s+$/g, '');
      if ((line.length === 0) || (/^\s*#/.test(line))) {
        continue;
      }
      [icgroup, rsg, is_cjk_txt, cid_range_txt, ...range_name] = line.split(/\s+/);
      if (rsg.startsWith('u-x-')) {
        continue;
      }
      R[rsg] = segment_from_cid_hex_range_txt(cid_range_txt);
    }
    return R;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @_read_illegal_codepoints = ( settings ) ->
  //   return R if isa.interlap ( R = settings.illegal_codepoints )
  //   R = settings.illegal_codepoints = new LAP.Interlap settings.illegal_codepoints
  //   return R

  //-----------------------------------------------------------------------------------------------------------
  this._read_configured_cid_ranges = function(settings) {
    var R, chr, cid_literal, cid_ranges_by_rsgs, first_cid, fontnick, glyphstyle, i, lap, last_cid, len, line, lines, psname, rsg, segment, source_path, styletag, unknown_fontnicks, unknown_rsgs;
    if ((R = settings.configured_cid_ranges) != null) {
      return R;
    }
    cid_ranges_by_rsgs = this._read_cid_ranges_by_rsgs(settings);
    R = settings.configured_cid_ranges = [];
    source_path = PATH.resolve(PATH.join(__dirname, settings.paths.configured_cid_ranges));
    lines = (FS.readFileSync(source_path, {
      encoding: 'utf-8'
    })).split('\n');
    unknown_fontnicks = new Set();
    unknown_rsgs = new Set();
    for (i = 0, len = lines.length; i < len; i++) {
      line = lines[i];
      line = line.replace(/^\s+$/g, '');
      if ((line.length === 0) || (/^\s*#/.test(line))) {
        continue;
      }
      [styletag, cid_literal, fontnick, ...glyphstyle] = line.split(/\s+/);
      glyphstyle = glyphstyle.join(' ');
      validate.nonempty_text(styletag);
      validate.nonempty_text(cid_literal);
      validate.nonempty_text(fontnick);
      validate.text(glyphstyle);
      if (styletag !== '+style:ming') {
        // continue unless fontnick?
        // continue unless first_cid?
        // continue unless last_cid?
        continue;
      }
      if ((glyphstyle != null) && /\bglyph\b/.test(glyphstyle)) {
        continue;
      }
      //.......................................................................................................
      if ((psname = settings.psname_by_fontnicks[fontnick]) == null) {
        if (!unknown_fontnicks.has(fontnick)) {
          unknown_fontnicks.add(fontnick);
          warn(`unknown fontnick ${rpr(fontnick)}`);
        }
        continue;
      }
      //.......................................................................................................
      /* TAINT the below as function */
      //.......................................................................................................
      if (cid_literal === '*') {
        segment = new LAP.Segment([0x000000, 0x10ffff]);
      //.......................................................................................................
      } else if ((cid_literal.startsWith("'")) && (cid_literal.endsWith("'"))) {
        validate.chr(chr = cid_literal.slice(1, cid_literal.length - 1));
        first_cid = chr.codePointAt(0);
        last_cid = first_cid;
        segment = new LAP.Segment([first_cid, last_cid]);
      //.......................................................................................................
      } else if (cid_literal.startsWith('rsg:')) {
        rsg = cid_literal.slice(4);
        validate.nonempty_text(rsg);
        if ((segment = cid_ranges_by_rsgs[rsg]) == null) {
          unknown_rsgs.add(rsg);
          warn(`unknown rsg ${rpr(rsg)}`);
          continue;
        }
      } else {
        //.......................................................................................................
        segment = segment_from_cid_hex_range_txt(cid_literal);
      }
      //.......................................................................................................
      /* NOTE for this particular file format, we could use segments inbstead of laps since there can be only
         one segment per record; however, for consistency with those cases where several disjunct segments per
         record are allowed, we use laps. */
      /* TAINT consider to use a non-committal name like `cids` instead of `lap`, which is bound to a
         particular data type; allow to use segments and laps for this and similar attributes. */
      lap = new LAP.Interlap(segment);
      R.push({fontnick, psname, lap});
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._read_disjunct_cid_ranges = function(settings) {
    var R, disjunct, exclusion, fontnick, i, idx, lap, org_by_fontnicks, overlaps, psname, ref, rule;
    overlaps = this._read_configured_cid_ranges(settings);
    R = settings.disjunct_cid_ranges = [];
    org_by_fontnicks = {};
    exclusion = this._read_illegal_codepoints(settings);
    for (idx = i = ref = overlaps.length - 1; i >= 0; idx = i += -1) {
      rule = overlaps[idx];
      ({fontnick, psname, lap} = rule);
      disjunct = LAP.difference(lap, exclusion);
      exclusion = LAP.union(lap, exclusion);
      R.unshift({
        fontnick,
        psname,
        lap: disjunct
      });
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._read_disjunct_cid_segments = function(settings) {
    var R, disjunct_range, fontnick, i, j, lap, len, len1, psname, ref, segment;
    R = [];
    ref = this._read_disjunct_cid_ranges(S);
    for (i = 0, len = ref.length; i < len; i++) {
      disjunct_range = ref[i];
      ({fontnick, psname, lap} = disjunct_range);
      for (j = 0, len1 = lap.length; j < len1; j++) {
        segment = lap[j];
        if (segment.size === 0) { // should never happen
          continue;
        }
        R.push({fontnick, psname, segment});
      }
    }
    R.sort(function(a, b) {
      if (a.segment.lo < b.segment.lo) {
        return -1;
      }
      if (a.segment.lo < b.segment.lo) {
        return +1;
      }
      return 0;
    });
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.write_font_configuration_for_kitty_terminal = function(settings) {
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
    var c, cid, col_cid, disjunct_range, fontnick, fontnicks_and_segments, i, j, k, l, len, len1, psname, psname_txt, row, row_cid, row_cid_txt, sample, sample_txt, segment, unicode_range_txt;
    fontnicks_and_segments = this._read_disjunct_cid_segments(S);
//.........................................................................................................
    for (i = 0, len = fontnicks_and_segments.length; i < len; i++) {
      disjunct_range = fontnicks_and_segments[i];
      ({fontnick, psname, segment} = disjunct_range);
      // help fontnick, LAP.as_unicode_range lap
      unicode_range_txt = (LAP.as_unicode_range(segment)).padEnd(30);
      sample = (function() {
        var j, len1, ref, ref1, ref2, results;
        ref2 = (function() {
          var results1 = [];
          for (var k = ref = segment.lo, ref1 = segment.hi; ref <= ref1 ? k <= ref1 : k >= ref1; ref <= ref1 ? k++ : k--){ results1.push(k); }
          return results1;
        }).apply(this).slice(0, 31);
        results = [];
        for (j = 0, len1 = ref2.length; j < len1; j++) {
          c = ref2[j];
          results.push(String.fromCodePoint(c));
        }
        return results;
      })();
      sample_txt = sample.join('');
      psname_txt = psname.padEnd(30);
      echo(`# symbol_map      ${unicode_range_txt} ${psname_txt} # ${sample_txt}`);
    }
//.........................................................................................................
    for (row_cid = j = 0xe000; j <= 58272; row_cid = j += 0x10) {
      row = [];
      for (col_cid = k = 0x00; k <= 15; col_cid = ++k) {
        cid = row_cid + col_cid;
        row.push(String.fromCodePoint(cid));
      }
      row_cid_txt = `U+${(row_cid.toString(16)).padStart(4, '0')}`;
      echo(`# ${row_cid_txt} ${row.join('')}`);
    }
//.........................................................................................................
    for (l = 0, len1 = fontnicks_and_segments.length; l < len1; l++) {
      disjunct_range = fontnicks_and_segments[l];
      ({fontnick, psname, segment} = disjunct_range);
      if (psname === 'Iosevka-Slab') {
        /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
        /* exclude default font: */
        continue;
      }
      unicode_range_txt = (LAP.as_unicode_range(segment)).padEnd(30);
      echo(`symbol_map      ${unicode_range_txt} ${psname}`);
    }
    //.........................................................................................................
    return null;
  };

  //===========================================================================================================
  // DATA STRUCTURE DEMOS
  //-----------------------------------------------------------------------------------------------------------
  this.demo_cid_ranges_by_rsgs = function() {
    var range_txt, ref, rsg, rsg_txt, segment;
    echo(CND.steel(CND.reverse("CID Ranges by RSGs".padEnd(108))));
    ref = this._read_cid_ranges_by_rsgs(S);
    for (rsg in ref) {
      segment = ref[rsg];
      if (!/kana|kata|hira/.test(rsg)) {
        continue;
      }
      rsg_txt = rsg.padEnd(25);
      range_txt = LAP.as_unicode_range(segment);
      echo(CND.grey("rsg and CID range"), CND.blue(rsg_txt), CND.lime(range_txt));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_configured_ranges = function() {
    var configured_range, font_txt, fontnick, i, lap, len, psname, range_txt, ref;
    echo(CND.steel(CND.reverse("Configured CID Ranges".padEnd(108))));
    ref = this._read_configured_cid_ranges(S);
    // debug @_read_configured_cid_ranges S
    for (i = 0, len = ref.length; i < len; i++) {
      configured_range = ref[i];
      ({fontnick, psname, lap} = configured_range);
      font_txt = psname.padEnd(25);
      range_txt = LAP.as_unicode_range(lap);
      // echo ( CND.grey "configured range" ), ( CND.yellow configured_range )
      echo(CND.grey("configured range"), CND.yellow(font_txt), CND.lime(range_txt));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_disjunct_ranges = function() {
    var disjunct_range, font_txt, fontnick, i, j, lap, len, len1, psname, range_txt, ref, segment;
    echo(CND.steel(CND.reverse("Disjunct CID Ranges".padEnd(108))));
    ref = this._read_disjunct_cid_ranges(S);
    for (i = 0, len = ref.length; i < len; i++) {
      disjunct_range = ref[i];
      ({fontnick, psname, lap} = disjunct_range);
      font_txt = psname.padEnd(25);
      if (lap.size === 0) {
        echo(CND.grey("disjunct range"), CND.grey(font_txt), CND.grey("no codepoints"));
      } else {
        for (j = 0, len1 = lap.length; j < len1; j++) {
          segment = lap[j];
          range_txt = LAP.as_unicode_range(segment);
          echo(CND.grey("disjunct range"), CND.yellow(font_txt), CND.lime(range_txt));
        }
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_kitty_font_config = function() {
    echo(CND.steel(CND.reverse("Kitty Font Config".padEnd(108))));
    return this.write_font_configuration_for_kitty_terminal(S);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._read_illegal_codepoints = function(settings) {
    var R, cid, i, j, len, prv_cid, range, ranges, ref, ref1, segments;
    if ((R = settings.illegal_codepoints) != null) {
      return R;
    }
    segments = [];
    ranges = [
      {
        lo: 0x0000,
        hi: 0xe000
      },
      {
        lo: 0xf900,
        hi: 0xffff
      }
    ];
// { lo: 0x10000, hi: 0x1ffff, }
// { lo: 0x20000, hi: 0x2ffff, }
// { lo: 0x30000, hi: 0x3ffff, }
// { lo: 0x0000, hi: 0x10ffff, }
    for (i = 0, len = ranges.length; i < len; i++) {
      range = ranges[i];
      prv_cid = null;
      for (cid = j = ref = range.lo, ref1 = range.hi; (ref <= ref1 ? j <= ref1 : j >= ref1); cid = ref <= ref1 ? ++j : --j) {
        if (S.illegal_codepoint_patterns.some(function(re) {
          return re.test(String.fromCodePoint(cid));
        })) {
          segments.push([cid, cid]);
        }
      }
    }
    R = settings.illegal_codepoints = new LAP.Interlap(segments);
    help(`excluding ${R.size} codepoints`);
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_illegal_codepoints = function() {
    var i, lap, len, segment;
    lap = this._read_illegal_codepoints(S);
    for (i = 0, len = lap.length; i < len; i++) {
      segment = lap[i];
      urge(LAP.as_unicode_range(segment));
    }
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_illegal_codepoints()
      // @demo_cid_ranges_by_rsgs()
      // @demo_configured_ranges()
      // @demo_disjunct_ranges()
      // @demo_kitty_font_config()
      //.........................................................................................................
      return this.write_font_configuration_for_kitty_terminal(S);
    })();
  }

  // demo()

}).call(this);
