(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, matchers, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/FS';

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
  test = require('../../../apps/guy-test');

  PATH = require('path');

  FS = require('fs');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({freeze} = require('letsfreezethat'));

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  matchers = {
    single: ["Ångström's", "éclair", "éclair's", "éclairs", "éclat", "éclat's", "élan", "élan's", "émigré", "émigré's"]
  };

  matchers.triple = [...matchers.single, ...matchers.single, ...matchers.single];

  matchers = freeze(matchers);

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() iterates once per default"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path);
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    debug('^3434^', result);
    if (T != null) {
      T.eq(result, matchers.single);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() can iterate given number of loops"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path, {
      loop_count: 3
    });
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result, matchers.triple);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() can iterate given number of lines 1"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path, {
      loop_count: 3,
      line_count: 12
    });
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result.length, 12);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.get_file_size"] = function(T, done) {
    var guy, path;
    guy = require(H.guy_path);
    path = 'short-proposal.mkts.md';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    (() => {      //.........................................................................................................
      return T != null ? T.eq(guy.fs.get_file_size(path), 405) : void 0;
    })();
    (() => {      //.........................................................................................................
      var error, result;
      error = null;
      try {
        result = guy.fs.get_file_size('no/such/path');
      } catch (error1) {
        error = error1;
        if (T != null) {
          T.ok((error.message.match(/no such file or directory/)) != null);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    (() => {      //.........................................................................................................
      var fallback;
      fallback = Symbol('fallback');
      if (T != null) {
        T.eq(guy.fs.get_file_size('no/such/path', fallback), fallback);
      }
      return T != null ? T.eq(guy.fs.get_file_size(path, fallback), 405) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs_get_content_hash = function(T, done) {
    var GUY, path;
    GUY = require(H.guy_path);
    path = 'short-proposal.mkts.md';
    path = PATH.resolve(PATH.join(__dirname, '../../../assets', path));
    (() => {      //.........................................................................................................
      var matcher, result;
      matcher = '2c244f1d168c54906';
      result = GUY.fs.get_content_hash(path);
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (() => {      //.........................................................................................................
      var matcher, result;
      matcher = '2c24';
      result = GUY.fs.get_content_hash(path, {
        length: 4
      });
      return T != null ? T.eq(result, matcher) : void 0;
    })();
    (() => {      //.........................................................................................................
      var error, result;
      error = null;
      try {
        result = GUY.fs.get_content_hash(path, {
          length: 400
        });
      } catch (error1) {
        error = error1;
        if (T != null) {
          T.ok((error.message.match(/unable to generate hash of length 400 using/)) != null);
        }
      }
      return T != null ? T.ok(error != null) : void 0;
    })();
    (() => {      //.........................................................................................................
      var foobar;
      path = 'NONEXISTANT';
      if (T != null) {
        T.eq(FS.existsSync(path), false);
      }
      if (T != null) {
        T.throws(/No such file or directory/, function() {
          return GUY.fs.get_content_hash(path);
        });
      }
      foobar = Symbol('foobar');
      return T != null ? T.eq(GUY.fs.get_content_hash(path, {
        fallback: foobar
      }), foobar) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs_walk_lines_yields_from_empty_file = function(T, done) {
    var GUY, chunk_size, i, id, j, len, line, lnr, matcher, path, paths, ref, result;
    GUY = require(H.guy_path);
    paths = [['fw', '../../../assets/a-few-words.txt'], ['ef', '../../../assets/datamill/empty-file.txt'], ['1n', '../../../assets/datamill/file-with-single-nl.txt'], ['3n', '../../../assets/datamill/file-with-3-lines-no-eofnl.txt'], ['3w', '../../../assets/datamill/file-with-3-lines-with-eofnl.txt']];
    //.........................................................................................................
    matcher = ["fw#1:Ångström's", "fw#2:éclair", "fw#3:éclair's", "fw#4:éclairs", "fw#5:éclat", "fw#6:éclat's", "fw#7:élan", "fw#8:élan's", "fw#9:émigré", "fw#10:émigré's", 'ef#1:', '1n#1:', '1n#2:', '3n#1:1', '3n#2:2', '3n#3:3', '3w#1:1', '3w#2:2', '3w#3:3', '3w#4:'];
//.........................................................................................................
    for (chunk_size = i = 1; i <= 200; chunk_size = i += +10) {
      result = [];
      for (j = 0, len = paths.length; j < len; j++) {
        [id, path] = paths[j];
        // whisper '^45-1^', '----------------------------------'
        path = PATH.resolve(PATH.join(__dirname, path));
        lnr = 0;
        ref = GUY.fs.walk_lines(path, {chunk_size});
        for (line of ref) {
          lnr++;
          result.push(`${id}#${lnr}:${line}`);
        }
      }
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @GUY_fs_walk_lines_with_custom_newline = ( T, done ) ->
  //   GUY     = require H.guy_path
  //   GUY.temp.with_file ({ path, }) ->
  //     FS.writeFileSync path, "foo𠀀𠀐bar𠀀𠀐baz𠀀𠀐"
  //     #.......................................................................................................
  //     # for chunk_size in [ 1 .. 5 ] by +1
  //     for chunk_size in [ 1 .. 1 ] by +1
  //       result  = []
  //       lnr     = 0
  //       for line from GUY.fs.walk_lines path, { chunk_size, newline: '𠀀𠀐', }
  //         lnr++
  //         debug '^4323^', "##{lnr}:#{line}"
  //         result.push "##{lnr}:#{line}"
  //       T?.eq result, [ '#1:foo', '#2:bar', '#3:baz', '#4:', ]
  //   #.........................................................................................................
  //   done?()
  //   return null

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @, { timeout: 5000, }
      // test @[ "guy.fs.walk_circular_lines() can iterate given number of loops" ]
      // test @[ "guy.fs.get_content_hash" ]
      // @[ "guy.fs.get_content_hash" ]()
      // test @[ "guy.props.def(), .hide()" ]
      // @[ "configurator" ]()
      // test @[ "await with async steampipes" ]
      // test @[ "nowait with async steampipes" ]
      // test @[ "use-call" ]
      // @[ "await with async steampipes" ]()
      // @[ "demo" ]()
      // @[ "nowait" ]()
      // @GUY_fs_walk_lines_with_custom_newline()
      // test @GUY_fs_walk_lines_with_custom_newline
      // @GUY_fs_walk_lines_yields_from_empty_file()
      return test(this.GUY_fs_walk_lines_yields_from_empty_file);
    })();
  }

  // @GUY_fs_get_content_hash()
// test @GUY_fs_get_content_hash

}).call(this);

//# sourceMappingURL=fs.tests.js.map