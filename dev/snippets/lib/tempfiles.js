(function() {
  'use strict';
  var CND, FS, PATH, TEMP, UTIL, badge, data, debug, demo_temp, demo_tempy_directory, demo_tempy_file, echo, glob, help, info, rpr, temp, time_now, urge, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  demo_temp = function() {};

  TEMP = require('temp');

  FS = require('fs');

  UTIL = require('util');

  data = "foo\nbar\nfoo\nbaz";

  // exec  = ( require 'child_process' ).exec
  // Automatically track and cleanup files at exit
  // TEMP.track()
  TEMP.cleanupSync();

  debug(temp = TEMP.openSync({
    dir: '/dev/shm',
    prefix: 'dbay-',
    suffix: '.sqlite'
  }));

  FS.writeSync(temp.fd, data);

  debug(rpr(FS.readFileSync(temp.path, {
    encoding: 'utf-8'
  })));

  //   if (!err) {
  //     fs.write(info.fd, data, (err) => {
  //         console.log(err)
  //     })
  //     fs.close(info.fd, function(err) {
  //       exec("grep foo '" + info.path + "' | wc -l", function(err, stdout) {
  //         util.puts(stdout.trim())
  //   return null

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // await demo_tempy_directory()
      // await demo_tempy_file()
      return demo_temp();
    })();
  }

}).call(this);

//# sourceMappingURL=tempfiles.js.map