(function() {
  'use strict';
  var CND, INTERTEXT, JAKE, _sh, after, alert, assign, async, badge, debug, defer, echo, execute, help, info, invoke, jr, rpr, sh, sync, task, urge, warn, whisper;

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

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  _sh = (require('exec-sh')).promise;

  //-----------------------------------------------------------------------------------------------------------
  sh = async function(...P) {
    var R, error;
    try {
      (R = (await _sh(...P)));
    } catch (error1) {
      error = error1;
      warn('^334^', error.message);
      return null;
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  invoke = async function(name, ...P) {
    return (await JAKE.Task[name].invoke(...P));
  };

  execute = async function(name, ...P) {
    return (await JAKE.Task[name].execute(...P));
  };

  //-----------------------------------------------------------------------------------------------------------
  task = function(name, ...P) {
    JAKE.desc(name);
    return JAKE.task(name, ...P);
  };

  //-----------------------------------------------------------------------------------------------------------
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

  //-----------------------------------------------------------------------------------------------------------
  task('B', function() {
    return new Promise(async function(resolve) {
      help('(B');
      return (await after(0.5, function() {
        warn('B)');
        return resolve();
      }));
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('C', {
    async: true
  }, async function() {
    help('(C');
    return (await after(0.5, function() {
      return warn('C)');
    }));
  });

  //-----------------------------------------------------------------------------------------------------------
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

  // task 'K', -> new Promise ( resolve ) ->
  //   help '(K'
  //   debug rpr ( k for k of JAKE.Task[ 'A' ]); process.exit 1
  //   await call 'A'
  //   await call 'B'
  //   await call 'A'
  //   await call 'B'
  //   await after 0.5, -> warn 'K)'; resolve()

  //-----------------------------------------------------------------------------------------------------------
  task('H', ['A', 'B'], function() {
    return new Promise(async function(resolve) {
      help('(H');
      return (await after(0.5, function() {
        warn('H)');
        return resolve();
      }));
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('git-updates', [
    'git-update-lib',
    // 'git-update-readmes'
    'git-update-dependencies',
    'git-status'
  ], function() {
    return new Promise(function(resolve) {
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('git-update-lib', function() {
    return new Promise(async function(resolve) {
      await sh(`git add --update lib dev/**/lib && git commit -m'update'`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('git-update-readmes', function() {
    return new Promise(async function(resolve) {
      await sh(`doctoc README* dev/**/README* && git add --update README* dev/**/README* && git commit -m'update docs'`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('git-update-dependencies', function() {
    return new Promise(async function(resolve) {
      await sh(`git add package* && git commit -m'update dependencies'`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('git-status', function() {
    return new Promise(async function(resolve) {
      await sh(`git status`);
      return resolve();
    });
  });

  /*
  doctoc README* && git add README* && git commit -m'update docs' && git push
  */
  //-----------------------------------------------------------------------------------------------------------
  task('intershop_npm_install', function() {
    return new Promise(async(resolve) => {
      await sh(`( cd intershop && npm install && npm audit )`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('gitcollector-show-commits', function() {
    return new Promise(async(resolve) => {
      await sh(`nodexh dev/gitcollector/lib/main.js | less -SR#5`);
      return resolve();
    });
  });

  //-----------------------------------------------------------------------------------------------------------
  task('benchmark', function(...P) {
    return new Promise((resolve) => {
      debug('^43^', P);
      // await sh """nodexh dev/gitcollector/lib/main.js | less -SR#5"""
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

//# sourceMappingURL=jakefile.js.map