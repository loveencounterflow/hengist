(function() {
  //###########################################################################################################
  var CND, FS, H, PATH, alert, badge, debug, echo, help, info, log, rpr, test, urge, warn, whisper;

  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS';

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
  test = require('guy-test');

  H = require('./helpers');

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["demo"] = function(T, done) {
    var createRequire, guy, guy_realpath, rq;
    ({createRequire} = require('module'));
    guy_realpath = require.resolve(H.guy_path);
    guy_realpath = PATH.join(guy_realpath, 'whatever');
    /* H.guy_path points to pkg folder, must be one element deeper */    debug('^7665^', {guy_realpath});
    rq = createRequire(guy_realpath);
    guy = require(H.guy_path);
    urge('^83443^', H.guy_path);
    help('^83443^', rq.resolve('cnd'));
    help('^83443^', rq.resolve('intertype'));
    help('^83443^', rq.resolve('deasync'));
    // help '^83443^', rq.resolve 'frob'
    // help '^83443^', rq.resolve 'steampipes'
    debug('340^', guy);
    debug('340^', guy.nowait);
    debug('340^', guy);
    debug('340^', guy.nowait);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["nowait"] = function(T, done) {
    var frob_async, frob_sync, guy, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    result.push('nw1');
    //.........................................................................................................
    frob_async = function(...P) {
      return new Promise((resolve) => {
        if (T != null) {
          T.eq(P, [1, 2, 3]);
        }
        result.push('fa1');
        return guy.async.after(0.25, function() {
          warn('^455-1^', "frob_async done");
          result.push('fa2');
          return resolve('fa3');
        });
      });
    };
    //.........................................................................................................
    frob_sync = guy.nowait.for_awaitable(frob_async);
    // frob_sync = frob_async
    result.push(frob_sync(1, 2, 3));
    result.push('nw2');
    info('^455-3^', "call to frob_sync done");
    debug('^455-x^', result);
    if (T != null) {
      T.eq(result, ['nw1', 'fa1', 'fa2', 'fa3', 'nw2']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["await with async steampipes"] = async function(T, done) {
    var $, $async, $drain, $show, SP, f_async, guy, result, trace;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    SP = require('steampipes');
    ({$, $async, $show, $drain} = SP.export());
    trace = [];
    trace.push('m1');
    //.........................................................................................................
    f_async = () => {
      return new Promise((resolve) => {
        var pipeline, source;
        source = [1, 2, 3];
        pipeline = [];
        pipeline.push(source);
        pipeline.push($async((d, send, done) => {
          trace.push('fa1');
          return guy.async.after(0.25, () => {
            trace.push('fa2');
            send(d ** 2);
            return done();
          });
        }));
        pipeline.push($show());
        pipeline.push($drain(function(collector) {
          debug('^4576^', collector);
          return resolve(collector);
        }));
        return SP.pull(...pipeline);
      });
    };
    //.........................................................................................................
    trace.push('m2');
    result = (await f_async());
    trace.push('m3');
    info('^8876^', trace);
    if (T != null) {
      T.eq(result, [1, 4, 9]);
    }
    if (T != null) {
      T.eq(trace, ['m1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["nowait with async steampipes"] = function(T, done) {
    var $, $async, $drain, $show, SP, f_async, guy, result, trace;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    SP = require('steampipes');
    ({$, $async, $show, $drain} = SP.export());
    trace = [];
    trace.push('m1');
    //.........................................................................................................
    f_async = () => {
      return new Promise((resolve) => {
        var pipeline, source;
        source = [1, 2, 3];
        pipeline = [];
        pipeline.push(source);
        pipeline.push($async((d, send, done) => {
          trace.push('fa1');
          return guy.async.after(0.25, () => {
            trace.push('fa2');
            send(d ** 2);
            return done();
          });
        }));
        pipeline.push($show());
        pipeline.push($drain(function(collector) {
          debug('^4576^', collector);
          return resolve(collector);
        }));
        return SP.pull(...pipeline);
      });
    };
    //.........................................................................................................
    trace.push('m2');
    result = (guy.nowait.for_awaitable(f_async))();
    trace.push('m3');
    info('^8876^', trace);
    if (T != null) {
      T.eq(result, [1, 4, 9]);
    }
    if (T != null) {
      T.eq(trace, ['m1', 'm2', 'fa1', 'fa2', 'fa1', 'fa2', 'fa1', 'fa2', 'm3']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @, { timeout: 5000, }
      // test @[ "await with async steampipes" ]
      return test(this["nowait with async steampipes"]);
    })();
  }

  // @[ "await with async steampipes" ]()
// @[ "demo" ]()
// @[ "nowait" ]()

}).call(this);

//# sourceMappingURL=main.tests.js.map