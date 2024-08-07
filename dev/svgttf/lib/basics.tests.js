(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, help, info, resolve_project_path, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/SVGTTF';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  FS = require('fs');

  // #...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   type_of }               = types

  //-----------------------------------------------------------------------------------------------------------
  resolve_project_path = function(path) {
    return PATH.resolve(PATH.join(__dirname, '../../..', path));
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF types"] = async function(T, done) {
    var SVGTTF, error, i, len, matcher, probe, probes_and_matchers;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    //.........................................................................................................
    // [ [ 'svgttf_svg_transform_fn', 1, ], "translate(1)", ]
    probes_and_matchers = [[['svgttf_svg_transform_name', 'translate'], true], [['svgttf_svg_transform_name', 'skewX'], true], [['svgttf_svg_transform_name', 'rotate'], true], [['svgttf_svg_transform_name', 'xxxtranslate'], false], [['svgttf_svg_transform_name', 42], false], [['svgttf_svg_transform_value', 42], true], [['svgttf_svg_transform_value', [42]], true], [['svgttf_svg_transform_value', 'something'], true]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var type, value;
          [type, value] = probe;
          return resolve(SVGTTF.types.isa(type, value));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF._transform_fn_as_text()"] = async function(T, done) {
    var SVGTTF, error, i, len, matcher, probe, probes_and_matchers;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    //.........................................................................................................
    probes_and_matchers = [[['translate', 1], "translate(1)"], [['translate', 1, 2], "translate(1,2)"], [['xxxtranslate', 1, 2], null, 'not a valid svgttf_svg_transform_fn']];
//.........................................................................................................
// [ null, null, ]
// [ [], null, ]
// [ [ 'translate', 1, ], "transform='translate(1)'", ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(SVGTTF._transform_fn_as_text(probe));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF._transform_as_text"] = async function(T, done) {
    var SVGTTF, error, i, len, matcher, probe, probes_and_matchers;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    //.........................................................................................................
    probes_and_matchers = [[null, null], [[], null], [[['translate', 1]], "transform='translate(1)'"], [[['translate', 1], ['rotate', 45]], "transform='translate(1) rotate(45)'"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(SVGTTF._transform_as_text(probe));
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF.pathelement_from_glyphidx()"] = function(T, done) {
    var SVGTTF, font;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    font = SVGTTF.font_from_path(resolve_project_path('assets/svgttf/lmroman10-italic.otf'));
    //.........................................................................................................
    // debug SVGTTF.pathelement_from_glyphidx font, 23, 1000
    // debug SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ]
    T.eq(SVGTTF.pathelement_from_glyphidx(font, 23, 1000), "<path d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>");
    T.eq(SVGTTF.pathelement_from_glyphidx(font, 23, 1000, [['translate', [100]]]), "<path transform='translate(100)' d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>");
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF.get_metrics()"] = async function(T, done) {
    var SVGTTF, error, font, i, len, matcher, metrics, probe, probes_and_matchers;
    SVGTTF = require('../../../apps/svgttf');
    font = SVGTTF.font_from_path(resolve_project_path('assets/svgttf/lmroman10-italic.otf'));
    metrics = SVGTTF.get_metrics(font);
    // ['ascender',             1125, ]
    // ['baseline',             710, ]
    // ['defaultWidthX',        511, ]
    // ['descender',            -290, ]
    // ['nominalWidthX',        669, ]
    // ['numGlyphs',            821, ]
    // ['unitsPerEm',           1000, ]
    probes_and_matchers = [['ascent', 806], ['upm', 1000], ['baseline', 806], ['descent', 194]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(metrics[probe]);
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF.svg_from_glyphidx()"] = function(T, done) {
    var SVGTTF, font;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    font = SVGTTF.font_from_path(resolve_project_path('assets/svgttf/lmroman10-italic.otf'));
    //.........................................................................................................
    echo();
    echo(SVGTTF.svg_from_glyphidx(font, 27, 1000));
    echo();
    if (done != null) {
      // # debug SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ]
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000                                  ), "<path d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ] ), "<path transform='translate(100)' d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF.svg_from_harfbuzz_linotype()"] = function(T, done) {
    var SVGTTF, font, glyph_idxs, harfbuzz_linotype;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    font = SVGTTF.font_from_path(resolve_project_path('assets/svgttf/lmroman10-italic.otf'));
    glyph_idxs = [];
    //.........................................................................................................
    harfbuzz_linotype = [
      {
        upem: 1000,
        gid: 28,
        cluster: 0,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 123,
        cluster: 1,
        x_advance: 0.882
      },
      {
        upem: 1000,
        gid: 72,
        cluster: 4,
        x_advance: 0.256
      },
      {
        upem: 1000,
        gid: 66,
        cluster: 5,
        x_advance: 0.307
      },
      {
        upem: 1000,
        gid: 28,
        cluster: 6,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 105,
        cluster: 7,
        x_advance: 0.332
      },
      {
        upem: 1000,
        gid: 66,
        cluster: 8,
        x_advance: 0.307
      },
      {
        upem: 1000,
        gid: 81,
        cluster: 9,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 77,
        cluster: 10,
        x_advance: 0.562
      }
    ];
    harfbuzz_linotype = [
      {
        upem: 1000,
        gid: 81,
        cluster: 0,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 103,
        cluster: 1,
        x_advance: 0.358
      },
      {
        upem: 1000,
        gid: 105,
        cluster: 2,
        x_advance: 0.332
      },
      {
        upem: 1000,
        gid: 50,
        cluster: 3,
        x_advance: 0.46
      },
      {
        upem: 1000,
        gid: 75,
        cluster: 4,
        x_advance: 0.818
      },
      {
        upem: 1000,
        gid: 84,
        cluster: 5,
        x_advance: 0.46
      },
      {
        upem: 1000,
        gid: 81,
        cluster: 6,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 96,
        cluster: 7,
        x_advance: 0.371
      },
      {
        upem: 1000,
        gid: 50,
        cluster: 8,
        x_advance: 0.46
      },
      {
        upem: 1000,
        gid: 98,
        cluster: 9,
        x_advance: 0.409
      },
      {
        upem: 1000,
        gid: 103,
        cluster: 10,
        x_advance: 0.358
      },
      {
        upem: 1000,
        gid: 81,
        cluster: 11,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 103,
        cluster: 12,
        x_advance: 0.358
      },
      {
        upem: 1000,
        gid: 75,
        cluster: 13,
        x_advance: 0.818
      },
      {
        upem: 1000,
        gid: 81,
        cluster: 14,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 96,
        cluster: 15,
        x_advance: 0.371
      },
      {
        upem: 1000,
        gid: 50,
        cluster: 16,
        x_advance: 0.46
      },
      {
        upem: 1000,
        gid: 98,
        cluster: 17,
        x_advance: 0.409
      },
      {
        upem: 1000,
        gid: 103,
        cluster: 18,
        x_advance: 0.358
      },
      {
        upem: 1000,
        gid: 90,
        cluster: 19,
        x_advance: 0.767
      },
      {
        upem: 1000,
        gid: 109,
        cluster: 20,
        x_advance: 0.537
      },
      {
        upem: 1000,
        gid: 28,
        cluster: 21,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 72,
        cluster: 22,
        x_advance: 0.256
      },
      {
        upem: 1000,
        gid: 66,
        cluster: 23,
        x_advance: 0.307
      },
      {
        upem: 1000,
        gid: 125,
        cluster: 24,
        x_advance: 0.562
      },
      {
        upem: 1000,
        gid: 43,
        cluster: 26,
        x_advance: 0.409
      },
      {
        upem: 1000,
        gid: 28,
        cluster: 27,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 77,
        cluster: 28,
        x_advance: 0.562
      },
      {
        upem: 1000,
        gid: 47,
        cluster: 29,
        x_advance: 0.511
      },
      {
        upem: 1000,
        gid: 109,
        cluster: 30,
        x_advance: 0.537
      },
      {
        upem: 1000,
        gid: 96,
        cluster: 31,
        x_advance: 0.422
      }
    ];
    //.........................................................................................................
    // echo()
    echo(SVGTTF.svg_from_harfbuzz_linotype(font, harfbuzz_linotype, 1000));
    if (done != null) {
      // echo()
      // # debug SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ]
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000                                  ), "<path d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ] ), "<path transform='translate(100)' d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["SVGTTF.svg_from_harfbuzz_linotype() (using CJK font)"] = function(T, done) {
    var SVGTTF, font, glyph_idxs, harfbuzz_linotype;
    // SVGTTF = require resolve_project_path 'apps/svgttf'
    SVGTTF = require('../../../apps/svgttf');
    // font        = SVGTTF.font_from_path resolve_project_path 'assets/jizura-fonts/FandolKai-Regular.otf'
    font = SVGTTF.font_from_path(resolve_project_path('assets/jizura-fonts/HanaMinA.otf'));
    glyph_idxs = [];
    //.........................................................................................................
    // harfbuzz_linotype = [ { upem: 1000, gid: 1155, cluster: 0, x_advance: 1 }, { upem: 1000, gid: 2585, cluster: 1, x_advance: 1 }, { upem: 1000, gid: 3571, cluster: 2, x_advance: 1 }, { upem: 1000, gid: 2884, cluster: 3, x_advance: 1 }, { upem: 1000, gid: 4308, cluster: 4, x_advance: 1 }, { upem: 1000, gid: 269, cluster: 5, x_advance: 1 }, { upem: 1000, gid: 35, cluster: 6, x_advance: 0.764 }, { upem: 1000, gid: 83, cluster: 7, x_advance: 0.458 }, { upem: 1000, gid: 70, cluster: 8, x_advance: 0.5 }, { upem: 1000, gid: 91, cluster: 9, x_advance: 0.444 }, { upem: 1000, gid: 73, cluster: 10, x_advance: 0.555 }, { upem: 1000, gid: 80, cluster: 11, x_advance: 0.555 }, { upem: 1000, gid: 79, cluster: 12, x_advance: 0.611 }, { upem: 1000, gid: 70, cluster: 13, x_advance: 0.5 }, { upem: 1000, gid: 72, cluster: 14, x_advance: 0.5 }, { upem: 1000, gid: 273, cluster: 15, x_advance: 1 }, { upem: 1000, gid: 1605, cluster: 16, x_advance: 1 }, { upem: 1000, gid: 3795, cluster: 17, x_advance: 1 }, { upem: 1000, gid: 2209, cluster: 18, x_advance: 1 }, { upem: 1000, gid: 35, cluster: 19, x_advance: 0.764 }, { upem: 1000, gid: 83, cluster: 20, x_advance: 0.458 }, { upem: 1000, gid: 70, cluster: 21, x_advance: 0.5 }, { upem: 1000, gid: 85, cluster: 22, x_advance: 0.361 }, { upem: 1000, gid: 80, cluster: 23, x_advance: 0.555 }, { upem: 1000, gid: 79, cluster: 24, x_advance: 0.611 }, { upem: 1000, gid: 270, cluster: 25, x_advance: 1 }, { upem: 1000, gid: 98, cluster: 26, x_advance: 1 } ]
    harfbuzz_linotype = [
      {
        upem: 1000,
        gid: 16567,
        cluster: 0,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 13515,
        cluster: 1,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 15112,
        cluster: 2,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 16112,
        cluster: 3,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 28321,
        cluster: 4,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 42379,
        cluster: 5,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 67,
        cluster: 6,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 115,
        cluster: 7,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 102,
        cluster: 8,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 123,
        cluster: 9,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 105,
        cluster: 10,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 112,
        cluster: 11,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 111,
        cluster: 12,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 102,
        cluster: 13,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 104,
        cluster: 14,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 42383,
        cluster: 15,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 20361,
        cluster: 16,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 18491,
        cluster: 17,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 13983,
        cluster: 18,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 67,
        cluster: 19,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 115,
        cluster: 20,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 102,
        cluster: 21,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 117,
        cluster: 22,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 112,
        cluster: 23,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 111,
        cluster: 24,
        x_advance: 0.5
      },
      {
        upem: 1000,
        gid: 42380,
        cluster: 25,
        x_advance: 1
      },
      {
        upem: 1000,
        gid: 4831,
        cluster: 26,
        x_advance: 1
      }
    ];
    //.........................................................................................................
    // echo()
    echo(SVGTTF.svg_from_harfbuzz_linotype(font, harfbuzz_linotype, 1000));
    if (done != null) {
      // echo()
      // # debug SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ]
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000                                  ), "<path d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      // T.eq ( SVGTTF.pathelement_from_glyphidx font, 23, 1000, [ [ 'translate', [ 100, ], ], ] ), "<path transform='translate(100)' d='M373-631C373-652 368-694 325-694C285-694 260-659 260-630C260-598 283-588 304-588C321-588 339-597 349-607C338-547 300-476 234-422C221-410 220-409 220-405C220-402 223-395 230-395C249-395 373-514 373-631Z'/>"
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_opentypejs = function() {
    var SVGTTFv1, font, font_path, glyph_idx, i, j, k, ks, len, len1, output_path, svg_symbol_font_txt;
    SVGTTFv1 = require('../../../apps/svgttf');
    font_path = resolve_project_path('assets/jizura-fonts/lmroman10-italic.otf');
    glyph_idx = 23;
    font = SVGTTFv1.font_from_path(font_path);
    // debug SVGTTFv1.pathdata_from_glyphidx font, glyph_idx, 1000
    echo('-'.repeat(108));
    // 'encoding'
    // 'glyphNames'
    // 'glyphs'
    // 'names'
    // 'outlinesFormat'
    // 'position'
    // 'substitution'
    // 'numberOfHMetrics'
    // 'numGlyphs'
    ks = ['ascender', 'descender', 'defaultWidthX', 'nominalWidthX', 'unitsPerEm'];
    for (i = 0, len = ks.length; i < len; i++) {
      k = ks[i];
      echo('^3334^', CND.white(k.padEnd(20)), CND.yellow(font.otjsfont[k]));
    }
    echo('-'.repeat(108));
    // 'achVendID'
    // 'fsSelection'
    // 'fsType'
    // 'panose'
    // 'sFamilyClass'
    // 'ulCodePageRange1'
    // 'ulCodePageRange2'
    // 'ulUnicodeRange1'
    // 'ulUnicodeRange2'
    // 'ulUnicodeRange3'
    // 'ulUnicodeRange4'
    // 'usBreakChar'
    // 'usDefaultChar'
    // 'usFirstCharIndex'
    // 'usLastCharIndex'
    // 'usMaxContent'
    // 'version'
    ks = ['sCapHeight', 'sTypoAscender', 'sTypoDescender', 'sTypoLineGap', 'sxHeight', 'usWeightClass', 'usWidthClass', 'usWinAscent', 'usWinDescent', 'xAvgCharWidth', 'yStrikeoutPosition', 'yStrikeoutSize', 'ySubscriptXOffset', 'ySubscriptXSize', 'ySubscriptYOffset', 'ySubscriptYSize', 'ySuperscriptXOffset', 'ySuperscriptXSize', 'ySuperscriptYOffset', 'ySuperscriptYSize'];
    for (j = 0, len1 = ks.length; j < len1; j++) {
      k = ks[j];
      echo('^3334^', CND.white(k.padEnd(20)), CND.yellow(font.otjsfont.tables.os2[k]));
    }
    debug('^23237^', (function() {
      var results;
      results = [];
      for (k in font.otjsfont) {
        results.push(k);
      }
      return results;
    })());
    debug('^23237^', (function() {
      var results;
      results = [];
      for (k in font.otjsfont.tables) {
        results.push(k);
      }
      return results;
    })());
    debug('^23237^', (function() {
      var results;
      results = [];
      for (k in font.otjsfont.tables.os2) {
        results.push(k);
      }
      return results;
    })());
    svg_symbol_font_txt = SVGTTFv1.get_svg_symbol_font(font);
    output_path = '/tmp/sample-font.svg';
    FS.writeFileSync(output_path, svg_symbol_font_txt);
    return help(`SVG symbol font written to ${output_path}`);
  };

  // path_precision  = 0
  // # debug '^2332^', ( k for k of SVGTTF )
  // # debug '^2332^', ( k for k of otjsfont )
  // # debug '^2332^', SVGTTF.svg_path_from_cid
  // # debug '^2332^', SVGTTF.svg_pathdata_from_cid
  // # debug '^2332^', SVGTTF.glyph_and_pathdata_from_cid metrics, otjsfont, cid
  // # debug '^2332^', SVGTTF.svg_path_from_cid otjsfont, cid
  // glyph     = otjsfont.glyphs.glyphs[ glyph_idx ]
  // x         = 0
  // y         = 0
  // font_size = 1000
  // path      = glyph.getPath x, y, font_size
  // path_data = path.toPathData path_precision
  // debug '^svgttf@6^', glyph.path.toSVG path_precision
  // debug '^svgttf@6^', path_data

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // await @_demo_opentypejs()
// test @[ "VNR sort 2" ]
// test @[ "VNR sort 3" ]
// @[ "VNR sort 3" ]()
// test @[ "test VNR._first_nonzero_is_negative()" ]
// @[ "SVGTTF.svg_from_glyphidx()" ]()
// @[ "SVGTTF.svg_from_harfbuzz_linotype()" ]()
// @[ "SVGTTF.svg_from_harfbuzz_linotype() (using CJK font)" ]()

}).call(this);

//# sourceMappingURL=basics.tests.js.map