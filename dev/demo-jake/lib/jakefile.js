(function() {
  'use strict';
  var CND, INTERTEXT, JAKE, after, alert, assign, async, badge, call, debug, defer, desc, echo, execute, help, info, invoke, jr, rpr, sh, sync, task, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'JAKE-DEMO';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  ({jr} = CND);

  assign = Object.assign;

  after = function(time_s, f) {
    return setTimeout(f, time_s * 1000);
  };

  defer = setImmediate;

  async = {};

  sync = {
    concurrency: 1
  };

  // async                     = { async: true, }
  //...........................................................................................................
  // types                     = require '../types'
  // { isa
  //   validate
  //   cast
  //   type_of }               = types
  JAKE = require('jake');

  ({desc, task} = JAKE);

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  sh = (require('exec-sh')).promise;

  //-----------------------------------------------------------------------------------------------------------
  invoke = async function(name, ...P) {
    return (await JAKE.Task[name].invoke(...P));
  };

  execute = async function(name, ...P) {
    return (await JAKE.Task[name].execute(...P));
  };

  call = async function(name, ...P) {
    return (await JAKE.Task[name](...P));
  };

  desc('A');

  task('A', {
    async: true
  }, function() {
    return new Promise(async function(resolve) {
      help('(A');
      return (await after(0.5, function() {
        warn('A)');
        return resolve();
      }));
    });
  });

  desc('B');

  task('B', function() {
    return new Promise(async function(resolve) {
      help('(B');
      return (await after(0.5, function() {
        warn('B)');
        return resolve();
      }));
    });
  });

  desc('C');

  /* TAINT jake does not wait for completion, must use Promise */  task('C', {
    async: true
  }, async function() {
    help('(C');
    return (await after(0.5, function() {
      return warn('C)');
    }));
  });

  desc('G');

  task('G', function() {
    return new Promise(async function(resolve) {
      help('(G');
      await execute('A');
      await execute('B');
      await execute('A');
      await execute('B');
      return (await after(0.5, function() {
        warn('G)');
        return resolve();
      }));
    });
  });

  // desc 'K'
  // task 'K', -> new Promise ( resolve ) ->
  //   help '(K'
  //   debug rpr ( k for k of JAKE.Task[ 'A' ]); process.exit 1
  //   await call 'A'
  //   await call 'B'
  //   await call 'A'
  //   await call 'B'
  //   await after 0.5, -> warn 'K)'; resolve()
  desc('H');

  task('H', ['A', 'B'], function() {
    return new Promise(async function(resolve) {
      help('(H');
      return (await after(0.5, function() {
        warn('H)');
        return resolve();
      }));
    });
  });

  desc('git-updates');

  task('git-updates', function() {
    return new Promise(async function(resolve) {
      await sh(``);
      return resolve();
    });
  });

  desc('git-update-lib');

  task('git-update-lib', function() {
    return new Promise(async function(resolve) {
      await sh(`git add --dry-run --update lib dev/**/lib`);
      // await sh """git add --update lib dev/**/lib && git commit -m'update'"""
      return resolve();
    });
  });

  desc('git-status');

  task('git-status', function() {
    return new Promise(async function(resolve) {
      await sh(`git status`);
      return resolve();
    });
  });

  /*
  git add lib && git commit -m'update' && git status
  git add --update lib dev/ ** /lib && git commit -m'update' && git status
  git add package* && git commit -m'update dependencies'
  doctoc README* && git add README* && git commit -m'update docs' && git push
  */
  // #===========================================================================================================
  // #
  // #-----------------------------------------------------------------------------------------------------------
  // desc "whatever"
  // task 'default', -> new Promise ( resolve ) =>
  //   whisper rpr ( k for k of JAKE.Task ).sort()
  //   await after 0.5, -> resolve 42

  // #-----------------------------------------------------------------------------------------------------------
  // desc "demo async with await"
  // task 'demo_async_with_await', sync, ->
  //   urge "demo_async_with_await"
  //   await after 0.5, -> new Promise ( resolve ) =>
  //     info "demo_async_with_await ok"
  //     resolve()

  // #-----------------------------------------------------------------------------------------------------------
  // desc "demo async with promise resolve"
  // task 'demo_async_with_promise_resolve', [], sync, -> new Promise ( resolve ) =>
  //   urge "demo_async_with_promise_resolve"
  //   after 0.5, =>
  //     info "demo_async_with_promise_resolve ok"
  //     resolve()

  // #-----------------------------------------------------------------------------------------------------------
  // desc "demo async with promise resolve 2"
  // task 'demo_async_with_promise_resolve_2', [], -> new Promise ( resolve ) =>
  //   urge "demo_async_with_promise_resolve_2"
  //   after 0.5, =>
  //     info "demo_async_with_promise_resolve_2 ok"
  //     resolve()

  // #-----------------------------------------------------------------------------------------------------------
  // desc "demo sync with async dependency"
  // task 'demo_sync', sync, ->
  //   await invoke 'demo_async_with_await'
  //   await invoke 'demo_async_with_promise_resolve'
  //   await invoke 'demo_async_with_promise_resolve_2'
  //   await invoke 'f'
  //   info "demo_sync"
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // desc "demo sync with async dependency using execute"
  // task 'demo_sync_using_execute', sync, ->
  //   await execute 'demo_async_with_await'
  //   await execute 'demo_async_with_await'
  //   await execute 'demo_async_with_promise_resolve'
  //   await execute 'demo_async_with_promise_resolve_2'
  //   await execute 'f'
  //   info "demo_sync"
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // desc "failing demo sync with async dependency"
  // task 'demo_sync_fails', [ 'demo_async', ], sync, ->
  //   info "demo_sync_fails"
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  desc("install all npm dependencies");

  task('intershop_npm_install', function() {
    return new Promise(async(resolve) => {
      await sh(`( cd intershop && npm install && npm audit )`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("devcycle");

  task('devcycle', [], function() {
    return new Promise(async(resolve) => {
      await sh(`( cd ~/jzr/intershop && coffee --map -o intershop_modules -c intershop_modules )`);
      await sh(`intershop refresh-mirage-datasources`);
      await sh(`intershop psql -c "select * from MIRAGE.mirror order by dsk, dsnr, linenr;\"`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  desc("demo command");

  task('f', [], function() {
    return new Promise((resolve) => {
      debug('^33365^', process.argv);
      invoke('default', 42);
      // process.argv.pop()
      // debug '^33365^', process.argv
      return resolve();
    });
  });

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await @benchmark()
      return null;
    })();
  }

}).call(this);
