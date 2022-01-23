(function() {
  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  var demo;

  demo = function() {
    var chr_from_cid, d, disjunct, disjunct_txt, disjuncts, disjuncts_uranges, exclusion, exclusions, fontnick, fontnick_txt, i, idx, interlap_as_demo_text, j, k, l, lap, lap_txt, len, len1, len2, overlapping_laps_from_pseudo_css, overlaps, pseudo_css_configuration, ref, segment, segment_as_demo_text, unicode_range, x;
    pseudo_css_configuration = [['font1', '[B-H] [J] [L] [N-X]          '], ['font2', '[B-D]                        '], ['font3', '[G-I]                        '], ['font4', '[M-Q]                        '], ['font5', '[M] [O-T]                    '], ['font6', '[M] [U] [X-Y]                ']];
    //-----------------------------------------------------------------------------------------------------------
    overlapping_laps_from_pseudo_css = function(pseudo_css) {
      var R, first_chr, fontnick, hi, i, j, lap, last_chr, len, len1, lo, match, matches, range_endpoint, range_endpoints, range_literal, range_literals, ranges_txt, ref, segments;
      R = [];
      for (i = 0, len = pseudo_css.length; i < len; i++) {
        [fontnick, ranges_txt] = pseudo_css[i];
        matches = ranges_txt.matchAll(/\[(?<range_literal>[^\]]+)\]/g);
        range_literals = (function() {
          var results;
          results = [];
          for (match of matches) {
            results.push(match.groups.range_literal);
          }
          return results;
        })();
        range_endpoints = (function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = range_literals.length; j < len1; j++) {
            range_literal = range_literals[j];
            results.push(range_literal.trim().split(/\s*-\s*/));
          }
          return results;
        })();
        segments = [];
        for (j = 0, len1 = range_endpoints.length; j < len1; j++) {
          range_endpoint = range_endpoints[j];
          first_chr = range_endpoint[0];
          last_chr = (ref = range_endpoint[1]) != null ? ref : first_chr;
          lo = first_chr.codePointAt(0);
          hi = last_chr.codePointAt(0);
          segments.push([lo, hi]);
        }
        lap = new LAP.Interlap(segments);
        R.push([fontnick, lap]);
      }
      return R;
    };
    //.........................................................................................................
    chr_from_cid = function(cid) {
      return String.fromCodePoint(cid);
    };
    //.........................................................................................................
    segment_as_demo_text = function(segment) {
      validate.segment(segment);
      if (segment.lo === segment.hi) {
        return `[${chr_from_cid(segment.lo)}]`;
      }
      return `[${chr_from_cid(segment.lo)}-${chr_from_cid(segment.hi)}]`;
    };
    //.........................................................................................................
    interlap_as_demo_text = function(interlap) {
      var s;
      validate.interlap(interlap);
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = interlap.length; i < len; i++) {
          s = interlap[i];
          results.push(segment_as_demo_text(s));
        }
        return results;
      })()).join(' ');
    };
    //.........................................................................................................
    overlaps = overlapping_laps_from_pseudo_css(pseudo_css_configuration);
    for (x of overlaps) {
      [fontnick, lap] = x;
      fontnick_txt = to_width(fontnick, 20);
      lap_txt = to_width(interlap_as_demo_text(lap), 20);
      info(CND.lime(fontnick_txt), CND.gold(lap_txt));
    }
    //.........................................................................................................
    info();
    exclusion = new LAP.Interlap();
    disjuncts = [];
    exclusions = [];
    for (idx = i = ref = overlaps.length - 1; i >= 0; idx = i += -1) {
      [fontnick, lap] = overlaps[idx];
      disjunct = LAP.difference(lap, exclusion);
      exclusion = LAP.union(lap, exclusion);
      disjuncts.unshift(disjunct);
      exclusions.unshift(exclusion);
    }
    for (j = 0, len = exclusions.length; j < len; j++) {
      exclusion = exclusions[j];
      info(CND.yellow(interlap_as_demo_text(exclusion)));
    }
    for (idx = k = 0, len1 = overlaps.length; k < len1; idx = ++k) {
      [fontnick, lap] = overlaps[idx];
      disjunct = disjuncts[idx];
      fontnick_txt = to_width(fontnick, 20);
      lap_txt = to_width(interlap_as_demo_text(lap), 20);
      disjunct_txt = to_width(interlap_as_demo_text(disjunct), 20);
      info(CND.lime(fontnick_txt), CND.gold(lap_txt), CND.blue(disjunct_txt), CND.steel(LAP.as_unicode_range(disjunct)));
      for (l = 0, len2 = disjunct.length; l < len2; l++) {
        segment = disjunct[l];
        unicode_range = LAP.as_unicode_range(segment);
        help(`symbol_map \t${unicode_range} \t${fontnick}`);
      }
    }
    disjuncts_uranges = ((function() {
      var len3, m, results;
      results = [];
      for (m = 0, len3 = disjuncts.length; m < len3; m++) {
        d = disjuncts[m];
        results.push(LAP.as_unicode_range(d));
      }
      return results;
    })()).join('\n');
    validate.true(equals(disjuncts_uranges, `U+0045-U+0046,U+004a-U+004a,U+004c-U+004c,U+0056-U+0057
U+0042-U+0044
U+0047-U+0049
U+004e-U+004e
U+004f-U+0054
U+004d-U+004d,U+0055-U+0055,U+0058-U+0059`));
    return null;
  };

}).call(this);

//# sourceMappingURL=demo.js.map