(function() {
  'use strict';
  var GUY, H, alert, debug, echo, equals, guy, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/STREAMS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_readstream_as_source = async function(T, done) {
    var Async_pipeline, FS, PATH, Pipeline, TF, get_source, matcher, path, result;
    // T?.halt_on_error()
    PATH = require('path');
    FS = require('fs');
    GUY = require('../../../apps/guy');
    ({
      Pipeline,
      Async_pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    FS = require('node:fs');
    path = PATH.join(__dirname, '../../../assets/short-proposal.mkts.md');
    get_source = function() {
      return FS.createReadStream(path); //, { encoding: 'utf-8', }
    };
    //.......................................................................................................
    matcher = (() => {
      var _matcher, count, line, ref;
      count = 0;
      _matcher = [];
      ref = GUY.fs.walk_lines(path);
      for (line of ref) {
        count++;
        if (count > 5) {
          continue;
        }
        info(count, rpr(line));
        _matcher.push(line);
      }
      return _matcher;
    })();
    //.......................................................................................................
    result = (await (async() => {
      var p, show;
      p = new Async_pipeline();
      debug('^34-2^', p);
      p.push(get_source());
      // p.push 'rtethg'
      p.push(TF.$split_lines());
      p.push(TF.$limit(5));
      p.push(show = function(d) {
        return urge('^34-3^', rpr(d));
      });
      help('^34-3^', p);
      return (await p.run());
    })());
    //.........................................................................................................
    if (T != null) {
      T.eq(result, matcher);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_writestream_as_target_1 = async function(T, done) {
    var $, Async_pipeline, FS, last, p, source;
    // T?.halt_on_error()
    FS = require('node:fs');
    GUY = require('../../../apps/guy');
    ({Async_pipeline, $} = require('../../../apps/moonriver'));
    last = Symbol('last');
    source = "ファイルに書きたいテキストです。";
    p = new Async_pipeline();
    //.........................................................................................................
    await GUY.temp.with_file({
      keep: false
    }, async function(temp) {
      var output, result, written_text, x;
      output = FS.createWriteStream(temp.path, {
        encoding: 'utf-8'
      });
      debug(temp.path);
      //.......................................................................................................
      p.push(source);
      //.......................................................................................................
      p.push(async function(d) {
        return (await new Promise(function(resolve) {
          return output.write(d, function() {
            // info '^342^', output.bytesWritten
            return resolve();
          });
        }));
      });
      //.......................................................................................................
      p.push($({last}, async function(d) {
        if (d !== last) {
          return null;
        }
        await output.end();
        await output.close();
        return null;
      }));
      p.push(function(d) {
        return help('^45-2^', rpr(d));
      });
      // p.push output
      //.......................................................................................................
      result = (await p.run());
      result = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = result.length; i < len; i++) {
          x = result[i];
          results.push(x.toString());
        }
        return results;
      })()).join('');
      written_text = FS.readFileSync(temp.path, {
        encoding: 'utf-8'
      });
      if (T != null) {
        T.eq(result, source);
      }
      if (T != null) {
        T.eq(written_text, source);
      }
      return info('^45-2^', result);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_writestream_as_target_3 = async function(T, done) {
    var Async_pipeline, FS, p, source;
    // T?.halt_on_error()
    FS = require('node:fs');
    GUY = require('../../../apps/guy');
    ({Async_pipeline} = require('../../../apps/moonriver'));
    source = "ファイルに書きたいテキストです。";
    p = new Async_pipeline();
    //.........................................................................................................
    await GUY.temp.with_file({
      keep: false
    }, async function(temp) {
      var output, result, written_text;
      output = FS.createWriteStream(temp.path, {
        encoding: 'utf-8'
      });
      debug(temp.path);
      //.......................................................................................................
      p.push(source);
      p.push(function(d) {
        return help('^45-2^', rpr(d));
      });
      p.push(output);
      //.......................................................................................................
      result = (await p.run());
      result = result.join('');
      written_text = FS.readFileSync(temp.path, {
        encoding: 'utf-8'
      });
      if (T != null) {
        T.eq(result, source);
      }
      if (T != null) {
        T.eq(written_text, source);
      }
      return info('^45-2^', result);
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.writestream_accepts_buffers = async function(T, done) {
    var Async_pipeline, FS, p, source;
    // T?.halt_on_error()
    FS = require('node:fs');
    GUY = require('../../../apps/guy');
    ({Async_pipeline} = require('../../../apps/moonriver'));
    source = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    p = new Async_pipeline();
    //.........................................................................................................
    await GUY.temp.with_file({
      keep: false
    }, async function(temp) {
      var d, matcher, output, result, written_text;
      output = FS.createWriteStream(temp.path, {
        encoding: 'utf-8'
      });
      debug(temp.path);
      //.......................................................................................................
      p.push(source);
      p.push(function(d) {
        return help('^47-1^', rpr(d));
      });
      p.push(function(d, send) {
        return send(Buffer.from(rpr(d)));
      });
      p.push(function(d) {
        return urge('^47-2^', rpr(d));
      });
      p.push(output);
      //.......................................................................................................
      matcher = ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = source.length; i < len; i++) {
          d = source[i];
          results.push(rpr(d));
        }
        return results;
      })()).join('');
      result = (await p.run());
      result = result.join('');
      written_text = FS.readFileSync(temp.path, {
        encoding: 'utf-8'
      });
      if (T != null) {
        T.eq(result, matcher);
      }
      if (T != null) {
        T.eq(written_text, matcher);
      }
      info('^47-3^', rpr(matcher));
      info('^47-4^', rpr(result));
      return info('^47-5^', rpr(written_text));
    });
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @window_transform()
      // await @can_use_readstream_as_source()
      // @can_use_writestream_as_target_1()
      // test @can_use_writestream_as_target_1
      return this.can_use_readstream_as_source();
    })();
  }

  // test @can_use_readstream_as_source
// await @can_use_writestream_as_target_2()
// @can_use_writestream_as_target_3()
// await @writestream_accepts_buffers()
// await test @writestream_accepts_buffers
// test @

}).call(this);

//# sourceMappingURL=test-streams.js.map