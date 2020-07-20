(function() {
  'use strict';
  var CND, OT, PATH, badge, debug, echo, help, info, isa, rpr, test, type_of, urge, validate, warn, whisper;

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

  //...........................................................................................................
  this.types = require('./types');

  ({isa, validate, type_of} = this.types);

  OT = require('opentype.js');

  //-----------------------------------------------------------------------------------------------------------
  this._transform_fn_as_text = function(transform_fn) {
    var name, p;
    validate.svgttf_svg_transform_fn(transform_fn);
    [name, ...p] = transform_fn;
    if (p.length === 1) {
      p = p[0];
    }
    if ((isa.text(p)) || (isa.float(p))) {
      return `${name}(${p})`;
    }
    if (isa.list(p)) {
      return `${name}(${p.join(',')})`;
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this._transform_as_text = function(transform) {
    var tf;
    if (transform == null) {
      return null;
    }
    validate.list(transform);
    if (transform.length === 0) {
      return null;
    }
    return `transform='${((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = transform.length; i < len; i++) {
        tf = transform[i];
        results.push(this._transform_fn_as_text(tf));
      }
      return results;
    }).call(this)).join(' ')}'`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pathelement_from_glyphidx = function(me, glyph_idx, size = null, transform) {
    return this._pathelement_from_pathdata(me, this.pathdata_from_glyphidx(me, glyph_idx, size), transform);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pathdata_from_glyphidx = function(me, glyph_idx, size = null) {
    validate.svgttf_font(me);
    validate.count(glyph_idx);
    if (size != null) {
      validate.nonnegative(size);
    }
    return this._fast_pathdata_from_glyphidx(me, glyph_idx, size);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._fast_pathdata_from_glyphidx = function(me, glyph_idx, size = null) {
    var glyph, path, path_precision, x, y;
    path_precision = 0;
    x = 0;
    y = 0;
    glyph = me.otjsfont.glyphs.glyphs[glyph_idx];
    size = me.otjsfont.unitsPerEm;
    path = glyph.getPath(x, y, size);
    return path.toPathData(path_precision);
  };

  //-----------------------------------------------------------------------------------------------------------
  this._pathelement_from_pathdata = function(me, pathdata, transform) {
    var tf_txt;
    if ((tf_txt = this._transform_as_text(transform)) != null) {
      return `<path ${tf_txt} d='${pathdata}'/>`;
    }
    return `<path d='${pathdata}'/>`;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._get_svg = function(me, x1, y1, x2, y2, content) {
    var R, type;
    validate.float(x1);
    validate.float(y1);
    validate.float(x2);
    validate.float(y2);
    R = [];
    R.push("<?xml version='1.0' standalone='no'?>");
    R.push(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${x1} ${y1} ${x2} ${y2}'>`);
    switch (type = type_of(content)) {
      case 'text':
        R.push(content);
        break;
      case 'list':
        R = R.concat(content);
        break;
      default:
        throw new Error(`^svgttf/_get_svg_from_glyphidx@3337^ expected a text or a list, got a ${type}`);
    }
    R.push("</svg>");
    return R.join('');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.svg_from_glyphidx = function(me, glyph_idx, size) {
    var pathelement;
    pathelement = this.pathelement_from_glyphidx(me, glyph_idx, size); //, transform
    /* TAINT derive coordinates from metrics */
    return this._get_svg(me, 0, -800, 1000, 1000, pathelement);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.svg_from_harfbuzz_linotype = function(me, harfbuzz_linotype, size) {
    var R, i, len, sort, transform, x, y;
    /* TAINT code duplication */
    validate.svgttf_harfbuzz_linotype(harfbuzz_linotype);
    x = 0;
    y = 0;
    R = [];
    for (i = 0, len = harfbuzz_linotype.length; i < len; i++) {
      sort = harfbuzz_linotype[i];
      transform = [['translate', x, y]];
      /* TAINT figure out relationship between size and upem */
      x += sort.x_advance * size;
      R.push('\n' + `<!--gid:${sort.gid}-->` + this.pathelement_from_glyphidx(me, sort.gid, size, transform));
    }
    R.push('\n');
    return this._get_svg(me, 0, -800, x, 1000, R);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.font_from_path = function(path) {
    var otjsfont;
    validate.nonempty_text(path);
    otjsfont = OT.loadSync(path);
    return {path, otjsfont};
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {})();
  }

  // test @
// await @_demo_opentypejs()
// test @[ "VNR sort 2" ]
// test @[ "VNR sort 3" ]
// @[ "VNR sort 3" ]()
// test @[ "test VNR._first_nonzero_is_negative()" ]

}).call(this);

//# sourceMappingURL=svgttf-next-version.js.map