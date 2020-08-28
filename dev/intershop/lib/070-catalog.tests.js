(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, help, info, resolve_project_path, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'INTERSHOP/TESTS/070-CATALOG';

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

  //###########################################################################################################
  if (require.main === module) {
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

//# sourceMappingURL=070-catalog.tests.js.map