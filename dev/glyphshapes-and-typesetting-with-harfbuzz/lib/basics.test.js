(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, echo, help, info, isa, jr, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DATOM/TESTS/BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  //...........................................................................................................
  PATH = require('path');

  FS = require('fs');

  types = new (require('intertype')).Intertype();

  ({isa, validate, type_of} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this["HB.shape_text() fails on nonexisting font file"] = async function(T, done) {
    var HB, error, i, k, len, matcher, probe, probes_and_matchers;
    HB = require('../../../apps/glyphshapes-and-typesetting-with-harfbuzz');
    probes_and_matchers = [
      [
        {
          text: 'x',
          font: {
            path: 'nosuchfile'
          }
        },
        null,
        "hb-shape: Couldn't read or find nosuchfile, or it was empty."
      ]
    ];
    //.........................................................................................................
    debug('^3344^', (function() {
      var results;
      results = [];
      for (k in HB) {
        results.push(k);
      }
      return results;
    })());
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d;
          d = HB.shape_text(probe);
          resolve(d);
          return null;
        });
      });
    }
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["RBW.register_font(), RBW.font_register_is_free()"] = function(T, done) {
    var RBW, check_font_registers, font, register_font;
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    font = {};
    // font.path       = 'Ubuntu-R.ttf'
    font.path = 'EBGaramond12-Italic.otf';
    font.path = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts', font.path));
    font.idx = 12;
    //.........................................................................................................
    (register_font = () => {
      var font_bytes, font_bytes_hex, matcher, result;
      font_bytes = FS.readFileSync(font.path);
      font_bytes_hex = font_bytes.toString('hex');
      result = RBW.register_font(font.idx, font_bytes_hex);
      matcher = void 0;
      return T.eq(result, matcher);
    })();
    //.........................................................................................................
    (check_font_registers = () => {
      /* TAINT result will depend on not using font indexes 10 and 13 in this test suite as RBW is stateful */
      var idx, matcher, result;
      result = (function() {
        var i, ref, ref1, results;
        results = [];
        for (idx = i = ref = font.idx - 1, ref1 = font.idx + 1; (ref <= ref1 ? i <= ref1 : i >= ref1); idx = ref <= ref1 ? ++i : --i) {
          results.push(RBW.font_register_is_free(idx));
        }
        return results;
      })();
      matcher = [true, false, true];
      debug('^7483^', result);
      return T.eq(result, matcher);
    })();
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["RBW.shape_text()"] = function(T, done) {
    var RBW, font, register_font, shape_text_json, text;
    T.halt_on_error();
    RBW = require('../../../apps/rustybuzz-wasm/pkg');
    font = {};
    // font.path       = 'Ubuntu-R.ttf'
    font.path = 'EBGaramond12-Italic.otf';
    font.path = PATH.resolve(PATH.join(__dirname, '../../../assets/jizura-fonts', font.path));
    font.idx = 12;
    text = "Jack jumped over the lazy fox";
    //.........................................................................................................
    (register_font = () => {
      var font_bytes, font_bytes_hex;
      font_bytes = FS.readFileSync(font.path);
      font_bytes_hex = font_bytes.toString('hex');
      return RBW.register_font(font.idx, font_bytes_hex);
    })();
    //.........................................................................................................
    (shape_text_json = () => {
      var format, result;
      format = 'json';
      result = RBW.shape_text({
        format,
        text,
        font_idx: font.idx
      });
      return debug('^4456^', format, result);
    })();
    // T.eq result, matcher
    //.........................................................................................................
    done();
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "RBW.register_font()" ] = ( T, done ) ->
  //   RBW             = require '../../../apps/rustybuzz-wasm/pkg'
  //   font            = {}
  //   font.path       = PATH.resolve PATH.join __dirname, '../../../assets/jizura-fonts/Ubuntu-R.ttf'
  //   font.idx        = 12
  //   font_bytes      = FS.readFileSync font.path
  //   font_bytes_hex  = font_bytes.toString 'hex'
  //   result          = RBW.register_font font.idx, font_bytes_hex
  //   matcher         = undefined
  //   T.eq result, matcher
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this["RBW use npm package"] = function(T, done) {
    var RBW, SEMVER, install_with_cli_and_require, k, v;
    // RBW             = require '/tmp/rustybuzz-npm/node_modules/.pnpm/rustybuzz-wasm@0.1.2/node_modules/rustybuzz-wasm'
    SEMVER = require('semver');
    //.........................................................................................................
    install_with_cli_and_require = function(package_name) {
      var CP, command;
      CP = require('child_process');
      command = `pnpm install ${package_name}`;
      CP.execSync(command, {
        stdio: 'inherit'
      });
      return require(package_name);
    };
    //.........................................................................................................
    // await install_with_npm 'rustybuzz-wasm'
    RBW = install_with_cli_and_require('rustybuzz-wasm');
    for (k in RBW) {
      v = RBW[k];
      if (k.startsWith('_')) {
        continue;
      }
      if (!isa.function(v)) {
        continue;
      }
      info(k);
    }
    //.........................................................................................................
    T.ok(isa.function(RBW.register_font));
    T.ok(isa.function(RBW.font_register_is_free));
    T.ok(isa.function(RBW.shape_text));
    T.ok(isa.function(RBW.glyph_to_svg_pathdata));
    T.ok(isa.function(RBW.wrap_text_with_arbitrary_slabs));
    T.ok(isa.function(RBW.find_line_break_positions));
    T.ok(SEMVER.satisfies((require('rustybuzz-wasm/package.json')).version, '>=0.1.2'));
    //.........................................................................................................
    done();
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @[ "RBW.register_font(), RBW.font_register_is_free()" ]
      // test @[ "RBW.shape_text()" ]
      return test(this["RBW use npm package"], {
        timeout: 50e3
      });
    })();
  }

}).call(this);

//# sourceMappingURL=basics.test.js.map