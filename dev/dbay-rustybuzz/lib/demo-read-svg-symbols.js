(function() {
  'use strict';
  var CND, FS, PATH, SQL, badge, debug, echo, equals, help, info, isa, rpr, symbols_path, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  symbols_path = PATH.resolve(PATH.join(__dirname, '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg'));

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_read_svg_symbols = function() {
    var Svgttf2, _, d, path, result, svg, svgttf2, sym_name;
    ({Svgttf2} = require('../../../apps/svgttf/lib/svgttf-next'));
    svgttf2 = new Svgttf2();
    path = '../../../apps-typesetting/html+svg-demos/symbols-for-special-chrs.svg';
    path = PATH.resolve(PATH.join(__dirname, path));
    svg = FS.readFileSync(path, {
      encoding: 'utf-8'
    });
    result = svgttf2.glyf_pathdata_from_svg({path, svg});
    for (sym_name in result) {
      _ = result[sym_name];
      whisper(sym_name);
    }
    for (_ in result) {
      d = result[_];
      echo(d.pd);
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.demo_read_svg_symbols();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-read-svg-symbols.js.map