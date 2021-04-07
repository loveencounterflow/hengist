(function() {
  'use strict';
  var CND, FS, PATH, badge, debug, demo_tempy_directory, demo_tempy_file, echo, glob, help, info, rpr, time_now, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEMPFILES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  FS = require('fs');

  PATH = require('path');

  glob = require('glob');

  //-----------------------------------------------------------------------------------------------------------
  time_now = function() {
    var t;
    t = process.hrtime();
    return `${t[0]}` + `${t[1]}`.padStart(9, '0');
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tempy_directory = function() {
    var TMP, do_work, prefix, trash;
    trash = require('trash');
    TMP = require('tempy');
    prefix = 'TEMPFILES-DEMO-';
    do_work = function(tmpdir_path) {
      info({tmpdir_path});
      FS.writeFileSync(PATH.join(tmpdir_path, 'somefile.db'), 'text');
      info(glob.sync(PATH.join(tmpdir_path, '**')));
      return 42;
    };
    (async() => {
      var tmpdir_path;
      try {
        tmpdir_path = null;
        help('before');
        debug(tmpdir_path = TMP.directory({
          name: 'abc.db',
          prefix
        }));
        help(do_work(tmpdir_path));
        help('after');
      } finally {
        info('^4484^', glob.sync(PATH.join(tmpdir_path, '**')));
        warn(`removing ${tmpdir_path}`);
        await trash(tmpdir_path);
        /* NOTE `trash` command is async, consider to `await` */        info('^4484^', glob.sync(PATH.join(tmpdir_path, '**')));
      }
      return null;
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_tempy_file = function() {
    var TMP, extension, trash;
    trash = require('trash');
    TMP = require('tempy');
    extension = 'db';
    (async() => {
      var tmpfile_path;
      try {
        tmpfile_path = null;
        help('before');
        debug(tmpfile_path = TMP.file({extension}));
        // debug tmpfile_path = TMP.file { name: 'fgsjdh.xy', }
        // help do_work tmpfile_path
        help('after');
      } finally {
        // info '^4484^', glob.sync PATH.join tmpfile_path, '**'
        warn(`removing ${tmpfile_path}`);
        await trash(tmpfile_path);
      }
// info '^4484^', glob.sync PATH.join tmpfile_path, '**'
/* NOTE `trash` command is async, consider to `await` */      return null;
    })();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_tempy_directory()
      return (await demo_tempy_file());
    })();
  }

}).call(this);

//# sourceMappingURL=tempfiles.js.map