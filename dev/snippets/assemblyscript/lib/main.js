(function() {
  'use strict';
  var ASLOADER, CND, FS, FSP, PATH, alert, badge, debug, echo, help, info, join_paths, load_wasm_async, load_wasm_streaming, load_wasm_sync, promisify, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'FILEWATCHER/MAIN';

  rpr = CND.rpr;

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  alert = CND.get_logger('alert', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  FS = require('fs');

  FSP = require('fs/promises');

  PATH = require('path');

  ASLOADER = require('@assemblyscript/loader');

  // { AsBind, }               = require 'as-bind'
  join_paths = function(...P) {
    return PATH.resolve(PATH.join(...P));
  };

  ({promisify} = require('util'));

  // AsBind = require("as-bind");
  // CAT                       = require 'multimix/lib/cataloguing'
  // debug '^324323^', AsBind
  // # debug '^324323^', ( CAT.all_keys_of AsBind )
  // debug '^324323^', ( CAT.all_keys_of AsBind )
  // debug '^324323^', ( CAT.all_keys_of new AsBind() )
  // process.exit 1
  // wasm = fs.readFileSync("./path-to-my-wasm.wasm");
  // asyncTask = async () => {
  //   asBindInstance = await AsBind.instantiate(wasm);

  //-----------------------------------------------------------------------------------------------------------
  load_wasm_sync = function(path) {
    var imports, src, wasm;
    src = FS.readFileSync(path);
    imports = {}; // imports go here
    wasm = ASLOADER.instantiateSync(src, imports);
    info(wasm.exports.add(123, 456));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  load_wasm_async = async function(path) {
    var __getString, __newString, concat, imports, k, src, wasm;
    // asBind  = new AsBind()
    src = (await FSP.readFile(path));
    imports = {}; // imports go here
    wasm = (await ASLOADER.instantiate(src, imports));
    // wasm    = await AsBind.instantiate src, imports
    debug('^334534^', wasm.module);
    debug('^334534^', (function() {
      var results;
      results = [];
      for (k in wasm.module) {
        results.push(k);
      }
      return results;
    })());
    debug('^334534^', wasm.instance);
    debug('^334534^', (function() {
      var results;
      results = [];
      for (k in wasm.instance) {
        results.push(k);
      }
      return results;
    })());
    info(wasm.exports.add(123, 456));
    info(wasm.exports.add(123, '456'));
    info(wasm.exports.add('123', '456'));
    info(wasm.exports.add('???', '456'));
    info(wasm.exports.add('???', '456', 0));
    ({__newString, __getString} = wasm.exports);
    concat = (a, b) => {
      var a_ptr, b_ptr, c_ptr;
      a_ptr = __newString(a);
      b_ptr = __newString(b);
      c_ptr = wasm.exports.concat(a_ptr, b_ptr);
      debug('^445-1^', c_ptr);
      debug('^445-2^', __getString(c_ptr));
      // debug '^445-3^', __getString c_ptr + 1
      debug('^445-4^', __getString(c_ptr + 2));
      return __getString(c_ptr);
    };
    info(concat('123', '456'));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  load_wasm_streaming = async function(path) {
    var imports, src, wasm;
    src = FS.createReadStream(path);
    // src     = -> new Promise ( resolve ) => resolve FS.createReadStream path
    imports = {}; // imports go here
    wasm = (await ASLOADER.instantiate(src, imports));
    info(wasm.exports.add(123, 456));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  if (module === require.main) {
    (async() => {
      var path;
      // path  = PATH.resolve PATH.join __dirname, '../build/untouched.wasm'
      // path  = PATH.resolve PATH.join __dirname, '../build/optimized.wasm'
      path = join_paths(__dirname, '../build/quick.wasm');
      load_wasm_sync(path);
      return (await load_wasm_async(path));
    })();
  }

  // await load_wasm_streaming path

}).call(this);

//# sourceMappingURL=main.js.map